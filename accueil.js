// Page d'accueil + sections « débutant » du guide (équipement, techs, talents, gisements profonds) + styles des nouveautés de la carte
(()=>{const st=document.createElement("style");st.textContent=`
.brandlink{display:block;color:inherit;text-decoration:none}
.spawnbtn{margin-top:8px;font-size:.8rem}
.mk.mk-spawn{width:auto;height:auto;min-width:30px;padding:3px 6px;border-radius:999px;background:#e53935;color:#fff;font:600 .72rem var(--f-mono);box-shadow:0 0 0 2px #fff,0 2px 8px rgba(0,0,0,.5);z-index:3;animation:spawnpulse 1.8s ease-out infinite}
.mk.mk-spawn span{pointer-events:none}
@keyframes spawnpulse{0%{box-shadow:0 0 0 2px #fff,0 0 0 0 rgba(229,57,53,.6)}100%{box-shadow:0 0 0 2px #fff,0 0 0 14px rgba(229,57,53,0)}}
@media (prefers-reduced-motion:reduce){.mk.mk-spawn{animation:none}}
.mk.mk-cave{width:12px;height:12px;border-radius:3px;transform:translate(-50%,-50%) rotate(45deg);box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(0,0,0,.5)}
.mk.mk-cave img{transform:rotate(-45deg);width:11px;height:11px}
.mk.mk-DOVs.fromsave{box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(0,0,0,.55)}
.orefilter .mk:not(.mk-DOVs):not(.mk-cave):not(.mk-spawn),.spawnfocus .mk:not(.mk-spawn){opacity:.3}
.mapview.over{outline:3px dashed var(--map);outline-offset:-3px}
.prosbox{display:grid;gap:8px}
.prosbox h3{margin:0}
.prosbox .trackbar .more,.focusinfo .more{padding:4px 12px;font-size:.8rem;min-height:0}
.orechips .chip .pic{width:20px;height:20px;border-radius:4px}
.savebadge{display:flex;gap:10px;align-items:center;margin-top:8px;padding:8px 10px;border-radius:8px;background:var(--map-soft)}
.focusbar{display:grid;gap:8px}
.focusbar .svf{max-width:360px}
.focusinfo{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);font-size:.88rem}
.focusinfo>span:not(.pic){flex:1 1 220px}
.zonelist{display:grid;gap:2px;margin-top:4px}
.zonelist .linkbtn[aria-current="true"]{font-weight:700;color:var(--map)}
.home-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:12px}
.hcard{display:grid;gap:6px;align-content:start;padding:14px 16px;border:1px solid var(--line);border-left:4px solid var(--c,var(--map));border-radius:10px;background:var(--panel);color:inherit;text-decoration:none;transition:border-color .15s,transform .15s}
.hcard:hover{border-color:var(--c,var(--map));transform:translateY(-1px)}
.hcard b{font-family:var(--f-display);font-size:1.1rem}
.hcard small{color:var(--muted);font-size:.84rem;line-height:1.4}
.hcard .hn{font:500 .7rem var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--c,var(--map))}
.hcard.big{padding:18px}
.hcard.big b{font-size:1.25rem}
.home-sec{margin-top:28px}
.home-sec>h2{font-family:var(--f-display);font-size:1.3rem;margin:0}
.gtable td,.gtable th{vertical-align:top}
.gearcell{display:flex;flex-wrap:wrap;gap:4px}
.wsgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
.wsitem{display:flex;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--panel)}
.wsitem span{display:grid}.wsitem small{color:var(--muted)}
`;document.head.appendChild(st);})();

/* ---------- Guide : sections débutant ---------- */
function talCard(name,why){const i=TALENTS.findIndex(t=>t[4]===name&&TREES[t[1]][4]!=="tech");if(i<0)return "";
  return `<button type="button" class="tli" data-go="${i}">${imgTag(TALENTS[i][6],"","")}<span><b>${esc(tname(i))}</b><small>${esc(why||tdesc(i)||teff(i)||"")}</small></span></button>`;}
function wsItem(row){const w=WORKSHOP.find(x=>x[0]===row);if(!w)return "";const fr=FR();
  const cost=w[2].split(",").map(c=>{const [k,n]=c.split(":");return n+" "+(META_L[prefs.lang][k]||k);}).join(" + ");
  return `<button type="button" class="wsitem linkbtn" data-x="${w[1]}">${itemIcon(w[1])}<span><b>${esc(xname(w[1]))}</b><small>${esc(cost)}</small></span></button>`;}
