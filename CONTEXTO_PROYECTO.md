# ADVIENTO CERO — EXPEDIENTE DE CONTEXTO EN VIVO (CERO SPOILERS)

> **Documento Maestro de Arquitectura, Sistema de Diseño y Operación**
> **Versión Actual:** v2.9.2 | **Repositorio:** [https://github.com/mgesm/advientocero](https://github.com/mgesm/advientocero)
> **Ubicación Local:** `C:\Users\migue\.gemini\antigravity\scratch\advientocero\`

---

## 1. Visión e Intención del Producto

**ADVIENTO CERO** es una aplicación web progresiva (PWA) criminalística en formato **Calendario de Adviento cooperativo y asimétrico** (del 1 al 24 de diciembre), diseñada como regalo interactivo para **Miguel y Patri**.

### Pilares Fundamentales
1. **Cooperación Asimétrica Bidireccional:** Al iniciar, cada jugador selecciona su terminal (`Miguel`: Análisis y Archivo · `Patri`: Campo y Testigos). En cada una de las 24 puertas, ambos móviles muestran mitades complementarias de la prueba; ninguno puede resolver el día en solitario sin comunicarse con su pareja.
2. **Enigmas Breves y Tecnológicos (~5–15 min/día):** Combina la accesibilidad diaria de los calendarios de misterio en papel con herramientas interactivas estilo VESTIGO (linterna UV táctil, receptor Morse con Web Audio API, cuadrantes 4x4, rueda César, válvulas hidráulicas, nonograma 5x5, calibrador ABFO, ecualizador de frecuencias y escáner espectral).
3. **1 Crimen · 25 Sospechosos · 22 Descartes + 3 Finalistas:** A lo largo de las 24 puertas se resuelven 22 descartes únicos y 2 diligencias retenidas sin descarte, dejando en pie a 3 sospechosos finalistas en Nochebuena para el Careo Final justificado junto con el sobre secreto del regalo real.
4. **Cero Spoilers:** Las respuestas se validan mediante hashes SHA-256 normalizados y las conclusiones diarias se decodifican en tiempo de ejecución desde cargas Base64-UTF8, permitiendo a Miguel probar la app antes del 1 de diciembre sin conocer al culpable.

---

## 2. Arquitectura del Ecosistema

* **Stack Zero-Build:** HTML5, CSS3, JavaScript Vanilla (ES2022) y Service Worker (`sw.js`) para despliegue directo en **GitHub Pages**.
* **Sincronización Dual (`js/sync-engine.js`):**
  * **Nube en Tiempo Real:** Firebase Realtime Database (compat SDK v10) bajo `/rooms/{roomId}` para sincronizar puertas resueltas, estado de Doble Candado (`miguelSolved` / `patriSolved`), descartes, pistas desbloqueadas, presencia online y libreta compartida.
  * **Fallback Offline:** Caché automática en `localStorage` (`adviento_cero_state_v1`) cuando no hay credenciales de Firebase configuradas o falla la conexión.
* **Control de Fechas y Modo Test (`js/date-gate.js`):**
  * Apertura progresiva real del **1 al 24 de diciembre de 2026** (permitiendo ponerse al día si se salta alguna jornada).
  * **Modo Test Oculto:** Activable mediante `?admin=ventisquero` o tocando **5 veces** el número de versión en la pestaña *Expediente*. Permite simular cualquier día y resetear el progreso antes del regalo sin revelar spoilers.

---

## 3. Reglas de Diseño (*Lacre de Medianoche · Nivel 2*)

Hereda las reglas de ergonomía y cero emojis de VESTIGO (`vestigo-design-guardian`) aplicadas al tema **Nivel 2 — Lacre de Medianoche**:
* **Cero Emojis (Regla Absoluta):** Prohibido cualquier emoji Unicode en interfaz, datos o código; toda la iconografía usa SVG inline de trazo fino (guirnalda de bombillas, estrella dorada, copos y candados).
* **Paleta Lacre de Medianoche (`css/liquid-christmas.css`):** Fondo nocturno pino-azul medianoche (`#132A24` → `#050B12`), cabecera limpia sin adornos colgantes, nevada invernal densa y suave en `<canvas>`, tarjetas cristal oscuro con borde dorado suave, puertas disponibles con **sello de lacre rojo redondo** y brillo dorado, puertas resueltas en verde abeto translúcido y dock inferior pino oscuro.
* **Ergonomía Mobile-First (`css/mobile-ux.css`):** Navegación inferior fija en 4 pestañas (*Calendario*, *Día Activo*, *Sospechosos*, *Expediente*), soporte `safe-area-inset` y partículas de nieve atmosféricas respetando `prefers-reduced-motion`.

---

## 4. Inventario de Archivos Clave

| Ruta | Función |
|---|---|
| `index.html` | Shell SPA, selector inicial Miguel/Patri, topbar, vistas y dock inferior |
| `config/gift-config.js` | Dedicatoria del 1 de diciembre y sobre secreto del 24 de diciembre (editable sin spoilers) |
| `config/firebase-config.js` | Credenciales públicas web de Firebase RTDB y nombre de sala compartida |
| `data/case-lore.js` | Premisa inicial del hotel, víctima, escenas y plano por plantas |
| `data/suspects.js` | Ficha base de los 25 sospechosos (`s01`–`s25`) |
| `data/days.js` | Los 24 días asimétricos con hashes SHA-256 y payloads codificados |
| `js/puzzle-engine.js` | Renderizador de los 15 tipos de widgets interactivos, validador y decodificador UTF-8 |
| `js/day-artifacts.js` | Materiales visuales realistas por día y terminal (48 vistas: planos, tickets, chats, básculas, rayos X, extractos) |
| `css/artifacts.css` | Estilos para planos arquitectónicos, papel térmico rasgado, burbujas de chat, tarjetas RFID y documentos |
| `video-briefing/index.html` | Vídeo briefing audiovisual 16:9 de apertura del caso (6 actos, narración Web Speech y sonido ambiente) |
| `imprimibles/PRESENTACION_ADVIENTO_CERO.pdf` | Dossier físico imprimible (2 págs. A4 claras) con briefing del caso, reglas cooperativas y QR |
| `js/sync-engine.js` | Sincronización Firebase Realtime Database + fallback `localStorage` |
| `js/date-gate.js` | Bloqueo por fecha de diciembre y Modo Test oculto |
| `js/audio-fx.js` | Síntesis Web Audio API (efectos táctiles y señal Morse) |
| `js/app.js` | Controlador principal, gestión de pestañas, modales y libreta compartida |
| `sw.js` | Precaché offline PWA (`adviento-cero-v1.0.0`) |
| `scripts/verify_integrity.ps1` | Auditoría automatizada (cero emojis, UTF-8 sin BOM, 24 descartes únicos, hashes válidos) |
