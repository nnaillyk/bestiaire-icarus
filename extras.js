// Montures & véhicules, poissons, chapitres de guide supplémentaires
Object.assign(UI.fr,{mounts:"Montures",fish:"Poissons",mounts_title:"Montures, compagnons et véhicules",
 mounts_p:"Tout ce qui se monte, se dresse ou s'attelle : montures et leurs selles, compagnons de combat, animaux de ferme, chariots et véhicules. Les données viennent des tables D_Mounts, D_Saddles et D_Tames du jeu.",
 m_ride:"Montures",m_comp:"Compagnons & ferme",m_veh:"Véhicules & attelages",saddles:"Selles compatibles",saddles_n:n=>`${n} selle${n>1?"s":""}`,
 no_saddle:"Ne se monte pas",tame_time:"Apprivoisement",gest:"Gestation",temp:"Température",talent_tree:"Arbre de talents",open_tree:"Ouvrir son arbre de talents",
 mount_sec:"Monture et dressage",veh_p:"Les chariots s'attellent à une monture de trait (bison, tusker, taureau…) ; l'Hoverframe est le véhicule prototype du jeu.",
 fish_title:"Poissons",fish_p:"Les 72 poissons du jeu, leurs régions et les appâts qui les attirent (table D_FishData). Touchez un poisson pour sa fiche, ses recettes et ses usages.",
 lures:"Appâts",all_maps:"Toutes régions",fish_sec:"Pêche",where_fish:"Régions",lure_any:"Aucun appât particulier",search_f:"Chercher un poisson ou un appât…"});
Object.assign(UI.en,{mounts:"Mounts",fish:"Fish",mounts_title:"Mounts, companions and vehicles",
 mounts_p:"Everything you can ride, train or hitch: mounts and their saddles, combat companions, farm animals, carts and vehicles. Data comes from the game's D_Mounts, D_Saddles and D_Tames tables.",
 m_ride:"Mounts",m_comp:"Companions & farm",m_veh:"Vehicles & hitches",saddles:"Compatible saddles",saddles_n:n=>`${n} saddle${n>1?"s":""}`,
 no_saddle:"Not rideable",tame_time:"Taming",gest:"Gestation",temp:"Temperature",talent_tree:"Talent tree",open_tree:"Open its talent tree",
 mount_sec:"Mount and taming",veh_p:"Carts are hitched to a draught mount (buffalo, tusker, bull…); the Hoverframe is the game's prototype vehicle.",
 fish_title:"Fish",fish_p:"All 72 fish in the game, their regions and the lures that attract them (D_FishData table). Tap a fish for its page, recipes and uses.",
 lures:"Lures",all_maps:"All regions",fish_sec:"Fishing",where_fish:"Regions",lure_any:"No specific lure",search_f:"Search a fish or lure…"});

const MOUNT_BY_CRE={};MOUNTS.forEach(m=>{if(!MOUNT_BY_CRE[m[1]])MOUNT_BY_CRE[m[1]]=m;else if(m[3]&&!MOUNT_BY_CRE[m[1]][3])MOUNT_BY_CRE[m[1]]=m;});
const saddlesOf=m=>m&&m[3]?m[3].split(",").map(Number):[];
const TAME_BY_CRE={};TAMES.forEach(r=>{const c=TAME_MAP[r[0]];if(c&&!TAME_BY_CRE[c])TAME_BY_CRE[c]=r;});
const treeOfArch=a=>TREES.findIndex(t=>t[2]===a);
const FISH_BY_ITEM={};FISH.forEach(f=>{if(f[1]>=0)FISH_BY_ITEM[f[1]]=f;});
Object.assign(state,{mt:"ride",fq:"",fmap:"all"});

