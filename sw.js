"use strict";(()=>{var n="crypto-price-cache1689600149638",s=e=>"/crypto-price"+e,i=[s("/"),s("/manifest.json"),s("/build/index.js")];self.addEventListener("install",e=>{console.log("SW installing"),e.waitUntil((async()=>{let a=await caches.open(n);a.addAll(i);let c=(await(await fetch(s("/manifest.json"))).json()).files.map(l=>s(`/assets/${l}`));a.addAll(c),self.skipWaiting()})())});self.addEventListener("activate",e=>{console.log("SW activate"),e.waitUntil(clients.claim())});self.addEventListener("fetch",async e=>{e.respondWith(caches.open(n).then(a=>a.match(e.request).then(t=>t?(t.headers.set("Cache-Control","no-store, no-cache, must-revalidate, max-age=0"),console.log(t),t):fetch(e.request))))});var r=null;})();
//# sourceMappingURL=/crypto-price/sw.js.map
