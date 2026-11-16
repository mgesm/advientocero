/**
 * ADVIENTO CERO — CONTROLADOR PRINCIPAL DE APLICACIÓN
 */

(() => {
  const ROLE_KEY = "adviento_player_role";
  let currentRole = localStorage.getItem(ROLE_KEY) || "";
  let activeTab = "calendar";
  let selectedDayNum = 1;
  let suspectFilter = "all";
  let syncState = window.SyncEngine.getState();
  let syncMode = window.SyncEngine.getMode();
  let versionTapCount = 0;
  let versionTapTimer = null;

  const esc = (s) => window.PuzzleEngine.escapeHtml(s);

  function getSvg(name) {
    const icons = {
      lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      unlock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
      check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      hourglass: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`,
      users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      flake: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>`,
      gift: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`
    };
    return icons[name] || "";
  }

  function initSnowCanvas() {
    const canvas = document.getElementById("snow-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
    const flakes = Array.from({ length: 42 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 2.1,
      vy: 0.25 + Math.random() * 0.65,
      vx: -0.25 + Math.random() * 0.5,
      a: 0.25 + Math.random() * 0.55
    }));
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy;
        f.x += f.vx;
        if (f.y > h) { f.y = -4; f.x = Math.random() * w; }
        if (f.x > w) f.x = 0;
        if (f.x < 0) f.x = w;
        ctx.fillStyle = `rgba(148, 163, 184, ${f.a * 0.72})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  function selectDefaultDay() {
    const maxOpen = window.DateGate.getMaxOpenDay();
    if (maxOpen <= 0) {
      selectedDayNum = 1;
      return;
    }
    for (let d = 1; d <= maxOpen; d++) {
      if (!syncState.days?.[String(d)]?.solved) {
        selectedDayNum = d;
        return;
      }
    }
    selectedDayNum = maxOpen;
  }

  function setRole(role) {
    currentRole = role;
    localStorage.setItem(ROLE_KEY, role);
    document.getElementById("identity-overlay")?.classList.remove("open");
    window.SyncEngine.markPresence(role);
    window.AudioFX.click();
    renderAll();
  }

  function switchTab(tab) {
    activeTab = tab;
    window.AudioFX.click();
    document.querySelectorAll(".view-panel").forEach((el) => {
      el.classList.toggle("active", el.id === `view-${tab}`);
    });
    document.querySelectorAll(".dock-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getDayStatus(dayNum) {
    const ds = syncState.days?.[String(dayNum)] || {};
    if (ds.solved) return "solved";
    if (!window.DateGate.isDayOpen(dayNum)) return "locked";
    if (ds.miguelSolved || ds.patriSolved) return "waiting";
    return "available";
  }

  function renderTopbar() {
    const rolePill = document.getElementById("topbar-role-pill");
    const syncPill = document.getElementById("topbar-sync-pill");
    const muteBtn = document.getElementById("topbar-mute-btn");
    if (rolePill) {
      rolePill.textContent = currentRole === "miguel" ? "Terminal: Miguel" : currentRole === "patri" ? "Terminal: Patri" : "Sin perfil";
      rolePill.className = `badge ${currentRole === "patri" ? "badge-gold" : "badge-frost"}`;
    }
    if (syncPill) {
      const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
      const partnerOnline = syncState.presence?.[partnerRole]?.online;
      if (syncMode === "firebase") {
        syncPill.className = "badge badge-pine";
        syncPill.innerHTML = `<span class="pulse-dot"></span> ${partnerOnline ? "En pareja online" : "Nube activa"}`;
      } else {
        syncPill.className = "badge badge-crimson";
        syncPill.textContent = "Modo Local";
      }
    }
    if (muteBtn) {
      muteBtn.textContent = window.AudioFX.isMuted() ? "Audio OFF" : "Audio ON";
    }
  }

  function renderAdminBar() {
    const bar = document.getElementById("admin-bar");
    if (!bar) return;
    if (!window.DateGate.isAdminEnabled()) {
      bar.style.display = "none";
      return;
    }
    const sim = window.DateGate.getSimulatedDay();
    bar.style.display = "flex";
    bar.innerHTML = `
      <span class="badge badge-gold">MODO TEST (Cero Spoilers)</span>
      <label class="mono" style="font-size:0.75rem;color:var(--vg-text-secondary);display:flex;align-items:center;gap:6px;">
        Simular día:
        <select id="admin-sim-select" class="adv-select" style="min-height:32px;padding:4px 8px;width:auto;font-size:0.76rem;">
          <option value="0" ${sim === 0 ? "selected" : ""}>Antes del 1 dic</option>
          ${Array.from({ length: 24 }, (_, i) => i + 1).map((d) => `<option value="${d}" ${sim === d ? "selected" : ""}>${d} de diciembre</option>`).join("")}
        </select>
      </label>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-reset-btn" style="color:#FDA4AF;border-color:rgba(255,45,85,0.4);">Resetear partida</button>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-exit-btn">Salir test</button>
    `;

    document.getElementById("admin-sim-select")?.addEventListener("change", (e) => {
      window.DateGate.setSimulatedDay(e.target.value);
      selectDefaultDay();
      renderAll();
    });
    document.getElementById("admin-exit-btn")?.addEventListener("click", () => {
      window.DateGate.disableAdmin();
      selectDefaultDay();
      renderAll();
    });
    document.getElementById("admin-reset-btn")?.addEventListener("click", () => {
      if (confirm("¿Resetear todo el progreso de prueba (puertas, descartes y notas) para dejarlo limpio como regalo?")) {
        window.SyncEngine.resetAll();
      }
    });
  }

  function renderCalendarView() {
    const container = document.getElementById("view-calendar");
    if (!container) return;
    const solvedCount = Object.values(syncState.days || {}).filter((d) => d && d.solved).length;
    const activeSuspects = 25 - (syncState.discardedIds?.length || 0);
    const maxOpen = window.DateGate.getMaxOpenDay();
    const gift = window.GIFT_CONFIG;

    const doorsHtml = (window.ADVENT_DAYS || []).map((d) => {
      const st = getDayStatus(d.day);
      const numStr = String(d.day).padStart(2, "0");
      let icon = getSvg("lock");
      let statusLabel = d.day === 24 ? "Nochebuena" : "Cerrada";
      if (st === "available") { icon = getSvg("unlock"); statusLabel = "Abrir hoy"; }
      else if (st === "waiting") { icon = getSvg("hourglass"); statusLabel = "1/2 Listo"; }
      else if (st === "solved") { icon = getSvg("check"); statusLabel = "Descubierta"; }

      return `
        <button type="button" class="door-card state-${st} ${d.day === 24 ? "is-day24" : ""}" data-open-day="${d.day}">
          <div class="door-num-row">
            <span class="door-num">${numStr}</span>
            <span class="door-icon">${icon}</span>
          </div>
          <div class="door-meta">
            <div class="door-title">${st === "locked" ? (d.day === 24 ? "Gran Final 24 Dic" : `Puerta ${numStr} Dic`) : esc(d.title)}</div>
            <div class="door-status-txt">${statusLabel}</div>
          </div>
        </button>`;
    }).join("");

    container.innerHTML = `
      <div class="glass-card hero-dossier">
        <svg class="hero-star-watermark" width="96" height="96" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.5 5.8 21 7 14 2 9.3 9 8.5"/>
        </svg>
        <div class="hero-thumb-wrap">
          <img src="imagenes/cover-hotel.jpg" alt="Hotel El Mirador del Ventisquero" class="hero-thumb">
          <span class="hero-thumb-tag">${esc(window.CASE_LORE.caseCode)}</span>
        </div>
        <div>
          <span class="badge badge-gold">${esc(gift.editionLabel)}</span>
          <h1 class="hero-title">El Misterio del Ventisquero</h1>
          <p class="hero-summary">
            Nieve, 25 sospechosos incomunicados y 24 noches de investigación cooperativa.
            ${maxOpen === 0 ? `<strong style="color:var(--adv-gold-soft);">${esc(window.DateGate.getCountdownText())}.</strong>` : `Puertas abiertas hasta el <strong>${maxOpen} de diciembre</strong>.`}
          </p>
          <div class="stats-strip">
            <div class="stat-pill">
              <span class="stat-val" style="color:var(--adv-pine);">${solvedCount}/24</span>
              <span class="stat-lbl">Puertas resueltas</span>
            </div>
            <div class="stat-pill">
              <span class="stat-val" style="color:var(--adv-gold-soft);">${activeSuspects}</span>
              <span class="stat-lbl">Sospechosos</span>
            </div>
            <div class="stat-pill">
              <span class="stat-val" style="color:var(--adv-frost);">${currentRole === "miguel" ? "MIG" : "PAT"}</span>
              <span class="stat-lbl">Tu terminal</span>
            </div>
          </div>
        </div>
      </div>

      ${maxOpen >= 1 ? `
        <div class="glass-card" style="padding:16px 18px;margin-bottom:18px;border:var(--vg-border-gold);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <div>
              <div class="mono" style="font-size:0.7rem;color:var(--adv-gold-soft);">${esc(gift.openingDedication.badge)}</div>
              <div style="font-weight:700;font-size:0.98rem;margin-top:2px;">${esc(gift.openingDedication.title)}</div>
            </div>
            <button type="button" class="btn btn-sm btn-primary" id="open-dedication-btn">${getSvg("gift")} Leer dedicatoria</button>
          </div>
        </div>
      ` : ""}

      <div class="section-head">
        <h2 class="section-title">Calendario de Adviento (1–24 de diciembre)</h2>
        <span class="mono" style="font-size:0.74rem;color:var(--vg-text-secondary);">Toca una puerta abierta para investigar</span>
      </div>
      <div class="advent-grid">${doorsHtml}</div>
    `;

    container.querySelectorAll("[data-open-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = Number(btn.dataset.openDay);
        if (!window.DateGate.isDayOpen(d)) {
          window.AudioFX.error();
          alert(`La Puerta ${String(d).padStart(2, "0")} se abrirá el ${d} de diciembre.`);
          return;
        }
        selectedDayNum = d;
        switchTab("day");
        renderDayView();
      });
    });

    document.getElementById("open-dedication-btn")?.addEventListener("click", openDedicationModal);
  }

  function renderDayView() {
    const container = document.getElementById("view-day");
    if (!container) return;
    const dayObj = (window.ADVENT_DAYS || []).find((x) => x.day === selectedDayNum);
    if (!dayObj) return;

    if (!window.DateGate.isDayOpen(dayObj.day)) {
      container.innerHTML = `
        <div class="glass-card" style="padding:26px;text-align:center;">
          <div style="color:var(--adv-gold-soft);margin-bottom:10px;">${getSvg("lock")}</div>
          <h2 class="day-title">Puerta ${String(dayObj.day).padStart(2, "0")} precintada</h2>
          <p class="day-story">Esta prueba se desbloqueará automáticamente el <strong>${dayObj.day} de diciembre</strong>.</p>
          <button type="button" class="btn btn-primary" style="margin-top:16px;" data-back-cal>Volver al Calendario</button>
        </div>`;
      container.querySelector("[data-back-cal]")?.addEventListener("click", () => switchTab("calendar"));
      return;
    }

    const role = currentRole === "patri" ? "patri" : "miguel";
    const roleData = dayObj[role];
    const dState = syncState.days?.[String(dayObj.day)] || {};
    const hintsCount = syncState.hintsUnlocked?.[String(dayObj.day)] || 0;
    const isSolved = Boolean(dState.solved);
    const partnerName = role === "miguel" ? "Patri" : "Miguel";
    const myDone = role === "miguel" ? Boolean(dState.miguelSolved) : Boolean(dState.patriSolved);
    const partnerDone = role === "miguel" ? Boolean(dState.patriSolved) : Boolean(dState.miguelSolved);

    let validationHtml = "";
    if (!isSolved) {
      if (dayObj.mode === "dual-lock") {
        validationHtml = `
          <div class="glass-card answer-card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
              <strong>Validación en Doble Candado</strong>
              <div style="display:flex;gap:6px;">
                <span class="badge ${dState.miguelSolved ? "badge-pine" : "badge-frost"}">Miguel: ${dState.miguelSolved ? "OK" : "Pendiente"}</span>
                <span class="badge ${dState.patriSolved ? "badge-pine" : "badge-gold"}">Patri: ${dState.patriSolved ? "OK" : "Pendiente"}</span>
              </div>
            </div>
            ${myDone ? `
              <div class="feedback-banner success">
                Tu parte está validada. ${partnerDone ? "" : `Esperando a que <strong>${partnerName}</strong> valide la suya en su móvil.`}
              </div>
            ` : `
              <form id="day-answer-form">
                <div class="input-group">
                  <label class="input-label" for="day-answer-input">${esc(roleData.inputLabel)}</label>
                  <input id="day-answer-input" type="text" class="adv-input" placeholder="${esc(roleData.inputPlaceholder || "")}" autocomplete="off" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">Validar mi parte (${role === "miguel" ? "Miguel" : "Patri"})</button>
              </form>
            `}
            <div id="day-feedback"></div>
          </div>`;
      } else {
        validationHtml = `
          <div class="glass-card answer-card">
            <strong style="display:block;margin-bottom:10px;">Resolución Conjunta del Día ${String(dayObj.day).padStart(2, "0")}</strong>
            <form id="day-answer-form">
              <div class="input-group">
                <label class="input-label" for="day-answer-input">${esc(dayObj.jointInput.label)}</label>
                <input id="day-answer-input" type="text" class="adv-input" placeholder="${esc(dayObj.jointInput.placeholder || "")}" autocomplete="off" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Validar y Descartar Sospechoso</button>
            </form>
            <div id="day-feedback"></div>
          </div>`;
      }
    } else {
      const suspect = (window.SUSPECTS_DATA || []).find((s) => s.id === dState.discardId);
      validationHtml = `
        <div class="glass-card answer-card" style="border:var(--vg-border-pine);">
          <span class="badge badge-pine">${esc(dState.forensicTag || "DÍA RESUELTO")}</span>
          <h3 style="margin:10px 0 6px;font-size:1.1rem;">Sospechoso descartado: ${suspect ? esc(suspect.name) : ""}</h3>
          <p class="day-story">${esc(dState.conclusion)}</p>
        </div>`;
    }

    // Paso 2 del Día 24 (Juicio Final)
    let finalTrialHtml = "";
    if (dayObj.day === 24 && isSolved) {
      if (!syncState.finalVerdictSolved) {
        const remaining = (window.SUSPECTS_DATA || []).filter((s) => !(syncState.discardedIds || []).includes(s.id));
        finalTrialHtml = `
          <div class="glass-card answer-card" style="border:var(--vg-border-crimson);">
            <span class="badge badge-crimson">PASO 2 · ORDEN DE DETENCIÓN FINAL</span>
            <h3 style="margin:10px 0 6px;font-size:1.15rem;">Emitir Acusación Conjunta</h3>
            <p class="day-story" style="margin-bottom:12px;">Con 24 descartes completados, introducid juntos al culpable, el veneno usado y la maniobra realizada durante el crimen.</p>
            <form id="final-verdict-form">
              <div class="input-group">
                <label class="input-label" for="fv-suspect">Culpable del crimen</label>
                <select id="fv-suspect" class="adv-select" required>
                  <option value="">Selecciona al sospechoso restante...</option>
                  ${remaining.map((s) => `<option value="${esc(s.id)}">${esc(s.num)} · ${esc(s.name)} (${esc(s.role)})</option>`).join("")}
                </select>
              </div>
              <div class="input-group">
                <label class="input-label" for="fv-poison">Veneno hallado en la copa</label>
                <input id="fv-poison" type="text" class="adv-input" placeholder="Ej. nombre de la toxina o planta" required>
              </div>
              <div class="input-group">
                <label class="input-label" for="fv-method">Maniobra ejecutada desde Planta 1 a las 23:38 h</label>
                <input id="fv-method" type="text" class="adv-input" placeholder="Ej. palabra clave de la maniobra" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Ejecutar Orden de Detención</button>
            </form>
            <div id="final-feedback"></div>
          </div>`;
      } else {
        const ep = syncState.finalEpilogue || {};
        const gift = window.GIFT_CONFIG.finalGiftReveal;
        finalTrialHtml = `
          <div class="glass-card answer-card" style="border:var(--vg-border-pine);">
            <span class="badge badge-pine">${esc(ep.title || "CASO CERRADO")}</span>
            <h3 style="margin:10px 0 8px;font-size:1.2rem;">Culpable arrestada: ${esc(ep.culpritName || "")}</h3>
            <p class="day-story">${esc(ep.confession || "")}</p>
          </div>
          <div class="glass-card gift-reveal-card">
            <span class="badge badge-gold">${getSvg("gift")} ${esc(gift.badge)}</span>
            <h2 class="serif" style="font-size:1.7rem;margin:10px 0 8px;">${esc(gift.title)}</h2>
            ${(gift.message || []).map((p) => `<p class="day-story" style="margin-bottom:8px;">${esc(p)}</p>`).join("")}
            <div class="gift-voucher">
              <div class="mono" style="font-size:0.78rem;color:var(--adv-gold-soft);font-weight:700;margin-bottom:6px;">${esc(gift.voucherTitle)}</div>
              <p style="font-size:0.9rem;line-height:1.55;color:var(--vg-text-primary);">${esc(gift.voucherDescription)}</p>
            </div>
            <p class="serif" style="margin-top:14px;font-size:1.1rem;font-style:italic;color:var(--adv-gold-soft);">${esc(gift.footerNote)}</p>
          </div>`;
      }
    }

    const hintsHtml = (dayObj.hints || []).slice(0, hintsCount).map((h, i) => `
      <div class="hint-item"><strong>Pista ${i + 1}:</strong> ${esc(h)}</div>
    `).join("");

    container.innerHTML = `
      <div class="day-workspace">
        <div class="glass-card day-header-card">
          <div class="day-kicker-row">
            <span class="badge badge-gold">${esc(dayObj.kicker)}</span>
            <div style="display:flex;gap:6px;">
              <button type="button" class="btn btn-sm btn-ghost" data-day-nav="-1" ${selectedDayNum <= 1 ? "disabled" : ""}>Anterior</button>
              <button type="button" class="btn btn-sm btn-ghost" data-day-nav="1" ${selectedDayNum >= 24 ? "disabled" : ""}>Siguiente</button>
            </div>
          </div>
          <h1 class="day-title">${esc(dayObj.title)}</h1>
          <p class="day-story">${esc(dayObj.story)}</p>
        </div>

        <div class="glass-card terminal-card role-${role}">
          <div class="terminal-banner">
            <span class="terminal-role-label">${esc(roleData.roleBadge)}</span>
            <span class="badge ${role === "miguel" ? "badge-frost" : "badge-gold"}">Exclusivo de ${role === "miguel" ? "Miguel" : "Patri"}</span>
          </div>
          <p style="font-size:0.84rem;color:var(--vg-text-secondary);margin-bottom:12px;">${esc(roleData.brief)}</p>
          <div class="clue-box">${roleData.clueHtml}</div>
          <div class="partner-callout">
            <span style="flex-shrink:0;margin-top:1px;">${getSvg("users")}</span>
            <div><strong>Qué hablar con ${partnerName}:</strong> ${esc(roleData.partnerHint)}</div>
          </div>
          <div id="widget-mount">${window.PuzzleEngine.renderWidgetHtml(dayObj.day, role, roleData.widget)}</div>
        </div>

        ${validationHtml}
        ${finalTrialHtml}

        <div class="glass-card" style="padding:16px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <span style="font-size:0.84rem;font-weight:600;">¿Atascados? Pistas progresivas (${hintsCount}/3)</span>
            <button type="button" class="btn btn-sm btn-ghost" id="reveal-hint-btn" ${hintsCount >= 3 ? "disabled" : ""}>
              ${hintsCount >= 3 ? "Máximo alcanzado" : `Mostrar Pista ${hintsCount + 1}`}
            </button>
          </div>
          <div class="hints-accordion">${hintsHtml}</div>
        </div>
      </div>
    `;

    const widgetMount = document.getElementById("widget-mount");
    if (widgetMount) window.PuzzleEngine.wireWidgetEvents(widgetMount);

    container.querySelectorAll("[data-day-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = selectedDayNum + Number(btn.dataset.dayNav);
        if (next >= 1 && next <= 24) {
          selectedDayNum = next;
          renderDayView();
        }
      });
    });

    document.getElementById("reveal-hint-btn")?.addEventListener("click", () => {
      window.AudioFX.click();
      window.SyncEngine.pushUpdate((st) => {
        const cur = st.hintsUnlocked[String(dayObj.day)] || 0;
        if (cur < 3) st.hintsUnlocked[String(dayObj.day)] = cur + 1;
      });
    });

    document.getElementById("day-answer-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const inp = document.getElementById("day-answer-input");
      const fb = document.getElementById("day-feedback");
      if (!inp || !fb) return;

      const hashes = dayObj.mode === "dual-lock" ? roleData.acceptedHashes : dayObj.jointInput.acceptedHashes;
      const ok = await window.PuzzleEngine.matchesHashes(inp.value, hashes);

      if (!ok) {
        window.AudioFX.error();
        fb.innerHTML = `<div class="feedback-banner error">Código incorrecto. Volved a contrastar los datos entre Miguel y Patri.</div>`;
        return;
      }

      window.AudioFX.success();
      const decoded = window.PuzzleEngine.decodePayload(dayObj.unlockPayload);
      window.SyncEngine.pushUpdate((st) => {
        const key = String(dayObj.day);
        if (!st.days[key]) st.days[key] = {};
        if (dayObj.mode === "dual-lock") {
          if (role === "miguel") st.days[key].miguelSolved = true;
          else st.days[key].patriSolved = true;

          if (st.days[key].miguelSolved && st.days[key].patriSolved && decoded) {
            st.days[key].solved = true;
            st.days[key].discardId = decoded.discardId;
            st.days[key].forensicTag = decoded.forensicTag;
            st.days[key].conclusion = decoded.conclusion;
            if (!st.discardedIds.includes(decoded.discardId)) st.discardedIds.push(decoded.discardId);
          }
        } else if (decoded) {
          st.days[key].solved = true;
          st.days[key].discardId = decoded.discardId;
          st.days[key].forensicTag = decoded.forensicTag;
          st.days[key].conclusion = decoded.conclusion;
          if (!st.discardedIds.includes(decoded.discardId)) st.discardedIds.push(decoded.discardId);
        }
      });
    });

    document.getElementById("final-verdict-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const sVal = document.getElementById("fv-suspect")?.value || "";
      const pVal = document.getElementById("fv-poison")?.value || "";
      const mVal = document.getElementById("fv-method")?.value || "";
      const fb = document.getElementById("final-feedback");
      const fv = dayObj.finalVerdict;

      const ok1 = await window.PuzzleEngine.matchesHashes(sVal, fv.suspectHashes);
      const ok2 = await window.PuzzleEngine.matchesHashes(pVal, fv.poisonHashes);
      const ok3 = await window.PuzzleEngine.matchesHashes(mVal, fv.methodHashes);

      if (!ok1 || !ok2 || !ok3) {
        window.AudioFX.error();
        if (fb) fb.innerHTML = `<div class="feedback-banner error">Alguno de los tres elementos del veredicto no coincide con la prueba reina de ambos terminales.</div>`;
        return;
      }

      window.AudioFX.success();
      const decoded = window.PuzzleEngine.decodePayload(dayObj.unlockPayload);
      window.SyncEngine.pushUpdate((st) => {
        st.finalVerdictSolved = true;
        st.finalEpilogue = decoded?.finalEpilogue || null;
      });
    });
  }

  function renderSuspectsView() {
    const container = document.getElementById("view-suspects");
    if (!container) return;
    const discarded = syncState.discardedIds || [];
    const list = (window.SUSPECTS_DATA || []).filter((s) => {
      const isOut = discarded.includes(s.id);
      if (suspectFilter === "pending") return !isOut;
      if (suspectFilter === "discarded") return isOut;
      return true;
    });

    container.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">Tablero de Sospechosos (${25 - discarded.length} activos)</h2>
        <span class="badge badge-crimson">${discarded.length}/24 descartados</span>
      </div>

      <div class="suspect-filters">
        <button type="button" class="filter-chip ${suspectFilter === "all" ? "active" : ""}" data-filter="all">Todos (25)</button>
        <button type="button" class="filter-chip ${suspectFilter === "pending" ? "active" : ""}" data-filter="pending">Sospechosos (${25 - discarded.length})</button>
        <button type="button" class="filter-chip ${suspectFilter === "discarded" ? "active" : ""}" data-filter="discarded">Descartados (${discarded.length})</button>
      </div>

      <div class="suspects-grid">
        ${list.map((s) => {
          const isOut = discarded.includes(s.id);
          const isCulprit = syncState.finalVerdictSolved && !isOut;
          return `
            <article class="suspect-card ${isOut ? "is-discarded" : ""} ${isCulprit ? "is-culprit-final" : ""}" data-suspect-id="${esc(s.id)}">
              <div class="suspect-avatar-wrap">
                <img src="${esc(s.portrait)}" alt="${esc(s.name)}" class="suspect-avatar" loading="lazy">
                ${isOut ? `<div class="suspect-stamp">Descartado</div>` : ""}
              </div>
              <div class="suspect-info">
                <div class="suspect-top-row">
                  <span class="suspect-num">FICHA #${esc(s.num)}</span>
                  <span class="suspect-room">${esc(s.room)}</span>
                </div>
                <div class="suspect-name">${esc(s.name)}</div>
                <div class="suspect-role">${esc(s.role)}</div>
                <p class="suspect-alibi">${esc(s.alibiClaim)}</p>
              </div>
            </article>`;
        }).join("")}
      </div>

      <div class="glass-card" style="padding:18px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <strong>Libreta Compartida (Miguel y Patri)</strong>
          <span class="mono" style="font-size:0.7rem;color:var(--vg-text-muted);" id="notes-status">${syncMode === "firebase" ? "Sincronizada en nube" : "Guardado local"}</span>
        </div>
        <textarea id="shared-notes-area" class="adv-textarea" placeholder="Anotad aquí sospechas, teorías o pistas compartidas...">${esc(syncState.sharedNotes || "")}</textarea>
      </div>
    `;

    container.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        suspectFilter = btn.dataset.filter;
        renderSuspectsView();
      });
    });

    container.querySelectorAll("[data-suspect-id]").forEach((card) => {
      card.addEventListener("click", () => openSuspectModal(card.dataset.suspectId));
    });

    let noteTimer = null;
    const ta = document.getElementById("shared-notes-area");
    ta?.addEventListener("input", () => {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        window.SyncEngine.pushUpdate((st) => {
          st.sharedNotes = ta.value;
        });
      }, 450);
    });
  }

  function renderExpedienteView() {
    const container = document.getElementById("view-expediente");
    if (!container) return;
    const lore = window.CASE_LORE;

    container.innerHTML = `
      <div class="day-workspace">
        <div class="glass-card" style="padding:18px;">
          <span class="badge badge-crimson">ATESTADO INICIAL · 30 NOV</span>
          <h2 class="serif" style="font-size:1.5rem;margin:10px 0 6px;">${esc(lore.victim.name)} (${lore.victim.age} años)</h2>
          <p class="day-story" style="margin-bottom:8px;"><strong>Cargo:</strong> ${esc(lore.victim.role)}</p>
          <p class="day-story" style="margin-bottom:8px;"><strong>Hallazgo:</strong> ${esc(lore.victim.foundAt)}</p>
          <p class="day-story">${esc(lore.victim.initialFinding)}</p>
          <ul class="clue-list" style="margin-top:12px;">
            ${lore.incidentSummary.map((line) => `<li>${esc(line)}</li>`).join("")}
          </ul>
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:12px;">Escenas del Complejo</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
            ${lore.scenes.map((sc) => `
              <div style="border-radius:14px;overflow:hidden;border:1.5px solid #E7E5E4;background:#FFF7ED;">
                <img src="${esc(sc.src)}" alt="${esc(sc.title)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;">
                <div style="padding:10px 12px;">
                  <div style="font-weight:700;font-size:0.86rem;color:#7F1D1D;">${esc(sc.title)}</div>
                  <div style="font-size:0.75rem;color:#57534E;margin-top:3px;">${esc(sc.caption)}</div>
                </div>
              </div>`).join("")}
          </div>
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:10px;">Plano por Plantas del Hotel</h3>
          <ul class="clue-list">
            ${lore.hotelZones.map((z) => `<li><strong>${esc(z.floor)} · ${esc(z.zone)}:</strong> ${esc(z.note)}</li>`).join("")}
          </ul>
        </div>

        <div style="text-align:center;padding:10px 0;">
          <button type="button" id="version-secret-trigger" class="mono" style="background:none;border:none;color:var(--vg-text-muted);font-size:0.72rem;cursor:pointer;">
            v1.0.0 · ADVIENTO CERO · MODO CERO SPOILERS
          </button>
        </div>
      </div>
    `;

    document.getElementById("version-secret-trigger")?.addEventListener("click", () => {
      versionTapCount += 1;
      clearTimeout(versionTapTimer);
      versionTapTimer = setTimeout(() => { versionTapCount = 0; }, 2200);
      if (versionTapCount >= 5) {
        versionTapCount = 0;
        window.DateGate.enableAdmin(24);
        window.AudioFX.success();
        selectDefaultDay();
        renderAll();
      }
    });
  }

  function openSuspectModal(suspectId) {
    const s = (window.SUSPECTS_DATA || []).find((x) => x.id === suspectId);
    const modal = document.getElementById("adv-modal");
    const body = document.getElementById("adv-modal-body");
    if (!s || !modal || !body) return;
    const isOut = (syncState.discardedIds || []).includes(s.id);
    const solvedEntry = Object.values(syncState.days || {}).find((d) => d && d.discardId === s.id && d.solved);

    body.innerHTML = `
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px;">
        <img src="${esc(s.portrait)}" alt="${esc(s.name)}" style="width:82px;height:82px;border-radius:14px;object-fit:cover;border:var(--vg-border-specular-strong);">
        <div>
          <span class="badge ${isOut ? "badge-crimson" : "badge-gold"}">${isOut ? "DESCARTADO" : `FICHA #${esc(s.num)}`}</span>
          <h3 style="font-size:1.25rem;margin-top:6px;">${esc(s.name)}</h3>
          <div style="font-size:0.82rem;color:var(--vg-text-secondary);">${esc(s.role)} · ${esc(s.room)}</div>
        </div>
      </div>
      <div class="clue-box">
        <p style="margin-bottom:8px;"><strong>Posible motivo:</strong> ${esc(s.motiveHint)}</p>
        <p><strong>Coartada inicial:</strong> ${esc(s.alibiClaim)}</p>
      </div>
      ${solvedEntry ? `<div class="feedback-banner success"><strong>Resolución:</strong> ${esc(solvedEntry.conclusion)}</div>` : ""}
      <button type="button" class="btn btn-ghost" style="width:100%;margin-top:14px;" id="close-modal-btn">Cerrar ficha</button>
    `;
    modal.classList.add("open");
    document.getElementById("close-modal-btn")?.addEventListener("click", () => modal.classList.remove("open"));
  }

  function openDedicationModal() {
    const g = window.GIFT_CONFIG.openingDedication;
    const modal = document.getElementById("adv-modal");
    const body = document.getElementById("adv-modal-body");
    if (!modal || !body) return;
    body.innerHTML = `
      <span class="badge badge-gold">${esc(g.badge)}</span>
      <h2 class="serif" style="font-size:1.75rem;margin:10px 0 12px;">${esc(g.title)}</h2>
      ${g.body.map((p) => `<p class="day-story" style="margin-bottom:10px;">${esc(p)}</p>`).join("")}
      <p class="serif" style="font-size:1.15rem;font-style:italic;color:var(--adv-gold-soft);margin-top:14px;">${esc(g.signature)}</p>
      <button type="button" class="btn btn-primary" style="width:100%;margin-top:16px;" id="close-modal-btn">Empezar a investigar</button>
    `;
    modal.classList.add("open");
    document.getElementById("close-modal-btn")?.addEventListener("click", () => modal.classList.remove("open"));
  }

  function renderAll() {
    renderTopbar();
    renderAdminBar();
    renderCalendarView();
    renderDayView();
    renderSuspectsView();
    renderExpedienteView();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSnowCanvas();

    if (!currentRole) {
      document.getElementById("identity-overlay")?.classList.add("open");
    }

    document.querySelectorAll("[data-choose-role]").forEach((btn) => {
      btn.addEventListener("click", () => setRole(btn.dataset.chooseRole));
    });

    document.getElementById("topbar-role-pill")?.addEventListener("click", () => {
      document.getElementById("identity-overlay")?.classList.add("open");
    });

    document.getElementById("topbar-mute-btn")?.addEventListener("click", () => {
      window.AudioFX.toggleMute();
      renderTopbar();
    });

    document.querySelectorAll(".dock-item").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    document.getElementById("adv-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "adv-modal") e.target.classList.remove("open");
    });

    window.SyncEngine.subscribe((st, md) => {
      syncState = st;
      syncMode = md;
      renderAll();
    });

    window.SyncEngine.init();
    if (currentRole) window.SyncEngine.markPresence(currentRole);
    selectDefaultDay();
    renderAll();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  });
})();
