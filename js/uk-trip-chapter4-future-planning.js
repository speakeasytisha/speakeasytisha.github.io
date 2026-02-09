/* SpeakEasyTisha — UK Trip Chapter 4: Future Planning
   going to / will / present continuous (arrangements), time expressions, planning language.
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
    try{ localStorage.setItem("SET_ukChapter4Future_v1", JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem("SET_ukChapter4Future_v1");
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

  // Chapter 4: Future trip planning (UK) — going to / will / present continuous (arrangements)
  // plus time expressions and planning language for partner/friend.

  var starter = {
    id:"starter_c4_1",
    title:"Warm-up: choose the natural future",
    sub:"You are planning a UK trip with your partner/friend.",
    prompt:"You decided yesterday. Choose the best sentence:",
    options:[
      "We’re going to spend three days in London.",
      "We will spend three days in London. (neutral decision from yesterday)"
    ],
    answerIndex: 0,
    hint:"going to = intention/plan already decided. will = spontaneous decision/prediction/offer.",
    why:"If you already decided, “going to” sounds more natural."
  };

  var rulesQuick = [
    {
      id:"rules_c4_1",
      title:"Going to (plan/intention)",
      sub:"Decision made before speaking",
      prompt:"Choose the best sentence:",
      options:[
        "I’m going to book the hotel tonight.",
        "I’ll book the hotel tonight. (spontaneous)"
      ],
      answerIndex: 0,
      hint:"If the plan exists already, use going to.",
      why:"✅ going to = intention/plan."
    },
    {
      id:"rules_c4_2",
      title:"Present continuous (arrangement)",
      sub:"Fixed plan with time/place",
      prompt:"Choose the best sentence:",
      options:[
        "We’re meeting at King’s Cross at 10 a.m. on Friday.",
        "We meet at King’s Cross at 10 a.m. on Friday."
      ],
      answerIndex: 0,
      hint:"Present continuous = arranged plan (meeting, leaving, arriving…).",
      why:"✅ We’re meeting…"
    },
    {
      id:"rules_c4_3",
      title:"Will (decision now / offer)",
      sub:"Spontaneous decision",
      prompt:"Your partner says: “I forgot my charger.” You answer:",
      options:[
        "Don’t worry — I’ll lend you mine.",
        "Don’t worry — I’m going to lend you mine. (already planned)"
      ],
      answerIndex: 0,
      hint:"Will is perfect for offers made now.",
      why:"✅ I’ll lend you mine."
    },
    {
      id:"rules_c4_4",
      title:"Will (prediction)",
      sub:"What do you think will happen?",
      prompt:"Choose the best sentence:",
      options:[
        "It will probably rain this afternoon.",
        "It is raining probably this afternoon."
      ],
      answerIndex: 0,
      hint:"Prediction → will + probably.",
      why:"✅ It will probably rain…"
    },
    {
      id:"rules_c4_5",
      title:"Time prepositions",
      sub:"on / in / at",
      prompt:"Choose the correct option:",
      options:[
        "We’re leaving on Friday at 6.",
        "We’re leaving in Friday at 6."
      ],
      answerIndex: 0,
      hint:"on + day/date • at + time • in + month/year/season.",
      why:"✅ on Friday at 6."
    }
  ];

  var meaningQuiz = [
    {
      id:"mean_c4_1",
      title:"Book vs reserve",
      sub:"Travel verb",
      prompt:"We need to ___ train tickets early.",
      options:["book", "lose"],
      answerIndex: 0,
      hint:"Book = reserve.",
      why:"✅ book"
    },
    {
      id:"mean_c4_2",
      title:"Arrange",
      sub:"Planning verb",
      prompt:"Let’s ___ to meet at 9 in the lobby.",
      options:["arrange", "argue"],
      answerIndex: 0,
      hint:"Arrange = organize a plan.",
      why:"✅ arrange"
    },
    {
      id:"mean_c4_3",
      title:"Cancel / reschedule",
      sub:"Change plans",
      prompt:"If the train is delayed, we might need to ___ the dinner reservation.",
      options:["reschedule", "repeat"],
      answerIndex: 0,
      hint:"Reschedule = change time/date.",
      why:"✅ reschedule"
    },
    {
      id:"mean_c4_4",
      title:"Forecast",
      sub:"Weather planning",
      prompt:"The weather ___ says it’ll be windy tomorrow.",
      options:["forecast", "contrast"],
      answerIndex: 0,
      hint:"Forecast = prediction for weather.",
      why:"✅ forecast"
    },
    {
      id:"mean_c4_5",
      title:"Flexible",
      sub:"Planning adjective",
      prompt:"Choose the best meaning:",
      options:[
        "able to change plans easily",
        "unable to move"
      ],
      answerIndex: 0,
      hint:"Flexible = not rigid.",
      why:"✅ able to change plans."
    }
  ];

  var errorFixItems = [
    {
      id:"err_c4_1",
      title:"Present continuous",
      wrong:"We go to Bath on Saturday.",
      answer:"We’re going to Bath on Saturday. / We’re going to go to Bath on Saturday.",
      hint:"For arranged trips, present continuous is natural.",
      why:"✅ We’re going to Bath…"
    },
    {
      id:"err_c4_2",
      title:"Going to",
      wrong:"I going to book the hotel.",
      answer:"I’m going to book the hotel.",
      hint:"Be + going to.",
      why:"✅ I’m going to…"
    },
    {
      id:"err_c4_3",
      title:"Time preposition",
      wrong:"We’re leaving in Friday at 6.",
      answer:"We’re leaving on Friday at 6.",
      hint:"on + day/date; at + time.",
      why:"✅ on Friday at 6."
    },
    {
      id:"err_c4_4",
      title:"Will (word order)",
      wrong:"We will probably to arrive late.",
      answer:"We’ll probably arrive late.",
      hint:"Will + base verb (no to).",
      why:"✅ will probably arrive"
    },
    {
      id:"err_c4_5",
      title:"French trap (future)",
      wrong:"I propose we will go to York.",
      answer:"I suggest we go to York. / How about going to York?",
      hint:"Suggest + base verb / suggest + -ing.",
      why:"Natural planning English."
    }
  ];

  var practiceA = [
    {
      id:"pA_c4_1",
      title:"Plan vs decision now",
      sub:"Choose the best option",
      prompt:"You planned this earlier:",
      options:[
        "I’m going to buy the tickets tonight.",
        "I’ll buy the tickets tonight. (decision right now)"
      ],
      answerIndex: 0,
      hint:"Already planned → going to.",
      why:"✅ going to"
    },
    {
      id:"pA_c4_2",
      title:"Arrangement",
      sub:"Meeting time",
      prompt:"Choose the best sentence:",
      options:[
        "We’re meeting outside the museum at 2 p.m.",
        "We will meet outside the museum at 2 p.m."
      ],
      answerIndex: 0,
      hint:"Present continuous = arranged plan.",
      why:"✅ We’re meeting…"
    },
    {
      id:"pA_c4_3",
      title:"Offer",
      sub:"Spontaneous help",
      prompt:"Your friend says: “I can’t find the station.” You answer:",
      options:[
        "I’ll send you my location.",
        "I’m going to send you my location. (already planned)"
      ],
      answerIndex: 0,
      hint:"Offer made now → will.",
      why:"✅ I’ll send you…"
    },
    {
      id:"pA_c4_4",
      title:"Prediction",
      sub:"Future guess",
      prompt:"Choose the best sentence:",
      options:[
        "It will be crowded this weekend.",
        "It is crowded this weekend. (maybe true, but not a prediction)"
      ],
      answerIndex: 0,
      hint:"Prediction → will.",
      why:"✅ It will be crowded…"
    },
    {
      id:"pA_c4_5",
      title:"Time words",
      sub:"on / in / at",
      prompt:"Choose the correct sentence:",
      options:[
        "We’re arriving in May.",
        "We’re arriving on May."
      ],
      answerIndex: 0,
      hint:"in + month.",
      why:"✅ in May"
    },
    {
      id:"pA_c4_6",
      title:"By vs until",
      sub:"Deadline vs duration",
      prompt:"Choose the best sentence:",
      options:[
        "We have to check in by 9 p.m.",
        "We have to check in until 9 p.m."
      ],
      answerIndex: 0,
      hint:"By = deadline. Until = duration ending at a time.",
      why:"✅ by 9 p.m."
    }
  ];

  var builderA = {
    id:"build_c4_1",
    title:"Build a future plan message",
    sub:"Tap to build a text message to your partner/friend.",
    bank: shuffle(["Hi","!","I’m","going","to","book","the","hotel","tonight",".","We’re","meeting","at","King’s","Cross","at","10","a.m.","on","Friday","."]),
    answer:"Hi! I’m going to book the hotel tonight. We’re meeting at King’s Cross at 10 a.m. on Friday.",
    hint:"Plan (going to) + arrangement (present continuous).",
    why:"This message is clear, natural, and practical."
  };

  var transformA = {
    id:"trans_c4_1",
    title:"Transform: basic → natural planning",
    sub:"Choose the best version (future planning).",
    prompt:"Pick the best option:",
    options:[
      "We will go to London and we will visit museums and we will eat fish and chips.",
      "We’re going to spend two days in London, visit a couple of museums, and try fish and chips."
    ],
    answerIndex: 1,
    hint:"Avoid repeating ‘will’. Use going to + parallel verbs.",
    why:"Option B sounds more natural and fluent."
  };

  var extrasAcc = [
    {
      title:"Future planning mini-map (when to use which)",
      body:[
        "<strong>going to</strong> = plan/intention already decided: “We’re going to book the hotel.”",
        "<strong>present continuous</strong> = arrangement with time/place: “We’re leaving at 6 on Friday.”",
        "<strong>will</strong> = decision now / offer / promise: “I’ll call them.”",
        "<strong>will</strong> = prediction: “It’ll probably rain.”"
      ]
    },
    {
      title:"Time expressions (fast)",
      body:[
        "<strong>on</strong> Friday / on 12 May • <strong>at</strong> 6 p.m. • <strong>in</strong> May / in 2026 / in summer",
        "<strong>this</strong> weekend • <strong>next</strong> week • <strong>in two weeks</strong>",
        "<strong>by</strong> 9 p.m. (deadline) • <strong>until</strong> 9 p.m. (duration)"
      ]
    },
    {
      title:"Planning phrases (partner/friend)",
      body:[
        "How about + -ing…?",
        "Why don’t we…?",
        "We could…",
        "Shall we…? (UK)",
        "Let’s + verb…",
        "If we have time, we can…"
      ]
    },
    {
      title:"Future tense roadmap (next lessons)",
      body:[
        "<strong>Present perfect continuous</strong>: We’ve been waiting for 20 minutes.",
        "<strong>Conditionals</strong>: If it rains, we’ll… / If we went…, we would…",
        "<strong>Future continuous</strong>: This time tomorrow, we’ll be travelling.",
        "<strong>Future perfect</strong>: By Friday, we’ll have booked everything.",
        "<strong>Passive</strong>: Breakfast is included / It was built in…",
        "<strong>Reported speech</strong>: The receptionist said that…"
      ]
    }
  ];

  var extrasQuiz = [
    {
      id:"exq_c4_1",
      title:"Arrangement",
      sub:"Choose the best option.",
      prompt:"Fixed plan with a time:",
      options:[
        "We’re having dinner at 8.",
        "We have dinner at 8."
      ],
      answerIndex: 0,
      hint:"Present continuous = arrangement.",
      why:"✅ We’re having…"
    },
    {
      id:"exq_c4_2",
      title:"Offer",
      sub:"Choose the best option.",
      prompt:"Spontaneous help:",
      options:[
        "I’ll carry that bag for you.",
        "I’m going to carry that bag for you. (already planned)"
      ],
      answerIndex: 0,
      hint:"Offer now → will.",
      why:"✅ I’ll carry…"
    }
  ];

  var speakPrompts = [
    {
      title:"Make the plan (30 seconds)",
      prompt:"Explain your plan using going to + one arrangement in present continuous.",
      model:"We’re going to spend three days in London. We’re meeting at King’s Cross at 10 a.m. on Friday, then we’re taking the Tube to our hotel."
    },
    {
      title:"Offer + promise",
      prompt:"Make an offer and a promise (will).",
      model:"Don’t worry — I’ll call the hotel and I’ll confirm the reservation for us."
    },
    {
      title:"Prediction (weather + crowds)",
      prompt:"Make 2 predictions using will + probably/might.",
      model:"It will probably rain, so we’ll take an umbrella. The centre might be crowded, so we’ll go early."
    },
    {
      title:"Negotiate a change",
      prompt:"Change the plan politely and suggest an alternative.",
      model:"I see your point, but the museum might be too crowded. How about visiting it early and doing a quieter walk in the afternoon?"
    },
    {
      title:"Text message (clear plan)",
      prompt:"Send a short message with time expressions (on/in/at).",
      model:"Hi! We’re leaving on Saturday at 7. We’re arriving in Edinburgh at 11. Let’s meet at the station at 11:15."
    },
    {
      title:"Final pitch (itinerary preview)",
      prompt:"Present a 4-day itinerary preview with future tenses.",
      model:"We’re going to start in London for two days, then we’re travelling to York. We’ll probably visit the old city walls, and if we have time, we’ll do a day trip. Overall, it’s going to be a balanced trip."
    }
  ];

  var finalQuiz = [
    {
      id:"final_c4_1",
      title:"Choose the tense",
      sub:"Plan already decided",
      prompt:"We ___ visit Bath this weekend.",
      options:["are going to", "will to"],
      answerIndex: 0,
      hint:"Be going to + base verb.",
      why:"✅ are going to"
    },
    {
      id:"final_c4_2",
      title:"Arrangement",
      sub:"Fixed time",
      prompt:"We ___ at 6 on Friday.",
      options:["are leaving", "leave will"],
      answerIndex: 0,
      hint:"Present continuous for arrangement.",
      why:"✅ are leaving"
    },
    {
      id:"final_c4_3",
      title:"Offer",
      sub:"Spontaneous",
      prompt:"Don’t worry — I ___ call them now.",
      options:["will", "am going to (already planned)"],
      answerIndex: 0,
      hint:"Offer/decision now → will.",
      why:"✅ will"
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
      setHint("Chapter 4 hint: going to = plan/intention • present continuous = arrangement (time/place) • will = decision now/offer/promise/prediction • time preps: on (day/date), in (month/year), at (time) • by vs until.");
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
