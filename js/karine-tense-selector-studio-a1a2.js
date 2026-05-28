/* SpeakEasyTisha — Barbie Beach Club · Tense Selector Studio (A1/A2)
Build: 20260525-205320
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

  const MODULES={"ps": {"id": "ps", "title": "Present Simple", "emoji": "🌞", "tag": "routines · facts · habits", "signals": ["usually", "often", "sometimes", "always", "every day", "on Mondays"], "lesson": {"rule": ["Affirmative: You work / You go / You like", "Negative: You don’t work / You don’t go / You don’t like", "Questions: Do you work? Do you like…?", "3rd person: He/She/It works / goes / likes (adds -s)"], "examples": ["You usually drink bottled water.", "You go to the beach every day in summer.", "Do you like local food?"], "syntaxTip": "Subject + verb + object. Adverb often goes before the verb: You usually eat at 8."}, "vocab": [{"icon": "🕘", "w": "usually", "fr": "d'habitude", "def": "most of the time", "ex": "You usually eat at 8."}, {"icon": "📅", "w": "every day", "fr": "tous les jours", "def": "daily", "ex": "You go to the beach every day."}, {"icon": "🍝", "w": "local food", "fr": "cuisine locale", "def": "food from the region", "ex": "You try local food."}, {"icon": "💧", "w": "bottled water", "fr": "eau en bouteille", "def": "water in a bottle", "ex": "You buy bottled water."}, {"icon": "🏨", "w": "hotel", "fr": "hôtel", "def": "place to stay", "ex": "You stay in a hotel."}, {"icon": "🧴", "w": "sunscreen", "fr": "crème solaire", "def": "sun protection", "ex": "You use sunscreen."}], "mcq": [{"id": "ps1", "p": "Choose the best (routine): You ___ to the beach every day.", "choices": ["go", "are going", "went"], "a": 0, "h": "Routine → present simple."}, {"id": "ps2", "p": "Choose the best negative: You ___ like spicy food.", "choices": ["don’t", "aren’t", "didn’t"], "a": 0, "h": "Present simple negative → don’t."}, {"id": "ps3", "p": "Choose the best question: ___ you like this hotel?", "choices": ["Do", "Are", "Did"], "a": 0, "h": "Present simple question → Do you…?"}, {"id": "ps4", "p": "Choose the correct: He ___ breakfast at 8.", "choices": ["eat", "eats", "is eating"], "a": 1, "h": "He/She/It adds -s."}, {"id": "ps5", "p": "Best word order:", "choices": ["You eat usually at 8.", "You usually eat at 8.", "Usually you eat at 8 every."], "a": 1, "h": "Adverb before the verb."}, {"id": "ps6", "p": "Choose the best: You ___ bottled water in Sardinia.", "choices": ["buy", "buys", "buying"], "a": 0, "h": "You + base verb."}], "dd": [{"id": "psd1", "p": "Complete: You ___ go hiking.", "opts": ["often", "are", "did"], "a": 0, "h": "often"}, {"id": "psd2", "p": "Complete: Do you ___ local food?", "opts": ["like", "likes", "liked"], "a": 0, "h": "Do + base verb"}, {"id": "psd3", "p": "Complete: She ___ sunscreen.", "opts": ["uses", "use", "using"], "a": 0, "h": "She uses"}, {"id": "psd4", "p": "Complete: You don’t ___ the bill.", "opts": ["need", "needs", "needed"], "a": 0, "h": "don’t + base"}], "order": [{"id": "pso1", "first": "Do", "words": ["you", "like", "local", "food", "?"], "target": "Do you like local food?", "hint": "Do + you + base verb"}, {"id": "pso2", "first": "You", "words": ["usually", "drink", "bottled", "water", "."], "target": "You usually drink bottled water.", "hint": "Adverb before verb"}], "bank": [{"id": "psb1", "template": ["You", "____", "to", "the", "beach", "every", "day", "."], "bank": ["go", "goes", "going"], "target": "You go to the beach every day.", "hint": "present simple"}, {"id": "psb2", "template": ["Do", "you", "____", "this", "hotel", "?"], "bank": ["like", "likes", "liked"], "target": "Do you like this hotel?", "hint": "Do + base"}, {"id": "psb3", "template": ["You", "don’t", "____", "spicy", "food", "."], "bank": ["like", "likes", "liking"], "target": "You don’t like spicy food.", "hint": "don’t + base"}], "listen": [{"id": "psl1", "title": "Small talk (routine)", "lines": [{"who": "Ken", "side": "a", "say": "What do you usually do on vacation?"}, {"who": "You", "side": "b", "say": "I usually go to the beach and I try local food."}, {"who": "Ken", "side": "a", "say": "Do you drink bottled water?"}, {"who": "You", "side": "b", "say": "Yes, I do. I always take water with me."}]}], "lq": {"psl1": [["You usually…", "go to the beach", "rent a car", "pay taxes", 0], ["Ken asks about…", "bottled water", "a ferry", "a refund", 0], ["You say you…", "always take water", "never drink water", "pay by cash", 0], ["The tense is…", "present simple", "past simple", "future", 0], ["A question uses…", "Do you…?", "Did you…?", "Are you…?", 0]]}}, "pc": {"id": "pc", "title": "Present Continuous", "emoji": "🌊", "tag": "now · today · temporary", "signals": ["now", "right now", "today", "this week", "at the moment"], "lesson": {"rule": ["Affirmative: You are staying / You are visiting", "Negative: You aren’t staying / You aren’t visiting", "Questions: Are you staying? Are you visiting…?", "Form: am/is/are + verb‑ing"], "examples": ["You are staying in a hotel this week.", "You are visiting Sardinia today.", "Are you eating in the hotel restaurant now?"], "syntaxTip": "Subject + be (am/is/are) + verb‑ing + place + time."}, "vocab": [{"icon": "🧳", "w": "stay", "fr": "séjourner", "def": "live somewhere temporarily", "ex": "You are staying in a hotel."}, {"icon": "🚗", "w": "renting", "fr": "en train de louer", "def": "getting a rental now", "ex": "You are renting a car."}, {"icon": "🍽️", "w": "ordering", "fr": "en train de commander", "def": "choosing food now", "ex": "You are ordering dinner."}, {"icon": "📸", "w": "taking photos", "fr": "prendre des photos", "def": "making photos now", "ex": "You are taking photos."}, {"icon": "🧭", "w": "looking for", "fr": "chercher", "def": "searching", "ex": "You are looking for the beach."}, {"icon": "🛎️", "w": "checking in", "fr": "faire le check-in", "def": "arriving at hotel now", "ex": "You are checking in."}], "mcq": [{"id": "pc1", "p": "Choose the best (now): You ___ checking in now.", "choices": ["are", "do", "did"], "a": 0, "h": "Now → are + -ing"}, {"id": "pc2", "p": "Choose the best: You ___ staying in Sardinia this week.", "choices": ["are", "is", "am"], "a": 0, "h": "You are…"}, {"id": "pc3", "p": "Choose the best question: ___ you looking for the bathroom?", "choices": ["Are", "Do", "Did"], "a": 0, "h": "Are you + -ing?"}, {"id": "pc4", "p": "Choose the best negative: You ___ eating now.", "choices": ["aren’t", "don’t", "didn’t"], "a": 0, "h": "Present continuous negative → aren’t"}, {"id": "pc5", "p": "Choose the correct form: She is ___ photos.", "choices": ["take", "taking", "took"], "a": 1, "h": "is + verb-ing"}, {"id": "pc6", "p": "Best word order:", "choices": ["You are today visiting Sardinia.", "You are visiting Sardinia today.", "You visiting are Sardinia today."], "a": 1, "h": "be + -ing, then place/time"}], "dd": [{"id": "pcd1", "p": "Complete: You are ___ a car.", "opts": ["renting", "rent", "rented"], "a": 0, "h": "are + -ing"}, {"id": "pcd2", "p": "Complete: ___ you staying here?", "opts": ["Are", "Do", "Did"], "a": 0, "h": "Are you…?"}, {"id": "pcd3", "p": "Complete: You aren’t ___ now.", "opts": ["working", "work", "worked"], "a": 0, "h": "aren’t + -ing"}, {"id": "pcd4", "p": "Complete: We are ___ for a café.", "opts": ["looking", "look", "looked"], "a": 0, "h": "are + -ing"}], "order": [{"id": "pco1", "first": "Are", "words": ["you", "staying", "in", "a", "hotel", "this", "week", "?"], "target": "Are you staying in a hotel this week?", "hint": "Are you + -ing + place + time"}, {"id": "pco2", "first": "You", "words": ["are", "visiting", "Sardinia", "today", "."], "target": "You are visiting Sardinia today.", "hint": "are + -ing"}], "bank": [{"id": "pcb1", "template": ["You", "are", "____", "a", "car", "."], "bank": ["renting", "rent", "rented"], "target": "You are renting a car.", "hint": "are + -ing"}, {"id": "pcb2", "template": ["Are", "you", "____", "for", "the", "beach", "?"], "bank": ["looking", "look", "looked"], "target": "Are you looking for the beach?", "hint": "Are you + -ing"}, {"id": "pcb3", "template": ["You", "aren’t", "____", "now", "."], "bank": ["working", "work", "worked"], "target": "You aren’t working now.", "hint": "aren’t + -ing"}], "listen": [{"id": "pcl1", "title": "At the hotel (now)", "lines": [{"who": "Reception", "side": "a", "say": "Hello! Are you checking in now?"}, {"who": "You", "side": "b", "say": "Yes, I am. I’m staying for three nights."}, {"who": "Reception", "side": "a", "say": "Great. Are you paying by card?"}, {"who": "You", "side": "b", "say": "Yes, I am. Thank you."}]}], "lq": {"pcl1": [["You are checking in…", "now", "yesterday", "next week", 0], ["You are staying for…", "three nights", "three months", "three years", 0], ["Reception asks about…", "paying by card", "a beach ticket", "a taxi", 0], ["The tense is…", "present continuous", "present simple", "past", 0], ["Question form uses…", "Are you…?", "Do you…?", "Did you…?", 0]]}}, "fut": {"id": "fut", "title": "Future (going to / will / arrangements)", "emoji": "🌴", "tag": "plans · arrangements · instant decisions", "signals": ["tomorrow", "next week", "this weekend", "later", "tonight"], "lesson": {"rule": ["Going to = plan: You are going to rent a car.", "Present continuous = arrangement: You are meeting friends at 7.", "Will = instant decision/offer: I’ll help. I’ll pay."], "examples": ["You’re going to visit a beach tomorrow.", "You’re meeting Ken at 7.", "I’ll get the bill."], "syntaxTip": "Plan before now → going to. Decision now → will."}, "vocab": [{"icon": "📅", "w": "plan", "fr": "planifier", "def": "decide what you want to do", "ex": "You plan a day trip."}, {"icon": "🗺️", "w": "day trip", "fr": "excursion", "def": "trip for one day", "ex": "You’re going to take a day trip."}, {"icon": "🍽️", "w": "book a table", "fr": "réserver une table", "def": "reserve restaurant seats", "ex": "You’re going to book a table."}, {"icon": "🚗", "w": "rent a car", "fr": "louer une voiture", "def": "pay to use a car", "ex": "You’re going to rent a car."}, {"icon": "🤝", "w": "meet", "fr": "rencontrer", "def": "see someone at a time", "ex": "You’re meeting Ken at 7."}, {"icon": "💡", "w": "I’ll…", "fr": "je vais… (décision)", "def": "instant decision/offer", "ex": "I’ll pay."}], "mcq": [{"id": "fu1", "p": "Choose the best (plan): You ___ rent a car tomorrow.", "choices": ["are going to", "will", "are renting (not arranged)"], "a": 0, "h": "Plan → going to"}, {"id": "fu2", "p": "Choose the best (offer): Don’t worry. I ___ help you.", "choices": ["am going to", "will", "am helping"], "a": 1, "h": "Instant offer → will"}, {"id": "fu3", "p": "Choose the best (arrangement): You ___ Ken at 7.", "choices": ["are meeting", "are going to meet", "will meet (planned)"], "a": 0, "h": "Fixed arrangement → present continuous"}, {"id": "fu4", "p": "Choose the best: Tomorrow, you ___ visit a beach.", "choices": ["are going to", "did", "are visiting yesterday"], "a": 0, "h": "tomorrow + plan → going to"}, {"id": "fu5", "p": "Choose the best: I ___ the bill (decision now).", "choices": ["am going to get", "will get", "get"], "a": 1, "h": "will for decision now"}, {"id": "fu6", "p": "Best sentence:", "choices": ["You are going to book a table tonight.", "You going to are book table tonight.", "You will going to book."], "a": 0, "h": "are going to + base verb"}], "dd": [{"id": "fud1", "p": "Complete: You are going to ___ a table.", "opts": ["book", "booking", "booked"], "a": 0, "h": "going to + base"}, {"id": "fud2", "p": "Complete: I’ll ___ you.", "opts": ["help", "helped", "helping"], "a": 0, "h": "will + base"}, {"id": "fud3", "p": "Complete: You are ___ Ken at 7.", "opts": ["meeting", "meet", "met"], "a": 0, "h": "arrangement"}, {"id": "fud4", "p": "Complete: Tomorrow, you are going to ___ photos.", "opts": ["take", "taking", "took"], "a": 0, "h": "base verb"}], "order": [{"id": "fuo1", "first": "You", "words": ["are", "going", "to", "rent", "a", "car", "tomorrow", "."], "target": "You are going to rent a car tomorrow.", "hint": "are going to + base"}, {"id": "fuo2", "first": "I’ll", "words": ["pay", "for", "the", "tickets", "."], "target": "I’ll pay for the tickets.", "hint": "will + base"}], "bank": [{"id": "fub1", "template": ["You", "are", "going", "to", "____", "a", "day", "trip", "."], "bank": ["take", "taking", "took"], "target": "You are going to take a day trip.", "hint": "going to + base"}, {"id": "fub2", "template": ["I", "____", "help", "you", "."], "bank": ["will", "am", "did"], "target": "I will help you.", "hint": "will"}, {"id": "fub3", "template": ["You", "are", "____", "Ken", "at", "7", "."], "bank": ["meeting", "meet", "met"], "target": "You are meeting Ken at 7.", "hint": "arrangement"}], "listen": [{"id": "ful1", "title": "Planning tomorrow", "lines": [{"who": "Ken", "side": "a", "say": "What are you going to do tomorrow in Sardinia?"}, {"who": "You", "side": "b", "say": "First, I’m going to rent a car. Then I’m going to visit a beach."}, {"who": "Ken", "side": "a", "say": "Great! I’ll join you."}, {"who": "You", "side": "b", "say": "Perfect. We’re meeting at 10 a.m."}]}], "lq": {"ful1": [["Tomorrow you plan to…", "rent a car", "work", "stay home", 0], ["Ken says…", "I’ll join you", "I joined you", "I join you yesterday", 0], ["Meeting time is…", "10 a.m.", "7 p.m.", "3 p.m.", 0], ["‘I’ll’ is for…", "offer/decision", "routine", "past", 0], ["The tense focus is…", "future", "past", "present simple", 0]]}}, "past": {"id": "past", "title": "Past Simple", "emoji": "🌅", "tag": "yesterday · last week · finished time", "signals": ["yesterday", "last week", "last night", "two days ago", "in 2022"], "lesson": {"rule": ["Affirmative: You visited / You stayed / You went (irregular)", "Negative: You didn’t visit / didn’t stay / didn’t go (didn’t + base verb)", "Questions: Did you visit…? Did you go…? (Did + base verb)", "Regular verbs: add -ed (walked). Irregular: go→went, have→had, eat→ate"], "examples": ["You visited a beach yesterday.", "You didn’t rent a car last week.", "Did you try local food?"], "syntaxTip": "After did/didn’t → base verb (go, not went)."}, "vocab": [{"icon": "🗓️", "w": "yesterday", "fr": "hier", "def": "the day before today", "ex": "You arrived yesterday."}, {"icon": "🌙", "w": "last night", "fr": "hier soir", "def": "the night before today", "ex": "You ate pasta last night."}, {"icon": "⏱️", "w": "two days ago", "fr": "il y a deux jours", "def": "two days before today", "ex": "You booked the hotel two days ago."}, {"icon": "🚶", "w": "walked", "fr": "as marché", "def": "past of walk", "ex": "You walked to the beach."}, {"icon": "🚗", "w": "went", "fr": "es allé(e)", "def": "past of go", "ex": "You went to a restaurant."}, {"icon": "🍝", "w": "ate", "fr": "as mangé", "def": "past of eat", "ex": "You ate local food."}], "mcq": [{"id": "pa1", "p": "Choose the best: You ___ to the beach yesterday.", "choices": ["went", "go", "are going"], "a": 0, "h": "yesterday → past simple"}, {"id": "pa2", "p": "Choose the best negative: You ___ rent a car last week.", "choices": ["didn’t", "don’t", "aren’t"], "a": 0, "h": "past negative → didn’t"}, {"id": "pa3", "p": "Choose the best question: ___ you visit the hotel?", "choices": ["Did", "Do", "Are"], "a": 0, "h": "Did + base verb"}, {"id": "pa4", "p": "Choose the correct: After did, use…", "choices": ["base verb", "past verb", "-ing"], "a": 0, "h": "Did + base"}, {"id": "pa5", "p": "Choose the best: You ___ pasta last night.", "choices": ["ate", "eat", "eating"], "a": 0, "h": "ate = past"}, {"id": "pa6", "p": "Best sentence:", "choices": ["Did you went to the beach?", "Did you go to the beach?", "Do you went to the beach?"], "a": 1, "h": "Did + base verb"}], "dd": [{"id": "pad1", "p": "Complete: You ___ local food yesterday.", "opts": ["tried", "try", "trying"], "a": 0, "h": "past"}, {"id": "pad2", "p": "Complete: You didn’t ___ a car.", "opts": ["rent", "rented", "renting"], "a": 0, "h": "didn’t + base"}, {"id": "pad3", "p": "Complete: ___ you go to the restaurant?", "opts": ["Did", "Do", "Are"], "a": 0, "h": "Did"}, {"id": "pad4", "p": "Complete: We ___ photos last night.", "opts": ["took", "take", "taking"], "a": 0, "h": "take→took"}], "order": [{"id": "pao1", "first": "Did", "words": ["you", "go", "to", "the", "beach", "yesterday", "?"], "target": "Did you go to the beach yesterday?", "hint": "Did + base verb"}, {"id": "pao2", "first": "You", "words": ["didn’t", "rent", "a", "car", "last", "week", "."], "target": "You didn’t rent a car last week.", "hint": "didn’t + base"}], "bank": [{"id": "pab1", "template": ["You", "____", "to", "a", "restaurant", "last", "night", "."], "bank": ["went", "go", "going"], "target": "You went to a restaurant last night.", "hint": "went"}, {"id": "pab2", "template": ["You", "didn’t", "____", "a", "car", "."], "bank": ["rent", "rented", "renting"], "target": "You didn’t rent a car.", "hint": "didn’t + base"}, {"id": "pab3", "template": ["Did", "you", "____", "local", "food", "?"], "bank": ["try", "tried", "trying"], "target": "Did you try local food?", "hint": "Did + base"}], "listen": [{"id": "pal1", "title": "Trip review (past)", "lines": [{"who": "Ken", "side": "a", "say": "How was your trip yesterday?"}, {"who": "You", "side": "b", "say": "It was great. I went to the beach and I ate local food."}, {"who": "Ken", "side": "a", "say": "Did you rent a car?"}, {"who": "You", "side": "b", "say": "No, I didn’t. I walked to the beach."}]}], "lq": {"pal1": [["Yesterday you…", "went to the beach", "go to the beach", "are going", 0], ["You ate…", "local food", "tickets", "sunscreen", 0], ["Did you rent a car? You say…", "No, I didn’t", "No, I don’t", "No, I am not", 0], ["The tense is…", "past simple", "future", "present continuous", 0], ["After did/didn’t use…", "base verb", "past verb", "-ing", 0]]}}};
  const SORT_TASK={"prompt": "Syntax sorting: put the chunks into the right boxes (tap OR drag).", "cats": [{"id": "subj", "label": "Subject"}, {"id": "verb", "label": "Verb / Aux"}, {"id": "obj", "label": "Object"}, {"id": "place", "label": "Place"}, {"id": "time", "label": "Time"}], "items": [{"t": "You", "cat": "subj"}, {"t": "are going to", "cat": "verb"}, {"t": "rent a car", "cat": "obj"}, {"t": "in Sardinia", "cat": "place"}, {"t": "tomorrow", "cat": "time"}], "hint": "Think: who? → verb → what? → where? → when?"};

  // TTS
  const KEYS={lang:"k_tense_lang", voice:"k_tense_voice", auto:"k_tense_auto", mod:"k_tense_mod"};
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

  // Module state
  const ids=Object.keys(MODULES);
  let modId = localStorage.getItem(KEYS.mod) || "ps";
  if(!MODULES[modId]) modId="ps";

  // Module picker UI
  function renderPickers(){
    const sel=$("#tensePick");
    sel.innerHTML = ids.map(id=>`<option value="${esc(id)}">${esc(MODULES[id].emoji)} ${esc(MODULES[id].title)}</option>`).join("");
    sel.value=modId;
    sel.addEventListener("change",()=>setModule(sel.value,true));

    const cards=$("#pickCards");
    cards.innerHTML="";
    ids.forEach(id=>{
      const m=MODULES[id];
      const div=document.createElement("div");
      div.className="cardpick";
      div.innerHTML = `<div class="cardpick__tag">${esc(m.emoji)} ${esc(m.tag)}</div>
        <div class="cardpick__title">${esc(m.title)}</div>
        <div class="cardpick__desc">Click to study <strong>${esc(m.title)}</strong> with rules, vocabulary, practice, roleplay and listening.</div>`;
      tap(div,()=>setModule(id,true));
      cards.appendChild(div);
    });
  }

  function setModule(id, scroll){
    if(!MODULES[id]) return;
    modId=id;
    localStorage.setItem(KEYS.mod, id);
    $("#tensePick").value=id;
    renderModule();
    resetAllExercises(false);
    if(scroll) document.getElementById("secModule").scrollIntoView({behavior:"smooth"});
  }

  // ---------- Vocabulary ----------
  const V = {revealed:new Set()};
  function renderVocab(){
    V.revealed.clear();
    const grid=$("#vGrid"); grid.innerHTML="";
    MODULES[modId].vocab.forEach(it=>{
      const key=it.w;
      const card=document.createElement("div");
      card.className="card vocabCard";
      card.innerHTML = `<div class="vocabTop"><div class="vocabWord">${esc(it.icon)} ${esc(it.w)}</div>
        <div class="vocabBtns"><button class="toolmini" data-a="s">🔊</button><button class="toolmini" data-a="t">👀 Reveal</button></div></div>
        <div class="kcard hidden" data-box="b">
          <div><strong>Meaning:</strong> ${esc(it.def)}</div>
          <div style="color:var(--muted);font-weight:850"><strong>FR:</strong> ${esc(it.fr)}</div>
          <div><strong>Example:</strong> ${esc(it.ex)}</div>
        </div>`;
      const box=card.querySelector("[data-box='b']");
      const btn=card.querySelector("[data-a='t']");
      tap(btn,()=>{
        const hidden=box.classList.contains("hidden");
        if(hidden){ box.classList.remove("hidden"); V.revealed.add(key); btn.textContent="🙈 Hide"; }
        else { box.classList.add("hidden"); V.revealed.delete(key); btn.textContent="👀 Reveal"; }
      });
      tap(card.querySelector("[data-a='s']"),()=>TTS.say(it.w+". "+it.ex));
      tap(card,(e)=>{ if(e?.target?.closest("button")) return; btn.click(); });
      grid.appendChild(card);
    });

    tap($("#vRevealAll"),()=>{ $$("#vGrid .card").forEach(c=>{ const box=c.querySelector("[data-box='b']"); const btn=c.querySelector("[data-a='t']"); box.classList.remove("hidden"); btn.textContent="🙈 Hide"; }); });
    tap($("#vHideAll"),()=>{ $$("#vGrid .card").forEach(c=>{ const box=c.querySelector("[data-box='b']"); const btn=c.querySelector("[data-a='t']"); box.classList.add("hidden"); btn.textContent="👀 Reveal"; }); });
  }

  function vocabQuiz(){
    const list=MODULES[modId].vocab;
    const sample=shuffle(list).slice(0, Math.min(6, list.length));
    const fb=$("#vFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("ok"); fb.innerHTML="";
    const wrap=document.createElement("div"); wrap.className="kcard";
    wrap.innerHTML = `<strong>Quick vocab quiz (${sample.length})</strong><div class="tiny" style="color:var(--muted)">Choose the best meaning.</div>`;
    const meta=[];
    sample.forEach((it,i)=>{
      const choices=shuffle([it.def,"a train station","a beach umbrella"]);
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
      meta.forEach((m,i)=>{ const c=document.querySelector(`input[name="vq${i}"]:checked`); if(c && parseInt(c.value,10)===m.ans) correct++; });
      const b=$("#vqFb"); b.classList.remove("hidden","ok","no"); b.classList.add(correct>=Math.max(4, sample.length-1)?"ok":"no");
      b.textContent=`Score: ${correct}/${sample.length}`;
      Score.award(`vocabQuiz:${modId}`, correct);
    });
  }

  // ---------- Lesson content ----------
  function renderLesson(){
    const m=MODULES[modId];
    $("#modTitle").textContent = `1) ${m.emoji} ${m.title}`;
    $("#modTag").textContent = m.tag;

    // signals
    const sig=$("#sigChips"); sig.innerHTML="";
    m.signals.forEach(s=>{
      const chip=document.createElement("span");
      chip.className="badge";
      chip.textContent=s;
      sig.appendChild(chip);
    });

    // lesson boxes
    const lb=$("#lessonBoxes"); lb.innerHTML="";
    const rule=document.createElement("div"); rule.className="kcard";
    rule.innerHTML=`<div class="badge">Rule (forms)</div><div style="margin-top:.35rem">${m.lesson.rule.map(r=>"• "+esc(r)).join("<br/>")}</div>
      <div class="smallrow"><button class="toolmini" id="btnRuleListen">🔊 Listen rule</button></div>`;
    const ex=document.createElement("div"); ex.className="kcard";
    ex.innerHTML=`<div class="badge">Examples (you)</div><div style="margin-top:.35rem">${m.lesson.examples.map(r=>"• "+esc(r)).join("<br/>")}</div>
      <div class="smallrow"><button class="toolmini" id="btnExListen">🔊 Listen examples</button></div>`;
    lb.appendChild(rule); lb.appendChild(ex);
    tap($("#btnRuleListen"),()=>TTS.say(m.lesson.rule.join(". ")));
    tap($("#btnExListen"),()=>TTS.say(m.lesson.examples.join(". ")));

    $("#syntaxTip").textContent = m.lesson.syntaxTip;
  }

  // ---------- Generic runner ----------
  function makeRunner(hostSel, fbSel, name, items, keyPrefix, pts=1, renderFn=null){
    const S={order:[], idx:0, cur:null};
    const host=$(hostSel), fb=$(fbSel);

    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      if(renderFn){ host.innerHTML=""; host.appendChild(renderFn(S.cur)); return; }
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
    function hint(){
      fb.classList.remove("hidden","ok","no"); fb.classList.add("no");
      fb.textContent="💡 "+(S.cur?.h||S.cur?.hint||"");
    }
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
    return {start,next,check,hint,reset, get cur(){return S.cur;}};
  }

  // Dropdown runner
  function makeDropdown(hostSel, fbSel, items, keyPrefix, pts=1){
    const S={order:[], idx:0, cur:null};
    const host=$(hostSel), fb=$(fbSel);

    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML=`<div><strong>${esc(S.cur.p)}</strong></div><select class="select" id="ddSel">${S.cur.opts.map((o,i)=>`<option value="${i}">${esc(o)}</option>`).join("")}</select>`;
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
      const val=parseInt($("#ddSel").value,10);
      const ok=val===S.cur.a;
      fb.classList.add(ok?"ok":"no"); fb.textContent=ok?"✅ Correct!":"❌ Not quite.";
      if(ok) Score.award(`${keyPrefix}:${S.cur.id}`, pts);
    }
    function reset(){ S.order=[]; S.cur=null; fb.classList.add("hidden"); host.textContent="Click Start."; }
    return {start,next,check,hint,reset};
  }

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
      <div class="tiny" style="color:var(--muted)">Tap words to add. Tap a word in the sentence to remove.</div>`;
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
  function ordStart(){
    const arr=MODULES[modId].order;
    ordS.order=shuffle(arr.map(x=>x.id));
    ordS.idx=0; ordNext(true);
  }
  function ordNext(fromStart=false){
    const arr=MODULES[modId].order;
    if(!ordS.order.length) return;
    if(!fromStart) ordS.idx++;
    if(ordS.idx>=ordS.order.length) ordS.idx=0;
    ordS.cur=arr.find(x=>x.id===ordS.order[ordS.idx]);
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
    if(ok) Score.award(`ord:${modId}:${q.id}`,3);
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
  function bankStart(){
    const arr=MODULES[modId].bank;
    bankS.order=shuffle(arr.map(x=>x.id)); bankS.idx=0; bankNext(true);
  }
  function bankNext(fromStart=false){
    const arr=MODULES[modId].bank;
    if(!bankS.order.length) return;
    if(!fromStart) bankS.idx++;
    if(bankS.idx>=bankS.order.length) bankS.idx=0;
    bankS.cur=arr.find(x=>x.id===bankS.order[bankS.idx]);
    $("#bankFb").classList.add("hidden"); bankRender();
  }
  function bankHint(){ const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add("no"); fb.textContent="💡 "+(bankS.cur?.hint||""); }
  function bankCheck(){
    const q=bankS.cur;
    const built=$("#bankHost").querySelector("#bankSentence").textContent.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    const ok=norm(built)===norm(q.target);
    const fb=$("#bankFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no");
    fb.textContent=ok?"✅ Correct!":"❌ Not quite. You wrote: "+built;
    if(ok) Score.award(`bank:${modId}:${q.id}`,3);
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
    fb.textContent=ok?"✅ Perfect! Syntax sorted.":"Score: "+correct+"/"+SORT_TASK.items.length;
    if(ok) Score.award("sort",6);
  }
  function sortReset(){ $("#sortFb").classList.add("hidden"); sortRender(); }

  // Listening
  const Lis={cur:null, show:false};
  function renderLisPick(){
    const sel=$("#lisPick");
    const list=MODULES[modId].listen;
    sel.innerHTML=list.map(d=>`<option value="${esc(d.id)}">${esc(d.title)}</option>`).join("");
    sel.addEventListener("change",()=>loadLis(sel.value));
    loadLis(list[0].id);
  }
  function loadLis(id){
    Lis.cur=MODULES[modId].listen.find(x=>x.id===id);
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
    const qset=(MODULES[modId].lq && MODULES[modId].lq[Lis.cur.id]) ? MODULES[modId].lq[Lis.cur.id] : [];
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
    if(ok) Score.award(`listening:${modId}:${Lis.cur.id}`,6);
  }

  // Roleplay model (changes by module)
  function roleplayModel(){
    const m=MODULES[modId];
    if(modId==="ps") return "(Small talk) What do you usually do on vacation? — I usually go to the beach. Do you like local food? — Yes, I do.";
    if(modId==="pc") return "(Hotel now) Are you checking in now? — Yes, I am. I’m staying for three nights. Are you paying by card? — Yes, I am.";
    if(modId==="fut") return "(Plan) What are you going to do tomorrow? — I’m going to rent a car. Then I’m going to visit a beach. — I’ll join you.";
    return "(Trip review) Did you go to the beach yesterday? — Yes, I did. I went to the beach and I ate local food.";
  }
  function renderRoleplay(){
    $("#rpBox").textContent = roleplayModel();
  }

  // Speaking builder (simple, module-specific)
  function buildSpeakingUI(){
    const host=$("#sBuild"); host.innerHTML="";
    const m=MODULES[modId];

    const partsByMod = {
      ps: [
        {label:"Starter", opts:["Today","On vacation","In Sardinia","Usually"]},
        {label:"Subject", opts:["you","we"]},
        {label:"Verb", opts:["go","eat","drink","visit","need"]},
        {label:"Object", opts:["to the beach","local food","bottled water","a hotel","sunscreen"]},
        {label:"Time", opts:["every day","often","usually","on Mondays","in summer"]},
      ],
      pc: [
        {label:"Starter", opts:["Right now","Today","This week","At the moment"]},
        {label:"Subject", opts:["you","we"]},
        {label:"Be", opts:["are"]},
        {label:"Verb‑ing", opts:["staying","visiting","checking in","renting a car","looking for the beach"]},
        {label:"Extra", opts:["now.","today.","this week.","at the moment."]},
      ],
      fut: [
        {label:"Starter", opts:["Tomorrow","Next week","Tonight","This weekend"]},
        {label:"Plan", opts:["you are going to rent a car","you are going to visit a beach","you are going to book a table","you are going to take photos"]},
        {label:"Connector", opts:["First,","Then,","After that,","Finally,"]},
        {label:"Second plan", opts:["you are going to try local food.","you are going to buy bottled water.","you are going to swim.","you are going to relax."]},
      ],
      past: [
        {label:"Time", opts:["Yesterday","Last night","Two days ago","Last week"]},
        {label:"Subject", opts:["you","we"]},
        {label:"Verb (past)", opts:["went","ate","visited","walked","booked"]},
        {label:"Object", opts:["to the beach","local food","a hotel","to a restaurant","a day trip"]},
      ]
    };

    const parts = partsByMod[modId];
    parts.forEach((p, idx)=>{
      const wrap=document.createElement("div");
      wrap.className="kcard";
      wrap.style.marginTop = idx===0?"0":".55rem";
      wrap.innerHTML = `<div><strong>${esc(p.label)}</strong></div><select class="select" data-part="${idx}">${p.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>`;
      host.appendChild(wrap);
    });
    updateSpeakingOut();
    $$("select[data-part]", host).forEach(sel=>sel.addEventListener("change", updateSpeakingOut));
  }

  function updateSpeakingOut(){
    const host=$("#sBuild");
    const vals=$$("select[data-part]", host).map(s=>s.value);
    let out="";
    if(modId==="ps"){
      out = `${vals[0]} ${vals[1]} ${vals[2]} ${vals[3]} ${vals[4]}.`;
    } else if(modId==="pc"){
      out = `${vals[0]} ${vals[1]} ${vals[2]} ${vals[3]} ${vals[4]}`;
    } else if(modId==="fut"){
      out = `${vals[0]}, ${vals[1]}. ${vals[2]} ${vals[3]}`;
    } else {
      out = `${vals[0]}, ${vals[1]} ${vals[2]} ${vals[3]}.`;
    }
    out = out.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    $("#sOut").textContent = out;
  }

  function checkSpeaking(){
    const txt=$("#sOut").textContent;
    let ok=true, msg="✅ Nice!";
    if(modId==="ps"){
      // must NOT contain "are" + ing
      if(/\bare\b\s+\w+ing\b/i.test(txt)){ ok=false; msg="❌ Present simple: avoid ‘are + -ing’. Use base verb."; }
      if(!/\b(usually|often|every)\b/i.test(txt)){ msg="✅ Good. Add a signal word (usually/often/every day) for extra clarity."; }
    } else if(modId==="pc"){
      if(!/\bare\b/i.test(txt) || !/ing\b/i.test(txt)){ ok=false; msg="❌ Present continuous: use ‘are + verb‑ing’."; }
    } else if(modId==="fut"){
      if(!/going to/i.test(txt) && !/will/i.test(txt) && !/meeting/i.test(txt)){ ok=false; msg="❌ Future: use ‘going to’ (plan), ‘will’ (offer), or present continuous (arrangement)."; }
    } else {
      if(!/\b(yesterday|last|ago)\b/i.test(txt)){ msg="✅ Good. Add a time marker (yesterday/last week/two days ago)."; }
      if(/\bdid\b.*\bwent\b/i.test(txt)){ ok=false; msg="❌ After ‘did’, use base verb ‘go’, not ‘went’."; }
    }
    const fb=$("#sFb"); fb.classList.remove("hidden","ok","no"); fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
    if(ok) Score.award(`speak:${modId}`,6);
  }

  // Practice runners
  let mcq=null, dd=null;

  function resetAllExercises(resetScore=true){
    $("#vFb").classList.add("hidden");
    $("#mcqFb").classList.add("hidden");
    $("#ddFb").classList.add("hidden");
    $("#ordFb").classList.add("hidden");
    $("#bankFb").classList.add("hidden");
    $("#sortFb").classList.add("hidden");
    $("#lisQFb").classList.add("hidden");
    $("#sFb").classList.add("hidden");

    if(resetScore) Score.reset();

    // re-render module parts
    renderLesson();
    renderVocab();
    renderRoleplay();
    buildSpeakingUI();

    // build runners
    mcq = makeRunner("#mcqHost","#mcqFb","mcq",MODULES[modId].mcq, `mcq:${modId}`, 2);
    dd  = makeDropdown("#ddHost","#ddFb",MODULES[modId].dd, `dd:${modId}`, 2);

    // reset builder exercises
    ordReset();
    bankReset();
    sortReset();
    renderLisPick();
  }

  function renderModule(){
    // signals + lesson etc.
    renderLesson();
  }

  function resetAll(){
    TTS.stop();
    resetAllExercises(true);
    document.getElementById("top").scrollIntoView({behavior:"smooth"});
  }

  async function init(){
    if(localStorage.getItem(KEYS.auto)===null) TTS.setAuto(false); // default OFF
    Score.setMax(120);

    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});

    tap($("#btnTestVoice"),()=>TTS.say("You are going to Sardinia tomorrow. Is there any bottled water?"));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnResetAll"),()=>{ if(confirm("Reset the whole page?")) resetAll(); });

    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose ONE tense at the start.\n2) Study the rule + examples.\n3) Learn the vocabulary.\n4) Practice (MCQ, dropdown, sentence builder, word bank).\n5) Syntax sorting (Subject/Verb/Object/Place/Time).\n6) Roleplay + speaking builder.\n7) Listening with transcript + comprehension.\n\nAudio is OFF by default. Use listen buttons when you want."));

    tap($("#btnChoose"),()=>document.getElementById("pickCards").scrollIntoView({behavior:"smooth"}));

    // module picker
    renderPickers();

    // install practice buttons
    tap($("#vQuiz"),()=>vocabQuiz());

    tap($("#mcqStart"),()=>mcq.start());
    tap($("#mcqCheck"),()=>mcq.check());
    tap($("#mcqNext"),()=>mcq.next(false));
    tap($("#mcqHint"),()=>mcq.hint());
    tap($("#mcqReset"),()=>mcq.reset());

    tap($("#ddStart"),()=>dd.start());
    tap($("#ddCheck"),()=>dd.check());
    tap($("#ddNext"),()=>dd.next(false));
    tap($("#ddHint"),()=>dd.hint());
    tap($("#ddReset"),()=>dd.reset());

    tap($("#ordStart"),()=>ordStart());
    tap($("#ordCheck"),()=>ordCheck());
    tap($("#ordHint"),()=>ordHint());
    tap($("#ordReset"),()=>ordReset());

    tap($("#bankStart"),()=>bankStart());
    tap($("#bankCheck"),()=>bankCheck());
    tap($("#bankHint"),()=>bankHint());
    tap($("#bankReset"),()=>bankReset());

    // sorting
    sortRender();
    tap($("#sortCheck"),()=>sortCheck());
    tap($("#sortHint"),()=>sortHint());
    tap($("#sortReset"),()=>sortReset());

    // roleplay
    tap($("#rpShow"),()=>$("#rpBox").classList.remove("hidden"));
    tap($("#rpHide"),()=>$("#rpBox").classList.add("hidden"));
    tap($("#rpListen"),()=>TTS.say($("#rpBox").textContent || roleplayModel()));

    tap($("#sListen"),()=>TTS.say($("#sOut").textContent));
    tap($("#sCheck"),()=>checkSpeaking());
    tap($("#sReset"),()=>{ buildSpeakingUI(); $("#sFb").classList.add("hidden"); });

    // listening
    tap($("#lisPlayAll"),()=>lisPlayAll());
    tap($("#lisShow"),()=>lisShow());
    tap($("#lisHide"),()=>lisHide());
    tap($("#lisCheck"),()=>lisCheckQ());
    tap($("#lisReset"),()=>lisResetQ());

    // initial module render
    resetAllExercises(false);
    setModule(modId, false);

    $("#jsStatus").textContent="JS: ✅ loaded";
  }

  init();
})();
