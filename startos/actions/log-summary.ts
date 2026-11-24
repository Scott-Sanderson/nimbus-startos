import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { LogIssueCategory, readPersistedLogSummary } from '../logHealth'

function categoryLabel(category: LogIssueCategory): string {
  switch (category) {
    case 'db-disk':
      return i18n('Database / disk errors')
    case 'fatal-oom':
      return i18n('Fatal / out-of-memory errors')
    case 'jwt-auth':
      return i18n('Execution JWT authentication errors')
    case 'engine-api':
      return i18n('Execution engine communication errors')
    case 'clock-drift':
      return i18n('System clock drift warnings')
    case 'high-load':
      return i18n('High server load / slot delays')
    case 'other-error':
      return i18n('Other errors')
  }
}

export const logSummary = sdk.Action.withoutInput(
  'log-summary',
  async () => ({
    name: i18n('Log Summary'),
    description: i18n(
      'View a categorized summary of recent warnings and errors detected in Nimbus logs.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Maintenance'),
    visibility: 'enabled',
  }),
  async () => {
    const summary = await readPersistedLogSummary()
    if (!summary) {
      return {
        version: '1',
        title: i18n('Log summary'),
        message: i18n(
          'No log telemetry has been recorded yet. Start Nimbus and try again.',
        ),
        result: null,
      }
    }

    const statusText =
      summary.status === 'clean'
        ? i18n('Clean — no issues detected')
        : summary.status === 'warning'
          ? i18n('Warning — recurring issues detected')
          : i18n('Failure — actionable issue detected')

    const lines: string[] = [
      i18n('Status: ${status}', { status: statusText }),
      i18n('Session started: ${time}', { time: summary.startedAt }),
      i18n('Last updated: ${time}', { time: summary.updatedAt }),
      i18n('Lines scanned: ${scanned} (benign noise ignored: ${ignored})', {
        scanned: summary.linesScanned.toLocaleString('en-US'),
        ignored: summary.benignIgnored.toLocaleString('en-US'),
      }),
      '',
      i18n('Category breakdown (last ${minutes}m / session total):', {
        minutes: String(summary.windowMinutes),
      }),
    ]

    for (const [key, stats] of Object.entries(summary.categories) as [
      LogIssueCategory,
      { recent: number; total: number; lastSeen: string | null },
    ][]) {
      const seen = stats.lastSeen
        ? i18n(' (last seen ${time})', { time: stats.lastSeen })
        : ''
      lines.push(
        `  - ${categoryLabel(key)}: ${stats.recent} / ${stats.total}${seen}`,
      )
    }

    if (summary.recentLines.length > 0) {
      lines.push('', i18n('Recent notable log lines:'))
      for (const entry of summary.recentLines) {
        lines.push(`  [${entry.time}] [${entry.category}] ${entry.line}`)
      }
    } else {
      lines.push('', i18n('No notable errors or warnings recorded this run.'))
    }

    return {
      version: '1',
      title: i18n('Log summary'),
      message:
        summary.status === 'clean'
          ? i18n(
              'Nimbus logs look clean. Benign startup messages and normal peer chatter are filtered automatically.',
            )
          : i18n(
              'Copy this summary if you need help troubleshooting in Start9 support.',
            ),
      result: {
        type: 'multiline',
        value: lines.join('\n'),
        copyable: true,
        qr: false,
        masked: false,
        filename: 'nimbus-log-summary.txt',
      },
    }
  },
)
