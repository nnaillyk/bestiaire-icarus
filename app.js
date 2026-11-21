// Bestiaire d'Icarus — logique de l'app (navigation, filtres, fiches, paramètres)
const RANK={A:3,N:2,P:1};
const LOGMAX=Math.log(7500), LOGMIN=Math.log(80);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const byName=Object.fromEntries(C.map(c=>[c[0],c]));
const wiki=n=>"https://icarus.wiki.gg/wiki/"+encodeURIComponent((WIKI_ALIAS[n]||n).replace(/ /g,"_"));
const kindOf=c=>c[10]||"faune";
const qmax=q=>+q.split("-").pop();

/* ---------- Réglages ---------- */
const PREF_KEY="icarus-bestiaire";
const prefs={sort:"danger",lang:"fr",theme:"auto"};
try{Object.assign(prefs,JSON.parse(localStorage.getItem(PREF_KEY)||"{}"));}catch(e){}
const savePrefs=()=>{try{localStorage.setItem(PREF_KEY,JSON.stringify(prefs))}catch(e){}};
const T=()=>UI[prefs.lang];
const FR=()=>prefs.lang==="fr";

/* ---------- Traduction des données ---------- */
const cname=n=>FR()?(NAME_FR[n]||n):n;
const cdesc=c=>FR()?c[8]:(LORE_EN[LORE_ALIAS[c[0]]||c[0]]||c[8]);
const trait=s=>FR()?s:s.split(" · ").map(t=>TOK_EN[t]??WORD_EN.reduce((a,[f,e])=>a.replace(f,e),t)).join(" · ");
const zl=z=>FR()?ZL[z]:ZL_EN[z];
const mapName=k=>k==="ferme"&&!FR()?MAPS_EN.ferme.name:MAPS[k].name;
const mapF=(k,f)=>FR()?MAPS[k][f]:MAPS_EN[k][f];
const catName=k=>FR()?CATS[k][0]:CATS_EN[k];
const iname=i=>i==="Vestige"?(FR()?"Vestiges":"Vestiges"):FR()?(IT[i]?.[0]||i):i;
const beh=b=>BEH_L[prefs.lang][b];
const tame=t=>TAME_L[prefs.lang][t]||"";
const kindL=k=>KIND_L[prefs.lang][k];

/* ---------- Butin ---------- */
function parseLoot(n){const s=LOOT[n];const rows=s?s.split(";").map(r=>{const m=r.match(/^(.*) (\d+(?:-\d+)?) (\d+)$/);return {item:m[1],qty:m[2],ch:+m[3],tx:m[1]==="Vestige"}}):[];
  if(!NO_VESTIGE.has(n)&&!rows.some(r=>r.tx))rows.push({item:"Vestige",qty:"1",ch:100,tx:true});return rows;}
const LOOTS=Object.fromEntries(C.map(c=>[c[0],parseLoot(c[0])]));
const SOURCES={};
for(const [n,rows] of Object.entries(LOOTS))for(const r of rows)(SOURCES[r.item]??=[]).push({n,...r});

function glyph(item,big){const cat=IT[item]?.[1]||"res";const w=item.replace(/^Raw /,"").replace(/\(.*\)/,"").trim().split(/[\s-]+/);
  const g=(w.length>1?w[0][0]+w[1][0]:w[0].slice(0,2)).toUpperCase();
  return `<span class="glyph${big?" big":""}" style="--g:${CATS[cat][1]}" aria-hidden="true">${esc(g)}</span>`;}

function zonesOf(c,map){const v=c[9][map];if(v===undefined)return null;if(v==="")return {z:[],b:[]};
  if(v.startsWith("@"))return {z:v.slice(1).split(","),b:[]};
  const b=v.split(", ");return {z:[...new Set(b.map(x=>B2Z[x]).filter(Boolean))],b};}

/* ---------- Thème ---------- */
function applyTheme(){const r=document.documentElement;if(prefs.theme==="auto")delete r.dataset.theme;else r.dataset.theme=prefs.theme;r.lang=prefs.lang;}
const isDark=()=>{const t=document.documentElement.dataset.theme;return t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);};
function accentOf(k){const a=k==="objets"?IDX_ACCENT:MAPS[k].accent;return isDark()?[a[2],a[3]]:[a[0],a[1]];}
function setAccent(){const [m,s]=accentOf(state.view);const r=document.documentElement.style;r.setProperty("--map",m);r.setProperty("--map-soft",s);
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=isDark()?"#161c19":"#e4e9e6";}

const state={view:"olympus",kind:"all",beh:"all",tame:"all",zone:"all",q:"",iq:"",imap:"all",stack:[]};

