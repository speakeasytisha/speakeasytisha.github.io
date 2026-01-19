/* SpeakEasyTisha — Movies Part 2 (Blockbuster)
   - Touch-friendly (Mac + iPad Safari)
   - Accent toggle (US/UK) using speechSynthesis
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

  function norm(s){ return String(s||"").trim().toLowerCase(); }

  /* --------------------
     State + scoring
  ---------------------*/
  var STORAGE_KEY = "se_movies_part2_v1";
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
     Reading data
  ---------------------*/
  var READ = {
    text: function(){
      var el = $("readText");
      return el ? el.textContent : "";
    },
    mcq: [
      { id:"r1", q:"What helped this film reach audiences quickly?", a:"A wide release with strong marketing", opts:["A slow release in a few theaters","A wide release with strong marketing","Only film festivals"] },
      { id:"r2", q:"What creates tension in the film?", a:"Music, editing, and what is not shown", opts:["Only long dialogue scenes","Music, editing, and what is not shown","Random scenes with no structure"] },
      { id:"r3", q:"What is the story’s basic setup?", a:"A town faces danger and three men confront it", opts:["A space mission to another planet","A town faces danger and three men confront it","A romance in Paris"] }
    ],
    reveal: [
      { w:"wide release", d:"opening in many theaters at the same time" },
      { w:"marketing", d:"advertising to attract an audience" },
      { w:"tension", d:"a feeling of suspense or nervousness" },
      { w:"editing", d:"how shots are cut and arranged" },
      { w:"unforgettable", d:"very memorable; hard to forget" }
    ]
  };

  function renderReading(){
    var wrap = $("readMCQ"), rwrap = $("readReveal");
    if(wrap) wrap.innerHTML = "";
    if(rwrap) rwrap.innerHTML = "";
    fb($("readFb"), "", "");

    if(wrap){
      READ.mcq.forEach(function(item){
        var box = document.createElement("div");
        box.className = "mcqQ";
        box.innerHTML = "<b>" + esc(item.q) + "</b>";
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
              awardOnce("read_" + item.id, 1);
              fb($("readFb"), "✅ Correct!", "good");
            }else{
              b.classList.add("bad");
              fb($("readFb"), "❌ Not quite. Hint: read the text again.", "bad");
            }
          });
          ch.appendChild(b);
        });
        box.appendChild(ch);
        wrap.appendChild(box);
      });
    }

    if(rwrap){
      READ.reveal.forEach(function(it){
        var row = document.createElement("div");
        row.className = "revealItem";
        row.innerHTML = '<div class="revealTop"><b>' + esc(it.w) + '</b><button class="revealBtn" type="button">Reveal</button></div><div class="muted small" style="margin-top:.45rem; display:none;">' + esc(it.d) + '</div>';
        var btn = row.querySelector("button");
        var def = row.querySelector("div.muted");
        btn.addEventListener("click", function(){
          var open = (def.style.display !== "none");
          def.style.display = open ? "none" : "block";
          btn.textContent = open ? "Reveal" : "Hide";
        });
        rwrap.appendChild(row);
      });
    }
  }

  /* --------------------
     Vocab flashcards
  ---------------------*/
  var VOCAB = [
    { theme:"Film talk", icon:"🧩", term:"plot", def:"the main events of the story", ex:"The plot is simple but effective." },
    { theme:"Film talk", icon:"🎞️", term:"scene", def:"a unit of action in a film", ex:"The best scene is the night sequence." },
    { theme:"Film talk", icon:"⚡", term:"suspense", def:"tension that makes you want to know what happens next", ex:"The suspense builds slowly." },
    { theme:"Film talk", icon:"🎼", term:"score", def:"the music written for a film", ex:"The score makes the danger feel closer." },
    { theme:"Film talk", icon:"📣", term:"marketing", def:"advertising to attract an audience", ex:"Marketing made the release a big event." },
    { theme:"Film talk", icon:"🎟️", term:"box office", def:"money earned from ticket sales", ex:"It was a massive box office hit." },

    { theme:"Filmmaking", icon:"🎬", term:"director", def:"the person who guides the artistic vision", ex:"The director controls tension with pacing." },
    { theme:"Filmmaking", icon:"📷", term:"camera angle", def:"the position of the camera (high, low, close-up...)", ex:"A low angle makes the threat feel bigger." },
    { theme:"Filmmaking", icon:"✂️", term:"editing", def:"how shots are cut and arranged", ex:"Quick editing increases panic." },
    { theme:"Filmmaking", icon:"💡", term:"lighting", def:"how light is used to create mood", ex:"Dark lighting makes the ocean look dangerous." },

    { theme:"Describing", icon:"🦈", term:"terrifying", def:"very scary", ex:"It’s more terrifying than I expected." },
    { theme:"Describing", icon:"🎯", term:"iconic", def:"very famous and recognizable", ex:"The music is iconic." },
    { theme:"Describing", icon:"🧊", term:"predictable", def:"easy to guess", ex:"The story is not predictable." },
    { theme:"Describing", icon:"✨", term:"memorable", def:"easy to remember; strong impact", ex:"The opening is unforgettable and memorable." },

    { theme:"Connectors", icon:"🔗", term:"however", def:"introduces a contrast", ex:"I liked the acting; however, the plot is simple." },
    { theme:"Connectors", icon:"🔗", term:"therefore", def:"shows a result", ex:"The music changed; therefore, we felt danger." },
    { theme:"Connectors", icon:"🔗", term:"in addition", def:"adds more information", ex:"In addition, the editing creates tension." },
    { theme:"Connectors", icon:"🔗", term:"suddenly", def:"an unexpected moment", ex:"Suddenly, the water became quiet." }
  ];

  var FILTERS = ["All","Film talk","Filmmaking","Describing","Connectors"];
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
     Vocab match (tap-to-pair)
  ---------------------*/
  var vmPick = { left:null, right:null };

  function vmPairs(){
    var items = VOCAB.slice(0, 8).map(function(v, i){
      return { id:"m"+i, w:v.term, d:v.def };
    });
    return items;
  }

  function renderVocabMatch(){
    var wrap = $("vmGrid");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("vmFb"), "", "");

    vmPick.left = null; vmPick.right = null;

    var pairs = vmPairs();
    var left = shuffle(pairs.map(function(p){ return { id:p.id, text:p.w }; }));
    var right = shuffle(pairs.map(function(p){ return { id:p.id, text:p.d }; }));

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

  function vmHint(){
    fb($("vmFb"), "Hint: Look for a key word (story / tension / advertising / cutting shots).", "warn");
  }

  function resetVM(){
    resetAwards("vm_");
    renderVocabMatch();
  }

  /* --------------------
     Grammar A — Narrative builder (not in order)
  ---------------------*/
  var NAR_ITEMS = [
    { id:"n1", target:"People were swimming when the danger appeared.", words:["danger","appeared.","were","People","swimming","when","the"] },
    { id:"n2", target:"While the town was celebrating, the music was getting darker.", words:["was","getting","the","darker.","While","the","town","celebrating,","the","music","was"] },
    { id:"n3", target:"Suddenly, the camera moved closer and everyone screamed.", words:["closer","and","everyone","screamed.","Suddenly,","moved","the","camera"] },
    { id:"n4", target:"The characters decided to leave because the threat was real.", words:["The","characters","decided","to","leave","because","the","threat","was","real."] }
  ];

  function renderNarBuilder(){
    var wrap = $("narBuilder");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("narFb"), "", "");

    NAR_ITEMS.forEach(function(it){
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
        var ok = (norm(sentence) === norm(it.target));
        if(ok){
          awardOnce("nar_" + it.id, 2);
          fb($("narFb"), "✅ " + it.id.toUpperCase() + " correct!", "good");
        }else{
          fb($("narFb"), "❌ Not yet. Use 🔊 Target for this row.", "bad");
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

  function narHint(){
    fb($("narFb"), "Hint: Put the background (was/were + -ing) before the interrupting event (Past Simple).", "warn");
  }

  function resetNar(){
    resetAwards("nar_");
    renderNarBuilder();
  }

  /* --------------------
     Grammar B — Comparatives MCQ
  ---------------------*/
  var CMP_Q = [
    { id:"c1", q:"This film is ____ suspenseful than most modern thrillers.", a:"more", opts:["more","most","the"] },
    { id:"c2", q:"That is the ____ iconic music cue in movie history.", a:"most", opts:["more","most","much"] },
    { id:"c3", q:"The remake is ____ predictable than the original.", a:"more", opts:["more","most","the"] },
    { id:"c4", q:"This is the ____ terrifying scene in the whole film.", a:"most", opts:["more","most","much"] }
  ];

  function renderCMP(){
    var wrap = $("cmpMCQ");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("cmpFb"), "", "");

    CMP_Q.forEach(function(item){
      var box = document.createElement("div");
      box.className = "mcqQ";
      box.innerHTML = "<b>" + esc(item.q) + "</b>";
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
            awardOnce("cmp_" + item.id, 1);
            fb($("cmpFb"), "✅ Correct!", "good");
          }else{
            b.classList.add("bad");
            fb($("cmpFb"), "❌ Not quite. Hint: comparative vs superlative.", "bad");
          }
        });
        ch.appendChild(b);
      });
      box.appendChild(ch);
      wrap.appendChild(box);
    });
  }

  function cmpHint(){
    fb($("cmpFb"), "Hint: comparative = more + adjective. superlative = the most + adjective.", "warn");
  }

  function resetCMP(){
    resetAwards("cmp_");
    renderCMP();
  }

  /* --------------------
     Dialogue (movie club) — clean order
  ---------------------*/
  var DLG = [
    { who:"Clerk", line:"So… what did you think of the film?" },
    { who:"You", good:"First, I loved the suspense; it built slowly.",
      opts:[
        "First, I loved the suspense; it built slowly.",
        "Because, suspense.",
        "I am suspense, yes."
      ]
    },
    { who:"Clerk", line:"Was it scary, or just dramatic?" },
    { who:"You", good:"It was far scarier than I expected, especially the music.",
      opts:[
        "It was far scarier than I expected, especially the music.",
        "It was the more scary of ever.",
        "Scary, but I no know why."
      ]
    },
    { who:"Clerk", line:"How would you describe the main scene?" },
    { who:"You", good:"While people were relaxing, the danger appeared suddenly.",
      opts:[
        "While people were relaxing, the danger appeared suddenly.",
        "People were relax and danger was appearing yesterday.",
        "Suddenly while the appeared, relaxing danger."
      ]
    },
    { who:"Clerk", line:"Would you recommend it?" },
    { who:"You", good:"Yes. In my opinion, it’s one of the most iconic thrillers.",
      opts:[
        "Yes. In my opinion, it’s one of the most iconic thrillers.",
        "Yes. It is the more iconic.",
        "No, yes, maybe iconic."
      ]
    }
  ];
  var dlgPos = 0;

  function addLine(who, text){
    var log = $("dlgLog");
    if(!log) return;
    var div = document.createElement("div");
    div.className = "dLine " + (who === "Clerk" ? "dClerk" : "dYou");
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

    addLine("Clerk", DLG[0].line);
    dlgPos = 1;
    renderChoices();
  }

  function renderChoices(){
    var choices = $("dlgChoices");
    if(!choices) return;
    choices.innerHTML = "";

    if(dlgPos >= DLG.length){
      fb($("dlgFb"), "✅ Dialogue complete! Try retelling the story in your own words.", "good");
      awardOnce("dlg_done", 3);
      return;
    }

    var step = DLG[dlgPos];
    if(step.who === "Clerk"){
      addLine("Clerk", step.line);
      dlgPos += 1;
      renderChoices();
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
          setTimeout(function(){ renderChoices(); }, 250);
        }else{
          b.classList.add("bad");
          fb($("dlgFb"), "❌ Try a more natural phrase. (Hint: use connectors / correct comparative.)", "bad");
          for(var k2=0;k2<all.length;k2++) all[k2].disabled = false;
        }
      });
      choices.appendChild(b);
    });
  }

  function dlgListen(){
    var s = [];
    for(var i=0;i<DLG.length;i++){
      if(DLG[i].who === "Clerk") s.push("Clerk: " + DLG[i].line);
      else s.push("You: " + DLG[i].good);
    }
    speak(s.join(" "));
  }

  function resetDlg(){
    resetAwards("dlg_");
    renderDialogue();
  }

  /* --------------------
     Speaking task (scene pills + builder)
  ---------------------*/
  var SCENES = [
    { id:"s1", title:"Opening tension", note:"Focus on atmosphere, music, camera angles, and suspense." },
    { id:"s2", title:"Town meeting", note:"Use connectors to explain opinions and decisions." },
    { id:"s3", title:"Ocean hunt", note:"Use Past Continuous for background + Past Simple for events." }
  ];
  var currentScene = "s1";

  function renderScenePills(){
    var wrap = $("scenePills");
    if(!wrap) return;
    wrap.innerHTML = "";
    SCENES.forEach(function(s){
      var b = document.createElement("button");
      b.type="button";
      b.className = "pill" + (s.id === currentScene ? " is-on" : "");
      b.textContent = s.title;
      b.addEventListener("click", function(){
        currentScene = s.id;
        renderScenePills();
        renderSceneNote();
      });
      wrap.appendChild(b);
    });
  }

  function sceneObj(){
    for(var i=0;i<SCENES.length;i++) if(SCENES[i].id === currentScene) return SCENES[i];
    return SCENES[0];
  }

  function renderSceneNote(){
    var el = $("sceneNote");
    var s = sceneObj();
    if(el) el.textContent = "Scene focus: " + s.note;
  }

  function renderSpeakingBuilder(){
    var wrap = $("spkBuilder");
    if(!wrap) return;
    wrap.innerHTML = "";
    fb($("spkFb"), "", "");

    var fields = [
      { id:"tGenre", label:"Genre + mood", ph:"thriller, suspenseful, tense..." },
      { id:"tSetting", label:"Setting (where/when)", ph:"at the beach, at night, in a small town..." },
      { id:"tBackground", label:"Background action (Past Continuous)", ph:"People were swimming / the town was celebrating..." },
      { id:"tEvent", label:"Main event (Past Simple)", ph:"The danger appeared / they decided to..." },
      { id:"tCompare", label:"Comparison", ph:"more suspenseful than..., the most iconic..." },
      { id:"tOpinion", label:"Opinion + recommendation", ph:"In my opinion..., therefore I recommend..." }
    ];

    fields.forEach(function(f){
      var box = document.createElement("div");
      box.className = "field";
      box.innerHTML = '<div class="label">' + esc(f.label) + '</div>' +
                      '<input class="input" id="' + esc(f.id) + '" placeholder="' + esc(f.ph) + '" />';
      wrap.appendChild(box);
    });
  }

  function paragraphText(){
    function v(id){ var el=$(id); return el ? el.value.trim() : ""; }
    var g=v("tGenre"), set=v("tSetting"), bg=v("tBackground"), ev=v("tEvent"), cmp=v("tCompare"), op=v("tOpinion");
    var parts = [];
    parts.push("First, this scene feels " + (g||"…") + " and it takes place " + (set||"…") + ".");
    parts.push("While " + (bg||"…") + ", " + (ev||"…") + ".");
    parts.push("In addition, the music and editing increase the suspense.");
    parts.push("Compared to other films, it is " + (cmp||"…") + ".");
    parts.push("Finally, in my opinion, " + (op||"…") + ".");
    return parts.join(" ");
  }

  function spkCheck(){
    var filled=0;
    ["tGenre","tSetting","tBackground","tEvent","tCompare","tOpinion"].forEach(function(id){
      var el=$(id);
      if(el && el.value.trim().length) filled += 1;
    });
    if(filled >= 4){
      awardOnce("spk_done", 4);
      fb($("spkFb"), "✅ Great! Now listen to your paragraph.", "good");
    }else{
      fb($("spkFb"), "❌ Add more detail. Aim for at least 4 fields.", "bad");
    }
  }

  function spkHint(){
    fb($("spkFb"), "Hint: Use 'While...' + Past Continuous, then Past Simple. Add 'however' or 'therefore' and a comparative.", "warn");
  }

  function spkSpeak(){ speak(paragraphText()); }

  function spkListenTemplate(){
    speak("First, describe the mood and setting. While people were doing something, a main event happened. In addition, mention music, editing, and camera. Compared to another film, say it is more suspenseful or the most iconic. Finally, give your opinion and recommendation.");
  }

  function resetSpk(){
    resetAwards("spk_");
    renderSpeakingBuilder();
  }

  /* --------------------
     Print grammar
  ---------------------*/
  function printGrammar(){
    document.body.classList.add("se2-print-grammar");
    function cleanup(){
      document.body.classList.remove("se2-print-grammar");
      window.removeEventListener("afterprint", cleanup);
    }
    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(function(){ try{ cleanup(); }catch(e){} }, 1200);
  }

  /* --------------------
     Resets
  ---------------------*/
  function resetReading(){
    resetAwards("read_");
    renderReading();
  }

  function resetGrammar(){
    resetNar();
    resetCMP();
  }

  function resetAll(){
    state.awarded = {};
    setScore(0);

    resetReading();
    resetVocab();
    resetVM();
    resetGrammar();
    resetDlg();
    resetSpk();

    ["readFb","vmFb","narFb","cmpFb","dlgFb","spkFb"].forEach(function(id){
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
      speak("Welcome to movies part two. Today we explore the modern blockbuster using Jaws style storytelling. You will practice narrative tenses, connectors, and comparatives. You will also learn blockbuster vocabulary and complete interactive activities.");
    });
    if($("btnSpeakFrames")) $("btnSpeakFrames").addEventListener("click", function(){
      speak("First, the story is about... Then, the main character... However, the conflict... In addition, the music... Compared to... The best scene is... Finally, I recommend it because...");
    });

    if($("btnPrintGrammar")) $("btnPrintGrammar").addEventListener("click", printGrammar);

    if($("readListen")) $("readListen").addEventListener("click", function(){ speak(READ.text()); });
    if($("readReset")) $("readReset").addEventListener("click", resetReading);

    if($("vocabReset")) $("vocabReset").addEventListener("click", function(){
      resetAwards("vocab_");
      resetVocab();
    });

    if($("vmHint")) $("vmHint").addEventListener("click", vmHint);
    if($("vmReset")) $("vmReset").addEventListener("click", resetVM);

    if($("grammarListen")) $("grammarListen").addEventListener("click", function(){
      speak("Narrative tenses: Past Continuous for background and Past Simple for events. Use when and while. Comparatives and superlatives help you compare films: more suspenseful than, the most iconic, the best scene.");
    });
    if($("grammarReset")) $("grammarReset").addEventListener("click", resetGrammar);

    if($("narHint")) $("narHint").addEventListener("click", narHint);
    if($("narReset")) $("narReset").addEventListener("click", resetNar);

    if($("cmpHint")) $("cmpHint").addEventListener("click", cmpHint);
    if($("cmpReset")) $("cmpReset").addEventListener("click", resetCMP);

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

    renderReading();

    renderFilters();
    renderVocab();
    renderVocabMatch();

    renderNarBuilder();
    renderCMP();

    renderDialogue();

    renderScenePills();
    renderSceneNote();
    renderSpeakingBuilder();

    bind();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
