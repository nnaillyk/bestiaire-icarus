// Arbres de talents / techs, guide du jeu, zoom des images
/* ---------- Textes ---------- */
Object.assign(UI.fr,{trees:"Arbres",guide:"Guide",trees_title:"Arbres de talents et de techs",
 trees_p:"Les arbres du jeu tels qu'ils sont dans les fichiers : talents du personnage, techs (blueprints) par palier, atelier orbital, montures et régions. Touchez une case pour son détail et le chemin pour la débloquer.",
 g_talent:"Talents",g_tech:"Techs",g_workshop:"Atelier orbital",g_creature:"Créatures",g_prospect:"Régions & Great Hunts",
 search_t:"Chercher un talent ou un blueprint…",zoom_in:"Zoomer",zoom_out:"Dézoomer",results:n=>`${n} résultat${n>1?"s":""}`,
 talent:"Talent",blueprint:"Blueprint",tree:"Arbre",rank_req:"Rang d'arbre requis",level_req:"Niveau requis",ranks:"Rangs",effects:"Effets",
 prereq:"Prérequis",unlocks:"Débloque ensuite",path:"Chemin complet",path_n:n=>`${n} étape${n>1?"s":""} avant`,default_unl:"Débloqué d'office",
 open_item:"Voir l'objet et sa recette",none:"Aucun",tech_hint:"Les blueprints coûtent des points de tech ; le niveau indiqué est le niveau de personnage minimum.",
 talent_hint:"Le rang d'arbre (Novice → Apprenti → Compagnon → Maître) se gagne en investissant des points dans le même arbre : 4, 8 puis 12 points. Cliquez-glissez pour vous déplacer, Ctrl + molette pour zoomer.",
 lvl:"Niv.",tap_zoom:"Touchez l'image pour l'agrandir"});
Object.assign(UI.en,{trees:"Trees",guide:"Guide",trees_title:"Talent and tech trees",
 trees_p:"The game's trees exactly as stored in the files: character talents, tech (blueprints) by tier, orbital workshop, mounts and regions. Tap a node for details and the path to unlock it.",
 g_talent:"Talents",g_tech:"Tech",g_workshop:"Orbital workshop",g_creature:"Creatures",g_prospect:"Regions & Great Hunts",
 search_t:"Search a talent or blueprint…",zoom_in:"Zoom in",zoom_out:"Zoom out",results:n=>`${n} result${n>1?"s":""}`,
 talent:"Talent",blueprint:"Blueprint",tree:"Tree",rank_req:"Required tree rank",level_req:"Required level",ranks:"Ranks",effects:"Effects",
 prereq:"Prerequisites",unlocks:"Unlocks next",path:"Full path",path_n:n=>`${n} step${n>1?"s":""} before`,default_unl:"Unlocked by default",
 open_item:"View the item and its recipe",none:"None",tech_hint:"Blueprints cost tech points; the level shown is the minimum character level.",
 talent_hint:"Tree rank (Novice → Apprentice → Journeyman → Master) is earned by spending points in the same tree: 4, 8 then 12 points.",
 lvl:"Lv.",tap_zoom:"Tap the image to enlarge it"});
const RANK_L={fr:{Novice:"Novice",Apprentice:"Apprenti",Journeyman:"Compagnon",Master:"Maître"},en:{Novice:"Novice",Apprentice:"Apprentice",Journeyman:"Journeyman",Master:"Master"}};
const TREE_FR={"Survival":"Survie","Adventure":"Aventure","Combat":"Combat","Habitation":"Habitat","Solo":"Solo","Resources":"Ressources","Exploration":"Exploration","Bows / Crossbows":"Arcs / arbalètes","Spears":"Lances","Blades":"Lames","Repairing":"Réparation","Tools":"Outils","Building":"Construction","Firearms":"Armes à feu","Hunting":"Chasse","Cooking / Farming":"Cuisine / agriculture","Husbandry":"Élevage","Genetics":"Génétique","Fishing":"Pêche","Tier 1":"Palier 1","Tier 2":"Palier 2","Tier 3":"Palier 3","Tier 4":"Palier 4","Tier 5":"Palier 5","Envirosuits":"Combinaisons","Armors":"Armures","Backpacks":"Sacs à dos","Modules":"Modules","Gadgets":"Gadgets","Axes":"Haches","Pickaxes":"Pioches","Knives":"Couteaux","Sickles":"Faucilles","Hammers":"Marteaux","Bows":"Arcs","Crossbows":"Arbalètes","Deployables":"Déployables","Extraction":"Extraction","Consumables":"Consommables","Farming":"Agriculture","Raw Resources":"Ressources brutes","Refined Resources":"Ressources raffinées","Creatures":"Créatures","Creature Equipment":"Équipement de créature","Mount Base Tree":"Arbre commun des montures","Outpost Overview":"Avant-postes","Ice Mammoth":"Rimetusk","Buffalo":"Bison","Wolf":"Loup","Snow Wolf":"Loup des neiges","Boar":"Sanglier","Sheep":"Mouton","Chicken":"Poule","Rooster":"Coq","Horse":"Cheval","Cat":"Chat","Dog":"Chien","Zebra":"Zèbre","Shaggy Zebra":"Zèbre laineux","Hyena":"Hyène","Arctic Moa":"Moa arctique","Cow":"Vache","Dune Raptor":"Raptor des dunes","Woolly Mammoth":"Mammouth laineux","Bull":"Taureau","Pig":"Cochon"};
const trName=s=>FR()?(TREE_FR[s]||s):s;
const GROUPS_T=["talent","tech","workshop","creature","prospect"];

