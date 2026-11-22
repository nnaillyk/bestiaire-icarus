// Conseiller IA : lit la sauvegarde (personnage, talents, techs, atelier, inventaires) et demande conseil à une IA.
// Fournisseurs : Claude (Anthropic), Gemini (Google), ChatGPT (OpenAI) ou tout service compatible OpenAI (Mistral, OpenRouter, Groq, Ollama…).
// Les clés API restent sur l'appareil (localStorage) et ne sont envoyées qu'au fournisseur choisi.
const AI_KEY="icarus-ia-cle",AI_CFG_KEY="icarus-ia-config";
const AI_SDK="https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.6.0/+esm";
const AI_MODEL="claude-opus-5-5";
const AI={history:[],profile:null,busy:false,pros:"",sdk:null,stop:null,models:{},listing:false,listErr:""};
const AI_PROV={
 claude:{label:"Claude",logo:"✳️",keyUrl:"https://console.anthropic.com/settings/keys",keyHint:"sk-ant-…",price:["payant à l'usage, quelques centimes par question","pay as you go, a few cents per question"]},
 gemini:{label:"Gemini",logo:"✨",keyUrl:"https://aistudio.google.com/apikey",keyHint:"AIza…",price:["clé gratuite (avec une limite de questions par jour)","free key (with a daily question limit)"]},
 openai:{label:"ChatGPT",logo:"🤖",keyUrl:"https://platform.openai.com/api-keys",keyHint:"sk-…",price:["payant à l'usage","pay as you go"]},
 custom:{label:"Autre",labelEn:"Other",logo:"⚙️",keyUrl:"",keyHint:"",price:["selon le service","depends on the service"]}};
// Services compatibles OpenAI proposés pour « Autre »
const AI_PRESETS=[["OpenRouter","https://openrouter.ai/api/v1","https://openrouter.ai/keys"],["Mistral","https://api.mistral.ai/v1","https://console.mistral.ai/api-keys"],["Groq","https://api.groq.com/openai/v1","https://console.groq.com/keys"],["DeepSeek","https://api.deepseek.com/v1","https://platform.deepseek.com/api_keys"],["Ollama (PC)","http://localhost:11434/v1",""],["LM Studio (PC)","http://localhost:1234/v1",""]];
let AIC={prov:"claude",keys:{},models:{},base:AI_PRESETS[0][1]};
try{const s=JSON.parse(localStorage.getItem(AI_CFG_KEY)||"null");if(s&&typeof s==="object")AIC={...AIC,...s,keys:{...(s.keys||{})},models:{...(s.models||{})}};
  const old=localStorage.getItem(AI_KEY);if(old&&!AIC.keys.claude){AIC.keys.claude=old;localStorage.removeItem(AI_KEY);}}catch(e){}
if(!AI_PROV[AIC.prov])AIC.prov="claude";
const aiSave=()=>{try{localStorage.setItem(AI_CFG_KEY,JSON.stringify(AIC));}catch(e){}};
const aiKeyGet=(p=AIC.prov)=>AIC.keys[p]||"";
const aiKeySet=(v,p=AIC.prov)=>{if(v)AIC.keys[p]=v;else{delete AIC.keys[p];delete AIC.models[p];delete AI.models[p];}aiSave();};
const aiProvLabel=p=>FR()?AI_PROV[p].label:(AI_PROV[p].labelEn||AI_PROV[p].label);
const aiModel=(p=AIC.prov)=>AIC.models[p]||(p==="claude"?AI_MODEL:"");
// Prêt à poser une question : une clé (sauf service local) et un modèle connu
const aiReady=(p=AIC.prov)=>p==="custom"?!!(AIC.base&&aiModel(p)):!!(aiKeyGet(p)&&aiModel(p));
const aiCanList=(p=AIC.prov)=>p==="custom"?!!AIC.base&&(aiIsLocal()||!!aiKeyGet("custom")):!!aiKeyGet(p);
const aiIsLocal=()=>/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(AIC.base||"");

/* ---------- Modèles disponibles chez chaque fournisseur ---------- */
async function aiHttpError(res){let m="";try{const j=await res.json();m=j.error?.message||j.message||(Array.isArray(j)&&j[0]?.error?.message)||"";}catch(e){}
  const e=new Error(m||("HTTP "+res.status));e.status=res.status;return e;}
