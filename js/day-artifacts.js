/**
 * ADVIENTO CERO — MATERIALES VISUALES REALISTAS POR DÍA Y TERMINAL (48 VISTAS)
 * -----------------------------------------------------------------------------
 * Genera planos arquitectónicos, tickets térmicos, capturas de chat, documentos
 * bancarios, escáneres de rayos X, tarjetas RFID, partituras y partes oficiales
 * sin alterar la dificultad ni los hashes de validación.
 */

window.DayArtifacts = (() => {
  function render(dayNum, role) {
    const key = `${dayNum}-${role}`;
    switch (key) {
      // === DÍA 1 ===
      case "1-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">PLANO ARQUITECTÓNICO · SALÓN MIRADOR (23:36 H)</div>
            <svg viewBox="0 0 320 190" style="width:100%;display:block;border-radius:8px;background:#031019;">
              <rect x="12" y="12" width="296" height="166" fill="none" stroke="#38BDF8" stroke-width="1.5"/>
              <!-- Brújula -->
              <text x="160" y="27" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="9">NORTE (CHIMENEA)</text>
              <text x="160" y="170" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="9">SUR (ACCESO HALL)</text>
              <text x="22" y="98" fill="#94A3B8" font-family="monospace" font-size="9" transform="rotate(-90 22 98)">OESTE</text>
              <text x="298" y="98" fill="#FDE68A" font-family="monospace" font-size="9" transform="rotate(90 298 98)">VENTANAL ESTE</text>
              <!-- Abeto central -->
              <circle cx="160" cy="95" r="16" fill="rgba(16,185,129,0.22)" stroke="#34D399" stroke-width="1.5"/>
              <text x="160" y="98" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="8">ABETO</text>
              <!-- 4 Mesas -->
              <circle cx="160" cy="52" r="14" fill="rgba(255,255,255,0.06)" stroke="#64748B"/><text x="160" y="55" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="9">M1</text>
              <circle cx="76" cy="95" r="14" fill="rgba(255,255,255,0.06)" stroke="#64748B"/><text x="76" y="98" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="9">M2</text>
              <circle cx="160" cy="138" r="14" fill="rgba(255,255,255,0.06)" stroke="#64748B"/><text x="160" y="141" text-anchor="middle" fill="#CBD5E1" font-family="monospace" font-size="9">M3</text>
              <circle cx="244" cy="95" r="15" fill="rgba(220,38,38,0.32)" stroke="#FBBF24" stroke-width="2"/><text x="244" y="98" text-anchor="middle" fill="#FEF3C7" font-family="monospace" font-size="9" font-weight="700">M4</text>
              <!-- Destello -->
              <polygon points="274,78 279,90 292,90 281,97 285,109 274,101 263,109 267,97 256,90 269,90" fill="#FDE047" opacity="0.85"/>
              <text x="244" y="122" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="8">FLASH 23:36</text>
            </svg>
          </div>
          <div class="cctv-frame">
            <img src="imagenes/scene-lobby.jpg" alt="Salón Mirador" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">
            <div class="cctv-hud"><span>INSPECCIÓN OCULAR · SALÓN MIRADOR</span><span>REF: ESCENA-01</span></div>
          </div>`;
      case "1-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>PROTOCOLO DE MESA 4 · GALA ADVIENTO</span><span class="paper-stamp">VERIFICADO</span></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Silla 1</strong><br>Álvaro Roldán<br><span style="font-size:0.7rem;color:#78716C;">Suite 303</span></div>
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Silla 2</strong><br>Teresa Alarcón<br><span style="font-size:0.7rem;color:#78716C;">Hab. 202</span></div>
              <div style="padding:8px;border:2px solid #B91C1C;border-radius:6px;background:#FEF2F2;"><strong>Silla 3 · PRENSA</strong><br>Óscar Llorente<br><span style="font-size:0.72rem;color:#B91C1C;font-weight:700;">Hab. 108 · Porche E</span></div>
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Silla 4</strong><br>Diego Aranda<br><span style="font-size:0.7rem;color:#78716C;">Hab. 201</span></div>
            </div>
          </div>`;

      // === DÍA 2 ===
      case "2-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">MUESTRA #B-02 · BANDEJA DE CRISTAL DE BARRA</div>
            <p style="font-size:0.76rem;color:#CBD5E1;">Soporte recogido junto al grifo de cerveza. Utiliza el haz UV 365 nm inferior sobre toda la superficie para revelar tinta reactiva invisible.</p>
          </div>`;
      case "2-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>CUADRANTE NOCTURNO · BARRA PRINCIPAL</span><span class="paper-stamp">30 NOV</span></div>
            <table style="width:100%;border-collapse:collapse;font-size:0.75rem;">
              <tr style="border-bottom:1px solid rgba(180,83,9,0.25);text-align:left;"><th>Turno</th><th>Empleado</th><th>Incidencia 23:34–23:44</th></tr>
              <tr style="border-bottom:1px solid rgba(180,83,9,0.18);"><td>#2</td><td>Sala Aux.</td><td>Servicio mesas sur</td></tr>
              <tr style="background:#FEE2E2;font-weight:700;"><td>#5</td><td>Nicolás Ferrer</td><td>Almacén frigorífico hielo</td></tr>
            </table>
          </div>`;

      // === DÍA 3 ===
      case "3-miguel":
        return `
          <div class="bank-slip" style="margin-bottom:10px;">
            <div style="color:#FDE68A;margin-bottom:6px;font-weight:700;">CONSOLA CENTRALITA · REGISTRO 23:39:08 H</div>
            <div class="bank-row"><span>CANAL EMERGENCIA</span><span>PULSADOR INTERIOR</span></div>
            <div class="bank-row"><span>TRAMA CAPTADA</span><span>3 CARACTERES MORSE</span></div>
          </div>`;
      case "3-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>DIRECTORIO DE EXTENSIONES Y TABLA MORSE</span><span class="paper-stamp">CONSERJERÍA</span></div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-family:monospace;font-size:0.74rem;margin-bottom:8px;">
              <div style="padding:5px;background:#FFFDF7;border:1px solid #D97706;border-radius:5px;">S: · · ·</div>
              <div style="padding:5px;background:#FFFDF7;border:1px solid #D97706;border-radius:5px;">O: − − −</div>
              <div style="padding:5px;background:#FFFDF7;border:1px solid #D97706;border-radius:5px;">T: −</div>
              <div style="padding:5px;background:#FFFDF7;border:1px solid #D97706;border-radius:5px;">A: · −</div>
              <div style="padding:5px;background:#FFFDF7;border:1px solid #D97706;border-radius:5px;">G: − − ·</div>
              <div style="padding:5px;background:#FFFDF7;border:1px solid #D97706;border-radius:5px;">R: · − ·</div>
            </div>
            <div style="font-family:monospace;font-size:0.75rem;border-top:1px dashed #B45309;padding-top:6px;">
              <strong>RONDAS (Tomás Bermúdez):</strong> SOT = Ext. <strong>04</strong> · AZO = Ext. <strong>09</strong> · GAR = Ext. <strong>12</strong>
            </div>
          </div>`;

      // === DÍA 4 ===
      case "4-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ARMARIO MAESTRO LAVANDERÍA · PANEL SUPERIOR (F1–F2)</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Tapa inferior bloqueada. Comparte tus dígitos fijos (F1C1=1, F2C2=4, F2C4=2) con Patri.</div>
          </div>`;
      case "4-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>PARTE DE GOBERNANTA · CIERRE 23:25 H</span><span class="paper-stamp">PRECINTADO</span></div>
            <div>Titular: <strong>Marta Quiroga</strong>. Código de cierre basado en cuadrante inferior (F3–F4) cruzado con el panel de Miguel.</div>
          </div>`;

      // === DÍA 5 ===
      case "5-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">PLANO PLANTA 2 · ANTENAS RFID (23:30–23:45 H)</div>
            <svg viewBox="0 0 320 110" style="width:100%;display:block;border-radius:8px;background:#031019;">
              <rect x="10" y="18" width="300" height="74" fill="none" stroke="#38BDF8" stroke-width="1.2"/>
              <rect x="20" y="28" width="60" height="54" fill="rgba(255,255,255,0.04)" stroke="#475569"/><text x="50" y="54" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="8">PASILLO</text><text x="50" y="65" text-anchor="middle" fill="#64748B" font-family="monospace" font-size="7">23:31 A1</text>
              <rect x="90" y="28" width="60" height="54" fill="rgba(255,255,255,0.04)" stroke="#475569"/><text x="120" y="54" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="8">ASCENSOR</text><text x="120" y="65" text-anchor="middle" fill="#64748B" font-family="monospace" font-size="7">23:34 B4</text>
              <rect x="160" y="28" width="70" height="54" fill="rgba(16,185,129,0.22)" stroke="#34D399" stroke-width="1.8"/><text x="195" y="50" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="8" font-weight="700">BIBLIOTECA</text><text x="195" y="63" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="8">23:39 TAG-C7</text>
              <rect x="240" y="28" width="60" height="54" fill="rgba(255,255,255,0.04)" stroke="#475569"/><text x="270" y="54" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="8">ESC. NORTE</text><text x="270" y="65" text-anchor="middle" fill="#64748B" font-family="monospace" font-size="7">23:43 D2</text>
            </svg>
          </div>`;
      case "5-patri":
        return `
          <div class="rfid-cards-grid">
            <div class="rfid-card"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#FDE68A;">TAG-A1</strong><span style="font-size:0.74rem;">Diego Aranda</span></div>
            <div class="rfid-card"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#FDE68A;">TAG-B4</strong><span style="font-size:0.74rem;">Álvaro Roldán</span></div>
            <div class="rfid-card" style="border-color:#34D399;"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#6EE7B7;">TAG-C7</strong><span style="font-size:0.74rem;">Lucía Montalvo (Hab. 204)</span></div>
            <div class="rfid-card"><div class="rfid-chip"></div><strong class="mono" style="font-size:0.78rem;color:#FDE68A;">TAG-D2</strong><span style="font-size:0.74rem;">Gabriel Serrano</span></div>
          </div>`;

      // === DÍA 6 ===
      case "6-miguel":
        return `
          <div class="paper-ledger" style="margin-bottom:10px;">
            <div class="paper-ledger-head"><span>NOTA HALLADA EN PERCHERO</span><span class="paper-stamp">CIFRADO</span></div>
            <div class="mono" style="font-size:1.15rem;font-weight:700;letter-spacing:0.16em;text-align:center;padding:8px;color:#7F1D1D;">FDPHULQR VXU</div>
          </div>`;
      case "6-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>PARTITURA · «NOCHE DE PAZ» (COMPÁS 3/4)</span><span class="paper-stamp">GALA</span></div>
            <svg viewBox="0 0 300 72" style="width:100%;display:block;background:#FFFDF7;border-radius:6px;">
              <line x1="12" y1="22" x2="288" y2="22" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="30" x2="288" y2="30" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="38" x2="288" y2="38" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="46" x2="288" y2="46" stroke="#78716C" stroke-width="1"/>
              <line x1="12" y1="54" x2="288" y2="54" stroke="#78716C" stroke-width="1"/>
              <circle cx="52" cy="38" r="5" fill="#1C1917"/><line x1="57" y1="38" x2="57" y2="16" stroke="#1C1917" stroke-width="1.5"/>
              <circle cx="96" cy="34" r="5" fill="#1C1917"/><line x1="101" y1="34" x2="101" y2="14" stroke="#1C1917" stroke-width="1.5"/>
              <circle cx="140" cy="42" r="5" fill="#1C1917"/><line x1="145" y1="42" x2="145" y2="20" stroke="#1C1917" stroke-width="1.5"/>
              <!-- 3 estrellas doradas dibujadas -->
              <polygon points="222,12 225,18 231,19 226,23 227,29 222,26 217,29 218,23 213,19 219,18" fill="#D97706"/>
              <polygon points="248,12 251,18 257,19 252,23 253,29 248,26 243,29 244,23 239,19 245,18" fill="#D97706"/>
              <polygon points="274,12 277,18 283,19 278,23 279,29 274,26 269,29 270,23 265,19 271,18" fill="#D97706"/>
            </svg>
          </div>`;

      // === DÍA 7 ===
      case "7-miguel":
        return `
          <div class="bank-slip" style="margin-bottom:10px;">
            <div style="color:#7DD3FC;font-weight:700;margin-bottom:6px;">ATESTADOS ANONIMIZADOS · 23:40 H</div>
            <div class="bank-row"><span>ALFA</span><span>Dormido desde 23:00 h</span></div>
            <div class="bank-row"><span style="color:#FDE68A;">BETA</span><span>Wi-Fi Estudio Diseño 23:25–23:52</span></div>
            <div class="bank-row"><span>GAMMA</span><span>Reloj Sala Billar 23:40 h</span></div>
            <div class="bank-row"><span>DELTA</span><span>Jardín interior</span></div>
          </div>`;
      case "7-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">AUDITORÍA IT + RELOJ DE PIE AVERIADO</div>
            <div style="display:flex;align-items:center;gap:14px;">
              <svg width="74" height="74" viewBox="0 0 80 80" style="flex-shrink:0;">
                <circle cx="40" cy="40" r="34" fill="#0F172A" stroke="#FBBF24" stroke-width="2.5"/>
                <line x1="40" y1="40" x2="24" y2="50" stroke="#F87171" stroke-width="3" stroke-linecap="round"/>
                <line x1="40" y1="40" x2="62" y2="40" stroke="#FDE68A" stroke-width="2" stroke-linecap="round"/>
                <text x="40" y="64" text-anchor="middle" fill="#FDA4AF" font-family="monospace" font-size="8">20:15 PARADO</text>
              </svg>
              <div style="font-size:0.77rem;color:#E2E8F0;line-height:1.45;">
                <strong>Router Estudio Diseño:</strong><br>Tráfico continuo 23:25–23:52 h desde portátil de <strong>Diego Aranda (Ficha Nº 12)</strong>.
              </div>
            </div>
          </div>`;

      // === DÍA 8 ===
      case "8-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">BÁSCULAS DE PRECISIÓN #1 Y #2</div>
            <svg viewBox="0 0 300 84" style="width:100%;display:block;">
              <rect x="8" y="8" width="136" height="68" rx="8" fill="#061814" stroke="#34D399"/>
              <text x="76" y="28" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="10">2 ANÍS + 1 CANELA</text>
              <rect x="34" y="38" width="84" height="26" rx="4" fill="#020617" stroke="#38BDF8"/>
              <text x="76" y="55" text-anchor="middle" fill="#67E8F9" font-family="monospace" font-size="13" font-weight="700">19.0 g</text>
              <rect x="156" y="8" width="136" height="68" rx="8" fill="#061814" stroke="#FBBF24"/>
              <text x="224" y="28" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="10">1 ANÍS + 2 CLAVO</text>
              <rect x="182" y="38" width="84" height="26" rx="4" fill="#020617" stroke="#38BDF8"/>
              <text x="224" y="55" text-anchor="middle" fill="#67E8F9" font-family="monospace" font-size="13" font-weight="700">13.0 g</text>
            </svg>
          </div>`;
      case "8-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>BÁSCULA #3 Y RECETA DE INFUSIÓN SPA</span><span class="paper-stamp">PAULA MENDOZA</span></div>
            <div class="mono" style="padding:8px;background:#FFFDF7;border:1px solid #D97706;border-radius:6px;margin-bottom:6px;text-align:center;font-weight:700;">
              3 CANELA = 15.0 g
            </div>
            <div style="font-size:0.78rem;">Mezcla de control: <strong>2 Anís + 3 Clavo + 1 Canela = ? g</strong></div>
          </div>`;

      // === DÍA 9 ===
      case "9-miguel":
        return `
          <div class="cctv-frame" style="margin-bottom:8px;">
            <div class="cctv-hud" style="position:relative;background:#031019;padding:8px 10px;border-bottom:1px solid rgba(56,189,248,0.3);">
              <span>CAM-04 NORTE (TELEFÉRICO) · REC</span><span>30/11 23:41:18 · -11 °C · M.S.</span>
            </div>
          </div>`;
      case "9-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">TECLADO ELECTRÓNICO CABAÑA NORTE · 23:41 H</div>
            <div class="safe-screen">4 - 8 - 1 - 9</div>
            <div style="font-size:0.74rem;color:#CBD5E1;text-align:center;">Acceso verificado junto a la cámara B tras despejar el hielo de la polea.</div>
          </div>`;

      // === DÍA 10 ===
      case "10-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ESQUEMA HIDRÁULICO · SÓTANO CALDERAS</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Introduce debajo el código de circuito averiado que aparece en rojo en la terminal de Patri.</div>
          </div>`;
      case "10-patri":
        return `
          <div class="blueprint-box" style="border-color:rgba(248,113,113,0.6);">
            <div class="blueprint-cap" style="color:#FECACA;">ALERTA ROJA EN PANEL · CIRCUITO C-7</div>
            <div style="font-size:0.76rem;color:#E2E8F0;">Comunica <strong>C-7</strong> a Miguel y pulsa V1–V4 según sus instrucciones.</div>
          </div>`;

      // === DÍA 11 ===
      case "11-miguel":
        return `
          <div class="paper-receipt torn-right">
            <div style="font-weight:700;border-bottom:1px dashed #94A3B8;padding-bottom:4px;margin-bottom:6px;">HOTEL VENTISQUERO · TPV #01</div>
            <div>FECHA: 30/11/2026 &nbsp; HORA: <strong>23:38</strong></div>
            <div style="margin-top:6px;">L1 ...................... 24,00 EUR</div>
            <div>L2 ...................... <strong>4,50 EUR</strong></div>
            <div style="border-top:1px solid #0F172A;margin-top:6px;padding-top:4px;font-weight:700;">TOTAL COBRADO: 28,50 EUR</div>
          </div>`;
      case "11-patri":
        return `
          <div class="paper-receipt torn-left">
            <div style="font-weight:700;border-bottom:1px dashed #94A3B8;padding-bottom:4px;margin-bottom:6px;">... COPIA CLIENTE / BARRA</div>
            <div>OPERACIÓN TARJETA CONFIRMADA</div>
            <div style="margin-top:6px;">2x WHISKY RESERVA · MESA 03</div>
            <div>1x CAFÉ SOLO · <strong>MESA 08</strong></div>
            <div style="border-top:1px solid #0F172A;margin-top:6px;padding-top:4px;font-weight:700;">TITULAR: MARCOS TEJADA</div>
          </div>`;

      // === DÍA 12 ===
      case "12-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">NONOGRAMA 5x5 · PISTAS DE FILAS (ARRIBA → ABAJO)</div>
            <div style="display:flex;justify-content:center;gap:8px;font-family:monospace;font-size:0.8rem;color:#FDE68A;">
              <span>F1: 3</span><span>F2: 1,1</span><span>F3: 5</span><span>F4: 1,1</span><span>F5: 1,1</span>
            </div>
          </div>`;
      case "12-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>PISTAS COLUMNAS + SALAS DE ARTE</span><span class="paper-stamp">ELENA VALLS</span></div>
            <div class="mono" style="font-size:0.76rem;margin-bottom:6px;">C1: 4 | C2: 1,1 | C3: 1,1 | C4: 1,1 | C5: 4</div>
            <div style="font-size:0.75rem;"><strong>A</strong>rchivo Histórico (Cód. 19) · <strong>B</strong>iblioteca (Cód. 05) · <strong>C</strong>apilla (Cód. 23)</div>
          </div>`;

      // === DÍA 13 ===
      case "13-miguel":
        return `
          <div class="chat-thread">
            <div class="chat-bubble in">[Msg 1] Torre a Gabriel: el temporal empeora, viento &gt; 90 km/h.</div>
            <div class="chat-bubble gap">[Msg 2 · Ver terminal de Patri]</div>
            <div class="chat-bubble out">[Msg 3] Gabriel: estoy en hangar atando palas y activando baliza <strong>HEL-902</strong>.</div>
            <div class="chat-bubble gap">[Msg 4 · Ver terminal de Patri]</div>
            <div class="chat-bubble out">[Msg 5] Gabriel: imposible acercarme al hotel hasta que pare la ventisca.</div>
            <div class="chat-bubble gap">[Msg 6 · Ver hora en terminal de Patri]</div>
          </div>`;
      case "13-patri":
        return `
          <div class="chat-thread">
            <div class="chat-bubble gap">[Msg 1 · Ver terminal de Miguel]</div>
            <div class="chat-bubble in">[Msg 2] Torre: confirma si puedes despegar antes de medianoche.<span class="chat-time">23:31</span></div>
            <div class="chat-bubble gap">[Msg 3 · Ver código baliza en Miguel]</div>
            <div class="chat-bubble in">[Msg 4] Torre: anota tu código de baliza para el radar militar.<span class="chat-time">23:34</span></div>
            <div class="chat-bubble gap">[Msg 5 · Ver terminal de Miguel]</div>
            <div class="chat-bubble in">[Msg 6] Torre: baliza confirmada en radar a las <strong>23:37</strong>.<span class="chat-time">23:37</span></div>
          </div>`;

      // === DÍA 14 ===
      case "14-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">RADAR WI-FI NORTE · PASILLO PLANTA 2</div>
            <svg viewBox="0 0 320 104" style="width:100%;display:block;border-radius:8px;background:#031019;">
              ${[201,202,203,204,205,206,207].map((num, idx) => {
                const x = 14 + idx * 42;
                const hit = num === 204 || num === 205;
                return `<rect x="${x}" y="30" width="38" height="44" rx="4" fill="${hit ? "rgba(0,229,255,0.22)" : "rgba(255,255,255,0.04)"}" stroke="${hit ? "#00E5FF" : "#475569"}"/><text x="${x+19}" y="56" text-anchor="middle" fill="${hit ? "#67E8F9" : "#94A3B8"}" font-family="monospace" font-size="10">${num}</text>`;
              }).join("")}
              <circle cx="117" cy="22" r="5" fill="#00E5FF"/><text x="117" y="14" text-anchor="middle" fill="#67E8F9" font-family="monospace" font-size="8">REPETIDOR NORTE (203)</text>
            </svg>
          </div>`;
      case "14-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">RADAR WI-FI SUR · PASILLO PLANTA 2</div>
            <svg viewBox="0 0 320 104" style="width:100%;display:block;border-radius:8px;background:#031019;">
              ${[201,202,203,204,205,206,207].map((num, idx) => {
                const x = 14 + idx * 42;
                const hit = num === 205 || num === 206;
                return `<rect x="${x}" y="30" width="38" height="44" rx="4" fill="${hit ? "rgba(251,191,36,0.22)" : "rgba(255,255,255,0.04)"}" stroke="${hit ? "#FBBF24" : "#475569"}"/><text x="${x+19}" y="56" text-anchor="middle" fill="${hit ? "#FDE68A" : "#94A3B8"}" font-family="monospace" font-size="10">${num}</text>`;
              }).join("")}
              <circle cx="285" cy="22" r="5" fill="#FBBF24"/><text x="255" y="14" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="8">REPETIDOR SUR (207)</text>
            </svg>
          </div>`;

      // === DÍA 15 ===
      case "15-miguel":
        return `
          <div class="paper-ledger" style="background:linear-gradient(145deg,#92400E,#78350F);color:#FEF3C7;border:2px solid #FBBF24;text-align:center;">
            <div class="mono" style="font-size:0.72rem;letter-spacing:0.14em;">PLACA DE LATÓN · RECEPCIÓN</div>
            <div class="serif" style="font-size:1.15rem;font-weight:700;margin:4px 0;">HOTEL MIRADOR DEL VENTISQUERO</div>
            <div class="mono" style="font-size:0.9rem;font-weight:700;color:#FDE047;">FUNDADO EN 1987 · 3 PLANTAS HUÉSPEDES</div>
          </div>`;
      case "15-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">CROQUIS ARQUITECTÓNICO · CHIMENEAS SALÓN</div>
            <svg viewBox="0 0 300 78" style="width:100%;display:block;background:#031019;border-radius:8px;">
              <rect x="20" y="14" width="260" height="50" fill="none" stroke="#FBBF24" stroke-width="1.2"/>
              <rect x="55" y="14" width="44" height="14" fill="rgba(220,38,38,0.45)" stroke="#F87171"/><text x="77" y="44" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="9">CHIMENEA 1</text>
              <rect x="201" y="14" width="44" height="14" fill="rgba(220,38,38,0.45)" stroke="#F87171"/><text x="223" y="44" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="9">CHIMENEA 2</text>
            </svg>
          </div>`;

      // === DÍA 16 ===
      case "16-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ESPECTROGRAMA BUZÓN SATELITAL · 23:35–23:48</div>
            <svg viewBox="0 0 300 54" style="width:100%;display:block;background:#020617;border-radius:6px;">
              ${Array.from({ length: 30 }, (_, i) => {
                const h = 8 + ((i * 19) % 34);
                return `<rect x="${6 + i * 9.6}" y="${48 - h}" width="5" height="${h}" rx="2" fill="${i === 14 ? "#00E5FF" : "#1E293B"}"/>`;
              }).join("")}
            </svg>
          </div>`;
      case "16-patri":
        return `
          <div class="bank-slip">
            <div style="color:#67E8F9;font-weight:700;margin-bottom:6px;">INFORME ANTENA SATELITAL INMARSAT</div>
            <div class="bank-row"><span>TERMINAL</span><span>SUITE 305 (SOFÍA NAVARRO)</span></div>
            <div class="bank-row"><span>BANDA ÓPTIMA</span><span style="color:#FDE68A;font-weight:700;">440 Hz</span></div>
          </div>`;

      // === DÍA 17 ===
      case "17-miguel":
      case "17-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>HOJA DE SERVICIO NOCTURNO · COMEDOR</span><span class="paper-stamp">23:30–23:50</span></div>
            <div>Usa la parrilla interactiva inferior cruzando vuestras 4 pistas hasta fijar la ubicación y hora de <strong>Héctor Salgado</strong>.</div>
          </div>`;

      // === DÍA 18 ===
      case "18-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">SUELA VIBRAM-ALPINE · ESCANEO EN NIEVE</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Desliza el calibre verde inferior hasta alinear el borde de la pisada en 25.5 cm.</div>
          </div>`;
      case "18-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>GUARDABOTAS RECEPCIÓN · TAQUILLAS</span><span class="paper-stamp">30 NOV</span></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div style="padding:8px;border:1.5px solid #B91C1C;border-radius:6px;background:#FEF2F2;"><strong>Hab. 107 · Adriana Orozco</strong><br>Talla <strong>37</strong> · Secas 23:32 h</div>
              <div style="padding:8px;border:1px solid #D97706;border-radius:6px;background:#FFFDF7;"><strong>Hab. 203 · Elena Valls</strong><br>Talla 38 · En taquilla</div>
            </div>
          </div>`;

      // === DÍA 19 ===
      case "19-miguel":
        return `
          <div class="bank-slip">
            <div style="color:#7DD3FC;font-weight:700;margin-bottom:6px;">BANCA PRIVADA · TRANSFERENCIA SEPA</div>
            <div class="bank-row"><span>ORDENANTE</span><span>ÁLVARO ROLDÁN (SUITE 303)</span></div>
            <div class="bank-row"><span>HORA / IMPORTE</span><span>23:39:10 h · 45.000,00 EUR</span></div>
            <div class="bank-row"><span>TOKEN PARCIAL 1</span><span style="color:#FDE68A;font-weight:700;">RX-88</span></div>
          </div>`;
      case "19-patri":
        return `
          <div class="bank-slip" style="border-color:rgba(52,211,153,0.45);">
            <div style="color:#6EE7B7;font-weight:700;margin-bottom:6px;">CERTIFICADO BIOMÉTRICO FACIAL</div>
            <div class="bank-row"><span>IP ORIGEN</span><span>ROUTER SUITE 303 · 23:39:14 h</span></div>
            <div class="bank-row"><span>TOKEN PARCIAL 2</span><span style="color:#FDE68A;font-weight:700;">41-Z</span></div>
          </div>`;

      // === DÍA 20 ===
      case "20-miguel":
      case "20-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ESCÁNER PORTÁTIL DE EQUIPAJE · MALETÍN NORA</div>
            <svg viewBox="0 0 300 84" style="width:100%;display:block;background:#020617;border-radius:8px;">
              <rect x="24" y="14" width="252" height="56" rx="10" fill="none" stroke="${role === "miguel" ? "#38BDF8" : "#34D399"}" stroke-width="1.5" stroke-dasharray="5 3"/>
              ${role === "miguel"
                ? `<circle cx="96" cy="42" r="11" fill="none" stroke="#67E8F9" stroke-width="2.5"/><rect x="107" y="39" width="42" height="6" fill="#67E8F9"/><rect x="136" y="45" width="5" height="7" fill="#67E8F9"/><rect x="190" y="34" width="56" height="16" rx="8" fill="none" stroke="#38BDF8" stroke-width="2"/>`
                : `<rect x="76" y="24" width="24" height="36" rx="5" fill="rgba(16,185,129,0.28)" stroke="#34D399"/><rect x="114" y="24" width="24" height="36" rx="5" fill="rgba(16,185,129,0.28)" stroke="#34D399"/><rect x="166" y="28" width="76" height="28" rx="4" fill="rgba(251,191,36,0.18)" stroke="#FBBF24"/>`}
            </svg>
          </div>`;

      // === DÍA 21 ===
      case "21-miguel":
      case "21-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">ESCALERA Y PASILLO PLANTA 3 → SALA LECTURA PLANTA 2</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">Ordenad los 5 eventos entre las 23:30 y las 23:45 h para extraer los 5 dígitos en orden cronológico.</div>
          </div>`;

      // === DÍA 22 ===
      case "22-miguel":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">CUADRO ELÉCTRICO GENERAL · PLANTA 1 (DIRECCIÓN)</div>
            <div style="font-size:0.75rem;color:#CBD5E1;">El diferencial fue bajado manualmente a las 23:38 h desde el panel tras Dirección.</div>
          </div>`;
      case "22-patri":
        return `
          <div class="blueprint-box">
            <div class="blueprint-cap">PLANO CAPILLA ALPINA · SENSOR PUERTA CP</div>
            <svg viewBox="0 0 300 66" style="width:100%;display:block;background:#031019;border-radius:8px;">
              <rect x="20" y="12" width="260" height="42" rx="6" fill="rgba(16,185,129,0.12)" stroke="#34D399"/>
              <text x="150" y="31" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="9" font-weight="700">CAPILLA CP · PRESENCIA CONTINUA 23:25–23:50 H</text>
              <text x="150" y="45" text-anchor="middle" fill="#FDE68A" font-family="monospace" font-size="8">TERESA ALARCÓN · SIN SALIDAS DETECTADAS</text>
            </svg>
          </div>`;

      // === DÍA 23 ===
      case "23-miguel":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>BORRADOR MERCANTIL · ABRIGO VÍCTIMA</span><span class="paper-stamp">NOTARÍA</span></div>
            <div>Documento de firma prevista: <strong>01/12/2026</strong> · Referencia manuscrita: <strong>Protocolo Notarial Nº 774</strong>.</div>
          </div>`;
      case "23-patri":
        return `
          <div class="bank-slip">
            <div style="color:#FDE68A;font-weight:700;margin-bottom:6px;">SÁBANA OPERADORA BTS · SUITE 304</div>
            <div class="bank-row"><span>TITULAR</span><span>VALERIA DOMÍNGUEZ</span></div>
            <div class="bank-row"><span>LLAMADA SALIENTE</span><span>23:28 – 23:54 h (26 MIN)</span></div>
            <div class="bank-row"><span>CLAVE ANTENA</span><span style="color:#67E8F9;font-weight:700;">304V</span></div>
          </div>`;

      // === DÍA 24 ===
      case "24-miguel":
        return `
          <div class="bank-slip" style="border-color:rgba(248,113,113,0.6);">
            <div style="color:#FECACA;font-weight:700;margin-bottom:6px;">INFORME SECRIM Y CERRADURA HAB. 206</div>
            <div class="bank-row"><span>ALCALOIDE HALLADO</span><span style="color:#FDE68A;font-weight:700;">ACONITINA (ACÓNITO)</span></div>
            <div class="bank-row"><span>APERTURA HAB. 206 (18:15)</span><span style="color:#67E8F9;font-weight:700;">KEY-DIR-01</span></div>
          </div>`;
      case "24-patri":
        return `
          <div class="paper-ledger">
            <div class="paper-ledger-head"><span>REGISTRO SPA TERMAL + LLAVERO MAESTRO</span><span class="paper-stamp">NOCHEBUENA</span></div>
            <div><strong>Spa Termal 18:05–19:00 h:</strong> Firma presencial de <strong>Inés Casado</strong>.<br><strong>Llave KEY-DIR-01:</strong> Asignada en exclusiva a Dirección (Planta 1), sin copias.</div>
          </div>`;

      default:
        return "";
    }
  }

  return { render };
})();