/* ---------- Données des arbres ---------- */
// TALENTS : [id, arbre, x, y, nom, desc, image, rangs, prérequis, niveau, rang, objet, effets, taille, défaut]
const TAL_BY_ID={};TALENTS.forEach((t,i)=>TAL_BY_ID[t[0]]=i);
const TAL_REQ=TALENTS.map(t=>t[8]?t[8].split(",").map(id=>TAL_BY_ID[id]).filter(x=>x!==undefined):[]);
const TAL_KIDS=TALENTS.map(()=>[]);TAL_REQ.forEach((rs,i)=>rs.forEach(r=>TAL_KIDS[r].push(i)));
const named=i=>!!TALENTS[i][4];
const tname=i=>FR()?(L_TALENTS[i]?.[0]||(TALENTS[i][11]>=0?xname(TALENTS[i][11]):TALENTS[i][4])):TALENTS[i][4];
const tdesc=i=>FR()?(L_TALENTS[i]?.[1]||TALENTS[i][5]):TALENTS[i][5];
const teff=i=>FR()?(L_TALENTS[i]?.[3]||TALENTS[i][12]):(L_TALENTS[i]?.[2]||TALENTS[i][12]);
function resolveNamed(list,next,seen=new Set()){const out=[];for(const i of list){if(seen.has(i))continue;seen.add(i);if(named(i))out.push(i);else out.push(...resolveNamed(next(i),next,seen));}return [...new Set(out)];}
const namedReqs=i=>resolveNamed(TAL_REQ[i],j=>TAL_REQ[j]);
const namedKids=i=>resolveNamed(TAL_KIDS[i],j=>TAL_KIDS[j]);
function fullPath(i){const order=[],seen=new Set();(function walk(j){for(const r of namedReqs(j)){if(seen.has(r))continue;seen.add(r);walk(r);order.push(r);}})(i);return order;}
const treeLabel=k=>{const t=TREES[k];return FR()?(L_TREES[k]?.[0]||L_TREES[k]?.[1]||trName(t[1]||t[3])):(t[1]||t[3]);};
const archLabel=k=>FR()?(L_TREES[k]?.[1]||trName(TREES[k][3])):TREES[k][3];
const treeFull=k=>{const t=TREES[k];return t[1]&&t[3]&&t[1]!==t[3]&&t[4]==="talent"?archLabel(k)+" · "+treeLabel(k):treeLabel(k);};
const TREE_NODES=TREES.map(()=>[]);TALENTS.forEach((t,i)=>TREE_NODES[t[1]].push(i));

Object.assign(state,{tg:"talent",tree:TREES.findIndex(t=>t[4]==="talent"),tq:"",tzoom:1});

