/**
 * ADVIENTO CERO — MOTOR DE FECHAS (1–24 DE DICIEMBRE) Y MODO TEST OCULTO
 */

window.DateGate = (() => {
  const TARGET_YEAR = 2026;
  const ADMIN_KEY = "adviento_admin_sim_day";
  const ADMIN_FLAG = "adviento_admin_enabled";
  const storage = window.SafeStorage || {
    getItem(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    setItem(k, v) { try { localStorage.setItem(k, String(v)); } catch (_) {} },
    removeItem(k) { try { localStorage.removeItem(k); } catch (_) {} }
  };

  function checkUrlActivation() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "ventisquero") {
      storage.setItem(ADMIN_FLAG, "1");
      if (!storage.getItem(ADMIN_KEY)) {
        storage.setItem(ADMIN_KEY, "24");
      }
    }
  }

  function isAdminEnabled() {
    return storage.getItem(ADMIN_FLAG) === "1";
  }

  function enableAdmin(simDay = 24) {
    storage.setItem(ADMIN_FLAG, "1");
    setSimulatedDay(simDay);
  }

  function disableAdmin() {
    storage.removeItem(ADMIN_FLAG);
    storage.removeItem(ADMIN_KEY);
  }

  function setSimulatedDay(dayNum) {
    const parsed = Number(dayNum);
    const clamped = Number.isFinite(parsed) ? Math.max(0, Math.min(24, Math.floor(parsed))) : 24;
    storage.setItem(ADMIN_KEY, String(clamped));
  }

  function getSimulatedDay() {
    if (!isAdminEnabled()) return null;
    const raw = storage.getItem(ADMIN_KEY);
    if (raw === null || raw === "") return 24;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? Math.max(0, Math.min(24, Math.floor(parsed))) : 24;
  }

  function getRealUnlockedMaxDay() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1; // 1..12
    const d = now.getDate();

    if (y > TARGET_YEAR) return 24;
    if (y < TARGET_YEAR) return 0;
    if (m < 12) return 0;
    return Math.min(24, d);
  }

  function getMaxOpenDay() {
    const sim = getSimulatedDay();
    if (sim !== null) return sim;
    return getRealUnlockedMaxDay();
  }

  function isDayOpen(dayNum) {
    const n = Number(dayNum);
    return Number.isFinite(n) && n >= 1 && n <= getMaxOpenDay();
  }

  function getCountdownText() {
    const now = new Date();
    const dec1 = new Date(TARGET_YEAR, 11, 1, 0, 0, 0);
    const diff = dec1.getTime() - now.getTime();
    if (diff <= 0) {
      return getSimulatedDay() === 0
        ? "Apertura el 1 de diciembre (simulación pre-diciembre)"
        : "Calendario de Adviento activo";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    if (days === 0 && hours === 0) {
      return `Apertura de la Puerta 01 en ${Math.max(1, mins)}m`;
    }
    return `Apertura de la Puerta 01 en ${days}d ${hours}h`;
  }

  function getNextDoorCountdownText() {
    const maxOpen = getMaxOpenDay();
    if (maxOpen <= 0 || maxOpen >= 24) return "";
    const nextDay = maxOpen + 1;
    const now = new Date();
    const sim = getSimulatedDay();
    const target = sim !== null
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      : new Date(TARGET_YEAR, 11, nextDay, 0, 0, 0);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return "";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const numStr = String(nextDay).padStart(2, "0");
    if (days > 0) return `Próxima puerta (Día ${numStr}) en ${days}d ${hours}h`;
    if (hours === 0) return `Próxima puerta (Día ${numStr}) en ${Math.max(1, mins)}m`;
    return `Próxima puerta (Día ${numStr}) en ${hours}h ${String(mins).padStart(2, "0")}m`;
  }

  checkUrlActivation();

  return {
    isAdminEnabled,
    enableAdmin,
    disableAdmin,
    setSimulatedDay,
    getSimulatedDay,
    getMaxOpenDay,
    isDayOpen,
    getCountdownText,
    getNextDoorCountdownText
  };
})();
