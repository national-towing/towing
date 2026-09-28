const CACHE_NAME = 'towing-pwa-v300';
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

// OFFLINE CACHE-FIRST STRATEGY WITH QUERY PARAMETER IGNORING
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // Ignore Google Apps Script or Plate Recognizer API calls from cache interception
  if (e.request.url.includes('script.google.com') || e.request.url.includes('platerecognizer.com')) {
    return;
  }

  e.respondWith(
    // ignoreSearch: true matches 'tow.html?v=99999' directly to cached 'tow.html'
    caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Refresh cache quietly in background if online
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Secondary fallback: strip query string manually if ignoreSearch misses
      const cleanUrl = e.request.url.split('?')[0];
      return caches.match(cleanUrl).then((cleanResponse) => {
        if (cleanResponse) return cleanResponse;
        return fetch(e.request);
      });
    })
  );
});
