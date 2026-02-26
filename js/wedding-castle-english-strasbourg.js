/* SpeakEasyTisha — Wedding Castle English (Strasbourg)
   Wedding planner / decorator / officiant: vocabulary + grammar + phrases + emails + troubleshooting.
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
    try{ localStorage.setItem("SET_weddingCastle_v1", JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem("SET_weddingCastle_v1");
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

  // Wedding Planner / Decor / Officiant English (Castle near Strasbourg)
  // Focus: vocabulary + key phrases + grammar frames + emails + troubleshooting + speaking

  var starter = {
    id:"starter_wed_1",
    title:"Warm-up: what sounds professional?",
    sub:"Pick the most natural sentence.",
    prompt:"You want to confirm the schedule politely. Choose the best option:",
    options:[
      "Could you please confirm the ceremony start time?",
      "Can you confirm me the ceremony time?"
    ],
    answerIndex: 0,
    hint:"In English we say “confirm the time” or “confirm that…” (not “confirm me”).",
    why:"✅ Professional + natural."
  };

  var rulesQuick = [
    {
      id:"rules_wed_1",
      title:"Polite requests",
      sub:"Could you… / Would you mind…",
      prompt:"Choose the best sentence:",
      options:[
        "Would you mind sending the final guest count?",
        "Do you mind to send the final guest count?"
      ],
      answerIndex: 0,
      hint:"Would you mind + -ing",
      why:"✅ Would you mind sending…"
    },
    {
      id:"rules_wed_2",
      title:"Future planning",
      sub:"going to vs will",
      prompt:"Choose the best sentence:",
      options:[
        "We’re going to set up the ceremony arch at 3 pm.",
        "We will to set up the ceremony arch at 3 pm."
      ],
      answerIndex: 0,
      hint:"No “to” after will. Use “going to” for a plan already decided.",
      why:"✅ going to = planned."
    },
    {
      id:"rules_wed_3",
      title:"Arrangements",
      sub:"Present continuous for a fixed arrangement",
      prompt:"Choose the best sentence:",
      options:[
        "The florist is arriving at 10:30.",
        "The florist arrives at 10:30. (possible, but less “arrangement” tone)"
      ],
      answerIndex: 0,
      hint:"Present continuous often sounds like a scheduled arrangement.",
      why:"✅ is arriving = arranged."
    },
    {
      id:"rules_wed_4",
      title:"Contingency plan",
      sub:"If + present → will/can",
      prompt:"Choose the best sentence:",
      options:[
        "If it rains, we’ll move the ceremony indoors.",
        "If it will rain, we’ll move the ceremony indoors."
      ],
      answerIndex: 0,
      hint:"No “will” after IF (standard).",
      why:"✅ Correct conditional."
    },
    {
      id:"rules_wed_5",
      title:"Passive voice (very common in events)",
      sub:"is set up / will be installed",
      prompt:"Choose the best sentence:",
      options:[
        "The table plan will be displayed near the entrance.",
        "The table plan will display near the entrance."
      ],
      answerIndex: 0,
      hint:"Use passive: will be + past participle.",
      why:"✅ will be displayed."
    }
  ];

  var meaningQuiz = [
    {
      id:"mean_wed_1",
      title:"Client discovery",
      sub:"Tone",
      prompt:"Which question sounds warmer and more professional?",
      options:[
        "What atmosphere would you like for your ceremony?",
        "What atmosphere you want?"
      ],
      answerIndex: 0,
      hint:"Use “would you like…” for softer tone.",
      why:"✅ natural client tone."
    },
    {
      id:"mean_wed_2",
      title:"Numbers & logistics",
      sub:"Guest count",
      prompt:"Choose the correct question:",
      options:[
        "How many guests are you expecting?",
        "How many guests do you expect?"
      ],
      answerIndex: 0,
      hint:"Both can work, but “are you expecting” is very common in planning.",
      why:"✅ common wedding-planning phrasing."
    },
    {
      id:"mean_wed_3",
      title:"Officiant script",
      sub:"Clarity",
      prompt:"Choose the best line:",
      options:[
        "Please take your seats. The ceremony will begin shortly.",
        "Please sit. The ceremony begins soonly."
      ],
      answerIndex: 0,
      hint:"“shortly” is the natural adverb here.",
      why:"✅ professional announcement."
    },
    {
      id:"mean_wed_4",
      title:"French trap",
      sub:"“I propose”",
      prompt:"In English, “I propose we…” usually means:",
      options:[
        "I suggest we…",
        "I ask you to marry me (proposal)"
      ],
      answerIndex: 0,
      hint:"In meetings, “I propose” = “I suggest”.",
      why:"✅ Useful nuance for French speakers."
    }
  ];

  var errorFixItems = [
    {
      id:"err_wed_1",
      title:"Confirm + object",
      wrong:"Can you confirm me the time?",
      answer:"Could you please confirm the time?",
      hint:"confirm + noun / confirm that… (not confirm me).",
      why:"✅ natural correction."
    },
    {
      id:"err_wed_2",
      title:"Would you mind + -ing",
      wrong:"Would you mind to send the contract?",
      answer:"Would you mind sending the contract?",
      hint:"Would you mind + -ing.",
      why:"✅ standard structure."
    },
    {
      id:"err_wed_3",
      title:"Set up (phrasal verb)",
      wrong:"We will install up the tables.",
      answer:"We’ll set up the tables.",
      hint:"“Set up” = installer (very common in events).",
      why:"✅ natural event English."
    },
    {
      id:"err_wed_4",
      title:"If + present (not will)",
      wrong:"If it will rain, we will move inside.",
      answer:"If it rains, we’ll move inside.",
      hint:"No will after IF in standard conditionals.",
      why:"✅ correct conditional."
    },
    {
      id:"err_wed_5",
      title:"Professional décor language",
      wrong:"We will make the place beautiful with deco.",
      answer:"We’ll decorate the venue and create the atmosphere.",
      hint:"Use “decorate the venue / create the atmosphere / styling”.",
      why:"✅ more professional."
    }
  ];

  var practiceA = [
    {
      id:"pA_wed_1",
      title:"Venue tour",
      sub:"Key phrase",
      prompt:"Choose the best sentence:",
      options:[
        "Let me show you the ceremony area and the cocktail space.",
        "Let me present you the ceremony place."
      ],
      answerIndex: 0,
      hint:"show you / area / space",
      why:"✅ natural tour language."
    },
    {
      id:"pA_wed_2",
      title:"Decor setup (mise en place)",
      sub:"Set up",
      prompt:"Choose the best sentence:",
      options:[
        "We’ll start setting up at 9 am and finish by noon.",
        "We will begin to make the mise en place at 9."
      ],
      answerIndex: 0,
      hint:"Set up = mise en place (events).",
      why:"✅ professional."
    },
    {
      id:"pA_wed_3",
      title:"Vendor coordination",
      sub:"Arrival time",
      prompt:"Choose the best question:",
      options:[
        "What time will your team arrive for unloading?",
        "At what hour arrives your team for unload?"
      ],
      answerIndex: 0,
      hint:"What time will… arrive? / for unloading",
      why:"✅ natural + clear."
    },
    {
      id:"pA_wed_4",
      title:"Dietary requirements",
      sub:"Guest care",
      prompt:"Choose the best sentence:",
      options:[
        "Do you have any allergies or dietary requirements we should know about?",
        "You have allergies?"
      ],
      answerIndex: 0,
      hint:"dietary requirements = restrictions/preferences.",
      why:"✅ warm and professional."
    },
    {
      id:"pA_wed_5",
      title:"Officiant: vow moment",
      sub:"Ceremony line",
      prompt:"Choose the best line:",
      options:[
        "You may now exchange your vows.",
        "You can now change your vows."
      ],
      answerIndex: 0,
      hint:"exchange vows (not change).",
      why:"✅ correct collocation."
    },
    {
      id:"pA_wed_6",
      title:"Problem-solving",
      sub:"Late florist",
      prompt:"Choose the best sentence:",
      options:[
        "If the florist is late, we’ll adjust the timeline and start photos first.",
        "If the florist will be late, we adjust the timeline."
      ],
      answerIndex: 0,
      hint:"If + present → will.",
      why:"✅ correct conditional."
    }
  ];

  var builderA = {
    id:"build_wed_1",
    title:"Build a professional email sentence",
    sub:"Tap to build the sentence.",
    bank:(function(){
      var a=["Could","you","please","send","the","final","timeline","and","guest","count","by","Friday","?"];
      return shuffle(a);
    })(),
    answer:"Could you please send the final timeline and guest count by Friday?",
    hint:"Could you please… = polite request.",
    why:"Perfect professional sentence."
  };

  var transformA = {
    id:"trans_wed_1",
    title:"Transform: direct → diplomatic",
    sub:"Choose the best version.",
    prompt:"Choose the most diplomatic message to a client:",
    options:[
      "You didn’t pay the deposit.",
      "It looks like the deposit hasn’t been received yet — could you please check?"
    ],
    answerIndex: 1,
    hint:"Use softer language + request.",
    why:"✅ professional tone."
  };

  var extrasAcc = [
    {
      title:"Core vocabulary (EN → FR) — copy/paste",
      body:[
        "<strong>venue</strong> = lieu • <strong>castle</strong> = château • <strong>estate</strong> = domaine",
        "<strong>set up</strong> = mise en place / installer • <strong>tear down</strong> = démonter",
        "<strong>aisle</strong> = allée • <strong>arch</strong> = arche • <strong>altar</strong> = autel",
        "<strong>table plan / seating chart</strong> = plan de table",
        "<strong>place cards</strong> = marque-places • <strong>centerpieces</strong> = centres de table",
        "<strong>cocktail hour</strong> = vin d'honneur • <strong>reception</strong> = réception",
        "<strong>sound check</strong> = balance son • <strong>PA system</strong> = sonorisation",
        "<strong>officiant</strong> = officiant(e) • <strong>vows</strong> = vœux"
      ]
    },
    {
      title:"Client questions (discovery call)",
      body:[
        "What atmosphere would you like — elegant, romantic, modern, rustic?",
        "Do you have a colour palette or theme in mind?",
        "What’s your approximate budget range (for décor + flowers)?",
        "How many guests are you expecting?",
        "Any cultural traditions we should include?",
        "Do you need bilingual coordination (French/English)?"
      ]
    },
    {
      title:"Grammar frames (steal these)",
      body:[
        "<strong>Plans</strong>: We’re going to + verb (We’re going to set up at 9.)",
        "<strong>Arrangements</strong>: X is arriving at… (The band is arriving at 16:00.)",
        "<strong>Polite requests</strong>: Could you please… / Would you mind + -ing…",
        "<strong>Contingency</strong>: If + present → we’ll… / we can…",
        "<strong>Passive</strong>: The chairs will be placed… / The candles are being set out…"
      ]
    },
    {
      title:"Email templates (short + professional)",
      body:[
        "<strong>1) Confirm details</strong>: Just a quick note to confirm…",
        "<strong>2) Request info</strong>: Could you please share… by…?",
        "<strong>3) Vendor coordination</strong>: Our access time is… Please confirm unloading…",
        "<strong>4) Polite issue</strong>: It looks like… hasn’t been… yet. Could you please check?"
      ]
    }
  ];

  var extrasQuiz = [
    {
      id:"exq_wed_1",
      title:"Collocation",
      sub:"Choose the correct phrase",
      prompt:"Choose the best option:",
      options:["exchange vows","change vows"],
      answerIndex: 0,
      hint:"exchange vows is the standard expression.",
      why:"✅ exchange"
    },
    {
      id:"exq_wed_2",
      title:"Passive voice",
      sub:"Choose the correct sentence",
      prompt:"Choose the best option:",
      options:[
        "The chairs will be placed in two rows.",
        "The chairs will place in two rows."
      ],
      answerIndex: 0,
      hint:"Passive: will be + past participle.",
      why:"✅ will be placed"
    }
  ];

  var speakPrompts = [
    {
      title:"Client discovery call (2–3 min)",
      prompt:"Ask 6 key questions (atmosphere, budget, guests, timeline, traditions, language).",
      model:"Hi! Congratulations. To design the décor, I’d love to understand your vision. What atmosphere would you like — elegant or romantic? Do you have a colour palette? What’s your budget range for décor and flowers? How many guests are you expecting? Are there any cultural traditions you’d like to include? And would you like bilingual coordination in French and English?"
    },
    {
      title:"Castle site visit (2 min)",
      prompt:"Give a short tour and propose options for ceremony + cocktail hour.",
      model:"Let me show you the ceremony area first. The aisle can start here, and the arch can be placed in front of the trees. Then for cocktail hour, we can use the terrace — it’s perfect for photos. If it rains, we’ll move indoors to the ballroom."
    },
    {
      title:"Vendor coordination call (1–2 min)",
      prompt:"Confirm access, unloading, power, sound check, and timing.",
      model:"Hi! Just to confirm logistics: our access time is 9 am for set-up. Where would you like the unloading zone? Do you need a power supply near the band area? We’re planning a sound check at 4 pm. Could you please confirm your arrival time?"
    },
    {
      title:"Officiant announcement (1 min)",
      prompt:"Read a short ceremony script with a calm tone.",
      model:"Good afternoon, everyone. Welcome. Please take your seats; the ceremony will begin shortly. Today we are here to celebrate the marriage of… You may now exchange your vows."
    },
    {
      title:"Problem-solving (2 min)",
      prompt:"Handle a problem politely: late florist + timeline changes.",
      model:"Thanks for the update. If the florist is late, we’ll adjust the timeline and start couple photos first. We can place temporary décor for the ceremony and swap in the flowers as soon as they arrive."
    },
    {
      title:"Email to an international client (1–2 min)",
      prompt:"Write a short email to confirm the plan and request missing info.",
      model:"Subject: Final details for your castle wedding\n\nHi [Name],\nJust a quick note to confirm the schedule: ceremony at 3:30 pm, cocktail hour at 4:15, dinner at 7:00. Could you please send the final guest count and any dietary requirements by Friday?\nWarm regards,\n[Your Name]"
    }
  ];

  var finalQuiz = [
    {
      id:"final_wed_1",
      title:"If-clause",
      sub:"Choose the correct option",
      prompt:"___, we’ll move the ceremony indoors.",
      options:["If it rains", "If it will rain"],
      answerIndex: 0,
      hint:"No will after IF.",
      why:"✅ If it rains"
    },
    {
      id:"final_wed_2",
      title:"Would you mind…",
      sub:"Choose the correct option",
      prompt:"Would you mind ___ the updated floor plan?",
      options:["sending", "to send"],
      answerIndex: 0,
      hint:"Would you mind + -ing",
      why:"✅ sending"
    },
    {
      id:"final_wed_3",
      title:"Passive voice",
      sub:"Choose the correct option",
      prompt:"The seating chart ___ near the entrance.",
      options:["will be displayed", "will display"],
      answerIndex: 0,
      hint:"Passive: will be displayed.",
      why:"✅ will be displayed"
    }
  ];

  var weddingSpinScenarios = [
    { key:"rainplan", title:"🌧️ Rain starts 30 minutes before the ceremony",
      clue:"Outdoor ceremony planned — guests are arriving.",
      correct:"If it rains, we’ll move the ceremony indoors and update the guests.",
      wrong1:"If it will rain, we move the ceremony inside.",
      wrong2:"If it rains, we would move indoors.",
      tip:"Real plan: If + present → will." },
    { key:"lateflorist", title:"🌸 Florist is late",
      clue:"The arch flowers are missing.",
      correct:"If the florist is late, we’ll adjust the timeline and start photos first.",
      wrong1:"If the florist will be late, we adjust the timeline.",
      wrong2:"If the florist is late, we adjusting the timeline.",
      tip:"If + present → will + base verb." },
    { key:"dietary", title:"🥗 Guest has a severe allergy",
      clue:"Last-minute message from the couple.",
      correct:"Thank you for letting me know. We’ll inform catering and confirm a safe option.",
      wrong1:"Thanks. We will prevent catering.",
      wrong2:"We inform catering yesterday.",
      tip:"Use calm, reassuring tone + clear action." },
    { key:"sound", title:"🔊 Microphone stops working",
      clue:"Officiant needs to speak in the ceremony.",
      correct:"Let’s do a quick sound check and switch to the backup microphone.",
      wrong1:"We make a sound checking quickly.",
      wrong2:"We will to switch the microphone.",
      tip:"Set phrases: do a sound check / backup mic." },
    { key:"timeline", title:"⏱️ Dinner is running late",
      clue:"Speeches are scheduled soon.",
      correct:"We can shorten the cocktail hour and push speeches back by 15 minutes.",
      wrong1:"We can to shorten the cocktail hour.",
      wrong2:"We shorten the cocktail hour and speeches back.",
      tip:"Modal: can + base verb (no to)." },
    { key:"vendoraccess", title:"🚚 Vendor can’t find the unloading entrance",
      clue:"They’re parked on the wrong side of the castle.",
      correct:"I’ll send you a pin and meet you at the main gate in two minutes.",
      wrong1:"I send you a pin and I meet you after two minutes.",
      wrong2:"I will to meet you at the gate.",
      tip:"Near‑future action + clear direction." }
  ];

  var emailTemplates = [
    {
      key:"confirm",
      title:"Template: confirm details",
      subject:"Final confirmation — ceremony + reception timeline",
      body:"Hi {{name}},\n\nJust a quick note to confirm the key details for {{date}} at {{venue}}:\n• Ceremony: {{ceremony_time}}\n• Cocktail hour: {{cocktail_time}}\n• Dinner: {{dinner_time}}\n\nIf anything has changed, please let me know.\n\nWarm regards,\n{{signature}}"
    },
    {
      key:"requestinfo",
      title:"Template: request info",
      subject:"Quick request — guest count + dietary requirements",
      body:"Hi {{name}},\n\nCould you please send:\n1) the final guest count\n2) any allergies or dietary requirements\nby {{deadline}}?\n\nThank you!\n{{signature}}"
    },
    {
      key:"vendors",
      title:"Template: vendor coordination",
      subject:"Logistics — access, unloading, and timing",
      body:"Hi {{name}},\n\nJust to confirm logistics for {{date}} at {{venue}}:\n• Access time for set-up: {{access_time}}\n• Unloading zone: {{unloading}}\n• Power needs: {{power}}\n• Sound check: {{soundcheck}}\n\nCould you please confirm your arrival time?\n\nBest regards,\n{{signature}}"
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

  
  /* -------------------- Wedding Spinner + Email Generator (custom widgets) -------------------- */

  var wedSpin = { idx: 0, answered: {} };

  function initWeddingWidgets(){
    
    var _rb = $("btnRevealBuild");
    if (_rb && !_rb._wired) {
      _rb.addEventListener("click", revealBuildAnswer);
      _rb._wired = true;
    }
initWeddingSpinner();
    initEmailGenerator();
  }

  function initWeddingSpinner(){
    var wrap = $("weddingSpin");
    if (!wrap) return;

    var sel = $("wedSpinSelect");
    if (sel && !sel._pop){
      sel.innerHTML = "";
      weddingSpinScenarios.forEach(function(s, i){
        var o=document.createElement("option");
        o.value=String(i);
        o.textContent=s.title;
        sel.appendChild(o);
      });
      sel._pop = true;
    }

    sel.addEventListener("change", function(){
      wedSpin.idx = parseInt(sel.value,10) || 0;
      renderWeddingSpinner();
    });

    $("btnWedSpin").addEventListener("click", function(){
      wedSpin.idx = Math.floor(Math.random()*weddingSpinScenarios.length);
      sel.value = String(wedSpin.idx);
      renderWeddingSpinner();
      setHint("New situation! Choose the best professional response.");
    });

    $("btnWedHint").addEventListener("click", function(){
      var s = weddingSpinScenarios[wedSpin.idx] || weddingSpinScenarios[0];
      setHint(s.clue + " • " + s.tip);
    });

    $("btnWedSpeak").addEventListener("click", function(){
      var s = weddingSpinScenarios[wedSpin.idx] || weddingSpinScenarios[0];
      speak(s.correct);
    });

    renderWeddingSpinner();
  }

  function wedSpinKey(){
    var s = weddingSpinScenarios[wedSpin.idx] || weddingSpinScenarios[0];
    return "wedspin_" + (s.key || String(wedSpin.idx));
  }

  function renderWeddingSpinner(){
    var s = weddingSpinScenarios[wedSpin.idx] || weddingSpinScenarios[0];
    $("wedSpinTitle").textContent = s.title;
    $("wedSpinClue").textContent = s.clue;

    var correct = s.correct;
    var opts = shuffle([correct, s.wrong1, s.wrong2]);
    var key = wedSpinKey();
    var locked = !!state.solved[key] || (typeof wedSpin.answered[key] === "number");

    var wrap = $("wedSpinOptions");
    wrap.innerHTML = "";

    opts.forEach(function(txt){
      var b=document.createElement("button");
      b.type="button";
      b.className="btn btn--ghost";
      b.textContent = txt;
      b.disabled = locked;

      b.addEventListener("click", function(){
        if (state.solved[key]) return;
        var ok = (txt === correct);
        wedSpin.answered[key] = 1;

        markSolved(key);
        addScore(ok);

        setHint((ok ? "✅ Correct. " : "❌ Not quite. ") + s.tip);
        renderWeddingSpinner();
      });

      wrap.appendChild(b);
    });

    var out = $("wedSpinAnswer");
    if (locked){
      out.textContent = "✅ Best response: " + correct;
      out.hidden = false;
    } else {
      out.textContent = "";
      out.hidden = true;
    }
  }

  function initEmailGenerator(){
    var box = $("emailGen");
    if (!box) return;

    var sel = $("emailTemplateSelect");
    if (sel && !sel._pop){
      sel.innerHTML = "";
      emailTemplates.forEach(function(t, i){
        var o=document.createElement("option");
        o.value = t.key;
        o.textContent = t.title;
        sel.appendChild(o);
      });
      sel._pop = true;
    }

    $("btnEmailBuild").addEventListener("click", function(){ buildEmail(); });

    $("btnEmailSpeak").addEventListener("click", function(){
      var out = $("emailOut").textContent || "";
      if (!out.trim() || out.trim()==="—") { setHint("Generate an email first."); return; }
      speak(out.replace(/Subject:.*?\n\n/,""));
    });

    $("btnEmailClear").addEventListener("click", function(){
      $("emailOut").textContent = "—";
      setHint("Email cleared.");
    });

    buildEmail();
  }

  function getTemplateByKey(k){
    for (var i=0;i<emailTemplates.length;i++){
      if (emailTemplates[i].key === k) return emailTemplates[i];
    }
    return emailTemplates[0];
  }

  function fillTpl(str, map){
    return str.replace(/\{\{(\w+)\}\}/g, function(_, k){
      return (map[k] != null) ? String(map[k]) : "";
    });
  }

  function buildEmail(){
    var tKey = $("emailTemplateSelect").value;
    var t = getTemplateByKey(tKey);

    var map = {
      name: $("fName").value || "Name",
      date: $("fDate").value || "the wedding day",
      venue: $("fVenue").value || "the castle venue",
      ceremony_time: $("fCeremony").value || "3:30 pm",
      cocktail_time: $("fCocktail").value || "4:15 pm",
      dinner_time: $("fDinner").value || "7:00 pm",
      deadline: $("fDeadline").value || "Friday",
      access_time: $("fAccess").value || "9:00 am",
      unloading: $("fUnload").value || "main courtyard (Gate A)",
      power: $("fPower").value || "2 sockets near the band area",
      soundcheck: $("fSound").value || "4:00 pm",
      signature: $("fSignature").value || "Your Name"
    };

    var subj = fillTpl(t.subject, map);
    var body = fillTpl(t.body, map);

    $("emailOut").textContent = "Subject: " + subj + "\n\n" + body;
    setHint("Email generated. Edit the fields and regenerate.");
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
    // Init custom widget(s)
    initWeddingWidgets();
    updateStats();
    jumpTo("start");
  }

  function bindGlobalButtons(){
    $("btnShowHint").addEventListener("click", function(){
      setHint("Wedding hint: Could you please… / Would you mind + -ing… Plans: going to. Arrangements: is arriving. Contingency: If + present → will. Passive: will be + past participle.");
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
    // Init custom widget(s)
    initWeddingWidgets();
    updateStats();
    if (location.hash){
      var id = location.hash.replace("#","");
      if ($(id)) jumpTo(id);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();


/* -------------------- Build: Reveal Answer -------------------- */
function revealBuildAnswer(){
  try{
    if (typeof builderA === "undefined" || !builderA || !builderA.answer) {
      if (typeof setHint === "function") setHint("No model answer found.");
      return;
    }
    var ans = builderA.answer;
    if (typeof setHint === "function") setHint("Model answer revealed 👇");
    alert("✔ Model answer:\n\n" + ans);
    if (typeof speak === "function") speak(ans);
  } catch(e){
    console.error(e);
  }
}
