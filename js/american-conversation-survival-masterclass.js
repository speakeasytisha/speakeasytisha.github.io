/* SpeakEasyTisha — American Conversation Survival (60 min)
   Topics: start convo, keep going, interrupt politely, disagree softly, light humor, phone calls, real roleplays
   Exercises: flashcards, QCM, fill-in, phrase builder, sorting, shadowing, final mission
   Touch-friendly: drag OR tap-to-move chips. ES5 + iPad Safari friendly.
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

  /* -------------------- Speech -------------------- */
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
  var timer = { total:3600, left:3600, t:null };
  function fmtTime(sec){
    var m = Math.floor(sec/60), s = sec % 60;
    return String(m) + ":" + (s<10 ? "0"+s : String(s));
  }
  function renderTimer(){ $("timerText").textContent = fmtTime(timer.left); }
  function stopTimer(){
    if (timer.t) clearInterval(timer.t);
    timer.t = null;
    renderTimer();
  }
  function setTimer(seconds){
    stopTimer();
    timer.total = seconds;
    timer.left = seconds;
    renderTimer();
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

  /* -------------------- QCM helper -------------------- */
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

  /* -------------------- Tap + Drag chips -------------------- */
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
      if (typeof chips[i] === "string"){
        $(bankId).appendChild(makeChip(chips[i], {}));
      } else {
        $(bankId).appendChild(makeChip(chips[i].w, { cat: chips[i].cat }));
      }
    }
  }

  function readLineText(lineId){
    var chips = $(lineId).querySelectorAll(".chip");
    var out = [];
    for (var i=0;i<chips.length;i++) out.push(chips[i].textContent);
    return out.join(" ").replace(/\s—\s/g," — ").replace(/\s\?\s/g,"?").trim();
  }

  function checkZones(zones){
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

  /* ===================== DATA ===================== */

  // Warm-up
  var WARM = [
    {
      title:"Starting a conversation",
      prompt:"You’re in a line at the airport. Best opener?",
      say:"Hey—quick question. Is this line for security?",
      hint:"Start light + one clear question.",
      correct:1,
      choices:[
        "I want to know if this line is for security.",
        "Hey—quick question. Is this line for security?",
        "Tell me the purpose of this line."
      ]
    },
    {
      title:"Keeping it going",
      prompt:"Someone says: “I’m here for three days.” Best follow-up?",
      say:"Oh nice! What brings you here?",
      hint:"React + follow-up question.",
      correct:2,
      choices:[
        "Three days is short.",
        "I see.",
        "Oh nice! What brings you here?"
      ]
    },
    {
      title:"Polite interruption",
      prompt:"You need clarification during check-in. Best line?",
      say:"Sorry to interrupt—quick question: what time is check-in?",
      hint:"Apology + quick question.",
      correct:0,
      choices:[
        "Sorry to interrupt—quick question: what time is check-in?",
        "I interrupt you. What time check-in?",
        "Wait. I speak now."
      ]
    },
    {
      title:"Soft disagreement",
      prompt:"Friend says: “Let’s take a taxi.” You prefer the subway. Best reply?",
      say:"I see what you mean, but maybe we should take the subway—it's faster.",
      hint:"Agree a little + suggest an option.",
      correct:1,
      choices:[
        "No, that's wrong. Subway is better.",
        "I see what you mean, but maybe we should take the subway—it's faster.",
        "I disagree strongly."
      ]
    },
    {
      title:"Phone call",
      prompt:"You call a hotel. Best first line?",
      say:"Hi—quick question. I was wondering if you have any rooms available tonight.",
      hint:"Hi + quick question + I was wondering if…",
      correct:2,
      choices:[
        "Hello. I need a room tonight.",
        "Give me a room tonight, please.",
        "Hi—quick question. I was wondering if you have any rooms available tonight."
      ]
    }
  ];

  // Flashcards
  var FLASH = [
    // start
    { tag:"start", front:"Hey—quick question…", back:"FR: Petite question… (friendly)\nUse in lines / stores.\nExample: Hey—quick question. Is this the right place?", say:"Hey—quick question. Is this the right place?" },
    { tag:"start", front:"Do you know if…?", back:"FR: Tu sais si…?\nPolite and common.\nDo you know if the bus is late?", say:"Do you know if the bus is late?" },
    { tag:"start", front:"I’m curious—", back:"FR: Je suis curieux…\nNice opener.\nI’m curious—what do you recommend?", say:"I'm curious—what do you recommend?" },

    // keep going
    { tag:"keep", front:"Oh nice! What brings you here?", back:"FR: Ah super ! Qu’est-ce qui t’amène ici ?\nPerfect travel follow-up.", say:"Oh nice! What brings you here?" },
    { tag:"keep", front:"How long are you in town for?", back:"FR: Tu restes combien de temps ?\nVery common.", say:"How long are you in town for?" },
    { tag:"keep", front:"That makes sense. How come?", back:"FR: Ça se tient. Comment ça ?\nFollow-up without pressure.", say:"That makes sense. How come?" },

    // interrupt
    { tag:"interrupt", front:"Sorry to interrupt, but…", back:"FR: Désolé(e) de t’interrompre…\nSoft + polite.", say:"Sorry to interrupt, but I had a quick question." },
    { tag:"interrupt", front:"Can I jump in for a sec?", back:"FR: Je peux me permettre…?\nFriendly interruption.", say:"Can I jump in for a sec?" },
    { tag:"interrupt", front:"Just to clarify…", back:"FR: Juste pour clarifier…\nUseful in service situations.", say:"Just to clarify, is breakfast included?" },

    // disagree
    { tag:"disagree", front:"I see what you mean, but…", back:"FR: Je vois ce que tu veux dire, mais…\nPerfect soft disagreement.", say:"I see what you mean, but I'm not sure that's the best idea." },
    { tag:"disagree", front:"Maybe, but what about…?", back:"FR: Peut-être, mais et si…?\nSuggests alternatives.", say:"Maybe, but what about taking the subway?" },
    { tag:"disagree", front:"That’s fair. Another option is…", back:"FR: C’est vrai. Une autre option…\nVery polite.", say:"That's fair. Another option is to do it tomorrow." },

    // phone
    { tag:"phone", front:"Hi—this is ___ calling.", back:"FR: Bonjour, c’est ___.\nPhone standard intro.", say:"Hi—this is Alex calling." },
    { tag:"phone", front:"I was wondering if…", back:"FR: Je me demandais si…\nSuper polite on the phone.", say:"I was wondering if you have any availability." },
    { tag:"phone", front:"Could you repeat that, please?", back:"FR: Vous pouvez répéter ?\nEssential phone skill.", say:"Could you repeat that, please?" },

    // service/travel
    { tag:"service", front:"Is there any way to…?", back:"FR: Est-ce qu’il y a moyen de…?\nProblem-solving line.", say:"Is there any way to change rooms?" },
    { tag:"service", front:"Do you happen to have…?", back:"FR: Par hasard, vous auriez…?\nVery polite request.", say:"Do you happen to have a charger?" },
    { tag:"service", front:"I’m all set, thanks.", back:"FR: C’est bon, merci.\nShops / service.", say:"I'm all set, thanks." }
  ];

  // Start convo QCM
  var STARTQ = [
    {
      title:"Line at the airport",
      prompt:"You want to ask about the line. Best opener?",
      say:"Hey—quick question. Is this line for security?",
      hint:"Use friendly + short + one clear question.",
      correct:1,
      choices:[
        "I demand information about this line.",
        "Hey—quick question. Is this line for security?",
        "Tell me immediately."
      ]
    },
    {
      title:"Coffee shop",
      prompt:"You want a recommendation. Best opener?",
      say:"I'm curious—what do you recommend?",
      hint:"Use: I’m curious / What do you recommend?",
      correct:0,
      choices:[
        "I'm curious—what do you recommend?",
        "I want your best product now.",
        "Give me the most popular."
      ]
    },
    {
      title:"Hotel lobby",
      prompt:"You need directions. Best opener?",
      say:"Do you know if the elevator is this way?",
      hint:"Do you know if… is polite and natural.",
      correct:2,
      choices:[
        "Where is elevator? Tell me.",
        "I need elevator.",
        "Do you know if the elevator is this way?"
      ]
    }
  ];

  // Starter fill-in
  var STARTFILL = [
    { sentence:"Hey—____: is this the line for security?", answer:"quick question", say:"Hey—quick question: is this the line for security?", hint:"Common friendly opener." },
    { sentence:"____ know if this train stops at downtown?", answer:"do you", say:"Do you know if this train stops at downtown?", hint:"Start with ‘Do you know if…?’" },
    { sentence:"By the way—____ question: where’s the restroom?", answer:"quick", say:"By the way—quick question: where's the restroom?", hint:"By the way + quick question." }
  ];

  // Keep going QCM
  var KEEPQ = [
    {
      title:"Follow-up",
      prompt:"Person: “I’m here for work.” Best follow-up?",
      say:"Oh nice—what do you do?",
      hint:"React + question.",
      correct:1,
      choices:[
        "Work is hard.",
        "Oh nice—what do you do?",
        "I also work."
      ]
    },
    {
      title:"Follow-up",
      prompt:"Person: “I love this city.” Best follow-up?",
      say:"No way—what do you like most about it?",
      hint:"No way / Oh wow + question.",
      correct:2,
      choices:[
        "I love it too.",
        "That's good.",
        "No way—what do you like most about it?"
      ]
    },
    {
      title:"Follow-up",
      prompt:"Person: “We almost missed the flight.” Best follow-up?",
      say:"Oh wow—what happened?",
      hint:"Oh wow + open question.",
      correct:0,
      choices:[
        "Oh wow—what happened?",
        "You should be careful.",
        "This is not good."
      ]
    }
  ];

  // Interrupt QCM
  var INTQ = [
    {
      title:"Interrupt politely",
      prompt:"You need clarification during check-in.",
      say:"Sorry to interrupt—quick question: what time is check-in?",
      hint:"Sorry + quick question + clear request.",
      correct:0,
      choices:[
        "Sorry to interrupt—quick question: what time is check-in?",
        "I interrupt you. Check-in time?",
        "Listen. I talk."
      ]
    },
    {
      title:"Clarify",
      prompt:"You didn’t understand. Best line?",
      say:"Sorry—could you repeat that, please?",
      hint:"Apology + could you repeat…",
      correct:2,
      choices:[
        "Repeat.",
        "I don't understand you.",
        "Sorry—could you repeat that, please?"
      ]
    }
  ];

  // Phrase builder (interrupt)
  var PB = [
    {
      target:"Sorry to interrupt, but can I jump in for a sec?",
      say:"Sorry to interrupt, but can I jump in for a sec?",
      hint:"This is a very natural polite interruption.",
      words:["Sorry","to","interrupt,","but","can","I","jump","in","for","a","sec?"]
    },
    {
      target:"Just to clarify, is breakfast included?",
      say:"Just to clarify, is breakfast included?",
      hint:"‘Just to clarify’ = ‘just to make sure’.",
      words:["Just","to","clarify,","is","breakfast","included?"]
    },
    {
      target:"Quick question—where should I go for check-in?",
      say:"Quick question—where should I go for check-in?",
      hint:"Short + friendly + clear.",
      words:["Quick","question—where","should","I","go","for","check-in?"]
    }
  ];

  // Disagree softly QCM
  var DISQ = [
    {
      title:"Soft disagreement",
      base:"No, you're wrong.",
      say:"I see what you mean, but I’m not sure that’s right.",
      prompt:"Choose the best soft version:",
      hint:"Start with agreement: ‘I see what you mean…’",
      correct:1,
      choices:[
        "You're wrong. Stop.",
        "I see what you mean, but I’m not sure that’s right.",
        "I disagree totally."
      ]
    },
    {
      title:"Suggestion",
      base:"We should do it now.",
      say:"Maybe, but what about doing it tomorrow?",
      prompt:"Choose the best soft version:",
      hint:"Use ‘Maybe, but what about…?’",
      correct:2,
      choices:[
        "No. Tomorrow.",
        "It's not a good idea.",
        "Maybe, but what about doing it tomorrow?"
      ]
    },
    {
      title:"Alternative",
      base:"Taxi is the only option.",
      say:"That’s fair. Another option is the subway—it's faster.",
      prompt:"Choose the best soft version:",
      hint:"Use ‘That’s fair… Another option is…’",
      correct:0,
      choices:[
        "That’s fair. Another option is the subway—it's faster.",
        "No, subway.",
        "Taxi is expensive."
      ]
    }
  ];

  // Humor QCM
  var HUMQ = [
    {
      title:"Light humor",
      prompt:"You’re not 100% sure. Best safe line?",
      say:"Don't quote me on that.",
      hint:"Means: I’m not completely sure.",
      correct:0,
      choices:["Don’t quote me on that.", "I lie.", "I guarantee it."]
    },
    {
      title:"Joking",
      prompt:"You said something silly. Best line?",
      say:"I'm just kidding.",
      hint:"Quick repair: I’m just kidding.",
      correct:2,
      choices:["I am a clown.", "This is a joke for you.", "I'm just kidding."]
    },
    {
      title:"Summarizing",
      prompt:"You want to summarize a story quickly. Best line?",
      say:"Long story short, we missed the train.",
      hint:"Very common.",
      correct:1,
      choices:["To make a long story short, we missed the train.", "Long story short, we missed the train.", "In resume, we missed train."]
    }
  ];

  /* -------------------- Phone call steps -------------------- */
  var PHONE = [
    {
      title:"Step 1 — Greeting + identity",
      prompt:"You call a hotel. What do you say first?",
      say:"Hi—this is Claire calling.",
      hint:"Start with ‘Hi—this is ___ calling.’",
      correct:0,
      choices:[
        "Hi—this is Claire calling.",
        "Hello, hotel.",
        "I call you now."
      ]
    },
    {
      title:"Step 2 — Reason for the call",
      prompt:"Now explain why you’re calling (polite).",
      say:"I was wondering if you have any rooms available tonight.",
      hint:"Use: I was wondering if…",
      correct:1,
      choices:[
        "I need a room tonight.",
        "I was wondering if you have any rooms available tonight.",
        "Give me a room."
      ]
    },
    {
      title:"Step 3 — Clarify details",
      prompt:"Ask one detail politely.",
      say:"Could you tell me the price per night?",
      hint:"Could you tell me… / Do you happen to know…",
      correct:2,
      choices:[
        "Price.",
        "Tell me price now.",
        "Could you tell me the price per night?"
      ]
    },
    {
      title:"Step 4 — Close the call",
      prompt:"End politely.",
      say:"Perfect—thanks so much. Have a great day!",
      hint:"Thanks + friendly closing.",
      correct:0,
      choices:[
        "Perfect—thanks so much. Have a great day!",
        "Okay bye.",
        "End of call."
      ]
    }
  ];

  /* -------------------- Real roleplays -------------------- */
  var RP = {
    airport: [
      {
        title:"Airport",
        prompt:"Agent: “ID and boarding pass, please.” Your best line:",
        say:"Sure—here you go.",
        hint:"Short, friendly response.",
        correct:1,
        choices:["I give you now.", "Sure—here you go.", "Take it."]
      },
      {
        title:"Airport",
        prompt:"You didn’t understand the announcement. Best line:",
        say:"Sorry—could you repeat that, please?",
        hint:"Classic phone/airport survival line.",
        correct:2,
        choices:["Repeat.", "I don't understand.", "Sorry—could you repeat that, please?"]
      }
    ],
    hotel: [
      {
        title:"Hotel",
        prompt:"Reception: “How can I help you?” You want early check-in:",
        say:"Hi—quick question. Is there any way to check in early?",
        hint:"Quick question + is there any way to…",
        correct:0,
        choices:["Hi—quick question. Is there any way to check in early?", "I want early check-in now.", "Give me room earlier."]
      },
      {
        title:"Hotel",
        prompt:"You want to clarify breakfast:",
        say:"Just to clarify, is breakfast included?",
        hint:"Just to clarify…",
        correct:1,
        choices:["Breakfast included yes?", "Just to clarify, is breakfast included?", "Explain breakfast."]
      }
    ],
    restaurant: [
      {
        title:"Restaurant",
        prompt:"Server: “Are you ready to order?” You need a minute:",
        say:"Not yet—could we have a minute?",
        hint:"Polite delay.",
        correct:2,
        choices:["No.", "Wait.", "Not yet—could we have a minute?"]
      },
      {
        title:"Restaurant",
        prompt:"You want the check politely:",
        say:"Could we get the check, please?",
        hint:"In the US: ‘check’.",
        correct:0,
        choices:["Could we get the check, please?", "Bill now.", "Give check."]
      }
    ],
    shopping: [
      {
        title:"Shopping",
        prompt:"Cashier: “Do you need a bag?” You don’t:",
        say:"No thanks—I’m all set.",
        hint:"I’m all set = no thanks.",
        correct:1,
        choices:["I don't need.", "No thanks—I’m all set.", "No. Finished."]
      },
      {
        title:"Shopping",
        prompt:"You want to ask about returns politely:",
        say:"Quick question—what’s your return policy?",
        hint:"Quick question + clear topic.",
        correct:2,
        choices:["Return policy?", "I return it.", "Quick question—what’s your return policy?"]
      }
    ]
  };
  var rpScene = "airport";

  /* -------------------- Sorting game -------------------- */
  var SOSETS = [
    {
      hint:"Start = openers. Keep = follow-ups. Interrupt = clarify. Disagree = soft disagreement.",
      words:[
        { w:"Hey—quick question…", cat:"S" },
        { w:"Do you know if…?", cat:"S" },
        { w:"Oh nice! What brings you here?", cat:"K" },
        { w:"No way—what happened?", cat:"K" },
        { w:"Sorry to interrupt, but…", cat:"I" },
        { w:"Just to clarify…", cat:"I" },
        { w:"I see what you mean, but…", cat:"D" },
        { w:"That’s fair. Another option is…", cat:"D" }
      ]
    },
    {
      hint:"Follow-ups often start with reactions: oh nice / oh wow / gotcha.",
      words:[
        { w:"I'm curious—", cat:"S" },
        { w:"How long are you in town for?", cat:"K" },
        { w:"That makes sense. How come?", cat:"K" },
        { w:"Can I jump in for a sec?", cat:"I" },
        { w:"Sorry—could you repeat that, please?", cat:"I" },
        { w:"Maybe, but what about…?", cat:"D" },
        { w:"I’m not sure that’s the best idea.", cat:"D" },
        { w:"By the way…", cat:"S" }
      ]
    }
  ];

  /* -------------------- Shadowing -------------------- */
  var SHSETS = [
    [
      "Hey—quick question. Is this line for security?",
      "Oh nice! What brings you here?",
      "Sorry to interrupt, but can I jump in for a sec?",
      "I see what you mean, but maybe we should take the subway."
    ],
    [
      "Hi—this is Claire calling.",
      "I was wondering if you have any rooms available tonight.",
      "Could you repeat that, please?",
      "Perfect—thanks so much. Have a great day!"
    ],
    [
      "Not yet—could we have a minute?",
      "Could we get the check, please?",
      "No thanks—I’m all set.",
      "Quick question—what’s your return policy?"
    ]
  ];

  var CHEAT = [
    { title:"Start (safe openers)", items:[
      "Hey—quick question…",
      "Do you know if…?",
      "By the way—",
      "I’m curious—what do you recommend?"
    ]},
    { title:"Keep it going", items:[
      "Oh nice! What brings you here?",
      "How long are you in town for?",
      "No way—what happened?",
      "That makes sense. How come?"
    ]},
    { title:"Interrupt + clarify", items:[
      "Sorry to interrupt, but…",
      "Can I jump in for a sec?",
      "Just to clarify…",
      "Sorry—could you repeat that, please?"
    ]},
    { title:"Disagree softly + phone", items:[
      "I see what you mean, but…",
      "That’s fair. Another option is…",
      "Hi—this is ___ calling.",
      "I was wondering if…"
    ]}
  ];

  /* ===================== Flashcards render ===================== */
  function renderFlashcards(tag){
    var data = tag ? FLASH.filter(function(x){ return x.tag === tag; }) : FLASH.slice();
    data = shuffle(data).slice(0, 12);

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
        '<div class="flashTitle">Meaning + usage</div>' +
        '<div class="flashText">'+esc(card.back).replace(/\n/g,"<br>")+'</div>' +
        '<div class="flashActions">' +
          '<button class="btn" type="button" data-fcsay="'+esc(card.say)+'">Listen</button>' +
          '<span class="tiny muted">Say a mini sentence</span>' +
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

  /* ===================== Warm-up ===================== */
  var wCur = null;
  function newWarmup(){
    wCur = choice(WARM);
    $("wTitle").textContent = wCur.title;
    $("wPrompt").textContent = wCur.prompt;
    $("wHint").textContent = "";
    $("wFeedback").textContent = ""; $("wFeedback").className = "feedback";

    renderChoices("wChoices", wCur.choices, wCur.correct, function(ok){
      $("wFeedback").textContent = ok ? "✅ Nice! Repeat it once with friendly tone." : "❌ Try again: choose natural + polite.";
      $("wFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenWarmup(){ if (wCur) speakText(wCur.say); }
  function hintWarmup(){ if (wCur) $("wHint").textContent = wCur.hint; }

  /* ===================== Start convo QCM ===================== */
  var sCur = null;
  function newStartQ(){
    sCur = choice(STARTQ);
    $("sTitle").textContent = sCur.title;
    $("sPrompt").textContent = sCur.prompt;
    $("sHint").textContent = "";
    $("sFeedback").textContent = ""; $("sFeedback").className = "feedback";

    renderChoices("sChoices", sCur.choices, sCur.correct, function(ok){
      $("sFeedback").textContent = ok ? "✅ Great. Now say it twice." : "❌ Too direct/awkward. Try the friendly option.";
      $("sFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenStartQ(){ if (sCur) speakText(sCur.say); }
  function hintStartQ(){ if (sCur) $("sHint").textContent = sCur.hint; }

  /* ===================== Start fill-in ===================== */
  var sfCur = null;
  function newStartFill(){
    sfCur = choice(STARTFILL);
    $("sfSentence").textContent = sfCur.sentence;
    $("sfInput").value = "";
    $("sfHint").textContent = "";
    $("sfFeedback").textContent = ""; $("sfFeedback").className = "feedback";
  }
  function listenStartFill(){ if (sfCur) speakText(sfCur.say); }
  function hintStartFill(){ if (sfCur) $("sfHint").textContent = sfCur.hint; }
  function checkStartFill(){
    if (!sfCur) return;
    var v = norm($("sfInput").value);
    var ok = (v === norm(sfCur.answer));
    addAttempt(ok);
    $("sfFeedback").textContent = ok ? "✅ Correct!" : ("❌ Expected: " + sfCur.answer);
    $("sfFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealStartFill(){
    if (!sfCur) return;
    $("sfInput").value = sfCur.answer;
    $("sfFeedback").textContent = "Answer revealed — now say the whole sentence twice.";
    $("sfFeedback").className = "feedback warn";
  }

  /* ===================== Keep going QCM ===================== */
  var kCur = null;
  function newKeepQ(){
    kCur = choice(KEEPQ);
    $("kTitle").textContent = kCur.title;
    $("kPrompt").textContent = kCur.prompt;
    $("kHint").textContent = "";
    $("kFeedback").textContent = ""; $("kFeedback").className = "feedback";

    renderChoices("kChoices", kCur.choices, kCur.correct, function(ok){
      $("kFeedback").textContent = ok ? "✅ Great. Add one extra question!" : "❌ Too short/closed. Use an open follow-up question.";
      $("kFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenKeepQ(){ if (kCur) speakText(kCur.say); }
  function hintKeepQ(){ if (kCur) $("kHint").textContent = kCur.hint; }

  /* ===================== Interrupt QCM ===================== */
  var iCur = null;
  function newIntQ(){
    iCur = choice(INTQ);
    $("iTitle").textContent = iCur.title;
    $("iPrompt").textContent = iCur.prompt;
    $("iHint").textContent = "";
    $("iFeedback").textContent = ""; $("iFeedback").className = "feedback";

    renderChoices("iChoices", iCur.choices, iCur.correct, function(ok){
      $("iFeedback").textContent = ok ? "✅ Perfect. Say it twice with soft tone." : "❌ Too direct. Add ‘sorry’ or ‘quick question’.";
      $("iFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenIntQ(){ if (iCur) speakText(iCur.say); }
  function hintIntQ(){ if (iCur) $("iHint").textContent = iCur.hint; }

  /* ===================== Phrase builder ===================== */
  var pbCur = null;
  function newPB(){
    pbCur = choice(PB);
    $("pbHint").textContent = "";
    $("pbFeedback").textContent = ""; $("pbFeedback").className = "feedback";
    resetChips("pbBank", shuffle(pbCur.words.slice()), ["pbLine"]);
  }
  function resetPB(){
    if (!pbCur) return;
    $("pbHint").textContent = "";
    $("pbFeedback").textContent = ""; $("pbFeedback").className = "feedback";
    resetChips("pbBank", shuffle(pbCur.words.slice()), ["pbLine"]);
  }
  function listenPB(){ if (pbCur) speakText(pbCur.say); }
  function hintPB(){ if (pbCur) $("pbHint").textContent = pbCur.hint; }
  function checkPB(){
    if (!pbCur) return;
    var got = readLineText("pbLine");
    var ok = (norm(got) === norm(pbCur.target));
    addAttempt(ok);
    $("pbFeedback").textContent = ok ? "✅ Nailed it! Say it twice, then ask your question." : ("❌ Target: " + pbCur.target);
    $("pbFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* ===================== Disagree QCM ===================== */
  var dCur = null;
  function newDisQ(){
    dCur = choice(DISQ);
    $("dTitle").textContent = dCur.title + " — Base: “" + dCur.base + "”";
    $("dPrompt").textContent = dCur.prompt;
    $("dHint").textContent = "";
    $("dFeedback").textContent = ""; $("dFeedback").className = "feedback";

    renderChoices("dChoices", dCur.choices, dCur.correct, function(ok){
      $("dFeedback").textContent = ok ? "✅ Perfect. Soft + respectful." : "❌ Too strong. Use agreement + option.";
      $("dFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenDisQ(){ if (dCur) speakText(dCur.say); }
  function hintDisQ(){ if (dCur) $("dHint").textContent = dCur.hint; }

  /* ===================== Humor QCM ===================== */
  var hCur = null;
  function newHumQ(){
    hCur = choice(HUMQ);
    $("hTitle").textContent = hCur.title;
    $("hPrompt").textContent = hCur.prompt;
    $("hHint").textContent = "";
    $("hFeedback").textContent = ""; $("hFeedback").className = "feedback";

    renderChoices("hChoices", hCur.choices, hCur.correct, function(ok){
      $("hFeedback").textContent = ok ? "✅ Nice. Say it with a smile." : "❌ Too weird/strong. Pick the safe native line.";
      $("hFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenHumQ(){ if (hCur) speakText(hCur.say); }
  function hintHumQ(){ if (hCur) $("hHint").textContent = hCur.hint; }

  /* ===================== Phone call ===================== */
  var pStep = 0;
  var pCur = null;

  function loadPhoneStep(){
    pCur = PHONE[pStep];
    $("pTitle").textContent = pCur.title;
    $("pPrompt").textContent = pCur.prompt;
    $("pHint").textContent = "";
    $("pFeedback").textContent = ""; $("pFeedback").className = "feedback";

    renderChoices("pChoices", pCur.choices, pCur.correct, function(ok){
      $("pFeedback").textContent = ok ? "✅ Great. Say it twice." : "❌ Too direct. Use the polite phone script.";
      $("pFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }

  function startPhone(){
    pStep = 0;
    loadPhoneStep();
  }
  function nextPhone(){
    pStep = (pStep + 1) % PHONE.length;
    loadPhoneStep();
  }
  function listenPhone(){ if (pCur) speakText(pCur.say); }
  function hintPhone(){ if (pCur) $("pHint").textContent = pCur.hint; }

  /* ===================== Roleplays ===================== */
  var rpCur = null;

  function setRpScene(sc){
    rpScene = sc;
    $("rpTitle").textContent = "Scene: " + sc;
    $("rpPrompt").textContent = "Click “New task”.";
    $("rpChoices").innerHTML = "";
    $("rpFeedback").textContent = ""; $("rpFeedback").className = "feedback";
    $("rpHint").textContent = "";
  }
  function newRoleplay(){
    var list = RP[rpScene] || [];
    rpCur = choice(list);
    $("rpTitle").textContent = rpCur.title;
    $("rpPrompt").textContent = rpCur.prompt;
    $("rpHint").textContent = "";
    $("rpFeedback").textContent = ""; $("rpFeedback").className = "feedback";

    renderChoices("rpChoices", rpCur.choices, rpCur.correct, function(ok){
      $("rpFeedback").textContent = ok ? "✅ Perfect real-life line. Repeat it twice." : "❌ Try again: short + polite + natural.";
      $("rpFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenRoleplay(){ if (rpCur) speakText(rpCur.say); }
  function hintRoleplay(){ if (rpCur) $("rpHint").textContent = rpCur.hint; }

  /* ===================== Sorting ===================== */
  var soCur = null, soWords = [];
  function newSO(){
    soCur = choice(SOSETS);
    soWords = soCur.words.slice();
    $("soFeedback").textContent = ""; $("soFeedback").className = "feedback";
    $("soHint").textContent = "";
    resetChips("soBank", soWords, ["soStart","soKeep","soInt","soDis"]);
  }
  function resetSO(){
    resetChips("soBank", soWords, ["soStart","soKeep","soInt","soDis"]);
    $("soFeedback").textContent = ""; $("soFeedback").className = "feedback";
    $("soHint").textContent = "";
  }
  function listenSO(){
    if (!soWords.length) return;
    speakText(soWords.map(function(x){ return x.w; }).join(". "));
  }
  function hintSO(){ if (soCur) $("soHint").textContent = soCur.hint; }
  function checkSO(){
    var res = checkZones([
      {zoneId:"soStart", cat:"S"},
      {zoneId:"soKeep", cat:"K"},
      {zoneId:"soInt", cat:"I"},
      {zoneId:"soDis", cat:"D"}
    ]);
    if (res.total === 0){
      $("soFeedback").textContent = "Move phrases into the boxes first.";
      $("soFeedback").className = "feedback warn";
      return;
    }
    addAttempt(res.ok);
    $("soFeedback").textContent = res.ok ? "✅ Perfect sorting!" : ("❌ " + res.correct + " / " + res.total + ". Re-check follow-ups vs interruptions.");
    $("soFeedback").className = "feedback " + (res.ok ? "ok" : "bad");
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
    $("shFeedback").textContent = "Tip: repeat immediately (copy rhythm).";
    $("shFeedback").className = "feedback warn";
  }
  function playOneShadow(){
    if (!shCurSet.length) return;
    var s = shCurSet[shIndex % shCurSet.length];
    shIndex++;
    speakText(s);
    $("shFeedback").textContent = "Now repeat it twice (slow then normal).";
    $("shFeedback").className = "feedback ok";
  }
  function playAllShadow(){
    if (!shCurSet.length) return;
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
  function buildMission(name, city, scene, mode){
    var slowNote = (mode === "slow") ? " (slow + clear)" : "";
    var lines = [];
    lines.push("CONVERSATION SURVIVAL MISSION" + slowNote);
    lines.push("Name: " + name + " • City: " + city);
    lines.push("");

    if (scene === "airport"){
      lines.push("Hey—quick question. Is this line for security?");
      lines.push("Oh nice—where are you headed?");
      lines.push("No way—what happened? (react + follow-up)");
      lines.push("Sorry to interrupt—could you repeat that, please?");
      lines.push("I see what you mean, but maybe we should wait here.");
      lines.push("Alright—sounds good. Have a great one!");
    } else if (scene === "hotel"){
      lines.push("Hi—quick question. Is there any way to check in early?");
      lines.push("Oh nice—what time is breakfast?");
      lines.push("Just to clarify, is breakfast included?");
      lines.push("I see what you mean, but could we try another room if possible?");
      lines.push("Perfect—thanks so much. Have a great day!");
    } else if (scene === "restaurant"){
      lines.push("Hey! How’s it going?");
      lines.push("Not yet—could we have a minute?");
      lines.push("By the way—quick question: what do you recommend?");
      lines.push("That makes sense. How come it’s spicy?");
      lines.push("Could we get the check, please?");
      lines.push("Awesome—thank you!");
    } else if (scene === "shopping"){
      lines.push("Hey—quick question: do you know if this comes in a smaller size?");
      lines.push("Oh nice—what’s the return policy?");
      lines.push("Sorry to interrupt—can I jump in for a sec?");
      lines.push("That’s fair. Another option is to exchange it.");
      lines.push("No thanks—I’m all set. Have a good one!");
    } else {
      lines.push("Hi—this is " + name + " calling.");
      lines.push("I was wondering if you have any availability tonight.");
      lines.push("Could you tell me the price per night?");
      lines.push("Sorry—could you repeat that, please?");
      lines.push("Perfect—thanks so much. Have a great day!");
    }

    lines.push("");
    lines.push("Checklist: opener + follow-up + polite interruption + soft disagreement + friendly closing.");
    return lines.join("\n");
  }

  function generateMission(){
    var name = ($("mName").value || "Claire").trim();
    var city = ($("mCity").value || "Boston").trim();
    var scene = $("mScene").value;
    var mode = $("mMode").value;

    var script = buildMission(name, city, scene, mode);
    $("scriptBox").textContent = script;
    $("genFeedback").textContent = "✅ Script generated. Listen, then say it twice.";
    $("genFeedback").className = "feedback ok";
  }

  function listenMission(){
    var text = $("scriptBox").textContent || "";
    if (!text || text.indexOf("Generate") >= 0){
      $("genFeedback").textContent = "Generate a script first.";
      $("genFeedback").className = "feedback warn";
      return;
    }
    speakText(text.replace(/\n+/g, " "));
  }

  function copyMission(){
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
    speakText("Hey—quick question. Do you know if this line is for security? Oh nice—what brings you here? Sorry to interrupt, but can I jump in for a sec? Just to clarify, is breakfast included? I see what you mean, but maybe we should double-check. Hi—this is Claire calling. I was wondering if you have any availability tonight.");
  }

  /* ===================== data-say buttons ===================== */
  function wireSayButtons(){
    document.addEventListener("click", function(e){
      var el = e.target;
      if (el && el.getAttribute && el.getAttribute("data-say")){
        speakText(el.getAttribute("data-say"));
      }
      if (el && el.getAttribute && el.getAttribute("data-fcsay")){
        speakText(el.getAttribute("data-fcsay"));
      }
    });
  }

  /* ===================== Init ===================== */
  function init(){
    $("accent").addEventListener("change", function(){ speech.accent = $("accent").value; pickVoice(); });
    $("rate").addEventListener("input", function(){
      speech.rate = parseFloat($("rate").value);
      $("rateLabel").textContent = speech.rate.toFixed(2) + "×";
    });
    $("btnTest").addEventListener("click", function(){
      speakText("Test voice. Hey—quick question. Is this line for security? Sorry to interrupt—could you repeat that, please?");
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
    $("fcSetStart").addEventListener("click", function(){ renderFlashcards("start"); });
    $("fcSetKeep").addEventListener("click", function(){ renderFlashcards("keep"); });
    $("fcSetInterrupt").addEventListener("click", function(){ renderFlashcards("interrupt"); });
    $("fcSetDisagree").addEventListener("click", function(){ renderFlashcards("disagree"); });
    $("fcSetPhone").addEventListener("click", function(){ renderFlashcards("phone"); });
    $("fcSetService").addEventListener("click", function(){ renderFlashcards("service"); });

    // start QCM
    $("sNew").addEventListener("click", newStartQ);
    $("sListen").addEventListener("click", function(){ if (sCur) speakText(sCur.say); });
    $("sHintBtn").addEventListener("click", function(){ if (sCur) $("sHint").textContent = sCur.hint; });
    newStartQ();

    // start fill
    $("sfNew").addEventListener("click", newStartFill);
    $("sfListen").addEventListener("click", listenStartFill);
    $("sfHintBtn").addEventListener("click", hintStartFill);
    $("sfCheck").addEventListener("click", checkStartFill);
    $("sfReveal").addEventListener("click", revealStartFill);
    newStartFill();

    // keep QCM
    $("kNew").addEventListener("click", newKeepQ);
    $("kListen").addEventListener("click", listenKeepQ);
    $("kHintBtn").addEventListener("click", hintKeepQ);
    newKeepQ();

    // interrupt QCM
    $("iNew").addEventListener("click", newIntQ);
    $("iListen").addEventListener("click", listenIntQ);
    $("iHintBtn").addEventListener("click", hintIntQ);
    newIntQ();

    // phrase builder
    wireDropzone($("pbLine"));
    $("pbNew").addEventListener("click", newPB);
    $("pbListen").addEventListener("click", listenPB);
    $("pbHintBtn").addEventListener("click", hintPB);
    $("pbCheck").addEventListener("click", checkPB);
    $("pbReset").addEventListener("click", resetPB);
    newPB();

    // disagree
    $("dNew").addEventListener("click", newDisQ);
    $("dListen").addEventListener("click", listenDisQ);
    $("dHintBtn").addEventListener("click", hintDisQ);
    newDisQ();

    // humor
    $("hNew").addEventListener("click", newHumQ);
    $("hListen").addEventListener("click", listenHumQ);
    $("hHintBtn").addEventListener("click", hintHumQ);
    newHumQ();

    // phone
    $("pStart").addEventListener("click", startPhone);
    $("pNext").addEventListener("click", nextPhone);
    $("pListen").addEventListener("click", listenPhone);
    $("pHintBtn").addEventListener("click", hintPhone);

    // roleplays
    $("rpAirport").addEventListener("click", function(){ setRpScene("airport"); });
    $("rpHotel").addEventListener("click", function(){ setRpScene("hotel"); });
    $("rpRestaurant").addEventListener("click", function(){ setRpScene("restaurant"); });
    $("rpShopping").addEventListener("click", function(){ setRpScene("shopping"); });
    $("rpNew").addEventListener("click", newRoleplay);
    $("rpListen").addEventListener("click", listenRoleplay);
    $("rpHintBtn").addEventListener("click", hintRoleplay);
    setRpScene("airport");

    // sorting
    wireDropzone($("soStart")); wireDropzone($("soKeep")); wireDropzone($("soInt")); wireDropzone($("soDis"));
    $("soNew").addEventListener("click", newSO);
    $("soListen").addEventListener("click", listenSO);
    $("soHintBtn").addEventListener("click", hintSO);
    $("soCheck").addEventListener("click", checkSO);
    $("soReset").addEventListener("click", resetSO);
    newSO();

    // shadow
    $("shNew").addEventListener("click", newShadow);
    $("shPlay").addEventListener("click", playOneShadow);
    $("shPlayAll").addEventListener("click", playAllShadow);
    newShadow();

    // mission
    $("genBtn").addEventListener("click", generateMission);
    $("genListen").addEventListener("click", listenMission);
    $("genCopy").addEventListener("click", copyMission);

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
