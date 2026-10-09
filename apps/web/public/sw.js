// ExploreBharat Service Worker (v1.0.0)
const CACHE_NAME = 'explorebharat-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/wallet',
  '/trips',
  '/destinations',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/logo.svg',
  '/logo-dark.svg',
  '/logo-compact.svg'
];

// Install: Cache critical shell and static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some assets failed to precache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for navigation/HTML, Stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and API calls
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api')) return;

  // Static images and fonts: Cache-first
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
      })
    );
    return;
  }

  // HTML Page Navigation: Network first, fallback to cache, then offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          // If specific page is not cached, return the offline fallback
          const offlinePage = await caches.match('/offline');
          if (offlinePage) return offlinePage;

          return new Response(
            `<!DOCTYPE html>
            <html>
              <head><title>Offline - ExploreBharat</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
              <body style="font-family:sans-serif;text-align:center;padding:50px 20px;background:#FAF8F5;color:#292524;">
                <h1 style="color:#B45309;">ExploreBharat Offline</h1>
                <p>You are currently offline without internet connectivity.</p>
                <p><a href="/wallet" style="color:#EA580C;font-weight:bold;">Open Travel Wallet (Cached Passes)</a></p>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Stale-While-Revalidate for script and style bundles
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