/* ---------- Chrome : barre latérale, barre du haut, onglets ---------- */
const GEAR=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
function renderChrome(){
  const t=T();
  const link=k=>{const n=k==="objets"?Object.keys(SOURCES).length:C.filter(c=>c[9][k]!==undefined).length;
    return `<a class="navlink" href="#${k}" style="--c:${accentOf(k)[0]}" ${k===state.view?'aria-current="page"':""}><span class="dot"></span>${k==="objets"?t.objects:mapName(k)}<span class="ct">${n}</span></a>`};
  document.getElementById("sidebar").innerHTML=`
    <p class="brand"><small>${t.brand_small}</small>${t.brand}</p>
    <nav class="navgroup" aria-label="${t.regions}"><h2>${t.regions}</h2>${REGIONS.map(link).join("")}</nav>
    <nav class="navgroup" aria-label="${t.index}"><h2>${t.index}</h2>${["ferme","objets"].map(link).join("")}</nav>
    <button class="navlink setbtn" type="button" data-settings>${GEAR}<span>${t.settings}</span></button>
    <div class="sidefoot">${t.sources}</div>`;
  document.getElementById("mtop").innerHTML=`<p class="brand">${t.brand}</p><button class="iconbtn" type="button" data-settings aria-label="${t.settings}">${GEAR}</button>`;
  document.getElementById("tabbar").innerHTML=[...REGIONS,"ferme","objets"].map(k=>`<a href="#${k}" style="--c:${accentOf(k)[0]}" ${k===state.view?'aria-current="page"':""}><i></i>${k==="objets"?t.objects:mapName(k)}</a>`).join("");
  document.querySelectorAll("[data-settings]").forEach(b=>b.onclick=()=>openSheet({type:"settings"},true));
  document.getElementById("sheetBack").setAttribute("aria-label",t.back);
  document.getElementById("sheetClose").setAttribute("aria-label",t.close);
  document.title=t.brand;
}

const SEARCH_ICON=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="7" cy="7" r="4.8"/><path d="m10.6 10.6 3.4 3.4"/></svg>`;
function seg(key,opts){return `<div class="seg" role="group">${opts.map(([v,l])=>`<button type="button" data-k="${key}" data-v="${v}" aria-pressed="${state[key]===v}">${l}</button>`).join("")}</div>`;}
function wireSegs(root,after){root.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>{state[b.dataset.k]=b.dataset.v;b.parentElement.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));after();});}

/* ---------- Vue région ---------- */
function renderMap(){
  const t=T(),k=state.view,m=MAPS[k];const list=C.filter(c=>c[9][k]!==undefined);
  const cnt=b=>list.filter(c=>c[1]===b).length;const tm=list.filter(c=>c[3]!=="0").length;const only=list.filter(c=>Object.keys(c[9]).length===1).length;
  const bosses=list.filter(c=>["boss","hunt"].includes(kindOf(c))).length;
  const kinds=[["all",t.all],["faune",t.fauna_k],...(m.special?[]:[["boss",t.boss_k],["grotte",t.cave_k]])];
  if(!kinds.some(x=>x[0]===state.kind))state.kind="all";
  const hunt=mapF(k,"hunt");
  document.getElementById("view").innerHTML=`
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
    .filter(c=>state.kind==="all"||(state.kind==="boss"?["boss","hunt"].includes(kindOf(c)):kindOf(c)===state.kind))
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
      <div class="hd"><div><h3>${esc(cname(n))}</h3><div class="sub">${FR()&&NAME_FR[n]?esc(n)+" · ":""}${d==="C"?t.carn:t.herb}${zi.z.length?" · "+zi.z.map(zl).join(", "):""}</div></div><span class="pill ${b}">${beh(b)}</span></div>
      <div class="hp"><span>${FR()?"PV":"HP"}</span><span class="bar"><i style="width:${w}%"></i></span><b>${hp?hp.toLocaleString(prefs.lang):t.nc}</b></div>
      <div class="mini">${top.length?top.map(x=>`<span>${esc(x)}</span>`).join(""):`<span>${t.no_loot}</span>`}</div>
      <div class="ft"><span class="tame">${kindL(kd)&&kd!=="ferme"?`<span class="kind">${kindL(kd)}</span> `:""}${tame(tm)}</span><span>${kd==="ferme"?t.workshop:Object.keys(c[9]).length>1?t.regions_n(Object.keys(c[9]).length):t.exclusive_s}</span></div>
    </button>`}).join(""):`<div class="empty">${t.none_c(mapName(k))}</div>`;
  document.querySelectorAll(".cc").forEach(el=>el.onclick=()=>openSheet({type:"c",id:el.dataset.c},true));
}

/* ---------- Vue objets ---------- */
function renderItems(){
  const t=T();
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${t.items_title}</h1>
    <div class="facts"><span><b>${t.items_n(Object.keys(SOURCES).length)}</b></span><span>${t.items_f1}</span><span>${t.items_f2}</span></div>
    <p>${t.items_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${t.tip_t}</div></div>
  </section>
  <div class="toolbar">
    <label class="search">${SEARCH_ICON}<input id="iq" type="search" placeholder="${t.search_i}" value="${esc(state.iq)}" aria-label="${t.search_i}"></label>
    ${seg("imap",[["all",t.all_regions],...[...REGIONS,"ferme"].map(k=>[k,mapName(k)])])}
  </div>
  <div id="itemsOut"></div>`;
  const v=document.getElementById("view");
  v.querySelector("#iq").oninput=e=>{state.iq=e.target.value;renderItemList();};
  wireSegs(v,renderItemList);
  renderItemList();
}
const srcFor=i=>SOURCES[i].filter(s=>state.imap==="all"||byName[s.n][9][state.imap]!==undefined);
function renderItemList(){
  const t=T(),q=state.iq.trim().toLowerCase();
  const items=Object.keys(SOURCES).filter(i=>!q||(i+" "+(IT[i]?.[0]||"")).toLowerCase().includes(q)).filter(i=>srcFor(i).length);
  const out=Object.keys(CATS).map(ck=>{const its=items.filter(i=>(IT[i]?.[1]||"res")===ck).sort((a,b)=>srcFor(b).length-srcFor(a).length||iname(a).localeCompare(iname(b),prefs.lang));
    if(!its.length)return "";
    return `<section class="cat"><h2>${catName(ck)}<span>${its.length}</span></h2><div class="items">${its.map(i=>{const n=srcFor(i).length;
      return `<button class="it" type="button" data-i="${esc(i)}">${glyph(i)}<span><b>${esc(iname(i))}</b><small>${esc(FR()?(i==="Vestige"?"Vestiges":i):(IT[i]?.[0]||""))}</small></span><span class="n">${n}<br><small>${t.source_s(n)}</small></span></button>`}).join("")}</div></section>`}).join("");
  document.getElementById("itemsOut").innerHTML=out||`<div class="empty">${t.none_i}</div>`;
  document.querySelectorAll(".it").forEach(el=>el.onclick=()=>openSheet({type:"i",id:el.dataset.i},true));
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
  if(e.type==="c")drawCreature(body,byName[e.id]);else if(e.type==="i")drawItem(body,e.id);else drawSettings(body);
  body.scrollTop=0;
  body.querySelectorAll("[data-goc]").forEach(b=>b.onclick=()=>openSheet({type:"c",id:b.dataset.goc}));
  body.querySelectorAll("[data-goi]").forEach(b=>b.onclick=()=>openSheet({type:"i",id:b.dataset.goi}));
  body.querySelectorAll("a[href^='#']").forEach(a=>a.addEventListener("click",closeSheet));
}

