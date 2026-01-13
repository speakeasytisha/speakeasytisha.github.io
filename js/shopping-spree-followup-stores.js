/* SpeakEasyTisha — Shopping Spree follow-up (Shoes · Clothes · Décor)
   COMPLETE JS: vocab flashcards + MCQ + matching + drag/tap DnD + sentence order +
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
  function has(el) { return !!el; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function norm(s) {
    return String(s || "")
      .replace(/\s+/g, " ")
      .replace(/\u00A0/g, " ")
      .trim()
      .toLowerCase();
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function setPill(pillId, earned, max, status) {
    var pill = $(pillId);
    if (!pill) return;
    pill.textContent = earned + " / " + max + " pts";
    pill.classList.remove("ok", "bad");
    if (status === "ok") pill.classList.add("ok");
    if (status === "bad") pill.classList.add("bad");
  }

  function setFeedback(id, html) {
    var el = $(id);
    if (!el) return;
    el.innerHTML = html;
  }

  function confirmReset(msg) {
    return window.confirm(msg || "Reset this activity?");
  }

  /* ---------------------------
     Persistent state (score + settings)
  ----------------------------*/
  var LS_KEY = "SET_shopping_spree_followup_stores_v2";

  var SPOKE_MAX = 6;
  var state = {
    accent: "US",
    score: 0,
    max: 0,
    earnedByActivity: {},
    spokeBonus: 0,
    vocabTheme: "shoe",
    vocabMode: "term",
    vocabExamples: true
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && typeof s === "object") {
          state = Object.assign(state, s);
        }
      }
    } catch (e) { /* ignore */ }
  }
  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function setActivityPoints(activityId, earned, max) {
    state.earnedByActivity[activityId] = { earned: earned, max: max };
    recalcScore();
  }

  function recalcScore() {
    var totalE = 0, totalM = 0;
    var keys = Object.keys(state.earnedByActivity || {});
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var it = state.earnedByActivity[k];
      if (!it) continue;
      totalE += Number(it.earned || 0);
      totalM += Number(it.max || 0);
    }
    totalE += Number(state.spokeBonus || 0);
    state.score = totalE;
    state.max = totalM + SPOKE_MAX;
    updateScoreUI();
    saveState();
  }

  function updateScoreUI() {
    if (has($("scoreTop"))) $("scoreTop").textContent = state.score + " / " + state.max;
    if (has($("scoreBottom"))) $("scoreBottom").textContent = state.score + " / " + state.max;

    var pct = state.max ? Math.round((state.score / state.max) * 100) : 0;
    if (has($("progressBar"))) $("progressBar").style.width = clamp(pct, 0, 100) + "%";

    var badge = "Level: Starter";
    if (pct >= 85) badge = "Level: Fluent shopper";
    else if (pct >= 65) badge = "Level: Confident";
    else if (pct >= 40) badge = "Level: Improving";
    if (has($("levelBadge"))) $("levelBadge").textContent = badge;
  }

  function resetWholeLesson() {
    if (!confirmReset("Reset the whole lesson (score + answers + saved progress)?")) return;
    try { localStorage.removeItem(LS_KEY); } catch (e) { /* ignore */ }
    state.score = 0;
    state.max = 0;
    state.earnedByActivity = {};
    state.spokeBonus = 0;
    // keep accent choice? reset to US for simplicity
    state.accent = "US";
    saveState();
    initAll(true);
  }

  /* ---------------------------
     Speech (US/UK voices)
  ----------------------------*/
  var voices = [];
  var currentVoice = null;

  function refreshVoices() {
    if (!window.speechSynthesis || !window.speechSynthesis.getVoices) return;
    voices = window.speechSynthesis.getVoices() || [];
    pickVoice();
  }

  function pickVoice() {
    if (!voices || !voices.length) { currentVoice = null; return; }
    var want = (state.accent === "UK") ? "en-GB" : "en-US";
    var exact = null;
    for (var i = 0; i < voices.length; i++) {
      if (voices[i].lang === want) { exact = voices[i]; break; }
    }
    if (exact) { currentVoice = exact; return; }
    // fallback: any English voice
    for (var j = 0; j < voices.length; j++) {
      if (voices[j].lang && voices[j].lang.indexOf("en") === 0) {
        currentVoice = voices[j];
        return;
      }
    }
    currentVoice = voices[0] || null;
  }

  function stopSpeech() {
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }
  function pauseSpeech() {
    try {
      if (!window.speechSynthesis) return;
      if (window.speechSynthesis.speaking) {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        else window.speechSynthesis.pause();
      }
    } catch (e) { /* ignore */ }
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text || ""));
    if (currentVoice) u.voice = currentVoice;
    u.rate = 0.95;
    u.pitch = 1.0;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
  }

  function setAccent(accent) {
    state.accent = accent;
    saveState();
    pickVoice();

    var us = $("accentUS"), uk = $("accentUK");
    if (us && uk) {
      var isUS = (accent === "US");
      us.classList.toggle("is-on", isUS);
      uk.classList.toggle("is-on", !isUS);
      us.setAttribute("aria-pressed", isUS ? "true" : "false");
      uk.setAttribute("aria-pressed", !isUS ? "true" : "false");
    }
  }

  /* ---------------------------
     Tap-mode drag support (global)
  ----------------------------*/
  var picked = null; // { el, value, group, meta }

  function clearPicked() {
    if (picked && picked.el) picked.el.classList.remove("is-picked");
    picked = null;
  }

  function pickTile(el, value, group, meta) {
    clearPicked();
    picked = { el: el, value: value, group: group, meta: meta || {} };
    if (picked.el) picked.el.classList.add("is-picked");
  }

  function tileElement(label, value, group) {
    var t = document.createElement("div");
    t.className = "tile";
    t.textContent = label;
    t.setAttribute("draggable", "true");
    t.dataset.value = value;
    t.dataset.group = group;

    t.addEventListener("click", function () {
      pickTile(t, t.dataset.value, t.dataset.group, {});
    });

    t.addEventListener("dragstart", function (e) {
      try {
        e.dataTransfer.setData("text/plain", JSON.stringify({
          value: t.dataset.value,
          group: t.dataset.group,
          label: t.textContent
        }));
      } catch (err) { /* ignore */ }
    });

    return t;
  }

  function allowDrop(el, onDrop) {
    el.addEventListener("dragover", function (e) { e.preventDefault(); });
    el.addEventListener("drop", function (e) {
      e.preventDefault();
      var payload = null;
      try {
        payload = JSON.parse(e.dataTransfer.getData("text/plain"));
      } catch (err) { payload = null; }
      if (payload && onDrop) onDrop(payload);
    });

    // tap-mode placement
    el.addEventListener("click", function () {
      if (!picked) return;
      if (onDrop) onDrop({ value: picked.value, group: picked.group, label: picked.el ? picked.el.textContent : picked.value, _pickedEl: picked.el });
    });
  }

  /* ---------------------------
     Vocabulary (flashcards)
  ----------------------------*/
  var VOCAB = {
    shoe: [
      { icon: "👟", term: "sneakers", def: "casual sports shoes", ex: "Do you have these sneakers in a size 39?", uk: "trainers", us: "sneakers" },
      { icon: "👢", term: "boots", def: "shoes that cover the ankle (or more)", ex: "I’m looking for waterproof boots.", uk: "boots", us: "boots" },
      { icon: "👠", term: "heels", def: "shoes with high heels", ex: "Could I try these heels on?", uk: "heels", us: "heels" },
      { icon: "🥿", term: "flats", def: "shoes without heels", ex: "Flats are more comfortable for walking.", uk: "flats", us: "flats" },
      { icon: "📏", term: "size", def: "how big the shoe is", ex: "What size are you? I’m a 7 in the US.", uk: "size", us: "size" },
      { icon: "🧦", term: "a pair of socks", def: "two socks together", ex: "I’ll take two pairs of socks, please.", uk: "a pair", us: "a pair" },
      { icon: "🧵", term: "laces", def: "strings used to tie shoes", ex: "These laces are too long.", uk: "laces", us: "laces" },
      { icon: "🧴", term: "shoe polish", def: "product to clean/shine leather shoes", ex: "Do you sell shoe polish?", uk: "shoe polish", us: "shoe polish" },
      { icon: "🧾", term: "receipt", def: "paper showing what you paid", ex: "Could I have a receipt, please?", uk: "receipt", us: "receipt" },
      { icon: "🔁", term: "exchange", def: "change for a different size/item", ex: "Can I exchange these if they don’t fit?", uk: "exchange", us: "exchange" },
      { icon: "💸", term: "refund", def: "money back", ex: "What’s your refund policy?", uk: "refund", us: "refund" },
      { icon: "🧪", term: "waterproof", def: "doesn’t let water in", ex: "Are these boots waterproof?", uk: "waterproof", us: "waterproof" }
    ],
    clothing: [
      { icon: "👗", term: "dress", def: "a one-piece outfit", ex: "I’m looking for a black dress.", uk: "dress", us: "dress" },
      { icon: "🧥", term: "coat", def: "warm outer clothing", ex: "This coat is on sale.", uk: "coat", us: "coat" },
      { icon: "🧶", term: "jumper / sweater", def: "a warm knitted top", ex: "Do you have this jumper in medium?", uk: "jumper", us: "sweater" },
      { icon: "👖", term: "jeans", def: "denim trousers", ex: "Could I try these jeans on?", uk: "jeans", us: "jeans" },
      { icon: "📐", term: "fitting room", def: "place to try clothes on", ex: "Where are the fitting rooms?", uk: "fitting room", us: "fitting room / dressing room" },
      { icon: "🎽", term: "size up / size down", def: "choose a bigger/smaller size", ex: "I might need to size up.", uk: "size up", us: "size up" },
      { icon: "🧵", term: "seam", def: "the stitched line in clothing", ex: "The seam is coming loose.", uk: "seam", us: "seam" },
      { icon: "🧷", term: "alterations", def: "changes to fit better", ex: "Do you offer alterations?", uk: "alterations", us: "alterations" },
      { icon: "🧺", term: "machine-washable", def: "can be washed in a machine", ex: "Is it machine-washable?", uk: "machine-washable", us: "machine-washable" },
      { icon: "🏷️", term: "on sale", def: "discounted", ex: "Is this jacket on sale?", uk: "in the sale", us: "on sale" },
      { icon: "🧾", term: "store credit", def: "money kept for later purchase", ex: "We can offer store credit.", uk: "credit note", us: "store credit" }
    ],
    decor: [
      { icon: "🛋️", term: "sofa / couch", def: "a big comfortable seat", ex: "Is this sofa available in grey?", uk: "sofa", us: "couch / sofa" },
      { icon: "🪑", term: "armchair", def: "comfortable chair with arms", ex: "Could you tell me the dimensions of this armchair?", uk: "armchair", us: "armchair" },
      { icon: "🛏️", term: "duvet / comforter", def: "thick blanket for the bed", ex: "I need a duvet cover.", uk: "duvet", us: "comforter" },
      { icon: "🕯️", term: "candle", def: "wax light with a wick", ex: "These candles smell amazing.", uk: "candle", us: "candle" },
      { icon: "🖼️", term: "frame", def: "border for a photo or art", ex: "Do you have this frame in a larger size?", uk: "frame", us: "frame" },
      { icon: "🪞", term: "mirror", def: "reflective surface", ex: "Is the mirror easy to hang?", uk: "mirror", us: "mirror" },
      { icon: "🧺", term: "storage basket", def: "container to organize items", ex: "I’m looking for storage baskets.", uk: "storage basket", us: "storage basket" },
      { icon: "💡", term: "lamp", def: "light you plug in", ex: "Could I see this lamp turned on?", uk: "lamp", us: "lamp" },
      { icon: "📦", term: "delivery", def: "bringing an item to your home", ex: "Do you offer delivery?", uk: "delivery", us: "delivery" },
      { icon: "🧰", term: "assembly", def: "putting furniture together", ex: "Is assembly included?", uk: "assembly", us: "assembly" },
      { icon: "📏", term: "dimensions", def: "measurements (W × H × D)", ex: "What are the dimensions?", uk: "dimensions", us: "dimensions" },
      { icon: "🏠", term: "homeware", def: "things for the home", ex: "This store has great homeware.", uk: "homeware", us: "home goods" }
    ]
  };

  function vocabDataset(theme) {
    if (theme === "mixed") return shuffle([].concat(VOCAB.shoe, VOCAB.clothing, VOCAB.decor)).slice(0, 16);
    return shuffle(VOCAB[theme]).slice(0, 16);
  }

  function renderFlashcards() {
    if (!has($("flashGrid"))) return;

    state.vocabTheme = has($("vocabTheme")) ? $("vocabTheme").value : state.vocabTheme;
    state.vocabMode = has($("vocabMode")) ? $("vocabMode").value : state.vocabMode;
    state.vocabExamples = has($("vocabExamples")) ? $("vocabExamples").checked : state.vocabExamples;
    saveState();

    var grid = $("flashGrid");
    grid.innerHTML = "";

    var data = vocabDataset(state.vocabTheme);
    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      var card = document.createElement("div");
      card.className = "flash";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Flashcard: " + item.term);

      var frontTitle = item.term;
      var backLines = [];

      if (state.vocabMode === "ukus") {
        frontTitle = (item.uk && item.us && item.uk !== item.us) ? (item.uk + " / " + item.us) : item.term;
        backLines.push("<strong>UK</strong>: " + esc(item.uk || item.term));
        backLines.push("<strong>US</strong>: " + esc(item.us || item.term));
        backLines.push("<span class='flash__meta'>Meaning: " + esc(item.def) + "</span>");
      } else {
        backLines.push("<span class='flash__meta'>" + esc(item.def) + "</span>");
      }

      if (state.vocabExamples) {
        backLines.push("<div class='flash__example'><em>Example:</em> " + esc(item.ex) + "</div>");
      }

      card.innerHTML =
        "<div class='flash__inner'>" +
        "  <div class='flash__face flash__face--front'>" +
        "    <div class='flash__top'>" +
        "      <div><div class='flash__term'>" + esc(frontTitle) + "</div></div>" +
        "      <div class='flash__icon' aria-hidden='true'>" + esc(item.icon) + "</div>" +
        "    </div>" +
        "    <div class='flash__tools'>" +
        "      <button class='flash__btn' type='button' data-say='" + esc(item.term) + "'>🔊</button>" +
        "      <span class='mono' style='color:var(--muted)'>tap to flip</span>" +
        "    </div>" +
        "  </div>" +
        "  <div class='flash__face flash__face--back'>" +
        "    <div>" + backLines.join("<br/>") + "</div>" +
        "    <div class='flash__tools'>" +
        "      <button class='flash__btn' type='button' data-say='" + esc(item.ex) + "'>🔊 example</button>" +
        "      <span class='mono' style='color:var(--muted)'>tap to flip</span>" +
        "    </div>" +
        "  </div>" +
        "</div>";

      (function (c) {
        function toggleFlip() { c.classList.toggle("is-flipped"); }

        c.addEventListener("click", function (e) {
          var t = e.target;
          if (t && t.getAttribute && t.getAttribute("data-say")) {
            e.stopPropagation();
            speak(t.getAttribute("data-say"));
            return;
          }
          toggleFlip();
        });

        c.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFlip(); }
        });
      })(card);

      grid.appendChild(card);
    }
  }

  /* ---------------------------
     Activity 1: Polite MCQ
  ----------------------------*/
  var politeMcqState = { answers: {} };

  var POLITE_MCQ = [
    {
      stem: "You want to try on a pair of shoes.",
      opts: [
        { t: "I want to try these on.", ok: false, why: "Grammatically fine, but it can sound abrupt in shops." },
        { t: "Could I try these on, please?", ok: true, why: "Perfect: polite and natural." },
        { t: "Give me the fitting room.", ok: false, why: "Too direct; sounds rude." }
      ]
    },
    {
      stem: "You need the staff to check stock.",
      opts: [
        { t: "Would you mind checking if you have it in blue?", ok: true, why: "Very polite request." },
        { t: "Check if you have it in blue.", ok: false, why: "Imperative = too direct here." },
        { t: "You must check in the back.", ok: false, why: "Sounds like an order." }
      ]
    },
    {
      stem: "You want the dimensions of a lamp.",
      opts: [
        { t: "What are the dimensions, please?", ok: true, why: "Polite and clear." },
        { t: "How big is it? Tell me.", ok: false, why: "Too direct." },
        { t: "You will give me the dimensions.", ok: false, why: "Not a request; sounds demanding." }
      ]
    },
    {
      stem: "You want a receipt.",
      opts: [
        { t: "May I have the receipt, please?", ok: true, why: "Formal/polite." },
        { t: "Receipt.", ok: false, why: "Too short/abrupt." },
        { t: "I need a receipt now.", ok: false, why: "Can sound impatient." }
      ]
    },
    {
      stem: "You want to exchange an item.",
      opts: [
        { t: "Can I exchange this if it doesn’t fit?", ok: true, why: "Common, polite enough." },
        { t: "I exchange this.", ok: false, why: "Missing modal; sounds strange." },
        { t: "You have to exchange this.", ok: false, why: "Sounds like a command." }
      ]
    }
  ];

  function renderMcq(containerId, data, stateObj, activityId, pillId) {
    var wrap = $(containerId);
    if (!wrap) return;

    var max = data.length;
    // initialize points if missing
    if (!state.earnedByActivity[activityId]) setActivityPoints(activityId, 0, max);

    var html = "<div class='mcq'>";
    for (var i = 0; i < data.length; i++) {
      var q = data[i];
      html += "<div class='q' data-q='" + i + "'>";
      html += "  <div class='q__stem'>" + esc((i + 1) + ". " + q.stem) + "</div>";
      html += "  <div class='opts'>";
      for (var j = 0; j < q.opts.length; j++) {
        var optId = containerId + "_q" + i + "_o" + j;
        html +=
          "    <label class='opt' for='" + esc(optId) + "' data-o='" + j + "'>" +
          "      <input type='radio' name='" + esc(containerId + "_q" + i) + "' id='" + esc(optId) + "' />" +
          "      <div>" +
          "        <div class='opt__t'>" + esc(q.opts[j].t) + "</div>" +
          "        <div class='explain' style='display:none'></div>" +
          "      </div>" +
          "    </label>";
      }
      html += "  </div>";
      html += "</div>";
    }
    html += "</div>";
    wrap.innerHTML = html;

    function recalc() {
      var earned = 0;
      for (var qi = 0; qi < data.length; qi++) {
        if (stateObj.answers[qi] === true) earned++;
      }
      setActivityPoints(activityId, earned, max);
      setPill(pillId, earned, max, earned === max ? "ok" : "");
    }

    function onPick(qIndex, oIndex) {
      var qd = data[qIndex];
      var opts = qd.opts;
      var ok = !!opts[oIndex].ok;
      stateObj.answers[qIndex] = ok;

      // Update UI for this question: mark correct/wrong + show explanation
      var qEl = wrap.querySelector(".q[data-q='" + qIndex + "']");
      if (!qEl) return;

      var labels = qEl.querySelectorAll(".opt");
      for (var k = 0; k < labels.length; k++) {
        labels[k].classList.remove("is-correct", "is-wrong");
        var exp = labels[k].querySelector(".explain");
        if (exp) { exp.style.display = "none"; exp.textContent = ""; }
      }
      var chosen = qEl.querySelector(".opt[data-o='" + oIndex + "']");
      if (chosen) {
        chosen.classList.add(ok ? "is-correct" : "is-wrong");
        var exp2 = chosen.querySelector(".explain");
        if (exp2) { exp2.style.display = "block"; exp2.textContent = opts[oIndex].why || ""; }
      }

      recalc();
      saveState();
    }

    // wire events
    for (var qi2 = 0; qi2 < data.length; qi2++) {
      (function (qIndex) {
        var qEl2 = wrap.querySelector(".q[data-q='" + qIndex + "']");
        if (!qEl2) return;
        var labels2 = qEl2.querySelectorAll(".opt");
        for (var oi = 0; oi < labels2.length; oi++) {
          (function (oIndex) {
            labels2[oIndex].addEventListener("click", function () {
              onPick(qIndex, oIndex);
            });
          })(oi);
        }
      })(qi2);
    }

    // restore (best-effort)
    for (var ri = 0; ri < data.length; ri++) {
      if (typeof stateObj.answers[ri] !== "undefined") {
        // find which option yields ok==stored? can't; just leave. (user can reselect)
      }
    }

    recalc();
  }

  function resetPoliteMcq() {
    if (!confirmReset("Reset the polite MCQ?")) return;
    politeMcqState.answers = {};
    renderPoliteMcq();
  }

  function renderPoliteMcq() {
    renderMcq("politeMcq", POLITE_MCQ, politeMcqState, "polite_mcq", "pill_polite_mcq");
  }

  /* ---------------------------
     Activity 2: Verb meaning match (tap or drag)
  ----------------------------*/
  var verbsMatchState = {
    placements: {} // defKey -> verbKey
  };

  var VERB_MATCH = [
    { key: "try_on", verb: "try on", def: "put on clothes/shoes to see if they fit" },
    { key: "fit", verb: "fit", def: "be the right size" },
    { key: "suit", verb: "suit", def: "look good on someone" },
    { key: "exchange", verb: "exchange", def: "swap for a different size/item" },
    { key: "refund", verb: "refund", def: "give money back" },
    { key: "deliver", verb: "deliver", def: "bring to your home" }
  ];

  function renderVerbMatch() {
    var wrap = $("verbMatch");
    if (!wrap) return;

    var max = VERB_MATCH.length;
    if (!state.earnedByActivity.verbs_match) setActivityPoints("verbs_match", 0, max);

    var verbs = shuffle(VERB_MATCH.map(function (x) { return { key: x.key, label: x.verb }; }));
    var defs = VERB_MATCH.map(function (x) { return { key: x.key, label: x.def }; });

    wrap.innerHTML = "";
    var pool = document.createElement("div");
    pool.className = "match__pool";
    pool.setAttribute("aria-label", "Verb tiles");

    for (var i = 0; i < verbs.length; i++) {
      var tile = tileElement(verbs[i].label, verbs[i].key, "verbs_match");
      pool.appendChild(tile);
    }

    var zonesWrap = document.createElement("div");
    zonesWrap.className = "dropzoneWrap";

    for (var d = 0; d < defs.length; d++) {
      (function (defItem) {
        var zone = document.createElement("div");
        zone.className = "zone";
        zone.innerHTML = "<h4>" + esc(defItem.label) + "</h4>";

        var bin = document.createElement("div");
        bin.className = "zone__bin";
        bin.dataset.defKey = defItem.key;

        allowDrop(bin, function (payload) {
          if (payload.group !== "verbs_match") return;
          // Place tile key into this def slot
          verbsMatchState.placements[defItem.key] = payload.value;

          // Move DOM element if we have it
          if (payload._pickedEl && payload._pickedEl.parentNode) payload._pickedEl.parentNode.removeChild(payload._pickedEl);
          var newTile = tileElement(payload.label, payload.value, "verbs_match");
          newTile.classList.remove("is-picked");
          newTile.addEventListener("click", function () { pickTile(newTile, payload.value, "verbs_match", {}); });
          bin.innerHTML = "";
          bin.appendChild(newTile);
          clearPicked();
        });

        zone.appendChild(bin);
        zonesWrap.appendChild(zone);
      })(defs[d]);
    }

    wrap.appendChild(pool);
    wrap.appendChild(zonesWrap);

    setFeedback("fb_verbs_match", "Tap a verb then tap a definition. Then press <strong>Check</strong>.");
    setPill("pill_verbs_match", 0, max, "");
  }

  function checkVerbMatch() {
    var wrap = $("verbMatch");
    if (!wrap) return;

    var max = VERB_MATCH.length;
    var correct = 0;

    var bins = wrap.querySelectorAll(".zone__bin");
    for (var i = 0; i < bins.length; i++) {
      var bin = bins[i];
      var key = bin.dataset.defKey;
      var placed = verbsMatchState.placements[key];

      // reset classes
      var tile = bin.querySelector(".tile");
      if (tile) tile.classList.remove("is-correct", "is-wrong");

      if (placed && placed === key) {
        correct++;
        if (tile) tile.classList.add("is-correct");
      } else {
        if (tile) tile.classList.add("is-wrong");
      }
    }

    setActivityPoints("verbs_match", correct, max);
    setPill("pill_verbs_match", correct, max, correct === max ? "ok" : (correct === 0 ? "bad" : ""));
    setFeedback("fb_verbs_match",
      "<strong>" + correct + " / " + max + "</strong> correct. " +
      (correct === max ? "Great! ✅" : "Use a hint if you need help.")
    );
  }

  function hintVerbMatch() {
    var wrap = $("verbMatch");
    if (!wrap) return;

    // find a definition not correct yet and auto-fill correctly (1)
    var bins = wrap.querySelectorAll(".zone__bin");
    for (var i = 0; i < bins.length; i++) {
      var key = bins[i].dataset.defKey;
      var placed = verbsMatchState.placements[key];
      if (placed !== key) {
        // remove any tile currently in this bin back to pool
        var pool = wrap.querySelector(".match__pool");
        var existing = bins[i].querySelector(".tile");
        if (existing && pool) pool.appendChild(existing);

        verbsMatchState.placements[key] = key;
        bins[i].innerHTML = "";
        bins[i].appendChild(tileElement(VERB_MATCH.filter(function (x) { return x.key === key; })[0].verb, key, "verbs_match"));
        setFeedback("fb_verbs_match", "Hint: I placed <strong>one</strong> correct match for you.");
        break;
      }
    }
  }

  function resetVerbMatch() {
    if (!confirmReset("Reset verb matching?")) return;
    verbsMatchState.placements = {};
    renderVerbMatch();
    setActivityPoints("verbs_match", 0, VERB_MATCH.length);
    setPill("pill_verbs_match", 0, VERB_MATCH.length, "");
    setFeedback("fb_verbs_match", "Reset! Tap a verb then tap a definition.");
  }

  /* ---------------------------
     Activity 3: Sentence order (Comparatives)
  ----------------------------*/
  var compareOrderState = { chosen: [] };

  var COMPARE_SENTENCE = {
    chunks: ["These", "boots", "are", "more", "comfortable", "than", "the", "heels", "."],
    answer: "These boots are more comfortable than the heels."
  };

  function renderSentenceOrder(bankId, stateObj, config, activityId, pillId, fbId) {
    var wrap = $(bankId);
    if (!wrap) return;

    var max = 1;
    if (!state.earnedByActivity[activityId]) setActivityPoints(activityId, 0, max);

    stateObj.chosen = [];
    wrap.innerHTML = "";

    var bank = document.createElement("div");
    bank.className = "order__bank";

    var answer = document.createElement("div");
    answer.className = "order__answer";
    answer.setAttribute("aria-label", "Your sentence");

    function updateAnswerUI() {
      answer.innerHTML = "";
      if (!stateObj.chosen.length) {
        answer.innerHTML = "<span class='mono' style='color:var(--muted)'>Tap chunks to build the sentence…</span>";
        return;
      }
      for (var i = 0; i < stateObj.chosen.length; i++) {
        (function (chunk, idx) {
          var t = document.createElement("div");
          t.className = "tile";
          t.textContent = chunk;
          // tap to remove
          t.addEventListener("click", function () {
            // remove chunk, put back to bank
            stateObj.chosen.splice(idx, 1);
            bank.appendChild(tileElement(chunk, chunk, activityId));
            updateAnswerUI();
          });
          answer.appendChild(t);
        })(stateObj.chosen[i], i);
      }
    }

    function addChunk(payload) {
      if (payload.group !== activityId) return;
      stateObj.chosen.push(payload.value);
      if (payload._pickedEl && payload._pickedEl.parentNode) payload._pickedEl.parentNode.removeChild(payload._pickedEl);
      clearPicked();
      updateAnswerUI();
    }

    for (var i2 = 0; i2 < config.chunks.length; i2++) {
      bank.appendChild(tileElement(config.chunks[i2], config.chunks[i2], activityId));
    }

    allowDrop(answer, addChunk);

    wrap.appendChild(bank);
    wrap.appendChild(answer);
    wrap.insertAdjacentHTML("beforeend", "<div class='answerHint mono'>Tip: on iPad, use tap mode — tap a chunk, then tap the answer line.</div>");

    setFeedback(fbId, "Build the sentence, then click <strong>Check</strong>.");
    setPill(pillId, 0, max, "");
  }

  function builtSentence(stateObj) {
    return stateObj.chosen.join(" ").replace(/\s+\./g, ".").replace(/\s+,/g, ",");
  }

  function checkCompareOrder() {
    var max = 1;
    var got = builtSentence(compareOrderState);
    var ok = norm(got) === norm(COMPARE_SENTENCE.answer);

    setActivityPoints("compare_order", ok ? 1 : 0, max);
    setPill("pill_compare_order", ok ? 1 : 0, max, ok ? "ok" : "bad");
    setFeedback("fb_compare_order",
      ok
        ? "✅ Correct! Nice comparative sentence."
        : "Not quite. Hint: start with <strong>These boots</strong>…"
    );
  }

  function hintCompareOrder() {
    // Place the next correct chunk if possible
    var correctChunks = COMPARE_SENTENCE.answer.replace(/\./g, " .").split(" ");
    var idx = compareOrderState.chosen.length;
    if (idx >= correctChunks.length) {
      setFeedback("fb_compare_order", "Hint: Your sentence is already complete — now check it.");
      return;
    }
    var next = correctChunks[idx];
    compareOrderState.chosen.push(next);
    // remove that chunk from bank if present
    var wrap = $("compareOrder");
    if (wrap) {
      var bank = wrap.querySelector(".order__bank");
      if (bank) {
        var tiles = bank.querySelectorAll(".tile");
        for (var i = 0; i < tiles.length; i++) {
          if (tiles[i].textContent === next) { bank.removeChild(tiles[i]); break; }
        }
      }
      // re-render answer quickly
      var answer = wrap.querySelector(".order__answer");
      if (answer) {
        answer.innerHTML = "";
        for (var j = 0; j < compareOrderState.chosen.length; j++) {
          (function (chunk, idx2) {
            var t = document.createElement("div");
            t.className = "tile";
            t.textContent = chunk;
            t.addEventListener("click", function () {
              compareOrderState.chosen.splice(idx2, 1);
              var bank2 = wrap.querySelector(".order__bank");
              if (bank2) bank2.appendChild(tileElement(chunk, chunk, "compare_order"));
              // recursive refresh
              hintCompareOrder(); // keep UI consistent (will add one more; so stop)
            });
            answer.appendChild(t);
          })(compareOrderState.chosen[j], j);
        }
      }
    }
    setFeedback("fb_compare_order", "Hint: I added the next chunk: <strong>" + esc(next) + "</strong>");
  }

  function resetCompareOrder() {
    if (!confirmReset("Reset sentence order?")) return;
    compareOrderState.chosen = [];
    renderSentenceOrder("compareOrder", compareOrderState, COMPARE_SENTENCE, "compare_order", "pill_compare_order", "fb_compare_order");
    setActivityPoints("compare_order", 0, 1);
  }

  /* ---------------------------
     Activity 4: Classify items into stores (DnD or tap)
  ----------------------------*/
  var classifyState = { placements: {} }; // itemKey -> storeKey

  var STORES = [
    { key: "shoe", label: "Shoe store" },
    { key: "clothing", label: "Clothing store" },
    { key: "decor", label: "Décor store" }
  ];

  var STORE_ITEMS = [
    { key: "ankle_boots", label: "ankle boots", store: "shoe" },
    { key: "shoe_laces", label: "laces", store: "shoe" },
    { key: "winter_coat", label: "winter coat", store: "clothing" },
    { key: "jumper", label: "jumper / sweater", store: "clothing" },
    { key: "lamp", label: "lamp", store: "decor" },
    { key: "mirror", label: "mirror", store: "decor" },
    { key: "jeans", label: "jeans", store: "clothing" },
    { key: "heels", label: "heels", store: "shoe" },
    { key: "candle", label: "candle", store: "decor" }
  ];

  function renderClassifyStores() {
    var wrap = $("dndStores");
    if (!wrap) return;

    var max = STORE_ITEMS.length;
    if (!state.earnedByActivity.classify_items) setActivityPoints("classify_items", 0, max);

    classifyState.placements = {};
    wrap.innerHTML = "";

    var pool = document.createElement("div");
    pool.className = "dnd__pool";
    pool.setAttribute("aria-label", "Items pool");

    var items = shuffle(STORE_ITEMS);
    for (var i = 0; i < items.length; i++) {
      pool.appendChild(tileElement(items[i].label, items[i].key, "classify_items"));
    }

    var zonesWrap = document.createElement("div");
    zonesWrap.className = "dropzoneWrap";

    for (var s = 0; s < STORES.length; s++) {
      (function (store) {
        var zone = document.createElement("div");
        zone.className = "zone";
        zone.innerHTML = "<h4>" + esc(store.label) + "</h4>";

        var bin = document.createElement("div");
        bin.className = "zone__bin";
        bin.dataset.storeKey = store.key;

        allowDrop(bin, function (payload) {
          if (payload.group !== "classify_items") return;
          classifyState.placements[payload.value] = store.key;

          if (payload._pickedEl && payload._pickedEl.parentNode) payload._pickedEl.parentNode.removeChild(payload._pickedEl);
          var t = tileElement(payload.label, payload.value, "classify_items");
          t.classList.remove("is-picked");
          bin.appendChild(t);
          clearPicked();
        });

        zone.appendChild(bin);
        zonesWrap.appendChild(zone);
      })(STORES[s]);
    }

    wrap.appendChild(pool);
    wrap.appendChild(zonesWrap);

    setFeedback("fb_classify_items", "Place all items, then click <strong>Check</strong>.");
    setPill("pill_classify_items", 0, max, "");
  }

  function checkClassifyStores() {
    var wrap = $("dndStores");
    if (!wrap) return;

    var max = STORE_ITEMS.length;
    var correct = 0;

    // mark all tiles by correctness (in bins)
    var bins = wrap.querySelectorAll(".zone__bin");
    for (var i = 0; i < bins.length; i++) {
      var bin = bins[i];
      var storeKey = bin.dataset.storeKey;
      var tiles = bin.querySelectorAll(".tile");
      for (var t = 0; t < tiles.length; t++) {
        var itemKey = tiles[t].dataset.value;
        var item = STORE_ITEMS.filter(function (x) { return x.key === itemKey; })[0];
        tiles[t].classList.remove("is-correct", "is-wrong");
        if (item && item.store === storeKey) {
          tiles[t].classList.add("is-correct");
          correct++;
        } else {
          tiles[t].classList.add("is-wrong");
        }
      }
    }

    setActivityPoints("classify_items", correct, max);
    setPill("pill_classify_items", correct, max, correct === max ? "ok" : "");
    setFeedback("fb_classify_items",
      "<strong>" + correct + " / " + max + "</strong> correct. " + (correct === max ? "✅ Perfect!" : "Try a hint for one item.")
    );
  }

  function hintClassifyStores() {
    var wrap = $("dndStores");
    if (!wrap) return;

    // move one misplaced item into correct bin if found in wrong bin; otherwise just place one from pool
    var pool = wrap.querySelector(".dnd__pool");
    var bins = wrap.querySelectorAll(".zone__bin");

    function binForStore(storeKey) {
      for (var i = 0; i < bins.length; i++) if (bins[i].dataset.storeKey === storeKey) return bins[i];
      return null;
    }

    // look for wrong tile already placed
    for (var i2 = 0; i2 < bins.length; i2++) {
      var bin = bins[i2];
      var storeKey = bin.dataset.storeKey;
      var tiles = bin.querySelectorAll(".tile");
      for (var t = 0; t < tiles.length; t++) {
        var itemKey = tiles[t].dataset.value;
        var item = STORE_ITEMS.filter(function (x) { return x.key === itemKey; })[0];
        if (item && item.store !== storeKey) {
          var target = binForStore(item.store);
          if (target) {
            target.appendChild(tiles[t]);
            setFeedback("fb_classify_items", "Hint: I moved <strong>" + esc(item.label) + "</strong> to the correct store.");
            return;
          }
        }
      }
    }

    // else place first item from pool correctly
    if (pool) {
      var poolTiles = pool.querySelectorAll(".tile");
      if (poolTiles.length) {
        var tile = poolTiles[0];
        var item2 = STORE_ITEMS.filter(function (x) { return x.key === tile.dataset.value; })[0];
        if (item2) {
          var target2 = binForStore(item2.store);
          if (target2) {
            target2.appendChild(tile);
            setFeedback("fb_classify_items", "Hint: I placed <strong>" + esc(item2.label) + "</strong> for you.");
          }
        }
      }
    }
  }

  function resetClassifyStores() {
    if (!confirmReset("Reset store classification?")) return;
    renderClassifyStores();
    setActivityPoints("classify_items", 0, STORE_ITEMS.length);
  }

  /* ---------------------------
     Activity 5: Fill in dialogue (word bank + blanks)
  ----------------------------*/
  var fillDialogueState = {
    blanks: [], // chosen words by index
    active: -1
  };

  var FILL_DIALOGUE = {
    bank: ["size", "try", "fit", "receipt", "exchange", "mind"],
    text: [
      "Customer: Hi! Could I ___ these on, please?",
      "Clerk: Of course. What ___ do you need?",
      "Customer: I’m not sure they ___ well. Do you have one size up?",
      "Clerk: Yes. Would you ___ waiting one minute?",
      "Customer: Thanks! If they still don’t fit, can I ___ them?",
      "Clerk: Yes, within 30 days. Keep your ___."
    ],
    answers: ["try", "size", "fit", "mind", "exchange", "receipt"]
  };

  function renderFillDialogue() {
    var wrap = $("fillDialogue");
    var bankWrap = $("wb_fill_dialogue");
    if (!wrap || !bankWrap) return;

    var max = FILL_DIALOGUE.answers.length;
    if (!state.earnedByActivity.fill_dialogue) setActivityPoints("fill_dialogue", 0, max);

    fillDialogueState.blanks = new Array(max);
    fillDialogueState.active = -1;

    // word bank chips
    bankWrap.innerHTML = "";
    for (var i = 0; i < FILL_DIALOGUE.bank.length; i++) {
      (function (w) {
        var chip = document.createElement("div");
        chip.className = "chiplet";
        chip.textContent = w;
        chip.setAttribute("draggable", "true");

        chip.addEventListener("click", function () {
          if (fillDialogueState.active === -1) {
            setFeedback("fb_fill_dialogue", "Tap a blank first, then choose a word.");
            return;
          }
          setBlank(fillDialogueState.active, w);
        });

        chip.addEventListener("dragstart", function (e) {
          try {
            e.dataTransfer.setData("text/plain", JSON.stringify({ w: w }));
          } catch (err) { /* ignore */ }
        });

        bankWrap.appendChild(chip);
      })(FILL_DIALOGUE.bank[i]);
    }

    // dialogue rendering with clickable blanks
    wrap.innerHTML = "";
    var html = "";
    var blankIndex = 0;

    for (var l = 0; l < FILL_DIALOGUE.text.length; l++) {
      var line = FILL_DIALOGUE.text[l];
      // replace first occurrence of ___ with span blank
      var parts = line.split("___");
      if (parts.length === 2) {
        html += esc(parts[0]) +
          " <span class='blank' data-i='" + blankIndex + "' role='button' tabindex='0'>___</span> " +
          esc(parts[1]) +
          "<br/>";
        blankIndex++;
      } else {
        html += esc(line) + "<br/>";
      }
    }
    wrap.innerHTML = html;

    var blanks = wrap.querySelectorAll(".blank");
    for (var b = 0; b < blanks.length; b++) {
      (function (idx) {
        var el = blanks[idx];

        function activate() {
          fillDialogueState.active = idx;
          // visual: remove picked from other blanks
          for (var k = 0; k < blanks.length; k++) blanks[k].classList.remove("is-picked");
          el.classList.add("is-picked");
        }

        el.addEventListener("click", function () { activate(); });

        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
        });

        el.addEventListener("dragover", function (e) { e.preventDefault(); });
        el.addEventListener("drop", function (e) {
          e.preventDefault();
          var payload = null;
          try { payload = JSON.parse(e.dataTransfer.getData("text/plain")); } catch (err) { payload = null; }
          if (payload && payload.w) {
            activate();
            setBlank(idx, payload.w);
          }
        });
      })(b);
    }

    setFeedback("fb_fill_dialogue", "Tap a blank, choose a word from the bank, then <strong>Check</strong>.");
    setPill("pill_fill_dialogue", 0, max, "");
  }

  function setBlank(idx, word) {
    fillDialogueState.blanks[idx] = word;
    var wrap = $("fillDialogue");
    if (!wrap) return;
    var el = wrap.querySelector(".blank[data-i='" + idx + "']");
    if (el) {
      el.textContent = word;
      el.classList.remove("is-correct", "is-wrong");
    }
  }

  function checkFillDialogue() {
    var wrap = $("fillDialogue");
    if (!wrap) return;

    var max = FILL_DIALOGUE.answers.length;
    var correct = 0;

    for (var i = 0; i < max; i++) {
      var ans = FILL_DIALOGUE.answers[i];
      var got = fillDialogueState.blanks[i];
      var el = wrap.querySelector(".blank[data-i='" + i + "']");
      if (!el) continue;
      el.classList.remove("is-correct", "is-wrong");
      if (got && norm(got) === norm(ans)) {
        correct++;
        el.classList.add("is-correct");
      } else {
        el.classList.add("is-wrong");
      }
    }

    setActivityPoints("fill_dialogue", correct, max);
    setPill("pill_fill_dialogue", correct, max, correct === max ? "ok" : "");
    setFeedback("fb_fill_dialogue",
      "<strong>" + correct + " / " + max + "</strong> correct. " +
      (correct === max ? "✅ Great job!" : "Ask for a hint for one blank.")
    );
  }

  function hintFillDialogue() {
    // reveal one wrong blank (first letter) OR fill one correct blank if empty
    var wrap = $("fillDialogue");
    if (!wrap) return;

    for (var i = 0; i < FILL_DIALOGUE.answers.length; i++) {
      var ans = FILL_DIALOGUE.answers[i];
      var got = fillDialogueState.blanks[i];
      if (!got) {
        setBlank(i, ans[0] + "…");
        setFeedback("fb_fill_dialogue", "Hint: Blank " + (i + 1) + " starts with <strong>" + esc(ans[0]) + "</strong>.");
        return;
      }
      if (norm(got) !== norm(ans)) {
        setBlank(i, ans[0] + "…");
        setFeedback("fb_fill_dialogue", "Hint: One wrong blank starts with <strong>" + esc(ans[0]) + "</strong>.");
        return;
      }
    }

    setFeedback("fb_fill_dialogue", "Hint: everything looks complete — click <strong>Check</strong>.");
  }

  function resetFillDialogue() {
    if (!confirmReset("Reset fill-in dialogue?")) return;
    renderFillDialogue();
    setActivityPoints("fill_dialogue", 0, FILL_DIALOGUE.answers.length);
  }

  function listenFillDialogue(correctVersion) {
    var lines = [];
    for (var i = 0; i < FILL_DIALOGUE.text.length; i++) lines.push(FILL_DIALOGUE.text[i]);
    // rebuild with either chosen or correct answers
    var out = [];
    var bi = 0;
    for (var l = 0; l < FILL_DIALOGUE.text.length; l++) {
      var parts = FILL_DIALOGUE.text[l].split("___");
      if (parts.length === 2) {
        var w = correctVersion ? FILL_DIALOGUE.answers[bi] : (fillDialogueState.blanks[bi] || "blank");
        out.push(parts[0] + w + parts[1]);
        bi++;
      } else out.push(FILL_DIALOGUE.text[l]);
    }
    speak(out.join(" "));
  }

  /* ---------------------------
     Activity 6: Size MCQ (UK/US differences + policies)
  ----------------------------*/
  var sizeMcqState = { answers: {} };

  var SIZE_MCQ = [
    {
      stem: "In the UK, “trainers” are usually called… in the US.",
      opts: [
        { t: "sneakers", ok: true, why: "UK trainers = US sneakers." },
        { t: "slippers", ok: false, why: "Slippers are indoor shoes." },
        { t: "boots", ok: false, why: "Boots are different." }
      ]
    },
    {
      stem: "A polite way to ask about returns is…",
      opts: [
        { t: "What’s your return policy?", ok: true, why: "Clear + polite." },
        { t: "I return this.", ok: false, why: "Not a question; sounds incorrect." },
        { t: "You must refund me.", ok: false, why: "Too aggressive." }
      ]
    },
    {
      stem: "You want one size bigger. You can say…",
      opts: [
        { t: "Do you have one size up?", ok: true, why: "Common phrase." },
        { t: "Do you have one size high?", ok: false, why: "Not used." },
        { t: "Do you have one size more?", ok: false, why: "Not natural." }
      ]
    },
    {
      stem: "The item is uncomfortable. You can say…",
      opts: [
        { t: "They don’t fit well.", ok: true, why: "Fit = size/comfort." },
        { t: "They don’t sit well.", ok: false, why: "Sit is not used for shoes." },
        { t: "They don’t live well.", ok: false, why: "Wrong verb." }
      ]
    }
  ];

  function renderSizeMcq() {
    renderMcq("sizeMcq", SIZE_MCQ, sizeMcqState, "size_quiz", "pill_size_quiz");
  }
  function resetSizeMcq() {
    if (!confirmReset("Reset size quiz?")) return;
    sizeMcqState.answers = {};
    renderSizeMcq();
  }

  /* ---------------------------
     Activity 7: Décor polite sentence builder (order)
  ----------------------------*/
  var decorOrderState = { chosen: [] };

  var DECOR_SENTENCE = {
    chunks: ["Would", "you", "mind", "telling", "me", "the", "dimensions", "and", "the", "delivery", "options", "?" ],
    answer: "Would you mind telling me the dimensions and the delivery options?"
  };

  function checkDecorOrder() {
    var max = 1;
    var got = builtSentence(decorOrderState);
    var ok = norm(got) === norm(DECOR_SENTENCE.answer);

    setActivityPoints("order_polite", ok ? 1 : 0, max);
    setPill("pill_order_polite", ok ? 1 : 0, max, ok ? "ok" : "bad");
    setFeedback("fb_order_polite",
      ok ? "✅ Perfect! Very polite décor-store question." : "Not quite. Hint: start with <strong>Would you mind…</strong>"
    );
  }

  function hintDecorOrder() {
    var correctChunks = DECOR_SENTENCE.answer.replace(/\?/g, " ?").split(" ");
    var idx = decorOrderState.chosen.length;
    if (idx >= correctChunks.length) { setFeedback("fb_order_polite", "Hint: sentence is complete — now check it."); return; }
    var next = correctChunks[idx];
    decorOrderState.chosen.push(next);

    var wrap = $("decorOrder");
    if (wrap) {
      var bank = wrap.querySelector(".order__bank");
      if (bank) {
        var tiles = bank.querySelectorAll(".tile");
        for (var i = 0; i < tiles.length; i++) {
          if (tiles[i].textContent === next) { bank.removeChild(tiles[i]); break; }
        }
      }
      var answer = wrap.querySelector(".order__answer");
      if (answer) {
        answer.innerHTML = "";
        for (var j = 0; j < decorOrderState.chosen.length; j++) {
          (function (chunk) {
            var t = document.createElement("div");
            t.className = "tile";
            t.textContent = chunk;
            answer.appendChild(t);
          })(decorOrderState.chosen[j]);
        }
      }
    }
    setFeedback("fb_order_polite", "Hint: I added <strong>" + esc(next) + "</strong>.");
  }

  function resetDecorOrder() {
    if (!confirmReset("Reset décor sentence builder?")) return;
    decorOrderState.chosen = [];
    renderSentenceOrder("decorOrder", decorOrderState, DECOR_SENTENCE, "order_polite", "pill_order_polite", "fb_order_polite");
    setActivityPoints("order_polite", 0, 1);
  }

  /* ---------------------------
     Dialogues (choose your reply)
  ----------------------------*/
  var dialogueMode = "polite"; // polite | casual
  var dialogueState = {
    scene: "shoe_size",
    step: 0,
    pts: 0
  };

  // Each step: line (clerk) + choices (customer) + next line after choice
  // choices include bestFor: "polite" or "casual" (or both), points
  var SCENES = {
    shoe_size: {
      title: "Shoe store: size + try on",
      steps: [
        { line: "Clerk: Hi! How can I help you today?" ,
          choices: [
            { t: "Could I try these on, please?", tag: "polite", pts: 2, next: "Clerk: Of course. What size do you need?" },
            { t: "Can I try these on?", tag: "both", pts: 1, next: "Clerk: Sure! What size are you?" },
            { t: "I want to try these on.", tag: "casual", pts: 0, next: "Clerk: Okay… What size?" }
          ]
        },
        { line: "Clerk: We have size 39 and 40. Which one would you like?" ,
          choices: [
            { t: "Could I try both sizes, please?", tag: "polite", pts: 2, next: "Clerk: Absolutely. Here you go." },
            { t: "I’ll try 39 first.", tag: "both", pts: 1, next: "Clerk: Great — the fitting room is right there." },
            { t: "Give me 39.", tag: "casual", pts: 0, next: "Clerk: …Sure." }
          ]
        },
        { line: "Clerk: How do they feel?" ,
          choices: [
            { t: "They don’t fit well. Do you have one size up?", tag: "both", pts: 2, next: "Clerk: Yes — I’ll get size 40." },
            { t: "Too small.", tag: "casual", pts: 1, next: "Clerk: Okay, I’ll bring a bigger size." },
            { t: "This is bad.", tag: "casual", pts: 0, next: "Clerk: Sorry to hear that. Let’s try another size." }
          ]
        }
      ]
    },
    clothing_fit: {
      title: "Clothing store: fit + color",
      steps: [
        { line: "Clerk: Hello! Looking for anything special?" ,
          choices: [
            { t: "Yes, I’d like a coat in black, please.", tag: "polite", pts: 2, next: "Clerk: Great choice. What size?" },
            { t: "A black coat.", tag: "casual", pts: 1, next: "Clerk: Sure. What size do you wear?" },
            { t: "Show me black coats.", tag: "casual", pts: 0, next: "Clerk: We have a few styles — follow me." }
          ]
        },
        { line: "Clerk: The fitting room is available. Anything else?" ,
          choices: [
            { t: "Would you mind checking if you have it in medium?", tag: "polite", pts: 2, next: "Clerk: Not at all — I’ll check." },
            { t: "Do you have medium?", tag: "both", pts: 1, next: "Clerk: Let me check in the back." },
            { t: "Find me medium.", tag: "casual", pts: 0, next: "Clerk: I’ll see what I can do." }
          ]
        }
      ]
    },
    decor_delivery: {
      title: "Décor store: dimensions + delivery",
      steps: [
        { line: "Clerk: Hi! Can I help you with anything?" ,
          choices: [
            { t: "Yes, would you mind telling me the dimensions of this mirror?", tag: "polite", pts: 2, next: "Clerk: Of course — it’s 80 by 60 centimeters." },
            { t: "What are the dimensions?", tag: "both", pts: 1, next: "Clerk: It’s 80 by 60 centimeters." },
            { t: "How big is it?", tag: "casual", pts: 0, next: "Clerk: It’s 80 by 60." }
          ]
        },
        { line: "Clerk: Would you like delivery?" ,
          choices: [
            { t: "Yes please. What are the delivery options?", tag: "both", pts: 2, next: "Clerk: Standard is 3–5 days. Express is 24–48 hours." },
            { t: "Delivery. How much?", tag: "casual", pts: 1, next: "Clerk: It depends on your address." },
            { t: "Bring it tomorrow.", tag: "casual", pts: 0, next: "Clerk: We can check the available dates." }
          ]
        }
      ]
    },
    return_policy: {
      title: "Returns: exchange vs refund",
      steps: [
        { line: "Clerk: Would you like a receipt?" ,
          choices: [
            { t: "Yes, please. Could I have the receipt?", tag: "polite", pts: 2, next: "Clerk: Of course." },
            { t: "Yes, receipt please.", tag: "both", pts: 1, next: "Clerk: Sure." },
            { t: "Receipt.", tag: "casual", pts: 0, next: "Clerk: Here you go." }
          ]
        },
        { line: "Clerk: Anything else I can help you with?" ,
          choices: [
            { t: "What’s your return policy if it doesn’t fit?", tag: "both", pts: 2, next: "Clerk: Returns within 30 days with receipt, unused items." },
            { t: "Can I exchange it?", tag: "both", pts: 1, next: "Clerk: Yes, within 30 days." },
            { t: "You refund me if I hate it.", tag: "casual", pts: 0, next: "Clerk: Let me explain our policy…" }
          ]
        }
      ]
    }
  };

  function dialogueMaxForScene(sceneKey) {
    var scene = SCENES[sceneKey];
    if (!scene) return 0;
    var max = 0;
    for (var i = 0; i < scene.steps.length; i++) max += 2;
    return max;
  }

  function renderDialogue() {
    if (!has($("dlgLine")) || !has($("dlgChoices"))) return;

    var sceneKey = has($("sceneSelect")) ? $("sceneSelect").value : dialogueState.scene;
    dialogueState.scene = sceneKey;

    var scene = SCENES[sceneKey];
    if (!scene) return;

    var step = dialogueState.step;
    if (step < 0) step = 0;
    if (step >= scene.steps.length) step = scene.steps.length;
    dialogueState.step = step;

    // show current clerk line or end message
    if (step >= scene.steps.length) {
      $("dlgLine").innerHTML = "<strong>Scene complete!</strong> ✅";
      $("dlgChoices").innerHTML = "<div class='choice'>Great work. Restart to try again with the other register (polite/casual).</div>";
      setPill("pill_dialogues", dialogueState.pts, dialogueMaxForScene(sceneKey), dialogueState.pts >= dialogueMaxForScene(sceneKey) ? "ok" : "");
      setActivityPoints("dialogues", dialogueState.pts, dialogueMaxForScene(sceneKey));
      return;
    }

    var st = scene.steps[step];
    $("dlgLine").textContent = st.line;

    var choicesHtml = "";
    for (var i = 0; i < st.choices.length; i++) {
      var c = st.choices[i];
      var suitability =
        (c.tag === "both") ? "Works in both styles." :
          (c.tag === "polite") ? "Best in polite mode." :
            "More casual.";

      choicesHtml +=
        "<div class='choice' data-i='" + i + "' tabindex='0' role='button'>" +
        esc(c.t) +
        "<small>" + esc(suitability) + "</small>" +
        "</div>";
    }
    $("dlgChoices").innerHTML = choicesHtml;

    // wire choices
    var nodes = $("dlgChoices").querySelectorAll(".choice");
    for (var j = 0; j < nodes.length; j++) {
      (function (idx) {
        function choose() {
          var ch = st.choices[idx];
          var pts = ch.pts;

          // if mode mismatched, reduce points slightly (but still allow)
          if (dialogueMode === "polite" && ch.tag === "casual") pts = Math.max(0, pts - 1);
          if (dialogueMode === "casual" && ch.tag === "polite") pts = Math.max(0, pts - 1);

          dialogueState.pts += pts;
          dialogueState.step++;

          // Show next clerk line immediately as feedback
          $("dlgLine").textContent = ch.next || "Okay.";
          speak(ch.t);

          setPill("pill_dialogues", dialogueState.pts, dialogueMaxForScene(sceneKey), "");
          setActivityPoints("dialogues", dialogueState.pts, dialogueMaxForScene(sceneKey));

          // Then after a short delay, render the next step
          window.setTimeout(function () { renderDialogue(); }, 450);
        }

        nodes[idx].addEventListener("click", choose);
        nodes[idx].addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(); }
        });
      })(j);
    }
  }

  function resetDialogueScene() {
    dialogueState.step = 0;
    dialogueState.pts = 0;
    renderDialogue();
  }

  function setDialogueMode(mode) {
    dialogueMode = mode;
    var p = $("modePolite"), c = $("modeCasual");
    if (p && c) {
      p.classList.toggle("is-on", mode === "polite");
      c.classList.toggle("is-on", mode === "casual");
      p.setAttribute("aria-pressed", mode === "polite" ? "true" : "false");
      c.setAttribute("aria-pressed", mode === "casual" ? "true" : "false");
    }
  }

  /* Speaking prompts bonus */
  var SPEAKING_PROMPTS = [
    "Ask politely if you can try the shoes on.",
    "Ask for one size up.",
    "Ask if the item comes in another color.",
    "Ask about the return policy.",
    "Ask for the dimensions of a lamp.",
    "Ask about delivery options."
  ];

  function giveSpeakingPrompt() {
    var p = SPEAKING_PROMPTS[Math.floor(Math.random() * SPEAKING_PROMPTS.length)];
    setFeedback("fb_spoke", "🗣 Say this out loud: <strong>" + esc(p) + "</strong>");
    speak(p);
  }

  function claimSpokeBonus() {
    if (state.spokeBonus >= SPOKE_MAX) {
      setFeedback("fb_spoke", "✅ Speaking bonus complete (" + SPOKE_MAX + "/" + SPOKE_MAX + ").");
      return;
    }
    state.spokeBonus += 1;
    saveState();
    recalcScore();
    setFeedback("fb_spoke", "✅ Nice! Speaking bonus: <strong>" + state.spokeBonus + " / " + SPOKE_MAX + "</strong>.");
  }

  /* ---------------------------
     Reading: MCQ + True/False
  ----------------------------*/
  var readingMcqState = { answers: {} };
  var READING_MCQ = [
    {
      stem: "How much is the discount on boots and coats?",
      opts: [
        { t: "30% off", ok: true, why: "The poster says 30% off boots and coats." },
        { t: "10% off", ok: false, why: "Not in the poster." },
        { t: "50% off", ok: false, why: "Not in the poster." }
      ]
    },
    {
      stem: "When do returns need to be made?",
      opts: [
        { t: "Within 30 days with a receipt", ok: true, why: "That’s the policy on the poster." },
        { t: "Within 7 days without a receipt", ok: false, why: "Not stated." },
        { t: "Anytime", ok: false, why: "Not stated." }
      ]
    },
    {
      stem: "When is the store open on Sunday?",
      opts: [
        { t: "11:00–18:00", ok: true, why: "Sunday hours are 11:00–18:00." },
        { t: "10:00–19:00", ok: false, why: "Those are Saturday hours." },
        { t: "Closed", ok: false, why: "It is open Sunday." }
      ]
    }
  ];

  var tfState = {
    choices: {} // idx -> true/false
  };

  var TRUE_FALSE = [
    { s: "Socks have a “buy 2 get 1 free” offer.", ok: true },
    { s: "Home décor delivery is free for orders over €80.", ok: true },
    { s: "Returns are accepted even if the item was used.", ok: false },
    { s: "The store opens at 9:00 on Saturday.", ok: false },
    { s: "You need a receipt for returns.", ok: true }
  ];

  function renderTrueFalse() {
    var wrap = $("trueFalse");
    if (!wrap) return;

    var max = TRUE_FALSE.length;
    if (!state.earnedByActivity.true_false) setActivityPoints("true_false", 0, max);

    tfState.choices = {};
    var html = "<div class='mcq'>";
    for (var i = 0; i < TRUE_FALSE.length; i++) {
      html += "<div class='q' data-q='" + i + "'>";
      html += "<div class='q__stem'>" + esc((i + 1) + ". " + TRUE_FALSE[i].s) + "</div>";
      html += "<div class='opts'>";
      html += "<label class='opt' data-v='true'><input type='radio' name='tf_" + i + "'/> True</label>";
      html += "<label class='opt' data-v='false'><input type='radio' name='tf_" + i + "'/> False</label>";
      html += "</div>";
      html += "</div>";
    }
    html += "</div>";
    wrap.innerHTML = html;

    // wire
    var qs = wrap.querySelectorAll(".q");
    for (var q = 0; q < qs.length; q++) {
      (function (idx) {
        var opts = qs[idx].querySelectorAll(".opt");
        for (var k = 0; k < opts.length; k++) {
          opts[k].addEventListener("click", function () {
            var v = this.getAttribute("data-v") === "true";
            tfState.choices[idx] = v;
            // instant styling (neutral until check)
            for (var m = 0; m < opts.length; m++) opts[m].classList.remove("is-correct", "is-wrong");
          });
        }
      })(q);
    }

    setFeedback("fb_true_false", "Choose True/False, then click <strong>Check</strong>.");
    setPill("pill_true_false", 0, max, "");
  }

  function checkTrueFalse() {
    var wrap = $("trueFalse");
    if (!wrap) return;

    var max = TRUE_FALSE.length;
    var correct = 0;

    var qs = wrap.querySelectorAll(".q");
    for (var i = 0; i < qs.length; i++) {
      var user = tfState.choices[i];
      var expected = TRUE_FALSE[i].ok;

      var opts = qs[i].querySelectorAll(".opt");
      for (var k = 0; k < opts.length; k++) {
        opts[k].classList.remove("is-correct", "is-wrong");
        var v = opts[k].getAttribute("data-v") === "true";
        if (typeof user === "boolean" && v === user) {
          opts[k].classList.add(v === expected ? "is-correct" : "is-wrong");
        }
      }
      if (typeof user === "boolean" && user === expected) correct++;
    }

    setActivityPoints("true_false", correct, max);
    setPill("pill_true_false", correct, max, correct === max ? "ok" : "");
    setFeedback("fb_true_false",
      "<strong>" + correct + " / " + max + "</strong> correct. " + (correct === max ? "✅ Great reading!" : "Re-read the poster and try again.")
    );
  }

  function resetTrueFalse() {
    if (!confirmReset("Reset True/False?")) return;
    renderTrueFalse();
    setActivityPoints("true_false", 0, TRUE_FALSE.length);
  }

  function renderReadingMcq() {
    renderMcq("readingMcq", READING_MCQ, readingMcqState, "reading_mcq", "pill_reading_mcq");
  }
  function resetReadingMcq() {
    if (!confirmReset("Reset reading MCQ?")) return;
    readingMcqState.answers = {};
    renderReadingMcq();
  }

  function hintReading() {
    setFeedback("fb_reading_hint", "Hint: Focus on numbers (30%, 30 days, €80) and opening hours (Sat vs Sun).");
  }

  /* ---------------------------
     Section listen buttons
  ----------------------------*/
  function listenMission() {
    speak("Today’s mission: ask about sizes, fit, materials, price, and delivery. Use polite requests like Could I and Would you mind. Compare options. Understand UK and US vocabulary differences.");
  }
  function listenVocab() {
    speak("Vocabulary practice: shoes, clothing, and home decor. Click flashcards to flip and listen.");
  }
  function listenGrammar() {
    speak("Grammar focus: polite requests with could, would, and may. Asking for details: materials, dimensions, and return policy.");
  }
  function listenStores() {
    speak("Store skills: classify items by store, fill in a shoe store dialogue, and build polite sentences for a decoration store.");
  }
  function listenDialogues() {
    speak("Interactive dialogues: choose your replies. Switch between polite and casual. Speak out loud after each customer line.");
  }
  function listenReading() {
    var txt = $("readingText") ? $("readingText").innerText : "";
    speak(txt || "Reading: store poster with discounts, delivery, returns, and opening hours.");
  }
  function listenWrap() {
    speak("Wrap-up: ask three polite questions in each store—shoe store, clothing store, and decoration store. Great work!");
  }

  /* ---------------------------
     Modal help
  ----------------------------*/
  function openHelp() {
    var d = $("helpModal");
    if (!d) return;
    if (d.showModal) d.showModal();
    else d.setAttribute("open", "open");
  }
  function closeHelp() {
    var d = $("helpModal");
    if (!d) return;
    if (d.close) d.close();
    else d.removeAttribute("open");
  }

  /* ---------------------------
     Wire buttons + init
  ----------------------------*/
  function wireButtons() {
    // ensure "top" anchor exists
    try { document.body.id = "top"; } catch (e) { /* ignore */ }

    if (has($("accentUS"))) $("accentUS").addEventListener("click", function () { setAccent("US"); });
    if (has($("accentUK"))) $("accentUK").addEventListener("click", function () { setAccent("UK"); });
    if (has($("btnPause"))) $("btnPause").addEventListener("click", pauseSpeech);
    if (has($("btnStop"))) $("btnStop").addEventListener("click", stopSpeech);

    if (has($("resetAll"))) $("resetAll").addEventListener("click", resetWholeLesson);
    if (has($("resetAllBottom"))) $("resetAllBottom").addEventListener("click", resetWholeLesson);

    if (has($("btnIntroListen"))) $("btnIntroListen").addEventListener("click", listenMission);

    if (has($("btnShowKeyboardHelp"))) $("btnShowKeyboardHelp").addEventListener("click", openHelp);
    if (has($("closeHelp"))) $("closeHelp").addEventListener("click", closeHelp);

    // Vocab controls
    if (has($("vocabTheme"))) $("vocabTheme").addEventListener("change", renderFlashcards);
    if (has($("vocabMode"))) $("vocabMode").addEventListener("change", renderFlashcards);
    if (has($("vocabExamples"))) $("vocabExamples").addEventListener("change", renderFlashcards);
    if (has($("vocabListen"))) $("vocabListen").addEventListener("click", listenVocab);
    if (has($("vocabReset"))) $("vocabReset").addEventListener("click", function () {
      if (!confirmReset("Reset vocabulary view?")) return;
      renderFlashcards();
    });

    // Grammar section
    if (has($("grammarListen"))) $("grammarListen").addEventListener("click", listenGrammar);
    if (has($("grammarReset"))) $("grammarReset").addEventListener("click", function () {
      if (!confirmReset("Reset grammar section activities?")) return;
      resetPoliteMcq();
      resetVerbMatch();
      resetCompareOrder();
    });

    // Polite MCQ
    if (has($("reset_polite_mcq"))) $("reset_polite_mcq").addEventListener("click", resetPoliteMcq);

    // Verb match
    if (has($("check_verbs_match"))) $("check_verbs_match").addEventListener("click", checkVerbMatch);
    if (has($("hint_verbs_match"))) $("hint_verbs_match").addEventListener("click", hintVerbMatch);
    if (has($("reset_verbs_match"))) $("reset_verbs_match").addEventListener("click", resetVerbMatch);

    // Compare order
    if (has($("check_compare_order"))) $("check_compare_order").addEventListener("click", checkCompareOrder);
    if (has($("hint_compare_order"))) $("hint_compare_order").addEventListener("click", function () {
      setFeedback("fb_compare_order", "Hint: The correct sentence is: <strong>" + esc(COMPARE_SENTENCE.answer) + "</strong>");
    });
    if (has($("listen_compare_order"))) $("listen_compare_order").addEventListener("click", function () { speak(COMPARE_SENTENCE.answer); });
    if (has($("reset_compare_order"))) $("reset_compare_order").addEventListener("click", resetCompareOrder);

    // Stores section
    if (has($("storesListen"))) $("storesListen").addEventListener("click", listenStores);
    if (has($("storesReset"))) $("storesReset").addEventListener("click", function () {
      if (!confirmReset("Reset store skills activities?")) return;
      resetClassifyStores();
      resetFillDialogue();
      resetSizeMcq();
      resetDecorOrder();
    });

    // Classify items
    if (has($("check_classify_items"))) $("check_classify_items").addEventListener("click", checkClassifyStores);
    if (has($("hint_classify_items"))) $("hint_classify_items").addEventListener("click", hintClassifyStores);
    if (has($("reset_classify_items"))) $("reset_classify_items").addEventListener("click", resetClassifyStores);

    // Fill dialogue
    if (has($("check_fill_dialogue"))) $("check_fill_dialogue").addEventListener("click", checkFillDialogue);
    if (has($("hint_fill_dialogue"))) $("hint_fill_dialogue").addEventListener("click", hintFillDialogue);
    if (has($("listen_fill_dialogue"))) $("listen_fill_dialogue").addEventListener("click", function () { listenFillDialogue(true); });
    if (has($("reset_fill_dialogue"))) $("reset_fill_dialogue").addEventListener("click", resetFillDialogue);

    // Size quiz
    if (has($("reset_size_quiz"))) $("reset_size_quiz").addEventListener("click", resetSizeMcq);

    // Décor order
    if (has($("check_order_polite"))) $("check_order_polite").addEventListener("click", checkDecorOrder);
    if (has($("hint_order_polite"))) $("hint_order_polite").addEventListener("click", hintDecorOrder);
    if (has($("listen_order_polite"))) $("listen_order_polite").addEventListener("click", function () { speak(DECOR_SENTENCE.answer); });
    if (has($("reset_order_polite"))) $("reset_order_polite").addEventListener("click", resetDecorOrder);

    // Dialogues
    if (has($("dialoguesListen"))) $("dialoguesListen").addEventListener("click", listenDialogues);
    if (has($("dialoguesReset"))) $("dialoguesReset").addEventListener("click", resetDialogueScene);

    if (has($("modePolite"))) $("modePolite").addEventListener("click", function () { setDialogueMode("polite"); });
    if (has($("modeCasual"))) $("modeCasual").addEventListener("click", function () { setDialogueMode("casual"); });

    if (has($("sceneSelect"))) $("sceneSelect").addEventListener("change", function () {
      dialogueState.scene = $("sceneSelect").value;
      dialogueState.step = 0;
      dialogueState.pts = 0;
      renderDialogue();
    });
    if (has($("sceneRestart"))) $("sceneRestart").addEventListener("click", resetDialogueScene);
    if (has($("dlgListen"))) $("dlgListen").addEventListener("click", function () {
      var t = $("dlgLine") ? $("dlgLine").innerText : "";
      speak(t);
    });

    if (has($("speakPrompt"))) $("speakPrompt").addEventListener("click", giveSpeakingPrompt);
    if (has($("selfCheckSpoke"))) $("selfCheckSpoke").addEventListener("click", claimSpokeBonus);

    // Reading
    if (has($("readingListen"))) $("readingListen").addEventListener("click", listenReading);
    if (has($("listenReadingText"))) $("listenReadingText").addEventListener("click", listenReading);
    if (has($("hintReading"))) $("hintReading").addEventListener("click", hintReading);

    if (has($("reset_reading_mcq"))) $("reset_reading_mcq").addEventListener("click", resetReadingMcq);
    if (has($("readingReset"))) $("readingReset").addEventListener("click", function () {
      if (!confirmReset("Reset reading activities?")) return;
      resetReadingMcq();
      resetTrueFalse();
      setFeedback("fb_reading_hint", "");
    });

    if (has($("check_true_false"))) $("check_true_false").addEventListener("click", checkTrueFalse);
    if (has($("listen_true_false"))) $("listen_true_false").addEventListener("click", function () {
      speak("True or false. " + TRUE_FALSE.map(function (x, i) { return (i + 1) + ". " + x.s; }).join(" "));
    });
    if (has($("reset_true_false"))) $("reset_true_false").addEventListener("click", resetTrueFalse);

    // Wrap
    if (has($("wrapListen"))) $("wrapListen").addEventListener("click", listenWrap);
    if (has($("finalSpeakingPrompt"))) $("finalSpeakingPrompt").addEventListener("click", function () {
      var qs = [
        "Shoe store: Could I try these on, please?",
        "Shoe store: Do you have one size up?",
        "Shoe store: What’s your return policy?",
        "Clothing store: Would you mind checking if you have it in medium?",
        "Clothing store: Does it come in another color?",
        "Clothing store: Where are the fitting rooms?",
        "Décor store: What are the dimensions of this item?",
        "Décor store: Do you offer delivery?",
        "Décor store: Is assembly included?"
      ];
      setFeedback("fb_final_prompt", "🗣 Say these out loud:<br/>• " + qs.map(esc).join("<br/>• "));
      speak(qs.join(" "));
    });
  }

  /* ---------------------------
     Init all modules
  ----------------------------*/
  function initAll(fromReset) {
    // apply saved UI selections
    if (has($("vocabTheme"))) $("vocabTheme").value = state.vocabTheme || "shoe";
    if (has($("vocabMode"))) $("vocabMode").value = state.vocabMode || "term";
    if (has($("vocabExamples"))) $("vocabExamples").checked = (typeof state.vocabExamples === "boolean") ? state.vocabExamples : true;

    // voices
    if (window.speechSynthesis) {
      try { window.speechSynthesis.onvoiceschanged = refreshVoices; } catch (e) { /* ignore */ }
      refreshVoices();
    }
    setAccent(state.accent || "US");

    // Render everything
    renderFlashcards();

    renderPoliteMcq();
    renderVerbMatch();
    renderSentenceOrder("compareOrder", compareOrderState, COMPARE_SENTENCE, "compare_order", "pill_compare_order", "fb_compare_order");

    renderClassifyStores();
    renderFillDialogue();
    renderSizeMcq();
    renderSentenceOrder("decorOrder", decorOrderState, DECOR_SENTENCE, "order_polite", "pill_order_polite", "fb_order_polite");

    setDialogueMode(dialogueMode);
    if (has($("sceneSelect"))) $("sceneSelect").value = dialogueState.scene || "shoe_size";
    dialogueState.step = 0;
    dialogueState.pts = 0;
    renderDialogue();

    renderReadingMcq();
    renderTrueFalse();

    // Score
    if (fromReset) {
      // clear activity points (they’ll be set by renderers)
      recalcScore();
    } else {
      updateScoreUI();
      recalcScore();
    }
  }

  /* ---------------------------
     Boot
  ----------------------------*/
  loadState();
  wireButtons();
  initAll(false);

})();