/* ---------- Vue montures & véhicules ---------- */
function renderMounts(){
  const t=T();
  const uniq=[...new Set(MOUNTS.map(m=>m[1]))].filter(n=>byName[n]);
  const ride=uniq.filter(n=>saddlesOf(MOUNT_BY_CRE[n]).length),comp=uniq.filter(n=>!saddlesOf(MOUNT_BY_CRE[n]).length);
  document.getElementById("view").innerHTML=`${regionSwitch()}
  <section class="hero"><div><h1>${t.mounts_title}</h1>
    <div class="facts"><span><b>${ride.length} ${t.m_ride.toLowerCase()}</b></span><span>${comp.length} ${t.m_comp.toLowerCase()}</span><span>${VEHICLES.length} ${t.m_veh.toLowerCase()}</span></div>
    <p>${t.mounts_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${t.veh_p}</div></div></section>
  <div class="toolbar">${seg("mt",[["ride",t.m_ride],["comp",t.m_comp],["veh",t.m_veh]])}</div>
  <div class="result" id="result"></div><div id="mOut"></div>`;
  const v=document.getElementById("view");wireSegs(v,renderMounts);
  const out=document.getElementById("mOut");
  if(state.mt==="veh"){
    document.getElementById("result").textContent=`${VEHICLES.length}`;
    out.innerHTML=`<div class="items">${VEHICLES.map(i=>`<button class="it" type="button" data-x="${i}">${itemIcon(i)}<span class="it-t"><b>${esc(xname(i))}</b><small>${esc(FR()&&xname(i)!==ITEMS[i][1]?ITEMS[i][1]:gname(ITEMS[i][2]))}</small></span><span class="badges">${MADE_BY[i]?`<i>⚒ ${MADE_BY[i].length}</i>`:""}</span></button>`).join("")}</div>`;
  }else{
    const list=(state.mt==="ride"?ride:comp).sort((a,b)=>cname(a).localeCompare(cname(b),prefs.lang));
    document.getElementById("result").textContent=`${list.length}`;
    out.innerHTML=`<div class="grid">${list.map(n=>{const c=byName[n],m=MOUNT_BY_CRE[n],tr=TAME_BY_CRE[n],sd=saddlesOf(m);
      return `<button class="cc ${c[1]}" type="button" data-c="${esc(n)}">
        <div class="hd">${imgTag(creImg(n),"thumb",`<span class="glyph" style="--g:var(--soft);color:var(--muted)">${esc(glyphTxt(n))}</span>`)}<div class="ttl"><h3>${esc(cname(n))}</h3><div class="sub">${tame(c[3])||(sd.length?TAME_L[prefs.lang].m:"")}</div></div></div>
        <div class="mini">${tr?`<span>${t.tame_time} ${mins(tr[1])}</span>${tr[5]?`<span>${t.gest} ${mins(tr[5])}</span>`:""}<span>${tempTxt(tr[2],tr[3])}</span>`:""}</div>
        <div class="chips">${sd.slice(0,6).map(i=>itemIcon(i)).join("")}${sd.length>6?`<span class="exs">+${sd.length-6}</span>`:""}</div>
        <div class="ft"><span>${sd.length?t.saddles_n(sd.length):t.no_saddle}</span><span>${Object.keys(c[9]).filter(k=>k!=="ferme").map(mapName).join(", ")}</span></div>
      </button>`;}).join("")}</div>`;
  }
  out.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>openSheet({type:"c",id:b.dataset.c},true));
  out.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>openSheet({type:"x",id:+b.dataset.x},true));
}

