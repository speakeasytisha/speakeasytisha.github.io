/* SpeakEasyTisha — Pronunciation Masterclass (French Learners)
   Touch-friendly, instant feedback, score, US/UK speech (speechSynthesis),
   drag & drop + tap-to-move fallback, timer, printable cheat sheet.
*/
(function(){
  "use strict";

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c];
    });
  }
  function norm(s){ return String(s||"").trim().toLowerCase(); }
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
  var speech = {
    accent: "en-US",
    rate: 1.0,
    voice: null,
    voices: []
  };

  function loadVoices(){
    var vs = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    speech.voices = vs || [];
    pickVoice();
  }

  function pickVoice(){
    if (!window.speechSynthesis) return;
    var lang = speech.accent;
    var vs = speech.voices || window.speechSynthesis.getVoices() || [];
    var best = null;

    // Prefer exact lang match, then startsWith (e.g., en-GB), then any en
    for (var i=0;i<vs.length;i++){
      if (vs[i].lang === lang){ best = vs[i]; break; }
    }
    if (!best){
      for (var j=0;j<vs.length;j++){
        if ((vs[j].lang||"").indexOf(lang) === 0){ best = vs[j]; break; }
      }
    }
    if (!best){
      for (var k=0;k<vs.length;k++){
        if ((vs[k].lang||"").indexOf("en") === 0){ best = vs[k]; break; }
      }
    }
    speech.voice = best || null;
  }

  function stopSpeak(){
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

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
  function addAttempt(isCorrect){
    scoreMax += 1;
    if (isCorrect) scoreNow += 1;
    $("scoreNow").textContent = String(scoreNow);
    $("scoreMax").textContent = String(scoreMax);
  }

  /* -------------------- Timer -------------------- */
  var timer = { total: 3600, left: 3600, t: null, running: false };
  function fmtTime(sec){
    var m = Math.floor(sec/60);
    var s = sec % 60;
    return String(m) + ":" + (s<10 ? "0"+s : String(s));
  }
  function renderTimer(){
    $("timerText").textContent = fmtTime(timer.left);
  }
  function startTimer(){
    if (timer.running) return;
    timer.running = true;
    timer.t = setInterval(function(){
      timer.left -= 1;
      if (timer.left <= 0){
        timer.left = 0;
        stopTimer();
      }
      renderTimer();
    }, 1000);
  }
  function stopTimer(){
    timer.running = false;
    if (timer.t) clearInterval(timer.t);
    timer.t = null;
    renderTimer();
  }
  function resetTimer(){
    stopTimer();
    timer.left = timer.total;
    renderTimer();
  }

  /* -------------------- Global click-to-speak buttons -------------------- */
  function wireSayButtons(){
    document.addEventListener("click", function(e){
      var el = e.target;
      if (!el) return;
      if (el && el.getAttribute && el.getAttribute("data-say")){
        speakText(el.getAttribute("data-say"));
      }
    });
  }

  /* -------------------- Flashcards -------------------- */
  var flash1 = [
    { title:"/ɪ/ (short)", text:"sit, ship, live, busy\nFR: son court, bouche relâchée", say:"Sit. Ship. Live. Busy." },
    { title:"/iː/ (long)", text:"see, sheep, leave, beach\nFR: son long, lèvres plus étirées", say:"See. Sheep. Leave. Beach." },
    { title:"IE = /iː/", text:"piece, field, chief\nFR: souvent “ii”", say:"Piece. Field. Chief." },
    { title:"IE = /aɪ/", text:"pie, tie, die\nFR: “aï”", say:"Pie. Tie. Die." },
    { title:"IE = /e/", text:"friend\nFR: exception très fréquente", say:"Friend." },
    { title:"EI after C", text:"receive, ceiling\nFR: souvent /iː/ après C", say:"Receive. Ceiling." }
  ];

  function renderFlashcards(containerId, data){
    var box = $(containerId);
    box.innerHTML = "";
    data.forEach(function(card, idx){
      var wrap = document.createElement("div");
      wrap.className = "flashcard";
      wrap.tabIndex = 0;

      var inner = document.createElement("div");
      inner.className = "flashcard__inner";

      var front = document.createElement("div");
      front.className = "flashface";
      front.innerHTML =
        '<div class="flashTitle">'+esc(card.title)+'</div>' +
        '<div class="flashText">'+esc(card.text).replace(/\n/g,"<br>")+'</div>' +
        '<div class="flashActions">' +
          '<button class="btn btn--ghost" type="button" data-fcsay="'+esc(card.say)+'">Listen</button>' +
          '<span class="tiny muted">Tap to flip</span>' +
        '</div>';

      var back = document.createElement("div");
      back.className = "flashface flashface--back";
      back.innerHTML =
        '<div class="flashTitle">Try it</div>' +
        '<div class="flashText">Listen → repeat 3×. Then use it in a sentence.</div>' +
        '<div class="flashActions">' +
          '<button class="btn" type="button" data-fcsay="'+esc(card.say)+'">Listen again</button>' +
          '<span class="tiny muted">Tap to flip back</span>' +
        '</div>';

      inner.appendChild(front);
      inner.appendChild(back);
      wrap.appendChild(inner);

      function toggle(){
        wrap.classList.toggle("is-flipped");
      }
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

  /* -------------------- Drag + Tap-to-move sorter -------------------- */
  var tapState = { chip: null }; // selected chip element

  function makeChip(text, meta){
    var d = document.createElement("div");
    d.className = "chip";
    d.textContent = text;
    d.setAttribute("draggable","true");
    if (meta){
      for (var k in meta){
        if (Object.prototype.hasOwnProperty.call(meta,k)){
          d.dataset[k] = meta[k];
        }
      }
    }

    d.addEventListener("dragstart", function(e){
      e.dataTransfer.setData("text/plain", text);
      e.dataTransfer.setData("app/chipId", d.dataset.chipid || "");
      setTimeout(function(){ d.classList.add("is-selected"); }, 0);
    });
    d.addEventListener("dragend", function(){
      d.classList.remove("is-selected");
    });

    // Tap-to-move: tap chip then tap zone
    d.addEventListener("click", function(){
      // toggle selection
      if (tapState.chip === d){
        tapState.chip.classList.remove("is-selected");
        tapState.chip = null;
      } else {
        if (tapState.chip) tapState.chip.classList.remove("is-selected");
        tapState.chip = d;
        d.classList.add("is-selected");
      }
    });

    // Unique id for drag
    d.dataset.chipid = "c" + Math.random().toString(16).slice(2);

    return d;
  }

  function wireDropzone(zone){
    zone.addEventListener("dragover", function(e){
      e.preventDefault();
      zone.classList.add("is-over");
    });
    zone.addEventListener("dragleave", function(){
      zone.classList.remove("is-over");
    });
    zone.addEventListener("drop", function(e){
      e.preventDefault();
      zone.classList.remove("is-over");
      var chipId = e.dataTransfer.getData("app/chipId");
      if (!chipId) return;
      var chip = document.querySelector('[data-chipid="'+chipId+'"]');
      if (chip) zone.appendChild(chip);
    });

    // Tap-to-move target: if a chip is selected, move it here
    zone.addEventListener("click", function(){
      if (tapState.chip){
        zone.appendChild(tapState.chip);
        tapState.chip.classList.remove("is-selected");
        tapState.chip = null;
      }
    });
  }

  /* -------------------- Activity: I sounds sorter -------------------- */
  var iWords = [
    { w:"ship", g:"short" }, { w:"sit", g:"short" }, { w:"live", g:"short" }, { w:"rich", g:"short" },
    { w:"busy", g:"short" }, { w:"quick", g:"short" }, { w:"ticket", g:"short" }, { w:"fish", g:"short" },
    { w:"sheep", g:"long" }, { w:"seat", g:"long" }, { w:"leave", g:"long" }, { w:"beach", g:"long" },
    { w:"team", g:"long" }, { w:"piece", g:"long" }, { w:"deep", g:"long" }, { w:"free", g:"long" },
    { w:"bitch", g:"short" }, { w:"sheet", g:"long" }, { w:"cheap", g:"long" }, { w:"chick", g:"short" }
  ];

  var iSet = [];
  function newISet(){
    $("iFeedback").textContent = "";
    $("iFeedback").className = "feedback";
    $("iShort").innerHTML = "";
    $("iLong").innerHTML = "";
    $("iBank").innerHTML = "";
    tapState.chip = null;

    iSet = shuffle(iWords).slice(0, 12);
    iSet.forEach(function(x){
      $("iBank").appendChild(makeChip(x.w, { group: x.g }));
    });
  }

  function resetI(){
    $("iFeedback").textContent = "";
    $("iFeedback").className = "feedback";
    $("iBank").innerHTML = "";
    $("iShort").innerHTML = "";
    $("iLong").innerHTML = "";
    iSet.forEach(function(x){
      $("iBank").appendChild(makeChip(x.w, { group: x.g }));
    });
    tapState.chip = null;
  }

  function checkI(){
    var correct = 0, total = 0;
    function countZone(zoneId, expected){
      var zone = $(zoneId);
      var chips = zone.querySelectorAll(".chip");
      for (var i=0;i<chips.length;i++){
        total++;
        if (chips[i].dataset.group === expected) correct++;
      }
    }
    countZone("iShort", "short");
    countZone("iLong", "long");

    var fb = $("iFeedback");
    if (total === 0){
      fb.textContent = "Place the words into the two boxes first.";
      fb.className = "feedback warn";
      return;
    }
    var ok = (correct === total);
    addAttempt(ok);
    fb.textContent = ok
      ? "✅ Perfect! All sounds correct."
      : "❌ Not quite: " + correct + " / " + total + " correct. Tip: listen again and notice short vs long.";
    fb.className = "feedback " + (ok ? "ok" : "bad");
  }

  function listenI(){
    if (!iSet.length) return;
    speakText(iSet.map(function(x){ return x.w; }).join(". "));
  }

  /* -------------------- IE/EI Quiz -------------------- */
  var ieQ = [
    { word:"piece", ans:"/iː/ (long ee)", explain:"IE often = /iː/ in piece, chief, field." },
    { word:"chief", ans:"/iː/ (long ee)", explain:"chief = /tʃiːf/ (long)." },
    { word:"friend", ans:"/e/ (like 'bed')", explain:"friend is a famous exception: /frend/." },
    { word:"pie", ans:"/aɪ/ (eye)", explain:"pie = /paɪ/ (like 'my')." },
    { word:"receive", ans:"/iː/ (long ee)", explain:"EI after C is often /iː/: receive, ceiling." },
    { word:"ceiling", ans:"/iː/ (long ee)", explain:"ceiling = /ˈsiːlɪŋ/." },
    { word:"height", ans:"/aɪ/ (eye)", explain:"height is an EI exception: /haɪt/." },
    { word:"leisure", ans:"/e/ or /iː/ (varies)", explain:"leisure varies by accent; often /ˈlɛʒər/ (US) or /ˈlɛʒə/ (UK)." }
  ];
  var ieChoices = ["/ɪ/ (short i)", "/iː/ (long ee)", "/aɪ/ (eye)", "/e/ (like 'bed')", "/e/ or /iː/ (varies)"];
  var ieCur = null, ieCount = 0;

  function newIeQ(){
    ieCur = choice(ieQ);
    ieCount++;
    $("ieNum").textContent = String(ieCount);
    $("ieWord").textContent = ieCur.word;
    $("ieExplain").textContent = "Choose the best sound. Then repeat the word 3×.";
    renderChoices("ieChoices", ieChoices, ieCur.ans, function(isOk){
      addAttempt(isOk);
      $("ieExplain").textContent = (isOk ? "✅ " : "❌ ") + ieCur.word + " → " + ieCur.ans + ". " + ieCur.explain;
      $("ieExplain").style.color = isOk ? "#cfffdf" : "#ffd1d6";
    });
  }
  function listenIe(){ if (ieCur) speakText(ieCur.word); }

  /* -------------------- Y Quiz -------------------- */
  var yQ = [
    { word:"my", ans:"/aɪ/ (eye)", explain:"my, try, sky → /aɪ/." },
    { word:"type", ans:"/aɪ/ (eye)", explain:"type = /taɪp/." },
    { word:"happy", ans:"/iː/ (long ee)", explain:"final -y in happy is /iː/." },
    { word:"baby", ans:"/iː/ (long ee)", explain:"baby ends /iː/." },
    { word:"system", ans:"/ɪ/ (short i)", explain:"system has /ɪ/ in unstressed syllable." },
    { word:"mystery", ans:"/ɪ/ (short i)", explain:"mystery often has /ɪ/ in the 'y'." },
    { word:"yes", ans:"/j/ (y sound)", explain:"yes begins with /j/." },
    { word:"yellow", ans:"/j/ (y sound)", explain:"yellow begins with /j/." }
  ];
  var yChoices = ["/aɪ/ (eye)", "/iː/ (long ee)", "/ɪ/ (short i)", "/j/ (y sound)"];
  var yCur = null, yCount = 0;

  function newYQ(){
    yCur = choice(yQ);
    yCount++;
    $("yNum").textContent = String(yCount);
    $("yWord").textContent = yCur.word;
    $("yExplain").textContent = "Choose the sound. Then repeat 3×.";
    renderChoices("yChoices", yChoices, yCur.ans, function(isOk){
      addAttempt(isOk);
      $("yExplain").textContent = (isOk ? "✅ " : "❌ ") + yCur.word + " → " + yCur.ans + ". " + yCur.explain;
      $("yExplain").style.color = isOk ? "#cfffdf" : "#ffd1d6";
    });
  }
  function listenY(){ if (yCur) speakText(yCur.word); }

  /* -------------------- Z sound spotter -------------------- */
  var zBank = [
    { w:"zoo", z:true }, { w:"zero", z:true }, { w:"amazing", z:true }, { w:"lazy", z:true },
    { w:"easy", z:true }, { w:"music", z:true }, { w:"is", z:true }, { w:"was", z:true },
    { w:"rose", z:true }, { w:"roses", z:true }, { w:"busy", z:false }, { w:"miss", z:false },
    { w:"class", z:false }, { w:"price", z:false }, { w:"bus", z:false }, { w:"face", z:false }
  ];
  var zSet = [];
  function newZSet(){
    $("zFeedback").textContent = "";
    $("zFeedback").className = "feedback";
    $("zSet").innerHTML = "";
    zSet = shuffle(zBank).slice(0, 10);
    zSet.forEach(function(x){
      var c = document.createElement("div");
      c.className = "chip";
      c.tabIndex = 0;
      c.textContent = x.w;
      c.dataset.isz = x.z ? "1" : "0";
      c.addEventListener("click", function(){ c.classList.toggle("is-picked"); });
      $("zSet").appendChild(c);
    });
  }
  function listenZSet(){
    if (!zSet.length) return;
    speakText(zSet.map(function(x){ return x.w; }).join(". "));
  }
  function clearZ(){
    var chips = $("zSet").querySelectorAll(".chip");
    for (var i=0;i<chips.length;i++) chips[i].classList.remove("is-picked");
    $("zFeedback").textContent = "";
    $("zFeedback").className = "feedback";
  }
  function checkZ(){
    var chips = $("zSet").querySelectorAll(".chip");
    if (!chips.length) return;

    var correct = 0, total = 0;
    for (var i=0;i<chips.length;i++){
      var picked = chips[i].classList.contains("is-picked");
      var should = chips[i].dataset.isz === "1";
      total++;
      if (picked === should) correct++;
    }
    var ok = (correct === total);
    addAttempt(ok);

    var fb = $("zFeedback");
    fb.textContent = ok
      ? "✅ Great! You correctly spotted all /z/ words."
      : "❌ Not quite: " + correct + " / " + total + ". Tip: /z/ is voiced (vibration).";
    fb.className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- S/ES ending chooser -------------------- */
  var esItems = [
    { w:"cats", a:"/s/" }, { w:"books", a:"/s/" }, { w:"laughs", a:"/s/" }, { w:"stops", a:"/s/" },
    { w:"dogs", a:"/z/" }, { w:"rooms", a:"/z/" }, { w:"plays", a:"/z/" }, { w:"loves", a:"/z/" },
    { w:"watches", a:"/ɪz/" }, { w:"buses", a:"/ɪz/" }, { w:"boxes", a:"/ɪz/" }, { w:"roses", a:"/ɪz/" }
  ];
  var esChoices = ["/s/","/z/","/ɪz/"];
  var esSet = [];

  function renderChoiceRow(container, word){
    var row = document.createElement("div");
    row.className = "rowItem";
    row.innerHTML = '<div><strong>'+esc(word.w)+'</strong> <span class="tiny muted">→ choose the ending sound</span></div>';
    var sel = document.createElement("select");
    sel.className = "selectMini";
    sel.innerHTML = '<option value="">—</option>' + esChoices.map(function(x){ return '<option value="'+esc(x)+'">'+esc(x)+'</option>'; }).join("");
    sel.dataset.answer = word.a;
    row.appendChild(sel);
    container.appendChild(row);
  }

  function newESList(){
    $("esFeedback").textContent = "";
    $("esFeedback").className = "feedback";
    $("esList").innerHTML = "";
    esSet = shuffle(esItems).slice(0, 9);
    esSet.forEach(function(it){ renderChoiceRow($("esList"), it); });
  }

  function resetES(){
    var sels = $("esList").querySelectorAll("select");
    for (var i=0;i<sels.length;i++) sels[i].value = "";
    $("esFeedback").textContent = "";
    $("esFeedback").className = "feedback";
  }

  function listenES(){
    if (!esSet.length) return;
    speakText(esSet.map(function(x){ return x.w; }).join(". "));
  }

  function checkES(){
    var sels = $("esList").querySelectorAll("select");
    if (!sels.length){
      $("esFeedback").textContent = "Click New list first.";
      $("esFeedback").className = "feedback warn";
      return;
    }
    var correct = 0, total = 0, filled = 0;
    for (var i=0;i<sels.length;i++){
      var val = sels[i].value;
      var ans = sels[i].dataset.answer;
      if (val) filled++;
      total++;
      if (val === ans) correct++;
    }
    if (filled === 0){
      $("esFeedback").textContent = "Choose /s/, /z/ or /ɪz/ for each word first.";
      $("esFeedback").className = "feedback warn";
      return;
    }
    var ok = (correct === total);
    addAttempt(ok);
    $("esFeedback").textContent = ok
      ? "✅ Perfect! Endings are correct."
      : "❌ " + correct + " / " + total + " correct. Tip: /ɪz/ after s, z, sh, ch, x sounds.";
    $("esFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- Sentence (add -s / -es) -------------------- */
  var sSentences = [
    { base:"watch", right:"watches", sentence:"Every morning he ____ TV before work.", say:"Every morning he watches TV before work." },
    { base:"play", right:"plays", sentence:"She ____ tennis on Saturdays.", say:"She plays tennis on Saturdays." },
    { base:"fix", right:"fixes", sentence:"Our technician ____ the problem quickly.", say:"Our technician fixes the problem quickly." },
    { base:"need", right:"needs", sentence:"My manager ____ an update today.", say:"My manager needs an update today." },
    { base:"wash", right:"washes", sentence:"He ____ the dishes after dinner.", say:"He washes the dishes after dinner." },
    { base:"drive", right:"drives", sentence:"She ____ to the office twice a week.", say:"She drives to the office twice a week." }
  ];
  var sCur = null;

  function newSentence(){
    sCur = choice(sSentences);
    $("sSentence").textContent = sCur.sentence;
    $("sInput").value = "";
    $("sFeedback").textContent = "";
    $("sFeedback").className = "feedback";
  }
  function listenSentence(){
    if (!sCur) return;
    speakText(sCur.say);
  }
  function checkSentence(){
    if (!sCur) return;
    var v = norm($("sInput").value);
    var ok = (v === norm(sCur.right));
    addAttempt(ok);
    $("sFeedback").textContent = ok ? "✅ Correct!" : "❌ Not quite. Correct answer: " + sCur.right;
    $("sFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealSentence(){
    if (!sCur) return;
    $("sInput").value = sCur.right;
    $("sFeedback").textContent = "Answer revealed. Now say the full sentence out loud.";
    $("sFeedback").className = "feedback warn";
  }

  /* -------------------- TH Quiz -------------------- */
  var thQ = [
    { word:"think", ans:"/θ/ (unvoiced)", explain:"think has /θ/ (no vibration)." },
    { word:"three", ans:"/θ/ (unvoiced)", explain:"three = /θriː/." },
    { word:"thanks", ans:"/θ/ (unvoiced)", explain:"thanks starts /θ/." },
    { word:"this", ans:"/ð/ (voiced)", explain:"this has /ð/ (vibration)." },
    { word:"that", ans:"/ð/ (voiced)", explain:"that starts /ð/." },
    { word:"there", ans:"/ð/ (voiced)", explain:"there starts /ð/." }
  ];
  var thChoices = ["/θ/ (unvoiced)", "/ð/ (voiced)"];
  var thCur = null, thCount = 0;

  function newThQ(){
    thCur = choice(thQ);
    thCount++;
    $("thNum").textContent = String(thCount);
    $("thWord").textContent = thCur.word;
    $("thExplain").textContent = "Listen → choose /θ/ or /ð/ → repeat 3×.";
    renderChoices("thChoices", thChoices, thCur.ans, function(isOk){
      addAttempt(isOk);
      $("thExplain").textContent = (isOk ? "✅ " : "❌ ") + thCur.word + " → " + thCur.ans + ". " + thCur.explain;
      $("thExplain").style.color = isOk ? "#cfffdf" : "#ffd1d6";
    });
  }
  function listenTh(){ if (thCur) speakText(thCur.word); }

  /* -------------------- TION sorter -------------------- */
  var tionWords = [
    { w:"nation", g:"shun" }, { w:"information", g:"shun" }, { w:"station", g:"shun" }, { w:"action", g:"shun" },
    { w:"decision", g:"zhun" }, { w:"television", g:"zhun" }, { w:"confusion", g:"zhun" }, { w:"collision", g:"zhun" }
  ];
  var tionSet = [];
  function newTionSet(){
    $("tionFeedback").textContent = "";
    $("tionFeedback").className = "feedback";
    $("tionShun").innerHTML = "";
    $("tionZhun").innerHTML = "";
    $("tionBank").innerHTML = "";
    tapState.chip = null;

    tionSet = shuffle(tionWords).slice(0, 8);
    tionSet.forEach(function(x){
      $("tionBank").appendChild(makeChip(x.w, { group: x.g }));
    });
  }
  function resetTion(){
    $("tionFeedback").textContent = "";
    $("tionFeedback").className = "feedback";
    $("tionShun").innerHTML = "";
    $("tionZhun").innerHTML = "";
    $("tionBank").innerHTML = "";
    tionSet.forEach(function(x){
      $("tionBank").appendChild(makeChip(x.w, { group: x.g }));
    });
    tapState.chip = null;
  }
  function listenTion(){
    if (!tionSet.length) return;
    speakText(tionSet.map(function(x){ return x.w; }).join(". "));
  }
  function checkTion(){
    var correct = 0, total = 0;
    function count(zoneId, expected){
      var z = $(zoneId);
      var chips = z.querySelectorAll(".chip");
      for (var i=0;i<chips.length;i++){
        total++;
        if (chips[i].dataset.group === expected) correct++;
      }
    }
    count("tionShun","shun");
    count("tionZhun","zhun");

    var fb = $("tionFeedback");
    if (total === 0){
      fb.textContent = "Move the words into the two boxes first.";
      fb.className = "feedback warn";
      return;
    }
    var ok = (correct === total);
    addAttempt(ok);
    fb.textContent = ok ? "✅ Perfect!" : "❌ " + correct + " / " + total + " correct. Tip: -tion is usually /shun/.";
    fb.className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- ED list -------------------- */
  var edItems = [
    { w:"worked", a:"/t/" }, { w:"helped", a:"/t/" }, { w:"laughed", a:"/t/" }, { w:"missed", a:"/t/" },
    { w:"played", a:"/d/" }, { w:"called", a:"/d/" }, { w:"cleaned", a:"/d/" }, { w:"loved", a:"/d/" },
    { w:"wanted", a:"/ɪd/" }, { w:"needed", a:"/ɪd/" }, { w:"invited", a:"/ɪd/" }, { w:"decided", a:"/ɪd/" }
  ];
  var edChoices = ["/t/","/d/","/ɪd/"];
  var edSet = [];

  function newEDList(){
    $("edFeedback").textContent = "";
    $("edFeedback").className = "feedback";
    $("edList").innerHTML = "";
    edSet = shuffle(edItems).slice(0, 9);
    edSet.forEach(function(it){
      var row = document.createElement("div");
      row.className = "rowItem";
      row.innerHTML = '<div><strong>'+esc(it.w)+'</strong></div>';
      var sel = document.createElement("select");
      sel.className = "selectMini";
      sel.innerHTML = '<option value="">—</option>' + edChoices.map(function(x){ return '<option value="'+esc(x)+'">'+esc(x)+'</option>'; }).join("");
      sel.dataset.answer = it.a;
      row.appendChild(sel);
      $("edList").appendChild(row);
    });
  }
  function resetED(){
    var sels = $("edList").querySelectorAll("select");
    for (var i=0;i<sels.length;i++) sels[i].value = "";
    $("edFeedback").textContent = "";
    $("edFeedback").className = "feedback";
  }
  function listenED(){
    if (!edSet.length) return;
    speakText(edSet.map(function(x){ return x.w; }).join(". "));
  }
  function checkED(){
    var sels = $("edList").querySelectorAll("select");
    if (!sels.length){
      $("edFeedback").textContent = "Click New list first.";
      $("edFeedback").className = "feedback warn";
      return;
    }
    var correct = 0, total = 0, filled = 0;
    for (var i=0;i<sels.length;i++){
      var v = sels[i].value;
      var a = sels[i].dataset.answer;
      if (v) filled++;
      total++;
      if (v === a) correct++;
    }
    if (filled === 0){
      $("edFeedback").textContent = "Choose /t/, /d/ or /ɪd/ for each word first.";
      $("edFeedback").className = "feedback warn";
      return;
    }
    var ok = (correct === total);
    addAttempt(ok);
    $("edFeedback").textContent = ok ? "✅ Perfect!" : "❌ " + correct + " / " + total + ". Tip: /ɪd/ only after t or d.";
    $("edFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- Scenario drills -------------------- */
  var scenarios = [
    {
      title:"Hotel (TH + linking)",
      prompt:"You’re at reception. Choose the most natural sentence (then repeat it).",
      say:"Hi. Can I have three towels, please? Thanks.",
      correct: 0,
      choices:[
        "Hi. Can I have three towels, please? Thanks.",
        "Hi. Can I have tree towels please? Tanks.",
        "Hello. I want three towel. Thank you very much."
      ]
    },
    {
      title:"Phone / spelling (Z)",
      prompt:"You’re giving your email. Choose the best sentence.",
      say:"It’s easy: tisha dot demo at gmail dot com.",
      correct: 0,
      choices:[
        "It’s easy: tisha dot demo at gmail dot com.",
        "It is eassy: tisha point demo arobase gmail point com.",
        "It’s easy: tisha dote demo at jemail dote com."
      ]
    },
    {
      title:"Work update (-ED endings)",
      prompt:"You’re reporting what happened. Choose the best sentence.",
      say:"I emailed the client and I fixed the issue.",
      correct: 0,
      choices:[
        "I emailed the client and I fixed the issue.",
        "I e-mailed-ed the client and I fix-ed the issue.",
        "I email the client and I fixeded the issue."
      ]
    },
    {
      title:"IE/EI (receive)",
      prompt:"Choose the correct sentence.",
      say:"I received the email this morning.",
      correct: 0,
      choices:[
        "I received the email this morning.",
        "I received the email this morning.",
        "I receive-ed the email this morning."
      ]
    },
    {
      title:"Plural ending /ɪz/",
      prompt:"Choose the best sentence.",
      say:"The buses are late again.",
      correct: 0,
      choices:[
        "The buses are late again.",
        "The bus are late again.",
        "The buss are late again."
      ]
    }
  ];
  var scCur = null;

  function newScenario(){
    scCur = choice(scenarios);
    $("scTitle").textContent = scCur.title;
    $("scPrompt").textContent = scCur.prompt;
    $("scFeedback").textContent = "";
    $("scFeedback").className = "feedback";
    var box = $("scChoices");
    box.innerHTML = "";
    scCur.choices.forEach(function(txt, idx){
      var b = document.createElement("button");
      b.className = "choice";
      b.type = "button";
      b.textContent = txt;
      b.addEventListener("click", function(){
        var ok = (idx === scCur.correct);
        addAttempt(ok);
        b.classList.add(ok ? "correct" : "wrong");
        // lock all
        var all = box.querySelectorAll(".choice");
        for (var i=0;i<all.length;i++){
          all[i].disabled = true;
          if (i === scCur.correct) all[i].classList.add("correct");
        }
        $("scFeedback").textContent = ok ? "✅ Nice. Now repeat it out loud 3× (shadowing)." : "❌ Choose the most natural native-like sentence.";
        $("scFeedback").className = "feedback " + (ok ? "ok" : "bad");
      });
      box.appendChild(b);
    });
  }
  function listenScenario(){
    if (!scCur) return;
    speakText(scCur.say);
  }

  /* -------------------- Stress tap exercise -------------------- */
  var stressWords = [
    { word:"information", syl:["in","for","MA","tion"], correct:2 },
    { word:"decision", syl:["de","CI","sion"], correct:1 },
    { word:"television", syl:["te","le","VI","sion"], correct:2 },
    { word:"hotel", syl:["ho","TEL"], correct:1 },
    { word:"system", syl:["SYS","tem"], correct:0 },
    { word:"amazing", syl:["a","MA","zing"], correct:1 }
  ];
  var stCur = null;

  function newStress(){
    stCur = choice(stressWords);
    $("stWord").textContent = stCur.word;
    $("stFeedback").textContent = "Tap the stressed syllable.";
    $("stFeedback").className = "feedback";
    var box = $("stSyllables");
    box.innerHTML = "";
    stCur.syl.forEach(function(s, idx){
      var b = document.createElement("button");
      b.className = "syl";
      b.type = "button";
      b.textContent = s;
      b.addEventListener("click", function(){
        var ok = (idx === stCur.correct);
        addAttempt(ok);
        var all = box.querySelectorAll(".syl");
        for (var i=0;i<all.length;i++){
          all[i].disabled = true;
          if (i === stCur.correct) all[i].classList.add("correct");
        }
        b.classList.add(ok ? "correct" : "wrong");
        $("stFeedback").textContent = ok ? "✅ Correct! Now say the word with a strong beat on that syllable." : "❌ Not quite. Notice the strong beat.";
        $("stFeedback").className = "feedback " + (ok ? "ok" : "bad");
      });
      box.appendChild(b);
    });
  }
  function listenStress(){
    if (!stCur) return;
    speakText(stCur.word);
  }

  /* -------------------- Helper: render multiple choice -------------------- */
  function renderChoices(containerId, options, answer, onPick){
    var box = $(containerId);
    box.innerHTML = "";
    options.forEach(function(opt){
      var b = document.createElement("button");
      b.className = "choice";
      b.type = "button";
      b.textContent = opt;
      b.addEventListener("click", function(){
        var ok = (opt === answer);
        b.classList.add(ok ? "correct" : "wrong");
        // lock all & show answer
        var all = box.querySelectorAll(".choice");
        for (var i=0;i<all.length;i++){
          all[i].disabled = true;
          if (all[i].textContent === answer) all[i].classList.add("correct");
        }
        if (onPick) onPick(ok);
      });
      box.appendChild(b);
    });
  }

  /* -------------------- Init -------------------- */
  function init(){
    // controls
    $("accent").addEventListener("change", function(){
      speech.accent = $("accent").value;
      pickVoice();
    });
    $("rate").addEventListener("input", function(){
      speech.rate = parseFloat($("rate").value);
      $("rateLabel").textContent = speech.rate.toFixed(2) + "×";
    });
    $("btnTest").addEventListener("click", function(){
      speakText("Test voice. Repeat after me: three. sheep. decision. watches.");
    });
    $("btnStop").addEventListener("click", stopSpeak);

    // timer
    renderTimer();
    $("btnStart60").addEventListener("click", function(){
      // toggle start/pause
      if (timer.running) stopTimer(); else startTimer();
      $("btnStart60").textContent = timer.running ? "Pause timer" : "Start 60-min timer";
    });
    $("btnResetTimer").addEventListener("click", function(){
      resetTimer();
      $("btnStart60").textContent = "Start 60-min timer";
    });

    // print + cheat listen
    $("btnPrint").addEventListener("click", function(){ window.print(); });
    $("btnCheatListen").addEventListener("click", function(){
      speakText("Sit. Sheep. Friend. Receive. My. Happy. System. Yes. Cats. Dogs. Watches. Think. This. Nation. Decision. Worked. Played. Wanted.");
    });

    // wire data-say buttons
    wireSayButtons();

    // flashcards
    renderFlashcards("flashcards1", flash1);
    $("fcShuffle1").addEventListener("click", function(){
      flash1 = shuffle(flash1);
      renderFlashcards("flashcards1", flash1);
    });
    $("fcListenRandom1").addEventListener("click", function(){
      var c = choice(flash1);
      speakText(c.say);
    });

    // sorter zones
    wireDropzone($("iShort"));
    wireDropzone($("iLong"));
    wireDropzone($("tionShun"));
    wireDropzone($("tionZhun"));

    // I sounds
    $("iNew").addEventListener("click", newISet);
    $("iReset").addEventListener("click", resetI);
    $("iCheck").addEventListener("click", checkI);
    $("iListen").addEventListener("click", listenI);
    newISet();

    // IE/EI quiz
    $("ieNew").addEventListener("click", newIeQ);
    $("ieListen").addEventListener("click", listenIe);
    newIeQ();

    // Y quiz
    $("yNew").addEventListener("click", newYQ);
    $("yListen").addEventListener("click", listenY);
    newYQ();

    // Z set
    $("zNew").addEventListener("click", newZSet);
    $("zListen").addEventListener("click", listenZSet);
    $("zCheck").addEventListener("click", checkZ);
    $("zClear").addEventListener("click", clearZ);
    newZSet();

    // ES list
    $("esNew").addEventListener("click", newESList);
    $("esListen").addEventListener("click", listenES);
    $("esCheck").addEventListener("click", checkES);
    $("esReset").addEventListener("click", resetES);
    newESList();

    // sentence
    $("sNew").addEventListener("click", newSentence);
    $("sListen").addEventListener("click", listenSentence);
    $("sCheck").addEventListener("click", checkSentence);
    $("sReveal").addEventListener("click", revealSentence);
    newSentence();

    // TH quiz
    $("thNew").addEventListener("click", newThQ);
    $("thListen").addEventListener("click", listenTh);
    newThQ();

    // TION sorter
    $("tionNew").addEventListener("click", newTionSet);
    $("tionListen").addEventListener("click", listenTion);
    $("tionReset").addEventListener("click", resetTion);
    $("tionCheck").addEventListener("click", checkTion);
    newTionSet();

    // ED list
    $("edNew").addEventListener("click", newEDList);
    $("edListen").addEventListener("click", listenED);
    $("edCheck").addEventListener("click", checkED);
    $("edReset").addEventListener("click", resetED);
    newEDList();

    // scenario
    $("scNew").addEventListener("click", newScenario);
    $("scListen").addEventListener("click", listenScenario);
    newScenario();

    // stress
    $("stNew").addEventListener("click", newStress);
    $("stListen").addEventListener("click", listenStress);
    newStress();

    // voices
    if (window.speechSynthesis){
      loadVoices();
      // Some browsers load async
      window.speechSynthesis.onvoiceschanged = function(){
        loadVoices();
      };
    }
  }

  init();
})();
