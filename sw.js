"use strict";(()=>{var i="crypto-price-cache1689611550438",s=e=>"/crypto-price"+e,o=[s("/"),s("/manifest.json"),s("/build/index.js")];self.addEventListener("install",e=>{self.skipWaiting(),e.waitUntil((async()=>{await caches.keys().then(t=>{t.forEach(c=>{caches.delete(c)})});let a=await caches.open(i);[...(await(await fetch(s("/manifest.json"))).json()).files.map(t=>s(`/assets/${t}`)),...o].forEach(async t=>{let c=await fetch(t+"?v="+Date.now().toString(),{headers:{"Cache-Control":"no-cache"}});a.put(t,c)}),console.log("SW install")})())});self.addEventListener("activate",e=>{e.waitUntil(clients.claim()),console.log("SW activate")});self.addEventListener("fetch",async e=>{e.respondWith(caches.open(i).then(a=>a.match(e.request).then(n=>n||fetch(e.request))))});var h=null;})();
//# sourceMappingURL=/crypto-price/sw.js.map
