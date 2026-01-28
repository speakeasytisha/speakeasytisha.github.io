/* SpeakEasyTisha — USA Phone Setup (One‑Stop Lesson)
   JS for: usa-phone-setup.html
   Goals: Mac + iPad Safari friendly, tap-first interactions, instant feedback, US/UK TTS, saved progress.
*/
(function () {
  "use strict";

  /* ----------------------- Tiny polyfills ----------------------- */
  (function () {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
          var m = (this.document || this.ownerDocument).querySelectorAll(s);
          var i = m.length;
          while (--i >= 0 && m.item(i) !== this) {}
          return i > -1;
        };
    }
    if (!Element.prototype.closest) {
      Element.prototype.closest = function (s) {
        var el = this;
        while (el && el.nodeType === 1) {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        }
        return null;
      };
    }
  })();

  /* ----------------------- Helpers ----------------------- */
  var $ = function (id) { return document.getElementById(id); };
  var qs = function (sel, root) { return (root || document).querySelector(sel); };
  var qsa = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function norm(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .trim()
      .replace(/[’']/g, "'")
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9\s\-\?]/g, "");
  }

  function copyText(text) {
    var t = String(text || "");
    if (!t) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).catch(function () { fallbackCopy(t); });
    } else {
      fallbackCopy(t);
    }
  }
  function fallbackCopy(t) {
    var ta = document.createElement("textarea");
    ta.value = t;
    ta.setAttribute("readonly", "readonly");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  /* ----------------------- Persisted state ----------------------- */
  var STORAGE_KEY = "speakeasy_usa_phone_setup_v1";
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch (e) {
      return {};
    }
  }
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
      showSaved();
    } catch (e) {}
  }

  var STATE = loadState();
  if (!STATE.settings) STATE.settings = {};
  if (!STATE.checklist) STATE.checklist = {};
  if (!STATE.score) STATE.score = { points: 0, streak: 0 };

  function showSaved() {
    var el = $("saveVal");
    if (!el) return;
    el.textContent = "Saved ✓";
    el.style.opacity = "1";
    clearTimeout(showSaved._t);
    showSaved._t = setTimeout(function () { el.style.opacity = "0.6"; }, 700);
  }

  function addPoints(n, streakMode) {
    n = Number(n || 0);
    if (!STATE.score) STATE.score = { points: 0, streak: 0 };
    STATE.score.points += n;

    if (streakMode === "correct") STATE.score.streak += 1;
    if (streakMode === "reset") STATE.score.streak = 0;

    renderScore();
    saveState();
  }

  function renderScore() {
    var sv = $("scoreVal");
    var st = $("streakVal");
    if (sv) sv.textContent = String(STATE.score && STATE.score.points != null ? STATE.score.points : 0);
    if (st) st.textContent = String(STATE.score && STATE.score.streak != null ? STATE.score.streak : 0);
  }

  /* ----------------------- TTS (US/UK) ----------------------- */
  var TTS = { accent: "us", voices: [], ready: false, speaking: false };

  function loadAccent() {
    var a = (STATE.settings && STATE.settings.accent) || "us";
    return (a === "uk" || a === "us") ? a : "us";
  }

  function setAccent(a) {
    TTS.accent = (a === "uk") ? "uk" : "us";
    STATE.settings.accent = TTS.accent;
    reflectAccentUI();
    saveState();
  }

  function initVoices() {
    if (!window.speechSynthesis) return;
    try {
      TTS.voices = window.speechSynthesis.getVoices() || [];
      TTS.ready = true;
    } catch (e) {}
  }

  function pickVoice() {
    if (!TTS.voices || !TTS.voices.length) return null;
    var want = (TTS.accent === "uk") ? ["en-GB", "en_GB"] : ["en-US", "en_US"];
    for (var i = 0; i < TTS.voices.length; i++) {
      var v = TTS.voices[i];
      var lang = String(v.lang || "");
      for (var k = 0; k < want.length; k++) {
        if (lang.indexOf(want[k]) !== -1) return v;
      }
    }
    for (var j = 0; j < TTS.voices.length; j++) {
      var v2 = TTS.voices[j];
      if (String(v2.lang || "").toLowerCase().indexOf("en") === 0) return v2;
    }
    return TTS.voices[0] || null;
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    var t = String(text || "").trim();
    if (!t) return;

    try { window.speechSynthesis.cancel(); } catch (e) {}

    var u = new SpeechSynthesisUtterance(t);
    var v = pickVoice();
    if (v) u.voice = v;
    u.rate = 1;
    u.pitch = 1;

    try { window.speechSynthesis.speak(u); } catch (e) {}
  }

  // Speak a list of lines sequentially (better than timeouts)
  function speakQueue(lines) {
    if (!window.speechSynthesis) return;
    var queue = (lines || []).map(function (s) { return String(s || "").trim(); }).filter(Boolean);
    if (!queue.length) return;

    try { window.speechSynthesis.cancel(); } catch (e) {}

    var i = 0;
    function next() {
      if (i >= queue.length) return;
      var u = new SpeechSynthesisUtterance(queue[i]);
      var v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1; u.pitch = 1;
      u.onend = function () { i++; next(); };
      u.onerror = function () { i++; next(); };
      try { window.speechSynthesis.speak(u); } catch (e) { i++; next(); }
    }
    next();
  }

  function reflectAccentUI() {
    var bUS = $("voiceUS");
    var bUK = $("voiceUK");
    if (bUS) bUS.setAttribute("aria-pressed", TTS.accent === "us" ? "true" : "false");
    if (bUK) bUK.setAttribute("aria-pressed", TTS.accent === "uk" ? "true" : "false");
  }

  /* ----------------------- French help toggle ----------------------- */
  function loadFrHelp() {
    if (STATE.settings && typeof STATE.settings.frHelp === "boolean") return STATE.settings.frHelp;
    // HTML default shows FR ON (aria-pressed true on #frOn)
    return true;
  }

  function setFrHelp(on) {
    var v = !!on;
    STATE.settings.frHelp = v;
    document.body.classList.toggle("fr-on", v);

    var bOn = $("frOn");
    var bOff = $("frOff");
    if (bOn) bOn.setAttribute("aria-pressed", v ? "true" : "false");
    if (bOff) bOff.setAttribute("aria-pressed", v ? "false" : "true");

    saveState();
  }

  /* ----------------------- Tabs scroll ----------------------- */
  function wireScrollButtons() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-scroll]");
      if (!b) return;
      var sel = b.getAttribute("data-scroll");
      if (!sel) return;
      var target = document.querySelector(sel);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ----------------------- Checklist (accordion) ----------------------- */
  var CHECKLIST = [
    {
      title: "Phase 1 — Choose a plan + carrier",
      fr: "Choisir forfait + opérateur",
      items: [
        { en: "Check coverage where you live/work (city + indoors).", fr: "Vérifie la couverture là où tu vis/travailles (ville + intérieur)." },
        { en: "Decide prepaid vs postpaid (credit check/SSN may be needed for postpaid).", fr: "Choisis prépayé vs postpayé (postpayé = parfois SSN/credit check)." },
        { en: "Compare data, hotspot rules, taxes/fees, and family lines.", fr: "Compare data, hotspot, taxes/frais, lignes famille." },
        { en: "If you’re new: consider prepaid/MVNO to start quickly.", fr: "Au début : pense au prépayé/MVNO pour démarrer vite." }
      ]
    },
    {
      title: "Phase 2 — Check your phone",
      fr: "Vérifier le téléphone",
      items: [
        { en: "Confirm your phone is unlocked.", fr: "Confirme que ton téléphone est désimlocké." },
        { en: "Check US network compatibility (bands, model).", fr: "Vérifie la compatibilité US (bandes, modèle)." },
        { en: "Update your phone OS (iOS/Android) before activating.", fr: "Mets à jour iOS/Android avant l’activation." }
      ]
    },
    {
      title: "Phase 3 — SIM vs eSIM",
      fr: "SIM vs eSIM",
      items: [
        { en: "Decide SIM (physical) or eSIM (QR/app).", fr: "Choisis SIM (physique) ou eSIM (QR/app)." },
        { en: "If using eSIM: have Wi‑Fi available during activation.", fr: "Pour eSIM : aie une bonne connexion Wi‑Fi." }
      ]
    },
    {
      title: "Phase 4 — Activate + test",
      fr: "Activer + tester",
      items: [
        { en: "Activate the line (QR/app/SIM) and wait for service.", fr: "Active la ligne (QR/app/SIM) et attends le réseau." },
        { en: "Test calls, SMS, and mobile data.", fr: "Teste appels, SMS et data." },
        { en: "If data fails: check APN settings (especially Android).", fr: "Si data ne marche pas : vérifie APN (souvent Android)." }
      ]
    },
    {
      title: "Phase 5 — Keep your number (optional)",
      fr: "Garder le numéro (option)",
      items: [
        { en: "If porting: keep your old line active until transfer completes.", fr: "Pour la portabilité : garde l’ancienne ligne active." },
        { en: "Bring account number + transfer PIN/ZIP (carrier dependent).", fr: "Prends numéro de compte + transfer PIN/ZIP (selon opérateur)." }
      ]
    },
    {
      title: "Phase 6 — After setup",
      fr: "Après l’activation",
      items: [
        { en: "Set up voicemail greeting.", fr: "Configure la messagerie vocale." },
        { en: "Turn on Wi‑Fi calling if indoor signal is weak.", fr: "Active les appels Wi‑Fi si le signal est faible à l’intérieur." },
        { en: "Update 2FA (bank, email, apps) to your new number.", fr: "Mets à jour la double authentification (banque, email, applis)." }
      ]
    }
  ];

  function checklistKey(pi, ii) { return "p" + pi + "_i" + ii; }

  function renderChecklist() {
    var host = $("checklist");
    if (!host) return;

    var html = "";
    for (var p = 0; p < CHECKLIST.length; p++) {
      var phase = CHECKLIST[p];
      var pid = "phase_" + p;
      html += '<div class="acc" data-p="' + p + '">';
      html += '  <button class="acc__btn" type="button" aria-expanded="false" aria-controls="' + pid + '">';
      html += '    <div><strong>' + esc(phase.title) + '</strong></div>';
      html += '    <div class="muted frhelp">' + esc(phase.fr || "") + "</div>";
      html += "  </button>";
      html += '  <div class="acc__panel" id="' + pid + '" hidden>';
      html += '    <ul class="bullets">';
      for (var i = 0; i < phase.items.length; i++) {
        var it = phase.items[i];
        var k = checklistKey(p, i);
        var checked = !!STATE.checklist[k];
        html += '<li class="clRow">';
        html += '  <label class="cl">';
        html += '    <input type="checkbox" data-cl="' + esc(k) + '"' + (checked ? " checked" : "") + ">";
        html += '    <span class="cl__en">' + esc(it.en) + "</span>";
        html += "  </label>";
        html += '  <div class="cl__fr frhelp">' + esc(it.fr || "") + "</div>";
        html += "</li>";
      }
      html += "    </ul>";
      html += "  </div>";
      html += "</div>";
    }

    host.innerHTML = html;
    document.body.classList.toggle("fr-on", !!loadFrHelp());

    // Accordion open/close
    host.addEventListener("click", function (e) {
      var btn = e.target.closest(".acc__btn");
      if (!btn) return;
      var acc = btn.closest(".acc");
      if (!acc) return;
      var panel = acc.querySelector(".acc__panel");
      if (!panel) return;

      var open = btn.getAttribute("aria-expanded") === "true";
      // close others
      qsa(".acc", host).forEach(function (a) {
        var b = a.querySelector(".acc__btn");
        var p = a.querySelector(".acc__panel");
        if (!b || !p) return;
        b.setAttribute("aria-expanded", "false");
        p.hidden = true;
        a.classList.remove("is-open");
      });

      // toggle this
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        acc.classList.add("is-open");
      } else {
        btn.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        acc.classList.remove("is-open");
      }
    }, { passive: true });

    // Checkbox changes
    host.addEventListener("change", function (e) {
      var cb = e.target && e.target.matches('input[type="checkbox"][data-cl]') ? e.target : null;
      if (!cb) return;
      var k = cb.getAttribute("data-cl");
      STATE.checklist[k] = !!cb.checked;
      renderProgress();
      addPoints(cb.checked ? 1 : 0);
    });

    renderProgress();
  }

  function checklistStats() {
    var total = 0, done = 0;
    for (var p = 0; p < CHECKLIST.length; p++) {
      for (var i = 0; i < CHECKLIST[p].items.length; i++) {
        total++;
        var k = checklistKey(p, i);
        if (STATE.checklist && STATE.checklist[k]) done++;
      }
    }
    return { total: total, done: done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function renderProgress() {
    var pill = $("progressPill");
    if (!pill) return;
    var s = checklistStats();
    pill.textContent = "Progress: " + s.pct + "%";
  }

  function checklistText() {
    var lines = [];
    lines.push("USA Phone Setup — Checklist");
    for (var p = 0; p < CHECKLIST.length; p++) {
      lines.push("");
      lines.push("• " + CHECKLIST[p].title);
      for (var i = 0; i < CHECKLIST[p].items.length; i++) {
        var k = checklistKey(p, i);
        var mark = (STATE.checklist && STATE.checklist[k]) ? "[x]" : "[ ]";
        lines.push("  " + mark + " " + CHECKLIST[p].items[i].en);
      }
    }
    return lines.join("\n");
  }

  function wireChecklistButtons() {
    var start = $("btnStartChecklist");
    var copy = $("btnCopyChecklist");
    var reset = $("btnResetChecklist");
    var prog = $("btnChecklistProgress");

    if (start) start.addEventListener("click", function () {
      var sec = $("steps");
      if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
      // open first phase
      var host = $("checklist");
      if (host) {
        var first = host.querySelector(".acc__btn");
        if (first) first.click();
      }
    });

    if (copy) copy.addEventListener("click", function () { copyText(checklistText()); addPoints(1); });

    if (reset) reset.addEventListener("click", function () {
      STATE.checklist = {};
      saveState();
      renderChecklist();
      addPoints(0, "reset");
    });

    if (prog) prog.addEventListener("click", function () {
      var s = checklistStats();
      var msg = "Progress: " + s.pct + "% (" + s.done + "/" + s.total + " tasks)";
      var pill = $("progressPill");
      if (pill) pill.textContent = msg;
      addPoints(1);
    });
  }

  /* ----------------------- “Choose your path” helper ----------------------- */
  var PATHS = {
    keep_fr_phone: [
      "Check your French phone is unlocked + compatible with US networks.",
      "Choose a prepaid plan to start (easy activation).",
      "Activate SIM/eSIM and test calls/SMS/data.",
      "If you keep your French SIM too: use dual SIM/eSIM (if supported)."
    ],
    buy_us_phone: [
      "Choose a carrier first (coverage where you live).",
      "Buy a phone unlocked (recommended) or from the carrier.",
      "Activate SIM/eSIM in-store or online.",
      "Set up voicemail + Wi‑Fi calling."
    ],
    keep_fr_number: [
      "Keep your French number on WhatsApp / iMessage / apps (works with Wi‑Fi).",
      "Consider a cheap French plan for SMS/2FA, or use a virtual number service.",
      "Use a US plan for daily calls + data in the US."
    ],
    need_temp: [
      "Use airport/store prepaid SIM or eSIM (quick start).",
      "Use Wi‑Fi calling / WhatsApp while you choose a long-term plan.",
      "After 1 week: compare carriers and switch if needed."
    ]
  };

  function wirePathHelper() {
    var sel = $("pathSelect");
    var btn = $("btnShowPath");
    var out = $("pathResult");
    if (!sel || !btn || !out) return;

    btn.addEventListener("click", function () {
      var k = sel.value;
      var steps = PATHS[k] || [];
      if (!steps.length) {
        out.textContent = "Select a scenario and click “Show my steps”.";
        return;
      }
      out.innerHTML = "<ol class='bullets'>" + steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>";
      addPoints(2);
    });
  }

  /* ----------------------- Vocabulary flashcards ----------------------- */
  var VOCAB = [
    // Basics
    { cat: "Basics", icon: "📱", front: "SIM card", backEn: "A small card that connects your phone to a network.", exEn: "Could you install the SIM card for me?", backFr: "Carte SIM (physique).", exFr: "Pouvez-vous installer la carte SIM ?" },
    { cat: "Basics", icon: "🧾", front: "eSIM", backEn: "A digital SIM activated by QR code or app.", exEn: "I need to scan a QR code to add the eSIM.", backFr: "eSIM = SIM intégrée / digitale.", exFr: "Je dois scanner un QR code pour ajouter l’eSIM." },
    { cat: "Basics", icon: "🔓", front: "unlocked phone", backEn: "A phone that can work with different carriers.", exEn: "Is my phone unlocked?", backFr: "Téléphone débloqué / désimlocké.", exFr: "Mon téléphone est-il désimlocké ?" },

    // Plans & billing
    { cat: "Plans & Billing", icon: "📦", front: "plan", backEn: "The package you pay for (data, price).", exEn: "This plan includes unlimited calls.", backFr: "Forfait.", exFr: "Ce forfait inclut les appels illimités." },
    { cat: "Plans & Billing", icon: "💳", front: "prepaid", backEn: "Pay in advance; usually easier to start.", exEn: "I’d like a prepaid plan.", backFr: "Prépayé.", exFr: "Je voudrais un forfait prépayé." },
    { cat: "Plans & Billing", icon: "🧾", front: "postpaid", backEn: "Pay after; may require credit check/SSN.", exEn: "Do you need a SSN for postpaid?", backFr: "Postpayé / facturation mensuelle.", exFr: "Faut-il un SSN pour le postpayé ?" },
    { cat: "Plans & Billing", icon: "🌐", front: "data cap", backEn: "A limit on how much mobile data you can use.", exEn: "Have I reached my data cap?", backFr: "Plafond de data.", exFr: "Ai-je atteint mon plafond de data ?" },

    // Activation & settings
    { cat: "Activation", icon: "✅", front: "activation", backEn: "The process of enabling service on your line.", exEn: "Activation can take a few minutes.", backFr: "Activation.", exFr: "L’activation peut prendre quelques minutes." },
    { cat: "Activation", icon: "⚙️", front: "APN settings", backEn: "Network settings that make mobile data work.", exEn: "Can you help me check the APN settings?", backFr: "Paramètres APN.", exFr: "Pouvez-vous vérifier les paramètres APN ?" },
    { cat: "Activation", icon: "📶", front: "Wi‑Fi calling", backEn: "Calling through Wi‑Fi when signal is weak.", exEn: "Can you turn on Wi‑Fi calling?", backFr: "Appels Wi‑Fi.", exFr: "Pouvez-vous activer les appels Wi‑Fi ?" },

    // Store/support phrases
    { cat: "Store Phrases", icon: "🗣️", front: "Could you help me…?", backEn: "Polite request for support.", exEn: "Could you help me activate this eSIM?", backFr: "Pour demander poliment.", exFr: "Pourriez-vous m’aider à activer cette eSIM ?" },
    { cat: "Store Phrases", icon: "🔁", front: "transfer / port my number", backEn: "Move your number to a new carrier.", exEn: "I want to port my number.", backFr: "Portabilité du numéro.", exFr: "Je veux garder mon numéro." },

    // Troubleshooting
    { cat: "Troubleshooting", icon: "📡", front: "no service", backEn: "No signal / no bars on the phone.", exEn: "I have no service right now.", backFr: "Pas de réseau.", exFr: "Je n’ai pas de réseau." },
    { cat: "Troubleshooting", icon: "💬", front: "SMS", backEn: "Text messages.", exEn: "I can’t send SMS.", backFr: "SMS.", exFr: "Je n’arrive pas à envoyer des SMS." },

    // Security
    { cat: "Security", icon: "🔐", front: "two‑factor authentication (2FA)", backEn: "A code sent to your phone to confirm login.", exEn: "My bank uses 2FA.", backFr: "Double authentification (2FA).", exFr: "Ma banque utilise la double authentification." }
  ];

  var VocabState = { cat: null, deck: [], order: [], idx: 0 };

  function vocabCategories() {
    var cats = {};
    for (var i = 0; i < VOCAB.length; i++) cats[VOCAB[i].cat] = true;
    return Object.keys(cats).sort();
  }

  function setVocabCat(cat) {
    VocabState.cat = cat;
    STATE.settings.vocabCat = cat;
    buildVocabDeck(false);
    saveState();
  }

  function buildVocabDeck(shuffleIt) {
    var cat = VocabState.cat || vocabCategories()[0];
    var deck = VOCAB.filter(function (c) { return c.cat === cat; });
    VocabState.deck = deck;
    VocabState.order = deck.map(function (_, i) { return i; });
    if (shuffleIt) VocabState.order = shuffle(VocabState.order);
    VocabState.idx = 0;
    renderVocabCard();
  }

  function currentVocabItem() {
    if (!VocabState.deck.length) return null;
    var i = VocabState.order[VocabState.idx] || 0;
    return VocabState.deck[i] || null;
  }

  function renderVocabCard() {
    var item = currentVocabItem();
    if (!item) return;

    var icon = $("cardIcon");
    var front = $("cardFront");
    var backEn = $("cardBackEn");
    var exEn = $("cardExampleEn");
    var backFr = $("cardBackFr");
    var exFr = $("cardExampleFr");
    var meta = $("cardMeta");
    var card = $("flashCard");

    if (icon) icon.textContent = item.icon || "📱";
    if (front) front.textContent = item.front || "";
    if (backEn) backEn.textContent = item.backEn || "";
    if (exEn) exEn.textContent = item.exEn || "";
    if (backFr) backFr.textContent = item.backFr || "";
    if (exFr) exFr.textContent = item.exFr || "";

    if (meta) meta.textContent = "Card " + (VocabState.idx + 1) + " / " + VocabState.order.length;
    if (card) card.classList.remove("is-flipped");
  }

  function wireVocab() {
    var sel = $("vocabCat");
    if (!sel) return;

    // Populate categories
    var cats = vocabCategories();
    sel.innerHTML = cats.map(function (c) { return "<option value='" + esc(c) + "'>" + esc(c) + "</option>"; }).join("");

    // Restore
    var savedCat = (STATE.settings && STATE.settings.vocabCat) || cats[0];
    if (cats.indexOf(savedCat) === -1) savedCat = cats[0];
    sel.value = savedCat;
    VocabState.cat = savedCat;

    buildVocabDeck(false);

    sel.addEventListener("change", function () { setVocabCat(sel.value); });

    var prev = $("btnPrevCard");
    var next = $("btnNextCard");
    var shuffleBtn = $("btnVocabShuffle");
    var listenBtn = $("btnVocabListen");
    var card = $("flashCard");

    if (prev) prev.addEventListener("click", function () {
      if (!VocabState.order.length) return;
      VocabState.idx = (VocabState.idx - 1 + VocabState.order.length) % VocabState.order.length;
      renderVocabCard();
      addPoints(1);
    });

    if (next) next.addEventListener("click", function () {
      if (!VocabState.order.length) return;
      VocabState.idx = (VocabState.idx + 1) % VocabState.order.length;
      renderVocabCard();
      addPoints(1);
    });

    if (shuffleBtn) shuffleBtn.addEventListener("click", function () {
      buildVocabDeck(true);
      addPoints(2);
    });

    if (listenBtn) listenBtn.addEventListener("click", function () {
      var it = currentVocabItem();
      if (!it) return;
      speak(it.front);
      addPoints(1);
    });

    if (card) {
      var flip = function () {
        card.classList.toggle("is-flipped");
        var it = currentVocabItem();
        if (it) speak(it.front);
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
      });
    }
  }

  /* ----------------------- Grammar chips ----------------------- */
  var CHIPS = [
    "Could you help me activate this eSIM?",
    "Would you mind checking if my phone is unlocked?",
    "Can I get a prepaid plan with a lot of data?",
    "I need to transfer (port) my number.",
    "My mobile data isn’t working—can you help me check the APN?"
  ];

  function wireChips() {
    var host = $("questionChips");
    if (!host) return;
    host.innerHTML = CHIPS.map(function (t) {
      return '<button class="chip" type="button" data-say="' + esc(t) + '">' + esc(t) + "</button>";
    }).join("");
  }

  /* ----------------------- Practice 1: Politeness quiz ----------------------- */
  var POLITE = [
    {
      q: "You need help activating eSIM.",
      options: ["Activate my eSIM now.", "Could you help me activate this eSIM, please?", "You must activate my eSIM."],
      a: 1,
      hint: "Polite = Could you… / please?"
    },
    {
      q: "You want staff to check if your phone is unlocked.",
      options: ["Check my phone.", "Would you mind checking if my phone is unlocked?", "Do it quickly."],
      a: 1,
      hint: "Would you mind + -ing…"
    },
    {
      q: "You want to keep your number with a new carrier.",
      options: ["I want to port my number.", "Port it.", "Give me a new number."],
      a: 0,
      hint: "Use “I want to…” to sound normal."
    },
    {
      q: "You can't use mobile data.",
      options: ["My mobile data doesn’t work. Can you help me?", "Fix it.", "Data broken."],
      a: 0,
      hint: "Explain the problem + ask for help."
    }
  ];

  function renderPoliteQuiz() {
    var host = $("politeQuiz");
    if (!host) return;
    var html = "";
    for (var i = 0; i < POLITE.length; i++) {
      var it = POLITE[i];
      html += '<div class="q" data-q="' + i + '">';
      html += '  <div class="q__title"><strong>' + (i + 1) + ".</strong> " + esc(it.q) + "</div>";
      html += '  <div class="q__opts">';
      for (var j = 0; j < it.options.length; j++) {
        html += '    <button type="button" class="choice" data-q="' + i + '" data-i="' + j + '">' + esc(it.options[j]) + "</button>";
      }
      html += "  </div>";
      html += "</div>";
    }
    host.innerHTML = html;

    host.addEventListener("click", function (e) {
      var btn = e.target.closest(".choice");
      if (!btn) return;
      var q = Number(btn.getAttribute("data-q"));
      var i = Number(btn.getAttribute("data-i"));
      if (!STATE.practice) STATE.practice = {};
      if (!STATE.practice.polite) STATE.practice.polite = {};
      STATE.practice.polite[q] = i;

      // UI select
      qsa('.choice[data-q="' + q + '"]', host).forEach(function (b) { b.classList.remove("is-selected"); });
      btn.classList.add("is-selected");
      saveState();
    });
  }

  function checkPoliteQuiz() {
    var host = $("politeQuiz");
    var fb = $("politeFeedback");
    if (!host || !fb) return;

    var correct = 0;
    for (var q = 0; q < POLITE.length; q++) {
      var chosen = (STATE.practice && STATE.practice.polite) ? STATE.practice.polite[q] : null;
      var buttons = qsa('.choice[data-q="' + q + '"]', host);
      buttons.forEach(function (b) {
        b.classList.remove("is-correct", "is-wrong");
        var bi = Number(b.getAttribute("data-i"));
        if (bi === POLITE[q].a) b.classList.add("is-correct");
        if (chosen != null && bi === chosen && bi !== POLITE[q].a) b.classList.add("is-wrong");
      });

      if (chosen === POLITE[q].a) correct++;
    }

    if (correct === POLITE.length) {
      fb.innerHTML = '<div class="ok">✅ Perfect! ' + correct + "/" + POLITE.length + " correct.</div>";
      addPoints(10, "correct");
    } else {
      fb.innerHTML = '<div class="nope">❌ ' + correct + "/" + POLITE.length + " correct. Fix the red ones and try again.</div>";
      addPoints(0, "reset");
    }
  }

  function hintPoliteQuiz() {
    var fb = $("politeFeedback");
    if (!fb) return;
    fb.innerHTML = '<div class="hint">💡 Tip: Use <strong>Could you…?</strong> / <strong>Would you mind…?</strong> + <strong>please</strong>.</div>';
    addPoints(1);
  }

  function resetPoliteQuiz() {
    if (STATE.practice && STATE.practice.polite) STATE.practice.polite = {};
    saveState();
    renderPoliteQuiz();
    var fb = $("politeFeedback"); if (fb) fb.textContent = "";
  }

  /* ----------------------- Practice 2: Matching ----------------------- */
  var MATCH = [
    { t: "carrier", d: "the company that provides your mobile service" },
    { t: "coverage", d: "how well the network works in an area" },
    { t: "hotspot", d: "sharing your phone’s internet with another device" },
    { t: "port (transfer) a number", d: "move your phone number to a new provider" },
    { t: "activation", d: "turning on service for your SIM/eSIM" },
    { t: "APN", d: "settings that make mobile data work" }
  ];

  var MatchState = { term: null, map: {}, matched: {} };

  function renderMatch() {
    var tHost = $("matchTerms");
    var dHost = $("matchDefs");
    var fb = $("matchFeedback");
    if (!tHost || !dHost || !fb) return;

    var pairs = shuffle(MATCH);
    MatchState.map = {};
    MatchState.matched = {};
    MatchState.term = null;

    // stable ids
    pairs.forEach(function (p, idx) { MatchState.map["t" + idx] = p; });

    var termsHtml = pairs.map(function (p, idx) {
      return '<button type="button" class="matchBtn" data-term="t' + idx + '">' + esc(p.t) + "</button>";
    }).join("");

    var defs = shuffle(pairs.map(function (p, idx) { return { key: "t" + idx, d: p.d }; }));
    var defsHtml = defs.map(function (x) {
      return '<button type="button" class="matchBtn" data-def="' + esc(x.key) + '">' + esc(x.d) + "</button>";
    }).join("");

    tHost.innerHTML = termsHtml;
    dHost.innerHTML = defsHtml;
    fb.textContent = "Tap a term, then its meaning.";
  }

  function wireMatch() {
    var host = $("practice") || document;
    host.addEventListener("click", function (e) {
      var t = e.target.closest(".matchBtn");
      if (!t) return;

      var termKey = t.getAttribute("data-term");
      var defKey = t.getAttribute("data-def");
      var fb = $("matchFeedback");

      if (termKey) {
        if (MatchState.matched[termKey]) return;
        MatchState.term = termKey;
        qsa('[data-term]', $("matchTerms")).forEach(function (b) { b.classList.remove("is-selected"); });
        t.classList.add("is-selected");
        return;
      }

      if (defKey) {
        if (!MatchState.term) {
          if (fb) fb.innerHTML = '<div class="hint">💡 Pick a term first.</div>';
          return;
        }
        if (MatchState.matched[MatchState.term]) return;

        var correctKey = MatchState.term;
        var ok = defKey === correctKey;

        if (ok) {
          MatchState.matched[correctKey] = true;
          // lock both buttons
          var termBtn = qs('[data-term="' + correctKey + '"]', $("matchTerms"));
          var defBtn = qs('[data-def="' + correctKey + '"]', $("matchDefs"));
          if (termBtn) { termBtn.classList.add("is-correct"); termBtn.disabled = true; termBtn.classList.remove("is-selected"); }
          if (defBtn) { defBtn.classList.add("is-correct"); defBtn.disabled = true; }
          MatchState.term = null;

          var allDone = Object.keys(MatchState.matched).length === MATCH.length;
          if (fb) fb.innerHTML = allDone ? '<div class="ok">✅ All matched!</div>' : '<div class="ok">✅ Good match.</div>';
          addPoints(allDone ? 10 : 2, "correct");
        } else {
          if (fb) fb.innerHTML = '<div class="nope">❌ Not a match. Try again.</div>';
          addPoints(0, "reset");
        }
      }
    });
  }

  function hintMatch() {
    var fb = $("matchFeedback");
    if (!fb) return;
    fb.innerHTML = '<div class="hint">💡 Tip: Think “carrier = operator”, “coverage = reception”.</div>';
    addPoints(1);
  }

  /* ----------------------- Practice 3: Fill-in connectors ----------------------- */
  var FILL = [
    { s: "I want prepaid _____ I don’t have a US credit history yet.", opts: ["because", "but", "then"], a: "because" },
    { s: "Coverage is weak in my apartment, _____ I use Wi‑Fi calling.", opts: ["so", "because", "but"], a: "so" },
    { s: "First I’ll choose a plan, _____ I’ll activate the eSIM.", opts: ["then", "but", "because"], a: "then" },
    { s: "I have signal, _____ mobile data doesn’t work.", opts: ["but", "so", "then"], a: "but" }
  ];

  function renderFill() {
    var host = $("fillIn");
    var fb = $("fillFeedback");
    if (!host || !fb) return;

    var html = "";
    for (var i = 0; i < FILL.length; i++) {
      var it = FILL[i];
      var parts = it.s.split("_____");
      var optHtml = it.opts.map(function (o) { return "<option value='" + esc(o) + "'>" + esc(o) + "</option>"; }).join("");
      html += '<div class="fillRow" data-fill="' + i + '">';
      html += '  <span>' + esc(parts[0]) + "</span>";
      html += '  <select class="select fillSel" data-fill="' + i + '"><option value="">—</option>' + optHtml + "</select>";
      html += '  <span>' + esc(parts[1] || "") + "</span>";
      html += "</div>";
    }
    host.innerHTML = html;
    fb.textContent = "";
  }

  function checkFill() {
    var host = $("fillIn");
    var fb = $("fillFeedback");
    if (!host || !fb) return;

    var sels = qsa(".fillSel", host);
    var correct = 0, total = FILL.length, missing = 0;

    sels.forEach(function (sel) {
      var i = Number(sel.getAttribute("data-fill"));
      var val = sel.value;
      if (!val) missing++;
      var ok = val === FILL[i].a;
      sel.classList.remove("is-ok", "is-nope");
      if (val) sel.classList.add(ok ? "is-ok" : "is-nope");
      if (ok) correct++;
    });

    if (missing) {
      fb.innerHTML = '<div class="nope">✍️ Please choose a word for every blank.</div>';
      addPoints(0, "reset");
      return;
    }

    if (correct === total) {
      fb.innerHTML = '<div class="ok">✅ Great! ' + correct + "/" + total + " correct.</div>";
      addPoints(10, "correct");
    } else {
      fb.innerHTML = '<div class="nope">❌ ' + correct + "/" + total + " correct. Try again.</div>";
      addPoints(0, "reset");
    }
  }

  function hintFill() {
    var fb = $("fillFeedback");
    if (!fb) return;
    fb.innerHTML = '<div class="hint">💡 Quick help: <strong>because</strong> = reason • <strong>so</strong> = result • <strong>but</strong> = contrast • <strong>then</strong> = next step.</div>';
    addPoints(1);
  }

  /* ----------------------- Practice 4: Sentence builder ----------------------- */
  var BUILDER = [
    { target: "Could you help me transfer my number?", hint: "Start with “Could you…”" },
    { target: "I would like a prepaid plan with a lot of data.", hint: "Start with “I would like…”" },
    { target: "My mobile data doesn’t work, but calls do.", hint: "Use “but” for contrast." }
  ];
  var BuilderState = { idx: 0, built: [] };

  function splitWords(s) {
    return String(s || "")
      .replace(/[“”]/g, '"')
      .replace(/[—–]/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean);
  }

  function renderBuilder() {
    var prompt = $("builderPrompt");
    var bank = $("builderBank");
    var ans = $("builderAnswer");
    var fb = $("builderFeedback");
    if (!prompt || !bank || !ans || !fb) return;

    BuilderState.idx = clamp(Number(STATE.settings.builderIdx || 0), 0, BUILDER.length - 1);
    BuilderState.built = [];

    var target = BUILDER[BuilderState.idx].target;
    prompt.textContent = 'Build: “' + target + '”';

    var words = shuffle(splitWords(target));
    bank.innerHTML = words.map(function (w, i) {
      return '<button type="button" class="chip" data-w="' + esc(w) + '">' + esc(w) + "</button>";
    }).join("");

    ans.innerHTML = '<div class="built built--empty">Tap words to build…</div>';
    fb.textContent = "";
  }

  function updateBuilderAnswer() {
    var ans = $("builderAnswer");
    if (!ans) return;
    if (!BuilderState.built.length) {
      ans.innerHTML = '<div class="built built--empty">Tap words to build…</div>';
      return;
    }
    ans.innerHTML = BuilderState.built.map(function (w, i) {
      return '<button type="button" class="chip chip--ans" data-ans="' + i + '">' + esc(w) + "</button>";
    }).join(" ");
  }

  function wireBuilder() {
    var bank = $("builderBank");
    var ans = $("builderAnswer");
    if (!bank || !ans) return;

    bank.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip[data-w]");
      if (!chip) return;
      if (chip.disabled) return;
      var w = chip.getAttribute("data-w");
      BuilderState.built.push(w);
      chip.disabled = true;
      chip.classList.add("is-used");
      updateBuilderAnswer();
    });

    ans.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip[data-ans]");
      if (!chip) return;
      var idx = Number(chip.getAttribute("data-ans"));
      if (isNaN(idx)) return;
      // remove this word + re-enable first matching bank chip
      var w = BuilderState.built[idx];
      BuilderState.built.splice(idx, 1);
      var bankChip = qs('.chip[data-w="' + (window.CSS && CSS.escape ? CSS.escape(w) : String(w).replace(/"/g, "\\\"")) + '"]', bank);
      if (bankChip) { bankChip.disabled = false; bankChip.classList.remove("is-used"); }
      updateBuilderAnswer();
    });
  }

  function checkBuilder() {
    var fb = $("builderFeedback");
    var bank = $("builderBank");
    if (!fb || !bank) return;

    var target = BUILDER[BuilderState.idx].target;
    var built = BuilderState.built.join(" ").replace(/\s+/g, " ").trim();
    var ok = norm(built) === norm(target);

    if (ok) {
      fb.innerHTML = '<div class="ok">✅ Perfect word order!</div>';
      addPoints(10, "correct");

      // next sentence
      BuilderState.idx = (BuilderState.idx + 1) % BUILDER.length;
      STATE.settings.builderIdx = BuilderState.idx;
      saveState();
      renderBuilder();
    } else {
      fb.innerHTML = '<div class="nope">❌ Not quite. Tap a built word to remove it and try again.</div>';
      addPoints(0, "reset");
    }
  }

  function hintBuilder() {
    var fb = $("builderFeedback");
    if (!fb) return;
    fb.innerHTML = '<div class="hint">💡 ' + esc(BUILDER[BuilderState.idx].hint) + "</div>";
    addPoints(1);
  }

  /* ----------------------- Dialogues (generator) ----------------------- */
  function genDialogue() {
    var name = ($("dlgName") && $("dlgName").value) ? $("dlgName").value.trim() : "I";
    var phoneType = ($("dlgPhoneType") && $("dlgPhoneType").value) ? $("dlgPhoneType").value : "unlocked";
    var state = ($("dlgState") && $("dlgState").value) ? $("dlgState").value : "MA";
    var city = ($("dlgCity") && $("dlgCity").value) ? $("dlgCity").value.trim() : "Boston";
    var scenario = ($("dlgScenario") && $("dlgScenario").value) ? $("dlgScenario").value : "activate";
    var needs = ($("dlgNeeds") && $("dlgNeeds").value) ? $("dlgNeeds").value.trim() : "a budget plan with enough data";

    var you = (name && name !== "I") ? name : "You";
    var lines = [];

    function add(speaker, text) { lines.push({ speaker: speaker, text: text }); }

    add(you, "Hi! I just moved to " + city + ", " + state + ". I’d like to set up a phone plan.");
    add("Agent", "Sure. What do you need in your plan?");
    add(you, "I’m looking for " + needs + ".");

    if (phoneType === "unlocked") {
      add("Agent", "Do you have an unlocked phone?");
      add(you, "Yes, my phone is unlocked. Could you help me check compatibility?");
    } else if (phoneType === "new_phone") {
      add("Agent", "Are you buying a new phone today?");
      add(you, "Yes. I’d like an unlocked phone if possible.");
    } else {
      add("Agent", "Do you plan to use a SIM or an eSIM?");
      add(you, "If possible, I’d like to use an eSIM.");
    }

    if (scenario === "port") {
      add("Agent", "Do you want to keep your current number?");
      add(you, "Yes, I want to port my number. What information do you need?");
      add("Agent", "Usually the account number and a transfer PIN (it depends on the carrier).");
    } else if (scenario === "prepaid") {
      add("Agent", "Prepaid is a great option to start quickly.");
      add(you, "Great. Could you recommend a prepaid plan with good coverage here?");
    } else if (scenario === "no_service") {
      add(you, "My phone has signal, but mobile data doesn’t work. Could you help me check the APN settings?");
      add("Agent", "Yes—let’s verify your settings and your line provisioning.");
    } else {
      add("Agent", "We can activate your line now.");
      add(you, "Perfect. Could you help me activate the SIM/eSIM today?");
    }

    add("Agent", "No problem. Anything else?");
    add(you, "Yes—could you help me set up voicemail and Wi‑Fi calling?");
    add("Agent", "Of course.");

    return lines;
  }

  function renderDialogue(lines) {
    var out = $("dlgOut");
    if (!out) return;
    var html = lines.map(function (l) {
      return "<div class='dlgLine'><strong>" + esc(l.speaker) + ":</strong> " + esc(l.text) + "</div>";
    }).join("");
    out.innerHTML = html || "Fill the form and click “Generate dialogue”.";
  }

  function dialogueAsText(lines) {
    return (lines || []).map(function (l) { return l.speaker + ": " + l.text; }).join("\n");
  }

  function wireDialogues() {
    var btnGen = $("btnGenDialogue");
    var btnCopy = $("btnCopyDialogue");
    var btnListen = $("btnListenDialogue");
    var out = $("dlgOut");

    if (!btnGen || !out) return;

    function currentLines() {
      // store latest in memory (not necessarily in localStorage)
      return wireDialogues._lines || [];
    }

    btnGen.addEventListener("click", function () {
      var lines = genDialogue();
      wireDialogues._lines = lines;
      renderDialogue(lines);
      addPoints(5);
    });

    if (btnCopy) btnCopy.addEventListener("click", function () {
      copyText(dialogueAsText(currentLines()));
      addPoints(1);
    });

    if (btnListen) btnListen.addEventListener("click", function () {
      var lines = currentLines().map(function (l) { return l.text; });
      speakQueue(lines);
      addPoints(1);
    });
  }

  /* ----------------------- Troubleshooting (decision helper) ----------------------- */
  var ISSUES = {
    no_signal: {
      title: "📡 No signal / No service",
      steps: [
        "Toggle Airplane mode ON for 10 seconds, then OFF.",
        "Move near a window / go outside to test indoor coverage.",
        "Restart your phone.",
        "Check that your SIM/eSIM line is enabled.",
        "Ask the carrier if there’s an outage in your area."
      ],
      say: [
        "I have no signal / no service on my phone.",
        "Is there an outage in my area?",
        "Can you check that my line is active?"
      ],
      fr: "Aucune barre réseau : mode avion, redémarrage, vérifie SIM/eSIM, puis opérateur (panne/ligne bloquée)."
    },
    no_data: {
      title: "🌐 No mobile data",
      steps: [
        "Turn Mobile Data ON (turn Wi‑Fi OFF to test).",
        "Make sure the correct SIM/eSIM is selected for Mobile Data.",
        "Restart your phone and toggle Airplane mode.",
        "Check APN settings (often Android)."
      ],
      say: [
        "Calls work, but my mobile data doesn’t work.",
        "Can you help me check the APN settings?",
        "Is data enabled on my line?"
      ],
      fr: "Pas d’internet mobile : données ON, ligne data, APN, puis opérateur."
    },
    sms: {
      title: "💬 SMS not working",
      steps: [
        "Restart your phone.",
        "Confirm number format uses +1 for US numbers.",
        "Check you aren’t blocking the contact or short codes.",
        "Ask the carrier to confirm SMS is enabled."
      ],
      say: [
        "I can’t send or receive text messages.",
        "Are short code messages allowed on my plan?"
      ],
      fr: "SMS HS : redémarre, vérifie +1, iMessage/Send as SMS, puis opérateur."
    },
    esim: {
      title: "🧾 eSIM trouble",
      steps: [
        "Use strong Wi‑Fi for activation.",
        "Check the QR code is still valid.",
        "Restart and try again.",
        "Ask the carrier to generate a new eSIM QR code."
      ],
      say: [
        "My eSIM activation is failing.",
        "Can you generate a new eSIM QR code for me?"
      ],
      fr: "Problème eSIM : Wi‑Fi stable, QR code valide, redémarrage; demande un nouveau QR."
    },
    billing: {
      title: "💳 Billing / payment",
      steps: [
        "Check billing ZIP/address and payment method.",
        "Pay manually once, then re‑enable AutoPay.",
        "Ask the carrier if there’s a fraud block."
      ],
      say: [
        "My payment didn’t go through.",
        "Can you help me update my billing ZIP code?"
      ],
      fr: "Paiement : vérifie ZIP/adresse et carte, puis opérateur (blocage)."
    }
  };

  function wireTroubleshooting() {
    var sec = $("troubleshooting");
    var out = $("issueOut");
    if (!sec || !out) return;

    function setActive(key) {
      qsa('button[data-issue]', sec).forEach(function (b) {
        var on = b.getAttribute("data-issue") === key;
        b.classList.toggle("btn--primary", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    function render(key) {
      var d = ISSUES[key];
      if (!d) { out.textContent = "Choose a problem above."; return; }
      setActive(key);

      var steps = (d.steps || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
      var say = (d.say || []).map(function (p) {
        return "<li class='sayLine'><span>" + esc(p) + "</span> <button type='button' class='iconbtn' data-say='" + esc(p) + "' aria-label='Speak'>🔊</button></li>";
      }).join("");

      out.innerHTML =
        "<div class='issueTitle'>" + esc(d.title) + "</div>" +
        "<div class='issueCols'>" +
          "<div class='issueCol'><h4>Common next steps</h4><ol class='bullets'>" + steps + "</ol></div>" +
          "<div class='issueCol'><h4>Useful phrases</h4><ul class='bullets'>" + say + "</ul></div>" +
        "</div>" +
        "<div class='frhelp'><strong>Aide FR:</strong> " + esc(d.fr || "") + "</div>";

      addPoints(1);
    }

    // Event delegation: ensures ALL buttons work
    sec.addEventListener("click", function (e) {
      var b = e.target.closest('button[data-issue]');
      if (!b) return;
      var key = b.getAttribute("data-issue");
      render(key);
    });

    // Default text
    out.textContent = "Choose a problem above.";
  }

  /* ----------------------- Global speaker buttons (data-say) ----------------------- */
  function wireGlobalSpeak() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-say]");
      if (!btn) return;
      var t = btn.getAttribute("data-say") || "";
      speak(t);
    });
  }

  /* ----------------------- Top controls ----------------------- */
  function wireTopControls() {
    // Accent buttons
    var bUS = $("voiceUS");
    var bUK = $("voiceUK");
    if (bUS) bUS.addEventListener("click", function () { setAccent("us"); });
    if (bUK) bUK.addEventListener("click", function () { setAccent("uk"); });

    // French help
    var frOn = $("frOn");
    var frOff = $("frOff");
    if (frOn) frOn.addEventListener("click", function () { setFrHelp(true); });
    if (frOff) frOff.addEventListener("click", function () { setFrHelp(false); });

    // Test voice / print / reset
    var test = $("btnTestVoice");
    if (test) test.addEventListener("click", function () {
      speak(TTS.accent === "uk" ? "Hello! Let's set up your phone in the USA." : "Hello! Let's set up your phone in the USA.");
      addPoints(1);
    });

    var pr = $("btnPrint");
    if (pr) pr.addEventListener("click", function () { window.print(); });

    var resetAll = $("btnResetAll");
    if (resetAll) resetAll.addEventListener("click", function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      STATE = loadState();
      if (!STATE.settings) STATE.settings = {};
      if (!STATE.checklist) STATE.checklist = {};
      if (!STATE.score) STATE.score = { points: 0, streak: 0 };
      if (!STATE.practice) STATE.practice = {};
      document.body.classList.toggle("fr-on", true);
      initAll();
    });
  }

  /* ----------------------- Wire practice buttons ----------------------- */
  function wirePracticeButtons() {
    var pc = $("btnPoliteCheck"), ph = $("btnPoliteHint"), pr = $("btnPoliteReset");
    if (pc) pc.addEventListener("click", checkPoliteQuiz);
    if (ph) ph.addEventListener("click", hintPoliteQuiz);
    if (pr) pr.addEventListener("click", resetPoliteQuiz);

    var mh = $("btnMatchHint"), mr = $("btnMatchReset");
    if (mh) mh.addEventListener("click", hintMatch);
    if (mr) mr.addEventListener("click", function () { renderMatch(); addPoints(1); });

    var fc = $("btnFillCheck"), fh = $("btnFillHint"), fr = $("btnFillReset");
    if (fc) fc.addEventListener("click", checkFill);
    if (fh) fh.addEventListener("click", hintFill);
    if (fr) fr.addEventListener("click", function () { renderFill(); addPoints(1); });

    var bc = $("btnBuilderCheck"), bh = $("btnBuilderHint"), br = $("btnBuilderReset");
    if (bc) bc.addEventListener("click", checkBuilder);
    if (bh) bh.addEventListener("click", hintBuilder);
    if (br) br.addEventListener("click", function () { renderBuilder(); addPoints(1); });
  }

  /* ----------------------- Init all sections ----------------------- */
  function initAll() {
    // Settings defaults
    TTS.accent = loadAccent();
    reflectAccentUI();
    setFrHelp(loadFrHelp());

    renderScore();
    renderChecklist();
    wireChecklistButtons();
    wirePathHelper();
    wireVocab();
    wireChips();

    renderPoliteQuiz();
    renderMatch();
    renderFill();
    renderBuilder();
    wireBuilder();

    wirePracticeButtons();
    wireDialogues();
    wireTroubleshooting();
  }

  /* ----------------------- Boot ----------------------- */
  onReady(function () {
    // Voices load async in Safari
    if (window.speechSynthesis) {
      initVoices();
      window.speechSynthesis.onvoiceschanged = function () { initVoices(); };
    }

    wireTopControls();
    wireScrollButtons();
    wireGlobalSpeak();

    initAll();
  });

})();