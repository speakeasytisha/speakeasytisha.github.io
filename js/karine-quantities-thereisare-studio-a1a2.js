/* SpeakEasyTisha — Quantities + There is/are Studio (A1/A2)
Build: 20260519-130548
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
  const KEYS={lang:"k_qty_lang", voice:"k_qty_voice", auto:"k_qty_auto"};
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
  const VOCAB=[{"cat": "Countable nouns", "icon": "🎟️", "w": "ticket (tickets)", "fr": "billet(s)", "def": "a piece of paper / digital pass", "ex": "We need two tickets."}, {"cat": "Countable nouns", "icon": "🧴", "w": "bottle (bottles)", "fr": "bouteille(s)", "def": "a container for a drink", "ex": "I’d like a bottle of water."}, {"cat": "Countable nouns", "icon": "🛏️", "w": "room (rooms)", "fr": "chambre(s)", "def": "a place to sleep in a hotel", "ex": "There are three rooms."}, {"cat": "Countable nouns", "icon": "🧻", "w": "towel (towels)", "fr": "serviette(s)", "def": "a cloth to dry yourself", "ex": "There are no towels."}, {"cat": "Countable nouns", "icon": "🍎", "w": "apple (apples)", "fr": "pomme(s)", "def": "a fruit", "ex": "There are some apples."}, {"cat": "Countable nouns", "icon": "👥", "w": "person (people)", "fr": "personne(s)", "def": "a human", "ex": "There are many people here."}, {"cat": "Uncountable nouns", "icon": "💧", "w": "water", "fr": "eau", "def": "a drink / liquid (not plural)", "ex": "Is there any water?"}, {"cat": "Uncountable nouns", "icon": "ℹ️", "w": "information", "fr": "information(s)", "def": "facts / details (not plural in English)", "ex": "Do you have any information?"}, {"cat": "Uncountable nouns", "icon": "🧳", "w": "luggage", "fr": "bagages", "def": "bags and suitcases (not plural)", "ex": "I have a lot of luggage."}, {"cat": "Uncountable nouns", "icon": "💰", "w": "money", "fr": "argent", "def": "cash / funds (not plural)", "ex": "I don’t have much money."}, {"cat": "Uncountable nouns", "icon": "⏳", "w": "time", "fr": "temps", "def": "minutes/hours (not plural)", "ex": "We don’t have much time."}, {"cat": "Uncountable nouns", "icon": "💡", "w": "advice", "fr": "conseil(s)", "def": "helpful suggestions (not plural)", "ex": "Can you give me some advice?"}, {"cat": "Quantifiers", "icon": "➕", "w": "some", "fr": "du/de la/des", "def": "positive sentences / offers / requests", "ex": "There is some water."}, {"cat": "Quantifiers", "icon": "❓", "w": "any", "fr": "du/de la/des (en négatif/question)", "def": "questions and negatives", "ex": "Is there any water?"}, {"cat": "Quantifiers", "icon": "📏", "w": "much", "fr": "beaucoup de (uncountable)", "def": "uncountable (usually questions/negatives)", "ex": "How much time do we have?"}, {"cat": "Quantifiers", "icon": "📏", "w": "many", "fr": "beaucoup de (countable)", "def": "countable plural", "ex": "How many tickets do we need?"}, {"cat": "Quantifiers", "icon": "🌟", "w": "a lot of", "fr": "beaucoup de", "def": "countable or uncountable (very common)", "ex": "There are a lot of people."}, {"cat": "There is / There are", "icon": "📍", "w": "There is…", "fr": "Il y a… (singulier/uncountable)", "def": "existence (one thing / uncountable)", "ex": "There is a bathroom on the left."}, {"cat": "There is / There are", "icon": "📍", "w": "There are…", "fr": "Il y a… (pluriel)", "def": "existence (plural)", "ex": "There are two cafés nearby."}, {"cat": "There is / There are", "icon": "🚫", "w": "There isn’t / There aren’t", "fr": "Il n’y a pas de…", "def": "negative forms", "ex": "There aren’t any towels."}, {"cat": "There is / There are", "icon": "❓", "w": "Is there…? / Are there…?", "fr": "Est-ce qu’il y a… ?", "def": "questions", "ex": "Is there a pharmacy near here?"}, {"cat": "There is / There are", "icon": "🗣️", "w": "How much…? / How many…?", "fr": "Combien de… ?", "def": "ask about quantity", "ex": "How many people are there?"}];
  const GRAMMAR={"countUncount": {"title": "Countable vs uncountable (travel basics)", "rule": ["Countable = you can count: one ticket / two tickets", "Use a/an + singular countable: a ticket, an apple", "Use many + plural countable: many people, many towels", "Uncountable = not counted: water, information, luggage, money, time, advice", "Use much + uncountable (often questions/negatives): much time, much money"], "examples": ["We need two tickets.", "There are many people here.", "Is there any water?", "We don’t have much time."], "note": "In English, information/advice/luggage are NOT plural."}, "someAny": {"title": "Some / Any", "rule": ["Some: affirmative (and polite offers/requests)", "Any: questions and negatives", "Common: any in questions: Is there any…? Do you have any…?"], "examples": ["There is some water.", "There isn’t any water.", "Is there any bottled water?", "Could I have some water, please?"], "note": "In offers/requests, some is very common."}, "muchMany": {"title": "Much / Many / A lot of", "rule": ["Much + uncountable: much time, much money (often questions/negatives)", "Many + plural countable: many people, many tickets", "A lot of + both: a lot of people / a lot of time"], "examples": ["How much time do we have?", "How many tickets do we need?", "There is a lot of luggage.", "There are a lot of people."], "note": "A lot of is the most natural in positive sentences."}, "thereIsAre": {"title": "There is / There are", "rule": ["There is + singular/uncountable", "There are + plural", "Negative: there isn’t / there aren’t", "Questions: Is there…? / Are there…?"], "examples": ["There is a bathroom on the left.", "There are two cafés nearby.", "There aren’t any towels.", "Is there a pharmacy near here?"], "note": "Use it to describe what exists in a place."}};
  const MCQ=[{"id": "m1", "prompt": "Choose the best: ___ water in the minibar.", "choices": ["There is some", "There are some", "There is many"], "ans": 0, "hint": "Water is uncountable → there is + some."}, {"id": "m2", "prompt": "Choose the best question: ___ any towels?", "choices": ["Is there", "Are there", "Do there"], "ans": 1, "hint": "Towels = plural → Are there…?"}, {"id": "m3", "prompt": "Choose the best: How ___ tickets do we need?", "choices": ["much", "many", "some"], "ans": 1, "hint": "Tickets = countable plural → many."}, {"id": "m4", "prompt": "Choose the best: We don’t have ___ time.", "choices": ["many", "much", "a"], "ans": 1, "hint": "Time = uncountable → much."}, {"id": "m5", "prompt": "Choose the best negative:", "choices": ["There isn’t any information.", "There aren’t any information.", "There isn’t many information."], "ans": 0, "hint": "Information is uncountable."}, {"id": "m6", "prompt": "Choose the best: There ___ two cafés nearby.", "choices": ["is", "are", "be"], "ans": 1, "hint": "Two cafés = plural → are."}, {"id": "m7", "prompt": "Choose the best: Could I have ___ water, please?", "choices": ["any", "some", "many"], "ans": 1, "hint": "Polite request → some."}, {"id": "m8", "prompt": "Choose the best: How ___ money do you have?", "choices": ["many", "much", "some"], "ans": 1, "hint": "Money is uncountable."}, {"id": "m9", "prompt": "Choose the best: There are ___ people in the lobby.", "choices": ["much", "many", "a"], "ans": 1, "hint": "People = plural countable."}, {"id": "m10", "prompt": "Choose the best: Do you have ___ advice?", "choices": ["some", "any", "many"], "ans": 1, "hint": "Question → any. Advice is uncountable."}];
  const DROPDOWNS=[{"id": "d1", "prompt": "Complete: There ___ a bathroom on the left.", "opts": ["is", "are", "am"], "ans": 0, "hint": "Singular → is."}, {"id": "d2", "prompt": "Complete: There ___ two tickets in my email.", "opts": ["is", "are", "was"], "ans": 1, "hint": "Plural → are."}, {"id": "d3", "prompt": "Complete: Is there ___ water?", "opts": ["any", "some", "many"], "ans": 0, "hint": "Question → any."}, {"id": "d4", "prompt": "Complete: Could I have ___ information, please?", "opts": ["some", "many", "a"], "ans": 0, "hint": "Polite request → some."}, {"id": "d5", "prompt": "Complete: We don’t have ___ time.", "opts": ["much", "many", "two"], "ans": 0, "hint": "Uncountable → much."}, {"id": "d6", "prompt": "Complete: How ___ people are there?", "opts": ["many", "much", "some"], "ans": 0, "hint": "People = countable plural."}, {"id": "d7", "prompt": "Complete: There aren’t ___ towels.", "opts": ["any", "some", "many"], "ans": 0, "hint": "Negative → any."}, {"id": "d8", "prompt": "Complete: There is ___ of luggage.", "opts": ["a lot", "many", "two"], "ans": 0, "hint": "A lot of + uncountable."}];
  const ORDER_TASKS=[{"id": "o1", "first": "Is", "words": ["there", "any", "water", "?"], "target": "Is there any water?", "hint": "Is there + any + uncountable?"}, {"id": "o2", "first": "Are", "words": ["there", "any", "towels", "in", "the", "room", "?"], "target": "Are there any towels in the room?", "hint": "Are there + any + plural?"}, {"id": "o3", "first": "How", "words": ["many", "tickets", "do", "we", "need", "?"], "target": "How many tickets do we need?", "hint": "How many + plural."}, {"id": "o4", "first": "There", "words": ["is", "some", "information", "online", "."], "target": "There is some information online.", "hint": "Information is uncountable."}];
  const BANK_TASKS=[{"id": "b1", "template": ["There", "is", "____", "water", "."], "bank": ["some", "many", "two"], "target": "There is some water.", "hint": "Affirmative → some."}, {"id": "b2", "template": ["There", "aren’t", "____", "towels", "."], "bank": ["any", "some", "much"], "target": "There aren’t any towels.", "hint": "Negative → any."}, {"id": "b3", "template": ["How", "____", "money", "do", "you", "have", "?"], "bank": ["much", "many", "some"], "target": "How much money do you have?", "hint": "Uncountable → much."}, {"id": "b4", "template": ["How", "____", "tickets", "do", "we", "need", "?"], "bank": ["many", "much", "a"], "target": "How many tickets do we need?", "hint": "Countable plural → many."}, {"id": "b5", "template": ["Could", "I", "have", "____", "information", ",", "please", "?"], "bank": ["some", "any", "many"], "target": "Could I have some information, please?", "hint": "Polite request → some."}];
  const SORT_TASK={"id": "s1", "prompt": "Sort the words into Countable vs Uncountable.", "cats": [{"id": "count", "label": "Countable"}, {"id": "uncount", "label": "Uncountable"}], "items": [{"t": "ticket", "cat": "count"}, {"t": "towel", "cat": "count"}, {"t": "bottle", "cat": "count"}, {"t": "people", "cat": "count"}, {"t": "water", "cat": "uncount"}, {"t": "information", "cat": "uncount"}, {"t": "luggage", "cat": "uncount"}, {"t": "money", "cat": "uncount"}, {"t": "time", "cat": "uncount"}, {"t": "advice", "cat": "uncount"}], "hint": "Water/information/luggage/money/time/advice are uncountable."};
  const TRAIN={"easy": [{"id": "te1", "p": "Choose: There is ___ water.", "choices": ["some", "many", "two"], "a": 0, "h": "Affirmative → some."}, {"id": "te2", "p": "Choose: Are there ___ towels?", "choices": ["any", "much", "a"], "a": 0, "h": "Question → any."}, {"id": "te3", "p": "Choose: How ___ tickets?", "choices": ["many", "much", "some"], "a": 0, "h": "Tickets → many."}, {"id": "te4", "p": "Choose: How ___ time?", "choices": ["much", "many", "two"], "a": 0, "h": "Time → much."}], "medium": [{"id": "tm1", "p": "Choose: There ___ two cafés.", "choices": ["is", "are", "am"], "a": 1, "h": "Plural → are."}, {"id": "tm2", "p": "Choose: There isn’t ___ information.", "choices": ["any", "many", "two"], "a": 0, "h": "Negative + uncountable → any."}, {"id": "tm3", "p": "Choose: Could I have ___ water, please?", "choices": ["some", "any", "many"], "a": 0, "h": "Polite request → some."}], "hard": [{"id": "th1", "p": "Best: ‘___ any towels in the room?’", "choices": ["Is there", "Are there", "There are"], "a": 1, "h": "Towels = plural → Are there…?"}, {"id": "th2", "p": "Best: ‘We don’t have ___ money.’", "choices": ["much", "many", "some"], "a": 0, "h": "Money is uncountable."}, {"id": "th3", "p": "Best: ‘There are ___ people, so it’s busy.’", "choices": ["a lot of", "much", "any"], "a": 0, "h": "A lot of + plural."}]};
  const LISTENING=[{"id": "l1", "title": "Hotel: towels + water", "lines": [{"who": "Karine", "side": "b", "say": "Hi. Are there any towels in the room?"}, {"who": "Reception", "side": "a", "say": "Yes, there are two towels. Do you need more?"}, {"who": "Karine", "side": "b", "say": "Yes, please. Is there any bottled water?"}, {"who": "Reception", "side": "a", "say": "Yes. There is some water in the minibar."}]}, {"id": "l2", "title": "Café: how much / how many", "lines": [{"who": "Server", "side": "a", "say": "Hello! How many coffees would you like?"}, {"who": "Karine", "side": "b", "say": "Two coffees, please. How much is it?"}, {"who": "Server", "side": "a", "say": "It’s six euros. Would you like any water?"}, {"who": "Karine", "side": "b", "say": "Yes, please. A bottle of water."}]}, {"id": "l3", "title": "Tickets: information + time", "lines": [{"who": "Staff", "side": "a", "say": "Do you have any questions?"}, {"who": "Karine", "side": "b", "say": "Yes. Do you have any information about the tour?"}, {"who": "Staff", "side": "a", "say": "Yes. There is some information online."}, {"who": "Karine", "side": "b", "say": "Great. How much time do we have before it starts?"}]}];
  const LQ={"l1": [["How many towels are there?", "Two", "None", "Many", 0], ["Is there any bottled water?", "Yes", "No", "Not mentioned", 0], ["Where is the water?", "In the minibar", "In the bathroom", "Outside", 0], ["Which word is used in the question?", "any", "many", "much", 0], ["Water is:", "uncountable", "countable", "plural", 0]], "l2": [["How many coffees?", "Two", "One", "Three", 0], ["How much is it?", "Six euros", "Ten euros", "Three euros", 0], ["Does the server offer water?", "Yes", "No", "Not mentioned", 0], ["What does she order for water?", "A bottle of water", "A glass of milk", "No water", 0], ["Coffees are:", "countable", "uncountable", "advice", 0]], "l3": [["Does she ask for information?", "Yes", "No", "Not mentioned", 0], ["Where is the information?", "Online", "In the room", "At the café", 0], ["She asks about:", "time", "money", "towels", 0], ["Which form is used?", "There is", "There are", "There were", 0], ["Information is:", "uncountable", "countable plural", "a person", 0]]};
  const WRITING={"title": "Request Builder (A1 → A2/B1)", "steps": [{"label": "1) Place", "opts": ["in the hotel", "in the room", "at the café", "at the ticket office"]}, {"label": "2) Need", "opts": ["water", "towels", "information", "time", "tickets"]}, {"label": "3) Question type", "opts": ["Is there any…?", "Are there any…?", "How much…?", "How many…?"]}, {"label": "4) Extra detail", "opts": ["near here", "for today", "in the room", "for two people", "before it starts"]}, {"label": "5) Polite ending", "opts": ["please.", "could you help me, please?", "thank you.", "thanks!"]}, {"label": "6) Connector", "opts": ["First", "Then", "After that", "Finally"]}, {"label": "7) There is/are answer", "opts": ["There is some", "There isn’t any", "There are some", "There aren’t any"]}], "hint": "A1: 1 question + 1 short answer. A2/B1: add a connector."};
  const ROLEPLAY={"a": "(Hotel) Is there any water in the room, please? — Yes, there is some water in the minibar.", "b": "(Hotel) Are there any towels? — No, there aren’t any towels. Could we have some towels, please?", "c": "(Tickets) How many tickets do we need for two people? — Two tickets. There is some information online."};

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

  // Runner helper
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
      <div class="kcard" style="margin-top:.55rem"><strong>Your request:</strong><br/><span id="buildOut"></span></div>`;
    const bb=host.querySelector("#bb");
    bb.innerHTML = WRITING.steps.map((st,i)=>`<div class="kcard" style="margin-top:.55rem">
      <div><strong>${esc(st.label)}</strong></div>
      <select class="select" data-step="${i}">${st.opts.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>
    </div>`).join("");
    $$("select[data-step]", bb).forEach(sel=>sel.addEventListener("change", updateBuildOut));
    updateBuildOut();
  }

  function pluralize(need){
    if(need==="people") return "people";
    if(need.endsWith("s")) return need;
    if(need==="towel") return "towels";
    if(need==="ticket") return "tickets";
    return need+"s";
  }

  function updateBuildOut(){
    const vals=$$("select[data-step]", $("#buildHost")).map(s=>s.value);
    const place=vals[0], need=vals[1], qtype=vals[2], detail=vals[3], polite=vals[4], conn=vals[5], ans=vals[6];

    let question="";
    if(qtype==="How much…?"){
      question=`How much ${need} is there ${detail} ${polite}`;
    } else if(qtype==="How many…?"){
      const pl=pluralize(need);
      question=`How many ${pl} are there ${detail} ${polite}`;
    } else if(qtype==="Are there any…?"){
      const pl=pluralize(need);
      question=`Are there any ${pl} ${detail} ${polite}`;
    } else {
      question=`Is there any ${need} ${detail} ${polite}`;
    }

    let answer="";
    if(ans==="There are some"){
      answer=`There are some ${pluralize(need)} ${place}.`;
    } else if(ans==="There aren’t any"){
      answer=`There aren’t any ${pluralize(need)} ${place}.`;
    } else if(ans==="There is some"){
      answer=`There is some ${need} ${place}.`;
    } else {
      answer=`There isn’t any ${need} ${place}.`;
    }

    let out = `${question} ${answer}`;
    if(buildLevel==="A2"){
      out = `${question} ${conn}, ${answer}`;
    }
    if(buildLevel==="B1"){
      out = `${question} ${conn}, ${answer} Thank you for your help.`;
    }

    out = out.replace(/\s+/g," ").replace(/\s+([,?.!])/g,"$1").trim();
    $("#buildOut").textContent = out;
  }

  function buildListen(){ const t=$("#buildOut").textContent.trim(); if(t) TTS.say(t); }

  function buildCheck(){
    const txt=$("#buildOut").textContent;
    const hasThere=/\bThere (is|are|isn’t|aren’t)\b/i.test(txt);
    const hasQuant=/\b(some|any|much|many|a lot)\b/i.test(txt);
    const hasQ=/\b(Is there|Are there|How much|How many)\b/i.test(txt);
    const hasConn=/(First|Then|After that|Finally)/i.test(txt);

    const fb=$("#buildFb"); fb.classList.remove("hidden","ok","no");
    let ok=true, msg="✅ Great!";
    if(!hasQ){ ok=false; msg="❌ Add a question (Is there…? / Are there…? / How much…? / How many…?)."; }
    else if(!hasThere){ ok=false; msg="❌ Add a there is/are answer."; }
    else if(!hasQuant){ ok=false; msg="❌ Add a quantity word (some/any/much/many/a lot of)."; }
    else if(buildLevel!=="A1" && !hasConn){ ok=false; msg="❌ Add a connector (Then / After that / Finally)."; }

    fb.classList.add(ok?"ok":"no"); fb.textContent=msg;
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

    Score.setMax(85);
    await buildVoiceSelect();
    syncAccent(); syncAuto();

    tap($("#voiceUS"),()=>{TTS.setLang("en-US"); syncAccent(); buildVoiceSelect(); TTS.say("US accent selected.");});
    tap($("#voiceUK"),()=>{TTS.setLang("en-GB"); syncAccent(); buildVoiceSelect(); TTS.say("UK accent selected.");});
    $("#voiceSelect").addEventListener("change",(e)=>{TTS.setVoiceName(e.target.value); TTS.say("Voice selected.");});

    tap($("#autoOff"),()=>{TTS.setAuto(false); syncAuto();});
    tap($("#autoOn"),()=>{TTS.setAuto(true); syncAuto();});

    tap($("#btnTestVoice"),()=>TTS.say("Is there any water? How many tickets do we need?"));
    tap($("#btnStop"),()=>TTS.stop());

    tap($("#btnStart"),()=>document.getElementById("secVocab").scrollIntoView({behavior:"smooth"}));
    tap($("#btnHow"),()=>alert("How to use:\n\n1) Choose US or UK accent.\n2) Vocabulary (tap cards + listen).\n3) Grammar (rules + examples).\n4) Exercises + Trainer.\n5) Roleplays.\n6) Listening with transcript toggle.\n7) Request Builder (A1/A2/B1)."));

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
