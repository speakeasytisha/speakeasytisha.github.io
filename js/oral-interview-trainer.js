/* SpeakEasyTisha — Oral Interview Trainer
   Put this file in: /js/oral-interview-trainer.js
   Touch-friendly (iPad Safari) + desktop friendly.
*/
(function(){
  "use strict";

  // ===== Helpers =====
  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.from((root || document).querySelectorAll(sel)); }
  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
  function shuffle(arr){
    var a = arr.slice();
    for (var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var tmp=a[i]; a[i]=a[j]; a[j]=tmp;
    }
    return a;
  }

  // ===== Storage =====
  var LS = {
    get: function(k, fallback){
      try{
        var v = localStorage.getItem(k);
        return v === null ? fallback : JSON.parse(v);
      }catch(e){ return fallback; }
    },
    set: function(k, v){
      try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){}
    },
    del: function(k){
      try{ localStorage.removeItem(k); }catch(e){}
    }
  };

  // ===== Scroll chips =====
  $all(".navchip").forEach(function(btn){
    btn.addEventListener("click", function(){
      var target = btn.getAttribute("data-scroll");
      var el = $(target);
      if (!el) return;
      el.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  // ===== Speech (TTS) =====
  var accentSel = $("#accent");
  var rateEl = $("#speechRate");
  var pitchEl = $("#speechPitch");
  var speechSupported = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);

  function stopSpeech(){
    if (!speechSupported) return;
    try{ window.speechSynthesis.cancel(); }catch(e){}
  }

  function pickVoice(lang){
    if (!speechSupported) return null;
    var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    if (!voices || !voices.length) return null;

    // Prefer exact lang match, then startsWith.
    var exact = voices.filter(function(v){ return (v.lang || "").toLowerCase() === lang.toLowerCase(); });
    if (exact.length) return exact[0];

    var partial = voices.filter(function(v){ return (v.lang || "").toLowerCase().indexOf(lang.toLowerCase().slice(0,2)) === 0; });
    return partial.length ? partial[0] : voices[0];
  }

  function speak(text){
    if (!speechSupported){
      alert("Text-to-speech is not available in this browser.");
      return;
    }
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text || ""));
    var lang = accentSel ? accentSel.value : "en-GB";
    u.lang = lang;
    u.rate = clamp(parseFloat(rateEl ? rateEl.value : 1.0) || 1.0, 0.7, 1.25);
    u.pitch = clamp(parseFloat(pitchEl ? pitchEl.value : 1.0) || 1.0, 0.6, 1.4);

    // Some browsers (iOS Safari) require voices to be loaded after an initial call.
    var voice = pickVoice(lang);
    if (voice) u.voice = voice;

    window.speechSynthesis.speak(u);
  }

  // iOS often needs a "voiceschanged" listener
  if (speechSupported && window.speechSynthesis){
    window.speechSynthesis.onvoiceschanged = function(){ /* no-op, but triggers voice availability */ };
  }

  $("#btnStopSpeech") && $("#btnStopSpeech").addEventListener("click", stopSpeech);

  // ===== Global Score =====
  var SCORE_KEY = "se_oral_score_v1";
  var MAX_KEY = "se_oral_max_v1";
  var STATE_KEY = "se_oral_state_v1";

  var scoreState = LS.get(SCORE_KEY, {score:0});
  var maxState = LS.get(MAX_KEY, {max:0});
  function setMax(n){
    maxState.max = n;
    LS.set(MAX_KEY, maxState);
    $("#globalMaxTop").textContent = String(n);
    $("#globalMaxBottom").textContent = String(n);
  }
  function setScore(n){
    scoreState.score = n;
    LS.set(SCORE_KEY, scoreState);
    $("#globalScoreTop").textContent = String(n);
    $("#globalScoreBottom").textContent = String(n);
  }
  function addScore(delta){
    setScore(Math.max(0, (scoreState.score||0) + delta));
  }

  function recomputeMax(){
    // Builder 10 + Blanks 10 = 20 total (adjust if you add more)
    setMax(20);
  }

  recomputeMax();
  setScore(scoreState.score || 0);

  // ===== Reset =====
  function resetAll(){
    stopSpeech();
    LS.del(SCORE_KEY);
    LS.del(MAX_KEY);
    LS.del(STATE_KEY);
    setScore(0);
    recomputeMax();
    initBuilder(true);
    initBlanks(true);
    initChecklist(true);
    // notes
    $("#notesBox").value = "";
    LS.set("se_oral_notes_v1", "");
    // scenario select to first
    if ($("#scenarioSelect")) $("#scenarioSelect").selectedIndex = 0;
    renderScenario();
    // vocab shuffle to default
    renderFlashcards(vocabList);
    alert("Reset done.");
  }
  $("#btnResetAll") && $("#btnResetAll").addEventListener("click", resetAll);

  // ===== Scenarios =====
  var scenarios = [
    {
      id:"intro",
      title:"Introduce yourself (professional)",
      question:"Could you introduce yourself and describe your current role?",
      context:"CLOE often starts with simple personal/professional questions. Keep it structured and polite.",
      model:[
        "Yes, of course. I’m currently working as a project coordinator in the construction sector, and I’m responsible for planning tasks and following deadlines.",
        "Overall, I enjoy this role because it’s very practical and I work with different teams. For example, I often coordinate updates between suppliers and site managers.",
        "So that’s a quick overview. If you’d like, I can also explain what a typical week looks like."
      ],
      hints:{
        s1:"Name + role + 2 responsibilities.",
        s2:"Add 2 connectors + one example.",
        s3:"Polite closing + offer to add detail."
      }
    },
    {
      id:"motivation",
      title:"Motivation (learning English)",
      question:"Why do you want to improve your English right now?",
      context:"Explain a real need: work, travel, customers, meetings, or moving abroad.",
      model:[
        "It’s mainly for professional reasons. I need English to communicate more confidently with international colleagues and clients.",
        "In my experience, meetings go faster when I can clarify details directly. For instance, I sometimes need to confirm deadlines or explain a small problem.",
        "So improving my English will make me more efficient. Would you like a concrete example from my job?"
      ],
      hints:{
        s1:"Reason + context (work/travel).",
        s2:"Explain benefit + example.",
        s3:"Close + ask back."
      }
    },
    {
      id:"reschedule",
      title:"Reschedule an appointment",
      question:"Your colleague asks to move a meeting. How do you respond politely and propose a new time?",
      context:"CLOE frequently tests polite requests, scheduling, and flexibility.",
      model:[
        "Sure, no problem. I can move the meeting, and I’m available on Thursday morning or Friday after lunch.",
        "Actually, Thursday at 10:30 would work best for me because I have a deadline later in the afternoon. If that’s not convenient, I can also do a short call on Friday.",
        "So let me know what you prefer, and I’ll send the updated invite."
      ],
      hints:{
        s1:"Accept + give 2 options.",
        s2:"Add a reason + alternative.",
        s3:"Close with next step."
      }
    },
    {
      id:"complaint",
      title:"Handle a customer complaint",
      question:"A customer says a product arrived damaged. What do you say?",
      context:"You must apologize, ask for details, and offer a solution.",
      model:[
        "I’m really sorry to hear that. Could you tell me what’s damaged and when you received the package?",
        "First of all, I’ll check the order details, and then we can choose the best solution. For example, we can replace the item or offer a refund, depending on your preference.",
        "So once I have the photos or information, I’ll handle it quickly. Would you like a replacement or a refund?"
      ],
      hints:{
        s1:"Apologize + ask 2 questions.",
        s2:"Explain process + solutions.",
        s3:"Close + offer choice."
      }
    },
    {
      id:"travelIssue",
      title:"Travel problem (delayed train/flight)",
      question:"Your train/flight is delayed and you will be late. What do you say to the person waiting for you?",
      context:"Time + apology + new plan.",
      model:[
        "Hi, I just wanted to let you know my train is delayed, so I’ll arrive about thirty minutes late. I’m sorry about that.",
        "To be honest, it’s out of my control, but I’m tracking the updates now. If it gets worse, I can take the next connection or we can reschedule.",
        "So I’ll message you as soon as I have the exact arrival time. Thanks for your patience."
      ],
      hints:{
        s1:"State delay + apology.",
        s2:"Explain plan + option.",
        s3:"Close politely."
      }
    },
    {
      id:"projectUpdate",
      title:"Give a short project update",
      question:"Could you give an update on your project and mention one risk?",
      context:"Structure + clear vocabulary. Keep it short and concrete.",
      model:[
        "Yes. At the moment, the project is on track and we’ve completed the first phase of testing.",
        "However, one risk is the delivery date of a key component. For example, if the supplier is late, it could impact the final schedule.",
        "So to reduce that risk, we’re confirming dates this week and preparing a backup plan."
      ],
      hints:{
        s1:"Status + progress.",
        s2:"Risk + example.",
        s3:"Solution + closing."
      }
    }
  ];

  var scenarioSelect = $("#scenarioSelect");
  if (scenarioSelect){
    scenarios.forEach(function(s){
      var opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = "🎯 " + s.title;
      scenarioSelect.appendChild(opt);
    });
    scenarioSelect.addEventListener("change", renderScenario);
  }

  function getSelectedScenario(){
    var id = scenarioSelect ? scenarioSelect.value : scenarios[0].id;
    for (var i=0;i<scenarios.length;i++){
      if (scenarios[i].id === id) return scenarios[i];
    }
    return scenarios[0];
  }

  function renderScenario(){
    var s = getSelectedScenario();
    $("#scenarioQuestion").textContent = s.question;
    $("#scenarioContext").textContent = s.context;
    $("#scenarioModelText").textContent = s.model.join(" ");
    $("#hintStep1").textContent = s.hints.s1;
    $("#hintStep2").textContent = s.hints.s2;
    $("#hintStep3").textContent = s.hints.s3;

    // update builder model to match the currently selected scenario
    initBuilder(false);
  }

  renderScenario();

  $("#btnListenModel") && $("#btnListenModel").addEventListener("click", function(){
    var s = getSelectedScenario();
    speak(s.model.join(" "));
  });

  $("#btnShowModel") && $("#btnShowModel").addEventListener("click", function(){
    var box = $("#modelBox");
    if (!box) return;
    box.hidden = !box.hidden;
  });

  // ===== Practice timer =====
  var timerNum = $("#timerNum");
  var practiceTimeSel = $("#practiceTime");
  var timerId = null;
  var remaining = parseInt(practiceTimeSel ? practiceTimeSel.value : "45", 10) || 45;

  function setTimer(n){
    remaining = n;
    if (timerNum) timerNum.textContent = String(n);
  }
  function resetTimer(){
    stopTimer();
    setTimer(parseInt(practiceTimeSel.value,10) || 45);
  }
  function stopTimer(){
    if (timerId){ clearInterval(timerId); timerId = null; }
  }

  practiceTimeSel && practiceTimeSel.addEventListener("change", resetTimer);

  $("#btnStartTimer") && $("#btnStartTimer").addEventListener("click", function(){
    stopTimer();
    setTimer(parseInt(practiceTimeSel.value,10) || 45);
    timerId = setInterval(function(){
      remaining -= 1;
      setTimer(Math.max(0, remaining));
      if (remaining <= 0){
        stopTimer();
        // gentle audio cue
        try{
          speak("Time. Please stop and quickly self-check your structure.");
        }catch(e){}
      }
    }, 1000);
  });

  $("#btnResetTimer") && $("#btnResetTimer").addEventListener("click", resetTimer);
  resetTimer();

  // ===== Fluency bank buttons =====
  var fluencyPhrases = [
    "Let me think for a second…",
    "That’s an interesting question.",
    "In general, I’d say…",
    "To be honest, …",
    "In my experience, …",
    "Overall, …",
    "That said, …",
    "For example, …",
    "As a result, …",
    "If I had to choose, …",
    "From my point of view, …",
    "So, to sum up, …"
  ];
  var bankEl = $("#fluencyBank");
  if (bankEl){
    bankEl.innerHTML = "";
    fluencyPhrases.forEach(function(p){
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = p;
      b.addEventListener("click", function(){ speak(p); });
      bankEl.appendChild(b);
    });
  }

  // ===== Vocabulary flashcards =====
  var vocabList = [
    {icon:"🤝", word:"introduce yourself", def:"say who you are and what you do (professionally)"},
    {icon:"🧩", word:"structure", def:"the clear organization of your answer"},
    {icon:"🔗", word:"connector", def:"linking word/phrase (however, overall, as a result…)"},
    {icon:"🧠", word:"in my experience", def:"a phrase to introduce personal examples"},
    {icon:"📌", word:"deadline", def:"the final date/time to finish something"},
    {icon:"📅", word:"reschedule", def:"change the time/date of an appointment"},
    {icon:"🙏", word:"apologize", def:"say sorry politely (I’m sorry to hear that…)"},
    {icon:"🔍", word:"clarify", def:"make something clear with details"},
    {icon:"🧾", word:"refund", def:"money given back after a problem"},
    {icon:"🔁", word:"replacement", def:"a new item sent instead of a damaged one"},
    {icon:"⚠️", word:"risk", def:"a possible problem that could happen"},
    {icon:"🛠️", word:"solution", def:"a way to fix a problem"},
    {icon:"💬", word:"follow-up question", def:"a question you ask back to continue the conversation"},
    {icon:"⏸️", word:"pause", def:"a short silence (can sound natural and confident)"},
    {icon:"🧭", word:"overall", def:"in general; considering everything"},
    {icon:"🚦", word:"on track", def:"progressing as planned"},
  ];

  function renderFlashcards(list){
    var grid = $("#flashGrid");
    if (!grid) return;
    grid.innerHTML = "";

    list.forEach(function(v){
      var card = document.createElement("div");
      card.className = "flash";
      card.tabIndex = 0;

      var inner = document.createElement("div");
      inner.className = "flash__inner";

      var front = document.createElement("div");
      front.className = "flash__face flash__front";
      var icon = document.createElement("div");
      icon.className = "icon";
      icon.textContent = v.icon;
      var word = document.createElement("div");
      word.className = "word";
      word.textContent = v.word;

      var actions = document.createElement("div");
      actions.className = "flash__actions";
      var btnListen = document.createElement("button");
      btnListen.type = "button";
      btnListen.textContent = "🔊 Listen";
      btnListen.addEventListener("click", function(ev){
        ev.stopPropagation();
        speak(v.word);
      });
      actions.appendChild(btnListen);

      front.appendChild(icon);
      front.appendChild(word);
      front.appendChild(actions);

      var back = document.createElement("div");
      back.className = "flash__face flash__back";
      back.innerHTML = "<div><strong>Meaning</strong></div><div style='margin-top:6px'>" + escapeHtml(v.def) + "</div><div class='tiny muted' style='margin-top:10px'>Tap to flip back</div>";

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      function toggle(){ card.classList.toggle("is-flipped"); }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){ e.preventDefault(); toggle(); }
      });

      grid.appendChild(card);
    });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[m];
    });
  }

  renderFlashcards(vocabList);

  $("#btnShuffleVocab") && $("#btnShuffleVocab").addEventListener("click", function(){
    renderFlashcards(shuffle(vocabList));
  });

  // ===== Builder (order blocks) =====
  var builderPointsAwarded = LS.get(STATE_KEY, {}).builderPointsAwarded || 0;

  function getBuilderModelBlocks(){
    // Build blocks from current scenario model in 6 chunks.
    var s = getSelectedScenario();
    var text = s.model.join(" ");
    // Split into sentences (simple)
    var sentences = s.model.slice(); // 3 sentences (already step-based)
    // Expand each step sentence into 2 chunks to make ordering more interesting
    var blocks = [];
    sentences.forEach(function(sent, idx){
      var parts = splitIntoChunks(sent, 2);
      parts.forEach(function(p, pi){
        blocks.push({
          id: "b_" + idx + "_" + pi,
          step: idx+1,
          text: p.trim()
        });
      });
    });
    return { full:text, blocks: blocks };
  }

  function splitIntoChunks(sentence, count){
    var s = String(sentence);
    var words = s.split(/\s+/).filter(Boolean);
    if (words.length < 10 || count <= 1) return [s];

    var mid = Math.floor(words.length / count);
    var out = [];
    var start = 0;
    for (var i=0;i<count;i++){
      var end = (i === count-1) ? words.length : (start + mid);
      out.push(words.slice(start,end).join(" "));
      start = end;
    }
    return out;
  }

  function initBuilder(forceReset){
    var model = getBuilderModelBlocks();
    var pool = $("#blockPool");
    var lane = $("#answerLane");
    var feedback = $("#builderFeedback");
    if (!pool || !lane || !feedback) return;

    var state = LS.get(STATE_KEY, {});
    var saved = state.builder || null;

    // If scenario changed, reset builder automatically (unless lane matches current IDs)
    var currentIds = model.blocks.map(function(b){ return b.id; }).sort().join("|");
    var savedIds = saved && saved.pool ? saved.pool.concat(saved.lane||[]).map(function(b){return b.id;}).sort().join("|") : "";
    var scenarioChanged = currentIds !== savedIds;

    if (forceReset || !saved || scenarioChanged){
      saved = {
        full: model.full,
        correctOrder: model.blocks.map(function(b){ return b.id; }),
        pool: shuffle(model.blocks),
        lane: []
      };
    }else{
      // ensure correctOrder matches current model
      saved.correctOrder = model.blocks.map(function(b){ return b.id; });
      saved.full = model.full;
    }

    // render pool
    pool.innerHTML = "";
    saved.pool.forEach(function(b){ pool.appendChild(renderPoolBlock(b, saved)); });

    // render lane
    lane.innerHTML = "";
    saved.lane.forEach(function(b){ lane.appendChild(renderLaneItem(b, saved)); });

    // feedback reset
    feedback.className = "feedback";
    feedback.textContent = "Build your answer by selecting blocks in order (Step 1 → Step 2 → Step 3).";

    // persist
    state.builder = saved;
    LS.set(STATE_KEY, state);

    // listen full model
    $("#btnBuilderListenFull") && ($("#btnBuilderListenFull").onclick = function(){
      speak(saved.full);
    });
  }

  function renderPoolBlock(block, saved){
    var el = document.createElement("div");
    el.className = "block";
    el.setAttribute("draggable", "true");

    var left = document.createElement("div");
    left.className = "block__left";

    var txt = document.createElement("div");
    txt.className = "block__text";
    txt.textContent = block.text;

    var meta = document.createElement("div");
    meta.className = "block__meta";
    meta.textContent = "Step " + block.step;

    left.appendChild(txt);
    left.appendChild(meta);

    var btns = document.createElement("div");
    btns.className = "block__btns";

    var addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "➕ Add";
    addBtn.addEventListener("click", function(){
      movePoolToLane(block.id);
    });

    var listenBtn = document.createElement("button");
    listenBtn.type = "button";
    listenBtn.textContent = "🔊 Listen";
    listenBtn.addEventListener("click", function(){
      speak(block.text);
    });

    btns.appendChild(addBtn);
    btns.appendChild(listenBtn);

    el.appendChild(left);
    el.appendChild(btns);

    // drag events (desktop mostly)
    el.addEventListener("dragstart", function(e){
      try{
        e.dataTransfer.setData("text/plain", block.id);
        e.dataTransfer.effectAllowed = "move";
      }catch(err){}
    });

    return el;
  }

  function renderLaneItem(block, saved){
    var li = document.createElement("li");
    li.className = "answeritem";
    li.setAttribute("data-id", block.id);

    var txt = document.createElement("div");
    txt.className = "answeritem__text";
    txt.textContent = block.text;

    var btns = document.createElement("div");
    btns.className = "answeritem__btns";

    var up = document.createElement("button");
    up.type = "button";
    up.textContent = "↑";
    up.title = "Move up";
    up.addEventListener("click", function(){ moveInLane(block.id, -1); });

    var down = document.createElement("button");
    down.type = "button";
    down.textContent = "↓";
    down.title = "Move down";
    down.addEventListener("click", function(){ moveInLane(block.id, +1); });

    var remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "✖";
    remove.title = "Remove";
    remove.addEventListener("click", function(){ moveLaneToPool(block.id); });

    btns.appendChild(up);
    btns.appendChild(down);
    btns.appendChild(remove);

    li.appendChild(txt);
    li.appendChild(btns);

    // allow dropping into lane (desktop)
    li.addEventListener("dragover", function(e){ e.preventDefault(); });
    li.addEventListener("drop", function(e){
      e.preventDefault();
      var id = "";
      try{ id = e.dataTransfer.getData("text/plain"); }catch(err){}
      if (id) dropIntoLaneBefore(id, block.id);
    });

    return li;
  }

  function getBuilderState(){
    var state = LS.get(STATE_KEY, {});
    return state.builder;
  }
  function saveBuilderState(builder){
    var state = LS.get(STATE_KEY, {});
    state.builder = builder;
    LS.set(STATE_KEY, state);
  }

  function movePoolToLane(id){
    var b = getBuilderState();
    if (!b) return;
    var idx = b.pool.findIndex(function(x){ return x.id === id; });
    if (idx < 0) return;
    var item = b.pool.splice(idx,1)[0];
    b.lane.push(item);
    saveBuilderState(b);
    initBuilder(false);
  }

  function moveLaneToPool(id){
    var b = getBuilderState();
    if (!b) return;
    var idx = b.lane.findIndex(function(x){ return x.id === id; });
    if (idx < 0) return;
    var item = b.lane.splice(idx,1)[0];
    b.pool.push(item);
    saveBuilderState(b);
    initBuilder(false);
  }

  function moveInLane(id, delta){
    var b = getBuilderState();
    if (!b) return;
    var idx = b.lane.findIndex(function(x){ return x.id === id; });
    if (idx < 0) return;
    var newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= b.lane.length) return;
    var tmp = b.lane[idx];
    b.lane[idx] = b.lane[newIdx];
    b.lane[newIdx] = tmp;
    saveBuilderState(b);
    initBuilder(false);
  }

  function dropIntoLaneBefore(dragId, beforeId){
    // Only supports dragging blocks from pool to lane.
    var b = getBuilderState();
    if (!b) return;

    // If dragId is in pool, move; if in lane, reorder.
    var fromPoolIdx = b.pool.findIndex(function(x){ return x.id === dragId; });
    var fromLaneIdx = b.lane.findIndex(function(x){ return x.id === dragId; });
    var beforeIdx = b.lane.findIndex(function(x){ return x.id === beforeId; });
    if (beforeIdx < 0) return;

    var item = null;
    if (fromPoolIdx >= 0){
      item = b.pool.splice(fromPoolIdx,1)[0];
    }else if (fromLaneIdx >= 0){
      item = b.lane.splice(fromLaneIdx,1)[0];
      // adjust beforeIdx if removed earlier
      beforeIdx = b.lane.findIndex(function(x){ return x.id === beforeId; });
      if (beforeIdx < 0) beforeIdx = b.lane.length;
    }else{
      return;
    }

    b.lane.splice(beforeIdx, 0, item);
    saveBuilderState(b);
    initBuilder(false);
  }

  // Allow dropping into empty lane
  var answerLane = $("#answerLane");
  answerLane && answerLane.addEventListener("dragover", function(e){ e.preventDefault(); });
  answerLane && answerLane.addEventListener("drop", function(e){
    e.preventDefault();
    var id = "";
    try{ id = e.dataTransfer.getData("text/plain"); }catch(err){}
    if (!id) return;
    // if lane empty, just add
    movePoolToLane(id);
  });

  $("#btnResetBuilder") && $("#btnResetBuilder").addEventListener("click", function(){
    initBuilder(true);
    // do not remove points already earned
    var fb = $("#builderFeedback");
    fb.className = "feedback";
    fb.textContent = "Builder reset. Try again with the correct structure.";
  });

  $("#btnCheckBuilder") && $("#btnCheckBuilder").addEventListener("click", function(){
    var b = getBuilderState();
    var fb = $("#builderFeedback");
    if (!b || !fb) return;

    if (b.lane.length !== b.correctOrder.length){
      fb.className = "feedback warn";
      fb.textContent = "Not finished yet: please add all blocks (tap ➕ Add) before checking.";
      return;
    }

    var correct = 0;
    for (var i=0;i<b.correctOrder.length;i++){
      if (b.lane[i].id === b.correctOrder[i]) correct++;
    }

    var points = Math.round((correct / b.correctOrder.length) * 10);
    var msg = "You placed " + correct + " / " + b.correctOrder.length + " blocks in the correct position. ";

    // Award points only the first time per scenario attempt (prevent farming)
    var state = LS.get(STATE_KEY, {});
    var prevPoints = state.builderPointsAwarded || 0;

    if (prevPoints === 0){
      addScore(points);
      state.builderPointsAwarded = 1;
      LS.set(STATE_KEY, state);
      fb.className = points >= 8 ? "feedback good" : (points >= 5 ? "feedback warn" : "feedback bad");
      fb.textContent = msg + "Score: +" + points + " points.";
    }else{
      fb.className = points >= 8 ? "feedback good" : (points >= 5 ? "feedback warn" : "feedback bad");
      fb.textContent = msg + "Score shown (points already awarded for this exercise).";
    }

    if (points < 8){
      fb.textContent += " Hint: Step 1 must be a direct answer. Step 3 must close politely.";
    }
  });

  initBuilder(false);

  // When scenario changes, allow points again by resetting award state
  if (scenarioSelect){
    scenarioSelect.addEventListener("change", function(){
      var state = LS.get(STATE_KEY, {});
      state.builderPointsAwarded = 0;
      LS.set(STATE_KEY, state);
      initBuilder(true);
      $("#builderFeedback").className = "feedback";
      $("#builderFeedback").textContent = "New scenario selected. Build the answer in a fluent order.";
    });
  }

  // ===== Fill-in-the-blanks (dropdown) =====
  function initBlanks(forceReset){
    var blankTextEl = $("#blankText");
    if (!blankTextEl) return;

    var state = LS.get(STATE_KEY, {});
    var saved = state.blanks;

    var exercise = getBlankExercise();
    if (forceReset || !saved){
      saved = {
        chosen: Array(exercise.items.length).fill(""),
        pointsAwarded: 0
      };
    }

    // render
    blankTextEl.innerHTML = "";
    for (var i=0;i<exercise.parts.length;i++){
      var part = exercise.parts[i];
      if (typeof part === "string"){
        blankTextEl.appendChild(document.createTextNode(part));
      }else{
        // dropdown
        var sel = document.createElement("select");
        sel.setAttribute("data-idx", String(part.idx));
        var opt0 = document.createElement("option");
        opt0.value = "";
        opt0.textContent = "—";
        sel.appendChild(opt0);

        part.options.forEach(function(o){
          var op = document.createElement("option");
          op.value = o;
          op.textContent = o;
          sel.appendChild(op);
        });

        sel.value = saved.chosen[part.idx] || "";
        sel.addEventListener("change", function(){
          var idx = parseInt(this.getAttribute("data-idx"),10);
          saved.chosen[idx] = this.value;
          state.blanks = saved;
          LS.set(STATE_KEY, state);
        });

        blankTextEl.appendChild(sel);
      }
    }

    // feedback
    var fb = $("#blanksFeedback");
    fb.className = "feedback";
    fb.textContent = "Fill the dropdowns with natural interview language. Then click Check.";
    state.blanks = saved;
    LS.set(STATE_KEY, state);
  }

  function getBlankExercise(){
    // Parts is a sequence of strings and dropdown descriptors {idx, options}
    // items contains correct answers.
    var items = [
      {correct:"Let me think for a second", options:["Let me think for a second","I don't know","I hate that question"]},
      {correct:"overall", options:["overall","yesterday","carefully"]},
      {correct:"because", options:["because","but","before"]},
      {correct:"for example", options:["for example","on the other hand","in the end"]},
      {correct:"as a result", options:["as a result","in the bathroom","at the weekend"]},
      {correct:"Would you like me to", options:["Would you like me to","I demand you to","You must to"]},
      {correct:"follow up", options:["follow up","fight up","fill up"]}
    ];

    var parts = [
      "Interviewer: Could you tell me about a recent professional challenge?\n\nYou: ",
      {idx:0, options: items[0].options},
      "… ",
      " ",
      {idx:1, options: items[1].options},
      ", I faced a small issue with a deadline ",
      {idx:2, options: items[2].options},
      " a supplier delivered later than expected. ",
      {idx:3, options: items[3].options},
      ", I contacted them, clarified the new delivery date, and informed my team. ",
      {idx:4, options: items[4].options},
      ", we adjusted the schedule and avoided delays. ",
      {idx:5, options: items[5].options},
      " explain how I would ",
      {idx:6, options: items[6].options},
      " this with an email as well?"
    ];

    return {items: items, parts: parts};
  }

  function checkBlanks(){
    var ex = getBlankExercise();
    var state = LS.get(STATE_KEY, {});
    var saved = state.blanks;
    if (!saved) return;

    var chosen = saved.chosen || [];
    var correctCount = 0;
    for (var i=0;i<ex.items.length;i++){
      if ((chosen[i] || "").trim().toLowerCase() === ex.items[i].correct.toLowerCase()){
        correctCount++;
      }
    }
    var points = Math.round((correctCount / ex.items.length) * 10);
    var fb = $("#blanksFeedback");

    if (correctCount < ex.items.length){
      fb.className = points >= 8 ? "feedback warn" : "feedback bad";
      fb.textContent = "Correct: " + correctCount + " / " + ex.items.length + ". Score: " + points + " / 10. Hint: aim for natural interview phrases.";
    }else{
      fb.className = "feedback good";
      fb.textContent = "Perfect! " + correctCount + " / " + ex.items.length + ". Score: 10 / 10.";
    }

    if (!saved.pointsAwarded){
      addScore(points);
      saved.pointsAwarded = 1;
      state.blanks = saved;
      LS.set(STATE_KEY, state);
      fb.textContent += " (Points added to global score.)";
    }else{
      fb.textContent += " (Points already awarded.)";
    }
  }

  function resetBlanks(){
    var state = LS.get(STATE_KEY, {});
    state.blanks = null;
    LS.set(STATE_KEY, state);
    initBlanks(true);
  }

  $("#btnCheckBlanks") && $("#btnCheckBlanks").addEventListener("click", checkBlanks);
  $("#btnResetBlanks") && $("#btnResetBlanks").addEventListener("click", resetBlanks);
  $("#btnListenBlanks") && $("#btnListenBlanks").addEventListener("click", function(){
    var ex = getBlankExercise();
    // speak with chosen where available, otherwise speak correct.
    var state = LS.get(STATE_KEY, {});
    var saved = state.blanks || {chosen:[]};
    var chosen = saved.chosen || [];
    var full = "";
    for (var i=0;i<ex.parts.length;i++){
      var p = ex.parts[i];
      if (typeof p === "string"){
        full += p;
      }else{
        var c = chosen[p.idx] ? chosen[p.idx] : ex.items[p.idx].correct;
        full += c;
      }
    }
    speak(full);
  });

  initBlanks(false);

  // ===== Checklist + Notes =====
  var checklistItems = [
    {t:"I answered directly in the first sentence.", d:"No long intro — clear answer immediately."},
    {t:"I gave 2 supporting details.", d:"Reason, frequency, preference, or context."},
    {t:"I used 2–3 connectors.", d:"Overall, however, for example, as a result…"},
    {t:"I included one concrete example.", d:"A short real situation makes you sound fluent."},
    {t:"I used polite language.", d:"Could / would / I’m sorry / Would you like me to…"},
    {t:"I closed my answer politely.", d:"Short ending + (optional) question back."},
    {t:"My speed was calm.", d:"A pause is fine. Panic is not."},
    {t:"My pronunciation was clear.", d:"Focus on key words, not perfection."}
  ];

  function initChecklist(forceReset){
    var grid = $("#checkGrid");
    if (!grid) return;
    var state = LS.get(STATE_KEY, {});
    var saved = state.checklist;
    if (forceReset || !saved){
      saved = checklistItems.map(function(){ return false; });
    }

    grid.innerHTML = "";
    checklistItems.forEach(function(item, idx){
      var row = document.createElement("label");
      row.className = "check";

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!saved[idx];
      cb.addEventListener("change", function(){
        saved[idx] = cb.checked;
        state.checklist = saved;
        LS.set(STATE_KEY, state);
      });

      var box = document.createElement("div");
      var t = document.createElement("div");
      t.className = "t";
      t.textContent = item.t;
      var d = document.createElement("div");
      d.className = "d";
      d.textContent = item.d;

      box.appendChild(t);
      box.appendChild(d);

      row.appendChild(cb);
      row.appendChild(box);

      grid.appendChild(row);
    });

    state.checklist = saved;
    LS.set(STATE_KEY, state);
  }

  initChecklist(false);

  // Notes
  var notesKey = "se_oral_notes_v1";
  var notesBox = $("#notesBox");
  if (notesBox){
    notesBox.value = LS.get(notesKey, "");
    notesBox.addEventListener("input", function(){
      LS.set(notesKey, notesBox.value);
    });
  }

  $("#btnExportNotes") && $("#btnExportNotes").addEventListener("click", function(){
    var s = getSelectedScenario();
    var state = LS.get(STATE_KEY, {});
    var checklist = state.checklist || [];
    var lines = [];
    lines.push("SpeakEasyTisha — CLOE Oral Trainer Notes");
    lines.push("Scenario: " + s.title);
    lines.push("Question: " + s.question);
    lines.push("");
    lines.push("Model answer (3 steps):");
    lines.push(s.model.join(" "));
    lines.push("");
    lines.push("Checklist:");
    checklistItems.forEach(function(it, i){
      lines.push((checklist[i] ? "[x] " : "[ ] ") + it.t);
    });
    lines.push("");
    lines.push("My notes:");
    lines.push((notesBox && notesBox.value) ? notesBox.value : "");

    var text = lines.join("\n");
    copyToClipboard(text);
  });

  function copyToClipboard(text){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){
        alert("Copied!");
      }).catch(function(){
        fallbackCopy(text);
      });
    }else{
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text){
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try{
      document.execCommand("copy");
      alert("Copied!");
    }catch(e){
      alert("Copy failed. You can manually select the notes in the box and copy.");
    }
    document.body.removeChild(ta);
  }

})();