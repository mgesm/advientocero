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

  function createNoiseBuffer(c, durationSec) {
    const len = Math.max(1, Math.floor(c.sampleRate * durationSec));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      ch[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  function scheduleBandNoise(c, delaySec, durationSec, freqStart, freqEnd, qVal, gainPeak) {
    try {
      const now = c.currentTime + delaySec;
      const src = c.createBufferSource();
      src.buffer = createNoiseBuffer(c, durationSec);
      const flt = c.createBiquadFilter();
      flt.type = "bandpass";
      flt.Q.setValueAtTime(qVal, now);
      flt.frequency.setValueAtTime(freqStart, now);
      if (freqEnd && freqEnd !== freqStart) {
        flt.frequency.exponentialRampToValueAtTime(freqEnd, now + durationSec);
      }
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(gainPeak, now + Math.min(0.015, durationSec * 0.25));
      g.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
      src.connect(flt);
      flt.connect(g);
      g.connect(c.destination);
      src.start(now);
      src.stop(now + durationSec + 0.02);
    } catch (_) {}
  }

  function waxSealBreak() {
    haptic([14, 24, 34]);
    emitVisualCue("wax", "Sello de lacre abierto");
    const c = ensureCtx(false);
    if (!c) return;
    const play = () => {
      // 1) Hairline golden fracture stress tick (310ms)
      scheduleBandNoise(c, 0.31, 0.04, 3400, 2200, 3.0, 0.085);
      scheduleTone(c, 1680, 26, "triangle", 0.032, 310);
      // 2) Crisp crimson wax crack snap on split (555ms)
      scheduleBandNoise(c, 0.555, 0.06, 2900, 1650, 2.1, 0.17);
      scheduleTone(c, 265, 62, "triangle", 0.08, 555);
      scheduleTone(c, 148, 82, "sine", 0.058, 568);
      // 3) Tactile parchment envelope fiber rustle (620ms)
      scheduleBandNoise(c, 0.62, 0.28, 1550, 3100, 1.5, 0.068);
      // 4) Warm golden mystery fifth shimmer (665ms)
      scheduleTone(c, 523.25, 310, "sine", 0.04, 665);
      scheduleTone(c, 783.99, 420, "sine", 0.034, 715);
    };
    if (c.state !== "running") {
      c.resume().then(play).catch(() => {});
    } else {
      play();
    }
  }

  function doubleLockOpen() {
    haptic([24, 42, 58]);
    emitVisualCue("doublelock", "Doble Candado abierto (Silencio activo)");
    const c = ensureCtx(false);
    if (!c) return;
    const play = () => {
      // 1) Opposing polarized harmonic convergence (0..380ms)
      scheduleTone(c, 440.0, 360, "sine", 0.036, 0);
      scheduleTone(c, 554.37, 360, "sine", 0.036, 25);
      // 2) Fine brass tumbler pre-click (410ms)
      scheduleTone(c, 2450, 20, "sine", 0.055, 410);
      scheduleTone(c, 4820, 18, "triangle", 0.042, 412);
      scheduleBandNoise(c, 0.41, 0.025, 3600, 2200, 3.0, 0.08);
      // 3) Authoritative metallic shackle UNLATCH clack (475ms, matching briefing video!)
      scheduleTone(c, 390, 82, "triangle", 0.11, 475);
      scheduleTone(c, 880, 95, "sine", 0.075, 475);
      scheduleTone(c, 3420, 48, "sine", 0.065, 476);
      scheduleTone(c, 6180, 36, "triangle", 0.045, 478);
      scheduleBandNoise(c, 0.475, 0.065, 3400, 1800, 2.5, 0.17);
      // 4) Luminous alabaster chord bloom (515ms)
      scheduleTone(c, 587.33, 520, "sine", 0.045, 515);
      scheduleTone(c, 880.0, 620, "sine", 0.042, 545);
      scheduleTone(c, 1174.66, 700, "sine", 0.032, 585);
    };
    if (c.state !== "running") {
      c.resume().then(play).catch(() => {});
    } else {
      play();
    }
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

  function playDoorRitual(dayNum) {
    const d = Number(dayNum || 1);
    if (d === 1) {
      waxSealBreak();
      return;
    }
    haptic([12, 24, 28]);
    emitVisualCue("door", `Apertura Puerta ${String(d).padStart(2, "0")}`);
    const c = ensureCtx(false);
    if (!c) return;
    const play = () => {
      switch (d) {
        case 2: // Luz UV: click táctil + zumbido UV limpio + destello fluorescente
          scheduleTone(c, 2200, 18, "square", 0.045, 90);
          scheduleBandNoise(c, 0.09, 0.03, 3200, 1900, 2.5, 0.08);
          scheduleTone(c, 185, 620, "sine", 0.03, 140);
          scheduleTone(c, 1480, 380, "sine", 0.025, 420);
          break;
        case 3: // Morse centralita: · − · · a 740 Hz
          scheduleTone(c, 740, 82, "sine", 0.068, 160);
          scheduleTone(c, 740, 235, "sine", 0.068, 410);
          scheduleTone(c, 740, 82, "sine", 0.068, 790);
          scheduleTone(c, 740, 85, "sine", 0.068, 960);
          break;
        case 4: // Llavín maestro: 4 pernos en cascada + cerrojo de latón
          [180, 300, 420, 540].forEach((ms, i) => {
            scheduleTone(c, 1380 + i * 190, 22, "triangle", 0.055, ms);
            scheduleBandNoise(c, ms / 1000, 0.02, 3400, 2200, 3.0, 0.06);
          });
          scheduleTone(c, 290, 95, "triangle", 0.095, 680);
          scheduleTone(c, 660, 260, "sine", 0.042, 710);
          break;
        case 5: // RFID: doble bip de acceso autorizado
          scheduleTone(c, 320, 260, "sine", 0.022, 340);
          scheduleTone(c, 1760, 75, "sine", 0.062, 620);
          scheduleTone(c, 2093, 95, "sine", 0.062, 725);
          break;
        case 6: // Disco de cifrado: engranajes mecánicos + campana fina
          [160, 240, 320, 410, 510, 620].forEach((ms, i) => {
            scheduleTone(c, 1100 + i * 70, 16, "square", 0.028, ms);
          });
          scheduleTone(c, 880, 320, "sine", 0.048, 730);
          scheduleTone(c, 1318.5, 360, "sine", 0.032, 760);
          break;
        case 7: // 5 sensores: 4 pings ascendentes + alerta carmesí en S5
          [523, 587, 659, 740].forEach((f, i) => scheduleTone(c, f, 72, "sine", 0.048, 200 + i * 130));
          scheduleTone(c, 440, 260, "sawtooth", 0.042, 710);
          scheduleTone(c, 622, 260, "triangle", 0.042, 715);
          break;
        case 8: // Balanza analítica: dos gotas líquidas + resonancia de cristal
          scheduleTone(c, 880, 48, "sine", 0.055, 220);
          scheduleTone(c, 1280, 36, "sine", 0.045, 248);
          scheduleTone(c, 988, 48, "sine", 0.055, 360);
          scheduleTone(c, 1480, 38, "sine", 0.045, 388);
          scheduleTone(c, 1046.5, 420, "sine", 0.045, 760);
          break;
        case 9: // Obturador iris: ka-clack mecánico + carga de flash
          scheduleBandNoise(c, 0.36, 0.042, 2800, 1400, 2.0, 0.16);
          scheduleTone(c, 220, 45, "triangle", 0.08, 360);
          scheduleBandNoise(c, 0.44, 0.05, 4200, 2400, 2.2, 0.14);
          scheduleTone(c, 1950, 280, "sine", 0.024, 520);
          break;
        case 10: // Válvula de caldera: chirrido metálico + siseo de vapor
          scheduleTone(c, 210, 260, "triangle", 0.042, 160);
          scheduleTone(c, 340, 220, "sine", 0.032, 260);
          scheduleBandNoise(c, 0.50, 0.48, 1250, 3600, 1.3, 0.14);
          break;
        case 11: // Ticket térmico: pasos de impresora + rasgado de papel
          [130, 270, 410, 540].forEach((ms) => scheduleBandNoise(c, ms / 1000, 0.055, 1900, 2700, 2.4, 0.075));
          scheduleBandNoise(c, 0.65, 0.24, 2400, 4400, 1.6, 0.15);
          break;
        case 12: // Nonograma 5x5: cascada de teclado mecánico + verificación
          [160, 230, 300, 370, 440, 510, 580, 650].forEach((ms, i) => {
            scheduleTone(c, 680 + i * 85, 28, "triangle", 0.036, ms);
          });
          scheduleTone(c, 1174.66, 320, "sine", 0.042, 740);
          break;
        case 13: // Chats fragmentados: burbujas duales cian/ámbar + unión
          scheduleTone(c, 660, 75, "sine", 0.055, 180);
          scheduleTone(c, 880, 75, "sine", 0.055, 330);
          scheduleTone(c, 784, 85, "sine", 0.052, 480);
          scheduleTone(c, 1046.5, 280, "sine", 0.042, 650);
          break;
        case 14: // Triangulación Wi-Fi: 3 sonares + fijación de objetivo
          scheduleTone(c, 988, 90, "sine", 0.048, 170);
          scheduleTone(c, 1175, 90, "sine", 0.048, 320);
          scheduleTone(c, 1318, 90, "sine", 0.048, 470);
          scheduleTone(c, 1568, 320, "sine", 0.052, 660);
          break;
        case 15: // Caja fuerte: clics de dial + golpe profundo de bulones
          [160, 230, 300, 440, 510, 620].forEach((ms, i) => {
            scheduleTone(c, 1650 + (i % 2) * 320, 16, "square", 0.034, ms);
          });
          scheduleTone(c, 175, 120, "triangle", 0.11, 720);
          scheduleBandNoise(c, 0.72, 0.06, 2800, 1200, 2.4, 0.14);
          scheduleTone(c, 784, 290, "sine", 0.042, 760);
          break;
        case 16: // Dial de radio: barrido de estática blanca -> sintonía pura
          scheduleBandNoise(c, 0.14, 0.56, 950, 2650, 2.2, 0.095);
          scheduleTone(c, 587.33, 380, "sine", 0.048, 720);
          scheduleTone(c, 880.0, 420, "sine", 0.035, 760);
          break;
        case 17: // Parrilla deductiva: trazos de pluma + acorde de acierto
          [170, 260, 350, 440, 530].forEach((ms) => scheduleBandNoise(c, ms / 1000, 0.05, 2900, 4100, 2.6, 0.06));
          scheduleTone(c, 587.33, 180, "sine", 0.048, 700);
          scheduleTone(c, 880.0, 340, "sine", 0.048, 750);
          break;
        case 18: // Huellas en la nieve: dos pisadas crujientes en escarcha
          scheduleBandNoise(c, 0.20, 0.16, 950, 2400, 1.4, 0.13);
          scheduleBandNoise(c, 0.48, 0.18, 1050, 2600, 1.4, 0.14);
          scheduleTone(c, 1318.5, 360, "sine", 0.028, 660);
          break;
        case 19: // Transferencias 00:00: contador digital + confirmación bancaria
          [170, 230, 290, 350, 410, 470, 530].forEach((ms, i) => {
            scheduleTone(c, 920 + i * 55, 20, "square", 0.024, ms);
          });
          scheduleTone(c, 880, 120, "sine", 0.055, 670);
          scheduleTone(c, 1318.5, 320, "sine", 0.052, 760);
          break;
        case 20: // Escáner Rayos X: motor suave + barrido espectral cian
          scheduleTone(c, 145, 720, "sine", 0.038, 140);
          scheduleTone(c, 620, 260, "sine", 0.03, 240);
          scheduleTone(c, 980, 280, "sine", 0.032, 480);
          scheduleTone(c, 1240, 260, "sine", 0.028, 720);
          break;
        case 21: // Reloj rebobinando: tictac inverso acelerado + campanada grave
          [160, 235, 305, 370, 430, 495, 565].forEach((ms, i) => {
            scheduleTone(c, 1520 - i * 80, 16, "triangle", 0.038, ms);
          });
          scheduleTone(c, 220, 560, "sine", 0.085, 690);
          scheduleTone(c, 440, 480, "triangle", 0.042, 695);
          break;
        case 22: // Pico de voltaje: zumbido 50Hz + chispazo eléctrico + golpe de disyuntor
          scheduleTone(c, 100, 340, "sawtooth", 0.028, 120);
          scheduleBandNoise(c, 0.44, 0.14, 4200, 1400, 1.5, 0.17);
          scheduleTone(c, 1620, 95, "sawtooth", 0.065, 450);
          scheduleTone(c, 130, 140, "triangle", 0.10, 680);
          break;
        case 23: // Tampón forense: impacto contundente de sello + tensión
          scheduleTone(c, 118, 120, "triangle", 0.13, 390);
          scheduleBandNoise(c, 0.39, 0.075, 1600, 800, 1.8, 0.18);
          scheduleTone(c, 440, 420, "sine", 0.04, 470);
          scheduleTone(c, 659.25, 460, "sine", 0.032, 510);
          break;
        case 24: // Bóveda de Nochebuena: cascada de los 24 días + desbloqueo de bronce + acorde sinfónico Dmaj9
        default: {
          const notes = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66, 1318.51, 1479.98];
          notes.forEach((f, idx) => scheduleTone(c, f, 120, "sine", 0.026, 90 + idx * 78));
          // 2) Desbloqueo solemne de la bóveda (820ms)
          scheduleTone(c, 146.83, 520, "triangle", 0.11, 820);
          scheduleTone(c, 293.66, 320, "sine", 0.07, 825);
          scheduleBandNoise(c, 0.82, 0.11, 2400, 900, 1.8, 0.16);
          // 3) Apertura majestuosa de las puertas dobles (1020ms)
          scheduleBandNoise(c, 1.02, 0.62, 420, 1150, 1.2, 0.085);
          // 4) Acorde cálido de Nochebuena (Dmaj9 en celesta/cuerda) + campanada alpina
          scheduleTone(c, 293.66, 1450, "sine", 0.068, 1080);
          scheduleTone(c, 440.0, 1420, "sine", 0.052, 1120);
          scheduleTone(c, 554.37, 1380, "sine", 0.045, 1170);
          scheduleTone(c, 659.25, 1350, "sine", 0.042, 1230);
          scheduleTone(c, 880.0, 1320, "triangle", 0.036, 1310);
          scheduleTone(c, 1174.66, 1400, "sine", 0.044, 1400);
          break;
        }
      }
    };
    if (c.state !== "running") {
      c.resume().then(play).catch(() => {});
    } else {
      play();
    }
  }

  return {
    click,
    mechanicalTick,
    sealBreak,
    waxSealBreak,
    playDoorRitual,
    doubleLockOpen,
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