/* ---------- Vue arbres ---------- */
function renderTrees(){
  const t=T();
  const inGroup=TREES.map((x,k)=>k).filter(k=>TREES[k][4]===state.tg&&TREE_NODES[k].some(named));
  if(!inGroup.includes(state.tree))state.tree=inGroup[0];
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${t.trees_title}</h1>
    <div class="facts"><span><b>${TREES.length} ${t.trees.toLowerCase()}</b></span><span>${TALENTS.filter((_,i)=>named(i)).length} ${t.talent.toLowerCase()}s & blueprints</span></div>
    <p>${t.trees_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${state.tg==="tech"?t.tech_hint:t.talent_hint}</div></div>
  </section>
  <div class="toolbar">
    <label class="search">${SEARCH_ICON}<input id="tq" type="search" placeholder="${t.search_t}" value="${esc(state.tq)}" aria-label="${t.search_t}"></label>
    ${seg("tg",GROUPS_T.map(g=>[g,t["g_"+g]]))}
  </div>
  <div id="tsearch"></div>
  <nav class="treetabs" aria-label="${t.tree}">${inGroup.map(k=>`<button type="button" data-tree="${k}" aria-pressed="${k===state.tree}">${esc(treeFull(k))}</button>`).join("")}</nav>
  <div class="treebar"><b>${esc(treeFull(state.tree))}</b><span>${TREE_NODES[state.tree].filter(named).length} ${t.talent.toLowerCase()}s</span>
    <span class="zoom"><button type="button" class="iconbtn" id="zout" aria-label="${t.zoom_out}">−</button><button type="button" class="iconbtn" id="zin" aria-label="${t.zoom_in}">+</button></span></div>
  <div class="treewrap" id="treewrap"></div>`;
  const v=document.getElementById("view");
  wireSegs(v,()=>{state.tree=-1;renderTrees();});
  v.querySelectorAll("[data-tree]").forEach(b=>b.onclick=()=>{state.tree=+b.dataset.tree;renderTrees();});
  v.querySelector("#tq").oninput=e=>{state.tq=e.target.value;renderTreeSearch();};
  v.querySelector("#zin").onclick=()=>{state.tzoom=Math.min(2,state.tzoom*1.25);drawTree();};
  v.querySelector("#zout").onclick=()=>{state.tzoom=Math.max(.35,state.tzoom/1.25);drawTree();};
  drawTree();renderTreeSearch();
  bindPan(document.getElementById("treewrap"));
}
/* Déplacement à la souris : cliquer-glisser pour se déplacer, Ctrl + molette pour zoomer */
let panState=null,panMoved=false;
function bindPan(wrap){
  wrap.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button!==0)return;
    panState={x:e.clientX,y:e.clientY,l:wrap.scrollLeft,t:wrap.scrollTop,wrap};panMoved=false;});
  wrap.addEventListener("click",e=>{if(panMoved){e.stopPropagation();e.preventDefault();panMoved=false;}},true);
  wrap.addEventListener("wheel",e=>{if(!e.ctrlKey)return;e.preventDefault();
    state.tzoom=e.deltaY<0?Math.min(2,state.tzoom*1.15):Math.max(.35,state.tzoom/1.15);drawTree();},{passive:false});
  wrap.addEventListener("dragstart",e=>e.preventDefault());
}
addEventListener("pointermove",e=>{if(!panState)return;const dx=e.clientX-panState.x,dy=e.clientY-panState.y;
  if(!panMoved&&Math.abs(dx)+Math.abs(dy)>5){panMoved=true;panState.wrap.classList.add("grabbing");}
  if(panMoved){panState.wrap.scrollLeft=panState.l-dx;panState.wrap.scrollTop=panState.t-dy;}});
addEventListener("pointerup",()=>{if(panState){panState.wrap.classList.remove("grabbing");panState=null;}});
function drawTree(focus){
  const t=T(),k=state.tree,nodes=TREE_NODES[k];if(!nodes.length)return;
  const wide=Math.max(...nodes.map(i=>TALENTS[i][2]))>4000;
  const s=(wide?.42:.55)*state.tzoom;
  const maxX=Math.max(...nodes.map(i=>TALENTS[i][2]+TALENTS[i][13])),maxY=Math.max(...nodes.map(i=>TALENTS[i][3]+TALENTS[i][13]));
  const W=Math.ceil(maxX*s+80),H=Math.ceil(maxY*s+90);
  const cx=i=>TALENTS[i][2]*s+40,cy=i=>TALENTS[i][3]*s+30;
  let lines="";
  for(const i of nodes)for(const r of TAL_REQ[i])if(TALENTS[r][1]===k)lines+=`<line x1="${cx(r)}" y1="${cy(r)}" x2="${cx(i)}" y2="${cy(i)}"/>`;
  const q=state.tq.trim().toLowerCase();
  const html=nodes.filter(named).map(i=>{const tl=TALENTS[i];const sz=Math.max(34,tl[13]*s*.62);const hit=q&&(tl[4]+" "+tname(i)).toLowerCase().includes(q);
    const fb=`<span class="glyph" style="--g:${tl[11]>=0?GROUP_COLOR[ITEMS[tl[11]][2]]:"var(--map)"}">${esc(glyphTxt(tl[4]))}</span>`;
    return `<button type="button" class="tnode${tl[11]>=0?" bp":""}${hit?" hit":""}${focus===i?" focus":""}" data-t="${i}" style="left:${cx(i)}px;top:${cy(i)}px;--sz:${sz}px" title="${esc(tname(i))}">
      ${imgTag(tl[6],"tpic",fb)}${tl[7]>1?`<em class="rk">${tl[7]}</em>`:""}${tl[9]?`<em class="lv">${t.lvl} ${tl[9]}</em>`:""}<span class="tl">${esc(tname(i))}</span></button>`;}).join("");
  const wrap=document.getElementById("treewrap");
  wrap.innerHTML=`<div class="tcanvas" style="width:${W}px;height:${H}px"><svg width="${W}" height="${H}" aria-hidden="true">${lines}</svg>${html}</div>`;
  wrap.querySelectorAll(".tnode").forEach(b=>b.onclick=()=>openSheet({type:"t",id:+b.dataset.t},true));
  if(focus!==undefined){const el=wrap.querySelector(`[data-t="${focus}"]`);if(el)el.scrollIntoView({block:"center",inline:"center"});}
}
function renderTreeSearch(){
  const t=T(),q=state.tq.trim().toLowerCase(),box=document.getElementById("tsearch");
  if(!q){box.innerHTML="";drawTree();return;}
  const res=TALENTS.map((x,i)=>i).filter(i=>named(i)&&(TALENTS[i][4]+" "+tname(i)+" "+tdesc(i)+" "+teff(i)).toLowerCase().includes(q)).slice(0,60);
  box.innerHTML=`<div class="result">${t.results(res.length)}</div><div class="chips tres">${res.map(i=>`<button type="button" class="chip" data-go="${i}">${imgTag(TALENTS[i][6],"","")}<span>${esc(tname(i))}</span><b>${esc(treeFull(TALENTS[i][1]))}</b></button>`).join("")}</div>`;
  box.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>goTalent(+b.dataset.go));
  drawTree();
}
function goTalent(i){const k=TALENTS[i][1];state.tg=TREES[k][4];state.tree=k;
  if(location.hash!=="#arbres"){location.hash="arbres";setTimeout(()=>{drawTree(i);openSheet({type:"t",id:i},true);},50);}
  else{renderTrees();drawTree(i);openSheet({type:"t",id:i},true);}}

/* ---------- Fiche talent ---------- */
function drawTalent(body,i){const t=T(),tl=TALENTS[i],k=tl[1];
  document.getElementById("sheetCrumb").textContent=(tl[11]>=0?t.blueprint:t.talent)+" · "+treeFull(k);
  const reqs=namedReqs(i),kids=namedKids(i),path=fullPath(i);
  const tchip=j=>`<button class="chip" type="button" data-tt="${j}">${imgTag(TALENTS[j][6],"","")}<span>${esc(tname(j))}</span>${TREES[TALENTS[j][1]]!==TREES[k]?`<b>${esc(treeLabel(TALENTS[j][1]))}</b>`:""}</button>`;
  const fb=`<span class="glyph" style="--g:var(--map)">${esc(glyphTxt(tl[4]))}</span>`;
  body.innerHTML=`
  <div class="sheet-top">${imgTag(tl[6],"big zoomable",fb)}<div><h2 id="sheetTitle">${esc(tname(i))}</h2><p class="gname">${esc(treeFull(k))}${tname(i)!==tl[4]?" · "+esc(tl[4]):""}</p></div></div>
  ${tdesc(i)?`<p class="lede">${esc(tdesc(i))}</p>`:""}
  <div class="kv"><div><span>${t.level_req}</span><strong>${tl[9]||"—"}</strong></div><div><span>${t.rank_req}</span><strong style="font-size:.9rem">${tl[10]?RANK_L[prefs.lang][tl[10]]||tl[10]:"—"}</strong></div><div><span>${t.ranks}</span><strong>${tl[7]||1}</strong></div></div>
  ${tl[14]?`<p class="note ok">${t.default_unl}</p>`:""}
  ${teff(i)?`<div class="sec"><h3>${t.effects}</h3><p class="effects">${esc(teff(i)).split(" · ").join("<br>")}</p></div>`:""}
  ${tl[11]>=0?`<div class="sec"><button type="button" class="primary" data-x="${tl[11]}">${t.open_item}</button>${(MADE_BY[tl[11]]||[]).slice(0,1).map(r=>recipeRow(r,true)).join("")}</div>`:""}
  <div class="sec"><h3>${t.prereq}</h3><div class="chips">${reqs.length?reqs.map(tchip).join(""):`<span class="exs">${t.none}</span>`}</div></div>
  ${path.length>reqs.length?`<div class="sec"><h3>${t.path} · ${t.path_n(path.length)}</h3><ol class="pathlist">${path.map(j=>`<li><button type="button" class="linkbtn" data-tt="${j}">${esc(tname(j))}</button>${TALENTS[j][9]?` <span class="exs">${t.lvl} ${TALENTS[j][9]}</span>`:""}</li>`).join("")}<li><b>${esc(tname(i))}</b></li></ol></div>`:""}
  <div class="sec"><h3>${t.unlocks}</h3><div class="chips">${kids.length?kids.map(tchip).join(""):`<span class="exs">${t.none}</span>`}</div></div>`;
  body.querySelectorAll("[data-tt]").forEach(b=>b.onclick=()=>openSheet({type:"t",id:+b.dataset.tt}));
}

/* ---------- Guide ---------- */
const TAME_MAP={Moa:"Moa",Buffalo:"Buffalo",Horse:"Terrenus",Tusker:"Tusker",Forest_Wolf:"Wolf",Snow_Wolf:"Snow Wolf",Desert_Wolf:"Hyena",Blueback:"Blueback",Blueback_Lava:"Redback",Wild_Boar:"Boar",Dog:"Dog",Cat:"Cat",ArcticMoa:"Arctic Moa",Calf:"Cattle",Chick:"Chicken",Lamb:"Sheep",WoolyZebra:"Shaggy Zebra",SwampBird:"Ubis",Raptor_Desert:"Dune Raptor",Raptor_Geothermal:"Raptor",Chew:"Draven",Slinker:"Slinker",Orka:"Skulk",Storca:"Storca",Tundra_Monkey:"Gribbler",WoollyMammoth:"Woolly Mammoth",Piglet:"Pig",Kiwi:"Kiwi"};
const STATE_L={fr:{Wet:"mouillé",Sleepy:"fatigué"},en:{Wet:"wet",Sleepy:"sleepy"}};
const GEN_FR={Vitality:["Vigueur","PV max"],Endurance:["Forme","endurance max"],Muscle:["Physique","dégâts de mêlée, capacité de charge"],Agility:["Réflexes","vitesse de déplacement"],Toughness:["Robustesse","résistance physique"],Hardiness:["Adaptation","résistance au froid et à la chaleur"],Utility:["Instinct","lait, œufs, laine, emplacements de cargaison"]};
const LIN_FR={Wild:"Sauvage",Brave:"Brave",Careful:"Prudent",Timid:"Timide",Bold:"Audacieux",Hardy:"Robuste",Stout:"Costaud",Ambitious:"Ambitieux",Resolute:"Résolu",Fierce:"Féroce",Savage:"Brutal",Alpha:"Alpha"};
const mins=s=>s?Math.round(s/60)+" min":"—";
function tempTxt(lo,hi){if(lo==null&&hi==null)return FR()?"aucune":"none";if(lo==null)return `≤ ${hi} °C`;if(hi==null)return `≥ ${lo} °C`;return `${lo} à ${hi} °C`;}
function bpLink(name){const i=TALENTS.findIndex(t=>t[4]===name&&TREES[t[1]][4]==="tech");return i>=0?`<button type="button" class="gl" data-go="${i}">${esc(tname(i))}</button>`:`<b>${esc(name)}</b>`;}
function talLink(name){const i=TALENTS.findIndex(t=>t[4]===name&&TREES[t[1]][4]!=="tech");return i>=0?`<button type="button" class="gl" data-go="${i}">${esc(name)}</button>`:`<b>${esc(name)}</b>`;}
const crLink=n=>byName[n]?`<button type="button" class="gl" data-goc="${esc(n)}">${esc(cname(n))}</button>`:esc(n);
function treeTalents(name){const k=TREES.findIndex(t=>t[1]===name&&t[4]==="talent");if(k<0)return "";
  return `<div class="tlist">${TREE_NODES[k].filter(named).sort((a,b)=>TALENTS[a][3]-TALENTS[b][3]).map(i=>`<button type="button" class="tli" data-go="${i}">${imgTag(TALENTS[i][6],"","")}<span><b>${esc(tname(i))}</b><small>${esc(tdesc(i)||teff(i))}</small></span></button>`).join("")}</div>`;}

function guideSections(){const fr=FR();
  const L=(f,e)=>fr?f:e;
  const tames=TAMES.filter(r=>TAME_MAP[r[0]]&&!/^Chick\d$/.test(r[0]));
  const totalW=LINEAGES.reduce((a,l)=>a+l[1],0);
  return [
  {id:"debut",t:L("Premiers pas","Getting started"),h:`
   <p>${L("Vous atterrissez avec presque rien. Les 30 premières minutes décident de la suite : outils, feu, abri, eau, oxygène.","You land with almost nothing. The first 30 minutes set up everything else: tools, fire, shelter, water, oxygen.")}</p>
   <ol class="steps big">
    <li>${L("Ramassez des <b>bâtons</b>, des <b>pierres</b> et des <b>fibres</b> au sol et dans les buissons.","Pick up <b>sticks</b>, <b>stones</b> and <b>fibre</b> from the ground and bushes.")}</li>
    <li>${L(`Fabriquez à la main ${bpLink("Stone Axe")} et ${bpLink("Stone Pickaxe")} (débloqués d'office), puis ${bpLink("Stone Knife")}.`,`Hand-craft the ${bpLink("Stone Axe")} and ${bpLink("Stone Pickaxe")} (unlocked by default), then the ${bpLink("Stone Knife")}.`)}</li>
    <li>${L(`Posez un ${bpLink("Campfire")} pour cuire la viande et vous réchauffer, et un ${bpLink("Bedroll")} : c'est votre point de réapparition.`,`Place a ${bpLink("Campfire")} to cook meat and stay warm, and a ${bpLink("Bedroll")}: it's your respawn point.`)}</li>
    <li>${L(`Construisez un petit abri en paille avec ${bpLink("Thatch Building Base Set")} avant la première tempête, puis passez au bois avec ${bpLink("Wood Building Base Set")}.`,`Build a small thatch shelter with the ${bpLink("Thatch Building Base Set")} before the first storm, then move to wood with the ${bpLink("Wood Building Base Set")}.`)}</li>
    <li>${L(`Pour chasser : ${bpLink("Wood Bow")} et ${bpLink("Stone Arrow")}. Les cerfs, lapins et moas donnent cuir, os et viande.`,`To hunt: ${bpLink("Wood Bow")} and ${bpLink("Stone Arrow")}. Deer, rabbits and moas give leather, bone and meat.`)}</li>
    <li>${L(`L'oxygène s'épuise : minez de l'<b>oxite</b> (roches blanches) et fabriquez un ${bpLink("Oxidizer")}. Pour l'eau, buvez aux lacs ou posez des ${bpLink("Basic Water Purifiers")}.`,`Oxygen runs out: mine <b>oxite</b> (white rocks) and build an ${bpLink("Oxidizer")}. For water, drink from lakes or place ${bpLink("Basic Water Purifiers")}.`)}</li>
    <li>${L(`Gardez quelques ${bpLink("Basic Bandage")} sur vous, et un ${bpLink("Drying Rack")} pour que la viande ne pourrisse pas.`,`Keep a few ${bpLink("Basic Bandage")}s on you, and a ${bpLink("Drying Rack")} so meat doesn't spoil.`)}</li>
   </ol>`},
  {id:"priorites",t:L("Quoi débloquer en premier","What to unlock first"),h:`
   <p>${L("Chaque niveau rapporte des points de talent et de tech. Voici un ordre qui marche bien. Touchez un nom pour voir sa case dans l'arbre et sa recette.","Each level gives talent and tech points. Here is an order that works well. Tap a name to see its node and recipe.")}</p>
   <h4>${L("Palier 1 (niveaux 1 à 10)","Tier 1 (levels 1 to 10)")}</h4>
   <p class="pills">${["Wood Bow","Stone Arrow","Campfire","Bedroll","Thatch Building Base Set","Drying Rack","Small Wood Crate","Oxidizer","Basic Bandage","Bone Armor","Wood Building Base Set","Bone Knife","Bone Arrow","Medium Wood Crate"].map(bpLink).join("")}</p>
   <h4>${L("Palier 2 (niveaux 10 à 25)","Tier 2 (levels 10 to 25)")}</h4>
   <p>${L(`Le ${bpLink("Crafting Bench")} ouvre presque tout le palier 2. Visez ensuite le métal : ${bpLink("Stone Furnace")} pour fondre le fer, ${bpLink("Anvil Bench")} pour les outils en fer.`,`The ${bpLink("Crafting Bench")} opens almost all of tier 2. Then go for metal: ${bpLink("Stone Furnace")} to smelt iron, ${bpLink("Anvil Bench")} for iron tools.`)}</p>
   <p class="pills">${["Crafting Bench","Stone Furnace","Anvil Bench","Iron Pickaxe","Iron Axe","Mortar and Pestle","Skinning Bench","Textiles Bench","Leather Armor","Cooking Station","Waterskin","Longbow","Herbalism Bench","Carpentry Bench","Masonry Bench","Leather Backpack"].map(bpLink).join("")}</p>
   <h4>${L("Ensuite","After that")}</h4>
   <p>${L("Au palier 3, l'établi d'usinage, le four en béton et le premier générateur ouvrent les machines électriques et les armes à feu. Les paliers 4 et 5 demandent de l'électricité, des matériaux raffinés et, sur Elysium, de l'uranium. Ouvrez l'onglet <b>Arbres › Techs</b> pour voir chaque palier en entier.","In tier 3, the machining bench, concrete furnace and first generator open electric machines and firearms. Tiers 4 and 5 need power, refined materials and, on Elysium, uranium. Open <b>Trees › Tech</b> to see each tier in full.")}</p>
   <h4>${L("Talents utiles au début","Useful early talents")}</h4>
   <p>${L(`Dans <b>Survie › Ressources</b> : ${talLink("Rock Star")} (plus de pierre), ${talLink("All The Good Stuff")} (ressources secondaires des buissons), ${talLink("Waste Not")}. En solo, l'arbre <b>Solo</b> est très rentable : ${talLink("Lone Wolf")}, ${talLink("Pack Horse")}, ${talLink("Mobile Stockpile")}.`,`In <b>Survival › Resources</b>: ${talLink("Rock Star")} (more stone), ${talLink("All The Good Stuff")} (secondary resources from bushes), ${talLink("Waste Not")}. Solo players get a lot from the <b>Solo</b> tree: ${talLink("Lone Wolf")}, ${talLink("Pack Horse")}, ${talLink("Mobile Stockpile")}.`)}</p>`},
  {id:"elevage",t:L("Apprivoiser et élever","Taming and ranching"),h:`
   <ol class="steps big">
    <li>${L(`Débloquez le ${bpLink("Ranching Station")}, un ${bpLink("Animal Bed")}, des auges (${bpLink("Food Trough")}, ${bpLink("Water Trough")}) et ${bpLink("Animal Baits")}.`,`Unlock the ${bpLink("Ranching Station")}, an ${bpLink("Animal Bed")}, troughs (${bpLink("Food Trough")}, ${bpLink("Water Trough")}) and ${bpLink("Animal Baits")}.`)}</li>
    <li>${L("Trouvez un jeune animal (il suit souvent ses parents) et lancez l'apprivoisement. La barre ne progresse que si ses conditions sont remplies : température, nourriture, et ni mouillé ni fatigué.","Find a juvenile (it often follows its parents) and start taming. The bar only fills while its needs are met: temperature, food, and neither wet nor sleepy.")}</li>
    <li>${L("Un lit pour animaux, fabriqué au poste d'élevage, est nécessaire pour qu'un jeune devienne adulte.","An animal bed, crafted at the ranching station, is needed for a juvenile to grow into an adult.")}</li>
    <li>${L(`Les montures ont besoin d'une selle (${bpLink("Basic Riding Saddle")}, ${bpLink("Arctic Riding Saddle")}, ${bpLink("Desert Riding Saddle")}…). Chaque monture a son propre arbre de talents (onglet <b>Arbres › Créatures</b>).`,`Mounts need a saddle (${bpLink("Basic Riding Saddle")}, ${bpLink("Arctic Riding Saddle")}, ${bpLink("Desert Riding Saddle")}…). Each mount has its own talent tree (<b>Trees › Creatures</b>).`)}</li>
   </ol>
   <h4>${L("Conditions par animal (fichier D_Tames du jeu)","Requirements per animal (game file D_Tames)")}</h4>
   <div class="tablewrap"><table class="loot gtable"><thead><tr><th>${L("Animal","Animal")}</th><th class="num">${L("Apprivoisement","Taming")}</th><th>${L("Température","Temperature")}</th><th class="num">${L("Nourriture","Food")}</th><th class="num">${L("Gestation","Gestation")}</th><th class="num">${L("Petit","Young")}</th><th>${L("Interdit","Not while")}</th></tr></thead><tbody>
   ${tames.map(r=>`<tr><td>${crLink(TAME_MAP[r[0]])}</td><td class="num">${mins(r[1])}</td><td>${tempTxt(r[2],r[3])}</td><td class="num">${r[4]?r[4]+" %":"—"}</td><td class="num">${mins(r[5])}</td><td class="num">${r[6]?r[6]+" %":"—"}</td><td>${r[7]?r[7].split(",").map(x=>STATE_L[prefs.lang][x]||x).join(", "):"—"}</td></tr>`).join("")}
   </tbody></table></div>
   <p class="note">${L("« Petit » : chance qu'un jeune apparaisse avec un parent sauvage. « Nourriture » : niveau de nourriture minimum pendant l'apprivoisement. Gestation « — » : l'animal ne se reproduit pas, il s'apprivoise seulement.","“Young”: chance a juvenile spawns with a wild parent. “Food”: minimum food level while taming. Gestation “—”: the animal can't breed, only be tamed.")}</p>`},
  {id:"repro",t:L("Reproduction et génétique","Breeding and genetics"),h:`
   <p>${L("Un mâle et une femelle adultes apprivoisés de la même espèce peuvent se reproduire. La femelle porte le petit pendant la durée de gestation, puis il faut l'élever comme un jeune apprivoisé. Le petit hérite des statistiques génétiques de ses parents, avec une chance de mutation.","A tamed adult male and female of the same species can breed. The female carries the young for the gestation time, then it must be raised like a tamed juvenile. The young inherits its parents' genetic stats, with a chance to mutate.")}</p>
   <h4>${L("Les 7 statistiques génétiques","The 7 genetic stats")}</h4>
   <div class="tablewrap"><table class="loot gtable"><thead><tr><th>${L("Statistique","Stat")}</th><th>${L("Agit sur","Affects")}</th></tr></thead><tbody>
   ${GENETICS.map(g=>`<tr><td><b>${fr?(L_GEN[g[0]]||GEN_FR[g[0]]?.[0]||g[1]):g[1]}</b>${fr?` <span class="exs">${g[1]}</span>`:""}</td><td>${fr&&GEN_FR[g[0]]?GEN_FR[g[0]][1]:esc(g[2])}</td></tr>`).join("")}
   </tbody></table></div>
   <h4>${L("Les 12 lignées (tempéraments)","The 12 lineages")}</h4>
   <p class="note">${L("Chaque animal naît avec une lignée tirée au hasard. Elle donne un petit malus fixe et un bonus qui grandit avec le niveau de l'animal.","Each animal is born with a random lineage. It gives a small fixed penalty and a bonus that grows with the animal's level.")}</p>
   <div class="tablewrap"><table class="loot gtable"><thead><tr><th>${L("Lignée","Lineage")}</th><th class="num">${L("Rareté","Odds")}</th><th>${L("Malus / effet fixe","Fixed effect")}</th><th>${L("Grandit avec le niveau","Grows with level")}</th></tr></thead><tbody>
   ${LINEAGES.map(l=>`<tr><td><b>${fr?(L_LIN[l[0]]||LIN_FR[l[0]]||l[0]):l[0]}</b>${fr?` <span class="exs">${l[0]}</span>`:""}</td><td class="num">${(l[1]/totalW*100).toFixed(1)} %</td><td>${esc(l[2])}</td><td>${esc(l[3])||"—"}</td></tr>`).join("")}
   </tbody></table></div>
   <h4>${L("Talents d'élevage (arbre Aventure › Élevage)","Husbandry talents (Adventure › Husbandry)")}</h4>${treeTalents("Husbandry")}
   <h4>${L("Talents de génétique (arbre Aventure › Génétique)","Genetics talents (Adventure › Genetics)")}</h4>${treeTalents("Genetics")}`},
  {id:"survie",t:L("Astuces de survie","Survival tips"),h:`
   <ul class="steps big">
    <li>${L("<b>Température</b> : le froid et la chaleur vident votre santé. Portez une armure adaptée (fourrure au froid, cuir ou ghillie au chaud), restez près d'un feu, et ajoutez des modules à votre combinaison.","<b>Temperature</b>: cold and heat drain your health. Wear suitable armour (fur for cold, leather or ghillie for heat), stay near a fire, and add modules to your envirosuit.")}</li>
    <li>${L(`<b>Tempêtes</b> : elles abîment les bâtiments en paille et en bois. Passez à la pierre (${bpLink("Masonry Bench")}) puis au béton dès que possible, et ne restez pas dehors pendant un orage.`,`<b>Storms</b> damage thatch and wood buildings. Move to stone (${bpLink("Masonry Bench")}) then concrete as soon as you can, and don't stay outside during a storm.`)}</li>
    <li>${L(`<b>Maladies</b> : les pâtes du palier 1 soignent parasites, poison et infections (${bpLink("Anti-parasitic Paste")}, ${bpLink("Anti-poison Paste")}, ${bpLink("Antibiotic Paste")}).`,`<b>Ailments</b>: tier 1 pastes cure parasites, poison and infections (${bpLink("Anti-parasitic Paste")}, ${bpLink("Anti-poison Paste")}, ${bpLink("Antibiotic Paste")}).`)}</li>
    <li>${L("<b>Nourriture</b> : manger varié donne des bonus. La viande pourrit vite : séchoir, glacière (Ice Box) ou fumoir.","<b>Food</b>: a varied diet gives buffs. Meat spoils fast: drying rack, ice box or smoker.")}</li>
    <li>${L("<b>Grottes</b> : on y trouve des minerais et des exotiques, mais aussi des vers des cavernes et des chauves-souris. Prenez une torche et des bandages.","<b>Caves</b> hold ores and exotics, but also cave worms and bats. Bring a torch and bandages.")}</li>
    <li>${L("<b>Combat</b> : chaque créature a ses faiblesses (feu, givre, poison…). Consultez sa fiche dans le Bestiaire avant d'attaquer, et visez les points critiques (souvent la tête).","<b>Combat</b>: each creature has weaknesses (fire, frost, poison…). Check its page in the Bestiary before attacking, and aim for crit spots (usually the head).")}</li>
    <li>${L("<b>Exotiques</b> : la monnaie de l'atelier orbital. Ce que vous y achetez vous suit d'une mission à l'autre, contrairement à ce que vous fabriquez sur place.","<b>Exotics</b> are the orbital workshop currency. What you buy there follows you between missions, unlike what you craft on the ground.")}</li>
    <li>${L(`<b>Great Hunts</b> : ${crLink("Quarrite")} (Olympus), ${crLink("Garganutan")} (Styx) et ${crLink("Rimetusk")} (Prometheus) mènent à un boss d'arène et débloquent des objets du Bio-Lab.`,`<b>Great Hunts</b>: ${crLink("Quarrite")} (Olympus), ${crLink("Garganutan")} (Styx) and ${crLink("Rimetusk")} (Prometheus) lead to an arena boss and unlock Bio-Lab items.`)}</li>
   </ul>`}
  ];}
function renderGuide(){
  const fr=FR(),secs=guideSections();
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${fr?"Guide du prospecteur":"Prospector's guide"}</h1>
    <p>${fr?"Tout ce qu'il faut savoir pour bien démarrer, progresser dans les techs et élever des animaux. Les tableaux viennent des fichiers du jeu ; les noms soulignés ouvrent la fiche correspondante.":"Everything you need to get started, progress through tech and raise animals. Tables come from the game files; underlined names open the matching page."}</p></div>
    <nav class="stats gtoc"><h3>${fr?"Sommaire":"Contents"}</h3>${secs.map(s=>`<a href="#guide" data-sec="${s.id}">${s.t}</a>`).join("")}</nav>
  </section>
  ${secs.map(s=>`<section class="gsec" id="sec-${s.id}"><h2>${s.t}</h2>${s.h}</section>`).join("")}`;
  const v=document.getElementById("view");
  v.querySelectorAll("[data-sec]").forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById("sec-"+a.dataset.sec).scrollIntoView({behavior:"smooth"});});
  v.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>goTalent(+b.dataset.go));
  v.querySelectorAll("[data-goc]").forEach(b=>b.onclick=()=>openSheet({type:"c",id:b.dataset.goc},true));
}

/* ---------- Zoom des images ---------- */
const lb=document.createElement("div");lb.className="lightbox";lb.hidden=true;lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");
lb.innerHTML=`<button type="button" class="iconbtn lbclose" aria-label="Fermer">✕</button><img alt=""><p class="lbcap"></p>`;
document.body.appendChild(lb);
function openLightbox(src,cap){lb.querySelector("img").src=src;lb.querySelector(".lbcap").textContent=cap||"";lb.hidden=false;requestAnimationFrame(()=>lb.classList.add("on"));lb.querySelector(".lbclose").focus();}
function closeLightbox(){lb.classList.remove("on");setTimeout(()=>{lb.hidden=true;},180);}
lb.onclick=e=>{if(e.target===lb||e.target.closest(".lbclose")||e.target.tagName==="IMG")closeLightbox();};
addEventListener("keydown",e=>{if(e.key==="Escape"&&!lb.hidden){e.stopImmediatePropagation();closeLightbox();}},true);
document.getElementById("sheetBody").addEventListener("click",e=>{
  const img=e.target.closest(".sheet-top .pic img, .zoomable img");if(!img)return;
  e.preventDefault();openLightbox(img.src,document.getElementById("sheetTitle")?.textContent);});
