import { statfs } from 'node:fs/promises'
import { availableParallelism, totalmem } from 'node:os'
import { sdk } from './sdk'

export const BEACON_API_PORT = 5052
export const DEFAULT_P2P_PORT = 9000
export const DEFAULT_QUIC_PORT = 9001

export const BEACON_HOST_ID = 'beacon-api'
export const PEER_RANGE_HOST_ID = 'peer-network'
export const LEGACY_PEER_HOST_ID = 'consensus-peers'
export const LEGACY_QUIC_HOST_ID = 'consensus-quic'
export const LOCAL_STORAGE_ID = '__local__'

// Curated HTTPS Mainnet endpoints from Ethereum's community-maintained
// checkpoint-sync-endpoints list (all support both state and verification).
export const CHECKPOINT_PROVIDERS = {
  ethstaker: {
    name: 'EthStaker (beaconstate.ethstaker.cc)',
    url: 'https://beaconstate.ethstaker.cc',
  },
  sigp: {
    name: 'Sigma Prime (mainnet.checkpoint.sigp.io)',
    url: 'https://mainnet.checkpoint.sigp.io',
  },
  beaconchain: {
    name: 'beaconcha.in (sync-mainnet.beaconcha.in)',
    url: 'https://sync-mainnet.beaconcha.in',
  },
  chainsafe: {
    name: 'Lodestar / ChainSafe (beaconstate-mainnet.chainsafe.io)',
    url: 'https://beaconstate-mainnet.chainsafe.io',
  },
  attestant: {
    name: 'Attestant (mainnet-checkpoint-sync.attestant.io)',
    url: 'https://mainnet-checkpoint-sync.attestant.io',
  },
  stakely: {
    name: 'Stakely (mainnet-checkpoint-sync.stakely.io)',
    url: 'https://mainnet-checkpoint-sync.stakely.io',
  },
} as const

export type CheckpointProviderKey = keyof typeof CHECKPOINT_PROVIDERS

export const CHECKPOINT_PROVIDER_VALUES: Record<CheckpointProviderKey, string> =
  Object.fromEntries(
    Object.entries(CHECKPOINT_PROVIDERS).map(([k, v]) => [k, v.name]),
  ) as Record<CheckpointProviderKey, string>

export function findCheckpointProviderKey(
  url: string,
): CheckpointProviderKey | null {
  const normalized = url.trim().replace(/\/+$/, '')
  for (const [key, provider] of Object.entries(CHECKPOINT_PROVIDERS)) {
    if (provider.url === normalized) return key as CheckpointProviderKey
  }
  return null
}

export function validateCheckpointUrl(raw: string): string {
  const trimmed = raw.trim()
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error('INVALID_CHECKPOINT_URL')
  }
  if (!['http:', 'https:'].includes(parsed.protocol))
    throw new Error('INVALID_CHECKPOINT_URL')
  return trimmed
}

export function validateBlockRoot(raw: string | null | undefined): string {
  const trimmed = raw?.trim() ?? ''
  if (!trimmed) return ''
  if (!/^(0x)?[0-9a-fA-F]{64}$/.test(trimmed))
    throw new Error('INVALID_BLOCK_ROOT')
  return trimmed.startsWith('0x') || trimmed.startsWith('0X')
    ? `0x${trimmed.slice(2).toLowerCase()}`
    : `0x${trimmed.toLowerCase()}`
}

const GiB = 1024 ** 3

// StartOS caps service-container RAM 1 GiB below host MemTotal, and iGPU
// carve-outs reduce it further — a 16 GB host reports ~14.6 GiB here.
export const LOW_RAM_BYTES = 12 * GiB

// Mainnet pruned Nimbus database plus headroom for chain growth.
export const NIMBUS_MIN_DISK_BYTES = 150 * GiB

// Live free-space thresholds on the mounted /chain volume.
export const DISK_CRITICAL_FREE_BYTES = 15 * GiB
export const DISK_LOW_FREE_BYTES = 40 * GiB

export type SharedVolumeGrant = {
  id: string
  readonly: boolean
  availability: 'unknown' | 'available' | 'unavailable'
}

export function storageReady(
  selected: string | null | undefined,
  grants: readonly SharedVolumeGrant[],
): boolean {
  if (!selected) return false
  if (selected === LOCAL_STORAGE_ID) return true
  const grant = grants.find((volume) => volume.id === selected)
  return !!grant && !grant.readonly && grant.availability !== 'unavailable'
}

export function adjacentPeerPorts(peerPort: number, quicPort: number): boolean {
  return Math.abs(peerPort - quicPort) === 1
}

export function peerRangeStart(peerPort: number, quicPort: number): number {
  return Math.min(peerPort, quicPort)
}

export function isLowRam(): boolean {
  return totalmem() < LOW_RAM_BYTES
}

/**
 * Scale Nimbus's worker threads, REST state cache, and peer cap to the RAM
 * and CPU StartOS grants this container, leaving headroom for the co-resident
 * execution client and other services.
 */
export function computeResourceBudget(): {
  containerRamBytes: number
  cpuCount: number
  numThreads: number
  restStatecacheSize: number
  restStatecacheTtl: number
  defaultPeers: number
  maxPeersLimit: number
} {
  const containerRamBytes = totalmem()
  const cpuCount = availableParallelism()
  const lowRam = containerRamBytes < LOW_RAM_BYTES

  return {
    containerRamBytes,
    cpuCount,
    numThreads: Math.max(1, Math.min(4, Math.floor(cpuCount / 2))),
    restStatecacheSize: lowRam ? 1 : 3,
    restStatecacheTtl: lowRam ? 30 : 60,
    defaultPeers: lowRam ? 80 : 120,
    maxPeersLimit: lowRam ? 100 : 250,
  }
}

export async function localDiskUsage(): Promise<{
  total: number
  available: number
} | null> {
  try {
    const stats = await statfs(sdk.volumes.chain.subpath(''))
    return {
      total: stats.blocks * stats.bsize,
      available: stats.bavail * stats.bsize,
    }
  } catch {
    return null
  }
}

export function parseDfBytes(
  stdout: string,
): { total: number; available: number } | null {
  const lines = stdout.trim().split('\n')
  if (lines.length < 2) return null
  const fields = lines[lines.length - 1].trim().split(/\s+/)
  if (fields.length < 4) return null
  const total = Number(fields[1])
  const available = Number(fields[3])
  if (!Number.isFinite(total) || !Number.isFinite(available) || total <= 0)
    return null
  return { total, available }
}

export function formatStorageSize(bytes: number): string {
  const TiB = 1024 ** 4
  if (bytes >= TiB) return `${(bytes / TiB).toFixed(2)} TiB`
  return `${(bytes / GiB).toFixed(1)} GiB`
}