/* ---------- Vue poissons ---------- */
function renderFish(){
  const t=T();
  document.getElementById("view").innerHTML=`${regionSwitch()}
  <section class="hero"><div><h1>${t.fish_title}</h1>
    <div class="facts"><span><b>${FISH.length} ${t.fish.toLowerCase()}</b></span><span>${new Set(FISH.flatMap(f=>f[5]?f[5].split(","):[])).size} ${t.lures.toLowerCase()}</span></div>
    <p>${t.fish_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${FR()?"Fabriquez une canne à pêche au palier 1 ou 2 et un appât adapté. L'établi de pêche fabrique de meilleures cannes, des appâts et des pièges à poissons.":"Craft a fishing rod in tier 1 or 2 and a suitable lure. The fishing bench makes better rods, lures and fish traps."}</div></div></section>
  <div class="toolbar"><label class="search">${SEARCH_ICON}<input id="fq" type="search" placeholder="${t.search_f}" value="${esc(state.fq)}" aria-label="${t.search_f}"></label>
    ${seg("fmap",[["all",t.all_maps],...REGIONS.map(k=>[k,mapName(k)])])}</div>
  <div class="result" id="result"></div><div class="grid" id="fOut"></div>`;
  const v=document.getElementById("view");
  v.querySelector("#fq").oninput=e=>{state.fq=e.target.value;drawFishList();};wireSegs(v,drawFishList);drawFishList();
}
function drawFishList(){
  const q=state.fq.trim().toLowerCase();
  const list=FISH.filter(f=>f[1]>=0).filter(f=>state.fmap==="all"||f[4].split(",").includes(state.fmap))
    .filter(f=>!q||[ITEMS[f[1]][1],xname(f[1]),...(f[5]?f[5].split(",").map(i=>xname(+i)+" "+ITEMS[+i][1]):[])].join(" ").toLowerCase().includes(q))
    .sort((a,b)=>xname(a[1]).localeCompare(xname(b[1]),prefs.lang));
  document.getElementById("result").textContent=`${list.length}`;
  const out=document.getElementById("fOut");
  out.innerHTML=list.map(f=>{const lures=f[5]?f[5].split(",").map(Number):[];
    return `<button class="cc P" type="button" data-x="${f[1]}"><div class="hd">${itemIcon(f[1],true)}<div class="ttl"><h3>${esc(xname(f[1]))}</h3><div class="sub">${f[4].split(",").filter(Boolean).map(mapName).join(", ")}</div></div></div>
      <p class="fdesc">${esc(FR()?(f[3]||f[2]):f[2])}</p>
      <div class="chips">${lures.map(i=>`<span class="chip">${itemIcon(i)}<span>${esc(xname(i))}</span></span>`).join("")||`<span class="exs">${T().lure_any}</span>`}</div></button>`;}).join("");
  out.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>openSheet({type:"x",id:+b.dataset.x},true));
}

/* ---------- Ajouts aux fiches ---------- */
function creatureExtra(n){const t=T(),m=MOUNT_BY_CRE[n],tr=TAME_BY_CRE[n];if(!m&&!tr)return "";
  const sd=saddlesOf(m),k=m?treeOfArch(m[2]):-1;
  return `<div class="sec"><h3>${t.mount_sec}</h3>
    ${tr?`<div class="kv"><div><span>${t.tame_time}</span><strong>${mins(tr[1])}</strong></div><div><span>${t.gest}</span><strong>${mins(tr[5])}</strong></div><div><span>${t.temp}</span><strong style="font-size:.85rem">${tempTxt(tr[2],tr[3])}</strong></div></div>`:""}
    ${sd.length?`<p class="exs" style="margin:10px 0 6px">${t.saddles}</p><div class="chips">${sd.map(i=>`<button class="chip" type="button" data-x="${i}">${itemIcon(i)}<span>${esc(xname(i))}</span></button>`).join("")}</div>`:""}
    ${k>=0?`<p style="margin:10px 0 0"><button type="button" class="linkbtn" data-tree-go="${k}">${t.open_tree} : ${esc(treeLabel(k))} ↗</button></p>`:""}</div>`;}
function itemExtra(i){const f=FISH_BY_ITEM[i];if(!f)return "";const t=T(),lures=f[5]?f[5].split(",").map(Number):[];
  return `<div class="sec"><h3>${t.fish_sec}</h3><p class="lede" style="margin:0 0 8px">${esc(FR()?(f[3]||f[2]):f[2])}</p>
   <p class="exs" style="margin:0 0 6px">${t.where_fish} : ${f[4].split(",").filter(Boolean).map(mapName).join(", ")}</p>
   <div class="chips">${lures.map(x=>`<button class="chip" type="button" data-x="${x}">${itemIcon(x)}<span>${esc(xname(x))}</span></button>`).join("")||`<span class="exs">${t.lure_any}</span>`}</div></div>`;}
document.getElementById("sheetBody").addEventListener("click",e=>{const b=e.target.closest("[data-tree-go]");if(!b)return;
  const k=+b.dataset.treeGo;state.tg=TREES[k][4];state.tree=k;closeSheet();location.hash="arbres";if(location.hash==="#arbres")renderTrees();});

