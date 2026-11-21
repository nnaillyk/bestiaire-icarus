// Service worker : l'app marche hors connexion.
// Fichiers de l'app : réseau d'abord (toujours à jour), cache si hors ligne.
// Images du wiki et polices : cache d'abord, gardées au fur et à mesure.
const VERSION="8";
const CACHE="bestiaire-app-v"+VERSION;
const IMG_CACHE="bestiaire-images-v1";
const FILES=["./","index.html","data.js?v="+VERSION,"items.js?v="+VERSION,"lore-en.js?v="+VERSION,"i18n.js?v="+VERSION,"loc.js?v="+VERSION,"gamefix.js?v="+VERSION,"fixes.js?v="+VERSION,"app.js?v="+VERSION,"talents.js?v="+VERSION,"features.js?v="+VERSION,"mounts.js?v="+VERSION,"extras.js?v="+VERSION,"manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==IMG_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin===location.origin){
    e.respondWith(fetch(e.request).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res;})
      .catch(()=>caches.match(e.request,{ignoreSearch:url.pathname.endsWith("/")}).then(hit=>hit||caches.match("index.html"))));
    return;
  }
  const isImg=url.hostname==="icarus.wiki.gg"&&url.pathname.startsWith("/images/");
  const isFont=url.hostname.endsWith("fonts.googleapis.com")||url.hostname.endsWith("fonts.gstatic.com");
  if(!isImg&&!isFont)return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
    if(res.ok||res.type==="opaque"){const copy=res.clone();caches.open(IMG_CACHE).then(c=>c.put(e.request,copy));}
    return res;}).catch(()=>Response.error())));
});