async function aiListModels(p){const k=aiKeyGet(p);let ids=[];
  if(p==="claude"){if(!AI.sdk)AI.sdk=await import(AI_SDK);const client=new AI.sdk.default({apiKey:k,dangerouslyAllowBrowser:true});for await(const m of client.models.list())ids.push(m.id);}
  else if(p==="gemini"){const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000",{headers:{"x-goog-api-key":k}});if(!r.ok)throw await aiHttpError(r);
    ids=((await r.json()).models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes("generateContent")).map(m=>m.name.replace(/^models\//,"")).filter(n=>/^gem/i.test(n)&&!/(embed|tts|image|audio|live|aqa)/i.test(n));}
  else{const base=p==="openai"?"https://api.openai.com/v1":AIC.base.replace(/\/+$/,"");const r=await fetch(base+"/models",{headers:k?{Authorization:"Bearer "+k}:{}});if(!r.ok)throw await aiHttpError(r);
    ids=((await r.json()).data||[]).map(m=>m.id);if(p==="openai")ids=ids.filter(n=>/^(gpt|o\d|chatgpt)/i.test(n)&&!/(audio|realtime|tts|transcribe|search|image|embedding|instruct)/i.test(n));}
  return [...new Set(ids)].sort();}
// Modèle choisi par défaut dans la liste : le plus récent de la gamme principale
const aiVer=s=>{const m=s.match(/(\d+(?:\.\d+)?)/);return m?parseFloat(m[1]):0;};
function aiDefaultModel(p,ids){if(!ids.length)return "";
  const pick=(re,pref)=>{const c=ids.filter(n=>re.test(n));if(!c.length)return "";c.sort((a,b)=>aiVer(b)-aiVer(a)||(pref&&pref.test(b)?1:0)-(pref&&pref.test(a)?1:0));return c[0];};
  if(p==="claude")return ids.includes(AI_MODEL)?AI_MODEL:pick(/^claude-opus/)||ids[0];
  if(p==="gemini")return pick(/^gemini-[\d.]+-flash$/)||pick(/^gemini-[\d.]+-pro$/)||pick(/flash/)||ids[0];
  if(p==="openai")return pick(/^gpt-[\d.]+$/)||pick(/^gpt-[\d.]+o?$/)||pick(/^gpt/)||ids[0];
  return ids[0];}
async function aiRefreshModels(p=AIC.prov){if(p!=="custom"&&!aiKeyGet(p))return;AI.listing=true;AI.listErr="";aiDrawProv();
  try{const ids=await aiListModels(p);AI.models[p]=ids;if(!AIC.models[p]||!ids.includes(AIC.models[p]))AIC.models[p]=aiDefaultModel(p,ids);aiSave();}
  catch(e){AI.listErr=aiErrText(e,p);}
  finally{AI.listing=false;aiDrawProv();}}

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

/* ---------- Appel à l'IA choisie (réponse affichée au fur et à mesure) ---------- */
// Lecture d'un flux « server-sent events » (Gemini, OpenAI et compatibles)
async function* aiSse(res){const rd=res.body.getReader(),dec=new TextDecoder();let buf="";
  for(;;){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let m;
    while((m=buf.match(/\r?\n\r?\n/))){const chunk=buf.slice(0,m.index);buf=buf.slice(m.index+m[0].length);
      const data=chunk.split(/\r?\n/).filter(l=>l.startsWith("data:")).map(l=>l.slice(5).trimStart()).join("\n");if(data)yield data;}}}
const aiText=m=>typeof m.content==="string"?m.content:"";
async function aiStreamClaude(sys,onText,ctl){if(!AI.sdk)AI.sdk=await import(AI_SDK);
  const client=new AI.sdk.default({apiKey:aiKeyGet("claude"),dangerouslyAllowBrowser:true});
  const stream=client.beta.messages.stream({model:aiModel("claude"),max_tokens:16000,
    betas:["server-side-fallback-2026-07-01"],fallbacks:"default",output_config:{effort:"medium"},
    system:[{type:"text",text:sys.rules},{type:"text",text:sys.profile,cache_control:{type:"ephemeral"}}],
    messages:AI.history.map(m=>({role:m.role,content:m.raw||aiText(m)}))},{signal:ctl.signal});
  for await(const ev of stream)if(ev.type==="content_block_delta"&&ev.delta.type==="text_delta")onText(ev.delta.text);
  const msg=await stream.finalMessage();
  return {stop:msg.stop_reason==="refusal"?"refusal":msg.stop_reason==="max_tokens"?"length":"end",raw:msg.content.filter(b=>b.type!=="fallback")};}
async function aiStreamGemini(sys,onText,ctl){
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(aiModel("gemini"))}:streamGenerateContent?alt=sse`,{method:"POST",signal:ctl.signal,
    headers:{"Content-Type":"application/json","x-goog-api-key":aiKeyGet("gemini")},
    body:JSON.stringify({systemInstruction:{parts:[{text:sys.rules+"\n\n"+sys.profile}]},contents:AI.history.map(m=>({role:m.role==="assistant"?"model":"user",parts:[{text:aiText(m)}]}))})});
  if(!res.ok)throw await aiHttpError(res);let stop="end";
  for await(const d of aiSse(res)){let j;try{j=JSON.parse(d);}catch(e){continue;}
    if(j.promptFeedback?.blockReason)stop="refusal";const c=j.candidates?.[0];if(!c)continue;
    for(const p of c.content?.parts||[])if(p.text&&!p.thought)onText(p.text);
    if(c.finishReason==="MAX_TOKENS")stop="length";else if(/SAFETY|PROHIBITED|BLOCKLIST|RECITATION/.test(c.finishReason||""))stop="refusal";}
  return {stop};}
async function aiStreamOpenAI(sys,onText,ctl,p){const base=p==="openai"?"https://api.openai.com/v1":AIC.base.replace(/\/+$/,""),k=aiKeyGet(p);
  const res=await fetch(base+"/chat/completions",{method:"POST",signal:ctl.signal,
    headers:{"Content-Type":"application/json",...(k?{Authorization:"Bearer "+k}:{})},
    body:JSON.stringify({model:aiModel(p),stream:true,messages:[{role:"system",content:sys.rules+"\n\n"+sys.profile},...AI.history.map(m=>({role:m.role,content:aiText(m)}))]})});
  if(!res.ok)throw await aiHttpError(res);let stop="end";
  for await(const d of aiSse(res)){if(d==="[DONE]")break;let j;try{j=JSON.parse(d);}catch(e){continue;}
    if(j.error)throw Object.assign(new Error(j.error.message||"error"),{status:j.error.code});
    const c=j.choices?.[0];if(!c)continue;if(c.delta?.content)onText(c.delta.content);
    if(c.finish_reason==="length")stop="length";else if(c.finish_reason==="content_filter")stop="refusal";}
  return {stop};}
// Message d'erreur lisible, quel que soit le fournisseur
function aiErrText(e,p=AIC.prov){const fr=FR(),A=AI.sdk&&AI.sdk.default,st=e&&(e.status||e.statusCode),name=aiProvLabel(p);
  if(e&&(e.name==="AbortError"||(A&&e instanceof A.APIUserAbortError)))return fr?"Réponse arrêtée.":"Answer stopped.";
  if(st===401||(A&&e instanceof A.AuthenticationError)||(st===400&&/api key|API_KEY/i.test(e.message)))return fr?`Clé ${name} refusée : vérifie-la ou crée-en une nouvelle.`:`${name} key rejected: check it or create a new one.`;
  if(st===403||(A&&e instanceof A.PermissionDeniedError))return fr?`Cette clé ${name} n'a pas accès à ce modèle. Choisis-en un autre.`:`This ${name} key can't use this model. Pick another one.`;
  if(st===404)return fr?"Modèle introuvable chez ce fournisseur : choisis-en un autre dans la liste.":"Model not found at this provider: pick another one from the list.";
  if(st===429||(A&&e instanceof A.RateLimitError))return fr?`Limite atteinte chez ${name} (trop de questions ou crédit épuisé). Réessaie plus tard ou vérifie ton compte.`:`Limit reached at ${name} (too many questions or no credit left). Try later or check your account.`;
  if(e instanceof TypeError||(A&&e instanceof A.APIConnectionError))return p==="custom"&&aiIsLocal()?(fr?"Impossible de joindre le service sur ton PC. Vérifie qu'il est lancé et qu'il accepte ce site (Ollama : variable OLLAMA_ORIGINS=* puis redémarrer Ollama).":"Can't reach the service on your PC. Check it's running and allows this site (Ollama: set OLLAMA_ORIGINS=* then restart Ollama)."):(fr?"Impossible de joindre l'IA : vérifie ta connexion, ou ce service n'accepte pas les appels depuis un site web.":"Can't reach the AI: check your connection, or this service doesn't accept calls from a website.");
  return (fr?"Erreur de l'IA : ":"AI error: ")+(e&&e.message||st||"?");}
async function aiAsk(text){const fr=FR(),p=AIC.prov;if(AI.busy||!text.trim())return;
  if(!aiReady(p)){const f=document.getElementById("aiKeyIn")||document.getElementById("aiModelSel")||document.getElementById("aiModelIn");f?.focus();
    const n=document.getElementById("aiProvMsg");if(n){n.hidden=false;n.textContent=fr?"Connecte d'abord une IA ci-dessus (clé et modèle).":"Connect an AI above first (key and model).";}return;}
  AI.busy=true;const thread=document.getElementById("aiThread");
  AI.history.push({role:"user",content:text});aiDrawThread();
  const box=document.createElement("div");box.className="aimsg a";box.innerHTML=`<span class="exs aidots">${fr?`${esc(aiProvLabel(p))} lit ta sauvegarde et réfléchit`:`${esc(aiProvLabel(p))} is reading your save and thinking`}</span>`;thread.appendChild(box);box.scrollIntoView({block:"nearest"});
  aiSetBusy(true);let acc="";const ctl=new AbortController();AI.stop=()=>ctl.abort();
  const sign=`<p class="exs aisign">— ${esc(aiProvLabel(p))} · ${esc(aiModel(p))}</p>`;
  try{if(!AI.profile)AI.profile=await aiBuildProfile();
    const sys={rules:aiSystem(),profile:AI.profile},onText=t=>{acc+=t;box.innerHTML=aiMd(acc);};
    const r=p==="claude"?await aiStreamClaude(sys,onText,ctl):p==="gemini"?await aiStreamGemini(sys,onText,ctl):await aiStreamOpenAI(sys,onText,ctl,p);
    if(r.stop==="refusal"){box.classList.add("err");box.innerHTML=(acc?aiMd(acc):"")+`<p>${fr?"L'IA a refusé de répondre à cette demande. Reformule-la.":"The AI declined this request. Try rephrasing it."}</p>`;AI.history.pop();}
    else if(!acc.trim()){box.classList.add("err");box.innerHTML=`<p>${fr?"L'IA n'a rien répondu. Réessaie ou change de modèle.":"The AI gave no answer. Try again or switch models."}</p>`;AI.history.pop();}
    else{box.innerHTML=aiMd(acc)+(r.stop==="length"?`<p class="exs">${fr?"(réponse coupée : trop longue)":"(answer cut: too long)"}</p>`:"")+sign;
      AI.history.push({role:"assistant",content:acc,prov:p,model:aiModel(p),...(r.raw?{raw:r.raw}:{})});}}
  catch(e){const m=aiErrText(e,p),stopped=e&&(e.name==="AbortError"||/arrêtée|stopped/.test(m));
    if(stopped&&acc)AI.history.push({role:"assistant",content:acc,prov:p,model:aiModel(p)});else AI.history.pop();
    box.classList.toggle("err",!stopped);box.innerHTML=(acc?aiMd(acc):"")+`<p>${esc(m)}</p>`;}
  finally{AI.busy=false;AI.stop=null;aiSetBusy(false);}}
function aiSetBusy(on){document.querySelectorAll(".aiask,#aiSend").forEach(b=>b.disabled=on);const s=document.getElementById("aiStop");if(s)s.hidden=!on;}
function aiDrawThread(){const t=document.getElementById("aiThread");if(!t)return;
  t.innerHTML=AI.history.map(m=>m.role==="user"?`<div class="aimsg u">${esc(m.content)}</div>`:`<div class="aimsg a">${aiMd(aiText(m))}${m.prov?`<p class="exs aisign">— ${esc(aiProvLabel(m.prov))} · ${esc(m.model||"")}</p>`:""}</div>`).join("");}

/* ---------- Vue ---------- */
function renderConseil(){const fr=FR(),key=aiKeyGet(),c=svChar(),pros=Object.keys(SV.prospects),canDir=typeof window.showDirectoryPicker==="function";
  const st=(ok,label)=>`<span class="tstat ${ok?"aiok":"aino"}">${ok?"✓":"○"} ${label}</span>`;
  if(AI.pros&&!SV.prospects[AI.pros])AI.pros="";
  document.getElementById("view").innerHTML=`
  <section class="hero"><div><h1>${fr?"Conseiller IA":"AI advisor"}</h1>
    <p>${fr?"L'IA lit ta sauvegarde (niveau, talents, techs, atelier, équipement porté) et te dit quoi améliorer, quels talents prendre et quoi débloquer dans l'arbre tech.":"The AI reads your save (level, talents, tech, workshop, worn gear) and tells you what to improve, which talents to take and what to unlock in the tech tree."}</p></div>
    <div class="stats"><h3>${fr?"Comment ça marche":"How it works"}</h3><div class="hunt">${fr?"1. Charge ton dossier de sauvegarde. 2. Connecte Claude, Gemini, ChatGPT ou une autre IA. 3. Pose ta question.":"1. Load your save folder. 2. Connect Claude, Gemini, ChatGPT or another AI. 3. Ask your question."}</div></div></section>
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
   <div class="aicard"><h3>2 · ${fr?"Connecte ton IA":"Connect your AI"}</h3><div id="aiProv"></div></div>
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
  aiDrawProv();
  if(!AI.models[AIC.prov]&&aiCanList()&&!AI.listing)aiRefreshModels();
  v.querySelectorAll("[data-aiq]").forEach(b=>b.onclick=()=>aiAsk(AI_ASKS()[+b.dataset.aiq][2]));
  const inp=v.querySelector("#aiIn");
  v.querySelector("#aiForm").onsubmit=e=>{e.preventDefault();const q=inp.value;inp.value="";aiAsk(q);};
  inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();v.querySelector("#aiForm").requestSubmit();}});
  v.querySelector("#aiStop").onclick=()=>AI.stop&&AI.stop();
  v.querySelector("#aiNew")?.addEventListener("click",()=>{AI.history=[];AI.profile=null;renderConseil();});
  aiDrawThread();aiSetBusy(AI.busy);}
