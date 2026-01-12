/* Hotel Nikko SF — Interactive lesson
   Touch-friendly quizzes + TTS (US/UK).
   Vanilla JS. */

(function () {
  "use strict";
  document.documentElement.classList.add("js-ready");

  // ---------------------------
  // Helpers
  // ---------------------------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function norm(s) {
    return String(s || "").trim().toLowerCase();
  }

  // ---------------------------
  // Text-to-Speech (speechSynthesis)
  // ---------------------------
  var ttsState = {
    accent: "en-US",
    voiceURI: "",
    rate: 1.0,
    voices: []
  };

  function loadVoices() {
    var voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    ttsState.voices = voices || [];
    renderVoiceSelect();
  }

  function renderVoiceSelect() {
    var voiceSelect = $("#voiceSelect");
    if (!voiceSelect) return;

    var accent = $("#accentSelect") ? $("#accentSelect").value : "en-US";
    ttsState.accent = accent;

    // Clear
    while (voiceSelect.firstChild) voiceSelect.removeChild(voiceSelect.firstChild);

    var preferred = ttsState.voices.filter(function (v) {
      return (v.lang || "").toLowerCase().indexOf(accent.toLowerCase()) === 0;
    });

    var pool = preferred.length ? preferred : ttsState.voices.filter(function (v) {
      return (v.lang || "").toLowerCase().indexOf("en") === 0;
    });

    if (!pool.length) {
      var opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Default system voice";
      voiceSelect.appendChild(opt);
      ttsState.voiceURI = "";
      return;
    }

    pool.forEach(function (v) {
      var opt2 = document.createElement("option");
      opt2.value = v.voiceURI;
      opt2.textContent = v.name + " (" + v.lang + ")";
      voiceSelect.appendChild(opt2);
    });

    // Choose first
    ttsState.voiceURI = pool[0].voiceURI;
    voiceSelect.value = ttsState.voiceURI;
  }

  function pickVoice() {
    var voiceSelect = $("#voiceSelect");
    var voiceURI = voiceSelect ? voiceSelect.value : "";
    var accent = $("#accentSelect") ? $("#accentSelect").value : "en-US";
    ttsState.accent = accent;
    ttsState.voiceURI = voiceURI || "";

    var voices = ttsState.voices || [];
    var chosen = null;

    if (ttsState.voiceURI) {
      chosen = voices.find(function (v) { return v.voiceURI === ttsState.voiceURI; }) || null;
    }
    if (!chosen) {
      chosen = voices.find(function (v) { return (v.lang || "").toLowerCase().indexOf(accent.toLowerCase()) === 0; }) || null;
    }
    return chosen;
  }

  function speak(text) {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }
    var t = String(text || "").trim();
    if (!t) return;

    window.speechSynthesis.cancel();

    var u = new SpeechSynthesisUtterance(t);
    var voice = pickVoice();
    if (voice) u.voice = voice;
    u.lang = ttsState.accent || (voice ? voice.lang : "en-US");

    var rateEl = $("#rateRange");
    var rate = rateEl ? parseFloat(rateEl.value) : 1.0;
    u.rate = isFinite(rate) ? rate : 1.0;

    window.speechSynthesis.speak(u);
  }

  function wireTTS() {
    var accentSelect = $("#accentSelect");
    var voiceSelect = $("#voiceSelect");
    var rateRange = $("#rateRange");
    var testBtn = $("#testVoiceBtn");

    if (accentSelect) accentSelect.addEventListener("change", renderVoiceSelect);
    if (voiceSelect) voiceSelect.addEventListener("change", function () { ttsState.voiceURI = voiceSelect.value; });
    if (rateRange) rateRange.addEventListener("input", function () { ttsState.rate = parseFloat(rateRange.value) || 1.0; });

    if (testBtn) testBtn.addEventListener("click", function () {
      speak("Welcome to Hotel Nikko San Francisco. How may I help you today?");
    });

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-say]");
      if (!btn) return;
      e.preventDefault();
      speak(btn.getAttribute("data-say"));
    });
  }

  
  function showErrorBanner(msg) {
    var box = document.getElementById("jsError");
    if (!box) return;
    box.hidden = false;
    box.textContent = msg;
  }

