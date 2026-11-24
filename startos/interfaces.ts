import { sdk } from './sdk'
import { i18n } from './i18n'
import { storeJson } from './fileModels/store.json'
import {
  BEACON_API_PORT,
  BEACON_HOST_ID,
  DEFAULT_P2P_PORT,
  DEFAULT_QUIC_PORT,
  LEGACY_PEER_HOST_ID,
  LEGACY_QUIC_HOST_ID,
  PEER_RANGE_HOST_ID,
  adjacentPeerPorts,
  peerRangeStart,
} from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Watch only peer ports with null-tolerant equality so changing storage,
  // peer limits, checkpoint URL, or sync state never re-runs interface setup.
  const ports = await storeJson
    .read(
      (s) => ({ consensusPort: s.consensusPort, quicPort: s.quicPort }),
      (prev, next) =>
        next === null ||
        (prev?.consensusPort === next.consensusPort &&
          prev?.quicPort === next.quicPort),
    )
    .const(effects)
  const consensusPort = ports?.consensusPort ?? DEFAULT_P2P_PORT
  const quicPort = ports?.quicPort ?? DEFAULT_QUIC_PORT

  const beaconHost = sdk.MultiHost.of(effects, BEACON_HOST_ID)
  await beaconHost.bindPort(BEACON_API_PORT, {
    protocol: null,
    transport: ['tcp'],
    preferredExternalPort: BEACON_API_PORT,
    addSsl: null,
    secure: { ssl: false },
  })

  if (adjacentPeerPorts(consensusPort, quicPort)) {
    const startPort = peerRangeStart(consensusPort, quicPort)
    const range = await sdk.MultiHost.of(
      effects,
      PEER_RANGE_HOST_ID,
    ).bindPortRange({
      internalStartPort: startPort,
      externalStartPort: startPort,
      numberOfPorts: 2,
      transport: ['tcp', 'udp'],
    })
    await range.export(
      sdk.createRangeInterface(effects, {
        id: PEER_RANGE_HOST_ID,
        name: i18n('Peer Network'),
        description: i18n(
          'Peer discovery, TCP, and QUIC. Choose one gateway here. Outbound traffic is configured separately in the service’s Outbound Traffic setting; select the same gateway there if desired.',
        ),
      }),
    )
    return []
  }

  const consensusHost = sdk.MultiHost.of(effects, LEGACY_PEER_HOST_ID)
  const consensusOrigin = await consensusHost.bindPort(consensusPort, {
    protocol: null,
    transport: ['tcp', 'udp'],
    preferredExternalPort: consensusPort,
    addSsl: null,
    secure: { ssl: false },
  })
  const consensus = sdk.createInterface(effects, {
    id: LEGACY_PEER_HOST_ID,
    name: i18n('Consensus Peers'),
    description: i18n('Consensus peer TCP and discovery UDP.'),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const quicHost = sdk.MultiHost.of(effects, LEGACY_QUIC_HOST_ID)
  const quicOrigin = await quicHost.bindPort(quicPort, {
    protocol: null,
    transport: ['udp'],
    preferredExternalPort: quicPort,
    addSsl: null,
    secure: { ssl: false },
  })
  const quic = sdk.createInterface(effects, {
    id: LEGACY_QUIC_HOST_ID,
    name: i18n('Consensus QUIC'),
    description: i18n('Consensus peer QUIC over UDP.'),
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  return [
    await consensusOrigin.export([consensus]),
    await quicOrigin.export([quic]),
  ]
})
