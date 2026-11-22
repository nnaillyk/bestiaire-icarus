// Conseiller IA : lit la sauvegarde (personnage, talents, techs, atelier, inventaires) et demande conseil à Claude.
// La clé API de l'utilisateur reste sur son appareil (localStorage) et n'est envoyée qu'à api.anthropic.com.
const AI_KEY="icarus-ia-cle";
const AI_SDK="https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.6.0/+esm";
const AI_MODEL="claude-opus-5-5";
const AI={history:[],profile:null,busy:false,pros:"",sdk:null,stop:null};
const aiKeyGet=()=>{try{return localStorage.getItem(AI_KEY)||"";}catch(e){return "";}};
const aiKeySet=v=>{try{if(v)localStorage.setItem(AI_KEY,v);else localStorage.removeItem(AI_KEY);}catch(e){}};

/* ---------- Profil du joueur, envoyé à l'IA ---------- */
const aiRank=(list,id)=>(list.find(t=>t.RowName===id)||{}).Rank||0;
const aiShort=(s,n=160)=>{s=String(s||"").replace(/\s+/g," ").trim();return s.length>n?s.slice(0,n-1)+"…":s;};
async function aiBuildProfile(){const fr=FR(),out=[];const c=svChar();
  if(c){const lvl=levelForXp(c.XP||0),tl=c.Talents||[];
    const isT=i=>TREES[TALENTS[i][1]][4]==="talent",isB=i=>TREES[TALENTS[i][1]][4]==="tech";
    const spentT=tl.reduce((a,t)=>{const i=TAL_BY_ID[t.RowName];return i!==undefined&&isT(i)&&TREES[TALENTS[i][1]][2]!=="Solo"&&named(i)?a+(t.Rank||1):a;},0);
    const spentB=tl.filter(t=>{const i=TAL_BY_ID[t.RowName];return i!==undefined&&isB(i)&&named(i)&&!TALENTS[i][14];}).length;
    out.push(`# ${fr?"Personnage":"Character"}\n${fr?"Nom":"Name"}: ${c.CharacterName||"?"} · ${fr?"niveau":"level"} ${lvl} · XP ${c.XP||0}${c.IsDead?(fr?" · MORT":" · DEAD"):""}`);
    out.push(`${fr?"Points de talent (estimation, hors arbre Solo)":"Talent points (estimate, Solo tree excluded)"}: ${spentT} ${fr?"dépensés sur environ":"spent of about"} ${talentPts(lvl)} (${fr?"libres":"free"}: ${Math.max(0,talentPts(lvl)-spentT)})`);
    out.push(`${fr?"Points de tech":"Tech points"}: ${spentB} ${fr?"dépensés sur":"spent of"} ${bpPts(lvl)} (${fr?"libres":"free"}: ${Math.max(0,bpPts(lvl)-spentB)})`);
    // Débloqué, par arbre
    const byTree=(pred,withRank)=>{const m=new Map();for(const t of tl){const i=TAL_BY_ID[t.RowName];if(i===undefined||!named(i)||!pred(i))continue;const k=TALENTS[i][1];if(!m.has(k))m.set(k,[]);
      m.get(k).push(tname(i)+(withRank&&(TALENTS[i][7]||1)>1?` (${t.Rank||1}/${TALENTS[i][7]})`:""));}
      return [...m].map(([k,l])=>`- ${treeFull(k)}: ${l.join(", ")}`).join("\n")||"- —";};
    out.push(`\n# ${fr?"Talents débloqués":"Unlocked talents"}\n${byTree(isT,true)}`);
    out.push(`\n# ${fr?"Techs débloquées (arbre tech)":"Unlocked tech (tech tree)"}\n${byTree(i=>isB(i)&&!TALENTS[i][14],false)}`);
    // Ce qui peut être pris maintenant : prérequis remplis, niveau suffisant, pas au maximum
    const avail=pred=>{const r=[];TALENTS.forEach((t,i)=>{if(!named(i)||!pred(i)||TALENTS[i][14])return;const rk=aiRank(tl,t[0]),mx=Math.max(1,t[7]||1);if(rk>=mx)return;
      if(TAL_REQ[i].some(q=>!aiRank(tl,TALENTS[q][0])))return;r.push(i);});return r;};
    const at=avail(i=>isT(i)&&TREES[TALENTS[i][1]][2]!=="Solo");
    out.push(`\n# ${fr?"Talents disponibles maintenant (prérequis remplis)":"Talents available now (requirements met)"}\n`+(at.map(i=>`- [${treeFull(TALENTS[i][1])}] ${tname(i)} — ${fr?"rang":"rank"} ${aiRank(tl,TALENTS[i][0])}/${Math.max(1,TALENTS[i][7]||1)}${TALENTS[i][9]?` · ${fr?"niv.":"lvl"} ${TALENTS[i][9]}`:""} — ${aiShort(teff(i)||tdesc(i))}`).join("\n")||"- —"));
    const ab=avail(isB);
    out.push(`\n# ${fr?"Techs disponibles maintenant dans l'arbre tech":"Tech available now in the tech tree"}\n`+(ab.map(i=>`- [${treeFull(TALENTS[i][1])}] ${tname(i)}${TALENTS[i][9]?` · ${fr?"niveau requis":"required level"} ${TALENTS[i][9]}${TALENTS[i][9]>lvl?(fr?" (pas encore atteint)":" (not reached yet)"):""}`:""}${tdesc(i)?" — "+aiShort(tdesc(i),110):""}`).join("\n")||"- —"));}
  else out.push(fr?"# Personnage\nCharacters.json n'est pas chargé : pas de niveau, de talents ni de techs.":"# Character\nCharacters.json is not loaded: no level, talents or tech.");
  if(SV.files.profile){const p=SV.files.profile.obj;
    const res=(p.MetaResources||[]).filter(r=>r.Count).map(r=>`${META_L[prefs.lang][r.MetaRow]||r.MetaRow}: ${r.Count}`);
    if(res.length)out.push(`\n# ${fr?"Ressources de l'atelier orbital":"Orbital workshop resources"}\n${res.join(" · ")}`);
    const ws=(p.Talents||[]).map(t=>TAL_BY_ID[t.RowName]).filter(i=>i!==undefined&&named(i)&&TREES[TALENTS[i][1]][4]==="workshop").map(tname);
    if(ws.length)out.push(`\n# ${fr?"Atelier orbital débloqué":"Orbital workshop unlocked"}\n${ws.join(", ")}`);}
  if(SV.files.meta){const items=(SV.files.meta.obj.Items||[]).map(it=>{const n=svItemName(it.ItemStaticData.RowName);const s=(it.ItemDynamicData||[]).find(x=>x.PropertyType==="ItemableStack");return n+(s&&s.Value>1?` ×${s.Value}`:"");});
    if(items.length)out.push(`\n# ${fr?"Inventaire orbital (objets à emporter)":"Orbital inventory (items to bring)"}\n${items.join(", ")}`);}
  // Équipement réel du joueur dans une prospection
  const pn=AI.pros&&SV.prospects[AI.pros]?AI.pros:Object.keys(SV.prospects)[0];
  if(pn){try{if(!SV.pp||SV.pp.name!==pn){SV.pp=await svLoadProspect(pn);SV.pi=0;}
      const pl=SV.pp.players.find(p=>c&&p.name===c.CharacterName)||SV.pp.players[0];
      if(pl){const lines=[];for(const inv of UE.find(pl.props,"SavedInventories").val.els){const id=UE.find(inv,"InventoryID").val;const slots=UE.find(inv,"Slots").val.els;if(!slots.length||!INV_L.fr[id])continue;
          lines.push(`- ${INV_L[prefs.lang][id]}: `+slots.filter(sl=>!/^(Skin_|Spacesuit_)/.test(UE.sv(UE.find(sl,"ItemStaticData").val))).map(sl=>{const row=UE.sv(UE.find(sl,"ItemStaticData").val);const q=dynGet(sl,7),d=dynGet(sl,6);return svItemName(row)+(q>1?` ×${q}`:"")+(d!==undefined?` (${fr?"durabilité":"durability"} ${d})`:"");}).join(", "));}
        out.push(`\n# ${fr?`Équipement du joueur ${pl.name} dans la prospection « ${pn} »`:`Gear of player ${pl.name} in prospect "${pn}"`}\n${lines.join("\n")||"- —"}`);}}
    catch(e){out.push(`\n# ${fr?"Équipement":"Gear"}\n${fr?"Prospection illisible":"Prospect unreadable"} (${e.message})`);}}
  else out.push(`\n# ${fr?"Équipement":"Gear"}\n${fr?"Aucune prospection chargée : l'équipement porté est inconnu.":"No prospect loaded: worn gear is unknown."}`);
  return out.join("\n");}

