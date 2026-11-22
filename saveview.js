// Save Manager : personnage, ressources, talents/techs, inventaire orbital et inventaire du joueur en prospection
// Dossier : %LOCALAPPDATA%\Icarus\Saved\PlayerData\<SteamID>\ (Characters.json, Profile.json, MetaInventory.json, Prospects\*.json)
const SV={files:{},prospects:{},dir:null,ci:0,tab:"char",tg:"talent",tree:-1,iq:"",pq:"",dirty:new Set(),backedUp:false,pp:null,pname:"",pi:0};
const SV_FILES={characters:"Characters.json",profile:"Profile.json",meta:"MetaInventory.json"};
const L2=(f,e)=>FR()?f:e;
// Table d'XP (wiki « Experience Points »)
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
function alertBox(msg){const b=document.getElementById("svmsg");if(b){b.textContent=msg;b.hidden=false;}}

/* ---------- Chargement : dossier, fichiers ou glisser-déposer ---------- */
// Les fichiers s'ajoutent à ceux déjà chargés : un fichier du même nom remplace l'ancien, les autres restent.
SV.added=new Set();
function svAddText(name,text,handle,isProspect){let obj;try{obj=JSON.parse(text);}catch(e){return;}
  if(isProspect||obj.ProspectBlob){if(obj.ProspectBlob&&obj.ProspectBlob.BinaryBlob){const pn=name.replace(/\.json$/i,"");SV.prospects[pn]={name,text,obj,handle};SV.added.add("p:"+pn);}return;}
  const k=Object.keys(SV_FILES).find(k=>SV_FILES[k].toLowerCase()===name.toLowerCase());if(k){SV.files[k]={name,text,obj,handle};SV.added.add(k);}}
function svRemove(key){if(key.startsWith("p:")){delete SV.prospects[key.slice(2)];if(SV.pp&&SV.pp.name===key.slice(2))SV.pp=null;}else{delete SV.files[key];if(key==="characters")SV.chars=null;}
  SV.dirty.delete(key);if(!Object.keys(SV.files).length&&!Object.keys(SV.prospects).length)SV.dir=null;svRefresh();}
function svClearAll(){SV.files={};SV.prospects={};SV.dir=null;SV.chars=null;SV.pp=null;SV.dirty=new Set();svRefresh();}
const svRefresh=()=>{if(location.hash==="#conseil"&&typeof renderConseil==="function")renderConseil();else renderSave();};
async function svOpenDir(){
  try{let dir=await window.showDirectoryPicker({mode:"readwrite",id:"icarus-save"});
    for(let depth=0;depth<3;depth++){let has=false;try{await dir.getFileHandle("Characters.json");has=true;}catch(e){}
      if(has)break;let sub=null;for await(const [n,h] of dir.entries()){if(h.kind==="directory"&&(/^\d{10,}$/.test(n)||n==="PlayerData")){sub=h;if(/^\d/.test(n))break;}}
      if(!sub)break;dir=sub;}
    SV.dir=dir;SV.added=new Set();
    for(const f of Object.values(SV_FILES)){try{const h=await dir.getFileHandle(f);svAddText(f,await (await h.getFile()).text(),h);}catch(e){}}
    try{const pd=await dir.getDirectoryHandle("Prospects");SV.pdir=pd;for await(const [n,h] of pd.entries()){if(h.kind==="file"&&/\.json$/i.test(n))svAddText(n,await (await h.getFile()).text(),h,true);}}catch(e){}
    svAfterLoad();
  }catch(e){if(e.name!=="AbortError")alertBox(L2("Impossible d'ouvrir ce dossier : ","Could not open this folder: ")+e.message);}}
