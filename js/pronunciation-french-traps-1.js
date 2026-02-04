/* SpeakEasyTisha — Pronunciation Masterclass (French Traps) — 60 min
   Minimal pairs + Flashcards + TH QCM + S/ES sorting + -ED sorting + vowel quiz + Y/Z sorting + TION quiz + rhythm fill-in
   US/UK speechSynthesis, timer, score, hints. Touch-friendly for iPad Safari.
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

  // Warm-up minimal pairs (listen then choose)
  var WARMUP = [
    { title:"TH /θ/ vs S", prompt:"What did you hear?", say:"think", hint:"Tongue between teeth: think.", correct:0, choices:["think","sink","zinc"] },
    { title:"TH /ð/ vs Z", prompt:"What did you hear?", say:"this", hint:"Voiced TH: this/that/these.", correct:1, choices:["zis","this","dis"] },
    { title:"Short i /ɪ/ vs long ee /iː/", prompt:"What did you hear?", say:"ship", hint:"ship (short) vs sheep (long).", correct:0, choices:["ship","sheep","cheap"] },
    { title:"Short i /ɪ/ vs long i /aɪ/", prompt:"What did you hear?", say:"sit", hint:"sit vs site.", correct:0, choices:["sit","seat","site"] },
    { title:"S ending /s/ vs /z/", prompt:"What did you hear?", say:"bags", hint:"‘bags’ ends with /z/ (voiced).", correct:2, choices:["backs","bats","bags"] }
  ];

  // Flashcards (tagged)
  var FLASH = [
    { tag:"endings", front:"S/ES endings: /s/ /z/ /ɪz/", back:"FR: le -s se prononce (souvent).\n/s/ after voiceless (packs)\n/z/ after voiced (bags)\n/ɪz/ after s/sh/ch/x/z (watches)", say:"packs. bags. watches." },
    { tag:"endings", front:"-ED endings: /t/ /d/ /ɪd/", back:"FR: pas toujours ‘ed’.\n/t/: worked, watched\n/d/: played, cleaned\n/ɪd/: wanted, needed", say:"worked. played. wanted." },
    { tag:"endings", front:"Final -s must be heard", back:"FR: ne pas ‘manger’ la fin.\nHe likes it. She works. Two bags.", say:"He likes it. She works. Two bags." },

    { tag:"vowels", front:"IE often /iː/ (but friend!)", back:"piece /piːs/, field /fiːld/, believe /bɪˈliːv/\nBUT friend /frend/.", say:"piece. field. believe. friend." },
    { tag:"vowels", front:"EI often /eɪ/ (but their!)", back:"eight, weigh, vein\nBUT their /ðeər/.", say:"eight. weigh. vein. their." },
    { tag:"vowels", front:"I can be /ɪ/ /aɪ/ /iː/", back:"sit /ɪ/, site /aɪ/, machine /iː/.", say:"sit. site. machine." },

    { tag:"tion", front:"-tion → /ʃən/ (shun)", back:"nation, station, information\nNOT ‘tee-on’.", say:"nation. station. information." },
    { tag:"tion", front:"-sion often /ʒən/ or /ʃən/", back:"television /ˈtelɪˌvɪʒən/\ndecision /dɪˈsɪʒən/\nimpression /ɪmˈpreʃən/", say:"television. decision. impression." },

    { tag:"tion", front:"Stress matters", back:"FR: l’accent change le rythme.\ninforMAtion, deCI­sion.", say:"information. decision." }
  ];

  // TH QCM
  var THQ = [
    { title:"TH /θ/", prompt:"Choose the best spelling for the sound you hear.", say:"three", hint:"Voiceless TH: air, no voice.", correct:0, choices:["three","zree","sree"] },
    { title:"TH /ð/", prompt:"Choose the best spelling for the sound you hear.", say:"these", hint:"Voiced TH: this/that/these.", correct:1, choices:["zees","these","dese"] },
    { title:"TH in travel", prompt:"Choose the most natural phrase (and say it).", say:"Can I have this one, please?", hint:"‘this’ = voiced TH.", correct:2, choices:["Can I have zis one?","Can I have dis one?","Can I have this one, please?"] }
  ];

  // S/ES sorting sets
  var SSETS = [
    {
      hint:"/ɪz/ after s, sh, ch, x, z (watches, buses). /s/ after p, t, k, f. /z/ after vowels + voiced sounds.",
      words:[
        { w:"packs", cat:"S" }, { w:"stops", cat:"S" }, { w:"laughs", cat:"S" },
        { w:"bags", cat:"Z" }, { w:"plays", cat:"Z" }, { w:"arrives", cat:"Z" },
        { w:"watches", cat:"IZ" }, { w:"buses", cat:"IZ" }, { w:"changes", cat:"IZ" }
      ]
    },
    {
      hint:"Listen to the last sound before -s (voiced or not).",
      words:[
        { w:"books", cat:"S" }, { w:"takes", cat:"S" }, { w:"maps", cat:"S" },
        { w:"calls", cat:"Z" }, { w:"drives", cat:"Z" }, { w:"goes", cat:"Z" },
        { w:"matches", cat:"IZ" }, { w:"dishes", cat:"IZ" }, { w:"boxes", cat:"IZ" }
      ]
    }
  ];

  // -ED sorting sets
  var ESETS = [
    {
      hint:"/ɪd/ after t or d (wanted, needed).",
      words:[
        { w:"worked", cat:"T" }, { w:"stopped", cat:"T" }, { w:"watched", cat:"T" },
        { w:"played", cat:"D" }, { w:"cleaned", cat:"D" }, { w:"called", cat:"D" },
        { w:"wanted", cat:"ID" }, { w:"needed", cat:"ID" }, { w:"decided", cat:"ID" }
      ]
    },
    {
      hint:"Try saying just the ending: /t/ /d/ /ɪd/.",
      words:[
        { w:"helped", cat:"T" }, { w:"asked", cat:"T" }, { w:"finished", cat:"T" },
        { w:"opened", cat:"D" }, { w:"lived", cat:"D" }, { w:"arrived", cat:"D" },
        { w:"started", cat:"ID" }, { w:"visited", cat:"ID" }, { w:"wanted", cat:"ID" }
      ]
    }
  ];

  // -ED fill-in (type t/d/id)
  var EDFILL = [
    { sentence:"worked → ending sound = ____", answer:"t", say:"worked", hint:"k + t is voiceless → /t/." },
    { sentence:"played → ending sound = ____", answer:"d", say:"played", hint:"vowel + voiced → /d/." },
    { sentence:"wanted → ending sound = ____", answer:"id", say:"wanted", hint:"after t/d add syllable /ɪd/." },
    { sentence:"cleaned → ending sound = ____", answer:"d", say:"cleaned", hint:"n is voiced → /d/." },
    { sentence:"watched → ending sound = ____", answer:"t", say:"watched", hint:"ch is voiceless → /t/." }
  ];

  var EDPROMPTS = [
    "Yesterday I worked and I stopped early.",
    "I played soccer and I cleaned my room.",
    "We wanted to go, but we needed more time.",
    "She decided to stay. He visited us.",
    "They arrived and checked in."
  ];

  // Vowel quiz (hear word, choose group)
  var VQ = [
    { title:"IE", prompt:"Which word did you hear?", say:"piece", hint:"IE often /iː/ like ‘ee’.", correct:0, choices:["piece","price","peaceful"] },
    { title:"EI", prompt:"Which word did you hear?", say:"eight", hint:"EI often /eɪ/ like ‘day’.", correct:2, choices:["it","ate","eight"] },
    { title:"I /ɪ/", prompt:"Which word did you hear?", say:"sit", hint:"Short i: sit, live, ticket.", correct:1, choices:["seat","sit","site"] },
    { title:"I /aɪ/", prompt:"Which word did you hear?", say:"site", hint:"Long i: time, five, site.", correct:0, choices:["site","seat","sit"] },
    { title:"Exception", prompt:"Which word did you hear?", say:"friend", hint:"friend = /frend/ (not /friːnd/).", correct:2, choices:["fiend","freed","friend"] }
  ];

  // Y/Z sorting
  var YZSETS = [
    {
      hint:"Y at the start is usually /j/ (yes). End -y is often /i/ (happy).",
      words:[
        { w:"yes", cat:"J" }, { w:"yellow", cat:"J" },
        { w:"my", cat:"AI" }, { w:"try", cat:"AI" },
        { w:"happy", cat:"I" }, { w:"city", cat:"I" },
        { w:"zero", cat:"Z" }, { w:"zoo", cat:"Z" }
      ]
    },
    {
      hint:"Z stays voiced /z/ (buzz).",
      words:[
        { w:"yoga", cat:"J" }, { w:"year", cat:"J" },
        { w:"fly", cat:"AI" }, { w:"why", cat:"AI" },
        { w:"family", cat:"I" }, { w:"busy", cat:"I" },
        { w:"zip", cat:"Z" }, { w:"buzz", cat:"Z" }
      ]
    }
  ];

  // -TION quiz (choose best spelling after listening)
  var NQ = [
    { title:"-tion", prompt:"Choose the word you heard.", say:"information", hint:"-tion often sounds like ‘shun’.", correct:1, choices:["informatee-on","information","informashon"] },
    { title:"-tion", prompt:"Choose the word you heard.", say:"station", hint:"sta-‘shun’.", correct:2, choices:["statyon","statie-on","station"] },
    { title:"-sion", prompt:"Choose the word you heard.", say:"television", hint:"Often /ʒən/ in ‘television’.", correct:0, choices:["television","televisyon","televizion"] },
    { title:"-sion", prompt:"Choose the word you heard.", say:"decision", hint:"de-‘ci-zhun’.", correct:1, choices:["de-ci-sion (tee-on)","decision","desizion"] }
  ];

  // Rhythm fill-in (type gonna/wanna/kinda)
  var RHY = [
    { sentence:"I’m ____ head out. (going to)", answer:"gonna", say:"I'm gonna head out.", hint:"‘going to’ → ‘gonna’ (casual)." },
    { sentence:"Do you ____ grab coffee? (want to)", answer:"wanna", say:"Do you wanna grab coffee?", hint:"‘want to’ → ‘wanna’ (casual)." },
    { sentence:"I ____ need help. (kind of)", answer:"kinda", say:"I kinda need help.", hint:"‘kind of’ → ‘kinda’." }
  ];

  var CHEAT = [
    { title:"TH", items:[
      "/θ/ think, three, thank (no voice)",
      "/ð/ this, that, these (voice on)",
      "Tongue between teeth (not ‘z’)"
    ]},
    { title:"S/ES endings", items:[
      "/s/ packs, stops, laughs",
      "/z/ bags, plays, arrives",
      "/ɪz/ watches, buses, changes"
    ]},
    { title:"-ED endings", items:[
      "/t/ worked, watched, stopped",
      "/d/ played, cleaned, called",
      "/ɪd/ wanted, needed, decided"
    ]},
    { title:"Vowels + TION", items:[
      "friend = /frend/ (exception)",
      "IE often /iː/: piece, field",
      "-tion = ‘shun’: information",
      "-sion often ‘zhun’: decision"
    ]}
  ];

  /* ===================== Helpers ===================== */
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
      $(bankId).appendChild(makeChip(chips[i].w, { cat: chips[i].cat }));
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
      $("wFeedback").textContent = ok ? "✅ Nice! Now repeat it twice." : "❌ Listen again and focus on the mouth/tongue.";
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

  /* ===================== TH QCM ===================== */
  var tCur = null;
  function newTH(){
    tCur = choice(THQ);
    $("tTitle").textContent = tCur.title;
    $("tPrompt").textContent = tCur.prompt;
    $("tHint").textContent = "";
    $("tFeedback").textContent = ""; $("tFeedback").className = "feedback";

    renderChoices("tChoices", tCur.choices, tCur.correct, function(ok){
      $("tFeedback").textContent = ok ? "✅ Great. Now SAY it clearly." : "❌ French trap: don’t replace TH with Z/S/D.";
      $("tFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenTH(){ if (tCur) speakText(tCur.say); }
  function hintTH(){ if (tCur) $("tHint").textContent = tCur.hint; }

  /* ===================== S endings sorting ===================== */
  var sCur = null, sWords = [];
  function newSSet(){
    sCur = choice(SSETS);
    sWords = sCur.words.slice();
    $("sFeedback").textContent = ""; $("sFeedback").className = "feedback";
    $("sHint").textContent = "";
    resetChips("sBank", sWords, ["sS","sZ","sIZ"]);
  }
  function resetS(){ resetChips("sBank", sWords, ["sS","sZ","sIZ"]); $("sFeedback").textContent=""; $("sFeedback").className="feedback"; $("sHint").textContent=""; }
  function listenS(){
    if (!sWords.length) return;
    speakText(sWords.map(function(x){ return x.w; }).join(". "));
  }
  function hintS(){ if (sCur) $("sHint").textContent = sCur.hint; }
  function checkS(){
    var res = checkZones([{zoneId:"sS", cat:"S"},{zoneId:"sZ", cat:"Z"},{zoneId:"sIZ", cat:"IZ"}]);
    if (res.total === 0){
      $("sFeedback").textContent = "Move words into the boxes first.";
      $("sFeedback").className = "feedback warn";
      return;
    }
    addAttempt(res.ok);
    $("sFeedback").textContent = res.ok ? "✅ Perfect! Now say each word clearly." : ("❌ " + res.correct + " / " + res.total + ". Check /ɪz/ words (watches, buses…).");
    $("sFeedback").className = "feedback " + (res.ok ? "ok" : "bad");
  }

  /* ===================== -ED sorting ===================== */
  var eCur = null, eWords = [];
  function newESet(){
    eCur = choice(ESETS);
    eWords = eCur.words.slice();
    $("eFeedback").textContent = ""; $("eFeedback").className = "feedback";
    $("eHint").textContent = "";
    resetChips("eBank", eWords, ["eT","eD","eID"]);
  }
  function resetE(){ resetChips("eBank", eWords, ["eT","eD","eID"]); $("eFeedback").textContent=""; $("eFeedback").className="feedback"; $("eHint").textContent=""; }
  function listenE(){ if (!eWords.length) return; speakText(eWords.map(function(x){ return x.w; }).join(". ")); }
  function hintE(){ if (eCur) $("eHint").textContent = eCur.hint; }
  function checkE(){
    var res = checkZones([{zoneId:"eT", cat:"T"},{zoneId:"eD", cat:"D"},{zoneId:"eID", cat:"ID"}]);
    if (res.total === 0){
      $("eFeedback").textContent = "Move words into the boxes first.";
      $("eFeedback").className = "feedback warn";
      return;
    }
    addAttempt(res.ok);
    $("eFeedback").textContent = res.ok ? "✅ Great! Now read them in a sentence." : ("❌ " + res.correct + " / " + res.total + ". Remember: after t/d → /ɪd/.");
    $("eFeedback").className = "feedback " + (res.ok ? "ok" : "bad");
  }

  // -ED fill-in
  var efCur = null;
  function newEF(){
    efCur = choice(EDFILL);
    $("efSentence").textContent = efCur.sentence;
    $("efInput").value = "";
    $("efHint").textContent = "";
    $("efFeedback").textContent = ""; $("efFeedback").className="feedback";
  }
  function listenEF(){ if (efCur) speakText(efCur.say); }
  function hintEF(){ if (efCur) $("efHint").textContent = efCur.hint; }
  function checkEF(){
    if (!efCur) return;
    var v = norm($("efInput").value);
    var ok = (v === norm(efCur.answer));
    addAttempt(ok);
    $("efFeedback").textContent = ok ? "✅ Correct!" : ("❌ Expected: " + efCur.answer);
    $("efFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealEF(){
    if (!efCur) return;
    $("efInput").value = efCur.answer;
    $("efFeedback").textContent = "Answer revealed — now say the word twice.";
    $("efFeedback").className = "feedback warn";
  }

  // prompts
  var edCurPrompts = [];
  function newEDPrompts(){
    edCurPrompts = shuffle(EDPROMPTS).slice(0, 4);
    var box = $("edPrompts");
    box.innerHTML = "";
    for (var i=0;i<edCurPrompts.length;i++){
      var d = document.createElement("div");
      d.className = "prompt";
      d.textContent = "🗣️ " + edCurPrompts[i];
      box.appendChild(d);
    }
  }
  function listenOneEDPrompt(){
    if (!edCurPrompts.length) return;
    speakText(choice(edCurPrompts));
  }

  /* ===================== Vowel quiz ===================== */
  var vCur = null;
  function newV(){
    vCur = choice(VQ);
    $("vTitle").textContent = vCur.title;
    $("vPrompt").textContent = vCur.prompt;
    $("vHint").textContent = "";
    $("vFeedback").textContent = ""; $("vFeedback").className = "feedback";

    renderChoices("vChoices", vCur.choices, vCur.correct, function(ok){
      $("vFeedback").textContent = ok ? "✅ Nice. Repeat it twice." : "❌ Listen again. Focus on vowel length.";
      $("vFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenV(){ if (vCur) speakText(vCur.say); }
  function hintV(){ if (vCur) $("vHint").textContent = vCur.hint; }

  /* ===================== Y/Z sorting ===================== */
  var yzCur = null, yzWords = [];
  function newYZ(){
    yzCur = choice(YZSETS);
    yzWords = yzCur.words.slice();
    $("yzFeedback").textContent = ""; $("yzFeedback").className = "feedback";
    $("yzHint").textContent = "";
    resetChips("yzBank", yzWords, ["yzJ","yzAI","yzI","yzZ"]);
  }
  function resetYZ(){ resetChips("yzBank", yzWords, ["yzJ","yzAI","yzI","yzZ"]); $("yzFeedback").textContent=""; $("yzFeedback").className="feedback"; $("yzHint").textContent=""; }
  function listenYZ(){ if (!yzWords.length) return; speakText(yzWords.map(function(x){ return x.w; }).join(". ")); }
  function hintYZ(){ if (yzCur) $("yzHint").textContent = yzCur.hint; }
  function checkYZ(){
    var res = checkZones([{zoneId:"yzJ", cat:"J"},{zoneId:"yzAI", cat:"AI"},{zoneId:"yzI", cat:"I"},{zoneId:"yzZ", cat:"Z"}]);
    if (res.total === 0){
      $("yzFeedback").textContent = "Move words into the boxes first.";
      $("yzFeedback").className = "feedback warn";
      return;
    }
    addAttempt(res.ok);
    $("yzFeedback").textContent = res.ok ? "✅ Great! Now say them with clear vowels." : ("❌ " + res.correct + " / " + res.total + ". Remember: happy/city end in /i/.");
    $("yzFeedback").className = "feedback " + (res.ok ? "ok" : "bad");
  }

  /* ===================== -TION quiz ===================== */
  var nCur = null;
  function newN(){
    nCur = choice(NQ);
    $("nTitle").textContent = nCur.title;
    $("nPrompt").textContent = nCur.prompt;
    $("nHint").textContent = "";
    $("nFeedback").textContent = ""; $("nFeedback").className = "feedback";

    renderChoices("nChoices", nCur.choices, nCur.correct, function(ok){
      $("nFeedback").textContent = ok ? "✅ Yes. Now say it: ‘shun / zhun’." : "❌ Don’t say ‘tee-on’.";
      $("nFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenN(){ if (nCur) speakText(nCur.say); }
  function hintN(){ if (nCur) $("nHint").textContent = nCur.hint; }

  /* ===================== Rhythm fill-in ===================== */
  var rCur2 = null;
  function newR2(){
    rCur2 = choice(RHY);
    $("rSentence2").textContent = rCur2.sentence;
    $("rInput2").value = "";
    $("rHint2").textContent = "";
    $("rFeedback2").textContent = ""; $("rFeedback2").className="feedback";
  }
  function listenR2(){ if (rCur2) speakText(rCur2.say); }
  function hintR2(){ if (rCur2) $("rHint2").textContent = rCur2.hint; }
  function checkR2(){
    if (!rCur2) return;
    var v = norm($("rInput2").value);
    var ok = (v === norm(rCur2.answer));
    addAttempt(ok);
    $("rFeedback2").textContent = ok ? "✅ Correct! Now say the full sentence with rhythm." : ("❌ Expected: " + rCur2.answer);
    $("rFeedback2").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealR2(){
    if (!rCur2) return;
    $("rInput2").value = rCur2.answer;
    $("rFeedback2").textContent = "Answer revealed — say it twice: slow then normal.";
    $("rFeedback2").className = "feedback warn";
  }

  /* ===================== Final Mission builder ===================== */
  function buildScript(name, city, scene, level){
    var slowNote = (level === "slow") ? " (slow + clear)" : "";
    var lines = [];
    lines.push("PRONUNCIATION MISSION" + slowNote);
    lines.push("Name: " + name + " • City: " + city);
    lines.push("");

    if (scene === "hotel"){
      lines.push("Hi—sorry to bother you. This is " + name + ".");
      lines.push("I’m having an issue with the room—there’s noise, and the AC isn’t working.");
      lines.push("Is there any way to switch rooms?");
      lines.push("I needed a quiet room because I worked today and I’m exhausted.");
      lines.push("Thanks—I really appreciate it.");
    } else if (scene === "airport"){
      lines.push("Hi—this is " + name + ". I think my flight is delayed.");
      lines.push("Do you know how long the delay is?");
      lines.push("I needed to catch a connection.");
      lines.push("Is there any way to rebook me?");
      lines.push("Thanks—this information really helps.");
    } else if (scene === "restaurant"){
      lines.push("Hi—sorry. This isn’t what I ordered.");
      lines.push("Is there any way to fix it?");
      lines.push("I wanted the chicken, but I got the fish.");
      lines.push("Thanks—everything’s all good.");
    } else {
      lines.push("Hi—could you pick me up at the station?");
      lines.push("I’m running late—my bad.");
      lines.push("Please drop me off at this address.");
      lines.push("Thanks—this is perfect.");
    }

    lines.push("");
    lines.push("Focus sounds: TH (this/think), endings (works/played/wanted), -tion (information), rhythm (gonna/kinda).");
    return lines.join("\n");
  }

  function generateScript(){
    var name = ($("mName").value || "Alex").trim();
    var city = ($("mCity").value || "Boston").trim();
    var scene = $("mScene").value;
    var level = $("mLevel").value;

    var script = buildScript(name, city, scene, level);
    $("scriptBox").textContent = script;
    $("genFeedback").textContent = "✅ Script generated. Now click “Listen” and repeat twice.";
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
    speakText("Think. This. These. Three. Packs. Bags. Watches. Worked. Played. Wanted. Information. Decision. I'm gonna head out. I kinda need help.");
  }

  /* ===================== Init ===================== */
  function init(){
    // controls
    $("accent").addEventListener("change", function(){ speech.accent = $("accent").value; pickVoice(); });
    $("rate").addEventListener("input", function(){
      speech.rate = parseFloat($("rate").value);
      $("rateLabel").textContent = speech.rate.toFixed(2) + "×";
    });
    $("btnTest").addEventListener("click", function(){
      speakText("Test voice. Repeat: think, this, these. packs, bags, watches. worked, played, wanted. information.");
    });
    $("btnStop").addEventListener("click", stopSpeak);

    // timer + print
    renderTimer();
    $("btnStart60").addEventListener("click", function(){ setTimer(3600); });
    $("btnResetTimer").addEventListener("click", resetTimer);
    $("btnPrint").addEventListener("click", function(){ window.print(); });
    $("btnCheatListen").addEventListener("click", listenCheat);

    // say buttons
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
    $("fcSetEndings").addEventListener("click", function(){ renderFlashcards("endings"); });
    $("fcSetVowels").addEventListener("click", function(){ renderFlashcards("vowels"); });
    $("fcSetTion").addEventListener("click", function(){ renderFlashcards("tion"); });

    // th
    $("tNew").addEventListener("click", newTH);
    $("tListen").addEventListener("click", listenTH);
    $("tHintBtn").addEventListener("click", hintTH);
    newTH();

    // s endings
    wireDropzone($("sS")); wireDropzone($("sZ")); wireDropzone($("sIZ"));
    $("sNew").addEventListener("click", newSSet);
    $("sListen").addEventListener("click", listenS);
    $("sHintBtn").addEventListener("click", hintS);
    $("sCheck").addEventListener("click", checkS);
    $("sReset").addEventListener("click", resetS);
    newSSet();

    // ed
    wireDropzone($("eT")); wireDropzone($("eD")); wireDropzone($("eID"));
    $("eNew").addEventListener("click", newESet);
    $("eListen").addEventListener("click", listenE);
    $("eHintBtn").addEventListener("click", hintE);
    $("eCheck").addEventListener("click", checkE);
    $("eReset").addEventListener("click", resetE);
    newESet();

    $("efNew").addEventListener("click", newEF);
    $("efListen").addEventListener("click", listenEF);
    $("efHintBtn").addEventListener("click", hintEF);
    $("efCheck").addEventListener("click", checkEF);
    $("efReveal").addEventListener("click", revealEF);
    newEF();

    $("edNewPrompts").addEventListener("click", newEDPrompts);
    $("edListenOne").addEventListener("click", listenOneEDPrompt);
    newEDPrompts();

    // vowels
    $("vNew").addEventListener("click", newV);
    $("vListen").addEventListener("click", listenV);
    $("vHintBtn").addEventListener("click", hintV);
    newV();

    // y/z
    wireDropzone($("yzJ")); wireDropzone($("yzAI")); wireDropzone($("yzI")); wireDropzone($("yzZ"));
    $("yzNew").addEventListener("click", newYZ);
    $("yzListen").addEventListener("click", listenYZ);
    $("yzHintBtn").addEventListener("click", hintYZ);
    $("yzCheck").addEventListener("click", checkYZ);
    $("yzReset").addEventListener("click", resetYZ);
    newYZ();

    // tion
    $("nNew").addEventListener("click", newN);
    $("nListen").addEventListener("click", listenN);
    $("nHintBtn").addEventListener("click", hintN);
    newN();

    // rhythm
    $("rNew2").addEventListener("click", newR2);
    $("rListen2").addEventListener("click", listenR2);
    $("rHintBtn2").addEventListener("click", hintR2);
    $("rCheck2").addEventListener("click", checkR2);
    $("rReveal2").addEventListener("click", revealR2);
    newR2();

    // mission
    $("genBtn").addEventListener("click", generateScript);
    $("genListen").addEventListener("click", listenScript);
    $("genCopy").addEventListener("click", copyScript);

    // cheat
    renderCheat();

    // voices
    if (window.speechSynthesis){
      loadVoices();
      window.speechSynthesis.onvoiceschanged = function(){ loadVoices(); };
    }
  }

  init();
})();
