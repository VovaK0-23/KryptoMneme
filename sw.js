"use strict";(()=>{var c="krypto-mneme-cache1698329936413",l=["/","/manifest.json","/build/index.js"];self.addEventListener("install",e=>{self.skipWaiting(),e.waitUntil((async()=>{await caches.keys().then(t=>{t.forEach(s=>{caches.delete(s)})});let n=await caches.open(c);[...(await(await fetch("/KryptoMneme/manifest.json")).json()).files.map(t=>`/assets/${t}`),...l].forEach(async t=>{let s="/KryptoMneme"+t,i=await fetch(s+"?v="+Date.now().toString());n.put(s,i)}),console.log("SW install")})())});self.addEventListener("activate",e=>{e.waitUntil(clients.claim()),console.log("SW activate")});self.addEventListener("fetch",async e=>{e.respondWith(caches.open(c).then(n=>n.match(e.request).then(a=>a||fetch(e.request))))});var f=null;})();
//# sourceMappingURL=/KryptoMneme/sw.js.map
