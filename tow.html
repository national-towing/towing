const CACHE_NAME = 'mark-app-v9999';
const ASSETS_TO_CACHE = [
  './',
  './mark.html?v=9999',
  './run.html?v=9999',
  './tow.html?v=9999',
  './release.html?v=9999',
  './passes.html?v=9999',
  './manifest-mark.json?v=9999',
  './manifest-tow.json?v=9999',
  './manifest-rel.json?v=9999'
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

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
