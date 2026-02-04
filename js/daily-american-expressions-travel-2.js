/* SpeakEasyTisha — Daily American Expressions 2 (Travel) — 60 min follow-up lesson
   Review + Flashcards + Match + False Friends + QCM + Fill-in + Dialogues + Story + Texting + Final script builder
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

  /* ===================== CONTENT ===================== */

  // Review QCM (Lesson 1 recap)
  var REVIEW = [
    { title:"Coffee shop", prompt:"Barista: “For here or to go?” (You want takeaway)", hint:"Short native answer.", say:"To go, please.", correct:0, choices:["To go, please.","I go.","For go."] },
    { title:"Store", prompt:"Clerk: “Can I help you?” (You are browsing)", hint:"Standard phrase.", say:"I'm just looking, thanks.", correct:1, choices:["No, I watch.","I'm just looking, thanks.","I search something."] },
    { title:"Restaurant", prompt:"You want the bill in the US.", hint:"It’s ‘check’.", say:"Could we get the check, please?", correct:2, choices:["The addition, please.","Give me the bill.","Could we get the check, please?"] },
    { title:"Hotel", prompt:"You arrived. What do you say?", hint:"Reservation + check in.", say:"Hi, I have a reservation. Could I check in, please?", correct:2, choices:["I am coming for my reservation.","I reserved and I take the room.","Hi, I have a reservation. Could I check in, please?"] },
    { title:"Small talk", prompt:"Someone says: “How’s it going?”", hint:"Short reply + return question.", say:"Pretty good—how about you?", correct:1, choices:["I go to my hotel.","Pretty good—how about you?","Very goodly."] }
  ];

  var REVIEW_PROMPTS = [
    "You’re in a store. The clerk asks: “Can I help you?” Reply politely.",
    "You didn’t understand. Ask them to repeat (native).",
    "You want directions politely. Ask a stranger.",
    "Order a coffee and say it’s to go.",
    "Ask for the check politely."
  ];

  // Flashcards 2 (tagged)
  var FLASH = [
    // Plans
    { tag:"plans", front:"I’m down.", back:"FR: Je suis partant(e).\nCasual: yes, I want to.", say:"I'm down." },
    { tag:"plans", front:"I’m in.", back:"FR: J’en suis.\nStrong yes (joining the plan).", say:"I'm in." },
    { tag:"plans", front:"That works for me.", back:"FR: Ça me va.\nVery common.", say:"That works for me." },
    { tag:"plans", front:"Let me check.", back:"FR: Je regarde / Je vérifie.\nUsed for schedule.", say:"Let me check." },
    { tag:"plans", front:"Maybe another time.", back:"FR: Une autre fois.\nPolite refusal.", say:"Maybe another time." },
    { tag:"plans", front:"Rain check?", back:"FR: On reporte ? (polite)\nUS idiom: reschedule.", say:"Can we take a rain check?" },

    // Problems
    { tag:"problems", front:"My bad.", back:"FR: Désolé(e), c’est ma faute.\nCasual apology.", say:"My bad." },
    { tag:"problems", front:"All good.", back:"FR: Tout va bien / Pas grave.", say:"All good." },
    { tag:"problems", front:"I’m having an issue with…", back:"FR: J’ai un problème avec…\nPolite, clear.", say:"I'm having an issue with my room key." },
    { tag:"problems", front:"Is there any way to…?", back:"FR: Est-ce qu’il y aurait moyen de…?\nVery polite.", say:"Is there any way to switch rooms?" },
    { tag:"problems", front:"Would you mind…?", back:"FR: Ça vous dérangerait de…?\nVery polite request.", say:"Would you mind checking that for me?" },
    { tag:"problems", front:"I was wondering if you could…", back:"FR: Je me demandais si vous pouviez…\nSuper polite.", say:"I was wondering if you could help me out." },

    // Phrasal verbs
    { tag:"phrasal", front:"pick up", back:"FR: récupérer (person/thing)\nPick me up at 7.", say:"Can you pick me up at seven?" },
    { tag:"phrasal", front:"drop off", back:"FR: déposer\nDrop me off here.", say:"Can you drop me off here?" },
    { tag:"phrasal", front:"head out", back:"FR: partir\nI’m gonna head out.", say:"I'm gonna head out." },
    { tag:"phrasal", front:"figure out", back:"FR: trouver / comprendre\nI’ll figure it out.", say:"I'll figure it out." },
    { tag:"phrasal", front:"run into (a problem)", back:"FR: tomber sur / rencontrer\nWe ran into a problem.", say:"We ran into a problem." },
    { tag:"phrasal", front:"check out", back:"FR: payer/partir (hotel) OR regarder\nWe check out at noon.", say:"We check out at noon." },

    // Native glue
    { tag:"plans", front:"I’m on my way.", back:"FR: J’arrive / Je suis en route.", say:"I'm on my way." },
    { tag:"plans", front:"I’m running late.", back:"FR: Je suis en retard.", say:"I'm running late." },
    { tag:"problems", front:"No rush.", back:"FR: Pas de souci / Prends ton temps.", say:"No rush." },
    { tag:"problems", front:"I kinda need help.", back:"FR: J’ai un peu besoin d’aide.\n‘kinda’ softens it.", say:"I kinda need help with this." }
  ];

  // Cheat sheet
  var CHEAT = [
    { title:"Making plans (native)", items:[
      "I’m down. / I’m in.",
      "That works for me.",
      "Let me check. / I’ll get back to you.",
      "Maybe another time. / Rain check?"
    ]},
    { title:"Polite problems", items:[
      "I’m having an issue with…",
      "Is there any way to…?",
      "Would you mind…?",
      "I was wondering if you could…"
    ]},
    { title:"Phrasal verbs (travel)", items:[
      "pick up / drop off (Uber, rides)",
      "head out (leave)",
      "figure out (solve/understand)",
      "run into a problem (encounter)"
    ]},
    { title:"Texting travel", items:[
      "OMW = on my way",
      "Running late (5–10 mins)",
      "All good / No worries",
      "Can we reschedule? (rain check)"
    ]}
  ];

  /* -------------------- Match sets -------------------- */
  var MATCH_SETS = [
    {
      situations:[
        "You want to accept a plan casually (friendly).",
        "You want to refuse politely without being rude.",
        "You have a hotel problem and need a polite request.",
        "You want to talk about transport (Uber/ride)."
      ],
      pairs:[
        { exp:"I’m down.", sit:0, say:"I'm down." },
        { exp:"That works for me.", sit:0, say:"That works for me." },
        { exp:"Maybe another time.", sit:1, say:"Maybe another time." },
        { exp:"Can we take a rain check?", sit:1, say:"Can we take a rain check?" },
        { exp:"Is there any way to switch rooms?", sit:2, say:"Is there any way to switch rooms?" },
        { exp:"I was wondering if you could help me out.", sit:2, say:"I was wondering if you could help me out." },
        { exp:"Can you pick me up at 7?", sit:3, say:"Can you pick me up at seven?" },
        { exp:"Can you drop me off here?", sit:3, say:"Can you drop me off here?" }
      ],
      hint:"Plans: down/works • Refusal: maybe another time/rain check • Hotel: any way / wondering if • Ride: pick up/drop off"
    },
    {
      situations:[
        "You’re late and texting a friend.",
        "You want to calm someone: ‘it’s okay.’",
        "You want to leave soon.",
        "You want to solve a problem politely."
      ],
      pairs:[
        { exp:"I’m running late—be there in 10.", sit:0, say:"I'm running late—be there in ten." },
        { exp:"I’m on my way.", sit:0, say:"I'm on my way." },
        { exp:"All good.", sit:1, say:"All good." },
        { exp:"No rush.", sit:1, say:"No rush." },
        { exp:"I’m gonna head out.", sit:2, say:"I'm gonna head out." },
        { exp:"I have to head out soon.", sit:2, say:"I have to head out soon." },
        { exp:"Would you mind checking that?", sit:3, say:"Would you mind checking that?" },
        { exp:"I’ll figure it out.", sit:3, say:"I'll figure it out." }
      ],
      hint:"Late: running late / on my way • Calm: all good / no rush • Leave: head out • Solve: would you mind / figure it out"
    }
  ];

  /* -------------------- False friends content -------------------- */
  var FALSE_FRIENDS = [
    { word:"actually", fr:"en fait", not:"actuellement", ex:"Actually, I’m from France.", say:"Actually, I'm from France." },
    { word:"eventually", fr:"finalement", not:"éventuellement", ex:"Eventually, we found the hotel.", say:"Eventually, we found the hotel." },
    { word:"assist", fr:"aider / assister à (event)", not:"assister quelqu’un", ex:"Can you help me? (NOT assist me)", say:"Can you help me?" },
    { word:"resume", fr:"reprendre", not:"CV (résumé)", ex:"Let’s resume the meeting.", say:"Let's resume the meeting." }
  ];

  var FF_Q = [
    {
      title:"Actually",
      prompt:"Choose the correct meaning of “actually” in: “Actually, I’m just visiting.”",
      hint:"It corrects/clarifies info: “en fait”.",
      say:"Actually, I'm just visiting.",
      correct:1,
      choices:["actuellement","en fait","éventuellement"]
    },
    {
      title:"Eventually",
      prompt:"Choose the correct meaning of “eventually” in: “Eventually, we got there.”",
      hint:"It means “in the end”.",
      say:"Eventually, we got there.",
      correct:2,
      choices:["peut-être","actuellement","finalement"]
    },
    {
      title:"Assist",
      prompt:"In travel English, which is natural?",
      hint:"Use “help” for aider.",
      say:"Can you help me, please?",
      correct:0,
      choices:["Can you help me, please?","Can you assist me? (in a store)","Can you assist me to find?"]
    },
    {
      title:"Résumé vs resume",
      prompt:"Your CV in American English is…",
      hint:"US spelling includes accents sometimes removed: resume (CV). But ‘resume’ also means ‘reprendre’.",
      say:"My resume is updated. Let's resume the meeting.",
      correct:1,
      choices:["a resume (only means reprendre)","a résumé / resume (CV)","a re-sum"]
    }
  ];

  /* -------------------- QCM (new situations) -------------------- */
  var QCM = [
    {
      title:"Making plans",
      prompt:"Friend: “Want to grab coffee later?” (You say yes casually.)",
      hint:"Native casual yes: ‘I’m down.’",
      say:"Yeah, I'm down.",
      correct:1,
      choices:["Yes, I accept.","Yeah, I’m down.","I am agree."]
    },
    {
      title:"Polite refusal",
      prompt:"Friend: “Dinner tonight?” You can’t.",
      hint:"Polite + friendly: propose another time.",
      say:"I can't tonight—maybe another time?",
      correct:2,
      choices:["No, I don’t want.","I refuse.","I can't tonight—maybe another time?"]
    },
    {
      title:"Hotel issue",
      prompt:"You need a different room because it’s noisy.",
      hint:"Use ‘Is there any way to…?’",
      say:"Is there any way to switch rooms? It's a bit noisy.",
      correct:0,
      choices:[
        "Is there any way to switch rooms? It's a bit noisy.",
        "Change my room now.",
        "I want another room."
      ]
    },
    {
      title:"Texting (late)",
      prompt:"You’re late. Best text?",
      hint:"Short + time estimate.",
      say:"Running late—be there in 10.",
      correct:1,
      choices:["I am late. Sorry.","Running late—be there in 10.","I am in retard."]
    },
    {
      title:"Airport / delay",
      prompt:"Agent: “Your flight is delayed.” Natural response?",
      hint:"Stay calm + ask for options.",
      say:"Okay—do you know how long the delay is?",
      correct:2,
      choices:[
        "I am angry. It's not possible.",
        "It is a catastrophe.",
        "Okay—do you know how long the delay is?"
      ]
    },
    {
      title:"Restaurant issue",
      prompt:"You got the wrong dish. Natural + polite?",
      hint:"Softener + clear.",
      say:"Sorry—this isn't what I ordered. Could you check, please?",
      correct:0,
      choices:[
        "Sorry—this isn't what I ordered. Could you check, please?",
        "You made mistake. Change.",
        "This is not good. I want other."
      ]
    },
    {
      title:"Uber / ride",
      prompt:"You want the driver to stop here.",
      hint:"Simple: drop me off here.",
      say:"You can drop me off here, thanks.",
      correct:1,
      choices:["You can leave me here.","You can drop me off here, thanks.","You deposit me here."]
    },
    {
      title:"Friendly close",
      prompt:"Staff: “Sorry about that.” Best reply (friendly)?",
      hint:"Common: ‘All good.’",
      say:"All good—thanks!",
      correct:2,
      choices:["It’s nothing.","No, it’s okay.","All good—thanks!"]
    }
  ];

  // Speaking prompts
  var SPEAK_PROMPTS = [
    "Accept a plan casually (use: I’m down / I’m in).",
    "Refuse politely and suggest another time.",
    "Explain a hotel problem politely and ask for a solution.",
    "Text a friend: you’re running late (give a time).",
    "Ask an airport agent about a delay (calm + polite).",
    "Fix a wrong restaurant order politely."
  ];

  // Fill-in (accept multiple answers)
  var FILL = [
    { sentence:"____ bad. (casual apology)", answers:["my"], show:"My bad.", hint:"Very common casual apology.", say:"My bad." },
    { sentence:"All ____. (it’s okay)", answers:["good"], show:"All good.", hint:"Means ‘no problem’.", say:"All good." },
    { sentence:"I’m ____ to grab coffee. (yes!)", answers:["down","in"], show:"I’m down.", hint:"Native casual yes.", say:"I'm down to grab coffee." },
    { sentence:"I’m ____ late. (text)", answers:["running"], show:"I’m running late.", hint:"Standard travel text.", say:"I'm running late." },
    { sentence:"I’m gonna ____ out. (leave)", answers:["head"], show:"I’m gonna head out.", hint:"Phrasal verb: head out = leave.", say:"I'm gonna head out." },
    { sentence:"I ____ need help with this. (softener)", answers:["kinda","kind of"], show:"I kinda need help.", hint:"Softener: kinda/kind of.", say:"I kinda need help with this." }
  ];

  // Dialogues
  var DIALOGUES = [
    {
      title:"Hotel problem (polite fix)",
      goal:"Explain problem + ask politely for a solution",
      lines:[
        "Hi—sorry to bother you.",
        "No problem. What’s going on?",
        "I’m having an issue with the AC. It isn’t working.",
        "I’m sorry about that.",
        "Is there any way to switch rooms?",
        "Let me check what we have available.",
        "Thanks—I really appreciate it."
      ]
    },
    {
      title:"Making plans + rain check",
      goal:"Invite + accept + reschedule politely",
      lines:[
        "Hey! Want to grab coffee later?",
        "Yeah, I’m down. What time works for you?",
        "How about 4?",
        "That works for me.",
        "Actually—I’m running late. Can we take a rain check?",
        "Sure—all good. Tomorrow?",
        "Perfect. I’ll text you."
      ]
    }
  ];

  // Story (part 2)
  var DAY = [
    {
      title:"Airport — delay",
      prompt:"Agent: “Your flight is delayed.”",
      hint:"Stay calm + ask for information/options.",
      say:"Okay—do you know how long the delay is?",
      correct:2,
      choices:[
        "This is impossible! I'm angry.",
        "I want to speak to the director.",
        "Okay—do you know how long the delay is?"
      ]
    },
    {
      title:"Hotel — noisy room",
      prompt:"You can’t sleep. You call the front desk.",
      hint:"Use: ‘Is there any way to…?’ + softener.",
      say:"Hi—sorry to bother you. Is there any way to switch rooms? It's a bit noisy.",
      correct:1,
      choices:[
        "Change my room. It's noisy.",
        "Hi—sorry to bother you. Is there any way to switch rooms? It's a bit noisy.",
        "I want a new room now."
      ]
    },
    {
      title:"Restaurant — wrong order",
      prompt:"You got the wrong dish.",
      hint:"Softener + clear request.",
      say:"Sorry—this isn't what I ordered. Could you check, please?",
      correct:0,
      choices:[
        "Sorry—this isn't what I ordered. Could you check, please?",
        "You made mistake. Change it.",
        "This is bad."
      ]
    },
    {
      title:"Friends — plans",
      prompt:"Friend: “We’re going out tonight—wanna come?”",
      hint:"Casual yes: ‘I’m in / I’m down.’",
      say:"Yeah, I'm in!",
      correct:2,
      choices:[
        "Yes, I accept your proposition.",
        "I am agree.",
        "Yeah, I'm in!"
      ]
    },
    {
      title:"Texting — late",
      prompt:"You’re late. Send a normal US text.",
      hint:"Short + time estimate.",
      say:"Running late—be there in 10.",
      correct:1,
      choices:[
        "Sorry I am late I arrive soonly.",
        "Running late—be there in 10.",
        "I am in retard ten minutes."
      ]
    }
  ];

  // Texting cards + quiz
  var TEXT_CARDS = [
    { title:"Running late", text:"Running late—be there in 10.", fr:"Je suis en retard—j’arrive dans 10 min.", say:"Running late—be there in ten." },
    { title:"On my way", text:"OMW. See you soon!", fr:"J’arrive. À tout de suite !", say:"O M W. See you soon!" },
    { title:"All good", text:"All good—no worries.", fr:"Pas grave—pas de souci.", say:"All good—no worries." },
    { title:"Rain check", text:"Can we take a rain check?", fr:"On reporte ?", say:"Can we take a rain check?" },
    { title:"Let me check", text:"Let me check and I’ll get back to you.", fr:"Je vérifie et je te redis.", say:"Let me check and I'll get back to you." }
  ];

  var TXT_Q = [
    {
      title:"Texting: you’re late",
      prompt:"Choose the best text.",
      hint:"Short + time estimate.",
      say:"Running late—be there in 10.",
      correct:1,
      choices:["I am late. I arrive.","Running late—be there in 10.","I am in retard."]
    },
    {
      title:"Texting: reschedule",
      prompt:"You can’t make it. Polite and natural?",
      hint:"Use ‘rain check’ or ‘maybe another time’.",
      say:"Can we take a rain check?",
      correct:2,
      choices:["I cancel.","I will not come.","Can we take a rain check?"]
    },
    {
      title:"Texting: calm response",
      prompt:"Friend says: “Sorry!” You reply kindly.",
      hint:"All good / no worries.",
      say:"All good—no worries.",
      correct:0,
      choices:["All good—no worries.","It is nothing.","No, it’s ok."]
    }
  ];

  /* ===================== UI helpers ===================== */
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

  /* ===================== Review QCM ===================== */
  var rCur = null;
  function newReview(){
    rCur = choice(REVIEW);
    $("rTitle").textContent = rCur.title;
    $("rPrompt").textContent = rCur.prompt;
    $("rHint").textContent = "";
    $("rFeedback").textContent = ""; $("rFeedback").className = "feedback";

    renderChoices("rChoices", rCur.choices, rCur.correct, function(ok){
      $("rFeedback").textContent = ok ? "✅ Nice—keep that native rhythm." : "❌ Try the more natural option next time.";
      $("rFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenReview(){ if (rCur) speakText(rCur.say); }
  function hintReview(){ if (rCur) $("rHint").textContent = rCur.hint; }

  // Review prompts
  var rpCur = [];
  function newReviewPrompts(){
    rpCur = shuffle(REVIEW_PROMPTS).slice(0, 4);
    var box = $("reviewPrompts");
    box.innerHTML = "";
    for (var i=0;i<rpCur.length;i++){
      var d = document.createElement("div");
      d.className = "prompt";
      d.textContent = "🗣️ " + rpCur[i];
      box.appendChild(d);
    }
  }
  function listenOneReviewPrompt(){
    if (!rpCur.length) return;
    speakText(choice(rpCur));
  }

  /* ===================== Flashcards ===================== */
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
          '<span class="tiny muted">Use it in a travel sentence</span>' +
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

  /* ===================== Match (drag + tap) ===================== */
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
      $("mFeedback").textContent = "Move phrases into the situation boxes first.";
      $("mFeedback").className = "feedback warn";
      return;
    }
    var ok = (correct === total);
    addAttempt(ok);
    $("mFeedback").textContent = ok ? "✅ Perfect match!" : "❌ " + correct + " / " + total + ". Try again (tone + context).";
    $("mFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* ===================== False friends render + quiz ===================== */
  function renderFalseFriends(){
    var box = $("ffGrid");
    box.innerHTML = "";
    for (var i=0;i<FALSE_FRIENDS.length;i++){
      var f = FALSE_FRIENDS[i];
      var d = document.createElement("div");
      d.className = "ffItem";
      d.innerHTML =
        "<h4>⚠️ <span class='code'>"+esc(f.word)+"</span></h4>" +
        "<div class='muted'>✅ Means: <span class='code'>"+esc(f.fr)+"</span></div>" +
        "<div class='muted'>❌ NOT: <span class='code'>"+esc(f.not)+"</span></div>" +
        "<div class='muted'>Example: <span class='code'>"+esc(f.ex)+"</span></div>";
      box.appendChild(d);
    }
  }
  function listenFalseFriends(){
    var s = [];
    for (var i=0;i<FALSE_FRIENDS.length;i++){
      s.push(FALSE_FRIENDS[i].say);
    }
    speakText(s.join(" "));
  }

  var ffCur = null;
  function newFFQ(){
    ffCur = choice(FF_Q);
    $("ffTitle").textContent = ffCur.title;
    $("ffPrompt").textContent = ffCur.prompt;
    $("ffHint").textContent = "";
    $("ffFeedback").textContent = ""; $("ffFeedback").className = "feedback";

    renderChoices("ffChoices", ffCur.choices, ffCur.correct, function(ok){
      $("ffFeedback").textContent = ok ? "✅ Yes — that’s the correct meaning." : "❌ Careful — that’s the French trap.";
      $("ffFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function hintFFQ(){ if (ffCur) $("ffHint").textContent = ffCur.hint; }
  function listenFFQ(){ if (ffCur) speakText(ffCur.say); }

  /* ===================== QCM ===================== */
  var qCur = null;
  function newQ(){
    qCur = choice(QCM);
    $("qTitle").textContent = qCur.title;
    $("qPrompt").textContent = qCur.prompt;
    $("qHint").textContent = "";
    $("qFeedback").textContent = ""; $("qFeedback").className = "feedback";

    renderChoices("qChoices", qCur.choices, qCur.correct, function(ok){
      $("qFeedback").textContent = ok ? "✅ Great — now say it out loud." : "❌ Not the most natural option.";
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
  function listenFill(){
    if (!fCur) return;
    speakText(fCur.say);
  }
  function hintFill(){
    if (!fCur) return;
    $("fHint").textContent = fCur.hint;
  }
  function checkFill(){
    if (!fCur) return;
    var v = norm($("fInput").value);
    var ok = false;
    for (var i=0;i<fCur.answers.length;i++){
      if (v === norm(fCur.answers[i])) { ok = true; break; }
    }
    addAttempt(ok);
    $("fFeedback").textContent = ok ? "✅ Correct!" : "❌ Expected: " + fCur.show;
    $("fFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealFill(){
    if (!fCur) return;
    $("fInput").value = fCur.answers[0];
    $("fFeedback").textContent = "Answer revealed — now say the full sentence out loud.";
    $("fFeedback").className = "feedback warn";
  }

  /* ===================== Dialogues reorder ===================== */
  var dCur = null;
  var dScrambled = [];

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

    var down = document.createElement("button");
    down.className = "iconBtn";
    down.type = "button";
    down.textContent = "⬇";

    var move = document.createElement("button");
    move.className = "iconBtn";
    move.type = "button";
    move.textContent = (where === "bank") ? "➡" : "⬅";

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

  function renderDialogueLists(){
    $("dBank").innerHTML = "";
    $("dTarget").innerHTML = "";
    $("dFeedback").textContent = ""; $("dFeedback").className="feedback";
    $("dHint").textContent = "";

    for (var i=0;i<dScrambled.length;i++){
      $("dBank").appendChild(makeLineItem(dScrambled[i], "bank"));
    }
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
    $("dHint").textContent = "Hint: Start with a greeting + softener (Hi / sorry to bother you / hey).";
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
      ? "✅ Perfect order! Now roleplay it (friendly + polite)."
      : "❌ " + correct + " / " + dCur.lines.length + " in correct position. Try moving greeting first.";
    $("dFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* ===================== Story ===================== */
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
      $("dayFeedback").textContent = ok ? "✅ Nice! That sounds natural." : "❌ Too direct/unnatural.";
      $("dayFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }

  function startDay(){ dayIndex = 0; renderDay(DAY[0]); }
  function listenDay(){ if (dayIndex >= 0) speakText(DAY[dayIndex].say); }
  function hintDay(){ if (dayIndex >= 0) $("dayHint").textContent = DAY[dayIndex].hint; }
  function sayDay(){
    if (dayIndex < 0) return;
    if (dayChosen){ speakText(dayChosen); }
    else { speakText(DAY[dayIndex].say); }

    if (dayChosen){
      dayIndex++;
      if (dayIndex >= DAY.length){
        $("dayFeedback").textContent = "✅ Story complete! Repeat your best answers once more.";
        $("dayFeedback").className = "feedback ok";
        dayIndex = DAY.length - 1;
      } else {
        setTimeout(function(){ renderDay(DAY[dayIndex]); }, 450);
      }
    }
  }

  /* ===================== Texting ===================== */
  function renderTextCards(){
    var box = $("textCards");
    box.innerHTML = "";
    for (var i=0;i<TEXT_CARDS.length;i++){
      var t = TEXT_CARDS[i];
      var d = document.createElement("div");
      d.className = "textCard";
      d.innerHTML =
        "<b>📱 "+esc(t.title)+"</b>" +
        "<div class='code'>"+esc(t.text)+"</div>" +
        "<div class='muted' style='margin-top:6px;'>FR: "+esc(t.fr)+"</div>";
      box.appendChild(d);
    }
  }
  function listenTextSamples(){
    var s = [];
    for (var i=0;i<TEXT_CARDS.length;i++) s.push(TEXT_CARDS[i].text);
    speakText(s.join(" "));
  }

  var txtCur = null;
  function newTxtQ(){
    txtCur = choice(TXT_Q);
    $("txtTitle").textContent = txtCur.title;
    $("txtPrompt").textContent = txtCur.prompt;
    $("txtHint").textContent = "";
    $("txtFeedback").textContent = ""; $("txtFeedback").className="feedback";

    renderChoices("txtChoices", txtCur.choices, txtCur.correct, function(ok){
      $("txtFeedback").textContent = ok ? "✅ Perfect. That’s how people actually text." : "❌ Too French/unnatural.";
      $("txtFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function hintTxtQ(){ if (txtCur) $("txtHint").textContent = txtCur.hint; }
  function listenTxtQ(){ if (txtCur) speakText(txtCur.say); }

  /* ===================== Final Mission builder ===================== */
  function planText(plan){
    if (plan === "coffee") return "grab coffee";
    if (plan === "dinner") return "do dinner";
    if (plan === "museum") return "hit the museum";
    return "go for a quick walk";
  }
  function problemText(p){
    if (p === "hotel_noise") return { issue:"the room is pretty noisy", ask:"switch rooms" };
    if (p === "hotel_ac") return { issue:"the AC isn't working", ask:"switch rooms or send someone up" };
    if (p === "flight_delay") return { issue:"my flight got delayed", ask:"rebook or find the next option" };
    return { issue:"I got the wrong order", ask:"fix it / remake it" };
  }
  function toneLine(tone){
    if (tone === "polite") return { open:"Hi—sorry to bother you.", soften:"I was wondering if you could help me out.", thanks:"Thanks—I really appreciate it." };
    if (tone === "firm") return { open:"Hi—sorry to bother you.", soften:"Is there any way to fix this today?", thanks:"Thanks for taking care of it." };
    return { open:"Hey—quick question.", soften:"Any chance you can help me out?", thanks:"Thanks a ton!" };
  }

  function generateScript(){
    var name = $("mName").value.trim() || "Alex";
    var city = $("mCity").value.trim() || "the city";
    var plan = $("mPlan").value;
    var prob = $("mProblem").value;
    var tone = $("mTone").value;

    var p = problemText(prob);
    var t = toneLine(tone);

    var s = [];
    s.push("TEXT 1 (to a friend):");
    s.push("Hey! I'm in " + city + ". Want to " + planText(plan) + " later?");
    s.push("");
    s.push("TEXT 2 (if you're late):");
    s.push("Running late—be there in 10. My bad!");
    s.push("");
    s.push("SPEAKING (problem-solving):");
    s.push(t.open);
    if (prob.indexOf("hotel_") === 0){
      s.push("This is " + name + " in room 512. I'm having an issue—" + p.issue + ".");
      s.push(t.soften);
      s.push("Is there any way to " + p.ask + "?");
      s.push(t.thanks);
    } else if (prob === "flight_delay"){
      s.push("Hi—my flight got delayed. Do you know how long the delay is?");
      s.push(t.soften);
      s.push("Is there any way to " + p.ask + "?");
      s.push(t.thanks);
    } else {
      s.push("Sorry—" + p.issue + ".");
      s.push(t.soften);
      s.push("Could you " + p.ask + ", please?");
      s.push(t.thanks);
    }

    var out = s.join("\n");
    $("scriptBox").textContent = out;
    $("genFeedback").textContent = "✅ Script generated. Now click “Listen” and roleplay it.";
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
    speakText("I'm down. That works for me. Can we take a rain check? I'm having an issue with the room. Is there any way to switch rooms? Would you mind checking that? Running late—be there in 10. All good. No rush.");
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
      speakText("Test voice. Repeat after me: I'm down. That works for me. My bad. All good. Is there any way to switch rooms?");
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

    // review
    $("rNew").addEventListener("click", newReview);
    $("rListen").addEventListener("click", listenReview);
    $("rHintBtn").addEventListener("click", hintReview);
    newReview();
    $("rpNew").addEventListener("click", newReviewPrompts);
    $("rpListen").addEventListener("click", listenOneReviewPrompt);
    newReviewPrompts();

    // flashcards
    renderFlashcards(null);
    $("fcShuffle").addEventListener("click", function(){ renderFlashcards(null); });
    $("fcListenRand").addEventListener("click", function(){ speakText(choice(FLASH).say); });
    $("fcSetPlans").addEventListener("click", function(){ renderFlashcards("plans"); });
    $("fcSetProblems").addEventListener("click", function(){ renderFlashcards("problems"); });
    $("fcSetPhrasal").addEventListener("click", function(){ renderFlashcards("phrasal"); });

    // match
    wireDropzone($("mA")); wireDropzone($("mB")); wireDropzone($("mC")); wireDropzone($("mD"));
    $("mNew").addEventListener("click", newMatch);
    $("mListen").addEventListener("click", listenMatch);
    $("mReset").addEventListener("click", resetMatch);
    $("mCheck").addEventListener("click", checkMatch);
    $("mHintBtn").addEventListener("click", function(){ if (mCur) $("mHint").textContent = mCur.hint; });
    newMatch();

    // false friends
    renderFalseFriends();
    $("ffListen").addEventListener("click", listenFalseFriends);
    $("ffNew").addEventListener("click", newFFQ);
    $("ffHintBtn").addEventListener("click", hintFFQ);
    $("ffListenQ").addEventListener("click", listenFFQ);
    newFFQ();

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

    // story
    $("dayStart").addEventListener("click", startDay);
    $("dayListen").addEventListener("click", listenDay);
    $("dayHintBtn").addEventListener("click", hintDay);
    $("daySay").addEventListener("click", sayDay);

    // texting
    renderTextCards();
    $("txtListen").addEventListener("click", listenTextSamples);
    $("txtNew").addEventListener("click", newTxtQ);
    $("txtHintBtn").addEventListener("click", hintTxtQ);
    $("txtListenQ").addEventListener("click", listenTxtQ);
    newTxtQ();

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
