// Save Manager : modifier son personnage, ses ressources, ses talents/techs et son inventaire orbital
// Fichiers : %LOCALAPPDATA%\Icarus\Saved\PlayerData\<SteamID>\ Characters.json, Profile.json, MetaInventory.json
const SV={files:{},dir:null,ci:0,tab:"char",tg:"talent",tree:-1,q:"",iq:"",dirty:new Set(),backedUp:false};
const SV_FILES={characters:"Characters.json",profile:"Profile.json",meta:"MetaInventory.json"};
const L2=(f,e)=>FR()?f:e;
// Table d'XP (wiki « Experience Points ») : XP cumulée par niveau
const XP0=[0,2400,8610,18730,32530,48630,67830,89430,111030,135030,161500,194400,227300,260200,293100,326000,380800,435600,490400,545200,600000];
function xpStep(l){return l<25?75000:l<30?85000:l<35?108400:l<40?121600:l<45?130000:l<50?138000:144000;}
function xpForLevel(L){if(L<=20)return XP0[Math.max(0,L)];let x=XP0[20];for(let l=20;l<L;l++)x+=xpStep(l);return x;}
function levelForXp(xp){let L=0;while(L<1000&&xpForLevel(L+1)<=xp)L++;return L;}
const talentPts=L=>{let s=0;for(let l=1;l<=Math.min(L,60);l++)s+=l%2?1:2;return s;};
const bpPts=L=>{let s=0;for(let l=1;l<=L;l++)s+=l%2?4:3;return s;};
const META_L={fr:{Credits:"Ren",Exotic1:"Exotiques",Exotic_Red:"Exotiques rouges",Exotic_Uranium:"Barres d'uranium",Biomass:"Biomasse légendaire",Licence:"Licence légendaire",Refund:"Points de respécialisation",Biomass_Converter:"Flux"},
 en:{Credits:"Ren",Exotic1:"Exotics",Exotic_Red:"Red exotics",Exotic_Uranium:"Uranium rods",Biomass:"Legendary biomass",Licence:"Legendary licence",Refund:"Respec points",Biomass_Converter:"Flux"}};
const svChar=()=>SV.files.characters?SV.chars[SV.ci]:null;
const svTarget=g=>g==="talent"||g==="tech"?(svChar()?svChar().Talents:null):(SV.files.profile?SV.files.profile.obj.Talents:null);
const svMark=k=>{SV.dirty.add(k);drawSaveBar();};

/* ---------- Chargement ---------- */
async function svOpenDir(){
  try{let dir=await window.showDirectoryPicker({mode:"readwrite",id:"icarus-save"});
    // Si l'utilisateur choisit Saved ou PlayerData, on descend dans le dossier du SteamID
    for(let depth=0;depth<3;depth++){let hasChar=false;try{await dir.getFileHandle("Characters.json");hasChar=true;}catch(e){}
      if(hasChar)break;let sub=null;
      for await(const [n,h] of dir.entries()){if(h.kind==="directory"&&(/^\d{10,}$/.test(n)||n==="PlayerData")){sub=h;if(/^\d/.test(n))break;}}
      if(!sub)break;dir=sub;}
    SV.dir=dir;SV.files={};
    for(const [k,f] of Object.entries(SV_FILES)){try{const h=await dir.getFileHandle(f);const text=await (await h.getFile()).text();SV.files[k]={name:f,text,obj:JSON.parse(text),handle:h};}catch(e){}}
    svAfterLoad();
  }catch(e){if(e.name!=="AbortError")alertBox(L2("Impossible d'ouvrir ce dossier : ","Could not open this folder: ")+e.message);}
}
async function svOpenFiles(list){SV.dir=null;SV.files={};
  for(const file of list){const k=Object.keys(SV_FILES).find(k=>SV_FILES[k].toLowerCase()===file.name.toLowerCase());if(!k)continue;
    const text=await file.text();try{SV.files[k]={name:file.name,text,obj:JSON.parse(text)};}catch(e){alertBox(file.name+" : "+L2("fichier JSON invalide","invalid JSON file"));}}
  svAfterLoad();}