async function svOpenFiles(list){SV.added=new Set();
  for(const file of list){const path=(file.webkitRelativePath||file.relPath||file.name).replace(/\\/g,"/");if(!/\.json$/i.test(path))continue;
    if(/\/(Loadout|Logs|Config)\//i.test(path))continue;svAddText(file.name,await file.text(),null,/\/Prospects\//i.test(path));}
  svAfterLoad();}
async function svDrop(ev){ev.preventDefault();const out=[];
  const walk=async(entry,path)=>{if(entry.isFile){const f=await new Promise((res,rej)=>entry.file(res,rej));f.relPath=path+f.name;out.push(f);}
    else if(entry.isDirectory){const rd=entry.createReader();let batch;do{batch=await new Promise((res,rej)=>rd.readEntries(res,rej));for(const e of batch)await walk(e,path+entry.name+"/");}while(batch.length);}};
  const items=[...(ev.dataTransfer.items||[])];
  if(items.length&&items[0].webkitGetAsEntry){for(const it of items){const e=it.webkitGetAsEntry();if(e)await walk(e,"/");}}else out.push(...ev.dataTransfer.files);
  await svOpenFiles(out);}
function svAfterLoad(){const added=SV.added||new Set();
  // Seuls les fichiers qui viennent d'arriver sont relus : les modifications en cours sur les autres sont gardées
  if(added.has("characters")||(SV.files.characters&&!SV.chars)){const arr=SV.files.characters.obj["Characters.json"]||[];SV.chars=arr.map(s=>typeof s==="string"?JSON.parse(s):s);SV.ci=0;}
  for(const k of added){SV.dirty.delete(k);if(k.startsWith("p:")&&SV.pp&&SV.pp.name===k.slice(2))SV.pp=null;}
  SV.backedUp=false;if(!SV.pname||!SV.prospects[SV.pname])SV.pname=Object.keys(SV.prospects)[0]||"";
  if(!Object.keys(SV.files).length&&!Object.keys(SV.prospects).length)alertBox(L2("Aucun fichier reconnu. Choisissez le dossier de votre SteamID (il contient Characters.json).","No file recognised. Pick your SteamID folder (it contains Characters.json)."));
  svRefresh();
  if(added.size&&Object.keys(SV.files).length+Object.keys(SV.prospects).length>added.size)alertBox(L2(`${added.size} fichier(s) ajouté(s). Les fichiers déjà chargés sont gardés.`,`${added.size} file(s) added. Files already loaded are kept.`));}

/* ---------- Prospections : décodage / réencodage ---------- */
const b64ToU8=b=>{const s=atob(b);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u;};
const u8ToB64=u=>{let s="";for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);};
const pipe=async(u8,stream)=>new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(stream)).arrayBuffer());
async function svLoadProspect(name){const f=SV.prospects[name];if(!f)return null;
  const raw=await pipe(b64ToU8(f.obj.ProspectBlob.BinaryBlob),new DecompressionStream("deflate"));
  const top=UE.parse(raw);const blobs=UE.find(top,"StateRecorderBlobs");const players=[];
  for(const el of blobs.val.els){const cls=UE.sv(UE.find(el,"ComponentClassName").val);if(!/PlayerStateRecorderComponent$/.test(cls))continue;
    const bd=UE.find(el,"BinaryData");const props=UE.parseBytesArray(bd);const pid=UE.find(UE.find(props,"PlayerCharacterID").val,"PlayerID").val,chr=UE.find(UE.find(props,"PlayerCharacterID").val,"ChrSlot").val;
    const mem=(f.obj.ProspectInfo.AssociatedMembers||[]).find(m=>m.UserID===UE.sv(pid)&&m.ChrSlot===chr);
    players.push({el,bd,props,pid:UE.sv(pid),chr,name:mem?mem.CharacterName:UE.sv(pid)});}
  return {name,top,blobs,players,changed:new Set()};}
const markAllDirty=props=>{for(const p of props){p.dirty=true;if(Array.isArray(p.val))markAllDirty(p.val);else if(p.val&&p.val.els&&p.val.itemTag)p.val.els.forEach(markAllDirty);}};
async function svBuildProspect(pp){const f=SV.prospects[pp.name];
  for(const i of pp.changed){const pl=pp.players[i];markAllDirty(pl.props);pl.bd.raw=UE.bytesArrayValue(pl.props);pl.bd.dirty=true;for(const p of pl.el)p.dirty=true;}
  pp.blobs.dirty=true;const raw=UE.write(pp.top);
  const comp=await pipe(raw,new CompressionStream("deflate"));
  const hash=[...new Uint8Array(await crypto.subtle.digest("SHA-1",raw))].map(b=>b.toString(16).padStart(2,"0")).join("");
  const pb=f.obj.ProspectBlob;pb.Hash=hash;pb.TotalLength=comp.length;pb.DataLength=comp.length;pb.UncompressedLength=raw.length;pb.BinaryBlob=u8ToB64(comp);
  return JSON.stringify(f.obj,null,"\t");}

