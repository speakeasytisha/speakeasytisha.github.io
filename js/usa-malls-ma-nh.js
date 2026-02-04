/* SpeakEasyTisha — US Malls (MA + NH) — interactive lesson JS
   Works on Mac + iPad Safari.  ES5-compatible. */
(function(){
  "use strict";

  /* -------------------- tiny helpers -------------------- */
  function $(id){ return document.getElementById(id); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function esc(s){
    return String(s==null?"":s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function norm(s){ return String(s||"").toLowerCase().trim(); }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  /* -------------------- state (lang / voice / help) -------------------- */
  var prefs = { lang:"en", voice:"us", help:"on" };
  try{
    var raw = localStorage.getItem("SET_malls_prefs");
    if(raw){ var p = JSON.parse(raw); if(p){ prefs.lang=p.lang||prefs.lang; prefs.voice=p.voice||prefs.voice; prefs.help=p.help||prefs.help; } }
  }catch(e){}

  function savePrefs(){
    try{ localStorage.setItem("SET_malls_prefs", JSON.stringify(prefs)); }catch(e){}
  }

  function setSegOn(groupSel, dataKey, value){
    qsa(groupSel + " .seg__btn").forEach(function(btn){
      btn.classList.toggle("is-on", btn.getAttribute(dataKey)===value);
    });
  }

  function applyLang(){
    // Rule: chosen language always visible. "French help" toggle = show the other language too.
    var lang = prefs.lang;
    var help = prefs.help;
    qsa(".en").forEach(function(el){
      var show = (lang==="en") || (help==="on" && lang==="fr");
      el.style.display = show ? "inline" : "none";
    });
    qsa(".fr").forEach(function(el){
      var show = (lang==="fr") || (help==="on" && lang==="en");
      el.style.display = show ? "inline" : "none";
    });
  }

  function bindLangControls(){
    // Language
    qsa('[data-lang]').forEach(function(btn){
      btn.addEventListener("click", function(){
        prefs.lang = btn.getAttribute("data-lang") || "en";
        setSegOn('[aria-label="Language toggle"]', "data-lang", prefs.lang);
        savePrefs(); applyLang();
        toast(prefs.lang==="fr" ? "Langue: FR" : "Language: EN", true);
      });
    });
    // Voice
    qsa('[data-voice]').forEach(function(btn){
      btn.addEventListener("click", function(){
        prefs.voice = btn.getAttribute("data-voice") || "us";
        setSegOn('[aria-label="Voice toggle"]', "data-voice", prefs.voice);
        savePrefs();
        toast(prefs.voice==="uk" ? "Voice: UK" : "Voice: US", true);
      });
    });
    // Help toggle
    qsa('[data-frhelp]').forEach(function(btn){
      btn.addEventListener("click", function(){
        prefs.help = btn.getAttribute("data-frhelp") || "on";
        setSegOn('[aria-label="French help toggle"]', "data-frhelp", prefs.help);
        savePrefs(); applyLang();
        toast(prefs.help==="off" ? "Translations off" : "Translations on", true);
      });
    });

    // Restore UI
    setSegOn('[aria-label="Language toggle"]', "data-lang", prefs.lang);
    setSegOn('[aria-label="Voice toggle"]', "data-voice", prefs.voice);
    setSegOn('[aria-label="French help toggle"]', "data-frhelp", prefs.help);
  }

  /* -------------------- toast -------------------- */
  var toastTimer = null;
  function toast(msg, ok){
    var t = $("toast");
    if(!t) return;
    t.textContent = msg;
    t.classList.toggle("is-ok", !!ok);
    t.classList.add("is-on");
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove("is-on"); }, 2200);
  }

  /* -------------------- speech (US/UK) -------------------- */
  var voiceCache = null;
  function pickVoice(){
    if(!("speechSynthesis" in window)) return null;
    var voices = [];
    try{ voices = speechSynthesis.getVoices() || []; }catch(e){ voices=[]; }
    if(!voices.length) return null;

    var target = (prefs.voice==="uk") ? "en-GB" : "en-US";
    // 1) exact match
    for(var i=0;i<voices.length;i++){
      if((voices[i].lang||"").toLowerCase() === target.toLowerCase()) return voices[i];
    }
    // 2) startsWith en-gb / en-us
    for(var j=0;j<voices.length;j++){
      if(((voices[j].lang||"").toLowerCase()).indexOf(target.toLowerCase())===0) return voices[j];
    }
    // 3) any english
    for(var k=0;k<voices.length;k++){
      if(((voices[k].lang||"").toLowerCase()).indexOf("en")===0) return voices[k];
    }
    return voices[0] || null;
  }

  function speak(text){
    if(!text) return;
    if(!("speechSynthesis" in window)){ toast("Speech not supported.", false); return; }
    try{ speechSynthesis.cancel(); }catch(e){}
    var u = new SpeechSynthesisUtterance(String(text));
    u.rate = 1.0;
    u.pitch = 1.0;
    u.lang = (prefs.voice==="uk") ? "en-GB" : "en-US";
    try{
      if(!voiceCache) voiceCache = pickVoice();
      if(voiceCache) u.voice = voiceCache;
    }catch(e){}
    try{ speechSynthesis.speak(u); }catch(e){ toast("Speech error.", false); }
  }

  function bindSpeakButtons(){
    qsa("[data-speak]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var sel = btn.getAttribute("data-speak");
        var el = sel ? document.querySelector(sel) : null;
        var txt = el ? (el.textContent||"") : "";
        txt = String(txt).replace(/\s+/g," ").trim();
        if(!txt){ toast("Nothing to read.", false); return; }
        speak(txt);
      });
    });
    if("speechSynthesis" in window){
      try{ speechSynthesis.onvoiceschanged = function(){ voiceCache = pickVoice(); }; }catch(e){}
    }
  }

  /* -------------------- score -------------------- */
  var SCORE_KEY = "SET_malls_score_v1";
  var score = { pts:0, streak:0 };

  function renderScore(){
    if($("pts")) $("pts").textContent = String(score.pts||0);
    if($("streak")) $("streak").textContent = String(score.streak||0);
    if($("saved")){
      $("saved").classList.add("is-on");
      setTimeout(function(){ $("saved").classList.remove("is-on"); }, 900);
    }
  }
  function loadScore(){
    try{
      var raw = localStorage.getItem(SCORE_KEY);
      if(raw){ var s=JSON.parse(raw); if(s){ score.pts=+s.pts||0; score.streak=+s.streak||0; } }
    }catch(e){}
    renderScore();
  }
  function saveScore(){
    try{ localStorage.setItem(SCORE_KEY, JSON.stringify(score)); }catch(e){}
    renderScore();
  }
  function addScore(correct){
    if(correct){ score.pts += 5; score.streak += 1; }
    else { score.pts = Math.max(0, score.pts - 1); score.streak = 0; }
    saveScore();
  }

  /* -------------------- data -------------------- */
  var MALLS = [
    { state:"MA", name:"Natick Mall", city:"Natick", vibe:["indoor"], bestFor:["family","teens","rainy"], tags:["big","popular"], why:"One of the biggest malls near Boston suburbs. Great variety + indoor comfort." },
    { state:"MA", name:"Burlington Mall", city:"Burlington", vibe:["indoor","luxury"], bestFor:["teens","adults","rainy"], tags:["upscale","food"], why:"A strong mix of fashion + nicer dining options; good for teens & adults." },
    { state:"MA", name:"South Shore Plaza", city:"Braintree", vibe:["indoor"], bestFor:["family","teens","rainy"], tags:["largest","brands"], why:"Major South Shore destination with lots of big-name stores." },
    { state:"MA", name:"Northshore Mall", city:"Peabody", vibe:["indoor"], bestFor:["family","teens","rainy"], tags:["north-shore","food"], why:"Good all-around mall for families; convenient for the North Shore." },
    { state:"MA", name:"Prudential Center", city:"Boston", vibe:["city","indoor"], bestFor:["adults","teens","rainy"], tags:["downtown","access"], why:"City shopping connected to transit; easy to combine with museums or sightseeing." },
    { state:"MA", name:"Copley Place", city:"Boston", vibe:["city","luxury","indoor"], bestFor:["adults","rainy"], tags:["luxury","connected"], why:"Upscale indoor shopping — perfect on cold/rainy days in Boston." },
    { state:"MA", name:"Assembly Row", city:"Somerville", vibe:["outdoor","city"], bestFor:["family","teens"], tags:["restaurants","walkable"], why:"Outdoor lifestyle area with shops + lots of food choices and a fun vibe." },
    { state:"MA", name:"Faneuil Hall Marketplace", city:"Boston", vibe:["city"], bestFor:["family","teens"], tags:["touristy","street-food"], why:"Historic, walkable city market area — great for visitors and families." },

    { state:"NH", name:"Mall of New Hampshire", city:"Manchester", vibe:["indoor"], bestFor:["family","teens","rainy"], tags:["central","easy"], why:"Main indoor mall in NH — practical for errands, food court, and teen hangouts." },
    { state:"NH", name:"Pheasant Lane Mall", city:"Nashua", vibe:["indoor"], bestFor:["family","teens","rainy"], tags:["border","convenient"], why:"Very popular (especially for MA shoppers) and easy for families." },
    { state:"NH", name:"Merrimack Premium Outlets", city:"Merrimack", vibe:["outlet","outdoor"], bestFor:["budget","adults","teens"], tags:["deals","brands"], why:"Great for deals — lots of brands in one place (dress for outdoor walking)." },
    { state:"NH", name:"The Mall at Rockingham Park", city:"Salem", vibe:["indoor"], bestFor:["family","teens","rainy"], tags:["near-mass","convenient"], why:"Convenient Salem NH stop — often combined with other shopping in the area." }
  ];

  var VOCAB = {
    "Store types (types de boutiques)" : [
      {icon:"👟", en:"shoe store", fr:"magasin de chaussures", def:"A store that sells shoes.", ex:"Do you have these shoes in a different size?"},
      {icon:"👕", en:"clothing store", fr:"magasin de vêtements", def:"A store for clothes.", ex:"I'm looking for a winter coat."},
      {icon:"💄", en:"beauty store", fr:"magasin de beauté", def:"Makeup, skincare, perfumes.", ex:"Could you recommend a good moisturizer?"},
      {icon:"📱", en:"electronics store", fr:"magasin d'électronique", def:"Phones, headphones, devices.", ex:"Do you have a charger for this phone?"},
      {icon:"🧸", en:"toy store", fr:"magasin de jouets", def:"Toys and games for kids.", ex:"My child wants a board game."},
      {icon:"📚", en:"bookstore", fr:"librairie", def:"Books, magazines, gifts.", ex:"Where is the travel section?"},
      {icon:"🛒", en:"department store", fr:"grand magasin", def:"Large store selling many categories.", ex:"You can find everything there."},
      {icon:"💍", en:"jewelry store", fr:"bijouterie", def:"Jewelry and watches.", ex:"I'm looking for a simple necklace."}
    ],
    "Food & drink (restauration)" : [
      {icon:"🍔", en:"food court", fr:"aire de restauration", def:"Many fast-food options in one area.", ex:"Let's eat at the food court."},
      {icon:"🧋", en:"bubble tea", fr:"thé aux perles", def:"Sweet tea with tapioca pearls.", ex:"My teen loves bubble tea."},
      {icon:"🍕", en:"slice", fr:"part (pizza)", def:"One piece of pizza.", ex:"Could I get a slice of pepperoni?"},
      {icon:"🥗", en:"sit-down restaurant", fr:"restaurant assis", def:"A table-service restaurant.", ex:"We want a sit-down meal today."},
      {icon:"☕", en:"coffee shop", fr:"café", def:"Coffee, snacks, sometimes sandwiches.", ex:"Can I get a latte to go?"},
      {icon:"🍦", en:"ice cream stand", fr:"stand de glaces", def:"A small place selling ice cream.", ex:"Let's get ice cream after shopping."}
    ],
    "Activities & kids (activités)" : [
      {icon:"🎬", en:"movie theater", fr:"cinéma", def:"Place to watch movies.", ex:"Do you want to see a movie later?"},
      {icon:"🕹️", en:"arcade", fr:"salle d'arcade", def:"Games (often coin/card operated).", ex:"The kids want to play in the arcade."},
      {icon:"🧒", en:"indoor play area", fr:"aire de jeux intérieure", def:"Play space for younger kids.", ex:"Is there an indoor play area?"},
      {icon:"🎡", en:"pop-up event", fr:"événement temporaire", def:"A temporary activity or stand.", ex:"They have a pop-up event today."},
      {icon:"📸", en:"photo booth", fr:"cabine photo", def:"Small booth for quick photos.", ex:"Let's take a photo booth picture!"}
    ],
    "Services (services)" : [
      {icon:"🧾", en:"receipt", fr:"ticket de caisse", def:"Paper or email proof of purchase.", ex:"Keep the receipt for returns."},
      {icon:"↩️", en:"returns / exchanges", fr:"retours / échanges", def:"When you bring an item back.", ex:"I need to return this jacket."},
      {icon:"🎁", en:"gift card", fr:"carte cadeau", def:"Prepaid card used as payment.", ex:"I received a gift card for my birthday."},
      {icon:"🅿️", en:"parking garage", fr:"parking couvert", def:"Multi-level parking structure.", ex:"We parked in the garage."},
      {icon:"ℹ️", en:"customer service desk", fr:"accueil / service client", def:"Help desk for questions and issues.", ex:"Where is the customer service desk?"},
      {icon:"🚻", en:"restroom", fr:"toilettes", def:"Bathroom.", ex:"Where is the nearest restroom?"}
    ]
  };

  /* -------------------- Mall 101 chips -------------------- */
  function initMall101(){
    if(!$("mall101Chips")) return;
    // create output area if the HTML does not include it
    if(!$("mallWordsOut")){
      var out = document.createElement("div");
      out.id = "mallWordsOut";
      out.className = "note";
      $("mall101Chips").insertAdjacentElement("afterend", out);
    }

    var words = [
      {w:"shopping mall", fr:"centre commercial", def:"A large building with many stores inside."},
      {w:"anchor store", fr:"magasin “locomotive”", def:"A big store that attracts people (e.g., a department store)."},
      {w:"food court", fr:"aire de restauration", def:"Many fast food places together."},
      {w:"kiosk", fr:"stand / kiosque", def:"Small stand in the middle of the walkway."},
      {w:"outlet", fr:"magasin d'usine / outlet", def:"Stores selling discounted items."},
      {w:"returns", fr:"retours", def:"Bringing something back to the store."},
      {w:"store credit", fr:"avoir", def:"Credit you can spend in the store instead of cash."},
      {w:"sale", fr:"soldes / promo", def:"Discounted prices."}
    ];

    $("mall101Chips").innerHTML = words.map(function(o, i){
      return '<button type="button" class="chip" data-w="'+i+'">'+esc(o.w)+'</button>';
    }).join("");

    function show(i){
      var o = words[i];
      if(!o) return;
      $("mallWordsOut").innerHTML =
        "<b>"+esc(o.w)+"</b> — "+esc(o.def)+"<br><span class='muted'>FR: "+esc(o.fr)+"</span>";
      addScore(true);
    }

    $("mall101Chips").addEventListener("click", function(e){
      var b = e.target.closest(".chip"); if(!b) return;
      show(parseInt(b.getAttribute("data-w"),10));
    });

    if($("showMallWords")){
      $("showMallWords").addEventListener("click", function(){ show(0); toast("Tap the chips ✨", true); });
    }
  }

  /* -------------------- Type cards -------------------- */
  function initTypeCards(){
    if(!$("typeCards")) return;
    var types = [
      {icon:"🏬", name:"Indoor mall", text:"One big building with many stores inside.", fr:"Grand bâtiment avec des boutiques à l'intérieur."},
      {icon:"🌿", name:"Outdoor / lifestyle", text:"Open-air shopping streets (often restaurants).", fr:"Zone shopping extérieure (souvent restaurants)."},
      {icon:"🏷️", name:"Outlets", text:"Discount brands — great for deals.", fr:"Marques à prix réduits — idéal pour les bons plans."},
      {icon:"🏙️", name:"City shopping", text:"Shopping in downtown areas (walk + transit).", fr:"Shopping en ville (à pied + transports)."},
      {icon:"💎", name:"Luxury", text:"More upscale brands and nicer dining.", fr:"Marques plus haut de gamme et restos plus “chic”."},
      {icon:"🧒", name:"Family friendly", text:"Play areas, easy food, strollers.", fr:"Aires de jeux, repas faciles, poussettes."},
      {icon:"🧑‍🤝‍🧑", name:"Teen hangout", text:"Friends + food + browsing in one place.", fr:"Amis + manger + flâner au même endroit."},
      {icon:"🌧️", name:"Rainy-day plan", text:"Indoor malls are perfect when it’s cold or raining.", fr:"Les malls intérieurs sont parfaits quand il fait froid/pluie."}
    ];

    $("typeCards").innerHTML = types.map(function(t, i){
      return ''
        + '<div class="tcard" data-t="'+i+'" role="button" tabindex="0" aria-label="Tap to flip">'
        +   '<div class="ticon">'+esc(t.icon)+'</div>'
        +   '<div class="tname">'+esc(t.name)+'</div>'
        +   '<div class="ttext">'+esc(t.text)+'</div>'
        +   '<div class="tfr">'+esc(t.fr)+'</div>'
        + '</div>';
    }).join("");

    function flip(card){
      card.classList.toggle("is-flipped");
      addScore(true);
    }

    $("typeCards").addEventListener("click", function(e){
      var c = e.target.closest(".tcard"); if(!c) return;
      flip(c);
    });
    $("typeCards").addEventListener("keydown", function(e){
      if(e.key!=="Enter" && e.key!==" ") return;
      var c = e.target.closest(".tcard"); if(!c) return;
      e.preventDefault(); flip(c);
    });
  }

  /* -------------------- Finder -------------------- */
  function matchesVibe(m, vibe){
    if(!vibe || vibe==="all") return true;
    return (m.vibe||[]).indexOf(vibe) >= 0;
  }
  function matchesWho(m, who){
    if(!who || who==="all") return true;
    if(who==="kids") return m.bestFor.indexOf("family")>=0 || m.bestFor.indexOf("kids")>=0;
    if(who==="teens") return m.bestFor.indexOf("teens")>=0;
    if(who==="rainy") return m.bestFor.indexOf("rainy")>=0 || (m.vibe||[]).indexOf("indoor")>=0;
    if(who==="budget") return (m.tags||[]).indexOf("deals")>=0 || (m.vibe||[]).indexOf("outlet")>=0;
    return true;
  }

  function renderMall(m){
    var tags = (m.tags||[]).slice(0,6).map(function(t){ return '<span class="tag">'+esc(t)+'</span>'; }).join("");
    var vibe = (m.vibe||[]).map(function(v){ return '<span class="tag">'+esc(v)+'</span>'; }).join("");
    var stateLine = m.city + ", " + m.state;
    var tip = (m.state==="NH") ? "Tip: NH has no sales tax — great for big purchases." : "Tip: MA has sales tax — check total at checkout.";
    return ''
      + '<article class="mall">'
      +   '<div class="mall__top">'
      +     '<div>'
      +       '<div class="mall__name">'+esc(m.name)+'</div>'
      +       '<div class="mall__loc">'+esc(stateLine)+'</div>'
      +     '</div>'
      +     '<button class="btn btn--ghost" type="button" data-say="'+esc("I recommend " + m.name + " in " + m.city + ". " + tip)+'">🔊</button>'
      +   '</div>'
      +   '<div class="tags">'+vibe+tags+'</div>'
      +   '<div class="mall__why">'+esc(m.why)+'</div>'
      + '</article>';
  }

  function initFinder(){
    if(!$("mallResults") || !$("stateSel") || !$("vibeSel") || !$("whoSel") || !$("q")) return;

    function update(){
      var st = $("stateSel").value || "all";
      var vibe = $("vibeSel").value || "all";
      var who = $("whoSel").value || "all";
      var q = norm($("q").value);

      var list = MALLS.filter(function(m){
        if(st!=="all" && m.state!==st) return false;
        if(!matchesVibe(m, vibe)) return false;
        if(!matchesWho(m, who)) return false;
        if(q){
          var hay = norm(m.name+" "+m.city+" "+m.state+" "+(m.tags||[]).join(" ")+" "+(m.why||""));
          if(hay.indexOf(q) < 0) return false;
        }
        return true;
      });

      $("mallResults").innerHTML = list.map(renderMall).join("") || '<div class="note">No matches. Try “all” or clear filters.</div>';
      if($("resultsMeta")){
        $("resultsMeta").innerHTML =
          '<span class="pill">'+list.length+' result'+(list.length===1?"":"s")+'</span>'
          + '<span class="pill pill--ok">'+esc((st==="NH") ? "NH = no sales tax" : (st==="MA") ? "MA = sales tax" : "Compare MA vs NH")+'</span>';
      }
    }

    // Filter change handlers
    ["stateSel","vibeSel","whoSel","q"].forEach(function(id){
      var el=$(id); if(!el) return;
      var evt = (id==="q") ? "input" : "change";
      el.addEventListener(evt, update);
    });

    if($("clearFilters")){
      $("clearFilters").addEventListener("click", function(){
        $("stateSel").value="all";
        $("vibeSel").value="all";
        $("whoSel").value="all";
        $("q").value="";
        update();
        toast("Filters cleared.", true);
      });
    }

    // Speak buttons inside mall cards
    $("mallResults").addEventListener("click", function(e){
      var b = e.target.closest("[data-say]"); if(!b) return;
      var txt = b.getAttribute("data-say");
      speak(txt);
    });

    update();
  }

  /* -------------------- Flashcards -------------------- */
  var deck = [];
  var deckIdx = 0;

  function buildDeck(cat){
    var arr = VOCAB[cat] || [];
    deck = arr.slice();
    deckIdx = 0;
  }
  function showCard(i){
    if(!deck.length) return;
    deckIdx = (i + deck.length) % deck.length;
    var c = deck[deckIdx];

    if($("fcIcon")) $("fcIcon").textContent = c.icon || "🛍️";
    if($("fcWord")) $("fcWord").textContent = c.en || "";
    if($("fcDef")) $("fcDef").textContent = c.def || "";
    if($("fcEx")) $("fcEx").textContent = c.ex ? ("Example: " + c.ex) : "";
    if($("fcFr")) $("fcFr").textContent = c.fr ? ("FR: " + c.fr) : "";

    if($("flashcard")) $("flashcard").classList.remove("is-flipped");
  }

  function initVocab(){
    if(!$("vocabCat") || !$("flashcard")) return;

    var cats = Object.keys(VOCAB);
    $("vocabCat").innerHTML = cats.map(function(c){ return '<option value="'+esc(c)+'">'+esc(c)+'</option>'; }).join("");
    buildDeck(cats[0]);
    showCard(0);

    $("vocabCat").addEventListener("change", function(){
      buildDeck($("vocabCat").value);
      showCard(0);
      toast("Category loaded.", true);
    });

    function flip(){ $("flashcard").classList.toggle("is-flipped"); addScore(true); }

    $("flashcard").addEventListener("click", flip);
    $("flashcard").addEventListener("keydown", function(e){
      if(e.key==="Enter" || e.key===" "){ e.preventDefault(); flip(); }
    });

    if($("prevCard")) $("prevCard").addEventListener("click", function(){ showCard(deckIdx-1); });
    if($("nextCard")) $("nextCard").addEventListener("click", function(){ showCard(deckIdx+1); });
    if($("shuffleVocab")) $("shuffleVocab").addEventListener("click", function(){
      deck = shuffle(deck); deckIdx=0; showCard(0);
      toast("Shuffled!", true);
    });
    if($("speakCard")) $("speakCard").addEventListener("click", function(){
      if(!deck.length) return;
      speak(deck[deckIdx].en || "");
    });
  }

  /* -------------------- Quiz engine -------------------- */
  var quizzes = {}; // id -> {questions:[...], answers:{qIndex: optIndex}, options:{instant:bool}}

  function makeQuiz(id, questions, options){
    var host = $(id);
    if(!host) return;

    quizzes[id] = { questions: questions, answers: {}, options: options || {} };

    var html = questions.map(function(q, qi){
      var choices = q.opts.map(function(opt, oi){
        return '<button type="button" class="choice" data-q="'+qi+'" data-i="'+oi+'">'+esc(opt)+'</button>';
      }).join("");
      return ''
        + '<div class="q" data-qi="'+qi+'">'
        +   '<div class="q__top"><div class="q__prompt">'+esc(q.q)+'</div></div>'
        +   '<div class="choices">'+choices+'</div>'
        +   '<div class="explain" data-ex="'+qi+'">'+esc(q.why||"")+'</div>'
        + '</div>';
    }).join("");

    host.innerHTML = html;

    host.addEventListener("click", function(e){
      var btn = e.target.closest(".choice");
      if(!btn) return;

      var qi = parseInt(btn.getAttribute("data-q"),10);
      var oi = parseInt(btn.getAttribute("data-i"),10);

      // mark selected (single choice)
      var qWrap = btn.closest(".q");
      qsa(".choice", qWrap).forEach(function(b){ b.classList.remove("is-selected","is-correct","is-wrong"); });
      btn.classList.add("is-selected");

      quizzes[id].answers[qi] = oi;

      if(quizzes[id].options.instant){
        // immediate feedback for that question
        evaluateOne(id, qi);
      }
    });
  }

  function evaluateOne(id, qi){
    var host = $(id);
    if(!host) return;
    var q = quizzes[id].questions[qi];
    var ans = quizzes[id].answers[qi];
    var qWrap = host.querySelector('.q[data-qi="'+qi+'"]');
    if(!qWrap) return;

    var correct = (ans === q.correct);
    qsa(".choice", qWrap).forEach(function(b){
      var oi = parseInt(b.getAttribute("data-i"),10);
      if(oi === q.correct) b.classList.add("is-correct");
      else if(oi === ans) b.classList.add("is-wrong");
    });

    var ex = qWrap.querySelector(".explain");
    if(ex) ex.classList.add("is-on");

    addScore(correct);
  }

  function checkQuiz(id){
    if(!quizzes[id]) return;
    for(var qi=0; qi<quizzes[id].questions.length; qi++){
      if(typeof quizzes[id].answers[qi] === "undefined"){
        // unanswered: count as wrong on check, but don't penalize too hard
        addScore(false);
        continue;
      }
      evaluateOne(id, qi);
    }
    toast("Checked ✓", true);
  }

  function resetQuiz(id){
    var host = $(id);
    if(!host || !quizzes[id]) return;
    quizzes[id].answers = {};
    qsa(".choice", host).forEach(function(b){ b.classList.remove("is-selected","is-correct","is-wrong"); });
    qsa(".explain", host).forEach(function(ex){ ex.classList.remove("is-on"); });
    toast("Reset.", true);
  }

  function bindQuizButtons(){
    qsa("[data-quiz-check]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-quiz-check");
        checkQuiz(id);
      });
    });
    qsa("[data-quiz-reset]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-quiz-reset");
        resetQuiz(id);
      });
    });
  }

  function initQuizzes(){
    makeQuiz("quizTax", [
      { q:"In New Hampshire (NH), sales tax is…", opts:["0% (no sales tax)","5%","10%"], correct:0, why:"NH has no state sales tax." },
      { q:"In Massachusetts (MA), sales tax is…", opts:["Usually added at checkout","Never added","Always 0%"], correct:0, why:"In MA, sales tax is usually added at checkout." }
    ]);
    makeQuiz("quizHistory", [
      { q:"Why were malls created?", opts:["To bring many stores together + easy parking","Because nobody liked shopping","Only for offices"], correct:0, why:"Malls made shopping convenient (stores + parking + weather-proof)."},
      { q:"What is an anchor store?", opts:["A big store that attracts people","A tiny kiosk","A parking space"], correct:0, why:"Anchor stores draw customers to the mall."}
    ]);
    makeQuiz("quizWhereGo", [
      { q:"You need to exchange a size.", opts:["returns / exchanges","arcade","parking garage"], correct:0, why:"Go to returns/exchanges or customer service."},
      { q:"Your kids need a break to play.", opts:["indoor play area","jewelry store","bank"], correct:0, why:"Play areas help families."},
      { q:"You want a quick snack.", opts:["food court","movie theater","shoe store"], correct:0, why:"Food court = quick snack."}
    ], {instant:true});
    makeQuiz("quizSuggest", [
      { q:"Best sentence to ask for a recommendation:", opts:["Could you recommend a good place to eat?","Give me food now.","I want everything."], correct:0, why:"'Could you…' is polite + natural."},
      { q:"If you don't want help, say:", opts:["I'm just browsing.","I'm angry.","I refuse."], correct:0, why:"Friendly and common."}
    ]);
    makeQuiz("quizPolite", [
      { q:"Most polite:", opts:["I was wondering if you could help me.","Help me.","Do it."], correct:0, why:"Softener phrase = more polite."},
      { q:"More polite request:", opts:["Could you show me where the restroom is?","Where is toilet.","Toilet now."], correct:0, why:"'Could you…?' sounds calm and polite."}
    ]);
    makeQuiz("quizComparatives", [
      { q:"This mall is ______ than that one. (more expensive)", opts:["more expensive","expensiver","most expensive"], correct:0, why:"'More + adjective' for longer adjectives."},
      { q:"NH outlets are often ______ for deals.", opts:["better","gooder","best"], correct:0, why:"Better = comparative of good."},
      { q:"South Shore Plaza is one of the ______ malls.", opts:["largest","larger","large"], correct:0, why:"One of the largest = superlative."}
    ]);
  }

  /* -------------------- Speaking challenge prompt -------------------- */
  function initSpeaking(){
    if(!$("speakChallenge")) return;
    var prompts = [
      "We're going to the mall because it's raining. We can shop, eat, and let the kids take a break.",
      "I'm looking for winter clothes and school supplies. Can you recommend the best stores?",
      "In my opinion, the best mall is the one that's closer, cleaner, and has better food options.",
      "My teen likes the mall because they can meet friends, try things on, and grab bubble tea.",
      "Could you tell me where the nearest restroom is? And do you have stroller rentals?"
    ];
    function newOne(){
      $("speakChallenge").textContent = prompts[Math.floor(Math.random()*prompts.length)];
    }
    if($("newSpeakChallenge")) $("newSpeakChallenge").addEventListener("click", newOne);
    if($("speakChallengeBtn")) $("speakChallengeBtn").addEventListener("click", function(){
      speak(($("speakChallenge").textContent||"").trim());
    });
    newOne();
  }

  /* -------------------- Practice scenario: food -------------------- */
  function initFood(){
    if(!$("genFood") || !$("foodOut")) return;

    function toGoText(v){
      if(v==="for-here") return "for here";
      if(v==="to-go") return "to go";
      return "to go";
    }

    function gen(){
      var what = $("foodWhat") ? ($("foodWhat").value || "a sandwich") : "a sandwich";
      var drink = $("foodDrink") ? ($("foodDrink").value || "water") : "water";
      var size = $("foodSize") ? ($("foodSize").value || "medium") : "medium";
      var togo = $("foodToGo") ? toGoText($("foodToGo").value) : "to go";
      var txt = "Hi! Could I get " + what + ", a " + size + " " + drink + ", " + togo + ", please? Thank you.";
      $("foodOut").textContent = txt;
      return txt;
    }

    $("genFood").addEventListener("click", function(){ gen(); toast("Generated.", true); });

    if($("copyFood")) $("copyFood").addEventListener("click", function(){
      var txt = $("foodOut").textContent.trim();
      if(!txt || txt==="Fill the form → Generate"){ toast("Generate first.", false); return; }
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(function(){ toast("Copied!", true); }, function(){ toast("Copy failed.", false); });
      }else{
        toast("Clipboard not available.", false);
      }
    });

    if($("speakFood")) $("speakFood").addEventListener("click", function(){
      var txt = $("foodOut").textContent.trim();
      if(!txt || txt==="Fill the form → Generate") txt = gen();
      speak(txt);
    });
  }

  /* -------------------- Practice scenario: returns -------------------- */
  function initReturns(){
    if(!$("genReturn") || !$("returnOut")) return;

    function reasonText(v){
      if(v==="too-small") return "it's too small";
      if(v==="too-big") return "it's too big";
      if(v==="damaged") return "it's damaged";
      if(v==="changed-mind") return "I changed my mind";
      return "it's the wrong size";
    }
    function wantText(v){
      if(v==="refund") return "a refund";
      if(v==="exchange") return "an exchange";
      if(v==="store-credit") return "store credit";
      return "a refund";
    }

    function gen(){
      var item = $("retItem") ? ($("retItem").value || "a jacket") : "a jacket";
      var reason = $("retReason") ? reasonText($("retReason").value) : "it's the wrong size";
      var want = $("retWant") ? wantText($("retWant").value) : "a refund";
      var receipt = $("retHaveReceipt") ? ($("retHaveReceipt").value==="yes") : true;

      var txt = "Hi! I'd like to return " + item + " because " + reason + ". ";
      txt += receipt ? "I have the receipt. " : "I don't have the receipt. ";
      txt += "Could I get " + want + ", please? Thank you.";

      $("returnOut").textContent = txt;
      return txt;
    }

    $("genReturn").addEventListener("click", function(){ gen(); toast("Generated.", true); });

    if($("copyReturn")) $("copyReturn").addEventListener("click", function(){
      var txt = $("returnOut").textContent.trim();
      if(!txt || txt==="Fill the form → Generate"){ toast("Generate first.", false); return; }
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(function(){ toast("Copied!", true); }, function(){ toast("Copy failed.", false); });
      }else toast("Clipboard not available.", false);
    });

    if($("speakReturn")) $("speakReturn").addEventListener("click", function(){
      var txt = $("returnOut").textContent.trim();
      if(!txt || txt==="Fill the form → Generate") txt = gen();
      speak(txt);
    });
  }

  /* -------------------- Bingo -------------------- */
  function initBingo(){
    if(!$("bingo")) return;

    var tasks = shuffle([
      "🧾 See a customer service desk",
      "🅿️ Find a parking sign",
      "👟 Walk past a shoe store",
      "👕 See a clothing store",
      "🍔 Smell the food court",
      "🧋 Spot bubble tea",
      "🧸 Find a toy store",
      "🎬 See a movie poster",
      "🕹️ Hear arcade sounds",
      "🎁 Look at gift cards",
      "💄 See a beauty store",
      "📱 Find phone cases",
      "🚻 Locate the restroom sign",
      "🛍️ Carry a shopping bag",
      "🏷️ See a SALE sign",
      "🧑‍🤝‍🧑 Spot a group of teens",
      "👶 See a stroller",
      "📚 Find a bookstore",
      "🍦 Spot ice cream",
      "🎡 Notice a pop-up kiosk",
      "📸 Find a photo booth",
      "🧑‍🍳 Smell a pretzel/cinnamon",
      "🧾 Hear 'Do you want your receipt?'",
      "🅰️ Find an 'anchor store'",
      "🧼 Find hand sanitizer"
    ]).slice(0,25);

    $("bingo").innerHTML = tasks.map(function(t, i){
      return '<button type="button" class="bcell" data-b="'+i+'">'+esc(t)+'</button>';
    }).join("");

    var marked = {};
    $("bingo").addEventListener("click", function(e){
      var b = e.target.closest(".bcell"); if(!b) return;
      var i = b.getAttribute("data-b");
      marked[i] = !marked[i];
      b.classList.toggle("is-on", !!marked[i]);
    });

    function hasLine(){
      function on(i){ return !!marked[i]; }
      for(var r=0;r<5;r++){
        var ok=true;
        for(var c=0;c<5;c++){ if(!on(r*5+c)) ok=false; }
        if(ok) return true;
      }
      for(var c2=0;c2<5;c2++){
        var ok2=true;
        for(var r2=0;r2<5;r2++){ if(!on(r2*5+c2)) ok2=false; }
        if(ok2) return true;
      }
      var d1=true, d2=true;
      for(var k=0;k<5;k++){
        if(!on(k*5+k)) d1=false;
        if(!on(k*5+(4-k))) d2=false;
      }
      return d1 || d2;
    }

    if($("bingoCheck")) $("bingoCheck").addEventListener("click", function(){
      if(hasLine()){ toast("Bingo! ✅", true); addScore(true); }
      else { toast("No 5-in-a-row yet.", false); addScore(false); }
    });

    if($("bingoReset")) $("bingoReset").addEventListener("click", function(){
      marked = {};
      qsa(".bcell", $("bingo")).forEach(function(b){ b.classList.remove("is-on"); });
      toast("Reset.", true);
    });
  }

  /* -------------------- Teen zone -------------------- */
  function initTeens(){
    if(!$("teenPollBtn") || !$("teenRating") || !$("teenPollOut")) return;

    $("teenPollBtn").addEventListener("click", function(){
      var v = parseInt($("teenRating").value||"0", 10);
      var txt = "—";
      if(v<=0){ txt="Choose a rating first."; toast("Choose a rating.", false); }
      else if(v<=2){ txt="In my opinion, the mall is not the best teen place anymore because teens prefer online shopping and other activities."; }
      else if(v===3){ txt="It depends. The mall can be fun for teens, but rules, budgets, and other options change the experience."; }
      else { txt="Yes! The mall is still great for teens because they can meet friends, eat, and try things on in one place."; }
      $("teenPollOut").textContent = txt;
      addScore(v>=3);
    });
  }

  /* -------------------- Plan generator -------------------- */
  function initPlan(){
    if(!$("genPlan") || !$("planOut") || !$("planState") || !$("planWho") || !$("planBudget") || !$("planWeather")) return;

    function gen(){
      var st = $("planState").value || "MA";
      var who = $("planWho").value || "kids";
      var budget = $("planBudget").value || "mid";
      var weather = $("planWeather").value || "any";

      var wants = [];
      qsa('#planChecklist input[type="checkbox"]').forEach(function(cb){ if(cb.checked) wants.push(cb.value); });

      var candidates = MALLS.filter(function(m){
        if(m.state !== st) return false;
        if(who==="kids" && !(m.bestFor.indexOf("family")>=0 || m.bestFor.indexOf("kids")>=0)) return false;
        if(who==="teens" && m.bestFor.indexOf("teens")<0) return false;
        return true;
      });

      var pick = candidates[0] || MALLS.filter(function(m){ return m.state===st; })[0] || MALLS[0];

      var todo = [];
      if(wants.indexOf("clothes")>=0) todo.push("buy winter clothes");
      if(wants.indexOf("school")>=0) todo.push("get school supplies");
      if(wants.indexOf("phone")>=0) todo.push("pick up a phone case/charger");
      if(wants.indexOf("gift")>=0) todo.push("buy a small gift");
      if(wants.indexOf("food")>=0) todo.push("eat (food court or restaurant)");
      if(wants.indexOf("fun")>=0) todo.push("do something fun (movie/arcade/play area)");

      var weatherLine = (weather==="rainy") ? "It's rainy/cold, so an indoor mall is perfect." :
                        (weather==="nice") ? "It's a nice day — you can also consider an outdoor center." :
                        "Any weather works, but indoor malls are easiest for long trips.";

      var budgetLine = (budget==="low") ? "Budget tip: check outlet deals and set a spending limit." :
                       (budget==="high") ? "Treat day: choose nicer stores + a sit-down meal." :
                       "Mid-budget: mix a few essentials + one treat.";

      var whoLine = (who==="solo") ? "just me" : who;

      var txt = "Plan: " + pick.name + " (" + pick.city + ", " + pick.state + ").\n"
              + weatherLine + "\n"
              + "We're going with " + whoLine + ".\n"
              + "To do: " + (todo.length ? todo.join(", ") : "browse, eat, and relax") + ".\n"
              + budgetLine + "\n"
              + "Useful line: 'Could you tell me where the customer service desk is?'";

      $("planOut").textContent = txt;
      addScore(true);
      return txt;
    }

    $("genPlan").addEventListener("click", function(){ gen(); toast("Plan generated.", true); });

    if($("copyPlan")) $("copyPlan").addEventListener("click", function(){
      var txt = $("planOut").textContent.trim();
      if(!txt || txt==="Select options → Generate plan"){ toast("Generate first.", false); return; }
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(txt).then(function(){ toast("Copied!", true); }, function(){ toast("Copy failed.", false); });
      }else toast("Clipboard not available.", false);
    });

    if($("speakPlan")) $("speakPlan").addEventListener("click", function(){
      var txt = $("planOut").textContent.trim();
      if(!txt || txt==="Select options → Generate plan") txt = gen();
      speak(txt.replace(/\n+/g, " "));
    });
  }

  /* -------------------- Fill paragraph -------------------- */
  function initFill(){
    if(!$("fillParagraph") || !$("fillOut")) return;

    var options = {
      mall: ["South Shore Plaza","Natick Mall","Prudential Center","Merrimack Premium Outlets","Pheasant Lane Mall"],
      reason: ["it's convenient","it's indoors","it has lots of stores","the kids can take a break","my teen can meet friends"],
      activity: ["shop for winter clothes","buy school supplies","get lunch in the food court","watch a movie","look for deals at outlets"],
      connector: ["because","so","but"],
      extra: ["I'm just browsing.","Could you recommend a good store?","Where's the nearest restroom?","Do you have this in a different size?"]
    };

    function makeSelect(arr){
      return '<select class="blank"><option value="">—</option>'
        + arr.map(function(x){ return '<option value="'+esc(x)+'">'+esc(x)+'</option>'; }).join("")
        + '</select>';
    }

    $("fillParagraph").innerHTML = ''
      + '<p class="fillLine">Today, I\'m going to <b>'+makeSelect(options.mall)+'</b> with my family.</p>'
      + '<p class="fillLine">We want to <b>'+makeSelect(options.activity)+'</b> <b>'+makeSelect(options.connector)+'</b> <b>'+makeSelect(options.reason)+'</b>.</p>'
      + '<p class="fillLine">Then I will ask: <b>'+makeSelect(options.extra)+'</b></p>';

    function buildText(){
      var sels = qsa("#fillParagraph select.blank");
      var vals = sels.map(function(s){ return s.value; });
      for(var i=0;i<vals.length;i++){ if(!vals[i]) return ""; }
      return "Today, I'm going to " + vals[0] + " with my family. "
           + "We want to " + vals[1] + " " + vals[2] + " " + vals[3] + ". "
           + "Then I will ask: " + vals[4];
    }

    function check(){
      var txt = buildText();
      if(!txt){ $("fillOut").textContent="—"; toast("Fill all blanks.", false); addScore(false); return; }
      $("fillOut").textContent = txt;
      toast("Nice paragraph!", true);
      addScore(true);
      return txt;
    }

    if($("fillCheck")) $("fillCheck").addEventListener("click", check);

    if($("fillReset")) $("fillReset").addEventListener("click", function(){
      qsa("#fillParagraph select.blank").forEach(function(s){ s.value=""; });
      $("fillOut").textContent = "—";
      toast("Reset.", true);
    });

    if($("fillSpeak")) $("fillSpeak").addEventListener("click", function(){
      var txt = $("fillOut").textContent.trim();
      if(!txt || txt==="—") txt = check();
      if(txt) speak(txt);
    });
  }

  /* -------------------- sources list (optional) -------------------- */
  function initSources(){
    if(!$("sourcesList")) return;
    var links = [
      { label:"Natick Mall (official)", url:"https://www.natickmall.com/" },
      { label:"Burlington Mall (official)", url:"https://www.burlingtonmall.com/" },
      { label:"South Shore Plaza (official)", url:"https://www.southshoreplaza.com/" },
      { label:"Northshore Mall (official)", url:"https://www.northshoremall.com/" },
      { label:"Mall of New Hampshire (official)", url:"https://www.mallofnh.com/" },
      { label:"Pheasant Lane Mall (official)", url:"https://www.simon.com/mall/pheasant-lane-mall" },
      { label:"Merrimack Premium Outlets (official)", url:"https://www.premiumoutlets.com/outlet/merrimack" }
    ];
    $("sourcesList").innerHTML = links.map(function(l){
      return '<a class="src" target="_blank" rel="noopener" href="'+esc(l.url)+'">'+esc(l.label)+'</a>';
    }).join("");
  }

  /* -------------------- tools (print/reset/test voice) -------------------- */
  function bindTools(){
    if($("testVoice")) $("testVoice").addEventListener("click", function(){
      speak("Hi! Welcome to the mall. Could you recommend a good place to eat?");
    });
    if($("printBtn")) $("printBtn").addEventListener("click", function(){ window.print(); });
    if($("resetAll")) $("resetAll").addEventListener("click", function(){
      try{ localStorage.removeItem(SCORE_KEY); }catch(e){}
      score = {pts:0, streak:0};
      saveScore();
      // reset quizzes
      Object.keys(quizzes).forEach(function(id){ resetQuiz(id); });
      toast("Reset complete.", true);
    });
  }

  /* -------------------- boot -------------------- */
  function boot(){
    bindLangControls();
    applyLang();
    loadScore();
    bindTools();
    bindSpeakButtons();

    initMall101();
    initTypeCards();
    initFinder();
    initVocab();
    initQuizzes();
    bindQuizButtons();

    initSpeaking();
    initFood();
    initReturns();
    initBingo();
    initTeens();
    initPlan();
    initFill();
    initSources();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})();