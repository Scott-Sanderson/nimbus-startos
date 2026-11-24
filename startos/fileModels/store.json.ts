import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const port = (fallback: number) =>
  z.number().int().min(1025).max(65535).catch(fallback)

export const storeJson = FileHelper.json(
  { base: sdk.volumes.config, subpath: 'store.json' },
  z.looseObject({
    storage: z.string().nullable().catch(null),
    consensusPort: port(9000),
    quicPort: port(9001),
    consensusPeers: z.number().int().min(50).max(250).catch(120),
    checkpointUrl: z.string().catch(''),
    trustedBlockRoot: z.string().catch(''),
    fullySynced: z.boolean().catch(false),
  }),
)
