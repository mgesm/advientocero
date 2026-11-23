(() => {
  const vid = document.getElementById("briefing-video");
  if (!vid) return;
  try {
    if (window.localStorage.getItem("adviento_muted") === "1") {
      vid.muted = true;
    }
  } catch (_) {}
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !vid.paused) vid.pause();
  });
  window.addEventListener("pagehide", () => {
    if (!vid.paused) vid.pause();
  });
})();