function svAfterLoad(){
  if(SV.files.characters){const arr=SV.files.characters.obj["Characters.json"]||[];SV.chars=arr.map(s=>typeof s==="string"?JSON.parse(s):s);SV.ci=0;}
  SV.dirty=new Set();SV.backedUp=false;
  if(!Object.keys(SV.files).length)alertBox(L2("Aucun fichier reconnu. Choisissez Characters.json, Profile.json et MetaInventory.json.","No file recognised. Pick Characters.json, Profile.json and MetaInventory.json."));
  renderSave();}
function alertBox(msg){const b=document.getElementById("svmsg");if(b){b.textContent=msg;b.hidden=false;}}

/* ---------- Écriture ---------- */
function svSerialize(k){const f=SV.files[k];
  if(k==="characters")return JSON.stringify({"Characters.json":SV.chars.map(c=>JSON.stringify(c,null,"\t"))},null,"\t");
  return JSON.stringify(f.obj,null,"\t");}
async function svSave(){
  const keys=[...SV.dirty];if(!keys.length)return;
  if(SV.dir){
    try{
      if(!SV.backedUp){const stamp=new Date().toISOString().replace(/[:T]/g,"-").slice(0,19);
        const bk=await SV.dir.getDirectoryHandle("_sauvegarde_bestiaire_"+stamp,{create:true});
        for(const f of Object.values(SV.files)){const h=await bk.getFileHandle(f.name,{create:true});const w=await h.createWritable();await w.write(f.text);await w.close();}
        SV.backedUp="_sauvegarde_bestiaire_"+stamp;}
      for(const k of keys){const w=await SV.files[k].handle.createWritable();const txt=svSerialize(k);await w.write(txt);await w.close();SV.files[k].text=txt;}
      SV.dirty.clear();alertBox(L2(`Enregistré dans le dossier du jeu. Copie de sécurité des fichiers d'origine : ${SV.backedUp}`,`Saved to the game folder. Backup of the original files: ${SV.backedUp}`));
    }catch(e){alertBox(L2("Échec de l'enregistrement : ","Save failed: ")+e.message);}
  }else{
    for(const k of keys){const blob=new Blob([svSerialize(k)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=SV.files[k].name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}
    SV.dirty.clear();alertBox(L2("Fichiers modifiés téléchargés. Remplacez ceux du dossier du jeu (gardez une copie des anciens).","Edited files downloaded. Replace the ones in the game folder (keep a copy of the old ones)."));}
  drawSaveBar();}
function svBackupDownload(){for(const f of Object.values(SV.files)){const blob=new Blob([f.text],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="original_"+f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}}

/* ---------- Vue ---------- */
function renderSave(){
  const loaded=Object.keys(SV.files).length>0,canDir=typeof window.showDirectoryPicker==="function";
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>Save Manager</h1>
    <p>${L2("Modifiez votre personnage, vos ressources, vos talents et techs, et votre inventaire orbital. Fermez Icarus avant d'enregistrer.","Edit your character, resources, talents and tech, and your orbital inventory. Close Icarus before saving.")}</p></div>
    <div class="stats"><h3>${L2("Où sont vos sauvegardes","Where your saves are")}</h3><div class="hunt"><code class="path">%LOCALAPPDATA%\\Icarus\\Saved\\PlayerData\\&lt;SteamID&gt;</code><br>${L2("Fichiers : Characters.json, Profile.json, MetaInventory.json. L'inventaire à l'intérieur d'une prospection n'est pas modifiable (format binaire).","Files: Characters.json, Profile.json, MetaInventory.json. The inventory inside a prospect can't be edited (binary format).")}</div></div>
  </section>
  <div class="svload">
    ${canDir?`<button type="button" class="primary" id="svDir">${L2("Ouvrir le dossier de sauvegarde","Open the save folder")}</button>`:""}
    <label class="more svfile">${L2("Choisir les fichiers .json","Pick the .json files")}<input type="file" id="svFiles" accept=".json,application/json" multiple hidden></label>
    ${canDir?"":`<span class="exs">${L2("Votre navigateur ne peut pas écrire directement dans le dossier : les fichiers modifiés seront téléchargés.","Your browser can't write to the folder directly: edited files will be downloaded.")}</span>`}
  </div>
  <p class="svmsg" id="svmsg" hidden></p>
  ${loaded?`<div class="svbar" id="svbar"></div>
  ${seg("svtab",[["char",L2("Personnage","Character")],["res",L2("Ressources","Resources")],["tal",L2("Talents & techs","Talents & tech")],["inv",L2("Inventaire orbital","Orbital inventory")]],"svtabs")}
  <div id="svOut"></div>`:""}`;
  const v=document.getElementById("view");
  v.querySelector("#svDir")?.addEventListener("click",svOpenDir);
  v.querySelector("#svFiles").onchange=e=>svOpenFiles([...e.target.files]);
  if(!loaded)return;
  state.svtab=SV.tab;v.querySelectorAll('.svtabs button').forEach(b=>{b.setAttribute("aria-pressed",b.dataset.v===SV.tab);b.onclick=()=>{SV.tab=b.dataset.v;renderSave();};});
  drawSaveBar();({char:svChar_,res:svRes,tal:svTal,inv:svInv})[SV.tab]();
}
function drawSaveBar(){const b=document.getElementById("svbar");if(!b)return;
  b.innerHTML=`<span>${Object.values(SV.files).map(f=>`<span class="mtag">${f.name}</span>`).join("")}</span>
   <span class="svdirty">${SV.dirty.size?L2(`${SV.dirty.size} fichier(s) modifié(s)`,`${SV.dirty.size} file(s) changed`):L2("Aucune modification","No changes")}</span>
   <button type="button" class="more" id="svBk">${L2("Télécharger une copie des originaux","Download a copy of the originals")}</button>
   <button type="button" class="primary" id="svSave" ${SV.dirty.size?"":"disabled"}>${SV.dir?L2("Enregistrer dans le jeu","Save to the game"):L2("Télécharger les fichiers modifiés","Download edited files")}</button>`;
  b.querySelector("#svSave").onclick=svSave;b.querySelector("#svBk").onclick=svBackupDownload;}

/* Personnage */
function svChar_(){const out=document.getElementById("svOut");
  if(!SV.files.characters){out.innerHTML=`<div class="empty">${L2("Characters.json n'est pas chargé.","Characters.json is not loaded.")}</div>`;return;}
  const c=svChar(),lvl=levelForXp(c.XP||0);
  const spentT=(c.Talents||[]).reduce((a,t)=>{const i=TAL_BY_ID[t.RowName];return i!==undefined&&TREES[TALENTS[i][1]][4]==="talent"&&TREES[TALENTS[i][1]][2]!=="Solo"&&named(i)?a+(t.Rank||1):a;},0);
  const spentB=(c.Talents||[]).filter(t=>{const i=TAL_BY_ID[t.RowName];return i!==undefined&&TREES[TALENTS[i][1]][4]==="tech"&&named(i)&&!TALENTS[i][14];}).length;
  out.innerHTML=`
  ${SV.chars.length>1?`<div class="seg">${SV.chars.map((ch,i)=>`<button type="button" data-ci="${i}" aria-pressed="${i===SV.ci}">${esc(ch.CharacterName||"#"+i)}</button>`).join("")}</div>`:""}
  <div class="svgrid">
    <label class="svf">${L2("Nom du personnage","Character name")}<input id="svName" value="${esc(c.CharacterName||"")}" maxlength="30"></label>
    <label class="svf">${L2("Niveau","Level")}<input id="svLvl" type="number" min="0" max="1000" value="${lvl}"></label>
    <label class="svf">XP<input id="svXp" type="number" min="0" step="1" value="${c.XP||0}"></label>
    <label class="svf">${L2("Dette d'XP","XP debt")}<input id="svDebt" type="number" min="0" value="${c.XP_Debt||0}"></label>
  </div>
  <div class="kv" style="margin-top:12px"><div><span>${L2("Points de talent","Talent points")}</span><strong>${spentT} / ${talentPts(lvl)}</strong></div><div><span>${L2("Points de tech","Tech points")}</span><strong>${spentB} / ${bpPts(lvl)}</strong></div><div><span>${L2("Prochain niveau","Next level")}</span><strong style="font-size:.9rem">${(xpForLevel(lvl+1)-(c.XP||0)).toLocaleString(prefs.lang)} XP</strong></div></div>
  <div class="svchecks">
    <label class="tchk big"><input type="checkbox" id="svDead" ${c.IsDead?"checked":""}> ${L2("Mort (décochez pour ressusciter)","Dead (untick to revive)")}</label>
    <label class="tchk big"><input type="checkbox" id="svAband" ${c.IsAbandoned?"checked":""}> ${L2("Abandonné","Abandoned")}</label>
  </div>
  <p class="note">${L2("Le niveau se calcule à partir de l'XP (table du wiki). Changer le niveau met l'XP au début de ce niveau. Les points utilisés comptent les talents et blueprints débloqués.","Level is computed from XP (wiki table). Changing the level sets XP to the start of that level. Spent points count unlocked talents and blueprints.")}</p>`;
  out.querySelectorAll("[data-ci]").forEach(b=>b.onclick=()=>{SV.ci=+b.dataset.ci;svChar_();});
  const ch=(fn)=>e=>{fn(e.target);svMark("characters");};
  out.querySelector("#svName").oninput=ch(t=>c.CharacterName=t.value);
  out.querySelector("#svXp").onchange=ch(t=>{c.XP=Math.max(0,Math.round(+t.value||0));svChar_();});
  out.querySelector("#svLvl").onchange=ch(t=>{c.XP=xpForLevel(Math.max(0,Math.min(1000,Math.round(+t.value||0))));svChar_();});
  out.querySelector("#svDebt").onchange=ch(t=>c.XP_Debt=Math.max(0,Math.round(+t.value||0)));
  out.querySelector("#svDead").onchange=ch(t=>c.IsDead=t.checked);
  out.querySelector("#svAband").onchange=ch(t=>c.IsAbandoned=t.checked);
}
/* Ressources */
function svRes(){const out=document.getElementById("svOut");
  if(!SV.files.profile){out.innerHTML=`<div class="empty">${L2("Profile.json n'est pas chargé.","Profile.json is not loaded.")}</div>`;return;}
  const p=SV.files.profile.obj;p.MetaResources??=[];
  const keys=[...new Set([...p.MetaResources.map(r=>r.MetaRow),...Object.keys(META_L.fr)])];
  out.innerHTML=`<div class="svgrid">${keys.map(k=>{const r=p.MetaResources.find(x=>x.MetaRow===k);return `<label class="svf">${esc(META_L[prefs.lang][k]||k)}<input type="number" min="0" data-meta="${k}" value="${r?r.Count:0}"></label>`;}).join("")}</div>
  <p class="note">${L2("Les ressources de l'atelier orbital sont partagées entre tous vos personnages.","Orbital workshop resources are shared by all your characters.")}</p>`;
  out.querySelectorAll("[data-meta]").forEach(inp=>inp.onchange=()=>{const k=inp.dataset.meta,n=Math.max(0,Math.round(+inp.value||0));let r=p.MetaResources.find(x=>x.MetaRow===k);
    if(!r){if(!n)return;r={MetaRow:k,Count:0};p.MetaResources.push(r);}r.Count=n;svMark("profile");});
}
/* Talents & techs */
function svTal(){const out=document.getElementById("svOut");
  const groups=[["talent",L2("Talents","Talents")],["tech",L2("Techs","Tech")],["workshop",L2("Atelier orbital","Orbital workshop")],["prospect",L2("Régions","Regions")]];
  const target=svTarget(SV.tg);
  const trees=TREES.map((_,k)=>k).filter(k=>TREES[k][4]===SV.tg&&TREE_NODES[k].some(named));
  if(!trees.includes(SV.tree))SV.tree=trees[0];
  out.innerHTML=`<div class="seg" id="svtg">${groups.map(([g,l])=>`<button type="button" data-tg="${g}" aria-pressed="${SV.tg===g}">${l}</button>`).join("")}</div>
   ${!target?`<div class="empty">${SV.tg==="talent"||SV.tg==="tech"?L2("Characters.json n'est pas chargé.","Characters.json is not loaded."):L2("Profile.json n'est pas chargé.","Profile.json is not loaded.")}</div>`:`
   <nav class="treetabs">${trees.map(k=>`<button type="button" data-tree="${k}" aria-pressed="${k===SV.tree}">${esc(treeFull(k))} <span class="exs">${TREE_NODES[k].filter(i=>named(i)&&target.some(t=>t.RowName===TALENTS[i][0])).length}/${TREE_NODES[k].filter(named).length}</span></button>`).join("")}</nav>
   <div class="svtools"><button type="button" class="more" id="svAll">${L2("Tout débloquer dans cet arbre","Unlock everything in this tree")}</button><button type="button" class="more" id="svNone">${L2("Tout retirer dans cet arbre","Remove everything in this tree")}</button></div>
   <div class="svtal" id="svTalList"></div>`}`;
  out.querySelectorAll("[data-tg]").forEach(b=>b.onclick=()=>{SV.tg=b.dataset.tg;SV.tree=-1;svTal();});
  if(!target)return;
  out.querySelectorAll("[data-tree]").forEach(b=>b.onclick=()=>{SV.tree=+b.dataset.tree;svTal();});
  const fileKey=SV.tg==="talent"||SV.tg==="tech"?"characters":"profile";
  const rankOf=id=>(target.find(t=>t.RowName===id)||{}).Rank||0;
  const setRank=(i,r)=>{const id=TALENTS[i][0];const ex=target.find(t=>t.RowName===id);
    if(r>0){if(ex)ex.Rank=r;else target.push({RowName:id,Rank:r});
      // prérequis (y compris les nœuds de liaison) débloqués automatiquement
      const seen=new Set();(function up(j){for(const q of TAL_REQ[j]){if(seen.has(q))continue;seen.add(q);if(!target.some(t=>t.RowName===TALENTS[q][0]))target.push({RowName:TALENTS[q][0],Rank:Math.max(1,named(q)?1:1)});up(q);}})(i);}
    else{const rm=new Set([i]);(function down(j){for(const k of TAL_KIDS[j]){if(!rm.has(k)){rm.add(k);down(k);}}})(i);
      for(let x=target.length-1;x>=0;x--){const ii=TAL_BY_ID[target[x].RowName];if(ii!==undefined&&rm.has(ii))target.splice(x,1);}}
    svMark(fileKey);};
  const draw=()=>{const nodes=TREE_NODES[SV.tree].filter(named).sort((a,b)=>TALENTS[a][3]-TALENTS[b][3]||TALENTS[a][2]-TALENTS[b][2]);
    document.getElementById("svTalList").innerHTML=nodes.map(i=>{const tl=TALENTS[i],max=Math.max(1,tl[7]||1),r=rankOf(tl[0]);
      return `<div class="svrow${r?" on":""}">${imgTag(tl[6],"","")}<span class="svt"><b>${esc(tname(i))}</b><small>${esc(teff(i)||tdesc(i)||"")}</small></span>
        ${max>1?`<select data-i="${i}" aria-label="${L2("Rang","Rank")}">${Array.from({length:max+1},(_,n)=>`<option value="${n}" ${n===r?"selected":""}>${n?L2("Rang ","Rank ")+n:L2("Non débloqué","Locked")}</option>`).join("")}</select>`:`<label class="tchk"><input type="checkbox" data-i="${i}" ${r?"checked":""}> ${L2("Débloqué","Unlocked")}</label>`}</div>`;}).join("");
    document.querySelectorAll("#svTalList [data-i]").forEach(el=>el.onchange=()=>{setRank(+el.dataset.i,el.type==="checkbox"?(el.checked?1:0):+el.value);draw();});};
  draw();
  out.querySelector("#svAll").onclick=()=>{TREE_NODES[SV.tree].filter(named).forEach(i=>setRank(i,Math.max(1,TALENTS[i][7]||1)));svTal();};
  out.querySelector("#svNone").onclick=()=>{TREE_NODES[SV.tree].forEach(i=>{const ix=target.findIndex(t=>t.RowName===TALENTS[i][0]);if(ix>=0)target.splice(ix,1);});svMark(fileKey);svTal();};
}
/* Inventaire orbital */
const newGuid=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
function svInv(){const out=document.getElementById("svOut");
  if(!SV.files.meta){out.innerHTML=`<div class="empty">${L2("MetaInventory.json n'est pas chargé.","MetaInventory.json is not loaded.")}</div>`;return;}
  const inv=SV.files.meta.obj;inv.Items??=[];
  const stackOf=it=>{const d=(it.ItemDynamicData||[]).find(x=>x.PropertyType==="ItemableStack");return d?d.Value:1;};
  const nameOf=row=>{const i=ITEMS.findIndex(x=>x[0]===row);return i>=0?xname(i):row;};
  const iconOf=row=>{const i=ITEMS.findIndex(x=>x[0]===row);return i>=0?itemIcon(i):`<span class="pic"></span>`;};
  out.innerHTML=`<div class="svinv">${inv.Items.map((it,n)=>`<div class="svrow on">${iconOf(it.ItemStaticData.RowName)}<span class="svt"><b>${esc(nameOf(it.ItemStaticData.RowName))}</b><small>${esc(it.ItemStaticData.RowName)}</small></span>
     <input type="number" min="1" max="9999" value="${stackOf(it)}" data-st="${n}" aria-label="${L2("Quantité","Quantity")}"><button type="button" class="iconbtn" data-del="${n}" aria-label="${L2("Retirer","Remove")}">✕</button></div>`).join("")||`<div class="empty">${L2("Inventaire vide.","Empty inventory.")}</div>`}</div>
   <h3 class="svh">${L2("Ajouter un objet de l'atelier orbital","Add an orbital workshop item")}</h3>
   <label class="search">${SEARCH_ICON}<input id="svIq" type="search" placeholder="${L2("Chercher un objet…","Search an item…")}" value="${esc(SV.iq)}"></label>
   <div class="items" id="svAdd" style="margin-top:8px"></div>
   <p class="note">${L2("Seuls les objets de l'atelier orbital sont proposés : ce sont les seuls que cet inventaire accepte. Les objets ajoutés reçoivent un identifiant unique neuf.","Only orbital workshop items are offered: they are the only ones this inventory accepts. Added items get a fresh unique ID.")}</p>`;
  out.querySelectorAll("[data-st]").forEach(inp=>inp.onchange=()=>{const it=inv.Items[+inp.dataset.st];it.ItemDynamicData??=[];let d=it.ItemDynamicData.find(x=>x.PropertyType==="ItemableStack");
    if(!d){d={PropertyType:"ItemableStack",Value:1};it.ItemDynamicData.push(d);}d.Value=Math.max(1,Math.round(+inp.value||1));svMark("meta");});
  out.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{inv.Items.splice(+b.dataset.del,1);svMark("meta");svInv();});
  const drawAdd=()=>{const q=SV.iq.trim().toLowerCase();
    const list=WORKSHOP.filter(w=>!q||(ITEMS[w[1]][1]+" "+xname(w[1])).toLowerCase().includes(q)).slice(0,60);
    const box=document.getElementById("svAdd");
    box.innerHTML=list.map(w=>`<button type="button" class="it" data-add="${w[0]}">${itemIcon(w[1])}<span class="it-t"><b>${esc(xname(w[1]))}</b><small>${esc(w[0])}</small></span><span class="badges"><i>＋</i></span></button>`).join("");
    box.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{inv.Items.push({ItemStaticData:{RowName:b.dataset.add,DataTableName:"D_ItemsStatic"},ItemDynamicData:[{PropertyType:"ItemableStack",Value:1}],ItemCustomStats:[],CustomProperties:{StaticWorldStats:[],StaticWorldHeldStats:[],Stats:[],Alterations:[],LivingItemSlots:[]},DatabaseGUID:newGuid(),ItemOwnerLookupId:-1,RuntimeTags:{GameplayTags:[]}});svMark("meta");svInv();});};
  out.querySelector("#svIq").oninput=e=>{SV.iq=e.target.value;drawAdd();};drawAdd();
}
VIEWS.save=()=>renderSave();
