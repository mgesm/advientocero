const CACHE_NAME = "adviento-cero-v1.2.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/liquid-christmas.css?v=1.2.0",
  "./css/advent-board.css?v=1.2.0",
  "./css/puzzles.css?v=1.2.0",
  "./css/mobile-ux.css?v=1.2.0",
  "./config/gift-config.js?v=1.0.0",
  "./config/firebase-config.js?v=1.0.0",
  "./data/case-lore.js?v=1.0.0",
  "./data/suspects.js?v=1.0.0",
  "./data/days.js?v=1.0.0",
  "./js/audio-fx.js?v=1.0.0",
  "./js/date-gate.js?v=1.0.0",
  "./js/sync-engine.js?v=1.0.0",
  "./js/puzzle-engine.js?v=1.0.0",
  "./js/app.js?v=1.1.0",
  "./imagenes/icon.svg",
  "./imagenes/cover-hotel.jpg",
  "./imagenes/scene-lobby.jpg",
  "./imagenes/scene-balcony.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