/* ---------- Écriture ---------- */
function svSerialize(k){if(k==="characters")return JSON.stringify({"Characters.json":SV.chars.map(c=>JSON.stringify(c,null,"\t"))},null,"\t");return JSON.stringify(SV.files[k].obj,null,"\t");}
async function svSave(){
  const keys=[...SV.dirty];if(!keys.length)return;
  const outs={};for(const k of keys){if(k.startsWith("p:")){const name=k.slice(2);outs[k]={file:SV.prospects[name],txt:await svBuildProspect(SV.pp)};}else outs[k]={file:SV.files[k],txt:svSerialize(k)};}
  if(SV.dir){
    try{
      if(!SV.backedUp){const stamp=new Date().toISOString().replace(/[:T]/g,"-").slice(0,19);
        const bk=await SV.dir.getDirectoryHandle("_sauvegarde_bestiaire_"+stamp,{create:true});
        for(const f of [...Object.values(SV.files),...Object.values(SV.prospects)]){const h=await bk.getFileHandle(f.name,{create:true});const w=await h.createWritable();await w.write(f.text);await w.close();}
        SV.backedUp="_sauvegarde_bestiaire_"+stamp;}
      for(const o of Object.values(outs)){if(!o.file.handle){svDownload(o.file.name,o.txt);o.file.text=o.txt;continue;}const w=await o.file.handle.createWritable();await w.write(o.txt);await w.close();o.file.text=o.txt;}
      SV.dirty.clear();if(SV.pp)SV.pp.changed.clear();
      alertBox(L2(`Enregistré dans le jeu. Copie des fichiers d'origine : ${SV.backedUp}`,`Saved to the game. Backup of the original files: ${SV.backedUp}`));
    }catch(e){alertBox(L2("Échec de l'enregistrement : ","Save failed: ")+e.message);}
  }else{
    for(const o of Object.values(outs)){const blob=new Blob([o.txt],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=o.file.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);o.file.text=o.txt;}
    SV.dirty.clear();if(SV.pp)SV.pp.changed.clear();
    alertBox(L2("Fichiers modifiés téléchargés. Remplacez ceux du dossier du jeu (les prospections vont dans le sous-dossier Prospects).","Edited files downloaded. Replace the ones in the game folder (prospects go in the Prospects subfolder)."));}
  drawSaveBar();}
function svDownload(name,txt){const blob=new Blob([txt],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);}
function svBackupDownload(){for(const f of [...Object.values(SV.files),...Object.values(SV.prospects)]){const blob=new Blob([f.text],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="original_"+f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);}}

