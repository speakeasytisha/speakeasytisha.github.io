/* SpeakEasyTisha — TV Series Lesson
   - Accent toggle (US/UK) using speechSynthesis
   - Instant feedback + hints + score
   - Touch-friendly (tap modes)
   - Reset per section + reset all
   - Print Grammar (only)
*/
(function(){
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
  function norm(s){ return String(s||"").trim().toLowerCase(); }

  /* --------------------
     State + score
  ---------------------*/
  var STORAGE_KEY = "se_tv_series_v1";
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
  function fb(el, msg, cls){
    if(!el) return;
    el.className = "fb " + (cls||"");
    el.textContent = msg || "";
  }

  /* --------------------
     Speech (US/UK)
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
     History timeline
  ---------------------*/
  var TL = [
    { id:"t1", year:"1930s–40s", tag:"Early TV", title:"Broadcast beginnings", body:"Early television was live and simple. People watched from home as studios experimented with news and entertainment." },
    { id:"t2", year:"1950s", tag:"Series", title:"Sitcoms + weekly episodes", body:"Weekly episodes became a habit. Sitcoms and dramas helped audiences follow familiar characters." },
    { id:"t3", year:"1970s–90s", tag:"Quality", title:"Longer arcs", body:"Writers used multi-episode arcs and deeper characters. Some shows became cultural events." },
    { id:"t4", year:"2000s", tag:"Prestige", title:"“Golden age” drama", body:"Complex storytelling, anti-heroes, and high production values raised expectations." },
    { id:"t5", year:"2010s", tag:"Streaming", title:"Binge-watching", body:"On-demand platforms changed viewing habits. People watched multiple episodes in one sitting." },
    { id:"t6", year:"Today", tag:"Global", title:"International hits", body:"Series travel worldwide quickly. Subtitles and dubbing help global audiences share shows." },
    { id:"t7", year:"Now", tag:"Formats", title:"Mini-series + limited series", body:"Shorter seasons and limited series tell a complete story without many years of episodes." },
    { id:"t8", year:"Now", tag:"Fandom", title:"Online communities", body:"Fans discuss theories, spoilers, and characters online, sometimes shaping a show’s popularity." }
  ];

  function renderTimeline(){
    var wrap = $("timeline");
    if(!wrap) return;
    wrap.innerHTML = "";
    TL.forEach(function(it){
      var c = document.createElement("div");
      c.className = "tCard";
      c.dataset.id = it.id;
      c.innerHTML = '<div class="tTop"><div class="tYear">'+esc(it.year)+'</div><div class="tTag">'+esc(it.tag)+'</div></div>' +
                    '<div class="tTitle">'+esc(it.title)+'</div>' +
                    '<div class="tBody">'+esc(it.body)+'</div>';
      c.addEventListener("click", function(){
        c.classList.toggle("is-open");
      });
      wrap.appendChild(c);
    });
  }

  var HIST_Q = [
    { id:"h1", q:"Which change made binge-watching common?", a:"On-demand streaming platforms", opts:["Silent films","On-demand streaming platforms","Newspaper reviews"] },
    { id:"h2", q:"What does a limited series usually mean?", a:"A complete story with a planned end", opts:["Infinite seasons forever","A complete story with a planned end","Only cartoons"] },
    { id:"h3", q:"What helped series travel worldwide fast?", a:"Subtitles/dubbing and online distribution", opts:["Black-and-white only","Subtitles/dubbing and online distribution","No internet"] }
  ];

  function renderHistMCQ(){
    var wrap = $("histMCQ");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("histFb"), "", "");
    HIST_Q.forEach(function(item){
      var box = document.createElement("div");
      box.className = "mcqQ";
      box.innerHTML = "<b>"+esc(item.q)+"</b>";
      var ch = document.createElement("div");
      ch.className = "choices";
      item.opts.forEach(function(opt){
        var b = document.createElement("button");
        b.type="button";
        b.className="choice";
        b.textContent = opt;
        b.addEventListener("click", function(){
          var ok = (opt === item.a);
          if(ok){
            b.classList.add("good");
            awardOnce("hist_"+item.id, 1);
            fb($("histFb"), "✅ Correct!", "good");
          }else{
            b.classList.add("bad");
            fb($("histFb"), "❌ Not quite. Hint: think about how people watch today.", "bad");
          }
        });
        ch.appendChild(b);
      });
      box.appendChild(ch);
      wrap.appendChild(box);
    });
  }

  function historyListen(){
    var parts = TL.map(function(t){ return t.year + ". " + t.title + ". " + t.body; });
    speak(parts.join(" "));
  }
  function histHint(){ fb($("histFb"), "Hint: streaming changed habits; limited series = planned ending.", "warn"); }
  function resetHistory(){
    resetAwards("hist_");
    renderTimeline();
    renderHistMCQ();
    fb($("histFb"), "", "");
  }

  /* --------------------
     Vocabulary + filters
  ---------------------*/
  var VOCAB = [
    { theme:"Structure", icon:"📺", term:"season", def:"a group of episodes released together", ex:"Season 2 is even better than season 1." },
    { theme:"Structure", icon:"🎞️", term:"episode", def:"one part of a series", ex:"The final episode has a shocking twist." },
    { theme:"Structure", icon:"⏳", term:"cliffhanger", def:"an ending that creates suspense for the next episode", ex:"It ends on a cliffhanger." },
    { theme:"Structure", icon:"🧵", term:"story arc", def:"the storyline across several episodes", ex:"The character arc is believable." },
    { theme:"Structure", icon:"🧩", term:"plot twist", def:"a surprising change in the story", ex:"The plot twist was unexpected." },

    { theme:"Characters", icon:"🧑‍🎤", term:"main character", def:"the central person in the story", ex:"The main character is complex." },
    { theme:"Characters", icon:"🧑‍🤝‍🧑", term:"supporting cast", def:"other important characters", ex:"The supporting cast is excellent." },
    { theme:"Characters", icon:"🎭", term:"to portray", def:"to act as a character", ex:"She portrays a detective." },
    { theme:"Characters", icon:"🧠", term:"motivations", def:"reasons why a character acts", ex:"His motivations are unclear at first." },

    { theme:"Viewing", icon:"🍿", term:"binge-watch", def:"watch many episodes in one sitting", ex:"I binge-watched it in two days." },
    { theme:"Viewing", icon:"📣", term:"spoiler", def:"information that reveals the story", ex:"No spoilers, please!" },
    { theme:"Viewing", icon:"⭐", term:"to rate", def:"to give a score/review", ex:"I’d rate it 9 out of 10." },

    { theme:"Review", icon:"⚡", term:"gripping", def:"very exciting and holds attention", ex:"It’s more gripping than I expected." },
    { theme:"Review", icon:"🎯", term:"predictable", def:"easy to guess", ex:"Some episodes are predictable." },
    { theme:"Review", icon:"✨", term:"well-written", def:"good quality writing", ex:"The dialogue is well-written." },
    { theme:"Review", icon:"🎼", term:"soundtrack", def:"music used in the show", ex:"The soundtrack builds tension." },

    { theme:"Connectors", icon:"🔗", term:"however", def:"introduces a contrast", ex:"I liked it; however, the pacing is slow." },
    { theme:"Connectors", icon:"🔗", term:"therefore", def:"shows a result", ex:"It’s confusing; therefore, I rewatched it." },
    { theme:"Connectors", icon:"🔗", term:"in addition", def:"adds information", ex:"In addition, the acting is strong." },
    { theme:"Connectors", icon:"🔗", term:"overall", def:"gives a final opinion", ex:"Overall, it’s worth watching." }
  ];

  var FILTERS = ["All","Structure","Characters","Viewing","Review","Connectors"];
  var currentFilter = "All";

  function renderFilters(){
    var wrap = $("vocabFilters");
    if(!wrap) return;
    wrap.innerHTML = "";
    FILTERS.forEach(function(name){
      var b = document.createElement("button");
      b.type="button";
      b.className = "pill" + (name === currentFilter ? " is-on" : "");
      b.textContent = name;
      b.addEventListener("click", function(){
        currentFilter = name;
        renderFilters();
        renderVocab();
      });
      wrap.appendChild(b);
    });
  }

  function vocabList(){
    if(currentFilter === "All") return VOCAB.slice();
    return VOCAB.filter(function(v){ return v.theme === currentFilter; });
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

  function renderVocab(){
    var grid = $("vocabGrid");
    if(!grid) return;
    grid.innerHTML = "";
    vocabList().forEach(function(v){ grid.appendChild(makeCard(v)); });

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
     Vocab match
  ---------------------*/
  var vmPick = { left:null, right:null };

  function vmPairs(){
    return shuffle(VOCAB).slice(0, 8).map(function(v, i){
      return { id:"m"+i, w:v.term, d:v.def };
    });
  }

  function renderVocabMatch(){
    var wrap = $("vmGrid");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("vmFb"), "", "");
    vmPick.left = null; vmPick.right = null;

    var data = vmPairs();
    var left = shuffle(data.map(function(p){ return { id:p.id, text:p.w }; }));
    var right = shuffle(data.map(function(p){ return { id:p.id, text:p.d }; }));

    var colL = document.createElement("div");
    colL.className = "matchCol";
    colL.innerHTML = "<b>Words</b>";
    var colR = document.createElement("div");
    colR.className = "matchCol";
    colR.innerHTML = "<b>Definitions</b>";

    left.forEach(function(it){
      var b = document.createElement("div");
      b.className = "matchItem";
      b.textContent = it.text;
      b.dataset.id = it.id;
      b.addEventListener("click", function(){
        if(b.classList.contains("is-locked")) return;
        pickMatch("left", b);
      });
      colL.appendChild(b);
    });

    right.forEach(function(it){
      var b = document.createElement("div");
      b.className = "matchItem";
      b.textContent = it.text;
      b.dataset.id = it.id;
      b.addEventListener("click", function(){
        if(b.classList.contains("is-locked")) return;
        pickMatch("right", b);
      });
      colR.appendChild(b);
    });

    wrap.appendChild(colL);
    wrap.appendChild(colR);
  }

  function pickMatch(side, el){
    if(side === "left"){
      if(vmPick.left) vmPick.left.classList.remove("is-picked");
      vmPick.left = el; el.classList.add("is-picked");
    }else{
      if(vmPick.right) vmPick.right.classList.remove("is-picked");
      vmPick.right = el; el.classList.add("is-picked");
    }
    if(vmPick.left && vmPick.right) checkMatch();
  }

  function lock(el){
    el.classList.add("is-locked","good");
    el.classList.remove("is-picked");
  }

  function checkMatch(){
    var ok = (vmPick.left.dataset.id === vmPick.right.dataset.id);
    if(ok){
      lock(vmPick.left);
      lock(vmPick.right);
      awardOnce("vm_" + vmPick.left.dataset.id, 1);
      fb($("vmFb"), "✅ Correct pair!", "good");
      vmPick.left = null; vmPick.right = null;

      var remaining = document.querySelectorAll("#vmGrid .matchItem:not(.is-locked)").length;
      if(remaining === 0) fb($("vmFb"), "✅ All matched! Great job.", "good");
    }else{
      vmPick.left.classList.add("bad");
      vmPick.right.classList.add("bad");
      fb($("vmFb"), "❌ Not a match. Try again.", "bad");
      setTimeout(function(){
        if(vmPick.left) vmPick.left.classList.remove("bad","is-picked");
        if(vmPick.right) vmPick.right.classList.remove("bad","is-picked");
        vmPick.left = null; vmPick.right = null;
      }, 650);
    }
  }

  function vmHint(){ fb($("vmFb"), "Hint: think show structure (season/episode), suspense (cliffhanger), and viewing habits (binge-watch).", "warn"); }
  function resetVM(){ resetAwards("vm_"); renderVocabMatch(); }

  /* --------------------
     Grammar exercises
  ---------------------*/
  var TENSE_Q = [
    { id:"t1", q:"I ____ three episodes so far. (no finished time)", a:"have watched", opts:["watched","have watched","was watching"] },
    { id:"t2", q:"I ____ it last night. (finished time)", a:"watched", opts:["watched","have watched","have been watching"] },
    { id:"t3", q:"Have you ____ that series yet?", a:"watched", opts:["watch","watched","watching"] },
    { id:"t4", q:"She has ____ finished season 1.", a:"already", opts:["already","yesterday","last week"] },
    { id:"t5", q:"I ____ never seen such a twist!", a:"have", opts:["have","did","was"] }
  ];

  function renderTenseMCQ(){
    var wrap = $("tenseMCQ");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("tenseFb"), "", "");
    TENSE_Q.forEach(function(item){
      var box = document.createElement("div");
      box.className = "mcqQ";
      box.innerHTML = "<b>"+esc(item.q)+"</b>";
      var ch = document.createElement("div");
      ch.className = "choices";
      item.opts.forEach(function(opt){
        var b = document.createElement("button");
        b.type="button";
        b.className="choice";
        b.textContent = opt;
        b.addEventListener("click", function(){
          var ok = (opt === item.a);
          if(ok){
            b.classList.add("good");
            awardOnce("tense_"+item.id, 1);
            fb($("tenseFb"), "✅ Correct!", "good");
          }else{
            b.classList.add("bad");
            fb($("tenseFb"), "❌ Not quite. Hint: finished time vs experience.", "bad");
          }
        });
        ch.appendChild(b);
      });
      box.appendChild(ch);
      wrap.appendChild(box);
    });
  }

  function tenseHint(){ fb($("tenseFb"), "Hint: Past Simple = last night / yesterday. Present Perfect = so far / ever / never / yet.", "warn"); }
  function resetTense(){ resetAwards("tense_"); renderTenseMCQ(); }

  var CONNECTORS = ["First","Then","However","Therefore","In addition","Overall"];
  var CONN_ITEMS = [
    { id:"c1", target:"First, the story introduces the main character.", blank:"____, the story introduces the main character.", a:"First" },
    { id:"c2", target:"However, some episodes feel slow.", blank:"____, some episodes feel slow.", a:"However" },
    { id:"c3", target:"Therefore, I watched the next episode immediately.", blank:"____, I watched the next episode immediately.", a:"Therefore" },
    { id:"c4", target:"In addition, the soundtrack creates tension.", blank:"____, the soundtrack creates tension.", a:"In addition" },
    { id:"c5", target:"Overall, it’s one of the most binge-worthy series.", blank:"____, it’s one of the most binge-worthy series.", a:"Overall" }
  ];
  var connPick = { word:null };

  function renderConnectors(){
    var box = $("connBox");
    if(!box) return;
    box.innerHTML = "";
    fb($("connFb"), "", "");
    connPick.word = null;

    var pills = document.createElement("div");
    pills.className = "pillRow";
    CONNECTORS.forEach(function(w){
      var b = document.createElement("button");
      b.type="button";
      b.className="pill";
      b.textContent = w;
      b.addEventListener("click", function(){
        var all = pills.querySelectorAll(".pill");
        for(var i=0;i<all.length;i++) all[i].classList.remove("is-on");
        b.classList.add("is-on");
        connPick.word = w;
      });
      pills.appendChild(b);
    });

    var list = document.createElement("div");
    list.style.marginTop = ".75rem";

    CONN_ITEMS.forEach(function(it){
      var row = document.createElement("div");
      row.className = "mcqQ";
      row.dataset.id = it.id;
      row.innerHTML = "<b>"+esc(it.blank)+"</b>";
      var action = document.createElement("div");
      action.className = "choices";

      var fillBtn = document.createElement("button");
      fillBtn.type="button";
      fillBtn.className = "choice";
      fillBtn.textContent = "Fill";
      fillBtn.addEventListener("click", function(){
        if(!connPick.word){
          fb($("connFb"), "Pick a connector first.", "warn");
          return;
        }
        if(connPick.word === it.a){
          fillBtn.classList.add("good");
          row.querySelector("b").textContent = it.target;
          awardOnce("conn_"+it.id, 1);
          fb($("connFb"), "✅ Correct connector!", "good");
        }else{
          fillBtn.classList.add("bad");
          fb($("connFb"), "❌ Not that one. Hint: choose contrast/result/addition.", "bad");
        }
      });

      var listenBtn = document.createElement("button");
      listenBtn.type="button";
      listenBtn.className = "choice";
      listenBtn.textContent = "🔊 Target";
      listenBtn.addEventListener("click", function(){ speak(it.target); });

      action.appendChild(fillBtn);
      action.appendChild(listenBtn);
      row.appendChild(action);
      list.appendChild(row);
    });

    box.appendChild(pills);
    box.appendChild(list);
  }

  function connHint(){ fb($("connFb"), "Hint: However = contrast. Therefore = result. In addition = add. Overall = final opinion.", "warn"); }
  function resetConn(){ resetAwards("conn_"); renderConnectors(); }

  var ORD_ITEMS = [
    { id:"o1", target:"I’ve never seen a series this gripping.", words:["seen","series","gripping.","this","a","never","I’ve"] },
    { id:"o2", target:"The finale was more shocking than I expected.", words:["expected.","was","more","The","than","shocking","finale","I"] },
    { id:"o3", target:"In addition, the acting is very convincing.", words:["the","acting","addition,","is","In","very","convincing."] },
    { id:"o4", target:"Overall, you should watch it if you like mysteries.", words:["if","mysteries.","Overall,","like","you","it","should","watch","you"] }
  ];

  function renderOrder(){
    var wrap = $("ordBuilder");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("ordFb"), "", "");

    ORD_ITEMS.forEach(function(it){
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

      var checkBtn = document.createElement("button");
      checkBtn.type="button";
      checkBtn.className="btn btn--small";
      checkBtn.textContent="Check";
      checkBtn.addEventListener("click", function(){
        var built = [];
        var kids = answer.querySelectorAll(".answerWord");
        for(var i=0;i<kids.length;i++) built.push(kids[i].textContent);
        var sentence = built.join(" ").replace(/\s+([.,!?;:])/g,"$1").replace(/\s+/g," ").trim();
        var ok = (norm(sentence) === norm(it.target));
        if(ok){
          awardOnce("ord_"+it.id, 2);
          fb($("ordFb"), "✅ " + it.id.toUpperCase() + " correct!", "good");
        }else{
          fb($("ordFb"), "❌ Not yet. Use 🔊 Target for help.", "bad");
        }
      });

      var listenBtn = document.createElement("button");
      listenBtn.type="button";
      listenBtn.className="btn btn--ghost btn--small";
      listenBtn.textContent="🔊 Target";
      listenBtn.addEventListener("click", function(){ speak(it.target); });

      controls.appendChild(checkBtn);
      controls.appendChild(listenBtn);

      row.appendChild(wordRow);
      row.appendChild(answer);
      row.appendChild(controls);

      wrap.appendChild(row);
    });
  }

  function ordHint(){ fb($("ordFb"), "Hint: Start with a connector (Overall/In addition) or a subject (I/The).", "warn"); }
  function resetOrder(){ resetAwards("ord_"); renderOrder(); }

  function grammarListen(){
    speak("Present perfect: I have watched it. Past simple: I watched it last night. Use connectors to organize your review: first, then, however, therefore, in addition, overall. Comparatives: more gripping than. Superlatives: the most binge-worthy.");
  }

  function resetGrammar(){
    resetTense();
    resetConn();
    resetOrder();
  }

  /* --------------------
     Dialogue builder
  ---------------------*/
  var DLG = [
    { who:"Other", line:"Do you have any series to recommend?" },
    { who:"You", good:"Yes! I’ve just finished one, and it’s really gripping.",
      opts:[
        "Yes! I’ve just finished one, and it’s really gripping.",
        "Yes. I finished yesterday since 2010.",
        "Recommend series is good."
      ]
    },
    { who:"Other", line:"What is it about?" },
    { who:"You", good:"It’s about a detective who tries to solve a mystery in a small town.",
      opts:[
        "It’s about a detective who tries to solve a mystery in a small town.",
        "It about detective solve mystery town small.",
        "It is about the about."
      ]
    },
    { who:"Other", line:"Is it better than the last show you watched?" },
    { who:"You", good:"It’s more suspenseful than the last one, and the acting is stronger.",
      opts:[
        "It’s more suspenseful than the last one, and the acting is stronger.",
        "It is the more suspenseful of.",
        "Yes, it better, because good."
      ]
    },
    { who:"Other", line:"Should I watch it even if I’m busy?" },
    { who:"You", good:"You should try the first episode. If you like it, you might binge-watch the season!",
      opts:[
        "You should try the first episode. If you like it, you might binge-watch the season!",
        "You must binge watch now immediate!",
        "Busy yes, watch maybe sometimes yesterday."
      ]
    }
  ];
  var dlgPos = 0;

  function addLine(who, text){
    var log = $("dlgLog");
    if(!log) return;
    var div = document.createElement("div");
    div.className = "dLine " + (who === "Other" ? "dOther" : "dYou");
    div.innerHTML = '<span class="dWho">' + esc(who) + ":</span> " + esc(text);
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function renderDialogue(){
    var log = $("dlgLog"), choices = $("dlgChoices");
    if(log) log.innerHTML = "";
    if(choices) choices.innerHTML = "";
    fb($("dlgFb"), "", "");
    dlgPos = 0;

    addLine("Other", DLG[0].line);
    dlgPos = 1;
    renderDlgChoices();
  }

  function renderDlgChoices(){
    var choices = $("dlgChoices");
    if(!choices) return;
    choices.innerHTML = "";

    if(dlgPos >= DLG.length){
      fb($("dlgFb"), "✅ Dialogue complete! Now recommend a real series you like.", "good");
      awardOnce("dlg_done", 3);
      return;
    }

    var step = DLG[dlgPos];
    if(step.who === "Other"){
      addLine("Other", step.line);
      dlgPos += 1;
      renderDlgChoices();
      return;
    }

    var opts = shuffle(step.opts.slice());
    opts.forEach(function(opt){
      var b = document.createElement("button");
      b.type="button";
      b.className="choiceBtn";
      b.textContent = opt;
      b.addEventListener("click", function(){
        var all = choices.querySelectorAll("button.choiceBtn");
        for(var k=0;k<all.length;k++) all[k].disabled = true;

        if(opt === step.good){
          addLine("You", opt);
          b.classList.add("good");
          awardOnce("dlg_" + dlgPos, 1);
          dlgPos += 1;
          fb($("dlgFb"), "✅ Nice!", "good");
          setTimeout(function(){ renderDlgChoices(); }, 250);
        }else{
          b.classList.add("bad");
          fb($("dlgFb"), "❌ Try a more natural phrase. Hint: use present perfect + clear structure.", "bad");
          for(var k2=0;k2<all.length;k2++) all[k2].disabled = false;
        }
      });
      choices.appendChild(b);
    });
  }

  function dlgListen(){
    var s = [];
    for(var i=0;i<DLG.length;i++){
      if(DLG[i].who === "Other") s.push("Other: " + DLG[i].line);
      else s.push("You: " + DLG[i].good);
    }
    speak(s.join(" "));
  }
  function resetDlg(){ resetAwards("dlg_"); renderDialogue(); }

  /* --------------------
     Speaking task
  ---------------------*/
  var GENRES = [
    { id:"g1", title:"Mystery", note:"Use suspense words: clues, twist, cliffhanger." },
    { id:"g2", title:"Comedy", note:"Use tone words: light, witty, hilarious." },
    { id:"g3", title:"Drama", note:"Use character words: relationships, conflict, growth." },
    { id:"g4", title:"Sci‑Fi", note:"Use world words: future, technology, alternate reality." },
    { id:"g5", title:"Documentary", note:"Use facts words: based on real events, interviews, evidence." }
  ];
  var currentGenre = "g1";

  function renderGenrePills(){
    var wrap = $("genrePills");
    if(!wrap) return;
    wrap.innerHTML = "";
    GENRES.forEach(function(g){
      var b = document.createElement("button");
      b.type="button";
      b.className = "pill" + (g.id === currentGenre ? " is-on" : "");
      b.textContent = g.title;
      b.addEventListener("click", function(){
        currentGenre = g.id;
        renderGenrePills();
        renderGenreNote();
      });
      wrap.appendChild(b);
    });
  }

  function genreObj(){
    for(var i=0;i<GENRES.length;i++) if(GENRES[i].id === currentGenre) return GENRES[i];
    return GENRES[0];
  }
  function renderGenreNote(){
    var el = $("genreNote");
    var g = genreObj();
    if(el) el.textContent = "Tip for this genre: " + g.note;
  }

  function renderSpeakingBuilder(){
    var wrap = $("spkBuilder");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("spkFb"), "", "");

    var fields = [
      { id:"sTitle", label:"Title of the series", ph:"(example) Stranger Things / Lupin / ..."},
      { id:"sGenre", label:"Genre + mood", ph:"mystery, funny, tense, emotional..."},
      { id:"sPremise", label:"Premise (It’s about…)", ph:"It’s about a group of..."},
      { id:"sExperience", label:"Experience (Present Perfect)", ph:"I’ve watched... / I’ve just finished..."},
      { id:"sCompare", label:"Comparison", ph:"more gripping than..., the most binge-worthy..."},
      { id:"sOpinion", label:"Opinion + recommendation", ph:"Overall..., therefore I recommend..."}
    ];

    fields.forEach(function(f){
      var box = document.createElement("div");
      box.className = "field";
      box.innerHTML = '<div class="label">'+esc(f.label)+'</div>' +
                      '<input class="input" id="'+esc(f.id)+'" placeholder="'+esc(f.ph)+'" />';
      wrap.appendChild(box);
    });
  }

  function paragraphText(){
    function v(id){ var el=$(id); return el ? el.value.trim() : ""; }
    var title=v("sTitle"), mood=v("sGenre"), prem=v("sPremise"), exp=v("sExperience"), cmp=v("sCompare"), op=v("sOpinion");
    var parts = [];
    parts.push("I want to talk about " + (title||"this series") + ".");
    parts.push("It is a " + (mood||"…") + " series, and " + (prem||"it follows interesting characters") + ".");
    parts.push("Personally, " + (exp||"I have watched it recently") + ".");
    parts.push("Compared to similar shows, it is " + (cmp||"more gripping than I expected") + ".");
    parts.push("Overall, " + (op||"I recommend it because it is well-written") + ".");
    return parts.join(" ");
  }

  function spkCheck(){
    var filled=0;
    ["sTitle","sGenre","sPremise","sExperience","sCompare","sOpinion"].forEach(function(id){
      var el=$(id);
      if(el && el.value.trim().length) filled += 1;
    });
    if(filled >= 4){
      awardOnce("spk_done", 4);
      fb($("spkFb"), "✅ Great! Now listen to your review.", "good");
    }else{
      fb($("spkFb"), "❌ Add more detail. Aim for at least 4 fields.", "bad");
    }
  }
  function spkHint(){ fb($("spkFb"), "Hint: Use: I’ve just finished… However… Therefore… and a comparative (more … than).", "warn"); }
  function spkSpeak(){ speak(paragraphText()); }
  function spkListenTemplate(){
    speak("Start with the title and genre. Explain the premise. Use present perfect to talk about your viewing experience. Add connectors and a comparison. Finish with an overall recommendation.");
  }
  function resetSpk(){ resetAwards("spk_"); renderSpeakingBuilder(); }

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
     Reset all
  ---------------------*/
  function resetAll(){
    state.awarded = {};
    setScore(0);

    resetHistory();
    resetVocab();
    resetVM();
    resetGrammar();
    resetDlg();
    resetSpk();

    ["histFb","vmFb","tenseFb","connFb","ordFb","dlgFb","spkFb"].forEach(function(id){
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
      speak("Welcome to the TV series lesson. You will learn vocabulary and grammar to discuss episodes, characters, and story arcs. You will practice present perfect versus past simple, connectors, and comparisons. At the end, you will build and speak your own series review.");
    });
    if($("btnSpeakFrames")) $("btnSpeakFrames").addEventListener("click", function(){
      speak("It is about... The main character is... First... Then... However... Therefore... In addition... Overall, I recommend it because...");
    });

    if($("btnPrintGrammar")) $("btnPrintGrammar").addEventListener("click", printGrammar);

    if($("historyListen")) $("historyListen").addEventListener("click", historyListen);
    if($("historyReset")) $("historyReset").addEventListener("click", resetHistory);

    if($("histHint")) $("histHint").addEventListener("click", histHint);
    if($("histQuizReset")) $("histQuizReset").addEventListener("click", function(){ resetAwards("hist_"); renderHistMCQ(); fb($("histFb"), "", ""); });

    if($("vocabReset")) $("vocabReset").addEventListener("click", function(){ resetAwards("vocab_"); resetVocab(); });
    if($("vmHint")) $("vmHint").addEventListener("click", vmHint);
    if($("vmReset")) $("vmReset").addEventListener("click", resetVM);

    if($("grammarListen")) $("grammarListen").addEventListener("click", grammarListen);
    if($("grammarReset")) $("grammarReset").addEventListener("click", resetGrammar);

    if($("tenseHint")) $("tenseHint").addEventListener("click", tenseHint);
    if($("tenseReset")) $("tenseReset").addEventListener("click", resetTense);

    if($("connHint")) $("connHint").addEventListener("click", connHint);
    if($("connReset")) $("connReset").addEventListener("click", resetConn);

    if($("ordHint")) $("ordHint").addEventListener("click", ordHint);
    if($("ordReset")) $("ordReset").addEventListener("click", resetOrder);

    if($("dlgListen")) $("dlgListen").addEventListener("click", dlgListen);
    if($("dlgReset")) $("dlgReset").addEventListener("click", resetDlg);

    if($("spkListen")) $("spkListen").addEventListener("click", spkListenTemplate);
    if($("spkReset")) $("spkReset").addEventListener("click", resetSpk);
    if($("spkCheck")) $("spkCheck").addEventListener("click", spkCheck);
    if($("spkHint")) $("spkHint").addEventListener("click", spkHint);
    if($("spkSpeak")) $("spkSpeak").addEventListener("click", spkSpeak);

    if($("resetAll")) $("resetAll").addEventListener("click", resetAll);
  }

  function init(){
    load();
    setAccent(state.accent);
    setScore(state.score);

    renderTimeline();
    renderHistMCQ();

    renderFilters();
    renderVocab();
    renderVocabMatch();

    renderTenseMCQ();
    renderConnectors();
    renderOrder();

    renderDialogue();

    renderGenrePills();
    renderGenreNote();
    renderSpeakingBuilder();

    bind();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
