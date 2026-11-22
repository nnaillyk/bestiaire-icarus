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
Object.assign(state,{wm:"olympus",wbg:"base",wgroups:null,wz:1,wx:null,wy:null,hideMined:false,wfocus:null,wore:null,wdrill:null});
// Réglages de la carte retenus d'une visite à l'autre (carte, fond, calques)
const MPREF_KEY="icarus-cartes-reglages";
try{const p=JSON.parse(localStorage.getItem(MPREF_KEY)||"null");if(p){if(REGIONS.includes(p.wm))state.wm=p.wm;if(p.wbg)state.wbg=p.wbg;if(p.wgroups&&typeof p.wgroups==="object")state.wgroups=p.wgroups;state.hideMined=!!p.hideMined;}}catch(e){}
const saveMapPrefs=()=>{try{localStorage.setItem(MPREF_KEY,JSON.stringify({wm:state.wm,wbg:state.wbg,wgroups:state.wgroups,hideMined:state.hideMined}));}catch(e){}};
addEventListener("keydown",e=>{if(e.key==="Escape"){const p=document.getElementById("mappop");if(p&&!p.hidden){p.hidden=true;e.stopPropagation();}}},true);

/* ---------- Ma prospection : gisements profonds lus dans le fichier de sauvegarde ---------- */
// Fichier : %LOCALAPPDATA%\Icarus\Saved\PlayerData\<SteamID>\Prospects\<nom>.json
// Chaque filon profond y est enregistré (ResourceDepositRecorderComponent) avec son minerai (ResourceDTKey) et sa position exacte.
// Plusieurs prospections gardées en même temps : en charger une nouvelle n'enlève pas les autres
const PROS_KEY="icarus-cartes-prospection",PROSL_KEY="icarus-cartes-prospections";
let PROS_LIST=[],PROS=null;
try{const s=JSON.parse(localStorage.getItem(PROSL_KEY)||"null");if(s&&Array.isArray(s.list)){PROS_LIST=s.list;PROS=PROS_LIST.find(p=>p.name===s.active)||PROS_LIST[0]||null;}
  else{const old=JSON.parse(localStorage.getItem(PROS_KEY)||"null");if(old&&old.deps){PROS_LIST=[old];PROS=old;}}}catch(e){PROS_LIST=[];PROS=null;}
function saveProsList(){try{localStorage.setItem(PROSL_KEY,JSON.stringify({active:PROS?.name||null,list:PROS_LIST}));localStorage.removeItem(PROS_KEY);return true;}
  catch(e){return false;}}
function prosActivate(p){PROS=p;indexPros();state.wore=null;if(p){state.wm=p.map;if(state.wgroups){state.wgroups.DOVs=true;state.wgroups.CaveDOVs=true;}state.wz=1;state.wx=null;}saveProsList();renderCartes();}
const posKey=(x,y)=>Math.round(x)+"|"+Math.round(y);
let PROS_IDX=new Map(),DRILL_AT=new Map(),DRILL_FREE=[];
function indexPros(){PROS_IDX=new Map();DRILL_AT=new Map();DRILL_FREE=[];if(!PROS)return;
  for(const d of PROS.deps)if(!d[3])PROS_IDX.set(posKey(d[0],d[1]),d);
  for(const r of PROS.drills||[]){const d=PROS.deps[r[4]];if(d)DRILL_AT.set(posKey(d[0],d[1]),r);else DRILL_FREE.push(r);}}
indexPros();
const prosHere=()=>PROS&&PROS.map===state.wm;
async function prosDecode(text,fname){const obj=JSON.parse(text);
  if(!obj.ProspectBlob||!obj.ProspectBlob.BinaryBlob)throw new Error(FR()?"ce n'est pas un fichier de prospection (il doit venir du dossier Prospects).":"this is not a prospect file (it must come from the Prospects folder).");
  const raw=await pipe(b64ToU8(obj.ProspectBlob.BinaryBlob),new DecompressionStream("deflate"));
  const blobs=UE.find(UE.parse(raw),"StateRecorderBlobs");const deps=[],drillsRaw=[];
  const ueXY=props=>{const tr=UE.find(props,"ActorTransform");const t=tr&&tr.val&&UE.find(tr.val,"Translation");
    if(!t||!t.raw||t.raw.length<12)return null;const dv=new DataView(t.raw.buffer,t.raw.byteOffset,12);return [Math.round(dv.getFloat32(0,true)),Math.round(dv.getFloat32(4,true))];};
  const ueDeep=(props,n,d=0)=>{if(!props||d>8)return;const hit=UE.find(props,n);if(hit)return hit;for(const p of props)if(Array.isArray(p.val)){const r=ueDeep(p.val,n,d+1);if(r)return r;}};
  for(const el of blobs.val.els){const cls=UE.sv(UE.find(el,"ComponentClassName").val);
    const isDep=/ResourceDepositRecorderComponent$/.test(cls),isDrill=!isDep&&/DrillRecorderComponent$/.test(cls);if(!isDep&&!isDrill)continue;
    let props;try{props=UE.parseBytesArray(UE.find(el,"BinaryData"));}catch(e){continue;}
    const pos=ueXY(props);if(!pos)continue;
    // Foreuse posée : type, en marche ou non, filon sur lequel elle est posée, minerai stocké
    if(isDrill){const inv={};
      for(const iv of UE.find(props,"SavedInventories")?.val?.els||[])for(const sl of UE.find(iv,"Slots")?.val?.els||[]){
        const it=UE.sv(UE.find(sl,"ItemStaticData")?.val||"");if(!it)continue;
        const st=(UE.find(sl,"DynamicData")?.val?.els||[]).find(e=>UE.find(e,"Index")?.val===7);inv[it]=(inv[it]||0)+(st?UE.find(st,"Value")?.val||1:1);}
      drillsRaw.push([pos[0],pos[1],UE.sv(ueDeep(props,"StaticItemDataRowName")?.val||"")||"Deep_Mining_Drill_Biofuel",ueDeep(props,"bDrillActive")?.bool?1:0,ueDeep(props,"FoundationActorIcarusUID")?.val,inv]);continue;}
    const ore=UE.sv(UE.find(props,"ResourceDTKey")?.val||"");if(!ore)continue;
    const name=UE.sv(UE.find(props,"ObjectFName")?.val||"")+UE.sv(UE.find(props,"ActorClassName")?.val||"");
    const rem=UE.find(props,"ResourceRemaining")?.val,guid=UE.find(props,"IcarusActorGUID")?.val;
    deps.push([pos[0],pos[1],ore,/Cave/i.test(name)?1:0,typeof rem==="number"?rem:-1,typeof guid==="number"?guid:null]);}
  if(!deps.length)throw new Error(FR()?"aucun filon profond trouvé dans ce fichier.":"no deep ore vein found in this file.");
  // Chaque foreuse est reliée à son filon (identifiant du filon, sinon le plus proche à moins de 30 m)
  const byGuid=new Map();deps.forEach((d,j)=>{if(d[5]!==null)byGuid.set(d[5],j);});
  const drills=drillsRaw.map(r=>{let j=r[4]!=null&&byGuid.has(r[4])?byGuid.get(r[4]):-1;
    if(j<0){let bd=3000;deps.forEach((d,i)=>{const dd=Math.hypot(d[0]-r[0],d[1]-r[1]);if(dd<bd){bd=dd;j=i;}});}
    return [r[0],r[1],r[2],r[3],j,r[5]];});
  // Carte : celle dont les filons du wiki tombent pile sur ceux de la sauvegarde
  let best=null,bestN=-1;for(const [k,M] of Object.entries(WMAPS)){const g=M.groups.find(x=>x[0]==="DOVs");if(!g)continue;
    const set=new Set(g[3].map(m=>posKey(m[0],m[1])));const n=deps.filter(d=>set.has(posKey(d[0],d[1]))).length;if(n>bestN){bestN=n;best=k;}}
  if(bestN<=0){const dk=(obj.ProspectInfo?.ProspectDTKey||"").toLowerCase();best=Object.keys(WMAPS).find(k=>dk.includes(k))||state.wm;}
  return {name:obj.ProspectInfo?.ProspectID||fname.replace(/\.json$/i,""),key:obj.ProspectInfo?.ProspectDTKey||"",map:best,at:Date.now(),deps,drills};}
