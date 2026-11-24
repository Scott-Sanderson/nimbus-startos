import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import {
  BEACON_API_PORT,
  CHECKPOINT_PROVIDERS,
  CHECKPOINT_PROVIDER_VALUES,
  CheckpointProviderKey,
  DEFAULT_P2P_PORT,
  LEGACY_PEER_HOST_ID,
  LEGACY_QUIC_HOST_ID,
  LOCAL_STORAGE_ID,
  NIMBUS_MIN_DISK_BYTES,
  PEER_RANGE_HOST_ID,
  adjacentPeerPorts,
  computeResourceBudget,
  findCheckpointProviderKey,
  formatStorageSize,
  isLowRam,
  localDiskUsage,
  peerRangeStart,
  validateBlockRoot,
  validateCheckpointUrl,
} from '../utils'

const { InputSpec, Value, Variants } = sdk
const unset = '__choose__'

const lowRamWarning = isLowRam()
  ? i18n(
      'This device has less than 16 GB of RAM. Running Nimbus alongside an execution client can cause out-of-memory crashes. Keep peer limits low and avoid running other heavy services at the same time.',
    )
  : null

const trustedBlockRootField = Value.text({
  name: i18n('Trusted block root (optional)'),
  description: i18n(
    'Optional 32-byte finalized block root (0x...) from an independent source to pin light-client verification of the downloaded checkpoint.',
  ),
  required: false,
  default: null,
})

const inputSpec = InputSpec.of({
  storage: Value.dynamicSelect(async ({ effects }) => {
    const [grants, disk] = await Promise.all([
      sdk.getSharedVolumes(effects).once(),
      localDiskUsage(),
    ])
    const writableGrants = grants.filter((v) => !v.readonly)
    const localLabel = disk
      ? i18n('StartOS data drive (${free} free / ${total})', {
          free: formatStorageSize(disk.available),
          total: formatStorageSize(disk.total),
        })
      : i18n('StartOS data drive')
    const values: Record<string, string> = {
      [unset]: i18n('Choose storage'),
      [LOCAL_STORAGE_ID]: localLabel,
    }
    for (const grant of writableGrants) values[grant.id] = grant.name
    const selected = await storeJson.read((s) => s.storage).once()
    if (selected && selected !== LOCAL_STORAGE_ID && !values[selected])
      values[selected] = i18n('Previously selected volume is unavailable')
    return {
      name: i18n('Blockchain storage'),
      description: i18n(
        'Grant read/write access to a shared volume in System Shared Volumes before selecting it. Mainnet pruned consensus needs at least 150 GiB. Changing storage does not move existing data.',
      ),
      warning: null,
      default: unset,
      values,
      disabled: false,
    }
  }),

  checkpointSync: Value.union({
    name: i18n('Initial checkpoint sync'),
    description: i18n(
      'Used when initializing an empty consensus database so Nimbus syncs in minutes instead of weeks. To re-sync an existing database from a checkpoint, stop Nimbus and run Maintenance → Checkpoint Sync.',
    ),
    default: 'provider',
    variants: Variants.of({
      provider: {
        name: i18n('Community checkpoint endpoint (recommended)'),
        spec: InputSpec.of({
          endpoint: Value.select({
            name: i18n('Endpoint'),
            description: i18n(
              'Public HTTPS endpoints from Ethereum’s community-maintained checkpoint sync list.',
            ),
            default: 'ethstaker',
            values: CHECKPOINT_PROVIDER_VALUES,
          }),
          trustedBlockRoot: trustedBlockRootField,
        }),
      },
      custom: {
        name: i18n('Custom beacon API URL'),
        spec: InputSpec.of({
          url: Value.text({
            name: i18n('Trusted beacon API URL'),
            description: i18n(
              'HTTP or HTTPS URL of a trusted Ethereum mainnet beacon API.',
            ),
            required: true,
            default: null,
          }),
          trustedBlockRoot: trustedBlockRootField,
        }),
      },
      genesis: {
        name: i18n('Sync from genesis (2–3+ weeks)'),
        spec: InputSpec.of({}),
      },
    }),
  }),

  consensusPort: Value.number({
    name: i18n('Consensus peer port'),
    description: i18n(
      'TCP and UDP peer port. QUIC automatically uses the next port (+1). Changing this port resets the public address selection and restarts Nimbus.',
    ),
    required: true,
    default: DEFAULT_P2P_PORT,
    min: 1025,
    max: 65534,
    integer: true,
    step: 1,
    units: null,
  }),

  consensusPeers: Value.dynamicNumber(async () => {
    const { defaultPeers, maxPeersLimit } = computeResourceBudget()
    return {
      name: i18n('Target consensus peers'),
      description: i18n(
        'Higher peer limits use more RAM and bandwidth. Capped at 100 on devices with less than 16 GB of RAM.',
      ),
      warning: null,
      placeholder: null,
      required: true,
      default: defaultPeers,
      min: 50,
      max: maxPeersLimit,
      integer: true,
      step: 1,
      units: null,
      disabled: false,
    }
  }),
})

