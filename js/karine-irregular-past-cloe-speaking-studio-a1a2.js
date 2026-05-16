/* SpeakEasyTisha — Irregular Past + CLOE Speaking Studio (A1/A2)
Build: 20260514-161100
*/
(() => {
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const DEBUG = $("#debugBox");
  const log=(m)=>{ try{DEBUG.classList.remove("hidden"); DEBUG.textContent += "\n"+m;}catch(e){} };
  window.addEventListener("error",(e)=>log("[Error] "+e.message+" @ "+e.filename+":"+e.lineno));
  window.addEventListener("unhandledrejection",(e)=>log("[Promise] "+String(e.reason)));

  const esc=(s)=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const norm=(s)=>String(s??"").replace(/[’]/g,"'").replace(/[‐‑–—]/g,"-").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim().toLowerCase();
  const shuffle=(a)=>{a=(a||[]).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
  const tap=(el, fn)=>{ if(!el) return; let last=0; const h=(e)=>{const now=Date.now(); if(now-last<320) return; last=now; try{fn(e);}catch(err){console.error(err); log(String(err));}}; 
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h);} else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };

  const KEYS={lang:"k_irrp_lang", voice:"k_irrp_voice", auto:"k_irrp_auto"};
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

  const VOCAB=[{"cat": "Irregular verbs", "icon": "🌀", "w": "go → went", "fr": "aller", "def": "irregular past form", "ex": "Yesterday, I went to the hotel."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "have → had", "fr": "avoir", "def": "irregular past form", "ex": "Yesterday, I had a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "do → did", "fr": "faire", "def": "irregular past form", "ex": "Yesterday, I did a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "get → got", "fr": "obtenir / recevoir", "def": "irregular past form", "ex": "Yesterday, I got a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "see → saw", "fr": "voir", "def": "irregular past form", "ex": "Yesterday, I saw a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "eat → ate", "fr": "manger", "def": "irregular past form", "ex": "Yesterday, I ate a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "drink → drank", "fr": "boire", "def": "irregular past form", "ex": "Yesterday, I drank a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "take → took", "fr": "prendre", "def": "irregular past form", "ex": "Yesterday, I took a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "buy → bought", "fr": "acheter", "def": "irregular past form", "ex": "Yesterday, I bought a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "come → came", "fr": "venir", "def": "irregular past form", "ex": "Yesterday, I came a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "make → made", "fr": "faire / fabriquer", "def": "irregular past form", "ex": "Yesterday, I made a coffee."}, {"cat": "Irregular verbs", "icon": "🌀", "w": "give → gave", "fr": "donner", "def": "irregular past form", "ex": "Yesterday, I gave a coffee."}, {"cat": "Conversation repair", "icon": "🛠️", "w": "Could you repeat that, please?", "fr": "Pouvez-vous répéter, s’il vous plaît ?", "def": "Ask someone to say it again.", "ex": "Could you repeat that, please?"}, {"cat": "Conversation repair", "icon": "🛠️", "w": "Could you speak more slowly, please?", "fr": "Pouvez-vous parler plus lentement, s’il vous plaît ?", "def": "Ask for slower speech.", "ex": "Could you speak more slowly, please?"}, {"cat": "Conversation repair", "icon": "🛠️", "w": "How do you spell that?", "fr": "Comment ça s’écrit ?", "def": "Ask for spelling.", "ex": "How do you spell that?"}, {"cat": "Conversation repair", "icon": "🛠️", "w": "What does that mean?", "fr": "Qu’est-ce que ça veut dire ?", "def": "Ask for meaning.", "ex": "What does that mean?"}, {"cat": "Conversation repair", "icon": "🛠️", "w": "I understand / I don’t understand.", "fr": "Je comprends / Je ne comprends pas.", "def": "Say if you understand.", "ex": "I understand / I don’t understand."}, {"cat": "Connectors", "icon": "🔗", "w": "first / then / after that / finally", "fr": "d’abord / puis / après / finalement", "def": "sequence words", "ex": "First, we checked in. Then, we went to dinner."}, {"cat": "Connectors", "icon": "🔗", "w": "because / so / however", "fr": "parce que / donc / cependant", "def": "reason / result / contrast", "ex": "It was great because the room was clean. However, it was noisy."}, {"cat": "Travel problem words", "icon": "🧳", "w": "check‑in", "fr": "arrivée (hôtel)", "def": "arrival procedure", "ex": "We checked in at 3 p.m."}, {"cat": "Travel problem words", "icon": "🧳", "w": "receipt", "fr": "reçu", "def": "proof of payment", "ex": "I need the receipt, please."}, {"cat": "Travel problem words", "icon": "🧳", "w": "refund", "fr": "remboursement", "def": "money back", "ex": "I asked for a refund."}, {"cat": "Travel problem words", "icon": "🧳", "w": "included", "fr": "inclus", "def": "part of the price", "ex": "Is breakfast included?"}, {"cat": "Travel problem words", "icon": "🧳", "w": "fee", "fr": "frais", "def": "extra cost", "ex": "Is there an extra fee?"}];
  const GRAMMAR={"irrPast": {"title": "Past simple: irregular verbs (core set)", "rule": ["Affirmative: subject + irregular past (go→went, have→had, see→saw…)", "Negative: subject + didn’t + base verb (didn’t go / didn’t have / didn’t see)", "Question: Did + subject + base verb…? (Did you go…?)", "After did / didn’t → base verb (NOT went / NOT had)"], "examples": ["We went to the restaurant.", "We didn’t go to the museum.", "Did you have breakfast?", "I bought a ticket. I didn’t buy a tour."], "note": "Start with 8–12 irregular verbs. Accuracy first."}, "repair": {"title": "Conversation repair (CLOE speaking essential)", "rule": ["Use these when you don’t understand:", "• Could you repeat that, please?", "• Could you speak more slowly, please?", "• How do you spell that?", "• What does that mean?"], "examples": ["Sorry, could you repeat that, please?", "Could you speak more slowly, please?", "How do you spell that?"], "note": "These phrases help you stay calm in the oral exam."}, "connectors": {"title": "Connectors for better stories", "rule": ["Sequence: First, Then, After that, Finally", "Reason: because", "Result: so", "Contrast: however / but"], "examples": ["First, we checked in. Then, we went out.", "I bought tickets because we wanted to visit the museum.", "The room was clean; however, it was noisy."], "note": "Connectors move your writing from A1 → A2/B1."}};
  const MCQ=[{"id": "m1", "prompt": "Choose the past form of go:", "choices": ["goed", "went", "gone"], "ans": 1, "hint": "go → went"}, {"id": "m2", "prompt": "Choose the correct negative:", "choices": ["We didn’t went.", "We didn’t go.", "We don’t went."], "ans": 1, "hint": "didn’t + base verb"}, {"id": "m3", "prompt": "Choose the correct question:", "choices": ["Did you went?", "Did you go?", "Do you went?"], "ans": 1, "hint": "Did + base verb"}, {"id": "m4", "prompt": "Choose the past form of buy:", "choices": ["buyed", "bought", "boughted"], "ans": 1, "hint": "buy → bought"}, {"id": "m5", "prompt": "Best repair phrase (spelling):", "choices": ["How do you spell that?", "What does that mean?", "Could you repeat that?"], "ans": 0, "hint": "Spell = letters"}, {"id": "m6", "prompt": "Best connector (contrast): The hotel was clean; ___ the room was noisy.", "choices": ["however", "because", "then"], "ans": 0, "hint": "however = contrast"}, {"id": "m7", "prompt": "Choose the past form of have:", "choices": ["haved", "had", "has"], "ans": 1, "hint": "have → had"}, {"id": "m8", "prompt": "After 'did', we use…", "choices": ["base verb", "past verb", "-ing"], "ans": 0, "hint": "Did + base verb"}];
  const DROPDOWNS=[{"id": "d1", "prompt": "Complete: Yesterday, we ___ to a café.", "opts": ["went", "go", "gone"], "ans": 0, "hint": "go → went"}, {"id": "d2", "prompt": "Complete: We didn’t ___ breakfast.", "opts": ["have", "had", "having"], "ans": 0, "hint": "didn’t + base verb"}, {"id": "d3", "prompt": "Complete: Did you ___ the ticket?", "opts": ["buy", "bought", "buying"], "ans": 0, "hint": "Did + base verb"}, {"id": "d4", "prompt": "Complete: I ___ the price, but I didn’t understand.", "opts": ["saw", "see", "seen"], "ans": 0, "hint": "see → saw"}, {"id": "d5", "prompt": "Complete: Could you speak more ___, please?", "opts": ["slowly", "slow", "slower"], "ans": 0, "hint": "adverb: slowly"}, {"id": "d6", "prompt": "Complete: First we checked in. ___ we went to dinner.", "opts": ["Then", "However", "Because"], "ans": 0, "hint": "sequence"}];
  const ORDER_TASKS=[{"id": "o1", "first": "Did", "words": ["you", "go", "to", "the", "restaurant", "?"], "target": "Did you go to the restaurant?", "hint": "Did + subject + base verb"}, {"id": "o2", "first": "We", "words": ["didn’t", "have", "breakfast", "because", "it", "was", "too", "early", "."], "target": "We didn’t have breakfast because it was too early.", "hint": "didn’t + base verb + because"}, {"id": "o3", "first": "First,", "words": ["we", "checked", "in", ".", "Then,", "we", "went", "out", "."], "target": "First, we checked in. Then, we went out.", "hint": "Sequence connectors"}, {"id": "o4", "first": "Sorry,", "words": ["could", "you", "repeat", "that,", "please", "?"], "target": "Sorry, could you repeat that, please?", "hint": "Repair phrase"}];
  const BANK_TASKS=[{"id": "b1", "template": ["Yesterday,", "we", "____", "to", "the", "hotel", "."], "bank": ["went", "go", "gone"], "target": "Yesterday, we went to the hotel.", "hint": "go → went"}, {"id": "b2", "template": ["We", "didn’t", "____", "a", "ticket", "."], "bank": ["buy", "bought", "buying"], "target": "We didn’t buy a ticket.", "hint": "didn’t + base verb"}, {"id": "b3", "template": ["Did", "you", "____", "the", "menu", "?"], "bank": ["see", "saw", "seen"], "target": "Did you see the menu?", "hint": "Did + base verb"}, {"id": "b4", "template": ["I", "____", "a", "coffee", "and", "I", "____", "the", "bill", "."], "bank": ["had", "paid", "have"], "target": "I had a coffee and I paid the bill.", "hint": "have→had; pay→paid"}, {"id": "b5", "template": ["The", "room", "was", "clean;", "____", "it", "was", "noisy", "."], "bank": ["however", "because", "then"], "target": "The room was clean; however it was noisy.", "hint": "contrast"}];
  const SORT_TASK={"id": "s1", "prompt": "Sort the verbs into Base form vs Past form.", "cats": [{"id": "base", "label": "Base form"}, {"id": "past", "label": "Past form"}], "items": [{"t": "go", "cat": "base"}, {"t": "went", "cat": "past"}, {"t": "have", "cat": "base"}, {"t": "had", "cat": "past"}, {"t": "buy", "cat": "base"}, {"t": "bought", "cat": "past"}, {"t": "see", "cat": "base"}, {"t": "saw", "cat": "past"}, {"t": "take", "cat": "base"}, {"t": "took", "cat": "past"}], "hint": "Past forms are often different (went, had, bought, saw…)."};
  const TRAIN={"easy": [{"id": "te1", "p": "Past of go:", "choices": ["went", "goed", "go"], "a": 0, "h": "go → went"}, {"id": "te2", "p": "Past of have:", "choices": ["had", "haved", "has"], "a": 0, "h": "have → had"}, {"id": "te3", "p": "Past of see:", "choices": ["saw", "seed", "seen"], "a": 0, "h": "see → saw"}, {"id": "te4", "p": "Past of buy:", "choices": ["bought", "buyed", "buy"], "a": 0, "h": "buy → bought"}], "medium": [{"id": "tm1", "p": "Negative: We ____ go to the museum.", "choices": ["didn’t", "don’t", "weren’t"], "a": 0, "h": "Past negative: didn’t"}, {"id": "tm2", "p": "After didn’t: We didn’t ____ lunch.", "choices": ["have", "had", "having"], "a": 0, "h": "didn’t + base verb"}, {"id": "tm3", "p": "Question: ____ you take the bus?", "choices": ["Did", "Do", "Was"], "a": 0, "h": "Did + subject"}], "hard": [{"id": "th1", "p": "Choose the correct sentence:", "choices": ["Did you went to the café?", "Did you go to the café?", "Did you going to the café?"], "a": 1, "h": "Did + base verb"}, {"id": "th2", "p": "Best story (with connectors):", "choices": ["We went out. We ate. We came back.", "First, we went out. Then, we ate. Finally, we came back.", "However, we went out because we ate."], "a": 1, "h": "Sequence: First/Then/Finally"}, {"id": "th3", "p": "Best repair phrase (slowly):", "choices": ["Could you speak more slowly, please?", "How do you spell that?", "I went slowly."], "a": 0, "h": "Ask them to speak slowly"}]};
  const LISTENING=[{"id": "l1", "title": "Hotel: a small problem (repair phrases)", "lines": [{"who": "Reception", "side": "a", "say": "Hello! You booked a double room for two nights."}, {"who": "Karine", "side": "b", "say": "Sorry, could you repeat that, please?"}, {"who": "Reception", "side": "a", "say": "Of course. A double room, two nights. Breakfast is included."}, {"who": "Karine", "side": "b", "say": "Thank you. I understand."}]}, {"id": "l2", "title": "Restaurant: what did you have? (irregular past)", "lines": [{"who": "Friend", "side": "a", "say": "Did you eat at the restaurant last night?"}, {"who": "Karine", "side": "b", "say": "Yes, we ate there. I had fish, and we drank water."}, {"who": "Friend", "side": "a", "say": "Did you like it?"}, {"who": "Karine", "side": "b", "say": "Yes. However, it was a little expensive."}]}, {"id": "l3", "title": "Tickets: buying + misunderstanding", "lines": [{"who": "Staff", "side": "a", "say": "Tickets are twenty euros. There is a booking fee."}, {"who": "Karine", "side": "b", "say": "What does “fee” mean?"}, {"who": "Staff", "side": "a", "say": "It means an extra cost."}, {"who": "Karine", "side": "b", "say": "Okay. Did you say twenty euros?"}]}];
  const LQ={"l1": [["How many nights?", "Two", "One", "Three", 0], ["Is breakfast included?", "Yes", "No", "Not mentioned", 0], ["What repair phrase does Karine use?", "Could you repeat that, please?", "How do you spell that?", "What does that mean?", 0], ["Reception repeats…", "the room details", "a weather report", "a menu", 0], ["Karine says…", "I understand.", "I don’t understand.", "I’m leaving.", 0]], "l2": [["Did they eat at the restaurant?", "Yes", "No", "Not sure", 0], ["What did Karine have?", "Fish", "Pizza", "Salad", 0], ["They drank…", "water", "juice", "tea", 0], ["Connector for contrast:", "However", "Because", "First", 0], ["Past of have:", "had", "have", "has", 0]], "l3": [["Tickets cost…", "20 euros", "12 euros", "30 euros", 0], ["A fee is…", "an extra cost", "a free ticket", "a restaurant", 0], ["Karine asks meaning of…", "fee", "menu", "island", 0], ["Karine checks the price (did you say…)", "Yes", "No", "Not in dialogue", 0], ["Booking fee is mentioned?", "Yes", "No", "No idea", 0]]};
  const WRITING={"title": "Story Builder (A1 → A2/B1)", "steps": [{"label": "1) Place", "opts": ["the hotel", "a café", "a museum", "the beach"]}, {"label": "2) Time", "opts": ["yesterday", "last night", "last weekend"]}, {"label": "3) Verb 1 (irregular)", "opts": ["went", "had", "did", "saw", "bought", "took", "ate", "drank"]}, {"label": "4) Object 1", "opts": ["to the hotel", "a coffee", "the menu", "tickets", "the bus", "a museum"]}, {"label": "5) Connector", "opts": ["First", "Then", "After that", "Finally"]}, {"label": "6) Verb 2 (irregular)", "opts": ["went", "had", "did", "saw", "bought", "took", "ate", "drank"]}, {"label": "7) Object 2", "opts": ["dinner", "a coffee", "the beach", "a tour", "a ticket", "water"]}, {"label": "8) Extra connector", "opts": ["because", "so", "however", "(none)"]}, {"label": "9) Ending", "opts": ["It was great.", "It was expensive.", "I enjoyed it.", "The service was slow."]}], "hint": "A1: 2–3 short sentences. A2/B1: add connectors + one opinion."};

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
    const sorted=(TTS.voices||[]).slice().sort((a,b)=>{
      const ae=(a.lang||"").toLowerCase().startsWith("en")?0:1;
      const be=(b.lang||"").toLowerCase().startsWith("en")?0:1;
      if(ae!==be) return ae-be;
      return (a.lang||"").localeCompare(b.lang||"") || (a.name||"").localeCompare(b.name||"");
    });
    sorted.forEach(v=>{const o=document.createElement("option"); o.value=v.name; o.textContent=`${v.name} — ${v.lang}`; sel.appendChild(o);});
    sel.value=TTS.voiceName||"";
  }

  // Vocabulary
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
      card.innerHTML=`<div class="vocabTop"><div class="vocabWord">${esc(it.icon)} ${esc(it.w)}</div>
        <div class="vocabBtns"><button class="toolmini" data-act="s">🔊</button><button class="toolmini" data-act="t">${open?"🙈 Hide":"👀 Reveal"}</button></div></div>
        <div class="kcard ${open?"":"hidden"}" data-box="b"><div class="vocabDef"><strong>Meaning:</strong> ${esc(it.def)}</div>
        <div class="vocabFr"><strong>FR:</strong> ${esc(it.fr)}</div><div class="vocabEx"><strong>Example:</strong> ${esc(it.ex)}</div></div>`;
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
    wrap.innerHTML="<strong>Vocabulary Quick Quiz (6)</strong><div class='tiny' style='color:rgba(14,31,36,.72)'>Choose the best meaning.</div>";
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

  // Grammar
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

  function makeRunner(hostId, fbId, name, items, awardPrefix, pts=1){
    const S={order:[], idx:0, cur:null};
    const host=$(hostId), fb=$(fbId);
    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML = `<div><strong>${esc(S.cur.prompt||S.cur.p)}</strong></div>` +
        (S.cur.choices||S.cur.c||[]).map((c,i)=>`<label class="choice"><input type="radio" name="${name}" value="${i}"/><div>${esc(c)}</div></label>`).join("");
    }
    function start(){ S.order=shuffle(items.map(x=>x.id)); S.idx=0; next(true); }
    function next(fromStart=false){
      if(!S.order.length) return;
      if(!fromStart) S.idx++;
      if(S.idx>=S.order.length) S.idx=0;
      S.cur=items.find(x=>x.id===S.order[S.idx]);
      fb.classList.add("hidden"); render();
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
      const ans=parseInt(c.value,10);
      const ok = (S.cur.ans!==undefined ? ans===S.cur.ans : ans===S.cur.a);
      fb.classList.add(ok?"ok":"no");
      fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
      if(ok) Score.award(`${awardPrefix}:${S.cur.id}`, pts);
    }
    function reset(){ S.order=[]; S.cur=null; fb.classList.add("hidden"); host.textContent="Click Start."; }
    function setItems(newItems){ items=newItems; reset(); }
    return {start,next,check,hint,reset,setItems};
  }

  const mcq = makeRunner("#mcqHost","#mcqFb","mcq",MCQ,"mcq",1);

  // Dropdown
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
    $("#ddFb").classList.add("hidden"); ddRender();
  }
  function ddHint(){ const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(ddS.cur?.hint||""); }
  function ddCheck(){
    const fb=$("#ddFb"); fb.classList.remove("hidden","ok","no");
    const val=parseInt($("#ddSel").value,10);
    const ok=val===ddS.cur.ans;
    fb.classList.add(ok?"ok":"no"); fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
    if(ok) Score.award(`dd:${ddS.cur.id}`,1);
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
    $("#ordFb").classList.add("hidden"); ordRender();
  }
  function ordHint(){ const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(ordS.cur?.hint||""); }
  function ordCheck(){
    const q=ordS.cur;
    const zone=$("#ordHost").querySelector("#ordZone");
    const built=[q.first].concat($$(".token", zone).map(t=>t.textContent.trim())).join(" ").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award(`ord:${q.id}`,2);
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
    $("#bankFb").classList.add("hidden"); bankRender();
  }
  function bankHint(){ const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(bankS.cur?.hint||""); }
  function bankCheck(){
    const q=bankS.cur;
    const built=$("#bankHost").querySelector("#bankSentence").textContent.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award(`bank:${q.id}`,2);
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
    if(ok) Score.award("sort",3);
  }
  function sortReset(){ $("#sortFb").classList.add("hidden"); sortRender(); }

  // Trainer
  let trLevel="easy";
  const tr = makeRunner("#trHost","#trFb","tr",TRAIN[trLevel],"tr",2);
  function setTR(level){
    trLevel=level;
    $("#trEasy").classList.toggle("is-on", level==="easy");
    $("#trMed").classList.toggle("is-on", level==="medium");
    $("#trHard").classList.toggle("is-on", level==="hard");
    tr.setItems(TRAIN[level]);
  }

  // Roleplays
  const RP = {
    a: `Yesterday, I checked in. The room was clean, but it was noisy at night. Could you help me, please? If possible, could I change rooms?`,
    b: `Yes, we ate at a restaurant. I had fish and we drank water. The food was good; however, it was a little expensive.`,
    c: `I bought tickets, but I didn’t understand “fee”. What does “fee” mean? Sorry, could you repeat the price, please? Did you say twenty euros?`
  };
  function setupRoleplays(){
    $("#rpA").textContent=RP.a; $("#rpB").textContent=RP.b; $("#rpC").textContent=RP.c;
    $$("[data-rp][data-act]").forEach(btn=>{
      const key=btn.dataset.rp, act=btn.dataset.act;
      const box= key==="a"?$("#rpA"):key==="b"?$("#rpB"):$("#rpC");
      tap(btn,()=>{ if(act==="show") box.classList.remove("hidden"); if(act==="hide") box.classList.add("hidden"); if(act==="listen") TTS.say(box.textContent||RP[key]); });
    });
  }

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
    renderLisQ();
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
  function renderLisQ(){
    const host=$("#lisQHost");
    const qset=LQ[Lis.cur.id]||[];
    host.innerHTML=qset.map((q,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>Q${i+1}:</strong> ${esc(q[0])}</div>
      ${[q[1],q[2],q[3]].map((c,ci)=>`<label class="choice"><input type="radio" name="lq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")}
    </div>`).join("");
    host.dataset.qset=JSON.stringify(qset);
  }
  function lisResetQ(){ renderLisQ(); $("#lisQFb").classList.add("hidden"); }
  function lisCheckQ(){
    const qset=JSON.parse($("#lisQHost").dataset.qset||"[]");
    let correct=0;
    qset.forEach((q,i)=>{
      const c=document.querySelector(`input[name="lq${i}"]:checked`);
      if(c && parseInt(c.value,10)===q[4]) correct++;
    });
    const fb=$("#lisQFb"); fb.classList.remove("hidden","ok","no");
    const ok=correct>=4;
    fb.classList.add(ok?"ok":"no");
    fb.textContent=`Score: ${correct}/${qset.length}`;
    if(ok) Score.award(`listening:${Lis.cur.id}`,4);
  }

  // Story Builder
  let storyLevel="A1";
  function setStoryLevel(level){
    storyLevel=level;
    $("#lvlA1").classList.toggle("is-on", level==="A1");
    $("#lvlA2").classList.toggle("is-on", level==="A2");
    $("#lvlB1").classList.toggle("is-on", level==="B1");
    updateStoryOut();
  }
  function renderStory(){
    const host=$("#storyHost");
    host.innerHTML = `<div class="kcard"><strong>${esc(WRITING.title)}</strong><div class="tiny" style="color:rgba(14,31,36,.72)">${esc(WRITING.hint)}</div></div>
      <div id="sb"></div>
      <div class="kcard" style="margin-top:.55rem"><strong>Your story:</strong><br/><span id="storyOut"></span></div>`;
    const sb=host.querySelector("#sb");
    sb.innerHTML = WRITING.steps.map((st,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>${esc(st.label)}</strong></div>
      <select class="select" data-step="${i}">${st.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
    </div>`).join("");
    $$("select[data-step]", sb).forEach(sel=>sel.addEventListener("change", updateStoryOut));
    updateStoryOut();
  }
  function updateStoryOut(){
    const vals=$$("select[data-step]", $("#storyHost")).map(s=>s.value);
    const place=vals[0], time=vals[1], v1=vals[2], o1=vals[3], seq=vals[4], v2=vals[5], o2=vals[6], extra=vals[7], end=vals[8];
    let out = `Yesterday, I ${v1} ${o1}. I ${v2} ${o2}. ${end}`;
    if(storyLevel==="A2"){
      out = `${time}, I ${v1} ${o1}. ${seq}, I ${v2} ${o2}. ${end}`;
      if(extra==="because") out += " It was good because the service was nice.";
      if(extra==="so") out += " The place was busy, so I left early.";
      if(extra==="however") out += " However, it was a little expensive.";
    }
    if(storyLevel==="B1"){
      out = `${time}, I ${v1} ${o1}. ${seq}, I ${v2} ${o2}. ${end}`;
      if(extra==="because") out += " I chose this place because it was close to my hotel.";
      if(extra==="so") out += " It was sunny, so I walked to the beach.";
      if(extra==="however") out += " However, I didn’t understand the fee at first, so I asked for help.";
      out += " Overall, it was a good experience.";
    }
    $("#storyOut").textContent = out;
  }
  function storyListen(){ const t=$("#storyOut").textContent.trim(); if(t) TTS.say(t); }
  function storyCheck(){
    const txt=$("#storyOut").textContent;
    const hasPast = /(went|had|did|saw|bought|took|ate|drank)/i.test(txt);
    const hasConn = /(First|Then|After that|Finally|because|so|however)/i.test(txt);
    const fb=$("#storyFb"); fb.classList.remove("hidden","ok","no");
    let ok = hasPast;
    let msg="✅ Good! You used an irregular past verb.";
    if(storyLevel!=="A1" && !hasConn){ ok=false; msg="❌ Add at least one connector (Then / because / so / however)."; }
    fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
    if(ok) Score.award("story:"+storyLevel, storyLevel==="A1"?3:storyLevel==="A2"?5:7);
  }
  function storyReset(){ renderStory(); $("#storyFb").classList.add("hidden"); }

  function resetAll(){
    TTS.stop(); Score.reset();
    V.revealed.clear(); V.cat="All";
    $("#vFb").classList.add("hidden");
    mcq.reset(); ddReset(); ordReset(); bankReset(); sortReset();
    tr.reset(); setTR("easy");
    setupRoleplays();
    loadLis(LISTENING[0].id);
    storyReset(); setStoryLevel("A1");
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  async function init(){
    Score.setMax(70);
    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});
    tap($("#btnTestVoice"),()=>TTS.say("Hello! Did you go out yesterday?"));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnStart"),()=>document.getElementById("secVocab").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose US or UK accent.\n2) Vocabulary + repair phrases.\n3) Grammar rules.\n4) Exercise Lab + Irregular Trainer.\n5) Roleplays.\n6) Listening with Show/Hide text.\n7) Story Builder (A1/A2/B1)."));

    tap($("#btnResetAll"),()=>{ if(confirm("Reset the whole page?")) resetAll(); });

    tap($("#btnVRevealAll"),()=>{VOCAB.forEach(it=>V.revealed.add(it.cat+'::'+it.w)); renderVGrid();});
    tap($("#btnVHideAll"),()=>{V.revealed.clear(); renderVGrid();});
    tap($("#btnVQuiz"),()=>vocabQuiz());

    renderVocab();
    renderGrammar();

    tap($("#mcqStart"),()=>mcq.start());
    tap($("#mcqCheck"),()=>mcq.check());
    tap($("#mcqNext"),()=>mcq.next(false));
    tap($("#mcqHint"),()=>mcq.hint());
    tap($("#mcqReset"),()=>mcq.reset());

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

    setTR("easy");
    tap($("#trEasy"),()=>setTR("easy"));
    tap($("#trMed"),()=>setTR("medium"));
    tap($("#trHard"),()=>setTR("hard"));
    tap($("#trStart"),()=>tr.start());
    tap($("#trCheck"),()=>tr.check());
    tap($("#trNext"),()=>tr.next(false));
    tap($("#trHint"),()=>tr.hint());
    tap($("#trReset"),()=>tr.reset());

    setupRoleplays();

    renderLisPicker();
    tap($("#lisPlayAll"),()=>lisPlayAll());
    tap($("#lisShow"),()=>lisShow());
    tap($("#lisHide"),()=>lisHide());
    tap($("#lisCheck"),()=>lisCheckQ());
    tap($("#lisReset"),()=>lisResetQ());

    renderStory();
    setStoryLevel("A1");
    tap($("#lvlA1"),()=>setStoryLevel("A1"));
    tap($("#lvlA2"),()=>setStoryLevel("A2"));
    tap($("#lvlB1"),()=>setStoryLevel("B1"));
    tap($("#storyListen"),()=>storyListen());
    tap($("#storyCheck"),()=>storyCheck());
    tap($("#storyReset"),()=>storyReset());

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();
})();
