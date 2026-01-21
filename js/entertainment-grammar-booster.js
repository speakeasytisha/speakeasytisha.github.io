/* SpeakEasyTisha — Entertainment Grammar Booster (Add-on)
   Focus: likes/dislikes, adding info, comparing.
   Touch-friendly: every builder is TAP-based (no drag required).
   Includes robust US/UK speechSynthesis + unlock for Safari.
*/
(function(){
  "use strict";

  function $(id){ return document.getElementById(id); }
  function $all(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function norm(s){ return String(s||"").trim().toLowerCase(); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]; }); }

  /* ---------------------------
     Local Storage + Score
  ----------------------------*/
  var LS_KEY = "SET_ENT_GRAMMAR_BOOSTER_V1";
  var state = { score: 0, accent: "en-US", seen: {}, upgrades: {} };

  function loadState(){
    try{
      var raw = localStorage.getItem(LS_KEY);
      if(raw){ state = Object.assign(state, JSON.parse(raw)); }
    }catch(e){}
    renderScore();
    setAccent(state.accent || "en-US");
  }
  function saveState(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){}
  }
  function addScore(n){
    state.score = Math.max(0, (state.score|0) + (n|0));
    renderScore();
    saveState();
  }
  function renderScore(){
    var el = $("globalScore");
    if(el) el.textContent = String(state.score|0);
  }

  /* ---------------------------
     Speech (robust)
  ----------------------------*/
  var TTS = {
    voices: [],
    unlocked: false,
    statusEl: null,
    init: function(){
      this.statusEl = $("ttsStatus");
      this.warmup();
      var self = this;

      // Keep updating when voices load
      if(window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined){
        window.speechSynthesis.onvoiceschanged = function(){
          self.warmup();
        };
      }
    },
    setStatus: function(msg){
      if(this.statusEl) this.statusEl.textContent = msg;
    },
    warmup: function(){
      if(!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined"){
        this.setStatus("Voice: not supported");
        return;
      }
      try{ window.speechSynthesis.getVoices(); }catch(e){}
      this.voices = window.speechSynthesis.getVoices() || [];
      this.setStatus(this.voices.length ? ("Voice: ready (" + this.voices.length + ")") : "Voice: loading…");
    },
    pick: function(lang){
      var voices = this.voices && this.voices.length ? this.voices : (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
      if(!voices || !voices.length) return null;

      var lower = String(lang||"").toLowerCase();
      for(var i=0;i<voices.length;i++){
        if(String(voices[i].lang||"").toLowerCase() === lower) return voices[i];
      }
      var pref = lower.split("-")[0];
      for(var j=0;j<voices.length;j++){
        var vl = String(voices[j].lang||"").toLowerCase();
        if(vl.indexOf(pref) === 0) return voices[j];
      }
      return voices[0];
    },
    unlock: function(){
      if(this.unlocked) return true;
      if(!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return false;
      try{
        var u = new SpeechSynthesisUtterance(" ");
        u.lang = state.accent;
        u.volume = 0;
        window.speechSynthesis.speak(u);
        this.unlocked = true;
        this.setStatus("Voice: unlocked");
        // warmup again
        var self = this;
        setTimeout(function(){ self.warmup(); }, 250);
        return true;
      }catch(e){
        this.setStatus("Voice: unlock failed");
        return false;
      }
    },
    speak: function(text){
      if(!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
      var say = String(text||"").trim();
      if(!say) return;

      try{ window.speechSynthesis.resume(); }catch(e){}
      try{
        if(window.speechSynthesis.speaking || window.speechSynthesis.pending){
          window.speechSynthesis.cancel();
        }
      }catch(e2){}

      if(!this.unlocked){ this.unlock(); }

      var u = new SpeechSynthesisUtterance(say);
      u.lang = state.accent;
      u.rate = 0.95;

      var v = this.pick(state.accent);
      if(v) u.voice = v;

      var self = this;
      u.onstart = function(){ self.setStatus("Voice: speaking…"); };
      u.onend = function(){ self.warmup(); };
      u.onerror = function(){ self.setStatus("Voice: error"); };

      window.speechSynthesis.speak(u);
    }
  };

  function setAccent(lang){
    state.accent = lang;
    saveState();
    var us = $("accentUS"), uk = $("accentUK");
    if(us && uk){
      us.setAttribute("aria-pressed", lang === "en-US" ? "true" : "false");
      uk.setAttribute("aria-pressed", lang === "en-GB" ? "true" : "false");
    }
    // Update warmup / voice pick
    if(TTS) TTS.warmup();
  }

  /* ---------------------------
     Intro + Frames
  ----------------------------*/
  function bindFrames(){
    $all(".frame").forEach(function(btn){
      btn.addEventListener("click", function(){
        var s = btn.getAttribute("data-say") || btn.textContent;
        TTS.speak(s);
      });
    });
    var framesListen = $("framesListenBtn");
    if(framesListen){
      framesListen.addEventListener("click", function(){
        var s = "Here are your speaking frames: I really liked it because it was funny and well-paced. I didn't like it very much, but the acting was good. Compared to the last episode, this one was more intense. Overall, I would recommend it.";
        TTS.speak(s);
      });
    }
    var intro = $("introListenBtn");
    if(intro){
      intro.addEventListener("click", function(){
        TTS.speak("Welcome. This booster helps you talk about movies and TV naturally. Start with likes and dislikes, add a reason with because, add information with also and however, then compare with more than and better than. Finish with the pro review builder.");
      });
    }
  }

  /* ---------------------------
     Speaking timer (60s)
  ----------------------------*/
  var timerInt = null;
  function startTimer(secs){
    secs = secs || 60;
    var box = $("speakingTimer");
    if(!box) return;
    var fill = $("timerFill");
    var label = $("timerSecs");
    box.hidden = false;

    var left = secs;
    label.textContent = String(left);
    if(fill) fill.style.width = "0%";

    if(timerInt) clearInterval(timerInt);
    var total = secs;
    timerInt = setInterval(function(){
      left--;
      label.textContent = String(Math.max(0,left));
      var pct = ((total-left)/total)*100;
      if(fill) fill.style.width = pct + "%";
      if(left <= 0){
        clearInterval(timerInt); timerInt = null;
        TTS.speak("Great. Now try again without reading.");
      }
    }, 1000);
  }
  function stopTimer(){
    if(timerInt) clearInterval(timerInt);
    timerInt = null;
    var box = $("speakingTimer");
    if(box) box.hidden = true;
  }

  /* ---------------------------
     Teacher notes toggle
  ----------------------------*/
  function bindTeacherNotes(){
    var btn = $("teacherNotesToggle");
    var panel = $("teacherNotes");
    if(!btn || !panel) return;
    btn.addEventListener("click", function(){
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      panel.hidden = expanded;
    });
  }

  /* ---------------------------
     Print grammar
  ----------------------------*/
  function bindPrint(){
    var btn = $("printGrammarBtn");
    if(btn) btn.addEventListener("click", function(){ window.print(); });
  }

  /* ---------------------------
     Reset all
  ----------------------------*/
  function resetAll(){
    if(!confirm("Reset score + progress on this page?")) return;
    state.score = 0;
    state.seen = {};
    state.upgrades = {};
    saveState();
    renderScore();
    // clear feedback and answers
    $all(".fb").forEach(function(el){ el.textContent=""; el.classList.remove("good","bad"); });
    // reset builders
    $all("[data-reset-build]").forEach(function(btn){ btn.click(); });
    $all("[data-reset-fill]").forEach(function(btn){ btn.click(); });
    // reset upgrades
    $all(".upgrade").forEach(function(u){
      var out = u.querySelector(".upgrade__out");
      if(out) out.textContent = "";
    });
    // reset comparison + review
    if($("cmpOut")) $("cmpOut").textContent = "";
    if($("rvOut")) $("rvOut").textContent = "";
  }

  /* ---------------------------
     Section listen + reset
  ----------------------------*/
  var sectionScripts = {
    lvl1: "Level one: likes and dislikes. Use I like plus a noun, and I enjoy plus verb ing. Use prefer A to B.",
    lvl2: "Level two: add a reason with because. Keep it simple: because it was exciting, because it was too long.",
    lvl3: "Level three: add information with also, and contrast with however. This makes your speech flow.",
    lvl4: "Level four: compare with more than, less than, and better than. You can also use not as good as.",
    final: "Final task: build a complete review. Title and genre, opinion, reason, extra info, comparison, recommendation."
  };

  function bindSectionButtons(){
    $all("[data-section-listen]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-section-listen");
        TTS.speak(sectionScripts[id] || "Let's practice.");
      });
    });
    $all("[data-section-reset]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-section-reset");
        resetSection(id);
      });
    });
  }

  function resetSection(id){
    // reset all feedback inside that section
    var root = $(id);
    if(!root) return;
    $all(".fb", root).forEach(function(el){ el.textContent=""; el.classList.remove("good","bad"); });
    $all(".hint", root).forEach(function(h){ h.hidden = true; });
    // builders/fills inside
    $all("[data-reset-build]", root).forEach(function(btn){ btn.click(); });
    $all("[data-reset-fill]", root).forEach(function(btn){ btn.click(); });
    // upgrades inside
    $all(".upgrade", root).forEach(function(u){
      var out = u.querySelector(".upgrade__out");
      if(out) out.textContent = "";
    });
    // clear outputs
    if(id === "lvl4" && $("cmpOut")) $("cmpOut").textContent = "";
    if(id === "final" && $("rvOut")) $("rvOut").textContent = "";
  }

  /* ---------------------------
     Hints + reset buttons by id
  ----------------------------*/
  function bindHintsAndResets(){
    $all("[data-hint]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-hint");
        var el = $("hint-" + id);
        if(el) el.hidden = !el.hidden;
      });
    });
    $all("[data-reset]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-reset");
        // just clear feedback/hints within that exercise
        var root = $(id);
        if(!root) return;
        $all(".fb", root).forEach(function(el){ el.textContent=""; el.classList.remove("good","bad"); });
        $all(".hint", root).forEach(function(h){ h.hidden = true; });
        $all("[data-reset-build]", root).forEach(function(b){ b.click(); });
        $all("[data-reset-fill]", root).forEach(function(b){ b.click(); });
        $all(".upgrade__out", root).forEach(function(o){ o.textContent=""; });
      });
    });
  }

  /* ---------------------------
     MCQ handling
  ----------------------------*/
  function markFB(block, ok, msg){
    var fb = block.querySelector(".fb");
    if(!fb) return;
    fb.textContent = msg;
    fb.classList.remove("good","bad");
    fb.classList.add(ok ? "good" : "bad");
  }

  function bindMCQ(){
    $all(".qBlock").forEach(function(block){
      var qid = block.getAttribute("data-qid") || "";
      $all(".opt", block).forEach(function(btn){
        btn.addEventListener("click", function(){
          var correct = btn.getAttribute("data-correct") === "1";
          if(correct){
            // only score first time per question
            if(!state.seen[qid]){
              addScore(1);
              state.seen[qid] = true;
              saveState();
            }
            markFB(block, true, "✅ Correct!");
          }else{
            markFB(block, false, "❌ Try again.");
          }
        });
      });
    });
  }

  /* ---------------------------
     Tap-to-build sentences
  ----------------------------*/
  function splitWords(sentence){
    // simple split; keep apostrophes as part of tokens
    return sentence.split(" ").filter(Boolean);
  }
  function shuffle(arr){
    var a = arr.slice();
    for(var i=a.length-1;i>0;i--){
      var j = Math.floor(Math.random()*(i+1));
      var t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function setupBuilds(){
    $all(".build").forEach(function(b){
      var answer = b.getAttribute("data-answer") || "";
      var tokens = splitWords(answer);
      // shuffle with small perturbation
      var bank = shuffle(tokens);
      var tiles = b.querySelector(".tiles");
      var ans = b.querySelector(".answer");
      var fb = b.querySelector(".fb");
      function renderBank(){
        tiles.innerHTML = "";
        bank.forEach(function(tok){
          var t = document.createElement("button");
          t.type = "button";
          t.className = "tile";
          t.textContent = tok;
          t.addEventListener("click", function(){
            // move tok from bank to answer
            bank = bank.filter(function(x,i){ return i !== bank.indexOf(tok); });
            var t2 = document.createElement("button");
            t2.type = "button";
            t2.className = "tile";
            t2.textContent = tok;
            t2.addEventListener("click", function(){
              // move back
              bank.push(tok);
              t2.remove();
              renderBank();
            });
            ans.appendChild(t2);
            renderBank();
          });
          tiles.appendChild(t);
        });
      }
      function getAnswer(){
        return $all(".tile", ans).map(function(x){ return x.textContent; }).join(" ").trim();
      }
      function reset(){
        ans.innerHTML = "";
        bank = shuffle(tokens);
        renderBank();
        if(fb){ fb.textContent=""; fb.classList.remove("good","bad"); }
      }
      // initialize bank once
      renderBank();

      var checkBtn = b.querySelector("[data-check-build]");
      var sayBtn = b.querySelector("[data-say-build]");
      var resetBtn = b.querySelector("[data-reset-build]");
      if(checkBtn){
        checkBtn.addEventListener("click", function(){
          var user = getAnswer();
          var ok = norm(user) === norm(answer);
          if(ok){
            if(!state.seen[b.getAttribute("data-build-id")]){
              addScore(2);
              state.seen[b.getAttribute("data-build-id")] = true;
              saveState();
            }
            if(fb){ fb.textContent = "✅ Correct!"; fb.classList.add("good"); fb.classList.remove("bad"); }
          }else{
            if(fb){ fb.textContent = "❌ Not yet. Try again."; fb.classList.add("bad"); fb.classList.remove("good"); }
          }
        });
      }
      if(sayBtn){
        sayBtn.addEventListener("click", function(){
          TTS.speak(answer);
        });
      }
      if(resetBtn){
        resetBtn.addEventListener("click", reset);
      }
      // store reset function on element
      b.__reset = reset;
    });
  }

  /* ---------------------------
     Reasons chips + tap-to-fill
  ----------------------------*/
  var REASONS = [
    {t:"it was exciting", fr:"c'était passionnant"},
    {t:"it was funny", fr:"c'était drôle"},
    {t:"it was scary", fr:"c'était effrayant"},
    {t:"it was too slow", fr:"c'était trop lent"},
    {t:"it was too long", fr:"c'était trop long"},
    {t:"the acting was great", fr:"le jeu d'acteur était super"},
    {t:"the music was amazing", fr:"la musique était incroyable"},
    {t:"the story was clear", fr:"l'histoire était claire"}
  ];

  function renderReasons(){
    var box = $("reasonsChips");
    if(!box) return;
    box.innerHTML = "";
    REASONS.forEach(function(r){
      var b = document.createElement("button");
      b.type="button";
      b.className="chip";
      b.textContent = r.t;
      b.title = "FR: " + r.fr;
      b.addEventListener("click", function(){
        // Just speak the reason
        TTS.speak(r.t);
      });
      box.appendChild(b);
    });
  }

  function setupFills(){
    $all(".fill").forEach(function(f){
      var sentence = f.getAttribute("data-sentence") || "";
      var line = f.querySelector(".fill__line");
      var bank = f.querySelector(".wordbank");
      var fb = f.querySelector(".fb");
      var blankChoice = null;

      function makeLine(){
        // render sentence with clickable blank
        var parts = sentence.split("____");
        line.innerHTML = esc(parts[0]) + ' <span class="blank" tabindex="0" role="button" aria-label="blank">tap to choose</span> ' + esc(parts[1] || "");
      }
      function setBlank(txt){
        var blank = f.querySelector(".blank");
        if(blank){
          blank.textContent = txt;
          blank.classList.add("filled");
        }
      }
      function getBlank(){
        var blank = f.querySelector(".blank");
        return blank ? blank.textContent : "";
      }
      function reset(){
        makeLine();
        if(bank) renderBank();
        if(fb){ fb.textContent=""; fb.classList.remove("good","bad"); }
        blankChoice = null;
      }

      function renderBank(){
        bank.innerHTML = "";
        REASONS.forEach(function(r){
          var b = document.createElement("button");
          b.type="button";
          b.className="tile";
          b.textContent = r.t;
          b.addEventListener("click", function(){
            setBlank(r.t);
            blankChoice = r.t;
          });
          bank.appendChild(b);
        });
      }

      makeLine();
      renderBank();

      var checkBtn = f.querySelector("[data-check-fill]");
      var sayBtn = f.querySelector("[data-say-fill]");
      var resetBtn = f.querySelector("[data-reset-fill]");

      if(checkBtn){
        checkBtn.addEventListener("click", function(){
          var txt = getBlank();
          if(!txt || txt === "tap to choose"){
            if(fb){ fb.textContent="❌ Choose a reason first."; fb.classList.add("bad"); fb.classList.remove("good"); }
            return;
          }
          // any reason is acceptable here
          var id = "fill:" + (f.getAttribute("data-fill-id") || "");
          if(!state.seen[id]){
            addScore(2);
            state.seen[id] = true;
            saveState();
          }
          if(fb){ fb.textContent="✅ Great!"; fb.classList.add("good"); fb.classList.remove("bad"); }
        });
      }
      if(sayBtn){
        sayBtn.addEventListener("click", function(){
          var txt = (sentence.replace("____", getBlank() || "it was exciting")).replace(/\s+/g," ").trim();
          TTS.speak(txt);
        });
      }
      if(resetBtn){
        resetBtn.addEventListener("click", reset);
      }
      f.__reset = reset;
    });
  }

  /* ---------------------------
     Upgrade widgets
  ----------------------------*/
  function bindUpgrades(){
    $all(".upgrade").forEach(function(u){
      var out = u.querySelector(".upgrade__out");
      var a = u.getAttribute("data-a") || "";
      var b = u.getAttribute("data-b") || "";
      var c = u.getAttribute("data-c") || "";
      function show(step){
        var txt = step === "a" ? a : (step === "b" ? b : c);
        if(out) out.textContent = txt;
      }
      $all(".cardBtn", u).forEach(function(btn){
        btn.addEventListener("click", function(){
          show(btn.getAttribute("data-step"));
        });
      });
      var listen = u.querySelector("[data-up-listen]");
      if(listen){
        listen.addEventListener("click", function(){
          var txt = out && out.textContent ? out.textContent : c;
          TTS.speak(txt);
        });
      }
      var score = u.querySelector("[data-up-score]");
      if(score){
        score.addEventListener("click", function(){
          var id = "up:" + (u.getAttribute("data-up") || "");
          if(!state.seen[id]){
            addScore(2);
            state.seen[id] = true;
            saveState();
          }
          if(out && out.textContent){
            // small confirm
            out.textContent = out.textContent + " ✅";
          }else{
            show("c");
            if(out) out.textContent = out.textContent + " ✅";
          }
        });
      }
    });
  }

  /* ---------------------------
     Compare builder
  ----------------------------*/
  function bindCompare(){
    var out = $("cmpOut");
    function build(){
      var a = $("cmpA").value;
      var comp = $("cmpComp").value;
      var b = $("cmpB").value;
      var s = a + " " + comp + " " + b;
      if(out) out.textContent = s;
      return s;
    }
    var buildBtn = $("cmpBuildBtn");
    var listenBtn = $("cmpListenBtn");
    var scoreBtn = $("cmpScoreBtn");
    var resetBtn = $("cmpResetBtn");

    if(buildBtn) buildBtn.addEventListener("click", build);
    if(listenBtn) listenBtn.addEventListener("click", function(){ TTS.speak(build()); });
    if(scoreBtn) scoreBtn.addEventListener("click", function(){
      if(!state.seen["cmp"]){
        addScore(2);
        state.seen["cmp"] = true;
        saveState();
      }
    });
    if(resetBtn) resetBtn.addEventListener("click", function(){ if(out) out.textContent=""; state.seen["cmp"]=false; saveState(); });
  }

  /* ---------------------------
     Review builder
  ----------------------------*/
  function bindReview(){
    var out = $("rvOut");
    function build(){
      var title = ($("rvTitle").value || "This").trim();
      var type = $("rvType").value;
      var genre = $("rvGenre").value;
      var opinion = $("rvOpinion").value;
      var reason = $("rvReason").value;
      var add = $("rvAdd").value;
      var cmp = $("rvCmp").value;
      var rec = $("rvRec").value;

      // title formatting
      var intro = title.toLowerCase() === "this" ? "This " + type : (title + " is a " + type);
      var s = intro + " in the " + genre + " genre. " +
              opinion + " because " + reason + ". " +
              add + " " +
              cmp + " " +
              rec;

      s = s.replace(/\s+/g, " ").trim();
      if(out) out.textContent = s;
      return s;
    }

    var buildBtn = $("rvBuildBtn");
    var listenBtn = $("rvListenBtn");
    var timerBtn = $("rvTimerBtn");
    var copyBtn = $("rvCopyBtn");
    var scoreBtn = $("rvScoreBtn");
    var resetBtn = $("rvResetBtn");

    if(buildBtn) buildBtn.addEventListener("click", build);
    if(listenBtn) listenBtn.addEventListener("click", function(){ TTS.speak(build()); });
    if(timerBtn) timerBtn.addEventListener("click", function(){ startTimer(60); });
    if(copyBtn) copyBtn.addEventListener("click", function(){
      var txt = build();
      try{
        navigator.clipboard.writeText(txt);
        addScore(1);
      }catch(e){}
    });
    if(scoreBtn) scoreBtn.addEventListener("click", function(){
      if(!state.seen["review"]){
        addScore(5);
        state.seen["review"] = true;
        saveState();
      }
    });
    if(resetBtn) resetBtn.addEventListener("click", function(){
      if(out) out.textContent = "";
      $("rvTitle").value = "";
    });
  }

  /* ---------------------------
     Global binders
  ----------------------------*/
  function bindGlobal(){
    var resetBtn = $("resetAllBtn");
    if(resetBtn) resetBtn.addEventListener("click", resetAll);

    var us = $("accentUS"), uk = $("accentUK");
    if(us) us.addEventListener("click", function(){ setAccent("en-US"); });
    if(uk) uk.addEventListener("click", function(){ setAccent("en-GB"); });

    var enable = $("enableVoiceBtn");
    if(enable) enable.addEventListener("click", function(){ TTS.unlock(); });

    var test = $("testVoiceBtn");
    if(test) test.addEventListener("click", function(){
      TTS.unlock();
      TTS.speak("Voice test. You can now listen to models in US or UK accent.");
    });

    var practice = $("framesPracticeBtn");
    if(practice) practice.addEventListener("click", function(){ startTimer(60); });

    var stop = $("timerStopBtn");
    if(stop) stop.addEventListener("click", stopTimer);

    // clicking anywhere after load can unlock on iOS if user didn't click enable
    document.addEventListener("pointerdown", function(){
      // don't spam; only attempt once
      if(!TTS.unlocked){
        // silent unlock only if speech API exists
        if(window.speechSynthesis) TTS.unlock();
      }
    }, { once:true });
  }

  /* ---------------------------
     Init
  ----------------------------*/
  function init(){
    loadState();
    TTS.init();

    bindGlobal();
    bindPrint();
    bindTeacherNotes();
    bindSectionButtons();
    bindHintsAndResets();
    bindMCQ();
    setupBuilds();
    renderReasons();
    setupFills();
    bindUpgrades();
    bindCompare();
    bindReview();
    bindFrames();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();
