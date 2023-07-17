"use strict";
(() => {
  // src/sw.ts
  var CACHE_NAME = "crypto-price-cache1689612073637";
  var publicPath = (str) => "" + str;
  var PRECACHE_ASSETS = [
    publicPath("/"),
    publicPath("/manifest.json"),
    publicPath("/build/index.js")
  ];
  self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
      (async () => {
        await caches.keys().then((cacheNames) => {
          cacheNames.forEach((name) => {
            caches.delete(name);
          });
        });
        const cache = await caches.open(CACHE_NAME);
        const response = await fetch(publicPath("/manifest.json"));
        const manifest = await response.json();
        const assetUrls = manifest.files.map((file) => publicPath(`/assets/${file}`));
        [...assetUrls, ...PRECACHE_ASSETS].forEach(async (url) => {
          const response2 = await fetch(url + "?v=" + Date.now().toString());
          cache.put(url, response2);
        });
        console.log("SW install");
      })()
    );
  });
  self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
    console.log("SW activate");
  });
  self.addEventListener("fetch", async (event) => {
    event.respondWith(
      caches.open(CACHE_NAME).then(
        (cache) => cache.match(event.request).then((response) => {
          if (response) {
            return response;
          } else
            return fetch(event.request);
        })
      )
    );
  });
  var sw_default = null;
})();
//# sourceMappingURL=sw.js.map
