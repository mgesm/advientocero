/**
 * ADVIENTO CERO — MOTOR DE ENIGMAS INTERACTIVOS Y VALIDACIÓN SHA-256
 */

window.PuzzleEngine = (() => {
  function normalizeAnswer(str) {
    return String(str || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // Fallback SHA-256 puro en JS por si se prueba en http://LAN o file://
  function sha256Fallback(ascii) {
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = "";
    const words = [];
    const asciiBitLength = ascii.length * 8;
    const hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += "\x80";
    while ((ascii.length % 64) - 56) ascii += "\x00";
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (let j = 0; j < words.length; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash.slice(0);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & hash[5]) ^ (~e & hash[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash.unshift((temp1 + temp2) | 0);
        hash[4] = (hash[4] + temp1) | 0;
        hash.pop();
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? 0 : "") + b.toString(16);
      }
    }
    return result;
  }

  async function sha256Hex(raw) {
    const norm = normalizeAnswer(raw);
    if (window.crypto && window.crypto.subtle) {
      try {
        const enc = new TextEncoder().encode(norm);
        const buf = await window.crypto.subtle.digest("SHA-256", enc);
        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      } catch (_) {}
    }
    return sha256Fallback(norm);
  }

  async function matchesHashes(input, acceptedHashes) {
    if (!Array.isArray(acceptedHashes) || !acceptedHashes.length) return false;
    const h = await sha256Hex(input);
    return acceptedHashes.includes(h);
  }

  function decodePayload(b64) {
    try {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const jsonStr = new TextDecoder("utf-8").decode(bytes);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Error decodificando payload:", e);
      return null;
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderWidgetHtml(dayNum, role, widget) {
    if (!widget) return "";
    switch (widget.type) {
      case "dossier-card":
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.72rem;color:var(--adv-gold-soft);margin-bottom:8px;letter-spacing:0.06em;">${escapeHtml(widget.caption)}</div>
            <ul class="clue-list">
              ${(widget.items || []).map((it) => `<li>${escapeHtml(it)}</li>`).join("")}
            </ul>
          </div>`;

      case "room-map":
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.72rem;color:var(--adv-frost);margin-bottom:10px;">${escapeHtml(widget.caption)}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              ${(widget.nodes || []).map((n) => `
                <div style="padding:10px;border-radius:10px;border:1px solid ${n.alert ? "rgba(255,45,85,0.55)" : "rgba(255,255,255,0.1)"};background:${n.alert ? "rgba(255,45,85,0.14)" : "rgba(255,255,255,0.03)"};font-size:0.78rem;">
                  <div class="mono" style="font-weight:700;color:${n.alert ? "#FDA4AF" : "var(--vg-text-primary)"}">${escapeHtml(n.id)}</div>
                  <div style="color:var(--vg-text-secondary);margin-top:2px;">${escapeHtml(n.label)}</div>
                </div>`).join("")}
            </div>
          </div>`;

      case "uv-lamp":
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.72rem;color:var(--adv-cyan);margin-bottom:8px;">INSPECTOR ULTRAVIOLETA · ${escapeHtml(widget.prompt)}</div>
            <div class="uv-surface" id="uv-surface-${dayNum}">
              <div class="uv-base-text">[ BANDEJA DE CRISTAL LIMPIA A SIMPLE VISTA ]<br><span style="font-size:0.7rem;opacity:0.7;">Pasa el dedo para activar el haz UV 365 nm</span></div>
              <div class="uv-secret-layer" id="uv-secret-${dayNum}">
                <div class="mono" style="font-size:0.68rem;letter-spacing:0.12em;color:#A5F3FC;">${escapeHtml(widget.secretSub)}</div>
                <div class="uv-revealed-code">${escapeHtml(widget.secretCode)}</div>
                ${widget.secretNote ? `<div class="uv-rule-note">${escapeHtml(widget.secretNote)}</div>` : ""}
              </div>
            </div>
          </div>`;

      case "morse":
        return `
          <div class="widget-panel" style="text-align:center;">
            <div class="morse-lamp" id="morse-lamp-${dayNum}"></div>
            <div class="morse-strip">${escapeHtml(widget.sequence)}</div>
            <button type="button" class="btn btn-frost btn-sm" style="margin-top:12px;" data-action="play-morse" data-seq="${escapeHtml(widget.sequence)}" data-day="${dayNum}">
              ${escapeHtml(widget.label || "Reproducir Morse")}
            </button>
            <div id="morse-mute-note-${dayNum}" class="mono" style="font-size:0.7rem;color:var(--adv-gold-soft);margin-top:6px;display:${window.AudioFX?.isMuted() ? "block" : "none"};">
              Audio silenciado: sigue los destellos de la lámpara o activa el sonido.
            </div>
          </div>`;

      case "sudoku4": {
        const pre = widget.prefill || [];
        const vis = widget.visibleRows || [0, 1];
        const targets = widget.targets || [];
        let cells = "";
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const val = pre[r]?.[c] || 0;
            const isVis = vis.includes(r);
            const isTarget = targets.includes(`${r},${c}`);
            if (!isVis) {
              cells += `<div class="sudoku-cell masked" style="display:grid;place-items:center;" title="En el móvil de tu pareja">?</div>`;
            } else if (val > 0) {
              cells += `<div class="sudoku-cell given" style="display:grid;place-items:center;">${val}</div>`;
            } else {
              cells += `<button type="button" class="sudoku-cell ${isTarget ? "target-cell" : ""}" data-action="cycle-sudoku" data-r="${r}" data-c="${c}">·</button>`;
            }
          }
        }
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.7rem;color:var(--vg-text-secondary);text-align:center;">Toca tus casillas vacías (1–4). Las marcadas en cian son tu objetivo.</div>
            <div class="sudoku-grid">${cells}</div>
            <div style="text-align:center;">
              <button type="button" class="btn btn-sm btn-ghost" data-action="reset-board" data-board="sudoku4">Reiniciar borrador</button>
            </div>
          </div>`;
      }

      case "caesar":
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.72rem;color:var(--adv-frost);margin-bottom:8px;text-align:center;">RUEDA CÉSAR · DESPLAZAMIENTO: <span id="caesar-shift-val-${dayNum}">0</span></div>
            <div class="cipher-controls">
              <button type="button" class="btn btn-sm" data-action="caesar-step" data-delta="-1" data-day="${dayNum}">− 1</button>
              <button type="button" class="btn btn-sm btn-frost" data-action="caesar-step" data-delta="1" data-day="${dayNum}">+ 1</button>
            </div>
            <div class="cipher-output" id="caesar-out-${dayNum}" data-cipher="${escapeHtml(widget.cipherText)}" data-shift="0">${escapeHtml(widget.cipherText)}</div>
          </div>`;

      case "scene-zoom":
        return `
          <div class="widget-panel">
            <div id="zoom-viewport-${dayNum}" style="overflow:hidden;border-radius:12px;border:var(--vg-border-specular-strong);touch-action:none;">
              <img src="${escapeHtml(widget.imgSrc)}" alt="Fotograma cámara" id="zoom-img-${dayNum}" style="width:100%;height:auto;display:block;transition:transform 260ms var(--vg-spring);transform-origin:70% 65%;">
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap;">
              <span class="mono" style="font-size:0.7rem;color:var(--vg-text-secondary);">${escapeHtml(widget.caption)}</span>
              <button type="button" class="btn btn-sm btn-frost" data-action="toggle-zoom" data-day="${dayNum}">Zoom 1.8x</button>
            </div>
          </div>`;

      case "manual-lookup":
        return `
          <div class="widget-panel">
            <form data-manual-form="${dayNum}" data-trigger="${escapeHtml(widget.triggerCode)}" data-resp="${escapeHtml(widget.responseHtml)}" style="display:flex;gap:8px;">
              <input type="text" class="adv-input" id="manual-code-${dayNum}" placeholder="${escapeHtml(widget.placeholder || "Ej. C2")}" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="search" style="min-height:44px;">
              <button type="submit" class="btn btn-frost btn-sm" style="flex-shrink:0;">Consultar</button>
            </form>
            <div id="manual-res-${dayNum}" style="margin-top:10px;font-size:0.83rem;color:var(--vg-text-secondary);"></div>
          </div>`;

      case "valves":
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.72rem;color:var(--vg-text-secondary);margin-bottom:6px;">PULSA PARA ABRIR/CERRAR VÁLVULAS:</div>
            <div class="valve-row" id="valve-row-${dayNum}" data-target='${JSON.stringify(widget.targetState)}' data-code="${escapeHtml(widget.revealCode)}">
              ${[1, 2, 3, 4].map((v, idx) => `<button type="button" class="valve-btn" data-action="toggle-valve" data-idx="${idx}" data-day="${dayNum}">V${v}<br><span>CERRADA</span></button>`).join("")}
            </div>
            <div id="valve-gauge-${dayNum}" class="mono" style="text-align:center;font-size:0.82rem;color:var(--vg-text-muted);margin-top:6px;">PRESIÓN INESTABLE · ESPERANDO COMBINACIÓN</div>
          </div>`;

      case "nonogram": {
        const colClues = widget.clues?.cols || [];
        const rowClues = widget.clues?.rows || [];
        const hasClues = colClues.length === 5 && rowClues.length === 5;
        return `
          <div class="widget-panel">
            <div class="nonogram-wrap">
              <div class="mono" style="font-size:0.7rem;color:var(--adv-gold-soft);">BORRADOR TÁCTIL 5x5 (toca: relleno / X / vacío)</div>
              <table class="nono-table" id="nono-grid-${dayNum}">
                ${hasClues ? `<thead><tr><th></th>${colClues.map((c) => `<th class="nono-clue-col">${c.join("<br>")}</th>`).join("")}</tr></thead>` : ""}
                <tbody>
                  ${Array.from({ length: 5 }).map((_, r) => `
                    <tr>
                      ${hasClues ? `<th class="nono-clue-row">${rowClues[r].join(" ")}</th>` : ""}
                      ${Array.from({ length: 5 }).map((__, c) => {
                        const idxCell = r * 5 + c;
                        return `<td><button type="button" class="nono-cell" data-action="toggle-nono" data-idx="${idxCell}" aria-label="Celda fila ${r + 1} columna ${c + 1}"></button></td>`;
                      }).join("")}
                    </tr>`).join("")}
                </tbody>
              </table>
              <button type="button" class="btn btn-sm btn-ghost" data-action="reset-board" data-board="nonogram">Limpiar borrador</button>
            </div>
          </div>`;
      }

      case "keypad": {
        const slots = Array.isArray(widget.slots) && widget.slots.length
          ? widget.slots
          : [
              { val: "3", lbl: "D1 (Plantas)" },
              { val: "?", lbl: "D2 (Patri)" },
              { val: "D2+2", lbl: "D3" },
              { val: "1987", lbl: "Año Placa" }
            ];
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.72rem;color:var(--adv-gold-soft);margin-bottom:6px;">${escapeHtml(widget.heading || "ESQUEMA CAJA FUERTE")}</div>
            <div class="keypad-grid" style="text-align:center;">
              ${slots.map((s) => `<div class="stat-pill"><span class="stat-val">${escapeHtml(s.val)}</span><span class="stat-lbl">${escapeHtml(s.lbl)}</span></div>`).join("")}
            </div>
          </div>`;
      }

      case "frequency": {
        const bands = Array.isArray(widget.bands) && widget.bands.length
          ? widget.bands
          : [{ hz: Number(widget.targetHz || 440), text: widget.clearText || "" }];
        const initHz = Number(widget.initHz || widget.minHz || 200);
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.74rem;color:var(--adv-frost);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <span>FILTRO PASABANDA · S-METER</span>
              <span><strong id="freq-val-${dayNum}">${initHz} Hz</strong> · Señal <strong id="freq-sig-${dayNum}">8%</strong></span>
            </div>
            <div class="freq-smeter-track"><div class="freq-smeter-fill" id="freq-smeter-${dayNum}"></div></div>
            <div class="adv-range-wrap">
              <button type="button" class="btn btn-sm btn-ghost" data-action="step-range" data-target-id="freq-range-${dayNum}" data-delta="-${widget.stepHz}" aria-label="Bajar frecuencia">−</button>
              <input id="freq-range-${dayNum}" type="range" class="adv-range" min="${widget.minHz}" max="${widget.maxHz}" step="${widget.stepHz}" value="${initHz}" style="accent-color:var(--adv-cyan);" data-action="tune-freq" data-bands='${escapeHtml(JSON.stringify(bands))}' data-day="${dayNum}">
              <button type="button" class="btn btn-sm btn-ghost" data-action="step-range" data-target-id="freq-range-${dayNum}" data-delta="${widget.stepHz}" aria-label="Subir frecuencia">+</button>
            </div>
            <div id="freq-msg-${dayNum}" class="mono" style="margin-top:8px;padding:10px;border-radius:10px;background:rgba(2,4,8,0.8);border:var(--vg-border-specular);font-size:0.8rem;color:var(--vg-text-muted);">
              [ #%&amp; RUIDO DE VENTISCA · BARRE EL DIAL BUSCANDO PICOS DE SEÑAL ##@ ]
            </div>
          </div>`;
      }

      case "logic3x3":
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.7rem;color:var(--vg-text-secondary);margin-bottom:6px;">PARRILLA AUXILIAR (toca para alternar · / X / OK):</div>
            <table class="logic-matrix">
              <thead><tr><th></th>${widget.cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
              <tbody>
                ${widget.rows.map((r) => `<tr><th style="text-align:left;">${escapeHtml(r)}</th>${widget.cols.map(() => `<td><button type="button" class="logic-cell-btn" data-action="cycle-logic">·</button></td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
            <div style="text-align:center;margin-top:8px;">
              <button type="button" class="btn btn-sm btn-ghost" data-action="reset-board" data-board="logic3x3">Reiniciar parrilla</button>
            </div>
          </div>`;

      case "caliper": {
        const targetCm = Number(widget.targetCm || 25.5);
        const soleWidth = Math.round(((targetCm - 22.0) / 7.0) * 210);
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.74rem;color:var(--adv-frost);display:flex;justify-content:space-between;">
              <span>CALIBRE ABFO</span>
              <span id="caliper-val-${dayNum}">22.0 cm</span>
            </div>
            <div style="margin:10px 0;padding:14px;border-radius:10px;background:rgba(2,4,8,0.85);border:var(--vg-border-specular);position:relative;">
              <svg viewBox="0 0 260 56" style="width:100%;height:48px;display:block;">
                <rect x="20" y="14" width="${soleWidth}" height="28" rx="14" fill="rgba(56,189,248,0.16)" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4 3"/>
                <line x1="20" y1="6" x2="20" y2="50" stroke="#F59E0B" stroke-width="2"/>
                <line id="caliper-bar-${dayNum}" x1="20" y1="6" x2="20" y2="50" stroke="#10B981" stroke-width="2.5"/>
              </svg>
              <div class="adv-range-wrap">
                <button type="button" class="btn btn-sm btn-ghost" data-action="step-range" data-target-id="caliper-range-${dayNum}" data-delta="-0.5" aria-label="Reducir medida">−</button>
                <input id="caliper-range-${dayNum}" type="range" class="adv-range" min="22.0" max="29.0" step="0.5" value="22.0" style="accent-color:var(--adv-pine);" data-action="slide-caliper" data-target="${widget.targetCm}" data-day="${dayNum}">
                <button type="button" class="btn btn-sm btn-ghost" data-action="step-range" data-target-id="caliper-range-${dayNum}" data-delta="0.5" aria-label="Aumentar medida">+</button>
              </div>
              <div id="caliper-status-${dayNum}" class="mono" style="font-size:0.76rem;color:var(--vg-text-muted);margin-top:4px;">Desliza la línea verde hasta el borde derecho de la suela</div>
            </div>
            ${(widget.table && widget.table.length) ? `<div class="caliper-grid" style="font-size:0.72rem;text-align:center;">
              ${widget.table.map((t) => `<div class="stat-pill"><span class="stat-val" style="font-size:0.86rem;">T.${escapeHtml(t.size)}</span><span class="stat-lbl">${escapeHtml(t.cm)}</span></div>`).join("")}
            </div>` : ""}
          </div>`;
      }

      case "xray":
        return `
          <div class="widget-panel">
            <button type="button" class="btn btn-frost btn-sm" style="width:100%;" data-action="toggle-xray" data-day="${dayNum}" data-label="${escapeHtml(`filtro espectral (${widget.mode === "metal" ? "Metales" : "Orgánico"})`)}" aria-expanded="false">
              Activar filtro espectral (${widget.mode === "metal" ? "Metales" : "Orgánico"})
            </button>
            <div id="xray-box-${dayNum}" style="display:none;margin-top:10px;padding:12px;border-radius:10px;background:#0B1120;border:1.5px solid #0284C7;">
              ${widget.detailSvg ? `<div style="margin-bottom:8px;">${widget.detailSvg}</div>` : ""}
              <div class="mono" style="font-size:0.88rem;font-weight:700;color:#67E8F9;">${escapeHtml(widget.reveal)}</div>
              <div style="font-size:0.76rem;color:#CBD5E1;margin-top:4px;">${escapeHtml(widget.sub)}</div>
            </div>
          </div>`;

      case "voltage":
        if (Array.isArray(widget.traces) && widget.traces.length) {
          return `
            <div class="widget-panel">
              <div class="mono" style="font-size:0.72rem;color:var(--adv-crimson);margin-bottom:8px;">OSCILOSCOPIO 4 CIRCUITOS · T0 = 23:30 H (MARCAS +4M)</div>
              ${widget.traces.map((tr) => `
                <div style="margin-bottom:8px;">
                  <div class="mono" style="font-size:0.68rem;color:${escapeHtml(tr.color || "#93C5FD")};margin-bottom:2px;">${escapeHtml(tr.label)}</div>
                  <svg viewBox="0 0 280 42" style="width:100%;height:42px;background:rgba(2,4,8,0.85);border-radius:8px;border:1px solid rgba(255,255,255,0.1);display:block;">
                    <line x1="20" y1="0" x2="20" y2="42" stroke="rgba(148,163,184,0.22)" stroke-dasharray="2 2"/>
                    <line x1="80" y1="0" x2="80" y2="42" stroke="rgba(148,163,184,0.22)" stroke-dasharray="2 2"/>
                    <line x1="140" y1="0" x2="140" y2="42" stroke="rgba(148,163,184,0.22)" stroke-dasharray="2 2"/>
                    <line x1="200" y1="0" x2="200" y2="42" stroke="rgba(148,163,184,0.22)" stroke-dasharray="2 2"/>
                    <line x1="260" y1="0" x2="260" y2="42" stroke="rgba(148,163,184,0.22)" stroke-dasharray="2 2"/>
                    <polyline points="${escapeHtml(tr.points)}" fill="none" stroke="${escapeHtml(tr.color || "#38BDF8")}" stroke-width="2.2"/>
                  </svg>
                </div>`).join("")}
              <div class="mono" style="display:flex;justify-content:space-between;font-size:0.66rem;color:#94A3B8;padding:2px 8px 0;">
                <span>+0m</span><span>+4m</span><span>+8m</span><span>+12m</span><span>+16m</span>
              </div>
            </div>`;
        }
        return `
          <div class="widget-panel">
            <div class="mono" style="font-size:0.72rem;color:var(--adv-crimson);margin-bottom:6px;">OSCILOSCOPIO · PLANTA 1 (DIRECCIÓN)</div>
            <svg viewBox="0 0 280 76" style="width:100%;height:76px;background:rgba(2,4,8,0.85);border-radius:10px;border:1px solid rgba(255,255,255,0.1);">
              <polyline points="10,22 70,22 95,22 100,62 180,62 185,22 270,22" fill="none" stroke="#FF2D55" stroke-width="2.5"/>
              <circle cx="100" cy="62" r="4" fill="#F59E0B"/>
              <text x="106" y="54" fill="#FCD34D" font-family="monospace" font-size="11" font-weight="700">CORTE ${escapeHtml(widget.dropTime)} h</text>
            </svg>
          </div>`;

      default:
        return "";
    }
  }

  function serializeWidgetState(container) {
    if (!container) return null;
    const data = {};
    const sudokus = container.querySelectorAll('[data-action="cycle-sudoku"]');
    if (sudokus.length) data.sudoku = Array.from(sudokus).map((b) => b.textContent.trim());

    const nonos = container.querySelectorAll('[data-action="toggle-nono"]');
    if (nonos.length) data.nonogram = Array.from(nonos).map((b) => (b.classList.contains("on") ? 1 : b.classList.contains("x-mark") ? 2 : 0));

    const logics = container.querySelectorAll('[data-action="cycle-logic"]');
    if (logics.length) data.logic = Array.from(logics).map((b) => b.textContent.trim());

    const caesarOut = container.querySelector('[id^="caesar-out-"]');
    if (caesarOut) data.caesarShift = Number(caesarOut.dataset.shift || 0);

    const valves = container.querySelectorAll('[data-action="toggle-valve"]');
    if (valves.length) data.valves = Array.from(valves).map((b) => b.classList.contains("open"));

    const range = container.querySelector('.adv-range');
    if (range) data.range = range.value;

    const xrayBox = container.querySelector('[id^="xray-box-"]');
    if (xrayBox) data.xrayOpen = xrayBox.style.display !== "none";

    const manualInp = container.querySelector('[id^="manual-code-"]');
    if (manualInp) data.manualCode = manualInp.value;

    return Object.keys(data).length ? data : null;
  }

  function restoreWidgetState(container, data) {
    if (!container || !data) return;
    if (Array.isArray(data.sudoku)) {
      const cells = container.querySelectorAll('[data-action="cycle-sudoku"]');
      cells.forEach((b, i) => { if (data.sudoku[i]) b.textContent = data.sudoku[i]; });
    }
    if (Array.isArray(data.nonogram)) {
      const cells = container.querySelectorAll('[data-action="toggle-nono"]');
      cells.forEach((b, i) => {
        b.classList.remove("on", "x-mark");
        b.textContent = "";
        if (data.nonogram[i] === 1) b.classList.add("on");
        else if (data.nonogram[i] === 2) { b.classList.add("x-mark"); b.textContent = "X"; }
      });
    }
    if (Array.isArray(data.logic)) {
      const cells = container.querySelectorAll('[data-action="cycle-logic"]');
      cells.forEach((b, i) => {
        if (data.logic[i]) {
          b.textContent = data.logic[i];
          b.style.color = data.logic[i] === "OK" ? "#6EE7B7" : data.logic[i] === "X" ? "#FDA4AF" : "#CBD5E1";
        }
      });
    }
    if (typeof data.caesarShift === "number") {
      const out = container.querySelector('[id^="caesar-out-"]');
      if (out) {
        const day = out.id.replace("caesar-out-", "");
        const lbl = document.getElementById(`caesar-shift-val-${day}`);
        out.dataset.shift = String(data.caesarShift);
        if (lbl) lbl.textContent = String(data.caesarShift);
        const raw = out.dataset.cipher || "";
        out.textContent = raw.replace(/[A-Z]/g, (ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 - data.caesarShift + 26) % 26) + 65));
      }
    }
    if (Array.isArray(data.valves)) {
      const row = container.querySelector('[id^="valve-row-"]');
      const btns = container.querySelectorAll('[data-action="toggle-valve"]');
      btns.forEach((b, i) => {
        const open = Boolean(data.valves[i]);
        b.classList.toggle("open", open);
        b.innerHTML = `V${i + 1}<br><span>${open ? "ABIERTA" : "CERRADA"}</span>`;
      });
      if (row) {
        const day = row.id.replace("valve-row-", "");
        const gauge = document.getElementById(`valve-gauge-${day}`);
        const target = JSON.parse(row.dataset.target || "[]");
        const match = target.every((v, i) => v === Boolean(data.valves[i]));
        if (gauge && match) {
          gauge.style.color = "#6EE7B7";
          gauge.style.fontWeight = "700";
          gauge.innerHTML = `PRESIÓN ESTABILIZADA · SERIE MANÓMETRO: <strong style="font-size:1rem;">${escapeHtml(row.dataset.code)}</strong>`;
        }
      }
    }
    if (data.range !== undefined) {
      const range = container.querySelector('.adv-range');
      if (range) {
        range.value = data.range;
        range.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    if (data.xrayOpen) {
      const btn = container.querySelector('[data-action="toggle-xray"]');
      if (btn) btn.click();
    }
    if (data.manualCode) {
      const inp = container.querySelector('[id^="manual-code-"]');
      if (inp) inp.value = data.manualCode;
    }
  }

  function wireWidgetEvents(container, onWidgetChange) {
    const emitChange = () => {
      if (typeof onWidgetChange === "function") onWidgetChange(serializeWidgetState(container));
    };

    // Linterna UV por puntero/táctil con offset sobre dedo y captura de puntero
    container.querySelectorAll(".uv-surface").forEach((el) => {
      const updatePos = (clientX, clientY, pointerType) => {
        const rect = el.getBoundingClientRect();
        const offsetY = pointerType === "touch" ? -38 : 0;
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY + offsetY - rect.top) / rect.height) * 100;
        const sec = el.querySelector(".uv-secret-layer");
        if (sec) {
          sec.style.setProperty("--uv-x", `${Math.max(0, Math.min(100, x))}%`);
          sec.style.setProperty("--uv-y", `${Math.max(0, Math.min(100, y))}%`);
        }
      };
      el.addEventListener("pointerdown", (e) => {
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        updatePos(e.clientX, e.clientY, e.pointerType);
      });
      el.addEventListener("pointermove", (e) => {
        if (e.buttons > 0 || e.pointerType !== "touch") {
          updatePos(e.clientX, e.clientY, e.pointerType);
        }
      });
    });

    // Arrastre en scene-zoom
    container.querySelectorAll('[id^="zoom-viewport-"]').forEach((vp) => {
      const day = vp.id.replace("zoom-viewport-", "");
      const img = document.getElementById(`zoom-img-${day}`);
      if (!img) return;
      let dragging = false, sx = 0, sy = 0, ox = 70, oy = 65;
      vp.addEventListener("pointerdown", (e) => {
        if (img.dataset.zoomed !== "1") return;
        dragging = true;
        sx = e.clientX;
        sy = e.clientY;
        try { vp.setPointerCapture(e.pointerId); } catch (_) {}
      });
      vp.addEventListener("pointermove", (e) => {
        if (!dragging || img.dataset.zoomed !== "1") return;
        const dx = (e.clientX - sx) * -0.18;
        const dy = (e.clientY - sy) * -0.18;
        sx = e.clientX;
        sy = e.clientY;
        ox = Math.max(0, Math.min(100, ox + dx));
        oy = Math.max(0, Math.min(100, oy + dy));
        img.style.transformOrigin = `${ox.toFixed(1)}% ${oy.toFixed(1)}%`;
      });
      vp.addEventListener("pointerup", () => { dragging = false; });
      vp.addEventListener("pointercancel", () => { dragging = false; });
    });

    container.addEventListener("submit", (e) => {
      const form = e.target.closest("[data-manual-form]");
      if (!form) return;
      e.preventDefault();
      window.AudioFX.click();
      const day = form.dataset.manualForm;
      const inp = document.getElementById(`manual-code-${day}`);
      const res = document.getElementById(`manual-res-${day}`);
      if (!inp || !res) return;
      if (normalizeAnswer(inp.value) === normalizeAnswer(form.dataset.trigger)) {
        res.innerHTML = `<div class="feedback-banner success">${form.dataset.resp}</div>`;
      } else {
        res.innerHTML = `<div class="feedback-banner error">Circuito no reconocido. Revisa el código rojo en la pantalla de tu pareja.</div>`;
      }
      emitChange();
    });

    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const act = btn.dataset.action;

      if (act === "step-range") {
        window.AudioFX.mechanicalTick?.() || window.AudioFX.click();
        const range = document.getElementById(btn.dataset.targetId);
        if (!range) return;
        const step = Number(btn.dataset.delta || 0);
        const min = Number(range.min);
        const max = Number(range.max);
        const next = Math.min(max, Math.max(min, Number(range.value) + step));
        range.value = String(next);
        range.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (act === "play-morse") {
        const lamp = document.getElementById(`morse-lamp-${btn.dataset.day}`);
        btn.disabled = true;
        window.AudioFX.playMorse(btn.dataset.seq, (lit) => {
          if (lamp) lamp.classList.toggle("lit", lit);
        }).finally(() => {
          btn.disabled = false;
        });
      } else if (act === "cycle-sudoku") {
        window.AudioFX.mechanicalTick?.() || window.AudioFX.click();
        const seq = ["·", "1", "2", "3", "4"];
        const cur = seq.indexOf(btn.textContent.trim());
        btn.textContent = seq[(cur + 1) % seq.length];
        emitChange();
      } else if (act === "caesar-step") {
        window.AudioFX.mechanicalTick?.() || window.AudioFX.click();
        const day = btn.dataset.day;
        const delta = Number(btn.dataset.delta);
        const out = document.getElementById(`caesar-out-${day}`);
        const lbl = document.getElementById(`caesar-shift-val-${day}`);
        if (!out) return;
        let shift = (Number(out.dataset.shift || 0) + delta + 26) % 26;
        out.dataset.shift = String(shift);
        if (lbl) lbl.textContent = String(shift);
        const raw = out.dataset.cipher || "";
        const decoded = raw.replace(/[A-Z]/g, (ch) => {
          const code = ch.charCodeAt(0) - 65;
          return String.fromCharCode(((code - shift + 26) % 26) + 65);
        });
        out.textContent = decoded;
        emitChange();
      } else if (act === "toggle-zoom") {
        window.AudioFX.click();
        const img = document.getElementById(`zoom-img-${btn.dataset.day}`);
        if (!img) return;
        const zoomed = img.dataset.zoomed === "1";
        img.dataset.zoomed = zoomed ? "0" : "1";
        img.style.transform = zoomed ? "scale(1)" : "scale(1.8)";
        btn.textContent = zoomed ? "Zoom 1.8x" : "Restablecer";
      } else if (act === "toggle-valve") {
        window.AudioFX.mechanicalTick?.() || window.AudioFX.click();
        btn.classList.toggle("open");
        const isOpen = btn.classList.contains("open");
        const idx = Number(btn.dataset.idx) + 1;
        btn.innerHTML = `V${idx}<br><span>${isOpen ? "ABIERTA" : "CERRADA"}</span>`;
        const row = document.getElementById(`valve-row-${btn.dataset.day}`);
        const gauge = document.getElementById(`valve-gauge-${btn.dataset.day}`);
        if (row && gauge) {
          const target = JSON.parse(row.dataset.target || "[]");
          const current = Array.from(row.querySelectorAll(".valve-btn")).map((b) => b.classList.contains("open"));
          const match = target.every((v, i) => v === current[i]);
          if (match) {
            window.AudioFX.success();
            gauge.style.color = "#6EE7B7";
            gauge.style.fontWeight = "700";
            gauge.innerHTML = `PRESIÓN ESTABILIZADA · SERIE MANÓMETRO: <strong style="font-size:1rem;">${escapeHtml(row.dataset.code)}</strong>`;
          } else {
            gauge.style.color = "var(--vg-text-muted)";
            gauge.textContent = "PRESIÓN INESTABLE · ESPERANDO COMBINACIÓN";
          }
        }
        emitChange();
      } else if (act === "toggle-nono") {
        window.AudioFX.mechanicalTick?.() || window.AudioFX.click();
        if (btn.classList.contains("on")) {
          btn.classList.remove("on");
          btn.classList.add("x-mark");
          btn.textContent = "X";
        } else if (btn.classList.contains("x-mark")) {
          btn.classList.remove("x-mark");
          btn.textContent = "";
        } else {
          btn.classList.add("on");
          btn.textContent = "";
        }
        emitChange();
      } else if (act === "cycle-logic") {
        window.AudioFX.click();
        const states = ["·", "X", "OK"];
        const idx = states.indexOf(btn.textContent.trim());
        btn.textContent = states[(idx + 1) % states.length];
        btn.style.color = btn.textContent === "OK" ? "#6EE7B7" : btn.textContent === "X" ? "#FDA4AF" : "#CBD5E1";
        emitChange();
      } else if (act === "reset-board") {
        window.AudioFX.click();
        const board = btn.dataset.board;
        if (board === "sudoku4") {
          container.querySelectorAll('[data-action="cycle-sudoku"]').forEach((c) => { c.textContent = "·"; });
        } else if (board === "nonogram") {
          container.querySelectorAll('[data-action="toggle-nono"]').forEach((c) => { c.classList.remove("on", "x-mark"); c.textContent = ""; });
        } else if (board === "logic3x3") {
          container.querySelectorAll('[data-action="cycle-logic"]').forEach((c) => { c.textContent = "·"; c.style.color = "#CBD5E1"; });
        }
        emitChange();
      } else if (act === "toggle-xray") {
        window.AudioFX.radioSweep?.() || window.AudioFX.click();
        const box = document.getElementById(`xray-box-${btn.dataset.day}`);
        if (box) {
          const open = box.style.display === "none";
          box.style.display = open ? "block" : "none";
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          const lbl = btn.dataset.label || "filtro espectral";
          btn.textContent = `${open ? "Ocultar" : "Activar"} ${lbl}`;
        }
        emitChange();
      }
    });

    container.addEventListener("input", (e) => {
      const inp = e.target;
      if (inp.dataset.action === "tune-freq") {
        const day = inp.dataset.day;
        const val = Number(inp.value);
        let bands = [];
        try { bands = JSON.parse(inp.dataset.bands || "[]"); } catch (_) {}
        if (!bands.length && inp.dataset.target) {
          bands = [{ hz: Number(inp.dataset.target), text: inp.dataset.clear || "" }];
        }
        const lbl = document.getElementById(`freq-val-${day}`);
        const sigEl = document.getElementById(`freq-sig-${day}`);
        const smeter = document.getElementById(`freq-smeter-${day}`);
        const msg = document.getElementById(`freq-msg-${day}`);
        if (lbl) lbl.textContent = `${val} Hz`;
        let minDist = 999;
        let hitBand = null;
        bands.forEach((b) => {
          const d = Math.abs(val - Number(b.hz));
          if (d < minDist) minDist = d;
          if (d === 0) hitBand = b;
        });
        const sigPct = hitBand ? 100 : minDist <= 40 ? Math.max(18, Math.round(92 - minDist * 1.7)) : 8;
        if (sigEl) sigEl.textContent = `${sigPct}%`;
        if (smeter) {
          smeter.style.width = `${sigPct}%`;
          smeter.style.background = hitBand ? "linear-gradient(90deg, #10B981, #34D399)" : minDist <= 40 ? "linear-gradient(90deg, #F59E0B, #38BDF8)" : "linear-gradient(90deg, #334155, #475569)";
        }
        if (msg) {
          if (hitBand) {
            window.AudioFX.radioSweep?.();
            msg.style.color = "#67E8F9";
            msg.style.borderColor = "rgba(0,229,255,0.5)";
            msg.textContent = hitBand.text || "";
          } else {
            msg.style.color = "var(--vg-text-muted)";
            msg.style.borderColor = "rgba(255,255,255,0.08)";
            msg.textContent = minDist <= 40
              ? "[ ~ PORTADORA PRÓXIMA DETECTADA · AJUSTA FINO EL DIAL ~ ]"
              : "[ #%& RUIDO DE VENTISCA · BARRE EL DIAL BUSCANDO PICOS DE SEÑAL ##@ ]";
          }
        }
        emitChange();
      } else if (inp.dataset.action === "slide-caliper") {
        const day = inp.dataset.day;
        const val = Number(inp.value);
        const target = Number(inp.dataset.target);
        const lbl = document.getElementById(`caliper-val-${day}`);
        const bar = document.getElementById(`caliper-bar-${day}`);
        const st = document.getElementById(`caliper-status-${day}`);
        if (lbl) lbl.textContent = `${val.toFixed(1)} cm`;
        if (bar) {
          const x = 20 + ((val - 22.0) / 7.0) * 210;
          bar.setAttribute("x1", String(Math.min(230, x)));
          bar.setAttribute("x2", String(Math.min(230, x)));
        }
        if (st) {
          if (Math.abs(val - target) < 0.01) {
            st.style.color = "#6EE7B7";
            st.textContent = `ALINEADO EXACTO: ${target.toFixed(1)} cm (longitud exterior de suela).`;
          } else {
            st.style.color = "var(--vg-text-muted)";
            st.textContent = "Desliza la línea verde hasta el borde derecho de la suela";
          }
        }
        emitChange();
      } else if (inp.id && inp.id.startsWith("manual-code-")) {
        emitChange();
      }
    });
  }

  return {
    normalizeAnswer,
    matchesHashes,
    decodePayload,
    renderWidgetHtml,
    wireWidgetEvents,
    serializeWidgetState,
    restoreWidgetState,
    escapeHtml
  };
})();
