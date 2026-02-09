/* SpeakEasyTisha — UK Trip Chapter 2: Culture + Grammar Survival Kit
   Indirect questions, polite requests, present perfect (experience), UK vocabulary.
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
    try{ localStorage.setItem("SET_ukCultureChapter2_v1", JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem("SET_ukCultureChapter2_v1");
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

  // Chapter 2: UK Culture + Real English + Grammar survival kit

  var starter = {
    id:"starter_c2_1",
    title:"Warm-up: British politeness",
    sub:"Choose the most natural UK-style sentence.",
    prompt:"You want to ask someone for directions (polite):",
    options:[
      "Sorry to bother you — could you tell me how to get to the station?",
      "Where is the station? Give me directions."
    ],
    answerIndex: 0,
    hint:"UK English often uses softeners: sorry / excuse me / could you…",
    why:"Option A is polite and natural. Option B sounds too direct."
  };

  var rulesQuick = [
    {
      id:"rules_c2_1",
      title:"Indirect questions",
      sub:"Word order changes after ‘could you tell me…’",
      prompt:"Choose the correct sentence:",
      options:[
        "Could you tell me where platform 3 is?",
        "Could you tell me where is platform 3?"
      ],
      answerIndex: 0,
      hint:"Indirect question = subject + verb (no inversion).",
      why:"✅ where platform 3 is (not where is platform 3)."
    },
    {
      id:"rules_c2_2",
      title:"Would you mind…?",
      sub:"Requests",
      prompt:"Choose the correct structure:",
      options:[
        "Would you mind helping us with our bags?",
        "Would you mind to help us with our bags?"
      ],
      answerIndex: 0,
      hint:"Would you mind + -ing.",
      why:"✅ Would you mind helping…"
    },
    {
      id:"rules_c2_3",
      title:"Present perfect (experience)",
      sub:"Have you ever…?",
      prompt:"Choose the best question about experience:",
      options:[
        "Have you ever visited Edinburgh?",
        "Did you ever visit Edinburgh?"
      ],
      answerIndex: 0,
      hint:"Use present perfect for life experience (no time).",
      why:"✅ Have you ever visited…"
    },
    {
      id:"rules_c2_4",
      title:"Quite / pretty / really",
      sub:"UK nuance",
      prompt:"In the UK, ‘It’s quite good’ often means:",
      options:[
        "It’s fairly good (not amazing).",
        "It’s the best thing ever."
      ],
      answerIndex: 0,
      hint:"Quite/pretty = fairly. Really = strongly.",
      why:"✅ Often ‘quite good’ = fairly good."
    }
  ];

  var meaningQuiz = [
    {
      id:"mean_c2_1",
      title:"Queue",
      sub:"UK word",
      prompt:"In the UK, a ‘queue’ is a:",
      options:["line", "ticket"],
      answerIndex: 0,
      hint:"Queue = line.",
      why:"✅ Queue = line."
    },
    {
      id:"mean_c2_2",
      title:"Loo",
      sub:"UK word",
      prompt:"A ‘loo’ is a:",
      options:["toilet/restroom", "living room"],
      answerIndex: 0,
      hint:"Loo = toilet.",
      why:"✅ Loo = toilet."
    },
    {
      id:"mean_c2_3",
      title:"Crisps vs chips",
      sub:"Food vocabulary",
      prompt:"In the UK, ‘crisps’ are:",
      options:["potato chips (US)", "French fries (US)"],
      answerIndex: 0,
      hint:"Crisps = chips (US). Chips = fries (US).",
      why:"✅ Crisps = US chips."
    },
    {
      id:"mean_c2_4",
      title:"Contactless",
      sub:"Transport & payment",
      prompt:"‘Contactless’ payment means you:",
      options:["tap your card/phone", "pay only with cash"],
      answerIndex: 0,
      hint:"Tap to pay.",
      why:"✅ Tap to pay."
    },
    {
      id:"mean_c2_5",
      title:"Service charge",
      sub:"Restaurant bill",
      prompt:"A ‘service charge’ is:",
      options:["an added service fee", "a train ticket"],
      answerIndex: 0,
      hint:"Check the bill to avoid tipping twice.",
      why:"✅ It’s an added fee."
    }
  ];

  var errorFixItems = [
    {
      id:"err_c2_1",
      title:"French trap (indirect question)",
      wrong:"Could you tell me where is the museum?",
      answer:"Could you tell me where the museum is?",
      hint:"Indirect question = no inversion.",
      why:"✅ where the museum is"
    },
    {
      id:"err_c2_2",
      title:"French trap (suggest)",
      wrong:"I propose you to take a taxi.",
      answer:"I suggest taking a taxi. / We could take a taxi.",
      hint:"Suggest + -ing. ‘Propose someone to’ is not natural.",
      why:"Use suggest + -ing or could."
    },
    {
      id:"err_c2_3",
      title:"Politeness",
      wrong:"I want a coffee.",
      answer:"Could I have a coffee, please?",
      hint:"In service situations, soften with could/can + please.",
      why:"Sounds more natural in the UK."
    },
    {
      id:"err_c2_4",
      title:"Queue preposition",
      wrong:"I’m on the queue.",
      answer:"I’m in the queue.",
      hint:"In a queue (UK).",
      why:"✅ in the queue."
    },
    {
      id:"err_c2_5",
      title:"Would you mind",
      wrong:"Would you mind to repeat?",
      answer:"Would you mind repeating?",
      hint:"Would you mind + -ing.",
      why:"✅ repeating"
    }
  ];

  var practiceA = [
    {
      id:"pA_c2_1",
      title:"Pub ordering",
      sub:"Most pubs: order at the bar",
      prompt:"Choose the best sentence:",
      options:[
        "Hi — could I get two pints, please?",
        "Waiter! Bring me two beers."
      ],
      answerIndex: 0,
      hint:"In pubs, you usually order at the bar and pay.",
      why:"✅ Polite + natural."
    },
    {
      id:"pA_c2_2",
      title:"Transport",
      sub:"Indirect question",
      prompt:"Choose the best question:",
      options:[
        "Could you tell me when the next train leaves?",
        "Could you tell me when does the next train leave?"
      ],
      answerIndex: 0,
      hint:"Indirect question = no inversion.",
      why:"✅ when the next train leaves"
    },
    {
      id:"pA_c2_3",
      title:"Tipping",
      sub:"Check the bill",
      prompt:"Choose the best sentence:",
      options:[
        "Let’s check if service charge is included before we tip.",
        "We must tip 25% always."
      ],
      answerIndex: 0,
      hint:"Service charge may already be added.",
      why:"✅ Sensible and accurate."
    },
    {
      id:"pA_c2_4",
      title:"Small talk",
      sub:"Classic UK topic",
      prompt:"Choose the best small-talk opener:",
      options:[
        "Lovely weather today, isn’t it?",
        "Tell me your salary."
      ],
      answerIndex: 0,
      hint:"Weather is safe small talk in the UK.",
      why:"✅ Weather is a classic safe topic."
    },
    {
      id:"pA_c2_5",
      title:"Compromise",
      sub:"Partner/friend planning",
      prompt:"Choose the best compromise sentence:",
      options:[
        "How about two busy days in London, then one calm day in Bath?",
        "We only do what I want."
      ],
      answerIndex: 0,
      hint:"How about + -ing; balanced plan.",
      why:"✅ Sounds collaborative."
    },
    {
      id:"pA_c2_6",
      title:"Present perfect",
      sub:"Experience question",
      prompt:"Choose the best question:",
      options:[
        "Have you ever tried afternoon tea?",
        "Did you try afternoon tea?"
      ],
      answerIndex: 0,
      hint:"Ever = present perfect.",
      why:"✅ Have you ever…"
    }
  ];

  var builderA = {
    id:"build_c2_1",
    title:"Build an indirect question",
    sub:"Tap to build the sentence.",
    bank: shuffle(["Excuse","me",",","could","you","tell","me","where","the","nearest","tube","station","is","?"]),
    answer:"Excuse me, could you tell me where the nearest tube station is?",
    hint:"Could you tell me + where + subject + verb.",
    why:"Perfect polite travel question."
  };

  var transformA = {
    id:"trans_c2_1",
    title:"Transform: direct → polite",
    sub:"Make it sound more UK-friendly.",
    prompt:"Choose the best option:",
    options:[
      "Give us a table now.",
      "Could we have a table for two, please?"
    ],
    answerIndex: 1,
    hint:"Could we…? / Would it be possible to…?",
    why:"✅ Polite request."
  };

  var extrasAcc = [
    {
      title:"UK cultural mini-kit (quick rules)",
      body:[
        "<span class='noteBadge'>Queueing</span> People queue politely. Don’t cut in line.",
        "<span class='noteBadge'>Pub culture</span> Often order and pay at the bar; table service varies.",
        "<span class='noteBadge'>Politeness</span> ‘Sorry’ is used a lot (even when nobody is wrong).",
        "<span class='noteBadge'>Small talk</span> Weather is safe. Personal money questions are not."
      ]
    },
    {
      title:"Money & tipping (fast)",
      body:[
        "It’s common to leave around <strong>10–15%</strong> in restaurants if service isn’t included.",
        "Many places add a <strong>service charge</strong> — check the bill to avoid tipping twice.",
        "Card machines often offer a tip option (you can choose 0%)."
      ]
    },
    {
      title:"Transport language (London + trains)",
      body:[
        "<strong>platform</strong> (rail) • <strong>carriage</strong> (UK for train car)",
        "<strong>single / return</strong> (one-way / round-trip)",
        "<strong>tap in / tap out</strong> (contactless/Oyster)",
        "Useful question: “Could you tell me which platform it leaves from?”"
      ]
    },
    {
      title:"UK vs US words (useful pairs)",
      body:[
        "<strong>lift</strong> (UK) = elevator (US)",
        "<strong>queue</strong> (UK) = line (US)",
        "<strong>loo</strong> (UK) = restroom (US)",
        "<strong>crisps</strong> (UK) = chips (US)",
        "<strong>chips</strong> (UK) = fries (US)",
        "<strong>trainers</strong> (UK) = sneakers (US)"
      ]
    },
    {
      title:"Polite templates (copy/paste)",
      body:[
        "Sorry — could you tell me where…?",
        "Would you mind + -ing…?",
        "Could we… / Could I… please?",
        "I see your point; however…",
        "Overall, I think… because…"
      ]
    }
  ];

  var extrasQuiz = [
    {
      id:"exq_c2_1",
      title:"Indirect question",
      sub:"Choose the correct sentence.",
      prompt:"Pick the correct option:",
      options:[
        "Could you tell me where the bus stop is?",
        "Could you tell me where is the bus stop?"
      ],
      answerIndex: 0,
      hint:"No inversion after ‘could you tell me’.",
      why:"✅ where the bus stop is."
    },
    {
      id:"exq_c2_2",
      title:"Would you mind",
      sub:"Choose the correct structure.",
      prompt:"Pick the correct option:",
      options:[
        "Would you mind waiting a moment?",
        "Would you mind to wait a moment?"
      ],
      answerIndex: 0,
      hint:"Would you mind + -ing.",
      why:"✅ waiting"
    }
  ];

  var speakPrompts = [
    {
      title:"Directions (polite)",
      prompt:"Ask for directions using an indirect question.",
      model:"Sorry to bother you — could you tell me how to get to the station?"
    },
    {
      title:"Pub order",
      prompt:"Order two drinks at the bar politely.",
      model:"Hi — could I get two pints, please? And could we pay by card?"
    },
    {
      title:"Train question",
      prompt:"Ask about the next train / platform.",
      model:"Excuse me, could you tell me when the next train leaves and which platform it leaves from?"
    },
    {
      title:"Tipping question",
      prompt:"Ask if service is included.",
      model:"Excuse me — is service included, or should we add a tip?"
    },
    {
      title:"Small talk",
      prompt:"Start a short chat politely.",
      model:"Lovely weather today, isn’t it? Are you from around here?"
    },
    {
      title:"Polite disagreement",
      prompt:"Disagree politely about a touristy plan.",
      model:"I see your point; however, one drawback is that it can be very crowded. How about going early and keeping it short?"
    }
  ];

  var finalQuiz = [
    {
      id:"final_c2_1",
      title:"Indirect questions",
      sub:"Choose the correct option.",
      prompt:"Pick the correct sentence:",
      options:[
        "Could you tell me where the hotel is?",
        "Could you tell me where is the hotel?"
      ],
      answerIndex: 0,
      hint:"No inversion in indirect questions.",
      why:"✅ where the hotel is."
    },
    {
      id:"final_c2_2",
      title:"Food vocabulary",
      sub:"UK word",
      prompt:"In the UK, ‘chips’ are:",
      options:["French fries", "potato chips"],
      answerIndex: 0,
      hint:"Chips (UK) = fries (US).",
      why:"✅ French fries."
    },
    {
      id:"final_c2_3",
      title:"Polite request",
      sub:"Choose the best option.",
      prompt:"At reception:",
      options:[
        "I want a quiet room.",
        "Could we have a quiet room, if possible?"
      ],
      answerIndex: 1,
      hint:"Could we…? / if possible.",
      why:"✅ Polite + natural."
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
      setHint("Chapter 2 hint: Indirect questions (Could you tell me where… is?) • Would you mind + -ing • Present perfect for experience (Have you ever…?) • UK vocab: queue/loo/crisps/chips • Polite templates: Sorry… could you…?");
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