/* ---------- Vue ---------- */
function renderSave(){
  const loaded=Object.keys(SV.files).length>0||Object.keys(SV.prospects).length>0,canDir=typeof window.showDirectoryPicker==="function";
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>Save Manager</h1>
    <p>${L2("Modifiez votre personnage, vos ressources, vos talents et techs, votre inventaire orbital et l'inventaire de votre joueur dans une prospection. Fermez Icarus avant d'enregistrer.","Edit your character, resources, talents and tech, orbital inventory and your player's inventory in a prospect. Close Icarus before saving.")}</p></div>
    <div class="stats"><h3>${L2("Où sont vos sauvegardes","Where your saves are")}</h3><div class="hunt"><code class="path">%LOCALAPPDATA%\\Icarus\\Saved\\PlayerData\\&lt;SteamID&gt;</code><br>${L2("Choisissez ce dossier entier : tout est chargé d'un coup (personnage, profil, inventaire orbital et prospections).","Pick this whole folder: everything loads at once (character, profile, orbital inventory and prospects).")}</div></div>
  </section>
  <div class="svdrop" id="svDrop">
    <div class="svload">
      ${canDir?`<button type="button" class="primary" id="svDir">${L2("Ouvrir le dossier (lecture et écriture)","Open the folder (read and write)")}</button>`:""}
      <label class="more svfile">${L2("Choisir le dossier","Pick the folder")}<input type="file" id="svFolder" webkitdirectory directory multiple hidden></label>
      <label class="more svfile">${L2("Choisir des fichiers","Pick files")}<input type="file" id="svFiles" accept=".json,application/json" multiple hidden></label>
    </div>
    <p class="exs">${L2("…ou glissez-déposez ici le dossier de votre SteamID ou tous les fichiers .json en même temps.","…or drag and drop your SteamID folder or all the .json files here at once.")} ${L2("Les fichiers s'ajoutent à ceux déjà chargés.","Files are added to the ones already loaded.")}${canDir?"":" "+L2("Votre navigateur ne peut pas écrire dans le dossier : les fichiers modifiés seront téléchargés.","Your browser can't write to the folder: edited files will be downloaded.")}</p>
  </div>
  <p class="svmsg" id="svmsg" hidden></p>
  ${loaded?`<div class="svbar" id="svbar"></div>
  ${seg("svtab",[["char",L2("Personnage","Character")],["res",L2("Ressources","Resources")],["tal",L2("Talents & techs","Talents & tech")],["inv",L2("Inventaire orbital","Orbital inventory")],["pinv",L2("Inventaire du joueur","Player inventory")]],"svtabs")}
  <div id="svOut"></div>`:""}`;
  const v=document.getElementById("view");
  v.querySelector("#svDir")?.addEventListener("click",svOpenDir);
  v.querySelector("#svFolder").onchange=e=>svOpenFiles([...e.target.files]);
  v.querySelector("#svFiles").onchange=e=>svOpenFiles([...e.target.files]);
  const dz=v.querySelector("#svDrop");dz.addEventListener("dragover",e=>{e.preventDefault();dz.classList.add("over");});dz.addEventListener("dragleave",()=>dz.classList.remove("over"));dz.addEventListener("drop",e=>{dz.classList.remove("over");svDrop(e);});
  if(!loaded)return;
  v.querySelectorAll('.svtabs button').forEach(b=>{b.setAttribute("aria-pressed",b.dataset.v===SV.tab);b.onclick=()=>{SV.tab=b.dataset.v;renderSave();};});
  drawSaveBar();({char:svChar_,res:svRes,tal:svTal,inv:svInv,pinv:svPinv})[SV.tab]();}
function drawSaveBar(){const b=document.getElementById("svbar");if(!b)return;
  const all=[...Object.entries(SV.files),...Object.entries(SV.prospects).map(([n,f])=>["p:"+n,f])];
  b.innerHTML=`<span class="svtags">${all.map(([k,f])=>`<span class="mtag svtag">${esc(f.name)}<button type="button" data-svrm="${esc(k)}" aria-label="${L2("Retirer","Remove")} ${esc(f.name)}" title="${L2("Retirer ce fichier","Remove this file")}">✕</button></span>`).join("")}${all.length>1?`<button type="button" class="linkbtn" id="svClr">${L2("Tout retirer","Remove all")}</button>`:""}</span>
   <span class="svdirty">${SV.dirty.size?L2(`${SV.dirty.size} fichier(s) modifié(s)`,`${SV.dirty.size} file(s) changed`):L2("Aucune modification","No changes")}</span>
   <button type="button" class="more" id="svBk">${L2("Télécharger une copie des originaux","Download a copy of the originals")}</button>
   <button type="button" class="primary" id="svSave" ${SV.dirty.size?"":"disabled"}>${SV.dir?L2("Enregistrer dans le jeu","Save to the game"):L2("Télécharger les fichiers modifiés","Download edited files")}</button>`;
  b.querySelector("#svSave").onclick=svSave;b.querySelector("#svBk").onclick=svBackupDownload;
  b.querySelectorAll("[data-svrm]").forEach(x=>x.onclick=()=>{const k=x.dataset.svrm;if(SV.dirty.has(k)&&!confirm(L2("Ce fichier a des modifications non enregistrées. Le retirer quand même ?","This file has unsaved changes. Remove it anyway?")))return;svRemove(k);});
  b.querySelector("#svClr")?.addEventListener("click",()=>{if(SV.dirty.size&&!confirm(L2("Des modifications ne sont pas enregistrées. Tout retirer quand même ?","Some changes aren't saved. Remove everything anyway?")))return;svClearAll();});}

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
  <div class="kv" style="margin-top:12px"><div><span>${L2("Points de talent (estimation)","Talent points (estimate)")}</span><strong>${spentT} / ${talentPts(lvl)}</strong></div><div><span>${L2("Points de tech","Tech points")}</span><strong>${spentB} / ${bpPts(lvl)}</strong></div><div><span>${L2("Prochain niveau","Next level")}</span><strong style="font-size:.9rem">${(xpForLevel(lvl+1)-(c.XP||0)).toLocaleString(prefs.lang)} XP</strong></div></div>
  <div class="svchecks">
    <label class="tchk big"><input type="checkbox" id="svDead" ${c.IsDead?"checked":""}> ${L2("Mort (décochez pour ressusciter)","Dead (untick to revive)")}</label>
    <label class="tchk big"><input type="checkbox" id="svAband" ${c.IsAbandoned?"checked":""}> ${L2("Abandonné","Abandoned")}</label>
  </div>
  <p class="note">${L2("Le niveau se calcule à partir de l'XP (table du wiki). Changer le niveau met l'XP au début de ce niveau.","Level is computed from XP (wiki table). Changing the level sets XP to the start of that level.")}</p>`;
  out.querySelectorAll("[data-ci]").forEach(b=>b.onclick=()=>{SV.ci=+b.dataset.ci;svChar_();});
  const ch=fn=>e=>{fn(e.target);svMark("characters");};
  out.querySelector("#svName").oninput=ch(t=>c.CharacterName=t.value);
  out.querySelector("#svXp").onchange=ch(t=>{c.XP=Math.max(0,Math.round(+t.value||0));svChar_();});
  out.querySelector("#svLvl").onchange=ch(t=>{c.XP=xpForLevel(Math.max(0,Math.min(1000,Math.round(+t.value||0))));svChar_();});
  out.querySelector("#svDebt").onchange=ch(t=>c.XP_Debt=Math.max(0,Math.round(+t.value||0)));
  out.querySelector("#svDead").onchange=ch(t=>c.IsDead=t.checked);
  out.querySelector("#svAband").onchange=ch(t=>c.IsAbandoned=t.checked);}
