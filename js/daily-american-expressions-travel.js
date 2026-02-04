/* SpeakEasyTisha — Daily American Expressions (Travel) — 60 min interactive lesson
   Flashcards, matching (drag + tap), QCM, fill-in, dialogue builder, story.
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

  /* -------------------- Timers -------------------- */
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

  /* ===================== CONTENT ===================== */

  // Flashcards (tagged for sets)
  var FLASH = [
    // Morning / greetings
    { tag:"morning", front:"How’s it going?", back:"FR: Ça va ? (informal)\nGood replies: Pretty good / Not bad / Can’t complain", say:"How's it going? Pretty good." },
    { tag:"morning", front:"What’s up?", back:"FR: Quoi de neuf ?\nReply: Not much / Same old", say:"What's up? Not much." },
    { tag:"morning", front:"Long time no see!", back:"FR: Ça fait longtemps !\nUse when you meet someone after a while", say:"Long time no see!" },
    { tag:"morning", front:"I’m good, thanks.", back:"FR: Je vais bien, merci.\nVery common in the US", say:"I'm good, thanks." },
    { tag:"morning", front:"Sounds good.", back:"FR: Ça marche / Ça me va.\nUsed all day", say:"Sounds good." },
    { tag:"morning", front:"No worries.", back:"FR: Pas de souci.\nAlso: No problem", say:"No worries." },

    // Coffee / ordering
    { tag:"travel", front:"Could I get a…?", back:"FR: Je pourrais avoir… ? (polite)\nCoffee shop classic", say:"Could I get a coffee, please?" },
    { tag:"travel", front:"I’ll have the…", back:"FR: Je vais prendre…\nMore natural than “I take”", say:"I'll have the sandwich, please." },
    { tag:"travel", front:"For here or to go?", back:"FR: Sur place ou à emporter ?", say:"For here or to go?" },
    { tag:"travel", front:"That’s all, thanks.", back:"FR: C’est tout, merci.", say:"That's all, thanks." },

    // Small talk
    { tag:"travel", front:"How’s your day going?", back:"FR: Ta journée se passe bien ?", say:"How's your day going?" },
    { tag:"travel", front:"It’s been a busy day.", back:"FR: Journée chargée.", say:"It's been a busy day." },
    { tag:"travel", front:"I’m just visiting.", back:"FR: Je suis juste de passage.", say:"I'm just visiting." },

    // Shopping
    { tag:"travel", front:"I’m just looking.", back:"FR: Je regarde seulement.\n(= I don’t need help yet)", say:"I'm just looking, thanks." },
    { tag:"travel", front:"Do you have this in…?", back:"FR: Vous l’avez en… ?", say:"Do you have this in a medium?" },
    { tag:"travel", front:"Can I try this on?", back:"FR: Je peux essayer ?", say:"Can I try this on?" },
    { tag:"travel", front:"Where’s the fitting room?", back:"FR: Les cabines ? / Where can I try it on?", say:"Where's the fitting room?" },

    // Directions / transport
    { tag:"travel", front:"How do I get to…?", back:"FR: Comment aller à… ?", say:"How do I get to the museum?" },
    { tag:"travel", front:"Is it far?", back:"FR: C’est loin ?", say:"Is it far?" },
    { tag:"travel", front:"Can you drop me off here?", back:"FR: Vous pouvez me déposer ici ?", say:"Can you drop me off here?" },

    // Restaurant
    { tag:"travel", front:"Could we get the check, please?", back:"FR: L’addition, s’il vous plaît.", say:"Could we get the check, please?" },
    { tag:"travel", front:"What do you recommend?", back:"FR: Vous conseillez quoi ?", say:"What do you recommend?" },
    { tag:"travel", front:"Could I get a refill?", back:"FR: Je peux avoir un refill ?\nUS: free refills often", say:"Could I get a refill, please?" },
    { tag:"travel", front:"I’m all set.", back:"FR: C’est bon / Je n’ai besoin de rien.\nCommon in stores/restaurants", say:"I'm all set, thanks." },

    // Hotel
    { tag:"travel", front:"I have a reservation.", back:"FR: J’ai une réservation.", say:"Hi, I have a reservation." },
    { tag:"travel", front:"Could I check in, please?", back:"FR: Je peux faire le check-in ?", say:"Could I check in, please?" },
    { tag:"travel", front:"Could I get a late checkout?", back:"FR: départ tardif ?", say:"Could I get a late checkout?" },
    { tag:"travel", front:"The AC isn’t working.", back:"FR: La clim ne marche pas.", say:"The AC isn't working." }
  ];

  // Cheat sheet categories
  var CHEAT = [
    {
      title:"Greetings & small talk",
      items:[
        "How’s it going? → Pretty good / Not bad / Can’t complain",
        "What’s up? → Not much / Same old",
        "Long time no see!",
        "Sounds good. / That works."
      ]
    },
    {
      title:"Polite requests (native)",
      items:[
        "Could I get…? (coffee/shop)",
        "Would you mind…? (very polite)",
        "I was wondering if… (super polite)",
        "Do you happen to know…? (directions)"
      ]
    },
    {
      title:"Coffee & food",
      items:[
        "I’ll have the… (NOT “I take”)",
        "For here or to go?",
        "That’s all, thanks.",
        "Could we get the check, please?"
      ]
    },
    {
      title:"Shopping & hotel",
      items:[
        "I’m just looking.",
        "Do you have this in a medium?",
        "I have a reservation. / Could I check in?",
        "I’m all set. (I’m okay / I’m done)"
      ]
    }
  ];

  // Typical French mistakes
  var MISTAKES = [
    { bad:"I want a coffee.", fix:"I’d like a coffee, please. / Could I get a coffee?", why:"“I want” can sound strong or impatient." },
    { bad:"I take this.", fix:"I’ll take this. / I’ll have this.", why:"Use “I’ll…” for ordering/choosing." },
    { bad:"I am agree.", fix:"I agree. / I totally agree.", why:"No “am” in English here." },
    { bad:"I have 20 years.", fix:"I’m 20. / I’m 20 years old.", why:"Age uses “be” (I’m…)." },
    { bad:"Can you repeat please?", fix:"Could you repeat that, please?", why:"Add “that” + softener for natural politeness." },
    { bad:"Where is the toilets?", fix:"Where’s the restroom/bathroom?", why:"US: restroom/bathroom is more common." },
    { bad:"I search the subway.", fix:"I’m looking for the subway.", why:"Use “look for” (not “search” in this context)." },
    { bad:"I didn’t understand.", fix:"Sorry — I didn’t catch that.", why:"Very native for “I didn’t understand.”" }
  ];

  // Warm-up “upgrade” items
  var UPGRADE = [
    {
      title:"Coffee shop",
      prompt:"You want a latte. Choose the most natural American sentence.",
      hint:"Use a polite softener + ‘Could I get…?’",
      say:"Could I get a latte, please?",
      correct:1,
      choices:[
        "I want a latte.",
        "Could I get a latte, please?",
        "Give me a latte."
      ]
    },
    {
      title:"Hotel front desk",
      prompt:"You arrived. Choose the best sentence.",
      hint:"Use ‘I have a reservation’ / ‘check in’.",
      say:"Hi, I have a reservation. Could I check in, please?",
      correct:2,
      choices:[
        "Hello. I am coming for my reservation.",
        "I have reserved. I take the room.",
        "Hi, I have a reservation. Could I check in, please?"
      ]
    },
    {
      title:"Directions",
      prompt:"You need help to find a place. Best option?",
      hint:"Americans often use ‘Do you happen to know…?’",
      say:"Do you happen to know how to get to the station?",
      correct:1,
      choices:[
        "Where is the station?",
        "Do you happen to know how to get to the station?",
        "Explain me the station."
      ]
    }
  ];

  // Match activity (4 situations, 8 expressions: 2 per situation)
  var MATCH_SETS = [
    {
      situations:[
        "You enter a coffee shop and order politely.",
        "A clerk asks if you need help in a store.",
        "You want to pay in a restaurant.",
        "You meet someone and do small talk."
      ],
      pairs:[
        { exp:"Could I get a coffee, please?", sit:0, say:"Could I get a coffee, please?" },
        { exp:"I’ll have a small latte.", sit:0, say:"I'll have a small latte." },
        { exp:"I’m just looking, thanks.", sit:1, say:"I'm just looking, thanks." },
        { exp:"I’m all set, thanks.", sit:1, say:"I'm all set, thanks." },
        { exp:"Could we get the check, please?", sit:2, say:"Could we get the check, please?" },
        { exp:"Could I get a refill, please?", sit:2, say:"Could I get a refill, please?" },
        { exp:"How’s it going?", sit:3, say:"How's it going?" },
        { exp:"Not bad — how about you?", sit:3, say:"Not bad—how about you?" }
      ],
      hint:"Think: coffee → ‘Could I get…?’ / store → ‘I’m just looking’ / restaurant → ‘check’ / small talk → ‘How’s it going?’"
    },
    {
      situations:[
        "You’re calling an Uber / taxi and want to stop somewhere.",
        "You’re checking in at a hotel.",
        "You want directions politely.",
        "You want something in a different size."
      ],
      pairs:[
        { exp:"Can you drop me off here?", sit:0, say:"Can you drop me off here?" },
        { exp:"Could you wait a second?", sit:0, say:"Could you wait a second?" },
        { exp:"I have a reservation.", sit:1, say:"I have a reservation." },
        { exp:"Could I check in, please?", sit:1, say:"Could I check in, please?" },
        { exp:"Do you happen to know where… is?", sit:2, say:"Do you happen to know where the subway is?" },
        { exp:"How do I get to the museum?", sit:2, say:"How do I get to the museum?" },
        { exp:"Do you have this in a medium?", sit:3, say:"Do you have this in a medium?" },
        { exp:"Can I try this on?", sit:3, say:"Can I try this on?" }
      ],
      hint:"Travel day: Uber → drop me off / hotel → reservation / directions → do you happen to know / shopping → in a medium."
    }
  ];

  // QCM questions
  var QCM = [
    {
      title:"Coffee shop",
      prompt:"Barista: “For here or to go?” You want takeaway.",
      hint:"Short natural answer: ‘To go, please.’",
      say:"To go, please.",
      correct:0,
      choices:["To go, please.","I go.","For go."]
    },
    {
      title:"Store",
      prompt:"Clerk: “Can I help you?” You are only browsing.",
      hint:"Use the standard polite phrase.",
      say:"I'm just looking, thanks.",
      correct:1,
      choices:["No, I watch.","I'm just looking, thanks.","I search something."]
    },
    {
      title:"Restaurant",
      prompt:"You want the bill in the US.",
      hint:"In the US it’s ‘check’ (not ‘addition’).",
      say:"Could we get the check, please?",
      correct:2,
      choices:["The addition, please.","Give me the bill.","Could we get the check, please?"]
    },
    {
      title:"Directions",
      prompt:"You want to sound extra polite to a stranger.",
      hint:"Use ‘Do you happen to know…?’",
      say:"Do you happen to know how to get to the station?",
      correct:0,
      choices:[
        "Do you happen to know how to get to the station?",
        "Where is the station? Quickly.",
        "Explain me station."
      ]
    },
    {
      title:"Hotel issue",
      prompt:"Your AC is broken. Best sentence?",
      hint:"Simple: ‘The AC isn’t working.’",
      say:"Hi—sorry, the AC isn't working.",
      correct:1,
      choices:["The air condition is broke.","The AC isn’t working.","My room is not good."]
    },
    {
      title:"Small talk",
      prompt:"Someone says: “How’s it going?”",
      hint:"Give a short positive reply + return the question.",
      say:"Pretty good—how about you?",
      correct:2,
      choices:["I go to the hotel.","Very goodly.","Pretty good—how about you?"]
    }
  ];

  // Fill-in (accept multiple answers)
  var FILL = [
    {
      sentence:"I’m ____ looking, thanks.",
      answers:["just"],
      hint:"Standard store phrase = ‘I’m just looking.’",
      say:"I'm just looking, thanks."
    },
    {
      sentence:"It’s ____ good. (not perfect, but good!)",
      answers:["pretty"],
      hint:"‘Pretty’ = ‘rather’ (positive).",
      say:"It's pretty good."
    },
    {
      sentence:"It’s ____ of far, right?",
      answers:["kind of","kinda"],
      hint:"Native softener: ‘kind of’ (kinda).",
      say:"It's kind of far, right?"
    },
    {
      sentence:"____ worries!",
      answers:["no"],
      hint:"Very common in the US.",
      say:"No worries!"
    },
    {
      sentence:"I didn’t ____ that. (native for “I didn’t understand”)",
      answers:["catch"],
      hint:"‘I didn’t catch that’ = I didn’t hear/understand.",
      say:"Sorry, I didn't catch that."
    }
  ];

  // Dialogues (correct order)
  var DIALOGUES = [
    {
      title:"Coffee shop (ordering)",
      goal:"Order politely + answer ‘for here or to go’",
      lines:[
        "Hi! What can I get for you?",
        "Could I get a medium latte, please?",
        "Sure — for here or to go?",
        "To go, please.",
        "Great. Anything else?",
        "That’s all, thanks.",
        "Perfect — total is $6.45."
      ]
    },
    {
      title:"Hotel check-in",
      goal:"Check in + ask a simple question",
      lines:[
        "Hi — I have a reservation.",
        "Great! What’s the name on the reservation?",
        "It’s Martin.",
        "Perfect. Could you show me your ID, please?",
        "Sure — here you go.",
        "Thanks. You’re all set. Room 512.",
        "Awesome — what time is checkout?"
      ]
    },
    {
      title:"Restaurant (polite + check)",
      goal:"Order + ask for the check naturally",
      lines:[
        "Hi! How are you doing today?",
        "Pretty good — how about you?",
        "Great! What can I get you to drink?",
        "Could I get a water, please?",
        "Sure. Are you ready to order?",
        "Yes — I’ll have the chicken sandwich.",
        "Perfect.",
        "Could we get the check, please?"
      ]
    }
  ];

  // “Day in the life” story (multi-step)
  var DAY = [
    {
      title:"Morning — coffee",
      prompt:"Barista: “Hi! What can I get for you?”",
      hint:"Use a polite softener (‘Could I get…?’).",
      say:"Could I get a small coffee, please?",
      correct:0,
      choices:[
        "Could I get a small coffee, please?",
        "I want a coffee.",
        "Give me coffee."
      ]
    },
    {
      title:"On the street — small talk",
      prompt:"Someone: “How’s it going?”",
      hint:"Short reply + return the question.",
      say:"Not bad—how about you?",
      correct:1,
      choices:[
        "I go to the hotel.",
        "Not bad—how about you?",
        "I am fine thank you and you?"
      ]
    },
    {
      title:"Store — browsing",
      prompt:"Clerk: “Can I help you find something?”",
      hint:"Use the standard phrase.",
      say:"I'm just looking, thanks.",
      correct:2,
      choices:[
        "No, I watch.",
        "I search a shirt.",
        "I'm just looking, thanks."
      ]
    },
    {
      title:"Getting around",
      prompt:"Stranger: “Where are you headed?” (friendly question)",
      hint:"Simple: ‘I’m heading to…’ / ‘I’m on my way to…’",
      say:"I'm on my way to the museum.",
      correct:0,
      choices:[
        "I'm on my way to the museum.",
        "I go museum.",
        "I am in direction of museum."
      ]
    },
    {
      title:"Restaurant — paying",
      prompt:"Server: “Can I get you anything else?” You want to pay.",
      hint:"Ask for the check politely.",
      say:"No thanks—could we get the check, please?",
      correct:1,
      choices:[
        "Bring me the addition.",
        "No thanks—could we get the check, please?",
        "I finish. Paper please."
      ]
    }
  ];

  // Speaking prompts
  var SPEAK_PROMPTS = [
    "You’re in a store. The clerk asks if you need help. Reply politely.",
    "You didn’t understand. Ask them to repeat (native).",
    "You want directions. Ask in a very polite way.",
    "Order a coffee + answer ‘for here or to go’.",
    "You want the check in a restaurant.",
    "You have a hotel reservation and want to check in."
  ];

  /* ===================== FLASHCARDS UI ===================== */
  function renderFlashcards(setTag){
    var data = setTag ? FLASH.filter(function(x){ return x.tag === setTag; }) : FLASH.slice();
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
        '<div class="flashTitle">Meaning / FR</div>' +
        '<div class="flashText">'+esc(card.back).replace(/\n/g,"<br>")+'</div>' +
        '<div class="flashActions">' +
          '<button class="btn" type="button" data-fcsay="'+esc(card.say)+'">Listen</button>' +
          '<span class="tiny muted">Try it in a travel sentence</span>' +
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

  /* ===================== MATCH (drag + tap) ===================== */
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

  var mCur = null;
  var mPairs = [];
  function newMatch(){
    mCur = choice(MATCH_SETS);
    $("mSitA").textContent = mCur.situations[0];
    $("mSitB").textContent = mCur.situations[1];
    $("mSitC").textContent = mCur.situations[2];
    $("mSitD").textContent = mCur.situations[3];

    $("mA").innerHTML=""; $("mB").innerHTML=""; $("mC").innerHTML=""; $("mD").innerHTML="";
    $("mBank").innerHTML="";
    $("mFeedback").textContent=""; $("mFeedback").className="feedback";
    $("mHint").textContent="";
    tap.chip = null;

    mPairs = shuffle(mCur.pairs);
    for (var i=0;i<mPairs.length;i++){
      $("mBank").appendChild(makeChip(mPairs[i].exp, { sit:String(mPairs[i].sit), say:mPairs[i].say }));
    }
  }
  function resetMatch(){
    $("mA").innerHTML=""; $("mB").innerHTML=""; $("mC").innerHTML=""; $("mD").innerHTML="";
    $("mBank").innerHTML="";
    $("mFeedback").textContent=""; $("mFeedback").className="feedback";
    $("mHint").textContent="";
    tap.chip = null;

    for (var i=0;i<mPairs.length;i++){
      $("mBank").appendChild(makeChip(mPairs[i].exp, { sit:String(mPairs[i].sit), say:mPairs[i].say }));
    }
  }
  function listenMatch(){
    if (!mPairs.length) return;
    speakText(mPairs.map(function(x){ return x.exp; }).join(". "));
  }
  function checkMatch(){
    var zones = [{id:"mA", sit:"0"}, {id:"mB", sit:"1"}, {id:"mC", sit:"2"}, {id:"mD", sit:"3"}];
    var correct = 0, total = 0;

    for (var z=0; z<zones.length; z++){
      var chips = $(zones[z].id).querySelectorAll(".chip");
      for (var i=0;i<chips.length;i++){
        total++;
        if (chips[i].dataset.sit === zones[z].sit) correct++;
      }
    }

    if (total === 0){
      $("mFeedback").textContent = "Move expressions into the situation boxes first.";
      $("mFeedback").className = "feedback warn";
      return;
    }
    var ok = (correct === total);
    addAttempt(ok);
    $("mFeedback").textContent = ok ? "✅ Perfect match!" : "❌ " + correct + " / " + total + ". Try again (think: context + politeness).";
    $("mFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* ===================== QCM (generic renderer) ===================== */
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

  /* ===================== Warm-up upgrade ===================== */
  var upCur = null;
  function newUpgrade(){
    upCur = choice(UPGRADE);
    $("upTitle").textContent = upCur.title;
    $("upPrompt").textContent = upCur.prompt;
    $("upHint").textContent = "";
    $("upFeedback").textContent = ""; $("upFeedback").className = "feedback";

    renderChoices("upChoices", upCur.choices, upCur.correct, function(ok){
      $("upFeedback").textContent = ok ? "✅ Yes — that sounds natural." : "❌ Too direct/unnatural. Try again next question.";
      $("upFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenUpgrade(){ if (upCur) speakText(upCur.say); }
  function hintUpgrade(){ if (upCur) $("upHint").textContent = upCur.hint; }

  /* ===================== QCM ===================== */
  var qCur = null;
  function newQ(){
    qCur = choice(QCM);
    $("qTitle").textContent = qCur.title;
    $("qPrompt").textContent = qCur.prompt;
    $("qHint").textContent = "";
    $("qFeedback").textContent = ""; $("qFeedback").className = "feedback";

    renderChoices("qChoices", qCur.choices, qCur.correct, function(ok){
      $("qFeedback").textContent = ok ? "✅ Great! Now say it out loud." : "❌ Not the most natural option.";
      $("qFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenQ(){ if (qCur) speakText(qCur.say); }
  function hintQ(){ if (qCur) $("qHint").textContent = qCur.hint; }

  /* ===================== Speaking prompts ===================== */
  var spCur = [];
  function newPrompts(){
    spCur = shuffle(SPEAK_PROMPTS).slice(0, 4);
    var box = $("speakPrompts");
    box.innerHTML = "";
    for (var i=0;i<spCur.length;i++){
      var d = document.createElement("div");
      d.className = "prompt";
      d.textContent = "🗣️ " + spCur[i];
      box.appendChild(d);
    }
  }
  function listenOnePrompt(){
    if (!spCur.length) return;
    speakText(choice(spCur));
  }

  /* ===================== Fill-in ===================== */
  var fCur = null;
  function newFill(){
    fCur = choice(FILL);
    $("fSentence").textContent = fCur.sentence;
    $("fInput").value = "";
    $("fHint").textContent = "";
    $("fFeedback").textContent = ""; $("fFeedback").className="feedback";
  }
  function listenFill(){ if (fCur) speakText(fCur.say); }
  function hintFill(){ if (fCur) $("fHint").textContent = fCur.hint; }
  function checkFill(){
    if (!fCur) return;
    var v = norm($("fInput").value);
    var ok = false;
    for (var i=0;i<fCur.answers.length;i++){
      if (v === norm(fCur.answers[i])) { ok = true; break; }
    }
    addAttempt(ok);
    $("fFeedback").textContent = ok ? "✅ Correct!" : "❌ Expected: " + fCur.answers[0];
    $("fFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealFill(){
    if (!fCur) return;
    $("fInput").value = fCur.answers[0];
    $("fFeedback").textContent = "Answer revealed — now say the full sentence out loud.";
    $("fFeedback").className = "feedback warn";
  }

  /* ===================== Dialogues (touch-friendly reorder) ===================== */
  var dCur = null;
  var dScrambled = [];
  function renderDialogueLists(){
    $("dBank").innerHTML = "";
    $("dTarget").innerHTML = "";
    $("dFeedback").textContent = ""; $("dFeedback").className="feedback";
    $("dHint").textContent = "";

    for (var i=0;i<dScrambled.length;i++){
      $("dBank").appendChild(makeLineItem(dScrambled[i], "bank"));
    }
  }

  function makeLineItem(text, where){
    var row = document.createElement("div");
    row.className = "line";

    var left = document.createElement("div");
    left.className = "lineText";
    left.textContent = text;

    var btns = document.createElement("div");
    btns.className = "lineBtns";

    var up = document.createElement("button");
    up.className = "iconBtn";
    up.type = "button";
    up.textContent = "⬆";
    up.title = "Move up";

    var down = document.createElement("button");
    down.className = "iconBtn";
    down.type = "button";
    down.textContent = "⬇";
    down.title = "Move down";

    var move = document.createElement("button");
    move.className = "iconBtn";
    move.type = "button";
    move.textContent = (where === "bank") ? "➡" : "⬅";
    move.title = (where === "bank") ? "Move to your order" : "Move back";

    move.addEventListener("click", function(){
      if (where === "bank"){
        $("dTarget").appendChild(row);
        move.textContent = "⬅";
        where = "target";
      } else {
        $("dBank").appendChild(row);
        move.textContent = "➡";
        where = "bank";
      }
    });

    up.addEventListener("click", function(){
      if (where !== "target") return;
      var prev = row.previousElementSibling;
      if (prev) row.parentNode.insertBefore(row, prev);
    });
    down.addEventListener("click", function(){
      if (where !== "target") return;
      var next = row.nextElementSibling;
      if (next) row.parentNode.insertBefore(next, row);
    });

    btns.appendChild(up);
    btns.appendChild(down);
    btns.appendChild(move);

    row.appendChild(left);
    row.appendChild(btns);
    return row;
  }

  function newDialogue(){
    dCur = choice(DIALOGUES);
    $("dTitle").textContent = dCur.title;
    $("dGoal").textContent = "Goal: " + dCur.goal;

    dScrambled = shuffle(dCur.lines);
    renderDialogueLists();
  }

  function resetDialogue(){
    if (!dCur) return;
    dScrambled = shuffle(dCur.lines);
    renderDialogueLists();
  }

  function hintDialogue(){
    if (!dCur) return;
    $("dHint").textContent = "Hint: first line is usually a greeting/question. Look for “Hi!” or “What can I get…?”";
  }

  function listenDialogue(){
    if (!dCur) return;
    speakText(dCur.lines.join(" "));
  }

  function checkDialogue(){
    if (!dCur) return;
    var lines = $("dTarget").querySelectorAll(".lineText");
    if (!lines.length){
      $("dFeedback").textContent = "Move lines into ‘Your order’ first.";
      $("dFeedback").className = "feedback warn";
      return;
    }
    var attempt = [];
    for (var i=0;i<lines.length;i++) attempt.push(lines[i].textContent);

    var correct = 0;
    var n = Math.min(attempt.length, dCur.lines.length);
    for (var k=0;k<n;k++){
      if (attempt[k] === dCur.lines[k]) correct++;
    }

    var ok = (attempt.length === dCur.lines.length && correct === dCur.lines.length);
    addAttempt(ok);

    $("dFeedback").textContent = ok
      ? "✅ Perfect order! Now roleplay it (you = guest / they = staff)."
      : "❌ " + correct + " / " + dCur.lines.length + " lines in the correct position. Try moving greeting first.";
    $("dFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* ===================== Day story ===================== */
  var dayIndex = -1;
  var dayChosen = null;
  function renderDay(step){
    $("dayTitle").textContent = step.title;
    $("dayPrompt").textContent = step.prompt;
    $("dayHint").textContent = "";
    $("dayFeedback").textContent = ""; $("dayFeedback").className="feedback";
    dayChosen = null;

    renderChoices("dayChoices", step.choices, step.correct, function(ok, idx){
      dayChosen = step.choices[idx];
      $("dayFeedback").textContent = ok ? "✅ Nice! That sounds natural." : "❌ Not the most natural option.";
      $("dayFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function startDay(){
    dayIndex = 0;
    renderDay(DAY[0]);
  }
  function listenDay(){
    if (dayIndex < 0) return;
    speakText(DAY[dayIndex].say);
  }
  function hintDay(){
    if (dayIndex < 0) return;
    $("dayHint").textContent = DAY[dayIndex].hint;
  }
  function sayDay(){
    if (dayIndex < 0) return;
    if (dayChosen){
      speakText(dayChosen);
    } else {
      speakText(DAY[dayIndex].say);
    }
    // auto-advance if already answered
    if (dayChosen){
      dayIndex++;
      if (dayIndex >= DAY.length){
        $("dayFeedback").textContent = "✅ Story complete! Repeat your best answers once more.";
        $("dayFeedback").className = "feedback ok";
        dayIndex = DAY.length - 1;
      } else {
        setTimeout(function(){ renderDay(DAY[dayIndex]); }, 400);
      }
    }
  }

  /* ===================== Mistakes + Cheat sheet render ===================== */
  function renderMistakes(){
    var box = $("mistakeList");
    box.innerHTML = "";
    for (var i=0;i<MISTAKES.length;i++){
      var m = MISTAKES[i];
      var d = document.createElement("div");
      d.className = "mist";
      d.innerHTML =
        "<h4>❌ <span class='code'>"+esc(m.bad)+"</span></h4>" +
        "<p>✅ Native: <span class='code'>"+esc(m.fix)+"</span></p>" +
        "<p>Why: "+esc(m.why)+"</p>";
      box.appendChild(d);
    }
  }
  function listenMistakes(){
    var lines = [];
    for (var i=0;i<MISTAKES.length;i++){
      lines.push(MISTAKES[i].fix);
    }
    speakText(lines.join(" "));
  }

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
    speakText("How's it going? Pretty good. Could I get a coffee, please? For here or to go? To go, please. I'm just looking, thanks. Could we get the check, please? No worries. Sounds good.");
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
      speakText("Test voice. Repeat after me: How's it going? Pretty good. Could I get a coffee, please? I'm just looking. No worries. Sounds good.");
    });
    $("btnStop").addEventListener("click", stopSpeak);

    // timer + print
    renderTimer();
    $("btnStart60").addEventListener("click", function(){ setTimer(3600); });
    $("btnResetTimer").addEventListener("click", resetTimer);
    $("btnPrint").addEventListener("click", function(){ window.print(); });
    $("btnCheatListen").addEventListener("click", listenCheat);

    // data-say buttons
    wireSayButtons();

    // flashcards
    renderFlashcards(null);
    $("fcShuffle").addEventListener("click", function(){ renderFlashcards(null); });
    $("fcListenRand").addEventListener("click", function(){
      var c = choice(FLASH);
      speakText(c.say);
    });
    $("fcSetMorning").addEventListener("click", function(){ renderFlashcards("morning"); });
    $("fcSetTravel").addEventListener("click", function(){ renderFlashcards("travel"); });

    // match
    wireDropzone($("mA")); wireDropzone($("mB")); wireDropzone($("mC")); wireDropzone($("mD"));
    $("mNew").addEventListener("click", newMatch);
    $("mListen").addEventListener("click", listenMatch);
    $("mReset").addEventListener("click", resetMatch);
    $("mCheck").addEventListener("click", checkMatch);
    $("mHintBtn").addEventListener("click", function(){
      if (mCur) $("mHint").textContent = mCur.hint;
    });
    newMatch();

    // warm-up upgrade
    $("upNew").addEventListener("click", newUpgrade);
    $("upListen").addEventListener("click", listenUpgrade);
    $("upHintBtn").addEventListener("click", hintUpgrade);
    newUpgrade();

    // qcm
    $("qNew").addEventListener("click", newQ);
    $("qListen").addEventListener("click", listenQ);
    $("qHintBtn").addEventListener("click", hintQ);
    newQ();

    // speaking prompts
    $("spNew").addEventListener("click", newPrompts);
    $("spListen").addEventListener("click", listenOnePrompt);
    newPrompts();

    // fill-in
    $("fNew").addEventListener("click", newFill);
    $("fListen").addEventListener("click", listenFill);
    $("fHintBtn").addEventListener("click", hintFill);
    $("fCheck").addEventListener("click", checkFill);
    $("fReveal").addEventListener("click", revealFill);
    newFill();

    // dialogues
    $("dNew").addEventListener("click", newDialogue);
    $("dListen").addEventListener("click", listenDialogue);
    $("dCheck").addEventListener("click", checkDialogue);
    $("dReset").addEventListener("click", resetDialogue);
    $("dHintBtn").addEventListener("click", hintDialogue);
    newDialogue();

    // day story
    $("dayStart").addEventListener("click", startDay);
    $("dayListen").addEventListener("click", listenDay);
    $("dayHintBtn").addEventListener("click", hintDay);
    $("daySay").addEventListener("click", sayDay);

    // mistakes + cheat
    renderMistakes();
    $("mistListen").addEventListener("click", listenMistakes);
    renderCheat();

    // voices
    if (window.speechSynthesis){
      loadVoices();
      window.speechSynthesis.onvoiceschanged = function(){ loadVoices(); };
    }
  }

  init();
})();
