import { readFile, writeFile } from 'node:fs/promises'
import { sdk } from './sdk'

export type LogIssueCategory =
  | 'db-disk'
  | 'fatal-oom'
  | 'jwt-auth'
  | 'engine-api'
  | 'clock-drift'
  | 'high-load'
  | 'other-error'

export type LogHealthAssessment =
  | { kind: 'clean' }
  | {
      kind: 'warning' | 'failure'
      category: LogIssueCategory
      count: number
      latestLine: string
    }

export type PersistedLogSummary = {
  startedAt: string
  updatedAt: string
  linesScanned: number
  benignIgnored: number
  windowMinutes: number
  status: 'clean' | 'warning' | 'failure'
  activeCategory: LogIssueCategory | null
  activeCount: number
  categories: Record<
    LogIssueCategory,
    { recent: number; total: number; lastSeen: string | null }
  >
  recentLines: { time: string; category: LogIssueCategory; line: string }[]
}

const WINDOW_15M_MS = 15 * 60_000
const WINDOW_5M_MS = 5 * 60_000
const MAX_RECENT_LINES = 12
const PERSIST_THROTTLE_MS = 15_000
const CLEAN_PERSIST_INTERVAL_MS = 5 * 60_000
const ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]/g

const ALL_CATEGORIES: readonly LogIssueCategory[] = [
  'db-disk',
  'fatal-oom',
  'jwt-auth',
  'engine-api',
  'clock-drift',
  'high-load',
  'other-error',
]

// Known benign lines Nimbus emits during normal StartOS operation.
const BENIGN_PATTERNS: readonly RegExp[] = [
  /Should not use --nat:none option/i,
  /No public IP address found\.\s*Should not use --nat:none/i,
  /Peer count low, no new peers discovered/i,
]

const DB_DISK_RE =
  /SQLiteError|database disk image is malformed|disk I\/O error|no space left on device|ENOSPC|EROFS|read-only file system|database is locked/i
const FATAL_OOM_RE =
  /(?:^|\s)FTL\s|out of memory|cannot allocate memory|ENOMEM/i
const JWT_AUTH_RE =
  /(?:401|unauthorized|invalid (?:jwt|token)|jwt.*(?:invalid|expired|missing|error|mismatch))/i
const ENGINE_API_RE =
  /(?:el_manager|engine_api|eth1|newPayload|forkchoiceUpdated|getPayload|execution client|Engine API).*(?:error|failed|timeout|refused|unreachable|unavailable|invalid)/i
const CLOCK_TEXT_RE =
  /(?:clock\s*(?:skew|drift|behind|ahead)|system time|slot in the future|time drift)/i

const SLOT_DELAY_RE = /\bdelay=([0-9a-zA-Z.]+)/

/**
 * Parse a Nimbus duration string like `542ms398us`, `2s13ms`, `1m04s` into
 * milliseconds. Returns null if unparseable.
 */
export function parseNimbusDurationMs(raw: string): number | null {
  let totalMs = 0
  let matched = false
  for (const [, numStr, unit] of raw.matchAll(
    /(\d+(?:\.\d+)?)(ns|us|ms|s|m|h|d)/g,
  )) {
    matched = true
    const n = Number(numStr)
    if (!Number.isFinite(n)) return null
    if (unit === 'd') totalMs += n * 86_400_000
    else if (unit === 'h') totalMs += n * 3_600_000
    else if (unit === 'm') totalMs += n * 60_000
    else if (unit === 's') totalMs += n * 1_000
    else if (unit === 'ms') totalMs += n
    else if (unit === 'us') totalMs += n / 1_000
    else if (unit === 'ns') totalMs += n / 1_000_000
  }
  return matched ? totalMs : null
}

function isErrorOrWarning(line: string): 'err' | 'wrn' | 'ftl' | null {
  if (/(?:^|\s)FTL\s/.test(line)) return 'ftl'
  if (/(?:^|\s)ERR\s/.test(line)) return 'err'
  if (/(?:^|\s)WRN\s/.test(line)) return 'wrn'
  return null
}

function summarizeLine(line: string): string {
  const cleaned = line.replace(/\s+/g, ' ').trim()
  return cleaned.length > 200 ? `${cleaned.slice(0, 197)}...` : cleaned
}

export function logHealthFilePath(): string {
  return sdk.volumes.config.subpath('log-health.json')
}

export async function readPersistedLogSummary(): Promise<PersistedLogSummary | null> {
  try {
    const raw = await readFile(logHealthFilePath(), 'utf8')
    return JSON.parse(raw) as PersistedLogSummary
  } catch {
    return null
  }
}

