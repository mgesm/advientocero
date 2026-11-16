/**
 * ADVIENTO CERO — MOTOR DE FECHAS (1–24 DE DICIEMBRE) Y MODO TEST OCULTO
 */

window.DateGate = (() => {
  const TARGET_YEAR = 2026;
  const ADMIN_KEY = "adviento_admin_sim_day";
  const ADMIN_FLAG = "adviento_admin_enabled";

  function checkUrlActivation() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "ventisquero") {
      localStorage.setItem(ADMIN_FLAG, "1");
      if (!localStorage.getItem(ADMIN_KEY)) {
        localStorage.setItem(ADMIN_KEY, "24");
      }
    }
  }

  function isAdminEnabled() {
    return localStorage.getItem(ADMIN_FLAG) === "1";
  }

  function enableAdmin(simDay = 24) {
    localStorage.setItem(ADMIN_FLAG, "1");
    localStorage.setItem(ADMIN_KEY, String(simDay));
  }

  function disableAdmin() {
    localStorage.removeItem(ADMIN_FLAG);
    localStorage.removeItem(ADMIN_KEY);
  }

  function setSimulatedDay(dayNum) {
    localStorage.setItem(ADMIN_KEY, String(Math.max(0, Math.min(24, Number(dayNum) || 0))));
  }

  function getSimulatedDay() {
    if (!isAdminEnabled()) return null;
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw !== null ? Number(raw) : 24;
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
    return dayNum <= getMaxOpenDay();
  }

  function getCountdownText() {
    const now = new Date();
    const dec1 = new Date(TARGET_YEAR, 11, 1, 0, 0, 0);
    const diff = dec1.getTime() - now.getTime();
    if (diff <= 0) return "Calendario de Adviento activo";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `Apertura de la Puerta 01 en ${days}d ${hours}h`;
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
    getCountdownText
  };
})();
