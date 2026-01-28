/* SpeakEasyTisha — Entertainment Final Wrap-Up
   Touch-friendly • Instant feedback • Score saved locally • US/UK TTS
   File: entertainment-final-wrapup.js
*/
(function(){
  "use strict";

  /* ------------------------- Helpers ------------------------- */
  function $(id){ return document.getElementById(id); }
  function q(sel, root){ return (root||document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c];
    });
  }
  function norm(s){
    return String(s||"")
      .toLowerCase()
      .replace(/[\u2019']/g, "'")
      .replace(/[^a-z0-9\s']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function uniq(arr){
    var seen={}, out=[];
    for(var i=0;i<arr.length;i++){
      var k=arr[i];
      if(!seen[k]){ seen[k]=1; out.push(k); }
    }
    return out;
  }
  function setFb(el, msg, kind){
    if(!el) return;
    el.classList.remove("good","bad","warn");
    if(kind) el.classList.add(kind);
    el.innerHTML = msg || "";
  }
  function setText(el, txt){
    if(!el) return;
    el.textContent = txt;
  }
  function safeFocus(el){
    try{ el && el.focus && el.focus(); }catch(e){}
  }

  /* ------------------------- Local state ------------------------- */
  var STORE_KEY = "SET.entFinalWrapup.v1";
  var state = {
    accent: "US",            // "US" | "UK"
    voiceEnabled: false,
    score: 0,
    earned: {},              // key -> true
    doneBadges: {}           // badge -> true
  };

  function loadState(){
    try{
      var raw = localStorage.getItem(STORE_KEY);
      if(!raw) return;
      var s = JSON.parse(raw);
      if(s && typeof s === "object"){
        if(s.accent === "US" || s.accent === "UK") state.accent = s.accent;
        if(typeof s.voiceEnabled === "boolean") state.voiceEnabled = s.voiceEnabled;
        if(typeof s.score === "number") state.score = Math.max(0, Math.floor(s.score));
        if(s.earned && typeof s.earned === "object") state.earned = s.earned;
        if(s.doneBadges && typeof s.doneBadges === "object") state.doneBadges = s.doneBadges;
      }
    }catch(e){}
  }
  function saveState(){
    try{
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    }catch(e){}
  }

  function addPoints(key, pts){
    if(state.earned[key]) return false;
    state.earned[key] = true;
    state.score += pts;
    if(state.score < 0) state.score = 0;
    setText($("score"), String(state.score));
    saveState();
    return true;
  }
  function setBadge(name, on){
    var badges = qa('[data-badge="'+name+'"]');
    for(var i=0;i<badges.length;i++){
      if(on) badges[i].classList.add("is-on");
      else badges[i].classList.remove("is-on");
    }
    state.doneBadges[name] = !!on;
    saveState();
  }
  function restoreBadges(){
    ["warmup","vocab","grammar","critic","final"].forEach(function(b){
      setBadge(b, !!state.doneBadges[b]);
    });
  }

  /* ------------------------- TTS (US/UK) ------------------------- */
  var synth = window.speechSynthesis || null;
  var voices = [];
  var currentVoice = null;

  function getDesiredLang(){
    return (state.accent === "UK") ? "en-GB" : "en-US";
  }
  function pickVoice(){
    if(!synth) return null;
    voices = synth.getVoices ? synth.getVoices() : [];
    if(!voices || !voices.length) return null;

    var want = getDesiredLang().toLowerCase();
    // Strong match by lang prefix
    for(var i=0;i<voices.length;i++){
      var v = voices[i];
      if((v.lang||"").toLowerCase() === want) return v;
    }
    // Weaker match by prefix
    for(var j=0;j<voices.length;j++){
      var v2=voices[j];
      if((v2.lang||"").toLowerCase().indexOf(want)===0) return v2;
    }
    // Fallback any English voice
    for(var k=0;k<voices.length;k++){
      var v3=voices[k];
      if(((v3.lang||"").toLowerCase().indexOf("en")===0)) return v3;
    }
    return voices[0] || null;
  }

  function setVoiceStatus(msg){
    var el = $("voiceStatus");
    if(el) el.innerHTML = msg;
  }

  function canSpeak(){
    return !!(synth && window.SpeechSynthesisUtterance);
  }

  function speak(text){
    if(!canSpeak()){
      setVoiceStatus("Voice: not supported on this browser.");
      return;
    }
    if(!state.voiceEnabled){
      setVoiceStatus('Voice: OFF — click <b>Enable voice</b>, then <b>Test</b>.');
      return;
    }
    if(!text) return;

    try{ synth.cancel(); }catch(e){}

    var u = new SpeechSynthesisUtterance(String(text));
    currentVoice = pickVoice();
    if(currentVoice) u.voice = currentVoice;
    u.lang = getDesiredLang();
    u.rate = 1.0;
    u.pitch = 1.0;

    u.onstart = function(){
      setVoiceStatus("Voice: speaking (" + esc(state.accent) + ")…");
    };
    u.onend = function(){
      setVoiceStatus("Voice: ready (" + esc(state.accent) + ").");
    };
    u.onerror = function(){
      setVoiceStatus("Voice: error. Tip: click Enable voice, then Test again.");
    };

    try{
      synth.speak(u);
    }catch(e){
      setVoiceStatus("Voice: blocked. Click Enable voice, then Test.");
    }
  }

  function initVoices(){
    if(!canSpeak()){
      setVoiceStatus("Voice: not supported on this browser.");
      return;
    }
    currentVoice = pickVoice();
    setVoiceStatus("Voice: " + (state.voiceEnabled ? "ready" : "OFF") + " (" + esc(state.accent) + ").");
  }

  /* ------------------------- Content data ------------------------- */
  var VOCAB = [
    // Plot & story
    {cat:"plot", tag:"Plot", en:"plot twist", fr:"rebondissement", def:"a surprising change in the story", ex:"The plot twist was totally unexpected."},
    {cat:"plot", tag:"Plot", en:"pace", fr:"rythme", def:"the speed the story moves", ex:"The pace is slow at first, but it improves."},
    {cat:"plot", tag:"Plot", en:"predictable", fr:"prévisible", def:"easy to guess what will happen", ex:"The ending is a bit predictable."},
    {cat:"plot", tag:"Plot", en:"gripping", fr:"captivant", def:"very exciting and hard to stop watching", ex:"It’s gripping from episode one."},
    {cat:"plot", tag:"Plot", en:"well-written", fr:"bien écrit", def:"clever and structured writing", ex:"The dialogue is well-written."},
    {cat:"plot", tag:"Plot", en:"slow burn", fr:"montée en puissance lente", def:"builds tension slowly over time", ex:"It’s a slow burn, but it pays off."},

    // Acting & characters
    {cat:"acting", tag:"Acting", en:"convincing", fr:"convaincant", def:"believable and realistic", ex:"Her performance is very convincing."},
    {cat:"acting", tag:"Acting", en:"wooden", fr:"raide / sans expression", def:"emotionless; not natural", ex:"His acting feels wooden."},
    {cat:"acting", tag:"Acting", en:"chemistry", fr:"alchimie", def:"natural connection between actors", ex:"The leads have great chemistry."},
    {cat:"acting", tag:"Acting", en:"charismatic", fr:"charismatique", def:"naturally attractive and engaging", ex:"The main actor is charismatic."},
    {cat:"acting", tag:"Acting", en:"complex character", fr:"personnage complexe", def:"a character with depth and contradictions", ex:"She plays a complex character."},
    {cat:"acting", tag:"Acting", en:"cast", fr:"distribution", def:"the group of actors in a film/series", ex:"The cast is excellent overall."},

    // Visuals & sound
    {cat:"visual", tag:"Visual", en:"cinematography", fr:"photographie (image)", def:"camera work and visual style", ex:"The cinematography is stunning."},
    {cat:"visual", tag:"Visual", en:"soundtrack", fr:"bande-son", def:"the music used in the film/series", ex:"The soundtrack sets the mood perfectly."},
    {cat:"visual", tag:"Visual", en:"special effects", fr:"effets spéciaux", def:"visual effects; CGI, etc.", ex:"The special effects look realistic."},
    {cat:"visual", tag:"Visual", en:"atmosphere", fr:"ambiance", def:"the overall mood/feeling", ex:"The atmosphere is tense and dark."},
    {cat:"visual", tag:"Visual", en:"lighting", fr:"éclairage", def:"how light is used in scenes", ex:"The lighting creates suspense."},
    {cat:"visual", tag:"Visual", en:"sound design", fr:"design sonore", def:"the creation of sounds beyond music", ex:"The sound design makes it immersive."},

    // Overall opinion
    {cat:"overall", tag:"Opinion", en:"overrated", fr:"surcoté", def:"considered better than it really is", ex:"I think it’s slightly overrated."},
    {cat:"overall", tag:"Opinion", en:"underrated", fr:"sous-estimé", def:"not as appreciated as it should be", ex:"It’s underrated and deserves more attention."},
    {cat:"overall", tag:"Opinion", en:"worth watching", fr:"vaut le coup", def:"good enough to spend time on", ex:"It’s definitely worth watching."},
    {cat:"overall", tag:"Opinion", en:"disappointing", fr:"décevant", def:"not as good as expected", ex:"The finale was disappointing."},
    {cat:"overall", tag:"Opinion", en:"must-see", fr:"à voir absolument", def:"strongly recommended", ex:"It’s a must-see for thriller fans."},
    {cat:"overall", tag:"Opinion", en:"hit or miss", fr:"inégal", def:"good for some people, not for others", ex:"It’s hit or miss depending on your taste."}
  ];

  var CONNECTORS = [
    {w:"however", fr:"cependant", tip:"contrast / opposition"},
    {w:"although", fr:"bien que", tip:"contrast (subordinate clause)"},
    {w:"because", fr:"parce que", tip:"reason"},
    {w:"so", fr:"donc", tip:"result"},
    {w:"therefore", fr:"par conséquent", tip:"strong result"},
    {w:"in addition", fr:"de plus", tip:"add information"},
    {w:"for example", fr:"par exemple", tip:"give an example"},
    {w:"overall", fr:"globalement", tip:"conclusion"}
  ];

  var ADJ = [
    "amazing","great","good","interesting","original","funny","moving","emotional",
    "boring","confusing","predictable","intense","dark","heartwarming","brilliant","disappointing"
  ];

  /* ------------------------- Models (Listen buttons) ------------------------- */
  var MODELS = {
    warmupModel:
      "Warm-up. Choose your review voice: your tone, your style, and your level of detail. Then practice one spoiler-safe sentence.",
    vocabModel:
      "Vocab. Learn critic words for plot, acting, visuals, and overall opinion. Tap cards to flip. Then match words and definitions.",
    grammarModel:
      "Grammar map. Use present simple to summarize the story. Use past simple for finished time. Use present perfect for experience. Use connectors like however, because, and overall. And use comparisons like better than, or not as good as.",
    actorModel:
      "Critic task. Give a star rating, choose an adjective, and say it politely. You can be honest, but respectful.",
    dialogueModel:
      "Dialogue. Choose the most natural reply when recommending a movie or series. Keep it clear, friendly, and spoiler-free.",
    finalModel:
      "Final task. Write a review of at least eighty words. Use two connectors, three adjectives, one comparison, and one recommendation."
  };

  function miniIntroText(){
    return "Welcome. Today you will review a movie or series like a critic. First, choose your style. Then learn key vocabulary. Next, practice grammar: tenses, connectors, and comparisons. Finally, write and speak your own review. No spoilers!";
  }
  function framesText(){
    return [
      "It's about… The story follows…",
      "I loved… because…",
      "However, … Overall, …",
      "It's better than… It's not as good as…",
      "You should watch it if… You might like it if…"
    ].join(" ");
  }

  /* ------------------------- Warmup pickers ------------------------- */
  var warmupLocked = false;
  var warmupChoices = {tone:null, detail:null, vibe:null};

  function renderWarmupPickers(){
    var host = $("warmupPickers");
    if(!host) return;
    host.innerHTML = "";

    var rows = [
      {key:"tone", label:"Tone", opts:[
        {v:"positive", t:"Positive 🙂"},
        {v:"balanced", t:"Balanced ⚖️"},
        {v:"critical", t:"Critical (polite) 🧐"}
      ]},
      {key:"detail", label:"Detail", opts:[
        {v:"short", t:"Short & clear"},
        {v:"medium", t:"Medium"},
        {v:"detailed", t:"Detailed"}
      ]},
      {key:"vibe", label:"Style", opts:[
        {v:"connectors", t:"Use connectors"},
        {v:"comparisons", t:"Use comparisons"},
        {v:"examples", t:"Give examples"}
      ]}
    ];

    rows.forEach(function(r){
      var wrap = document.createElement("div");
      wrap.className = "row";
      wrap.style.flexWrap = "wrap";

      var lab = document.createElement("span");
      lab.className = "tiny";
      lab.style.minWidth = "100px";
      lab.innerHTML = "<b>"+esc(r.label)+":</b>";
      wrap.appendChild(lab);

      r.opts.forEach(function(o){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.textContent = o.t;
        b.setAttribute("data-warmup", r.key);
        b.setAttribute("data-v", o.v);

        if(warmupChoices[r.key] === o.v) b.classList.add("is-used");
        if(warmupLocked) b.disabled = true;

        b.addEventListener("click", function(){
          if(warmupLocked) return;
          warmupChoices[r.key] = o.v;
          renderWarmupPickers();
        });
        wrap.appendChild(b);
      });

      host.appendChild(wrap);
    });
  }

  function warmupSummary(){
    var tone = warmupChoices.tone || "balanced";
    var detail = warmupChoices.detail || "medium";
    var vibe = warmupChoices.vibe || "connectors";
    var toneTxt = (tone==="positive")?"positive":(tone==="critical")?"critical but polite":"balanced";
    var detailTxt = (detail==="short")?"short and clear":(detail==="detailed")?"detailed":"medium length";
    var vibeTxt = (vibe==="comparisons")?"comparisons":(vibe==="examples")?"examples":"connectors";
    return "Today my review voice is " + toneTxt + ". My review is " + detailTxt + ", and I will use " + vibeTxt + ".";
  }

  function lockWarmup(){
    var fb = $("warmupFb");
    if(!warmupChoices.tone || !warmupChoices.detail || !warmupChoices.vibe){
      setFb(fb, "Pick 1 option in each line first.", "warn");
      return;
    }
    warmupLocked = true;
    renderWarmupPickers();
    var gained = addPoints("warmup.lock", 3);
    setFb(fb, gained ? "Locked! +3 points. Nice — now use this style in every task." : "Already locked. Good job!", "good");
    setBadge("warmup", true);
  }

  /* ------------------------- Tile builder (spoiler safe) ------------------------- */
  var builder = {
    spoilerSafe: {
      bankId:"bank_spoilerSafe",
      ansId:"ans_spoilerSafe",
      fbId:"fb_spoilerSafe",
      tiles: [
        "I","won't","spoil","anything,","but","the","acting","is","excellent.","Overall,","it's","worth","watching."
      ]
    }
  };
  var builderAns = { spoilerSafe: [] };

  function renderBuilder(name){
    var cfg = builder[name];
    if(!cfg) return;
    var bank = $(cfg.bankId), ans = $(cfg.ansId), fb = $(cfg.fbId);
    if(!bank || !ans) return;

    var chosen = builderAns[name] || [];
    bank.innerHTML = "";
    ans.innerHTML = "";

    cfg.tiles.forEach(function(t){
      var used = chosen.indexOf(t) !== -1;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tile" + (used ? " is-done" : "");
      btn.textContent = t;
      btn.disabled = used;
      btn.addEventListener("click", function(){
        if(used) return;
        chosen.push(t);
        builderAns[name] = chosen;
        renderBuilder(name);
      });
      bank.appendChild(btn);
    });

    chosen.forEach(function(t, idx){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tile";
      b.textContent = t;
      b.title = "Tap to remove";
      b.addEventListener("click", function(){
        chosen.splice(idx,1);
        builderAns[name] = chosen;
        renderBuilder(name);
      });
      ans.appendChild(b);
    });

    // keep feedback if already present; don't overwrite
    if(fb && !fb.innerHTML) setFb(fb, "Tip: Aim for a spoiler-free sentence about acting/music/visuals.", "");
  }

  function getBuiltSentence(name){
    var words = (builderAns[name]||[]).slice();
    if(!words.length) return "";
    var s = words.join(" ");
    // Fix spacing for commas/periods (simple)
    s = s.replace(/\s+([,.!?])/g, "$1");
    return s;
  }

  function checkBuilder(name){
    var cfg = builder[name];
    if(!cfg) return;
    var fb = $(cfg.fbId);
    var s = getBuiltSentence(name);
    if(!s){
      setFb(fb, "Build a sentence first.", "warn");
      return;
    }
    var n = norm(s);
    var ok = (n.indexOf("won't spoil") !== -1 || n.indexOf("wont spoil") !== -1) &&
             (n.indexOf("anything") !== -1) &&
             (n.indexOf("acting") !== -1 || n.indexOf("music") !== -1 || n.indexOf("sound") !== -1 || n.indexOf("visual") !== -1) &&
             (n.indexOf("but") !== -1 || n.indexOf("however") !== -1);
    if(ok){
      var gained = addPoints("builder."+name, 2);
      setFb(fb, (gained ? "Perfect — spoiler safe! +2 points." : "Correct — spoiler safe!"), "good");
    }else{
      setFb(fb, "Almost. Include: <b>I won't spoil anything</b> + <b>but/however</b> + a safe topic (acting/music/visuals).", "bad");
    }
  }

  function resetBuilder(name){
    builderAns[name] = [];
    renderBuilder(name);
    var fb = $(builder[name].fbId);
    setFb(fb, "", "");
  }

  /* ------------------------- Vocab tabs + flashcards ------------------------- */
  var activeTab = "plot";

  function renderTabs(){
    qa(".tab").forEach(function(btn){
      var tab = btn.getAttribute("data-tab");
      var on = (tab === activeTab);
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function makeFlashCard(item){
    var card = document.createElement("div");
    card.className = "flash";
    card.tabIndex = 0;
    card.setAttribute("role","button");
    card.setAttribute("aria-label", "Flashcard: " + item.en);

    var inner = document.createElement("div");
    inner.className = "flash__inner";

    var front = document.createElement("div");
    front.className = "flash__face flash__front";
    front.innerHTML =
      '<div class="flash__top">' +
        '<span class="flash__tag">'+esc(item.tag)+'</span>' +
        '<button type="button" class="flash__btn" aria-label="Listen">'+ '🔈' +'</button>' +
      '</div>' +
      '<div class="flash__word">'+esc(item.en)+'</div>' +
      '<div class="flash__meta">FR: <b>'+esc(item.fr)+'</b><br><span class="tiny">Tap to flip</span></div>';

    var back = document.createElement("div");
    back.className = "flash__face flash__back";
    back.innerHTML =
      '<div class="flash__top">' +
        '<span class="flash__tag">Meaning</span>' +
        '<button type="button" class="flash__btn" aria-label="Listen example">🔈</button>' +
      '</div>' +
      '<div class="flash__meta"><b>Definition:</b> '+esc(item.def)+'</div>' +
      '<div class="flash__meta"><b>Example:</b> '+esc(item.ex)+'</div>';

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    function flip(){
      card.classList.toggle("is-flipped");
    }

    card.addEventListener("click", function(e){
      var t = e.target;
      // Clicking the listen buttons should not flip
      if(t && t.classList && t.classList.contains("flash__btn")) return;
      flip();
    });
    card.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        flip();
      }
    });

    // Listen buttons
    var btns = qa(".flash__btn", card);
    if(btns[0]){
      btns[0].addEventListener("click", function(e){
        e.stopPropagation();
        speak(item.en + ". " + item.fr + ".");
      });
    }
    if(btns[1]){
      btns[1].addEventListener("click", function(e){
        e.stopPropagation();
        speak(item.ex);
      });
    }

    return card;
  }

  function renderFlashcards(){
    var host = $("flashgrid");
    if(!host) return;
    host.innerHTML = "";

    var items = VOCAB.filter(function(v){ return v.cat === activeTab; });
    items = shuffle(items).slice(0, 8);

    items.forEach(function(it){
      host.appendChild(makeFlashCard(it));
    });
  }

  /* ------------------------- Pairing game ------------------------- */
  var pairState = {
    pickedWord: null,
    pickedDef: null,
    locked: {} // key -> true
  };

  function pairKey(it){ return it.en; }

  function renderPairGame(){
    var host = $("pairGame");
    var fb = $("pairFb");
    if(!host) return;

    var items = shuffle(VOCAB).slice(0, 8);
    host.innerHTML = "";

    var col1 = document.createElement("div");
    col1.className = "paircol";
    var col2 = document.createElement("div");
    col2.className = "paircol";

    // Create shuffled word buttons and definition buttons
    var words = items.map(function(it){ return it.en; });
    var defs  = items.map(function(it){ return it.def; });

    words = shuffle(words);
    defs  = shuffle(defs);

    function makeBtn(text, kind){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pairbtn";
      b.textContent = text;
      b.setAttribute("data-kind", kind);
      return b;
    }

    words.forEach(function(w){
      var b = makeBtn(w, "word");
      b.addEventListener("click", function(){
        if(b.classList.contains("is-locked")) return;
        qa(".pairbtn[data-kind='word']", host).forEach(function(x){ x.classList.remove("is-picked"); });
        pairState.pickedWord = w;
        b.classList.add("is-picked");
      });
      col1.appendChild(b);
    });

    defs.forEach(function(d){
      var b = makeBtn(d, "def");
      b.addEventListener("click", function(){
        if(b.classList.contains("is-locked")) return;
        qa(".pairbtn[data-kind='def']", host).forEach(function(x){ x.classList.remove("is-picked"); });
        pairState.pickedDef = d;
        b.classList.add("is-picked");
        // Try resolve if a word is already picked
        tryResolvePair(items, host, fb);
      });
      col2.appendChild(b);
    });

    host.appendChild(col1);
    host.appendChild(col2);

    setFb(fb, "Tap a word, then tap its definition.", "");
    // Save current items for checking
    host._pairItems = items;
    pairState.pickedWord = null;
    pairState.pickedDef = null;
    pairState.locked = {};
  }

  function tryResolvePair(items, host, fb){
    if(!pairState.pickedWord || !pairState.pickedDef) return;

    var correct = null;
    for(var i=0;i<items.length;i++){
      if(items[i].en === pairState.pickedWord){
        correct = items[i].def;
        break;
      }
    }
    var w = pairState.pickedWord;
    var d = pairState.pickedDef;

    var wordBtn = qa(".pairbtn[data-kind='word']", host).filter(function(b){ return b.textContent === w; })[0];
    var defBtn  = qa(".pairbtn[data-kind='def']", host).filter(function(b){ return b.textContent === d; })[0];

    if(!wordBtn || !defBtn) return;

    if(d === correct){
      pairState.locked[w] = true;
      wordBtn.classList.add("is-locked","good");
      defBtn.classList.add("is-locked","good");
      wordBtn.classList.remove("is-picked");
      defBtn.classList.remove("is-picked");

      // points per correct pair (once)
      addPoints("pair."+w, 1);

      // Check completion
      var lockedCount = Object.keys(pairState.locked).length;
      if(lockedCount >= (host._pairItems ? host._pairItems.length : 8)){
        setFb(fb, "All pairs locked! + points. Badge earned ✅", "good");
        setBadge("vocab", true);
      }else{
        setFb(fb, "Correct ✅ Keep going ("+lockedCount+"/"+(host._pairItems?host._pairItems.length:8)+")", "good");
      }
    }else{
      wordBtn.classList.add("bad");
      defBtn.classList.add("bad");
      setFb(fb, "Not a match. Try again.", "bad");
      setTimeout(function(){
        wordBtn.classList.remove("bad");
        defBtn.classList.remove("bad");
      }, 550);
    }

    pairState.pickedWord = null;
    pairState.pickedDef = null;
  }

  /* ------------------------- Quiz builder ------------------------- */
  function renderQuiz(hostId, questions){
    var host = $(hostId);
    if(!host) return;
    host.innerHTML = "";

    questions.forEach(function(qo, qi){
      var wrap = document.createElement("div");
      wrap.className = "q";
      wrap.setAttribute("data-q", String(qi));

      var p = document.createElement("div");
      p.className = "q__prompt";
      p.textContent = qo.prompt;
      wrap.appendChild(p);

      var opts = document.createElement("div");
      opts.className = "opts";

      qo.options.forEach(function(opt, oi){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.textContent = opt;
        b.setAttribute("data-oi", String(oi));
        b.addEventListener("click", function(){
          if(wrap.getAttribute("data-done")==="1") return;

          var right = (oi === qo.answer);
          if(right){
            b.classList.add("is-right");
            wrap.setAttribute("data-done","1");
            // Points once per question
            addPoints(hostId+".q"+qi, 1);
            if(qo.note){
              var note = document.createElement("div");
              note.className = "q__note";
              note.innerHTML = "✅ " + esc(qo.note);
              wrap.appendChild(note);
            }
            // badge logic
            if(hostId === "tenseQuiz"){
              if(allQuizDone(hostId)) setBadge("grammar", true);
            }
            if(hostId === "politeQuiz"){
              if(allQuizDone(hostId)) setBadge("critic", true);
            }
          }else{
            b.classList.add("is-wrong");
            // also highlight the correct one
            var correctBtn = qa(".opt", wrap)[qo.answer];
            if(correctBtn) correctBtn.classList.add("is-right");
            wrap.setAttribute("data-done","1");
            if(qo.note){
              var note2 = document.createElement("div");
              note2.className = "q__note";
              note2.innerHTML = "ℹ️ " + esc(qo.note);
              wrap.appendChild(note2);
            }
          }
        });
        opts.appendChild(b);
      });

      wrap.appendChild(opts);
      host.appendChild(wrap);
    });
  }

  function allQuizDone(hostId){
    var host = $(hostId);
    if(!host) return false;
    var qs = qa(".q", host);
    if(!qs.length) return false;
    for(var i=0;i<qs.length;i++){
      if(qs[i].getAttribute("data-done")!=="1") return false;
    }
    return true;
  }

  function resetQuiz(hostId){
    var host=$(hostId);
    if(!host) return;
    qa(".q", host).forEach(function(w){
      w.removeAttribute("data-done");
      qa(".opt", w).forEach(function(b){
        b.classList.remove("is-right","is-wrong");
      });
      qa(".q__note", w).forEach(function(n){ n.parentNode.removeChild(n); });
    });
    if(hostId==="tenseQuiz") setFb($("tenseQuizFb"), "", "");
    if(hostId==="politeQuiz") setFb($("politeQuizFb"), "", "");
  }

  /* ------------------------- Grammar: tense quiz ------------------------- */
  var tenseQuestions = [
    {prompt:"1) “The series follows a detective in Boston.”", options:["Present Simple","Past Simple","Present Perfect"], answer:0, note:"Plot summaries → Present Simple."},
    {prompt:"2) “I watched it last weekend.”", options:["Present Simple","Past Simple","Present Perfect"], answer:1, note:"Finished time → Past Simple."},
    {prompt:"3) “I’ve seen it twice.”", options:["Past Simple","Present Perfect","Present Continuous"], answer:1, note:"Experience/no time → Present Perfect."},
    {prompt:"4) “I’m watching season 2 right now.”", options:["Present Continuous","Present Perfect","Past Simple"], answer:0, note:"Now/in progress → Present Continuous."},
    {prompt:"5) “I didn’t like the ending.”", options:["Past Simple","Present Simple","Present Perfect"], answer:0, note:"Opinion about a finished viewing → Past Simple works well."}
  ];

  /* ------------------------- Grammar: connectors fill ------------------------- */
  var connectorState = {
    activeBlank: null,
    fills: [] // chosen connectors by blank index
  };

  var connectorSentences = [
    {parts:["The story is engaging,", " the pace is slow at the beginning."], ans:"however"},
    {parts:["I recommend it", " it’s well-written and surprising."], ans:"because"},
    {parts:["It’s a bit predictable,", " it’s still worth watching."], ans:"although"},
    {parts:["The soundtrack is great,", " the acting is even better."], ans:"in addition"}
  ];

  function renderConnectorFill(){
    var fill = $("connectorFill");
    var chips = $("connectorChips");
    var fb = $("connectorFb");
    if(!fill || !chips) return;

    connectorState.activeBlank = null;
    connectorState.fills = new Array(connectorSentences.length);
    fill.innerHTML = "";
    chips.innerHTML = "";

    connectorSentences.forEach(function(s, i){
      var row = document.createElement("div");
      row.className = "sent";
      row.innerHTML =
        esc(s.parts[0]) +
        ' <span class="blank" data-i="'+i+'" role="button" tabindex="0">______</span> ' +
        esc(s.parts[1]);
      fill.appendChild(row);
    });

    function setActive(i){
      connectorState.activeBlank = i;
      qa(".blank", fill).forEach(function(b){
        b.classList.toggle("is-active", b.getAttribute("data-i")===String(i));
      });
    }

    qa(".blank", fill).forEach(function(b){
      b.addEventListener("click", function(){
        setActive(parseInt(b.getAttribute("data-i"),10));
      });
      b.addEventListener("keydown", function(e){
        if(e.key==="Enter" || e.key===" "){
          e.preventDefault();
          setActive(parseInt(b.getAttribute("data-i"),10));
        }
      });
    });

    CONNECTORS.forEach(function(c){
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = c.w;
      chip.title = c.fr + " — " + c.tip;
      chip.addEventListener("click", function(){
        var i = connectorState.activeBlank;
        if(i === null || typeof i === "undefined"){
          setFb(fb, "Tap a blank first, then tap a connector.", "warn");
          return;
        }
        connectorState.fills[i] = c.w;
        // Update blank text
        var blank = q('.blank[data-i="'+i+'"]', fill);
        if(blank){
          blank.textContent = c.w;
          blank.classList.add("is-filled");
        }
        // Mark used style lightly (still reusable)
        chip.classList.add("is-used");
        setFb(fb, "Filled blank #" + (i+1) + " with <b>" + esc(c.w) + "</b>.", "");
      });
      chips.appendChild(chip);
    });

    setFb(fb, "Tap a blank, then choose a connector chip.", "");
  }

  function checkConnectors(){
    var fb = $("connectorFb");
    var all = true, correct = 0;
    for(var i=0;i<connectorSentences.length;i++){
      var got = (connectorState.fills[i]||"").toLowerCase();
      if(!got){ all=false; continue; }
      if(got === connectorSentences[i].ans) correct++;
    }
    if(!all){
      setFb(fb, "Fill all blanks first.", "warn");
      return;
    }
    if(correct === connectorSentences.length){
      var gained = addPoints("connectors.all", 3);
      setFb(fb, (gained ? "Perfect! All connectors correct. +3 points." : "All correct ✅"), "good");
      setBadge("grammar", true);
    }else{
      setFb(fb, "Almost: " + correct + "/" + connectorSentences.length + " correct. Use Hint or try again.", "bad");
    }
  }

  function hintConnectors(){
    var fb = $("connectorFb");
    var tips = connectorSentences.map(function(s,i){
      return (i+1) + ") " + s.ans;
    }).join(" • ");
    setFb(fb, "Hint — correct connectors: <b>" + esc(tips) + "</b>", "warn");
  }

  function listenConnectorsModel(){
    var lines = connectorSentences.map(function(s){
      return s.parts[0] + " " + s.ans + " " + s.parts[1];
    }).join(" ");
    speak(lines);
  }

  function resetConnectors(){
    renderConnectorFill();
  }

  /* ------------------------- Grammar: comparison builder ------------------------- */
  var compareCfg = {
    a: ["This movie","This series","The acting","The soundtrack","The plot"],
    cmp: ["is better than","is not as good as","is more interesting than","is less predictable than","is more intense than"],
    b: ["most movies in this genre","season 1","other thrillers","many recent shows","what I expected"],
    end: ["overall.","in my opinion.","for me.","to be honest.","as a whole."]
  };

  function renderCompareBuilder(){
    var host = $("compareBuilder");
    if(!host) return;
    host.innerHTML = "";

    function addLabel(txt){
      var s = document.createElement("span");
      s.className = "label";
      s.textContent = txt;
      host.appendChild(s);
    }
    function addSelect(id, arr){
      var sel = document.createElement("select");
      sel.id = id;
      arr.forEach(function(v){
        var o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        sel.appendChild(o);
      });
      host.appendChild(sel);
      return sel;
    }

    addLabel("A");
    addSelect("cmpA", compareCfg.a);
    addLabel("comparison");
    addSelect("cmpCmp", compareCfg.cmp);
    addLabel("B");
    addSelect("cmpB", compareCfg.b);
    addLabel("ending");
    addSelect("cmpEnd", compareCfg.end);
  }

  function buildComparison(){
    var out = $("compareOut");
    var fb = $("compareFb");
    var A = $("cmpA") ? $("cmpA").value : "";
    var C = $("cmpCmp") ? $("cmpCmp").value : "";
    var B = $("cmpB") ? $("cmpB").value : "";
    var E = $("cmpEnd") ? $("cmpEnd").value : "";
    if(!A || !C || !B){
      setFb(fb, "Choose all dropdowns.", "warn");
      return;
    }
    var s = A + " " + C + " " + B + " " + E;
    out.textContent = s;
    setFb(fb, "Nice comparison ✅", "good");
    addPoints("compare.build", 2);
    setBadge("grammar", true);
  }
  function listenComparison(){
    var out = $("compareOut");
    if(out && out.textContent.trim()) speak(out.textContent.trim());
    else speak("Build a comparison sentence first.");
  }
  function resetComparison(){
    var out = $("compareOut");
    var fb = $("compareFb");
    if(out) out.textContent = "";
    setFb(fb, "", "");
    renderCompareBuilder();
  }

  /* ------------------------- Actor section ------------------------- */
  var actorStars = 0;

  function renderStars(){
    var host = $("stars");
    if(!host) return;
    qa(".star", host).forEach(function(b){
      var n = parseInt(b.getAttribute("data-star"),10);
      b.classList.toggle("is-on", n <= actorStars);
    });
  }
  function setStars(n){
    actorStars = n;
    renderStars();
  }

  var actorOptions = {
    who: ["the main actor","the lead actress","the villain","the supporting cast","the narrator"],
    adj: ["excellent","convincing","charismatic","forgettable","wooden","over-the-top","brilliant","disappointing"],
    soft: ["I’d say","I think","In my opinion","To be honest","Overall"]
  };

  function renderActorBuilder(){
    var host = $("actorBuilder");
    if(!host) return;
    host.innerHTML = "";

    function label(t){
      var s = document.createElement("span");
      s.className = "label";
      s.textContent = t;
      host.appendChild(s);
    }
    function select(id, arr){
      var sel = document.createElement("select");
      sel.id = id;
      arr.forEach(function(v){
        var o=document.createElement("option");
        o.value=v; o.textContent=v;
        sel.appendChild(o);
      });
      host.appendChild(sel);
    }

    label("Subject");
    select("actorWho", actorOptions.who);
    label("is");
    select("actorAdj", actorOptions.adj);
    label("softener");
    select("actorSoft", actorOptions.soft);
  }

  function buildActorSentence(){
    var out = $("actorOut");
    var fb = $("actorFb");
    var who = $("actorWho") ? $("actorWho").value : "";
    var adj = $("actorAdj") ? $("actorAdj").value : "";
    var soft = $("actorSoft") ? $("actorSoft").value : "";
    if(!who || !adj || !soft){
      setFb(fb, "Choose the dropdowns first.", "warn");
      return;
    }
    if(actorStars<=0){
      setFb(fb, "Pick a star rating first (1–5).", "warn");
      return;
    }
    var s = soft + ", " + who + " is " + adj + ". I'd give it " + actorStars + " out of 5 stars.";
    out.textContent = s;
    setFb(fb, "Great — polite and clear ✅", "good");
    addPoints("actor.build", 2);
    setBadge("critic", true);
  }
  function listenActor(){
    var out = $("actorOut");
    speak(out && out.textContent.trim() ? out.textContent.trim() : "Build your actor sentence first.");
  }
  function resetActor(){
    actorStars = 0;
    renderStars();
    renderActorBuilder();
    setText($("actorOut"), "");
    setFb($("actorFb"), "", "");
  }

  /* ------------------------- Polite critique quiz ------------------------- */
  var politeQuestions = [
    {
      prompt:"Which is the most polite critique?",
      options:[
        "This actor is terrible and annoying.",
        "I didn’t really connect with the performance, to be honest.",
        "This was a waste of time."
      ],
      answer:1,
      note:"Use softeners: I didn’t really…, to be honest, in my opinion."
    },
    {
      prompt:"Choose the best ‘balanced’ opinion:",
      options:[
        "It’s perfect. No problems at all.",
        "It has flaws, but overall it’s worth watching.",
        "It’s trash."
      ],
      answer:1,
      note:"Balance = one negative + one positive + overall."
    },
    {
      prompt:"Pick a spoiler-safe sentence:",
      options:[
        "The killer is the brother.",
        "The ending is surprising, but I won’t spoil anything.",
        "In the last scene, she dies."
      ],
      answer:1,
      note:"Avoid revealing key events. Keep it general."
    }
  ];

  /* ------------------------- Dialogue game ------------------------- */
  var dialogueLines = [
    {
      who:"Friend",
      text:"I want a good series for tonight. Any ideas?",
      options:[
        {t:"You should watch it if you like mysteries. The pacing is great.", ok:true},
        {t:"Just watch it. It’s obvious what happens.", ok:false},
        {t:"I won’t tell you anything, but the last scene changes everything.", ok:false}
      ]
    },
    {
      who:"Friend",
      text:"Is it better than the first season?",
      options:[
        {t:"In my opinion, it’s better than season 1 because the characters are deeper.", ok:true},
        {t:"Yes. Next question.", ok:false},
        {t:"No, because the villain dies in episode 2.", ok:false}
      ]
    },
    {
      who:"Friend",
      text:"What did you like about it?",
      options:[
        {t:"I loved the cinematography; in addition, the soundtrack is excellent.", ok:true},
        {t:"Everything was boring. Don’t ask me.", ok:false},
        {t:"I liked when they reveal the secret at the end.", ok:false}
      ]
    },
    {
      who:"Friend",
      text:"Should I watch it with my kids?",
      options:[
        {t:"Maybe not — it can be intense. However, it depends on their age.", ok:true},
        {t:"Of course, it’s totally harmless (even the horror scenes).", ok:false},
        {t:"Yes, the scary part is when…", ok:false}
      ]
    }
  ];
  var dialogueDone = {};

  function renderDialogue(){
    var host = $("dialogueGame");
    var fb = $("dialogueFb");
    if(!host) return;
    host.innerHTML = "";
    dialogueDone = {};

    dialogueLines.forEach(function(line, li){
      var wrap = document.createElement("div");
      wrap.className = "line";
      wrap.setAttribute("data-li", String(li));

      var who = document.createElement("div");
      who.className = "line__who";
      who.textContent = line.who;
      wrap.appendChild(who);

      var text = document.createElement("div");
      text.className = "line__text";
      text.textContent = line.text;
      wrap.appendChild(text);

      var opts = document.createElement("div");
      opts.className = "line__opts";

      line.options.forEach(function(opt, oi){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.textContent = opt.t;
        b.addEventListener("click", function(){
          if(dialogueDone[li]) return;
          if(opt.ok){
            b.classList.add("is-right");
            dialogueDone[li] = true;
            addPoints("dialogue."+li, 1);
            setFb(fb, "Line " + (li+1) + " ✅ Nice!", "good");
            // lock other buttons in this line
            qa(".opt", wrap).forEach(function(x){
              x.disabled = true;
            });
            // completion badge
            var all=true;
            for(var k=0;k<dialogueLines.length;k++){
              if(!dialogueDone[k]) all=false;
            }
            if(all){
              setFb(fb, "All dialogue lines complete ✅", "good");
              setBadge("critic", true);
            }
          }else{
            b.classList.add("is-wrong");
            // show correct
            var correct = line.options.filter(function(o){ return o.ok; })[0];
            setFb(fb, "Not the best option. Look for: polite + connector + no spoilers.", "bad");
            // highlight correct button
            qa(".opt", wrap).forEach(function(x){
              if(x.textContent === correct.t) x.classList.add("is-right");
            });
            dialogueDone[li] = true; // count as done but no points
            qa(".opt", wrap).forEach(function(x){ x.disabled = true; });
          }
        });
        opts.appendChild(b);
      });

      wrap.appendChild(opts);
      host.appendChild(wrap);
    });

    setFb(fb, "Choose the most natural reply for each line.", "");
  }

  function resetDialogue(){
    renderDialogue();
  }

  /* ------------------------- Final: Pro builder ------------------------- */
  function renderProBuilder(){
    var host = $("proBuilder");
    if(!host) return;
    host.innerHTML = "";

    // Use existing CSS .field + select/textarea
    function field(label, inputEl){
      var wrap = document.createElement("label");
      wrap.className = "field";
      var sp = document.createElement("span");
      sp.className = "field__label";
      sp.textContent = label;
      wrap.appendChild(sp);
      wrap.appendChild(inputEl);
      return wrap;
    }
    function mkSelect(id, opts){
      var s = document.createElement("select");
      s.id = id;
      opts.forEach(function(v){
        var o=document.createElement("option");
        o.value=v; o.textContent=v;
        s.appendChild(o);
      });
      return s;
    }
    function mkInput(id, placeholder){
      var i = document.createElement("input");
      i.id = id;
      i.type = "text";
      i.placeholder = placeholder || "";
      i.style.width = "100%";
      i.style.padding = "12px";
      i.style.borderRadius = "16px";
      i.style.border = "1px solid rgba(255,255,255,.25)";
      i.style.background = "rgba(255,255,255,.06)";
      i.style.color = "var(--ink)";
      return i;
    }

    var typeSel = mkSelect("proType", ["movie","series"]);
    var titleIn = mkInput("proTitle", "Title (example: Jaws / Stranger Things)");
    var genreSel = mkSelect("proGenre", ["thriller","comedy","drama","romance","action","sci-fi","fantasy","horror","documentary"]);
    var moodSel  = mkSelect("proMood", ["exciting","funny","dark","emotional","heartwarming","intense","relaxing"]);
    var adj1Sel  = mkSelect("proAdj1", shuffle(ADJ).slice(0,10));
    var adj2Sel  = mkSelect("proAdj2", shuffle(ADJ).slice(0,10));
    var connSel  = mkSelect("proConn", ["however","because","overall","in addition","for example","therefore"]);
    var compSel  = mkSelect("proComp", ["better than","not as good as","more interesting than","less predictable than"]);
    var recSel   = mkSelect("proRec", ["You should watch it if…","You might like it if…","I would recommend it to…"]);

    host.appendChild(field("Type", typeSel));
    host.appendChild(field("Title", titleIn));
    host.appendChild(field("Genre", genreSel));
    host.appendChild(field("Mood", moodSel));
    host.appendChild(field("Adjective #1", adj1Sel));
    host.appendChild(field("Adjective #2", adj2Sel));
    host.appendChild(field("Connector to use", connSel));
    host.appendChild(field("Comparison frame", compSel));
    host.appendChild(field("Recommendation frame", recSel));
  }

  function buildProReview(){
    var out = $("proOut");
    var fb = $("proFb");
    if(!out) return;

    var type = $("proType") ? $("proType").value : "movie";
    var title = $("proTitle") ? $("proTitle").value.trim() : "";
    var genre = $("proGenre") ? $("proGenre").value : "thriller";
    var mood  = $("proMood") ? $("proMood").value : "exciting";
    var adj1  = $("proAdj1") ? $("proAdj1").value : "interesting";
    var adj2  = $("proAdj2") ? $("proAdj2").value : "well-written";
    var conn  = $("proConn") ? $("proConn").value : "however";
    var comp  = $("proComp") ? $("proComp").value : "better than";
    var rec   = $("proRec") ? $("proRec").value : "You should watch it if…";

    if(!title){
      setFb(fb, "Add a title first.", "warn");
      safeFocus($("proTitle"));
      return;
    }

    var first = "This " + type + " is a " + genre + ". The story follows a main character who faces a challenge.";
    var second = "The atmosphere is " + mood + ", and the pace is generally good.";
    var third = "I thought it was " + adj1 + " and " + adj2 + ".";
    var fourth = (conn.charAt(0).toUpperCase()+conn.slice(1)) + ", it may not be for everyone.";
    var fifth = "In my opinion, it is " + comp + " many " + genre + "s, especially because the acting is convincing.";
    var sixth = "Overall, " + (rec.replace("…","")) + " thriller fans.";

    var text = [first, second, third, fourth, fifth, sixth].join(" ");
    out.textContent = text;

    var gained = addPoints("final.pro", 4);
    setFb(fb, gained ? "Built! +4 points. Now read it aloud." : "Built ✅", "good");
    setBadge("final", true);
  }

  function listenPro(){
    var out = $("proOut");
    if(out && out.textContent.trim()) speak(out.textContent.trim());
    else speak("Build your review first.");
  }

  function copyText(str, fbEl){
    if(!str) return;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(str).then(function(){
        if(fbEl) setFb(fbEl, "Copied ✅", "good");
      }).catch(function(){
        fallbackCopy(str, fbEl);
      });
    }else{
      fallbackCopy(str, fbEl);
    }
  }
  function fallbackCopy(str, fbEl){
    try{
      var ta = document.createElement("textarea");
      ta.value = str;
      ta.setAttribute("readonly","readonly");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if(fbEl) setFb(fbEl, "Copied ✅", "good");
    }catch(e){
      if(fbEl) setFb(fbEl, "Copy failed — you can select and copy manually.", "warn");
    }
  }

  /* ------------------------- Review checker ------------------------- */
  function renderChecklist(items){
    var host = $("reviewChecklist");
    if(!host) return;
    host.innerHTML = "";
    items.forEach(function(it){
      var row = document.createElement("div");
      row.className = "check" + (it.ok ? " is-done" : "");
      row.innerHTML =
        '<div class="tick">'+(it.ok ? "✅" : "⬜")+'</div>' +
        '<div><b>'+esc(it.label)+'</b><div class="tiny">'+esc(it.detail)+'</div></div>';
      host.appendChild(row);
    });
  }

  function countAny(text, list){
    var n = norm(text);
    var c=0;
    list.forEach(function(w){
      if(n.indexOf(norm(w)) !== -1) c++;
    });
    return c;
  }

  function hasComparison(text){
    var n = norm(text);
    // common comparison patterns
    if(n.indexOf("better than")!==-1) return true;
    if(n.indexOf("worse than")!==-1) return true;
    if(n.indexOf("more")!==-1 && n.indexOf("than")!==-1) return true;
    if(n.indexOf("less")!==-1 && n.indexOf("than")!==-1) return true;
    if(n.indexOf("as")!==-1 && n.indexOf("as")!==-1) return true;
    if(n.indexOf("not as")!==-1 && n.indexOf("as")!==-1) return true;
    return false;
  }

  function hasRecommendation(text){
    var n = norm(text);
    return (n.indexOf("recommend")!==-1) ||
           (n.indexOf("you should")!==-1) ||
           (n.indexOf("worth watching")!==-1) ||
           (n.indexOf("must see")!==-1) ||
           (n.indexOf("you might like")!==-1);
  }

  function checkReview(){
    var ta = $("reviewText");
    var fb = $("reviewFb");
    var prev = $("reviewPreview");
    if(!ta) return;

    var text = String(ta.value||"").trim();
    if(!text){
      setFb(fb, "Write something first 🙂", "warn");
      safeFocus(ta);
      return;
    }

    var words = text.split(/\s+/).filter(function(w){ return w.trim(); });
    var wordCount = words.length;

    var connectorWords = ["however","although","because","so","therefore","in addition","for example","overall"];
    var connectorCount = countAny(text, connectorWords);

    // adjective count: count any of ADJ list appearing
    var adjCount = countAny(text, ADJ);

    var compOk = hasComparison(text);
    var recOk = hasRecommendation(text);

    var items = [
      {label:"80+ words", ok: wordCount>=80, detail: "You wrote " + wordCount + " words."},
      {label:"2+ connectors", ok: connectorCount>=2, detail: "Found " + connectorCount + " connector(s) (example: however, because, overall)."},
      {label:"3+ adjectives", ok: adjCount>=3, detail: "Found " + adjCount + " adjective(s) from the lesson list."},
      {label:"1 comparison", ok: compOk, detail: "Look for: better than / more … than / not as … as."},
      {label:"1 recommendation", ok: recOk, detail: "Look for: recommend / you should / worth watching."}
    ];
    renderChecklist(items);

    if(prev) prev.textContent = text;

    var passed = items.every(function(i){ return i.ok; });
    if(passed){
      var gained = addPoints("final.review", 6);
      setFb(fb, gained ? "✅ Excellent! You hit all goals. +6 points. Badge earned!" : "✅ Excellent! You hit all goals.", "good");
      setBadge("final", true);
    }else{
      setFb(fb, "Almost. Use the checklist to improve, then check again.", "warn");
    }
  }

  function listenReview(){
    var ta = $("reviewText");
    speak(ta && ta.value.trim() ? ta.value.trim() : "Write a review first.");
  }

  function copyReview(){
    var ta = $("reviewText");
    copyText(ta ? ta.value : "", $("reviewFb"));
  }

  function printHTML(title, bodyHTML){
    var w = window.open("", "_blank");
    if(!w) return;
    var doc = w.document;
    doc.open();
    doc.write("<!doctype html><html><head><meta charset='utf-8'><title>"+esc(title)+"</title>");
    doc.write("<meta name='viewport' content='width=device-width, initial-scale=1'>");
    doc.write("<style>body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding:24px; line-height:1.5;} h1{font-size:20px;} .box{margin-top:12px; white-space:pre-wrap;}</style>");
    doc.write("</head><body>");
    doc.write("<h1>"+esc(title)+"</h1>");
    doc.write(bodyHTML);
    doc.write("</body></html>");
    doc.close();
    try{
      w.focus();
      w.print();
    }catch(e){}
  }

  function printGrammar(){
    // Print the "tenses map" + connectors + comparison frames
    var htmlParts = [];
    htmlParts.push("<div class='box'><b>Tenses</b><br>Plot summary → Present Simple<br>Finished time → Past Simple<br>Experience/no time → Present Perfect<br>Now → Present Continuous</div>");
    htmlParts.push("<div class='box'><b>Connectors</b><br>"+CONNECTORS.map(function(c){ return c.w+" = "+c.fr+" ("+c.tip+")"; }).join("<br>")+"</div>");
    htmlParts.push("<div class='box'><b>Comparison frames</b><br>better than / worse than<br>more … than / less … than<br>not as … as</div>");
    printHTML("Entertainment Grammar Wrap-up", htmlParts.join(""));
  }

  function printReview(){
    var ta = $("reviewText");
    var txt = ta ? (ta.value||"").trim() : "";
    if(!txt){
      setFb($("reviewFb"), "Write a review first, then Print.", "warn");
      return;
    }
    printHTML("My Review", "<div class='box'>"+esc(txt).replace(/\n/g,"<br>")+"</div>");
  }

  /* ------------------------- Timer (1 minute) ------------------------- */
  var timerOn = false;
  var timerInt = null;
  var timerLeft = 60;

  function showTimer(show){
    var t = $("timer");
    if(!t) return;
    if(show) t.removeAttribute("hidden");
    else t.setAttribute("hidden","hidden");
  }

  function resetTimer(){
    timerOn = false;
    timerLeft = 60;
    setText($("timerNum"), String(timerLeft));
    if(timerInt){ clearInterval(timerInt); timerInt = null; }
  }

  function startTimer(){
    if(timerOn) return;
    timerOn = true;
    if(timerInt) clearInterval(timerInt);
    timerInt = setInterval(function(){
      timerLeft--;
      if(timerLeft < 0) timerLeft = 0;
      setText($("timerNum"), String(timerLeft));
      if(timerLeft <= 0){
        stopTimer();
        speak("Time! Great job.");
      }
    }, 1000);
  }

  function stopTimer(){
    timerOn = false;
    if(timerInt){ clearInterval(timerInt); timerInt = null; }
  }

  /* ------------------------- Hints mapping ------------------------- */
  var HINTS = {
    pair: "Tip: read the definition carefully. Look for key words like speed (pace), mood (atmosphere), and camera work (cinematography).",
    tenseQuiz: "Hint: Plot summary → Present Simple. Finished time → Past Simple. Experience → Present Perfect. Now → Present Continuous.",
    connectorFill: "Hint: however/although = contrast • because = reason • overall = conclusion • in addition = add info.",
    politeQuiz: "Hint: Use softeners: I think, in my opinion, to be honest. Avoid spoilers and insults.",
    dialogueGame: "Hint: Best replies are polite + clear + connector + spoiler-free."
  };

  function showHint(target){
    if(target === "pair"){
      setFb($("pairFb"), HINTS.pair, "warn");
      return;
    }
    if(target === "tenseQuiz"){
      setFb($("tenseQuizFb"), HINTS.tenseQuiz, "warn");
      return;
    }
    if(target === "connectorFill"){
      hintConnectors();
      return;
    }
    if(target === "politeQuiz"){
      setFb($("politeQuizFb"), HINTS.politeQuiz, "warn");
      return;
    }
    if(target === "dialogueGame"){
      setFb($("dialogueFb"), HINTS.dialogueGame, "warn");
      return;
    }
  }

  /* ------------------------- Section resets ------------------------- */
  function resetSection(name){
    if(name==="warmup"){
      warmupLocked=false;
      warmupChoices={tone:null, detail:null, vibe:null};
      renderWarmupPickers();
      resetBuilder("spoilerSafe");
      setFb($("warmupFb"), "", "");
      setBadge("warmup", false);
    }
    if(name==="vocab"){
      activeTab="plot";
      renderTabs();
      renderFlashcards();
      renderPairGame();
      setBadge("vocab", false);
    }
    if(name==="grammar"){
      renderQuiz("tenseQuiz", tenseQuestions);
      setFb($("tenseQuizFb"), "", "");
      renderConnectorFill();
      renderCompareBuilder();
      setText($("compareOut"), "");
      setFb($("compareFb"), "", "");
      setBadge("grammar", false);
    }
    if(name==="actor"){
      resetActor();
      renderQuiz("politeQuiz", politeQuestions);
      setFb($("politeQuizFb"), "", "");
      setBadge("critic", false);
    }
    if(name==="dialogue"){
      renderDialogue();
      setBadge("critic", false);
    }
    if(name==="final"){
      renderProBuilder();
      setText($("proOut"), "");
      setFb($("proFb"), "", "");
      var ta=$("reviewText");
      if(ta) ta.value="";
      setText($("reviewPreview"), "");
      setFb($("reviewFb"), "", "");
      if($("reviewChecklist")) $("reviewChecklist").innerHTML="";
      setBadge("final", false);
    }
  }

  function resetAll(){
    state.score = 0;
    state.earned = {};
    state.doneBadges = {};
    saveState();
    setText($("score"), "0");
    restoreBadges(); // clears badges
    // Reset sections
    resetSection("warmup");
    resetSection("vocab");
    resetSection("grammar");
    resetSection("actor");
    resetSection("dialogue");
    resetSection("final");
    // Timer and voice status
    resetTimer();
    showTimer(false);
    setVoiceStatus("Voice: " + (state.voiceEnabled ? "ready" : "OFF") + " (" + esc(state.accent) + ").");
  }

  /* ------------------------- Wire UI ------------------------- */
  function bind(){
    // Accent toggle
    var btnUS = $("btnUS"), btnUK = $("btnUK");
    function setAccent(a){
      state.accent = a;
      if(btnUS && btnUK){
        btnUS.classList.toggle("is-active", a==="US");
        btnUK.classList.toggle("is-active", a==="UK");
        btnUS.setAttribute("aria-pressed", a==="US" ? "true" : "false");
        btnUK.setAttribute("aria-pressed", a==="UK" ? "true" : "false");
      }
      saveState();
      initVoices();
    }
    if(btnUS) btnUS.addEventListener("click", function(){ setAccent("US"); });
    if(btnUK) btnUK.addEventListener("click", function(){ setAccent("UK"); });

    // Voice controls
    var enableBtn = $("btnEnableVoice");
    var testBtn = $("btnTestVoice");
    if(enableBtn){
      enableBtn.addEventListener("click", function(){
        state.voiceEnabled = true;
        saveState();
        initVoices();
        speak("Voice enabled.");
      });
    }
    if(testBtn){
      testBtn.addEventListener("click", function(){
        state.voiceEnabled = true;
        saveState();
        initVoices();
        speak("Test. Hello! This is " + (state.accent==="UK" ? "British" : "American") + " English.");
      });
    }

    // Global actions
    var btnResetAll = $("btnResetAll");
    if(btnResetAll) btnResetAll.addEventListener("click", resetAll);

    var btnIntro = $("btnIntro");
    if(btnIntro) btnIntro.addEventListener("click", function(){ speak(miniIntroText()); });

    var btnPrintGrammar = $("btnPrintGrammar");
    if(btnPrintGrammar) btnPrintGrammar.addEventListener("click", printGrammar);

    var btnFrames = $("btnFrames");
    if(btnFrames) btnFrames.addEventListener("click", function(){ speak(framesText()); });

    // Timer toggle
    var btnTimer60 = $("btnTimer60");
    if(btnTimer60){
      btnTimer60.addEventListener("click", function(){
        showTimer(true);
        resetTimer();
      });
    }
    var btnStart = $("btnStartTimer");
    var btnStop = $("btnStopTimer");
    if(btnStart) btnStart.addEventListener("click", startTimer);
    if(btnStop) btnStop.addEventListener("click", function(){ stopTimer(); resetTimer(); });

    // Warmup actions
    var btnWarmupCheck = $("btnWarmupCheck");
    var btnWarmupListen = $("btnWarmupListen");
    if(btnWarmupCheck) btnWarmupCheck.addEventListener("click", lockWarmup);
    if(btnWarmupListen) btnWarmupListen.addEventListener("click", function(){
      if(!warmupChoices.tone || !warmupChoices.detail || !warmupChoices.vibe){
        speak("Choose one option in each line first.");
        return;
      }
      speak(warmupSummary());
    });

    // Builder buttons (generic)
    qa("[data-check-builder]").forEach(function(b){
      b.addEventListener("click", function(){
        var name = b.getAttribute("data-check-builder");
        checkBuilder(name);
      });
    });
    qa("[data-listen-builder]").forEach(function(b){
      b.addEventListener("click", function(){
        var name = b.getAttribute("data-listen-builder");
        var s = getBuiltSentence(name);
        speak(s || "Build a sentence first.");
      });
    });
    qa("[data-reset-builder]").forEach(function(b){
      b.addEventListener("click", function(){
        var name = b.getAttribute("data-reset-builder");
        resetBuilder(name);
      });
    });

    // Tabs
    qa(".tab").forEach(function(btn){
      btn.addEventListener("click", function(){
        activeTab = btn.getAttribute("data-tab") || "plot";
        renderTabs();
        renderFlashcards();
      });
    });

    // Pair reset
    qa("[data-reset-pair]").forEach(function(b){
      b.addEventListener("click", function(){ renderPairGame(); });
    });

    // Quiz resets
    qa("[data-reset-quiz]").forEach(function(b){
      b.addEventListener("click", function(){
        var id = b.getAttribute("data-reset-quiz");
        resetQuiz(id);
      });
    });

    // Hints
    qa("[data-hint]").forEach(function(b){
      b.addEventListener("click", function(){
        var target = b.getAttribute("data-hint");
        showHint(target);
      });
    });

    // Say buttons (models)
    qa("[data-say]").forEach(function(b){
      b.addEventListener("click", function(){
        var key = b.getAttribute("data-say");
        speak(MODELS[key] || "Listen.");
      });
    });

    // Grammar: connectors
    var btnCheckConnectors = $("btnCheckConnectors");
    var btnListenConnectors = $("btnListenConnectors");
    var btnResetConnectors = $("btnResetConnectors");
    if(btnCheckConnectors) btnCheckConnectors.addEventListener("click", checkConnectors);
    if(btnListenConnectors) btnListenConnectors.addEventListener("click", listenConnectorsModel);
    if(btnResetConnectors) btnResetConnectors.addEventListener("click", resetConnectors);

    // Grammar: comparisons
    var btnBuildCompare = $("btnBuildCompare");
    var btnListenCompare = $("btnListenCompare");
    var btnResetCompare = $("btnResetCompare");
    if(btnBuildCompare) btnBuildCompare.addEventListener("click", buildComparison);
    if(btnListenCompare) btnListenCompare.addEventListener("click", listenComparison);
    if(btnResetCompare) btnResetCompare.addEventListener("click", resetComparison);

    // Actor stars
    var stars = $("stars");
    if(stars){
      qa(".star", stars).forEach(function(b){
        b.addEventListener("click", function(){
          var n = parseInt(b.getAttribute("data-star"),10);
          setStars(n);
        });
      });
    }

    // Actor build/listen/reset
    var btnBuildActor = $("btnBuildActor");
    var btnListenActor = $("btnListenActor");
    var btnResetActor = $("btnResetActor");
    if(btnBuildActor) btnBuildActor.addEventListener("click", buildActorSentence);
    if(btnListenActor) btnListenActor.addEventListener("click", listenActor);
    if(btnResetActor) btnResetActor.addEventListener("click", resetActor);

    // Dialogue reset
    var btnResetDialogue = $("btnResetDialogue");
    if(btnResetDialogue) btnResetDialogue.addEventListener("click", resetDialogue);

    // Final pro builder
    var btnBuildPro = $("btnBuildPro");
    var btnListenPro = $("btnListenPro");
    var btnCopyPro = $("btnCopyPro");
    if(btnBuildPro) btnBuildPro.addEventListener("click", buildProReview);
    if(btnListenPro) btnListenPro.addEventListener("click", listenPro);
    if(btnCopyPro) btnCopyPro.addEventListener("click", function(){
      var txt = $("proOut") ? $("proOut").textContent : "";
      copyText(txt, $("proFb"));
    });

    // Review checker
    var btnCheckReview = $("btnCheckReview");
    var btnListenReview = $("btnListenReview");
    var btnCopyReview = $("btnCopyReview");
    var btnPrintReview = $("btnPrintReview");
    if(btnCheckReview) btnCheckReview.addEventListener("click", checkReview);
    if(btnListenReview) btnListenReview.addEventListener("click", listenReview);
    if(btnCopyReview) btnCopyReview.addEventListener("click", copyReview);
    if(btnPrintReview) btnPrintReview.addEventListener("click", printReview);

    // Section reset buttons
    qa("[data-reset-section]").forEach(function(b){
      b.addEventListener("click", function(){
        var s = b.getAttribute("data-reset-section");
        resetSection(s);
      });
    });

    // Keyboard support: allow ESC to stop speech
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape"){
        try{ synth && synth.cancel && synth.cancel(); }catch(err){}
      }
    });
  }

  /* ------------------------- Init ------------------------- */
  function init(){
    loadState();
    setText($("score"), String(state.score || 0));

    // Apply accent button states
    var btnUS = $("btnUS"), btnUK = $("btnUK");
    if(btnUS && btnUK){
      btnUS.classList.toggle("is-active", state.accent==="US");
      btnUK.classList.toggle("is-active", state.accent==="UK");
      btnUS.setAttribute("aria-pressed", state.accent==="US" ? "true" : "false");
      btnUK.setAttribute("aria-pressed", state.accent==="UK" ? "true" : "false");
    }

    restoreBadges();

    // Render all UI
    renderWarmupPickers();
    renderBuilder("spoilerSafe");

    renderTabs();
    renderFlashcards();
    renderPairGame();

    renderQuiz("tenseQuiz", tenseQuestions);
    renderConnectorFill();
    renderCompareBuilder();

    renderActorBuilder();
    renderStars();
    renderQuiz("politeQuiz", politeQuestions);

    renderDialogue();

    renderProBuilder();

    initVoices();
    bind();

    // voices may arrive async
    if(canSpeak() && synth){
      synth.onvoiceschanged = function(){ initVoices(); };
      // iOS sometimes needs a tick
      setTimeout(initVoices, 250);
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }

})();