type TimedEvent = {
  time: number
  category: LogIssueCategory
  line: string
}

export class LogHealthMonitor {
  private buffer = ''
  private readonly startedAt = new Date().toISOString()
  private linesScanned = 0
  private benignIgnored = 0
  private events: TimedEvent[] = []
  private recentLines: {
    time: string
    category: LogIssueCategory
    line: string
  }[] = []
  private totals: Record<
    LogIssueCategory,
    { total: number; lastSeen: string | null }
  > = {
    'db-disk': { total: 0, lastSeen: null },
    'fatal-oom': { total: 0, lastSeen: null },
    'jwt-auth': { total: 0, lastSeen: null },
    'engine-api': { total: 0, lastSeen: null },
    'clock-drift': { total: 0, lastSeen: null },
    'high-load': { total: 0, lastSeen: null },
    'other-error': { total: 0, lastSeen: null },
  }
  private notified = new Set<LogIssueCategory>()
  private dirty = true
  private lastPersistAt = 0
  private lastPersistedLines = 0
  private persisting = false

  feed(chunk: string | Buffer): void {
    this.buffer += (typeof chunk === 'string' ? chunk : chunk.toString('utf8'))
      .replace(ANSI_RE, '')
      .replace(/\r/g, '\n')
    let idx = this.buffer.indexOf('\n')
    while (idx !== -1) {
      const line = this.buffer.slice(0, idx).trim()
      this.buffer = this.buffer.slice(idx + 1)
      if (line) this.inspectLine(line)
      idx = this.buffer.indexOf('\n')
    }
    if (this.buffer.length > 4096) this.buffer = this.buffer.slice(-2048)
  }

  private inspectLine(line: string): void {
    this.linesScanned++
    const now = Date.now()

    if (BENIGN_PATTERNS.some((re) => re.test(line))) {
      this.benignIgnored++
      return
    }

    const level = isErrorOrWarning(line)

    // Check sustained high slot delay on Slot start lines only once synced —
    // during forward sync, backfill, or Nethermind Snap Sync, multi-second
    // disk-checkpoint delays are normal I/O contention, not clock drift.
    if (line.includes('Slot start')) {
      if (/\bsync=synced\b/.test(line)) {
        const delayMatch = SLOT_DELAY_RE.exec(line)
        if (delayMatch) {
          const delayMs = parseNimbusDurationMs(delayMatch[1])
          if (delayMs !== null && delayMs >= 4_000) {
            this.record('high-load', line, now)
          }
        }
      }
      return
    }

    if (FATAL_OOM_RE.test(line)) {
      this.record('fatal-oom', line, now)
      return
    }
    if (DB_DISK_RE.test(line)) {
      this.record('db-disk', line, now)
      return
    }
    if (level && JWT_AUTH_RE.test(line)) {
      this.record('jwt-auth', line, now)
      return
    }
    if (level && CLOCK_TEXT_RE.test(line)) {
      this.record('clock-drift', line, now)
      return
    }
    if (level && ENGINE_API_RE.test(line)) {
      this.record('engine-api', line, now)
      return
    }
    if (level === 'err') {
      this.record('other-error', line, now)
    }
  }

  private record(category: LogIssueCategory, line: string, now: number): void {
    const iso = new Date(now).toISOString()
    const summary = summarizeLine(line)
    this.events.push({ time: now, category, line: summary })
    this.totals[category].total++
    this.totals[category].lastSeen = iso
    this.recentLines.push({ time: iso, category, line: summary })
    if (this.recentLines.length > MAX_RECENT_LINES) {
      this.recentLines.shift()
    }
    this.dirty = true
    this.prune(now)
    if (now - this.lastPersistAt >= PERSIST_THROTTLE_MS) {
      void this.persist(now)
    }
  }

  private prune(now: number): void {
    const cutoff = now - WINDOW_15M_MS
    while (this.events.length > 0 && this.events[0].time < cutoff) {
      this.events.shift()
    }
  }

  private recentFor(category: LogIssueCategory, windowMs: number, now: number) {
    const cutoff = now - windowMs
    return this.events.filter(
      (e) => e.category === category && e.time >= cutoff,
    )
  }

