/**
 * ADVIENTO CERO — CONTROLADOR PRINCIPAL DE APLICACIÓN
 */

(() => {
  const APP_VERSION = "v2.5.0";
  const ROLE_KEY = "adviento_player_role";
  const DEDICATION_SEEN_KEY = "adviento_dedication_seen_v1";
  const DRAFTS_KEY = "adviento_drafts_v1";
  const PREFS_KEY = "adviento_prefs_v1";

  let currentRole = localStorage.getItem(ROLE_KEY) || "";
  let activeTab = "calendar";
  let selectedDayNum = 1;
  let userPickedDay = false;
  let suspectFilter = "all";
  let suspectGroupFilter = "all";
  let suspectFloorFilter = "all";
  let suspectSearch = "";
  let calendarFilter = "all";
  let expedienteFloor = "Planta 1";

  let syncState = window.SyncEngine.getState();
  let syncMode = window.SyncEngine.getMode();
  let prevSyncSnap = null;
  let versionTapCount = 0;
  let versionTapTimer = null;
  let noteTimer = null;
  let isSubmitting = false;
  let openModalSuspectId = null;
  let lastFocusedEl = null;
  let initialRemoteApplied = false;
  let lockedScrollY = 0;

  const tabScrollY = { calendar: 0, day: 0, suspects: 0, expediente: 0 };
  let draftsStore = loadJsonStorage(DRAFTS_KEY, { inputs: {}, widgets: {}, verdict: { suspect: "", reason: "", poison: "", method: "" } });
  let userPrefs = loadJsonStorage(PREFS_KEY, { fontBoost: false, nightSoft: false, reducedMotion: false });
  let lastCalendarSignature = "";
  let lastDaySignature = "";
  let lastSuspectsSignature = "";

  const esc = (s) => window.PuzzleEngine.escapeHtml(s);

  function loadJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? Object.assign({}, fallback, JSON.parse(raw)) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveDrafts() {
    try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(draftsStore)); } catch (_) {}
  }

  function applyUserPrefs() {
    document.body.classList.toggle("font-boost", Boolean(userPrefs.fontBoost));
    document.body.classList.toggle("night-reading-soft", Boolean(userPrefs.nightSoft));
    document.body.classList.toggle("Pref-reduced-motion", Boolean(userPrefs.reducedMotion));
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(userPrefs)); } catch (_) {}
  }

  function getSvg(name) {
    const icons = {
      lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      unlock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
      check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      hourglass: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`,
      users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      gift: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`
    };
    return icons[name] || "";
  }

  function showToast(text, actionLabel, onAction) {
    const host = document.getElementById("adv-toast-host");
    if (!host) return;
    const item = document.createElement("div");
    item.className = "adv-toast";
    item.innerHTML = `<span>${esc(text)}</span>${actionLabel ? `<button type="button" class="btn btn-sm btn-gold" style="min-height:34px;padding:4px 10px;">${esc(actionLabel)}</button>` : ""}`;
    host.appendChild(item);
    if (actionLabel && typeof onAction === "function") {
      item.querySelector("button")?.addEventListener("click", () => {
        onAction();
        item.remove();
      });
    }
    setTimeout(() => { if (item.isConnected) item.remove(); }, 5200);
  }

  function lockBodyScroll() {
    if (document.body.classList.contains("modal-open")) return;
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.classList.add("modal-open");
  }

  function unlockBodyScroll() {
    if (!document.body.classList.contains("modal-open")) return;
    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    window.scrollTo(0, lockedScrollY);
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

    const flakeCount = w < 640 ? 40 : 72;
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
      if (userPrefs.reducedMotion) return;
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
      return document.hidden || document.body.classList.contains("modal-open") || userPrefs.reducedMotion;
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
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
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

  function postToBriefings(payload) {
    document.querySelectorAll('iframe[src*="video-briefing"]').forEach((fr) => {
      try { fr.contentWindow?.postMessage(payload, "*"); } catch (_) {}
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

  function openIdentityOverlay(fromHistory = false) {
    const overlay = document.getElementById("identity-overlay");
    const cancelBtn = document.getElementById("identity-cancel-btn");
    if (!overlay) return;
    if (cancelBtn) cancelBtn.style.display = currentRole ? "block" : "none";

    overlay.querySelectorAll("[data-choose-role]").forEach((btn) => {
      const r = btn.dataset.chooseRole;
      btn.classList.toggle("is-miguel", r === "miguel");
      btn.classList.toggle("is-patri", r === "patri");
      btn.classList.toggle("is-current", r === currentRole);
    });

    overlay.classList.add("open");
    lockBodyScroll();
    if (!fromHistory && currentRole && window.history?.pushState) {
      window.history.pushState({ overlay: "identity", tab: activeTab, day: selectedDayNum }, "");
    }
  }

  function closeIdentityOverlay() {
    if (!currentRole) return;
    document.getElementById("identity-overlay")?.classList.remove("open");
    if (!document.getElementById("adv-modal")?.classList.contains("open")) {
      unlockBodyScroll();
      if (window.resumeSnow) window.resumeSnow();
    }
  }

  function applyRoleSwitch(role) {
    currentRole = role;
    localStorage.setItem(ROLE_KEY, role);
    closeIdentityOverlay();
    window.SyncEngine.markPresence(role);
    window.AudioFX.click();
    lastCalendarSignature = "";
    lastDaySignature = "";
    lastSuspectsSignature = "";
    renderAdminBar();
    renderActiveTab();
    maybeShowFirstDedication();
  }

  function setRole(role) {
    if (currentRole && currentRole !== role && !window.DateGate.isAdminEnabled()) {
      const targetName = role === "miguel" ? "Miguel" : "Patri";
      openConfirmModal(
        `¿Cambiar al terminal de ${targetName}?`,
        `Este dispositivo mostrará las pistas privadas y artefactos exclusivos de ${targetName}. Si estás jugando en pareja, evita cambiar para no ver sus datos sin querer.`,
        `Cambiar a ${targetName}`,
        () => applyRoleSwitch(role)
      );
      return;
    }
    applyRoleSwitch(role);
  }

  function switchTab(tab, opts = {}) {
    if (activeTab === tab && !opts.force) return;
    clearKeyboardOpen();
    window.AudioFX.stopMorse?.();
    tabScrollY[activeTab] = window.scrollY;
    if (activeTab === "day" || activeTab === "expediente") {
      postToBriefings({ type: "pause" });
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

    if (tab === "day") {
      window.SyncEngine.setViewingDay(selectedDayNum);
    } else {
      window.SyncEngine.setViewingDay(null);
    }

    renderActiveTab();

    if (tab === "day" && opts.scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: tabScrollY[tab] || 0, behavior: "auto" });
    }

    if (!opts.fromHistory && window.history?.pushState) {
      window.history.pushState({ tab, day: selectedDayNum }, "");
    }
  }

  function clearKeyboardOpen() {
    if (document.activeElement && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      document.activeElement.blur();
    }
    document.body.classList.remove("keyboard-open");
  }

  function getDayStatus(dayNum) {
    const ds = syncState.days?.[String(dayNum)] || {};
    if (ds.solved) return "solved";
    if (!window.DateGate.isDayOpen(dayNum)) return "locked";
    if (ds.miguelSolved || ds.patriSolved) return "waiting";
    return "available";
  }

  function formatRelTime(ts) {
    if (!ts) return "";
    const mins = Math.max(1, Math.round((Date.now() - Number(ts)) / 60000));
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `hace ${hrs} h`;
    return `hace ${Math.round(hrs / 24)} d`;
  }

  function getSyncBadgeHtml() {
    const status = window.SyncEngine.getStatus();
    const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
    const partnerLabel = partnerRole === "miguel" ? "Miguel" : "Patri";
    const partnerOnline = window.SyncEngine.isRoleOnline(partnerRole);
    const partnerData = syncState.presence?.[partnerRole];

    if (status.syncError) {
      return `<button type="button" class="badge badge-crimson" data-open-sync-diag style="cursor:pointer;">Error sync</button>`;
    }
    if (status.mode === "firebase") {
      if (!status.initialSynced && !status.connected) {
        return `<button type="button" class="badge badge-gold" data-open-sync-diag style="cursor:pointer;">Conectando...</button>`;
      }
      if (!status.connected) {
        return `<button type="button" class="badge badge-gold" data-open-sync-diag style="cursor:pointer;">Reconectando...</button>`;
      }
      const pText = partnerOnline
        ? `${partnerLabel} online${partnerData?.viewingDay ? ` (Día ${String(partnerData.viewingDay).padStart(2, "0")})` : ""}`
        : `Nube activa${partnerData?.lastSeen ? ` · ${partnerLabel} ${formatRelTime(partnerData.lastSeen)}` : ""}`;
      return `<button type="button" class="badge badge-pine" data-open-sync-diag style="cursor:pointer;"><span class="pulse-dot"></span> ${esc(pText)}</button>`;
    }
    return `<button type="button" class="badge badge-crimson" data-open-sync-diag style="cursor:pointer;">Modo Local</button>`;
  }

  function openSyncDiagModal() {
    const st = window.SyncEngine.getStatus();
    const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
    const partnerOnline = window.SyncEngine.isRoleOnline(partnerRole);
    const lastSeen = syncState.presence?.[partnerRole]?.lastSeen;
    showModal(`
      <span class="badge ${st.syncError ? "badge-crimson" : "badge-pine"}">DIAGNÓSTICO DE SINCRONIZACIÓN</span>
      <h3 id="adv-modal-title" class="serif" style="font-size:1.45rem;margin:10px 0 10px;">Estado de Red y Sala</h3>
      <ul class="clue-list">
        <li><strong>Modo:</strong> ${esc(st.mode)} ${st.isAdminRoom ? "(Sala aislada de pruebas)" : ""}</li>
        <li><strong>Conexión RTDB:</strong> ${st.connected ? "Conectado en vivo" : "Sin conexión / En espera"}</li>
        <li><strong>Cambios pendientes:</strong> ${st.dirty ? "Sí (se subirán al reconectar)" : "Todo al día"}</li>
        <li><strong>Estado de pareja:</strong> ${partnerOnline ? "Conectada ahora" : `Desconectada${lastSeen ? ` (${formatRelTime(lastSeen)})` : ""}`}</li>
        ${st.syncError ? `<li style="color:#FECACA;"><strong>Último error:</strong> ${esc(st.syncError)}</li>` : ""}
      </ul>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button type="button" class="btn btn-ghost" style="flex:1;" id="close-modal-btn">Cerrar</button>
        <button type="button" class="btn btn-frost" style="flex:1;" id="force-sync-btn">Forzar reconexión</button>
      </div>
    `);
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
    document.getElementById("force-sync-btn")?.addEventListener("click", () => {
      window.SyncEngine.forceReconnect();
      closeModal();
      showToast("Reconectando con Firebase RTDB...");
    });
  }

  function updateSyncBadgesOnly() {
    const html = getSyncBadgeHtml();
    document.querySelectorAll("[data-sync-slot]").forEach((el) => {
      el.innerHTML = html;
    });
    const notesStatus = document.getElementById("notes-status");
    if (notesStatus) {
      const st = window.SyncEngine.getStatus();
      const meta = syncState.notesMeta;
      const metaStr = meta?.updatedBy ? ` · ${meta.updatedBy === "miguel" ? "Miguel" : "Patri"} (${formatRelTime(meta.updatedAt)})` : "";
      notesStatus.textContent = st.syncError
        ? "Error al guardar en nube"
        : st.mode === "firebase" && st.connected
          ? `Sincronizada en nube${metaStr}`
          : `Guardado local${metaStr}`;
    }
    updateDockIndicator();
  }

  function updateDockIndicator() {
    const dot = document.getElementById("day-dock-dot");
    if (!dot) return;
    const maxOpen = window.DateGate.getMaxOpenDay();
    let hasPending = false;
    for (let d = 1; d <= maxOpen; d++) {
      if (!syncState.days?.[String(d)]?.solved) { hasPending = true; break; }
    }
    dot.classList.toggle("visible", hasPending);
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
        <select id="admin-sim-select" class="adv-select" style="width:auto;font-size:16px;">
          <option value="0" ${sim === 0 ? "selected" : ""}>Antes del 1 dic</option>
          ${Array.from({ length: 24 }, (_, i) => i + 1).map((d) => `<option value="${d}" ${sim === d ? "selected" : ""}>${d} de diciembre</option>`).join("")}
        </select>
      </label>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-reset-btn" style="color:#FDA4AF;border-color:rgba(255,45,85,0.4);">Resetear partida test</button>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-exit-btn">Salir test</button>
    `;

    document.getElementById("admin-switch-role-btn")?.addEventListener("click", () => applyRoleSwitch(otherRole));

    document.getElementById("admin-sim-select")?.addEventListener("change", (e) => {
      window.DateGate.setSimulatedDay(e.target.value);
      userPickedDay = false;
      selectDefaultDay();
      lastCalendarSignature = "";
      lastDaySignature = "";
      lastSuspectsSignature = "";
      renderAdminBar();
      renderActiveTab();
    });

    document.getElementById("admin-exit-btn")?.addEventListener("click", () => {
      window.DateGate.disableAdmin();
      if (window.location.search.includes("admin=") && window.history?.replaceState) {
        const u = new URL(window.location.href);
        u.searchParams.delete("admin");
        window.history.replaceState(window.history.state, "", u.pathname + u.search + u.hash);
      }
      window.SyncEngine.init();
      if (currentRole) window.SyncEngine.markPresence(currentRole);
      userPickedDay = false;
      selectDefaultDay();
      lastCalendarSignature = "";
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
          draftsStore = { inputs: {}, widgets: {}, verdict: { suspect: "", reason: "", poison: "", method: "" } };
          saveDrafts();
          const ta = document.getElementById("shared-notes-area");
          if (ta) ta.value = "";
          userPickedDay = false;
          selectDefaultDay();
          lastCalendarSignature = "";
          lastDaySignature = "";
          lastSuspectsSignature = "";
          window.SyncEngine.resetAll();
          openDedicationModal();
        }
      );
    });
  }

  function renderCalendarView(force = false) {
    const container = document.getElementById("view-calendar");
    if (!container) return;

    const maxOpen = window.DateGate.getMaxOpenDay();
    const calSig = JSON.stringify({
      role: currentRole,
      maxOpen,
      days: syncState.days,
      discardedCount: (syncState.discardedIds || []).length,
      fv: syncState.finalVerdictSolved,
      calendarFilter,
      muted: window.AudioFX.isMuted()
    });

    if (!force && calSig === lastCalendarSignature && container.innerHTML.trim() !== "") {
      updateSyncBadgesOnly();
      return;
    }
    lastCalendarSignature = calSig;

    const solvedCount = Object.values(syncState.days || {}).filter((d) => d && d.solved).length;
    const activeSuspects = syncState.finalVerdictSolved ? 1 : 25 - (syncState.discardedIds?.length || 0);
    const gift = window.GIFT_CONFIG;
    const role = currentRole === "patri" ? "patri" : "miguel";
    const partnerName = role === "miguel" ? "Patri" : "Miguel";

    let ctaTargetDay = maxOpen;
    for (let d = 1; d <= maxOpen; d++) {
      if (!syncState.days?.[String(d)]?.solved) { ctaTargetDay = d; break; }
    }

    const filteredDays = (window.ADVENT_DAYS || []).filter((d) => {
      const st = getDayStatus(d.day);
      if (calendarFilter === "pending") return st === "available" || st === "waiting";
      if (calendarFilter === "solved") return st === "solved";
      return true;
    });

    const doorsHtml = filteredDays.map((d) => {
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
      } else if (st === "solved") { icon = getSvg("check"); statusLabel = "Descubierta"; }

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
              <button type="button" id="hero-mute-btn" class="btn btn-sm btn-ghost">${window.AudioFX.isMuted() ? "Audio OFF" : "Audio ON"}</button>
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
              <span class="stat-lbl">${syncState.finalVerdictSolved ? "Culpable" : "Sospechosos"}</span>
            </div>
            <button type="button" id="hero-role-btn" class="stat-pill" style="cursor:pointer;text-align:left;" title="Cambiar terminal">
              <span class="stat-val" style="color:${currentRole === "patri" ? "var(--adv-gold-soft)" : "var(--adv-frost)"};">${currentRole === "miguel" ? "MIG" : currentRole === "patri" ? "PAT" : "---"}</span>
              <span class="stat-lbl">Cambiar perfil</span>
            </button>
          </div>
          ${maxOpen >= 1 ? `
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn btn-sm btn-primary" id="hero-cta-day" data-day="${ctaTargetDay}">
                ${syncState.finalVerdictSolved ? "Ver Sobre Secreto (Día 24)" : `Ir a Puerta ${String(ctaTargetDay).padStart(2, "0")}`}
              </button>
            </div>
          ` : ""}
        </div>
      </div>

      <div class="section-head" style="margin-bottom:12px;">
        <div>
          <h2 class="section-title">Calendario de Adviento (1–24 de diciembre)</h2>
          <div class="mono" style="font-size:0.74rem;color:var(--vg-text-muted);margin-top:3px;">
            ${maxOpen === 0 ? esc(window.DateGate.getCountdownText()) : `Puertas abiertas hasta el ${maxOpen} de diciembre · Toca una puerta`}
          </div>
        </div>
        <span class="badge badge-pine">${solvedCount}/24 resueltas</span>
      </div>

      ${maxOpen >= 4 ? `
        <div class="suspect-filters" style="margin-bottom:12px;">
          <button type="button" class="filter-chip ${calendarFilter === "all" ? "active" : ""}" data-cal-filter="all">Todas (24)</button>
          <button type="button" class="filter-chip ${calendarFilter === "pending" ? "active" : ""}" data-cal-filter="pending">Por resolver</button>
          <button type="button" class="filter-chip ${calendarFilter === "solved" ? "active" : ""}" data-cal-filter="solved">Resueltas (${solvedCount})</button>
        </div>
      ` : ""}

      <div class="advent-grid">${doorsHtml}</div>
    `;

    document.getElementById("hero-role-btn")?.addEventListener("click", () => openIdentityOverlay());

    document.getElementById("hero-mute-btn")?.addEventListener("click", (e) => {
      const muted = window.AudioFX.toggleMute();
      e.currentTarget.textContent = muted ? "Audio OFF" : "Audio ON";
      postToBriefings({ type: "mute", muted });
      const mNote = document.getElementById(`morse-mute-note-${selectedDayNum}`);
      if (mNote) mNote.style.display = muted ? "block" : "none";
    });

    document.getElementById("hero-cta-day")?.addEventListener("click", (e) => {
      const target = Number(e.currentTarget.dataset.day || 1);
      userPickedDay = true;
      selectedDayNum = target;
      lastDaySignature = "";
      switchTab("day", { scrollToTop: true });
    });

    container.querySelectorAll("[data-cal-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        calendarFilter = btn.dataset.calFilter;
        renderCalendarView(true);
      });
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
    updateDockIndicator();
  }

  function buildInputAttrs(label, placeholder) {
    const sample = String(placeholder || "").replace(/^\s*ej\.?\s*/i, "").trim();
    const isNumeric = sample.length > 0 && /^\d+$/.test(sample);
    if (isNumeric) {
      return `inputmode="numeric" pattern="[0-9]*" autocomplete="off" enterkeyhint="send"`;
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
      dispatch: syncState.fieldDispatch?.[key] || null,
      fv: dayNum === 24 ? syncState.finalVerdictSolved : null,
      fp: dayNum === 24 ? syncState.finalProposal : null,
      discardedCount: dayNum === 24 ? (syncState.discardedIds || []).length : null
    });
  }

  function renderDayView(force = false) {
    const container = document.getElementById("view-day");
    if (!container || !currentRole) return;

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
    const partnerKey = role === "miguel" ? "patri" : "miguel";
    const myDone = role === "miguel" ? Boolean(dState.miguelSolved) : Boolean(dState.patriSolved);
    const partnerDone = role === "miguel" ? Boolean(dState.patriSolved) : Boolean(dState.miguelSolved);
    const maxOpen = window.DateGate.getMaxOpenDay();
    const canGoNext = selectedDayNum < 24 && window.DateGate.isDayOpen(selectedDayNum + 1);
    const draftVal = draftsStore.inputs[String(dayObj.day)] || "";
    const dispatchObj = syncState.fieldDispatch?.[String(dayObj.day)] || {};
    const partnerDispatch = dispatchObj[partnerKey];
    const myDispatch = dispatchObj[role];

    const hintTiers = ["Nivel 1 · Orientación", "Nivel 2 · Conexión asimétrica", "Nivel 3 · Guía directa"];

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
                  <div class="mono" style="font-size:0.68rem;color:var(--vg-text-muted);">Mayúsculas, minúsculas y tildes se normalizan automáticamente.</div>
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
                <div class="mono" style="font-size:0.68rem;color:var(--vg-text-muted);">Mayúsculas, minúsculas y tildes se normalizan automáticamente.</div>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Validar y Descartar Sospechoso</button>
            </form>
            <div id="day-feedback"></div>
          </div>`;
      }
    } else {
      const suspect = dState.discardId ? (window.SUSPECTS_DATA || []).find((s) => s.id === dState.discardId) : null;
      validationHtml = `
        <div class="glass-card answer-card" style="border:${suspect ? "var(--vg-border-pine)" : "var(--vg-border-gold)"};">
          <span class="badge ${suspect ? "badge-pine" : "badge-gold"}">${esc(dState.forensicTag || "DÍA RESUELTO")}</span>
          <h3 style="margin:10px 0 6px;font-size:1.1rem;">${suspect ? `Sospechoso descartado: ${esc(suspect.name)}` : "Diligencia retenida en expediente (sin descarte hoy)"}</h3>
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
        if (remaining.length > 3) {
          finalTrialHtml = `
            <div class="glass-card answer-card" style="border:var(--vg-border-gold);">
              <span class="badge badge-gold">CAREO FINAL BLOQUEADO POR PRERREQUISITO</span>
              <h3 style="margin:10px 0 6px;font-size:1.1rem;">Faltan puertas anteriores por resolver</h3>
              <p class="day-story">Aún quedan <strong>${remaining.length} sospechosos activos</strong> en vuestro tablero. Completad los descartes pendientes antes de celebrar el Careo Final entre los 3 finalistas.</p>
              <button type="button" class="btn btn-sm btn-primary" style="margin-top:12px;" data-back-cal-bottom>Ir al Calendario</button>
            </div>`;
        } else {
          const showdownHtml = window.DayArtifacts?.renderFinalShowdown ? window.DayArtifacts.renderFinalShowdown(role, remaining) : "";
          const prop = syncState.finalProposal;
          const vDraft = prop || draftsStore.verdict;
          const reasons = [
            { id: "viales-spa", txt: "Alcaloides positivos en frascos del spa y estancia sin testigos en Cabina 2" },
            { id: "huella-coartada", txt: "Huella AFIS W-14 en el disyuntor, llave KEY-DIR-01 y coartada rota (los otros dos confirmados)" },
            { id: "ip-suite", txt: "Transferencia bancaria programada en diferido con ausencia de red en Suite 303" },
            { id: "llave-servicio", txt: "Tarjeta electrónica de servicio usada en Hab. 206 durante el brindis" }
          ];
          finalTrialHtml = `
            ${showdownHtml}
            <div class="glass-card answer-card" style="border:var(--vg-border-crimson);">
              <span class="badge badge-crimson">PASO 2 · CAREO FINAL ENTRE ${remaining.length} SOSPECHOSOS</span>
              <h3 style="margin:10px 0 6px;font-size:1.15rem;">Emitir Acusación Conjunta y Justificada</h3>
              <p class="day-story" style="margin-bottom:12px;">Cruzad el laboratorio de Miguel y las coartadas de Patri para señalar al culpable y justificar la detención:</p>
              ${prop && prop.byRole !== role ? `
                <div class="feedback-banner success" style="margin-bottom:12px;">
                  <strong>${prop.byRole === "miguel" ? "Miguel" : "Patri"}</strong> propone acusar y pide tu segunda firma abajo.
                </div>
              ` : ""}
              <form id="final-verdict-form">
                <div class="input-group">
                  <span class="input-label">1. Culpable elegido entre los ${remaining.length} finalistas</span>
                  <div class="radio-cards-grid" role="radiogroup" aria-label="Culpable elegido">
                    ${remaining.map((s) => `
                      <button type="button" class="radio-card ${vDraft.suspectId === s.id || vDraft.suspect === s.id ? "selected" : ""}" data-fv-suspect="${esc(s.id)}">
                        <span class="radio-card-dot"></span>
                        <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="40" height="40" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0;">
                        <div>
                          <div style="font-weight:700;color:#FFFBEB;">${esc(s.name)}</div>
                          <div style="font-size:0.74rem;color:var(--vg-text-secondary);">${esc(s.role)} · ${esc(s.room)}</div>
                        </div>
                      </button>`).join("")}
                  </div>
                </div>
                <div class="input-group">
                  <span class="input-label">2. Prueba determinante y razón del descarte</span>
                  <div class="radio-cards-grid" role="radiogroup" aria-label="Justificación forense">
                    ${reasons.map((r) => `
                      <button type="button" class="radio-card ${(vDraft.reason || "") === r.id ? "selected" : ""}" data-fv-reason="${esc(r.id)}">
                        <span class="radio-card-dot"></span>
                        <span>${esc(r.txt)}</span>
                      </button>`).join("")}
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label" for="fv-poison">3. Veneno hallado en la copa</label>
                  <input id="fv-poison" type="text" class="adv-input" value="${esc(vDraft.poison || "")}" placeholder="Ej. nombre de la toxina o planta" autocapitalize="characters" autocorrect="off" spellcheck="false" autocomplete="off" required>
                </div>
                <div class="input-group">
                  <label class="input-label" for="fv-method">4. Maniobra ejecutada desde Planta 1 a las 23:38 h</label>
                  <input id="fv-method" type="text" class="adv-input" value="${esc(vDraft.method || "")}" placeholder="Ej. palabra clave de la maniobra" autocapitalize="characters" autocorrect="off" spellcheck="false" autocomplete="off" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">Ejecutar Orden de Detención</button>
              </form>
              <div id="final-feedback"></div>
            </div>`;
        }
      } else {
        const ep = syncState.finalEpilogue || {};
        const gift = window.GIFT_CONFIG.finalGiftReveal;
        finalTrialHtml = `
          <div class="glass-card answer-card" style="border:var(--vg-border-pine);">
            <span class="badge badge-pine">${esc(ep.title || "CASO CERRADO")}</span>
            <h3 style="margin:10px 0 8px;font-size:1.2rem;">Culpable arrestada: ${esc(ep.culpritName || "")}</h3>
            <p class="day-story">${esc(ep.confession || "")}</p>
            <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
              <button type="button" class="btn btn-sm btn-gold" id="print-closing-btn">Acta Oficial de Cierre</button>
              <button type="button" class="btn btn-sm btn-ghost" id="show-final-archive-btn">Ver evidencias finales</button>
            </div>
          </div>
          <div id="final-archive-box" style="display:none;">
            ${window.DayArtifacts?.renderFinalShowdown ? window.DayArtifacts.renderFinalShowdown(role, (window.SUSPECTS_DATA || []).filter((s) => s.id === ep.culpritId || ["s14", "s17"].includes(s.id))) : ""}
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
      <div class="hint-item">
        <div class="mono" style="font-size:0.68rem;color:var(--adv-gold-soft);margin-bottom:3px;">${esc(hintTiers[i] || `Pista ${i + 1}`)}</div>
        <div>${esc(h)}</div>
      </div>
    `).join("");

    container.innerHTML = `
      <div class="day-workspace">
        <div class="glass-card day-header-card">
          <div class="day-kicker-row">
            <span class="badge badge-gold">${esc(dayObj.kicker)}</span>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
              ${maxOpen > 1 ? `
                <select id="day-quick-jump" class="adv-select" style="width:auto;min-height:38px;padding:4px 10px;font-size:0.82rem;" aria-label="Saltar a puerta">
                  ${Array.from({ length: maxOpen }, (_, i) => i + 1).map((dNum) => `<option value="${dNum}" ${dNum === selectedDayNum ? "selected" : ""}>Día ${String(dNum).padStart(2, "0")}</option>`).join("")}
                </select>
              ` : ""}
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

          <details style="margin-top:12px;border-top:1px dashed rgba(255,255,255,0.12);padding-top:10px;">
            <summary class="mono" style="font-size:0.74rem;color:var(--adv-frost);cursor:pointer;">Parte de Enlace Asimétrico con ${partnerName}</summary>
            <div style="margin-top:8px;">
              ${partnerDispatch?.text ? `<div class="clue-box" style="margin-bottom:8px;font-size:0.8rem;"><strong>Dato enviado por ${partnerName}:</strong> ${esc(partnerDispatch.text)}</div>` : `<div class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);margin-bottom:8px;">${partnerName} aún no ha remitido ningún dato en esta puerta.</div>`}
              <form id="dispatch-form" style="display:flex;gap:8px;">
                <input type="text" id="dispatch-input" class="adv-input" value="${esc(myDispatch?.text || "")}" placeholder="Enviar dato breve a ${partnerName}..." style="min-height:44px;">
                <button type="submit" class="btn btn-sm btn-frost" style="flex-shrink:0;">Enviar</button>
              </form>
            </div>
          </details>
        </div>

        ${validationHtml}
        ${finalTrialHtml}

        <div class="glass-card" style="padding:16px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
            <span style="font-size:0.84rem;font-weight:600;">¿Atascados? Pistas graduadas (${hintsCount}/3)</span>
            <button type="button" class="btn btn-sm btn-ghost" id="reveal-hint-btn" ${hintsCount >= 3 ? "disabled" : ""}>
              ${hintsCount >= 3 ? "Máximo alcanzado" : `Mostrar Pista ${hintsCount + 1}`}
            </button>
          </div>
          <div class="hints-accordion">${hintsHtml}</div>
        </div>
      </div>
    `;

    const widgetMount = document.getElementById("widget-mount");
    const draftKey = `${dayObj.day}-${role}`;
    if (widgetMount) {
      window.PuzzleEngine.wireWidgetEvents(widgetMount, (serialized) => {
        if (serialized) draftsStore.widgets[draftKey] = serialized;
        else delete draftsStore.widgets[draftKey];
        saveDrafts();
      });
      if (draftsStore.widgets[draftKey]) {
        window.PuzzleEngine.restoreWidgetState(widgetMount, draftsStore.widgets[draftKey]);
      }
    }

    container.querySelectorAll("[data-zoom-artifact]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const env = btn.closest(".artifact-envelope");
        const body = env?.querySelector(".artifact-body");
        if (!body) return;
        showModal(`
          <span class="badge badge-gold">INSPECCIÓN AMPLIADA DE INDICIO</span>
          <h3 id="adv-modal-title" class="serif" style="font-size:1.35rem;margin:8px 0 12px;">Día ${String(dayObj.day).padStart(2, "0")} · Evidencia</h3>
          <div style="overflow-x:auto;">${body.innerHTML}</div>
          <button type="button" class="btn btn-ghost" style="width:100%;margin-top:14px;" id="close-modal-btn">Cerrar visor</button>
        `, btn);
        document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
      });
    });

    container.querySelectorAll("[data-lightbox-img]").forEach((btn) => {
      btn.addEventListener("click", () => openImageLightbox(btn.dataset.lightboxImg, btn.dataset.lightboxCap, btn));
    });

    document.getElementById("day-quick-jump")?.addEventListener("change", (e) => {
      const target = Number(e.target.value);
      if (target >= 1 && target <= 24 && window.DateGate.isDayOpen(target)) {
        userPickedDay = true;
        selectedDayNum = target;
        lastDaySignature = "";
        window.AudioFX.stopMorse?.();
        window.SyncEngine.setViewingDay(selectedDayNum);
        renderDayView(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    container.querySelectorAll("[data-day-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = selectedDayNum + Number(btn.dataset.dayNav);
        if (next >= 1 && next <= 24 && window.DateGate.isDayOpen(next)) {
          userPickedDay = true;
          selectedDayNum = next;
          lastDaySignature = "";
          window.AudioFX.stopMorse?.();
          window.SyncEngine.setViewingDay(selectedDayNum);
          if (window.history?.pushState) window.history.pushState({ tab: "day", day: selectedDayNum }, "");
          renderDayView(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });

    container.querySelectorAll("[data-back-cal], [data-back-cal-bottom]").forEach((btn) => {
      btn.addEventListener("click", () => switchTab("calendar"));
    });

    document.getElementById("dispatch-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("dispatch-input");
      if (!inp) return;
      window.SyncEngine.sendFieldDispatch(dayObj.day, role, inp.value);
      clearKeyboardOpen();
      showToast(`Dato remitido a ${partnerName}.`);
    });

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
      draftsStore.inputs[String(dayObj.day)] = dayAnsInp.value;
      saveDrafts();
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

        clearKeyboardOpen();
        delete draftsStore.inputs[String(dayObj.day)];
        delete draftsStore.widgets[draftKey];
        saveDrafts();
        window.AudioFX.sealBreak?.() || window.AudioFX.success();
        if (window.triggerGoldBurst) window.triggerGoldBurst(34);
        const decoded = window.PuzzleEngine.decodePayload(dayObj.unlockPayload);
        window.SyncEngine.solveDayPart(dayObj.day, role, dayObj.mode, decoded);
      } finally {
        isSubmitting = false;
        if (submitBtn && submitBtn.isConnected) submitBtn.disabled = false;
      }
    });

    container.querySelectorAll("[data-fv-suspect]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AudioFX.click();
        draftsStore.verdict.suspect = btn.dataset.fvSuspect;
        saveDrafts();
        container.querySelectorAll("[data-fv-suspect]").forEach((b) => b.classList.toggle("selected", b === btn));
      });
    });

    container.querySelectorAll("[data-fv-reason]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AudioFX.click();
        draftsStore.verdict.reason = btn.dataset.fvReason;
        saveDrafts();
        container.querySelectorAll("[data-fv-reason]").forEach((b) => b.classList.toggle("selected", b === btn));
      });
    });

    document.getElementById("fv-poison")?.addEventListener("input", (e) => {
      draftsStore.verdict.poison = e.target.value;
      saveDrafts();
    });
    document.getElementById("fv-method")?.addEventListener("input", (e) => {
      draftsStore.verdict.method = e.target.value;
      saveDrafts();
    });

    document.getElementById("final-verdict-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      const sVal = draftsStore.verdict.suspect || syncState.finalProposal?.suspectId || "";
      const rVal = draftsStore.verdict.reason || syncState.finalProposal?.reason || "";
      const pVal = document.getElementById("fv-poison")?.value || "";
      const mVal = document.getElementById("fv-method")?.value || "";
      const fb = document.getElementById("final-feedback");
      if (!sVal || !rVal) {
        window.AudioFX.error();
        if (fb) fb.innerHTML = `<div class="feedback-banner error">Selecciona primero al sospechoso culpable y la justificación forense en las tarjetas.</div>`;
        return;
      }

      openConfirmModal(
        "Emitir Orden de Detención",
        "¿Confirmáis enviar esta acusación definitiva tras contrastar ambos terminales?",
        "Confirmar acusación",
        async () => {
          isSubmitting = true;
          try {
            const fv = dayObj.finalVerdict;
            const ok1 = await window.PuzzleEngine.matchesHashes(sVal, fv.suspectHashes);
            const okR = !fv.reasonHashes || await window.PuzzleEngine.matchesHashes(rVal, fv.reasonHashes);
            const ok2 = await window.PuzzleEngine.matchesHashes(pVal, fv.poisonHashes);
            const ok3 = await window.PuzzleEngine.matchesHashes(mVal, fv.methodHashes);

            if (!ok1 || !okR || !ok2 || !ok3) {
              window.AudioFX.error();
              if (fb) fb.innerHTML = `<div class="feedback-banner error">Alguno de los elementos de la acusación o la justificación forense no coincide con el careo de ambos terminales.</div>`;
              const card = fb?.closest(".answer-card");
              if (card) {
                card.classList.remove("shake-error");
                void card.offsetWidth;
                card.classList.add("shake-error");
              }
              return;
            }

            clearKeyboardOpen();
            window.AudioFX.success();
            if (window.triggerGoldBurst) window.triggerGoldBurst(72);
            const decoded = window.PuzzleEngine.decodePayload(dayObj.unlockPayload);
            const remainingNow = (window.SUSPECTS_DATA || []).filter((s) => !(syncState.discardedIds || []).includes(s.id));
            const culpritId = decoded?.finalEpilogue?.culpritId;
            const innocentIds = remainingNow.map((s) => s.id).filter((id) => id !== culpritId);
            window.SyncEngine.solveFinalVerdict(decoded?.finalEpilogue || null, innocentIds);
          } finally {
            isSubmitting = false;
          }
        }
      );
    });

    document.getElementById("print-closing-btn")?.addEventListener("click", () => {
      window.print();
    });

    document.getElementById("show-final-archive-btn")?.addEventListener("click", () => {
      const box = document.getElementById("final-archive-box");
      if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    });
  }

  function getRoomFloor(roomStr) {
    const r = String(roomStr || "").toLowerCase();
    if (/(301|302|303|304|305)/.test(r)) return "Planta 3";
    if (/(201|202|203|204|205|206|207|208)/.test(r)) return "Planta 2";
    if (/(101|102|105|106|107|108)/.test(r)) return "Planta 1";
    return "Sótano / Anexo";
  }

  function applySuspectFilterOnly() {
    const container = document.getElementById("view-suspects");
    if (!container) return;
    container.querySelectorAll("[data-filter]").forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === suspectFilter));
    container.querySelectorAll("[data-group-filter]").forEach((btn) => btn.classList.toggle("active", btn.dataset.groupFilter === suspectGroupFilter));
    container.querySelectorAll("[data-floor-filter]").forEach((btn) => btn.classList.toggle("active", btn.dataset.floorFilter === suspectFloorFilter));

    const q = suspectSearch.trim().toLowerCase();
    container.querySelectorAll("[data-suspect-id]").forEach((card) => {
      const isOut = card.dataset.discarded === "1";
      const grp = card.dataset.group || "";
      const flr = card.dataset.floor || "";
      const hay = (card.dataset.search || "").toLowerCase();
      const hideStatus = (suspectFilter === "pending" && isOut) || (suspectFilter === "discarded" && !isOut);
      const hideGroup = suspectGroupFilter !== "all" && grp !== suspectGroupFilter;
      const hideFloor = suspectFloorFilter !== "all" && flr !== suspectFloorFilter;
      const hideQuery = q && !hay.includes(q);
      card.classList.toggle("is-hidden-by-filter", Boolean(hideStatus || hideGroup || hideFloor || hideQuery));
    });
  }

  function computeSuspectsSignature() {
    const discarded = syncState.discardedIds || [];
    const solvedDays = Object.keys(syncState.days || {}).filter((k) => syncState.days[k]?.solved).map(Number);
    const discoveryLimit = Math.max(window.DateGate.getMaxOpenDay(), ...(solvedDays.length ? solvedDays : [0]), 0);
    return JSON.stringify({
      discoveryLimit,
      discarded,
      fv: syncState.finalVerdictSolved,
      culpritId: syncState.finalEpilogue?.culpritId || null,
      sNotes: syncState.suspectNotes
    });
  }

  function renderSuspectsView(force = false) {
    const container = document.getElementById("view-suspects");
    if (!container || !currentRole) return;

    const sig = computeSuspectsSignature();
    const existingTa = document.getElementById("shared-notes-area");

    if (!force && sig === lastSuspectsSignature && existingTa) {
      const remoteNotes = syncState.sharedNotes || "";
      if (document.activeElement !== existingTa) {
        if (existingTa.value !== remoteNotes) existingTa.value = remoteNotes;
      } else if (remoteNotes !== existingTa.value && remoteNotes.length > 0) {
        const conflictBox = document.getElementById("notes-remote-conflict");
        if (conflictBox) conflictBox.style.display = "flex";
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
    const culpritId = syncState.finalEpilogue?.culpritId;
    const discardedInView = discovered.filter((s) => discarded.includes(s.id) || (syncState.finalVerdictSolved && culpritId && s.id !== culpritId)).length;
    const activeInView = discovered.length - discardedInView;

    container.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">Sospechosos descubiertos (${discovered.length}/25)</h2>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
          <span class="badge badge-crimson">${discardedInView} descartados · ${activeInView} activos</span>
          <a href="#notes-card-anchor" class="btn btn-sm btn-ghost" style="min-height:36px;">Ir a Libreta</a>
        </div>
      </div>

      ${discovered.length > 0 ? `
        <div style="margin-bottom:10px;">
          <input type="search" id="suspect-search-input" class="adv-input" value="${esc(suspectSearch)}" placeholder="Buscar por nombre, rol o habitación..." style="min-height:44px;">
        </div>
        <div class="suspect-filters">
          <button type="button" class="filter-chip ${suspectFilter === "all" ? "active" : ""}" data-filter="all">Todos (${discovered.length})</button>
          <button type="button" class="filter-chip ${suspectFilter === "pending" ? "active" : ""}" data-filter="pending">Sospechosos (${activeInView})</button>
          <button type="button" class="filter-chip ${suspectFilter === "discarded" ? "active" : ""}" data-filter="discarded">Descartados (${discardedInView})</button>
        </div>
        <div class="suspect-filters" style="margin-top:-4px;">
          <button type="button" class="filter-chip ${suspectGroupFilter === "all" ? "active" : ""}" data-group-filter="all">Huéspedes y Personal</button>
          <button type="button" class="filter-chip ${suspectGroupFilter === "Huésped" ? "active" : ""}" data-group-filter="Huésped">Huéspedes</button>
          <button type="button" class="filter-chip ${suspectGroupFilter === "Personal" ? "active" : ""}" data-group-filter="Personal">Personal</button>
        </div>
        <div class="suspect-filters" style="margin-top:-4px;">
          ${["all", "Planta 3", "Planta 2", "Planta 1", "Sótano / Anexo"].map((fl) => `
            <button type="button" class="filter-chip ${suspectFloorFilter === fl ? "active" : ""}" data-floor-filter="${fl}">${fl === "all" ? "Todas las plantas" : fl}</button>
          `).join("")}
        </div>
      ` : ""}

      ${discovered.length === 0 ? `
        <div class="glass-card" style="padding:22px;text-align:center;">
          <p class="day-story">Los implicados irán apareciendo progresivamente conforme se abran las puertas del calendario a partir del <strong>1 de diciembre</strong>.</p>
        </div>
      ` : `
        <div class="suspects-grid">
          ${discovered.map((s) => {
            const isOut = discarded.includes(s.id);
            const isCulprit = Boolean(syncState.finalVerdictSolved && culpritId && s.id === culpritId);
            const isExonerated = Boolean(syncState.finalVerdictSolved && !isCulprit);
            const floor = getRoomFloor(s.room);
            const statusPill = isCulprit
              ? `<span class="badge badge-gold" style="padding:2px 7px;font-size:0.65rem;">CULPABLE</span>`
              : (isOut || isExonerated)
                ? `<span class="badge badge-crimson" style="padding:2px 7px;font-size:0.65rem;">${isExonerated && !isOut ? "EXONERADO" : "DESCARTADO"}</span>`
                : `<span class="badge badge-frost" style="padding:2px 7px;font-size:0.65rem;">SOSPECHOSO</span>`;
            return `
              <button type="button" class="suspect-card ${(isOut || isExonerated) ? "is-discarded" : ""} ${isCulprit ? "is-culprit-final" : ""}" data-suspect-id="${esc(s.id)}" data-discarded="${(isOut || isExonerated) ? "1" : "0"}" data-group="${esc(s.group)}" data-floor="${esc(floor)}" data-search="${esc(`${s.name} ${s.role} ${s.room}`)}">
                <div class="suspect-avatar-wrap">
                  <img src="${esc(s.portrait)}" alt="${esc(s.name)}" class="suspect-avatar" width="78" height="78" loading="lazy" decoding="async">
                  ${(isOut || isExonerated) ? `<div class="suspect-stamp">${isExonerated && !isOut ? "Exonerado" : "Descartado"}</div>` : ""}
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

      <div id="notes-card-anchor" class="glass-card" style="padding:18px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;flex-wrap:wrap;">
          <strong>Libreta Compartida (Miguel y Patri)</strong>
          <span class="mono" style="font-size:0.7rem;color:var(--vg-text-muted);" id="notes-status">${syncMode === "firebase" ? "Sincronizada en nube" : "Guardado local"}</span>
        </div>
        <div id="notes-remote-conflict" style="display:none;margin-bottom:8px;padding:8px 10px;border-radius:8px;background:rgba(251,191,36,0.14);border:var(--vg-border-gold);justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:0.78rem;">
          <span>Tu pareja acaba de actualizar la libreta.</span>
          <button type="button" class="btn btn-sm btn-gold" id="notes-merge-btn" style="min-height:34px;">Fusionar cambios</button>
        </div>
        <textarea id="shared-notes-area" class="adv-textarea" placeholder="Anotad aquí sospechas, teorías o pistas compartidas...">${esc(preservedNotes)}</textarea>
      </div>
    `;

    applySuspectFilterOnly();
    updateSyncBadgesOnly();

    document.getElementById("suspect-search-input")?.addEventListener("input", (e) => {
      suspectSearch = e.target.value;
      applySuspectFilterOnly();
    });
    container.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => { suspectFilter = btn.dataset.filter; applySuspectFilterOnly(); });
    });
    container.querySelectorAll("[data-group-filter]").forEach((btn) => {
      btn.addEventListener("click", () => { suspectGroupFilter = btn.dataset.groupFilter; applySuspectFilterOnly(); });
    });
    container.querySelectorAll("[data-floor-filter]").forEach((btn) => {
      btn.addEventListener("click", () => { suspectFloorFilter = btn.dataset.floorFilter; applySuspectFilterOnly(); });
    });

    container.querySelectorAll("[data-suspect-id]").forEach((card) => {
      card.addEventListener("click", () => openSuspectModal(card.dataset.suspectId, card));
    });

    const ta = document.getElementById("shared-notes-area");
    if (wasFocused && ta) ta.focus();
    ta?.addEventListener("input", () => {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        window.SyncEngine.saveNotes(ta.value, currentRole);
      }, 450);
    });

    document.getElementById("notes-merge-btn")?.addEventListener("click", () => {
      if (!ta) return;
      const remote = syncState.sharedNotes || "";
      if (remote && !ta.value.includes(remote)) {
        ta.value = `${ta.value.trim()}\n\n--- Nota de pareja ---\n${remote}`.trim();
        window.SyncEngine.saveNotes(ta.value, currentRole);
      }
      document.getElementById("notes-remote-conflict").style.display = "none";
    });
  }

  function renderExpedienteView() {
    const container = document.getElementById("view-expediente");
    if (!container || !currentRole) return;

    const lore = window.CASE_LORE;
    const solvedDaysArr = Object.entries(syncState.days || {})
      .filter(([, d]) => d && d.solved)
      .map(([k, d]) => ({ day: Number(k), ...d }))
      .sort((a, b) => a.day - b.day);
    const openInquiries = solvedDaysArr.filter((d) => !d.discardId);
    const totalHintsUsed = Object.values(syncState.hintsUnlocked || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);

    const solvedDaysNums = solvedDaysArr.map((d) => d.day);
    const discoveryLimit = Math.max(window.DateGate.getMaxOpenDay(), ...(solvedDaysNums.length ? solvedDaysNums : [0]), 0);
    const floorSuspects = (window.SUSPECTS_DATA || []).filter((s) => (s.discoveredDay || 1) <= discoveryLimit && getRoomFloor(s.room) === expedienteFloor);

    // Preservar iframe si ya estaba montado
    const existingMount = document.getElementById("exp-briefing-mount");
    const hadIframe = existingMount && existingMount.querySelector("iframe");
    const preservedIframeEl = hadIframe ? existingMount.querySelector("iframe") : null;

    container.innerHTML = `
      <div class="day-workspace">
        <div class="glass-card" style="padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-crimson">ATESTADO INICIAL · 30 NOV</span>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" class="btn btn-sm btn-frost" id="exp-manual-btn">Manual de Campo</button>
              <button type="button" class="btn btn-sm btn-gold" id="exp-dedication-btn">${getSvg("gift")} Dedicatoria</button>
            </div>
          </div>
          <h2 class="serif" style="font-size:1.5rem;margin:10px 0 6px;">${esc(lore.victim.name)} (${lore.victim.age} años)</h2>
          <p class="day-story" style="margin-bottom:8px;"><strong>Cargo:</strong> ${esc(lore.victim.role)}</p>
          <p class="day-story" style="margin-bottom:8px;"><strong>Hallazgo:</strong> ${esc(lore.victim.foundAt)}</p>
          <p class="day-story">${esc(lore.victim.initialFinding)}</p>
          <ul class="clue-list" style="margin-top:12px;">
            ${lore.incidentSummary.map((line) => `<li>${esc(line)}</li>`).join("")}
          </ul>
          <div class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);margin-top:10px;">
            Pistas utilizadas en el caso: ${totalHintsUsed} / 72 · Puertas resueltas: ${solvedDaysArr.length} / 24
          </div>
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:10px;">Cronología Forense y Diligencias Abiertas</h3>
          <ul class="clue-list" style="margin-bottom:12px;">
            <li><strong>19:00 h:</strong> Tormenta severa aísla la carretera y detiene el teleférico.</li>
            <li><strong>23:38–23:42 h:</strong> Apagón eléctrico exacto de cuatro minutos durante el brindis.</li>
            <li><strong>23:55 h:</strong> Hallazgo sin vida de Arturo Valdivieso junto al abeto navideño.</li>
            ${solvedDaysArr.map((d) => `<li><strong>Puerta ${String(d.day).padStart(2, "0")} (${esc(d.forensicTag || "Resuelta")}):</strong> ${esc(d.conclusion)}</li>`).join("")}
          </ul>
          ${openInquiries.length ? `
            <div class="feedback-banner success" style="border-color:rgba(251,191,36,0.45);background:rgba(251,191,36,0.10);color:#FEF3C7;">
              <strong>Diligencias sin descarte (${openInquiries.length}):</strong> ${openInquiries.map((d) => `Día ${String(d.day).padStart(2, "0")}`).join(" y ")} siguen abiertas para el Careo Final de Nochebuena.
            </div>
          ` : ""}
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:12px;">Escenas del Complejo (toca para ampliar)</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
            ${lore.scenes.map((sc) => `
              <button type="button" data-lightbox-img="${esc(sc.src)}" data-lightbox-cap="${esc(`${sc.title} — ${sc.caption}`)}" style="padding:0;text-align:left;border-radius:14px;overflow:hidden;border:var(--vg-border-specular);background:rgba(5,11,18,0.65);cursor:pointer;">
                <img src="${esc(sc.src)}" alt="${esc(sc.title)}" width="1024" height="572" loading="lazy" decoding="async" style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block;">
                <div style="padding:10px 12px;">
                  <div style="font-weight:600;font-size:0.86rem;color:#FFFBEB;">${esc(sc.title)}</div>
                  <div style="font-size:0.75rem;color:var(--vg-text-secondary);margin-top:3px;">${esc(sc.caption)}</div>
                </div>
              </button>`).join("")}
          </div>
        </div>

        <div class="glass-card" style="padding:18px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <h3 style="font-size:1rem;">Vídeo Briefing del Caso</h3>
            <a href="imprimibles/PRESENTACION_ADVIENTO_CERO.pdf" target="_blank" rel="noopener" download="PRESENTACION_ADVIENTO_CERO.pdf" class="btn btn-sm btn-gold">Dossier PDF (2,1 MB)</a>
          </div>
          <div id="exp-briefing-mount">
            ${preservedIframeEl ? "" : `<button type="button" class="btn btn-frost" id="exp-load-briefing-btn" style="width:100%;">Reproducir Vídeo Briefing Oficial</button>`}
          </div>
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:10px;">Plano Interactivo por Plantas</h3>
          <div class="suspect-filters" style="margin-bottom:10px;">
            ${["Planta 3", "Planta 2", "Planta 1", "Sótano / Anexo"].map((fl) => `
              <button type="button" class="filter-chip ${expedienteFloor === fl ? "active" : ""}" data-exp-floor="${fl}">${fl}</button>
            `).join("")}
          </div>
          <ul class="clue-list" style="margin-bottom:10px;">
            ${lore.hotelZones.filter((z) => z.floor.includes(expedienteFloor.split(" ")[0])).map((z) => `<li><strong>${esc(z.floor)} · ${esc(z.zone)}:</strong> ${esc(z.note)}</li>`).join("")}
          </ul>
          ${floorSuspects.length ? `
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${floorSuspects.map((s) => `<button type="button" class="btn btn-sm btn-ghost" data-exp-suspect="${esc(s.id)}">${esc(s.room)} · ${esc(s.name)}</button>`).join("")}
            </div>
          ` : `<div class="mono" style="font-size:0.74rem;color:var(--vg-text-muted);">Sin sospechosos descubiertos en esta planta todavía.</div>`}
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:10px;">Confort Nocturno y Copia de Seguridad</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <button type="button" class="btn btn-sm ${userPrefs.fontBoost ? "btn-gold" : "btn-ghost"}" id="pref-font-btn">Texto +15%: ${userPrefs.fontBoost ? "ON" : "OFF"}</button>
            <button type="button" class="btn btn-sm ${userPrefs.nightSoft ? "btn-gold" : "btn-ghost"}" id="pref-night-btn">Lectura Nocturna: ${userPrefs.nightSoft ? "ON" : "OFF"}</button>
            <button type="button" class="btn btn-sm ${userPrefs.reducedMotion ? "btn-gold" : "btn-ghost"}" id="pref-motion-btn">Animación reducida: ${userPrefs.reducedMotion ? "ON" : "OFF"}</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-frost" id="export-diary-btn">Exportar Diario (.md)</button>
            <button type="button" class="btn btn-sm btn-ghost" id="export-json-btn">Backup JSON</button>
          </div>
        </div>

        <div style="text-align:center;padding:10px 0;">
          <button type="button" id="version-secret-trigger" class="mono" style="min-height:44px;padding:8px 12px;background:none;border:none;color:var(--vg-text-muted);font-size:0.74rem;cursor:pointer;">
            ${APP_VERSION} · ADVIENTO CERO · MODO CERO SPOILERS
          </button>
        </div>
      </div>
    `;

    if (preservedIframeEl) {
      document.getElementById("exp-briefing-mount")?.appendChild(preservedIframeEl);
    }

    document.getElementById("exp-manual-btn")?.addEventListener("click", openRulesModal);
    document.getElementById("exp-dedication-btn")?.addEventListener("click", (e) => openDedicationModal(e.currentTarget));
    document.getElementById("exp-load-briefing-btn")?.addEventListener("click", () => {
      const mount = document.getElementById("exp-briefing-mount");
      if (mount) mount.innerHTML = `<iframe src="video-briefing/index.html" title="Vídeo Briefing del Caso" class="briefing-frame" style="width:100%;height:360px;border:none;border-radius:12px;background:#040907;display:block;"></iframe>`;
    });

    container.querySelectorAll("[data-lightbox-img]").forEach((btn) => {
      btn.addEventListener("click", () => openImageLightbox(btn.dataset.lightboxImg, btn.dataset.lightboxCap, btn));
    });
    container.querySelectorAll("[data-exp-floor]").forEach((btn) => {
      btn.addEventListener("click", () => { expedienteFloor = btn.dataset.expFloor; renderExpedienteView(); });
    });
    container.querySelectorAll("[data-exp-suspect]").forEach((btn) => {
      btn.addEventListener("click", () => openSuspectModal(btn.dataset.expSuspect, btn));
    });

    document.getElementById("pref-font-btn")?.addEventListener("click", () => {
      userPrefs.fontBoost = !userPrefs.fontBoost;
      applyUserPrefs();
      renderExpedienteView();
    });
    document.getElementById("pref-night-btn")?.addEventListener("click", () => {
      userPrefs.nightSoft = !userPrefs.nightSoft;
      applyUserPrefs();
      renderExpedienteView();
    });
    document.getElementById("pref-motion-btn")?.addEventListener("click", () => {
      userPrefs.reducedMotion = !userPrefs.reducedMotion;
      applyUserPrefs();
      if (!userPrefs.reducedMotion && window.resumeSnow) window.resumeSnow();
      renderExpedienteView();
    });

    document.getElementById("export-diary-btn")?.addEventListener("click", () => {
      const lines = [
        `# DIARIO DE INVESTIGACION — ADVIENTO CERO`,
        `Fecha exportacion: ${new Date().toLocaleString("es-ES")}`,
        `Puertas resueltas: ${solvedDaysArr.length}/24`,
        ``,
        `## Resoluciones`,
        ...solvedDaysArr.map((d) => `- Dia ${String(d.day).padStart(2, "0")} [${d.forensicTag || "Resuelta"}]: ${d.conclusion}`),
        ``,
        `## Libreta Compartida`,
        syncState.sharedNotes || "(Sin anotaciones)"
      ];
      downloadBlob(lines.join("\n"), "adviento-cero-diario.md", "text/markdown;charset=utf-8");
    });

    document.getElementById("export-json-btn")?.addEventListener("click", () => {
      downloadBlob(JSON.stringify(syncState, null, 2), "adviento-cero-backup.json", "application/json;charset=utf-8");
    });

    document.getElementById("version-secret-trigger")?.addEventListener("click", () => {
      versionTapCount += 1;
      clearTimeout(versionTapTimer);
      versionTapTimer = setTimeout(() => { versionTapCount = 0; }, 2200);
      if (versionTapCount >= 5) {
        versionTapCount = 0;
        window.DateGate.enableAdmin(24);
        window.SyncEngine.init();
        if (currentRole) window.SyncEngine.markPresence(currentRole);
        window.AudioFX.success();
        userPickedDay = false;
        selectDefaultDay();
        lastCalendarSignature = "";
        lastDaySignature = "";
        lastSuspectsSignature = "";
        renderAdminBar();
        renderActiveTab();
      }
    });
  }

  function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function showModal(html, triggerEl, opts = {}) {
    const modal = document.getElementById("adv-modal");
    const body = document.getElementById("adv-modal-body");
    if (!modal || !body) return;
    if (!opts.preserveFocus) {
      lastFocusedEl = triggerEl || document.activeElement;
    }
    body.innerHTML = `
      <div class="adv-modal-topstrip">
        <div class="adv-modal-handle" aria-hidden="true"></div>
        <button type="button" class="adv-modal-close" id="adv-modal-x-btn" aria-label="Cerrar ventana">×</button>
      </div>
      ${html}
    `;
    modal.classList.add("open");
    lockBodyScroll();
    document.getElementById("adv-modal-x-btn")?.addEventListener("click", closeModal);
    if (!opts.fromHistory && window.history?.pushState) {
      window.history.pushState({ modal: true, tab: activeTab, day: selectedDayNum }, "");
    }
    if (!opts.preserveFocus) {
      const focusTarget = body.querySelector("h2, h3, button:not(#adv-modal-x-btn), input, select, textarea") || document.getElementById("adv-modal-x-btn");
      if (focusTarget) focusTarget.focus();
    }
  }

  function closeModal() {
    const modal = document.getElementById("adv-modal");
    if (!modal) return;
    modal.classList.remove("open");
    openModalSuspectId = null;
    if (!document.getElementById("identity-overlay")?.classList.contains("open")) {
      unlockBodyScroll();
      if (window.resumeSnow) window.resumeSnow();
    }
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function" && lastFocusedEl.isConnected) {
      lastFocusedEl.focus();
    }
    lastFocusedEl = null;
  }

  function openImageLightbox(src, caption, triggerEl) {
    let scale = 1;
    showModal(`
      <span class="badge badge-frost">VISOR FOTOGRÁFICO DE EVIDENCIA</span>
      <h3 id="adv-modal-title" class="serif" style="font-size:1.2rem;margin:8px 0 10px;">${esc(caption || "Evidencia")}</h3>
      <div class="lightbox-stage">
        <img src="${esc(src)}" alt="${esc(caption || "Evidencia")}" id="lightbox-img">
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button type="button" class="btn btn-sm btn-frost" style="flex:1;" id="lb-zoom-btn">Zoom 1x → 2x</button>
        <button type="button" class="btn btn-sm btn-ghost" style="flex:1;" id="close-modal-btn">Cerrar</button>
      </div>
    `, triggerEl);
    const img = document.getElementById("lightbox-img");
    const zoomBtn = document.getElementById("lb-zoom-btn");
    zoomBtn?.addEventListener("click", () => {
      scale = scale === 1 ? 2 : scale === 2 ? 3 : 1;
      if (img) img.style.transform = `scale(${scale})`;
      zoomBtn.textContent = scale === 1 ? "Zoom 1x → 2x" : scale === 2 ? "Zoom 2x → 3x" : "Restablecer 1x";
    });
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
  }

  function openRulesModal() {
    showModal(`
      <span class="badge badge-frost">MANUAL DE CAMPO · ADVIENTO CERO</span>
      <h2 id="adv-modal-title" class="serif" style="font-size:1.6rem;margin:10px 0 10px;">Cómo Investigar en Pareja</h2>
      <ul class="clue-list">
        <li><strong>Terminales asimétricos:</strong> Miguel (Análisis Digital) y Patri (Campo y Testigos) ven pistas distintas del mismo día. No miréis la pantalla del otro.</li>
        <li><strong>Doble Candado vs Clave Conjunta:</strong> En algunos días cada uno valida su código propio; en otros introducís la conclusión común tras contrastar vuestros datos.</li>
        <li><strong>Validación flexible:</strong> Las respuestas ignoran mayúsculas, minúsculas, tildes y espacios extra.</li>
        <li><strong>22 descartes + 3 finalistas:</strong> Dos días del calendario retienen diligencias clave sin descartar a nadie, dejando 3 finalistas para el Careo Final justificado del Día 24.</li>
      </ul>
      <button type="button" class="btn btn-primary" style="width:100%;margin-top:16px;" id="close-modal-btn">Entendido</button>
    `);
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
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

  function openSuspectModal(suspectId, triggerEl, preserveFocus = false) {
    const s = (window.SUSPECTS_DATA || []).find((x) => x.id === suspectId);
    if (!s) return;
    openModalSuspectId = suspectId;
    const isOut = (syncState.discardedIds || []).includes(s.id);
    const culpritId = syncState.finalEpilogue?.culpritId;
    const isCulprit = Boolean(syncState.finalVerdictSolved && culpritId && s.id === culpritId);
    const isExonerated = Boolean(syncState.finalVerdictSolved && !isCulprit);
    const solvedEntry = Object.values(syncState.days || {}).find((d) => d && d.discardId === s.id && d.solved);

    const sNotes = syncState.suspectNotes?.[s.id] || {};
    const mySNote = sNotes[currentRole] || { stance: "duda", note: "" };
    const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
    const partnerSNote = sNotes[partnerRole];

    showModal(`
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px;">
        <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="82" height="82" style="width:82px;height:82px;border-radius:14px;object-fit:cover;border:var(--vg-border-specular-strong);">
        <div>
          <span class="badge ${isCulprit ? "badge-gold" : (isOut || isExonerated) ? "badge-crimson" : "badge-gold"}">${isCulprit ? "CULPABLE" : (isOut || isExonerated) ? "DESCARTADO" : `FICHA #${esc(s.num)}`}</span>
          <h3 id="adv-modal-title" style="font-size:1.25rem;margin-top:6px;">${esc(s.name)}</h3>
          <div style="font-size:0.82rem;color:var(--vg-text-secondary);">${esc(s.role)} · ${esc(s.room)}</div>
        </div>
      </div>
      <div class="clue-box">
        <p style="margin-bottom:8px;"><strong>Posible motivo:</strong> ${esc(s.motiveHint)}</p>
        <p><strong>Coartada inicial:</strong> ${esc(s.alibiClaim)}</p>
      </div>
      ${solvedEntry ? `<div class="feedback-banner success"><strong>Resolución:</strong> ${esc(solvedEntry.conclusion)}</div>` : ""}
      ${partnerSNote?.note ? `<div class="clue-box" style="margin-top:10px;font-size:0.8rem;"><strong>Anotación de ${partnerRole === "miguel" ? "Miguel" : "Patri"} (${esc(partnerSNote.stance)}):</strong> ${esc(partnerSNote.note)}</div>` : ""}
      <form id="suspect-note-form" style="margin-top:12px;">
        <div class="mono" style="font-size:0.72rem;color:var(--adv-gold-soft);margin-bottom:6px;">Tu valoración sobre ${esc(s.name)}</div>
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
          ${["sospecha", "duda", "inocente"].map((st) => `
            <button type="button" class="filter-chip ${mySNote.stance === st ? "active" : ""}" data-stance="${st}" style="min-height:38px;">${st.toUpperCase()}</button>
          `).join("")}
        </div>
        <div style="display:flex;gap:8px;">
          <input type="text" id="suspect-note-inp" class="adv-input" value="${esc(mySNote.note || "")}" placeholder="Apunte rápido de coartada..." style="min-height:44px;">
          <button type="submit" class="btn btn-sm btn-frost" style="flex-shrink:0;">Guardar</button>
        </div>
      </form>
      <button type="button" class="btn btn-ghost" style="width:100%;margin-top:14px;" id="close-modal-btn">Cerrar ficha</button>
    `, triggerEl, { preserveFocus, fromHistory: preserveFocus });

    let chosenStance = mySNote.stance || "duda";
    document.querySelectorAll("[data-stance]").forEach((b) => {
      b.addEventListener("click", () => {
        chosenStance = b.dataset.stance;
        document.querySelectorAll("[data-stance]").forEach((x) => x.classList.toggle("active", x === b));
      });
    });
    document.getElementById("suspect-note-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = document.getElementById("suspect-note-inp");
      window.SyncEngine.saveSuspectNote(s.id, currentRole, chosenStance, inp ? inp.value : "");
      showToast(`Valoración guardada en ficha #${s.num}.`);
    });
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
    const maxOpen = window.DateGate.getMaxOpenDay();
    if (maxOpen === 0) {
      openDedicationModal();
      return;
    }
    if (currentRole === "patri" && maxOpen >= 1) {
      try {
        if (localStorage.getItem(DEDICATION_SEEN_KEY) === "1") return;
        localStorage.setItem(DEDICATION_SEEN_KEY, "1");
      } catch (_) {}
      openDedicationModal();
    }
  }

  function detectPartnerProgressToast(newSt) {
    if (!prevSyncSnap || !currentRole) {
      prevSyncSnap = JSON.parse(JSON.stringify(newSt));
      return;
    }
    const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
    const partnerName = partnerRole === "miguel" ? "Miguel" : "Patri";
    const pFlag = partnerRole === "miguel" ? "miguelSolved" : "patriSolved";

    Object.keys(newSt.days || {}).forEach((k) => {
      const prevD = prevSyncSnap.days?.[k] || {};
      const curD = newSt.days[k] || {};
      if (!prevD[pFlag] && curD[pFlag]) {
        window.AudioFX.partnerPing?.();
        showToast(`${partnerName} acaba de validar su parte del Día ${String(k).padStart(2, "0")}.`);
      }
      const prevH = Number(prevSyncSnap.hintsUnlocked?.[k] || 0);
      const curH = Number(newSt.hintsUnlocked?.[k] || 0);
      if (curH > prevH) {
        showToast(`${partnerName} desbloqueó la Pista ${curH} del Día ${String(k).padStart(2, "0")}.`);
      }
    });
    prevSyncSnap = JSON.parse(JSON.stringify(newSt));
  }

  function renderActiveTab() {
    if (activeTab === "calendar") renderCalendarView();
    else if (activeTab === "day") renderDayView();
    else if (activeTab === "suspects") renderSuspectsView();
    else if (activeTab === "expediente") renderExpedienteView();
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyUserPrefs();
    initSnowCanvas();

    if (!currentRole) {
      openIdentityOverlay(true);
    }

    document.querySelectorAll("[data-choose-role]").forEach((btn) => {
      btn.addEventListener("click", () => setRole(btn.dataset.chooseRole));
    });

    document.getElementById("identity-cancel-btn")?.addEventListener("click", closeIdentityOverlay);
    document.getElementById("identity-overlay")?.addEventListener("click", (e) => {
      if (e.target.id === "identity-overlay" && currentRole) closeIdentityOverlay();
    });

    document.querySelectorAll(".dock-item").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    document.getElementById("adv-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "adv-modal") closeModal();
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-sync-diag]")) {
        openSyncDiagModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (document.getElementById("adv-modal")?.classList.contains("open")) {
          closeModal();
        } else if (document.getElementById("identity-overlay")?.classList.contains("open") && currentRole) {
          closeIdentityOverlay();
        }
        return;
      }
      // Trampa de foco básica dentro de #adv-modal
      if (e.key === "Tab" && document.getElementById("adv-modal")?.classList.contains("open")) {
        const sheet = document.getElementById("adv-modal-body");
        if (!sheet) return;
        const focusables = Array.from(sheet.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'));
        if (focusables.length < 2) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Teclado virtual móvil mediante visualViewport + fallback focusin/out (sin incluir <select>)
    if (window.visualViewport) {
      const baseH = window.innerHeight;
      window.visualViewport.addEventListener("resize", () => {
        const isKb = window.visualViewport.height < baseH * 0.78 && document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
        document.body.classList.toggle("keyboard-open", Boolean(isKb));
      });
    }
    document.addEventListener("focusin", (e) => {
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName) && e.target.type !== "range") {
        document.body.classList.add("keyboard-open");
        if (window.innerWidth <= 768) {
          setTimeout(() => { try { e.target.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (_) {} }, 180);
        }
      }
    });
    document.addEventListener("focusout", () => {
      setTimeout(() => {
        const ae = document.activeElement;
        if (!ae || !/^(INPUT|TEXTAREA)$/.test(ae.tagName) || ae.type === "range") {
          document.body.classList.remove("keyboard-open");
        }
      }, 150);
    });

    window.addEventListener("pagehide", () => {
      clearKeyboardOpen();
      window.AudioFX.stopMorse?.();
    });

    window.addEventListener("message", (e) => {
      if (e.origin && e.origin !== window.location.origin && window.location.origin !== "null") return;
      if (e.data && e.data.type === "briefing-height" && Number(e.data.height) > 200) {
        document.querySelectorAll(".briefing-frame").forEach((fr) => {
          fr.style.height = `${Math.ceil(Number(e.data.height))}px`;
        });
      }
    });

    if (window.history?.replaceState) {
      window.history.replaceState({ tab: "calendar", day: selectedDayNum }, "");
    }
    window.addEventListener("popstate", (e) => {
      if (document.getElementById("adv-modal")?.classList.contains("open")) {
        closeModal();
        return;
      }
      if (document.getElementById("identity-overlay")?.classList.contains("open") && currentRole) {
        closeIdentityOverlay();
        return;
      }
      const targetTab = e.state?.tab || "calendar";
      if (targetTab !== activeTab) {
        switchTab(targetTab, { fromHistory: true, silent: true });
      }
      if (targetTab === "day" && e.state?.day && e.state.day !== selectedDayNum) {
        selectedDayNum = e.state.day;
        lastDaySignature = "";
        renderDayView(true);
      }
    });

    window.SyncEngine.subscribe((st, md) => {
      syncState = st;
      syncMode = md;
      const syncStatus = window.SyncEngine.getStatus();
      if (!initialRemoteApplied && syncStatus.initialSynced) {
        initialRemoteApplied = true;
        if (!userPickedDay && activeTab === "calendar") selectDefaultDay();
      }
      detectPartnerProgressToast(st);
      renderAdminBar();
      renderActiveTab();
      updateDockIndicator();
      if (openModalSuspectId && document.getElementById("adv-modal")?.classList.contains("open")) {
        openSuspectModal(openModalSuspectId, null, true);
      }
    });

    selectDefaultDay();
    window.SyncEngine.init();
    if (currentRole) {
      window.SyncEngine.markPresence(currentRole);
      maybeShowFirstDedication();
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then((reg) => {
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              showToast("Nueva versión disponible de Adviento Cero.", "Actualizar", () => {
                nw.postMessage({ type: "SKIP_WAITING" });
              });
            }
          });
        });
      }).catch(() => {});
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  });
})();
