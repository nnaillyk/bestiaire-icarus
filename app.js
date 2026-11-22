// Bestiaire d'Icarus — logique de l'app (navigation, filtres, fiches, objets, crafts, paramètres)
const RANK={A:3,N:2,P:1};
const LOGMAX=Math.log(7500), LOGMIN=Math.log(80);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const byName=Object.fromEntries(C.map(c=>[c[0],c]));
const wiki=n=>"https://icarus.wiki.gg/wiki/"+encodeURIComponent((WIKI_ALIAS[n]||n).replace(/ /g,"_"));
const kindOf=c=>c[10]||"faune";
const qmax=q=>+String(q).split("-").pop();
const PAGE=120;

/* ---------- Réglages ---------- */
const PREF_KEY="icarus-bestiaire";
const prefs={sort:"danger",lang:"fr",theme:"auto"};
try{Object.assign(prefs,JSON.parse(localStorage.getItem(PREF_KEY)||"{}"));}catch(e){}
const savePrefs=()=>{try{localStorage.setItem(PREF_KEY,JSON.stringify(prefs))}catch(e){}};
const T=()=>UI[prefs.lang];
const FR=()=>prefs.lang==="fr";

/* ---------- Objets et recettes (items.js) ---------- */
// ITEMS : [id, nom, groupe, description, image, pile]
const ITEM_BY_NAME={};ITEMS.forEach((it,i)=>{if(ITEM_BY_NAME[it[1]]===undefined)ITEM_BY_NAME[it[1]]=i;});
const pairs=s=>s?s.split(",").map(p=>p.split("*").map(Number)):[];
const REC=RECIPES.map((r,k)=>({k,outs:pairs(r[0]),ins:pairs(r[1]),st:r[2]?r[2].split(",").map(Number):[],ex:r[3]||"",ro:r[4]||""}));
const MADE_BY={},USED_IN={};
REC.forEach(r=>{r.outs.forEach(([i])=>(MADE_BY[i]??=[]).push(r));r.ins.forEach(([i])=>{(USED_IN[i]??=[]).push(r);});});
for(const k in USED_IN)USED_IN[k]=[...new Set(USED_IN[k])];

/* ---------- Traduction des données ---------- */
const creL=n=>L_CRE[LORE_ALIAS[n]||n];
const cname=n=>FR()?(creL(n)?.[0]||NAME_FR[n]||n):n;
const cdesc=c=>FR()?(creL(c[0])?.[1]||c[8]):(LORE_EN[LORE_ALIAS[c[0]]||c[0]]||c[8]);
const bioName=b=>FR()?(L_BIOMES[b]||b):b;
const trait=s=>FR()?s:s.split(" · ").map(t=>TOK_EN[t]??WORD_EN.reduce((a,[f,e])=>a.replace(f,e),t)).join(" · ");
const zl=z=>FR()?ZL[z]:ZL_EN[z];
const mapName=k=>k==="ferme"&&!FR()?MAPS_EN.ferme.name:MAPS[k].name;
const mapF=(k,f)=>FR()?MAPS[k][f]:MAPS_EN[k][f];
const catName=k=>FR()?CATS[k][0]:CATS_EN[k];
const iname=i=>i==="Vestige"?"Vestiges":FR()?(ITEM_BY_NAME[i]!==undefined?FR_NAMES[ITEM_BY_NAME[i]]:(IT[i]?.[0]||i)):i;          // nom d'un objet de butin
const FR_NAMES=ITEMS.map((it,i)=>L_ITEMS[i]?.[0]||frItemName(it[1]));
const idesc=i=>FR()?(L_ITEMS[i]?.[1]||ITEMS[i][3]):ITEMS[i][3];
const xname=idx=>FR()?FR_NAMES[idx]:ITEMS[idx][1];  // nom d'un objet du catalogue
const gname=g=>GROUP_L[prefs.lang][g];
const stname=s=>{const n=STATIONS[s][0];return FR()?(L_STATIONS[s]||STATION_FR[n]||n):n;};
const extra=s=>FR()?EXTRA_FR.reduce((a,[e,f])=>a.split(e).join(f),Object.entries(L_TAGS).reduce((a,[e,f])=>f?a.split(e).join(f):a,s)):s.replace(/_/g," ");
const beh=b=>BEH_L[prefs.lang][b];
const tame=t=>TAME_L[prefs.lang][t]||"";
const kindL=k=>KIND_L[prefs.lang][k];

/* ---------- Images ---------- */
const imgTag=(file,cls,fallbackHtml)=>file?`<span class="pic ${cls||""}">${fallbackHtml||""}<img src="${IMG_BASE}${encodeURI(file)}" alt="" loading="lazy" decoding="async" onerror="this.remove()"></span>`:`<span class="pic ${cls||""}">${fallbackHtml||""}</span>`;
const creImg=n=>CRE_IMG[n]||CRE_IMG_FALLBACK[n]||"";
function glyphTxt(name){const w=name.replace(/^Raw /,"").replace(/\(.*\)/,"").trim().split(/[\s-]+/);return (w.length>1?w[0][0]+w[1][0]:w[0].slice(0,2)).toUpperCase();}
function lootIcon(item,big){const ci=ITEM_BY_NAME[item];const cat=IT[item]?.[1]||"res";
  const fb=`<span class="glyph" style="--g:${CATS[cat][1]}">${esc(glyphTxt(item))}</span>`;
  return imgTag(ci!==undefined?ITEMS[ci][4]:"",big?"big":"",fb);}
