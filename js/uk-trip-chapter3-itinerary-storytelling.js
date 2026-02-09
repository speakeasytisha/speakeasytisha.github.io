/* SpeakEasyTisha — UK Trip Chapter 3: Itinerary Storytelling
   Past simple vs present perfect, past continuous, connectors, travel reviews, speaking vlog tasks.
   Touch-friendly, instant feedback, hints, score, US/UK speech.
*/
(function(){
  "use strict";

  /* -------------------- Helpers -------------------- */
  function $(id){ return document.getElementById(id); }
  function q(sel, root){ return (root||document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c]; }); }
  function norm(s){ return String(s||"").trim().toLowerCase().replace(/\s+/g," "); }
  function shuffle(arr){
    var a = arr.slice();
    for (var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  /* -------------------- Speech (US/UK) -------------------- */
  var voiceCache = [];
  function loadVoices(){
    voiceCache = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis){
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice(accent){
    if (!voiceCache || !voiceCache.length) return null;
    var prefer = (accent === "uk")
      ? ["en-gb","british","united kingdom"]
      : ["en-us","american","united states"];
    for (var i=0;i<prefer.length;i++){
      var p = prefer[i];
      var found = voiceCache.find(function(v){
        var name = (v.name||"").toLowerCase();
        var lang = (v.lang||"").toLowerCase();
        return lang.indexOf(p) !== -1 || name.indexOf(p) !== -1;
      });
      if (found) return found;
    }
    var en = voiceCache.find(function(v){ return String(v.lang||"").toLowerCase().indexOf("en") === 0; });
    return en || voiceCache[0] || null;
  }

  function speak(text){
    if (!window.speechSynthesis) return;
    try{ speechSynthesis.cancel(); }catch(e){}
    var u = new SpeechSynthesisUtterance(String(text||""));
    var accent = ($("accentSelect") && $("accentSelect").value) || "us";
    var v = pickVoice(accent);
    if (v) u.voice = v;
    u.rate = 0.95;
    u.pitch = 1.0;
    speechSynthesis.speak(u);
  }

  /* -------------------- State -------------------- */
  var state = { score:0, max:0, streak:0, solved:{}, hint:null };
  var activityIndex = {}; // id -> {root,type}

  /* -------------------- Hint toast (so hints are visible anywhere) -------------------- */
  function ensureHintToast(){
    var t = $("hintToast");
    if (t) return t;
    t = document.createElement("div");
    t.id = "hintToast";
    t.className = "hintToast";
    t.innerHTML =
      "<div class='hintToast__row'>"
      + "<div class='hintToast__title'>Hint</div>"
      + "<button type='button' class='hintToast__close' aria-label='Close hint'>✕</button>"
      + "</div>"
      + "<div class='hintToast__body' id='hintToastBody'></div>";
    document.body.appendChild(t);
    q(".hintToast__close", t).addEventListener("click", function(){
      t.classList.remove("is-show");
    });
    return t;
  }

  var toastTimer = null;
  function showToastHint(text){
    var t = ensureHintToast();
    var b = $("hintToastBody");
    if (b) b.textContent = String(text||"");
    t.classList.add("is-show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){
      try{ t.classList.remove("is-show"); }catch(e){}
    }, 10000);
  }


  function setHint(text){
    state.hint = text || null;

    var box = $("globalHint");
    var body = $("globalHintBody");

    if (box && body){
      if (!state.hint){
        box.hidden = true;
        body.textContent = "";
      }else{
        body.textContent = state.hint;
        box.hidden = false;
      }
    }

    if (state.hint){
      showToastHint(state.hint);
    }else{
      var t = $("hintToast");
      if (t) t.classList.remove("is-show");
    }

    save();
  }

  function updateProgress(){
    var total = Object.keys(activityIndex).length || 1;
    var done = Object.keys(state.solved).length;
    var pct = Math.round((done/total)*100);
    $("progressPct").textContent = pct + "%";
    $("progressBar").style.width = pct + "%";
  }

  function updateStats(){
    $("scoreNow").textContent = String(state.score);
    $("scoreMax").textContent = String(state.max);
    $("streakNow").textContent = String(state.streak);
    updateProgress();
  }

  function save(){
    try{ localStorage.setItem("SET_ukChapter3Story_v1", JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem("SET_ukChapter3Story_v1");
      if (!raw) return;
      var s = JSON.parse(raw);
      if (s && typeof s === "object"){
        state.score = s.score||0;
        state.max = s.max||0;
        state.streak = s.streak||0;
        state.solved = s.solved||{};
        state.hint = s.hint||null;
      }
    }catch(e){}
  }

  function markSolved(id){
    if (!state.solved[id]) state.solved[id] = true;
    save();
    updateProgress();
  }

  function addScore(ok){
    state.max += 1;
    if (ok){ state.score += 1; state.streak += 1; }
    else { state.streak = 0; }
    save();
    updateStats();
  }

  function feedbackEl(ok, msg, why){
    var div = document.createElement("div");
    div.className = "feedback " + (ok ? "good" : "bad");
    div.innerHTML = "<div><strong>" + (ok ? "✅ Correct" : "❌ Not quite") + "</strong> — " + esc(msg) + "</div>"
      + (why ? "<div class='why'>" + esc(why) + "</div>" : "");
    return div;
  }
  function clearFeedback(root){
    qa(".feedback", root).forEach(function(el){ el.remove(); });
  }

  /* MCQ (options array OR separate strings a/b/c/d) */
  function mcq(root, cfg){
    activityIndex[cfg.id] = {root:root, type:"mcq"};
    var options = cfg.options || [];
    if (!options.length && cfg.a) options = [cfg.a,cfg.b,cfg.c,cfg.d].filter(Boolean);

    var box = document.createElement("div");
    box.className = "qBody";
    box.innerHTML =
      "<div class='qTop'><div>"
      + "<div class='qTitle'>" + esc(cfg.title||"") + "</div>"
      + (cfg.sub ? "<div class='qSub'>" + esc(cfg.sub) + "</div>" : "")
      + (cfg.prompt ? "<div class='big'>" + esc(cfg.prompt) + "</div>" : "")
      + "</div></div>";

    var list = document.createElement("div");
    list.className = "choices";
    var chosen = null;

    options.forEach(function(opt, idx){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choiceBtn";
      b.textContent = opt;
      b.addEventListener("click", function(){
        if (chosen !== null) return;
        chosen = idx;
        clearFeedback(box);
        qa(".choiceBtn", list).forEach(function(x){ x.disabled = true; });
        var ok = (idx === cfg.answerIndex);
        b.classList.add(ok ? "is-correct" : "is-wrong");
        if (!ok && list.children[cfg.answerIndex]) list.children[cfg.answerIndex].classList.add("is-correct");
        addScore(ok);
        markSolved(cfg.id);
        box.appendChild(feedbackEl(ok, ok ? "Good choice." : "Check the meaning.", cfg.why||""));
      });
      list.appendChild(b);
    });

    var actions = document.createElement("div");
    actions.className = "row";
    var hintBtn = document.createElement("button");
    hintBtn.type="button"; hintBtn.className="btn btn--ghost"; hintBtn.textContent="💡 Hint";
    hintBtn.addEventListener("click", function(){
      setHint(cfg.hint || "Enjoyment → like + -ing. Habit/preference → like + to + verb. Polite request → I'd like to + verb.");
    });
    var retryBtn = document.createElement("button");
    retryBtn.type="button"; retryBtn.className="btn btn--ghost"; retryBtn.textContent="↻ Try again";
    retryBtn.addEventListener("click", function(){ renderAll(); setHint(null); });
    actions.appendChild(hintBtn);
    actions.appendChild(retryBtn);

    box.appendChild(list);
    box.appendChild(actions);

    root.innerHTML = "";
    root.appendChild(box);
  }

  function fix(root, cfg){
    activityIndex[cfg.id] = {root:root, type:"fix"};

    var box = document.createElement("div");
    box.className = "qBody";
    box.innerHTML =
      "<div class='qTop'><div>"
      + "<div class='qTitle'>" + esc(cfg.title||"Fix") + "</div>"
      + "<div class='qSub'>Rewrite it correctly.</div>"
      + "</div></div>";

    var wrong = document.createElement("div");
    wrong.className = "ex";
    wrong.innerHTML = "❌ " + esc(cfg.wrong);
    box.appendChild(wrong);

    var row = document.createElement("div");
    row.className = "row";
    var inp = document.createElement("input");
    inp.className = "input";
    inp.placeholder = "Type the correct sentence…";

    var bCheck = document.createElement("button");
    bCheck.type="button"; bCheck.className="btn"; bCheck.textContent="Check";

    var bHint = document.createElement("button");
    bHint.type="button"; bHint.className="btn btn--ghost"; bHint.textContent="💡 Hint";

    var bReveal = document.createElement("button");
    bReveal.type="button"; bReveal.className="btn btn--ghost"; bReveal.textContent="👀 Reveal";

    row.appendChild(inp);
    row.appendChild(bCheck);
    row.appendChild(bHint);
    row.appendChild(bReveal);
    box.appendChild(row);

    function okVal(val){
      var v = norm(val).replace(/[.!?]/g,"");
      var a = norm(cfg.answer).replace(/[.!?]/g,"");
      return v === a;
    }

    bHint.addEventListener("click", function(){ setHint(cfg.hint || "Choose: like + -ing OR like + to + verb."); });
    bReveal.addEventListener("click", function(){ inp.value = cfg.answer; speak(cfg.answer); });

    bCheck.addEventListener("click", function(){
      clearFeedback(box);
      var ok = okVal(inp.value);
      addScore(ok);
      markSolved(cfg.id);
      box.appendChild(feedbackEl(ok, ok ? "Perfect." : "Compare carefully.", cfg.why || ("Correct: " + cfg.answer)));
      if (ok) inp.disabled = true;
    });

    root.innerHTML = "";
    root.appendChild(box);
  }

  function builder(root, cfg){
    activityIndex[cfg.id] = {root:root, type:"builder"};

    var wrap = document.createElement("div");
    wrap.innerHTML = "<div class='qTitle'>" + esc(cfg.title) + "</div>" + (cfg.sub ? "<div class='qSub'>" + esc(cfg.sub) + "</div>" : "");

    var built = document.createElement("div");
    built.className = "built";
    built.textContent = "";

    var bank = document.createElement("div");
    bank.className = "bank";

    var used = [];
    function rebuild(){ built.textContent = used.join(" ").replace(/\s+([,.!?;:])/g, "$1"); }

    cfg.bank.forEach(function(word){
      var c = document.createElement("button");
      c.type="button"; c.className="chip"; c.textContent = word;
      c.addEventListener("click", function(){
        if (c.classList.contains("is-used")) return;
        c.classList.add("is-used");
        used.push(word);
        rebuild();
      });
      bank.appendChild(c);
    });

    var row = document.createElement("div");
    row.className = "row";

    var bUndo = document.createElement("button");
    bUndo.type="button"; bUndo.className="btn btn--ghost"; bUndo.textContent="← Undo";
    bUndo.addEventListener("click", function(){
      if (!used.length) return;
      var last = used.pop();
      qa(".chip", bank).forEach(function(ch){ if (ch.textContent === last) ch.classList.remove("is-used"); });
      rebuild();
    });

    var bClear = document.createElement("button");
    bClear.type="button"; bClear.className="btn btn--ghost"; bClear.textContent="🧹 Clear";
    bClear.addEventListener("click", function(){
      used = [];
      qa(".chip", bank).forEach(function(ch){ ch.classList.remove("is-used"); });
      rebuild();
      clearFeedback(wrap);
    });

    var bHint = document.createElement("button");
    bHint.type="button"; bHint.className="btn btn--ghost"; bHint.textContent="💡 Hint";
    bHint.addEventListener("click", function(){ setHint(cfg.hint || "Start with subject, then like, then -ing/to + verb."); });

    var bCheck = document.createElement("button");
    bCheck.type="button"; bCheck.className="btn"; bCheck.textContent="Check";
    bCheck.addEventListener("click", function(){
      clearFeedback(wrap);
      var attempt = norm(built.textContent).replace(/[.!?]/g,"");
      var answer = norm(cfg.answer).replace(/[.!?]/g,"");
      var ok = attempt === answer;
      addScore(ok);
      markSolved(cfg.id);
      wrap.appendChild(feedbackEl(ok, ok ? "Great." : "Reorder the words.", cfg.why || ("Answer: " + cfg.answer)));
      if (ok) speak(cfg.answer);
    });

    row.appendChild(bUndo);
    row.appendChild(bClear);
    row.appendChild(bHint);
    row.appendChild(bCheck);

    wrap.appendChild(built);
    wrap.appendChild(bank);
    wrap.appendChild(row);

    root.innerHTML = "";
    root.appendChild(wrap);
  }

  
  /* -------------------- Content -------------------- */

  // Chapter 3: Itinerary storytelling — narrate your UK trip day by day.
  // Focus: past simple vs present perfect, narrative connectors, reviews, and spoken “travel vlog”.

  var starter = {
    id:"starter_c3_1",
    title:"Warm-up: choose the right tense",
    sub:"You are telling a friend about your UK trip.",
    prompt:"Choose the best sentence:",
    options:[
      "We visited Edinburgh last summer and loved it.",
      "We have visited Edinburgh last summer."
    ],
    answerIndex: 0,
    hint:"Past + finished time (last summer / yesterday / in 2024) → Past simple.",
    why:"Use past simple with a finished time expression."
  };

  var rulesQuick = [
    {
      id:"rules_c3_1",
      title:"Past simple vs present perfect",
      sub:"Finished time vs life experience",
      prompt:"Choose the best sentence:",
      options:[
        "Have you ever tried afternoon tea?",
        "Did you ever try afternoon tea?"
      ],
      answerIndex: 0,
      hint:"Experience (no time) → present perfect.",
      why:"“Have you ever…?” is the standard experience question."
    },
    {
      id:"rules_c3_2",
      title:"Time words",
      sub:"Already / yet / just",
      prompt:"Choose the best sentence:",
      options:[
        "We’ve just arrived at the hotel.",
        "We just arrived at the hotel. (UK formal)"
      ],
      answerIndex: 0,
      hint:"UK-style: present perfect is common with just/already/yet for recent actions.",
      why:"Both can be heard, but present perfect is the classic choice in UK English."
    },
    {
      id:"rules_c3_3",
      title:"Story connectors",
      sub:"Make your story flow",
      prompt:"Choose the best connector:",
      options:[
        "After that, we took the train to York.",
        "After, we took the train to York."
      ],
      answerIndex: 0,
      hint:"After that / then / later on = natural narrative transitions.",
      why:"✅ After that is natural."
    },
    {
      id:"rules_c3_4",
      title:"Past continuous (background)",
      sub:"What was happening?",
      prompt:"Choose the best sentence:",
      options:[
        "While we were walking, it started to rain.",
        "While we walked, it started to rain."
      ],
      answerIndex: 0,
      hint:"Past continuous = background action; past simple = event.",
      why:"✅ While we were walking (background), it started to rain (event)."
    }
  ];

  var meaningQuiz = [
    {
      id:"mean_c3_1",
      title:"Narration verb",
      sub:"Choose the best verb",
      prompt:"We ___ into the hotel and left our bags.",
      options:["checked", "dropped"],
      answerIndex: 0,
      hint:"Check in = arrive at hotel and register.",
      why:"✅ We checked into the hotel."
    },
    {
      id:"mean_c3_2",
      title:"Review language",
      sub:"Strong but natural adjectives",
      prompt:"The view was ___ (very impressive).",
      options:["stunning", "stunned"],
      answerIndex: 0,
      hint:"Stunning = impressive; stunned = shocked (person).",
      why:"✅ stunning"
    },
    {
      id:"mean_c3_3",
      title:"Linking words",
      sub:"Cause → result",
      prompt:"It was crowded, ___ we left early.",
      options:["so", "although"],
      answerIndex: 0,
      hint:"so = result; although = contrast.",
      why:"✅ so"
    },
    {
      id:"mean_c3_4",
      title:"Transport",
      sub:"UK word",
      prompt:"On a train, ‘carriage’ means:",
      options:["train car", "station"],
      answerIndex: 0,
      hint:"Carriage = train car (UK).",
      why:"✅ train car"
    },
    {
      id:"mean_c3_5",
      title:"Preference",
      sub:"Would rather",
      prompt:"Choose the best sentence:",
      options:[
        "I’d rather stay in York than in London for two nights.",
        "I rather stay in York that in London for two nights."
      ],
      answerIndex: 0,
      hint:"I’d rather + base verb + than.",
      why:"✅ I’d rather… than…"
    }
  ];

  var errorFixItems = [
    {
      id:"err_c3_1",
      title:"Finished time",
      wrong:"We have gone to Bath yesterday.",
      answer:"We went to Bath yesterday.",
      hint:"Yesterday = finished time → past simple.",
      why:"Use past simple with yesterday/last week/in 2023."
    },
    {
      id:"err_c3_2",
      title:"Experience",
      wrong:"Did you ever visit the Lake District?",
      answer:"Have you ever visited the Lake District?",
      hint:"Ever (experience) → present perfect.",
      why:"Use present perfect for life experience."
    },
    {
      id:"err_c3_3",
      title:"Past continuous",
      wrong:"While we walked, the weather changed suddenly.",
      answer:"While we were walking, the weather changed suddenly.",
      hint:"While + past continuous = background action.",
      why:"Past continuous sets the scene."
    },
    {
      id:"err_c3_4",
      title:"Review collocation",
      wrong:"The hotel was very conveniently.",
      answer:"The hotel was very convenient.",
      hint:"Convenient = adjective. Conveniently = adverb.",
      why:"Use adjective after ‘was’."
    },
    {
      id:"err_c3_5",
      title:"Sequencing",
      wrong:"After we visited the castle, after we ate.",
      answer:"After we visited the castle, we ate. / Then we ate.",
      hint:"Avoid repeating after; use then/after that.",
      why:"Cleaner narrative flow."
    }
  ];

  var practiceA = [
    {
      id:"pA_c3_1",
      title:"Day 1 (choose tense)",
      sub:"You mention a finished time",
      prompt:"Choose the best sentence:",
      options:[
        "On Friday, we arrived in London and checked in.",
        "On Friday, we have arrived in London and checked in."
      ],
      answerIndex: 0,
      hint:"Finished time (On Friday) → past simple.",
      why:"✅ past simple"
    },
    {
      id:"pA_c3_2",
      title:"Day 2 (recent action)",
      sub:"Just/already/yet",
      prompt:"You are at the hotel now:",
      options:[
        "We’ve just arrived, so we’re going to rest.",
        "We arrived just, so we’re going to rest."
      ],
      answerIndex: 0,
      hint:"Present perfect + just is natural.",
      why:"✅ We’ve just arrived…"
    },
    {
      id:"pA_c3_3",
      title:"Background vs event",
      sub:"Past continuous + past simple",
      prompt:"Choose the best sentence:",
      options:[
        "We were walking along the river when it started raining.",
        "We walked along the river when it started raining."
      ],
      answerIndex: 0,
      hint:"Background action → was/were + -ing.",
      why:"✅ were walking… when it started…"
    },
    {
      id:"pA_c3_4",
      title:"Connector",
      sub:"Contrast",
      prompt:"Choose the best connector:",
      options:[
        "Although it was crowded, we enjoyed it.",
        "So it was crowded, we enjoyed it."
      ],
      answerIndex: 0,
      hint:"Although = contrast; so = result.",
      why:"✅ Although…"
    },
    {
      id:"pA_c3_5",
      title:"Review sentence",
      sub:"Natural travel review language",
      prompt:"Choose the best sentence:",
      options:[
        "The hotel was great value for money and very convenient.",
        "The hotel was very conveniently and good price."
      ],
      answerIndex: 0,
      hint:"Great value for money = common collocation.",
      why:"✅ natural collocation + correct adjective."
    },
    {
      id:"pA_c3_6",
      title:"Mini recap",
      sub:"Present perfect (experience)",
      prompt:"Choose the best question:",
      options:[
        "Have you ever been to Wales?",
        "Did you ever go to Wales?"
      ],
      answerIndex: 0,
      hint:"Ever → present perfect.",
      why:"✅ Have you ever…?"
    }
  ];

  var builderA = {
    id:"build_c3_1",
    title:"Build a travel vlog sentence",
    sub:"Tap to build a natural story sentence.",
    bank: shuffle(["First",",","we","checked","in","and","dropped","our","bags",".","Then",",","we","walked","to","the","river","."]),
    answer:"First, we checked in and dropped our bags. Then, we walked to the river.",
    hint:"Sequence: First… Then… Later… After that…",
    why:"Clear timeline = easy to understand."
  };

  var transformA = {
    id:"trans_c3_1",
    title:"Transform: basic → rich story",
    sub:"Choose the stronger ‘storytelling’ version.",
    prompt:"Choose the best option:",
    options:[
      "We went to the museum. It was nice.",
      "We visited the museum, and the exhibition was fascinating, so we stayed longer than planned."
    ],
    answerIndex: 1,
    hint:"Add detail + adjective + connector (so/although).",
    why:"Rich details make the story engaging."
  };

  var extrasAcc = [
    {
      title:"Storytelling connectors (mini toolkit)",
      body:[
        "<strong>First / Then / After that / Later on</strong> (sequence)",
        "<strong>While / When</strong> (background + event)",
        "<strong>Because / so / therefore</strong> (reason/result)",
        "<strong>Although / however</strong> (contrast)",
        "<strong>Overall / in the end</strong> (conclusion)"
      ]
    },
    {
      title:"Past simple vs present perfect (quick rules)",
      body:[
        "<strong>Past simple</strong>: finished time → yesterday, last week, in 2023, on Monday.",
        "<strong>Present perfect</strong>: life experience or recent results → ever, never, just, already, yet.",
        "UK flavour: present perfect is very common with <strong>just/already/yet</strong>."
      ]
    },
    {
      title:"Travel review adjectives (useful)",
      body:[
        "<strong>stunning</strong> (amazing view) • <strong>cozy</strong> (warm/comfortable) • <strong>lively</strong> (full of life)",
        "<strong>overrated</strong> (not as good as expected) • <strong>crowded</strong> • <strong>good value for money</strong>",
        "<strong>walkable</strong> (easy to walk) • <strong>convenient</strong> (easy/close)"
      ]
    },
    {
      title:"⭐ Next tenses roadmap (for future lessons)",
      body:[
        "<strong>Future plans</strong>: going to / will / present continuous (arrangements)",
        "<strong>Past continuous</strong>: background actions (we were walking…)",
        "<strong>Present perfect continuous</strong>: duration until now (we’ve been waiting for…)",
        "<strong>Conditionals</strong>: if + (real/possible/imaginary) outcomes",
        "<strong>Passive voice</strong>: it was built / it is included",
        "<strong>Reported speech</strong>: he said that…"
      ]
    }
  ];

  var extrasQuiz = [
    {
      id:"exq_c3_1",
      title:"Finished time",
      sub:"Choose the correct sentence.",
      prompt:"Pick the correct option:",
      options:[
        "We went to York last weekend.",
        "We have gone to York last weekend."
      ],
      answerIndex: 0,
      hint:"Last weekend = finished time → past simple.",
      why:"✅ past simple"
    },
    {
      id:"exq_c3_2",
      title:"Recent action",
      sub:"Choose the correct sentence.",
      prompt:"Pick the correct option:",
      options:[
        "We’ve just checked in.",
        "We just have checked in."
      ],
      answerIndex: 0,
      hint:"Have + just + past participle.",
      why:"✅ We’ve just checked in."
    }
  ];

  var speakPrompts = [
    {
      title:"Travel vlog (Day 1)",
      prompt:"Speak for 20–30 seconds: arrival + first impressions.",
      model:"On Friday, we arrived in London and checked into our hotel. It was busy, but the atmosphere was exciting, so we went for a quick walk and grabbed dinner."
    },
    {
      title:"Experience question",
      prompt:"Ask your partner 2 questions about experience (ever/never).",
      model:"Have you ever tried afternoon tea? Have you ever been to Scotland?"
    },
    {
      title:"Background + event",
      prompt:"Use past continuous + past simple.",
      model:"We were walking along the river when it started to rain, so we found a cosy café."
    },
    {
      title:"Mini review (hotel)",
      prompt:"Give a 3-sentence review with pros/cons.",
      model:"The hotel was great value for money and very convenient. The room was cozy, although the walls were a bit thin. Overall, we’d stay there again."
    },
    {
      title:"Tourist trap vs hidden gem",
      prompt:"Compare 1 crowded place and 1 calm place.",
      model:"The main drawback of the hotspot was that it was extremely crowded. However, the quiet neighbourhood nearby was walkable and felt more authentic."
    },
    {
      title:"Final story (3 days)",
      prompt:"Tell the full trip story (60–90 seconds).",
      model:"First, we spent two days in London: museums, food markets, and a show. Then we took the train to York, which was smaller and calmer. While we were exploring the old streets, it started to rain, so we visited a cosy tea room. In the end, we preferred York because it felt more relaxing."
    }
  ];

  var finalQuiz = [
    {
      id:"final_c3_1",
      title:"Tense check",
      sub:"Choose the correct option.",
      prompt:"Have you ever ___ to Wales?",
      options:["been", "went"],
      answerIndex: 0,
      hint:"Ever → present perfect: have been.",
      why:"✅ been"
    },
    {
      id:"final_c3_2",
      title:"Story skill",
      sub:"Choose the best sentence.",
      prompt:"Pick the best narrative sentence:",
      options:[
        "After that, we visited the castle, and then we had dinner.",
        "After, we visited castle, then dinner."
      ],
      answerIndex: 0,
      hint:"Use full grammar + connectors.",
      why:"✅ complete and natural"
    },
    {
      id:"final_c3_3",
      title:"Past continuous",
      sub:"Choose the best sentence.",
      prompt:"Pick the best option:",
      options:[
        "We were waiting when the train arrived.",
        "We waited when the train arrived."
      ],
      answerIndex: 0,
      hint:"Background action → were + -ing.",
      why:"✅ were waiting… when…"
    }
  ];


  /* -------------------- Render -------------------- */
  function renderAll(){
    activityIndex = {};

    mcq($("starterQuiz"), starter);

    var r = $("rulesQuick"); r.innerHTML = "";
    rulesQuick.forEach(function(cfg){ var box=document.createElement("div"); box.className="quizBox"; r.appendChild(box); mcq(box,cfg); });

    var m = $("meaningQuiz"); m.innerHTML = "";
    meaningQuiz.forEach(function(cfg){ var box=document.createElement("div"); box.className="quizBox"; m.appendChild(box); mcq(box,cfg); });

    var e = $("errorFix"); e.innerHTML = "";
    errorFixItems.forEach(function(cfg){ var box=document.createElement("div"); box.className="quizBox"; e.appendChild(box); fix(box,cfg); });

    var p = $("practiceAQuiz"); p.innerHTML = "";
    practiceA.forEach(function(cfg){ var box=document.createElement("div"); box.className="quizBox"; p.appendChild(box); mcq(box,cfg); });

    builder($("builderA"), builderA);
    mcq($("transformA"), transformA);

    // accordion
    var acc = $("extrasAcc"); acc.innerHTML = "";
    extrasAcc.forEach(function(item){
      var d=document.createElement("details");
      d.className="accordionItem";
      var s=document.createElement("summary"); s.textContent=item.title;
      d.appendChild(s);
      var b=document.createElement("div");
      b.innerHTML = item.body.map(function(line){ return "<p>"+line+"</p>"; }).join("");
      d.appendChild(b);
      acc.appendChild(d);
    });

    var exq = $("extrasQuiz"); exq.innerHTML = "";
    extrasQuiz.forEach(function(cfg){ var box=document.createElement("div"); box.className="quizBox"; exq.appendChild(box); mcq(box,cfg); });

    // speak grid
    var sg = $("speakGrid"); sg.innerHTML = "";
    speakPrompts.forEach(function(p){
      var c=document.createElement("div"); c.className="speakCard";
      c.innerHTML = "<h3>"+esc(p.title)+"</h3><p><strong>Prompt:</strong> "+esc(p.prompt)+"</p>";
      var a=document.createElement("div"); a.className="speakActions";
      var b1=document.createElement("button"); b1.type="button"; b1.className="btn btn--ghost"; b1.textContent="🔊 Model answer";
      b1.addEventListener("click", function(){ speak(p.model); });
      var model = document.createElement("div");
      model.className = "modelText";
      model.hidden = true;
      model.textContent = p.model;

      var b2=document.createElement("button"); b2.type="button"; b2.className="btn"; b2.textContent="Show text";
      b2.addEventListener("click", function(){
        var isHidden = !!model.hidden;
        model.hidden = !isHidden;
        b2.textContent = isHidden ? "Hide text" : "Show text";
        if (isHidden){
          setHint(p.model);
          try{ model.scrollIntoView({behavior:"smooth", block:"nearest"}); }catch(e){ model.scrollIntoView(); }
        }
      });
      a.appendChild(b1); a.appendChild(b2);
      c.appendChild(a);
      c.appendChild(model);
      sg.appendChild(c);
    });

    var f = $("finalQuiz"); f.innerHTML = "";
    finalQuiz.forEach(function(cfg){ var box=document.createElement("div"); box.className="quizBox"; f.appendChild(box); mcq(box,cfg); });

    // static speak buttons
    qa(".js-say").forEach(function(btn){
      btn.addEventListener("click", function(){
        var t = btn.getAttribute("data-say") || "";
        if (t) speak(t);
      });
    });

    updateProgress();
  }

  /* -------------------- Navigation + Buttons -------------------- */
  function safeScrollTo(el){
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 120;
    y = Math.max(0, y);
    try{ window.scrollTo({ top:y, behavior:"smooth" }); }
    catch(e){ window.scrollTo(0, y); }
  }

  function setActiveTab(targetId){
    qa(".tab").forEach(function(a){
      a.classList.toggle("is-active", a.getAttribute("data-jump") === targetId);
    });
  }

  function jumpTo(id){
    var el = $(id);
    if (!el) return;
    setActiveTab(id);
    safeScrollTo(el);
  }

  function bindTabs(){
    qa(".tab").forEach(function(a){
      a.addEventListener("click", function(ev){
        ev.preventDefault();
        var id = a.getAttribute("data-jump");
        if (id) jumpTo(id);
      });
    });
  }

  function resetAll(){
    state.score=0; state.max=0; state.streak=0; state.solved={}; setHint(null);
    save();
    renderAll();
    updateStats();
    jumpTo("start");
  }

  function bindGlobalButtons(){
    $("btnShowHint").addEventListener("click", function(){
      setHint("Chapter 3 hint: Past simple (finished time) vs present perfect (experience/recent: ever/just/already/yet) • Past continuous (background) + past simple (event) • Story connectors: first/then/after that/although/so/in the end.");
    });
    $("btnSpeakSelection").addEventListener("click", function(){
      var sel = "";
      try{ sel = window.getSelection ? String(window.getSelection()) : ""; }catch(e){ sel=""; }
      sel = (sel||"").trim();
      if (!sel) return setHint("Select some text first, then tap “Speak selection”.");
      speak(sel);
    });
    $("btnReset").addEventListener("click", resetAll);
    $("btnPrint").addEventListener("click", function(){ window.print(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") setHint(null); });
  }

  function init(){
    load();
    bindTabs();
    bindGlobalButtons();
    if (state.hint) setHint(state.hint);
    renderAll();
    updateStats();
    if (location.hash){
      var id = location.hash.replace("#","");
      if ($(id)) jumpTo(id);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
