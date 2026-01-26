/* SpeakEasyTisha — Describe Famous People
   Touch-friendly (Mac + iPad Safari):
   - Flashcards (tap flip) + filters + printable vocab list
   - US/UK TTS (speechSynthesis) + speed control
   - Grammar accordions + examples
   - Exercises: MCQ, Fill-in, Sorting (drag OR tap), Sentence builder (drag OR tap)
   - Paragraph builder + copy + listen
   - Score + localStorage
*/
(function () {
  "use strict";

  // ---------- helpers ----------
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
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function norm(s) { return String(s || "").trim().toLowerCase(); }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function cap(s) { s = String(s || ""); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function cssEscapeSafe(v) {
    try { return CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/[^a-zA-Z0-9_-]/g, "\\$&"); }
    catch (e) { return String(v).replace(/[^a-zA-Z0-9_-]/g, "\\$&"); }
  }

  // ---------- state ----------
  var LS_KEY = "SET_FAMOUS_PEOPLE_V1";
  var DEFAULT_STATE = {
    accent: "en-US",
    rate: 0.95,
    level: "beginner",
    personKey: "actor",
    score: 0,
    selectedVocabCat: "all",
    customName: "",
    customPronoun: "he",
    lastParagraph: ""
  };

  var state = Object.assign({}, DEFAULT_STATE);

  var PEOPLE = {
    actor: {
      key: "actor",
      name: "Tom Hanks",
      role: "Actor (practice profile)",
      knownFor: "Known for many popular movies (practice).",
      pronouns: { subj: "he", obj: "him", poss: "his", be: "is", have: "has", wear: "wears" }
    },
    actress: {
      key: "actress",
      name: "Meryl Streep",
      role: "Actress (practice profile)",
      knownFor: "Known for many famous roles (practice).",
      pronouns: { subj: "she", obj: "her", poss: "her", be: "is", have: "has", wear: "wears" }
    }
  };

  // Vocabulary deck (EN -> FR + definition + example)
  // category: physical | personality | opinion | nouns
  var VOCAB = [
    // Physical
    { id: "hair-short", term: "short hair", fr: "cheveux courts", def: "Hair that is not long.", ex: "He has short hair.", cat: "physical", pos: "noun phrase", icon: "💇" },
    { id: "hair-long", term: "long hair", fr: "cheveux longs", def: "Hair that reaches far down.", ex: "She has long hair.", cat: "physical", pos: "noun phrase", icon: "💇‍♀️" },
    { id: "hair-curly", term: "curly", fr: "bouclé(e)", def: "Hair with curls.", ex: "He has curly hair.", cat: "physical", pos: "adjective", icon: "➰" },
    { id: "hair-straight", term: "straight", fr: "lisse / raide", def: "Hair without curls.", ex: "She has straight hair.", cat: "physical", pos: "adjective", icon: "📏" },
    { id: "hair-wavy", term: "wavy", fr: "ondulé(e)", def: "Hair with soft waves.", ex: "She has wavy hair.", cat: "physical", pos: "adjective", icon: "〰️" },
    { id: "hair-blond", term: "blond / blonde", fr: "blond(e)", def: "Light yellow hair color.", ex: "He has blond hair.", cat: "physical", pos: "adjective", icon: "🌾" },
    { id: "hair-brown", term: "brown hair", fr: "cheveux châtains / bruns", def: "Hair color: brown.", ex: "She has brown hair.", cat: "physical", pos: "noun phrase", icon: "🌰" },
    { id: "hair-black", term: "black hair", fr: "cheveux noirs", def: "Hair color: black.", ex: "He has black hair.", cat: "physical", pos: "noun phrase", icon: "🖤" },
    { id: "hair-gray", term: "gray hair", fr: "cheveux gris", def: "Hair color: gray.", ex: "He has gray hair.", cat: "physical", pos: "noun phrase", icon: "🩶" },
    { id: "eyes-blue", term: "blue eyes", fr: "yeux bleus", def: "Eye color: blue.", ex: "She has blue eyes.", cat: "physical", pos: "noun phrase", icon: "👁️" },
    { id: "eyes-brown", term: "brown eyes", fr: "yeux marron", def: "Eye color: brown.", ex: "He has brown eyes.", cat: "physical", pos: "noun phrase", icon: "👁️" },
    { id: "eyes-green", term: "green eyes", fr: "yeux verts", def: "Eye color: green.", ex: "She has green eyes.", cat: "physical", pos: "noun phrase", icon: "👁️" },
    { id: "tall", term: "tall", fr: "grand(e)", def: "Higher than average.", ex: "He is tall.", cat: "physical", pos: "adjective", icon: "📏" },
    { id: "short", term: "short", fr: "petit(e)", def: "Not tall.", ex: "She is short.", cat: "physical", pos: "adjective", icon: "📐" },
    { id: "slim", term: "slim", fr: "mince", def: "Thin in a healthy way.", ex: "He is slim.", cat: "physical", pos: "adjective", icon: "🧍" },
    { id: "athletic", term: "athletic", fr: "sportif / sportive", def: "Strong and fit.", ex: "She is athletic.", cat: "physical", pos: "adjective", icon: "🏃" },
    { id: "wear-glasses", term: "wear glasses", fr: "porter des lunettes", def: "To have glasses on your face.", ex: "He wears glasses.", cat: "physical", pos: "verb phrase", icon: "👓" },
    { id: "beard", term: "a beard", fr: "une barbe", def: "Hair that grows on the chin and cheeks.", ex: "He has a beard.", cat: "physical", pos: "noun", icon: "🧔" },
    { id: "smile", term: "a warm smile", fr: "un sourire chaleureux", def: "A friendly smile.", ex: "She has a warm smile.", cat: "physical", pos: "noun phrase", icon: "😊" },

    // Personality
    { id: "kind", term: "kind", fr: "gentil(le)", def: "Nice and caring.", ex: "He seems kind.", cat: "personality", pos: "adjective", icon: "🤝" },
    { id: "funny", term: "funny", fr: "drôle", def: "Makes people laugh.", ex: "She is funny.", cat: "personality", pos: "adjective", icon: "😂" },
    { id: "calm", term: "calm", fr: "calme", def: "Not nervous; relaxed.", ex: "He comes across as calm.", cat: "personality", pos: "adjective", icon: "🧘" },
    { id: "confident", term: "confident", fr: "confiant(e)", def: "Sure of yourself.", ex: "She looks confident.", cat: "personality", pos: "adjective", icon: "💪" },
    { id: "creative", term: "creative", fr: "créatif / créative", def: "Good at making new ideas.", ex: "He is creative.", cat: "personality", pos: "adjective", icon: "🎨" },
    { id: "determined", term: "determined", fr: "déterminé(e)", def: "Not giving up easily.", ex: "She seems determined.", cat: "personality", pos: "adjective", icon: "🎯" },
    { id: "humble", term: "humble", fr: "humble", def: "Not arrogant.", ex: "He seems humble.", cat: "personality", pos: "adjective", icon: "🌿" },
    { id: "friendly", term: "friendly", fr: "sympa / amical(e)", def: "Pleasant and nice.", ex: "She is friendly.", cat: "personality", pos: "adjective", icon: "🙂" },
    { id: "generous", term: "generous", fr: "généreux / généreuse", def: "Happy to give and share.", ex: "He is generous.", cat: "personality", pos: "adjective", icon: "🎁" },
    { id: "serious", term: "serious", fr: "sérieux / sérieuse", def: "Not joking; focused.", ex: "She can be serious.", cat: "personality", pos: "adjective", icon: "🧐" },

    // Opinion / reasons
    { id: "admire", term: "admire", fr: "admirer", def: "To respect and like someone for their qualities.", ex: "I admire her.", cat: "opinion", pos: "verb", icon: "⭐" },
    { id: "appreciate", term: "appreciate", fr: "apprécier", def: "To value something.", ex: "I appreciate his work.", cat: "opinion", pos: "verb", icon: "🙏" },
    { id: "inspiring", term: "inspiring", fr: "inspirant(e)", def: "Makes you want to do better.", ex: "She is inspiring.", cat: "opinion", pos: "adjective", icon: "✨" },
    { id: "talented", term: "talented", fr: "talentueux / talentueuse", def: "Very good at something.", ex: "He is talented.", cat: "opinion", pos: "adjective", icon: "🏆" },
    { id: "charismatic", term: "charismatic", fr: "charismatique", def: "Attractive and charming personality.", ex: "She is charismatic.", cat: "opinion", pos: "adjective", icon: "🧲" },
    { id: "versatile", term: "versatile", fr: "polyvalent(e)", def: "Able to do many different things.", ex: "He is versatile.", cat: "opinion", pos: "adjective", icon: "🔁" },

    // Reason nouns
    { id: "role", term: "a role", fr: "un rôle", def: "A character in a movie or series.", ex: "I like this role.", cat: "nouns", pos: "noun", icon: "🎭" },
    { id: "performance", term: "a performance", fr: "une performance", def: "How well someone acts, sings, etc.", ex: "Her performance is excellent.", cat: "nouns", pos: "noun", icon: "👏" },
    { id: "style", term: "style", fr: "style", def: "A particular way of doing things.", ex: "I like his style.", cat: "nouns", pos: "noun", icon: "🧥" },
    { id: "voice", term: "voice", fr: "voix", def: "The sound of someone speaking or singing.", ex: "I like her voice.", cat: "nouns", pos: "noun", icon: "🗣️" },
    { id: "choices", term: "choices", fr: "choix", def: "Decisions someone makes.", ex: "I like her choices.", cat: "nouns", pos: "noun", icon: "✅" },
    { id: "values", term: "values", fr: "valeurs", def: "Important beliefs.", ex: "I respect his values.", cat: "nouns", pos: "noun", icon: "🧭" }
  ];

  var CONNECTORS = [
    { id: "because", en: "because", fr: "parce que" },
    { id: "since", en: "since", fr: "puisque / comme" },
    { id: "so", en: "so", fr: "donc" },
    { id: "and", en: "and", fr: "et" },
    { id: "also", en: "also", fr: "aussi" },
    { id: "in-addition", en: "in addition", fr: "en plus" },
    { id: "for-example", en: "for example", fr: "par exemple" },
    { id: "however", en: "however", fr: "cependant" },
    { id: "although", en: "although", fr: "bien que / même si" },
    { id: "whereas", en: "whereas", fr: "tandis que" }
  ];

  var REASON_NOUNS = [
    { en: "talent", fr: "talent" },
    { en: "humor", fr: "humour" },
    { en: "charisma", fr: "charisme" },
    { en: "style", fr: "style" },
    { en: "voice", fr: "voix" },
    { en: "performances", fr: "performances" },
    { en: "choices", fr: "choix" },
    { en: "values", fr: "valeurs" },
    { en: "personality", fr: "personnalité" }
  ];

  // MCQ questions
  var MCQ = [
    {
      q: "Choose the correct sentence:",
      a: ["He is brown eyes.", "He has brown eyes.", "He has tall."],
      correct: 1,
      explain: "Use <strong>has</strong> for features: <em>has brown eyes</em>."
    },
    {
      q: "Choose the correct structure for hair:",
      a: ["She has long hair.", "She is long hair.", "She wears long hair."],
      correct: 0,
      explain: "Use <strong>has</strong> + noun: <em>has long hair</em>."
    },
    {
      q: "Choose the best personality sentence:",
      a: ["He seems kind.", "He has kind.", "He is have kind."],
      correct: 0,
      explain: "<strong>seems</strong> + adjective = your impression."
    },
    {
      q: "Choose the best opinion + reason sentence:",
      a: ["I like her because she is inspiring.", "I like her because inspiring.", "I like because she inspiring."],
      correct: 0,
      explain: "After <strong>because</strong>, use a full clause: <em>she is inspiring</em>."
    },
    {
      q: "Pick the right adjective order:",
      a: ["brown long hair", "long brown hair", "hair brown long"],
      correct: 1,
      explain: "Common order: length → color → noun: <em>long brown hair</em>."
    }
  ];

  // Fill-in templates (dynamic expected answers)
  var FILL_TEMPLATES = [
    {
      tpl: "{SUBJ} ____ tall and athletic.",
      hint: "Use <strong>be</strong> + adjective.",
      expected: function (pr) { return [[pr.be].concat(pr.be === "is" ? ["'s"] : [])]; }
    },
    {
      tpl: "{SUBJ} ____ blue eyes.",
      hint: "Use <strong>have</strong> + feature.",
      expected: function (pr) { return [[pr.have]]; }
    },
    {
      tpl: "{SUBJ} ____ short hair and ____ glasses.",
      hint: "Feature = <strong>have</strong>; accessories = <strong>wear</strong>.",
      expected: function (pr) { return [[pr.have], [pr.wear]]; }
    },
    {
      tpl: "I admire {OBJ} ____ {SUBJ} ____ versatile.",
      hint: "Use <strong>because/since</strong> + clause.",
      expected: function (pr) { return [["because", "since"], [pr.be]]; }
    },
    {
      tpl: "In my opinion, {SUBJ} ____ confident, ____ very humble.",
      hint: "Impression = <strong>seem</strong>; adding info = <strong>and</strong>.",
      expected: function (pr) { return [[pr.subj === "they" ? "seem" : "seems"], ["and"]]; }
    },
    {
      tpl: "I don’t like some of {POSS} roles ____ they are not my style.",
      hint: "Use <strong>because/since</strong> + clause.",
      expected: function () { return [["because", "since"]]; }
    }
  ];

  // Sentence builder patterns (placeholders replaced at runtime)
  var BUILD_SENTENCES = [
    { words: ["{SUBJ}", "{HAVE}", "long", "brown", "hair"], correct: "{SUBJ} {HAVE} long brown hair", hint: "Remember: length + color + noun." },
    { words: ["{SUBJ}", "{SEEM}", "kind", "and", "funny"], correct: "{SUBJ} {SEEM} kind and funny", hint: "seem/seems + adjective." },
    { words: ["I", "like", "{OBJ}", "because", "{SUBJ}", "{BE}", "talented"], correct: "I like {OBJ} because {SUBJ} {BE} talented", hint: "because + clause." },
    { words: ["In", "my", "opinion,", "{SUBJ}", "comes", "across", "as", "calm"], correct: "In my opinion, {SUBJ} comes across as calm", hint: "comes across as + adjective." },
    { words: ["{SUBJ}", "{WEAR}", "glasses", "and", "{HAVE}", "a", "warm", "smile"], correct: "{SUBJ} {WEAR} glasses and {HAVE} a warm smile", hint: "wear + noun; have + noun." }
  ];

  // Builder dropdowns
  var HAIR_OPTS = ["short hair", "long hair", "curly hair", "straight hair", "wavy hair", "gray hair", "brown hair", "black hair", "blond hair"];
  var EYE_OPTS = ["brown eyes", "blue eyes", "green eyes"];
  var HEIGHT_OPTS = ["tall", "short", "average height", "slim", "athletic"];
  var PERSONALITY_OPTS = ["kind", "funny", "calm", "confident", "creative", "determined", "humble", "friendly", "generous", "serious"];
  var OPINION_OPTS = [
    "I like {OBJ}",
    "I really admire {OBJ}",
    "I appreciate {POSS} work",
    "I’m not a fan of some of {POSS} roles"
  ];
  var REASON_CONNECTOR_OPTS = ["because", "since"];
  var EXTRA_CONNECTOR_OPTS = ["In addition,", "Also,", "For example,", "However,", "Although"];

  // ---------- persistence ----------
  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var obj = JSON.parse(raw);
        Object.assign(state, obj || {});
        state.rate = clamp(parseFloat(state.rate) || 0.95, 0.7, 1.15);
        state.score = parseInt(state.score || 0, 10) || 0;
        state.level = (state.level === "intermediate") ? "intermediate" : "beginner";
        state.accent = (state.accent === "en-GB") ? "en-GB" : "en-US";
        state.personKey = (state.personKey === "actress") ? "actress" : "actor";
        state.selectedVocabCat = state.selectedVocabCat || "all";
      }
    } catch (e) { /* ignore */ }
  }
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- speech ----------
  var voicesCache = [];
  function updateVoices() {
    try { voicesCache = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; } catch (e) { voicesCache = []; }
  }
  function pickVoice(lang) {
    if (!voicesCache || !voicesCache.length) return null;
    var exact = voicesCache.find(function (v) { return (v.lang || "") === lang; });
    if (exact) return exact;
    var starts = voicesCache.find(function (v) { return (v.lang || "").toLowerCase().indexOf(lang.slice(0, 2).toLowerCase()) === 0; });
    return starts || null;
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text || ""));
      u.rate = state.rate || 0.95;
      u.lang = state.accent || "en-US";
      var v = pickVoice(u.lang);
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }
  function speakSequence(lines) {
    if (!("speechSynthesis" in window)) return;
    lines = (lines || []).filter(Boolean);
    if (!lines.length) return;

    var idx = 0;
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }

    function go() {
      if (idx >= lines.length) return;
      var u = new SpeechSynthesisUtterance(lines[idx]);
      u.rate = state.rate || 0.95;
      u.lang = state.accent || "en-US";
      var v = pickVoice(u.lang);
      if (v) u.voice = v;
      u.onend = function () { idx++; setTimeout(go, 120); };
      try { window.speechSynthesis.speak(u); } catch (e) { /* ignore */ }
    }
    go();
  }

  // ---------- score ----------
  function setScore(n) {
    state.score = Math.max(0, n | 0);
    $("score").textContent = String(state.score);
    save();
  }
  function addScore(delta) { setScore(state.score + (delta | 0)); }

  // ---------- person + pronouns ----------
  function pronounSet() {
    if (state.customName) {
      if (state.customPronoun === "she") return { subj: "she", obj: "her", poss: "her", be: "is", have: "has", wear: "wears" };
      if (state.customPronoun === "they") return { subj: "they", obj: "them", poss: "their", be: "are", have: "have", wear: "wear" };
      return { subj: "he", obj: "him", poss: "his", be: "is", have: "has", wear: "wears" };
    }
    return PEOPLE[state.personKey].pronouns;
  }
  function personLabel() { return state.customName ? state.customName : PEOPLE[state.personKey].name; }

  function renderProfile() {
    var pr = pronounSet();
    $("pronounPill").textContent = pr.subj + " / " + pr.obj + " / " + pr.poss;

    if (state.customName) {
      $("profileBox").innerHTML =
        '<div class="profile__name">' + esc(state.customName) + '</div>' +
        '<div class="profile__role">Custom person (practice)</div>' +
        '<div class="profile__facts">Use the same sentence structures for anyone.</div>' +
        '<div class="profile__facts"><span class="pill">Practice goal</span> Describe looks + personality + opinion.</div>';
      return;
    }

    var p = PEOPLE[state.personKey];
    $("profileBox").innerHTML =
      '<div class="profile__name">' + esc(p.name) + '</div>' +
      '<div class="profile__role">' + esc(p.role) + '</div>' +
      '<div class="profile__facts">' + esc(p.knownFor) + '</div>' +
      '<div class="profile__facts"><span class="pill">Practice goal</span> Describe looks + personality + opinion.</div>';
  }

  function adaptExample(ex) {
    var pr = pronounSet();
    var P = cap(pr.subj);

    ex = String(ex || "");

    // Replace starting pronoun + verb forms for they
    ex = ex.replace(/^(He|She|They)\s+has\b/, P + " " + pr.have);
    ex = ex.replace(/^(He|She|They)\s+is\b/, P + " " + pr.be);
    ex = ex.replace(/^(He|She|They)\s+wears\b/, P + " " + pr.wear);
    ex = ex.replace(/^(He|She|They)\s+seems\b/, P + " " + (pr.subj === "they" ? "seem" : "seems"));
    ex = ex.replace(/^(He|She|They)\s+looks\b/, P + " " + (pr.subj === "they" ? "look" : "looks"));

    return ex;
  }

  // ---------- vocab ----------
  var VOCAB_CATS = [
    { key: "all", label: "All" },
    { key: "physical", label: "Physical" },
    { key: "personality", label: "Personality" },
    { key: "opinion", label: "Opinion" },
    { key: "nouns", label: "Reason nouns" }
  ];

  function renderVocabFilters() {
    var box = $("vocabFilters");
    box.innerHTML = "";
    VOCAB_CATS.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "filterBtn" + (state.selectedVocabCat === c.key ? " is-active" : "");
      b.textContent = c.label;
      b.addEventListener("click", function () {
        state.selectedVocabCat = c.key;
        save();
        renderVocabFilters();
        renderFlashcards();
      });
      box.appendChild(b);
    });
  }

  function cardTemplate(item) {
    var ex = adaptExample(item.ex);
    var back =
      '<div class="flash__meta">' +
      '<span class="tag">' + esc(item.pos) + '</span>' +
      '<span class="tag">' + esc(item.cat) + '</span>' +
      '</div>' +
      '<div class="flash__fr"><strong>FR:</strong> ' + esc(item.fr) + '</div>' +
      '<div class="flash__def"><strong>Def:</strong> ' + esc(item.def) + '</div>' +
      '<div class="flash__ex"><strong>Ex:</strong> ' + esc(ex) + '</div>' +
      '<div class="flash__actions"><button class="btn btn--tiny" data-say="' + esc(ex) + '">🔊 Listen</button></div>';

    return (
      '<div class="flash" role="button" tabindex="0" aria-label="Flashcard ' + esc(item.term) + '">' +
      '<div class="flash__inner">' +
      '<div class="flash__face flash__front">' +
      '<div class="flash__top">' +
      '<div class="flash__term">' + esc(item.term) + '</div>' +
      '<div class="flash__icon">' + esc(item.icon || "📌") + '</div>' +
      "</div>" +
      '<div class="flash__meta">' +
      '<span class="tag">' + esc(item.cat) + "</span>" +
      '<span class="tag">' + esc(item.pos) + "</span>" +
      "</div>" +
      '<div class="muted small">Tap to flip →</div>' +
      "</div>" +
      '<div class="flash__face flash__back">' + back + "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderFlashcards() {
    var grid = $("flashcards");
    var list = VOCAB.filter(function (v) {
      if (state.selectedVocabCat === "all") return true;
      return v.cat === state.selectedVocabCat;
    });

    // Beginner = core set; intermediate = full set
    if (state.level === "beginner") {
      var keep = new Set([
        "short hair", "long hair", "brown eyes", "blue eyes", "tall", "slim", "wear glasses",
        "kind", "funny", "confident", "talented", "inspiring", "admire", "appreciate",
        "a role", "a performance", "style", "values"
      ]);
      list = list.filter(function (v) { return keep.has(v.term); });
    }

    grid.innerHTML = list.map(cardTemplate).join("");

    // flip handling + listen buttons
    Array.from(grid.querySelectorAll(".flash")).forEach(function (card) {
      function flip() { card.classList.toggle("is-flipped"); }
      card.addEventListener("click", function (e) {
        var t = e.target;
        if (t && t.closest && t.closest("button")) return; // don't flip on listen
        flip();
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
      });
    });

    Array.from(grid.querySelectorAll("button[data-say]")).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        speak(btn.getAttribute("data-say") || "");
      });
    });
  }

  function renderVocabTable() {
    var rows = VOCAB.slice().sort(function (a, b) { return a.cat.localeCompare(b.cat) || a.term.localeCompare(b.term); });
    var html =
      '<table><thead><tr>' +
      "<th>Category</th><th>English</th><th>French</th><th>Definition</th><th>Example</th>" +
      "</tr></thead><tbody>" +
      rows.map(function (r) {
        return (
          "<tr>" +
          "<td>" + esc(r.cat) + "</td>" +
          "<td><strong>" + esc(r.term) + '</strong> <span class="muted">(' + esc(r.pos) + ")</span></td>" +
          "<td>" + esc(r.fr) + "</td>" +
          "<td>" + esc(r.def) + "</td>" +
          "<td>" + esc(adaptExample(r.ex)) + "</td>" +
          "</tr>"
        );
      }).join("") +
      "</tbody></table>";
    $("vocabTable").innerHTML = html;
  }

  // ---------- grammar examples ----------
  function exRow(en, fr) {
    return (
      '<div class="example">' +
      '<div class="example__txt">' +
      '<div class="example__en">' + esc(en) + "</div>" +
      '<div class="example__fr">' + esc(fr) + "</div>" +
      "</div>" +
      '<button class="btn btn--tiny example__btn" data-say="' + esc(en) + '">🔊</button>' +
      "</div>"
    );
  }

  function renderGrammarExamples() {
    var pr = pronounSet();
    var P = cap(pr.subj);
    var OBJ = pr.obj;
    var POSS = pr.poss;

    var frBe = (pr.be === "are") ? "sont" : "est";
    var frSubj = (pr.subj === "he") ? "il" : (pr.subj === "she" ? "elle" : "ils/elles");

    $("exPhysical").innerHTML = [
      exRow(P + " " + pr.have + " short hair and brown eyes.", P + " a les cheveux courts et les yeux marron."),
      exRow(P + " " + pr.be + " tall and athletic.", P + " " + frBe + " grand(e) et sportif(ve)."),
      exRow(P + " " + pr.wear + " glasses.", P + " porte des lunettes.")
    ].join("");

    $("exPersonality").innerHTML = [
      exRow(P + " " + (pr.subj === "they" ? "seem" : "seems") + " kind.", P + " a l'air gentil(le)."),
      exRow(P + " comes across as calm and confident.", P + " donne l'impression d'être calme et confiant(e)."),
      exRow(P + " " + pr.be + " creative and determined.", P + " " + frBe + " créatif(ve) et déterminé(e).")
    ].join("");

    $("exOpinion").innerHTML = [
      exRow("I like " + OBJ + " because " + pr.subj + " " + pr.be + " inspiring.", "Je l'aime bien parce qu'" + frSubj + " est inspirant(e)."),
      exRow("I admire " + OBJ + " for " + POSS + " talent.", "Je l'admire pour " + (POSS === "their" ? "son" : "son") + " talent."),
      exRow("I don’t like some of " + POSS + " roles because they are not my style.", "Je n'aime pas certains de ses rôles parce que ce n'est pas mon style.")
    ].join("");

    $("exAdjOrder").innerHTML = [
      exRow("a talented young actor", "un acteur talentueux et jeune"),
      exRow("long brown hair", "des cheveux longs et bruns"),
      exRow("a kind, funny person", "une personne gentille et drôle")
    ].join("");

    // bind speak buttons (once)
    Array.from(document.querySelectorAll("button[data-say]")).forEach(function (btn) {
      if (btn.__bound) return;
      btn.__bound = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        speak(btn.getAttribute("data-say") || "");
      });
    });
  }

  function renderConnectors() {
    $("connectorChips").innerHTML = CONNECTORS.map(function (c) {
      return '<span class="pill"><strong>' + esc(c.en) + "</strong> — " + esc(c.fr) + "</span>";
    }).join("");
  }

  // ---------- accordion ----------
  function bindAccordion() {
    Array.from(document.querySelectorAll(".accordion__btn")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var wrap = btn.closest(".accordion");
        if (!wrap) return;
        wrap.classList.toggle("is-open");
      });
    });
  }

  // ---------- tabs ----------
  function bindTabs() {
    var btns = Array.from(document.querySelectorAll(".tabs__btn"));
    function setTab(key) {
      btns.forEach(function (b) {
        var on = b.getAttribute("data-tab") === key;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      ["mcq", "fill", "sort", "build"].forEach(function (k) {
        $("tab-" + k).classList.toggle("hidden", k !== key);
      });
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
    });
  }

  // ---------- MCQ ----------
  function renderMCQ() {
    var box = $("mcqBox");
    box.innerHTML = "";
    MCQ.forEach(function (item, idx) {
      var div = document.createElement("div");
      div.className = "mcqItem";
      div.innerHTML =
        '<div class="mcqQ">' + (idx + 1) + ". " + item.q + "</div>" +
        '<div class="mcqA"></div>' +
        '<div class="mcqExplain muted">' + item.explain + "</div>";
      var answers = div.querySelector(".mcqA");
      item.a.forEach(function (ans, aidx) {
        var btn = document.createElement("button");
        btn.className = "mcqBtn";
        btn.innerHTML = ans;
        btn.addEventListener("click", function () {
          var already = btn.classList.contains("is-correct") || btn.classList.contains("is-wrong");
          if (already) return;
          if (aidx === item.correct) {
            btn.classList.add("is-correct");
            addScore(2);
            var ex = div.querySelector(".mcqExplain");
            ex.classList.remove("muted");
            ex.innerHTML = '<span class="pill">✅ Correct</span> ' + item.explain;
          } else {
            btn.classList.add("is-wrong");
            addScore(-1);
            var ex2 = div.querySelector(".mcqExplain");
            ex2.classList.remove("muted");
            ex2.innerHTML = '<span class="pill">❌ Not quite</span> ' + item.explain;
          }
        });
        answers.appendChild(btn);
      });
      box.appendChild(div);
    });
  }

  // ---------- Fill in ----------
  var fillCurrent = null;
  function fillNew() {
    var pr = pronounSet();
    var P = cap(pr.subj);
    var tokens = { SUBJ: P, OBJ: pr.obj, POSS: pr.poss };

    fillCurrent = shuffle(FILL_TEMPLATES)[0];

    var raw = fillCurrent.tpl.replace(/\{(SUBJ|OBJ|POSS)\}/g, function (_, k) { return tokens[k]; });

    // Replace each ____ with an input
    var count = 0;
    var html = raw.replace(/____/g, function () {
      count++;
      return '<span class="blank"><span class="muted small">#' + count + '</span>' +
        '<input inputmode="text" autocomplete="off" autocapitalize="none" spellcheck="false" data-blank="' + count + '" /></span>';
    });

    $("fillCard").innerHTML = html;
    $("fillFeedback").className = "feedback";
    $("fillFeedback").textContent = "Type the missing word(s), then press Check.";
  }
  function fillHint() {
    if (!fillCurrent) return;
    $("fillFeedback").className = "feedback";
    $("fillFeedback").innerHTML = "💡 Hint: " + fillCurrent.hint;
  }
  function fillCheck() {
    if (!fillCurrent) return;

    var pr = pronounSet();
    var expected = fillCurrent.expected(pr); // array of arrays
    var inputs = Array.from($("fillCard").querySelectorAll("input[data-blank]"));

    var ok = true;
    inputs.forEach(function (inp, idx) {
      var got = norm(inp.value);
      var accepts = (expected[idx] || []).map(norm).filter(Boolean);
      var valid = accepts.indexOf(got) !== -1;

      inp.style.borderColor = valid ? "rgba(52,211,153,0.45)" : "rgba(251,113,133,0.55)";
      if (!valid) ok = false;
    });

    if (ok) {
      $("fillFeedback").className = "feedback good";
      $("fillFeedback").innerHTML = "✅ Correct! +3 points";
      addScore(3);
    } else {
      $("fillFeedback").className = "feedback bad";
      $("fillFeedback").innerHTML = "❌ Not yet. Try again or click Hint. (−1 point)";
      addScore(-1);
    }
  }

  // ---------- Sorting (drag OR tap) ----------
  var sortWords = [];
  var tapSelected = null;

  function pickSortWords() {
    // pick 10 items across categories
    var pool = VOCAB.filter(function (v) { return ["physical", "personality", "opinion", "nouns"].indexOf(v.cat) !== -1; });
    var phys = shuffle(pool.filter(function (v) { return v.cat === "physical"; })).slice(0, 4);
    var pers = shuffle(pool.filter(function (v) { return v.cat === "personality"; })).slice(0, 3);
    var opin = shuffle(pool.filter(function (v) { return v.cat === "opinion"; })).slice(0, 2);
    var noun = shuffle(pool.filter(function (v) { return v.cat === "nouns"; })).slice(0, 1);

    sortWords = shuffle([].concat(phys, pers, opin, noun)).map(function (v) {
      return { id: v.id, term: v.term, cat: (v.cat === "nouns" ? "opinion" : v.cat) };
    });
  }

  function makeChip(word) {
    var c = document.createElement("div");
    c.className = "chip";
    c.textContent = word.term;
    c.setAttribute("draggable", "true");
    c.dataset.wordId = word.id;

    // drag
    c.addEventListener("dragstart", function (e) {
      try { e.dataTransfer.setData("text/plain", word.id); } catch (err) { /* ignore */ }
      setTimeout(function () { c.classList.add("is-selected"); }, 0);
    });
    c.addEventListener("dragend", function () { c.classList.remove("is-selected"); });

    // tap select
    c.addEventListener("click", function () {
      Array.from(document.querySelectorAll(".chip.is-selected")).forEach(function (x) { x.classList.remove("is-selected"); });
      tapSelected = c;
      c.classList.add("is-selected");
    });

    return c;
  }

  function renderSorter() {
    pickSortWords();
    tapSelected = null;

    $("sortFeedback").className = "feedback";
    $("sortFeedback").textContent = "Drag words into a box, or tap a word then tap a box.";

    $("sortBank").innerHTML = "";
    $("binPhysical").innerHTML = "";
    $("binPersonality").innerHTML = "";
    $("binOpinion").innerHTML = "";

    sortWords.forEach(function (w) { $("sortBank").appendChild(makeChip(w)); });
  }

  function findSortWordById(id) { return sortWords.find(function (w) { return w.id === id; }) || null; }

  function bindBinsOnce() {
    Array.from(document.querySelectorAll(".bin")).forEach(function (bin) {
      var drop = bin.querySelector(".bin__drop");

      // dragover
      drop.addEventListener("dragover", function (e) { e.preventDefault(); bin.classList.add("is-target"); });
      drop.addEventListener("dragleave", function () { bin.classList.remove("is-target"); });
      drop.addEventListener("drop", function (e) {
        e.preventDefault(); bin.classList.remove("is-target");
        var id = "";
        try { id = e.dataTransfer.getData("text/plain"); } catch (err) { id = ""; }
        if (!id) return;
        var chip = document.querySelector('.chip[data-word-id="' + cssEscapeSafe(id) + '"]');
        if (chip) drop.appendChild(chip);
      });

      // tap-to-drop
      drop.addEventListener("click", function () {
        if (!tapSelected) return;
        drop.appendChild(tapSelected);
        tapSelected.classList.remove("is-selected");
        tapSelected = null;
      });
    });
  }

  function sortCheck() {
    var bins = {
      physical: $("binPhysical"),
      personality: $("binPersonality"),
      opinion: $("binOpinion")
    };
    var total = 0, correct = 0;

    Object.keys(bins).forEach(function (k) {
      var chips = Array.from(bins[k].querySelectorAll(".chip"));
      chips.forEach(function (chip) {
        total++;
        var w = findSortWordById(chip.dataset.wordId);
        var ok = w && w.cat === k;
        chip.classList.toggle("good", !!ok);
        chip.classList.toggle("bad", !ok);
        if (ok) correct++;
      });
    });

    if (total === 0) {
      $("sortFeedback").className = "feedback";
      $("sortFeedback").textContent = "Move at least one word into a box.";
      return;
    }

    if (correct === total) {
      $("sortFeedback").className = "feedback good";
      $("sortFeedback").innerHTML = "✅ Perfect! " + correct + "/" + total + ". +4 points";
      addScore(4);
    } else {
      $("sortFeedback").className = "feedback bad";
      $("sortFeedback").innerHTML = "❌ " + correct + "/" + total + " correct. Fix the red ones. (−1 point)";
      addScore(-1);
    }
  }

  // ---------- Sentence builder (drag OR tap) ----------
  var buildCurrent = null;
  var buildSelectedTile = null;

  function tokenMap() {
    var pr = pronounSet();
    return {
      SUBJ: cap(pr.subj),
      OBJ: pr.obj,
      POSS: pr.poss,
      BE: pr.be,
      HAVE: pr.have,
      WEAR: pr.wear,
      SEEM: (pr.subj === "they" ? "seem" : "seems")
    };
  }

  function replaceTokens(str, t) {
    return String(str).replace(/\{(SUBJ|OBJ|POSS|BE|HAVE|WEAR|SEEM)\}/g, function (_, k) { return t[k]; });
  }

  function renderBuilder() {
    var t = tokenMap();
    buildCurrent = shuffle(BUILD_SENTENCES)[0];

    var words = buildCurrent.words.map(function (w) { return replaceTokens(w, t); });
    var correct = replaceTokens(buildCurrent.correct, t);

    buildCurrent._words = words;
    buildCurrent._correct = correct;

    $("buildFeedback").className = "feedback";
    $("buildFeedback").textContent = "Build the sentence, then click Check.";

    var bank = $("buildBank");
    var slots = $("buildSlots");
    bank.innerHTML = "";
    slots.innerHTML = "";

    shuffle(words).forEach(function (w) {
      var tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = w;
      tile.setAttribute("draggable", "true");

      tile.addEventListener("dragstart", function (e) {
        try { e.dataTransfer.setData("text/plain", w); } catch (err) { /* ignore */ }
        setTimeout(function () { tile.classList.add("is-selected"); }, 0);
      });
      tile.addEventListener("dragend", function () { tile.classList.remove("is-selected"); });

      tile.addEventListener("click", function () {
        Array.from(document.querySelectorAll(".tile.is-selected")).forEach(function (x) { x.classList.remove("is-selected"); });
        buildSelectedTile = tile;
        tile.classList.add("is-selected");
      });

      bank.appendChild(tile);
    });

    for (var i = 0; i < words.length; i++) {
      var s = document.createElement("div");
      s.className = "slot";
      s.textContent = "…";
      s.dataset.index = String(i);

      s.addEventListener("dragover", function (e) { e.preventDefault(); s.classList.add("is-target"); });
      s.addEventListener("dragleave", function () { s.classList.remove("is-target"); });
      s.addEventListener("drop", function (e) {
        e.preventDefault(); s.classList.remove("is-target");
        var w = "";
        try { w = e.dataTransfer.getData("text/plain"); } catch (err) { w = ""; }
        if (!w) return;
        placeInSlot(s, w);
      });

      s.addEventListener("click", function (e) {
        var inside = s.querySelector(".tile");
        if (inside && e.target && e.target.classList.contains("tile")) {
          // remove
          $("buildBank").appendChild(inside);
          s.textContent = "…";
          return;
        }
        if (buildSelectedTile) {
          placeInSlot(s, buildSelectedTile.textContent);
          buildSelectedTile.classList.remove("is-selected");
          buildSelectedTile = null;
          return;
        }
        // if slot has a tile but click on empty area, remove it
        if (inside) {
          $("buildBank").appendChild(inside);
          s.textContent = "…";
        }
      });

      slots.appendChild(s);
    }
  }

  function findTileByText(container, word) {
    var tiles = Array.from(container.querySelectorAll(".tile"));
    return tiles.find(function (t) { return t.textContent === word; }) || null;
  }

  function placeInSlot(slot, word) {
    var bank = $("buildBank");
    var slots = $("buildSlots");

    // Return existing tile (if any) to bank
    var existing = slot.querySelector(".tile");
    if (existing) bank.appendChild(existing);

    // Find tile: bank first, then other slots
    var tile = findTileByText(bank, word);
    if (!tile) {
      tile = findTileByText(slots, word);
    }
    if (!tile) return;

    slot.textContent = "";
    slot.appendChild(tile);
    tile.classList.remove("is-selected");
  }

  function builderHint() {
    if (!buildCurrent) return;
    $("buildFeedback").className = "feedback";
    $("buildFeedback").innerHTML = "💡 Hint: " + buildCurrent.hint;
  }

  function builderCheck() {
    if (!buildCurrent) return;
    var words = Array.from($("buildSlots").querySelectorAll(".slot")).map(function (slot) {
      var t = slot.querySelector(".tile");
      return t ? t.textContent : "";
    });
    var sentence = words.join(" ").replace(/\s+/g, " ").trim();

    if (!sentence) {
      $("buildFeedback").className = "feedback";
      $("buildFeedback").textContent = "Place at least some words into the slots.";
      return;
    }
    if (sentence === buildCurrent._correct) {
      $("buildFeedback").className = "feedback good";
      $("buildFeedback").innerHTML = "✅ Correct! +4 points<br><span class=\"muted\">Sentence: " + esc(sentence) + "</span>";
      addScore(4);
    } else {
      $("buildFeedback").className = "feedback bad";
      $("buildFeedback").innerHTML = "❌ Not yet. Try again. (−1 point)<br><span class=\"muted\">Your sentence: " + esc(sentence) + "</span>";
      addScore(-1);
    }
  }

  // ---------- Paragraph builder ----------
  function fillSelect(sel, options, formatter) {
    sel.innerHTML = options.map(function (o) {
      var value = (typeof o === "string") ? o : o.en;
      var label = formatter ? formatter(o) : ((typeof o === "string") ? o : (o.en + " — " + o.fr));
      return '<option value="' + esc(value) + '">' + esc(label) + "</option>";
    }).join("");
  }

  function initBuilder() {
    // Person options: actor / actress / custom
    var personSel = $("bPerson");
    personSel.innerHTML = [
      '<option value="actor">Actor</option>',
      '<option value="actress">Actress</option>',
      '<option value="custom">Custom name</option>'
    ].join("");

    fillSelect($("bHair"), HAIR_OPTS);
    fillSelect($("bEyes"), EYE_OPTS);
    fillSelect($("bHeight"), HEIGHT_OPTS);
    fillSelect($("bPersonality"), PERSONALITY_OPTS);
    fillSelect($("bOpinion"), OPINION_OPTS, function (s) { return s.replace("{OBJ}", "him/her/them").replace("{POSS}", "his/her/their"); });
    fillSelect($("bReason"), REASON_CONNECTOR_OPTS);
    fillSelect($("bReasonNoun"), REASON_NOUNS, function (o) { return o.en + " — " + o.fr; });
    fillSelect($("bExtra"), EXTRA_CONNECTOR_OPTS);

    // defaults
    personSel.value = state.customName ? "custom" : state.personKey;
    $("paragraphOut").textContent = state.lastParagraph || "";
  }

  function makeReasonClause(connector, nounEn, pr) {
    connector = connector || "because";

    var P = cap(pr.subj);

    // Friendly clauses per noun
    var clauses = {
      talent: pr.subj + " " + pr.be + " very talented",
      humor: pr.subj + " " + pr.be + " very funny",
      charisma: pr.subj + " " + pr.be + " charismatic",
      style: pr.subj + " " + pr.have + " great style",
      voice: pr.subj + " " + pr.have + " a great voice",
      performances: pr.poss + " performances are excellent",
      choices: pr.poss + " choices are interesting",
      values: pr.poss + " values are important to me",
      personality: pr.poss + " personality is unique"
    };

    var clause = clauses[nounEn] || (pr.subj + " " + pr.be + " impressive");

    if (connector === "since") return "since " + clause;
    // because
    return "because " + clause;
  }

  function buildParagraph() {
    // Decide which person/pronouns to use for paragraph builder
    var personChoice = $("bPerson").value;
    if (personChoice === "custom" && !state.customName) {
      // If no custom name, still allow: use neutral "This person"
      state.customName = "This person";
      state.customPronoun = "they";
      save();
    }

    var pr;
    var name;
    if (personChoice === "custom") {
      pr = pronounSet(); // uses state.customName/pronoun
      name = state.customName || "This person";
    } else {
      state.customName = ""; // paragraph uses famous person
      pr = PEOPLE[personChoice].pronouns;
      name = PEOPLE[personChoice].name;
    }

    var hair = $("bHair").value;
    var eyes = $("bEyes").value;
    var height = $("bHeight").value;
    var pers = $("bPersonality").value;
    var opinTpl = $("bOpinion").value;
    var reasonConn = $("bReason").value;
    var reasonNoun = $("bReasonNoun").value;
    var extra = $("bExtra").value;

    var P = cap(pr.subj);
    var base1 = P + " " + pr.have + " " + hair + " and " + eyes + ".";
    var base2;
    if (height === "average height") base2 = P + " " + pr.be + " of average height.";
    else base2 = P + " " + pr.be + " " + height + ".";
    var base3 = P + " " + (pr.subj === "they" ? "seem" : "seems") + " " + pers + ".";

    var opinion = opinTpl
      .replace("{OBJ}", pr.obj)
      .replace("{POSS}", pr.poss);

    var reasonClause = makeReasonClause(reasonConn, reasonNoun, pr);
    var extraLine = extra + " " + P + " " + pr.be + " " + (Math.random() < 0.5 ? "quite" : "very") + " " + pers + ".";

    var paragraph = name + " is a well-known person (practice). " +
      base1 + " " + base2 + " " + base3 + " " +
      opinion + " " + reasonClause + ". " +
      extraLine;

    state.lastParagraph = paragraph;
    save();
    $("paragraphOut").textContent = paragraph;
  }

  function paragraphListen() {
    var text = $("paragraphOut").textContent || "";
    if (!text) return;
    speak(text);
  }

  function paragraphCopy() {
    var text = $("paragraphOut").textContent || "";
    if (!text) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        $("paragraphOut").insertAdjacentHTML("beforeend", "");
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "true");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) { /* ignore */ }
  }

  // ---------- top controls ----------
  function bindTopbar() {
    // Accent
    $("accent").addEventListener("change", function () {
      state.accent = $("accent").value;
      save();
    });

    // Speed
    $("rate").addEventListener("input", function () {
      state.rate = clamp(parseFloat($("rate").value) || 0.95, 0.7, 1.15);
      $("rateLabel").textContent = state.rate.toFixed(2) + "×";
      save();
    });

    // Level
    $("level").addEventListener("change", function () {
      state.level = $("level").value;
      save();
      renderFlashcards();
    });

    // Reset
    $("btnReset").addEventListener("click", function () {
      try { localStorage.removeItem(LS_KEY); } catch (e) { /* ignore */ }
      state = Object.assign({}, DEFAULT_STATE);
      // UI
      $("accent").value = state.accent;
      $("rate").value = String(state.rate);
      $("rateLabel").textContent = state.rate.toFixed(2) + "×";
      $("level").value = state.level;
      setScore(0);

      // Rerender
      state.selectedVocabCat = "all";
      renderVocabFilters();
      renderProfile();
      renderGrammarExamples();
      renderFlashcards();
      renderVocabTable();
      renderConnectors();
      renderMCQ();
      fillNew();
      renderSorter();
      renderBuilder();
      initBuilder();
      $("paragraphOut").textContent = "";
      $("customName").value = "";
      $("customPronoun").value = "he";
    });

    // Print
    $("btnPrint").addEventListener("click", function () {
      // Ensure vocab list shown before printing
      $("vocabListBox").classList.remove("hidden");
      window.print();
    });
  }

  function bindPersonChooser() {
    function setActive(key) {
      state.customName = ""; // switching back to famous
      state.personKey = key;
      save();

      $("personActor").classList.toggle("is-active", key === "actor");
      $("personActor").setAttribute("aria-selected", key === "actor" ? "true" : "false");
      $("personActress").classList.toggle("is-active", key === "actress");
      $("personActress").setAttribute("aria-selected", key === "actress" ? "true" : "false");

      renderProfile();
      renderGrammarExamples();
      renderFlashcards();
      renderVocabTable();
      fillNew();
      renderBuilder();
      initBuilder();
    }

    $("personActor").addEventListener("click", function () { setActive("actor"); });
    $("personActress").addEventListener("click", function () { setActive("actress"); });

    $("btnSayName").addEventListener("click", function () {
      speak(personLabel());
    });
  }

  function bindVocabButtons() {
    $("btnVocabList").addEventListener("click", function () {
      $("vocabListBox").classList.toggle("hidden");
      renderVocabTable();
    });

    $("btnListenPatterns").addEventListener("click", function () {
      var pr = pronounSet();
      var P = cap(pr.subj);
      speakSequence([
        P + " " + pr.be + " friendly.",
        P + " " + pr.have + " short hair.",
        P + " " + (pr.subj === "they" ? "seem" : "seems") + " confident.",
        "I like " + pr.obj + " because " + pr.subj + " " + pr.be + " inspiring."
      ]);
    });
  }

  function bindConnectorListen() {
    $("btnConnectorListen").addEventListener("click", function () {
      speakSequence(CONNECTORS.map(function (c) { return c.en; }));
    });
  }

  function bindExerciseButtons() {
    // Fill
    $("btnFillNew").addEventListener("click", fillNew);
    $("btnFillHint").addEventListener("click", fillHint);
    $("btnFillCheck").addEventListener("click", fillCheck);

    // Sort
    $("btnSortReset").addEventListener("click", renderSorter);
    $("btnSortCheck").addEventListener("click", sortCheck);

    // Builder
    $("btnBuildNew").addEventListener("click", renderBuilder);
    $("btnBuildHint").addEventListener("click", builderHint);
    $("btnBuildCheck").addEventListener("click", builderCheck);
  }

  function bindParagraphButtons() {
    $("btnBuildParagraph").addEventListener("click", buildParagraph);
    $("btnParagraphListen").addEventListener("click", paragraphListen);
    $("btnParagraphCopy").addEventListener("click", paragraphCopy);

    $("btnCustomInsert").addEventListener("click", function () {
      state.customName = String($("customName").value || "").trim();
      state.customPronoun = $("customPronoun").value || "he";
      save();

      renderProfile();
      renderGrammarExamples();
      renderFlashcards();
      renderVocabTable();
      fillNew();
      renderBuilder();
      initBuilder();

      // Set paragraph builder to custom
      $("bPerson").value = "custom";
    });
  }

  // ---------- init ----------
  function syncUIControls() {
    $("accent").value = state.accent;
    $("rate").value = String(state.rate);
    $("rateLabel").textContent = Number(state.rate).toFixed(2) + "×";
    $("level").value = state.level;

    setScore(state.score);

    $("personActor").classList.toggle("is-active", state.personKey === "actor" && !state.customName);
    $("personActress").classList.toggle("is-active", state.personKey === "actress" && !state.customName);

    if (state.customName) {
      $("customName").value = state.customName;
      $("customPronoun").value = state.customPronoun || "he";
    }
  }

  function init() {
    load();
    updateVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = function () { updateVoices(); };
    }

    syncUIControls();

    bindTopbar();
    bindPersonChooser();
    bindVocabButtons();
    bindConnectorListen();
    bindAccordion();
    bindTabs();

    renderProfile();
    renderVocabFilters();
    renderFlashcards();
    renderVocabTable();
    renderGrammarExamples();
    renderConnectors();

    renderMCQ();
    fillNew();
    renderSorter();
    bindBinsOnce();
    renderBuilder();

    initBuilder();
    bindExerciseButtons();
    bindParagraphButtons();
  }

  // wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();