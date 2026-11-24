import { sdk } from '../sdk'
import { configure } from './configure'
import { checkpointSync } from './checkpoint-sync'
import { logSummary } from './log-summary'
import { testPorts } from './test-ports'

export const actions = sdk.Actions.of()
  .addAction(configure)
  .addAction(checkpointSync)
  .addAction(logSummary)
  .addAction(testPorts)
