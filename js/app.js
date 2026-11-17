/**
 * ADVIENTO CERO — CONTROLADOR PRINCIPAL DE APLICACIÓN
 */

(() => {
  const APP_VERSION = "v2.2.0";
  const ROLE_KEY = "adviento_player_role";
  const DEDICATION_SEEN_KEY = "adviento_dedication_seen_v1";

  let currentRole = localStorage.getItem(ROLE_KEY) || "";
  let activeTab = "calendar";
  let selectedDayNum = 1;
  let userPickedDay = false;
  let suspectFilter = "all";
  let syncState = window.SyncEngine.getState();
  let syncMode = window.SyncEngine.getMode();
  let versionTapCount = 0;
  let versionTapTimer = null;
  let noteTimer = null;
  let isSubmitting = false;
  let openModalSuspectId = null;
  let lastFocusedEl = null;
  let initialRemoteApplied = false;

  const tabScrollY = { calendar: 0, day: 0, suspects: 0, expediente: 0 };
  const localInputDrafts = {};
  const localVerdictDrafts = { suspect: "", poison: "", method: "" };
  let lastDaySignature = "";
  let lastSuspectsSignature = "";

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
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let resizeTimer = null;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth !== w || Math.abs(window.innerHeight - h) > 120) {
          w = canvas.width = window.innerWidth;
          h = canvas.height = window.innerHeight;
        }
      }, 180);
    });

    const flakeCount = w < 640 ? 42 : 78;
    const flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.0 + Math.random() * 2.4,
      vy: 0.35 + Math.random() * 0.9,
      vx: -0.25 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.02,
      a: 0.38 + Math.random() * 0.50
    }));

    const sparks = [];
    let rafId = null;

    window.triggerGoldBurst = (count = 36) => {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.6 + Math.random() * 4.4;
        sparks.push({
          x: w * 0.5,
          y: h * 0.42,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 1.4,
          r: 1.5 + Math.random() * 2.5,
          life: 1.0,
          color: i % 3 === 0 ? "253, 224, 71" : i % 3 === 1 ? "251, 191, 36" : "110, 231, 183"
        });
      }
      ensureTicking();
    };

    function shouldPauseSnow() {
      return document.hidden || document.body.classList.contains("modal-open");
    }

    function tick() {
      rafId = null;
      if (shouldPauseSnow() && sparks.length === 0) return;

      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.sway += f.swaySpeed;
        f.y += f.vy;
        f.x += f.vx + Math.sin(f.sway) * 0.25;
        if (f.y > h) { f.y = -6; f.x = Math.random() * w; }
        if (f.x > w) f.x = 0;
        if (f.x < 0) f.x = w;
        ctx.fillStyle = `rgba(241, 245, 249, ${f.a})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.06;
        s.life -= 0.018;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(${s.color}, ${s.life})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!shouldPauseSnow() || sparks.length > 0) {
        rafId = requestAnimationFrame(tick);
      }
    }

    function ensureTicking() {
      if (!rafId && !shouldPauseSnow()) {
        rafId = requestAnimationFrame(tick);
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) ensureTicking();
    });
    window.resumeSnow = ensureTicking;
    ensureTicking();
  }

  function pauseBriefingIframes() {
    document.querySelectorAll('iframe[src*="video-briefing"]').forEach((fr) => {
      try { fr.contentWindow?.postMessage({ type: "pause" }, "*"); } catch (_) {}
    });
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

  function openIdentityOverlay() {
    const overlay = document.getElementById("identity-overlay");
    const cancelBtn = document.getElementById("identity-cancel-btn");
    if (!overlay) return;
    if (cancelBtn) cancelBtn.style.display = currentRole ? "block" : "none";
    overlay.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeIdentityOverlay() {
    if (!currentRole) return;
    document.getElementById("identity-overlay")?.classList.remove("open");
    if (!document.getElementById("adv-modal")?.classList.contains("open")) {
      document.body.classList.remove("modal-open");
      if (window.resumeSnow) window.resumeSnow();
    }
  }

  function setRole(role) {
    currentRole = role;
    localStorage.setItem(ROLE_KEY, role);
    closeIdentityOverlay();
    window.SyncEngine.markPresence(role);
    window.AudioFX.click();
    lastDaySignature = "";
    lastSuspectsSignature = "";
    renderActiveTab();
    maybeShowFirstDedication();
  }

  function switchTab(tab, opts = {}) {
    if (activeTab === tab && !opts.force) return;
    tabScrollY[activeTab] = window.scrollY;
    if (activeTab === "day" || activeTab === "expediente") {
      pauseBriefingIframes();
    }
    activeTab = tab;
    if (!opts.silent) window.AudioFX.click();

    document.querySelectorAll(".view-panel").forEach((el) => {
      el.classList.toggle("active", el.id === `view-${tab}`);
    });
    document.querySelectorAll(".dock-item").forEach((btn) => {
      const isAct = btn.dataset.tab === tab;
      btn.classList.toggle("active", isAct);
      if (isAct) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    renderActiveTab();

    if (tab === "day" && opts.scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: tabScrollY[tab] || 0, behavior: "auto" });
    }

    if (!opts.fromHistory && window.history && window.history.pushState) {
      window.history.pushState({ tab, day: selectedDayNum }, "");
    }
  }

  function getDayStatus(dayNum) {
    const ds = syncState.days?.[String(dayNum)] || {};
    if (ds.solved) return "solved";
    if (!window.DateGate.isDayOpen(dayNum)) return "locked";
    if (ds.miguelSolved || ds.patriSolved) return "waiting";
    return "available";
  }

  function getSyncBadgeHtml() {
    const status = window.SyncEngine.getStatus();
    const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
    const partnerOnline = window.SyncEngine.isRoleOnline(partnerRole);
    if (status.syncError) {
      return `<span class="badge badge-crimson" title="${esc(status.syncError)}">Error sync</span>`;
    }
    if (status.mode === "firebase") {
      if (!status.connected) {
        return `<span class="badge badge-gold">Reconectando...</span>`;
      }
      return `<span class="badge badge-pine"><span class="pulse-dot"></span> ${partnerOnline ? "En pareja online" : "Nube activa"}</span>`;
    }
    return `<span class="badge badge-crimson">Modo Local</span>`;
  }

  function updateSyncBadgesOnly() {
    const html = getSyncBadgeHtml();
    document.querySelectorAll("[data-sync-slot]").forEach((el) => {
      el.innerHTML = html;
    });
    const notesStatus = document.getElementById("notes-status");
    if (notesStatus) {
      const st = window.SyncEngine.getStatus();
      notesStatus.textContent = st.syncError
        ? "Error al guardar en nube"
        : st.mode === "firebase" && st.connected
          ? "Sincronizada en nube"
          : "Guardado local";
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
    const otherRole = currentRole === "miguel" ? "patri" : "miguel";
    const otherLabel = otherRole === "miguel" ? "Miguel" : "Patri";
    bar.style.display = "flex";
    bar.innerHTML = `
      <span class="badge badge-gold">MODO TEST (Sala aislada · Cero Spoilers)</span>
      <button type="button" class="btn btn-sm btn-frost" id="admin-switch-role-btn">Cambiar a ${otherLabel}</button>
      <label class="mono" style="font-size:0.75rem;color:var(--vg-text-secondary);display:flex;align-items:center;gap:6px;">
        Simular día:
        <select id="admin-sim-select" class="adv-select" style="min-height:36px;padding:4px 8px;width:auto;font-size:16px;">
          <option value="0" ${sim === 0 ? "selected" : ""}>Antes del 1 dic</option>
          ${Array.from({ length: 24 }, (_, i) => i + 1).map((d) => `<option value="${d}" ${sim === d ? "selected" : ""}>${d} de diciembre</option>`).join("")}
        </select>
      </label>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-reset-btn" style="color:#FDA4AF;border-color:rgba(255,45,85,0.4);">Resetear partida test</button>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-exit-btn">Salir test</button>
    `;

    document.getElementById("admin-switch-role-btn")?.addEventListener("click", () => {
      setRole(otherRole);
    });

    document.getElementById("admin-sim-select")?.addEventListener("change", (e) => {
      window.DateGate.setSimulatedDay(e.target.value);
      userPickedDay = false;
      selectDefaultDay();
      lastDaySignature = "";
      lastSuspectsSignature = "";
      renderAdminBar();
      renderActiveTab();
    });

    document.getElementById("admin-exit-btn")?.addEventListener("click", () => {
      window.DateGate.disableAdmin();
      window.SyncEngine.init();
      userPickedDay = false;
      selectDefaultDay();
      lastDaySignature = "";
      lastSuspectsSignature = "";
      renderAdminBar();
      renderActiveTab();
    });

    document.getElementById("admin-reset-btn")?.addEventListener("click", () => {
      openConfirmModal(
        "Resetear sala de pruebas",
        "¿Resetear todo el progreso en la sala de pruebas (puertas, descartes y notas)? La partida real no se verá afectada.",
        "Sí, resetear test",
        () => {
          window.SyncEngine.resetAll();
          openDedicationModal();
        }
      );
    });
  }

  function renderCalendarView() {
    const container = document.getElementById("view-calendar");
    if (!container) return;
    const solvedCount = Object.values(syncState.days || {}).filter((d) => d && d.solved).length;
    const activeSuspects = 25 - (syncState.discardedIds?.length || 0);
    const maxOpen = window.DateGate.getMaxOpenDay();
    const gift = window.GIFT_CONFIG;
    const role = currentRole === "patri" ? "patri" : "miguel";
    const partnerName = role === "miguel" ? "Patri" : "Miguel";

    const doorsHtml = (window.ADVENT_DAYS || []).map((d) => {
      const st = getDayStatus(d.day);
      const ds = syncState.days?.[String(d.day)] || {};
      const numStr = String(d.day).padStart(2, "0");
      let icon = getSvg("lock");
      let statusLabel = d.day === 24 ? "Nochebuena" : "Cerrada";
      if (st === "available") { icon = getSvg("unlock"); statusLabel = "Abrir hoy"; }
      else if (st === "waiting") {
        icon = getSvg("hourglass");
        const myDone = role === "miguel" ? Boolean(ds.miguelSolved) : Boolean(ds.patriSolved);
        statusLabel = myDone ? `Falta ${partnerName}` : "Faltas tú";
      }
      else if (st === "solved") { icon = getSvg("check"); statusLabel = "Descubierta"; }

      return `
        <button type="button" class="door-card state-${st} ${d.day === 24 ? "is-day24" : ""}" style="--door-i:${d.day};" data-open-day="${d.day}">
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
          <img src="imagenes/cover-hotel.jpg" alt="Hotel El Mirador del Ventisquero" class="hero-thumb" width="1024" height="572" decoding="async">
          <span class="hero-thumb-tag">${esc(window.CASE_LORE.caseCode)}</span>
        </div>
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-gold">${esc(gift.editionLabel)}</span>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span data-sync-slot>${getSyncBadgeHtml()}</span>
              <button type="button" id="hero-mute-btn" class="btn btn-sm btn-ghost" style="min-height:32px;padding:4px 9px;font-size:0.7rem;">${window.AudioFX.isMuted() ? "Audio OFF" : "Audio ON"}</button>
            </div>
          </div>
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
            <button type="button" id="hero-role-btn" class="stat-pill" style="cursor:pointer;text-align:left;" title="Cambiar terminal">
              <span class="stat-val" style="color:${currentRole === "patri" ? "var(--adv-gold-soft)" : "var(--adv-frost)"};">${currentRole === "miguel" ? "MIG" : currentRole === "patri" ? "PAT" : "---"}</span>
              <span class="stat-lbl">Tu terminal</span>
            </button>
          </div>
        </div>
      </div>

      <div class="section-head" style="margin-bottom:14px;">
        <div>
          <h2 class="section-title">Calendario de Adviento (1–24 de diciembre)</h2>
          <div class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);margin-top:3px;">
            ${maxOpen === 0 ? esc(window.DateGate.getCountdownText()) : `Puertas abiertas hasta el ${maxOpen} de diciembre · Toca una puerta`}
          </div>
        </div>
        <span class="badge badge-pine">${solvedCount}/24 resueltas</span>
      </div>
      <div class="advent-grid">${doorsHtml}</div>
    `;

    document.getElementById("hero-role-btn")?.addEventListener("click", openIdentityOverlay);

    document.getElementById("hero-mute-btn")?.addEventListener("click", (e) => {
      window.AudioFX.toggleMute();
      e.currentTarget.textContent = window.AudioFX.isMuted() ? "Audio OFF" : "Audio ON";
    });

    container.querySelectorAll("[data-open-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = Number(btn.dataset.openDay);
        if (!window.DateGate.isDayOpen(d)) {
          window.AudioFX.error();
          openNoticeModal(`Puerta ${String(d).padStart(2, "0")} precintada`, `Esta puerta se abrirá automáticamente el ${d} de diciembre.`);
          return;
        }
        userPickedDay = true;
        selectedDayNum = d;
        lastDaySignature = "";
        switchTab("day", { scrollToTop: true });
      });
    });
  }

  function buildInputAttrs(label, placeholder) {
    const hintText = `${label || ""} ${placeholder || ""}`.toLowerCase();
    const isNumeric = /(número|numero|código de 4|dígitos|digitos|0000|1234|cm|hz|pin|año|hora)/i.test(hintText);
    if (isNumeric) {
      return `inputmode="decimal" autocomplete="off" enterkeyhint="send"`;
    }
    return `autocapitalize="characters" autocorrect="off" spellcheck="false" autocomplete="off" enterkeyhint="send"`;
  }

  function computeDaySignature(dayNum) {
    const key = String(dayNum);
    return JSON.stringify({
      dayNum,
      role: currentRole,
      open: window.DateGate.isDayOpen(dayNum),
      nextOpen: dayNum < 24 ? window.DateGate.isDayOpen(dayNum + 1) : false,
      ds: syncState.days?.[key] || null,
      hints: syncState.hintsUnlocked?.[key] || 0,
      fv: dayNum === 24 ? syncState.finalVerdictSolved : null,
      discardedCount: dayNum === 24 ? (syncState.discardedIds || []).length : null
    });
  }

  function renderDayView(force = false) {
    const container = document.getElementById("view-day");
    if (!container) return;
    if (!currentRole) return;

    const sig = computeDaySignature(selectedDayNum);
    if (!force && sig === lastDaySignature && container.innerHTML.trim() !== "") {
      return;
    }
    lastDaySignature = sig;

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
    const canGoNext = selectedDayNum < 24 && window.DateGate.isDayOpen(selectedDayNum + 1);
    const draftVal = localInputDrafts[String(dayObj.day)] || "";

    let validationHtml = "";
    if (!isSolved) {
      if (dayObj.mode === "dual-lock") {
        const attrs = buildInputAttrs(roleData.inputLabel, roleData.inputPlaceholder);
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
                  <input id="day-answer-input" type="text" class="adv-input" value="${esc(draftVal)}" placeholder="${esc(roleData.inputPlaceholder || "")}" ${attrs} required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">Validar mi parte (${role === "miguel" ? "Miguel" : "Patri"})</button>
              </form>
            `}
            <div id="day-feedback"></div>
          </div>`;
      } else {
        const attrs = buildInputAttrs(dayObj.jointInput.label, dayObj.jointInput.placeholder);
        validationHtml = `
          <div class="glass-card answer-card">
            <strong style="display:block;margin-bottom:10px;">Resolución Conjunta del Día ${String(dayObj.day).padStart(2, "0")}</strong>
            <form id="day-answer-form">
              <div class="input-group">
                <label class="input-label" for="day-answer-input">${esc(dayObj.jointInput.label)}</label>
                <input id="day-answer-input" type="text" class="adv-input" value="${esc(draftVal)}" placeholder="${esc(dayObj.jointInput.placeholder || "")}" ${attrs} required>
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
          <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-ghost" data-back-cal-bottom>Volver al Calendario</button>
            ${canGoNext ? `<button type="button" class="btn btn-sm btn-primary" data-day-nav="1">Siguiente puerta</button>` : ""}
          </div>
        </div>`;
    }

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
                  ${remaining.map((s) => `<option value="${esc(s.id)}" ${localVerdictDrafts.suspect === s.id ? "selected" : ""}>${esc(s.num)} · ${esc(s.name)} (${esc(s.role)})</option>`).join("")}
                </select>
              </div>
              <div class="input-group">
                <label class="input-label" for="fv-poison">Veneno hallado en la copa</label>
                <input id="fv-poison" type="text" class="adv-input" value="${esc(localVerdictDrafts.poison)}" placeholder="Ej. nombre de la toxina o planta" autocomplete="off" required>
              </div>
              <div class="input-group">
                <label class="input-label" for="fv-method">Maniobra ejecutada desde Planta 1 a las 23:38 h</label>
                <input id="fv-method" type="text" class="adv-input" value="${esc(localVerdictDrafts.method)}" placeholder="Ej. palabra clave de la maniobra" autocomplete="off" required>
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
              <button type="button" class="btn btn-sm btn-ghost" data-day-nav="1" ${!canGoNext ? "disabled" : ""}>Siguiente</button>
            </div>
          </div>
          <h1 class="day-title">${esc(dayObj.title)}</h1>
          <p class="day-story">${esc(dayObj.story)}</p>
        </div>

        ${dayObj.day === 1 ? `
          <div class="glass-card" style="padding:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap;">
              <span class="badge badge-crimson">VÍDEO BRIEFING OFICIAL · DÍA 01</span>
              <span class="mono" style="font-size:0.7rem;color:var(--vg-text-muted);">Informe grabado del caso</span>
            </div>
            <iframe src="video-briefing/index.html" title="Vídeo Briefing del Caso" class="briefing-frame" style="width:100%;height:360px;border:none;border-radius:12px;background:#040907;display:block;"></iframe>
          </div>
        ` : ""}

        <div class="glass-card terminal-card role-${role}">
          <div class="terminal-banner">
            <span class="terminal-role-label">${esc(roleData.roleBadge)}</span>
            <span class="badge ${role === "miguel" ? "badge-frost" : "badge-gold"}">Exclusivo de ${role === "miguel" ? "Miguel" : "Patri"}</span>
          </div>
          <p style="font-size:0.84rem;color:var(--vg-text-secondary);margin-bottom:12px;">${esc(roleData.brief)}</p>
          <div style="margin-bottom:14px;">${window.DayArtifacts ? window.DayArtifacts.render(dayObj.day, role) : ""}</div>
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
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
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
        if (next >= 1 && next <= 24 && window.DateGate.isDayOpen(next)) {
          userPickedDay = true;
          selectedDayNum = next;
          lastDaySignature = "";
          renderDayView(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });

    container.querySelector("[data-back-cal-bottom]")?.addEventListener("click", () => switchTab("calendar"));

    // Confirmación en 2 toques para evitar revelar pistas por error
    const hintBtn = document.getElementById("reveal-hint-btn");
    let hintArmTimer = null;
    hintBtn?.addEventListener("click", () => {
      window.AudioFX.click();
      if (hintBtn.dataset.armed !== "1") {
        hintBtn.dataset.armed = "1";
        hintBtn.textContent = `Confirmar Pista ${hintsCount + 1}`;
        hintBtn.classList.add("btn-gold");
        clearTimeout(hintArmTimer);
        hintArmTimer = setTimeout(() => {
          if (hintBtn.isConnected) {
            hintBtn.dataset.armed = "0";
            hintBtn.textContent = `Mostrar Pista ${hintsCount + 1}`;
            hintBtn.classList.remove("btn-gold");
          }
        }, 3500);
        return;
      }
      clearTimeout(hintArmTimer);
      window.SyncEngine.unlockHint(dayObj.day);
    });

    const dayAnsInp = document.getElementById("day-answer-input");
    dayAnsInp?.addEventListener("input", () => {
      localInputDrafts[String(dayObj.day)] = dayAnsInp.value;
    });

    document.getElementById("day-answer-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      const inp = document.getElementById("day-answer-input");
      const fb = document.getElementById("day-feedback");
      const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
      if (!inp || !fb) return;

      isSubmitting = true;
      if (submitBtn) submitBtn.disabled = true;

      try {
        const hashes = dayObj.mode === "dual-lock" ? roleData.acceptedHashes : dayObj.jointInput.acceptedHashes;
        const ok = await window.PuzzleEngine.matchesHashes(inp.value, hashes);

        if (!ok) {
          window.AudioFX.error();
          fb.innerHTML = `<div class="feedback-banner error">Código incorrecto. Volved a contrastar los datos entre Miguel y Patri.</div>`;
          const card = fb.closest(".answer-card");
          if (card) {
            card.classList.remove("shake-error");
            void card.offsetWidth;
            card.classList.add("shake-error");
          }
          return;
        }

        delete localInputDrafts[String(dayObj.day)];
        window.AudioFX.success();
        if (window.triggerGoldBurst) window.triggerGoldBurst(34);
        const decoded = window.PuzzleEngine.decodePayload(dayObj.unlockPayload);
        window.SyncEngine.solveDayPart(dayObj.day, role, dayObj.mode, decoded);
      } finally {
        isSubmitting = false;
        if (submitBtn && submitBtn.isConnected) submitBtn.disabled = false;
      }
    });

    document.getElementById("fv-suspect")?.addEventListener("change", (e) => {
      localVerdictDrafts.suspect = e.target.value;
    });
    document.getElementById("fv-poison")?.addEventListener("input", (e) => {
      localVerdictDrafts.poison = e.target.value;
    });
    document.getElementById("fv-method")?.addEventListener("input", (e) => {
      localVerdictDrafts.method = e.target.value;
    });

    document.getElementById("final-verdict-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      const sVal = document.getElementById("fv-suspect")?.value || "";
      const pVal = document.getElementById("fv-poison")?.value || "";
      const mVal = document.getElementById("fv-method")?.value || "";
      const fb = document.getElementById("final-feedback");
      const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
      const fv = dayObj.finalVerdict;

      isSubmitting = true;
      if (submitBtn) submitBtn.disabled = true;

      try {
        const ok1 = await window.PuzzleEngine.matchesHashes(sVal, fv.suspectHashes);
        const ok2 = await window.PuzzleEngine.matchesHashes(pVal, fv.poisonHashes);
        const ok3 = await window.PuzzleEngine.matchesHashes(mVal, fv.methodHashes);

        if (!ok1 || !ok2 || !ok3) {
          window.AudioFX.error();
          if (fb) fb.innerHTML = `<div class="feedback-banner error">Alguno de los tres elementos del veredicto no coincide con la prueba reina de ambos terminales.</div>`;
          const card = fb?.closest(".answer-card");
          if (card) {
            card.classList.remove("shake-error");
            void card.offsetWidth;
            card.classList.add("shake-error");
          }
          return;
        }

        window.AudioFX.success();
        if (window.triggerGoldBurst) window.triggerGoldBurst(72);
        const decoded = window.PuzzleEngine.decodePayload(dayObj.unlockPayload);
        window.SyncEngine.solveFinalVerdict(decoded?.finalEpilogue || null);
      } finally {
        isSubmitting = false;
        if (submitBtn && submitBtn.isConnected) submitBtn.disabled = false;
      }
    });
  }

  function applySuspectFilterOnly() {
    const container = document.getElementById("view-suspects");
    if (!container) return;
    container.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === suspectFilter);
    });
    container.querySelectorAll("[data-suspect-id]").forEach((card) => {
      const isOut = card.dataset.discarded === "1";
      const hide =
        (suspectFilter === "pending" && isOut) ||
        (suspectFilter === "discarded" && !isOut);
      card.classList.toggle("is-hidden-by-filter", hide);
    });
  }

  function computeSuspectsSignature() {
    const discarded = syncState.discardedIds || [];
    const solvedDays = Object.keys(syncState.days || {}).filter((k) => syncState.days[k]?.solved).map(Number);
    const discoveryLimit = Math.max(window.DateGate.getMaxOpenDay(), ...(solvedDays.length ? solvedDays : [0]), 0);
    return JSON.stringify({
      discoveryLimit,
      discarded,
      fv: syncState.finalVerdictSolved
    });
  }

  function renderSuspectsView(force = false) {
    const container = document.getElementById("view-suspects");
    if (!container || !currentRole) return;

    const sig = computeSuspectsSignature();
    const existingTa = document.getElementById("shared-notes-area");

    // Si solo cambió sharedNotes o presence y el tablero ya existe, actualizar sin destruir el textarea ni perder foco
    if (!force && sig === lastSuspectsSignature && existingTa) {
      if (document.activeElement !== existingTa && existingTa.value !== (syncState.sharedNotes || "")) {
        existingTa.value = syncState.sharedNotes || "";
      }
      updateSyncBadgesOnly();
      return;
    }

    lastSuspectsSignature = sig;
    clearTimeout(noteTimer);

    const preservedNotes = existingTa ? existingTa.value : (syncState.sharedNotes || "");
    const wasFocused = existingTa && document.activeElement === existingTa;

    const discarded = syncState.discardedIds || [];
    const solvedDays = Object.keys(syncState.days || {}).filter((k) => syncState.days[k]?.solved).map(Number);
    const discoveryLimit = Math.max(window.DateGate.getMaxOpenDay(), ...(solvedDays.length ? solvedDays : [0]), 0);
    const discovered = (window.SUSPECTS_DATA || []).filter((s) => (s.discoveredDay || 1) <= discoveryLimit);
    const discardedInView = discovered.filter((s) => discarded.includes(s.id)).length;
    const activeInView = discovered.length - discardedInView;

    container.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">Sospechosos descubiertos (${discovered.length}/25)</h2>
        <span class="badge badge-crimson">${discardedInView} descartados · ${activeInView} activos</span>
      </div>

      <div class="suspect-filters">
        <button type="button" class="filter-chip ${suspectFilter === "all" ? "active" : ""}" data-filter="all">Descubiertos (${discovered.length})</button>
        <button type="button" class="filter-chip ${suspectFilter === "pending" ? "active" : ""}" data-filter="pending">Sospechosos (${activeInView})</button>
        <button type="button" class="filter-chip ${suspectFilter === "discarded" ? "active" : ""}" data-filter="discarded">Descartados (${discardedInView})</button>
      </div>

      ${discovered.length === 0 ? `
        <div class="glass-card" style="padding:22px;text-align:center;">
          <p class="day-story">Los implicados irán apareciendo progresivamente conforme se abran las puertas del calendario a partir del <strong>1 de diciembre</strong>.</p>
        </div>
      ` : `
        <div class="suspects-grid">
          ${discovered.map((s) => {
            const isOut = discarded.includes(s.id);
            const isCulprit = syncState.finalVerdictSolved && !isOut;
            const statusPill = isCulprit
              ? `<span class="badge badge-gold" style="padding:2px 7px;font-size:0.62rem;">CULPABLE</span>`
              : isOut
                ? `<span class="badge badge-crimson" style="padding:2px 7px;font-size:0.62rem;">DESCARTADO</span>`
                : `<span class="badge badge-frost" style="padding:2px 7px;font-size:0.62rem;">SOSPECHOSO</span>`;
            return `
              <button type="button" class="suspect-card ${isOut ? "is-discarded" : ""} ${isCulprit ? "is-culprit-final" : ""}" data-suspect-id="${esc(s.id)}" data-discarded="${isOut ? "1" : "0"}">
                <div class="suspect-avatar-wrap">
                  <img src="${esc(s.portrait)}" alt="${esc(s.name)}" class="suspect-avatar" width="78" height="78" loading="lazy" decoding="async">
                  ${isOut ? `<div class="suspect-stamp">Descartado</div>` : ""}
                </div>
                <div class="suspect-info">
                  <div class="suspect-top-row">
                    <span class="suspect-num">#${esc(s.num)} · Día ${s.discoveredDay || 1}</span>
                    ${statusPill}
                  </div>
                  <div class="suspect-name">${esc(s.name)}</div>
                  <div class="suspect-role">${esc(s.role)} · <span class="mono" style="font-size:0.68rem;">${esc(s.room)}</span></div>
                  <p class="suspect-alibi">${esc(s.alibiClaim)}</p>
                </div>
              </button>`;
          }).join("")}
        </div>
      `}

      <div class="glass-card" style="padding:18px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;flex-wrap:wrap;">
          <strong>Libreta Compartida (Miguel y Patri)</strong>
          <span class="mono" style="font-size:0.7rem;color:var(--vg-text-muted);" id="notes-status">${syncMode === "firebase" ? "Sincronizada en nube" : "Guardado local"}</span>
        </div>
        <textarea id="shared-notes-area" class="adv-textarea" placeholder="Anotad aquí sospechas, teorías o pistas compartidas...">${esc(preservedNotes)}</textarea>
      </div>
    `;

    applySuspectFilterOnly();
    updateSyncBadgesOnly();

    container.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        suspectFilter = btn.dataset.filter;
        applySuspectFilterOnly();
      });
    });

    container.querySelectorAll("[data-suspect-id]").forEach((card) => {
      card.addEventListener("click", () => openSuspectModal(card.dataset.suspectId, card));
    });

    const ta = document.getElementById("shared-notes-area");
    if (wasFocused && ta) ta.focus();
    ta?.addEventListener("input", () => {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        window.SyncEngine.saveNotes(ta.value);
      }, 450);
    });
  }

  function renderExpedienteView() {
    const container = document.getElementById("view-expediente");
    if (!container || !currentRole) return;
    if (container.dataset.rendered === "1") {
      updateSyncBadgesOnly();
      return;
    }
    container.dataset.rendered = "1";
    const lore = window.CASE_LORE;

    container.innerHTML = `
      <div class="day-workspace">
        <div class="glass-card" style="padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-crimson">ATESTADO INICIAL · 30 NOV</span>
            <button type="button" class="btn btn-sm btn-gold" id="exp-dedication-btn">${getSvg("gift")} Dedicatoria</button>
          </div>
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
              <div style="border-radius:14px;overflow:hidden;border:var(--vg-border-specular);background:rgba(5,11,18,0.65);">
                <img src="${esc(sc.src)}" alt="${esc(sc.title)}" width="1024" height="572" loading="lazy" decoding="async" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block;">
                <div style="padding:10px 12px;">
                  <div style="font-weight:600;font-size:0.86rem;color:#FFFBEB;">${esc(sc.title)}</div>
                  <div style="font-size:0.75rem;color:var(--vg-text-secondary);margin-top:3px;">${esc(sc.caption)}</div>
                </div>
              </div>`).join("")}
          </div>
        </div>

        <div class="glass-card" style="padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <h3 style="font-size:1rem;">Vídeo Briefing del Caso</h3>
            <a href="imprimibles/PRESENTACION_ADVIENTO_CERO.pdf" target="_blank" rel="noopener" class="btn btn-sm btn-gold">Dossier PDF (2,1 MB)</a>
          </div>
          <div id="exp-briefing-mount">
            <button type="button" class="btn btn-frost" id="exp-load-briefing-btn" style="width:100%;">Reproducir Vídeo Briefing Oficial</button>
          </div>
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:10px;">Plano por Plantas del Hotel</h3>
          <ul class="clue-list">
            ${lore.hotelZones.map((z) => `<li><strong>${esc(z.floor)} · ${esc(z.zone)}:</strong> ${esc(z.note)}</li>`).join("")}
          </ul>
        </div>

        <div style="text-align:center;padding:10px 0;">
          <button type="button" id="version-secret-trigger" class="mono" style="min-height:40px;padding:8px 12px;background:none;border:none;color:var(--vg-text-muted);font-size:0.72rem;cursor:pointer;">
            ${APP_VERSION} · ADVIENTO CERO · MODO CERO SPOILERS
          </button>
        </div>
      </div>
    `;

    document.getElementById("exp-dedication-btn")?.addEventListener("click", () => {
      openDedicationModal(document.getElementById("exp-dedication-btn"));
    });

    document.getElementById("exp-load-briefing-btn")?.addEventListener("click", () => {
      const mount = document.getElementById("exp-briefing-mount");
      if (!mount) return;
      mount.innerHTML = `<iframe src="video-briefing/index.html" title="Vídeo Briefing del Caso" class="briefing-frame" style="width:100%;height:360px;border:none;border-radius:12px;background:#040907;display:block;"></iframe>`;
    });

    document.getElementById("version-secret-trigger")?.addEventListener("click", () => {
      versionTapCount += 1;
      clearTimeout(versionTapTimer);
      versionTapTimer = setTimeout(() => { versionTapCount = 0; }, 2200);
      if (versionTapCount >= 5) {
        versionTapCount = 0;
        window.DateGate.enableAdmin(24);
        window.SyncEngine.init();
        window.AudioFX.success();
        userPickedDay = false;
        selectDefaultDay();
        lastDaySignature = "";
        lastSuspectsSignature = "";
        renderAdminBar();
        renderActiveTab();
      }
    });
  }

  function showModal(html, triggerEl) {
    const modal = document.getElementById("adv-modal");
    const body = document.getElementById("adv-modal-body");
    if (!modal || !body) return;
    lastFocusedEl = triggerEl || document.activeElement;
    body.innerHTML = html;
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    const focusTarget = body.querySelector("button, [href], input, select, textarea");
    if (focusTarget) focusTarget.focus();
  }

  function closeModal() {
    const modal = document.getElementById("adv-modal");
    if (!modal) return;
    modal.classList.remove("open");
    openModalSuspectId = null;
    if (!document.getElementById("identity-overlay")?.classList.contains("open")) {
      document.body.classList.remove("modal-open");
      if (window.resumeSnow) window.resumeSnow();
    }
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function" && lastFocusedEl.isConnected) {
      lastFocusedEl.focus();
    }
    lastFocusedEl = null;
  }

  function openNoticeModal(title, message) {
    showModal(`
      <span class="badge badge-gold">AVISO DEL CASO</span>
      <h3 id="adv-modal-title" class="serif" style="font-size:1.45rem;margin:10px 0 8px;">${esc(title)}</h3>
      <p class="day-story">${esc(message)}</p>
      <button type="button" class="btn btn-primary" style="width:100%;margin-top:16px;" id="close-modal-btn">Entendido</button>
    `);
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
  }

  function openConfirmModal(title, message, confirmLabel, onConfirm) {
    showModal(`
      <span class="badge badge-crimson">CONFIRMACIÓN</span>
      <h3 id="adv-modal-title" class="serif" style="font-size:1.45rem;margin:10px 0 8px;">${esc(title)}</h3>
      <p class="day-story">${esc(message)}</p>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button type="button" class="btn btn-ghost" style="flex:1;" id="close-modal-btn">Cancelar</button>
        <button type="button" class="btn btn-primary" style="flex:1;" id="confirm-modal-btn">${esc(confirmLabel)}</button>
      </div>
    `);
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
    document.getElementById("confirm-modal-btn")?.addEventListener("click", () => {
      closeModal();
      if (typeof onConfirm === "function") onConfirm();
    });
  }

  function openSuspectModal(suspectId, triggerEl) {
    const s = (window.SUSPECTS_DATA || []).find((x) => x.id === suspectId);
    if (!s) return;
    openModalSuspectId = suspectId;
    const isOut = (syncState.discardedIds || []).includes(s.id);
    const solvedEntry = Object.values(syncState.days || {}).find((d) => d && d.discardId === s.id && d.solved);

    showModal(`
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px;">
        <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="82" height="82" style="width:82px;height:82px;border-radius:14px;object-fit:cover;border:var(--vg-border-specular-strong);">
        <div>
          <span class="badge ${isOut ? "badge-crimson" : "badge-gold"}">${isOut ? "DESCARTADO" : `FICHA #${esc(s.num)}`}</span>
          <h3 id="adv-modal-title" style="font-size:1.25rem;margin-top:6px;">${esc(s.name)}</h3>
          <div style="font-size:0.82rem;color:var(--vg-text-secondary);">${esc(s.role)} · ${esc(s.room)}</div>
        </div>
      </div>
      <div class="clue-box">
        <p style="margin-bottom:8px;"><strong>Posible motivo:</strong> ${esc(s.motiveHint)}</p>
        <p><strong>Coartada inicial:</strong> ${esc(s.alibiClaim)}</p>
      </div>
      ${solvedEntry ? `<div class="feedback-banner success"><strong>Resolución:</strong> ${esc(solvedEntry.conclusion)}</div>` : ""}
      <button type="button" class="btn btn-ghost" style="width:100%;margin-top:14px;" id="close-modal-btn">Cerrar ficha</button>
    `, triggerEl);
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
  }

  function openDedicationModal(triggerEl) {
    const g = window.GIFT_CONFIG.openingDedication;
    showModal(`
      <span class="badge badge-gold">${esc(g.badge)}</span>
      <h2 id="adv-modal-title" class="serif" style="font-size:1.75rem;margin:10px 0 12px;">${esc(g.title)}</h2>
      ${g.body.map((p) => `<p class="day-story" style="margin-bottom:10px;">${esc(p)}</p>`).join("")}
      <p class="serif" style="font-size:1.15rem;font-style:italic;color:var(--adv-gold-soft);margin-top:14px;display:flex;align-items:center;gap:6px;">
        <span>${esc(g.signature)}</span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#EF4444" stroke="#FCA5A5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </p>
      <button type="button" class="btn btn-primary" style="width:100%;margin-top:16px;" id="close-modal-btn">Empezar a investigar</button>
    `, triggerEl);
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
  }

  function maybeShowFirstDedication() {
    if (!currentRole) return;
    if (window.DateGate.getMaxOpenDay() !== 0) return;
    openDedicationModal();
  }

  function renderActiveTab() {
    if (activeTab === "calendar") renderCalendarView();
    else if (activeTab === "day") renderDayView();
    else if (activeTab === "suspects") renderSuspectsView();
    else if (activeTab === "expediente") renderExpedienteView();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSnowCanvas();

    if (!currentRole) {
      openIdentityOverlay();
    }

    document.querySelectorAll("[data-choose-role]").forEach((btn) => {
      btn.addEventListener("click", () => setRole(btn.dataset.chooseRole));
    });

    document.getElementById("identity-cancel-btn")?.addEventListener("click", closeIdentityOverlay);

    document.querySelectorAll(".dock-item").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    document.getElementById("adv-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "adv-modal") closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (document.getElementById("adv-modal")?.classList.contains("open")) {
        closeModal();
      } else if (document.getElementById("identity-overlay")?.classList.contains("open") && currentRole) {
        closeIdentityOverlay();
      }
    });

    // Ocultar dock móvil mientras el teclado virtual está abierto en inputs/textareas
    document.addEventListener("focusin", (e) => {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && e.target.type !== "range") {
        document.body.classList.add("keyboard-open");
      }
    });
    document.addEventListener("focusout", () => {
      setTimeout(() => {
        const ae = document.activeElement;
        if (!ae || !/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) || ae.type === "range") {
          document.body.classList.remove("keyboard-open");
        }
      }, 120);
    });

    // Redimensionado fluido del iframe de Vídeo Briefing y botón Atrás en móvil
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "briefing-height" && Number(e.data.height) > 200) {
        document.querySelectorAll(".briefing-frame").forEach((fr) => {
          fr.style.height = `${Math.ceil(Number(e.data.height))}px`;
        });
      }
    });

    if (window.history && window.history.replaceState) {
      window.history.replaceState({ tab: "calendar", day: selectedDayNum }, "");
    }
    window.addEventListener("popstate", (e) => {
      if (document.getElementById("adv-modal")?.classList.contains("open")) {
        closeModal();
        window.history.pushState({ tab: activeTab, day: selectedDayNum }, "");
        return;
      }
      if (document.getElementById("identity-overlay")?.classList.contains("open") && currentRole) {
        closeIdentityOverlay();
        window.history.pushState({ tab: activeTab, day: selectedDayNum }, "");
        return;
      }
      const targetTab = e.state?.tab || "calendar";
      if (targetTab !== activeTab) {
        switchTab(targetTab, { fromHistory: true, silent: true });
      }
    });

    window.SyncEngine.subscribe((st, md) => {
      syncState = st;
      syncMode = md;
      const syncStatus = window.SyncEngine.getStatus();
      if (!initialRemoteApplied && syncStatus.initialSynced) {
        initialRemoteApplied = true;
        if (!userPickedDay) selectDefaultDay();
      }
      renderAdminBar();
      renderActiveTab();
      if (openModalSuspectId && document.getElementById("adv-modal")?.classList.contains("open")) {
        openSuspectModal(openModalSuspectId);
      }
    });

    selectDefaultDay();
    window.SyncEngine.init();
    if (currentRole) {
      window.SyncEngine.markPresence(currentRole);
      maybeShowFirstDedication();
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  });
})();
