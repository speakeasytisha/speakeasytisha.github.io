/* SpeakEasyTisha — I like to do vs I like doing
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
    try{ localStorage.setItem("SET_likeLesson_v1", JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem("SET_likeLesson_v1");
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
  var starter = {
    id:"starter_1",
    title:"Warm-up",
    sub:"Which sentence sounds more like a healthy routine (not just pleasure)?",
    prompt:"Choose A or B (think: habit / preference).",
    options:[
      "A) I like to go to bed early.",
      "B) I like going to bed early."
    ],
    answerIndex: 0,
    hint:"If it’s a routine or a ‘good idea’, to + verb is common.",
    why:"Both can be correct. “I like to go…” often suggests a routine/preference. “I like going…” focuses more on enjoyment."
  };

  var rulesQuick = [
    {
      id:"rules_1",
      title:"Quick check 1",
      sub:"Choose the correct sentence.",
      prompt:"Polite request at a café:",
      options:[
        "I like ordering a coffee, please.",
        "I’d like to order a coffee, please."
      ],
      answerIndex: 1,
      hint:"Would like = polite desire → to + verb.",
      why:"“I’d like to…” is the polite form for requests (now/soon)."
    },
    {
      id:"rules_2",
      title:"Quick check 2",
      sub:"Choose the best sentence.",
      prompt:"Meaning: I enjoy it.",
      options:[
        "I like to dancing.",
        "I like dancing."
      ],
      answerIndex: 1,
      hint:"After like: -ing OR to + verb. Never “to + -ing”.",
      why:"Correct structure is “like + -ing” or “like + to + verb”."
    }
  ];

  var meaningQuiz = [
    {
      id:"mean_1",
      title:"Situation 1",
      sub:"You do it because it’s healthy.",
      prompt:"Choose the most natural:",
      options:["I like to walk after dinner.","I like walking after dinner."],
      answerIndex: 0,
      hint:"Healthy habit → to + verb is common.",
      why:"“Like to walk” suggests a routine/good habit. “Like walking” is possible but more pleasure-focused."
    },
    {
      id:"mean_2",
      title:"Situation 2",
      sub:"You love the activity. It’s fun.",
      prompt:"Choose the most natural:",
      options:["I like to swim in the ocean.","I like swimming in the ocean."],
      answerIndex: 1,
      hint:"Enjoyment → -ing.",
      why:"“Like swimming” emphasizes enjoyment."
    },
    {
      id:"mean_3",
      title:"Situation 3",
      sub:"You prefer a strategy / method.",
      prompt:"Choose the most natural:",
      options:["I like to plan my week on Sunday.","I like planning my week on Sunday."],
      answerIndex: 0,
      hint:"Planning = strategy/routine.",
      why:"“Like to plan” sounds like a personal system."
    },
    {
      id:"mean_4",
      title:"Situation 4",
      sub:"You are describing your hobbies.",
      prompt:"Choose the most natural:",
      options:["I like to painting and drawing.","I like painting and drawing."],
      answerIndex: 1,
      hint:"Hobbies → -ing.",
      why:"Use -ing for hobbies/enjoyment."
    }
  ];

  var errorFixItems = [
    { id:"err_1", title:"Error 1", wrong:"I like to doing yoga.", answer:"I like doing yoga.", hint:"Remove ‘to’. Keep -ing.", why:"After like: -ing OR to + verb (not both)." },
    { id:"err_2", title:"Error 2", wrong:"I would like going to the meeting.", answer:"I’d like to go to the meeting.", hint:"Would like → to + verb.", why:"“Would like” means polite desire." },
    { id:"err_3", title:"Error 3", wrong:"I enjoy to cook.", answer:"I enjoy cooking.", hint:"Enjoy → -ing.", why:"“Enjoy” is followed by -ing." },
    { id:"err_4", title:"Error 4", wrong:"I like do sport on weekends.", answer:"I like to do sports on weekends.", hint:"Add ‘to’ + verb.", why:"Correct: like to do / like doing." }
  ];

  var practiceA = [
    { id:"pA_1", title:"Everyday English", sub:"You do it because it’s a good habit/standard.", prompt:"At work:", options:["I like answering emails quickly.","I like to answer emails quickly."], answerIndex: 1, hint:"Routine/standard → to + verb.", why:"This sounds like a work habit." },
    { id:"pA_2", title:"Hobby", sub:"You really enjoy it.", prompt:"Weekend activity:", options:["I like hiking in the forest.","I like to hike in the forest."], answerIndex: 0, hint:"Hobby → -ing.", why:"-ing is natural for hobbies." },
    { id:"pA_3", title:"Preference", sub:"You do it for a reason (prices).", prompt:"Travel planning:", options:["I like to book early to get better prices.","I like booking early to get better prices."], answerIndex: 0, hint:"Reasons → to + verb.", why:"This sounds like strategy + reason." },
    { id:"pA_4", title:"Enjoyment", sub:"It’s relaxing.", prompt:"After work:", options:["I like listening to music.","I like to listen to music."], answerIndex: 0, hint:"Pleasure → -ing.", why:"Enjoyment-focused." }
  ];

  var builderA = {
    id:"build_1",
    title:"Build the sentence",
    sub:"Meaning: enjoyment (hobby).",
    bank: shuffle(["I","like","cooking","Italian","food","."]),
    answer:"I like cooking Italian food.",
    hint:"Enjoyment → like + -ing.",
    why:"This expresses enjoyment."
  };

  var transformA = {
    id:"trans_1",
    title:"Transform",
    sub:"Change from general enjoyment to polite request.",
    prompt:"You’re at a restaurant. Choose the best sentence:",
    options:["I like ordering the pasta, please.","I’d like to order the pasta, please."],
    answerIndex: 1,
    hint:"Polite request → I’d like to + verb.",
    why:"Requests use “I’d like to…” not “I like …”."
  };

  var extrasAcc = [
    { title:"Prefer (important)", body:[
        "General preference: I prefer <strong>working</strong> in the morning.",
        "Specific choice: I prefer <strong>to work</strong> in the morning today.",
        "Comparison: I prefer <strong>tea</strong> to <strong>coffee</strong> / I prefer <strong>working</strong> to <strong>studying</strong>."
      ]},
    { title:"Look forward to (always -ing)", body:[
        "✅ I’m looking forward to <strong>meeting</strong> you.",
        "❌ I’m looking forward to meet you."
      ]},
    { title:"Be used to / get used to (always -ing)", body:[
        "✅ I’m used to <strong>speaking</strong> English at work.",
        "✅ I’m getting used to <strong>waking</strong> up early."
      ]},
    { title:"Verbs with meaning change (advanced)", body:[
        "<strong>Stop</strong>: I stopped <strong>smoking</strong> (quit) vs I stopped <strong>to smoke</strong> (paused to smoke).",
        "<strong>Remember/forget</strong>: Remember <strong>to</strong> lock the door (don’t forget) vs Remember <strong>locking</strong> the door (memory).",
        "<strong>Try</strong>: Try <strong>to</strong> call him (make effort) vs Try <strong>calling</strong> him (experiment)."
      ]}
  ];

  var extrasQuiz = [
    { id:"exq_1", title:"Extra patterns", sub:"Choose the correct sentence.", prompt:"You are excited about it in the future:", options:["I’m looking forward to meet you.","I’m looking forward to meeting you."], answerIndex: 1, hint:"“to” is a preposition → -ing.", why:"“Look forward to” requires -ing." },
    { id:"exq_2", title:"Meaning change", sub:"Which means “I paused in order to smoke”?", prompt:"Select the best option:", options:["I stopped smoking.","I stopped to smoke."], answerIndex: 1, hint:"Stop + to = pause in order to…", why:"Stopped smoking = quit. Stopped to smoke = paused." }
  ];

  var speakPrompts = [
    { title:"Daily routine", prompt:"Talk about a healthy habit.", model:"I like to drink water in the morning because it helps me feel awake." },
    { title:"Hobby", prompt:"Talk about something you enjoy.", model:"I like reading crime novels because they’re exciting." },
    { title:"Work preference", prompt:"Describe your work style.", model:"I like to plan my day before I start working." },
    { title:"Polite request", prompt:"Order something politely.", model:"I’d like to have a coffee, please." },
    { title:"Contrast sentence", prompt:"Use both forms in one answer.", model:"I like cooking because it’s fun, but I like to cook healthy meals during the week." },
    { title:"Challenge", prompt:"Use “used to” correctly.", model:"I’m used to speaking English with clients, but I’m still getting used to fast phone calls." }
  ];

  var finalQuiz = [
    { id:"final_1", title:"Final check 1", sub:"Choose the best meaning: enjoyment.", prompt:"Which is best for a hobby?", options:["I like to photography.","I like taking photos."], answerIndex: 1, hint:"Hobby → -ing.", why:"Use -ing for hobbies/enjoyment." },
    { id:"final_2", title:"Final check 2", sub:"Choose the best meaning: polite desire.", prompt:"At the hotel reception:", options:["I’d like to check in.","I’d like checking in."], answerIndex: 0, hint:"Would like → to + verb.", why:"“Would like” uses to + verb." },
    { id:"final_3", title:"Final check 3", sub:"Choose the more natural sentence for routine.", prompt:"About your habits:", options:["I like to reply quickly to messages.","I like replying quickly to messages."], answerIndex: 0, hint:"Routine → to + verb (often).", why:"This sounds like a habit/standard." }
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
      setHint("Rule: enjoyment → like + -ing. Habit/preference/reasons → like + to + verb. Polite request → I’d like to + verb.");
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
