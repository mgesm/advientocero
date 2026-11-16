/**
 * ADVIENTO CERO — MOTOR DE SINCRONIZACIÓN EN TIEMPO REAL (FIREBASE RTDB + FALLBACK LOCAL)
 */

window.SyncEngine = (() => {
  const LOCAL_KEY = "adviento_cero_state_v1";
  let state = createDefaultState();
  let dbRef = null;
  let roomRef = null;
  let mode = "local"; // "firebase" | "local"
  let listeners = [];

  function createDefaultState() {
    return {
      days: {},            // { "1": { miguelSolved, patriSolved, solved, discardId, conclusion, forensicTag, solvedAt } }
      discardedIds: [],    // ["s16", ...]
      finalVerdictSolved: false,
      finalEpilogue: null,
      sharedNotes: "",
      hintsUnlocked: {},   // { "1": 0..3 }
      presence: {}
    };
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(createDefaultState(), parsed || {});
        if (!Array.isArray(state.discardedIds)) state.discardedIds = [];
        if (!state.days || typeof state.days !== "object") state.days = {};
        if (!state.hintsUnlocked || typeof state.hintsUnlocked !== "object") state.hintsUnlocked = {};
      }
    } catch (_) {
      state = createDefaultState();
    }
  }

  function saveLocal() {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function notify() {
    listeners.forEach((cb) => {
      try { cb(state, mode); } catch (_) {}
    });
  }

  function isFirebaseConfigured() {
    const cfg = window.ADVIENTO_FIREBASE_CONFIG;
    if (!cfg || !cfg.firebaseConfig) return false;
    const { apiKey, databaseURL } = cfg.firebaseConfig;
    if (!apiKey || !databaseURL) return false;
    if (apiKey.includes("TU_API_KEY") || databaseURL.includes("TU_PROYECTO")) return false;
    return typeof window.firebase !== "undefined" && typeof window.firebase.database === "function";
  }

  function init() {
    loadLocal();
    if (isFirebaseConfigured()) {
      try {
        const cfg = window.ADVIENTO_FIREBASE_CONFIG;
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(cfg.firebaseConfig);
        }
        dbRef = window.firebase.database();
        const roomId = cfg.roomId || "miguel-patri-ventisquero-2026";
        roomRef = dbRef.ref(`rooms/${roomId}`);
        mode = "firebase";

        roomRef.on("value", (snap) => {
          const remote = snap.val();
          if (remote && typeof remote === "object") {
            state = Object.assign(createDefaultState(), remote);
            if (!Array.isArray(state.discardedIds)) {
              state.discardedIds = remote.discardedIds ? Object.values(remote.discardedIds) : [];
            }
            if (!state.days) state.days = {};
            if (!state.hintsUnlocked) state.hintsUnlocked = {};
            saveLocal();
            notify();
          } else {
            roomRef.set(state).catch(() => {});
          }
        });
      } catch (err) {
        console.warn("Fallback a modo local:", err);
        mode = "local";
      }
    } else {
      mode = "local";
    }
    notify();
  }

  function pushUpdate(updaterFn) {
    updaterFn(state);
    saveLocal();
    if (mode === "firebase" && roomRef) {
      roomRef.set(state).catch((err) => console.warn("Error Firebase sync:", err));
    }
    notify();
  }

  function markPresence(role) {
    if (mode !== "firebase" || !roomRef || !role) return;
    const pRef = roomRef.child(`presence/${role}`);
    pRef.set({ online: true, lastSeen: Date.now() }).catch(() => {});
    pRef.onDisconnect().set({ online: false, lastSeen: Date.now() }).catch(() => {});
  }

  function resetAll() {
    state = createDefaultState();
    saveLocal();
    if (mode === "firebase" && roomRef) {
      roomRef.set(state).catch(() => {});
    }
    notify();
  }

  function subscribe(cb) {
    listeners.push(cb);
    cb(state, mode);
  }

  function getState() {
    return state;
  }

  function getMode() {
    return mode;
  }

  return {
    init,
    subscribe,
    pushUpdate,
    markPresence,
    resetAll,
    getState,
    getMode
  };
})();
