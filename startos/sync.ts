export type SyncState =
  | 'synced'
  | 'optimistic'
  | 'syncing'
  | 'waiting-consensus'
  | 'waiting-execution'
  | 'unknown'

export function asObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

export function consensusSyncState(value: unknown): SyncState {
  const status = asObject(value)
  if (
    !status ||
    typeof status.is_syncing !== 'boolean' ||
    typeof status.is_optimistic !== 'boolean' ||
    typeof status.el_offline !== 'boolean'
  )
    return 'unknown'
  if (status.el_offline) return 'waiting-execution'
  if (status.is_syncing) return 'syncing'
  if (status.is_optimistic) return 'optimistic'
  return 'synced'
}

export function consensusSlotProgress(value: unknown): {
  head: number
  percent: string
  remaining: number
} | null {
  const status = asObject(value)
  if (
    typeof status?.head_slot !== 'string' ||
    typeof status.sync_distance !== 'string' ||
    !/^\d+$/.test(status.head_slot) ||
    !/^\d+$/.test(status.sync_distance)
  )
    return null
  const head = Number(status.head_slot)
  const remaining = Number(status.sync_distance)
  const target = head + remaining
  if (
    !Number.isSafeInteger(head) ||
    !Number.isSafeInteger(remaining) ||
    !Number.isSafeInteger(target) ||
    target <= 0 ||
    remaining <= 0
  )
    return null
  return {
    head,
    percent: Math.min(99.9, (head / target) * 100).toFixed(1),
    remaining,
  }
}

export function consensusHeadSlot(value: unknown): number | null {
  const status = asObject(value)
  if (typeof status?.head_slot !== 'string' || !/^\d+$/.test(status.head_slot))
    return null
  const head = Number(status.head_slot)
  return Number.isSafeInteger(head) && head > 0 ? head : null
}

export class SyncEstimate {
  private samples: { time: number; remaining: number }[] = []

  update(remaining: number, now = Date.now()): number | null {
    const previous = this.samples.at(-1)
    const stalled = previous !== undefined && remaining >= previous.remaining
    if (
      previous &&
      (now <= previous.time || remaining > previous.remaining + 1024)
    )
      this.samples = []
    this.samples.push({ time: now, remaining })
    this.samples = this.samples.filter((sample) => now - sample.time <= 600_000)
    const first = this.samples[0]
    const elapsed = (now - first.time) / 1000
    if (stalled || elapsed < 90) return null
    const rate = (first.remaining - remaining) / elapsed
    if (rate <= 0) return null
    const seconds = remaining / rate
    return Number.isFinite(seconds) && seconds < 315_360_000
      ? Math.ceil(seconds)
      : null
  }
}

export type LogSyncSnapshot =
  | { stage: 'pending' }
  | { stage: 'initializing' }
  | { stage: 'calculating' }
  | { stage: 'forward'; eta: string; percent: string; rate: string }
  | { stage: 'backfill-preparing' }
  | { stage: 'backfill'; eta: string; percent: string; rate: string }
  | { stage: 'synced' }

const ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]/g

function formatCompactEta(raw: string): string {
  // Nimbus formats ETA like "18d02h43m", "19h01m", "42m10s", "15s".
  const parts: string[] = []
  for (const [, num, unit] of raw.matchAll(/(\d+)([dhms])/g)) {
    const n = Number(num)
    if (n > 0 || parts.length > 0) parts.push(`${n}${unit}`)
    if (parts.length === 2) break
  }
  return parts.length ? parts.join(' ') : raw
}

function parseProgressDetail(
  text: string,
): { eta: string; percent: string; rate: string } | null {
  const match =
    /^([0-9dhms]+)\s+\((\d+(?:\.\d+)?)%\)\s+(\d+(?:\.\d+)?)slots\/s$/i.exec(
      text.trim(),
    )
  if (!match) return null
  return {
    eta: formatCompactEta(match[1]),
    percent: Number(match[2]).toFixed(1),
    rate: Number(match[3]).toFixed(1),
  }
}

export class ConsensusLogTracker {
  private buffer = ''
  private latest: LogSyncSnapshot | null = null
  private updatedAt = 0

  feed(chunk: string | Buffer): void {
    this.buffer += (typeof chunk === 'string' ? chunk : chunk.toString('utf8'))
      .replace(ANSI_RE, '')
      .replace(/\r/g, '\n')
    let idx = this.buffer.indexOf('\n')
    while (idx !== -1) {
      const line = this.buffer.slice(0, idx)
      this.buffer = this.buffer.slice(idx + 1)
      this.parseLine(line)
      idx = this.buffer.indexOf('\n')
    }
    if (this.buffer.length > 4096) this.buffer = this.buffer.slice(-2048)
  }

  current(now = Date.now()): LogSyncSnapshot | null {
    if (!this.latest || now - this.updatedAt > 120_000) return null
    return this.latest
  }

  private parseLine(line: string): void {
    if (!line.includes('Slot start')) return
    const syncMatch = /\bsync=(?:"([^"]+)"|(\S+))/.exec(line)
    if (!syncMatch) return
    const raw = (syncMatch[1] ?? syncMatch[2] ?? '').trim()
    if (!raw) return

    const snapshot = this.classify(raw)
    if (snapshot) {
      this.latest = snapshot
      this.updatedAt = Date.now()
    }
  }

  private classify(raw: string): LogSyncSnapshot | null {
    if (raw === 'synced') return { stage: 'synced' }
    if (raw === 'pending') return { stage: 'pending' }
    if (raw.startsWith('[') || raw.includes('[initializing]'))
      return raw.startsWith('backfill:')
        ? { stage: 'backfill-preparing' }
        : { stage: 'initializing' }
    if (raw.startsWith('backfill:')) {
      const rest = raw.slice('backfill:'.length).trim()
      if (rest.startsWith('[') || rest.includes('calculation pending'))
        return { stage: 'backfill-preparing' }
      const detail = parseProgressDetail(rest)
      return detail
        ? { stage: 'backfill', ...detail }
        : { stage: 'backfill-preparing' }
    }
    if (raw.includes('calculation pending')) return { stage: 'calculating' }
    const detail = parseProgressDetail(raw)
    return detail ? { stage: 'forward', ...detail } : null
  }
}