const aiSystem=()=>FR()?`Tu es un conseiller expert du jeu de survie ICARUS (RocketWerkz), intégré au « Bestiaire d'Icarus ». Tu réponds en français, en tutoyant le joueur.
Tu reçois ci-dessous les données exactes de sa sauvegarde : niveau, points libres, talents et techs débloqués, ce qui est disponible maintenant, l'atelier orbital et l'équipement porté.
Règles :
- Appuie-toi sur ces données. Quand tu recommandes un talent ou une tech, reprends son nom exact tel qu'il apparaît dans les listes « disponibles », et ne propose pas ce qui est déjà débloqué.
- Tiens compte des points libres : propose un ordre de priorité réaliste avec ce qu'il peut dépenser maintenant, puis la suite.
- Pour l'équipement, dis ce qui est faible ou usé, par quoi le remplacer et quelle tech débloquer pour le fabriquer.
- Si une donnée manque (fichier non chargé), dis-le en une phrase et conseille quand même avec ce que tu as.
- Sois concret et court : titres ###, listes à puces, une raison brève par recommandation. Pas de blabla d'introduction.`
:`You are an expert advisor for the survival game ICARUS (RocketWerkz), built into the "Icarus Bestiary" app. Answer in English.
Below is the exact data from the player's save: level, free points, unlocked talents and tech, what's available now, the orbital workshop and the gear they wear.
Rules:
- Base your advice on this data. When you recommend a talent or tech, use its exact name as it appears in the "available" lists, and don't suggest what's already unlocked.
- Account for free points: give a realistic priority order for what they can spend now, then what comes next.
- For gear, say what's weak or worn, what to replace it with and which tech to unlock to craft it.
- If some data is missing (file not loaded), say so in one sentence and still advise with what you have.
- Be concrete and short: ### headings, bullet lists, a brief reason per recommendation. No introductory filler.`;

