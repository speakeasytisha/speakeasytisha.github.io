/* SpeakEasyTisha — Hossegor Trip Review Quest (A1+) v2
Build: 20260514-151243
*/
(() => {
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const DEBUG = $("#debugBox");
  const log=(m)=>{ try{DEBUG.classList.remove("hidden"); DEBUG.textContent += "\n"+m;}catch(e){} };
  window.addEventListener("error",(e)=>log("[Error] "+e.message+" @ "+e.filename+":"+e.lineno));

  const esc=(s)=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const norm=(s)=>String(s??"").replace(/[’]/g,"'").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim().toLowerCase();
  const shuffle=(a)=>{a=(a||[]).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
  const tap=(el, fn)=>{ if(!el) return; let last=0; const h=(e)=>{const now=Date.now(); if(now-last<320) return; last=now; try{fn(e);}catch(err){console.error(err); log(String(err));}}; 
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h);} else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };

  // TTS
  const KEYS={lang:"hossegor2_tts_lang", voice:"hossegor2_tts_voice", auto:"hossegor2_auto"};
  const TTS={
    lang: localStorage.getItem(KEYS.lang)||"en-US",
    voiceName: localStorage.getItem(KEYS.voice)||"",
    auto: (localStorage.getItem(KEYS.auto)==="1"),
    voices: [],
    async loadVoices(){
      if(!window.speechSynthesis) return [];
      const got=window.speechSynthesis.getVoices()||[];
      if(got.length){this.voices=got; return got;}
      return await new Promise((resolve)=>{
        window.speechSynthesis.onvoiceschanged=()=>{this.voices=window.speechSynthesis.getVoices()||[]; resolve(this.voices);};
        setTimeout(()=>resolve(this.voices),900);
      });
    },
    pick(){
      const v=this.voices.length?this.voices:(window.speechSynthesis?.getVoices?.()||[]);
      if(this.voiceName){ const by=v.find(x=>x.name===this.voiceName); if(by) return by; }
      const lang=(this.lang||"en-US").toLowerCase();
      let best=v.find(x=>(x.lang||"").toLowerCase()===lang);
      if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith(lang));
      if(!best) best=v.find(x=>(x.lang||"").toLowerCase().startsWith("en"));
      return best||null;
    },
    setLang(l){ this.lang=l; localStorage.setItem(KEYS.lang,l); },
    setVoiceName(n){ this.voiceName=n||""; localStorage.setItem(KEYS.voice,this.voiceName); },
    setAuto(on){ this.auto=!!on; localStorage.setItem(KEYS.auto,this.auto?"1":"0"); },
    stop(){ try{window.speechSynthesis.cancel();}catch(e){} },
    say(t){
      if(!window.speechSynthesis) return;
      try{window.speechSynthesis.cancel();}catch(e){}
      const u=new SpeechSynthesisUtterance(String(t||""));
      u.lang=this.lang||"en-US";
      const v=this.pick(); if(v) u.voice=v;
      u.rate=0.97; u.pitch=1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const Score={now:0,max:0,awarded:new Set(),
    setMax(n){this.max=n; updScore();},
    award(k,pts=1){ if(this.awarded.has(k)) return; this.awarded.add(k); this.now+=pts; updScore(); },
    reset(){ this.now=0; this.awarded.clear(); updScore(); }
  };
  function updScore(){
    $("#scoreNow").textContent=String(Score.now);
    $("#scoreMax").textContent=String(Score.max);
    const pct=Score.max?Math.round((Score.now/Score.max)*100):0;
    $("#progressBar").style.width=Math.max(0,Math.min(100,pct))+"%";
  }

  // Data
  const VOCAB=[{"cat": "Hossegor Trip", "icon": "🏖️", "w": "beach", "fr": "plage", "def": "a sandy place by the sea", "ex": "We walked on the beach."}, {"cat": "Hossegor Trip", "icon": "🏄", "w": "surf", "fr": "surf", "def": "a sport on waves", "ex": "We surfed in the morning."}, {"cat": "Hossegor Trip", "icon": "🛍️", "w": "market", "fr": "marché", "def": "a place to buy food and products", "ex": "We visited the market."}, {"cat": "Hossegor Trip", "icon": "☀️", "w": "sunny", "fr": "ensoleillé", "def": "with a lot of sun", "ex": "It was sunny."}, {"cat": "Hossegor Trip", "icon": "🌧️", "w": "rainy", "fr": "pluvieux", "def": "with rain", "ex": "It wasn’t rainy."}, {"cat": "Hotel", "icon": "🏨", "w": "reservation", "fr": "réservation", "def": "a booking", "ex": "I had a reservation under Karine Cormier."}, {"cat": "Hotel", "icon": "🏨", "w": "check‑in", "fr": "arrivée (hôtel)", "def": "when you arrive and get your room", "ex": "Check‑in was at 3 p.m."}, {"cat": "Hotel", "icon": "🏨", "w": "check‑out", "fr": "départ (hôtel)", "def": "when you leave and return the key", "ex": "Check‑out was at 11 a.m."}, {"cat": "Hotel", "icon": "🏨", "w": "clean", "fr": "propre", "def": "not dirty", "ex": "The room was clean."}, {"cat": "Hotel", "icon": "🏨", "w": "comfortable", "fr": "confortable", "def": "nice to sit or sleep in", "ex": "The bed was comfortable."}, {"cat": "Restaurant", "icon": "🍽️", "w": "menu", "fr": "menu", "def": "the list of food and drinks", "ex": "Could I have the menu, please?"}, {"cat": "Restaurant", "icon": "🍽️", "w": "bill / check", "fr": "addition", "def": "the paper with the total price", "ex": "Could I have the bill, please?"}, {"cat": "Restaurant", "icon": "💧", "w": "bottled water", "fr": "eau en bouteille", "def": "water in a bottle", "ex": "Is bottled water included or extra?"}, {"cat": "Connectors", "icon": "🔗", "w": "first / then / after that / finally", "fr": "d'abord / puis / après / finalement", "def": "sequence words", "ex": "First, we checked in. Then, we went to the beach."}, {"cat": "Connectors", "icon": "🔗", "w": "because / so / however", "fr": "parce que / donc / cependant", "def": "link ideas (reason, result, contrast)", "ex": "It was great because the weather was sunny. However, the room was noisy."}, {"cat": "Past simple (regular)", "icon": "✅", "w": "stay → stayed", "fr": "rester / séjourner", "def": "to live for a short time in a place", "ex": "We stayed in Hossegor."}, {"cat": "Past simple (regular)", "icon": "✅", "w": "visit → visited", "fr": "visiter", "def": "to go to see a place", "ex": "We visited the town center."}, {"cat": "Past simple (regular)", "icon": "✅", "w": "walk → walked", "fr": "marcher", "def": "to move on foot", "ex": "We walked near the lake."}, {"cat": "Past simple (regular)", "icon": "✅", "w": "book → booked", "fr": "réserver", "def": "to reserve something", "ex": "I booked a room."}, {"cat": "Past simple (regular)", "icon": "✅", "w": "ask → asked", "fr": "demander", "def": "to ask a question", "ex": "I asked for a quiet room."}, {"cat": "Past simple (regular)", "icon": "✅", "w": "enjoy → enjoyed", "fr": "profiter / apprécier", "def": "to like something", "ex": "We enjoyed the trip."}, {"cat": "Future plans", "icon": "🗓️", "w": "be going to", "fr": "aller (futur proche)", "def": "future plan", "ex": "I’m going to visit Spain / Brazil / Crete."}, {"cat": "Future plans", "icon": "🗓️", "w": "island", "fr": "île", "def": "land with sea around it", "ex": "Crete is an island."}];
  const GRAMMAR={"waswere": {"title": "Past with BE: was / were (A1+)", "rule": ["I / he / she / it → was", "you / we / they → were", "Negative: wasn’t / weren’t", "Question: Was it…? Were you…?"], "examples": ["The hotel was clean.", "We were happy.", "It wasn’t rainy.", "Were you in Hossegor?"], "note": "Use was/were to describe a situation in the past."}, "pastSimple": {"title": "Past simple (regular verbs) — form + examples", "rule": ["Affirmative: subject + verb‑ed (visited, walked, booked)", "Negative: subject + didn’t + base verb (didn’t visit / didn’t walk)", "Question: Did + subject + base verb…? (Did you visit…?)", "Important: after did / didn’t → base verb (NOT visited)"], "examples": ["We visited the market.", "We didn’t visit the museum.", "Did you visit the market?", "I booked a room. I didn’t book a hostel."], "note": "Today we practise regular verbs only."}, "goingto": {"title": "Future plans: be going to (starter)", "rule": ["Affirmative: I’m going to + verb", "Negative: I’m not going to + verb", "Question: Are you going to + verb?"], "examples": ["I’m going to visit Spain this year.", "I’m not going to travel this month.", "Are you going to visit Brazil or Crete?"], "note": "Use going to for plans."}, "connectors": {"title": "Connectors (level up your review)", "rule": ["Sequence: First, Then, After that, Finally", "Reason: because", "Result: so", "Contrast: however / but"], "examples": ["First, we checked in. Then, we went to the beach.", "It was great because the weather was sunny.", "The hotel was clean; however, the room was noisy."], "note": "Connectors make your writing more natural."}};
  const MCQ=[{"id": "mcq1", "prompt": "Choose the correct sentence:", "choices": ["We was happy.", "We were happy.", "We are happy yesterday."], "ans": 1, "hint": "We → were."}, {"id": "mcq2", "prompt": "Choose the best past sentence:", "choices": ["We visit the market.", "We visited the market.", "We visiting the market."], "ans": 1, "hint": "Affirmative: visited."}, {"id": "mcq3", "prompt": "Choose the correct negative:", "choices": ["We didn't visited the market.", "We didn't visit the market.", "We don't visit the market."], "ans": 1, "hint": "didn't + base verb."}, {"id": "mcq4", "prompt": "Choose the correct question:", "choices": ["Did you visited the market?", "Did you visit the market?", "Do you visit the market?"], "ans": 1, "hint": "Did + base verb."}, {"id": "mcq5", "prompt": "Choose the best future plan:", "choices": ["I am going to visit Spain.", "I was going to visit Spain yesterday.", "I visit Spain tomorrow."], "ans": 0, "hint": "Going to + verb."}, {"id": "mcq6", "prompt": "Choose the best connector: It was great ___ the weather was sunny.", "choices": ["because", "however", "then"], "ans": 0, "hint": "Reason = because."}, {"id": "mcq7", "prompt": "Meaning: reservation", "choices": ["a booking", "a bathroom", "a ticket"], "ans": 0, "hint": "Reservation = booking."}, {"id": "mcq8", "prompt": "Meaning: comfortable", "choices": ["dirty", "nice to sleep in", "very expensive"], "ans": 1, "hint": "Comfortable = nice."}, {"id": "mcq9", "prompt": "Choose the correct: After did, we use…", "choices": ["base verb", "verb + ed", "verb + ing"], "ans": 0, "hint": "Did + base verb."}, {"id": "mcq10", "prompt": "Choose the correct: Crete is…", "choices": ["a country", "an island", "a city"], "ans": 1, "hint": "Crete is an island."}];
  const DROPDOWNS=[{"id": "dd1", "prompt": "Complete: The weather ___ sunny.", "opts": ["was", "were", "are"], "ans": 0, "hint": "Weather (it) → was."}, {"id": "dd2", "prompt": "Complete: We ___ happy.", "opts": ["were", "was", "are"], "ans": 0, "hint": "We → were."}, {"id": "dd3", "prompt": "Complete: We ___ the market.", "opts": ["visited", "visit", "visiting"], "ans": 0, "hint": "Affirmative past: visited."}, {"id": "dd4", "prompt": "Complete: We didn’t ___ the museum.", "opts": ["visit", "visited", "visiting"], "ans": 0, "hint": "didn’t + base verb."}, {"id": "dd5", "prompt": "Complete: Did you ___ on the beach?", "opts": ["walk", "walked", "walking"], "ans": 0, "hint": "Did + base verb."}, {"id": "dd6", "prompt": "Complete: Next month, I’m ___ visit Spain.", "opts": ["going to", "went to", "go"], "ans": 0, "hint": "Going to."}, {"id": "dd7", "prompt": "Complete: First we checked in. ___ we went to the beach.", "opts": ["Then", "Because", "However"], "ans": 0, "hint": "Sequence: then."}, {"id": "dd8", "prompt": "Complete: The hotel was clean; ___ the room was noisy.", "opts": ["however", "then", "because"], "ans": 0, "hint": "Contrast: however."}];
  const ORDER_TASKS=[{"id": "ord1", "first": "We", "words": ["stayed", "in", "Hossegor", "last", "weekend", "."], "target": "We stayed in Hossegor last weekend.", "hint": "We + past verb + place + time."}, {"id": "ord2", "first": "We", "words": ["didn’t", "visit", "the", "museum", "."], "target": "We didn’t visit the museum.", "hint": "didn’t + base verb."}, {"id": "ord3", "first": "Did", "words": ["you", "book", "a", "room", "online", "?"], "target": "Did you book a room online?", "hint": "Did + subject + base verb."}, {"id": "ord4", "first": "First,", "words": ["we", "checked", "in", ".", "Then,", "we", "walked", "on", "the", "beach", "."], "target": "First, we checked in. Then, we walked on the beach.", "hint": "Use connectors."}, {"id": "ord5", "first": "I’m", "words": ["going", "to", "visit", "Brazil", "."], "target": "I’m going to visit Brazil.", "hint": "going to + verb."}];
  const BANK_TASKS=[{"id": "bank1", "template": ["We", "____", "in", "Hossegor", "."], "bank": ["stayed", "stay", "staying"], "target": "We stayed in Hossegor.", "hint": "Past: stayed."}, {"id": "bank2", "template": ["The", "room", "____", "clean", ",", "but", "it", "____", "noisy", "."], "bank": ["was", "were", "is"], "target": "The room was clean, but it was noisy.", "hint": "Room (it) → was."}, {"id": "bank3", "template": ["We", "didn’t", "____", "the", "museum", "."], "bank": ["visit", "visited", "visiting"], "target": "We didn’t visit the museum.", "hint": "didn’t + base verb."}, {"id": "bank4", "template": ["Did", "you", "____", "the", "market", "?"], "bank": ["visit", "visited", "visiting"], "target": "Did you visit the market?", "hint": "Did + base verb."}, {"id": "bank5", "template": ["I’m", "going", "to", "____", "Spain", "."], "bank": ["visit", "visited", "visiting"], "target": "I’m going to visit Spain.", "hint": "going to + base verb."}, {"id": "bank6", "template": ["It", "was", "great", "because", "the", "weather", "____", "sunny", "."], "bank": ["was", "were", "is"], "target": "It was great because the weather was sunny.", "hint": "Weather → was."}];
  const SORT_TASK={"id": "sort1", "prompt": "Sort the words into the correct category.", "cats": [{"id": "bePast", "label": "Past with BE (was/were)"}, {"id": "regAff", "label": "Past affirmative (-ed)"}, {"id": "didForm", "label": "Did / didn’t + base verb"}, {"id": "connect", "label": "Connectors"}], "items": [{"t": "was", "cat": "bePast"}, {"t": "were", "cat": "bePast"}, {"t": "visited", "cat": "regAff"}, {"t": "walked", "cat": "regAff"}, {"t": "booked", "cat": "regAff"}, {"t": "did", "cat": "didForm"}, {"t": "didn’t", "cat": "didForm"}, {"t": "visit", "cat": "didForm"}, {"t": "First", "cat": "connect"}, {"t": "Then", "cat": "connect"}, {"t": "However", "cat": "connect"}, {"t": "Because", "cat": "connect"}], "hint": "After did/didn’t, use the base verb (visit)."};
  const READING={"title": "Hossegor weekend (short review)", "text": "Last weekend, we stayed in Hossegor. First, we checked in. Then, we walked on the beach. The weather was sunny, so we surfed in the morning. We visited the market because we wanted local food. The hotel was clean; however, the room was a little noisy at night.", "questions": [{"p": "Where did they stay?", "c": ["In Spain", "In Hossegor", "In Brazil"], "a": 1}, {"p": "What did they do first?", "c": ["They checked in.", "They flew to Canada.", "They visited Crete."], "a": 0}, {"p": "Why did they visit the market?", "c": ["Because they wanted local food.", "Because it was rainy.", "Because they had no hotel."], "a": 0}, {"p": "What was the problem?", "c": ["Noisy room", "No menu", "No beach"], "a": 0}, {"p": "Choose the connector for contrast:", "c": ["however", "then", "so"], "a": 0}]};
  const LISTENING=[{"id": "d1", "title": "Trip recap (Hossegor)", "lines": [{"who": "Friend", "side": "a", "say": "Hi Karine! How was your trip to Hossegor?"}, {"who": "Karine", "side": "b", "say": "It was great. The weather was sunny, and the hotel was clean."}, {"who": "Friend", "side": "a", "say": "What did you do?"}, {"who": "Karine", "side": "b", "say": "First, we checked in. Then, we walked on the beach and visited the market."}]}, {"id": "d2", "title": "Past simple: negative + question", "lines": [{"who": "Friend", "side": "a", "say": "Did you visit the museum?"}, {"who": "Karine", "side": "b", "say": "No, we didn’t visit the museum. We visited the market."}, {"who": "Friend", "side": "a", "say": "Did you enjoy the trip?"}, {"who": "Karine", "side": "b", "say": "Yes, we enjoyed it. However, the room was noisy at night."}]}, {"id": "d3", "title": "Future plans (Spain / Brazil / Crete)", "lines": [{"who": "Friend", "side": "a", "say": "Are you going to travel this year?"}, {"who": "Karine", "side": "b", "say": "Maybe. I’m going to visit Spain, or I’m going to visit Crete."}, {"who": "Friend", "side": "a", "say": "Are you going to visit Brazil too?"}, {"who": "Karine", "side": "b", "say": "Not sure. I’m not going to decide today."}]}];
  const PAST_TRAIN={"easy": [{"id": "pte1", "p": "Choose the past form: visit", "choices": ["visited", "visit", "visiting"], "a": 0, "h": "Regular: visit → visited."}, {"id": "pte2", "p": "Choose the past form: walk", "choices": ["walked", "walk", "walking"], "a": 0, "h": "walk → walked."}, {"id": "pte3", "p": "Complete: We ____ the market.", "choices": ["visited", "visit", "visiting"], "a": 0, "h": "visited."}, {"id": "pte4", "p": "Complete: I ____ a room.", "choices": ["booked", "book", "booking"], "a": 0, "h": "booked."}], "medium": [{"id": "ptm1", "p": "Negative: We ____ visit the museum.", "choices": ["didn’t", "don’t", "wasn’t"], "a": 0, "h": "Past negative: didn’t."}, {"id": "ptm2", "p": "Complete: We didn’t ____ the museum.", "choices": ["visit", "visited", "visiting"], "a": 0, "h": "didn’t + base verb."}, {"id": "ptm3", "p": "Question word: ____ you visit the market?", "choices": ["Did", "Do", "Was"], "a": 0, "h": "Past question: Did…?"}], "hard": [{"id": "pth1", "p": "Choose the correct sentence:", "choices": ["Did you visited the market?", "Did you visit the market?", "Did you visits the market?"], "a": 1, "h": "Did + base verb."}, {"id": "pth2", "p": "Choose the best review sentence (with connector):", "choices": ["We stayed in Hossegor. It was sunny. We surfed.", "We stayed in Hossegor. Because it was sunny, we surfed.", "We stayed in Hossegor. However it was sunny, we surfed."], "a": 1, "h": "Because = reason."}, {"id": "pth3", "p": "Choose the correct contrast: The hotel was clean; ____ the room was noisy.", "choices": ["however", "because", "then"], "a": 0, "h": "However = contrast."}]};
  const WRITING={"title": "Write a short review (guided + levels)", "steps": [{"label": "1) Place", "opts": ["Hossegor", "the hotel", "the restaurant"]}, {"label": "2) Time", "opts": ["last weekend", "last week", "in July"]}, {"label": "3) BE sentence", "opts": ["was clean", "was comfortable", "was noisy", "was great"]}, {"label": "4) Action 1 (past)", "opts": ["stayed in Hossegor", "visited the market", "walked on the beach", "booked a room"]}, {"label": "5) Action 2 (past)", "opts": ["enjoyed the trip", "surfed in the morning", "walked near the lake", "asked for the menu"]}, {"label": "6) Connector (sequence)", "opts": ["First", "Then", "After that", "Finally"]}, {"label": "7) Connector (extra)", "opts": ["because", "so", "however", "(none)"]}, {"label": "8) Opinion", "opts": ["I enjoyed it.", "It was great.", "It was nice, but a little noisy.", "I want to go again."]}], "hint": "A1 = simple sentences. A2/B1 = add connectors (because/so/however)."};

  // Top controls
  function syncAccent(){
    if(TTS.lang==="en-US"){ $("#voiceUS").classList.add("is-on"); $("#voiceUK").classList.remove("is-on"); }
    else { $("#voiceUK").classList.add("is-on"); $("#voiceUS").classList.remove("is-on"); }
  }
  function syncAuto(){
    if(TTS.auto){ $("#autoOn").classList.add("is-on"); $("#autoOff").classList.remove("is-on"); }
    else { $("#autoOff").classList.add("is-on"); $("#autoOn").classList.remove("is-on"); }
  }
  async function buildVoiceSelect(){
    await TTS.loadVoices();
    const sel=$("#voiceSelect"); sel.innerHTML="";
    const o0=document.createElement("option"); o0.value=""; o0.textContent="Auto (best match)"; sel.appendChild(o0);
    const sorted=(TTS.voices||[]).slice().sort((a,b)=>((a.lang||"").localeCompare(b.lang||""))||((a.name||"").localeCompare(b.name||"")));
    sorted.forEach(v=>{const o=document.createElement("option"); o.value=v.name; o.textContent=`${v.name} — ${v.lang}`; sel.appendChild(o);});
    sel.value=TTS.voiceName||"";
  }

  // Vocab
  const V={cat:"All", revealed:new Set()};
  function vocabCats(){ const cats=Array.from(new Set(VOCAB.map(x=>x.cat))).sort(); return ["All",...cats]; }
  function renderVocab(){
    const sel=$("#vCat");
    sel.innerHTML=vocabCats().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
    sel.value=V.cat;
    sel.addEventListener("change",()=>{V.cat=sel.value; renderVGrid();});
    renderVGrid();
  }
  function renderVGrid(){
    const grid=$("#vGrid"); grid.innerHTML="";
    const list=(V.cat==="All")?VOCAB:VOCAB.filter(x=>x.cat===V.cat);
    list.forEach(it=>{
      const key=it.cat+"::"+it.w;
      const card=document.createElement("div");
      card.className="card vocabCard";
      const open=V.revealed.has(key);
      card.innerHTML=`
        <div class="vocabTop">
          <div class="vocabWord">${esc(it.icon)} ${esc(it.w)}</div>
          <div class="vocabBtns">
            <button class="toolmini" data-act="s">🔊</button>
            <button class="toolmini" data-act="t">${open?"🙈 Hide":"👀 Reveal"}</button>
          </div>
        </div>
        <div class="kcard ${open?"":"hidden"}" data-box="b">
          <div class="vocabDef"><strong>Meaning:</strong> ${esc(it.def)}</div>
          <div class="vocabFr"><strong>FR:</strong> ${esc(it.fr)}</div>
          <div class="vocabEx"><strong>Example:</strong> ${esc(it.ex)}</div>
        </div>`;
      const box=card.querySelector('[data-box="b"]');
      const btn=card.querySelector('[data-act="t"]');
      tap(btn,()=>{ const isHidden=box.classList.contains("hidden"); if(isHidden){box.classList.remove("hidden"); V.revealed.add(key); btn.textContent="🙈 Hide";} else {box.classList.add("hidden"); V.revealed.delete(key); btn.textContent="👀 Reveal";}});
      tap(card.querySelector('[data-act="s"]'),()=>TTS.say(it.w+". "+it.ex));
      tap(card,(e)=>{ if(e?.target?.closest("button")) return; btn.click(); });
      grid.appendChild(card);
    });
  }
  function vocabQuiz(){
    const sample=shuffle(VOCAB).slice(0,6);
    const fb=$("#vFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("ok"); fb.innerHTML="";
    const wrap=document.createElement("div"); wrap.className="kcard";
    wrap.innerHTML="<strong>Vocabulary Quick Quiz (6)</strong>";
    const meta=[];
    sample.forEach((it,i)=>{
      const choices=shuffle([it.def,"a bathroom","a ticket"]);
      meta.push({ans:choices.indexOf(it.def)});
      wrap.innerHTML += `<div class="kcard" style="margin-top:.55rem"><div><strong>Q${i+1}:</strong> ${esc(it.w)}</div>`+
        choices.map((c,ci)=>`<label class="choice"><input type="radio" name="vq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")+
        `</div>`;
    });
    wrap.innerHTML += `<div class="smallrow"><button class="btn" id="vqCheck" type="button">✅ Check</button><button class="btn btn--ghost" id="vqClose" type="button">✖ Close</button></div><div class="feedback hidden" id="vqFb"></div>`;
    fb.appendChild(wrap);
    tap($("#vqClose"),()=>{fb.classList.add("hidden"); fb.textContent="";});
    tap($("#vqCheck"),()=>{
      let correct=0;
      meta.forEach((m,i)=>{const c=document.querySelector(`input[name="vq${i}"]:checked`); if(c && parseInt(c.value,10)===m.ans) correct++;});
      const b=$("#vqFb"); b.classList.remove("hidden","ok","no"); b.classList.add(correct>=5?"ok":"no"); b.textContent=`Score: ${correct}/6`;
      Score.award("vocab_quiz", correct);
    });
  }

  // Grammar render
  function renderGrammar(){
    const grid=$("#gGrid"); grid.innerHTML="";
    Object.keys(GRAMMAR).forEach(k=>{
      const g=GRAMMAR[k];
      const card=document.createElement("div"); card.className="card";
      card.innerHTML=`<h3>${esc(g.title)}</h3>
        <div class="kcard"><strong>Rule</strong><br/>${g.rule.map(x=>"• "+esc(x)).join("<br/>")}</div>
        <div class="kcard" style="margin-top:.55rem"><strong>Examples</strong><br/>${g.examples.map(x=>"• "+esc(x)).join("<br/>")}</div>
        <div class="smallrow"><button class="toolmini" data-a="r">🔊 Listen rule</button><button class="toolmini" data-a="e">🔊 Listen examples</button></div>
        <div class="tiny" style="color:rgba(14,31,36,.70)">${esc(g.note||"")}</div>`;
      tap(card.querySelector('[data-a="r"]'),()=>TTS.say(g.rule.join(". ")));
      tap(card.querySelector('[data-a="e"]'),()=>TTS.say(g.examples.join(". ")));
      grid.appendChild(card);
    });
  }

  // Generic MCQ runner for MCQ + trainer
  function makeRunner(hostId, fbId, name, items, awardPrefix, pts=1){
    const S={order:[], idx:0, cur:null};
    const host=$(hostId), fb=$(fbId);
    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML = `<div><strong>${esc(S.cur.prompt||S.cur.p)}</strong></div>` +
        (S.cur.choices||S.cur.c||[]).map((c,i)=>`<label class="choice"><input type="radio" name="${name}" value="${i}"/><div>${esc(c)}</div></label>`).join("");
    }
    function start(){
      S.order=shuffle(items.map(x=>x.id));
      S.idx=0; next(true);
    }
    function next(fromStart=false){
      if(!S.order.length) return;
      if(!fromStart) S.idx++;
      if(S.idx>=S.order.length) S.idx=0;
      S.cur=items.find(x=>x.id===S.order[S.idx]);
      fb.classList.add("hidden");
      render();
    }
    function hint(){
      if(!S.cur) return;
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.textContent="💡 "+(S.cur.hint||S.cur.h||"Think about the rule.");
    }
    function check(){
      if(!S.cur) return;
      const c=document.querySelector(`input[name="${name}"]:checked`);
      fb.classList.remove("hidden","ok","no");
      if(!c){ fb.classList.add("no"); fb.textContent="Choose an answer first."; return; }
      const ok=parseInt(c.value,10)===S.cur.ans||parseInt(c.value,10)===S.cur.a;
      fb.classList.add(ok?"ok":"no");
      fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
      if(ok) Score.award(awardPrefix+":"+S.cur.id, pts);
    }
    function reset(){ S.order=[]; S.cur=null; fb.classList.add("hidden"); host.textContent="Click Start."; }
    return {start,next,check,hint,reset,setItems:(newItems)=>{items=newItems; reset();}};
  }

  // MCQ and trainer
  const mcqRunner = makeRunner("#mcqHost","#mcqFb","mcq",MCQ,"mcq",1);

  // Dropdown runner
  const ddS={order:[], idx:0, cur:null};
  function ddRender(){
    const host=$("#ddHost");
    if(!ddS.cur){ host.textContent="Click Start."; return; }
    host.innerHTML = `<div><strong>${esc(ddS.cur.prompt)}</strong></div><select class="select" id="ddSel">${ddS.cur.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`;
  }
  function ddStart(){ ddS.order=shuffle(DROPDOWNS.map(x=>x.id)); ddS.idx=0; ddNext(true); }
  function ddNext(fromStart=false){
    if(!ddS.order.length) return;
    if(!fromStart) ddS.idx++;
    if(ddS.idx>=ddS.order.length) ddS.idx=0;
    ddS.cur=DROPDOWNS.find(x=>x.id===ddS.order[ddS.idx]);
    $("#ddFb").classList.add("hidden");
    ddRender();
  }
  function ddHint(){ const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(ddS.cur?.hint||""); }
  function ddCheck(){
    const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no");
    const v=parseInt($("#ddSel").value,10);
    const ok=v===ddS.cur.ans;
    fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
    if(ok) Score.award("dd:"+ddS.cur.id,1);
  }
  function ddReset(){ ddS.order=[]; ddS.cur=null; $("#ddFb").classList.add("hidden"); $("#ddHost").textContent="Click Start."; }

  // Sentence builder
  const ordS={order:[], idx:0, cur:null};
  function ordRender(){
    const host=$("#ordHost");
    if(!ordS.cur){ host.textContent="Click Start."; return; }
    const q=ordS.cur;
    const words=shuffle(q.words.slice());
    host.innerHTML=`<div><strong>Build the sentence</strong></div>
      <div class="kcard"><strong>First word:</strong> ${esc(q.first)}</div>
      <div class="bank" id="ordBank"></div><div class="zone" id="ordZone"></div>
      <div class="tiny" style="color:rgba(14,31,36,.70)">Tap words to add. Tap in the sentence to remove.</div>`;
    const bank=host.querySelector("#ordBank");
    const zone=host.querySelector("#ordZone");
    const add=(tok)=>{
      tok.classList.add("is-used");
      const c=tok.cloneNode(true); c.classList.remove("is-used");
      tap(c,()=>{c.remove(); tok.classList.remove("is-used");});
      zone.appendChild(c);
    };
    words.forEach(w=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=w; t.dataset.word=w; t.draggable=true;
      tap(t,()=>{ if(t.classList.contains("is-used")) return; add(t); });
      t.addEventListener("dragstart",(e)=>e.dataTransfer.setData("text/plain", w));
      bank.appendChild(t);
    });
    zone.addEventListener("dragover",(e)=>e.preventDefault());
    zone.addEventListener("drop",(e)=>{ e.preventDefault(); const w=e.dataTransfer.getData("text/plain"); const tok=Array.from(bank.querySelectorAll(".token")).find(x=>x.dataset.word===w && !x.classList.contains("is-used")); if(tok) add(tok);});
  }
  function ordStart(){ ordS.order=shuffle(ORDER_TASKS.map(x=>x.id)); ordS.idx=0; ordNext(true); }
  function ordNext(fromStart=false){
    if(!ordS.order.length) return;
    if(!fromStart) ordS.idx++;
    if(ordS.idx>=ordS.order.length) ordS.idx=0;
    ordS.cur=ORDER_TASKS.find(x=>x.id===ordS.order[ordS.idx]);
    $("#ordFb").classList.add("hidden");
    ordRender();
  }
  function ordHint(){ const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(ordS.cur?.hint||""); }
  function ordCheck(){
    const q=ordS.cur;
    const zone=$("#ordHost").querySelector("#ordZone");
    const built=[q.first].concat($$(".token", zone).map(t=>t.textContent.trim())).join(" ").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award("ord:"+q.id,2);
  }
  function ordReset(){ ordS.order=[]; ordS.cur=null; $("#ordFb").classList.add("hidden"); $("#ordHost").textContent="Click Start."; }

  // Word bank
  const bankS={order:[], idx:0, cur:null};
  function bankRender(){
    const host=$("#bankHost");
    if(!bankS.cur){ host.textContent="Click Start."; return; }
    const q=bankS.cur;
    const bank=shuffle(q.bank.slice());
    host.innerHTML=`<div><strong>Fill the blanks</strong></div><div class="kcard" id="bankSentence"></div><div class="bank" id="bankWords"></div><div class="tiny" style="color:rgba(14,31,36,.70)">Tap a word to fill the next blank.</div>`;
    const sent=host.querySelector("#bankSentence");
    const words=host.querySelector("#bankWords");
    let blanks=0;
    sent.innerHTML=q.template.map(x=>x==="____"?`<strong><span class="badge" data-b="${++blanks}">____</span></strong>`:esc(x)).join(" ");
    bank.forEach(w=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=w;
      tap(t,()=>{ const next=Array.from(sent.querySelectorAll("[data-b]")).find(b=>b.textContent==="____"); if(!next) return; next.textContent=w; t.classList.add("is-used");});
      words.appendChild(t);
    });
  }
  function bankStart(){ bankS.order=shuffle(BANK_TASKS.map(x=>x.id)); bankS.idx=0; bankNext(true); }
  function bankNext(fromStart=false){
    if(!bankS.order.length) return;
    if(!fromStart) bankS.idx++;
    if(bankS.idx>=bankS.order.length) bankS.idx=0;
    bankS.cur=BANK_TASKS.find(x=>x.id===bankS.order[bankS.idx]);
    $("#bankFb").classList.add("hidden");
    bankRender();
  }
  function bankHint(){ const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(bankS.cur?.hint||""); }
  function bankCheck(){
    const q=bankS.cur;
    const built=$("#bankHost").querySelector("#bankSentence").textContent.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award("bank:"+q.id,2);
  }
  function bankReset(){ bankS.order=[]; bankS.cur=null; $("#bankFb").classList.add("hidden"); $("#bankHost").textContent="Click Start."; }

  // Sorting
  function sortRender(){
    const host=$("#sortHost");
    host.innerHTML=`<div><strong>${esc(SORT_TASK.prompt)}</strong></div>
      <div class="smallrow" style="margin-top:.45rem"><div class="bank" id="sortBank"></div></div>
      <div class="grid2" style="margin-top:.55rem">${SORT_TASK.cats.map(c=>`<div class="kcard"><strong>${esc(c.label)}</strong><div class="zone" data-cat="${esc(c.id)}" style="margin-top:.45rem"></div></div>`).join("")}</div>
      <div class="tiny" style="color:rgba(14,31,36,.70);margin-top:.45rem">Tap OR drag items into boxes.</div>`;
    const bank=host.querySelector("#sortBank");
    const zones=$$("[data-cat]", host);
    shuffle(SORT_TASK.items.slice()).forEach(it=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=it.t; t.dataset.answer=it.cat; t.draggable=true;
      tap(t,()=>{ const z=zones.find(x=>x.dataset.cat===it.cat); if(z) z.appendChild(t); });
      t.addEventListener("dragstart",(e)=>e.dataTransfer.setData("text/plain", it.t));
      bank.appendChild(t);
    });
    zones.forEach(z=>{
      z.addEventListener("dragover",(e)=>e.preventDefault());
      z.addEventListener("drop",(e)=>{e.preventDefault(); const txt=e.dataTransfer.getData("text/plain"); const tok=Array.from(host.querySelectorAll(".token")).find(x=>x.textContent===txt); if(tok) z.appendChild(tok);});
    });
  }
  function sortHint(){ const fb=$("#sortFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+SORT_TASK.hint; }
  function sortCheck(){
    const host=$("#sortHost");
    let total=0, correct=0;
    $$("[data-cat]", host).forEach(z=>{
      const cat=z.dataset.cat;
      $$(".token", z).forEach(t=>{ total++; if(t.dataset.answer===cat) correct++; });
    });
    const fb=$("#sortFb"); fb.classList.remove("hidden","ok","no");
    const ok= total===SORT_TASK.items.length && correct===total;
    fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Perfect!":`Score: ${correct}/${SORT_TASK.items.length}. (Place all items.)`;
    if(ok) Score.award("sort",4);
  }
  function sortReset(){ $("#sortFb").classList.add("hidden"); sortRender(); }

  // Past trainer uses runner
  let ptLevel="easy";
  const ptRunner = makeRunner("#ptHost","#ptFb","pt",PAST_TRAIN[ptLevel],"pt",2);
  function setPT(level){
    ptLevel=level;
    $("#ptEasy").classList.toggle("is-on", level==="easy");
    $("#ptMed").classList.toggle("is-on", level==="medium");
    $("#ptHard").classList.toggle("is-on", level==="hard");
    ptRunner.setItems(PAST_TRAIN[level]);
  }

  // Reading
  function renderReading(){
    const host=$("#readHost");
    host.innerHTML=`<div class="kcard"><strong>Text:</strong><br/>${esc(READING.text)}</div>`+
      READING.questions.map((q,i)=>`<div class="kcard" style="margin-top:.55rem"><div><strong>Q${i+1}:</strong> ${esc(q.p)}</div>`+
      q.c.map((c,ci)=>`<label class="choice"><input type="radio" name="rq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")+
      `</div>`).join("");
  }
  function readCheck(){
    let correct=0;
    READING.questions.forEach((q,i)=>{ const c=document.querySelector(`input[name="rq${i}"]:checked`); if(c && parseInt(c.value,10)===q.a) correct++; });
    const fb=$("#readFb"); fb.classList.remove("hidden","ok","no"); const ok=correct>=4;
    fb.classList.add(ok?"ok":"no"); fb.textContent=`Score: ${correct}/${READING.questions.length}`;
    if(ok) Score.award("reading",6);
  }
  function readReset(){ renderReading(); $("#readFb").classList.add("hidden"); }

  // Writing with levels
  let wLevel="A1";
  function setW(level){
    wLevel=level;
    $("#lvlA1").classList.toggle("is-on", level==="A1");
    $("#lvlA2").classList.toggle("is-on", level==="A2");
    $("#lvlB1").classList.toggle("is-on", level==="B1");
    updateWrite();
  }
  function renderWriting(){
    const host=$("#writeHost");
    host.innerHTML=`<div class="kcard"><strong>${esc(WRITING.title)}</strong><div class="tiny" style="color:rgba(14,31,36,.72)">${esc(WRITING.hint)}</div></div>
      <div id="wb"></div>
      <div class="kcard" style="margin-top:.55rem"><strong>Your output:</strong><br/><span id="writeOut"></span></div>`;
    const wb=host.querySelector("#wb");
    wb.innerHTML = WRITING.steps.map((st,i)=>`<div class="kcard" style="margin-top:.55rem"><div><strong>${esc(st.label)}</strong></div>
      <select class="select" data-step="${i}">${st.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select></div>`).join("");
    $$("select[data-step]", wb).forEach(sel=>sel.addEventListener("change", updateWrite));
    updateWrite();
  }
  function updateWrite(){
    const vals=$$("select[data-step]", $("#writeHost")).map(s=>s.value);
    const place=vals[0], time=vals[1], be=vals[2], a1=vals[3], a2=vals[4], seq=vals[5], extra=vals[6], op=vals[7];
    const baseA1=`I was in ${place} ${time}. It ${be}. We ${a1}. We ${a2}. ${op}`;
    let out=baseA1;
    if(wLevel==="A2"){
      out = `I was in ${place} ${time}. It ${be}. ${seq}, we ${a1}. Then, we ${a2}. ${op}`;
      if(extra==="because") out += " It was great because the weather was sunny.";
      if(extra==="so") out += " The weather was sunny, so we surfed.";
      if(extra==="however") out += " The hotel was clean; however, the room was noisy.";
    }
    if(wLevel==="B1"){
      out = `Last weekend, I was in ${place}. It ${be}. ${seq}, we ${a1}. Then, we ${a2}. ${op}`;
      if(extra==="because") out += " I visited the market because I wanted local food.";
      if(extra==="so") out += " The weather was sunny, so we walked on the beach.";
      if(extra==="however") out += " However, the room was a little noisy at night.";
      out += " Overall, I would recommend it.";
    }
    $("#writeOut").textContent=out;
    $("#modelOut").textContent=out;
  }
  function writeListen(){ const t=$("#writeOut").textContent.trim(); if(t) TTS.say(t); }
  function writeCheck(){
    const txt=$("#writeOut").textContent;
    const hasStructure=/I was in/i.test(txt) && /It /i.test(txt) && /We /i.test(txt);
    const hasConn=/(First|Then|After that|Finally|because|so|however)/i.test(txt);
    const fb=$("#writeFb"); fb.classList.remove("hidden","ok","no");
    let ok=hasStructure;
    let msg="✅ Good structure!";
    if(wLevel!=="A1" && !hasConn){ ok=false; msg="❌ Add at least one connector (Then / because / so / however)."; }
    fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
    if(ok) Score.award("writing_"+wLevel, wLevel==="A1"?3:wLevel==="A2"?5:7);
  }
  function writeReset(){ renderWriting(); $("#writeFb").classList.add("hidden"); }

  // Listening
  const Lis={cur:null, show:false};
  function renderLisPicker(){
    const sel=$("#lisPick");
    sel.innerHTML=LISTENING.map(d=>`<option value="${esc(d.id)}">${esc(d.title)}</option>`).join("");
    sel.addEventListener("change",()=>loadLis(sel.value));
    loadLis(sel.value||LISTENING[0].id);
  }
  function loadLis(id){
    Lis.cur=LISTENING.find(x=>x.id===id);
    Lis.show=false;
    renderLis();
    buildLisQ();
    $("#lisQFb").classList.add("hidden");
  }
  function renderLis(){
    const d=Lis.cur; const stream=$("#lisStream"); stream.innerHTML="";
    d.lines.forEach(ln=>{
      const b=document.createElement("div"); b.className="bubble "+(ln.side==="a"?"a":"b");
      b.innerHTML=`<div class="who">${ln.side==="a"?"🟦":"🟩"} ${esc(ln.who)}</div>
        <div class="txt">${Lis.show?esc(ln.say):"<span class='badge'>Hidden</span>"}</div>
        <div class="tools"><button class="toolmini" data-act="s">🔊 Listen</button></div>`;
      tap(b.querySelector('[data-act="s"]'),()=>TTS.say(ln.say));
      stream.appendChild(b);
    });
  }
  function lisPlayAll(){
    const d=Lis.cur; let i=0;
    const next=()=>{ if(i>=d.lines.length) return; TTS.say(d.lines[i].say); i++; setTimeout(next,1700); };
    next();
  }
  function lisShow(){ Lis.show=true; renderLis(); }
  function lisHide(){ Lis.show=false; renderLis(); }

  function buildLisQ(){
    const d=Lis.cur; const host=$("#lisQHost");
    let qset=[];
    if(d.id==="d1"){
      qset=[{p:"How was the trip?",c:["Great","Terrible"],a:0},{p:"What did she do?",c:["Walked on the beach and visited the market","Stayed in bed"],a:0},{p:"Weather?",c:["sunny","snowy"],a:0},{p:"Hotel?",c:["clean","dirty"],a:0},{p:"Connector used?",c:["First/Then","Because/So"],a:0}];
    } else if(d.id==="d2"){
      qset=[{p:"Did she visit the museum?",c:["Yes","No"],a:1},{p:"She visited…",c:["the market","a volcano"],a:0},{p:"Enjoyed the trip?",c:["Yes","No"],a:0},{p:"Contrast word?",c:["However","Then"],a:0},{p:"After didn’t use…",c:["base verb","verb+ed"],a:0}];
    } else {
      qset=[{p:"Possible destinations:",c:["Spain/Crete","Canada/Mexico"],a:0},{p:"Decide today?",c:["No","Yes"],a:0},{p:"Correct form:",c:["I’m going to visit Spain.","I’m going visit Spain."],a:0},{p:"Crete is…",c:["an island","a city"],a:0},{p:"Travel this year?",c:["Maybe","No"],a:0}];
    }
    host.innerHTML=qset.map((q,i)=>`<div class="kcard" style="margin-top:.55rem"><div><strong>Q${i+1}:</strong> ${esc(q.p)}</div>`+
      q.c.map((c,ci)=>`<label class="choice"><input type="radio" name="lq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")+
      `</div>`).join("");
    host.dataset.qset=JSON.stringify(qset);
  }
  function lisResetQ(){ buildLisQ(); $("#lisQFb").classList.add("hidden"); }
  function lisCheckQ(){
    const host=$("#lisQHost");
    const qset=JSON.parse(host.dataset.qset||"[]");
    let correct=0;
    qset.forEach((q,i)=>{ const c=document.querySelector(`input[name="lq${i}"]:checked`); if(c && parseInt(c.value,10)===q.a) correct++; });
    const fb=$("#lisQFb"); fb.classList.remove("hidden","ok","no");
    const ok=correct>=4; fb.classList.add(ok?"ok":"no"); fb.textContent=`Score: ${correct}/${qset.length}`;
    if(ok) Score.award("listening:"+Lis.cur.id,6);
  }

  function resetAll(){
    TTS.stop(); Score.reset();
    V.revealed.clear(); V.cat="All";
    $("#vFb").classList.add("hidden");
    mcqRunner.reset(); ddReset(); ordReset(); bankReset();
    sortReset(); ptRunner.reset(); readReset(); writeReset();
    loadLis(LISTENING[0].id);
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  async function init(){
    Score.setMax(80);
    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});
    tap($("#btnTestVoice"),()=>TTS.say("Hello! How was your trip? It was great."));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnStart"),()=>document.getElementById("secVocab").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose US or UK accent.\n2) Review vocabulary + connectors.\n3) Grammar: past simple (affirmative/negative/questions).\n4) Exercises + Past Simple Trainer.\n5) Reading.\n6) Writing A1/A2/B1.\n7) Listening."));

    tap($("#btnResetAll"),()=>{ if(confirm("Reset the whole page?")) resetAll(); });

    tap($("#btnVRevealAll"),()=>{VOCAB.forEach(it=>V.revealed.add(it.cat+'::'+it.w)); renderVGrid();});
    tap($("#btnVHideAll"),()=>{V.revealed.clear(); renderVGrid();});
    tap($("#btnVQuiz"),()=>vocabQuiz());

    renderVocab();
    renderGrammar();

    tap($("#mcqStart"),()=>mcqRunner.start());
    tap($("#mcqCheck"),()=>mcqRunner.check());
    tap($("#mcqNext"),()=>mcqRunner.next(false));
    tap($("#mcqHint"),()=>mcqRunner.hint());
    tap($("#mcqReset"),()=>mcqRunner.reset());

    tap($("#ddStart"),()=>ddStart());
    tap($("#ddCheck"),()=>ddCheck());
    tap($("#ddNext"),()=>ddNext(false));
    tap($("#ddHint"),()=>ddHint());
    tap($("#ddReset"),()=>ddReset());

    tap($("#ordStart"),()=>ordStart());
    tap($("#ordCheck"),()=>ordCheck());
    tap($("#ordHint"),()=>ordHint());
    tap($("#ordReset"),()=>ordReset());

    tap($("#bankStart"),()=>bankStart());
    tap($("#bankCheck"),()=>bankCheck());
    tap($("#bankHint"),()=>bankHint());
    tap($("#bankReset"),()=>bankReset());

    sortRender();
    tap($("#sortCheck"),()=>sortCheck());
    tap($("#sortHint"),()=>sortHint());
    tap($("#sortReset"),()=>sortReset());

    // Trainer
    setPT("easy");
    tap($("#ptEasy"),()=>setPT("easy"));
    tap($("#ptMed"),()=>setPT("medium"));
    tap($("#ptHard"),()=>setPT("hard"));
    tap($("#ptStart"),()=>ptRunner.start());
    tap($("#ptCheck"),()=>ptRunner.check());
    tap($("#ptNext"),()=>ptRunner.next(false));
    tap($("#ptHint"),()=>ptRunner.hint());
    tap($("#ptReset"),()=>ptRunner.reset());

    renderReading();
    tap($("#readListen"),()=>TTS.say(READING.text));
    tap($("#readCheck"),()=>readCheck());
    tap($("#readReset"),()=>readReset());

    renderWriting();
    setW("A1");
    tap($("#lvlA1"),()=>setW("A1"));
    tap($("#lvlA2"),()=>setW("A2"));
    tap($("#lvlB1"),()=>setW("B1"));
    tap($("#writeListen"),()=>writeListen());
    tap($("#writeCheck"),()=>writeCheck());
    tap($("#writeReset"),()=>writeReset());

    renderLisPicker();
    tap($("#lisPlayAll"),()=>lisPlayAll());
    tap($("#lisShow"),()=>lisShow());
    tap($("#lisHide"),()=>lisHide());
    tap($("#lisCheck"),()=>lisCheckQ());
    tap($("#lisReset"),()=>lisResetQ());

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();
})();