async function prosLoad(text,fname){const msg=document.getElementById("prosmsg");if(msg){msg.hidden=false;msg.textContent=FR()?"Lecture de la prospection…":"Reading the prospect…";}
  try{const p=await prosDecode(text,fname);const i=PROS_LIST.findIndex(x=>x.name===p.name);if(i>=0)PROS_LIST[i]=p;else PROS_LIST.push(p);
    prosActivate(p);
    if(!saveProsList()){const m=document.getElementById("prosmsg");if(m){m.hidden=false;m.textContent=FR()?"Prospection affichée, mais l'appareil manque de place pour la garder avec les autres : retire-en une pour qu'elle soit retenue.":"Prospect shown, but the device is out of space to keep it with the others: remove one so it's remembered.";}}}
  catch(e){if(msg){msg.hidden=false;msg.textContent=(FR()?"Impossible de lire ce fichier : ":"Could not read this file: ")+e.message;}}}
function prosClear(name){PROS_LIST=PROS_LIST.filter(p=>p.name!==(name??PROS?.name));prosActivate(PROS&&PROS.name!==(name??PROS.name)?PROS:PROS_LIST[0]||null);}
function prosPanel(){const fr=FR(),t=T();const fromSave=typeof SV!=="undefined"?Object.keys(SV.prospects||{}):[];
  if(!PROS)return `<div class="prosbox"><p class="exs">${fr?"Ajoute ton fichier de prospection : chaque filon profond de ta partie s'affiche avec son vrai minerai.":"Add your prospect file: every deep ore vein in your game shows with its real ore."}</p>
    <div class="svload"><label class="primary svfile">${fr?"Charger ma prospection (.json)":"Load my prospect (.json)"}<input type="file" id="prosFile" accept=".json,application/json" hidden></label>
    ${fromSave.map(n=>`<button type="button" class="more" data-prosv="${esc(n)}">${esc(n)}</button>`).join("")}</div>
    <p class="exs"><code class="path">%LOCALAPPDATA%\\Icarus\\Saved\\PlayerData\\&lt;SteamID&gt;\\Prospects\\</code></p><p class="exs" id="prosmsg" hidden></p></div>`;
  const deps=PROS.deps,open=deps.filter(d=>!d[3]),cave=deps.filter(d=>d[3]);
  const counts={};for(const d of deps)counts[d[2]]=(counts[d[2]]||0)+1;
  const ores=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return `<div class="prosbox">${PROS_LIST.length?`<div class="chips proslist" role="group" aria-label="${fr?"Mes prospections":"My prospects"}">${PROS_LIST.map(p=>`<span class="prchip"><button type="button" class="chip" data-prosa="${esc(p.name)}" aria-pressed="${p===PROS}">📁 <span>${esc(p.name)}</span><b>${esc(mapName(p.map))}</b></button><button type="button" class="prx" data-prosx="${esc(p.name)}" aria-label="${fr?"Retirer":"Remove"} ${esc(p.name)}" title="${fr?"Retirer cette prospection":"Remove this prospect"}">✕</button></span>`).join("")}
    ${fromSave.filter(n=>!PROS_LIST.some(p=>p.name===n||p.name===SV.prospects[n]?.obj?.ProspectInfo?.ProspectID)).map(n=>`<button type="button" class="more" data-prosv="${esc(n)}">＋ ${esc(n)}</button>`).join("")}</div>`:""}
    <div class="trackbar"><span class="tstat">◆ ${fr?"Filons en surface":"Surface veins"} <b>${open.length}</b></span><span class="tstat">⛏ ${fr?"Filons en grotte":"Cave veins"} <b>${cave.length}</b></span>${PROS.drills?`<span class="tstat">${drillBadge(PROS.drills[0]?.[2]||DRILLS[0][0])} ${fr?"Foreuses détectées":"Drills found"} <b>${PROS.drills.length}</b></span>`:""}
    <label class="more svfile">${fr?"Ajouter une prospection":"Add a prospect"}<input type="file" id="prosFile" accept=".json,application/json" multiple hidden></label></div>
    ${PROS.map!==state.wm?`<p class="exs">${fr?`Cette prospection est sur ${esc(mapName(PROS.map))}.`:`This prospect is on ${esc(mapName(PROS.map))}.`} <button type="button" class="gl" id="prosGo">${fr?"Y aller":"Go there"}</button></p>`:`
    <h3 style="margin-top:10px">${fr?"Filtrer par minerai":"Filter by ore"}</h3>
    <div class="chips orechips"><button type="button" class="chip" data-wore="" aria-pressed="${!state.wore}"><span>${fr?"Tous":"All"}</span><b>${deps.length}</b></button>${ores.map(([o,n])=>`<button type="button" class="chip" data-wore="${o}" aria-pressed="${state.wore===o}">${oreIcon(o)}<span>${esc(oreLabel(o))}</span><b>${n}</b></button>`).join("")}</div>`}
    ${PROS.drills?"":`<p class="exs">${fr?"Recharge ce fichier pour que l'appli détecte aussi les foreuses que tu as posées.":"Reload this file so the app also detects the drills you placed."}</p>`}
    <p class="exs" id="prosmsg" hidden></p></div>`;}