function itemIcon(idx,big){const it=ITEMS[idx];const fb=`<span class="glyph" style="--g:${GROUP_COLOR[it[2]]}">${esc(glyphTxt(it[1]))}</span>`;return imgTag(it[4],big?"big":"",fb);}

/* ---------- Butin des créatures ---------- */
function parseLoot(n){const s=LOOT[n];const rows=s?s.split(";").map(r=>{const m=r.match(/^(.*) (\d+(?:-\d+)?) (\d+)$/);return {item:m[1],qty:m[2],ch:+m[3],tx:m[1]==="Vestige"}}):[];
  if(!NO_VESTIGE.has(n)&&!rows.some(r=>r.tx))rows.push({item:"Vestige",qty:"1",ch:100,tx:true});return rows;}
const LOOTS=Object.fromEntries(C.map(c=>[c[0],parseLoot(c[0])]));
const SOURCES={};
for(const [n,rows] of Object.entries(LOOTS))for(const r of rows)(SOURCES[r.item]??=[]).push({n,...r});

function zonesOf(c,map){const v=c[9][map];if(v===undefined)return null;if(v==="")return {z:[],b:[]};
  if(v.startsWith("@"))return {z:v.slice(1).split(","),b:[]};
  const b=v.split(", ");return {z:[...new Set(b.map(x=>B2Z[x]).filter(Boolean))],b};}

/* ---------- Thème ---------- */
function applyTheme(){const r=document.documentElement;if(prefs.theme==="auto")delete r.dataset.theme;else r.dataset.theme=prefs.theme;r.lang=prefs.lang;}
const isDark=()=>{const t=document.documentElement.dataset.theme;return t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);};
const CRAFT_ACCENT=["#2f7a6e","#d6ece8","#7fd1c2","#173430"];
const TREE_ACCENT=["#7a4fa0","#ebe0f4","#c4a3ea","#2c2140"],GUIDE_ACCENT=["#a0601f","#f3e4d2","#e8a868","#3a2716"];
function accentOf(k){const a=k==="objets"?IDX_ACCENT:k==="crafts"?CRAFT_ACCENT:k==="arbres"?TREE_ACCENT:k==="guide"?GUIDE_ACCENT:k==="montures"?["#8a5a2b","#f1e4d6","#e0a86e","#36261a"]:k==="poissons"?["#2a6f97","#d7e9f4","#7cc0e8","#15303f"]:k==="cartes"?["#4a6b2f","#e0ecd4","#a6d07c","#1f2e14"]:k==="save"?["#8a2f4a","#f3dde4","#e88aa6","#3a1620"]:k==="nourriture"?["#9a4a1c","#f5e2d4","#f0a070","#3a1f10"]:MAPS[k].accent;return isDark()?[a[2],a[3]]:[a[0],a[1]];}
function setAccent(){const [m,s]=accentOf(state.view);const r=document.documentElement.style;r.setProperty("--map",m);r.setProperty("--map-soft",s);
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=isDark()?"#161c19":"#e4e9e6";}

const state={view:"olympus",lastRegion:"olympus",kind:"all",beh:"all",tame:"all",zone:"all",q:"",
  xq:"",xcat:"all",xf:"all",xlim:PAGE,rq:"",rst:"all",rlim:PAGE,stack:[]};

