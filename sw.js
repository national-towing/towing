const CACHE_NAME = 'towing-pwa-v200';
const ASSETS_TO_CACHE = [
  './',
  './mark.html',
  './tow.html',
  './release.html',
  './run.html',
  './passes.html',
  './manifest-mark.json',
  './manifest-tow.json',
  './manifest-rel.json',
  './icon-mark.png',
  './icon-tow.png',
  './icon-release.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// CACHE-FIRST STRATEGY: SERVE INSTANTLY FROM LOCAL DEVICE MEMORY IF OFFLINE
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve local file immediately, update in background if online
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
