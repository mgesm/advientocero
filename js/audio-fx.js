/**
 * ADVIENTO CERO — MOTOR DE AUDIO PROCEDIMENTAL Y HÁPTICA (WEB AUDIO API)
 */

window.AudioFX = (() => {
  let ctx = null;
  let muted = localStorage.getItem("adviento_muted") === "1";
  let morseRunId = 0;

  function isReducedMotion() {
    return (
      document.body?.classList.contains("Pref-reduced-motion") ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    );
  }

  function haptic(pattern) {
    if (muted || isReducedMotion()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (_) {}
  }

  function getCtx() {
    if (muted) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function tone(freq, durationMs, type = "sine", gainVal = 0.08, delayMs = 0) {
    const c = getCtx();
    if (!c) return;
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

  function success() {
    tone(523.25, 140, "sine", 0.07, 0);
    tone(659.25, 160, "sine", 0.07, 90);
    tone(783.99, 260, "sine", 0.08, 180);
    haptic([24, 30, 40]);
  }

  function error() {
    tone(190, 140, "sawtooth", 0.05, 0);
    tone(155, 180, "sawtooth", 0.05, 120);
    haptic([35, 35, 35]);
  }

  function stopMorse() {
    morseRunId += 1;
  }

  async function playMorse(sequence, onLight) {
    const myId = ++morseRunId;
    const unit = 160;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
    }
  }

  function isMuted() {
    return muted;
  }

  function toggleMute() {
    muted = !muted;
    if (muted) stopMorse();
    localStorage.setItem("adviento_muted", muted ? "1" : "0");
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
    haptic
  };
})();
