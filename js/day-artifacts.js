/**
 * ADVIENTO CERO — MATERIALES VISUALES REALISTAS POR DÍA Y TERMINAL (48 VISTAS)
 * -----------------------------------------------------------------------------
 * Overhaul progresivo v2.6.0: planos, cromatografías, oscilogramas, termografía IR,
 * rejilla Cardano, matriz SWIFT 6x6, log biométrico BTS y actas forenses.
 */

window.DayArtifacts = (() => {
  function render(dayNum, role) {
    const body = renderInner(dayNum, role);
    if (!body) return "";
    const unit = role === "miguel" ? "UOPJ · ANÁLISIS DIGITAL" : "UOPJ · CAMPO Y TESTIGOS";
    const code = `IND-${String(dayNum).padStart(2, "0")}-${role === "miguel" ? "A" : "B"}`;
    return `
      <div class="artifact-envelope">
        <div class="custody-strip">
          <span><strong>${code}</strong> · ${unit} · ${String(dayNum).padStart(2, "0")} DIC</span>
          <button type="button" class="btn btn-sm btn-ghost" data-zoom-artifact style="min-height:34px;padding:4px 9px;font-size:0.7rem;">Inspeccionar ampliado</button>
        </div>
        <div class="artifact-body">${body}</div>
      </div>`;
  }

  function renderInner(dayNum, role) {
    const key = `${dayNum}-${role}`;
    switch (key) {
      // === DÍA 1 ===
      case "1-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">CROQUIS ORIENTACIÓN Y SENSORES · SALÓN MIRADOR</div>
            <svg viewBox="0 0 320 190" style="width:100%;display:block;border-radius:8px;background:#031019;">
              <rect x="12" y="12" width="296" height="166" fill="none" stroke="#38BDF8" stroke-width="1.5"/>
              <text x="160" y="27" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="10.5">NORTE · CHIMENEA DOBLE</text>
              <text x="160" y="170" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="10.5">SUR · ESCENARIO GALA</text>
              <text x="22" y="98" fill="#94A3B8" font-family="monospace" font-size="10.5" transform="rotate(-90 22 98)">OESTE · COMEDOR</text>
              <text x="298" y="98" fill="#FDE68A" font-family="monospace" font-size="10.5" transform="rotate(90 298 98)">ESTE · VENTANAL NIEVE</text>
              <circle cx="160" cy="95" r="16" fill="rgba(16,185,129,0.22)" stroke="#34D399" stroke-width="1.5"/>
              <text x="160" y="98" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="10.5">ABETO</text>
              <circle cx="160" cy="52" r="14" fill="rgba(255,255,255,0.06)" stroke="#64748B"/><text x="160" y="55" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="10.5">M1</text>
              <circle cx="76" cy="95" r="14" fill="rgba(255,255,255,0.06)" stroke="#64748B"/><text x="76" y="98" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="10.5">M2</text>
              <circle cx="160" cy="138" r="14" fill="rgba(255,255,255,0.06)" stroke="#64748B"/><text x="160" y="141" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="10.5">M3</text>
              <circle cx="244" cy="95" r="14" fill="rgba(255,255,255,0.06)" stroke="#FBBF24" stroke-width="1.5"/><text x="244" y="98" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="10.5">M4</text>
            </svg>
          </div>
          <div class="cctv-frame">
            <img src="imagenes/scene-lobby.jpg" alt="Salón Mirador" width="1024" height="572" decoding="async" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block;">
            <div class="cctv-hud"><span>REGISTRO ÓPTICO · SALÓN MIRADOR</span><span>REF: ESCENA-01</span></div>
          </div>`;
      case "1-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>PROTOCOLO MESA 4 · TARJETAS ANÓNIMAS</span><span class="paper-stamp">RECEPCIÓN</span></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Silla 1</strong><br>A. Roldán (VIP)</div>
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Silla 2</strong><br>T. Alarcón (VIP)</div>
              <div style="padding:8px;border:2px solid #B91C1C;border-radius:6px;background:#FEF2F2;"><strong>Silla 3 · PRENSA</strong><br>Iniciales: <strong>O.LL.</strong><br><span style="font-size:0.72rem;color:#B91C1C;">Salió al porche 23:35 h</span></div>
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Silla 4</strong><br>D. Aranda (VIP)</div>
            </div>
            <div class="mono" style="font-size:0.72rem;border-top:1px dashed #B45309;padding-top:6px;">
              <strong>Check-in VIP:</strong> D. Aranda (201) · T. Alarcón (202) · Ó. Llorente (108) · G. Serrano (208)
            </div>
          </div>`;

      // === DÍA 2 ===
      case "2-miguel":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>CUADRANTE NOCTURNO · BARRA PRINCIPAL</span><span class="paper-stamp">30 NOV</span></div>
            <table style="width:100%;border-collapse:collapse;font-size:0.74rem;">
              <tr style="border-bottom:1px solid rgba(180,83,9,0.25);text-align:left;"><th>Turno</th><th>Empleado</th><th>Horario e incidencia</th></tr>
              <tr style="border-bottom:1px solid rgba(180,83,9,0.18);"><td>#2</td><td>Ayudante Sala</td><td>22:00–23:15 · Salón Sur</td></tr>
              <tr style="border-bottom:1px solid rgba(180,83,9,0.18);"><td>#4</td><td>Pinche Frío</td><td>23:00–00:00 · Cocina interior</td></tr>
              <tr style="background:#FEE2E2;font-weight:700;"><td>#5</td><td>Nicolás Ferrer</td><td>23:34–23:44 · Cámara de hielo</td></tr>
              <tr><td>#8</td><td>Mozo Almacén</td><td>Turno diurno (finalizado 19:00)</td></tr>
            </table>
          </div>`;
      case "2-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">MUESTRA #B-02 · BANDEJA DE CRISTAL DE BARRA</div>
            <p style="font-size:0.76rem;color:#CBD5E1;">Soporte recogido junto al grifo de cerveza. Inspecciona toda la bandeja con el haz UV 365 nm inferior para leer tanto la serie como la nota técnica de inversión.</p>
          </div>`;

      // === DÍA 3 ===
      case "3-miguel":
        return `
          <div class="bank-slip" style="margin-bottom:10px;">
            <div style="color:#FDE68A;margin-bottom:6px;font-weight:700;">CONSOLA CENTRALITA · REGISTRO 23:39:08 H</div>
            <div class="bank-row"><span>CANAL EMERGENCIA</span><span>PULSADOR INTERIOR</span></div>
            <div class="bank-row"><span>TRAMA CAPTADA</span><span>5 CARACTERES MORSE</span></div>
          </div>`;
      case "3-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>TABLA MORSE INTERNACIONAL (A–Z)</span><span class="paper-stamp">CONSERJERÍA</span></div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;font-family:monospace;font-size:0.68rem;margin-bottom:8px;">
              <div><strong>A:</strong> .-</div><div><strong>B:</strong> -...</div><div><strong>C:</strong> -.-.</div><div><strong>D:</strong> -..</div>
              <div><strong>E:</strong> .</div><div><strong>F:</strong> ..-.</div><div><strong>G:</strong> --.</div><div><strong>H:</strong> ....</div>
              <div><strong>I:</strong> ..</div><div><strong>J:</strong> .---</div><div><strong>K:</strong> -.-</div><div><strong>L:</strong> .-..</div>
              <div><strong>M:</strong> --</div><div><strong>N:</strong> -.</div><div><strong>O:</strong> ---</div><div><strong>P:</strong> .--.</div>
              <div><strong>Q:</strong> --.-</div><div><strong>R:</strong> .-.</div><div><strong>S:</strong> ...</div><div><strong>T:</strong> -</div>
              <div><strong>U:</strong> ..-</div><div><strong>V:</strong> ...-</div><div><strong>W:</strong> .--</div><div><strong>X:</strong> -..-</div>
              <div><strong>Y:</strong> -.--</div><div><strong>Z:</strong> --..</div>
            </div>
            <div style="font-family:monospace;font-size:0.73rem;border-top:1px dashed #B45309;padding-top:6px;">
              <strong>EXTENSIONES RONDA (T. Bermúdez):</strong><br>
              Sótano (SOTAN) = <strong>04</strong> · Azotea (AZOTE) = <strong>09</strong> · Garaje (GARAJ) = <strong>12</strong> · Calderas (CALDE) = <strong>18</strong>
            </div>
          </div>`;

      // === DÍA 4 ===
      case "4-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">CUADRANTE DE LLAVES · PANEL SUPERIOR (F1–F2)</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Solo ves 2 dígitos fijos arriba (F1C2=2, F2C4=4). Intercambia tus posiciones con Patri para deducir todo el tablero 4x4 sin ambigüedad.</div>
          </div>`;
      case "4-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>PARTE DE GOBERNANTA · PANEL INFERIOR (F3–F4)</span><span class="paper-stamp">PRECINTADO</span></div>
            <div>Titular: <strong>Marta Quiroga</strong>. Solo ves 2 dígitos fijos abajo (F3C1=1, F4C3=3). Cruza deducciones fila/columna/caja 2x2 con Miguel.</div>
          </div>`;

      // === DÍA 5 ===
      case "5-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">PLANO PLANTA 2 · REGISTRO DE ANTENAS RFID</div>
            <svg viewBox="0 0 320 110" style="width:100%;display:block;border-radius:8px;background:#031019;">
              <rect x="10" y="18" width="300" height="74" fill="none" stroke="#38BDF8" stroke-width="1.2"/>
              <rect x="20" y="28" width="60" height="54" fill="rgba(255,255,255,0.04)" stroke="#475569"/><text x="50" y="52" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="10.5">PASILLO</text><text x="50" y="66" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="10">SUR</text>
              <rect x="90" y="28" width="60" height="54" fill="rgba(255,255,255,0.04)" stroke="#475569"/><text x="120" y="52" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="10.5">ASCENSOR</text><text x="120" y="66" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="10">CENTRAL</text>
              <rect x="160" y="28" width="70" height="54" fill="rgba(255,255,255,0.06)" stroke="#38BDF8" stroke-width="1.4"/><text x="195" y="52" text-anchor="middle" fill="#67E8F9" font-family="monospace" font-size="10.5" font-weight="700">BIBLIOTECA</text><text x="195" y="66" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="10">ANTENA 02</text>
              <rect x="240" y="28" width="60" height="54" fill="rgba(255,255,255,0.04)" stroke="#475569"/><text x="270" y="52" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="10.5">ESCALERA</text><text x="270" y="66" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="10">P1/P2</text>
            </svg>
          </div>`;
      case "5-patri":
        return `
          <div class="rfid-cards-grid">
            <div class="rfid-card"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#FDE68A;">TAG-B2</strong><span style="font-size:0.73rem;">Anulada 22:10 (Reserva)</span></div>
            <div class="rfid-card"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#FDE68A;">TAG-C7</strong><span style="font-size:0.73rem;">Lucía Montalvo (Hab. 204)</span></div>
            <div class="rfid-card"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#FDE68A;">TAG-E4</strong><span style="font-size:0.73rem;">Elena Valls (Hab. 203)</span></div>
            <div class="rfid-card"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#FDE68A;">TAG-F9</strong><span style="font-size:0.73rem;">Inés Casado (Hab. 206)</span></div>
          </div>`;

      // === DÍA 6 ===
      case "6-miguel":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>PARTITURA Y REGLA ACÚSTICA · GALA</span><span class="paper-stamp">CLAVE CÉSAR</span></div>
            <svg viewBox="0 0 300 72" style="width:100%;display:block;background:#FFFDF7;border-radius:6px;margin-bottom:6px;">
              <line x1="12" y1="22" x2="288" y2="22" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="30" x2="288" y2="30" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="38" x2="288" y2="38" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="46" x2="288" y2="46" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="54" x2="288" y2="54" stroke="#78716C" stroke-width="1"/>
              <!-- 4 notas negras -->
              <circle cx="36" cy="38" r="4.5" fill="#1C1917"/><line x1="40.5" y1="38" x2="40.5" y2="16" stroke="#1C1917" stroke-width="1.5"/>
              <circle cx="64" cy="34" r="4.5" fill="#1C1917"/><line x1="68.5" y1="34" x2="68.5" y2="14" stroke="#1C1917" stroke-width="1.5"/>
              <circle cx="92" cy="42" r="4.5" fill="#1C1917"/><line x1="96.5" y1="42" x2="96.5" y2="20" stroke="#1C1917" stroke-width="1.5"/>
              <circle cx="120" cy="30" r="4.5" fill="#1C1917"/><line x1="124.5" y1="30" x2="124.5" y2="11" stroke="#1C1917" stroke-width="1.5"/>
              <!-- 5 estrellas doradas -->
              <polygon points="168,14 170,19 175,20 171,23 172,28 168,26 164,28 165,23 161,20 166,19" fill="#D97706"/>
              <polygon points="194,14 196,19 201,20 197,23 198,28 194,26 190,28 191,23 187,20 192,19" fill="#D97706"/>
              <polygon points="220,14 222,19 227,20 223,23 224,28 220,26 216,28 217,23 213,20 218,19" fill="#D97706"/>
              <polygon points="246,14 248,19 253,20 249,23 250,28 246,26 242,28 243,23 239,20 244,19" fill="#D97706"/>
              <polygon points="272,14 274,19 279,20 275,23 276,28 272,26 268,28 269,23 265,20 270,19" fill="#D97706"/>
            </svg>
            <div style="font-size:0.73rem;"><strong>Regla del maestro de capilla:</strong> Desplazamiento César = (Notas negras) + (Estrellas doradas).</div>
          </div>`;
      case "6-patri":
        return `
          <div class="paper-ledger" style="margin-bottom:10px;">
            <div class="paper-ledger-head"><span>TRES LINEAS CIFRADAS · PERCHERO</span><span class="paper-stamp">CIFRADO</span></div>
            <div class="mono" style="font-size:0.95rem;font-weight:700;letter-spacing:0.12em;text-align:center;padding:6px;line-height:1.6;color:#7F1D1D;">
              BJUXW WXACN<br>LJVNARWX BDA<br>CNJCAX LNWCAJU
            </div>
          </div>`;

      // === DÍA 7 ===
      case "7-miguel":
        return `
          <div class="bank-slip" style="margin-bottom:10px;">
            <div style="color:#7DD3FC;font-weight:700;margin-bottom:6px;">ATESTADOS ANONIMIZADOS · 23:40 H</div>
            <div class="bank-row"><span>ALFA</span><span>Dormido desde 23:00 h (sin testigos)</span></div>
            <div class="bank-row"><span>BETA</span><span>Billar · miró el reloj de pie a las 23:40</span></div>
            <div class="bank-row"><span>GAMMA</span><span>Biblioteca · navegó por cable LAN 23:40</span></div>
            <div class="bank-row"><span>DELTA</span><span>Estudio Diseño · subida 1.4 GB 23:25–23:52</span></div>
            <div class="bank-row"><span>EPSILON</span><span>Invernadero · sintió suelo radiante cálido</span></div>
            <div class="bank-row"><span>ZETA</span><span>Terraza Oeste · abrió puerta exterior</span></div>
          </div>`;
      case "7-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">AUDITORÍA TÉCNICA Y SENSORES DEL HOTEL</div>
            <ul class="clue-list" style="font-size:0.75rem;">
              <li>Reloj de pie del Billar detenido a las <strong>20:15 h</strong>.</li>
              <li>Calefacción del Invernadero cortada desde las <strong>22:40 h</strong>.</li>
              <li>Puerta Terraza Oeste sellada por hielo: <strong>0 aperturas</strong>.</li>
              <li>Puerto LAN Biblioteca: <strong>0 bytes</strong> entre 23:00 y 00:00.</li>
              <li>Router Estudio Diseño: tráfico <strong>1.42 GB (23:25–23:52)</strong> de <strong>Diego Aranda (Ficha Nº 12)</strong>.</li>
            </ul>
          </div>`;

      // === DÍA 8 ===
      case "8-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">BÁSCULAS DE PRECISIÓN #1 Y #2</div>
            <svg viewBox="0 0 300 84" style="width:100%;display:block;">
              <rect x="8" y="8" width="136" height="68" rx="8" fill="#061814" stroke="#34D399"/>
              <text x="76" y="28" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="10">2 ANÍS + 1 CLAVO</text>
              <rect x="34" y="38" width="84" height="26" rx="4" fill="#020617" stroke="#38BDF8"/>
              <text x="76" y="55" text-anchor="middle" fill="#67E8F9" font-family="monospace" font-size="13" font-weight="700">18.0 g</text>
              <rect x="156" y="8" width="136" height="68" rx="8" fill="#061814" stroke="#FBBF24"/>
              <text x="224" y="28" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="10">1 CLAVO + 2 NUEZ</text>
              <rect x="182" y="38" width="84" height="26" rx="4" fill="#020617" stroke="#38BDF8"/>
              <text x="224" y="55" text-anchor="middle" fill="#67E8F9" font-family="monospace" font-size="13" font-weight="700">22.0 g</text>
            </svg>
          </div>`;
      case "8-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>BÁSCULAS #3–#4 Y RECETA DE CONTROL</span><span class="paper-stamp">PAULA MENDOZA</span></div>
            <div class="mono" style="padding:8px;background:#FFFDF7;border:1px solid #D97706;border-radius:6px;margin-bottom:6px;font-size:0.78rem;line-height:1.5;">
              <strong>Báscula 3:</strong> 1 Nuez + 1 Jengibre = <strong>15 g</strong><br>
              <strong>Báscula 4:</strong> 1 Anís + 1 Jengibre + 1 Clavo = <strong>17 g</strong>
            </div>
            <div style="font-size:0.78rem;">Fórmula incautada: <strong>3 Anís + 2 Nuez + 4 Clavo + 1 Jengibre = ? g</strong></div>
          </div>`;

      // === DÍA 9 ===
      case "9-miguel":
        return `
          <div class="cctv-frame" style="margin-bottom:8px;">
            <div class="cctv-hud" style="position:relative;background:#031019;padding:8px 10px;border-bottom:1px solid rgba(56,189,248,0.3);">
              <span>CAM-EXT · TERRAZA / POLEA</span><span>30/11 23:41:18 h</span>
            </div>
          </div>
          <div class="bank-slip">
            <div style="color:#67E8F9;font-weight:700;margin-bottom:6px;">TELEMETRÍA POSTES EXTERIORES (23:41 H)</div>
            <div class="bank-row"><span>Poste 01 (Sur · 180°)</span><span>-06 °C · Sin movimiento</span></div>
            <div class="bank-row"><span>Poste 02 (SE · 140°)</span><span>-09 °C · Ráfaga nieve</span></div>
            <div class="bank-row"><span>Poste 04 (Norte · 005°)</span><span>-14 °C · Iniciales manga: M.S.</span></div>
          </div>`;
      case "9-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">TERMOGRAFÍA IR · TECLADO CABAÑA NORTE (23:41 H)</div>
            <svg viewBox="0 0 280 120" style="width:100%;display:block;background:#020617;border-radius:8px;">
              <rect x="20" y="14" width="54" height="42" rx="6" fill="rgba(56,189,248,0.22)" stroke="#38BDF8"/>
              <text x="47" y="34" text-anchor="middle" fill="#BAE6FD" font-family="monospace" font-size="13" font-weight="700">7</text>
              <text x="47" y="49" text-anchor="middle" fill="#7DD3FC" font-family="monospace" font-size="10">22.1°C</text>

              <rect x="84" y="14" width="54" height="42" rx="6" fill="rgba(16,185,129,0.24)" stroke="#34D399"/>
              <text x="111" y="34" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="13" font-weight="700">2</text>
              <text x="111" y="49" text-anchor="middle" fill="#6EE7B7" font-family="monospace" font-size="10">24.8°C</text>

              <rect x="148" y="14" width="54" height="42" rx="6" fill="rgba(245,158,11,0.26)" stroke="#FBBF24"/>
              <text x="175" y="34" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="13" font-weight="700">9</text>
              <text x="175" y="49" text-anchor="middle" fill="#FCD34D" font-family="monospace" font-size="10">27.3°C</text>

              <rect x="212" y="14" width="54" height="42" rx="6" fill="rgba(239,68,68,0.34)" stroke="#F87171"/>
              <text x="239" y="34" text-anchor="middle" fill="#FECACA" font-family="monospace" font-size="13" font-weight="700">4</text>
              <text x="239" y="49" text-anchor="middle" fill="#FCA5A5" font-family="monospace" font-size="10">30.5°C</text>

              <text x="140" y="84" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="10">DISIPACIÓN TÉRMICA: EL BOTÓN MÁS FRÍO SE PULSÓ PRIMERO</text>
              <text x="140" y="102" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="10">ORDEN PIN: MENOR TEMP -&gt; MAYOR TEMP</text>
            </svg>
          </div>`;

      // === DÍA 10 ===
      case "10-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">MANUAL LÓGICO DE CALDERAS · SÓTANO</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Consulta abajo el circuito que cumpla la condición crítica en la terminal de Patri (ej. C4) para obtener sus reglas booleanas de purga.</div>
          </div>`;
      case "10-patri":
        return `
          <div class="blueprint-box" style="border-color:rgba(248,113,113,0.55);">
            <div class="blueprint-cap" style="color:#FECACA;">MANÓMETROS DE CALDERAS (CRÍTICO: &gt; 3.2 bar Y &lt; 45 °C)</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-family:monospace;font-size:0.74rem;margin-bottom:8px;">
              <div style="padding:7px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid #475569;"><strong>C-2:</strong> 2.4 bar · 38 °C</div>
              <div style="padding:7px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid #475569;"><strong>C-5:</strong> 3.8 bar · 62 °C</div>
              <div style="padding:7px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid #475569;"><strong>C-7:</strong> 2.9 bar · 40 °C</div>
              <div style="padding:7px;border-radius:6px;background:rgba(220,38,38,0.18);border:1px solid #F87171;"><strong>C-9:</strong> 4.1 bar · 36 °C</div>
            </div>
            <div style="font-size:0.73rem;color:#FDE68A;">Al estabilizar las 4 válvulas, anota la serie <strong>[AB][CD]</strong> e invierte los pares <strong>[CD][AB]</strong>.</div>
          </div>`;

      // === DÍA 11 ===
      case "11-miguel":
        return `
          <div class="paper-receipt torn-right">
            <div style="font-weight:700;border-bottom:1px dashed #94A3B8;padding-bottom:4px;margin-bottom:6px;">CINTA TPV · AUTORIZACIONES (SIN MESA)</div>
            <div><strong>AUT-41</strong> · 23:35 h .......... 11,50 EUR</div>
            <div><strong>AUT-42</strong> · 23:38 h .......... 6,20 EUR</div>
            <div><strong>AUT-43</strong> · 23:41 h .......... 19,50 EUR</div>
            <div><strong>AUT-44</strong> · 23:31 h .......... 24,00 EUR</div>
            <div style="border-top:1px solid #0F172A;margin-top:6px;padding-top:4px;font-size:0.72rem;">Orden desordenado respecto a lista de sala.</div>
          </div>`;
      case "11-patri":
        return `
          <div class="paper-receipt torn-left">
            <div style="font-weight:700;border-bottom:1px dashed #94A3B8;padding-bottom:4px;margin-bottom:6px;">CARTA BARRA Y COMANDAS (SIN IMPORTE)</div>
            <div style="font-size:0.7rem;margin-bottom:6px;border-bottom:1px dashed #CBD5E1;padding-bottom:4px;">
              Whisky 12,00 · Cóctel 7,00 · Cava 6,50 · Tapa 4,50 · Café Solo 3,80 · Agua Mineral 2,40
            </div>
            <div>Mesa 03 (Peña): 2x Whisky</div>
            <div>Mesa 05 (Sala): 1x Cóctel + 1x Tapa</div>
            <div><strong>Mesa 08 (M. Tejada):</strong> 1x Café Solo + 1x Agua</div>
            <div>Mesa 11 (Gala): 3x Cava</div>
          </div>`;

      // === DÍA 12 ===
      case "12-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">NONOGRAMA 5x5 · PISTAS DE FILAS (SOLO MIGUEL)</div>
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;font-family:monospace;font-size:0.8rem;color:#FDE68A;">
              <span>F1: 1,1,1</span><span>F2: 1</span><span>F3: 2</span><span>F4: 1</span><span>F5: 1,1</span>
            </div>
          </div>`;
      case "12-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>REJILLA CARDANO 5x5 · ARCHIVO HISTÓRICO</span><span class="paper-stamp">ELENA VALLS</span></div>
            <div class="mono" style="font-size:0.74rem;margin-bottom:6px;"><strong>Columnas:</strong> C1: 1 | C2: 3 | C3: 1,1 | C4: 1 | C5: 2</div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;font-family:monospace;font-size:0.8rem;font-weight:700;text-align:center;">
              <div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">A</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">B</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">R</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">7</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">C</div>
              <div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">X</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">4</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">K</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">2</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">1</div>
              <div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">P</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">9</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">V</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">0</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">M</div>
              <div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">8</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">A</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">S</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">5</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">D</div>
              <div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">Z</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">L</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">N</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">7</div><div style="padding:4px;background:#FFFDF7;border:1px solid #D97706;">3</div>
            </div>
            <div style="font-size:0.7rem;margin-top:6px;">Lee de izquierda a derecha y de arriba abajo solo los 9 recuadros rellenos del nonograma.</div>
          </div>`;

      // === DÍA 13 ===
      case "13-miguel":
        return `
          <div class="chat-thread">
            <div class="chat-bubble in">[Msg 1 · 22:14 Z] Torre: temporal supera 90 km/h; imposibilidad de vuelo.</div>
            <div class="chat-bubble gap">[Msg 2 · Ver en terminal de Patri]</div>
            <div class="chat-bubble out">[Msg 3 · 22:28 Z] Gabriel: apago la baliza de prueba de las 22:15 Z y activo solo la portadora limpia (-42 dBm) dentro del hangar.</div>
            <div class="chat-bubble gap">[Msg 4 · Ver confirmación UTC y puerta en Patri]</div>
            <div class="chat-bubble out">[Msg 5 · 22:38 Z] Gabriel: la de -78 dBm es eco falso de ladera; sigo atando palas en espera.</div>
          </div>`;
      case "13-patri":
        return `
          <div class="bank-slip" style="margin-bottom:8px;">
            <div style="color:#FDE68A;font-weight:700;margin-bottom:6px;">TORRE RADAR MILITAR · HORA CET = UTC + 1 H</div>
            <div class="bank-row"><span>HEL-418 (121.5 MHz)</span><span>-78 dBm · Eco de ladera</span></div>
            <div class="bank-row"><span>HEL-735 (121.5 MHz)</span><span>Apagada a las 22:15 Z</span></div>
            <div class="bank-row"><span>HEL-902 (121.5 MHz)</span><span>-42 dBm · Activa 22:37 Z · Hangar H4</span></div>
          </div>`;

      // === DÍA 14 ===
      case "14-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">RADAR AP-NORTE (HAB. 203) · RSSI -54 dBm</div>
            <svg viewBox="0 0 320 100" style="width:100%;display:block;border-radius:8px;background:#031019;">
              ${[201,202,203,204,205,206,207,208,209,210,211,212].map((num, idx) => {
                const x = 8 + idx * 25.5;
                return `<rect x="${x}" y="30" width="23" height="40" rx="3" fill="${num === 203 ? "rgba(0,229,255,0.22)" : "rgba(255,255,255,0.04)"}" stroke="${num === 203 ? "#00E5FF" : "#475569"}"/><text x="${x+11.5}" y="54" text-anchor="middle" fill="${num === 203 ? "#67E8F9" : "#94A3B8"}" font-family="monospace" font-size="8.5">${num}</text>`;
              }).join("")}
              <text x="160" y="18" text-anchor="middle" fill="#67E8F9" font-family="monospace" font-size="9.5">ATENCIÓN: -40/-49 dBm = 1 puerta · -50/-59 = 2 · -60/-69 = 3</text>
              <text x="160" y="88" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="9.5">TRÁFICO SUBIDA 2.8 MB/s -> HOSTNAME: RC-AUDIT-09</text>
            </svg>
          </div>`;
      case "14-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">RADAR AP-SUR (HAB. 208 · RSSI -63 dBm) + TABLA DHCP</div>
            <div class="bank-row" style="font-size:0.73rem;"><span><strong>AP-SUR (208):</strong></span><span>Señal -63 dBm (ver tabla distancia en Miguel)</span></div>
            <div class="bank-row" style="font-size:0.73rem;"><span>Huesped-Phone:</span><span>A4:83:E7:19:4C · Audio 12 KB/s</span></div>
            <div class="bank-row" style="font-size:0.73rem;"><span><strong>RC-AUDIT-09 (Raúl C.):</strong></span><span>3C:52:82:9F:0B · TLS Hacienda</span></div>
            <div class="bank-row" style="font-size:0.73rem;"><span>Tablet-201:</span><span>70:3A:CB:11:D2 · En reposo</span></div>
          </div>`;

      // === DÍA 15 ===
      case "15-miguel":
        return `
          <div class="paper-ledger" style="background:linear-gradient(145deg,#92400E,#78350F);color:#FEF3C7;border:2px solid #FBBF24;">
            <div class="mono" style="font-size:0.72rem;letter-spacing:0.12em;">PLACA 1987 E INTENTO FALLIDO #1</div>
            <div class="serif" style="font-size:1.02rem;font-weight:700;margin:4px 0;">D1 = Último dígito de fundación (1987)</div>
            <div class="mono" style="font-size:0.78rem;color:#FDE68A;">Prueba 1: [ 7 2 5 8 4 ] -> 1 exacto · 2 en otra pos.</div>
            <div class="mono" style="font-size:0.76rem;color:#FEF3C7;margin-top:4px;">Condición: D2 + D4 = 5 y D2 &gt; D4</div>
          </div>`;
      case "15-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">CROQUIS SALÓN (D4) E INTENTO FALLIDO #2</div>
            <svg viewBox="0 0 300 66" style="width:100%;display:block;background:#031019;border-radius:8px;margin-bottom:8px;">
              <rect x="20" y="10" width="260" height="46" fill="none" stroke="#FBBF24" stroke-width="1.2"/>
              <rect x="55" y="10" width="44" height="12" fill="rgba(220,38,38,0.45)" stroke="#F87171"/><text x="77" y="40" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="10">CHIMENEA 1</text>
              <rect x="201" y="10" width="44" height="12" fill="rgba(220,38,38,0.45)" stroke="#F87171"/><text x="223" y="40" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="10">CHIMENEA 2</text>
            </svg>
            <div class="mono" style="font-size:0.75rem;color:#67E8F9;">Prueba 2: [ 1 3 9 2 8 ] -> 2 exactos · 1 en otra pos.</div>
            <div class="mono" style="font-size:0.73rem;color:#CBD5E1;margin-top:4px;">Sin dígitos repetidos · Suma D1+D2+D3+D4+D5 = 26</div>
          </div>`;

      // === DÍA 16 ===
      case "16-miguel":
        return `
          <div class="bank-slip">
            <div style="color:#67E8F9;font-weight:700;margin-bottom:6px;">INFORME ANTENA INMARSAT · SUITE 305</div>
            <div class="bank-row"><span>LLAMADA BREVE 23:12</span><span>Descartada (buzón de prueba)</span></div>
            <div class="bank-row"><span>TRAMO REAL 23:35–23:48</span><span>Canales válidos: SAT-A y SAT-B</span></div>
            <div class="bank-row"><span>FORMATO CÓDIGO</span><span>Palabra SAT-A + Token SAT-B invertido</span></div>
          </div>`;
      case "16-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ESPECTRO INMARSAT · SUITE 305 (BARRER 200–740 Hz)</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Hay 3 portadoras activas ocultas bajo la estática. Observa el medidor S-Meter inferior hasta sintonizar todas y filtra la hora real con Miguel.</div>
          </div>`;

      // === DÍA 17 ===
      case "17-miguel":
      case "17-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>MATRIZ LÓGICA 4x4 · COMEDOR Y DEPENDENCIAS</span><span class="paper-stamp">23:20–23:50</span></div>
            <div>Disponéis de 4 personas (<strong>Héctor, Nora, Tomás, Marta</strong>), 4 lugares y 4 franjas. Ninguna persona ni lugar repite franja. Cruzad las 8 pistas entre ambos terminales.</div>
          </div>`;

      // === DÍA 18 ===
      case "18-miguel":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>REGLA BIOMÉTRICA Y TAQUILLA GUARDABOTAS</span><span class="paper-stamp">30 NOV</span></div>
            <div class="mono" style="font-size:0.72rem;margin-bottom:8px;padding:6px;background:#FFFDF7;border:1px solid #D97706;border-radius:5px;">
              <strong>Margen Vibram ALP-40:</strong> L_pie = L_suela - <strong>1.5 cm</strong>
            </div>
            <div class="rfid-cards-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div style="padding:8px;border:1.5px solid #B91C1C;border-radius:6px;background:#FEF2F2;"><strong>Hab. 107 · Adriana Orozco</strong><br>Talla <strong>37</strong> · Secas 23:32 h</div>
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Hab. 203 · Elena Valls</strong><br>Talla 38 · En taquilla</div>
            </div>
          </div>`;
      case "18-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">CALIBRE ABFO + TABLA DE HORMA INTERNA</div>
            <div class="mono" style="font-size:0.71rem;margin-bottom:6px;color:#FDE68A;">
              <strong>L_pie interno:</strong> 23.5=T.37 · 24.0=T.38 · 24.5=T.39 · 25.0=T.40 · 25.5=T.41 · 26.5=T.42
            </div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Mide la suela en el calibre inferior, aplica la resta biomecánica que te dé Miguel y busca la talla europea exacta en esta tabla.</div>
          </div>`;

      // === DÍA 19 ===
      case "19-miguel":
        return `
          <div class="bank-slip">
            <div style="color:#7DD3FC;font-weight:700;margin-bottom:6px;">CUATRO ÓRDENES SEPA SALIENTES · 30 NOV</div>
            <div class="bank-row"><span>OP-1 · 23:32 · Zúrich</span><span>12.000 EUR · PX12</span></div>
            <div class="bank-row"><span>OP-2 · 23:39 · Zúrich</span><span>45.000 EUR · ZR84 · (2,5)-(6,6)-(4,4)</span></div>
            <div class="bank-row"><span>OP-3 · 23:34 · Luxemburgo</span><span>45.000 EUR · LX19 · (1,1)-(5,3)-(2,2)</span></div>
            <div class="bank-row"><span>OP-4 · 23:41 · Madrid</span><span>8.500 EUR · MD07</span></div>
          </div>`;
      case "19-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>MATRIZ SWIFT 6x6 + FIRMA BIOMÉTRICA</span><span class="paper-stamp">SUITE 303</span></div>
            <div class="mono" style="font-size:0.72rem;margin-bottom:6px;">Firma facial en directo: <strong>Suite 303 · 23:39:14 h</strong> (orden &gt; 30.000 EUR hacia Zúrich durante el apagón).</div>
            <div class="mono" style="font-size:0.7rem;padding:6px;background:#FFFDF7;border:1px solid #D97706;border-radius:6px;line-height:1.45;">
              Cols 1..6:<br>
              F1: A B C D E F<br>
              F2: G H I J K L<br>
              F3: M N O P Q R<br>
              F4: S T U V W X<br>
              F5: Y Z 0 1 2 3<br>
              F6: 4 5 6 7 8 9
            </div>
          </div>`;

      // === DÍA 20 ===
      case "20-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ESCÁNER METÁLICO · CAPA OCULTA BAJO FILTRO</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Activa el escáner inferior para revelar los 5 cortes reales de la llave maestra y el termómetro de latón.</div>
          </div>`;
      case "20-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>TABLA CERRAJERO Y MAPA DE CAVA INFERIOR</span><span class="paper-stamp">NORA ECHEVARRÍA</span></div>
            <div class="mono" style="font-size:0.7rem;margin-bottom:6px;">
              <strong>Tallado pines:</strong> CAV-03 [2-4-1-5-3] · CAV-09 [2-5-1-4-3] · CAV-12 [3-5-2-4-1] · CAV-15 [1-5-2-4-3]
            </div>
            <div class="mono" style="font-size:0.7rem;border-top:1px dashed #B45309;padding-top:5px;">
              <strong>Estantes Cava (+11 °C):</strong> Estante A2 (Añada 1994) · Estante B4 (Añada 1998) · Estante C1 (Añada 2002)
            </div>
          </div>`;

      // === DÍA 21 ===
      case "21-miguel":
      case "21-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">RECONSTRUCCIÓN RELATIVA · ANCLA ÚNICA 23:38 H</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Calculad el minuto real de cada uno de los 6 fragmentos [R, M, K, T, V, P] sumando/restando intervalos relativos y corrigiendo el desfase horario del reloj de pared.</div>
          </div>`;

      // === DÍA 22 ===
      case "22-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">SENSOR MAGNÉTICO PUERTA CAPILLA (CP) · 30 NOV</div>
            <div class="bank-row" style="font-size:0.73rem;"><span>23:24:10 h · Teresa Alarcón</span><span>OPEN -&gt; CLOSED</span></div>
            <div class="bank-row" style="font-size:0.73rem;"><span>23:25:00 – 23:51:00 h</span><span><strong>0 aperturas</strong> (recinto sellado)</span></div>
            <div class="bank-row" style="font-size:0.73rem;"><span>23:52:18 h · Salida</span><span>OPEN</span></div>
          </div>`;
      case "22-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ANALIZADOR DE CARGA · CUADRO GENERAL</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Distingue en el osciloscopio inferior entre oscilación gradual de tormenta, SAI continuo y caída cuadrada vertical por apertura manual de disyuntor.</div>
          </div>`;

      // === DÍA 23 ===
      case "23-miguel":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>BORRADOR ROTO + MAPA ANTENAS BTS</span><span class="paper-stamp">NOTARÍA</span></div>
            <div style="font-size:0.75rem;margin-bottom:6px;">Protocolo parcial: <strong>[ D1 ] [ 7 ] [ D3 ]</strong> · Suma total = <strong>19</strong> (D1 = años vigencia convenio en Patri).</div>
            <div class="mono" style="font-size:0.71rem;padding:6px;background:#FFFDF7;border:1px solid #D97706;border-radius:6px;">
              Cell 2B -&gt; S201N | Cell 4E -&gt; V304E | Cell 7A -&gt; V304W | Cell 9C -&gt; E108S
            </div>
          </div>`;
      case "23-patri":
        return `
          <div class="bank-slip">
            <div style="color:#FDE68A;font-weight:700;margin-bottom:6px;">CDR OPERADORA Y ANEXO JURÍDICO · SUITE 304</div>
            <div class="bank-row"><span>Convenio Valeria–Arturo</span><span>Vigencia pactada: <strong>8 años</strong></span></div>
            <div class="bank-row"><span>Llamada 23:12 (Cell 2B)</span><span>180 s · Cortada</span></div>
            <div class="bank-row"><span>Llamada 23:28–23:54 (Cell 4E)</span><span><strong>1560 s</strong> ininterrumpidos</span></div>
            <div class="bank-row"><span>Llamada 23:45 (Cell 7A)</span><span>240 s · Buzón</span></div>
          </div>`;

      // === DÍA 24 ===
      case "24-miguel":
        return `
          <div class="bank-slip" style="border-color:rgba(248,113,113,0.6);">
            <div style="color:#FECACA;font-weight:700;margin-bottom:6px;">VOLCADO CERRADURA HAB. 206 Y ESPECTRÓMETRO MS</div>
            <div class="bank-row"><span>11:20 h · Limpieza</span><span>UID-4410</span></div>
            <div class="bank-row"><span>16:40 h · Toallas</span><span>UID-5128</span></div>
            <div class="bank-row"><span>18:15 h · 3 min dentro</span><span>UID-9042</span></div>
            <div class="bank-row"><span>21:55 h · Radiador</span><span>UID-7731</span></div>
            <div style="border-top:1px dashed rgba(248,113,113,0.45);margin-top:6px;padding-top:6px;font-size:0.72rem;color:#FDE68A;">
              <strong>Pico MS hallado en copa: m/z 645.7 Da</strong><br>
              Patrones: Atropina (289.4 Da) · Coniína (127.2 Da) · Aconitina (645.7 Da) · Digoxina (780.9 Da)
            </div>
          </div>`;
      case "24-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>SPA TERMAL + INVENTARIO DE 5 LLAVES MAESTRAS</span><span class="paper-stamp">NOCHEBUENA</span></div>
            <div style="font-size:0.74rem;margin-bottom:6px;"><strong>Spa Termal (firma presencial):</strong> Inés Casado dentro del circuito de aguas de <strong>18:05 a 19:00 h</strong>.</div>
            <div class="mono" style="font-size:0.7rem;padding:6px;background:#FFFDF7;border:1px solid #D97706;border-radius:6px;line-height:1.45;">
              UID-4410 -> KEY-LIM-02 (Pisos)<br>
              UID-5128 -> KEY-GOB-03 (Lavandería)<br>
              UID-6019 -> KEY-SEC-05 (Seguridad)<br>
              UID-7731 -> KEY-MAN-07 (Calderas)<br>
              <strong>UID-9042 -> KEY-DIR-01 (Exclusiva Dirección Planta 1)</strong>
            </div>
          </div>`;

      default:
        return "";
    }
  }

  function renderFinalShowdown(role, remaining) {
    const names = (remaining || []).map((s) => s.name).join(" · ");
    if (role === "miguel") {
      return `
        <div class="glass-card" style="padding:14px;margin-bottom:14px;border:var(--vg-border-frost);background:rgba(5,11,18,0.72);">
          <span class="badge badge-frost">CAREO FINAL · LABORATORIO AFIS (SOLO MIGUEL)</span>
          <p class="day-story" style="margin:8px 0 10px;font-size:0.82rem;">Han llegado los resultados del laboratorio sobre los <strong>${(remaining || []).length} finalistas</strong> (${names}). Contrasta estas trazas físicas con las coartadas de Patri:</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:12px;">
            <button type="button" class="lightbox-thumb" data-lightbox-img="imagenes/evidence/cuadro_electrico_final.jpg" data-lightbox-cap="MARCA 1: DISYUNTOR APAGÓN 23:38 · MARCA 2: LLAVE KEY-DIR-01" style="padding:0;text-align:left;border-radius:10px;overflow:hidden;border:var(--vg-border-specular);background:#020408;cursor:pointer;">
              <img src="imagenes/evidence/cuadro_electrico_final.jpg" alt="Cuadro eléctrico 23:38 h" width="960" height="540" decoding="async" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block;">
              <div class="mono" style="padding:7px 9px;font-size:0.72rem;color:#FDE68A;">[Toca para ampliar] MARCA 1: DISYUNTOR 23:38 · MARCA 2: KEY-DIR-01</div>
            </button>
            <button type="button" class="lightbox-thumb" data-lightbox-img="imagenes/evidence/afis_huellas_final.jpg" data-lightbox-cap="HUELLA LATENTE EN PALANCA: PATRÓN VERTICILO W-14 + FIBRA LANA AZUL MARINO" style="padding:0;text-align:left;border-radius:10px;overflow:hidden;border:var(--vg-border-specular);background:#020408;cursor:pointer;">
              <img src="imagenes/evidence/afis_huellas_final.jpg" alt="Cotejo UV dactiloscópico AFIS" width="960" height="540" decoding="async" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block;">
              <div class="mono" style="padding:7px 9px;font-size:0.72rem;color:#67E8F9;">[Toca para ampliar] HUELLA LATENTE: VERTICILO W-14 + FIBRA LANA</div>
            </button>
          </div>
          <ul class="clue-list" style="font-size:0.8rem;">
            <li><strong>Álvaro Roldán (Suite 303):</strong> Dactiloscopia <em>Arco Simple (A-04)</em> — no coincide. Tarjeta RFID sin paso por Planta 1 entre 23:10 y 00:10 h; firma biométrica emitida en vivo desde IP local 10.14.3.303 a las 23:39:14 h.</li>
            <li><strong>Paula Mendoza (Hab. 105):</strong> Dactiloscopia <em>Presilla Cubital (L-09)</em> — no coincide. Vestía uniforme blanco de algodón en el spa.</li>
            <li><strong>Carmen Ibáñez (Hab. 102):</strong> Dactiloscopia <strong>Verticilo W-14 coincidente al 99,4%</strong> en el disyuntor del apagón, fibra compatible con su jersey de lana azul marino y única titular de la llave mecánica <strong>KEY-DIR-01</strong> usada en Hab. 206.</li>
          </ul>
        </div>`;
    }

    return `
      <div class="glass-card" style="padding:14px;margin-bottom:14px;border:var(--vg-border-gold);background:rgba(5,11,18,0.72);">
        <span class="badge badge-gold">CAREO FINAL · TOXICOLOGÍA Y TESTIGOS (SOLO PATRI)</span>
        <p class="day-story" style="margin:8px 0 10px;font-size:0.82rem;">Parte final de testigos y toxicología LC-MS sobre los <strong>${(remaining || []).length} sospechosos activos</strong> (${names}). Contrasta las coartadas reales con las huellas de Miguel:</p>
        <button type="button" class="lightbox-thumb" data-lightbox-img="imagenes/evidence/viales_toxicologia_final.jpg" data-lightbox-cap="BOLSA A: FRASCOS AMBAR DEL SPA (0,00 mg ALCALOIDES) · BOLSA B: TORUNDA COPA (ACONITINA)" style="width:100%;padding:0;text-align:left;border-radius:10px;overflow:hidden;border:var(--vg-border-specular);background:#020408;margin-bottom:12px;cursor:pointer;display:block;">
          <img src="imagenes/evidence/viales_toxicologia_final.jpg" alt="Frascos incautados y torunda de copa" width="960" height="540" decoding="async" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block;">
          <div class="mono" style="padding:7px 9px;font-size:0.72rem;color:#FDE68A;">[Toca para ampliar] BOLSA A: FRASCOS SPA (0,00 mg) · BOLSA B: TORUNDA (ACONITINA)</div>
        </button>
        <ul class="clue-list" style="font-size:0.8rem;">
          <li><strong>Álvaro Roldán:</strong> Coartada <strong>CONFIRMADA</strong> — el director financiero en Madrid valida videollamada y firma facial en directo a las 23:39:14 h.</li>
          <li><strong>Paula Mendoza:</strong> Coartada <strong>CONFIRMADA</strong> — dos huéspedes (Hab. 203 y 205) certifican masaje continuo con ambos brazos entre 23:25 y 23:50 h. Sus frascos del Día 8 solo contenían romero y árnica inocuos.</li>
          <li><strong>Carmen Ibáñez:</strong> Coartada <strong>ROTA</strong> — ningún testigo la vio entre 23:32 y 23:46 h y desconectó manualmente la cámara del pasillo de Planta 1 a las 23:36 h, minutos antes del apagón para verter aconitina en la copa.</li>
        </ul>
      </div>`;
  }

  return { render, renderFinalShowdown };
})();
