import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '26.10.2:0',
  releaseNotes: {
    en_US:
      'Initial StartOS release of Nimbus (v26.10.2) with Nethermind Engine API integration, shared volume support, Checkpoint Sync with curated community endpoints and optional --trusted-block-root verification, RAM/CPU/disk resource tuning, zero-restart StartTunnel/WAN switching, real-time Log Health monitoring, and Disk Space checks.',
    es_ES:
      'Lanzamiento inicial en StartOS de Nimbus (v26.10.2) con integración de Engine API de Nethermind, soporte de volúmenes compartidos, sincronización por punto de control con servidores comunitarios y --trusted-block-root opcional, ajuste de RAM/CPU/disco, cambio StartTunnel/WAN sin reinicios, supervisión de salud de registros en tiempo real y control de espacio en disco.',
    de_DE:
      'Erste StartOS-Version von Nimbus (v26.10.2) mit Nethermind-Engine-API-Integration, Unterstützung für freigegebene Volumes, Checkpoint-Sync mit kuratierten Community-Endpunkten und optionalem --trusted-block-root, RAM-/CPU-/Speicher-Abstimmung, StartTunnel/WAN-Wechsel ohne Neustarts, Echtzeit-Protokollüberwachung und Speicherplatz-Prüfung.',
    pl_PL:
      'Pierwsze wydanie Nimbus (v26.10.2) dla StartOS z integracją Engine API Netherminda, obsługą woluminów współdzielonych, synchronizacją z punktu kontrolnego z wybranymi punktami społeczności i opcjonalnym --trusted-block-root, dostrajaniem RAM/CPU/dysku, przełączaniem StartTunnel/WAN bez restartów, monitorowaniem stanu logów w czasie rzeczywistym i kontrolą miejsca na dysku.',
    fr_FR:
      'Version initiale de Nimbus (v26.10.2) pour StartOS avec intégration Engine API Nethermind, prise en charge des volumes partagés, synchronisation par point de contrôle avec serveurs communautaires et --trusted-block-root optionnel, réglage RAM/CPU/disque, basculement StartTunnel/WAN sans redémarrage, surveillance de la santé des journaux en temps réel et contrôle d’espace disque.',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
