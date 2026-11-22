// Cartes interactives : grottes, filons profonds, exotiques, pétrole, uranium, geysers + calques du wiki
Object.assign(UI.fr,{maps:"Cartes",maps_title:"Cartes",maps_p:"Les emplacements exacts des grottes, filons de minerai profonds, gisements d'exotiques, geysers de pétrole et d'enzymes et gisements d'uranium, d'après les cartes interactives de l'ICARUS Wiki. Le calque « Apparitions » montre où vivent les animaux et les boss.",
 bg:"Fond de carte",markers:"Marqueurs",reset:"Recentrer",map_hint:"Glissez pour vous déplacer, molette ou pincement pour zoomer, touchez un marqueur pour son détail."});
Object.assign(UI.en,{maps:"Maps",maps_title:"Maps",maps_p:"Exact locations of caves, deep ore veins, exotic deposits, oil and enzyme geysers and uranium deposits, from the ICARUS Wiki interactive maps. The “Spawns” layer shows where animals and bosses live.",
 bg:"Background",markers:"Markers",reset:"Recenter",map_hint:"Drag to move, wheel or pinch to zoom, tap a marker for details."});
const MGROUP_L={fr:{Caves:"Grottes",DOVs:"Filons de minerai profonds",Exotics:"Gisements d'exotiques",Oil:"Geysers de pétrole",RedSeeds:"Graines d'exotiques rouges",RedTrees:"Arbres d'exotiques rouges",Geysers:"Geysers d'enzymes",Uranium:"Gisements d'uranium"},
 en:{Caves:"Caves",DOVs:"Deep ore veins",Exotics:"Exotic deposits",Oil:"Oil geysers",RedSeeds:"Red exotic seeds",RedTrees:"Red exotic trees",Geysers:"Enzyme geysers",Uranium:"Uranium deposits"}};
const MGROUP_COLOR={Caves:"#c9a227",DOVs:"#8c96a3",Exotics:"#9b59d0",Oil:"#2b2b2b",RedSeeds:"#d0453a",RedTrees:"#a8261c",Geysers:"#3bb3a8",Uranium:"#7ac943"};
const MLAYER_L={fr:{base:"Carte",spawns:"Apparitions (animaux et boss)",nodes:"Minerais",regions:"Régions",biomes:"Biomes",fish:"Poissons",blockers:"Barrages",clay:"Argile",obsidian:"Obsidienne",scoria:"Scorie"},
 en:{base:"Map",spawns:"Spawns (animals and bosses)",nodes:"Ores",regions:"Regions",biomes:"Biomes",fish:"Fish",blockers:"Blockers",clay:"Clay",obsidian:"Obsidian",scoria:"Scoria"}};
function mdesc(g,d){if(!FR())return d.replace(/\[\[([^\]]+)\]\]/g,"$1");
  const pj=ITEM_BY_NAME["Pump Jack"]!==undefined?FR_NAMES[ITEM_BY_NAME["Pump Jack"]]:"Pump Jack";
  if(g==="Caves")return d.replace("Ore Count","Minerais").replace("Worms","Vers").replace("Deep Ores","Minerais profonds");
  return ({DOVs:"Les filons de minerai profonds peuvent contenir différentes ressources.",
    Exotics:"Un gisement d'exotiques peut apparaître ici."+(/Only three/.test(d)?" Seuls trois sont actifs en même temps sur cette carte.":""),
    Oil:`Placez un ${pj} sur un geyser de pétrole pour extraire du pétrole.`,RedSeeds:"Une graine de plante exotique peut apparaître ici.",RedTrees:"Un arbre exotique peut apparaître ici.",
    Geysers:"Les geysers d'enzymes sont des formations naturelles présentes dans plusieurs biomes.",Uranium:"Un gisement d'uranium peut apparaître ici."})[g]||d;}
Object.assign(state,{wm:"olympus",wbg:"base",wgroups:null,wz:1,wx:null,wy:null});