async function prosLoadMany(files){for(const file of [...files].filter(f=>/\.json$/i.test(f.name)))await prosLoad(await file.text(),file.name);}
function wirePros(v){const f=v.querySelector("#prosFile");if(f)f.onchange=e=>prosLoadMany(e.target.files);
  v.querySelectorAll("[data-prosv]").forEach(b=>b.onclick=()=>{const p=SV.prospects[b.dataset.prosv];if(p)prosLoad(p.text,p.name);});
  v.querySelectorAll("[data-prosa]").forEach(b=>b.onclick=()=>{const p=PROS_LIST.find(x=>x.name===b.dataset.prosa);if(p&&p!==PROS)prosActivate(p);});
  v.querySelectorAll("[data-prosx]").forEach(b=>b.onclick=()=>prosClear(b.dataset.prosx));
  v.querySelector("#prosGo")?.addEventListener("click",()=>{state.wm=PROS.map;state.wz=1;state.wx=null;renderCartes();});
  v.querySelectorAll("[data-wore]").forEach(b=>b.onclick=()=>{state.wore=b.dataset.wore||null;state.wgroups.DOVs=true;state.wgroups.CaveDOVs=true;
    v.querySelectorAll("[data-wore]").forEach(x=>x.setAttribute("aria-pressed",x===b));v.querySelectorAll('[data-wg="DOVs"],[data-wg="CaveDOVs"]').forEach(x=>x.setAttribute("aria-pressed","true"));drawMarks();});
  const vp=v.querySelector("#mapview");if(vp){vp.addEventListener("dragover",e=>{if([...e.dataTransfer.types].includes("Files")){e.preventDefault();vp.classList.add("over");}});
    vp.addEventListener("dragleave",()=>vp.classList.remove("over"));
    vp.addEventListener("drop",e=>{vp.classList.remove("over");if(!e.dataTransfer.files.length)return;e.preventDefault();prosLoadMany(e.dataTransfer.files);});}}

/* ---------- Créature ciblée : ses zones d'apparition ---------- */
function focusPanel(){const fr=FR(),M=state.wm;const list=C.filter(c=>c[9][M]!==undefined&&MAPS[M]).map(c=>c[0]).sort((a,b)=>cname(a).localeCompare(cname(b),prefs.lang));
  const zs=state.wfocus?spawnZonesFor(M,state.wfocus):null;
  return `<div class="focusbar"><label class="svf">${fr?"Où trouver une créature":"Where to find a creature"}<select id="wfocus"><option value="">${fr?"— Choisir —":"— Pick —"}</option>${list.map(n=>`<option value="${esc(n)}" ${n===state.wfocus?"selected":""}>${esc(cname(n))}</option>`).join("")}</select></label>
   ${state.wfocus?`<div class="focusinfo">${imgTag(creImg(state.wfocus),"thumb","")}<span><b>${esc(cname(state.wfocus))}</b> · ${zs===null?(fr?"zones pas encore relevées pour cette carte : le calque « Apparitions » est affiché.":"zones not mapped yet for this map: the “Spawns” layer is shown."):zs.length?(fr?`${zs.length} zone(s) — les épingles montrent sa chance d'apparition`:`${zs.length} zone(s) — pins show its spawn chance`):(fr?"n'apparaît dans aucune zone ouverte de cette carte (grotte, arène ou événement).":"doesn't spawn in an open-world zone on this map (cave, arena or event).")}
     ${SPAWN_ALIAS[state.wfocus]?`<br><span class="exs">${fr?`Apparaît avec ${esc(cname(SPAWN_ALIAS[state.wfocus]))}.`:`Spawns with ${esc(cname(SPAWN_ALIAS[state.wfocus]))}.`}</span>`:""}</span>
     <button type="button" class="more" data-goc="${esc(state.wfocus)}">${fr?"Fiche":"Details"}</button><button type="button" class="iconbtn" id="wfocusX" aria-label="${T().close}">✕</button></div>`:""}</div>`;}

/* ---------- Suivi personnel (enregistré sur l'appareil) ---------- */
const TRACK_KEY="icarus-cartes-suivi";
let TRACK={};try{TRACK=JSON.parse(localStorage.getItem(TRACK_KEY)||"{}")||{};}catch(e){TRACK={};}
const saveTrack=()=>{try{localStorage.setItem(TRACK_KEY,JSON.stringify(TRACK));}catch(e){}};
const trk=(map,g,id)=>((TRACK[map]??={})[g]??={})[id];
function setTrk(map,g,id,val){((TRACK[map]??={})[g]??={});if(val===null||val===undefined||(typeof val==="object"&&!Object.keys(val).length))delete TRACK[map][g][id];else TRACK[map][g][id]=val;saveTrack();}
// Ressources possibles d'un filon profond (table D_OreDeposit du jeu) → nom de l'objet pour la traduction
const DOV_ORES=[["Iron","Iron Ore","#b5651d"],["Copper","Copper Ore","#d17a3a"],["Gold","Gold Ore","#e6c229"],["Platinum","Platinum Ore","#cfd8dc"],["Titanium","Titanium Ore","#8fa3b8"],["Aluminium","Aluminium Ore","#a9b4c2"],["Silicon","Silica Ore","#e8e2c8"],["Coal","Coal Ore","#333333"],["Sulfur","Sulfur","#e3d23b"],["Oxite","Oxite","#f0f4f7"],["Salt","Salt","#f7f1e3"],["Stone","Stone","#8a8a8a"],["Clay","Clay","#b0704a"],["Scoria","Scoria","#7a3b2e"],["Obsidian","Obsidian","#2a1f3d"],["Limestone","Limestone","#d8cfb0"],["Super_Cooled_Ice","Super Cooled Ice","#7fd3f0"],["Exotic","Exotics","#9b59d0"],["Exotic_Red_Raw","Volatile Raw Exotics","#d0453a"],["Exotic_Raw_Uranium","Raw Uranium","#7ac943"],["Lithium","Lithium Ore","#c7a6e0"],["Cobalt","Cobalt Ore","#3a5fcd"],["Ruby","Ruby","#c2185b"]];
const oreLabel=o=>{const r=DOV_ORES.find(x=>x[0]===o);if(!r)return o;const i=ITEM_BY_NAME[r[1]];return i!==undefined?xname(i):r[1];};
const oreColor=o=>(DOV_ORES.find(x=>x[0]===o)||[,,"#8c96a3"])[2];
const oreIdx=o=>{const r=DOV_ORES.find(x=>x[0]===o);return r?ITEM_BY_NAME[r[1]]:undefined;};
const oreIcon=o=>{const i=oreIdx(o);return i!==undefined?itemIcon(i):`<span class="pic"><span class="glyph" style="--g:${oreColor(o)}">${esc(oreLabel(o).slice(0,2).toUpperCase())}</span></span>`;};
// Foreuses de minage profond du jeu
// [clé du jeu, nom de l'objet, image, couleur, tracé du logo (24×24), couleur du logo, nom court fr, nom court en]
const DRILLS=[
 ["Deep_Mining_Drill_Biofuel","Biofuel Deep-Mining Drill","ITEM_Deep_Mining_Drill_Biofuel.png","#43a047","M19 3C10 3 5 8 5 14c0 1.4.4 2.7 1 3.8l-2.5 2.5 1.4 1.4 2.4-2.4A7 7 0 0 0 11 20c6 0 9.2-6.4 8-17Zm-2.2 2.4c-.3 3-1.4 5.6-3.4 7.6-1.5 1.5-3.4 2.6-5.6 3.2 1.6-2.6 4.3-5.9 9-10.8Z","#fff","Biocarburant","Biofuel"],
 ["Deep_Mining_Drill_Electric","Electric Deep-Mining Drill","ITEM_Deep_Mining_Drill_Electric.png","#1e88e5","M13.6 2 4.5 13.6H11L9.6 22l9.1-11.7h-6.5L13.6 2Z","#ffe14d","Électrique","Electric"],
 ["Deep_Mining_Drill_Oil","Oil Deep-Mining Drill","T_ITEM_Deep_Mining_Drill_Oil.png","#212121","M12 2.5S5 10.3 5 15a7 7 0 0 0 14 0c0-4.7-7-12.5-7-12.5Zm-3.2 12.2c.3 1.7 1.5 3 3.2 3.3v1.7c-2.6-.3-4.6-2.4-4.9-5h1.7Z","#ff9800","Pétrole","Oil"]];