/* ---------- Chrome ---------- */
const GEAR=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
const TAB_ICONS={best:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 4c1 3 1 6-1 9M12 3c1 4 1 8-1 12M17 4c1 3 1 6-1 9"/><path d="M5 19h14"/></svg>`,
 objets:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/></svg>`,
 crafts:`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6-3 3-6-6zM11 7l-7 7 3 3 7-7"/><path d="M4 20h7"/></svg>`};
function renderChrome(){
  const t=T();
  const count=k=>k==="objets"?ITEMS.length:k==="crafts"?REC.length:k==="arbres"?TREES.length:k==="guide"?"":k==="montures"?MOUNTS.length:k==="poissons"?FISH.length:k==="cartes"?"":k==="save"?"":k==="nourriture"?FOODS.length:C.filter(c=>c[9][k]!==undefined).length;
  const label=k=>k==="objets"?t.objects:k==="crafts"?t.crafts:k==="arbres"?t.trees:k==="guide"?t.guide:k==="montures"?t.mounts:k==="poissons"?t.fish:k==="cartes"?t.maps:k==="save"?"Save Manager":k==="nourriture"?t.food:mapName(k);
  const link=k=>`<a class="navlink" href="#${k}" style="--c:${accentOf(k)[0]}" ${k===state.view?'aria-current="page"':""}><span class="dot"></span>${label(k)}<span class="ct">${count(k)}</span></a>`;
  document.getElementById("sidebar").innerHTML=`
    <p class="brand"><small>${t.brand_small}</small>${t.brand}</p>
    <nav class="navgroup" aria-label="${t.regions}"><h2>${t.regions}</h2>${REGIONS.map(link).join("")}${link("ferme")}</nav>
    <nav class="navgroup" aria-label="${t.index}"><h2>${t.index}</h2>${["cartes","montures","poissons","nourriture","objets","crafts","arbres","guide","save"].map(link).join("")}</nav>
    <button class="navlink setbtn" type="button" data-settings>${GEAR}<span>${t.settings}</span></button>
    <div class="sidefoot">${t.sources}</div>`;
  document.getElementById("mtop").innerHTML=`<p class="brand">${t.brand}</p><button class="iconbtn" type="button" data-settings aria-label="${t.settings}">${GEAR}</button>`;
  const inBest=MAPS[state.view]!==undefined||state.view==="montures"||state.view==="poissons"||state.view==="cartes";
  document.getElementById("tabbar").innerHTML=`
    <a href="#${state.lastRegion}" ${inBest?'aria-current="page"':""}>${TAB_ICONS.best}<span>${t.bestiary}</span></a>
    <a href="#objets" ${state.view==="objets"?'aria-current="page"':""}>${TAB_ICONS.objets}<span>${t.objects}</span></a>
    <a href="#crafts" ${state.view==="crafts"?'aria-current="page"':""}>${TAB_ICONS.crafts}<span>${t.crafts}</span></a>
    <a href="#arbres" ${state.view==="arbres"?'aria-current="page"':""}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M12 7.5v4M12 11.5 7 15.8M12 11.5l5 4.3"/></svg><span>${t.trees}</span></a>
    <a href="#guide" ${state.view==="guide"?'aria-current="page"':""}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/></svg><span>${t.guide}</span></a>`;
  document.querySelectorAll("[data-settings]").forEach(b=>b.onclick=()=>openSheet({type:"settings"},true));
  document.getElementById("sheetBack").setAttribute("aria-label",t.back);
  document.getElementById("sheetClose").setAttribute("aria-label",t.close);
  document.title=t.brand;
}

const SEARCH_ICON=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="7" cy="7" r="4.8"/><path d="m10.6 10.6 3.4 3.4"/></svg>`;
function seg(key,opts,cls){return `<div class="seg ${cls||""}" role="group">${opts.map(([v,l])=>`<button type="button" data-k="${key}" data-v="${v}" aria-pressed="${state[key]===v}">${l}</button>`).join("")}</div>`;}
function wireSegs(root,after){root.querySelectorAll(".seg button[data-k]").forEach(b=>b.onclick=()=>{state[b.dataset.k]=b.dataset.v;b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));after();});}
const regionSwitch=()=>`<nav class="regionsw" aria-label="${T().regions}">${[...REGIONS,"ferme","cartes","montures","poissons"].map(k=>`<a href="#${k}" style="--c:${accentOf(k)[0]}" ${k===state.view?'aria-current="page"':""}>${k==="montures"?T().mounts:k==="poissons"?T().fish:k==="cartes"?T().maps:mapName(k)}</a>`).join("")}</nav>`;

/* ---------- Vue région ---------- */
function renderMap(){
  const t=T(),k=state.view,m=MAPS[k];const list=C.filter(c=>c[9][k]!==undefined);
  const cnt=b=>list.filter(c=>c[1]===b).length;const tm=list.filter(c=>c[3]!=="0").length;const only=list.filter(c=>Object.keys(c[9]).length===1).length;
  const bosses=list.filter(c=>["boss","hunt","alpha"].includes(kindOf(c))).length;
  const kinds=[["all",t.all],["faune",t.fauna_k],...(m.special?[]:[["boss",t.boss_k],["grotte",t.cave_k]])];
  if(!kinds.some(x=>x[0]===state.kind))state.kind="all";
  const hunt=mapF(k,"hunt");
  document.getElementById("view").innerHTML=`${regionSwitch()}
  <section class="hero">
    <div><h1>${mapName(k)}</h1>
      <div class="facts"><span><b>${mapF(k,"tag")}</b></span>${m.diff?`<span>${t.difficulty} <span class="diff" aria-label="${m.diff}/4">${"◆".repeat(m.diff)}${"◇".repeat(4-m.diff)}</span></span>`:""}<span>${mapF(k,"size")}</span>${m.special?"":`<span>${t.exclusive(only)}</span>`}</div>
      <p>${mapF(k,"text")}</p></div>
    <div class="stats"><h3>${m.special?t.animals:t.fauna}</h3>
      <div class="counts"><div><strong>${list.length}</strong><span>${t.species}</span></div><div><strong style="color:var(--aggr)">${cnt("A")}</strong><span>${t.aggressive_n}</span></div><div><strong style="color:var(--neut)">${bosses}</strong><span>${t.bosses_n}</span></div><div><strong style="color:var(--tame)">${tm}</strong><span>${t.tame_n}</span></div></div>
      <div class="hunt"><h3>${t.great_hunt}</h3>${hunt?`<b>${hunt[0]}</b> · ${hunt[1]}`:m.special?t.farm_hunt:t.no_hunt}</div></div>
  </section>
  <div class="toolbar">
    <label class="search">${SEARCH_ICON}<input id="q" type="search" placeholder="${t.search_c}" value="${esc(state.q)}" aria-label="${t.search_c}"></label>
    ${seg("kind",kinds)}
    ${seg("beh",[["all",t.all],["A",t.aggr_f],["N",t.neut_f],["P",t.pass_f]])}
    ${seg("tame",[["all",t.all],["yes",t.tame_f]])}
    <select id="zone" aria-label="${t.all_zones}"><option value="all">${t.all_zones}</option>${m.zones.map(z=>`<option value="${z}" ${state.zone===z?"selected":""}>${zl(z)}</option>`).join("")}</select>
    <select id="sort" aria-label="${t.sort_danger}"><option value="danger">${t.sort_danger}</option><option value="hp">${t.sort_hp}</option><option value="name">${t.sort_name}</option></select>
  </div>
  <div class="result" id="result"></div>
  <div class="grid" id="grid"></div>`;
  const v=document.getElementById("view");
  v.querySelector("#sort").value=prefs.sort;
  v.querySelector("#q").oninput=e=>{state.q=e.target.value;renderGrid();};
  v.querySelector("#zone").onchange=e=>{state.zone=e.target.value;renderGrid();};
  v.querySelector("#sort").onchange=e=>{prefs.sort=e.target.value;savePrefs();renderGrid();};
  wireSegs(v,renderGrid);
  renderGrid();
}

function renderGrid(){
  const t=T(),k=state.view,q=state.q.trim().toLowerCase();
  let list=C.filter(c=>c[9][k]!==undefined)
    .filter(c=>state.kind==="all"||(state.kind==="boss"?["boss","hunt","alpha"].includes(kindOf(c)):kindOf(c)===state.kind))
    .filter(c=>state.beh==="all"||c[1]===state.beh)
    .filter(c=>state.tame==="all"||c[3]!=="0")
    .filter(c=>state.zone==="all"||zonesOf(c,k).z.includes(state.zone))
    .filter(c=>!q||[c[0],cname(c[0]),c[5],c[6],c[7],trait(c[5]),trait(c[6]),trait(c[7]),cdesc(c),c[9][k],LOOT[c[0]]||"",LOOTS[c[0]].map(r=>iname(r.item)).join(" ")].join(" ").toLowerCase().includes(q));
  const by={danger:(a,b)=>RANK[b[1]]-RANK[a[1]]||(b[4]||0)-(a[4]||0),hp:(a,b)=>(b[4]||0)-(a[4]||0),name:(a,b)=>cname(a[0]).localeCompare(cname(b[0]),prefs.lang)}[prefs.sort];
  list.sort(by);
  document.getElementById("result").textContent=t.result(list.length);
  document.getElementById("grid").innerHTML=list.length?list.map(c=>{
    const [n,b,d,tm,hp]=c;const zi=zonesOf(c,k);const w=hp?Math.max(4,Math.round((Math.log(hp)-LOGMIN)/(LOGMAX-LOGMIN)*100)):0;
    const top=LOOTS[n].filter(r=>!r.tx&&r.ch===100).slice(0,3).map(r=>iname(r.item));
    const kd=kindOf(c);
    return `<button class="cc ${b}" type="button" data-c="${esc(n)}">
      <div class="hd">${imgTag(creImg(n),"thumb",`<span class="glyph" style="--g:var(--soft);color:var(--muted)">${esc(glyphTxt(n))}</span>`)}<div class="ttl"><h3>${esc(cname(n))}</h3><div class="sub">${FR()&&cname(n)!==n?esc(n)+" · ":""}${d==="C"?t.carn:t.herb}${zi.z.length?" · "+zi.z.map(zl).join(", "):""}</div></div><span class="pill ${b}">${beh(b)}</span></div>
      <div class="hp"><span>${FR()?"PV":"HP"}</span><span class="bar"><i style="width:${w}%"></i></span><b>${hp?hp.toLocaleString(prefs.lang):t.nc}</b></div>
      <div class="mini">${top.length?top.map(x=>`<span>${esc(x)}</span>`).join(""):`<span>${t.no_loot}</span>`}</div>
      <div class="ft"><span class="tame">${kindL(kd)&&kd!=="ferme"?`<span class="kind">${kindL(kd)}</span> `:""}${tame(tm)}</span><span>${kd==="ferme"?t.workshop:Object.keys(c[9]).length>1?t.regions_n(Object.keys(c[9]).length):t.exclusive_s}</span></div>
    </button>`}).join(""):`<div class="empty">${t.none_c(mapName(k))}</div>`;
  document.querySelectorAll(".cc").forEach(el=>el.onclick=()=>openSheet({type:"c",id:el.dataset.c},true));
}

/* ---------- Vue objets (catalogue complet) ---------- */
function renderCatalog(){
  const t=T();
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${t.catalog_title}</h1>
    <div class="facts"><span><b>${ITEMS.length} ${t.items_k}</b></span><span>${REC.length} ${t.recipes_k}</span><span>${STATIONS.length-1} ${t.stations_k}</span></div>
    <p>${t.catalog_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${t.img_note}${t.names_note?"<br>"+t.names_note:""}</div></div>
  </section>
  <div class="toolbar">
    <label class="search">${SEARCH_ICON}<input id="xq" type="search" placeholder="${t.search_x}" value="${esc(state.xq)}" aria-label="${t.search_x}"></label>
    ${seg("xf",[["all",t.f_all],["loot",t.f_loot],["craft",t.f_craft]])}
    <select id="xcat" aria-label="${t.all_cats}"><option value="all">${t.all_cats}</option>${GROUP_ORDER.map(g=>`<option value="${g}" ${state.xcat===g?"selected":""}>${gname(g)}</option>`).join("")}</select>
  </div>
  <div class="result" id="result"></div>
  <div id="itemsOut"></div>`;
  const v=document.getElementById("view");
  v.querySelector("#xq").oninput=e=>{state.xq=e.target.value;state.xlim=PAGE;renderCatalogList();};
  v.querySelector("#xcat").onchange=e=>{state.xcat=e.target.value;state.xlim=PAGE;renderCatalogList();};
  wireSegs(v,()=>{state.xlim=PAGE;renderCatalogList();});
  renderCatalogList();
}
/* Défilement continu : on ajoute un lot dès que le bas de la liste approche */
let scrollObs=null;
function infinite(sentinel,more){if(scrollObs)scrollObs.disconnect();if(!sentinel)return;
  scrollObs=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting))more();},{rootMargin:"1200px 0px"});scrollObs.observe(sentinel);}
