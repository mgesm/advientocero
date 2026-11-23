/**
 * ADVIENTO CERO — MOTOR DE AUDIO PROCEDIMENTAL, HÁPTICA Y ALMACENAMIENTO SEGURO
 */

window.SafeStorage = (() => {
  const mem = new Map();
  let quotaWarned = false;
  let quotaHandler = null;

  function notifyQuota(err) {
    if (quotaWarned) return;
    quotaWarned = true;
    if (typeof quotaHandler === "function") {
      try { quotaHandler(err); } catch (_) {}
    }
  }

  return {
    getItem(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_) {
        return mem.has(key) ? mem.get(key) : null;
      }
    },
    setItem(key, val) {
      const s = String(val);
      mem.set(key, s);
      try {
        window.localStorage.setItem(key, s);
        return true;
      } catch (err) {
        notifyQuota(err);
        return false;
      }
    },
    removeItem(key) {
      mem.delete(key);
      try {
        window.localStorage.removeItem(key);
      } catch (_) {}
    },
    onError(fn) {
      quotaHandler = fn;
    }
  };
})();

window.AudioFX = (() => {
  let ctx = null;
  let muted = window.SafeStorage.getItem("adviento_muted") === "1";
  let morseRunId = 0;
  let wakeSentinel = null;
  const visualCueHandlers = new Set();

  function emitVisualCue(kind, text) {
    if (!muted) return;
    visualCueHandlers.forEach((fn) => {
      try { fn(kind, text); } catch (_) {}
    });
  }

  function onVisualCue(fn) {
    if (typeof fn === "function") visualCueHandlers.add(fn);
    return () => visualCueHandlers.delete(fn);
  }

  async function acquireWakeLock() {
    if (!("wakeLock" in navigator) || !navigator.wakeLock?.request) return false;
    try {
      if (wakeSentinel && !wakeSentinel.released) return true;
      wakeSentinel = await navigator.wakeLock.request("screen");
      return true;
    } catch (_) {
      return false;
    }
  }

  async function releaseWakeLock() {
    if (!wakeSentinel) return;
    try { await wakeSentinel.release(); } catch (_) {}
    wakeSentinel = null;
  }

  function isReducedMotion() {
    return (
      document.body?.classList.contains("pref-reduced-motion") ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );
  }

  function haptic(pattern) {
    if (muted || isReducedMotion()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (_) {}
  }

  function ensureCtx(allowWhenMuted = false) {
    if (muted && !allowWhenMuted) return null;
    if (!ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      } catch (_) {
        ctx = null;
      }
    }
    if (ctx && (ctx.state === "suspended" || ctx.state === "interrupted")) {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function unlockAudioOnce() {
    const c = ensureCtx(true);
    if (c && c.state !== "running") {
      c.resume().catch(() => {});
    }
  }

  ["pointerdown", "touchend", "keydown"].forEach((evt) => {
    document.addEventListener(evt, unlockAudioOnce, { passive: true, capture: true });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopMorse();
  });

  function scheduleTone(c, freq, durationMs, type, gainVal, delayMs) {
    try {
      const now = c.currentTime + delayMs / 1000;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + durationMs / 1000 + 0.02);
    } catch (_) {}
  }

  function tone(freq, durationMs, type = "sine", gainVal = 0.08, delayMs = 0) {
    const c = ensureCtx(false);
    if (!c) return;
    if (c.state !== "running") {
      c.resume().then(() => scheduleTone(c, freq, durationMs, type, gainVal, delayMs)).catch(() => {});
      return;
    }
    scheduleTone(c, freq, durationMs, type, gainVal, delayMs);
  }

  function click() {
    tone(520, 42, "triangle", 0.04);
  }

  function mechanicalTick() {
    tone(880, 26, "square", 0.025);
    haptic(10);
  }

  function sealBreak() {
    tone(220, 120, "triangle", 0.07, 0);
    tone(330, 180, "sine", 0.06, 65);
    haptic([18, 28, 22]);
  }

  function radioSweep() {
    tone(420, 90, "sine", 0.04, 0);
    tone(580, 120, "sine", 0.045, 75);
  }

  function partnerPing() {
    tone(660, 110, "sine", 0.05, 0);
    tone(880, 180, "sine", 0.06, 110);
    haptic(25);
  }

  function partnerPing() {
    tone(587.33, 120, "sine", 0.05, 0);
    tone(783.99, 180, "sine", 0.05, 95);
    haptic([18, 25, 22]);
    emitVisualCue("partner", "Aviso sonoro de tu pareja (Modo silencio visual)");
  }

  function success() {
    tone(523.25, 140, "sine", 0.07, 0);
    tone(659.25, 160, "sine", 0.07, 90);
    tone(783.99, 260, "sine", 0.08, 180);
    haptic([24, 30, 40]);
    emitVisualCue("success", "Confirmación acústica (Silencio activo)");
  }

  function error() {
    tone(190, 140, "sawtooth", 0.05, 0);
    tone(155, 180, "sawtooth", 0.05, 120);
    haptic([35, 35, 35]);
    emitVisualCue("error", "Error de código (Silencio activo)");
  }

  function stopMorse() {
    morseRunId += 1;
    releaseWakeLock();
  }

  async function playMorse(sequence, onLight) {
    const myId = ++morseRunId;
    const unit = 160;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    acquireWakeLock();
    try {
      for (const ch of sequence) {
        if (myId !== morseRunId) break;
        if (ch === ".") {
          if (onLight) onLight(true);
          tone(680, unit, "sine", 0.09);
          await sleep(unit);
          if (onLight) onLight(false);
          if (myId !== morseRunId) break;
          await sleep(unit);
        } else if (ch === "-") {
          if (onLight) onLight(true);
          tone(680, unit * 3, "sine", 0.09);
          await sleep(unit * 3);
          if (onLight) onLight(false);
          if (myId !== morseRunId) break;
          await sleep(unit);
        } else if (ch === " ") {
          await sleep(unit * 2.5);
        }
      }
    } finally {
      if (onLight) onLight(false);
      releaseWakeLock();
    }
  }

  function isMuted() {
    return muted;
  }

  function toggleMute() {
    muted = !muted;
    if (muted) stopMorse();
    window.SafeStorage.setItem("adviento_muted", muted ? "1" : "0");
    return muted;
  }

  function setMuted(flag) {
    muted = Boolean(flag);
    if (muted) stopMorse();
    window.SafeStorage.setItem("adviento_muted", muted ? "1" : "0");
    return muted;
  }

  return {
    click,
    mechanicalTick,
    sealBreak,
    radioSweep,
    partnerPing,
    success,
    error,
    playMorse,
    stopMorse,
    isMuted,
    toggleMute,
    setMuted,
    onVisualCue,
    acquireWakeLock,
    releaseWakeLock,
    haptic
  };
})();
