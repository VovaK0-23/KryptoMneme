"use strict";
(() => {
  // src/sw.ts
  var CACHE_NAME = "crypto-price-cache1689598147698";
  var publicPath = (str) => "" + str;
  var PRECACHE_ASSETS = [
    publicPath("/"),
    publicPath("/manifest.json"),
    publicPath("/build/index.js")
  ];
  self.addEventListener("install", (event) => {
    console.log("SW installing");
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(PRECACHE_ASSETS);
        const response = await fetch(publicPath("/manifest.json"));
        const manifest = await response.json();
        const assetUrls = manifest.files.map((file) => publicPath(`/assets/${file}`));
        cache.addAll(assetUrls);
      })()
    );
  });
  self.addEventListener("activate", (event) => {
    console.log("SW activate");
    event.waitUntil(clients.claim());
  });
  self.addEventListener("fetch", async (event) => {
    event.respondWith(
      caches.open(CACHE_NAME).then(
        (cache) => cache.match(event.request).then((response) => {
          if (true) {
            return fetch(event.request);
          }
          if (response)
            return response;
          else
            return fetch(event.request);
        })
      )
    );
  });
  var sw_default = null;
})();
//# sourceMappingURL=swAUT5APNO.js.map
