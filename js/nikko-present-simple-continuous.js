window.__SPEAKEASY_APP_LOADED = true;
/* SpeakEasyTisha • Hotel Nikko SF • Present Simple & Present Continuous
   Touch-friendly + accessible (Mac + iPad Safari)

   Features:
   - EN/FR UI toggle (data-i18n)
   - US/UK speechSynthesis
   - Exercises: MCQ, Word-bank blanks, Sentence builder, Dialogue builder
   - Hints + check/reset per exercise
   - Global score + streak + progress (top & bottom)
*/

(function () {
  "use strict";

  /* ---------------------------
     Helpers
  ----------------------------*/
  function $(id) { return document.getElementById(id); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function esc(s) {
    return String(s).replace(/[&<>\"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  function normSentence(s) {
    return String(s)
      .replace(/\s+/g, " ")
      .replace(/\s([.,!?;:])/g, "$1")
      .trim()
      .toLowerCase();
  }

  function setHidden(el, hidden) {
    if (!el) return;
    el.hidden = !!hidden;
  }

  /* ---------------------------
     State
  ----------------------------*/
  var LS_KEY = "seTisha_nikko_ps_pc_v1";

  var state = {
    accent: "us", // us | uk
    ui: "en",     // en | fr
    score: 0,
    max: 0,
    streak: 0,
    // per-item scored flags
    scored: {
      mcq: {},
      bank: {},
      builder: {},
      dialogue: {}
    }
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (parsed.accent === "us" || parsed.accent === "uk") state.accent = parsed.accent;
        if (parsed.ui === "en" || parsed.ui === "fr") state.ui = parsed.ui;
      }
    } catch (e) { /* ignore */ }
  }

  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ accent: state.accent, ui: state.ui }));
    } catch (e) { /* ignore */ }
  }

  /* ---------------------------
     i18n
  ----------------------------*/
  var I18N = {
    en: {
      accent: "Accent",
      ui: "UI",
      testVoice: "Test",
      reset: "Reset",
      heroLead: "Learn the difference, then practice with hotel check‑in / concierge / housekeeping situations at Hotel Nikko (San Francisco).",
      chip1: "Habits & facts → Present Simple",
      chip2: "Right now / temporary → Present Continuous",
      chip3: "Schedules → Present Simple",
      howToUse: "How to use this page",
      how1: "Tap answers (or type) → then press <b>Check</b>.",
      how2: "You can retry until correct (best for learning).",
      how3: "Every activity is touch‑friendly for iPad Safari.",
      how4: "Use 🔊 to listen (US/UK). You can also copy the model sentences.",
      start: "Start",
      jump: "Jump to practice",
      psUse: "Use it for habits, repeated actions, facts, and timetables.",
      pcUse: "Use it for actions happening now, temporary situations, or changing trends.",
      examples: "Examples",
      form: "Form",
      pitfalls: "Common pitfalls",
      timeExp: "Often / usually / every day → Simple • Now / right now / this week → Continuous",
      stative: "Some verbs don’t normally use -ing (know, believe, like, need). Example: “I <b>need</b> a towel.”",
      schedule: "For timetables: “The shuttle <b>leaves</b> at 7.” (Simple). For “arrangements”: “I’m <b>meeting</b> a client at 7.”",
      mcqIntro: "Tap the best option. You can retry until correct.",
      bankIntro: "Tap a word, then tap a blank. Tap a filled blank to clear it.",
      builderIntro: "Tap tiles to build the sentence in order. Tap a tile in your sentence to remove it.",
      dialogueIntro: "Complete the dialogue with the correct tense. Then listen and practice aloud.",
      speakingIntro: "Use the prompts. Press 🔊 to hear a model sentence, then repeat.",
      shuffle: "Shuffle",
      hint: "Hint",
      check: "Check",
      resetSmall: "Reset",
      score: "Score",
      streak: "Streak",
      wrapUp: "Wrap‑up",
      wrap1: "Use Present Simple for habits/facts/timetables.",
      wrap2: "Use Present Continuous for now/temporary/change.",
      wrap3: "When in doubt, add a time expression (usually / right now) to clarify.",
      backTop: "Back to top",
      footer: "Touch‑friendly • Mac & iPad Safari",
      ok: "✅ Nice!",
      fix: "⚠️ Not yet. Fix the highlighted parts and try again.",
      allCorrect: "✅ All correct!",
      partial: "✅ Some correct — keep going.",
      noAnswers: "Pick an answer first.",
      vocabTitle: "F) Hotel vocabulary flashcards (tap to flip)",
      vocabIntro: "Use the filters (Room / Hotel / Amenities / Prepositions / Floors). Tap a card to flip. Tap \ud83d\udd0a to listen.",
      resetCards: "Reset cards",
      all: "All",
      room: "Room",
      hotel: "Hotel",
      amenities: "Amenities",
      prepositions: "Prepositions",
      floors: "Floors",
},
    fr: {
      accent: "Accent",
      ui: "Interface",
      testVoice: "Test",
      reset: "Réinitialiser",
      heroLead: "Comprenez la différence, puis entraînez‑vous avec des situations de check‑in / concierge / ménage à l’Hotel Nikko (San Francisco).",
      chip1: "Habitudes & faits → Présent simple",
      chip2: "Maintenant / temporaire → Présent continu",
      chip3: "Horaires → Présent simple",
      howToUse: "Comment utiliser cette page",
      how1: "Touchez une réponse (ou tapez) → puis appuyez sur <b>Vérifier</b>.",
      how2: "Vous pouvez recommencer jusqu’à ce que ce soit correct (idéal pour apprendre).",
      how3: "Toutes les activités sont tactiles (iPad Safari).",
      how4: "Utilisez 🔊 pour écouter (US/UK). Vous pouvez aussi copier les phrases modèles.",
      start: "Commencer",
      jump: "Aller à la pratique",
      psUse: "Pour les habitudes, actions répétées, faits et horaires.",
      pcUse: "Pour une action en cours, une situation temporaire ou un changement.",
      examples: "Exemples",
      form: "Forme",
      pitfalls: "Pièges fréquents",
      timeExp: "Often / usually / every day → Simple • Now / right now / this week → Continuous",
      stative: "Certains verbes n’emploient pas -ing en général (know, believe, like, need). Exemple : “I <b>need</b> a towel.”",
      schedule: "Pour un horaire : “The shuttle <b>leaves</b> at 7.” (simple). Pour un rendez‑vous prévu : “I’m <b>meeting</b> a client at 7.”",
      mcqIntro: "Touchez la meilleure option. Vous pouvez recommencer jusqu’à ce que ce soit correct.",
      bankIntro: "Touchez un mot, puis touchez une case vide. Touchez une case remplie pour l’effacer.",
      builderIntro: "Touchez les tuiles pour construire la phrase dans l’ordre. Touchez une tuile dans la phrase pour la retirer.",
      dialogueIntro: "Complétez le dialogue avec le bon temps. Puis écoutez et entraînez‑vous à l’oral.",
      speakingIntro: "Utilisez les prompts. Appuyez sur 🔊 pour écouter une phrase modèle, puis répétez.",
      shuffle: "Mélanger",
      hint: "Indice",
      check: "Vérifier",
      resetSmall: "Réinitialiser",
      score: "Score",
      streak: "Série",
      wrapUp: "Bilan",
      wrap1: "Présent simple : habitudes / faits / horaires.",
      wrap2: "Présent continu : maintenant / temporaire / évolution.",
      wrap3: "En cas de doute, ajoutez un marqueur de temps (usually / right now) pour clarifier.",
      backTop: "Haut de page",
      footer: "Tactile • Mac & iPad Safari",
      ok: "✅ Bien !",
      fix: "⚠️ Pas encore. Corrigez les éléments en évidence et réessayez.",
      allCorrect: "✅ Tout est correct !",
      partial: "✅ Une partie est correcte — continuez.",
      noAnswers: "Choisissez d’abord une réponse.",
      vocabTitle: "F) Cartes de vocabulaire de l\u2019h\u00f4tel (touchez pour retourner)",
      vocabIntro: "Utilisez les filtres (Chambre / H\u00f4tel / Services / Pr\u00e9positions / \u00c9tages). Touchez une carte pour la retourner. Touchez \ud83d\udd0a pour \u00e9couter.",
      resetCards: "R\u00e9initialiser",
      all: "Tout",
      room: "Chambre",
      hotel: "H\u00f4tel",
      amenities: "Services",
      prepositions: "Pr\u00e9positions",
      floors: "\u00c9tages",
}
  };

  function t(key) {
    var dict = I18N[state.ui] || I18N.en;
    return dict[key] != null ? dict[key] : (I18N.en[key] != null ? I18N.en[key] : key);
  }

  function applyI18n() {
    qsa("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      // allow HTML in a few strings
      if (val.indexOf("<") !== -1) el.innerHTML = val;
      else el.textContent = val;
    });
  }

