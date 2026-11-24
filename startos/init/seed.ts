import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { configure } from '../actions/configure'
import { i18n } from '../i18n'
import { storageReady } from '../utils'
export const seed = sdk.setupOnInit(async (effects) => {
  await storeJson.merge(effects, {})
})
export const watchStorage = sdk.setupOnInit(async (effects) => {
  const store = await storeJson.read().const(effects)
  const grants = await sdk.getSharedVolumes(effects).const()
  if (!storageReady(store?.storage, grants))
    await sdk.action.createOwnTask(effects, configure, 'critical', {
      reason: i18n(
        'Choose available storage with read/write access before starting this service.',
      ),
    })
})
