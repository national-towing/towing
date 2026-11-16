const CACHE_NAME = 'towing-app-shell-v80001';
const APP_SHELL = [
  './',
  './mark.html',
  './run.html',
  './tow.html',
  './admin.html',
  './yard.html',
  './release.html',
  './manifest-mark.json',
  './manifest-run.json',
  './manifest-tow.json',
  './manifest-release.json',
  './icon-mark.png',
  './icon-manager.png',
  './icon-tow.png',
  './icon-release.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        APP_SHELL.map((url) => cache.add(url).catch(() => null))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never intercept external API calls (Google Apps Script, Tailscale Bot, Drive images)
  if (url.origin !== self.location.origin) return;

  // Network-first with fast 3s timeout, falling back to cache (ignoring ?rego=... query params)
  event.respondWith(
    new Promise((resolve) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          caches.match(req, { ignoreSearch: true }).then((cached) => {
            if (cached) resolve(cached);
          });
        }
      }, 3000);

      fetch(req)
        .then((networkRes) => {
          clearTimeout(timer);
          if (networkRes && networkRes.ok) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          if (!settled) {
            settled = true;
            resolve(networkRes);
          }
        })
        .catch(() => {
          clearTimeout(timer);
          if (!settled) {
            settled = true;
            caches.match(req, { ignoreSearch: true }).then((cached) => {
              resolve(cached || new Response('Offline', { status: 503 }));
            });
          }
        });
    })
  );
});
