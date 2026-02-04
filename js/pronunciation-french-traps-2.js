/* SpeakEasyTisha — Pronunciation Masterclass 2 (Native Flow) — 60 min
   Focus: R/L, H (silent/pronounced), silent letters, word stress, connected speech (linking + reductions),
   plus phrase builder + shadowing + final mission.
   Touch-friendly: drag OR tap-to-move chips.
*/
(function(){
  "use strict";

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c];
    });
  }
  function norm(s){ return String(s||"").trim().toLowerCase().replace(/\s+/g," "); }
  function shuffle(arr){
    var a = arr.slice();
    for (var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function choice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  /* -------------------- Speech (TTS) -------------------- */
  var speech = { accent:"en-US", rate:1.0, voice:null, voices:[] };

  function loadVoices(){
    var vs = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    speech.voices = vs || [];
    pickVoice();
  }
  function pickVoice(){
    if (!window.speechSynthesis) return;
    var lang = speech.accent;
    var vs = speech.voices || window.speechSynthesis.getVoices() || [];
    var best = null, i;
    for (i=0;i<vs.length;i++){ if (vs[i].lang === lang){ best = vs[i]; break; } }
    if (!best){ for (i=0;i<vs.length;i++){ if ((vs[i].lang||"").indexOf(lang) === 0){ best = vs[i]; break; } } }
    if (!best){ for (i=0;i<vs.length;i++){ if ((vs[i].lang||"").indexOf("en") === 0){ best = vs[i]; break; } } }
    speech.voice = best || null;
  }
  function stopSpeak(){ if (window.speechSynthesis) window.speechSynthesis.cancel(); }
  function speakText(text){
    if (!window.speechSynthesis) return;
    stopSpeak();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = speech.accent;
    u.rate = speech.rate;
    if (speech.voice) u.voice = speech.voice;
    window.speechSynthesis.speak(u);
  }

  /* -------------------- Score -------------------- */
  var scoreNow = 0, scoreMax = 0;
  function addAttempt(ok){
    scoreMax += 1;
    if (ok) scoreNow += 1;
    $("scoreNow").textContent = String(scoreNow);
    $("scoreMax").textContent = String(scoreMax);
  }

  /* -------------------- Timer -------------------- */
  var timer = { total:3600, left:3600, t:null, running:false };
  function fmtTime(sec){
    var m = Math.floor(sec/60), s = sec % 60;
    return String(m) + ":" + (s<10 ? "0"+s : String(s));
  }
  function renderTimer(){ $("timerText").textContent = fmtTime(timer.left); }
  function stopTimer(){
    timer.running = false;
    if (timer.t) clearInterval(timer.t);
    timer.t = null;
    renderTimer();
  }
  function setTimer(seconds){
    stopTimer();
    timer.total = seconds;
    timer.left = seconds;
    renderTimer();
    timer.running = true;
    timer.t = setInterval(function(){
      timer.left -= 1;
      if (timer.left <= 0){ timer.left = 0; stopTimer(); }
      renderTimer();
    }, 1000);
  }
  function resetTimer(){
    stopTimer();
    timer.left = timer.total;
    renderTimer();
  }

  /* -------------------- data-say buttons -------------------- */
  function wireSayButtons(){
    document.addEventListener("click", function(e){
      var el = e.target;
      if (el && el.getAttribute && el.getAttribute("data-say")){
        speakText(el.getAttribute("data-say"));
      }
    });
  }

  /* ===================== DATA ===================== */

  // Warm-up (listen + choose)
  var WARMUP = [
    { title:"R vs L", prompt:"What did you hear?", say:"right", hint:"R: tongue does NOT touch. L: tongue touches.", correct:0, choices:["right","light","write"] },
    { title:"R vs L", prompt:"What did you hear?", say:"glass", hint:"L is clear: tongue up. Not ‘grass’.", correct:1, choices:["grass","glass","class"] },
    { title:"H pronounced", prompt:"What did you hear?", say:"hotel", hint:"hotel has a real /h/ sound.", correct:2, choices:["otel","'otel","hotel"] },
    { title:"H silent", prompt:"What did you hear?", say:"hour", hint:"hour starts like “our” (silent h).", correct:0, choices:["hour","how","house"] },
    { title:"Silent W (wr-)", prompt:"What did you hear?", say:"write", hint:"write = /raɪt/ (silent w).", correct:2, choices:["wait","white","write"] }
  ];

  // Flashcards
  var FLASH = [
    { tag:"rl", front:"R vs L (position)", back:"R: tongue does NOT touch, lips slightly rounded.\nL: tongue tip touches behind upper teeth.\nPractice: right/light, glass/grass, led/red.", say:"right. light. glass. grass. led. red." },
    { tag:"rl", front:"R clusters (hard)", back:"Try: tree, train, free, price.\nKeep tongue off the teeth.", say:"tree. train. free. price." },

    { tag:"h", front:"H pronounced", back:"hotel, history, help, ahead.\nFeel air on your hand.", say:"hotel. history. help. ahead." },
    { tag:"h", front:"H silent (common)", back:"hour, honest, heir, honor.\nUse ‘an’ because it starts with a vowel SOUND.", say:"an hour. an honest mistake. an heir." },

    { tag:"silent", front:"Silent letters: kn-/wr-", back:"know, knife, knee (silent k)\nwrite, wrong, wrap (silent w)", say:"know. knife. knee. write. wrong. wrap." },
    { tag:"silent", front:"Silent letters: b/t/gh", back:"doubt, thumb, comb (silent b)\nlisten, castle, often (silent t)\nthough/night/light (silent gh)", say:"doubt. thumb. comb. listen. castle. often. though. night. light." },

    { tag:"stress", front:"Word stress changes sound", back:"PHOtograph / phoTOgraphy / phoTOgrapher\ninforMAtion, eLECtric\nUnstressed vowels → /ə/ (schwa).", say:"PHOtograph. phoTOgraphy. phoTOgrapher. inforMAtion. eLECtric." },

    { tag:"connected", front:"Linking (smooth)", back:"pick it up → pick-it-up\nput it on → put-it-on\nnext day → nex(t)day", say:"Pick it up. Put it on. Next day." },
    { tag:"connected", front:"Reductions (casual)", back:"going to → gonna\nwant to → wanna\ndid you → didja\ncould you → couldja\ngot to → gotta", say:"I'm gonna head out. Do you wanna go? Didja eat yet? Couldja help me? I gotta go." }
  ];

  // R/L QCM
  var RLQ = [
    { title:"R vs L", prompt:"Choose the word you heard.", say:"light", hint:"L: tongue touches. R: tongue off.", correct:1, choices:["right","light","write"] },
    { title:"R vs L", prompt:"Choose the word you heard.", say:"glass", hint:"L is clear: g + l.", correct:2, choices:["grass","class","glass"] },
    { title:"R vs L", prompt:"Choose the word you heard.", say:"really", hint:"R: lips slightly rounded.", correct:0, choices:["really","lely","lily"] },
    { title:"R vs L", prompt:"Choose the word you heard.", say:"flight", hint:"fl- begins with f + l.", correct:2, choices:["fright","right","flight"] }
  ];

  var RLPROMPTS = [
    "Turn right at the light.",
    "I really like this place.",
    "I’ll call later — no problem.",
    "Please relax. It’s all right.",
    "That’s a really long line."
  ];

  // H QCM
  var HQ = [
    { title:"H sound", prompt:"Choose the word you heard.", say:"hotel", hint:"hotel has a real /h/.", correct:1, choices:["'otel","hotel","o-tel"] },
    { title:"Silent H", prompt:"Choose the word you heard.", say:"honest", hint:"honest starts like “onest”.", correct:0, choices:["honest","hot","host"] },
    { title:"Silent H", prompt:"Choose the word you heard.", say:"hour", hint:"hour = ‘our’.", correct:2, choices:["how","house","hour"] }
  ];

  // a/an fill for H-words
  var HAN = [
    { sentence:"I’ll be there in ____ hour.", answer:"an", say:"I'll be there in an hour.", hint:"hour starts with a vowel SOUND." },
    { sentence:"That was ____ honest mistake.", answer:"an", say:"That was an honest mistake.", hint:"honest starts with a vowel SOUND." },
    { sentence:"Let’s book ____ hotel near the airport.", answer:"a", say:"Let's book a hotel near the airport.", hint:"hotel starts with /h/ (consonant sound)." },
    { sentence:"She’s ____ heir to the company.", answer:"an", say:"She's an heir to the company.", hint:"heir starts with a vowel SOUND." },
    { sentence:"It’s ____ huge help — thanks!", answer:"a", say:"It's a huge help — thanks!", hint:"huge starts with /h/ (consonant sound)." }
  ];

  // Silent letters sorting
  var SLSETS = [
    {
      hint:"kn- : silent k. wr- : silent w. mb/bt : silent b. often/listen: silent t. gh: silent or changes sound.",
      words:[
        { w:"know", cat:"K" }, { w:"knife", cat:"K" }, { w:"knee", cat:"K" },
        { w:"write", cat:"W" }, { w:"wrong", cat:"W" }, { w:"wrap", cat:"W" },
        { w:"doubt", cat:"B" }, { w:"thumb", cat:"B" }, { w:"comb", cat:"B" },
        { w:"listen", cat:"T" }, { w:"castle", cat:"T" }, { w:"often", cat:"T" },
        { w:"though", cat:"GH" }, { w:"night", cat:"GH" }, { w:"light", cat:"GH" }
      ]
    },
    {
      hint:"Same rules. Tip: speak the word slowly, but don’t pronounce the ghost letter.",
      words:[
        { w:"knock", cat:"K" }, { w:"knit", cat:"K" }, { w:"kneel", cat:"K" },
        { w:"wrist", cat:"W" }, { w:"wrinkle", cat:"W" }, { w:"wrote", cat:"W" },
        { w:"debt", cat:"B" }, { w:"lamb", cat:"B" }, { w:"climb", cat:"B" },
        { w:"fasten", cat:"T" }, { w:"whistle", cat:"T" }, { w:"Christmas", cat:"T" },
        { w:"eight", cat:"GH" }, { w:"sight", cat:"GH" }, { w:"thought", cat:"GH" }
      ]
    }
  ];

  // Stress QCM (word + choose stress-marked version)
  var STQ = [
    { word:"photograph", say:"photograph", hint:"Stress on the first syllable.", correct:0,
      choices:["PHOtograph","phoTOgraph","photoGRAPH"] },
    { word:"photography", say:"photography", hint:"Stress shifts: phoTOgraphy.", correct:1,
      choices:["PHOtography","phoTOgraphy","photoGRAphy"] },
    { word:"photographer", say:"photographer", hint:"Stress: phoTOgrapher.", correct:2,
      choices:["PHOtographer","photoGRApher","phoTOgrapher"] },
    { word:"information", say:"information", hint:"Stress: inforMAtion.", correct:1,
      choices:["INformation","inforMAtion","informaTION"] },
    { word:"electric", say:"electric", hint:"Stress: eLECtric.", correct:0,
      choices:["eLECtric","ELECtric","elecTRIC"] }
  ];

  // Phrase builder (stress/rhythm)
  var PB = [
    { target:"I really like that hotel.",
      say:"I really like that hotel.",
      hint:"R/L + clear H in hotel. Stress on LIKE and HO-.",
      words:["I","really","like","that","hotel"] },
    { target:"Could you help me for an hour?",
      say:"Could you help me for an hour?",
      hint:"Linking: could-you, help-me. ‘an hour’ (silent H).",
      words:["Could","you","help","me","for","an","hour"] },
    { target:"I gotta go — I’m running late.",
      say:"I gotta go — I’m running late.",
      hint:"Reductions: gotta. Stress on GO, RUN-, LATE.",
      words:["I","gotta","go","—","I’m","running","late"] }
  ];

  // Connected speech QCM
  var CSQ = [
    {
      title:"Linking",
      prompt:"Choose the most natural spoken version.",
      say:"Pick it up for me.",
      hint:"Consonant + vowel: pick-it-up.",
      correct:1,
      choices:["Pick it up (separate)","Pick-it-up (linked)","Pick eeet up (French vowel)"]
    },
    {
      title:"Reduction",
      prompt:"Choose the most natural spoken version.",
      say:"Do you wanna go?",
      hint:"want to → wanna.",
      correct:2,
      choices:["Do you want to go? (very careful)","Do you wont to go? (wrong)","Do you wanna go? (natural)"]
    },
    {
      title:"Reduction",
      prompt:"Choose the most natural spoken version.",
      say:"Did you eat yet?",
      hint:"did you → didja.",
      correct:1,
      choices:["Did you eat yet? (very careful)","Didja eat yet? (natural)","Did youu eat yete? (wrong)"]
    },
    {
      title:"Reduction",
      prompt:"Choose the most natural spoken version.",
      say:"Could you help me?",
      hint:"could you → couldja.",
      correct:0,
      choices:["Couldja help me? (natural)","Could you help me? (very careful)","Could youu help me? (wrong)"]
    }
  ];

  // Connected speech fill-in (type reduced form)
  var CF = [
    { sentence:"I’m ____ head out. (going to)", answer:"gonna", say:"I'm gonna head out.", hint:"going to → gonna" },
    { sentence:"Do you ____ grab coffee? (want to)", answer:"wanna", say:"Do you wanna grab coffee?", hint:"want to → wanna" },
    { sentence:"____ eat yet? (did you)", answer:"didja", say:"Didja eat yet?", hint:"did you → didja" },
    { sentence:"____ help me? (could you)", answer:"couldja", say:"Couldja help me?", hint:"could you → couldja" },
    { sentence:"I ____ go. (got to)", answer:"gotta", say:"I gotta go.", hint:"got to → gotta" }
  ];

  // Shadowing sets
  var SHSETS = [
    [
      "I’m gonna head out in a minute.",
      "Couldja help me with this real quick?",
      "Didja eat yet, or are you still hungry?",
      "Pick it up and put it on the counter."
    ],
    [
      "Turn right at the next light.",
      "We’ll be there in an hour.",
      "That’s a really long line.",
      "I gotta go — I’m running late."
    ]
  ];

  var CHEAT = [
    { title:"R vs L", items:[
      "R: tongue does NOT touch, lips slightly rounded (right, really)",
      "L: tongue touches behind upper teeth (light, little)",
      "Minimal pairs: right/light, glass/grass"
    ]},
    { title:"H + a/an", items:[
      "H pronounced: hotel, help, history",
      "H silent: hour, honest, heir → use ‘an’",
      "Rule: a/an depends on SOUND, not letter"
    ]},
    { title:"Silent letters", items:[
      "kn-: know, knife (silent k)",
      "wr-: write, wrong (silent w)",
      "doubt/comb/thumb (silent b)",
      "listen/castle/often (silent t)"
    ]},
    { title:"Stress + connected speech", items:[
      "PHOtograph / phoTOgraphy / phoTOgrapher",
      "Linking: pick-it-up, put-it-on",
      "Reductions: gonna, wanna, didja, couldja, gotta"
    ]}
  ];

  /* ===================== UI helpers (choices) ===================== */
  function renderChoices(containerId, choices, correctIndex, onPick){
    var box = $(containerId);
    box.innerHTML = "";
    for (var i=0;i<choices.length;i++){
      (function(idx){
        var b = document.createElement("button");
        b.className = "choice";
        b.type = "button";
        b.textContent = choices[idx];
        b.addEventListener("click", function(){
          var ok = (idx === correctIndex);
          addAttempt(ok);

          var btns = box.querySelectorAll(".choice");
          for (var k=0;k<btns.length;k++){
            btns[k].disabled = true;
            if (k === correctIndex) btns[k].classList.add("correct");
          }
          b.classList.add(ok ? "correct" : "wrong");
          if (onPick) onPick(ok, idx);
        });
        box.appendChild(b);
      })(i);
    }
  }

  /* ===================== Tap + Drag chips ===================== */
  var tap = { chip:null };

  function makeChip(text, meta){
    var d = document.createElement("div");
    d.className = "chip";
    d.textContent = text;
    d.setAttribute("draggable","true");
    d.dataset.chipid = "c" + Math.random().toString(16).slice(2);
    if (meta){
      for (var k in meta){
        if (Object.prototype.hasOwnProperty.call(meta,k)) d.dataset[k] = meta[k];
      }
    }

    d.addEventListener("dragstart", function(e){
      e.dataTransfer.setData("app/chipId", d.dataset.chipid);
      setTimeout(function(){ d.classList.add("is-selected"); }, 0);
    });
    d.addEventListener("dragend", function(){ d.classList.remove("is-selected"); });

    d.addEventListener("click", function(){
      if (tap.chip === d){
        d.classList.remove("is-selected");
        tap.chip = null;
      } else {
        if (tap.chip) tap.chip.classList.remove("is-selected");
        tap.chip = d;
        d.classList.add("is-selected");
      }
    });

    return d;
  }

  function wireDropzone(zone){
    zone.addEventListener("dragover", function(e){ e.preventDefault(); zone.classList.add("is-over"); });
    zone.addEventListener("dragleave", function(){ zone.classList.remove("is-over"); });
    zone.addEventListener("drop", function(e){
      e.preventDefault();
      zone.classList.remove("is-over");
      var id = e.dataTransfer.getData("app/chipId");
      if (!id) return;
      var chip = document.querySelector('[data-chipid="'+id+'"]');
      if (chip) zone.appendChild(chip);
    });
    zone.addEventListener("click", function(){
      if (tap.chip){
        zone.appendChild(tap.chip);
        tap.chip.classList.remove("is-selected");
        tap.chip = null;
      }
    });
  }

  function resetChips(bankId, chips, zones){
    $(bankId).innerHTML = "";
    for (var z=0; z<zones.length; z++) $(zones[z]).innerHTML = "";
    tap.chip = null;
    for (var i=0;i<chips.length;i++){
      $(bankId).appendChild(makeChip(chips[i].w || chips[i], { cat: chips[i].cat || "" }));
    }
  }

  function checkZones(zones){ // [{zoneId, cat}]
    var correct = 0, total = 0;
    for (var i=0;i<zones.length;i++){
      var els = $(zones[i].zoneId).querySelectorAll(".chip");
      for (var k=0;k<els.length;k++){
        total++;
        if (els[k].dataset.cat === zones[i].cat) correct++;
      }
    }
    return { correct:correct, total:total, ok:(total>0 && correct===total) };
  }

  /* ===================== Warm-up ===================== */
  var wCur = null;
  function newWarmup(){
    wCur = choice(WARMUP);
    $("wTitle").textContent = wCur.title;
    $("wPrompt").textContent = wCur.prompt;
    $("wHint").textContent = "";
    $("wFeedback").textContent = ""; $("wFeedback").className = "feedback";

    renderChoices("wChoices", wCur.choices, wCur.correct, function(ok){
      $("wFeedback").textContent = ok ? "✅ Nice! Repeat it twice." : "❌ Listen again and exaggerate the mouth position.";
      $("wFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenWarmup(){ if (wCur) speakText(wCur.say); }
  function hintWarmup(){ if (wCur) $("wHint").textContent = wCur.hint; }

  /* ===================== Flashcards ===================== */
  function renderFlashcards(tag){
    var data = tag ? FLASH.filter(function(x){ return x.tag === tag; }) : FLASH.slice();
    data = shuffle(data);

    var box = $("fcGrid");
    box.innerHTML = "";
    data.forEach(function(card){
      var wrap = document.createElement("div");
      wrap.className = "flashcard";
      wrap.tabIndex = 0;

      var inner = document.createElement("div");
      inner.className = "flashcard__inner";

      var front = document.createElement("div");
      front.className = "flashface";
      front.innerHTML =
        '<div class="flashTitle">'+esc(card.front)+'</div>' +
        '<div class="flashText">Tap to flip • Listen → repeat 2×</div>' +
        '<div class="flashActions">' +
          '<button class="btn btn--ghost" type="button" data-fcsay="'+esc(card.say)+'">Listen</button>' +
          '<span class="tiny muted">'+esc(card.tag)+'</span>' +
        '</div>';

      var back = document.createElement("div");
      back.className = "flashface flashface--back";
      back.innerHTML =
        '<div class="flashTitle">FR tip + examples</div>' +
        '<div class="flashText">'+esc(card.back).replace(/\n/g,"<br>")+'</div>' +
        '<div class="flashActions">' +
          '<button class="btn" type="button" data-fcsay="'+esc(card.say)+'">Listen</button>' +
          '<span class="tiny muted">Make 1 travel sentence</span>' +
        '</div>';

      inner.appendChild(front);
      inner.appendChild(back);
      wrap.appendChild(inner);

      function toggle(){ wrap.classList.toggle("is-flipped"); }

      wrap.addEventListener("click", function(ev){
        var t = ev.target;
        if (t && t.getAttribute && t.getAttribute("data-fcsay")){
          speakText(t.getAttribute("data-fcsay"));
          ev.stopPropagation();
          return;
        }
        toggle();
      });
      wrap.addEventListener("keydown", function(ev){
        if (ev.key === "Enter" || ev.key === " "){
          ev.preventDefault();
          toggle();
        }
      });

      box.appendChild(wrap);
    });
  }

  /* ===================== R/L QCM ===================== */
  var rlCur = null;
  function newRL(){
    rlCur = choice(RLQ);
    $("rlTitle").textContent = rlCur.title;
    $("rlPrompt").textContent = rlCur.prompt;
    $("rlHint").textContent = "";
    $("rlFeedback").textContent = ""; $("rlFeedback").className = "feedback";

    renderChoices("rlChoices", rlCur.choices, rlCur.correct, function(ok){
      $("rlFeedback").textContent = ok ? "✅ Great. Now SAY it clearly (twice)." : "❌ French trap: don’t replace R with L.";
      $("rlFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenRL(){ if (rlCur) speakText(rlCur.say); }
  function hintRL(){ if (rlCur) $("rlHint").textContent = rlCur.hint; }

  var rlPromptSet = [];
  function newRLP(){
    rlPromptSet = shuffle(RLPROMPTS).slice(0,4);
    var box = $("rlPrompts");
    box.innerHTML = "";
    for (var i=0;i<rlPromptSet.length;i++){
      var d = document.createElement("div");
      d.className = "prompt";
      d.textContent = "🗣️ " + rlPromptSet[i];
      box.appendChild(d);
    }
  }
  function listenRLP(){
    if (!rlPromptSet.length) return;
    speakText(choice(rlPromptSet));
  }

  /* ===================== H QCM + a/an fill ===================== */
  var hCur = null;
  function newH(){
    hCur = choice(HQ);
    $("hTitle").textContent = hCur.title;
    $("hPrompt").textContent = hCur.prompt;
    $("hHint").textContent = "";
    $("hFeedback").textContent = ""; $("hFeedback").className = "feedback";

    renderChoices("hChoices", hCur.choices, hCur.correct, function(ok){
      $("hFeedback").textContent = ok ? "✅ Good! Repeat it twice." : "❌ Listen again: is H silent or pronounced?";
      $("hFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenH(){ if (hCur) speakText(hCur.say); }
  function hintH(){ if (hCur) $("hHint").textContent = hCur.hint; }

  var haCur = null;
  function newHA(){
    haCur = choice(HAN);
    $("haSentence").textContent = haCur.sentence;
    $("haInput").value = "";
    $("haHint").textContent = "";
    $("haFeedback").textContent = ""; $("haFeedback").className="feedback";
  }
  function listenHA(){ if (haCur) speakText(haCur.say); }
  function hintHA(){ if (haCur) $("haHint").textContent = haCur.hint; }
  function checkHA(){
    if (!haCur) return;
    var v = norm($("haInput").value);
    var ok = (v === norm(haCur.answer));
    addAttempt(ok);
    $("haFeedback").textContent = ok ? "✅ Correct!" : ("❌ Expected: " + haCur.answer);
    $("haFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealHA(){
    if (!haCur) return;
    $("haInput").value = haCur.answer;
    $("haFeedback").textContent = "Answer revealed — now say the sentence twice.";
    $("haFeedback").className = "feedback warn";
  }

  /* ===================== Silent letters sorting ===================== */
  var slCur = null, slWords = [];
  function newSL(){
    slCur = choice(SLSETS);
    slWords = slCur.words.slice();
    $("slFeedback").textContent = ""; $("slFeedback").className = "feedback";
    $("slHint").textContent = "";
    resetChips("slBank", slWords, ["slK","slW","slB","slT","slGH"]);
  }
  function resetSL(){
    resetChips("slBank", slWords, ["slK","slW","slB","slT","slGH"]);
    $("slFeedback").textContent = ""; $("slFeedback").className = "feedback";
    $("slHint").textContent = "";
  }
  function listenSL(){
    if (!slWords.length) return;
    speakText(slWords.map(function(x){ return x.w; }).join(". "));
  }
  function hintSL(){ if (slCur) $("slHint").textContent = slCur.hint; }
  function checkSL(){
    var res = checkZones([
      {zoneId:"slK", cat:"K"},
      {zoneId:"slW", cat:"W"},
      {zoneId:"slB", cat:"B"},
      {zoneId:"slT", cat:"T"},
      {zoneId:"slGH", cat:"GH"}
    ]);
    if (res.total === 0){
      $("slFeedback").textContent = "Move words into the boxes first.";
      $("slFeedback").className = "feedback warn";
      return;
    }
    addAttempt(res.ok);
    $("slFeedback").textContent = res.ok ? "✅ Perfect! Now read the words out loud." : ("❌ " + res.correct + " / " + res.total + ". Focus on kn-/wr- and silent t/b.");
    $("slFeedback").className = "feedback " + (res.ok ? "ok" : "bad");
  }

  /* ===================== Stress QCM ===================== */
  var stCur = null;
  function newST(){
    stCur = choice(STQ);
    $("stTitle").textContent = "Word: " + stCur.word;
    $("stPrompt").textContent = "Pick the stress-marked version that matches what you hear.";
    $("stHint").textContent = "";
    $("stFeedback").textContent = ""; $("stFeedback").className = "feedback";

    renderChoices("stChoices", stCur.choices, stCur.correct, function(ok){
      $("stFeedback").textContent = ok ? "✅ Yes! Now say it twice with rhythm." : "❌ Listen again and exaggerate the stressed syllable.";
      $("stFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenST(){ if (stCur) speakText(stCur.say); }
  function hintST(){ if (stCur) $("stHint").textContent = stCur.hint; }

  /* ===================== Phrase builder ===================== */
  var pbCur = null, pbWords = [];
  function newPB(){
    pbCur = choice(PB);
    pbWords = shuffle(pbCur.words.slice());
    $("pbHint").textContent = "";
    $("pbFeedback").textContent = ""; $("pbFeedback").className="feedback";
    resetChips("pbBank", pbWords, ["pbLine"]);
  }
  function resetPB(){
    if (!pbCur) return;
    pbWords = shuffle(pbCur.words.slice());
    $("pbHint").textContent = "";
    $("pbFeedback").textContent = ""; $("pbFeedback").className="feedback";
    resetChips("pbBank", pbWords, ["pbLine"]);
  }
  function listenPB(){ if (pbCur) speakText(pbCur.say); }
  function hintPB(){ if (pbCur) $("pbHint").textContent = pbCur.hint; }
  function readLineText(){
    var chips = $("pbLine").querySelectorAll(".chip");
    var out = [];
    for (var i=0;i<chips.length;i++) out.push(chips[i].textContent);
    return out.join(" ").replace(/\s—\s/g, " — ");
  }
  function checkPB(){
    if (!pbCur) return;
    var got = readLineText().trim();
    var ok = (norm(got) === norm(pbCur.target));
    addAttempt(ok);
    $("pbFeedback").textContent = ok ? "✅ Perfect sentence! Now say it twice." : ("❌ Not quite. Target: " + pbCur.target);
    $("pbFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* ===================== Connected speech QCM + fill ===================== */
  var csCur = null;
  function newCS(){
    csCur = choice(CSQ);
    $("csTitle").textContent = csCur.title;
    $("csPrompt").textContent = csCur.prompt;
    $("csHint").textContent = "";
    $("csFeedback").textContent = ""; $("csFeedback").className="feedback";

    renderChoices("csChoices", csCur.choices, csCur.correct, function(ok){
      $("csFeedback").textContent = ok ? "✅ Great. Say the sentence with smooth linking." : "❌ Try again — aim for smooth flow.";
      $("csFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenCS(){ if (csCur) speakText(csCur.say); }
  function hintCS(){ if (csCur) $("csHint").textContent = csCur.hint; }

  var cfCur = null;
  function newCF(){
    cfCur = choice(CF);
    $("cfSentence").textContent = cfCur.sentence;
    $("cfInput").value = "";
    $("cfHint").textContent = "";
    $("cfFeedback").textContent = ""; $("cfFeedback").className="feedback";
  }
  function listenCF(){ if (cfCur) speakText(cfCur.say); }
  function hintCF(){ if (cfCur) $("cfHint").textContent = cfCur.hint; }
  function checkCF(){
    if (!cfCur) return;
    var v = norm($("cfInput").value);
    var ok = (v === norm(cfCur.answer));
    addAttempt(ok);
    $("cfFeedback").textContent = ok ? "✅ Correct! Now repeat the full sentence twice." : ("❌ Expected: " + cfCur.answer);
    $("cfFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealCF(){
    if (!cfCur) return;
    $("cfInput").value = cfCur.answer;
    $("cfFeedback").textContent = "Answer revealed — now say it twice (slow then normal).";
    $("cfFeedback").className = "feedback warn";
  }

  /* ===================== Shadowing ===================== */
  var shCurSet = [], shIndex = 0;
  function renderShadow(){
    var box = $("shList");
    box.innerHTML = "";
    for (var i=0;i<shCurSet.length;i++){
      var d = document.createElement("div");
      d.className = "prompt";
      d.textContent = "🎧 " + shCurSet[i];
      box.appendChild(d);
    }
  }
  function newShadow(){
    shCurSet = choice(SHSETS).slice();
    shIndex = 0;
    renderShadow();
    $("shFeedback").textContent = "Tip: repeat immediately (no pause).";
    $("shFeedback").className = "feedback warn";
  }
  function playOneShadow(){
    if (!shCurSet.length) return;
    var s = shCurSet[shIndex % shCurSet.length];
    shIndex++;
    speakText(s);
    $("shFeedback").textContent = "Now repeat it twice (copy rhythm + linking).";
    $("shFeedback").className = "feedback ok";
  }
  function playAllShadow(){
    if (!shCurSet.length) return;
    // speak sequentially using a simple interval (safe enough for short set)
    var i = 0;
    function next(){
      if (i >= shCurSet.length) return;
      speakText(shCurSet[i]);
      i++;
      setTimeout(next, 1500);
    }
    next();
    $("shFeedback").textContent = "Play-all started. Repeat after each phrase.";
    $("shFeedback").className = "feedback ok";
  }

  /* ===================== Final mission script ===================== */
  function buildScript(name, city, day, mode){
    var slowNote = (mode === "slow") ? " (slow + clear)" : "";
    var lines = [];
    lines.push("NATIVE FLOW MISSION" + slowNote);
    lines.push("Name: " + name + " • City: " + city);
    lines.push("");

    if (day === "travel"){
      lines.push("Alright, I’m gonna head out early.");
      lines.push("I’ve got a flight, so I gotta move fast.");
      lines.push("Couldja help me find the right line?");
      lines.push("I’ll grab a coffee, then I’ll get on the train.");
      lines.push("We’ll be there in an hour — hopefully.");
      lines.push("At the hotel, I’ll check in and drop my luggage.");
      lines.push("If I need information, I’ll ask at the front desk.");
    } else if (day === "work"){
      lines.push("I’m gonna start work early today.");
      lines.push("I’ve got a really long list, but it’s alright.");
      lines.push("Couldja send me the information real quick?");
      lines.push("If you’ve got time, we can review it later.");
      lines.push("I gotta run to a meeting — see you soon.");
    } else {
      lines.push("It’s the weekend, so I’m gonna take it easy.");
      lines.push("I might walk around and try a new place for lunch.");
      lines.push("Didja eat yet? I’m kinda hungry.");
      lines.push("Later, I’ll meet a friend and relax.");
      lines.push("If the line is too long, we’ll go somewhere else.");
    }

    lines.push("");
    lines.push("Focus: R/L (right/light), silent H (an hour), silent letters (write/know), stress (information), linking/reductions (gonna/wanna/couldja).");
    return lines.join("\n");
  }

  function generateScript(){
    var name = ($("mName").value || "Alex").trim();
    var city = ($("mCity").value || "Chicago").trim();
    var day = $("mDay").value;
    var mode = $("mSpeed").value;

    var script = buildScript(name, city, day, mode);
    $("scriptBox").textContent = script;
    $("genFeedback").textContent = "✅ Script generated. Listen, then repeat twice.";
    $("genFeedback").className = "feedback ok";
  }

  function listenScript(){
    var text = $("scriptBox").textContent || "";
    if (!text || text.indexOf("Generate") >= 0){
      $("genFeedback").textContent = "Generate a script first.";
      $("genFeedback").className = "feedback warn";
      return;
    }
    speakText(text.replace(/\n+/g, " "));
  }

  function copyScript(){
    var text = $("scriptBox").textContent || "";
    if (!text || text.indexOf("Generate") >= 0){
      $("genFeedback").textContent = "Generate a script first.";
      $("genFeedback").className = "feedback warn";
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){
        $("genFeedback").textContent = "✅ Copied!";
        $("genFeedback").className = "feedback ok";
      }, function(){
        $("genFeedback").textContent = "Copy failed (browser blocked).";
        $("genFeedback").className = "feedback warn";
      });
    } else {
      $("genFeedback").textContent = "Clipboard not available in this browser.";
      $("genFeedback").className = "feedback warn";
    }
  }

  /* ===================== Cheat sheet ===================== */
  function renderCheat(){
    var box = $("cheatGrid");
    box.innerHTML = "";
    for (var i=0;i<CHEAT.length;i++){
      var c = CHEAT[i];
      var d = document.createElement("div");
      d.className = "cheatItem";
      d.innerHTML = "<h4>"+esc(c.title)+"</h4><ul>"+c.items.map(function(x){ return "<li>"+esc(x)+"</li>"; }).join("")+"</ul>";
      box.appendChild(d);
    }
  }
  function listenCheat(){
    speakText("Right. Light. Really. Little. Hotel. An hour. Write. Know. Listen. Doubt. PHOtograph. phoTOgraphy. inforMAtion. Pick-it-up. I'm gonna head out. Couldja help me?");
  }

  /* ===================== Init ===================== */
  function init(){
    $("accent").addEventListener("change", function(){ speech.accent = $("accent").value; pickVoice(); });
    $("rate").addEventListener("input", function(){
      speech.rate = parseFloat($("rate").value);
      $("rateLabel").textContent = speech.rate.toFixed(2) + "×";
    });
    $("btnTest").addEventListener("click", function(){
      speakText("Test voice. Repeat: right, light. hotel, hour. write, know. I'm gonna head out. Couldja help me?");
    });
    $("btnStop").addEventListener("click", stopSpeak);

    renderTimer();
    $("btnStart60").addEventListener("click", function(){ setTimer(3600); });
    $("btnResetTimer").addEventListener("click", resetTimer);
    $("btnPrint").addEventListener("click", function(){ window.print(); });
    $("btnCheatListen").addEventListener("click", listenCheat);

    wireSayButtons();

    // warm-up
    $("wNew").addEventListener("click", newWarmup);
    $("wListen").addEventListener("click", listenWarmup);
    $("wHintBtn").addEventListener("click", hintWarmup);
    newWarmup();

    // flashcards
    renderFlashcards(null);
    $("fcShuffle").addEventListener("click", function(){ renderFlashcards(null); });
    $("fcListenRand").addEventListener("click", function(){ speakText(choice(FLASH).say); });
    $("fcSetRL").addEventListener("click", function(){ renderFlashcards("rl"); });
    $("fcSetH").addEventListener("click", function(){ renderFlashcards("h"); });
    $("fcSetSilent").addEventListener("click", function(){ renderFlashcards("silent"); });
    $("fcSetStress").addEventListener("click", function(){ renderFlashcards("stress"); });
    $("fcSetConn").addEventListener("click", function(){ renderFlashcards("connected"); });

    // R/L
    $("rlNew").addEventListener("click", newRL);
    $("rlListen").addEventListener("click", listenRL);
    $("rlHintBtn").addEventListener("click", hintRL);
    newRL();

    $("rlPromptsNew").addEventListener("click", newRLP);
    $("rlPromptsListen").addEventListener("click", listenRLP);
    newRLP();

    // H
    $("hNew").addEventListener("click", newH);
    $("hListen").addEventListener("click", listenH);
    $("hHintBtn").addEventListener("click", hintH);
    newH();

    $("haNew").addEventListener("click", newHA);
    $("haListen").addEventListener("click", listenHA);
    $("haHintBtn").addEventListener("click", hintHA);
    $("haCheck").addEventListener("click", checkHA);
    $("haReveal").addEventListener("click", revealHA);
    newHA();

    // Silent letters
    wireDropzone($("slK")); wireDropzone($("slW")); wireDropzone($("slB")); wireDropzone($("slT")); wireDropzone($("slGH"));
    $("slNew").addEventListener("click", newSL);
    $("slListen").addEventListener("click", listenSL);
    $("slHintBtn").addEventListener("click", hintSL);
    $("slCheck").addEventListener("click", checkSL);
    $("slReset").addEventListener("click", resetSL);
    newSL();

    // Stress
    $("stNew").addEventListener("click", newST);
    $("stListen").addEventListener("click", listenST);
    $("stHintBtn").addEventListener("click", hintST);
    newST();

    // Phrase builder
    wireDropzone($("pbLine"));
    $("pbNew").addEventListener("click", newPB);
    $("pbListen").addEventListener("click", listenPB);
    $("pbHintBtn").addEventListener("click", hintPB);
    $("pbCheck").addEventListener("click", checkPB);
    $("pbReset").addEventListener("click", resetPB);
    newPB();

    // Connected speech
    $("csNew").addEventListener("click", newCS);
    $("csListen").addEventListener("click", listenCS);
    $("csHintBtn").addEventListener("click", hintCS);
    newCS();

    $("cfNew").addEventListener("click", newCF);
    $("cfListen").addEventListener("click", listenCF);
    $("cfHintBtn").addEventListener("click", hintCF);
    $("cfCheck").addEventListener("click", checkCF);
    $("cfReveal").addEventListener("click", revealCF);
    newCF();

    // Shadowing
    $("shNew").addEventListener("click", newShadow);
    $("shPlay").addEventListener("click", playOneShadow);
    $("shPlayAll").addEventListener("click", playAllShadow);
    newShadow();

    // Mission
    $("genBtn").addEventListener("click", generateScript);
    $("genListen").addEventListener("click", listenScript);
    $("genCopy").addEventListener("click", copyScript);

    // Cheat
    renderCheat();

    // voices
    if (window.speechSynthesis){
      loadVoices();
      window.speechSynthesis.onvoiceschanged = function(){ loadVoices(); };
    }
  }

  init();
})();
