/* SpeakEasyTisha — Pronunciation Masterclass PRO (French Learners)
   Touch-friendly, instant feedback, score, US/UK speechSynthesis,
   drag & drop + tap-to-move fallback, timers, PRO sections (R/L, H, silent letters, CH, J, V/W, schwa).
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
  function addAttempt(isCorrect){
    scoreMax += 1;
    if (isCorrect) scoreNow += 1;
    $("scoreNow").textContent = String(scoreNow);
    $("scoreMax").textContent = String(scoreMax);
  }

  /* -------------------- Timers -------------------- */
  var timer = { total:3600, left:3600, t:null, running:false };
  function fmtTime(sec){
    var m = Math.floor(sec/60), s = sec % 60;
    return String(m) + ":" + (s<10 ? "0"+s : String(s));
  }
  function renderTimer(){ $("timerText").textContent = fmtTime(timer.left); }
  function startTimer(){
    if (timer.running) return;
    timer.running = true;
    timer.t = setInterval(function(){
      timer.left -= 1;
      if (timer.left <= 0){ timer.left = 0; stopTimer(); }
      renderTimer();
    }, 1000);
  }
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
    startTimer();
  }
  function resetTimer(){
    stopTimer();
    timer.left = timer.total;
    renderTimer();
  }

  /* -------------------- Data-say buttons -------------------- */
  function wireSayButtons(){
    document.addEventListener("click", function(e){
      var el = e.target;
      if (el && el.getAttribute && el.getAttribute("data-say")){
        speakText(el.getAttribute("data-say"));
      }
    });
  }

  /* -------------------- Flashcards -------------------- */
  var flash1 = [
    { title:"/ɪ/ (short)", text:"sit, ship, live, busy\nFR: son court, bouche relâchée", say:"Sit. Ship. Live. Busy." },
    { title:"/iː/ (long)", text:"see, sheep, leave, beach\nFR: son long", say:"See. Sheep. Leave. Beach." },
    { title:"IE = /iː/", text:"piece, field, chief", say:"Piece. Field. Chief." },
    { title:"IE = /aɪ/", text:"pie, tie, die", say:"Pie. Tie. Die." },
    { title:"IE = /e/", text:"friend (exception)", say:"Friend." },
    { title:"EI after C", text:"receive, ceiling", say:"Receive. Ceiling." }
  ];

  function renderFlashcards(containerId, data){
    var box = $(containerId);
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

    // delegate flash listen
    box.addEventListener("click", function(ev){
      var t = ev.target;
      if (t && t.getAttribute && t.getAttribute("data-fcsay")){
        speakText(t.getAttribute("data-fcsay"));
      }
    });
  }

  /* -------------------- Drag + Tap-to-move sorter -------------------- */
  var tapState = { chip:null };

  function makeChip(text, meta){
    var d = document.createElement("div");
    d.className = "chip";
    d.textContent = text;
    d.setAttribute("draggable","true");
    d.dataset.chipid = "c" + Math.random().toString(16).slice(2);

    if (meta){
      for (var k in meta){
        if (Object.prototype.hasOwnProperty.call(meta,k)){
          d.dataset[k] = meta[k];
        }
      }
    }

    d.addEventListener("dragstart", function(e){
      e.dataTransfer.setData("app/chipId", d.dataset.chipid);
      setTimeout(function(){ d.classList.add("is-selected"); }, 0);
    });
    d.addEventListener("dragend", function(){ d.classList.remove("is-selected"); });

    d.addEventListener("click", function(){
      if (tapState.chip === d){
        tapState.chip.classList.remove("is-selected");
        tapState.chip = null;
      } else {
        if (tapState.chip) tapState.chip.classList.remove("is-selected");
        tapState.chip = d;
        d.classList.add("is-selected");
      }
    });

    return d;
  }

  function wireDropzone(zone){
    zone.addEventListener("dragover", function(e){
      e.preventDefault();
      zone.classList.add("is-over");
    });
    zone.addEventListener("dragleave", function(){ zone.classList.remove("is-over"); });
    zone.addEventListener("drop", function(e){
      e.preventDefault();
      zone.classList.remove("is-over");
      var chipId = e.dataTransfer.getData("app/chipId");
      if (!chipId) return;
      var chip = document.querySelector('[data-chipid="'+chipId+'"]');
      if (chip) zone.appendChild(chip);
    });

    zone.addEventListener("click", function(){
      if (tapState.chip){
        zone.appendChild(tapState.chip);
        tapState.chip.classList.remove("is-selected");
        tapState.chip = null;
      }
    });
  }

  /* -------------------- CORE: I sounds sorter -------------------- */
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
    iSet.forEach(function(x){ $("iBank").appendChild(makeChip(x.w, { group:x.g })); });
  }
  function resetI(){
    $("iFeedback").textContent = "";
    $("iFeedback").className = "feedback";
    $("iShort").innerHTML = "";
    $("iLong").innerHTML = "";
    $("iBank").innerHTML = "";
    iSet.forEach(function(x){ $("iBank").appendChild(makeChip(x.w, { group:x.g })); });
    tapState.chip = null;
  }
  function listenI(){ if (iSet.length) speakText(iSet.map(function(x){return x.w;}).join(". ")); }
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
    countZone("iShort","short");
    countZone("iLong","long");

    var fb = $("iFeedback");
    if (total === 0){
      fb.textContent = "Place the words into the two boxes first.";
      fb.className = "feedback warn";
      return;
    }
    var ok = (correct === total);
    addAttempt(ok);
    fb.textContent = ok ? "✅ Perfect!" : "❌ " + correct + " / " + total + " correct. Tip: short /ɪ/ vs long /iː/.";
    fb.className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- CORE: IE/EI Quiz -------------------- */
  var ieQ = [
    { word:"piece", ans:"/iː/ (long ee)", explain:"IE often = /iː/ in piece, chief, field." },
    { word:"chief", ans:"/iː/ (long ee)", explain:"chief = /tʃiːf/." },
    { word:"friend", ans:"/e/ (like 'bed')", explain:"friend is a common exception: /frend/." },
    { word:"pie", ans:"/aɪ/ (eye)", explain:"pie = /paɪ/." },
    { word:"receive", ans:"/iː/ (long ee)", explain:"EI after C often /iː/: receive." },
    { word:"ceiling", ans:"/iː/ (long ee)", explain:"ceiling = /ˈsiːlɪŋ/." },
    { word:"height", ans:"/aɪ/ (eye)", explain:"height is an EI exception: /haɪt/." }
  ];
  var ieChoices = ["/ɪ/ (short i)","/iː/ (long ee)","/aɪ/ (eye)","/e/ (like 'bed')"];
  var ieCur = null, ieCount = 0;

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

  function newIeQ(){
    ieCur = choice(ieQ);
    ieCount++;
    $("ieNum").textContent = String(ieCount);
    $("ieWord").textContent = ieCur.word;
    $("ieExplain").textContent = "Choose the best sound. Then repeat 3×.";
    renderChoices("ieChoices", ieChoices, ieCur.ans, function(ok){
      addAttempt(ok);
      $("ieExplain").textContent = (ok ? "✅ " : "❌ ") + ieCur.word + " → " + ieCur.ans + ". " + ieCur.explain;
    });
  }
  function listenIe(){ if (ieCur) speakText(ieCur.word); }

  /* -------------------- CORE: Y Quiz -------------------- */
  var yQ = [
    { word:"my", ans:"/aɪ/ (eye)", explain:"my, try, sky → /aɪ/." },
    { word:"type", ans:"/aɪ/ (eye)", explain:"type = /taɪp/." },
    { word:"happy", ans:"/iː/ (long ee)", explain:"final -y in happy is /iː/." },
    { word:"baby", ans:"/iː/ (long ee)", explain:"baby ends /iː/." },
    { word:"system", ans:"/ɪ/ (short i)", explain:"system often has /ɪ/." },
    { word:"mystery", ans:"/ɪ/ (short i)", explain:"mystery often has /ɪ/." },
    { word:"yes", ans:"/j/ (y sound)", explain:"yes begins with /j/." },
    { word:"yellow", ans:"/j/ (y sound)", explain:"yellow begins with /j/." }
  ];
  var yChoices = ["/aɪ/ (eye)","/iː/ (long ee)","/ɪ/ (short i)","/j/ (y sound)"];
  var yCur = null, yCount = 0;

  function newYQ(){
    yCur = choice(yQ);
    yCount++;
    $("yNum").textContent = String(yCount);
    $("yWord").textContent = yCur.word;
    $("yExplain").textContent = "Choose the sound. Repeat 3×.";
    renderChoices("yChoices", yChoices, yCur.ans, function(ok){
      addAttempt(ok);
      $("yExplain").textContent = (ok ? "✅ " : "❌ ") + yCur.word + " → " + yCur.ans + ". " + yCur.explain;
    });
  }
  function listenY(){ if (yCur) speakText(yCur.word); }

  /* -------------------- CORE: Z sound spotter -------------------- */
  var zBank = [
    { w:"zoo", z:true }, { w:"zero", z:true }, { w:"amazing", z:true }, { w:"lazy", z:true },
    { w:"easy", z:true }, { w:"music", z:true }, { w:"is", z:true }, { w:"was", z:true },
    { w:"roses", z:true }, { w:"please", z:true },
    { w:"miss", z:false }, { w:"class", z:false }, { w:"price", z:false }, { w:"bus", z:false }, { w:"face", z:false }
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
      c.textContent = x.w;
      c.dataset.isz = x.z ? "1" : "0";
      c.addEventListener("click", function(){ c.classList.toggle("is-picked"); });
      $("zSet").appendChild(c);
    });
  }
  function listenZSet(){ if (zSet.length) speakText(zSet.map(function(x){return x.w;}).join(". ")); }
  function clearZ(){
    var chips = $("zSet").querySelectorAll(".chip");
    for (var i=0;i<chips.length;i++) chips[i].classList.remove("is-picked");
    $("zFeedback").textContent = ""; $("zFeedback").className = "feedback";
  }
  function checkZ(){
    var chips = $("zSet").querySelectorAll(".chip");
    if (!chips.length) return;
    var correct = 0, total = chips.length;

    for (var i=0;i<chips.length;i++){
      var picked = chips[i].classList.contains("is-picked");
      var should = chips[i].dataset.isz === "1";
      if (picked === should) correct++;
    }
    var ok = (correct === total);
    addAttempt(ok);
    $("zFeedback").textContent = ok ? "✅ Great!" : "❌ " + correct + " / " + total + ". Tip: /z/ is voiced (vibration).";
    $("zFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- CORE: S/ES endings chooser -------------------- */
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
    row.innerHTML = '<div><strong>'+esc(word.w)+'</strong> <span class="tiny muted">→ choose</span></div>';
    var sel = document.createElement("select");
    sel.className = "selectMini";
    sel.innerHTML = '<option value="">—</option>' + esChoices.map(function(x){ return '<option value="'+esc(x)+'">'+esc(x)+'</option>'; }).join("");
    sel.dataset.answer = word.a;
    row.appendChild(sel);
    container.appendChild(row);
  }

  function newESList(){
    $("esFeedback").textContent = ""; $("esFeedback").className = "feedback";
    $("esList").innerHTML = "";
    esSet = shuffle(esItems).slice(0, 9);
    esSet.forEach(function(it){ renderChoiceRow($("esList"), it); });
  }
  function resetES(){
    var sels = $("esList").querySelectorAll("select");
    for (var i=0;i<sels.length;i++) sels[i].value = "";
    $("esFeedback").textContent = ""; $("esFeedback").className = "feedback";
  }
  function listenES(){ if (esSet.length) speakText(esSet.map(function(x){return x.w;}).join(". ")); }
  function checkES(){
    var sels = $("esList").querySelectorAll("select");
    if (!sels.length){ $("esFeedback").textContent = "Click New list first."; $("esFeedback").className="feedback warn"; return; }
    var correct = 0, total = sels.length, filled = 0;
    for (var i=0;i<sels.length;i++){
      var val = sels[i].value;
      if (val) filled++;
      if (val === sels[i].dataset.answer) correct++;
    }
    if (filled === 0){ $("esFeedback").textContent="Choose answers first."; $("esFeedback").className="feedback warn"; return; }
    var ok = (correct === total);
    addAttempt(ok);
    $("esFeedback").textContent = ok ? "✅ Perfect!" : "❌ " + correct + " / " + total + ". Tip: /ɪz/ after s, z, sh, ch, x.";
    $("esFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- CORE: sentence fill-in (-s/-es) -------------------- */
  var sSentences = [
    { right:"watches", sentence:"Every morning he ____ TV before work.", say:"Every morning he watches TV before work." },
    { right:"plays", sentence:"She ____ tennis on Saturdays.", say:"She plays tennis on Saturdays." },
    { right:"fixes", sentence:"Our technician ____ the problem quickly.", say:"Our technician fixes the problem quickly." },
    { right:"needs", sentence:"My manager ____ an update today.", say:"My manager needs an update today." },
    { right:"washes", sentence:"He ____ the dishes after dinner.", say:"He washes the dishes after dinner." }
  ];
  var sCur = null;

  function newSentence(){
    sCur = choice(sSentences);
    $("sSentence").textContent = sCur.sentence;
    $("sInput").value = "";
    $("sFeedback").textContent = ""; $("sFeedback").className = "feedback";
  }
  function listenSentence(){ if (sCur) speakText(sCur.say); }
  function checkSentence(){
    if (!sCur) return;
    var ok = (norm($("sInput").value) === norm(sCur.right));
    addAttempt(ok);
    $("sFeedback").textContent = ok ? "✅ Correct!" : "❌ Correct answer: " + sCur.right;
    $("sFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealSentence(){
    if (!sCur) return;
    $("sInput").value = sCur.right;
    $("sFeedback").textContent = "Answer revealed. Now say the full sentence out loud.";
    $("sFeedback").className = "feedback warn";
  }

  /* -------------------- CORE: TH Quiz -------------------- */
  var thQ = [
    { word:"think", ans:"/θ/ (unvoiced)", explain:"think has /θ/ (no vibration)." },
    { word:"three", ans:"/θ/ (unvoiced)", explain:"three = /θriː/." },
    { word:"thanks", ans:"/θ/ (unvoiced)", explain:"thanks starts /θ/." },
    { word:"this", ans:"/ð/ (voiced)", explain:"this has /ð/ (vibration)." },
    { word:"that", ans:"/ð/ (voiced)", explain:"that starts /ð/." },
    { word:"there", ans:"/ð/ (voiced)", explain:"there starts /ð/." }
  ];
  var thChoices = ["/θ/ (unvoiced)","/ð/ (voiced)"];
  var thCur = null, thCount = 0;

  function newThQ(){
    thCur = choice(thQ);
    thCount++;
    $("thNum").textContent = String(thCount);
    $("thWord").textContent = thCur.word;
    $("thExplain").textContent = "Listen → choose → repeat 3×.";
    renderChoices("thChoices", thChoices, thCur.ans, function(ok){
      addAttempt(ok);
      $("thExplain").textContent = (ok ? "✅ " : "❌ ") + thCur.word + " → " + thCur.ans + ". " + thCur.explain;
    });
  }
  function listenTh(){ if (thCur) speakText(thCur.word); }

  /* -------------------- CORE: -TION sorter -------------------- */
  var tionWords = [
    { w:"nation", g:"shun" }, { w:"information", g:"shun" }, { w:"station", g:"shun" }, { w:"action", g:"shun" },
    { w:"decision", g:"zhun" }, { w:"television", g:"zhun" }, { w:"confusion", g:"zhun" }, { w:"collision", g:"zhun" }
  ];
  var tionSet = [];

  function newTionSet(){
    $("tionFeedback").textContent=""; $("tionFeedback").className="feedback";
    $("tionShun").innerHTML=""; $("tionZhun").innerHTML=""; $("tionBank").innerHTML="";
    tapState.chip = null;
    tionSet = shuffle(tionWords).slice(0, 8);
    tionSet.forEach(function(x){ $("tionBank").appendChild(makeChip(x.w, { group:x.g })); });
  }
  function resetTion(){
    $("tionFeedback").textContent=""; $("tionFeedback").className="feedback";
    $("tionShun").innerHTML=""; $("tionZhun").innerHTML=""; $("tionBank").innerHTML="";
    tionSet.forEach(function(x){ $("tionBank").appendChild(makeChip(x.w, { group:x.g })); });
    tapState.chip = null;
  }
  function listenTion(){ if (tionSet.length) speakText(tionSet.map(function(x){return x.w;}).join(". ")); }
  function checkTion(){
    var correct=0, total=0;
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
    if (total===0){ $("tionFeedback").textContent="Move words first."; $("tionFeedback").className="feedback warn"; return; }
    var ok = (correct===total);
    addAttempt(ok);
    $("tionFeedback").textContent = ok ? "✅ Perfect!" : "❌ " + correct + " / " + total + ". Tip: -tion is usually /shun/.";
    $("tionFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- CORE: ED list -------------------- */
  var edItems = [
    { w:"worked", a:"/t/" }, { w:"helped", a:"/t/" }, { w:"laughed", a:"/t/" }, { w:"missed", a:"/t/" },
    { w:"played", a:"/d/" }, { w:"called", a:"/d/" }, { w:"cleaned", a:"/d/" }, { w:"loved", a:"/d/" },
    { w:"wanted", a:"/ɪd/" }, { w:"needed", a:"/ɪd/" }, { w:"invited", a:"/ɪd/" }, { w:"decided", a:"/ɪd/" }
  ];
  var edChoices = ["/t/","/d/","/ɪd/"];
  var edSet = [];

  function newEDList(){
    $("edFeedback").textContent=""; $("edFeedback").className="feedback";
    $("edList").innerHTML="";
    edSet = shuffle(edItems).slice(0, 9);
    edSet.forEach(function(it){
      var row = document.createElement("div");
      row.className = "rowItem";
      row.innerHTML = '<div><strong>'+esc(it.w)+'</strong></div>';
      var sel = document.createElement("select");
      sel.className = "selectMini";
      sel.innerHTML = '<option value="">—</option>' + edChoices.map(function(x){return '<option value="'+esc(x)+'">'+esc(x)+'</option>';}).join("");
      sel.dataset.answer = it.a;
      row.appendChild(sel);
      $("edList").appendChild(row);
    });
  }
  function resetED(){
    var sels = $("edList").querySelectorAll("select");
    for (var i=0;i<sels.length;i++) sels[i].value = "";
    $("edFeedback").textContent=""; $("edFeedback").className="feedback";
  }
  function listenED(){ if (edSet.length) speakText(edSet.map(function(x){return x.w;}).join(". ")); }
  function checkED(){
    var sels = $("edList").querySelectorAll("select");
    if (!sels.length){ $("edFeedback").textContent="Click New list first."; $("edFeedback").className="feedback warn"; return; }
    var correct=0, total=sels.length, filled=0;
    for (var i=0;i<sels.length;i++){
      if (sels[i].value) filled++;
      if (sels[i].value === sels[i].dataset.answer) correct++;
    }
    if (filled===0){ $("edFeedback").textContent="Choose answers first."; $("edFeedback").className="feedback warn"; return; }
    var ok = (correct===total);
    addAttempt(ok);
    $("edFeedback").textContent = ok ? "✅ Perfect!" : "❌ " + correct + " / " + total + ". Tip: /ɪd/ only after t or d.";
    $("edFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* -------------------- PRO: R/L listening choice -------------------- */
  var rlPairs = [
    ["right","light"], ["glass","grass"], ["fly","fry"], ["collect","correct"], ["lead","read"], ["lock","rock"]
  ];
  var rlCur = null;

  function newRL(){
    var p = choice(rlPairs);
    var order = Math.random() < 0.5 ? p : [p[1], p[0]];
    var targetIndex = Math.random() < 0.5 ? 0 : 1;

    rlCur = {
      a: order[0],
      b: order[1],
      correct: targetIndex === 0 ? order[0] : order[1],
      say: targetIndex === 0 ? order[0] : order[1]
    };

    $("rlPrompt").textContent = "Choose what you hear:";
    $("rlA").textContent = rlCur.a;
    $("rlB").textContent = rlCur.b;
    $("rlFeedback").textContent = "";
    $("rlFeedback").className = "feedback";
    $("rlA").disabled = false; $("rlB").disabled = false;
    $("rlA").className = "choice"; $("rlB").className = "choice";
  }
  function listenRL(){ if (rlCur) speakText(rlCur.say); }
  function pickRL(picked){
    var ok = (picked === rlCur.correct);
    addAttempt(ok);
    $("rlFeedback").textContent = ok ? "✅ Correct. Repeat it 3×." : "❌ It was: " + rlCur.correct + ". Repeat both words slowly.";
    $("rlFeedback").className = "feedback " + (ok ? "ok" : "bad");
    $("rlA").disabled = true; $("rlB").disabled = true;
    if ($("rlA").textContent === rlCur.correct) $("rlA").classList.add("correct");
    if ($("rlB").textContent === rlCur.correct) $("rlB").classList.add("correct");
  }

  /* -------------------- PRO: H silent quiz -------------------- */
  var hItems = [
    { w:"hour", silent:true }, { w:"honest", silent:true }, { w:"heir", silent:true }, { w:"honor", silent:true },
    { w:"hotel", silent:false }, { w:"history", silent:false }, { w:"help", silent:false }, { w:"home", silent:false }
  ];
  var hCur = null;

  function newH(){
    hCur = choice(hItems);
    $("hWord").textContent = hCur.w;
    $("hFeedback").textContent = "Listen → decide.";
    $("hFeedback").className = "feedback";
    $("hSilent").disabled = false; $("hSound").disabled = false;
    $("hSilent").className = "choice"; $("hSound").className = "choice";
  }
  function listenH(){ if (hCur) speakText(hCur.w); }
  function pickH(isSilent){
    var ok = (isSilent === !!hCur.silent);
    addAttempt(ok);
    $("hFeedback").textContent = ok ? "✅ Correct!" : "❌ Not quite. " + hCur.w + " has " + (hCur.silent ? "a silent H." : "a pronounced H.");
    $("hFeedback").className = "feedback " + (ok ? "ok" : "bad");
    $("hSilent").disabled = true; $("hSound").disabled = true;
    (hCur.silent ? $("hSilent") : $("hSound")).classList.add("correct");
  }

  /* -------------------- PRO: Silent letters QCM -------------------- */
  var slItems = [
    { w:"know", silent:"k", options:["k","n","o"], explain:"k is silent in know/knee/knife." },
    { w:"write", silent:"w", options:["w","r","t"], explain:"w is silent in write/wrong." },
    { w:"lamb", silent:"b", options:["b","m","l"], explain:"b is silent after m: lamb/comb/climb." },
    { w:"listen", silent:"t", options:["t","s","n"], explain:"t is silent in listen/castle." },
    { w:"receipt", silent:"p", options:["p","c","t"], explain:"p is silent in receipt." },
    { w:"psychology", silent:"p", options:["p","s","y"], explain:"p is silent in psychology." }
  ];
  var slCur = null;

  function newSL(){
    slCur = choice(slItems);
    $("slWord").textContent = slCur.w;
    $("slFeedback").textContent = "Choose the silent letter.";
    renderChoices("slChoices",
      slCur.options.map(function(x){ return x; }),
      slCur.silent,
      function(ok){
        addAttempt(ok);
        $("slFeedback").textContent = (ok ? "✅ " : "❌ ") + "Silent letter: " + slCur.silent.toUpperCase() + ". " + slCur.explain;
      }
    );
  }
  function listenSL(){ if (slCur) speakText(slCur.w); }

  /* -------------------- PRO: CH quiz -------------------- */
  var chItems = [
    { w:"chair", a:"/tʃ/ (chair)", explain:"Most common CH: /tʃ/." },
    { w:"cheese", a:"/tʃ/ (chair)", explain:"cheese = /tʃiːz/." },
    { w:"chemistry", a:"/k/ (chemistry)", explain:"Some CH (Greek origin) = /k/." },
    { w:"chorus", a:"/k/ (chemistry)", explain:"chorus often = /k/." },
    { w:"chef", a:"/ʃ/ (chef)", explain:"Some loanwords: chef = /ʃ/." },
    { w:"machine", a:"/ʃ/ (chef)", explain:"machine has /ʃ/ sound." }
  ];
  var chChoices = ["/tʃ/ (chair)","/k/ (chemistry)","/ʃ/ (chef)"];
  var chCur = null;

  function newCH(){
    chCur = choice(chItems);
    $("chWord").textContent = chCur.w;
    $("chFeedback").textContent = "Choose the CH sound.";
    renderChoices("chChoices", chChoices, chCur.a, function(ok){
      addAttempt(ok);
      $("chFeedback").textContent = (ok ? "✅ " : "❌ ") + chCur.w + " → " + chCur.a + ". " + chCur.explain;
    });
  }
  function listenCH(){ if (chCur) speakText(chCur.w); }

  /* -------------------- PRO: V/W listening choice -------------------- */
  var vwPairs = [
    ["vine","wine"], ["vest","west"], ["veal","wheel"], ["vote","wrote"], ["vain","wane"]
  ];
  var vwCur = null;

  function newVW(){
    var p = choice(vwPairs);
    var order = Math.random() < 0.5 ? p : [p[1], p[0]];
    var targetIndex = Math.random() < 0.5 ? 0 : 1;

    vwCur = {
      a: order[0],
      b: order[1],
      correct: targetIndex === 0 ? order[0] : order[1],
      say: targetIndex === 0 ? order[0] : order[1]
    };

    $("vwPrompt").textContent = "Choose what you hear:";
    $("vwA").textContent = vwCur.a;
    $("vwB").textContent = vwCur.b;
    $("vwFeedback").textContent = "";
    $("vwFeedback").className = "feedback";
    $("vwA").disabled = false; $("vwB").disabled = false;
    $("vwA").className = "choice"; $("vwB").className = "choice";
  }
  function listenVW(){ if (vwCur) speakText(vwCur.say); }
  function pickVW(picked){
    var ok = (picked === vwCur.correct);
    addAttempt(ok);
    $("vwFeedback").textContent = ok ? "✅ Correct. Repeat it 3×." : "❌ It was: " + vwCur.correct + ". Watch lips: V (teeth/lip), W (rounded).";
    $("vwFeedback").className = "feedback " + (ok ? "ok" : "bad");
    $("vwA").disabled = true; $("vwB").disabled = true;
    if ($("vwA").textContent === vwCur.correct) $("vwA").classList.add("correct");
    if ($("vwB").textContent === vwCur.correct) $("vwB").classList.add("correct");
  }

  /* -------------------- PRO: J quick check -------------------- */
  var jItems = [
    { w:"job", a:"/dʒ/ (job)", explain:"Most J words are /dʒ/." },
    { w:"just", a:"/dʒ/ (job)", explain:"just starts /dʒ/." },
    { w:"major", a:"/dʒ/ (job)", explain:"major has /dʒ/." },
    { w:"jam", a:"/dʒ/ (job)", explain:"jam starts /dʒ/." },
    { w:"genre", a:"/ʒ/ (genre)", explain:"genre often starts /ʒ/ (loanword; some variation by accent)." }
  ];
  var jChoices = ["/dʒ/ (job)","/ʒ/ (genre)"];
  var jCur = null;

  function newJ(){
    jCur = choice(jItems);
    $("jWord").textContent = jCur.w;
    $("jFeedback").textContent = "Choose the starting sound.";
    renderChoices("jChoices", jChoices, jCur.a, function(ok){
      addAttempt(ok);
      $("jFeedback").textContent = (ok ? "✅ " : "❌ ") + jCur.w + " → " + jCur.a + ". " + jCur.explain;
    });
  }
  function listenJ(){ if (jCur) speakText(jCur.w); }

  /* -------------------- PRO: Schwa weak-word marking -------------------- */
  var swDrills = [
    {
      text:"I can do it in a minute.",
      weak:["can","do","it","in","a"],
      hint:"Weak words often include: can, do, it, in, a (content word = minute).",
      say:"I can do it in a minute."
    },
    {
      text:"Do you want to go to the station?",
      weak:["you","to","to","the"],
      hint:"Content words: want, go, station. Weak: you, to, the (and sometimes do).",
      say:"Do you want to go to the station?"
    },
    {
      text:"I need to call you in the morning.",
      weak:["to","you","in","the"],
      hint:"Content words: need, call, morning. Weak: to, you, in, the.",
      say:"I need to call you in the morning."
    },
    {
      text:"Can you send me the details by email?",
      weak:["you","me","the","by"],
      hint:"Content words: send, details, email. Weak: you, me, the, by.",
      say:"Can you send me the details by email?"
    }
  ];
  var swCur = null;

  function wordsFromSentence(s){
    // keep punctuation attached to word chips for readability
    return String(s).split(/\s+/).filter(Boolean);
  }

  function baseWord(w){
    return String(w).toLowerCase().replace(/[^\w']/g,"");
  }

  function newSW(){
    swCur = choice(swDrills);
    $("swFeedback").textContent = "Tap weak words, then check.";
    $("swFeedback").className = "feedback";
    $("swHint").textContent = "";
    var box = $("swSentence");
    box.innerHTML = "";

    var words = wordsFromSentence(swCur.text);
    for (var i=0;i<words.length;i++){
      (function(){
        var raw = words[i];
        var chip = document.createElement("span");
        chip.className = "wchip";
        chip.textContent = raw;
        chip.dataset.base = baseWord(raw);
        chip.addEventListener("click", function(){
          chip.classList.toggle("weak");
        });
        box.appendChild(chip);
      })();
    }
  }

  function listenSW(){ if (swCur) speakText(swCur.say); }

  function clearSW(){
    var chips = $("swSentence").querySelectorAll(".wchip");
    for (var i=0;i<chips.length;i++) chips[i].classList.remove("weak");
    $("swFeedback").textContent = "Cleared. Mark weak words again.";
    $("swFeedback").className = "feedback warn";
    $("swHint").textContent = "";
  }

  function checkSW(){
    if (!swCur) return;
    var chips = $("swSentence").querySelectorAll(".wchip");
    if (!chips.length) return;

    // weak list may contain duplicates ("to" appears twice); handle by counting
    var expectedCount = {};
    for (var i=0;i<swCur.weak.length;i++){
      var bw = baseWord(swCur.weak[i]);
      expectedCount[bw] = (expectedCount[bw] || 0) + 1;
    }

    var pickedCount = {};
    for (var j=0;j<chips.length;j++){
      if (chips[j].classList.contains("weak")){
        var b = chips[j].dataset.base;
        pickedCount[b] = (pickedCount[b] || 0) + 1;
      }
    }

    // score: compare counts by word (simple and fair)
    var totalSlots = 0, correctSlots = 0;
    for (var k in expectedCount){
      if (Object.prototype.hasOwnProperty.call(expectedCount,k)){
        totalSlots += expectedCount[k];
        var p = pickedCount[k] || 0;
        correctSlots += Math.min(expectedCount[k], p);
      }
    }

    // also penalize extra weak picks
    var extras = 0;
    for (var kk in pickedCount){
      if (Object.prototype.hasOwnProperty.call(pickedCount,kk)){
        var exp = expectedCount[kk] || 0;
        if (pickedCount[kk] > exp) extras += (pickedCount[kk] - exp);
      }
    }

    var ok = (correctSlots === totalSlots && extras === 0);
    addAttempt(ok);

    $("swFeedback").textContent = ok
      ? "✅ Perfect! Now listen and repeat the sentence with strong/weak rhythm."
      : "❌ Not quite. Correct weak words ≈ " + correctSlots + " / " + totalSlots + (extras ? (" (extras picked: "+extras+")") : "") + ".";
    $("swFeedback").className = "feedback " + (ok ? "ok" : "bad");
    $("swHint").textContent = "Hint: " + swCur.hint;
  }

  /* -------------------- Scenarios + Stress -------------------- */
  var scenarios = [
    {
      title:"Hotel (TH + linking)",
      prompt:"Choose the most natural sentence (then repeat it).",
      say:"Hi. Can I have three towels, please? Thanks.",
      correct: 0,
      choices:[
        "Hi. Can I have three towels, please? Thanks.",
        "Hi. Can I have tree towels please? Tanks.",
        "Hello. I want three towel. Thank you very much."
      ]
    },
    {
      title:"Phone (Z + rhythm)",
      prompt:"Choose the best sentence.",
      say:"It’s easy: tisha dot demo at gmail dot com.",
      correct: 0,
      choices:[
        "It’s easy: tisha dot demo at gmail dot com.",
        "It is eassy: tisha point demo arobase gmail point com.",
        "It’s easy: tisha dote demo at jemail dote com."
      ]
    },
    {
      title:"Work update (-ED)",
      prompt:"Choose the best sentence.",
      say:"I emailed the client and I fixed the issue.",
      correct: 0,
      choices:[
        "I emailed the client and I fixed the issue.",
        "I e-mailed-ed the client and I fix-ed the issue.",
        "I email the client and I fixeded the issue."
      ]
    }
  ];
  var scCur = null;

  function newScenario(){
    scCur = choice(scenarios);
    $("scTitle").textContent = scCur.title;
    $("scPrompt").textContent = scCur.prompt;
    $("scFeedback").textContent = ""; $("scFeedback").className = "feedback";
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
        var all = box.querySelectorAll(".choice");
        for (var i=0;i<all.length;i++){
          all[i].disabled = true;
          if (i === scCur.correct) all[i].classList.add("correct");
        }
        b.classList.add(ok ? "correct" : "wrong");
        $("scFeedback").textContent = ok ? "✅ Nice. Shadow it 3×." : "❌ Choose the most natural sentence.";
        $("scFeedback").className = "feedback " + (ok ? "ok" : "bad");
      });
      box.appendChild(b);
    });
  }
  function listenScenario(){ if (scCur) speakText(scCur.say); }

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
        $("stFeedback").textContent = ok ? "✅ Correct!" : "❌ Not quite. Notice the strong beat.";
        $("stFeedback").className = "feedback " + (ok ? "ok" : "bad");
      });
      box.appendChild(b);
    });
  }
  function listenStress(){ if (stCur) speakText(stCur.word); }

  /* -------------------- Init -------------------- */
  function init(){
    // controls
    $("accent").addEventListener("change", function(){ speech.accent = $("accent").value; pickVoice(); });
    $("rate").addEventListener("input", function(){
      speech.rate = parseFloat($("rate").value);
      $("rateLabel").textContent = speech.rate.toFixed(2) + "×";
    });
    $("btnTest").addEventListener("click", function(){
      speakText("Test voice. Repeat after me: three. sheep. decision. watches. right. light. vine. wine.");
    });
    $("btnStop").addEventListener("click", stopSpeak);

    // timers
    renderTimer();
    $("btnStart60").addEventListener("click", function(){ setTimer(3600); });
    $("btnStart80").addEventListener("click", function(){ setTimer(4800); });
    $("btnResetTimer").addEventListener("click", resetTimer);

    // print + cheat listen
    $("btnPrint").addEventListener("click", function(){ window.print(); });
    $("btnCheatListen").addEventListener("click", function(){
      speakText("Ship. Sheep. Friend. Receive. My. Happy. Easy. Watches. Think. This. Nation. Decision. Worked. Played. Wanted. Right. Light. Vine. Wine.");
    });

    // say buttons
    wireSayButtons();

    // flashcards
    renderFlashcards("flashcards1", flash1);
    $("fcShuffle1").addEventListener("click", function(){
      flash1 = shuffle(flash1);
      renderFlashcards("flashcards1", flash1);
    });
    $("fcListenRandom1").addEventListener("click", function(){ speakText(choice(flash1).say); });

    // dropzones
    wireDropzone($("iShort"));
    wireDropzone($("iLong"));
    wireDropzone($("tionShun"));
    wireDropzone($("tionZhun"));

    // core bindings
    $("iNew").addEventListener("click", newISet);
    $("iReset").addEventListener("click", resetI);
    $("iListen").addEventListener("click", listenI);
    $("iCheck").addEventListener("click", checkI);
    newISet();

    $("ieNew").addEventListener("click", newIeQ);
    $("ieListen").addEventListener("click", listenIe);
    newIeQ();

    $("yNew").addEventListener("click", newYQ);
    $("yListen").addEventListener("click", listenY);
    newYQ();

    $("zNew").addEventListener("click", newZSet);
    $("zListen").addEventListener("click", listenZSet);
    $("zCheck").addEventListener("click", checkZ);
    $("zClear").addEventListener("click", clearZ);
    newZSet();

    $("esNew").addEventListener("click", newESList);
    $("esListen").addEventListener("click", listenES);
    $("esCheck").addEventListener("click", checkES);
    $("esReset").addEventListener("click", resetES);
    newESList();

    $("sNew").addEventListener("click", newSentence);
    $("sListen").addEventListener("click", listenSentence);
    $("sCheck").addEventListener("click", checkSentence);
    $("sReveal").addEventListener("click", revealSentence);
    newSentence();

    $("thNew").addEventListener("click", newThQ);
    $("thListen").addEventListener("click", listenTh);
    newThQ();

    $("tionNew").addEventListener("click", newTionSet);
    $("tionListen").addEventListener("click", listenTion);
    $("tionReset").addEventListener("click", resetTion);
    $("tionCheck").addEventListener("click", checkTion);
    newTionSet();

    $("edNew").addEventListener("click", newEDList);
    $("edListen").addEventListener("click", listenED);
    $("edCheck").addEventListener("click", checkED);
    $("edReset").addEventListener("click", resetED);
    newEDList();

    // scenarios + stress
    $("scNew").addEventListener("click", newScenario);
    $("scListen").addEventListener("click", listenScenario);
    newScenario();

    $("stNew").addEventListener("click", newStress);
    $("stListen").addEventListener("click", listenStress);
    newStress();

    // PRO bindings
    $("rlNew").addEventListener("click", newRL);
    $("rlListen").addEventListener("click", listenRL);
    $("rlA").addEventListener("click", function(){ pickRL($("rlA").textContent); });
    $("rlB").addEventListener("click", function(){ pickRL($("rlB").textContent); });
    newRL();

    $("hNew").addEventListener("click", newH);
    $("hListen").addEventListener("click", listenH);
    $("hSilent").addEventListener("click", function(){ pickH(true); });
    $("hSound").addEventListener("click", function(){ pickH(false); });
    newH();

    $("slNew").addEventListener("click", newSL);
    $("slListen").addEventListener("click", listenSL);
    newSL();

    $("chNew").addEventListener("click", newCH);
    $("chListen").addEventListener("click", listenCH);
    newCH();

    $("vwNew").addEventListener("click", newVW);
    $("vwListen").addEventListener("click", listenVW);
    $("vwA").addEventListener("click", function(){ pickVW($("vwA").textContent); });
    $("vwB").addEventListener("click", function(){ pickVW($("vwB").textContent); });
    newVW();

    $("jNew").addEventListener("click", newJ);
    $("jListen").addEventListener("click", listenJ);
    newJ();

    $("swNew").addEventListener("click", newSW);
    $("swListen").addEventListener("click", listenSW);
    $("swCheck").addEventListener("click", checkSW);
    $("swClear").addEventListener("click", clearSW);
    newSW();

    // voices
    if (window.speechSynthesis){
      loadVoices();
      window.speechSynthesis.onvoiceschanged = function(){ loadVoices(); };
    }
  }

  init();
})();
