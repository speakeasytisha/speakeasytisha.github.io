/* SpeakEasyTisha — Talk Like an American (Daily Expressions) — 60 min
   Flashcards + QCM + phrase builder + sorting + fill-in + travel roleplay + intonation + shadowing + mission
   Touch-friendly: drag OR tap-to-move chips. iPad Safari friendly (ES5).
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

  /* -------------------- data-say buttons -------------------- */
  function wireSayButtons(){
    document.addEventListener("click", function(e){
      var el = e.target;
      if (el && el.getAttribute && el.getAttribute("data-say")){
        speakText(el.getAttribute("data-say"));
      }
    });
  }

  /* ===================== QCM helper ===================== */
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
    return out.join(" ").replace(/\s—\s/g, " — ").replace(/\s\?\s/g,"?").trim();
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

  /* ===================== DATA ===================== */

  // Warm-up QCM: most natural phrase
  var WARM = [
    {
      title:"Greeting",
      prompt:"You meet someone casually. What sounds most American?",
      say:"How's it going?",
      hint:"‘How are you?’ is fine, but ‘How’s it going?’ is super common.",
      correct:1,
      choices:["How do you do?", "How's it going?", "How are you doing, sir?"]
    },
    {
      title:"Ordering",
      prompt:"At a coffee shop. What’s natural?",
      say:"Can I get a latte, please?",
      hint:"Use ‘Can I get…?’ / ‘Could I get…?’ (polite + common).",
      correct:2,
      choices:["I want a latte.", "Give me a latte.", "Can I get a latte, please?"]
    },
    {
      title:"No problem",
      prompt:"Someone says ‘Thanks!’ What’s natural?",
      say:"No worries!",
      hint:"Also: ‘You got it’, ‘Sure thing’, ‘No problem’.",
      correct:0,
      choices:["No worries!", "It is nothing.", "I accept."]
    },
    {
      title:"Agreement",
      prompt:"Someone suggests a plan. What’s natural?",
      say:"Sounds good!",
      hint:"‘Sounds good’ = ‘OK, great plan’.",
      correct:1,
      choices:["It sounds well.", "Sounds good!", "I am agree."]
    },
    {
      title:"Time",
      prompt:"You’ll arrive at 6-ish. What’s natural?",
      say:"I'll be there around six.",
      hint:"Use ‘around’ / ‘about’ / ‘ish’.",
      correct:2,
      choices:["I arrive at six exactly.", "I will come at six hour.", "I'll be there around six."]
    },
    {
      title:"Small apology",
      prompt:"You made a small mistake. What’s natural?",
      say:"My bad.",
      hint:"Casual apology: ‘My bad’ / ‘Oops, my bad’.",
      correct:1,
      choices:["I am guilty.", "My bad.", "I excuse myself."]
    }
  ];

  // Flashcards: expression + meaning + example + FR tips
  var FLASH = [
    // greetings
    { tag:"greetings", front:"How's it going?", back:"FR: Ça va ? (casual)\nUse with friends/colleagues.\nExample: How's it going? — Pretty good.", say:"How's it going?" },
    { tag:"greetings", front:"What's up?", back:"FR: Quoi de neuf ?\nVery casual.\nReply: Not much / Just chilling.", say:"What's up?" },
    { tag:"greetings", front:"How's your day going?", back:"FR: Ta journée se passe bien ?\nFriendly small talk.", say:"How's your day going?" },

    // requests
    { tag:"requests", front:"Can I get…?", back:"FR: Je voudrais… (coffee, food)\nExample: Can I get a water, please?", say:"Can I get a water, please?" },
    { tag:"requests", front:"Could you…?", back:"FR: Est-ce que tu pourrais…\nPolite + common.\nCould you help me real quick?", say:"Could you help me real quick?" },
    { tag:"requests", front:"Do you happen to have…?", back:"FR: Par hasard, vous auriez…\nSuper polite.\nDo you happen to have a charger?", say:"Do you happen to have a charger?" },
    { tag:"requests", front:"I was wondering if…", back:"FR: Je me demandais si…\nVery polite.\nI was wondering if you could check.", say:"I was wondering if you could help me." },

    // reactions
    { tag:"reactions", front:"No worries.", back:"FR: Pas de souci.\nUse for thanks/apologies.", say:"No worries." },
    { tag:"reactions", front:"Sounds good.", back:"FR: Ça marche.\nAgreement.", say:"Sounds good." },
    { tag:"reactions", front:"You got it.", back:"FR: Bien sûr / D’accord.\nService tone.", say:"You got it." },
    { tag:"reactions", front:"I’m down.", back:"FR: Je suis partant(e).\nCasual: I’m down for coffee.", say:"I'm down." },
    { tag:"reactions", front:"I’m all set.", back:"FR: C’est bon / J’ai tout.\nIn a store: ‘No thanks, I’m all set.’", say:"I'm all set." },

    // small talk
    { tag:"smalltalk", front:"Pretty good.", back:"FR: Plutôt bien.\nCommon reply.", say:"Pretty good." },
    { tag:"smalltalk", front:"Just running errands.", back:"FR: Je fais des courses.\nNatural daily phrase.", say:"I'm just running errands." },
    { tag:"smalltalk", front:"Long story short…", back:"FR: Pour faire court…\nUse to summarize.", say:"Long story short, we missed the train." },
    { tag:"smalltalk", front:"To be honest…", back:"FR: Honnêtement…\nSoftens opinions.", say:"To be honest, I'm a little tired." },
    { tag:"smalltalk", front:"It depends.", back:"FR: Ça dépend.\nVery useful.", say:"It depends." },

    // travel
    { tag:"travel", front:"Could I get the bill/check?", back:"FR: L’addition, s’il vous plaît.\nUS often says ‘check’.", say:"Could I get the check, please?" },
    { tag:"travel", front:"Where can I find…?", back:"FR: Où est-ce que je peux trouver…\nWhere can I find the restroom?", say:"Where can I find the restroom?" },
    { tag:"travel", front:"I’m looking for…", back:"FR: Je cherche…\nI’m looking for the subway.", say:"I'm looking for the subway." },
    { tag:"travel", front:"Is there any way to…?", back:"FR: Est-ce qu’il y a moyen de…\nPolite problem-solving.", say:"Is there any way to change rooms?" },

    // texting/casual
    { tag:"texting", front:"FYI", back:"FR: Pour info.\nWork + travel.", say:"FYI, the flight is delayed." },
    { tag:"texting", front:"BTW", back:"FR: Au fait.\nBy the way.", say:"BTW, I'm running late." },
    { tag:"texting", front:"I’m on my way.", back:"FR: J’arrive.\nSuper common.", say:"I'm on my way." },
    { tag:"texting", front:"Running late.", back:"FR: En retard.\nI’m running late, sorry!", say:"I'm running late, sorry!" }
  ];

  // Upgrades QCM
  var UPG = [
    {
      title:"Direct → polite",
      base:"I want a coffee.",
      say:"Can I get a coffee, please?",
      prompt:"Choose the best upgrade:",
      hint:"‘Can I get…?’ is polite and common in the US.",
      correct:2,
      choices:["I desire a coffee.", "Give me a coffee.", "Can I get a coffee, please?"]
    },
    {
      title:"Direct → friendly",
      base:"Give me the Wi-Fi password.",
      say:"Do you happen to have the Wi-Fi password?",
      prompt:"Choose the best upgrade:",
      hint:"Use ‘Do you happen to…?’ for very polite requests.",
      correct:1,
      choices:["I need the Wi-Fi password now.", "Do you happen to have the Wi-Fi password?", "Give me the password please thank you."]
    },
    {
      title:"Problem → soft",
      base:"This doesn’t work.",
      say:"Hey—sorry, this isn’t working. Any chance you could take a look?",
      prompt:"Choose the best upgrade:",
      hint:"Add ‘sorry / any chance / could you…’ to soften.",
      correct:0,
      choices:[
        "Hey—sorry, this isn’t working. Any chance you could take a look?",
        "This is not working. Fix it.",
        "I protest. It does not function."
      ]
    },
    {
      title:"Time → natural",
      base:"I arrive at 6.",
      say:"I'll be there around six.",
      prompt:"Choose the best upgrade:",
      hint:"‘around/about’ sounds more natural.",
      correct:2,
      choices:["I will arrive at 6 hours.", "I come at six.", "I'll be there around six."]
    }
  ];

  // Builder targets
  var PB = [
    {
      target:"Could you help me real quick, please?",
      say:"Could you help me real quick, please?",
      hint:"Polite + casual: could you + real quick + please.",
      words:["Could","you","help","me","real","quick,","please?"]
    },
    {
      target:"I was wondering if you could check that for me.",
      say:"I was wondering if you could check that for me.",
      hint:"Very polite: I was wondering if…",
      words:["I","was","wondering","if","you","could","check","that","for","me."]
    },
    {
      target:"Do you happen to have a charger?",
      say:"Do you happen to have a charger?",
      hint:"Super polite request: Do you happen to…",
      words:["Do","you","happen","to","have","a","charger?"]
    }
  ];

  // Small talk QCM
  var STQ = [
    {
      title:"Small talk",
      prompt:"Person says: “How’s it going?” Best reply:",
      say:"How's it going?",
      hint:"Keep it short + friendly, then ask back.",
      correct:1,
      choices:["It goes.", "Pretty good! How about you?", "I am going to the hotel."]
    },
    {
      title:"Small talk",
      prompt:"Person says: “Busy day?” Best reply:",
      say:"Busy day?",
      hint:"Use ‘Yeah, kind of’ + short detail.",
      correct:2,
      choices:["I am busy, yes.", "Yes, very busy, extremely.", "Yeah, kind of—just running errands."]
    },
    {
      title:"Small talk",
      prompt:"Person says: “Nice!” Best reply:",
      say:"Nice!",
      hint:"React naturally: ‘Yeah!’ / ‘Totally!’ / ‘For sure!’",
      correct:0,
      choices:["Yeah! For sure.", "I confirm.", "That is nice of you."]
    }
  ];

  // Small talk fill-in
  var SF = [
    { sentence:"A: Thanks!  B: ____", answer:"no worries", say:"No worries!", hint:"Common after thanks/apologies." },
    { sentence:"A: Want to grab coffee later?  B: ____", answer:"sounds good", say:"Sounds good!", hint:"Agreement." },
    { sentence:"A: How’s it going?  B: ____", answer:"i'm good", say:"I'm good—how about you?", hint:"Natural quick reply." },
    { sentence:"A: Sorry I’m late.  B: ____", answer:"no worries", say:"No worries.", hint:"Also: ‘All good’." },
    { sentence:"A: I’ll text you when I’m close.  B: ____", answer:"sounds good", say:"Sounds good.", hint:"Short + natural." }
  ];

  // Travel roleplay scenes (choose best response)
  var TRAVEL = {
    coffee: [
      {
        title:"Coffee shop",
        prompt:"Barista: “What can I get you?”",
        say:"What can I get you?",
        hint:"Use: Can I get… / Could I get…",
        correct:1,
        choices:["I want one cappuccino.", "Can I get a cappuccino, please?", "Give me cappuccino."]
      },
      {
        title:"Coffee shop",
        prompt:"Barista: “Anything else?”",
        say:"Anything else?",
        hint:"Use: That’s it / I’m all set.",
        correct:2,
        choices:["No, it is finished.", "I take nothing more.", "That’s it—I'm all set, thanks."]
      }
    ],
    hotel: [
      {
        title:"Hotel",
        prompt:"Reception: “How can I help you?”",
        say:"How can I help you?",
        hint:"Polite: I was wondering if… / Is there any way to…",
        correct:0,
        choices:["I was wondering if I could check in early.", "I want the room now.", "Give me the key."]
      },
      {
        title:"Hotel",
        prompt:"Reception: “Is everything okay with the room?”",
        say:"Is everything okay with the room?",
        hint:"Soften complaints: ‘Hey—sorry…’ + ‘any chance…?’",
        correct:1,
        choices:["This room is bad.", "Hey—sorry, the AC isn’t working. Any chance you could take a look?", "I protest about the air conditioner."]
      }
    ],
    airport: [
      {
        title:"Airport",
        prompt:"Agent: “What’s the destination?”",
        say:"What's the destination?",
        hint:"Simple and clear.",
        correct:2,
        choices:["My destination is New York City of America.", "I go to New York, yes.", "New York—JFK."]
      },
      {
        title:"Airport",
        prompt:"Agent: “Your flight is delayed.”",
        say:"Your flight is delayed.",
        hint:"Use: Got it / Okay / Any idea how long?",
        correct:0,
        choices:["Got it—any idea how long?", "I am sad.", "Delay is not possible."]
      }
    ],
    uber: [
      {
        title:"Ride",
        prompt:"Driver: “Where to?”",
        say:"Where to?",
        hint:"Short answer is normal.",
        correct:1,
        choices:["I go to the hotel please.", "To the Marriott on Main Street, please.", "I go at destination Marriott."]
      },
      {
        title:"Ride",
        prompt:"Driver: “Traffic’s kinda bad.”",
        say:"Traffic's kinda bad.",
        hint:"Reaction: Oh wow / No worries / All good.",
        correct:2,
        choices:["Traffic is bad. Yes.", "I do not like traffic.", "Oh wow—no worries. Take your time."]
      }
    ]
  };

  // Sorting sets (by situation)
  var SOSETS = [
    {
      hint:"Greeting = hello/small talk. Request = could you/can I get. Reaction = sounds good/no worries. Travel = check-in/check/restroom.",
      words:[
        { w:"How's it going?", cat:"G" },
        { w:"Pretty good—how about you?", cat:"G" },
        { w:"Can I get a water, please?", cat:"R" },
        { w:"Do you happen to have a charger?", cat:"R" },
        { w:"No worries.", cat:"A" },
        { w:"Sounds good.", cat:"A" },
        { w:"Where can I find the restroom?", cat:"T" },
        { w:"Could I get the check, please?", cat:"T" }
      ]
    },
    {
      hint:"Travel phrases often include service words: check, restroom, check-in, gate, boarding.",
      words:[
        { w:"I'm on my way.", cat:"A" },
        { w:"What's up?", cat:"G" },
        { w:"I was wondering if you could help me.", cat:"R" },
        { w:"You got it.", cat:"A" },
        { w:"Where's my gate?", cat:"T" },
        { w:"Can I check in here?", cat:"T" },
        { w:"Busy day?", cat:"G" },
        { w:"Could you take a look real quick?", cat:"R" }
      ]
    }
  ];

  // Intonation QCM
  var INTON = [
    {
      title:"Yes/No question",
      prompt:"Choose the best ending (↗ rising / ↘ falling): “You good ___”",
      say:"You good?",
      hint:"Yes/No questions often rise.",
      correct:0,
      choices:["↗ rising (You good?)", "↘ falling (You good.)", "Flat robotic"]
    },
    {
      title:"Wh-question",
      prompt:"Choose the best ending: “Where is it ___”",
      say:"Where is it?",
      hint:"Wh- questions often fall.",
      correct:1,
      choices:["↗ rising", "↘ falling", "Sing-song"]
    },
    {
      title:"Friendly check",
      prompt:"Choose the best intonation: “All good ___”",
      say:"All good?",
      hint:"Often a friendly rise.",
      correct:0,
      choices:["↗ rising", "↘ falling", "Very flat"]
    }
  ];

  // Shadowing sets
  var SHSETS = [
    [
      "How's it going? Pretty good. How about you?",
      "No worries—you're good.",
      "Sounds good. I'm down.",
      "Could you help me real quick?"
    ],
    [
      "Can I get a latte, please?",
      "Do you happen to have a charger?",
      "I'm running late—my bad.",
      "I’m all set, thanks."
    ],
    [
      "Where can I find the restroom?",
      "Could I get the check, please?",
      "Is there any way to switch rooms?",
      "Got it—any idea how long?"
    ]
  ];

  var CHEAT = [
    { title:"Must-know (daily)", items:[
      "How’s it going? / Pretty good.",
      "No worries. / Sounds good. / You got it.",
      "I’m running late. / I’m on my way.",
      "I’m all set. / I’m down."
    ]},
    { title:"Polite requests", items:[
      "Can I get…? / Could I get…?",
      "Could you…? (real quick)",
      "Do you happen to have…?",
      "I was wondering if…"
    ]},
    { title:"Travel basics", items:[
      "Where can I find…?",
      "Could I get the check, please?",
      "Is there any way to…?",
      "Got it—any idea how long?"
    ]},
    { title:"Intonation + rhythm", items:[
      "Yes/No ↗: You good?",
      "Wh ↘: Where is it?",
      "Use contractions: I’m / you’re / gonna",
      "Stress content words (HELP / CHECK / LATE)"
    ]}
  ];

  /* ===================== Warm-up ===================== */
  var wCur = null;
  function newWarmup(){
    wCur = choice(WARM);
    $("wTitle").textContent = wCur.title;
    $("wPrompt").textContent = wCur.prompt;
    $("wHint").textContent = "";
    $("wFeedback").textContent = ""; $("wFeedback").className = "feedback";

    renderChoices("wChoices", wCur.choices, wCur.correct, function(ok){
      $("wFeedback").textContent = ok ? "✅ Nice! Say it once with a smile." : "❌ Try again: choose the most natural + polite option.";
      $("wFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenWarmup(){ if (wCur) speakText(wCur.say); }
  function hintWarmup(){ if (wCur) $("wHint").textContent = wCur.hint; }

  /* ===================== Flashcards ===================== */
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
          '<span class="tiny muted">Make a travel sentence</span>' +
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

  /* ===================== Upgrades QCM ===================== */
  var uCur = null;
  function newU(){
    uCur = choice(UPG);
    $("uTitle").textContent = uCur.title + " — Base: “" + uCur.base + "”";
    $("uPrompt").textContent = uCur.prompt;
    $("uHint").textContent = "";
    $("uFeedback").textContent = ""; $("uFeedback").className="feedback";

    renderChoices("uChoices", uCur.choices, uCur.correct, function(ok){
      $("uFeedback").textContent = ok ? "✅ Perfect. Now say it twice (friendly tone)." : "❌ Try again: choose polite + natural.";
      $("uFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenU(){ if (uCur) speakText(uCur.say); }
  function hintU(){ if (uCur) $("uHint").textContent = uCur.hint; }

  /* ===================== Phrase builder ===================== */
  var pbCur = null;
  function newPB(){
    pbCur = choice(PB);
    $("pbHint").textContent = "";
    $("pbFeedback").textContent = ""; $("pbFeedback").className="feedback";

    var words = shuffle(pbCur.words.slice());
    resetChips("pbBank", words, ["pbLine"]);
  }
  function resetPB(){
    if (!pbCur) return;
    $("pbHint").textContent = "";
    $("pbFeedback").textContent = ""; $("pbFeedback").className="feedback";
    resetChips("pbBank", shuffle(pbCur.words.slice()), ["pbLine"]);
  }
  function listenPB(){ if (pbCur) speakText(pbCur.say); }
  function hintPB(){ if (pbCur) $("pbHint").textContent = pbCur.hint; }
  function checkPB(){
    if (!pbCur) return;
    var got = readLineText("pbLine");
    var ok = (norm(got) === norm(pbCur.target));
    addAttempt(ok);
    $("pbFeedback").textContent = ok ? "✅ Nailed it! Say it twice with natural rhythm." : ("❌ Target: " + pbCur.target);
    $("pbFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }

  /* ===================== Small talk QCM ===================== */
  var stCur = null;
  function newST(){
    stCur = choice(STQ);
    $("stTitle").textContent = stCur.title;
    $("stPrompt").textContent = stCur.prompt;
    $("stHint").textContent = "";
    $("stFeedback").textContent = ""; $("stFeedback").className="feedback";

    renderChoices("stChoices", stCur.choices, stCur.correct, function(ok){
      $("stFeedback").textContent = ok ? "✅ Great. Now add one extra detail." : "❌ Try again: short + friendly + natural.";
      $("stFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenST(){ if (stCur) speakText(stCur.say); }
  function hintST(){ if (stCur) $("stHint").textContent = stCur.hint; }

  /* ===================== Small talk fill-in ===================== */
  var sfCur = null;
  function newSF(){
    sfCur = choice(SF);
    $("sfSentence").textContent = sfCur.sentence;
    $("sfInput").value = "";
    $("sfHint").textContent = "";
    $("sfFeedback").textContent = ""; $("sfFeedback").className="feedback";
  }
  function listenSF(){ if (sfCur) speakText(sfCur.say); }
  function hintSF(){ if (sfCur) $("sfHint").textContent = sfCur.hint; }
  function checkSF(){
    if (!sfCur) return;
    var v = norm($("sfInput").value);
    var ok = (v === norm(sfCur.answer));
    addAttempt(ok);
    $("sfFeedback").textContent = ok ? "✅ Correct!" : ("❌ Expected: " + sfCur.answer);
    $("sfFeedback").className = "feedback " + (ok ? "ok" : "bad");
  }
  function revealSF(){
    if (!sfCur) return;
    $("sfInput").value = sfCur.answer;
    $("sfFeedback").textContent = "Answer revealed — now say it naturally.";
    $("sfFeedback").className = "feedback warn";
  }

  /* ===================== Travel scenes ===================== */
  var trScene = "coffee";
  var trCur = null;

  function setScene(sc){
    trScene = sc;
    $("trTitle").textContent = "Scene: " + (sc.charAt(0).toUpperCase() + sc.slice(1));
    $("trPrompt").textContent = "Click “New dialogue”.";
    $("trChoices").innerHTML = "";
    $("trFeedback").textContent = ""; $("trFeedback").className="feedback";
    $("trHint").textContent = "";
  }

  function newTR(){
    var list = TRAVEL[trScene] || [];
    trCur = choice(list);
    $("trTitle").textContent = trCur.title;
    $("trPrompt").textContent = trCur.prompt;
    $("trHint").textContent = "";
    $("trFeedback").textContent = ""; $("trFeedback").className="feedback";

    renderChoices("trChoices", trCur.choices, trCur.correct, function(ok){
      $("trFeedback").textContent = ok ? "✅ Perfect for real life. Repeat it twice." : "❌ Try again: more polite + more natural.";
      $("trFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenTR(){ if (trCur) speakText(trCur.say); }
  function hintTR(){ if (trCur) $("trHint").textContent = trCur.hint; }

  /* ===================== Sorting ===================== */
  var soCur = null, soWords = [];
  function newSO(){
    soCur = choice(SOSETS);
    soWords = soCur.words.slice();
    $("soFeedback").textContent = ""; $("soFeedback").className="feedback";
    $("soHint").textContent = "";

    resetChips("soBank", soWords, ["soGreet","soReq","soReact","soTravel"]);
  }
  function resetSO(){
    resetChips("soBank", soWords, ["soGreet","soReq","soReact","soTravel"]);
    $("soFeedback").textContent = ""; $("soFeedback").className="feedback";
    $("soHint").textContent = "";
  }
  function listenSO(){
    if (!soWords.length) return;
    speakText(soWords.map(function(x){ return x.w; }).join(". "));
  }
  function hintSO(){ if (soCur) $("soHint").textContent = soCur.hint; }
  function checkSO(){
    var res = checkZones([
      {zoneId:"soGreet", cat:"G"},
      {zoneId:"soReq", cat:"R"},
      {zoneId:"soReact", cat:"A"},
      {zoneId:"soTravel", cat:"T"}
    ]);
    if (res.total === 0){
      $("soFeedback").textContent = "Move phrases into the boxes first.";
      $("soFeedback").className = "feedback warn";
      return;
    }
    addAttempt(res.ok);
    $("soFeedback").textContent = res.ok ? "✅ Perfect sorting!" : ("❌ " + res.correct + " / " + res.total + ". Check polite requests vs reactions.");
    $("soFeedback").className = "feedback " + (res.ok ? "ok" : "bad");
  }

  /* ===================== Intonation ===================== */
  var inCur = null;
  function newIN(){
    inCur = choice(INTON);
    $("inTitle").textContent = inCur.title;
    $("inPrompt").textContent = inCur.prompt;
    $("inHint").textContent = "";
    $("inFeedback").textContent = ""; $("inFeedback").className="feedback";

    renderChoices("inChoices", inCur.choices, inCur.correct, function(ok){
      $("inFeedback").textContent = ok ? "✅ Nice. Now SAY it with that melody." : "❌ Listen again: rise or fall?";
      $("inFeedback").className = "feedback " + (ok ? "ok" : "bad");
    });
  }
  function listenIN(){ if (inCur) speakText(inCur.say); }
  function hintIN(){ if (inCur) $("inHint").textContent = inCur.hint; }

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
    $("shFeedback").textContent = "Tip: repeat immediately (copy rhythm + contractions).";
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

  /* ===================== Final mission ===================== */
  function buildScript(name, city, day, mode){
    var slowNote = (mode === "slow") ? " (slow + clear)" : "";
    var lines = [];
    lines.push("DAY IN THE LIFE — TALK LIKE A NATIVE" + slowNote);
    lines.push("Name: " + name + " • City: " + city);
    lines.push("");

    if (day === "travel"){
      lines.push("Alright, I’m on my way to the airport.");
      lines.push("I’m running a little late—my bad.");
      lines.push("At the coffee shop, I’m like: “Can I get a latte, please?”");
      lines.push("They’re like, “Anything else?” and I’m like, “Nope, I’m all set.”");
      lines.push("At the gate, I’m thinking: “Got it—any idea how long?”");
      lines.push("Once I land, I’m gonna grab an Uber and head to the hotel.");
      lines.push("If there’s an issue, I’ll say: “Hey—sorry, is there any way to switch rooms?”");
      lines.push("Overall: no worries. Sounds good.");
    } else if (day === "work"){
      lines.push("How’s it going? Pretty good.");
      lines.push("I’ve got a busy day, but it’s all good.");
      lines.push("I was wondering if you could check this for me real quick.");
      lines.push("If you need anything, just let me know.");
      lines.push("Alright—sounds good. I gotta run to a meeting.");
    } else {
      lines.push("What’s up? Not much—just taking it easy.");
      lines.push("I’m down to grab coffee or just walk around.");
      lines.push("If the line is crazy long, we’ll just go somewhere else.");
      lines.push("Later I’ll meet a friend. It depends on the weather.");
      lines.push("Either way, no worries. Sounds good.");
    }

    lines.push("");
    lines.push("Focus: polite requests (could you / do you happen to), reactions (no worries / sounds good), travel phrases, and intonation (friendly rise).");
    return lines.join("\n");
  }

  function generateScript(){
    var name = ($("mName").value || "Alex").trim();
    var city = ($("mCity").value || "New York").trim();
    var day = $("mDay").value;
    var mode = $("mMode").value;

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
    speakText("How's it going? Pretty good. No worries. Sounds good. You got it. I'm running late. I'm on my way. Can I get a coffee, please? Do you happen to have a charger?");
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
      speakText("Test voice. How's it going? Pretty good. No worries. Sounds good. Could you help me real quick?");
    });
    $("btnStop").addEventListener("click", stopSpeak);

    // timer + print
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
    $("fcSetGreetings").addEventListener("click", function(){ renderFlashcards("greetings"); });
    $("fcSetRequests").addEventListener("click", function(){ renderFlashcards("requests"); });
    $("fcSetReactions").addEventListener("click", function(){ renderFlashcards("reactions"); });
    $("fcSetSmalltalk").addEventListener("click", function(){ renderFlashcards("smalltalk"); });
    $("fcSetTravel").addEventListener("click", function(){ renderFlashcards("travel"); });
    $("fcSetTexting").addEventListener("click", function(){ renderFlashcards("texting"); });

    // upgrades
    $("uNew").addEventListener("click", newU);
    $("uListen").addEventListener("click", listenU);
    $("uHintBtn").addEventListener("click", hintU);
    newU();

    // builder
    wireDropzone($("pbLine"));
    $("pbNew").addEventListener("click", newPB);
    $("pbListen").addEventListener("click", listenPB);
    $("pbHintBtn").addEventListener("click", hintPB);
    $("pbCheck").addEventListener("click", checkPB);
    $("pbReset").addEventListener("click", resetPB);
    newPB();

    // small talk
    $("stNew").addEventListener("click", newST);
    $("stListen").addEventListener("click", listenST);
    $("stHintBtn").addEventListener("click", hintST);
    newST();

    $("sfNew").addEventListener("click", newSF);
    $("sfListen").addEventListener("click", listenSF);
    $("sfHintBtn").addEventListener("click", hintSF);
    $("sfCheck").addEventListener("click", checkSF);
    $("sfReveal").addEventListener("click", revealSF);
    newSF();

    // travel
    $("trCoffee").addEventListener("click", function(){ setScene("coffee"); });
    $("trHotel").addEventListener("click", function(){ setScene("hotel"); });
    $("trAirport").addEventListener("click", function(){ setScene("airport"); });
    $("trUber").addEventListener("click", function(){ setScene("uber"); });
    $("trNew").addEventListener("click", newTR);
    $("trListen").addEventListener("click", listenTR);
    $("trHintBtn").addEventListener("click", hintTR);
    setScene("coffee");

    // sorting
    wireDropzone($("soGreet")); wireDropzone($("soReq")); wireDropzone($("soReact")); wireDropzone($("soTravel"));
    $("soNew").addEventListener("click", newSO);
    $("soListen").addEventListener("click", listenSO);
    $("soHintBtn").addEventListener("click", hintSO);
    $("soCheck").addEventListener("click", checkSO);
    $("soReset").addEventListener("click", resetSO);
    newSO();

    // intonation
    $("inNew").addEventListener("click", newIN);
    $("inListen").addEventListener("click", listenIN);
    $("inHintBtn").addEventListener("click", hintIN);
    newIN();

    // shadowing
    $("shNew").addEventListener("click", newShadow);
    $("shPlay").addEventListener("click", playOneShadow);
    $("shPlayAll").addEventListener("click", playAllShadow);
    newShadow();

    // mission
    $("genBtn").addEventListener("click", generateScript);
    $("genListen").addEventListener("click", listenScript);
    $("genCopy").addEventListener("click", copyScript);

    // cheat sheet
    renderCheat();

    // voices
    if (window.speechSynthesis){
      loadVoices();
      window.speechSynthesis.onvoiceschanged = function(){ loadVoices(); };
    }
  }

  init();
})();
