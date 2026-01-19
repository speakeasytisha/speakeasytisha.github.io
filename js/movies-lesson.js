/* SpeakEasyTisha — Movies & Cinema interactive lesson
   - Touch-friendly (Mac + iPad Safari): tap mode for all interactions
   - Accent toggle: US / UK using speechSynthesis
   - Instant feedback + hints + score
   - Reset per section + Reset all
*/

(function () {
  "use strict";

  function $(id){ return document.getElementById(id); }

  function esc(s){
    return String(s).replace(/[&<>"]/g, function(c){
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c];
    });
  }

  function shuffle(arr){
    var a = arr.slice();
    for (var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }

  /* --------------------
     State + scoring
  ---------------------*/
  var STORAGE_KEY = "se_movies_lesson_v1";
  var state = { accent:"us", score:0, awarded:{} };

  function load(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        var obj = JSON.parse(raw);
        if(obj && typeof obj === "object"){
          state.accent = obj.accent || "us";
          state.score = obj.score || 0;
          state.awarded = obj.awarded || {};
        }
      }
    }catch(e){}
  }

  function save(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accent: state.accent,
        score: state.score,
        awarded: state.awarded
      }));
    }catch(e){}
  }

  function setScore(n){
    state.score = Math.max(0, n|0);
    if($("scoreTop")) $("scoreTop").textContent = String(state.score);
    if($("scoreBottom")) $("scoreBottom").textContent = String(state.score);
    save();
  }

  function addPoints(n){ setScore(state.score + (n|0)); }

  function awardOnce(id, pts){
    if(state.awarded[id]) return false;
    state.awarded[id] = 1;
    addPoints(pts);
    return true;
  }

  function resetAwards(prefix){
    var k;
    if(!prefix){ state.awarded = {}; save(); return; }
    for(k in state.awarded){
      if(state.awarded.hasOwnProperty(k) && k.indexOf(prefix) === 0) delete state.awarded[k];
    }
    save();
  }

  /* --------------------
     Speech (US / UK)
  ---------------------*/
  var voices = [];
  function refreshVoices(){
    voices = (typeof speechSynthesis !== "undefined") ? speechSynthesis.getVoices() : [];
  }
  if(typeof speechSynthesis !== "undefined"){
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function pickVoice(target){
    if(!voices || !voices.length) return null;
    var prefer = target === "uk" ? ["en-GB","en_GB"] : ["en-US","en_US"];
    for(var i=0;i<prefer.length;i++){
      for(var j=0;j<voices.length;j++){
        if((voices[j].lang || "").indexOf(prefer[i]) === 0) return voices[j];
      }
    }
    for(j=0;j<voices.length;j++){
      if((voices[j].lang || "").toLowerCase().indexOf("en") === 0) return voices[j];
    }
    return null;
  }

  function speak(text){
    try{
      if(!text) return;
      if(typeof speechSynthesis === "undefined") return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.rate = 0.98;
      u.lang = (state.accent === "uk") ? "en-GB" : "en-US";
      var v = pickVoice(state.accent);
      if(v) u.voice = v;
      speechSynthesis.speak(u);
    }catch(e){}
  }

  function setAccent(a){
    state.accent = (a === "uk") ? "uk" : "us";
    var us = $("accentUS"), uk = $("accentUK");
    if(us && uk){
      us.classList.toggle("is-on", state.accent === "us");
      uk.classList.toggle("is-on", state.accent === "uk");
      us.setAttribute("aria-pressed", state.accent === "us" ? "true" : "false");
      uk.setAttribute("aria-pressed", state.accent === "uk" ? "true" : "false");
    }
    save();
  }

  /* --------------------
     Data
  ---------------------*/
  var HISTORY = [
    { tag:"1895–1900", title:"Birth of cinema", text:"Early films were silent and very short. The Lumière brothers in France helped popularize public screenings." },
    { tag:"1910s", title:"Storytelling grows", text:"Directors began using editing and longer narratives. Movie stars appeared and studios developed." },
    { tag:"1927", title:"Sound arrives", text:"“Talkies” changed everything. Dialogue, music, and sound effects became central to filmmaking." },
    { tag:"1930s–40s", title:"Golden Age", text:"Hollywood developed major genres (musicals, noir, westerns). Many iconic directors and actors emerged." },
    { tag:"1950s–60s", title:"Color + new waves", text:"Color became common. In France, the Nouvelle Vague pushed more personal, innovative filmmaking." },
    { tag:"1970s–90s", title:"Blockbusters & VFX", text:"Big-budget films and special effects grew. Franchises became popular and global distribution expanded." },
    { tag:"2000s–today", title:"Streaming era", text:"Digital cameras, CGI, and streaming platforms changed how we watch and produce films." }
  ];

  var VOCAB = [
    { theme:"Genres", icon:"🧟", term:"horror", def:"a movie that aims to scare or shock you", ex:"I love horror because it creates suspense." },
    { theme:"Genres", icon:"😂", term:"comedy", def:"a funny movie designed to make you laugh", ex:"This comedy is light and entertaining." },
    { theme:"Genres", icon:"🕵️", term:"thriller", def:"a tense story with danger, suspense, and surprises", ex:"The thriller kept me on edge." },
    { theme:"Genres", icon:"💘", term:"romance", def:"a story focused on love and relationships", ex:"It’s a romance with a bittersweet ending." },
    { theme:"Genres", icon:"🚀", term:"science fiction", def:"a story about future tech, space, or imagined science", ex:"Sci‑fi often explores big questions." },
    { theme:"Genres", icon:"🤠", term:"western", def:"a story set in the American West (cowboys, frontier)", ex:"The western has classic duels." },

    { theme:"Filmmaking", icon:"🎭", term:"actor / actress", def:"the person who performs a character", ex:"The actor’s performance felt authentic." },
    { theme:"Filmmaking", icon:"🎬", term:"director", def:"the person who guides the artistic vision", ex:"The director created a unique atmosphere." },
    { theme:"Filmmaking", icon:"📝", term:"screenwriter", def:"the person who writes the script", ex:"The screenwriter built strong dialogue." },
    { theme:"Filmmaking", icon:"📷", term:"cinematography", def:"camera work: framing, movement, lighting", ex:"The cinematography is stunning." },
    { theme:"Filmmaking", icon:"✂️", term:"editing", def:"how shots are cut and arranged", ex:"Fast editing can increase tension." },
    { theme:"Filmmaking", icon:"🎼", term:"soundtrack", def:"the music used in the film", ex:"The soundtrack made the ending powerful." },

    { theme:"Story", icon:"🧩", term:"plot", def:"the events of the story", ex:"The plot is simple but effective." },
    { theme:"Story", icon:"🧠", term:"twist", def:"a surprising change in the story", ex:"The twist completely changed my opinion." },
    { theme:"Story", icon:"🔥", term:"conflict", def:"the main problem or struggle", ex:"The conflict grows with every scene." },
    { theme:"Story", icon:"🏁", term:"ending", def:"the final part of the story", ex:"The ending was satisfying." },
    { theme:"Story", icon:"🎞️", term:"scene", def:"a unit of action in a film", ex:"The best scene is the final conversation." },

    { theme:"Describing", icon:"✨", term:"moving", def:"emotionally powerful", ex:"It’s one of the most moving films I’ve seen." },
    { theme:"Describing", icon:"⚡", term:"action‑packed", def:"full of action and fast scenes", ex:"It’s more action‑packed than the original." },
    { theme:"Describing", icon:"🧊", term:"predictable", def:"easy to guess", ex:"The story is a bit predictable." },
    { theme:"Describing", icon:"🎯", term:"convincing", def:"believable and realistic", ex:"Her acting is extremely convincing." },

    { theme:"Connectors", icon:"🔗", term:"however", def:"introduces a contrast", ex:"I liked the actors; however, the plot was weak." },
    { theme:"Connectors", icon:"🔗", term:"therefore", def:"shows a result", ex:"The pacing was slow; therefore, I lost interest." },
    { theme:"Connectors", icon:"🔗", term:"in addition", def:"adds extra information", ex:"In addition, the soundtrack was amazing." },
    { theme:"Connectors", icon:"🔗", term:"although", def:"introduces an opposing idea", ex:"Although it’s long, it’s worth watching." },

    { theme:"Universal", icon:"🌎", term:"studio", def:"a company that produces films", ex:"Universal is a major studio." },
    { theme:"Universal", icon:"🎢", term:"theme park", def:"a park with rides and attractions", ex:"Universal also runs theme parks." },
    { theme:"Universal", icon:"💥", term:"blockbuster", def:"a very successful big-budget film", ex:"It became a global blockbuster." },

    { theme:"Culture", icon:"🇫🇷", term:"art-house", def:"more artistic, personal, experimental", ex:"Some French films feel more art-house." },
    { theme:"Culture", icon:"🇺🇸", term:"Hollywood", def:"the U.S. film industry; often big budgets", ex:"Hollywood often invests in spectacle." }
  ];

  var FILTERS = ["All","Genres","Filmmaking","Story","Describing","Connectors","Universal","Culture"];

  /* --------------------
     History accordion
  ---------------------*/
  function renderHistory(){
    var wrap = $("historyAcc");
    if(!wrap) return;
    wrap.innerHTML = "";
    for(var i=0;i<HISTORY.length;i++){
      (function(item){
        var box = document.createElement("div");
        box.className = "accItem";
        var btn = document.createElement("button");
        btn.className = "accBtn";
        btn.type = "button";
        btn.innerHTML = '<span>' + esc(item.title) + '</span><span class="tag">' + esc(item.tag) + '</span>';
        var panel = document.createElement("div");
        panel.className = "accPanel";
        panel.innerHTML = '<p class="muted">' + esc(item.text) + '</p>' +
                          '<div class="row"><button class="btn btn--small" type="button">🔊 Listen</button></div>';
        panel.querySelector("button").addEventListener("click", function(e){
          e.stopPropagation();
          speak(item.title + ". " + item.text);
        });
        btn.addEventListener("click", function(){ box.classList.toggle("is-open"); });
        box.appendChild(btn);
        box.appendChild(panel);
        wrap.appendChild(box);
      })(HISTORY[i]);
    }
  }

  /* --------------------
     Vocab flashcards
  ---------------------*/
  var currentFilter = "All";

  function renderFilters(){
    var wrap = $("vocabFilters");
    if(!wrap) return;
    wrap.innerHTML = "";
    for(var i=0;i<FILTERS.length;i++){
      (function(name){
        var b = document.createElement("button");
        b.className = "pill" + (name === currentFilter ? " is-on" : "");
        b.type = "button";
        b.textContent = name;
        b.addEventListener("click", function(){
          currentFilter = name;
          renderFilters();
          renderVocab();
        });
        wrap.appendChild(b);
      })(FILTERS[i]);
    }
  }

  function vocabList(){
    if(currentFilter === "All") return VOCAB.slice();
    return VOCAB.filter(function(v){ return v.theme === currentFilter; });
  }

  function makeCard(v){
    var card = document.createElement("div");
    card.className = "flash";
    card.setAttribute("tabindex","0");
    card.setAttribute("role","button");
    card.dataset.front = v.term;
    card.dataset.back = v.def;
    card.dataset.ex = v.ex;
    card.dataset.icon = v.icon;
    card.dataset.meta = v.theme;
    showFront(card);
    return card;
  }

  function showFront(card){
    card.classList.remove("is-back");
    card.innerHTML = [
      '<div class="flash__top">',
      '  <div class="flash__icon">' + esc(card.dataset.icon) + '</div>',
      '  <button class="flash__listen" type="button" aria-label="Listen">🔊</button>',
      '</div>',
      '<div class="flash__term">' + esc(card.dataset.front) + '</div>',
      '<div class="flash__meta">' + esc(card.dataset.meta) + '</div>',
      '<div class="flash__ex muted small">' + esc(card.dataset.ex) + '</div>'
    ].join("");
  }

  function showBack(card){
    card.classList.add("is-back");
    card.innerHTML = [
      '<div class="flash__top">',
      '  <div class="flash__icon">' + esc(card.dataset.icon) + '</div>',
      '  <button class="flash__listen" type="button" aria-label="Listen">🔊</button>',
      '</div>',
      '<div class="flash__term">' + esc(card.dataset.front) + '</div>',
      '<div class="flash__def">' + esc(card.dataset.back) + '</div>',
      '<div class="flash__ex muted small"><b>Example:</b> ' + esc(card.dataset.ex) + '</div>'
    ].join("");
  }

  function renderVocab(){
    var grid = $("vocabGrid");
    if(!grid) return;
    grid.innerHTML = "";
    var list = vocabList();
    for(var i=0;i<list.length;i++) grid.appendChild(makeCard(list[i]));

    // bind once (prevents double listeners)
    if(!grid.dataset.bound){
      grid.addEventListener("click", function(e){
        var t = e.target;
        if(t && t.classList && t.classList.contains("flash__listen")){
          e.stopPropagation();
          var p = t.closest(".flash");
          if(!p) return;
          speak(p.dataset.front + ". " + p.dataset.back + ". Example: " + p.dataset.ex);
          return;
        }
        var card = t.closest ? t.closest(".flash") : null;
        if(!card) return;
        if(card.classList.contains("is-back")) showFront(card); else showBack(card);
      });

      grid.addEventListener("keydown", function(e){
        if(e.key !== "Enter" && e.key !== " ") return;
        var card = e.target;
        if(card && card.classList && card.classList.contains("flash")){
          e.preventDefault();
          if(card.classList.contains("is-back")) showFront(card); else showBack(card);
        }
      });
      grid.dataset.bound = "1";
    }
  }

  function resetVocab(){
    currentFilter = "All";
    renderFilters();
    renderVocab();
  }

  /* --------------------
     Grammar A — Connectors
  ---------------------*/
  var CON_BANK = ["First","Then","However","Because","Therefore","In addition","Finally","Although"];
  var CON_ITEMS = [
    { id:"c1", text:'<span class="blank" data-answer="First">_____</span>, the movie introduces the main character in Paris.' },
    { id:"c2", text:'The acting is excellent; <span class="blank" data-answer="however">_____</span>, the plot is a bit predictable.' },
    { id:"c3", text:'The soundtrack is powerful; <span class="blank" data-answer="therefore">_____</span>, the final scene feels more emotional.' },
    { id:"c4", text:'<span class="blank" data-answer="Although">_____</span> it is long, it is worth watching.' },
    { id:"c5", text:'The director used natural light <span class="blank" data-answer="Because">_____</span> it matches the realistic style.' },
    { id:"c6", text:'<span class="blank" data-answer="In addition">_____</span>, the cinematography is stunning.' },
    { id:"c7", text:'The story builds tension; <span class="blank" data-answer="Then">_____</span>, a twist changes everything.' },
    { id:"c8", text:'<span class="blank" data-answer="Finally">_____</span>, I would recommend it to anyone who loves dramas.' }
  ];
  var activeBlank = null;

  function normalizeAnswer(s){ return String(s||"").trim().toLowerCase(); }

  function flashFb(el, msg, type){
    if(!el) return;
    el.className = "fb " + (type||"");
    el.textContent = msg;
  }

  function setActiveBlank(el){
    var blanks = document.querySelectorAll("#conBlanks .blank");
    for(var i=0;i<blanks.length;i++) blanks[i].classList.remove("is-active");
    activeBlank = el;
    if(activeBlank) activeBlank.classList.add("is-active");
  }

  function renderConnectors(){
    var bank = $("conBank"), blanks = $("conBlanks"), fb = $("conFb");
    if(fb){ fb.className="fb"; fb.textContent=""; }
    if(!bank || !blanks) return;

    activeBlank = null;
    bank.innerHTML = "";
    blanks.innerHTML = "";

    for(var i=0;i<CON_BANK.length;i++){
      (function(w){
        var b = document.createElement("button");
        b.type="button";
        b.className="wbWord";
        b.textContent = w;
        b.addEventListener("click", function(){
          if(b.classList.contains("is-used")) return;
          if(!activeBlank){ flashFb(fb, "Tap a blank first.", "warn"); return; }
          placeConnector(activeBlank, w, b);
        });
        bank.appendChild(b);
      })(CON_BANK[i]);
    }

    for(i=0;i<CON_ITEMS.length;i++){
      (function(it){
        var line = document.createElement("div");
        line.className = "blankLine";
        line.innerHTML = it.text;
        var blank = line.querySelector(".blank");
        blank.setAttribute("tabindex","0");
        blank.addEventListener("click", function(){ setActiveBlank(blank); });
        blank.addEventListener("keydown", function(e){
          if(e.key === "Enter" || e.key === " "){ e.preventDefault(); setActiveBlank(blank); }
        });
        blanks.appendChild(line);
      })(CON_ITEMS[i]);
    }
  }

  function nextUnfilledBlank(){
    var blanks = document.querySelectorAll("#conBlanks .blank");
    for(var i=0;i<blanks.length;i++){
      if(!blanks[i].classList.contains("is-correct")) return blanks[i];
    }
    return null;
  }

  function placeConnector(blank, word, bankBtn){
    var fb = $("conFb");
    blank.textContent = word;
    var ans = blank.getAttribute("data-answer");
    var ok = normalizeAnswer(word) === normalizeAnswer(ans);
    blank.classList.remove("is-wrong","is-correct");
    blank.classList.add(ok ? "is-correct" : "is-wrong");

    if(ok){
      bankBtn.classList.add("is-used");
      awardOnce("con_" + normalizeAnswer(ans), 1);
      flashFb(fb, "✅ Correct!", "good");
      var next = nextUnfilledBlank();
      if(next) setActiveBlank(next);
      else flashFb(fb, "✅ Great! All connectors completed.", "good");
    }else{
      flashFb(fb, "❌ Not quite. Try again.", "bad");
    }
  }

  function connectorsHint(){
    var fb = $("conFb");
    if(!activeBlank){ flashFb(fb, "Pick a blank first.", "warn"); return; }
    var ans = activeBlank.getAttribute("data-answer");
    flashFb(fb, "Hint: it starts with “" + String(ans).charAt(0) + "”…", "warn");
  }

  function resetConnectors(){
    resetAwards("con_");
    renderConnectors();
  }

  /* --------------------
     Grammar B — Comparatives & Superlatives
  ---------------------*/
  var COMP_Q = [
    { id:"q1", q:"This sequel is ____ (exciting) than the first one.", a:"more exciting", opts:["exciting","more exciting","most exciting"] },
    { id:"q2", q:"That was the ____ (funny) scene in the whole movie.", a:"funniest", opts:["funnier","funniest","more funny"] },
    { id:"q3", q:"Her performance is ____ (convincing) in this film than in her last one.", a:"more convincing", opts:["more convincing","most convincing","convincingest"] },
    { id:"q4", q:"This is the ____ (moving) film I’ve watched this year.", a:"most moving", opts:["more moving","most moving","movingest"] },
    { id:"q5", q:"The French version is ____ (subtle) but the Hollywood remake is more spectacular.", a:"more subtle", opts:["subtler","more subtle","most subtle"] }
  ];

  function renderComparatives(){
    var wrap = $("compMCQ"), fb = $("compFb");
    if(fb){ fb.className="fb"; fb.textContent=""; }
    if(!wrap) return;
    wrap.innerHTML = "";
    for(var i=0;i<COMP_Q.length;i++){
      (function(item){
        var box = document.createElement("div");
        box.className = "mcqQ";
        box.innerHTML = "<b>" + esc(item.q) + "</b>";
        var ch = document.createElement("div");
        ch.className = "choices";
        for(var j=0;j<item.opts.length;j++){
          (function(opt){
            var b = document.createElement("button");
            b.type="button";
            b.className="choice";
            b.textContent = opt;
            b.addEventListener("click", function(){
              var ok = (opt === item.a);
              if(ok){
                b.classList.add("good");
                awardOnce("comp_" + item.id, 1);
                flashFb(fb, "✅ Correct!", "good");
              }else{
                b.classList.add("bad");
                flashFb(fb, "❌ Not quite. Try again.", "bad");
              }
            });
            ch.appendChild(b);
          })(item.opts[j]);
        }
        box.appendChild(ch);
        wrap.appendChild(box);
      })(COMP_Q[i]);
    }
  }

  function compHint(){
    flashFb($("compFb"), "Hint: Comparative = more / -er + than. Superlative = the most / -est.", "warn");
  }

  function resetComparatives(){
    resetAwards("comp_");
    renderComparatives();
  }

  /* --------------------
     Universal TF quiz
  ---------------------*/
  var UNI_TF = [
    { id:"u1", s:"Universal is known only for silent films.", a:false, hint:"It is known for many eras and genres." },
    { id:"u2", s:"Universal is associated with film production and theme parks.", a:true, hint:"It produces films and creates experiences." },
    { id:"u3", s:"A blockbuster is a small independent film.", a:false, hint:"Blockbusters are big-budget successful films." }
  ];

  function renderUni(){
    var wrap = $("uniTF"), fb = $("uniFb");
    if(fb){ fb.className="fb"; fb.textContent=""; }
    if(!wrap) return;
    wrap.innerHTML = "";
    for(var i=0;i<UNI_TF.length;i++){
      (function(it){
        var row = document.createElement("div");
        row.className = "tfItem";
        row.innerHTML = "<b>" + esc(it.s) + "</b>";
        var btns = document.createElement("div");
        btns.className = "tfBtns";
        ["True","False"].forEach(function(lbl){
          var b = document.createElement("button");
          b.type="button";
          b.className="btn btn--small";
          b.textContent = lbl;
          b.addEventListener("click", function(){
            var val = (lbl === "True");
            var ok = (val === it.a);
            if(ok){
              awardOnce("uni_" + it.id, 1);
              flashFb(fb, "✅ Correct!", "good");
            }else{
              flashFb(fb, "❌ Not quite. Hint: " + it.hint, "bad");
            }
          });
          btns.appendChild(b);
        });
        row.appendChild(btns);
        wrap.appendChild(row);
      })(UNI_TF[i]);
    }
  }

  function resetUni(){
    resetAwards("uni_");
    renderUni();
  }

  /* --------------------
     French vs American sorter (tap mode)
  ---------------------*/
  var CULT_ITEMS = [
    { id:"s1", t:"Often more dialogue-driven and character-focused.", cat:"French" },
    { id:"s2", t:"Often bigger budgets and more spectacle (VFX, action).", cat:"American" },
    { id:"s3", t:"May include a more ambiguous ending.", cat:"French" },
    { id:"s4", t:"Franchises and sequels are very common.", cat:"American" },
    { id:"s5", t:"Both can be artistic or commercial depending on the director.", cat:"Both" },
    { id:"s6", t:"Often uses faster pacing and a three-act structure.", cat:"American" },
    { id:"s7", t:"Can feel more realistic or intimate (smaller stories).", cat:"French" },
    { id:"s8", t:"Both can explore social themes and culture.", cat:"Both" }
  ];
  var pickedTileId = null;

  function renderCultureSorter(){
    var wrap = $("cultSorter"), fb = $("cultFb");
    if(fb){ fb.className="fb"; fb.textContent=""; }
    if(!wrap) return;
    wrap.innerHTML = "";

    var buckets = [
      { id:"French", title:"🇫🇷 Often in French cinema" },
      { id:"American", title:"🇺🇸 Often in Hollywood" },
      { id:"Both", title:"🌍 Both / depends" }
    ];

    buckets.forEach(function(b){
      var box = document.createElement("div");
      box.className = "bucket";
      box.innerHTML = "<h3>" + esc(b.title) + "</h3><div class=\"bucketDrop\" data-drop=\"" + esc(b.id) + "\"></div>";
      box.addEventListener("click", function(){
        if(!pickedTileId) return;
        placeTile(pickedTileId, b.id);
      });
      wrap.appendChild(box);
    });

    var pool = document.createElement("div");
    pool.className = "bucket";
    pool.innerHTML = "<h3>🎴 Statements</h3><div class=\"bucketDrop\" id=\"cultPool\"></div>";
    wrap.prepend(pool);

    var poolDrop = $("cultPool");
    shuffle(CULT_ITEMS).forEach(function(it){
      var t = document.createElement("div");
      t.className = "sortTile";
      t.textContent = it.t;
      t.dataset.id = it.id;
      t.addEventListener("click", function(e){
        e.stopPropagation();
        pickedTileId = it.id;
        var tiles = document.querySelectorAll("#cultSorter .sortTile");
        for(var i=0;i<tiles.length;i++) tiles[i].classList.remove("is-picked");
        t.classList.add("is-picked");
      });
      poolDrop.appendChild(t);
    });
  }

  function getCultItem(id){
    for(var i=0;i<CULT_ITEMS.length;i++) if(CULT_ITEMS[i].id === id) return CULT_ITEMS[i];
    return null;
  }

  function placeTile(id, bucket){
    var it = getCultItem(id);
    var tile = document.querySelector('#cultSorter .sortTile[data-id="' + id + '"]');
    var drop = document.querySelector('#cultSorter .bucketDrop[data-drop="' + bucket + '"]');
    var fb = $("cultFb");
    if(!it || !tile || !drop) return;

    drop.appendChild(tile);
    tile.classList.remove("is-picked");
    pickedTileId = null;

    var ok = (bucket === it.cat);
    tile.classList.remove("good","bad");
    tile.classList.add(ok ? "good" : "bad");

    if(ok){
      awardOnce("cult_" + id, 1);
      flashFb(fb, "✅ Correct!", "good");
    }else{
      flashFb(fb, "❌ Not quite. Think about budget / pacing / ambiguity.", "bad");
    }

    var left = document.querySelectorAll("#cultPool .sortTile").length;
    if(left === 0) flashFb(fb, "Done! ✅ Now try explaining your choices with connectors.", "good");
  }

  function resetCulture(){
    resetAwards("cult_");
    pickedTileId = null;
    renderCultureSorter();
  }

  /* --------------------
     Sentence builder
  ---------------------*/
  var BUILD_ITEMS = [
    { id:"b1", target:"First, the movie introduces a lonely detective in Paris.", words:["lonely","in","Paris","introduces","First,","detective","the","movie","a"] },
    { id:"b2", target:"However, the ending is far more surprising than I expected.", words:["expected.","more","is","than","I","far","surprising","the","ending","However,"] },
    { id:"b3", target:"In addition, the soundtrack makes the final scene even more moving.", words:["final","moving.","makes","even","In","addition,","the","soundtrack","scene","more","the"] },
    { id:"b4", target:"This film is less predictable than the remake.", words:["than","the","remake.","predictable","less","This","film","is"] }
  ];

  function renderBuilder(){
    var wrap = $("sentenceBuilder"), fb = $("buildFb");
    if(fb){ fb.className="fb"; fb.textContent=""; }
    if(!wrap) return;
    wrap.innerHTML = "";

    BUILD_ITEMS.forEach(function(it){
      var row = document.createElement("div");
      row.className = "buildRow";

      var wordRow = document.createElement("div");
      wordRow.className = "wordRow";

      var answer = document.createElement("div");
      answer.className = "answerRow";

      var words = shuffle(it.words.slice());
      words.forEach(function(w){
        var b = document.createElement("button");
        b.type="button";
        b.className="word";
        b.textContent = w;
        b.addEventListener("click", function(){
          if(b.disabled) return;
          b.disabled = true;
          b.classList.add("is-used");
          var aw = document.createElement("span");
          aw.className = "answerWord";
          aw.textContent = w;
          aw.addEventListener("click", function(){
            try{ answer.removeChild(aw); }catch(e){}
            b.disabled = false;
            b.classList.remove("is-used");
          });
          answer.appendChild(aw);
        });
        wordRow.appendChild(b);
      });

      var controls = document.createElement("div");
      controls.className = "row";

      var check = document.createElement("button");
      check.type="button";
      check.className="btn btn--small";
      check.textContent="Check";
      check.addEventListener("click", function(){
        var built = [];
        var kids = answer.querySelectorAll(".answerWord");
        for(var i=0;i<kids.length;i++) built.push(kids[i].textContent);
        var sentence = built.join(" ").replace(/\s+([.,!?;:])/g,"$1").replace(/\s+/g," ").trim();
        var ok = (normalizeAnswer(sentence) === normalizeAnswer(it.target));
        if(ok){
          awardOnce("build_" + it.id, 2);
          flashFb(fb, "✅ " + it.id.toUpperCase() + " correct!", "good");
        }else{
          flashFb(fb, "❌ " + it.id.toUpperCase() + " not yet. Use 🔊 Target.", "bad");
        }
      });

      var listenT = document.createElement("button");
      listenT.type="button";
      listenT.className="btn btn--ghost btn--small";
      listenT.textContent="🔊 Target";
      listenT.addEventListener("click", function(){ speak(it.target); });

      controls.appendChild(check);
      controls.appendChild(listenT);

      row.appendChild(wordRow);
      row.appendChild(answer);
      row.appendChild(controls);

      wrap.appendChild(row);
    });
  }

  function builderHint(){
    flashFb($("buildFb"), "Hint: Start with the connector (First / However / In addition). Use 🔊 Target to listen.", "warn");
  }

  function resetBuilder(){
    resetAwards("build_");
    renderBuilder();
  }

  /* --------------------
     Paragraph builder
  ---------------------*/
  function renderPara(){
    var wrap = $("paraBuilder"), fb = $("paraFb");
    if(fb){ fb.className="fb"; fb.textContent=""; }
    if(!wrap) return;
    wrap.innerHTML = "";

    var fields = [
      { id:"pTitle", label:"Movie title", ph:"e.g., The Intouchables / Inception" },
      { id:"pGenre", label:"Genre", ph:"comedy, thriller, drama..." },
      { id:"pSetting", label:"Setting (where/when)", ph:"in Paris, in the future..." },
      { id:"pMain", label:"Main character", ph:"a detective, a student..." },
      { id:"pGoal", label:"Goal / problem", ph:"tries to..., wants to..." },
      { id:"pOpinion", label:"Your opinion + comparison", ph:"more moving than..., the best scene is..." }
    ];

    fields.forEach(function(f){
      var box = document.createElement("div");
      box.className = "field";
      box.innerHTML = '<div class="label">' + esc(f.label) + '</div>' +
                      '<input class="input" id="' + esc(f.id) + '" placeholder="' + esc(f.ph) + '" />';
      wrap.appendChild(box);
    });
  }

  function buildParagraphText(){
    function val(id){ var el=$(id); return el ? el.value.trim() : ""; }
    var t=val("pTitle"), g=val("pGenre"), s=val("pSetting"), m=val("pMain"), goal=val("pGoal"), o=val("pOpinion");
    var parts = [];
    parts.push("First, the movie " + (t ? ("\""+t+"\"") : "…") + " is a " + (g||"…") + " set " + (s||"…") + ".");
    parts.push("Then, the main character is " + (m||"…") + " who " + (goal||"…") + ".");
    parts.push("In addition, the acting and cinematography create a strong atmosphere.");
    parts.push("Finally, in my opinion, " + (o||"…") + ".");
    return parts.join(" ");
  }

  function paraCheck(){
    var fb = $("paraFb");
    var filled = 0;
    ["pTitle","pGenre","pSetting","pMain","pGoal","pOpinion"].forEach(function(id){
      var el = $(id);
      if(el && el.value.trim().length) filled += 1;
    });
    if(filled >= 4){
      awardOnce("para_done", 4);
      flashFb(fb, "✅ Great paragraph! (Try listening to it.)", "good");
    }else{
      flashFb(fb, "❌ Add more detail. Aim for at least 4 fields.", "bad");
    }
  }

  function paraHint(){
    flashFb($("paraFb"), "Hint: Fill Genre + Setting + Main character + Opinion. Add a comparison (more… than / the most…).", "warn");
  }

  function paraListenTemplate(){
    speak("First, introduce the movie. Then, describe the main character and the goal. After that, mention a conflict. In addition, describe acting and cinematography. Finally, give your opinion and recommendation.");
  }

  function paraSpeak(){ speak(buildParagraphText()); }

  function resetPara(){
    resetAwards("para_");
    renderPara();
  }

  /* --------------------
     Print grammar
  ---------------------*/
  function printGrammar(){
    document.body.classList.add("se-print-grammar");
    function cleanup(){
      document.body.classList.remove("se-print-grammar");
      window.removeEventListener("afterprint", cleanup);
    }
    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(function(){ try{ cleanup(); }catch(e){} }, 1200);
  }

  /* --------------------
     Resets
  ---------------------*/
  function resetHistory(){ renderHistory(); }

  function resetGrammar(){ resetConnectors(); resetComparatives(); }

  function resetAll(){
    state.awarded = {};
    setScore(0);
    resetHistory();
    resetVocab();
    resetGrammar();
    resetUni();
    resetCulture();
    resetBuilder();
    resetPara();
    ["conFb","compFb","uniFb","cultFb","buildFb","paraFb"].forEach(function(id){
      var el = $(id);
      if(el){ el.className="fb"; el.textContent=""; }
    });
  }

  /* --------------------
     Bind
  ---------------------*/
  function bind(){
    if($("accentUS")) $("accentUS").addEventListener("click", function(){ setAccent("us"); });
    if($("accentUK")) $("accentUK").addEventListener("click", function(){ setAccent("uk"); });

    if($("btnSpeakIntro")) $("btnSpeakIntro").addEventListener("click", function(){
      speak("Welcome to the movies lesson. You will learn film vocabulary, the history of cinema, filmmaking, Universal Studios, and differences between French and American films. You will also practice connectors, comparatives, and superlatives.");
    });
    if($("btnSpeakFrames")) $("btnSpeakFrames").addEventListener("click", function(){
      speak("The story is about... The main character... What I liked most was... Compared to... The best scene is... In my opinion...");
    });

    if($("btnPrintGrammar")) $("btnPrintGrammar").addEventListener("click", printGrammar);

    if($("historyListen")) $("historyListen").addEventListener("click", function(){
      speak(HISTORY.map(function(h){ return h.tag + ". " + h.title + ". " + h.text; }).join(" "));
    });
    if($("historyReset")) $("historyReset").addEventListener("click", resetHistory);

    if($("vocabReset")) $("vocabReset").addEventListener("click", function(){
      resetAwards("vocab_");
      resetVocab();
    });

    if($("grammarListen")) $("grammarListen").addEventListener("click", function(){
      speak("Connectors help you speak smoothly: first, then, finally, because, however, therefore, in addition. Comparatives and superlatives help you compare movies: more exciting than, the most moving, the best scene, the least convincing.");
    });
    if($("grammarReset")) $("grammarReset").addEventListener("click", resetGrammar);

    if($("conHint")) $("conHint").addEventListener("click", connectorsHint);
    if($("conReset")) $("conReset").addEventListener("click", resetConnectors);

    if($("compHint")) $("compHint").addEventListener("click", compHint);
    if($("compReset")) $("compReset").addEventListener("click", resetComparatives);

    if($("uniListen")) $("uniListen").addEventListener("click", function(){
      speak($("uniText") ? $("uniText").textContent : "");
    });
    if($("uniReset")) $("uniReset").addEventListener("click", resetUni);

    if($("cultListen")) $("cultListen").addEventListener("click", function(){
      speak("Compare French and American cinema. French films can be more dialogue-driven and intimate, while Hollywood often uses bigger budgets and faster pacing. These are tendencies, not rules.");
    });
    if($("cultReset")) $("cultReset").addEventListener("click", resetCulture);

    if($("buildHint")) $("buildHint").addEventListener("click", builderHint);
    if($("buildReset")) $("buildReset").addEventListener("click", resetBuilder);

    if($("paraListen")) $("paraListen").addEventListener("click", paraListenTemplate);
    if($("paraReset")) $("paraReset").addEventListener("click", resetPara);
    if($("paraCheck")) $("paraCheck").addEventListener("click", paraCheck);
    if($("paraHint")) $("paraHint").addEventListener("click", paraHint);
    if($("paraSpeak")) $("paraSpeak").addEventListener("click", paraSpeak);

    if($("resetAll")) $("resetAll").addEventListener("click", resetAll);
  }

  function init(){
    load();
    setAccent(state.accent);
    setScore(state.score);

    renderHistory();
    renderFilters();
    renderVocab();

    renderConnectors();
    renderComparatives();
    renderUni();
    renderCultureSorter();
    renderBuilder();
    renderPara();

    bind();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
