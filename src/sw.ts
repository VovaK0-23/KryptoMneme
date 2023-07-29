/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;

const CACHE_NAME = 'krypto-mneme-cache' + SW_VERSION;

// Add whichever assets you want to pre-cache here:
const PRECACHE_ASSETS = ['/', '/manifest.json', '/build/index.js'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      await caches.keys().then((cacheNames) => {
        cacheNames.forEach((name) => {
          caches.delete(name);
        });
      });

      const cache = await caches.open(CACHE_NAME);

      const response = await fetch(PUBLIC_PATH + '/manifest.json');
      const manifest = await response.json();
      const assetUrls = manifest.files.map((file: string) => `/assets/${file}`);

      [...assetUrls, ...PRECACHE_ASSETS].forEach(async (url) => {
        const fullUrl = PUBLIC_PATH + url;
        const response = await fetch(fullUrl + '?v=' + Date.now().toString());
        cache.put(fullUrl, response);
      });
      console.log('SW install');
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  console.log('SW activate');
});

self.addEventListener('fetch', async (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((response) => {
        if (NODE_ENV === 'development') return fetch(event.request);

        if (response) return response;
        else return fetch(event.request);
      })
    )
  );
});

export default null;