  assess(now = Date.now()): LogHealthAssessment {
    this.prune(now)

    const dbDisk = this.recentFor('db-disk', WINDOW_15M_MS, now)
    if (dbDisk.length >= 1) {
      return {
        kind: 'failure',
        category: 'db-disk',
        count: dbDisk.length,
        latestLine: dbDisk[dbDisk.length - 1].line,
      }
    }

    const fatalOom = this.recentFor('fatal-oom', WINDOW_15M_MS, now)
    if (fatalOom.length >= 1) {
      return {
        kind: 'failure',
        category: 'fatal-oom',
        count: fatalOom.length,
        latestLine: fatalOom[fatalOom.length - 1].line,
      }
    }

    const jwtAuth = this.recentFor('jwt-auth', WINDOW_5M_MS, now)
    if (jwtAuth.length >= 2) {
      return {
        kind: 'failure',
        category: 'jwt-auth',
        count: jwtAuth.length,
        latestLine: jwtAuth[jwtAuth.length - 1].line,
      }
    }

    const clockDrift = this.recentFor('clock-drift', WINDOW_5M_MS, now)
    if (clockDrift.length >= 3) {
      return {
        kind: 'failure',
        category: 'clock-drift',
        count: clockDrift.length,
        latestLine: clockDrift[clockDrift.length - 1].line,
      }
    }

    const engineApi = this.recentFor('engine-api', WINDOW_5M_MS, now)
    if (engineApi.length >= 15) {
      return {
        kind: 'failure',
        category: 'engine-api',
        count: engineApi.length,
        latestLine: engineApi[engineApi.length - 1].line,
      }
    }
    if (engineApi.length >= 5) {
      return {
        kind: 'warning',
        category: 'engine-api',
        count: engineApi.length,
        latestLine: engineApi[engineApi.length - 1].line,
      }
    }

    const highLoad = this.recentFor('high-load', WINDOW_5M_MS, now)
    if (highLoad.length >= 10) {
      return {
        kind: 'warning',
        category: 'high-load',
        count: highLoad.length,
        latestLine: highLoad[highLoad.length - 1].line,
      }
    }

    const otherErr = this.recentFor('other-error', WINDOW_15M_MS, now)
    if (otherErr.length >= 20) {
      return {
        kind: 'failure',
        category: 'other-error',
        count: otherErr.length,
        latestLine: otherErr[otherErr.length - 1].line,
      }
    }
    if (otherErr.length >= 5) {
      return {
        kind: 'warning',
        category: 'other-error',
        count: otherErr.length,
        latestLine: otherErr[otherErr.length - 1].line,
      }
    }

    return { kind: 'clean' }
  }

  /**
   * Returns true once per critical category per daemon run so notifications
   * alert the user without spamming.
   */
  shouldNotify(category: LogIssueCategory): boolean {
    if (
      category !== 'db-disk' &&
      category !== 'fatal-oom' &&
      category !== 'jwt-auth' &&
      category !== 'clock-drift'
    )
      return false
    if (this.notified.has(category)) return false
    this.notified.add(category)
    return true
  }

  snapshot(now = Date.now()): PersistedLogSummary {
    const assessment = this.assess(now)
    const categories = Object.fromEntries(
      ALL_CATEGORIES.map((category) => [
        category,
        {
          recent: this.recentFor(category, WINDOW_15M_MS, now).length,
          total: this.totals[category].total,
          lastSeen: this.totals[category].lastSeen,
        },
      ]),
    ) as PersistedLogSummary['categories']

    return {
      startedAt: this.startedAt,
      updatedAt: new Date(now).toISOString(),
      linesScanned: this.linesScanned,
      benignIgnored: this.benignIgnored,
      windowMinutes: 15,
      status: assessment.kind,
      activeCategory: assessment.kind === 'clean' ? null : assessment.category,
      activeCount: assessment.kind === 'clean' ? 0 : assessment.count,
      categories,
      recentLines: [...this.recentLines],
    }
  }

  async persist(now = Date.now(), force = false): Promise<void> {
    if (this.persisting) return
    const periodicRefresh =
      this.linesScanned > this.lastPersistedLines &&
      (this.lastPersistedLines === 0 ||
        now - this.lastPersistAt >= CLEAN_PERSIST_INTERVAL_MS)
    if (!force && !this.dirty && !periodicRefresh) return
    this.persisting = true
    this.dirty = false
    this.lastPersistAt = now
    this.lastPersistedLines = this.linesScanned
    try {
      await writeFile(
        logHealthFilePath(),
        JSON.stringify(this.snapshot(now), null, 2),
        'utf8',
      )
    } catch {
      this.dirty = true
    } finally {
      this.persisting = false
    }
  }
}