/* -----------------------------
   Speech (US/UK) — robust for Safari/Chrome
----------------------------- */
var accent = "en-US"; // or your existing state variable
var TTS = {
  voices: [],
  unlocked: false,
  statusEl: null,
  current: null,

  init: function () {
    this.statusEl = document.getElementById("ttsStatus");
    this.warmup();
    if (typeof window.isSecureContext !== 'undefined' && !window.isSecureContext) {
      this.setStatus('Voice: disabled on file:// — open via https (GitHub) or localhost');
    }
    var self=this;
    var once=function(){ try{ self.unlock&&self.unlock(); }catch(e){}; window.removeEventListener('pointerdown',once,true); window.removeEventListener('touchstart',once,true); window.removeEventListener('mousedown',once,true); };
    window.addEventListener('pointerdown',once,true);
    window.addEventListener('touchstart',once,true);
    window.addEventListener('mousedown',once,true);
  },

  setStatus: function (msg) {
    if (this.statusEl) this.statusEl.textContent = msg;
  },

  warmup: function () {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
      this.setStatus("Voice: not supported");
      return;
    }
    try { window.speechSynthesis.getVoices(); } catch (e) {}
    this.voices = window.speechSynthesis.getVoices() || [];
    this.setStatus(this.voices.length ? ("Voice: ready (" + this.voices.length + ")") : "Voice: loading…");

    var self = this;
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = function () {
        self.voices = window.speechSynthesis.getVoices() || [];
        self.setStatus(self.voices.length ? ("Voice: ready (" + self.voices.length + ")") : "Voice: loading…");
      };
    }
  },

  pick: function (lang) {
    var voices = (this.voices && this.voices.length) ? this.voices :
      (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
    if (!voices || !voices.length) return null;

    var lower = String(lang || "").toLowerCase();
    for (var i = 0; i < voices.length; i++) {
      if (String(voices[i].lang || "").toLowerCase() === lower) return voices[i];
    }
    var pref = lower.split("-")[0];
    for (var j = 0; j < voices.length; j++) {
      var vl = String(voices[j].lang || "").toLowerCase();
      if (vl.indexOf(pref) === 0) return voices[j];
    }
    return voices[0];
  },

  speak: function (text) {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
    var say = String(text || "").trim();
    if (!say) return;

    try { window.speechSynthesis.resume(); } catch (e) {}
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) window.speechSynthesis.cancel();
    } catch (e2) {}

    // iOS/Safari unlock (silent)
    if (!this.unlocked) {
      try {
        var warm = new SpeechSynthesisUtterance(" ");
        warm.lang = accent;
        warm.volume = 0;
        window.speechSynthesis.speak(warm);
        this.unlocked = true;
      } catch (e3) {}
    }

    var u = new SpeechSynthesisUtterance(say);
    u.lang = accent;
    u.rate = 0.95;

    var v = this.pick(accent);
    if (v) u.voice = v;

    var self = this;
    u.onstart = function () { self.setStatus("Voice: speaking…"); };
    u.onend = function () { self.warmup(); };
    u.onerror = function () { self.setStatus("Voice: error — try again"); };

    this.current = u;
    window.speechSynthesis.speak(u);
  }
};