const _guideSections=guideSections;
guideSections=function(){const secs=_guideSections(),fr=FR(),L=(f,e)=>fr?f:e;
  const P=list=>`<span class="gearcell">${list.map(bpLink).join(" ")}</span>`;
  const stuff={id:"stuff",t:L("Le meilleur équipement pour débuter","Best beginner gear"),h:`
   <p>${L("Ce qu'il vaut mieux porter à chaque étape. Ce sont des conseils : tout se débloque avec des points de tech, choisissez ce qui colle à votre biome.","What to use at each stage. These are recommendations: everything unlocks with tech points, pick what suits your biome.")}</p>
   <div class="tablewrap"><table class="loot gtable"><thead><tr><th>${L("Étape","Stage")}</th><th>${L("Armes","Weapons")}</th><th>${L("Outils","Tools")}</th><th>${L("Armure","Armour")}</th></tr></thead><tbody>
    <tr><td><b>${L("Niveaux 1 à 10","Levels 1 to 10")}</b><br><span class="exs">${L("Palier 1, à la main","Tier 1, by hand")}</span></td><td>${P(["Wood Bow","Stone Arrow","Bone Arrow","Bone Spear"])}</td><td>${P(["Stone Axe","Stone Pickaxe","Stone Knife","Bone Knife","Bone Sickle"])}</td><td>${P(["Cloth Armor","Bone Armor"])}</td></tr>
    <tr><td><b>${L("Niveaux 10 à 25","Levels 10 to 25")}</b><br><span class="exs">${L("Palier 2, établi + forge","Tier 2, bench + anvil")}</span></td><td>${P(["Longbow","Flint Arrow","Iron Spear","Crossbow","Iron Bolt"])}</td><td>${P(["Iron Pickaxe","Iron Axe","Iron Knife","Iron Sickle","Steel Pickaxe","Steel Axe"])}</td><td>${P(["Leather Armor","Fur Armor","Ghillie Armor","Leather Backpack"])}</td></tr>
    <tr><td><b>${L("Niveaux 25 à 40","Levels 25 to 40")}</b><br><span class="exs">${L("Palier 3, établi d'usinage","Tier 3, machining bench")}</span></td><td>${P(["Recurve Bow","Aluminium Arrow","Platinum Spear","Bolt Action Rifle","Shotgun"])}</td><td>${P(["Platinum Pickaxe","Platinum Axe","Platinum Knife","Canteen","Biofuel Deep-Mining Drill"])}</td><td>${P(["Cured Leather Armor","Hunter Armor","Arctic Armor","Cured Leather Backpack"])}</td></tr>
    <tr><td><b>${L("Niveau 40 et plus","Level 40 and up")}</b><br><span class="exs">${L("Palier 4, fabricateur","Tier 4, fabricator")}</span></td><td>${P(["Compound Bow","Composite Arrow","Titanium Spear","Hunting Rifle"])}</td><td>${P(["Titanium Pickaxe","Titanium Axe","Electric Deep-Mining Drill","Deep Mining Ore Scanner"])}</td><td>${P(["Composite Armor","Carbonweave Armor","Carbonweave Backpack"])}</td></tr>
   </tbody></table></div>
   <h4>${L("Quelle armure selon le biome","Which armour for which biome")}</h4>
   <ul class="steps big">
    <li>${L(`<b>Forêt</b> : ${bpLink("Leather Armor")}, la plus polyvalente au début, puis ${bpLink("Hunter Armor")}.`,`<b>Forest</b>: ${bpLink("Leather Armor")}, the most versatile early on, then ${bpLink("Hunter Armor")}.`)}</li>
    <li>${L(`<b>Arctique</b> : ${bpLink("Fur Armor")} contre le froid, puis ${bpLink("Arctic Armor")}. Gardez un feu ou un chauffage près de la base.`,`<b>Arctic</b>: ${bpLink("Fur Armor")} against the cold, then ${bpLink("Arctic Armor")}. Keep a fire or heater near your base.`)}</li>
    <li>${L(`<b>Désert</b> : ${bpLink("Ghillie Armor")} contre la chaleur, et beaucoup d'eau (${bpLink("Waterskin")}, puis ${bpLink("Canteen")}).`,`<b>Desert</b>: ${bpLink("Ghillie Armor")} against the heat, and plenty of water (${bpLink("Waterskin")}, then ${bpLink("Canteen")}).`)}</li>
   </ul>
   <h4>${L("Premiers achats à l'atelier orbital","First orbital workshop buys")}</h4>
   <p class="note">${L("Ces objets vous suivent d'une mission à l'autre. Les premiers Ren vont de préférence au sac à dos, à la gourde, à la bouteille d'oxygène et à une pioche Shengong.","These items follow you between missions. Spend your first Ren on the backpack, canteen, oxygen tank and a Shengong pickaxe.")}</p>
   <div class="wsgrid">${["Survival_Backpack","Meta_Canteen_Shengong","Meta_Oxygen_Tank_Shengong","Meta_Pickaxe_Shengong_Alpha","Meta_Axe_Shengong_Alpha","Meta_Bow_Shengong_Alpha","Meta_Module_Inventory_Slots","Meta_Module_Carry_Weight","Mining_Backpack"].map(wsItem).join("")}</div>`};
  const techs={id:"techs",t:L("Arbre technique : le plan complet","Tech tree: the full plan"),h:`
   <p>${L("Chaque niveau donne 3 ou 4 points de tech (4 aux niveaux impairs, 3 aux pairs). Les établis passent avant tout : ils ouvrent les recettes suivantes.","Each level gives 3 or 4 tech points (4 on odd levels, 3 on even ones). Benches come first: they open the next recipes.")}</p>
   <h4>${L("Palier 3 (niveaux 25 à 40)","Tier 3 (levels 25 to 40)")}</h4>
   <p class="pills">${["Machining Bench","Concrete Furnace","Glassworking Bench","Kitchen Bench","Repair Bench","Advanced Textiles Bench","Canteen","Recurve Bow","Biofuel Deep-Mining Drill","Cave Scanner","Medicine Bench","Alteration Bench"].map(bpLink).join("")}</p>
   <h4>${L("Palier 4 (niveau 40 et plus)","Tier 4 (level 40 and up)")}</h4>
   <p class="pills">${["Biofuel Generator","Electric Furnace","Chemistry Bench","Electric Masonry Bench","Electric Carpentry Bench","Electric Textiles Bench","Electric Deep-Mining Drill","Deep Mining Ore Scanner","Compound Bow","Composite Armor"].map(bpLink).join("")}</p>
   <h4>${L("À éviter au début","Avoid early on")}</h4>
   <ul class="steps big">
    <li>${L("Les décorations, statues et variantes de meubles : elles coûtent des points pour rien quand on débute.","Decorations, statues and furniture variants: they cost points for nothing when starting out.")}</li>
    <li>${L("Débloquer toutes les armes d'un même palier : choisissez un arc ou une lance et montez-le d'un palier à l'autre.","Unlocking every weapon in a tier: pick a bow or a spear and upgrade it tier by tier.")}</li>
    <li>${L("Sauter le métal : le fer et l'acier changent tout (outils plus rapides, établis du palier 3).","Skipping metal: iron and steel change everything (faster tools, tier 3 benches).")}</li>
   </ul>`};
  const tals={id:"talents",t:L("Talents conseillés pour débuter","Recommended beginner talents"),h:`
   <p>${L("Chaque niveau donne 1 ou 2 points de talent. Dans l'ordre, ceux qui aident le plus quand on débute :","Each level gives 1 or 2 talent points. In order, the ones that help most when starting out:")}</p>
   <h4>${L("1. Récolte (Survie › Ressources)","1. Gathering (Survival › Resources)")}</h4>
   <div class="tlist">${["Rock Star","All The Good Stuff","Friend Of The Trees","Iron Miner","Lucky Strike","Carry On"].map(n=>talCard(n)).join("")}</div>
   <h4>${L("2. Survie (Aventure › Exploration)","2. Survival (Adventure › Exploration)")}</h4>
   <div class="tlist">${["Robust Explorer","Steady Breathing","Carbo Loaded","Water Retention","Cushioned Fall","Weathering The Storm"].map(n=>talCard(n)).join("")}</div>
   <h4>${L("3. Combat à l'arc (Combat › Arcs)","3. Bow combat (Combat › Bows)")}</h4>
   <div class="tlist">${["Bullseye","Trained Bowman","Easy Draw","Increased Arrow Damage I"].map(n=>talCard(n)).join("")}</div>
   <h4>${L("4. Outils et construction","4. Tools and building")}</h4>
   <div class="tlist">${["Speedy Mining","Speed Chopper","Big Pick","Discount Wood","Wood Hauling"].map(n=>talCard(n)).join("")}</div>
   <h4>${L("En solo","Playing solo")}</h4>
   <div class="tlist">${["Lone Wolf","Pack Horse","Mobile Stockpile","Healthy Maverick"].map(n=>talCard(n)).join("")}</div>`};
  const deep={id:"profond",t:L("Gisements profonds : mode d'emploi","Deep ore veins: how to"),h:`
   <p>${L("Les filons de minerai profonds sont des gisements fixes sur la carte, en surface ou dans les grottes. Une foreuse posée dessus extrait leur minerai à l'infini, sans miner à la pioche.","Deep ore veins are fixed deposits on the map, on the surface or in caves. A drill placed on one extracts its ore forever, with no pickaxe work.")}</p>
   <ol class="steps big">
    <li>${L(`Débloquez la ${bpLink("Biofuel Deep-Mining Drill")} (palier 3) : elle tourne au biocarburant.`,`Unlock the ${bpLink("Biofuel Deep-Mining Drill")} (tier 3): it runs on biofuel.`)}</li>
    <li>${L(`Pour savoir quel minerai contient un filon, il faut un scanner (${bpLink("Deep Mining Ore Scanner")} au palier 4, ou celui de l'atelier orbital)… ou bien <b>chargez votre fichier de prospection dans l'onglet Cartes</b> : le site lit le minerai de chaque filon directement dans votre sauvegarde.`,`To know which ore a vein holds you need a scanner (${bpLink("Deep Mining Ore Scanner")} in tier 4, or the workshop one)… or <b>load your prospect file in the Maps tab</b>: the site reads every vein's ore straight from your save.`)}</li>
    <li>${L(`Plus tard, passez à la ${bpLink("Electric Deep-Mining Drill")} (palier 4) puis à la ${bpLink("Oil Deep-Mining Drill")} (palier 5).`,`Later, move to the ${bpLink("Electric Deep-Mining Drill")} (tier 4) then the ${bpLink("Oil Deep-Mining Drill")} (tier 5).`)}</li>
   </ol>
   <p><a class="primary" href="#cartes" style="display:inline-block;text-decoration:none">${L("Ouvrir la carte des gisements","Open the deposit map")}</a></p>`};
  const at=secs.findIndex(s=>s.id==="priorites");secs.splice(at<0?1:at+1,0,stuff,techs,tals,deep);return secs;};

// Les objets de l'atelier dans le guide ouvrent leur fiche
document.addEventListener("click",e=>{const b=e.target.closest("#view .wsitem[data-x]");if(b)openSheet({type:"x",id:+b.dataset.x},true);});

/* ---------- Page d'accueil ---------- */
const HOME_TIPS={fr:["Chaque créature a des faiblesses : regardez sa fiche avant de l'attaquer.","Le calque « Apparitions » de l'onglet Cartes montre où vivent les animaux.","Un filon profond produit à l'infini : posez-y une foreuse dès le palier 3.","Les grottes cachent des exotiques, mais aussi des vers : prenez une torche.","La viande pourrit vite : séchoir, glacière ou fumoir.","Ce que vous achetez à l'atelier orbital vous suit de mission en mission.","Passez à la pierre avant les grosses tempêtes : la paille ne tient pas."],
  en:["Each creature has weaknesses: check its page before attacking.","The “Spawns” layer in Maps shows where animals live.","A deep ore vein produces forever: drop a drill on it from tier 3.","Caves hide exotics, but also worms: bring a torch.","Meat spoils fast: drying rack, ice box or smoker.","What you buy in the orbital workshop follows you between missions.","Move to stone before big storms: thatch won't hold."]};
function renderHome(){const fr=FR(),t=T(),L=(f,e)=>fr?f:e;
  const tips=HOME_TIPS[prefs.lang]||HOME_TIPS.fr,tip=tips[new Date().getDate()%tips.length];
  const card=(href,c,n,title,sub,big)=>`<a class="hcard${big?" big":""}" href="${href}" style="--c:${c}">${n?`<span class="hn">${n}</span>`:""}<b>${title}</b><small>${sub}</small></a>`;
  const pros=typeof PROS!=="undefined"&&PROS;
  const top=pros?Object.entries(PROS.deps.reduce((a,d)=>(a[d[2]]=(a[d[2]]||0)+1,a),{})).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([o,n])=>`${esc(oreLabel(o))} ${n}`).join(" · "):"";
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${t.brand}</h1>
    <p>${L("Le compagnon de terrain pour Icarus : toutes les créatures et leur butin, les cartes avec les gisements profonds de votre propre partie, les recettes, les arbres de talents et un guide pour bien débuter.","The field companion for Icarus: every creature and its loot, maps with the deep ore veins of your own game, recipes, talent trees and a guide to get started.")}</p></div>
    <div class="stats"><h3>${L("Astuce","Tip")}</h3><div class="hunt">${esc(tip)}</div>
      <h3>${L("Ma prospection","My prospect")}</h3><div class="hunt">${pros?`<b>${esc(PROS.name)}</b> · ${esc(mapName(PROS.map))}<br>${PROS.deps.length} ${L("filons profonds","deep ore veins")} — ${top}<br><a href="#cartes">${L("Voir sur la carte","Show on the map")}</a>`:`${L("Chargez votre fichier de prospection dans <a href=\"#cartes\">Cartes</a> pour voir le minerai de chaque filon profond.","Load your prospect file in <a href=\"#cartes\">Maps</a> to see every deep vein's ore.")}`}</div></div>
  </section>
  <section class="home-sec"><h2>${L("Par où commencer ?","Where to start?")}</h2><div class="home-grid">
    ${card("#guide",accentOf("guide")[0],L("Débutant","Beginner"),L("Guide du prospecteur","Prospector's guide"),L("Premiers pas, meilleur équipement par étape, ordre des techs et talents conseillés.","First steps, best gear per stage, tech order and recommended talents."),true)}
    ${card("#cartes",accentOf("cartes")[0],L("Cartes","Maps"),L("Gisements et apparitions","Deposits and spawns"),L("Grottes, filons profonds de votre partie, exotiques, et les zones où vit chaque créature.","Caves, your game's deep veins, exotics, and the zones where each creature lives."),true)}
    ${card("#save",accentOf("save")[0],"Save Manager",L("Votre sauvegarde","Your save"),L("Personnage, ressources, talents et inventaires, modifiables directement.","Character, resources, talents and inventories, editable directly."),true)}
    ${card("#conseil",accentOf("conseil")[0],L("Conseiller IA","AI advisor"),L("Conseils perso","Personal advice"),L("Une IA lit ta sauvegarde et te dit quoi améliorer, quels talents prendre et quoi débloquer.","An AI reads your save and tells you what to improve, which talents to take and what to unlock."),true)}
  </div></section>
  <section class="home-sec"><h2>${t.regions}</h2><div class="home-grid">
    ${[...REGIONS,"ferme"].map(k=>card("#"+k,accentOf(k)[0],MAPS[k].tag,mapName(k),`${C.filter(c=>c[9][k]!==undefined).length} ${L("créatures","creatures")} · ${esc(MAPS[k].size)}`)).join("")}
  </div></section>
  <section class="home-sec"><h2>${t.index}</h2><div class="home-grid">
    ${card("#objets",accentOf("objets")[0],ITEMS.length,t.objects,L("Tout le catalogue d'objets du jeu.","The game's full item catalogue."))}
    ${card("#crafts",accentOf("crafts")[0],REC.length,t.crafts,L("Recettes et établis.","Recipes and benches."))}
    ${card("#arbres",accentOf("arbres")[0],TREES.length,t.trees,L("Talents, techs, atelier orbital.","Talents, tech, orbital workshop."))}
    ${card("#nourriture",accentOf("nourriture")[0],typeof FOODS!=="undefined"?FOODS.length:"",t.food,L("Plats et leurs bonus.","Dishes and their buffs."))}
    ${card("#montures",accentOf("montures")[0],MOUNTS.length,t.mounts,L("Montures et compagnons.","Mounts and companions."))}
    ${card("#poissons",accentOf("poissons")[0],FISH.length,t.fish,L("Où pêcher quoi.","What to fish where."))}
  </div></section>`;}
VIEWS.accueil=()=>renderHome();
