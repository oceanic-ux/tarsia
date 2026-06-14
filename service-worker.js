// Tarsia Service Worker — Oceanic Software
// Stratégie : Cache-first pour les ressources locales, network-first pour KaTeX CDN

const CACHE_NAME = 'tarsia-v1';
const STATIC_ASSETS = [
  './tarsia-pwa.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './icon-maskable-512.svg',
  './favicon.svg',
  './apple-touch-icon.svg'
];
const KATEX_ASSETS = [
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js'
];

// Install: cache all static assets and KaTeX
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS)
        .then(function() {
          // KaTeX CDN — best-effort cache
          return cache.addAll(KATEX_ASSETS).catch(function(err) {
            console.warn('[SW] KaTeX CDN cache failed (network unavailable):', err);
          });
        });
    })
  );
});

// Activate: delete old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// Fetch: cache-first for local, stale-while-revalidate for CDN
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and non-http(s) URLs
  if (!url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      // For CDN assets: return cache immediately, refresh in background
      if (cached) {
        if (url.includes('cdn.jsdelivr.net')) {
          // Stale-while-revalidate
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          }).catch(function() {});
        }
        return cached;
      }
      // Not in cache: fetch from network and cache
      return fetch(event.request).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          var clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      });
    })
  );
});
