import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import {
  LEGACY_PEER_HOST_ID,
  LEGACY_QUIC_HOST_ID,
  adjacentPeerPorts,
} from '../utils'

export const v26_10_2_6 = VersionInfo.of({
  version: '26.10.2:6',
  releaseNotes: {
    en_US:
      'Group adjacent peer and QUIC ports. For adjacent ports, the old consensus-peers and consensus-quic hosts, address selections, and domains are removed; enable the desired public address again.',
    es_ES:
      'Agrupa puertos adyacentes de pares y QUIC. Se eliminan consensus-peers y consensus-quic, sus direcciones y dominios; active de nuevo la dirección pública.',
    de_DE:
      'Fasst benachbarte Peer- und QUIC-Ports zusammen. consensus-peers und consensus-quic samt Adressauswahl und Domains werden entfernt; aktivieren Sie die öffentliche Adresse erneut.',
    pl_PL:
      'Grupuje sąsiednie porty węzła i QUIC. Usuwa hosty consensus-peers i consensus-quic wraz z adresami i domenami; ponownie włącz adres publiczny.',
    fr_FR:
      'Regroupe les ports adjacents des pairs et QUIC. Les hôtes consensus-peers et consensus-quic, leurs adresses et domaines sont supprimés ; réactivez l’adresse publique.',
  },
  migrations: {
    up: async ({ effects }) => {
      const config = await storeJson.read().once()
      if (config && adjacentPeerPorts(config.consensusPort, config.quicPort)) {
        await sdk.MultiHost.of(effects, LEGACY_PEER_HOST_ID).retire()
        await sdk.MultiHost.of(effects, LEGACY_QUIC_HOST_ID).retire()
      }
    },
    down: IMPOSSIBLE,
  },
})