function drawCreature(body,c){const t=T();const [n,b,d,tm,hp,wk,rs,x,,maps]=c;const kd=kindOf(c);
  document.getElementById("sheetCrumb").textContent=t.creature+" · "+beh(b);
  const loot=LOOTS[n];
  const vnote=["boss","hunt"].includes(kd)?t.v_boss:LOOT[n]&&LOOT[n].includes("Vestige")?t.v_chance:t.v_tax;
  body.innerHTML=`
  <div><span class="pill ${b}">${beh(b)}</span>${kindL(kd)&&kd!=="ferme"?` <span class="kind">${kindL(kd)}</span>`:""}<h2 id="sheetTitle" style="margin-top:8px">${esc(cname(n))}</h2>${FR()&&NAME_FR[n]?`<p class="gname">${t.gname} : ${esc(n)}</p>`:""}<p class="lede">${esc(cdesc(c))}</p></div>
  <div class="kv"><div><span>${t.hp}</span><strong>${hp?hp.toLocaleString(prefs.lang):t.nc}</strong></div><div><span>${t.diet}</span><strong>${d==="C"?t.carn:t.herb}</strong></div><div><span>${t.taming}</span><strong style="color:var(--tame)">${tame(tm)||t.no}</strong></div></div>
  <div class="sec"><h3>${t.combat}</h3><dl class="ws"><dt>${t.weak}</dt><dd class="wk">${esc(trait(wk))}</dd><dt>${t.resist}</dt><dd>${esc(trait(rs))}</dd><dt>${t.traits}</dt><dd>${esc(trait(x))}</dd></dl></div>
  <div class="sec"><h3>${kd==="faune"||kd==="ferme"?t.loot_knife:t.loot}</h3>${loot.length?`<table class="loot"><thead><tr><th>${t.item}</th><th class="num">${t.qty}</th><th class="num">${t.chance}</th></tr></thead><tbody>${loot.map(r=>`<tr><td><button class="linkbtn" type="button" data-goi="${esc(r.item)}">${glyph(r.item)}${esc(r.tx?(FR()?"Vestige : "+cname(n):n+" Vestige"):iname(r.item))}</button></td><td class="num">${r.qty}</td><td class="num">${r.ch} %<span class="chance"><i style="width:${r.ch}%"></i></span></td></tr>`).join("")}</tbody></table>${loot.some(r=>r.tx)?`<p class="ext" style="margin:6px 0 0">${vnote}</p>`:""}`:`<p class="ext" style="margin:0">${t.not_doc}</p>`}</div>
  <div class="sec"><h3>${t.where}</h3><div class="maprow">${Object.keys(maps).map(k=>{const zi=zonesOf(c,k);return `<div class="mapcard"><a href="#${k}" style="--c:${accentOf(k)[0]}"><i></i>${mapName(k)}</a><p>${zi.z.length?zi.z.map(zl).join(" · "):t.zone_unk}${zi.b.length?"<br>"+esc(zi.b.join(", ")):""}</p></div>`}).join("")}</div></div>
  <a class="ext" href="${wiki(n)}" target="_blank" rel="noopener">${t.wiki}</a>`;
}