function renderCatalogList(){
  const t=T(),q=state.xq.trim().toLowerCase();
  const idxs=ITEMS.map((_,i)=>i)
    .filter(i=>state.xcat==="all"||ITEMS[i][2]===state.xcat)
    .filter(i=>state.xf==="all"||(state.xf==="loot"?SOURCES[ITEMS[i][1]]:MADE_BY[i]))
    .filter(i=>!q||(ITEMS[i][1]+" "+xname(i)+" "+idesc(i)).toLowerCase().includes(q));
  idxs.sort((a,b)=>GROUP_ORDER.indexOf(ITEMS[a][2])-GROUP_ORDER.indexOf(ITEMS[b][2])||xname(a).localeCompare(xname(b),prefs.lang));
  document.getElementById("result").textContent=FR()?`${idxs.length} objets`:`${idxs.length} items`;
  const out=document.getElementById("itemsOut");
  if(!idxs.length){out.innerHTML=`<div class="empty">${t.none_i}</div>`;infinite(null);return;}
  out.innerHTML=`<div id="catList"></div><div class="sentinel" id="sentinel"></div>`;
  const list=document.getElementById("catList");let pos=0,curBox=null,cur=null;
  const add=()=>{if(pos>=idxs.length){infinite(null);document.getElementById("sentinel")?.remove();return;}
    const end=Math.min(idxs.length,pos+PAGE);
    for(;pos<end;pos++){const i=idxs[pos],g=ITEMS[i][2];
      if(g!==cur){cur=g;const sec=document.createElement("section");sec.className="cat";sec.innerHTML=`<h2>${gname(g)}</h2><div class="items"></div>`;list.appendChild(sec);curBox=sec.lastElementChild;}
      const mk=MADE_BY[i]?.length||0,dr=SOURCES[ITEMS[i][1]]?.length||0;
      const b=document.createElement("button");b.className="it";b.type="button";
      b.innerHTML=`${itemIcon(i)}<span class="it-t"><b>${esc(xname(i))}</b><small>${esc(FR()&&xname(i)!==ITEMS[i][1]?ITEMS[i][1]:gname(g))}</small></span><span class="badges">${mk?`<i title="${t.crafting}">⚒ ${mk}</i>`:""}${dr?`<i title="${t.dropped_by}">🐾 ${dr}</i>`:""}</span>`;
      b.onclick=()=>openSheet({type:"x",id:i},true);curBox.appendChild(b);}
  };
  add();infinite(document.getElementById("sentinel"),add);
}

