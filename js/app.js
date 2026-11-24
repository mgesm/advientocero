/**
 * ADVIENTO CERO — CONTROLADOR PRINCIPAL DE APLICACIÓN
 */

(() => {
  const APP_VERSION = "v2.12.2";
  const CACHE_TAG = "adviento-cero-v2.12.2";
  const ROLE_KEY = "adviento_player_role";
  const DEDICATION_SEEN_KEY = "adviento_dedication_seen_v1";
  const DRAFTS_KEY = "adviento_drafts_v1";
  const PREFS_KEY = "adviento_prefs_v1";
  const Store = window.SafeStorage || window.localStorage;

  let overlayHistoryPushed = false;
  let modalHistoryPushed = false;
  let ignorePopstateCount = 0;

  const DAY_SUSPECT_FOCUS = {
    1: { id: "s16", hideBeforeSolve: true }, 2: { id: "s20" }, 3: { id: "s08" }, 4: { id: "s15" },
    5: { id: "s05", hideBeforeSolve: true }, 6: { id: "s21" }, 7: { id: "s12" }, 8: { id: "s17" },
    9: { id: "s04" }, 10: { id: "s10" }, 11: { id: "s24" }, 12: { id: "s19" },
    13: { id: "s18" }, 14: { id: "s22" }, 15: { id: "s06" }, 16: { id: "s11" },
    17: { id: "s02" }, 18: { id: "s25" }, 19: { id: "s14" }, 20: { id: "s07" },
    21: { id: "s01" }, 22: { id: "s23" }, 23: { id: "s09" }, 24: { id: "s13" }
  };

  let currentRole = Store.getItem(ROLE_KEY) || "";
  let activeTab = "calendar";
  let selectedDayNum = 1;
  let userPickedDay = false;
  let suspectFilter = "all";
  let suspectGroupFilter = "all";
  let suspectFloorFilter = "all";
  let suspectWithNotesOnly = false;
  let suspectFiltersExtraOpen = false;
  let suspectSearch = "";
  let compareIds = [];
  let calendarFilter = "all";
  let expedienteFloor = "Planta 1";
  let expSearchQuery = "";
  let timelineFloorFilter = "all";
  let offlinePackStatus = "";
  let notesUndoSnapshot = null;

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
  let lastKnownMaxOpenDay = window.DateGate.getMaxOpenDay();

  const tabScrollY = { calendar: 0, day: 0, suspects: 0, expediente: 0 };
  let draftsStore = loadDraftsStorage();
  let userPrefs = loadJsonStorage(PREFS_KEY, { fontBoost: false, nightSoft: false, reducedMotion: false, highContrastOutdoor: false, pwaBannerDismissed: false });
  let lastAdminSignature = "";
  let lastCalendarSignature = "";
  let lastDaySignature = "";
  let lastSuspectsSignature = "";
  let lastExpedienteSignature = "";

  const esc = (s) => window.PuzzleEngine.escapeHtml(s);

  function loadJsonStorage(key, fallback) {
    try {
      const raw = Store.getItem(key);
      if (!raw) return Object.assign({}, fallback);
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return Object.assign({}, fallback);
      }
      return Object.assign({}, fallback, parsed);
    } catch (_) {
      return Object.assign({}, fallback);
    }
  }

  function loadDraftsStorage() {
    const base = { schemaVersion: 2, inputs: {}, widgets: {}, scratch: {}, verdict: { suspect: "", reason: "", poison: "", method: "" } };
    const loaded = loadJsonStorage(DRAFTS_KEY, base);
    const isPlainObj = (v) => Boolean(v && typeof v === "object" && !Array.isArray(v));
    return {
      schemaVersion: 2,
      inputs: isPlainObj(loaded.inputs) ? loaded.inputs : {},
      widgets: isPlainObj(loaded.widgets) ? loaded.widgets : {},
      scratch: isPlainObj(loaded.scratch) ? loaded.scratch : {},
      verdict: Object.assign({}, base.verdict, isPlainObj(loaded.verdict) ? loaded.verdict : {})
    };
  }

  function saveDrafts() {
    try { Store.setItem(DRAFTS_KEY, JSON.stringify(draftsStore)); } catch (_) {}
  }

  function flushPendingNotes() {
    if (!noteTimer) return;
    clearTimeout(noteTimer);
    noteTimer = null;
    const ta = document.getElementById("shared-notes-area");
    if (ta && currentRole) {
      window.SyncEngine.saveNotes(ta.value, currentRole);
    }
  }

  function applyUserPrefs() {
    document.documentElement.classList.toggle("font-boost", Boolean(userPrefs.fontBoost));
    document.body.classList.remove("font-boost");
    document.body.classList.toggle("night-reading-soft", Boolean(userPrefs.nightSoft));
    document.body.classList.remove("Pref-reduced-motion");
    document.body.classList.toggle("pref-reduced-motion", Boolean(userPrefs.reducedMotion));
    document.body.classList.toggle("high-contrast-outdoor", Boolean(userPrefs.highContrastOutdoor));
    if ((userPrefs.reducedMotion || userPrefs.highContrastOutdoor) && window.clearSnow) window.clearSnow();
    try { Store.setItem(PREFS_KEY, JSON.stringify(userPrefs)); } catch (_) {}
  }

  function getSvg(name) {
    const icons = {
      lock: `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      unlock: `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
      check: `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      hourglass: `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`,
      users: `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      gift: `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`
    };
    return icons[name] || "";
  }

  function showToast(text, actionLabel, onAction) {
    const host = document.getElementById("adv-toast-host");
    if (!host) return;
    const item = document.createElement("div");
    item.className = "adv-toast";
    item.innerHTML = `<span>${esc(text)}</span>${actionLabel ? `<button type="button" class="btn btn-sm btn-gold">${esc(actionLabel)}</button>` : ""}`;
    host.appendChild(item);
    if (actionLabel && typeof onAction === "function") {
      item.querySelector("button")?.addEventListener("click", () => {
        onAction();
        item.remove();
      });
    }
    setTimeout(() => { if (item.isConnected) item.remove(); }, 5200);
  }

  if (window.SafeStorage && typeof window.SafeStorage.onError === "function") {
    let storageWarnShown = false;
    window.SafeStorage.onError(() => {
      if (storageWarnShown) return;
      storageWarnShown = true;
      showToast("Almacenamiento local limitado; los cambios siguen activos en esta sesión.");
    });
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

  function renderBriefingVideoHtml(videoId) {
    const mutedAttr = window.AudioFX?.isMuted?.() ? " muted" : "";
    return `
      <video id="${esc(videoId)}" class="briefing-native-video" controls preload="metadata" poster="imagenes/cover-hotel.jpg" aria-label="Vídeo Briefing Oficial del Caso"${mutedAttr}>
        <source src="video-briefing/briefing.mp4?v=2.12.2" type="video/mp4">
      </video>`;
  }

  function wireBriefingVideoControls(mountEl) {
    const vid = mountEl?.querySelector("video");
    if (!vid || vid.dataset.wiredF6 === "1") return;
    vid.dataset.wiredF6 = "1";
    vid.addEventListener("play", () => {
      window.AudioFX?.acquireWakeLock?.();
      try {
        if ("mediaSession" in navigator && typeof window.MediaMetadata === "function") {
          navigator.mediaSession.metadata = new window.MediaMetadata({
            title: "Briefing Oficial · El Misterio del Ventisquero",
            artist: "UOPJ · Adviento Cero",
            album: "D.P. 24-12/2026",
            artwork: [{ src: "imagenes/cover-hotel.jpg", sizes: "1024x572", type: "image/jpeg" }]
          });
          navigator.mediaSession.setActionHandler("play", () => vid.play().catch(() => {}));
          navigator.mediaSession.setActionHandler("pause", () => vid.pause());
        }
      } catch (_) {}
    });
    const rel = () => window.AudioFX?.releaseWakeLock?.();
    vid.addEventListener("pause", rel);
    vid.addEventListener("ended", rel);
  }

  function syncBriefingVideoMute(muted) {
    document.querySelectorAll(".briefing-native-video").forEach((vid) => {
      try { vid.muted = Boolean(muted); } catch (_) {}
    });
  }

  function pauseBriefingVideos() {
    document.querySelectorAll(".briefing-native-video").forEach((vid) => {
      try { if (!vid.paused) vid.pause(); } catch (_) {}
    });
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
    let lastFrameTs = 0;

    window.triggerGoldBurst = (count = 36) => {
      if (userPrefs.reducedMotion || userPrefs.highContrastOutdoor) return;
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
      return document.hidden || document.body.classList.contains("modal-open") || userPrefs.reducedMotion || userPrefs.highContrastOutdoor;
    }

    function tick(now) {
      rafId = null;
      if (shouldPauseSnow() && sparks.length === 0) return;
      if (now && lastFrameTs && now - lastFrameTs < 38) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      lastFrameTs = now || performance.now();

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
    window.clearSnow = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      sparks.length = 0;
      ctx.clearRect(0, 0, w, h);
    };
    window.resumeSnow = ensureTicking;
    ensureTicking();
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

  let idLastFocusedEl = null;

  function openIdentityOverlay(fromHistory = false) {
    const overlay = document.getElementById("identity-overlay");
    const cancelBtn = document.getElementById("identity-cancel-btn");
    if (!overlay) return;
    if (!fromHistory) idLastFocusedEl = document.activeElement;
    if (cancelBtn) cancelBtn.style.display = currentRole ? "block" : "none";

    overlay.querySelectorAll("[data-choose-role]").forEach((btn) => {
      const r = btn.dataset.chooseRole;
      btn.classList.toggle("is-miguel", r === "miguel");
      btn.classList.toggle("is-patri", r === "patri");
      btn.classList.toggle("is-current", r === currentRole);
    });

    overlay.classList.add("open");
    lockBodyScroll();
    const firstBtn = overlay.querySelector("[data-choose-role]");
    if (firstBtn) setTimeout(() => { try { firstBtn.focus({ preventScroll: true }); } catch (_) {} }, 20);
    if (!fromHistory && currentRole && !overlayHistoryPushed && window.history?.pushState) {
      overlayHistoryPushed = true;
      window.history.pushState({ overlay: "identity", tab: activeTab, day: selectedDayNum }, "");
    }
  }

  function closeIdentityOverlay(fromHistory = false) {
    if (!currentRole) return;
    document.getElementById("identity-overlay")?.classList.remove("open");
    if (!document.getElementById("adv-modal")?.classList.contains("open")) {
      unlockBodyScroll();
      if (window.resumeSnow) window.resumeSnow();
    }
    if (idLastFocusedEl && typeof idLastFocusedEl.focus === "function" && idLastFocusedEl.isConnected) {
      try { idLastFocusedEl.focus({ preventScroll: true }); } catch (_) {}
    }
    idLastFocusedEl = null;
    if (overlayHistoryPushed) {
      overlayHistoryPushed = false;
      if (!fromHistory && window.history?.back) {
        ignorePopstateCount += 1;
        window.history.back();
      }
    }
  }

  function applyRoleSwitch(role) {
    currentRole = role;
    Store.setItem(ROLE_KEY, role);
    closeIdentityOverlay();
    window.SyncEngine.markPresence(role);
    window.AudioFX.click();
    lastAdminSignature = "";
    lastCalendarSignature = "";
    lastDaySignature = "";
    lastSuspectsSignature = "";
    lastExpedienteSignature = "";
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
    flushPendingNotes();
    clearKeyboardOpen();
    window.AudioFX.stopMorse?.();
    tabScrollY[activeTab] = window.scrollY;
    if (activeTab === "day" || activeTab === "expediente") {
      pauseBriefingVideos();
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
    const pendingPill = status.dirty
      ? `<button type="button" class="sync-pending-pill" data-force-sync-now title="Cambios locales pendientes de subir">Pendiente · Sincronizar</button>`
      : "";

    if (navigator.onLine === false) {
      return `<button type="button" class="badge badge-gold" data-open-sync-diag style="cursor:pointer;">Sin conexión (Modo local)</button>${pendingPill}`;
    }
    if (status.syncError) {
      return `<button type="button" class="badge badge-crimson" data-open-sync-diag style="cursor:pointer;">Error sync</button>${pendingPill}`;
    }
    if (status.mode === "firebase") {
      if (!status.initialSynced && !status.connected) {
        return `<button type="button" class="badge badge-gold" data-open-sync-diag style="cursor:pointer;">Conectando...</button>${pendingPill}`;
      }
      if (!status.connected) {
        return `<button type="button" class="badge badge-gold" data-open-sync-diag style="cursor:pointer;">Reconectando...</button>${pendingPill}`;
      }
      const pText = partnerOnline
        ? `${partnerLabel} online${partnerData?.viewingDay ? ` (Día ${String(partnerData.viewingDay).padStart(2, "0")})` : ""}`
        : `Nube activa${partnerData?.lastSeen ? ` · ${partnerLabel} ${formatRelTime(partnerData.lastSeen)}` : ""}`;
      return `<button type="button" class="badge badge-pine" data-open-sync-diag style="cursor:pointer;"><span class="pulse-dot"></span> ${esc(pText)}</button>${pendingPill}`;
    }
    return `<button type="button" class="badge badge-crimson" data-open-sync-diag style="cursor:pointer;">Modo Local</button>${pendingPill}`;
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
      lastAdminSignature = "";
      bar.style.display = "none";
      return;
    }
    const sim = window.DateGate.getSimulatedDay();
    const otherRole = currentRole === "miguel" ? "patri" : "miguel";
    const otherLabel = otherRole === "miguel" ? "Miguel" : "Patri";
    const adminSig = `${currentRole}:${sim}`;
    if (adminSig === lastAdminSignature && bar.innerHTML.trim() !== "") {
      bar.style.display = "flex";
      return;
    }
    lastAdminSignature = adminSig;
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
      lastKnownMaxOpenDay = window.DateGate.getMaxOpenDay();
      userPickedDay = false;
      selectDefaultDay();
      lastAdminSignature = "";
      lastCalendarSignature = "";
      lastDaySignature = "";
      lastSuspectsSignature = "";
      lastExpedienteSignature = "";
      renderAdminBar();
      renderActiveTab();
    });

    document.getElementById("admin-exit-btn")?.addEventListener("click", () => {
      window.DateGate.disableAdmin();
      lastKnownMaxOpenDay = window.DateGate.getMaxOpenDay();
      if (window.location.search.includes("admin=") && window.history?.replaceState) {
        const u = new URL(window.location.href);
        u.searchParams.delete("admin");
        window.history.replaceState(window.history.state, "", u.pathname + u.search + u.hash);
      }
      window.SyncEngine.init();
      if (currentRole) window.SyncEngine.markPresence(currentRole);
      userPickedDay = false;
      selectDefaultDay();
      lastAdminSignature = "";
      lastCalendarSignature = "";
      lastDaySignature = "";
      lastSuspectsSignature = "";
      lastExpedienteSignature = "";
      renderAdminBar();
      renderActiveTab();
    });

    document.getElementById("admin-reset-btn")?.addEventListener("click", () => {
      openConfirmModal(
        "Resetear sala de pruebas",
        "¿Resetear todo el progreso en la sala de pruebas (puertas, descartes y notas)? La partida real no se verá afectada.",
        "Sí, resetear test",
        () => {
          flushPendingNotes();
          try {
            Store.removeItem(DEDICATION_SEEN_KEY);
            Store.removeItem(ROLE_KEY);
            Store.removeItem(DRAFTS_KEY);
          } catch (_) {}
          currentRole = "";
          draftsStore = { schemaVersion: 2, inputs: {}, widgets: {}, scratch: {}, verdict: { suspect: "", reason: "", poison: "", method: "" } };
          const ta = document.getElementById("shared-notes-area");
          if (ta) ta.value = "";
          suspectFilter = "all";
          suspectGroupFilter = "all";
          suspectFloorFilter = "all";
          suspectSearch = "";
          calendarFilter = "all";
          userPickedDay = false;
          prevSyncSnap = null;
          selectDefaultDay();
          lastAdminSignature = "";
          lastCalendarSignature = "";
          lastDaySignature = "";
          lastSuspectsSignature = "";
          lastExpedienteSignature = "";
          window.SyncEngine.resetAll();
          closeModal();
          switchTab("calendar", { silent: true, force: true });
          openIdentityOverlay(false);
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

    const isStandalone = Boolean(window.navigator.standalone || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches));
    const showPwaTip = !isStandalone && !userPrefs.pwaBannerDismissed;

    container.innerHTML = `
      <div class="glass-card hero-dossier">
        <svg class="hero-star-watermark" width="96" height="96" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.5 5.8 21 7 14 2 9.3 9 8.5"/>
        </svg>
        <div class="hero-thumb-wrap">
          <img src="imagenes/cover-hotel.jpg" alt="Hotel El Mirador del Ventisquero" class="hero-thumb" width="1024" height="572" decoding="async" fetchpriority="high">
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
                ${syncState.finalVerdictSolved ? (window.GIFT_CONFIG?.finalGiftReveal?.enabled ? "Ver Sobre Secreto (Día 24)" : "Ver Cierre del Caso (Día 24)") : `Ir a Puerta ${String(ctaTargetDay).padStart(2, "0")}`}
              </button>
            </div>
          ` : `
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn btn-sm btn-primary" id="hero-open-briefing-btn">Ver Briefing de Apertura</button>
              <button type="button" class="btn btn-sm btn-frost" id="hero-open-rules-btn">Manual de Campo</button>
            </div>
          `}
        </div>
      </div>

      ${showPwaTip ? `
        <div class="glass-card" style="padding:12px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;border-color:rgba(186,230,253,0.28);">
          <div style="font-size:0.78rem;color:var(--vg-text-secondary);flex:1;min-width:210px;">
            <strong style="color:var(--adv-frost);">Consejo de instalación móvil:</strong> Añade la app a tu pantalla de inicio (<em>Compartir → Añadir a pantalla de inicio</em> en Safari o <em>Instalar</em> en Chrome) para modo pantalla completa y evitar que iOS limpie la caché offline.
          </div>
          <button type="button" class="btn btn-sm btn-ghost" id="dismiss-pwa-banner" style="flex-shrink:0;">Entendido</button>
        </div>
      ` : ""}

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
      syncBriefingVideoMute(muted);
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

    document.getElementById("hero-open-briefing-btn")?.addEventListener("click", () => {
      switchTab("expediente", { scrollToTop: false });
      setTimeout(() => {
        document.getElementById("exp-briefing-mount")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    });

    document.getElementById("hero-open-rules-btn")?.addEventListener("click", () => openRulesModal());

    document.getElementById("dismiss-pwa-banner")?.addEventListener("click", () => {
      userPrefs.pwaBannerDismissed = true;
      applyUserPrefs();
      renderCalendarView(true);
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
      discardedCount: dayNum === 24 ? (syncState.discardedIds || []).length : null,
      pinned: syncState.pinnedClues || [],
      muted: window.AudioFX.isMuted()
    });
  }

  function renderDayView(force = false) {
    const container = document.getElementById("view-day");
    if (!container || !currentRole) return;

    const sig = computeDaySignature(selectedDayNum);
    if (!force && sig === lastDaySignature && container.innerHTML.trim() !== "") {
      return;
    }
    const prevDispatchOpen = Boolean(document.getElementById("day-dispatch-details")?.open);
    const prevScratchOpen = Boolean(container.querySelector(".widget-scratchpad")?.open);
    const prevDispatchDraft = document.getElementById("dispatch-input")?.value;
    const prevDayBriefingMount = document.getElementById("day-briefing-mount");
    const preservedDayVideo = selectedDayNum === 1 && prevDayBriefingMount ? prevDayBriefingMount.querySelector("video") : null;
    if (preservedDayVideo && preservedDayVideo.parentNode) {
      preservedDayVideo.parentNode.removeChild(preservedDayVideo);
    }
    const ae = document.activeElement;
    const prevFocusState = ae && container.contains(ae) && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && ae.id
      ? { id: ae.id, start: ae.selectionStart, end: ae.selectionEnd }
      : null;
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
            <div id="day-feedback" aria-live="polite"></div>
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
              <button type="submit" class="btn btn-primary" style="width:100%;">Validar Indicio del Día</button>
            </form>
            <div id="day-feedback" aria-live="polite"></div>
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
        const solvedCount = Object.values(syncState.days || {}).filter((d) => d && d.solved).length;
        if (solvedCount < 24 || remaining.length > 3) {
          finalTrialHtml = `
            <div class="glass-card answer-card" style="border:var(--vg-border-gold);">
              <span class="badge badge-gold">CAREO FINAL BLOQUEADO POR PRERREQUISITO</span>
              <h3 style="margin:10px 0 6px;font-size:1.1rem;">Faltan puertas anteriores por resolver</h3>
              <p class="day-story">Lleváis <strong>${solvedCount}/24 puertas resueltas</strong> y quedan <strong>${remaining.length} sospechosos activos</strong> en vuestro tablero. Completad todas las puertas pendientes antes de celebrar el Careo Final.</p>
              <button type="button" class="btn btn-sm btn-primary" style="margin-top:12px;" data-back-cal-bottom>Ir al Calendario</button>
            </div>`;
        } else {
          const showdownHtml = window.DayArtifacts?.renderFinalShowdown ? window.DayArtifacts.renderFinalShowdown(role, remaining) : "";
          const prop = syncState.finalProposal;
          const effVerdict = {
            suspect: draftsStore.verdict.suspect || prop?.suspectId || "",
            reason: draftsStore.verdict.reason || prop?.reason || "",
            poison: draftsStore.verdict.poison || prop?.poison || "",
            method: draftsStore.verdict.method || prop?.method || ""
          };
          const isPartnerProposal = Boolean(prop && prop.byRole && prop.byRole !== role);
          const isMyProposal = Boolean(prop && prop.byRole === role);
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
              ${isPartnerProposal ? `
                <div class="feedback-banner success" style="margin-bottom:12px;">
                  <strong>${prop.byRole === "miguel" ? "Miguel" : "Patri"}</strong> ha enviado esta propuesta de acusación y pide tu segunda firma para ejecutar el arresto.
                </div>
              ` : isMyProposal ? `
                <div class="feedback-banner info" style="margin-bottom:12px;background:rgba(56,189,248,0.12);border:var(--vg-border-frost);color:#BAE6FD;">
                  Propuesta enviada a <strong>${partnerName}</strong>. Puede revisarla y firmar desde su móvil, o podéis confirmarla aquí si estáis juntos.
                </div>
              ` : ""}
              <form id="final-verdict-form">
                <div class="input-group">
                  <span class="input-label">1. Culpable elegido entre los ${remaining.length} finalistas</span>
                  <div class="radio-cards-grid" role="radiogroup" aria-label="Culpable elegido">
                    ${remaining.map((s) => {
                      const isSel = effVerdict.suspect === s.id;
                      return `
                      <button type="button" role="radio" aria-checked="${isSel ? "true" : "false"}" class="radio-card ${isSel ? "selected" : ""}" data-fv-suspect="${esc(s.id)}">
                        <span class="radio-card-dot"></span>
                        <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="40" height="40" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0;">
                        <div>
                          <div style="font-weight:700;color:#FFFBEB;">${esc(s.name)}</div>
                          <div style="font-size:0.74rem;color:var(--vg-text-secondary);">${esc(s.role)} · ${esc(s.room)}</div>
                        </div>
                      </button>`;
                    }).join("")}
                  </div>
                </div>
                <div class="input-group">
                  <span class="input-label">2. Prueba determinante y razón del descarte</span>
                  <div class="radio-cards-grid" role="radiogroup" aria-label="Justificación forense">
                    ${reasons.map((r) => {
                      const isSel = effVerdict.reason === r.id;
                      return `
                      <button type="button" role="radio" aria-checked="${isSel ? "true" : "false"}" class="radio-card ${isSel ? "selected" : ""}" data-fv-reason="${esc(r.id)}">
                        <span class="radio-card-dot"></span>
                        <span>${esc(r.txt)}</span>
                      </button>`;
                    }).join("")}
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label" for="fv-poison">3. Veneno hallado en la copa</label>
                  <input id="fv-poison" type="text" class="adv-input" value="${esc(effVerdict.poison)}" placeholder="Ej. nombre de la toxina o planta" autocapitalize="characters" autocorrect="off" spellcheck="false" autocomplete="off" required>
                </div>
                <div class="input-group">
                  <label class="input-label" for="fv-method">4. Maniobra ejecutada desde Planta 1 a las 23:38 h</label>
                  <input id="fv-method" type="text" class="adv-input" value="${esc(effVerdict.method)}" placeholder="Ej. palabra clave de la maniobra" autocapitalize="characters" autocorrect="off" spellcheck="false" autocomplete="off" required>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  ${!isPartnerProposal ? `<button type="button" id="fv-propose-btn" class="btn btn-frost" style="flex:1;min-width:170px;">Proponer a ${partnerName}</button>` : ""}
                  <button type="submit" id="fv-submit-btn" class="btn btn-primary" style="flex:1;min-width:190px;">${isPartnerProposal ? "Firmar y Ejecutar Orden" : "Ejecutar Orden de Detención"}</button>
                </div>
              </form>
              <div id="final-feedback" aria-live="polite"></div>
            </div>`;
        }
      } else {
        const ep = syncState.finalEpilogue || {};
        const gift = window.GIFT_CONFIG?.finalGiftReveal;
        const giftCardHtml = gift && gift.enabled === true ? `
          <div class="glass-card gift-reveal-card">
            <span class="badge badge-gold">${getSvg("gift")} ${esc(gift.badge)}</span>
            <h2 class="serif" style="font-size:1.7rem;margin:10px 0 8px;">${esc(gift.title)}</h2>
            ${(gift.message || []).map((p) => `<p class="day-story" style="margin-bottom:8px;">${esc(p)}</p>`).join("")}
            <div class="gift-voucher">
              <div class="mono" style="font-size:0.78rem;color:var(--adv-gold-soft);font-weight:700;margin-bottom:6px;">${esc(gift.voucherTitle)}</div>
              <p style="font-size:0.9rem;line-height:1.55;color:var(--vg-text-primary);">${esc(gift.voucherDescription)}</p>
            </div>
            <p class="serif" style="margin-top:14px;font-size:1.1rem;font-style:italic;color:var(--adv-gold-soft);">${esc(gift.footerNote)}</p>
          </div>` : "";
        const archiveRemaining = (() => {
          const dayDiscards = new Set(Object.values(syncState.days || {}).map((d) => d?.discardId).filter(Boolean));
          return (window.SUSPECTS_DATA || []).filter((s) => !dayDiscards.has(s.id));
        })();
        finalTrialHtml = `
          <div class="glass-card answer-card" style="border:var(--vg-border-pine);">
            <span class="badge badge-pine">${esc(ep.title || "CASO CERRADO")}</span>
            <h3 style="margin:10px 0 8px;font-size:1.2rem;">Culpable arrestado/a: ${esc(ep.culpritName || "")}</h3>
            <p class="day-story">${esc(ep.confession || "")}</p>
            <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
              <button type="button" class="btn btn-sm btn-gold" id="print-closing-btn">Acta Oficial de Cierre</button>
              <button type="button" class="btn btn-sm btn-ghost" id="show-final-archive-btn">Ver evidencias finales</button>
            </div>
          </div>
          <div id="final-archive-box" style="display:none;">
            ${window.DayArtifacts?.renderFinalShowdown ? window.DayArtifacts.renderFinalShowdown(role, archiveRemaining) : ""}
          </div>${giftCardHtml}`;
      }
    }

    const hintsHtml = (dayObj.hints || []).slice(0, hintsCount).map((h, i) => `
      <div class="hint-item">
        <div class="mono" style="font-size:0.68rem;color:var(--adv-gold-soft);margin-bottom:3px;">${esc(hintTiers[i] || `Pista ${i + 1}`)}</div>
        <div>${esc(h)}</div>
      </div>
    `).join("");

    const focusMeta = DAY_SUSPECT_FOCUS[dayObj.day];
    const focusSuspect = focusMeta && (!focusMeta.hideBeforeSolve || isSolved)
      ? (window.SUSPECTS_DATA || []).find((x) => x.id === focusMeta.id)
      : null;
    const culpritIdFocus = syncState.finalEpilogue?.culpritId;
    const focusIsDiscarded = focusSuspect ? (syncState.discardedIds || []).includes(focusSuspect.id) : false;
    const focusIsCulprit = focusSuspect ? Boolean(syncState.finalVerdictSolved && culpritIdFocus && focusSuspect.id === culpritIdFocus) : false;
    const focusStatusBadge = focusSuspect
      ? (focusIsCulprit ? `<span class="badge badge-crimson">CULPABLE</span>`
        : syncState.finalVerdictSolved ? `<span class="badge badge-pine">EXONERADO</span>`
        : focusIsDiscarded ? `<span class="badge badge-pine">DESCARTADO</span>`
        : `<span class="badge badge-gold">BAJO LUPA</span>`)
      : "";

    container.innerHTML = `
      <div class="day-workspace">
        <div class="glass-card day-header-card">
          <div class="day-kicker-row">
            <span class="badge badge-gold">${esc(dayObj.kicker)}</span>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
              ${maxOpen > 1 ? `
                <select id="day-quick-jump" class="adv-select" style="width:auto;min-height:44px;padding:6px 10px;font-size:16px;" aria-label="Saltar a puerta">
                  ${Array.from({ length: maxOpen }, (_, i) => i + 1).map((dNum) => `<option value="${dNum}" ${dNum === selectedDayNum ? "selected" : ""}>Día ${String(dNum).padStart(2, "0")}</option>`).join("")}
                </select>
              ` : ""}
              <button type="button" class="btn btn-sm btn-ghost" data-day-nav="-1" ${selectedDayNum <= 1 ? "disabled" : ""}>Anterior</button>
              <button type="button" class="btn btn-sm btn-ghost" data-day-nav="1" ${!canGoNext ? "disabled" : ""}>Siguiente</button>
            </div>
          </div>
          <h1 class="day-title">${esc(dayObj.title)}</h1>
          <p class="day-story">${esc(dayObj.story)}</p>
          ${dayObj.dossierContext ? `
            <div class="context-brief-box">
              <div class="mono context-brief-head">CONTEXTO DE LA DILIGENCIA · POR QUÉ INVESTIGAMOS ESTO HOY</div>
              <ul class="context-brief-list">
                <li><strong>Motivo de sospecha:</strong> ${esc(dayObj.dossierContext.focus)}</li>
                <li><strong>Coartada en duda:</strong> ${esc(dayObj.dossierContext.alibi)}</li>
                <li><strong>Objetivo de esta prueba:</strong> ${esc(dayObj.dossierContext.goal)}</li>
              </ul>
              ${focusSuspect ? `
                <button type="button" class="day-focus-suspect" data-day-focus-suspect="${esc(focusSuspect.id)}">
                  <img src="${esc(focusSuspect.portrait)}" alt="${esc(focusSuspect.name)}" width="46" height="46" decoding="async">
                  <div style="min-width:0;flex:1;">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap;">
                      <strong style="font-size:0.9rem;color:#FFFBEB;">${esc(focusSuspect.name)}</strong>
                      ${focusStatusBadge}
                    </div>
                    <div style="font-size:0.74rem;color:var(--vg-text-secondary);margin-top:2px;">${esc(focusSuspect.role)} · ${esc(focusSuspect.room)} · Toca para abrir ficha</div>
                  </div>
                </button>
              ` : ""}
            </div>
          ` : ""}
        </div>

        ${dayObj.day === 1 ? `
          <details class="glass-card briefing-collapse" ${!isSolved ? "open" : ""} style="padding:14px;">
            <summary>
              <span class="badge badge-crimson">VÍDEO BRIEFING OFICIAL · DÍA 01</span>
              <span class="mono" style="font-size:0.7rem;color:var(--vg-text-muted);">${isSolved ? "Mostrar / Ocultar vídeo" : "Ocultar vídeo"}</span>
            </summary>
            <div id="day-briefing-mount" class="briefing-native-mount" style="margin-top:10px;">
              ${preservedDayVideo ? "" : renderBriefingVideoHtml("briefing-video-day")}
            </div>
          </details>
        ` : ""}

        <div class="cross-peek-bar">
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-ghost" data-peek-sheet="suspects">Consulta: Sospechosos</button>
            <button type="button" class="btn btn-sm btn-ghost" data-peek-sheet="map">Plano</button>
            <button type="button" class="btn btn-sm btn-ghost" data-peek-sheet="notes">Libreta</button>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            ${isSolved ? `
              <button type="button" class="btn btn-sm btn-ghost pin-clue-btn" data-pin-clue="day-${dayObj.day}" aria-pressed="${(syncState.pinnedClues || []).includes(`day-${dayObj.day}`) ? "true" : "false"}">
                ${(syncState.pinnedClues || []).includes(`day-${dayObj.day}`) ? "Fijada en Careo" : "Fijar en Careo"}
              </button>
            ` : ""}
            <button type="button" class="btn btn-sm btn-ghost" id="day-mute-btn">${window.AudioFX.isMuted() ? "Audio OFF" : "Audio ON"}</button>
          </div>
        </div>

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

          <details class="widget-scratchpad" ${(prevScratchOpen || draftsStore.scratch?.[String(dayObj.day)]) ? "open" : ""}>
            <summary>Bloc de cálculo local · Día ${String(dayObj.day).padStart(2, "0")} (solo este móvil)</summary>
            <textarea id="widget-scratch-area" class="adv-textarea" style="min-height:78px;margin-top:8px;font-size:16px;" placeholder="Anota aquí pistas dictadas, cuentas o descartes rápidos para no necesitar papel...">${esc(draftsStore.scratch?.[String(dayObj.day)] || "")}</textarea>
          </details>

          <details id="day-dispatch-details" ${prevDispatchOpen ? "open" : ""} style="margin-top:12px;border-top:1px dashed rgba(255,255,255,0.12);padding-top:10px;">
            <summary class="mono" style="font-size:0.74rem;color:var(--adv-frost);cursor:pointer;">Parte de Enlace Asimétrico con ${partnerName}</summary>
            <div style="margin-top:8px;">
              ${partnerDispatch?.text ? `<div class="clue-box" style="margin-bottom:8px;font-size:0.8rem;"><strong>Dato enviado por ${partnerName}:</strong> ${esc(partnerDispatch.text)}</div>` : `<div class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);margin-bottom:8px;">${partnerName} aún no ha remitido ningún dato en esta puerta.</div>`}
              <form id="dispatch-form" style="display:flex;gap:8px;">
                <input type="text" id="dispatch-input" class="adv-input" aria-label="Dato para enviar a ${partnerName}" value="${esc(prevFocusState?.id === "dispatch-input" && prevDispatchDraft !== undefined ? prevDispatchDraft : (myDispatch?.text || ""))}" placeholder="Enviar dato breve a ${partnerName}..." style="min-height:44px;min-width:0;">
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

        <nav class="day-footer-nav" aria-label="Navegación entre puertas">
          <button type="button" class="btn btn-sm btn-ghost" data-day-nav="-1" ${selectedDayNum <= 1 ? "disabled" : ""}>Puerta anterior</button>
          <button type="button" class="btn btn-sm btn-ghost" data-back-cal-bottom>Calendario</button>
          <button type="button" class="btn btn-sm btn-primary" data-day-nav="1" ${!canGoNext ? "disabled" : ""}>Siguiente puerta</button>
        </nav>
      </div>
    `;

    if (preservedDayVideo) {
      document.getElementById("day-briefing-mount")?.appendChild(preservedDayVideo);
    }
    wireBriefingVideoControls(document.getElementById("day-briefing-mount"));

    document.getElementById("day-mute-btn")?.addEventListener("click", (e) => {
      const muted = window.AudioFX.toggleMute();
      e.currentTarget.textContent = muted ? "Audio OFF" : "Audio ON";
      syncBriefingVideoMute(muted);
      const mNote = document.getElementById(`morse-mute-note-${dayObj.day}`);
      if (mNote) mNote.style.display = muted ? "block" : "none";
    });

    container.querySelectorAll("[data-peek-sheet]").forEach((btn) => {
      btn.addEventListener("click", () => openCrossPeekModal(btn.dataset.peekSheet, btn));
    });

    container.querySelectorAll("[data-pin-clue]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AudioFX.click();
        const pinned = window.SyncEngine.togglePinnedClue(btn.dataset.pinClue);
        const on = pinned.includes(btn.dataset.pinClue);
        showToast(on ? "Conclusión fijada para el Careo Final." : "Chincheta retirada.");
      });
    });

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

    container.querySelectorAll("[data-day-focus-suspect]").forEach((btn) => {
      btn.addEventListener("click", () => openSuspectModal(btn.dataset.dayFocusSuspect, btn));
    });

    document.getElementById("widget-scratch-area")?.addEventListener("input", (e) => {
      if (!draftsStore.scratch) draftsStore.scratch = {};
      const val = e.target.value;
      if (val) draftsStore.scratch[String(dayObj.day)] = val;
      else delete draftsStore.scratch[String(dayObj.day)];
      saveDrafts();
    });

    container.querySelectorAll("[data-zoom-artifact]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const env = btn.closest(".artifact-envelope");
        const body = env?.querySelector(".artifact-body");
        if (!body) return;
        let artScale = 1;
        showModal(`
          <span class="badge badge-gold">INSPECCIÓN AMPLIADA DE INDICIO</span>
          <h3 id="adv-modal-title" class="serif" style="font-size:1.35rem;margin:8px 0 12px;">Día ${String(dayObj.day).padStart(2, "0")} · Evidencia</h3>
          <div style="overflow:auto;max-height:62dvh;">
            <div id="artifact-zoom-wrap" style="transform-origin:top left;transition:transform 160ms ease;">${body.innerHTML}</div>
          </div>
          <div style="display:flex;gap:8px;margin-top:14px;">
            <button type="button" class="btn btn-sm btn-frost" style="flex:1;" id="art-zoom-btn">Ampliar 1.5x</button>
            <button type="button" class="btn btn-sm btn-ghost" style="flex:1;" id="close-modal-btn">Cerrar visor</button>
          </div>
        `, btn);
        const wrap = document.getElementById("artifact-zoom-wrap");
        const zBtn = document.getElementById("art-zoom-btn");
        zBtn?.addEventListener("click", () => {
          artScale = artScale === 1 ? 1.5 : 1;
          if (wrap) {
            wrap.style.transform = artScale === 1 ? "" : `scale(${artScale})`;
            wrap.style.width = artScale === 1 ? "" : `${Math.round(100 / artScale * 100)}%`;
          }
          zBtn.textContent = artScale === 1 ? "Ampliar 1.5x" : "Restablecer 1x";
        });
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
        if (window.history?.pushState) window.history.pushState({ tab: "day", day: selectedDayNum }, "");
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
        if (typeof window.AudioFX.sealBreak === "function") window.AudioFX.sealBreak();
        else window.AudioFX.success();
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
        container.querySelectorAll("[data-fv-suspect]").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("selected", on);
          b.setAttribute("aria-checked", on ? "true" : "false");
        });
      });
    });

    container.querySelectorAll("[data-fv-reason]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AudioFX.click();
        draftsStore.verdict.reason = btn.dataset.fvReason;
        saveDrafts();
        container.querySelectorAll("[data-fv-reason]").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("selected", on);
          b.setAttribute("aria-checked", on ? "true" : "false");
        });
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
          if (isSubmitting) return;
          isSubmitting = true;
          const submitBtn = document.getElementById("fv-submit-btn");
          const propBtn = document.getElementById("fv-propose-btn");
          if (submitBtn) submitBtn.disabled = true;
          if (propBtn) propBtn.disabled = true;
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
            if (submitBtn && submitBtn.isConnected) submitBtn.disabled = false;
            if (propBtn && propBtn.isConnected) propBtn.disabled = false;
          }
        }
      );
    });

    document.getElementById("fv-propose-btn")?.addEventListener("click", () => {
      if (isSubmitting) return;
      const sVal = draftsStore.verdict.suspect || syncState.finalProposal?.suspectId || "";
      const rVal = draftsStore.verdict.reason || syncState.finalProposal?.reason || "";
      const pVal = document.getElementById("fv-poison")?.value?.trim() || "";
      const mVal = document.getElementById("fv-method")?.value?.trim() || "";
      const fb = document.getElementById("final-feedback");
      if (!sVal || !rVal || !pVal || !mVal) {
        window.AudioFX.error();
        if (fb) fb.innerHTML = `<div class="feedback-banner error">Completa los 4 campos de la acusación antes de enviársela a ${partnerName}.</div>`;
        return;
      }
      window.AudioFX.click();
      window.SyncEngine.setFinalProposal({
        byRole: role,
        suspectId: sVal,
        reason: rVal,
        poison: pVal,
        method: mVal,
        proposedAt: Date.now()
      });
      showToast(`Propuesta enviada a ${partnerName} para su segunda firma.`);
    });

    document.getElementById("print-closing-btn")?.addEventListener("click", () => {
      window.print();
    });

    document.getElementById("show-final-archive-btn")?.addEventListener("click", () => {
      const box = document.getElementById("final-archive-box");
      if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    });

    if (prevFocusState) {
      const el = document.getElementById(prevFocusState.id);
      if (el) {
        try {
          el.focus({ preventScroll: true });
          if (typeof prevFocusState.start === "number" && typeof el.setSelectionRange === "function") {
            el.setSelectionRange(prevFocusState.start, prevFocusState.end ?? prevFocusState.start);
          }
        } catch (_) {}
      }
    }
  }

  function getRoomFloor(roomStr) {
    const r = String(roomStr || "").toLowerCase();
    if (/(301|302|303|304|305)/.test(r)) return "Planta 3";
    if (/(201|202|203|204|205|206|207|208)/.test(r)) return "Planta 2";
    if (/(101|102|105|106|107|108)/.test(r)) return "Planta 1";
    return "Sótano / Anexo";
  }

  function openCrossPeekModal(kind, triggerEl) {
    if (kind === "map") {
      const lore = window.CASE_LORE;
      showModal(`
        <span class="badge badge-frost">CONSULTA RÁPIDA · PLANO DEL HOTEL</span>
        <h3 id="adv-modal-title" class="serif" style="font-size:1.45rem;margin:8px 0 10px;">Distribución por Plantas</h3>
        <ul class="clue-list">
          ${(lore.hotelZones || []).map((z) => `<li><strong>${esc(z.floor)} · ${esc(z.zone)}:</strong> ${esc(z.note)}</li>`).join("")}
        </ul>
        <button type="button" class="btn btn-primary" style="width:100%;margin-top:14px;" id="close-modal-btn">Volver al enigma</button>
      `, triggerEl);
      document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
      return;
    }
    if (kind === "notes") {
      const curText = syncState.sharedNotes || "";
      showModal(`
        <span class="badge badge-gold">CONSULTA RÁPIDA · LIBRETA COMPARTIDA</span>
        <h3 id="adv-modal-title" class="serif" style="font-size:1.45rem;margin:8px 0 10px;">Anotaciones de Miguel y Patri</h3>
        <textarea id="peek-notes-area" class="adv-textarea" style="min-height:150px;" placeholder="Anota aquí sin perder tu progreso del día...">${esc(curText)}</textarea>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button type="button" class="btn btn-ghost" style="flex:1;" id="close-modal-btn">Cerrar</button>
          <button type="button" class="btn btn-primary" style="flex:1;" id="peek-save-notes-btn">Guardar libreta</button>
        </div>
      `, triggerEl);
      document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
      document.getElementById("peek-save-notes-btn")?.addEventListener("click", () => {
        const val = document.getElementById("peek-notes-area")?.value || "";
        if (currentRole) window.SyncEngine.saveNotes(val, currentRole);
        closeModal();
        showToast("Libreta compartida guardada.");
      });
      return;
    }
    const discarded = syncState.discardedIds || [];
    const solvedDays = Object.keys(syncState.days || {}).filter((k) => syncState.days[k]?.solved).map(Number);
    const limit = Math.max(window.DateGate.getMaxOpenDay(), ...(solvedDays.length ? solvedDays : [0]), 0);
    const activeList = (window.SUSPECTS_DATA || []).filter((s) => (s.discoveredDay || 1) <= limit && !discarded.includes(s.id));
    showModal(`
      <span class="badge badge-gold">CONSULTA RÁPIDA · SOSPECHOSOS ACTIVOS (${activeList.length})</span>
      <h3 id="adv-modal-title" class="serif" style="font-size:1.45rem;margin:8px 0 10px;">Pendientes de descartar</h3>
      <div style="display:grid;gap:8px;max-height:55dvh;overflow-y:auto;">
        ${activeList.length ? activeList.map((s) => `
          <button type="button" class="suspect-card" style="padding:10px;text-align:left;" data-peek-suspect="${esc(s.id)}">
            <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="44" height="44" style="width:44px;height:44px;border-radius:10px;object-fit:cover;">
            <div style="min-width:0;flex:1;">
              <div style="font-weight:700;font-size:0.86rem;color:#FFFBEB;">#${esc(s.num)} · ${esc(s.name)}</div>
              <div style="font-size:0.74rem;color:var(--vg-text-secondary);">${esc(s.role)} · ${esc(s.room)}</div>
            </div>
          </button>
        `).join("") : `<p class="day-story">Sin sospechosos activos descubiertos todavía.</p>`}
      </div>
      <button type="button" class="btn btn-primary" style="width:100%;margin-top:12px;" id="close-modal-btn">Volver al enigma</button>
    `, triggerEl);
    document.querySelectorAll("[data-peek-suspect]").forEach((b) => {
      b.addEventListener("click", () => openSuspectModal(b.dataset.peekSuspect, triggerEl));
    });
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
  }

  function applySuspectFilterOnly() {
    const container = document.getElementById("view-suspects");
    if (!container) return;
    container.querySelectorAll("[data-filter]").forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === suspectFilter));
    container.querySelectorAll("[data-group-filter]").forEach((btn) => btn.classList.toggle("active", btn.dataset.groupFilter === suspectGroupFilter));
    container.querySelectorAll("[data-floor-filter]").forEach((btn) => btn.classList.toggle("active", btn.dataset.floorFilter === suspectFloorFilter));
    const notesChip = document.getElementById("suspect-notes-filter-chip");
    if (notesChip) {
      notesChip.classList.toggle("active", suspectWithNotesOnly);
      notesChip.setAttribute("aria-pressed", suspectWithNotesOnly ? "true" : "false");
    }

    const clearBtn = document.getElementById("suspect-search-clear");
    if (clearBtn) clearBtn.style.display = suspectSearch.trim() ? "inline-flex" : "none";

    const q = suspectSearch.trim().toLowerCase();
    let visibleCount = 0;
    container.querySelectorAll("[data-suspect-id]").forEach((card) => {
      const isOut = card.dataset.discarded === "1";
      const grp = card.dataset.group || "";
      const flr = card.dataset.floor || "";
      const hasNote = card.dataset.hasNote === "1";
      const hay = (card.dataset.search || "").toLowerCase();
      const hideStatus = (suspectFilter === "pending" && isOut) || (suspectFilter === "discarded" && !isOut);
      const hideGroup = suspectGroupFilter !== "all" && grp !== suspectGroupFilter;
      const hideFloor = suspectFloorFilter !== "all" && flr !== suspectFloorFilter;
      const hideNotes = suspectWithNotesOnly && !hasNote;
      const hideQuery = q && !hay.includes(q);
      const hidden = Boolean(hideStatus || hideGroup || hideFloor || hideNotes || hideQuery);
      card.classList.toggle("is-hidden-by-filter", hidden);
      if (!hidden) visibleCount += 1;
    });
    const emptyEl = document.getElementById("suspects-empty-state");
    if (emptyEl) emptyEl.style.display = visibleCount === 0 ? "block" : "none";
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
      sNotes: syncState.suspectNotes,
      compareIds,
      pinned: syncState.pinnedClues || []
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
    noteTimer = null;

    const preservedNotes = existingTa ? existingTa.value : (syncState.sharedNotes || "");
    const wasFocused = Boolean(existingTa && document.activeElement === existingTa);
    const taSel = wasFocused ? { start: existingTa.selectionStart, end: existingTa.selectionEnd } : null;

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
          <button type="button" id="jump-to-notes-btn" class="btn btn-sm btn-ghost">Ir a Libreta</button>
        </div>
      </div>

      ${discovered.length > 0 ? `
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <input type="search" id="suspect-search-input" class="adv-input" aria-label="Buscar sospechosos por nombre, rol o habitación" value="${esc(suspectSearch)}" placeholder="Buscar nombre, rol o hab..." style="min-height:44px;flex:1;min-width:0;">
          <button type="button" id="suspect-search-clear" class="btn btn-sm btn-ghost" aria-label="Limpiar búsqueda" style="display:${suspectSearch.trim() ? "inline-flex" : "none"};flex-shrink:0;">Limpiar</button>
        </div>
        <div class="suspect-filters" role="group" aria-label="Filtrar por estado">
          <button type="button" class="filter-chip ${suspectFilter === "all" ? "active" : ""}" data-filter="all">Todos (${discovered.length})</button>
          <button type="button" class="filter-chip ${suspectFilter === "pending" ? "active" : ""}" data-filter="pending">Sospechosos (${activeInView})</button>
          <button type="button" class="filter-chip ${suspectFilter === "discarded" ? "active" : ""}" data-filter="discarded">Descartados (${discardedInView})</button>
          <button type="button" class="filter-chip ${suspectFiltersExtraOpen ? "active" : ""}" id="toggle-extra-filters-btn" aria-expanded="${suspectFiltersExtraOpen ? "true" : "false"}">Más filtros</button>
        </div>
        <div id="suspect-extra-filters" style="display:${suspectFiltersExtraOpen ? "block" : "none"};margin-bottom:8px;">
          <div class="suspect-filters" role="group" aria-label="Filtrar por grupo y notas" style="margin-top:0;">
            <button type="button" class="filter-chip ${suspectGroupFilter === "all" ? "active" : ""}" data-group-filter="all">Huéspedes y Personal</button>
            <button type="button" class="filter-chip ${suspectGroupFilter === "Huésped" ? "active" : ""}" data-group-filter="Huésped">Huéspedes</button>
            <button type="button" class="filter-chip ${suspectGroupFilter === "Personal" ? "active" : ""}" data-group-filter="Personal">Personal</button>
            <button type="button" class="filter-chip ${suspectWithNotesOnly ? "active" : ""}" id="suspect-notes-filter-chip" aria-pressed="${suspectWithNotesOnly ? "true" : "false"}">Con notas</button>
          </div>
          <div class="suspect-filters" role="group" aria-label="Filtrar por planta" style="margin-top:-4px;">
            ${["all", "Planta 3", "Planta 2", "Planta 1", "Sótano / Anexo"].map((fl) => `
              <button type="button" class="filter-chip ${suspectFloorFilter === fl ? "active" : ""}" data-floor-filter="${fl}">${fl === "all" ? "Todas las plantas" : fl}</button>
            `).join("")}
          </div>
        </div>
        ${compareIds.length > 0 ? `
          <div class="glass-card" style="padding:12px;margin-bottom:12px;border:var(--vg-border-frost);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
              <span class="badge badge-frost">COMPARADOR LADO A LADO (${compareIds.length}/3)</span>
              <button type="button" class="btn btn-sm btn-ghost" id="clear-compare-btn">Limpiar comparación</button>
            </div>
            <div class="compare-strip">
              ${compareIds.map((cid) => {
                const cs = discovered.find((x) => x.id === cid) || (window.SUSPECTS_DATA || []).find((x) => x.id === cid);
                if (!cs) return "";
                const sn = syncState.suspectNotes?.[cs.id] || {};
                const mNote = sn.miguel?.note ? `M (${sn.miguel.stance}): ${sn.miguel.note}` : "Sin apunte de Miguel";
                const pNote = sn.patri?.note ? `P (${sn.patri.stance}): ${sn.patri.note}` : "Sin apunte de Patri";
                return `
                  <div class="compare-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
                      <strong style="font-size:0.86rem;color:#FFFBEB;">#${esc(cs.num)} ${esc(cs.name)}</strong>
                      <button type="button" class="btn btn-sm btn-ghost" style="min-height:30px;padding:2px 8px;" data-remove-compare="${esc(cs.id)}" aria-label="Quitar ${esc(cs.name)}">×</button>
                    </div>
                    <div class="mono" style="font-size:0.68rem;color:var(--adv-gold-soft);margin-bottom:4px;">${esc(cs.role)} · ${esc(cs.room)}</div>
                    <div style="font-size:0.75rem;color:var(--vg-text-secondary);margin-bottom:4px;"><strong>Motivo:</strong> ${esc(cs.motiveHint)}</div>
                    <div style="font-size:0.75rem;color:var(--vg-text-secondary);margin-bottom:6px;"><strong>Coartada:</strong> ${esc(cs.alibiClaim)}</div>
                    <div class="mono" style="font-size:0.68rem;color:#BAE6FD;border-top:1px dashed rgba(255,255,255,0.12);padding-top:4px;">${esc(mNote)}<br>${esc(pNote)}</div>
                  </div>`;
              }).join("")}
            </div>
          </div>
        ` : ""}
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
            const sNotesObj = syncState.suspectNotes?.[s.id] || {};
            const hasAnyNote = Boolean((sNotesObj.miguel?.note || "").trim() || (sNotesObj.patri?.note || "").trim());
            const statusPill = isCulprit
              ? `<span class="badge badge-gold" style="padding:2px 7px;font-size:0.65rem;">CULPABLE</span>`
              : (isOut || isExonerated)
                ? `<span class="badge badge-crimson" style="padding:2px 7px;font-size:0.65rem;">${isExonerated && !isOut ? "EXONERADO" : "DESCARTADO"}</span>`
                : `<span class="badge badge-frost" style="padding:2px 7px;font-size:0.65rem;">SOSPECHOSO</span>`;
            return `
              <button type="button" class="suspect-card ${(isOut || isExonerated) ? "is-discarded" : ""} ${isCulprit ? "is-culprit-final" : ""}" data-suspect-id="${esc(s.id)}" data-discarded="${(isOut || isExonerated) ? "1" : "0"}" data-group="${esc(s.group)}" data-floor="${esc(floor)}" data-has-note="${hasAnyNote ? "1" : "0"}" data-search="${esc(`${s.name} ${s.role} ${s.room}`)}">
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
        <div id="suspects-empty-state" class="glass-card" style="display:none;padding:20px;text-align:center;margin-top:8px;">
          <p class="day-story" style="margin-bottom:10px;">Ningún sospechoso coincide con los filtros o la búsqueda actual.</p>
          <button type="button" id="suspects-reset-filters-btn" class="btn btn-sm btn-frost">Mostrar todos</button>
        </div>
      `}

      <div id="notes-card-anchor" class="glass-card" style="padding:18px;margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;flex-wrap:wrap;">
          <strong>Libreta Compartida (Miguel y Patri)</strong>
          <span class="mono" style="font-size:0.7rem;color:var(--vg-text-muted);" id="notes-status">${syncMode === "firebase" ? "Sincronizada en nube" : "Guardado local"}</span>
        </div>
        <div id="notes-remote-conflict" style="display:none;margin-bottom:8px;padding:8px 10px;border-radius:8px;background:rgba(251,191,36,0.14);border:var(--vg-border-gold);justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:0.78rem;">
          <span>Tu pareja acaba de actualizar la libreta.</span>
          <button type="button" class="btn btn-sm btn-gold" id="notes-merge-btn">Fusionar cambios</button>
        </div>
        <label class="sr-only" for="shared-notes-area">Libreta compartida de Miguel y Patri</label>
        <textarea id="shared-notes-area" class="adv-textarea" placeholder="Anotad aquí sospechas, teorías o pistas compartidas...">${esc(preservedNotes)}</textarea>
      </div>
    `;

    applySuspectFilterOnly();
    updateSyncBadgesOnly();

    document.getElementById("jump-to-notes-btn")?.addEventListener("click", () => {
      document.getElementById("notes-card-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("suspect-search-input")?.addEventListener("input", (e) => {
      suspectSearch = e.target.value;
      applySuspectFilterOnly();
    });
    document.getElementById("suspect-search-clear")?.addEventListener("click", () => {
      suspectSearch = "";
      const inp = document.getElementById("suspect-search-input");
      if (inp) inp.value = "";
      applySuspectFilterOnly();
    });
    document.getElementById("suspects-reset-filters-btn")?.addEventListener("click", () => {
      suspectFilter = "all";
      suspectGroupFilter = "all";
      suspectFloorFilter = "all";
      suspectWithNotesOnly = false;
      suspectSearch = "";
      const inp = document.getElementById("suspect-search-input");
      if (inp) inp.value = "";
      applySuspectFilterOnly();
    });
    document.getElementById("toggle-extra-filters-btn")?.addEventListener("click", (e) => {
      suspectFiltersExtraOpen = !suspectFiltersExtraOpen;
      const box = document.getElementById("suspect-extra-filters");
      if (box) box.style.display = suspectFiltersExtraOpen ? "block" : "none";
      e.currentTarget.classList.toggle("active", suspectFiltersExtraOpen);
      e.currentTarget.setAttribute("aria-expanded", suspectFiltersExtraOpen ? "true" : "false");
    });
    document.getElementById("suspect-notes-filter-chip")?.addEventListener("click", () => {
      suspectWithNotesOnly = !suspectWithNotesOnly;
      applySuspectFilterOnly();
    });
    document.getElementById("clear-compare-btn")?.addEventListener("click", () => {
      compareIds = [];
      renderSuspectsView(true);
    });
    container.querySelectorAll("[data-remove-compare]").forEach((b) => {
      b.addEventListener("click", () => {
        compareIds = compareIds.filter((id) => id !== b.dataset.removeCompare);
        renderSuspectsView(true);
      });
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
    const statusLbl = document.getElementById("notes-status");
    let prevNotesBeforeEdit = ta ? ta.value : "";
    if (wasFocused && ta) {
      try {
        ta.focus({ preventScroll: true });
        if (taSel && typeof ta.setSelectionRange === "function") {
          ta.setSelectionRange(taSel.start, taSel.end ?? taSel.start);
        }
      } catch (_) {}
    }
    ta?.addEventListener("input", () => {
      if (statusLbl) statusLbl.textContent = "Guardando...";
      const snapshotBeforeWipe = prevNotesBeforeEdit;
      prevNotesBeforeEdit = ta.value;
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => {
        noteTimer = null;
        window.SyncEngine.saveNotes(ta.value, currentRole);
        const nowStr = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
        if (statusLbl) statusLbl.textContent = `${syncMode === "firebase" ? "Guardado en nube" : "Guardado local"} · ${nowStr}`;
        if (snapshotBeforeWipe.trim().length >= 20 && ta.value.trim().length === 0) {
          notesUndoSnapshot = snapshotBeforeWipe;
          showToast("Libreta vaciada.", "Deshacer", () => {
            if (!notesUndoSnapshot) return;
            ta.value = notesUndoSnapshot;
            prevNotesBeforeEdit = notesUndoSnapshot;
            window.SyncEngine.saveNotes(notesUndoSnapshot, currentRole);
            notesUndoSnapshot = null;
          });
        }
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

  function renderExpedienteView(force = false) {
    const container = document.getElementById("view-expediente");
    if (!container || !currentRole) return;

    const expSig = JSON.stringify({
      role: currentRole,
      maxOpen: window.DateGate.getMaxOpenDay(),
      days: syncState.days,
      hints: syncState.hintsUnlocked,
      dispatch: syncState.fieldDispatch,
      sNotes: syncState.suspectNotes,
      pinned: syncState.pinnedClues,
      floor: expedienteFloor,
      timelineFloor: timelineFloorFilter,
      offlinePackStatus,
      fv: syncState.finalVerdictSolved,
      prefs: userPrefs
    });
    if (!force && expSig === lastExpedienteSignature && container.innerHTML.trim() !== "") {
      return;
    }
    lastExpedienteSignature = expSig;

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

    // Preservar video nativo si ya estaba montado
    const existingMount = document.getElementById("exp-briefing-mount");
    const preservedExpVideo = existingMount ? existingMount.querySelector("video") : null;
    if (preservedExpVideo && preservedExpVideo.parentNode) {
      preservedExpVideo.parentNode.removeChild(preservedExpVideo);
    }

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
          <h3 style="font-size:1rem;margin-bottom:8px;">Buscador Global y Chinchetas para el Careo</h3>
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <input type="search" id="exp-search-input" class="adv-input" value="${esc(expSearchQuery)}" placeholder="Buscar en resoluciones, partes y notas..." aria-label="Buscar en pistas y notas" style="min-height:44px;flex:1;min-width:0;">
            <button type="button" id="exp-search-clear" class="btn btn-sm btn-ghost" style="display:${expSearchQuery.trim() ? "inline-flex" : "none"};">Limpiar</button>
          </div>
          <div id="search-results-list" class="search-results-list"></div>
          ${(syncState.pinnedClues || []).length ? `
            <div style="margin-top:10px;border-top:1px dashed rgba(255,255,255,0.12);padding-top:8px;">
              <div class="mono" style="font-size:0.7rem;color:var(--adv-gold-soft);margin-bottom:6px;">PISTAS FIJADAS CON CHINCHETA (${syncState.pinnedClues.length}):</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${syncState.pinnedClues.map((pid) => {
                  if (pid.startsWith("day-")) {
                    const dNum = Number(pid.replace("day-", ""));
                    return `<button type="button" class="btn btn-sm btn-gold" data-jump-pinned-day="${dNum}">Día ${String(dNum).padStart(2, "0")}</button>`;
                  }
                  if (pid.startsWith("suspect-")) {
                    const sid = pid.replace("suspect-", "");
                    const sp = (window.SUSPECTS_DATA || []).find((x) => x.id === sid);
                    return `<button type="button" class="btn btn-sm btn-frost" data-jump-pinned-suspect="${esc(sid)}">#${esc(sp?.num || "?")} ${esc(sp?.name || sid)}</button>`;
                  }
                  return "";
                }).join("")}
              </div>
            </div>
          ` : `<div class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);margin-top:6px;">Aún no hay pistas fijadas con chincheta. Fija días resueltos o fichas desde su vista.</div>`}
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:10px;">Cronología Forense · Noche del 30 de Noviembre</h3>
          <div class="suspect-filters" role="group" aria-label="Filtrar cronología por planta" style="margin-bottom:8px;">
            ${["all", "Planta 1", "Planta 2", "Planta 3", "Sótano / Anexo"].map((tf) => `
              <button type="button" class="filter-chip ${timelineFloorFilter === tf ? "active" : ""}" data-timeline-floor="${tf}">${tf === "all" ? "Todas" : tf}</button>
            `).join("")}
          </div>
          <div class="timeline-list">
            ${[
              { time: "19:00 h", floor: "Sótano / Anexo", text: "Ventisca crítica: carretera cortada y teleférico bloqueado en cota 1.940 m." },
              { time: "23:32–23:36 h", floor: "Planta 1", text: "Manipulación previa en pasillo técnico de Planta 1 antes del brindis del Salón Mirador." },
              { time: "23:38–23:42 h", floor: "Planta 1", text: "Apagón eléctrico exacto de 4 minutos durante el brindis en el Salón Mirador." },
              { time: "23:55 h", floor: "Planta 1", text: "Hallazgo sin vida de Arturo Valdivieso junto al abeto navideño." },
              ...solvedDaysArr.map((d) => {
                const susp = d.discardId ? (window.SUSPECTS_DATA || []).find((s) => s.id === d.discardId) : null;
                const flr = susp ? getRoomFloor(susp.room) : "Planta 1";
                return { time: `Día ${String(d.day).padStart(2, "0")}`, floor: flr, text: `${d.forensicTag || "Diligencia"}: ${d.conclusion}` };
              })
            ].filter((ev) => timelineFloorFilter === "all" || ev.floor === timelineFloorFilter)
             .map((ev) => `<div class="timeline-node"><strong>${esc(ev.time)}</strong> <span class="mono" style="font-size:0.68rem;color:var(--adv-gold-soft);">[${esc(ev.floor)}]</span> — ${esc(ev.text)}</div>`)
             .join("")}
          </div>
          ${openInquiries.length ? `
            <div class="feedback-banner success" style="margin-top:10px;border-color:rgba(251,191,36,0.45);background:rgba(251,191,36,0.10);color:#FEF3C7;">
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
            <a href="imprimibles/PRESENTACION_ADVIENTO_CERO.pdf" target="_blank" rel="noopener noreferrer" download="PRESENTACION_ADVIENTO_CERO.pdf" class="btn btn-sm btn-gold">Dossier PDF (0,4 MB)</a>
          </div>
          <div id="exp-briefing-mount" class="briefing-native-mount">
            ${preservedExpVideo ? "" : renderBriefingVideoHtml("briefing-video-exp")}
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
            ${lore.hotelZones.filter((z) => z.floor === expedienteFloor).map((z) => `<li><strong>${esc(z.floor)} · ${esc(z.zone)}:</strong> ${esc(z.note)}</li>`).join("")}
          </ul>
          ${floorSuspects.length ? `
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${floorSuspects.map((s) => `<button type="button" class="btn btn-sm btn-ghost" data-exp-suspect="${esc(s.id)}">${esc(s.room)} · ${esc(s.name)}</button>`).join("")}
            </div>
          ` : `<div class="mono" style="font-size:0.74rem;color:var(--vg-text-muted);">Sin sospechosos descubiertos en esta planta todavía.</div>`}
        </div>

        <div class="glass-card" style="padding:18px;">
          <h3 style="font-size:1rem;margin-bottom:10px;">Confort Visual, Offline y Copia de Seguridad</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <button type="button" class="btn btn-sm ${userPrefs.fontBoost ? "btn-gold" : "btn-ghost"}" id="pref-font-btn">Texto +15%: ${userPrefs.fontBoost ? "ON" : "OFF"}</button>
            <button type="button" class="btn btn-sm ${userPrefs.nightSoft ? "btn-gold" : "btn-ghost"}" id="pref-night-btn">Lectura Nocturna: ${userPrefs.nightSoft ? "ON" : "OFF"}</button>
            <button type="button" class="btn btn-sm ${userPrefs.reducedMotion ? "btn-gold" : "btn-ghost"}" id="pref-motion-btn">Animación reducida: ${userPrefs.reducedMotion ? "ON" : "OFF"}</button>
            <button type="button" class="btn btn-sm ${userPrefs.highContrastOutdoor ? "btn-gold" : "btn-ghost"}" id="pref-outdoor-btn">Contraste Solar: ${userPrefs.highContrastOutdoor ? "ON" : "OFF"}</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
            <button type="button" class="btn btn-sm btn-frost" id="export-diary-btn">Exportar Diario (.md)</button>
            <button type="button" class="btn btn-sm btn-ghost" id="export-json-btn">Backup JSON</button>
            <button type="button" class="btn btn-sm btn-ghost" id="import-json-btn">Restaurar Backup (.json)</button>
            <input type="file" id="import-json-file" accept="application/json,.json" style="display:none;">
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <button type="button" class="btn btn-sm btn-ghost" id="verify-offline-btn">Verificar paquete offline</button>
            <button type="button" class="btn btn-sm btn-ghost" id="copy-spoilerfree-btn">Copiar resumen sin spoilers</button>
          </div>
          ${offlinePackStatus ? `<div class="mono" style="font-size:0.72rem;color:var(--adv-pine);margin-top:8px;">${esc(offlinePackStatus)}</div>` : ""}
        </div>

        <div style="text-align:center;padding:10px 0;">
          <button type="button" id="version-secret-trigger" class="mono" style="min-height:44px;padding:8px 12px;background:none;border:none;color:var(--vg-text-muted);font-size:0.74rem;cursor:pointer;">
            ${APP_VERSION} · ADVIENTO CERO · MODO CERO SPOILERS
          </button>
        </div>
      </div>
    `;

    if (preservedExpVideo) {
      document.getElementById("exp-briefing-mount")?.appendChild(preservedExpVideo);
    }
    wireBriefingVideoControls(document.getElementById("exp-briefing-mount"));

    const renderExpSearchResults = () => {
      const box = document.getElementById("search-results-list");
      const clr = document.getElementById("exp-search-clear");
      if (clr) clr.style.display = expSearchQuery.trim() ? "inline-flex" : "none";
      if (!box) return;
      const q = expSearchQuery.trim().toLowerCase();
      if (!q) {
        box.innerHTML = "";
        return;
      }
      const hits = [];
      solvedDaysArr.forEach((d) => {
        const txt = `Puerta ${String(d.day).padStart(2, "0")} [${d.forensicTag || ""}]: ${d.conclusion || ""}`;
        if (txt.toLowerCase().includes(q)) hits.push({ label: `Día ${String(d.day).padStart(2, "0")}`, text: txt, day: d.day });
      });
      Object.entries(syncState.fieldDispatch || {}).forEach(([dKey, entry]) => {
        ["miguel", "patri"].forEach((rk) => {
          const msg = entry?.[rk]?.text;
          if (msg && msg.toLowerCase().includes(q)) {
            hits.push({ label: `Parte Día ${String(dKey).padStart(2, "0")} (${rk === "miguel" ? "Miguel" : "Patri"})`, text: msg, day: Number(dKey) });
          }
        });
      });
      Object.entries(syncState.suspectNotes || {}).forEach(([sid, entry]) => {
        const sp = (window.SUSPECTS_DATA || []).find((x) => x.id === sid);
        ["miguel", "patri"].forEach((rk) => {
          const n = entry?.[rk]?.note;
          if (n && n.toLowerCase().includes(q)) {
            hits.push({ label: `Ficha ${sp ? sp.name : sid} (${rk})`, text: n, sid });
          }
        });
      });
      box.innerHTML = hits.length
        ? hits.slice(0, 12).map((h) => `<div class="search-result-card"><strong>${esc(h.label)}:</strong> ${esc(h.text)}</div>`).join("")
        : `<div class="mono" style="font-size:0.74rem;color:var(--vg-text-muted);">Sin coincidencias para "${esc(expSearchQuery)}".</div>`;
    };
    renderExpSearchResults();

    document.getElementById("exp-search-input")?.addEventListener("input", (e) => {
      expSearchQuery = e.target.value;
      renderExpSearchResults();
    });
    document.getElementById("exp-search-clear")?.addEventListener("click", () => {
      expSearchQuery = "";
      const inp = document.getElementById("exp-search-input");
      if (inp) inp.value = "";
      renderExpSearchResults();
    });
    container.querySelectorAll("[data-jump-pinned-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDayNum = Number(btn.dataset.jumpPinnedDay || 1);
        userPickedDay = true;
        lastDaySignature = "";
        switchTab("day", { scrollToTop: true });
      });
    });
    container.querySelectorAll("[data-jump-pinned-suspect]").forEach((btn) => {
      btn.addEventListener("click", () => openSuspectModal(btn.dataset.jumpPinnedSuspect, btn));
    });
    container.querySelectorAll("[data-timeline-floor]").forEach((btn) => {
      btn.addEventListener("click", () => {
        timelineFloorFilter = btn.dataset.timelineFloor;
        renderExpedienteView(true);
      });
    });

    document.getElementById("exp-manual-btn")?.addEventListener("click", openRulesModal);
    document.getElementById("exp-dedication-btn")?.addEventListener("click", (e) => openDedicationModal(e.currentTarget));

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
      if (!userPrefs.reducedMotion && !userPrefs.highContrastOutdoor && window.resumeSnow) window.resumeSnow();
      renderExpedienteView();
    });
    document.getElementById("pref-outdoor-btn")?.addEventListener("click", () => {
      userPrefs.highContrastOutdoor = !userPrefs.highContrastOutdoor;
      applyUserPrefs();
      if (!userPrefs.reducedMotion && !userPrefs.highContrastOutdoor && window.resumeSnow) window.resumeSnow();
      renderExpedienteView();
    });

    document.getElementById("export-diary-btn")?.addEventListener("click", () => {
      const lines = [
        `# DIARIO DE INVESTIGACIÓN — ADVIENTO CERO`,
        `Fecha exportación: ${new Date().toLocaleString("es-ES")}`,
        `Puertas resueltas: ${solvedDaysArr.length}/24`,
        ``,
        `## Resoluciones`,
        ...solvedDaysArr.map((d) => `- Día ${String(d.day).padStart(2, "0")} [${d.forensicTag || "Resuelta"}]: ${d.conclusion}`),
        ``,
        `## Libreta Compartida`,
        syncState.sharedNotes || "(Sin anotaciones)"
      ];
      downloadBlob(lines.join("\n"), "adviento-cero-diario.md", "text/markdown;charset=utf-8");
    });

    document.getElementById("export-json-btn")?.addEventListener("click", () => {
      const payload = {
        schemaVersion: 2,
        appVersion: APP_VERSION,
        exportedAt: new Date().toISOString(),
        role: currentRole,
        dedicationSeen: Store.getItem(DEDICATION_SEEN_KEY) === "1",
        syncState,
        draftsStore,
        userPrefs
      };
      downloadBlob(JSON.stringify(payload, null, 2), "adviento-cero-backup.json", "application/json;charset=utf-8");
    });

    const importFileInp = document.getElementById("import-json-file");
    document.getElementById("import-json-btn")?.addEventListener("click", () => importFileInp?.click());
    importFileInp?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("El archivo JSON no es un respaldo válido.");
        }
        const incomingSync = parsed.syncState && typeof parsed.syncState === "object" ? parsed.syncState : parsed;
        window.SyncEngine.importBackupState(incomingSync);
        if (parsed.draftsStore && typeof parsed.draftsStore === "object" && !Array.isArray(parsed.draftsStore)) {
          draftsStore = Object.assign(loadDraftsStorage(), parsed.draftsStore);
          saveDrafts();
        }
        if (parsed.userPrefs && typeof parsed.userPrefs === "object" && !Array.isArray(parsed.userPrefs)) {
          userPrefs = Object.assign(userPrefs, parsed.userPrefs);
          applyUserPrefs();
        }
        showToast("Backup JSON restaurado y fusionado sin pérdida de progreso.");
        renderActiveTab();
      } catch (err) {
        showToast(`No se pudo importar el backup: ${err?.message || "archivo inválido"}`);
      }
    });

    document.getElementById("verify-offline-btn")?.addEventListener("click", async () => {
      if (!("caches" in window)) {
        offlinePackStatus = "Cache API no disponible en este navegador.";
        renderExpedienteView(true);
        return;
      }
      try {
        const cache = await caches.open(CACHE_TAG);
        const criticalExtras = [
          "./video-briefing/briefing.mp4",
          "./imprimibles/PRESENTACION_ADVIENTO_CERO.pdf"
        ];
        for (const asset of criticalExtras) {
          const hit = await cache.match(asset, { ignoreSearch: true });
          if (!hit) {
            try {
              const resp = await fetch(asset);
              if (resp && resp.ok) await cache.put(asset, resp);
            } catch (_) {}
          }
        }
        const keys = await cache.keys();
        offlinePackStatus = `Paquete offline verificado (${keys.length} recursos listos sin cobertura).`;
      } catch (_) {
        offlinePackStatus = "No se pudo verificar completamente la caché offline.";
      }
      renderExpedienteView(true);
    });

    document.getElementById("copy-spoilerfree-btn")?.addEventListener("click", async () => {
      const remCount = syncState.finalVerdictSolved ? 1 : 25 - (syncState.discardedIds?.length || 0);
      const summary = `ADVIENTO CERO · El Misterio del Ventisquero — Puertas resueltas: ${solvedDaysArr.length}/24 · Sospechosos activos: ${remCount}/25 (Sin spoilers)`;
      try {
        await navigator.clipboard.writeText(summary);
        showToast("Resumen sin spoilers copiado al portapapeles.");
      } catch (_) {
        showToast(summary);
      }
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

  async function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    try {
      if (typeof navigator.share === "function" && typeof File === "function") {
        const f = new File([blob], filename, { type: mime });
        if (!navigator.canShare || navigator.canShare({ files: [f] })) {
          await navigator.share({ files: [f], title: filename });
          return;
        }
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
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
    const titleEl = document.getElementById("adv-modal-title");
    if (titleEl && !titleEl.hasAttribute("tabindex")) {
      titleEl.setAttribute("tabindex", "-1");
    }
    modal.classList.add("open");
    lockBodyScroll();
    document.getElementById("adv-modal-x-btn")?.addEventListener("click", () => closeModal());
    const topStrip = body.querySelector(".adv-modal-topstrip");
    if (topStrip) {
      let swipeY0 = 0;
      topStrip.addEventListener("touchstart", (e) => {
        swipeY0 = e.touches?.[0]?.clientY || 0;
      }, { passive: true });
      topStrip.addEventListener("touchend", (e) => {
        const swipeY1 = e.changedTouches?.[0]?.clientY || 0;
        if (swipeY0 && swipeY1 - swipeY0 > 70) {
          closeModal();
        }
        swipeY0 = 0;
      }, { passive: true });
    }
    if (!opts.fromHistory && !modalHistoryPushed && window.history?.pushState) {
      modalHistoryPushed = true;
      window.history.pushState({ modal: true, tab: activeTab, day: selectedDayNum }, "");
    }
    if (!opts.preserveFocus) {
      const focusTarget = titleEl || body.querySelector("h2, h3, button:not(#adv-modal-x-btn), input, select, textarea") || document.getElementById("adv-modal-x-btn");
      if (focusTarget) {
        try { focusTarget.focus({ preventScroll: true }); } catch (_) {}
      }
    }
  }

  function closeModal(fromHistory = false) {
    const modal = document.getElementById("adv-modal");
    if (!modal) return;
    modal.classList.remove("open");
    openModalSuspectId = null;
    if (!document.getElementById("identity-overlay")?.classList.contains("open")) {
      unlockBodyScroll();
      if (window.resumeSnow) window.resumeSnow();
    }
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function" && lastFocusedEl.isConnected) {
      try { lastFocusedEl.focus({ preventScroll: true }); } catch (_) {}
    }
    lastFocusedEl = null;
    if (modalHistoryPushed) {
      modalHistoryPushed = false;
      if (!fromHistory && window.history?.back) {
        ignorePopstateCount += 1;
        window.history.back();
      }
    }
  }

  function openImageLightbox(src, caption, triggerEl) {
    let scale = 1;
    showModal(`
      <span class="badge badge-frost">VISOR FOTOGRÁFICO DE EVIDENCIA</span>
      <h3 id="adv-modal-title" class="serif" style="font-size:1.2rem;margin:8px 0 10px;">${esc(caption || "Evidencia")}</h3>
      <div class="lightbox-stage" id="lightbox-stage">
        <img src="${esc(src)}" alt="${esc(caption || "Evidencia")}" id="lightbox-img">
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button type="button" class="btn btn-sm btn-frost" style="flex:1;" id="lb-zoom-btn">Zoom 1x a 2x</button>
        <button type="button" class="btn btn-sm btn-ghost" style="flex:1;" id="close-modal-btn">Cerrar</button>
      </div>
    `, triggerEl);
    const stage = document.getElementById("lightbox-stage");
    const img = document.getElementById("lightbox-img");
    const zoomBtn = document.getElementById("lb-zoom-btn");
    zoomBtn?.addEventListener("click", () => {
      scale = scale === 1 ? 2 : scale === 2 ? 3 : 1;
      if (img) {
        img.style.width = `${scale * 100}%`;
      }
      if (stage && scale === 1) {
        stage.scrollLeft = 0;
        stage.scrollTop = 0;
      }
      zoomBtn.textContent = scale === 1 ? "Zoom 1x a 2x" : scale === 2 ? "Zoom 2x a 3x" : "Restablecer 1x";
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
    const isOut = (syncState.discardedIds || []).includes(s.id);
    const culpritId = syncState.finalEpilogue?.culpritId;
    const isCulprit = Boolean(syncState.finalVerdictSolved && culpritId && s.id === culpritId);
    const isExonerated = Boolean(syncState.finalVerdictSolved && !isCulprit);
    const solvedEntry = Object.values(syncState.days || {}).find((d) => d && d.discardId === s.id && d.solved);

    const sNotes = syncState.suspectNotes?.[s.id] || {};
    const mySNote = sNotes[currentRole] || { stance: "duda", note: "" };
    const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
    const partnerSNote = sNotes[partnerRole];
    const badgeClass = isCulprit ? "badge-crimson" : isExonerated && !isOut ? "badge-pine" : isOut ? "badge-crimson" : "badge-gold";
    const badgeText = isCulprit ? "CULPABLE" : isExonerated && !isOut ? "EXONERADO" : isOut ? "DESCARTADO" : `FICHA #${s.num}`;
    const partnerNoteHtml = partnerSNote?.note
      ? `<div class="clue-box" style="margin-top:10px;font-size:0.8rem;"><strong>Anotación de ${partnerRole === "miguel" ? "Miguel" : "Patri"} (${esc(partnerSNote.stance)}):</strong> ${esc(partnerSNote.note)}</div>`
      : "";

    const existingPartnerSlot = document.getElementById("suspect-partner-note-slot");
    const existingBadge = document.getElementById("suspect-modal-badge");
    if (preserveFocus && openModalSuspectId === suspectId && existingPartnerSlot && existingBadge) {
      existingBadge.className = `badge ${badgeClass}`;
      existingBadge.textContent = badgeText;
      existingPartnerSlot.innerHTML = `${solvedEntry ? `<div class="feedback-banner success"><strong>Resolución:</strong> ${esc(solvedEntry.conclusion)}</div>` : ""}${partnerNoteHtml}`;
      return;
    }

    openModalSuspectId = suspectId;
    showModal(`
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px;">
        <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="82" height="82" style="width:82px;height:82px;border-radius:14px;object-fit:cover;border:var(--vg-border-specular-strong);">
        <div>
          <span id="suspect-modal-badge" class="badge ${badgeClass}">${esc(badgeText)}</span>
          <h3 id="adv-modal-title" style="font-size:1.25rem;margin-top:6px;">${esc(s.name)}</h3>
          <div style="font-size:0.82rem;color:var(--vg-text-secondary);">${esc(s.role)} · ${esc(s.room)}</div>
        </div>
      </div>
      <div class="clue-box">
        <p style="margin-bottom:8px;"><strong>Posible motivo:</strong> ${esc(s.motiveHint)}</p>
        <p><strong>Coartada inicial:</strong> ${esc(s.alibiClaim)}</p>
      </div>
      <div id="suspect-partner-note-slot">
        ${solvedEntry ? `<div class="feedback-banner success"><strong>Resolución:</strong> ${esc(solvedEntry.conclusion)}</div>` : ""}
        ${partnerNoteHtml}
      </div>
      <form id="suspect-note-form" style="margin-top:12px;">
        <div class="mono" style="font-size:0.72rem;color:var(--adv-gold-soft);margin-bottom:6px;">Tu valoración sobre ${esc(s.name)}</div>
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;" role="group" aria-label="Valoración de sospecha">
          ${["sospecha", "duda", "inocente"].map((st) => `
            <button type="button" class="filter-chip ${mySNote.stance === st ? "active" : ""}" data-stance="${st}" aria-pressed="${mySNote.stance === st ? "true" : "false"}">${st.toUpperCase()}</button>
          `).join("")}
        </div>
        <div style="display:flex;gap:8px;">
          <input type="text" id="suspect-note-inp" class="adv-input" aria-label="Apunte rápido de coartada" value="${esc(mySNote.note || "")}" placeholder="Apunte rápido de coartada..." style="min-height:44px;min-width:0;">
          <button type="submit" class="btn btn-sm btn-frost" style="flex-shrink:0;">Guardar</button>
        </div>
      </form>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
        <button type="button" class="btn btn-sm btn-ghost pin-clue-btn" style="flex:1;" id="modal-pin-suspect-btn" aria-pressed="${(syncState.pinnedClues || []).includes(`suspect-${s.id}`) ? "true" : "false"}">${(syncState.pinnedClues || []).includes(`suspect-${s.id}`) ? "Fijada en Careo" : "Fijar en Careo"}</button>
        <button type="button" class="btn btn-sm ${compareIds.includes(s.id) ? "btn-gold" : "btn-frost"}" style="flex:1;" id="modal-compare-suspect-btn">${compareIds.includes(s.id) ? "En comparador (quitar)" : `Comparar (${compareIds.length}/3)`}</button>
      </div>
      <button type="button" class="btn btn-ghost" style="width:100%;margin-top:10px;" id="close-modal-btn">Cerrar ficha</button>
    `, triggerEl, { preserveFocus, fromHistory: preserveFocus });

    let chosenStance = mySNote.stance || "duda";
    document.querySelectorAll("[data-stance]").forEach((b) => {
      b.addEventListener("click", () => {
        chosenStance = b.dataset.stance;
        document.querySelectorAll("[data-stance]").forEach((x) => {
          const on = x === b;
          x.classList.toggle("active", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });
      });
    });
    document.getElementById("modal-pin-suspect-btn")?.addEventListener("click", (e) => {
      window.AudioFX.click();
      const pinned = window.SyncEngine.togglePinnedClue(`suspect-${s.id}`);
      const on = pinned.includes(`suspect-${s.id}`);
      e.currentTarget.setAttribute("aria-pressed", on ? "true" : "false");
      e.currentTarget.textContent = on ? "Fijada en Careo" : "Fijar en Careo";
      showToast(on ? `Ficha #${s.num} fijada para el Careo.` : "Chincheta retirada.");
    });
    document.getElementById("modal-compare-suspect-btn")?.addEventListener("click", (e) => {
      window.AudioFX.click();
      const idx = compareIds.indexOf(s.id);
      if (idx >= 0) {
        compareIds.splice(idx, 1);
      } else {
        if (compareIds.length >= 3) compareIds.shift();
        compareIds.push(s.id);
      }
      const inCmp = compareIds.includes(s.id);
      e.currentTarget.className = `btn btn-sm ${inCmp ? "btn-gold" : "btn-frost"}`;
      e.currentTarget.textContent = inCmp ? "En comparador (quitar)" : `Comparar (${compareIds.length}/3)`;
      lastSuspectsSignature = "";
      if (activeTab === "suspects") renderSuspectsView(true);
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
    if (currentRole !== "patri") return;
    try {
      if (Store.getItem(DEDICATION_SEEN_KEY) === "1") return;
      Store.setItem(DEDICATION_SEEN_KEY, "1");
    } catch (_) {}
    openDedicationModal();
  }

  let partnerToastBaselineReady = false;

  function detectPartnerProgressToast(newSt) {
    const syncStatus = window.SyncEngine.getStatus();
    if (!currentRole || (syncStatus.mode === "firebase" && !syncStatus.initialSynced)) {
      return;
    }
    if (!prevSyncSnap || !partnerToastBaselineReady) {
      prevSyncSnap = JSON.parse(JSON.stringify(newSt));
      partnerToastBaselineReady = true;
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

    Object.keys(newSt.fieldDispatch || {}).forEach((k) => {
      const prevTxt = prevSyncSnap.fieldDispatch?.[k]?.[partnerRole]?.text || "";
      const curTxt = newSt.fieldDispatch?.[k]?.[partnerRole]?.text || "";
      if (curTxt && curTxt !== prevTxt) {
        window.AudioFX.partnerPing?.();
        showToast(`${partnerName} te envió un dato en el Día ${String(k).padStart(2, "0")}.`);
      }
    });

    Object.keys(newSt.suspectNotes || {}).forEach((sid) => {
      const prevAt = Number(prevSyncSnap.suspectNotes?.[sid]?.[partnerRole]?.at || 0);
      const curEntry = newSt.suspectNotes?.[sid]?.[partnerRole];
      if (curEntry && Number(curEntry.at || 0) > prevAt) {
        const sp = (window.SUSPECTS_DATA || []).find((x) => x.id === sid);
        showToast(`${partnerName} anotó en la ficha de ${sp ? sp.name : sid}.`);
      }
    });

    const prevPropAt = Number(prevSyncSnap.finalProposal?.proposedAt || 0);
    const curProp = newSt.finalProposal;
    if (curProp && curProp.byRole === partnerRole && Number(curProp.proposedAt || 0) > prevPropAt) {
      window.AudioFX.partnerPing?.();
      showToast(`${partnerName} ha enviado una propuesta conjunta para el Careo Final.`);
    }

    prevSyncSnap = JSON.parse(JSON.stringify(newSt));
  }

  function refreshDateGateIfNeeded() {
    const nowMax = window.DateGate.getMaxOpenDay();
    if (nowMax !== lastKnownMaxOpenDay) {
      lastKnownMaxOpenDay = nowMax;
      lastCalendarSignature = "";
      lastDaySignature = "";
      lastSuspectsSignature = "";
      lastExpedienteSignature = "";
      renderAdminBar();
      renderActiveTab();
      updateDockIndicator();
    }
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
      } else if (e.target.closest("[data-force-sync-now]")) {
        window.SyncEngine.forceSyncNow?.();
        showToast("Intentando sincronizar cambios pendientes...");
      }
    });

    if (window.AudioFX && typeof window.AudioFX.onVisualCue === "function") {
      window.AudioFX.onVisualCue((kind, msg) => {
        const dock = document.querySelector(".mobile-dock");
        if (dock) {
          dock.classList.remove("audio-visual-pulse");
          void dock.offsetWidth;
          dock.classList.add("audio-visual-pulse");
        }
        if (kind === "partner") showToast(msg);
      });
    }

    window.addEventListener("error", (ev) => {
      if (ev?.target && ev.target.tagName === "IMG") {
        ev.target.style.background = "rgba(15, 23, 42, 0.85)";
        ev.target.style.minHeight = ev.target.style.minHeight || "44px";
        return;
      }
      console.warn("Runtime error capturado:", ev?.message || ev);
    }, true);

    window.addEventListener("unhandledrejection", (ev) => {
      console.warn("Promise rejection capturada:", ev?.reason);
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
      if (e.key === "Tab") {
        const modalOpen = document.getElementById("adv-modal")?.classList.contains("open");
        const idOpen = !modalOpen && document.getElementById("identity-overlay")?.classList.contains("open");
        const root = modalOpen
          ? document.getElementById("adv-modal-body")
          : idOpen
            ? document.querySelector("#identity-overlay .identity-modal")
            : null;
        if (!root) return;
        const focusables = Array.from(root.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')).filter((el) => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!root.contains(document.activeElement)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (focusables.length >= 2) {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    // Teclado virtual móvil mediante visualViewport + fallback focusin/out (sin incluir <select>)
    let baseH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    if (window.visualViewport) {
      const updateViewportKb = () => {
        const ae = document.activeElement;
        const editing = Boolean(ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && ae.type !== "range");
        if (!editing && window.visualViewport.height > 0) {
          baseH = window.visualViewport.height;
        }
        const isKb = editing && window.visualViewport.height < baseH * 0.78;
        document.body.classList.toggle("keyboard-open", Boolean(isKb));
      };
      window.visualViewport.addEventListener("resize", updateViewportKb);
      window.addEventListener("orientationchange", () => {
        setTimeout(() => {
          baseH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          updateViewportKb();
        }, 250);
      });
    }
    document.addEventListener("focusin", (e) => {
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName) && e.target.type !== "range") {
        document.body.classList.add("keyboard-open");
        if (window.innerWidth <= 768 && !document.body.classList.contains("modal-open")) {
          setTimeout(() => { try { e.target.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (_) {} }, 300);
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

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        flushPendingNotes();
        pauseBriefingVideos();
      } else {
        refreshDateGateIfNeeded();
      }
    });
    window.addEventListener("focus", refreshDateGateIfNeeded);
    setInterval(() => {
      if (!document.hidden) refreshDateGateIfNeeded();
    }, 60000);

    window.addEventListener("pagehide", () => {
      flushPendingNotes();
      pauseBriefingVideos();
      clearKeyboardOpen();
      window.AudioFX.stopMorse?.();
    });

    if (window.history?.replaceState) {
      window.history.replaceState({ tab: "calendar", day: selectedDayNum }, "");
    }
    window.addEventListener("popstate", (e) => {
      if (ignorePopstateCount > 0) {
        ignorePopstateCount -= 1;
        return;
      }
      if (document.getElementById("adv-modal")?.classList.contains("open")) {
        closeModal(true);
        return;
      }
      if (document.getElementById("identity-overlay")?.classList.contains("open") && currentRole) {
        closeIdentityOverlay(true);
        return;
      }
      const targetTab = e.state?.tab || "calendar";
      if (targetTab !== activeTab) {
        switchTab(targetTab, { fromHistory: true, silent: true });
      }
      if (targetTab === "day" && e.state?.day && e.state.day !== selectedDayNum) {
        selectedDayNum = e.state.day;
        lastDaySignature = "";
        window.AudioFX.stopMorse?.();
        window.SyncEngine.setViewingDay(selectedDayNum);
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
      const hadController = Boolean(navigator.serviceWorker.controller);
      let swRefreshing = false;
      navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then((reg) => {
        reg.update().catch(() => {});
        if (reg.waiting && navigator.serviceWorker.controller) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              nw.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      }).catch(() => {});
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (hadController && !swRefreshing) {
          swRefreshing = true;
          const ae = document.activeElement;
          const busyEditing = Boolean(ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) || Boolean(window.SyncEngine.getStatus().dirty);
          if (busyEditing) {
            showToast("Nueva versión de la app lista.", "Actualizar", () => window.location.reload());
          } else {
            window.location.reload();
          }
        }
      });
    }
  });
})();
