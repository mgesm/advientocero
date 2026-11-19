const CACHE_NAME = "adviento-cero-v2.9.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./video-briefing/index.html",
  "./video-briefing/audio/act-1.mp3",
  "./video-briefing/audio/act-2.mp3",
  "./video-briefing/audio/act-3.mp3",
  "./video-briefing/audio/act-4.mp3",
  "./video-briefing/audio/act-5.mp3",
  "./video-briefing/audio/act-6.mp3",
  "./css/liquid-christmas.css",
  "./css/advent-board.css",
  "./css/puzzles.css",
  "./css/artifacts.css",
  "./css/mobile-ux.css",
  "./config/gift-config.js",
  "./config/firebase-config.js",
  "./data/case-lore.js",
  "./data/suspects.js",
  "./data/days.js",
  "./js/vendor/firebase-app-compat.js",
  "./js/vendor/firebase-database-compat.js",
  "./js/audio-fx.js",
  "./js/date-gate.js",
  "./js/sync-engine.js",
  "./js/puzzle-engine.js",
  "./js/day-artifacts.js",
  "./js/app.js",
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
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

async function handleRangeRequest(req, cachedResponse) {
  const buf = await cachedResponse.arrayBuffer();
  const total = buf.byteLength;
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
  const sliced = buf.slice(start, end + 1);
  return new Response(sliced, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": cachedResponse.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(sliced.byteLength)
    }
  });
}

function fetchWithTimeout(req, ms) {
  if (typeof AbortController === "undefined") return fetch(req);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(req, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  const url = new URL(req.url);
  if (req.headers.has("range")) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return handleRangeRequest(req, cached);
        return fetch(req);
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
            const copy = res.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((c) => c.put(req, copy)));
          }
          return res;
        });
      })
    );
    return;
  }

  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetchWithTimeout(req, 2500).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((c) => c.put(req, copy)));
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
          const copy = res.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((c) => c.put(req, copy)));
        }
        return res;
      });
    })
  );
});
