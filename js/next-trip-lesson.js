/* SpeakEasyTisha — Next Trip Planner (Interactive)
   iPad-friendly taps, instant feedback, US/UK TTS, A2/B1/B2 toggle, FR helper toggle.
   + NEW: Trip Rap warm-up (chant + tap-to-rhyme game)
*/
(function(){
  "use strict";

  function $(id){ return document.getElementById(id); }
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  // -------------------- state --------------------
  var state = {
    level: "A2",
    frHelp: true,
    accent: "en-US",
    rate: 1,
    scoreNow: 0,
    scoreTotal: 0,
    locks: { vocab:{}, practice:{}, vquiz:{} },
    vibes: [],
    chosenActs: [],
    rap: { qs:[], i:0, streak:0, locked:false, lastLine:"" }
  };

  function setScore(addNow, addTotal){
    if(addNow) state.scoreNow += addNow;
    if(addTotal) state.scoreTotal += addTotal;
    $("scoreNow").textContent = String(state.scoreNow);
    $("scoreTotal").textContent = String(state.scoreTotal);
  }

  // -------------------- speech --------------------
  var voiceReady = false;
  function getVoices(){ return window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
  function pickVoice(lang){
    var vs = getVoices();
    if(!vs || !vs.length) return null;
    for(var i=0;i<vs.length;i++){ if(vs[i].lang === lang) return vs[i]; }
    for(var j=0;j<vs.length;j++){ if((vs[j].lang||"").toLowerCase().indexOf(lang.toLowerCase())===0) return vs[j]; }
    for(var k=0;k<vs.length;k++){ if((vs[k].lang||"").toLowerCase().indexOf("en")===0) return vs[k]; }
    return vs[0] || null;
  }
  function stopSpeak(){ try{ window.speechSynthesis.cancel(); }catch(e){} }
  function speak(text, opts){
    if(!window.speechSynthesis) return;
    stopSpeak();
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = state.accent;
    u.rate = clamp(state.rate, 0.6, 1.4);
    if(opts && typeof opts.rate==="number") u.rate = clamp(opts.rate, 0.6, 1.4);
    var v = pickVoice(state.accent);
    if(v) u.voice = v;
    window.speechSynthesis.speak(u);
  }
  function ensureVoiceWarmed(){
    if(voiceReady) return;
    voiceReady = true;
    speak("Ready.", {rate:1});
  }

  // Speak a queue (chant)
  function speakQueue(lines, opts){
    if(!window.speechSynthesis) return;
    stopSpeak();
    var i = 0;
    function next(){
      if(i >= lines.length) return;
      var u = new SpeechSynthesisUtterance(String(lines[i]));
      u.lang = state.accent;
      u.rate = clamp((opts && opts.rate) ? opts.rate : state.rate, 0.6, 1.4);
      var v = pickVoice(state.accent);
      if(v) u.voice = v;
      u.onend = function(){ i++; next(); };
      window.speechSynthesis.speak(u);
    }
    next();
  }

  // -------------------- timer --------------------
  var timer = { total: 10*60, left: 10*60, t:null };
  function fmt(sec){
    var m=Math.floor(sec/60), s=sec%60;
    return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  }
  function renderTimer(){ $("time").textContent = fmt(timer.left); }
  function resetTimer(){
    if(timer.t){ clearInterval(timer.t); timer.t=null; }
    timer.left = timer.total;
    renderTimer();
  }
  function startTimer(seconds){
    if(timer.t){ clearInterval(timer.t); timer.t=null; }
    timer.total = seconds; timer.left = seconds;
    renderTimer();
    timer.t = setInterval(function(){
      timer.left = Math.max(0, timer.left-1);
      renderTimer();
      if(timer.left<=0){
        clearInterval(timer.t); timer.t=null;
        speak("Time. Great work.");
      }
    }, 1000);
  }

  // Pitch timer (60s)
  var pitch = { left: 60, t:null };
  function renderPitch(){ $("pitchTime").textContent = String(pitch.left); }
  function startPitch(){
    if(pitch.t) clearInterval(pitch.t);
    pitch.left = 60; renderPitch();
    pitch.t = setInterval(function(){
      pitch.left = Math.max(0, pitch.left-1);
      renderPitch();
      if(pitch.left<=0){
        clearInterval(pitch.t); pitch.t=null;
        speak("Time.");
      }
    }, 1000);
  }
  function stopPitch(){ if(pitch.t) clearInterval(pitch.t); pitch.t=null; }

  // -------------------- content --------------------
  var VIBES = [
    { en:"Beach & relax", fr:"plage & détente", actions:["relax on the beach","swim in the sea","try local seafood"] },
    { en:"City break", fr:"week-end en ville", actions:["visit museums","walk in old streets","try a food market"] },
    { en:"Nature & hiking", fr:"nature & randonnée", actions:["go hiking","see waterfalls","take photos of landscapes"] },
    { en:"Road trip", fr:"road trip", actions:["rent a car","drive along the coast","stop in small towns"] },
    { en:"Theme parks", fr:"parcs à thème", actions:["ride roller coasters","watch shows","try fun snacks"] },
    { en:"Culture & history", fr:"culture & histoire", actions:["visit a castle","join a guided tour","learn local history"] }
  ];

  var ACTION_BANK = [
    { en:"visit a museum", fr:"visiter un musée" },
    { en:"go hiking", fr:"faire une randonnée" },
    { en:"try local food", fr:"goûter la cuisine locale" },
    { en:"relax at a spa", fr:"se détendre au spa" },
    { en:"take a boat trip", fr:"faire une balade en bateau" },
    { en:"go shopping", fr:"faire du shopping" },
    { en:"meet locals", fr:"rencontrer des habitants" },
    { en:"take photos", fr:"prendre des photos" }
  ];

  var REASONS_A2 = [
    { en:"because it’s relaxing", fr:"parce que c’est reposant" },
    { en:"because it’s beautiful", fr:"parce que c’est magnifique" },
    { en:"because I love nature", fr:"parce que j’adore la nature" },
    { en:"because I want to discover new places", fr:"parce que je veux découvrir" },
    { en:"because it’s not too expensive", fr:"parce que ce n’est pas trop cher" }
  ];
  var REASONS_B2 = [
    { en:"because it would be a great change of scenery", fr:"car ça changerait les idées" },
    { en:"because I’d like to recharge my batteries", fr:"car j’aimerais recharger mes batteries" },
    { en:"because I’m curious about the culture and the food", fr:"car je suis curieux(se) de la culture" },
    { en:"because it’s a perfect mix of relaxation and activities", fr:"car c’est un bon équilibre" },
    { en:"because I’d rather avoid crowds and stress", fr:"car je préfère éviter la foule" }
  ];

  // NEW: Rap (tap-to-rhyme) question banks
  var RAP_A2 = [
    { line:"I'd like to <blank>, not drive — to feel alive!", a:"fly", choices:["fly","cry","buy"], say:"I'd like to fly, not drive — to feel alive!" },
    { line:"I’d like to go <blank> train — it’s easy again!", a:"by", choices:["by","in","at"], say:"I’d like to go by train — it’s easy again!" },
    { line:"I don’t want crowds — they’re too <blank>!", a:"loud", choices:["loud","low","slow"], say:"I don’t want crowds — they’re too loud!" },
    { line:"I'd like to try local <blank> — yum for me!", a:"food", choices:["food","foot","mood"], say:"I'd like to try local food — yum for me!" },
    { line:"I’d like to <blank> photos — click, click!", a:"take", choices:["take","do","make"], say:"I’d like to take photos — click, click!" },
    { line:"I’d like to go to Rome <blank> it’s beautiful.", a:"because", choices:["because","so","but"], say:"I’d like to go to Rome because it’s beautiful." },
    { line:"I don’t want to <blank> early — I need sleep!", a:"wake", choices:["wake","walk","wait"], say:"I don’t want to wake early — I need sleep!" },
    { line:"Best trip ever? Beach + sun = so much <blank>!", a:"fun", choices:["fun","fan","fine"], say:"Best trip ever? Beach + sun = so much fun!" }
  ];

  var RAP_B2 = [
    { line:"I’d rather <blank> crowds — calm is my style.", a:"avoid", choices:["avoid","invite","advice"], say:"I’d rather avoid crowds — calm is my style." },
    { line:"I’d prefer to travel off-season; <blank>, it’s quieter.", a:"however", choices:["however","because","beside"], say:"I’d prefer to travel off-season; however, it’s quieter." },
    { line:"I’m not really into tourist traps — they’re over-<blank>.", a:"priced", choices:["priced","price","prize"], say:"I’m not really into tourist traps — they’re overpriced." },
    { line:"I’d love a city break <blank> a nature escape — both could work.", a:"or", choices:["or","so","but"], say:"I’d love a city break or a nature escape — both could work." },
    { line:"I’d rather not take a late flight — it throws off my <blank>.", a:"day", choices:["day","say","way"], say:"I’d rather not take a late flight — it throws off my day." },
    { line:"I’d like to do sightseeing; <blank>, I want downtime too.", a:"but", choices:["but","because","therefore"], say:"I’d like to do sightseeing; but, I want downtime too." },
    { line:"I prefer train travel — less stress, more <blank>.", a:"scenery", choices:["scenery","screen","science"], say:"I prefer train travel — less stress, more scenery." },
    { line:"Best next trip ever? A perfect mix — relax and <blank>.", a:"explore", choices:["explore","explain","export"], say:"Best next trip ever? A perfect mix — relax and explore." }
  ];

  // Chant lines (display + speak queue)
  function getChantLines(){
    var common = [
      "Say it with rhythm:",
      "I’d LIKE to GO — because it’s COOL!",
      "I don’t WANT to DRIVE — it’s NOT my vibe!",
      "Where to GO? How to GET there?",
      "What to DO — and WHY it’s better!"
    ];
    var b2 = [
      "B2 upgrade:",
      "I’d RATHER avoid crowds — however, I still want fun.",
      "I’d PREFER the off-season — calmer days, more sun."
    ];
    if(state.level==="B2") return common.concat(b2);
    if(state.level==="B1") return common.concat(b2.slice(0,1));
    return common;
  }

  // Vocab / grammar / practice content (unchanged)
  var VOCAB = [
    { cat:"Destinations", icon:"🗺️", front:"destination", backEN:"a place you travel to", backFR:"destination" },
    { cat:"Transport", icon:"🚆", front:"train", backEN:"a way to travel by rail", backFR:"train" },
    { cat:"Transport", icon:"✈️", front:"flight", backEN:"a trip by plane", backFR:"vol" },
    { cat:"Transport", icon:"🚗", front:"rental car", backEN:"a car you rent for a trip", backFR:"voiture de location" },
    { cat:"Stay", icon:"🏨", front:"hotel", backEN:"a place to stay with services", backFR:"hôtel" },
    { cat:"Stay", icon:"🏡", front:"airbnb / apartment", backEN:"a place you rent (often with a kitchen)", backFR:"appartement / location" },
    { cat:"Activities", icon:"🎟️", front:"sightseeing", backEN:"visiting famous places", backFR:"visites touristiques" },
    { cat:"Activities", icon:"🥾", front:"hiking", backEN:"walking in nature for a long time", backFR:"randonnée" },
    { cat:"Activities", icon:"🍽️", front:"local cuisine", backEN:"traditional food of the area", backFR:"cuisine locale" },
    { cat:"Opinions", icon:"⭐", front:"worth it", backEN:"good value / a good experience", backFR:"ça vaut le coup" },
    { cat:"Opinions", icon:"😌", front:"peaceful", backEN:"calm and quiet", backFR:"paisible" },
    { cat:"Planning", icon:"📅", front:"itinerary", backEN:"a plan for your trip", backFR:"itinéraire" }
  ];

  var VOCAB_QUIZ_A2 = [
    { id:"vq1", q:"Choose the best meaning: itinerary", choices:["a plan for your trip","a type of hotel"], a:"a plan for your trip", hint:"Itinerary = plan (days, places)." },
    { id:"vq2", q:"Choose the best meaning: flight", choices:["a trip by plane","a place to eat"], a:"a trip by plane", hint:"Flight = avion." },
    { id:"vq3", q:"Worth it means…", choices:["ça vaut le coup","trop cher"], a:"ça vaut le coup", hint:"Worth it = good value." }
  ];
  var VOCAB_QUIZ_B2 = [
    { id:"vq1", q:"Peaceful means…", choices:["calm and quiet","busy and loud"], a:"calm and quiet", hint:"Peaceful = calm." },
    { id:"vq2", q:"Sightseeing means…", choices:["visiting famous places","sleeping in a hotel"], a:"visiting famous places", hint:"Sightseeing = visites touristiques." },
    { id:"vq3", q:"A ‘change of scenery’ means…", choices:["a different environment","a delayed flight"], a:"a different environment", hint:"Change of scenery = changer d’air." }
  ];

  var GRAMMAR_A2 = [
    {
      t:"Would like to (polite) vs Want to (direct)",
      b:"✅ I’d like to visit Lisbon. (polite)\n✅ I want to visit Lisbon. (direct)\nTip: in restaurants / emails, use ‘would like’.",
      fr:"FR: ‘Je voudrais / j’aimerais’ = would like (plus poli)."
    },
    {
      t:"Don’t want / don’t like + reason",
      b:"✅ I don’t want to drive because it’s stressful.\n✅ I don’t like big crowds because they’re noisy.",
      fr:"FR: ‘Je n’ai pas envie de…’ / ‘Je n’aime pas…’ + because…"
    },
    {
      t:"Because / so / but",
      b:"✅ I’d like to go in May because it’s cheaper.\n✅ It’s cheaper, so I’d like to go in May.\n✅ I want to go, but I don’t have time.",
      fr:"FR: because = parce que • so = donc • but = mais"
    }
  ];

  var GRAMMAR_B2 = [
    {
      t:"Prefer / would rather / would prefer (natural choices)",
      b:"✅ I prefer to travel by train.\n✅ I’d rather stay in an apartment.\n✅ I’d prefer to avoid tourist traps.\nRule: would rather + base verb (no ‘to’).",
      fr:"FR: ‘je préfère…’ / ‘je préférerais…’"
    },
    {
      t:"Softening negatives (more diplomatic)",
      b:"✅ I’d rather not take a late flight.\n✅ I’m not really into guided tours.\n✅ I’d prefer something quieter.",
      fr:"FR: plus doux que “I hate…”"
    },
    {
      t:"Reasons + contrast (however)",
      b:"✅ I’d love to go in August; however, it might be too crowded.\n✅ It sounds amazing, but I’d rather go off-season.",
      fr:"FR: however = cependant"
    }
  ];

  var PRACTICE_A2 = [
    { id:"p1", q:"Pick the polite sentence:", choices:["I want a table, please.","I’d like a table, please."], a:"I’d like a table, please.", hint:"Would like = polite."},
    { id:"p2", q:"Complete: I don’t want ___ drive.", choices:["to","for","at"], a:"to", hint:"want + to + verb."},
    { id:"p3", q:"Choose the correct reason:", choices:[
      "I’d like to go by train because it’s comfortable.",
      "I’d like to go by train because comfortable."
    ], a:"I’d like to go by train because it’s comfortable.", hint:"Because + subject + verb."},
    { id:"p4", q:"Choose the best sentence:", choices:[
      "I don’t like crowds because they are noisy.",
      "I don’t like crowds because they noisy."
    ], a:"I don’t like crowds because they are noisy.", hint:"They are…" },
    { id:"p5", q:"Choose ‘so’ correctly:", choices:[
      "It’s cheap, so I’d like to go.",
      "It’s cheap, because I’d like to go."
    ], a:"It’s cheap, so I’d like to go.", hint:"So = result."}
  ];

  var PRACTICE_B2 = [
    { id:"p1", q:"Choose the natural option:", choices:["I’d rather stay in an apartment.","I’d rather to stay in an apartment."], a:"I’d rather stay in an apartment.", hint:"Would rather + base verb (no ‘to’)."},
    { id:"p2", q:"Choose the soft negative:", choices:["I hate guided tours.","I’m not really into guided tours."], a:"I’m not really into guided tours.", hint:"B2: softer tone."},
    { id:"p3", q:"Choose correct contrast:", choices:[
      "I’d love to go in August; however, it might be too crowded.",
      "I’d love to go in August; however it might be too crowded."
    ], a:"I’d love to go in August; however, it might be too crowded.", hint:"Comma after however."},
    { id:"p4", q:"Pick the best collocation:", choices:["do sightseeing","make sightseeing"], a:"do sightseeing", hint:"We say ‘do sightseeing’."},
    { id:"p5", q:"Choose the best reason structure:", choices:[
      "I’d prefer to travel off-season because it’s less crowded.",
      "I’d prefer to travel off-season because less crowded."
    ], a:"I’d prefer to travel off-season because it’s less crowded.", hint:"Needs ‘it’s’."}
  ];

  var DESTS = [
    { en:"Lisbon", fr:"Lisbonne" }, { en:"London", fr:"Londres" }, { en:"New York", fr:"New York" },
    { en:"Barcelona", fr:"Barcelone" }, { en:"Dublin", fr:"Dublin" }, { en:"Rome", fr:"Rome" },
    { en:"A national park", fr:"un parc national" }, { en:"A small coastal town", fr:"une petite ville côtière" }
  ];
  var TRANSPORT = [
    { en:"by train", fr:"en train" },
    { en:"by plane", fr:"en avion" },
    { en:"by car (road trip)", fr:"en voiture (road trip)" },
    { en:"by bus", fr:"en bus" }
  ];
  var STAYS = [
    { en:"in a hotel", fr:"à l’hôtel" },
    { en:"in an apartment", fr:"dans un appartement" },
    { en:"in a guesthouse", fr:"en chambre d’hôtes" },
    { en:"in a cabin in nature", fr:"dans un chalet en nature" }
  ];
  var ACTIVITIES = [
    { en:"visit museums", fr:"visiter des musées" },
    { en:"do sightseeing", fr:"faire des visites" },
    { en:"try local food", fr:"goûter la cuisine locale" },
    { en:"go hiking", fr:"faire une randonnée" },
    { en:"take a boat trip", fr:"faire une balade en bateau" },
    { en:"go to a show", fr:"aller à un spectacle" },
    { en:"relax at the beach", fr:"se détendre à la plage" },
    { en:"explore markets", fr:"explorer les marchés" }
  ];
  var AVOID = [
    { en:"drive long distances", fr:"conduire longtemps" },
    { en:"take a very early flight", fr:"prendre un vol très tôt" },
    { en:"visit tourist traps", fr:"visiter des pièges à touristes" },
    { en:"do too many activities", fr:"faire trop d’activités" },
    { en:"spend a lot of money", fr:"dépenser beaucoup" }
  ];
  var AVOID_WHY = [
    { en:"because it’s stressful", fr:"parce que c’est stressant" },
    { en:"because it’s tiring", fr:"parce que c’est fatigant" },
    { en:"because it’s overpriced", fr:"parce que c’est trop cher" },
    { en:"because I want a slower trip", fr:"parce que je veux un rythme plus calme" }
  ];

  var NO_BANK = [
    { en:"I don’t want to spend hours in traffic.", fr:"Je ne veux pas passer des heures dans les embouteillages." },
    { en:"I don’t like crowded places because they’re noisy.", fr:"Je n’aime pas les endroits bondés parce que c’est bruyant." },
    { en:"I’d rather not take an early flight.", fr:"Je préférerais ne pas prendre un vol tôt." },
    { en:"I’m not really into guided tours.", fr:"Je ne suis pas trop fan des visites guidées." }
  ];

  // Sentence builder chips (one correct order)
  var BUILD_SENT = {
    correct: "I'd rather travel by train because it's comfortable.",
    chips: ["I'd rather","travel","by train","because","it's comfortable.","I would rather","to travel"]
  };

  // Speaking prompts (level-based)
  var SPEAK_A2 = [
    { p:"Where would you like to go next? Why?", m:"I'd like to go to Lisbon because it's beautiful and relaxing." },
    { p:"How would you like to get there? Why?", m:"I'd like to go by train because it's comfortable." },
    { p:"What don’t you want to do on your trip? Why?", m:"I don't want to drive long distances because it's tiring." },
    { p:"What would be the best next trip ever for you?", m:"The best next trip ever would be a beach trip because I could relax and try local food." }
  ];
  var SPEAK_B2 = [
    { p:"Describe your ideal trip in 4–5 sentences (with contrast).", m:"I'd love to visit a small coastal town. I'd prefer to travel by train because it's a great change of scenery. I'd rather avoid tourist traps; however, I'd still like to do some sightseeing. Overall, it would be the perfect mix of relaxation and activities." },
    { p:"Explain what you don’t want (soft style).", m:"I'd rather not take an early flight because it throws off my whole day. I'm not really into crowded attractions, so I'd prefer something quieter." },
    { p:"Sell your trip: convince a friend (reasons + benefits).", m:"Let's go to Dublin! It's walkable, the atmosphere is friendly, and we can explore markets and try amazing food. Plus, it’s worth it for the culture." },
    { p:"A preference + alternative option.", m:"I'd prefer an apartment, but a small guesthouse would also work if it's well located." }
  ];

  // -------------------- helpers --------------------
  function showFRHelp(on){
    var els = document.querySelectorAll("[data-fr]");
    for(var i=0;i<els.length;i++){
      els[i].style.display = on ? "block" : "none";
    }
  }

  function makeOption(text, value){
    var o = document.createElement("option");
    o.textContent = text;
    o.value = value || text;
    return o;
  }

  function renderChips(root, items, onClick){
    root.innerHTML = "";
    for(var i=0;i<items.length;i++){
      (function(item){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.textContent = item;
        b.addEventListener("click", function(){ onClick(item, b); });
        root.appendChild(b);
      })(items[i]);
    }
  }

  // -------------------- RAP: render + game --------------------
  function getRapQs(){
    if(state.level === "B2") return shuffle(RAP_B2).slice(0,8);
    if(state.level === "B1") return shuffle(RAP_A2.concat(RAP_B2.slice(0,4))).slice(0,8);
    return shuffle(RAP_A2).slice(0,8);
  }

  function renderChant(){
    var lines = getChantLines();
    $("rapChant").textContent = lines.join("\n");
  }

  function renderRapQ(){
    var q = state.rap.qs[state.rap.i];
    if(!q){
      $("rapPrompt").innerHTML = "🎉 Done! Final streak: <b>" + state.rap.streak + "</b>";
      $("rapChoices").innerHTML = "";
      $("rapNext").disabled = true;
      return;
    }

    state.rap.locked = false;
    $("rapStreak").textContent = String(state.rap.streak);
    $("rapNext").disabled = true;

    var promptHTML = q.line.replace("<blank>", '<span class="rapBlank">____</span>');
    $("rapPrompt").innerHTML = promptHTML;
    state.rap.lastLine = q.say;

    var box = $("rapChoices");
    box.innerHTML = "";
    var choices = shuffle(q.choices);

    for(var i=0;i<choices.length;i++){
      (function(ch){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "choice";
        b.textContent = ch;

        b.addEventListener("click", function(){
          if(state.rap.locked) return;
          state.rap.locked = true;

          setScore(0,1);
          var ok = (ch === q.a);

          if(ok){
            b.classList.add("is-right");
            state.rap.streak += 1;
            $("rapStreak").textContent = String(state.rap.streak);
            setScore(1,0);
            $("rapFeedback").className = "feedback good";
            $("rapFeedback").textContent = "✅ Nice! Say it with rhythm: “" + q.say + "”";
            ensureVoiceWarmed();
            speak("Nice.", {rate:1});
          } else {
            b.classList.add("is-wrong");
            state.rap.streak = 0;
            $("rapStreak").textContent = "0";
            $("rapFeedback").className = "feedback bad";
            $("rapFeedback").textContent = "❌ Correct: " + q.a + " — “" + q.say + "”";
            ensureVoiceWarmed();
            speak("Try again next one.", {rate:1});
          }

          // reveal correct
          var btns = box.querySelectorAll(".choice");
          for(var k=0;k<btns.length;k++){
            if(btns[k].textContent === q.a) btns[k].classList.add("is-right");
          }

          $("rapNext").disabled = false;
        });

        box.appendChild(b);
      })(choices[i]);
    }
  }

  function startRapGame(){
    state.rap.qs = getRapQs();
    state.rap.i = 0;
    state.rap.streak = 0;
    $("rapFeedback").className = "feedback";
    $("rapFeedback").textContent = "Go! Tap the best rhyme / word.";
    renderRapQ();
  }

  function nextRap(){
    state.rap.i += 1;
    renderRapQ();
  }

  function resetRap(){
    state.rap.qs = [];
    state.rap.i = 0;
    state.rap.streak = 0;
    state.rap.locked = false;
    $("rapStreak").textContent = "0";
    $("rapPrompt").textContent = "Press “Start game”.";
    $("rapChoices").innerHTML = "";
    $("rapNext").disabled = true;
    $("rapFeedback").className = "feedback";
    $("rapFeedback").textContent = "Tip: answer fast — feel the rhythm.";
  }

  function bindRap(){
    $("rapPlay").addEventListener("click", function(){
      ensureVoiceWarmed();
      renderChant();
      var lines = getChantLines();
      // Speak slightly slower for rhythm clarity
      speakQueue(lines, {rate: clamp(state.rate - 0.05, 0.75, 1.25)});
    });
    $("rapStop").addEventListener("click", stopSpeak);
    $("rapSlower").addEventListener("click", function(){
      state.rate = clamp(state.rate - 0.05, 0.75, 1.25);
      $("rate").value = String(state.rate);
      $("rateVal").textContent = state.rate.toFixed(2) + "×";
      ensureVoiceWarmed();
      speak("Slower.", {rate:1});
    });

    $("rapStart").addEventListener("click", function(){
      ensureVoiceWarmed();
      startRapGame();
    });
    $("rapNext").addEventListener("click", function(){
      nextRap();
    });
    $("rapReset").addEventListener("click", function(){
      resetRap();
    });
    $("rapListen").addEventListener("click", function(){
      ensureVoiceWarmed();
      speak(state.rap.lastLine || "Start the game first.", {rate: state.rate});
    });
  }

  // -------------------- existing warm-up --------------------
  function renderVibe(){
    var box = $("vibeChips");
    box.innerHTML = "";
    state.vibes = [];

    for(var i=0;i<VIBES.length;i++){
      (function(v){
        var label = v.en + (state.frHelp ? (" • " + v.fr) : "");
        var b = document.createElement("button");
        b.type="button";
        b.className="chip";
        b.textContent = label;
        b.addEventListener("click", function(){
          b.classList.toggle("is-on");
          var idx = state.vibes.indexOf(v.en);
          if(b.classList.contains("is-on")){
            if(idx === -1) state.vibes.push(v.en);
          } else {
            if(idx !== -1) state.vibes.splice(idx,1);
          }
          var tips = v.actions.map(function(a){ return "• " + a; }).join("\n");
          $("vibeOut").className = "feedback";
          $("vibeOut").textContent =
            state.vibes.length
              ? ("Try saying: “I'd like to " + v.actions[0] + ".”  Ideas:\n" + tips)
              : "Choose a vibe to get sentence ideas.";
        });
        box.appendChild(b);
      })(VIBES[i]);
    }
  }

  function fillWarmupDropdowns(){
    var action = $("action");
    action.innerHTML = "";
    var bank = (state.level==="A2") ? ACTION_BANK.slice(0,6)
             : (state.level==="B1") ? ACTION_BANK.slice(0,8)
             : ACTION_BANK;
    for(var i=0;i<bank.length;i++){
      var txt = bank[i].en + (state.frHelp ? (" • " + bank[i].fr) : "");
      action.appendChild(makeOption(txt, bank[i].en));
    }

    var reason = $("reason");
    reason.innerHTML = "";
    var rs = (state.level==="B2") ? REASONS_A2.concat(REASONS_B2)
           : (state.level==="B1") ? REASONS_A2.concat(REASONS_B2.slice(0,2))
           : REASONS_A2;
    for(var j=0;j<rs.length;j++){
      var t = rs[j].en + (state.frHelp ? (" • " + rs[j].fr) : "");
      reason.appendChild(makeOption(t, rs[j].en));
    }
  }

  function bindWarmup(){
    $("makeSentence").addEventListener("click", function(){
      var start = $("starter").value;
      var act = $("action").value;
      var rea = $("reason").value;
      var s = start + " " + act + " " + rea + ".";
      $("sentenceOut").textContent = s;
    });
    $("saySentence").addEventListener("click", function(){
      ensureVoiceWarmed();
      speak($("sentenceOut").textContent || "Try building a sentence.", {rate: state.rate});
    });
  }

  // -------------------- vocab cards --------------------
  function renderVocabCards(){
    var list = shuffle(VOCAB);
    var root = $("vocabCards");
    root.innerHTML = "";

    for(var i=0;i<list.length;i++){
      (function(item){
        var card = document.createElement("div");
        card.className = "flip";
        card.innerHTML =
          '<div class="flip__inner">' +
            '<div class="face front">' +
              '<div class="badge">'+item.icon+' <span>'+item.cat+'</span></div>' +
              '<div class="flip__title">'+item.front+'</div>' +
              '<div class="tiny muted frhelp" data-fr>'+(item.backFR ? ("FR: " + item.backFR) : "")+'</div>' +
              '<div class="btnrow">' +
                '<button type="button" class="btn btn--ghost btnFlip">Flip</button>' +
                '<button type="button" class="btn btn--ghost btnSay">🔊</button>' +
              '</div>' +
            '</div>' +
            '<div class="face back">' +
              '<div class="badge">✅ Meaning</div>' +
              '<div class="flip__title">'+item.backEN+'</div>' +
              (state.frHelp ? ('<div class="tiny muted">FR: '+item.backFR+'</div>') : '') +
              '<div class="btnrow">' +
                '<button type="button" class="btn btn--ghost btnFlip2">Back</button>' +
                '<button type="button" class="btn btn--ghost btnSay2">🔊</button>' +
              '</div>' +
            '</div>' +
          '</div>';

        function doFlip(){ card.classList.toggle("is-flipped"); }
        card.querySelector(".btnFlip").addEventListener("click", doFlip);
        card.querySelector(".btnFlip2").addEventListener("click", doFlip);
        card.addEventListener("click", function(e){
          if(e.target && e.target.tagName === "BUTTON") return;
          doFlip();
        });

        card.querySelector(".btnSay").addEventListener("click", function(e){
          e.stopPropagation();
          ensureVoiceWarmed();
          speak(item.front, {rate: state.rate});
        });
        card.querySelector(".btnSay2").addEventListener("click", function(e){
          e.stopPropagation();
          ensureVoiceWarmed();
          speak(item.backEN, {rate: state.rate});
        });

        root.appendChild(card);
      })(list[i]);
    }
    showFRHelp(state.frHelp);
  }

  // -------------------- quiz renderer --------------------
  function renderQuiz(list, rootId, lockMap, feedbackId){
    var root = $(rootId);
    root.innerHTML = "";

    for(var i=0;i<list.length;i++){
      (function(q, idx){
        var card = document.createElement("div");
        card.className = "q";
        card.setAttribute("data-id", q.id);

        card.innerHTML =
          '<div class="q__top">' +
            '<div class="q__title">'+(idx+1)+') '+q.q+'</div>' +
            '<div class="q__meta">' +
              '<button type="button" class="btn btn--ghost btnHint">💡 Hint</button>' +
              '<button type="button" class="btn btn--ghost btnSay">🔊</button>' +
            '</div>' +
          '</div>';

        var choices = document.createElement("div");
        choices.className = "q__choices";

        for(var c=0;c<q.choices.length;c++){
          (function(ch){
            var b = document.createElement("button");
            b.type = "button";
            b.className = "choice";
            b.textContent = ch;

            b.addEventListener("click", function(){
              ensureVoiceWarmed();
              if(lockMap[q.id]) return;
              lockMap[q.id] = true;
              setScore(0,1);

              var ok = (ch === q.a);
              if(ok){
                b.classList.add("is-right");
                setScore(1,0);
                $(feedbackId).className = "feedback good";
                $(feedbackId).textContent = "✅ Correct: " + q.a;
                speak("Correct.", {rate:1});
              } else {
                b.classList.add("is-wrong");
                var all = choices.querySelectorAll(".choice");
                for(var k=0;k<all.length;k++){
                  if(all[k].textContent === q.a) all[k].classList.add("is-right");
                }
                $(feedbackId).className = "feedback bad";
                $(feedbackId).textContent = "❌ Correct: " + q.a + " • " + q.hint;
                speak("Not quite.", {rate:1});
              }
            });

            choices.appendChild(b);
          })(q.choices[c]);
        }

        card.appendChild(choices);

        var hint = document.createElement("div");
        hint.className = "hint";
        hint.textContent = q.hint;
        card.appendChild(hint);

        card.querySelector(".btnHint").addEventListener("click", function(){
          card.classList.toggle("is-showhint");
        });
        card.querySelector(".btnSay").addEventListener("click", function(){
          ensureVoiceWarmed();
          speak(q.a, {rate: state.rate});
        });

        root.appendChild(card);
      })(list[i], i);
    }
  }

  // -------------------- grammar --------------------
  function renderGrammar(){
    var acc = $("grammarAcc");
    acc.innerHTML = "";

    var list = (state.level==="B2") ? GRAMMAR_A2.concat(GRAMMAR_B2)
             : (state.level==="B1") ? GRAMMAR_A2.concat(GRAMMAR_B2.slice(0,1))
             : GRAMMAR_A2;

    for(var i=0;i<list.length;i++){
      (function(item){
        var w = document.createElement("div");
        w.className = "acc";
        w.innerHTML =
          '<button type="button" class="acc__btn">'+item.t+'</button>' +
          '<div class="acc__body">' +
            '<div>'+item.b.replace(/\n/g,"<br>")+'</div>' +
            (state.frHelp ? ('<div class="tiny muted" style="margin-top:10px">💡 '+item.fr+'</div>') : '') +
          '</div>';
        w.querySelector(".acc__btn").addEventListener("click", function(){
          w.classList.toggle("is-open");
        });
        acc.appendChild(w);
      })(list[i]);
    }
  }

  // Sentence builder
  var builder = { parts: [] };

  function renderBuilderChips(){
    builder.parts = [];
    $("builderOut").textContent = "Tap chips to build your sentence.";
    var chips = shuffle(BUILD_SENT.chips);
    renderChips($("builderChips"), chips, function(text){
      builder.parts.push(text);
      $("builderOut").textContent = builder.parts.join(" ").replace(/\s+([.,!?;:])/g,"$1");
    });
  }

  function builderCheck(){
    var s = builder.parts.join(" ").replace(/\s+([.,!?;:])/g,"$1").trim();
    setScore(0,1);
    if(s === BUILD_SENT.correct){
      setScore(1,0);
      $("builderOut").className = "output feedback good";
      $("builderOut").textContent = "✅ Perfect: " + s;
      speak("Great sentence.", {rate:1});
    } else {
      $("builderOut").className = "output feedback bad";
      $("builderOut").textContent = "❌ Not quite. Target: " + BUILD_SENT.correct;
      speak("Try again.", {rate:1});
    }
  }

  // Practice
  function getPractice(){
    return (state.level==="B2") ? PRACTICE_A2.concat(PRACTICE_B2)
         : (state.level==="B1") ? PRACTICE_A2.concat(PRACTICE_B2.slice(0,2))
         : PRACTICE_A2;
  }

  // Trip builder
  function fillTripDropdowns(){
    var d = $("dest"), t = $("transport"), s = $("stay");
    var a = $("avoid"), w = $("avoidWhy");
    d.innerHTML = ""; t.innerHTML=""; s.innerHTML=""; a.innerHTML=""; w.innerHTML="";

    for(var i=0;i<DESTS.length;i++){
      var txt = DESTS[i].en + (state.frHelp ? (" • " + DESTS[i].fr) : "");
      d.appendChild(makeOption(txt, DESTS[i].en));
    }
    for(var j=0;j<TRANSPORT.length;j++){
      var tx2 = TRANSPORT[j].en + (state.frHelp ? (" • " + TRANSPORT[j].fr) : "");
      t.appendChild(makeOption(tx2, TRANSPORT[j].en));
    }
    for(var k=0;k<STAYS.length;k++){
      var tx3 = STAYS[k].en + (state.frHelp ? (" • " + STAYS[k].fr) : "");
      s.appendChild(makeOption(tx3, STAYS[k].en));
    }
    for(var m=0;m<AVOID.length;m++){
      var tx4 = "I don't want to " + AVOID[m].en + (state.frHelp ? (" • " + AVOID[m].fr) : "");
      a.appendChild(makeOption(tx4, AVOID[m].en));
    }
    for(var n=0;n<AVOID_WHY.length;n++){
      var tx5 = AVOID_WHY[n].en + (state.frHelp ? (" • " + AVOID_WHY[n].fr) : "");
      w.appendChild(makeOption(tx5, AVOID_WHY[n].en));
    }
  }

  function renderActivityChips(){
    state.chosenActs = [];
    var root = $("actChips");
    root.innerHTML = "";
    for(var i=0;i<ACTIVITIES.length;i++){
      (function(act){
        var label = act.en + (state.frHelp ? (" • " + act.fr) : "");
        var b = document.createElement("button");
        b.type="button";
        b.className="chip";
        b.textContent=label;
        b.addEventListener("click", function(){
          var on = b.classList.toggle("is-on");
          var idx = state.chosenActs.indexOf(act.en);
          if(on){
            if(state.chosenActs.length >= 3){
              b.classList.remove("is-on");
              return;
            }
            if(idx === -1) state.chosenActs.push(act.en);
          } else {
            if(idx !== -1) state.chosenActs.splice(idx,1);
          }
        });
        root.appendChild(b);
      })(ACTIVITIES[i]);
    }
  }

  function makeTripText(upgrade){
    var dest = $("dest").value;
    var trans = $("transport").value;
    var stay = $("stay").value;
    var avoid = $("avoid").value;
    var avoidWhy = $("avoidWhy").value;

    if(state.chosenActs.length !== 3){
      $("tripOut").textContent = "Pick exactly 3 activities first.";
      $("tripChecklist").textContent = "";
      return;
    }

    var acts = state.chosenActs.slice();
    var a1 = acts[0], a2 = acts[1], a3 = acts[2];

    var base =
      "For my next trip, I'd like to go to " + dest + ". " +
      "I'd like to get there " + trans + " and stay " + stay + ". " +
      "I'd like to " + a1 + ", " + a2 + ", and " + a3 + ". " +
      "I don't want to " + avoid + " " + avoidWhy + ". " +
      "This would be the best next trip ever because it would be fun and relaxing.";

    var b2 =
      "For my next trip, I'd love to go to " + dest + ". " +
      "I'd prefer to travel " + trans + " and stay " + stay + " because it fits the vibe I'm looking for. " +
      "I'd like to " + a1 + ", " + a2 + ", and " + a3 + "; however, I'd rather not " + avoid + " " + avoidWhy + ". " +
      "Overall, it would be the best next trip ever because it would be a great change of scenery and a perfect mix of relaxation and activities.";

    var txt = upgrade ? b2 : base;

    $("tripOut").textContent = txt;

    var check = [
      "✅ would like / would love",
      "✅ where + how + stay",
      "✅ 3 activities",
      "✅ don't want + because",
      upgrade ? "✅ however / overall" : "✅ best next trip ever"
    ].join(" • ");
    $("tripChecklist").textContent = check;
  }

  function renderSpeak(){
    var list = (state.level==="B2") ? SPEAK_A2.concat(SPEAK_B2)
             : (state.level==="B1") ? SPEAK_A2.concat(SPEAK_B2.slice(0,2))
             : SPEAK_A2;

    var box = $("speakList");
    box.innerHTML = "";

    for(var i=0;i<list.length;i++){
      (function(item, idx){
        var d = document.createElement("div");
        d.className = "sp";
        d.innerHTML =
          '<div class="sp__prompt">'+(idx+1)+') '+item.p+'</div>' +
          '<div class="btnrow">' +
            '<button type="button" class="btn btn--ghost btnModel">Model</button>' +
            '<button type="button" class="btn btn--ghost btnSay">🔊 Listen</button>' +
          '</div>' +
          '<div class="sp__model" style="display:none"></div>';

        var model = d.querySelector(".sp__model");
        d.querySelector(".btnModel").addEventListener("click", function(){
          model.style.display = (model.style.display === "none") ? "block" : "none";
          model.textContent = item.m;
        });
        d.querySelector(".btnSay").addEventListener("click", function(){
          ensureVoiceWarmed();
          speak(item.m, {rate: state.rate});
        });

        box.appendChild(d);
      })(list[i], i);
    }
  }

  function renderNoBank(){
    var box = $("noBank");
    box.innerHTML = "";
    for(var i=0;i<NO_BANK.length;i++){
      var line = NO_BANK[i].en + (state.frHelp ? (" — " + NO_BANK[i].fr) : "");
      var d = document.createElement("div");
      d.className = "bankItem";
      d.textContent = line;
      box.appendChild(d);
    }
  }

  function renderCheat(){
    var el = $("cheat");
    var lines = [];
    lines.push("<h3>Useful grammar</h3>");
    lines.push("<ul>");
    lines.push("<li><b>I’d like to + verb</b> (polite): I’d like to visit Rome.</li>");
    lines.push("<li><b>I want to + verb</b> (direct): I want to visit Rome.</li>");
    lines.push("<li><b>I don’t want to + verb</b>: I don’t want to drive.</li>");
    lines.push("<li><b>I don’t like + noun/-ing</b>: I don’t like crowds / waiting.</li>");
    lines.push("<li><b>Prefer to</b> / <b>would rather</b>: I’d rather stay in an apartment.</li>");
    lines.push("<li><b>because</b> (reason) • <b>so</b> (result) • <b>but</b>/<b>however</b> (contrast)</li>");
    lines.push("</ul>");

    lines.push("<h3>Sentence frames</h3>");
    lines.push("<ul>");
    lines.push("<li>For my next trip, I’d like to go to ____ because ____.</li>");
    lines.push("<li>I’d like to get there ____ and stay ____.</li>");
    lines.push("<li>I’d like to ____ , ____ , and ____.</li>");
    lines.push("<li>I don’t want to ____ because ____.</li>");
    lines.push("<li>This would be the best next trip ever because ____ and ____.</li>");
    lines.push("</ul>");

    if(state.frHelp){
      lines.push("<h3>FR reminders</h3>");
      lines.push("<ul>");
      lines.push("<li>‘J’aimerais / Je voudrais’ → <b>I’d like</b></li>");
      lines.push("<li>‘Je préfère’ → <b>I prefer</b> / <b>I’d rather</b></li>");
      lines.push("</ul>");
    }

    el.innerHTML = lines.join("");
  }

  // -------------------- bindings --------------------
  function bindHeader(){
    var btns = document.querySelectorAll(".seg__btn");
    for(var i=0;i<btns.length;i++){
      (function(btn){
        btn.addEventListener("click", function(){
          if(btn.hasAttribute("data-level")){
            var g = document.querySelectorAll('.seg__btn[data-level]');
            for(var k=0;k<g.length;k++) g[k].classList.remove("is-on");
            btn.classList.add("is-on");
            state.level = btn.getAttribute("data-level") || "A2";
            refreshAll();
            speak("Level " + state.level + ".", {rate:1});
            return;
          }
          if(btn.hasAttribute("data-fr")){
            var f = document.querySelectorAll('.seg__btn[data-fr]');
            for(var j=0;j<f.length;j++) f[j].classList.remove("is-on");
            btn.classList.add("is-on");
            state.frHelp = (btn.getAttribute("data-fr")==="on");
            refreshAll();
            return;
          }
          if(btn.hasAttribute("data-accent")){
            var a = document.querySelectorAll('.seg__btn[data-accent]');
            for(var m=0;m<a.length;m++) a[m].classList.remove("is-on");
            btn.classList.add("is-on");
            state.accent = btn.getAttribute("data-accent") || "en-US";
            ensureVoiceWarmed();
          }
        });
      })(btns[i]);
    }

    $("rate").addEventListener("input", function(){
      state.rate = parseFloat($("rate").value) || 1;
      $("rateVal").textContent = state.rate.toFixed(2) + "×";
    });

    $("testVoice").addEventListener("click", function(){
      ensureVoiceWarmed();
      speak("Test voice. Let's plan a trip.", {rate: state.rate});
    });
    $("stopVoice").addEventListener("click", stopSpeak);

    $("start10").addEventListener("click", function(){ startTimer(10*60); });
    $("start5").addEventListener("click", function(){ startTimer(5*60); });
    $("resetTimer").addEventListener("click", resetTimer);
  }

  function bindVocab(){
    $("shuffleVocab").addEventListener("click", function(){ renderVocabCards(); });
    $("vocabListen").addEventListener("click", function(){
      ensureVoiceWarmed();
      var words = shuffle(VOCAB).slice(0,8).map(function(v){ return v.front; }).join(". ");
      speak(words, {rate: state.rate});
    });
  }

  function bindGrammar(){
    $("builderUndo").addEventListener("click", function(){
      builder.parts.pop();
      var s = builder.parts.join(" ").replace(/\s+([.,!?;:])/g,"$1");
      $("builderOut").className = "output";
      $("builderOut").textContent = s || "Tap chips to build your sentence.";
    });
    $("builderReset").addEventListener("click", function(){ renderBuilderChips(); });
    $("builderCheck").addEventListener("click", function(){ ensureVoiceWarmed(); builderCheck(); });
  }

  function bindPractice(){
    $("practiceReset").addEventListener("click", function(){
      state.locks.practice = {};
      renderQuiz(getPractice(), "practiceQuiz", state.locks.practice, "practiceFeedback");
      $("practiceFeedback").className="feedback";
      $("practiceFeedback").textContent="Reset done.";
    });
    $("practiceReview").addEventListener("click", function(){
      $("practiceFeedback").className="feedback";
      $("practiceFeedback").textContent="Tip: correct answers turn green after you answer.";
    });
  }

  function bindTripBuilder(){
    $("genTrip").addEventListener("click", function(){ makeTripText(false); });
    $("genTripB2").addEventListener("click", function(){ makeTripText(true); });
    $("tripSpeak").addEventListener("click", function(){
      ensureVoiceWarmed();
      speak($("tripOut").textContent || "Generate your trip first.", {rate: state.rate});
    });
    $("tripCopy").addEventListener("click", function(){
      var txt = $("tripOut").textContent || "";
      if(!txt) return;
      try{
        navigator.clipboard.writeText(txt);
        $("tripChecklist").textContent = "✅ Copied!";
      } catch(e){
        $("tripChecklist").textContent = "Copy not available. Select and copy manually.";
      }
    });
  }

  function bindFinal(){
    $("start60").addEventListener("click", function(){ ensureVoiceWarmed(); startPitch(); });
    $("stop60").addEventListener("click", function(){ stopPitch(); });

    var modelTxt =
      "For my next trip, I'd love to go to Lisbon. I'd prefer to travel by train because it's comfortable and it feels like a mini-adventure. " +
      "I'd like to do sightseeing, try local food, and explore markets. I'd rather not take a very early flight because it's exhausting. " +
      "Overall, it would be the best next trip ever because it would be a great change of scenery and a perfect mix of relaxation and activities.";

    $("showModelPitch").addEventListener("click", function(){
      var el = $("modelPitch");
      el.style.display = (el.style.display==="none") ? "block" : "none";
      el.textContent = modelTxt;
    });
    $("sayModelPitch").addEventListener("click", function(){
      ensureVoiceWarmed();
      speak(modelTxt, {rate: state.rate});
    });
  }

  function bindPrint(){
    $("printBtn").addEventListener("click", function(){ window.print(); });
  }

  // -------------------- refresh all --------------------
  function refreshAll(){
    showFRHelp(state.frHelp);

    // NEW rap refresh
    renderChant();
    resetRap();

    fillWarmupDropdowns();
    renderVibe();

    renderVocabCards();
    state.locks.vquiz = {};
    var vq = (state.level==="B2") ? VOCAB_QUIZ_B2 : VOCAB_QUIZ_A2;
    renderQuiz(vq, "vocabQuiz", state.locks.vquiz, "vocabFeedback");
    $("vocabFeedback").className="feedback";
    $("vocabFeedback").textContent="Answer to see feedback.";

    renderGrammar();
    renderBuilderChips();

    state.locks.practice = {};
    renderQuiz(getPractice(), "practiceQuiz", state.locks.practice, "practiceFeedback");
    $("practiceFeedback").className="feedback";
    $("practiceFeedback").textContent="Answer to get feedback.";

    fillTripDropdowns();
    renderActivityChips();
    $("tripOut").textContent = "Generate your trip paragraph here.";
    $("tripChecklist").textContent = "";

    renderSpeak();
    renderNoBank();
    renderCheat();
  }

  // -------------------- init --------------------
  function init(){
    if(window.speechSynthesis){
      window.speechSynthesis.onvoiceschanged = function(){};
      getVoices();
    }

    bindHeader();
    bindRap();      // NEW
    bindWarmup();
    bindVocab();
    bindGrammar();
    bindPractice();
    bindTripBuilder();
    bindFinal();
    bindPrint();

    resetTimer();
    renderPitch();
    refreshAll();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
