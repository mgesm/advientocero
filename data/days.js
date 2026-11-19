/**
 * ADVIENTO CERO - 24 DIAS DE INVESTIGACION COOPERATIVA
 * Overhaul v2.8.0: Patri al frente de herramientas interactivas + contexto en los 24 dias (Cero Spoilers).
 */

window.ADVENT_DAYS = [
    {
        "day":  1,
        "kicker":  "DÍA 01 · INSPECCIÓN DE MESAS",
        "title":  "El Brindis del Salón",
        "story":  "Veinte minutos antes de hallar a Arturo Valdivieso, el sensor óptico del salón captó un destello de xenón junto a uno de los ventanales. Debéis cruzar orientación, tarjetas anónimas y registro de recepción para identificar a quién ocupaba la Silla 3.",
        "dossierContext":  {
                               "focus":  "Durante la tarde, Arturo requisó por la fuerza la tarjeta de memoria de un fotógrafo acreditado tras una instantánea comprometedora. Además, varios invitados aseguran haber visto el fogonazo de una cámara junto a una mesa minutos antes del colapso.",
                               "alibi":  "El sospechoso sostiene que ya había salido al porche exterior Este antes de las 23:36 h para fotografiar el temporal y que no estaba dentro del Salón Mirador.",
                               "goal":  "Cruzar el plano del sensor óptico con las tarjetas de protocolo anónimas y el Check-in para confirmar en qué mesa y silla se sentaba y desde dónde se disparó el flash."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Orientación y Sensores",
                       "brief":  "Determina qué número de mesa y punto cardinal corresponden al destello de xenón de las 23:36 h.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eLecturas del Salón Mirador:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e23:31 h · Sensor Chimenea (Norte, Mesa 1): chispa térmica de leña.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e23:36 h · Sensor Ventanal de la Nieve:\u003c/strong\u003e destello de xenón 1/1000 s en el perímetro de la \u003cstrong\u003eMesa 4\u003c/strong\u003e.\u003c/li\u003e\u003c/ul\u003e\u003cp\u003eUsa el croquis superior para comprobar qué punto cardinal corresponde al Ventanal de la Nieve.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "room-map",
                                      "caption":  "Sensores Ópticos · Salón Mirador",
                                      "nodes":  [
                                                    {
                                                        "id":  "M1",
                                                        "label":  "Mesa 1 · Chimenea (Norte)",
                                                        "alert":  false
                                                    },
                                                    {
                                                        "id":  "M2",
                                                        "label":  "Mesa 2 · Comedor (Oeste)",
                                                        "alert":  false
                                                    },
                                                    {
                                                        "id":  "M3",
                                                        "label":  "Mesa 3 · Escenario (Sur)",
                                                        "alert":  false
                                                    },
                                                    {
                                                        "id":  "M4",
                                                        "label":  "Mesa 4 · Ventanal de la Nieve",
                                                        "alert":  true
                                                    }
                                                ]
                                  },
                       "inputLabel":  "Habitación del titular de Silla 3 (cruzada por Patri)",
                       "inputPlaceholder":  "Ej. 204",
                       "acceptedHashes":  [
                                              "9537f32ec7599e1ae953af6c9f929fe747ff9dadf79a9beff1f304c550173011",
                                              "0a3dd88578a129185bdcd718e97b712d0d7cc4932a0b70ab9ceb1d546a067cc7"
                                          ],
                       "partnerHint":  "Dile a Patri la inicial cardinal del Ventanal de la Nieve + el nº de mesa del destello (ej. N2). Pídele el nº de habitación del huésped cuyas iniciales figuran en la Silla 3."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Protocolo y Recepción",
                      "brief":  "Cruza la mesa indicada por Miguel con las tarjetas anónimas y el listado de Check-in.",
                      "clueHtml":  "\u003cp\u003eLas tarjetas de mesa solo muestran iniciales. Identifica en la \u003cstrong\u003eSilla 3\u003c/strong\u003e de la mesa correcta qué iniciales aparecen y búscalas en la lista de Check-in VIP de tu documento para dar su habitación a Miguel.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Protocolo Silla 3 · Mesa del Ventanal",
                                     "items":  [
                                                   "Iniciales en Silla 3: O.LL. (Acreditación Prensa)",
                                                   "Cotejar O.LL. con Check-in VIP para obtener habitación"
                                               ]
                                 },
                      "inputLabel":  "Código de zona: inicial cardinal + nº de mesa",
                      "inputPlaceholder":  "Ej. N2",
                      "acceptedHashes":  [
                                             "449777124b1466a8ed667d0dd4c0620993f59e20fb27b3fa8894e957f8762353"
                                         ],
                      "partnerHint":  "Comunica a Miguel el número de habitación que corresponde a O.LL. y pídele el código cardinal (inicial + número de mesa)."
                  },
        "hints":  [
                      "En el croquis de Miguel, el Ventanal de la Nieve mira al Este (E) y acoge la Mesa 4.",
                      "Patri ve en Silla 3 las iniciales O.LL., que en el registro Check-in corresponden a Óscar Llorente (Hab. 108).",
                      "Solución del Día 1 — Miguel: 108 · Patri: E4."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTYiLCJmb3JlbnNpY1RhZyI6IlRFU1RJR08gRVhURVJJT1IgVkVSSUZJQ0FETyIsImNvbmNsdXNpb24iOiLDk3NjYXIgTGxvcmVudGUgKEhhYi4gMTA4KSBxdWVkw7MgcmVnaXN0cmFkbyBwb3IgZWwgcmVsb2ogZXh0ZXJpb3IgZm90b2dyYWZpYW5kbyBsYSB0b3JtZW50YSBkZXNkZSBlbCBwb3JjaGUgRXN0ZSBlbnRyZSBsYXMgMjM6MzUgeSBsYXMgMjM6NDQgaC4gUXVlZGEgZGVzY2FydGFkby4ifQ=="
    },
    {
        "day":  2,
        "kicker":  "DÍA 02 · LINTERNA LUMINOL",
        "title":  "Manchas bajo Luz UV",
        "story":  "La bandeja de cócteles de la barra fue limpiada a toda prisa tras el hallazgo. Bajo tinta invisible UV no solo hay cifras: también dejaron anotada la regla de lectura del cierre frigorífico.",
        "dossierContext":  {
                               "focus":  "El barman Nicolás Ferrer sirvió personalmente las copas del brindis navideño en las que apareció el tóxico. Poco después del hallazgo, alguien limpió apresuradamente la bandeja de servicio de la barra.",
                               "alibi":  "Nicolás afirma no haber tocado la copa durante el apagón porque salió diez minutos al almacén frigorífico del sótano a buscar hielo.",
                               "goal":  "Revelar con luz ultravioleta la anotación invisible de la bandeja y cruzarla con el cuadrante nocturno de barra para comprobar si el registro del frigorífico confirma su bajada a las 23:34 h."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Cuadrante Nocturno",
                       "brief":  "Identifica el número de turno de quien estuvo en la cámara de hielo a las 23:34 h y aplica la regla UV.",
                       "clueHtml":  "\u003cp\u003eEn el parte de barra aparecen cuatro turnos distintos, pero solo uno bajó al almacén frigorífico a las \u003cstrong\u003e23:34 h\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eAplica la regla descubierta bajo la lámpara UV de Patri para construir el código de 4 cifras.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Construcción del Código de Almacén",
                                      "items":  [
                                                    "1 cifra: Nº turno del empleado que bajó a las 23:34 h",
                                                    "3 cifras: Código UV de Miguel leído de derecha a izquierda"
                                                ]
                                  },
                       "partnerHint":  "Pide a Patri los 3 dígitos UV y la regla oculta; identifica el turno de las 23:34 h en tu tabla."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Linterna Ultravioleta",
                      "brief":  "Recorre toda la superficie oscura para revelar tanto el código parcial como la regla de lectura.",
                      "clueHtml":  "\u003cp\u003eBajo luz UV 365 nm aparecen la hora de servicio, tres dígitos reactivos y una nota de inversión que deberás leer íntegramente a Miguel.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "uv-lamp",
                                     "prompt":  "Arrastra sobre toda la bandeja para ver código y regla",
                                     "secretSub":  "SERVICIO 23:34 H · PIN FRIG",
                                     "secretCode":  "7 - 4 - 2",
                                     "secretNote":  "REGLA: Nº TURNO + 3 DÍGITOS EN ORDEN INVERSO"
                                 },
                      "partnerHint":  "Dicta a Miguel los 3 dígitos luminol y la regla de orden inverso para que los combine con el cuadrante."
                  },
        "jointInput":  {
                           "label":  "Código de registro frigorífico (4 dígitos)",
                           "placeholder":  "Ej. 1000",
                           "acceptedHashes":  [
                                                  "cc8583c9721b171d6eba714aad590a5c3aa624de12916849a6f628fcace277b5"
                                              ]
                       },
        "hints":  [
                      "En la bandeja UV aparece 7-4-2 junto a la regla \u0027Nº Turno + 3 dígitos en orden inverso\u0027.",
                      "En el cuadrante de Miguel, Nicolás Ferrer (Turno #5) bajó a las 23:34 h. Invertir 7-4-2 da 247.",
                      "Solución del Día 2: 5247."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjAiLCJmb3JlbnNpY1RhZyI6IkNPQVJUQURBIERFIEFMTUFDw4lOIENPTkZJUk1BREEiLCJjb25jbHVzaW9uIjoiRWwgcmVnaXN0cm8gZnJpZ29yw61maWNvIDUyNDcgY29uZmlybWEgcXVlIE5pY29sw6FzIEZlcnJlciBlc3R1dm8gZW5jZXJyYWRvIGJ1c2NhbmRvIGhpZWxvIGVuIGVsIHPDs3Rhbm8gZW50cmUgbGFzIDIzOjM0IHkgbGFzIDIzOjQ0IGguIE5vIG1hbmlwdWzDsyBsYSBjb3BhIGR1cmFudGUgZWwgYXBhZ8Ozbi4ifQ=="
    },
    {
        "day":  3,
        "kicker":  "DÍA 03 · TELEMETRÍA DE EMERGENCIA",
        "title":  "Morse en la Centralita",
        "story":  "Durante el apagón de las 23:38 h, alguien activó un pulsador interior enviando cinco caracteres en código Morse internacional.",
        "dossierContext":  {
                               "focus":  "El conserje nocturno Tomás Bermúdez dependía de un acuerdo verbal de pensión interna que Arturo se negaba a firmar tras décadas de servicio en el hotel.",
                               "alibi":  "Asegura que al saltar la luz bajó al almacén del sótano para repartir mantas térmicas entre los huéspedes y que desde allí pulsó la llamada de emergencia.",
                               "goal":  "Traducir los cinco caracteres captados en código Morse por la centralita a las 23:39 h y cotejarlos con el directorio completo de extensiones para verificar desde qué planta se activó."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Receptor de Audio/Luz",
                       "brief":  "Reproduce la secuencia completa de cinco letras y díctala grupo a grupo a Patri.",
                       "clueHtml":  "\u003cp\u003eLa centralita captó \u003cstrong\u003e5 letras\u003c/strong\u003e a las 23:39 h. Escucha o sigue la lámpara de destellos separando bien las cinco pausas.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "morse",
                                      "label":  "Reproducir trama de 5 letras",
                                      "sequence":  "... --- - .- -."
                                  },
                       "partnerHint":  "Dicta a Patri los 5 bloques de puntos (·) y rayas (−) para que los descifre con la tabla completa A–Z."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Tabla Morse Internacional",
                      "brief":  "Traduce las 5 letras usando el alfabeto completo A–Z y cruza el sector con su extensión de ronda.",
                      "clueHtml":  "\u003cp\u003eLa tabla de conserjería incluye el alfabeto Morse íntegro y cuatro sectores de ronda nocturna. Une las \u003cstrong\u003e5 letras descifradas\u003c/strong\u003e seguidas de los \u003cstrong\u003e2 dígitos de su extensión\u003c/strong\u003e.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Formato de Validación",
                                     "items":  [
                                                   "5 letras descifradas en Morse + 2 dígitos de extensión",
                                                   "Ejemplo orientativo: CALDE18"
                                               ]
                                 },
                      "partnerHint":  "Traduce el código de Miguel letra por letra y busca qué sector coincide en el directorio de Tomás Bermúdez."
                  },
        "jointInput":  {
                           "label":  "Palabra de 5 letras + Extensión (2 dígitos)",
                           "placeholder":  "Ej. CALDE18",
                           "acceptedHashes":  [
                                                  "1bef830b3cf33ca819f0cb3dcb6c8bdb591fafded2e6747cb83e30b0f342e565"
                                              ]
                       },
        "hints":  [
                      "Los cinco bloques son: (...) (---) (-) (.-) (-.).",
                      "En Morse internacional equivalen a S-O-T-A-N (Sótano), cuya extensión asignada es 04.",
                      "Solución del Día 3: SOTAN04."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDgiLCJmb3JlbnNpY1RhZyI6IkxMQU1BREEgREUgRVhURU5TScOTTiAwNCBWRVJJRklDQURBIiwiY29uY2x1c2lvbiI6IlRvbcOhcyBCZXJtw7pkZXogbGxhbcOzIGRlc2RlIGVsIHRlbMOpZm9ubyBmaWpvIGRlbCBTw7N0YW5vIChFeHQuIDA0KSBhIGxhcyAyMzozOSBoIGFsIHF1ZWRhcnNlIGEgb3NjdXJhcyByZWNvZ2llbmRvIG1hbnRhcyB0w6lybWljYXMuIFF1ZWRhIGRlc2NhcnRhZG8uIn0="
    },
    {
        "day":  4,
        "kicker":  "DÍA 04 · CONTROL DE LAVANDERÍA",
        "title":  "Cuadrante de Llaves Maestras",
        "story":  "El armario de llaves maestras solo conserva dos cifras visibles en la mitad superior y dos en la inferior. Necesitáis resolver el Sudoku 4x4 completo cruzando deducciones para abrir el doble candado.",
        "dossierContext":  {
                               "focus":  "La gobernanta Marta Quiroga es una de las pocas personas con acceso físico a todas las llaves maestras del hotel, incluidas la suite de la víctima y los equipajes privados de los huéspedes.",
                               "alibi":  "Declara haber precintado el armario maestro de lavandería a las 23:25 h sin volver a sacar ninguna llave durante el resto de la velada.",
                               "goal":  "Completar entre ambos terminales el cuadrante lógico 4x4 del armario de llaves para validar si el precinto quedó realmente cerrado antes del apagón."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Mitad Superior (F1–F2)",
                       "brief":  "Comparte tus dos cifras iniciales con Patri, pide las suyas y deduce tus 3 casillas objetivo en cian.",
                       "clueHtml":  "\u003cp\u003eCada fila, columna y bloque 2x2 contiene los dígitos 1, 2, 3 y 4 sin repetir. Introduce los valores de \u003cstrong\u003e[F1,C3]\u003c/strong\u003e, \u003cstrong\u003e[F2,C1]\u003c/strong\u003e y \u003cstrong\u003e[F2,C3]\u003c/strong\u003e seguidos (3 dígitos).\u003c/p\u003e",
                       "widget":  {
                                      "type":  "sudoku4",
                                      "prefill":  [
                                                      [
                                                          0,
                                                          2,
                                                          0,
                                                          0
                                                      ],
                                                      [
                                                          0,
                                                          0,
                                                          0,
                                                          4
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
                                      "targets":  [
                                                      "0,2",
                                                      "1,0",
                                                      "1,2"
                                                  ]
                                  },
                       "inputLabel":  "Valores seguidos de [F1,C3], [F2,C1] y [F2,C3]",
                       "inputPlaceholder":  "Ej. 123",
                       "acceptedHashes":  [
                                              "dbb1ded63bc70732626c5dfe6c7f50ced3d560e970f30b15335ac290358748f6"
                                          ],
                       "partnerHint":  "Comunica a Patri tus cifras: F1C2=2 y F2C4=4. Pídele sus posiciones en F3 y F4 para desbloquear las columnas."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Mitad Inferior (F3–F4)",
                      "brief":  "Comunica tus dos valores fijos a Miguel, cruzad cada bloque 2x2 y halla tus 3 casillas objetivo.",
                      "clueHtml":  "\u003cp\u003eDeduce el tablero completo con Miguel e introduce seguidos los 3 valores de \u003cstrong\u003e[F3,C3]\u003c/strong\u003e, \u003cstrong\u003e[F4,C1]\u003c/strong\u003e y \u003cstrong\u003e[F4,C4]\u003c/strong\u003e.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "sudoku4",
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
                                                         1,
                                                         0,
                                                         0,
                                                         0
                                                     ],
                                                     [
                                                         0,
                                                         0,
                                                         3,
                                                         0
                                                     ]
                                                 ],
                                     "visibleRows":  [
                                                         2,
                                                         3
                                                     ],
                                     "targets":  [
                                                     "2,2",
                                                     "3,0",
                                                     "3,3"
                                                 ]
                                 },
                      "inputLabel":  "Valores seguidos de [F3,C3], [F4,C1] y [F4,C4]",
                      "inputPlaceholder":  "Ej. 123",
                      "acceptedHashes":  [
                                             "5092c37bcbc9f0fb33cb0f9cab7aa5ae94ed0f1219773c380b143b7c1224d01b"
                                         ],
                      "partnerHint":  "Di a Miguel que tienes F3C1=1 y F4C3=3. Pregúntale por F1C2 y F2C4 para resolver la columna 1 y la fila 4."
                  },
        "hints":  [
                      "Las 4 pistas totales son: F1C2=2, F2C4=4 (Miguel) y F3C1=1, F4C3=3 (Patri). En la caja superior izquierda falta el 4, y no puede ir en F2 ni C2 -\u003e F1C1=4.",
                      "Con F1C1=4 y F3C1=1, en C1 quedan {2,3}. Como F4 tiene 3 en F4C3 -\u003e F4C1=2 y F2C1=3. El tablero queda 4213 / 3124 / 1342 / 2431.",
                      "Solución del Día 4 — Miguel (F1C3,F2C1,F2C3): 132 · Patri (F3C3,F4C1,F4C4): 421."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTUiLCJmb3JlbnNpY1RhZyI6IkNBSsOTTiBERSBMTEFWRVMgUFJFQ0lOVEFETyIsImNvbmNsdXNpb24iOiJNYXJ0YSBRdWlyb2dhIGRlasOzIGVsIGN1YWRyYW50ZSBkZSBsbGF2ZXMgY2VycmFkbyBjb24gbG9zIGPDs2RpZ29zIDEzMi00MjEgZW4gbGF2YW5kZXLDrWEgYSBsYXMgMjM6MjUgaCBhbnRlcyBkZWwgYXBhZ8Ozbi4gTmluZ3VuYSBsbGF2ZSBzYWxpw7MgZGVsIGN1YXJ0by4ifQ=="
    },
    {
        "day":  5,
        "kicker":  "DÍA 05 · TORNIQUETES ALA NORTE",
        "title":  "Lectura RFID de Pasillos",
        "story":  "Tres tarjetas RFID distintas pasaron por el entorno de la Biblioteca de Planta 2 entre las 23:31 y las 23:44 h, pero solo una permaneció encerrada dentro durante el apagón.",
        "dossierContext":  {
                               "focus":  "Entre las personas alojadas en Planta 2 hay una investigadora que había destapado irregularidades urbanísticas del hotel, motivo de un grave enfrentamiento previo con Arturo.",
                               "alibi":  "Sostiene que se retiró sola a la Biblioteca de Planta 2 antes del apagón y que no salió hasta que acudió la dirección tras el suceso.",
                               "goal":  "Aislar qué tarjeta RFID permaneció realmente dentro de la Biblioteca entre las 23:39 y las 23:58 h y confirmar su titular real tras una reasignación nocturna de recepción."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Log Técnico RFID",
                       "brief":  "Filtra los falsos pasos de pasillo y salidas tempranas para aislar qué TAG quedó dentro a las 23:39 h.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eLecturas completas Planta 2:\u003c/strong\u003e\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e23:31:04 · TAG-B2 · Pasillo Sur (hacia Escalera) · 23:36:10 · Ascensor P1.\u003c/li\u003e\u003cli\u003e23:35:10 · TAG-E4 · Entrada Biblioteca · \u003cstrong\u003e23:36:40 · Salida Biblioteca\u003c/strong\u003e.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e23:39:12 · TAG-C7 · Entrada Puerta Biblioteca\u003c/strong\u003e (sin lectura de salida hasta 23:58:04).\u003c/li\u003e\u003cli\u003e23:41:05 · TAG-F9 · Escalera P1/P2.\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Filtro de Permanencia 23:38–23:42 h",
                                      "items":  [
                                                    "Descartar tarjetas que salieron antes del apagón",
                                                    "Comunicar el TAG válido a Patri y pedir apellido titular"
                                                ]
                                  },
                       "inputLabel":  "Primer apellido de la titular que permaneció dentro (dato de Patri)",
                       "inputPlaceholder":  "Ej. navarro",
                       "acceptedHashes":  [
                                              "b74c3a133a11e1a0514c3841cd80b051cb6b18b28e58b2b0c9107cfdae9e9a06"
                                          ],
                       "partnerHint":  "Dile a Patri cuál de los tres TAG permaneció dentro de la Biblioteca entre 23:39 y 23:58 h. Pídele el apellido de su titular."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Libro de Tarjetas",
                      "brief":  "Coteja el TAG activo con la nota de reasignación de las 22:10 h para verificar titular y habitación.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003eIncidencia Recepción 22:10 h:\u003c/strong\u003e Por desmagnetización, se anuló TAG-B2 en la Hab. 204 y se entregó \u003cstrong\u003eTAG-C7\u003c/strong\u003e a su ocupante.\u003c/p\u003e\u003cp\u003eIntroduce el \u003cstrong\u003eTAG válido (2 caracteres) + Nº de habitación (3 dígitos)\u003c/strong\u003e de su titular (ej. A1201).\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Formato Compacto Patri",
                                     "items":  [
                                                   "2 caracteres del TAG activo + 3 dígitos de habitación",
                                                   "Nota: TAG-E4 (Hab. 203) salió antes del apagón"
                                               ]
                                 },
                      "inputLabel":  "TAG (2 caract.) + Habitación (3 dígitos)",
                      "inputPlaceholder":  "Ej. A1201",
                      "acceptedHashes":  [
                                             "ed19e45703a29a51059d74e5ad3c013e284d92631e07541e5ccd3666faa1ad0d"
                                         ],
                      "partnerHint":  "Confirma a Miguel el apellido titular de la tarjeta válida tras la reasignación de las 22:10 h."
                  },
        "hints":  [
                      "TAG-B2 bajó a P1 y TAG-E4 salió de Biblioteca a las 23:36:40. Solo TAG-C7 siguió dentro durante el apagón.",
                      "Patri ve que TAG-C7 pertenece a Lucía Montalvo, Hab. 204.",
                      "Solución del Día 5 — Miguel: montalvo · Patri: C7204."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDUiLCJmb3JlbnNpY1RhZyI6IkFDQ0VTTyBCSUJMSU9URUNBIDIzOjM5IEgiLCJjb25jbHVzaW9uIjoiTHVjw61hIE1vbnRhbHZvIChUQUctQzcsIEhhYi4gMjA0KSBhYnJpw7MgbGEgQmlibGlvdGVjYSBhIGxhcyAyMzozOToxMiBoIGVuIHBsZW5vIGFwYWfDs24geSBlbCBzaXN0ZW1hIHJlZ2lzdHLDsyBzdSB0YXJqZXRhIGRlbnRybyBoYXN0YSBsYXMgMjM6NTggaC4gUXVlZGEgZGVzY2FydGFkYS4ifQ=="
    },
    {
        "day":  6,
        "kicker":  "DÍA 06 · RUEDA CÉSAR Y PARTITURA",
        "title":  "El Criptograma del Ropero",
        "story":  "La nota del vestíbulo artístico contiene tres salas distintas cifradas bajo el mismo desplazamiento César. Necesitaréis calcular la clave real en la partitura y filtrar la acústica correcta.",
        "dossierContext":  {
                               "focus":  "La cantante Claudia Benítez mantuvo una agria discusión contractual con Arturo tras el primer pase de la gala al reclamarle pagos bloqueados. Una nota cifrada apareció en el perchero del vestíbulo artístico.",
                               "alibi":  "Mantiene que permaneció ensayando en voz alta y a puerta cerrada dentro de su camerino antes, durante y después del apagón.",
                               "goal":  "Deduce con la partitura el desplazamiento César exacto, descifra las tres salas candidatas y verifica en cuál coinciden las condiciones acústicas descritas por los técnicos."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Partitura y Camerinos",
                       "brief":  "Calcula el desplazamiento en la partitura y cruza las tres salas de Patri con el parte acústico.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eTestimonio técnico (23:35 h):\u003c/strong\u003e Claudia Benítez ensayaba en una sala cerrada con \u003cstrong\u003edoble cortina de terciopelo y piano vertical\u003c/strong\u003e.\u003c/p\u003e\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eSalón Norte:\u003c/strong\u003e piano de cola abierto al pasillo.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eCamerino Sur:\u003c/strong\u003e doble cortina de terciopelo + piano vertical.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eTeatro Central:\u003c/strong\u003e escenario abierto sin cortinaje privado.\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Formato Validación Patri",
                                      "items":  [
                                                    "Primer apellido de la artista + desplazamiento (2 dígitos)",
                                                    "Ejemplo orientativo: navarro03"
                                                ]
                                  },
                       "inputLabel":  "Apellido de la artista + Desplazamiento (2 dígitos)",
                       "inputPlaceholder":  "Ej. navarro03",
                       "acceptedHashes":  [
                                              "a3c12abbf4fdec4fa2d0cd7185b353eb07a1a37a6fe1dd6a41c292d4d0904b5c"
                                          ],
                       "partnerHint":  "Cuenta en el pentagrama las 4 notas negras + 5 estrellas doradas (desplazamiento = 09), díselo a Patri e identifica su sala acústica."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Decodificador César",
                      "brief":  "Ajusta el desplazamiento calculado por Miguel en la partitura y lee las 3 estancias descifradas.",
                      "clueHtml":  "\u003cp\u003eCriptograma triple: \u003cstrong class=\u0027mono\u0027\u003eBJUXW WXACN · LJVNARWX BDA · CNJCAX LNWCAJU\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eCuando descifres las tres salas con la clave de Miguel, descríbeselas para filtrar cuál tiene la acústica del ensayo.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "caesar",
                                     "cipherText":  "BJUXW WXACN · LJVNARWX BDA · CNJCAX LNWCAJU"
                                 },
                      "inputLabel":  "Sala real donde vocalizó la artista (2 palabras)",
                      "inputPlaceholder":  "Ej. salon norte",
                      "acceptedHashes":  [
                                             "c369395a81aa6bda3700513f6f4cf9b09335d7129344b7467d9b00ac0794d766"
                                         ],
                      "partnerHint":  "Pide a Miguel el desplazamiento César (notas negras + estrellas doradas) y pregúntale cuál de las 3 salas descifradas tiene doble cortina y piano vertical."
                  },
        "hints":  [
                      "En la partitura hay 4 notas negras y 5 estrellas doradas: 4 + 5 = 9.",
                      "Con desplazamiento 9, las salas son SALON NORTE, CAMERINO SUR y TEATRO CENTRAL. El parte acústico señala Camerino Sur (Claudia Benítez).",
                      "Solución del Día 6 — Patri: camerino sur · Miguel: benitez09."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjEiLCJmb3JlbnNpY1RhZyI6IkVOU0FZTyBWT0NBTCBDT05GSVJNQURPIiwiY29uY2x1c2lvbiI6IkVsIHBlcnNvbmFsIHTDqWNuaWNvIGVzY3VjaMOzIGEgQ2xhdWRpYSBCZW7DrXRleiB2b2NhbGl6YXIgc2luIHBhdXNhIGRlbnRybyBkZWwgQ2FtZXJpbm8gU3VyIGFudGVzLCBkdXJhbnRlIHkgZGVzcHXDqXMgZGVsIGFwYWfDs24uIFF1ZWRhIGRlc2NhcnRhZGEuIn0="
    },
    {
        "day":  7,
        "kicker":  "DÍA 07 · TESTIMONIOS Y LOGS",
        "title":  "Seis Coartadas, Cinco Sensores",
        "story":  "Seis declaraciones anonimizadas mencionan relojes, suelo radiante, cables de red y puertas exteriores a las 23:40 h. Solo una sobrevive al examen técnico del hotel.",
        "dossierContext":  {
                               "focus":  "Arturo había bloqueado recientemente la línea de financiación del estudio creativo de su sobrino Diego Aranda exigiéndole devolver un préstamo de inmediato. Varios testimonios nocturnos se contradicen sobre lo ocurrido a las 23:40 h.",
                               "alibi":  "Uno de los seis sujetos interrogados asegura que permaneció en todo momento trabajando en el Estudio de Diseño con carga de maquetas en red.",
                               "goal":  "Refutar los relatos imposibles frente a los sensores físicos del hotel (relojes, calefacción, hielo y puertos LAN) y confirmar si el tráfico del estudio respalda esa coartada."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Atestados Anonimizados",
                       "brief":  "Contrasta cada detalle ambiental de los seis sujetos (ALFA–ZETA) contra las auditorías técnicas de Patri.",
                       "clueHtml":  "\u003cp\u003eLee palabra por palabra las 6 coartadas del expediente superior y descarta una a una las que contengan imposibilidades físicas o de red frente a los registros de Patri.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Formato del Código",
                                      "items":  [
                                                    "Alias sobreviviente en mayúsculas + Nº Ficha (2 dígitos)",
                                                    "Ejemplo: ALFA04"
                                                ]
                                  },
                       "partnerHint":  "Lee a Patri cada declaración completa para que contraste relojes, calefacción, puertas exteriores y puertos LAN."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Auditoría del Servidor y Edificio",
                      "brief":  "Cruza tus cinco informes técnicos con los seis relatos de Miguel hasta aislar al único sujeto veraz.",
                      "clueHtml":  "\u003cp\u003eCuatro sensores desmienten detalles concretos (reloj parado, calefacción apagada, hielo exterior y puerto LAN sin tráfico). Solo el router del \u003cstrong\u003eEstudio de Diseño\u003c/strong\u003e valida a \u003cstrong\u003eDiego Aranda (Ficha 12)\u003c/strong\u003e.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Cotejo Final",
                                     "items":  [
                                                   "Estudio de Diseño · Subida 1.42 GB (23:25–23:52)",
                                                   "Titular confirmado: Diego Aranda · Ficha 12"
                                               ]
                                 },
                      "partnerHint":  "Desmiente a los cinco sujetos incompatibles con tus sensores y combina el alias ganador con el número de ficha 12."
                  },
        "jointInput":  {
                           "label":  "Alias verificado + Nº de ficha (2 dígitos)",
                           "placeholder":  "Ej. ALFA04",
                           "acceptedHashes":  [
                                                  "317c94ae05b22075f8624fc922bed333a3133ab4457fbc3435e9adc9a33a6ed7"
                                              ]
                       },
        "hints":  [
                      "BETA (reloj 20:15), GAMMA (LAN 0 bytes), EPSILON (suelo frío desde 22:40) y ZETA (puerta helada) quedan refutados.",
                      "Solo DELTA coincide con la subida continua de 1.4 GB en el Estudio de Diseño (Ficha 12 de Diego Aranda).",
                      "Solución del Día 7: DELTA12."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTIiLCJmb3JlbnNpY1RhZyI6IkFDVElWSURBRCBERSBSRUQgSU5JTlRFUlJVTVBJREEiLCJjb25jbHVzaW9uIjoiTG9zIHBhcXVldGVzIGRlIDEuNDIgR0Igc3ViaWRvcyBkZXNkZSBlbCBwb3J0w6F0aWwgZGUgRGllZ28gQXJhbmRhIHBydWViYW4gYWN0aXZpZGFkIG1hbnVhbCBjb25zdGFudGUgZW4gZWwgRXN0dWRpbyBkdXJhbnRlIHRvZG8gZWwgYXBhZ8Ozbi4gUXVlZGEgZGVzY2FydGFkby4ifQ=="
    },
    {
        "day":  8,
        "kicker":  "DÍA 08 · TOXICOLOGÍA DE ESPECIAS",
        "title":  "La Balanza del Ponche",
        "story":  "En el spa han aparecido cuatro pesajes de especias navideñas divididos entre vuestras terminales. Ninguna báscula resuelve un ingrediente por sí sola: debéis resolver el sistema de cuatro ecuaciones juntas.",
        "dossierContext":  {
                               "focus":  "La fisioterapeuta Paula Mendoza elaboraba aceites e infusiones herbales personalizadas para los huéspedes VIP del spa. Durante la inspección aparecieron frascos de ámbar sin etiqueta y pesajes fragmentados sobre su mesa de trabajo.",
                               "alibi":  "Asegura que solo preparaba mezclas inocuas de especias navideñas y tisanas relajantes para la noche de Adviento.",
                               "goal":  "Resolver simultáneamente el sistema de cuatro pesajes entre ambos terminales para comprobar el gramaje exacto de la mezcla frente al cuaderno del spa."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Básculas 1 y 2",
                       "brief":  "Comparte tus dos ecuaciones con Patri para poder despejar Anís, Clavo, Nuez y Jengibre.",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eBáscula 1:\u003c/strong\u003e 2 Anís + 1 Clavo = \u003cstrong\u003e18 g\u003c/strong\u003e\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eBáscula 2:\u003c/strong\u003e 1 Clavo + 2 Nuez = \u003cstrong\u003e22 g\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Sistema Parcial Miguel",
                                      "items":  [
                                                    "2A + C = 18",
                                                    "C + 2N = 22"
                                                ]
                                  },
                       "partnerHint":  "Dicta ambas ecuaciones a Patri y anotad sus dos ecuaciones (Nuez, Jengibre, Anís y Clavo) para despejar juntas cada peso."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Básculas 3–4 y Receta",
                      "brief":  "Combinad las cuatro ecuaciones de las básculas y calculad el peso neto de la fórmula de control de Paula Mendoza.",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003eBáscula 3:\u003c/strong\u003e 1 Nuez + 1 Jengibre = \u003cstrong\u003e15 g\u003c/strong\u003e\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eBáscula 4:\u003c/strong\u003e 1 Anís + 1 Jengibre + 1 Clavo = \u003cstrong\u003e17 g\u003c/strong\u003e\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eFórmula de control:\u003c/strong\u003e 3 Anís + 2 Nuez + 4 Clavo + 1 Jengibre = \u003cstrong\u003e? g\u003c/strong\u003e\u003c/li\u003e\u003c/ul\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Ecuaciones Patri",
                                     "items":  [
                                                   "N + J = 15  |  A + J + C = 17",
                                                   "Objetivo: 3A + 2N + 4C + J (solo número)"
                                               ]
                                 },
                      "partnerHint":  "De 2A+C=18 y C+2N=22 sale N = A+2; al sustituir N y J en vuestra última ecuación podréis hallar A exactamente."
                  },
        "jointInput":  {
                           "label":  "Peso total de la mezcla en gramos (solo número)",
                           "placeholder":  "Ej. 45",
                           "acceptedHashes":  [
                                                  "d029fa3a95e174a19934857f535eb9427d967218a36ea014b70ad704bc6c8d1c",
                                                  "8676381056b35e2f4a70541633a5952f0a4395b9ff5ea1e5b122a252c54dabd1"
                                              ]
                       },
        "hints":  [
                      "Expresando todo en función de Anís (A): C = 18 - 2A, N = 2 + A y J = 13 - A.",
                      "En Báscula 4: A + (13 - A) + (18 - 2A) = 17 -\u003e 31 - 2A = 17 -\u003e A = 7 g, C = 4 g, N = 9 g, J = 6 g.",
                      "3(7) + 2(9) + 4(4) + 6 = 21 + 18 + 16 + 6 = 61."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOm51bGwsImZvcmVuc2ljVGFnIjoiTVVFU1RSQSBSRVRFTklEQSDCtyBTSU4gREVTQ0FSVEUiLCJjb25jbHVzaW9uIjoiRWwgcGVzYWplIGRlIDYxIGcgY3VhZHJhIGNvbiBlbCBjdWFkZXJubyBkZSBtZXpjbGFzIGRlbCBzcGEsIHBlcm8gc2UgaW5jYXV0YW4gZG9zIGZyYXNjb3Mgw6FtYmFyIHNpbiBldGlxdWV0YSBwYXJhIGFuw6FsaXNpcyB0b3hpY29sw7NnaWNvIGRlIE5vY2hlYnVlbmEuIFBhdWxhIE1lbmRvemEgc2lndWUgYmFqbyBzb3NwZWNoYSBoYXN0YSBlbCBjYXJlbyBmaW5hbC4ifQ=="
    },
    {
        "day":  9,
        "kicker":  "DÍA 09 · CÁMARAS EXTERIORES Y TERMOGRAFÍA",
        "title":  "Fotogramas del Mirador",
        "story":  "La cámara térmica exterior registró el ángulo norte del teleférico a las 23:41 h, mientras la cámara infrarroja interior captaba el calor residual del teclado de la Cabaña Norte.",
        "dossierContext":  {
                               "focus":  "El guía alpino Mateo Soler protagonizó esa tarde una violenta discusión con Arturo al negarse a poner en marcha el teleférico en plena ciclogénesis. Una figura con ropa técnica fue detectada en el exterior.",
                               "alibi":  "Sostiene que a las 23:41 h se encontraba en el exterior quitando hielo de la polea norte y entrando acto seguido en su cabaña.",
                               "goal":  "Cruzar los sensores meteorológicos del poste Norte con la termografía residual infrarroja del teclado de la Cabaña Norte para probar su presencia física allí a las 23:41 h."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Cámara Norte y Postes",
                       "brief":  "Inspecciona el poste orientado al Norte (005°) en tu telemetría para extraer temperatura e iniciales.",
                       "clueHtml":  "\u003cp\u003eSolo el \u003cstrong\u003ePoste 04 (Polea Teleférico, Azimut 005° Norte)\u003c/strong\u003e coincide con la cámara del visor.\u003c/p\u003e\u003cp\u003eExtrae sus \u003cstrong\u003e2 dígitos de temperatura (sin signo negativo) + sus 2 iniciales\u003c/strong\u003e para Patri, y pídele el PIN reconstruido por infrarrojos.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "scene-zoom",
                                      "imgSrc":  "imagenes/scene-balcony.jpg",
                                      "caption":  "Cámara Exterior · Polea Norte · 23:41:18 h"
                                  },
                       "inputLabel":  "PIN de 4 dígitos reconstruido por Patri (termografía IR)",
                       "inputPlaceholder":  "Ej. 1234",
                       "acceptedHashes":  [
                                              "a5ca6c0335a3860b31a64f43bf3021207ac91133c82bbc1736ab4f4e2922afed"
                                          ],
                       "partnerHint":  "Pasa a Patri los dígitos de temperatura del Poste 04 Norte + las 2 iniciales bordadas (ej. 05AB). Pregúntale el PIN deducido de la termografía."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Termografía IR Cabaña",
                      "brief":  "Ordena los 4 botones iluminados del más frío (pulsado primero) al más cálido (pulsado último).",
                      "clueHtml":  "\u003cp\u003eLa cámara infrarroja del teclado muestra cuatro teclas con calor residual. La primera pulsada es la que lleva más segundos enfriándose (menor temperatura); la última, la más caliente.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Regla IR + Formato Patri",
                                     "items":  [
                                                   "Orden PIN: de menor temperatura a mayor temperatura",
                                                   "Introduce: Temperatura Poste Norte (2 díg.) + Iniciales"
                                               ]
                                 },
                      "inputLabel":  "Temperatura (2 dígitos) + Iniciales (dato de Miguel)",
                      "inputPlaceholder":  "Ej. 05AB",
                      "acceptedHashes":  [
                                             "7618ec4d445de1aae0c2b8902e0896f8641603027d1c25b732044fc2f7962f75"
                                         ],
                      "partnerHint":  "Comunica a Miguel el PIN ordenado de menor a mayor temperatura y pídele la temperatura del Poste 04 Norte + sus iniciales."
                  },
        "hints":  [
                      "Miguel lee en el Poste 04 Norte -14 °C e iniciales M.S. (14MS). Patri ordena las teclas IR: 22.1°C(7) -\u003e 24.8°C(2) -\u003e 27.3°C(9) -\u003e 30.5°C(4).",
                      "El PIN térmico es 7294 y el código exterior es 14MS.",
                      "Solución del Día 9 — Miguel: 7294 · Patri: 14MS."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDQiLCJmb3JlbnNpY1RhZyI6IlRFTEVGw4lSSUNPIFkgQ0FCQcORQSBOT1JURSBWRVJJRklDQURPUyIsImNvbmNsdXNpb24iOiJNYXRlbyBTb2xlciBxdWVkw7MgZ3JhYmFkbyBsdWNoYW5kbyBjb250cmEgZWwgaGllbG8gZW4gZWwgZXh0ZXJpb3IgYSAtMTQgwrBDIHkgdGVjbGVhbmRvIDcyOTQgZW4gc3UgY2FiYcOxYSBhIGxhcyAyMzo0MSBoLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9"
    },
    {
        "day":  10,
        "kicker":  "DÍA 10 · SALA DE MÁQUINAS",
        "title":  "Válvulas de la Caldera",
        "story":  "Cuatro manómetros marcan lecturas distintas en el sótano. Debéis aislar el circuito en alerta crítica, consultar sus reglas booleanas de seguridad y aplicar el ajuste final del manómetro.",
        "dossierContext":  {
                               "focus":  "El técnico Julián Prieto había sido amonestado por Arturo a raíz de fallos repetidos en la calefacción del ala oeste. Su conocimiento de cuadros, válvulas e instalaciones lo sitúa en el foco técnico del sabotaje.",
                               "alibi":  "Afirma que entre las 23:36 y las 23:45 h estaba atrapado en el sótano purgando manualmente un circuito hidráulico en alerta crítica.",
                               "goal":  "Detectar el circuito averiado por presión y temperatura, deducir sus reglas booleanas de purga y contrastar la serie resultante del manómetro."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Manual Booleano de Calderas",
                       "brief":  "Consulta el circuito en fallo que identifique Patri y deduce con ella qué válvulas quedan abiertas.",
                       "clueHtml":  "\u003cp\u003eIntroduce aquí el código del único circuito que supere \u003cstrong\u003e3.2 bar\u003c/strong\u003e y esté por debajo de \u003cstrong\u003e45 °C\u003c/strong\u003e en los manómetros de Patri (ej. C4):\u003c/p\u003e",
                       "widget":  {
                                      "type":  "manual-lookup",
                                      "placeholder":  "Ej. C4",
                                      "triggerCode":  "C9",
                                      "responseHtml":  "\u003cstrong\u003eReglas Circuito C-9:\u003c/strong\u003e (1) V1 y V4 tienen estados opuestos. (2) Exactamente 2 válvulas abiertas en total. (3) V4 (par mayor) debe quedar ABIERTA. (4) V2 queda CERRADA si V1 está cerrada."
                                  },
                       "partnerHint":  "Pide a Patri qué circuito cumple (\u003e 3.2 bar y \u003c 45 °C). Consúltalo y díctale las cuatro reglas lógicas para deducir qué válvulas abrir."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Manómetros y Válvulas",
                      "brief":  "Identifica el circuito en alerta, ajusta V1–V4 según el manual lógico e invierte los pares del resultado.",
                      "clueHtml":  "\u003cp\u003eSolo uno de los cuatro circuitos cumple simultáneamente \u003cstrong\u003ePresión \u0026gt; 3.2 bar\u003c/strong\u003e y \u003cstrong\u003eTemperatura \u0026lt; 45 °C\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eAl accionar correctamente V1–V4 obtendrás una serie de 4 cifras \u003cstrong\u003e[AB][CD]\u003c/strong\u003e; invierte ambos pares (\u003cstrong\u003e[CD][AB]\u003c/strong\u003e) para validar.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "valves",
                                     "targetState":  [
                                                         false,
                                                         false,
                                                         true,
                                                         true
                                                     ],
                                     "revealCode":  "6194"
                                 },
                      "partnerHint":  "Indica a Miguel el código del circuito crítico (C9). Deduce con él las 4 válvulas e invierte los dos pares de dígitos finales."
                  },
        "jointInput":  {
                           "label":  "Código oficial ajustado [CD][AB] (4 dígitos)",
                           "placeholder":  "Ej. 1020",
                           "acceptedHashes":  [
                                                  "5a75498e4071bada9f427c43a61fd447e0788e8b375a987e836d0a21fcbc9940"
                                              ]
                       },
        "hints":  [
                      "Solo C-9 (4.1 bar y 36 °C) cumple la condición crítica. En el manual de C-9: V4=ABIERTA -\u003e por regla (1) V1=CERRADA.",
                      "Con V1=CERRADA, la regla (4) fuerza V2=CERRADA. Como debe haber 2 abiertas (regla 2), V3=ABIERTA. El manómetro revela 6194.",
                      "Invirtiendo los pares [61][94] queda 9461."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTAiLCJmb3JlbnNpY1RhZyI6IlBVUkdBIERFIENBTERFUkFTIEMtOSBDRVJUSUZJQ0FEQSIsImNvbmNsdXNpb24iOiJFbCByZWdpc3RybyBhdXRvbcOhdGljbyA5NDYxIGRlbCBjaXJjdWl0byBDLTkgY29uZmlybWEgcXVlIEp1bGnDoW4gUHJpZXRvIGVzdHV2byBtYW5pb2JyYW5kbyBsYXMgdsOhbHZ1bGFzIGRlbCBzw7N0YW5vIGVudHJlIGxhcyAyMzozNiB5IGxhcyAyMzo0NSBoLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9"
    },
    {
        "day":  11,
        "kicker":  "DÍA 11 · CONSUMO EN BARRA",
        "title":  "El Ticket Térmico Roto",
        "story":  "Cuatro cintas de datáfono y cuatro comandas de barra se mezclaron en distinto orden al romperse el rollo térmico. Usad la carta de precios para emparejar la consumición de Marcos Tejada.",
        "dossierContext":  {
                               "focus":  "El escolta privado Marcos Tejada sabía que Arturo planeaba despedirlo esa misma semana por pérdida de confianza; además conocía los puntos ciegos de vigilancia y rutinas de la víctima.",
                               "alibi":  "Declara que no se apartó del vestíbulo principal porque pagó un café en recepción justo en el minuto en que se fue la luz.",
                               "goal":  "Emparejar las cintas TPV desordenadas con las comandas y precios de barra para confirmar a qué hora exacta se autorizó el pago de su mesa."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Cinta TPV (Horas e Importes)",
                       "brief":  "Comunica las 4 autorizaciones y sus importes para que Patri calcule qué comanda suma cada cifra.",
                       "clueHtml":  "\u003cp\u003eTus autorizaciones están ordenadas por número de operación (AUT-41 a AUT-44), pero no coinciden en orden con las mesas de Patri.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Formato del Código Conjunto",
                                      "items":  [
                                                    "Nº AUT (2 dígitos) + Nº Mesa (2 dígitos) + Hora (4 dígitos)",
                                                    "Ejemplo: 41032315"
                                                ]
                                  },
                       "partnerHint":  "Lee a Patri cada AUT con su hora e importe exacto hasta emparejar la consumición de Marcos Tejada."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Carta de Barra y Comandas",
                      "brief":  "Calcula el total de cada mesa con la lista de precios de la carta para identificar el Nº AUT y hora de Marcos.",
                      "clueHtml":  "\u003cp\u003eSuma los artículos pedidos en cada mesa según la carta superior hasta encontrar qué autorización TPV de Miguel pagó exactamente \u003cstrong\u003eMarcos Tejada\u003c/strong\u003e.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Emparejamiento TPV",
                                     "items":  [
                                                   "Busca el coste exacto de Café Solo + Agua Mineral",
                                                   "Combina: [2 díg. AUT] + [2 díg. Mesa] + [4 díg. Hora]"
                                               ]
                                 },
                      "partnerHint":  "Calcula cuánto suma la consumición de la Mesa 08 y pide a Miguel el Nº AUT y la hora de ese importe."
                  },
        "jointInput":  {
                           "label":  "Nº AUT (2) + Mesa (2) + Hora TPV (4)",
                           "placeholder":  "Ej. 41032315",
                           "acceptedHashes":  [
                                                  "0fc6f09f5b2db212246dc6ab217c001ff0834bf6f4386b9f89821a47f3307cee"
                                              ]
                       },
        "hints":  [
                      "Marcos Tejada (Mesa 08) pidió 1 Café Solo (3,80 EUR) + 1 Agua Mineral (2,40 EUR) = 6,20 EUR.",
                      "En la cinta de Miguel, 6,20 EUR corresponde a AUT-42 cobrado a las 23:38 h.",
                      "Solución del Día 11: 42082338."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjQiLCJmb3JlbnNpY1RhZyI6IkNPQlJPIFRQViAyMzozOCBIIFZFUklGSUNBRE8iLCJjb25jbHVzaW9uIjoiTGEgYXV0b3JpemFjacOzbiBBVVQtNDIgZW4gcmVjZXBjacOzbiBjb2Jyw7MgZWwgY2Fmw6kgeSBhZ3VhIGRlIE1hcmNvcyBUZWphZGEgKE1lc2EgMDgpIGEgbGFzIDIzOjM4OjA0IGggZW4gcHJlc2VuY2lhIGRlbCByZWNlcGNpb25pc3RhLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9"
    },
    {
        "day":  12,
        "kicker":  "DÍA 12 · REJILLA CARDANO 5x5",
        "title":  "Nonograma del Archivo",
        "story":  "El catálogo donde Elena Valls selló su inventario usa una máscara asimétrica 5x5. Solo resolviendo la cuadrícula exacta y superponiéndola sobre la matriz de letras aparecerá la estantería.",
        "dossierContext":  {
                               "focus":  "La tasadora Elena Valls había descubierto que uno de los cuadros del Salón Mirador era una falsificación encubierta, poniendo en jaque la póliza y reputación de Arturo Valdivieso.",
                               "alibi":  "Sostiene que se encontraba lejos de la planta baja, inventariando y fotografiando manuscritos antiguos en el Archivo Histórico.",
                               "goal":  "Resolver la máscara única del nonograma 5x5 y superponerla sobre la matriz del Archivo Histórico para localizar la estantería exacta revisada bajo cámara."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Pistas de Filas",
                       "brief":  "Dicta las pistas horizontales de filas a Patri y rellenad juntos los 9 cuadros de la solución única.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003ePistas de Filas:\u003c/strong\u003e F1: \u003cstrong\u003e1, 1, 1\u003c/strong\u003e · F2: \u003cstrong\u003e1\u003c/strong\u003e · F3: \u003cstrong\u003e2\u003c/strong\u003e · F4: \u003cstrong\u003e1\u003c/strong\u003e · F5: \u003cstrong\u003e1, 1\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eAl completar las 9 casillas rellenas, úsalas como plantilla perforada sobre la rejilla 5x5 de Patri.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "nonogram",
                                      "side":  "rows",
                                      "clues":  {
                                                    "rows":  [
                                                                 [
                                                                     1,
                                                                     1,
                                                                     1
                                                                 ],
                                                                 [
                                                                     1
                                                                 ],
                                                                 [
                                                                     2
                                                                 ],
                                                                 [
                                                                     1
                                                                 ],
                                                                 [
                                                                     1,
                                                                     1
                                                                 ]
                                                             ],
                                                    "cols":  [
                                                                 [
                                                                     "?"
                                                                 ],
                                                                 [
                                                                     "?"
                                                                 ],
                                                                 [
                                                                     "?"
                                                                 ],
                                                                 [
                                                                     "?"
                                                                 ],
                                                                 [
                                                                     "?"
                                                                 ]
                                                             ]
                                                }
                                  },
                       "partnerHint":  "Comparte tus pistas de filas con Patri para deducir sin ambigüedad dónde van exactamente las 9 casillas rellenas."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Columnas y Rejilla 5x5",
                      "brief":  "Aporta las pistas de columnas y lee solo los 9 caracteres expuestos por el nonograma en orden de lectura.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003ePistas de Columnas:\u003c/strong\u003e C1: \u003cstrong\u003e1\u003c/strong\u003e · C2: \u003cstrong\u003e3\u003c/strong\u003e · C3: \u003cstrong\u003e1, 1\u003c/strong\u003e · C4: \u003cstrong\u003e1\u003c/strong\u003e · C5: \u003cstrong\u003e2\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003eUna vez resueltas las 9 casillas negras, lee únicamente esas 9 posiciones sobre tu rejilla superior (izquierda a derecha, arriba a abajo).\u003c/p\u003e",
                      "widget":  {
                                     "type":  "nonogram",
                                     "side":  "cols",
                                     "clues":  {
                                                   "rows":  [
                                                                [
                                                                    "?"
                                                                ],
                                                                [
                                                                    "?"
                                                                ],
                                                                [
                                                                    "?"
                                                                ],
                                                                [
                                                                    "?"
                                                                ],
                                                                [
                                                                    "?"
                                                                ]
                                                            ],
                                                   "cols":  [
                                                                [
                                                                    1
                                                                ],
                                                                [
                                                                    3
                                                                ],
                                                                [
                                                                    1,
                                                                    1
                                                                ],
                                                                [
                                                                    1
                                                                ],
                                                                [
                                                                    2
                                                                ]
                                                            ]
                                               }
                                 },
                      "partnerHint":  "Dicta tus pistas de columnas a Miguel. Fila 1 (1,1,1) fija de golpe los cuadros en C1, C3 y C5; a partir de ahí salen C2 y C4."
                  },
        "jointInput":  {
                           "label":  "Código de 9 caracteres revelado por la rejilla",
                           "placeholder":  "Ej. BIB05XYZ1",
                           "acceptedHashes":  [
                                                  "2fc480cc59e36a0a0ff9d9d8b4386a6313b5a8e0a807edf4084a30e02b4fba46"
                                              ]
                       },
        "hints":  [
                      "F1 (1,1,1) solo cabe dejando huecos en C2 y C4 -\u003e F1 queda llena en C1, C3 y C5. Como C1=1 y C4=1 y C5=2, se deduce F2C5=1 y el bloque de 3 en C2 (F3..F5).",
                      "Patrón único (# relleno): Fila 1: #.#.# | Fila 2: ....# | Fila 3: .##.. | Fila 4: .#... | Fila 5: .#.#.",
                      "Sobre la rejilla de Patri los 9 cuadros descubren ARC19VAL7."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTkiLCJmb3JlbnNpY1RhZyI6IlRBU0FDScOTTiBFTiBBUkNISVZPIENPTkZJUk1BREEiLCJjb25jbHVzaW9uIjoiTGEgY8OhbWFyYSBkZWwgQXJjaGl2byBIaXN0w7NyaWNvIChlc3RhbnRlcsOtYSBBUkMxOVZBTDcpIG11ZXN0cmEgYSBFbGVuYSBWYWxscyBmb3RvZ3JhZmlhbmRvIG1hbnVzY3JpdG9zIGhhc3RhIGxhcyAyMzo0OSBoLCBsZWpvcyBkZWwgU2Fsw7NuIE1pcmFkb3IuIFF1ZWRhIGRlc2NhcnRhZGEuIn0="
    },
    {
        "day":  13,
        "kicker":  "DÍA 13 · MENSAJERÍA Y HUSO HORARIO",
        "title":  "Chats Fragmentados",
        "story":  "La tableta del helicóptero registra en horario UTC (Z), mientras el radar militar trabaja en hora local CET (UTC + 1 h). Además hay dos balizas trampa en la frecuencia.",
        "dossierContext":  {
                               "focus":  "El piloto Gabriel Serrano culpaba a Arturo de haberle presionado días atrás para volar en condiciones meteorológicas extremas que pusieron en riesgo su vida y licencia.",
                               "alibi":  "Mantiene que permaneció confinado en el hangar exterior asegurando el rotor del helicóptero y emitiendo manualmente su baliza de posición.",
                               "goal":  "Alinear las marcas UTC de la tableta del piloto con la hora local CET del radar militar, descartar los ecos falsos de tormenta y validar qué baliza estuvo activa a las 23:37 h."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Tableta Hangar (Hora UTC)",
                       "brief":  "Transmite a Patri qué baliza permaneció activa y convierte la confirmación radar de UTC a hora local CET.",
                       "clueHtml":  "\u003cp\u003eEn el Msg 3 y 5 Gabriel descarta la señal apagada a las 22:15 Z y el eco falso de -78 dBm, dejando solo la portadora de \u003cstrong\u003e-42 dBm\u003c/strong\u003e.\u003c/p\u003e\u003cp\u003ePide a Patri la hora UTC confirmada en radar y el nº de Hangar, y recuerda sumar \u003cstrong\u003e+1 hora\u003c/strong\u003e para pasar de UTC a hora local CET.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Conversión Horaria y Formato",
                                      "items":  [
                                                    "CET = UTC + 1 hora",
                                                    "Introduce: Hora local CET (4 díg.) + Puerta Hangar (ej. 2215H1)"
                                                ]
                                  },
                       "inputLabel":  "Hora CET confirmada (4 díg.) + Puerta Hangar (dato de Patri)",
                       "inputPlaceholder":  "Ej. 2215H1",
                       "acceptedHashes":  [
                                              "1a5d4b3e0d9be25dd54ae12b193879a099924e8648ad88b8d51c3804fcd8f80e"
                                          ],
                       "partnerHint":  "Dile a Patri qué baliza (-42 dBm, encendida tras las 22:15 Z) es la válida. Pídele su hora UTC de confirmación radar y puerta de hangar."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Torre Radar (3 Balizas)",
                      "brief":  "Filtra tus tres señales de radar usando las indicaciones de potencia y horario de Miguel.",
                      "clueHtml":  "\u003cp\u003eLa torre captó tres balizas en 121.5 MHz. Contrasta con Miguel cuál coincide con la portadora limpia que él describe y comunica a Miguel la hora Z + Puerta del Hangar.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Cotejo Militar",
                                     "items":  [
                                                   "Rechaza eco de ladera y baliza apagada",
                                                   "Introduce el código alfanumérico de la baliza válida sin guion"
                                               ]
                                 },
                      "inputLabel":  "Código de baliza válida sin guion (cruzado con Miguel)",
                      "inputPlaceholder":  "Ej. HEL418",
                      "acceptedHashes":  [
                                             "ca97498a163f150d757b01e8ac59966f373377fc18186e23c1a380baa8e2a198"
                                         ],
                      "partnerHint":  "Comunica a Miguel la confirmación 22:37 Z y la Puerta Hangar H4; pídele qué criterio de potencia o apagado descarta las otras dos."
                  },
        "hints":  [
                      "Miguel descarta -78 dBm (HEL-418) y la de las 22:15 Z (HEL-735), quedando HEL-902 (-42 dBm).",
                      "Patri ve HEL-902 confirmada a las 22:37 Z en Hangar H4. Sumar +1 h a 22:37 Z da 23:37 CET.",
                      "Solución del Día 13 — Miguel: 2337H4 · Patri: HEL902."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTgiLCJmb3JlbnNpY1RhZyI6IkJBTElaQSBERSBIQU5HQVIgQUNUSVZBIDIzOjM3IENFVCIsImNvbmNsdXNpb24iOiJMYSBiYWxpemEgSEVMLTkwMiBkZWwgSGFuZ2FyIEg0IHBlcm1hbmVjacOzIGVtaXRpZW5kbyBtYW51YWxtZW50ZSBiYWpvIHN1cGVydmlzacOzbiBkZSBHYWJyaWVsIFNlcnJhbm8gYSBsYXMgMjM6MzcgQ0VUICgyMjozNyBaKSBhIDQwMCBtZXRyb3MgZGVsIGhvdGVsLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9"
    },
    {
        "day":  14,
        "kicker":  "DÍA 14 · FÍSICA DE SEÑAL RSSI",
        "title":  "Triangulación Wi-Fi",
        "story":  "Dos puntos de acceso cubren el pasillo lineal de 12 habitaciones de la Planta 2. Calculad la distancia en saltos de puerta según los dBm y extraed el rastro hardware del auditor.",
        "dossierContext":  {
                               "focus":  "El auditor fiscal Raúl Cuesta había detectado una caja B oculta en la sociedad del hotel, descubrimiento que amenazaba con una denuncia penal contra Arturo tras el fin de semana.",
                               "alibi":  "Asegura que a las 23:40 h seguía encerrado en su habitación descargando balances fiscales desde su portátil corporativo.",
                               "goal":  "Calcular distancias en habitaciones a partir de los decibelios dBm de dos antenas Wi-Fi opuestas y verificar la dirección MAC del equipo que transfería datos a esa hora."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · AP-Norte y Tráfico Red",
                       "brief":  "Aplica la tabla dBm-a-puertas desde Hab. 203 e identifica qué hostname sube 2.8 MB/s.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003eRegla de atenuación:\u003c/strong\u003e -40 a -49 dBm = 1 puerta de distancia; -50 a -59 dBm = 2 puertas; -60 a -69 dBm = 3 puertas.\u003c/p\u003e\u003cp\u003eAP-Norte (\u003cstrong\u003e203\u003c/strong\u003e) mide \u003cstrong\u003e-54 dBm\u003c/strong\u003e hacia el equipo que transfiere \u003cstrong\u003e2.8 MB/s\u003c/strong\u003e (hostname en plano superior).\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Formato del Código Conjunto",
                                      "items":  [
                                                    "Habitación intersección (3 díg.) + Últimos 4 hex de MAC sin \u0027:\u0027",
                                                    "Ejemplo orientativo: 201A483"
                                                ]
                                  },
                       "partnerHint":  "Dile a Patri tus dos habitaciones posibles a 2 puertas de la 203 y pregúntale qué MAC corresponde al hostname RC-AUDIT-09."
                   },
        "patri":  {
                      "roleBadge":  "Patri · AP-Sur y Tabla DHCP",
                      "brief":  "Calcula qué habitaciones están a distancia de -63 dBm desde la 208 e intersecta con Miguel.",
                      "clueHtml":  "\u003cp\u003eAP-Sur (\u003cstrong\u003e208\u003c/strong\u003e) registra \u003cstrong\u003e-63 dBm\u003c/strong\u003e (consulta la regla dBm en Miguel para contar cuántas puertas se aleja a izquierda y derecha hasta Hab. 212).\u003c/p\u003e\u003cp\u003eCruza el hostname activo de Miguel con la tabla DHCP para tomar los \u003cstrong\u003eúltimos 4 caracteres hexadecimales\u003c/strong\u003e de su MAC sin dos puntos.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Datos DHCP Patri",
                                     "items":  [
                                                   "Rango AP-Sur (208, -63 dBm) intersectado con AP-Norte",
                                                   "Últimos 4 hex MAC de RC-AUDIT-09 (sin \u0027:\u0027)"
                                               ]
                                 },
                      "partnerHint":  "Con -63 dBm (3 puertas desde 208) salen {205, 211}. Cruzadlo con las candidatas de Miguel y extraed los últimos 4 hex de la MAC corporativa."
                  },
        "jointInput":  {
                           "label":  "Habitación (3 díg.) + 4 hex finales de MAC",
                           "placeholder":  "Ej. 201A483",
                           "acceptedHashes":  [
                                                  "43e05b7b1abad63db128cd777dfefd6e7c293f9d95cb9945122538b846064e6a"
                                              ]
                       },
        "hints":  [
                      "AP-Norte en 203 (-54 dBm = 2 puertas) -\u003e {201, 205}. AP-Sur en 208 (-63 dBm = 3 puertas) -\u003e {205, 211}. La intersección es 205.",
                      "El tráfico de 2.8 MB/s corresponde a RC-AUDIT-09, cuya MAC 3C:52:82:9F:0B acaba en 9F0B.",
                      "Solución del Día 14: 2059F0B."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjIiLCJmb3JlbnNpY1RhZyI6IlNFU0nDk04gSU5JTlRFUlJVTVBJREEgRU4gSEFCLiAyMDUiLCJjb25jbHVzaW9uIjoiTGEgdHJpYW5ndWxhY2nDs24gZEJtIHNpdMO6YSBlbCBwb3J0w6F0aWwgUkMtQVVESVQtMDkgKE1BQyAuLi45RjBCKSBkZSBSYcO6bCBDdWVzdGEgZGVudHJvIGRlIGxhIEhhYml0YWNpw7NuIDIwNSBhIGxhcyAyMzo0MCBoIGRlc2NhcmdhbmRvIGJhbGFuY2VzIGZpc2NhbGVzLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9"
    },
    {
        "day":  15,
        "kicker":  "DÍA 15 · LÓGICA MASTERMIND 5 DÍGITOS",
        "title":  "La Caja Fuerte de Recepción",
        "story":  "El conserje intentó abrir dos veces la caja fuerte dejando el registro de aciertos posicionales. Combinad placa fundacional, chimeneas, ambos fallos y suma de control.",
        "dossierContext":  {
                               "focus":  "El constructor Ricardo Peña mantenía un litigio por una factura impagada de 240.000 euros retenida personalmente por Arturo por la reforma del complejo.",
                               "alibi":  "Sostiene que a las 23:40 h se hallaba junto al mostrador de recepción sellando un pagaré de urgencia que quedó depositado en la caja auxiliar.",
                               "goal":  "Combinar las pistas arquitectónicas del hotel con los dos intentos fallidos registrados en el teclado para abrir la caja fuerte y certificar si el pagaré existe dentro."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Placa e Intento #1",
                       "brief":  "Aporta D1, las pistas del fallo #1 y la desigualdad entre D2 y D4.",
                       "clueHtml":  "\u003cp\u003eLa combinación tiene \u003cstrong\u003e5 cifras distintas [D1 D2 D3 D4 D5]\u003c/strong\u003e. Comparte con Patri la prueba \u003ccode\u003e[7 2 5 8 4] -\u003e 1 exacto, 2 en otra pos.\u003c/code\u003e y la suma \u003ccode\u003eD2 + D4 = 5 (con D2 \u0026gt; D4)\u003c/code\u003e.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "keypad",
                                      "heading":  "ESQUEMA CAJA 5 DÍGITOS: D2+D4=5 (D2\u003eD4)",
                                      "slots":  [
                                                    {
                                                        "val":  "7",
                                                        "lbl":  "D1 (1987)"
                                                    },
                                                    {
                                                        "val":  "?",
                                                        "lbl":  "D2"
                                                    },
                                                    {
                                                        "val":  "?",
                                                        "lbl":  "D3"
                                                    },
                                                    {
                                                        "val":  "?",
                                                        "lbl":  "D4 (Patri)"
                                                    },
                                                    {
                                                        "val":  "?",
                                                        "lbl":  "D5"
                                                    }
                                                ]
                                  },
                       "partnerHint":  "Dile a Patri D1=7, el resultado de [7 2 5 8 4] y la condición D2 + D4 = 5 con D2 \u003e D4."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Chimeneas e Intento #2",
                      "brief":  "Aporta D4 (chimeneas), el fallo #2 y la suma total 26 sin dígitos repetidos.",
                      "clueHtml":  "\u003cp\u003eCon D4 (2 chimeneas) y D2+D4=5 deduciréis D2 y qué cifra desplazada de ambos intentos forzará D3. La suma total \u003cstrong\u003eD1+D2+D3+D4+D5 = 26\u003c/strong\u003e cerrará D5 sin repeticiones.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Condiciones Finales",
                                     "items":  [
                                                   "D4 = 2 chimeneas | [1 3 9 2 8] -\u003e 2 exactos, 1 desplazado",
                                                   "5 dígitos distintos con suma total = 26"
                                               ]
                                 },
                      "partnerHint":  "Comparte tus dos chimeneas (D4=2), el intento fallido #2 y la suma total = 26 con Miguel."
                  },
        "jointInput":  {
                           "label":  "Combinación de 5 dígitos de la caja fuerte",
                           "placeholder":  "Ej. 12345",
                           "acceptedHashes":  [
                                                  "74a562801c96b08f86f55a44a4235cf47bafc1e282114e2406dcbd4bd104f841"
                                              ]
                       },
        "hints":  [
                      "D1 = 7 y D4 = 2. Como D2 + D4 = 5, D2 = 3. Con 7-3-?-2-?, en [1 3 9 2 8] los 2 exactos ya son el 3 y el 2; por tanto, el 8 es correcto pero no está en D5.",
                      "Como D1, D2 y D4 están ocupados y el 8 no va en D5 (ni en D4 según el intento #1), el 8 solo puede ir en D3 -\u003e 7-3-8-2-?.",
                      "Suma = 26 -\u003e 7+3+8+2+D5 = 26 -\u003e D5 = 6. Solución del Día 15: 73826."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDYiLCJmb3JlbnNpY1RhZyI6IlBBR0FSw4kgU0VMTEFETyBBIExBUyAyMzo0MCBIIiwiY29uY2x1c2lvbiI6IkRlbnRybyBkZSBsYSBjYWphIGZ1ZXJ0ZSBhYmllcnRhIGNvbiA3MzgyNiBhcGFyZWNlIGVsIHBhZ2Fyw6kgc2VsbGFkbyBwb3IgUmljYXJkbyBQZcOxYSBhIGxhcyAyMzo0MCBoIGp1bnRvIGFsIG1vc3RyYWRvciBkZSByZWNlcGNpw7NuLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9"
    },
    {
        "day":  16,
        "kicker":  "DÍA 16 · BARRIDO ESPECTRAL",
        "title":  "Frecuencia en el Buzón",
        "story":  "Hay tres portadoras activas ocultas entre 200 y 740 Hz bajo la tormenta: una llamada de prueba descartable y dos canales satelitales del tramo real.",
        "dossierContext":  {
                               "focus":  "Sofía Navarro, prometida de Arturo, acababa de enterarse esa tarde de que había sido eliminada por completo del nuevo testamento antes de la boda.",
                               "alibi":  "Declara haber subido a la Suite 305 antes del brindis final para mantener una larga llamada satelital con su madre sin bajar al salón.",
                               "goal":  "Realizar un barrido de frecuencias con el S-Meter entre estática de tormenta, descartar comunicaciones previas y validar las dos portadoras del tramo real 23:35–23:48 h."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Informe Inmarsat",
                       "brief":  "Indica a Patri qué horario pertenece a la llamada real y aplica la regla de inversión sobre SAT-B.",
                       "clueHtml":  "\u003cp\u003eEl registro satelital valida únicamente el tramo continuo \u003cstrong\u003e23:35–23:48 h\u003c/strong\u003e (canales SAT-A y SAT-B). La señal de las 23:12 es una prueba previa.\u003c/p\u003e\u003cp\u003eConstruye el código uniendo \u003cstrong\u003ePalabra de SAT-A + Token de SAT-B invertido\u003c/strong\u003e.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Regla de Ensamblado Inmarsat",
                                      "items":  [
                                                    "Tramo válido: 23:35–23:48 h (SAT-A y SAT-B)",
                                                    "Invertir las 2 cifras del Token SAT-B detrás de la palabra"
                                                ]
                                  },
                       "partnerHint":  "Pide a Patri los mensajes de las bandas del tramo 23:35–23:48 h y recuerda invertir las dos cifras de SAT-B."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Sintonizador Multi-Banda",
                      "brief":  "Desliza el dial observando el S-Meter hasta cazar los tres picos de señal al 100% y léelos a Miguel.",
                      "clueHtml":  "\u003cp\u003eCuando el medidor \u003cstrong\u003eSeñal\u003c/strong\u003e llegue al \u003cstrong\u003e100%\u003c/strong\u003e, anota el canal, su hora y su clave. Hay \u003cstrong\u003etres frecuencias activas\u003c/strong\u003e entre 200 y 740 Hz.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "frequency",
                                     "minHz":  200,
                                     "maxHz":  740,
                                     "stepHz":  20,
                                     "initHz":  200,
                                     "bands":  [
                                                   {
                                                       "hz":  260,
                                                       "text":  "[AUX · 23:12 h] Llamada de prueba · Clave: CUMBRE · Sufijo: 19"
                                                   },
                                                   {
                                                       "hz":  420,
                                                       "text":  "[SAT-A · 23:35–23:48 h] Sofía con su madre · Clave SAT-A: VENTISCA"
                                                   },
                                                   {
                                                       "hz":  640,
                                                       "text":  "[SAT-B · 23:35–23:48 h] Telemetría buzón · Token SAT-B: 48"
                                                   }
                                               ]
                                 },
                      "partnerHint":  "Barre todo el dial de 200 a 740 Hz para encontrar las tres emisoras y pregunta a Miguel cuál es falsa y cómo combinar los dos canales buenos."
                  },
        "jointInput":  {
                           "label":  "Palabra SAT-A + Token SAT-B invertido",
                           "placeholder":  "Ej. CUMBRE19",
                           "acceptedHashes":  [
                                                  "cb08ddbaed2c0f4560761f5193c7513b814ae7e0ed23a8a3fe0b41d59fea04f8"
                                              ]
                       },
        "hints":  [
                      "Los tres picos en el S-Meter de Patri están en 260 Hz (23:12, descartado), 420 Hz (VENTISCA) y 640 Hz (48).",
                      "Miguel valida solo 23:35–23:48 (VENTISCA + 48) y aplica la regla de inversión a 48 -\u003e 84.",
                      "Solución del Día 16: VENTISCA84."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTEiLCJmb3JlbnNpY1RhZyI6IkxMQU1BREEgU0FURUxJVEFMIFZFUklGSUNBREEiLCJjb25jbHVzaW9uIjoiTGEgZ3JhYmFjacOzbiBzYXRlbGl0YWwgZGUgMTMgbWludXRvcyAoVkVOVElTQ0E4NCkgZGVtdWVzdHJhIHF1ZSBTb2bDrWEgTmF2YXJybyBwZXJtYW5lY2nDsyBlbiBsYSBTdWl0ZSAzMDUgaGFibGFuZG8gY29uIHN1IG1hZHJlIGR1cmFudGUgdG9kbyBlbCBhcGFnw7NuLiBRdWVkYSBkZXNjYXJ0YWRhLiJ9"
    },
    {
        "day":  17,
        "kicker":  "DÍA 17 · DEDUCCIÓN EINSTEIN 4x4",
        "title":  "Parrilla Deductiva del Comedor",
        "story":  "Cuatro personas del complejo (Héctor, Nora, Tomás y Marta) estuvieron en cuatro dependencias distintas (Cocina, Bodega, Salón y Oficio) en cuatro franjas exactas. Ninguna pista da un nombre directo.",
        "dossierContext":  {
                               "focus":  "El chef ejecutivo Héctor Salgado afrontaba el rechazo de su presupuesto y la amenaza directa de Arturo de externalizar toda la restauración del hotel.",
                               "alibi":  "Mantiene que a las 23:40 h supervisaba el soufflé navideño dentro de la Cocina junto a sus pinches, aunque las rondas entre Cocina, Bodega, Salón y Oficio resultan confusas.",
                               "goal":  "Completar la matriz deductiva 4x4 cruzando las ocho restricciones horarias y de ubicación del personal para confirmar exactamente dónde estuvo cada uno a las 23:40 h."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Pistas 1–4 y Lugares",
                       "brief":  "Comparte tus cuatro pistas lógicas con Patri para fijar primero lugar-hora y luego cada persona.",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003ePista 1:\u003c/strong\u003e Quien estuvo en la \u003cstrong\u003eBodega\u003c/strong\u003e llegó exactamente 10 minutos después de quien estuvo en \u003cstrong\u003eCocina\u003c/strong\u003e.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 2:\u003c/strong\u003e \u003cstrong\u003eMarta\u003c/strong\u003e estuvo 10 minutos antes que \u003cstrong\u003eTomás\u003c/strong\u003e, y Marta no pisó ni Cocina ni Bodega.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 3:\u003c/strong\u003e Nadie estuvo en el \u003cstrong\u003eSalón\u003c/strong\u003e después de las 23:30.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 4:\u003c/strong\u003e El turno en \u003cstrong\u003eOficio\u003c/strong\u003e se realizó a una hora terminada en :20.\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "type":  "logic3x3",
                                      "rows":  [
                                                   "Héctor",
                                                   "Nora",
                                                   "Tomás",
                                                   "Marta"
                                               ],
                                      "cols":  [
                                                   "Cocina",
                                                   "Bodega",
                                                   "Salón",
                                                   "Oficio"
                                               ]
                                  },
                       "inputLabel":  "Lugar de Héctor + Nombre de quien estuvo en Oficio",
                       "inputPlaceholder":  "Ej. bodega nora",
                       "acceptedHashes":  [
                                              "978c456a715eb4a2071728219249fe96ca5c00e0544af0b57c0613c00117e7db",
                                              "978c456a715eb4a2071728219249fe96ca5c00e0544af0b57c0613c00117e7db"
                                          ],
                       "partnerHint":  "Lee tus cuatro pistas a Patri y combina sus pistas 5–8 en la matriz 4x4 para ubicar a las cuatro personas."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Pistas 5–8 y Horarios",
                      "brief":  "Deduce junto a Miguel el horario completo de los cuatro empleados y valida las dos horas pedidas.",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003ePista 5:\u003c/strong\u003e \u003cstrong\u003eNora\u003c/strong\u003e bajó en la última franja posible (\u003cstrong\u003e23:50\u003c/strong\u003e), pero nunca entró en Cocina ni en Oficio.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 6:\u003c/strong\u003e La persona del \u003cstrong\u003eSalón\u003c/strong\u003e estuvo justo 10 min después de quien revisó el Oficio.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 7:\u003c/strong\u003e \u003cstrong\u003eHéctor\u003c/strong\u003e no estuvo ni a las 23:20 ni a las 23:30, ni pisó el Salón.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003ePista 8:\u003c/strong\u003e \u003cstrong\u003eTomás\u003c/strong\u003e no estuvo en Cocina ni en Oficio.\u003c/li\u003e\u003c/ul\u003e",
                      "widget":  {
                                     "type":  "logic3x3",
                                     "rows":  [
                                                  "Héctor",
                                                  "Nora",
                                                  "Tomás",
                                                  "Marta"
                                              ],
                                     "cols":  [
                                                  "23:20",
                                                  "23:30",
                                                  "23:40",
                                                  "23:50"
                                              ]
                                 },
                      "inputLabel":  "Hora de Héctor (4 díg.) + Hora de Nora (4 díg.) seguidas",
                      "inputPlaceholder":  "Ej. 23202330",
                      "acceptedHashes":  [
                                             "0266ad957b4e8910e876ad5024416d4fbab4ad3f627e307c89d4ce6937e26c95"
                                         ],
                      "partnerHint":  "Empieza fijando qué lugar va en :20, :30, :40 y :50 usando P4, P6 y P1; luego encaja a Nora y Héctor."
                  },
        "hints":  [
                      "Por P4 Oficio = 23:20 -\u003e por P6 Salón = 23:30 (cumple P3). Con P1 (Bodega 10 min después de Cocina), Cocina = 23:40 y Bodega = 23:50.",
                      "Por P5 Nora (23:50) = Bodega. Por P7 Héctor no está en 23:20 ni 23:30, luego Héctor = Cocina 23:40.",
                      "Quedan 23:20 Oficio y 23:30 Salón para Marta y Tomás; por P2 Marta = Oficio 23:20 y Tomás = Salón 23:30. Miguel: cocina marta · Patri: 23402350."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDIiLCJmb3JlbnNpY1RhZyI6IkVRVUlQTyBERSBDT0NJTkEgQ09NTyBURVNUSUdPIiwiY29uY2x1c2lvbiI6IkxvcyB0cmVzIHBpbmNoZXMgY29uZmlybWFuIHF1ZSBIw6ljdG9yIFNhbGdhZG8gbm8gc2FsacOzIGRlIGxhIENvY2luYSBhIGxhcyAyMzo0MCBoIHN1cGVydmlzYW5kbyBsb3MgcG9zdHJlcyBuYXZpZGXDsW9zLiBRdWVkYSBkZXNjYXJ0YWRvLiJ9"
    },
    {
        "day":  18,
        "kicker":  "DÍA 18 · BIOMECÁNICA DE HUELLA ABFO",
        "title":  "Huellas en la Nieve del Patio",
        "story":  "Una pisada de suela Vibram-Alpine modelo ALP-40 generó dudas sobre Adriana Orozco. Deberéis medir el largo exterior total, descontar el cerco de goma y convertir la horma interna.",
        "dossierContext":  {
                               "focus":  "La farmacéutica jubilada Adriana Orozco posee amplios conocimientos sobre alcaloides vegetales y dosificaciones letales. Además, una pisada nítida en la nieve bajo un alféizar hizo sospechar que salió al exterior.",
                               "alibi":  "Afirma que entregó sus botas secas en las taquillas de recepción a las 23:32 h y no volvió a pisar el jardín helado.",
                               "goal":  "Medir la huella exterior con el calibre ABFO, descontar el margen técnico de goma de la suela hasta la horma del pie y comparar la talla europea real con su calzado guardado."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Tabla de Horma y Taquillas",
                       "brief":  "Proporciona a Patri el descuento biomecánico de la goma (-1.5 cm) y los datos de la taquilla guardabotas de Adriana Orozco.",
                       "clueHtml":  "\u003cp\u003eLa goma exterior de las botas ALP-40 añade \u003cstrong\u003e1.5 cm\u003c/strong\u003e de cerco (\u003ccode\u003eL_pie = L_suela - 1.5 cm\u003c/code\u003e). Comparte con Patri esta regla y la talla registrada de Adriana Orozco en recepción.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Formato del Código",
                                      "items":  [
                                                    "Talla huella patio (2 díg.) + Talla Adriana (2 díg.) + Código suela",
                                                    "Ejemplo orientativo: 3938URB10"
                                                ]
                                  },
                       "partnerHint":  "Dicta a Patri el descuento (-1.5 cm), la talla 37 de Adriana en taquilla y el código ALP-40 para que convierta la pisada y cierre la validación."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Calibre Forense ABFO",
                      "brief":  "Mide la suela exterior con el calibre ABFO, resta el cerco que te indique Miguel y convierte L_pie en talla europea con tu tabla.",
                      "clueHtml":  "\u003cp\u003eLa longitud que marca tu calibre es el contorno exterior completo (\u003ccode\u003eL_suela\u003c/code\u003e). Pide a Miguel el margen de goma a descontar y la talla guardada de Adriana, busca la talla europea de \u003ccode\u003eL_pie\u003c/code\u003e en tu tabla superior y arma el código final.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "caliper",
                                     "targetCm":  26.5,
                                     "hideTable":  true,
                                     "table":  [

                                               ]
                                 },
                      "partnerHint":  "Pide a Miguel cuántos cm hay que restar por la goma exterior y qué talla entregó Adriana en taquilla; luego convierte L_pie en tu tabla."
                  },
        "jointInput":  {
                           "label":  "Talla huella + Talla Adriana + Modelo sin guion",
                           "placeholder":  "Ej. 3938URB10",
                           "acceptedHashes":  [
                                                  "8e99ce294e792ae1209a799c37a955b0c50209b55215cc8f8edd603231c0e3d3"
                                              ]
                       },
        "hints":  [
                      "El calibre alinea la suela exterior en 26.5 cm. Descontando el cerco de 1.5 cm resulta L_pie = 25.0 cm.",
                      "En la tabla de Miguel, L_pie = 25.0 cm corresponde a Talla 40 (Adriana calza Talla 37).",
                      "Solución del Día 18: 4037ALP40."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjUiLCJmb3JlbnNpY1RhZyI6IkNBTFpBRE8gU0VDTyBFTiBUQVFVSUxMQSAyMzozMiBIIiwiY29uY2x1c2lvbiI6IkFkcmlhbmEgT3JvemNvIGRlasOzIHN1cyBib3RhcyB0YWxsYSAzNyBzZWNhcyBlbiByZWNlcGNpw7NuIGEgbGFzIDIzOjMyIGggeSBudW5jYSBwaXPDsyBlbCBwYXRpbyBjb24gYm90YXMgQUxQLTQwIHRhbGxhIDQwLiBRdWVkYSBkZXNjYXJ0YWRhLiJ9"
    },
    {
        "day":  19,
        "kicker":  "DÍA 19 · CRIPTOGRAFÍA BANCARIA SWIFT",
        "title":  "Transferencias de Medianoche",
        "story":  "Cuatro transferencias internacionales salieron del hotel alrededor de la medianoche, pero el token de validación se cifra mediante coordenadas sobre una matriz SWIFT 6x6.",
        "dossierContext":  {
                               "focus":  "El banquero Álvaro Roldán dirigía una opa hostil sobre el hotel y mantuvo esa misma tarde un tenso roce en privado con Arturo por el control societario.",
                               "alibi":  "Asegura haber estado en la Suite 303 a las 23:39 h ejecutando una transferencia urgente de 45.000 EUR hacia Zúrich con verificación facial en directo.",
                               "goal":  "Filtrar las cuatro órdenes SEPA salientes del hotel, descifrar las coordenadas de verificación en la matriz SWIFT 6x6 y auditar si la firma biométrica coincide en tiempo real."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Órdenes SEPA Salientes",
                       "brief":  "Filtra la orden que cumpla importe \u003e 30.000 EUR hacia Zúrich durante el apagón (23:38–23:42 h).",
                       "clueHtml":  "\u003cp\u003eSolo una de las cuatro órdenes del extracto coincide simultáneamente con el destino, el umbral económico y la franja del apagón que confirma Patri. Lee a Patri su prefijo de 4 caracteres y sus 3 pares de coordenadas.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Filtro de Operación Sospechosa",
                                      "items":  [
                                                    "Importe \u003e 30.000 EUR · Destino Zúrich · Hora 23:38–23:42",
                                                    "Pasa a Patri su Prefijo (4 car.) y los 3 pares (Fila, Columna)"
                                                ]
                                  },
                       "partnerHint":  "Comunica el prefijo y los tres pares de coordenadas (F,C) de la operación válida para que Patri los decodifique en su matriz 6x6."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Matriz SWIFT 6x6 e IP Suite 303",
                      "brief":  "Decodifica las tres coordenadas de Miguel sobre la tabla 6x6 y anota el minuto de firma facial.",
                      "clueHtml":  "\u003cp\u003eCada par \u003ccode\u003e(Fila, Columna)\u003c/code\u003e señala un carácter en la tabla SWIFT 6x6 (Filas 1–6 arriba-abajo, Columnas 1–6 izquierda-derecha).\u003c/p\u003e\u003cp\u003eUne el \u003cstrong\u003ePrefijo de la orden\u003c/strong\u003e + los \u003cstrong\u003e3 caracteres decodificados\u003c/strong\u003e + los \u003cstrong\u003e2 dígitos del minuto de firma facial\u003c/strong\u003e.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Formato Token Completo",
                                     "items":  [
                                                   "[Prefijo 4 car.] + [3 car. Matriz 6x6] + [Minuto firma 2 díg.]",
                                                   "Ejemplo orientativo: LX19A2B34"
                                               ]
                                 },
                      "partnerHint":  "Asegúrate de filtrar solo OP-2 (Zúrich, 45.000 EUR, 23:39) y convertir (2,5)-(6,6)-(4,4) en la matriz."
                  },
        "jointInput":  {
                           "label":  "Prefijo + Código Matriz 6x6 + Minuto firma",
                           "placeholder":  "Ej. LX19A2B34",
                           "acceptedHashes":  [
                                                  "7936dadbab5d2b6579be8b33a932f32858e6f6e6c287ead76290ff473f0d8c1a"
                                              ]
                       },
        "hints":  [
                      "OP-1 son solo 12.000 EUR y OP-3 va a Luxemburgo fuera del apagón. Solo cumple OP-2: ZR84 con (2,5)-(6,6)-(4,4).",
                      "En la Matriz SWIFT 6x6: F2C5 = K, F6C6 = 9 y F4C4 = V -\u003e K9V. Firma facial en 23:39 -\u003e minuto 39.",
                      "Solución del Día 19: ZR84K9V39."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOm51bGwsImZvcmVuc2ljVGFnIjoiU0VTScOTTiBFTiBBVURJVE9Sw41BIMK3IFNJTiBERVNDQVJURSIsImNvbmNsdXNpb24iOiJMYSByZWZlcmVuY2lhIFpSODRLOVYzOSBhY3JlZGl0YSB1bmEgb3JkZW4gZGVzZGUgbGEgcmVkIGRlbCBob3RlbCBhIGxhcyAyMzozOSBoLCBwZXJvIHF1ZWRhIHBlbmRpZW50ZSBkZSBjb3Rlam8gZGlyZWN0byBzaSBzZSBmaXJtw7MgZW4gdml2byBvIGVuIGRpZmVyaWRvIGRlc2RlIGxhIFN1aXRlIDMwMy4gw4FsdmFybyBSb2xkw6FuIHBlcm1hbmVjZSBhY3Rpdm8gY29tbyBmaW5hbGlzdGEuIn0="
    },
    {
        "day":  20,
        "kicker":  "DÍA 20 · ESCÁNER DE TALLADO X-RAY",
        "title":  "Escáner de Equipaje (Rayos X)",
        "story":  "El escáner portátil separa la capa metálica (dientes reales de la llave y termómetro de latón) de la capa orgánica (botellas y precintos). Deberéis leer medidas visuales sin texto directo.",
        "dossierContext":  {
                               "focus":  "La sumiller Nora Echevarría discrepaba gravemente con Arturo por la falsificación de añadas de prestigio en la carta privada de bodega. Al revisar su maletín aparecieron herramientas y envases sin declarar.",
                               "alibi":  "Mantiene que durante el crimen estuvo inventariando botellas selladas en la cava del subsuelo sin subir al Salón Mirador.",
                               "goal":  "Activar los filtros metálico y orgánico de rayos X para medir visualmente los cinco dientes de su llave y comprobar la añada intacta y temperatura de la cava."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Espectro Metálico",
                       "brief":  "Activa el filtro de metales para medir la altura visual de los 5 dientes de la llave y leer el termómetro.",
                       "clueHtml":  "\u003cp\u003ePulsa el escáner para revelar el perfil real de la llave. Cada columna muestra una profundidad de tallado de \u003cstrong\u003e1 (corto) a 5 (largo)\u003c/strong\u003e que deberás dictar a Patri de izquierda a derecha, junto a los \u003cstrong\u003e°C\u003c/strong\u003e del termómetro.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "xray",
                                      "mode":  "metal",
                                      "detailSvg":  "\u003csvg viewBox=\u00270 0 280 95\u0027 style=\u0027width:100%;display:block;background:#020617;border-radius:6px;\u0027\u003e\u003cline x1=\u002724\u0027 y1=\u002726\u0027 x2=\u0027175\u0027 y2=\u002726\u0027 stroke=\u0027#38BDF8\u0027 stroke-width=\u00272\u0027/\u003e\u003crect x=\u002734\u0027 y=\u002726\u0027 width=\u002718\u0027 height=\u002716\u0027 fill=\u0027#67E8F9\u0027/\u003e\u003ctext x=\u002743\u0027 y=\u002721\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#BAE6FD\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003e2\u003c/text\u003e\u003crect x=\u002762\u0027 y=\u002726\u0027 width=\u002718\u0027 height=\u002740\u0027 fill=\u0027#67E8F9\u0027/\u003e\u003ctext x=\u002771\u0027 y=\u002721\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#BAE6FD\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003e5\u003c/text\u003e\u003crect x=\u002790\u0027 y=\u002726\u0027 width=\u002718\u0027 height=\u00278\u0027 fill=\u0027#67E8F9\u0027/\u003e\u003ctext x=\u002799\u0027 y=\u002721\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#BAE6FD\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003e1\u003c/text\u003e\u003crect x=\u0027118\u0027 y=\u002726\u0027 width=\u002718\u0027 height=\u002732\u0027 fill=\u0027#67E8F9\u0027/\u003e\u003ctext x=\u0027127\u0027 y=\u002721\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#BAE6FD\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003e4\u003c/text\u003e\u003crect x=\u0027146\u0027 y=\u002726\u0027 width=\u002718\u0027 height=\u002724\u0027 fill=\u0027#67E8F9\u0027/\u003e\u003ctext x=\u0027155\u0027 y=\u002721\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#BAE6FD\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003e3\u003c/text\u003e\u003crect x=\u0027194\u0027 y=\u002718\u0027 width=\u002768\u0027 height=\u002752\u0027 rx=\u00278\u0027 fill=\u0027rgba(251,191,36,0.12)\u0027 stroke=\u0027#FBBF24\u0027/\u003e\u003ctext x=\u0027228\u0027 y=\u002740\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#FDE68A\u0027 font-family=\u0027monospace\u0027 font-size=\u002711\u0027 font-weight=\u0027700\u0027\u003e+11 °C\u003c/text\u003e\u003ctext x=\u0027228\u0027 y=\u002756\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#CBD5E1\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003eTERMÓMETRO\u003c/text\u003e\u003c/svg\u003e",
                                      "reveal":  "TALLADO 5 PINES + TERMÓMETRO +11 °C",
                                      "sub":  "Dicta la secuencia de 5 alturas (1–5) a Patri y pídele añada + estante intacto."
                                  },
                       "inputLabel":  "Añada botella intacta (4 díg.) + Estante cava según Patri",
                       "inputPlaceholder":  "Ej. 1994A2",
                       "acceptedHashes":  [
                                              "071cb3361a8ef2107426acb161ca48c4b328ba90aa8ede3a208fc0c2b43cc411"
                                          ],
                       "partnerHint":  "Dicta a Patri los 5 cortes [2-5-1-4-3] y la temperatura (+11 °C). Pídele qué añada permanece precintada en la cava y qué código de estante le corresponde."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Espectro Orgánico y Tablas",
                      "brief":  "Activa el filtro orgánico para identificar qué botella mantiene intacto su precinto de las 23:40 h.",
                      "clueHtml":  "\u003cp\u003eCoteja los 5 cortes metálicos que vea Miguel con la tabla de cerrajero de tu documento para identificar qué llave guardaba Nora Echevarría en su maletín.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "xray",
                                     "mode":  "organic",
                                     "detailSvg":  "\u003csvg viewBox=\u00270 0 280 86\u0027 style=\u0027width:100%;display:block;background:#020617;border-radius:6px;\u0027\u003e\u003crect x=\u002718\u0027 y=\u002714\u0027 width=\u0027112\u0027 height=\u002758\u0027 rx=\u00276\u0027 fill=\u0027rgba(239,68,68,0.12)\u0027 stroke=\u0027#F87171\u0027/\u003e\u003ctext x=\u002774\u0027 y=\u002734\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#FECACA\u0027 font-family=\u0027monospace\u0027 font-size=\u002711\u0027 font-weight=\u0027700\u0027\u003eAÑADA 1994\u003c/text\u003e\u003ctext x=\u002774\u0027 y=\u002750\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#FCA5A5\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003eCORCHO ROTO · 21:10\u003c/text\u003e\u003crect x=\u0027150\u0027 y=\u002714\u0027 width=\u0027112\u0027 height=\u002758\u0027 rx=\u00276\u0027 fill=\u0027rgba(16,185,129,0.16)\u0027 stroke=\u0027#34D399\u0027/\u003e\u003ctext x=\u0027206\u0027 y=\u002734\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#A7F3D0\u0027 font-family=\u0027monospace\u0027 font-size=\u002711\u0027 font-weight=\u0027700\u0027\u003eAÑADA 1998\u003c/text\u003e\u003ctext x=\u0027206\u0027 y=\u002750\u0027 text-anchor=\u0027middle\u0027 fill=\u0027#6EE7B7\u0027 font-family=\u0027monospace\u0027 font-size=\u00279\u0027\u003ePRECINTO INTACTO 23:40\u003c/text\u003e\u003c/svg\u003e",
                                     "reveal":  "BOTELLA INTACTA 23:40: AÑADA 1998",
                                     "sub":  "Compara con el mapa de cava (+11 °C) para informar a Miguel del estante."
                                 },
                      "inputLabel":  "Código de llave del cerrajero sin guion (cruzado con Miguel)",
                      "inputPlaceholder":  "Ej. CAV03",
                      "acceptedHashes":  [
                                             "02bb43b4328c0c089761aec7469b194eb5b479bcb74f06e82e21370034a39ed3"
                                         ],
                      "partnerHint":  "Dile a Miguel la añada intacta (1998) y su estante en cava (B4). Pídele los 5 cortes para buscar su llave en la tabla de cerrajero."
                  },
        "hints":  [
                      "El escáner metálico revela 5 dientes de altura [2-5-1-4-3] y +11 °C; el orgánico muestra intacta la añada 1998.",
                      "En la tabla de Patri: [2-5-1-4-3] = CAV-09, y 1998 a +11 °C corresponde al Estante B4.",
                      "Solución del Día 20 — Miguel: 1998B4 · Patri: CAV09."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDciLCJmb3JlbnNpY1RhZyI6IlBSRUNJTlRPIERFIENBVkEgSU5UQUNUTyIsImNvbmNsdXNpb24iOiJMYSBsbGF2ZSBDQVYtMDksIGVsIHRlcm3Ds21ldHJvICgrMTEgwrBDKSB5IGxvcyBwcmVjaW50b3MgaW50YWN0b3MgZGUgbGEgYcOxYWRhIDE5OTggKEVzdGFudGUgQjQpIHBydWViYW4gcXVlIE5vcmEgRWNoZXZhcnLDrWEgcGVybWFuZWNpw7MgaW52ZW50YXJpYW5kbyBlbiBsYSBjYXZhIGluZmVyaW9yLiBRdWVkYSBkZXNjYXJ0YWRhLiJ9"
    },
    {
        "day":  21,
        "kicker":  "DÍA 21 · RECONSTRUCCIÓN RELATIVA",
        "title":  "Cronología de la Planta 3",
        "story":  "Los seis fragmentos de la Planta 3 perdieron casi todas sus marcas de reloj. Solo conocéis la hora exacta del apagón y una desviación técnica en el reloj de pasillo.",
        "dossierContext":  {
                               "focus":  "Beatriz Valdivieso, hermana y socia minoritaria de Arturo, se oponía frontalmente a la venta familiar del complejo y mantuvo una discusión audible en su suite poco antes del crimen.",
                               "alibi":  "Sostiene que bajó de Planta 3 antes del apagón y que permaneció en la Sala de Lectura de Planta 2 durante todo el corte eléctrico.",
                               "goal":  "Reconstruir el orden exacto de seis sucesos usando solo intervalos relativos desde la hora del apagón y corrigiendo el adelanto del reloj de pasillo."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Fragmentos T, R y V",
                       "brief":  "Aporta el ancla fija del apagón (T) y calcula junto a Patri los desplazamientos de minutos.",
                       "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003e[T] Ancla fija:\u003c/strong\u003e Apagón eléctrico general a las \u003cstrong\u003e23:38 h\u003c/strong\u003e exactas.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[R]:\u003c/strong\u003e La discusión junto a la Suite 301 ocurrió exactamente \u003cstrong\u003e9 minutos antes\u003c/strong\u003e del apagón.\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[V]:\u003c/strong\u003e La luz volvió cuando el reloj de pared del pasillo de Planta 3 marcaba las \u003cstrong\u003e23:45 h\u003c/strong\u003e (consultar desfase a Patri).\u003c/li\u003e\u003c/ul\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Tus Tres Fragmentos",
                                      "items":  [
                                                    "[T] = 23:38 exactas",
                                                    "[R] = Apagón menos 9 min  |  [V] = Reloj pasillo 23:45 (corregir desfase)"
                                                ]
                                  },
                       "partnerHint":  "Comunica [T]=23:38, [R] y [V] a Patri para deducir todas las horas y ordenar las 6 letras de menor a mayor minuto."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Fragmentos M, K, P y Desfase",
                      "brief":  "Aporta el desfase de +3 minutos del reloj de pared y calcula el instante real de tus tres eventos.",
                      "clueHtml":  "\u003cul class=\u0027clue-list\u0027\u003e\u003cli\u003e\u003cstrong\u003e[M]:\u003c/strong\u003e El ascensor pasó vacío por Planta 3 exactamente \u003cstrong\u003e4 minutos después\u003c/strong\u003e de la discusión junto a Suite 301 [R].\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[K]:\u003c/strong\u003e El botones vio bajar a Beatriz por la escalera \u003cstrong\u003e2 minutos después\u003c/strong\u003e del ascensor [M].\u003c/li\u003e\u003cli\u003e\u003cstrong\u003e[P]:\u003c/strong\u003e Beatriz llamó desde el fijo de Sala de Lectura \u003cstrong\u003e4 minutos después\u003c/strong\u003e de volver la luz [V].\u003c/li\u003e\u003cli\u003e\u003cstrong\u003eNota Mantenimiento:\u003c/strong\u003e El reloj de pared de Planta 3 iba \u003cstrong\u003e3 minutos adelantado\u003c/strong\u003e sobre la hora real.\u003c/li\u003e\u003c/ul\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Regla de Cierre",
                                     "items":  [
                                                   "Ordena las 6 letras [R, M, K, T, V, P] de más temprana a más tardía",
                                                   "Ejemplo orientativo: ABCDEF"
                                               ]
                                 },
                      "partnerHint":  "Calcula cada hora real corrigiendo los 3 minutos de adelanto en el reloj de pasillo antes de ubicar [V] y [P]."
                  },
        "jointInput":  {
                           "label":  "Secuencia ordenada de las 6 letras",
                           "placeholder":  "Ej. ABCDEF",
                           "acceptedHashes":  [
                                                  "241bb46078430e5854d6767ff40d60e7a3e637a0368667d9f95461e8e3b7a9ec"
                                              ]
                       },
        "hints":  [
                      "T = 23:38 -\u003e R = 23:38 - 9 = 23:29 -\u003e M = 23:29 + 4 = 23:33 -\u003e K = 23:33 + 2 = 23:35.",
                      "El reloj de pared marcaba 23:45 pero llevaba +3 min de adelanto -\u003e V real = 23:42 -\u003e P = 23:42 + 4 = 23:46.",
                      "Orden cronológico exacto: R (23:29), M (23:33), K (23:35), T (23:38), V (23:42), P (23:46) -\u003e RMKTVP."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDEiLCJmb3JlbnNpY1RhZyI6IlRFU1RJR09TIEVOIFNBTEEgREUgTEVDVFVSQSIsImNvbmNsdXNpb24iOiJMYSByZWNvbnN0cnVjY2nDs24gdGVtcG9yYWwgUk1LVFZQIHNpdMO6YSBhIEJlYXRyaXogVmFsZGl2aWVzbyBiYWphbmRvIGEgbGFzIDIzOjM1IGggeSBsbGFtYW5kbyBkZXNkZSBsYSBTYWxhIGRlIExlY3R1cmEgZGUgUGxhbnRhIDIgdHJhcyBlbCBhcGFnw7NuIGFudGUgdHJlcyB0ZXN0aWdvcy4gUXVlZGEgZGVzY2FydGFkYS4ifQ=="
    },
    {
        "day":  22,
        "kicker":  "DÍA 22 · ANÁLISIS DE OSCILOSCOPIO",
        "title":  "Pico de Voltaje en Planta 1",
        "story":  "El cuadro eléctrico general registró cuatro líneas entre las 23:30 y las 23:46 h. Distinguiréis cuál sufrió una caída manual de disyuntor, calcularéis el minuto exacto sobre la escala relativa y cruzaréis el sensor de la Capilla.",
        "dossierContext":  {
                               "focus":  "Teresa Alarcón culpaba a Arturo de la muerte de su marido en un accidente de obra ocurrido en el hotel en 2019. Además, alguien provocó deliberadamente el apagón de 4 minutos desde Planta 1.",
                               "alibi":  "Declara que rezaba con velas dentro de la Capilla Alpina mientras fallaba la luz, sin acercarse al cuadro eléctrico.",
                               "goal":  "Distinguir en el osciloscopio qué circuito sufrió un corte manual vertical frente a picos de tormenta, calcular el minuto exacto sobre escala relativa y cruzar el sensor de puerta de la capilla."
                           },
        "mode":  "code",
        "miguel":  {
                       "roleBadge":  "Miguel · Sensor Puerta Capilla (CP)",
                       "brief":  "Verifica que no hubo aperturas en la Capilla Alpina durante el corte y combina el código completo.",
                       "clueHtml":  "\u003cp\u003eEl contacto magnético \u003cstrong\u003eCP\u003c/strong\u003e certifica cero salidas de Teresa Alarcón durante el corte en Planta 1.\u003c/p\u003e\u003cp\u003eUne el \u003cstrong\u003eCódigo del circuito saboteado sin guion (3 car.)\u003c/strong\u003e + \u003cstrong\u003eHora exacta del corte (4 díg.)\u003c/strong\u003e + \u003cstrong\u003eCP\u003c/strong\u003e.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Formato del Código",
                                      "items":  [
                                                    "Circuito (ej. C01) + Hora corte (4 díg.) + CP",
                                                    "Ejemplo orientativo: C012334CP"
                                                ]
                                  },
                       "partnerHint":  "Verifica con Patri qué circuito hace caída vertical (C03) en la marca +8m (23:30 + 8 min = 23:38) y añade CP."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Osciloscopio 4 Circuitos",
                      "brief":  "Identifica qué circuito cae verticalmente de forma cuadrada a 0 V y calcula su hora sumando minutos a 23:30 h.",
                      "clueHtml":  "\u003cp\u003eLa escala horizontal empieza en \u003cstrong\u003eT0 = 23:30 h\u003c/strong\u003e con marcas verticales cada \u003cstrong\u003e+4 minutos\u003c/strong\u003e (+0m, +4m, +8m, +12m, +16m). Descarta caídas suaves o SAI continuo para hallar el corte manual.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "voltage",
                                     "traces":  [
                                                    {
                                                        "label":  "C-01 · Exterior (fluctuación lenta por tormenta)",
                                                        "color":  "#38BDF8",
                                                        "points":  "10,10 60,14 110,20 170,24 230,28 270,30"
                                                    },
                                                    {
                                                        "label":  "C-02 · Cocina (carga estable con micro-bache)",
                                                        "color":  "#34D399",
                                                        "points":  "10,12 160,12 170,20 180,12 270,12"
                                                    },
                                                    {
                                                        "label":  "C-03 · Dirección P1 (corte vertical abrupto)",
                                                        "color":  "#FF2D55",
                                                        "points":  "10,10 138,10 140,36 198,36 200,10 270,10"
                                                    },
                                                    {
                                                        "label":  "C-04 · Calderas (respaldo SAI continuo)",
                                                        "color":  "#FBBF24",
                                                        "points":  "10,14 270,14"
                                                    }
                                                ]
                                 },
                      "partnerHint":  "Indica a Miguel qué circuito cae en escalón vertical exacto (entre +8m y +12m desde las 23:30 h) y calcula la hora real del disparo."
                  },
        "jointInput":  {
                           "label":  "Circuito + Hora corte (4 díg.) + CP",
                           "placeholder":  "Ej. C012334CP",
                           "acceptedHashes":  [
                                                  "aacc2ea46582ae4e2ab174f94a5c66ff07064477e599a9c08167267c8860317c"
                                              ]
                       },
        "hints":  [
                      "Solo C-03 (Dirección P1) cae verticalmente de golpe a 0 V en la marca central de +8m y vuelve en +12m.",
                      "T0 = 23:30 h + 8 min = 23:38 h (apagón de 4 min hasta las 23:42 h).",
                      "Solución del Día 22: C032338CP."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMjMiLCJmb3JlbnNpY1RhZyI6IlBSRVNFTkNJQSBDT05USU5VQSBFTiBDQVBJTExBIiwiY29uY2x1c2lvbiI6Ik1pZW50cmFzIGVsIGNpcmN1aXRvIEMtMDMgZXJhIGNvcnRhZG8gbWFudWFsbWVudGUgYSBsYXMgMjM6MzggaCBlbiBQbGFudGEgMSwgZWwgY29udGFjdG8gbWFnbsOpdGljbyBDUCBwcnVlYmEgcXVlIFRlcmVzYSBBbGFyY8OzbiBubyBzYWxpw7MgZGUgbGEgQ2FwaWxsYSBBbHBpbmEuIFF1ZWRhIGRlc2NhcnRhZGEuIn0="
    },
    {
        "day":  23,
        "kicker":  "DÍA 23 · NOTARÍA Y TRIANGULACIÓN BTS",
        "title":  "La Penúltima Coartada",
        "story":  "Un borrador notarial rasgado por los extremos oculta dos de sus tres dígitos, mientras la operadora entrega duraciones crudas en segundos desde distintas celdas BTS.",
        "dossierContext":  {
                               "focus":  "El convenio de divorcio y reparto accionarial de la exmujer y abogada Valeria Domínguez expiraba justo al empezar el 1 de diciembre, lo que convertía aquella medianoche en su último plazo.",
                               "alibi":  "Afirma que estuvo hablando 26 minutos ininterrumpidos con su bufete de Madrid desde la ventana de la Suite 304 mientras discutía un borrador notarial.",
                               "goal":  "Reconstruir los dígitos faltantes del protocolo hallado en el abrigo de Arturo y comprobar en los registros celulares en segundos qué antena mantuvo activa esa llamada."
                           },
        "mode":  "dual-lock",
        "miguel":  {
                       "roleBadge":  "Miguel · Borrador y Mapa BTS",
                       "brief":  "Comunica la cifra central (7) y la suma total (19) del protocolo a Patri, y traduce su Cell-ID continua.",
                       "clueHtml":  "\u003cp\u003eEn el bolsillo de Arturo apareció un protocolo roto \u003ccode\u003e[D1][7][D3]\u003c/code\u003e donde la suma de sus tres cifras vale \u003cstrong\u003e19\u003c/strong\u003e y \u003ccode\u003eD1\u003c/code\u003e equivale a los años de vigencia del convenio anterior que guarda Patri.\u003c/p\u003e\u003cp\u003eCuando Patri filtre qué llamada dura al menos \u003cstrong\u003e25 minutos\u003c/strong\u003e seguidos, busca su Cell-ID en tu tabla.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Cruces de Doble Candado",
                                      "items":  [
                                                    "Comunicar a Patri: D2 = 7 y suma D1+D2+D3 = 19",
                                                    "Convertir Cell-ID continua de Patri a Código Antena BTS"
                                                ]
                                  },
                       "inputLabel":  "Código de antena BTS de la llamada ininterrumpida",
                       "inputPlaceholder":  "Ej. S201N",
                       "acceptedHashes":  [
                                              "bbffb9e3087f0fcc9ee7125eea0aea2f7bd5aead66850b2af8b0a987765261e0"
                                          ],
                       "partnerHint":  "Dile a Patri que D2=7 y suma=19; pregúntale los años del convenio para que deduzca D1 y D3, y qué Cell-ID superó los 25 min."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Operadora BTS y Anexo Legal",
                      "brief":  "Convierte los segundos del CDR a minutos para hallar la llamada continua (\u003e= 25 min) y deduce el protocolo.",
                      "clueHtml":  "\u003cp\u003eEl convenio previo Valeria–Arturo tenía \u003cstrong\u003e8 años de vigencia (D1 = 8)\u003c/strong\u003e. Con la cifra central y la suma total de Miguel calcula los tres dígitos del protocolo.\u003c/p\u003e\u003cp\u003eCalcula cuál de las llamadas del CDR en segundos supera los \u003cstrong\u003e25 minutos\u003c/strong\u003e y pasa su \u003cstrong\u003eCell-ID\u003c/strong\u003e a Miguel.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Formato Patri",
                                     "items":  [
                                                   "Protocolo notarial completo [D1][D2][D3] (3 dígitos)",
                                                   "Pista: divide 1560 segundos entre 60"
                                               ]
                                 },
                      "inputLabel":  "Protocolo notarial reconstruido (3 dígitos)",
                      "inputPlaceholder":  "Ej. 571",
                      "acceptedHashes":  [
                                             "3d734d729009b74c011651eb24b06a74151fb99b8da5110295da8bb77ec3f92d"
                                         ],
                      "partnerHint":  "1560 s / 60 = 26 min (Cell 4E); comunica Cell 4E a Miguel y calcula D3 sabiendo D1=8, D2=7 y suma=19."
                  },
        "hints":  [
                      "1560 segundos = 26 minutos ininterrumpidos (23:28–23:54) en Cell 4E -\u003e en la tabla de Miguel equivale a V304E.",
                      "D1 = 8 años (Patri), D2 = 7 (Miguel), suma = 19 -\u003e D3 = 19 - 8 - 7 = 4 -\u003e Protocolo 874.",
                      "Solución del Día 23 — Miguel: V304E · Patri: 874."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMDkiLCJmb3JlbnNpY1RhZyI6IkxMQU1BREEgSU5JTlRFUlJVTVBJREEgMjYgTUlOIiwiY29uY2x1c2lvbiI6IkxvcyByZWdpc3Ryb3MgZGUgYW50ZW5hIFYzMDRFIHkgZWwgcHJvdG9jb2xvIDg3NCBjb25maXJtYW4gbGEgbGxhbWFkYSBkZSBWYWxlcmlhIERvbcOtbmd1ZXogZW4gbGEgU3VpdGUgMzA0IGR1cmFudGUgMjYgbWludXRvcyBpbmludGVycnVtcGlkb3MuIEN1YXRybyBzb3NwZWNob3NvcyBwYXNhbiBhIGxhIGpvcm5hZGEgZGVjaXNpdmEgZGUgTm9jaGVidWVuYS4ifQ=="
    },
    {
        "day":  24,
        "kicker":  "DÍA 24 · RESOLUCIÓN FINAL",
        "title":  "Nochebuena: Juicio en el Ventisquero",
        "story":  "Es 24 de diciembre. Cuatro sospechosos siguen en pie en vuestro tablero. Paso 1: cruzad el registro horario del Spa con las cuatro aperturas electrónicas UID de la Hab. 206 y el inventario maestro para ejecutar el último descarte. Paso 2: enfrentad a los 3 finalistas en el Careo Final apoyándoos en la espectrometría MS de la copa.",
        "dossierContext":  {
                               "focus":  "La botánica Inés Casado guarda muestras de flora alpina tóxica en su equipaje de la Hab. 206, pero denuncia que alguien ajeno entró en su cuarto mientras ella estaba en el Spa. Al mismo tiempo, la autopsia apunta a un alcaloide alpino en la copa del brindis.",
                               "alibi":  "Inés asegura que permaneció en el circuito termal del Spa entre las 18:05 y las 19:00 h; fuera de ese último descarte, solo quedan tres finalistas con motivos vigentes.",
                               "goal":  "Paso 1: cruzar el horario del Spa con las cuatro aperturas UID de la Hab. 206 para aislar qué llave maestra robó el vial. Paso 2: identificar la toxina en el espectrómetro MS y cruzar huellas AFIS y coartadas en el Careo Final."
                           },
        "mode":  "final-trial",
        "miguel":  {
                       "roleBadge":  "Miguel · Cerradura 206 (UID) y Espectrómetro MS",
                       "brief":  "Compara tus 4 registros UID de Hab. 206 con la coartada del Spa de Patri y lee el pico molecular m/z de la copa.",
                       "clueHtml":  "\u003cp\u003e\u003cstrong\u003ePaso 1:\u003c/strong\u003e Cuatro UID distintos abrieron la Hab. 206 el 30 de noviembre, pero solo uno coincide dentro de la franja en que Inés estaba dentro del Spa Termal.\u003c/p\u003e\u003cp\u003e\u003cstrong\u003ePaso 2:\u003c/strong\u003e Guarda el peso molecular hallado en la copa (\u003cstrong\u003em/z 645.7 Da\u003c/strong\u003e) para identificar el veneno durante el Careo Final.\u003c/p\u003e",
                       "widget":  {
                                      "type":  "dossier-card",
                                      "caption":  "Auditoría Cerradura + Pico MS",
                                      "items":  [
                                                    "Cruzar franja Spa de Patri contra tus 4 UID",
                                                    "Identificar alcaloide de 645.7 Da para Paso 2"
                                                ]
                                  },
                       "partnerHint":  "Pregunta a Patri en qué tramo horario estuvo Inés dentro del Spa para identificar el UID anómalo y su hora exacta."
                   },
        "patri":  {
                      "roleBadge":  "Patri · Libro del Spa e Inventario de Llaves",
                      "brief":  "Aporta el horario presencial de Inés Casado en el Spa Termal y traduce el UID intruso a código KEY.",
                      "clueHtml":  "\u003cp\u003e\u003cstrong\u003ePaso 1 · Descarte Final:\u003c/strong\u003e Inés Casado permaneció dentro del Spa Termal de \u003cstrong\u003e18:05 a 19:00 h\u003c/strong\u003e. Busca con Miguel qué UID abrió su habitación en esa ventana, tradúcelo en tu llavero y añade la hora exacta (4 dígitos).\u003c/p\u003e\u003cp\u003e\u003cstrong\u003ePaso 2 · Careo Final:\u003c/strong\u003e Contrastad las fotografías AFIS y coartadas de los 3 finalistas restantes.\u003c/p\u003e",
                      "widget":  {
                                     "type":  "dossier-card",
                                     "caption":  "Paso 1 · Formato Llave + Hora",
                                     "items":  [
                                                   "Código llave intrusa sin guiones + Hora intrusión (4 díg.)",
                                                   "Ejemplo orientativo: KEYMAN071640"
                                               ]
                                 },
                      "partnerHint":  "Identifica el UID usado entre las 18:05 y 19:00 h, busca su KEY-XXX-XX en el llavero y concaténale la hora de 4 dígitos."
                  },
        "jointInput":  {
                           "label":  "Paso 1 · Código llave sin guiones + Hora intrusión (4 díg.)",
                           "placeholder":  "Ej. KEYMAN071640",
                           "acceptedHashes":  [
                                                  "35ea52c40ce742ff7ba3e78fdf6eac7b65b43622fc6f8eb9b87ec7c2cd10428c"
                                              ]
                       },
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
        "hints":  [
                      "Paso 1: Inés estuvo en el Spa de 18:05 a 19:00 h. A las 18:15 h entró UID-9042 en la Hab. 206, que corresponde a KEY-DIR-01 -\u003e KEYDIR011815.",
                      "Paso 2: En el espectrómetro MS de Miguel, el pico 645.7 Da corresponde al alcaloide aconitina (acónito); cruzando huellas W-14, fibra azul marino y cámaras, la maniobra fue el apagón del cuadro eléctrico.",
                      "Solución del Día 24 — Paso 1: KEYDIR011815 · Culpable: Carmen Ibáñez · Veneno: aconitina · Maniobra: apagón."
                  ],
        "unlockPayload":  "eyJkaXNjYXJkSWQiOiJzMTMiLCJmb3JlbnNpY1RhZyI6IklOw4lTIENBU0FETyBFWE9ORVJBREEgwrcgTExBVkUgTUFFU1RSQSBBSVNMQURBIiwiY29uY2x1c2lvbiI6Ikluw6lzIENhc2FkbyBlc3RhYmEgZW4gZWwgU3BhIFRlcm1hbCBjdWFuZG8gbGEgbGxhdmUgbWFlc3RyYSBLRVktRElSLTAxIGVudHLDsyBlbiBzdSBoYWJpdGFjacOzbiBwYXJhIHN1c3RyYWVyIGVsIHZpYWwgZGUgYWNvbml0aW5hLiIsImZpbmFsRXBpbG9ndWUiOnsidGl0bGUiOiJPUkRFTiBERSBERVRFTkNJw5NOIEVKRUNVVEFEQSDCtyBDQVNPIFJFU1VFTFRPIiwiY3VscHJpdElkIjoiczAzIiwiY3VscHJpdE5hbWUiOiJDYXJtZW4gSWLDocOxZXoiLCJjb25mZXNzaW9uIjoiQWNvcnJhbGFkYSBwb3IgbGEgbGVjdHVyYSBkZSBzdSBsbGF2ZSBtYWVzdHJhIEtFWS1ESVItMDEgZW4gbGEgSGFiLiAyMDYsIGVsIHJhc3RybyBkZSBhY29uaXRpbmEgZW4gbGEgbWFuZ2EgZGUgc3UgYmxhemVyIHkgZWwgYWNjZXNvIGFsIGN1YWRybyBlbMOpY3RyaWNvIHRyYXMgc3UgbW9zdHJhZG9yLCBDYXJtZW4gSWLDocOxZXogY29uZmVzw7M6IHRyYXMgZG9jZSBhw7FvcyBzb3N0ZW5pZW5kbyBlbCBob3RlbCwgQXJ0dXJvIHByZXRlbmTDrWEgdmVuZGVybG8geSBkZXNwZWRpcmxhIGVsIDEgZGUgZW5lcm8uIEFwcm92ZWNow7MgZWwgYXBhZ8OzbiBkZSA0IG1pbnV0b3MgZGUgbGFzIDIzOjM4IGggcGFyYSB2ZXJ0ZXIgbGEgZG9zaXMgZW4gbGEgY29wYSBkZWwgU2Fsw7NuIE1pcmFkb3IuIn19"
    }
];