/* Ressources */
function svRes(){const out=document.getElementById("svOut");
  if(!SV.files.profile){out.innerHTML=`<div class="empty">${L2("Profile.json n'est pas chargé.","Profile.json is not loaded.")}</div>`;return;}
  const p=SV.files.profile.obj;p.MetaResources??=[];
  const keys=[...new Set([...p.MetaResources.map(r=>r.MetaRow),...Object.keys(META_L.fr)])];
  out.innerHTML=`<div class="svgrid">${keys.map(k=>{const r=p.MetaResources.find(x=>x.MetaRow===k);return `<label class="svf">${esc(META_L[prefs.lang][k]||k)}<input type="number" min="0" data-meta="${k}" value="${r?r.Count:0}"></label>`;}).join("")}</div>
  <p class="note">${L2("Les ressources de l'atelier orbital sont partagées entre tous vos personnages.","Orbital workshop resources are shared by all your characters.")}</p>`;
  out.querySelectorAll("[data-meta]").forEach(inp=>inp.onchange=()=>{const k=inp.dataset.meta,n=Math.max(0,Math.round(+inp.value||0));let r=p.MetaResources.find(x=>x.MetaRow===k);
    if(!r){if(!n)return;r={MetaRow:k,Count:0};p.MetaResources.push(r);}r.Count=n;svMark("profile");});}
