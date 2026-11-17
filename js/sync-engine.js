/**
 * ADVIENTO CERO — MOTOR DE SINCRONIZACIÓN EN TIEMPO REAL (FIREBASE RTDB + FALLBACK LOCAL)
 */

window.SyncEngine = (() => {
  const BASE_LOCAL_KEY = "adviento_cero_state_v1";
  const BASE_DIRTY_KEY = "adviento_cero_dirty_v1";

  let state = createDefaultState();
  let dbRef = null;
  let roomRef = null;
  let connectedRef = null;
  let mode = "local"; // "firebase" | "local"
  let connected = false;
  let syncError = null;
  let initialSynced = false;
  let activeRole = "";
  let connId = `c_${Math.random().toString(36).slice(2, 10)}`;
  let listeners = [];
  let onlineListenerBound = false;

  function isAdminRoom() {
    return Boolean(window.DateGate && typeof window.DateGate.isAdminEnabled === "function" && window.DateGate.isAdminEnabled());
  }

  function getLocalKey() {
    return isAdminRoom() ? `${BASE_LOCAL_KEY}_test` : BASE_LOCAL_KEY;
  }

  function getDirtyKey() {
    return isAdminRoom() ? `${BASE_DIRTY_KEY}_test` : BASE_DIRTY_KEY;
  }

  function isDirty() {
    try {
      return localStorage.getItem(getDirtyKey()) === "1";
    } catch (_) {
      return false;
    }
  }

  function setDirty(flag) {
    try {
      if (flag) localStorage.setItem(getDirtyKey(), "1");
      else localStorage.removeItem(getDirtyKey());
    } catch (_) {}
  }

  function createDefaultState() {
    return {
      days: {},            // { "1": { miguelSolved, patriSolved, solved, discardId, conclusion, forensicTag, solvedAt } }
      discardedIds: [],    // ["s16", ...]
      discardedMap: {},    // { "s16": true }
      finalVerdictSolved: false,
      finalEpilogue: null,
      sharedNotes: "",
      hintsUnlocked: {},   // { "1": 0..3 }
      presence: {}
    };
  }

  function normalizeState(rawObj) {
    const out = Object.assign(createDefaultState(), rawObj || {});
    if (!out.days || typeof out.days !== "object") out.days = {};
    if (!out.hintsUnlocked || typeof out.hintsUnlocked !== "object") out.hintsUnlocked = {};
    if (!out.presence || typeof out.presence !== "object") out.presence = {};
    if (!out.discardedMap || typeof out.discardedMap !== "object") out.discardedMap = {};

    const idSet = new Set();
    if (Array.isArray(out.discardedIds)) {
      out.discardedIds.forEach((id) => { if (id) idSet.add(id); });
    } else if (out.discardedIds && typeof out.discardedIds === "object") {
      Object.values(out.discardedIds).forEach((id) => { if (id) idSet.add(id); });
    }
    Object.keys(out.discardedMap).forEach((id) => {
      if (out.discardedMap[id]) idSet.add(id);
    });
    Object.values(out.days).forEach((d) => {
      if (d && d.solved && d.discardId) idSet.add(d.discardId);
    });

    out.discardedIds = Array.from(idSet);
    out.discardedIds.forEach((id) => { out.discardedMap[id] = true; });
    return out;
  }

  function mergeMonotone(localSt, remoteSt) {
    const l = normalizeState(localSt);
    const r = normalizeState(remoteSt);
    const merged = normalizeState(r);

    const allDays = new Set([...Object.keys(l.days), ...Object.keys(r.days)]);
    allDays.forEach((k) => {
      const ld = l.days[k] || {};
      const rd = r.days[k] || {};
      const miguelSolved = Boolean(ld.miguelSolved || rd.miguelSolved);
      const patriSolved = Boolean(ld.patriSolved || rd.patriSolved);
      const solved = Boolean(ld.solved || rd.solved);
      merged.days[k] = Object.assign({}, rd, ld, {
        miguelSolved,
        patriSolved,
        solved,
        discardId: rd.discardId || ld.discardId || null,
        forensicTag: rd.forensicTag || ld.forensicTag || null,
        conclusion: rd.conclusion || ld.conclusion || null,
        solvedAt: rd.solvedAt || ld.solvedAt || null
      });
    });

    const allHintDays = new Set([...Object.keys(l.hintsUnlocked), ...Object.keys(r.hintsUnlocked)]);
    allHintDays.forEach((k) => {
      merged.hintsUnlocked[k] = Math.max(Number(l.hintsUnlocked[k]) || 0, Number(r.hintsUnlocked[k]) || 0);
    });

    const mergedIds = new Set([...l.discardedIds, ...r.discardedIds]);
    merged.discardedIds = Array.from(mergedIds);
    merged.discardedMap = {};
    merged.discardedIds.forEach((id) => { merged.discardedMap[id] = true; });

    merged.finalVerdictSolved = Boolean(l.finalVerdictSolved || r.finalVerdictSolved);
    merged.finalEpilogue = r.finalEpilogue || l.finalEpilogue || null;

    if (!r.sharedNotes && l.sharedNotes) {
      merged.sharedNotes = l.sharedNotes;
    } else if (l.sharedNotes && r.sharedNotes && l.sharedNotes !== r.sharedNotes && !r.sharedNotes.includes(l.sharedNotes)) {
      merged.sharedNotes = `${r.sharedNotes}\n\n[Sincronizado offline]\n${l.sharedNotes}`;
    }

    return normalizeState(merged);
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(getLocalKey());
      if (raw) {
        state = normalizeState(JSON.parse(raw));
      } else {
        state = createDefaultState();
      }
    } catch (_) {
      state = createDefaultState();
    }
  }

  function saveLocal() {
    try {
      localStorage.setItem(getLocalKey(), JSON.stringify(state));
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

  function handleWriteError(err) {
    if (!err) return;
    console.warn("Error Firebase sync:", err);
    syncError = err.code || err.message || "Error de sincronización";
    setDirty(true);
    notify();
  }

  function applyPresenceConnection() {
    if (mode !== "firebase" || !roomRef || !activeRole || !connected) return;
    const roleRef = roomRef.child(`presence/${activeRole}`);
    const myConnRef = roleRef.child(`connections/${connId}`);
    const ts = window.firebase?.database?.ServerValue?.TIMESTAMP || Date.now();
    myConnRef.set(true).then(() => {
      syncError = null;
    }).catch(handleWriteError);
    myConnRef.onDisconnect().remove().catch(() => {});
    roleRef.child("online").set(true).catch(() => {});
    roleRef.child("lastSeen").set(ts).catch(() => {});
    roleRef.child("lastSeen").onDisconnect().set(ts).catch(() => {});
  }

  function buildDeltaPatch(merged) {
    const patch = {};
    Object.keys(merged.days).forEach((k) => {
      patch[`days/${k}`] = merged.days[k];
    });
    Object.keys(merged.hintsUnlocked).forEach((k) => {
      patch[`hintsUnlocked/${k}`] = merged.hintsUnlocked[k];
    });
    merged.discardedIds.forEach((id) => {
      patch[`discardedMap/${id}`] = true;
    });
    if (merged.finalVerdictSolved) {
      patch.finalVerdictSolved = true;
      patch.finalEpilogue = merged.finalEpilogue;
    }
    if (merged.sharedNotes) {
      patch.sharedNotes = merged.sharedNotes;
    }
    return patch;
  }

  function cleanupListeners() {
    try { roomRef?.off(); } catch (_) {}
    try { connectedRef?.off(); } catch (_) {}
  }

  function init() {
    loadLocal();
    cleanupListeners();

    if (!onlineListenerBound) {
      onlineListenerBound = true;
      window.addEventListener("online", () => {
        if (mode === "local" && isFirebaseConfigured()) {
          init();
        } else if (mode === "firebase" && activeRole) {
          applyPresenceConnection();
        }
      });
    }

    if (isFirebaseConfigured()) {
      try {
        const cfg = window.ADVIENTO_FIREBASE_CONFIG;
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(cfg.firebaseConfig);
        }
        dbRef = window.firebase.database();
        const baseRoomId = cfg.roomId || "miguel-patri-ventisquero-2026";
        const roomId = isAdminRoom() ? `${baseRoomId}-test` : baseRoomId;
        roomRef = dbRef.ref(`rooms/${roomId}`);
        mode = "firebase";
        syncError = null;

        connectedRef = dbRef.ref(".info/connected");
        connectedRef.on("value", (snap) => {
          connected = Boolean(snap.val());
          if (connected) {
            syncError = null;
            applyPresenceConnection();
          }
          notify();
        });

        roomRef.on("value", (snap) => {
          const remote = snap.val();
          initialSynced = true;
          if (remote && typeof remote === "object") {
            if (isDirty()) {
              const merged = mergeMonotone(state, remote);
              state = merged;
              saveLocal();
              const patch = buildDeltaPatch(merged);
              if (Object.keys(patch).length > 0) {
                roomRef.update(patch).then(() => {
                  setDirty(false);
                  syncError = null;
                }).catch(handleWriteError);
              } else {
                setDirty(false);
              }
            } else {
              state = normalizeState(remote);
              saveLocal();
            }
            notify();
          } else {
            const initData = normalizeState(state);
            const patch = buildDeltaPatch(initData);
            if (Object.keys(patch).length > 0) {
              roomRef.update(patch).then(() => {
                setDirty(false);
                syncError = null;
              }).catch(handleWriteError);
            } else {
              setDirty(false);
              syncError = null;
            }
          }
        }, (err) => {
          handleWriteError(err);
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

  function solveDayPart(dayNum, role, dayMode, decoded) {
    const key = String(dayNum);
    if (!state.days[key]) state.days[key] = {};

    if (dayMode === "dual-lock") {
      if (role === "miguel") state.days[key].miguelSolved = true;
      else state.days[key].patriSolved = true;

      if (state.days[key].miguelSolved && state.days[key].patriSolved && decoded) {
        state.days[key].solved = true;
        state.days[key].discardId = decoded.discardId;
        state.days[key].forensicTag = decoded.forensicTag;
        state.days[key].conclusion = decoded.conclusion;
        state.days[key].solvedAt = Date.now();
        if (!state.discardedIds.includes(decoded.discardId)) state.discardedIds.push(decoded.discardId);
        state.discardedMap[decoded.discardId] = true;
      }
    } else if (decoded) {
      state.days[key].solved = true;
      state.days[key].discardId = decoded.discardId;
      state.days[key].forensicTag = decoded.forensicTag;
      state.days[key].conclusion = decoded.conclusion;
      state.days[key].solvedAt = Date.now();
      if (!state.discardedIds.includes(decoded.discardId)) state.discardedIds.push(decoded.discardId);
      state.discardedMap[decoded.discardId] = true;
    }

    saveLocal();
    if (mode === "firebase" && roomRef) {
      if (dayMode === "dual-lock") {
        roomRef.child(`days/${key}`).transaction((cur) => {
          const next = Object.assign({}, cur || {});
          if (role === "miguel") next.miguelSolved = true;
          else next.patriSolved = true;
          if (next.miguelSolved && next.patriSolved && decoded) {
            next.solved = true;
            next.discardId = decoded.discardId;
            next.forensicTag = decoded.forensicTag;
            next.conclusion = decoded.conclusion;
            next.solvedAt = next.solvedAt || Date.now();
          }
          return next;
        }, (err, committed, snap) => {
          if (err) {
            handleWriteError(err);
            return;
          }
          if (committed && snap) {
            const val = snap.val();
            if (val && val.solved && val.discardId) {
              roomRef.child(`discardedMap/${val.discardId}`).set(true).catch(handleWriteError);
            }
            syncError = null;
            setDirty(false);
          }
        });
      } else if (decoded) {
        const patch = {};
        patch[`days/${key}`] = state.days[key];
        patch[`discardedMap/${decoded.discardId}`] = true;
        roomRef.update(patch).then(() => {
          syncError = null;
          setDirty(false);
        }).catch(handleWriteError);
      }
    } else {
      setDirty(true);
    }
    notify();
  }

  function unlockHint(dayNum) {
    const key = String(dayNum);
    const cur = Number(state.hintsUnlocked[key]) || 0;
    if (cur >= 3) return;
    state.hintsUnlocked[key] = cur + 1;
    saveLocal();

    if (mode === "firebase" && roomRef) {
      roomRef.child(`hintsUnlocked/${key}`).transaction((remoteCur) => {
        return Math.min(3, (Number(remoteCur) || 0) + 1);
      }, (err) => {
        if (err) handleWriteError(err);
        else { syncError = null; setDirty(false); }
      });
    } else {
      setDirty(true);
    }
    notify();
  }

  function saveNotes(text) {
    state.sharedNotes = text;
    saveLocal();
    if (mode === "firebase" && roomRef) {
      roomRef.update({ sharedNotes: text }).then(() => {
        syncError = null;
        setDirty(false);
      }).catch(handleWriteError);
    } else {
      setDirty(true);
    }
  }

  function solveFinalVerdict(epilogue) {
    state.finalVerdictSolved = true;
    state.finalEpilogue = epilogue || null;
    saveLocal();
    if (mode === "firebase" && roomRef) {
      roomRef.update({
        finalVerdictSolved: true,
        finalEpilogue: state.finalEpilogue
      }).then(() => {
        syncError = null;
        setDirty(false);
      }).catch(handleWriteError);
    } else {
      setDirty(true);
    }
    notify();
  }

  function pushUpdate(updaterFn) {
    updaterFn(state);
    state = normalizeState(state);
    saveLocal();
    if (mode === "firebase" && roomRef) {
      const patch = buildDeltaPatch(state);
      if (Object.keys(patch).length > 0) {
        roomRef.update(patch).then(() => {
          syncError = null;
          setDirty(false);
        }).catch(handleWriteError);
      } else {
        syncError = null;
        setDirty(false);
      }
    } else {
      setDirty(true);
    }
    notify();
  }

  function markPresence(role) {
    if (!role) return;
    if (activeRole && activeRole !== role && mode === "firebase" && roomRef) {
      roomRef.child(`presence/${activeRole}/connections/${connId}`).remove().catch(() => {});
    }
    activeRole = role;
    applyPresenceConnection();
  }

  function isRoleOnline(role) {
    const p = state.presence?.[role];
    if (!p) return false;
    if (p.connections && typeof p.connections === "object") {
      return Object.keys(p.connections).length > 0;
    }
    return Boolean(p.online);
  }

  function resetAll() {
    state = createDefaultState();
    setDirty(false);
    saveLocal();
    if (mode === "firebase" && roomRef) {
      roomRef.set(state).then(() => {
        syncError = null;
        if (activeRole) applyPresenceConnection();
      }).catch(handleWriteError);
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

  function getStatus() {
    return { mode, connected, syncError, initialSynced, isAdminRoom: isAdminRoom() };
  }

  return {
    init,
    subscribe,
    pushUpdate,
    solveDayPart,
    unlockHint,
    saveNotes,
    solveFinalVerdict,
    markPresence,
    isRoleOnline,
    resetAll,
    getState,
    getMode,
    getStatus
  };
})();
