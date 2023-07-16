/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;

const CACHE_NAME = 'crypto-app-cache';

// Add whichever assets you want to pre-cache here:
const PRECACHE_ASSETS = ['/', '/manifest.json', '/build/index.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(PRECACHE_ASSETS);
      fetch('/manifest.json')
        .then((response) => response.json())
        .then((manifest) => {
          const assetUrls = manifest.files.map((file: string) => `/assets/${file}`);
          cache.addAll(assetUrls);
        });
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', async (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((response) => {
        if (response) return response;
        else return fetch(event.request);
      })
    )
  );
});

export default null;
