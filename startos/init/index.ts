import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { seed, watchStorage } from './seed'
export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  seed,
  setInterfaces,
  actions,
  dependencies,
  watchStorage,
)
export const uninit = sdk.setupUninit(versionGraph)
