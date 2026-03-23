/* jshint esversion: 5 */
/* global speechSynthesis, SpeechSynthesisUtterance */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) {
    var nodes = (root || document).querySelectorAll(sel);
    var arr = [], i;
    for (i = 0; i < nodes.length; i++) arr.push(nodes[i]);
    return arr;
  }

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var state = {
    level: "b1",
    dialect: "both",
    fr: false,
    accent: "US",
    scoreC: 0,
    scoreT: 0,
    timerId: null,
    timerT: 0,
    dlgAIdx: 0,
    dlgBIdx: 0
  };

  function setStatus(txt) {
    var el = $("#jsStatus");
    if (el) el.textContent = txt;
  }

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
      for (j = 0; j < want.length; j++) {
        if (lang.indexOf(want[j]) !== -1) return vs[i];
      }
    }
    for (i = 0; i < vs.length; i++) {
      lang = (vs[i].lang || "").toLowerCase();
      for (j = 0; j < fb.length; j++) {
        if (lang.indexOf(fb[j]) !== -1) return vs[i];
      }
    }
    return vs[0];
  }

  function speak(text) {
    if (!speechSupported()) return;
    stopSpeech();
    var utter = new SpeechSynthesisUtterance(String(text || ""));
    var voice = pickVoice(state.accent);
    if (voice) utter.voice = voice;
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    speechSynthesis.speak(utter);
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

  function addToNotes(line) {
    var notes = $("#notes");
    notes.value = (notes.value ? notes.value.replace(/\s+$/, "") + "\n" : "") + line;
    $("#notesFb").className = "fb good";
    $("#notesFb").textContent = "Added.";
  }

  function matchWord() {
    if (state.dialect === "uk") return "match";
    if (state.dialect === "us") return "game";
    return "match/game";
  }

  function fieldWord() {
    if (state.dialect === "uk") return "pitch";
    if (state.dialect === "us") return "field";
    return "pitch/field";
  }

  function drawWord() {
    if (state.dialect === "uk") return "draw";
    if (state.dialect === "us") return "tie";
    return "draw/tie";
  }

  function buildPlanPhrase(style, verbPhrase) {
    if (style === "going to") return "going to " + verbPhrase;
    if (style === "plan to") return "planning to " + verbPhrase;
    if (style === "present continuous") return verbPhrase.replace(/^watch\b/, "watching");
    return verbPhrase;
  }

  function withPronoun(subject, phrase) {
    var sub = (subject || "I").trim();
    if (!sub) sub = "I";
    if (/^i$/i.test(sub)) return "I'm " + phrase;
    if (/^we$/i.test(sub)) return "We're " + phrase;
    if (/^they$/i.test(sub)) return "They're " + phrase;
    if (/^you$/i.test(sub)) return "You're " + phrase;
    return sub + " is " + phrase;
  }

  function warmupText() {
    var w = matchWord();
    var f = fieldWord();
    var d = drawWord();
    return "Non-fan survival guide:\n"
      + "1) In US English, people usually say game, soccer field, jersey and tie. In UK English, people often say match, pitch, kit and draw.\n"
      + "2) A soccer match usually has two halves. The main objective is simple: score more goals than the other team.\n"
      + "3) A goalkeeper protects the goal. Defenders stop attacks. Midfielders connect defense and attack. Forwards/strikers try to score.\n"
      + "4) If there is no winner, the result is a " + d + ". If one team scores more, that team wins.\n"
      + "5) Today we will talk about the next " + w + ", where we are watching it, what we think will happen, and what movie plans come next.\n\n"
      + "Quick fan sentence you can understand: 'We're meeting at 8 to watch the " + w + ". I think our striker will score, but it could still end in a " + d + ".'\n"
      + "Quick setting sentence: 'The players are on the " + f + ", the referee starts the game, and the fans begin to cheer.'";
  }

  function futureGuideText() {
    var w = matchWord();
    return "1) be going to + verb  → intention / plan already in your mind\n"
      + "   Use it when you have decided something.\n"
      + "   Example: I'm going to watch the " + w + " tonight.\n"
      + "   Signal idea: you already intend to do it.\n\n"
      + "2) present continuous  → arranged plan / fixed plan\n"
      + "   Use it when the plan feels organized: time, place, people, tickets, booking.\n"
      + "   Example: I'm meeting my friends at 8. We're watching the game together.\n"
      + "   Signal idea: the arrangement is already in place.\n\n"
      + "3) will + base verb  → prediction / opinion / instant decision\n"
      + "   Use it for what you think will happen, not for a plan you already organized.\n"
      + "   Example: I think our team will win 2-1.\n"
      + "   Signal words: I think, probably, maybe, I'm sure.\n\n"
      + "4) plan to + verb / plan on + -ing  → intention with a more explicit planning idea\n"
      + "   plan to watch = slightly cleaner / more formal\n"
      + "   plan on watching = very common in spoken English\n"
      + "   Example: I plan to watch the highlights later.\n"
      + "   Example: I'm planning on watching the movie after the match.";
  }

  function planGuideText() {
    return "How to choose the form:\n\n"
      + "A) I'm going to visit Boston.\n"
      + "   → I have the intention. The plan exists in my head.\n\n"
      + "B) I'm visiting Boston next Friday.\n"
      + "   → The trip feels organized or booked.\n\n"
      + "C) I plan to visit Boston this summer.\n"
      + "   → Slightly more structured / neutral. Good for speaking or writing.\n\n"
      + "D) I'm planning on visiting Boston this summer.\n"
      + "   → Natural spoken English.\n\n"
      + "Important pattern:\n"
      + "plan to + base verb → plan to watch / plan to visit\n"
      + "plan on + -ing → plan on watching / plan on visiting\n\n"
      + "Fast memory trick:\n"
      + "decision in my head = going to\n"
      + "organized arrangement = present continuous\n"
      + "prediction/opinion = will\n"
      + "explicit planning language = plan to / plan on";
  }

  var VOCAB = {
    basics: [
      {
        uk: "match",
        us: "game",
        fr: "match / partie",
        def: "The full event between two teams.",
        ex: "We're watching the match tonight. / We're watching the game tonight.",
        note: "This is one of the biggest US/UK differences. A fan in England will often say match. In the US, game is more natural."
      },
      {
        uk: "pitch",
        us: "soccer field",
        fr: "terrain",
        def: "The surface where the players play.",
        ex: "The pitch is wet. / The soccer field is wet.",
        note: "Pitch does not mean the same thing as a musical pitch here. In soccer, it simply means the field."
      },
      {
        uk: "goal",
        us: "goal",
        fr: "but",
        def: "A point scored when the ball fully crosses the goal line inside the net.",
        ex: "They scored a late goal in the 89th minute.",
        note: "Fans talk about goals all the time. If a team scores more goals, it wins."
      },
      {
        uk: "draw",
        us: "tie",
        fr: "match nul",
        def: "A result with no winner because both teams finish with the same score.",
        ex: "It ended in a draw. / It ended in a tie.",
        note: "Useful when somebody says the game finished 1-1 or 0-0."
      },
      {
        uk: "kit",
        us: "uniform / jersey",
        fr: "tenue / maillot",
        def: "The clothes the players wear during the match.",
        ex: "He bought the new kit. / He bought the new jersey.",
        note: "Kit can mean the full set: shirt, shorts and socks."
      },
      {
        uk: "goalkeeper",
        us: "goalkeeper",
        fr: "gardien",
        def: "The player who protects the goal and can use his hands inside the penalty area.",
        ex: "The goalkeeper made a great save.",
        note: "If you hear save, it usually involves the goalkeeper stopping a shot."
      },
      {
        uk: "half-time",
        us: "halftime",
        fr: "mi-temps",
        def: "The break between the first half and the second half.",
        ex: "It was 1-0 at half-time.",
        note: "A lot of fans discuss the match again at half-time because the teams can still change the result."
      },
      {
        uk: "fixture",
        us: "scheduled game",
        fr: "match programmé / rencontre à venir",
        def: "A match that has been scheduled on the calendar.",
        ex: "Our next fixture is on Saturday.",
        note: "Useful when talking about future plans and the next game."
      }
    ],
    positions: [
      {
        uk: "defender",
        us: "defender",
        fr: "défenseur",
        def: "A player whose main job is to stop attacks and protect the goal.",
        ex: "The defenders stayed compact and calm.",
        note: "If a team is under pressure, people often talk about the defenders first."
      },
      {
        uk: "midfielder",
        us: "midfielder",
        fr: "milieu",
        def: "A player who connects defense and attack and often controls the rhythm of the game.",
        ex: "Our midfielder controlled the tempo.",
        note: "Tempo means speed and rhythm of play."
      },
      {
        uk: "forward / striker",
        us: "forward / striker",
        fr: "attaquant",
        def: "An attacking player whose main job is to create or score goals.",
        ex: "The striker scored twice.",
        note: "Striker is especially common when the player is a main scorer."
      },
      {
        uk: "captain",
        us: "captain",
        fr: "capitaine",
        def: "The team leader on the field.",
        ex: "The captain spoke to the referee.",
        note: "The captain often represents the team during tense moments."
      },
      {
        uk: "substitute",
        us: "substitute / bench player",
        fr: "remplaçant",
        def: "A player who starts off the field and can come on later.",
        ex: "The substitute changed the match after coming on.",
        note: "Come on here means enter the game, not encourage somebody."
      }
    ],
    actions: [
      {
        uk: "pass",
        us: "pass",
        fr: "passe",
        def: "To send the ball to a teammate.",
        ex: "He passed the ball quickly to the winger.",
        note: "A simple pass is one of the most basic actions in soccer."
      },
      {
        uk: "cross",
        us: "cross",
        fr: "centre",
        def: "To send the ball from the side into the middle near the goal.",
        ex: "She delivered a perfect cross into the box.",
        note: "The box means the penalty area, the dangerous zone near goal."
      },
      {
        uk: "shoot",
        us: "shoot",
        fr: "tirer",
        def: "To kick the ball toward the goal in order to score.",
        ex: "He shot from outside the box.",
        note: "If a player shoots well, fans notice."
      },
      {
        uk: "score",
        us: "score",
        fr: "marquer",
        def: "To get a goal.",
        ex: "She scored in the 89th minute.",
        note: "Score can be a verb and also part of the phrase final score."
      },
      {
        uk: "tackle",
        us: "tackle",
        fr: "tacle",
        def: "To try to take the ball from an opponent.",
        ex: "That was a clean tackle.",
        note: "Clean means legal and fair, not a foul."
      },
      {
        uk: "save",
        us: "save",
        fr: "arrêt",
        def: "A stop made by the goalkeeper.",
        ex: "What a save from the goalkeeper!",
        note: "This often stops a goal and can change the whole game."
      },
      {
        uk: "clear the ball",
        us: "clear the ball",
        fr: "dégager le ballon",
        def: "To kick the ball away from danger.",
        ex: "The defender cleared the ball after the corner.",
        note: "Useful when a team is under pressure near its own goal."
      }
    ],
    rules: [
      {
        uk: "referee",
        us: "referee",
        fr: "arbitre",
        def: "The official who controls the match and applies the rules.",
        ex: "The referee added five minutes.",
        note: "Added time means extra minutes at the end of a half."
      },
      {
        uk: "offside",
        us: "offside",
        fr: "hors-jeu",
        def: "An illegal attacking position when a player is too far forward at the wrong moment.",
        ex: "He was offside when the pass came.",
        note: "This is one of the most confusing rules for non-fans, so it is completely normal if you need repetition."
      },
      {
        uk: "foul",
        us: "foul",
        fr: "faute",
        def: "Illegal contact or unfair action against another player.",
        ex: "That was a clear foul near the box.",
        note: "If you hear clear foul, the speaker strongly believes the referee should punish it."
      },
      {
        uk: "yellow card",
        us: "yellow card",
        fr: "carton jaune",
        def: "An official warning to a player.",
        ex: "He received a yellow card for the tackle.",
        note: "A yellow card is serious but the player can stay in the game."
      },
      {
        uk: "red card",
        us: "red card",
        fr: "carton rouge",
        def: "A punishment that sends a player off the field.",
        ex: "She got a red card and had to leave the pitch.",
        note: "After a red card, the team usually has one fewer player."
      },
      {
        uk: "penalty",
        us: "penalty kick",
        fr: "penalty",
        def: "A special kick taken from the penalty spot after a serious foul in the box.",
        ex: "They won a penalty in the second half.",
        note: "A penalty is one of the highest-pressure moments in soccer."
      },
      {
        uk: "free kick",
        us: "free kick",
        fr: "coup franc",
        def: "A kick awarded after a foul.",
        ex: "He scored directly from a free kick.",
        note: "Directly means the ball went straight into the goal."
      }
    ],
    fan: [
      {
        uk: "supporter",
        us: "fan",
        fr: "supporter",
        def: "A person who follows and supports a team.",
        ex: "He's a Liverpool supporter. / He's a Liverpool fan.",
        note: "Supporter is more typical in the UK. Fan is common everywhere."
      },
      {
        uk: "chant",
        us: "chant",
        fr: "chant de supporters / chanter",
        def: "A repeated song or phrase shouted by fans.",
        ex: "They chanted all through the second half.",
        note: "A chant is louder and more repetitive than ordinary cheering."
      },
      {
        uk: "cheer",
        us: "cheer",
        fr: "encourager / applaudir",
        def: "To show support with your voice.",
        ex: "The crowd cheered after the goal.",
        note: "Cheer can be a verb or part of fan atmosphere."
      },
      {
        uk: "to be gutted",
        us: "to be disappointed",
        fr: "être dégoûté / très déçu",
        def: "To feel very bad after a poor result.",
        ex: "They were gutted after losing in extra time.",
        note: "Gutted is very common in UK fan talk, but disappointed is safer for exam English."
      },
      {
        uk: "we dominated",
        us: "we controlled the game",
        fr: "on a dominé",
        def: "Our team was stronger for most of the match.",
        ex: "We controlled the game in the second half.",
        note: "This usually refers to possession, chances and general control."
      },
      {
        uk: "great finish",
        us: "great shot / great finish",
        fr: "belle finition",
        def: "A very good final action that results in a goal.",
        ex: "That was a great finish into the top corner.",
        note: "Finish focuses on the final scoring touch."
      }
    ],
    stats: [
      {
        uk: "possession",
        us: "possession",
        fr: "possession",
        def: "The percentage of time a team has the ball.",
        ex: "They had 60% possession.",
        note: "More possession does not always mean more goals, but fans talk about it a lot."
      },
      {
        uk: "shots on target",
        us: "shots on goal",
        fr: "tirs cadrés",
        def: "Shots that would have gone in if the goalkeeper had not stopped them.",
        ex: "We had five shots on target. / We had five shots on goal.",
        note: "This is more useful than total shots because it shows real danger."
      },
      {
        uk: "scoreline",
        us: "final score",
        fr: "score final",
        def: "The final result of the match.",
        ex: "The scoreline was 2-1.",
        note: "Scoreline is more British. Final score is clearer for many learners."
      },
      {
        uk: "clean sheet",
        us: "shutout",
        fr: "match sans encaisser de but",
        def: "A game where a team concedes zero goals.",
        ex: "They kept a clean sheet.",
        note: "If you hear 'kept a clean sheet', it means the defense and goalkeeper allowed no goals."
      },
      {
        uk: "extra time",
        us: "overtime",
        fr: "prolongations",
        def: "Additional playing time after a draw in certain competitions.",
        ex: "It went to extra time. / It went to overtime.",
        note: "Not every match uses extra time, but knockout competitions often do."
      },
      {
        uk: "injury time",
        us: "stoppage time",
        fr: "temps additionnel",
        def: "Extra minutes added because of stoppages during the half.",
        ex: "They scored in injury time.",
        note: "This is the dramatic final period fans talk about a lot."
      }
    ],
    movies: [
      {
        uk: "cinema",
        us: "movie theater",
        fr: "cinéma",
        def: "The place where people go to watch films/movies.",
        ex: "I'm going to the cinema on Friday. / I'm going to the movie theater on Friday.",
        note: "Useful because this lesson mixes soccer plans and weekend movie plans."
      },
      {
        uk: "film",
        us: "movie",
        fr: "film",
        def: "A story you watch on a screen.",
        ex: "I plan to watch a film this weekend. / I plan to watch a movie this weekend.",
        note: "Film is common in the UK and also accepted in the US, but movie is more everyday US speech."
      },
      {
        uk: "trailer",
        us: "trailer",
        fr: "bande-annonce",
        def: "A short preview of a film or movie.",
        ex: "The trailer looks amazing.",
        note: "You can use this naturally in dialogue about weekend plans."
      },
      {
        uk: "release date",
        us: "release date",
        fr: "date de sortie",
        def: "The date when a movie becomes available.",
        ex: "The release date is next month.",
        note: "Good for future tense predictions and plans."
      },
      {
        uk: "to stream",
        us: "to stream",
        fr: "streamer / regarder en streaming",
        def: "To watch something online instead of going to the cinema.",
        ex: "We're streaming it tonight.",
        note: "This is a very modern everyday verb."
      },
      {
        uk: "sequel",
        us: "sequel",
        fr: "suite",
        def: "A later film that continues the story of an earlier one.",
        ex: "The sequel is coming out next year.",
        note: "Excellent for using future forms like will or going to."
      }
    ]
  };

  function vocabLegend() {
    return "Every vocabulary card shows:\n"
      + "- UK term\n"
      + "- US term\n"
      + "- French translation\n"
      + "- Clear meaning\n"
      + "- Example sentence\n"
      + "- Why it matters / what a fan usually means\n\n"
      + "Tap Add to Notes to save useful expressions for the builders and speaking tasks.";
  }

  function formatTermCard(item) {
    var frExtra = state.fr ? ('<div class="frExtraBox">FR extra: ' + escapeHTML(item.frExtra || ("En français: " + item.fr + ". Utilise ce mot pour reconnaître l'idée dans une conversation.")) + '</div>') : "";
    return ''
      + '<div class="vCard">'
      +   '<div class="vTop">'
      +     '<div class="vTerm">' + escapeHTML(item.uk + " / " + item.us) + '</div>'
      +     '<div class="vMeta">UK + US</div>'
      +   '</div>'
      +   '<div class="vGrid">'
      +     '<div class="vLabel">UK</div><div class="vValue">' + escapeHTML(item.uk) + '</div>'
      +     '<div class="vLabel">US</div><div class="vValue">' + escapeHTML(item.us) + '</div>'
      +     '<div class="vLabel">FR</div><div class="vValue">' + escapeHTML(item.fr) + '</div>'
      +     '<div class="vLabel">Meaning</div><div class="vValue">' + escapeHTML(item.def) + '</div>'
      +     '<div class="vLabel">Example</div><div class="vValue">' + escapeHTML(item.ex) + '</div>'
      +   '</div>'
      +   '<div class="vNote">Why it matters: ' + escapeHTML(item.note) + '</div>'
      +   frExtra
      +   '<div class="vBtnRow noPrint">'
      +     '<button class="vBtn" type="button" data-add="* ' + escapeHTML(item.uk + ' / ' + item.us + ' = ' + item.fr) + '">Add to Notes</button>'
      +     '<button class="vBtn" type="button" data-say="' + escapeHTML(item.uk) + '">Listen UK</button>'
      +     '<button class="vBtn" type="button" data-say="' + escapeHTML(item.us) + '">Listen US</button>'
      +   '</div>'
      + '</div>';
  }

  function renderVocab() {
    var cat = $("#vocabCategory").value;
    var search = ($("#vocabSearch").value || "").toLowerCase().trim();
    var list = VOCAB[cat] || [];
    var out = [];
    var i;

    for (i = 0; i < list.length; i++) {
      var item = list[i];
      var blob = (item.uk + " " + item.us + " " + item.fr + " " + item.def + " " + item.ex + " " + item.note).toLowerCase();
      if (search && blob.indexOf(search) === -1) continue;
      out.push(formatTermCard(item));
    }

    $("#vocabList").innerHTML = out.join("") || '<div class="fb warn">No results. Try another word.</div>';
    $("#vocabList").onclick = function (e) {
      var target = e.target;
      var add = target.getAttribute("data-add");
      var say = target.getAttribute("data-say");
      if (add) addToNotes(add);
      if (say) speak(say);
    };
  }

  function renderMCQ(container, items) {
    container.innerHTML = "";
    var answered = {};

    for (var i = 0; i < items.length; i++) {
      (function (q, qi) {
        var el = document.createElement("div");
        el.className = "q";
        el.innerHTML = ''
          + '<div class="qStem">' + escapeHTML(q.stem) + '</div>'
          + '<div class="opt"></div>'
          + '<div class="explain" style="display:none;"></div>';

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
              if (ok) {
                updateScore(1, 0);
                b.classList.add("is-correct");
              } else {
                b.classList.add("is-wrong");
                var choices = $all(".choice", el);
                if (choices[q.ans]) choices[q.ans].classList.add("is-correct");
              }
              exp.style.display = "block";
              exp.textContent = (ok ? "Correct. " : "Not quite. ") + q.why;
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
        row.innerHTML = '<div class="muted">' + escapeHTML(item.stem) + '</div>';

        var sel = document.createElement("select");
        sel.className = "select inpSmall";

        var o0 = document.createElement("option");
        o0.value = "";
        o0.textContent = "Choose…";
        sel.appendChild(o0);

        for (var k = 0; k < item.opts.length; k++) {
          var op = document.createElement("option");
          op.value = item.opts[k];
          op.textContent = item.opts[k];
          sel.appendChild(op);
        }

        var fb = document.createElement("div");
        fb.className = "fb";
        fb.textContent = "Tip: choose the form that matches the meaning.";

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
            fb.textContent = "Not quite. " + item.why;
          }
        };

        row.appendChild(sel);
        wrap.appendChild(row);
        wrap.appendChild(fb);
        container.appendChild(wrap);
      }(items[i]));
    }
  }

  function makeFutureItems() {
    var w = matchWord();
    return [
      {
        stem: "I already bought the tickets. I ____ the " + w + " on Saturday.",
        opts: ["am watching", "will watch", "watch"],
        ans: 0,
        why: "Present continuous works because the arrangement is already fixed."
      },
      {
        stem: "Look at the dark clouds. It ____ soon.",
        opts: ["is going to rain", "will rain", "rains"],
        ans: 0,
        why: "Going to fits because there is visible evidence now."
      },
      {
        stem: "I think our striker ____ tonight.",
        opts: ["will score", "is scoring", "scored"],
        ans: 0,
        why: "Will fits a prediction or opinion."
      },
      {
        stem: "I ____ watch the highlights later.",
        opts: ["plan to", "plan on", "am plan to"],
        ans: 0,
        why: "plan to + base verb is the correct form."
      }
    ];
  }

  function makePlanFillItems() {
    return [
      {
        stem: "More formal: I ____ watch the match after dinner.",
        opts: ["plan to", "plan on", "planning to"],
        ans: "plan to",
        why: "After I, plan to + base verb is correct."
      },
      {
        stem: "Common spoken English: I'm planning on ____ the game with friends.",
        opts: ["watching", "watch", "watched"],
        ans: "watching",
        why: "plan on must be followed by -ing."
      },
      {
        stem: "Arrangement already decided: I'm ____ my friend at 8.",
        opts: ["meeting", "meet", "met"],
        ans: "meeting",
        why: "Present continuous is natural for arranged plans."
      },
      {
        stem: "Simple intention: I'm going to ____ a movie after the match.",
        opts: ["watch", "watching", "watched"],
        ans: "watch",
        why: "going to is followed by the base verb."
      }
    ];
  }

  var DLG_A = {
    context: "Two friends are planning the next match/game. Read the line, then choose the most natural reply.",
    turns: [
      {
        who: "A",
        line: "So, are you free on Saturday night? There's a big match/game.",
        replies: [
          { t: "Yes. I'm watching it at my place. Want to join?", ok: 1, why: "Excellent. Present continuous = arranged plan." },
          { t: "Yes. I will watching it at my place.", ok: 0, why: "Say I will watch or I'm watching." },
          { t: "Yes. I watch it yesterday.", ok: 0, why: "Yesterday is past time, so this does not fit." }
        ]
      },
      {
        who: "B",
        line: "Nice. What time are we meeting?",
        replies: [
          { t: "We're meeting at 8, and we're ordering pizza.", ok: 1, why: "Excellent. The arrangements sound fixed and natural." },
          { t: "We are going meet at 8.", ok: 0, why: "You need are going to meet or are meeting." },
          { t: "We met at 8 tomorrow.", ok: 0, why: "Met is past; tomorrow needs a future form." }
        ]
      },
      {
        who: "A",
        line: "Do you think we'll win?",
        replies: [
          { t: "I think we will win 2-1, but it could be close.", ok: 1, why: "Great prediction with will." },
          { t: "I am winning 2-1.", ok: 0, why: "You are not the team, and this form sounds wrong here." },
          { t: "We win 2-1 yesterday.", ok: 0, why: "Yesterday makes this past, not prediction." }
        ]
      }
    ]
  };

  var DLG_B = {
    context: "After the match/game, they talk about the result and then make plans for the next weekend and a movie.",
    turns: [
      {
        who: "A",
        line: "That was intense. The referee was strict.",
        replies: [
          { t: "Yes, but the decision was fair in the end.", ok: 1, why: "Natural reaction and evaluation." },
          { t: "Yes, referee is strict yesterday.", ok: 0, why: "The article and the tense are both wrong here." },
          { t: "Yes, I'm strict too.", ok: 0, why: "This changes the meaning and does not answer the comment naturally." }
        ]
      },
      {
        who: "B",
        line: "What are you doing next weekend?",
        replies: [
          { t: "I'm going to visit my cousin, then I'm seeing a movie on Sunday.", ok: 1, why: "Good mix of intention and arranged plan." },
          { t: "I visit my cousin tomorrow weekend.", ok: 0, why: "The time expression is wrong and the tense is not natural for a future plan." },
          { t: "I will to visit my cousin.", ok: 0, why: "Say I will visit or I'm going to visit." }
        ]
      },
      {
        who: "A",
        line: "Which movie are you planning to watch?",
        replies: [
          { t: "I plan to watch the new thriller. The trailer looked great.", ok: 1, why: "Perfect structure: plan to + base verb." },
          { t: "I plan on watch the new thriller.", ok: 0, why: "After plan on, use -ing: watching." },
          { t: "I planned watch it next week.", ok: 0, why: "You need planned to watch or plan to watch." }
        ]
      }
    ]
  };

  function renderDialogue(boxId, dlg, idx, fbId) {
    var box = $(boxId);
    box.innerHTML = "";

    for (var i = 0; i <= idx && i < dlg.turns.length; i++) {
      var turn = dlg.turns[i];
      var el = document.createElement("div");
      el.className = "turn";
      el.innerHTML = '<div class="who">' + escapeHTML(turn.who) + '</div><div class="line">' + escapeHTML(turn.line) + '</div>';
      box.appendChild(el);

      if (i === idx) {
        var rr = document.createElement("div");
        rr.className = "replyRow";
        for (var j = 0; j < turn.replies.length; j++) {
          (function (rep) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "reply";
            b.textContent = rep.t;
            b.onclick = function () {
              updateScore(0, 1);
              if (rep.ok) {
                updateScore(1, 0);
                $(fbId).className = "fb good";
                $(fbId).textContent = "Correct. " + rep.why;
                if (boxId === "#dlgA") state.dlgAIdx += 1;
                if (boxId === "#dlgB") state.dlgBIdx += 1;
                renderAllDialogues();
              } else {
                $(fbId).className = "fb bad";
                $(fbId).textContent = "Not quite. " + rep.why;
              }
            };
            rr.appendChild(b);
          }(turn.replies[j]));
        }
        box.appendChild(rr);
      }
    }

    if (idx >= dlg.turns.length) {
      var done = document.createElement("div");
      done.className = "fb good";
      done.textContent = "Done. Reset and try again with the other dialect setting for extra practice.";
      box.appendChild(done);
    }
  }

  function renderAllDialogues() {
    renderDialogue("#dlgA", DLG_A, state.dlgAIdx, "#dlgAFb");
    renderDialogue("#dlgB", DLG_B, state.dlgBIdx, "#dlgBFb");
  }

  function dialogueText(dlg) {
    var lines = [], i;
    for (i = 0; i < dlg.turns.length; i++) {
      lines.push(dlg.turns[i].who + ": " + dlg.turns[i].line);
    }
    return lines.join("\n");
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
          opts += '<option value="' + escapeHTML(f.options[k]) + '">' + escapeHTML(f.options[k]) + '</option>';
        }
        div.innerHTML = '<label class="lbl">' + escapeHTML(f.label) + '</label>' + '<select class="select" id="' + escapeHTML(f.id) + '">' + opts + '</select>';
      } else {
        div.innerHTML = '<label class="lbl">' + escapeHTML(f.label) + '</label>' + '<input class="input" id="' + escapeHTML(f.id) + '" placeholder="' + escapeHTML(f.ph) + '">';
      }
      grid.appendChild(div);
    }
  }

  function buildB1() {
    var who = ($("#b1_who").value || "I").trim();
    var day = ($("#b1_day").value || "Saturday").trim();
    var time = ($("#b1_time").value || "8 p.m.").trim();
    var place = ($("#b1_place").value || "at home").trim();
    var team = ($("#b1_team").value || "my team").trim();
    var plan = $("#b1_plan").value;
    var w = matchWord();
    var firstLine;
    var out;

    if (plan === "going to") {
      firstLine = withPronoun(who, "going to watch the " + w + " on " + day + " at " + time + ".");
    } else {
      firstLine = withPronoun(who, "watching the " + w + " on " + day + " at " + time + ".");
    }

    if (state.level === "a2") {
      out = firstLine + "\n"
        + "I'm meeting friends " + place + ".\n"
        + "I think " + team + " will win.";
    } else if (state.level === "b1") {
      out = firstLine + "\n"
        + "I'm meeting friends " + place + ", and we're going to order food.\n"
        + "I think " + team + " will win, but it might be close.";
    } else {
      out = firstLine + "\n"
        + "I've already arranged to meet friends " + place + ", so the evening is basically planned.\n"
        + "Based on recent form, I think " + team + " will edge it, but it could still end in a " + drawWord() + ".";
    }

    $("#b1Out").textContent = out;
    return out;
  }

  function buildB2() {
    var day = ($("#b2_day").value || "next weekend").trim();
    var soccer = ($("#b2_soccer").value || "watch the match").trim();
    var movie = ($("#b2_movie").value || "see a movie").trim();
    var reason = ($("#b2_reason").value || "to relax").trim();
    var plan = $("#b2_plan").value;
    var p1 = buildPlanPhrase(plan, soccer);
    var p2 = buildPlanPhrase(plan, movie);
    var out;

    if (state.level === "a2") {
      out = "Next " + day + ", I'm " + p1 + ".\n"
        + "Then I'm " + p2 + ".\n"
        + "I'm doing this " + reason + ".";
    } else if (state.level === "b1") {
      out = "Next " + day + ", I'm " + p1 + ", and then I'm " + p2 + ".\n"
        + "I'm doing it " + reason + ", and I want the weekend to stay simple and fun.";
    } else {
      out = "Next " + day + ", I'm " + p1 + ", and then I'm " + p2 + ".\n"
        + "It's a good way " + reason + ", and I want to balance something exciting with something relaxing.";
    }

    $("#b2Out").textContent = out;
    return out;
  }

  function checkWriting(text) {
    var t = (text || "").trim();
    if (!t) return { ok: 0, msg: "Write 4-7 lines. Include the plan, time/place, one prediction, and a confirmation question." };

    var hasFuture = /going to|will|am\s+\w+ing|are\s+\w+ing|plan to|planning on/i.test(t);
    var hasTime = /tomorrow|tonight|next|on\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)|at\s+\d/i.test(t);
    var hasConfirm = /confirm|does that work|just to confirm|let me know|is that ok/i.test(t);
    var hasSoccer = /match|game|soccer|football|team|goal|movie|cinema|theater/i.test(t);

    var msg = "Checklist: "
      + (hasFuture ? "future form ✓, " : "future form ✗, ")
      + (hasTime ? "time detail ✓, " : "time detail ✗, ")
      + (hasConfirm ? "confirmation ✓, " : "confirmation ✗, ")
      + (hasSoccer ? "topic vocab ✓" : "topic vocab ✗");

    return { ok: hasFuture && hasTime && hasConfirm, msg: msg };
  }

  function makeDialItems() {
    return [
      { stem: "UK term for 'soccer field' is…", opts: ["pitch", "kit", "fixture"], ans: 0, why: "Pitch = the playing surface in UK English." },
      { stem: "US term for 'match' is…", opts: ["game", "draw", "captain"], ans: 0, why: "Game is the common everyday US term." },
      { stem: "UK word 'draw' = US word…", opts: ["tie", "uniform", "overtime"], ans: 0, why: "Draw and tie both mean no winner." },
      { stem: "UK 'kit' is closest to US…", opts: ["jersey", "goalkeeper", "possession"], ans: 0, why: "Kit refers to what the player wears." }
    ];
  }

  function makeTenseItems() {
    var w = matchWord();
    return [
      { stem: "Arrangement: 'I already bought tickets. I ____ the " + w + " on Saturday.'", opts: ["am watching", "will watch", "watch"], ans: 0, why: "Present continuous = planned arrangement." },
      { stem: "Prediction: 'I think we ____ tonight.'", opts: ["will win", "are winning", "won"], ans: 0, why: "Will fits a prediction or opinion." },
      { stem: "Intention: 'I'm going to ____ my cousin next weekend.'", opts: ["visit", "visiting", "visited"], ans: 0, why: "going to is followed by the base verb." },
      { stem: "Explicit planning language: 'I ____ watch the highlights later.'", opts: ["plan to", "plan on", "am plan to"], ans: 0, why: "plan to + base verb is correct." }
    ];
  }

  function makeMixedFill() {
    return [
      { stem: "I already arranged it. I am ____ my friend at 8.", opts: ["meeting", "meet", "met"], ans: "meeting", why: "Present continuous fits an arrangement." },
      { stem: "I think it ____ be a close game.", opts: ["will", "am", "did"], ans: "will", why: "Use will for a prediction." },
      { stem: "I'm planning on ____ a movie after the match.", opts: ["watching", "watch", "watched"], ans: "watching", why: "plan on must be followed by -ing." }
    ];
  }

  function speakingPrompts() {
    var w = matchWord();
    return "Speak for 60-120 seconds:\n"
      + "1) Describe your plan for the next " + w + " (time, place, people).\n"
      + "2) Explain one soccer word clearly, as if the listener is not a fan.\n"
      + "3) Make 2 predictions using WILL.\n"
      + "4) Add 1 plan using PLAN TO or PLAN ON.\n"
      + "5) Add 1 movie plan for the weekend.";
  }

  function setDialect(d) {
    state.dialect = d;
    $("#dialBoth").classList.toggle("btn--primary", d === "both");
    $("#dialUS").classList.toggle("btn--primary", d === "us");
    $("#dialUK").classList.toggle("btn--primary", d === "uk");
    $("#dialBoth").setAttribute("aria-pressed", d === "both" ? "true" : "false");
    $("#dialUS").setAttribute("aria-pressed", d === "us" ? "true" : "false");
    $("#dialUK").setAttribute("aria-pressed", d === "uk" ? "true" : "false");

    $("#warmupBox").textContent = warmupText();
    $("#speakingPrompts").textContent = speakingPrompts();
    renderVocab();
    renderAllDialogues();
    renderMCQ($("#dialQuiz"), makeDialItems());
    renderMCQ($("#tenseQuiz"), makeTenseItems());
    renderMCQ($("#futureMCQ"), makeFutureItems());
    renderFill($("#planFill"), makePlanFillItems());
    renderFill($("#mixedFill"), makeMixedFill());
    if ($("#b1Out").textContent) buildB1();
    if ($("#b2Out").textContent) buildB2();
  }

  function setFR(on) {
    state.fr = on;
    $("#frStatus").textContent = on ? "ON" : "OFF";
    renderVocab();
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
    if ($("#b1Out").textContent) buildB1();
    if ($("#b2Out").textContent) buildB2();
  }

  function renderStaticText() {
    $("#warmupBox").textContent = warmupText();
    $("#futureGuide").textContent = futureGuideText();
    $("#planGuide").textContent = planGuideText();
    $("#vocabLegend").textContent = vocabLegend();
    $("#dlgAContext").textContent = DLG_A.context;
    $("#dlgBContext").textContent = DLG_B.context;
    $("#speakingPrompts").textContent = speakingPrompts();
    $("#writingTask").textContent = "Write a short message (4-7 lines) to a friend:\n"
      + "- invite them to watch the match/game\n"
      + "- give the time and place\n"
      + "- add one prediction with will\n"
      + "- add one clear soccer or movie word\n"
      + "- ask for confirmation (Does that work for you? / Please confirm.)";
  }

  function renderBuilders() {
    builderFields("#b1Grid", [
      { id: "b1_who", label: "Subject (I / We)", type: "text", ph: "I" },
      { id: "b1_day", label: "Day", type: "text", ph: "Saturday" },
      { id: "b1_time", label: "Time", type: "text", ph: "8 p.m." },
      { id: "b1_place", label: "Place", type: "text", ph: "at home / at a bar" },
      { id: "b1_team", label: "Team", type: "text", ph: "PSG / Real Madrid" },
      { id: "b1_plan", label: "Main plan form", type: "select", options: ["going to", "present continuous"] }
    ]);

    builderFields("#b2Grid", [
      { id: "b2_day", label: "Time reference", type: "text", ph: "next weekend" },
      { id: "b2_soccer", label: "Soccer plan", type: "text", ph: "watch the match" },
      { id: "b2_movie", label: "Movie plan", type: "text", ph: "see a movie" },
      { id: "b2_reason", label: "Reason", type: "text", ph: "to relax / to celebrate" },
      { id: "b2_plan", label: "Plan style", type: "select", options: ["going to", "plan to"] }
    ]);
  }

  function wire() {
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
    $("#listenNotes").onclick = function () { speak($("#notes").value || ""); };
    $("#copyNotes").onclick = function () { copyText($("#notes").value || ""); };
    $("#clearNotes").onclick = function () {
      $("#notes").value = "";
      $("#notesFb").className = "fb";
      $("#notesFb").textContent = "Cleared.";
    };

    $("#vocabCategory").onchange = renderVocab;
    $("#vocabSearch").oninput = renderVocab;

    $("#dlgAListen").onclick = function () { speak(dialogueText(DLG_A)); };
    $("#dlgBListen").onclick = function () { speak(dialogueText(DLG_B)); };
    $("#dlgAReset").onclick = function () {
      state.dlgAIdx = 0;
      $("#dlgAFb").className = "fb";
      $("#dlgAFb").textContent = "";
      renderAllDialogues();
    };
    $("#dlgBReset").onclick = function () {
      state.dlgBIdx = 0;
      $("#dlgBFb").className = "fb";
      $("#dlgBFb").textContent = "";
      renderAllDialogues();
    };

    $("#timer60").onclick = function () { startTimer(60); };
    $("#timer90").onclick = function () { startTimer(90); };
    $("#timer120").onclick = function () { startTimer(120); };
    $("#timerStop").onclick = function () { stopTimer(); };

    $("#b1Build").onclick = function () { var txt = buildB1(); addToNotes(txt); };
    $("#b1Listen").onclick = function () { speak($("#b1Out").textContent); };
    $("#b1Copy").onclick = function () { copyText($("#b1Out").textContent); };

    $("#b2Build").onclick = function () { var txt = buildB2(); addToNotes(txt); };
    $("#b2Listen").onclick = function () { speak($("#b2Out").textContent); };
    $("#b2Copy").onclick = function () { copyText($("#b2Out").textContent); };

    $("#writingCheck").onclick = function () {
      var res = checkWriting($("#writingBox").value);
      $("#writingFb").className = res.ok ? "fb good" : "fb warn";
      $("#writingFb").textContent = res.msg;
    };
    $("#writingCopy").onclick = function () { copyText($("#writingBox").value || ""); };
  }

  function init() {
    setStatus("JS: OK");
    renderStaticText();
    renderBuilders();
    renderVocab();
    renderAllDialogues();
    renderMCQ($("#dialQuiz"), makeDialItems());
    renderMCQ($("#tenseQuiz"), makeTenseItems());
    renderMCQ($("#futureMCQ"), makeFutureItems());
    renderFill($("#planFill"), makePlanFillItems());
    renderFill($("#mixedFill"), makeMixedFill());
    setFR(false);
    setDialect("both");
    setAccent("US");
    setLevel($("#level").value);
    wire();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