export const configure = sdk.Action.withInput(
  'configure',
  async () => ({
    name: i18n('Settings'),
    description: i18n('Choose storage and peer settings.'),
    warning: lowRamWarning,
    allowedStatuses: 'any',
    group: i18n('Configuration'),
    visibility: 'enabled',
  }),
  inputSpec,
  async () => {
    const store = await storeJson.read().once()
    if (!store) return undefined
    const { maxPeersLimit } = computeResourceBudget()
    const preset = store.checkpointUrl
      ? findCheckpointProviderKey(store.checkpointUrl)
      : null
    const trustedBlockRoot = store.trustedBlockRoot || null
    // On a fresh unconfigured install (storage === null), prefill the
    // recommended community checkpoint sync; on an existing install that
    // explicitly left checkpointUrl blank, reflect 'genesis'.
    const checkpointSync = preset
      ? {
          selection: 'provider' as const,
          value: { endpoint: preset, trustedBlockRoot },
        }
      : store.checkpointUrl
        ? {
            selection: 'custom' as const,
            value: { url: store.checkpointUrl, trustedBlockRoot },
          }
        : store.storage === null
          ? {
              selection: 'provider' as const,
              value: { endpoint: 'ethstaker' as const, trustedBlockRoot: null },
            }
          : { selection: 'genesis' as const, value: {} }

    return {
      storage: store.storage ?? unset,
      checkpointSync,
      consensusPort: Math.min(store.consensusPort, 65534),
      consensusPeers: Math.min(store.consensusPeers, maxPeersLimit),
    }
  },
  async ({ effects, input }) => {
    if (input.storage === unset)
      throw new Error(i18n('Choose a storage location.'))

    if (input.storage === LOCAL_STORAGE_ID) {
      const disk = await localDiskUsage()
      if (disk && disk.total < NIMBUS_MIN_DISK_BYTES) {
        throw new Error(
          i18n(
            'The StartOS data drive (${total}) is too small for Ethereum Mainnet consensus (at least 150 GiB required). Grant and select a larger shared volume instead.',
            { total: formatStorageSize(disk.total) },
          ),
        )
      }
    } else {
      const grant = (await sdk.getSharedVolumes(effects).once()).find(
        (v) => v.id === input.storage,
      )
      if (!grant || grant.readonly)
        throw new Error(
          i18n('Grant read/write access to the selected volume and try again.'),
        )
    }

    const consensusPort = input.consensusPort
    const quicPort = consensusPort + 1
    if (consensusPort === BEACON_API_PORT || quicPort === BEACON_API_PORT)
      throw new Error(
        i18n('Peer and QUIC ports cannot use the internal API port.'),
      )

    let checkpointUrl = ''
    let trustedBlockRoot = ''
    if (input.checkpointSync.selection === 'provider') {
      checkpointUrl =
        CHECKPOINT_PROVIDERS[
          input.checkpointSync.value.endpoint as CheckpointProviderKey
        ].url
      try {
        trustedBlockRoot = validateBlockRoot(
          input.checkpointSync.value.trustedBlockRoot,
        )
      } catch {
        throw new Error(
          i18n(
            'Enter a valid 32-byte hex block root (64 hexadecimal characters, optional 0x prefix).',
          ),
        )
      }
    } else if (input.checkpointSync.selection === 'custom') {
      try {
        checkpointUrl = validateCheckpointUrl(input.checkpointSync.value.url)
      } catch {
        throw new Error(i18n('Enter a valid HTTP or HTTPS beacon API URL.'))
      }
      try {
        trustedBlockRoot = validateBlockRoot(
          input.checkpointSync.value.trustedBlockRoot,
        )
      } catch {
        throw new Error(
          i18n(
            'Enter a valid 32-byte hex block root (64 hexadecimal characters, optional 0x prefix).',
          ),
        )
      }
    }

    const previous = await storeJson.read().once()

    await storeJson.merge(effects, {
      storage: input.storage,
      consensusPort,
      quicPort,
      consensusPeers: input.consensusPeers,
      checkpointUrl,
      trustedBlockRoot,
    })

    if (
      previous &&
      (previous.consensusPort !== consensusPort ||
        previous.quicPort !== quicPort)
    ) {
      if (adjacentPeerPorts(previous.consensusPort, previous.quicPort)) {
        const previousStart = peerRangeStart(
          previous.consensusPort,
          previous.quicPort,
        )
        if (previousStart !== peerRangeStart(consensusPort, quicPort))
          await sdk.MultiHost.of(effects, PEER_RANGE_HOST_ID).retirePort(
            previousStart,
          )
      } else {
        await sdk.MultiHost.of(effects, LEGACY_PEER_HOST_ID).retire()
        await sdk.MultiHost.of(effects, LEGACY_QUIC_HOST_ID).retire()
      }
    }

    return {
      version: '1',
      title: i18n('Configuration saved'),
      message: i18n(
        'The service restarts when settings change. Confirm the advertised external ports match the peer ports.',
      ),
      result: null,
    }
  },
)
