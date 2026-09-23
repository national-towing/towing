const CACHE_NAME = 'tow-app-v800';
const ASSETS = [
  './',
  './run.html?v=800',
  './mark.html?v=800',
  './tow.html?v=800',
  './passes.html?v=800',
  './release.html?v=800',
  './manifest-run.json?v=800',
  './manifest-mark.json?v=800',
  './manifest-tow.json?v=800',
  './manifest-pass.json?v=800'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
