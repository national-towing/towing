const CACHE_NAME = 'tow-app-v1';
const ASSETS = [
  './',
  './run.html',
  './tow.html',
  './passes.html',
  './release.html',
  './manifest-run.json',
  './manifest-tow.json'
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
  // Network first, fall back to cache for HTML/Assets
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