function renderCartes(){
  const t=T(),M=WMAPS[state.wm];
  if(!state.wgroups)state.wgroups={Caves:true,Exotics:true,Oil:true,Uranium:true,Geysers:true,RedTrees:true,RedSeeds:true,DOVs:false};
  if(state.wbg!=="base"&&!M.layers.some(l=>l[0]===state.wbg))state.wbg="base";
  document.getElementById("view").innerHTML=`${regionSwitch()}
  <section class="hero"><div><h1>${t.maps_title}</h1><p>${t.maps_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${t.map_hint}</div></div></section>
  <div class="toolbar">${seg("wm",REGIONS.map(k=>[k,mapName(k)]))}</div>
  <div class="mapctl">
    <div><h3>${t.bg}</h3><div class="seg" role="group">${[["base",""],...M.layers].map(([k])=>`<button type="button" data-wbg="${k}" aria-pressed="${state.wbg===k}">${MLAYER_L[prefs.lang][k]||k}</button>`).join("")}</div></div>
    <div><h3>${t.markers}</h3><div class="chips">${M.groups.map(g=>`<button type="button" class="chip mchip" data-wg="${g[0]}" aria-pressed="${!!state.wgroups[g[0]]}">${g[2]?`<img src="${IMG_BASE}${encodeURI(g[2])}" alt="" width="18" height="18">`:`<i style="background:${MGROUP_COLOR[g[0]]}"></i>`}<span>${MGROUP_L[prefs.lang][g[0]]||g[1]}</span><b>${g[3].length}</b></button>`).join("")}</div></div>
  </div>
  <div class="mapview" id="mapview"><div class="mapinner" id="mapinner"><img class="mapbg" id="mapbg" alt="" draggable="false"><div id="mapmarks"></div></div>
    <div class="mapzoom"><button type="button" class="iconbtn" id="mzin" aria-label="${t.zoom_in}">+</button><button type="button" class="iconbtn" id="mzout" aria-label="${t.zoom_out}">−</button><button type="button" class="iconbtn" id="mzreset" aria-label="${t.reset}">⟲</button></div>
    <div class="mappop" id="mappop" hidden></div></div>`;
  const v=document.getElementById("view");
  wireSegs(v,()=>{state.wz=1;state.wx=null;renderCartes();});
  v.querySelectorAll("[data-wbg]").forEach(b=>b.onclick=()=>{state.wbg=b.dataset.wbg;v.querySelectorAll("[data-wbg]").forEach(x=>x.setAttribute("aria-pressed",x===b));setBg();});
  v.querySelectorAll("[data-wg]").forEach(b=>b.onclick=()=>{state.wgroups[b.dataset.wg]=!state.wgroups[b.dataset.wg];b.setAttribute("aria-pressed",!!state.wgroups[b.dataset.wg]);drawMarks();});
  setBg();drawMarks();initMapPan();
}
function setBg(){const M=WMAPS[state.wm];const f=state.wbg==="base"?M.bg:(M.layers.find(l=>l[0]===state.wbg)||[,M.bg])[1];document.getElementById("mapbg").src=IMG_BASE+encodeURI(f);}
function drawMarks(){const M=WMAPS[state.wm],W=M.br[0]-M.tl[0],H=M.br[1]-M.tl[1];
  let h="";for(const g of M.groups){if(!state.wgroups[g[0]])continue;
    for(let i=0;i<g[3].length;i++){const m=g[3][i];const x=(m[0]-M.tl[0])/W*100,y=(m[1]-M.tl[1])/H*100;
      h+=`<button type="button" class="mk mk-${g[0]}" style="left:${x}%;top:${y}%;--mc:${MGROUP_COLOR[g[0]]||"#888"}" data-g="${g[0]}" data-i="${i}" aria-label="${esc(m[2])}">${g[2]?`<img src="${IMG_BASE}${encodeURI(g[2])}" alt="" draggable="false">`:""}</button>`;}}
  const box=document.getElementById("mapmarks");box.innerHTML=h;
  box.querySelectorAll(".mk").forEach(b=>b.onclick=e=>{if(mapMoved)return;e.stopPropagation();showPop(b.dataset.g,+b.dataset.i,b);});}
