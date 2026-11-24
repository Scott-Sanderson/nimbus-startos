import { sdk } from './sdk'
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('config').setOptions({
    exclude: ['log-health.json'],
  }),
)
