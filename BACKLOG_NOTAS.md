# ADVIENTO CERO — BLOC DE NOTAS E IDEAS (BACKLOG)

> **Regla de uso:** Este archivo recoge ideas, mejoras y ajustes futuros para **ADVIENTO CERO** sin modificar el código de la app hasta que decidas implementarlos explícitamente.
> **Normas:** Cero Spoilers (no anotar soluciones ni identidad del culpable) · Cero Emojis.

---

## Pendientes (Por implementar)

- [ ] `2026-11-17` **[Cooperativo/Sync]** Recordatorio diario para resolver la puerta del día — Añadir una opción para enviar/programar un recordatorio diario (notificación PWA/Web Push, enlace rápido por WhatsApp o evento de calendario `.ics`) que avise a la pareja para abrir la puerta del día. Posibles archivos: `js/app.js`, `sw.js`, `index.html`.
- [ ] `2026-11-17` **[Regalo/Personalización]** Añadir guiños y menciones personales (gato Paco y otros detalles por definir) — Incorporar referencias a un gato llamado Paco y demás detalles personales que vayamos concretando más adelante en textos, fichas o dedicatorias. Posibles archivos: `config/gift-config.js`, `data/case-lore.js`, `data/days.js`.

---

## En Revisión / Preguntas Abiertas

- `2026-11-17` **[Propuesta · Imprimible vs App]** Valorar quitar la presentación en profundidad del crimen del PDF impreso (`imprimibles/PRESENTACION_ADVIENTO_CERO.pdf`) y dejar en papel únicamente la explicación del regalo, el formato de juego cooperativo y el código QR, reservando la presentación inmersiva del crimen exclusivamente para el vídeo briefing dentro de la app.

---

## Completadas (Histórico)

- [x] `2026-11-19` **Dedicatoria automática a Patri + reset completo en Modo Test (`v2.8.0`)** — Al elegir el perfil de Patri por primera vez se muestra automáticamente el modal «Para Patri» (con flag `DEDICATION_SEEN_KEY` en `localStorage`); además, resetear desde Modo Test limpia por completo estado, rol elegido y flags locales para que el mensaje vuelva a mostrarse al elegir Patri.
- [x] `2026-11-19` **Retratos realistas completos (`25/25`) (`v2.8.0`)** — Sustituidos los últimos dos retratos vectoriales (`s24.svg` y `s25.svg`) por fotografías realistas `256x256` (`s24.jpg` y `s25.jpg`), actualizando `data/suspects.js` y `sw.js`.

- [x] `2026-11-17` **Limpieza de portada y dock inferior compacto** — Eliminados el recuadro hero superior y el bloque fijo de dedicatoria en Calendario, y reducida la altura del dock inferior para ganar espacio en móvil (`v2.0.0`).
- [x] `2026-11-17` **Descubrimiento progresivo en Sospechosos** — El tablero muestra únicamente los sospechosos descubiertos según el avance del calendario (`discoveredDay`), con etiquetas claras de estado (`SOSPECHOSO`, `DESCARTADO`, `CULPABLE`) (`v2.0.0`).
- [x] `2026-11-17` **Retratos realistas generados con IA (23/25)** — Sustituidos 13 retratos vectoriales por fotografías realistas (`s01, s05, s06, s07, s10, s11, s12, s13, s17, s18, s19, s22, s23`); pendientes únicamente `s24` y `s25` por límite temporal de cuota (`v2.0.0`).
- [x] `2026-11-17` **Vídeo Briefing realista del caso (Día 1 y Expediente)** — Reproductor 16:9 cinematográfico (`video-briefing/index.html`) con narración en castellano, dron sonoro Web Audio, HUD de cámara, apagón animado de las 23:38 y 6 actos sin spoilers (`v2.0.0`).
- [x] `2026-11-17` **Dossier imprimible A4 + PDF con QR** — Creados `imprimibles/presentacion_adviento_cero.html`, `imprimibles/qr_advientocero.svg` y `imprimibles/PRESENTACION_ADVIENTO_CERO.pdf` (2 páginas claras listas para imprimir en papel navideño) (`v2.0.0`).
- [x] `2026-11-16` **Base jugable y sincronización Firebase RTDB** — 24 días cooperativos asimétricos (Miguel vs Patri), 25 sospechosos, Motores interactivos + SHA-256 y sala en tiempo real (`v1.0.0`, `a8eb171`).
- [x] `2026-11-16` **Tema Lacre de Medianoche + Nevada aumentada** — Paleta pino-azul nocturno, sellos de lacre rojo y nevada densa sin adornos en cabecera (`v1.5.0`, `5366efa`).
- [x] `2026-11-16` **48 materiales visuales realistas** — Planos arquitectónicos SVG, tickets rasgados, chats, básculas, rayos X y documentos oficiales para los 24 días x 2 usuarios (`v1.6.0`, `bf92198`).
- [x] `2026-11-16` **Botón de cambio de usuario en Modo Test** — Alternancia directa entre Miguel y Patri en la barra admin (`v1.6.1`, `fe1dbc4`).
- [x] `2026-11-16` **Transiciones spring y celebración dorada** — Animaciones suaves de vistas, puertas, modales, sacudida en error y chispas doradas al resolver (`v1.7.0`, `8b10500`).
