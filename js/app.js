/**
 * ADVIENTO CERO — CONTROLADOR PRINCIPAL DE APLICACIÓN
 */

(() => {
  const APP_VERSION = "v2.19.0";
  const CACHE_TAG = "adviento-cero-v2.19.0";
  const ROLE_KEY = "adviento_player_role";
  const DEDICATION_SEEN_KEY = "adviento_dedication_seen_v1";
  const DRAFTS_KEY = "adviento_drafts_v1";
  const PREFS_KEY = "adviento_prefs_v1";
  const UNSEALED_DOORS_KEY = "adviento_unsealed_doors_v1";
  const GIFT_ENVELOPE_OPEN_KEY = "adviento_gift_envelope_open_v1";
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
  let suspectsTab = "cards";
  let suspectSort = "recent";
  let suspectFilter = "all";
  let suspectGroupFilter = "all";
  let suspectFloorFilter = "all";
  let suspectWithNotesOnly = false;
  let suspectPinnedOnly = false;
  let suspectStanceFilter = "all";
  let suspectFiltersExtraOpen = false;
  let suspectSearch = "";
  let compareIds = [];
  let calendarFilter = "all";
  let expedienteTab = "case";
  let expedienteFloor = "Planta 1";
  let expSearchQuery = "";
  let timelineFloorFilter = "all";
  let offlinePackStatus = "";
  let notesUndoSnapshot = null;
  const celebratedLockDays = new Set();
  let cinemaActiveCleanup = null;

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
    while (host.children.length >= 3) {
      host.firstElementChild.remove();
    }
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

  function isReducedMotionPref() {
    return Boolean(userPrefs.reducedMotion || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches));
  }

  function getUnsealedDoors() {
    try {
      const raw = Store.getItem(UNSEALED_DOORS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.map(Number).filter(Number.isFinite) : [];
    } catch (_) {
      return [];
    }
  }

  function isDoorUnsealed(dayNum) {
    return getUnsealedDoors().includes(Number(dayNum));
  }

  function markDoorUnsealed(dayNum) {
    const n = Number(dayNum);
    if (!Number.isFinite(n)) return;
    const set = new Set(getUnsealedDoors());
    set.add(n);
    try { Store.setItem(UNSEALED_DOORS_KEY, JSON.stringify([...set])); } catch (_) {}
  }

  function buildWaxSealSvg(dayNum, uid) {
    const numStr = String(dayNum).padStart(2, "0");
    const clipPoly = uid === "tl"
      ? "0,0 144,0 122,22 96,46 89,58 70,72 60,86 44,96 22,122 0,144"
      : "144,0 144,144 0,144 22,122 44,96 60,86 70,72 89,58 96,46 122,22";
    return `
      <svg viewBox="0 0 144 144" width="164" height="164" aria-hidden="true">
        <defs>
          <clipPath id="waxClip_${uid}">
            <polygon points="${clipPoly}"/>
          </clipPath>
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

  function playDoorWaxUnseal(dayObj, onReveal, opts = {}) {
    if (!opts.previewOnly) markDoorUnsealed(dayObj.day);
    if (window.DoorRituals && typeof window.DoorRituals.play === "function") {
      if (typeof cinemaActiveCleanup === "function") cinemaActiveCleanup();
      window.DoorRituals.play(dayObj, onReveal, opts);
      return;
    }
    const layer = document.getElementById("cinema-fx-layer");
    if (!layer || isReducedMotionPref()) {
      window.AudioFX.waxSealBreak?.();
      if (typeof onReveal === "function") onReveal();
      return;
    }

    if (typeof cinemaActiveCleanup === "function") cinemaActiveCleanup();
    let revealed = false;
    let finished = false;
    const timers = [];
    const revealOnce = () => {
      if (revealed) return;
      revealed = true;
      onReveal();
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
      if (cinemaActiveCleanup === cleanup) cinemaActiveCleanup = null;
    };
    cinemaActiveCleanup = cleanup;

    const shardColors = ["#EF4444", "#DC2626", "#FEF08A", "#F59E0B", "#FCA5A5"];
    const shardsHtml = Array.from({ length: 24 }, (_, i) => {
      const ang = (Math.PI * 2 * i) / 24 + (i % 2 === 0 ? 0.14 : -0.11);
      const dist = 62 + ((i * 23) % 86);
      const sx = Math.round(Math.cos(ang) * dist);
      const sy = Math.round(Math.sin(ang) * dist);
      const sr = (i % 2 === 0 ? 1 : -1) * (95 + ((i * 37) % 180));
      const sz = 4 + (i % 5);
      const dl = 545 + ((i * 17) % 75);
      const sc = shardColors[i % shardColors.length];
      const br = i % 3 === 0 ? "50%" : "2px";
      return `<span class="cinema-shard" style="--sx:${sx}px;--sy:${sy}px;--sr:${sr}deg;--sz:${sz}px;--sc:${sc};--br:${br};--dl:${dl}ms;"></span>`;
    }).join("");

    const numStr = String(dayObj.day).padStart(2, "0");
    layer.innerHTML = `
      <div class="cinema-stage">
        <div class="cinema-kicker">DICIEMBRE · PUERTA ${numStr}</div>
        <div class="cinema-headline">${esc(dayObj.title)}</div>
        <div class="cinema-slit"></div>
        <div class="wax-seal-arena">
          <div class="wax-lantern-glow"></div>
          <div class="wax-half wax-half-tl">${buildWaxSealSvg(dayObj.day, "tl")}</div>
          <div class="wax-half wax-half-br">${buildWaxSealSvg(dayObj.day, "br")}</div>
          <svg class="wax-crack-svg" viewBox="0 0 144 144" aria-hidden="true">
            <path class="wax-crack-line" d="M 122 22 L 96 46 L 89 58 L 70 72 L 60 86 L 44 96 L 22 122" fill="none"/>
          </svg>
          ${shardsHtml}
        </div>
        <div class="cinema-skip-hint">Toca para omitir</div>
      </div>`;

    layer.setAttribute("aria-hidden", "false");
    layer.classList.remove("closing");
    layer.classList.add("active");
    window.AudioFX.waxSealBreak?.();

    layer.onclick = () => cleanup(true);
    timers.push(setTimeout(revealOnce, 1020));
    timers.push(setTimeout(() => layer.classList.add("closing"), 1280));
    timers.push(setTimeout(() => cleanup(false), 1540));
  }

  function playDoubleLockCinema(dayNum, opts = {}) {
    const dNum = Number(dayNum || 1);
    if (!opts.force && celebratedLockDays.has(dNum)) return;
    celebratedLockDays.add(dNum);

    window.AudioFX.doubleLockOpen?.();
    const layer = document.getElementById("cinema-fx-layer");
    if (!layer || isReducedMotionPref()) {
      if (window.triggerGoldBurst) window.triggerGoldBurst(34);
      return;
    }

    if (typeof cinemaActiveCleanup === "function") cinemaActiveCleanup();
    window.DoorRituals?.stop?.();
    let finished = false;
    const timers = [];
    const cleanup = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      layer.classList.remove("active", "closing");
      layer.setAttribute("aria-hidden", "true");
      layer.innerHTML = "";
      layer.onclick = null;
      if (cinemaActiveCleanup === cleanup) cinemaActiveCleanup = null;
    };
    cinemaActiveCleanup = cleanup;

    const sparkColors = ["#78D7F2", "#F2A84B", "#FFFFFF", "#FDE68A", "#9BE8FF", "#FBBF24"];
    const sparksHtml = Array.from({ length: 26 }, (_, i) => {
      const ang = (Math.PI * 2 * i) / 26 + (i % 3 === 0 ? 0.08 : -0.06);
      const dist = 62 + ((i * 29) % 106);
      const sx = Math.round(Math.cos(ang) * dist);
      const sy = Math.round(Math.sin(ang) * dist * 0.72);
      const sr = (i % 2 === 0 ? 1 : -1) * (110 + ((i * 31) % 160));
      const sz = 3 + (i % 4);
      const dl = 465 + ((i * 13) % 75);
      const sc = sparkColors[i % sparkColors.length];
      return `<span class="cinema-shard" style="--sx:${sx}px;--sy:${sy}px;--sr:${sr}deg;--sz:${sz}px;--sc:${sc};--br:50%;--dl:${dl}ms;"></span>`;
    }).join("");

    const numStr = String(dNum).padStart(2, "0");
    const kicker = opts.kicker || (opts.isJoint ? "CLAVE CONJUNTA VALIDADA" : "SINCRONIZACIÓN EN VIVO");
    const headline = opts.headline || (opts.isJoint ? "ENIGMA RESUELTO" : "DOBLE CANDADO ABIERTO");
    const subline = opts.subline || `DÍA ${numStr} · MIGUEL Y PATRI SINCRONIZADOS`;

    layer.innerHTML = `
      <div class="cinema-stage">
        <div class="cinema-kicker">${esc(kicker)}</div>
        <div class="dlock-arena">
          <div class="dlock-glint"></div>
          ${sparksHtml}
          <svg class="dlock-svg" viewBox="0 0 380 144" aria-hidden="true">
            <defs>
              <linearGradient id="dlockBeamL" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#78D7F2" stop-opacity="0.30"/>
                <stop offset="100%" stop-color="#78D7F2" stop-opacity="0.02"/>
              </linearGradient>
              <linearGradient id="dlockBeamR" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stop-color="#F2A84B" stop-opacity="0.30"/>
                <stop offset="100%" stop-color="#F2A84B" stop-opacity="0.02"/>
              </linearGradient>
              <radialGradient id="dlockCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#EF4444" stop-opacity="0.72"/>
                <stop offset="58%" stop-color="#991B1B" stop-opacity="0.46"/>
                <stop offset="100%" stop-color="#450A0A" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="dlockBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="55%" stop-color="#F4EFE6"/>
                <stop offset="100%" stop-color="#CBD5E1"/>
              </linearGradient>
            </defs>
            <polygon points="14,57 152,68 152,76 14,87" fill="url(#dlockBeamL)"/>
            <polygon points="366,57 228,68 228,76 366,87" fill="url(#dlockBeamR)"/>
            <path class="dlock-wave-l" d="M 14 72 L 32 72 L 42 54 L 52 90 L 63 60 L 74 82 L 86 67 L 98 76 L 112 71 L 148 72"/>
            <path class="dlock-wave-r" d="M 366 72 L 348 72 L 338 56 L 328 88 L 317 58 L 306 84 L 294 67 L 282 77 L 268 71 L 232 72"/>
            <text x="16" y="106" fill="#78D7F2" fill-opacity="0.86" font-family="ui-monospace, Consolas, monospace" font-size="9" font-weight="700" letter-spacing="1.6">MIGUEL</text>
            <text x="364" y="106" text-anchor="end" fill="#F2A84B" fill-opacity="0.88" font-family="ui-monospace, Consolas, monospace" font-size="9" font-weight="700" letter-spacing="1.6">PATRI</text>
            <circle cx="190" cy="72" r="33" fill="url(#dlockCoreGlow)"/>
            <circle cx="190" cy="72" r="25" fill="rgba(127,29,29,0.52)" stroke="rgba(252,165,165,0.42)" stroke-width="1.2"/>
            <circle cx="190" cy="72" r="31" fill="none" stroke="rgba(244,239,230,0.22)" stroke-width="1" stroke-dasharray="3 4"/>
            <g class="dlock-ring-cyan">
              <path d="M 186 34.2 A 38 38 0 0 0 186 109.8" fill="none" stroke="#78D7F2" stroke-width="2.4" stroke-linecap="round"/>
              <line x1="146" y1="72" x2="152" y2="72" stroke="#78D7F2" stroke-width="2" stroke-linecap="round"/>
            </g>
            <g class="dlock-ring-amber">
              <path d="M 194 34.2 A 38 38 0 0 1 194 109.8" fill="none" stroke="#F2A84B" stroke-width="2.4" stroke-linecap="round"/>
              <line x1="228" y1="72" x2="234" y2="72" stroke="#F2A84B" stroke-width="2" stroke-linecap="round"/>
            </g>
            <path class="dlock-shackle" d="M 180 67 V 57 A 10 10 0 0 1 200 57 V 67" fill="none" stroke="#F4EFE6" stroke-width="3.6" stroke-linecap="round"/>
            <rect x="175" y="67" width="30" height="21" rx="3.8" fill="url(#dlockBody)" stroke="#FFFFFF" stroke-width="1.1"/>
            <circle class="dlock-keyhole" cx="190" cy="75.5" r="2.6"/>
            <path class="dlock-keyhole" d="M 188.9 77.2 L 188.2 82.8 L 191.8 82.8 L 191.1 77.2 Z"/>
          </svg>
        </div>
        <div class="cinema-headline">${esc(headline)}</div>
        <div class="cinema-slit"></div>
        <div class="cinema-subline">${esc(subline)}</div>
        <div class="cinema-skip-hint">Toca para continuar</div>
      </div>`;

    layer.setAttribute("aria-hidden", "false");
    layer.classList.remove("closing");
    layer.classList.add("active");

    layer.onclick = () => cleanup();
    timers.push(setTimeout(() => { if (window.triggerGoldBurst) window.triggerGoldBurst(52); }, 480));
    timers.push(setTimeout(() => layer.classList.add("closing"), 1750));
    timers.push(setTimeout(() => cleanup(), 2020));
  }

  function openAdventDay(dayNum) {
    const d = Number(dayNum || 1);
    if (!window.DateGate.isDayOpen(d)) {
      window.AudioFX.error();
      openNoticeModal(`Puerta ${String(d).padStart(2, "0")} precintada`, `Esta puerta se abrirá automáticamente el ${d} de diciembre.`);
      return;
    }
    const dayObj = (window.ADVENT_DAYS || []).find((x) => x.day === d);
    const navigateToDay = (silentClick = false) => {
      userPickedDay = true;
      selectedDayNum = d;
      lastDaySignature = "";
      switchTab("day", { scrollToTop: true, force: true, silent: silentClick });
    };
    const alreadySolved = Boolean(syncState.days?.[String(d)]?.solved);
    if (dayObj && !alreadySolved && !isDoorUnsealed(d)) {
      playDoorWaxUnseal(dayObj, () => navigateToDay(true));
      return;
    }
    navigateToDay(false);
  }

  function renderBriefingVideoHtml(videoId) {
    const mutedAttr = window.AudioFX?.isMuted?.() ? " muted" : "";
    return `
      <video id="${esc(videoId)}" class="briefing-native-video" controls playsinline preload="metadata" poster="video-briefing/poster.jpg?v=2.15.0" aria-label="Vídeo Briefing Oficial del Caso"${mutedAttr}>
        <source src="video-briefing/briefing.mp4?v=2.14.0" type="video/mp4">
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
            artwork: [{ src: "video-briefing/poster.jpg", sizes: "1280x720", type: "image/jpeg" }]
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
    const modalBox = overlay.querySelector(".identity-modal");
    if (modalBox) setTimeout(() => { try { modalBox.focus({ preventScroll: true }); } catch (_) {} }, 20);
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

  function toggleGlobalAudio() {
    const muted = window.AudioFX.toggleMute();
    syncBriefingVideoMute(muted);
    const heroBtn = document.getElementById("hero-mute-btn");
    if (heroBtn) heroBtn.textContent = muted ? "Audio OFF" : "Audio ON";
    const dayBtn = document.getElementById("day-mute-btn");
    if (dayBtn) dayBtn.textContent = muted ? "Audio OFF" : "Audio ON";
    const prefBtn = document.getElementById("pref-audio-btn");
    if (prefBtn) {
      prefBtn.textContent = `Audio: ${muted ? "OFF" : "ON"}`;
      prefBtn.classList.toggle("btn-gold", !muted);
      prefBtn.classList.toggle("btn-ghost", muted);
    }
    const mNote = document.getElementById(`morse-mute-note-${selectedDayNum}`);
    if (mNote) mNote.style.display = muted ? "block" : "none";
    lastCalendarSignature = "";
    lastDaySignature = "";
    lastExpedienteSignature = "";
    return muted;
  }

  function updateLiveCountdownOnly() {
    document.querySelectorAll("[data-live-countdown]").forEach((el) => {
      const kind = el.dataset.liveCountdown;
      const txt = kind === "next-door"
        ? (window.DateGate.getNextDoorCountdownText?.() || "")
        : window.DateGate.getCountdownText();
      if (txt) el.textContent = kind === "predec-dot" ? `${txt}.` : txt;
    });
  }

  function buildEnv24SealHalfSvg(side, prefix = "d24") {
    const uid = `${prefix}_${side}`;
    const clipPoly = side === "tl"
      ? "0,0 120,0 104,18 82,38 74,49 58,61 48,74 34,82 18,104 0,120"
      : "120,0 120,120 0,120 18,104 34,82 48,74 58,61 74,49 82,38 104,18";
    return `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <clipPath id="e24Clip_${uid}">
            <polygon points="${clipPoly}"/>
          </clipPath>
          <radialGradient id="e24Wax_${uid}" cx="34%" cy="28%" r="72%">
            <stop offset="0%" stop-color="#FF6266"/>
            <stop offset="38%" stop-color="#DC2626"/>
            <stop offset="76%" stop-color="#991B1B"/>
            <stop offset="100%" stop-color="#4A0909"/>
          </radialGradient>
          <radialGradient id="e24In_${uid}" cx="42%" cy="36%" r="62%">
            <stop offset="0%" stop-color="#B91C1C"/>
            <stop offset="75%" stop-color="#7F1D1D"/>
            <stop offset="100%" stop-color="#450A0A"/>
          </radialGradient>
        </defs>
        <g clip-path="url(#e24Clip_${uid})">
          <path d="M60 6 C71 4 82 9 91 15 C101 20 110 29 112 41 C117 51 117 65 112 76 C109 89 101 100 90 106 C79 114 66 117 54 115 C42 115 30 109 21 100 C12 91 6 79 7 66 C4 53 8 40 16 29 C23 18 34 11 46 8 C51 6 55 6 60 6 Z" fill="url(#e24Wax_${uid})" stroke="#FDE68A" stroke-opacity="0.72" stroke-width="1.9"/>
          <circle cx="60" cy="60" r="42" fill="url(#e24In_${uid})" stroke="#450A0A" stroke-width="2.2"/>
          <circle cx="60" cy="60" r="36" fill="none" stroke="#FDE68A" stroke-opacity="0.82" stroke-width="1.15" stroke-dasharray="3 2.5"/>
          <path d="M29 41 A36 36 0 0 1 74 24" fill="none" stroke="rgba(255,241,242,0.52)" stroke-width="2.4" stroke-linecap="round"/>
          <polygon points="60,26 62,31.5 67.5,33.5 62,35.5 60,41 58,35.5 52.5,33.5 58,31.5" fill="#FEF08A"/>
          <text x="60" y="71" text-anchor="middle" fill="#FFFBEB" font-family="Georgia, 'Times New Roman', serif" font-size="31" font-weight="700" letter-spacing="1">24</text>
          <text x="60" y="84" text-anchor="middle" fill="#FDE68A" font-family="ui-monospace, Consolas, monospace" font-size="6.4" font-weight="700" letter-spacing="1.7">NOCHEBUENA</text>
        </g>
      </svg>`;
  }

  function buildEnv24StageMarkup(gift, uid, isOpening = false) {
    const shards = [
      { sx: "-62px", sy: "-48px", sr: "-150deg", sz: "7px", sc: "#EF4444", dl: "640ms", br: "2px" },
      { sx: "66px", sy: "-42px", sr: "135deg", sz: "6px", sc: "#DC2626", dl: "650ms", br: "3px" },
      { sx: "-74px", sy: "20px", sr: "-120deg", sz: "6px", sc: "#FBBF24", dl: "660ms", br: "50%" },
      { sx: "72px", sy: "26px", sr: "160deg", sz: "7px", sc: "#B91C1C", dl: "655ms", br: "2px" },
      { sx: "-38px", sy: "-74px", sr: "-105deg", sz: "5px", sc: "#FEF08A", dl: "670ms", br: "50%" },
      { sx: "36px", sy: "-70px", sr: "118deg", sz: "5px", sc: "#F59E0B", dl: "665ms", br: "50%" },
      { sx: "-48px", sy: "62px", sr: "-145deg", sz: "6px", sc: "#DC2626", dl: "675ms", br: "2px" },
      { sx: "50px", sy: "60px", sr: "152deg", sz: "5px", sc: "#FDE68A", dl: "680ms", br: "50%" },
      { sx: "-16px", sy: "-82px", sr: "-82deg", sz: "4px", sc: "#FFFBEB", dl: "690ms", br: "50%" },
      { sx: "20px", sy: "72px", sr: "96deg", sz: "5px", sc: "#EF4444", dl: "685ms", br: "2px" },
      { sx: "-84px", sy: "-12px", sr: "-165deg", sz: "5px", sc: "#F59E0B", dl: "662ms", br: "50%" },
      { sx: "82px", sy: "-8px", sr: "170deg", sz: "5px", sc: "#FEF3C7", dl: "668ms", br: "50%" }
    ];
    const sparks = [
      { x: "16%", sz: "5px", dl: "1160ms" }, { x: "26%", sz: "4px", dl: "1260ms" },
      { x: "35%", sz: "6px", dl: "1200ms" }, { x: "45%", sz: "5px", dl: "1320ms" },
      { x: "52%", sz: "6px", dl: "1240ms" }, { x: "61%", sz: "4px", dl: "1360ms" },
      { x: "70%", sz: "6px", dl: "1290ms" }, { x: "79%", sz: "5px", dl: "1410ms" },
      { x: "86%", sz: "4px", dl: "1470ms" }, { x: "40%", sz: "5px", dl: "1520ms" },
      { x: "58%", sz: "5px", dl: "1560ms" }, { x: "30%", sz: "4px", dl: "1610ms" }
    ];

    const sealInner = `
      <span class="env24-seal-halo" aria-hidden="true"></span>
      <span class="env24-seal-half env24-seal-tl" aria-hidden="true">${buildEnv24SealHalfSvg("tl", uid)}</span>
      <span class="env24-seal-half env24-seal-br" aria-hidden="true">${buildEnv24SealHalfSvg("br", uid)}</span>
      <svg class="env24-crack-svg" viewBox="0 0 120 120" aria-hidden="true">
        <path class="env24-crack-path" d="M 104 18 L 82 38 L 74 49 L 58 61 L 48 74 L 34 82 L 18 104"/>
      </svg>`;

    return `
      <div class="env24-stage ${isOpening ? "is-opening" : "is-idle"}" data-env24-stage>
        <div class="env24-ambient-aura" aria-hidden="true"></div>
        <div class="env24-envelope">
          <div class="env24-back" aria-hidden="true"></div>

          <div class="env24-letter-slip" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#B45309" aria-hidden="true"><polygon points="12 1.5 14.5 9.2 22.5 12 14.5 14.8 12 22.5 9.5 14.8 1.5 12 9.5 9.2"/></svg>
            <div class="env24-slip-kicker">24 DE DICIEMBRE · SORPRESA</div>
            <div class="env24-slip-title">${esc(gift.voucherTitle || "Sobre de Nochebuena")}</div>
            <div class="env24-slip-lines"><span></span><span></span><span></span></div>
          </div>

          <div class="env24-pocket" aria-hidden="true">
            <svg viewBox="0 0 320 206" preserveAspectRatio="none">
              <defs>
                <filter id="e24Grain_${uid}" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" stitchTiles="stitch" result="n"/>
                  <feColorMatrix type="saturate" values="0" in="n" result="g"/>
                  <feComponentTransfer in="g"><feFuncA type="linear" slope="0.14"/></feComponentTransfer>
                </filter>
                <linearGradient id="e24SideL_${uid}" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#761624"/>
                  <stop offset="100%" stop-color="#3E0A12"/>
                </linearGradient>
                <linearGradient id="e24SideR_${uid}" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6B1320"/>
                  <stop offset="100%" stop-color="#360810"/>
                </linearGradient>
                <linearGradient id="e24Bot_${uid}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#8A1E2B"/>
                  <stop offset="46%" stop-color="#5B101A"/>
                  <stop offset="100%" stop-color="#36070F"/>
                </linearGradient>
                <linearGradient id="e24Gold_${uid}" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#FEF3C7" stop-opacity="0.78"/>
                  <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.92"/>
                  <stop offset="100%" stop-color="#FDE68A" stop-opacity="0.70"/>
                </linearGradient>
              </defs>
              <!-- Alas laterales y pliegue inferior con sombra realista -->
              <polygon points="0,0 160,114 0,206" fill="url(#e24SideL_${uid})"/>
              <polygon points="320,0 160,114 320,206" fill="url(#e24SideR_${uid})"/>
              <polygon points="0,206 160,92 320,206" fill="rgba(0,0,0,0.46)"/>
              <polygon points="0,206 160,100 320,206" fill="url(#e24Bot_${uid})"/>
              <!-- Textura sutil de papel de algodón -->
              <rect x="0" y="0" width="320" height="206" filter="url(#e24Grain_${uid})" opacity="0.55"/>
              <!-- Ribetes metálicos dorados en pliegues -->
              <polyline points="0,206 160,100 320,206" fill="none" stroke="url(#e24Gold_${uid})" stroke-width="1.3"/>
              <line x1="0" y1="0" x2="112" y2="80" stroke="rgba(253,230,138,0.24)" stroke-width="0.9"/>
              <line x1="320" y1="0" x2="208" y2="80" stroke="rgba(253,230,138,0.24)" stroke-width="0.9"/>
              <!-- Doble marco ornamental -->
              <rect x="6" y="6" width="308" height="194" rx="7" fill="none" stroke="rgba(253,230,138,0.34)" stroke-width="0.9"/>
              <path d="M12 182 L12 194 L24 194 M16 188 L20 188" fill="none" stroke="#FDE68A" stroke-opacity="0.72" stroke-width="1.3"/>
              <path d="M308 182 L308 194 L296 194 M304 188 L300 188" fill="none" stroke="#FDE68A" stroke-opacity="0.72" stroke-width="1.3"/>
              <!-- Caligrafía dorada y matasellos alpino -->
              <text x="160" y="168" text-anchor="middle" fill="#FFFBEB" fill-opacity="0.95" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="13.8" letter-spacing="0.4">Para Patri · Nochebuena</text>
              <text x="160" y="185" text-anchor="middle" fill="#FDE68A" fill-opacity="0.68" font-family="ui-monospace, Consolas, monospace" font-size="6.8" letter-spacing="2.2">EL MIRADOR DEL VENTISQUERO · 24 DIC</text>
            </svg>
          </div>

          <div class="env24-inner-glow" aria-hidden="true"></div>
          <div class="env24-anamorphic-beam" aria-hidden="true"></div>

          <div class="env24-flap-stage" aria-hidden="true">
            <div class="env24-flap-3d">
              <div class="env24-flap-face env24-flap-front">
                <svg viewBox="0 0 320 128" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="e24FlapF_${uid}" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#9B1F2E"/>
                      <stop offset="50%" stop-color="#701421"/>
                      <stop offset="100%" stop-color="#4B0C16"/>
                    </linearGradient>
                  </defs>
                  <polygon points="0,4 320,4 160,127" fill="rgba(0,0,0,0.48)"/>
                  <polygon points="0,0 320,0 160,121" fill="url(#e24FlapF_${uid})"/>
                  <polyline points="2,1 160,120 318,1" fill="none" stroke="#FDE68A" stroke-opacity="0.78" stroke-width="1.4"/>
                  <polyline points="14,6 160,111 306,6" fill="none" stroke="#FDE68A" stroke-opacity="0.30" stroke-width="0.9" stroke-dasharray="3 3"/>
                  <!-- Sello postal alpino 24 DIC en esquina superior derecha -->
                  <g opacity="0.86">
                    <rect x="266" y="10" width="38" height="30" rx="2" fill="rgba(5, 11, 18, 0.42)" stroke="#FDE68A" stroke-opacity="0.65" stroke-width="1" stroke-dasharray="2.5 2"/>
                    <polygon points="285,15 279,26 291,26" fill="none" stroke="#FDE68A" stroke-width="1.1"/>
                    <text x="285" y="36" text-anchor="middle" fill="#FEF3C7" font-family="ui-monospace, Consolas, monospace" font-size="6.4" font-weight="700" letter-spacing="0.8">24 DIC</text>
                    <circle cx="258" cy="28" r="11" fill="none" stroke="#FDE68A" stroke-opacity="0.34" stroke-width="0.85" stroke-dasharray="2 2"/>
                  </g>
                </svg>
              </div>
              <div class="env24-flap-face env24-flap-back">
                <svg viewBox="0 0 320 128" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="e24FlapB_${uid}" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#0B2E25"/>
                      <stop offset="100%" stop-color="#174D3F"/>
                    </linearGradient>
                    <pattern id="e24Damask_${uid}" width="16" height="16" patternUnits="userSpaceOnUse">
                      <path d="M8 0 L16 8 L8 16 L0 8 Z" fill="none" stroke="#FDE68A" stroke-opacity="0.16" stroke-width="0.7"/>
                    </pattern>
                  </defs>
                  <polygon points="0,0 320,0 160,121" fill="url(#e24FlapB_${uid})"/>
                  <polygon points="0,0 320,0 160,121" fill="url(#e24Damask_${uid})"/>
                  <polyline points="2,1 160,120 318,1" fill="none" stroke="#FDE68A" stroke-opacity="0.82" stroke-width="1.5"/>
                  <polygon points="160,30 163.5,41 174.5,44.5 163.5,48 160,59 156.5,48 145.5,44.5 156.5,41" fill="#FEF08A" fill-opacity="0.88"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="env24-ribbon-layer" aria-hidden="true">
            <span class="env24-ribbon-band env24-ribbon-l"></span>
            <span class="env24-ribbon-band env24-ribbon-r"></span>
          </div>

          ${!isOpening ? `<div class="env24-idle-sheen" aria-hidden="true"></div>` : ""}

          ${isOpening
            ? `<div class="env24-seal-btn" aria-hidden="true">${sealInner}</div>`
            : `<button type="button" class="env24-seal-btn" data-env24-trigger aria-label="Romper el sello de lacre 24 y abrir el Sobre Secreto">${sealInner}</button>`}

          <div class="env24-fx-layer" aria-hidden="true">
            ${shards.map((s) => `<span class="env24-shard" style="--sx:${s.sx};--sy:${s.sy};--sr:${s.sr};--sz:${s.sz};--sc:${s.sc};--dl:${s.dl};--br:${s.br};"></span>`).join("")}
            ${sparks.map((p) => `<span class="env24-spark" style="--x:${p.x};--sz:${p.sz};--dl:${p.dl};"></span>`).join("")}
          </div>
        </div>
      </div>`;
  }

  function renderSecretEnvelopeSealedHtml(gift, opts = {}) {
    const uid = opts.uid || "day24";
    const isPreview = Boolean(opts.isPreview);
    return `
      <div class="glass-card secret-envelope-sealed" id="${esc(opts.cardId || "secret-envelope-card")}" data-env24-root="${esc(uid)}">
        <span class="badge badge-gold">${getSvg("gift")} ${esc(gift.badge)}</span>
        ${buildEnv24StageMarkup(gift, uid, false)}
        <div class="env24-tap-caption">Toca el sello de lacre para abrir</div>
        <h2 ${isPreview ? `id="adv-modal-title"` : ""} class="serif" style="font-size:1.5rem;margin:2px 0 6px;">Tenéis un Sobre Secreto de Nochebuena</h2>
        <p class="day-story" style="margin-bottom:14px;">${isPreview ? "Vista previa interactiva de cómo lo verá Patri el 24 de diciembre (no altera la partida real)." : "Con el expediente oficialmente cerrado, ya podéis romper el último sello de Navidad."}</p>
        <button type="button" class="btn btn-primary" data-env24-trigger id="${esc(opts.btnId || "open-secret-envelope-btn")}" style="width:100%;">Romper sello y abrir sobre</button>
      </div>`;
  }

  function renderGiftRevealCardHtml(gift, opts = {}) {
    const isPreview = Boolean(opts.isPreview);
    const cornerSvg = `<svg viewBox="0 0 26 26" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.35" aria-hidden="true"><path d="M2 18 V4 Q2 2 4 2 H18"/><path d="M6 12 V6 H12" stroke-opacity="0.55"/><circle cx="7.5" cy="7.5" r="1.4" fill="currentColor"/></svg>`;
    return `
      <div class="glass-card gift-reveal-card" id="${esc(opts.cardId || "secret-envelope-card")}">
        <span class="gift-corner-ornament tl" aria-hidden="true">${cornerSvg}</span>
        <span class="gift-corner-ornament tr" aria-hidden="true">${cornerSvg}</span>
        <span class="gift-corner-ornament bl" aria-hidden="true">${cornerSvg}</span>
        <span class="gift-corner-ornament br" aria-hidden="true">${cornerSvg}</span>
        <div class="gift-reveal-head">
          <span class="badge badge-gold">${getSvg("gift")} ${esc(gift.badge)}</span>
          <span class="gift-keepsake-seal" aria-hidden="true">24</span>
        </div>
        <h2 ${isPreview ? `id="adv-modal-title"` : ""} class="serif" style="font-size:1.65rem;margin:10px 0 8px;">${esc(gift.title)}</h2>
        ${(gift.message || []).map((p) => `<p class="day-story" style="margin-bottom:8px;">${esc(p)}</p>`).join("")}
        <div class="gift-voucher">
          <div class="mono" style="font-size:0.78rem;color:var(--adv-gold-soft);font-weight:700;margin-bottom:6px;">${esc(gift.voucherTitle)}</div>
          <p style="font-size:0.9rem;line-height:1.55;color:var(--vg-text-primary);">${esc(gift.voucherDescription)}</p>
        </div>
        <p class="serif" style="margin-top:14px;font-size:1.12rem;font-style:italic;color:var(--adv-gold-soft);">${esc(gift.footerNote)}</p>
        ${!isPreview ? `<button type="button" class="btn btn-sm btn-ghost" id="replay-secret-envelope-btn" style="margin-top:12px;">Volver a ver apertura del sobre</button>` : ""}
      </div>`;
  }

  function playSecretEnvelopeTheater(gift, onUnveil) {
    const layer = document.getElementById("cinema-fx-layer");
    if (typeof window.AudioFX.envelopeOpenSymphony === "function") {
      window.AudioFX.envelopeOpenSymphony();
    } else {
      window.AudioFX.waxSealBreak?.();
    }
    if (!layer || isReducedMotionPref()) {
      if (window.triggerGoldBurst) window.triggerGoldBurst(72);
      if (typeof onUnveil === "function") onUnveil();
      return;
    }

    if (typeof cinemaActiveCleanup === "function") cinemaActiveCleanup();
    let unveiled = false;
    let finished = false;
    const timers = [];
    const unveilOnce = () => {
      if (unveiled) return;
      unveiled = true;
      if (typeof onUnveil === "function") onUnveil();
    };
    const cleanup = (skipToUnveil = false) => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      if (skipToUnveil) unveilOnce();
      layer.classList.remove("active", "closing");
      layer.setAttribute("aria-hidden", "true");
      layer.innerHTML = "";
      layer.onclick = null;
      if (cinemaActiveCleanup === cleanup) cinemaActiveCleanup = null;
    };
    cinemaActiveCleanup = cleanup;

    layer.innerHTML = `
      <div class="env24-theater-bokeh" aria-hidden="true"></div>
      <div class="env24-theater">
        <div class="env24-theater-kicker">NOCHEBUENA · 24 DE DICIEMBRE</div>
        <div class="env24-theater-headline">Abriendo el Sobre Secreto</div>
        ${buildEnv24StageMarkup(gift, "theater", true)}
        <div class="env24-theater-sub">Toca para continuar</div>
      </div>`;

    layer.setAttribute("aria-hidden", "false");
    layer.classList.remove("closing");
    layer.classList.add("active");

    const openedAt = Date.now();
    layer.onclick = () => {
      if (Date.now() - openedAt < 450) return;
      cleanup(true);
    };

    timers.push(setTimeout(() => { if (window.triggerGoldBurst) window.triggerGoldBurst(96); }, 600));
    timers.push(setTimeout(() => { if (window.triggerGoldBurst) window.triggerGoldBurst(64); }, 1720));
    timers.push(setTimeout(() => { unveilOnce(); }, 2820));
    timers.push(setTimeout(() => { layer.classList.add("closing"); }, 2940));
    timers.push(setTimeout(() => { cleanup(false); }, 3240));
  }

  function wireSecretEnvelopeInteractive(rootEl, onOpened) {
    if (!rootEl) return;
    let started = false;
    const gift = window.GIFT_CONFIG?.finalGiftReveal;
    const triggers = rootEl.querySelectorAll("[data-env24-trigger]");
    const handleOpen = () => {
      if (started || !gift) return;
      started = true;
      triggers.forEach((b) => { b.disabled = true; });
      playSecretEnvelopeTheater(gift, onOpened);
    };
    triggers.forEach((b) => b.addEventListener("click", handleOpen));
  }

  function openSecretEnvelopePreviewModal(triggerEl) {
    const gift = window.GIFT_CONFIG?.finalGiftReveal;
    if (!gift) return;
    const renderSealed = (fromHist = false) => {
      showModal(`
        <span class="badge badge-gold" style="margin-bottom:10px;">MODO TEST · VISTA PREVIA DEL SOBRE</span>
        ${renderSecretEnvelopeSealedHtml(gift, { uid: "preview", isPreview: true, cardId: "preview-envelope-card", btnId: "preview-open-env-now" })}
        <button type="button" class="btn btn-ghost" style="width:100%;margin-top:12px;" id="close-modal-btn">Cerrar vista previa</button>
      `, triggerEl, { fromHistory: fromHist });
      wireSecretEnvelopeInteractive(document.getElementById("preview-envelope-card"), () => renderOpened());
      document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
    };
    const renderOpened = () => {
      showModal(`
        <span class="badge badge-gold" style="margin-bottom:10px;">MODO TEST · VISTA PREVIA ABIERTA</span>
        ${renderGiftRevealCardHtml(gift, { isPreview: true, cardId: "preview-envelope-card" })}
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button type="button" class="btn btn-sm btn-frost" style="flex:1;" id="preview-reseal-env-btn">Ver sellado otra vez</button>
          <button type="button" class="btn btn-sm btn-ghost" style="flex:1;" id="close-modal-btn">Cerrar</button>
        </div>
      `, triggerEl, { fromHistory: true });
      document.getElementById("preview-reseal-env-btn")?.addEventListener("click", () => renderSealed(true));
      document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
    };
    renderSealed(false);
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

  function openRitualPreviewModal(triggerEl) {
    const catalog = window.DoorRituals?.CATALOG || [];
    const daysByNum = new Map((window.ADVENT_DAYS || []).map((d) => [Number(d.day), d]));
    const cardsHtml = catalog.map((item) => {
      const numStr = String(item.day).padStart(2, "0");
      return `
        <button type="button" class="ritual-preview-btn" data-preview-ritual-day="${item.day}">
          <span class="ritual-preview-num" style="color:${esc(item.accent)};">PUERTA ${numStr}</span>
          <span class="ritual-preview-name">${esc(item.label)}</span>
        </button>`;
    }).join("");

    showModal(`
      <span class="badge badge-gold">MODO TEST · SIN SPOILERS</span>
      <h2 id="adv-modal-title" class="serif" style="font-size:1.55rem;margin:8px 0 6px;">Previsualizar 24 Rituales de Apertura</h2>
      <p class="day-story" style="font-size:0.84rem;margin-bottom:12px;">
        Toca cualquier puerta para ver su animación y escuchar su firma sonora a pantalla completa sin abrir ni alterar la partida real.
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
        <button type="button" class="btn btn-sm btn-primary" id="preview-dlock-btn">Probar Doble Candado</button>
        ${window.GIFT_CONFIG?.finalGiftReveal?.enabled ? `<button type="button" class="btn btn-sm btn-gold" id="preview-secret-envelope-btn">Probar Sobre Secreto</button>` : ""}
      </div>
      <div class="ritual-preview-grid">${cardsHtml}</div>
    `, triggerEl);

    document.getElementById("preview-dlock-btn")?.addEventListener("click", () => {
      playDoubleLockCinema(1, {
        force: true,
        kicker: "VISTA PREVIA · SINCRONIZACIÓN",
        headline: "DOBLE CANDADO ABIERTO",
        subline: "MIGUEL Y PATRI SINCRONIZADOS"
      });
    });

    document.getElementById("preview-secret-envelope-btn")?.addEventListener("click", (e) => {
      openSecretEnvelopePreviewModal(e.currentTarget);
    });

    document.querySelectorAll("[data-preview-ritual-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dNum = Number(btn.dataset.previewRitualDay || 1);
        const dayObj = daysByNum.get(dNum) || { day: dNum, title: `Puerta ${String(dNum).padStart(2, "0")}` };
        playDoorWaxUnseal(dayObj, null, { previewOnly: true });
      });
    });
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
      <button type="button" class="btn btn-sm btn-gold" id="admin-preview-rituals-btn">Probar 24 aperturas</button>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-reset-btn" style="color:#FDA4AF;border-color:rgba(255,45,85,0.4);">Resetear partida test</button>
      <button type="button" class="btn btn-sm btn-ghost" id="admin-exit-btn">Salir test</button>
    `;

    document.getElementById("admin-switch-role-btn")?.addEventListener("click", () => applyRoleSwitch(otherRole));
    document.getElementById("admin-preview-rituals-btn")?.addEventListener("click", (e) => openRitualPreviewModal(e.currentTarget));

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
      updateDockIndicator();
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
      updateDockIndicator();
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
            Store.removeItem(UNSEALED_DOORS_KEY);
            Store.removeItem(GIFT_ENVELOPE_OPEN_KEY);
          } catch (_) {}
          celebratedLockDays.clear();
          expedienteTab = "case";
          suspectsTab = "cards";
          suspectSort = "recent";
          suspectWithNotesOnly = false;
          suspectPinnedOnly = false;
          suspectStanceFilter = "all";
          suspectFiltersExtraOpen = false;
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
    const prevHeroBriefingMount = document.getElementById("hero-briefing-mount");
    const preservedHeroVideo = prevHeroBriefingMount ? prevHeroBriefingMount.querySelector("video") : null;
    if (preservedHeroVideo && preservedHeroVideo.parentNode) {
      preservedHeroVideo.parentNode.removeChild(preservedHeroVideo);
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

    const myFlag = role === "miguel" ? "miguelSolved" : "patriSolved";
    const partnerFlag = role === "miguel" ? "patriSolved" : "miguelSolved";
    const partnerWaitingDays = [];
    const meWaitingDays = [];
    for (let dNum = 1; dNum <= maxOpen; dNum++) {
      const ds = syncState.days?.[String(dNum)];
      if (!ds || ds.solved) continue;
      if (ds[partnerFlag] && !ds[myFlag]) partnerWaitingDays.push(dNum);
      else if (ds[myFlag] && !ds[partnerFlag]) meWaitingDays.push(dNum);
    }
    const partnerBannerHtml = partnerWaitingDays.length
      ? `
        <div class="glass-card partner-waiting-banner">
          <div style="flex:1;min-width:190px;font-size:0.8rem;line-height:1.42;color:#FEF3C7;">
            <strong>${esc(partnerName)} ya validó su mitad del Día ${String(partnerWaitingDays[0]).padStart(2, "0")}.</strong> Solo faltas tú para abrir el Doble Candado.
          </div>
          <button type="button" class="btn btn-sm btn-gold" data-open-day="${partnerWaitingDays[0]}">Completar Día ${String(partnerWaitingDays[0]).padStart(2, "0")}</button>
        </div>`
      : meWaitingDays.length
        ? `
          <div class="glass-card partner-waiting-banner is-mine">
            <div style="flex:1;min-width:190px;font-size:0.78rem;line-height:1.4;color:#BAE6FD;">
              <strong>Tu parte del Día ${String(meWaitingDays[0]).padStart(2, "0")} está lista.</strong> Esperando a que ${esc(partnerName)} valide su móvil para abrir el Doble Candado.
            </div>
            <button type="button" class="btn btn-sm btn-frost" data-open-day="${meWaitingDays[0]}">Ver Día ${String(meWaitingDays[0]).padStart(2, "0")}</button>
          </div>`
        : "";

    container.innerHTML = `
      <div class="glass-card hero-dossier">
        <svg class="hero-star-watermark" width="96" height="96" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.5 5.8 21 7 14 2 9.3 9 8.5"/>
        </svg>
        <div id="hero-briefing-mount" class="briefing-native-mount hero-briefing-mount">
          ${preservedHeroVideo ? "" : renderBriefingVideoHtml("briefing-video-hero")}
        </div>
        <div class="hero-meta-col">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
            <span class="badge badge-gold">${esc(gift.editionLabel)}</span>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span data-sync-slot>${getSyncBadgeHtml()}</span>
              <button type="button" id="hero-mute-btn" class="btn btn-sm btn-ghost">${window.AudioFX.isMuted() ? "Audio OFF" : "Audio ON"}</button>
            </div>
          </div>
          <p class="hero-status-line">
            <span class="mono" style="color:var(--adv-gold-soft);margin-right:6px;">${esc(window.CASE_LORE.caseCode)}</span>
            ${maxOpen === 0
              ? `<strong style="color:var(--adv-gold-soft);" data-live-countdown="predec-dot">${esc(window.DateGate.getCountdownText())}.</strong>`
              : (maxOpen < 24 && solvedCount >= maxOpen && window.DateGate.getNextDoorCountdownText?.())
                ? `Al día hasta el <strong>${maxOpen} de diciembre</strong> · <strong style="color:var(--adv-gold-soft);" data-live-countdown="next-door">${esc(window.DateGate.getNextDoorCountdownText())}</strong>`
                : `Puertas abiertas hasta el <strong>${maxOpen} de diciembre</strong>.`}
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
              <button type="button" class="btn btn-sm btn-primary" id="hero-open-briefing-btn">Reproducir Briefing</button>
              <button type="button" class="btn btn-sm btn-frost" id="hero-open-rules-btn">Manual de Campo</button>
            </div>
          `}
        </div>
      </div>

      ${showPwaTip ? `
        <div class="glass-card pwa-tip-bar">
          <div class="pwa-tip-text">
            <strong style="color:var(--adv-frost);">Instalar app:</strong> <em>Compartir → Añadir a inicio</em> (iOS) o <em>Instalar</em> (Chrome) para pantalla completa y caché offline.
          </div>
          <button type="button" class="btn btn-sm btn-ghost" id="dismiss-pwa-banner" style="flex-shrink:0;">Ocultar</button>
        </div>
      ` : ""}

      ${partnerBannerHtml}

      <div class="section-head" style="margin-bottom:10px;">
        <div>
          <h2 class="section-title">Calendario de Adviento (1–24 de diciembre)</h2>
          ${maxOpen > 0 ? `<div class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);margin-top:2px;">Toca una puerta desbloqueada para romper el lacre</div>` : ""}
        </div>
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

    if (preservedHeroVideo) {
      document.getElementById("hero-briefing-mount")?.appendChild(preservedHeroVideo);
    }
    wireBriefingVideoControls(document.getElementById("hero-briefing-mount"));

    document.getElementById("hero-role-btn")?.addEventListener("click", () => openIdentityOverlay());

    document.getElementById("hero-mute-btn")?.addEventListener("click", () => {
      toggleGlobalAudio();
    });

    document.getElementById("hero-cta-day")?.addEventListener("click", (e) => {
      const target = Number(e.currentTarget.dataset.day || 1);
      openAdventDay(target);
    });

    document.getElementById("hero-open-briefing-btn")?.addEventListener("click", () => {
      const vid = document.getElementById("briefing-video-hero");
      if (vid) {
        vid.scrollIntoView({ behavior: "smooth", block: "center" });
        vid.play().catch(() => {});
      }
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
        openAdventDay(Number(btn.dataset.openDay));
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
    const sameDayRerender = Number(container.dataset.renderedDay || 0) === selectedDayNum;
    const prevDispatchOpen = sameDayRerender && Boolean(document.getElementById("day-dispatch-details")?.open);
    const prevScratchOpen = sameDayRerender && Boolean(container.querySelector(".widget-scratchpad")?.open);
    const prevContextOpen = sameDayRerender && Boolean(document.getElementById("day-context-details")?.open);
    const prevDispatchDraft = sameDayRerender ? document.getElementById("dispatch-input")?.value : undefined;
    const ae = document.activeElement;
    const prevFocusState = sameDayRerender && ae && container.contains(ae) && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && ae.id
      ? { id: ae.id, start: ae.selectionStart, end: ae.selectionEnd }
      : null;
    lastDaySignature = sig;
    container.dataset.renderedDay = String(selectedDayNum);

    const dayObj = (window.ADVENT_DAYS || []).find((x) => x.day === selectedDayNum);
    if (!dayObj) return;

    if (!window.DateGate.isDayOpen(dayObj.day)) {
      const countdown = window.DateGate.getCountdownText();
      container.innerHTML = `
        <div class="glass-card" style="padding:26px 20px;text-align:center;">
          <span class="badge badge-gold" data-live-countdown="predec" style="margin-bottom:10px;">${esc(countdown)}</span>
          <div style="color:var(--adv-gold-soft);margin:6px 0 8px;">${getSvg("lock")}</div>
          <h2 class="day-title">Puerta ${String(dayObj.day).padStart(2, "0")} precintada</h2>
          <p class="day-story">Esta prueba se desbloqueará automáticamente el <strong>${dayObj.day} de diciembre</strong>. Mientras tanto podéis ver el Vídeo Briefing en portada o repasar el Manual de Campo.</p>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:16px;">
            <button type="button" class="btn btn-sm btn-primary" id="locked-go-briefing-btn">Ver Vídeo Briefing</button>
            <button type="button" class="btn btn-sm btn-frost" id="locked-open-rules-btn">Manual de Campo</button>
            <button type="button" class="btn btn-sm btn-ghost" data-back-cal>Calendario</button>
          </div>
        </div>`;
      container.querySelector("[data-back-cal]")?.addEventListener("click", () => switchTab("calendar"));
      document.getElementById("locked-open-rules-btn")?.addEventListener("click", () => openRulesModal());
      document.getElementById("locked-go-briefing-btn")?.addEventListener("click", () => {
        switchTab("calendar", { scrollToTop: true });
        setTimeout(() => {
          const vid = document.getElementById("briefing-video-hero");
          if (vid) {
            vid.scrollIntoView({ behavior: "smooth", block: "center" });
            vid.play().catch(() => {});
          }
        }, 120);
      });
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
      const hideOnClosingPrint = dayObj.day === 24 && syncState.finalVerdictSolved ? " print-hide-on-closing" : "";
      validationHtml = `
        <div class="glass-card answer-card${hideOnClosingPrint}" style="border:${suspect ? "var(--vg-border-pine)" : "var(--vg-border-gold)"};">
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
        const envelopeOpened = Store.getItem(GIFT_ENVELOPE_OPEN_KEY) === "1";
        const totalSolvedFinal = Object.values(syncState.days || {}).filter((d) => d && d.solved).length;
        const totalHintsFinal = Object.values(syncState.hintsUnlocked || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);
        const ratedFinal = Object.keys(syncState.suspectNotes || {}).length;
        const rankLabel = totalHintsFinal <= 12
          ? "Inspectora Jefe · Rango Oro"
          : totalHintsFinal <= 30
            ? "Equipo Forense · Rango Plata"
            : "Detectives del Ventisquero · Rango Bronce";

        const diplomaHtml = `
          <div class="glass-card adv-diploma-card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="badge badge-gold">RESUMEN DE VUESTRO ADVIENTO</span>
              <span class="mono" style="font-size:0.72rem;color:#A7F3D0;">${esc(rankLabel)}</span>
            </div>
            <h3 class="serif" style="font-size:1.35rem;margin:8px 0 4px;">Miguel y Patri · Expediente Resuelto</h3>
            <div class="adv-diploma-grid">
              <div class="adv-diploma-stat">
                <span class="adv-diploma-val">${totalSolvedFinal}/24</span>
                <span class="adv-diploma-lbl">Puertas resueltas</span>
              </div>
              <div class="adv-diploma-stat">
                <span class="adv-diploma-val">${totalHintsFinal}/72</span>
                <span class="adv-diploma-lbl">Pistas usadas</span>
              </div>
              <div class="adv-diploma-stat">
                <span class="adv-diploma-val">${ratedFinal}</span>
                <span class="adv-diploma-lbl">Fichas anotadas</span>
              </div>
            </div>
          </div>`;

        const giftCardHtml = gift && gift.enabled === true
          ? (envelopeOpened
            ? renderGiftRevealCardHtml(gift, { isPreview: false, cardId: "secret-envelope-card" })
            : renderSecretEnvelopeSealedHtml(gift, { uid: "day24", isPreview: false, cardId: "secret-envelope-card", btnId: "open-secret-envelope-btn" }))
          : "";
        const archiveRemaining = (() => {
          const dayDiscards = new Set(Object.values(syncState.days || {}).map((d) => d?.discardId).filter(Boolean));
          return (window.SUSPECTS_DATA || []).filter((s) => !dayDiscards.has(s.id));
        })();
        finalTrialHtml = `
          <div class="print-closing-header">
            <div class="print-closing-kicker">UOPJ · ${esc(window.CASE_LORE.caseCode)} · ACTA OFICIAL DE CIERRE</div>
            <div class="print-closing-title">ADVIENTO CERO — El Misterio del Ventisquero</div>
            <div class="print-closing-sub">Equipo investigador: Miguel y Patri · Expediente cerrado el 24 de diciembre</div>
          </div>
          <div class="glass-card answer-card" style="border:var(--vg-border-pine);">
            <span class="badge badge-pine">${esc(ep.title || "CASO CERRADO")}</span>
            <h3 style="margin:10px 0 8px;font-size:1.2rem;">Culpable arrestado/a: ${esc(ep.culpritName || "")}</h3>
            <p class="day-story">${esc(ep.confession || "")}</p>
            <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
              <button type="button" class="btn btn-sm btn-gold" id="print-closing-btn">Acta Oficial de Cierre</button>
              <button type="button" class="btn btn-sm btn-ghost" id="show-final-archive-btn">Ver evidencias finales</button>
            </div>
          </div>
          ${diplomaHtml}
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
              <button type="button" class="btn btn-sm btn-ghost" id="day-replay-ritual-btn" title="Volver a ver animación de apertura">Ver apertura</button>
              ${maxOpen > 1 ? `
                <select id="day-quick-jump" class="adv-select" style="width:auto;min-height:42px;padding:6px 10px;font-size:16px;" aria-label="Saltar a puerta">
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
            <details class="context-brief-box" id="day-context-details" ${prevContextOpen ? "open" : ""}>
              <summary class="mono context-brief-head">CONTEXTO DE LA DILIGENCIA · MOTIVO Y COARTADA</summary>
              <ul class="context-brief-list">
                <li><strong>Motivo de sospecha:</strong> ${esc(dayObj.dossierContext.focus)}</li>
                <li><strong>Coartada en duda:</strong> ${esc(dayObj.dossierContext.alibi)}</li>
                <li><strong>Objetivo de esta prueba:</strong> ${esc(dayObj.dossierContext.goal)}</li>
              </ul>
            </details>
          ` : ""}
          ${focusSuspect ? `
            <button type="button" class="day-focus-suspect" data-day-focus-suspect="${esc(focusSuspect.id)}" style="margin-top:10px;">
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

        <div class="cross-peek-bar">
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-ghost" data-peek-sheet="suspects">Sospechosos</button>
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

        <div class="glass-card day-hints-card" style="padding:16px;">
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

    document.getElementById("day-mute-btn")?.addEventListener("click", () => {
      toggleGlobalAudio();
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

    document.getElementById("day-replay-ritual-btn")?.addEventListener("click", () => {
      window.AudioFX.stopMorse?.();
      playDoorWaxUnseal(dayObj, null, { previewOnly: true });
    });

    const envCardEl = document.getElementById("secret-envelope-card");
    if (envCardEl && envCardEl.classList.contains("secret-envelope-sealed")) {
      wireSecretEnvelopeInteractive(envCardEl, () => {
        try { Store.setItem(GIFT_ENVELOPE_OPEN_KEY, "1"); } catch (_) {}
        lastDaySignature = "";
        renderDayView(true);
      });
    }
    document.getElementById("replay-secret-envelope-btn")?.addEventListener("click", () => {
      const g = window.GIFT_CONFIG?.finalGiftReveal;
      if (g) playSecretEnvelopeTheater(g);
    });

    document.getElementById("day-quick-jump")?.addEventListener("change", (e) => {
      const target = Number(e.target.value);
      if (target >= 1 && target <= 24 && window.DateGate.isDayOpen(target)) {
        window.AudioFX.stopMorse?.();
        openAdventDay(target);
      }
    });

    container.querySelectorAll("[data-day-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = selectedDayNum + Number(btn.dataset.dayNav);
        if (next >= 1 && next <= 24 && window.DateGate.isDayOpen(next)) {
          window.AudioFX.stopMorse?.();
          openAdventDay(next);
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
        const prevDs = syncState.days?.[String(dayObj.day)] || {};
        const partnerFlag = role === "miguel" ? "patriSolved" : "miguelSolved";
        const completesNow = dayObj.mode !== "dual-lock" || Boolean(prevDs[partnerFlag]);
        if (completesNow) {
          playDoubleLockCinema(dayObj.day, { isJoint: dayObj.mode !== "dual-lock" });
        } else {
          if (typeof window.AudioFX.sealBreak === "function") window.AudioFX.sealBreak();
          else window.AudioFX.success();
          if (window.triggerGoldBurst) window.triggerGoldBurst(34);
        }
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
            playDoubleLockCinema(24, {
              isJoint: true,
              force: true,
              kicker: "VEREDICTO DEFINITIVO",
              headline: "CASO RESUELTO",
              subline: "NOCHEBUENA · ORDEN DE DETENCIÓN EMITIDA"
            });
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
      let peekFloor = expedienteFloor || "Planta 1";
      const renderPeekMap = () => {
        const zone = (lore.hotelZones || []).find((z) => z.floor === peekFloor);
        const bpSlot = document.getElementById("peek-map-blueprint");
        const txtSlot = document.getElementById("peek-map-zone-desc");
        if (bpSlot) bpSlot.innerHTML = renderFloorBlueprintSvg(peekFloor);
        if (txtSlot && zone) txtSlot.innerHTML = `<strong>${esc(zone.floor)} · ${esc(zone.zone)}:</strong> ${esc(zone.note)}`;
        document.querySelectorAll("[data-peek-floor]").forEach((b) => b.classList.toggle("active", b.dataset.peekFloor === peekFloor));
      };
      showModal(`
        <span class="badge badge-frost">CONSULTA RÁPIDA · PLANO DEL HOTEL</span>
        <h3 id="adv-modal-title" class="serif" style="font-size:1.45rem;margin:8px 0 10px;">Plano Interactivo por Plantas</h3>
        <div class="suspect-filters" style="margin-bottom:10px;">
          ${["Planta 3", "Planta 2", "Planta 1", "Sótano / Anexo"].map((fl) => `
            <button type="button" class="filter-chip ${peekFloor === fl ? "active" : ""}" data-peek-floor="${fl}">${fl}</button>
          `).join("")}
        </div>
        <div id="peek-map-blueprint" class="floor-blueprint-wrap">${renderFloorBlueprintSvg(peekFloor)}</div>
        <p id="peek-map-zone-desc" class="day-story" style="font-size:0.84rem;"></p>
        <button type="button" class="btn btn-primary" style="width:100%;margin-top:14px;" id="close-modal-btn">Volver al enigma</button>
      `, triggerEl);
      renderPeekMap();
      document.querySelectorAll("[data-peek-floor]").forEach((b) => {
        b.addEventListener("click", () => {
          peekFloor = b.dataset.peekFloor;
          window.AudioFX.click();
          renderPeekMap();
        });
      });
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

  function countExtraSuspectFilters() {
    let n = 0;
    if (suspectGroupFilter !== "all") n += 1;
    if (suspectFloorFilter !== "all") n += 1;
    if (suspectWithNotesOnly) n += 1;
    if (suspectPinnedOnly) n += 1;
    if (suspectStanceFilter !== "all") n += 1;
    return n;
  }

  function applySuspectFilterOnly() {
    const container = document.getElementById("view-suspects");
    if (!container) return;
    container.querySelectorAll("[data-filter]").forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === suspectFilter));

    const extraBtn = document.getElementById("toggle-extra-filters-btn");
    const extraCount = countExtraSuspectFilters();
    if (extraBtn) {
      extraBtn.textContent = extraCount > 0 ? `Filtros (${extraCount})` : "Más filtros";
      extraBtn.classList.toggle("active", suspectFiltersExtraOpen || extraCount > 0);
      extraBtn.setAttribute("aria-expanded", suspectFiltersExtraOpen ? "true" : "false");
    }

    const grpSel = document.getElementById("suspect-group-select");
    if (grpSel && grpSel.value !== suspectGroupFilter) grpSel.value = suspectGroupFilter;
    const flrSel = document.getElementById("suspect-floor-select");
    if (flrSel && flrSel.value !== suspectFloorFilter) flrSel.value = suspectFloorFilter;

    const notesChip = document.getElementById("suspect-notes-filter-chip");
    if (notesChip) {
      notesChip.classList.toggle("active", suspectWithNotesOnly);
      notesChip.setAttribute("aria-pressed", suspectWithNotesOnly ? "true" : "false");
    }
    const pinnedChip = document.getElementById("suspect-pinned-filter-chip");
    if (pinnedChip) {
      pinnedChip.classList.toggle("active", suspectPinnedOnly);
      pinnedChip.setAttribute("aria-pressed", suspectPinnedOnly ? "true" : "false");
    }
    const stanceChip = document.getElementById("suspect-stance-filter-chip");
    if (stanceChip) {
      const on = suspectStanceFilter === "sospecha";
      stanceChip.classList.toggle("active", on);
      stanceChip.setAttribute("aria-pressed", on ? "true" : "false");
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
      const isPinned = card.dataset.pinned === "1";
      const isSuspected = card.dataset.suspected === "1";
      const hay = (card.dataset.search || "").toLowerCase();
      const hideStatus = (suspectFilter === "pending" && isOut) || (suspectFilter === "discarded" && !isOut);
      const hideGroup = suspectGroupFilter !== "all" && grp !== suspectGroupFilter;
      const hideFloor = suspectFloorFilter !== "all" && flr !== suspectFloorFilter;
      const hideNotes = suspectWithNotesOnly && !hasNote;
      const hidePinned = suspectPinnedOnly && !isPinned;
      const hideStance = suspectStanceFilter === "sospecha" && !isSuspected;
      const hideQuery = q && !hay.includes(q);
      const hidden = Boolean(hideStatus || hideGroup || hideFloor || hideNotes || hidePinned || hideStance || hideQuery);
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
      tab: suspectsTab,
      sort: suspectSort,
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

    if (!force && sig === lastSuspectsSignature && container.innerHTML.trim() !== "") {
      if (existingTa) {
        const remoteNotes = syncState.sharedNotes || "";
        if (document.activeElement !== existingTa) {
          if (existingTa.value !== remoteNotes) existingTa.value = remoteNotes;
        } else if (remoteNotes !== existingTa.value && remoteNotes.length > 0) {
          const conflictBox = document.getElementById("notes-remote-conflict");
          if (conflictBox) conflictBox.style.display = "flex";
        }
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
    const pinnedClues = syncState.pinnedClues || [];
    const solvedDays = Object.keys(syncState.days || {}).filter((k) => syncState.days[k]?.solved).map(Number);
    const discoveryLimit = Math.max(window.DateGate.getMaxOpenDay(), ...(solvedDays.length ? solvedDays : [0]), 0);
    const discoveredRaw = (window.SUSPECTS_DATA || []).filter((s) => (s.discoveredDay || 1) <= discoveryLimit);
    const culpritId = syncState.finalEpilogue?.culpritId;
    const isSuspectOut = (s) => discarded.includes(s.id) || Boolean(syncState.finalVerdictSolved && culpritId && s.id !== culpritId);

    const discovered = [...discoveredRaw].sort((a, b) => {
      const aOut = isSuspectOut(a) ? 1 : 0;
      const bOut = isSuspectOut(b) ? 1 : 0;
      if (aOut !== bOut) return aOut - bOut;
      if (suspectSort === "recent") {
        const dayDiff = (b.discoveredDay || 1) - (a.discoveredDay || 1);
        if (dayDiff !== 0) return dayDiff;
      }
      return Number(a.num || 0) - Number(b.num || 0);
    });

    const discardedInView = discovered.filter(isSuspectOut).length;
    const activeInView = discovered.length - discardedInView;
    const extraCount = countExtraSuspectFilters();
    const hasSharedNoteTxt = Boolean((preservedNotes || "").trim().length);
    const ratedSuspects = discovered.filter((s) => {
      const sn = syncState.suspectNotes?.[s.id] || {};
      return Boolean(sn.miguel?.note || sn.patri?.note || (sn.miguel?.stance && sn.miguel.stance !== "duda") || (sn.patri?.stance && sn.patri.stance !== "duda"));
    });

    const subtabsHtml = `
      <div class="exp-subtabs" role="tablist" aria-label="Secciones de sospechosos" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:12px;">
        <button type="button" role="tab" aria-selected="${suspectsTab === "cards"}" class="exp-subtab ${suspectsTab === "cards" ? "active" : ""}" data-suspects-tab="cards">Fichas (${discovered.length}/25)</button>
        <button type="button" role="tab" aria-selected="${suspectsTab === "notes"}" class="exp-subtab ${suspectsTab === "notes" ? "active" : ""}" data-suspects-tab="notes">Libreta${hasSharedNoteTxt || ratedSuspects.length ? ` (${ratedSuspects.length + (hasSharedNoteTxt ? 1 : 0)})` : ""}</button>
      </div>`;

    const stanceLabelMap = { sospecha: "Sospecha", duda: "Duda", inocente: "Inocente" };
    const buildStancePills = (s) => {
      const sn = syncState.suspectNotes?.[s.id] || {};
      const pills = [];
      const isPinned = pinnedClues.includes(`suspect-${s.id}`);
      if (isPinned) pills.push(`<span class="stance-pill is-pinned">Fijado en Careo</span>`);
      [["miguel", "MIG"], ["patri", "PAT"]].forEach(([rk, tag]) => {
        const entry = sn[rk];
        if (!entry) return;
        const st = entry.stance || "duda";
        const hasTxt = Boolean((entry.note || "").trim());
        if (st !== "duda" || hasTxt) {
          pills.push(`<span class="stance-pill is-${esc(st)}">${tag}: ${esc(stanceLabelMap[st] || st)}${hasTxt ? " · nota" : ""}</span>`);
        }
      });
      return pills.length ? `<div class="suspect-stance-row">${pills.join("")}</div>` : "";
    };

    const cardsPanelHtml = `
      ${discovered.length > 0 ? `
        <div class="section-head" style="margin-bottom:10px;">
          <h2 class="section-title">Sospechosos (${discovered.length}/25)</h2>
          <span class="badge ${discardedInView > 0 ? "badge-crimson" : "badge-frost"}">${activeInView} activos · ${discardedInView} descartados</span>
        </div>

        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <input type="search" id="suspect-search-input" class="adv-input" aria-label="Buscar sospechosos por nombre, rol o habitación" value="${esc(suspectSearch)}" placeholder="Buscar nombre, rol o hab..." style="min-height:44px;flex:1;min-width:0;">
          <button type="button" id="suspect-search-clear" class="btn btn-sm btn-ghost" aria-label="Limpiar búsqueda" style="display:${suspectSearch.trim() ? "inline-flex" : "none"};flex-shrink:0;">Limpiar</button>
        </div>

        <div class="suspect-filters" role="group" aria-label="Filtrar por estado">
          <button type="button" class="filter-chip ${suspectFilter === "all" ? "active" : ""}" data-filter="all">Todos (${discovered.length})</button>
          <button type="button" class="filter-chip ${suspectFilter === "pending" ? "active" : ""}" data-filter="pending">Activos (${activeInView})</button>
          <button type="button" class="filter-chip ${suspectFilter === "discarded" ? "active" : ""}" data-filter="discarded">Descartados (${discardedInView})</button>
          <button type="button" class="filter-chip ${suspectFiltersExtraOpen || extraCount > 0 ? "active" : ""}" id="toggle-extra-filters-btn" aria-expanded="${suspectFiltersExtraOpen ? "true" : "false"}">${extraCount > 0 ? `Filtros (${extraCount})` : "Más filtros"}</button>
        </div>

        <div id="suspect-extra-filters" class="glass-card" style="display:${suspectFiltersExtraOpen ? "block" : "none"};padding:10px 12px;margin-bottom:10px;">
          <div class="suspect-extra-selects">
            <select id="suspect-group-select" class="adv-select" aria-label="Filtrar por grupo">
              <option value="all" ${suspectGroupFilter === "all" ? "selected" : ""}>Grupo: Todos</option>
              <option value="Huésped" ${suspectGroupFilter === "Huésped" ? "selected" : ""}>Solo Huéspedes</option>
              <option value="Personal" ${suspectGroupFilter === "Personal" ? "selected" : ""}>Solo Personal</option>
            </select>
            <select id="suspect-floor-select" class="adv-select" aria-label="Filtrar por planta">
              <option value="all" ${suspectFloorFilter === "all" ? "selected" : ""}>Planta: Todas</option>
              <option value="Planta 3" ${suspectFloorFilter === "Planta 3" ? "selected" : ""}>Planta 3</option>
              <option value="Planta 2" ${suspectFloorFilter === "Planta 2" ? "selected" : ""}>Planta 2</option>
              <option value="Planta 1" ${suspectFloorFilter === "Planta 1" ? "selected" : ""}>Planta 1</option>
              <option value="Sótano / Anexo" ${suspectFloorFilter === "Sótano / Anexo" ? "selected" : ""}>Sótano / Anexo</option>
            </select>
          </div>
          <div class="suspect-filters" style="margin:0;">
            <button type="button" class="filter-chip ${suspectStanceFilter === "sospecha" ? "active" : ""}" id="suspect-stance-filter-chip" aria-pressed="${suspectStanceFilter === "sospecha" ? "true" : "false"}">Sospecha</button>
            <button type="button" class="filter-chip ${suspectPinnedOnly ? "active" : ""}" id="suspect-pinned-filter-chip" aria-pressed="${suspectPinnedOnly ? "true" : "false"}">Fijados</button>
            <button type="button" class="filter-chip ${suspectWithNotesOnly ? "active" : ""}" id="suspect-notes-filter-chip" aria-pressed="${suspectWithNotesOnly ? "true" : "false"}">Con notas</button>
            <button type="button" class="filter-chip active" id="suspect-sort-toggle-btn">Orden: ${suspectSort === "recent" ? "Recientes" : "Por #"}</button>
          </div>
        </div>

        ${compareIds.length > 0 ? `
          <div class="glass-card" style="padding:12px;margin-bottom:12px;border:var(--vg-border-frost);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
              <span class="badge badge-frost">COMPARADOR LADO A LADO (${compareIds.length}/3)</span>
              <button type="button" class="btn btn-sm btn-ghost" id="clear-compare-btn">Limpiar</button>
            </div>
            <div class="compare-strip">
              ${compareIds.map((cid) => {
                const cs = discovered.find((x) => x.id === cid) || (window.SUSPECTS_DATA || []).find((x) => x.id === cid);
                if (!cs) return "";
                const cOut = isSuspectOut(cs);
                const sn = syncState.suspectNotes?.[cs.id] || {};
                const mNote = sn.miguel?.note ? `M (${sn.miguel.stance}): ${sn.miguel.note}` : (sn.miguel?.stance && sn.miguel.stance !== "duda" ? `M: ${sn.miguel.stance}` : "Sin apunte de Miguel");
                const pNote = sn.patri?.note ? `P (${sn.patri.stance}): ${sn.patri.note}` : (sn.patri?.stance && sn.patri.stance !== "duda" ? `P: ${sn.patri.stance}` : "Sin apunte de Patri");
                return `
                  <div class="compare-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
                      <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                        <img src="${esc(cs.portrait)}" alt="${esc(cs.name)}" width="36" height="36" style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0;">
                        <div style="min-width:0;">
                          <strong style="font-size:0.84rem;color:#FFFBEB;display:block;">#${esc(cs.num)} ${esc(cs.name)}</strong>
                          <span class="mono" style="font-size:0.65rem;color:${cOut ? "#FCA5A5" : "var(--adv-gold-soft)"};">${cOut ? "DESCARTADO · " : ""}${esc(cs.room)}</span>
                        </div>
                      </div>
                      <button type="button" class="btn btn-sm btn-ghost" style="min-width:40px;min-height:40px;padding:0;flex-shrink:0;" data-remove-compare="${esc(cs.id)}" aria-label="Quitar ${esc(cs.name)}">×</button>
                    </div>
                    <div style="font-size:0.75rem;color:var(--vg-text-secondary);margin-bottom:4px;"><strong>Motivo:</strong> ${esc(cs.motiveHint)}</div>
                    <div style="font-size:0.75rem;color:var(--vg-text-secondary);margin-bottom:6px;"><strong>Coartada:</strong> ${esc(cs.alibiClaim)}</div>
                    <div class="mono" style="font-size:0.68rem;color:#BAE6FD;border-top:1px dashed rgba(255,255,255,0.12);padding-top:4px;">${esc(mNote)}<br>${esc(pNote)}</div>
                  </div>`;
              }).join("")}
            </div>
          </div>
        ` : ""}

        <div class="suspects-grid">
          ${discovered.map((s) => {
            const isOut = discarded.includes(s.id);
            const isCulprit = Boolean(syncState.finalVerdictSolved && culpritId && s.id === culpritId);
            const isExonerated = Boolean(syncState.finalVerdictSolved && !isCulprit);
            const floor = getRoomFloor(s.room);
            const sNotesObj = syncState.suspectNotes?.[s.id] || {};
            const hasAnyNote = Boolean((sNotesObj.miguel?.note || "").trim() || (sNotesObj.patri?.note || "").trim());
            const isPinned = pinnedClues.includes(`suspect-${s.id}`);
            const isSuspected = sNotesObj.miguel?.stance === "sospecha" || sNotesObj.patri?.stance === "sospecha";
            const statusPill = isCulprit
              ? `<span class="badge badge-gold" style="padding:2px 7px;font-size:0.65rem;">CULPABLE</span>`
              : (isOut || isExonerated)
                ? `<span class="badge badge-crimson" style="padding:2px 7px;font-size:0.65rem;">${isExonerated && !isOut ? "EXONERADO" : "DESCARTADO"}</span>`
                : `<span class="badge badge-frost" style="padding:2px 7px;font-size:0.65rem;">SOSPECHOSO</span>`;
            return `
              <button type="button" class="suspect-card ${(isOut || isExonerated) ? "is-discarded" : ""} ${isCulprit ? "is-culprit-final" : ""}" data-suspect-id="${esc(s.id)}" data-discarded="${(isOut || isExonerated) ? "1" : "0"}" data-group="${esc(s.group)}" data-floor="${esc(floor)}" data-has-note="${hasAnyNote ? "1" : "0"}" data-pinned="${isPinned ? "1" : "0"}" data-suspected="${isSuspected ? "1" : "0"}" data-search="${esc(`${s.name} ${s.role} ${s.room} ${s.alibiClaim} ${s.motiveHint}`)}">
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
                  ${buildStancePills(s)}
                </div>
              </button>`;
          }).join("")}
        </div>
        <div id="suspects-empty-state" class="glass-card" style="display:none;padding:20px;text-align:center;margin-top:8px;">
          <p class="day-story" style="margin-bottom:10px;">Ningún sospechoso coincide con los filtros o la búsqueda actual.</p>
          <button type="button" id="suspects-reset-filters-btn" class="btn btn-sm btn-frost">Mostrar todos</button>
        </div>
      ` : `
        <div class="glass-card" style="padding:22px;text-align:center;">
          <span class="badge badge-gold" style="margin-bottom:10px;">REGISTRO DE HUÉSPEDES Y PLANTILLA</span>
          <h2 class="serif" style="font-size:1.45rem;margin-bottom:8px;">25 personas aisladas en el hotel</h2>
          <p class="day-story" style="margin-bottom:12px;">Las fichas con retrato, coartada y motivo irán apareciendo progresivamente conforme desprecintéis las puertas a partir del <strong>1 de diciembre</strong>.</p>
          <div class="exp-progress-wrap" style="text-align:left;">
            <div class="exp-progress-meta"><span>Fichas descubiertas</span><span>0 / 25</span></div>
            <div class="exp-progress-track"><div class="exp-progress-fill" style="width:0%;"></div></div>
          </div>
        </div>
      `}`;

    const notesPanelHtml = `
      <div id="notes-card-anchor" class="glass-card" style="padding:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;flex-wrap:wrap;">
          <strong>Libreta Compartida (Miguel y Patri)</strong>
          <span class="mono" style="font-size:0.7rem;color:var(--vg-text-muted);" id="notes-status">${syncMode === "firebase" ? "Sincronizada en nube" : "Guardado local"}</span>
        </div>
        <div id="notes-remote-conflict" style="display:none;margin-bottom:8px;padding:8px 10px;border-radius:8px;background:rgba(251,191,36,0.14);border:var(--vg-border-gold);justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:0.78rem;">
          <span>Tu pareja acaba de actualizar la libreta.</span>
          <button type="button" class="btn btn-sm btn-gold" id="notes-merge-btn">Fusionar cambios</button>
        </div>
        <label class="sr-only" for="shared-notes-area">Libreta compartida de Miguel y Patri</label>
        <textarea id="shared-notes-area" class="adv-textarea" style="min-height:170px;" placeholder="Anotad aquí sospechas, teorías, horas clave o contradicciones compartidas...">${esc(preservedNotes)}</textarea>
      </div>

      <div class="glass-card" style="padding:16px 18px;margin-top:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">
          <h3 style="font-size:0.96rem;">Fichas valoradas o anotadas (${ratedSuspects.length})</h3>
        </div>
        ${ratedSuspects.length ? `
          <div class="notes-summary-list">
            ${ratedSuspects.map((s) => {
              const sn = syncState.suspectNotes?.[s.id] || {};
              const notesPreview = [sn.miguel?.note ? `M: ${sn.miguel.note}` : "", sn.patri?.note ? `P: ${sn.patri.note}` : ""].filter(Boolean).join(" · ");
              return `
                <button type="button" class="notes-summary-item" data-open-rated-suspect="${esc(s.id)}">
                  <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="38" height="38" loading="lazy" decoding="async">
                  <div style="min-width:0;flex:1;">
                    <div style="font-weight:700;font-size:0.84rem;color:#FFFBEB;">#${esc(s.num)} · ${esc(s.name)}</div>
                    ${notesPreview ? `<div style="font-size:0.74rem;color:var(--vg-text-secondary);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(notesPreview)}</div>` : ""}
                    ${buildStancePills(s)}
                  </div>
                </button>`;
            }).join("")}
          </div>
        ` : `<p class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);margin-top:4px;">Aún no habéis marcado posturas ni apuntes dentro de las fichas de sospechosos.</p>`}
      </div>`;

    container.innerHTML = `
      ${subtabsHtml}
      ${suspectsTab === "notes" ? notesPanelHtml : cardsPanelHtml}
    `;

    container.querySelectorAll("[data-suspects-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.suspectsTab || "cards";
        if (next === suspectsTab) return;
        flushPendingNotes();
        suspectsTab = next;
        window.AudioFX.click();
        renderSuspectsView(true);
      });
    });

    applySuspectFilterOnly();
    updateSyncBadgesOnly();

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
      suspectPinnedOnly = false;
      suspectStanceFilter = "all";
      suspectSearch = "";
      const inp = document.getElementById("suspect-search-input");
      if (inp) inp.value = "";
      applySuspectFilterOnly();
    });
    document.getElementById("toggle-extra-filters-btn")?.addEventListener("click", () => {
      suspectFiltersExtraOpen = !suspectFiltersExtraOpen;
      const box = document.getElementById("suspect-extra-filters");
      if (box) box.style.display = suspectFiltersExtraOpen ? "block" : "none";
      applySuspectFilterOnly();
    });
    document.getElementById("suspect-group-select")?.addEventListener("change", (e) => {
      suspectGroupFilter = e.target.value || "all";
      applySuspectFilterOnly();
    });
    document.getElementById("suspect-floor-select")?.addEventListener("change", (e) => {
      suspectFloorFilter = e.target.value || "all";
      applySuspectFilterOnly();
    });
    document.getElementById("suspect-notes-filter-chip")?.addEventListener("click", () => {
      suspectWithNotesOnly = !suspectWithNotesOnly;
      applySuspectFilterOnly();
    });
    document.getElementById("suspect-pinned-filter-chip")?.addEventListener("click", () => {
      suspectPinnedOnly = !suspectPinnedOnly;
      applySuspectFilterOnly();
    });
    document.getElementById("suspect-stance-filter-chip")?.addEventListener("click", () => {
      suspectStanceFilter = suspectStanceFilter === "sospecha" ? "all" : "sospecha";
      applySuspectFilterOnly();
    });
    document.getElementById("suspect-sort-toggle-btn")?.addEventListener("click", () => {
      suspectSort = suspectSort === "recent" ? "num" : "recent";
      window.AudioFX.click();
      renderSuspectsView(true);
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

    container.querySelectorAll("[data-suspect-id]").forEach((card) => {
      card.addEventListener("click", () => openSuspectModal(card.dataset.suspectId, card));
    });
    container.querySelectorAll("[data-open-rated-suspect]").forEach((btn) => {
      btn.addEventListener("click", () => openSuspectModal(btn.dataset.openRatedSuspect, btn));
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

  function renderFloorBlueprintSvg(floor) {
    if (floor === "Planta 3") {
      return `
        <svg class="floor-blueprint-svg" viewBox="0 0 340 124" aria-label="Croquis Planta 3">
          <rect x="6" y="6" width="328" height="112" rx="10" fill="#07111B" stroke="rgba(120,215,242,0.34)" stroke-width="1.2"/>
          <rect x="16" y="16" width="58" height="44" rx="5" fill="rgba(14,116,144,0.18)" stroke="#78D7F2" stroke-width="1"/>
          <text x="45" y="42" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="9" font-weight="700">301</text>
          <rect x="80" y="16" width="58" height="44" rx="5" fill="rgba(14,116,144,0.18)" stroke="#78D7F2" stroke-width="1"/>
          <text x="109" y="42" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="9" font-weight="700">302</text>
          <rect x="144" y="16" width="52" height="44" rx="5" fill="rgba(251,191,36,0.14)" stroke="#FDE68A" stroke-width="1"/>
          <text x="170" y="42" text-anchor="middle" fill="#FEF3C7" font-family="ui-monospace, monospace" font-size="9" font-weight="700">303</text>
          <rect x="202" y="16" width="58" height="44" rx="5" fill="rgba(14,116,144,0.18)" stroke="#78D7F2" stroke-width="1"/>
          <text x="231" y="42" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="9" font-weight="700">304</text>
          <rect x="266" y="16" width="58" height="44" rx="5" fill="rgba(14,116,144,0.18)" stroke="#78D7F2" stroke-width="1"/>
          <text x="295" y="42" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="9" font-weight="700">305</text>
          <rect x="16" y="68" width="214" height="20" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(148,163,184,0.28)" stroke-dasharray="3 3"/>
          <text x="123" y="81" text-anchor="middle" fill="#94A3B8" font-family="ui-monospace, monospace" font-size="8">GALERÍA SUPERIOR · ASCENSOR VIP</text>
          <rect x="238" y="68" width="86" height="38" rx="5" fill="rgba(56,189,248,0.12)" stroke="#38BDF8" stroke-dasharray="4 3"/>
          <text x="281" y="90" text-anchor="middle" fill="#BAE6FD" font-family="ui-monospace, monospace" font-size="8">TERRAZA N.</text>
          <text x="16" y="106" fill="#64748B" font-family="ui-monospace, monospace" font-size="7.5">PLANTA 3 · SUITES PRESIDENCIALES</text>
        </svg>`;
    }
    if (floor === "Planta 2") {
      return `
        <svg class="floor-blueprint-svg" viewBox="0 0 340 124" aria-label="Croquis Planta 2">
          <rect x="6" y="6" width="328" height="112" rx="10" fill="#07111B" stroke="rgba(120,215,242,0.34)" stroke-width="1.2"/>
          <rect x="16" y="16" width="136" height="38" rx="5" fill="rgba(14,116,144,0.16)" stroke="#78D7F2" stroke-width="1"/>
          <text x="84" y="38" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700">HAB. 201 – 204</text>
          <rect x="160" y="16" width="164" height="38" rx="5" fill="rgba(14,116,144,0.16)" stroke="#78D7F2" stroke-width="1"/>
          <text x="242" y="38" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700">HAB. 205 – 208</text>
          <rect x="16" y="64" width="104" height="42" rx="5" fill="rgba(251,191,36,0.14)" stroke="#FDE68A" stroke-width="1"/>
          <text x="68" y="88" text-anchor="middle" fill="#FEF3C7" font-family="ui-monospace, monospace" font-size="8.4" font-weight="700">SALA LECTURA</text>
          <rect x="128" y="64" width="96" height="42" rx="5" fill="rgba(251,191,36,0.12)" stroke="#F59E0B" stroke-width="1"/>
          <text x="176" y="88" text-anchor="middle" fill="#FDE68A" font-family="ui-monospace, monospace" font-size="8.4" font-weight="700">BIBLIOTECA</text>
          <rect x="232" y="64" width="92" height="42" rx="5" fill="rgba(52,211,153,0.14)" stroke="#34D399" stroke-width="1"/>
          <text x="278" y="88" text-anchor="middle" fill="#A7F3D0" font-family="ui-monospace, monospace" font-size="8.4" font-weight="700">ARCHIVO</text>
        </svg>`;
    }
    if (floor === "Sótano / Anexo") {
      return `
        <svg class="floor-blueprint-svg" viewBox="0 0 340 124" aria-label="Croquis Sótano y Anexo">
          <rect x="6" y="6" width="328" height="112" rx="10" fill="#07111B" stroke="rgba(120,215,242,0.34)" stroke-width="1.2"/>
          <rect x="16" y="16" width="84" height="44" rx="5" fill="rgba(251,191,36,0.14)" stroke="#FDE68A" stroke-width="1"/>
          <text x="58" y="41" text-anchor="middle" fill="#FEF3C7" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700">COCINA</text>
          <rect x="108" y="16" width="76" height="44" rx="5" fill="rgba(14,116,144,0.16)" stroke="#78D7F2" stroke-width="1"/>
          <text x="146" y="41" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700">BODEGA</text>
          <rect x="192" y="16" width="132" height="44" rx="5" fill="rgba(239,68,68,0.16)" stroke="#F87171" stroke-width="1"/>
          <text x="258" y="41" text-anchor="middle" fill="#FECACA" font-family="ui-monospace, monospace" font-size="8.6" font-weight="700">CALDERAS · SERVICIO</text>
          <rect x="16" y="68" width="196" height="38" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(148,163,184,0.38)"/>
          <text x="114" y="90" text-anchor="middle" fill="#CBD5E1" font-family="ui-monospace, monospace" font-size="8.4">ALA DE SERVICIO (A – E)</text>
          <rect x="222" y="68" width="102" height="38" rx="5" fill="rgba(56,189,248,0.14)" stroke="#38BDF8" stroke-dasharray="4 3"/>
          <text x="273" y="90" text-anchor="middle" fill="#BAE6FD" font-family="ui-monospace, monospace" font-size="8.2" font-weight="700">CABAÑA NORTE</text>
        </svg>`;
    }
    return `
      <svg class="floor-blueprint-svg" viewBox="0 0 340 124" aria-label="Croquis Planta 1">
        <rect x="6" y="6" width="328" height="112" rx="10" fill="#07111B" stroke="rgba(120,215,242,0.34)" stroke-width="1.2"/>
        <rect x="16" y="16" width="128" height="62" rx="6" fill="rgba(220,38,38,0.16)" stroke="#F87171" stroke-width="1.3"/>
        <text x="80" y="38" text-anchor="middle" fill="#FEF3C7" font-family="ui-monospace, monospace" font-size="8.8" font-weight="700">SALÓN MIRADOR</text>
        <circle cx="80" cy="57" r="5" fill="#EF4444" stroke="#FECACA" stroke-width="1.4"/>
        <text x="80" y="72" text-anchor="middle" fill="#FCA5A5" font-family="ui-monospace, monospace" font-size="7.2" font-weight="700">HALLAZGO · 23:55</text>
        <rect x="152" y="16" width="84" height="38" rx="5" fill="rgba(251,191,36,0.14)" stroke="#FDE68A" stroke-width="1"/>
        <text x="194" y="38" text-anchor="middle" fill="#FEF3C7" font-family="ui-monospace, monospace" font-size="8.4" font-weight="700">RECEPCIÓN</text>
        <rect x="244" y="16" width="80" height="38" rx="5" fill="rgba(14,116,144,0.16)" stroke="#78D7F2" stroke-width="1"/>
        <text x="284" y="38" text-anchor="middle" fill="#E0F2FE" font-family="ui-monospace, monospace" font-size="8.4" font-weight="700">SPA / CAPILLA</text>
        <rect x="152" y="60" width="172" height="18" rx="4" fill="rgba(251,191,36,0.12)" stroke="#F59E0B" stroke-dasharray="3 3"/>
        <text x="238" y="72" text-anchor="middle" fill="#FDE68A" font-family="ui-monospace, monospace" font-size="7.4" font-weight="700">PASILLO TÉCNICO · APAGÓN 23:38</text>
        <rect x="16" y="86" width="308" height="22" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(148,163,184,0.3)"/>
        <text x="170" y="100" text-anchor="middle" fill="#CBD5E1" font-family="ui-monospace, monospace" font-size="8.2">HABITACIONES 101 – 108 · DIRECCIÓN Y PORCHE ESTE</text>
      </svg>`;
  }

  function renderExpedienteView(force = false) {
    const container = document.getElementById("view-expediente");
    if (!container || !currentRole) return;

    const expSig = JSON.stringify({
      role: currentRole,
      tab: expedienteTab,
      maxOpen: window.DateGate.getMaxOpenDay(),
      days: syncState.days,
      hints: syncState.hintsUnlocked,
      dispatch: syncState.fieldDispatch,
      sNotes: syncState.suspectNotes,
      sharedNotesLen: (syncState.sharedNotes || "").length,
      pinned: syncState.pinnedClues,
      floor: expedienteFloor,
      timelineFloor: timelineFloorFilter,
      offlinePackStatus,
      fv: syncState.finalVerdictSolved,
      muted: window.AudioFX.isMuted(),
      prefs: userPrefs
    });
    if (!force && expSig === lastExpedienteSignature && container.innerHTML.trim() !== "") {
      return;
    }
    lastExpedienteSignature = expSig;

    const lore = window.CASE_LORE;
    const discarded = syncState.discardedIds || [];
    const pinnedList = syncState.pinnedClues || [];
    const solvedDaysArr = Object.entries(syncState.days || {})
      .filter(([, d]) => d && d.solved)
      .map(([k, d]) => ({ day: Number(k), ...d }))
      .sort((a, b) => a.day - b.day);
    const openInquiries = solvedDaysArr.filter((d) => !d.discardId);
    const totalHintsUsed = Object.values(syncState.hintsUnlocked || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);
    const progressPct = Math.round((solvedDaysArr.length / 24) * 100);

    const solvedDaysNums = solvedDaysArr.map((d) => d.day);
    const discoveryLimit = Math.max(window.DateGate.getMaxOpenDay(), ...(solvedDaysNums.length ? solvedDaysNums : [0]), 0);
    const discoveredSuspects = (window.SUSPECTS_DATA || []).filter((s) => (s.discoveredDay || 1) <= discoveryLimit);
    const floorSuspects = discoveredSuspects.filter((s) => getRoomFloor(s.room) === expedienteFloor);

    const subtabsHtml = `
      <div class="exp-subtabs" role="tablist" aria-label="Secciones del expediente">
        <button type="button" role="tab" aria-selected="${expedienteTab === "case"}" class="exp-subtab ${expedienteTab === "case" ? "active" : ""}" data-exp-tab="case">Atestado</button>
        <button type="button" role="tab" aria-selected="${expedienteTab === "clues"}" class="exp-subtab ${expedienteTab === "clues" ? "active" : ""}" data-exp-tab="clues">Pistas${pinnedList.length ? ` (${pinnedList.length})` : ""}</button>
        <button type="button" role="tab" aria-selected="${expedienteTab === "hotel"}" class="exp-subtab ${expedienteTab === "hotel" ? "active" : ""}" data-exp-tab="hotel">Hotel</button>
        <button type="button" role="tab" aria-selected="${expedienteTab === "settings"}" class="exp-subtab ${expedienteTab === "settings" ? "active" : ""}" data-exp-tab="settings">Ajustes</button>
      </div>`;

    const caseTabHtml = `
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
        <div class="exp-progress-wrap">
          <div class="exp-progress-meta">
            <span>Progreso del caso: <strong style="color:#FEF3C7;">${solvedDaysArr.length}/24</strong> puertas (${progressPct}%)</span>
            <span>Pistas usadas: ${totalHintsUsed}/72</span>
          </div>
          <div class="exp-progress-track">
            <div class="exp-progress-fill" style="width:${progressPct}%;"></div>
          </div>
        </div>
      </div>

      <div class="glass-card" style="padding:16px 18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
          <div>
            <h3 style="font-size:0.98rem;margin-bottom:2px;">Material Oficial del Caso</h3>
            <div class="mono" style="font-size:0.72rem;color:var(--vg-text-muted);">Vídeo briefing en portada y guía imprimible en PDF</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-primary" id="exp-go-briefing-btn">Ver Vídeo Briefing</button>
            <a href="imprimibles/PRESENTACION_ADVIENTO_CERO.pdf?v=2.15.0" target="_blank" rel="noopener noreferrer" download="PRESENTACION_ADVIENTO_CERO.pdf" class="btn btn-sm btn-gold">Dossier PDF (0,4 MB)</a>
          </div>
        </div>
      </div>`;

    const cluesTabHtml = `
      <div class="glass-card" style="padding:18px;">
        <h3 style="font-size:1rem;margin-bottom:8px;">Buscador Global y Chinchetas</h3>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <input type="search" id="exp-search-input" class="adv-input" value="${esc(expSearchQuery)}" placeholder="Buscar en días, coartadas, partes y libreta..." aria-label="Buscar en pistas, coartadas y notas" style="min-height:44px;flex:1;min-width:0;">
          <button type="button" id="exp-search-clear" class="btn btn-sm btn-ghost" style="display:${expSearchQuery.trim() ? "inline-flex" : "none"};">Limpiar</button>
        </div>
        <div id="search-results-list" class="search-results-list"></div>
        ${pinnedList.length ? `
          <div style="margin-top:10px;border-top:1px dashed rgba(255,255,255,0.12);padding-top:8px;">
            <div class="mono" style="font-size:0.7rem;color:var(--adv-gold-soft);margin-bottom:6px;">PISTAS FIJADAS CON CHINCHETA (${pinnedList.length}):</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${pinnedList.map((pid) => {
                if (pid.startsWith("day-")) {
                  const dNum = Number(pid.replace("day-", ""));
                  return `<span class="pin-chip-group"><button type="button" class="pin-chip-jump" data-jump-pinned-day="${dNum}">Día ${String(dNum).padStart(2, "0")}</button><button type="button" class="pin-chip-del" data-unpin-clue="${esc(pid)}" aria-label="Quitar Día ${dNum}">×</button></span>`;
                }
                if (pid.startsWith("suspect-")) {
                  const sid = pid.replace("suspect-", "");
                  const sp = (window.SUSPECTS_DATA || []).find((x) => x.id === sid);
                  return `<span class="pin-chip-group"><button type="button" class="pin-chip-jump" data-jump-pinned-suspect="${esc(sid)}">#${esc(sp?.num || "?")} ${esc(sp?.name || sid)}</button><button type="button" class="pin-chip-del" data-unpin-clue="${esc(pid)}" aria-label="Quitar ${esc(sp?.name || sid)}">×</button></span>`;
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
            { time: "19:00 h", floor: "Sótano / Anexo", text: "Ventisca crítica: carretera cortada y teleférico bloqueado en cota 1.940 m.", day: null },
            { time: "23:32–23:36 h", floor: "Planta 1", text: "Manipulación previa en pasillo técnico de Planta 1 antes del brindis del Salón Mirador.", day: null },
            { time: "23:38–23:42 h", floor: "Planta 1", text: "Apagón eléctrico exacto de 4 minutos durante el brindis en el Salón Mirador.", day: null },
            { time: "23:55 h", floor: "Planta 1", text: "Hallazgo sin vida de Arturo Valdivieso junto al abeto navideño.", day: null },
            ...solvedDaysArr.map((d) => {
              const susp = d.discardId ? (window.SUSPECTS_DATA || []).find((s) => s.id === d.discardId) : null;
              const flr = susp ? getRoomFloor(susp.room) : "Diligencia";
              return { time: `Día ${String(d.day).padStart(2, "0")}`, floor: flr, text: `${d.forensicTag || "Diligencia"}: ${d.conclusion}`, day: d.day };
            })
          ].filter((ev) => timelineFloorFilter === "all" || ev.floor === timelineFloorFilter)
           .map((ev) => ev.day
             ? `<button type="button" class="timeline-node timeline-node-btn" data-jump-timeline-day="${ev.day}"><strong>${esc(ev.time)}</strong> <span class="mono" style="font-size:0.68rem;color:var(--adv-gold-soft);">[${esc(ev.floor)}]</span> — ${esc(ev.text)}</button>`
             : `<div class="timeline-node"><strong>${esc(ev.time)}</strong> <span class="mono" style="font-size:0.68rem;color:var(--adv-gold-soft);">[${esc(ev.floor)}]</span> — ${esc(ev.text)}</div>`
           ).join("")}
        </div>
        ${openInquiries.length ? `
          <div class="feedback-banner success" style="margin-top:10px;border-color:rgba(251,191,36,0.45);background:rgba(251,191,36,0.10);color:#FEF3C7;">
            <strong>Diligencias sin descarte (${openInquiries.length}):</strong> ${openInquiries.map((d) => `Día ${String(d.day).padStart(2, "0")}`).join(" y ")} siguen abiertas para el Careo Final de Nochebuena.
          </div>
        ` : ""}
      </div>`;

    const hotelTabHtml = `
      <div class="glass-card" style="padding:18px;">
        <h3 style="font-size:1rem;margin-bottom:10px;">Plano Interactivo por Plantas</h3>
        <div class="suspect-filters" style="margin-bottom:10px;">
          ${["Planta 3", "Planta 2", "Planta 1", "Sótano / Anexo"].map((fl) => `
            <button type="button" class="filter-chip ${expedienteFloor === fl ? "active" : ""}" data-exp-floor="${fl}">${fl}</button>
          `).join("")}
        </div>
        <div class="floor-blueprint-wrap">${renderFloorBlueprintSvg(expedienteFloor)}</div>
        <ul class="clue-list" style="margin-bottom:12px;">
          ${lore.hotelZones.filter((z) => z.floor === expedienteFloor).map((z) => `<li><strong>${esc(z.floor)} · ${esc(z.zone)}:</strong> ${esc(z.note)}</li>`).join("")}
        </ul>
        ${floorSuspects.length ? `
          <div class="floor-suspect-grid">
            ${floorSuspects.map((s) => {
              const out = discarded.includes(s.id);
              return `
                <button type="button" class="floor-suspect-chip ${out ? "is-out" : ""}" data-exp-suspect="${esc(s.id)}">
                  <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="32" height="32" loading="lazy" decoding="async">
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:0.78rem;font-weight:700;color:#FFFBEB;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(s.name)}</div>
                    <div class="mono" style="font-size:0.65rem;color:${out ? "#FCA5A5" : "var(--adv-gold-soft)"};">${esc(s.room)}${out ? " · Out" : ""}</div>
                  </div>
                </button>`;
            }).join("")}
          </div>
        ` : `<div class="mono" style="font-size:0.74rem;color:var(--vg-text-muted);">Sin sospechosos descubiertos en esta planta todavía.</div>`}
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
      </div>`;

    const settingsTabHtml = `
      <div class="glass-card" style="padding:18px;">
        <div class="settings-group-title">Confort Visual, Audio y Nube</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-sm ${window.AudioFX.isMuted() ? "btn-ghost" : "btn-gold"}" id="pref-audio-btn">${window.AudioFX.isMuted() ? "Audio: OFF" : "Audio: ON"}</button>
          <button type="button" class="btn btn-sm btn-frost" id="pref-sync-diag-btn">Estado de Nube</button>
          <button type="button" class="btn btn-sm ${userPrefs.fontBoost ? "btn-gold" : "btn-ghost"}" id="pref-font-btn">Texto +15%: ${userPrefs.fontBoost ? "ON" : "OFF"}</button>
          <button type="button" class="btn btn-sm ${userPrefs.nightSoft ? "btn-gold" : "btn-ghost"}" id="pref-night-btn">Lectura Nocturna: ${userPrefs.nightSoft ? "ON" : "OFF"}</button>
          <button type="button" class="btn btn-sm ${userPrefs.reducedMotion ? "btn-gold" : "btn-ghost"}" id="pref-motion-btn">Animación reducida: ${userPrefs.reducedMotion ? "ON" : "OFF"}</button>
          <button type="button" class="btn btn-sm ${userPrefs.highContrastOutdoor ? "btn-gold" : "btn-ghost"}" id="pref-outdoor-btn">Contraste Solar: ${userPrefs.highContrastOutdoor ? "ON" : "OFF"}</button>
        </div>
      </div>

      <div class="glass-card" style="padding:18px;">
        <div class="settings-group-title">Archivo, Copia de Seguridad y Offline</div>
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
      </div>`;

    const activePanelHtml = expedienteTab === "clues"
      ? cluesTabHtml
      : expedienteTab === "hotel"
        ? hotelTabHtml
        : expedienteTab === "settings"
          ? settingsTabHtml
          : caseTabHtml;

    container.innerHTML = `
      <div class="day-workspace">
        ${subtabsHtml}
        ${activePanelHtml}
        <div style="text-align:center;padding:8px 0;">
          <button type="button" id="version-secret-trigger" class="mono" style="min-height:44px;padding:8px 12px;background:none;border:none;color:var(--vg-text-muted);font-size:0.74rem;cursor:pointer;">
            ${APP_VERSION} · ADVIENTO CERO · MODO CERO SPOILERS
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-exp-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextTab = btn.dataset.expTab || "case";
        if (nextTab === expedienteTab) return;
        expedienteTab = nextTab;
        window.AudioFX.click();
        renderExpedienteView(true);
      });
    });

    document.getElementById("exp-go-briefing-btn")?.addEventListener("click", () => {
      window.AudioFX.click();
      switchTab("calendar", { scrollToTop: true });
      setTimeout(() => {
        const vid = document.getElementById("briefing-video-hero");
        if (vid) {
          vid.scrollIntoView({ behavior: "smooth", block: "center" });
          vid.play().catch(() => {});
        }
      }, 120);
    });

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
        if (txt.toLowerCase().includes(q)) hits.push({ kind: "day", label: `Día ${String(d.day).padStart(2, "0")}`, text: txt, day: d.day });
      });
      discoveredSuspects.forEach((sp) => {
        const hay = `${sp.name} ${sp.role} ${sp.room} ${sp.motiveHint} ${sp.alibiClaim}`.toLowerCase();
        if (hay.includes(q)) {
          hits.push({ kind: "suspect", label: `Ficha #${sp.num} ${sp.name}`, text: `${sp.room} — ${sp.alibiClaim}`, sid: sp.id });
        }
      });
      Object.entries(syncState.fieldDispatch || {}).forEach(([dKey, entry]) => {
        ["miguel", "patri"].forEach((rk) => {
          const msg = entry?.[rk]?.text;
          if (msg && msg.toLowerCase().includes(q)) {
            hits.push({ kind: "day", label: `Parte Día ${String(dKey).padStart(2, "0")} (${rk === "miguel" ? "Miguel" : "Patri"})`, text: msg, day: Number(dKey) });
          }
        });
      });
      Object.entries(syncState.suspectNotes || {}).forEach(([sid, entry]) => {
        const sp = (window.SUSPECTS_DATA || []).find((x) => x.id === sid);
        ["miguel", "patri"].forEach((rk) => {
          const n = entry?.[rk]?.note;
          if (n && n.toLowerCase().includes(q)) {
            hits.push({ kind: "suspect", label: `Apunte ${sp ? sp.name : sid} (${rk === "miguel" ? "Miguel" : "Patri"})`, text: n, sid });
          }
        });
      });
      if ((syncState.sharedNotes || "").toLowerCase().includes(q)) {
        hits.push({ kind: "notes", label: "Libreta Compartida", text: (syncState.sharedNotes || "").slice(0, 140) });
      }
      box.innerHTML = hits.length
        ? hits.slice(0, 12).map((h, i) => `
            <button type="button" class="search-result-btn" data-hit-idx="${i}">
              <div><strong>${esc(h.label)}:</strong> ${esc(h.text)}</div>
              <span class="search-result-arrow">Abrir</span>
            </button>`).join("")
        : `<div class="mono" style="font-size:0.74rem;color:var(--vg-text-muted);">Sin coincidencias para "${esc(expSearchQuery)}".</div>`;

      box.querySelectorAll("[data-hit-idx]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const hit = hits[Number(btn.dataset.hitIdx)];
          if (!hit) return;
          window.AudioFX.click();
          if (hit.kind === "day" && hit.day) {
            selectedDayNum = hit.day;
            userPickedDay = true;
            lastDaySignature = "";
            switchTab("day", { scrollToTop: true });
          } else if (hit.kind === "suspect" && hit.sid) {
            openSuspectModal(hit.sid, btn);
          } else if (hit.kind === "notes") {
            suspectsTab = "notes";
            lastSuspectsSignature = "";
            switchTab("suspects", { scrollToTop: true });
          }
        });
      });
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
    container.querySelectorAll("[data-jump-pinned-day], [data-jump-timeline-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedDayNum = Number(btn.dataset.jumpPinnedDay || btn.dataset.jumpTimelineDay || 1);
        userPickedDay = true;
        lastDaySignature = "";
        switchTab("day", { scrollToTop: true });
      });
    });
    container.querySelectorAll("[data-jump-pinned-suspect]").forEach((btn) => {
      btn.addEventListener("click", () => openSuspectModal(btn.dataset.jumpPinnedSuspect, btn));
    });
    container.querySelectorAll("[data-unpin-clue]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.AudioFX.click();
        window.SyncEngine.togglePinnedClue(btn.dataset.unpinClue);
        showToast("Chincheta retirada.");
        renderExpedienteView(true);
      });
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

    document.getElementById("pref-audio-btn")?.addEventListener("click", () => {
      toggleGlobalAudio();
      renderExpedienteView(true);
    });
    document.getElementById("pref-sync-diag-btn")?.addEventListener("click", () => openSyncDiagModal());

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
      const totalHintsExp = Object.values(syncState.hintsUnlocked || {}).reduce((acc, v) => acc + (Number(v) || 0), 0);
      const suspectEntries = (window.SUSPECTS_DATA || []).map((s) => {
        const sn = syncState.suspectNotes?.[s.id];
        if (!sn) return null;
        const parts = [];
        ["miguel", "patri"].forEach((rk) => {
          const entry = sn[rk];
          if (!entry) return;
          const lbl = rk === "miguel" ? "Miguel" : "Patri";
          const noteTxt = String(entry.note || "").trim();
          const stTxt = entry.stance && entry.stance !== "duda" ? entry.stance.toUpperCase() : "";
          if (noteTxt || stTxt) {
            parts.push(`${lbl}${stTxt ? ` [${stTxt}]` : ""}: ${noteTxt || "Sin apunte adicional"}`);
          }
        });
        return parts.length ? `- #${s.num} ${s.name} (${s.room}): ${parts.join(" | ")}` : null;
      }).filter(Boolean);

      const lines = [
        `# DIARIO DE INVESTIGACIÓN — ADVIENTO CERO`,
        `Fecha exportación: ${new Date().toLocaleString("es-ES")}`,
        `Puertas resueltas: ${solvedDaysArr.length}/24 · Pistas usadas: ${totalHintsExp}/72`,
        ``,
        `## Resoluciones`,
        ...(solvedDaysArr.length
          ? solvedDaysArr.map((d) => `- Día ${String(d.day).padStart(2, "0")} [${d.forensicTag || "Resuelta"}]: ${d.conclusion}`)
          : [`(Sin puertas resueltas todavía)`]),
        ``,
        `## Valoraciones de Sospechosos`,
        ...(suspectEntries.length ? suspectEntries : [`(Sin valoraciones registradas)`]),
        ``,
        `## Libreta Compartida`,
        syncState.sharedNotes || "(Sin anotaciones)"
      ];

      if (syncState.finalVerdictSolved && syncState.finalEpilogue) {
        const ep = syncState.finalEpilogue;
        const rankLabel = totalHintsExp <= 12
          ? "Inspectora Jefe · Rango Oro"
          : totalHintsExp <= 30
            ? "Equipo Forense · Rango Plata"
            : "Detectives del Ventisquero · Rango Bronce";
        lines.push(
          ``,
          `## Cierre Oficial del Caso`,
          `- Veredicto: ${ep.title || "CASO CERRADO"}`,
          `- Culpable arrestado/a: ${ep.culpritName || ""}`,
          `- Rango del equipo: ${rankLabel}`,
          `- Relato final: ${ep.confession || ""}`
        );
      }
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
          "./video-briefing/poster.jpg",
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
    const solvedPair = Object.entries(syncState.days || {}).find(([, d]) => d && d.discardId === s.id && d.solved);
    const solvedDayNum = solvedPair ? Number(solvedPair[0]) : null;
    const solvedEntry = solvedPair ? solvedPair[1] : null;
    const linkedDayNum = solvedDayNum || Number(s.discoveredDay || 1);
    const canJumpDay = window.DateGate.isDayOpen(linkedDayNum);

    const sNotes = syncState.suspectNotes?.[s.id] || {};
    const mySNote = sNotes[currentRole] || { stance: "duda", note: "" };
    const partnerRole = currentRole === "miguel" ? "patri" : "miguel";
    const partnerSNote = sNotes[partnerRole];
    const badgeClass = isCulprit ? "badge-crimson" : isExonerated && !isOut ? "badge-pine" : isOut ? "badge-crimson" : "badge-gold";
    const badgeText = isCulprit ? "CULPABLE" : isExonerated && !isOut ? "EXONERADO" : isOut ? "DESCARTADO" : `FICHA #${s.num}`;
    const partnerNoteHtml = partnerSNote && (partnerSNote.note || (partnerSNote.stance && partnerSNote.stance !== "duda"))
      ? `<div class="clue-box" style="margin-top:10px;font-size:0.8rem;"><strong>${partnerRole === "miguel" ? "Miguel" : "Patri"} (${esc(partnerSNote.stance || "duda")}):</strong> ${esc(partnerSNote.note || "Sin apunte adicional.")}</div>`
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
        <button type="button" class="portrait-zoom-btn" id="modal-portrait-zoom-btn" aria-label="Ampliar retrato de ${esc(s.name)}">
          <img src="${esc(s.portrait)}" alt="${esc(s.name)}" width="82" height="82" style="width:82px;height:82px;border-radius:14px;object-fit:cover;border:var(--vg-border-specular-strong);display:block;">
        </button>
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
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
          <span class="mono" style="font-size:0.72rem;color:var(--adv-gold-soft);">Tu valoración sobre ${esc(s.name)}</span>
          <span class="mono" id="suspect-save-state" style="font-size:0.66rem;color:var(--adv-pine);"></span>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;" role="group" aria-label="Valoración de sospecha">
          ${["sospecha", "duda", "inocente"].map((st) => `
            <button type="button" class="filter-chip ${mySNote.stance === st ? "active" : ""}" data-stance="${st}" aria-pressed="${mySNote.stance === st ? "true" : "false"}">${st.toUpperCase()}</button>
          `).join("")}
        </div>
        <div style="display:flex;gap:8px;">
          <input type="text" id="suspect-note-inp" class="adv-input" aria-label="Apunte rápido de coartada" value="${esc(mySNote.note || "")}" placeholder="Apunte rápido..." style="min-height:44px;min-width:0;">
          <button type="submit" class="btn btn-sm btn-frost" style="flex-shrink:0;">Guardar</button>
        </div>
      </form>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
        <button type="button" class="btn btn-sm btn-ghost pin-clue-btn" style="flex:1;" id="modal-pin-suspect-btn" aria-pressed="${(syncState.pinnedClues || []).includes(`suspect-${s.id}`) ? "true" : "false"}">${(syncState.pinnedClues || []).includes(`suspect-${s.id}`) ? "Fijada en Careo" : "Fijar en Careo"}</button>
        <button type="button" class="btn btn-sm ${compareIds.includes(s.id) ? "btn-gold" : "btn-frost"}" style="flex:1;" id="modal-compare-suspect-btn">${compareIds.includes(s.id) ? "En comparador (quitar)" : `Comparar (${compareIds.length}/3)`}</button>
        ${canJumpDay ? `<button type="button" class="btn btn-sm btn-ghost" style="width:100%;" id="modal-jump-day-btn">${solvedDayNum ? `Ver resolución (Día ${String(solvedDayNum).padStart(2, "0")})` : `Ir al Día ${String(linkedDayNum).padStart(2, "0")}`}</button>` : ""}
      </div>
      <button type="button" class="btn btn-ghost" style="width:100%;margin-top:10px;" id="close-modal-btn">Cerrar ficha</button>
    `, triggerEl, { preserveFocus, fromHistory: preserveFocus });

    let chosenStance = mySNote.stance || "duda";
    const saveStateEl = document.getElementById("suspect-save-state");
    document.querySelectorAll("[data-stance]").forEach((b) => {
      b.addEventListener("click", () => {
        chosenStance = b.dataset.stance;
        window.AudioFX.click();
        document.querySelectorAll("[data-stance]").forEach((x) => {
          const on = x === b;
          x.classList.toggle("active", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });
        const inp = document.getElementById("suspect-note-inp");
        window.SyncEngine.saveSuspectNote(s.id, currentRole, chosenStance, inp ? inp.value : "");
        if (saveStateEl) saveStateEl.textContent = "Guardado";
      });
    });
    document.getElementById("modal-portrait-zoom-btn")?.addEventListener("click", (e) => {
      window.AudioFX.click();
      openImageLightbox(s.portrait, `#${s.num} · ${s.name} (${s.role})`, e.currentTarget);
    });
    document.getElementById("modal-jump-day-btn")?.addEventListener("click", () => {
      window.AudioFX.click();
      closeModal();
      openAdventDay(linkedDayNum);
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
      if (saveStateEl) saveStateEl.textContent = "Guardado";
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

    const bulkChangedDays = Object.keys(newSt.days || {}).filter((k) => {
      const prevD = prevSyncSnap.days?.[k] || {};
      const curD = newSt.days[k] || {};
      return (!prevD.solved && curD.solved) || (!prevD[pFlag] && curD[pFlag]);
    }).length;
    if (bulkChangedDays >= 3) {
      prevSyncSnap = JSON.parse(JSON.stringify(newSt));
      return;
    }

    Object.keys(newSt.days || {}).forEach((k) => {
      const prevD = prevSyncSnap.days?.[k] || {};
      const curD = newSt.days[k] || {};
      if (!prevD.solved && curD.solved && !celebratedLockDays.has(Number(k))) {
        playDoubleLockCinema(Number(k), { isJoint: false });
        showToast(`¡Doble candado abierto! Día ${String(k).padStart(2, "0")} completado junto a ${partnerName}.`);
      } else if (!prevD[pFlag] && curD[pFlag]) {
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
    } else {
      updateLiveCountdownOnly();
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
