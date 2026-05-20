/* SpeakEasyTisha — Future Mastery Studio (A1/A2)
Build: 20260519-114723
*/
(() => {
  const $ = (s, el=document)=>el.querySelector(s);
  const $$ = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const DEBUG = $("#debugBox");
  const log=(m)=>{ try{DEBUG.classList.remove("hidden"); DEBUG.textContent += "\n"+m;}catch(e){} };
  window.addEventListener("error",(e)=>log("[Error] "+e.message+" @ "+e.filename+":"+e.lineno));
  window.addEventListener("unhandledrejection",(e)=>log("[Promise] "+String(e.reason)));

  const esc=(s)=>String(s??"")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  const norm=(s)=>String(s??"")
    .replace(/[’]/g,"'").replace(/[‐‑–—]/g,"-")
    .replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1")
    .trim().toLowerCase();
  const shuffle=(a)=>{a=(a||[]).slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
  const tap=(el, fn)=>{ if(!el) return; let last=0;
    const h=(e)=>{const now=Date.now(); if(now-last<320) return; last=now; try{fn(e);}catch(err){console.error(err); log(String(err));}};
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h); }
    else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };

  // TTS
  const KEYS={lang:"k_future_lang", voice:"k_future_voice", auto:"k_future_auto"};
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

  // Score
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
  const VOCAB=[{"cat": "Time & dates", "icon": "📅", "w": "tomorrow", "fr": "demain", "def": "the day after today", "ex": "I’m going to call you tomorrow."}, {"cat": "Time & dates", "icon": "📅", "w": "next week", "fr": "la semaine prochaine", "def": "the week after this week", "ex": "We’re flying next week."}, {"cat": "Time & dates", "icon": "🕒", "w": "at 6 p.m.", "fr": "à 18h", "def": "a specific time", "ex": "I’m meeting you at 6 p.m."}, {"cat": "Time & dates", "icon": "📆", "w": "on Friday", "fr": "vendredi", "def": "day of the week", "ex": "We’re leaving on Friday."}, {"cat": "Time & dates", "icon": "🗓️", "w": "in July", "fr": "en juillet", "def": "month", "ex": "I’m going to travel in July."}, {"cat": "Plans (going to)", "icon": "🧭", "w": "I’m going to book a hotel", "fr": "Je vais réserver un hôtel", "def": "future plan already decided", "ex": "I’m going to book a hotel tonight."}, {"cat": "Plans (going to)", "icon": "🧭", "w": "I’m not going to rent a car", "fr": "Je ne vais pas louer une voiture", "def": "negative plan", "ex": "I’m not going to rent a car this time."}, {"cat": "Plans (going to)", "icon": "🧭", "w": "Are you going to visit…?", "fr": "Est-ce que tu vas visiter… ?", "def": "question about a plan", "ex": "Are you going to visit a museum?"}, {"cat": "Arrangements (present continuous)", "icon": "📍", "w": "I’m meeting my friend", "fr": "Je retrouve mon ami(e)", "def": "a fixed arrangement", "ex": "I’m meeting my friend at 6 p.m."}, {"cat": "Arrangements (present continuous)", "icon": "✈️", "w": "We’re flying on Friday", "fr": "Nous prenons l’avion vendredi", "def": "a scheduled arrangement", "ex": "We’re flying on Friday morning."}, {"cat": "Arrangements (present continuous)", "icon": "🏨", "w": "We’re staying at…", "fr": "Nous logeons à…", "def": "temporary arrangement", "ex": "We’re staying at a small hotel."}, {"cat": "Will (decision/offer/prediction)", "icon": "⚡", "w": "Okay, I’ll take it", "fr": "D’accord, je le prends", "def": "decision now", "ex": "Okay, I’ll take it."}, {"cat": "Will (decision/offer/prediction)", "icon": "🤝", "w": "I’ll help you", "fr": "Je vais t’aider", "def": "offer", "ex": "I’ll help you with your bags."}, {"cat": "Will (decision/offer/prediction)", "icon": "🌦️", "w": "It will rain", "fr": "Il va pleuvoir", "def": "prediction", "ex": "I think it will rain tomorrow."}, {"cat": "Booking & travel", "icon": "🎟️", "w": "ticket", "fr": "billet", "def": "paper / digital entry pass", "ex": "I’m going to buy a ticket online."}, {"cat": "Booking & travel", "icon": "💳", "w": "pay by card", "fr": "payer par carte", "def": "payment method", "ex": "I’ll pay by card."}, {"cat": "Booking & travel", "icon": "🧾", "w": "receipt", "fr": "reçu", "def": "proof of payment", "ex": "Could I have a receipt, please?"}, {"cat": "Booking & travel", "icon": "❌", "w": "cancel", "fr": "annuler", "def": "stop a booking", "ex": "I’m going to cancel the reservation."}, {"cat": "Booking & travel", "icon": "🔁", "w": "change my booking", "fr": "modifier ma réservation", "def": "update a reservation", "ex": "I’m changing my booking."}, {"cat": "Connectors", "icon": "🔗", "w": "first / then / after that / finally", "fr": "d’abord / puis / après / finalement", "def": "sequence words", "ex": "First, I’ll book the hotel. Then, I’ll buy tickets."}, {"cat": "Connectors", "icon": "🔗", "w": "because / so / however", "fr": "parce que / donc / cependant", "def": "reason / result / contrast", "ex": "It’s expensive, so I’ll choose a cheaper option."}];
  const GRAMMAR={"goingto": {"title": "Future plan: be going to", "rule": ["Affirmative: I’m going to + verb", "Negative: I’m not going to + verb", "Question: Are you going to + verb?", "Short answers: Yes, I am. / No, I’m not."], "examples": ["I’m going to book a hotel.", "I’m not going to rent a car.", "Are you going to visit the city center?"], "note": "Use going to for plans/intentions (already decided)."}, "presentCont": {"title": "Arrangements: present continuous (future meaning)", "rule": ["Affirmative: I’m + verb‑ing (I’m meeting…)", "Negative: I’m not + verb‑ing", "Question: Are you + verb‑ing…?", "Use with a time/date: at 6 / on Friday / next week"], "examples": ["I’m meeting my friend at 6 p.m.", "We’re flying on Friday.", "Are you staying in a hotel?"], "note": "Use it for fixed arrangements (often with a time/date)."}, "will": {"title": "Will: decision now / offer / prediction", "rule": ["Decision now: Okay, I’ll…", "Offer: I’ll help you / I’ll call the hotel", "Prediction: It will rain / It will be busy", "Negative: won’t (will not)"], "examples": ["Okay, I’ll take it.", "I’ll help you with your bags.", "I think it will rain tomorrow."], "note": "Will is NOT a plan you already decided earlier."}, "contrast": {"title": "Quick contrast (CLOE-friendly)", "rule": ["going to = plan decided", "present continuous = arrangement (time/date)", "will = decision now / offer / prediction", "Signal words: now (will), at 6/on Friday (present cont), next month (plan)"], "examples": ["I’m going to visit Seville in July. (plan)", "I’m meeting my friend at 6. (arrangement)", "Okay, I’ll call the hotel. (decision now)"], "note": "In the exam, choose the form that matches the meaning."}};
  const MCQ=[{"id": "m1", "prompt": "Choose the best form (plan): Tonight, I ___ book a hotel.", "choices": ["will", "am going to", "am booking"], "ans": 1, "hint": "Plan decided → going to."}, {"id": "m2", "prompt": "Choose the best form (arrangement): We ___ on Friday.", "choices": ["are flying", "are going to fly", "will fly"], "ans": 0, "hint": "Arrangement with date → present continuous."}, {"id": "m3", "prompt": "Choose the best form (decision now): Okay, I ___ take it.", "choices": ["am going to", "will", "am taking"], "ans": 1, "hint": "Decision now → will."}, {"id": "m4", "prompt": "Choose the best form (prediction): I think it ___ rain tomorrow.", "choices": ["is going to", "will", "is raining"], "ans": 1, "hint": "Prediction → will."}, {"id": "m5", "prompt": "Choose the correct negative (plan):", "choices": ["I’m not going to rent a car.", "I don’t going to rent a car.", "I’m not rent a car."], "ans": 0, "hint": "Not going to + verb."}, {"id": "m6", "prompt": "Choose the correct question (arrangement):", "choices": ["Are you meet at 6?", "Are you meeting at 6?", "Do you meeting at 6?"], "ans": 1, "hint": "Are you + V-ing."}, {"id": "m7", "prompt": "Choose the best form (offer): Don’t worry, I ___ help you.", "choices": ["am going to", "will", "am helping"], "ans": 1, "hint": "Offer → will."}, {"id": "m8", "prompt": "Choose the best: (decision now)", "choices": ["I’m going to call now.", "Okay, I’ll call now.", "I’m calling now tomorrow."], "ans": 1, "hint": "Decision now = will."}, {"id": "m9", "prompt": "Short answer: Are you going to visit Spain?", "choices": ["Yes, I do.", "Yes, I am.", "Yes, I will."], "ans": 1, "hint": "Going to → am."}, {"id": "m10", "prompt": "Negative prediction: It ___ be expensive.", "choices": ["won’t", "isn’t going to", "am not"], "ans": 0, "hint": "will not = won’t."}];
  const DROPDOWNS=[{"id": "d1", "prompt": "Complete (plan): I’m ___ buy tickets online.", "opts": ["going to", "meeting", "will"], "ans": 0, "hint": "going to + verb"}, {"id": "d2", "prompt": "Complete (arrangement): We’re ___ at 6 p.m.", "opts": ["meeting", "will meet", "going to meet"], "ans": 0, "hint": "present continuous"}, {"id": "d3", "prompt": "Complete (decision now): Okay, I ___ call the hotel.", "opts": ["will", "am going to", "am calling"], "ans": 0, "hint": "decision now"}, {"id": "d4", "prompt": "Complete (prediction): I think it ___ be busy.", "opts": ["will", "am going to", "am being"], "ans": 0, "hint": "will + base"}, {"id": "d5", "prompt": "Complete (negative): I ___ going to rent a car.", "opts": ["’m not", "don’t", "won’t"], "ans": 0, "hint": "I’m not going to"}, {"id": "d6", "prompt": "Complete (arrangement question): ___ you meeting your friend?", "opts": ["Are", "Do", "Will"], "ans": 0, "hint": "Are you + V-ing"}, {"id": "d7", "prompt": "Complete (offer): Don’t worry. I ___ help you.", "opts": ["will", "am going to", "am helping"], "ans": 0, "hint": "Offer"}, {"id": "d8", "prompt": "Complete (sequence): First I’ll book the hotel. ___ I’ll buy tickets.", "opts": ["Then", "However", "Because"], "ans": 0, "hint": "Sequence"}];
  const ORDER_TASKS=[{"id": "o1", "first": "Are", "words": ["you", "going", "to", "visit", "Spain", "in", "July", "?"], "target": "Are you going to visit Spain in July?", "hint": "Are you going to + verb…?"}, {"id": "o2", "first": "We’re", "words": ["meeting", "at", "6", "p.m.", "tomorrow", "."], "target": "We’re meeting at 6 p.m. tomorrow.", "hint": "Arrangement = present continuous"}, {"id": "o3", "first": "Okay,", "words": ["I’ll", "call", "the", "hotel", "now", "."], "target": "Okay, I’ll call the hotel now.", "hint": "Decision now = will"}, {"id": "o4", "first": "I", "words": ["think", "it", "will", "rain", "tomorrow", "."], "target": "I think it will rain tomorrow.", "hint": "Prediction = will"}];
  const BANK_TASKS=[{"id": "b1", "template": ["Tonight,", "I’m", "____", "to", "book", "a", "hotel", "."], "bank": ["going", "go", "gone"], "target": "Tonight, I’m going to book a hotel.", "hint": "I’m going to"}, {"id": "b2", "template": ["We’re", "____", "on", "Friday", "."], "bank": ["flying", "fly", "going to fly"], "target": "We’re flying on Friday.", "hint": "Arrangement"}, {"id": "b3", "template": ["Okay,", "I", "____", "take", "it", "."], "bank": ["will", "am going to", "am taking"], "target": "Okay, I will take it.", "hint": "Decision now"}, {"id": "b4", "template": ["I", "think", "it", "____", "be", "expensive", "."], "bank": ["will", "am going to", "am being"], "target": "I think it will be expensive.", "hint": "Prediction"}, {"id": "b5", "template": ["I’m", "not", "going", "to", "____", "a", "car", "."], "bank": ["rent", "rented", "renting"], "target": "I’m not going to rent a car.", "hint": "Base verb"}];
  const SORT_TASK={"id": "s1", "prompt": "Sort the sentences into the correct category.", "cats": [{"id": "plan", "label": "Plan (going to)"}, {"id": "arr", "label": "Arrangement (present continuous)"}, {"id": "will", "label": "Will (decision/offer/prediction)"}], "items": [{"t": "I’m going to book a hotel.", "cat": "plan"}, {"t": "We’re meeting at 6 p.m.", "cat": "arr"}, {"t": "Okay, I’ll call the hotel.", "cat": "will"}, {"t": "It will rain tomorrow.", "cat": "will"}, {"t": "I’m not going to rent a car.", "cat": "plan"}, {"t": "We’re flying on Friday.", "cat": "arr"}, {"t": "I’ll help you with your bags.", "cat": "will"}, {"t": "Are you going to visit Spain?", "cat": "plan"}], "hint": "Plan decided (going to) / arrangement with time/date (V-ing) / will = now/offer/prediction."};
  const TRAIN={"easy": [{"id": "te1", "p": "Choose the best form (plan): I ___ buy tickets.", "choices": ["am going to", "am buying", "will"], "a": 0, "h": "Plan decided → going to"}, {"id": "te2", "p": "Choose the best form (arrangement): We ___ at 6.", "choices": ["are meeting", "will meet", "are going to meet"], "a": 0, "h": "Arrangement + time → present continuous"}, {"id": "te3", "p": "Choose the best form (decision now): Okay, I ___.", "choices": ["will do it", "am going to do it", "am doing it"], "a": 0, "h": "Decision now → will"}, {"id": "te4", "p": "Choose the best form (prediction): It ___ be sunny.", "choices": ["will", "am meeting", "am going to (plan)"], "a": 0, "h": "Prediction → will"}], "medium": [{"id": "tm1", "p": "Choose the correct question (plan):", "choices": ["Are you going to book?", "Do you going to book?", "Will you going to book?"], "a": 0, "h": "Are you going to + verb"}, {"id": "tm2", "p": "Choose the correct negative (will):", "choices": ["It won’t rain.", "It not will rain.", "It isn’t will rain."], "a": 0, "h": "won’t = will not"}, {"id": "tm3", "p": "Choose the correct arrangement question:", "choices": ["Are you meeting on Friday?", "Do you meeting on Friday?", "Will you meeting on Friday?"], "a": 0, "h": "Are you + V-ing"}], "hard": [{"id": "th1", "p": "Best choice: We decided yesterday. We ___ visit Seville.", "choices": ["are going to", "will", "are visiting (no time)"], "a": 0, "h": "Plan decided → going to"}, {"id": "th2", "p": "Best choice: (phone call now) — ‘I can’t. ___ call you later.’", "choices": ["I’ll", "I’m going to", "I’m calling"], "a": 0, "h": "Decision now → will"}, {"id": "th3", "p": "Best choice: Fixed schedule: ‘We ___ on Friday at 9 a.m.’", "choices": ["are flying", "will fly", "are going to fly"], "a": 0, "h": "Arrangement with time/date → present continuous"}]};
  const LISTENING=[{"id": "l1", "title": "Trip planning (going to)", "lines": [{"who": "Karine", "side": "b", "say": "I’m going to visit Spain in July."}, {"who": "Friend", "side": "a", "say": "Great! Are you going to book a hotel soon?"}, {"who": "Karine", "side": "b", "say": "Yes. I’m going to book a hotel tonight."}, {"who": "Friend", "side": "a", "say": "Nice. First book the hotel, then buy tickets."}]}, {"id": "l2", "title": "Arrangement (present continuous)", "lines": [{"who": "Friend", "side": "a", "say": "What are you doing on Friday?"}, {"who": "Karine", "side": "b", "say": "We’re flying on Friday morning."}, {"who": "Friend", "side": "a", "say": "Are you meeting anyone there?"}, {"who": "Karine", "side": "b", "say": "Yes, I’m meeting my friend at 6 p.m."}]}, {"id": "l3", "title": "Will (offer + prediction)", "lines": [{"who": "Staff", "side": "a", "say": "It’s raining. Do you need an umbrella?"}, {"who": "Karine", "side": "b", "say": "Yes, please. Thank you."}, {"who": "Staff", "side": "a", "say": "I’ll get one for you."}, {"who": "Karine", "side": "b", "say": "Great. I think it will rain all day."}]}];
  const LQ={"l1": [["When is she going to visit Spain?", "In July", "Tomorrow", "Next week", 0], ["When will she book the hotel?", "Tonight", "On Friday", "At 6 p.m.", 0], ["Which form is used for plans?", "going to", "present continuous", "past simple", 0], ["Sequence words:", "First / then", "Because / so", "However / but", 0], ["Is she going to book soon?", "Yes", "No", "Not mentioned", 0]], "l2": [["When are they flying?", "On Friday morning", "Tonight", "In July", 0], ["Is it a plan or an arrangement?", "Arrangement", "Prediction", "Past", 0], ["What time is she meeting her friend?", "6 p.m.", "9 a.m.", "3 p.m.", 0], ["Question form used:", "Are you meeting…?", "Do you meeting…?", "Will you meeting…?", 0], ["Which form is used with time/date?", "present continuous", "past simple", "comparatives", 0]], "l3": [["What does staff offer?", "An umbrella", "A ticket", "A refund", 0], ["Staff says:", "I’ll get one for you.", "I’m going to get one for you.", "I’m getting one yesterday.", 0], ["Karine predicts:", "It will rain all day.", "It is raining yesterday.", "It is meeting.", 0], ["Will is used for:", "offer/prediction", "past plan", "comparatives", 0], ["Weather now:", "raining", "snowing", "sunny", 0]]};
  const WRITING={"title": "Future Planner Builder (A1 → A2/B1)", "steps": [{"label": "1) Destination", "opts": ["Spain", "Brazil", "Crete"]}, {"label": "2) Time", "opts": ["in July", "in August", "next month"]}, {"label": "3) Plan (going to)", "opts": ["book a hotel", "buy tickets", "rent a car", "visit a museum"]}, {"label": "4) Arrangement (present continuous)", "opts": ["meeting my friend at 6 p.m.", "flying on Friday", "staying at a small hotel", "taking the bus at 9 a.m."]}, {"label": "5) Will (decision/offer/prediction)", "opts": ["call the hotel now", "help with the bags", "pay by card", "be busy"]}, {"label": "6) Connector", "opts": ["First", "Then", "After that", "Finally"]}, {"label": "7) Extra connector", "opts": ["because", "so", "however", "(none)"]}, {"label": "8) Ending", "opts": ["I’m excited!", "I think it will be great.", "I’ll be careful with my budget.", "I’ll send you the details."]}], "hint": "Use 1 plan (going to) + 1 arrangement (V‑ing) + 1 will sentence."};
  const ROLEPLAY={"a": "I’m going to visit Spain in July. I’m going to book a hotel tonight. Are you going to come with me?", "b": "We’re flying on Friday at 9 a.m. I’m meeting my friend at 6 p.m. Are you staying in a hotel too?", "c": "Okay, I’ll call the hotel now. I’ll pay by card. I think it will be busy, so I’ll book in advance."};

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
      tap(btn,()=>{ const hidden=box.classList.contains("hidden");
        if(hidden){ box.classList.remove("hidden"); V.revealed.add(key); btn.textContent="🙈 Hide"; }
        else { box.classList.add("hidden"); V.revealed.delete(key); btn.textContent="👀 Reveal"; }
      });
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

  // Runner helper (MCQ + Trainer)
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
      fb.classList.add("hidden");
      render();
    }
    function hint(){
      if(!S.cur) return;
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.textContent="💡 "+(S.cur.hint||S.cur.h||"Think about the meaning.");
    }
    function check(){
      if(!S.cur) return;
      const c=document.querySelector(`input[name="${name}"]:checked`);
      fb.classList.remove("hidden","ok","no");
      if(!c){ fb.classList.add("no"); fb.textContent="Choose an answer first."; return; }
      const ans=parseInt(c.value,10);
      const ok=(S.cur.ans!==undefined)? ans===S.cur.ans : ans===S.cur.a;
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
    zone.addEventListener("drop",(e)=>{
      e.preventDefault();
      const w=e.dataTransfer.getData("text/plain");
      const tok=Array.from(bank.querySelectorAll(".token")).find(x=>x.dataset.word===w && !x.classList.contains("is-used"));
      if(tok) add(tok);
    });
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
    const built=[q.first].concat($$(".token", zone).map(t=>t.textContent.trim())).join(" ")
      .replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
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
      tap(t,()=>{
        const next=Array.from(sent.querySelectorAll("[data-b]")).find(b=>b.textContent==="____");
        if(!next) return;
        next.textContent=w;
        t.classList.add("is-used");
      });
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
    const built=$("#bankHost").querySelector("#bankSentence").textContent
      .replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
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
      <div class="grid3" style="margin-top:.55rem">${SORT_TASK.cats.map(c=>`<div class="kcard"><strong>${esc(c.label)}</strong><div class="zone" data-cat="${esc(c.id)}" style="margin-top:.45rem"></div></div>`).join("")}</div>
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
      z.addEventListener("drop",(e)=>{
        e.preventDefault();
        const txt=e.dataTransfer.getData("text/plain");
        const tok=Array.from(host.querySelectorAll(".token")).find(x=>x.textContent===txt);
        if(tok) z.appendChild(tok);
      });
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
  function setupRoleplays(){
    $("#rpA").textContent=ROLEPLAY.a;
    $("#rpB").textContent=ROLEPLAY.b;
    $("#rpC").textContent=ROLEPLAY.c;
    $$("[data-rp][data-act]").forEach(btn=>{
      const key=btn.dataset.rp, act=btn.dataset.act;
      const box= key==="a"?$("#rpA"):key==="b"?$("#rpB"):$("#rpC");
      tap(btn,()=>{
        if(act==="show") box.classList.remove("hidden");
        if(act==="hide") box.classList.add("hidden");
        if(act==="listen") TTS.say(box.textContent || ROLEPLAY[key]);
      });
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

  // Builder
  let buildLevel="A1";
  function setBuildLevel(level){
    buildLevel=level;
    $("#lvlA1").classList.toggle("is-on", level==="A1");
    $("#lvlA2").classList.toggle("is-on", level==="A2");
    $("#lvlB1").classList.toggle("is-on", level==="B1");
    updateBuildOut();
  }
  function renderBuilder(){
    const host=$("#buildHost");
    host.innerHTML = `<div class="kcard"><strong>${esc(WRITING.title)}</strong><div class="tiny" style="color:rgba(14,31,36,.72)">${esc(WRITING.hint)}</div></div>
      <div id="bb"></div>
      <div class="kcard" style="margin-top:.55rem"><strong>Your plan:</strong><br/><span id="buildOut"></span></div>`;
    const bb=host.querySelector("#bb");
    bb.innerHTML = WRITING.steps.map((st,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>${esc(st.label)}</strong></div>
      <select class="select" data-step="${i}">${st.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
    </div>`).join("");
    $$("select[data-step]", bb).forEach(sel=>sel.addEventListener("change", updateBuildOut));
    updateBuildOut();
  }
  function updateBuildOut(){
    const vals=$$("select[data-step]", $("#buildHost")).map(s=>s.value);
    const dest=vals[0], time=vals[1], plan=vals[2], arr=vals[3], willDo=vals[4], seq=vals[5], extra=vals[6], end=vals[7];

    let out = `I’m going to visit ${dest} ${time}. I’m going to ${plan}. ${end}`;

    if(buildLevel==="A2"){
      out = `I’m going to visit ${dest} ${time}. ${seq}, I’m going to ${plan}. I’m ${arr}. ${end}`;
      if(extra==="because") out += " I’m doing this because I want to be organized.";
      if(extra==="so") out += " It might be busy, so I’ll book early.";
      if(extra==="however") out += " However, I’ll stay flexible.";
    }

    if(buildLevel==="B1"){
      out = `I’m going to visit ${dest} ${time}. ${seq}, I’m going to ${plan}. I’m ${arr}.`;
      out += ` Okay, I’ll ${willDo}. ${end}`;
      if(extra==="because") out += " I’m planning in advance because prices change quickly.";
      if(extra==="so") out += " It might be busy, so I’ll book everything early.";
      if(extra==="however") out += " However, if the weather is bad, I’ll change my plan.";
      out += " Overall, I think it will be a great trip.";
    }

    $("#buildOut").textContent = out;
  }
  function buildListen(){ const t=$("#buildOut").textContent.trim(); if(t) TTS.say(t); }
  function buildCheck(){
    const txt=$("#buildOut").textContent;
    const hasGoingTo=/going to/i.test(txt);
    const hasArr=/I’m (meeting|flying|staying|taking)/i.test(txt);
    const hasWill=/\bI’ll\b|\bwill\b/i.test(txt);
    const hasConn=/(First|Then|After that|Finally|because|so|however)/i.test(txt);

    const fb=$("#buildFb"); fb.classList.remove("hidden","ok","no");
    let ok=true;
    let msg="✅ Nice!";

    if(!hasGoingTo){ ok=false; msg="❌ Add at least one going to sentence (plan)."; }
    else if(buildLevel!=="A1" && !hasArr){ ok=false; msg="❌ Add one arrangement (I’m meeting / We’re flying…)."; }
    else if(buildLevel==="B1" && !hasWill){ ok=false; msg="❌ Add one will sentence (I’ll… / it will…)."; }
    else if(buildLevel!=="A1" && !hasConn){ ok=false; msg="❌ Add at least one connector (Then / because / so / however)."; }

    fb.classList.add(ok?"ok":"no");
    fb.textContent=msg;
    if(ok) Score.award("builder:"+buildLevel, buildLevel==="A1"?3:buildLevel==="A2"?5:7);
  }
  function buildReset(){ renderBuilder(); $("#buildFb").classList.add("hidden"); }

  // Reset all
  function resetAll(){
    TTS.stop(); Score.reset();
    V.revealed.clear(); V.cat="All";
    $("#vFb").classList.add("hidden");
    mcq.reset(); ddReset(); ordReset(); bankReset(); sortReset();
    tr.reset(); setTR("easy");
    setupRoleplays();
    loadLis(LISTENING[0].id);
    buildReset(); setBuildLevel("A1");
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  async function init(){
    if(localStorage.getItem(KEYS.auto)===null) TTS.setAuto(false); // default OFF

    Score.setMax(80);
    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});

    tap($("#btnTestVoice"),()=>TTS.say("Hello! Are you going to travel next month?"));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnStart"),()=>document.getElementById("secVocab").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose US or UK accent.\n2) Vocabulary (tap cards + listen).\n3) Grammar (rules + examples).\n4) Exercises + Future Trainer.\n5) Roleplays.\n6) Listening with transcript toggle.\n7) Planner Builder (A1/A2/B1)."));

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
    tap($("#lisShow"),()=>{Lis.show=true; renderLis();});
    tap($("#lisHide"),()=>{Lis.show=false; renderLis();});
    tap($("#lisCheck"),()=>lisCheckQ());
    tap($("#lisReset"),()=>lisResetQ());

    renderBuilder();
    setBuildLevel("A1");
    tap($("#lvlA1"),()=>setBuildLevel("A1"));
    tap($("#lvlA2"),()=>setBuildLevel("A2"));
    tap($("#lvlB1"),()=>setBuildLevel("B1"));
    tap($("#buildListen"),()=>buildListen());
    tap($("#buildCheck"),()=>buildCheck());
    tap($("#buildReset"),()=>buildReset());

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();
})();
