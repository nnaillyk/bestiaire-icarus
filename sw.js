// Service worker : met l'app en cache pour qu'elle marche hors connexion
// Les images du wiki sont gardées au fur et à mesure qu'on les affiche.
const CACHE="bestiaire-v2";
const IMG_CACHE="bestiaire-images-v1";
const FILES=["./","index.html","data.js","items.js","lore-en.js","i18n.js","app.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==IMG_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  const isImg=url.hostname==="icarus.wiki.gg"&&url.pathname.startsWith("/images/");
  const store=isImg?IMG_CACHE:CACHE;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(res.ok||res.type==="opaque"){
      if(isImg||url.origin===location.origin||url.hostname.endsWith("fonts.googleapis.com")||url.hostname.endsWith("fonts.gstatic.com")){const copy=res.clone();caches.open(store).then(c=>c.put(e.request,copy));}
    }
    return res;}).catch(()=>isImg?Response.error():caches.match("index.html"))));
});