const AI_ASKS=()=>FR()?[
 ["🧭","Bilan complet","Fais un bilan complet de mon personnage : mes points forts, mes faiblesses, et mes 5 priorités pour progresser."],
 ["🛡️","Mon équipement","Qu'est-ce que je dois améliorer dans mon équipement (armure, armes, outils, sac, modules) ? Dis-moi quoi fabriquer et quelle tech débloquer pour ça."],
 ["⭐","Talents à prendre","Quels talents je dois prendre avec mes points libres, dans quel ordre, et pourquoi ?"],
 ["🔧","Arbre tech","Dans l'arbre tech, quoi débloquer en priorité avec mes points libres ? Donne un ordre clair."]]
:[["🧭","Full review","Give a full review of my character: strengths, weaknesses, and my top 5 priorities to progress."],
 ["🛡️","My gear","What should I improve in my gear (armor, weapons, tools, backpack, modules)? Tell me what to craft and which tech to unlock for it."],
 ["⭐","Talents to take","Which talents should I take with my free points, in what order, and why?"],
 ["🔧","Tech tree","In the tech tree, what should I unlock first with my free points? Give a clear order."]];

/* ---------- Affichage du texte de l'IA (Markdown simple, échappé) ---------- */
function aiMd(src){const inl=s=>esc(s).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<i>$2</i>");
  let h="",list=null;const close=()=>{if(list){h+=`</${list}>`;list=null;}};
  for(const raw of String(src).split("\n")){const l=raw.trimEnd();let m;
    if(!l.trim()){close();continue;}
    if((m=l.match(/^#{1,2}\s+(.*)/))){close();h+=`<h3>${inl(m[1])}</h3>`;continue;}
    if((m=l.match(/^#{3,6}\s+(.*)/))){close();h+=`<h4>${inl(m[1])}</h4>`;continue;}
    if((m=l.match(/^\s*[-*•]\s+(.*)/))){if(list!=="ul"){close();h+="<ul>";list="ul";}h+=`<li>${inl(m[1])}</li>`;continue;}
    if((m=l.match(/^\s*\d+[.)]\s+(.*)/))){if(list!=="ol"){close();h+="<ol>";list="ol";}h+=`<li>${inl(m[1])}</li>`;continue;}
    close();h+=`<p>${inl(l)}</p>`;}
  close();return h;}

/* ---------- Appel à Claude ---------- */
async function aiAsk(text){const fr=FR(),key=aiKeyGet();if(AI.busy||!text.trim())return;
  if(!key){document.getElementById("aiKeyIn")?.focus();return;}
  AI.busy=true;const thread=document.getElementById("aiThread");
  AI.history.push({role:"user",content:text});aiDrawThread();
  const box=document.createElement("div");box.className="aimsg a";box.innerHTML=`<span class="exs aidots">${fr?"Je lis ta sauvegarde et je réfléchis":"Reading your save and thinking"}</span>`;thread.appendChild(box);box.scrollIntoView({block:"nearest"});
  aiSetBusy(true);let acc="";
  try{if(!AI.profile)AI.profile=await aiBuildProfile();
    if(!AI.sdk)AI.sdk=await import(AI_SDK);const Anthropic=AI.sdk.default;
    const client=new Anthropic({apiKey:key,dangerouslyAllowBrowser:true});
    const stream=client.beta.messages.stream({model:AI_MODEL,max_tokens:16000,
      betas:["server-side-fallback-2026-07-01"],fallbacks:"default",
      output_config:{effort:"medium"},
      system:[{type:"text",text:aiSystem()},{type:"text",text:AI.profile,cache_control:{type:"ephemeral"}}],
      messages:AI.history});
    AI.stop=()=>stream.abort();
    for await(const ev of stream){if(ev.type==="content_block_delta"&&ev.delta.type==="text_delta"){acc+=ev.delta.text;box.innerHTML=aiMd(acc);}}
    const msg=await stream.finalMessage();
    if(msg.stop_reason==="refusal"){box.classList.add("err");box.innerHTML=(acc?aiMd(acc):"")+`<p>${fr?"L'IA a refusé de répondre à cette demande. Reformule-la.":"The AI declined this request. Try rephrasing it."}</p>`;AI.history.pop();}
    else{if(msg.stop_reason==="max_tokens")box.innerHTML+=`<p class="exs">${fr?"(réponse coupée : trop longue)":"(answer cut: too long)"}</p>`;
      AI.history.push({role:"assistant",content:msg.content.filter(b=>b.type!=="fallback")});}}
  catch(e){const A=AI.sdk&&AI.sdk.default;let m;
    if(A&&e instanceof A.APIUserAbortError){m=fr?"Réponse arrêtée.":"Answer stopped.";if(acc)AI.history.push({role:"assistant",content:acc});else AI.history.pop();}
    else{AI.history.pop();
      if(A&&e instanceof A.AuthenticationError)m=fr?"Clé API refusée : vérifie-la ou crée-en une nouvelle.":"API key rejected: check it or create a new one.";
      else if(A&&e instanceof A.PermissionDeniedError)m=fr?"Cette clé n'a pas accès à ce modèle.":"This key doesn't have access to this model.";
      else if(A&&e instanceof A.RateLimitError)m=fr?"Trop de demandes ou crédit épuisé : réessaie dans un moment, ou vérifie ton solde sur la console Anthropic.":"Too many requests or no credit left: try again shortly, or check your balance in the Anthropic console.";
      else if(A&&e instanceof A.APIConnectionError)m=fr?"Impossible de joindre l'IA : vérifie ta connexion.":"Can't reach the AI: check your connection.";
      else if(A&&e instanceof A.APIError)m=(fr?"Erreur de l'IA : ":"AI error: ")+(e.message||e.status);
      else m=(fr?"Erreur : ":"Error: ")+e.message;}
    box.classList.toggle("err",!/arrêtée|stopped/.test(m));box.innerHTML=(acc?aiMd(acc):"")+`<p>${esc(m)}</p>`;}
  finally{AI.busy=false;AI.stop=null;aiSetBusy(false);}}
function aiSetBusy(on){document.querySelectorAll(".aiask,#aiSend").forEach(b=>b.disabled=on);const s=document.getElementById("aiStop");if(s)s.hidden=!on;}
function aiDrawThread(){const t=document.getElementById("aiThread");if(!t)return;
  t.innerHTML=AI.history.map(m=>m.role==="user"?`<div class="aimsg u">${esc(m.content)}</div>`:`<div class="aimsg a">${aiMd(typeof m.content==="string"?m.content:m.content.filter(b=>b.type==="text").map(b=>b.text).join("\n"))}</div>`).join("");}

/* ---------- Vue ---------- */
function renderConseil(){const fr=FR(),key=aiKeyGet(),c=svChar(),pros=Object.keys(SV.prospects),canDir=typeof window.showDirectoryPicker==="function";
  const st=(ok,label)=>`<span class="tstat ${ok?"aiok":"aino"}">${ok?"✓":"○"} ${label}</span>`;
  if(AI.pros&&!SV.prospects[AI.pros])AI.pros="";
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${fr?"Conseiller IA":"AI advisor"}</h1>
    <p>${fr?"L'IA lit ta sauvegarde (niveau, talents, techs, atelier, équipement porté) et te dit quoi améliorer, quels talents prendre et quoi débloquer dans l'arbre tech.":"The AI reads your save (level, talents, tech, workshop, worn gear) and tells you what to improve, which talents to take and what to unlock in the tech tree."}</p></div>
    <div class="stats"><h3>${fr?"Comment ça marche":"How it works"}</h3><div class="hunt">${fr?"1. Charge ton dossier de sauvegarde. 2. Colle ta clé API Claude. 3. Pose ta question.":"1. Load your save folder. 2. Paste your Claude API key. 3. Ask your question."}</div></div></section>
  <div class="aibox">
   <div class="aicard"><h3>1 · ${fr?"Ta sauvegarde":"Your save"}</h3>
    <div class="aistatus">${st(!!c,c?`${esc(c.CharacterName||"?")} · ${fr?"niv.":"lvl"} ${levelForXp(c.XP||0)}`:"Characters.json")}${st(!!SV.files.profile,"Profile.json")}${st(!!SV.files.meta,"MetaInventory.json")}${st(pros.length>0,pros.length?`${pros.length} ${fr?"prospection(s)":"prospect(s)"}`:(fr?"Prospection (équipement)":"Prospect (gear)"))}</div>
    ${SV.chars&&SV.chars.length>1?`<div class="seg" style="margin-top:8px">${SV.chars.map((ch,i)=>`<button type="button" data-aici="${i}" aria-pressed="${i===SV.ci}">${esc(ch.CharacterName||"#"+i)}</button>`).join("")}</div>`:""}
    ${pros.length>1?`<label class="svf" style="margin-top:8px">${fr?"Prospection pour l'équipement":"Prospect for gear"}<select id="aiPros">${pros.map(n=>`<option ${n===(AI.pros||pros[0])?"selected":""}>${esc(n)}</option>`).join("")}</select></label>`:""}
    <div class="svload" style="margin-top:10px">${canDir?`<button type="button" class="${c?"more":"primary"}" id="aiDir">${fr?"Ouvrir le dossier de sauvegarde":"Open the save folder"}</button>`:""}
     <label class="more svfile">${fr?"Choisir le dossier":"Pick the folder"}<input type="file" id="aiFolder" webkitdirectory directory multiple hidden></label>
     <label class="more svfile">${fr?"Ajouter des fichiers":"Add files"}<input type="file" id="aiFiles" accept=".json,application/json" multiple hidden></label></div>
    <p class="exs"><code class="path">%LOCALAPPDATA%\\Icarus\\Saved\\PlayerData\\&lt;SteamID&gt;</code> · ${fr?"les fichiers s'ajoutent à ceux déjà chargés (aussi ceux du Save Manager).":"files are added to the ones already loaded (Save Manager's too)."}</p>
    <p class="svmsg" id="svmsg" hidden></p></div>
   <div class="aicard"><h3>2 · ${fr?"Clé API Claude":"Claude API key"}</h3>
    ${key?`<div class="aikey"><span class="tstat aiok">✓ ${fr?"Clé enregistrée sur cet appareil":"Key saved on this device"} (…${esc(key.slice(-4))})</span><button type="button" class="more" id="aiKeyDel">${fr?"Effacer la clé":"Delete the key"}</button></div>`
    :`<form class="aikey" id="aiKeyForm"><input id="aiKeyIn" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" aria-label="${fr?"Clé API Claude":"Claude API key"}"><button type="submit" class="primary">${fr?"Enregistrer":"Save"}</button></form>
     <p class="exs">${fr?"Crée ta clé sur":"Create your key at"} <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>${fr?" (payant à l'usage, quelques centimes par question).":" (pay as you go, a few cents per question)."}</p>`}
    <p class="exs">${fr?"La clé reste dans ce navigateur et n'est envoyée qu'à Anthropic. Tes données de sauvegarde sont envoyées à Claude seulement quand tu poses une question.":"The key stays in this browser and is only sent to Anthropic. Your save data is sent to Claude only when you ask a question."}</p></div>
   <div class="aicard"><h3>3 · ${fr?"Demande conseil":"Ask for advice"}</h3>
    <div class="aiasks">${AI_ASKS().map(([e,l,q],i)=>`<button type="button" class="aiask" data-aiq="${i}"><span aria-hidden="true">${e}</span>${esc(l)}</button>`).join("")}</div>
    <div class="aithread" id="aiThread" aria-live="polite" style="margin-top:12px"></div>
    <form class="aiform" id="aiForm" style="margin-top:10px"><textarea id="aiIn" rows="2" placeholder="${fr?"Pose ta question… (ex. : je veux chasser les boss, quoi prendre ?)":"Ask your question… (e.g. I want to hunt bosses, what should I take?)"}"></textarea>
     <button type="submit" class="primary" id="aiSend">${fr?"Envoyer":"Send"}</button><button type="button" class="more" id="aiStop" hidden>${fr?"Arrêter":"Stop"}</button></form>
    ${AI.history.length?`<p><button type="button" class="linkbtn" id="aiNew">↺ ${fr?"Nouvelle conversation (relit la sauvegarde)":"New conversation (re-reads the save)"}</button></p>`:""}</div>
  </div>`;
  const v=document.getElementById("view");
  v.querySelector("#aiDir")?.addEventListener("click",svOpenDir);
  v.querySelector("#aiFolder").onchange=e=>svOpenFiles([...e.target.files]);
  v.querySelector("#aiFiles").onchange=e=>svOpenFiles([...e.target.files]);
  v.querySelectorAll("[data-aici]").forEach(b=>b.onclick=()=>{SV.ci=+b.dataset.aici;AI.profile=null;renderConseil();});
  v.querySelector("#aiPros")?.addEventListener("change",e=>{AI.pros=e.target.value;AI.profile=null;});
  v.querySelector("#aiKeyForm")?.addEventListener("submit",e=>{e.preventDefault();const k=v.querySelector("#aiKeyIn").value.trim();if(k){aiKeySet(k);renderConseil();}});
  v.querySelector("#aiKeyDel")?.addEventListener("click",()=>{aiKeySet("");renderConseil();});
  v.querySelectorAll("[data-aiq]").forEach(b=>b.onclick=()=>aiAsk(AI_ASKS()[+b.dataset.aiq][2]));
  const inp=v.querySelector("#aiIn");
  v.querySelector("#aiForm").onsubmit=e=>{e.preventDefault();const q=inp.value;inp.value="";aiAsk(q);};
  inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();v.querySelector("#aiForm").requestSubmit();}});
  v.querySelector("#aiStop").onclick=()=>AI.stop&&AI.stop();
  v.querySelector("#aiNew")?.addEventListener("click",()=>{AI.history=[];AI.profile=null;renderConseil();});
  aiDrawThread();aiSetBusy(AI.busy);}
// Un nouveau fichier chargé = profil à relire à la prochaine question
const _svAfterLoad=svAfterLoad;svAfterLoad=function(){AI.profile=null;return _svAfterLoad.apply(this,arguments);};
VIEWS.conseil=()=>renderConseil();
