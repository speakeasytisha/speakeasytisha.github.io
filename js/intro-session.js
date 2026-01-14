/* SpeakEasyTisha — Introduction Session (Interactive)
   Built from the uploaded PPT content. Touch-friendly (Mac/iPad Safari).
   Includes: US/UK speechSynthesis toggle, animated sections, global score, guided mode.
*/
(function () {
  "use strict";

  /* ---------------------------
     Data
  ----------------------------*/
  var DATA = window.__INTRO_DATA__ || {};
  var slides = DATA.slides || [];
  var keyVocab = DATA.keyVocab || [];
  var survival = DATA.survival || [];
  var greetingCountries = DATA.greetingCountries || [];
  var introQuestions = DATA.introQuestions || [];
  var TEACHER_NAME = "Tisha";


  /* ---------------------------
     Helpers
  ----------------------------*/
  function $(id) { return document.getElementById(id); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" })[c];
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

  /* ---------------------------
     Score
  ----------------------------*/
  var score = 0;
  var SCORE_KEY = "seT_intro_score_v1";

  function loadScore() {
    try {
      var v = localStorage.getItem(SCORE_KEY);
      if (v !== null) score = parseInt(v, 10) || 0;
    } catch (e) {}
    renderScore();
  }
  function saveScore() {
    try { localStorage.setItem(SCORE_KEY, String(score)); } catch (e) {}
  }
  function addPoints(n) {
    score += n;
    if (score < 0) score = 0;
    renderScore();
    saveScore();
  }
  function renderScore() {
    if ($("scoreTop")) $("scoreTop").textContent = String(score);
    if ($("scoreBottom")) $("scoreBottom").textContent = String(score);
  }

  /* ---------------------------
     Speech (US/UK)
  ----------------------------*/
  var accent = "US"; // default
  var voices = [];
  var voiceUS = null;
  var voiceUK = null;

  function pickVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    voiceUS = null;
    voiceUK = null;

    // Prefer clear en-US / en-GB voices
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      if (!voiceUS && v.lang && v.lang.indexOf("en-US") === 0) voiceUS = v;
      if (!voiceUK && v.lang && v.lang.indexOf("en-GB") === 0) voiceUK = v;
    }
    // Fallback: any English
    if (!voiceUS || !voiceUK) {
      for (var j = 0; j < voices.length; j++) {
        var vv = voices[j];
        if (!voiceUS && vv.lang && vv.lang.indexOf("en") === 0) voiceUS = vv;
        if (!voiceUK && vv.lang && vv.lang.indexOf("en") === 0) voiceUK = vv;
      }
    }
  }

  function stopSpeak() {
    if (!window.speechSynthesis) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    stopSpeak();
    var u = new SpeechSynthesisUtterance(String(text));
    var v = (accent === "UK") ? voiceUK : voiceUS;
    if (v) u.voice = v;
    u.rate = 0.98;
    u.pitch = 1.0;
    u.onend = function () {};
    try { window.speechSynthesis.speak(u); } catch (e) {}
  }

  function setAccent(next) {
    accent = next;
    try { localStorage.setItem("seT_intro_accent_v1", accent); } catch (e) {}
    var usBtn = $("accentUS");
    var ukBtn = $("accentUK");
    if (usBtn && ukBtn) {
      if (accent === "US") {
        usBtn.classList.add("is-active"); ukBtn.classList.remove("is-active");
        usBtn.setAttribute("aria-pressed", "true"); ukBtn.setAttribute("aria-pressed", "false");
      } else {
        ukBtn.classList.add("is-active"); usBtn.classList.remove("is-active");
        ukBtn.setAttribute("aria-pressed", "true"); usBtn.setAttribute("aria-pressed", "false");
      }
    }
  }

  function loadAccent() {
    try {
      var v = localStorage.getItem("seT_intro_accent_v1");
      if (v === "US" || v === "UK") accent = v;
    } catch (e) {}
    setAccent(accent);
  }

  /* ---------------------------
     Reveal animations
  ----------------------------*/
  function initReveal() {
    var els = $all(".reveal");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("reveal--in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("reveal--in");
        }
      });
    }, { threshold: 0.12 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ---------------------------
     Fill "About me" + Objectives + Method
  ----------------------------*/
  function fillAboutAndMethod() {
    // Slide 3 for About Me
    var s3 = slides[2] ? slides[2].lines : [];
    var aboutLines = [];
    for (var i = 0; i < s3.length; i++) {
      if (s3[i] === "👩‍🏫 About Me –") continue;
      if (s3[i] === "💬") continue;
      aboutLines.push(s3[i]);
    }
    if ($("aboutStory")) {
      var story = esc(aboutLines.join(" ")).replace(/\s{2,}/g, " ");
      $("aboutStory").innerHTML = "<p><strong>Welcome, <span data-bind=\"userName\">there</span>!</strong></p>" +
        "<p>" + story + "</p>";
      updateNameBindings();
    }

    // Slide 4 objectives
    var s4 = slides[3] ? slides[3].lines : [];
    // Keep the objective lines after the title
    var obj = [];
    for (var j = 0; j < s4.length; j++) {
      if (s4[j].indexOf("A WARM WELCOME") === 0) continue;
      obj.push(s4[j]);
    }
    var ul = $("objectivesList");
    if (ul) {
      ul.innerHTML = "";
      for (var k = 0; k < obj.length; k++) {
        var li = document.createElement("li");
        li.innerHTML =
          '<input type="checkbox" class="objBox" data-pts="1" aria-label="objective checkbox">' +
          '<div><div style="font-weight:900">' + esc(obj[k]) + '</div></div>';
        ul.appendChild(li);
      }
    }

    // Slide 5 method content
    var s5 = slides[4] ? slides[4].lines : [];
    var methodTitle = s5[0] || "METHOD: ENGLISH WITH TISHA";
    var methodPhilosophy = s5[1] || "";
    var learningStyles = s5[2] || "";
    var materials = s5[3] || "";
    var practice = s5[4] || "";

    if ($("methodCards")) {
      $("methodCards").innerHTML =
        cardHTML("💡 Philosophy", methodPhilosophy, true) +
        cardHTML("🧰 Materials", materials, false) +
        cardHTML("🎭 Practice", practice, false);
    }

    if ($("learningStyles")) {
      $("learningStyles").innerHTML = "<p>" + esc(learningStyles) + "</p>";
    }
  }

  function cardHTML(title, body, hasListen) {
    var listenBtn = hasListen ? '<button class="btn btn--ghost" data-say-plain="' + esc(body) + '" type="button">🔊 Listen</button>' : '';
    return (
      '<article class="card reveal">' +
        '<div class="card__head"><h3>' + esc(title) + '</h3><div class="card__actions">' + listenBtn + '</div></div>' +
        '<div class="card__body"><p class="muted" style="margin:0; line-height:1.55">' + esc(body) + '</p></div>' +
      '</article>'
    );
  }

  /* ---------------------------
     Checklist points
  ----------------------------*/
  function initChecklistPoints() {
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.classList && t.classList.contains("objBox")) {
        var pts = parseInt(t.getAttribute("data-pts"), 10) || 0;
        if (t.checked) addPoints(pts);
        else addPoints(-pts);
      }
    });

    var btnAll = $("btnObjAll");
    if (btnAll) {
      btnAll.addEventListener("click", function () {
        var boxes = $all(".objBox");
        for (var i = 0; i < boxes.length; i++) {
          if (!boxes[i].checked) {
            boxes[i].checked = true;
            addPoints(parseInt(boxes[i].getAttribute("data-pts"), 10) || 0);
          }
        }
      });
    }
  }

  /* ---------------------------
     Learning style picks
  ----------------------------*/
  function initLearningStylePicks() {
    var wrap = $("learningPick");
    if (!wrap) return;
    wrap.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest(".pillBtn") : null;
      if (!btn) return;
      if (btn.classList.contains("is-on")) {
        btn.classList.remove("is-on");
        addPoints(-1);
      } else {
        btn.classList.add("is-on");
        addPoints(1);
      }
    });
  }

  /* ---------------------------
     Flashcards
  ----------------------------*/
  function renderVocabFlashcards() {
    var host = $("vocabFlashcards");
    if (!host) return;
    host.innerHTML = "";

    for (var i = 0; i < keyVocab.length; i++) {
      (function (item) {
        var card = document.createElement("div");
        card.className = "flash";
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Flashcard " + item.term);

                card.innerHTML =
          '<div class="flash__actions">' +
            '<button class="iconBtn" type="button" aria-label="Listen">🔊</button>' +
          '</div>' +
          '<div class="flash__inner">' +
            '<div class="flash__side flash__front">' +
              '<div class="flash__icon">' + esc(item.icon || "💬") + '</div>' +
              '<div class="flash__term">' + esc(item.term) + '</div>' +
              '<div class="muted small">Tap to flip</div>' +
            '</div>' +
            '<div class="flash__side flash__back">' +
              '<div class="flash__term">' + esc(item.term) + '</div>' +
              '<div class="muted">Say it clearly.</div>' +
            '</div>' +
          '</div>';

// flip handler (ignore icon button)
        card.addEventListener("click", function (e) {
          if (e && e.target) {
            if (e.target.closest && e.target.closest(".iconBtn")) return;
            if (e.target.classList && e.target.classList.contains("iconBtn")) return;
          }
          card.classList.toggle("is-flipped");
          addPoints(0); // no points for flipping
        });

        // keyboard
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            card.classList.toggle("is-flipped");
          }
        });

        // speak
        var speakBtn = card.querySelector(".iconBtn");
        if (speakBtn) {
          speakBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            speak(item.term);
            addPoints(1);
          });
        }

        host.appendChild(card);
      })(keyVocab[i]);
    }
  }

  function initVocabButtons() {
    var sh = $("btnVocabShuffle");
    if (sh) {
      sh.addEventListener("click", function () {
        keyVocab = shuffle(keyVocab);
        renderVocabFlashcards();
      });
    }
    var speakAll = $("btnVocabSpeakAll");
    if (speakAll) {
      speakAll.addEventListener("click", function () {
        var i = 0;
        function next() {
          if (i >= keyVocab.length) return;
          speak(keyVocab[i].term);
          addPoints(1);
          i++;
          setTimeout(next, 800);
        }
        next();
      });
    }
  }

  /* ---------------------------
     Survival sentences list + matching
  ----------------------------*/
  var showFrench = false;
  function renderSurvivalList() {
    var host = $("survivalList");
    if (!host) return;
    host.innerHTML = "";
    for (var i = 0; i < survival.length; i++) {
      var it = survival[i];
      var row = document.createElement("div");
      row.className = "survivalItem";
      row.innerHTML =
        '<div class="survivalItem__left">' +
          '<div class="survivalItem__icon">' + esc(it.icon || "💬") + '</div>' +
          '<div>' +
            '<div class="survivalItem__en">' + esc(it.en) + '</div>' +
            '<div class="survivalItem__fr' + (showFrench ? "" : " is-hidden") + '">' + esc(it.fr) + '</div>' +
          '</div>' +
        '</div>' +
        '<div><button class="iconBtn" type="button" aria-label="Listen">🔊</button></div>';
      (function (enText, btn) {
        btn.addEventListener("click", function () {
          speak(enText);
          addPoints(1);
        });
      })(it.en, row.querySelector(".iconBtn"));
      host.appendChild(row);
    }
  }

  // Matching game state
  var matchState = {
    left: [],
    right: [],
    leftPicked: null,
    hintUsed: false,
    solved: 0
  };

  function renderSurvivalMatch() {
    var host = $("survivalMatch");
    if (!host) return;

    var left = shuffle(survival.map(function (s) { return s.en; }));
    var right = shuffle(survival.map(function (s) { return s.fr; }));
    matchState.left = left;
    matchState.right = right;
    matchState.leftPicked = null;
    matchState.hintUsed = false;
    matchState.solved = 0;

    host.innerHTML =
      '<div class="matchCol" id="matchLeft"></div>' +
      '<div class="matchCol" id="matchRight"></div>';

    var leftCol = $("matchLeft");
    var rightCol = $("matchRight");

    for (var i = 0; i < left.length; i++) {
      leftCol.appendChild(makeTile(left[i], "L"));
    }
    for (var j = 0; j < right.length; j++) {
      rightCol.appendChild(makeTile(right[j], "R"));
    }

    setText("survivalStatus", "Pick one English sentence, then its French meaning.");
  }

  function makeTile(text, side) {
    var div = document.createElement("div");
    div.className = "tile";
    div.setAttribute("data-side", side);
    div.setAttribute("data-text", text);
    div.setAttribute("tabindex", "0");
    div.textContent = text;

    div.addEventListener("click", function () {
      tilePick(div);
    });

    div.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tilePick(div);
      }
    });

    return div;
  }

  function tilePick(tile) {
    if (tile.classList.contains("is-correct")) return;

    var side = tile.getAttribute("data-side");
    if (side === "L") {
      clearTiles("L");
      tile.classList.add("is-picked");
      matchState.leftPicked = tile;
      speak(tile.getAttribute("data-text"));
    } else {
      // right picked
      if (!matchState.leftPicked) {
        setText("survivalStatus", "First pick an English sentence on the left.");
        return;
      }
      clearTiles("R");
      tile.classList.add("is-picked");
      var leftText = matchState.leftPicked.getAttribute("data-text");
      var rightText = tile.getAttribute("data-text");

      var correct = false;
      for (var i = 0; i < survival.length; i++) {
        if (survival[i].en === leftText && survival[i].fr === rightText) {
          correct = true; break;
        }
      }

      if (correct) {
        matchState.leftPicked.classList.remove("is-picked");
        tile.classList.remove("is-picked");

        matchState.leftPicked.classList.add("is-correct");
        tile.classList.add("is-correct");

        matchState.solved++;
        addPoints(2);
        setText("survivalStatus", "✅ Correct! (" + matchState.solved + "/" + survival.length + ")");
        matchState.leftPicked = null;

        if (matchState.solved >= survival.length) {
          setText("survivalStatus", "🎉 All matched! Great job.");
          addPoints(matchState.hintUsed ? 2 : 4);
        }
      } else {
        tile.classList.add("is-wrong");
        matchState.leftPicked.classList.add("is-wrong");
        setTimeout(function () {
          tile.classList.remove("is-wrong");
          matchState.leftPicked.classList.remove("is-wrong");
          clearTiles("R");
        }, 600);
        addPoints(0);
        setText("survivalStatus", "❌ Not quite. Try again.");
      }
    }
  }

  function clearTiles(side) {
    var tiles = $all('.tile[data-side="' + side + '"]', $("survivalMatch"));
    for (var i = 0; i < tiles.length; i++) tiles[i].classList.remove("is-picked");
  }

  function setText(id, txt) {
    var el = $(id);
    if (el) el.textContent = txt;
  }

  function initSurvivalButtons() {
    var toggle = $("btnSurvivalToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        showFrench = !showFrench;
        toggle.setAttribute("aria-pressed", showFrench ? "true" : "false");
        toggle.textContent = showFrench ? "Hide French" : "Show French";
        renderSurvivalList();
      });
    }
    var speakAll = $("btnSurvivalSpeakAll");
    if (speakAll) {
      speakAll.addEventListener("click", function () {
        var i = 0;
        function next() {
          if (i >= survival.length) return;
          speak(survival[i].en);
          addPoints(1);
          i++;
          setTimeout(next, 900);
        }
        next();
      });
    }
    var hint = $("btnSurvivalHint");
    if (hint) {
      hint.addEventListener("click", function () {
        if (matchState.hintUsed) return;
        matchState.hintUsed = true;
        // highlight a correct pair briefly
        var random = survival[Math.floor(Math.random() * survival.length)];
        var leftTiles = $all('.tile[data-side="L"]', $("survivalMatch"));
        var rightTiles = $all('.tile[data-side="R"]', $("survivalMatch"));
        for (var i = 0; i < leftTiles.length; i++) {
          if (leftTiles[i].getAttribute("data-text") === random.en) leftTiles[i].classList.add("is-picked");
        }
        for (var j = 0; j < rightTiles.length; j++) {
          if (rightTiles[j].getAttribute("data-text") === random.fr) rightTiles[j].classList.add("is-picked");
        }
        setTimeout(function () {
          clearTiles("L"); clearTiles("R");
        }, 900);
        setText("survivalStatus", "💡 Hint shown (one correct match).");
        addPoints(0);
      });
    }
    var reset = $("btnSurvivalReset");
    if (reset) reset.addEventListener("click", function () { renderSurvivalMatch(); });
  }

  /* ---------------------------
     Prompts list
  ----------------------------*/
  function renderPrompts() {
    var host = $("promptList");
    if (!host) return;
    host.innerHTML = "";

    for (var i = 0; i < introQuestions.length; i++) {
      var q = introQuestions[i];
      var isHeading = (q.indexOf("?") === -1 && q.indexOf("💬") === -1 && q.length < 28);
      var div = document.createElement("div");
      div.className = "prompt";
      if (isHeading) {
        div.innerHTML = '<div class="prompt__q">' + esc(q) + '</div><div class="muted small">Answer the next questions below.</div>';
      } else {
        div.innerHTML =
          '<div class="prompt__q">' + esc(q) + '</div>' +
          '<textarea placeholder="Type your answer…"></textarea>' +
          '<div class="prompt__row">' +
            '<button class="btn btn--ghost pSpeak" type="button">🔊 Speak my answer</button>' +
            '<button class="btn btn--ghost pClear" type="button">Clear</button>' +
          '</div>';
      }
      host.appendChild(div);
    }

    host.addEventListener("click", function (e) {
      var btn = e.target;
      if (!btn) return;
      var card = btn.closest ? btn.closest(".prompt") : null;
      if (!card) return;
      var ta = card.querySelector("textarea");
      if (btn.classList.contains("pSpeak")) {
        var txt = ta ? ta.value.trim() : "";
        if (!txt) txt = card.querySelector(".prompt__q") ? card.querySelector(".prompt__q").textContent : "";
        speak(txt);
        addPoints(1);
      }
      if (btn.classList.contains("pClear")) {
        if (ta) ta.value = "";
      }
    });
  }

  function initPromptButtons() {
    var sh = $("btnPromptsShuffle");
    if (sh) {
      sh.addEventListener("click", function () {
        introQuestions = shuffle(introQuestions);
        renderPrompts();
      });
    }
  }

  /* ---------------------------
     Self-intro builder
  ----------------------------*/
  function getNeedPhrase() {
    var sel = val("fNeed") || "";
    var other = val("fNeedOther") || "";
    var need = sel === "other" ? other : sel;
    need = (need || "").trim().replace(/^for\s+/i, "");
    if (!need) return "my daily life";
    return need;
  }

  function cleanGoalPhrase(raw) {
    var g = (raw || "").trim();
    g = g.replace(/^to\s+/i, "");
    g = g.replace(/^i\s+want\s+to\s+/i, "");
    g = g.replace(/^i\s+want\s+/i, "");
    g = g.replace(/^i\s+would\s+like\s+to\s+/i, "");
    return g.trim();
  }

  function getGoalPhrase() {
    var sel = val("fGoal") || "";
    var other = val("fGoalOther") || "";
    var g = sel === "other" ? other : sel;
    g = cleanGoalPhrase(g);
    if (!g) return "feel more comfortable speaking in English";
    return g;
  }

  function buildIntroText() {
    var name = (val("fName") || val("learnerName") || "").trim();
    name = name ? name.split(/\s+/)[0] : TEACHER_NAME;

    var from = val("fFrom") || "France";
    var live = val("fLive") || "France";

    var job = (val("fJob") || "work").trim().replace(/^i\s+/i, "");
    var hobby = (val("fHobby") || "spend time with friends").trim().replace(/^to\s+/i, "").replace(/^i\s+/i, "");
    var travel = (val("fTravel") || "travelling").trim().replace(/^i\s+/i, "");
    var feel = (val("fFeel") || "motivated").trim().replace(/\.$/, "");

    var s = [];
    s.push("Hello, my name is " + name + ".");
    s.push("I’m from " + from + ", and I live in " + live + ".");
    s.push("I " + job.replace(/\.$/, "") + ".");
    s.push("English is important for me because I need it for " + getNeedPhrase() + ".");
    s.push("In my free time, I enjoy " + hobby.replace(/\.$/, "") + ".");
    s.push("I also like " + travel.replace(/\.$/, "") + ".");
    s.push("Today, I feel " + feel + ".");
    s.push("My goal for this course is to " + getGoalPhrase() + ".");
    s.push("Nice to meet you!");
    return s.join(" ");
  }

  function val(id) {
    var el = $(id);
    return el ? el.value.trim() : "";
  }

  function getUserName() {
    var ln = val("learnerName");
    var fn = val("fName");
    var name = (ln || fn || "").trim();
    if (!name) return "";
    return name.split(/\s+/)[0];
  }

  function updateNameBindings() {
    var display = getUserName() || "there";
    var nodes = document.querySelectorAll('[data-bind="userName"]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = display;
    }
  }

  function initIntroBuilder() {
    // Show/hide “other” fields for guided inputs
    var needSel = $("fNeed");
    var needWrap = $("fNeedOtherWrap");
    function toggleNeedOther() {
      if (!needWrap) return;
      needWrap.style.display = (needSel && needSel.value === "other") ? "block" : "none";
    }
    if (needSel) { needSel.addEventListener("change", toggleNeedOther); }
    toggleNeedOther();

    var goalSel = $("fGoal");
    var goalWrap = $("fGoalOtherWrap");
    function toggleGoalOther() {
      if (!goalWrap) return;
      goalWrap.style.display = (goalSel && goalSel.value === "other") ? "block" : "none";
    }
    if (goalSel) { goalSel.addEventListener("change", toggleGoalOther); }
    toggleGoalOther();

    var nameField = $("fName");
    if (nameField) { nameField.addEventListener("input", updateNameBindings); }
    var btn = $("btnBuildIntro");
    if (btn) {
      btn.addEventListener("click", function () {
        var txt = buildIntroText();
        setHTML("introOutput", "<strong>Your paragraph:</strong><br>" + esc(txt));
        addPoints(4);
      });
    }
    var speakBtn = $("btnSpeakIntro");
    if (speakBtn) {
      speakBtn.addEventListener("click", function () {
        var out = $("introOutput");
        var plain = out ? out.textContent : "";
        if (!plain || plain.indexOf("Your paragraph") !== -1) plain = buildIntroText();
        speak(plain);
        addPoints(2);
      });
    }
    var copyBtn = $("btnCopyIntro");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var out = $("introOutput");
        var plain = out ? out.textContent.replace("Your paragraph:", "").trim() : "";
        if (!plain) plain = buildIntroText();
        copyText(plain);
        addPoints(2);
      });
    }
    var resetBtn = $("btnIntroReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        var ids = ["fName","fFrom","fLive","fJob","fNeed","fNeedOther","fHobby","fTravel","fFeel","fGoal","fGoalOther"];
        for (var i = 0; i < ids.length; i++) { var el = $(ids[i]); if (el) el.value = ""; }
        setHTML("introOutput", "");
      });
    }
    var example = $("btnIntroExample");
    if (example) {
      example.addEventListener("click", function () {
        $("fName").value = $("learnerName") && $("learnerName").value.trim() ? $("learnerName").value.split(" ")[0] : TEACHER_NAME;
        $("fFrom").value = "France";
        $("fLive").value = "Nantes";
        $("fJob").value = "work in hospitality";
        $("fNeed").value = "emails";
        if ($("fNeedOther")) $("fNeedOther").value = "";
        $("fHobby").value = "sports and music";
        $("fTravel").value = "travelling with family";
        $("fFeel").value = "happy and curious";
        $("fGoal").value = "feel comfortable speaking in English";
        if ($("fGoalOther")) $("fGoalOther").value = "";
      });
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function setHTML(id, html) {
    var el = $(id);
    if (el) el.innerHTML = html;
  }

  /* ---------------------------
     Greetings practice
  ----------------------------*/
  var greetRounds = [
    { icon: "🌅", label: "Morning", answer: "Good morning" },
    { icon: "🌞", label: "Afternoon", answer: "Good afternoon" },
    { icon: "🌙", label: "Evening", answer: "Good evening" }
  ];
  var greetChoices = ["Good morning", "Good afternoon", "Good evening", "Goodbye", "Hello", "Hi"];

  var greetCurrent = null;

  function newGreetingRound() {
    greetCurrent = greetRounds[Math.floor(Math.random() * greetRounds.length)];
    if ($("greetPrompt")) $("greetPrompt").textContent = greetCurrent.icon + " " + greetCurrent.label + " — what do you say?";
    var host = $("greetChoices");
    if (!host) return;
    host.innerHTML = "";
    var opts = shuffle(greetChoices).slice(0, 4);
    if (opts.indexOf(greetCurrent.answer) === -1) opts[0] = greetCurrent.answer;
    opts = shuffle(opts);

    for (var i = 0; i < opts.length; i++) {
      var b = document.createElement("button");
      b.className = "choiceBtn";
      b.type = "button";
      b.textContent = opts[i];
      (function (choice, btn) {
        btn.addEventListener("click", function () {
          if (choice === greetCurrent.answer) {
            btn.classList.add("is-correct");
            setStatus("greetStatus", "✅ Correct!", true);
            addPoints(2);
            speak(choice);
          } else {
            btn.classList.add("is-wrong");
            setStatus("greetStatus", "❌ Try again. (Hint available)", false);
            addPoints(0);
          }
        });
      })(opts[i], b);
      host.appendChild(b);
    }
    setStatus("greetStatus", "", true);
  }

  function setStatus(id, msg, ok) {
    var el = $(id);
    if (!el) return;
    el.textContent = msg;
    el.className = "status " + (ok ? "" : "");
    if (msg) el.classList.add(ok ? "ok" : "bad");
  }

  function initGreetingPractice() {
    var newBtn = $("btnGreetingNew");
    if (newBtn) newBtn.addEventListener("click", newGreetingRound);
    var hint = $("btnGreetingHint");
    if (hint) {
      hint.addEventListener("click", function () {
        if (!greetCurrent) return;
        setStatus("greetStatus", "💡 Hint: Start with “Good …”", true);
      });
    }
    newGreetingRound();
  }

  /* ---------------------------
     Country explorer + cultural reminder
  ----------------------------*/
  function renderCountrySelect() {
    var sel = $("countrySelect");
    if (!sel) return;
    sel.innerHTML = "";
    for (var i = 0; i < greetingCountries.length; i++) {
      var c = greetingCountries[i];
      var opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = c.country;
      sel.appendChild(opt);
    }
    sel.addEventListener("change", renderCountryBox);
    renderCountryBox();
  }

  function renderCountryBox() {
    var sel = $("countrySelect");
    var idx = sel ? parseInt(sel.value, 10) : 0;
    if (isNaN(idx) || idx < 0) idx = 0;
    var c = greetingCountries[idx] || greetingCountries[0];
    if (!c) return;

    var box = $("countryBox");
    if (box) {
      box.innerHTML =
        '<div class="countryRow">' +
          '<div class="label">🗣️ Formal / everyday</div><div class="val">' + esc(c.formal || "—") + '</div>' +
          '<div class="label">😎 Slang / informal</div><div class="val">' + esc(c.slang || "—") + '</div>' +
          (c.notes ? ('<div class="label">💡 Notes</div><div class="muted">' + esc(c.notes) + '</div>') : "") +
        '</div>';
    }

    // Slide 15 cultural reminder
    var s15 = slides[14] ? slides[14].lines : [];
    var reminderLines = [];
    for (var i = 0; i < s15.length; i++) {
      if (s15[i].indexOf("💡") === 0) continue;
      reminderLines.push("• " + s15[i]);
    }
    var call = $("culturalReminder");
    if (call) call.innerHTML = "<strong>💡 Cultural reminder</strong><br>" + esc(reminderLines.join("\n")).replace(/\n/g, "<br>");
  }

  function initCountrySpeak() {
    var btn = $("btnCountrySpeak");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var sel = $("countrySelect");
      var idx = sel ? parseInt(sel.value, 10) : 0;
      var c = greetingCountries[idx] || greetingCountries[0];
      if (!c) return;
      var txt = (c.country + ". Formal: " + (c.formal || "") + ". Informal: " + (c.slang || "") + ". " + (c.notes || "")).replace(/\s+/g, " ");
      speak(txt);
      addPoints(2);
    });
  }

  /* ---------------------------
     Addressing people (slide 17)
  ----------------------------*/
  var addressRows = [];
  function parseAddressRows() {
    var s17 = slides[16] ? slides[16].lines : [];
    // lines: [title, Situation, Title, Example, Register, ...]
    var start = 5;
    for (var i = start; i < s17.length; ) {
      var situation = s17[i] || "";
      var title = s17[i + 1] || "";
      var example = s17[i + 2] || "";
      var register = s17[i + 3] || "";
      if (situation && title && example) {
        addressRows.push({ situation: situation, title: title, example: example, register: register });
      }
      i += 4;
    }
  }

  var addressCurrent = null;

  function renderAddressTable() {
    var host = $("addressTable");
    if (!host) return;
    var html = '<table><thead><tr><th>Situation</th><th>Title</th><th>Example</th><th>Register</th></tr></thead><tbody>';
    for (var i = 0; i < addressRows.length; i++) {
      var r = addressRows[i];
      html += "<tr><td>" + esc(r.situation) + "</td><td>" + esc(r.title) + "</td><td>" + esc(r.example) + "</td><td>" + esc(r.register || "—") + "</td></tr>";
    }
    html += "</tbody></table>";
    host.innerHTML = html;
  }

  function newAddressRound() {
    if (!addressRows.length) return;
    addressCurrent = addressRows[Math.floor(Math.random() * addressRows.length)];
    if ($("addressPrompt")) $("addressPrompt").textContent = "Situation: " + addressCurrent.situation + " — what do you use?";
    var choices = shuffle(addressRows.map(function (r) { return r.title; }));
    choices = unique(choices).slice(0, 4);
    if (choices.indexOf(addressCurrent.title) === -1) choices[0] = addressCurrent.title;
    choices = shuffle(choices);

    var host = $("addressChoices");
    if (!host) return;
    host.innerHTML = "";
    for (var i = 0; i < choices.length; i++) {
      var b = document.createElement("button");
      b.className = "choiceBtn";
      b.type = "button";
      b.textContent = choices[i];
      (function (choice, btn) {
        btn.addEventListener("click", function () {
          if (!addressCurrent) return;
          if (choice === addressCurrent.title) {
            btn.classList.add("is-correct");
            setStatus("addressStatus", "✅ Correct: " + addressCurrent.example, true);
            speak(addressCurrent.example);
            addPoints(3);
          } else {
            btn.classList.add("is-wrong");
            setStatus("addressStatus", "❌ Try again.", false);
            addPoints(0);
          }
        });
      })(choices[i], b);
      host.appendChild(b);
    }
    setStatus("addressStatus", "", true);
  }

  function unique(arr) {
    var seen = {};
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var k = arr[i];
      if (!seen[k]) { seen[k] = true; out.push(k); }
    }
    return out;
  }

  function initAddressing() {
    parseAddressRows();
    renderAddressTable();
    var btn = $("btnAddressNew");
    if (btn) btn.addEventListener("click", newAddressRound);
    newAddressRound();
  }

  /* ---------------------------
     Context introductions (slide 18)
  ----------------------------*/
  var contextExamples = {
    hotel: [
      "Hello, my name is Tisha.",
      "I have a reservation for two nights."
    ],
    email: [
      "Hello, my name is Tisha.",
      "I am writing to confirm my reservation."
    ],
    conference: [
      "Hello, my name is Tisha.",
      "Nice to meet you."
    ],
    street: [
      "Hi, excuse me!",
      "Can you help me, please?"
    ]
  };

  function renderContextExample() {
    var sel = $("contextSelect");
    var key = sel ? sel.value : "hotel";
    var ex = contextExamples[key] || contextExamples.hotel;
    var html = "<strong>Example:</strong><br>" + esc(ex.join(" "));

    // include original slide 18 lines for full fidelity
    var s18 = slides[17] ? slides[17].lines : [];
    var lines = [];
    for (var i = 0; i < s18.length; i++) {
      if (s18[i].indexOf("INTRODUCING") === 0) continue;
      lines.push("• " + s18[i]);
    }
    html += "<hr class='hr'><div class='muted small'><strong>From the lesson:</strong><br>" + esc(lines.join("\n")).replace(/\n/g, "<br>") + "</div>";

    setHTML("contextOutput", html);
  }

  function initContextIntro() {
    var sel = $("contextSelect");
    if (sel) sel.addEventListener("change", renderContextExample);
    renderContextExample();

    var build = $("btnContextBuild");
    if (build) {
      build.addEventListener("click", function () {
        var ex = contextExamples[sel.value] || contextExamples.hotel;
        var made = ex.join(" ").replace(/\bTisha\b/g, TEACHER_NAME);
        setHTML("contextOutput", "<strong>Your version:</strong><br>" + esc(made));
        addPoints(3);
      });
    }

    var copy = $("btnContextCopy");
    if (copy) {
      copy.addEventListener("click", function () {
        var out = $("contextOutput");
        var plain = out ? out.textContent.replace("Your version:", "").replace("Example:", "").trim() : "";
        if (!plain) plain = (contextExamples[sel.value] || contextExamples.hotel).join(" ");
        copyText(plain);
        addPoints(1);
      });
    }

    var speakBtn = $("btnContextSpeak");
    if (speakBtn) {
      speakBtn.addEventListener("click", function () {
        var out = $("contextOutput");
        var plain = out ? out.textContent.replace(/\s+/g, " ").trim() : "";
        if (!plain) plain = (contextExamples[sel.value] || contextExamples.hotel).join(" ");
        speak(plain);
        addPoints(1);
      });
    }
  }


  /* ---------------------------
     Travel & holidays mini-story (slide 9)
  ----------------------------*/
  var travelData = {
    transport: [
      { icon: "🛫", label: "Plane", sentence: "I travel by plane." },
      { icon: "🚆", label: "Train", sentence: "I travel by train." },
      { icon: "🚗", label: "Car", sentence: "I travel by car." }
    ],
    company: [
      { icon: "🧳👩‍🦰", label: "Alone", sentence: "I travel alone." },
      { icon: "🧳👫", label: "With friends", sentence: "I travel with friends." },
      { icon: "🧳👨‍👩‍👧‍👦", label: "With family", sentence: "I travel with my family." },
      { icon: "🧳💑", label: "With my husband", sentence: "I travel with my husband." }
    ],
    prompts: [
      "Do you like to travel?",
      "Have you travelled by plane before?",
      "Do you prefer travelling alone or with family/friends?",
      "Do you speak English when you travel?"
    ]
  };

  var travelPick = { transport: null, company: null };

  function renderTravelButtons() {
    var hostT = $("travelTransport");
    var hostC = $("travelCompany");
    if (!hostT || !hostC) return;

    hostT.innerHTML = "";
    hostC.innerHTML = "";

    for (var i = 0; i < travelData.transport.length; i++) {
      hostT.appendChild(makeTravelBtn(travelData.transport[i], "transport"));
    }
    for (var j = 0; j < travelData.company.length; j++) {
      hostC.appendChild(makeTravelBtn(travelData.company[j], "company"));
    }
  }

  function makeTravelBtn(item, kind) {
    var b = document.createElement("button");
    b.className = "pillBtn";
    b.type = "button";
    b.setAttribute("data-kind", kind);
    b.setAttribute("data-sentence", item.sentence);
    b.textContent = item.icon + " " + item.label;
    b.addEventListener("click", function () {
      var group = kind;
      // turn off others in group
      var host = (group === "transport") ? $("travelTransport") : $("travelCompany");
      var btns = $all(".pillBtn", host);
      for (var k = 0; k < btns.length; k++) btns[k].classList.remove("is-on");
      b.classList.add("is-on");

      travelPick[group] = item;
      addPoints(1);
    });
    return b;
  }

  function buildTravelStoryText() {
    var name = TEACHER_NAME;
    var t = travelPick.transport ? travelPick.transport.sentence : "I travel in different ways.";
    var c = travelPick.company ? travelPick.company.sentence : "Sometimes I travel with other people.";
    var extra = "I love travelling and discovering new cultures.";
    var questions = travelData.prompts.map(function (p) { return p; }).join(" ");
    return "Hi, I'm " + name + ". " + t + " " + c + " " + extra + " " + questions;
  }

  function initTravelStory() {
    renderTravelButtons();

    var build = $("btnTravelBuild");
    if (build) {
      build.addEventListener("click", function () {
        var txt = buildTravelStoryText();
        setHTML("travelOutput", "<strong>Your travel mini‑story:</strong><br>" + esc(txt));
        addPoints(3);
      });
    }
    var sp = $("btnTravelSpeak");
    if (sp) {
      sp.addEventListener("click", function () {
        var out = $("travelOutput");
        var txt = out ? out.textContent.replace("Your travel mini‑story:", "").trim() : buildTravelStoryText();
        speak(txt);
        addPoints(2);
      });
    }
    var cp = $("btnTravelCopy");
    if (cp) {
      cp.addEventListener("click", function () {
        var out = $("travelOutput");
        var txt = out ? out.textContent.replace("Your travel mini‑story:", "").trim() : buildTravelStoryText();
        copyText(txt);
        addPoints(1);
      });
    }
    var nw = $("btnTravelNew");
    if (nw) {
      nw.addEventListener("click", function () {
        travelPick.transport = null;
        travelPick.company = null;
        var tbtn = $all("#travelTransport .pillBtn");
        var cbtn = $all("#travelCompany .pillBtn");
        for (var i = 0; i < tbtn.length; i++) tbtn[i].classList.remove("is-on");
        for (var j = 0; j < cbtn.length; j++) cbtn[j].classList.remove("is-on");
        setHTML("travelOutput", "");
        addPoints(0);
      });
    }
  }

  /* ---------------------------
     Saying goodbye practice (slide 19)
  ----------------------------*/
  var byeRounds = [
    { situation: "At work / polite", answer: "Goodbye", choices: ["Goodbye", "See ya", "What’s up?", "Hi"] },
    { situation: "At work / polite", answer: "Have a nice day / evening!", choices: ["Have a nice day / evening!", "See you later", "Hiya!", "Alright, mate?"] },
    { situation: "On the phone / leaving class", answer: "Talk to you soon", choices: ["Talk to you soon", "Good morning", "Catch you later", "What’s the craic?"] },
    { situation: "Very casual", answer: "See you later / See ya / Catch you later", choices: ["See you later / See ya / Catch you later", "Good evening", "Goodbye", "Hello"] }
  ];
  var byeCurrent = null;

  function newByeRound() {
    byeCurrent = byeRounds[Math.floor(Math.random() * byeRounds.length)];
    if ($("byePrompt")) $("byePrompt").textContent = "Situation: " + byeCurrent.situation + " — choose the best goodbye.";
    var host = $("byeChoices");
    if (!host) return;
    host.innerHTML = "";
    var opts = shuffle(byeCurrent.choices);
    for (var i = 0; i < opts.length; i++) {
      var b = document.createElement("button");
      b.className = "choiceBtn";
      b.type = "button";
      b.textContent = opts[i];
      (function (choice, btn) {
        btn.addEventListener("click", function () {
          if (choice === byeCurrent.answer) {
            btn.classList.add("is-correct");
            setStatus("byeStatus", "✅ Correct!", true);
            speak(choice);
            addPoints(2);
          } else {
            btn.classList.add("is-wrong");
            setStatus("byeStatus", "❌ Try again. Hint available.", false);
            addPoints(0);
          }
        });
      })(opts[i], b);
      host.appendChild(b);
    }
    setStatus("byeStatus", "", true);
  }

  function initGoodbyePractice() {
    var nw = $("btnByeNew");
    if (nw) nw.addEventListener("click", newByeRound);
    var hint = $("btnByeHint");
    if (hint) {
      hint.addEventListener("click", function () {
        setStatus("byeStatus", "💡 Hint: workplace = polite; friends = casual.", true);
      });
    }
    newByeRound();
  }

  /* ---------------------------
     Formal vs casual sorting (tap mode)
  ----------------------------*/
  var sortPool = [
    { txt: "Good morning", cat: "formal" },
    { txt: "Good evening", cat: "formal" },
    { txt: "Hello", cat: "formal" },
    { txt: "Goodbye", cat: "formal" },
    { txt: "Hi", cat: "casual" },
    { txt: "Hey", cat: "casual" },
    { txt: "See ya", cat: "casual" },
    { txt: "What’s up?", cat: "casual" }
  ];
  var sortPicked = null;
  var sortPlaced = { formal: [], casual: [] };

  function renderSortPool() {
    var host = $("sortPool");
    if (!host) return;
    host.innerHTML = "";
    var items = shuffle(sortPool.slice());
    for (var i = 0; i < items.length; i++) {
      var b = document.createElement("button");
      b.className = "pillBtn";
      b.type = "button";
      b.textContent = items[i].txt;
      b.setAttribute("data-cat", items[i].cat);
      b.setAttribute("data-txt", items[i].txt);
      b.addEventListener("click", function () {
        // select an expression
        var all = $all("#sortPool .pillBtn");
        for (var k = 0; k < all.length; k++) all[k].classList.remove("is-on");
        this.classList.add("is-on");
        sortPicked = { txt: this.getAttribute("data-txt"), cat: this.getAttribute("data-cat") };
        setText("sortStatus", "Now tap a category box to place it.");
      });
      host.appendChild(b);
    }
  }

  function renderSortBoxes() {
    if ($("sortFormal")) $("sortFormal").innerHTML = "<strong>Formal / neutral</strong><br>" + esc(sortPlaced.formal.join(" · ") || "—");
    if ($("sortCasual")) $("sortCasual").innerHTML = "<strong>Casual / slang</strong><br>" + esc(sortPlaced.casual.join(" · ") || "—");
  }

  function initFormalCasualSort() {
    renderSortPool();
    renderSortBoxes();

    function place(cat) {
      if (!sortPicked) return;
      // prevent duplicates
      if (sortPlaced.formal.indexOf(sortPicked.txt) !== -1 || sortPlaced.casual.indexOf(sortPicked.txt) !== -1) return;
      sortPlaced[cat].push(sortPicked.txt);
      sortPicked = null;
      // clear highlight
      var all = $all("#sortPool .pillBtn");
      for (var k = 0; k < all.length; k++) all[k].classList.remove("is-on");
      renderSortBoxes();
      addPoints(1);
      setText("sortStatus", "Placed!");
    }

    var formalBox = $("sortFormal");
    var casualBox = $("sortCasual");
    if (formalBox) formalBox.addEventListener("click", function () { place("formal"); });
    if (casualBox) casualBox.addEventListener("click", function () { place("casual"); });

    var check = $("btnSortCheck");
    if (check) {
      check.addEventListener("click", function () {
        var ok = true;
        for (var i = 0; i < sortPlaced.formal.length; i++) {
          if (findCat(sortPlaced.formal[i]) !== "formal") ok = false;
        }
        for (var j = 0; j < sortPlaced.casual.length; j++) {
          if (findCat(sortPlaced.casual[j]) !== "casual") ok = false;
        }
        if (ok && (sortPlaced.formal.length + sortPlaced.casual.length) >= 6) {
          setText("sortStatus", "✅ Great sorting!");
          addPoints(4);
        } else {
          setText("sortStatus", "❌ Check again (try placing at least 6 expressions).");
        }
      });
    }

    var rs = $("btnSortReset");
    if (rs) {
      rs.addEventListener("click", function () {
        sortPicked = null;
        sortPlaced = { formal: [], casual: [] };
        renderSortPool();
        renderSortBoxes();
        setText("sortStatus", "");
      });
    }
  }

  function findCat(txt) {
    for (var i = 0; i < sortPool.length; i++) if (sortPool[i].txt === txt) return sortPool[i].cat;
    return "";
  }

  /* ---------------------------
     Diagnostic quiz (mixed)
  ----------------------------*/
  var diag = {
    started: false,
    idx: 0,
    correct: 0,
    total: 0,
    questions: []
  };

  function buildDiagnosticQuestions() {
    var qs = [];

    // Q1: vocab term -> icon
    qs.push({
      type: "mcq",
      prompt: "Which word matches this icon? 🎤",
      choices: keyVocab.map(function (x) { return x.term; }).slice(0, 6),
      answer: "Microphone",
      say: "Microphone"
    });

    // Q2: survival fill
    qs.push({
      type: "fill",
      prompt: "Fill the blank: Please speak ____.",
      answer: "slowly",
      hint: "It’s in the survival sentences.",
      say: "Please speak slowly."
    });

    // Q3: greeting register
    qs.push({
      type: "mcq",
      prompt: "Choose the most formal greeting for a workplace / hotel:",
      choices: ["Hey! What’s up?", "Good morning. How are you?", "See ya!", "Alright, mate?"],
      answer: "Good morning. How are you?",
      say: "Good morning. How are you?"
    });

    // Q4: addressing title
    qs.push({
      type: "mcq",
      prompt: "You don't know a woman’s marital status. Which title is neutral?",
      choices: ["Mrs", "Miss", "Ms", "Madam"],
      answer: "Ms",
      say: "Ms"
    });

    // Q5: match one survival pair
    var s = survival[Math.floor(Math.random() * survival.length)];
    qs.push({
      type: "mcq",
      prompt: "What is the French meaning of: “" + s.en + "” ?",
      choices: shuffle([s.fr, survival[0].fr, survival[1].fr, survival[2].fr]).slice(0,4),
      answer: s.fr,
      say: s.en
    });

    // Q6: intro sentence order
    qs.push({
      type: "order",
      prompt: "Put the introduction in order:",
      parts: shuffle(["Hello,", "my name", "is", TEACHER_NAME + "."]),
      answer: ["Hello,", "my name", "is", TEACHER_NAME + "."],
      say: "Hello, my name is " + TEACHER_NAME + "."
    });

    diag.questions = qs;
    diag.total = qs.length;
  }

  function renderDiag() {
    var host = $("diagArea");
    if (!host) return;

    if (!diag.started) {
      host.innerHTML = '<div class="muted">Press “Start diagnostic” to begin.</div>';
      return;
    }

    if (diag.idx >= diag.questions.length) {
      var pct = Math.round((diag.correct / diag.total) * 100);
      host.innerHTML =
        '<div class="output"><strong>Done!</strong><br>' +
        'Score: <strong>' + diag.correct + '/' + diag.total + '</strong> (' + pct + '%)' +
        '<br><br><span class="muted">Tip: redo the activities above to raise your score.</span></div>';
      addPoints(5);
      return;
    }

    var q = diag.questions[diag.idx];
    if (q.type === "mcq") renderDiagMCQ(host, q);
    if (q.type === "fill") renderDiagFill(host, q);
    if (q.type === "order") renderDiagOrder(host, q);
  }

  function renderDiagMCQ(host, q) {
    var ch = unique(shuffle(q.choices.concat([q.answer]))).slice(0, 4);
    if (ch.indexOf(q.answer) === -1) ch[0] = q.answer;
    ch = shuffle(ch);

    var html = '<p class="big">' + esc(q.prompt) + '</p><div class="choices">';
    for (var i = 0; i < ch.length; i++) {
      html += '<button class="choiceBtn diagChoice" type="button" data-choice="' + esc(ch[i]) + '">' + esc(ch[i]) + '</button>';
    }
    html += '</div><p class="status" id="diagStatus"></p>';
    if (q.hint) html += '<p class="small muted">Hint: ' + esc(q.hint) + '</p>';
    html += '<div class="actionsRow"><button class="btn btn--ghost" id="diagSpeak" type="button">🔊 Listen</button></div>';
    host.innerHTML = html;

    host.addEventListener("click", onDiagClickOnce, { once: true });
    function onDiagClickOnce(e) {
      var btn = e.target && e.target.classList && e.target.classList.contains("diagChoice") ? e.target : null;
      var speakBtn = (e.target && e.target.id === "diagSpeak") ? e.target : null;

      if (speakBtn) {
        speak(q.say || q.answer);
        host.addEventListener("click", onDiagClickOnce, { once: true });
        return;
      }

      if (!btn) { host.addEventListener("click", onDiagClickOnce, { once: true }); return; }

      var choice = btn.getAttribute("data-choice");
      if (choice === q.answer) {
        btn.classList.add("is-correct");
        setText("diagStatus", "✅ Correct!");
        diag.correct++;
        addPoints(3);
      } else {
        btn.classList.add("is-wrong");
        setText("diagStatus", "❌ Not quite. Correct: " + q.answer);
        addPoints(0);
      }
      diag.idx++;
      setTimeout(renderDiag, 700);
    }
  }

  function renderDiagFill(host, q) {
    host.innerHTML =
      '<p class="big">' + esc(q.prompt) + '</p>' +
      '<div class="actionsRow">' +
        '<input id="diagFill" class="fieldInput" style="flex:1; min-width:220px" placeholder="Type here…">' +
        '<button class="btn btn--primary" id="diagCheck" type="button">Check</button>' +
        '<button class="btn btn--ghost" id="diagSpeak" type="button">🔊 Listen</button>' +
      '</div>' +
      '<p class="status" id="diagStatus"></p>' +
      (q.hint ? ('<p class="small muted">Hint: ' + esc(q.hint) + '</p>') : '');

    var check = $("diagCheck");
    if (check) {
      check.addEventListener("click", function () {
        var v = $("diagFill") ? $("diagFill").value.trim().toLowerCase() : "";
        var ans = String(q.answer).trim().toLowerCase();
        if (v === ans) {
          setText("diagStatus", "✅ Correct!");
          diag.correct++;
          addPoints(3);
        } else {
          setText("diagStatus", "❌ Try again. Answer: " + q.answer);
        }
        diag.idx++;
        setTimeout(renderDiag, 700);
      });
    }
    var sp = $("diagSpeak");
    if (sp) sp.addEventListener("click", function () { speak(q.say || q.answer); addPoints(1); });
  }

  function renderDiagOrder(host, q) {
    var parts = q.parts.slice();
    host.innerHTML =
      '<p class="big">' + esc(q.prompt) + '</p>' +
      '<p class="small muted">Tap words in order. Tap again to remove.</p>' +
      '<div class="pillGroup" id="orderPool"></div>' +
      '<div class="output" id="orderOut"></div>' +
      '<div class="actionsRow">' +
        '<button class="btn btn--primary" id="orderCheck" type="button">Check</button>' +
        '<button class="btn btn--ghost" id="diagSpeak" type="button">🔊 Listen</button>' +
      '</div>' +
      '<p class="status" id="diagStatus"></p>';

    var pool = $("orderPool");
    var out = $("orderOut");
    var picked = [];

    function renderPool() {
      pool.innerHTML = "";
      for (var i = 0; i < parts.length; i++) {
        var b = document.createElement("button");
        b.className = "pillBtn";
        b.type = "button";
        b.textContent = parts[i];
        (function (word) {
          b.addEventListener("click", function () {
            var idx = parts.indexOf(word);
            if (idx !== -1) {
              parts.splice(idx, 1);
              picked.push(word);
              renderPool();
              renderOut();
            }
          });
        })(parts[i]);
        pool.appendChild(b);
      }
    }

    function renderOut() {
      out.innerHTML = "<strong>Your sentence:</strong><br>" + esc(picked.join(" "));
    }

    out.addEventListener("click", function () {
      // remove last word
      if (!picked.length) return;
      parts.push(picked.pop());
      renderPool();
      renderOut();
    });

    renderPool();
    renderOut();

    var chk = $("orderCheck");
    if (chk) {
      chk.addEventListener("click", function () {
        var ok = picked.join(" ") === q.answer.join(" ");
        if (ok) {
          setText("diagStatus", "✅ Correct!");
          diag.correct++;
          addPoints(4);
        } else {
          setText("diagStatus", "❌ Not quite. Correct: " + q.answer.join(" "));
        }
        diag.idx++;
        setTimeout(renderDiag, 900);
      });
    }
    var sp = $("diagSpeak");
    if (sp) sp.addEventListener("click", function () { speak(q.say || q.answer.join(" ")); addPoints(1); });
  }

  function initDiagnostic() {
    var start = $("btnStartDiag");
    var reset = $("btnDiagReset");
    if (start) {
      start.addEventListener("click", function () {
        diag.started = true;
        diag.idx = 0;
        diag.correct = 0;
        buildDiagnosticQuestions();
        renderDiag();
      });
    }
    if (reset) {
      reset.addEventListener("click", function () {
        diag.started = false;
        diag.idx = 0;
        diag.correct = 0;
        diag.total = 0;
        renderDiag();
      });
    }
    renderDiag();
  }

  /* ---------------------------
     Slide accordion (full PPT content)
  ----------------------------*/
  function renderSlideAccordion() {
    var host = $("slideAccordion");
    if (!host) return;
    host.innerHTML = "";

    for (var i = 0; i < slides.length; i++) {
      var s = slides[i];
      var title = s.lines && s.lines.length ? s.lines[0] : ("Slide " + (i + 1));
      var lines = (s.lines || []).slice(1);

      var wrap = document.createElement("div");
      wrap.className = "acc";
      wrap.innerHTML =
        '<button class="acc__btn" type="button" aria-expanded="false">' +
          '<span>Slide ' + (i + 1) + ': ' + esc(title) + '</span>' +
          '<span class="acc__chev">▾</span>' +
        '</button>' +
        '<div class="acc__panel"><ul>' +
          lines.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
        '</ul></div>';

      host.appendChild(wrap);
    }

    host.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest(".acc__btn") : null;
      if (!btn) return;
      var acc = btn.parentNode;
      var open = acc.classList.contains("is-open");
      acc.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      addPoints(open ? 0 : 1);
    });

    var exAll = $("btnExpandAll");
    var colAll = $("btnCollapseAll");
    if (exAll) {
      exAll.addEventListener("click", function () {
        var accs = $all(".acc");
        for (var i = 0; i < accs.length; i++) {
          accs[i].classList.add("is-open");
          var b = accs[i].querySelector(".acc__btn");
          if (b) b.setAttribute("aria-expanded", "true");
        }
      });
    }
    if (colAll) {
      colAll.addEventListener("click", function () {
        var accs = $all(".acc");
        for (var i = 0; i < accs.length; i++) {
          accs[i].classList.remove("is-open");
          var b = accs[i].querySelector(".acc__btn");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  /* ---------------------------
     Guided mode (slide-by-slide)
  ----------------------------*/
  var guidedIdx = 0;

  function openGuided() {
    var modal = $("guidedModal");
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    renderGuided();
  }

  function closeGuided() {
    var modal = $("guidedModal");
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    stopSpeak();
  }

  function renderGuided() {
    if (!slides.length) return;
    if (guidedIdx < 0) guidedIdx = 0;
    if (guidedIdx >= slides.length) guidedIdx = slides.length - 1;

    var s = slides[guidedIdx];
    var title = s.lines && s.lines.length ? s.lines[0] : ("Slide " + (guidedIdx + 1));
    var lines = (s.lines || []).slice(1);

    setText("guidedBadge", "Slide " + (guidedIdx + 1) + " / " + slides.length);
    setText("progressPill", "Slide " + (guidedIdx + 1) + " / " + slides.length);
    if ($("guidedTitle")) $("guidedTitle").textContent = title;

    var ul = $("guidedList");
    if (ul) {
      ul.innerHTML = "";
      for (var i = 0; i < lines.length; i++) {
        var li = document.createElement("li");
        li.textContent = lines[i];
        ul.appendChild(li);
      }
    }
  }

  function initGuided() {
    var openBtn = $("btnGuided");
    if (openBtn) openBtn.addEventListener("click", openGuided);

    var modal = $("guidedModal");
    if (modal) {
      modal.addEventListener("click", function (e) {
        var close = e.target && (e.target.getAttribute("data-close") === "1");
        if (close) closeGuided();

        var jumpBtn = e.target && e.target.closest ? e.target.closest("[data-jump]") : null;
        if (jumpBtn) {
          var target = jumpBtn.getAttribute("data-jump");
          closeGuided();
          setTimeout(function () { window.location.hash = target; }, 50);
        }
      });
    }

    var prev = $("btnPrevSlide");
    var next = $("btnNextSlide");
    if (prev) prev.addEventListener("click", function () { guidedIdx--; renderGuided(); });
    if (next) next.addEventListener("click", function () { guidedIdx++; renderGuided(); });

    var sp = $("btnGuidedSpeak");
    if (sp) {
      sp.addEventListener("click", function () {
        var s = slides[guidedIdx];
        var txt = (s.lines || []).join(" ").replace(/\s+/g, " ");
        speak(txt);
        addPoints(1);
      });
    }
  }

  /* ---------------------------
     Timer (60 min)
  ----------------------------*/
  var timer = { total: 3600, left: 3600, running: false, t: null };

  function renderTimer() {
    var el = $("timerDisplay");
    if (!el) return;
    var m = Math.floor(timer.left / 60);
    var s = timer.left % 60;
    el.textContent = pad2(m) + ":" + pad2(s);
  }
  function pad2(n) { return (n < 10 ? "0" : "") + String(n); }

  function startTimer() {
    if (timer.running) return;
    timer.running = true;
    timer.t = setInterval(function () {
      timer.left--;
      if (timer.left <= 0) {
        timer.left = 0;
        pauseTimer();
        addPoints(3);
      }
      renderTimer();
    }, 1000);
  }
  function pauseTimer() {
    timer.running = false;
    if (timer.t) clearInterval(timer.t);
    timer.t = null;
  }
  function resetTimer() {
    pauseTimer();
    timer.left = timer.total;
    renderTimer();
  }

  function initTimer() {
    renderTimer();
    var a = $("timerStart");
    var b = $("timerPause");
    var c = $("timerReset");
    if (a) a.addEventListener("click", startTimer);
    if (b) b.addEventListener("click", pauseTimer);
    if (c) c.addEventListener("click", resetTimer);
  }

  /* ---------------------------
     Wrap-up plan
  ----------------------------*/
  function initWrapUp() {
    var items = [
      "Friendly, relaxed atmosphere 😊",
      "Pronunciation check + repeat 👂",
      "Feel comfortable speaking 💬",
      "Confirm course topics 🧭",
      "Formal vs informal greetings",
      "Tech survival sentences (visio)",
      "Your self-introduction paragraph"
    ];
    var ul = $("wrapChecklist");
    if (ul) {
      ul.innerHTML = "";
      for (var i = 0; i < items.length; i++) {
        var li = document.createElement("li");
        li.innerHTML =
          '<input type="checkbox" class="wrapBox" data-pts="1" aria-label="wrap checkbox">' +
          '<div><div style="font-weight:900">' + esc(items[i]) + '</div></div>';
        ul.appendChild(li);
      }
    }

    document.addEventListener("change", function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains("wrapBox")) {
        var pts = parseInt(t.getAttribute("data-pts"), 10) || 0;
        addPoints(t.checked ? pts : -pts);
      }
    });

    var gen = $("btnPlanNext");
    if (gen) {
      gen.addEventListener("click", function () {
        var name = val("learnerName") || "the learner";
        var plan =
          "Next session plan for " + name + ":\n" +
          "1) Quick warm-up: greetings + small talk (formal/neutral).\n" +
          "2) Pronunciation: repeat key phrases + stress/intonation.\n" +
          "3) Tech practice: survival sentences (camera/mic/connection).\n" +
          "4) Speaking: role-play introductions in context (hotel / phone / email).\n" +
          "5) Vocabulary: key lesson words + flashcards.\n" +
          "6) Mini-quiz: 5 questions to track progress.\n";
        setHTML("planOutput", "<strong>Generated plan:</strong><br><pre style='margin:10px 0 0; white-space:pre-wrap'>" + esc(plan) + "</pre>");
        addPoints(3);
      });
    }

    var copy = $("btnCopyPlan");
    if (copy) {
      copy.addEventListener("click", function () {
        var out = $("planOutput");
        var plain = out ? out.textContent.replace("Generated plan:", "").trim() : "";
        if (plain) { copyText(plain); addPoints(1); }
      });
    }

    var speakBtn = $("btnWrapSpeak");
    if (speakBtn) {
      speakBtn.addEventListener("click", function () {
        var out = $("planOutput");
        var txt = out ? out.textContent.replace(/\s+/g, " ").trim() : "Let’s confirm what we learned today and plan the next session.";
        speak(txt);
        addPoints(1);
      });
    }
  }

  /* ---------------------------
     Global controls
  ----------------------------*/
  function initGlobalControls() {
    var btnStart = $("btnStart");
    if (btnStart) {
      btnStart.addEventListener("click", function () {
        addPoints(1);
        window.location.hash = "#about";
      });
    }

    var printBtn = $("btnPrint");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    var toTop = $("btnToTop");
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    var resetAll = $("btnResetAll");
    if (resetAll) {
      resetAll.addEventListener("click", function () {
        stopSpeak();
        score = 0;
        saveScore();
        renderScore();
        // reset checkboxes
        var boxes = $all("input[type=checkbox]");
        for (var i = 0; i < boxes.length; i++) boxes[i].checked = false;
        // reset matching, diagnostic, intro output
        renderSurvivalMatch();
        if ($("introOutput")) $("introOutput").innerHTML = "";
        if ($("planOutput")) $("planOutput").innerHTML = "";
        diag.started = false; diag.idx = 0; diag.correct = 0; diag.total = 0;
        renderDiag();
        addPoints(0);
      });
    }

    var learnerInput = $("learnerName");
    if (learnerInput) {
      learnerInput.addEventListener("input", function () {
        var nameNow = val("learnerName");
        if ($("learnerNameInline")) $("learnerNameInline").textContent = nameNow ? nameNow : "—";
        updateNameBindings();
      });
    }

    var saveLearner = $("btnSaveLearner");
    if (saveLearner) {
      saveLearner.addEventListener("click", function () {
        var name = val("learnerName");
        if ($("learnerNameInline")) $("learnerNameInline").textContent = name ? name : "—";
        try { if (name) localStorage.setItem("seT_intro_learner_v1", name); } catch (e) {}
        updateNameBindings();
        addPoints(1);
      });
    }

    var heroSpeak = $("btnSpeakHero");
    if (heroSpeak) {
      heroSpeak.addEventListener("click", function () {
        speak("Welcome. Today we will get to know each other. Lesson duration: sixty minutes. Focus: introductions, greetings, and communication needs.");
        addPoints(1);
      });
    }

    // Listen buttons for elements
    document.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest("[data-say]") : null;
      if (btn) {
        var sel = btn.getAttribute("data-say");
        var el = document.querySelector(sel);
        if (el) {
          speak(el.textContent.replace(/\s+/g, " ").trim());
          addPoints(1);
        }
      }
      var plainBtn = e.target && e.target.closest ? e.target.closest("[data-say-plain]") : null;
      if (plainBtn) {
        speak(plainBtn.getAttribute("data-say-plain"));
        addPoints(1);
      }
    });

    // Accent buttons
    var us = $("accentUS");
    var uk = $("accentUK");
    if (us) us.addEventListener("click", function () { setAccent("US"); });
    if (uk) uk.addEventListener("click", function () { setAccent("UK"); });

    // Print-friendly top
    var startHero = $("btnStart");
    if (startHero) startHero.addEventListener("click", function () {});

    // Load stored learner name
    try {
      var stored = localStorage.getItem("seT_intro_learner_v1");
      if (stored && $("learnerName")) {
        $("learnerName").value = stored;
        if ($("learnerNameInline")) $("learnerNameInline").textContent = stored;
      }
    } catch (e) {}
  }

  /* ---------------------------
     Init
  ----------------------------*/
  function init() {
    loadScore();
    loadAccent();

    if (window.speechSynthesis) {
      pickVoices();
      window.speechSynthesis.onvoiceschanged = function () { pickVoices(); };
    }

    initReveal();
    fillAboutAndMethod();

    initChecklistPoints();
    initLearningStylePicks();

    renderVocabFlashcards();
    initVocabButtons();

    renderSurvivalList();
    renderSurvivalMatch();
    initSurvivalButtons();

    renderPrompts();
    initPromptButtons();

    initIntroBuilder();

    initGreetingPractice();
    renderCountrySelect();
    initCountrySpeak();

    initAddressing();
    initContextIntro();

    initGoodbyePractice();
    initFormalCasualSort();
    initTravelStory();

    initDiagnostic();
    renderSlideAccordion();

    initGuided();
    initTimer();
    initWrapUp();
    initGlobalControls();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})();