/* Talents & techs */
function svTal(){const out=document.getElementById("svOut");
  const groups=[["talent",L2("Talents","Talents")],["tech",L2("Techs","Tech")],["workshop",L2("Atelier orbital","Orbital workshop")],["prospect",L2("Régions","Regions")]];
  const target=svTarget(SV.tg);const trees=TREES.map((_,k)=>k).filter(k=>TREES[k][4]===SV.tg&&TREE_NODES[k].some(named));
  if(!trees.includes(SV.tree))SV.tree=trees[0];
  out.innerHTML=`<div class="seg">${groups.map(([g,l])=>`<button type="button" data-tg="${g}" aria-pressed="${SV.tg===g}">${l}</button>`).join("")}</div>
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
    if(r>0){if(ex)ex.Rank=r;else target.push({RowName:id,Rank:r});const seen=new Set();(function up(j){for(const q of TAL_REQ[j]){if(seen.has(q))continue;seen.add(q);if(!target.some(t=>t.RowName===TALENTS[q][0]))target.push({RowName:TALENTS[q][0],Rank:1});up(q);}})(i);}
    else{const rm=new Set([i]);(function down(j){for(const k of TAL_KIDS[j]){if(!rm.has(k)){rm.add(k);down(k);}}})(i);for(let x=target.length-1;x>=0;x--){const ii=TAL_BY_ID[target[x].RowName];if(ii!==undefined&&rm.has(ii))target.splice(x,1);}}
    svMark(fileKey);};
  const draw=()=>{const nodes=TREE_NODES[SV.tree].filter(named).sort((a,b)=>TALENTS[a][3]-TALENTS[b][3]||TALENTS[a][2]-TALENTS[b][2]);
    document.getElementById("svTalList").innerHTML=nodes.map(i=>{const tl=TALENTS[i],max=Math.max(1,tl[7]||1),r=rankOf(tl[0]);
      return `<div class="svrow${r?" on":""}">${imgTag(tl[6],"","")}<span class="svt"><b>${esc(tname(i))}</b><small>${esc(teff(i)||tdesc(i)||"")}</small></span>
        ${max>1?`<select data-i="${i}">${Array.from({length:max+1},(_,n)=>`<option value="${n}" ${n===r?"selected":""}>${n?L2("Rang ","Rank ")+n:L2("Non débloqué","Locked")}</option>`).join("")}</select>`:`<label class="tchk"><input type="checkbox" data-i="${i}" ${r?"checked":""}> ${L2("Débloqué","Unlocked")}</label>`}</div>`;}).join("");
    document.querySelectorAll("#svTalList [data-i]").forEach(el=>el.onchange=()=>{setRank(+el.dataset.i,el.type==="checkbox"?(el.checked?1:0):+el.value);draw();});};
  draw();
  out.querySelector("#svAll").onclick=()=>{TREE_NODES[SV.tree].filter(named).forEach(i=>setRank(i,Math.max(1,TALENTS[i][7]||1)));svTal();};
  out.querySelector("#svNone").onclick=()=>{TREE_NODES[SV.tree].forEach(i=>{const ix=target.findIndex(t=>t.RowName===TALENTS[i][0]);if(ix>=0)target.splice(ix,1);});svMark(fileKey);svTal();};}
/* Inventaire orbital */
const newGuid=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(b=>b.toString(16).padStart(2,"0")).join("").toUpperCase();
const svItemIdx=row=>{const i=ITEMS.findIndex(x=>x[0]===row);return i;};
const svItemName=row=>{const i=svItemIdx(row);return i>=0?xname(i):row;};
const svItemIcon=row=>{const i=svItemIdx(row);return i>=0?itemIcon(i):`<span class="pic"></span>`;};
function svInv(){const out=document.getElementById("svOut");
  if(!SV.files.meta){out.innerHTML=`<div class="empty">${L2("MetaInventory.json n'est pas chargé.","MetaInventory.json is not loaded.")}</div>`;return;}
  const inv=SV.files.meta.obj;inv.Items??=[];
  const stackOf=it=>{const d=(it.ItemDynamicData||[]).find(x=>x.PropertyType==="ItemableStack");return d?d.Value:1;};
  out.innerHTML=`<div class="svinv">${inv.Items.map((it,n)=>`<div class="svrow on">${svItemIcon(it.ItemStaticData.RowName)}<span class="svt"><b>${esc(svItemName(it.ItemStaticData.RowName))}</b><small>${esc(it.ItemStaticData.RowName)}</small></span>
     <input type="number" min="1" max="9999" value="${stackOf(it)}" data-st="${n}"><button type="button" class="iconbtn" data-del="${n}" aria-label="${L2("Retirer","Remove")}">✕</button></div>`).join("")||`<div class="empty">${L2("Inventaire vide.","Empty inventory.")}</div>`}</div>
   <h3 class="svh">${L2("Ajouter un objet de l'atelier orbital","Add an orbital workshop item")}</h3>
   <label class="search">${SEARCH_ICON}<input id="svIq" type="search" placeholder="${L2("Chercher un objet…","Search an item…")}" value="${esc(SV.iq)}"></label>
   <div class="items" id="svAdd" style="margin-top:8px"></div>`;
  out.querySelectorAll("[data-st]").forEach(inp=>inp.onchange=()=>{const it=inv.Items[+inp.dataset.st];it.ItemDynamicData??=[];let d=it.ItemDynamicData.find(x=>x.PropertyType==="ItemableStack");
    if(!d){d={PropertyType:"ItemableStack",Value:1};it.ItemDynamicData.push(d);}d.Value=Math.max(1,Math.round(+inp.value||1));svMark("meta");});
  out.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{inv.Items.splice(+b.dataset.del,1);svMark("meta");svInv();});
  const drawAdd=()=>{const q=SV.iq.trim().toLowerCase();const list=WORKSHOP.filter(w=>!q||(ITEMS[w[1]][1]+" "+xname(w[1])).toLowerCase().includes(q)).slice(0,60);
    const box=document.getElementById("svAdd");box.innerHTML=list.map(w=>`<button type="button" class="it" data-add="${w[0]}">${itemIcon(w[1])}<span class="it-t"><b>${esc(xname(w[1]))}</b><small>${esc(w[0])}</small></span><span class="badges"><i>＋</i></span></button>`).join("");
    box.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{inv.Items.push({ItemStaticData:{RowName:b.dataset.add,DataTableName:"D_ItemsStatic"},ItemDynamicData:[{PropertyType:"ItemableStack",Value:1}],ItemCustomStats:[],CustomProperties:{StaticWorldStats:[],StaticWorldHeldStats:[],Stats:[],Alterations:[],LivingItemSlots:[]},DatabaseGUID:newGuid(),ItemOwnerLookupId:-1,RuntimeTags:{GameplayTags:[]}});svMark("meta");svInv();});};
  out.querySelector("#svIq").oninput=e=>{SV.iq=e.target.value;drawAdd();};drawAdd();}

/* Inventaire du joueur (dans une prospection) */
const INV_L={fr:{2:"Barre d'action",3:"Sac à dos",4:"Emplacements de survie (oxygène, nourriture, eau)",5:"Équipement porté",11:"Modules de la combinaison",12:"Emplacement d'accessoire"},en:{2:"Hotbar",3:"Backpack",4:"Survival slots (oxygen, food, water)",5:"Worn equipment",11:"Suit modules",12:"Accessory slot"}};
const DYN={7:["Quantité","Quantity"],6:["Durabilité","Durability"],10:["Contenu","Contents"]};
const STAT_F=[["Health",L2?"":"",["Santé","Health"]],["FoodLevel","",["Nourriture","Food"]],["WaterLevel","",["Eau","Water"]],["OxygenLevel","",["Oxygène","Oxygen"]],["RadiationLevel","",["Radiation","Radiation"]]];
const dynGet=(slot,ix)=>{const d=UE.find(slot,"DynamicData").val.els.find(e=>UE.find(e,"Index").val===ix);return d?UE.find(d,"Value").val:undefined;};
function dynSet(slot,ix,v){const arr=UE.find(slot,"DynamicData").val;let d=arr.els.find(e=>UE.find(e,"Index").val===ix);
  if(!d){const tpl=arr.els[0]||SV.pp._dynTpl;if(!tpl)return false;d=cloneProps(tpl);UE.find(d,"Index").val=ix;arr.els.push(d);}UE.find(d,"Value").val=v;return true;}
const cloneProps=props=>props.map(p=>{const c={...p};if(Array.isArray(p.val))c.val=cloneProps(p.val);else if(p.val&&p.val.els&&p.val.itemTag)c.val={...p.val,els:p.val.els.map(cloneProps)};else if(p.val&&p.val.els)c.val={...p.val,els:[...p.val.els]};return c;});
async function svPinv(){const out=document.getElementById("svOut");const names=Object.keys(SV.prospects);
  if(!names.length){out.innerHTML=`<div class="empty">${L2("Aucune prospection chargée. Choisissez le dossier entier de votre SteamID (il contient le sous-dossier Prospects).","No prospect loaded. Pick your whole SteamID folder (it contains the Prospects subfolder).")}</div>`;return;}
  if(!SV.pname||!SV.prospects[SV.pname])SV.pname=names[0];
  if(!SV.pp||SV.pp.name!==SV.pname){out.innerHTML=`<p class="note">${L2("Décodage de la prospection…","Decoding the prospect…")}</p>`;
    try{SV.pp=await svLoadProspect(SV.pname);SV.pi=0;
      for(const pl of SV.pp.players)for(const inv of UE.find(pl.props,"SavedInventories").val.els)for(const sl of UE.find(inv,"Slots").val.els){const dd=UE.find(sl,"DynamicData").val;if(!SV.pp._dynTpl&&dd.els.length)SV.pp._dynTpl=dd.els[0];if(!SV.pp._slotTpl&&dd.els.length)SV.pp._slotTpl=sl;}
    }catch(e){out.innerHTML=`<div class="empty">${L2("Impossible de décoder cette prospection : ","Could not decode this prospect: ")}${esc(e.message)}</div>`;return;}}
  const pp=SV.pp,pl=pp.players[SV.pi];
  const change=()=>{pp.changed.add(SV.pi);svMark("p:"+pp.name);};
  out.innerHTML=`<div class="svgrid2">
     <label class="svf">${L2("Prospection","Prospect")}<select id="svPros">${names.map(n=>`<option ${n===SV.pname?"selected":""}>${esc(n)}</option>`).join("")}</select></label>
     ${pp.players.length?`<label class="svf">${L2("Joueur","Player")}<select id="svPl">${pp.players.map((p,i)=>`<option value="${i}" ${i===SV.pi?"selected":""}>${esc(p.name)}</option>`).join("")}</select></label>`:""}</div>
   ${!pl?`<div class="empty">${L2("Aucun joueur enregistré dans cette prospection.","No player saved in this prospect.")}</div>`:`
   <h3 class="svh">${L2("État du joueur","Player state")}</h3>
   <div class="svgrid">${STAT_F.map(([k,,l])=>{const p=UE.find(pl.props,k);return p&&typeof p.val==="number"?`<label class="svf">${FR()?l[0]:l[1]}<input type="number" min="0" data-stat="${k}" value="${p.val}"></label>`:"";}).join("")}</div>
   <div id="svInvs"></div>`}
   <p class="note">${L2("Le joueur doit être hors de la partie (Icarus fermé). Quantité = index 7, durabilité = index 6, contenu (oxygène, eau) = index 10 dans les données de l'objet.","The player must be out of the game (Icarus closed). Quantity = index 7, durability = index 6, contents (oxygen, water) = index 10 in the item data.")}</p>`;
  out.querySelector("#svPros").onchange=e=>{SV.pname=e.target.value;svPinv();};
  out.querySelector("#svPl")?.addEventListener("change",e=>{SV.pi=+e.target.value;svPinv();});
  if(!pl)return;
  out.querySelectorAll("[data-stat]").forEach(inp=>inp.onchange=()=>{UE.find(pl.props,inp.dataset.stat).val=Math.max(0,Math.round(+inp.value||0));change();});
  const invs=UE.find(pl.props,"SavedInventories").val.els;
  const drawInvs=()=>{document.getElementById("svInvs").innerHTML=invs.map((inv,ii)=>{const id=UE.find(inv,"InventoryID").val;const slots=UE.find(inv,"Slots").val.els;
    return `<h3 class="svh">${esc(INV_L[prefs.lang][id]||L2("Inventaire ","Inventory ")+id)} <span class="exs">(${slots.length})</span></h3><div class="svinv">${slots.map((sl,si)=>{const row=UE.sv(UE.find(sl,"ItemStaticData").val);
      return `<div class="svrow on pslot">${svItemIcon(row)}<span class="svt"><b>${esc(svItemName(row))}</b><small>${L2("Case","Slot")} ${UE.find(sl,"Location").val} · ${esc(row)}</small></span>
        <span class="dyns">${[7,6,10].filter(ix=>dynGet(sl,ix)!==undefined).map(ix=>`<label>${FR()?DYN[ix][0]:DYN[ix][1]}<input type="number" min="0" data-ii="${ii}" data-si="${si}" data-ix="${ix}" value="${dynGet(sl,ix)}"></label>`).join("")}</span>
        <span class="slotbtns"><button type="button" class="iconbtn" data-swap="${ii}:${si}" title="${L2("Remplacer l'objet","Replace the item")}" aria-label="${L2("Remplacer l'objet","Replace the item")}">⇄</button><button type="button" class="iconbtn" data-rm="${ii}:${si}" aria-label="${L2("Retirer","Remove")}">✕</button></span></div>`;}).join("")}
      <button type="button" class="more addslot" data-addto="${ii}">＋ ${L2("Ajouter un objet ici","Add an item here")}</button></div>`;}).join("");
    const box=document.getElementById("svInvs");
    box.querySelectorAll("[data-ix]").forEach(inp=>inp.onchange=()=>{const sl=UE.find(invs[+inp.dataset.ii],"Slots").val.els[+inp.dataset.si];dynSet(sl,+inp.dataset.ix,Math.max(0,Math.round(+inp.value||0)));change();});
    box.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{const [ii,si]=b.dataset.rm.split(":").map(Number);UE.find(invs[ii],"Slots").val.els.splice(si,1);change();drawInvs();});
    box.querySelectorAll("[data-swap]").forEach(b=>b.onclick=()=>{const [ii,si]=b.dataset.swap.split(":").map(Number);pickItem(row=>{UE.find(UE.find(invs[ii],"Slots").val.els[si],"ItemStaticData").val=row;change();drawInvs();});});
    box.querySelectorAll("[data-addto]").forEach(b=>b.onclick=()=>{const ii=+b.dataset.addto;pickItem(row=>{const slots=UE.find(invs[ii],"Slots").val;const tpl=slots.els[0]||pp._slotTpl;if(!tpl){alertBox(L2("Impossible d'ajouter : aucun modèle d'objet trouvé.","Can't add: no item template found."));return;}
      const ns=cloneProps(tpl);const used=new Set(slots.els.map(s=>UE.find(s,"Location").val));let loc=0;while(used.has(loc))loc++;
      UE.find(ns,"Location").val=loc;UE.find(ns,"ItemStaticData").val=row;const g=UE.find(ns,"ItemGuid");if(g)g.val="";
      const dd=UE.find(ns,"DynamicData").val;const base=dd.els[0]||pp._dynTpl;dd.els=[];if(base){const d=cloneProps(base);UE.find(d,"Index").val=7;UE.find(d,"Value").val=1;dd.els.push(d);}
      for(const k of ["AdditionalStats","Alterations","LivingItemSlots"]){const a=UE.find(ns,k);if(a&&a.val&&a.val.els)a.val.els=[];}
      slots.els.push(ns);change();drawInvs();});});};
  drawInvs();}
// Sélecteur d'objet (tout le catalogue)
function pickItem(onPick){const o=document.createElement("div");o.className="lightbox on picker";o.innerHTML=`<div class="pickbox"><div class="pickhd"><b>${L2("Choisir un objet","Pick an item")}</b><button type="button" class="iconbtn" data-x>✕</button></div>
  <label class="search">${SEARCH_ICON}<input type="search" placeholder="${L2("Chercher un objet…","Search an item…")}" autofocus></label><div class="items pickl"></div></div>`;document.body.appendChild(o);
  const inp=o.querySelector("input"),list=o.querySelector(".pickl");
  const draw=()=>{const q=inp.value.trim().toLowerCase();const r=[];for(let i=0;i<ITEMS.length&&r.length<80;i++){if(!q||(ITEMS[i][1]+" "+xname(i)+" "+ITEMS[i][0]).toLowerCase().includes(q))r.push(i);}
    list.innerHTML=r.map(i=>`<button type="button" class="it" data-row="${esc(ITEMS[i][0])}">${itemIcon(i)}<span class="it-t"><b>${esc(xname(i))}</b><small>${esc(ITEMS[i][0])}</small></span></button>`).join("");
    list.querySelectorAll("[data-row]").forEach(b=>b.onclick=()=>{o.remove();onPick(b.dataset.row);});};
  inp.oninput=draw;o.querySelector("[data-x]").onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove();};draw();inp.focus();}
VIEWS.save=()=>renderSave();
