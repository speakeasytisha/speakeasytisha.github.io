/* SpeakEasyTisha — Barbie Beach Club · Sardinia Review Studio (A1/A2)
Build: 20260525-203227
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
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h);} 
    else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };

  const VOCAB=[{"cat": "Sardinia trip", "icon": "🏝️", "w": "beach", "fr": "plage", "def": "sand and sea place", "ex": "You want to go to the beach today."}, {"cat": "Sardinia trip", "icon": "🌊", "w": "sea", "fr": "mer", "def": "the ocean near the beach", "ex": "The sea is warm in summer."}, {"cat": "Sardinia trip", "icon": "🚗", "w": "rent a car", "fr": "louer une voiture", "def": "pay to use a car", "ex": "You’re going to rent a car."}, {"cat": "Sardinia trip", "icon": "🗺️", "w": "island", "fr": "île", "def": "land with water around it", "ex": "Sardinia is an island."}, {"cat": "Sardinia trip", "icon": "⛴️", "w": "ferry", "fr": "ferry", "def": "boat for people/cars", "ex": "You can take a ferry."}, {"cat": "Sardinia trip", "icon": "🍝", "w": "local food", "fr": "cuisine locale", "def": "food from the region", "ex": "You want to try local food."}, {"cat": "Sardinia trip", "icon": "🧴", "w": "sunscreen", "fr": "crème solaire", "def": "protection from the sun", "ex": "You need sunscreen."}, {"cat": "Sardinia trip", "icon": "💧", "w": "bottled water", "fr": "eau en bouteille", "def": "water in a bottle", "ex": "Can I have bottled water, please?"}, {"cat": "Hotel + restaurant", "icon": "🛎️", "w": "check in", "fr": "faire le check-in", "def": "arrive and get your room", "ex": "You check in at 3 p.m."}, {"cat": "Hotel + restaurant", "icon": "🧾", "w": "bill", "fr": "addition / facture", "def": "paper showing the price", "ex": "Could I have the bill, please?"}, {"cat": "Hotel + restaurant", "icon": "➕", "w": "tax included", "fr": "taxe incluse", "def": "tax is already in the price", "ex": "Is tax included?"}, {"cat": "Hotel + restaurant", "icon": "🥐", "w": "breakfast included", "fr": "petit-déjeuner inclus", "def": "breakfast is part of price", "ex": "Is breakfast included?"}, {"cat": "Hotel + restaurant", "icon": "🍽️", "w": "menu", "fr": "menu", "def": "list of food", "ex": "Can I see the menu, please?"}, {"cat": "Hotel + restaurant", "icon": "🥗", "w": "starter / main / dessert", "fr": "entrée / plat / dessert", "def": "meal parts", "ex": "For starters, you’d like salad."}, {"cat": "Directions", "icon": "⬅️", "w": "on the left", "fr": "à gauche", "def": "left side", "ex": "The bathroom is on the left."}, {"cat": "Directions", "icon": "➡️", "w": "on the right", "fr": "à droite", "def": "right side", "ex": "The café is on the right."}, {"cat": "Directions", "icon": "⬆️", "w": "straight ahead", "fr": "tout droit", "def": "continue forward", "ex": "Go straight ahead."}, {"cat": "Directions", "icon": "📍", "w": "near / far", "fr": "près / loin", "def": "close / not close", "ex": "It’s near the beach."}, {"cat": "Directions", "icon": "🧭", "w": "next to", "fr": "à côté de", "def": "beside", "ex": "The pharmacy is next to the hotel."}, {"cat": "Directions", "icon": "📌", "w": "in / on / at", "fr": "dans / sur / à", "def": "place prepositions", "ex": "You’re in Sardinia. The keys are on the table."}, {"cat": "Connectors + opinions", "icon": "🧩", "w": "first / then / after that / finally", "fr": "d’abord / puis / ensuite / enfin", "def": "sequence words", "ex": "First you check in, then you go to the beach."}, {"cat": "Connectors + opinions", "icon": "💬", "w": "I think…", "fr": "Je pense que…", "def": "give an opinion", "ex": "I think this beach is beautiful."}, {"cat": "Connectors + opinions", "icon": "💬", "w": "because", "fr": "parce que", "def": "give a reason", "ex": "It’s great because it’s calm."}, {"cat": "Connectors + opinions", "icon": "✨", "w": "better / best", "fr": "meilleur / le meilleur", "def": "comparative/superlative", "ex": "This hotel is better. That one is the best."}, {"cat": "Connectors + opinions", "icon": "💸", "w": "cheaper / the cheapest", "fr": "moins cher / le moins cher", "def": "price comparison", "ex": "This restaurant is cheaper."}];
  const VOCAB_CATS=["Connectors + opinions", "Directions", "Hotel + restaurant", "Sardinia trip"];
  const GRAMMAR={"syntax": {"title": "Syntax rescue: basic word order", "rule": ["English order: Subject + Verb + Object + Place + Time", "Example: You booked a hotel in Sardinia last week.", "Questions: Do/Does + subject + base verb…? (Do you like it?)", "Did + base verb for past questions (Did you go?)"], "examples": ["You want a table tonight.", "Do you need bottled water?", "You booked a hotel in Sardinia."], "note": "If you feel lost: find the subject first (I/you/we). Then the verb."}, "thereIsAre": {"title": "There is / There are + some/any", "rule": ["There is + singular/uncountable (There is water.)", "There are + plural (There are towels.)", "Some = positive / polite request: Could I have some water?", "Any = questions/negatives: Is there any water? There isn’t any water."], "examples": ["Is there any bottled water?", "There are some restaurants near the beach."], "note": "‘Some’ is common in polite requests."}, "presentVsContinuous": {"title": "Present simple vs present continuous (now)", "rule": ["Present simple = routine/fact: You go to the beach every day.", "Present continuous = now/temporary: You are staying in a hotel this week.", "Signals: now / today / this week often → present continuous."], "examples": ["You are visiting Sardinia this summer.", "You usually eat breakfast at 8."], "note": "For travel, ‘I’m staying / I’m visiting’ is very useful."}, "future": {"title": "Future recap: going to / present continuous / will", "rule": ["Going to = plan/intention: You’re going to rent a car.", "Present continuous = fixed arrangement: You’re meeting friends at 7.", "Will = instant decision / offer: I’ll pay. I’ll help you."], "examples": ["You’re going to go to the beach tomorrow.", "I’ll get the bill."], "note": "If you planned it before → going to."}, "comparatives": {"title": "Comparatives & superlatives (easy rules)", "rule": ["Short adjectives: cheap → cheaper → the cheapest; big → bigger → the biggest", "Long adjectives: beautiful → more beautiful → the most beautiful", "Use than: This beach is calmer than that beach."], "examples": ["This hotel is cheaper than that one.", "This is the most beautiful beach."], "note": "Use comparisons to explain your choices."}};
  const GRAMMAR_CATS=[{"id": "syntax", "label": "Syntax rescue (word order)"}, {"id": "thereIsAre", "label": "There is/are + some/any"}, {"id": "presentVsContinuous", "label": "Present simple vs continuous"}, {"id": "future", "label": "Future recap (going to / will)"}, {"id": "comparatives", "label": "Comparatives & superlatives"}];
  const MCQ=[{"id": "m1", "topic": "syntax", "prompt": "Choose the correct order:", "choices": ["You tomorrow go to the beach.", "You are going to the beach tomorrow.", "Tomorrow you beach go."], "ans": 1, "hint": "Subject + are + going to + place + time."}, {"id": "m2", "topic": "syntax", "prompt": "Choose the correct question:", "choices": ["Do you like this hotel?", "Like you this hotel?", "You like do this hotel?"], "ans": 0, "hint": "Do + subject + base verb."}, {"id": "m3", "topic": "thereIsAre", "prompt": "Choose the best: ___ any bottled water?", "choices": ["Is there", "Are there", "There is"], "ans": 0, "hint": "Water is uncountable → Is there…?"}, {"id": "m4", "topic": "thereIsAre", "prompt": "Choose the best: There ___ some restaurants near here.", "choices": ["is", "are", "be"], "ans": 1, "hint": "Restaurants = plural → are."}, {"id": "m5", "topic": "presentVsContinuous", "prompt": "Choose the best: (now/this week)", "choices": ["You stay in a hotel this week.", "You are staying in a hotel this week.", "You staying in a hotel."], "ans": 1, "hint": "Now/temporary → present continuous."}, {"id": "m6", "topic": "presentVsContinuous", "prompt": "Choose the best: (routine)", "choices": ["You are usually eating at 8.", "You usually eat at 8.", "You eat usually at 8."], "ans": 1, "hint": "Routine → present simple. Adverb before the verb."}, {"id": "m7", "topic": "future", "prompt": "Choose the best: (plan)", "choices": ["You will rent a car tomorrow (planned).", "You are going to rent a car tomorrow.", "You rent a car tomorrow."], "ans": 1, "hint": "Planned intention → going to."}, {"id": "m8", "topic": "future", "prompt": "Choose the best: (instant decision)", "choices": ["I’m going to pay now!", "I’ll pay.", "I pay will."], "ans": 1, "hint": "Instant decision → will."}, {"id": "m9", "topic": "comparatives", "prompt": "Choose the best: cheap → ___", "choices": ["cheaper", "more cheap", "cheapest"], "ans": 0, "hint": "Short adjective → cheaper."}, {"id": "m10", "topic": "comparatives", "prompt": "Choose the best: beautiful → ___", "choices": ["beautifuller", "more beautiful", "the beautifulest"], "ans": 1, "hint": "Long adjective → more beautiful."}];
  const DROPDOWNS=[{"id": "d1", "topic": "thereIsAre", "prompt": "Complete: There ___ a beach near the hotel.", "opts": ["is", "are", "am"], "ans": 0, "hint": "Singular → is."}, {"id": "d2", "topic": "thereIsAre", "prompt": "Complete: Are there ___ towels?", "opts": ["any", "some", "much"], "ans": 0, "hint": "Question → any."}, {"id": "d3", "topic": "future", "prompt": "Complete: You are ___ to rent a car.", "opts": ["going", "go", "went"], "ans": 0, "hint": "going to"}, {"id": "d4", "topic": "presentVsContinuous", "prompt": "Complete: You ___ staying in Sardinia this week.", "opts": ["are", "is", "do"], "ans": 0, "hint": "You are…"}, {"id": "d5", "topic": "comparatives", "prompt": "Complete: This hotel is ___ than that one.", "opts": ["cheaper", "cheap", "the cheapest"], "ans": 0, "hint": "cheaper than"}, {"id": "d6", "topic": "syntax", "prompt": "Complete: ___ you need bottled water?", "opts": ["Do", "Does", "Did"], "ans": 0, "hint": "Do + you"}];
  const ORDER_TASKS=[{"id": "o1", "topic": "syntax", "first": "You", "words": ["are", "going", "to", "the", "beach", "tomorrow", "."], "target": "You are going to the beach tomorrow.", "hint": "Subject + are + going to + place + time."}, {"id": "o2", "topic": "thereIsAre", "first": "Is", "words": ["there", "any", "bottled", "water", "?"], "target": "Is there any bottled water?", "hint": "Is there + any + uncountable?"}, {"id": "o3", "topic": "comparatives", "first": "This", "words": ["hotel", "is", "cheaper", "than", "that", "one", "."], "target": "This hotel is cheaper than that one.", "hint": "cheaper than"}, {"id": "o4", "topic": "syntax", "first": "Do", "words": ["you", "need", "the", "bill", "?"], "target": "Do you need the bill?", "hint": "Do + you + base verb"}];
  const BANK_TASKS=[{"id": "b1", "topic": "thereIsAre", "template": ["There", "is", "____", "water", "."], "bank": ["some", "any", "many"], "target": "There is some water.", "hint": "Positive → some."}, {"id": "b2", "topic": "thereIsAre", "template": ["Is", "there", "____", "water", "?"], "bank": ["any", "some", "many"], "target": "Is there any water?", "hint": "Question → any."}, {"id": "b3", "topic": "future", "template": ["You", "are", "going", "to", "____", "a", "car", "."], "bank": ["rent", "rented", "renting"], "target": "You are going to rent a car.", "hint": "going to + base verb"}, {"id": "b4", "topic": "presentVsContinuous", "template": ["You", "____", "staying", "in", "a", "hotel", "this", "week", "."], "bank": ["are", "is", "do"], "target": "You are staying in a hotel this week.", "hint": "You are…"}, {"id": "b5", "topic": "comparatives", "template": ["This", "beach", "is", "____", "than", "that", "one", "."], "bank": ["better", "best", "good"], "target": "This beach is better than that one.", "hint": "better than"}];
  const SORT_TASK={"id": "s1", "prompt": "Syntax puzzle: sort the words into the correct boxes (tap OR drag).", "cats": [{"id": "subj", "label": "Subject"}, {"id": "verb", "label": "Verb / Aux"}, {"id": "obj", "label": "Object"}, {"id": "place", "label": "Place"}, {"id": "time", "label": "Time"}], "items": [{"t": "You", "cat": "subj"}, {"t": "are going to", "cat": "verb"}, {"t": "rent a car", "cat": "obj"}, {"t": "in Sardinia", "cat": "place"}, {"t": "tomorrow", "cat": "time"}], "hint": "Think: who? → verb → what? → where? → when?"};
  const LISTENING=[{"id": "l1", "title": "Hotel check‑in (Sardinia)", "lines": [{"who": "Reception", "side": "a", "say": "Hello! Welcome. Do you have a reservation?"}, {"who": "You", "side": "b", "say": "Yes, I do. I booked a room for two nights."}, {"who": "Reception", "side": "a", "say": "Great. Breakfast is included. Check‑in is at 3 p.m."}, {"who": "You", "side": "b", "say": "Perfect. Is there any bottled water in the room?"}]}, {"id": "l2", "title": "Restaurant (bill + polite)", "lines": [{"who": "Server", "side": "a", "say": "How was everything?"}, {"who": "You", "side": "b", "say": "It was great, thank you. Could I have the bill, please?"}, {"who": "Server", "side": "a", "say": "Of course. Would you like to pay by card or cash?"}, {"who": "You", "side": "b", "say": "By card, please."}]}, {"id": "l3", "title": "Planning (future + connectors)", "lines": [{"who": "Ken (surfer buddy)", "side": "a", "say": "What are you going to do tomorrow?"}, {"who": "You", "side": "b", "say": "First, I’m going to rent a car. Then, I’m going to visit a beach."}, {"who": "Ken (surfer buddy)", "side": "a", "say": "Nice! Which beach is better?"}, {"who": "You", "side": "b", "say": "I think this one is better because it’s calmer."}]}];
  const LQ={"l1": [["Do you have a reservation?", "Yes", "No", "Not mentioned", 0], ["Breakfast is…", "included", "not included", "unknown", 0], ["Check‑in time is…", "3 p.m.", "8 a.m.", "12 p.m.", 0], ["You ask about…", "bottled water", "a taxi", "a refund", 0], ["The question form uses…", "Do / Is", "Did / Was", "Am / Are", 0]], "l2": [["You ask for…", "the bill", "the keys", "a map", 0], ["You will pay…", "by card", "by cash", "later", 0], ["Server asks…", "card or cash", "tax or time", "hotel or beach", 0], ["Your tone is…", "polite", "angry", "rude", 0], ["The phrase is…", "Could I have…?", "Give me…", "I want…", 0]], "l3": [["Tomorrow you plan to…", "rent a car", "work", "stay home", 0], ["You use connectors like…", "First / Then", "Yesterday / Last", "Because / Although", 0], ["Ken asks…", "Which beach is better?", "Where is the bathroom?", "How much is it?", 0], ["You say it is better because…", "it’s calmer", "it’s colder", "it’s far", 0], ["This dialogue practises…", "future + comparatives", "past only", "numbers only", 0]]};
  const BUILDER={"title": "Sardinia Plan Builder (A1 → A2/B1)", "steps": [{"label": "1) Start", "opts": ["Hello!", "Hi!", "Good morning.", "Good evening."]}, {"label": "2) Plan (going to)", "opts": ["I’m going to rent a car.", "I’m going to go to the beach.", "I’m going to try local food.", "I’m going to visit a town."]}, {"label": "3) Connector", "opts": ["First", "Then", "After that", "Finally"]}, {"label": "4) Second plan", "opts": ["I’m going to swim.", "I’m going to buy bottled water.", "I’m going to have dinner.", "I’m going to take photos."]}, {"label": "5) Comparison", "opts": ["This beach is better than that one.", "This hotel is cheaper than that one.", "This restaurant is more beautiful than that one.", "This place is the best."]}, {"label": "6) Reason", "opts": ["because it’s calm.", "because it’s near the sea.", "because it’s cheaper.", "because the food is great."]}, {"label": "7) Useful question", "opts": ["Is there any bottled water?", "Could I have the bill, please?", "Is breakfast included?", "Is there a beach near here?"]}], "hint": "A1: 2 short sentences. A2/B1: add a connector + comparison + because."};
  const FINAL=[{"id": "f1", "p": "Choose: There ___ a beach near here.", "choices": ["is", "are", "am"], "a": 0, "h": "singular"}, {"id": "f2", "p": "Choose: Are there ___ towels?", "choices": ["any", "some", "many"], "a": 0, "h": "question → any"}, {"id": "f3", "p": "Choose: planned future", "choices": ["I’m going to rent a car.", "I will rent a car (planned).", "I rented a car tomorrow."], "a": 0, "h": "going to"}, {"id": "f4", "p": "Choose: routine", "choices": ["You usually eat at 8.", "You are usually eating at 8.", "You eat at usually 8."], "a": 0, "h": "usually before verb"}, {"id": "f5", "p": "Choose: Do you ___ bottled water?", "choices": ["need", "needed", "needing"], "a": 0, "h": "base verb"}, {"id": "f6", "p": "Choose: cheap →", "choices": ["cheaper", "more cheap", "cheapest"], "a": 0, "h": "cheaper"}, {"id": "f7", "p": "Choose: beautiful →", "choices": ["more beautiful", "beautifuller", "the beautifulest"], "a": 0, "h": "more + adj"}, {"id": "f8", "p": "Choose: polite", "choices": ["Could I have the bill, please?", "Give me the bill.", "I want the bill."], "a": 0, "h": "Could I…"}, {"id": "f9", "p": "Choose: direction", "choices": ["Go straight ahead.", "Go ahead straight.", "Straight go ahead."], "a": 0, "h": "straight ahead"}, {"id": "f10", "p": "Choose: I think it’s great ___ it’s calm.", "choices": ["because", "than", "yesterday"], "a": 0, "h": "because = reason"}];

  // TTS
  const KEYS={lang:"k_barbie_lang", voice:"k_barbie_voice", auto:"k_barbie_auto"};
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
      u.rate=0.97; u.pitch=1.02;
      window.speechSynthesis.speak(u);
    }
  };

  // Score
  const Score={now:0,max:0,awarded:new Set(),
    setMax(n){this.max=n; upd();},
    award(k,pts=1){ if(this.awarded.has(k)) return; this.awarded.add(k); this.now+=pts; upd(); },
    reset(){ this.now=0; this.awarded.clear(); upd(); }
  };
  function upd(){
    $("#scoreNow").textContent=String(Score.now);
    $("#scoreMax").textContent=String(Score.max);
    const pct=Score.max?Math.round((Score.now/Score.max)*100):0;
    $("#progressBar").style.width=Math.max(0,Math.min(100,pct))+"%";
  }

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

  // Vocabulary hub
  const V={cat:VOCAB_CATS[0]||"All", revealed:new Set()};
  function renderVocabCats(){
    const sel=$("#vCat");
    sel.innerHTML = VOCAB_CATS.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
    sel.value=V.cat;
    sel.addEventListener("change",()=>{V.cat=sel.value; renderVGrid();});
  }
  function renderVGrid(){
    const grid=$("#vGrid"); grid.innerHTML="";
    const list = VOCAB.filter(x=>x.cat===V.cat);
    list.forEach(it=>{
      const key=it.cat+"::"+it.w;
      const open=V.revealed.has(key);
      const card=document.createElement("div");
      card.className="card vocabCard";
      card.innerHTML=`<div class="vocabTop"><div class="vocabWord">${esc(it.icon)} ${esc(it.w)}</div>
        <div class="vocabBtns"><button class="toolmini" data-act="s">🔊</button><button class="toolmini" data-act="t">${open?"🙈 Hide":"👀 Reveal"}</button></div></div>
        <div class="kcard ${open?"":"hidden"}" data-box="b">
          <div><strong>Meaning:</strong> ${esc(it.def)}</div>
          <div style="color:var(--muted);font-weight:850"><strong>FR:</strong> ${esc(it.fr)}</div>
          <div><strong>Example:</strong> ${esc(it.ex)}</div>
        </div>`;
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
    const list=VOCAB.filter(x=>x.cat===V.cat);
    const sample=shuffle(list).slice(0, Math.min(6, list.length));
    const fb=$("#vFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("ok"); fb.innerHTML="";
    const wrap=document.createElement("div"); wrap.className="kcard";
    wrap.innerHTML=`<strong>${esc(V.cat)} · Quick Quiz (${sample.length})</strong><div class="tiny" style="color:var(--muted)">Choose the best meaning.</div>`;
    const meta=[];
    sample.forEach((it,i)=>{
      const choices=shuffle([it.def,"a bus ticket","a beach towel"]);
      meta.push({ans:choices.indexOf(it.def)});
      wrap.innerHTML += `<div class="kcard" style="margin-top:.55rem"><div><strong>Q${i+1}:</strong> ${esc(it.w)}</div>`+
        choices.map((c,ci)=>`<label class="choice"><input type="radio" name="vq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")+
      `</div>`;
    });
    wrap.innerHTML += `<div class="smallrow"><button class="btn" id="vqCheck">✅ Check</button><button class="btn btn--ghost" id="vqClose">✖ Close</button></div><div class="feedback hidden" id="vqFb"></div>`;
    fb.appendChild(wrap);
    tap($("#vqClose"),()=>{fb.classList.add("hidden"); fb.textContent="";});
    tap($("#vqCheck"),()=>{
      let correct=0;
      meta.forEach((m,i)=>{
        const c=document.querySelector(`input[name="vq${i}"]:checked`);
        if(c && parseInt(c.value,10)===m.ans) correct++;
      });
      const b=$("#vqFb"); b.classList.remove("hidden","ok","no"); b.classList.add(correct>=Math.max(4, sample.length-1)?"ok":"no");
      b.textContent=`Score: ${correct}/${sample.length}`;
      Score.award(`vocabQuiz:${V.cat}`, correct);
    });
  }

  // Grammar hub
  const G={id:GRAMMAR_CATS[0]?.id || "syntax"};
  let gMcqList=[], gDdList=[], gIndex=0;
  function renderGrammarPick(){
    const sel=$("#gPick");
    sel.innerHTML = GRAMMAR_CATS.map(c=>`<option value="${esc(c.id)}">${esc(c.label)}</option>`).join("");
    sel.value=G.id;
    sel.addEventListener("change",()=>{G.id=sel.value; renderGrammar(); resetGPractice(true);});
  }
  function renderGrammar(){
    const g=GRAMMAR[G.id];
    const host=$("#gHost");
    host.innerHTML = "";
    const left=document.createElement("div"); left.className="kcard";
    left.innerHTML = `<div class="badge">Rule</div><div style="margin-top:.4rem">${g.rule.map(r=>"• "+esc(r)).join("<br/>")}</div><div class="tiny" style="color:var(--muted);margin-top:.45rem">${esc(g.note||"")}</div>`;
    const right=document.createElement("div"); right.className="kcard";
    right.innerHTML = `<div class="badge">Examples</div><div style="margin-top:.4rem">${g.examples.map(r=>"• "+esc(r)).join("<br/>")}</div>`;
    host.appendChild(left); host.appendChild(right);
  }

  function resetGPractice(scroll=false){
    gMcqList = MCQ.filter(x=>x.topic===G.id);
    gDdList = DROPDOWNS.filter(x=>x.topic===G.id);
    gIndex = 0;
    renderGPractice();
    $("#gFb").classList.add("hidden");
    if(scroll){ $("#gMcqHost").scrollIntoView({behavior:"smooth", block:"start"}); }
  }
  function renderGPractice(){
    const mcq=$("#gMcqHost");
    const dd=$("#gDdHost");
    const m = gMcqList.length ? gMcqList[gIndex % gMcqList.length] : null;
    const d = gDdList.length ? gDdList[gIndex % gDdList.length] : null;

    mcq.innerHTML = m ? (`<div class="badge">MCQ</div><div style="margin-top:.35rem"><strong>${esc(m.prompt)}</strong></div>`+
        m.choices.map((c,i)=>`<label class="choice"><input type="radio" name="gmcq" value="${i}"/><div>${esc(c)}</div></label>`).join("")) : "No MCQ for this lesson.";
    dd.innerHTML = d ? (`<div class="badge">Dropdown</div><div style="margin-top:.35rem"><strong>${esc(d.prompt)}</strong></div>`+
        `<select class="select" id="gddSel">${d.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`) : "No dropdown for this lesson.";
  }
  function gHint(){
    const fb=$("#gFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
    const m=gMcqList.length ? gMcqList[gIndex % gMcqList.length] : null;
    const d=gDdList.length ? gDdList[gIndex % gDdList.length] : null;
    const msg = [m?.hint, d?.hint].filter(Boolean).join(" / ");
    fb.textContent = "💡 " + (msg || "Think about the rule.");
  }
  function gCheck(){
    const fb=$("#gFb"); fb.classList.remove("hidden","ok","no");
    let okCount=0, total=0;

    if(gMcqList.length){
      total++;
      const m=gMcqList[gIndex % gMcqList.length];
      const c=document.querySelector('input[name="gmcq"]:checked');
      if(c && parseInt(c.value,10)===m.ans){ okCount++; Score.award(`gmcq:${m.id}`,2); }
    }
    if(gDdList.length){
      total++;
      const d=gDdList[gIndex % gDdList.length];
      const sel=$("#gddSel");
      if(sel){
        const val=parseInt(sel.value,10);
        if(val===d.ans){ okCount++; Score.award(`gdd:${d.id}`,2); }
      }
    }
    const ok = okCount===total && total>0;
    fb.classList.add(ok?"ok":"no");
    fb.textContent = ok ? "✅ Great! You’re doing it." : `❌ Not yet. You got ${okCount}/${total}. Use Hint.`;
  }
  function gNext(){ gIndex++; renderGPractice(); $("#gFb").classList.add("hidden"); }
  function gReset(){ gIndex=0; renderGPractice(); $("#gFb").classList.add("hidden"); }

  // Generic runner (warmup + final)
  function makeRunner(hostSel, fbSel, name, items, keyPrefix, pts=2){
    const S={order:[], idx:0, cur:null};
    const host=$(hostSel), fb=$(fbSel);
    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML = `<div><strong>${esc(S.cur.p)}</strong></div>`+
        S.cur.choices.map((c,i)=>`<label class="choice"><input type="radio" name="${name}" value="${i}"/><div>${esc(c)}</div></label>`).join("");
    }
    function start(){ S.order=shuffle(items.map(x=>x.id)); S.idx=0; next(true); }
    function next(fromStart=false){
      if(!S.order.length) return;
      if(!fromStart) S.idx++;
      if(S.idx>=S.order.length) S.idx=0;
      S.cur=items.find(x=>x.id===S.order[S.idx]);
      fb.classList.add("hidden"); render();
    }
    function hint(){ fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(S.cur?.h||""); }
    function check(){
      fb.classList.remove("hidden","ok","no");
      const c=document.querySelector(`input[name="${name}"]:checked`);
      if(!c){ fb.classList.add("no"); fb.textContent="Choose an answer first."; return; }
      const ans=parseInt(c.value,10);
      const ok=ans===S.cur.a;
      fb.classList.add(ok?"ok":"no");
      fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
      if(ok) Score.award(`${keyPrefix}:${S.cur.id}`, pts);
    }
    function reset(){ S.order=[]; S.cur=null; fb.classList.add("hidden"); host.textContent="Click Start."; }
    return {start,next,check,hint,reset};
  }

  const WARM = shuffle(FINAL).slice(0,6).map((x)=>({id:"w"+x.id, p:x.p, choices:x.choices, a:x.a, h:x.h}));
  const warm = makeRunner("#warmHost","#warmFb","warm",WARM,"warm",2);
  const final = makeRunner("#finalHost","#finalFb","final",FINAL,"final",2);

  // Sentence order builder
  const ordS={order:[], idx:0, cur:null};
  function ordRender(){
    const host=$("#ordHost");
    if(!ordS.cur){ host.textContent="Click Start."; return; }
    const q=ordS.cur;
    const words=shuffle(q.words.slice());
    host.innerHTML=`<div><strong>Build the sentence</strong></div>
      <div class="kcard"><strong>First word:</strong> ${esc(q.first)}</div>
      <div class="bank" id="ordBank"></div><div class="zone" id="ordZone"></div>
      <div class="tiny" style="color:var(--muted)">Tap words to add. Tap in the sentence to remove.</div>`;
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
    const built=[q.first].concat($$(".token", zone).map(t=>t.textContent.trim())).join(" ").replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#ordFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award(`ord:${q.id}`,4);
  }
  function ordReset(){ ordS.order=[]; ordS.cur=null; $("#ordFb").classList.add("hidden"); $("#ordHost").textContent="Click Start."; }

  // Word bank
  const bankS={order:[], idx:0, cur:null};
  function bankRender(){
    const host=$("#bankHost");
    if(!bankS.cur){ host.textContent="Click Start."; return; }
    const q=bankS.cur;
    const bank=shuffle(q.bank.slice());
    host.innerHTML=`<div><strong>Fill the blank</strong></div><div class="kcard" id="bankSentence"></div><div class="bank" id="bankWords"></div><div class="tiny" style="color:var(--muted)">Tap a word to fill the blank.</div>`;
    const sent=host.querySelector("#bankSentence");
    const words=host.querySelector("#bankWords");
    sent.innerHTML=q.template.map(x=>x==="____"?`<strong><span class="badge" data-b="1">____</span></strong>`:esc(x)).join(" ");
    bank.forEach(w=>{
      const t=document.createElement("span"); t.className="token"; t.textContent=w;
      tap(t,()=>{
        const b=sent.querySelector("[data-b]");
        if(b.textContent!=="____") return;
        b.textContent=w;
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
    const built=$("#bankHost").querySelector("#bankSentence").textContent.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award(`bank:${q.id}`,4);
  }
  function bankReset(){ bankS.order=[]; bankS.cur=null; $("#bankFb").classList.add("hidden"); $("#bankHost").textContent="Click Start."; }

  // Sorting
  function sortRender(){
    const host=$("#sortHost");
    host.innerHTML=`<div><strong>${esc(SORT_TASK.prompt)}</strong></div>
      <div class="smallrow" style="margin-top:.45rem"><div class="bank" id="sortBank"></div></div>
      <div class="grid3" style="margin-top:.55rem">${SORT_TASK.cats.map(c=>`<div class="kcard"><strong>${esc(c.label)}</strong><div class="zone" data-cat="${esc(c.id)}" style="margin-top:.45rem"></div></div>`).join("")}</div>
      <div class="tiny" style="color:var(--muted);margin-top:.45rem">Tap OR drag items into boxes.</div>`;
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
    fb.textContent=ok?"✅ Perfect! Syntax mastered.":"Score: "+correct+"/"+SORT_TASK.items.length;
    if(ok) Score.award("sort",8);
  }
  function sortReset(){ $("#sortFb").classList.add("hidden"); sortRender(); }

  // Roleplays
  const ROLEPLAY = {
    a:"(Hotel) Hello. I booked a room. Is breakfast included? — Yes, it is. — Great. Is there any bottled water in the room?",
    b:"(Restaurant) It was great, thank you. Could I have the bill, please? — Of course. — I’ll pay by card, please.",
    c:"(Planning) First, you’re going to rent a car. Then, you’re going to visit a beach. Which beach is better? — This one is better because it’s calmer."
  };
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
        if(act==="listen") TTS.say(box.textContent);
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
    Lis.cur=LISTENING.find(x=>x.id===id)||LISTENING[0];
    Lis.show=false;
    renderLis();
    renderLisQ();
    $("#lisQFb").classList.add("hidden");
  }
  function renderLis(){
    const d=Lis.cur; const stream=$("#lisStream"); stream.innerHTML="";
    d.lines.forEach(ln=>{
      const b=document.createElement("div"); b.className="bubble "+(ln.side==="a"?"a":"b");
      b.innerHTML=`<div class="who">${ln.side==="a"?"🟦":"💖"} ${esc(ln.who)}</div>
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
    if(ok) Score.award(`listening:${Lis.cur.id}`,8);
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
    host.innerHTML = `<div class="kcard"><strong>${esc(BUILDER.title)}</strong><div class="tiny" style="color:var(--muted)">${esc(BUILDER.hint)}</div></div>
      <div id="bb"></div>
      <div class="kcard" style="margin-top:.55rem"><strong>Your plan:</strong><br/><span id="buildOut"></span></div>`;
    const bb=host.querySelector("#bb");
    bb.innerHTML = BUILDER.steps.map((st,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>${esc(st.label)}</strong></div>
      <select class="select" data-step="${i}">${st.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
    </div>`).join("");
    $$("select[data-step]", bb).forEach(sel=>sel.addEventListener("change", updateBuildOut));
    updateBuildOut();
  }
  function updateBuildOut(){
    const vals=$$("select[data-step]", $("#buildHost")).map(s=>s.value);
    const start=vals[0], p1=vals[1], conn=vals[2], p2=vals[3], comp=vals[4], reason=vals[5], q=vals[6];
    let out = `${start} ${p1} ${p2} ${q}`;
    if(buildLevel==="A2"){
      out = `${start} ${p1} ${conn}, ${p2} ${comp} ${reason} ${q}`;
    }
    if(buildLevel==="B1"){
      out = `${start} ${p1} ${conn}, ${p2} ${comp} ${reason} Also, ${q}`;
    }
    out = out.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    $("#buildOut").textContent=out;
  }
  function buildCheck(){
    const txt=$("#buildOut").textContent;
    const hasGoing=/going to/i.test(txt);
    const hasConn=/(First|Then|After that|Finally)/i.test(txt);
    const hasComp=/better|cheaper|more beautiful|the best/i.test(txt);
    const hasBecause=/because/i.test(txt);
    const hasQ=/\?/.test(txt);
    const fb=$("#buildFb"); fb.classList.remove("hidden","ok","no");
    let ok=true, msg="✅ Great plan!";
    if(!hasGoing){ ok=false; msg="❌ Add at least one ‘going to’ plan."; }
    else if(buildLevel!=="A1" && !hasConn){ ok=false; msg="❌ Add a connector (First/Then/Finally)."; }
    else if(buildLevel!=="A1" && !hasComp){ ok=false; msg="❌ Add a comparison (better/cheaper/more…)."; }
    else if(buildLevel!=="A1" && !hasBecause){ ok=false; msg="❌ Add ‘because’ to give a reason."; }
    else if(!hasQ){ ok=false; msg="❌ End with a useful question."; }
    fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
    if(ok) Score.award("builder:"+buildLevel, buildLevel==="A1"?8:buildLevel==="A2"?10:12);
  }
  function buildReset(){ renderBuilder(); $("#buildFb").classList.add("hidden"); }

  function resetAll(){
    TTS.stop(); Score.reset();
    V.revealed.clear();
    $("#vFb").classList.add("hidden");
    warm.reset(); final.reset();
    gReset(); gIndex=0; resetGPractice();
    ordReset(); bankReset(); sortReset();
    setupRoleplays();
    loadLis(LISTENING[0].id);
    buildReset(); setBuildLevel("A1");
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  function bindListenButtons(){
    tap($("#gListenRule"),()=>TTS.say(GRAMMAR[G.id].rule.join(". ")));
    tap($("#gListenExamples"),()=>TTS.say(GRAMMAR[G.id].examples.join(". ")));
  }

  async function init(){
    if(localStorage.getItem(KEYS.auto)===null) TTS.setAuto(false); // default OFF
    Score.setMax(140);
    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});

    tap($("#btnTestVoice"),()=>TTS.say("You are going to Sardinia. Is there any bottled water? This hotel is cheaper than that one."));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnStart"),()=>document.getElementById("secWarmup").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose accent.\n2) Warm‑up quiz.\n3) Vocabulary hub (dropdown).\n4) Grammar hub (dropdown + practice).\n5) Syntax games.\n6) Roleplays + listening (show/hide text).\n7) Sardinia plan builder + final test.\n\nAudio is OFF by default. Use listen buttons when you want."));

    tap($("#btnResetAll"),()=>{ if(confirm("Reset the whole page?")) resetAll(); });

    // Warmup runner
    tap($("#warmStart"),()=>warm.start());
    tap($("#warmCheck"),()=>warm.check());
    tap($("#warmNext"),()=>warm.next(false));
    tap($("#warmHint"),()=>warm.hint());
    tap($("#warmReset"),()=>warm.reset());

    // Vocab hub
    renderVocabCats();
    renderVGrid();
    tap($("#btnVRevealAll"),()=>{VOCAB.filter(x=>x.cat===V.cat).forEach(it=>V.revealed.add(it.cat+'::'+it.w)); renderVGrid();});
    tap($("#btnVHideAll"),()=>{VOCAB.filter(x=>x.cat===V.cat).forEach(it=>V.revealed.delete(it.cat+'::'+it.w)); renderVGrid();});
    tap($("#btnVQuiz"),()=>vocabQuiz());

    // Grammar hub
    renderGrammarPick();
    renderGrammar();
    bindListenButtons();
    resetGPractice();
    tap($("#gCheck"),()=>gCheck());
    tap($("#gNext"),()=>gNext());
    tap($("#gHint"),()=>gHint());
    tap($("#gReset"),()=>gReset());

    // Syntax games
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

    // Roleplays
    setupRoleplays();

    // Listening
    renderLisPicker();
    tap($("#lisPlayAll"),()=>lisPlayAll());
    tap($("#lisShow"),()=>lisShow());
    tap($("#lisHide"),()=>lisHide());
    tap($("#lisCheck"),()=>lisCheckQ());
    tap($("#lisReset"),()=>lisResetQ());

    // Builder
    renderBuilder();
    setBuildLevel("A1");
    tap($("#lvlA1"),()=>setBuildLevel("A1"));
    tap($("#lvlA2"),()=>setBuildLevel("A2"));
    tap($("#lvlB1"),()=>setBuildLevel("B1"));
    tap($("#buildListen"),()=>TTS.say($("#buildOut").textContent));
    tap($("#buildCheck"),()=>buildCheck());
    tap($("#buildReset"),()=>buildReset());

    // Final
    tap($("#finalStart"),()=>final.start());
    tap($("#finalCheck"),()=>final.check());
    tap($("#finalNext"),()=>final.next(false));
    tap($("#finalHint"),()=>final.hint());
    tap($("#finalReset"),()=>final.reset());

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();
})();
