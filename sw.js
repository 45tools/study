const C="study-2026.11.20-3";
const FILES=["./", "index.html", "data.js", "math.js", "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:"reload"})))).catch(()=>{}));self.skipWaiting();});
// 音声（audio/）は版をまたいで残す
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!==C&&x!=="study-audio").map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||!r.url.startsWith(self.location.origin)) return;
  const key=r.url.split("#")[0].split("?")[0];
  if(key.includes("/audio/")){ e.respondWith(caches.open("study-audio").then(c=>c.match(key).then(m=>m||fetch(r).then(res=>{ if(res.ok) c.put(key,res.clone()); return res; })))); return; }
  e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(key,cp)); } return res; })
    .catch(()=>caches.match(key).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||(r.mode==="navigate"?caches.match(new URL("index.html",self.registration.scope).href):undefined))));
});
