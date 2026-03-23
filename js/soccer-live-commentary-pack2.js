/* jshint esversion: 5 */
/* global speechSynthesis, SpeechSynthesisUtterance */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) {
    var r = (root || document).querySelectorAll(sel);
    var arr = [], i;
    for (i = 0; i < r.length; i++) arr.push(r[i]);
    return arr;
  }

  var state = {
    seed: Math.floor(Math.random() * 1e9),
    level: "b1",
    dialect: "both",
    fr: false,
    accent: "US",
    scoreC: 0,
    scoreT: 0,
    timerId: null,
    timerT: 0,
    feed: []
  };

  function updateScore(cAdd, tAdd) {
    state.scoreC += cAdd;
    state.scoreT += tAdd;
    $("#scoreTxt").textContent = state.scoreC + " / " + state.scoreT;
    var pct = state.scoreT ? Math.round((state.scoreC / state.scoreT) * 100) : 0;
    $("#progressPct").textContent = pct + "%";
    $("#progressBar").style.width = pct + "%";
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
    if (!speechSupported()) return;
    stopSpeech();
    var u = new SpeechSynthesisUtterance(String(text || ""));
    var v = pickVoice(state.accent);
    if (v) u.voice = v;
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    speechSynthesis.speak(u);
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

  function copyText(txt) {
    txt = String(txt || "");
    if (!txt) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt)["catch"](function () { fallbackCopy(txt); });
    } else {
      fallbackCopy(txt);
    }
  }

  function setDialect(d) {
    state.dialect = d;
    $("#dialBoth").classList.toggle("btn--primary", d === "both");
    $("#dialUS").classList.toggle("btn--primary", d === "us");
    $("#dialUK").classList.toggle("btn--primary", d === "uk");
    $("#dialBoth").setAttribute("aria-pressed", d === "both" ? "true" : "false");
    $("#dialUS").setAttribute("aria-pressed", d === "us" ? "true" : "false");
    $("#dialUK").setAttribute("aria-pressed", d === "uk" ? "true" : "false");

    renderWarmup();
    renderDialBox();
    renderTenseMCQ();
    renderPCFill();
    renderMixedFill();
  }

  function setFR(on) {
    state.fr = on;
    $("#frStatus").textContent = on ? "ON" : "OFF";
    renderWarmup();
    renderDialBox();
    renderPhrases();
    renderPCGuide();
    renderPCWhen();
  }

  function setAccent(a) {
    state.accent = a;
    $("#accentUS").classList.toggle("btn--primary", a === "US");
    $("#accentUK").classList.toggle("btn--primary", a === "UK");
    $("#accentUS").setAttribute("aria-pressed", a === "US" ? "true" : "false");
    $("#accentUK").setAttribute("aria-pressed", a === "UK" ? "true" : "false");
  }

  function setLevel(lv) {
    state.level = lv;
    renderWarmup();
    renderBuilders();
    renderMixedFill();
  }

  function matchWord() {
    if (state.dialect === "uk") return "match";
    if (state.dialect === "us") return "game";
    return "match/game";
  }

  function pitchWord() {
    if (state.dialect === "uk") return "pitch";
    if (state.dialect === "us") return "field";
    return "pitch/field";
  }

  function renderWarmup() {
    var w = matchWord();
    var p = pitchWord();
    var fr = state.fr ? "\nFR: Present continuous = action en cours (maintenant)." : "";
    $("#warmupBox").textContent =
      "Today you will speak like a commentator.\n" +
      "Use Present Continuous: He is passing. They are pressing.\n" +
      "We will talk about the " + w + " on the " + p + "." + fr;
  }

  function renderPCGuide() {
    var fr = state.fr ? "\nFR: be = am/is/are + verbe + -ing" : "";
    $("#pcGuide").textContent =
      "Form:\n" +
      "I am + verb-ing\n" +
      "He/She/It is + verb-ing\n" +
      "We/You/They are + verb-ing\n\n" +
      "Examples:\n" +
      "He is dribbling.\n" +
      "They are pressing.\n" +
      "We are watching the match/game." + fr;

    $("#pcSpelling").textContent =
      "Spelling:\n" +
      "- make -> making (drop e)\n" +
      "- run -> running (double consonant)\n" +
      "- lie -> lying (ie -> y)\n\n" +
      "Soccer verbs:\n" +
      "pass -> passing\n" +
      "cross -> crossing\n" +
      "tackle -> tackling";
  }

  function renderPCWhen() {
    var fr = state.fr ? "\nFR: Present simple = habitude/regle. Present continuous = maintenant." : "";
    $("#pcWhen").textContent =
      "Use Present Continuous for actions happening now:\n" +
      "- He is shooting.\n" +
      "- The goalkeeper is saving it.\n\n" +
      "Use Present Simple for habits/rules:\n" +
      "- A goalkeeper protects the goal.\n" +
      "- Fans cheer when their team scores." + fr;
  }

  function renderMCQ(container, items) {
    container.innerHTML = "";
    var answered = {};
    for (var i = 0; i < items.length; i++) {
      (function (q, qi) {
        var el = document.createElement("div");
        el.className = "q";
        el.innerHTML =
          '<div class="qStem">' + q.stem + '</div>' +
          '<div class="opt"></div>' +
          '<div class="explain" style="display:none;"></div>';
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
              updateScore(0, 1);
              var ok = (oi === q.ans);
              if (ok) { updateScore(1, 0); b.classList.add("is-correct"); }
              else {
                b.classList.add("is-wrong");
                var choices = $all(".choice", el);
                if (choices[q.ans]) choices[q.ans].classList.add("is-correct");
              }
              exp.style.display = "block";
              exp.textContent = (ok ? "OK: " : "Try again: ") + q.why;
            };
            opt.appendChild(b);
          }(q.opts[j], j));
        }
        container.appendChild(el);
      }(items[i], i));
    }
  }

  function renderFill(container, items) {
    container.innerHTML = "";
    for (var i = 0; i < items.length; i++) {
      (function (item) {
        var wrap = document.createElement("div");
        wrap.className = "panel";
        var row = document.createElement("div");
        row.className = "fillRow";
        row.innerHTML = '<div class="muted">' + item.stem + '</div>';

        var sel = document.createElement("select");
        sel.className = "select inpSmall";
        var o0 = document.createElement("option");
        o0.value = "";
        o0.textContent = "Choose…";
        sel.appendChild(o0);
        for (var k = 0; k < item.opts.length; k++) {
          var o = document.createElement("option");
          o.value = item.opts[k];
          o.textContent = item.opts[k];
          sel.appendChild(o);
        }

        var fb = document.createElement("div");
        fb.className = "fb";
        fb.textContent = "Tip: check the subject (he/she/they) then choose am/is/are.";

        sel.onchange = function () {
          updateScore(0, 1);
          var ok = (sel.value === item.ans);
          sel.classList.remove("good", "bad");
          if (ok) {
            updateScore(1, 0);
            sel.classList.add("good");
            fb.className = "fb good";
            fb.textContent = "Correct. " + item.why;
          } else {
            sel.classList.add("bad");
            fb.className = "fb bad";
            fb.textContent = "Not quite. Hint: " + item.why;
          }
        };

        row.appendChild(sel);
        wrap.appendChild(row);
        wrap.appendChild(fb);
        container.appendChild(wrap);
      }(items[i]));
    }
  }

  function renderTenseMCQ() {
    var items = [
      { stem:"Live action: 'He ____ now!'", opts:["is shooting","shoots","shot"], ans:0, why:"Now = Present Continuous." },
      { stem:"Habit: 'He ____ every weekend.'", opts:["plays","is playing","played"], ans:0, why:"Habit = Present Simple." },
      { stem:"Live action: 'They ____ high.'", opts:["are pressing","press","pressed"], ans:0, why:"Right now = Present Continuous." },
      { stem:"Rule: 'A referee ____ the match.'", opts:["controls","is controlling","controlled"], ans:0, why:"General truth = Present Simple." }
    ];
    $("#timerPrompt").textContent =
      "Speak using Present Continuous:\n" +
      "- Describe 6 actions in a row.\n" +
      "- Use at least 2 team phrases: 'They are pressing', 'He is tracking back'.\n" +
      "- End with a quick prediction: 'I think we will score soon.'";
    renderMCQ($("#tenseMCQ"), items);
  }

  function renderDialBox() {
    var fr = state.fr ? "\nFR: match=game, pitch=field, kit=jersey, draw=tie." : "";
    var txt = "";
    if (state.dialect === "us") txt = "US focus:\n- game\n- field\n- jersey\n- tie\n- shots on goal";
    else if (state.dialect === "uk") txt = "UK focus:\n- match\n- pitch\n- kit\n- draw\n- shots on target";
    else txt = "US + UK:\n- match/game\n- pitch/field\n- kit/jersey\n- draw/tie\n- shots on goal/on target";
    $("#dialBox").textContent = txt + fr;
  }

  function addToNotes(line) {
    var notes = $("#notes");
    notes.value = (notes.value ? notes.value.replace(/\s+$/, "") + "\n" : "") + line;
    $("#notesFb").className = "fb good";
    $("#notesFb").textContent = "Added.";
  }

  function renderPhrases() {
    var fr = state.fr;
    var neutral = [
      "He is carrying the ball forward.",
      "They are building from the back.",
      "The goalkeeper is claiming it comfortably.",
      "The defender is tracking back quickly.",
      "They are keeping possession well."
    ];
    var excited = [
      "He is dribbling past one, past two!",
      "He is lining up the shot...",
      "He is hitting it first time!",
      "The keeper is saving it brilliantly!",
      "They are celebrating the goal!"
    ];
    if (fr) {
      neutral.push("FR: Il progresse avec le ballon.");
      excited.push("FR: Il dribble ! Il frappe ! Quel arret !");
    }
    $("#neutralPhrases").textContent = neutral.join("\n");
    $("#excitedPhrases").textContent = excited.join("\n");
  }

  function renderFeed() {
    $("#liveFeed").textContent = state.feed.join("\n") || "Tap an action to generate live commentary.";
  }

  function pushFeed(line) {
    state.feed.push(line);
    if (state.feed.length > 18) state.feed.shift();
    renderFeed();
  }

  function liveLine(action) {
    if (action === "pass") return "He is passing the ball quickly.";
    if (action === "dribble") return "He is dribbling into space.";
    if (action === "cross") return "He is crossing into the box.";
    if (action === "shoot") return "He is shooting from outside the box!";
    if (action === "save") return "The goalkeeper is saving it!";
    if (action === "tackle") return "He is making a strong tackle.";
    if (action === "press") return "They are pressing high and forcing a mistake.";
    if (action === "score") return "They are scoring! The crowd is reacting!";
    return "They are playing well.";
  }

  function renderPCFill() {
    var w = matchWord();
    var items = [
      { stem:"He ____ right now.", opts:["is dribbling","dribbles","dribbled"], ans:"is dribbling", why:"Now = Present Continuous." },
      { stem:"They ____ high.", opts:["are pressing","press","pressed"], ans:"are pressing", why:"They = are + verb-ing." },
      { stem:"The goalkeeper ____ it!", opts:["is saving","saves","saved"], ans:"is saving", why:"He/She/It = is + verb-ing." },
      { stem:"We ____ the " + w + " tonight.", opts:["are watching","watch","watched"], ans:"are watching", why:"We = are + verb-ing." }
    ];
    renderFill($("#pcFill"), items);
  }

  function renderDialMCQ() {
    var items = [
      { stem:"UK word for 'field' is…", opts:["pitch","kit","draw"], ans:0, why:"Pitch = UK." },
      { stem:"US word for 'match' is…", opts:["game","fixture","possession"], ans:0, why:"Game = US." },
      { stem:"UK 'draw' = US…", opts:["tie","jersey","overtime"], ans:0, why:"Draw = tie." }
    ];
    renderMCQ($("#dialMCQ"), items);
  }

  function renderMixedFill() {
    var w = matchWord();
    var items = [
      { stem:"Right now, he ____ into the box.", opts:["is crossing","crosses","crossed"], ans:"is crossing", why:"Now = Present Continuous." },
      { stem:"I think we ____ score soon.", opts:["will","are","did"], ans:"will", why:"Will = prediction." },
      { stem:"Next weekend, I'm going to ____ another " + w + ".", opts:["watch","watching","watched"], ans:"watch", why:"going to + base verb." }
    ];
    renderFill($("#mixedFill"), items);
  }

  function builderFields(gridId, fields) {
    var grid = $(gridId);
    grid.innerHTML = "";
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var div = document.createElement("div");
      if (f.type === "select") {
        var opts = "";
        for (var k = 0; k < f.options.length; k++) {
          opts += '<option value="' + f.options[k] + '">' + f.options[k] + '</option>';
        }
        div.innerHTML =
          '<label class="lbl">' + f.label + '</label>' +
          '<select class="select" id="' + f.id + '">' + opts + '</select>';
      } else {
        div.innerHTML =
          '<label class="lbl">' + f.label + '</label>' +
          '<input class="input" id="' + f.id + '" placeholder="' + f.ph + '">';
      }
      grid.appendChild(div);
    }
  }

  function renderBuilders() {
    builderFields("#bAGrid", [
      {id:"ba_team", label:"Team / player", type:"text", ph:"My team / The striker"},
      {id:"ba_seq1", label:"Action 1", type:"select", options:["is passing","is dribbling","is pressing","is crossing"]},
      {id:"ba_seq2", label:"Action 2", type:"select", options:["is breaking forward","is finding space","is moving into the box","is shooting"]},
      {id:"ba_seq3", label:"Action 3", type:"select", options:["is forcing a save","is winning the ball back","is creating a chance","is scoring"]},
      {id:"ba_end", label:"Reaction", type:"select", options:["The crowd is cheering.","The fans are reacting loudly.","The referee is watching closely.","The goalkeeper is frustrated."]}
    ]);

    builderFields("#bBGrid", [
      {id:"bb_pred", label:"Prediction (will)", type:"select", options:["will score soon","will win 2-1","will equalize","will keep a clean sheet"]},
      {id:"bb_plan", label:"Plan (going to)", type:"select", options:["am going to watch the next match/game","am going to meet friends to watch it","am going to stream the highlights","am going to practise commentary"]},
      {id:"bb_time", label:"Time detail", type:"text", ph:"tonight / this weekend / next Saturday"},
      {id:"bb_close", label:"Closing line", type:"select", options:["Does that work for you?","Let me know what you think.","Please confirm the time.","See you then."]}
    ]);
  }

  function buildA() {
    var team = ($("#ba_team").value || "My team").trim();
    var a1 = $("#ba_seq1").value;
    var a2 = $("#ba_seq2").value;
    var a3 = $("#ba_seq3").value;
    var end = $("#ba_end").value;

    var out = "";
    if (state.level === "a2") {
      out = team + " " + a1 + ".\n" + team + " " + a2 + ".\n" + team + " " + a3 + ".\n" + end;
    } else if (state.level === "b1") {
      out = team + " " + a1 + ", and they " + a2 + ".\nNow they " + a3 + ".\n" + end;
    } else {
      out = team + " " + a1 + ", and they " + a2 + ".\nThey're keeping the pressure on, and they " + a3 + ".\n" + end + "\nThat's a great sequence of play.";
    }
    $("#bAOut").textContent = out;
    return out;
  }

  function buildB() {
    var pred = $("#bb_pred").value;
    var plan = $("#bb_plan").value;
    var time = ($("#bb_time").value || "this weekend").trim();
    var close = $("#bb_close").value;

    var out = "";
    if (state.level === "a2") {
      out = "I think we " + pred + ".\nI " + plan + " " + time + ".\n" + close;
    } else if (state.level === "b1") {
      out = "I think we " + pred + ".\nI'm also planning: I " + plan + " " + time + ".\n" + close;
    } else {
      out = "Based on the momentum, I think we " + pred + ".\nAfter the match, I " + plan + " " + time + " to keep practising.\n" + close;
    }
    $("#bBOut").textContent = out;
    return out;
  }

  function init() {
    $("#jsStatus").textContent = "JS: OK";

    renderWarmup();
    renderPCGuide();
    renderPCWhen();
    renderDialBox();
    renderPhrases();
    renderTenseMCQ();
    renderPCFill();
    renderDialMCQ();
    renderMixedFill();
    renderBuilders();

    state.feed = [];
    renderFeed();

    $("#printPage").onclick = function () { window.print(); };
    $("#resetAll").onclick = function () { window.location.reload(); };

    $("#dialBoth").onclick = function () { setDialect("both"); };
    $("#dialUS").onclick = function () { setDialect("us"); };
    $("#dialUK").onclick = function () { setDialect("uk"); };

    $("#frToggle").onclick = function () { setFR(!state.fr); };

    $("#accentUS").onclick = function () { setAccent("US"); };
    $("#accentUK").onclick = function () { setAccent("UK"); };

    $("#level").onchange = function () { setLevel($("#level").value); };

    $("#listenWarmup").onclick = function () { speak($("#warmupBox").textContent); };
    $("#listenFeed").onclick = function () { speak($("#liveFeed").textContent); };
    $("#copyFeed").onclick = function () { copyText($("#liveFeed").textContent); };
    $("#clearFeed").onclick = function () { state.feed = []; renderFeed(); };

    $("#listenNotes").onclick = function () { speak($("#notes").value || ""); };
    $("#copyNotes").onclick = function () { copyText($("#notes").value || ""); };
    $("#clearNotes").onclick = function () { $("#notes").value = ""; $("#notesFb").className="fb"; $("#notesFb").textContent="Cleared."; };

    $("#listenNeutral").onclick = function () { speak($("#neutralPhrases").textContent); };
    $("#listenExcited").onclick = function () { speak($("#excitedPhrases").textContent); };
    $("#addNeutral").onclick = function () { addToNotes($("#neutralPhrases").textContent); };
    $("#addExcited").onclick = function () { addToNotes($("#excitedPhrases").textContent); };

    $("#timer30").onclick = function () { startTimer(30); };
    $("#timer60").onclick = function () { startTimer(60); };
    $("#timer90").onclick = function () { startTimer(90); };
    $("#timerStop").onclick = function () { stopTimer(); };

    $("#bABuild").onclick = function () { var t = buildA(); addToNotes(t); };
    $("#bAListen").onclick = function () { speak($("#bAOut").textContent); };
    $("#bACopy").onclick = function () { copyText($("#bAOut").textContent); };

    $("#bBBuild").onclick = function () { var t = buildB(); addToNotes(t); };
    $("#bBListen").onclick = function () { speak($("#bBOut").textContent); };
    $("#bBCopy").onclick = function () { copyText($("#bBOut").textContent); };

    $("#evPass").onclick = function () { pushFeed(liveLine("pass")); };
    $("#evDribble").onclick = function () { pushFeed(liveLine("dribble")); };
    $("#evCross").onclick = function () { pushFeed(liveLine("cross")); };
    $("#evShoot").onclick = function () { pushFeed(liveLine("shoot")); };
    $("#evSave").onclick = function () { pushFeed(liveLine("save")); };
    $("#evTackle").onclick = function () { pushFeed(liveLine("tackle")); };
    $("#evPress").onclick = function () { pushFeed(liveLine("press")); };
    $("#evScore").onclick = function () { pushFeed(liveLine("score")); };

    setFR(false);
    setDialect("both");
    setAccent("US");
    setLevel($("#level").value);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

}());
