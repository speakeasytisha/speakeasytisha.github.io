/* Newsflash — upgraded fun version
   - Vocab Vault (flashcards + matching + categories)
   - Reporter Mode prompts
   - Tense Coach spoiler
   - QCM + Fill + Connector game + Timeline order
   - Touch friendly + reset + score
*/
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const els = {
    levelSelect: $("levelSelect"),
    accentSelect: $("accentSelect"),
    score: $("score"),
    streak: $("streak"),
    resetAllBtn: $("resetAllBtn"),
    newsGrid: $("newsGrid"),
    repHint: $("repHint"),
    repOut: $("repOut"),
    repReadBtn: $("repReadBtn"),
    repClearBtn: $("repClearBtn"),
    vCategory: $("vCategory"),
    vSearch: $("vSearch"),
    vocabGrid: $("vocabGrid"),
    shuffleVocabBtn: $("shuffleVocabBtn"),
    vocabQuizBtn: $("vocabQuizBtn"),
    vocabResetBtn: $("vocabResetBtn"),
    vmLeft: $("vmLeft"),
    vmRight: $("vmRight"),
    vmFeedback: $("vmFeedback"),
    catBank: $("catBank"),
    checkCatsBtn: $("checkCatsBtn"),
    catsFeedback: $("catsFeedback"),
    tenseCoachBtn: $("tenseCoachBtn"),
    tenseCoachBody: $("tenseCoachBody"),
    tcTopic: $("tcTopic"),
    tcTense: $("tcTense"),
    tcConnector: $("tcConnector"),
    tcBuildBtn: $("tcBuildBtn"),
    tcReadBtn: $("tcReadBtn"),
    tcResetBtn: $("tcResetBtn"),
    tcOut: $("tcOut"),
    qcmArea: $("qcmArea"),
    fillArea: $("fillArea"),
    connArea: $("connArea"),
    orderBank: $("orderBank"),
    orderUser: $("orderUser"),
    checkOrderBtn: $("checkOrderBtn"),
    orderFeedback: $("orderFeedback"),
    bTopic: $("bTopic"),
    bAngle: $("bAngle"),
    bTime: $("bTime"),
    bTone: $("bTone"),
    buildBtn: $("buildBtn"),
    readBtn: $("readBtn"),
    copyBtn: $("copyBtn"),
    resetBuilderBtn: $("resetBuilderBtn"),
    reportOut: $("reportOut"),
    gFilter: $("gFilter"),
    gShuffleBtn: $("gShuffleBtn"),
    glossGrid: $("glossGrid"),
    transArea: $("transArea"),
    spinBtn: $("spinBtn"),
    spinReadBtn: $("spinReadBtn"),
    spinCopyBtn: $("spinCopyBtn"),
    spinOut: $("spinOut"),
    lTopic: $("lTopic"),
    lDetail: $("lDetail"),
    lConnector: $("lConnector"),
    longBuildBtn: $("longBuildBtn"),
    longReadBtn: $("longReadBtn"),
    longCopyBtn: $("longCopyBtn"),
    longOut: $("longOut")
  };

  const app = {
    level: els.levelSelect.value,
    accent: els.accentSelect.value,
    score: 0,
    streak: 0,
    voices: [],
    vm: { left: null, right: null },
    cats: { selectedWordId: null },
    order: { bank: [], user: [], answer: [] },
    deep: { spinText: '' }
  };

  const NEWS = [
    { id:"energy", region:"World", date:"2026-03-02", title:"Energy prices surge as Middle East conflict disrupts shipping",
      brief:"Oil and gas prices climbed as supply routes faced disruptions, raising inflation concerns." },
    { id:"ukraine", region:"Europe", date:"2026-03-02", title:"Ukraine war: diplomacy continues while major issues remain unresolved",
      brief:"Officials said talks matter, though disagreements persist about conditions and territory." },
    { id:"fr_budget", region:"France", date:"2026-02-02", title:"France adopts the 2026 budget after surviving no-confidence votes",
      brief:"After political tension, the budget was adopted following parliamentary procedures." },
    { id:"ai_econ", region:"USA", date:"2026-03-02", title:"AI and the economy: policymakers debate jobs, productivity, and uncertainty",
      brief:"Some expect gains; others worry about disruptions and uneven impacts across sectors." },
    { id:"epstein", region:"USA", date:"2026-02-10", title:"Epstein case: more records released with redactions; questions continue",
      brief:"Authorities released additional files; many details remain redacted to protect victims and inquiries." },
    { id:"eu_def", region:"France / Europe", date:"2026-03-02", title:"Europe discusses stronger deterrence and defense cooperation",
      brief:"European leaders discussed defense cooperation amid wider security concerns." }
  ];

  const VOCAB = [
    { id:"ceasefire", word:"ceasefire", def:"a temporary stop in fighting", ex:"They called for a ceasefire.", cat:"Conflict", icon:"🕊️", level:"A2" },
    { id:"negotiations", word:"negotiations", def:"formal talks to reach an agreement", ex:"Negotiations continued.", cat:"Conflict", icon:"🤝", level:"A2" },
    { id:"sanctions", word:"sanctions", def:"official penalties to pressure a country or group", ex:"Sanctions were discussed.", cat:"Conflict", icon:"⛔", level:"B1" },
    { id:"escalation", word:"escalation", def:"a situation becomes more intense or serious", ex:"The escalation worried markets.", cat:"Conflict", icon:"📣", level:"B1" },
    { id:"deterrence", word:"deterrence", def:"strategy to prevent action by making it risky", ex:"Deterrence was a key topic.", cat:"Conflict", icon:"🛡️", level:"B2" },

    { id:"inflation", word:"inflation", def:"prices rising over time", ex:"Inflation affects everyone.", cat:"Economy", icon:"🧾", level:"A2" },
    { id:"supply", word:"supply", def:"the amount of goods available", ex:"Supply disruptions raise prices.", cat:"Economy", icon:"📦", level:"A2" },
    { id:"volatility", word:"volatility", def:"prices change quickly and unpredictably", ex:"Markets showed volatility.", cat:"Economy", icon:"🎢", level:"B1" },
    { id:"interest_rate", word:"interest rate", def:"the cost of borrowing money", ex:"Interest rates may rise.", cat:"Economy", icon:"🏦", level:"B1" },
    { id:"recession", word:"recession", def:"a period of economic decline", ex:"They feared a recession.", cat:"Economy", icon:"📉", level:"B2" },

    { id:"investigation", word:"investigation", def:"official process to discover facts", ex:"An investigation is ongoing.", cat:"Justice", icon:"🔎", level:"A2" },
    { id:"evidence", word:"evidence", def:"facts or information that show something is true", ex:"They reviewed evidence.", cat:"Justice", icon:"🧩", level:"A2" },
    { id:"witness", word:"witness", def:"a person who saw something", ex:"A witness spoke publicly.", cat:"Justice", icon:"👁️", level:"B1" },
    { id:"redacted", word:"redacted", def:"parts removed/hidden from a document", ex:"Names were redacted.", cat:"Justice", icon:"⬛", level:"B1" },
    { id:"accountability", word:"accountability", def:"responsibility for actions and decisions", ex:"People demanded accountability.", cat:"Justice", icon:"📌", level:"B2" },

    { id:"budget", word:"budget", def:"a financial plan for spending and income", ex:"Parliament debated the budget.", cat:"France", icon:"💶", level:"A2" },
    { id:"vote", word:"vote", def:"a formal choice made by a group", ex:"They voted in parliament.", cat:"France", icon:"🗳️", level:"A2" },
    { id:"no_confidence", word:"no-confidence vote", def:"a vote to try to bring down a government", ex:"A no-confidence vote failed.", cat:"France", icon:"⚡", level:"B1" },
    { id:"majority", word:"majority", def:"more than half", ex:"They needed a majority.", cat:"France", icon:"➕", level:"B1" },
    { id:"coalition", word:"coalition", def:"a temporary alliance of parties/groups", ex:"A coalition negotiated a deal.", cat:"France", icon:"🧷", level:"B2" }
  ];

  // Deep Dive bilingual mini-glossary (selective FR support)
  const GLOSS = [
    { en:"ceasefire", fr:"cessez-le-feu", cat:"Conflict" },
    { en:"negotiations", fr:"négociations", cat:"Conflict" },
    { en:"sanctions", fr:"sanctions", cat:"Conflict" },
    { en:"escalation", fr:"escalade", cat:"Conflict" },
    { en:"deterrence", fr:"dissuasion", cat:"Conflict" },

    { en:"inflation", fr:"inflation", cat:"Economy" },
    { en:"supply chain", fr:"chaîne d’approvisionnement", cat:"Economy" },
    { en:"interest rate", fr:"taux d’intérêt", cat:"Economy" },
    { en:"volatility", fr:"volatilité", cat:"Economy" },
    { en:"recession", fr:"récession", cat:"Economy" },

    { en:"investigation", fr:"enquête", cat:"Justice" },
    { en:"evidence", fr:"preuves", cat:"Justice" },
    { en:"witness", fr:"témoin", cat:"Justice" },
    { en:"redacted", fr:"caviardé / expurgé", cat:"Justice" },
    { en:"accountability", fr:"responsabilité (reddition de comptes)", cat:"Justice" },

    { en:"budget", fr:"budget", cat:"France" },
    { en:"no-confidence vote", fr:"motion de censure", cat:"France" },
    { en:"majority", fr:"majorité", cat:"France" },
    { en:"coalition", fr:"coalition", cat:"France" },
    { en:"policy", fr:"politique publique", cat:"France" }
  ];

  // Translation challenges (mixed directions)
  const TRANS = {
    A2: [
      { dir:"FR→EN", prompt:"cessez-le-feu", choices:["ceasefire","cease fault","fire stop"], answer:0, why:"Ceasefire = stop fighting temporarily." },
      { dir:"EN→FR", prompt:"inflation", choices:["inflation","influence","infection"], answer:0, why:"Same word in French." },
      { dir:"FR→EN", prompt:"enquête", choices:["inquiry / investigation","equity","equipment"], answer:0, why:"Investigation = enquête." }
    ],
    B1: [
      { dir:"EN→FR", prompt:"interest rate", choices:["taux d’intérêt","taux de change","taux de réussite"], answer:0, why:"Interest rate = taux d’intérêt." },
      { dir:"FR→EN", prompt:"motion de censure", choices:["no-confidence vote","vote of confidence","voter card"], answer:0, why:"No-confidence vote attempts to bring down a government." },
      { dir:"EN→FR", prompt:"redacted", choices:["caviardé / expurgé","rédigé","redressé"], answer:0, why:"Redacted = partially blacked out/hidden." }
    ],
    B2: [
      { dir:"FR→EN", prompt:"chaîne d’approvisionnement", choices:["supply chain","supply change","chain supply"], answer:0, why:"Supply chain = chaîne d’approvisionnement." },
      { dir:"EN→FR", prompt:"accountability", choices:["responsabilité (reddition de comptes)","capacité","comptabilité"], answer:0, why:"Accountability = responsibility for actions." },
      { dir:"EN→FR", prompt:"deterrence", choices:["dissuasion","désertion","dérivation"], answer:0, why:"Deterrence = dissuasion." }
    ]
  };

  // Scenario spinner packs (safe, classroom-friendly, not graphic)
  const SPIN = {
    roles: ["You are the anchor", "You are the field reporter", "You are the fact-checker", "You are the editor"],
    constraints: ["Use 2 connectors", "Use 3 vocab words", "Use one passive sentence", "Use 'while' once"],
    locations: ["in Paris", "in Washington", "in Brussels", "online (social media)"],
    tasks: [
      "Give a neutral update and a clear timeline.",
      "Explain why people care (impact).",
      "Compare two perspectives without taking sides.",
      "Separate facts from opinions and say what you cannot confirm."
    ]
  };

  // Long report “detail packs”
  const LONG_PACKS = {
    WHAT: {
      A2: "First, give 1 short fact. Then add one background sentence with 'while'. Finish with what is true now.",
      B1: "Build a 3-step timeline: background → update → reaction. Add 2 connectors.",
      B2: "Create a coherent narrative: context, key turning point, current implications. Keep it balanced."
    },
    WHY: {
      A2: "Say how it affects people: prices, safety, daily life.",
      B1: "Mention impact on households, companies, and politics (1 line each).",
      B2: "Explain second-order effects (confidence, markets, policy choices) carefully."
    },
    CHECK: {
      A2: "Say: 'We don't know everything yet.'",
      B1: "Mention sources: officials / reports / witnesses (neutral).",
      B2: "Use cautious language: 'allegedly', 'reportedly', 'according to'."
    },
    BALANCE: {
      A2: "Use: 'Some people think… Others think…'",
      B1: "Use: 'Supporters argue… Critics argue…' (neutral).",
      B2: "Use hedging + balance: 'It appears… However…' Avoid strong claims."
    }
  };

  const CAT_LABELS = {
    All:"All",
    Conflict:"🕊️ Conflict & diplomacy",
    Economy:"📈 Economy & markets",
    Justice:"⚖️ Justice & investigation",
    France:"🇫🇷 France & politics"
  };

  const BANK = {
    A2:{
      qcm:[
        {prompt:"While oil prices ____ (rise), some people worried about inflation.", choices:["rose","were rising","rise"], answer:1, why:"Past Continuous = background in progress."},
        {prompt:"France ____ the 2026 budget after the vote.", choices:["adopted","adopts","was adopting"], answer:0, why:"Past Simple = completed decision."},
        {prompt:"In general, markets ____ quickly to uncertainty.", choices:["react","reacted","were reacting"], answer:0, why:"Present Simple = general truth."}
      ],
      fill:[
        {sentence:"The government ____ (survive) the vote.", answer:"survived", why:"Past Simple = finished event."},
        {sentence:"While prices ____ (rise), transport costs increased.", answer:"were rising", why:"Past Continuous = background action."}
      ],
      conn:[
        {prompt:"Officials spoke. ____ , many questions stayed unanswered.", choices:["However","Because","So that"], answer:0, why:"However = contrast."},
        {prompt:"Prices rose; ____ , some companies increased fees.", choices:["as a result","although","unless"], answer:0, why:"As a result = consequence."}
      ],
      order:{bank:["Tensions were rising","A new update appeared","People reacted online"], answer:["Tensions were rising","A new update appeared","People reacted online"]},
      tc:{
        PRES:["Markets react to uncertainty.","People follow updates closely."],
        PAST:["Officials announced new information.","The vote ended without changes."],
        PCONT:["Prices were rising quickly.","Reporters were following the story."]
      }
    },
    B1:{
      qcm:[
        {prompt:"While analysts ____ (debate) AI, policymakers looked for answers.", choices:["debated","were debating","debate"], answer:1, why:"Background action = Past Continuous."},
        {prompt:"The files ____ (release) with heavy redactions.", choices:["were released","release","were releasing"], answer:0, why:"Passive Past Simple focuses on the result."},
        {prompt:"Diplomacy matters, but disagreements ____.", choices:["remain","remained","were remaining"], answer:0, why:"Present Simple = still true now."}
      ],
      fill:[
        {sentence:"While investors ____ (watch) energy prices, stocks fell.", answer:"were watching", why:"Past Continuous = ongoing background."},
        {sentence:"Parliament ____ (vote) and the budget passed.", answer:"voted", why:"Past Simple = completed."}
      ],
      conn:[
        {prompt:"Shipping was disrupted; ____ , supply became uncertain.", choices:["therefore","whereas","in spite of"], answer:0, why:"Therefore = result."},
        {prompt:"Talks continued. ____ , no agreement was announced.", choices:["However","Because","So"], answer:0, why:"However = contrast."}
      ],
      order:{bank:["Prices were climbing","A statement was published","Public discussion intensified"], answer:["Prices were climbing","A statement was published","Public discussion intensified"]},
      tc:{
        PRES:["People expect clear timelines.","News moves fast online."],
        PAST:["Authorities released updates.","The motion failed in parliament."],
        PCONT:["Markets were reacting to uncertainty.","Officials were meeting behind closed doors."]
      }
    },
    B2:{
      qcm:[
        {prompt:"While investors ____ (watch) energy routes, inflation fears ____ (grow).", choices:["watched / grew","were watching / grew","were watching / were growing"], answer:1, why:"Past Continuous + Past Simple."},
        {prompt:"Headline style: “Europe ____ options for defense cooperation.”", choices:["discusses","discussed","was discussing"], answer:0, why:"Headline present = immediacy."},
        {prompt:"Choose the best contrast: “Officials spoke. ____, uncertainty remained.”", choices:["However","Because","Therefore"], answer:0, why:"However = contrast."}
      ],
      fill:[
        {sentence:"While the situation ____ (develop), journalists compared sources.", answer:"was developing", why:"Past Continuous = in progress."},
        {sentence:"Then new details ____ (change) the tone of debate.", answer:"changed", why:"Past Simple = turning point."}
      ],
      conn:[
        {prompt:"Prices surged; ____ , central banks faced pressure.", choices:["as a result","so that","even if"], answer:0, why:"As a result = consequence."},
        {prompt:"Information was released; ____ , many lines stayed redacted.", choices:["however","because","therefore"], answer:0, why:"However = contrast."}
      ],
      order:{bank:["Background tensions were rising","A key announcement shifted the narrative","Reactions spread across media"], answer:["Background tensions were rising","A key announcement shifted the narrative","Reactions spread across media"]},
      tc:{
        PRES:["Markets respond to perceived risk.","Governments face competing priorities."],
        PAST:["Officials clarified their position.","The report triggered renewed debate."],
        PCONT:["Commentators were analyzing the implications.","Prices were fluctuating sharply."]
      }
    }
  };

  function escapeHTML(str){return String(str).replace(/[&<>"']/g,(m)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));}
  function shuffle(arr){const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;}
  function norm(s){return String(s||"").trim().toLowerCase();}
  function levelRank(l){return l==="A2"?0:l==="B1"?1:2;}
  function currentVocab(){const r=levelRank(app.level); return VOCAB.filter(v=>levelRank(v.level)<=r);}
  function setScore(d){app.score=Math.max(0,app.score+d); els.score.textContent=String(app.score);}
  function setStreak(ok){app.streak=ok?(app.streak+1):0; els.streak.textContent=String(app.streak);}

  function loadVoices(){ if(!window.speechSynthesis) return; app.voices = window.speechSynthesis.getVoices(); }
  function pickVoice(accent){
    if(!app.voices || !app.voices.length) return null;
    const want = accent==="UK" ? "en-GB" : "en-US";
    return app.voices.find(v => (v.lang||"").toLowerCase()===want.toLowerCase())
      || app.voices.find(v => (v.lang||"").toLowerCase().startsWith("en"))
      || null;
  }
  function speak(text){
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(app.accent);
    if(v) u.voice = v;
    u.rate = 0.98;
    window.speechSynthesis.speak(u);
  }

  function pickVocabHintsForStory(storyId){
    const map={
      energy:["supply","inflation","volatility","interest rate","disruption"],
      ukraine:["ceasefire","negotiations","sanctions","escalation"],
      fr_budget:["budget","vote","majority","no-confidence vote","coalition"],
      ai_econ:["productivity","uncertainty","jobs","volatility","interest rate"],
      epstein:["investigation","evidence","witness","redacted","accountability"],
      eu_def:["deterrence","negotiations","coalition","escalation"]
    };
    return (map[storyId]||["budget","inflation","investigation","negotiations","evidence"]).slice(0,5);
  }

  // NEWS
  function renderNews(){
    els.newsGrid.innerHTML="";
    NEWS.forEach(n=>{
      const card=document.createElement("article");
      card.className="newsCard";
      card.innerHTML=`
        <div class="newsTop">
          <div class="badge"><span class="dot"></span><span>${escapeHTML(n.region)}</span></div>
          <div class="badge"><span>📅</span><span>${escapeHTML(n.date)}</span></div>
        </div>
        <h3 class="newsTitle">${escapeHTML(n.title)}</h3>
        <p class="newsBody">${escapeHTML(n.brief)}</p>
        <div class="newsMeta">
          <span class="tag">Timeline tenses</span><span class="tag">Vocab</span><span class="tag">Speaking</span>
        </div>`;
      card.addEventListener("click", ()=>openReporterMode(n));
      els.newsGrid.appendChild(card);
    });
  }
  function openReporterMode(n){
    const hints = pickVocabHintsForStory(n.id);
    const out =
`🗞️ ${n.title}
(${n.date} — ${n.region})

Quick brief: ${n.brief}

🎤 Reporter prompts:
- PAST SIMPLE: What happened? (1 sentence)
- PAST CONTINUOUS: What was happening in the background?
- PRESENT SIMPLE: What is generally true now?

✨ Useful words (try 3): ${hints.join(", ")}

Bonus: Add a connector: However / Meanwhile / As a result.`;
    els.repOut.textContent = out;
    els.repHint.textContent = "Try to speak for 20–30 seconds.";
  }

  // VOCAB UI
  function renderVCategory(){
    els.vCategory.innerHTML="";
    ["All","Conflict","Economy","Justice","France"].forEach(c=>{
      const opt=document.createElement("option");
      opt.value=c; opt.textContent=CAT_LABELS[c]||c;
      els.vCategory.appendChild(opt);
    });
    els.vCategory.value="All";
  }
  function filterVocab(){
    const cat=els.vCategory.value;
    const q=norm(els.vSearch.value);
    return currentVocab()
      .filter(v=>cat==="All"||v.cat===cat)
      .filter(v=>!q||norm(v.word).includes(q)||norm(v.def).includes(q));
  }
  function renderVocab(){
    const list=filterVocab();
    els.vocabGrid.innerHTML="";
    list.forEach(v=>{
      const card=document.createElement("div");
      card.className="vCard";
      card.innerHTML=`
        <div class="vTop">
          <div class="vIcon" aria-hidden="true">${v.icon}</div>
          <div class="vMeta">
            <span class="vChip">${escapeHTML(v.cat)}</span>
            <span class="vChip">${escapeHTML(v.level)}</span>
          </div>
        </div>
        <h3 class="vWord">${escapeHTML(v.word)}</h3>
        <p class="vDef">${escapeHTML(v.def)}</p>
        <div class="vBtns">
          <button class="vBtn" type="button" data-say="${escapeHTML(v.word)}">🔊 Say</button>
          <button class="vBtn" type="button" data-flip="${v.id}">🎴 Example</button>
        </div>
        <p class="hint small" id="ex_${v.id}" hidden>Example: ${escapeHTML(v.ex)}</p>`;
      card.querySelectorAll("[data-say]").forEach(btn=>btn.addEventListener("click",()=>speak(btn.getAttribute("data-say"))));
      card.querySelector("[data-flip]").addEventListener("click",()=>{
        const p=card.querySelector("#ex_"+v.id);
        p.hidden=!p.hidden;
      });
      els.vocabGrid.appendChild(card);
    });
  }

  function startVocabQuiz(){
    const pool=filterVocab();
    if(pool.length<4) return;
    const target=pool[Math.floor(Math.random()*pool.length)];
    const distractors=shuffle(pool.filter(x=>x.id!==target.id)).slice(0,3);
    const options=shuffle([target,...distractors]);

    const baseText = `🧠 Vocab Quiz\n\nDefinition:\n“${target.def}”\n\nChoose the word:`;
    els.repOut.textContent = baseText;

    const wrap=document.createElement("div");
    wrap.style.marginTop="10px";
    wrap.style.display="flex";
    wrap.style.flexWrap="wrap";
    wrap.style.gap="8px";

    options.forEach(opt=>{
      const b=document.createElement("button");
      b.type="button"; b.className="choiceBtn"; b.textContent=opt.word;
      b.addEventListener("click",()=>{
        const ok=opt.id===target.id;
        if(ok){setScore(2); setStreak(true);} else {setStreak(false);}
        els.repOut.textContent = baseText + "\n\n" + (ok?`✅ Correct! “${target.word}”`:`❌ Not quite. Correct: “${target.word}”`) + "\n\nExample: " + target.ex;
        speak(target.word);
      });
      wrap.appendChild(b);
    });
    els.repOut.appendChild(wrap);
  }

  // Vocab matching
  function renderVMatch(){
    const list=shuffle(filterVocab()).slice(0,6);
    const defs=shuffle(list.map(v=>({id:v.id,text:v.def})));

    els.vmLeft.innerHTML=""; els.vmRight.innerHTML="";
    els.vmFeedback.textContent="Tap a word, then its definition.";
    app.vm.left=null; app.vm.right=null;

    list.forEach(v=>{
      const chip=document.createElement("button");
      chip.type="button"; chip.className="chip"; chip.textContent=v.word; chip.dataset.id=v.id;
      chip.addEventListener("click",()=>{
        if(chip.classList.contains("disabled")) return;
        Array.from(els.vmLeft.querySelectorAll(".chip")).forEach(c=>c.classList.remove("selected"));
        chip.classList.add("selected");
        app.vm.left=v.id;
        tryResolve();
      });
      els.vmLeft.appendChild(chip);
    });

    defs.forEach(d=>{
      const chip=document.createElement("button");
      chip.type="button"; chip.className="chip"; chip.textContent=d.text; chip.dataset.id=d.id;
      chip.addEventListener("click",()=>{
        if(chip.classList.contains("disabled")) return;
        Array.from(els.vmRight.querySelectorAll(".chip")).forEach(c=>c.classList.remove("selected"));
        chip.classList.add("selected");
        app.vm.right=d.id;
        tryResolve();
      });
      els.vmRight.appendChild(chip);
    });

    function tryResolve(){
      if(!app.vm.left || !app.vm.right) return;
      const ok=app.vm.left===app.vm.right;
      if(ok){
        setScore(1); setStreak(true);
        els.vmFeedback.innerHTML="✅ Nice!";
        lock(app.vm.left);
      } else {
        setStreak(false);
        els.vmFeedback.innerHTML="❌ Try again.";
      }
      app.vm.left=null; app.vm.right=null;
      Array.from(document.querySelectorAll(".chip.selected")).forEach(c=>c.classList.remove("selected"));
    }
    function lock(id){
      Array.from(document.querySelectorAll(`#vmLeft .chip, #vmRight .chip`)).forEach(c=>{
        if(c.dataset.id===id){ c.classList.add("disabled"); c.disabled=true; }
      });
    }
  }

  // Categories (drag or tap)
  function renderCategories(){
    els.catBank.innerHTML="";
    els.catsFeedback.textContent="Tap a word, then tap a category box (or drag).";
    app.cats.selectedWordId=null;

    const list=shuffle(currentVocab()).slice(0,12);
    list.forEach(v=>{
      const t=document.createElement("div");
      t.className="wordToken";
      t.textContent=v.word;
      t.dataset.id=v.id;
      t.dataset.cat=v.cat;
      t.draggable=true;

      t.addEventListener("click",()=>{
        Array.from(document.querySelectorAll(".wordToken")).forEach(x=>x.classList.remove("selected"));
        t.classList.add("selected");
        app.cats.selectedWordId=v.id;
      });

      t.addEventListener("dragstart",(e)=>{ e.dataTransfer.setData("text/plain", v.id); });

      els.catBank.appendChild(t);
    });

    Array.from(document.querySelectorAll(".catBox")).forEach(box=>{
      const dz=box.querySelector(".dropzone");
      dz.addEventListener("dragover",(e)=>e.preventDefault());
      dz.addEventListener("drop",(e)=>{
        e.preventDefault();
        const id=e.dataTransfer.getData("text/plain");
        moveToken(id,dz);
      });
      box.addEventListener("click",()=>{
        if(!app.cats.selectedWordId) return;
        moveToken(app.cats.selectedWordId, dz);
        app.cats.selectedWordId=null;
        Array.from(document.querySelectorAll(".wordToken")).forEach(x=>x.classList.remove("selected"));
      });
    });

    function moveToken(id, dz){
      const token=document.querySelector(`.wordToken[data-id="${CSS.escape(id)}"]`);
      if(token) dz.appendChild(token);
    }

    els.checkCatsBtn.onclick=function(){
      let total=0, ok=0;
      Array.from(document.querySelectorAll(".catBox")).forEach(box=>{
        const cat=box.getAttribute("data-cat");
        const dz=box.querySelector(".dropzone");
        Array.from(dz.querySelectorAll(".wordToken")).forEach(t=>{
          total++;
          if(t.dataset.cat===cat) ok++;
        });
      });
      if(total===0){ els.catsFeedback.innerHTML="⚠️ Place words into the category boxes first."; return; }
      if(ok===total){ setScore(3); setStreak(true); els.catsFeedback.innerHTML=`✅ Perfect! ${ok}/${total} correct.`; }
      else { setStreak(false); els.catsFeedback.innerHTML=`❌ ${ok}/${total} correct. Tip: “budget/vote”→France, “inflation/interest rate”→Economy.`; }
    };
  }

  // ---------- 6) DEEP DIVE ----------
  function renderGlossFilter(){
    if(!els.gFilter) return;
    els.gFilter.innerHTML = "";
    const cats = ["All","Conflict","Economy","Justice","France"];
    cats.forEach(c=>{
      const opt=document.createElement("option");
      opt.value=c;
      opt.textContent = CAT_LABELS[c] || c;
      els.gFilter.appendChild(opt);
    });
    els.gFilter.value = "All";
  }

  function renderGloss(){
    if(!els.glossGrid) return;
    const cat = els.gFilter ? els.gFilter.value : "All";
    const list = shuffle(GLOSS.filter(g => cat==="All" || g.cat===cat));
    els.glossGrid.innerHTML = "";
    list.forEach(g=>{
      const card=document.createElement("div");
      card.className="gCard";
      card.innerHTML = `
        <div class="gTop">
          <div class="vChip">${escapeHTML(g.cat)}</div>
          <button class="vBtn" type="button" data-say="${escapeHTML(g.en)}">🔊 Say</button>
        </div>
        <h4 class="gEn">${escapeHTML(g.en)}</h4>
        <p class="gFr hidden">🇫🇷 ${escapeHTML(g.fr)}</p>
        <div class="gBtns">
          <button class="vBtn" type="button" data-reveal="1">Show French</button>
          <button class="vBtn" type="button" data-hide="1">Hide</button>
        </div>
      `;
      card.querySelector("[data-say]").addEventListener("click",()=>speak(g.en));
      const fr = card.querySelector(".gFr");
      card.querySelector("[data-reveal]").addEventListener("click",()=>fr.classList.remove("hidden"));
      card.querySelector("[data-hide]").addEventListener("click",()=>fr.classList.add("hidden"));
      card.addEventListener("dblclick",()=>fr.classList.toggle("hidden")); // fun shortcut
      els.glossGrid.appendChild(card);
    });
  }

  function renderTrans(){
    if(!els.transArea) return;
    const items = (TRANS[app.level] || TRANS.B1);
    els.transArea.innerHTML = "";
    items.forEach((q,idx)=>{
      const box=document.createElement("div"); box.className="qItem";
      const p=document.createElement("p"); p.className="qPrompt";
      p.innerHTML = `<b>Q${idx+1}.</b> <span class="vChip">${escapeHTML(q.dir)}</span> Translate: <b>${escapeHTML(q.prompt)}</b>`;
      const choices=document.createElement("div"); choices.className="choices";
      const fb=document.createElement("div"); fb.className="feedback"; fb.style.display="none";
      q.choices.forEach((c,i)=>{
        const b=document.createElement("button"); b.type="button"; b.className="choiceBtn"; b.textContent=c;
        b.addEventListener("click",()=>{
          if(box.dataset.done==="1") return;
          const ok = i===q.answer;
          box.dataset.done="1";
          Array.from(choices.querySelectorAll("button")).forEach(btn=>btn.disabled=true);
          fb.style.display="block";
          fb.classList.remove("ok","bad"); fb.classList.add(ok?"ok":"bad");
          fb.innerHTML = ok
            ? `✅ <b>Correct.</b> ${escapeHTML(q.why)}`
            : `❌ <b>Best:</b> <b>${escapeHTML(q.choices[q.answer])}</b>. ${escapeHTML(q.why)}`;
          if(ok){ setScore(2); setStreak(true);} else { setStreak(false); }
        });
        choices.appendChild(b);
      });
      box.appendChild(p); box.appendChild(choices); box.appendChild(fb);
      els.transArea.appendChild(box);
    });
  }

  function spinScenario(){
    if(!els.spinOut) return "";
    const story = NEWS[Math.floor(Math.random()*NEWS.length)];
    const role = SPIN.roles[Math.floor(Math.random()*SPIN.roles.length)];
    const where = SPIN.locations[Math.floor(Math.random()*SPIN.locations.length)];
    const constraint = SPIN.constraints[Math.floor(Math.random()*SPIN.constraints.length)];
    const task = SPIN.tasks[Math.floor(Math.random()*SPIN.tasks.length)];
    const vocab3 = shuffle(pickVocabHintsForStory(story.id)).slice(0,3).join(", ");

    const txt =
`🎲 Scenario Spinner
Role: ${role}
Location: ${where}
Story: ${story.title}

Mission: ${task}
Constraint: ${constraint}

Timeline checklist:
1) Past Simple — what happened?
2) Past Continuous — what was happening in the background?
3) Present Simple — what is true now?

Use these 3 words: ${vocab3}`;

    app.deep.spinText = txt;
    els.spinOut.textContent = txt;
    return txt;
  }

  function renderLongTopic(){
    if(!els.lTopic) return;
    els.lTopic.innerHTML = "";
    NEWS.forEach(n=>{
      const o=document.createElement("option");
      o.value=n.id;
      o.textContent = `${n.region}: ${n.title}`;
      els.lTopic.appendChild(o);
    });
  }

  function buildLongReport(){
    if(!els.longOut) return "";
    const story = NEWS.find(n=>n.id===els.lTopic.value) || NEWS[0];
    const pack = els.lDetail.value;
    const conn = els.lConnector.value;

    const packLine = (LONG_PACKS[pack] && LONG_PACKS[pack][app.level]) ? LONG_PACKS[pack][app.level] : "";
    const vocab5 = shuffle(pickVocabHintsForStory(story.id)).slice(0,5);

    // Selective French hints for tougher words (B1/B2)
    const frHints = GLOSS
      .filter(g => vocab5.some(v => norm(v)===norm(g.en)))
      .slice(0,3)
      .map(g => `${g.en} = ${g.fr}`)
      .join(" • ");

    const bodyA2 =
`Earlier, ${story.brief}
While people were following updates, the situation was changing.
Now, many people want clear information. ${conn}, the story continues.`;

    const bodyB1 =
`Earlier, ${story.brief}
While officials were speaking, public discussion was growing.
Now, attention remains high. ${conn}, people focus on impact and next steps.`;

    const bodyB2 =
`Earlier, ${story.brief}
While commentators were analyzing implications, new information surfaced and shaped reactions.
Now, the situation remains fluid. ${conn}, it is important to distinguish verified facts from speculation.`;

    const body = app.level==="A2" ? bodyA2 : app.level==="B1" ? bodyB1 : bodyB2;

    const txt =
`🗞️ Long report (${app.level})
Story: ${story.title}

Guide:
- ${packLine}

Report:
${body}

Vocabulary challenge (use 5):
${vocab5.join(", ")}

FR hints (optional):
${frHints || "—"}`;

    els.longOut.textContent = txt;
    return txt;
  }

  function resetDeepDive(which){
    if(which==="gloss"){ renderGlossFilter(); renderGloss(); }
    if(which==="trans"){ renderTrans(); }
    if(which==="spin"){ if(els.spinOut) els.spinOut.textContent=""; app.deep.spinText=""; }
    if(which==="long"){ if(els.longOut) els.longOut.textContent=""; }
  }

  // Tense coach
  function renderTopicsInto(sel){
    sel.innerHTML="";
    NEWS.forEach(n=>{
      const o=document.createElement("option");
      o.value=n.id; o.textContent=`${n.region}: ${n.title}`;
      sel.appendChild(o);
    });
  }
  function labelTense(t){return t==="PRES"?"Present Simple":t==="PAST"?"Past Simple":"Past Continuous";}
  function buildTenseCoach(){
    const storyId=els.tcTopic.value;
    const story=NEWS.find(n=>n.id===storyId)||NEWS[0];
    const tense=els.tcTense.value;
    const conn=els.tcConnector.value;
    const base=BANK[app.level].tc[tense];
    const pick=base[Math.floor(Math.random()*base.length)];
    const line=`Topic: ${story.title}\nSentence (${labelTense(tense)}): ${pick} ${conn}, ${story.brief}`;
    els.tcOut.textContent=line;
  }

  // Practice renderers
  function renderQCM(){
    const items=BANK[app.level].qcm;
    els.qcmArea.innerHTML="";
    items.forEach((q,idx)=>{
      const box=document.createElement("div"); box.className="qItem";
      const p=document.createElement("p"); p.className="qPrompt"; p.innerHTML=`<b>Q${idx+1}.</b> ${escapeHTML(q.prompt)}`;
      const choices=document.createElement("div"); choices.className="choices";
      const fb=document.createElement("div"); fb.className="feedback"; fb.style.display="none";
      q.choices.forEach((c,i)=>{
        const b=document.createElement("button"); b.type="button"; b.className="choiceBtn"; b.textContent=c;
        b.addEventListener("click",()=>{
          if(box.dataset.done==="1") return;
          const ok=i===q.answer;
          box.dataset.done="1";
          Array.from(choices.querySelectorAll("button")).forEach(btn=>btn.disabled=true);
          fb.style.display="block";
          fb.classList.remove("ok","bad"); fb.classList.add(ok?"ok":"bad");
          fb.innerHTML= ok ? `✅ <b>Correct.</b> ${escapeHTML(q.why)}` : `❌ <b>Best:</b> <b>${escapeHTML(q.choices[q.answer])}</b>. ${escapeHTML(q.why)}`;
          if(ok){setScore(1); setStreak(true);} else {setStreak(false);}
        });
        choices.appendChild(b);
      });
      box.appendChild(p); box.appendChild(choices); box.appendChild(fb);
      els.qcmArea.appendChild(box);
    });
  }

  function renderFill(){
    const items=BANK[app.level].fill;
    els.fillArea.innerHTML="";
    items.forEach((it,idx)=>{
      const box=document.createElement("div"); box.className="qItem";
      const p=document.createElement("p"); p.className="qPrompt"; p.innerHTML=`<b>Item ${idx+1}.</b> ${escapeHTML(it.sentence)}`;
      const row=document.createElement("div"); row.className="inline";
      const input=document.createElement("input"); input.className="input"; input.type="text"; input.placeholder="Type your answer…";
      const check=document.createElement("button"); check.type="button"; check.className="btn small"; check.textContent="Check";
      const fb=document.createElement("div"); fb.className="feedback"; fb.style.display="none";
      function doCheck(){
        if(box.dataset.done==="1") return;
        const ok=norm(input.value)===norm(it.answer);
        box.dataset.done="1"; input.disabled=true; check.disabled=true;
        fb.style.display="block"; fb.classList.remove("ok","bad"); fb.classList.add(ok?"ok":"bad");
        fb.innerHTML= ok ? `✅ <b>Correct.</b> ${escapeHTML(it.why)}` : `❌ <b>Answer:</b> <b>${escapeHTML(it.answer)}</b>. ${escapeHTML(it.why)}`;
        if(ok){setScore(1); setStreak(true);} else {setStreak(false);}
      }
      check.addEventListener("click",doCheck);
      input.addEventListener("keydown",(e)=>{if(e.key==="Enter") doCheck();});
      row.appendChild(input); row.appendChild(check);
      box.appendChild(p); box.appendChild(row); box.appendChild(fb);
      els.fillArea.appendChild(box);
    });
  }

  function renderConnectors(){
    const items=BANK[app.level].conn;
    els.connArea.innerHTML="";
    items.forEach((q,idx)=>{
      const box=document.createElement("div"); box.className="qItem";
      const p=document.createElement("p"); p.className="qPrompt"; p.innerHTML=`<b>Q${idx+1}.</b> ${escapeHTML(q.prompt)}`;
      const choices=document.createElement("div"); choices.className="choices";
      const fb=document.createElement("div"); fb.className="feedback"; fb.style.display="none";
      q.choices.forEach((c,i)=>{
        const b=document.createElement("button"); b.type="button"; b.className="choiceBtn"; b.textContent=c;
        b.addEventListener("click",()=>{
          if(box.dataset.done==="1") return;
          const ok=i===q.answer;
          box.dataset.done="1";
          Array.from(choices.querySelectorAll("button")).forEach(btn=>btn.disabled=true);
          fb.style.display="block"; fb.classList.remove("ok","bad"); fb.classList.add(ok?"ok":"bad");
          fb.innerHTML= ok ? `✅ <b>Correct.</b> ${escapeHTML(q.why)}` : `❌ <b>Best:</b> <b>${escapeHTML(q.choices[q.answer])}</b>. ${escapeHTML(q.why)}`;
          if(ok){setScore(1); setStreak(true);} else {setStreak(false);}
        });
        choices.appendChild(b);
      });
      box.appendChild(p); box.appendChild(choices); box.appendChild(fb);
      els.connArea.appendChild(box);
    });
  }

  function renderOrder(){
    const o=BANK[app.level].order;
    app.order.bank=shuffle(o.bank);
    app.order.user=[];
    app.order.answer=o.answer.slice();
    els.orderBank.innerHTML=""; els.orderUser.innerHTML="";
    els.orderFeedback.textContent="Tap items to move them, then check.";

    function mk(text){
      const d=document.createElement("div"); d.className="orderItem"; d.textContent=text; return d;
    }
    function draw(){
      els.orderBank.innerHTML=""; els.orderUser.innerHTML="";
      app.order.bank.forEach(t=>{
        const it=mk(t);
        it.addEventListener("click",()=>{ app.order.bank=app.order.bank.filter(x=>x!==t); app.order.user.push(t); draw(); });
        els.orderBank.appendChild(it);
      });
      app.order.user.forEach(t=>{
        const it=mk(t);
        it.addEventListener("click",()=>{ app.order.user=app.order.user.filter(x=>x!==t); app.order.bank.push(t); draw(); });
        els.orderUser.appendChild(it);
      });
    }
    els.checkOrderBtn.onclick=function(){
      if(app.order.user.length!==app.order.answer.length){ els.orderFeedback.innerHTML="⚠️ Move <b>all</b> items to “Your order” first."; return; }
      const ok=app.order.user.every((t,i)=>t===app.order.answer[i]);
      if(ok){ setScore(2); setStreak(true); els.orderFeedback.innerHTML="✅ <b>Perfect timeline.</b> Say it with “first / then / after that”."; }
      else { setStreak(false); els.orderFeedback.innerHTML="❌ Not yet. Tip: background → update → reaction."; }
    };
    draw();
  }

  // Builder
  function buildReport(){
    const story=NEWS.find(n=>n.id===els.bTopic.value)||NEWS[0];
    const angle=els.bAngle.value;
    const time=els.bTime.value;
    const tone=els.bTone.value;

    const toneLine = tone==="CAUTIOUS"
      ? "Some details may change as more information is verified."
      : tone==="HOPEFUL"
        ? "Many people hope the situation will stabilize soon."
        : "The focus is on facts and a clear timeline.";

    const timeLine = time==="NOW"
      ? (app.level==="A2" ? "Now: People follow updates, and markets react quickly."
        : app.level==="B1" ? "Now: Attention remains high, and reactions continue across media."
        : "Now: The situation remains fluid, and expectations shift with each update.")
      : time==="WHILE"
        ? (app.level==="A2" ? "While reporters were following the story, new details appeared."
          : app.level==="B1" ? "While analysts were discussing the situation, markets reacted to uncertainty."
          : "While commentators were analyzing implications, new information surfaced and altered expectations.")
        : (app.level==="A2" ? "Earlier: Officials shared new information and people reacted."
          : app.level==="B1" ? "Earlier: Authorities released updates, and the debate intensified."
          : "Earlier: A key announcement shifted the narrative and triggered renewed discussion.");

    const angleLine = angle==="IMPACT"
      ? "Impact: People worry about costs, stability, and daily life."
      : angle==="QUESTIONS"
        ? "Open questions: What happens next, and what remains unclear?"
        : "Timeline: First the update, then reactions, then ongoing discussion.";

    const vocab3 = shuffle(pickVocabHintsForStory(story.id)).slice(0,3).join(", ");

    const report =
`🗞️ ${story.title}
(${story.date} — ${story.region})

Summary: ${story.brief}

${timeLine}
${angleLine}
${toneLine}

Use these 3 words: ${vocab3}
Connector challenge: add “However / Meanwhile / As a result”.`;

    els.reportOut.textContent=report;
    return report;
  }

  function resetSection(which){
    if(which==="qcm") renderQCM();
    if(which==="fill") renderFill();
    if(which==="conn") renderConnectors();
    if(which==="order") renderOrder();
    if(which==="vmatch") renderVMatch();
    if(which==="cats") renderCategories();
  }
  function resetVocabAll(){
    els.vSearch.value="";
    els.vCategory.value="All";
    renderVocab(); renderVMatch(); renderCategories();
    els.vmFeedback.textContent="Tap a word, then its definition.";
    els.catsFeedback.textContent="Tap a word, then tap a category box (or drag).";
  }
  function resetAll(){
    app.score=0; app.streak=0;
    els.score.textContent="0"; els.streak.textContent="0";
    els.reportOut.textContent="";
    els.repOut.textContent="";
    els.repHint.textContent="Tap a news card to get 3 speaking prompts.";
    els.tcOut.textContent="";
    if(els.spinOut) els.spinOut.textContent="";
    if(els.longOut) els.longOut.textContent="";
    app.deep.spinText="";
    resetVocabAll();
    renderAll();
  }

  // events
  els.levelSelect.addEventListener("change",()=>{app.level=els.levelSelect.value; renderAll();});
  els.accentSelect.addEventListener("change",()=>{app.accent=els.accentSelect.value;});
  els.resetAllBtn.addEventListener("click", resetAll);

  Array.from(document.querySelectorAll("[data-reset]")).forEach(btn=>{
    btn.addEventListener("click",()=>resetSection(btn.getAttribute("data-reset")));
  });

  els.repReadBtn.addEventListener("click",()=>{const t=(els.repOut.textContent||"").trim(); if(t) speak(t);});
  els.repClearBtn.addEventListener("click",()=>{els.repOut.textContent=""; els.repHint.textContent="Tap a news card to get 3 speaking prompts.";});

  els.vCategory.addEventListener("change",()=>{renderVocab(); renderVMatch();});
  els.vSearch.addEventListener("input",()=>{renderVocab(); renderVMatch();});
  els.shuffleVocabBtn.addEventListener("click",()=>renderVocab());
  els.vocabQuizBtn.addEventListener("click", startVocabQuiz);
  els.vocabResetBtn.addEventListener("click", resetVocabAll);

  // Deep Dive (Section 6) events
  if(els.gFilter){ els.gFilter.addEventListener('change', ()=>{ renderGloss(); }); }
  if(els.gShuffleBtn){ els.gShuffleBtn.addEventListener('click', ()=>{ renderGloss(); }); }
  if(els.spinBtn){ els.spinBtn.addEventListener('click', ()=>{ spinScenario(); }); }
  if(els.spinReadBtn){ els.spinReadBtn.addEventListener('click', ()=>{ const t=((els.spinOut&&els.spinOut.textContent)||app.deep.spinText||'').trim(); if(t) speak(t); }); }
  if(els.spinCopyBtn){ els.spinCopyBtn.addEventListener('click', async ()=>{ const t=((els.spinOut&&els.spinOut.textContent)||'').trim(); if(!t) return; try{ await navigator.clipboard.writeText(t); els.spinCopyBtn.textContent='Copied ✅'; setTimeout(()=>els.spinCopyBtn.textContent='Copy',900);}catch(e){ els.spinCopyBtn.textContent='Copy failed'; setTimeout(()=>els.spinCopyBtn.textContent='Copy',900);} }); }
  if(els.longBuildBtn){ els.longBuildBtn.addEventListener('click', ()=>{ buildLongReport(); }); }
  if(els.longReadBtn){ els.longReadBtn.addEventListener('click', ()=>{ const t=((els.longOut&&els.longOut.textContent)||'').trim(); speak(t||buildLongReport()); }); }
  if(els.longCopyBtn){ els.longCopyBtn.addEventListener('click', async ()=>{ const t=((els.longOut&&els.longOut.textContent)||'').trim(); if(!t) return; try{ await navigator.clipboard.writeText(t); els.longCopyBtn.textContent='Copied ✅'; setTimeout(()=>els.longCopyBtn.textContent='Copy',900);}catch(e){ els.longCopyBtn.textContent='Copy failed'; setTimeout(()=>els.longCopyBtn.textContent='Copy',900);} }); }


  els.tenseCoachBtn.addEventListener("click",()=>{
    const h=els.tenseCoachBody.hidden;
    els.tenseCoachBody.hidden=!h;
    els.tenseCoachBtn.textContent=h?"Close Tense Coach ✨":"Open Tense Coach 🎮";
  });
  els.tcBuildBtn.addEventListener("click", buildTenseCoach);
  els.tcReadBtn.addEventListener("click",()=>{if(!els.tcOut.textContent.trim()) buildTenseCoach(); speak(els.tcOut.textContent);});
  els.tcResetBtn.addEventListener("click",()=>{els.tcTense.value="PRES"; els.tcConnector.value="However"; els.tcOut.textContent="";});

  els.buildBtn.addEventListener("click", buildReport);
  els.readBtn.addEventListener("click",()=>{const t=(els.reportOut.textContent||"").trim(); speak(t||buildReport());});
  els.copyBtn.addEventListener("click", async ()=>{
    const t=(els.reportOut.textContent||"").trim(); if(!t) return;
    try{ await navigator.clipboard.writeText(t); els.copyBtn.textContent="Copied ✅"; setTimeout(()=>els.copyBtn.textContent="Copy",900); }
    catch(e){ els.copyBtn.textContent="Copy failed"; setTimeout(()=>els.copyBtn.textContent="Copy",900); }
  });
  els.resetBuilderBtn.addEventListener("click",()=>{els.bAngle.value="FACTS"; els.bTime.value="PAST"; els.bTone.value="NEUTRAL"; els.reportOut.textContent="";});

  function renderAll(){
    renderNews();
    renderVCategory();
    renderVocab();
    renderVMatch();
    renderCategories();
    renderTopicsInto(els.bTopic);
    renderTopicsInto(els.tcTopic);
    renderQCM();
    renderFill();
    renderConnectors();
    renderOrder();
    // Deep Dive (Section 6)
    renderGlossFilter();
    renderGloss();
    renderTrans();
    if(els.lTopic){ renderTopicsInto(els.lTopic); }

  }

  if(window.speechSynthesis){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  renderAll();
})();