// Carte « Connecte ton IA » : fournisseur, clé, modèle (redessinée seule, sans toucher à la conversation)
function aiDrawProv(){const box=document.getElementById("aiProv");if(!box)return;const fr=FR(),p=AIC.prov,P=AI_PROV[p],key=aiKeyGet(p),ids=AI.models[p]||[],cur=aiModel(p);
  const linkKey=url=>url?`<a href="${url}" target="_blank" rel="noopener">${esc(new URL(url).hostname)}</a>`:"";
  const preset=AI_PRESETS.find(x=>x[1]===AIC.base);
  box.innerHTML=`<div class="seg aiprovs" role="group" aria-label="${fr?"Fournisseur d'IA":"AI provider"}">${Object.keys(AI_PROV).map(k=>`<button type="button" data-aiprov="${k}" aria-pressed="${k===p}"><span aria-hidden="true">${AI_PROV[k].logo}</span> ${esc(aiProvLabel(k))}${aiReady(k)?` <span class="aiok" aria-label="${fr?"connecté":"connected"}">●</span>`:""}</button>`).join("")}</div>
   ${p==="custom"?`<div class="aipresets"><span class="exs">${fr?"Service :":"Service:"}</span>${AI_PRESETS.map(x=>`<button type="button" class="chip" data-aipre="${esc(x[1])}" aria-pressed="${AIC.base===x[1]}"><span>${esc(x[0])}</span></button>`).join("")}</div>
     <label class="svf aiwide">${fr?"Adresse de l'API (compatible OpenAI)":"API address (OpenAI-compatible)"}<input id="aiBase" value="${esc(AIC.base||"")}" placeholder="https://…/v1" spellcheck="false"></label>`:""}
   ${key?`<div class="aikey"><span class="tstat aiok">✓ ${fr?`Clé ${esc(aiProvLabel(p))} enregistrée`:`${esc(aiProvLabel(p))} key saved`} (…${esc(key.slice(-4))})</span><button type="button" class="more" id="aiKeyDel">${fr?"Effacer la clé":"Delete the key"}</button></div>`
   :`<form class="aikey" id="aiKeyForm"><input id="aiKeyIn" type="password" autocomplete="off" spellcheck="false" placeholder="${esc(P.keyHint||(fr?"Clé API (vide pour un service local)":"API key (empty for a local service)"))}" aria-label="${fr?"Clé API":"API key"} ${esc(aiProvLabel(p))}"><button type="submit" class="primary">${fr?"Connecter":"Connect"}</button></form>`}
   ${(key||p==="custom")?`<div class="aikey aimodel"><label class="svf aiwide">${fr?"Modèle":"Model"}${ids.length?`<select id="aiModelSel">${(cur&&!ids.includes(cur)?[cur,...ids]:ids).map(m=>`<option ${m===cur?"selected":""}>${esc(m)}</option>`).join("")}</select>`:`<input id="aiModelIn" value="${esc(cur)}" placeholder="${fr?"nom du modèle":"model name"}" spellcheck="false">`}</label>
     <button type="button" class="more" id="aiModelRef" ${AI.listing?"disabled":""}>${AI.listing?(fr?"Chargement…":"Loading…"):(fr?"Charger la liste":"Load the list")}</button></div>`:""}
   ${AI.listErr?`<p class="exs aiwarn">${esc(AI.listErr)}</p>`:""}
   <p class="exs" id="aiProvMsg" hidden></p>
   <p class="exs">${p==="custom"?(fr?`Marche avec tout service compatible OpenAI. ${preset&&preset[2]?`Clé : ${linkKey(preset[2])}.`:""} ${aiIsLocal()?"Pour Ollama sur ton PC : lance-le avec la variable OLLAMA_ORIGINS=* pour que ce site puisse lui parler.":""}`:`Works with any OpenAI-compatible service. ${preset&&preset[2]?`Key: ${linkKey(preset[2])}.`:""} ${aiIsLocal()?"For Ollama on your PC: start it with OLLAMA_ORIGINS=* so this site can talk to it.":""}`)
     :`${fr?"Crée ta clé sur":"Create your key at"} ${linkKey(P.keyUrl)} (${P.price[fr?0:1]}).`}</p>
   <p class="exs">${fr?"Les abonnements (ChatGPT Plus, Claude Pro, Gemini Advanced) ne marchent pas ici : il faut une clé API, créée gratuitement sur le site du fournisseur. Les clés restent dans ce navigateur et ne sont envoyées qu'au fournisseur choisi ; ta sauvegarde n'est envoyée que quand tu poses une question.":"Subscriptions (ChatGPT Plus, Claude Pro, Gemini Advanced) don't work here: you need an API key, created for free on the provider's site. Keys stay in this browser and are only sent to the chosen provider; your save is sent only when you ask a question."}</p>`;
  box.querySelectorAll("[data-aiprov]").forEach(b=>b.onclick=()=>{AIC.prov=b.dataset.aiprov;AI.listErr="";aiSave();aiDrawProv();if(!AI.models[AIC.prov]&&aiCanList()&&!AI.listing)aiRefreshModels();});
  box.querySelectorAll("[data-aipre]").forEach(b=>b.onclick=()=>{AIC.base=b.dataset.aipre;delete AIC.models.custom;delete AI.models.custom;AI.listErr="";aiSave();aiDrawProv();if(aiIsLocal()||aiKeyGet("custom"))aiRefreshModels("custom");});
  box.querySelector("#aiBase")?.addEventListener("change",e=>{AIC.base=e.target.value.trim();delete AIC.models.custom;delete AI.models.custom;aiSave();aiDrawProv();});
  box.querySelector("#aiKeyForm")?.addEventListener("submit",e=>{e.preventDefault();const k=box.querySelector("#aiKeyIn").value.trim();if(!k&&p!=="custom")return;if(k)aiKeySet(k,p);aiRefreshModels(p);});
  box.querySelector("#aiKeyDel")?.addEventListener("click",()=>{aiKeySet("",p);AI.listErr="";aiDrawProv();});
  box.querySelector("#aiModelSel")?.addEventListener("change",e=>{AIC.models[p]=e.target.value;aiSave();});
  box.querySelector("#aiModelIn")?.addEventListener("change",e=>{AIC.models[p]=e.target.value.trim();aiSave();aiDrawProv();});
  box.querySelector("#aiModelRef")?.addEventListener("click",()=>aiRefreshModels(p));}
// Un nouveau fichier chargé = profil à relire à la prochaine question
const _svAfterLoad=svAfterLoad;svAfterLoad=function(){AI.profile=null;return _svAfterLoad.apply(this,arguments);};
VIEWS.conseil=()=>renderConseil();
