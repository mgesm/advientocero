/**
 * ADVIENTO CERO — 24 RITUALES CINEMATOGRÁFICOS DE APERTURA (V2.14)
 * Cada puerta del 1 al 24 posee su propio mecanismo SVG y firma sonora Web Audio.
 * Cero spoilers · Cero emojis · Respeta prefers-reduced-motion.
 */

window.DoorRituals = (() => {
  const CATALOG = [
    { day: 1, label: "Sello de lacre rojo", accent: "#EF4444", peakMs: 760 },
    { day: 2, label: "Barrido luz UV", accent: "#A78BFA", peakMs: 720 },
    { day: 3, label: "Lámpara telegráfica", accent: "#FBBF24", peakMs: 680 },
    { day: 4, label: "Llavín maestro", accent: "#FDE68A", peakMs: 780 },
    { day: 5, label: "Lector RFID", accent: "#34D399", peakMs: 780 },
    { day: 6, label: "Disco de cifrado", accent: "#F59E0B", peakMs: 820 },
    { day: 7, label: "Panel de 5 sensores", accent: "#38BDF8", peakMs: 820 },
    { day: 8, label: "Balanza analítica", accent: "#FBBF24", peakMs: 860 },
    { day: 9, label: "Obturador iris", accent: "#E2E8F0", peakMs: 720 },
    { day: 10, label: "Válvula y vapor", accent: "#F87171", peakMs: 760 },
    { day: 11, label: "Ticket térmico roto", accent: "#FDE68A", peakMs: 860 },
    { day: 12, label: "Matriz de microfichas", accent: "#78D7F2", peakMs: 800 },
    { day: 13, label: "Chats fragmentados", accent: "#78D7F2", peakMs: 780 },
    { day: 14, label: "Triangulación Wi-Fi", accent: "#FDE68A", peakMs: 820 },
    { day: 15, label: "Dial caja fuerte", accent: "#34D399", peakMs: 840 },
    { day: 16, label: "Sintonizador radio", accent: "#F59E0B", peakMs: 840 },
    { day: 17, label: "Parrilla lógica 3x3", accent: "#34D399", peakMs: 840 },
    { day: 18, label: "Huellas en escarcha", accent: "#93C5FD", peakMs: 760 },
    { day: 19, label: "Libro mayor 00:00", accent: "#FDE68A", peakMs: 820 },
    { day: 20, label: "Escáner Rayos X", accent: "#22D3EE", peakMs: 760 },
    { day: 21, label: "Reloj rebobinando", accent: "#FCA5A5", peakMs: 840 },
    { day: 22, label: "Pico de voltaje", accent: "#FBBF24", peakMs: 680 },
    { day: 23, label: "Sello forense", accent: "#EF4444", peakMs: 680 },
    { day: 24, label: "Bóveda de Nochebuena", accent: "#FDE68A", peakMs: 1620 }
  ];

  let activeCleanup = null;

  function esc(s) {
    if (window.PuzzleEngine?.escapeHtml) return window.PuzzleEngine.escapeHtml(s);
    return String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m]));
  }

  function makeShards(count, colors, delayStart = 480, spreadX = 94, spreadY = 82) {
    return Array.from({ length: count }, (_, i) => {
      const ang = (Math.PI * 2 * i) / count + (i % 2 === 0 ? 0.13 : -0.09);
      const dist = 48 + ((i * 23) % Math.max(24, spreadX));
      const sx = Math.round(Math.cos(ang) * dist);
      const sy = Math.round(Math.sin(ang) * (dist * (spreadY / spreadX)));
      const sr = (i % 2 === 0 ? 1 : -1) * (85 + ((i * 31) % 160));
      const sz = 3 + (i % 4);
      const dl = delayStart + ((i * 15) % 90);
      const sc = colors[i % colors.length];
      const br = i % 2 === 0 ? "50%" : "2px";
      return `<span class="cinema-shard" style="--sx:${sx}px;--sy:${sy}px;--sr:${sr}deg;--sz:${sz}px;--sc:${sc};--br:${br};--dl:${dl}ms;"></span>`;
    }).join("");
  }

  function buildWaxSealHalf(dayNum, uid) {
    const numStr = String(dayNum).padStart(2, "0");
    const clipPoly = uid === "tl"
      ? "0,0 144,0 122,22 96,46 89,58 70,72 60,86 44,96 22,122 0,144"
      : "144,0 144,144 0,144 22,122 44,96 60,86 70,72 89,58 96,46 122,22";
    return `
      <svg viewBox="0 0 144 144" width="164" height="164" aria-hidden="true">
        <defs>
          <clipPath id="waxClip_${uid}"><polygon points="${clipPoly}"/></clipPath>
          <radialGradient id="waxBody_${uid}" cx="36%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#FF5A5F"/>
            <stop offset="38%" stop-color="#DC2626"/>
            <stop offset="76%" stop-color="#991B1B"/>
            <stop offset="100%" stop-color="#580C0C"/>
          </radialGradient>
          <radialGradient id="waxInner_${uid}" cx="44%" cy="38%" r="60%">
            <stop offset="0%" stop-color="#B91C1C"/>
            <stop offset="72%" stop-color="#881313"/>
            <stop offset="100%" stop-color="#4C0A0A"/>
          </radialGradient>
          <linearGradient id="waxRim_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FECACA" stop-opacity="0.88"/>
            <stop offset="45%" stop-color="#EF4444" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#3B0606" stop-opacity="0.92"/>
          </linearGradient>
        </defs>
        <g clip-path="url(#waxClip_${uid})">
          <path d="M72 8 C84 6 97 11 107 18 C119 23 130 33 132 47 C138 59 138 75 133 88 C130 103 121 117 108 124 C95 133 80 137 65 135 C51 135 37 128 27 118 C16 108 9 94 10 79 C7 64 11 48 20 36 C28 23 41 14 55 11 C61 9 67 9 72 8 Z" fill="url(#waxBody_${uid})" stroke="url(#waxRim_${uid})" stroke-width="2.4"/>
          <circle cx="72" cy="72" r="51" fill="url(#waxInner_${uid})" stroke="#450A0A" stroke-width="2.6"/>
          <circle cx="72" cy="72" r="47.5" fill="none" stroke="rgba(254,226,226,0.34)" stroke-width="1.1"/>
          <circle cx="72" cy="72" r="43" fill="none" stroke="#FDE68A" stroke-opacity="0.82" stroke-width="1.35" stroke-dasharray="4 3"/>
          <path d="M35 50 A44 44 0 0 1 88 29" fill="none" stroke="rgba(255,241,242,0.48)" stroke-width="3" stroke-linecap="round"/>
          <polygon points="72,34 74.3,40.4 80.8,42.7 74.3,45 72,51.4 69.7,45 63.2,42.7 69.7,40.4" fill="#FEF08A"/>
          <text x="72" y="83" text-anchor="middle" fill="#FFFBEB" font-family="Georgia, 'Times New Roman', serif" font-size="36" font-weight="700" letter-spacing="1.5">${numStr}</text>
          <text x="72" y="97.5" text-anchor="middle" fill="#FDE68A" fill-opacity="0.94" font-family="ui-monospace, Consolas, monospace" font-size="7.1" font-weight="700" letter-spacing="2">DIC · UOPJ</text>
        </g>
      </svg>`;
  }

  function buildArenaHtml(dayNum) {
    switch (Number(dayNum)) {
      case 1:
        return `
          <div class="wax-seal-arena">
            <div class="wax-lantern-glow"></div>
            <div class="wax-half wax-half-tl">${buildWaxSealHalf(1, "tl")}</div>
            <div class="wax-half wax-half-br">${buildWaxSealHalf(1, "br")}</div>
            <svg class="wax-crack-svg" viewBox="0 0 144 144" aria-hidden="true">
              <path class="wax-crack-line" d="M 122 22 L 96 46 L 89 58 L 70 72 L 60 86 L 44 96 L 22 122" fill="none"/>
            </svg>
            ${makeShards(24, ["#EF4444", "#DC2626", "#FEF08A", "#F59E0B", "#FCA5A5"], 545, 86, 86)}
          </div>`;

      case 2:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(139,92,246,0.52);--rh-mid:rgba(56,189,248,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <defs>
                <clipPath id="r02Clip"><rect class="r02-reveal-rect" x="24" y="28" width="0" height="164"/></clipPath>
                <linearGradient id="r02BeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0"/>
                  <stop offset="48%" stop-color="#A78BFA" stop-opacity="0.44"/>
                  <stop offset="52%" stop-color="#E0E7FF" stop-opacity="0.88"/>
                  <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <rect x="26" y="34" width="188" height="152" rx="14" fill="#070C14" stroke="rgba(167,139,250,0.34)" stroke-width="1.4"/>
              <path d="M46 56 H194 M46 86 H194 M46 116 H194 M46 146 H194" stroke="rgba(148,163,184,0.12)" stroke-width="1"/>
              <g clip-path="url(#r02Clip)">
                <rect x="26" y="34" width="188" height="152" rx="14" fill="rgba(76,29,149,0.24)"/>
                <g class="r02-glow-spots">
                  <ellipse cx="74" cy="96" rx="22" ry="16" fill="rgba(167,139,250,0.26)" stroke="#C4B5FD" stroke-width="1.2" stroke-dasharray="3 3"/>
                  <circle cx="68" cy="92" r="5" fill="#67E8F9" opacity="0.85"/>
                  <circle cx="84" cy="105" r="3.2" fill="#C4B5FD" opacity="0.9"/>
                  <path d="M148 76 C162 72 178 86 174 104 C170 118 152 122 142 112 C134 102 136 82 148 76 Z" fill="rgba(56,189,248,0.20)" stroke="#7DD3FC" stroke-width="1.4"/>
                  <path d="M150 84 C160 82 168 92 165 102 C162 110 152 112 147 106" fill="none" stroke="#E0F2FE" stroke-width="1.1"/>
                  <circle cx="170" cy="140" r="6.5" fill="rgba(196,181,253,0.42)" stroke="#DDD6FE" stroke-width="1.1"/>
                  <circle cx="118" cy="146" r="3.5" fill="#67E8F9" opacity="0.8"/>
                  <text x="120" y="122" text-anchor="middle" fill="#E9D5FF" font-family="Georgia, serif" font-size="38" font-weight="700" style="filter:drop-shadow(0 0 10px #A855F7);">02</text>
                  <text x="120" y="166" text-anchor="middle" fill="#7DD3FC" font-family="ui-monospace, monospace" font-size="8.8" font-weight="700" letter-spacing="2.2">FLUORESCENCIA UV · 365 NM</text>
                </g>
              </g>
              <g class="r02-beam">
                <rect x="94" y="26" width="52" height="168" fill="url(#r02BeamGrad)"/>
                <line x1="120" y1="26" x2="120" y2="194" stroke="#F5F3FF" stroke-width="2" style="filter:drop-shadow(0 0 8px #A78BFA);"/>
              </g>
            </svg>
            ${makeShards(14, ["#A78BFA", "#67E8F9", "#E9D5FF"], 560, 82, 66)}
          </div>`;

      case 3:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(251,191,36,0.52);--rh-mid:rgba(245,158,11,0.20);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <defs>
                <radialGradient id="r03Bulb" cx="50%" cy="48%" r="50%">
                  <stop offset="0%" stop-color="#FFFBEB"/>
                  <stop offset="42%" stop-color="#FBBF24"/>
                  <stop offset="100%" stop-color="#B45309" stop-opacity="0"/>
                </radialGradient>
              </defs>
              <circle class="r03-wave-1" cx="120" cy="92" r="46" fill="none" stroke="#FDE68A" stroke-width="1.6"/>
              <circle class="r03-wave-2" cx="120" cy="92" r="56" fill="none" stroke="#F59E0B" stroke-width="1.8"/>
              <circle class="r03-wave-3" cx="120" cy="92" r="64" fill="none" stroke="#FDE68A" stroke-width="1.4"/>
              <circle class="r03-bulb-glow" cx="120" cy="92" r="54" fill="url(#r03Bulb)"/>
              <path d="M90 92 A30 30 0 1 1 150 92 C150 106 140 114 136 126 H104 C100 114 90 106 90 92 Z" fill="rgba(254,243,199,0.12)" stroke="#FDE68A" stroke-width="2"/>
              <path d="M108 110 L114 88 L120 99 L126 88 L132 110" fill="none" stroke="#FFFBEB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="104" y="126" width="32" height="14" rx="3" fill="#475569" stroke="#CBD5E1" stroke-width="1.2"/>
              <rect x="109" y="140" width="22" height="7" rx="2" fill="#334155"/>
              <rect x="44" y="162" width="152" height="30" rx="8" fill="rgba(9,16,24,0.88)" stroke="rgba(251,191,36,0.38)" stroke-width="1.2"/>
              <circle class="r03-sym r03-s1" cx="76" cy="177" r="4.8" fill="#94A3B8"/>
              <rect class="r03-sym r03-s2" x="94" y="172.5" width="28" height="9" rx="4.5" fill="#94A3B8"/>
              <circle class="r03-sym r03-s3" cx="138" cy="177" r="4.8" fill="#94A3B8"/>
              <circle class="r03-sym r03-s4" cx="162" cy="177" r="4.8" fill="#94A3B8"/>
              <text x="120" y="34" text-anchor="middle" fill="#FDE68A" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="2.2">CENTRALITA · 740 HZ · 03</text>
            </svg>
          </div>`;

      case 4:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(251,191,36,0.48);--rh-mid:rgba(52,211,153,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <circle cx="120" cy="110" r="68" fill="rgba(8,18,26,0.86)" stroke="rgba(251,191,36,0.45)" stroke-width="2"/>
              <circle cx="120" cy="110" r="54" fill="none" stroke="rgba(253,230,138,0.24)" stroke-width="1.2" stroke-dasharray="4 4"/>
              <circle class="r04-ring-ok" cx="120" cy="110" r="76" fill="none" stroke="#34D399" stroke-width="2.4"/>
              <rect class="r04-pin-1" x="115" y="47" width="10" height="16" rx="3" fill="#64748B"/>
              <rect class="r04-pin-2" x="167" y="105" width="16" height="10" rx="3" fill="#64748B"/>
              <rect class="r04-pin-3" x="115" y="157" width="10" height="16" rx="3" fill="#64748B"/>
              <rect class="r04-pin-4" x="57" y="105" width="16" height="10" rx="3" fill="#64748B"/>
              <g class="r04-key">
                <circle cx="120" cy="84" r="19" fill="none" stroke="#FDE68A" stroke-width="4.2"/>
                <circle cx="120" cy="84" r="10" fill="rgba(251,191,36,0.16)" stroke="#F59E0B" stroke-width="1.4"/>
                <text x="120" y="88" text-anchor="middle" fill="#FFFBEB" font-family="ui-monospace, monospace" font-size="10" font-weight="700">04</text>
                <rect x="116.5" y="102" width="7" height="52" rx="2.5" fill="#FDE68A"/>
                <rect x="123" y="131" width="12" height="5.5" rx="1.5" fill="#F59E0B"/>
                <rect x="123" y="142" width="15" height="6" rx="1.5" fill="#FDE68A"/>
              </g>
            </svg>
            ${makeShards(14, ["#FDE68A", "#34D399", "#F59E0B"], 680, 78, 78)}
          </div>`;

      case 5:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(52,211,153,0.44);--rh-mid:rgba(120,215,242,0.26);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <rect x="142" y="42" width="74" height="136" rx="14" fill="#0B1520" stroke="rgba(148,163,184,0.45)" stroke-width="1.8"/>
              <circle class="r05-led" cx="179" cy="64" r="6"/>
              <path d="M169 102 A14 14 0 0 1 189 102 M164 95 A22 22 0 0 1 194 95 M174 109 A6 6 0 0 1 184 109" fill="none" stroke="#78D7F2" stroke-width="2" stroke-linecap="round"/>
              <text x="179" y="156" text-anchor="middle" fill="#94A3B8" font-family="ui-monospace, monospace" font-size="8" font-weight="700" letter-spacing="1.4">RFID</text>
              <circle class="r05-rf-1" cx="146" cy="110" r="28" fill="none" stroke="#78D7F2" stroke-width="2"/>
              <circle class="r05-rf-2" cx="146" cy="110" r="40" fill="none" stroke="#34D399" stroke-width="1.6"/>
              <g class="r05-card">
                <rect x="24" y="68" width="118" height="76" rx="10" fill="#132333" stroke="#78D7F2" stroke-width="1.8"/>
                <rect x="34" y="82" width="22" height="16" rx="3" fill="#FDE68A" opacity="0.9"/>
                <line x1="34" y1="112" x2="112" y2="112" stroke="rgba(226,232,240,0.45)" stroke-width="2"/>
                <line x1="34" y1="123" x2="86" y2="123" stroke="rgba(120,215,242,0.55)" stroke-width="2"/>
                <text x="128" y="96" text-anchor="end" fill="#FFFBEB" font-family="Georgia, serif" font-size="20" font-weight="700">05</text>
              </g>
              <g class="r05-badge-ok">
                <rect x="52" y="182" width="136" height="22" rx="11" fill="rgba(16,185,129,0.22)" stroke="#34D399" stroke-width="1.2"/>
                <text x="120" y="196.5" text-anchor="middle" fill="#A7F3D0" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="1.8">ACCESO AUTORIZADO</text>
              </g>
            </svg>
          </div>`;

      case 6: {
        const glyphs = "ADVIENTO06UOPJXZ".split("");
        const outerLabels = glyphs.map((g, idx) => {
          const ang = (idx * 360) / glyphs.length - 90;
          const rad = (ang * Math.PI) / 180;
          const x = (120 + Math.cos(rad) * 68).toFixed(1);
          const y = (110 + Math.sin(rad) * 68 + 3.5).toFixed(1);
          return `<text x="${x}" y="${y}" text-anchor="middle" fill="#CBD5E1" font-family="ui-monospace, monospace" font-size="9" font-weight="700">${g}</text>`;
        }).join("");
        const innerTicks = Array.from({ length: 16 }, (_, idx) => {
          const ang = (idx * 22.5 * Math.PI) / 180;
          const x1 = (120 + Math.cos(ang) * 44).toFixed(1);
          const y1 = (110 + Math.sin(ang) * 44).toFixed(1);
          const x2 = (120 + Math.cos(ang) * 51).toFixed(1);
          const y2 = (110 + Math.sin(ang) * 51).toFixed(1);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F59E0B" stroke-width="1.4"/>`;
        }).join("");
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(245,158,11,0.48);--rh-mid:rgba(253,230,138,0.20);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <g class="r06-outer">
                <circle cx="120" cy="110" r="82" fill="rgba(10,18,28,0.88)" stroke="#94A3B8" stroke-width="1.8"/>
                <circle cx="120" cy="110" r="57" fill="none" stroke="rgba(253,230,138,0.35)" stroke-width="1.2"/>
                ${outerLabels}
              </g>
              <g class="r06-inner">
                <circle cx="120" cy="110" r="53" fill="rgba(30,22,12,0.85)" stroke="#F59E0B" stroke-width="1.8"/>
                ${innerTicks}
                <circle cx="120" cy="110" r="32" fill="#09131C" stroke="#FDE68A" stroke-width="1.5"/>
                <text x="120" y="119" text-anchor="middle" fill="#FFFBEB" font-family="Georgia, serif" font-size="28" font-weight="700">06</text>
              </g>
              <rect class="r06-sight" x="106" y="24" width="28" height="36" rx="6" fill="rgba(251,191,36,0.16)" stroke="#FDE68A" stroke-width="2.2"/>
            </svg>
          </div>`;
      }

      case 7:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(56,189,248,0.40);--rh-mid:rgba(239,68,68,0.26);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <rect x="16" y="48" width="208" height="124" rx="14" fill="rgba(7,15,24,0.9)" stroke="rgba(120,215,242,0.34)" stroke-width="1.5"/>
              <line x1="42" y1="104" x2="198" y2="104" stroke="rgba(148,163,184,0.35)" stroke-width="2.2" stroke-dasharray="5 4"/>
              <line class="r07-scan" x1="30" y1="56" x2="30" y2="164" stroke="#78D7F2" stroke-width="2.4" style="filter:drop-shadow(0 0 8px #38BDF8);"/>
              <circle class="r07-alert-ring" cx="198" cy="104" r="18" fill="none" stroke="#EF4444" stroke-width="2.2"/>
              <circle class="r07-n1" cx="42" cy="104" r="10" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
              <circle class="r07-n2" cx="81" cy="104" r="10" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
              <circle class="r07-n3" cx="120" cy="104" r="10" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
              <circle class="r07-n4" cx="159" cy="104" r="10" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
              <circle class="r07-n5" cx="198" cy="104" r="10" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
              <text x="42" y="132" text-anchor="middle" fill="#94A3B8" font-family="ui-monospace, monospace" font-size="8.5">S1</text>
              <text x="81" y="132" text-anchor="middle" fill="#94A3B8" font-family="ui-monospace, monospace" font-size="8.5">S2</text>
              <text x="120" y="132" text-anchor="middle" fill="#94A3B8" font-family="ui-monospace, monospace" font-size="8.5">S3</text>
              <text x="159" y="132" text-anchor="middle" fill="#94A3B8" font-family="ui-monospace, monospace" font-size="8.5">S4</text>
              <text x="198" y="132" text-anchor="middle" fill="#FCA5A5" font-family="ui-monospace, monospace" font-size="8.5" font-weight="700">S5</text>
              <text x="120" y="74" text-anchor="middle" fill="#78D7F2" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="2">BARRIDO DE PRESENCIA · 07</text>
              <text x="120" y="156" text-anchor="middle" fill="#FDA4AF" font-family="ui-monospace, monospace" font-size="8.2" letter-spacing="1.6">5 SENSORES · 6 COARTADAS</text>
            </svg>
          </div>`;

      case 8:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(251,191,36,0.48);--rh-mid:rgba(220,38,38,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <path d="M88 184 H152 L140 170 H100 Z" fill="#1E293B" stroke="#FDE68A" stroke-width="1.6"/>
              <line x1="120" y1="54" x2="120" y2="170" stroke="#FDE68A" stroke-width="3"/>
              <circle cx="120" cy="54" r="6" fill="#F59E0B" stroke="#FFFBEB" stroke-width="1.4"/>
              <path class="r08-drop-1" d="M178 44 C178 44 184 53 184 57 A6 6 0 1 1 172 57 C172 53 178 44 178 44 Z" fill="#F59E0B"/>
              <path class="r08-drop-2" d="M178 44 C178 44 184 53 184 57 A6 6 0 1 1 172 57 C172 53 178 44 178 44 Z" fill="#EF4444"/>
              <g class="r08-beam-group">
                <line x1="56" y1="84" x2="184" y2="84" stroke="#FDE68A" stroke-width="3.2" stroke-linecap="round"/>
                <line x1="62" y1="84" x2="46" y2="132" stroke="rgba(253,230,138,0.65)" stroke-width="1.2"/>
                <line x1="62" y1="84" x2="78" y2="132" stroke="rgba(253,230,138,0.65)" stroke-width="1.2"/>
                <path d="M40 132 Q62 148 84 132 Z" fill="rgba(251,191,36,0.24)" stroke="#FDE68A" stroke-width="1.6"/>
                <line x1="178" y1="84" x2="162" y2="132" stroke="rgba(253,230,138,0.65)" stroke-width="1.2"/>
                <line x1="178" y1="84" x2="194" y2="132" stroke="rgba(253,230,138,0.65)" stroke-width="1.2"/>
                <path d="M156 132 Q178 148 200 132 Z" fill="rgba(239,68,68,0.28)" stroke="#FDE68A" stroke-width="1.6"/>
                <polygon points="120,84 116,104 124,104" fill="#FDE68A"/>
              </g>
              <g class="r08-zero-glow">
                <rect x="86" y="189" width="68" height="20" rx="10" fill="rgba(251,191,36,0.2)" stroke="#FDE68A" stroke-width="1.2"/>
                <text x="120" y="202.5" text-anchor="middle" fill="#FEF3C7" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="1.4">0.00 G · 08</text>
              </g>
            </svg>
          </div>`;

      case 9: {
        const blades = Array.from({ length: 6 }, (_, i) => {
          const rot = i * 60;
          return `<path d="M120 56 L158 82 L132 114 L106 78 Z" fill="rgba(30,41,59,0.92)" stroke="#CBD5E1" stroke-width="1.3" transform="rotate(${rot} 120 116)"/>`;
        }).join("");
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(241,245,249,0.52);--rh-mid:rgba(120,215,242,0.24);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <defs><clipPath id="r09Lens"><circle cx="120" cy="116" r="62"/></clipPath></defs>
              <path d="M26 42 V22 H46 M194 22 H214 V42 M214 178 V198 H194 M46 198 H26 V178" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
              <circle cx="42" cy="34" r="3.5" fill="#EF4444"/>
              <text x="51" y="37" fill="#FECACA" font-family="ui-monospace, monospace" font-size="8.4" font-weight="700" letter-spacing="1.4">REC · 1/250</text>
              <circle cx="120" cy="116" r="64" fill="#060B12" stroke="#E2E8F0" stroke-width="2"/>
              <g class="r09-reticle">
                <circle cx="120" cy="116" r="26" fill="none" stroke="rgba(120,215,242,0.6)" stroke-width="1.2" stroke-dasharray="4 4"/>
                <line x1="86" y1="116" x2="154" y2="116" stroke="rgba(253,230,138,0.48)" stroke-width="1"/>
                <line x1="120" y1="82" x2="120" y2="150" stroke="rgba(253,230,138,0.48)" stroke-width="1"/>
                <text x="120" y="127" text-anchor="middle" fill="#FFFBEB" font-family="Georgia, serif" font-size="31" font-weight="700">09</text>
              </g>
              <g clip-path="url(#r09Lens)">
                <g class="r09-iris" style="transform-origin:120px 116px;">${blades}</g>
                <circle class="r09-flash" cx="120" cy="116" r="62" fill="#FFFFFF"/>
              </g>
            </svg>
          </div>`;
      }

      case 10:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(248,113,113,0.44);--rh-mid:rgba(226,232,240,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <path d="M24 124 H176 V98" fill="none" stroke="#475569" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M24 124 H176 V98" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
              <g class="r10-steam-1">
                <circle cx="176" cy="44" r="14" fill="rgba(241,245,249,0.58)"/>
                <circle cx="192" cy="34" r="18" fill="rgba(226,232,240,0.42)"/>
              </g>
              <g class="r10-steam-2">
                <circle cx="186" cy="52" r="11" fill="rgba(248,250,252,0.62)"/>
                <circle cx="204" cy="42" r="15" fill="rgba(226,232,240,0.36)"/>
              </g>
              <circle cx="176" cy="72" r="24" fill="#0B1420" stroke="#FDE68A" stroke-width="2"/>
              <path d="M160 72 A16 16 0 0 1 192 72" fill="none" stroke="#EF4444" stroke-width="3" stroke-dasharray="12 38" stroke-dashoffset="-34"/>
              <line class="r10-needle" x1="176" y1="72" x2="176" y2="54" stroke="#FEF08A" stroke-width="2.4" stroke-linecap="round"/>
              <circle cx="176" cy="72" r="3.5" fill="#FDE68A"/>
              <g class="r10-wheel">
                <circle cx="96" cy="124" r="46" fill="none" stroke="#DC2626" stroke-width="10"/>
                <circle cx="96" cy="124" r="46" fill="none" stroke="#FCA5A5" stroke-width="1.5" opacity="0.6"/>
                <line x1="54" y1="124" x2="138" y2="124" stroke="#B91C1C" stroke-width="6"/>
                <line x1="96" y1="82" x2="96" y2="166" stroke="#B91C1C" stroke-width="6"/>
                <line x1="66" y1="94" x2="126" y2="154" stroke="#991B1B" stroke-width="4.5"/>
                <line x1="126" y1="94" x2="66" y2="154" stroke="#991B1B" stroke-width="4.5"/>
              </g>
              <circle cx="96" cy="124" r="15" fill="#450A0A" stroke="#FDE68A" stroke-width="2"/>
              <text x="96" y="128" text-anchor="middle" fill="#FFFBEB" font-family="ui-monospace, monospace" font-size="10.5" font-weight="700">10</text>
            </svg>
          </div>`;

      case 11:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(253,230,138,0.44);--rh-mid:rgba(241,245,249,0.20);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <defs><clipPath id="r11Slot"><rect x="44" y="42" width="152" height="168"/></clipPath></defs>
              <rect x="40" y="30" width="160" height="16" rx="5" fill="#1E293B" stroke="#94A3B8" stroke-width="1.5"/>
              <line x1="52" y1="42" x2="188" y2="42" stroke="#020617" stroke-width="4"/>
              <g clip-path="url(#r11Slot)">
                <g class="r11-paper-top">
                  <path d="M56 42 H184 V122 L170 116 L156 124 L142 117 L128 125 L112 118 L98 126 L84 119 L70 125 L56 120 Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2"/>
                  <text x="120" y="64" text-anchor="middle" fill="#0F172A" font-family="ui-monospace, monospace" font-size="7.8" font-weight="700" letter-spacing="0.9">MIRADOR · TICKET 11</text>
                  <line x1="68" y1="76" x2="172" y2="76" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="3 2"/>
                  <rect x="68" y="86" width="60" height="5" rx="1.5" fill="#475569"/>
                  <rect x="142" y="86" width="30" height="5" rx="1.5" fill="#B91C1C"/>
                  <rect x="68" y="98" width="82" height="4.5" rx="1.5" fill="#94A3B8"/>
                </g>
                <path class="r11-tear-glow" d="M56 120 L70 125 L84 119 L98 126 L112 118 L128 125 L142 117 L156 124 L170 116 L184 122" fill="none" stroke="#FBBF24" stroke-width="2.4" style="filter:drop-shadow(0 0 6px #F59E0B);"/>
                <g class="r11-paper-bot">
                  <path d="M56 121 L70 126 L84 120 L98 127 L112 119 L128 126 L142 118 L156 125 L170 117 L184 123 V174 H56 Z" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.2"/>
                  <path d="M74 136 V160 M80 136 V160 M84 136 V160 M92 136 V160 M100 136 V160 M106 136 V160 M114 136 V160 M122 136 V160 M131 136 V160 M138 136 V160 M146 136 V160 M154 136 V160 M164 136 V160" stroke="#1E293B" stroke-width="2.2"/>
                </g>
              </g>
            </svg>
          </div>`;

      case 12: {
        const pattern = [
          [0, 1, 1, 1, 0],
          [1, 0, 1, 0, 1],
          [1, 1, 1, 1, 1],
          [1, 0, 1, 0, 1],
          [0, 1, 1, 1, 0]
        ];
        const cells = [];
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            const x = 52 + c * 28;
            const y = 42 + r * 28;
            const on = pattern[r][c] === 1;
            const delay = 140 + (r + c) * 65;
            const fill = on ? (r === 2 && c === 2 ? "#FDE68A" : "#78D7F2") : "rgba(30,41,59,0.55)";
            const cls = on ? "r12-cell" : "";
            cells.push(`<rect class="${cls}" style="--cd:${delay}ms;" x="${x}" y="${y}" width="24" height="24" rx="4.5" fill="${fill}" stroke="rgba(226,232,240,0.22)" stroke-width="1"/>`);
          }
        }
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(120,215,242,0.44);--rh-mid:rgba(253,230,138,0.24);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <rect x="42" y="32" width="156" height="156" rx="12" fill="rgba(6,13,22,0.88)" stroke="rgba(120,215,242,0.38)" stroke-width="1.6"/>
              ${cells.join("")}
              <text x="120" y="206" text-anchor="middle" fill="#9BE8FF" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="2">MICROFICHA · ARCHIVO 12</text>
            </svg>
          </div>`;
      }

      case 13:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(120,215,242,0.42);--rh-mid:rgba(242,168,75,0.28);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <line class="r13-sync-line" x1="120" y1="42" x2="120" y2="178" stroke="rgba(253,230,138,0.48)" stroke-width="1.4" stroke-dasharray="4 4"/>
              <g class="r13-left" style="--cd:140ms;">
                <rect x="22" y="46" width="108" height="32" rx="11" fill="rgba(14,116,144,0.30)" stroke="#78D7F2" stroke-width="1.5"/>
                <rect x="34" y="57" width="66" height="4.5" rx="2" fill="#BAE6FD"/>
                <rect x="34" y="66" width="44" height="4" rx="2" fill="rgba(186,230,253,0.5)"/>
              </g>
              <g class="r13-right" style="--cd:280ms;">
                <rect x="110" y="92" width="108" height="32" rx="11" fill="rgba(180,83,9,0.30)" stroke="#F2A84B" stroke-width="1.5"/>
                <rect x="124" y="103" width="74" height="4.5" rx="2" fill="#FDE68A"/>
                <rect x="148" y="112" width="50" height="4" rx="2" fill="rgba(253,230,138,0.55)"/>
              </g>
              <g class="r13-left" style="--cd:430ms;">
                <rect x="28" y="138" width="122" height="34" rx="11" fill="rgba(14,116,144,0.34)" stroke="#78D7F2" stroke-width="1.5"/>
                <text x="42" y="159" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="9.2" font-weight="700" letter-spacing="1.2">HILO #13 · UNIDO</text>
              </g>
            </svg>
          </div>`;

      case 14:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(253,230,138,0.46);--rh-mid:rgba(120,215,242,0.28);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <circle class="r14-w1" cx="120" cy="38" r="24" fill="none" stroke="#78D7F2" stroke-width="1.8"/>
              <circle class="r14-w2" cx="48" cy="164" r="24" fill="none" stroke="#78D7F2" stroke-width="1.8"/>
              <circle class="r14-w3" cx="192" cy="164" r="24" fill="none" stroke="#F2A84B" stroke-width="1.8"/>
              <line class="r14-ray" x1="120" y1="38" x2="120" y2="116" stroke="#78D7F2" stroke-width="1.5" stroke-dasharray="4 4"/>
              <line class="r14-ray" x1="48" y1="164" x2="120" y2="116" stroke="#78D7F2" stroke-width="1.5" stroke-dasharray="4 4"/>
              <line class="r14-ray" x1="192" y1="164" x2="120" y2="116" stroke="#F2A84B" stroke-width="1.5" stroke-dasharray="4 4"/>
              <circle cx="120" cy="38" r="7" fill="#0C1B2A" stroke="#78D7F2" stroke-width="2"/>
              <circle cx="48" cy="164" r="7" fill="#0C1B2A" stroke="#78D7F2" stroke-width="2"/>
              <circle cx="192" cy="164" r="7" fill="#0C1B2A" stroke="#F2A84B" stroke-width="2"/>
              <g class="r14-target">
                <circle cx="120" cy="116" r="24" fill="rgba(251,191,36,0.16)" stroke="#FDE68A" stroke-width="2"/>
                <line x1="88" y1="116" x2="152" y2="116" stroke="#FDE68A" stroke-width="1.2"/>
                <line x1="120" y1="84" x2="120" y2="148" stroke="#FDE68A" stroke-width="1.2"/>
                <text x="120" y="121" text-anchor="middle" fill="#FFFBEB" font-family="ui-monospace, monospace" font-size="13" font-weight="700">14</text>
              </g>
            </svg>
          </div>`;

      case 15: {
        const ticks = Array.from({ length: 24 }, (_, idx) => {
          const ang = (idx * 15 * Math.PI) / 180;
          const r1 = idx % 3 === 0 ? 45 : 49;
          const x1 = (120 + Math.cos(ang) * r1).toFixed(1);
          const y1 = (110 + Math.sin(ang) * r1).toFixed(1);
          const x2 = (120 + Math.cos(ang) * 56).toFixed(1);
          const y2 = (110 + Math.sin(ang) * 56).toFixed(1);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${idx % 3 === 0 ? "#FDE68A" : "#94A3B8"}" stroke-width="${idx % 3 === 0 ? 2 : 1.1}"/>`;
        }).join("");
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(52,211,153,0.42);--rh-mid:rgba(253,230,138,0.24);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <rect class="r15-bolt-l" x="18" y="96" width="28" height="28" rx="5" fill="#64748B" stroke="#E2E8F0" stroke-width="1.5"/>
              <rect class="r15-bolt-r" x="194" y="96" width="28" height="28" rx="5" fill="#64748B" stroke="#E2E8F0" stroke-width="1.5"/>
              <circle cx="120" cy="110" r="68" fill="#0B131D" stroke="#64748B" stroke-width="2.6"/>
              <polygon points="120,38 115,49 125,49" fill="#EF4444"/>
              <g class="r15-dial">
                <circle cx="120" cy="110" r="58" fill="#13202E" stroke="#CBD5E1" stroke-width="1.6"/>
                ${ticks}
                <circle class="r15-core" cx="120" cy="110" r="27" fill="#091119" stroke="#FDE68A" stroke-width="2"/>
                <text x="120" y="118" text-anchor="middle" fill="#FFFBEB" font-family="Georgia, serif" font-size="24" font-weight="700">15</text>
              </g>
            </svg>
          </div>`;
      }

      case 16:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(245,158,11,0.48);--rh-mid:rgba(239,68,68,0.20);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <rect x="18" y="54" width="204" height="112" rx="14" fill="#0A121C" stroke="rgba(251,191,36,0.45)" stroke-width="1.8"/>
              <line x1="34" y1="96" x2="206" y2="96" stroke="rgba(253,230,138,0.34)" stroke-width="1.5"/>
              ${Array.from({ length: 13 }, (_, i) => {
                const x = 38 + i * 13.6;
                const h = i % 3 === 0 ? 16 : 9;
                return `<line x1="${x.toFixed(1)}" y1="${96 - h / 2}" x2="${x.toFixed(1)}" y2="${96 + h / 2}" stroke="#FDE68A" stroke-width="${i % 3 === 0 ? 1.8 : 1}"/>`;
              }).join("")}
              <path class="r16-wave" d="M36 138 Q50 124 64 138 T92 138 T120 138 T148 138 T176 138 T204 138" fill="none" stroke="#F59E0B" stroke-width="2.2" style="filter:drop-shadow(0 0 6px #F59E0B);"/>
              <g class="r16-needle">
                <line x1="120" y1="68" x2="120" y2="120" stroke="#EF4444" stroke-width="3" stroke-linecap="round" style="filter:drop-shadow(0 0 8px #EF4444);"/>
                <polygon points="120,65 115,73 125,73" fill="#FCA5A5"/>
              </g>
              <g class="r16-lock">
                <text x="120" y="188" text-anchor="middle" fill="#FDE68A" font-family="ui-monospace, monospace" font-size="9" font-weight="700" letter-spacing="2">SINTONÍA CLARA · 16</text>
              </g>
            </svg>
          </div>`;

      case 17: {
        const grid = [];
        const crosses = [
          [0, 0, 160], [0, 2, 240], [1, 0, 320], [1, 1, 400], [2, 1, 480], [2, 2, 560]
        ];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const x = 51 + c * 46;
            const y = 41 + r * 46;
            const win = r === 1 && c === 2;
            grid.push(`<rect class="${win ? "r17-win-cell" : ""}" x="${x}" y="${y}" width="42" height="42" rx="7" fill="rgba(12,24,36,0.85)" stroke="rgba(253,230,138,0.34)" stroke-width="1.4"/>`);
          }
        }
        const xMarks = crosses.map(([r, c, cd]) => {
          const x = 51 + c * 46;
          const y = 41 + r * 46;
          return `<path class="r17-x" style="--cd:${cd}ms;" d="M${x + 11} ${y + 11} L${x + 31} ${y + 31} M${x + 31} ${y + 11} L${x + 11} ${y + 31}" stroke="#F87171" stroke-width="2.4" stroke-linecap="round"/>`;
        }).join("");
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(52,211,153,0.44);--rh-mid:rgba(253,230,138,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              ${grid.join("")}
              ${xMarks}
              <path class="r17-check" d="M153 108 L161 117 L176 99" fill="none" stroke="#A7F3D0" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
              <text x="120" y="202" text-anchor="middle" fill="#A7F3D0" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="2">DESCARTE LÓGICO · 17</text>
            </svg>
          </div>`;
      }

      case 18:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(147,197,253,0.46);--rh-mid:rgba(120,215,242,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <defs>
                <linearGradient id="r18Cone" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#BAE6FD" stop-opacity="0.38"/>
                  <stop offset="100%" stop-color="#BAE6FD" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <circle cx="120" cy="110" r="78" fill="#091522" stroke="rgba(186,230,253,0.34)" stroke-width="1.6"/>
              <polygon class="r18-beam" points="28,196 104,34 214,116" fill="url(#r18Cone)"/>
              <g class="r18-boot-1">
                <ellipse cx="90" cy="118" rx="16" ry="22" transform="rotate(-14 90 118)" fill="rgba(56,189,248,0.22)" stroke="#93C5FD" stroke-width="1.8"/>
                <rect x="82" y="143" width="20" height="14" rx="6" transform="rotate(-14 92 150)" fill="rgba(56,189,248,0.22)" stroke="#93C5FD" stroke-width="1.8"/>
                <line x1="78" y1="112" x2="100" y2="108" stroke="#E0F2FE" stroke-width="1.4"/>
                <line x1="80" y1="122" x2="102" y2="118" stroke="#E0F2FE" stroke-width="1.4"/>
              </g>
              <g class="r18-boot-2">
                <ellipse cx="148" cy="80" rx="16" ry="22" transform="rotate(-12 148 80)" fill="rgba(56,189,248,0.28)" stroke="#BAE6FD" stroke-width="1.8"/>
                <rect x="140" y="105" width="20" height="14" rx="6" transform="rotate(-12 150 112)" fill="rgba(56,189,248,0.28)" stroke="#BAE6FD" stroke-width="1.8"/>
                <line x1="136" y1="74" x2="158" y2="70" stroke="#FFFFFF" stroke-width="1.4"/>
                <line x1="138" y1="84" x2="160" y2="80" stroke="#FFFFFF" stroke-width="1.4"/>
              </g>
              <text x="120" y="204" text-anchor="middle" fill="#BAE6FD" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="2">PATIO NEVADO · HUELLA 18</text>
            </svg>
            ${makeShards(14, ["#E0F2FE", "#93C5FD", "#FFFFFF"], 450, 74, 74)}
          </div>`;

      case 19:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(251,191,36,0.46);--rh-mid:rgba(52,211,153,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <rect x="20" y="46" width="200" height="128" rx="14" fill="#08121B" stroke="rgba(253,230,138,0.42)" stroke-width="1.6"/>
              <text x="120" y="72" text-anchor="middle" fill="#94A3B8" font-family="ui-monospace, monospace" font-size="8.4" letter-spacing="2">REGISTRO BANCARIO</text>
              <text x="120" y="114" text-anchor="middle" fill="#FFFBEB" font-family="ui-monospace, monospace" font-size="27" font-weight="700" letter-spacing="2">00:00:19</text>
              <rect x="42" y="130" width="156" height="8" rx="4" fill="rgba(148,163,184,0.2)"/>
              <rect class="r19-bar" x="42" y="130" width="0" height="8" rx="4" fill="#FBBF24"/>
              <path class="r19-arrow" d="M44 156 H190 L178 148 M190 156 L178 164" fill="none" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <g class="r19-stamp">
                <text x="120" y="196" text-anchor="middle" fill="#A7F3D0" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="1.8">ASIENTO VERIFICADO · 19</text>
              </g>
            </svg>
          </div>`;

      case 20:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(34,211,238,0.48);--rh-mid:rgba(56,189,248,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <defs>
                <clipPath id="r20Clip"><rect class="r20-xray-clip" x="40" y="42" width="0" height="140"/></clipPath>
                <linearGradient id="r20Beam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#22D3EE" stop-opacity="0"/>
                  <stop offset="50%" stop-color="#67E8F9" stop-opacity="0.72"/>
                  <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M96 64 V50 A8 8 0 0 1 104 42 H136 A8 8 0 0 1 144 50 V64" fill="none" stroke="#94A3B8" stroke-width="3.5"/>
              <rect x="44" y="64" width="152" height="106" rx="12" fill="#0D1622" stroke="#64748B" stroke-width="2.2"/>
              <g clip-path="url(#r20Clip)">
                <rect x="44" y="64" width="152" height="106" rx="12" fill="rgba(8,51,68,0.88)" stroke="#22D3EE" stroke-width="2"/>
                <rect x="64" y="86" width="24" height="58" rx="8" fill="rgba(103,232,249,0.26)" stroke="#67E8F9" stroke-width="1.6"/>
                <rect x="70" y="76" width="12" height="10" rx="2" fill="#A5F3FC"/>
                <rect x="102" y="84" width="44" height="62" rx="4" fill="rgba(251,191,36,0.22)" stroke="#FDE68A" stroke-width="1.5" stroke-dasharray="4 3"/>
                <circle cx="168" cy="100" r="10" fill="none" stroke="#67E8F9" stroke-width="2.2"/>
                <line x1="168" y1="110" x2="168" y2="144" stroke="#67E8F9" stroke-width="2.6"/>
                <line x1="168" y1="132" x2="178" y2="132" stroke="#67E8F9" stroke-width="2.4"/>
                <text x="124" y="122" text-anchor="middle" fill="#ECFEFF" font-family="ui-monospace, monospace" font-size="16" font-weight="700">20</text>
              </g>
              <g class="r20-beam">
                <rect x="28" y="54" width="28" height="126" fill="url(#r20Beam)"/>
                <line x1="42" y1="54" x2="42" y2="180" stroke="#ECFEFF" stroke-width="2.2" style="filter:drop-shadow(0 0 8px #22D3EE);"/>
              </g>
              <text x="120" y="196" text-anchor="middle" fill="#67E8F9" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="2">ESPECTRO RAYOS X · 20</text>
            </svg>
          </div>`;

      case 21: {
        const markers = Array.from({ length: 12 }, (_, i) => {
          const ang = (i * 30 * Math.PI) / 180;
          const x1 = (120 + Math.cos(ang) * 56).toFixed(1);
          const y1 = (110 + Math.sin(ang) * 56).toFixed(1);
          const x2 = (120 + Math.cos(ang) * 65).toFixed(1);
          const y2 = (110 + Math.sin(ang) * 65).toFixed(1);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${i % 3 === 0 ? "#FDE68A" : "#94A3B8"}" stroke-width="${i % 3 === 0 ? 2.4 : 1.3}"/>`;
        }).join("");
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(248,113,113,0.40);--rh-mid:rgba(253,230,138,0.26);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <circle cx="120" cy="110" r="72" fill="#09131D" stroke="#FDE68A" stroke-width="2.2"/>
              <circle cx="120" cy="110" r="66" fill="none" stroke="rgba(253,230,138,0.22)" stroke-width="1"/>
              ${markers}
              <path class="r21-arc-alert" d="M89 56 A62 62 0 0 1 120 48" fill="none" stroke="#EF4444" stroke-width="4.5" stroke-linecap="round"/>
              <line class="r21-hr-hand" x1="120" y1="110" x2="120" y2="74" stroke="#FDE68A" stroke-width="4" stroke-linecap="round"/>
              <line class="r21-min-hand" x1="120" y1="110" x2="120" y2="58" stroke="#FFFBEB" stroke-width="2.6" stroke-linecap="round"/>
              <circle cx="120" cy="110" r="5" fill="#EF4444" stroke="#FFFBEB" stroke-width="1.5"/>
              <text x="120" y="202" text-anchor="middle" fill="#FCA5A5" font-family="ui-monospace, monospace" font-size="9" font-weight="700" letter-spacing="2">23:55 H · PLANTA 3 · 21</text>
            </svg>
          </div>`;
      }

      case 22:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(251,191,36,0.52);--rh-mid:rgba(239,68,68,0.28);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <rect x="18" y="44" width="204" height="132" rx="14" fill="#060D15" stroke="rgba(251,191,36,0.44)" stroke-width="1.8"/>
              <path d="M18 110 H222 M70 44 V176 M120 44 V176 M170 44 V176" stroke="rgba(148,163,184,0.16)" stroke-width="1"/>
              <rect class="r22-surge-flash" x="18" y="44" width="204" height="132" rx="14" fill="rgba(254,240,138,0.34)"/>
              <path class="r22-trace" d="M26 110 H68 L78 102 L88 118 L98 110 H112 L120 56 L130 162 L140 78 L148 110 H212" fill="none" stroke="#FDE68A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 8px #F59E0B);"/>
              <g class="r22-spark">
                <polygon points="122,64 114,92 126,92 118,122 138,88 126,88" fill="#FFFBEB" stroke="#F59E0B" stroke-width="1"/>
              </g>
              <text x="120" y="198" text-anchor="middle" fill="#FDE68A" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700" letter-spacing="2">SOBRECARGA · 23:38 · 22</text>
            </svg>
            ${makeShards(16, ["#FFFBEB", "#FBBF24", "#78D7F2"], 480, 92, 68)}
          </div>`;

      case 23:
        return `
          <div class="ritual-arena">
            <div class="ritual-halo" style="--rh-core:rgba(239,68,68,0.46);--rh-mid:rgba(253,230,138,0.22);"></div>
            <svg class="ritual-svg" viewBox="0 0 240 220" aria-hidden="true">
              <g class="r23-paper">
                <rect x="34" y="34" width="172" height="152" rx="10" fill="#111C28" stroke="rgba(226,232,240,0.3)" stroke-width="1.5"/>
                <rect x="52" y="54" width="76" height="6" rx="2" fill="rgba(241,245,249,0.45)"/>
                <rect x="52" y="68" width="136" height="4.5" rx="2" fill="rgba(148,163,184,0.34)"/>
                <rect x="52" y="80" width="118" height="4.5" rx="2" fill="rgba(148,163,184,0.34)"/>
                <rect x="52" y="142" width="128" height="4.5" rx="2" fill="rgba(148,163,184,0.28)"/>
                <rect x="52" y="154" width="92" height="4.5" rx="2" fill="rgba(148,163,184,0.28)"/>
              </g>
              <g class="r23-stamp">
                <rect x="44" y="86" width="152" height="52" rx="7" fill="rgba(127,29,29,0.34)" stroke="#EF4444" stroke-width="3.2"/>
                <rect x="50" y="92" width="140" height="40" rx="4" fill="none" stroke="rgba(252,165,165,0.65)" stroke-width="1.2" stroke-dasharray="4 3"/>
                <text x="120" y="111" text-anchor="middle" fill="#FECACA" font-family="ui-monospace, monospace" font-size="11.5" font-weight="700" letter-spacing="2.2">PENÚLTIMA · 23</text>
                <text x="120" y="126" text-anchor="middle" fill="#FCA5A5" font-family="ui-monospace, monospace" font-size="7.6" font-weight="700" letter-spacing="2">EXPEDIENTE UOPJ</text>
              </g>
            </svg>
            ${makeShards(14, ["#EF4444", "#FCA5A5", "#FDE68A"], 450, 86, 62)}
          </div>`;

      case 24:
      default: {
        const constellationNodes = Array.from({ length: 24 }, (_, idx) => {
          const deg = idx * 15 - 90;
          const rad = (deg * Math.PI) / 180;
          const x = (143 + Math.cos(rad) * 124).toFixed(1);
          const y = (137 + Math.sin(rad) * 124).toFixed(1);
          const isQuarter = idx % 6 === 0;
          const col = idx === 23 ? "#FFFBEB" : idx < 12 ? "#78D7F2" : "#F2A84B";
          const delay = 70 + idx * 26;
          return `<circle class="r24-node" style="--nd:${delay}ms;" cx="${x}" cy="${y}" r="${isQuarter ? 3.5 : 2.2}" fill="${col}"/>`;
        }).join("");

        return `
          <div class="r24-stage-arena">
            <div class="r24-aurora"></div>
            <div class="r24-flare"></div>
            <svg class="r24-bg-svg" viewBox="0 0 286 274" aria-hidden="true">
              <circle class="r24-astro-ring" cx="143" cy="137" r="124" fill="none" stroke="rgba(253,230,138,0.20)" stroke-width="1" stroke-dasharray="3 5"/>
              <path class="r24-arc-c" d="M139 249 A112 112 0 0 1 139 25" fill="none" stroke="#78D7F2" stroke-width="2.4" stroke-linecap="round" style="filter:drop-shadow(0 0 8px rgba(120,215,242,0.85));"/>
              <path class="r24-arc-a" d="M147 249 A112 112 0 0 0 147 25" fill="none" stroke="#F2A84B" stroke-width="2.4" stroke-linecap="round" style="filter:drop-shadow(0 0 8px rgba(242,168,75,0.85));"/>
              ${constellationNodes}
            </svg>

            <div class="r24-vault-frame">
              <div class="r24-sanctuary">
                <svg class="r24-sanctuary-svg" viewBox="0 0 170 200" aria-hidden="true">
                  <defs>
                    <radialGradient id="r24HallGlow" cx="50%" cy="44%" r="62%">
                      <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.96"/>
                      <stop offset="34%" stop-color="#FDE68A" stop-opacity="0.58"/>
                      <stop offset="68%" stop-color="#B45309" stop-opacity="0.28"/>
                      <stop offset="100%" stop-color="#050C14" stop-opacity="0.96"/>
                    </radialGradient>
                    <linearGradient id="r24TreeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stop-color="#FEF3C7"/>
                      <stop offset="55%" stop-color="#F59E0B"/>
                      <stop offset="100%" stop-color="#78350F"/>
                    </linearGradient>
                  </defs>
                  <rect width="170" height="200" fill="url(#r24HallGlow)"/>
                  <g class="r24-inner-glow">
                    <path d="M85 46 L18 192 H152 Z" fill="rgba(254,243,199,0.18)"/>
                    <polygon points="85,62 56,104 68,104 46,138 62,138 38,174 132,174 108,138 124,138 102,104 114,104" fill="url(#r24TreeGrad)" opacity="0.34" stroke="#FDE68A" stroke-width="1.2"/>
                    <g class="r24-star-crown">
                      <polygon points="85,20 89,40 109,46 89,52 85,72 81,52 61,46 81,40" fill="#FFFBEB" style="filter:drop-shadow(0 0 10px #FBBF24);"/>
                      <polygon points="85,31 87.5,43.5 100,46 87.5,48.5 85,61 82.5,48.5 70,46 82.5,43.5" fill="#FDE68A"/>
                    </g>
                    <g class="r24-pillar" style="--pd:1220ms;">
                      <rect x="34" y="138" width="16" height="44" rx="8" fill="rgba(120,215,242,0.28)" stroke="#78D7F2" stroke-width="1.3"/>
                      <circle cx="42" cy="127" r="6" fill="rgba(120,215,242,0.45)" stroke="#E0F2FE" stroke-width="1.2"/>
                    </g>
                    <g class="r24-pillar" style="--pd:1340ms;">
                      <rect x="77" y="132" width="16" height="50" rx="8" fill="rgba(254,243,199,0.34)" stroke="#FFFBEB" stroke-width="1.4"/>
                      <circle cx="85" cy="120" r="6.5" fill="rgba(253,230,138,0.62)" stroke="#FFFBEB" stroke-width="1.2"/>
                    </g>
                    <g class="r24-pillar" style="--pd:1460ms;">
                      <rect x="120" y="138" width="16" height="44" rx="8" fill="rgba(242,168,75,0.28)" stroke="#F2A84B" stroke-width="1.3"/>
                      <circle cx="128" cy="127" r="6" fill="rgba(242,168,75,0.45)" stroke="#FEF3C7" stroke-width="1.2"/>
                    </g>
                    <text x="85" y="102" text-anchor="middle" fill="#FFFBEB" font-family="Georgia, serif" font-size="36" font-weight="700" style="filter:drop-shadow(0 2px 12px rgba(0,0,0,0.85));">24</text>
                  </g>
                </svg>
              </div>

              <div class="r24-doors-3d">
                <div class="r24-door-leaf r24-door-l">
                  <svg viewBox="0 0 85 200" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="r24LeafL" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#132928"/>
                        <stop offset="60%" stop-color="#0A161F"/>
                        <stop offset="100%" stop-color="#050B12"/>
                      </linearGradient>
                    </defs>
                    <rect width="85" height="200" fill="url(#r24LeafL)"/>
                    <path d="M12 186 V74 C12 36 42 14 78 12 V186 Z" fill="none" stroke="rgba(120,215,242,0.45)" stroke-width="1.4"/>
                    <path d="M22 176 V80 C22 48 44 28 70 25 V176 Z" fill="none" stroke="rgba(253,230,138,0.34)" stroke-width="1"/>
                    <circle cx="72" cy="108" r="4" fill="#78D7F2"/>
                  </svg>
                </div>
                <div class="r24-door-leaf r24-door-r">
                  <svg viewBox="0 0 85 200" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="r24LeafR" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#1A2228"/>
                        <stop offset="60%" stop-color="#0D161E"/>
                        <stop offset="100%" stop-color="#050B12"/>
                      </linearGradient>
                    </defs>
                    <rect width="85" height="200" fill="url(#r24LeafR)"/>
                    <path d="M73 186 V74 C73 36 43 14 7 12 V186 Z" fill="none" stroke="rgba(242,168,75,0.48)" stroke-width="1.4"/>
                    <path d="M63 176 V80 C63 48 41 28 15 25 V176 Z" fill="none" stroke="rgba(253,230,138,0.34)" stroke-width="1"/>
                    <circle cx="13" cy="108" r="4" fill="#F2A84B"/>
                  </svg>
                </div>
              </div>

              <div class="r24-medallion">
                <svg viewBox="0 0 66 66" aria-hidden="true">
                  <circle cx="33" cy="33" r="30" fill="#18090B" stroke="#FDE68A" stroke-width="2.2"/>
                  <circle cx="33" cy="33" r="24" fill="none" stroke="rgba(253,230,138,0.55)" stroke-width="1" stroke-dasharray="3 3"/>
                  <path d="M33 9 A24 24 0 0 0 33 57" fill="none" stroke="#78D7F2" stroke-width="2"/>
                  <path d="M33 9 A24 24 0 0 1 33 57" fill="none" stroke="#F2A84B" stroke-width="2"/>
                  <text x="33" y="40" text-anchor="middle" fill="#FFFBEB" font-family="Georgia, serif" font-size="22" font-weight="700">24</text>
                </svg>
              </div>
              <div class="r24-caption-pill">NOCHEBUENA · CAREO FINAL</div>
            </div>
            ${makeShards(34, ["#FFFBEB", "#FDE68A", "#78D7F2", "#F2A84B", "#FCA5A5"], 940, 128, 114)}
          </div>`;
      }
    }
  }

  function playRitualSound(dayNum) {
    const fx = window.AudioFX;
    if (!fx) return;
    if (Number(dayNum) === 1) {
      fx.waxSealBreak?.();
      return;
    }
    if (typeof fx.playDoorRitual === "function") {
      fx.playDoorRitual(Number(dayNum));
      return;
    }
    fx.waxSealBreak?.();
  }

  function play(dayObj, onReveal, opts = {}) {
    const dNum = Number(dayObj?.day || 1);
    const previewOnly = Boolean(opts.previewOnly);
    const layer = document.getElementById("cinema-fx-layer");

    const reduced = Boolean(
      document.body?.classList.contains("pref-reduced-motion") ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );

    if (!layer || (reduced && !previewOnly)) {
      playRitualSound(dNum);
      if (typeof onReveal === "function") onReveal();
      return;
    }

    if (typeof activeCleanup === "function") activeCleanup(false);
    let revealed = false;
    let finished = false;
    const timers = [];

    const revealOnce = () => {
      if (revealed) return;
      revealed = true;
      if (typeof onReveal === "function") onReveal();
    };

    const cleanup = (skipToReveal = false) => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      if (skipToReveal) revealOnce();
      layer.classList.remove("active", "closing");
      layer.setAttribute("aria-hidden", "true");
      layer.innerHTML = "";
      layer.onclick = null;
      if (activeCleanup === cleanup) {
        activeCleanup = null;
        activePreviewMode = false;
      }
      if (typeof opts.onDone === "function") opts.onDone();
    };
    activeCleanup = cleanup;
    activePreviewMode = previewOnly;

    const numStr = String(dNum).padStart(2, "0");
    const cat = CATALOG.find((c) => c.day === dNum) || CATALOG[0];
    const title = dayObj?.title || `Puerta ${numStr}`;
    const kicker = previewOnly ? `VISTA PREVIA · PUERTA ${numStr}` : `DICIEMBRE · PUERTA ${numStr}`;
    const skipText = previewOnly ? `${cat.label} · Toca para volver` : "Toca para omitir";

    layer.innerHTML = `
      <div class="cinema-stage">
        <div class="cinema-kicker">${esc(kicker)}</div>
        <div class="cinema-headline">${esc(title)}</div>
        <div class="cinema-slit"></div>
        ${buildArenaHtml(dNum)}
        <div class="cinema-skip-hint">${esc(skipText)}</div>
      </div>`;

    layer.setAttribute("aria-hidden", "false");
    layer.classList.remove("closing");
    layer.classList.add("active");
    playRitualSound(dNum);

    if (dNum === 24 && window.triggerGoldBurst) {
      timers.push(setTimeout(() => window.triggerGoldBurst(92), 960));
    }

    const openedAt = Date.now();
    layer.onclick = () => {
      if (Date.now() - openedAt < 400) return;
      cleanup(!previewOnly);
    };
    const revealAt = dNum === 24 ? 2250 : 1040;
    const closeAt = dNum === 24 ? 2680 : 1340;
    const endAt = closeAt + 260;

    if (!previewOnly) timers.push(setTimeout(revealOnce, revealAt));
    timers.push(setTimeout(() => layer.classList.add("closing"), closeAt));
    timers.push(setTimeout(() => cleanup(false), endAt));
  }

  let activePreviewMode = false;

  function stop() {
    if (typeof activeCleanup === "function") activeCleanup(false);
  }

  function dismiss() {
    if (typeof activeCleanup === "function") activeCleanup(!activePreviewMode);
  }

  function isActive() {
    return typeof activeCleanup === "function";
  }

  return {
    CATALOG,
    play,
    stop,
    dismiss,
    isActive
  };
})();