const drillKey=k=>k===true?DRILLS[0][0]:k;
const drillRow=k=>DRILLS.find(x=>x[0]===drillKey(k))||[k,"",null,"#78909c","M12 2 3 7v10l9 5 9-5V7l-9-5Z","#fff","Foreuse","Drill"];
const drillIdx=d=>{const r=DRILLS.find(x=>x[0]===drillKey(d));return r?ITEM_BY_NAME[r[1]]:undefined;};
const drillLabel=d=>{const i=drillIdx(d);return i!==undefined?xname(i):(FR()?"Foreuse":"Drill");};
const drillShort=d=>drillRow(d)[FR()?6:7];
// Emoji propre à chaque foreuse
const DRILL_EMOJI={Deep_Mining_Drill_Biofuel:"🌿",Deep_Mining_Drill_Electric:"⚡",Deep_Mining_Drill_Oil:"🛢️"};
const drillSvg=(k,s=12)=>`<span class="dremo" style="font-size:${Math.round(s*.95)}px" aria-hidden="true">${DRILL_EMOJI[drillKey(k)]||"⚙️"}</span>`;
// Pastille ronde aux couleurs de la foreuse, avec son logo (légende, boutons, marqueurs)
const drillBadge=(k,cls="",s=12)=>{const r=drillRow(k);return `<i class="drb ${cls}" style="--dc:${r[3]};--dg:${r[5]}" title="${esc(drillLabel(k))}">${drillSvg(k,s)}</i>`;};
// Foreuse sur un filon : celle lue dans la sauvegarde, sinon celle notée à la main
function drillInfo(pk,trackId){const s=prosHere()?DRILL_AT.get(pk):null;
  if(s)return {k:s[2],on:!!s[3],save:true,inv:s[5]};
  const tr=trackId!=null?trk(state.wm,"DOVs",trackId):null;return tr?.drill?{k:drillKey(tr.drill),on:null,save:false}:null;}
const passDrill=info=>!state.wdrill||(state.wdrill==="none"?!info:state.wdrill==="any"?!!info:!!info&&info.k===state.wdrill);
// Nom lisible d'un objet stocké (« Titanium_Ore » → objet « Titanium Ore »)
const invLabel=k=>{const i=ITEM_BY_NAME[k.replace(/_/g," ")];return i!==undefined?xname(i):k.replace(/_/g," ");};
const nf=n=>Number(n).toLocaleString(FR()?"fr-FR":"en-US");
function drillCard(info){const fr=FR(),r=drillRow(info.k),inv=Object.entries(info.inv||{});
  return `<div class="drillcard" style="--dc:${r[3]}">${imgTag(r[2],"",`<span class="glyph" style="--g:${r[3]}">⚙</span>`)}${drillBadge(info.k,"corner")}
   <span><b>${esc(drillLabel(info.k))}</b>${info.on===null?`<br><span class="exs">${fr?"Notée à la main":"Noted by hand"}</span>`:`<br><span class="dstat ${info.on?"on":"off"}">${info.on?(fr?"En marche":"Running"):(fr?"À l'arrêt":"Stopped")}</span>`}
   ${inv.length?`<br><span class="exs">${fr?"Contenu":"Holds"} : ${inv.map(([k,n])=>`<b>${nf(n)}</b> × ${esc(invLabel(k))}`).join(", ")}</span>`:info.save?`<br><span class="exs">${fr?"Vide":"Empty"}</span>`:""}</span></div>`;}
// Section « foreuse » d'une fiche de filon : lue dans la sauvegarde ou choisie à la main
function drillSection(pk,trackId){const fr=FR(),info=drillInfo(pk,trackId);
  if(info&&info.save)return `<div class="tsel">${fr?"Foreuse posée (d'après ta sauvegarde)":"Drill placed (from your save)"}</div>${drillCard(info)}`;
  const cur=info?.k||"";
  return `<div class="tsel">${fr?"Foreuse posée":"Drill placed"}</div>
   <div class="oregrid drills"><button type="button" class="orebtn" data-drill="" aria-pressed="${!cur}"><span class="pic"><span class="glyph" style="--g:var(--soft);color:var(--muted)">—</span></span><span>${fr?"Aucune":"None"}</span></button>${DRILLS.map(d=>`<button type="button" class="orebtn" data-drill="${d[0]}" aria-pressed="${cur===d[0]}" style="--dc:${d[3]}">${imgTag(d[2],"",`<span class="glyph" style="--g:${d[3]}">⚙</span>`)}${drillBadge(d[0],"corner",10)}<span>${esc(drillLabel(d[0]))}</span></button>`).join("")}</div>`;}
function wireDrillPick(pop,onPick){pop.querySelectorAll("[data-drill]").forEach(b=>b.onclick=()=>{pop.querySelectorAll("[data-drill]").forEach(x=>x.setAttribute("aria-pressed",x===b));onPick(b.dataset.drill);});}
// Toutes les foreuses de la carte affichée (sauvegarde + suivi manuel)
function mapDrills(){const M=WMAPS[state.wm],ph=prosHere(),out=[],seen=new Set();
  const dg=M.groups.find(g=>g[0]==="DOVs");
  if(dg)dg[3].forEach(m=>{const pk=posKey(m[0],m[1]);seen.add(pk);const info=drillInfo(pk,m[2]);
    if(info){const sd=ph?PROS_IDX.get(pk):null;out.push({...info,pk,ore:sd?sd[2]:trk(state.wm,"DOVs",m[2])?.ore,x:m[0],y:m[1]});}});
  if(ph){PROS.deps.forEach(d=>{const pk=posKey(d[0],d[1]);if(seen.has(pk))return;const info=drillInfo(pk,"@"+pk);if(info)out.push({...info,pk,ore:d[2],x:d[0],y:d[1],cave:!!d[3]});});
    DRILL_FREE.forEach((r,n)=>out.push({k:r[2],on:!!r[3],save:true,inv:r[5],pk:"free"+n,ore:null,x:r[0],y:r[1],free:true}));}
  return out;}

