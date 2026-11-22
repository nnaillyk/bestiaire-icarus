// Onglet Nourriture : classement des aliments, boissons et remèdes par effet (données foods.js)
Object.assign(UI.fr,{food:"Nourriture",food_title:"Nourriture et effets",
 food_p:"Tous les aliments, boissons et remèdes du jeu avec ce qu'ils rendent tout de suite et les bonus qu'ils donnent pendant leur durée. Choisissez un effet pour classer les aliments du plus fort au plus faible. Les données viennent des tables D_Consumable, D_ModifierStates et D_Stats du jeu.",
 food_tip:"Vous avez 3 places d'estomac au départ (plus avec certains talents). Chaque plat cuisiné en prend une pendant sa durée : combinez des plats aux bonus différents. Manger le même plat remplace son effet et relance sa durée.",
 f_search:"Chercher un aliment ou un effet…",f_sort:"Classer par",f_name:"Nom",f_food:"Nourriture rendue",f_water:"Eau rendue",f_health:"Santé rendue",f_stam:"Endurance rendue",f_oxy:"Oxygène rendu",f_dur:"Durée du bonus",f_slots:"Places d'estomac",
 f_effect:"Effet",f_any:"Tous les effets",f_instant:"Effet immédiat",f_buff:"Bonus pendant",f_slot_n:n=>`${n} place${n>1?"s":""} d'estomac`,f_noeff:"Aucun bonus",f_sec:"Effets à la consommation",f_cure:"Soigne une affliction (voir la description)",
 fc:{all:"Tout",meat:"Viande",fish:"Poisson",fruit:"Fruits",vege:"Légumes",grain:"Céréales",egg:"Œufs",honey:"Miel",fungi:"Champignons",soup:"Soupes",dessert:"Gâteaux",dish:"Autres plats",raw:"Cru",dried:"Séché",drink:"Boissons",med:"Remèdes",animal:"Pour animaux",orb:"Orbital",spoil:"Avarié"}});
Object.assign(UI.en,{food:"Food",food_title:"Food and effects",
 food_p:"Every food, drink and remedy in the game, with what it restores immediately and the bonuses it grants for its duration. Pick an effect to rank foods from strongest to weakest. Data comes from the game's D_Consumable, D_ModifierStates and D_Stats tables.",
 food_tip:"You start with 3 stomach slots (more with some talents). Each cooked dish takes one for its duration: combine dishes with different bonuses. Eating the same dish replaces its effect and restarts its timer.",
 f_search:"Search a food or effect…",f_sort:"Sort by",f_name:"Name",f_food:"Food restored",f_water:"Water restored",f_health:"Health restored",f_stam:"Stamina restored",f_oxy:"Oxygen restored",f_dur:"Buff duration",f_slots:"Stomach slots",
 f_effect:"Effect",f_any:"All effects",f_instant:"Immediate effect",f_buff:"Bonus for",f_slot_n:n=>`${n} stomach slot${n>1?"s":""}`,f_noeff:"No bonus",f_sec:"Effects when consumed",f_cure:"Cures an affliction (see description)",
 fc:{all:"All",meat:"Meat",fish:"Fish",fruit:"Fruit",vege:"Vegetables",grain:"Grains",egg:"Eggs",honey:"Honey",fungi:"Mushrooms",soup:"Soups",dessert:"Cakes",dish:"Other dishes",raw:"Raw",dried:"Dried",drink:"Drinks",med:"Remedies",animal:"For animals",orb:"Orbital",spoil:"Spoiled"}});

// Textes manquants dans le jeu
const FSTAT_FIX={BaseHealthRegenPerMinute_:["+{0} Régénération de la santé par minute","-{0} Régénération de la santé par minute"],"BaseShieldBlock_+%":["+{0}% Blocage au bouclier","-{0}% Blocage au bouclier"],
 "BaseFallDamageResistance_%":["+{0}% Résistance aux dégâts de chute","-{0}% Résistance aux dégâts de chute"],"BaseCaughtFreshwaterFishQuality_+%":["+{0}% Qualité des poissons d'eau douce pêchés","-{0}% Qualité des poissons d'eau douce pêchés"]};
