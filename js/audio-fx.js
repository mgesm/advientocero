/**
 * ADVIENTO CERO — MOTOR DE AUDIO PROCEDIMENTAL (WEB AUDIO API)
 */

window.AudioFX = (() => {
  let ctx = null;
  let muted = localStorage.getItem("adviento_muted") === "1";

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
    tone(520, 45, "triangle", 0.04);
  }

  function success() {
    tone(523.25, 140, "sine", 0.07, 0);
    tone(659.25, 160, "sine", 0.07, 90);
    tone(783.99, 260, "sine", 0.08, 180);
  }

  function error() {
    tone(190, 140, "sawtooth", 0.05, 0);
    tone(155, 180, "sawtooth", 0.05, 120);
  }

  async function playMorse(sequence, onLight) {
    const unit = 160;
    for (const ch of sequence) {
      if (ch === ".") {
        if (onLight) onLight(true);
        tone(680, unit, "sine", 0.09);
        await new Promise((r) => setTimeout(r, unit));
        if (onLight) onLight(false);
        await new Promise((r) => setTimeout(r, unit));
      } else if (ch === "-") {
        if (onLight) onLight(true);
        tone(680, unit * 3, "sine", 0.09);
        await new Promise((r) => setTimeout(r, unit * 3));
        if (onLight) onLight(false);
        await new Promise((r) => setTimeout(r, unit));
      } else if (ch === " ") {
        await new Promise((r) => setTimeout(r, unit * 2.5));
      }
    }
  }

  function isMuted() {
    return muted;
  }

  function toggleMute() {
    muted = !muted;
    localStorage.setItem("adviento_muted", muted ? "1" : "0");
    return muted;
  }

  return { click, success, error, playMorse, isMuted, toggleMute };
})();