// ---------------------------
  // Data (based on your Hotel Nikko PPT)
  // ---------------------------
  var VOCAB = [
    // People & services
    {cat:"People & services", icon:"🛎️", term:"front desk / reception", def:"the place where you check in and get help", ex:"The front desk is open 24/7."},
    {cat:"People & services", icon:"👩‍💼", term:"receptionist", def:"person at the front desk", ex:"The receptionist asks for your passport."},
    {cat:"People & services", icon:"🧳", term:"guest", def:"a person staying at the hotel", ex:"Guests can use the pool."},
    {cat:"People & services", icon:"🪪", term:"passport / ID", def:"identity document", ex:"May I see your passport, please?"},
    {cat:"People & services", icon:"🗝️", term:"key card", def:"card used to open the room door", ex:"My key card doesn’t work."},
    {cat:"People & services", icon:"🛗", term:"elevator (US) / lift (UK)", def:"moving cabin to go up and down", ex:"Take the elevator to the third floor."},

    // Reservation / arrival
    {cat:"Reservation", icon:"☎️", term:"to book / to reserve", def:"to arrange a room before arriving", ex:"I’d like to book a double room, please."},
    {cat:"Reservation", icon:"🗓️", term:"from…to…", def:"dates or times range", ex:"From May 12th to May 14th."},
    {cat:"Reservation", icon:"🌙", term:"for two nights", def:"duration of stay", ex:"We’re staying for two nights."},
    {cat:"Reservation", icon:"🕑", term:"check‑in", def:"time you can enter the room", ex:"Check‑in starts at 2 p.m."},
    {cat:"Reservation", icon:"🕙", term:"check‑out", def:"time you must leave the room", ex:"Check‑out is by 11 a.m."},
    {cat:"Reservation", icon:"☕", term:"breakfast included", def:"breakfast is part of the price", ex:"Is breakfast included?"},
    {cat:"Reservation", icon:"💳", term:"credit card / deposit", def:"card/payment guarantee", ex:"May I have your credit card, please?"},

    // Room types
    {cat:"Rooms", icon:"🛏️", term:"Deluxe room", def:"classic room with city view", ex:"The Deluxe room has a choice of beds."},
    {cat:"Rooms", icon:"👑", term:"Imperial room", def:"more luxurious room (Imperial floor)", ex:"Imperial rooms include lounge access."},
    {cat:"Rooms", icon:"🪟", term:"city view", def:"you can see the city from the window", ex:"We’d like a room with a city view."},
    {cat:"Rooms", icon:"🛋️", term:"suite", def:"bigger room with separate spaces", ex:"The suite has a parlor and a bedroom."},

    // Room features
    {cat:"Room features", icon:"📶", term:"Wi‑Fi password", def:"code to connect to the internet", ex:"Can I get the Wi‑Fi password, please?"},
    {cat:"Room features", icon:"❄️", term:"air conditioning", def:"keeps the room cool", ex:"The air conditioning is broken."},
    {cat:"Room features", icon:"🔥", term:"heating", def:"keeps the room warm", ex:"How do I adjust the heat?"},
    {cat:"Room features", icon:"🧴", term:"toiletries", def:"soap, shampoo, etc.", ex:"The bathroom has shampoo and soap."},
    {cat:"Room features", icon:"🧺", term:"extra towels", def:"additional towels", ex:"Could I have extra towels, please?"},
    {cat:"Room features", icon:"🛌", term:"extra pillow / blanket", def:"extra bedding items", ex:"May I have an extra blanket, please?"},
    {cat:"Room features", icon:"⏰", term:"wake‑up call", def:"hotel calls you to wake you", ex:"I’d like a wake‑up call at 7 a.m."},
    {cat:"Room features", icon:"🧊", term:"minibar", def:"small fridge with drinks/snacks", ex:"The minibar is in the room."},

    // Problems
    {cat:"Problems", icon:"🚿", term:"no hot water", def:"the shower water isn’t hot", ex:"There’s no hot water in the shower."},
    {cat:"Problems", icon:"💡", term:"the light doesn’t work", def:"the lamp is broken", ex:"The light doesn’t work in the bathroom."},
    {cat:"Problems", icon:"📺", term:"remote / TV doesn’t work", def:"TV problem", ex:"The remote doesn’t work."},
    {cat:"Problems", icon:"🔇", term:"too noisy", def:"there is a lot of noise", ex:"It’s too noisy at night."},
    {cat:"Problems", icon:"🧻", term:"no toilet paper", def:"the bathroom has no toilet paper", ex:"There isn’t any toilet paper."},
    {cat:"Problems", icon:"🧼", term:"dirty towels", def:"towels are not clean", ex:"The towels are dirty."},

    // Restaurant / room service
    {cat:"Food & restaurant", icon:"🍽️", term:"menu", def:"list of food and drinks", ex:"Could I see the menu, please?"},
    {cat:"Food & restaurant", icon:"🥗", term:"starter / appetizer", def:"first course", ex:"I’ll start with a salad."},
    {cat:"Food & restaurant", icon:"🍜", term:"main course", def:"main dish", ex:"The salmon is a popular main course."},
    {cat:"Food & restaurant", icon:"🍰", term:"dessert", def:"sweet course at the end", ex:"Matcha cheesecake is a dessert."},
    {cat:"Food & restaurant", icon:"🧾", term:"bill (UK) / check (US)", def:"paper with the total price", ex:"Could I have the bill, please?"},
    {cat:"Food & restaurant", icon:"🚪", term:"room service", def:"food delivered to your room", ex:"Could I order room service, please?"},
    {cat:"Food & restaurant", icon:"💧", term:"some water", def:"uncountable noun with 'some'", ex:"A bottle of water, please."},

    // San Francisco
    {cat:"San Francisco", icon:"🌉", term:"Golden Gate Bridge", def:"famous bridge in San Francisco", ex:"I walked across the Golden Gate Bridge."},
    {cat:"San Francisco", icon:"🏝️", term:"Alcatraz Island", def:"former prison on an island", ex:"We visited Alcatraz and listened to the guide."},
    {cat:"San Francisco", icon:"🚋", term:"cable car", def:"historic street car", ex:"I rode the cable cars downtown."},
    {cat:"San Francisco", icon:"🏮", term:"Chinatown", def:"famous neighborhood", ex:"We explored Chinatown on a walking tour."},
    {cat:"San Francisco", icon:"🛍️", term:"Union Square", def:"shopping area near the hotel", ex:"Hotel Nikko is near Union Square."}
  ];

  var GREETING_PHRASES = [
    "Good morning. How can I help you?",
    "Good afternoon. I have a reservation under [NAME].",
    "Good evening. I’d like to book a room, please.",
    "May I see your passport and credit card, please?",
    "Could I have a quiet room with a view, please?",
    "Can I pay by card or cash?",
    "Thank you very much.",
    "You’re welcome."
  ];

  var FOOD_PHRASES = [
    "Could I see the menu, please?",
    "What do you recommend tonight?",
    "Could you give me a minute, please?",
    "I’ll have the grilled salmon, please.",
    "Does it come with rice?",
    "Could I have the bill/check, please?",
    "Hello, could I order room service, please?",
    "What is your room number, please?"
  ];

  // ---------------------------
  // Vocab flashcards
  // ---------------------------
  function renderVocab() {
    var categorySel = $("#vocabCategory");
    var searchEl = $("#vocabSearch");
    var grid = $("#vocabGrid");
    if (!categorySel || !grid) return;

    var cat = categorySel.value;
    var q = norm(searchEl ? searchEl.value : "");

    var items = VOCAB.filter(function (c) {
      var okCat = (cat === "All") || (c.cat === cat);
      if (!okCat) return false;
      if (!q) return true;
      return norm(c.term).indexOf(q) >= 0 || norm(c.def).indexOf(q) >= 0 || norm(c.ex).indexOf(q) >= 0;
    });

    grid.innerHTML = "";
    items.forEach(function (c) {
      var card = document.createElement("div");
      card.className = "vcard";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Flashcard: " + c.term);

      var top = document.createElement("div");
      top.className = "vcard__top";
      top.innerHTML = '<div class="vicon" aria-hidden="true">' + c.icon + '</div>' +
        '<div><div class="vterm">' + escapeHtml(c.term) + '</div><div class="muted tiny">' + escapeHtml(c.cat) + '</div></div>';

      var meta = document.createElement("div");
      meta.className = "vmeta";
      meta.textContent = c.def;

      var actions = document.createElement("div");
      actions.className = "vcard__actions";
      var listenBtn = document.createElement("button");
      listenBtn.type = "button";
      listenBtn.className = "chip";
      listenBtn.textContent = "🔊 Listen";
      listenBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        speak(c.term + ". " + c.ex);
      });

      var exBtn = document.createElement("button");
      exBtn.type = "button";
      exBtn.className = "chip";
      exBtn.textContent = "💬 Example";
      exBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        speak(c.ex);
      });

      actions.appendChild(listenBtn);
      actions.appendChild(exBtn);

      var back = document.createElement("div");
      back.className = "vcard__back";
      back.innerHTML = '<div class="back-title">💬 Example</div><div class="back-ex">' + escapeHtml(c.ex) + '</div>';

      card.appendChild(top);
      card.appendChild(meta);
      card.appendChild(actions);
      card.appendChild(back);

      function toggle() { card.classList.toggle("is-flipped"); }
      card.addEventListener("click", toggle);
      card.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          toggle();
        }
      });

      grid.appendChild(card);
    });
  }

  function initVocabFilters() {
    var categorySel = $("#vocabCategory");
    var searchEl = $("#vocabSearch");
    var resetBtn = $("#vocabResetBtn");
    if (!categorySel) return;

    // Build categories
    var cats = VOCAB.map(function (v) { return v.cat; }).filter(Boolean);
    cats = Array.from(new Set(cats)).sort();

    categorySel.innerHTML = "";
    var optAll = document.createElement("option");
    optAll.value = "All";
    optAll.textContent = "All";
    categorySel.appendChild(optAll);

    cats.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categorySel.appendChild(opt);
    });

    categorySel.addEventListener("change", renderVocab);
    if (searchEl) searchEl.addEventListener("input", renderVocab);
    if (resetBtn) resetBtn.addEventListener("click", function () {
      categorySel.value = "All";
      if (searchEl) searchEl.value = "";
      renderVocab();
    });

    renderVocab();
  }

  // ---------------------------
  // Phrases lists
  // ---------------------------
  function renderPhraseList(elId, items) {
    var ul = $("#" + elId);
    if (!ul) return;
    ul.innerHTML = "";
    items.forEach(function (p) {
      var li = document.createElement("li");
      var wrap = document.createElement("div");
      wrap.className = "phrase";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost";
      btn.textContent = "🔊";
      btn.addEventListener("click", function () { speak(p.replace("[NAME]", "Smith")); });

      var span = document.createElement("span");
      span.textContent = p;

      wrap.appendChild(btn);
      wrap.appendChild(span);
      li.appendChild(wrap);
      ul.appendChild(li);
    });
  }

  // ---------------------------
  // Quiz engines
  // ---------------------------
  function setScore(scoreElId, correct, total) {
    var el = $("#" + scoreElId);
    if (!el) return;
    el.textContent = "Score: " + correct + "/" + total;
  }

  // --- QCM (multiple choice)
  function renderQCM(containerId, scoreId, questions) {
    var box = $("#" + containerId);
    if (!box) return;

    box.innerHTML = "";
    questions.forEach(function (q, idx) {
      var item = document.createElement("div");
      item.className = "q-item";
      item.setAttribute("data-qcm", containerId);
      item.setAttribute("data-index", String(idx));

      var head = document.createElement("div");
      head.className = "q-q";
      head.textContent = (idx + 1) + ". " + q.q;

      var opts = document.createElement("div");
      opts.className = "opts";

      q.options.forEach(function (opt, j) {
        var label = document.createElement("label");
        label.className = "opt";
        var input = document.createElement("input");
        input.type = "radio";
        input.name = containerId + "_q" + idx;
        input.value = String(j);

        var text = document.createElement("div");
        text.textContent = opt;

        label.appendChild(input);
        label.appendChild(text);
        label.addEventListener("click", function () {
          // Visual selection (optional)
        });
        opts.appendChild(label);
      });

      if (q.audio) {
        var audioBtn = document.createElement("button");
        audioBtn.type = "button";
        audioBtn.className = "btn btn-ghost";
        audioBtn.textContent = "🔊 Listen";
        audioBtn.addEventListener("click", function () { speak(q.audio); });
        item.appendChild(audioBtn);
      }

      item.appendChild(head);
      item.appendChild(opts);

      if (q.help) {
        var help = document.createElement("div");
        help.className = "q-help tiny";
        help.textContent = q.help;
        item.appendChild(help);
      }

      box.appendChild(item);
    });

    setScore(scoreId, 0, questions.length);
  }

  function checkQCM(containerId, scoreId, questions) {
    var box = $("#" + containerId);
    if (!box) return;
    var correct = 0;

    questions.forEach(function (q, idx) {
      var chosen = box.querySelector('input[name="' + containerId + "_q" + idx + '"]:checked');
      var labels = $all('input[name="' + containerId + "_q" + idx + '"]', box).map(function (i) { return i.parentElement; });

      labels.forEach(function (lb) { lb.classList.remove("is-correct", "is-wrong"); });

      if (!chosen) return;

      var val = parseInt(chosen.value, 10);
      if (val === q.answer) {
        correct += 1;
        chosen.parentElement.classList.add("is-correct");
      } else {
        chosen.parentElement.classList.add("is-wrong");
        // Mark correct option subtly
        var right = box.querySelector('input[name="' + containerId + "_q" + idx + '"][value="' + q.answer + '"]');
        if (right) right.parentElement.classList.add("is-correct");
      }
    });

    setScore(scoreId, correct, questions.length);
  }

  function resetQCM(containerId, scoreId, questions) {
    renderQCM(containerId, scoreId, questions);
  }

  // --- Fill in blanks
  function renderFill(containerId, scoreId, items) {
    var box = $("#" + containerId);
    if (!box) return;

    box.innerHTML = "";
    items.forEach(function (it, idx) {
      var row = document.createElement("div");
      row.className = "fill-row";
      row.setAttribute("data-index", String(idx));

      // Supports 1+ blanks using "{ }"
      var parts = String(it.s || "").split("{ }");
      var blankCount = Math.max(0, parts.length - 1);

      for (var p = 0; p < parts.length; p++) {
        if (parts[p]) {
          var span = document.createElement("span");
          span.textContent = parts[p];
          row.appendChild(span);
        }

        if (p < blankCount) {
          var input = document.createElement("input");
          input.className = "blank";
          input.type = "text";
          input.autocomplete = "off";
          input.spellcheck = false;
          input.setAttribute("data-bindex", String(p));
          input.setAttribute("aria-label", "Blank " + (idx + 1) + "." + (p + 1));
          row.appendChild(input);
        }
      }

      if (it.audio) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-ghost fill-say";
        btn.textContent = "🔊";
        btn.addEventListener("click", function () { speak(it.audio); });
        row.appendChild(btn);
      }

      box.appendChild(row);
    });

    setScore(scoreId, 0, items.length);
  }


  function checkFill(containerId, scoreId, items) {
    var box = $("#" + containerId);
    if (!box) return;
    var correct = 0;

    $all(".fill-row", box).forEach(function (row, idx) {
      var it = items[idx];
      var inputs = $all("input.blank", row);

      inputs.forEach(function (input) {
        var b = parseInt(input.getAttribute("data-bindex") || "0", 10);
        var val = norm(input.value);

        // expected answers:
        // - multi-blank: it.blanks = [ [..], [..] ]
        // - single blank: it.a = [..]
        var expected = (it.blanks && it.blanks[b]) ? it.blanks[b] : (it.a || []);
        var ok = expected.some(function (ans) { return norm(ans) === val; });

        input.classList.remove("good", "bad");
        if (!val) return;

        if (ok) {
          input.classList.add("good");
        } else {
          input.classList.add("bad");
        }
      });

      // Count row correct only if ALL blanks (filled or not) are correct AND at least one blank is filled
      if (inputs.length) {
        var anyFilled = inputs.some(function (inp) { return norm(inp.value) !== ""; });
        var allCorrect = inputs.every(function (inp) { return inp.classList.contains("good"); });
        if (anyFilled && allCorrect) correct += 1;
      }
    });

    setScore(scoreId, correct, items.length);
  }

  function resetFill(containerId, scoreId, items) {
    renderFill(containerId, scoreId, items);
  }

  // --- Match (tap-to-match)
  function renderMatch(containerId, scoreId, pairs) {
    var box = $("#" + containerId);
    if (!box) return;

    box.innerHTML = "";

    var left = pairs.map(function (p) { return p[0]; });
    var right = pairs.map(function (p) { return p[1]; });

    left = shuffle(left);
    right = shuffle(right);

    var grid = document.createElement("div");
    grid.className = "match-grid";

    var colL = document.createElement("div");
    colL.className = "match-col";
    var colR = document.createElement("div");
    colR.className = "match-col";

    left.forEach(function (t) {
      var div = document.createElement("div");
      div.className = "m-item";
      div.textContent = t;
      div.setAttribute("data-side", "L");
      div.setAttribute("data-value", t);
      colL.appendChild(div);
    });

    right.forEach(function (t) {
      var div2 = document.createElement("div");
      div2.className = "m-item";
      div2.textContent = t;
      div2.setAttribute("data-side", "R");
      div2.setAttribute("data-value", t);
      colR.appendChild(div2);
    });

    grid.appendChild(colL);
    grid.appendChild(colR);
    box.appendChild(grid);

    var state = { pickL: null, pickR: null };
    function clearPicks() {
      state.pickL = null; state.pickR = null;
      $all(".m-item", box).forEach(function (el) { el.classList.remove("is-picked"); });
    }

    function lockGood(el) {
      el.classList.add("is-locked", "good");
      el.classList.remove("is-picked");
    }
    function markBad(a, b) {
      a.classList.add("bad"); b.classList.add("bad");
      setTimeout(function () { a.classList.remove("bad"); b.classList.remove("bad"); }, 600);
    }

    
    // Use pointer events (when available) to avoid "extra tap/click" on some devices,
    // with a click fallback.
    var lastPointerAt = 0;

    function handlePick(e) {
      var item = e.target.closest ? e.target.closest(".m-item") : null;
      if (!item || item.classList.contains("is-locked")) return;

      var side = item.getAttribute("data-side");
      var val = item.getAttribute("data-value");

      // Keep at most one picked per side
      if (side === "L") {
        $all('.m-item[data-side="L"]', box).forEach(function (el) { el.classList.remove("is-picked"); });
        state.pickL = val;
      } else {
        $all('.m-item[data-side="R"]', box).forEach(function (el) { el.classList.remove("is-picked"); });
        state.pickR = val;
      }
      item.classList.add("is-picked");

      if (state.pickL && state.pickR) {
        var ok = pairs.some(function (p) { return p[0] === state.pickL && p[1] === state.pickR; });
        var L = box.querySelector('.m-item[data-side="L"][data-value="' + cssEscape(state.pickL) + '"]');
        var R = box.querySelector('.m-item[data-side="R"][data-value="' + cssEscape(state.pickR) + '"]');

        if (ok) {
          lockGood(L); lockGood(R);
          clearPicks(); // IMPORTANT: prepare for next pair
        } else {
          markBad(L, R);
          clearPicks();
        }
      }
    }
    // Click works for mouse + touch (Safari/iPad). Keep it simple.
    box.addEventListener("click", handlePick);
setScore(scoreId, 0, pairs.length);
  }

  function checkMatch(containerId, scoreId, pairs) {
    var box = $("#" + containerId);
    if (!box) return;
    var locked = $all(".m-item.is-locked", box).length / 2;
    setScore(scoreId, locked, pairs.length);
  }

  function resetMatch(containerId, scoreId, pairs) {
    renderMatch(containerId, scoreId, pairs);
  }

  // --- Drag or tap match
  function renderDrag(containerId, scoreId, pairs) {
    var box = $("#" + containerId);
    if (!box) return;

    box.innerHTML = "";

    var left = shuffle(pairs.map(function (p) { return p[0]; }));
    var right = shuffle(pairs.map(function (p) { return p[1]; }));

    var grid = document.createElement("div");
    grid.className = "drag-grid";

    var bank = document.createElement("div");
    bank.className = "drag-bank";
    bank.innerHTML = '<div class="muted tiny"><strong>Bank</strong>: drag or tap a problem</div>';

    var targets = document.createElement("div");
    targets.className = "drag-targets";
    targets.innerHTML = '<div class="muted tiny"><strong>Targets</strong>: match the right solution</div>';

    left.forEach(function (t) {
      var chip = document.createElement("div");
      chip.className = "dchip";
      chip.textContent = t;
      chip.setAttribute("draggable", "true");
      chip.setAttribute("data-value", t);
      bank.appendChild(chip);
    });

    right.forEach(function (t) {
      var target = document.createElement("div");
      target.className = "target";
      target.setAttribute("data-value", t);
      target.innerHTML = '<span>' + escapeHtml(t) + '</span><em class="muted tiny">drop here</em>';
      targets.appendChild(target);
    });

    grid.appendChild(bank);
    grid.appendChild(targets);
    box.appendChild(grid);

    // Drag support
    var dragged = null;
    box.addEventListener("dragstart", function (e) {
      var chip = e.target.closest(".dchip");
      if (!chip) return;
      dragged = chip;
      e.dataTransfer.setData("text/plain", chip.getAttribute("data-value"));
      setTimeout(function () { chip.style.opacity = "0.6"; }, 0);
    });
    box.addEventListener("dragend", function () {
      if (dragged) dragged.style.opacity = "1";
      dragged = null;
    });
    box.addEventListener("dragover", function (e) {
      if (e.target.closest(".target")) e.preventDefault();
    });
    box.addEventListener("drop", function (e) {
      var t = e.target.closest(".target");
      if (!t) return;
      e.preventDefault();
      var val = e.dataTransfer.getData("text/plain");
      if (!val) return;

      attachToTarget(val, t.getAttribute("data-value"));
    });

    // Tap-to-match fallback
    var picked = null;
    box.addEventListener("click", function (e) {
      var chip = e.target.closest(".dchip");
      var target = e.target.closest(".target");

      if (chip) {
        if (chip.classList.contains("is-picked")) {
          chip.classList.remove("is-picked");
          picked = null;
        } else {
          $all(".dchip", box).forEach(function (c) { c.classList.remove("is-picked"); });
          chip.classList.add("is-picked");
          picked = chip.getAttribute("data-value");
        }
      }

      if (target && picked) {
        attachToTarget(picked, target.getAttribute("data-value"));
        $all(".dchip", box).forEach(function (c) { c.classList.remove("is-picked"); });
        picked = null;
      }
    });

    function attachToTarget(problem, solution) {
      // place pairing in target
      var t = box.querySelector('.target[data-value="' + cssEscape(solution) + '"]');
      if (!t) return;

      // If already filled, replace
      t.setAttribute("data-picked", problem);
      t.innerHTML = '<strong>' + escapeHtml(solution) + '</strong><span class="muted tiny">← ' + escapeHtml(problem) + '</span>';
    }

    setScore(scoreId, 0, pairs.length);
  }

  function checkDrag(containerId, scoreId, pairs) {
    var box = $("#" + containerId);
    if (!box) return;
    var correct = 0;

    pairs.forEach(function (p) {
      var prob = p[0];
      var sol = p[1];
      var t = box.querySelector('.target[data-value="' + cssEscape(sol) + '"]');
      if (!t) return;
      t.classList.remove("good", "bad");
      var picked = t.getAttribute("data-picked") || "";
      if (!picked) return;

      if (picked === prob) {
        correct += 1;
        t.classList.add("good");
      } else {
        t.classList.add("bad");
      }
    });

    setScore(scoreId, correct, pairs.length);
  }

  function resetDrag(containerId, scoreId, pairs) {
    renderDrag(containerId, scoreId, pairs);
  }

  // --- Word order (tap-to-build)
  function renderOrder(containerId, scoreId, sentences) {
    var box = $("#" + containerId);
    if (!box) return;

    box.innerHTML = "";
    sentences.forEach(function (s, idx) {
      var outer = document.createElement("div");
      outer.className = "order-box";
      outer.setAttribute("data-index", String(idx));

      var prompt = document.createElement("div");
      prompt.className = "muted tiny";
      prompt.innerHTML = "<strong>Build:</strong> " + escapeHtml(s.prompt);

      var out = document.createElement("div");
      out.className = "order-sentence";
      out.setAttribute("aria-label", "Built sentence " + (idx + 1));

      var bank = document.createElement("div");
      bank.className = "token-row";

      var tokens = shuffle(s.tokens.slice());
      tokens.forEach(function (t) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "token";
        b.textContent = t;

        b.addEventListener("click", function () {
          if (b.classList.contains("is-on")) {
            // remove from sentence
            b.classList.remove("is-on");
            var hit = $all(".token", out).find(function (x) { return x.textContent === t; });
            if (hit) out.removeChild(hit);
          } else {
            b.classList.add("is-on");
            var tok = document.createElement("span");
            tok.className = "token is-on";
            tok.textContent = t;
            tok.title = "Tap to remove";
            tok.addEventListener("click", function () {
              // remove and unselect bank token
              out.removeChild(tok);
              var bankBtn = $all(".token", bank).find(function (x) { return x.textContent === t; });
              if (bankBtn) bankBtn.classList.remove("is-on");
            });
            out.appendChild(tok);
          }
        });

        bank.appendChild(b);
      });

      var tools = document.createElement("div");
      tools.className = "order-actions";

      var sayBtn = document.createElement("button");
      sayBtn.type = "button";
      sayBtn.className = "btn btn-ghost";
      sayBtn.textContent = "🔊 Listen";
      sayBtn.addEventListener("click", function () { speak(s.answer); });

      var clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "btn btn-ghost";
      clearBtn.textContent = "Clear";
      clearBtn.addEventListener("click", function () {
        out.classList.remove("good", "bad");
        out.innerHTML = "";
        $all(".token", bank).forEach(function (x) { x.classList.remove("is-on"); });
      });

      tools.appendChild(sayBtn);
      tools.appendChild(clearBtn);

      outer.appendChild(prompt);
      outer.appendChild(out);
      outer.appendChild(bank);
      outer.appendChild(tools);
      box.appendChild(outer);
    });

    setScore(scoreId, 0, sentences.length);
  }

  function checkOrder(containerId, scoreId, sentences) {
    var box = $("#" + containerId);
    if (!box) return;
    var correct = 0;

    $all(".order-box", box).forEach(function (outer, idx) {
      var out = outer.querySelector(".order-sentence");
      var built = $all(".token", out).map(function (t) { return t.textContent; }).join(" ").replace(/\s+/g, " ").trim();
      var ans = sentences[idx].answer;

      out.classList.remove("good", "bad");
      if (!built) return;

      if (built === ans) { out.classList.add("good"); correct += 1; }
      else { out.classList.add("bad"); }
    });

    setScore(scoreId, correct, sentences.length);
  }

  function resetOrder(containerId, scoreId, sentences) {
    renderOrder(containerId, scoreId, sentences);
  }

  // --- Builder (tap-to-build with word bank, 1 sentence at a time)
  function renderBuilder(containerId, scoreId, items) {
    var box = $("#" + containerId);
    if (!box) return;

    box.innerHTML = "";
    items.forEach(function (it, idx) {
      var row = document.createElement("div");
      row.className = "builder-row";
      row.setAttribute("data-index", String(idx));

      var top = document.createElement("div");
      top.innerHTML = '<div class="muted tiny"><strong>Goal:</strong> ' + escapeHtml(it.prompt) + '</div>';

      var out = document.createElement("div");
      out.className = "order-sentence builder-out";

      var bank = document.createElement("div");
      bank.className = "builder-bank";

      shuffle(it.tokens).forEach(function (t) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "token";
        btn.textContent = t;
        btn.addEventListener("click", function () {
          // toggle token
          if (btn.classList.contains("is-on")) {
            btn.classList.remove("is-on");
            var tok = $all(".token", out).find(function (x) { return x.textContent === t; });
            if (tok) out.removeChild(tok);
          } else {
            btn.classList.add("is-on");
            var tok2 = document.createElement("span");
            tok2.className = "token is-on";
            tok2.textContent = t;
            tok2.addEventListener("click", function () {
              out.removeChild(tok2);
              btn.classList.remove("is-on");
            });
            out.appendChild(tok2);
          }
        });
        bank.appendChild(btn);
      });

      var tools = document.createElement("div");
      tools.className = "order-actions";

      var say = document.createElement("button");
      say.type = "button";
      say.className = "btn btn-ghost";
      say.textContent = "🔊 Model";
      say.addEventListener("click", function () { speak(it.answer); });

      var clear = document.createElement("button");
      clear.type = "button";
      clear.className = "btn btn-ghost";
      clear.textContent = "Clear";
      clear.addEventListener("click", function () {
        out.classList.remove("good", "bad");
        out.innerHTML = "";
        $all(".token", bank).forEach(function (b) { b.classList.remove("is-on"); });
      });

      tools.appendChild(say);
      tools.appendChild(clear);

      row.appendChild(top);
      row.appendChild(out);
      row.appendChild(bank);
      row.appendChild(tools);
      box.appendChild(row);
    });

    setScore(scoreId, 0, items.length);
  }

  function checkBuilder(containerId, scoreId, items) {
    var box = $("#" + containerId);
    if (!box) return;
    var correct = 0;

    $all(".builder-row", box).forEach(function (row, idx) {
      var out = row.querySelector(".order-sentence");
      var built = $all(".token", out).map(function (t) { return t.textContent; }).join(" ").replace(/\s+/g, " ").trim();
      var ans = items[idx].answer;

      out.classList.remove("good", "bad");
      if (!built) return;

      if (built === ans) { out.classList.add("good"); correct += 1; }
      else { out.classList.add("bad"); }
    });

    setScore(scoreId, correct, items.length);
  }

  function resetBuilder(containerId, scoreId, items) {
    renderBuilder(containerId, scoreId, items);
  }

  // ---------------------------
  // Exercises data
  // ---------------------------
  var QCM_POLITE = [
    {q:"You want a quiet room. Choose the best option:", options:[
      "I want a quiet room.",
      "Could I have a quiet room, please?",
      "Give me a quiet room."
    ], answer:1, help:"In hotels, “Could I… please?” sounds natural and polite."},
    {q:"Reception asks for your ID (formal).", options:[
      "May I see your passport, please?",
      "Show me your passport.",
      "You give passport now."
    ], answer:0},
    {q:"You want to pay by card.", options:[
      "Can I pay by card, please?",
      "I pay by card.",
      "Pay card."
    ], answer:0},
    {q:"You need the Wi‑Fi code.", options:[
      "Could you give me the Wi‑Fi password, please?",
      "Wi‑Fi password!",
      "I need Wi‑Fi now."
    ], answer:0}
  ];

  var ORDER_POLITE = [
    {prompt:"a reservation (polite)", tokens:["I’d","like","to","make","a","reservation,","please."], answer:"I’d like to make a reservation, please."},
    {prompt:"a room with breakfast", tokens:["I’d","like","a","room","with","breakfast,","please."], answer:"I’d like a room with breakfast, please."},
    {prompt:"permission to check in", tokens:["Could","I","check","in","now,","please?"], answer:"Could I check in now, please?"}
  ];

  var FILL_TIME = [
    {s:"Breakfast is { } 7 { } 10 a.m.", blanks:[["from"],["to"]], audio:"Breakfast is from seven to ten a.m."},
    {s:"Check-in starts { } 2 p.m.", a:["at"], audio:"Check-in starts at two p.m."},
    {s:"I have a reservation { } Tuesday.", a:["on"]},
    {s:"I’m traveling { } November.", a:["in"]},
    {s:"We are staying { } two nights.", a:["for"]}
  ];

  var QCM_TIME = [
    {q:"Listen: choose the correct meaning.", audio:"Check-out is by eleven a.m.", options:[
      "You must leave the room before 11:00 in the morning.",
      "You can enter the room at 11:00.",
      "Breakfast is at 11:00."
    ], answer:0},
    {q:"Listen: choose the correct meaning.", audio:"Breakfast is from seven to ten a.m.", options:[
      "Breakfast is served between 7:00 and 10:00 in the morning.",
      "Breakfast is at 7:00 p.m.",
      "Breakfast is only at 10:00."
    ], answer:0},
    {q:"Listen: choose the correct meaning.", audio:"We are staying for two nights.", options:[
      "We stay 2 nights (not 2 weeks).",
      "We stay two years.",
      "We stay only one night."
    ], answer:0}
  ];

  var MATCH_PLACE = [
    ["next to", "The elevator is next to the reception."],
    ["between", "The bar is between the elevator and reception."],
    ["across from", "The café is across from the lobby bar."],
    ["down the hall", "The elevators are down the hall."],
    ["on the left", "The gym is on the left."]
  ];

  var QCM_PLACE = [
    {q:"Where is the pool on the mini-map?", options:[
      "It’s next to the entrance.",
      "It’s in the middle row, right side.",
      "It’s under the spa."
    ], answer:1},
    {q:"Where are the elevators on the mini-map?", options:[
      "They’re in the top row, right side.",
      "They’re next to the spa.",
      "They’re behind the gym."
    ], answer:0},
    {q:"Where is Anzu restaurant on the mini-map?", options:[
      "It’s in the middle row, middle cell.",
      "It’s on the bottom row, left cell.",
      "It’s in the top row, left side."
    ], answer:0}
  ];

  var ORDER_DIRECTIONS = [
    {prompt:"to the gym", tokens:["Take","the","elevator","to","the","third","floor.","The","gym","is","on","your","right."], answer:"Take the elevator to the third floor. The gym is on your right."},
    {prompt:"simple instructions", tokens:["Go","straight.","Turn","left.","It’s","near","the","pool."], answer:"Go straight. Turn left. It’s near the pool."}
  ];

  var FILL_ROOM = [
    {s:"There { } a balcony.", a:["is"]},
    {s:"There { } two beds.", a:["are"]},
    {s:"There { } any towels in the bathroom.", a:["aren’t","are not"]},
    {s:"The room { } a city view. (US)", a:["has"]},
    {s:"The room { } a city view. (UK)", a:["has got"]},
    {s:"There { } a minibar in the room.", a:["is"]}
  ];

  var BUILDER_REQUESTS = [
    {prompt:"Ask for extra towels", tokens:["Could","I","have","extra","towels,","please?"], answer:"Could I have extra towels, please?"},
    {prompt:"Ask for the Wi‑Fi password", tokens:["Can","I","get","the","Wi‑Fi","password,","please?"], answer:"Can I get the Wi‑Fi password, please?"},
    {prompt:"Ask for a wake‑up call", tokens:["I’d","like","a","wake-up","call","at","7","a.m.,","please."], answer:"I’d like a wake-up call at 7 a.m., please."}
  ];

  var QCM_REQUESTS = [
    {q:"Listen: what is the guest asking for?", audio:"Could I have an extra blanket, please?", options:[
      "A blanket",
      "A taxi",
      "A room key"
    ], answer:0},
    {q:"Listen: what is the guest asking for?", audio:"Can I get the Wi-Fi password, please?", options:[
      "The Wi‑Fi password",
      "The restaurant menu",
      "The checkout time"
    ], answer:0},
    {q:"Listen: what is the guest asking for?", audio:"I’d like a wake-up call at six a.m., please.", options:[
      "A wake-up call",
      "A spa appointment",
      "A museum ticket"
    ], answer:0}
  ];

  var DRAG_PROBLEMS = [
    ["No toilet paper", "I’ll send housekeeping right away."],
    ["The air conditioning doesn’t work", "I’ll call maintenance."],
    ["The key card doesn’t work", "I can make you a new key card."],
    ["It’s too noisy", "We can offer another room."],
    ["No hot water", "Maintenance will come right away."]
  ];

  var FILL_PROBLEMS = [
    {s:"Excuse me, there’s a { } with my room.", a:["problem"]},
    {s:"I’m { } to hear that.", a:["sorry"]},
    {s:"There’s no hot { } in the shower.", a:["water"]},
    {s:"I’ll send { } right away.", a:["maintenance","housekeeping"]},
    {s:"Would you like { } room?", a:["another","a different"]}
  ];

  var QCM_FOOD = [
    {q:"You want to see the menu.", options:[
      "Could I see the menu, please?",
      "Give menu.",
      "Menu now."
    ], answer:0},
    {q:"You don’t understand a dish.", options:[
      "Could you explain this dish, please?",
      "No understand.",
      "Explain. Fast."
    ], answer:0},
    {q:"You need more time to choose.", options:[
      "Could you give me a minute, please?",
      "I wait.",
      "Go away."
    ], answer:0},
    {q:"You want to pay.", options:[
      "Could I have the bill/check, please?",
      "I money.",
      "Pay!"
    ], answer:0}
  ];

  var ORDER_FOOD = [
    {prompt:"ordering a dish", tokens:["I’ll","have","the","grilled","salmon,","please."], answer:"I’ll have the grilled salmon, please."},
    {prompt:"asking for the bill/check", tokens:["Could","I","have","the","bill,","please?"], answer:"Could I have the bill, please?"}
  ];

  var FILL_FOOD = [
    {s:"Could I see the { }, please?", a:["menu"]},
    {s:"What do you { } for tonight?", a:["recommend"]},
    {s:"Could you give me a { }, please?", a:["minute"]},
    {s:"I’m { } to order.", a:["ready"]},
    {s:"Could I have the { }, please?", a:["bill","check"]}
  ];

  var QCM_COMPARE = [
    {q:"Choose the correct comparative:", options:[
      "The Imperial room is more luxurious the Petite Queen room.",
      "The Imperial room is more luxurious than the Petite Queen room.",
      "The Imperial room is luxurious than the Petite Queen room."
    ], answer:1},
    {q:"Choose the correct superlative:", options:[
      "This is the most delicious dish.",
      "This is the more delicious dish.",
      "This is deliciousest dish."
    ], answer:0},
    {q:"Choose the correct form:", options:[
      "I prefer sushi than pizza.",
      "I prefer sushi to pizza.",
      "I prefer sushi with pizza."
    ], answer:1}
  ];

  var FILL_COMPARE = [
    {s:"French food is { } than fast food.", a:["better"]},
    {s:"The Imperial room is more luxurious { } the Deluxe room.", a:["than"]},
    {s:"Matcha cheesecake is { } best dessert.", a:["the"]},
    {s:"This is the { } delicious dish.", a:["most"]},
    {s:"The Junior Suite is { } spacious than the Petite Queen.", a:["more"]}
  ];

  var SPEAK_RECO = [
    {q:"Ask the concierge for a recommendation near the hotel.", model:"Could you recommend something to see near the hotel, please?"},
    {q:"Recommend a place for dinner (polite).", model:"You should try Anzu Restaurant. It’s delicious and close."},
    {q:"Give advice for tomorrow (tourism).", model:"You should visit the Golden Gate Bridge. It’s iconic."}
  ];

  var ORDER_ADVERBS = [
    {prompt:"polite request (adverb)", tokens:["Could","you","repeat","that","slowly,","please?"], answer:"Could you repeat that slowly, please?"},
    {prompt:"clear speech", tokens:["Please","speak","clearly."], answer:"Please speak clearly."},
    {prompt:"quiet action", tokens:["Please","close","the","door","quietly."], answer:"Please close the door quietly."}
  ];

  // ---------------------------
  // Speaking prompts (no ASR required)
  // ---------------------------
  function renderSpeakPrompts() {
    var box = $("#speak_reco");
    if (!box) return;
    box.innerHTML = "";

    SPEAK_RECO.forEach(function (it) {
      var c = document.createElement("div");
      c.className = "q-item";
      var q = document.createElement("div");
      q.className = "q-q";
      q.textContent = it.q;

      var row = document.createElement("div");
      row.className = "tts-bar";

      var listen = document.createElement("button");
      listen.type = "button";
      listen.className = "btn btn-ghost";
      listen.textContent = "🔊 Listen to model";
      listen.addEventListener("click", function () { speak(it.model); });

      var reveal = document.createElement("button");
      reveal.type = "button";
      reveal.className = "btn btn-ghost";
      reveal.textContent = "Show model";
      reveal.addEventListener("click", function () {
        model.hidden = !model.hidden;
      });

      var model = document.createElement("div");
      model.className = "note tiny";
      model.textContent = it.model;
      model.hidden = true;

      row.appendChild(listen);
      row.appendChild(reveal);

      c.appendChild(q);
      c.appendChild(row);
      c.appendChild(model);
      box.appendChild(c);
    });
  }

  // ---------------------------
  // Dialogue builder
  // ---------------------------
  var SCENARIOS = [
    {
      id: "reservation_phone",
      title: "Reservation (phone)",
      required: [
        {k:"greet", hint:"Add a greeting (Good evening / How may I help you?).", test:/good (morning|afternoon|evening)|how may i help|how can i help/i},
        {k:"book", hint:"Say you want to book/reserve.", test:/book|reserve|reservation/i},
        {k:"dates", hint:"Add dates (from…to…) or nights.", test:/from .* to|for .* nights/i},
        {k:"breakfast", hint:"Ask about breakfast (included / time).", test:/breakfast/i},
        {k:"email", hint:"Add an email / confirmation line.", test:/email|confirmation/i}
      ],
      bank: {
        Guest: [
          "Good evening! I’d like to book a double room for two nights, please.",
          "It’s from May 12th to May 14th.",
          "Is breakfast included?",
          "Could I have a quiet room with a view, please?",
          "My email is name@example.com."
        ],
        Receptionist: [
          "Good evening! How may I help you?",
          "Of course. For how many nights?",
          "Would you like a single or double room?",
          "Yes, breakfast is included.",
          "May I have your name and email, please?",
          "Your reservation is confirmed. You will receive a confirmation by email shortly."
        ]
      }
    },
    {
      id: "checkin_arrival",
      title: "Check‑in & arrival",
      required: [
        {k:"greet", hint:"Start with a greeting.", test:/good (morning|afternoon|evening)|welcome/i},
        {k:"reservation", hint:"Say you have a reservation under a name.", test:/reservation under|i have a reservation/i},
        {k:"id", hint:"Passport/ID + credit card request.", test:/passport|id|credit card/i},
        {k:"breakfast", hint:"Ask or answer breakfast time.", test:/breakfast.*(from|at)|from .* to/i},
        {k:"room", hint:"Room number + floor + key card.", test:/room \d+|key card|third floor|floor/i},
        {k:"directions", hint:"Directions to elevator / room.", test:/elevator|straight|down the hall|on your (left|right)/i}
      ],
      bank: {
        Guest: [
          "Good afternoon. I have a reservation under Smith.",
          "May I check in now, please?",
          "What time is breakfast?",
          "Thank you very much."
        ],
        Receptionist: [
          "Good afternoon! Welcome to Hotel Nikko. How can I help you?",
          "May I see your passport and credit card, please?",
          "Breakfast is from 7 to 10 a.m.",
          "Here is your key card. You are in room 305 on the third floor.",
          "The elevator is straight down the hall."
        ]
      }
    },
    {
      id: "room_requests",
      title: "Room requests (towels, Wi‑Fi, wake‑up call)",
      required: [
        {k:"request", hint:"Use a polite request (Could I / Can I / I’d like).", test:/could i|can i|i’d like/i},
        {k:"item", hint:"Request an item (towels / Wi‑Fi password / wake‑up call).", test:/towel|wi-?fi|wake-up/i},
        {k:"please", hint:"Add please/thank you.", test:/please|thank/i}
      ],
      bank: {
        Guest: [
          "Could I have extra towels, please?",
          "Can I get the Wi‑Fi password, please?",
          "I’d like a wake-up call at 7 a.m., please.",
          "Thank you."
        ],
        Receptionist: [
          "Certainly. I’ll send housekeeping right away.",
          "Of course. The Wi‑Fi password is on your key card sleeve.",
          "No problem. I’ll schedule your wake-up call.",
          "You’re welcome."
        ]
      }
    },
    {
      id: "problem_complaint",
      title: "Problem in the room (complaint)",
      required: [
        {k:"problem", hint:"State the problem (no hot water / noisy / light doesn’t work).", test:/no hot water|no toilet paper|too noisy|doesn’t work|broken/i},
        {k:"apology", hint:"Reception apologizes.", test:/sorry|apolog/i},
        {k:"solution", hint:"Offer a solution (send maintenance / another room).", test:/send (maintenance|housekeeping)|another room|offer/i}
      ],
      bank: {
        Guest: [
          "Excuse me, there’s a problem with my room.",
          "There’s no hot water in the shower.",
          "The air conditioning doesn’t work.",
          "It’s too noisy at night."
        ],
        Receptionist: [
          "I’m sorry to hear that. What seems to be the problem?",
          "I apologize — I’ll send maintenance right away.",
          "Would you like another room?"
        ]
      }
    },
    {
      id: "restaurant_booking",
      title: "Restaurant booking & ordering",
      required: [
        {k:"book", hint:"Book a table or ask for the menu.", test:/book a table|menu/i},
        {k:"time", hint:"Add a time.", test:/at \d|o’clock/i},
        {k:"order", hint:"Order politely or ask for recommendation.", test:/i’ll have|i’d like|recommend/i},
        {k:"bill", hint:"Ask for the bill/check.", test:/bill|check/i}
      ],
      bank: {
        Guest: [
          "Good evening! I’d like to book a table for two at 8 o’clock, please.",
          "Could I see the menu, please?",
          "What do you recommend tonight?",
          "I’ll have the grilled salmon, please.",
          "Could I have the bill/check, please?"
        ],
        Staff: [
          "Certainly. What name is it under?",
          "Of course. Here you go.",
          "The grilled salmon is excellent.",
          "Anything else?",
          "Thank you. Your order will arrive shortly."
        ]
      }
    },
    {
      id: "checkout",
      title: "Checkout & payment",
      required: [
        {k:"checkout", hint:"Say you’re checking out.", test:/check(ing)? out/i},
        {k:"bill", hint:"Ask for or present the bill/check/receipt.", test:/bill|check|receipt/i},
        {k:"pay", hint:"Payment method (card/cash).", test:/pay|card|cash/i},
        {k:"thanks", hint:"Polite closing (thank you / have a nice day).", test:/thank|nice day|welcome/i}
      ],
      bank: {
        Guest: [
          "Good morning. I’d like to check out, please.",
          "Could I have the bill/check, please?",
          "Can I pay by card?",
          "Thank you. Have a nice day!"
        ],
        Receptionist: [
          "Of course. May I have your room number, please?",
          "Here is your receipt.",
          "Yes, you can pay by card or cash.",
          "Thank you for staying with us. Have a wonderful day!"
        ]
      }
    }
  ];

  function renderScenarioSelect() {
    var sel = $("#scenarioSelect");
    if (!sel) return;
    sel.innerHTML = "";
    SCENARIOS.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.title;
      sel.appendChild(opt);
    });
  }

  function currentScenario() {
    var sel = $("#scenarioSelect");
    var id = sel ? sel.value : SCENARIOS[0].id;
    return SCENARIOS.find(function (s) { return s.id === id; }) || SCENARIOS[0];
  }

  function getRoleBank(scenario, role) {
    var bank = scenario.bank || {};
    if (bank[role]) return bank[role];
    // fallback: merge all lines
    var merged = [];
    Object.keys(bank).forEach(function (k) {
      merged = merged.concat(bank[k]);
    });
    return merged;
  }

  function renderLineSelect() {
    var scenario = currentScenario();
    var role = $("#roleSelect") ? $("#roleSelect").value : "Guest";
    var sel = $("#lineSelect");
    if (!sel) return;

    var lines = getRoleBank(scenario, role);
    sel.innerHTML = "";
    lines.forEach(function (l, idx) {
      var opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = l;
      sel.appendChild(opt);
    });
  }

  function addDialogueLine(role, text) {
    var list = $("#dialogueLines");
    if (!list) return;

    var li = document.createElement("li");
    var left = document.createElement("div");
    left.innerHTML = "<strong>" + escapeHtml(role) + ":</strong> " + escapeHtml(text);

    var actions = document.createElement("div");
    actions.className = "line-actions";

    var play = document.createElement("button");
    play.type = "button";
    play.className = "iconbtn";
    play.textContent = "🔊";
    play.title = "Listen";
    play.addEventListener("click", function () {
      speak(text.replace("name@example.com", "my email is tisha dot example at gmail dot com"));
    });

    var del = document.createElement("button");
    del.type = "button";
    del.className = "iconbtn";
    del.textContent = "🗑️";
    del.title = "Delete";
    del.addEventListener("click", function () { list.removeChild(li); });

    actions.appendChild(play);
    actions.appendChild(del);

    li.appendChild(left);
    li.appendChild(actions);
    list.appendChild(li);
  }

  function clearDialogue() {
    var list = $("#dialogueLines");
    var fb = $("#dialogueFeedback");
    if (list) list.innerHTML = "";
    if (fb) { fb.hidden = true; fb.innerHTML = ""; }
  }

  function checkDialogue() {
    var scenario = currentScenario();
    var lines = $all("#dialogueLines li").map(function (li) { return li.textContent; }).join("\n");

    var missing = [];
    scenario.required.forEach(function (req) {
      if (!req.test.test(lines)) missing.push(req.hint);
    });

    var fb = $("#dialogueFeedback");
    if (!fb) return;

    fb.hidden = false;

    if (!lines.trim()) {
      fb.innerHTML = "<strong>Add some lines first.</strong> Use the picker on the left.";
      return;
    }

    if (!missing.length) {
      fb.innerHTML = "<strong>✅ Great!</strong> Your dialogue includes all key elements for <em>" + escapeHtml(scenario.title) + "</em>.<br><span class='muted tiny'>Now: click 🔊 and repeat with good rhythm and politeness.</span>";
      return;
    }

    var listHtml = "<ul>";
    missing.forEach(function (m) { listHtml += "<li>" + escapeHtml(m) + "</li>"; });
    listHtml += "</ul>";

    fb.innerHTML = "<strong>Almost there.</strong> To make it complete for <em>" + escapeHtml(scenario.title) + "</em>, add:<br>" + listHtml;
  }

  function wireDialogueBuilder() {
    renderScenarioSelect();
    renderLineSelect();

    var scenarioSel = $("#scenarioSelect");
    var roleSel = $("#roleSelect");
    var lineSel = $("#lineSelect");

    if (scenarioSel) scenarioSel.addEventListener("change", function () {
      renderLineSelect();
      clearDialogue();
    });
    if (roleSel) roleSel.addEventListener("change", renderLineSelect);

    var saySel = $("#sayLineBtn");
    if (saySel) saySel.addEventListener("click", function () {
      var scenario = currentScenario();
      var role = roleSel ? roleSel.value : "Guest";
      var lines = getRoleBank(scenario, role);
      var idx = lineSel ? parseInt(lineSel.value, 10) : 0;
      var text = lines[idx] || "";
      speak(text);
    });

    var addBtn = $("#addLineBtn");
    if (addBtn) addBtn.addEventListener("click", function () {
      var scenario = currentScenario();
      var role = roleSel ? roleSel.value : "Guest";
      var lines = getRoleBank(scenario, role);
      var idx = lineSel ? parseInt(lineSel.value, 10) : 0;
      var text = lines[idx] || "";
      addDialogueLine(role, text);
    });

    var clearBtn = $("#clearDialogueBtn");
    if (clearBtn) clearBtn.addEventListener("click", clearDialogue);

    var checkBtn = $("#checkDialogueBtn");
    if (checkBtn) checkBtn.addEventListener("click", checkDialogue);
  }

  // ---------------------------
  // Global button handling (Check/Reset)
  // ---------------------------
  function wireCheckReset() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action][data-quiz]");
      if (!btn) return;

      var action = btn.getAttribute("data-action");
      var quiz = btn.getAttribute("data-quiz");

      if (quiz === "qcm_polite") {
        if (action === "check") checkQCM("qcm_polite", "score_qcm_polite", QCM_POLITE);
        else resetQCM("qcm_polite", "score_qcm_polite", QCM_POLITE);
      } else if (quiz === "order_polite") {
        if (action === "check") checkOrder("order_polite", "score_order_polite", ORDER_POLITE);
        else resetOrder("order_polite", "score_order_polite", ORDER_POLITE);
      } else if (quiz === "fill_time") {
        if (action === "check") checkFill("fill_time", "score_fill_time", FILL_TIME);
        else resetFill("fill_time", "score_fill_time", FILL_TIME);
      } else if (quiz === "qcm_time") {
        if (action === "check") checkQCM("qcm_time", "score_qcm_time", QCM_TIME);
        else resetQCM("qcm_time", "score_qcm_time", QCM_TIME);
      } else if (quiz === "match_place") {
        if (action === "check") checkMatch("match_place", "score_match_place", MATCH_PLACE);
        else resetMatch("match_place", "score_match_place", MATCH_PLACE);
      } else if (quiz === "qcm_place") {
        if (action === "check") checkQCM("qcm_place", "score_qcm_place", QCM_PLACE);
        else resetQCM("qcm_place", "score_qcm_place", QCM_PLACE);
      } else if (quiz === "order_directions") {
        if (action === "check") checkOrder("order_directions", "score_order_directions", ORDER_DIRECTIONS);
        else resetOrder("order_directions", "score_order_directions", ORDER_DIRECTIONS);
      } else if (quiz === "fill_room") {
        if (action === "check") checkFill("fill_room", "score_fill_room", FILL_ROOM);
        else resetFill("fill_room", "score_fill_room", FILL_ROOM);
      } else if (quiz === "builder_requests") {
        if (action === "check") checkBuilder("builder_requests", "score_builder_requests", BUILDER_REQUESTS);
        else resetBuilder("builder_requests", "score_builder_requests", BUILDER_REQUESTS);
      } else if (quiz === "qcm_requests") {
        if (action === "check") checkQCM("qcm_requests", "score_qcm_requests", QCM_REQUESTS);
        else resetQCM("qcm_requests", "score_qcm_requests", QCM_REQUESTS);
      } else if (quiz === "drag_problems") {
        if (action === "check") checkDrag("drag_problems", "score_drag_problems", DRAG_PROBLEMS);
        else resetDrag("drag_problems", "score_drag_problems", DRAG_PROBLEMS);
      } else if (quiz === "fill_problems") {
        if (action === "check") checkFill("fill_problems", "score_fill_problems", FILL_PROBLEMS);
        else resetFill("fill_problems", "score_fill_problems", FILL_PROBLEMS);
      } else if (quiz === "qcm_food") {
        if (action === "check") checkQCM("qcm_food", "score_qcm_food", QCM_FOOD);
        else resetQCM("qcm_food", "score_qcm_food", QCM_FOOD);
      } else if (quiz === "order_food") {
        if (action === "check") checkOrder("order_food", "score_order_food", ORDER_FOOD);
        else resetOrder("order_food", "score_order_food", ORDER_FOOD);
      } else if (quiz === "fill_food") {
        if (action === "check") checkFill("fill_food", "score_fill_food", FILL_FOOD);
        else resetFill("fill_food", "score_fill_food", FILL_FOOD);
      } else if (quiz === "qcm_compare") {
        if (action === "check") checkQCM("qcm_compare", "score_qcm_compare", QCM_COMPARE);
        else resetQCM("qcm_compare", "score_qcm_compare", QCM_COMPARE);
      } else if (quiz === "fill_compare") {
        if (action === "check") checkFill("fill_compare", "score_fill_compare", FILL_COMPARE);
        else resetFill("fill_compare", "score_fill_compare", FILL_COMPARE);
      } else if (quiz === "order_adverbs") {
        if (action === "check") checkOrder("order_adverbs", "score_order_adverbs", ORDER_ADVERBS);
        else resetOrder("order_adverbs", "score_order_adverbs", ORDER_ADVERBS);
      }
    });
  }

  
  // ---------------------------
  // UX: Move Check/Reset bars to the top and make them sticky
  // ---------------------------
  function pinActionBars() {
    var bars = $all(".quiz-actions");
    bars.forEach(function (bar) {
      try {
        var wrap = bar.closest(".card-soft") || bar.parentElement;
        if (!wrap) return;

        // Already pinned?
        if (bar.classList.contains("is-top")) return;

        var head = $(".exercise-head", wrap);
        if (head && head.parentElement === wrap) {
          // Move right after exercise head
          wrap.insertBefore(bar, head.nextSibling);
          bar.classList.add("is-top");
        }
      } catch (err) {
        // Non-fatal
        console.warn("pinActionBars failed:", err);
      }
    });
  }

