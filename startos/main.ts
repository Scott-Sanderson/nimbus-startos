import { sdk } from './sdk'
import { i18n } from './i18n'
import { storeJson } from './fileModels/store.json'
import {
  BEACON_API_PORT,
  DISK_CRITICAL_FREE_BYTES,
  DISK_LOW_FREE_BYTES,
  LEGACY_PEER_HOST_ID,
  LEGACY_QUIC_HOST_ID,
  LOCAL_STORAGE_ID,
  PEER_RANGE_HOST_ID,
  adjacentPeerPorts,
  computeResourceBudget,
  formatStorageSize,
  localDiskUsage,
  parseDfBytes,
  peerRangeStart,
  storageReady,
} from './utils'
import {
  asObject,
  consensusHeadSlot,
  ConsensusLogTracker,
  consensusSlotProgress,
  consensusSyncState,
  SyncEstimate,
} from './sync'
import { LogHealthMonitor, LogIssueCategory } from './logHealth'

async function beacon(path: string): Promise<unknown> {
  const response = await fetch(`http://127.0.0.1:${BEACON_API_PORT}${path}`, {
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error('Beacon API unavailable')
  const body = (await response.json()) as { data?: unknown }
  if (body.data === undefined) throw new Error('Invalid beacon response')
  return body.data
}

/**
 * Reactive health-check trigger for Peer Network: wakes immediately when
 * the peer host bindings/addresses or the service's outbound gateway change
 * (via `.onChange()`, so adjusting StartTunnel / local WAN never restarts
 * Nimbus), with a fallback polling interval for live ENR identity updates.
 */
function peerNetworkTrigger(
  effects: Parameters<typeof sdk.getOutboundGateway>[0],
  peerHostId: string,
) {
  return async function* (getInput: () => { lastResult?: string }) {
    let done = false
    let pending = false
    let wake: (() => void) | null = null

    const notify = () => {
      if (wake) {
        const resolve = wake
        wake = null
        resolve()
      } else {
        pending = true
      }
    }

    sdk.getOutboundGateway(effects).onChange(() => {
      if (done) return { cancel: true }
      notify()
      return { cancel: false }
    })
    sdk.host.getOwn(effects, peerHostId).onChange(() => {
      if (done) return { cancel: true }
      notify()
      return { cancel: false }
    })

    const intervals: Record<string, number> = {
      starting: 5_000,
      loading: 5_000,
      failure: 15_000,
    }

    try {
      while (true) {
        if (pending) {
          pending = false
        } else {
          const { lastResult } = getInput()
          const ms = lastResult
            ? (intervals[lastResult] ?? 30_000)
            : intervals.starting
          await new Promise<void>((resolve) => {
            const timer = setTimeout(() => {
              wake = null
              resolve()
            }, ms)
            wake = () => {
              clearTimeout(timer)
              resolve()
            }
          })
        }
        yield
      }
    } finally {
      done = true
    }
  }
}

export const main = sdk.setupMain(async ({ effects }) =>
  sdk.Daemons.dynamic(effects, async ({ effects }) => {
    // Watch only startup-relevant settings so recording fullySynced never
    // triggers a daemon restart.
    const config = await storeJson
      .read((s) => ({
        storage: s.storage,
        consensusPort: s.consensusPort,
        quicPort: s.quicPort,
        consensusPeers: s.consensusPeers,
        checkpointUrl: s.checkpointUrl,
        trustedBlockRoot: s.trustedBlockRoot,
      }))
      .const(effects)
    const grants = await sdk.getSharedVolumes(effects).const()
    const engine = await sdk.host
      .getBridgeAddress(effects, {
        packageId: 'nethermind',
        hostId: 'engine-api',
        internalPort: 8551,
      })
      .const()
    if (!config?.storage || !storageReady(config.storage, grants))
      return sdk.Daemons.of(effects)
    if (!engine)
      return sdk.Daemons.of(effects).addHealthCheck('execution-connection', {
        ready: {
          display: i18n('Execution RPC'),
          fn: async () => ({
            result: 'failure',
            message: i18n('Waiting for the execution engine'),
          }),
        },
        requires: [],
      })

    const grouped = adjacentPeerPorts(config.consensusPort, config.quicPort)
    const startPort = peerRangeStart(config.consensusPort, config.quicPort)
    const peerHostId = grouped ? PEER_RANGE_HOST_ID : LEGACY_PEER_HOST_ID

    const budget = computeResourceBudget()
    const effectivePeers = Math.min(config.consensusPeers, budget.maxPeersLimit)
    console.info(
      `Nimbus resource budget: container RAM ${formatStorageSize(budget.containerRamBytes)}, ${budget.cpuCount} CPUs, num-threads=${budget.numThreads}, rest-statecache-size=${budget.restStatecacheSize}, max-peers=${effectivePeers}`,
    )

    let fullySynced =
      (await storeJson.read((s) => s.fullySynced).once()) ?? false

    const base = sdk.Mounts.of().mountDependency({
      dependencyId: 'nethermind',
      volumeId: 'engine-auth',
      subpath: null,
      mountpoint: '/run/engine-auth',
      readonly: true,
    })
    const mounts =
      config.storage === LOCAL_STORAGE_ID
        ? base.mountVolume({
            volumeId: 'chain',
            subpath: null,
            mountpoint: '/chain',
            readonly: false,
          })
        : base.mountSharedVolume({
            id: config.storage,
            subpath: null,
            mountpoint: '/chain',
            readonly: false,
          })
    const consensus = sdk.SubContainer.of(
      effects,
      { imageId: 'nimbus' },
      mounts,
      'nimbus',
    )
    const syncEstimate = new SyncEstimate()
    const logTracker = new ConsensusLogTracker()
    const logHealth = new LogHealthMonitor()
    let lastLogStatus: 'clean' | 'warning' | 'failure' = 'clean'
    let apiEverReady = false
    let apiConsecutiveErrors = 0
    let syncConsecutiveErrors = 0
    let peersConsecutiveErrors = 0
    let lastDiskUsage: { total: number; available: number } | null = null
    void logHealth.persist(Date.now(), true)
    const startedAt = Date.now()
    const command: [string, ...string[]] = [
      '/home/user/nimbus_beacon_node',
      '--network=mainnet',
      '--data-dir=/chain/nimbus',
      '--non-interactive',
      '--status-bar=false',
      `--num-threads=${budget.numThreads}`,
      `--tcp-port=${config.consensusPort}`,
      `--udp-port=${config.consensusPort}`,
      `--quic-port=${config.quicPort}`,
      `--max-peers=${effectivePeers}`,
      `--el=http://${engine}`,
      '--jwt-secret=/run/engine-auth/jwt.hex',
      '--rest',
      '--rest-address=0.0.0.0',
      `--rest-port=${BEACON_API_PORT}`,
      `--rest-statecache-size=${budget.restStatecacheSize}`,
      `--rest-statecache-ttl=${budget.restStatecacheTtl}`,
      // StartOS drops container UPnP/NAT-PMP; let Nimbus update its ENR
      // automatically from peers over whichever outbound gateway is active,
      // so switching StartTunnel <-> local WAN never restarts Nimbus.
      '--nat=none',
      '--enr-auto-update=true',
      '--history=prune',
    ]
    if (config.checkpointUrl) {
      command.push(`--external-beacon-api-url=${config.checkpointUrl}`)
      if (config.trustedBlockRoot)
        command.push(`--trusted-block-root=${config.trustedBlockRoot}`)
    }

    return sdk.Daemons.of(effects)
      .addHealthCheck('execution-connection', {
        ready: {
          display: i18n('Execution RPC'),
          trigger: sdk.trigger.statusTrigger(30_000, {
            starting: 5_000,
            loading: 5_000,
            failure: 10_000,
          }),
          fn: async () => {
            try {
              const status = asObject(await beacon('/eth/v1/node/syncing'))
              if (status?.el_offline === false)
                return {
                  result: 'success',
                  message: i18n('Execution API is reachable'),
                }
            } catch {
              // Nimbus has not reported its connection status yet.
            }
            return {
              result: 'loading',
              waiting: true,
              message: i18n('Waiting for the execution engine'),
            }
          },
        },
        requires: [],
      })
      .addOneshot('prepare-nimbus', {
        subcontainer: consensus,
        exec: {
          command: [
            'sh',
            '-c',
            'test ! -L /chain/nimbus && mkdir -p /chain/nimbus && chown user:user /chain/nimbus',
          ],
          user: 'root',
        },
        requires: [],
      })
      .addDaemon('nimbus', {
        subcontainer: consensus,
        exec: {
          command,
          onStdout: (chunk) => {
            process.stdout.write(chunk)
            logTracker.feed(chunk)
            logHealth.feed(chunk)
          },
          onStderr: (chunk) => {
            process.stderr.write(chunk)
            logTracker.feed(chunk)
            logHealth.feed(chunk)
          },
          // Give Nimbus time to flush SQLite/chaindag state cleanly on stop.
          sigtermTimeout: 60_000,
        },
        ready: {
          display: i18n('Consensus API'),
          gracePeriod: 120_000,
          fn: async () => {
            try {
              await beacon('/eth/v1/node/version')
              apiEverReady = true
              apiConsecutiveErrors = 0
              return {
                result: 'success',
                message: i18n('Consensus API is ready'),
              }
            } catch {
              apiConsecutiveErrors++
              // Require real HTTP readiness on startup, but once ready tolerate
              // a single transient timeout while port 5052 is still listening
              // so a brief host I/O pause does not tear down dependent checks.
              if (apiEverReady && apiConsecutiveErrors < 2) {
                const listening = await sdk.healthCheck.checkPortListening(
                  effects,
                  BEACON_API_PORT,
                  {
                    successMessage: i18n('Consensus API is ready'),
                    errorMessage: i18n('Waiting for the consensus API'),
                  },
                )
                if (listening.result === 'success') return listening
              }
              return {
                result: 'failure',
                message: i18n('Waiting for the consensus API'),
              }
            }
          },
        },
        requires: ['prepare-nimbus'],
      })
      .addHealthCheck('consensus-sync', {
        ready: {
          display: i18n('Consensus Sync'),
          trigger: sdk.trigger.statusTrigger(30_000, {
            starting: 5_000,
            loading: 10_000,
            failure: 10_000,
          }),
          fn: async () => {
            try {
              const status = await beacon('/eth/v1/node/syncing')
              const state = consensusSyncState(status)
              if (state === 'unknown') throw new Error('Invalid status')
              syncConsecutiveErrors = 0
              const logSync = logTracker.current()
              if (state === 'waiting-execution')
                return {
                  result: 'loading',
                  waiting: true,
                  message: i18n('Consensus is waiting for execution'),
                }
              if (state === 'optimistic') {
                if (logSync?.stage === 'backfill') {
                  return {
                    result: 'loading',
                    message: i18n(
                      'At head (waiting for execution); backfilling history: ${percent}% (${rate} slots/s, ~${eta} remaining)',
                      {
                        percent: logSync.percent,
                        rate: logSync.rate,
                        eta: logSync.eta,
                      },
                    ),
                  }
                }
                if (logSync?.stage === 'backfill-preparing') {
                  return {
                    result: 'loading',
                    waiting: true,
                    message: i18n(
                      'At head (waiting for execution); preparing historical backfill',
                    ),
                  }
                }
                const head = consensusHeadSlot(status)
                return {
                  result: 'loading',
                  waiting: true,
                  message: head
                    ? i18n(
                        'At head (slot ${slot}); waiting for execution sync',
                        { slot: head.toLocaleString('en-US') },
                      )
                    : i18n('Consensus is at head; waiting for execution sync'),
                }
              }
              if (state === 'syncing') {
                const progress = consensusSlotProgress(status)
                if (logSync?.stage === 'forward') {
                  return {
                    result: 'loading',
                    message: progress
                      ? i18n(
                          'Forward sync: ${percent}% (${remaining} slots behind, ${rate} slots/s, ~${eta} remaining)',
                          {
                            percent: logSync.percent,
                            remaining:
                              progress.remaining.toLocaleString('en-US'),
                            rate: logSync.rate,
                            eta: logSync.eta,
                          },
                        )
                      : i18n(
                          'Forward sync: ${percent}% (${rate} slots/s, ~${eta} remaining)',
                          {
                            percent: logSync.percent,
                            rate: logSync.rate,
                            eta: logSync.eta,
                          },
                        ),
                  }
                }
                if (!progress) {
                  if (logSync?.stage === 'pending')
                    return {
                      result: 'loading',
                      waiting: true,
                      message: i18n('Forward sync: waiting for peers'),
                    }
                  if (
                    logSync?.stage === 'initializing' ||
                    logSync?.stage === 'calculating'
                  )
                    return {
                      result: 'loading',
                      message: i18n(
                        'Forward sync: initializing and calculating progress',
                      ),
                    }
                  return {
                    result: 'loading',
                    message: i18n(
                      'Forward sync: catching up to beacon chain head',
                    ),
                  }
                }
                const seconds = syncEstimate.update(progress.remaining)
                const duration =
                  seconds === null
                    ? null
                    : seconds >= 86400
                      ? i18n('${days}d ${hours}h', {
                          days: String(Math.floor(seconds / 86400)),
                          hours: String(Math.floor((seconds % 86400) / 3600)),
                        })
                      : i18n('${hours}h ${minutes}m', {
                          hours: String(Math.floor(seconds / 3600)),
                          minutes: String(Math.floor((seconds % 3600) / 60)),
                        })
                const vars = {
                  percent: progress.percent,
                  remaining: progress.remaining.toLocaleString('en-US'),
                }
                return {
                  result: 'loading',
                  message: duration
                    ? i18n(
                        'Forward sync: ${percent}% (${remaining} slots behind; about ${duration} remaining)',
                        { ...vars, duration },
                      )
                    : i18n(
                        'Forward sync: ${percent}% (${remaining} slots behind)',
                        vars,
                      ),
                }
              }
              if (!fullySynced) {
                fullySynced = true
                await sdk.notification.create(effects, {
                  level: 'success',
                  title: i18n('Consensus Sync Complete'),
                  message: i18n(
                    'Nimbus has finished syncing the Ethereum beacon chain. Finalized — don’t trust, verify. ⧫',
                  ),
                })
                await storeJson.merge(
                  effects,
                  { fullySynced: true },
                  { allowWriteAfterConst: true },
                )
              }
              if (logSync?.stage === 'backfill') {
                return {
                  result: 'success',
                  message: i18n(
                    'Consensus is synced (backfilling history: ${percent}%, ~${eta} remaining)',
                    { percent: logSync.percent, eta: logSync.eta },
                  ),
                }
              }
              return { result: 'success', message: i18n('Consensus is synced') }
            } catch {
              syncConsecutiveErrors++
              if (syncConsecutiveErrors < 2) {
                return {
                  result: 'loading',
                  message: i18n('Consensus API is busy; retrying…'),
                }
              }
              return {
                result: 'failure',
                message: i18n('Consensus API is unavailable'),
              }
            }
          },
        },
        requires: ['nimbus'],
      })
      .addHealthCheck('peer-ports', {
        ready: {
          display: i18n('Peer Network'),
          trigger: peerNetworkTrigger(effects, peerHostId),
          fn: async () => {
            let enabledPublicIps: string[] = []
            if (grouped) {
              const range = await sdk.host
                .getOwn(
                  effects,
                  peerHostId,
                  (host) => host?.bindingRanges[startPort] ?? null,
                )
                .once()
              if (!range?.enabled)
                return {
                  result: 'loading',
                  waiting: true,
                  message: i18n('Waiting for peer port assignments'),
                }
              if (
                range.externalStartPort !== startPort ||
                range.numberOfPorts !== 2
              )
                return {
                  result: 'failure',
                  message: i18n(
                    'Peer port was reassigned to ${assigned} (configured ${configured}). Set the external port on Peer Network to match.',
                    {
                      assigned: String(range.externalStartPort),
                      configured: String(startPort),
                    },
                  ),
                }
              enabledPublicIps = [
                ...new Set(
                  range.addresses.effective
                    .filter((a) => a.public && a.metadata.kind === 'ipv4')
                    .map((a) => a.hostname),
                ),
              ]
            } else {
              const [peerBinding, quicBinding] = await Promise.all([
                sdk.host
                  .getOwn(
                    effects,
                    LEGACY_PEER_HOST_ID,
                    (h) => h?.bindings[config.consensusPort] ?? null,
                  )
                  .once(),
                sdk.host
                  .getOwn(
                    effects,
                    LEGACY_QUIC_HOST_ID,
                    (h) => h?.bindings[config.quicPort] ?? null,
                  )
                  .once(),
              ])
              if (
                peerBinding?.net.assignedPort == null ||
                quicBinding?.net.assignedPort == null
              )
                return {
                  result: 'loading',
                  waiting: true,
                  message: i18n('Waiting for peer port assignments'),
                }
              if (peerBinding.net.assignedPort !== config.consensusPort)
                return {
                  result: 'failure',
                  message: i18n(
                    'Peer port was reassigned to ${assigned} (configured ${configured}). Set the external port on Peer Network to match.',
                    {
                      assigned: String(peerBinding.net.assignedPort),
                      configured: String(config.consensusPort),
                    },
                  ),
                }
              if (quicBinding.net.assignedPort !== config.quicPort)
                return {
                  result: 'failure',
                  message: i18n(
                    'Peer port was reassigned to ${assigned} (configured ${configured}). Set the external port on Peer Network to match.',
                    {
                      assigned: String(quicBinding.net.assignedPort),
                      configured: String(config.quicPort),
                    },
                  ),
                }
              enabledPublicIps = [
                ...new Set(
                  peerBinding.addresses.effective
                    .filter((a) => a.public && a.metadata.kind === 'ipv4')
                    .map((a) => a.hostname),
                ),
              ]
            }

            if (enabledPublicIps.length === 0)
              return {
                result: 'success',
                message: i18n(
                  'Outbound only on ports ${peerPort}/${quicPort}. Enable a public IP on Peer Network for inbound peers.',
                  {
                    peerPort: String(config.consensusPort),
                    quicPort: String(config.quicPort),
                  },
                ),
              }

            // Compare enabled inbound gateways against the service's outbound
            // gateway using .once() reads so switching between StartTunnel and
            // local WAN never forces intermediate restarts.
            const gw = await sdk.host.getAddressGateways(
              effects,
              peerHostId,
              enabledPublicIps,
            )
            const matchingOutbound = gw.addresses.filter(
              (entry) => entry.gateway === gw.outbound,
            )

            if (matchingOutbound.length === 0)
              return {
                result: 'loading',
                waiting: true,
                message: i18n(
                  'Inbound Peer Network gateway does not match Outbound Gateway. Finish switching both to the same gateway.',
                ),
              }

            let advertisedIp: string | null = null
            try {
              const identity = asObject(await beacon('/eth/v1/node/identity'))
              if (Array.isArray(identity?.discovery_addresses)) {
                advertisedIp =
                  identity.discovery_addresses
                    .filter(
                      (entry): entry is string => typeof entry === 'string',
                    )
                    .map(
                      (entry) => /^\/ip4\/([^/]+)\/udp\/\d+\//.exec(entry)?.[1],
                    )
                    .find(Boolean) ?? null
              }
            } catch {
              // Fall through if Beacon API is temporarily unavailable.
            }

            if (!advertisedIp && Date.now() - startedAt < 120_000)
              return {
                result: 'loading',
                message: i18n('Waiting for a public discovery address'),
              }

            if (
              advertisedIp &&
              !matchingOutbound.some((entry) => entry.address === advertisedIp)
            )
              return {
                result: 'loading',
                message: i18n(
                  'Advertising ${advertised} instead of ${expected}. Waiting for ENR update or restart Nimbus.',
                  {
                    advertised: advertisedIp,
                    expected: matchingOutbound[0].address,
                  },
                ),
              }

            const ip = advertisedIp ?? matchingOutbound[0].address
            const other = enabledPublicIps.filter((a) => a !== ip).length
            return {
              result: 'success',
              message: other
                ? i18n(
                    'Inbound and outbound ready on ${ip}:${peerPort}/${quicPort}; ${count} other public address(es) enabled',
                    {
                      ip,
                      peerPort: String(config.consensusPort),
                      quicPort: String(config.quicPort),
                      count: String(other),
                    },
                  )
                : i18n(
                    'Inbound and outbound ready on ${ip}:${peerPort}/${quicPort}',
                    {
                      ip,
                      peerPort: String(config.consensusPort),
                      quicPort: String(config.quicPort),
                    },
                  ),
            }
          },
        },
        requires: ['nimbus'],
      })
      .addHealthCheck('peers', {
        ready: {
          display: i18n('Peers'),
          trigger: sdk.trigger.statusTrigger(30_000, {
            starting: 5_000,
            failure: 10_000,
          }),
          fn: async () => {
            try {
              const peers = await beacon('/eth/v1/node/peers?state=connected')
              if (!Array.isArray(peers)) throw new Error('Invalid peer list')
              peersConsecutiveErrors = 0
              let inbound = 0
              let outbound = 0
              for (const peer of peers) {
                const direction = asObject(peer)?.direction
                if (direction === 'inbound') inbound++
                else if (direction === 'outbound') outbound++
                else throw new Error('Invalid peer direction')
              }
              const message = i18n(
                'Inbound: ${inbound}, outbound: ${outbound}',
                {
                  inbound: String(inbound),
                  outbound: String(outbound),
                },
              )
              return inbound + outbound
                ? { result: 'success', message }
                : { result: 'loading', message }
            } catch {
              peersConsecutiveErrors++
              if (peersConsecutiveErrors < 2) {
                return {
                  result: 'loading',
                  message: i18n(
                    'Peer counts temporarily unavailable; retrying…',
                  ),
                }
              }
              return {
                result: 'failure',
                message: i18n('Peer counts are unavailable'),
              }
            }
          },
        },
        requires: ['nimbus'],
      })
      .addHealthCheck('storage', {
        ready: {
          display: i18n('Disk Space'),
          trigger: sdk.trigger.statusTrigger(300_000, {
            starting: 10_000,
            loading: 15_000,
            failure: 60_000,
          }),
          fn: async () => {
            try {
              let usage: { total: number; available: number } | null = null
              if (config.storage === LOCAL_STORAGE_ID) {
                usage = await localDiskUsage()
              } else {
                const res = await consensus.exec(['df', '-PB1', '/chain'], {
                  timeout: 15_000,
                })
                if (res.exitCode !== 0 || typeof res.stdout !== 'string')
                  throw new Error('df failed')
                usage = parseDfBytes(res.stdout)
              }
              if (!usage) throw new Error('Unable to read disk usage')
              lastDiskUsage = usage
              const free = formatStorageSize(usage.available)
              const total = formatStorageSize(usage.total)
              if (usage.available < DISK_CRITICAL_FREE_BYTES) {
                return {
                  result: 'failure',
                  message: i18n(
                    'Critically low disk space: ${free} free of ${total}. Free space or switch to a larger volume.',
                    { free, total },
                  ),
                }
              }
              if (usage.available < DISK_LOW_FREE_BYTES) {
                return {
                  result: 'success',
                  message: i18n(
                    '${free} free of ${total} (low — consider freeing space or moving to a larger volume)',
                    { free, total },
                  ),
                }
              }
              return {
                result: 'success',
                message: i18n('${free} free of ${total}', { free, total }),
              }
            } catch {
              if (lastDiskUsage) {
                const free = formatStorageSize(lastDiskUsage.available)
                const total = formatStorageSize(lastDiskUsage.total)
                return {
                  result: 'success',
                  message: i18n('${free} free of ${total}', { free, total }),
                }
              }
              return {
                result: 'loading',
                message: i18n('Checking disk space'),
              }
            }
          },
        },
        requires: ['nimbus'],
      })
      .addHealthCheck('log-health', {
        ready: {
          display: i18n('Log Health'),
          trigger: sdk.trigger.statusTrigger(30_000, {
            starting: 10_000,
            loading: 15_000,
            failure: 15_000,
          }),
          fn: async () => {
            const now = Date.now()
            const assessment = logHealth.assess(now)
            const statusChanged = assessment.kind !== lastLogStatus
            lastLogStatus = assessment.kind
            await logHealth.persist(now, statusChanged)

            if (assessment.kind === 'clean') {
              return {
                result: 'success',
                message: i18n('No issues detected'),
              }
            }

            const notify = async (
              category: LogIssueCategory,
              level: 'warning' | 'error',
              title: string,
              message: string,
              steps: string[],
            ) => {
              if (!logHealth.shouldNotify(category)) return
              await sdk.notification.create(effects, {
                level,
                title,
                message,
                data: [
                  `## ${title}`,
                  '',
                  message,
                  '',
                  '### Recommended steps',
                  ...steps.map((s) => `- ${s}`),
                  '',
                  '### Latest matching log line',
                  '```',
                  assessment.latestLine,
                  '```',
                ].join('\n'),
              })
            }

            switch (assessment.category) {
              case 'db-disk': {
                const msg = i18n(
                  'Database or disk error detected. Check Disk Space and drive health, or run Maintenance → Checkpoint Sync if the database is corrupted.',
                )
                await notify(
                  'db-disk',
                  'error',
                  i18n('Nimbus Database or Disk Error'),
                  msg,
                  [
                    'Check the Disk Space health check and verify your selected drive is healthy and mounted read/write.',
                    'If the drive is healthy and has free space, stop Nimbus and run Maintenance → Checkpoint Sync to rebuild the consensus database.',
                    'Run Maintenance → Log Summary to copy details for troubleshooting.',
                  ],
                )
                return { result: 'failure', message: msg }
              }
              case 'fatal-oom': {
                const msg = i18n(
                  'Critical or out-of-memory error detected in Nimbus logs. Check server RAM and run Maintenance → Log Summary.',
                )
                await notify(
                  'fatal-oom',
                  'error',
                  i18n('Nimbus Critical Error'),
                  msg,
                  [
                    'Check server RAM usage and lower Target consensus peers in Settings if needed.',
                    'Avoid running other memory-heavy services alongside Nimbus and Nethermind.',
                    'Run Maintenance → Log Summary to inspect the latest error lines.',
                  ],
                )
                return { result: 'failure', message: msg }
              }
              case 'jwt-auth': {
                const msg = i18n(
                  'Execution engine rejected authentication (JWT mismatch). Restart Nimbus or Nethermind to reconnect.',
                )
                await notify(
                  'jwt-auth',
                  'warning',
                  i18n('Nimbus Execution Auth Error'),
                  msg,
                  [
                    'Restart Nimbus so it reloads Nethermind’s JWT secret.',
                    'If the issue persists after a backup restore, restart Nethermind first, then restart Nimbus.',
                  ],
                )
                return { result: 'failure', message: msg }
              }
              case 'clock-drift': {
                const msg = i18n(
                  'System clock drift detected in Nimbus logs (${count} recent warnings). Check StartOS NTP time sync.',
                  { count: String(assessment.count) },
                )
                await notify(
                  'clock-drift',
                  'warning',
                  i18n('Nimbus System Clock Drift'),
                  msg,
                  [
                    'Verify your StartOS server clock is synchronized via NTP (`timedatectl timesync-status` over SSH).',
                    'Ensure your router or firewall allows outbound NTP (UDP port 123).',
                  ],
                )
                return { result: 'failure', message: msg }
              }
              case 'high-load':
                return {
                  result: 'loading',
                  message: i18n(
                    'High server load detected (${count} delayed slots in 5m). Check CPU or disk I/O load.',
                    { count: String(assessment.count) },
                  ),
                }
              case 'engine-api':
                return {
                  result: assessment.kind === 'failure' ? 'failure' : 'loading',
                  message: i18n(
                    'Repeated errors communicating with Nethermind (${count} in 5m). Check Nethermind’s health or run Maintenance → Log Summary.',
                    { count: String(assessment.count) },
                  ),
                }
              case 'other-error':
                return {
                  result: assessment.kind === 'failure' ? 'failure' : 'loading',
                  message: i18n(
                    '${count} recurring errors in the last 15 minutes. Run Maintenance → Log Summary for details.',
                    { count: String(assessment.count) },
                  ),
                }
            }
          },
        },
        requires: ['nimbus'],
      })
  }),
)
