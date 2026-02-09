/* SpeakEasyTisha — UK Trip Planner (Partner/Friend)
   Compare places (best / depends / tourist-trappy), practice debating + requests + obligations.
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
    try{ localStorage.setItem("SET_ukTripLesson_v1", JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem("SET_ukTripLesson_v1");
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
    id:"starter_uk_1",
    title:"Warm-up",
    sub:"You’re planning a UK trip with your partner/friend. Choose the best ‘neutral + structured’ opener.",
    prompt:"Topic: “Let’s pick the best UK destination for us.”",
    options:[
      "Let’s compare a few places in the UK. We can look at the advantages and disadvantages, then decide.",
      "This place is the best and you are wrong if you disagree."
    ],
    answerIndex: 0,
    hint:"Good planning language is calm + structured (compare → decide).",
    why:"Option A sounds natural and cooperative. Option B is too aggressive for a discussion."
  };

  var rulesQuick = [
    {
      id:"rules_uk_1",
      title:"Comparing",
      sub:"Use classic debate structure",
      prompt:"Choose the correct phrase:",
      options:[
        "On the one hand…, on the other hand…",
        "In the one hand…, in the other hand…"
      ],
      answerIndex: 0,
      hint:"Fixed expression: on the one hand / on the other hand.",
      why:"✅ Correct set phrase."
    },
    {
      id:"rules_uk_2",
      title:"Pros/cons grammar",
      sub:"Template",
      prompt:"One advantage is ___ it’s easy to reach by train.",
      options:["that", "to"],
      answerIndex: 0,
      hint:"Advantage/Disadvantage + is + that + clause.",
      why:"✅ “One advantage is that…”"
    },
    {
      id:"rules_uk_3",
      title:"Suggestions",
      sub:"Partner-friendly tone",
      prompt:"Choose the best suggestion:",
      options:[
        "How about spending two nights in Edinburgh?",
        "You must go to Edinburgh."
      ],
      answerIndex: 0,
      hint:"How about + -ing / We could… / Why don’t we…",
      why:"“How about…” sounds collaborative."
    },
    {
      id:"rules_uk_4",
      title:"Obligations",
      sub:"Have to vs mustn’t",
      prompt:"Choose the correct meaning: “We don’t have to book breakfast.”",
      options:[
        "Breakfast is optional.",
        "Breakfast is forbidden."
      ],
      answerIndex: 0,
      hint:"Don’t have to = no obligation. Mustn’t = prohibition.",
      why:"✅ Optional, not forbidden."
    }
  ];

  var meaningQuiz = [
    {
      id:"mean_uk_1",
      title:"Travel verb",
      sub:"Choose the best verb",
      prompt:"We should ___ a hotel near the station.",
      options:["book", "break"],
      answerIndex: 0,
      hint:"Book = reserve.",
      why:"✅ Book a hotel."
    },
    {
      id:"mean_uk_2",
      title:"Debate verb",
      sub:"Make a reasoned point",
      prompt:"I ___ that Edinburgh is a better choice because it’s compact and walkable.",
      options:["argue", "forget"],
      answerIndex: 0,
      hint:"Argue/claim/suggest = debating verbs.",
      why:"✅ Argue."
    },
    {
      id:"mean_uk_3",
      title:"Hedging",
      sub:"Sound natural",
      prompt:"It ___ be crowded in summer, so we should go early.",
      options:["might", "mustn’t"],
      answerIndex: 0,
      hint:"Might/could = possibility.",
      why:"✅ Might."
    },
    {
      id:"mean_uk_4",
      title:"Requests",
      sub:"Polite travel English",
      prompt:"___ you help us with our luggage, please?",
      options:["Could", "Must"],
      answerIndex: 0,
      hint:"Could you…? = polite request.",
      why:"✅ Could you…"
    },
    {
      id:"mean_uk_5",
      title:"Preferences",
      sub:"Like to vs like doing",
      prompt:"I like ___ museums, but I like ___ early to avoid crowds.",
      options:[
        "visiting / to arrive",
        "to visit / arriving"
      ],
      answerIndex: 0,
      hint:"Enjoyment: like + -ing. Habit/choice: like + to + verb.",
      why:"✅ visiting (activity) / to arrive (choice/habit)."
    }
  ];

  var errorFixItems = [
    {
      id:"err_uk_1",
      title:"French trap",
      wrong:"I am agree with your plan.",
      answer:"I agree with your plan.",
      hint:"No “am” with agree.",
      why:"Agree is a verb: I agree."
    },
    {
      id:"err_uk_2",
      title:"Suggestion trap",
      wrong:"I propose you to go to Bath.",
      answer:"I suggest going to Bath. / I propose going to Bath.",
      hint:"“Propose someone to” is not natural. Use suggest + -ing.",
      why:"In English: suggest + -ing (or suggest that…)."
    },
    {
      id:"err_uk_3",
      title:"Obligation",
      wrong:"We must to book the train.",
      answer:"We must book the train. / We have to book the train.",
      hint:"Must + base verb (no ‘to’).",
      why:"✅ must book."
    },
    {
      id:"err_uk_4",
      title:"Request",
      wrong:"Can you to help me?",
      answer:"Can you help me?",
      hint:"No ‘to’ after can/could/would.",
      why:"Modal + base verb."
    },
    {
      id:"err_uk_5",
      title:"Time",
      wrong:"We have to leave in the morning early.",
      answer:"We have to leave early in the morning.",
      hint:"Word order: frequency/time adverbs are flexible, but ‘early in the morning’ is natural.",
      why:"✅ early in the morning."
    }
  ];

  var practiceA = [
    {
      id:"pA_uk_1",
      title:"At the train station",
      sub:"Choose the best question",
      prompt:"You want to confirm the platform:",
      options:[
        "Excuse me, which platform does the train to Edinburgh leave from?",
        "Hey, where is train Edinburgh?"
      ],
      answerIndex: 0,
      hint:"Polite opener + full question.",
      why:"✅ Natural and polite."
    },
    {
      id:"pA_uk_2",
      title:"Hotel check-in",
      sub:"Choose the best sentence",
      prompt:"You arrive at the hotel reception:",
      options:[
        "Hi, we have a reservation under Martin. Could we check in, please?",
        "Hello, I want room now."
      ],
      answerIndex: 0,
      hint:"Reservation under + name + could we…",
      why:"✅ Polite and clear."
    },
    {
      id:"pA_uk_3",
      title:"Restaurant request",
      sub:"Polite request",
      prompt:"You want a table by the window:",
      options:[
        "Could we have a table by the window, if possible?",
        "Give us window table."
      ],
      answerIndex: 0,
      hint:"Could we… / if possible.",
      why:"✅ Polite request."
    },
    {
      id:"pA_uk_4",
      title:"Disagreement",
      sub:"Keep it friendly",
      prompt:"Your partner suggests a touristy spot. You disagree politely:",
      options:[
        "I see your point. However, I’m not sure it’s the best value for money.",
        "No. That’s stupid."
      ],
      answerIndex: 0,
      hint:"Concede + however.",
      why:"✅ Respectful debate language."
    },
    {
      id:"pA_uk_5",
      title:"Obligation",
      sub:"Choose the correct meaning",
      prompt:"“We mustn’t miss the last train.”",
      options:[
        "It’s very important not to miss it.",
        "It’s optional to take it."
      ],
      answerIndex: 0,
      hint:"Mustn’t = prohibition/strong warning.",
      why:"✅ Strong warning."
    },
    {
      id:"pA_uk_6",
      title:"Quick choice",
      sub:"Crowds",
      prompt:"It will be busy in August. Choose the best plan:",
      options:[
        "We should book early and visit the most popular places in the morning.",
        "We don’t have to plan anything."
      ],
      answerIndex: 0,
      hint:"Should = advice.",
      why:"✅ Best planning advice."
    }
  ];

  var builderA = {
    id:"build_uk_1",
    title:"Build a compromise sentence",
    sub:"Tap to build a partner-friendly compromise.",
    bank: shuffle(["How","about","spending","two","days","in","London",",","then","a","quiet","day","in","Bath","?"]),
    answer:"How about spending two days in London, then a quiet day in Bath?",
    hint:"How about + -ing (suggestion) + then + plan.",
    why:"Compromise = city + relaxing day."
  };

  var transformA = {
    id:"trans_uk_1",
    title:"Transform (polite tone)",
    sub:"Make it more diplomatic.",
    prompt:"Choose the best sentence:",
    options:[
      "That plan is terrible.",
      "I’m not sure that plan will work; maybe we could try another option."
    ],
    answerIndex: 1,
    hint:"Use: I’m not sure… / maybe we could…",
    why:"Polite language keeps teamwork strong."
  };

  var extrasAcc = [
    {
      title:"Best / Mediocre / ‘Worst-value’ (how to compare)",
      body:[
        "<strong>Amazing (‘wow’)</strong>: iconic sights + atmosphere + easy to enjoy.",
        "<strong>Mediocre (depends)</strong>: great if you like a specific vibe (music, street art, nightlife), but not always ‘postcard’ UK.",
        "<strong>Worst-value hotspots</strong>: very crowded/expensive/‘touristy’ — still fun if you plan smart (early/late, book ahead)."
      ]
    },
    {
      title:"Useful debate starters (planning with a partner)",
      body:[
        "Let’s compare a few options.",
        "On the one hand…, on the other hand…",
        "One advantage is that… / One drawback is that…",
        "I see your point; however…",
        "Overall, I think … because…"
      ]
    },
    {
      title:"Travel planning verbs",
      body:[
        "<strong>book</strong> / <strong>reserve</strong> (a hotel, tickets)",
        "<strong>plan</strong> / <strong>organize</strong> (a trip)",
        "<strong>choose</strong> / <strong>pick</strong> (a destination)",
        "<strong>avoid</strong> (crowds, tourist traps)",
        "<strong>prefer</strong> / <strong>would rather</strong>",
        "<strong>recommend</strong> / <strong>suggest</strong>"
      ]
    },
    {
      title:"Obligations + travel (must / have to / don’t have to)",
      body:[
        "We <strong>have to</strong> bring our passports.",
        "We <strong>must</strong> check the last train time.",
        "We <strong>don’t have to</strong> book everything (but it helps).",
        "We <strong>mustn’t</strong> leave valuables on the table."
      ]
    },
    {
      title:"Requests & problem-solving (hotel/transport)",
      body:[
        "<strong>Could you</strong> help us…?",
        "<strong>Would you mind</strong> + -ing…?",
        "<strong>Is it possible to</strong>…?",
        "We <strong>seem to have</strong> a problem with…",
        "Could we <strong>change</strong> / <strong>cancel</strong> / <strong>get a refund</strong>?"
      ]
    }
  ];

  var extrasQuiz = [
    {
      id:"exq_uk_1",
      title:"Suggestion grammar",
      sub:"Choose the correct structure.",
      prompt:"___ visiting the Lake District for nature?",
      options:["How about", "How about to"],
      answerIndex: 0,
      hint:"How about + -ing.",
      why:"✅ How about visiting…"
    },
    {
      id:"exq_uk_2",
      title:"Tourist-trappy hotspot",
      sub:"Choose the best ‘smart plan’.",
      prompt:"A place is very crowded and expensive. What’s the best strategy?",
      options:[
        "Go early/late, book ahead, and keep it short.",
        "Don’t plan and just hope for the best."
      ],
      answerIndex: 0,
      hint:"Plan smart rather than avoid everything.",
      why:"✅ Smart strategy."
    }
  ];

  var speakPrompts = [
    {
      title:"Choose your destination (with pros/cons)",
      prompt:"Say your plan in 4 sentences: topic → advantage → drawback → conclusion.",
      model:"Let’s compare London and Edinburgh. One advantage of London is that there’s so much to do, but it can be expensive. Edinburgh is more compact and has amazing scenery, although the weather can change quickly. Overall, I think Edinburgh is the better choice for a relaxed trip."
    },
    {
      title:"Agree + add a condition",
      prompt:"Agree with your partner, but add one condition.",
      model:"I agree that Bath is a great idea, as long as we book tickets in advance and avoid the busiest time."
    },
    {
      title:"Hotel request",
      prompt:"Ask politely for something at reception.",
      model:"Hi, could we have a quiet room, if possible? And would you mind adding breakfast for tomorrow?"
    },
    {
      title:"Train problem",
      prompt:"Explain a problem and ask for a solution.",
      model:"Excuse me, we missed our connection. Is it possible to take the next train, or change our tickets?"
    },
    {
      title:"Restaurant reservation",
      prompt:"Call to book a table and mention preferences.",
      model:"Hello, I’d like to book a table for two at 7:30. If possible, could we sit by the window?"
    },
    {
      title:"Final pitch (itinerary)",
      prompt:"Present a 3-day itinerary in the UK.",
      model:"Day one: London for museums and a West End show. Day two: a day trip to Bath for the Roman Baths and a relaxing evening. Day three: a countryside walk and a cosy dinner. Overall, it’s a balanced trip."
    }
  ];

  var finalQuiz = [
    {
      id:"final_uk_1",
      title:"Pros/cons",
      sub:"Choose the correct sentence.",
      prompt:"___ it’s easy to reach by train.",
      options:["One advantage is that", "One advantage is to"],
      answerIndex: 0,
      hint:"Advantage is that + clause.",
      why:"✅ One advantage is that…"
    },
    {
      id:"final_uk_2",
      title:"Polite disagreement",
      sub:"Choose the best sentence.",
      prompt:"In a discussion with your partner:",
      options:["You’re wrong.", "I see your point; however, I’m not sure."],
      answerIndex: 1,
      hint:"Concede + however.",
      why:"✅ Polite debate language."
    },
    {
      id:"final_uk_3",
      title:"Obligation",
      sub:"Meaning check",
      prompt:"“We don’t have to book breakfast.” means:",
      options:["Breakfast is optional.", "Breakfast is forbidden."],
      answerIndex: 0,
      hint:"Don’t have to = optional.",
      why:"✅ Optional."
    }
  ];

  // --------- Destination Board dataset (best / mediocre / tourist-trappy) ---------
  var UK_PLACES = [
    {id:"london", name:"London", nation:"England", type:"City", tier:"Amazing", tags:["culture","museums","food","theatre","romantic"], pros:["Iconic sights + museums","Huge choice of food + shows"], cons:["Can be expensive","Crowds in hotspots"], wow:"Big-city energy"},
    {id:"edinburgh", name:"Edinburgh", nation:"Scotland", type:"City", tier:"Amazing", tags:["history","views","walkable","romantic","festivals"], pros:["Compact + walkable","Castle + dramatic views"], cons:["Weather changes fast","Very busy in peak season"], wow:"Storybook city"},
    {id:"bath", name:"Bath", nation:"England", type:"City", tier:"Amazing", tags:["romantic","history","spa","daytrip"], pros:["Roman Baths + Georgian streets","Perfect for couples"], cons:["Small (1–2 nights is enough)","Popular weekends"], wow:"Elegant + relaxing"},
    {id:"york", name:"York", nation:"England", type:"City", tier:"Amazing", tags:["history","cute","food","walkable"], pros:["Medieval streets + walls","Great for a cosy weekend"], cons:["Busy in summer","Can feel touristy in the centre"], wow:"Medieval charm"},
    {id:"lakedistrict", name:"Lake District", nation:"England", type:"National Park", tier:"Amazing", tags:["nature","hiking","views","calm"], pros:["Incredible landscapes","Romantic cabins + walks"], cons:["Weather + transport needs planning","Car helps"], wow:"Nature wow"},
    {id:"eryri", name:"Eryri (Snowdonia)", nation:"Wales", type:"National Park", tier:"Amazing", tags:["nature","hiking","mountains","adventure"], pros:["Mountains + epic views","Great for outdoor couples/friends"], cons:["Weather can be harsh","Transport slower"], wow:"Mountains"},
    {id:"peakdistrict", name:"Peak District", nation:"England", type:"National Park", tier:"Amazing", tags:["nature","easy","villages","hiking"], pros:["Great hikes near cities","Stone villages + scenery"], cons:["Weekends can be crowded","Weather"], wow:"Easy countryside"},
    {id:"cornwall", name:"Cornwall", nation:"England", type:"Region", tier:"Amazing", tags:["coast","beaches","food","romantic"], pros:["Coastal views + beaches","Seafood + seaside towns"], cons:["Long travel time","Very busy in summer"], wow:"Coastal escape"},
    {id:"highlands", name:"Scottish Highlands", nation:"Scotland", type:"Region", tier:"Amazing", tags:["nature","roadtrip","views","calm"], pros:["Dramatic landscapes","Unforgettable roadtrip"], cons:["Distances are big","Car recommended"], wow:"Wild scenery"},

    {id:"manchester", name:"Manchester", nation:"England", type:"City", tier:"Depends (mediocre for some)", tags:["music","food","football","city"], pros:["Great food + music scene","Easy transport hub"], cons:["Less ‘postcard’ UK","Weather"], wow:"Modern city"},
    {id:"birmingham", name:"Birmingham", nation:"England", type:"City", tier:"Depends (mediocre for some)", tags:["city","food","shopping","canals"], pros:["Big city with culture","Good value compared to London"], cons:["Not a classic first-time ‘wow’ for everyone","You need a plan"], wow:"Urban"},
    {id:"bristol", name:"Bristol", nation:"England", type:"City", tier:"Depends (mediocre for some)", tags:["streetart","food","harbour","music"], pros:["Street art + creative vibe","Good weekend city"], cons:["Not as ‘iconic’ as Bath/Edinburgh","Weather"], wow:"Creative city"},
    {id:"brighton", name:"Brighton", nation:"England", type:"Seaside city", tier:"Depends (mediocre for some)", tags:["coast","nightlife","shopping","fun"], pros:["Fun seaside atmosphere","Great for a quick break"], cons:["Can feel crowded in summer","Not very ‘historic’"], wow:"Seaside fun"},

    {id:"royalmile", name:"Royal Mile (Edinburgh)", nation:"Scotland", type:"Hotspot", tier:"Worst-value hotspot", tags:["touristy","crowds","shopping"], pros:["Historic + central","Easy to walk"], cons:["Very crowded","Prices can be high"], wow:"Classic but touristy"},
    {id:"londoneye", name:"London Eye", nation:"England", type:"Attraction", tier:"Worst-value hotspot", tags:["touristy","queues","views"], pros:["Great views","Easy location"], cons:["Queues + price","Very busy"], wow:"Big photo"},
    {id:"coventgarden", name:"Covent Garden", nation:"England", type:"Area", tier:"Worst-value hotspot", tags:["touristy","shopping","streetperformers"], pros:["Lively atmosphere","Good for a short stop"], cons:["Crowds","Prices"], wow:"Buzz"},
    {id:"landsend", name:"Land's End (Cornwall)", nation:"England", type:"Landmark", tier:"Worst-value hotspot", tags:["touristy","photos","coast"], pros:["Famous point","Coastal views"], cons:["Often feels commercial","Can be expensive"], wow:"Famous point"},
    {id:"shambles", name:"The Shambles (York)", nation:"England", type:"Street", tier:"Worst-value hotspot", tags:["touristy","photos","shopping"], pros:["Very pretty","Great photos"], cons:["Very crowded","Short visit"], wow:"Instagram street"},
    {id:"stonehenge", name:"Stonehenge", nation:"England", type:"Attraction", tier:"Worst-value hotspot", tags:["touristy","daytrip","history"], pros:["Iconic","Easy day trip from London"], cons:["Expensive + busy","Far from the stones"], wow:"Iconic but crowded"}
  ];

  var TAGS = ["romantic","culture","history","nature","coast","food","walkable","museums","theatre","hiking","streetart","music","nightlife","touristy","views","adventure","city","spa","daytrip","football","shopping","roadtrip","calm","villages","mountains"];



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


  /* -------------------- UK Trip Board -------------------- */
  var boardState = {
    activeTags: {},
    tier: "all",
    compare: [],
    plan: []
  };

  function el(tag, cls, html){
    var d=document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;

  function toast(msg){
    // lightweight “toast”: reuse the global hint box
    if (!msg) return;
    setHint(String(msg));
    var hb = $("globalHint");
    if (hb){
      hb.hidden = false;
      clearTimeout(toast._t);
      toast._t = setTimeout(function(){ hb.hidden = true; }, 2200);
    }
  }

  }

  function loadBoard(){
    try{
      var raw = localStorage.getItem("SET_ukTripBoard_v1");
      if (raw){ boardState = Object.assign(boardState, JSON.parse(raw)); }
    }catch(e){}
  }
  function saveBoard(){
    try{ localStorage.setItem("SET_ukTripBoard_v1", JSON.stringify(boardState)); }catch(e){}
  }

  function tagOn(t){ return !!boardState.activeTags[t]; }

  function renderTagChips(){
    var wrap = $("tagChips");
    if (!wrap) return;
    wrap.innerHTML = "";
    TAGS.forEach(function(t){
      var b = document.createElement("button");
      b.type="button";
      b.className="chip";
      b.setAttribute("aria-pressed", tagOn(t) ? "true" : "false");
      b.textContent = t;
      b.addEventListener("click", function(){
        boardState.activeTags[t] = !boardState.activeTags[t];
        saveBoard();
        renderPlaceBoard();
      });
      wrap.appendChild(b);
    });
  }

  function tierMatch(place){
    if (boardState.tier === "all") return true;
    if (boardState.tier === "amazing") return place.tier.indexOf("Amazing") === 0;
    if (boardState.tier === "depends") return place.tier.indexOf("Depends") === 0;
    if (boardState.tier === "trap") return place.tier.indexOf("Worst-value") === 0;
    return true;
  }

  function tagsMatch(place){
    var active = Object.keys(boardState.activeTags).filter(function(k){ return boardState.activeTags[k]; });
    if (!active.length) return true;
    return active.every(function(t){ return (place.tags||[]).indexOf(t) >= 0; });
  }

  function pickTierBadge(tier){
    var label = tier;
    var cls = "badge";
    if (tier.indexOf("Amazing")===0) cls += " badge--wow";
    else if (tier.indexOf("Depends")===0) cls += " badge--solid";
    else if (tier.indexOf("Worst-value")===0) cls += " badge--trap";
    return '<span class="'+cls+'">⭐ '+esc(label)+'</span>';
  }

  function toggleCompare(id){
    var i = boardState.compare.indexOf(id);
    if (i >= 0){ boardState.compare.splice(i,1); }
    else{
      if (boardState.compare.length >= 2) boardState.compare.shift();
      boardState.compare.push(id);
    }
    saveBoard();
    renderCompare();
    renderPlaceBoard();
  }

  function addToPlan(id){
    if (boardState.plan.indexOf(id) === -1) boardState.plan.push(id);
    saveBoard();
    renderPlanList();
    toast("Added to plan ✅");
  }

  function removeFromPlan(id){
    var i = boardState.plan.indexOf(id);
    if (i>=0) boardState.plan.splice(i,1);
    saveBoard();
    renderPlanList();
  }

  function renderPlaceBoard(){
    loadBoard();
    renderTagChips();

    // tier buttons
    var tAll = $("tierAll"), tA=$("tierAmazing"), tD=$("tierDepends"), tT=$("tierTrap");
    function setTier(val){
      boardState.tier = val;
      saveBoard();
      renderPlaceBoard();
    }
    if (tAll && !tAll.dataset.bound){
      [ [tAll,"all"], [tA,"amazing"], [tD,"depends"], [tT,"trap"] ].forEach(function(pair){
        var btn = pair[0], val = pair[1];
        if (!btn) return;
        btn.addEventListener("click", function(){ setTier(val); });
        btn.dataset.bound="1";
      });
    }
    if (tAll){ tAll.setAttribute("aria-pressed", boardState.tier==="all" ? "true" : "false"); }
    if (tA){ tA.setAttribute("aria-pressed", boardState.tier==="amazing" ? "true" : "false"); }
    if (tD){ tD.setAttribute("aria-pressed", boardState.tier==="depends" ? "true" : "false"); }
    if (tT){ tT.setAttribute("aria-pressed", boardState.tier==="trap" ? "true" : "false"); }

    var grid = $("placeGrid");
    if (!grid) return;
    grid.innerHTML = "";

    var list = UK_PLACES.filter(function(p){ return tierMatch(p) && tagsMatch(p); });

    if (!list.length){
      grid.appendChild(el("div","smallNote","No results. Try removing some tags."));
    }

    list.forEach(function(p){
      var c = el("div","placeCard");
      var top = el("div","placeTop");
      top.appendChild(el("div","", "<h3>"+esc(p.name)+"</h3>"+'<div class="placeMeta">'+esc(p.type)+" • "+esc(p.nation)+'</div>'));
      top.appendChild(el("div","", pickTierBadge(p.tier)));
      c.appendChild(top);

      var tags = el("div","tagRow");
      (p.tags||[]).slice(0,8).forEach(function(t){
        tags.appendChild(el("span","tag", esc(t)));
      });
      c.appendChild(tags);

      var pm = el("div","placeMeta",
        "<strong>Pros:</strong> "+esc((p.pros||[]).slice(0,2).join(" • "))+
        "<br><strong>Cons:</strong> "+esc((p.cons||[]).slice(0,2).join(" • "))
      );
      c.appendChild(pm);

      var actions = el("div","placeActions");
      var b1 = el("button","btn btn--ghost", boardState.compare.indexOf(p.id)>=0 ? "✓ Compare" : "Compare");
      b1.type="button";
      b1.addEventListener("click", function(){ toggleCompare(p.id); });

      var b2 = el("button","btn", "Add to plan");
      b2.type="button";
      b2.addEventListener("click", function(){ addToPlan(p.id); });

      var b3 = el("button","btn btn--ghost", "🔊 Say");
      b3.type="button";
      b3.addEventListener("click", function(){ speak(p.name); });

      actions.appendChild(b1); actions.appendChild(b2); actions.appendChild(b3);
      c.appendChild(actions);

      grid.appendChild(c);
    });

    renderCompare();
    renderPlanList();
  }

  function findPlace(id){
    for (var i=0;i<UK_PLACES.length;i++){ if (UK_PLACES[i].id===id) return UK_PLACES[i]; }
    return null;
  }

  function renderCompare(){
    var box = $("comparePanel");
    if (!box) return;
    var ids = boardState.compare.slice();
    if (ids.length < 1){
      box.innerHTML = '<div class="compareCard"><strong>Compare</strong><p class="smallNote">Tap “Compare” on 1–2 places to see a side‑by‑side comparison.</p></div>';
      return;
    }
    var p1 = findPlace(ids[0]);
    var p2 = ids[1] ? findPlace(ids[1]) : null;

    function col(p){
      if (!p) return "";
      var pros = (p.pros||[]).map(function(x){ return "<li>"+esc(x)+"</li>"; }).join("");
      var cons = (p.cons||[]).map(function(x){ return "<li>"+esc(x)+"</li>"; }).join("");
      var tags = (p.tags||[]).slice(0,10).map(function(t){ return "<span class='tag'>"+esc(t)+"</span>"; }).join(" ");
      return "<div class='compareCard'>"
        + "<div class='placeTop'><div><h3>"+esc(p.name)+"</h3><div class='placeMeta'>"+esc(p.type)+" • "+esc(p.nation)+"</div></div>"
        + "<div>"+pickTierBadge(p.tier)+"</div></div>"
        + "<div class='tagRow' style='margin-top:8px'>"+tags+"</div>"
        + "<p class='placeMeta'><strong>Pros</strong></p><ul class='listClean'>"+pros+"</ul>"
        + "<p class='placeMeta'><strong>Cons</strong></p><ul class='listClean'>"+cons+"</ul>"
        + "<div class='placeActions' style='margin-top:10px'>"
        + "<button type='button' class='btn btn--ghost js-say' data-say='"+esc(p.name)+"'>🔊 Say name</button>"
        + "</div>"
        + "</div>";
    }

    var debatePrompt = "Debate prompt: Which is the better choice for you, and why?";
    var starters = [
      "On the one hand…, on the other hand…",
      "One advantage is that… / One drawback is that…",
      "I see your point; however…",
      "Overall, I think… because…"
    ];

    box.innerHTML =
      "<div class='compareCard'>"
      + "<strong>Comparison zone</strong>"
      + "<p class='smallNote'>Goal: use debate language + obligations + requests to make a clear plan.</p>"
      + "<div class='compareGrid'>"+ col(p1) + col(p2) +"</div>"
      + "<div class='outputBox' style='margin-top:12px'>"
      + "<p><strong>"+esc(debatePrompt)+"</strong></p>"
      + "<ul class='listClean'>"+ starters.map(function(s){ return "<li>"+esc(s)+"</li>"; }).join("") +"</ul>"
      + "</div>"
      + "</div>";

    // bind static speak buttons again
    qa(".js-say", box).forEach(function(btn){
      btn.addEventListener("click", function(){
        var t = btn.getAttribute("data-say") || "";
        if (t) speak(t);
      });
    });
  }

  function renderPlanList(){
    var box = $("planList");
    if (!box) return;
    box.innerHTML = "";
    if (!boardState.plan.length){
      box.innerHTML = "<p class='smallNote'>No places in your plan yet. Add 1–3 places from the board.</p>";
      return;
    }
    var ul = el("ul","listClean");
    boardState.plan.slice(0,6).forEach(function(id){
      var p = findPlace(id);
      if (!p) return;
      var li = document.createElement("li");
      li.innerHTML = "<strong>"+esc(p.name)+"</strong> <span class='smallNote'>("+esc(p.type)+")</span>";
      var btn = document.createElement("button");
      btn.type="button"; btn.className="btn btn--ghost"; btn.textContent="Remove";
      btn.style.marginLeft="10px";
      btn.addEventListener("click", function(){ removeFromPlan(id); });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    box.appendChild(ul);
  }

  /* -------------------- Itinerary Builder -------------------- */
  function initItineraryBuilder(){
    loadBoard();
    var form = $("itineraryForm");
    if (!form || form.dataset.bound) { renderPlanList(); return; }
    form.dataset.bound="1";

    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      buildItinerary();
    });

    var btn = $("btnBuildItinerary");
    if (btn){
      btn.addEventListener("click", function(){
        buildItinerary();
      });
    }

    buildItinerary();
  }

  function buildItinerary(){
    var days = parseInt(($("tripDays") && $("tripDays").value) || "3", 10);
    if (!(days>=2 && days<=10)) days = 3;
    var vibe = ($("tripVibe") && $("tripVibe").value) || "balanced";
    var companion = ($("tripCompanion") && $("tripCompanion").value) || "partner";

    var picks = boardState.plan.slice(0,3).map(findPlace).filter(Boolean);
    if (!picks.length){
      // default suggestions
      if (vibe==="romantic") picks = [findPlace("bath"), findPlace("edinburgh"), findPlace("cornwall")].filter(Boolean);
      else if (vibe==="nature") picks = [findPlace("lakedistrict"), findPlace("peakdistrict"), findPlace("highlands")].filter(Boolean);
      else if (vibe==="culture") picks = [findPlace("london"), findPlace("edinburgh"), findPlace("york")].filter(Boolean);
      else picks = [findPlace("london"), findPlace("bath"), findPlace("edinburgh")].filter(Boolean);
    }

    var obligations = [
      "You have to travel with a valid passport.",
      "You may need an ETA (Electronic Travel Authorisation) before you travel.",
      "You should book trains and popular tickets early in peak season.",
      "You mustn’t leave valuables on the table in busy areas.",
      "You don’t have to plan every minute — but a basic plan helps."
    ];

    // Simple day planner
    var lines = [];
    lines.push("TRIP STYLE: " + vibe.toUpperCase() + " • Companion: " + companion.toUpperCase());
    lines.push("");
    for (var d=1; d<=days; d++){
      var p = picks[(d-1) % picks.length];
      lines.push("Day " + d + ": " + (p ? p.name : "UK highlight"));
      lines.push("  Morning: arrive early / key sight");
      lines.push("  Afternoon: local food + walk");
      lines.push("  Evening: cosy dinner / show / pub");
      lines.push("");
    }
    lines.push("OBLIGATIONS & SMART RULES:");
    obligations.forEach(function(o){ lines.push("- " + o); });
    lines.push("");
    lines.push("DEBATE SENTENCE STARTERS:");
    lines.push("- On the one hand…, on the other hand…");
    lines.push("- One advantage is that… / One drawback is that…");
    lines.push("- I see your point; however…");
    lines.push("- Overall, I think… because…");

    var out = $("itineraryOutput");
    if (out){
      out.innerHTML = "<div class='outputBox'><pre>"+esc(lines.join("\n"))+"</pre></div>";
    }
  }

  /* -------------------- Scenario Generator -------------------- */
  var SCENARIOS = [
    {title:"Hotel issue", roleA:"You booked a double room. It’s noisy.", roleB:"Reception offers alternatives.", mustUse:["could you…?","would you mind + -ing","we have to"], model:"Hi, could you help us, please? Our room is quite noisy. Would you mind moving us to a quieter room? We have to rest because we’re travelling early tomorrow."},
    {title:"Train change", roleA:"You missed your connection.", roleB:"Staff explains options.", mustUse:["is it possible to…?","we mustn’t miss…","could we…?"], model:"Excuse me, we missed our connection. Is it possible to take the next train? We mustn’t miss the last train tonight. Could we change our tickets, please?"},
    {title:"Debate: city vs nature", roleA:"You want London.", roleB:"Your friend wants the Lake District.", mustUse:["on the one hand","however","overall"], model:"On the one hand, London has museums and theatres. However, the Lake District is calmer and more romantic. Overall, I think we should do both: two days in London, then nature."},
    {title:"Restaurant booking", roleA:"Book a table for two and request a window seat.", roleB:"Restaurant asks for time and name.", mustUse:["I’d like to","could we","if possible"], model:"Hello, I’d like to book a table for two at 7:30. Could we have a table by the window, if possible? The name is Martin."},
    {title:"Tourist-trap decision", roleA:"You want to go to a very touristy hotspot.", roleB:"Partner wants better value.", mustUse:["I see your point","one drawback is that","how about + -ing"], model:"I see your point. One drawback is that it can be crowded and expensive. How about going early, then doing a quieter walk afterwards?"}
  ];

  function initScenarioGenerator(){
    var btn = $("btnNewScenario");
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound="1";
    btn.addEventListener("click", function(){ showScenario(); });
    showScenario();
  }

  function showScenario(){
    var box = $("scenarioBox");
    if (!box) return;
    var s = SCENARIOS[Math.floor(Math.random()*SCENARIOS.length)];
    box.innerHTML =
      "<div class='compareCard'>"
      + "<div class='placeTop'><div><h3>🎭 Scenario: "+esc(s.title)+"</h3><div class='placeMeta'>Role A: "+esc(s.roleA)+"<br>Role B: "+esc(s.roleB)+"</div></div></div>"
      + "<p><strong>You must use:</strong> "+esc(s.mustUse.join(" • "))+"</p>"
      + "<div class='placeActions'>"
      + "<button type='button' class='btn btn--ghost' id='btnScenarioModel'>🔊 Model</button>"
      + "<button type='button' class='btn' id='btnScenarioText'>Show text</button>"
      + "</div>"
      + "<div class='modelText' id='scenarioModelText' hidden></div>"
      + "</div>";

    var b1 = $("btnScenarioModel");
    if (b1) b1.addEventListener("click", function(){ speak(s.model); });

    var b2 = $("btnScenarioText");
    var model = $("scenarioModelText");
    if (model) model.textContent = s.model;
    if (b2 && model){
      b2.addEventListener("click", function(){
        var isHidden = !!model.hidden;
        model.hidden = !isHidden;
        b2.textContent = isHidden ? "Hide text" : "Show text";
        if (isHidden){ setHint(s.model); }
      });
    }
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
    // Init non-scored interactive widgets
    renderPlaceBoard();
    initItineraryBuilder();
    initScenarioGenerator();
    updateStats();
    jumpTo("start");
  }

  function bindGlobalButtons(){
    $("btnShowHint").addEventListener("click", function(){
      setHint("UK Trip Planner hint: Compare → pros/cons (One advantage is that… / One drawback is that…) • Suggest: How about + -ing / We could… • Obligation: have to / must / don’t have to / mustn’t • Polite requests: Could you…? / Would you mind + -ing…?");
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
    // Init non-scored interactive widgets
    renderPlaceBoard();
    initItineraryBuilder();
    initScenarioGenerator();
    updateStats();
    if (location.hash){
      var id = location.hash.replace("#","");
      if ($(id)) jumpTo(id);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
