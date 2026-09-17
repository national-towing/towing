const CACHE_NAME = 'tow-app-v2';
const ASSETS = [
  './',
  './run.html',
  './mark.html',
  './tow.html',
  './passes.html',
  './release.html',
  './manifest-run.json',
  './manifest-mark.json',
  './manifest-tow.json',
  './manifest-pass.json'
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