function renderCartes(){
  const t=T(),M=WMAPS[state.wm];
  if(!state.wgroups)state.wgroups={Caves:true,Exotics:true,Oil:true,Uranium:true,Geysers:true,RedTrees:true,RedSeeds:true,DOVs:!!PROS,CaveDOVs:!!PROS};
  if(state.wbg!=="base"&&!M.layers.some(l=>l[0]===state.wbg))state.wbg="base";
  if(state.wfocus&&!hasSpawnData(state.wm)&&M.layers.some(l=>l[0]==="spawns"))state.wbg="spawns";
  const caveN=prosHere()?PROS.deps.filter(d=>d[3]).length:0;
  document.getElementById("view").innerHTML=`${regionSwitch()}
  <section class="hero"><div><h1>${t.maps_title}</h1><p>${t.maps_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${t.map_hint}</div></div></section>
  <div class="toolbar">${seg("wm",REGIONS.map(k=>[k,mapName(k)]))}</div>
  <div class="mapctl">
    <div><h3>${t.bg}</h3><div class="seg" role="group">${[["base",""],...M.layers].map(([k])=>`<button type="button" data-wbg="${k}" aria-pressed="${state.wbg===k}">${MLAYER_L[prefs.lang][k]||k}</button>`).join("")}</div></div>
    <div><h3>${t.markers}</h3><div class="chips">${M.groups.map(g=>`<button type="button" class="chip mchip" data-wg="${g[0]}" aria-pressed="${!!state.wgroups[g[0]]}">${g[2]?`<img src="${IMG_BASE}${encodeURI(g[2])}" alt="" width="18" height="18">`:`<i style="background:${MGROUP_COLOR[g[0]]}"></i>`}<span>${MGROUP_L[prefs.lang][g[0]]||g[1]}</span><b>${g[3].length}</b></button>`).join("")}${caveN?`<button type="button" class="chip mchip" data-wg="CaveDOVs" aria-pressed="${!!state.wgroups.CaveDOVs}"><i style="background:#5d4a8a"></i><span>${FR()?"Filons profonds en grotte":"Deep veins in caves"}</span><b>${caveN}</b></button>`:""}</div></div>
    <div><h3>${FR()?"Ma prospection (gisements profonds)":"My prospect (deep ore veins)"}</h3>${prosPanel()}</div>
    <div><h3>${FR()?"Créatures":"Creatures"}</h3>${focusPanel()}</div>
    <div><h3>${FR()?"Mon suivi":"My progress"}</h3><div class="trackbar" id="trackbar"></div></div>
  </div>
  <div class="mapview" id="mapview"><div class="mapinner" id="mapinner"><img class="mapbg" id="mapbg" alt="" draggable="false"><div id="mapmarks"></div></div>
    <div class="mapzoom"><button type="button" class="iconbtn" id="mzfs" aria-label="${FR()?"Plein écran":"Full screen"}" title="${FR()?"Plein écran":"Full screen"}">⛶</button><button type="button" class="iconbtn" id="mzin" aria-label="${t.zoom_in}">+</button><button type="button" class="iconbtn" id="mzout" aria-label="${t.zoom_out}">−</button><button type="button" class="iconbtn" id="mzreset" aria-label="${t.reset}">⟲</button></div>
    <div class="mappop" id="mappop" hidden></div></div>`;
  const v=document.getElementById("view");
  wireSegs(v,()=>{state.wz=1;state.wx=null;renderCartes();});
  v.querySelectorAll("[data-wbg]").forEach(b=>b.onclick=()=>{state.wbg=b.dataset.wbg;v.querySelectorAll("[data-wbg]").forEach(x=>x.setAttribute("aria-pressed",x===b));setBg();saveMapPrefs();});
  v.querySelectorAll("[data-wg]").forEach(b=>b.onclick=()=>{state.wgroups[b.dataset.wg]=!state.wgroups[b.dataset.wg];b.setAttribute("aria-pressed",!!state.wgroups[b.dataset.wg]);drawMarks();});
  wirePros(v);
  v.querySelector("#wfocus").onchange=e=>{state.wfocus=e.target.value||null;renderCartes();};
  v.querySelector("#wfocusX")?.addEventListener("click",()=>{state.wfocus=null;renderCartes();});
  v.querySelectorAll(".focusbar [data-goc]").forEach(b=>b.onclick=()=>openSheet({type:"c",id:b.dataset.goc},true));
  setBg();drawMarks();initMapPan();drawTrackbar();
  if(state.wfocus)setTimeout(()=>document.getElementById("mapview")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
}
function drawTrackbar(){const M=WMAPS[state.wm],fr=FR(),box=document.getElementById("trackbar");if(!box)return;
  const caves=M.groups.find(g=>g[0]==="Caves"),dovs=M.groups.find(g=>g[0]==="DOVs");
  const mined=caves?caves[3].filter(m=>trk(state.wm,"Caves",m[2])).length:0;
  const known=dovs?dovs[3].filter(m=>trk(state.wm,"DOVs",m[2])?.ore||(prosHere()&&PROS_IDX.has(posKey(m[0],m[1])))).length:0;
  const all=mapDrills(),by=k=>all.filter(d=>d.k===k).length;
  const chip=(v,inner,n)=>`<button type="button" class="chip" data-wdrill="${v}" aria-pressed="${state.wdrill===(v||null)}">${inner}${n===undefined?"":`<b>${n}</b>`}</button>`;
  box.innerHTML=`${caves?`<span class="tstat">⛏ ${fr?"Grottes minées":"Caves mined"} <b>${mined}/${caves[3].length}</b></span>`:""}
   ${dovs?`<span class="tstat">◆ ${fr?"Filons renseignés":"Veins identified"} <b>${known}/${dovs[3].length}</b></span>`:""}
   <label class="tchk"><input type="checkbox" id="hideMined" ${state.hideMined?"checked":""}> ${fr?"Masquer les grottes minées":"Hide mined caves"}</label>
   <span class="tbtns"><button type="button" class="more" id="trkExp">${fr?"Exporter mon suivi":"Export my progress"}</button><label class="more svfile">${fr?"Importer":"Import"}<input type="file" id="trkImp" accept=".json,application/json" hidden></label></span>
   ${dovs||prosHere()?`<div class="drillbar"><div class="tsel">${fr?"Foreuses sur la carte":"Drills on the map"} · <b>${all.length}</b></div>
    <div class="chips">${chip("",`<span>${fr?"Tous les filons":"All veins"}</span>`)}${chip("any",`<span>${fr?"Avec foreuse":"With drill"}</span>`,all.length)}${chip("none",`<span>${fr?"Sans foreuse":"Without drill"}</span>`)}${DRILLS.map(d=>chip(d[0],`${drillBadge(d[0],"",13)}<span>${esc(drillShort(d[0]))}</span>`,by(d[0]))).join("")}</div>
    ${all.length?`<div class="drilllist">${all.map(d=>`<button type="button" class="drow" data-fpk="${d.pk}" data-fx="${d.x}" data-fy="${d.y}" style="--dc:${drillColor(d.k)}">${drillBadge(d.k,"",14)}${d.ore?oreIcon(d.ore):`<span class="pic"><span class="glyph" style="--g:var(--soft);color:var(--muted)">?</span></span>`}
      <span class="dtxt"><b>${esc(d.ore?oreLabel(d.ore):(fr?"Filon inconnu":"Unknown vein"))}</b>${d.cave?` <span class="exs">· ${fr?"grotte":"cave"}</span>`:""}<br><span class="exs">${esc(drillShort(d.k))}${d.on===true?` · <span class="dstat on">● ${fr?"en marche":"running"}</span>`:d.on===false?` · <span class="dstat off">● ${fr?"arrêtée":"stopped"}</span>`:""}${Object.keys(d.inv||{}).length?" · "+nf(Object.values(d.inv).reduce((a,b)=>a+b,0))+(fr?" en stock":" stored"):""}</span></span><span class="dgo" aria-hidden="true">➜</span></button>`).join("")}</div>`:`<p class="exs">${fr?"Touche un filon profond sur la carte pour noter la foreuse que tu y as posée, ou charge ta prospection pour les détecter toutes seules.":"Tap a deep ore vein on the map to note the drill you placed there, or load your prospect to detect them automatically."}</p>`}</div>`:""}`;
  box.querySelector("#hideMined").onchange=e=>{state.hideMined=e.target.checked;drawMarks();};
  box.querySelectorAll("[data-wdrill]").forEach(b=>b.onclick=()=>{const v=b.dataset.wdrill||null;state.wdrill=state.wdrill===v?null:v;
    if(state.wdrill){state.wgroups.DOVs=true;state.wgroups.CaveDOVs=true;document.querySelectorAll('[data-wg="DOVs"],[data-wg="CaveDOVs"]').forEach(x=>x.setAttribute("aria-pressed","true"));}
    drawMarks();drawTrackbar();});
  box.querySelectorAll("[data-fpk]").forEach(b=>b.onclick=()=>focusMarker(+b.dataset.fx,+b.dataset.fy,b.dataset.fpk));
  box.querySelector("#trkExp").onclick=()=>{const blob=new Blob([JSON.stringify({app:"bestiaire-icarus",type:"suivi-cartes",v:1,at:new Date().toISOString(),track:TRACK},null,1)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="suivi-cartes-icarus.json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);};
  box.querySelector("#trkImp").onchange=async e=>{const f=e.target.files[0];if(!f)return;
    try{const o=JSON.parse(await f.text());const t=o&&o.track;if(!t||typeof t!=="object")throw 0;
      for(const [mp,gs] of Object.entries(t))for(const [g,ids] of Object.entries(gs||{}))for(const [id,v] of Object.entries(ids||{}))((TRACK[mp]??={})[g]??={})[id]=v;
      saveTrack();drawMarks();drawTrackbar();}
    catch(err){alert(fr?"Ce fichier n'est pas un suivi exporté par l'appli.":"This file isn't a progress file exported by the app.");}};}
const drillColor=k=>drillRow(k)[3];
// Centre la carte sur un point et ouvre sa fiche
function focusMarker(gx,gy,pk){if(state.wdrill==="none")state.wdrill=null;
  if(state.wore){const d=mapDrills().find(x=>x.pk===pk);if(!d||d.ore!==state.wore)state.wore=null;document.querySelectorAll("[data-wore]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.wore===(state.wore||"")));}
  state.wgroups.DOVs=true;state.wgroups.CaveDOVs=true;document.querySelectorAll('[data-wg="DOVs"],[data-wg="CaveDOVs"]').forEach(x=>x.setAttribute("aria-pressed","true"));
  drawMarks();drawTrackbar();if(mapFocus)mapFocus(gx,gy);
  const vp=document.getElementById("mapview");if(vp&&!vp.classList.contains("mapfs"))vp.scrollIntoView({behavior:"smooth",block:"center"});
  setTimeout(()=>{const el=document.querySelector(`#mapmarks .mk[data-pk="${pk}"]`);if(el){el.classList.add("flash");el.click();setTimeout(()=>el.classList.remove("flash"),1600);}},450);}
let mapFocus=null;
function setBg(){const M=WMAPS[state.wm];const f=state.wbg==="base"?M.bg:(M.layers.find(l=>l[0]===state.wbg)||[,M.bg])[1];document.getElementById("mapbg").src=IMG_BASE+encodeURI(f);}
function drawMarks(){const M=WMAPS[state.wm],W=M.br[0]-M.tl[0],H=M.br[1]-M.tl[1],ph=prosHere();saveMapPrefs();
  const at=(gx,gy)=>`left:${(gx-M.tl[0])/W*100}%;top:${(gy-M.tl[1])/H*100}%`;
  const oreImg=o=>{const oi=oreIdx(o);return oi!==undefined&&ITEMS[oi][4]?`<img src="${IMG_BASE}${encodeURI(ITEMS[oi][4])}" alt="" draggable="false">`:"";};
  // Logo de la foreuse en coin du marqueur (couleur et pictogramme propres à chaque type ; point rouge si à l'arrêt)
  const dmark=info=>info?{cls:" drill",style:`;--dc:${drillColor(info.k)}`,em:`<em class="drb${info.on===false?" off":""}" style="--dc:${drillColor(info.k)};--dg:${drillRow(info.k)[5]}">${drillSvg(info.k,10)}</em>`,lab:" · "+drillLabel(info.k)}:{cls:"",style:"",em:"",lab:""};
  let h="";for(const g of M.groups){if(!state.wgroups[g[0]])continue;
    for(let i=0;i<g[3].length;i++){const m=g[3][i];
      const tr=trk(state.wm,g[0],m[2]);let cls="",col=MGROUP_COLOR[g[0]]||"#888",inner=g[2]?`<img src="${IMG_BASE}${encodeURI(g[2])}" alt="" draggable="false">`:"",extra="",lab=m[2],pkA="";
      if(g[0]==="Caves"&&tr){if(state.hideMined)continue;cls=" mined";inner+=`<em>✓</em>`;}
      if(g[0]==="DOVs"){const pk=posKey(m[0],m[1]);const sd=ph?PROS_IDX.get(pk):null;const ore=sd?sd[2]:tr?.ore;
        if(state.wore&&ph&&ore!==state.wore)continue;
        const info=drillInfo(pk,m[2]);if(!passDrill(info))continue;
        if(ore){col=oreColor(ore);cls+=" known"+(sd?" fromsave":"");inner=oreImg(ore);lab=oreLabel(ore);}
        const d=dmark(info);cls+=d.cls;extra=d.style;inner+=d.em;lab+=d.lab;pkA=` data-pk="${pk}"`;}
      h+=`<button type="button" class="mk mk-${g[0]}${cls}" style="${at(m[0],m[1])};--mc:${col}${extra}" data-g="${g[0]}" data-i="${i}"${pkA} aria-label="${esc(lab)}">${inner}</button>`;}}
  // Filons de surface de la sauvegarde absents des cartes du wiki, et filons profonds en grotte (seulement dans la sauvegarde)
  if(ph){const wk=new Set((M.groups.find(x=>x[0]==="DOVs")||[,,,[]])[3].map(m=>posKey(m[0],m[1])));
    PROS.deps.forEach((d,j)=>{const pk=posKey(d[0],d[1]);if(d[3]?!state.wgroups.CaveDOVs:(!state.wgroups.DOVs||wk.has(pk)))return;if(state.wore&&d[2]!==state.wore)return;
      const info=drillInfo(pk,"@"+pk);if(!passDrill(info))return;const dm=dmark(info);
      h+=`<button type="button" class="mk ${d[3]?"mk-cave":"mk-DOVs known fromsave"}${dm.cls}" style="${at(d[0],d[1])};--mc:${oreColor(d[2])}${dm.style}" data-cave="${j}" data-pk="${pk}" aria-label="${esc(oreLabel(d[2])+dm.lab)}">${oreImg(d[2])}${dm.em}</button>`;});
    // Foreuses de la sauvegarde qui ne sont reliées à aucun filon connu
    if(state.wgroups.DOVs&&!state.wore&&state.wdrill!=="none")DRILL_FREE.forEach((r,n)=>{if(state.wdrill&&state.wdrill!=="any"&&state.wdrill!==r[2])return;
      h+=`<button type="button" class="mk mk-drillonly" style="${at(r[0],r[1])};--dc:${drillColor(r[2])};--dg:${drillRow(r[2])[5]}" data-free="${n}" data-pk="free${n}" aria-label="${esc(drillLabel(r[2]))}">${drillSvg(r[2],13)}</button>`;});}
  // Zones d'apparition de la créature choisie
  const zs=state.wfocus?spawnZonesFor(state.wm,state.wfocus):null;
  if(zs)zs.forEach((z,zi)=>z.pts.forEach(p=>{h+=`<button type="button" class="mk mk-spawn" style="left:${p[0]}%;top:${p[1]}%" data-zone="${zi}" aria-label="${esc(zoneLabel(z.z))}"><span>${z.pct===null?"✓":z.pct+"%"}</span></button>`;}));
  const box=document.getElementById("mapmarks");box.innerHTML=h;box.classList.toggle("orefilter",!!(state.wore&&prosHere()));box.classList.toggle("spawnfocus",!!(zs&&zs.length));box.classList.toggle("drillfilter",!!state.wdrill);
  box.querySelectorAll(".mk[data-free]").forEach(b=>b.onclick=e=>{if(mapMoved)return;e.stopPropagation();showFreeDrillPop(+b.dataset.free,b);});
  box.querySelectorAll(".mk[data-g]").forEach(b=>b.onclick=e=>{if(mapMoved)return;e.stopPropagation();showPop(b.dataset.g,+b.dataset.i,b);});
  box.querySelectorAll(".mk[data-cave]").forEach(b=>b.onclick=e=>{if(mapMoved)return;e.stopPropagation();showCavePop(+b.dataset.cave,b);});
  box.querySelectorAll(".mk[data-zone]").forEach(b=>b.onclick=e=>{if(mapMoved)return;e.stopPropagation();showZonePop(zs[+b.dataset.zone],b);});}
function popShell(html,el){const pop=document.getElementById("mappop");pop.innerHTML=`<button type="button" class="iconbtn popx" aria-label="${T().close}">✕</button>${html}`;pop.hidden=false;pop.querySelector(".popx").onclick=()=>{pop.hidden=true;};placePop(pop,el);return pop;}
// Place la fiche à côté du marqueur touché (à droite si la place le permet, sinon à gauche ; jamais hors de la carte)
function placePop(pop,el){const vp=document.getElementById("mapview");if(!el||!vp){pop.style.left="10px";pop.style.top="";pop.style.bottom="10px";return;}
  pop.style.bottom="auto";pop.style.left="0px";pop.style.top="0px";pop.dataset.side="";
  const V=vp.getBoundingClientRect(),M=el.getBoundingClientRect(),P=pop.getBoundingClientRect(),gap=12,pad=8;
  const mx=M.left-V.left+M.width/2,my=M.top-V.top+M.height/2;let x,side;
  if(mx+gap+P.width<=V.width-pad){x=mx+gap;side="r";}else if(mx-gap-P.width>=pad){x=mx-gap-P.width;side="l";}else{x=Math.max(pad,Math.min(V.width-P.width-pad,mx-P.width/2));side="c";}
  let y=side==="c"?(my+gap+P.height<=V.height-pad?my+gap:my-gap-P.height):my-P.height/2;
  y=Math.max(pad,Math.min(V.height-P.height-pad,y));pop.style.left=Math.round(x)+"px";pop.style.top=Math.round(y)+"px";pop.dataset.side=side;}
function showFreeDrillPop(n,el){const r=DRILL_FREE[n],fr=FR();
  popShell(`<b>${esc(drillLabel(r[2]))}</b><span class="exs">${esc(PROS.name)}</span>${drillCard({k:r[2],on:!!r[3],save:true,inv:r[5]})}
   <p>${fr?"Cette foreuse est dans ta sauvegarde mais l'appli n'a pas trouvé le filon sous elle.":"This drill is in your save but the app couldn't find the vein under it."}</p>`,el);}
function showCavePop(j,el){const d=PROS.deps[j],fr=FR(),cave=!!d[3],pk=posKey(d[0],d[1]);
  const pop=popShell(`<b>${cave?(fr?"Filon profond en grotte":"Deep ore vein in a cave"):(fr?"Filon de minerai profond":"Deep ore vein")}</b><span class="exs">${esc(PROS.name)}</span>
   <div class="savebadge">${oreIcon(d[2])}<span>${fr?"Minerai d'après ta sauvegarde":"Ore from your save"}<br><b>${esc(oreLabel(d[2]))}</b></span></div>
   <p>${cave?(fr?"Il se trouve à l'intérieur d'une grotte : entrez par la grotte la plus proche. Il faut une foreuse de minage profond pour l'exploiter.":"It's inside a cave: go in through the nearest cave. A deep-mining drill is needed to mine it."):(fr?"Ce filon est dans ta sauvegarde mais pas sur les cartes du wiki. Il faut une foreuse de minage profond pour l'exploiter.":"This vein is in your save but not on the wiki maps. A deep-mining drill is needed to mine it.")}</p>${drillSection(pk,"@"+pk)}`,el);
  wireDrillPick(pop,k=>{setTrk(state.wm,"DOVs","@"+pk,k?{drill:k}:null);drawMarks();drawTrackbar();});}
function showZonePop(z,el){const fr=FR(),n=state.wfocus,base=SPAWN_ALIAS[n]||n;const mobs=SPAWNZ[state.wm].find(x=>x[0]===z.z)[3];
  const pop=popShell(`<b>${esc(zoneLabel(z.z))}</b><span class="exs">${esc(z.z)} · ${fr?"niveau":"level"} ${z.lv}</span>
   <p>${z.pct===null?(fr?`${esc(cname(n))} est présent dans cette zone.`:`${esc(cname(n))} is present in this zone.`):(fr?`${esc(cname(base))} : <b>${z.pct} %</b> des apparitions de la zone.`:`${esc(cname(base))}: <b>${z.pct}%</b> of the zone's spawns.`)}</p>
   <div class="tsel">${fr?"Toutes les créatures de la zone":"Every creature in the zone"}</div>
   <div class="zonelist">${Object.entries(mobs).map(([m,p])=>`<button type="button" class="linkbtn" data-zc="${esc(m)}" ${m===base?'aria-current="true"':""}>${byName[m]?imgTag(creImg(m),"mini-img",""):""}${esc(byName[m]?cname(m):m)} <span class="exs">${p} %</span></button>`).join("")}</div>`,el);
  pop.querySelectorAll("[data-zc]").forEach(b=>b.onclick=()=>{if(byName[b.dataset.zc]){state.wfocus=b.dataset.zc;renderCartes();}});}
function showPop(gk,i,el){const M=WMAPS[state.wm],g=M.groups.find(x=>x[0]===gk),m=g[3][i],pop=document.getElementById("mappop");
  const fr=FR(),tr=trk(state.wm,gk,m[2]);let form="";
  if(gk==="Caves")form=`<label class="tchk big"><input type="checkbox" id="tkMined" ${tr?"checked":""}> ${fr?"Grotte minée":"Cave mined"}</label>`;
  const curDrill=drillKey(tr?.drill);const pk=posKey(m[0],m[1]);
  const sd=gk==="DOVs"&&prosHere()?PROS_IDX.get(pk):null;
  if(gk==="DOVs")form=(sd?`<div class="savebadge">${oreIcon(sd[2])}<span>${fr?`Minerai d'après ta sauvegarde (${esc(PROS.name)})`:`Ore from your save (${esc(PROS.name)})`}<br><b>${esc(oreLabel(sd[2]))}</b></span></div>`:`<div class="tsel">${fr?"Minerai du filon":"Vein ore"}</div>
    <div class="oregrid" role="radiogroup" aria-label="${fr?"Minerai du filon":"Vein ore"}"><button type="button" class="orebtn" data-ore="" aria-pressed="${!tr?.ore}"><span class="pic"><span class="glyph" style="--g:var(--soft);color:var(--muted)">?</span></span><span>${fr?"Inconnu":"Unknown"}</span></button>${DOV_ORES.map(o=>`<button type="button" class="orebtn" data-ore="${o[0]}" aria-pressed="${tr?.ore===o[0]}">${oreIcon(o[0])}<span>${esc(oreLabel(o[0]))}</span></button>`).join("")}</div>`)+drillSection(pk,m[2]);
  pop.innerHTML=`<button type="button" class="iconbtn popx" aria-label="${T().close}">✕</button><b>${esc(MGROUP_L[prefs.lang][gk]||g[1])}</b><span class="exs">${esc(m[2])}</span><p>${esc(mdesc(gk,m[3])).replace(/• /g,"<br>• ").replace(/^<br>/,"")}</p>${form}`;
  pop.hidden=false;pop.querySelector(".popx").onclick=()=>{pop.hidden=true;};placePop(pop,el);
  const upd=()=>{drawMarks();drawTrackbar();};
  pop.querySelector("#tkMined")?.addEventListener("change",e=>{setTrk(state.wm,"Caves",m[2],e.target.checked?true:null);upd();});
  if(gk==="DOVs"){let ore=tr?.ore||"",drill=curDrill||"";
    const saveDov=()=>{const v={};if(ore)v.ore=ore;if(drill)v.drill=drill;setTrk(state.wm,"DOVs",m[2],v);upd();};
    pop.querySelectorAll("[data-ore]").forEach(b=>b.onclick=()=>{ore=b.dataset.ore;pop.querySelectorAll("[data-ore]").forEach(x=>x.setAttribute("aria-pressed",x===b));saveDov();});
    wireDrillPick(pop,k=>{drill=k;saveDov();});}}
let mapMoved=false;
function initMapPan(){
  const vp=document.getElementById("mapview"),inner=document.getElementById("mapinner");
  const base=()=>Math.min(vp.clientWidth,vp.clientHeight);
  const apply=()=>{const s=base()*state.wz;inner.style.width=inner.style.height=s+"px";inner.style.transform=`translate(${state.wx}px,${state.wy}px)`;vp.style.setProperty("--mz",state.wz);};
  const center=()=>{state.wx=(vp.clientWidth-base()*state.wz)/2;state.wy=(vp.clientHeight-base()*state.wz)/2;};
  if(state.wx===null)center();apply();
  mapFocus=(gx,gy)=>{const M=WMAPS[state.wm];const fx=(gx-M.tl[0])/(M.br[0]-M.tl[0]),fy=(gy-M.tl[1])/(M.br[1]-M.tl[1]);
    state.wz=Math.max(state.wz,4);const s=base()*state.wz;state.wx=vp.clientWidth/2-fx*s;state.wy=vp.clientHeight/2-fy*s;
    inner.classList.add("glide");apply();setTimeout(()=>inner.classList.remove("glide"),400);};
  const zoomAt=(nz,cx,cy)=>{const pp=document.getElementById("mappop");if(pp)pp.hidden=true;nz=Math.max(1,Math.min(10,nz));const s=base()*state.wz,ns=base()*nz;const px=(cx-state.wx)/s,py=(cy-state.wy)/s;state.wz=nz;state.wx=cx-px*ns;state.wy=cy-py*ns;apply();};
  vp.addEventListener("wheel",e=>{e.preventDefault();const r=vp.getBoundingClientRect();zoomAt(state.wz*(e.deltaY<0?1.2:1/1.2),e.clientX-r.left,e.clientY-r.top);},{passive:false});
  document.getElementById("mzin").onclick=()=>zoomAt(state.wz*1.4,vp.clientWidth/2,vp.clientHeight/2);
  document.getElementById("mzout").onclick=()=>zoomAt(state.wz/1.4,vp.clientWidth/2,vp.clientHeight/2);
  document.getElementById("mzreset").onclick=()=>{state.wz=1;center();apply();};
  // Plein écran : API native quand elle existe (PC, Android), sinon plein écran « fenêtre » en CSS (iPhone)
  const refit=()=>setTimeout(()=>{state.wz=Math.max(1,state.wz);center();apply();},60);
  document.getElementById("mzfs").onclick=async()=>{
    const on=!vp.classList.contains("mapfs");vp.classList.toggle("mapfs",on);document.body.classList.toggle("noscroll",on);
    try{if(on&&vp.requestFullscreen&&!document.fullscreenElement)await vp.requestFullscreen();else if(!on&&document.fullscreenElement)await document.exitFullscreen();}catch(e){}
    refit();};
  vp.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&vp.classList.contains("mapfs")){vp.classList.remove("mapfs");document.body.classList.remove("noscroll");}refit();});
  window.onresize=()=>{if(document.body.contains(vp))refit();};
  const pts=new Map();let start=null;
  vp.addEventListener("pointerdown",e=>{if(e.target.closest(".mapzoom,.mappop"))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});mapMoved=false;
    if(pts.size===1)start={x:e.clientX,y:e.clientY,wx:state.wx,wy:state.wy};
    if(pts.size===2){const [a,b]=[...pts.values()];start={d:Math.hypot(a.x-b.x,a.y-b.y),z:state.wz};}});
  mapMoveHandler=e=>{if(!pts.has(e.pointerId)||!document.body.contains(vp))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pts.size===1&&start&&start.wx!==undefined){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>4){mapMoved=true;vp.classList.add("grabbing");const pp=document.getElementById("mappop");if(pp)pp.hidden=true;}state.wx=start.wx+dx;state.wy=start.wy+dy;apply();}
    else if(pts.size===2&&start&&start.d){const [a,b]=[...pts.values()];const r=vp.getBoundingClientRect();mapMoved=true;zoomAt(start.z*Math.hypot(a.x-b.x,a.y-b.y)/start.d,(a.x+b.x)/2-r.left,(a.y+b.y)/2-r.top);}};
  mapEndHandler=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);vp.classList.remove("grabbing");if(pts.size===1){const p=[...pts.values()][0];start={x:p.x,y:p.y,wx:state.wx,wy:state.wy};}else if(!pts.size){start=null;setTimeout(()=>{mapMoved=false;},0);}};
}
let mapMoveHandler=null,mapEndHandler=null;
addEventListener("pointermove",e=>mapMoveHandler&&mapMoveHandler(e));
addEventListener("pointerup",e=>mapEndHandler&&mapEndHandler(e));
addEventListener("pointercancel",e=>mapEndHandler&&mapEndHandler(e));
VIEWS.cartes=()=>renderCartes();
