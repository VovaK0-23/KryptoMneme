"use strict";(()=>{var o="crypto-price-cache1689602243866",s=e=>"/crypto-price"+e,l=[s("/"),s("/manifest.json"),s("/build/index.js")];self.addEventListener("install",e=>{console.log("SW installing"),e.waitUntil((async()=>{let t=await caches.open(o);t.addAll(l);let c=(await(await fetch(s("/manifest.json"))).json()).files.map(i=>s(`/assets/${i}`));t.addAll(c),self.skipWaiting()})())});self.addEventListener("activate",e=>{console.log("SW activate"),e.waitUntil(clients.claim())});self.addEventListener("fetch",async e=>{e.respondWith(caches.open(o).then(t=>t.match(e.request).then(n=>{if(n){let a=n.clone();return new Response(a.body,{headers:{...a.headers,"Cache-Control":"no-store"}})}else return fetch(e.request)})))});var r=null;})();
//# sourceMappingURL=/crypto-price/sw.js.map