FSTATS.forEach(s=>{const fx=FSTAT_FIX[s[0]]||FSTAT_FIX[s[0].replace(/\+$/,"")];if(fx){if(!s[1]||/[A-Z][a-z]+ [A-Z]/.test(s[1]))s[1]=fx[0];if(!s[2])s[2]=fx[1];}if(!s[3])s[3]=s[0].replace(/^Base|_.*$/g,"").replace(/([a-z])([A-Z])/g,"$1 $2")+" +{0}";});
// Effets « positifs » qui sont en réalité des malus (et inversement)
const FSTAT_BAD=/Consumption|ActionCost|(Bacterial|Parasitic|Poison|PhysicalTrauma)ModifierDuration|Overencumbered|PyriticCrust|InfectedBark|AnimalThreat|RegenDelay/;
const fGood=(k,v)=>/InternalTemperature/.test(k)?null:(FSTAT_BAD.test(k)?v<0:v>0);
const fNum=v=>{const a=Math.abs(v);return Number.isInteger(a)?String(a):a.toFixed(2).replace(/\.?0+$/,"").replace(".",FR()?",":".");};
function fStatTxt(si,v){const s=FSTATS[si];const neg=v<0;let tp=FR()?(neg?s[2]:s[1]):(neg?s[4]:s[3]);if(!tp)tp=FR()?(s[1]||s[3]):(s[3]||s[1]);
  if(!tp.includes("{0}"))return tp;let r=tp.replace("{0}",fNum(v));if(neg&&!/^[-−]/.test(r)&&!(FR()?s[2]:s[4]))r=r.replace(/^\+/,"-");return r;}