// your wrapper (keep your existing calls the same)
function speak(text){ TTS.speak(text); }


  /* ---------------------------
     Scoring
  ----------------------------*/
  function setScoreText() {
    var scoreTop = $("scoreTop");
    var scoreBottom = $("scoreBottom");
    var maxTop = $("scoreMaxTop");
    var maxBottom = $("scoreMaxBottom");
    var streakTop = $("streakTop");
    var streakBottom = $("streakBottom");

    if (scoreTop) scoreTop.textContent = String(state.score);
    if (scoreBottom) scoreBottom.textContent = String(state.score);
    if (maxTop) maxTop.textContent = String(state.max);
    if (maxBottom) maxBottom.textContent = String(state.max);
    if (streakTop) streakTop.textContent = String(state.streak);
    if (streakBottom) streakBottom.textContent = String(state.streak);

    var pct = state.max ? (state.score / state.max) * 100 : 0;
    pct = clamp(pct, 0, 100);
    var pTop = $("progressTop");
    var pBottom = $("progressBottom");
    if (pTop) pTop.style.width = pct.toFixed(1) + "%";
    if (pBottom) pBottom.style.width = pct.toFixed(1) + "%";
  }

  function setMax(n) {
    state.max = n;
    setScoreText();
  }

  function awardPoint(bucket, id) {
    if (!state.scored[bucket]) state.scored[bucket] = {};
    if (state.scored[bucket][id]) return false;
    state.scored[bucket][id] = true;
    state.score += 1;
    state.streak += 1;
    setScoreText();
    return true;
  }

  function revokePoint(bucket, id) {
    if (state.scored[bucket] && state.scored[bucket][id]) {
      delete state.scored[bucket][id];
      state.score = Math.max(0, state.score - 1);
      setScoreText();
      return true;
    }
    return false;
  }

  function resetStreak() {
    state.streak = 0;
    setScoreText();
  }

  /* ---------------------------
     Exercise Data
  ----------------------------*/

  // Exercise 1 (MCQ): choose correct form.
  var MCQ = [
    {
      id: "mcq1",
      prompt: "Guests usually ____ at noon.",
      options: ["check out", "are checking out"],
      answer: "check out",
      hint: "‘Usually’ → Present Simple."
    },
    {
      id: "mcq2",
      prompt: "Shhh… The guest ____ on the phone right now.",
      options: ["speaks", "is speaking"],
      answer: "is speaking",
      hint: "‘Right now’ → Present Continuous."
    },
    {
      id: "mcq3",
      prompt: "The shuttle ____ at 7:00 a.m. every day.",
      options: ["leaves", "is leaving"],
      answer: "leaves",
      hint: "Timetable / every day → Present Simple."
    },
    {
      id: "mcq4",
      prompt: "We ____ the lobby this week.",
      options: ["renovate", "are renovating"],
      answer: "are renovating",
      hint: "‘This week’ → temporary → Present Continuous."
    },
    {
      id: "mcq5",
      prompt: "I ____ a towel. (stative verb)",
      options: ["need", "am needing"],
      answer: "need",
      hint: "‘Need’ is usually not used in -ing."
    },
    {
      id: "mcq6",
      prompt: "Look! The concierge ____ you.",
      options: ["helps", "is helping"],
      answer: "is helping",
      hint: "Action happening now → Present Continuous."
    }
  ];

  // Exercise 2 (Word bank)
  var BANK = {
    words: ["works", "is working", "usually", "right now", "are checking", "checks"],
    items: [
      {
        id: "bank1",
        textParts: ["The receptionist ", " at the front desk ", "."],
        blanks: ["works", "usually"],
        hint: "Habit + frequency adverb → Present Simple."
      },
      {
        id: "bank2",
        textParts: ["Please wait. She ", " on your reservation ", "."],
        blanks: ["is working", "right now"],
        hint: "‘Right now’ → Present Continuous."
      },
      {
        id: "bank3",
        textParts: ["He ", " out at noon every day."],
        blanks: ["checks"],
        hint: "Every day → Present Simple (he checks)."
      },
      {
        id: "bank4",
        textParts: ["They ", " in at the moment."],
        blanks: ["are checking"],
        hint: "‘At the moment’ → Present Continuous."
      },
      {
        id: "bank5",
        textParts: ["Room service ", " until 10 p.m."],
        blanks: ["works"],
        hint: "General fact / schedule → Present Simple."
      }
    ]
  };

  // Exercise 3 (Sentence builder)
  var BUILDER = [
    {
      id: "b1",
      tiles: ["The", "housekeeper", "is", "cleaning", "your", "room", "now"],
      answer: "The housekeeper is cleaning your room now.",
      hint: "‘Now’ → am/is/are + -ing."
    },
    {
      id: "b2",
      tiles: ["Guests", "usually", "leave", "their", "key", "cards", "here"],
      answer: "Guests usually leave their key cards here.",
      hint: "‘Usually’ → Present Simple."
    },
    {
      id: "b3",
      tiles: ["I", "am", "waiting", "in", "the", "lobby"],
      answer: "I am waiting in the lobby.",
      hint: "am + -ing."
    },
    {
      id: "b4",
      tiles: ["The", "concierge", "starts", "at", "eight", "a.m."],
      answer: "The concierge starts at eight a.m.",
      hint: "Schedule / fact → Present Simple (starts)."
    }
  ];

  // Exercise 4 (Dialogue)
  var DIALOGUE = {
    id: "dlg",
    hint: "Simple = habits/schedules • Continuous = now/temporary",
    lines: [
      { who: "Guest", text: "Hello. I (wait) ____ for my room key.", answer: "am waiting" },
      { who: "Front desk", text: "Of course. We (check) ____ your reservation right now.", answer: "are checking" },
      { who: "Guest", text: "The shuttle (leave) ____ at 7 every day, right?", answer: "leaves" },
      { who: "Front desk", text: "Yes. And check‑out (be) ____ at noon.", answer: "is" },
      { who: "Guest", text: "Great. My partner (call) ____ me now.", answer: "is calling" },
      { who: "Front desk", text: "No problem. I (print) ____ your receipt now.", answer: "am printing" }
    ]
  };

  // Speaking prompts (no score)
  var PROMPTS = [
    {
      title: "Front desk",
      model: "I am checking in right now."
    },
    {
      title: "Concierge",
      model: "The concierge usually recommends restaurants."
    },
    {
      title: "Housekeeping",
      model: "They are bringing extra towels at the moment."
    },
    {
      title: "Schedule",
      model: "Breakfast starts at 6 a.m."
    },
    {
      title: "Temporary",
      model: "The hotel is renovating the lobby this week."
    },
    {
      title: "Now",
      model: "I am waiting in the lobby."
    }
  ];
  /* ---------------------------
     Vocabulary flashcards (icons + filters)
  ----------------------------*/
  var VOCAB_FILTERS = [
    { key: "All", labelKey: "all" },
    { key: "Room", labelKey: "room" },
    { key: "Hotel", labelKey: "hotel" },
    { key: "Amenities", labelKey: "amenities" },
    { key: "Prepositions", labelKey: "prepositions" },
    { key: "Floors", labelKey: "floors" }
  ];

  var currentVocabFilter = "All";

  var VOCAB = [
    /* Room */
    { theme:"Room", icon:"🛏️", term:"pillow", fr:"oreiller", def:"a soft support for your head", ex:"Could I have an extra pillow, please?" },
    { theme:"Room", icon:"🧺", term:"towel", fr:"serviette", def:"cloth used to dry yourself", ex:"Could I have extra towels, please?" },
    { theme:"Room", icon:"🧥", term:"blanket", fr:"couverture", def:"keeps you warm in bed", ex:"May I have an extra blanket, please?" },
    { theme:"Room", icon:"🧴", term:"soap", fr:"savon", def:"used to wash your hands/body", ex:"Could I have more soap, please?" },
    { theme:"Room", icon:"🧴", term:"shampoo", fr:"shampooing", def:"used to wash your hair", ex:"The bathroom has shampoo." },
    { theme:"Room", icon:"🧻", term:"toilet paper", fr:"papier toilette", def:"paper used in the bathroom", ex:"There is no more toilet paper in our room." },
    { theme:"Room", icon:"🗝️", term:"key card", fr:"carte‑clé", def:"card used to open your room door", ex:"My key card doesn’t work." },
    { theme:"Room", icon:"🧊", term:"minibar", fr:"mini‑bar", def:"small fridge with drinks/snacks", ex:"Is the minibar included?" },
    { theme:"Room", icon:"🔒", term:"safe", fr:"coffre‑fort", def:"locked box for valuables", ex:"How do I use the safe?" },
    { theme:"Room", icon:"💨", term:"air conditioning", fr:"climatisation", def:"keeps the room cool", ex:"The air conditioning isn’t working." },
    { theme:"Room", icon:"🔥", term:"heating", fr:"chauffage", def:"keeps the room warm", ex:"How do I adjust the heating?" },
    { theme:"Room", icon:"🌡️", term:"thermostat", fr:"thermostat", def:"control for temperature", ex:"The thermostat is on the wall." },
    { theme:"Room", icon:"📺", term:"remote control", fr:"télécommande", def:"device to control the TV", ex:"Could you help me with the remote control?" },
    { theme:"Room", icon:"🧼", term:"laundry bag", fr:"sac à linge", def:"bag for laundry service", ex:"Where is the laundry bag?" },

    /* Hotel areas */
    { theme:"Hotel", icon:"🛎️", term:"front desk", fr:"réception", def:"the place where you check in/out", ex:"Please go to the front desk." },
    { theme:"Hotel", icon:"🧑‍💼", term:"concierge", fr:"concierge", def:"staff member who helps with bookings and advice", ex:"The concierge recommends restaurants." },
    { theme:"Hotel", icon:"🛋️", term:"lobby", fr:"hall", def:"common waiting area near reception", ex:"I’m waiting in the lobby." },
    { theme:"Hotel", icon:"↕️", term:"elevator / lift", fr:"ascenseur", def:"moves between floors", ex:"Take the elevator to the third floor." },
    { theme:"Hotel", icon:"🪜", term:"stairs", fr:"escaliers", def:"steps to go up/down", ex:"The stairs are behind the elevator." },
    { theme:"Hotel", icon:"🍽️", term:"restaurant", fr:"restaurant", def:"place to eat meals", ex:"The restaurant opens at 7 a.m." },
    { theme:"Hotel", icon:"☕", term:"bar / café", fr:"bar / café", def:"place to get a drink", ex:"You can have coffee at the bar." },
    { theme:"Hotel", icon:"🏋️", term:"gym / fitness center", fr:"salle de sport", def:"place to exercise", ex:"Is the gym open now?" },
    { theme:"Hotel", icon:"🏊", term:"swimming pool", fr:"piscine", def:"place to swim", ex:"Where is the swimming pool?" },
    { theme:"Hotel", icon:"💆", term:"spa", fr:"spa", def:"wellness area (massage, sauna, etc.)", ex:"Do we need to book the spa?" },
    { theme:"Hotel", icon:"💼", term:"business center", fr:"centre d’affaires", def:"area with computers/printers", ex:"Is there a printer in the business center?" },
    { theme:"Hotel", icon:"🧳", term:"luggage storage", fr:"consigne à bagages", def:"place to store bags before/after check‑in", ex:"Can we leave our luggage here?" },
    { theme:"Hotel", icon:"🅿️", term:"parking lot", fr:"parking", def:"place to park a car", ex:"Is there a parking lot?" },

    /* Amenities / services */
    { theme:"Amenities", icon:"📶", term:"Wi‑Fi password", fr:"mot de passe Wi‑Fi", def:"code to access the internet", ex:"Can I get the Wi‑Fi password, please?" },
    { theme:"Amenities", icon:"🍳", term:"breakfast buffet", fr:"buffet petit‑déjeuner", def:"self‑service breakfast with many choices", ex:"Is the breakfast buffet included?" },
    { theme:"Amenities", icon:"🧺", term:"laundry service", fr:"service de blanchisserie", def:"service to wash your clothes", ex:"Do you have a laundry service?" },
    { theme:"Amenities", icon:"🧥", term:"dry cleaning", fr:"nettoyage à sec", def:"professional cleaning for delicate clothes", ex:"Can you dry‑clean this jacket?" },
    { theme:"Amenities", icon:"🛎️", term:"room service", fr:"service d’étage", def:"food/drinks delivered to your room", ex:"I’d like to order room service, please." },
    { theme:"Amenities", icon:"⏰", term:"wake‑up call", fr:"réveil téléphonique", def:"a phone call to wake you up", ex:"I’d like a wake‑up call at 7 a.m., please." },
    { theme:"Amenities", icon:"⏳", term:"late check‑out", fr:"départ tardif", def:"leaving later than the normal time", ex:"Could we request a late check‑out?" },
    { theme:"Amenities", icon:"🌅", term:"early check‑in", fr:"arrivée anticipée", def:"getting your room before the normal time", ex:"Is early check‑in possible?" },

    /* Prepositions / directions */
    { theme:"Prepositions", icon:"➡️", term:"next to", fr:"à côté de", def:"very close beside", ex:"The elevator is next to the stairs." },
    { theme:"Prepositions", icon:"🔁", term:"across from", fr:"en face de", def:"on the other side", ex:"The restaurant is across from the lobby." },
    { theme:"Prepositions", icon:"↔️", term:"between", fr:"entre", def:"in the middle of two things", ex:"The gym is between the spa and the pool." },
    { theme:"Prepositions", icon:"📍", term:"near", fr:"près de", def:"close to", ex:"The front desk is near the entrance." },
    { theme:"Prepositions", icon:"⬆️", term:"above", fr:"au‑dessus de", def:"higher than", ex:"The mirror is above the sink." },
    { theme:"Prepositions", icon:"⬇️", term:"under", fr:"sous", def:"below", ex:"My suitcase is under the bed." },
    { theme:"Prepositions", icon:"⬅️", term:"on the left", fr:"à gauche", def:"to the left side", ex:"The concierge desk is on the left." },
    { theme:"Prepositions", icon:"➡️", term:"on the right", fr:"à droite", def:"to the right side", ex:"The elevator is on the right." },
    { theme:"Prepositions", icon:"🚶", term:"straight ahead", fr:"tout droit", def:"in a straight line", ex:"Go straight ahead to the lobby." },
    { theme:"Prepositions", icon:"🚪", term:"down the hall", fr:"au bout du couloir", def:"along the corridor", ex:"Your room is down the hall." },
    { theme:"Prepositions", icon:"↩️", term:"around the corner", fr:"au coin", def:"just after you turn", ex:"The restroom is around the corner." },
    { theme:"Prepositions", icon:"👀", term:"in front of", fr:"devant", def:"facing something", ex:"The taxi is in front of the hotel." },
    { theme:"Prepositions", icon:"🧭", term:"behind", fr:"derrière", def:"at the back of something", ex:"The stairs are behind the elevator." },

    /* Floors */
    { theme:"Floors", icon:"🏨", term:"ground floor (UK) / first floor (US)", fr:"rez‑de‑chaussée", def:"street‑level floor", ex:"Reception is on the ground floor." },
    { theme:"Floors", icon:"🔢", term:"first floor (UK) / second floor (US)", fr:"1er étage", def:"one level above street", ex:"The gym is on the first floor." },
    { theme:"Floors", icon:"🏢", term:"second floor (UK) / third floor (US)", fr:"2e étage", def:"two levels above street", ex:"The restaurant is on the second floor." },
    { theme:"Floors", icon:"⬇️", term:"basement / lower level", fr:"sous‑sol", def:"level below street", ex:"The spa is on the lower level." }
  ];

  function vocabFilterLabel(labelKey) {
    // labelKey points to i18n keys: all/room/hotel/amenities/prepositions/floors
    return t(labelKey);
  }

  function vocabList() {
    if (currentVocabFilter === "All") return VOCAB.slice();
    return VOCAB.filter(function (v) { return v.theme === currentVocabFilter; });
  }

  function renderVocabFilters() {
    var wrap = $("vocabFilters");
    if (!wrap) return;
    wrap.innerHTML = "";

    VOCAB_FILTERS.forEach(function (f) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pill" + (f.key === currentVocabFilter ? " is-on" : "");
      b.textContent = vocabFilterLabel(f.labelKey);
      b.setAttribute("data-filter", f.key);
      b.addEventListener("click", function () {
        currentVocabFilter = f.key;
        renderVocab();
      });
      wrap.appendChild(b);
    });
  }

  function vocabFrontHTML(v) {
    var meta = vocabFilterLabel(
      v.theme === "Room" ? "room" :
      v.theme === "Hotel" ? "hotel" :
      v.theme === "Amenities" ? "amenities" :
      v.theme === "Prepositions" ? "prepositions" :
      v.theme === "Floors" ? "floors" : "all"
    );

    return (
      '<div class="flash__top">' +
        '<div class="flash__icon">' + esc(v.icon) + '</div>' +
        '<button class="flash__listen" type="button" aria-label="Listen">🔊</button>' +
      '</div>' +
      '<div class="flash__term">' + esc(v.term) + '</div>' +
      '<div class="flash__meta">' + esc(meta) + (v.fr ? " • " + esc(v.fr) : "") + '</div>' +
      '<div class="flash__ex small">' + esc(v.ex) + '</div>'
    );
  }

  function vocabBackHTML(v) {
    var meta = vocabFilterLabel(
      v.theme === "Room" ? "room" :
      v.theme === "Hotel" ? "hotel" :
      v.theme === "Amenities" ? "amenities" :
      v.theme === "Prepositions" ? "prepositions" :
      v.theme === "Floors" ? "floors" : "all"
    );

    return (
      '<div class="flash__top">' +
        '<div class="flash__icon">' + esc(v.icon) + '</div>' +
        '<button class="flash__listen" type="button" aria-label="Listen">🔊</button>' +
      '</div>' +
      '<div class="flash__term">' + esc(v.term) + '</div>' +
      '<div class="flash__meta">' + esc(meta) + (v.fr ? " • " + esc(v.fr) : "") + '</div>' +
      '<div class="flash__def">' + esc(v.def) + '</div>' +
      '<div class="flash__ex small"><b>Example:</b> ' + esc(v.ex) + '</div>'
    );
  }

  function renderVocab() {
    var grid = $("vocabGrid");
    if (!grid) return;

    renderVocabFilters();

    var items = vocabList();
    grid.innerHTML = items.map(function (v) {
      return (
        '<div class="flash" role="button" tabindex="0"' +
          ' data-term="' + esc(v.term) + '"' +
          ' data-fr="' + esc(v.fr || "") + '"' +
          ' data-def="' + esc(v.def) + '"' +
          ' data-ex="' + esc(v.ex) + '"' +
          ' data-icon="' + esc(v.icon) + '"' +
          ' data-theme="' + esc(v.theme) + '"' +
          ' data-side="front"' +
        '>' +
          vocabFrontHTML(v) +
        '</div>'
      );
    }).join("");

    if (!grid.dataset.bound) {
      // click delegation
      grid.addEventListener("click", function (ev) {
        var target = ev.target;

        // Listen button
        if (target && target.classList && target.classList.contains("flash__listen")) {
          ev.preventDefault();
          ev.stopPropagation();
          var card1 = target.closest(".flash");
          if (!card1) return;
          speak(card1.getAttribute("data-term") + ". " + card1.getAttribute("data-def") + ". Example: " + card1.getAttribute("data-ex"));
          return;
        }

        var card = target && target.closest ? target.closest(".flash") : null;
        if (!card) return;

        var side = card.getAttribute("data-side") || "front";
        var v = {
          theme: card.getAttribute("data-theme"),
          icon: card.getAttribute("data-icon"),
          term: card.getAttribute("data-term"),
          fr: card.getAttribute("data-fr"),
          def: card.getAttribute("data-def"),
          ex: card.getAttribute("data-ex")
        };

        if (side === "front") {
          card.setAttribute("data-side", "back");
          card.classList.add("is-back");
          card.innerHTML = vocabBackHTML(v);
        } else {
          card.setAttribute("data-side", "front");
          card.classList.remove("is-back");
          card.innerHTML = vocabFrontHTML(v);
        }
      });

      // keyboard flip
      grid.addEventListener("keydown", function (ev) {
        if (ev.key !== "Enter" && ev.key !== " ") return;
        var card = ev.target;
        if (!card || !card.classList || !card.classList.contains("flash")) return;
        ev.preventDefault();
        card.click();
      });

      grid.dataset.bound = "1";
    }
  }

  function resetVocab() {
    currentVocabFilter = "All";
    renderVocab();
  }


  /* ---------------------------
     Render: Exercise 1 (MCQ)
  ----------------------------*/
  function renderMCQ() {
    var wrap = $("mcqWrap");
    if (!wrap) return;

    wrap.innerHTML = MCQ.map(function (q, idx) {
      return (
        '<div class="qcard" data-qid="' + esc(q.id) + '">' +
          '<div class="qcard__top">' +
            '<p class="qcard__q">' + (idx + 1) + '. ' + esc(q.prompt) + '</p>' +
            '<span class="qbadge">' + esc(state.ui === "fr" ? "Choisir" : "Choose") + '</span>' +
          '</div>' +
          '<div class="options">' +
            q.options.map(function (opt) {
              return '<button type="button" class="optionBtn" data-opt="' + esc(opt) + '" aria-pressed="false">' + esc(opt) + '</button>';
            }).join("") +
          '</div>' +
        '</div>'
      );
    }).join("");

    // tap to select
    qsa(".qcard").forEach(function (card) {
      card.addEventListener("click", function (ev) {
        var btn = ev.target && ev.target.classList && ev.target.classList.contains("optionBtn") ? ev.target : null;
        if (!btn) return;
        qsa(".optionBtn", card).forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
      });
    });
  }

  function checkMCQ() {
    var feedback = $("ex1Feedback");
    var anyWrong = false;
    var anyCorrect = false;
    var anyAnswered = false;

    qsa(".qcard").forEach(function (card) {
      var qid = card.getAttribute("data-qid");
      var q = MCQ.filter(function (x) { return x.id === qid; })[0];
      if (!q) return;

      var chosenBtn = qsa('.optionBtn[aria-pressed="true"]', card)[0];
      qsa(".optionBtn", card).forEach(function (b) {
        b.classList.remove("correct", "wrong");
      });

      if (!chosenBtn) return;
      anyAnswered = true;

      var chosen = chosenBtn.getAttribute("data-opt");
      if (chosen === q.answer) {
        chosenBtn.classList.add("correct");
        anyCorrect = true;
        awardPoint("mcq", qid);
      } else {
        chosenBtn.classList.add("wrong");
        anyWrong = true;
      }
    });

    if (feedback) {
      feedback.classList.remove("ok", "bad");
      if (!anyAnswered) {
        feedback.textContent = t("noAnswers");
      } else if (!anyWrong) {
        feedback.textContent = t("allCorrect");
        feedback.classList.add("ok");
      } else if (anyCorrect) {
        feedback.textContent = t("partial") + " " + t("fix");
        feedback.classList.add("bad");
      } else {
        feedback.textContent = t("fix");
        feedback.classList.add("bad");
      }
    }

    if (anyWrong) resetStreak();
  }

  function hintMCQ() {
    var hintEl = $("ex1Hint");
    if (!hintEl) return;
    var lines = MCQ.map(function (q, idx) { return (idx + 1) + ") " + q.hint; });
    hintEl.innerHTML = "<b>" + esc(state.ui === "fr" ? "Indices" : "Hints") + ":</b><br>" + esc(lines.join("\n")).replace(/\n/g, "<br>");
    setHidden(hintEl, false);
  }

  function resetMCQ() {
    // remove scored points for mcq
    Object.keys(state.scored.mcq).forEach(function (k) { revokePoint("mcq", k); });

    qsa(".qcard").forEach(function (card) {
      qsa(".optionBtn", card).forEach(function (b) {
        b.setAttribute("aria-pressed", "false");
        b.classList.remove("correct", "wrong");
      });
    });

    var feedback = $("ex1Feedback");
    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("ok", "bad");
    }
    setHidden($("ex1Hint"), true);
    resetStreak();
  }

  /* ---------------------------
     Render: Exercise 2 (Word bank)
  ----------------------------*/
  var bankSelected = null;
  var bankUseCount = {}; // word -> used count

  function renderBank() {
    var bankWords = $("bankWords");
    var wrap = $("bankWrap");
    if (!bankWords || !wrap) return;

    bankSelected = null;
    bankUseCount = {};

    bankWords.innerHTML = BANK.words.map(function (w) {
      return '<button type="button" class="pill" data-word="' + esc(w) + '">' + esc(w) + '</button>';
    }).join("");

    wrap.innerHTML = '<div class="blanks">' + BANK.items.map(function (it) {
      // build sentence with blanks
      var html = '<div class="sentence" data-item="' + esc(it.id) + '">';
      for (var i = 0; i < it.textParts.length; i++) {
        html += esc(it.textParts[i]);
        if (i < it.blanks.length) {
          html += ' <button type="button" class="blank" data-blank="' + i + '" aria-label="blank"></button> ';
        }
      }
      html += '</div>';
      return html;
    }).join("") + "</div>";

    // selection handlers
    qsa(".pill", bankWords).forEach(function (pill) {
      pill.addEventListener("click", function () {
        if (pill.getAttribute("aria-disabled") === "true") return;
        qsa(".pill", bankWords).forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        bankSelected = pill.getAttribute("data-word");
      });
    });

    qsa(".blank", wrap).forEach(function (blank) {
      blank.addEventListener("click", function () {
        var current = blank.getAttribute("data-value");
        if (current) {
          // clear
          blank.removeAttribute("data-value");
          blank.textContent = "";
          blank.classList.remove("filled");
          // decrement count
          bankUseCount[current] = Math.max(0, (bankUseCount[current] || 0) - 1);
          updateBankDisable();
          return;
        }
        if (!bankSelected) return;
        blank.setAttribute("data-value", bankSelected);
        blank.textContent = bankSelected;
        blank.classList.add("filled");
        bankUseCount[bankSelected] = (bankUseCount[bankSelected] || 0) + 1;
        updateBankDisable();
      });
    });

    updateBankDisable();
  }

  function updateBankDisable() {
    // allow reuse (unlimited) by default; but for nicer UX, visually dim words used >= 2
    var bankWords = $("bankWords");
    if (!bankWords) return;
    qsa(".pill", bankWords).forEach(function (pill) {
      var w = pill.getAttribute("data-word");
      var c = bankUseCount[w] || 0;
      pill.setAttribute("aria-disabled", "false");
      pill.style.opacity = c >= 2 ? "0.65" : "1";
    });
  }

  function checkBank() {
    var feedback = $("ex2Feedback");
    var anyWrong = false;
    var anyCorrect = false;

    BANK.items.forEach(function (it) {
      var sent = document.querySelector('.sentence[data-item="' + it.id + '"]');
      if (!sent) return;
      var blanks = qsa(".blank", sent);

      var okAll = true;
      for (var i = 0; i < it.blanks.length; i++) {
        var want = it.blanks[i];
        var got = blanks[i] ? (blanks[i].getAttribute("data-value") || "") : "";
        if (String(got) !== String(want)) okAll = false;
      }

      if (okAll) {
        anyCorrect = true;
        awardPoint("bank", it.id);
      } else {
        // only count as wrong if they've filled something
        var filledAny = blanks.some(function (b) { return !!b.getAttribute("data-value"); });
        if (filledAny) anyWrong = true;
      }
    });

    if (feedback) {
      feedback.classList.remove("ok", "bad");
      if (!anyWrong && anyCorrect) {
        feedback.textContent = t("allCorrect");
        feedback.classList.add("ok");
      } else if (anyCorrect) {
        feedback.textContent = t("partial") + " " + t("fix");
        feedback.classList.add("bad");
      } else {
        feedback.textContent = t("fix");
        feedback.classList.add("bad");
      }
    }

    if (anyWrong) resetStreak();
  }

  function hintBank() {
    var hintEl = $("ex2Hint");
    if (!hintEl) return;
    var lines = BANK.items.map(function (it, idx) {
      return (idx + 1) + ") " + it.hint;
    });
    hintEl.innerHTML = "<b>" + esc(state.ui === "fr" ? "Indices" : "Hints") + ":</b><br>" + esc(lines.join("\n")).replace(/\n/g, "<br>");
    setHidden(hintEl, false);
  }

  function resetBank() {
    Object.keys(state.scored.bank).forEach(function (k) { revokePoint("bank", k); });
    renderBank();

    var feedback = $("ex2Feedback");
    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("ok", "bad");
    }
    setHidden($("ex2Hint"), true);
    resetStreak();
  }

  /* ---------------------------
     Render: Exercise 3 (Sentence builder)
  ----------------------------*/
  var builderState = {}; // id -> array of chosen tokens

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function renderBuilder() {
    var wrap = $("builderWrap");
    if (!wrap) return;

    builderState = {};

    wrap.innerHTML = '<div class="builder">' + BUILDER.map(function (it, idx) {
      var tiles = shuffle(it.tiles);
      builderState[it.id] = [];
      return (
        '<div class="sentence" data-bid="' + esc(it.id) + '">' +
          '<div class="qcard__top">' +
            '<p class="qcard__q">' + (idx + 1) + '. ' + esc(state.ui === "fr" ? "Construisez la phrase" : "Build the sentence") + '</p>' +
            '<button class="speak" type="button" data-say="' + esc(it.answer) + '">🔊</button>' +
          '</div>' +
          '<div class="tileRow" aria-label="tiles">' +
            tiles.map(function (tok) {
              return '<button type="button" class="tile" data-token="' + esc(tok) + '">' + esc(tok) + '</button>';
            }).join("") +
          '</div>' +
          '<div class="slot" aria-label="your sentence"></div>' +
        '</div>'
      );
    }).join("") + "</div>";

    // bind tile clicks
    qsa('.sentence[data-bid]').forEach(function (sent) {
      var bid = sent.getAttribute("data-bid");
      var slot = qsa(".slot", sent)[0];

      sent.addEventListener("click", function (ev) {
        var target = ev.target;

        // add from pool
        if (target && target.classList && target.classList.contains("tile")) {
          if (target.classList.contains("used")) return;
          var tok = target.getAttribute("data-token");
          builderState[bid].push(tok);
          target.classList.add("used");
          renderSlot(slot, bid);
          return;
        }

        // remove from slot
        if (target && target.classList && target.classList.contains("slotTok")) {
          var idx = parseInt(target.getAttribute("data-idx"), 10);
          if (!isFinite(idx)) return;
          var removed = builderState[bid].splice(idx, 1)[0];
          // un-use one matching tile
          var poolTiles = qsa(".tile", sent);
          for (var i = 0; i < poolTiles.length; i++) {
            if (poolTiles[i].getAttribute("data-token") === removed && poolTiles[i].classList.contains("used")) {
              poolTiles[i].classList.remove("used");
              break;
            }
          }
          renderSlot(slot, bid);
          return;
        }

      });
    });

    // Speak buttons inside builder are new; bind
    bindSpeakButtons();
  }

  function renderSlot(slot, bid) {
    if (!slot) return;
    var toks = builderState[bid] || [];
    slot.innerHTML = toks.map(function (tok, i) {
      return '<button type="button" class="tile slotTok" data-idx="' + i + '">' + esc(tok) + '</button>';
    }).join("");
  }

  function checkBuilder() {
    var feedback = $("ex3Feedback");
    var anyWrong = false;
    var anyCorrect = false;

    BUILDER.forEach(function (it) {
      var toks = builderState[it.id] || [];
      var built = toks.join(" ");
      var ok = normSentence(built) === normSentence(it.answer);
      if (ok) {
        anyCorrect = true;
        awardPoint("builder", it.id);
      } else {
        if (toks.length) anyWrong = true;
      }
    });

    if (feedback) {
      feedback.classList.remove("ok", "bad");
      if (!anyWrong && anyCorrect) {
        feedback.textContent = t("allCorrect");
        feedback.classList.add("ok");
      } else if (anyCorrect) {
        feedback.textContent = t("partial") + " " + t("fix");
        feedback.classList.add("bad");
      } else {
        feedback.textContent = t("fix");
        feedback.classList.add("bad");
      }
    }

    if (anyWrong) resetStreak();
  }

  function hintBuilder() {
    var hintEl = $("ex3Hint");
    if (!hintEl) return;
    var lines = BUILDER.map(function (it, idx) { return (idx + 1) + ") " + it.hint; });
    hintEl.innerHTML = "<b>" + esc(state.ui === "fr" ? "Indices" : "Hints") + ":</b><br>" + esc(lines.join("\n")).replace(/\n/g, "<br>");
    setHidden(hintEl, false);
  }

  function resetBuilder() {
    Object.keys(state.scored.builder).forEach(function (k) { revokePoint("builder", k); });
    renderBuilder();

    var feedback = $("ex3Feedback");
    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("ok", "bad");
    }
    setHidden($("ex3Hint"), true);
    resetStreak();
  }

  /* ---------------------------
     Render: Exercise 4 (Dialogue)
  ----------------------------*/
  function renderDialogue() {
    var wrap = $("dialogueWrap");
    if (!wrap) return;

    wrap.innerHTML = '<div class="dialogue">' + DIALOGUE.lines.map(function (ln, idx) {
      var inputId = "dlg_" + idx;
      // split around ____
      var parts = ln.text.split("____");
      var before = parts[0] || "";
      var after = parts[1] || "";
      return (
        '<div class="line" data-dix="' + idx + '">' +
          '<div class="who">' + esc(ln.who) + '</div>' +
          '<div class="say">' + esc(before) +
            ' <input type="text" inputmode="text" autocapitalize="none" autocomplete="off" spellcheck="false" id="' + esc(inputId) + '" placeholder="..." /> '
            + esc(after) +
          '</div>' +
        '</div>'
      );
    }).join("") + "</div>";

    // Add model listen button under
    wrap.insertAdjacentHTML(
      "beforeend",
      '<div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap">' +
      '<button type="button" class="btn btn--ghost" id="btnSpeakDialogue">🔊 ' + esc(state.ui === "fr" ? "Écouter le dialogue" : "Listen to dialogue") + '</button>' +
      '</div>'
    );

    var btn = $("btnSpeakDialogue");
    if (btn) {
      btn.addEventListener("click", function () {
        var full = DIALOGUE.lines.map(function (ln) {
          // speak with the correct answer
          return ln.text.replace("____", ln.answer);
        }).join(" ");
        speak(full);
      });
    }
  }

  function checkDialogue() {
    var feedback = $("ex4Feedback");
    var anyWrong = false;
    var anyCorrect = false;

    DIALOGUE.lines.forEach(function (ln, idx) {
      var input = $("dlg_" + idx);
      if (!input) return;
      var got = String(input.value || "").trim();
      var want = String(ln.answer).trim();
      var ok = got.toLowerCase() === want.toLowerCase();

      // minimal highlighting without needing CSS classes
      input.style.borderColor = ok ? "rgba(52,211,153,.45)" : (got ? "rgba(251,113,133,.55)" : "rgba(238,242,255,.12)");

      if (ok) {
        anyCorrect = true;
        awardPoint("dialogue", "d" + idx);
      } else {
        if (got) anyWrong = true;
      }
    });

    if (feedback) {
      feedback.classList.remove("ok", "bad");
      if (!anyWrong && anyCorrect) {
        feedback.textContent = t("allCorrect");
        feedback.classList.add("ok");
      } else if (anyCorrect) {
        feedback.textContent = t("partial") + " " + t("fix");
        feedback.classList.add("bad");
      } else {
        feedback.textContent = t("fix");
        feedback.classList.add("bad");
      }
    }

    if (anyWrong) resetStreak();
  }

  function hintDialogue() {
    var hintEl = $("ex4Hint");
    if (!hintEl) return;
    hintEl.innerHTML = "<b>" + esc(state.ui === "fr" ? "Indice" : "Hint") + ":</b> " + esc(DIALOGUE.hint);
    setHidden(hintEl, false);
  }

  function resetDialogue() {
    Object.keys(state.scored.dialogue).forEach(function (k) { revokePoint("dialogue", k); });
    renderDialogue();

    var feedback = $("ex4Feedback");
    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("ok", "bad");
    }
    setHidden($("ex4Hint"), true);
    resetStreak();
  }

  /* ---------------------------
     Speaking prompts
  ----------------------------*/
  function renderPrompts() {
    var grid = $("promptGrid");
    if (!grid) return;

    grid.innerHTML = PROMPTS.map(function (p, idx) {
      return (
        '<div class="prompt">' +
          '<div class="prompt__title">' +
            '<b>' + esc(p.title) + '</b>' +
            '<div class="prompt__actions">' +
              '<button type="button" class="speak" data-say="' + esc(p.model) + '">🔊</button>' +
            '</div>' +
          '</div>' +
          '<p class="muted" style="margin:10px 0 0">' + esc(p.model) + '</p>' +
        '</div>'
      );
    }).join("");

    bindSpeakButtons();
  }

  function shufflePrompts() {
    PROMPTS = shuffle(PROMPTS);
    renderPrompts();
    renderVocab();
  }

  /* ---------------------------
     Buttons wiring
  ----------------------------*/
  function bindGlobalButtons() {
    var accentSelect = $("accentSelect");
    var uiSelect = $("uiLangSelect");

    if (accentSelect) {
      accentSelect.value = state.accent;
      accentSelect.addEventListener("change", function () {
        state.accent = accentSelect.value === "uk" ? "uk" : "us";
        saveState();
      });
    }

    if (uiSelect) {
      uiSelect.value = state.ui;
      uiSelect.addEventListener("change", function () {
        state.ui = uiSelect.value === "fr" ? "fr" : "en";
        saveState();
        applyI18n();
        // re-render elements that include UI-dependent text
        renderMCQ();
        renderBuilder();
        renderDialogue();
        renderBank();
        renderPrompts();
        renderVocab();
    renderVocab();
        // keep hint panels consistent
        setHidden($("ex1Hint"), true);
        setHidden($("ex2Hint"), true);
        setHidden($("ex3Hint"), true);
        setHidden($("ex4Hint"), true);
      });
    }

    var btnVoice = $("btnVoice");
    if (btnVoice) {
      btnVoice.addEventListener("click", function () {
        speak(state.ui === "fr" ? "Bienvenue à l'hôtel." : "Welcome to the hotel.");
      });
    }

    var btnResetAll = $("btnResetAll");
    if (btnResetAll) {
      btnResetAll.addEventListener("click", function () {
        resetAll();
      });
    }

    var btnShuffle = $("btnShufflePrompts");
    if (btnShuffle) {
      btnShuffle.addEventListener("click", shufflePrompts);
    }

    var btnVocabReset = $("btnVocabReset");
    if (btnVocabReset) {
      btnVocabReset.addEventListener("click", function () {
        resetVocab();
      });
    }

    // delegated exercise buttons
    qsa("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-action");
        var target = btn.getAttribute("data-target");
        if (!action || !target) return;

        if (target === "ex1") {
          if (action === "check") checkMCQ();
          if (action === "hint") hintMCQ();
          if (action === "reset") resetMCQ();
        }
        if (target === "ex2") {
          if (action === "check") checkBank();
          if (action === "hint") hintBank();
          if (action === "reset") resetBank();
        }
        if (target === "ex3") {
          if (action === "check") checkBuilder();
          if (action === "hint") hintBuilder();
          if (action === "reset") resetBuilder();
        }
        if (target === "ex4") {
          if (action === "check") checkDialogue();
          if (action === "hint") hintDialogue();
          if (action === "reset") resetDialogue();
        }
      });
    });
  }

  function resetAll() {
    // clear score
    state.score = 0;
    state.streak = 0;
    state.scored = { mcq: {}, bank: {}, builder: {}, dialogue: {} };

    // re-render exercises
    renderMCQ();
    renderBank();
    renderBuilder();
    renderDialogue();
    renderPrompts();

    // clear feedback + hints
    ["ex1Feedback", "ex2Feedback", "ex3Feedback", "ex4Feedback"].forEach(function (id) {
      var el = $(id);
      if (el) {
        el.textContent = "";
        el.classList.remove("ok", "bad");
      }
    });

    ["ex1Hint", "ex2Hint", "ex3Hint", "ex4Hint"].forEach(function (id) {
      setHidden($(id), true);
    });

    setScoreText();

    // optional: reset stored settings? keep settings; user can change and then Reset only content
  }

  /* ---------------------------
     Init
  ----------------------------*/
  function init() {
    loadState();

    // Make sure voices populate on Safari/iOS
    refreshVoices();
    if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }

    applyI18n();
    bindGlobalButtons();

    renderMCQ();
    renderBank();
    renderBuilder();
    renderDialogue();
    renderPrompts();

    // initial speak buttons (lesson examples)
    bindSpeakButtons();

    // total max score
    setMax(MCQ.length + BANK.items.length + BUILDER.length + DIALOGUE.lines.length);
    setScoreText();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
    TTS.init();
  }

})();
