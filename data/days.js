/**
 * ADVIENTO CERO - 24 DIAS DE INVESTIGACION COOPERATIVA
 * Archivo generado con hashes SHA-256 y resoluciones codificadas (Cero Spoilers).
 */

window.ADVENT_DAYS = [
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. 204",
                       "brief":  "Analiza el croquis de mesas del Salón Mirador para indicar a Patri el sector cardinal.",
                       "acceptedHashes":  [
                                              "9537f32ec7599e1ae953af6c9f929fe747ff9dadf79a9beff1f304c550173011",
                                              "0a3dd88578a129185bdcd718e97b712d0d7cc4932a0b70ab9ceb1d546a067cc7"
                                          ],
                       "roleBadge":  "Miguel · Plano del Salón",
                       "clueHtml":  "\u003cp\u003eLas 4 mesas del brindis están dispuestas así: \u003cstrong\u003eMesa 1 (Norte)\u003c/strong\u003e, \u003cstrong\u003eMesa 2 (Oeste)\u003c/strong\u003e, \u003cstrong\u003eMesa 3 (Sur)\u003c/strong\u003e y \u003cstrong\u003eMesa 4 (Este)\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eEl sensor de luz captó un destello de cámara profesional a las 23:36 h junto al \u003cstrong\u003eVentanal Este (Mesa 4)\u003c/strong\u003e.\u003c/p\u003e",
                       "widget":  {
                                      "caption":  "Distribución del Salón Mirador (23:36 h)",
                                      "type":  "room-map",
                                      "nodes":  [
                                                    {
                                                        "label":  "Mesa 1 · Norte",
                                                        "alert":  false,
                                                        "id":  "M1"
                                                    },
                                                    {
                                                        "label":  "Mesa 2 · Oeste",
                                                        "alert":  false,
                                                        "id":  "M2"
                                                    },
                                                    {
                                                        "label":  "Mesa 3 · Sur",
                                                        "alert":  false,
                                                        "id":  "M3"
                                                    },
                                                    {
                                                        "label":  "Mesa 4 · Ventanal Este (Destello 23:36)",
                                                        "alert":  true,
                                                        "id":  "M4"
                                                    }
                                                ]
                                  },
                       "inputLabel":  "Habitación del fotógrafo (dato de Patri)",
                       "partnerHint":  "Dile a Patri la letra cardinal y el número de la mesa del destello (ej. N2). Pregúntale qué número de habitación figura en la tarjeta del fotógrafo."
                   },
        "kicker":  "DÍA 01 · INSPECCIÓN DE MESAS",
        "day":  1,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTYiLCJmb3JlbnNpY1RhZyI6IlRFU1RJR08gRVhURVJJT1IgVkVSSUZJQ0FETyIsImNvbmNsdXNpb24iOiLDk3NjYXIgTGxvcmVudGUgKEhhYi4gMTA4KSBxdWVkw7MgcmVnaXN0cmFkbyBwb3IgZWwgcmVsb2ogZXh0ZXJpb3IgZm90b2dyYWZpYW5kbyBsYSB0b3JtZW50YSBkZXNkZSBlbCBwb3JjaGUgRXN0ZSBlbnRyZSBsYXMgMjM6MzUgeSBsYXMgMjM6NDQgaC4gUXVlZGEgZGVzY2FydGFkby4ifQ==",
        "story":  "Veinte minutos antes de hallar a Arturo Valdivieso, alguien disparó el flash de una cámara junto al ventanal Este del Salón Mirador. Debéis confirmar quién ocupaba la Silla 3 de esa mesa.",
        "hints":  [
                      "Miguel debe decirle a Patri qué mesa está junto al Ventanal Este (E + número). Patri debe buscar esa mesa en sus tarjetas.",
                      "La Mesa 4 está en el sector Este (código E4). En la Silla 3 de esa mesa aparece Óscar Llorente, alojado en la Hab. 108.",
                      "Solución del Día 1 — Miguel: 108 · Patri: E4."
                  ],
        "title":  "El Brindis del Salón",
        "patri":  {
                      "inputPlaceholder":  "Ej. N2",
                      "brief":  "Revisa las tarjetas de protocolo de las mesas en cuanto Miguel te indique la zona.",
                      "acceptedHashes":  [
                                             "449777124b1466a8ed667d0dd4c0620993f59e20fb27b3fa8894e957f8762353"
                                         ],
                      "roleBadge":  "Patri · Tarjetas de Sitio",
                      "clueHtml":  "\u003cp\u003eListado de invitados de la \u003cstrong\u003eMesa 4\u003c/strong\u003e:\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eSilla 1:\u003c/strong\u003e Álvaro Roldán (Suite 303)\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eSilla 2:\u003c/strong\u003e Teresa Alarcón (Hab. 202)\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eSilla 3:\u003c/strong\u003e Óscar Llorente · Fotógrafo acreditado (Hab. 108) — salió al porche exterior a las 23:35 h\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eSilla 4:\u003c/strong\u003e Diego Aranda (Hab. 201)\u003c/li\u003e\u003c/ul\u003e",
                      "widget":  {
                                     "caption":  "Acreditación de Prensa · Protocolo",
                                     "items":  [
                                                   "Silla 3 · Mesa 4",
                                                   "Titular: Óscar Llorente",
                                                   "Nota: Salió al porche Este 23:35 h"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "inputLabel":  "Sector y Mesa del destello (dato de Miguel)",
                      "partnerHint":  "Comunica a Miguel la habitación de la Silla 3. Pídele la inicial cardinal del ventanal + número de mesa (ej. N2)."
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Linterna Ultravioleta",
                       "widget":  {
                                      "secretSub":  "CÓDIGO PARCIAL BARRA",
                                      "secretCode":  "7 - 3 - 9",
                                      "prompt":  "Arrastra el dedo o ratón sobre el área oscura",
                                      "type":  "uv-lamp"
                                  },
                       "brief":  "Desliza el dedo por la superficie de la bandeja para iluminar los dígitos con luz UV.",
                       "partnerHint":  "Dicta a Patri los 3 dígitos luminol que descubras con la linterna.",
                       "clueHtml":  "\u003cp\u003eLa cámara forense ha aislado la bandeja de cócteles de la barra. Bajo luz normal no se aprecia nada, pero hay tinta reactiva UV escrita a mano.\u003c/p\u003e"
                   },
        "hints":  [
                      "Miguel debe pasar el dedo por la caja oscura de la linterna UV para leer 3 dígitos.",
                      "Los 3 dígitos UV son 739. Al añadir el número de turno #5 de Nicolás Ferrer se forma el código de 4 cifras.",
                      "Solución del Día 2: 7395."
                  ],
        "kicker":  "DÍA 02 · LINTERNA LUMINOL",
        "day":  2,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjAiLCJmb3JlbnNpY1RhZyI6IkNPQVJUQURBIERFIEFMTUFDw4lOIENPTkZJUk1BREEiLCJjb25jbHVzaW9uIjoiRWwgcmVnaXN0cm8gZnJpZ29yw61maWNvIGNvbmZpcm1hIHF1ZSBOaWNvbMOhcyBGZXJyZXIgZXN0dXZvIGVuY2VycmFkbyBidXNjYW5kbyBoaWVsbyBlbiBlbCBzw7N0YW5vIGVudHJlIGxhcyAyMzozNCB5IGxhcyAyMzo0NCBoLiBObyBtYW5pcHVsw7MgbGEgY29wYSBkdXJhbnRlIGVsIGFwYWfDs24uIn0=",
        "story":  "La barra del Salón Mirador fue limpiada con prisas tras el hallazgo. Uno de los empleados dejó un rastro de tinta invisible en la bandeja de servicio.",
        "jointInput":  {
                           "label":  "Código completo de verificación (4 dígitos)",
                           "placeholder":  "Ej. 1234",
                           "acceptedHashes":  [
                                                  "d114c819970461a9486c63dc47dab37a87b01144cef635b26a41c0d0b6a6272a"
                                              ]
                       },
        "title":  "Manchas bajo Luz UV",
        "patri":  {
                      "roleBadge":  "Patri · Cuadrante de Turnos",
                      "widget":  {
                                     "caption":  "Fórmula de Registro Frigorífico",
                                     "items":  [
                                                   "Dígitos UV (Miguel) + Nº Turno (Patri)",
                                                   "Formato: 4 dígitos sin guiones"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Cruza los dígitos UV de Miguel con el parte nocturno de barra.",
                      "partnerHint":  "Pide a Miguel los 3 dígitos ocultos bajo la luz ultravioleta y añade al final el dígito de turno (#5).",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eParte de Servicio · 30 de noviembre:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eBarman asignado:\u003c/strong\u003e Nicolás Ferrer (Turno de Noche \u003cstrong\u003e#5\u003c/strong\u003e)\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eIncidencia:\u003c/strong\u003e Salió al almacén frigorífico de hielo a las 23:34 h y regresó a las 23:44 h con testigo de cocina.\u003c/li\u003e\u003c/ul\u003e\u003cp\u003ePara abrir el registro del almacén, introduce los \u003cstrong\u003e3 dígitos UV de Miguel\u003c/strong\u003e seguidos del \u003cstrong\u003enúmero de turno\u003c/strong\u003e de Nicolás.\u003c/p\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Receptor de Audio/Luz",
                       "widget":  {
                                      "label":  "Pulsar para reproducir señal de 3 letras",
                                      "sequence":  "... --- -",
                                      "type":  "morse"
                                  },
                       "brief":  "Reproduce el aviso captado por la centralita y dicta la secuencia de puntos y rayas a Patri.",
                       "partnerHint":  "Dicta a Patri los grupos de puntos (·) y rayas (−) para que los traduzca.",
                       "clueHtml":  "\u003cp\u003eLa centralita grabó 3 letras en código Morse justo a las 23:39 h. Puedes escucharlas y ver el destello luminoso tantas veces como necesites.\u003c/p\u003e"
                   },
        "hints":  [
                      "La señal de Miguel emite tres puntos, tres rayas y una raya final (... / --- / -).",
                      "... = S, --- = O, - = T -\u003e SOT (Sótano). Según la tabla de Patri, la extensión del Sótano es 04.",
                      "Solución del Día 3: SOT04."
                  ],
        "kicker":  "DÍA 03 · TELEMETRÍA DE EMERGENCIA",
        "day":  3,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDgiLCJmb3JlbnNpY1RhZyI6IkxMQU1BREEgREUgRVhURU5TScOTTiAwNCBWRVJJRklDQURBIiwiY29uY2x1c2lvbiI6IlRvbcOhcyBCZXJtw7pkZXogbGxhbcOzIGRlc2RlIGVsIHRlbMOpZm9ubyBmaWpvIGRlbCBTw7N0YW5vIChFeHQuIDA0KSBhIGxhcyAyMzozOSBoIGFsIHF1ZWRhcnNlIGEgb3NjdXJhcyByZWNvZ2llbmRvIG1hbnRhcyB0w6lybWljYXMuIFF1ZWRhIGRlc2NhcnRhZG8uIn0=",
        "story":  "Durante el apagón de las 23:38 h, alguien activó el pulsador de prueba de una extensión interna del hotel emitiendo una señal en código Morse.",
        "jointInput":  {
                           "label":  "Código de sector y extensión",
                           "placeholder":  "Ej. GAR12",
                           "acceptedHashes":  [
                                                  "3e4d43098405318c82d5a42589bca8c6327590ff9b509bdb038ff8debc611c3e"
                                              ]
                       },
        "title":  "Morse en la Centralita",
        "patri":  {
                      "roleBadge":  "Patri · Tabla de Extensiones",
                      "widget":  {
                                     "caption":  "Libro de Conserjería Nocturna",
                                     "items":  [
                                                   "Responsable de ronda: Tomás Bermúdez",
                                                   "Formato de cierre: 3 LETRAS + 2 DÍGITOS"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Traduce la señal Morse de Miguel y busca su extensión en el libro de conserjería.",
                      "partnerHint":  "Une las 3 letras traducidas con los 2 dígitos de la extensión de ese sector (ej. GAR12).",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eDiccionario Morse rápido:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eS:\u003c/strong\u003e · · · \u0026nbsp;|\u0026nbsp; \u003cstrong\u003eO:\u003c/strong\u003e − − − \u0026nbsp;|\u0026nbsp; \u003cstrong\u003eT:\u003c/strong\u003e −\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eA:\u003c/strong\u003e · − \u0026nbsp;|\u0026nbsp; \u003cstrong\u003eZ:\u003c/strong\u003e − − · · \u0026nbsp;|\u0026nbsp; \u003cstrong\u003eG:\u003c/strong\u003e − − · \u0026nbsp;|\u0026nbsp; \u003cstrong\u003eR:\u003c/strong\u003e · − ·\u003c/li\u003e\u003c/ul\u003e\u003cp\u003e\u003cstrong\u003eSectores de Ronda (Tomás Bermúdez):\u003c/strong\u003e SOT (Sótano) = Ext. \u003cstrong\u003e04\u003c/strong\u003e · AZO (Azotea) = Ext. \u003cstrong\u003e09\u003c/strong\u003e · GAR (Garaje) = Ext. \u003cstrong\u003e12\u003c/strong\u003e.\u003c/p\u003e"
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. 21",
                       "brief":  "Solo ves las filas 1 y 2. Pide a Patri los valores clave de sus filas para deducir F1C4 y F2C1.",
                       "acceptedHashes":  [
                                              "44cb730c420480a0477b505ae68af508fb90f96cf0ec54c6ad16949dd427f13a"
                                          ],
                       "roleBadge":  "Miguel · Mitad Superior del Cuadrante",
                       "clueHtml":  "\u003cp\u003eCompleta mentalmente o tocando tus casillas. Necesitas saber qué número va en \u003cstrong\u003eF1,C4\u003c/strong\u003e y en \u003cstrong\u003eF2,C1\u003c/strong\u003e (en ese orden, 2 dígitos).\u003c/p\u003e",
                       "widget":  {
                                      "prefill":  [
                                                      [
                                                          1,
                                                          0,
                                                          0,
                                                          0
                                                      ],
                                                      [
                                                          0,
                                                          4,
                                                          0,
                                                          2
                                                      ],
                                                      [
                                                          0,
                                                          0,
                                                          0,
                                                          0
                                                      ],
                                                      [
                                                          0,
                                                          0,
                                                          0,
                                                          0
                                                      ]
                                                  ],
                                      "visibleRows":  [
                                                          0,
                                                          1
                                                      ],
                                      "type":  "sudoku4",
                                      "targets":  [
                                                      "0,3",
                                                      "1,0"
                                                  ]
                                  },
                       "inputLabel":  "Valores de [F1,C4] y [F2,C1] seguidos",
                       "partnerHint":  "Comunica a Patri tus valores iniciales: F1C1=1, F2C2=4 y F2C4=2. Pregúntale qué tiene en F3C1 y F3C4."
                   },
        "kicker":  "DÍA 04 · CONTROL DE LAVANDERÍA",
        "day":  4,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTUiLCJmb3JlbnNpY1RhZyI6IkNBSsOTTiBERSBMTEFWRVMgUFJFQ0lOVEFETyIsImNvbmNsdXNpb24iOiJNYXJ0YSBRdWlyb2dhIGRlasOzIGVsIGN1YWRyYW50ZSBkZSBsbGF2ZXMgY2VycmFkbyBjb24gZWwgY8OzZGlnbyA0My00MSBlbiBsYXZhbmRlcsOtYSBhIGxhcyAyMzoyNSBoIGFudGVzIGRlbCBhcGFnw7NuLiBOaW5ndW5hIGxsYXZlIGRlIGxhdmFuZGVyw61hIHNhbGnDsyBkZWwgY3VhcnRvLiJ9",
        "story":  "El armario de llaves maestras usa un cuadrante lógico 4x4 donde cada fila, columna y bloque 2x2 contiene los números 1, 2, 3 y 4 sin repetir.",
        "hints":  [
                      "En un Sudoku 4x4 no puede repetirse ningún número del 1 al 4 en fila, columna ni recuadro 2x2.",
                      "Columna 4 ya tiene 2 (Miguel) y 3 (Patri), y Fila 1 tiene 1 -\u003e F1C4 = 4. En Columna 1 hay 1 (F1C1) y 2 (F3C1), y en caja superior izquierda ya está el 4 -\u003e F2C1 = 3. Para Patri, con F1C4=4 sale F4C4=1 y F4C1=4.",
                      "Solución del Día 4 — Miguel: 43 · Patri: 41."
                  ],
        "title":  "Cuadrante de Llaves Maestras",
        "patri":  {
                      "inputPlaceholder":  "Ej. 12",
                      "brief":  "Solo ves las filas 3 y 4. Pide a Miguel sus datos superiores para deducir F4C1 y F4C4.",
                      "acceptedHashes":  [
                                             "3d914f9348c9cc0ff8a79716700b9fcd4d2f3e711608004eb8f138bcba7f14d9"
                                         ],
                      "roleBadge":  "Patri · Mitad Inferior del Cuadrante",
                      "clueHtml":  "\u003cp\u003eLa gobernanta Marta Quiroga selló el armario con el código de la última fila. Deduce \u003cstrong\u003eF4,C1\u003c/strong\u003e y \u003cstrong\u003eF4,C4\u003c/strong\u003e (2 dígitos seguidos).\u003c/p\u003e",
                      "widget":  {
                                     "prefill":  [
                                                     [
                                                         0,
                                                         0,
                                                         0,
                                                         0
                                                     ],
                                                     [
                                                         0,
                                                         0,
                                                         0,
                                                         0
                                                     ],
                                                     [
                                                         2,
                                                         0,
                                                         0,
                                                         3
                                                     ],
                                                     [
                                                         0,
                                                         3,
                                                         2,
                                                         0
                                                     ]
                                                 ],
                                     "visibleRows":  [
                                                         2,
                                                         3
                                                     ],
                                     "type":  "sudoku4",
                                     "targets":  [
                                                     "3,0",
                                                     "3,3"
                                                 ]
                                 },
                      "inputLabel":  "Valores de [F4,C1] y [F4,C4] seguidos",
                      "partnerHint":  "Comunica a Miguel tus valores iniciales: F3C1=2 y F3C4=3. Pregúntale qué números tiene en F1C4 y F2C2."
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. navarro",
                       "brief":  "Identifica qué código TAG fichó en la Biblioteca a las 23:39 h.",
                       "acceptedHashes":  [
                                              "b74c3a133a11e1a0514c3841cd80b051cb6b18b28e58b2b0c9107cfdae9e9a06"
                                          ],
                       "roleBadge":  "Miguel · Log Técnico RFID",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eRegistro de antenas (Planta 2):\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e23:31:04 · TAG-A1 · Pasillo Sur\u003c/li\u003e\u003cli\u003e23:34:50 · TAG-B4 · Ascensor Central\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e23:39:12 · TAG-C7 · Puerta Biblioteca\u003c/strong\u003e\u003c/li\u003e\u003cli\u003e23:43:18 · TAG-D2 · Escalera Norte\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "caption":  "Lectura Antena 02-BIB",
                                      "items":  [
                                                    "ID: TAG-C7",
                                                    "Hora exacta: 23:39:12 h",
                                                    "Ubicación: Biblioteca Planta 2"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "inputLabel":  "Primer apellido de la titular de TAG-C7 (dato de Patri)",
                       "partnerHint":  "Indica a Patri el código del TAG (ej. A1) y el minuto exacto (ej. 31) de la Biblioteca. Pregúntale el apellido de la titular."
                   },
        "kicker":  "DÍA 05 · TORNIQUETES ALA NORTE",
        "day":  5,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDUiLCJmb3JlbnNpY1RhZyI6IkFDQ0VTTyBCSUJMSU9URUNBIDIzOjM5IEgiLCJjb25jbHVzaW9uIjoiTHVjw61hIE1vbnRhbHZvIGFicmnDsyBsYSBCaWJsaW90ZWNhIGRlIFBsYW50YSAyIGEgbGFzIDIzOjM5OjEyIGggZW4gcGxlbm8gYXBhZ8OzbiB5IGVsIHNpc3RlbWEgZGVqw7Mgc3UgdGFyamV0YSByZWdpc3RyYWRhIGRlbnRybyBoYXN0YSBsYXMgMjM6NTggaC4gUXVlZGEgZGVzY2FydGFkYS4ifQ==",
        "story":  "El lector electrónico de la Biblioteca de Planta 2 registró una tarjeta huésped durante el minuto crítico del apagón.",
        "hints":  [
                      "Miguel ve que el fichaje de las 23:39 en la Biblioteca corresponde a TAG-C7.",
                      "Patri comprueba que TAG-C7 pertenece a Lucía Montalvo.",
                      "Solución del Día 5 — Miguel: montalvo · Patri: C739."
                  ],
        "title":  "Lectura RFID de Pasillos",
        "patri":  {
                      "inputPlaceholder":  "Ej. A131",
                      "brief":  "Busca a quién pertenece el TAG que te diga Miguel.",
                      "acceptedHashes":  [
                                             "208213f825d268b65caf466cb4251405b34c6a85833fd5aa961710453bac5ff2"
                                         ],
                      "roleBadge":  "Patri · Asignación de Tarjetas",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eTarjetas RFID entregadas en Recepción:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eTAG-A1: Diego Aranda\u003c/li\u003e\u003cli\u003eTAG-B4: Álvaro Roldán\u003c/li\u003e\u003cli\u003eTAG-C7: \u003cstrong\u003eLucía Montalvo\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eTAG-D2: Gabriel Serrano\u003c/li\u003e\u003c/ul\u003e\u003cp\u003eIntroduce el código compacto: los 2 caracteres del TAG + los 2 dígitos del minuto en Biblioteca (ej. A131).\u003c/p\u003e",
                      "widget":  {
                                     "caption":  "Libro de Recepción · VIP",
                                     "items":  [
                                                   "TAG-C7 -\u003e Lucía Montalvo",
                                                   "Hab. 204 · Prensa"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "inputLabel":  "Código TAG + Minuto (dato de Miguel)",
                      "partnerHint":  "Dile a Miguel el apellido de la titular de TAG-C7. Pídele los dos dígitos del minuto exacto del fichaje."
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. salon norte",
                       "brief":  "Gira la rueda interactiva hasta el desplazamiento que descubra Patri en su partitura.",
                       "acceptedHashes":  [
                                              "c369395a81aa6bda3700513f6f4cf9b09335d7129344b7467d9b00ac0794d766"
                                          ],
                       "roleBadge":  "Miguel · Decodificador César",
                       "clueHtml":  "\u003cp\u003eTexto cifrado hallado: \u003cstrong class=\u0027mono\u0027\u003eFDPHULQR VXU\u003c/strong\u003e. Usa los botones + / - para retroceder las letras del abecedario.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "caesar",
                                      "cipherText":  "FDPHULQR VXU"
                                  },
                       "inputLabel":  "Las dos palabras descifradas",
                       "partnerHint":  "Pregunta a Patri cuántas estrellas doradas tiene la partitura para fijar el desplazamiento. Luego dile qué dos palabras aparecen."
                   },
        "kicker":  "DÍA 06 · RUEDA CÉSAR",
        "day":  6,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjEiLCJmb3JlbnNpY1RhZyI6IkVOU0FZTyBWT0NBTCBDT05GSVJNQURPIiwiY29uY2x1c2lvbiI6IkVsIHBlcnNvbmFsIHTDqWNuaWNvIGVzY3VjaMOzIGEgQ2xhdWRpYSBCZW7DrXRleiB2b2NhbGl6YXIgc2luIHBhdXNhIGRlbnRybyBkZWwgQ2FtZXJpbm8gU3VyIGFudGVzLCBkdXJhbnRlIHkgZGVzcHXDqXMgZGVsIGFwYWfDs24uIFF1ZWRhIGRlc2NhcnRhZGEuIn0=",
        "story":  "Una nota manuscrita en código César apareció enganchada en el perchero del vestíbulo artístico.",
        "hints":  [
                      "Patri indica desplazamiento 3. Miguel debe ajustar la rueda a Desplazamiento 3 para retroceder 3 letras (F-\u003eC, D-\u003eA...).",
                      "Al retroceder 3 posiciones, FDPHULQR VXU se convierte en CAMERINO SUR.",
                      "Solución del Día 6 — Miguel: camerino sur · Patri: claudia."
                  ],
        "title":  "El Criptograma del Ropero",
        "patri":  {
                      "inputPlaceholder":  "Ej. elena",
                      "brief":  "Cuenta las estrellas doradas de la partitura y cruza la sala descifrada por Miguel.",
                      "acceptedHashes":  [
                                             "35f85825b9016fcc7818aca22298dc88a92ba6e4f029366ff8acbb3f823152d4"
                                         ],
                      "roleBadge":  "Patri · Partitura de Gala",
                      "clueHtml":  "\u003cp\u003ePartitura de ensayo: \u003cem\u003e«Noche de Paz — Compás 3/4»\u003c/em\u003e. En la esquina superior hay exactamente \u003cstrong\u003e3 estrellas doradas\u003c/strong\u003e dibujadas a tinta (desplazamiento = \u003cstrong\u003e3\u003c/strong\u003e).\u003c/p\u003e\u003cp\u003e\u003cstrong\u003eAsignación de camerinos:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eCamerino Norte: Invitados VIP\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eCamerino Sur: Claudia Benítez\u003c/strong\u003e (vocalizando 23:30–23:50 h)\u003c/li\u003e\u003cli\u003eCamerino Este: Equipo técnico\u003c/li\u003e\u003c/ul\u003e",
                      "widget":  {
                                     "caption":  "Clave de Desplazamiento",
                                     "items":  [
                                                   "3 estrellas doradas -\u003e Desplazamiento = 3",
                                                   "Introduce el nombre de pila de la artista de esa sala"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "inputLabel":  "Nombre de pila de la artista",
                      "partnerHint":  "Dile a Miguel que el desplazamiento César es 3. Pregúntale qué sala descifró para introducir el nombre de pila de la artista."
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Declaraciones Anonimizadas",
                       "widget":  {
                                      "caption":  "Formato del Código Conjunto",
                                      "items":  [
                                                    "Alias en mayúsculas + Nº sospechoso (2 dígitos)",
                                                    "Ejemplo: ALFA04"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "brief":  "Lee las cuatro actividades y busca qué alias coincide con los logs reales de Patri.",
                       "partnerHint":  "Pide a Patri que revise qué actividad está 100% confirmada por el servidor del hotel y cuál es el número de ficha de esa persona.",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eSujeto Alfa:\u003c/strong\u003e Afirma haber dormido desde las 23:00 h.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eSujeto Beta:\u003c/strong\u003e Declara haber trabajado subiendo archivos gráficos por Wi-Fi en el Estudio de Diseño de 23:25 a 23:52 h.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eSujeto Gamma:\u003c/strong\u003e Dice haber bajado al billar mirando el reloj de pie a las 23:40 h.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eSujeto Delta:\u003c/strong\u003e Dice haber salido al jardín interior a fumar.\u003c/li\u003e\u003c/ul\u003e"
                   },
        "hints":  [
                      "Patri confirma el Estudio de Diseño (Ficha 12). Miguel debe mirar qué sujeto declaró estar allí.",
                      "Sujeto Beta coincide exactamente con el horario 23:25–23:52 del Estudio de Diseño, y la ficha es la 12.",
                      "Solución del Día 7: BETA12."
                  ],
        "kicker":  "DÍA 07 · TESTIMONIOS Y LOGS",
        "day":  7,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTIiLCJmb3JlbnNpY1RhZyI6IkFDVElWSURBRCBERSBSRUQgSU5JTlRFUlJVTVBJREEiLCJjb25jbHVzaW9uIjoiTG9zIHBhcXVldGVzIGRlIGRhdG9zIHN1Ymlkb3MgZGVzZGUgZWwgcG9ydMOhdGlsIGRlIERpZWdvIEFyYW5kYSBwcnVlYmFuIGFjdGl2aWRhZCBtYW51YWwgY29uc3RhbnRlIGVuIGVsIEVzdHVkaW8gZHVyYW50ZSB0b2RvIGVsIGFwYWfDs24uIFF1ZWRhIGRlc2NhcnRhZG8uIn0=",
        "story":  "Cuatro sospechosos declararon por separado sobre lo que hacían a las 23:40 h, pero las actas de Miguel solo llevan alias griegos.",
        "jointInput":  {
                           "label":  "Alias griego + Nº de ficha (2 dígitos)",
                           "placeholder":  "Ej. ALFA04",
                           "acceptedHashes":  [
                                                  "00f264f1b623260e47c6b411af992a7bb8a007d41f215af9510db717cd043d0a"
                                              ]
                       },
        "title":  "Cuatro Coartadas, Un Reloj Parado",
        "patri":  {
                      "roleBadge":  "Patri · Auditoría del Servidor",
                      "widget":  {
                                     "caption":  "Datos Confirmados",
                                     "items":  [
                                                   "Estudio de Diseño · Wi-Fi activo 23:25–23:52",
                                                   "Titular: Diego Aranda · Ficha Nº 12"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Contrasta lo que te cuenta Miguel con los registros técnicos del hotel.",
                      "partnerHint":  "Dile a Miguel qué actividad confirman los logs del router para que identifique el alias griego correcto.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eInforme Informático:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eEl reloj de pie del billar lleva averiado desde las 20:15 h (el del billar miente o confunde la hora).\u003c/li\u003e\u003cli\u003eEl router del \u003cstrong\u003eEstudio de Diseño\u003c/strong\u003e registra tráfico continuo y subida de maquetas desde el portátil de \u003cstrong\u003eDiego Aranda (Sospechoso 12)\u003c/strong\u003e entre las 23:25 y las 23:52 h.\u003c/li\u003e\u003c/ul\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Ecuaciones 1 y 2",
                       "widget":  {
                                      "caption":  "Tabla de Pesos Parcial",
                                      "items":  [
                                                    "2 Anís + 1 Canela = 19 g",
                                                    "1 Anís + 2 Clavo = 13 g"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "brief":  "Necesitas saber cuánto pesa 1 rama de Canela (dato de Patri) para calcular el Anís y el Clavo.",
                       "partnerHint":  "Pide a Patri el peso de 1 Canela. Calcula luego cuánto pesa 1 Anís y 1 Clavo, y díselo para la mezcla final.",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eBáscula 1:\u003c/strong\u003e 2 Anís + 1 Canela = \u003cstrong\u003e19 g\u003c/strong\u003e\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eBáscula 2:\u003c/strong\u003e 1 Anís + 2 Clavo = \u003cstrong\u003e13 g\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e"
                   },
        "hints":  [
                      "De 3 Canela = 15 g se deduce Canela = 5 g.",
                      "Con Canela = 5 -\u003e 2 Anís = 14 (Anís = 7). Luego 7 + 2 Clavo = 13 -\u003e Clavo = 3.",
                      "2(7) + 3(3) + 1(5) = 14 + 9 + 5 = 28."
                  ],
        "kicker":  "DÍA 08 · TOXICOLOGÍA DE ESPECIAS",
        "day":  8,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOm51bGwsImZvcmVuc2ljVGFnIjoiTVVFU1RSQSBSRVRFTklEQSDCtyBTSU4gREVTQ0FSVEUiLCJjb25jbHVzaW9uIjoiRWwgcGVzYWplIGRlIDI4IGcgY3VhZHJhIGNvbiBlbCBjdWFkZXJubyBkZSBtZXpjbGFzIGRlbCBzcGEsIHBlcm8gc2UgaW5jYXV0YW4gZG9zIGZyYXNjb3MgYW1iYXIgc2luIGV0aXF1ZXRhIHBhcmEgYW5hbGlzaXMgdG94aWNvbG9naWNvIGRlIE5vY2hlYnVlbmEuIFBhdWxhIE1lbmRvemEgc2lndWUgYmFqbyBzb3NwZWNoYSBoYXN0YSBlbCBjYXJlbyBmaW5hbC4ifQ==",
        "story":  "En la sala de infusiones del spa han aparecido tres frascos de especias navideñas con pesos cifrados en una báscula de precisión.",
        "jointInput":  {
                           "label":  "Peso total de la mezcla en gramos (solo número)",
                           "placeholder":  "Ej. 24",
                           "acceptedHashes":  [
                                                  "59e19706d51d39f66711c2653cd7eb1291c94d9b55eb14bda74ce4dc636d015a",
                                                  "6a6981daf614209de2449a288a622f25d2ecf5c4a415e74863e190e4e75f7353"
                                              ]
                       },
        "title":  "La Balanza del Ponche",
        "patri":  {
                      "roleBadge":  "Patri · Báscula 3 y Fórmula Final",
                      "widget":  {
                                     "caption":  "Fórmula de Control",
                                     "items":  [
                                                   "3 Canela = 15 g",
                                                   "Objetivo: 2 Anís + 3 Clavo + 1 Canela"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Deduce el peso de la Canela, dáselo a Miguel y calculad juntos la mezcla de control de Paula.",
                      "partnerHint":  "Calcula cuánto vale 1 Canela y díselo a Miguel para que halle Anís y Clavo.",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eBáscula 3:\u003c/strong\u003e 3 Canela = \u003cstrong\u003e15 g\u003c/strong\u003e\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eMezcla de control (Paula Mendoza):\u003c/strong\u003e \u003cstrong\u003e2 Anís + 3 Clavo + 1 Canela = ? g\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e\u003cp\u003eIntroduce el resultado total en gramos (solo el número, ej. 24).\u003c/p\u003e"
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. 1234",
                       "brief":  "Inspecciona el visor térmico de la escena exterior para leer las iniciales y la temperatura.",
                       "acceptedHashes":  [
                                              "7527ba85bdc16eaae6b3f475aaa3b4c030611a001614a53fa47b4bc37b8950f6"
                                          ],
                       "roleBadge":  "Miguel · Cámara Norte (Teleférico)",
                       "clueHtml":  "\u003cp\u003eEn el fotograma de la Cámara Norte se distingue al guía con chaqueta técnica y las iniciales bordadas \u003cstrong\u003eM.S.\u003c/strong\u003e en la manga. El termómetro digital del poste marca \u003cstrong\u003e-11 °C\u003c/strong\u003e.\u003c/p\u003e",
                       "widget":  {
                                      "caption":  "Cámara Norte · 23:41 h · Marca térmica: -11 °C · Bordado manga: M.S.",
                                      "type":  "scene-zoom",
                                      "imgSrc":  "imagenes/scene-balcony.jpg"
                                  },
                       "inputLabel":  "PIN de 4 dígitos de la Cabaña Norte (dato de Patri)",
                       "partnerHint":  "Dile a Patri los dígitos de temperatura sin signo menos + las 2 iniciales juntas (ej. 05AB). Pregúntale el código PIN de la puerta de la cabaña."
                   },
        "kicker":  "DÍA 09 · CÁMARAS EXTERIORES",
        "day":  9,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDQiLCJmb3JlbnNpY1RhZyI6IlRFTEVGw4lSSUNPIFkgQ0FCQcORQSBOT1JURSBWRVJJRklDQURPUyIsImNvbmNsdXNpb24iOiJNYXRlbyBTb2xlciBxdWVkw7MgZ3JhYmFkbyBsdWNoYW5kbyBjb250cmEgZWwgaGllbG8gZW4gZWwgZXh0ZXJpb3IgYSAtMTEgwrBDIHkgZmljaGFuZG8gZW4gc3UgY2FiYcOxYSBhIGxhcyAyMzo0MSBoLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9",
        "story":  "Dos cámaras exteriores captaron a una figura solitaria bajo la ventisca junto al teleférico a las 23:41 h. Cada móvil recibe un ángulo distinto.",
        "hints":  [
                      "Miguel tiene -11 °C e iniciales M.S. (11MS). Patri tiene el PIN 4819.",
                      "Intercambiad ambos códigos exactamente como pide cada campo.",
                      "Solución del Día 9 — Miguel: 4819 · Patri: 11MS."
                  ],
        "title":  "Fotogramas del Mirador",
        "patri":  {
                      "inputPlaceholder":  "Ej. 05AB",
                      "brief":  "Revisa la puerta de la Cabaña Norte y cruza los datos térmicos de Miguel.",
                      "acceptedHashes":  [
                                             "d9205122c9576688af993a08b3d27c50856a99b49b656c543981c1ebff5ed0a1"
                                         ],
                      "roleBadge":  "Patri · Cámara Exterior B (Cabaña)",
                      "clueHtml":  "\u003cp\u003eLa Cámara B muestra al individuo despejando hielo de la polea con un piolet, justo frente al teclado de la Cabaña Norte cuya contraseña de acceso registrada a las 23:41 h fue \u003cstrong\u003e4819\u003c/strong\u003e.\u003c/p\u003e",
                      "widget":  {
                                     "caption":  "Registro Puerta Cabaña Norte",
                                     "items":  [
                                                   "PIN introducido 23:41 h: 4819",
                                                   "Formato para validar: Temp (2 dígitos) + Iniciales"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "inputLabel":  "Temperatura (2 dígitos) + Iniciales (dato de Miguel)",
                      "partnerHint":  "Comunica a Miguel el PIN 4819. Pídele la temperatura sin el signo negativo seguida de las dos iniciales bordadas (ej. 05AB)."
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Manual de Calderas",
                       "widget":  {
                                      "triggerCode":  "C7",
                                      "responseHtml":  "\u003cstrong\u003eProtocolo Circuito C-7:\u003c/strong\u003e Dejar \u003cstrong\u003eV1 ABIERTA\u003c/strong\u003e, \u003cstrong\u003eV2 CERRADA\u003c/strong\u003e, \u003cstrong\u003eV3 CERRADA\u003c/strong\u003e y \u003cstrong\u003eV4 ABIERTA\u003c/strong\u003e.",
                                      "type":  "manual-lookup"
                                  },
                       "brief":  "Introduce el número de circuito averiado que ve Patri para consultar qué válvulas abrir.",
                       "partnerHint":  "Pregunta a Patri qué circuito marca alarma roja. Luego díctale qué válvulas debe dejar ABIERTAS y cuáles CERRADAS.",
                       "clueHtml":  "\u003cp\u003eIntroduce aquí el \u003cstrong\u003ecódigo de circuito\u003c/strong\u003e en rojo que aparece en el panel de Patri (ej. C2) para desplegar el protocolo de válvulas:\u003c/p\u003e"
                   },
        "hints":  [
                      "Patri dice C-7 a Miguel. Miguel escribe C7 en su buscador de manual y lee qué válvulas abrir.",
                      "El protocolo ordena V1 ABIERTA, V2 CERRADA, V3 CERRADA, V4 ABIERTA. Al ponerlo así en el panel de Patri aparece el número.",
                      "Solución del Día 10: 8420."
                  ],
        "kicker":  "DÍA 10 · SALA DE MÁQUINAS",
        "day":  10,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTAiLCJmb3JlbnNpY1RhZyI6IlBVUkdBIERFIENBTERFUkFTIENFUlRJRklDQURBIiwiY29uY2x1c2lvbiI6IkVsIHJlZ2lzdHJvIGF1dG9tw6F0aWNvIDg0MjAgZGUgcHJlc2nDs24gY29uZmlybWEgcXVlIEp1bGnDoW4gUHJpZXRvIGVzdHV2byBtYW5pb2JyYW5kbyBtYW51YWxtZW50ZSBsYXMgdsOhbHZ1bGFzIGRlbCBzw7N0YW5vIGVudHJlIGxhcyAyMzozNiB5IGxhcyAyMzo0NSBoLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9",
        "story":  "Un fallo de presión obligó a purgar el circuito hidráulico del sótano durante el apagón. Necesitáis activar la combinación exacta en el panel de Patri.",
        "jointInput":  {
                           "label":  "Código de serie revelado en el manómetro (4 dígitos)",
                           "placeholder":  "Ej. 1020",
                           "acceptedHashes":  [
                                                  "33d9f4526b23543c77260989ff4439aca18cff76c61511b6987816f1e9fc6c32"
                                              ]
                       },
        "title":  "Válvulas de la Caldera",
        "patri":  {
                      "roleBadge":  "Patri · Tablero Interactivo de Válvulas",
                      "widget":  {
                                     "targetState":  [
                                                         true,
                                                         false,
                                                         false,
                                                         true
                                                     ],
                                     "type":  "valves",
                                     "revealCode":  "8420"
                                 },
                      "brief":  "Comunica a Miguel el circuito averiado y acciona las 4 válvulas según sus instrucciones.",
                      "partnerHint":  "Dile a Miguel que el circuito dañado es el C-7 y espera sus órdenes para pulsar V1–V4.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eALERTA ROJA:\u003c/strong\u003e Avería detectada en el circuito \u003cstrong class=\u0027mono\u0027\u003eC-7\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eCuando ajustes las 4 válvulas tal como te indique Miguel, el manómetro te mostrará el código de serie de 4 dígitos.\u003c/p\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Mitad Izquierda (Horas e Importes)",
                       "widget":  {
                                      "caption":  "Formato de Validación",
                                      "items":  [
                                                    "Nº Mesa (2 dígitos) + Hora (4 dígitos)",
                                                    "Ejemplo: 032115"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "brief":  "Lee la hora y los precios de la columna izquierda para cruzarlos con los conceptos de Patri.",
                       "partnerHint":  "Pide a Patri el número de mesa de 2 dígitos asociado al artículo de 4,50 EUR. Combínalo con la hora sin dos puntos.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eFragmento Izquierdo del Ticket:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eHora de cobro: \u003cstrong\u003e23:38 h\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eLínea 1: 24,00 EUR\u003c/li\u003e\u003cli\u003eLínea 2: \u003cstrong\u003e4,50 EUR\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eTotal TPV: 28,50 EUR\u003c/li\u003e\u003c/ul\u003e"
                   },
        "hints":  [
                      "La Línea 2 (4,50 EUR, Café Solo) pertenece a la Mesa 08 y fue cobrada a las 23:38.",
                      "Junta 08 (mesa) y 2338 (hora).",
                      "Solución del Día 11: 082338."
                  ],
        "kicker":  "DÍA 11 · CONSUMO EN BARRA",
        "day":  11,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjQiLCJmb3JlbnNpY1RhZyI6IkNPQlJPIFRQViAyMzozOCBIIFZFUklGSUNBRE8iLCJjb25jbHVzaW9uIjoiRWwgZGF0w6Fmb25vIGRlIHJlY2VwY2nDs24gY29icsOzIGVsIGNhZsOpIGRlIE1hcmNvcyBUZWphZGEgYSBsYXMgMjM6Mzg6MDQgaCBlbiBwcmVzZW5jaWEgZGVsIHJlY2VwY2lvbmlzdGEsIGp1c3RvIGN1YW5kbyBzYWx0YXJvbiBsb3MgcGxvbW9zLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9",
        "story":  "Un ticket de caja rasgado por la mitad cayó detrás del mostrador de recepción. Ninguna mitad sirve por separado.",
        "jointInput":  {
                           "label":  "Mesa (2 dígitos) + Hora (4 dígitos)",
                           "placeholder":  "Ej. 032115",
                           "acceptedHashes":  [
                                                  "912258ca546ffd791e39fef3f775a786a11ab4d512379087c0bfc1dbc77e19d3"
                                              ]
                       },
        "title":  "El Ticket Térmico Roto",
        "patri":  {
                      "roleBadge":  "Patri · Mitad Derecha (Artículos y Mesa)",
                      "widget":  {
                                     "caption":  "Mesa 08 · Recepción Principal",
                                     "items":  [
                                                   "Titular: Marcos Tejada",
                                                   "Artículo: Café Solo"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Identifica los conceptos y el número de mesa para unirlos con la hora que tiene Miguel.",
                      "partnerHint":  "Dile a Miguel que el Café Solo corresponde a la Mesa 08 y pregúntale la hora exacta del ticket.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eFragmento Derecho del Ticket:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eLínea 1: 2x Whisky Reserva · Mesa 03\u003c/li\u003e\u003cli\u003eLínea 2: 1x Café Solo · \u003cstrong\u003eMesa 08 (Marcos Tejada)\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e\u003cp\u003eEl escolta pagó su café en el mostrador principal justo a la hora que figura en el fragmento de Miguel.\u003c/p\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Pistas de Filas",
                       "widget":  {
                                      "side":  "rows",
                                      "clues":  [
                                                    "3",
                                                    "1,1",
                                                    "5",
                                                    "1,1",
                                                    "1,1"
                                                ],
                                      "type":  "nonogram"
                                  },
                       "brief":  "Dicta las pistas numéricas de cada fila a Patri y rellenad juntos la cuadrícula 5x5.",
                       "partnerHint":  "Pide a Patri sus pistas verticales (columnas) para resolver el dibujo sin ambigüedad.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003ePistas horizontales (de arriba a abajo):\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eFila 1: \u003cstrong\u003e3\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eFila 2: \u003cstrong\u003e1, 1\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eFila 3: \u003cstrong\u003e5\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eFila 4: \u003cstrong\u003e1, 1\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eFila 5: \u003cstrong\u003e1, 1\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e"
                   },
        "hints":  [
                      "La Fila 3 es 5 (toda llena). Las Columnas 1 y 5 tienen 4 casillas seguidas que no pueden empezar en la Fila 1 porque la Fila 1 es 3 y Col 3 tiene 1,1.",
                      "Al rellenar la cuadrícula aparece una gran letra A mayúscula, correspondiente al Archivo Histórico (Código 19).",
                      "Solución del Día 12: A19."
                  ],
        "kicker":  "DÍA 12 · CUADRÍCULA 5x5",
        "day":  12,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTkiLCJmb3JlbnNpY1RhZyI6IlRBU0FDScOTTiBFTiBBUkNISVZPIENPTkZJUk1BREEiLCJjb25jbHVzaW9uIjoiTGEgY8OhbWFyYSBkZSBhY2Nlc28gYWwgQXJjaGl2byBIaXN0w7NyaWNvIG11ZXN0cmEgYSBFbGVuYSBWYWxscyBmb3RvZ3JhZmlhbmRvIG1hbnVzY3JpdG9zIGhhc3RhIGxhcyAyMzo0OSBoLCBsZWpvcyBkZWwgU2Fsw7NuIE1pcmFkb3IuIFF1ZWRhIGRlc2NhcnRhZGEuIn0=",
        "story":  "Un sello cifrado en cuadrícula 5x5 revela la inicial de la estancia histórica donde estuvo Elena Valls tasando obras durante la noche.",
        "jointInput":  {
                           "label":  "Inicial de la sala + Código de 2 dígitos",
                           "placeholder":  "Ej. B05",
                           "acceptedHashes":  [
                                                  "aa1477c41bc44c975f9888ce34534593fd415d7d05c81aa9b0e5fbeb4e46346f",
                                                  "08c48914a2945c722db2470cce5a81321ced305ae8253aff9c403382c754d3dc"
                                              ]
                       },
        "title":  "Nonograma del Archivo",
        "patri":  {
                      "roleBadge":  "Patri · Pistas de Columnas",
                      "widget":  {
                                     "side":  "cols",
                                     "clues":  [
                                                   "4",
                                                   "1,1",
                                                   "1,1",
                                                   "1,1",
                                                   "4"
                                               ],
                                     "type":  "nonogram"
                                 },
                      "brief":  "Dicta las pistas de columnas a Miguel e identifica qué sala empieza por la letra revelada.",
                      "partnerHint":  "Dicta las columnas a Miguel. Al formar la letra en la cuadrícula 5x5, combina la letra + su código (ej. B05).",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003ePistas verticales (de izquierda a derecha):\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eCol 1: \u003cstrong\u003e4\u003c/strong\u003e \u0026nbsp;|\u0026nbsp; Col 2: \u003cstrong\u003e1, 1\u003c/strong\u003e \u0026nbsp;|\u0026nbsp; Col 3: \u003cstrong\u003e1, 1\u003c/strong\u003e \u0026nbsp;|\u0026nbsp; Col 4: \u003cstrong\u003e1, 1\u003c/strong\u003e \u0026nbsp;|\u0026nbsp; Col 5: \u003cstrong\u003e4\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e\u003cp\u003e\u003cstrong\u003eSalas de Arte:\u003c/strong\u003e \u003cstrong\u003eA\u003c/strong\u003erchivo Histórico (Cód. 19) · \u003cstrong\u003eB\u003c/strong\u003eiblioteca (Cód. 05) · \u003cstrong\u003eC\u003c/strong\u003eapilla (Cód. 23).\u003c/p\u003e"
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. 2315",
                       "brief":  "Lee tus mensajes alternándolos en voz alta con Patri.",
                       "acceptedHashes":  [
                                              "ed3c9dc579bb8a9de33c72abb3d5230c3f81dfb332f9e93a2468b9828e718997"
                                          ],
                       "roleBadge":  "Miguel · Paquetes Impares (1, 3, 5)",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003e[Msg 1]:\u003c/strong\u003e Torre a Gabriel: el temporal empeora, el viento supera los 90 km/h.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[Msg 3]:\u003c/strong\u003e Gabriel: recibido, estoy en el hangar atando las palas y activando la baliza \u003cstrong\u003eHEL-902\u003c/strong\u003e.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[Msg 5]:\u003c/strong\u003e Gabriel: imposible acercarme al hotel hasta que pare la ventisca.\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "caption":  "Hilo Parcial Impar",
                                      "items":  [
                                                    "Baliza hangar: HEL-902",
                                                    "Falta hora del último mensaje"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "inputLabel":  "Hora exacta del Msg 6 sin dos puntos (dato de Patri)",
                       "partnerHint":  "Dile a Patri el código de baliza (HEL-902). Pregúntale la hora exacta de su mensaje de cierre."
                   },
        "kicker":  "DÍA 13 · MENSAJERÍA INTERCEPTADA",
        "day":  13,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTgiLCJmb3JlbnNpY1RhZyI6IkJBTElaQSBERSBIQU5HQVIgQUNUSVZBIDIzOjM3IEgiLCJjb25jbHVzaW9uIjoiTGEgYmFsaXphIEhFTC05MDIgZGVsIGhhbmdhciBleHRlcmlvciBwZXJtYW5lY2nDsyBlbWl0aWVuZG8gbWFudWFsbWVudGUgYmFqbyBzdXBlcnZpc2nDs24gZGUgR2FicmllbCBTZXJyYW5vIGEgNDAwIG1ldHJvcyBkZWwgaG90ZWwgZHVyYW50ZSBlbCBjcmltZW4uIFF1ZWRhIGRlc2NhcnRhZG8uIn0=",
        "story":  "El volcado de mensajería del piloto Gabriel Serrano llegó dividido en paquetes pares e impares entre vuestras terminales.",
        "hints":  [
                      "Miguel tiene el código de baliza HEL-902; Patri tiene la hora de confirmación radar 23:37.",
                      "Intercambiad ambos datos sin guiones ni dos puntos.",
                      "Solución del Día 13 — Miguel: 2337 · Patri: HEL902."
                  ],
        "title":  "Chats Fragmentados",
        "patri":  {
                      "inputPlaceholder":  "Ej. HEL100",
                      "brief":  "Alterna tus mensajes pares con los impares de Miguel.",
                      "acceptedHashes":  [
                                             "ca97498a163f150d757b01e8ac59966f373377fc18186e23c1a380baa8e2a198"
                                         ],
                      "roleBadge":  "Patri · Paquetes Pares (2, 4, 6)",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003e[Msg 2 - 23:31]:\u003c/strong\u003e Torre: confirma si puedes despegar antes de medianoche.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[Msg 4 - 23:34]:\u003c/strong\u003e Torre: anota el código de tu baliza para el radar militar.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[Msg 6 - 23:37]:\u003c/strong\u003e Torre: baliza confirmada en pantalla a las \u003cstrong\u003e23:37\u003c/strong\u003e, quédate en el hangar.\u003c/li\u003e\u003c/ul\u003e",
                      "widget":  {
                                     "caption":  "Hilo Parcial Par",
                                     "items":  [
                                                   "Confirmación radar: 23:37 h",
                                                   "Introduce código baliza sin guiones"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "inputLabel":  "Código de baliza sin guiones (dato de Miguel)",
                      "partnerHint":  "Comunica a Miguel la hora del Msg 6 (23:37) y pídele el código alfanumérico de la baliza."
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Repetidor Norte",
                       "widget":  {
                                      "caption":  "Cobertura Antena Norte",
                                      "items":  [
                                                    "Rango confirmado: Hab. 204 · Hab. 205",
                                                    "Formato código: Nº Habitación + iniciales AUD"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "brief":  "Marca en el plano qué habitaciones están dentro del radio del Repetidor Norte.",
                       "partnerHint":  "Dile a Patri tus dos habitaciones candidatas (204 y 205) para cruzarlas con su Repetidor Sur.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003ePasillo Planta 2 (de izquierda a derecha):\u003c/strong\u003e Hab. 201 · 202 · 203 · 204 · 205 · 206.\u003c/p\u003e\u003cp\u003eEl \u003cstrong\u003eRepetidor Norte\u003c/strong\u003e (situado en la Hab. 203) indica que la señal del portátil está en el rango \u003cstrong\u003eHab. 204 o Hab. 205\u003c/strong\u003e.\u003c/p\u003e"
                   },
        "hints":  [
                      "Miguel tiene {204, 205}. Patri tiene {205, 206}.",
                      "La única intersección posible es la habitación 205. Añade AUD detrás.",
                      "Solución del Día 14: 205AUD."
                  ],
        "kicker":  "DÍA 14 · ANTENAS PLANTA 2",
        "day":  14,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjIiLCJmb3JlbnNpY1RhZyI6IlNFU0nDk04gSU5JTlRFUlJVTVBJREEgRU4gSEFCLiAyMDUiLCJjb25jbHVzaW9uIjoiTGEgdHJpYW5ndWxhY2nDs24gV2ktRmkgc2l0w7phIGVsIHBvcnTDoXRpbCBhY3Rpdm8gZGUgUmHDumwgQ3Vlc3RhIGRlbnRybyBkZSBsYSBIYWJpdGFjacOzbiAyMDUgYSBsYXMgMjM6NDAgaCBkZXNjYXJnYW5kbyBiYWxhbmNlcyBmaXNjYWxlcy4gUXVlZGEgZGVzY2FydGFkby4ifQ==",
        "story":  "El portátil del auditor fiscal descargó un lote de copias de seguridad exactamente a las 23:40 h. Podéis triangular su habitación exacta cruzando dos antenas.",
        "jointInput":  {
                           "label":  "Habitación única + código AUD",
                           "placeholder":  "Ej. 204AUD",
                           "acceptedHashes":  [
                                                  "a1b590e638e3907a8d0215c4988ac4e95e4dddaf07190ed207fac23d205e7a75"
                                              ]
                       },
        "title":  "Triangulación Wi-Fi",
        "patri":  {
                      "roleBadge":  "Patri · Repetidor Sur",
                      "widget":  {
                                     "caption":  "Cobertura Antena Sur",
                                     "items":  [
                                                   "Rango confirmado: Hab. 205 · Hab. 206",
                                                   "Usuario MAC: Raúl Cuesta (AUD)"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Cruza el alcance del Repetidor Sur con las candidatas que te dé Miguel.",
                      "partnerHint":  "Busca qué única habitación coincide en ambos repetidores y añádele AUD al final (ej. 204AUD).",
                      "clueHtml":  "\u003cp\u003eEl \u003cstrong\u003eRepetidor Sur\u003c/strong\u003e (situado junto al ascensor Sur en 207) sitúa la conexión en el rango \u003cstrong\u003eHab. 205 o Hab. 206\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eAdemás, el registro identifica la MAC del portátil de \u003cstrong\u003eRaúl Cuesta\u003c/strong\u003e (código de perfil: \u003cstrong\u003eAUD\u003c/strong\u003e).\u003c/p\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Placa y Plano (D1 y D3)",
                       "widget":  {
                                      "displayLabel":  "Combinación de 4 dígitos",
                                      "type":  "keypad"
                                  },
                       "brief":  "Obtén D1 y calcula D3 usando el dato D2 de Patri.",
                       "partnerHint":  "Dile a Patri D1 (3) y el año 1987. Pregúntale cuánto vale D2 para calcular D3.",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eD1:\u003c/strong\u003e Número de plantas de huéspedes del hotel (\u003cstrong\u003e3\u003c/strong\u003e plantas).\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eD3:\u003c/strong\u003e Suma \u003cstrong\u003eD2 + 2\u003c/strong\u003e (pide D2 a Patri).\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eDato extra para Patri:\u003c/strong\u003e La placa inaugural del hotel dice \u003cem\u003e«Fundado en 1987»\u003c/em\u003e.\u003c/li\u003e\u003c/ul\u003e"
                   },
        "hints":  [
                      "D1 = 3 (plantas), D2 = 2 (chimeneas).",
                      "D3 = D2 + 2 = 4. Como el año es 1987, su último dígito D4 = 7.",
                      "Solución del Día 15: 3247."
                  ],
        "kicker":  "DÍA 15 · COMBINACIÓN COMPARTIDA",
        "day":  15,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDYiLCJmb3JlbnNpY1RhZyI6IlBBR0FSw4kgU0VMTEFETyBBIExBUyAyMzo0MCBIIiwiY29uY2x1c2lvbiI6IkRlbnRybyBkZSBsYSBjYWphIGZ1ZXJ0ZSBhcGFyZWNlIGVsIHBhZ2Fyw6kgc2VsbGFkbyBwb3IgUmljYXJkbyBQZcOxYSB5IGVsIGNvbnNlcmplIGF1eGlsaWFyIGEgbGFzIDIzOjQwIGgganVudG8gYWwgbW9zdHJhZG9yIGRlIHJlY2VwY2nDs24uIFF1ZWRhIGRlc2NhcnRhZG8uIn0=",
        "story":  "Para comprobar el pagaré firmado por el constructor Ricardo Peña, debéis abrir la caja fuerte auxiliar de recepción introduciendo sus 4 dígitos [D1-D2-D3-D4].",
        "jointInput":  {
                           "label":  "Combinación de la caja fuerte (4 dígitos)",
                           "placeholder":  "Ej. 1234",
                           "acceptedHashes":  [
                                                  "32ec692a60618d8c17a808fbad9c27d4e5450c56fadbb7dab4f4af0fcb69a0d4"
                                              ]
                       },
        "title":  "La Caja Fuerte de Recepción",
        "patri":  {
                      "roleBadge":  "Patri · Ficha del Salón (D2 y D4)",
                      "widget":  {
                                     "caption":  "Manual Auxiliar",
                                     "items":  [
                                                   "D1 (Miguel) · D2 = 2 · D3 (D2+2) · D4 (último dígito año)"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Obtén D2 y calcula D4 usando el año de la placa de Miguel.",
                      "partnerHint":  "Dile a Miguel que D2 = 2. Pregúntale el año de fundación para hallar D4.",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eD2:\u003c/strong\u003e Número de chimeneas del Salón Mirador (ficha arquitectónica: \u003cstrong\u003e2\u003c/strong\u003e chimeneas).\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eD4:\u003c/strong\u003e Último dígito del año de fundación del hotel que tiene Miguel.\u003c/li\u003e\u003c/ul\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Ecualizador de Señal",
                       "widget":  {
                                      "targetHz":  440,
                                      "clearText":  "Llamada Suite 305 (23:35–23:48): Sofía hablando con su madre. Palabra clave: NEVADA",
                                      "stepHz":  20,
                                      "type":  "frequency",
                                      "minHz":  200,
                                      "maxHz":  700
                                  },
                       "brief":  "Desliza el sintonizador hasta los hercios que te indique Patri para revelar el mensaje.",
                       "partnerHint":  "Pide a Patri la frecuencia exacta en Hz en su informe de telefonía. Luego léele la palabra clave que aparezca.",
                       "clueHtml":  "\u003cp\u003eAjusta la frecuencia en el deslizador hasta eliminar el ruido blanco de la tormenta.\u003c/p\u003e"
                   },
        "hints":  [
                      "Patri dice 440 Hz. Miguel desliza el control hasta 440 Hz.",
                      "Al llegar a 440 Hz aparece la palabra NEVADA. Únela al número de suite (305).",
                      "Solución del Día 16: NEVADA305."
                  ],
        "kicker":  "DÍA 16 · FILTRO DE AUDIO",
        "day":  16,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTEiLCJmb3JlbnNpY1RhZyI6IkxMQU1BREEgU0FURUxJVEFMIFZFUklGSUNBREEiLCJjb25jbHVzaW9uIjoiTGEgZ3JhYmFjacOzbiBzYXRlbGl0YWwgZGUgMTMgbWludXRvcyBkZW11ZXN0cmEgcXVlIFNvZsOtYSBOYXZhcnJvIHBlcm1hbmVjacOzIGVuIGxhIFN1aXRlIDMwNSBoYWJsYW5kbyBjb24gc3UgbWFkcmUgZHVyYW50ZSB0b2RvIGVsIGFwYWfDs24uIFF1ZWRhIGRlc2NhcnRhZGEuIn0=",
        "story":  "Una grabación satelital de la Suite 305 quedó oculta bajo el rugido de la ventisca. Solo sintonizando la frecuencia exacta se limpia la transcripción.",
        "jointInput":  {
                           "label":  "Palabra clave + número de suite",
                           "placeholder":  "Ej. CLAVE305",
                           "acceptedHashes":  [
                                                  "52cc43be5990b5ddf14bb95f37fbfbdc818e5f6b966e8a5028eec1d2125344a7"
                                              ]
                       },
        "title":  "Frecuencia en el Buzón",
        "patri":  {
                      "roleBadge":  "Patri · Informe de Telefonía",
                      "widget":  {
                                     "caption":  "Parámetros Satélite",
                                     "items":  [
                                                   "Frecuencia óptima: 440 Hz",
                                                   "Formato: PALABRA + 305"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Indica la frecuencia portadora a Miguel y combina su palabra clave con el número de suite.",
                      "partnerHint":  "Dile a Miguel que sintonice 440 Hz. Luego pídele la palabra clave revelada.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eInforme Antena Satelital:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eBanda limpia asignada: \u003cstrong\u003e440 Hz\u003c/strong\u003e\u003c/li\u003e\u003cli\u003eDestino de grabación: \u003cstrong\u003eSuite 305\u003c/strong\u003e (Sofía Navarro)\u003c/li\u003e\u003c/ul\u003e\u003cp\u003eIntroduce la palabra clave limpia que lea Miguel seguida de los 3 dígitos de la suite (ej. CLAVE305).\u003c/p\u003e"
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. bodega",
                       "brief":  "Usa vuestras 4 pistas combinadas para averiguar en qué LUGAR estuvo el chef Héctor Salgado.",
                       "acceptedHashes":  [
                                              "91ca29a365ca8d9ac4c4b0e36a2f02a9b6aab8208c2cb71432b01d1aed016061"
                                          ],
                       "roleBadge":  "Miguel · Pistas Lógicas A",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003ePista 1:\u003c/strong\u003e Quien estuvo en la \u003cstrong\u003eCocina\u003c/strong\u003e lo hizo a las \u003cstrong\u003e23:40\u003c/strong\u003e.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 2:\u003c/strong\u003e \u003cstrong\u003eBeatriz\u003c/strong\u003e no pisó la Cocina ni estuvo en ningún sitio a las 23:30.\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "cols":  [
                                                   "Cocina",
                                                   "Bodega",
                                                   "Salón"
                                               ],
                                      "rows":  [
                                                   "Héctor",
                                                   "Nora",
                                                   "Beatriz"
                                               ],
                                      "type":  "logic3x3"
                                  },
                       "inputLabel":  "¿En qué lugar estuvo Héctor? (una palabra)",
                       "partnerHint":  "Comparte tus dos pistas con Patri y usa la parrilla para deducir el lugar de Héctor."
                   },
        "kicker":  "DÍA 17 · LÓGICA CRUZADA 3x3",
        "day":  17,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDIiLCJmb3JlbnNpY1RhZyI6IkVRVUlQTyBERSBDT0NJTkEgQ09NTyBURVNUSUdPIiwiY29uY2x1c2lvbiI6IkxvcyB0cmVzIHBpbmNoZXMgY29uZmlybWFuIHF1ZSBIw6ljdG9yIFNhbGdhZG8gbm8gc2FsacOzIGRlIGxhIENvY2luYSBhIGxhcyAyMzo0MCBoIHN1cGVydmlzYW5kbyBlbCBzb3VmZmzDqSBuYXZpZGXDsW8uIFF1ZWRhIGRlc2NhcnRhZG8uIn0=",
        "story":  "Tres personas (Héctor, Nora y Beatriz) estuvieron en tres lugares distintos (Cocina, Bodega y Salón) a tres horas exactas (23:30, 23:40 y 23:50).",
        "hints":  [
                      "Por Pista 1, Cocina = 23:40. Por Pista 3, Nora en Bodega 10 min antes -\u003e Bodega = 23:30.",
                      "Solo queda Salón = 23:50. Como Beatriz no fue a Cocina ni a 23:30, Beatriz = Salón 23:50 -\u003e Héctor = Cocina 23:40.",
                      "Solución del Día 17 — Miguel: cocina · Patri: 2340."
                  ],
        "title":  "Parrilla Deductiva del Comedor",
        "patri":  {
                      "inputPlaceholder":  "Ej. 2330",
                      "brief":  "Combina tus pistas con las de Miguel para deducir a qué HORA estuvo Héctor allí.",
                      "acceptedHashes":  [
                                             "f15a3a5d34619f23d79d4124224e69f757a36d8ffb90aa7c17bf085ceb6cd53a"
                                         ],
                      "roleBadge":  "Patri · Pistas Lógicas B",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003ePista 3:\u003c/strong\u003e \u003cstrong\u003eNora\u003c/strong\u003e bajó a la \u003cstrong\u003eBodega\u003c/strong\u003e 10 minutos antes que la persona de la Cocina.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 4:\u003c/strong\u003e \u003cstrong\u003eHéctor\u003c/strong\u003e es el único con acceso al área de fogones y nunca entra en Bodega.\u003c/li\u003e\u003c/ul\u003e",
                      "widget":  {
                                     "cols":  [
                                                  "23:30",
                                                  "23:40",
                                                  "23:50"
                                              ],
                                     "rows":  [
                                                  "Héctor",
                                                  "Nora",
                                                  "Beatriz"
                                              ],
                                     "type":  "logic3x3"
                                 },
                      "inputLabel":  "¿A qué hora estuvo Héctor en ese lugar? (4 dígitos)",
                      "partnerHint":  "Lee tus pistas a Miguel para deducir la hora exacta de Héctor (4 dígitos sin dos puntos)."
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Calibre Métrico",
                       "widget":  {
                                      "targetCm":  25.5,
                                      "type":  "caliper",
                                      "table":  [
                                                    {
                                                        "cm":  "24.0 cm",
                                                        "size":  "37"
                                                    },
                                                    {
                                                        "cm":  "25.5 cm",
                                                        "size":  "39"
                                                    },
                                                    {
                                                        "cm":  "27.0 cm",
                                                        "size":  "42"
                                                    },
                                                    {
                                                        "cm":  "28.5 cm",
                                                        "size":  "44"
                                                    }
                                                ]
                                  },
                       "brief":  "Ajusta el calibre deslizante para medir la longitud exacta de la pisada en centímetros.",
                       "partnerHint":  "Dile a Patri la talla europea que corresponde a la huella medida en tu calibre.",
                       "clueHtml":  "\u003cp\u003eMueve el deslizador hasta alinear la punta y el tacón de la suela Vibram para leer su talla equivalente.\u003c/p\u003e"
                   },
        "hints":  [
                      "El calibre de Miguel encaja exactamente en 25.5 cm, que en la tabla equivale a Talla 39.",
                      "La ficha de Patri marca Talla 37 para Adriana Orozco.",
                      "Solución del Día 18: 3937."
                  ],
        "kicker":  "DÍA 18 · CALIBRE FORENSE ABFO",
        "day":  18,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjUiLCJmb3JlbnNpY1RhZyI6IkNBTFpBRE8gU0VDTyBFTiBUQVFVSUxMQSAyMzozMiBIIiwiY29uY2x1c2lvbiI6IkFkcmlhbmEgT3JvemNvIGRlasOzIHN1cyBib3RhcyB0YWxsYSAzNyBzZWNhcyBlbiByZWNlcGNpw7NuIGEgbGFzIDIzOjMyIGggeSBudW5jYSBwaXPDsyBlbCBwYXRpbyBjb24gYm90YXMgdGFsbGEgMzkuIFF1ZWRhIGRlc2NhcnRhZGEuIn0=",
        "story":  "Una pisada nítida junto al alféizar exterior planteó dudas sobre la farmacéutica Adriana Orozco. Medid la huella y comparadla con el registro de calzado.",
        "jointInput":  {
                           "label":  "Talla huella + Talla Adriana (4 dígitos)",
                           "placeholder":  "Ej. 4237",
                           "acceptedHashes":  [
                                                  "9c67d3b75b1e8364898454889940f9cb70b4022532d0aaaf1f1d979504b149f4"
                                              ]
                       },
        "title":  "Huellas en la Nieve del Patio",
        "patri":  {
                      "roleBadge":  "Patri · Préstamo de Botas",
                      "widget":  {
                                     "caption":  "Comparativa Biométrica",
                                     "items":  [
                                                   "Talla huella patio (Miguel) + Talla Adriana (37)",
                                                   "Formato: 4 dígitos seguidos"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Comprueba qué talla calza realmente Adriana Orozco en el registro de recepción.",
                      "partnerHint":  "Pide a Miguel la talla de la huella del patio y únela a la talla 37 de Adriana (4 dígitos).",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eRegistro de Taquillas de Nieve:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eHab. 107 · \u003cstrong\u003eAdriana Orozco\u003c/strong\u003e: Bota izquierda/derecha \u003cstrong\u003eTalla 37\u003c/strong\u003e (entregadas secas a las 23:32 h)\u003c/li\u003e\u003cli\u003eHab. 203 · Elena Valls: Talla 38\u003c/li\u003e\u003c/ul\u003e\u003cp\u003ePara certificar la discordancia, introduce la \u003cstrong\u003eTalla de la huella (Miguel)\u003c/strong\u003e seguida de la \u003cstrong\u003eTalla real de Adriana (Patri)\u003c/strong\u003e.\u003c/p\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Extracto de Movimientos",
                       "widget":  {
                                      "caption":  "Bloque 1 del Token",
                                      "items":  [
                                                    "RX-88",
                                                    "Unir con Bloque 2 sin guiones"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "brief":  "Localiza el primer bloque del código de verificación en la transferencia de las 23:39 h.",
                       "partnerHint":  "Comunica RX-88 a Patri para unirlo con su segundo bloque.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eOperación saliente 23:39:10 h:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eOrdenante: Álvaro Roldán (Suite 303)\u003c/li\u003e\u003cli\u003eImporte: 45.000,00 EUR · Destino: Zúrich\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eToken Parcial 1:\u003c/strong\u003e \u003cstrong class=\u0027mono\u0027\u003eRX-88\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e"
                   },
        "hints":  [
                      "Miguel tiene RX-88 y Patri tiene 41-Z.",
                      "Al unir ambos quitando los guiones queda RX8841Z.",
                      "Solución del Día 19: RX8841Z."
                  ],
        "kicker":  "DÍA 19 · AUDITORÍA BANCARIA",
        "day":  19,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOm51bGwsImZvcmVuc2ljVGFnIjoiU0VTScOTTiBFTiBBVURJVE9Sw41BIMK3IFNJTiBERVNDQVJURSIsImNvbmNsdXNpb24iOiJMYSByZWZlcmVuY2lhIFJYODg0MVogYWNyZWRpdGEgdW5hIG9yZGVuIGRlc2RlIGxhIHJlZCBkZWwgaG90ZWwsIHBlcm8gcXVlZGEgcGVuZGllbnRlIGRlIGNvdGVqbyBiYW5jYXJpbyBkaXJlY3RvIHNpIHNlIGZpcm1vIGVuIHZpdm8gbyBlbiBkaWZlcmlkbyBkZXNkZSBsYSBTdWl0ZSAzMDMuIEFsdmFybyBSb2xkYW4gcGVybWFuZWNlIGFjdGl2byBjb21vIGZpbmFsaXN0YS4ifQ==",
        "story":  "El banquero Álvaro Roldán aseguró estar firmando una operación millonaria por internet desde su suite. Su token de seguridad está partido en dos.",
        "jointInput":  {
                           "label":  "Token completo sin guiones",
                           "placeholder":  "Ej. AB1234C",
                           "acceptedHashes":  [
                                                  "7782c55477c6db8cf787696d8f3828b9eefafe9bb242354c8186ccf24c7061ba"
                                              ]
                       },
        "title":  "Transferencias de Medianoche",
        "patri":  {
                      "roleBadge":  "Patri · Certificado Biométrico IP",
                      "widget":  {
                                     "caption":  "Bloque 2 del Token",
                                     "items":  [
                                                   "41-Z",
                                                   "Firma facial verificada en Suite 303"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Combina el bloque de Miguel con tu segundo bloque para validar la firma remota.",
                      "partnerHint":  "Pide el Token Parcial 1 a Miguel y añádele 41Z detrás (sin guiones).",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eLog de Firma Facial:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003eIP verificada: Router Suite 303 (23:39:14 h)\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eToken Parcial 2:\u003c/strong\u003e \u003cstrong class=\u0027mono\u0027\u003e41-Z\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e\u003cp\u003eIntroduce el token completo uniendo ambos bloques sin guiones.\u003c/p\u003e"
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. 2004",
                       "brief":  "Activa el filtro de metales para leer el grabado de la llave de bodega.",
                       "acceptedHashes":  [
                                              "d54123de468bd42ea00dafbd777f85fe5fa1ff6404d9838c007953c25c92a1c5"
                                          ],
                       "roleBadge":  "Miguel · Espectro Metálico",
                       "clueHtml":  "\u003cp\u003ePulsa el botón del escáner para filtrar los objetos metálicos dentro del maletín.\u003c/p\u003e",
                       "widget":  {
                                      "mode":  "metal",
                                      "reveal":  "LLAVE DE BODEGA: CAV-09",
                                      "sub":  "Metal de latón + termómetro de cava",
                                      "type":  "xray"
                                  },
                       "inputLabel":  "Año de añada en las botellas (dato de Patri)",
                       "partnerHint":  "Dile a Patri el código grabado en la llave metálica (ej. CAV09). Pregúntale la añada de la etiqueta orgánica."
                   },
        "kicker":  "DÍA 20 · FILTROS ESPECTRALES",
        "day":  20,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDciLCJmb3JlbnNpY1RhZyI6IlBSRUNJTlRPIERFIENBVkEgSU5UQUNUTyIsImNvbmNsdXNpb24iOiJFbCByZWdpc3RybyBiaW9tw6l0cmljbyBkZSBsYSBjYXZhIGluZmVyaW9yIHkgbGEgdmVyaWZpY2FjacOzbiBkZSBib3RlbGxhcyBwcnVlYmFuIHF1ZSBOb3JhIEVjaGV2YXJyw61hIHBlcm1hbmVjacOzIGludmVudGFyaWFuZG8gZW4gZWwgc3Vic3VlbG8uIFF1ZWRhIGRlc2NhcnRhZGEuIn0=",
        "story":  "El maletín de mano de la sumiller Nora Echevarría pasó por el escáner portátil. Miguel solo ve la capa metálica; Patri solo ve la capa orgánica.",
        "hints":  [
                      "Miguel activa el filtro metálico (CAV-09); Patri activa el filtro orgánico (1998).",
                      "Intercambiad ambos códigos (CAV09 sin guión y 1998).",
                      "Solución del Día 20 — Miguel: 1998 · Patri: CAV09."
                  ],
        "title":  "Escáner de Equipaje (Rayos X)",
        "patri":  {
                      "inputPlaceholder":  "Ej. CAV01",
                      "brief":  "Activa el filtro orgánico para leer el año en las botellas lacradas y la nota de cava.",
                      "acceptedHashes":  [
                                             "02bb43b4328c0c089761aec7469b194eb5b479bcb74f06e82e21370034a39ed3"
                                         ],
                      "roleBadge":  "Patri · Espectro Orgánico",
                      "clueHtml":  "\u003cp\u003ePulsa el botón del escáner para filtrar los materiales orgánicos y etiquetas de papel.\u003c/p\u003e",
                      "widget":  {
                                     "mode":  "organic",
                                     "reveal":  "RESERVA AÑADA 1998 · CAVA INFERIOR 23:30–23:50",
                                     "sub":  "Dos botellas intactas con precinto original",
                                     "type":  "xray"
                                 },
                      "inputLabel":  "Código de llave metálica sin guión (dato de Miguel)",
                      "partnerHint":  "Dile a Miguel la añada (4 cifras) y pregúntale el código de la llave sin guión."
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Fragmentos 1, 4 y 5",
                       "widget":  {
                                      "caption":  "Tus 3 Eventos",
                                      "items":  [
                                                    "23:30 -\u003e 4",
                                                    "23:42 -\u003e 9",
                                                    "23:45 -\u003e 1"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "brief":  "Combina tus 3 eventos con los 2 intermedios de Patri y ordena sus dígitos de menor a mayor hora.",
                       "partnerHint":  "Intercambia tus horas y dígitos con Patri para obtener la secuencia ordenada de 5 cifras.",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003e23:30 h [Dígito 4]:\u003c/strong\u003e Discusión verbal en la puerta de la Suite 301.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e23:42 h [Dígito 9]:\u003c/strong\u003e Vuelve el suministro eléctrico en Plantas 2 y 3.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e23:45 h [Dígito 1]:\u003c/strong\u003e Beatriz llama a recepción desde el teléfono fijo de la Sala de Lectura (Planta 2).\u003c/li\u003e\u003c/ul\u003e"
                   },
        "hints":  [
                      "Las horas en orden son: 23:30, 23:35, 23:38, 23:42, 23:45.",
                      "Sus dígitos respectivos son: 4, 7, 2, 9, 1.",
                      "Solución del Día 21: 47291."
                  ],
        "kicker":  "DÍA 21 · LÍNEA TEMPORAL",
        "day":  21,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDEiLCJmb3JlbnNpY1RhZyI6IlRFU1RJR09TIEVOIFNBTEEgREUgTEVDVFVSQSIsImNvbmNsdXNpb24iOiJUcmVzIGh1w6lzcGVkZXMgY29uZmlybWFuIGxhIHByZXNlbmNpYSBjb250aW51YSBkZSBCZWF0cml6IFZhbGRpdmllc28gZW4gbGEgU2FsYSBkZSBMZWN0dXJhIGRlIFBsYW50YSAyIGR1cmFudGUgZWwgYXBhZ8Ozbi4gUXVlZGEgZGVzY2FydGFkYS4ifQ==",
        "story":  "Los registros de la Planta 3 tienen cinco eventos repartidos entre vuestras pantallas. Ordenadlos cronológicamente de 23:30 a 23:45 para sacar el código.",
        "jointInput":  {
                           "label":  "Secuencia de 5 dígitos ordenada cronológicamente",
                           "placeholder":  "Ej. 12345",
                           "acceptedHashes":  [
                                                  "2fd2c50d7a07d99ef9f8147bf8ec05bf977d1edebf7c71bec7cc06d4a8195fdc"
                                              ]
                       },
        "title":  "Cronología de la Planta 3",
        "patri":  {
                      "roleBadge":  "Patri · Fragmentos 2 y 3",
                      "widget":  {
                                     "caption":  "Tus 2 Eventos",
                                     "items":  [
                                                   "23:35 -\u003e 7",
                                                   "23:38 -\u003e 2"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Encaja tus 2 eventos en la línea temporal de Miguel.",
                      "partnerHint":  "Ordena los 5 momentos desde las 23:30 hasta las 23:45 y escribe sus 5 dígitos seguidos.",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003e23:35 h [Dígito 7]:\u003c/strong\u003e El botones ve a Beatriz bajar las escaleras hacia la Planta 2.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e23:38 h [Dígito 2]:\u003c/strong\u003e Apagón general; tres huéspedes confirman que Beatriz ya leía junto a la ventana en Planta 2.\u003c/li\u003e\u003c/ul\u003e"
                  }
    },
    {
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Osciloscopio Eléctrico",
                       "widget":  {
                                      "type":  "voltage",
                                      "dropTime":  "23:38"
                                  },
                       "brief":  "Lee la hora exacta del corte provocado desde el cuadro de Planta 1.",
                       "partnerHint":  "Dile a Patri la hora de 4 dígitos del corte (2338) para unirla al código de la capilla.",
                       "clueHtml":  "\u003cp\u003eEl gráfico de tensión cae a cero exactamente a las \u003cstrong\u003e23:38 h\u003c/strong\u003e desde el cuadro situado tras el mostrador de Dirección (Planta 1).\u003c/p\u003e\u003cp\u003eEsto descarta por completo a quien estuviera encerrado en la Capilla Alpina.\u003c/p\u003e"
                   },
        "hints":  [
                      "El pico de corte en el osciloscopio de Miguel ocurre a las 23:38.",
                      "Une 2338 con CP.",
                      "Solución del Día 22: 2338CP."
                  ],
        "kicker":  "DÍA 22 · CUADRO ELÉCTRICO",
        "day":  22,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjMiLCJmb3JlbnNpY1RhZyI6IlBSRVNFTkNJQSBDT05USU5VQSBFTiBDQVBJTExBIiwiY29uY2x1c2lvbiI6IlRlcmVzYSBBbGFyY8OzbiBubyBzYWxpw7MgZGUgbGEgQ2FwaWxsYSBBbHBpbmEgZW4gbmluZ8O6biBtb21lbnRvIG1pZW50cmFzIGFsZ3VpZW4gbWFuaXB1bGFiYSBlbCBjdWFkcm8gZWzDqWN0cmljbyBkZSBQbGFudGEgMS4gUXVlZGEgZGVzY2FydGFkYS4ifQ==",
        "story":  "El análisis del generador revela que el apagón no fue por la tormenta: alguien bajó manualmente el diferencial principal desde la Planta 1.",
        "jointInput":  {
                           "label":  "Hora de corte (4 dígitos) + CP",
                           "placeholder":  "Ej. 2210CP",
                           "acceptedHashes":  [
                                                  "693062f9b700c27dd77d568db0b1ffbb53683bb1970a891c6d4be39d64328da9"
                                              ]
                       },
        "title":  "Pico de Voltaje en Planta 1",
        "patri":  {
                      "roleBadge":  "Patri · Sensor de la Capilla Alpina",
                      "widget":  {
                                     "caption":  "Sensor Capilla CP",
                                     "items":  [
                                                   "Teresa Alarcón: 23:25–23:50 h",
                                                   "Formato: HORA(4) + CP"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Comprueba quién estuvo rezando en la capilla sin acercarse al cuadro eléctrico.",
                      "partnerHint":  "Pide a Miguel la hora exacta del corte y añade CP al final (ej. 2210CP).",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eRegistro Capilla (Código de puerta: \u003cspan class=\u0027mono\u0027\u003eCP\u003c/span\u003e):\u003c/strong\u003e\u003c/p\u003e\u003cp\u003eTeresa Alarcón encendió velas y permaneció en la capilla cerrada desde las 23:25 hasta las 23:50 h acompañada por el sensor de presencia continuo.\u003c/p\u003e\u003cp\u003eIntroduce la \u003cstrong\u003eHora de corte (4 dígitos de Miguel)\u003c/strong\u003e + \u003cstrong\u003eCódigo de puerta CP\u003c/strong\u003e.\u003c/p\u003e"
                  }
    },
    {
        "mode":  "dual-lock",
        "miguel":  {
                       "inputPlaceholder":  "Ej. 201X",
                       "brief":  "Extrae el número de protocolo notarial hallado en el abrigo de Arturo.",
                       "acceptedHashes":  [
                                              "14577b51f90dcf31ca5db4b722b82bfca531c95e4f9f4aaedb79bf2159f81d19"
                                          ],
                       "roleBadge":  "Miguel · Borrador del Bolsillo",
                       "clueHtml":  "\u003cp\u003eEn el bolsillo interior de Arturo apareció un acuerdo mercantil que debía firmarse el 1 de diciembre con el \u003cstrong\u003eProtocolo Notarial Nº 774\u003c/strong\u003e.\u003c/p\u003e",
                       "widget":  {
                                      "caption":  "Documento Mercantil",
                                      "items":  [
                                                    "Protocolo Nº 774",
                                                    "Cita de firma: 01/12"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "inputLabel":  "Clave de antena de la Suite 304 (dato de Patri)",
                       "partnerHint":  "Dile a Patri el número de protocolo 774. Pregúntale la clave alfanumérica de antena de la Suite 304."
                   },
        "kicker":  "DÍA 23 · PROTOCOLO NOTARIAL",
        "day":  23,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDkiLCJmb3JlbnNpY1RhZyI6IkxMQU1BREEgSU5JTlRFUlJVTVBJREEgMjYgTUlOIiwiY29uY2x1c2lvbiI6IkxvcyByZWdpc3Ryb3MgZGUgb3BlcmFkb3JhIHViaWNhbiBhIFZhbGVyaWEgRG9tw61uZ3VleiBhbCB0ZWzDqWZvbm8gZW4gbGEgU3VpdGUgMzA0IGR1cmFudGUgMjYgbWludXRvcyBpbmludGVycnVtcGlkb3MuIFNvbG8gcXVlZGFuIGRvcyBzb3NwZWNob3NvcyBwYXJhIE5vY2hlYnVlbmEuIn0=",
        "story":  "Solo quedan tres sospechosos en el tablero. Una llamada de larga duración desde Madrid está a punto de despejar uno de los nombres más tensos.",
        "hints":  [
                      "Miguel tiene el protocolo 774; Patri tiene la clave de antena 304V.",
                      "Intercambiad ambos códigos.",
                      "Solución del Día 23 — Miguel: 304V · Patri: 774."
                  ],
        "title":  "La Penúltima Coartada",
        "patri":  {
                      "inputPlaceholder":  "Ej. 100",
                      "brief":  "Comprueba la llamada continua de Valeria Domínguez y envía su clave a Miguel.",
                      "acceptedHashes":  [
                                             "089ee14b926fabea6dd95890032d1a37e69c1011c710977af774ec3a7b5b39a6"
                                         ],
                      "roleBadge":  "Patri · Registro de Antena Celular",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eSábana de llamadas · Valeria Domínguez:\u003c/strong\u003e\u003c/p\u003e\u003cp\u003eLlamada saliente ininterrumpida a su bufete de Madrid de \u003cstrong\u003e23:28 a 23:54 h\u003c/strong\u003e desde la ventana de la Suite 304 (\u003cstrong\u003eClave de antena: 304V\u003c/strong\u003e) discutiendo el borrador que tiene Miguel.\u003c/p\u003e",
                      "widget":  {
                                     "caption":  "Antena Suite 304",
                                     "items":  [
                                                   "Llamada 23:28–23:54 h confirmada",
                                                   "Clave antena: 304V"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "inputLabel":  "Número de protocolo notarial (dato de Miguel)",
                      "partnerHint":  "Dile a Miguel la clave 304V. Pídele los 3 dígitos del número de protocolo notarial."
                  }
    },
    {
        "mode":  "final-trial",
        "miguel":  {
                       "roleBadge":  "Miguel · Toxicología y Cerradura 206",
                       "widget":  {
                                      "caption":  "Prueba Reina de Laboratorio",
                                      "items":  [
                                                    "Toxina: Aconitina (Acónito)",
                                                    "Apertura Hab. 206 (18:15 h): KEY-DIR-01"
                                                ],
                                      "type":  "dossier-card"
                                  },
                       "brief":  "Descubre qué veneno mató a Arturo y qué llave maestra abrió la Hab. 206 a las 18:15 h.",
                       "partnerHint":  "Confirma a Patri el código KEY-DIR-01 y el veneno hallado para cruzar quién tiene acceso exclusivo a esa llave.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eAnálisis químico portátil:\u003c/strong\u003e La copa contenía un alcaloide letal extraído de planta alpina: \u003cstrong\u003eACONITINA\u003c/strong\u003e (del \u003cem\u003eacónito\u003c/em\u003e).\u003c/p\u003e\u003cp\u003e\u003cstrong\u003eCerradura electrónica Hab. 206 (18:15 h):\u003c/strong\u003e Apertura registrada con la llave maestra \u003cstrong class=\u0027mono\u0027\u003eKEY-DIR-01\u003c/strong\u003e.\u003c/p\u003e"
                   },
        "hints":  [
                      "Paso 1: el código de la llave maestra sin guiones es KEYDIR01. Al validarlo, queda un único sospechoso en el tablero.",
                      "Paso 2: selecciona al único sospechoso restante, veneno \u0027aconitina\u0027 (o \u0027acónito\u0027) y maniobra \u0027apagón\u0027 (o \u0027cuadro eléctrico\u0027).",
                      "Solución del Día 24 — Llave: KEYDIR01 · Culpable: Carmen Ibáñez · Veneno: aconitina · Maniobra: apagón."
                  ],
        "finalVerdict":  {
                             "suspectHashes":  [
                                                   "a52ba8b1e0bd26a9a9292be45e1653663828573d6e8b629cde0351a21afd2945",
                                                   "0eaee3f47e9504946c44faba22d09c8616c43281659221a329aa64e0355f1e29",
                                                   "f3c2ce176290b0c384cb4881eb714f2db58f630c33863d91c9bedf58d36007db"
                                               ],
                             "poisonHashes":  [
                                                  "a82cc0de8575fad76adf1d0ca238a9850031ca313cdc77e368bc5b24d7267a85",
                                                  "42bc41ee90733ac6d58deb9add86e2b4c466a95c29c0e896c0e796d0fdb01190"
                                              ],
                             "methodHashes":  [
                                                  "8d56b8693ae6c0cad69cb368b032771fca1662a021f34e55a08c3fe937ce9696",
                                                  "fb4b4fa0e6034e97e308de8fed645cceec79c5815f98c3e2fd67c10b6344c61a",
                                                  "a6c8eb06d8cbb823d1be11d23bda3427467f31b6c692c4200bf99326cef3d911",
                                                  "c6ce5f796115921afe158021f045e7c6d6820383191907ff6add8b3f502082a1"
                                              ],
                             "reasonHashes":  [
                                                  "fb01ef138f44fcfe4e13ea3956c6fbc6b8970abe5908735ce1ff514229f9e0f9"
                                              ]
                         },
        "kicker":  "DÍA 24 · RESOLUCIÓN FINAL",
        "day":  24,
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTMiLCJmb3JlbnNpY1RhZyI6IklOw4lTIENBU0FETyBFWE9ORVJBREEgwrcgTExBVkUgTUFFU1RSQSBBSVNMQURBIiwiY29uY2x1c2lvbiI6Ikluw6lzIENhc2FkbyBlc3RhYmEgZW4gZWwgU3BhIFRlcm1hbCBjdWFuZG8gbGEgbGxhdmUgbWFlc3RyYSBLRVktRElSLTAxIGVudHLDsyBlbiBzdSBoYWJpdGFjacOzbiBwYXJhIHN1c3RyYWVyIGVsIHZpYWwgZGUgYWNvbml0aW5hLiIsImZpbmFsRXBpbG9ndWUiOnsidGl0bGUiOiJPUkRFTiBERSBERVRFTkNJw5NOIEVKRUNVVEFEQSDCtyBDQVNPIFJFU1VFTFRPIiwiY3VscHJpdElkIjoiczAzIiwiY3VscHJpdE5hbWUiOiJDYXJtZW4gSWLDocOxZXoiLCJjb25mZXNzaW9uIjoiQWNvcnJhbGFkYSBwb3IgbGEgbGVjdHVyYSBkZSBzdSBsbGF2ZSBtYWVzdHJhIEtFWS1ESVItMDEgZW4gbGEgSGFiLiAyMDYsIGVsIHJhc3RybyBkZSBhY29uaXRpbmEgZW4gbGEgbWFuZ2EgZGUgc3UgYmxhemVyIHkgZWwgYWNjZXNvIGFsIGN1YWRybyBlbMOpY3RyaWNvIHRyYXMgc3UgbW9zdHJhZG9yLCBDYXJtZW4gSWLDocOxZXogY29uZmVzw7M6IHRyYXMgZG9jZSBhw7FvcyBzb3N0ZW5pZW5kbyBlbCBob3RlbCwgQXJ0dXJvIHByZXRlbmTDrWEgdmVuZGVybG8geSBkZXNwZWRpcmxhIGVsIDEgZGUgZW5lcm8uIEFwcm92ZWNow7MgZWwgYXBhZ8OzbiBkZSA0IG1pbnV0b3MgZGUgbGFzIDIzOjM4IGggcGFyYSB2ZXJ0ZXIgbGEgZG9zaXMgZW4gbGEgY29wYSBkZWwgU2Fsw7NuIE1pcmFkb3IuIn19",
        "story":  "Es 24 de diciembre. Dos sospechosos siguen en pie en vuestro tablero. Primero verificad la llave usada en la Habitación 206 para descartar al último inocente; después, emitid la Orden de Detención conjunta.",
        "jointInput":  {
                           "label":  "Paso 1 · Código de llave maestra sin guiones",
                           "placeholder":  "Ej. KEY000",
                           "acceptedHashes":  [
                                                  "13eab8866f78bab6d6ed4a285c33c55d430fb102fc6399501696e83406e81dcc"
                                              ]
                       },
        "title":  "Nochebuena: Juicio en el Ventisquero",
        "patri":  {
                      "roleBadge":  "Patri · Registro Spa e Inventario de Llaves",
                      "widget":  {
                                     "caption":  "Paso 1 · Descarte Final",
                                     "items":  [
                                                   "Código llave sin guiones: KEYDIR01",
                                                   "Paso 2 · Orden de Detención Final"
                                               ],
                                     "type":  "dossier-card"
                                 },
                      "brief":  "Comprueba la coartada de Inés Casado a las 18:15 h y a quién pertenece KEY-DIR-01.",
                      "partnerHint":  "Validad primero el código de llave sin guiones (KEYDIR01) para descartar a la última inocente; luego completad juntos el veredicto.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eSpa Termal (18:05–19:00 h):\u003c/strong\u003e Inés Casado estuvo dentro del circuito de aguas con firma y taquilla a las 18:15 h cuando robaron de su maletín en la Hab. 206.\u003c/p\u003e\u003cp\u003e\u003cstrong\u003eInventario único de llaves maestras:\u003c/strong\u003e \u003cstrong\u003eKEY-DIR-01\u003c/strong\u003e pertenece en exclusiva a \u003cstrong\u003eDirección del Hotel\u003c/strong\u003e (sin copias), junto al cuadro eléctrico de Planta 1 que provocó el \u003cstrong\u003eapagón\u003c/strong\u003e.\u003c/p\u003e"
                  }
    }
];