function showPop(gk,i,el){const M=WMAPS[state.wm],g=M.groups.find(x=>x[0]===gk),m=g[3][i],pop=document.getElementById("mappop");
  pop.innerHTML=`<button type="button" class="iconbtn popx" aria-label="${T().close}">✕</button><b>${esc(MGROUP_L[prefs.lang][gk]||g[1])}</b><span class="exs">${esc(m[2])}</span><p>${esc(mdesc(gk,m[3])).replace(/• /g,"<br>• ").replace(/^<br>/,"")}</p>`;
  pop.hidden=false;pop.querySelector(".popx").onclick=()=>{pop.hidden=true;};}
let mapMoved=false;
function initMapPan(){
  const vp=document.getElementById("mapview"),inner=document.getElementById("mapinner");
  const base=()=>Math.min(vp.clientWidth,vp.clientHeight);
  const apply=()=>{const s=base()*state.wz;inner.style.width=inner.style.height=s+"px";inner.style.transform=`translate(${state.wx}px,${state.wy}px)`;vp.style.setProperty("--mz",state.wz);};
  const center=()=>{state.wx=(vp.clientWidth-base()*state.wz)/2;state.wy=(vp.clientHeight-base()*state.wz)/2;};
  if(state.wx===null)center();apply();
  const zoomAt=(nz,cx,cy)=>{nz=Math.max(1,Math.min(10,nz));const s=base()*state.wz,ns=base()*nz;const px=(cx-state.wx)/s,py=(cy-state.wy)/s;state.wz=nz;state.wx=cx-px*ns;state.wy=cy-py*ns;apply();};
  vp.addEventListener("wheel",e=>{e.preventDefault();const r=vp.getBoundingClientRect();zoomAt(state.wz*(e.deltaY<0?1.2:1/1.2),e.clientX-r.left,e.clientY-r.top);},{passive:false});
  document.getElementById("mzin").onclick=()=>zoomAt(state.wz*1.4,vp.clientWidth/2,vp.clientHeight/2);
  document.getElementById("mzout").onclick=()=>zoomAt(state.wz/1.4,vp.clientWidth/2,vp.clientHeight/2);
  document.getElementById("mzreset").onclick=()=>{state.wz=1;center();apply();};
  const pts=new Map();let start=null;
  vp.addEventListener("pointerdown",e=>{if(e.target.closest(".mapzoom,.mappop"))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});mapMoved=false;
    if(pts.size===1)start={x:e.clientX,y:e.clientY,wx:state.wx,wy:state.wy};
    if(pts.size===2){const [a,b]=[...pts.values()];start={d:Math.hypot(a.x-b.x,a.y-b.y),z:state.wz};}});
  mapMoveHandler=e=>{if(!pts.has(e.pointerId)||!document.body.contains(vp))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===1&&start&&start.wx!==undefined){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>4){mapMoved=true;vp.classList.add("grabbing");}state.wx=start.wx+dx;state.wy=start.wy+dy;apply();}
    else if(pts.size===2&&start&&start.d){const [a,b]=[...pts.values()];const r=vp.getBoundingClientRect();mapMoved=true;zoomAt(start.z*Math.hypot(a.x-b.x,a.y-b.y)/start.d,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top);}};
  mapEndHandler=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);vp.classList.remove("grabbing");if(pts.size===1){const p=[...pts.values()][0];start={x:p.x,y:p.y,wx:state.wx,wy:state.wy};}else if(!pts.size){start=null;setTimeout(()=>{mapMoved=false;},0);}};
}
let mapMoveHandler=null,mapEndHandler=null;
addEventListener("pointermove",e=>mapMoveHandler&&mapMoveHandler(e));
addEventListener("pointerup",e=>mapEndHandler&&mapEndHandler(e));
addEventListener("pointercancel",e=>mapEndHandler&&mapEndHandler(e));
VIEWS.cartes=()=>renderCartes();