// ---------------------------
  // HTML escape helpers (safe rendering)
  // ---------------------------
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[m];
    });
  }
  function cssEscape(str) {
    // Basic escape for attribute selectors
    return String(str).replace(/["\\]/g, "\\$&");
  }

  // ---------------------------
  // Init
  // ---------------------------
  function init() {
    try {
// Voices
    if (window.speechSynthesis) {
      wireTTS();
      loadVoices();
      // Some browsers fire voiceschanged async
      window.speechSynthesis.onvoiceschanged = function () { loadVoices(); };
    } else {
      var tts = document.querySelector(".tts");
      if (tts) tts.innerHTML = "<p><strong>Text-to-Speech is not supported</strong> in this browser.</p>";
    }

    // Vocabulary and phrases
    initVocabFilters();
    renderPhraseList("phraseListGreetings", GREETING_PHRASES);
    renderPhraseList("phraseListFood", FOOD_PHRASES);

    // Render all activities
    renderQCM("qcm_polite", "score_qcm_polite", QCM_POLITE);
    renderOrder("order_polite", "score_order_polite", ORDER_POLITE);

    renderFill("fill_time", "score_fill_time", FILL_TIME);
    renderQCM("qcm_time", "score_qcm_time", QCM_TIME);

    renderMatch("match_place", "score_match_place", MATCH_PLACE);
    renderQCM("qcm_place", "score_qcm_place", QCM_PLACE);
    renderOrder("order_directions", "score_order_directions", ORDER_DIRECTIONS);

    renderFill("fill_room", "score_fill_room", FILL_ROOM);
    renderBuilder("builder_requests", "score_builder_requests", BUILDER_REQUESTS);
    renderQCM("qcm_requests", "score_qcm_requests", QCM_REQUESTS);

    renderDrag("drag_problems", "score_drag_problems", DRAG_PROBLEMS);
    renderFill("fill_problems", "score_fill_problems", FILL_PROBLEMS);

    renderQCM("qcm_food", "score_qcm_food", QCM_FOOD);
    renderOrder("order_food", "score_order_food", ORDER_FOOD);
    renderFill("fill_food", "score_fill_food", FILL_FOOD);

    renderQCM("qcm_compare", "score_qcm_compare", QCM_COMPARE);
    renderFill("fill_compare", "score_fill_compare", FILL_COMPARE);
    renderSpeakPrompts();

    renderOrder("order_adverbs", "score_order_adverbs", ORDER_ADVERBS);

    // Dialogue builder
    wireDialogueBuilder();

    // Global check/reset buttons
    wireCheckReset();

    // Keep "Check/Reset" visible at the top of each exercise
    pinActionBars();
    setTimeout(pinActionBars, 80);

    } catch (err) {
      console.error(err);
      showErrorBanner("A script error prevented the activities from loading. Please refresh, and make sure the /js and /css paths are correct for this page.");
    }
}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
