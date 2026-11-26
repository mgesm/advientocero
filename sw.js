const CACHE_NAME = "adviento-cero-v2.15.0";
const CRITICAL_PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./video-briefing/index.html",
  "./video-briefing/player.css",
  "./video-briefing/player.js",
  "./css/fonts.css",
  "./css/liquid-christmas.css",
  "./css/door-rituals.css",
  "./css/advent-board.css",
  "./css/puzzles.css",
  "./css/artifacts.css",
  "./css/mobile-ux.css",
  "./fonts/font-1.woff2",
  "./fonts/font-2.woff2",
  "./fonts/font-3.woff2",
  "./fonts/font-4.woff2",
  "./fonts/font-5.woff2",
  "./fonts/font-6.woff2",
  "./fonts/font-7.woff2",
  "./fonts/font-8.woff2",
  "./fonts/font-9.woff2",
  "./fonts/font-10.woff2",
  "./config/gift-config.js",
  "./config/firebase-config.js",
  "./data/case-lore.js",
  "./data/suspects.js",
  "./data/days.js",
  "./js/vendor/firebase-app-compat.js",
  "./js/vendor/firebase-database-compat.js",
  "./js/audio-fx.js",
  "./js/door-rituals.js",
  "./js/date-gate.js",
  "./js/sync-engine.js",
  "./js/puzzle-engine.js",
  "./js/day-artifacts.js",
  "./js/app.js"
];

const OPTIONAL_PRECACHE_ASSETS = [
  "./video-briefing/briefing.mp4",
  "./video-briefing/poster.jpg",
  "./imagenes/icon.svg",
  "./imagenes/icon-192.png",
  "./imagenes/icon-512.png",
  "./imagenes/icon-512-maskable.png",
  "./imagenes/apple-touch-icon.png",
  "./imagenes/cover-hotel.jpg",
  "./imagenes/scene-lobby.jpg",
  "./imagenes/scene-balcony.jpg",
  "./imagenes/evidence/afis_huellas_final.jpg",
  "./imagenes/evidence/viales_toxicologia_final.jpg",
  "./imagenes/evidence/cuadro_electrico_final.jpg",
  "./imagenes/suspects/s01.jpg",
  "./imagenes/suspects/s02.jpg",
  "./imagenes/suspects/s03.jpg",
  "./imagenes/suspects/s04.jpg",
  "./imagenes/suspects/s05.jpg",
  "./imagenes/suspects/s06.jpg",
  "./imagenes/suspects/s07.jpg",
  "./imagenes/suspects/s08.jpg",
  "./imagenes/suspects/s09.jpg",
  "./imagenes/suspects/s10.jpg",
  "./imagenes/suspects/s11.jpg",
  "./imagenes/suspects/s12.jpg",
  "./imagenes/suspects/s13.jpg",
  "./imagenes/suspects/s14.jpg",
  "./imagenes/suspects/s15.jpg",
  "./imagenes/suspects/s16.jpg",
  "./imagenes/suspects/s17.jpg",
  "./imagenes/suspects/s18.jpg",
  "./imagenes/suspects/s19.jpg",
  "./imagenes/suspects/s20.jpg",
  "./imagenes/suspects/s21.jpg",
  "./imagenes/suspects/s22.jpg",
  "./imagenes/suspects/s23.jpg",
  "./imagenes/suspects/s24.jpg",
  "./imagenes/suspects/s25.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =>
        Promise.all(CRITICAL_PRECACHE_ASSETS.map((url) => cache.add(url)))
          .then(() => Promise.allSettled(OPTIONAL_PRECACHE_ASSETS.map((url) => cache.add(url).catch(() => null))))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function inferRangeMime(url, fallback) {
  const clean = String(url || "").toLowerCase();
  if (clean.endsWith(".mp4")) return "video/mp4";
  if (clean.endsWith(".webm")) return "video/webm";
  return fallback || "audio/mpeg";
}

async function handleRangeRequest(req, cachedResponse) {
  const blob = await cachedResponse.blob();
  const total = blob.size;
  const rangeHeader = req.headers.get("range") || "";
  const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
  const start = match ? Number(match[1]) : 0;
  const end = match && match[2] ? Math.min(total - 1, Number(match[2])) : total - 1;
  if (start >= total || start > end) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${total}` }
    });
  }
  const sliced = blob.slice(start, end + 1);
  return new Response(sliced, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": inferRangeMime(req.url, cachedResponse.headers.get("Content-Type")),
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(sliced.size)
    }
  });
}

function fetchWithTimeout(req, ms) {
  if (typeof AbortController === "undefined") return fetch(req);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(req, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function safeCachePut(cacheName, req, res) {
  const copy = res.clone();
  return caches.open(cacheName).then((c) => c.put(req, copy)).catch(() => null);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  const url = new URL(req.url);
  if (req.headers.has("range")) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return handleRangeRequest(req, cached);
        return fetch(req).catch(() => new Response("", { status: 503, statusText: "Offline" }));
      })
    );
    return;
  }

  if (url.pathname.toLowerCase().endsWith(".pdf")) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            event.waitUntil(safeCachePut(CACHE_NAME, req, res));
          }
          return res;
        }).catch(() => new Response("Offline", { status: 503, statusText: "Offline" }));
      })
    );
    return;
  }

  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetchWithTimeout(req, 2500).then((res) => {
        if (res && res.ok) {
          event.waitUntil(safeCachePut(CACHE_NAME, req, res));
        }
        return res;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true }).then((cached) => cached || caches.match("./index.html"))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          event.waitUntil(safeCachePut(CACHE_NAME, req, res));
        }
        return res;
      }).catch(() => new Response("", { status: 503, statusText: "Offline" }));
    })
  );
});
