/* SpeakEasyTisha — Entertainment Follow‑Up
   Adjectives + Connectors + Tenses
   Touch-friendly, instant feedback, hints, score, US/UK speechSynthesis.
*/
(function(){
  "use strict";

  /* ---------------------------
     Helpers
  ----------------------------*/
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

  /* ---------------------------
     Global score (saved)
  ----------------------------*/
  var SCORE_KEY = "SET_ent_followup_score_v1";
  var score = 0;

  function loadScore(){
    try{
      var n = parseInt(localStorage.getItem(SCORE_KEY) || "0", 10);
      score = isFinite(n) ? n : 0;
    }catch(e){ score = 0; }
    $("score").textContent = String(score);
  }
  function setScore(n){
    score = Math.max(0, Math.floor(n));
    $("score").textContent = String(score);
    try{ localStorage.setItem(SCORE_KEY, String(score)); }catch(e){}
  }
  function addPoints(n){
    setScore(score + n);
    toast("+"+n+" point" + (n===1?"":"s"));
  }

  /* ---------------------------
     Toast (tiny feedback)
  ----------------------------*/
  var toastTimer = null;
  function toast(msg){
    var el = document.getElementById("toast");
    if(!el){
      el = document.createElement("div");
      el.id="toast";
      el.style.position="fixed";
      el.style.left="50%";
      el.style.bottom="18px";
      el.style.transform="translateX(-50%)";
      el.style.background="rgba(0,0,0,.65)";
      el.style.border="1px solid rgba(255,255,255,.18)";
      el.style.padding="10px 12px";
      el.style.borderRadius="14px";
      el.style.color="rgba(255,255,255,.92)";
      el.style.fontWeight="800";
      el.style.zIndex="9999";
      el.style.boxShadow="0 14px 38px rgba(0,0,0,.35)";
      el.style.maxWidth="92vw";
      el.style.textAlign="center";
      el.style.display="none";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display="block";
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.style.display="none"; }, 1200);
  }

  /* ---------------------------
     Speech (US/UK)
  ----------------------------*/
  var accent = "US"; // US or UK
  var voiceEnabled = false;
  var voices = [];
  var voice = null;

  function getVoices(){
    try{ return window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
    catch(e){ return []; }
  }

  function pickVoice(){
    voices = getVoices() || [];
    var want = (accent === "UK") ? "en-GB" : "en-US";

    // Prefer exact lang match first
    var best = null;
    for (var i=0;i<voices.length;i++){
      if((voices[i].lang||"").toLowerCase() === want.toLowerCase()){
        best = voices[i]; break;
      }
    }
    // Fallback: any English voice with region
    if(!best){
      for (var j=0;j<voices.length;j++){
        var lang = (voices[j].lang||"").toLowerCase();
        if(lang.startsWith("en-")){ best = voices[j]; break; }
      }
    }
    // Fallback: any voice
    if(!best && voices.length){ best = voices[0]; }
    voice = best;

    var label = "Voice: ";
    if(!window.speechSynthesis){
      label += "not supported";
    }else if(!voices.length){
      label += "loading…";
    }else if(voice){
      label += (voice.name || "English voice") + " (" + (voice.lang||"") + ")";
    }else{
      label += "not found";
    }
    $("voiceLabel").textContent = label;
  }

  function speak(text){
    if(!window.speechSynthesis){ toast("Voice not supported"); return; }
    if(!voiceEnabled){
      toast("Click Enable voice first");
      return;
    }
    var t = String(text||"").trim();
    if(!t) return;
    try{
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(t);
      if(voice) u.voice = voice;
      u.rate = 0.98;
      u.pitch = 1;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    }catch(e){
      toast("Voice error");
    }
  }

  function enableVoice(){
    voiceEnabled = true;
    pickVoice();
    toast("Voice enabled");
  }

  function setAccent(next){
    accent = next;
    $("accentUS").classList.toggle("is-on", accent==="US");
    $("accentUK").classList.toggle("is-on", accent==="UK");
    $("accentUS").setAttribute("aria-pressed", accent==="US" ? "true":"false");
    $("accentUK").setAttribute("aria-pressed", accent==="UK" ? "true":"false");
    pickVoice();
  }

  /* ---------------------------
     Data (adjectives + connectors)
  ----------------------------*/
  var ADJ = {
    plot: [
      { term:"gripping", fr:"captivant(e)", def:"So interesting you can’t stop watching.", ex:"The plot is gripping from the first scene." },
      { term:"suspenseful", fr:"plein de suspense", def:"Creates tension and makes you want to know what happens.", ex:"It’s suspenseful, especially near the end." },
      { term:"predictable", fr:"prévisible", def:"Easy to guess; not surprising.", ex:"The twist is predictable, but it’s still fun." },
      { term:"slow‑paced", fr:"au rythme lent", def:"Moves slowly; not much happens quickly.", ex:"The first episodes are slow‑paced." },
      { term:"fast‑paced", fr:"au rythme rapide", def:"Moves quickly with lots of action or events.", ex:"It’s fast‑paced and never boring." },
      { term:"thought‑provoking", fr:"qui fait réfléchir", def:"Makes you think deeply about ideas or questions.", ex:"It’s thought‑provoking and emotional." },
      { term:"confusing", fr:"confus(e)", def:"Hard to understand or follow.", ex:"The storyline is confusing in episode 3." },
      { term:"original", fr:"original(e)", def:"New and different; not a copy.", ex:"The concept feels original and fresh." }
    ],
    acting: [
      { term:"convincing", fr:"convaincant(e)", def:"Believable and realistic.", ex:"The acting is convincing throughout." },
      { term:"charismatic", fr:"charismatique", def:"Very appealing and charming.", ex:"The lead actor is charismatic." },
      { term:"relatable", fr:"dans lequel on se reconnaît", def:"Easy to connect with emotionally.", ex:"The characters are relatable." },
      { term:"well‑written", fr:"bien écrit", def:"Carefully written; strong dialogue and structure.", ex:"The dialogue is well‑written and natural." },
      { term:"underdeveloped", fr:"pas assez développé", def:"Not explored enough; lacks depth.", ex:"Some side characters are underdeveloped." },
      { term:"over‑the‑top", fr:"trop exagéré", def:"Too exaggerated; not realistic.", ex:"A few scenes are over‑the‑top." },
      { term:"believable", fr:"crédible", def:"Possible to believe; realistic.", ex:"The relationships feel believable." },
      { term:"unpredictable", fr:"imprévisible", def:"Hard to guess; surprising.", ex:"The villain is unpredictable." }
    ],
    visuals: [
      { term:"stunning", fr:"époustouflant(e)", def:"Extremely beautiful or impressive.", ex:"The cinematography is stunning." },
      { term:"atmospheric", fr:"avec une ambiance forte", def:"Creates a strong mood or feeling.", ex:"The music is atmospheric and tense." },
      { term:"well‑shot", fr:"bien filmé", def:"Filmed skillfully; looks great.", ex:"It’s well‑shot, even in dark scenes." },
      { term:"dark", fr:"sombre", def:"Not bright; often serious in tone or lighting.", ex:"The visuals are dark but stylish." },
      { term:"colorful", fr:"coloré(e)", def:"Full of bright colors.", ex:"The sets are colorful and playful." },
      { term:"haunting", fr:"obsédant(e)", def:"Stays in your mind; slightly scary or sad.", ex:"The soundtrack is haunting." },
      { term:"catchy", fr:"entraînant(e)", def:"Easy to remember; you want to repeat it.", ex:"The theme song is catchy." },
      { term:"immersive", fr:"immersif(ve)", def:"Makes you feel inside the story/world.", ex:"The sound design is immersive." }
    ],
    overall: [
      { term:"binge‑worthy", fr:"addictif(ve)", def:"So good you want to watch many episodes.", ex:"It’s binge‑worthy — I watched three episodes in a row." },
      { term:"entertaining", fr:"divertissant(e)", def:"Enjoyable and fun to watch.", ex:"It’s entertaining and easy to watch." },
      { term:"overrated", fr:"surcoté(e)", def:"More popular than it deserves.", ex:"In my opinion, it’s a bit overrated." },
      { term:"underrated", fr:"sous‑estimé(e)", def:"Not as famous as it deserves.", ex:"It’s underrated and deserves more attention." },
      { term:"mediocre", fr:"médiocre", def:"Not very good; average in a negative way.", ex:"The sequel is mediocre." },
      { term:"outstanding", fr:"exceptionnel(le)", def:"Extremely good; excellent.", ex:"The final episode is outstanding." },
      { term:"disappointing", fr:"décevant(e)", def:"Not as good as expected.", ex:"The ending is disappointing." },
      { term:"must‑watch", fr:"à voir absolument", def:"Strongly recommended.", ex:"It’s a must‑watch if you like thrillers." }
    ]
  };

  var CONN = [
    { term:"also", fr:"aussi", use:"Addition (adds information).", ex:"I liked the plot. Also, the music was great." },
    { term:"in addition", fr:"en plus / de plus", use:"Addition (more formal than also).", ex:"In addition, the visuals are stunning." },
    { term:"moreover", fr:"de plus", use:"Addition (formal).", ex:"Moreover, the characters are well‑written." },
    { term:"however", fr:"cependant / toutefois", use:"Contrast (but, more formal). Often with a comma.", ex:"However, the pacing is slow." },
    { term:"nevertheless", fr:"néanmoins", use:"Contrast (despite that).", ex:"Nevertheless, I enjoyed it." },
    { term:"although", fr:"bien que", use:"Contrast (starts a clause).", ex:"Although it’s slow, it’s gripping." },
    { term:"whereas", fr:"tandis que", use:"Contrast (compares two facts).", ex:"The first season is light, whereas season two is darker." },
    { term:"because", fr:"parce que", use:"Cause (gives a reason).", ex:"I recommend it because it’s binge‑worthy." },
    { term:"since", fr:"puisque / comme", use:"Cause (often at the start; slightly more formal).", ex:"Since the acting is outstanding, it’s easy to watch." },
    { term:"therefore", fr:"donc / par conséquent", use:"Result (logical conclusion).", ex:"It’s predictable; therefore, it isn’t very tense." },
    { term:"as a result", fr:"du coup / en conséquence", use:"Result (consequence).", ex:"The story is clear; as a result, it’s easy to follow." },
    { term:"for instance", fr:"par exemple", use:"Example (gives a specific example).", ex:"It has great episodes — for instance, episode 5." },
    { term:"overall", fr:"globalement / dans l’ensemble", use:"Wrap‑up (conclusion).", ex:"Overall, it’s a must‑watch." },
    { term:"to sum up", fr:"pour résumer", use:"Wrap‑up (summary).", ex:"To sum up, it’s entertaining but imperfect." }
  ];


  var VERBS = [
    { term:"take place", fr:"se dérouler", def:"Happen in a particular location or time.", ex:"The story takes place in a small coastal town." },
    { term:"be set in", fr:"se situer à", def:"Be located in a place/time (setting).", ex:"The movie is set in the 1970s." },
    { term:"be about", fr:"porter sur", def:"Talk about a topic or theme.", ex:"It’s about friendship and growing up." },
    { term:"follow", fr:"suivre", def:"Track the story of someone over time.", ex:"The series follows a detective who solves cold cases." },
    { term:"revolve around", fr:"tourner autour de", def:"Focus mainly on one central idea/person.", ex:"The plot revolves around a family secret." },
    { term:"focus on", fr:"se concentrer sur", def:"Give attention to a specific topic.", ex:"It focuses on one character’s choices." },
    { term:"feature", fr:"mettre en scène / présenter", def:"Include something important or visible.", ex:"It features impressive action scenes." },
    { term:"portray", fr:"dépeindre", def:"Show or represent in a particular way.", ex:"It portrays the hero as vulnerable." },
    { term:"depict", fr:"représenter", def:"Show or describe (often visually).", ex:"The film depicts life in a tough neighborhood." },
    { term:"explore", fr:"aborder / explorer", def:"Examine a theme or question deeply.", ex:"The show explores identity and power." },
    { term:"hook", fr:"accrocher", def:"Make someone interested quickly.", ex:"The first episode hooks you immediately." },
    { term:"binge‑watch", fr:"regarder en rafale", def:"Watch many episodes in a row.", ex:"I binge‑watched the whole season." },
    { term:"recommend", fr:"recommander", def:"Say it’s good and suggest others watch it.", ex:"I’d recommend it to anyone who likes thrillers." },
    { term:"spoil", fr:"spoiler / gâcher", def:"Reveal key plot information too early.", ex:"I won’t spoil it, but the ending is shocking." },
    { term:"impress", fr:"impressionner", def:"Make someone admire something.", ex:"The visuals really impressed me." },
    { term:"disappoint", fr:"décevoir", def:"Not meet expectations.", ex:"The final episode disappointed me." }
  ];

  /* ---------------------------
     Render flip cards
  ----------------------------*/
  function renderFlipDeck(list, mountId, badge){
    var mount = $(mountId);
    if(!mount) return;
    mount.innerHTML = "";
    list.forEach(function(item, idx){
      var card = document.createElement("div");
      card.className = "flip";
      card.setAttribute("tabindex","0");
      card.setAttribute("role","button");
      card.setAttribute("aria-label", item.term + " flashcard");

      var inner = document.createElement("div");
      inner.className = "flip__inner";

      var front = document.createElement("div");
      front.className = "face front";
      front.innerHTML =
        '<div>' +
          '<div class="term">'+esc(item.term)+'</div>' +
          '<div class="trans">FR: '+esc(item.fr)+'</div>' +
          (badge ? '<div class="badge">🏷️ '+esc(badge)+'</div>' : '') +
        '</div>' +
        '<div class="row">' +
          '<button class="miniBtn" type="button" data-say="'+esc(item.term)+'">🔊 Word</button>' +
          '<button class="miniBtn" type="button" data-say="'+esc(item.ex)+'">🔊 Example</button>' +
        '</div>';

      var back = document.createElement("div");
      back.className = "face back";
      back.innerHTML =
        '<div>' +
          '<div class="term">'+esc(item.term)+'</div>' +
          '<div class="def"><b>Meaning:</b> '+esc(item.def || item.use)+'</div>' +
          '<div class="ex"><b>Example:</b> '+esc(item.ex)+'</div>' +
          (item.use ? '<div class="trans">FR: '+esc(item.fr)+' • '+esc(item.use)+'</div>' : '<div class="trans">FR: '+esc(item.fr)+'</div>') +
        '</div>' +
        '<div class="row">' +
          '<button class="miniBtn" type="button" data-say="'+esc(item.ex)+'">🔊 Listen</button>' +
        '</div>';

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      function toggleFlip(){
        card.classList.toggle("is-flipped");
      }
      card.addEventListener("click", function(e){
        // Don't flip when clicking buttons
        if(e.target && (e.target.tagName||"").toLowerCase()==="button"){ return; }
        toggleFlip();
      });
      card.addEventListener("keydown", function(e){
        if(e.key==="Enter" || e.key===" "){
          e.preventDefault();
          toggleFlip();
        }
      });

      mount.appendChild(card);
    });
  }

  /* ---------------------------
     Tabs
  ----------------------------*/
  function setupTabs(){
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
    tabs.forEach(function(btn){
      btn.addEventListener("click", function(){
        var target = btn.getAttribute("data-tab");
        tabs.forEach(function(b){
          var on = b === btn;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-selected", on ? "true":"false");
        });
        ["adjPlot","adjActing","adjVisuals","adjOverall"].forEach(function(id){
          $(id).classList.toggle("hide", id !== target);
        });
      });
    });
  }

  /* ---------------------------
     MCQ engine
  ----------------------------*/
  function renderMCQ(mountId, questions){
    var mount = $(mountId);
    mount.innerHTML = "";
    questions.forEach(function(q, qi){
      var box = document.createElement("div");
      box.className = "q";
      box.setAttribute("data-q", String(qi));
      box.setAttribute("data-locked","0");
      box.setAttribute("data-scored","0");

      var prompt = document.createElement("div");
      prompt.className = "q__prompt";
      prompt.textContent = q.prompt;

      var opts = document.createElement("div");
      opts.className = "opts";

      var fb = document.createElement("div");
      fb.className = "feedback";
      fb.textContent = " ";

      q.options.forEach(function(opt, oi){
        var b = document.createElement("button");
        b.className = "opt";
        b.type = "button";
        b.textContent = opt;
        b.addEventListener("click", function(){
          if(box.getAttribute("data-locked")==="1") return;

          // reset styles
          Array.prototype.forEach.call(opts.querySelectorAll(".opt"), function(x){
            x.classList.remove("is-right","is-wrong");
          });

          if(oi === q.answer){
            b.classList.add("is-right");
            fb.textContent = "✅ " + (q.explain || "Correct.");
            box.setAttribute("data-locked","1");
            box.classList.add("lock");
            if(box.getAttribute("data-scored")==="0"){
              addPoints(q.points || 1);
              box.setAttribute("data-scored","1");
            }
          }else{
            b.classList.add("is-wrong");
            fb.textContent = "❌ Try again.";
          }
        });
        opts.appendChild(b);
      });

      box.appendChild(prompt);
      box.appendChild(opts);
      box.appendChild(fb);
      mount.appendChild(box);
    });
  }

  function resetMCQ(mountId){
    var mount = $(mountId);
    if(!mount) return;
    Array.prototype.forEach.call(mount.querySelectorAll(".q"), function(box){
      box.setAttribute("data-locked","0");
      box.classList.remove("lock");
      Array.prototype.forEach.call(box.querySelectorAll(".opt"), function(b){
        b.classList.remove("is-right","is-wrong");
      });
      var fb = box.querySelector(".feedback");
      if(fb) fb.textContent = " ";
    });
  }

  /* ---------------------------
     Tap-to-build sentence
  ----------------------------*/
  function renderSentenceBuilder(mountId, sentenceData){
    var mount = $(mountId);
    mount.innerHTML = "";

    function normCheck(s){
      return String(s||"")
        .toLowerCase()
        .replace(/[’‘]/g, "'")
        .replace(/[^a-z0-9\s]/g, "")   // ignore punctuation for checking
        .replace(/\s+/g, " ")
        .trim();
    }

    function getTokensForReveal(s){
      // Prefer explicit order (matches tiles exactly). Fallback: split solution.
      if(s.order && s.order.length){ return s.order.slice(); }
      return String(s.solution||"").trim().split(/\s+/);
    }

    sentenceData.forEach(function(s, i){
      var box = document.createElement("div");
      box.className = "q";

      var prompt = document.createElement("div");
      prompt.className = "q__prompt";
      prompt.textContent = s.prompt;

      var answer = document.createElement("div");
      answer.className = "answer";
      answer.setAttribute("aria-label","Your sentence");

      var tiles = document.createElement("div");
      tiles.className = "tiles";

      var words = shuffle(s.words);

      function makeTile(w){
        var t = document.createElement("button");
        t.type = "button";
        t.className = "tile";
        t.textContent = w;
        t.addEventListener("click", function(){
          if(t.parentNode === tiles){
            answer.appendChild(t);
          }else{
            tiles.appendChild(t);
          }
        });
        return t;
      }

      words.forEach(function(w){
        tiles.appendChild(makeTile(w));
      });

      var row = document.createElement("div");
      row.className = "row";

      var checkBtn = document.createElement("button");
      checkBtn.type="button";
      checkBtn.className="btn";
      checkBtn.textContent="Check";

      var hintBtn = document.createElement("button");
      hintBtn.type="button";
      hintBtn.className="btn ghost";
      hintBtn.textContent="Hint";

      var revealBtn = document.createElement("button");
      revealBtn.type="button";
      revealBtn.className="btn ghost";
      revealBtn.textContent="Reveal next word";

      var listenBtn = document.createElement("button");
      listenBtn.type="button";
      listenBtn.className="btn";
      listenBtn.textContent="Listen";

      var resetBtn = document.createElement("button");
      resetBtn.type="button";
      resetBtn.className="btn ghost";
      resetBtn.textContent="Reset";

      var fb = document.createElement("div");
      fb.className="feedback";
      fb.textContent=" ";

      var hint = document.createElement("div");
      hint.className="hint hide";
      var tokens = getTokensForReveal(s);
      var starter = tokens.slice(0, Math.min(4, tokens.length)).join(" ");
      hint.innerHTML = "<b>Hint:</b> " + esc(s.hint || (s.explain || "Use the model sentence (Listen).")) +
                       "<br><b>Start:</b> " + esc(starter);

      hintBtn.addEventListener("click", function(){
        hint.classList.toggle("hide");
      });

      function getAnswerText(){
        var ws = [];
        Array.prototype.forEach.call(answer.querySelectorAll(".tile"), function(t){ ws.push(t.textContent); });
        return ws.join(" ").replace(/\s+([.,!?;:])/g, "$1");
      }

      function revealNext(){
        // Moves the next correct tile into the answer (tap-friendly scaffold)
        var k = answer.querySelectorAll(".tile").length;
        var tok = tokens[k];
        if(!tok){ return; }
        var poolTiles = tiles.querySelectorAll(".tile");
        for(var j=0;j<poolTiles.length;j++){
          if(poolTiles[j].textContent === tok){
            answer.appendChild(poolTiles[j]);
            return;
          }
        }
        // If not found in pool, do nothing (maybe already moved)
      }

      revealBtn.addEventListener("click", function(){
        revealNext();
      });

      checkBtn.addEventListener("click", function(){
        var user = getAnswerText().trim();
        if(!user){ fb.textContent="❗ Build the sentence first."; return; }

        if(tiles.querySelectorAll(".tile").length > 0){
          fb.textContent="❌ Use ALL the words from the word bank.";
          return;
        }

        if(normCheck(user) === normCheck(s.solution)){
          fb.textContent="✅ Correct! " + (s.explain||"");
          if(!box.getAttribute("data-scored")){
            addPoints(s.points || 2);
            box.setAttribute("data-scored","1");
          }
        }else{
          fb.textContent="❌ Not quite. Try again (use Hint).";
        }
      });

      listenBtn.addEventListener("click", function(){
        var t = getAnswerText().trim() || s.solution;
        speak(t);
      });

      resetBtn.addEventListener("click", function(){
        renderSentenceBuilder(mountId, sentenceData);
      });

      row.appendChild(checkBtn);
      row.appendChild(hintBtn);
      row.appendChild(revealBtn);
      row.appendChild(listenBtn);
      row.appendChild(resetBtn);

      box.appendChild(prompt);
      box.appendChild(tiles);
      box.appendChild(answer);
      box.appendChild(row);
      box.appendChild(hint);
      box.appendChild(fb);

      mount.appendChild(box);
    });
  }

  /* ---------------------------
     Tap-to-fill (blanks + bank)
  ----------------------------*/
  function renderFill(mountId, data){
    var mount = $(mountId);
    mount.innerHTML = "";
    var activeBlank = null;

    var modelText = [];
    data.items.forEach(function(it, idx){
      var p = document.createElement("div");
      p.className="sent";
      var blank = document.createElement("span");
      blank.className="blank";
      blank.textContent="____";
      blank.setAttribute("data-idx", String(idx));
      blank.setAttribute("data-answer", it.answer);
      blank.setAttribute("data-value", "");
      blank.addEventListener("click", function(){
        if(activeBlank) activeBlank.classList.remove("is-on");
        activeBlank = blank;
        blank.classList.add("is-on");
      });

      // sentence: before [blank] after
      p.innerHTML = esc(it.before) + " ";
      p.appendChild(blank);
      p.appendChild(document.createTextNode(" " + it.after));
      mount.appendChild(p);

      modelText.push((it.before + " " + it.answer + " " + it.after).replace(/\s+/g," ").trim());
    });

    // Bank
    var bank = document.createElement("div");
    bank.className="bank";
    data.bank.forEach(function(w){
      var b = document.createElement("button");
      b.type="button";
      b.className="pillopt";
      b.textContent = w;
      b.addEventListener("click", function(){
        if(!activeBlank){ toast("Tap a blank first"); return; }
        activeBlank.textContent = w;
        activeBlank.setAttribute("data-value", w);
      });
      bank.appendChild(b);
    });
    mount.appendChild(bank);

    // Store model as attribute for listen button
    mount.setAttribute("data-model", modelText.join(" "));
  }

  function checkFill(mountId){
    var mount = $(mountId);
    var blanks = mount.querySelectorAll(".blank");
    var ok = 0;
    Array.prototype.forEach.call(blanks, function(b){
      var val = b.getAttribute("data-value") || "";
      var ans = b.getAttribute("data-answer") || "";
      if(val === ans){
        b.style.borderColor = "rgba(52,211,153,.55)";
        b.style.background = "rgba(52,211,153,.12)";
        ok++;
      }else{
        b.style.borderColor = "rgba(251,113,133,.55)";
        b.style.background = "rgba(251,113,133,.10)";
      }
    });
    if(ok === blanks.length){
      toast("✅ All correct!");
      if(!mount.getAttribute("data-scored")){
        addPoints(3);
        mount.setAttribute("data-scored","1");
      }
    }else{
      toast("❌ " + ok + "/" + blanks.length + " correct");
    }
  }

  function resetFill(mountId, data){
    renderFill(mountId, data);
    var mount = $(mountId);
    mount.removeAttribute("data-scored");
  }

  /* ---------------------------
     Matching (tap to pair)
  ----------------------------*/
  function renderMatch(mountId, pairs){
    var mount = $(mountId);
    mount.innerHTML = "";

    var left = shuffle(pairs.map(function(p){ return p.left; }));
    var right = shuffle(pairs.map(function(p){ return p.right; }));

    var pickedLeft = null;
    var pickedRight = null;
    var locked = {};

    function mkTag(text, side){
      var t = document.createElement("button");
      t.type="button";
      t.className="tag";
      t.textContent = text;
      t.addEventListener("click", function(){
        if(t.classList.contains("is-locked")) return;
        // pick
        if(side==="L"){
          if(pickedLeft) pickedLeft.classList.remove("is-picked");
          pickedLeft = t;
          t.classList.add("is-picked");
        }else{
          if(pickedRight) pickedRight.classList.remove("is-picked");
          pickedRight = t;
          t.classList.add("is-picked");
        }
        // try match
        if(pickedLeft && pickedRight){
          var L = pickedLeft.textContent;
          var R = pickedRight.textContent;
          var good = pairs.some(function(p){ return p.left===L && p.right===R; });
          if(good){
            pickedLeft.classList.remove("is-picked");
            pickedRight.classList.remove("is-picked");
            pickedLeft.classList.add("is-locked");
            pickedRight.classList.add("is-locked");
            addPoints(1);
            toast("✅ Pair locked");
          }else{
            toast("❌ Not a match");
            pickedLeft.classList.remove("is-picked");
            pickedRight.classList.remove("is-picked");
          }
          pickedLeft = null; pickedRight = null;
        }
      });
      return t;
    }

    var grid = document.createElement("div");
    grid.className="matchGrid";

    var colL = document.createElement("div");
    var colR = document.createElement("div");
    var listL = document.createElement("div"); listL.className="list";
    var listR = document.createElement("div"); listR.className="list";

    left.forEach(function(x){ listL.appendChild(mkTag(x,"L")); });
    right.forEach(function(x){ listR.appendChild(mkTag(x,"R")); });

    colL.innerHTML = '<div class="q__prompt">Connectors</div>';
    colR.innerHTML = '<div class="q__prompt">Functions</div>';
    colL.appendChild(listL);
    colR.appendChild(listR);

    grid.appendChild(colL);
    grid.appendChild(colR);
    mount.appendChild(grid);
  }

  /* ---------------------------
     Review builder
  ----------------------------*/
  var builderState = null;

  function buildSelect(id, label, opts){
    var html = '<div class="field"><label for="'+id+'">'+esc(label)+'</label><select id="'+id+'">';
    opts.forEach(function(o){
      html += '<option value="'+esc(o)+'">'+esc(o)+'</option>';
    });
    html += '</select></div>';
    return html;
  }

  function renderReviewBuilder(){
    var mount = $("reviewBuilder");
    var titles = ["(your title)", "Stranger Things", "The Crown", "Breaking Bad", "A comedy special", "A new thriller"];
    var types = ["movie", "TV series", "episode", "mini‑series"];
    var genres = ["thriller", "comedy", "drama", "action", "horror", "sci‑fi", "documentary"];
    var summaryFrames = [
      "It’s about…",
      "The story follows…",
      "In this episode, …",
      "It focuses on…"
    ];
    var opinionFrames = [
      "I really liked it",
      "I liked it",
      "I didn’t like it very much",
      "I couldn’t get into it"
    ];
    var adjectives = [
      "gripping", "binge‑worthy", "thought‑provoking", "predictable", "slow‑paced",
      "fast‑paced", "outstanding", "disappointing", "well‑written", "over‑the‑top"
    ];
    var because = [
      "because the plot is gripping",
      "because the acting is convincing",
      "because the characters are relatable",
      "because it’s too slow",
      "because the ending is disappointing"
    ];
    var addInfo = [
      "In addition, the visuals are stunning.",
      "Also, the music is catchy.",
      "Moreover, the dialogue is well‑written."
    ];
    var contrast = [
      "However, the pacing is slow.",
      "Nevertheless, it’s entertaining.",
      "Although it’s predictable, it’s still fun."
    ];
    var recommendation = [
      "Overall, I would recommend it.",
      "You should watch it if you enjoy this genre.",
      "You might like it if you want something easy to watch."
    ];

    mount.innerHTML =
      '<div class="formGrid">' +
        buildSelect("rbTitle","Title", titles) +
        buildSelect("rbType","Type", types) +
        buildSelect("rbGenre","Genre", genres) +
        buildSelect("rbSummary","Summary frame", summaryFrames) +
        '<div class="field"><label for="rbSummaryText">Summary content (no spoilers)</label><input id="rbSummaryText" value="a detective tries to solve a case." /></div>' +
        buildSelect("rbOpinion","Opinion", opinionFrames) +
        buildSelect("rbAdj","Adjective", adjectives) +
        buildSelect("rbBecause","Reason", because) +
        buildSelect("rbAdd","Add info", addInfo) +
        buildSelect("rbContrast","Contrast", contrast) +
        buildSelect("rbRec","Recommendation", recommendation) +
      '</div>' +
      '<div class="field" style="margin-top:10px">' +
        '<label for="rbExtra">Extra detail (optional)</label>' +
        '<textarea id="rbExtra" placeholder="Add one concrete detail (no spoilers): acting, setting, scene type, theme…"></textarea>' +
      '</div>';
  }

  function buildReviewText(){
    var title = $("rbTitle").value;
    var type = $("rbType").value;
    var genre = $("rbGenre").value;
    var summary = $("rbSummary").value;
    var summaryText = ($("rbSummaryText").value || "").trim();
    var opinion = $("rbOpinion").value;
    var adj = $("rbAdj").value;
    var because = $("rbBecause").value;
    var add = $("rbAdd").value;
    var contrast = $("rbContrast").value;
    var rec = $("rbRec").value;
    var extra = ($("rbExtra").value || "").trim();

    var t = "";
    t += "I watched " + title + ". It’s a " + genre + " " + type + ".\n";
    t += summary + " " + (summaryText || "(one sentence summary)") + "\n";
    t += opinion + " — it’s " + adj + " " + because + ".\n";
    if(extra) t += extra.replace(/\s+/g," ").trim() + "\n";
    t += add + " " + contrast + "\n";
    t += rec;
    return t;
  }

  /* ---------------------------
     Timer
  ----------------------------*/
  var timerId = null;
  var timeLeft = 60;
  function setTimer(n){
    timeLeft = n;
    $("timer").textContent = String(timeLeft);
  }
  function startTimer(){
    stopTimer();
    setTimer(60);
    timerId = setInterval(function(){
      timeLeft -= 1;
      $("timer").textContent = String(timeLeft);
      if(timeLeft <= 0){
        stopTimer();
        toast("⏱️ Time!");
      }
    }, 1000);
  }
  function stopTimer(){
    if(timerId){ clearInterval(timerId); timerId=null; }
  }

  /* ---------------------------
     Section reset + hints + listen buttons
  ----------------------------*/
  function wireGlobalButtons(fillData){
    // speak any button with data-say
    document.addEventListener("click", function(e){
      var t = e.target;
      if(!t) return;

      // Speak inline text
      if(t.matches && t.matches("[data-say]")){
        speak(t.getAttribute("data-say"));
      }

      // Listen model for fill: uses data-say-id to speak stored model on mount
      if(t.matches && t.matches("[data-say-id]")){
        var id = t.getAttribute("data-say-id");
        var mount = $(id);
        if(mount){
          var model = mount.getAttribute("data-model") || "";
          speak(model || "Let's practice connectors.");
        }
      }

      // Check fill
      if(t.matches && t.matches("[data-check]")){
        var id2 = t.getAttribute("data-check");
        checkFill(id2);
      }

      // Hint toggle
      if(t.matches && t.matches("[data-hint]")){
        var hid = t.getAttribute("data-hint");
        var h = $(hid);
        if(h) h.classList.toggle("hide");
      }

      // Reset handlers
      if(t.matches && t.matches("[data-reset]")){
        var rid = t.getAttribute("data-reset");

        if(rid === "level5"){
          resetMCQ("adjMcq");
          renderSentenceBuilder("adjBuild", ADJ_BUILD);
          // flip decks: just re-render to reset flips
          renderFlipDeck(ADJ.plot, "adjPlot", "Plot & story");
          renderFlipDeck(ADJ.acting, "adjActing", "Acting & characters");
          renderFlipDeck(ADJ.visuals, "adjVisuals", "Visuals & sound");
          renderFlipDeck(ADJ.overall, "adjOverall", "Overall opinion");
          toast("Level 5 reset");
        }
        if(rid === "adjMcq"){ resetMCQ("adjMcq"); toast("Reset"); }
        if(rid === "level5b"){
          resetMCQ("verbMcq");
          renderSentenceBuilder("verbBuild", VERB_BUILD);
          renderFlipDeck(VERBS, "verbDeck", "Review verbs");
          toast("Level 5B reset");
        }
        if(rid === "verbMcq"){ resetMCQ("verbMcq"); toast("Reset"); }
        if(rid === "level6"){
          resetFill("connFill", CONN_FILL);
          renderMatch("connMatch", CONN_MATCH);
          renderFlipDeck(CONN.map(function(x){ return {term:x.term, fr:x.fr, use:x.use, ex:x.ex}; }), "connDeck", "Connector");
          toast("Level 6 reset");
        }
        if(rid === "connFill"){ resetFill("connFill", CONN_FILL); toast("Reset"); }
        if(rid === "connMatch"){ renderMatch("connMatch", CONN_MATCH); toast("Reset"); }
        if(rid === "level7"){
          resetMCQ("tenseMcq");
          resetMCQ("tenseFix");
          toast("Level 7 reset");
        }
        if(rid === "tenseMcq"){ resetMCQ("tenseMcq"); toast("Reset"); }
        if(rid === "builder"){
          renderReviewBuilder();
          $("reviewOutput").textContent = "";
          toast("Builder reset");
        }
      }
    });

    $("printGrammar").addEventListener("click", function(){ window.print(); });

    $("toggleTeacher").addEventListener("click", function(){
      var panel = $("teacherNotes");
      var isHidden = panel.classList.toggle("hide");
      $("toggleTeacher").setAttribute("aria-expanded", isHidden ? "false":"true");
    });

    $("resetAll").addEventListener("click", function(){
      if(confirm("Reset score and all exercises?")){
        setScore(0);
        // resets
        resetMCQ("adjMcq");
        resetMCQ("tenseMcq");
        resetMCQ("tenseFix");
        resetFill("connFill", CONN_FILL);
        renderMatch("connMatch", CONN_MATCH);
        renderSentenceBuilder("adjBuild", ADJ_BUILD);
        renderReviewBuilder();
        $("reviewOutput").textContent = "";
        // re-render decks
        renderFlipDeck(ADJ.plot, "adjPlot", "Plot & story");
        renderFlipDeck(ADJ.acting, "adjActing", "Acting & characters");
        renderFlipDeck(ADJ.visuals, "adjVisuals", "Visuals & sound");
        renderFlipDeck(ADJ.overall, "adjOverall", "Overall opinion");
        renderFlipDeck(CONN.map(function(x){ return {term:x.term, fr:x.fr, use:x.use, ex:x.ex}; }), "connDeck", "Connector");
        toast("All reset");
      }
    });
  }

  /* ---------------------------
     Questions + activities data
  ----------------------------*/
  var ADJ_MCQ = [
    { prompt:"1) A show that is so interesting you can’t stop watching is…", options:["predictable","gripping","mediocre"], answer:1, explain:"Gripping = captivating.", points:1 },
    { prompt:"2) A twist that is easy to guess is…", options:["unpredictable","original","predictable"], answer:2, explain:"Predictable = easy to guess.", points:1 },
    { prompt:"3) Acting that feels real is…", options:["convincing","over‑the‑top","underdeveloped"], answer:0, explain:"Convincing = believable.", points:1 },
    { prompt:"4) A series you want to watch episode after episode is…", options:["binge‑worthy","confusing","dark"], answer:0, explain:"Binge‑worthy = addictif.", points:1 },
    { prompt:"5) Scenes that move very quickly are…", options:["slow‑paced","fast‑paced","overrated"], answer:1, explain:"Fast‑paced = rythme rapide.", points:1 }
  ];

  var ADJ_BUILD = [
    {
      prompt: "Build a stronger review sentence:",
      words: ["I","liked","the","movie","because","it’s","gripping."],
      order: ["I","liked","the","movie","because","it’s","gripping."],
      solution: "I liked the movie because it’s gripping.",
      hint: "Structure: Opinion + because + adjective. Put the reason after because.",
      explain: "Opinion + because + adjective.",
      points: 2
    },
    {
      prompt: "Build a contrast sentence:",
      words: ["However,","the","ending","was","slow;","the","acting","was","excellent."],
      order: ["However,","the","ending","was","slow;","the","acting","was","excellent."],
      solution: "However, the ending was slow; the acting was excellent.",
      hint: "However, starts the contrast. Two complete ideas: clause 1 ; clause 2.",
      explain: "Use however for contrast. Use a semicolon to join two complete ideas.",
      points: 2
    }
  ];

  var VERB_MCQ = [
    { prompt:"1) The movie ____ in New York in the 1970s.", options:["takes place","has taken place","is taking place"], answer:0, explain:"Setting/synopsis → present simple.", points:1 },
    { prompt:"2) The story ____ a nurse who moves to a new city.", options:["follows","followed","has followed"], answer:0, explain:"Synopses use present simple.", points:1 },
    { prompt:"3) The series ____ themes of identity and power.", options:["explores","explored","is exploring"], answer:0, explain:"Explore = aborde un thème.", points:1 },
    { prompt:"4) I don’t want to ____ anything.", options:["spoil","depict","feature"], answer:0, explain:"Spoil = révéler l’intrigue.", points:1 },
    { prompt:"5) I would ____ it to anyone who likes thrillers.", options:["recommend","revolve around","portray"], answer:0, explain:"Recommend = conseiller.", points:1 }
  ];

  var VERB_BUILD = [
    {
      prompt: "Build a synopsis sentence:",
      words: ["The","series","follows","a","detective","who","solves","cold","cases."],
      order: ["The","series","follows","a","detective","who","solves","cold","cases."],
      solution: "The series follows a detective who solves cold cases.",
      hint: "Start with: The series… then verb follows… who + present simple.",
      explain: "Present simple for synopses.",
      points: 2
    },
    {
      prompt: "Build a setting + theme sentence:",
      words: ["The","story","takes","place","in","a","small","town","and","explores","friendship."],
      order: ["The","story","takes","place","in","a","small","town","and","explores","friendship."],
      solution: "The story takes place in a small town and explores friendship.",
      hint: "Pattern: The story takes place in… and explores…",
      explain: "Setting + theme (no spoilers).",
      points: 2
    }
  ];


  var CONN_FILL = {
    bank: ["also", "however", "as a result", "for instance", "overall", "in addition", "because", "therefore"],
    items: [
      { before:"I enjoyed the show.", answer:"also", after:"the music was amazing." },
      { before:"The first episode is slow.", answer:"however", after:"the ending is intense." },
      { before:"It’s very clear;", answer:"as a result", after:"it’s easy to follow." },
      { before:"It has great moments —", answer:"for instance", after:"episode 5 is outstanding." },
      { before:"", answer:"overall", after:"I would recommend it." }
    ]
  };

  var CONN_MATCH = [
    { left:"moreover", right:"Addition (more formal)" },
    { left:"nevertheless", right:"Contrast (despite that)" },
    { left:"whereas", right:"Contrast (two facts)" },
    { left:"therefore", right:"Result (logical conclusion)" },
    { left:"for instance", right:"Example (specific example)" },
    { left:"to sum up", right:"Wrap‑up (summary)" }
  ];

  var TENSE_MCQ = [
    { prompt:"1) A synopsis: “The series ____ a detective who solves cold cases.”", options:["follows","followed","has followed"], answer:0, explain:"Plot summaries use present simple.", points:1 },
    { prompt:"2) Finished time: “I ____ it last night.”", options:["have watched","watched","watch"], answer:1, explain:"Past simple with finished time.", points:1 },
    { prompt:"3) Experience (no time): “I ____ this show.”", options:["watched","have seen","see"], answer:1, explain:"Present perfect for experience.", points:1 },
    { prompt:"4) Duration: “I ____ it for two weeks.”", options:["have been watching","watched","am watching"], answer:0, explain:"Present perfect continuous for duration.", points:1 },
    { prompt:"5) Recommendation: “You ____ watch it if you like thrillers.”", options:["should","are","did"], answer:0, explain:"Use modal should for advice.", points:1 },
    { prompt:"6) Right now: “I ____ season 2 at the moment.”", options:["am watching","watched","have watched"], answer:0, explain:"Present continuous for now/currently.", points:1 },
    { prompt:"7) Earlier past: “I ____ it before I read the book.”", options:["had seen","saw","have seen"], answer:0, explain:"Past perfect for earlier past.", points:1 },
    { prompt:"8) Plan: “I’m ____ watch the next episode tonight.”", options:["going to","went to","going"], answer:0, explain:"Going to = plan/intention.", points:1 },
    { prompt:"9) Past habit: “I ____ watch cartoons every Saturday.”", options:["used to","use to","am used to"], answer:0, explain:"Used to = past habit.", points:1 }
  ];

  var TENSE_FIX = [
    { prompt:"1) Choose the natural review sentence:", options:[
      "I have watched it yesterday.",
      "I watched it yesterday.",
      "I watch it yesterday."
    ], answer:1, explain:"Yesterday → past simple.", points:1 },
    { prompt:"2) Choose the best synopsis tense:", options:[
      "In this episode, the hero discovered a secret.",
      "In this episode, the hero discovers a secret.",
      "In this episode, the hero has discovered a secret."
    ], answer:1, explain:"Synopsis/summary → present simple.", points:1 },
    { prompt:"3) Choose the best experience sentence:", options:[
      "I’ve never seen it.",
      "I never saw it.",
      "I didn’t never see it."
    ], answer:0, explain:"Never + present perfect (experience).", points:1 },
    { prompt:"4) Choose the correct earlier-past sentence:", options:[
      "By the time the finale started, I watched three episodes.",
      "By the time the finale started, I had watched three episodes.",
      "By the time the finale started, I have watched three episodes."
    ], answer:1, explain:"Past perfect for earlier past.", points:1 },
    { prompt:"5) Choose the correct background action sentence:", options:[
      "I was watching it when my phone rang.",
      "I have been watching it when my phone rang.",
      "I watched it when my phone was ringing."
    ], answer:0, explain:"Past continuous = background action.", points:1 }
  ];

  /* ---------------------------
     Init
  ----------------------------*/
  function init(){
    loadScore();

    // Accent buttons
    $("accentUS").addEventListener("click", function(){ setAccent("US"); });
    $("accentUK").addEventListener("click", function(){ setAccent("UK"); });

    $("enableVoice").addEventListener("click", enableVoice);
    $("testVoice").addEventListener("click", function(){
      enableVoice();
      speak(accent==="UK" ? "Hello! This is the British accent test." : "Hello! This is the American accent test.");
    });

    if(window.speechSynthesis){
      window.speechSynthesis.onvoiceschanged = function(){ pickVoice(); };
    }
    pickVoice();

    // Render decks
    renderFlipDeck(ADJ.plot, "adjPlot", "Plot & story");
    renderFlipDeck(ADJ.acting, "adjActing", "Acting & characters");
    renderFlipDeck(ADJ.visuals, "adjVisuals", "Visuals & sound");
    renderFlipDeck(ADJ.overall, "adjOverall", "Overall opinion");

    renderFlipDeck(VERBS, "verbDeck", "Review verbs");

    renderFlipDeck(CONN.map(function(x){ return {term:x.term, fr:x.fr, use:x.use, ex:x.ex}; }), "connDeck", "Connector");

    // Tabs
    setupTabs();

    // Quizzes + builders
    renderMCQ("adjMcq", ADJ_MCQ);
    renderSentenceBuilder("adjBuild", ADJ_BUILD);

    renderMCQ("verbMcq", VERB_MCQ);
    renderSentenceBuilder("verbBuild", VERB_BUILD);

    renderFill("connFill", CONN_FILL);
    renderMatch("connMatch", CONN_MATCH);

    renderMCQ("tenseMcq", TENSE_MCQ);
    renderMCQ("tenseFix", TENSE_FIX);

    renderReviewBuilder();

    // Builder actions
    $("buildReview").addEventListener("click", function(){
      var out = buildReviewText();
      $("reviewOutput").textContent = out;
      // award once per build cycle (first time only per page load)
      if(!$("reviewOutput").getAttribute("data-built")){
        addPoints(2);
        $("reviewOutput").setAttribute("data-built","1");
      }
    });

    $("listenReview").addEventListener("click", function(){
      var text = $("reviewOutput").textContent.trim();
      if(!text){ toast("Build your review first"); return; }
      speak(text.replace(/\n+/g, " "));
    });

    $("copyReview").addEventListener("click", function(){
      var text = $("reviewOutput").textContent.trim();
      if(!text){ toast("Build your review first"); return; }
      copyToClipboard(text);
      toast("Copied");
    });

    $("bonusPoints").addEventListener("click", function(){
      var text = $("reviewOutput").textContent.trim();
      if(!text){ toast("Build your review first"); return; }
      copyToClipboard(text);
      addPoints(5);
    });

    // Timer
    setTimer(60);
    $("timerStart").addEventListener("click", startTimer);
    $("timerStop").addEventListener("click", stopTimer);

    // Wire hints/resets/listen/check
    wireGlobalButtons(CONN_FILL);
  }

  function copyToClipboard(text){
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text);
      }else{
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position="fixed";
        ta.style.left="-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
    }catch(e){}
  }

  // Start
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();