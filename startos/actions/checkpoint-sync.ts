import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import {
  CHECKPOINT_PROVIDERS,
  CHECKPOINT_PROVIDER_VALUES,
  CheckpointProviderKey,
  LOCAL_STORAGE_ID,
  findCheckpointProviderKey,
  storageReady,
  validateBlockRoot,
  validateCheckpointUrl,
} from '../utils'

const { InputSpec, Value, Variants } = sdk

const inputSpec = InputSpec.of({
  source: Value.union({
    name: i18n('Checkpoint source'),
    description: i18n(
      'Choose a community mainnet checkpoint sync endpoint or enter a custom beacon API URL. Pick a provider you trust and verify the finalized root against an independent source.',
    ),
    default: 'provider',
    variants: Variants.of({
      provider: {
        name: i18n('Community checkpoint endpoint'),
        spec: InputSpec.of({
          endpoint: Value.select({
            name: i18n('Endpoint'),
            description: i18n(
              'Public HTTPS endpoints from Ethereum’s community-maintained checkpoint sync list.',
            ),
            default: 'ethstaker',
            values: CHECKPOINT_PROVIDER_VALUES,
          }),
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
        }),
      },
    }),
  }),
  trustedBlockRoot: Value.text({
    name: i18n('Trusted block root (optional)'),
    description: i18n(
      'Optional 32-byte finalized block root (0x...) from an independent source to pin light-client verification of the downloaded checkpoint.',
    ),
    required: false,
    default: null,
  }),
})

export const checkpointSync = sdk.Action.withInput(
  'checkpoint-sync',
  async () => ({
    name: i18n('Checkpoint Sync'),
    description: i18n(
      'Reset the consensus database and sync to a recent finalized checkpoint in minutes instead of weeks.',
    ),
    warning: i18n(
      'This deletes the existing Nimbus consensus database (/chain/nimbus/db) and downloads a recent finalized state from the chosen beacon API. Validator keys are untouched. A malicious endpoint can mislead your node unless you verify the finalized root independently or supply a Trusted Block Root.',
    ),
    allowedStatuses: 'only-stopped',
    group: i18n('Maintenance'),
    visibility: 'enabled',
  }),
  inputSpec,
  async () => {
    const store = await storeJson.read().once()
    if (!store) return undefined
    const preset = store.checkpointUrl
      ? findCheckpointProviderKey(store.checkpointUrl)
      : null
    return {
      source: preset
        ? { selection: 'provider' as const, value: { endpoint: preset } }
        : store.checkpointUrl
          ? {
              selection: 'custom' as const,
              value: { url: store.checkpointUrl },
            }
          : {
              selection: 'provider' as const,
              value: { endpoint: 'ethstaker' as const },
            },
      trustedBlockRoot: store.trustedBlockRoot || null,
    }
  },
  async ({ effects, input }) => {
    const store = await storeJson.read().once()
    const grants = await sdk.getSharedVolumes(effects).once()
    if (!store?.storage || !storageReady(store.storage, grants))
      throw new Error(
        i18n(
          'Choose available storage with read/write access before running Checkpoint Sync.',
        ),
      )

    let checkpointUrl: string
    if (input.source.selection === 'provider') {
      checkpointUrl =
        CHECKPOINT_PROVIDERS[
          input.source.value.endpoint as CheckpointProviderKey
        ].url
    } else {
      try {
        checkpointUrl = validateCheckpointUrl(input.source.value.url)
      } catch {
        throw new Error(i18n('Enter a valid HTTP or HTTPS beacon API URL.'))
      }
    }

    let trustedBlockRoot: string
    try {
      trustedBlockRoot = validateBlockRoot(input.trustedBlockRoot)
    } catch {
      throw new Error(
        i18n(
          'Enter a valid 32-byte hex block root (64 hexadecimal characters, optional 0x prefix).',
        ),
      )
    }

    const mounts =
      store.storage === LOCAL_STORAGE_ID
        ? sdk.Mounts.of().mountVolume({
            volumeId: 'chain',
            subpath: null,
            mountpoint: '/chain',
            readonly: false,
          })
        : sdk.Mounts.of().mountSharedVolume({
            id: store.storage,
            subpath: null,
            mountpoint: '/chain',
            readonly: false,
          })

    const syncCommand: [string, ...string[]] = [
      '/home/user/nimbus_beacon_node',
      'trustedNodeSync',
      '--network=mainnet',
      '--data-dir=/chain/nimbus',
      '--non-interactive',
      `--trusted-node-url=${checkpointUrl}`,
      '--backfill=false',
    ]
    if (trustedBlockRoot)
      syncCommand.push(`--trusted-block-root=${trustedBlockRoot}`)

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'nimbus' },
      mounts,
      'checkpoint-sync',
      async (subc) => {
        await subc.execFail(
          [
            'sh',
            '-c',
            'test ! -L /chain/nimbus && mkdir -p /chain/nimbus && rm -rf /chain/nimbus/db && chown user:user /chain/nimbus',
          ],
          { user: 'root' },
        )
        const res = await subc.exec(syncCommand, {
          user: 'user',
          timeout: 600_000,
        })
        if (res.exitCode !== 0) {
          const tail =
            `${String(res.stderr ?? '')}\n${String(res.stdout ?? '')}`
              .trim()
              .split('\n')
              .slice(-6)
              .join('\n')
          throw new Error(
            i18n('Checkpoint sync failed: ${detail}', {
              detail: tail || `exit code ${res.exitCode}`,
            }),
          )
        }
      },
    )

    await storeJson.merge(effects, {
      checkpointUrl,
      trustedBlockRoot,
      fullySynced: false,
    })

    return {
      version: '1',
      title: i18n('Checkpoint sync complete'),
      message: i18n(
        'Downloaded finalized state from ${url}. Start Nimbus to finish catching up to the chain head.',
        { url: checkpointUrl },
      ),
      result: null,
    }
  },
)