function drawItem(body,item){const t=T();const cat=IT[item]?.[1]||"res";
  document.getElementById("sheetCrumb").textContent=t.object+" · "+catName(cat);
  const all=SOURCES[item].slice().sort((a,b)=>b.ch-a.ch||qmax(b.qty)-qmax(a.qty));
  const vis=all.filter(s=>state.view!=="objets"||state.imap==="all"||byName[s.n][9][state.imap]!==undefined);
  const best=all.slice().sort((a,b)=>qmax(b.qty)*b.ch-qmax(a.qty)*a.ch)[0];
  body.innerHTML=`
  <div style="display:flex;gap:12px;align-items:center">${glyph(item,true)}
    <div><h2 id="sheetTitle">${esc(iname(item))}</h2><p class="lede" style="margin:2px 0 0;color:var(--muted)">${esc(FR()?(item==="Vestige"?"Vestiges":item):(IT[item]?.[0]||""))}</p></div></div>
  <div class="kv"><div><span>${t.sources_k}</span><strong>${all.length}</strong></div><div><span>${t.regions_k}</span><strong>${new Set(all.flatMap(s=>Object.keys(byName[s.n][9]))).size}</strong></div><div><span>${t.best}</span><strong style="font-size:.9rem">${esc(cname(best.n))}</strong></div></div>
  ${item==="Vestige"?`<p class="ext" style="margin:0">${t.vest_note}</p>`:""}
  <div class="sec"><h3>${t.droppers}${vis.length<all.length?" · "+mapName(state.imap):""}</h3>
  <table class="loot"><thead><tr><th>${t.creature}</th><th class="num">${t.qty}</th><th class="num">${t.chance}</th></tr></thead><tbody>
  ${vis.map(s=>{const c=byName[s.n];return `<tr><td><button class="linkbtn" type="button" data-goc="${esc(s.n)}">${esc(cname(s.n))}</button><br>${Object.keys(c[9]).map(k=>`<span class="mtag">${mapName(k)}</span>`).join("")}</td><td class="num">${s.qty}</td><td class="num">${s.ch} %<span class="chance"><i style="width:${s.ch}%"></i></span></td></tr>`}).join("")}
  </tbody></table></div>`;
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
  <div class="sec"><h3>${t.s_about}</h3><p class="note">${t.about_t}</p></div>`;
  body.querySelectorAll("[data-set]").forEach(b=>b.onclick=()=>{prefs[b.dataset.set]=b.dataset.val;savePrefs();applyTheme();setAccent();renderChrome();route(true);drawSheet();});
  const di=body.querySelector("#doInstall");if(di)di.onclick=async()=>{installEvt.prompt();await installEvt.userChoice;installEvt=null;drawSheet();};
}

document.getElementById("sheetClose").onclick=closeSheet;
document.getElementById("sheetBack").onclick=back;
scrim.onclick=closeSheet;
addEventListener("keydown",e=>{if(e.key==="Escape"&&sheet.classList.contains("on"))closeSheet();});

/* ---------- Routage ---------- */
function route(keep){const h=location.hash.slice(1);const v=MAPS[h]||h==="objets"?h:"olympus";
  if(v!==state.view&&!keep)state.zone="all";state.view=v;setAccent();renderChrome();
  v==="objets"?renderItems():renderMap();}
addEventListener("hashchange",()=>{if(sheet.classList.contains("on"))closeSheet();state.zone="all";route();scrollTo({top:0});});
const reAccent=()=>{setAccent();renderChrome();};
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",reAccent);
applyTheme();state.view="";route();

/* ---------- Hors connexion ---------- */
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
