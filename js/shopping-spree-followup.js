/* SpeakEasyTisha — Shopping Spree follow-up (Shoes · Clothes · Décor)
   COMPLETE JS: vocab flashcards + MCQ + matching + drag/tap DnD + sentence builder +
   fill-in with word bank + interactive dialogues + reading (MCQ + True/False) +
   hints + right/wrong feedback + global score (top & bottom) + US/UK speechSynthesis.

   Works on Mac + iPad Safari: every drag activity also has TAP MODE (tap tile → tap target).
*/
(function () {
  "use strict";

  /* ---------------------------
     Helpers
  ----------------------------*/
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function on(el, evt, fn) { if (el) el.addEventListener(evt, fn, false); }
  function isTouch() { return ("ontouchstart" in window) || (navigator.maxTouchPoints > 0); }

  /* ---------------------------
     Speech (US/UK)
  ----------------------------*/
  var accentSelect = $("accentSelect");
  var currentLang = "en-US";
  var voiceCache = [];

  function loadVoices() {
    try { voiceCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
    catch (e) { voiceCache = []; }
  }
  function pickVoice(lang) {
    loadVoices();
    if (!voiceCache || !voiceCache.length) return null;
    // Prefer exact language match
    for (var i = 0; i < voiceCache.length; i++) {
      if ((voiceCache[i].lang || "").toLowerCase() === lang.toLowerCase()) return voiceCache[i];
    }
    // Then prefix match (en-GBx, en-USx)
    for (var j = 0; j < voiceCache.length; j++) {
      if ((voiceCache[j].lang || "").toLowerCase().indexOf(lang.slice(0,2).toLowerCase()) === 0) return voiceCache[j];
    }
    return voiceCache[0] || null;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = currentLang;
      var v = pickVoice(currentLang);
      if (v) u.voice = v;
      u.rate = 1;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  on(accentSelect, "change", function () {
    currentLang = accentSelect.value || "en-US";
  });
  if ("speechSynthesis" in window) {
    loadVoices();
    // Some browsers populate voices async
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  /* ---------------------------
     Global score + wrong-tracker
  ----------------------------*/
  var score = { correct: 0, total: 0 };
  var wrongLog = []; // {label, hint, elementId}

  function scorePillText() {
    if (score.total === 0) return "Start";
    var pct = Math.round((score.correct / score.total) * 100);
    if (pct >= 90) return "🔥 Excellent";
    if (pct >= 70) return "✅ Good";
    if (pct >= 50) return "👍 Keep going";
    return "💪 Practice";
  }

  function renderScore() {
    var top = $("scoreTop"), bot = $("scoreBottom");
    var pTop = $("scorePillTop"), pBot = $("scorePillBottom");
    if (top) top.textContent = score.correct + " / " + score.total;
    if (bot) bot.textContent = score.correct + " / " + score.total;
    if (pTop) pTop.textContent = scorePillText();
    if (pBot) pBot.textContent = scorePillText();
  }

  function addAttempt(isCorrect, label, hint, elementId) {
    score.total += 1;
    if (isCorrect) {
      score.correct += 1;
      // remove any previous wrong entry for same label
      wrongLog = wrongLog.filter(function (w) { return w.label !== label; });
    } else {
      // store/replace wrong entry
      wrongLog = wrongLog.filter(function (w) { return w.label !== label; });
      wrongLog.push({ label: label, hint: hint || "", elementId: elementId || "" });
    }
    renderScore();
  }

  function scrollToElId(id) {
    var el = id ? $(id) : null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("pulse");
    setTimeout(function(){ el.classList.remove("pulse"); }, 700);
  }

  function showWrongReview() {
    if (!wrongLog.length) {
      alert("Nice! No wrong answers to review right now.");
      return;
    }
    var msg = "Wrong answers to review:\n\n" + wrongLog.map(function(w, idx){
      return (idx+1) + ") " + w.label + (w.hint ? ("\n   Hint: " + w.hint) : "");
    }).join("\n\n") + "\n\nTip: I'll jump to the first wrong activity.";
    alert(msg);
    // jump to the first wrong element if available
    var first = wrongLog[0];
    if (first && first.elementId) scrollToElId(first.elementId);
  }

  on($("reviewWrongTop"), "click", showWrongReview);
  on($("reviewWrongBottom"), "click", showWrongReview);

  /* ---------------------------
     Tap mode toggle
  ----------------------------*/
  var tapModeToggle = $("tapModeToggle");
  var tapMode = false;

  function setTapMode(onOff) {
    tapMode = !!onOff;
    if (tapModeToggle) tapModeToggle.checked = tapMode;
    document.body.dataset.tapmode = tapMode ? "1" : "0";
  }

  // default: ON for touch devices
  setTapMode(isTouch());
  on(tapModeToggle, "change", function () { setTapMode(!!tapModeToggle.checked); });

  /* ---------------------------
     Data
  ----------------------------*/
  var vocab = [
    { term:"sneakers", def:"comfortable sport shoes you can wear every day", icon:"👟", say:"sneakers" },
    { term:"heels", def:"shoes that are higher at the back (often formal)", icon:"👠", say:"heels" },
    { term:"boots", def:"shoes that cover the ankle (or higher)", icon:"🥾", say:"boots" },
    { term:"hoodie", def:"a sweatshirt with a hood", icon:"🧥", say:"hoodie" },
    { term:"dress", def:"a one-piece outfit (often for special occasions)", icon:"👗", say:"dress" },
    { term:"jeans", def:"denim pants", icon:"👖", say:"jeans" },
    { term:"belt", def:"something you wear around your waist", icon:"🧷", say:"belt" },
    { term:"scarf", def:"a warm accessory for your neck", icon:"🧣", say:"scarf" },
    { term:"cushion", def:"a soft pillow for a sofa or chair", icon:"🛋️", say:"cushion" },
    { term:"vase", def:"a container for flowers", icon:"🏺", say:"vase" },
    { term:"lamp", def:"a light you put on a table or floor", icon:"💡", say:"lamp" },
    { term:"curtains", def:"fabric that covers a window", icon:"🪟", say:"curtains" }
  ];

  /* ---------------------------
     1) Flashcards
  ----------------------------*/
  function renderFlashcards() {
    var wrap = $("flashcards");
    if (!wrap) return;
    wrap.innerHTML = "";
    vocab.forEach(function (v) {
      var card = document.createElement("div");
      card.className = "flashCard";
      card.setAttribute("tabindex", "0");
      card.innerHTML =
        '<div class="cardFront">' +
          '<div class="flashTop">' +
            '<div class="icon" aria-hidden="true">' + esc(v.icon) + '</div>' +
            '<div class="term">' + esc(v.term) + '</div>' +
            '<button class="speakBtn" type="button" aria-label="Listen: ' + esc(v.term) + '">🔊</button>' +
          '</div>' +
          '<div class="def">Tap to see the meaning</div>' +
        '</div>' +
        '<div class="cardBack">' +
          '<div class="flashTop">' +
            '<div class="icon" aria-hidden="true">' + esc(v.icon) + '</div>' +
            '<div class="term">' + esc(v.term) + '</div>' +
            '<button class="speakBtn" type="button" aria-label="Listen: ' + esc(v.term) + '">🔊</button>' +
          '</div>' +
          '<div class="def">' + esc(v.def) + '</div>' +
        '</div>';

      var speakBtns = card.querySelectorAll(".speakBtn");
      for (var i=0;i<speakBtns.length;i++){
        (function(txt){
          on(speakBtns[i], "click", function (e) {
            e.stopPropagation();
            speak(txt);
          });
        })(v.say || v.term);
      }

      function toggleFlip(){ card.classList.toggle("isFlipped"); }
      on(card, "click", toggleFlip);
      on(card, "keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggleFlip(); } });
      wrap.appendChild(card);
    });
  }

  /* ---------------------------
     2) MCQ
  ----------------------------*/
  var mcqData = [
    { q:"Which word means ‘fabric that covers a window’?", opts:["vase","curtains","belt","heels"], a:1, hint:"Think: you open/close them to block light." },
    { q:"You wear a ____ around your waist.", opts:["belt","scarf","lamp","cushion"], a:0, hint:"It can hold up your pants." },
    { q:"Which shoes are higher at the back?", opts:["boots","sneakers","heels","sandals"], a:2, hint:"Often worn for formal events." },
    { q:"A ____ is a container for flowers.", opts:["cushion","vase","hoodie","jeans"], a:1, hint:"You can put water in it." },
    { q:"Choose the polite question:", opts:["Give me a size 38.","I want discount now.","Could I try these on, please?","You must help me."], a:2, hint:"Use ‘Could I… please?’ for polite requests." }
  ];

  function renderMCQ() {
    var root = $("mcq");
    if (!root) return;
    root.innerHTML = "";
    mcqData.forEach(function(item, idx){
      var id = "mcq_q" + idx;
      var block = document.createElement("div");
      block.className = "qBlock";
      block.id = id;

      var optsHtml = item.opts.map(function(opt, oi){
        return '<button type="button" class="opt" data-oi="'+oi+'" aria-pressed="false">' + esc(opt) + '</button>';
      }).join("");

      block.innerHTML =
        '<div class="qPrompt">' + (idx+1) + ". " + esc(item.q) + '</div>' +
        '<div class="optRow">' + optsHtml + '</div>' +
        '<div class="qActions">' +
          '<button type="button" class="btn btnSmall" data-action="check">Check</button>' +
          '<button type="button" class="btn btnGhost btnSmall" data-action="hint">Hint</button>' +
          '<button type="button" class="btn btnGhost btnSmall" data-action="listen">🔊 Listen</button>' +
          '<div class="feedback" aria-live="polite"></div>' +
        '</div>' +
        '<div class="qMeta">Tip: Select an option, then press Check.</div>';

      var selected = -1;
      var answered = false;

      var opts = block.querySelectorAll(".opt");
      for (var i=0;i<opts.length;i++){
        on(opts[i], "click", function(e){
          var oi = parseInt(this.getAttribute("data-oi"),10);
          selected = oi;
          for (var k=0;k<opts.length;k++) opts[k].setAttribute("aria-pressed", "false");
          this.setAttribute("aria-pressed","true");
        });
      }

      var fb = block.querySelector(".feedback");
      function setFb(ok, text){
        fb.className = "feedback " + (ok ? "good" : "bad");
        fb.textContent = text;
      }

      on(block.querySelector('[data-action="listen"]'), "click", function(){
        speak(item.q);
      });

      on(block.querySelector('[data-action="hint"]'), "click", function(){
        setFb(false, "Hint: " + item.hint);
      });

      on(block.querySelector('[data-action="check"]'), "click", function(){
        if (selected < 0) { setFb(false, "Pick an answer first."); return; }
        var ok = selected === item.a;
        setFb(ok, ok ? "✅ Correct!" : "❌ Not quite. Try again or use Hint.");
        if (!answered) {
          addAttempt(ok, "MCQ " + (idx+1) + ": " + item.q, item.hint, id);
          answered = true;
        } else {
          // allow retries without changing total; if correct later, update wrongLog and correct++? keep fair:
          if (ok) {
            // If previously wrong, convert last attempt: +1 correct (but keep total)
            // We'll do: only if this question is in wrongLog.
            var label = "MCQ " + (idx+1) + ": " + item.q;
            var wasWrong = wrongLog.some(function(w){return w.label===label;});
            if (wasWrong) {
              score.correct += 1; // convert
              wrongLog = wrongLog.filter(function(w){return w.label!==label;});
              renderScore();
            }
          }
        }
      });

      root.appendChild(block);
    });
  }

  /* ---------------------------
     3) Matching (drag/tap)
  ----------------------------*/
  var matchPairs = [
    { left:"hoodie", right:"a sweatshirt with a hood" },
    { left:"cushion", right:"a soft pillow for a sofa or chair" },
    { left:"vase", right:"a container for flowers" },
    { left:"curtains", right:"fabric that covers a window" },
    { left:"boots", right:"shoes that cover the ankle (or higher)" }
  ];

  var matchState = {
    map: {}, // left -> right
    pickedLeft: null,
    pickedRight: null,
    answered: false
  };

  function renderMatching() {
    var L = $("matchLeft"), R = $("matchRight");
    if (!L || !R) return;
    var pairs = shuffle(matchPairs);
    var rights = shuffle(matchPairs.map(function(p){ return p.right; }));

    matchState.map = {};
    matchState.pickedLeft = null;
    matchState.pickedRight = null;
    matchState.answered = false;

    L.innerHTML = "";
    R.innerHTML = "";
    pairs.forEach(function(p){
      var li = document.createElement("li");
      li.className = "matchItem";
      li.setAttribute("draggable","true");
      li.setAttribute("data-left", p.left);
      li.textContent = p.left;
      L.appendChild(li);
    });
    rights.forEach(function(r){
      var li = document.createElement("li");
      li.className = "matchItem";
      li.setAttribute("data-right", r);
      li.textContent = r;
      R.appendChild(li);
    });

    // drag: left -> right
    var dragLeft = null;
    var leftItems = L.querySelectorAll(".matchItem");
    var rightItems = R.querySelectorAll(".matchItem");

    for (var i=0;i<leftItems.length;i++){
      (function(el){
        on(el, "dragstart", function(e){
          dragLeft = el.getAttribute("data-left");
          try { e.dataTransfer.setData("text/plain", dragLeft); } catch(_){ }
        });
        on(el, "click", function(){
          if (!tapMode) return;
          clearMatchPicked();
          matchState.pickedLeft = el.getAttribute("data-left");
          el.classList.add("selected");
        });
      })(leftItems[i]);
    }

    for (var j=0;j<rightItems.length;j++){
      (function(el){
        on(el, "dragover", function(e){ e.preventDefault(); });
        on(el, "drop", function(e){
          e.preventDefault();
          var left = dragLeft;
          if (!left) return;
          var right = el.getAttribute("data-right");
          matchState.map[left] = right;
          markMatchMapped(left, right);
          dragLeft = null;
        });
        on(el, "click", function(){
          if (!tapMode) return;
          if (!matchState.pickedLeft) return;
          var left = matchState.pickedLeft;
          var right = el.getAttribute("data-right");
          matchState.map[left] = right;
          markMatchMapped(left, right);
          clearMatchPicked();
        });
      })(rightItems[j]);
    }
  }

  function clearMatchPicked() {
    matchState.pickedLeft = null;
    var all = document.querySelectorAll("#matchLeft .matchItem");
    for (var i=0;i<all.length;i++) all[i].classList.remove("selected");
  }

  function markMatchMapped(left, right) {
    var leftEls = document.querySelectorAll('#matchLeft .matchItem');
    var rightEls = document.querySelectorAll('#matchRight .matchItem');
    for (var i=0;i<leftEls.length;i++){
      if (leftEls[i].getAttribute("data-left") === left) {
        leftEls[i].textContent = left + "  →";
        leftEls[i].classList.add("matched");
      }
    }
    for (var j=0;j<rightEls.length;j++){
      if (rightEls[j].getAttribute("data-right") === right) {
        rightEls[j].classList.add("matched");
      }
    }
  }

  function checkMatching() {
    var fb = $("matchFb");
    var correct = 0;
    for (var i=0;i<matchPairs.length;i++){
      var p = matchPairs[i];
      if (matchState.map[p.left] === p.right) correct++;
    }
    var ok = correct === matchPairs.length;
    if (fb) {
      fb.className = "feedback " + (ok ? "good" : "bad");
      fb.textContent = ok ? "✅ Perfect matching!" : ("❌ " + correct + " / " + matchPairs.length + " correct. Try again.");
    }

    if (!matchState.answered) {
      addAttempt(ok, "Matching: words ↔ meanings", "Try starting with the easiest: vase, curtains, boots…", "matchLeft");
      matchState.answered = true;
    } else {
      if (ok) {
        var label = "Matching: words ↔ meanings";
        var wasWrong = wrongLog.some(function(w){return w.label===label;});
        if (wasWrong) { score.correct += 1; wrongLog = wrongLog.filter(function(w){return w.label!==label;}); renderScore(); }
      }
    }

    // UI marking
    var leftEls = document.querySelectorAll('#matchLeft .matchItem');
    for (var j=0;j<leftEls.length;j++){
      var l = leftEls[j].getAttribute("data-left");
      var r = matchState.map[l];
      var isOk = false;
      for (var k=0;k<matchPairs.length;k++){
        if (matchPairs[k].left===l && matchPairs[k].right===r) isOk = true;
      }
      leftEls[j].classList.remove("bad");
      if (!isOk && r) leftEls[j].classList.add("bad");
    }
  }

  on($("matchCheck"), "click", checkMatching);
  on($("matchHint"), "click", function(){
    var fb = $("matchFb");
    if (fb) {
      fb.className = "feedback";
      fb.textContent = "Hint: start with clear objects (vase, curtains) then clothing (hoodie) then others.";
    }
  });
  on($("matchReset"), "click", function(){
    renderMatching();
    var fb = $("matchFb");
    if (fb) { fb.className="feedback"; fb.textContent=""; }
  });

  /* ---------------------------
     4) Sort It (drag/tap)
  ----------------------------*/
  var sortItems = [
    { text:"sneakers", cat:"shoes", icon:"👟" },
    { text:"heels", cat:"shoes", icon:"👠" },
    { text:"boots", cat:"shoes", icon:"🥾" },
    { text:"jeans", cat:"clothes", icon:"👖" },
    { text:"dress", cat:"clothes", icon:"👗" },
    { text:"hoodie", cat:"clothes", icon:"🧥" },
    { text:"lamp", cat:"decor", icon:"💡" },
    { text:"vase", cat:"decor", icon:"🏺" },
    { text:"cushion", cat:"decor", icon:"🛋️" }
  ];

  var sortState = {
    placed: {}, // text -> cat
    selectedTile: null,
    answered: false
  };

  function renderSort() {
    var bank = $("sortTiles");
    var targets = document.querySelectorAll("#sortTargets .dropInner");
    if (!bank || !targets.length) return;

    // clear targets
    for (var t=0;t<targets.length;t++) targets[t].innerHTML = "";

    sortState.placed = {};
    sortState.selectedTile = null;
    sortState.answered = false;

    bank.innerHTML = "";
    shuffle(sortItems).forEach(function(it){
      var tile = document.createElement("div");
      tile.className = "tile";
      tile.setAttribute("draggable","true");
      tile.setAttribute("data-text", it.text);
      tile.setAttribute("data-cat", it.cat);
      tile.innerHTML = '<span aria-hidden="true">'+esc(it.icon)+'</span><strong>'+esc(it.text)+'</strong>';
      bank.appendChild(tile);
    });

    // Drag handling
    var dragText = null;
    var tiles = bank.querySelectorAll(".tile");

    function clearSelected() {
      var all = document.querySelectorAll("#sortTiles .tile");
      for (var i=0;i<all.length;i++) all[i].classList.remove("selected");
      sortState.selectedTile = null;
    }

    for (var i=0;i<tiles.length;i++){
      (function(el){
        on(el, "dragstart", function(e){
          dragText = el.getAttribute("data-text");
          try { e.dataTransfer.setData("text/plain", dragText); } catch(_){ }
        });
        on(el, "click", function(){
          if (!tapMode) return;
          clearSelected();
          el.classList.add("selected");
          sortState.selectedTile = el.getAttribute("data-text");
        });
      })(tiles[i]);
    }

    var zones = document.querySelectorAll("#sortTargets .dropZone");
    for (var z=0;z<zones.length;z++){
      (function(zone){
        var cat = zone.getAttribute("data-cat");
        var inner = zone.querySelector(".dropInner");
        on(zone, "dragover", function(e){ e.preventDefault(); });
        on(zone, "drop", function(e){
          e.preventDefault();
          var txt = dragText;
          if (!txt) return;
          moveTileTo(txt, cat);
          dragText = null;
        });
        on(zone, "click", function(){
          if (!tapMode) return;
          if (!sortState.selectedTile) return;
          moveTileTo(sortState.selectedTile, cat);
          clearSelected();
        });
        on(zone, "keydown", function(e){
          if (e.key==="Enter" || e.key===" "){
            e.preventDefault();
            if (!tapMode) return;
            if (!sortState.selectedTile) return;
            moveTileTo(sortState.selectedTile, cat);
            clearSelected();
          }
        });
      })(zones[z]);
    }

    function moveTileTo(text, cat) {
      var tile = document.querySelector('#sortTiles .tile[data-text="'+CSS.escape(text)+'"]');
      if (!tile) return;

      var inner = document.querySelector('#sortTargets .dropInner[data-cat="'+CSS.escape(cat)+'"]');
      if (!inner) return;

      inner.appendChild(tile);
      sortState.placed[text] = cat;
    }
  }

  function checkSort() {
    var fb = $("sortFb");
    var correct = 0;
    for (var i=0;i<sortItems.length;i++){
      var it = sortItems[i];
      var placedCat = sortState.placed[it.text];
      if (placedCat === it.cat) correct++;
    }
    var ok = correct === sortItems.length;
    if (fb) {
      fb.className = "feedback " + (ok ? "good" : "bad");
      fb.textContent = ok ? "✅ Great sorting!" : ("❌ " + correct + " / " + sortItems.length + " correct. Try again.");
    }

    // Mark tiles
    var allTiles = document.querySelectorAll(".tile");
    for (var t=0;t<allTiles.length;t++){
      var text = allTiles[t].getAttribute("data-text");
      var trueCat = allTiles[t].getAttribute("data-cat");
      var placed = sortState.placed[text];
      allTiles[t].classList.remove("good","bad");
      if (!placed) continue;
      if (placed === trueCat) allTiles[t].classList.add("good");
      else allTiles[t].classList.add("bad");
    }

    if (!sortState.answered) {
      addAttempt(ok, "Sort: shoes / clothes / décor", "Shoes = sneakers/heels/boots. Décor = lamp/vase/cushion.", "sortTiles");
      sortState.answered = true;
    } else {
      if (ok) {
        var label = "Sort: shoes / clothes / décor";
        var wasWrong = wrongLog.some(function(w){return w.label===label;});
        if (wasWrong) { score.correct += 1; wrongLog = wrongLog.filter(function(w){return w.label!==label;}); renderScore(); }
      }
    }
  }

  on($("sortCheck"), "click", checkSort);
  on($("sortHint"), "click", function(){
    var fb = $("sortFb");
    if (fb) {
      fb.className = "feedback";
      fb.textContent = "Hint: shoes go on feet; clothes go on the body; décor stays in the home.";
    }
  });
  on($("sortReset"), "click", function(){
    renderSort();
    var fb = $("sortFb");
    if (fb) { fb.className="feedback"; fb.textContent=""; }
  });

  /* ---------------------------
     5) Sentence Builder (word order)
  ----------------------------*/
  var orderData = [
    { prompt:"Polite request in a store:", words:["Could","I","try","these","on,","please?"], answer:"Could I try these on, please?", hint:"Start with ‘Could I…’ then the verb." },
    { prompt:"Asking about size:", words:["Do","you","have","this","in","a","medium?"], answer:"Do you have this in a medium?", hint:"‘Do you have…’ + item + ‘in a’ + size." },
    { prompt:"Paying:", words:["I'd","like","to","pay","by","card," ,"please."], answer:"I'd like to pay by card, please.", hint:"‘I'd like to…’ is polite." }
  ];

  function renderOrder() {
    var root = $("order");
    if (!root) return;
    root.innerHTML = "";
    orderData.forEach(function(item, idx){
      var id = "order_" + idx;
      var block = document.createElement("div");
      block.className = "builder";
      block.id = id;
      block.innerHTML =
        '<div class="builderTop">' +
          '<div class="builderPrompt">' + esc(item.prompt) + '</div>' +
          '<div class="optRow">' +
            '<button class="btn btnGhost btnSmall" type="button" data-act="listen">🔊</button>' +
            '<button class="btn btnSmall" type="button" data-act="check">Check</button>' +
            '<button class="btn btnGhost btnSmall" type="button" data-act="hint">Hint</button>' +
            '<button class="btn btnGhost btnSmall" type="button" data-act="reset">Reset</button>' +
          '</div>' +
        '</div>' +
        '<div class="answerLine" aria-label="Your sentence" data-role="line"></div>' +
        '<div class="bank" data-role="bank"></div>' +
        '<div class="feedback" aria-live="polite"></div>';

      var line = block.querySelector('[data-role="line"]');
      var bank = block.querySelector('[data-role="bank"]');
      var fb = block.querySelector(".feedback");
      var used = {};
      var answered = false;

      function setFb(ok, txt){
        fb.className = "feedback " + (ok ? "good" : "bad");
        fb.textContent = txt;
      }

      function reset() {
        used = {};
        line.innerHTML = "";
        bank.innerHTML = "";
        shuffle(item.words).forEach(function(w, wi){
          var tok = document.createElement("div");
          tok.className = "token";
          tok.setAttribute("data-w", w);
          tok.textContent = w;
          on(tok, "click", function(){
            if (used[wi]) return;
            used[wi] = true;
            tok.classList.add("used");
            var span = document.createElement("span");
            span.className = "token";
            span.textContent = w;
            on(span, "click", function(){
              // remove from line, reactivate original
              line.removeChild(span);
              used[wi] = false;
              tok.classList.remove("used");
            });
            line.appendChild(span);
          });
          bank.appendChild(tok);
        });
        setFb(false, "");
      }

      function currentSentence(){
        var parts = [];
        var kids = line.querySelectorAll(".token");
        for (var i=0;i<kids.length;i++) parts.push(kids[i].textContent);
        return parts.join(" ").replace(/\s+([,?.!])/g, "$1").replace(/\s+/g," ").trim();
      }

      on(block.querySelector('[data-act="listen"]'), "click", function(){ speak(item.answer); });
      on(block.querySelector('[data-act="hint"]'), "click", function(){ setFb(false, "Hint: " + item.hint); });
      on(block.querySelector('[data-act="reset"]'), "click", reset);

      on(block.querySelector('[data-act="check"]'), "click", function(){
        var s = currentSentence();
        var ok = s === item.answer;
        setFb(ok, ok ? "✅ Perfect!" : "❌ Not quite. Adjust the order (or use Hint).");
        if (!answered) {
          addAttempt(ok, "Word order " + (idx+1) + ": " + item.prompt, item.hint, id);
          answered = true;
        } else if (ok) {
          var label = "Word order " + (idx+1) + ": " + item.prompt;
          var wasWrong = wrongLog.some(function(w){return w.label===label;});
          if (wasWrong) { score.correct += 1; wrongLog = wrongLog.filter(function(w){return w.label!==label;}); renderScore(); }
        }
      });

      reset();
      root.appendChild(block);
    });
  }

  /* ---------------------------
     6) Fill-in-the-Blank (word bank + blanks)
  ----------------------------*/
  var fillData = {
    bank: ["receipt", "exchange", "fits", "refund", "cash", "size", "discount", "try on"],
    items: [
      { sentence:"Do you have this in my ____?", blanks:["size"], hint:"It’s about how big or small it is." },
      { sentence:"Could I ____ this jacket, please?", blanks:["try on"], hint:"You do this before you buy clothes." },
      { sentence:"It doesn’t ____ me. It’s too small.", blanks:["fits"], hint:"Verb: when clothing is the right size." },
      { sentence:"Can I get a ____? I paid by card.", blanks:["refund"], hint:"Money back." },
      { sentence:"Do you accept ____? I don’t have a card.", blanks:["cash"], hint:"Coins/banknotes." }
    ]
  };

  function renderFill() {
    var root = $("fill");
    if (!root) return;
    root.innerHTML = "";

    var id = "fill_section";
    var block = document.createElement("div");
    block.className = "builder";
    block.id = id;
    block.innerHTML =
      '<div class="builderTop">' +
        '<div class="builderPrompt">Word bank</div>' +
        '<div class="optRow">' +
          '<button class="btn btnSmall" type="button" data-act="check">Check</button>' +
          '<button class="btn btnGhost btnSmall" type="button" data-act="hint">Hint</button>' +
          '<button class="btn btnGhost btnSmall" type="button" data-act="reset">Reset</button>' +
        '</div>' +
      '</div>' +
      '<div class="bank" data-role="bank"></div>' +
      '<div class="hr"></div>' +
      '<div data-role="sentences"></div>' +
      '<div class="feedback" aria-live="polite"></div>';

    root.appendChild(block);

    var bankEl = block.querySelector('[data-role="bank"]');
    var sentEl = block.querySelector('[data-role="sentences"]');
    var fb = block.querySelector(".feedback");

    var selectedWord = null;
    var selectedBlank = null;
    var answered = false;

    function setFb(ok, txt){
      fb.className = "feedback " + (ok ? "good" : "bad");
      fb.textContent = txt;
    }

    function reset() {
      selectedWord = null;
      selectedBlank = null;
      bankEl.innerHTML = "";
      sentEl.innerHTML = "";
      setFb(false, "");

      shuffle(fillData.bank).forEach(function(w){
        var tok = document.createElement("div");
        tok.className = "token";
        tok.textContent = w;
        on(tok, "click", function(){
          // select word
          var all = bankEl.querySelectorAll(".token");
          for (var i=0;i<all.length;i++) all[i].classList.remove("selected");
          tok.classList.add("selected");
          selectedWord = w;
        });
        bankEl.appendChild(tok);
      });

      fillData.items.forEach(function(it, idx){
        var row = document.createElement("div");
        row.style.marginBottom = "10px";
        var html = esc(it.sentence).replace("____", '<span class="blank" data-idx="'+idx+'">____</span>');
        row.innerHTML = '<div>' + html + '</div>';
        sentEl.appendChild(row);
      });

      var blanks = sentEl.querySelectorAll(".blank");
      for (var b=0;b<blanks.length;b++){
        (function(blankEl){
          on(blankEl, "click", function(){
            var all = sentEl.querySelectorAll(".blank");
            for (var i=0;i<all.length;i++) all[i].classList.remove("selected");
            blankEl.classList.add("selected");
            selectedBlank = blankEl;

            if (selectedWord) {
              blankEl.textContent = selectedWord;
              blankEl.classList.add("filled");
            }
          });
        })(blanks[b]);
      }
    }

    function check() {
      var correct = 0;
      for (var i=0;i<fillData.items.length;i++){
        var blank = sentEl.querySelector('.blank[data-idx="'+i+'"]');
        var val = blank ? blank.textContent.trim() : "";
        var want = fillData.items[i].blanks[0];
        if (val === want) correct++;
      }
      var ok = correct === fillData.items.length;
      setFb(ok, ok ? "✅ All correct!" : ("❌ " + correct + " / " + fillData.items.length + " correct. Fix the blanks."));
      if (!answered) {
        addAttempt(ok, "Fill-in-the-blank: store language", "Use: size / try on / fits / refund / cash.", id);
        answered = true;
      } else if (ok) {
        var label = "Fill-in-the-blank: store language";
        var wasWrong = wrongLog.some(function(w){return w.label===label;});
        if (wasWrong) { score.correct += 1; wrongLog = wrongLog.filter(function(w){return w.label!==label;}); renderScore(); }
      }
    }

    on(block.querySelector('[data-act="reset"]'), "click", reset);
    on(block.querySelector('[data-act="check"]'), "click", check);
    on(block.querySelector('[data-act="hint"]'), "click", function(){
      setFb(false, "Hint: fits = correct size. refund = money back. cash = coins/bills. try on = test clothing.");
    });

    reset();
  }

  /* ---------------------------
     7) Dialogue (choose your lines)
  ----------------------------*/
  var dialogueData = [
    {
      title: "Scenario A — Trying on shoes",
      steps: [
        { speaker:"You", prompt:"Greet the assistant politely.", opts:[
          "Hey! Shoes now.",
          "Hi there. Could you help me, please?",
          "Give me sneakers."
        ], a:1, hint:"Use ‘Could you… please?’" },
        { speaker:"Assistant", fixed:"Of course! What size are you looking for?" },
        { speaker:"You", prompt:"Ask if you can try them on.", opts:[
          "I try now.",
          "Could I try these on, please?",
          "You must give me a discount."
        ], a:1, hint:"Could I… please?" },
        { speaker:"Assistant", fixed:"Sure. The fitting area is right over there." },
        { speaker:"You", prompt:"You want to pay. Choose a polite line.", opts:[
          "I pay card.",
          "I'd like to pay by card, please.",
          "Money!"
        ], a:1, hint:"‘I'd like to…’ is polite." }
      ]
    },
    {
      title: "Scenario B — Returning an item",
      steps: [
        { speaker:"You", prompt:"Explain the problem politely.", opts:[
          "This is bad. Refund now.",
          "Hi, I bought this yesterday, but it doesn't fit.",
          "No good."
        ], a:1, hint:"Use ‘but it doesn’t fit’." },
        { speaker:"Assistant", fixed:"I'm sorry about that. Do you have the receipt?" },
        { speaker:"You", prompt:"Answer politely.", opts:[
          "Yes, here it is.",
          "Receipt? No.",
          "Why?"
        ], a:0, hint:"Short polite answer." },
        { speaker:"Assistant", fixed:"Thanks. Would you like an exchange or a refund?" },
        { speaker:"You", prompt:"Choose what you want.", opts:[
          "An exchange, please.",
          "Refund. Fast.",
          "I leave."
        ], a:0, hint:"Add ‘please’." }
      ]
    }
  ];

  function renderDialogue() {
    var root = $("dialogue");
    if (!root) return;
    root.innerHTML = "";

    dialogueData.forEach(function(scene, sidx){
      var id = "dlg_" + sidx;
      var block = document.createElement("div");
      block.className = "builder";
      block.id = id;

      block.innerHTML =
        '<div class="builderTop">' +
          '<div class="builderPrompt">' + esc(scene.title) + '</div>' +
          '<div class="optRow">' +
            '<button class="btn btnGhost btnSmall" data-act="listenAll" type="button">🔊 Listen</button>' +
            '<button class="btn btnSmall" data-act="check" type="button">Check</button>' +
            '<button class="btn btnGhost btnSmall" data-act="hint" type="button">Hint</button>' +
            '<button class="btn btnGhost btnSmall" data-act="reset" type="button">Reset</button>' +
          '</div>' +
        '</div>' +
        '<div data-role="steps"></div>' +
        '<div class="feedback" aria-live="polite"></div>';

      root.appendChild(block);

      var stepsEl = block.querySelector('[data-role="steps"]');
      var fb = block.querySelector(".feedback");
      var picks = {};
      var answered = false;

      function setFb(ok, txt){
        fb.className = "feedback " + (ok ? "good" : "bad");
        fb.textContent = txt;
      }

      function renderSteps(){
        stepsEl.innerHTML = "";
        scene.steps.forEach(function(step, idx){
          var row = document.createElement("div");
          row.className = "qBlock";
          row.style.margin = "10px 0";
          if (step.fixed) {
            row.innerHTML =
              '<div class="qPrompt">' + esc(step.speaker) + ':</div>' +
              '<div>' + esc(step.fixed) + '</div>' +
              '<div class="qActions"><button type="button" class="btn btnGhost btnSmall" data-say="'+esc(step.fixed)+'">🔊</button></div>';
          } else {
            var opts = step.opts.map(function(o, oi){
              return '<button type="button" class="opt" data-oi="'+oi+'" aria-pressed="false">' + esc(o) + '</button>';
            }).join("");
            row.innerHTML =
              '<div class="qPrompt">' + esc(step.speaker) + ':</div>' +
              '<div class="qMeta">' + esc(step.prompt) + '</div>' +
              '<div class="optRow">' + opts + '</div>';
          }
          stepsEl.appendChild(row);
        });

        // wire listen buttons + choices
        var sayBtns = stepsEl.querySelectorAll("[data-say]");
        for (var i=0;i<sayBtns.length;i++){
          on(sayBtns[i], "click", function(){ speak(this.getAttribute("data-say")); });
        }

        // choices
        var blocks = stepsEl.querySelectorAll(".qBlock");
        var stepIndex = -1;
        for (var b=0;b<blocks.length;b++){
          var hasOpts = blocks[b].querySelectorAll(".opt").length;
          if (!hasOpts) continue;
          stepIndex += 1;
          (function(si, container){
            var opts = container.querySelectorAll(".opt");
            for (var j=0;j<opts.length;j++){
              on(opts[j], "click", function(){
                var oi = parseInt(this.getAttribute("data-oi"),10);
                picks[si] = oi;
                for (var k=0;k<opts.length;k++) opts[k].setAttribute("aria-pressed","false");
                this.setAttribute("aria-pressed","true");
              });
            }
          })(stepIndex, blocks[b]);
        }
      }

      function listenAll(){
        // Speak only fixed lines + correct lines (or chosen if present)
        var lines = [];
        var choiceStep = 0;
        scene.steps.forEach(function(step){
          if (step.fixed) { lines.push(step.fixed); }
          else {
            var picked = picks[choiceStep];
            var line = (picked != null) ? step.opts[picked] : step.opts[step.a];
            lines.push(line);
            choiceStep += 1;
          }
        });
        var i = 0;
        function next(){
          if (i >= lines.length) return;
          speak(lines[i]);
          i += 1;
          setTimeout(next, 900);
        }
        next();
      }

      function hint(){
        // show the most useful hint (first unanswered or wrong)
        var h = null;
        var cs = 0;
        for (var i=0;i<scene.steps.length;i++){
          var st = scene.steps[i];
          if (st.fixed) continue;
          var picked = picks[cs];
          if (picked == null || picked !== st.a) { h = st.hint; break; }
          cs += 1;
        }
        setFb(false, "Hint: " + (h || "Focus on polite forms: Could I…? I'd like to… please."));
      }

      function check(){
        var okCount = 0, total = 0;
        var cs = 0;
        for (var i=0;i<scene.steps.length;i++){
          var st = scene.steps[i];
          if (st.fixed) continue;
          total += 1;
          if (picks[cs] === st.a) okCount += 1;
          cs += 1;
        }
        var ok = okCount === total;
        setFb(ok, ok ? "✅ Great conversation!" : ("❌ " + okCount + " / " + total + " correct. Fix your choices."));
        if (!answered) {
          addAttempt(ok, "Dialogue: " + scene.title, "Look for polite modals: Could I…? Would you like…? please.", id);
          answered = true;
        } else if (ok) {
          var label = "Dialogue: " + scene.title;
          var wasWrong = wrongLog.some(function(w){return w.label===label;});
          if (wasWrong) { score.correct += 1; wrongLog = wrongLog.filter(function(w){return w.label!==label;}); renderScore(); }
        }
      }

      function reset(){
        picks = {};
        setFb(false,"");
        renderSteps();
      }

      renderSteps();

      on(block.querySelector('[data-act="listenAll"]'), "click", listenAll);
      on(block.querySelector('[data-act="hint"]'), "click", hint);
      on(block.querySelector('[data-act="check"]'), "click", check);
      on(block.querySelector('[data-act="reset"]'), "click", reset);
    });
  }

  /* ---------------------------
     8) Reading (MCQ + True/False)
  ----------------------------*/
  var readingData = {
    text:
      "You walk into a small boutique on a Saturday afternoon. The assistant greets you and asks if you need help. " +
      "You are looking for a hoodie and a pair of sneakers. The assistant suggests your size, and you try them on. " +
      "The hoodie fits, but the sneakers feel tight. You decide to buy the hoodie and ask to pay by card. " +
      "Before leaving, you ask for the receipt in case you need an exchange later.",
    mcq: [
      { q:"What two items is the customer looking for?", opts:["Boots and a dress","A hoodie and sneakers","Curtains and a lamp","Jeans and heels"], a:1, hint:"Look at the first part of the text." },
      { q:"Why does the customer ask for a receipt?", opts:["To get a discount","To exchange later if needed","To ask directions","To pay cash"], a:1, hint:"It’s mentioned at the end." },
      { q:"How does the customer pay?", opts:["By card","By cash","By check","Online"], a:0, hint:"The customer asks to pay by card." }
    ],
    tf: [
      { s:"The customer buys both items.", a:false, hint:"Sneakers are tight." },
      { s:"The hoodie fits.", a:true, hint:"It’s said directly." },
      { s:"The customer pays with cash.", a:false, hint:"Pay by card." }
    ]
  };

  function renderReading() {
    var root = $("reading");
    if (!root) return;
    root.innerHTML = "";

    var id = "reading_section";
    var block = document.createElement("div");
    block.className = "builder";
    block.id = id;
    block.innerHTML =
      '<div class="builderTop">' +
        '<div class="builderPrompt">Reading</div>' +
        '<div class="optRow">' +
          '<button class="btn btnGhost btnSmall" data-act="listen" type="button">🔊 Listen</button>' +
          '<button class="btn btnSmall" data-act="check" type="button">Check</button>' +
          '<button class="btn btnGhost btnSmall" data-act="hint" type="button">Hint</button>' +
          '<button class="btn btnGhost btnSmall" data-act="reset" type="button">Reset</button>' +
        '</div>' +
      '</div>' +
      '<div class="readingText" id="readingText">' + esc(readingData.text) + '</div>' +
      '<div class="hr"></div>' +
      '<div id="readingMCQ"></div>' +
      '<div class="hr"></div>' +
      '<div id="readingTF"></div>' +
      '<div class="feedback" aria-live="polite"></div>';

    root.appendChild(block);

    var fb = block.querySelector(".feedback");
    var mcqWrap = $("readingMCQ");
    var tfWrap = $("readingTF");
    var picksMCQ = {};
    var picksTF = {};
    var answered = false;

    function setFb(ok, txt){
      fb.className = "feedback " + (ok ? "good" : "bad");
      fb.textContent = txt;
    }

    function renderQs(){
      // MCQ
      mcqWrap.innerHTML = "<h3 style='margin:0 0 10px;color:var(--muted)'>MCQ</h3>";
      readingData.mcq.forEach(function(item, idx){
        var qId = "r_mcq_" + idx;
        var q = document.createElement("div");
        q.className = "qBlock";
        q.innerHTML =
          '<div class="qPrompt">' + (idx+1) + ". " + esc(item.q) + '</div>' +
          '<div class="optRow">' +
          item.opts.map(function(opt, oi){
            return '<button type="button" class="opt" data-q="'+idx+'" data-oi="'+oi+'" aria-pressed="false">' + esc(opt) + '</button>';
          }).join("") +
          '</div>';
        mcqWrap.appendChild(q);
      });

      // TF
      tfWrap.innerHTML = "<h3 style='margin:0 0 10px;color:var(--muted)'>True / False</h3>";
      readingData.tf.forEach(function(item, idx){
        var q = document.createElement("div");
        q.className = "qBlock";
        q.innerHTML =
          '<div class="qPrompt">' + (idx+1) + ". " + esc(item.s) + '</div>' +
          '<div class="optRow">' +
            '<button type="button" class="opt" data-tf="'+idx+'" data-val="true" aria-pressed="false">True</button>' +
            '<button type="button" class="opt" data-tf="'+idx+'" data-val="false" aria-pressed="false">False</button>' +
          '</div>';
        tfWrap.appendChild(q);
      });

      // wire clicks
      var mcqBtns = mcqWrap.querySelectorAll(".opt");
      for (var i=0;i<mcqBtns.length;i++){
        on(mcqBtns[i], "click", function(){
          var qi = parseInt(this.getAttribute("data-q"),10);
          var oi = parseInt(this.getAttribute("data-oi"),10);
          picksMCQ[qi] = oi;
          // aria pressed group
          var group = mcqWrap.querySelectorAll('.opt[data-q="'+qi+'"]');
          for (var g=0;g<group.length;g++) group[g].setAttribute("aria-pressed","false");
          this.setAttribute("aria-pressed","true");
        });
      }

      var tfBtns = tfWrap.querySelectorAll(".opt");
      for (var j=0;j<tfBtns.length;j++){
        on(tfBtns[j], "click", function(){
          var qi = parseInt(this.getAttribute("data-tf"),10);
          var val = this.getAttribute("data-val")==="true";
          picksTF[qi] = val;
          var group = tfWrap.querySelectorAll('.opt[data-tf="'+qi+'"]');
          for (var g=0;g<group.length;g++) group[g].setAttribute("aria-pressed","false");
          this.setAttribute("aria-pressed","true");
        });
      }
    }

    function hint(){
      // pick first missing/wrong hint
      for (var i=0;i<readingData.mcq.length;i++){
        if (picksMCQ[i] == null || picksMCQ[i] !== readingData.mcq[i].a) {
          setFb(false, "Hint: " + readingData.mcq[i].hint);
          return;
        }
      }
      for (var j=0;j<readingData.tf.length;j++){
        if (picksTF[j] == null || picksTF[j] !== readingData.tf[j].a) {
          setFb(false, "Hint: " + readingData.tf[j].hint);
          return;
        }
      }
      setFb(false, "Hint: Re-read the passage and look for key words like ‘fits’, ‘tight’, ‘receipt’, ‘pay by card’.");
    }

    function check(){
      var correct = 0, total = 0;

      for (var i=0;i<readingData.mcq.length;i++){
        total++;
        if (picksMCQ[i] === readingData.mcq[i].a) correct++;
      }
      for (var j=0;j<readingData.tf.length;j++){
        total++;
        if (picksTF[j] === readingData.tf[j].a) correct++;
      }

      var ok = correct === total;
      setFb(ok, ok ? "✅ Excellent reading comprehension!" : ("❌ " + correct + " / " + total + " correct. Try again."));
      if (!answered) {
        addAttempt(ok, "Reading: MCQ + True/False", "Look for: hoodie fits; sneakers tight; pay by card; receipt for exchange.", id);
        answered = true;
      } else if (ok) {
        var label = "Reading: MCQ + True/False";
        var wasWrong = wrongLog.some(function(w){return w.label===label;});
        if (wasWrong) { score.correct += 1; wrongLog = wrongLog.filter(function(w){return w.label!==label;}); renderScore(); }
      }
    }

    function reset(){
      picksMCQ = {};
      picksTF = {};
      setFb(false,"");
      renderQs();
    }

    on(block.querySelector('[data-act="listen"]'), "click", function(){ speak(readingData.text); });
    on(block.querySelector('[data-act="hint"]'), "click", hint);
    on(block.querySelector('[data-act="check"]'), "click", check);
    on(block.querySelector('[data-act="reset"]'), "click", reset);

    reset();
  }

  /* ---------------------------
     Reset All
  ----------------------------*/
  function resetAll() {
    score.correct = 0; score.total = 0;
    wrongLog = [];
    renderScore();

    renderFlashcards();
    renderMCQ();
    renderMatching();
    renderSort();
    renderOrder();
    renderFill();
    renderDialogue();
    renderReading();

    // clear feedback text blocks that are outside render funcs
    var ids = ["matchFb","sortFb"];
    for (var i=0;i<ids.length;i++){
      var el = $(ids[i]);
      if (el) { el.className="feedback"; el.textContent=""; }
    }
  }

  on($("resetAllBtn"), "click", function(){
    if (confirm("Reset all activities and score?")) resetAll();
  });

  /* ---------------------------
     Init
  ----------------------------*/
  renderScore();
  renderFlashcards();
  renderMCQ();
  renderMatching();
  renderSort();
  renderOrder();
  renderFill();
  renderDialogue();
  renderReading();

})();
