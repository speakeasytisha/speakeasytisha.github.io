/* SpeakEasyTisha • SFO Airport → Hotel • Final Speaking Session
   Speaking-first, touch-friendly: drag OR tap mode.
   Includes robust TTS (US/UK/Auto) with explicit "Enable voice" unlock.
*/
(function(){
  "use strict";

  /* ---------------------------
     Helpers
  ----------------------------*/
  function $(id){ return document.getElementById(id); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  /* ---------------------------
     Smooth scroll
  ----------------------------*/
  function bindScrollButtons(){
    qsa("[data-scroll]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var sel = btn.getAttribute("data-scroll");
        var el = document.querySelector(sel);
        if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
      });
    });
  }

  /* ---------------------------
     TTS (robust + explicit unlock)
  ----------------------------*/
  var TTS = {
    accent: "auto",
    voices: [],
    unlocked: false,
    statusEl: null,
    init: function(){
      this.statusEl = $("ttsStatus");
      this.setStatus("Voice: loading…");
      this.refreshVoices();
      this.bindGlobalSayButtons();
    },
    setAccent: function(val){
      this.accent = val || "auto";
      this.refreshVoices(true);
    },
    setStatus: function(msg){
      if(this.statusEl) this.statusEl.textContent = msg;
    },
    supported: function(){
      return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
    },
    refreshVoices: function(quiet){
      var self=this;
      if(!this.supported()){
        this.setStatus("Voice: not supported");
        return;
      }
      try{ window.speechSynthesis.getVoices(); }catch(e){}
      self.voices = window.speechSynthesis.getVoices() || [];
      if(!quiet) self.setStatus(self.voices.length ? ("Voice: ready ("+self.voices.length+")") : "Voice: loading…");

      // Some browsers (Safari) load voices later
      var tries=0;
      function poll(){
        tries++;
        var v = window.speechSynthesis.getVoices() || [];
        if(v.length){
          self.voices = v;
          self.setStatus("Voice: ready ("+v.length+")");
          return;
        }
        if(tries<12) setTimeout(poll, 250);
        else self.setStatus("Voice: loading… (tap Enable voice)");
      }
      if(!self.voices.length) setTimeout(poll, 150);

      if(window.speechSynthesis.onvoiceschanged !== undefined){
        window.speechSynthesis.onvoiceschanged = function(){
          self.voices = window.speechSynthesis.getVoices() || [];
          self.setStatus(self.voices.length ? ("Voice: ready ("+self.voices.length+")") : "Voice: loading…");
        };
      }
    },
    desiredLang: function(){
      if(this.accent === "auto") return "en-US";
      return this.accent;
    },
    pickVoice: function(lang){
      var voices = (this.voices && this.voices.length) ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
      if(!voices || !voices.length) return null;
      var want = String(lang||"").toLowerCase();

      // exact
      for(var i=0;i<voices.length;i++){
        var vlang = String(voices[i].lang||"").toLowerCase();
        if(vlang === want) return voices[i];
      }
      // prefix match
      var pref = want.split("-")[0];
      for(var j=0;j<voices.length;j++){
        var vl = String(voices[j].lang||"").toLowerCase();
        if(vl.indexOf(pref)===0) return voices[j];
      }
      return voices[0];
    },
    unlock: function(){
      if(!this.supported()){
        this.setStatus("Voice: not supported");
        return false;
      }
      try{
        // Must be called from a user gesture on iOS/Safari
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(" ");
        u.lang = this.desiredLang();
        u.volume = 0; // silent warmup
        var v = this.pickVoice(u.lang);
        if(v) u.voice = v;
        window.speechSynthesis.speak(u);
        this.unlocked = true;
        this.setStatus("Voice: enabled ✓");
        return true;
      }catch(e){
        this.setStatus("Voice: blocked (tap again)");
        return false;
      }
    },
    speak: function(text){
      var say = String(text||"").trim();
      if(!say) return;
      if(!this.supported()){
        this.setStatus("Voice: not supported");
        return;
      }

      // If not unlocked yet, try to unlock (works best in click handler)
      if(!this.unlocked){
        // attempt anyway; some browsers don't need it
        try{ this.unlock(); }catch(e){}
      }

      try{ window.speechSynthesis.cancel(); }catch(e2){}
      try{ window.speechSynthesis.resume(); }catch(e3){}

      var u2 = new SpeechSynthesisUtterance(say);
      var lang = this.desiredLang();
      u2.lang = lang;
      u2.rate = 0.95;

      var vv = this.pickVoice(lang);
      if(vv) u2.voice = vv;

      var self=this;
      u2.onstart = function(){ self.setStatus("Voice: speaking…"); };
      u2.onend = function(){ self.refreshVoices(true); };
      u2.onerror = function(){ self.setStatus("Voice: error — try Enable voice"); };

      window.speechSynthesis.speak(u2);
    },
    bindGlobalSayButtons: function(){
      var self=this;
      // buttons with data-say attribute
      document.addEventListener("click", function(ev){
        var btn = ev.target.closest("[data-say]");
        if(!btn) return;
        ev.preventDefault();
        var text = btn.getAttribute("data-say") || "";
        self.speak(text);
      });
    }
  };

  /* ---------------------------
     Beep + timers (speaking)
  ----------------------------*/
  var AudioFX = {
    ctx: null,
    ensure: function(){
      if(this.ctx) return true;
      try{
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if(!Ctx) return false;
        this.ctx = new Ctx();
        return true;
      }catch(e){ return false; }
    },
    beep: function(freq, ms){
      if(!this.ensure()) return false;
      var ctx=this.ctx;
      try{ if(ctx.state === "suspended") ctx.resume(); }catch(e){}
      var o=ctx.createOscillator();
      var g=ctx.createGain();
      o.frequency.value = freq || 880;
      g.gain.value = 0.04;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      setTimeout(function(){ try{o.stop();}catch(e){} }, ms || 140);
      return true;
    }
  };

  function startTimer(seconds, feedbackEl, onDone){
    var left = seconds;
    feedbackEl.className = "feedback";
    feedbackEl.textContent = "🎙️ Speak now… " + left + "s";
    var t = setInterval(function(){
      left--;
      feedbackEl.textContent = "🎙️ Speak now… " + left + "s";
      if(left<=0){
        clearInterval(t);
        feedbackEl.className = "feedback good";
        feedbackEl.textContent = "✅ Nice! One more time, smoother and faster.";
        if(typeof onDone==="function") onDone();
      }
    }, 1000);
  }

  /* ---------------------------
     Progress / score
  ----------------------------*/
  var STORE_KEY = "speakeasy_sfo_hotel_final_v1";
  var state = {
    score: 0,
    done: {},
    accent: "auto",
    shadow: false
  };

  function save(){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }catch(e){}
  }
  function load(){
    try{
      var raw = localStorage.getItem(STORE_KEY);
      if(raw){
        var obj = JSON.parse(raw);
        if(obj && typeof obj==="object"){
          state.score = obj.score || 0;
          state.done = obj.done || {};
          state.accent = obj.accent || "auto";
          state.shadow = !!obj.shadow;
        }
      }
    }catch(e){}
  }
  function addScore(n){
    state.score += n;
    updateScoreUI();
    save();
  }
  function markDone(id){
    if(!state.done[id]){
      state.done[id]=true;
      addScore(5);
    }
    updateScoreUI();
    save();
  }
  function totalCount(){
    return Object.keys(tasks).length;
  }
  function doneCount(){
    var c=0;
    Object.keys(tasks).forEach(function(k){ if(state.done[k]) c++; });
    return c;
  }
  function updateScoreUI(){
    var s1=$("scoreValue"), s2=$("scoreValue2"), d1=$("doneValue"), d2=$("doneValue2"), t1=$("totalValue"), t2=$("totalValue2");
    if(s1) s1.textContent = state.score;
    if(s2) s2.textContent = state.score;
    if(d1) d1.textContent = doneCount();
    if(d2) d2.textContent = doneCount();
    if(t1) t1.textContent = totalCount();
    if(t2) t2.textContent = totalCount();

    // Certificate
    var cert = $("certificate");
    if(cert){
      if(doneCount() >= Math.max(5, Math.round(totalCount()*0.75))) cert.hidden = false;
      else cert.hidden = true;
    }
  }

  /* ---------------------------
     Content
  ----------------------------*/
  var powerPhrases = [
    {icon:"🤝", term:"Excuse me — could you help me, please?", fr:"Excusez‑moi — pourriez‑vous m’aider, s’il vous plaît ?", ex:"Excuse me — could you help me find baggage claim, please?"},
    {icon:"🧳", term:"Where is baggage claim?", fr:"Où est la récupération des bagages ?", ex:"Where is baggage claim for international arrivals?"},
    {icon:"🗺️", term:"How do I get to…?", fr:"Comment puis‑je aller à… ?", ex:"How do I get to the taxi stand?"},
    {icon:"🚖", term:"Could you take me to this address?", fr:"Pourriez‑vous m’emmener à cette adresse ?", ex:"Could you take me to this hotel on Market Street?"},
    {icon:"🛎️", term:"I have a reservation under (name).", fr:"J’ai une réservation au nom de…", ex:"I have a reservation under Martin Dupont."},
    {icon:"🕒", term:"Would it be possible to check in early?", fr:"Serait‑il possible d’arriver plus tôt ?", ex:"Would it be possible to check in early today?"},
    {icon:"🔇", term:"Could I have a quiet room, if possible?", fr:"Je peux avoir une chambre calme, si possible ?", ex:"Could I have a quiet room away from the elevator?"},
    {icon:"💳", term:"Is the deposit refundable?", fr:"La caution est‑elle remboursable ?", ex:"Is the deposit refundable at check‑out?"},
    {icon:"🧾", term:"Could you confirm the total, please?", fr:"Pourriez‑vous confirmer le total, s’il vous plaît ?", ex:"Could you confirm the total including taxes and fees?"},
    {icon:"✅", term:"Could we check out at 1 p.m.?", fr:"Pourrions‑nous partir à 13h ?", ex:"Could we check out at 1 p.m. instead of 11 a.m.?"}
  ];

  var tasks = {
    phrases: true,
    dates1: true,
    dates2: true,
    dates3: true,
    politeQuiz: true,
    airportMatch: true,
    airportMini: true,
    hotel1: true,
    hotel2: true,
    checkoutQuiz: true,
    scene1: true,
    scene2: true,
    scene3: true,
    proMission: true
  };

  var builders = {
    dates1: {
      id:"dates1",
      prompt:"Build: “I arrive on Monday at 7:10 p.m.”",
      answer:"I arrive on Monday at 7:10 p.m.",
      words:["I","arrive","on","Monday","at","7:10","p.m."]
    },
    dates2: {
      id:"dates2",
      prompt:"Build: “My check‑in date is January 26th.”",
      answer:"My check‑in date is January 26th.",
      words:["My","check‑in","date","is","January","26th."]
    },
    dates3: {
      id:"dates3",
      prompt:"Build: “Would 3 p.m. work for you?”",
      answer:"Would 3 p.m. work for you?",
      words:["Would","3","p.m.","work","for","you?"]
    },
    hotel1: {
      id:"hotel1",
      prompt:"Build: “Could I have two key cards, please?”",
      answer:"Could I have two key cards, please?",
      words:["Could","I","have","two","key","cards,","please?"]
    },
    hotel2: {
      id:"hotel2",
      prompt:"Build: “Would it be possible to check out late?”",
      answer:"Would it be possible to check out late?",
      words:["Would","it","be","possible","to","check","out","late?"]
    }
  };

  var politeQuestions = [
    {
      id:"politeQuiz",
      q:"You want to know the total price (with taxes). What do you say?",
      a:[
        {t:"Tell me the total price.", ok:false},
        {t:"Could you confirm the total, including taxes, please?", ok:true},
        {t:"Give me the price now.", ok:false}
      ],
      explain:"Use ‘Could you… please?’ + a clear detail (including taxes)."
    },
    {
      q:"You arrive early. You want early check‑in.",
      a:[
        {t:"I want early check‑in.", ok:false},
        {t:"Would it be possible to check in early today?", ok:true},
        {t:"I need my room now.", ok:false}
      ],
      explain:"‘Would it be possible…’ sounds professional and polite."
    },
    {
      q:"You want a quiet room away from the elevator.",
      a:[
        {t:"Give me a quiet room.", ok:false},
        {t:"Could I have a quiet room away from the elevator, if possible?", ok:true},
        {t:"No elevator!", ok:false}
      ],
      explain:"Add ‘if possible’ to soften the request."
    }
  ];

  var checkoutQuestions = [
    {
      id:"checkoutQuiz",
      q:"At check‑out, you want an itemized invoice.",
      a:[
        {t:"Invoice, please.", ok:false},
        {t:"Could I get an itemized receipt, please?", ok:true},
        {t:"I need papers.", ok:false}
      ],
      explain:"‘Itemized receipt’ is the key phrase."
    },
    {
      q:"You want to confirm the deposit return.",
      a:[
        {t:"When do I get my deposit back?", ok:true},
        {t:"Give me my money.", ok:false},
        {t:"Deposit back now.", ok:false}
      ],
      explain:"Direct but polite: ‘When do I get…?’"
    }
  ];

  var airportVocab = [
    {icon:"🛂", term:"passport control", fr:"contrôle des passeports", ex:"Go to passport control."},
    {icon:"🧳", term:"baggage claim", fr:"récupération des bagages", ex:"Baggage claim is downstairs."},
    {icon:"🧾", term:"customs", fr:"douane", ex:"Do you have anything to declare at customs?"},
    {icon:"🚏", term:"shuttle / bus stop", fr:"arrêt de navette / bus", ex:"Where is the shuttle stop?"},
    {icon:"🚖", term:"taxi stand", fr:"station de taxis", ex:"The taxi stand is outside."},
    {icon:"📍", term:"terminal", fr:"terminal", ex:"Which terminal are you arriving at?"}
  ];

  var hotelVocab = [
    {icon:"🛎️", term:"front desk", fr:"réception", ex:"Go to the front desk."},
    {icon:"🪪", term:"ID / passport", fr:"pièce d'identité / passeport", ex:"May I see your ID, please?"},
    {icon:"💳", term:"deposit", fr:"caution", ex:"We require a deposit."},
    {icon:"🧾", term:"receipt", fr:"reçu / facture", ex:"Could I get a receipt?"},
    {icon:"🗝️", term:"key card", fr:"carte‑clé", ex:"Here are your key cards."},
    {icon:"🧺", term:"housekeeping", fr:"service de ménage", ex:"Housekeeping is available daily."}
  ];

  var airportMatchPairs = [
    ["baggage claim", "Pick up your suitcase."],
    ["customs", "Official check after baggage."],
    ["taxi stand", "Place to get a taxi."],
    ["terminal", "Airport building/area for flights."]
  ];

  var airportMiniDialogue = [
    {who:"Officer", say:"Good evening. What is the purpose of your trip?", model:"Good evening. I’m here for tourism / business.", points:2},
    {who:"You", prompt:"Answer politely (choose one).", choices:[
      {t:"I’m here for tourism.", ok:true, say:"I’m here for tourism."},
      {t:"Tourism.", ok:true, say:"Tourism."},
      {t:"I come holidays.", ok:false, say:"I’m here for a vacation."}
    ]},
    {who:"Officer", say:"How long are you staying?", model:"I’m staying for three nights.", points:2},
    {who:"You", prompt:"Answer.", choices:[
      {t:"Three nights.", ok:true, say:"Three nights."},
      {t:"I stay three nights.", ok:true, say:"I’m staying for three nights."},
      {t:"Three night.", ok:false, say:"Three nights."}
    ]},
    {who:"Staff", say:"Baggage claim is downstairs. Do you need directions?", model:"Yes, please. How do I get to the taxi stand?", points:2},
    {who:"You", prompt:"Ask for directions politely.", choices:[
      {t:"How do I get to the taxi stand?", ok:true, say:"How do I get to the taxi stand?"},
      {t:"Taxi?", ok:false, say:"Where is the taxi stand?"},
      {t:"Show me taxi.", ok:false, say:"Could you tell me where the taxi stand is, please?"}
    ]}
  ];

  var scenes = [
    {
      id:"scene1",
      title:"Scene 1 — SFO directions + ride to the hotel",
      steps:[
        {who:"You", type:"say", text:"Excuse me — could you help me, please?", points:2},
        {who:"Staff", type:"say", text:"Sure. Where are you going?"},
        {who:"You", type:"choose", prompt:"Choose your answer (and say it out loud).", options:[
          {t:"I’m going to this hotel. Could you tell me how to get to the taxi stand, please?", ok:true, say:"I’m going to this hotel. Could you tell me how to get to the taxi stand, please?"},
          {t:"Hotel. Taxi.", ok:true, say:"I’m going to my hotel. Where is the taxi stand?"},
          {t:"Need taxi now.", ok:false, say:"Could you help me find the taxi stand, please?"}
        ], points:3},
        {who:"Staff", type:"say", text:"Go straight, then turn left. It’s outside."},
        {who:"You", type:"timer", seconds:20, prompt:"Repeat directions in your own words.", points:2},
        {who:"Driver", type:"say", text:"Hi. Where to?"},
        {who:"You", type:"say", text:"Could you take me to this address, please?", points:2}
      ]
    },
    {
      id:"scene2",
      title:"Scene 2 — Hotel check‑in (reservation + requests)",
      steps:[
        {who:"Front desk", type:"say", text:"Good evening. Welcome. How may I help you?"},
        {who:"You", type:"say", text:"Hi. I have a reservation under (name).", points:2},
        {who:"Front desk", type:"say", text:"Great. May I see your passport and a credit card?"},
        {who:"You", type:"choose", prompt:"Choose a polite response.", options:[
          {t:"Of course. Here you are.", ok:true, say:"Of course. Here you are."},
          {t:"Yes.", ok:true, say:"Yes, here you are."},
          {t:"Take it.", ok:false, say:"Here you are."}
        ], points:2},
        {who:"Front desk", type:"say", text:"Check‑in is at 3 p.m. Check‑out is at 11 a.m."},
        {who:"You", type:"choose", prompt:"Ask for one request politely.", options:[
          {t:"Would it be possible to check in early today?", ok:true, say:"Would it be possible to check in early today?"},
          {t:"Could I have a quiet room, if possible?", ok:true, say:"Could I have a quiet room, if possible?"},
          {t:"I want a quiet room.", ok:false, say:"Could I have a quiet room, please?"}
        ], points:3},
        {who:"Front desk", type:"timer", seconds:20, prompt:"Say your dates clearly (check‑in + check‑out).", points:2}
      ]
    },
    {
      id:"scene3",
      title:"Scene 3 — Check‑out (receipt + deposit + late check‑out)",
      steps:[
        {who:"Front desk", type:"say", text:"Good morning. Are you checking out?"},
        {who:"You", type:"say", text:"Yes, please. Could I get an itemized receipt?", points:2},
        {who:"Front desk", type:"say", text:"Sure. Your total is $412.18. The deposit will be released today."},
        {who:"You", type:"choose", prompt:"Confirm politely.", options:[
          {t:"Thank you. When will I see the deposit on my card?", ok:true, say:"Thank you. When will I see the deposit on my card?"},
          {t:"Deposit today?", ok:true, say:"Great, thank you. Deposit today?"},
          {t:"Give deposit now.", ok:false, say:"Thank you. When will it be refunded?"}
        ], points:3},
        {who:"You", type:"timer", seconds:20, prompt:"Ask for late check‑out politely (even if it’s a no).", points:2},
        {who:"Front desk", type:"say", text:"No problem. Have a great day!"},
        {who:"You", type:"say", text:"Thank you very much. Have a great day!", points:2}
      ]
    }
  ];

  /* ---------------------------
     UI Builders
  ----------------------------*/
  function renderFlashDeck(el, items){
    el.innerHTML = "";
    items.forEach(function(it, idx){
      var card = document.createElement("div");
      card.className = "flash";
      card.setAttribute("tabindex","0");
      card.setAttribute("role","button");
      card.setAttribute("aria-label","Flashcard: "+it.term);
      card.dataset.side="front";
      card.innerHTML =
        '<div class="flash__top">'+
          '<div class="flash__icon" aria-hidden="true">'+esc(it.icon||"")+'</div>'+
          '<div class="flash__term">'+esc(it.term)+'</div>'+
        '</div>'+
        '<div class="flash__sub muted">Tap to flip</div>'+
        '<div class="flash__actions">'+
          '<button class="iconbtn" type="button" data-say="'+esc(it.term)+'">🔊 Term</button>'+
          (it.ex ? '<button class="iconbtn" type="button" data-say="'+esc(it.ex)+'">🔊 Example</button>' : '')+
        '</div>';

      function flip(){
        var side = card.dataset.side;
        if(side==="front"){
          card.dataset.side="back";
          card.innerHTML =
            '<div class="flash__top">'+
              '<div class="flash__icon" aria-hidden="true">'+esc(it.icon||"")+'</div>'+
              '<div class="flash__term">'+esc(it.fr || "—")+'</div>'+
            '</div>'+
            (it.ex ? '<div class="flash__ex"><span class="muted">Example:</span><br>'+esc(it.ex)+'</div>' : '')+
            '<div class="flash__actions">'+
              '<button class="iconbtn" type="button" data-say="'+esc(it.term)+'">🔊 EN</button>'+
              (it.fr ? '<button class="iconbtn" type="button" data-say="'+esc(it.fr)+'">🔊 FR</button>' : '')+
            '</div>';
        }else{
          card.dataset.side="front";
          card.innerHTML =
            '<div class="flash__top">'+
              '<div class="flash__icon" aria-hidden="true">'+esc(it.icon||"")+'</div>'+
              '<div class="flash__term">'+esc(it.term)+'</div>'+
            '</div>'+
            '<div class="flash__sub muted">Tap to flip</div>'+
            '<div class="flash__actions">'+
              '<button class="iconbtn" type="button" data-say="'+esc(it.term)+'">🔊 Term</button>'+
              (it.ex ? '<button class="iconbtn" type="button" data-say="'+esc(it.ex)+'">🔊 Example</button>' : '')+
            '</div>';
        }
      }

      card.addEventListener("click", function(ev){
        // don't flip when clicking buttons
        if(ev.target && ev.target.closest("button")) return;
        flip();
      });
      card.addEventListener("keydown", function(ev){
        if(ev.key==="Enter" || ev.key===" "){
          ev.preventDefault(); flip();
        }
      });

      el.appendChild(card);
    });
  }

  function renderBuilder(holder, cfg){
    var box = document.createElement("div");
    box.className = "builderBox";
    box.innerHTML =
      '<div class="row" style="margin:0; justify-content:space-between;">'+
        '<div><strong>'+esc(cfg.prompt)+'</strong></div>'+
        '<div class="row" style="margin:0;">'+
          '<button class="btn btn--small btn--ghost" type="button" data-say="'+esc(cfg.answer)+'">🔊</button>'+
          '<button class="btn btn--small" type="button">Check</button>'+
          '<button class="btn btn--small btn--ghost" type="button">Reset</button>'+
        '</div>'+
      '</div>'+
      '<div class="answerLine" aria-live="polite"></div>'+
      '<div class="tokens" aria-label="Tap the words to build the sentence"></div>'+
      '<div class="feedback" style="display:none;"></div>';

    var btnCheck = box.querySelectorAll("button")[1];
    var btnReset = box.querySelectorAll("button")[2];
    var answerLine = box.querySelector(".answerLine");
    var tokensEl = box.querySelector(".tokens");
    var fb = box.querySelector(".feedback");

    var words = shuffle(cfg.words);
    var used = {};
    function rebuildTokens(){
      tokensEl.innerHTML = "";
      words.forEach(function(w, i){
        var t = document.createElement("button");
        t.type="button";
        t.className = "token"+(used[i]?" used":"");
        t.textContent = w;
        t.disabled = !!used[i];
        t.addEventListener("click", function(){
          used[i]=true;
          answerLine.textContent = (answerLine.textContent ? (answerLine.textContent + " ") : "") + w;
          rebuildTokens();
        });
        tokensEl.appendChild(t);
      });
    }

    function reset(){
      used = {};
      answerLine.textContent = "";
      fb.style.display="none";
      fb.className="feedback";
      rebuildTokens();
    }

    btnReset.addEventListener("click", reset);
    btnCheck.addEventListener("click", function(){
      var got = String(answerLine.textContent||"").trim().replace(/\s+/g," ");
      var want = String(cfg.answer||"").trim();
      fb.style.display="block";
      if(got === want){
        fb.className="feedback good";
        fb.textContent="✅ Correct!";
        markDone(cfg.id);
        addScore(3);
      }else{
        fb.className="feedback bad";
        fb.innerHTML="❌ Not yet. <span class='muted'>Hint:</span> start with <strong>"+esc(cfg.words[0])+"</strong>.";
      }
    });

    reset();
    holder.appendChild(box);
  }

  function renderMCQ(holder, questions, taskId){
    holder.innerHTML = "";
    questions.forEach(function(item, idx){
      var wrap = document.createElement("div");
      wrap.className = "builderBox";
      wrap.innerHTML =
        '<div><strong>'+(idx+1)+'. '+esc(item.q)+'</strong></div>'+
        '<div class="choiceRow"></div>'+
        '<div class="feedback" style="display:none;"></div>';
      var row = wrap.querySelector(".choiceRow");
      var fb = wrap.querySelector(".feedback");

      item.a.forEach(function(opt){
        var b=document.createElement("button");
        b.type="button";
        b.className="btn btn--small btn--ghost";
        b.textContent=opt.t;
        b.addEventListener("click", function(){
          fb.style.display="block";
          if(opt.ok){
            fb.className="feedback good";
            fb.textContent="✅ Great. Say it out loud once.";
            addScore(3);
            if(opt.say) TTS.speak(opt.say);
            markDone(taskId || item.id || ("mcq_"+idx));
          }else{
            fb.className="feedback bad";
            fb.textContent="❌ Try a more polite version. " + (item.explain || "");
            addScore(0);
          }
        });
        row.appendChild(b);
      });

      holder.appendChild(wrap);
    });
  }

  function renderMatch(holder, pairs, taskId){
    holder.innerHTML = "";
    var box=document.createElement("div");
    box.className="match__cols";

    var leftCol=document.createElement("div");
    var rightCol=document.createElement("div");

    var leftItems = pairs.map(function(p){ return p[0]; });
    var rightItems = pairs.map(function(p){ return p[1]; });

    var shuffledRight = shuffle(rightItems);

    var picked = null; // for tap mode
    var correct = {};
    pairs.forEach(function(p){ correct[p[0]] = p[1]; });

    leftItems.forEach(function(txt){
      var tile=document.createElement("div");
      tile.className="tile";
      tile.textContent=txt;
      tile.setAttribute("draggable","true");
      tile.dataset.key=txt;

      tile.addEventListener("dragstart", function(ev){
        ev.dataTransfer.setData("text/plain", txt);
      });
      tile.addEventListener("click", function(){
        // tap mode
        qsa(".tile", leftCol).forEach(function(t){ t.classList.remove("picked"); });
        picked = txt;
        tile.classList.add("picked");
      });

      leftCol.appendChild(tile);
    });

    shuffledRight.forEach(function(targetText){
      var targ=document.createElement("div");
      targ.className="target";
      targ.textContent=targetText;
      targ.dataset.val=targetText;

      targ.addEventListener("dragover", function(ev){ ev.preventDefault(); });
      targ.addEventListener("drop", function(ev){
        ev.preventDefault();
        var key = ev.dataTransfer.getData("text/plain");
        attempt(key, targetText, targ);
      });
      targ.addEventListener("click", function(){
        if(!picked) return;
        attempt(picked, targetText, targ);
      });

      rightCol.appendChild(targ);
    });

    function attempt(key, targetText, targEl){
      if(!key) return;
      var ok = (correct[key] === targetText);
      targEl.classList.add("filled");
      targEl.classList.remove("good","bad");
      targEl.classList.add(ok ? "good" : "bad");

      if(ok){
        targEl.innerHTML = "<strong>"+esc(key)+"</strong><div class='tiny muted'>"+esc(targetText)+"</div>";
        // disable tile
        var tile = qsa(".tile", leftCol).find(function(t){ return t.dataset.key===key; });
        if(tile){
          tile.style.opacity = .5;
          tile.style.pointerEvents="none";
          tile.setAttribute("draggable","false");
        }
        picked = null;
        addScore(3);

        // check completion
        var remaining = qsa(".tile", leftCol).filter(function(t){ return t.style.pointerEvents!=="none"; }).length;
        if(remaining===0){
          markDone(taskId);
          addScore(5);
        }
      }else{
        addScore(0);
      }
    }

    box.appendChild(leftCol);
    box.appendChild(rightCol);

    var wrapper=document.createElement("div");
    wrapper.className="match";
    wrapper.appendChild(box);

    var hint=document.createElement("div");
    hint.className="feedback";
    hint.innerHTML="Tip: <strong>Drag</strong> a left tile onto the correct meaning — or use <strong>Tap mode</strong>: tap a left tile, then tap a right box.";
    wrapper.appendChild(hint);

    holder.appendChild(wrapper);
  }

  function renderMiniDialogue(holder, lines, taskId){
    holder.innerHTML="";
    var idx=0;

    function render(){
      holder.innerHTML="";
      for(var i=0;i<=idx && i<lines.length;i++){
        var l=lines[i];
        var row=document.createElement("div");
        row.className="line";

        if(l.say){
          row.innerHTML =
            '<div class="who">'+esc(l.who)+'</div>'+
            '<div class="say">'+esc(l.say)+' <button class="iconbtn" type="button" data-say="'+esc(l.say)+'">🔊</button></div>';
          holder.appendChild(row);
        }else if(l.prompt){
          row.innerHTML =
            '<div class="who">'+esc(l.who)+'</div>'+
            '<div class="say"><strong>'+esc(l.prompt)+'</strong></div>';
          holder.appendChild(row);

          var ch=document.createElement("div");
          ch.className="choiceRow";
          l.choices.forEach(function(c){
            var b=document.createElement("button");
            b.type="button";
            b.className="btn btn--small btn--ghost";
            b.textContent=c.t;
            b.addEventListener("click", function(){
              if(c.ok){
                addScore(3);
                TTS.speak(c.say || c.t);
                idx = Math.min(lines.length-1, idx+1);
                if(idx===lines.length-1){ markDone(taskId); addScore(5); }
                render();
              }else{
                addScore(0);
                var fb=document.createElement("div");
                fb.className="feedback bad";
                fb.textContent="Try a more natural phrase. Tap a different option.";
                holder.appendChild(fb);
              }
            });
            ch.appendChild(b);
          });
          holder.appendChild(ch);
        }
      }

      if(idx < lines.length-1){
        var next=document.createElement("button");
        next.type="button";
        next.className="btn btn--small";
        next.textContent="Next";
        next.addEventListener("click", function(){
          idx = Math.min(lines.length-1, idx+1);
          render();
        });
        holder.appendChild(next);
      }else{
        var done=document.createElement("div");
        done.className="feedback good";
        done.textContent="✅ Dialogue complete — say the whole dialogue once more out loud.";
        holder.appendChild(done);
      }
    }
    render();
  }

  /* ---------------------------
     Roleplay Studio
  ----------------------------*/
  function fillSceneSelect(){
    var sel=$("sceneSelect");
    sel.innerHTML="";
    scenes.forEach(function(s){
      var o=document.createElement("option");
      o.value=s.id;
      o.textContent=s.title;
      sel.appendChild(o);
    });
  }

  function renderScene(scene){
    var box=$("sceneBox");
    box.innerHTML="";
    var head=document.createElement("div");
    head.innerHTML="<h3 class='h3' style='margin:0 0 6px;'>"+esc(scene.title)+"</h3><p class='muted' style='margin:0 0 10px;'>Tip: listen once → speak twice.</p>";
    box.appendChild(head);

    var stepIdx=0;

    function speakShadow(text, after){
      // listen -> beep -> timer (you speak)
      TTS.speak(text);
      setTimeout(function(){
        AudioFX.beep(880, 140);
        if(after) after();
      }, 650);
    }

    function renderStep(){
      box.querySelectorAll(".stepBox").forEach(function(n){ n.remove(); });

      var step=scene.steps[stepIdx];
      var sWrap=document.createElement("div");
      sWrap.className="stepBox";
      sWrap.style.borderTop="1px solid rgba(0,0,0,.08)";
      sWrap.style.paddingTop="12px";
      sWrap.style.marginTop="10px";

      if(step.type==="say"){
        sWrap.innerHTML =
          "<div class='line'><div class='who'>"+esc(step.who)+"</div>"+
          "<div class='say'>"+esc(step.text)+"</div></div>"+
          "<div class='choiceRow'>"+
            "<button class='btn btn--small btn--ghost' type='button' data-say='"+esc(step.text)+"'>🔊 Listen</button>"+
            "<button class='btn btn--small' type='button'>🎙️ Say it (20s)</button>"+
          "</div>"+
          "<div class='feedback' style='display:none;'></div>";
        var btnTimer=sWrap.querySelectorAll("button")[1];
        var fb=sWrap.querySelector(".feedback");
        btnTimer.addEventListener("click", function(){
          fb.style.display="block";
          startTimer(20, fb, function(){ addScore(step.points||2); markDone(scene.id); });
        });

      }else if(step.type==="choose"){
        sWrap.innerHTML =
          "<div class='line'><div class='who'>"+esc(step.who)+"</div>"+
          "<div class='say'><strong>"+esc(step.prompt)+"</strong></div></div>"+
          "<div class='choiceRow'></div>"+
          "<div class='feedback' style='display:none;'></div>";

        var row=sWrap.querySelector(".choiceRow");
        var fb2=sWrap.querySelector(".feedback");
        step.options.forEach(function(opt){
          var b=document.createElement("button");
          b.type="button";
          b.className="btn btn--small btn--ghost";
          b.textContent=opt.t;
          b.addEventListener("click", function(){
            fb2.style.display="block";
            if(opt.ok){
              fb2.className="feedback good";
              fb2.textContent="✅ Perfect. Say it out loud once more.";
              if(state.shadow) speakShadow(opt.say || opt.t);
              else TTS.speak(opt.say || opt.t);
              addScore(step.points||3);
              stepIdx = clamp(stepIdx+1, 0, scene.steps.length-1);
              if(stepIdx===scene.steps.length-1) markDone(scene.id);
              setTimeout(renderStep, 450);
            }else{
              fb2.className="feedback bad";
              fb2.textContent="Try a more polite/natural option.";
            }
          });
          row.appendChild(b);
        });

        // model answer
        var modelBtn=document.createElement("button");
        modelBtn.type="button";
        modelBtn.className="btn btn--small";
        modelBtn.textContent="Model answer";
        modelBtn.addEventListener("click", function(){
          fb2.style.display="block";
          fb2.className="feedback";
          fb2.textContent="Model: " + (step.options.find(function(o){return o.ok;})||{}).say;
          var best = (step.options.find(function(o){return o.ok;})||{}).say;
          if(best) TTS.speak(best);
        });
        row.appendChild(modelBtn);

      }else if(step.type==="timer"){
        sWrap.innerHTML =
          "<div class='line'><div class='who'>"+esc(step.who)+"</div>"+
          "<div class='say'><strong>"+esc(step.prompt)+"</strong></div></div>"+
          "<div class='choiceRow'>"+
            "<button class='btn btn--small btn--ghost' type='button'>🎙️ Start "+step.seconds+"s timer</button>"+
            "<button class='btn btn--small btn--ghost' type='button' data-say='Here is a model: "+esc(modelForPrompt(step.prompt))+"'>🔊 Model</button>"+
          "</div>"+
          "<div class='feedback' style='display:none;'></div>";

        var btn=sWrap.querySelectorAll("button")[0];
        var fb3=sWrap.querySelector(".feedback");
        btn.addEventListener("click", function(){
          fb3.style.display="block";
          AudioFX.beep(880, 140);
          startTimer(step.seconds||20, fb3, function(){
            addScore(step.points||2);
            stepIdx = clamp(stepIdx+1, 0, scene.steps.length-1);
            if(stepIdx===scene.steps.length-1) markDone(scene.id);
            setTimeout(renderStep, 350);
          });
        });
      }

      box.appendChild(sWrap);

      var nav=document.createElement("div");
      nav.className="choiceRow";
      var back=document.createElement("button");
      back.type="button";
      back.className="btn btn--small btn--ghost";
      back.textContent="Back";
      back.disabled = (stepIdx===0);
      back.addEventListener("click", function(){ stepIdx = clamp(stepIdx-1, 0, scene.steps.length-1); renderStep(); });

      var next=document.createElement("button");
      next.type="button";
      next.className="btn btn--small btn--ghost";
      next.textContent="Skip";
      next.disabled = (stepIdx===scene.steps.length-1);
      next.addEventListener("click", function(){ stepIdx = clamp(stepIdx+1, 0, scene.steps.length-1); renderStep(); });

      nav.appendChild(back);
      nav.appendChild(next);
      box.appendChild(nav);
    }

    function modelForPrompt(p){
      if(/directions/i.test(p)) return "Go straight, then turn left. It’s outside.";
      if(/dates/i.test(p)) return "My check‑in date is January 26th and my check‑out date is January 29th.";
      if(/late check/i.test(p)) return "Would it be possible to check out at 1 p.m., if available?";
      return "Could you help me, please?";
    }

    renderStep();
  }

  /* ---------------------------
     Pro Mission (email + call)
  ----------------------------*/
  function buildEmail(){
    var name = ($("fName").value || "—").trim();
    var hotel = ($("fHotel").value || "your hotel").trim();
    var cin = ($("fIn").value || "—").trim();
    var cout = ($("fOut").value || "—").trim();
    var arr = ($("fArr").value || "—").trim();
    var req = ($("fReq").value || "—").trim();

    var subject = "Reservation question ("+name+")";
    var body =
      "Subject: "+subject+"\n\n"+
      "Dear "+hotel+" Team,\n\n"+
      "I hope you are well.\n\n"+
      "I have a reservation under the name "+name+".\n"+
      "My check-in date is "+cin+" and my check-out date is "+cout+".\n"+
      "I expect to arrive "+arr+".\n\n"+
      "Would it be possible to confirm the following, please?\n"+
      "- "+req+"\n\n"+
      "Could you also confirm the total price (including taxes) and the deposit policy?\n\n"+
      "Thank you very much for your help.\n\n"+
      "Best regards,\n"+
      name+"\n";
    return body;
  }

  function initProMission(){
    var gen=$("genEmailBtn");
    var out=$("emailOut");
    var copy=$("copyEmailBtn");
    var speakBtn=$("emailSpeakBtn");

    gen.addEventListener("click", function(){
      out.value = buildEmail();
      copy.disabled = false;
      addScore(5);
      markDone("proMission");
    });

    copy.addEventListener("click", function(){
      try{
        out.select();
        document.execCommand("copy");
        copy.textContent="Copied ✓";
        setTimeout(function(){ copy.textContent="Copy"; }, 900);
      }catch(e){}
    });

    speakBtn.addEventListener("click", function(){
      TTS.speak(out.value || buildEmail());
    });

    var callTimer=$("callTimerBtn");
    var modelBtn=$("callModelBtn");
    var model=$("callModel");

    callTimer.addEventListener("click", function(){
      AudioFX.beep(880, 140);
      model.hidden = true;
      var fb = document.createElement("div");
      fb.className="feedback";
      fb.textContent="";
      $("proMission").appendChild(fb);
      startTimer(60, fb, function(){ addScore(8); markDone("proMission"); });
      setTimeout(function(){ try{ fb.remove(); }catch(e){} }, 65000);
    });

    modelBtn.addEventListener("click", function(){
      model.hidden = false;
      model.innerHTML =
        "<strong>Model call (say it out loud):</strong><br><br>"+
        "Hello, good afternoon. My name is _____. I have a reservation from "+esc($("fIn").value||"_____")+" to "+esc($("fOut").value||"_____")+".<br>"+
        "I expect to arrive "+esc($("fArr").value||"around _____")+". Would it be possible to check in early, if available?<br>"+
        "Also, could I have a quiet room away from the elevator, if possible? Could you confirm the total price including taxes and the deposit policy, please?<br>"+
        "Thank you very much for your help. Have a great day.";
      TTS.speak("Hello, good afternoon. My name is. I have a reservation. Would it be possible to check in early, if available? Could you confirm the total, including taxes, please? Thank you.");
    });
  }

  /* ---------------------------
     Drill select
  ----------------------------*/
  function initDrill(){
    var sel=$("drillSelect");
    powerPhrases.forEach(function(p, i){
      var o=document.createElement("option");
      o.value=String(i);
      o.textContent=p.term;
      sel.appendChild(o);
    });

    $("drillListenBtn").addEventListener("click", function(){
      var p=powerPhrases[Number(sel.value)||0];
      TTS.speak(p.term);
    });

    $("drillTimerBtn").addEventListener("click", function(){
      var fb=$("drillFeedback");
      AudioFX.beep(880, 140);
      startTimer(20, fb, function(){
        addScore(4);
        markDone("phrases");
      });
    });
  }

  /* ---------------------------
     Global buttons
  ----------------------------*/
  function bindTopbar(){
    var accentSel=$("accentSelect");
    accentSel.value = state.accent || "auto";
    accentSel.addEventListener("change", function(){
      state.accent = accentSel.value;
      TTS.setAccent(state.accent);
      save();
    });

    $("enableVoiceBtn").addEventListener("click", function(){
      TTS.unlock();
      // also wake audio
      AudioFX.beep(880, 120);
    });

    $("testVoiceBtn").addEventListener("click", function(){
      TTS.speak("Hello. Let’s practise airport and hotel English.");
    });

    $("beepBtn").addEventListener("click", function(){
      var ok=AudioFX.beep(880, 140);
      if(!ok) alert("Beep not supported on this browser.");
    });

    $("resetBtn").addEventListener("click", function(){
      if(confirm("Reset score and progress for this page?")){
        state.score=0; state.done={}; state.shadow=false;
        save();
        updateScoreUI();
        // re-render scene to reset UI (optional)
        var box=$("sceneBox"); if(box) box.innerHTML="";
      }
    });
  }

  function initRoleplay(){
    fillSceneSelect();
    var sceneSel=$("sceneSelect");
    $("startSceneBtn").addEventListener("click", function(){
      var id=sceneSel.value;
      var sc=scenes.find(function(s){ return s.id===id; }) || scenes[0];
      renderScene(sc);
    });

    function updateShadowBtn(){
      $("repeatModeBtn").textContent = state.shadow ? "Shadowing mode: ON" : "Shadowing mode (listen → beep → you speak)";
    }
    updateShadowBtn();

    $("repeatModeBtn").addEventListener("click", function(){
      state.shadow = !state.shadow;
      updateShadowBtn();
      save();
      addScore(1);
    });

    // auto-load first scene preview
    renderScene(scenes[0]);
  }

  /* ---------------------------
     Init
  ----------------------------*/
  function init(){
    load();
    bindScrollButtons();
    bindTopbar();

    // TTS
    TTS.init();
    TTS.setAccent(state.accent || "auto");

    // Flashcards
    renderFlashDeck($("phraseDeck"), powerPhrases);
    renderFlashDeck($("airportVocab"), airportVocab);
    renderFlashDeck($("hotelVocab"), hotelVocab);

    // Builders
    qsa(".builder").forEach(function(holder){
      var key = holder.getAttribute("data-builder");
      if(builders[key]) renderBuilder(holder, builders[key]);
    });

    // MCQs
    renderMCQ($("politeQuiz"), politeQuestions, "politeQuiz");
    renderMCQ($("checkoutQuiz"), checkoutQuestions, "checkoutQuiz");

    // Matching
    qsa("[data-match]").forEach(function(holder){
      var id = holder.getAttribute("data-match");
      if(id==="airportMatch") renderMatch(holder, airportMatchPairs, "airportMatch");
    });

    // Mini dialogue
    renderMiniDialogue($("airportMini"), airportMiniDialogue, "airportMini");

    // Roleplay studio
    initRoleplay();

    // Pro mission
    initProMission();

    // Drill
    initDrill();

    updateScoreUI();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }

})();