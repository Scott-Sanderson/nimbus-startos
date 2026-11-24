import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v26_10_2_6 } from './v26_10_2_6'

export const versionGraph = VersionGraph.of({
  current,
  other: [v26_10_2_6],
})