/* ---------- Vue crafts ---------- */
const usedStations=[...new Set(REC.flatMap(r=>r.st))].sort((a,b)=>stname(a).localeCompare(stname(b)));
function renderCrafts(){
  const t=T();
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${t.crafts_title}</h1>
    <div class="facts"><span><b>${t.recipes_n(REC.length)}</b></span><span>${usedStations.length} ${t.stations_k}</span></div>
    <p>${t.crafts_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${t.img_note}</div></div>
  </section>
  <div class="toolbar">
    <label class="search">${SEARCH_ICON}<input id="rq" type="search" placeholder="${t.search_r}" value="${esc(state.rq)}" aria-label="${t.search_r}"></label>
    <select id="rst" aria-label="${t.all_stations}"><option value="all">${t.all_stations}</option>${usedStations.map(s=>`<option value="${s}" ${String(state.rst)===String(s)?"selected":""}>${esc(stname(s))}</option>`).join("")}</select>
  </div>
  <div class="result" id="result"></div>
  <div id="recOut" class="recs"></div>`;
  const v=document.getElementById("view");
  v.querySelector("#rq").oninput=e=>{state.rq=e.target.value;state.rlim=PAGE;renderRecList();};
  v.querySelector("#rst").onchange=e=>{state.rst=e.target.value;state.rlim=PAGE;renderRecList();};
  renderRecList();
}
const chip=([i,c])=>`<button class="chip" type="button" data-x="${i}">${itemIcon(i)}<span>${esc(xname(i))}</span><b>×${c}</b></button>`;
function recipeRow(r,showStation){const t=T();
  return `<div class="rec">
    <div class="rec-out">${r.outs.map(([i,c])=>`<button class="out" type="button" data-x="${i}">${itemIcon(i,true)}<span><b>${esc(xname(i))}</b>${c>1?` <em>×${c}</em>`:""}</span></button>`).join("")}${r.ro?`<span class="ro">${t.produces} : ${esc(extra(r.ro))}</span>`:""}</div>
    <div class="rec-in">${r.ins.map(chip).join("")}${r.ex?`<span class="exs">${esc(extra(r.ex))}</span>`:""}</div>
    ${showStation?`<div class="rec-st">${r.st.map(s=>`<span>${esc(stname(s))}</span>`).join("")}</div>`:""}
  </div>`;}
function renderRecList(){
  const t=T(),q=state.rq.trim().toLowerCase();
  let list=REC.filter(r=>state.rst==="all"||r.st.includes(+state.rst))
    .filter(r=>!q||[...r.outs,...r.ins].some(([i])=>(ITEMS[i][1]+" "+xname(i)).toLowerCase().includes(q))||r.ex.toLowerCase().includes(q));
  document.getElementById("result").textContent=t.recipes_n(list.length);
  const out=document.getElementById("recOut");
  if(!list.length){out.innerHTML=`<div class="empty">${t.none_i}</div>`;infinite(null);return;}
  out.innerHTML=`<div class="sentinel" id="sentinel"></div>`;let pos=0;
  const sent=document.getElementById("sentinel");
  const add=()=>{if(pos>=list.length){infinite(null);sent.remove();return;}
    const end=Math.min(list.length,pos+PAGE/2);const frag=document.createElement("div");frag.innerHTML=list.slice(pos,end).map(r=>recipeRow(r,true)).join("");pos=end;
    frag.querySelectorAll("[data-x]").forEach(el=>el.onclick=()=>openSheet({type:"x",id:+el.dataset.x},true));
    while(frag.firstChild)out.insertBefore(frag.firstChild,sent);};
  add();infinite(sent,add);
}

/* ---------- Panneau ---------- */
const sheet=document.getElementById("sheet"),scrim=document.getElementById("scrim");
let lastFocus=null;
function openSheet(entry,reset){if(reset){state.stack=[];lastFocus=document.activeElement;}state.stack.push(entry);drawSheet();
  sheet.hidden=false;requestAnimationFrame(()=>{sheet.classList.add("on");scrim.classList.add("on");});document.getElementById("sheetClose").focus({preventScroll:true});}
function closeSheet(){sheet.classList.remove("on");scrim.classList.remove("on");setTimeout(()=>{if(!sheet.classList.contains("on"))sheet.hidden=true;},240);state.stack=[];lastFocus?.focus?.({preventScroll:true});}
function back(){state.stack.pop();state.stack.length?drawSheet():closeSheet();}

function drawSheet(){const e=state.stack[state.stack.length-1];const body=document.getElementById("sheetBody");
  document.getElementById("sheetBack").hidden=state.stack.length<2;
  if(e.type==="c")drawCreature(body,byName[e.id]);
  else if(e.type==="x")drawCatalogItem(body,e.id);
  else if(e.type==="i"){const ci=ITEM_BY_NAME[e.id];ci!==undefined?drawCatalogItem(body,ci):drawLootItem(body,e.id);}
  else if(e.type==="t")drawTalent(body,e.id);
  else drawSettings(body);
  body.scrollTop=0;
  body.querySelectorAll("[data-goc]").forEach(b=>b.onclick=()=>openSheet({type:"c",id:b.dataset.goc}));
  body.querySelectorAll("[data-goi]").forEach(b=>b.onclick=()=>openSheet({type:"i",id:b.dataset.goi}));
  body.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>openSheet({type:"x",id:+b.dataset.x}));
  body.querySelectorAll("a[href^='#']").forEach(a=>a.addEventListener("click",closeSheet));
}

function drawCreature(body,c){const t=T();const [n,b,d,tm,hp,wk,rs,x,,maps]=c;const kd=kindOf(c);
  document.getElementById("sheetCrumb").textContent=t.creature+" · "+beh(b);
  const loot=LOOTS[n];
  const vnote=["boss","hunt"].includes(kd)?t.v_boss:LOOT[n]&&LOOT[n].includes("Vestige")?t.v_chance:t.v_tax;
  body.innerHTML=`
  <div class="sheet-top">${imgTag(creImg(n),"hero-img zoomable",`<span class="glyph" style="--g:var(--soft);color:var(--muted)">${esc(glyphTxt(n))}</span>`)}
   <div><span class="pill ${b}">${beh(b)}</span>${kindL(kd)&&kd!=="ferme"?` <span class="kind">${kindL(kd)}</span>`:""}<h2 id="sheetTitle" style="margin-top:8px">${esc(cname(n))}</h2>${FR()&&cname(n)!==n?`<p class="gname">${t.gname} : ${esc(n)}</p>`:""}</div></div>
  <p class="lede">${esc(cdesc(c))}</p>
  <div class="kv"><div><span>${t.hp}</span><strong>${hp?hp.toLocaleString(prefs.lang):t.nc}</strong></div><div><span>${t.diet}</span><strong>${d==="C"?t.carn:t.herb}</strong></div><div><span>${t.taming}</span><strong style="color:var(--tame)">${tame(tm)||t.no}</strong></div></div>
  <div class="sec"><h3>${t.combat}</h3><dl class="ws"><dt>${t.weak}</dt><dd class="wk">${esc(trait(wk))}</dd><dt>${t.resist}</dt><dd>${esc(trait(rs))}</dd><dt>${t.traits}</dt><dd>${esc(trait(x))}</dd></dl></div>
  <div class="sec"><h3>${kd==="faune"||kd==="ferme"?t.loot_knife:t.loot}</h3>${loot.length?`<table class="loot"><thead><tr><th>${t.item}</th><th class="num">${t.qty}</th><th class="num">${t.chance}</th></tr></thead><tbody>${loot.map(r=>`<tr><td><button class="linkbtn" type="button" data-goi="${esc(r.item)}">${lootIcon(r.item)}${esc(r.tx?(FR()?"Vestige : "+cname(n):n+" Vestige"):iname(r.item))}</button></td><td class="num">${r.qty}</td><td class="num">${r.ch} %<span class="chance"><i style="width:${r.ch}%"></i></span></td></tr>`).join("")}</tbody></table>${loot.some(r=>r.tx)?`<p class="ext" style="margin:6px 0 0">${vnote}</p>`:""}`:`<p class="ext" style="margin:0">${t.not_doc}</p>`}</div>
  <div class="sec"><h3>${t.where}</h3><div class="maprow">${Object.keys(maps).map(k=>{const zi=zonesOf(c,k);return `<div class="mapcard"><a href="#${k}" style="--c:${accentOf(k)[0]}"><i></i>${mapName(k)}</a><p>${zi.z.length?zi.z.map(zl).join(" · "):t.zone_unk}${zi.b.length?"<br>"+esc(zi.b.map(bioName).join(", ")):""}</p></div>`}).join("")}</div></div>
  ${typeof creatureExtra==="function"?creatureExtra(n):""}
  <a class="ext" href="${wiki(n)}" target="_blank" rel="noopener">${t.wiki}</a>`;
}

function dropsTable(name,filterMap){const t=T();const all=(SOURCES[name]||[]).slice().sort((a,b)=>b.ch-a.ch||qmax(b.qty)-qmax(a.qty));
  const vis=all.filter(s=>!filterMap||byName[s.n][9][filterMap]!==undefined);
  if(!vis.length)return "";
  return `<div class="sec"><h3>${t.dropped_by}</h3><table class="loot"><thead><tr><th>${t.creature}</th><th class="num">${t.qty}</th><th class="num">${t.chance}</th></tr></thead><tbody>
  ${vis.map(s=>{const c=byName[s.n];return `<tr><td><button class="linkbtn" type="button" data-goc="${esc(s.n)}">${imgTag(creImg(s.n),"mini-img","")}${esc(cname(s.n))}</button><br>${Object.keys(c[9]).map(k=>`<span class="mtag">${mapName(k)}</span>`).join("")}</td><td class="num">${s.qty}</td><td class="num">${s.ch} %<span class="chance"><i style="width:${s.ch}%"></i></span></td></tr>`}).join("")}
  </tbody></table></div>`;}

function drawCatalogItem(body,i){const t=T();const it=ITEMS[i];
  document.getElementById("sheetCrumb").textContent=t.object+" · "+gname(it[2]);
  const made=MADE_BY[i]||[],used=USED_IN[i]||[];
  const usedOuts=[...new Set(used.flatMap(r=>r.outs.map(o=>o[0])))];
  body.innerHTML=`
  <div class="sheet-top">${itemIcon(i,true)}
    <div><h2 id="sheetTitle">${esc(xname(i))}</h2>${FR()&&xname(i)!==it[1]?`<p class="gname">${t.gname} : ${esc(it[1])}</p>`:""}</div></div>
  ${idesc(i)?`<p class="lede">${esc(idesc(i))}</p>`:""}
  ${typeof itemExtra==="function"?itemExtra(i):""}
  <div class="kv"><div><span>${t.category}</span><strong style="font-size:.9rem">${gname(it[2])}</strong></div><div><span>${t.stack}</span><strong>${it[5]||1}</strong></div><div><span>${t.crafting}</span><strong>${made.length}</strong></div></div>
  <div class="sec"><h3>${t.crafting}</h3>${made.length?made.slice(0,12).map(r=>recipeRow(r,true)).join(""):`<p class="ext" style="margin:0">${t.no_recipe}</p>`}</div>
  ${usedOuts.length?`<div class="sec"><h3>${t.used_in} · ${usedOuts.length}</h3><div class="chips">${usedOuts.slice(0,40).map(o=>`<button class="chip" type="button" data-x="${o}">${itemIcon(o)}<span>${esc(xname(o))}</span></button>`).join("")}${usedOuts.length>40?`<span class="exs">${t.and_more(usedOuts.length-40)}</span>`:""}</div></div>`:""}
  ${dropsTable(it[1])}
  <a class="ext" href="https://icarus.wiki.gg/wiki/${encodeURIComponent(it[1].replace(/ /g,"_"))}" target="_blank" rel="noopener">${t.wiki}</a>`;
}

function drawLootItem(body,item){const t=T();const cat=IT[item]?.[1]||"res";
  document.getElementById("sheetCrumb").textContent=t.object+" · "+catName(cat);
  const all=SOURCES[item]||[];
  body.innerHTML=`
  <div class="sheet-top">${lootIcon(item,true)}
    <div><h2 id="sheetTitle">${esc(iname(item))}</h2>${FR()?`<p class="gname">${esc(item==="Vestige"?"Vestiges":item)}</p>`:""}</div></div>
  ${item==="Vestige"?`<p class="ext" style="margin:0">${t.vest_note}</p>`:""}
  <div class="kv"><div><span>${t.sources_k}</span><strong>${all.length}</strong></div><div><span>${t.regions_k}</span><strong>${new Set(all.flatMap(s=>Object.keys(byName[s.n][9]))).size}</strong></div><div><span>${t.category}</span><strong style="font-size:.85rem">${catName(cat)}</strong></div></div>
  ${dropsTable(item)}`;
}

/* ---------- Paramètres ---------- */
let installEvt=null;
addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;if(state.stack.at?.(-1)?.type==="settings")drawSheet();});
const standalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
function drawSettings(body){const t=T();
  document.getElementById("sheetCrumb").textContent=t.settings;
  const opt=(name,val,label,cur)=>`<button type="button" class="opt" data-set="${name}" data-val="${val}" aria-pressed="${cur===val}">${label}</button>`;
  body.innerHTML=`
  <div><h2 id="sheetTitle">${t.settings}</h2></div>
  <div class="sec"><h3>${t.s_lang}</h3><div class="opts">${opt("lang","fr","🇫🇷 Français",prefs.lang)}${opt("lang","en","🇬🇧 English",prefs.lang)}</div></div>
  <div class="sec"><h3>${t.s_theme}</h3><div class="opts">${opt("theme","auto",t.t_auto,prefs.theme)}${opt("theme","light",t.t_light,prefs.theme)}${opt("theme","dark",t.t_dark,prefs.theme)}</div></div>
  <div class="sec"><h3>${t.s_install}</h3>
    ${standalone()?`<p class="note ok">${t.installed}</p>`:`${installEvt?`<button type="button" class="primary" id="doInstall">${t.install_btn}</button>`:""}
    <ul class="steps"><li>${t.inst_pc}</li><li>${t.inst_android}</li><li>${t.inst_ios}</li></ul>`}</div>
  <div class="sec"><h3>${t.s_about}</h3><p class="note">${t.about_t}</p><p class="note" style="margin-top:6px">${t.img_note}</p></div>`;
  body.querySelectorAll("[data-set]").forEach(b=>b.onclick=()=>{prefs[b.dataset.set]=b.dataset.val;savePrefs();applyTheme();setAccent();route(true);drawSheet();});
  const di=body.querySelector("#doInstall");if(di)di.onclick=async()=>{installEvt.prompt();await installEvt.userChoice;installEvt=null;drawSheet();};
}

document.getElementById("sheetClose").onclick=closeSheet;
document.getElementById("sheetBack").onclick=back;
scrim.onclick=closeSheet;
addEventListener("keydown",e=>{if(e.key==="Escape"&&sheet.classList.contains("on"))closeSheet();});

/* ---------- Routage ---------- */
const VIEWS={objets:()=>renderCatalog(),crafts:()=>renderCrafts(),arbres:()=>renderTrees(),guide:()=>renderGuide()};
function route(keep){const h=location.hash.slice(1);const v=MAPS[h]||VIEWS[h]?h:"olympus";
  if(v!==state.view&&!keep)state.zone="all";state.view=v;if(MAPS[v])state.lastRegion=v;setAccent();renderChrome();
  VIEWS[v]?VIEWS[v]():renderMap();}
addEventListener("hashchange",()=>{if(sheet.classList.contains("on"))closeSheet();state.zone="all";route();scrollTo({top:0});});
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",()=>{setAccent();renderChrome();});
applyTheme();
addEventListener("DOMContentLoaded",()=>{state.view="";route();});

/* ---------- Hors connexion ---------- */
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
