import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'
export const manifest = setupManifest({
  id: 'nimbus',
  title: 'Nimbus',
  license: 'MIT OR Apache-2.0',
  packageRepo: 'https://github.com/Scott-Sanderson/nimbus-startos',
  upstreamRepo: 'https://github.com/status-im/nimbus-eth2',
  marketingUrl: 'https://nimbus.team/',
  donationUrl: null,
  description: { short, long },
  hardwareRequirements: {
    ram: 12 * 1024 ** 3, // 12 GiB floor excludes 8 GB devices while allowing 16 GB hosts with iGPU carve-outs
  },
  sharedVolumes: true,
  volumes: ['config', 'chain'],
  images: {
    nimbus: {
      source: { dockerTag: 'statusim/nimbus-eth2:multiarch-v26.10.2' },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})
