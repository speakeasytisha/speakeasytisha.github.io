/* SpeakEasyTisha — Canada Verb & Tense Switch Studio (A1/A2)
Build: 20260519-173827
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
  const tap=(el, fn)=>{ if(!el) return; let last=0;
    const h=(e)=>{const now=Date.now(); if(now-last<320) return; last=now; try{fn(e);}catch(err){console.error(err); log(String(err));}};
    if(window.PointerEvent){ el.addEventListener("pointerup",h); el.addEventListener("click",h);} else { el.addEventListener("click",h); el.addEventListener("touchend",h,{passive:true}); }
  };

  // TTS
  const KEYS={lang:"c_tense_lang", voice:"c_tense_voice", auto:"c_tense_auto"};
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
  const VOCAB=[{"cat": "Travel verbs", "icon": "🧭", "w": "visit", "fr": "visiter", "def": "go to a place for a short time", "ex": "I’ve visited Vancouver."}, {"cat": "Travel verbs", "icon": "🏙️", "w": "explore", "fr": "explorer", "def": "discover a place", "ex": "We explored the Old Port yesterday."}, {"cat": "Travel verbs", "icon": "🎟️", "w": "buy (bought, bought)", "fr": "acheter", "def": "pay money to get something", "ex": "I’ve bought the tickets already."}, {"cat": "Travel verbs", "icon": "📸", "w": "take photos (took, taken)", "fr": "prendre des photos", "def": "use a camera/phone to make pictures", "ex": "We took photos last night."}, {"cat": "Travel verbs", "icon": "🥾", "w": "go hiking (went, gone)", "fr": "faire une randonnée", "def": "walk in nature", "ex": "I’ve never gone hiking in Canada."}, {"cat": "Travel verbs", "icon": "🍁", "w": "try", "fr": "essayer/goûter", "def": "test food/activities", "ex": "I haven’t tried poutine yet."}, {"cat": "Travel verbs", "icon": "🗺️", "w": "plan", "fr": "planifier", "def": "decide what to do", "ex": "We’re going to plan a day trip."}, {"cat": "Travel verbs", "icon": "📅", "w": "book / reserve", "fr": "réserver", "def": "arrange ahead of time", "ex": "I’ve booked a hotel online."}, {"cat": "Travel verbs", "icon": "🧾", "w": "pay (paid, paid)", "fr": "payer", "def": "give money for something", "ex": "I paid by card yesterday."}, {"cat": "Travel verbs", "icon": "🗣️", "w": "recommend", "fr": "recommander", "def": "suggest something good", "ex": "Can you recommend a restaurant?"}, {"cat": "Present perfect signals", "icon": "✨", "w": "already", "fr": "déjà", "def": "before now / sooner than expected", "ex": "I’ve already bought the tickets."}, {"cat": "Present perfect signals", "icon": "🕒", "w": "just", "fr": "venir de", "def": "a very short time ago", "ex": "I’ve just arrived."}, {"cat": "Present perfect signals", "icon": "❓", "w": "yet", "fr": "encore / déjà (négatif/question)", "def": "until now (questions/negatives)", "ex": "Have you eaten yet?"}, {"cat": "Present perfect signals", "icon": "🌍", "w": "ever / never", "fr": "déjà / jamais", "def": "at any time / at no time", "ex": "Have you ever been to Montreal?"}, {"cat": "Present perfect signals", "icon": "📈", "w": "so far", "fr": "jusqu’ici", "def": "until now", "ex": "So far, it’s been great."}, {"cat": "Present perfect signals", "icon": "⏳", "w": "for / since", "fr": "depuis / depuis (point)", "def": "duration / starting point", "ex": "I’ve lived in France for 20 years."}, {"cat": "Past simple signals", "icon": "📍", "w": "yesterday", "fr": "hier", "def": "the day before today", "ex": "We visited a museum yesterday."}, {"cat": "Past simple signals", "icon": "🗓️", "w": "last week / last night", "fr": "la semaine dernière / hier soir", "def": "a finished time in the past", "ex": "I called the hotel last week."}, {"cat": "Past simple signals", "icon": "📆", "w": "in 2022 / in July", "fr": "en 2022 / en juillet", "def": "a specific finished time", "ex": "I went to Spain in 2022."}, {"cat": "Past simple signals", "icon": "⏱️", "w": "two days ago", "fr": "il y a deux jours", "def": "a finished past time", "ex": "We arrived two days ago."}, {"cat": "Money + tax words", "icon": "🧾", "w": "tax", "fr": "taxe", "def": "money added to the price", "ex": "Is tax included?"}, {"cat": "Money + tax words", "icon": "🇨🇦", "w": "GST / HST", "fr": "TPS / TVH", "def": "Canadian sales tax (varies by province)", "ex": "In Ontario, HST applies."}, {"cat": "Money + tax words", "icon": "💵", "w": "total", "fr": "total", "def": "final amount to pay", "ex": "What’s the total after tax?"}, {"cat": "Money + tax words", "icon": "➕", "w": "included", "fr": "inclus", "def": "already part of the price", "ex": "Is breakfast included?"}];
  const GRAMMAR={"presentPerfect": {"title": "Present perfect = have/has + past participle", "rule": ["Affirmative: I have / I’ve + past participle (I’ve visited Toronto.)", "Negative: I haven’t + past participle (I haven’t tried poutine.)", "Question: Have you + past participle…? (Have you been to Montreal?)", "Use for: experience (ever/never), news (just), unfinished time (today/this week), result now (already/yet)."], "examples": ["I’ve already booked the hotel.", "I haven’t eaten yet.", "Have you ever been to Quebec City?"], "note": "French ‘passé composé’ can be past simple OR present perfect in English—check the time word."}, "pastSimple": {"title": "Past simple = finished time (yesterday / last week / in 2022)", "rule": ["Affirmative: I visited / I went", "Negative: I didn’t visit / I didn’t go (didn’t + base verb)", "Question: Did you visit…? (Did + base verb)", "Use with finished time words: yesterday, last week, in 2022, two days ago."], "examples": ["We visited the museum yesterday.", "I didn’t buy a tour.", "Did you try maple syrup?"], "note": "If the time is finished, choose past simple."}, "chooser": {"title": "Tense chooser: past simple vs present perfect", "rule": ["Past simple = finished time (yesterday / last week / in 2022).", "Present perfect = no finished time / experience / until now (already, yet, ever, never, so far).", "Compare:", "• I visited Montreal last year. (past simple)", "• I’ve visited Montreal. (experience)"], "examples": ["Have you booked the tickets yet? (present perfect)", "I booked them yesterday. (past simple)"], "note": "Ask: Is the time finished? If yes → past simple."}, "taxTalk": {"title": "Useful Canada checkout English (tax & total)", "rule": ["Is tax included?", "What’s the total after tax?", "How much is the tax?", "Could I have the receipt, please?"], "examples": ["Is tax included in the price?", "What’s the total after tax, please?", "How much is the HST here?"], "note": "Sales tax depends on the province (GST/HST and sometimes PST/QST)."}};
  const MCQ=[{"id": "m1", "prompt": "Choose the best tense: I ___ to Montreal. (experience)", "choices": ["visited", "have visited", "did visit"], "ans": 1, "hint": "Experience (no time) → present perfect."}, {"id": "m2", "prompt": "Choose the best tense: I ___ to Montreal last year.", "choices": ["have visited", "visited", "have been"], "ans": 1, "hint": "Finished time → past simple."}, {"id": "m3", "prompt": "Choose the best: Have you ___ poutine yet?", "choices": ["eat", "ate", "eaten"], "ans": 2, "hint": "Have + past participle."}, {"id": "m4", "prompt": "Choose the best: I haven’t ___ the tickets yet.", "choices": ["buy", "bought", "boughted"], "ans": 1, "hint": "buy → bought (PP = bought)."}, {"id": "m5", "prompt": "Choose the best: We ___ the museum yesterday.", "choices": ["have visited", "visited", "have visit"], "ans": 1, "hint": "Yesterday → past simple."}, {"id": "m6", "prompt": "Choose the best: I’ve just ___ .", "choices": ["arrive", "arrived", "arriving"], "ans": 1, "hint": "Just + present perfect."}, {"id": "m7", "prompt": "Choose the best: Did you ___ a ticket?", "choices": ["bought", "buy", "buying"], "ans": 1, "hint": "Did + base verb."}, {"id": "m8", "prompt": "Choose the best question: ___ you ever been to Vancouver?", "choices": ["Did", "Have", "Are"], "ans": 1, "hint": "Ever → present perfect."}, {"id": "m9", "prompt": "Choose the best: What’s the total ___ tax?", "choices": ["after", "for", "since"], "ans": 0, "hint": "after tax"}, {"id": "m10", "prompt": "Choose the best: I ___ paid yet.", "choices": ["haven’t", "didn’t", "don’t"], "ans": 0, "hint": "Present perfect negative."}];
  const DROPDOWNS=[{"id": "d1", "prompt": "Complete: I’ve ___ the hotel online.", "opts": ["booked", "book", "booking"], "ans": 0, "hint": "have + past participle"}, {"id": "d2", "prompt": "Complete: We ___ a day trip yesterday.", "opts": ["planned", "have planned", "plan"], "ans": 0, "hint": "yesterday → past simple"}, {"id": "d3", "prompt": "Complete: Have you ___ here before?", "opts": ["been", "was", "went"], "ans": 0, "hint": "have been"}, {"id": "d4", "prompt": "Complete: I haven’t tried it ___.", "opts": ["yet", "yesterday", "last"], "ans": 0, "hint": "yet in negatives"}, {"id": "d5", "prompt": "Complete: Did you ___ the ticket?", "opts": ["buy", "bought", "boughted"], "ans": 0, "hint": "Did + base verb"}, {"id": "d6", "prompt": "Complete: I’ve ___ arrived.", "opts": ["just", "yesterday", "last"], "ans": 0, "hint": "just"}, {"id": "d7", "prompt": "Complete: Is tax ___ ?", "opts": ["included", "including", "include"], "ans": 0, "hint": "included"}, {"id": "d8", "prompt": "Complete: What’s the total after ___ ?", "opts": ["tax", "time", "tickets"], "ans": 0, "hint": "after tax"}];
  const ORDER_TASKS=[{"id": "o1", "first": "Have", "words": ["you", "ever", "been", "to", "Toronto", "?"], "target": "Have you ever been to Toronto?", "hint": "Have + subject + PP"}, {"id": "o2", "first": "I’ve", "words": ["already", "bought", "the", "tickets", "."], "target": "I’ve already bought the tickets.", "hint": "already + present perfect"}, {"id": "o3", "first": "We", "words": ["visited", "the", "museum", "yesterday", "."], "target": "We visited the museum yesterday.", "hint": "yesterday → past simple"}, {"id": "o4", "first": "Is", "words": ["tax", "included", "in", "the", "price", "?"], "target": "Is tax included in the price?", "hint": "useful checkout question"}];
  const BANK_TASKS=[{"id": "b1", "template": ["I", "have", "____", "Vancouver", "."], "bank": ["visited", "visit", "visiting"], "target": "I have visited Vancouver.", "hint": "present perfect"}, {"id": "b2", "template": ["I", "haven’t", "____", "poutine", "yet", "."], "bank": ["tried", "try", "trying"], "target": "I haven’t tried poutine yet.", "hint": "haven’t + PP"}, {"id": "b3", "template": ["We", "____", "tickets", "yesterday", "."], "bank": ["bought", "have bought", "buy"], "target": "We bought tickets yesterday.", "hint": "yesterday"}, {"id": "b4", "template": ["Did", "you", "____", "the", "bus", "?"], "bank": ["take", "took", "taken"], "target": "Did you take the bus?", "hint": "Did + base"}, {"id": "b5", "template": ["What’s", "the", "total", "____", "tax", "?"], "bank": ["after", "since", "for"], "target": "What’s the total after tax?", "hint": "after tax"}];
  const SORT_TASK={"id": "s1", "prompt": "Sort the time markers: Finished time (past simple) vs Until now (present perfect).", "cats": [{"id": "past", "label": "Finished time (past simple)"}, {"id": "pp", "label": "Until now / experience (present perfect)"}], "items": [{"t": "yesterday", "cat": "past"}, {"t": "last week", "cat": "past"}, {"t": "in 2022", "cat": "past"}, {"t": "two days ago", "cat": "past"}, {"t": "already", "cat": "pp"}, {"t": "yet", "cat": "pp"}, {"t": "ever", "cat": "pp"}, {"t": "so far", "cat": "pp"}, {"t": "just", "cat": "pp"}, {"t": "today (so far)", "cat": "pp"}], "hint": "Finished time → past simple. Until now/experience → present perfect."};
  const TRAIN={"easy": [{"id": "te1", "p": "Choose: I’ve ___ to Canada. (experience)", "choices": ["been", "was", "went"], "a": 0, "h": "have been"}, {"id": "te2", "p": "Choose: We ___ yesterday. (finish)", "choices": ["went", "have gone", "go"], "a": 0, "h": "yesterday → past"}, {"id": "te3", "p": "Choose: I haven’t eaten ___.", "choices": ["yet", "yesterday", "last"], "a": 0, "h": "yet"}, {"id": "te4", "p": "Choose: Did you ___ the ticket?", "choices": ["buy", "bought", "buying"], "a": 0, "h": "Did + base"}], "medium": [{"id": "tm1", "p": "Choose: I’ve already ___ the tickets.", "choices": ["bought", "buy", "buyed"], "a": 0, "h": "PP = bought"}, {"id": "tm2", "p": "Choose: I ___ the tickets last night.", "choices": ["bought", "have bought", "buy"], "a": 0, "h": "last night → past"}, {"id": "tm3", "p": "Choose: Have you ever ___ poutine?", "choices": ["tried", "try", "trying"], "a": 0, "h": "Have + PP"}], "hard": [{"id": "th1", "p": "Best pair: (now + yesterday)", "choices": ["Have you booked yet? / I booked yesterday.", "Did you book yet? / I’ve booked yesterday.", "Have you booked yesterday? / I booked yet."], "a": 0, "h": "PP with yet, past with yesterday"}, {"id": "th2", "p": "Best question for experience:", "choices": ["Have you ever been to Quebec City?", "Did you ever been to Quebec City?", "Are you ever been to Quebec City?"], "a": 0, "h": "Have you ever + PP"}, {"id": "th3", "p": "Best checkout question:", "choices": ["What’s the total after tax?", "How many tax?", "Is there tax yesterday?"], "a": 0, "h": "after tax"}]};
  const LISTENING=[{"id": "l1", "title": "Museum tickets (have you… yet?)", "lines": [{"who": "Staff", "side": "a", "say": "Hello! Have you bought your tickets yet?"}, {"who": "Traveler", "side": "b", "say": "Not yet. How much are they?"}, {"who": "Staff", "side": "a", "say": "They are twenty dollars, plus tax."}, {"who": "Traveler", "side": "b", "say": "Okay. I’ll buy two tickets, please."}]}, {"id": "l2", "title": "Restaurant bill (total after tax)", "lines": [{"who": "Server", "side": "a", "say": "Here is your bill."}, {"who": "Traveler", "side": "b", "say": "Thank you. Is tax included in the price?"}, {"who": "Server", "side": "a", "say": "No, tax is added. The total after tax is forty-two dollars."}, {"who": "Traveler", "side": "b", "say": "Okay. Could I have the receipt, please?"}]}, {"id": "l3", "title": "Experience vs finished time", "lines": [{"who": "Friend", "side": "a", "say": "Have you ever been to Montreal?"}, {"who": "Traveler", "side": "b", "say": "Yes, I have. I visited last year."}, {"who": "Friend", "side": "a", "say": "Nice! Have you tried poutine yet?"}, {"who": "Traveler", "side": "b", "say": "Not yet, but I’m going to try it today."}]}];
  const LQ={"l1": [["Has the traveler bought tickets yet?", "No", "Yes", "Not mentioned", 0], ["Tickets cost…", "20 dollars", "12 dollars", "42 dollars", 0], ["Tax is…", "added", "included", "free", 0], ["He will buy…", "two tickets", "one ticket", "no tickets", 0], ["‘Yet’ is used with…", "present perfect", "past simple", "future only", 0]], "l2": [["Is tax included?", "No", "Yes", "Not mentioned", 0], ["Total after tax is…", "42 dollars", "20 dollars", "15 dollars", 0], ["He asks for…", "a receipt", "a towel", "a ticket", 0], ["The server gives…", "a bill", "a passport", "a map", 0], ["‘After tax’ means…", "final price", "before tax", "discount", 0]], "l3": [["He visited Montreal…", "last year", "yesterday", "never", 0], ["Has he tried poutine yet?", "No", "Yes", "Not mentioned", 0], ["Present perfect question starts with…", "Have", "Did", "Do", 0], ["‘Visited last year’ is…", "past simple", "present perfect", "future", 0], ["He will try poutine…", "today", "last year", "never", 0]]};
  const WRITING={"title": "Tense Switch Builder (A1 → A2/B1)", "steps": [{"label": "1) Place (Canada)", "opts": ["Toronto", "Montreal", "Quebec City", "Vancouver"]}, {"label": "2) Experience (present perfect)", "opts": ["I’ve already been there.", "I’ve never been there.", "I’ve visited once.", "I haven’t tried the food yet."]}, {"label": "3) Finished time (past simple)", "opts": ["I visited last year.", "I went yesterday.", "I stayed two days ago.", "I bought tickets last week."]}, {"label": "4) Today/this trip (present perfect)", "opts": ["I’ve booked a hotel.", "I’ve just arrived.", "I haven’t decided yet.", "So far, it’s been great."]}, {"label": "5) Connector", "opts": ["First", "So far", "Then", "After that", "Finally"]}, {"label": "6) Checkout question", "opts": ["Is tax included in the price?", "What’s the total after tax?", "How much is the tax?", "Could I have the receipt, please?"]}, {"label": "7) Ending", "opts": ["I’m really excited to go back there!", "Our trip has been amazing so far.", "I want to go back!", "I can’t wait for our next trip."]}], "hint": "Use 1 present perfect + 1 past simple + 1 useful question."};
  const ROLEPLAY={"a": "(Tickets) Have you bought your tickets yet? — Not yet. How much are they? — They are $20, plus tax. — Okay, I’ll buy two tickets, please.", "b": "(Restaurant) Is tax included in the price? — No, tax is added. — What’s the total after tax? — It’s $42. — Could I have the receipt, please?", "c": "(Chat) Have you ever been to Montreal? — Yes, I have. I visited last year. — Have you tried poutine yet? — Not yet."};

  function syncAccent(){ if(TTS.lang==="en-US"){ $("#voiceUS").classList.add("is-on"); $("#voiceUK").classList.remove("is-on"); } else { $("#voiceUK").classList.add("is-on"); $("#voiceUS").classList.remove("is-on"); } }
  function syncAuto(){ if(TTS.auto){ $("#autoOn").classList.add("is-on"); $("#autoOff").classList.remove("is-on"); } else { $("#autoOff").classList.add("is-on"); $("#autoOn").classList.remove("is-on"); } }
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
        choices.map((c,ci)=>`<label class="choice"><input type="radio" name="vq${i}" value="${ci}"/><div>${esc(c)}</div></label>`).join("")+`</div>`;
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

  // Runner helper
  function makeRunner(hostId, fbId, name, items, awardPrefix, pts=1){
    const S={order:[], idx:0, cur:null};
    const host=$(hostId), fb=$(fbId);
    function render(){
      if(!S.cur){ host.textContent="Click Start."; return; }
      host.innerHTML = `<div><strong>${esc(S.cur.prompt||S.cur.p)}</strong></div>` +
        (S.cur.choices||[]).map((c,i)=>`<label class="choice"><input type="radio" name="${name}" value="${i}"/><div>${esc(c)}</div></label>`).join("");
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
      fb.textContent="💡 "+(S.cur.hint||S.cur.h||"Think about the meaning.");
    }
    function check(){
      if(!S.cur) return;
      const c=document.querySelector(`input[name="${name}"]:checked`);
      fb.classList.remove("hidden","ok","no");
      if(!c){ fb.classList.add("no"); fb.textContent="Choose an answer first."; return; }
      const ans=parseInt(c.value,10);
      const ok = (S.cur.ans!==undefined) ? ans===S.cur.ans : ans===S.cur.a;
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
      <div class="kcard" style="margin-top:.55rem"><strong>Your speech:</strong><br/><span id="buildOut"></span></div>`;
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
    const place=vals[0], exp=vals[1], past=vals[2], now=vals[3], conn=vals[4], q=vals[5], end=vals[6];
    let out = `${place}: ${exp} ${past} ${q} ${end}`;
    if(buildLevel==="A2"){ out = `${place}: ${exp} ${past} ${conn}, ${now} ${q} ${end}`; }
    if(buildLevel==="B1"){ out = `Yes, ${place}! ${exp} ${past} ${conn}, ${now} ${q} ${end}`; }
    out = out.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    $("#buildOut").textContent = out;
  }
  function buildListen(){ const t=$("#buildOut").textContent.trim(); if(t) TTS.say(t); }
  function buildCheck(){
    const txt=$("#buildOut").textContent;
    const hasPP=/\bI['’]?ve\b|\bhaven't\b|\bhave you\b/i.test(txt);
    const hasPast=/\b(last year|yesterday|two days ago|last week)\b/i.test(txt);
    const hasQ=/(Is tax included\?|What’s the total after tax\?|How much is the tax\?|Could I have the receipt)/i.test(txt);
    const hasConn=/(First|Then|After that|Finally)/i.test(txt);
    const fb=$("#buildFb"); fb.classList.remove("hidden","ok","no");
    let ok=true, msg="✅ Great!";
    if(!hasPP){ ok=false; msg="❌ Add a present perfect sentence (I’ve… / I haven’t… / Have you…?)."; }
    else if(!hasPast){ ok=false; msg="❌ Add a past simple sentence with a finished time word (yesterday/last year…)."; }
    else if(!hasQ){ ok=false; msg="❌ Add one travel question (tax/total/receipt)."; }
    else if(buildLevel!=="A1" && !hasConn){ ok=false; msg="❌ Add a connector (Then / After that / Finally)."; }
    fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
    if(ok) Score.award("builder:"+buildLevel, buildLevel==="A1"?3:buildLevel==="A2"?5:7);
  }
  function buildReset(){ renderBuilder(); $("#buildFb").classList.add("hidden"); }

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
    if(localStorage.getItem(KEYS.auto)===null) TTS.setAuto(false);
    Score.setMax(90);
    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});
    tap($("#btnTestVoice"),()=>TTS.say("Have you ever been to Montreal? I visited last year. Is tax included?"));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnStart"),()=>document.getElementById("secVocab").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose US or UK accent.\n2) Vocabulary (tap cards + listen).\n3) Grammar (present perfect vs past simple).\n4) Exercises + Trainer.\n5) Roleplays.\n6) Listening with transcript toggle.\n7) Builder (A1/A2/B1)."));
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
