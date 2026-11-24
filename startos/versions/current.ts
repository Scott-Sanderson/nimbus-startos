import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '26.10.2:11',
  releaseNotes: {
    en_US:
      'Add real-time Log Health monitoring with plain-English diagnostics, rate-limited critical StartOS notifications, a Maintenance → Log Summary action, rich sync-stage progress (forward sync, optimistic at-head, historical backfill), Checkpoint Sync with curated endpoints and optional --trusted-block-root, RAM/CPU/disk resource tuning, Disk Space health check, and zero-restart StartTunnel/WAN switching.',
    es_ES:
      'Añade supervisión de salud de registros en tiempo real con diagnósticos claros, notificaciones críticas con límite de frecuencia, la acción Mantenimiento → Resumen de registros, progreso detallado por fases, sincronización por punto de control con servidores comunitarios y --trusted-block-root, ajuste de RAM/CPU/disco, control de espacio en disco y cambio StartTunnel/WAN sin reinicios.',
    de_DE:
      'Fügt Echtzeit-Protokollüberwachung mit verständlichen Diagnosen, ratenbegrenzten kritischen Benachrichtigungen, Wartung → Protokollzusammenfassung, detailliertem Synchronisierungsfortschritt, Checkpoint-Sync mit kuratierten Endpunkten und --trusted-block-root, RAM-/CPU-/Speicher-Abstimmung, Speicherplatz-Prüfung und StartTunnel/WAN-Wechsel ohne Neustarts hinzu.',
    pl_PL:
      'Dodaje monitorowanie stanu logów w czasie rzeczywistym z czytelną diagnostyką, powiadomienia krytyczne z limitem częstotliwości, akcję Konserwacja → Podsumowanie logów, szczegółowy postęp etapów synchronizacji, synchronizację z punktu kontrolnego z wybranymi punktami i --trusted-block-root, dostrajanie RAM/CPU/dysku, kontrolę miejsca na dysku oraz przełączanie StartTunnel/WAN bez restartów.',
    fr_FR:
      'Ajoute la surveillance en temps réel de la santé des journaux avec diagnostics clairs, des notifications critiques à fréquence limitée, l’action Maintenance → Résumé des journaux, la progression détaillée par étape, la synchronisation par point de contrôle avec serveurs communautaires et --trusted-block-root, le réglage RAM/CPU/disque, le contrôle d’espace disque et le basculement StartTunnel/WAN sans redémarrage.',
  },
  migrations: { up: async () => {}, down: IMPOSSIBLE },
})