const fLabel=si=>fStatTxt(si,1).replace(/^[+\-]?\s*1\s*(%|C|kg)?\s*(de |d')?/i,"").replace(/^sur (la |le )?/i,"").replace(/^./,c=>c.toUpperCase());
const fDur=s=>s>=3600?`${Math.floor(s/3600)} h${s%3600?" "+Math.round(s%3600/60)+" min":""}`:s>=60?`${Math.round(s/60)} min`:`${s} s`;
const FOOD_BY_ITEM={};FOODS.forEach(f=>{FOOD_BY_ITEM[f[0]]=f;});
const FOOD_CATS=["all","meat","fish","fruit","vege","grain","egg","honey","fungi","soup","dessert","dish","raw","dried","drink","med","animal","orb","spoil"];
Object.assign(state,{fdq:"",fdc:"all",fds:"name",fde:"any"});
const fName=f=>FR()&&L_ITEMS[f[0]]&&L_ITEMS[f[0]][0]?L_ITEMS[f[0]][0]:xname(f[0]);
const fBuffName=f=>FR()?(f[10]||f[11]):(f[11]||f[10]);
const fBuffDesc=f=>FR()?(f[12]||f[13]):(f[13]||f[12]);
const FDIRECT=[[3,"f_food","🍖"],[4,"f_water","💧"],[5,"f_health","❤"],[6,"f_stam","⚡"],[7,"f_oxy","🫧"]];

function foodDirect(f){return FDIRECT.filter(([k])=>f[k]).map(([k,l,ic])=>`<span title="${T()[l]}">${ic} ${f[k]>0?"+":""}${fNum(f[k])}</span>`).join("");}
function foodEffects(f,hl){if(!f[9].length)return "";
  return `<ul class="fx">${f[9].map(([si,v])=>{const g=fGood(FSTATS[si][0],v);return `<li class="${g===null?"":g?"good":"bad"}${hl===si?" hl":""}">${esc(fStatTxt(si,v))}</li>`;}).join("")}</ul>`;}

function renderFood(){
  const t=T();
  const used=[...new Set(FOODS.flatMap(f=>f[9].map(e=>e[0])))].sort((a,b)=>fLabel(a).localeCompare(fLabel(b),prefs.lang));
  const cats=FOOD_CATS.filter(c=>c==="all"||FOODS.some(f=>f[1].split(",").includes(c)));
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${t.food_title}</h1>
    <div class="facts"><span><b>${FOODS.length} ${t.food.toLowerCase()}</b></span><span>${used.length} ${FR()?"effets différents":"different effects"}</span></div>
    <p>${t.food_p}</p></div>
    <div class="stats"><h3>${t.tip}</h3><div class="hunt">${t.food_tip}</div></div></section>
  <div class="toolbar"><label class="search">${SEARCH_ICON}<input id="fdq" type="search" placeholder="${t.f_search}" value="${esc(state.fdq)}" aria-label="${t.f_search}"></label>
    <label class="fsel"><span>${t.f_effect}</span><select id="fde"><option value="any">${t.f_any}</option>${used.map(si=>`<option value="${si}" ${String(si)===state.fde?"selected":""}>${esc(fLabel(si))}</option>`).join("")}</select></label>
    <label class="fsel"><span>${t.f_sort}</span><select id="fds">${[["name",t.f_name],["food",t.f_food],["water",t.f_water],["health",t.f_health],["stam",t.f_stam],["dur",t.f_dur],["slots",t.f_slots]].map(([v,l])=>`<option value="${v}" ${state.fds===v?"selected":""}>${l}</option>`).join("")}</select></label></div>
  <div class="toolbar">${seg("fdc",cats.map(c=>[c,t.fc[c]]),"wrap")}</div>
  <div class="result" id="result"></div><div class="grid" id="fdOut"></div>`;
  const v=document.getElementById("view");
  v.querySelector("#fdq").oninput=e=>{state.fdq=e.target.value;drawFoodList();};
  v.querySelector("#fde").onchange=e=>{state.fde=e.target.value;drawFoodList();};
  v.querySelector("#fds").onchange=e=>{state.fds=e.target.value;drawFoodList();};
  wireSegs(v,drawFoodList);drawFoodList();
}
function drawFoodList(){
  const t=T(),q=state.fdq.trim().toLowerCase(),fe=state.fde==="any"?null:+state.fde;
  const SK={food:3,water:4,health:5,stam:6,dur:2,slots:8};
  let list=FOODS.filter(f=>state.fdc==="all"||f[1].split(",").includes(state.fdc));
  if(fe!==null)list=list.filter(f=>f[9].some(e=>e[0]===fe));
  if(q)list=list.filter(f=>[fName(f),ITEMS[f[0]][1],fBuffName(f),fBuffDesc(f),...f[9].map(([si,v])=>fStatTxt(si,v))].join(" ").toLowerCase().includes(q));
  const byName=(a,b)=>fName(a).localeCompare(fName(b),prefs.lang);
  const effVal=f=>{const e=f[9].find(x=>x[0]===fe);if(!e)return -Infinity;return fGood(FSTATS[fe][0],e[1])===false?-Math.abs(e[1]):Math.abs(e[1]);};
  list.sort((a,b)=>{if(fe!==null){const d=effVal(b)-effVal(a);if(d)return d;}
    if(state.fds!=="name"){const k=SK[state.fds];const d=b[k]-a[k];if(d)return d;}return byName(a,b);});
  document.getElementById("result").textContent=`${list.length}`;
  const out=document.getElementById("fdOut");
  out.innerHTML=list.map(f=>`<button class="cc P food" type="button" data-x="${f[0]}"><div class="hd">${itemIcon(f[0],true)}<div class="ttl"><h3>${esc(fName(f))}</h3><div class="sub">${f[1].split(",").map(c=>t.fc[c]).join(" · ")}</div></div></div>
      <div class="mini">${foodDirect(f)}${f[2]?`<span>⏱ ${fDur(f[2])}</span>`:""}${f[8]?`<span>🍽 ${f[8]}</span>`:""}</div>
      ${foodEffects(f,fe)||(f[1].includes("med")&&!f[2]?`<p class="fdesc">${t.f_cure}</p>`:"")}</button>`).join("");
  out.querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>openSheet({type:"x",id:+b.dataset.x},true));
}
// Section « effets » sur la fiche d'un objet
const _foodItemExtra=typeof itemExtra==="function"?itemExtra:()=>"";
itemExtra=function(i){const base=_foodItemExtra(i),f=FOOD_BY_ITEM[i];if(!f)return base;const t=T();
  const dir=FDIRECT.filter(([k])=>f[k]).map(([k,l,ic])=>`<span class="chip"><span>${ic} ${t[l]} ${f[k]>0?"+":""}${fNum(f[k])}</span></span>`).join("");
  return base+`<section class="sec"><h3>${t.f_sec}</h3>
    ${dir?`<p><b>${t.f_instant}</b></p><div class="chips">${dir}</div>`:""}
    ${f[2]?`<p><b>${esc(fBuffName(f)||t.f_buff)}</b> · ${t.f_buff.toLowerCase()} ${fDur(f[2])}${f[8]?" · "+t.f_slot_n(f[8]):""}</p>${fBuffDesc(f)?`<p class="fdesc">${esc(fBuffDesc(f))}</p>`:""}${foodEffects(f)}`:""}
    <p><a class="gl" href="#nourriture">${FR()?"Classer toute la nourriture par effet →":"Rank all food by effect →"}</a></p></section>`;};
VIEWS.nourriture=()=>renderFood();
