import { sdk } from './sdk'
import { i18n } from './i18n'
const execution = sdk.Dependency.required('nethermind', {
  description: i18n('Provides the authenticated Ethereum execution engine.'),
  metadata: { title: 'Nethermind', icon: './assets/nethermind-icon.png' },
  versionRange: '>=2.2.2:0',
  kind: 'running',
  healthChecks: ['nethermind'],
})
export const dependencies = sdk.Dependencies.of().addDependency(execution)
