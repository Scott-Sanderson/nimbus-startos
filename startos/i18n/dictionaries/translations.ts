import { LangDict } from './default'

export default {
  es_ES: {
    '98': 'Red de pares',
    '99': 'Descubrimiento de pares, TCP y QUIC. Elija una puerta de enlace aquí. El tráfico saliente se configura por separado en Tráfico saliente del servicio; seleccione allí la misma puerta de enlace si lo desea.',
    '100':
      'Puerto TCP y UDP de pares. Elija un puerto junto al de QUIC. Cambiar cualquiera de los puertos restablece la selección de dirección pública.',
    '101': 'Puerto UDP de QUIC. Elija un puerto junto al de pares.',
    '102':
      'Los puertos de pares y QUIC deben ser adyacentes y no pueden usar el puerto de API interno.',
    '103':
      'Compruebe los puertos locales, las direcciones activadas y la puerta de enlace saliente.',
    '104':
      'Estas comprobaciones solo prueban puertos locales. StartOS aún no ofrece una prueba externa para puertos agrupados; no se comprueba la accesibilidad de UDP ni QUIC.',
    '95': 'No se anuncia ninguna dirección pública de descubrimiento. Revise Interfaces y Tráfico saliente.',
    '96': 'Puerta de enlace saliente: ${gateway}',
    '97': 'Direcciones QUIC públicas activadas: ${addresses}',
    '71': 'Consenso: ${percent}% (${remaining} ranuras de retraso)',
    '72': 'Consenso: ${percent}% (${remaining} ranuras de retraso; quedan unos ${duration})',
    '73': '${days}d ${hours}h',
    '74': '${hours}h ${minutes}m',
    '75': 'Dirección anunciada a pares',
    '76': 'No hay ninguna dirección IPv4 pública para pares activada',
    '77': 'Esperando una dirección pública de descubrimiento',
    '78': 'La dirección anunciada ${address} no está activada en Interfaces',
    '79': 'Se anuncia ${address}; ${count} dirección(es) pública(s) más activadas',
    '80': 'Se anuncia ${address}',
    '81': 'Probar puertos',
    '82': 'Compruebe los puertos locales y encuentre la prueba TCP externa de StartOS.',
    '83': 'Red',
    '84': 'Escuchando localmente',
    '85': 'No escucha localmente',
    '86': 'TCP de pares ${port}: ${state}',
    '87': 'UDP de descubrimiento ${port}: ${state}',
    '88': 'QUIC UDP ${port}: ${state}',
    '89': 'Direcciones locales: ${addresses}',
    '90': 'Direcciones públicas de pares activadas: ${addresses}',
    '91': 'Ninguna',
    '92': 'Un puerto externo de pares difiere de Ajustes. Haga que coincidan; guardar Ajustes reinicia Nimbus automáticamente.',
    '93': 'Diagnóstico de puertos',
    '94': 'Estas comprobaciones solo prueban los puertos locales. Para probar TCP público, abra Interfaces → Pares de consenso → la dirección pública → Requisitos de dirección (engranaje) → Probar. Esto no prueba UDP ni QUIC desde Internet.',

    '68': 'Ajustes',
    '69': 'Configuración',
    '70': 'Entrantes: ${inbound}, salientes: ${outbound}',

    '67': 'Se puede acceder a la API de ejecución',
    '60': 'Configurar Nethermind',
    '61': 'Configurar Nimbus',
    '62': 'Elija el almacenamiento y los ajustes de pares.',
    '63': 'Elija almacenamiento disponible con acceso de lectura y escritura antes de iniciar el servicio.',
    '64': 'El servicio se reinicia al cambiar la configuración. Compruebe que los puertos externos anunciados coincidan con los puertos de pares.',
    '65': 'Pares: ${count}',
    '66': 'Proporciona el motor de ejecución Ethereum autenticado.',

    '0': 'Elegir almacenamiento',
    '1': 'Unidad de datos de StartOS',
    '2': 'El volumen seleccionado ya no está disponible',
    '3': 'Almacenamiento de la cadena',
    '4': 'Conceda acceso de lectura y escritura a un volumen compartido en Volúmenes compartidos del sistema antes de seleccionarlo. Cambiar el almacenamiento no mueve los datos existentes.',
    '5': 'Historial de ejecución',
    '6': 'La expiración continua conserva unos cinco meses de bloques y recibos. Post-Merge conserva el historial desde la Fusión. Completo conserva todo el historial de bloques. Para recuperar más historial puede ser necesario sincronizar de nuevo.',
    '7': 'Expiración continua',
    '8': 'Historial posterior a la Fusión',
    '9': 'Historial completo de bloques',
    '10': 'Puerto de pares de ejecución',
    '11': 'Puerto TCP y UDP para los pares de ejecución.',
    '12': 'Puerto de pares de consenso',
    '13': 'Puerto TCP y UDP para los pares de consenso.',
    '14': 'Puerto QUIC de consenso',
    '15': 'Puerto UDP para pares QUIC de consenso.',
    '16': 'Máximo de pares de ejecución',
    '17': 'Objetivo de pares de consenso',
    '18': 'URL de API de beacon de confianza',
    '19': 'URL opcional para sincronización inicial desde un punto de control. Use únicamente un nodo beacon de confianza.',
    '20': 'Configurar nodo Ethereum',
    '21': 'Elija almacenamiento, puertos de pares, historial y límites de pares.',
    '22': 'Elija una ubicación de almacenamiento.',
    '23': 'Conceda acceso de lectura y escritura al volumen seleccionado y vuelva a intentarlo.',
    '24': 'Los puertos de pares deben ser distintos y no pueden usar un puerto interno de API.',
    '25': 'Introduzca una URL HTTP o HTTPS válida para la API beacon.',
    '26': 'Configuración guardada',
    '27': 'Los clientes se reinician al cambiar la configuración. Compruebe que los puertos externos anunciados coincidan con estos puertos de pares.',
    '28': 'Elija almacenamiento disponible con acceso de lectura y escritura antes de iniciar el nodo Ethereum.',
    '29': 'RPC de cartera',
    '30': 'JSON-RPC de Ethereum para carteras y aplicaciones de confianza.',
    '31': 'Pares de ejecución',
    '32': 'TCP de pares de ejecución y UDP de descubrimiento.',
    '33': 'Pares de consenso',
    '34': 'TCP de pares de consenso y UDP de descubrimiento.',
    '35': 'QUIC de consenso',
    '36': 'QUIC de pares de consenso por UDP.',
    '37': 'RPC de ejecución',
    '38': 'El motor de ejecución está listo',
    '39': 'Esperando al motor de ejecución',
    '40': 'API de consenso',
    '41': 'La API de consenso está lista',
    '42': 'Esperando a la API de consenso',
    '43': 'Sincronización de ejecución',
    '44': 'La ejecución se está sincronizando',
    '45': 'La ejecución está lista; esperando al consenso',
    '46': 'La ejecución está sincronizada',
    '47': 'El RPC de ejecución no está disponible',
    '48': 'Sincronización de consenso',
    '49': 'El consenso está esperando a la ejecución',
    '50': 'El consenso se está sincronizando',
    '51': 'El consenso está sincronizado',
    '52': 'La API de consenso no está disponible',
    '53': 'Puertos de pares',
    '54': 'Esperando la asignación de puertos de pares',
    '55': 'Se ha reasignado un puerto de pares. Haga que el puerto externo coincida con el puerto de pares configurado.',
    '56': 'Los puertos de pares coinciden con las asignaciones externas',
    '57': 'Pares',
    '58': 'Ejecución: ${execution}; consenso: ${consensus}',
    '59': 'El número de pares no está disponible',
    '105':
      'Este dispositivo tiene menos de 16 GB de RAM. Ejecutar Nimbus junto con un cliente de ejecución puede provocar cierres por falta de memoria. Mantenga bajos los límites de pares y evite ejecutar otros servicios pesados al mismo tiempo.',
    '106': 'Unidad de datos de StartOS (${free} libres / ${total})',
    '107':
      'Conceda acceso de lectura y escritura a un volumen compartido en Volúmenes compartidos del sistema antes de seleccionarlo. El consenso podado de mainnet necesita al menos 150 GiB. Cambiar el almacenamiento no mueve los datos existentes.',
    '108':
      'Puerto TCP y UDP de pares. QUIC usa automáticamente el puerto siguiente (+1). Cambiar este puerto restablece la selección de dirección pública y reinicia Nimbus.',
    '109':
      'Un límite mayor de pares consume más RAM y ancho de banda. Limitado a 100 en dispositivos con menos de 16 GB de RAM.',
    '110':
      'La unidad de datos de StartOS (${total}) es demasiado pequeña para el consenso de Ethereum Mainnet (se requieren al menos 150 GiB). Conceda y seleccione un volumen compartido más grande.',
    '111':
      'Los puertos de pares y QUIC no pueden usar el puerto de API interno.',
    '112':
      'El puerto de pares fue reasignado a ${assigned} (configurado ${configured}). Haga coincidir el puerto externo en Red de pares.',
    '113':
      'Solo saliente en los puertos ${peerPort}/${quicPort}. Active una IP pública en Red de pares para pares entrantes.',
    '114':
      'La puerta de enlace entrante de Red de pares no coincide con la puerta de enlace saliente. Termine de cambiar ambas a la misma puerta de enlace.',
    '115':
      'Se anuncia ${advertised} en lugar de ${expected}. Esperando actualización de ENR o reinicie Nimbus.',
    '116': 'Entrante y saliente listos en ${ip}:${peerPort}/${quicPort}',
    '117':
      'Entrante y saliente listos en ${ip}:${peerPort}/${quicPort}; ${count} dirección(es) pública(s) más activadas',
    '118': 'Sincronización de consenso completada',
    '119':
      'Nimbus ha terminado de sincronizar la cadena beacon de Ethereum. Finalizado — no confíes, verifica. ⧫',
    '120': 'Espacio en disco',
    '121':
      'Espacio en disco críticamente bajo: ${free} libres de ${total}. Libere espacio o cambie a un volumen más grande.',
    '122':
      '${free} libres de ${total} (bajo — considere liberar espacio o cambiar a un volumen más grande)',
    '123': '${free} libres de ${total}',
    '124': 'Comprobando el espacio en disco',
    '125': 'Origen del punto de control',
    '126':
      'Elija un servidor comunitario de punto de control para mainnet o introduzca una URL de API beacon personalizada. Elija un proveedor de confianza y verifique la raíz finalizada con una fuente independiente.',
    '127': 'Servidor comunitario de punto de control',
    '128': 'Servidor',
    '129':
      'Servidores HTTPS públicos de la lista comunitaria de sincronización por punto de control de Ethereum.',
    '130': 'URL de API beacon personalizada',
    '131':
      'URL HTTP o HTTPS de una API beacon de Ethereum mainnet de confianza.',
    '132': 'Raíz de bloque de confianza (opcional)',
    '133':
      'Raíz de bloque finalizada opcional de 32 bytes (0x...) de una fuente independiente para fijar la verificación de cliente ligero del punto de control descargado.',
    '134': 'Sincronización por punto de control',
    '135':
      'Restablece la base de datos de consenso y sincroniza a un punto de control finalizado reciente en minutos en lugar de semanas.',
    '136':
      'Esto elimina la base de datos de consenso de Nimbus existente (/chain/nimbus/db) y descarga un estado finalizado reciente de la API beacon elegida. Las claves de validador no se tocan. Un servidor malicioso puede engañar a su nodo a menos que verifique la raíz finalizada de forma independiente o proporcione una raíz de bloque de confianza.',
    '137': 'Mantenimiento',
    '138':
      'Elija un almacenamiento disponible con acceso de lectura y escritura antes de ejecutar la sincronización por punto de control.',
    '139':
      'Introduzca una raíz de bloque hexadecimal válida de 32 bytes (64 caracteres hexadecimales, prefijo 0x opcional).',
    '140': 'Error en la sincronización por punto de control: ${detail}',
    '141': 'Sincronización por punto de control completada',
    '142':
      'Se descargó el estado finalizado desde ${url}. Inicie Nimbus para terminar de ponerse al día con la cabecera de la cadena.',
    '143': 'Sincronización inicial por punto de control',
    '144':
      'Se usa al inicializar una base de datos de consenso vacía para que Nimbus sincronice en minutos en lugar de semanas. Para resincronizar una base de datos existente desde un punto de control, detenga Nimbus y ejecute Mantenimiento → Sincronización por punto de control.',
    '145': 'Servidor comunitario de punto de control (recomendado)',
    '146': 'Sincronizar desde génesis (2–3+ semanas)',
    '147': 'Consenso al día; esperando la sincronización de ejecución',
    '148':
      'En la cabecera (esperando ejecución); completando historial: ${percent}% (${rate} ranuras/s, ~${eta} restantes)',
    '149':
      'En la cabecera (esperando ejecución); preparando el relleno histórico',
    '150':
      'En la cabecera (ranura ${slot}); esperando la sincronización de ejecución',
    '151':
      'Sincronización hacia adelante: ${percent}% (${remaining} ranuras atrás, ${rate} ranuras/s, ~${eta} restantes)',
    '152':
      'Sincronización hacia adelante: ${percent}% (${rate} ranuras/s, ~${eta} restantes)',
    '153': 'Sincronización hacia adelante: esperando pares',
    '154':
      'Sincronización hacia adelante: inicializando y calculando el progreso',
    '155':
      'Sincronización hacia adelante: alcanzando la cabecera de la cadena beacon',
    '156':
      'Sincronización hacia adelante: ${percent}% (${remaining} ranuras atrás; quedan unos ${duration})',
    '157':
      'Sincronización hacia adelante: ${percent}% (${remaining} ranuras atrás)',
    '158':
      'Consenso sincronizado (completando historial: ${percent}%, ~${eta} restantes)',
    '159': 'Errores de base de datos / disco',
    '160': 'Errores críticos / falta de memoria',
    '161': 'Errores de autenticación JWT de ejecución',
    '162': 'Errores de comunicación con el motor de ejecución',
    '163': 'Desfase de reloj / retraso alto de ranuras',
    '164': 'Otros errores',
    '165': 'Resumen de registros',
    '166':
      'Ver un resumen por categorías de las advertencias y errores recientes detectados en los registros de Nimbus.',
    '167': 'Resumen de registros',
    '168':
      'Todavía no se ha registrado telemetría de registros. Inicie Nimbus e inténtelo de nuevo.',
    '169': 'Limpio — no se detectaron problemas',
    '170': 'Advertencia — se detectaron problemas recurrentes',
    '171': 'Fallo — se detectó un problema que requiere acción',
    '172': 'Estado: ${status}',
    '173': 'Inicio de sesión: ${time}',
    '174': 'Última actualización: ${time}',
    '175': 'Líneas analizadas: ${scanned} (ruido benigno ignorado: ${ignored})',
    '176': 'Desglose por categoría (últimos ${minutes} min / total de sesión):',
    '177': ' (última vez ${time})',
    '178': 'Líneas de registro relevantes recientes:',
    '179':
      'No se registraron errores ni advertencias relevantes en esta ejecución.',
    '180':
      'Los registros de Nimbus están limpios. Los mensajes benignos de inicio y el tráfico normal de pares se filtran automáticamente.',
    '181': 'Copie este resumen si necesita ayuda en el soporte de Start9.',
    '182': 'Salud de registros',
    '183': 'No se detectaron problemas',
    '184':
      'Se detectó un error de base de datos o disco. Revise Espacio en disco y el estado de la unidad, o ejecute Mantenimiento → Sincronización por punto de control si la base está dañada.',
    '185': 'Error de base de datos o disco de Nimbus',
    '186':
      'Se detectó un error crítico o de falta de memoria en los registros de Nimbus. Revise la RAM del servidor y ejecute Mantenimiento → Resumen de registros.',
    '187': 'Error crítico de Nimbus',
    '188':
      'El motor de ejecución rechazó la autenticación (desajuste de JWT). Reinicie Nimbus o Nethermind para reconectar.',
    '189': 'Error de autenticación de ejecución de Nimbus',
    '190':
      'Se detectó un retraso alto de ranuras o desfase de reloj (${count} ranuras recientes). Revise la hora del sistema StartOS y la carga de CPU/disco.',
    '191': 'Desfase de reloj o carga alta en Nimbus',
    '192':
      'Errores repetidos al comunicarse con Nethermind (${count} en 5 min). Revise el estado de Nethermind o ejecute Mantenimiento → Resumen de registros.',
    '193':
      '${count} errores recurrentes en los últimos 15 minutos. Ejecute Mantenimiento → Resumen de registros para ver detalles.',
    '194': 'Advertencias de desfase de reloj del sistema',
    '195': 'Alta carga del servidor / retrasos de ranuras',
    '196':
      'Se detectó desfase de reloj del sistema en los registros de Nimbus (${count} advertencias recientes). Revise la sincronización NTP de StartOS.',
    '197': 'Desfase de reloj del sistema en Nimbus',
    '198':
      'Alta carga del servidor detectada (${count} ranuras retrasadas en 5 min). Revise la carga de CPU o disco.',
    '199': 'La API de consenso está ocupada; reintentando…',
    '200':
      'El recuento de pares no está disponible temporalmente; reintentando…',
  },
  de_DE: {
    '98': 'Peer-Netzwerk',
    '99': 'Peer-Erkennung, TCP und QUIC. Wählen Sie hier ein Gateway. Der ausgehende Datenverkehr wird separat in den Diensteinstellungen festgelegt; wählen Sie dort bei Bedarf dasselbe Gateway.',
    '100':
      'TCP- und UDP-Peer-Port. Wählen Sie einen Port neben dem QUIC-Port. Eine Portänderung setzt die Auswahl der öffentlichen Adresse zurück.',
    '101': 'UDP-QUIC-Port. Wählen Sie einen Port neben dem Peer-Port.',
    '102':
      'Peer- und QUIC-Port müssen benachbart sein und dürfen den internen API-Port nicht verwenden.',
    '103': 'Lokale Ports, aktivierte Adressen und ausgehendes Gateway prüfen.',
    '104':
      'Diese Prüfung testet nur lokale Ports. StartOS bietet für gruppierte Ports derzeit keinen externen Porttest; UDP und QUIC werden nicht auf Erreichbarkeit geprüft.',
    '95': 'Es wird keine öffentliche Discovery-Adresse angekündigt. Prüfen Sie Schnittstellen und ausgehenden Datenverkehr.',
    '96': 'Ausgehendes Gateway: ${gateway}',
    '97': 'Aktivierte öffentliche QUIC-Adressen: ${addresses}',
    '71': 'Konsens: ${percent}% (${remaining} Slots zurück)',
    '72': 'Konsens: ${percent}% (${remaining} Slots zurück; noch etwa ${duration})',
    '73': '${days}T ${hours}Std',
    '74': '${hours}Std ${minutes}Min',
    '75': 'Angekündigte Peer-Adresse',
    '76': 'Keine öffentliche IPv4-Peer-Adresse aktiviert',
    '77': 'Warte auf eine öffentliche Discovery-Adresse',
    '78': 'Die angekündigte Adresse ${address} ist unter Schnittstellen nicht aktiviert',
    '79': '${address} wird angekündigt; ${count} weitere öffentliche Adresse(n) aktiviert',
    '80': '${address} wird angekündigt',
    '81': 'Ports testen',
    '82': 'Lokale Listener prüfen und den externen TCP-Test von StartOS finden.',
    '83': 'Netzwerk',
    '84': 'Lokal aktiv',
    '85': 'Lokal nicht aktiv',
    '86': 'Peer-TCP ${port}: ${state}',
    '87': 'Discovery-UDP ${port}: ${state}',
    '88': 'QUIC UDP ${port}: ${state}',
    '89': 'Lokale Adressen: ${addresses}',
    '90': 'Aktivierte öffentliche Peer-Adressen: ${addresses}',
    '91': 'Keine',
    '92': 'Ein externer Peer-Port weicht von den Einstellungen ab. Gleichen Sie diese an; beim Speichern startet Nimbus automatisch neu.',
    '93': 'Portdiagnose',
    '94': 'Diese Prüfungen testen nur lokale Listener. Für den öffentlichen TCP-Test öffnen Sie Schnittstellen → Konsens-Peers → die öffentliche Adresse → Adressanforderungen (Zahnrad) → Testen. UDP und QUIC aus dem Internet werden nicht geprüft.',

    '68': 'Einstellungen',
    '69': 'Konfiguration',
    '70': 'Eingehend: ${inbound}, ausgehend: ${outbound}',

    '67': 'Die Ausführungs-API ist erreichbar',
    '60': 'Nethermind konfigurieren',
    '61': 'Nimbus konfigurieren',
    '62': 'Speicher und Peer-Einstellungen wählen.',
    '63': 'Vor dem Start verfügbaren Speicher mit Lese- und Schreibzugriff wählen.',
    '64': 'Der Dienst startet bei Änderungen neu. Prüfen Sie, dass die angekündigten externen Ports den Peer-Ports entsprechen.',
    '65': 'Peers: ${count}',
    '66': 'Stellt die authentifizierte Ethereum-Ausführungs-Engine bereit.',

    '0': 'Speicher wählen',
    '1': 'StartOS-Datenlaufwerk',
    '2': 'Das zuvor gewählte Volume ist nicht verfügbar',
    '3': 'Blockchain-Speicher',
    '4': 'Gewähren Sie einem freigegebenen Volume unter System → Freigegebene Volumes Lese- und Schreibzugriff, bevor Sie es auswählen. Ein Speicherwechsel verschiebt keine vorhandenen Daten.',
    '5': 'Ausführungshistorie',
    '6': 'Die rollierende Aufbewahrung speichert etwa fünf Monate Blöcke und Belege. Post-Merge speichert die Historie seit dem Merge. Vollständig speichert alle Blöcke. Für ältere Daten kann eine erneute Synchronisierung nötig sein.',
    '7': 'Rollierende Aufbewahrung',
    '8': 'Historie seit dem Merge',
    '9': 'Vollständige Blockhistorie',
    '10': 'Peer-Port der Ausführung',
    '11': 'TCP- und UDP-Port für Ausführungs-Peers.',
    '12': 'Peer-Port des Konsenses',
    '13': 'TCP- und UDP-Port für Konsens-Peers.',
    '14': 'Konsens-QUIC-Port',
    '15': 'UDP-Port für Konsens-QUIC-Peers.',
    '16': 'Maximale Ausführungs-Peers',
    '17': 'Angestrebte Konsens-Peers',
    '18': 'URL einer vertrauenswürdigen Beacon-API',
    '19': 'Optionale URL für die erste Checkpoint-Synchronisierung. Verwenden Sie nur einen vertrauenswürdigen Beacon-Knoten.',
    '20': 'Ethereum-Knoten konfigurieren',
    '21': 'Speicher, Peer-Ports, Historie und Peer-Grenzen auswählen.',
    '22': 'Wählen Sie einen Speicherort.',
    '23': 'Gewähren Sie Lese- und Schreibzugriff auf das gewählte Volume und versuchen Sie es erneut.',
    '24': 'Peer-Ports müssen verschieden sein und dürfen keinen internen API-Port verwenden.',
    '25': 'Geben Sie eine gültige HTTP- oder HTTPS-URL der Beacon-API ein.',
    '26': 'Konfiguration gespeichert',
    '27': 'Die Clients starten bei Änderungen neu. Prüfen Sie, ob die angekündigten externen Ports den Peer-Ports entsprechen.',
    '28': 'Wählen Sie vor dem Start einen verfügbaren Speicher mit Lese- und Schreibzugriff.',
    '29': 'Wallet-RPC',
    '30': 'Ethereum-JSON-RPC für vertrauenswürdige Wallets und Anwendungen.',
    '31': 'Ausführungs-Peers',
    '32': 'TCP für Ausführungs-Peers und UDP für die Erkennung.',
    '33': 'Konsens-Peers',
    '34': 'TCP für Konsens-Peers und UDP für die Erkennung.',
    '35': 'Konsens-QUIC',
    '36': 'QUIC für Konsens-Peers über UDP.',
    '37': 'Ausführungs-RPC',
    '38': 'Die Ausführungs-Engine ist bereit',
    '39': 'Warten auf die Ausführungs-Engine',
    '40': 'Konsens-API',
    '41': 'Die Konsens-API ist bereit',
    '42': 'Warten auf die Konsens-API',
    '43': 'Ausführungssynchronisierung',
    '44': 'Die Ausführung wird synchronisiert',
    '45': 'Ausführung bereit; wartet auf Konsens',
    '46': 'Ausführung synchronisiert',
    '47': 'Ausführungs-RPC nicht verfügbar',
    '48': 'Konsenssynchronisierung',
    '49': 'Konsens wartet auf Ausführung',
    '50': 'Konsens wird synchronisiert',
    '51': 'Konsens synchronisiert',
    '52': 'Konsens-API nicht verfügbar',
    '53': 'Peer-Ports',
    '54': 'Warten auf Peer-Port-Zuweisungen',
    '55': 'Ein Peer-Port wurde neu zugewiesen. Stellen Sie den externen Port auf den konfigurierten Peer-Port ein.',
    '56': 'Peer-Ports entsprechen den externen Zuweisungen',
    '57': 'Peers',
    '58': 'Ausführung: ${execution}; Konsens: ${consensus}',
    '59': 'Peer-Zahlen sind nicht verfügbar',
    '105':
      'Dieses Gerät hat weniger als 16 GB RAM. Der gleichzeitige Betrieb von Nimbus und einem Ausführungsclient kann zu Abstürzen wegen Speichermangels führen. Halten Sie die Peer-Limits niedrig und vermeiden Sie andere speicherintensive Dienste.',
    '106': 'StartOS-Datenlaufwerk (${free} frei / ${total})',
    '107':
      'Gewähren Sie Lese-/Schreibzugriff auf ein freigegebenes Volume unter System → Freigegebene Volumes, bevor Sie es auswählen. Ein bereinigter Mainnet-Konsens benötigt mindestens 150 GiB. Ein Speicherwechsel verschiebt keine vorhandenen Daten.',
    '108':
      'TCP- und UDP-Peer-Port. QUIC verwendet automatisch den nächsten Port (+1). Eine Änderung setzt die Auswahl der öffentlichen Adresse zurück und startet Nimbus neu.',
    '109':
      'Höhere Peer-Limits verbrauchen mehr RAM und Bandbreite. Auf Geräten mit weniger als 16 GB RAM auf 100 begrenzt.',
    '110':
      'Das StartOS-Datenlaufwerk (${total}) ist zu klein für Ethereum-Mainnet-Konsens (mindestens 150 GiB erforderlich). Wählen Sie stattdessen ein größeres freigegebenes Volume.',
    '111': 'Peer- und QUIC-Ports dürfen nicht den internen API-Port verwenden.',
    '112':
      'Peer-Port wurde auf ${assigned} umgeleitet (konfiguriert ${configured}). Passen Sie den externen Port unter Peer-Netzwerk an.',
    '113':
      'Nur ausgehend auf den Ports ${peerPort}/${quicPort}. Aktivieren Sie eine öffentliche IP unter Peer-Netzwerk für eingehende Peers.',
    '114':
      'Eingehendes Peer-Netzwerk-Gateway stimmt nicht mit dem ausgehenden Gateway überein. Stellen Sie beide auf dasselbe Gateway um.',
    '115':
      'Ankündigung von ${advertised} statt ${expected}. Warten auf ENR-Aktualisierung oder Nimbus neu starten.',
    '116': 'Eingehend und ausgehend bereit auf ${ip}:${peerPort}/${quicPort}',
    '117':
      'Eingehend und ausgehend bereit auf ${ip}:${peerPort}/${quicPort}; ${count} weitere öffentliche Adresse(n) aktiviert',
    '118': 'Konsens-Synchronisierung abgeschlossen',
    '119':
      'Nimbus hat die Synchronisierung der Ethereum-Beacon-Chain abgeschlossen. Finalisiert — vertraue nicht, überprüfe. ⧫',
    '120': 'Speicherplatz',
    '121':
      'Kritisch wenig Speicherplatz: ${free} frei von ${total}. Geben Sie Speicherplatz frei oder wechseln Sie zu einem größeren Volume.',
    '122':
      '${free} frei von ${total} (niedrig — Speicherplatz freigeben oder auf ein größeres Volume wechseln)',
    '123': '${free} frei von ${total}',
    '124': 'Speicherplatz wird geprüft',
    '125': 'Checkpoint-Quelle',
    '126':
      'Wählen Sie einen Community-Mainnet-Checkpoint-Endpunkt oder geben Sie eine eigene Beacon-API-URL ein. Wählen Sie einen vertrauenswürdigen Anbieter und prüfen Sie den finalisierten Root über eine unabhängige Quelle.',
    '127': 'Community-Checkpoint-Endpunkt',
    '128': 'Endpunkt',
    '129':
      'Öffentliche HTTPS-Endpunkte aus der von der Ethereum-Community gepflegten Checkpoint-Sync-Liste.',
    '130': 'Eigene Beacon-API-URL',
    '131':
      'HTTP- oder HTTPS-URL einer vertrauenswürdigen Ethereum-Mainnet-Beacon-API.',
    '132': 'Vertrauenswürdiger Block-Root (optional)',
    '133':
      'Optionaler 32-Byte-finalisierter Block-Root (0x...) aus einer unabhängigen Quelle zur Light-Client-Prüfung des heruntergeladenen Checkpoints.',
    '134': 'Checkpoint-Synchronisierung',
    '135':
      'Setzt die Konsens-Datenbank zurück und synchronisiert in Minuten statt Wochen zu einem aktuellen finalisierten Checkpoint.',
    '136':
      'Dies löscht die vorhandene Nimbus-Konsens-Datenbank (/chain/nimbus/db) und lädt einen aktuellen finalisierten Zustand von der gewählten Beacon-API herunter. Validator-Schlüssel bleiben unberührt. Ein bösartiger Endpunkt kann Ihren Knoten täuschen, sofern Sie den finalisierten Root nicht unabhängig prüfen oder einen vertrauenswürdigen Block-Root angeben.',
    '137': 'Wartung',
    '138':
      'Wählen Sie verfügbaren Speicher mit Lese-/Schreibzugriff, bevor Sie die Checkpoint-Synchronisierung ausführen.',
    '139':
      'Geben Sie einen gültigen 32-Byte-Hex-Block-Root ein (64 Hexadezimalzeichen, optionales 0x-Präfix).',
    '140': 'Checkpoint-Synchronisierung fehlgeschlagen: ${detail}',
    '141': 'Checkpoint-Synchronisierung abgeschlossen',
    '142':
      'Finalisierter Zustand von ${url} heruntergeladen. Starten Sie Nimbus, um zur Kettenspitze aufzuholen.',
    '143': 'Erste Checkpoint-Synchronisierung',
    '144':
      'Wird beim Initialisieren einer leeren Konsens-Datenbank verwendet, damit Nimbus in Minuten statt Wochen synchronisiert. Um eine vorhandene Datenbank neu ab einem Checkpoint zu synchronisieren, stoppen Sie Nimbus und führen Sie Wartung → Checkpoint-Synchronisierung aus.',
    '145': 'Community-Checkpoint-Endpunkt (empfohlen)',
    '146': 'Von Genesis synchronisieren (2–3+ Wochen)',
    '147': 'Konsens an der Spitze; warten auf Ausführungs-Synchronisierung',
    '148':
      'An der Spitze (warten auf Ausführung); Historie wird nachgeladen: ${percent}% (${rate} Slots/s, ~${eta} verbleibend)',
    '149':
      'An der Spitze (warten auf Ausführung); historischer Nachlauf wird vorbereitet',
    '150':
      'An der Spitze (Slot ${slot}); warten auf Ausführungs-Synchronisierung',
    '151':
      'Vorwärts-Sync: ${percent}% (${remaining} Slots zurück, ${rate} Slots/s, ~${eta} verbleibend)',
    '152': 'Vorwärts-Sync: ${percent}% (${rate} Slots/s, ~${eta} verbleibend)',
    '153': 'Vorwärts-Sync: warten auf Peers',
    '154': 'Vorwärts-Sync: Initialisierung und Fortschrittsberechnung',
    '155': 'Vorwärts-Sync: Aufholen zur Beacon-Chain-Spitze',
    '156':
      'Vorwärts-Sync: ${percent}% (${remaining} Slots zurück; etwa ${duration} verbleibend)',
    '157': 'Vorwärts-Sync: ${percent}% (${remaining} Slots zurück)',
    '158':
      'Konsens synchronisiert (Historie wird nachgeladen: ${percent}%, ~${eta} verbleibend)',
    '159': 'Datenbank- / Festplattenfehler',
    '160': 'Kritische / Speichermangel-Fehler',
    '161': 'Ausführungs-JWT-Authentifizierungsfehler',
    '162': 'Kommunikationsfehler mit der Ausführungs-Engine',
    '163': 'Uhrzeitabweichung / hohe Slot-Verzögerung',
    '164': 'Sonstige Fehler',
    '165': 'Protokollzusammenfassung',
    '166':
      'Kategorisierte Zusammenfassung aktueller Warnungen und Fehler aus den Nimbus-Protokollen anzeigen.',
    '167': 'Protokollzusammenfassung',
    '168':
      'Es wurden noch keine Protokolldaten erfasst. Starten Sie Nimbus und versuchen Sie es erneut.',
    '169': 'Sauber — keine Probleme erkannt',
    '170': 'Warnung — wiederkehrende Probleme erkannt',
    '171': 'Fehler — handlungsbedürftiges Problem erkannt',
    '172': 'Status: ${status}',
    '173': 'Sitzung gestartet: ${time}',
    '174': 'Zuletzt aktualisiert: ${time}',
    '175':
      'Geprüfte Zeilen: ${scanned} (harmloses Rauschen ignoriert: ${ignored})',
    '176':
      'Aufschlüsselung nach Kategorie (letzte ${minutes} Min. / Sitzung gesamt):',
    '177': ' (zuletzt ${time})',
    '178': 'Aktuelle relevante Protokollzeilen:',
    '179':
      'In diesem Lauf wurden keine relevanten Fehler oder Warnungen erfasst.',
    '180':
      'Die Nimbus-Protokolle sehen sauber aus. Harmlose Startmeldungen und normaler Peer-Verkehr werden automatisch gefiltert.',
    '181':
      'Kopieren Sie diese Zusammenfassung, wenn Sie Hilfe im Start9-Support benötigen.',
    '182': 'Protokollzustand',
    '183': 'Keine Probleme erkannt',
    '184':
      'Datenbank- oder Festplattenfehler erkannt. Prüfen Sie Speicherplatz und Laufwerksstatus oder führen Sie Wartung → Checkpoint-Synchronisierung aus, falls die Datenbank beschädigt ist.',
    '185': 'Nimbus-Datenbank- oder Festplattenfehler',
    '186':
      'Kritischer Fehler oder Speichermangel in den Nimbus-Protokollen erkannt. Prüfen Sie den Server-RAM und führen Sie Wartung → Protokollzusammenfassung aus.',
    '187': 'Kritischer Nimbus-Fehler',
    '188':
      'Ausführungs-Engine lehnte Authentifizierung ab (JWT-Konflikt). Starten Sie Nimbus oder Nethermind neu.',
    '189': 'Nimbus-Ausführungs-Authentifizierungsfehler',
    '190':
      'Hohe Slot-Verzögerung oder Uhrzeitabweichung erkannt (${count} aktuelle Slots). Prüfen Sie StartOS-Systemzeit und CPU-/Festplattenlast.',
    '191': 'Nimbus-Uhrzeitabweichung oder hohe Last',
    '192':
      'Wiederholte Kommunikationsfehler mit Nethermind (${count} in 5 Min.). Prüfen Sie Nethermind oder führen Sie Wartung → Protokollzusammenfassung aus.',
    '193':
      '${count} wiederkehrende Fehler in den letzten 15 Minuten. Führen Sie Wartung → Protokollzusammenfassung für Details aus.',
    '194': 'Warnungen zu Systemuhrzeit-Abweichung',
    '195': 'Hohe Serverlast / verzögerte Slots',
    '196':
      'Abweichung der Systemuhrzeit in den Nimbus-Protokollen erkannt (${count} aktuelle Warnungen). Prüfen Sie die StartOS-NTP-Zeitsynchronisierung.',
    '197': 'Nimbus-Systemuhrzeit-Abweichung',
    '198':
      'Hohe Serverlast erkannt (${count} verzögerte Slots in 5 Min.). Prüfen Sie die CPU- oder Festplattenlast.',
    '199': 'Konsens-API ist ausgelastet; erneuter Versuch…',
    '200': 'Peer-Zahlen vorübergehend nicht verfügbar; erneuter Versuch…',
  },
  pl_PL: {
    '98': 'Sieć węzłów',
    '99': 'Wykrywanie węzłów, TCP i QUIC. Wybierz tutaj bramę. Ruch wychodzący ustawia się osobno w ustawieniu ruchu wychodzącego usługi; w razie potrzeby wybierz tam tę samą bramę.',
    '100':
      'Port TCP i UDP węzłów. Wybierz port sąsiadujący z portem QUIC. Zmiana portu resetuje wybór adresu publicznego.',
    '101': 'Port UDP QUIC. Wybierz port sąsiadujący z portem węzłów.',
    '102':
      'Porty węzłów i QUIC muszą być sąsiednie i nie mogą używać wewnętrznego portu API.',
    '103': 'Sprawdź lokalne porty, włączone adresy i bramę ruchu wychodzącego.',
    '104':
      'Te kontrole sprawdzają tylko porty lokalne. StartOS nie oferuje obecnie zewnętrznego testu zgrupowanych portów; dostępność UDP i QUIC nie jest sprawdzana.',
    '95': 'Nie ogłoszono publicznego adresu wykrywania. Sprawdź interfejsy i ruch wychodzący.',
    '96': 'Brama ruchu wychodzącego: ${gateway}',
    '97': 'Włączone publiczne adresy QUIC: ${addresses}',
    '71': 'Konsensus: ${percent}% (${remaining} slotów w tyle)',
    '72': 'Konsensus: ${percent}% (${remaining} slotów w tyle; pozostało około ${duration})',
    '73': '${days}d ${hours}godz',
    '74': '${hours}godz ${minutes}min',
    '75': 'Ogłaszany adres połączeń',
    '76': 'Nie włączono publicznego adresu IPv4 połączeń',
    '77': 'Oczekiwanie na publiczny adres wykrywania',
    '78': 'Ogłaszany adres ${address} nie jest włączony w Interfejsach',
    '79': 'Ogłaszany jest ${address}; włączono ${count} innych adresów publicznych',
    '80': 'Ogłaszany adres: ${address}',
    '81': 'Testuj porty',
    '82': 'Sprawdź lokalne porty i znajdź zewnętrzny test TCP StartOS.',
    '83': 'Sieć',
    '84': 'Nasłuchuje lokalnie',
    '85': 'Nie nasłuchuje lokalnie',
    '86': 'TCP połączeń ${port}: ${state}',
    '87': 'UDP wykrywania ${port}: ${state}',
    '88': 'QUIC UDP ${port}: ${state}',
    '89': 'Adresy lokalne: ${addresses}',
    '90': 'Włączone publiczne adresy połączeń: ${addresses}',
    '91': 'Brak',
    '92': 'Zewnętrzny port połączeń różni się od ustawień. Dopasuj je; zapisanie ustawień automatycznie uruchomi Nimbus ponownie.',
    '93': 'Diagnostyka portów',
    '94': 'Te kontrole sprawdzają tylko lokalny nasłuch. Aby sprawdzić publiczny TCP, otwórz Interfejsy → Połączenia konsensusu → adres publiczny → Wymagania adresu (koło zębate) → Testuj. Nie sprawdza to UDP ani QUIC z internetu.',

    '68': 'Ustawienia',
    '69': 'Konfiguracja',
    '70': 'Przychodzące: ${inbound}, wychodzące: ${outbound}',

    '67': 'API wykonawcze jest dostępne',
    '60': 'Konfiguruj Nethermind',
    '61': 'Konfiguruj Nimbus',
    '62': 'Wybierz pamięć i ustawienia połączeń.',
    '63': 'Przed uruchomieniem wybierz dostępną pamięć z prawem odczytu i zapisu.',
    '64': 'Usługa uruchamia się ponownie po zmianie ustawień. Sprawdź zgodność ogłaszanych portów z portami połączeń.',
    '65': 'Połączenia: ${count}',
    '66': 'Udostępnia uwierzytelniony silnik wykonawczy Ethereum.',

    '0': 'Wybierz pamięć',
    '1': 'Dysk danych StartOS',
    '2': 'Poprzednio wybrany wolumin jest niedostępny',
    '3': 'Pamięć łańcucha bloków',
    '4': 'Przed wyborem przyznaj woluminowi współdzielonemu dostęp do odczytu i zapisu w ustawieniach systemu. Zmiana pamięci nie przenosi istniejących danych.',
    '5': 'Historia wykonania',
    '6': 'Tryb kroczący zachowuje około pięciu miesięcy bloków i potwierdzeń. Post-Merge zachowuje historię od Merge. Pełny zachowuje całą historię bloków. Odzyskanie starszej historii może wymagać ponownej synchronizacji.',
    '7': 'Wygaśnięcie kroczące',
    '8': 'Historia od Merge',
    '9': 'Pełna historia bloków',
    '10': 'Port peerów wykonania',
    '11': 'Port TCP i UDP dla peerów wykonania.',
    '12': 'Port peerów konsensusu',
    '13': 'Port TCP i UDP dla peerów konsensusu.',
    '14': 'Port QUIC konsensusu',
    '15': 'Port UDP dla peerów QUIC konsensusu.',
    '16': 'Maksymalna liczba peerów wykonania',
    '17': 'Docelowa liczba peerów konsensusu',
    '18': 'URL zaufanego API beacon',
    '19': 'Opcjonalny URL do początkowej synchronizacji punktu kontrolnego. Używaj tylko zaufanego węzła beacon.',
    '20': 'Konfiguruj węzeł Ethereum',
    '21': 'Wybierz pamięć, porty peerów, historię i limity peerów.',
    '22': 'Wybierz miejsce przechowywania.',
    '23': 'Przyznaj dostęp do odczytu i zapisu dla wybranego woluminu i spróbuj ponownie.',
    '24': 'Porty peerów muszą być różne i nie mogą używać wewnętrznego portu API.',
    '25': 'Wpisz prawidłowy adres HTTP lub HTTPS API beacon.',
    '26': 'Zapisano konfigurację',
    '27': 'Klienty uruchomią się ponownie po zmianie ustawień. Sprawdź, czy ogłaszane porty zewnętrzne odpowiadają portom peerów.',
    '28': 'Przed uruchomieniem węzła Ethereum wybierz dostępną pamięć z dostępem do odczytu i zapisu.',
    '29': 'RPC portfela',
    '30': 'Ethereum JSON-RPC dla zaufanych portfeli i aplikacji.',
    '31': 'Peery wykonania',
    '32': 'TCP peerów wykonania i UDP wykrywania.',
    '33': 'Peery konsensusu',
    '34': 'TCP peerów konsensusu i UDP wykrywania.',
    '35': 'QUIC konsensusu',
    '36': 'QUIC peerów konsensusu przez UDP.',
    '37': 'RPC wykonania',
    '38': 'Silnik wykonania jest gotowy',
    '39': 'Oczekiwanie na silnik wykonania',
    '40': 'API konsensusu',
    '41': 'API konsensusu jest gotowe',
    '42': 'Oczekiwanie na API konsensusu',
    '43': 'Synchronizacja wykonania',
    '44': 'Trwa synchronizacja wykonania',
    '45': 'Wykonanie gotowe; oczekiwanie na konsensus',
    '46': 'Wykonanie zsynchronizowane',
    '47': 'RPC wykonania jest niedostępne',
    '48': 'Synchronizacja konsensusu',
    '49': 'Konsensus oczekuje na wykonanie',
    '50': 'Trwa synchronizacja konsensusu',
    '51': 'Konsensus zsynchronizowany',
    '52': 'API konsensusu jest niedostępne',
    '53': 'Porty peerów',
    '54': 'Oczekiwanie na przypisanie portów peerów',
    '55': 'Port peera został ponownie przypisany. Ustaw port zewnętrzny zgodnie ze skonfigurowanym portem peera.',
    '56': 'Porty peerów odpowiadają przypisaniom zewnętrznym',
    '57': 'Peery',
    '58': 'Wykonanie: ${execution}; konsensus: ${consensus}',
    '59': 'Liczba peerów jest niedostępna',
    '105':
      'To urządzenie ma mniej niż 16 GB pamięci RAM. Uruchamianie Nimbusa razem z klientem wykonawczym może powodować błędy braku pamięci. Utrzymuj niskie limity peerów i unikaj innych ciężkich usług.',
    '106': 'Dysk danych StartOS (${free} wolnego / ${total})',
    '107':
      'Przyznaj dostęp do odczytu i zapisu woluminowi współdzielonemu w Woluminach współdzielonych systemu przed jego wyborem. Przycięty konsensus mainnet wymaga co najmniej 150 GiB. Zmiana pamięci nie przenosi danych.',
    '108':
      'Port TCP i UDP peerów. QUIC automatycznie używa następnego portu (+1). Zmiana tego portu resetuje wybór adresu publicznego i restartuje Nimbusa.',
    '109':
      'Wyższe limity peerów zużywają więcej RAM i pasma. Ograniczone do 100 na urządzeniach z mniej niż 16 GB RAM.',
    '110':
      'Dysk danych StartOS (${total}) jest za mały dla konsensusu Ethereum Mainnet (wymagane co najmniej 150 GiB). Wybierz większy wolumin współdzielony.',
    '111': 'Porty peerów i QUIC nie mogą używać wewnętrznego portu API.',
    '112':
      'Port peerów został ponownie przypisany do ${assigned} (skonfigurowano ${configured}). Dopasuj port zewnętrzny w Sieci węzłów.',
    '113':
      'Tylko ruch wychodzący na portach ${peerPort}/${quicPort}. Włącz publiczne IP w Sieci węzłów dla połączeń przychodzących.',
    '114':
      'Brama przychodząca Sieci węzłów nie pasuje do bramy wychodzącej. Zakończ przełączanie obu na tę samą bramę.',
    '115':
      'Rozgłaszany adres to ${advertised} zamiast ${expected}. Oczekiwanie na aktualizację ENR lub zrestartuj Nimbusa.',
    '116':
      'Ruch przychodzący i wychodzący gotowy na ${ip}:${peerPort}/${quicPort}',
    '117':
      'Ruch przychodzący i wychodzący gotowy na ${ip}:${peerPort}/${quicPort}; włączono jeszcze ${count} adres(ów) publicznych',
    '118': 'Synchronizacja konsensusu zakończona',
    '119':
      'Nimbus zakończył synchronizację łańcucha beacon Ethereum. Sfinalizowano — nie ufaj, weryfikuj. ⧫',
    '120': 'Miejsce na dysku',
    '121':
      'Krytycznie mało miejsca na dysku: ${free} wolnego z ${total}. Zwolnij miejsce lub przełącz na większy wolumin.',
    '122':
      '${free} wolnego z ${total} (mało — rozważ zwolnienie miejsca lub większy wolumin)',
    '123': '${free} wolnego z ${total}',
    '124': 'Sprawdzanie miejsca na dysku',
    '125': 'Źródło punktu kontrolnego',
    '126':
      'Wybierz społecznościowy punkt końcowy mainnetu lub wpisz własny adres URL API beacon. Wybierz zaufanego dostawcę i zweryfikuj sfinalizowany skrót w niezależnym źródle.',
    '127': 'Społecznościowy punkt kontrolny',
    '128': 'Punkt końcowy',
    '129':
      'Publiczne punkty HTTPS z utrzymywanej przez społeczność Ethereum listy synchronizacji z punktu kontrolnego.',
    '130': 'Własny adres URL API beacon',
    '131': 'Adres HTTP lub HTTPS zaufanego API beacon sieci głównej Ethereum.',
    '132': 'Zaufany skrót bloku (opcjonalnie)',
    '133':
      'Opcjonalny 32-bajtowy sfinalizowany skrót bloku (0x...) z niezależnego źródła do przypięcia weryfikacji lekkiego klienta pobranego punktu kontrolnego.',
    '134': 'Synchronizacja z punktu kontrolnego',
    '135':
      'Resetuje bazę danych konsensusu i synchronizuje się do ostatniego sfinalizowanego punktu kontrolnego w kilka minut zamiast tygodni.',
    '136':
      'Spowoduje to usunięcie istniejącej bazy danych konsensusu Nimbus (/chain/nimbus/db) i pobranie ostatniego sfinalizowanego stanu z wybranego API beacon. Klucze walidatora pozostają nietknięte. Złośliwy punkt końcowy może wprowadzić węzeł w błąd, jeśli nie zweryfikujesz sfinalizowanego skrótu niezależnie lub nie podasz zaufanego skrótu bloku.',
    '137': 'Konserwacja',
    '138':
      'Wybierz dostępny magazyn z prawem odczytu i zapisu przed uruchomieniem synchronizacji z punktu kontrolnego.',
    '139':
      'Wpisz prawidłowy 32-bajtowy szesnastkowy skrót bloku (64 znaki szesnastkowe, opcjonalny prefiks 0x).',
    '140': 'Synchronizacja z punktu kontrolnego nie powiodła się: ${detail}',
    '141': 'Synchronizacja z punktu kontrolnego zakończona',
    '142':
      'Pobrano sfinalizowany stan z ${url}. Uruchom Nimbusa, aby dogonić głowę łańcucha.',
    '143': 'Początkowa synchronizacja z punktu kontrolnego',
    '144':
      'Używana przy inicjalizacji pustej bazy konsensusu, aby Nimbus zsynchronizował się w kilka minut zamiast tygodni. Aby ponownie zsynchronizować istniejącą bazę z punktu kontrolnego, zatrzymaj Nimbusa i uruchom Konserwacja → Synchronizacja z punktu kontrolnego.',
    '145': 'Społecznościowy punkt kontrolny (zalecane)',
    '146': 'Synchronizuj od genezy (2–3+ tygodnie)',
    '147': 'Konsensus na bieżąco; oczekiwanie na synchronizację wykonania',
    '148':
      'Na bieżąco (oczekiwanie na wykonanie); uzupełnianie historii: ${percent}% (${rate} slotów/s, ~${eta} pozostało)',
    '149':
      'Na bieżąco (oczekiwanie na wykonanie); przygotowywanie uzupełniania historii',
    '150': 'Na bieżąco (slot ${slot}); oczekiwanie na synchronizację wykonania',
    '151':
      'Synchronizacja w przód: ${percent}% (${remaining} slotów w tyle, ${rate} slotów/s, ~${eta} pozostało)',
    '152':
      'Synchronizacja w przód: ${percent}% (${rate} slotów/s, ~${eta} pozostało)',
    '153': 'Synchronizacja w przód: oczekiwanie na peery',
    '154': 'Synchronizacja w przód: inicjalizacja i obliczanie postępu',
    '155': 'Synchronizacja w przód: doganianie głowy łańcucha beacon',
    '156':
      'Synchronizacja w przód: ${percent}% (${remaining} slotów w tyle; ok. ${duration} pozostało)',
    '157': 'Synchronizacja w przód: ${percent}% (${remaining} slotów w tyle)',
    '158':
      'Konsensus zsynchronizowany (uzupełnianie historii: ${percent}%, ~${eta} pozostało)',
    '159': 'Błędy bazy danych / dysku',
    '160': 'Błędy krytyczne / braku pamięci',
    '161': 'Błędy uwierzytelniania JWT wykonania',
    '162': 'Błędy komunikacji z silnikiem wykonania',
    '163': 'Rozbieżność zegara / duże opóźnienie slotów',
    '164': 'Inne błędy',
    '165': 'Podsumowanie logów',
    '166':
      'Wyświetl skategoryzowane podsumowanie ostatnich ostrzeżeń i błędów wykrytych w logach Nimbusa.',
    '167': 'Podsumowanie logów',
    '168':
      'Nie zapisano jeszcze telemetrii logów. Uruchom Nimbusa i spróbuj ponownie.',
    '169': 'Czysto — nie wykryto problemów',
    '170': 'Ostrzeżenie — wykryto powtarzające się problemy',
    '171': 'Awaria — wykryto problem wymagający działania',
    '172': 'Status: ${status}',
    '173': 'Początek sesji: ${time}',
    '174': 'Ostatnia aktualizacja: ${time}',
    '175': 'Przeskanowano linii: ${scanned} (zignorowano szum: ${ignored})',
    '176': 'Podział na kategorie (ostatnie ${minutes} min / razem w sesji):',
    '177': ' (ostatnio ${time})',
    '178': 'Ostatnie istotne linie logów:',
    '179':
      'W tym uruchomieniu nie zarejestrowano istotnych błędów ani ostrzeżeń.',
    '180':
      'Logi Nimbusa wyglądają czysto. Nieszkodliwe komunikaty startowe i zwykły ruch peerów są filtrowane automatycznie.',
    '181':
      'Skopiuj to podsumowanie, jeśli potrzebujesz pomocy w wsparciu Start9.',
    '182': 'Stan logów',
    '183': 'Nie wykryto problemów',
    '184':
      'Wykryto błąd bazy danych lub dysku. Sprawdź Miejsce na dysku i stan nośnika albo uruchom Konserwacja → Synchronizacja z punktu kontrolnego, jeśli baza jest uszkodzona.',
    '185': 'Błąd bazy danych lub dysku Nimbusa',
    '186':
      'Wykryto błąd krytyczny lub brak pamięci w logach Nimbusa. Sprawdź pamięć RAM serwera i uruchom Konserwacja → Podsumowanie logów.',
    '187': 'Krytyczny błąd Nimbusa',
    '188':
      'Silnik wykonania odrzucił uwierzytelnianie (niezgodność JWT). Zrestartuj Nimbusa lub Netherminda.',
    '189': 'Błąd uwierzytelniania wykonania Nimbusa',
    '190':
      'Wykryto duże opóźnienie slotów lub rozbieżność zegara (${count} ostatnich slotów). Sprawdź czas systemowy StartOS i obciążenie CPU/dysku.',
    '191': 'Rozbieżność zegara lub duże obciążenie Nimbusa',
    '192':
      'Powtarzające się błędy komunikacji z Nethermindem (${count} w 5 min). Sprawdź stan Netherminda lub uruchom Konserwacja → Podsumowanie logów.',
    '193':
      '${count} powtarzających się błędów w ciągu ostatnich 15 minut. Uruchom Konserwacja → Podsumowanie logów po szczegóły.',
    '194': 'Ostrzeżenia o rozbieżności zegara systemowego',
    '195': 'Wysokie obciążenie serwera / opóźnienia slotów',
    '196':
      'Wykryto rozbieżność zegara systemowego w logach Nimbusa (${count} ostatnich ostrzeżeń). Sprawdź synchronizację czasu NTP w StartOS.',
    '197': 'Rozbieżność zegara systemowego w Nimbusie',
    '198':
      'Wykryto wysokie obciążenie serwera (${count} opóźnionych slotów w 5 min). Sprawdź obciążenie CPU lub dysku.',
    '199': 'API konsensusu jest zajęte; ponawianie…',
    '200': 'Liczba peerów chwilowo niedostępna; ponawianie…',
  },
  fr_FR: {
    '98': 'Réseau de pairs',
    '99': 'Découverte des pairs, TCP et QUIC. Choisissez une passerelle ici. Le trafic sortant se règle séparément dans le paramètre Trafic sortant du service ; choisissez-y la même passerelle si vous le souhaitez.',
    '100':
      'Port TCP et UDP des pairs. Choisissez un port adjacent au port QUIC. Modifier un port réinitialise la sélection de l’adresse publique.',
    '101': 'Port UDP QUIC. Choisissez un port adjacent au port des pairs.',
    '102':
      'Les ports des pairs et QUIC doivent être adjacents et ne peuvent pas utiliser le port API interne.',
    '103':
      'Vérifier les ports locaux, les adresses activées et la passerelle sortante.',
    '104':
      'Ces contrôles ne testent que les ports locaux. StartOS ne propose pas actuellement de test externe pour les ports regroupés ; l’accessibilité UDP et QUIC n’est pas testée.',
    '95': 'Aucune adresse publique de découverte n’est annoncée. Vérifiez les interfaces et le trafic sortant.',
    '96': 'Passerelle sortante : ${gateway}',
    '97': 'Adresses QUIC publiques activées : ${addresses}',
    '71': 'Consensus : ${percent}% (${remaining} créneaux de retard)',
    '72': 'Consensus : ${percent}% (${remaining} créneaux de retard ; environ ${duration} restants)',
    '73': '${days}j ${hours}h',
    '74': '${hours}h ${minutes}min',
    '75': 'Adresse annoncée aux pairs',
    '76': 'Aucune adresse IPv4 publique de pair activée',
    '77': 'En attente d’une adresse publique de découverte',
    '78': 'L’adresse annoncée ${address} n’est pas activée dans Interfaces',
    '79': 'Adresse annoncée : ${address} ; ${count} autre(s) adresse(s) publique(s) activée(s)',
    '80': 'Adresse annoncée : ${address}',
    '81': 'Tester les ports',
    '82': 'Vérifiez les ports locaux et trouvez le test TCP externe de StartOS.',
    '83': 'Réseau',
    '84': 'En écoute localement',
    '85': 'Pas d’écoute locale',
    '86': 'TCP des pairs ${port} : ${state}',
    '87': 'UDP de découverte ${port} : ${state}',
    '88': 'QUIC UDP ${port} : ${state}',
    '89': 'Adresses locales : ${addresses}',
    '90': 'Adresses publiques de pairs activées : ${addresses}',
    '91': 'Aucune',
    '92': 'Un port externe de pair diffère des paramètres. Faites-les correspondre ; l’enregistrement redémarre Nimbus automatiquement.',
    '93': 'Diagnostic des ports',
    '94': 'Ces vérifications ne testent que l’écoute locale. Pour tester le TCP public, ouvrez Interfaces → Pairs de consensus → l’adresse publique → Exigences de l’adresse (roue dentée) → Tester. Le test ne vérifie pas UDP ni QUIC depuis Internet.',

    '68': 'Paramètres',
    '69': 'Configuration',
    '70': 'Entrants : ${inbound}, sortants : ${outbound}',

    '67': 'L’API d’exécution est accessible',
    '60': 'Configurer Nethermind',
    '61': 'Configurer Nimbus',
    '62': 'Choisissez le stockage et les paramètres des pairs.',
    '63': 'Choisissez un stockage disponible en lecture et écriture avant de démarrer le service.',
    '64': 'Le service redémarre après modification. Vérifiez que les ports externes annoncés correspondent aux ports des pairs.',
    '65': 'Pairs : ${count}',
    '66': 'Fournit le moteur d’exécution Ethereum authentifié.',

    '0': 'Choisir le stockage',
    '1': 'Disque de données StartOS',
    '2': 'Le volume sélectionné précédemment est indisponible',
    '3': 'Stockage de la blockchain',
    '4': 'Accordez un accès en lecture et écriture à un volume partagé dans les volumes partagés du système avant de le sélectionner. Changer de stockage ne déplace pas les données existantes.',
    '5': 'Historique d’exécution',
    '6': 'La conservation glissante garde environ cinq mois de blocs et de reçus. Post-Merge garde l’historique depuis la Fusion. Complet garde tous les blocs. Récupérer plus d’historique peut nécessiter une nouvelle synchronisation.',
    '7': 'Expiration glissante',
    '8': 'Historique depuis la Fusion',
    '9': 'Historique complet des blocs',
    '10': 'Port des pairs d’exécution',
    '11': 'Port TCP et UDP des pairs d’exécution.',
    '12': 'Port des pairs de consensus',
    '13': 'Port TCP et UDP des pairs de consensus.',
    '14': 'Port QUIC de consensus',
    '15': 'Port UDP des pairs QUIC de consensus.',
    '16': 'Nombre maximal de pairs d’exécution',
    '17': 'Nombre cible de pairs de consensus',
    '18': 'URL d’API beacon de confiance',
    '19': 'URL facultative pour la synchronisation initiale par point de contrôle. Utilisez uniquement un nœud beacon de confiance.',
    '20': 'Configurer le nœud Ethereum',
    '21': 'Choisissez le stockage, les ports des pairs, l’historique et les limites de pairs.',
    '22': 'Choisissez un emplacement de stockage.',
    '23': 'Accordez l’accès en lecture et écriture au volume sélectionné, puis réessayez.',
    '24': 'Les ports des pairs doivent être distincts et ne peuvent pas utiliser un port d’API interne.',
    '25': 'Saisissez une URL HTTP ou HTTPS valide pour l’API beacon.',
    '26': 'Configuration enregistrée',
    '27': 'Les clients redémarrent lorsque les réglages changent. Vérifiez que les ports externes annoncés correspondent aux ports des pairs.',
    '28': 'Choisissez un stockage disponible avec accès en lecture et écriture avant de démarrer le nœud Ethereum.',
    '29': 'RPC du portefeuille',
    '30': 'JSON-RPC Ethereum pour les portefeuilles et applications de confiance.',
    '31': 'Pairs d’exécution',
    '32': 'TCP des pairs d’exécution et UDP de découverte.',
    '33': 'Pairs de consensus',
    '34': 'TCP des pairs de consensus et UDP de découverte.',
    '35': 'QUIC de consensus',
    '36': 'QUIC des pairs de consensus sur UDP.',
    '37': 'RPC d’exécution',
    '38': 'Le moteur d’exécution est prêt',
    '39': 'En attente du moteur d’exécution',
    '40': 'API de consensus',
    '41': 'L’API de consensus est prête',
    '42': 'En attente de l’API de consensus',
    '43': 'Synchronisation de l’exécution',
    '44': 'L’exécution se synchronise',
    '45': 'Exécution prête ; attente du consensus',
    '46': 'Exécution synchronisée',
    '47': 'RPC d’exécution indisponible',
    '48': 'Synchronisation du consensus',
    '49': 'Le consensus attend l’exécution',
    '50': 'Le consensus se synchronise',
    '51': 'Consensus synchronisé',
    '52': 'API de consensus indisponible',
    '53': 'Ports des pairs',
    '54': 'En attente de l’attribution des ports des pairs',
    '55': 'Un port de pair a été réattribué. Faites correspondre son port externe au port configuré.',
    '56': 'Les ports des pairs correspondent aux attributions externes',
    '57': 'Pairs',
    '58': 'Exécution : ${execution} ; consensus : ${consensus}',
    '59': 'Nombre de pairs indisponible',
    '105':
      'Cet appareil dispose de moins de 16 Go de RAM. Exécuter Nimbus avec un client d’exécution peut provoquer des plantages par manque de mémoire. Gardez les limites de pairs basses et évitez d’autres services lourds en parallèle.',
    '106': 'Disque de données StartOS (${free} libres / ${total})',
    '107':
      'Accordez l’accès lecture/écriture à un volume partagé dans Volumes partagés du système avant de le sélectionner. Le consensus élagué du mainnet nécessite au moins 150 Gio. Changer de stockage ne déplace pas les données.',
    '108':
      'Port TCP et UDP des pairs. QUIC utilise automatiquement le port suivant (+1). Modifier ce port réinitialise la sélection d’adresse publique et redémarre Nimbus.',
    '109':
      'Des limites de pairs plus élevées consomment plus de RAM et de bande passante. Limité à 100 sur les appareils avec moins de 16 Go de RAM.',
    '110':
      'Le disque de données StartOS (${total}) est trop petit pour le consensus Ethereum Mainnet (au moins 150 Gio requis). Sélectionnez un volume partagé plus grand.',
    '111':
      'Les ports des pairs et QUIC ne peuvent pas utiliser le port API interne.',
    '112':
      'Le port des pairs a été réattribué à ${assigned} (configuré ${configured}). Faites correspondre le port externe dans Réseau de pairs.',
    '113':
      'Sortant uniquement sur les ports ${peerPort}/${quicPort}. Activez une IP publique dans Réseau de pairs pour les pairs entrants.',
    '114':
      'La passerelle entrante de Réseau de pairs ne correspond pas à la passerelle sortante. Terminez de basculer les deux sur la même passerelle.',
    '115':
      'Annonce ${advertised} au lieu de ${expected}. En attente de mise à jour ENR ou redémarrez Nimbus.',
    '116': 'Entrant et sortant prêts sur ${ip}:${peerPort}/${quicPort}',
    '117':
      'Entrant et sortant prêts sur ${ip}:${peerPort}/${quicPort} ; ${count} autre(s) adresse(s) publique(s) activée(s)',
    '118': 'Synchronisation du consensus terminée',
    '119':
      'Nimbus a terminé la synchronisation de la chaîne beacon Ethereum. Finalisé — ne faites pas confiance, vérifiez. ⧫',
    '120': 'Espace disque',
    '121':
      'Espace disque critique : ${free} libres sur ${total}. Libérez de l’espace ou passez à un volume plus grand.',
    '122':
      '${free} libres sur ${total} (faible — envisagez de libérer de l’espace ou d’utiliser un volume plus grand)',
    '123': '${free} libres sur ${total}',
    '124': 'Vérification de l’espace disque',
    '125': 'Source du point de contrôle',
    '126':
      'Choisissez un serveur communautaire mainnet ou saisissez une URL d’API beacon personnalisée. Choisissez un fournisseur de confiance et vérifiez la racine finalisée auprès d’une source indépendante.',
    '127': 'Serveur communautaire de point de contrôle',
    '128': 'Serveur',
    '129':
      'Serveurs HTTPS publics issus de la liste communautaire Ethereum de synchronisation par point de contrôle.',
    '130': 'URL d’API beacon personnalisée',
    '131': 'URL HTTP ou HTTPS d’une API beacon Ethereum mainnet de confiance.',
    '132': 'Racine de bloc de confiance (optionnel)',
    '133':
      'Racine de bloc finalisée optionnelle de 32 octets (0x...) issue d’une source indépendante pour épingler la vérification client léger du point de contrôle téléchargé.',
    '134': 'Synchronisation par point de contrôle',
    '135':
      'Réinitialise la base de données de consensus et synchronise vers un point de contrôle finalisé récent en quelques minutes au lieu de semaines.',
    '136':
      'Cela supprime la base de données de consensus Nimbus existante (/chain/nimbus/db) et télécharge un état finalisé récent depuis l’API beacon choisie. Les clés de validateur ne sont pas touchées. Un serveur malveillant peut tromper votre nœud si vous ne vérifiez pas la racine finalisée indépendamment ou ne fournissez pas une racine de bloc de confiance.',
    '137': 'Maintenance',
    '138':
      'Choisissez un stockage disponible avec accès lecture/écriture avant de lancer la synchronisation par point de contrôle.',
    '139':
      'Saisissez une racine de bloc hexadécimale valide de 32 octets (64 caractères hexadécimaux, préfixe 0x optionnel).',
    '140': 'Échec de la synchronisation par point de contrôle : ${detail}',
    '141': 'Synchronisation par point de contrôle terminée',
    '142':
      'État finalisé téléchargé depuis ${url}. Démarrez Nimbus pour finir de rattraper la tête de chaîne.',
    '143': 'Synchronisation initiale par point de contrôle',
    '144':
      'Utilisée lors de l’initialisation d’une base de consensus vide afin que Nimbus synchronise en quelques minutes au lieu de semaines. Pour resynchroniser une base existante depuis un point de contrôle, arrêtez Nimbus et lancez Maintenance → Synchronisation par point de contrôle.',
    '145': 'Serveur communautaire de point de contrôle (recommandé)',
    '146': 'Synchroniser depuis la genèse (2–3+ semaines)',
    '147': 'Consensus à la tête ; en attente de la synchronisation d’exécution',
    '148':
      'À la tête (en attente d’exécution) ; remplissage de l’historique : ${percent}% (${rate} créneaux/s, ~${eta} restant)',
    '149':
      'À la tête (en attente d’exécution) ; préparation du remplissage de l’historique',
    '150':
      'À la tête (créneau ${slot}) ; en attente de la synchronisation d’exécution',
    '151':
      'Synchronisation avant : ${percent}% (${remaining} créneaux de retard, ${rate} créneaux/s, ~${eta} restant)',
    '152':
      'Synchronisation avant : ${percent}% (${rate} créneaux/s, ~${eta} restant)',
    '153': 'Synchronisation avant : en attente de pairs',
    '154': 'Synchronisation avant : initialisation et calcul de la progression',
    '155': 'Synchronisation avant : rattrapage de la tête de la chaîne beacon',
    '156':
      'Synchronisation avant : ${percent}% (${remaining} créneaux de retard ; environ ${duration} restant)',
    '157':
      'Synchronisation avant : ${percent}% (${remaining} créneaux de retard)',
    '158':
      'Consensus synchronisé (remplissage de l’historique : ${percent}%, ~${eta} restant)',
    '159': 'Erreurs de base de données / disque',
    '160': 'Erreurs critiques / manque de mémoire',
    '161': 'Erreurs d’authentification JWT d’exécution',
    '162': 'Erreurs de communication avec le moteur d’exécution',
    '163': 'Dérive d’horloge / retard élevé des créneaux',
    '164': 'Autres erreurs',
    '165': 'Résumé des journaux',
    '166':
      'Afficher un résumé catégorisé des avertissements et erreurs récents détectés dans les journaux de Nimbus.',
    '167': 'Résumé des journaux',
    '168':
      'Aucune télémétrie de journaux n’a encore été enregistrée. Démarrez Nimbus et réessayez.',
    '169': 'Propre — aucun problème détecté',
    '170': 'Avertissement — problèmes récurrents détectés',
    '171': 'Échec — problème nécessitant une action détecté',
    '172': 'Statut : ${status}',
    '173': 'Début de session : ${time}',
    '174': 'Dernière mise à jour : ${time}',
    '175': 'Lignes analysées : ${scanned} (bruit bénin ignoré : ${ignored})',
    '176':
      'Répartition par catégorie (${minutes} dernières min / total de session) :',
    '177': ' (vu à ${time})',
    '178': 'Lignes de journal notables récentes :',
    '179':
      'Aucune erreur ou avertissement notable enregistré durant cette session.',
    '180':
      'Les journaux de Nimbus semblent propres. Les messages bénins de démarrage et le trafic normal des pairs sont filtrés automatiquement.',
    '181':
      'Copiez ce résumé si vous avez besoin d’aide auprès du support Start9.',
    '182': 'Santé des journaux',
    '183': 'Aucun problème détecté',
    '184':
      'Erreur de base de données ou de disque détectée. Vérifiez l’espace disque et l’état du lecteur, ou exécutez Maintenance → Synchronisation par point de contrôle si la base est corrompue.',
    '185': 'Erreur de base de données ou de disque Nimbus',
    '186':
      'Erreur critique ou manque de mémoire détecté dans les journaux Nimbus. Vérifiez la RAM du serveur et exécutez Maintenance → Résumé des journaux.',
    '187': 'Erreur critique Nimbus',
    '188':
      'Le moteur d’exécution a rejeté l’authentification (incompatibilité JWT). Redémarrez Nimbus ou Nethermind.',
    '189': 'Erreur d’authentification d’exécution Nimbus',
    '190':
      'Retard de créneau élevé ou dérive d’horloge détecté (${count} créneaux récents). Vérifiez l’heure système StartOS et la charge CPU/disque.',
    '191': 'Dérive d’horloge ou charge élevée Nimbus',
    '192':
      'Erreurs répétées de communication avec Nethermind (${count} en 5 min). Vérifiez l’état de Nethermind ou exécutez Maintenance → Résumé des journaux.',
    '193':
      '${count} erreurs récurrentes au cours des 15 dernières minutes. Exécutez Maintenance → Résumé des journaux pour plus de détails.',
    '194': 'Avertissements de dérive de l’horloge système',
    '195': 'Charge élevée du serveur / créneaux retardés',
    '196':
      'Dérive de l’horloge système détectée dans les journaux Nimbus (${count} avertissements récents). Vérifiez la synchronisation NTP de StartOS.',
    '197': 'Dérive de l’horloge système Nimbus',
    '198':
      'Charge élevée du serveur détectée (${count} créneaux retardés en 5 min). Vérifiez la charge CPU ou disque.',
    '199': 'API de consensus occupée ; nouvelle tentative…',
    '200': 'Nombre de pairs temporairement indisponible ; nouvelle tentative…',
  },
} satisfies Record<string, LangDict>
