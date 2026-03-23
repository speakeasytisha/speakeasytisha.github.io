/* jshint esversion: 5 */
/* global speechSynthesis, SpeechSynthesisUtterance */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) {
    var n = (root || document).querySelectorAll(sel);
    var a = [], i;
    for (i = 0; i < n.length; i++) a.push(n[i]);
    return a;
  }

  var state = {
    seed: Math.floor(Math.random() * 1e9),
    level: "b1",
    fr: false,
    accent: "US",
    scoreC: 0,
    scoreT: 0,
    timerId: null,
    timerT: 0,
    fav: {},
    showFavOnly: false,
    writeTone: "formal",
    chunkAnswer: [],
    chunkPicked: [],
    builtSpeaking: "",
    builtEmail: ""
  };

  function rand() {
    var x = Math.sin(state.seed++) * 10000;
    return x - Math.floor(x);
  }

  function shuffle(arr) {
    var a = arr.slice();
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(rand() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function setScore(cAdd, tAdd) {
    state.scoreC += cAdd;
    state.scoreT += tAdd;
    $("#scoreTxt").textContent = state.scoreC + " / " + state.scoreT;
    var pct = state.scoreT ? Math.round((state.scoreC / state.scoreT) * 100) : 0;
    $("#progressPct").textContent = pct + "%";
    $("#progressBar").style.width = pct + "%";
  }

  function speechSupported() {
    return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  }

  function stopSpeech() {
    if (!speechSupported()) return;
    try { speechSynthesis.cancel(); } catch (e) {}
  }

  function pickVoice(accent) {
    if (!speechSupported()) return null;
    var vs = speechSynthesis.getVoices() || [];
    if (!vs.length) return null;

    var want = (accent === "UK") ? ["en-gb", "en_gb"] : ["en-us", "en_us"];
    var fb = (accent === "UK") ? ["en", "en-ie", "en-au", "en-ca", "en-us"] : ["en", "en-ca", "en-au", "en-gb"];

    var i, j, lang;
    for (i = 0; i < vs.length; i++) {
      lang = (vs[i].lang || "").toLowerCase();
      for (j = 0; j < want.length; j++) if (lang.indexOf(want[j]) !== -1) return vs[i];
    }
    for (i = 0; i < vs.length; i++) {
      lang = (vs[i].lang || "").toLowerCase();
      for (j = 0; j < fb.length; j++) if (lang.indexOf(fb[j]) !== -1) return vs[i];
    }
    return vs[0];
  }

  function speak(text) {
    if (!speechSupported()) { alert("Text-to-speech is not available on this device."); return; }
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text || ""));
    var v = pickVoice(state.accent);
    if (v) u.voice = v;
    u.rate = 1.0;
    speechSynthesis.speak(u);
  }

  function copyText(txt) {
    txt = String(txt || "");
    if (!txt) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt)["catch"](function () { fallbackCopy(txt); });
    } else {
      fallbackCopy(txt);
    }
  }

  function fallbackCopy(txt) {
    var ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function fmt(sec) {
    var m = String(Math.floor(sec / 60));
    var s = String(sec % 60);
    if (m.length < 2) m = "0" + m;
    if (s.length < 2) s = "0" + s;
    return m + ":" + s;
  }

  function stopTimer() {
    if (state.timerId) window.clearInterval(state.timerId);
    state.timerId = null;
    state.timerT = 0;
    $("#timerTxt").textContent = "00:00";
  }

  function startTimer(seconds) {
    stopTimer();
    state.timerT = seconds;
    $("#timerTxt").textContent = fmt(state.timerT);
    state.timerId = window.setInterval(function () {
      state.timerT -= 1;
      if (state.timerT < 0) state.timerT = 0;
      $("#timerTxt").textContent = fmt(state.timerT);
      if (state.timerT === 0) stopTimer();
    }, 1000);
  }

  // ---------------- CONTENT ----------------
  var toolboxLines = [
    "A) FUTURE INTENTION (decision already made): be going to + verb",
    "   Example: I'm going to watch the match tonight.",
    "",
    "B) FUTURE ARRANGEMENT (fixed plan): Present Continuous",
    "   Example: I'm meeting my friend at 7. We're watching the game.",
    "",
    "C) DECISION NOW / OFFER / PROMISE: will + verb",
    "   Example: I'll send you the trailer. I'll call you later.",
    "",
    "D) PLANS (more formal): plan to + verb / plan on + -ing",
    "   Example: I plan to visit Boston. / I plan on visiting Boston.",
    "",
    "E) FUTURE IN PROGRESS (B2): Future Continuous (will be + -ing)",
    "   Example: This time tomorrow, I'll be watching the match."
  ];

  var visitPatterns = [
    "WHY (reason): I'm visiting because + clause",
    "• I'm visiting because my friend lives there.",
    "",
    "PURPOSE: I'm visiting to + verb / in order to + verb",
    "• I'm visiting to watch a match.",
    "",
    "FOR + noun:",
    "• I'm visiting for the film festival."
  ].join("\n");

  var visitFixes = [
    "Wrong: I'm visiting because to watch a match.",
    "Correct: I'm visiting to watch a match. / I'm visiting because I want to watch a match.",
    "",
    "Wrong: I plan visiting.",
    "Correct: I plan on visiting. / I plan to visit."
  ].join("\n");

  var choiceTrainer = [
    { stem:"You decided yesterday to go to a match.", opts:["I'm going to go to the match tomorrow.","I'll go to the match tomorrow."], ans:0, why:"Decision already made = going to." },
    { stem:"You decide now: 'No problem, I can help.'", opts:["I'm going to help you.","I'll help you."], ans:1, why:"Offer/decision now = will." },
    { stem:"Tickets booked + time fixed.", opts:["I'm watching the game at 8.","I'll watch the game at 8."], ans:0, why:"Arrangement = Present Continuous." },
    { stem:"Formal plan for summer.", opts:["I plan on visiting New York.","I will visiting New York."], ans:0, why:"plan on + -ing." }
  ];

  var drillA = [
    { stem:"I ______ you the link now. (decision now)", opts:["will send","am going to send"], ans:0, why:"Decision now / offer = will." },
    { stem:"We ______ the final this weekend. (intention)", opts:["are going to watch","will watch"], ans:0, why:"Intention = going to." },
    { stem:"Look at those clouds. It ______.", opts:["is going to rain","will rain"], ans:0, why:"Evidence now = going to." }
  ];

  var drillB = [
    { stem:"I ______ a friend at 7. Tickets are booked.", opts:["am meeting","will meet"], ans:0, why:"Fixed plan = Present Continuous." },
    { stem:"We ______ on Friday morning. Flight confirmed.", opts:["are flying","are going to fly"], ans:0, why:"Arrangement = Present Continuous." },
    { stem:"They ______ dinner after the movie (reservation).", opts:["are having","will have"], ans:0, why:"Arrangement = Present Continuous." }
  ];

  var drillC = [
    { stem:"I plan ______ LA next year.", opts:["to visit","on visit"], ans:0, why:"plan to + verb." },
    { stem:"I plan on ______ LA next year.", opts:["visiting","to visit"], ans:0, why:"plan on + -ing." },
    { stem:"We plan to ______ two movies this weekend.", opts:["see","seeing"], ans:0, why:"plan to + base verb." }
  ];

  var drillD = [
    { stem:"Why are you visiting London?", opts:["I'm visiting to watch a match.","I'm visiting because to watch a match."], ans:0, why:"Purpose: to + verb." },
    { stem:"Why are you visiting Boston?", opts:["I'm visiting because my cousin lives there.","I'm visiting to because my cousin lives there."], ans:0, why:"Reason: because + clause." },
    { stem:"What are you visiting for?", opts:["I'm visiting for the film festival.","I'm visiting for watch the film festival."], ans:0, why:"For + noun." }
  ];

  var chunkSets = [
    {
      answer: ["I'm","going to","watch","a match","on Saturday","because","my friend invited me."],
      bank: ["because","watch","I'm","my friend invited me.","a match","going to","on Saturday"]
    },
    {
      answer: ["I'm","meeting","a colleague","at 7","to","talk about","the movie project."],
      bank: ["the movie project.","meeting","to","I'm","talk about","a colleague","at 7"]
    }
  ];

  var vocab = [
    {cat:"Soccer plans", icon:"⚽", en:"a match", fr:"un match", def:"A sports game (soccer).", ex:"I'm going to watch a match on Saturday."},
    {cat:"Soccer plans", icon:"🎟️", en:"tickets", fr:"des billets", def:"Passes to enter an event.", ex:"I bought tickets online."},
    {cat:"Soccer plans", icon:"🏟️", en:"the stadium", fr:"le stade", def:"Large place where games happen.", ex:"We're meeting at the stadium entrance."},
    {cat:"Soccer plans", icon:"⏰", en:"kick-off", fr:"le coup d'envoi", def:"The time the match starts.", ex:"Kick-off is at 8 p.m."},
    {cat:"Movie plans", icon:"🎬", en:"a premiere", fr:"une avant-premiere", def:"First public showing of a movie.", ex:"I'm attending a premiere next month."},
    {cat:"Movie plans", icon:"🍿", en:"a screening", fr:"une projection", def:"A showing of a movie.", ex:"The screening starts at 7:30."},
    {cat:"Movie plans", icon:"🎞️", en:"a trailer", fr:"une bande-annonce", def:"Short preview video.", ex:"I'll send you the trailer."},
    {cat:"Travel & logistics", icon:"🔁", en:"to reschedule", fr:"reprogrammer", def:"Change to a new date/time.", ex:"Can we reschedule for next week?"},
    {cat:"Travel & logistics", icon:"✅", en:"to confirm", fr:"confirmer", def:"Say yes officially.", ex:"Please confirm the time."},
    {cat:"Time expressions", icon:"📌", en:"this weekend", fr:"ce week-end", def:"The coming weekend.", ex:"We're meeting this weekend."},
    {cat:"Time expressions", icon:"⏳", en:"in two weeks", fr:"dans deux semaines", def:"Two weeks from now.", ex:"I'm visiting in two weeks."},
    {cat:"Time expressions", icon:"🗓️", en:"next month", fr:"le mois prochain", def:"The month after this one.", ex:"I'm going to travel next month."}
  ];

  var speakChecklist = [
    "1) Start with the main idea (one sentence).",
    "2) Choose the right future form.",
    "3) Add details: when + where + who.",
    "4) Add why (because...) or purpose (to + verb).",
    "5) Finish with a confirmation or next step."
  ];

  var cheatSheet = [
    "GOING TO = intention / evidence now",
    "PRESENT CONTINUOUS = arrangement / fixed plan",
    "WILL = decision now / offer / promise",
    "PLAN TO + verb / PLAN ON + -ing = planned future",
    "",
    "Why visiting?",
    "Purpose: I'm visiting to + verb.",
    "Reason: I'm visiting because + clause.",
    "For + noun: I'm visiting for + noun."
  ].join("\n");

  // ---------- UI RENDER ----------
  function renderModel(id, text) { $(id).textContent = text; }

  function renderQuiz(container, items) {
    container.innerHTML = "";
    var answered = {};
    for (var i = 0; i < items.length; i++) {
      (function (q, qi) {
        var el = document.createElement("div");
        el.className = "q";
        el.innerHTML = '<div class="qStem"></div><div class="opt"></div><div class="explain" style="display:none;"></div>';
        $(".qStem", el).textContent = q.stem;

        var opt = $(".opt", el);
        var exp = $(".explain", el);

        for (var j = 0; j < q.opts.length; j++) {
          (function (lab, oi) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "choice";
            b.textContent = lab;

            b.onclick = function () {
              if (answered[qi]) return;
              answered[qi] = true;
              setScore(0, 1);

              var ok = (oi === q.ans);
              if (ok) { setScore(1, 0); b.classList.add("is-correct"); }
              else {
                b.classList.add("is-wrong");
                var choices = $all(".choice", el);
                if (choices[q.ans]) choices[q.ans].classList.add("is-correct");
              }

              exp.style.display = "block";
              exp.textContent = (ok ? "✅ " : "❌ ") + q.why;
            };

            opt.appendChild(b);
          }(q.opts[j], j));
        }

        container.appendChild(el);
      }(items[i], i));
    }
  }

  function uniqCats(list) {
    var m = {}, out = [], i;
    for (i = 0; i < list.length; i++) {
      if (!m[list[i].cat]) { m[list[i].cat] = true; out.push(list[i].cat); }
    }
    return out;
  }

  function renderVocabCats() {
    var sel = $("#vocabCat");
    sel.innerHTML = "";
    var cats = ["All categories"].concat(uniqCats(vocab));
    for (var i = 0; i < cats.length; i++) {
      var o = document.createElement("option");
      o.value = cats[i];
      o.textContent = cats[i];
      sel.appendChild(o);
    }
    sel.value = "All categories";
  }

  function matchesFilter(v) {
    var cat = $("#vocabCat").value;
    var q = ($("#vocabSearch").value || "").toLowerCase().trim();
    if (state.showFavOnly && !state.fav[v.en]) return false;
    if (cat !== "All categories" && v.cat !== cat) return false;
    if (!q) return true;
    return (v.en.toLowerCase().indexOf(q) !== -1) ||
           (v.fr.toLowerCase().indexOf(q) !== -1) ||
           (v.def.toLowerCase().indexOf(q) !== -1) ||
           (v.ex.toLowerCase().indexOf(q) !== -1);
  }

  function renderVocab() {
    var grid = $("#vocabGrid");
    grid.innerHTML = "";
    var shown = 0;

    for (var i = 0; i < vocab.length; i++) {
      var v = vocab[i];
      if (!matchesFilter(v)) continue;
      shown += 1;

      (function (item) {
        var card = document.createElement("div");
        card.className = "vcard" + (state.fav[item.en] ? " saved" : "");
        card.innerHTML =
          '<div class="vtop">' +
            '<div class="vword"></div>' +
            '<div class="vtag"></div>' +
          '</div>' +
          '<div class="vdef"></div>' +
          '<div class="vex"></div>' +
          '<div class="vfr"></div>';

        $(".vword", card).textContent = item.icon + " " + item.en;
        $(".vtag", card).textContent = item.cat;
        $(".vdef", card).textContent = item.def;
        $(".vex", card).textContent = "Example: " + item.ex;

        var fr = $(".vfr", card);
        fr.textContent = "FR: " + item.fr;
        fr.style.display = state.fr ? "block" : "none";

        card.onclick = function () {
          if (state.fav[item.en]) delete state.fav[item.en];
          else state.fav[item.en] = true;
          renderVocab();
          $("#vocabFb").className = "fb good";
          $("#vocabFb").textContent = state.fav[item.en] ? "✅ Saved." : "🗑️ Removed.";
        };

        grid.appendChild(card);
      }(v));
    }

    if (!shown) {
      grid.innerHTML = '<div class="fb warn">No results. Try a different category or search word.</div>';
    }
  }

  // sentence builder
  function pickChunkSet() {
    var idx = Math.floor(rand() * chunkSets.length);
    var set = chunkSets[idx];
    state.chunkAnswer = set.answer.slice();
    state.chunkPicked = [];
    renderChunks(set.bank);
  }

  function renderChunks(bank) {
    bank = shuffle(bank);
    var bankEl = $("#chunkBank");
    var lineEl = $("#chunkLine");
    bankEl.innerHTML = "";
    lineEl.innerHTML = "";

    for (var i = 0; i < bank.length; i++) {
      (function (txt) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chunk";
        b.textContent = txt;

        b.onclick = function () {
          if (b.classList.contains("used")) return;
          b.classList.add("used");
          state.chunkPicked.push(txt);

          var c = document.createElement("button");
          c.type = "button";
          c.className = "chunk";
          c.textContent = txt;
          c.title = "Tap to remove";

          c.onclick = function () {
            // remove from picked
            for (var k = state.chunkPicked.length - 1; k >= 0; k--) {
              if (state.chunkPicked[k] === txt) { state.chunkPicked.splice(k, 1); break; }
            }
            // un-use in bank
            var bankBtns = $all(".chunk", bankEl);
            for (k = 0; k < bankBtns.length; k++) {
              if (bankBtns[k].textContent === txt) { bankBtns[k].classList.remove("used"); break; }
            }
            if (c.parentNode) c.parentNode.removeChild(c);
          };

          lineEl.appendChild(c);
        };

        bankEl.appendChild(b);
      }(bank[i]));
    }

    $("#chunkFb").className = "fb";
    $("#chunkFb").textContent = "Tap chunks to build the sentence. Tap a chunk in your sentence to remove it.";
  }

  function checkChunks() {
    setScore(0, 1);
    var ok = (state.chunkPicked.length === state.chunkAnswer.length);
    for (var i = 0; ok && i < state.chunkAnswer.length; i++) {
      if (state.chunkPicked[i] !== state.chunkAnswer[i]) ok = false;
    }
    if (ok) {
      setScore(1, 0);
      $("#chunkFb").className = "fb good";
      $("#chunkFb").textContent = "✅ Correct! Great future plan sentence.";
    } else {
      $("#chunkFb").className = "fb warn";
      $("#chunkFb").textContent = "⚠️ Not quite. Hint: subject + verb, then time, then reason/purpose.";
    }
  }

  function listenChunks() {
    if (!state.chunkPicked.length) { alert("Build a sentence first."); return; }
    speak(state.chunkPicked.join(" "));
  }

  // dialogues
  function renderDialogue(root, dialogue) {
    root.innerHTML = "";
    var step = 0;
    var correct = 0;

    function renderStep() {
      root.innerHTML = "";
      var d = dialogue[step];

      var card = document.createElement("div");
      card.className = "dcard";
      card.innerHTML =
        '<div class="dwho"></div>' +
        '<div class="dline"></div>' +
        '<div class="dopts"></div>' +
        '<div class="dfb"></div>';

      $(".dwho", card).textContent = d.who;
      $(".dline", card).textContent = d.line;

      var opts = $(".dopts", card);
      var fb = $(".dfb", card);
      fb.textContent = "Choose a reply.";

      for (var i = 0; i < d.opts.length; i++) {
        (function (opt, idx) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "choice";
          b.textContent = opt.text;

          b.onclick = function () {
            setScore(0, 1);
            var ok = (idx === d.ans);
            if (ok) { setScore(1, 0); correct += 1; b.classList.add("is-correct"); }
            else { b.classList.add("is-wrong"); }

            fb.textContent = (ok ? "✅ " : "❌ ") + d.why;

            // lock
            var buttons = $all("button", opts);
            for (var k = 0; k < buttons.length; k++) buttons[k].disabled = true;

            // next
            var next = document.createElement("button");
            next.type = "button";
            next.className = "btn btn--tiny btn--primary";
            next.textContent = (step < dialogue.length - 1) ? "Next" : "Finish";
            next.onclick = function () {
              if (step < dialogue.length - 1) { step += 1; renderStep(); }
              else renderEnd();
            };
            fb.appendChild(document.createElement("br"));
            fb.appendChild(next);
          };

          opts.appendChild(b);
        }(d.opts[i], i));
      }

      root.appendChild(card);
    }

    function renderEnd() {
      root.innerHTML = "";
      var end = document.createElement("div");
      end.className = "dcard";
      end.innerHTML =
        '<div class="dwho">Result</div>' +
        '<div class="dline"></div>' +
        '<div class="dfb"></div>' +
        '<div class="row noPrint" style="margin-top:10px;"></div>';

      $(".dline", end).textContent = "You finished. Score: " + correct + " / " + dialogue.length;
      $(".dfb", end).textContent = "Tip: Use confirmations (Just to confirm...) and clear time phrases (on Friday, at 7 p.m.).";

      var row = $(".row", end);
      var again = document.createElement("button");
      again.type = "button";
      again.className = "btn btn--tiny";
      again.textContent = "Restart";
      again.onclick = function () { step = 0; correct = 0; renderStep(); };
      row.appendChild(again);

      root.appendChild(end);
    }

    renderStep();
  }

  var dlg1 = [
    { who:"Alex", line:"Are you free this weekend? There's a big match on Saturday.",
      opts:[ {text:"Yes, I'm going to watch it. What time is kick-off?"}, {text:"Yes, I watched it yesterday. What time is kick-off?"} ],
      ans:0, why:"Future plan = going to. Then ask for details." },
    { who:"You", line:"Choose your reply:",
      opts:[ {text:"I'm meeting my friend at 7, so we can arrive early."}, {text:"I meet my friend yesterday at 7."} ],
      ans:0, why:"Fixed arrangement = Present Continuous." },
    { who:"Alex", line:"Great. Why are you visiting the stadium early?",
      opts:[ {text:"I'm visiting early to avoid the lines."}, {text:"I'm visiting early because to avoid the lines."} ],
      ans:0, why:"Purpose = to + verb." }
  ];

  var dlg2 = [
    { who:"Colleague", line:"Are you going to the movie premiere next month?",
      opts:[ {text:"Yes, I'm going. I plan to arrive early."}, {text:"Yes, I go. I planned arrive early."} ],
      ans:0, why:"Natural future = going + plan to + verb." },
    { who:"Colleague", line:"We need to confirm the time. Can you send me the details?",
      opts:[ {text:"Sure, I'll send them now."}, {text:"Sure, I'm going to send them yesterday."} ],
      ans:0, why:"Offer/decision now = will." },
    { who:"Colleague", line:"Perfect. What are you visiting for?",
      opts:[ {text:"I'm visiting for the film festival."}, {text:"I'm visiting for watch the film festival."} ],
      ans:0, why:"For + noun." }
  ];

  function renderSpeakBuilder() {
    var fields = [
      {id:"topic", label:"Topic", opts:["Soccer plan","Movie plan","Travel plan"]},
      {id:"time", label:"When", opts:["this weekend","on Friday","next month","in two weeks"]},
      {id:"place", label:"Where", opts:["at the stadium","at the cinema","downtown","in Boston"]},
      {id:"who", label:"With who", opts:["with a friend","with colleagues","with my family","alone"]},
      {id:"form", label:"Main future form", opts:["going to","present continuous","plan to","plan on"]},
      {id:"why", label:"Why (choose one)", opts:["because I want to relax","because my friend invited me","to watch a match","to see a premiere","for the film festival"]},
      {id:"extra", label:"Extra detail", opts:["I already bought tickets.","We need to confirm the time.","I'll send the details now.","I'm meeting them at 7 p.m.","I might reschedule if needed."]}
    ];

    var grid = $("#speakBuilder");
    grid.innerHTML = "";
    for (var i = 0; i < fields.length; i++) {
      (function (f) {
        var wrap = document.createElement("div");
        wrap.innerHTML = '<div class="muted small"></div>';
        $(".muted", wrap).textContent = f.label;

        var sel = document.createElement("select");
        sel.className = "select";
        sel.id = "sb_" + f.id;
        for (var k = 0; k < f.opts.length; k++) {
          var o = document.createElement("option");
          o.value = f.opts[k];
          o.textContent = f.opts[k];
          sel.appendChild(o);
        }
        wrap.appendChild(sel);
        grid.appendChild(wrap);
      }(fields[i]));
    }
  }

  function buildSpeaking() {
    var topic = $("#sb_topic").value;
    var when = $("#sb_time").value;
    var where = $("#sb_place").value;
    var who = $("#sb_who").value;
    var form = $("#sb_form").value;
    var why = $("#sb_why").value;
    var extra = $("#sb_extra").value;

    var L = state.level;

    var baseVerb = (topic === "Soccer plan") ? "watch a match" : (topic === "Movie plan") ? "see a movie" : "travel";
    var ingVerb  = (topic === "Soccer plan") ? "watching a match" : (topic === "Movie plan") ? "seeing a movie" : "traveling";

    var first = "";
    if (form === "going to") first = "I'm going to " + baseVerb + " " + when + " " + where + " " + who + ".";
    else if (form === "present continuous") first = "I'm " + ingVerb + " " + when + " " + where + " " + who + ".";
    else if (form === "plan to") first = "I plan to " + baseVerb + " " + when + ".";
    else first = "I plan on " + ingVerb + " " + when + ".";

    var whyLine = "";
    if (why.indexOf("because") === 0) whyLine = why + ".";
    else if (why.indexOf("to ") === 0) whyLine = "I'm doing it " + why + ".";
    else whyLine = "I'm doing it " + why + ".";

    var out = [];
    if (L === "a2") {
      out.push(first);
      out.push(whyLine);
      out.push(extra);
    } else if (L === "b1") {
      out.push(first);
      out.push("We are meeting and we will confirm the schedule.");
      out.push(whyLine);
      out.push(extra);
      out.push("If anything changes, I'll let you know.");
    } else {
      out.push(first);
      out.push("The plan is already organized, and I've checked the schedule and the tickets.");
      out.push(whyLine);
      out.push(extra);
      out.push("If needed, I can reschedule, but I'd like to keep the plan as it is.");
    }

    state.builtSpeaking = out.join("\n");
    $("#builtSpeaking").textContent = state.builtSpeaking;
  }

  function renderEmailBuilder() {
    var fields = [
      {id:"subject", label:"Subject", opts:["Schedule update","Confirming our plan","Rescheduling request","Tickets and timing"]},
      {id:"context", label:"Context", opts:["I hope you are well.","I am writing regarding our plan.","Just a quick message about our schedule."]},
      {id:"main", label:"Main sentence", opts:[
        "I'm going to visit next month to attend an event.",
        "I'm meeting a friend on Friday to watch a match.",
        "I plan on visiting in two weeks for a film festival.",
        "I'll send you the details this afternoon."
      ]},
      {id:"request", label:"Request", opts:[
        "Could you please confirm the time?",
        "Could we reschedule to Friday afternoon?",
        "Please let me know what works best for you.",
        "Could you confirm the next steps?"
      ]},
      {id:"closing", label:"Closing", opts:["Thank you in advance for your help.","Thank you for your time.","Thanks again.","Have a great day."]}
    ];

    var grid = $("#emailBuilder");
    grid.innerHTML = "";
    for (var i = 0; i < fields.length; i++) {
      (function (f) {
        var wrap = document.createElement("div");
        var label = document.createElement("div");
        label.className = "muted small";
        label.textContent = f.label;

        var sel = document.createElement("select");
        sel.className = "select";
        sel.id = "eb_" + f.id;
        for (var k = 0; k < f.opts.length; k++) {
          var o = document.createElement("option");
          o.value = f.opts[k];
          o.textContent = f.opts[k];
          sel.appendChild(o);
        }

        wrap.appendChild(label);
        wrap.appendChild(sel);
        grid.appendChild(wrap);
      }(fields[i]));
    }
  }

  function buildEmail() {
    var subject = $("#eb_subject").value;
    var context = $("#eb_context").value;
    var main = $("#eb_main").value;
    var request = $("#eb_request").value;
    var closing = $("#eb_closing").value;

    var greet = (state.writeTone === "formal") ? "Hello," : "Hi,";
    var sign = (state.writeTone === "formal") ? "Kind regards," : "Best,";

    state.builtEmail =
      "Subject: " + subject + "\n\n" +
      greet + "\n\n" +
      context + "\n" +
      main + "\n\n" +
      request + "\n\n" +
      closing + "\n\n" +
      sign;

    $("#builtEmail").textContent = state.builtEmail;
  }

  function wire() {
    $("#printPage").onclick = function () { window.print(); };
    $("#resetAll").onclick = function () { window.location.reload(); };

    $("#accentUS").onclick = function () {
      state.accent = "US";
      $("#accentUS").classList.add("btn--primary");
      $("#accentUK").classList.remove("btn--primary");
      $("#accentUS").setAttribute("aria-pressed","true");
      $("#accentUK").setAttribute("aria-pressed","false");
    };
    $("#accentUK").onclick = function () {
      state.accent = "UK";
      $("#accentUK").classList.add("btn--primary");
      $("#accentUS").classList.remove("btn--primary");
      $("#accentUK").setAttribute("aria-pressed","true");
      $("#accentUS").setAttribute("aria-pressed","false");
    };

    $("#frToggle").onclick = function () {
      state.fr = !state.fr;
      $("#frToggle").setAttribute("aria-pressed", state.fr ? "true" : "false");
      $("#frToggle").textContent = state.fr ? "FR ON" : "FR OFF";
      renderVocab();
      $("#mapFb").className = "fb good";
      $("#mapFb").textContent = state.fr ? "✅ French support is ON." : "✅ French support is OFF.";
    };

    $("#level").onchange = function () {
      state.level = $("#level").value;
      $("#mapFb").className = "fb";
      $("#mapFb").textContent = "Level set to " + state.level.toUpperCase() + ". Try the builders again.";
    };

    $("#listenDecision").onclick = function () { speak($("#decisionMap").textContent); };
    $("#copyDecision").onclick = function () { copyText($("#decisionMap").textContent); };

    $("#listenCheat").onclick = function () { speak($("#cheatSheet").textContent); };
    $("#copyCheat").onclick = function () { copyText($("#cheatSheet").textContent); };

    $("#vocabCat").onchange = renderVocab;
    $("#vocabSearch").oninput = renderVocab;

    $("#showAllVocab").onclick = function () { state.showFavOnly = false; renderVocab(); };
    $("#showFavVocab").onclick = function () { state.showFavOnly = true; renderVocab(); };

    $("#checkChunks").onclick = checkChunks;
    $("#listenChunks").onclick = listenChunks;
    $("#resetChunks").onclick = pickChunkSet;

    $("#buildSpeaking").onclick = buildSpeaking;
    $("#listenBuiltSpeaking").onclick = function () { speak(state.builtSpeaking || ""); };
    $("#copyBuiltSpeaking").onclick = function () { copyText(state.builtSpeaking || ""); };

    $("#writeFormal").onclick = function () {
      state.writeTone = "formal";
      $("#writeFormal").classList.add("btn--primary");
      $("#writeFriendly").classList.remove("btn--primary");
      $("#writeFormal").setAttribute("aria-pressed","true");
      $("#writeFriendly").setAttribute("aria-pressed","false");
    };
    $("#writeFriendly").onclick = function () {
      state.writeTone = "friendly";
      $("#writeFriendly").classList.add("btn--primary");
      $("#writeFormal").classList.remove("btn--primary");
      $("#writeFriendly").setAttribute("aria-pressed","true");
      $("#writeFormal").setAttribute("aria-pressed","false");
    };

    $("#buildEmail").onclick = buildEmail;
    $("#listenBuiltEmail").onclick = function () { speak(state.builtEmail || ""); };
    $("#copyBuiltEmail").onclick = function () { copyText(state.builtEmail || ""); };

    $("#t60").onclick = function () { startTimer(60); };
    $("#t90").onclick = function () { startTimer(90); };
    $("#t120").onclick = function () { startTimer(120); };
    $("#tStop").onclick = stopTimer;
  }

  function init() {
    $("#decisionMap").textContent = toolboxLines.join("\n");
    $("#visitPatterns").textContent = visitPatterns;
    $("#visitFixes").textContent = visitFixes;

    renderQuiz($("#choiceTrainer"), choiceTrainer);
    renderQuiz($("#drillA"), drillA);
    renderQuiz($("#drillB"), drillB);
    renderQuiz($("#drillC"), drillC);
    renderQuiz($("#drillD"), drillD);

    renderVocabCats();
    renderVocab();

    pickChunkSet();

    renderDialogue($("#dlg1"), dlg1);
    renderDialogue($("#dlg2"), dlg2);

    renderSpeakBuilder();
    renderEmailBuilder();

    $("#speakChecklist").innerHTML = "<li>" + speakChecklist.join("</li><li>") + "</li>";
    $("#cheatSheet").textContent = cheatSheet;

    wire();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

}());