/* ---------- Guide : chapitres supplémentaires ---------- */
const _baseGuide=guideSections;
guideSections=function(){const fr=FR(),L=(f,e)=>fr?f:e,secs=_baseGuide();
  const bossList=C.filter(c=>["boss","hunt"].includes(kindOf(c)));
  const lootTop=n=>LOOTS[n].filter(r=>!r.tx).slice(0,4).map(r=>iname(r.item)).join(", ");
  const danger=k=>C.filter(c=>c[9][k]!==undefined&&c[1]==="A"&&kindOf(c)==="faune").sort((a,b)=>(b[4]||0)-(a[4]||0)).slice(0,6);
  secs.splice(2,0,{id:"regions",t:L("Dangers par région","Dangers by region"),h:`
   <p>${L("Les créatures agressives les plus solides de chaque région, d'après les données du jeu. Préparez l'arme et le type de dégâts qui exploitent leur faiblesse.","The toughest aggressive creatures in each region, from the game data. Bring the weapon and damage type that exploits their weakness.")}</p>
   ${REGIONS.map(k=>`<h4>${mapName(k)}</h4><div class="tablewrap"><table class="loot gtable"><thead><tr><th>${L("Créature","Creature")}</th><th class="num">${L("PV","HP")}</th><th>${L("Faible à","Weak to")}</th></tr></thead><tbody>${danger(k).map(c=>`<tr><td>${crLink(c[0])}</td><td class="num">${c[4]?c[4].toLocaleString(prefs.lang):"—"}</td><td>${esc(trait(c[5]))}</td></tr>`).join("")}</tbody></table></div>`).join("")}`});
  secs.push({id:"boss",t:L("Boss et Great Hunts","Bosses and Great Hunts"),h:`
   <p>${L("Les boss donnent des matériaux uniques et leur tête-trophée. Les Great Hunts se lancent depuis l'Open World avec le DLC Great Hunts et finissent par un combat d'arène.","Bosses drop unique materials and their head trophy. Great Hunts start from Open World with the Great Hunts DLC and end with an arena fight.")}</p>
   <div class="tablewrap"><table class="loot gtable"><thead><tr><th>${L("Boss","Boss")}</th><th>${L("Régions","Regions")}</th><th>${L("Faible à","Weak to")}</th><th>${L("Butin","Loot")}</th></tr></thead><tbody>
   ${bossList.map(c=>`<tr><td>${crLink(c[0])}</td><td>${Object.keys(c[9]).map(mapName).join(", ")}</td><td>${esc(trait(c[5]))}</td><td>${esc(lootTop(c[0]))}</td></tr>`).join("")}</tbody></table></div>`});
  secs.push({id:"montures",t:L("Montures et attelages","Mounts and hitches"),h:`
   <ul class="steps big">
    <li>${L("Une monture se dresse depuis un jeune animal (voir le tableau d'apprivoisement), puis se selle. Chaque selle a ses bonus : course, cargaison, froid, désert, armure, apprivoisement rapide…","A mount is trained from a juvenile (see the taming table), then saddled. Each saddle has its own bonuses: speed, cargo, cold, desert, armour, faster taming…")}</li>
    <li>${L("Les montures de trait tirent des chariots : semis, arrosage, récolte. Pratique pour les grandes fermes.","Draught mounts pull carts: seeding, watering, harvesting. Handy for big farms.")}</li>
    <li>${L("Chaque monture gagne de l'expérience et a son propre arbre de talents.","Each mount gains experience and has its own talent tree.")}</li>
   </ul><p><a class="gl" href="#montures">${L("Voir toutes les montures, selles et véhicules →","See all mounts, saddles and vehicles →")}</a></p>`});
  secs.push({id:"peche",t:L("Pêche","Fishing"),h:`
   <p>${L(`Il y a ${FISH.length} poissons. Chaque région a les siens, et certains ne mordent qu'à un appât précis. Les poissons se cuisinent, se fument et servent à des recettes de cuisine avancée.`,`There are ${FISH.length} fish. Each region has its own, and some only bite a specific lure. Fish can be cooked, smoked and used in advanced recipes.`)}</p>
   <p><a class="gl" href="#poissons">${L("Voir tous les poissons et leurs appâts →","See all fish and their lures →")}</a></p>`});
  return secs;};

/* ---------- Navigation ---------- */
VIEWS.montures=()=>renderMounts();VIEWS.poissons=()=>renderFish();
