/* =========================================================
   CLOE TOPIC TRAINER (FULL FILE)
   Path: /js/cloe-topic-trainer.js

   ✅ Fixes included:
   - Flashcards flip + display fixed
   - MCQ correct option randomized (not always 2nd)
   - Word Order Sprint = real word order (tap bank → build → check)
   - Matching works (tap LEFT then RIGHT) + clear on small screens
   - Prepositions: one blank per question (no 2 blanks / 1 dropdown confusion)
   - Immediate feedback everywhere: ✅/❌ + hint + why
   - Deck completion messages
   - Timed games have lots of unique items (no 3 repeated)
   - Listening: US/UK via SpeechSynthesis + comprehension MCQ
   - Speaking: timed speaking + optional recording (MediaRecorder)
   ========================================================= */

(function () {
  "use strict";

  // -----------------------------
  // DOM helpers
  // -----------------------------
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(str) {
    var s = String(str == null ? "" : str);
    return s
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function normalizeSentence(s) {
    return String(s || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([?.!,;:])/g, "$1")
      .trim();
  }

  function shuffle(arr) {
    var a = (arr || []).slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function uniq(arr) {
    var out = [];
    var seen = {};
    for (var i = 0; i < (arr || []).length; i++) {
      var k = String(arr[i]);
      if (!seen[k]) { seen[k] = true; out.push(arr[i]); }
    }
    return out;
  }

  function formatMMSS(sec) {
    sec = Math.max(0, (sec | 0));
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? "0" + m : "" + m) + ":" + (s < 10 ? "0" + s : "" + s);
  }

  function tokensFromSentence(sentence) {
    var s = String(sentence || "");
    s = s.replace(/([?.!,;:])/g, " $1");
    s = s.replace(/\s+/g, " ").trim();
    return s ? s.split(" ") : [];
  }

  function hintFromTarget(target) {
    var t = normalizeSentence(target);
    var words = t.split(" ");
    var n = Math.min(5, words.length);
    return 'Start with: “' + words.slice(0, n).join(" ") + '…”';
  }

  // -----------------------------
  // Error display
  // -----------------------------
  var errorBox = qs("#tt-error");
  function showError(msg) {
    if (!errorBox) return;
    errorBox.hidden = false;
    errorBox.textContent = "JavaScript error: " + msg;
  }
  window.addEventListener("error", function (e) {
    var msg = (e && (e.message || (e.error && e.error.message))) || String(e);
    showError(msg);
  });

  // -----------------------------
  // Speech (US/UK)
  // -----------------------------
  var ACCENT_KEY = "cloe_tt_accent_v1";
  var accent = (localStorage.getItem(ACCENT_KEY) === "uk") ? "uk" : "us";
  var voices = [];
  var voiceReady = false;

  function loadVoices() {
    if (!window.speechSynthesis) return;
    voices = window.speechSynthesis.getVoices() || [];
    voiceReady = voices.length > 0;
    updateVoiceNote();
  }

  function bestVoice() {
    if (!voiceReady) return null;
    var want = (accent === "uk") ? "en-GB" : "en-US";
    var i;

    for (i = 0; i < voices.length; i++) {
      if ((voices[i].lang || "").toLowerCase().indexOf(want.toLowerCase()) === 0) return voices[i];
    }
    for (i = 0; i < voices.length; i++) {
      if ((voices[i].lang || "").toLowerCase().indexOf("en") === 0) return voices[i];
    }
    return voices[0] || null;
  }

  function speak(text, opts) {
    opts = opts || {};
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return false;

    try { window.speechSynthesis.cancel(); } catch (_) {}

    var u = new SpeechSynthesisUtterance(String(text || ""));
    var v = bestVoice();
    if (v) u.voice = v;
    u.rate = (typeof opts.rate === "number") ? opts.rate : 0.95;
    u.pitch = (typeof opts.pitch === "number") ? opts.pitch : 1.0;

    window.speechSynthesis.speak(u);
    return true;
  }

  function updateVoiceNote(extra) {
    var note = qs("#tt-voice-note");
    if (!note) return;
    var base = "If audio doesn’t play, your device may block speech. You can still read and answer.";
    var v = bestVoice();
    var vtxt = v ? (" Voice: " + v.name + " (" + v.lang + ").") : " Voice: not detected yet.";
    note.textContent = (extra ? (extra + " ") : "") + base + vtxt;
  }

  function wireAccentButtons() {
    var btns = qsa(".tt-accent-btn");
    function sync() {
      for (var i = 0; i < btns.length; i++) {
        var a = (btns[i].getAttribute("data-accent") === "uk") ? "uk" : "us";
        btns[i].classList.toggle("is-active", a === accent);
        btns[i].setAttribute("aria-pressed", a === accent ? "true" : "false");
      }
    }
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          accent = (btn.getAttribute("data-accent") === "uk") ? "uk" : "us";
          localStorage.setItem(ACCENT_KEY, accent);
          sync();
          updateVoiceNote("Accent updated.");
        });
      })(btns[i]);
    }
    sync();

    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      updateVoiceNote("Speech not supported.");
    }
  }

  // -----------------------------
  // Progress storage
  // -----------------------------
  var PROG_KEY = "cloe_tt_progress_v2";
  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (_) { return fallback; }
  }
  function writeJson(key, obj) { localStorage.setItem(key, JSON.stringify(obj)); }

  var PROG = readJson(PROG_KEY, {}); // { topicId: { mastered: { taskId:true } } }

  function isMastered(topicId, taskId) {
    return !!(PROG[topicId] && PROG[topicId].mastered && PROG[topicId].mastered[taskId]);
  }
  function markMastered(topicId, taskId) {
    if (!PROG[topicId]) PROG[topicId] = { mastered: {} };
    if (!PROG[topicId].mastered) PROG[topicId].mastered = {};
    PROG[topicId].mastered[taskId] = true;
    writeJson(PROG_KEY, PROG);
  }
  function resetTopicProgress(topicId) {
    if (PROG[topicId]) {
      PROG[topicId].mastered = {};
      writeJson(PROG_KEY, PROG);
    }
  }
  function masteredCount(topicId) {
    var t = PROG[topicId];
    if (!t || !t.mastered) return 0;
    var c = 0;
    for (var k in t.mastered) if (t.mastered.hasOwnProperty(k)) c++;
    return c;
  }

  // -----------------------------
  // Language pools
  // -----------------------------
  var CONNECTORS = [
    { w: "therefore", fr: "donc / par conséquent" },
    { w: "however", fr: "cependant" },
    { w: "instead", fr: "à la place" },
    { w: "as a result", fr: "en conséquence" },
    { w: "in addition", fr: "de plus" },
    { w: "otherwise", fr: "sinon" },
    { w: "meanwhile", fr: "pendant ce temps" },
    { w: "alternatively", fr: "alternativement" },
    { w: "for example", fr: "par exemple" },
    { w: "in fact", fr: "en fait" }
  ];

  var PREPOSITIONS = ["on", "at", "in", "within", "by", "to", "from", "for", "near", "next to", "across from", "between"];

  function pickWrong(pool, correct, n) {
    var opts = [];
    for (var i = 0; i < pool.length; i++) if (pool[i] !== correct) opts.push(pool[i]);
    opts = shuffle(opts);
    return opts.slice(0, n);
  }

  // -----------------------------
  // Topic data (10 topics)
  // -----------------------------
  var TOPICS = [
    {
      id: "meetings",
      icon: "📅",
      title: "Meetings & Scheduling (Pro)",
      category: "Pro — Meetings/Projects",
      tags: ["reschedule", "confirm", "availability", "Teams"],
      grammar: [
        { title: "Polite requests (modals)", why: "Use modals to sound professional and less direct.",
          patterns: ["Could you…?", "Would you be available…?", "Could we reschedule…?", "Would it be possible to…?"],
          tip: "Add a softener: “when you have a moment”, “if that works for you”, “thank you in advance”." },
        { title: "Time phrases + prepositions", why: "Correct time prepositions make you sound natural and clear.",
          patterns: ["on + day/date", "at + time", "in + month/year", "between + A and B"],
          tip: "Ex: on Friday / at 10:00 / in March / between 10:30 and 12:30." },
        { title: "Conditional for options", why: "Conditionals structure options clearly.",
          patterns: ["If that works, I’ll…", "If not, could you…?", "If neither works, please…"],
          tip: "Conditionals = organized and professional." }
      ],
      vocab: [
        { icon:"🕒", w:"availability", def:"the times you are free", ex:"Could you share your availability this week?" },
        { icon:"🧩", w:"conflict", def:"a scheduling problem", ex:"I have a conflict at 11:00." },
        { icon:"📨", w:"calendar invite", def:"a meeting request sent by email", ex:"I’ll send a calendar invite." },
        { icon:"🔁", w:"reschedule", def:"move to another time/date", ex:"Could we reschedule to Friday?" },
        { icon:"✅", w:"confirm", def:"say yes and verify details", ex:"Please confirm the time." },
        { icon:"⏳", w:"postpone", def:"delay to later", ex:"We may need to postpone it." },
        { icon:"🧭", w:"time slot", def:"a specific time period", ex:"Do you have a 30-minute time slot?" },
        { icon:"🧑‍💻", w:"Teams", def:"Microsoft video meeting tool", ex:"We can meet on Teams." },
        { icon:"📌", w:"agenda", def:"the plan for the meeting", ex:"I’ll share the agenda beforehand." },
        { icon:"📍", w:"time zone", def:"local time region", ex:"What time zone are you in?" },
        { icon:"🗓️", w:"deadline", def:"the latest possible date", ex:"The deadline is next Tuesday." },
        { icon:"📤", w:"follow up", def:"contact again after", ex:"I’ll follow up by email." }
      ],
      listening: {
        title: "Short call: rescheduling",
        text: "Hi, this is Anne-Sophie. I’m calling about tomorrow’s meeting. Unfortunately, I have a conflict at 11 a.m. Would it be possible to move our meeting to Friday at 10? If that doesn’t work, I’m also available Thursday between 10:30 and 12:30. Please let me know what suits you best. Thanks!",
        questions: [
          { q:"Why is she calling?", a:["To cancel the project", "To reschedule a meeting", "To complain about an invoice"], correct:1,
            why:"She says she has a conflict and asks to move the meeting.", hint:"Look for the purpose of the call." },
          { q:"What is her first preferred option?", a:["Friday at 10", "Thursday at 9", "Next month"], correct:0,
            why:"She proposes Friday at 10:00 first.", hint:"Listen for the first time suggestion." }
        ]
      },
      speaking: {
        prompts: [
          "You need to reschedule a meeting because your child is sick. Propose two alternative time slots and ask for confirmation.",
          "You are late to a meeting. Apologize, give a short reason, and suggest the next step."
        ]
      },
      builder: {
        title: "Email builder — reschedule professionally",
        checklist: [
          "Greeting + context (which meeting)",
          "Reason (short and neutral)",
          "Two alternatives (date + time)",
          "Ask to confirm",
          "Polite closing"
        ],
        model:
          "Hello [Name],\n\nI’m writing about our meeting scheduled for [day/time]. Unfortunately, I have a conflict at that time.\n\nWould it be possible to move it to Friday at 10:00? If that doesn’t work, I’m also available on Thursday between 10:30 and 12:30.\n\nPlease let me know what works best for you, and I’ll send an updated calendar invite.\n\nThank you in advance.\nBest regards,\n[Your name]"
      }
    },

    {
      id: "customer_service",
      icon: "🎧",
      title: "Customer Service Emails (Pro + General)",
      category: "Pro — Customer Service",
      tags: ["complaint", "refund", "delay", "apology"],
      grammar: [
        { title: "Apologies + solutions", why: "A good complaint email stays calm and solution-focused.",
          patterns: ["I’m sorry for…", "Could you please…?", "I would appreciate…", "As a result, I’d like to…"],
          tip: "State the problem → impact → requested solution." },
        { title: "Present perfect for recent issues", why: "Use present perfect to connect a past event to the present.",
          patterns: ["I have not received…", "We have tried…", "It has been delayed…"],
          tip: "Present perfect = current relevance." }
      ],
      vocab: [
        { icon:"📦", w:"shipment", def:"delivery of goods", ex:"The shipment hasn’t arrived." },
        { icon:"⏰", w:"delay", def:"late arrival", ex:"There is a delay in delivery." },
        { icon:"🧾", w:"order number", def:"reference ID for purchase", ex:"My order number is 83912." },
        { icon:"💳", w:"refund", def:"money returned", ex:"I’d like a refund, please." },
        { icon:"🔁", w:"replacement", def:"new item instead of old", ex:"Could you send a replacement?" },
        { icon:"📮", w:"tracking", def:"follow package status", ex:"The tracking hasn’t updated." },
        { icon:"🛠️", w:"defective", def:"not working correctly", ex:"The item is defective." },
        { icon:"📸", w:"evidence", def:"proof (photos, etc.)", ex:"I can provide photos as evidence." },
        { icon:"📍", w:"delivery address", def:"where it should arrive", ex:"The delivery address is correct." },
        { icon:"🤝", w:"resolve", def:"fix a problem", ex:"I hope we can resolve this quickly." },
        { icon:"🧠", w:"inconvenience", def:"problem caused", ex:"Sorry for the inconvenience." },
        { icon:"📝", w:"complaint", def:"formal expression of dissatisfaction", ex:"I’m writing to make a complaint." }
      ],
      listening: {
        title: "Short call: delivery issue",
        text: "Hello, I’m calling about my order. It was supposed to arrive on Tuesday, but it still hasn’t arrived. The tracking hasn’t updated for two days. Could you please check the status and let me know when I can expect delivery? Thank you.",
        questions: [
          { q:"What is the problem?", a:["The product is too expensive", "The delivery is late", "The website is down"], correct:1,
            why:"They say it hasn’t arrived and tracking hasn’t updated.", hint:"Focus on delivery words." },
          { q:"What does the caller request?", a:["A discount coupon", "A status update", "A new invoice"], correct:1,
            why:"They ask the company to check the status and confirm delivery time.", hint:"Listen for “could you please…”." }
        ]
      },
      speaking: {
        prompts: [
          "You received the wrong item. Explain the issue politely and request a replacement.",
          "Your delivery is late. Ask for an updated delivery date and apologize for the inconvenience to your client."
        ]
      },
      builder: {
        title: "Email builder — complaint + solution",
        checklist: [
          "Order number / context",
          "Problem + impact",
          "Polite request (refund / replacement / update)",
          "Deadline or timeframe",
          "Polite closing"
        ],
        model:
          "Hello,\n\nI’m writing about order [number]. The package was due on [date], but I still haven’t received it, and the tracking hasn’t updated.\n\nCould you please check the status and confirm the expected delivery date? If the item cannot be delivered soon, I would appreciate a refund.\n\nThank you in advance for your help.\nKind regards,\n[Your name]"
      }
    },

    {
      id: "projects",
      icon: "📊",
      title: "Projects & Updates (Pro)",
      category: "Pro — Meetings/Projects",
      tags: ["status update", "deliverables", "deadline", "priorities"],
      grammar: [
        { title: "Present perfect vs past simple in updates", why: "Use present perfect for progress up to now; past simple for finished actions at a specific time.",
          patterns: ["We have completed…", "We finished… yesterday", "We have identified…"],
          tip: "Present perfect = progress; past simple = completed at a known time." },
        { title: "Clear structure in updates", why: "Structure helps you score well in professional tasks.",
          patterns: ["Current status:", "Next steps:", "Risks / blockers:", "Deadline:"],
          tip: "Headings make your message easy to scan." }
      ],
      vocab: [
        { icon:"✅", w:"deliverable", def:"a thing to be delivered/produced", ex:"The deliverable is due Friday." },
        { icon:"⛔", w:"blocker", def:"something that prevents progress", ex:"We have a blocker with approvals." },
        { icon:"🧭", w:"priority", def:"most important item", ex:"This is our top priority." },
        { icon:"🗓️", w:"timeline", def:"schedule for steps", ex:"The timeline is tight." },
        { icon:"🧩", w:"scope", def:"what is included in the project", ex:"The scope has changed." },
        { icon:"📌", w:"milestone", def:"important stage/date", ex:"Next milestone is January 20th." },
        { icon:"🧪", w:"test phase", def:"period for testing", ex:"We’re entering the test phase." },
        { icon:"🧾", w:"approval", def:"official agreement/validation", ex:"We’re waiting for approval." },
        { icon:"🔎", w:"review", def:"check and evaluate", ex:"We’ll review the draft tomorrow." },
        { icon:"🧱", w:"resource", def:"people/time/tools available", ex:"We need more resources." },
        { icon:"🧠", w:"stakeholder", def:"person affected or involved", ex:"We’ll inform stakeholders." },
        { icon:"📤", w:"update", def:"new information", ex:"Here is a quick update." }
      ],
      listening: {
        title: "Short update: next steps",
        text: "Quick update: we have completed the first draft, and we have identified two risks. First, the supplier’s timeline is tight. Second, we are waiting for final approval. Next steps: we will review the draft tomorrow and send the revised version by Friday.",
        questions: [
          { q:"What has been completed?", a:["Final approval", "First draft", "Supplier contract"], correct:1,
            why:"They say the first draft has been completed.", hint:"Listen for completed work." },
          { q:"When will they send the revised version?", a:["Tomorrow", "By Friday", "Next month"], correct:1,
            why:"They say they will send it by Friday.", hint:"Listen for the deadline." }
        ]
      },
      speaking: {
        prompts: [
          "Give a 45-second project update: status, one risk, and next steps.",
          "Explain a delay to your manager and propose a new deadline."
        ]
      },
      builder: {
        title: "Update builder — structured message",
        checklist: ["Status", "What’s done (present perfect)", "Risk/blocker", "Next steps", "Deadline"],
        model:
          "Hello [Name],\n\nQuick update on [Project]:\n\n• Status: We have completed [X].\n• Risks/Blockers: We are waiting for [approval] / [resource].\n• Next steps: We will [action] tomorrow and send [deliverable] by [date].\n\nBest regards,\n[Your name]"
      }
    },

    {
      id: "invoices",
      icon: "🧾",
      title: "Invoices & Payments (Pro)",
      category: "Pro — Admin/Finance",
      tags: ["invoice", "payment", "reminder", "attached"],
      grammar: [
        { title: "Polite payment reminders", why: "You can be firm without being aggressive.",
          patterns: ["Could you please confirm…?", "I’m writing to follow up…", "It may have been an oversight."],
          tip: "Avoid blame; focus on confirming the next step." },
        { title: "Attachments + referencing documents", why: "Clear reference avoids confusion.",
          patterns: ["Please find the invoice attached.", "Invoice number:", "Due date:"],
          tip: "Always include invoice number + due date." }
      ],
      vocab: [
        { icon:"🧾", w:"invoice", def:"bill for goods/services", ex:"Please find invoice 2026-014 attached." },
        { icon:"💶", w:"amount due", def:"money to be paid", ex:"The amount due is €320." },
        { icon:"📆", w:"due date", def:"latest payment date", ex:"The due date is January 31st." },
        { icon:"🏦", w:"bank transfer", def:"payment through bank", ex:"Payment by bank transfer is fine." },
        { icon:"🔁", w:"reminder", def:"message to prompt action", ex:"This is a friendly reminder." },
        { icon:"✅", w:"settle", def:"pay/resolve", ex:"Could you settle the invoice this week?" },
        { icon:"📝", w:"reference", def:"ID number", ex:"Please include the reference." },
        { icon:"📎", w:"attached", def:"included with email", ex:"The invoice is attached." },
        { icon:"🧠", w:"oversight", def:"small mistake/forgetting", ex:"It may have been an oversight." },
        { icon:"🤝", w:"confirm", def:"verify", ex:"Could you confirm the payment date?" },
        { icon:"📤", w:"follow up", def:"contact again", ex:"I’m following up on payment." },
        { icon:"📌", w:"accounting", def:"financial tracking", ex:"Our accounting department needs confirmation." }
      ],
      listening: {
        title: "Short call: payment follow-up",
        text: "Hello, I’m calling to follow up on invoice 2026-014. The due date was January 31st, and we haven’t received payment yet. Could you please confirm the expected payment date? Thank you.",
        questions: [
          { q:"What does the caller want?", a:["A meeting invite", "A payment date confirmation", "A new contract"], correct:1,
            why:"They ask to confirm the expected payment date.", hint:"Follow up on invoice." },
          { q:"What is mentioned?", a:["A due date", "A hotel reservation", "A refund"], correct:0,
            why:"They mention the due date of the invoice.", hint:"Listen for “due date”." }
        ]
      },
      speaking: {
        prompts: [
          "Call a client: politely follow up on an unpaid invoice and ask for a payment date.",
          "Explain your payment policy (due dates, bank transfer, reference number)."
        ]
      },
      builder: {
        title: "Email builder — payment reminder",
        checklist: ["Invoice number", "Due date", "Polite follow-up", "Ask for payment date", "Thanks"],
        model:
          "Hello [Name],\n\nI’m writing to follow up on invoice [number], due on [date]. It may have been an oversight, but we haven’t received payment yet.\n\nCould you please confirm the expected payment date? Please find the invoice attached for your reference.\n\nThank you in advance.\nKind regards,\n[Your name]"
      }
    },

    {
      id: "it_support",
      icon: "🧑‍💻",
      title: "IT Support & Tools (Pro)",
      category: "Pro — IT/Tools",
      tags: ["Teams", "microphone", "settings", "troubleshoot"],
      grammar: [
        { title: "Explaining steps taken (past simple / present perfect)", why: "IT messages should show what you already tried.",
          patterns: ["I restarted…", "I have checked…", "I ran a test call…", "It still doesn’t…"],
          tip: "Use short steps in order." },
        { title: "Requesting help politely", why: "Polite phrasing gets faster cooperation.",
          patterns: ["Could you advise…?", "Could you help me…?", "Would it be possible to…?"],
          tip: "Add context: device + tool + error message." }
      ],
      vocab: [
        { icon:"🎤", w:"microphone", def:"device for voice input", ex:"Teams doesn’t detect my microphone." },
        { icon:"🔊", w:"speaker", def:"device for sound output", ex:"My speakers work, but the mic doesn’t." },
        { icon:"⚙️", w:"settings", def:"configuration options", ex:"I checked the audio settings." },
        { icon:"🔄", w:"restart", def:"turn off/on again", ex:"I restarted my laptop." },
        { icon:"🧪", w:"test call", def:"call to test audio/video", ex:"I ran a test call in Teams." },
        { icon:"🚫", w:"permission", def:"access allowed/blocked", ex:"The browser may block microphone permission." },
        { icon:"🌐", w:"browser", def:"web app (Safari/Chrome)", ex:"In Safari, permissions may be blocked." },
        { icon:"🧩", w:"plug in", def:"connect a cable", ex:"I plugged in my headset." },
        { icon:"🎧", w:"headset", def:"headphones with mic", ex:"I tried a different headset." },
        { icon:"🧰", w:"troubleshoot", def:"find and fix a problem", ex:"Could you help troubleshoot this?" },
        { icon:"📎", w:"screenshot", def:"image of screen", ex:"I can send a screenshot of the error." },
        { icon:"📶", w:"connection", def:"internet link quality", ex:"My connection is stable." }
      ],
      listening: {
        title: "Short call: Teams audio",
        text: "Hi, I’m having trouble on Teams. My camera works, but Teams doesn’t detect my microphone. I restarted my laptop and checked permissions, but it still doesn’t work. Could you advise the next step?",
        questions: [
          { q:"What works?", a:["Microphone", "Camera", "Wi-Fi"], correct:1,
            why:"They say the camera works.", hint:"Find what is working." },
          { q:"What did they do already?", a:["Changed job", "Restarted laptop", "Booked a hotel"], correct:1,
            why:"They restarted the laptop and checked permissions.", hint:"Listen for troubleshooting steps." }
        ]
      },
      speaking: {
        prompts: [
          "Explain an IT problem in 30–45 seconds: what, where, what you tried, what you need.",
          "Ask for help: request a short call to solve a microphone issue."
        ]
      },
      builder: {
        title: "Message builder — IT support ticket",
        checklist: ["Tool + device", "Problem", "Steps tried", "Request next step", "Thanks"],
        model:
          "Hello,\n\nI’m having an issue on Teams: my camera works, but Teams doesn’t detect my microphone. I restarted my laptop and checked microphone permissions, but the problem remains.\n\nCould you advise the next step or schedule a quick call to troubleshoot?\n\nThank you,\n[Your name]"
      }
    },

    {
      id: "reservations",
      icon: "🍽️",
      title: "Reservations (Restaurant/Hotel) (General + Pro)",
      category: "General — Services",
      tags: ["reservation", "availability", "confirm", "special requests"],
      grammar: [
        { title: "Booking politely", why: "Reservations need clear info: date, time, number of people, name.",
          patterns: ["I’d like to book a table/room…", "Do you have availability…?", "Could I have a confirmation…?"],
          tip: "Always repeat key details at the end." },
        { title: "Requests (could/would) + preferences", why: "Sound polite and natural.",
          patterns: ["Could we have…?", "Would it be possible to…?", "We’d prefer…"],
          tip: "Preferences ≠ demands." }
      ],
      vocab: [
        { icon:"📅", w:"reservation", def:"booking", ex:"I’d like to make a reservation." },
        { icon:"👥", w:"party of four", def:"group of four people", ex:"A table for a party of four, please." },
        { icon:"🕯️", w:"quiet table", def:"table in calm area", ex:"We’d prefer a quiet table." },
        { icon:"🍃", w:"allergy", def:"bad reaction to food", ex:"One guest has a peanut allergy." },
        { icon:"⏰", w:"available", def:"free/not booked", ex:"Do you have anything available at 7?" },
        { icon:"✅", w:"confirm", def:"verify details", ex:"Could you confirm the booking?" },
        { icon:"📞", w:"under the name", def:"registered with a name", ex:"It’s under the name Douty." },
        { icon:"🛎️", w:"check-in", def:"arrival registration", ex:"Check-in is at 3 p.m." },
        { icon:"🧾", w:"deposit", def:"advance payment", ex:"Is a deposit required?" },
        { icon:"🛏️", w:"double room", def:"room with one double bed", ex:"We’d like a double room." },
        { icon:"🧳", w:"late arrival", def:"arrive late", ex:"We’ll have a late arrival." },
        { icon:"🍳", w:"breakfast included", def:"breakfast is part of price", ex:"Is breakfast included?" }
      ],
      listening: {
        title: "Short call: booking a table",
        text: "Hello, I’d like to book a table for four this Friday at 7 p.m., under the name Douty. We’d prefer a quiet table, and one guest has a peanut allergy. Could you confirm the reservation by email? Thanks.",
        questions: [
          { q:"How many people?", a:["Two", "Four", "Six"], correct:1,
            why:"They say a table for four.", hint:"Listen for party size." },
          { q:"What special request is mentioned?", a:["Window seat", "Peanut allergy", "Live music"], correct:1,
            why:"They mention a peanut allergy.", hint:"Listen for health/allergy words." }
        ]
      },
      speaking: {
        prompts: [
          "Call to book a table: include date, time, people, name, and one preference.",
          "Book a hotel room: ask about breakfast and late arrival."
        ]
      },
      builder: {
        title: "Reservation builder — complete details",
        checklist: ["Date/time", "Number of people/nights", "Name", "Preference/request", "Confirmation"],
        model:
          "Hello,\n\nI’d like to make a reservation for [people/nights] on [date] at [time]. It’s under the name [Name].\n\nWould it be possible to have [preference]? Could you please confirm by email?\n\nThank you,\n[Your name]"
      }
    },

    {
      id: "appointments",
      icon: "🏥",
      title: "Appointments (Medical/Admin) (General)",
      category: "General — Admin/Health",
      tags: ["book", "available", "symptoms", "confirm"],
      grammar: [
        { title: "Asking for an appointment", why: "Use polite forms and be specific about timing.",
          patterns: ["I’d like to book an appointment…", "Do you have anything available…?", "Could you confirm…?"],
          tip: "Say: today/tomorrow/this afternoon + time window." },
        { title: "Explaining symptoms (simple, clear)", why: "Clarity matters more than complexity.",
          patterns: ["I’ve had… for three days.", "I have a fever.", "It started on…"],
          tip: "Short sentences + time expressions." }
      ],
      vocab: [
        { icon:"📅", w:"appointment", def:"scheduled meeting with a doctor/office", ex:"I need an appointment." },
        { icon:"⏰", w:"available", def:"free", ex:"Do you have anything available today?" },
        { icon:"🤒", w:"fever", def:"high temperature", ex:"I have a fever." },
        { icon:"😷", w:"symptoms", def:"signs of illness", ex:"My symptoms started Monday." },
        { icon:"📝", w:"fill out a form", def:"complete paperwork", ex:"Please fill out this form." },
        { icon:"💳", w:"health card", def:"medical insurance card", ex:"Do you need my health card?" },
        { icon:"📍", w:"reception", def:"front desk", ex:"Please check in at reception." },
        { icon:"⏳", w:"wait time", def:"how long you wait", ex:"The wait time is 20 minutes." },
        { icon:"🧑‍⚕️", w:"general practitioner", def:"family doctor", ex:"I’d like to see a GP." },
        { icon:"📞", w:"reschedule", def:"change appointment time", ex:"Could I reschedule?" },
        { icon:"🧪", w:"test results", def:"results from tests", ex:"When will I get the test results?" },
        { icon:"✅", w:"confirm", def:"verify", ex:"Could you confirm the time?" }
      ],
      listening: {
        title: "Short call: booking an appointment",
        text: "Hello, I’d like to book an appointment. I’ve had a fever for three days. Do you have anything available this afternoon? If not, tomorrow morning would work. Could you confirm the time by text message? Thanks.",
        questions: [
          { q:"How long has the fever lasted?", a:["Three days", "One week", "One day"], correct:0,
            why:"They say for three days.", hint:"Listen for duration." },
          { q:"How does the caller want confirmation?", a:["By text message", "By fax", "By letter"], correct:0,
            why:"They ask to confirm by text message.", hint:"Listen for confirmation method." }
        ]
      },
      speaking: {
        prompts: [
          "Book an appointment: explain one symptom and ask for availability.",
          "Reschedule an appointment: apologize and propose two alternatives."
        ]
      },
      builder: {
        title: "Message builder — appointment request",
        checklist: ["Request appointment", "Symptom + duration", "Preferred time window", "Confirmation request"],
        model:
          "Hello,\n\nI’d like to book an appointment. I’ve had [symptom] for [duration].\n\nDo you have anything available [time window]? If not, [alternative] would work.\n\nCould you please confirm the time?\n\nThank you,\n[Your name]"
      }
    },

    {
      id: "travel_directions",
      icon: "🧭",
      title: "Travel & Directions (General)",
      category: "General — Travel",
      tags: ["directions", "transport", "tickets", "near"],
      grammar: [
        { title: "Asking for directions politely", why: "Polite short questions are best.",
          patterns: ["Excuse me, how do I get to…?", "Is it far?", "Should I take the bus or walk?"],
          tip: "Use landmarks and prepositions." },
        { title: "Prepositions of place", why: "They make directions precise.",
          patterns: ["next to", "across from", "near", "between", "on the corner"],
          tip: "Across from = opposite side." }
      ],
      vocab: [
        { icon:"🚉", w:"train station", def:"place to catch a train", ex:"How do I get to the train station?" },
        { icon:"🚌", w:"bus stop", def:"place to catch a bus", ex:"Is there a bus stop nearby?" },
        { icon:"🎟️", w:"ticket machine", def:"machine to buy tickets", ex:"Where is the ticket machine?" },
        { icon:"🗺️", w:"map", def:"directions diagram", ex:"Could you show me on a map?" },
        { icon:"⬅️", w:"turn left", def:"go left", ex:"Turn left at the traffic light." },
        { icon:"➡️", w:"turn right", def:"go right", ex:"Turn right after the bridge." },
        { icon:"🚦", w:"traffic light", def:"street signal", ex:"At the traffic light, turn left." },
        { icon:"🏪", w:"landmark", def:"easy-to-see place", ex:"It’s next to the supermarket." },
        { icon:"📍", w:"across from", def:"opposite", ex:"It’s across from the pharmacy." },
        { icon:"📌", w:"on the corner", def:"at the corner", ex:"It’s on the corner." },
        { icon:"🚶", w:"on foot", def:"walking", ex:"You can go on foot." },
        { icon:"⏱️", w:"ten-minute walk", def:"walk duration", ex:"It’s a ten-minute walk." }
      ],
      listening: {
        title: "Short directions",
        text: "To get to the train station, walk straight for two minutes. Turn left at the traffic light. The station is on the corner, across from the pharmacy. You can also take bus number 4 from the bus stop next to the supermarket.",
        questions: [
          { q:"Where is the station?", a:["Next to the hospital", "Across from the pharmacy", "Behind the supermarket"], correct:1,
            why:"They say it is across from the pharmacy.", hint:"Listen for location." },
          { q:"Which bus can you take?", a:["Bus 2", "Bus 4", "Bus 9"], correct:1,
            why:"They mention bus number 4.", hint:"Listen for the number." }
        ]
      },
      speaking: {
        prompts: [
          "Explain directions from a hotel to a train station using 3 landmarks.",
          "Ask for directions politely and confirm you understood."
        ]
      },
      builder: {
        title: "Dialogue builder — directions",
        checklist: ["Excuse me", "Destination", "Ask distance/time", "Repeat instructions"],
        model:
          "Excuse me, how do I get to the [place] from here?\nIs it far, or can I walk?\n\n— Walk straight…, turn left…, it’s across from…\n\nGreat, thank you. So I walk straight and then turn left at the traffic light, right?"
      }
    },

    {
      id: "shopping_returns",
      icon: "🛍️",
      title: "Shopping & Returns (General)",
      category: "General — Services",
      tags: ["refund", "exchange", "receipt", "size"],
      grammar: [
        { title: "Requesting a refund/exchange", why: "Use polite requests + reason.",
          patterns: ["I’d like to return this…", "It’s the wrong size.", "Could I get a refund?", "Could I exchange it?"],
          tip: "Mention receipt + condition." },
        { title: "How much / how many", why: "Shopping needs quantity language.",
          patterns: ["How much is it?", "How many do you need?", "Do you have it in size…?"],
          tip: "Much = uncountable; many = countable." }
      ],
      vocab: [
        { icon:"🧾", w:"receipt", def:"proof of purchase", ex:"Do you have the receipt?" },
        { icon:"🔁", w:"exchange", def:"swap for another item", ex:"I’d like to exchange it." },
        { icon:"💳", w:"refund", def:"money back", ex:"Can I get a refund?" },
        { icon:"📏", w:"size", def:"measure/fit", ex:"Do you have it in a larger size?" },
        { icon:"🧵", w:"fit", def:"how clothing feels", ex:"It doesn’t fit." },
        { icon:"🏷️", w:"tag", def:"label", ex:"The tag is still on." },
        { icon:"🧴", w:"damaged", def:"broken/marked", ex:"It arrived damaged." },
        { icon:"📦", w:"packaging", def:"box/wrapper", ex:"I still have the packaging." },
        { icon:"🧑‍💼", w:"customer desk", def:"service counter", ex:"Please go to the customer desk." },
        { icon:"🕒", w:"return policy", def:"rules for returns", ex:"What’s your return policy?" },
        { icon:"🧷", w:"too small", def:"not big enough", ex:"These shoes are too small." },
        { icon:"🧼", w:"unused", def:"not used", ex:"It’s unused and in perfect condition." }
      ],
      listening: {
        title: "Short return request",
        text: "Hi, I’d like to return this jacket. It’s the wrong size, and it doesn’t fit. I have the receipt and the tag is still on. Could I get a refund, please?",
        questions: [
          { q:"Why is the jacket being returned?", a:["Wrong color", "Wrong size", "Too expensive"], correct:1,
            why:"They say it’s the wrong size and doesn’t fit.", hint:"Listen for reason." },
          { q:"What does the customer have?", a:["A receipt", "A passport", "A coupon"], correct:0,
            why:"They say they have the receipt.", hint:"Listen for proof of purchase." }
        ]
      },
      speaking: {
        prompts: [
          "Return an item politely: reason + request refund or exchange.",
          "Ask if a store has an item in another size and confirm the price."
        ]
      },
      builder: {
        title: "Dialogue builder — return at the store",
        checklist: ["Reason", "Receipt", "Request refund/exchange", "Thanks"],
        model:
          "Hi, I’d like to return this [item]. It’s the wrong size and it doesn’t fit.\nI have the receipt and the tag is still on.\nCould I get a refund, please? Thank you."
      }
    },

    {
      id: "workplace_emails",
      icon: "✉️",
      title: "Work Emails (Pro) — clarity & tone",
      category: "Pro — Writing",
      tags: ["clarity", "tone", "request", "follow up"],
      grammar: [
        { title: "Polite structure", why: "CLOE writing tasks reward organization.",
          patterns: ["Context → request → next step → thanks", "Short paragraphs", "One clear ask"],
          tip: "One email = one purpose." },
        { title: "Connectors for flow", why: "Connectors make your email smoother.",
          patterns: ["however", "therefore", "in addition", "as a result"],
          tip: "Use 1–2 connectors only (don’t overdo it)." }
      ],
      vocab: [
        { icon:"📌", w:"request", def:"asking for something", ex:"I have a quick request." },
        { icon:"🧠", w:"clarify", def:"make clearer", ex:"Could you clarify one point?" },
        { icon:"✅", w:"confirm", def:"verify", ex:"Please confirm receipt." },
        { icon:"📤", w:"follow up", def:"contact again", ex:"I’m following up on my last email." },
        { icon:"🗂️", w:"attached", def:"included in email", ex:"Please find the document attached." },
        { icon:"⏳", w:"deadline", def:"latest date/time", ex:"The deadline is Friday." },
        { icon:"🧩", w:"update", def:"new info", ex:"Here is a quick update." },
        { icon:"🤝", w:"appreciate", def:"be thankful", ex:"I would appreciate your help." },
        { icon:"📝", w:"draft", def:"preliminary version", ex:"I’m sending a draft for review." },
        { icon:"🔎", w:"review", def:"check", ex:"Could you review this?" },
        { icon:"📅", w:"schedule", def:"plan time", ex:"Let’s schedule a call." },
        { icon:"📍", w:"next steps", def:"what happens next", ex:"Next steps are listed below." }
      ],
      listening: {
        title: "Short voice note: email follow-up",
        text: "Hi, just a quick follow-up on my last email. Could you confirm whether you received the document? If you need any changes, please let me know, and I’ll update the draft. Thanks!",
        questions: [
          { q:"What is the speaker asking for?", a:["A hotel booking", "Confirmation of receipt", "A refund"], correct:1,
            why:"They ask if the document was received.", hint:"Listen for “confirm whether you received…”." },
          { q:"What will they do if changes are needed?", a:["Cancel the project", "Update the draft", "Book a meeting room"], correct:1,
            why:"They say they will update the draft.", hint:"Listen for the action." }
        ]
      },
      speaking: {
        prompts: [
          "Leave a short voice message: follow up on an email and ask for confirmation.",
          "Ask for a document review and propose a deadline."
        ]
      },
      builder: {
        title: "Email builder — clear request",
        checklist: ["Context", "One request", "Deadline (optional)", "Thanks", "Signature"],
        model:
          "Hello [Name],\n\nI’m writing regarding [context]. Could you please [one request]?\n\nIf possible, could you get back to me by [date/time]?\n\nThank you in advance.\nBest regards,\n[Your name]"
      }
    },

    {
      id: "social_networking",
      icon: "🤝",
      title: "Social & Networking (General + Pro)",
      category: "General — Social",
      tags: ["invite", "suggest", "accept/decline", "small talk"],
      grammar: [
        { title: "Inviting + suggesting", why: "Be friendly and flexible.",
          patterns: ["Would you like to…?", "Do you want to…?", "How about…?", "Could we… instead?"],
          tip: "Offer an alternative when declining." },
        { title: "Soft refusals", why: "Refusals should keep rapport.",
          patterns: ["I’d love to, but…", "I’m not free…", "Maybe another time?"],
          tip: "Add: “Thanks for asking.”" }
      ],
      vocab: [
        { icon:"📩", w:"invite", def:"ask someone to join", ex:"Thanks for the invite!" },
        { icon:"📅", w:"available", def:"free", ex:"I’m available Saturday." },
        { icon:"🙌", w:"I’d love to", def:"strong yes", ex:"I’d love to!" },
        { icon:"😅", w:"I’m afraid I can’t", def:"polite no", ex:"I’m afraid I can’t tonight." },
        { icon:"🔁", w:"instead", def:"as an alternative", ex:"Could we do Friday instead?" },
        { icon:"🍽️", w:"grab dinner", def:"eat together casually", ex:"Let’s grab dinner." },
        { icon:"☕", w:"grab a coffee", def:"meet for coffee", ex:"Want to grab a coffee?" },
        { icon:"🕒", w:"works for me", def:"is okay for me", ex:"Saturday works for me." },
        { icon:"🧊", w:"small talk", def:"light conversation", ex:"Let’s make small talk." },
        { icon:"📍", w:"meet up", def:"meet", ex:"Let’s meet up downtown." },
        { icon:"✅", w:"confirm", def:"verify", ex:"Can you confirm the time?" },
        { icon:"🙏", w:"thanks for asking", def:"polite appreciation", ex:"Thanks for asking!" }
      ],
      listening: {
        title: "Short invite",
        text: "Hi! Would you like to meet up on Friday after work? If Friday doesn’t work, we could do Saturday afternoon instead. Let me know what works for you.",
        questions: [
          { q:"What is the invitation?", a:["A job interview", "Meeting up after work", "A refund request"], correct:1,
            why:"They invite someone to meet up after work on Friday.", hint:"Listen for “meet up”." },
          { q:"What alternative is offered?", a:["Saturday afternoon", "Sunday morning", "Next month"], correct:0,
            why:"They offer Saturday afternoon as an alternative.", hint:"Listen for alternative time." }
        ]
      },
      speaking: {
        prompts: [
          "Invite someone for coffee. If they’re busy, propose a second option.",
          "Decline politely and suggest a different day."
        ]
      },
      builder: {
        title: "Message builder — invite + flexibility",
        checklist: ["Invite", "Time option 1", "Option 2", "Ask confirmation"],
        model:
          "Hi [Name],\n\nWould you like to [activity] on [day/time]?\nIf that doesn’t work, we could do [alternative].\n\nLet me know what works for you.\nThanks!"
      }
    }
  ];

  // -----------------------------
  // Task builders (MCQ/Cloze/Order/Match/Listen)
  // -----------------------------
  function makeMCQ(skill, q, correctText, wrongTexts, why, hint) {
    var choices = uniq([correctText].concat(wrongTexts || []));
    while (choices.length < 3) choices.push("—");
    choices = choices.slice(0, 4);
    choices = shuffle(choices);

    var correctIndex = 0;
    for (var i = 0; i < choices.length; i++) if (choices[i] === correctText) correctIndex = i;

    return {
      type: "mcq",
      skill: skill,
      q: q,
      a: choices,
      correct: correctIndex,
      why: why || "—",
      hint: hint || "Look for the most natural/professional option."
    };
  }

  function makeCloze(skill, text, correctWord, options, why, hint) {
    var opts = uniq((options || []).slice(0));
    if (opts.indexOf(correctWord) < 0) opts.unshift(correctWord);
    while (opts.length < 3) opts.push("—");
    opts = opts.slice(0, 4);
    opts = shuffle(opts);

    var correctIndex = 0;
    for (var i = 0; i < opts.length; i++) if (opts[i] === correctWord) correctIndex = i;

    return {
      type: "cloze",
      skill: skill,
      text: text,
      options: opts,
      correct: correctIndex,
      why: why || "—",
      hint: hint || "Check meaning + grammar."
    };
  }

  function makeOrder(skill, prompt, sentence, why) {
    sentence = normalizeSentence(sentence);
    return {
      type: "order",
      skill: skill,
      prompt: prompt,
      target: sentence,
      tokens: tokensFromSentence(sentence),
      why: why || "Correct word order matters for clarity.",
      hint: hintFromTarget(sentence)
    };
  }

  function makeMatch(skill, prompt, pairs, why) {
    return {
      type: "match",
      skill: skill,
      prompt: prompt,
      pairs: pairs,
      why: why || "Match meaning or function."
    };
  }

  function makeListen(skill, title, text, questions) {
    return {
      type: "listen",
      skill: skill,
      title: title,
      text: text,
      questions: questions || []
    };
  }

  // -----------------------------
  // Build task pools per topic
  // -----------------------------
  var TASKS = {}; // {topicId: [tasks]}
  function addTask(list, topicId, task, n) {
    task.id = topicId + "_t" + n;
    task.topicId = topicId;
    list.push(task);
  }

  function buildTasksForTopic(topic) {
    var list = [];
    var n = 1;

    // 1) Matching (multiple chunks)
    var pairs = [];
    for (var i = 0; i < topic.vocab.length; i++) {
      pairs.push({ left: topic.vocab[i].w, right: topic.vocab[i].def });
    }
    var chunkSize = 5;
    for (var start = 0; start < Math.min(pairs.length, 15); start += chunkSize) {
      var chunk = pairs.slice(start, start + chunkSize);
      if (chunk.length >= 4) addTask(list, topic.id, makeMatch("Vocab", "Match the word with its definition. (Tap LEFT then RIGHT)", chunk, "Match key vocabulary with meaning."), n++);
    }

    // 2) Word order (12+ unique per topic)
    var orderSeeds = [];
    if (topic.id === "meetings") {
      orderSeeds = [
        "Could we reschedule our meeting to Friday at 10:00?",
        "Would you be available on Thursday between 10:30 and 12:30?",
        "If that works for you, I’ll send an updated calendar invite.",
        "Could you please confirm the new time?",
        "If neither works, please share your availability.",
        "I’m sorry for the inconvenience.",
        "Would it be possible to move the call to tomorrow morning?",
        "I have a conflict at 11 a.m.",
        "Thank you in advance for your help.",
        "Let’s keep it to 30 minutes.",
        "Could we start five minutes later?",
        "I’ll follow up by email."
      ];
    } else if (topic.id === "invoices") {
      orderSeeds = [
        "I’m writing to follow up on invoice 2026-014.",
        "Please find the invoice attached for your reference.",
        "It may have been an oversight.",
        "Could you please confirm the expected payment date?",
        "The due date was January 31st.",
        "We haven’t received payment yet.",
        "Thank you in advance for your help.",
        "Please include the reference number with the transfer.",
        "Could you settle the invoice this week?",
        "If you have already paid, please ignore this message.",
        "Could you send proof of payment, please?",
        "Kind regards,"
      ];
    } else if (topic.id === "it_support") {
      orderSeeds = [
        "Teams doesn’t detect my microphone.",
        "I restarted my laptop and checked permissions.",
        "It still doesn’t work.",
        "Could you advise the next step, please?",
        "I ran a test call in Teams.",
        "My camera works, but the microphone doesn’t.",
        "I tried a different headset.",
        "Could we schedule a quick call to troubleshoot?",
        "I can send a screenshot of the error.",
        "The browser may be blocking permissions.",
        "Thank you for your help.",
        "Best regards,"
      ];
    } else if (topic.id === "projects") {
      orderSeeds = [
        "Quick update on the project.",
        "We have completed the first draft.",
        "We finished the review yesterday.",
        "We have identified two risks.",
        "We are waiting for final approval.",
        "Next steps: we will revise the draft tomorrow.",
        "We will send the updated version by Friday.",
        "The timeline is tight.",
        "This is our top priority.",
        "We need additional resources.",
        "Please let me know if you have questions.",
        "Thank you."
      ];
    } else if (topic.id === "reservations") {
      orderSeeds = [
        "I’d like to book a table for four, please.",
        "Do you have availability this Friday at 7 p.m.?",
        "It’s under the name Douty.",
        "We’d prefer a quiet table.",
        "One guest has a peanut allergy.",
        "Could you confirm the reservation by email?",
        "Is a deposit required?",
        "We will have a late arrival.",
        "Is breakfast included?",
        "We’d like a double room.",
        "Thank you very much.",
        "Goodbye."
      ];
    } else if (topic.id === "appointments") {
      orderSeeds = [
        "I’d like to book an appointment, please.",
        "I’ve had a fever for three days.",
        "Do you have anything available this afternoon?",
        "If not, tomorrow morning would work.",
        "Could you confirm the time by text message?",
        "I need to reschedule my appointment.",
        "I’m sorry for the short notice.",
        "Is there a wait time?",
        "Do you need my health card?",
        "Please check in at reception.",
        "Thank you for your help.",
        "Kind regards."
      ];
    } else if (topic.id === "travel_directions") {
      orderSeeds = [
        "Excuse me, how do I get to the train station from here?",
        "Is it far, or can I walk?",
        "Turn left at the traffic light.",
        "It’s on the corner, across from the pharmacy.",
        "Where is the ticket machine?",
        "Is there a bus stop nearby?",
        "Take bus number 4.",
        "It’s next to the supermarket.",
        "Walk straight for two minutes.",
        "Thank you so much.",
        "Could you repeat that, please?",
        "Great, I understand."
      ];
    } else if (topic.id === "shopping_returns") {
      orderSeeds = [
        "I’d like to return this item, please.",
        "It’s the wrong size and it doesn’t fit.",
        "I have the receipt and the tag is still on.",
        "Could I get a refund, please?",
        "Could I exchange it for a larger size?",
        "What is your return policy?",
        "Do you have this in stock?",
        "I’d prefer a different color.",
        "Is it unused and in good condition?",
        "Please go to the customer desk.",
        "Thank you very much.",
        "Have a nice day."
      ];
    } else if (topic.id === "workplace_emails") {
      orderSeeds = [
        "I’m writing regarding our last exchange.",
        "Could you please confirm whether you received the document?",
        "Please find the draft attached.",
        "If you need changes, please let me know.",
        "I will update the draft accordingly.",
        "Thank you in advance for your help.",
        "I have one quick request.",
        "Could you clarify one point, please?",
        "If possible, could you reply by Friday?",
        "Best regards,",
        "Kind regards,",
        "Thank you."
      ];
    } else {
      orderSeeds = [
        "Would you like to meet up on Friday after work?",
        "I’d love to, but I’m not free Friday.",
        "Could we do Saturday afternoon instead?",
        "Let me know what works for you.",
        "Thanks for asking!",
        "Saturday works for me.",
        "Could you confirm the time?",
        "How about a coffee?",
        "I’m afraid I can’t tonight.",
        "Maybe another time?",
        "See you soon!",
        "Take care."
      ];
    }

    for (var o = 0; o < orderSeeds.length; o++) {
      addTask(list, topic.id, makeOrder("Word order", "Build the sentence.", orderSeeds[o], "Word order + punctuation must match."), n++);
    }

    // 3) Connectors cloze (10+)
    var connWords = [];
    for (var c = 0; c < CONNECTORS.length; c++) connWords.push(CONNECTORS[c].w);

    var connTemplates = [
      { t:"I have a conflict today; ___, could we move the meeting?", a:"therefore", why:"Conflict → result: therefore." },
      { t:"I’m free on Friday; ___, I’m not available Thursday.", a:"however", why:"Contrast: however." },
      { t:"We can do Friday; ___, we can do Monday.", a:"alternatively", why:"Second option: alternatively." },
      { t:"The item is defective; ___, I’d like a refund.", a:"as a result", why:"Cause → result." },
      { t:"Please confirm receipt; ___, I will follow up tomorrow.", a:"otherwise", why:"If not, then…" },
      { t:"We need approval; ___, we can’t proceed.", a:"therefore", why:"Conclusion from situation." },
      { t:"The tracking hasn’t updated; ___, could you check the status?", a:"therefore", why:"Reason → request." },
      { t:"We can’t meet Friday; ___, Saturday works.", a:"instead", why:"Replacement option." },
      { t:"We have completed the draft; ___, we will review it tomorrow.", a:"meanwhile", why:"Parallel timing." },
      { t:"We need two people, ___ one manager and one assistant.", a:"for example", why:"Example connector." }
    ];

    for (var ct = 0; ct < connTemplates.length; ct++) {
      var correctConn = connTemplates[ct].a;
      var wrongConn = pickWrong(connWords, correctConn, 3);
      var optsConn = [correctConn].concat(wrongConn);
      addTask(list, topic.id, makeCloze("Connectors", connTemplates[ct].t, correctConn, optsConn, connTemplates[ct].why, "Look for result/contrast/example."), n++);
    }

    // 4) Prepositions cloze (ONE BLANK per item — FIXED)
    var prepItems = [
      { t:"Our meeting is ___ Friday at 10:00.", a:"on", why:"on + day/date" },
      { t:"Our meeting is on Friday ___ 10:00.", a:"at", why:"at + clock time" },
      { t:"I’ll call you ___ the morning.", a:"in", why:"in the morning/afternoon/evening" },
      { t:"Please reply ___ Friday if possible.", a:"by", why:"by + deadline" },
      { t:"The refund will appear ___ your account.", a:"in", why:"in your account" },
      { t:"The refund will appear in your account ___ 3–5 days.", a:"within", why:"within + time window" },
      { t:"The bus stop is ___ the supermarket.", a:"near", why:"near = close to" },
      { t:"The pharmacy is ___ from the station.", a:"across from", why:"across from = opposite" },
      { t:"Meet me ___ reception.", a:"at", why:"at + point/place" },
      { t:"The office is ___ the corner.", a:"on", why:"on the corner" },
      { t:"The meeting is ___ 10:30 and 12:30.", a:"between", why:"between + A and B" },
      { t:"Please send it ___ email.", a:"by", why:"by + method (common) / via email also OK in many contexts" }
    ];

    for (var p = 0; p < prepItems.length; p++) {
      var correctPrep = prepItems[p].a;
      var wrongPrep = pickWrong(PREPOSITIONS, correctPrep, 3);
      var optsPrep = [correctPrep].concat(wrongPrep);
      addTask(list, topic.id, makeCloze("Prepositions", prepItems[p].t, correctPrep, optsPrep, prepItems[p].why, "Think: time/place/collocation."), n++);
    }

    // 5) Polite MCQ (12+)
    var politeGood = [
      "Could you please confirm the details?",
      "Would you be available tomorrow morning?",
      "I’m sorry for the inconvenience.",
      "Thank you in advance for your help.",
      "Could you advise the next step, please?",
      "Would it be possible to move the meeting?",
      "I’d appreciate your support on this.",
      "If that works for you, I’ll send an updated invite.",
      "Could you clarify one point, please?",
      "Please let me know what suits you best.",
      "If you have already paid, please ignore this message.",
      "Could you confirm receipt, please?"
    ];
    var politeBad = [
      "Answer now.",
      "Do it today.",
      "This is your fault.",
      "Send it quickly.",
      "I told you already.",
      "Fix it."
    ];

    for (var m = 0; m < 12; m++) {
      var good = politeGood[m % politeGood.length];
      var wrongs = shuffle(politeBad).slice(0, 3);
      addTask(list, topic.id, makeMCQ("Polite tone", "Choose the most professional option.", good, wrongs, "Professional tone uses polite modal + softeners.", "Pick the most polite and complete sentence."), n++);
    }

    // 6) Listening task (topic’s listening)
    if (topic.listening) {
      addTask(list, topic.id, makeListen("Listening", topic.listening.title, topic.listening.text, topic.listening.questions), n++);
    }

    return list;
  }

  function rebuildAllTasks() {
    TASKS = {};
    for (var i = 0; i < TOPICS.length; i++) {
      TASKS[TOPICS[i].id] = buildTasksForTopic(TOPICS[i]);
    }
  }
  rebuildAllTasks();

  // -----------------------------
  // Scenario Map (filter + search)
  // -----------------------------
  function getCategories() {
    var seen = { "All": true };
    for (var i = 0; i < TOPICS.length; i++) seen[TOPICS[i].category] = true;
    var keys = [];
    for (var k in seen) if (seen.hasOwnProperty(k)) keys.push(k);
    keys.sort();
    // Ensure "All" first
    for (var j = 0; j < keys.length; j++) {
      if (keys[j] === "All") { keys.splice(j, 1); break; }
    }
    keys.unshift("All");
    return keys;
  }

  function fillSelect(sel, items, getValue, getLabel) {
    if (!sel) return;
    sel.innerHTML = "";
    for (var i = 0; i < items.length; i++) {
      var opt = document.createElement("option");
      opt.value = getValue(items[i], i);
      opt.textContent = getLabel(items[i], i);
      sel.appendChild(opt);
    }
  }

  function fillTopicSelects() {
    var topicSelectIds = ["g1-topic", "g2-topic", "g3-topic", "g4-topic", "g5-topic", "sim-topic"];
    for (var i = 0; i < topicSelectIds.length; i++) {
      var sel = qs("#" + topicSelectIds[i]);
      if (!sel) continue;
      fillSelect(sel, TOPICS, function (t) { return t.id; }, function (t) { return t.icon + " " + t.title; });
      sel.value = TOPICS[0].id;
    }
  }

  function topicMatchesSearch(t, q) {
    q = String(q || "").trim().toLowerCase();
    if (!q) return true;
    var blob = (t.title + " " + t.category + " " + (t.tags || []).join(" ")).toLowerCase();
    return blob.indexOf(q) !== -1;
  }

  function renderScenarioMap() {
    var list = qs("#tt-list");
    var hint = qs("#tt-hint");
    var catSel = qs("#tt-cat");
    var search = qs("#tt-search");
    if (!list) return;

    var cat = catSel ? (catSel.value || "All") : "All";
    var q = search ? (search.value || "") : "";

    list.innerHTML = "";
    var shown = 0;

    for (var i = 0; i < TOPICS.length; i++) {
      var t = TOPICS[i];
      if (cat !== "All" && t.category !== cat) continue;
      if (!topicMatchesSearch(t, q)) continue;

      shown++;
      var totalTasks = (TASKS[t.id] || []).length;
      var mastered = masteredCount(t.id);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tt-card";
      btn.setAttribute("data-topic", t.id);
      btn.innerHTML =
        "<div class='tt-card-title'>" + escapeHtml(t.icon + " " + t.title) + "</div>" +
        "<div class='tt-card-sub'>" + escapeHtml(t.category) + " · " + escapeHtml((t.tags || []).slice(0, 4).join(" · ")) + "</div>" +
        "<div class='tt-chiprow'>" +
          "<span class='tt-chip'>Tasks: " + totalTasks + "</span>" +
          "<span class='tt-chip'>Mastered: " + mastered + "</span>" +
        "</div>";

      list.appendChild(btn);
    }

    if (hint) {
      hint.textContent = shown ? (shown + " topic(s) shown. Tap a card to open the workshop.") : "No results. Try another keyword.";
    }
  }

  // -----------------------------
  // Workshop rendering
  // -----------------------------
  var currentTopic = null;

  function findTopic(id) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].id === id) return TOPICS[i];
    return TOPICS[0] || null;
  }

  function setWorkshopHeader(topic) {
    var title = qs("#tt-w-title");
    var meta = qs("#tt-w-meta");
    if (title) title.textContent = topic.icon + " " + topic.title;
    if (meta) {
      var chips = "<span class='tt-chip'>" + escapeHtml(topic.category) + "</span>";
      for (var i = 0; i < (topic.tags || []).length; i++) {
        chips += "<span class='tt-chip'>" + escapeHtml(topic.tags[i]) + "</span>";
      }
      meta.innerHTML = chips;
    }
    updateWorkshopProgress(topic);
  }

  function updateWorkshopProgress(topic) {
    var pill = qs("#tt-w-progress");
    var resetBtn = qs("#tt-w-reset");
    var total = (TASKS[topic.id] || []).length;
    var mastered = masteredCount(topic.id);
    if (pill) pill.textContent = "Progress: " + mastered + "/" + total + " mastered";
    if (resetBtn) resetBtn.disabled = false;
  }

  function setFeedback(el, ok, msg, hint, why) {
    if (!el) return;
    el.className = "tt-feedback " + (ok ? "good" : "bad");
    var html = (ok ? "✅ " : "❌ ") + escapeHtml(msg || "");
    if (!ok && hint) html += "<br><strong>Hint:</strong> " + escapeHtml(hint);
    if (why) html += "<br><strong>Why:</strong> " + escapeHtml(why);
    el.innerHTML = html;
  }

  // ---- Tabs
  function wireWorkshopTabs() {
    var tabs = qsa(".tt-tab");
    var panels = {
      grammar: qs("#tt-tab-grammar"),
      vocab: qs("#tt-tab-vocab"),
      practice: qs("#tt-tab-practice"),
      builder: qs("#tt-tab-builder"),
      listening: qs("#tt-tab-listening"),
      speaking: qs("#tt-tab-speaking")
    };

    function activate(tabName) {
      for (var i = 0; i < tabs.length; i++) {
        var isActive = (tabs[i].getAttribute("data-tab") === tabName);
        tabs[i].classList.toggle("is-active", isActive);
        tabs[i].setAttribute("aria-selected", isActive ? "true" : "false");
      }
      for (var k in panels) if (panels.hasOwnProperty(k) && panels[k]) {
        panels[k].hidden = (k !== tabName);
      }
    }

    for (var i = 0; i < tabs.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          activate(btn.getAttribute("data-tab"));
        });
      })(tabs[i]);
    }
    activate("grammar");
  }

  // ---- Grammar
  function renderGrammar(topic) {
    var box = qs("#tt-tab-grammar");
    if (!box) return;

    var html = "";
    for (var i = 0; i < (topic.grammar || []).length; i++) {
      var g = topic.grammar[i];
      html +=
        "<details class='tt-acc'>" +
          "<summary><strong>" + escapeHtml(g.title) + "</strong> <span class='ce-muted'>— why</span></summary>" +
          "<div class='tt-acc-body'>" +
            "<p class='ce-muted' style='margin:8px 0 10px;'>" + escapeHtml(g.why || "") + "</p>" +
            "<div class='ce-muted' style='font-weight:900;margin-bottom:6px;'>Patterns</div>" +
            "<ul class='ce-bullets'>" +
              (g.patterns || []).map(function (p) { return "<li><code>" + escapeHtml(p) + "</code></li>"; }).join("") +
            "</ul>" +
            (g.tip ? ("<div class='tt-feedback warn'>💡 " + escapeHtml(g.tip) + "</div>") : "") +
          "</div>" +
        "</details>";
    }

    html +=
      "<details class='tt-acc'>" +
        "<summary><strong>Connector mini-list (1x translation)</strong> <span class='ce-muted'>— for writing</span></summary>" +
        "<div class='tt-acc-body'>" +
          "<ul class='ce-bullets'>" +
          CONNECTORS.map(function (c) { return "<li><code>" + escapeHtml(c.w) + "</code> — " + escapeHtml(c.fr) + "</li>"; }).join("") +
          "</ul>" +
        "</div>" +
      "</details>";

    box.innerHTML = html;
  }

  // ---- Vocab (flashcards)
  function renderVocab(topic) {
    var box = qs("#tt-tab-vocab");
    if (!box) return;

    var v = topic.vocab || [];
    var cards = "";
    for (var i = 0; i < v.length; i++) {
      cards +=
        "<div class='tt-vcard' role='button' tabindex='0' aria-pressed='false'>" +
          "<div class='tt-vinner'>" +
            "<div class='tt-vface tt-vfront'>" +
              "<div class='tt-vicon'>" + escapeHtml(v[i].icon || "🔹") + "</div>" +
              "<div class='tt-vword'>" + escapeHtml(v[i].w || "") + "</div>" +
              "<div class='tt-vmuted'>Tap to flip</div>" +
            "</div>" +
            "<div class='tt-vface tt-vback'>" +
              "<div><strong>Meaning:</strong> " + escapeHtml(v[i].def || "") + "</div>" +
              "<div class='tt-vmuted' style='margin-top:8px;'><strong>Example:</strong> " + escapeHtml(v[i].ex || "") + "</div>" +
            "</div>" +
          "</div>" +
        "</div>";
    }

    box.innerHTML =
      "<div class='tt-vocab-head'>" +
        "<div class='tt-row' style='flex-wrap:wrap;'>" +
          "<button class='ce-btn ce-btn-secondary' type='button' id='v-reset'>Reset flips</button>" +
          "<button class='ce-btn ce-btn-ghost' type='button' id='v-listen'>🔊 Listen (examples)</button>" +
        "</div>" +
        "<span class='ce-muted'>Tap a card to flip.</span>" +
      "</div>" +
      "<div class='tt-vocab-grid' id='v-grid'>" + cards + "</div>";

    var grid = qs("#v-grid", box);
    if (!grid) return;

    function flip(el) {
      var flipped = el.classList.toggle("is-flipped");
      el.setAttribute("aria-pressed", flipped ? "true" : "false");
    }

    grid.addEventListener("click", function (e) {
      var node = e.target;
      while (node && node !== grid && !node.classList.contains("tt-vcard")) node = node.parentNode;
      if (node && node.classList && node.classList.contains("tt-vcard")) flip(node);
    });

    grid.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var node = e.target;
      if (node && node.classList && node.classList.contains("tt-vcard")) {
        e.preventDefault();
        flip(node);
      }
    });

    var resetBtn = qs("#v-reset", box);
    if (resetBtn) resetBtn.onclick = function () {
      var all = qsa(".tt-vcard", grid);
      for (var i = 0; i < all.length; i++) {
        all[i].classList.remove("is-flipped");
        all[i].setAttribute("aria-pressed", "false");
      }
    };

    var listenBtn = qs("#v-listen", box);
    if (listenBtn) listenBtn.onclick = function () {
      var lines = [];
      for (var i = 0; i < v.length; i++) if (v[i].ex) lines.push(v[i].ex);
      var txt = lines.slice(0, 10).join(" … ");
      if (!speak(txt, { rate: 0.92 })) updateVoiceNote("Speech engine not available.");
    };
  }

  // ---- Practice (mix or per type)
  var practiceState = null;

  function filterTasks(topic, mode) {
    var all = TASKS[topic.id] || [];
    if (mode === "mix") return all.slice(0);
    var out = [];
    for (var i = 0; i < all.length; i++) if (all[i].type === mode) out.push(all[i]);
    return out;
  }

  function nextUnmastered(tasks, topicId) {
    for (var i = 0; i < tasks.length; i++) if (!isMastered(topicId, tasks[i].id)) return tasks[i];
    return null;
  }

  function renderPractice(topic) {
    var box = qs("#tt-tab-practice");
    if (!box) return;

    box.innerHTML =
      "<div class='tt-row' style='flex-wrap:wrap;'>" +
        "<label class='tt-label' style='min-width:220px; max-width:320px;'>" +
          "<span class='ce-muted'>Mode</span>" +
          "<select id='p-mode' class='tt-select'>" +
            "<option value='mix'>Mix (recommended)</option>" +
            "<option value='mcq'>MCQ (QCM)</option>" +
            "<option value='cloze'>Fill in the blank</option>" +
            "<option value='order'>Word order (tap)</option>" +
            "<option value='match'>Matching (tap)</option>" +
            "<option value='listen'>Listening (comprehension)</option>" +
          "</select>" +
        "</label>" +
        "<button class='ce-btn ce-btn-primary' type='button' id='p-start'>Start</button>" +
        "<button class='ce-btn ce-btn-secondary' type='button' id='p-next' disabled>Next</button>" +
        "<button class='ce-btn ce-btn-ghost' type='button' id='p-reset'>Reset session</button>" +
        "<span class='tt-pill' id='p-score'>Done: 0</span>" +
      "</div>" +
      "<div id='p-stage' class='tt-stage'></div>" +
      "<div id='p-fb' class='tt-feedback'>Tap Start to begin.</div>";

    var modeSel = qs("#p-mode", box);
    var startBtn = qs("#p-start", box);
    var nextBtn = qs("#p-next", box);
    var resetBtn = qs("#p-reset", box);
    var scoreEl = qs("#p-score", box);
    var stage = qs("#p-stage", box);
    var fb = qs("#p-fb", box);

    function updateScore() {
      if (scoreEl) scoreEl.textContent = "Done: " + (practiceState ? practiceState.done : 0);
      updateWorkshopProgress(topic);
    }

    function start(forceRepeat) {
      var mode = modeSel ? modeSel.value : "mix";
      if (["mix","mcq","cloze","order","match","listen"].indexOf(mode) < 0) mode = "mix";

      var pool = filterTasks(topic, mode);
      pool = shuffle(pool);

      practiceState = {
        topicId: topic.id,
        mode: mode,
        pool: pool,
        done: 0,
        // NEW:
        repeat: !!forceRepeat,
        // pointer for repeat mode
        ptr: 0
      };

      updateScore();
      next();
    }

    function next() {
      if (!practiceState) return;
      if (nextBtn) nextBtn.disabled = true;

      var task = null;

      // NEW: if repeat mode, just cycle through pool forever
      if (practiceState.repeat) {
        if (!practiceState.pool.length) return;
        task = practiceState.pool[practiceState.ptr % practiceState.pool.length];
        practiceState.ptr += 1;
      } else {
        task = nextUnmastered(practiceState.pool, practiceState.topicId);
      }

      // If all mastered in normal mode → show completion + enable replay
      if (!task) {
        stage.innerHTML =
          "<div class='tt-feedback good'>✅ Deck complete! You mastered all tasks in this mode.</div>" +
          "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
            "<button class='ce-btn ce-btn-primary' type='button' id='p-replay'>Practice again (repeat mode)</button>" +
          "</div>";

        fb.className = "tt-feedback good";
        fb.textContent = "Great job. Replay for speed/fluency, or reset progress to start from zero.";

        var replayBtn = qs("#p-replay", box);
        if (replayBtn) replayBtn.onclick = function () { start(true); };

        if (nextBtn) nextBtn.disabled = true;
        return;
      }

      fb.className = "tt-feedback";
      fb.textContent = "Answer to see feedback (why + hint).";

      renderTask(stage, fb, task, function (ok) {
        if (nextBtn) nextBtn.disabled = false;

        // Only mark mastered in normal mode (NOT in repeat mode)
        if (!practiceState.repeat && ok) {
          markMastered(practiceState.topicId, task.id);
          practiceState.done += 1;
          updateScore();
        } else if (practiceState.repeat) {
          // In repeat mode, count attempts as "done" if you want
          practiceState.done += 1;
          updateScore();
        }
      });
    }

    if (startBtn) startBtn.onclick = function () { start(false); };
    if (nextBtn) nextBtn.onclick = next;

    // Reset session = replay (repeat mode)
    if (resetBtn) resetBtn.onclick = function () { start(true); };

    start(false);
  }

  // ---- Render one task (MCQ/Cloze/Order/Match/Listen)
  function renderTask(stage, fb, task, onAnswered) {
    stage.innerHTML = "";

    // MCQ
    if (task.type === "mcq") {
      stage.innerHTML =
        "<div class='tt-q-title'>" + escapeHtml(task.skill + " · MCQ") + "</div>" +
        "<div class='tt-q-sub'>" + escapeHtml(task.q) + "</div>" +
        "<div class='tt-choices' id='mcq-box'></div>";

      var box = qs("#mcq-box", stage);
      var answered = false;

      for (var i = 0; i < task.a.length; i++) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tt-choice";
        b.textContent = task.a[i];
        b.setAttribute("data-idx", String(i));
        box.appendChild(b);
      }

      box.onclick = function (e) {
        if (answered) return;
        var node = e.target;
        if (!node || !node.classList || !node.classList.contains("tt-choice")) return;
        answered = true;

        var idx = parseInt(node.getAttribute("data-idx"), 10);
        var ok = (idx === task.correct);

        var buttons = qsa(".tt-choice", box);
        for (var j = 0; j < buttons.length; j++) buttons[j].disabled = true;

        node.classList.add(ok ? "is-correct" : "is-wrong");

        if (ok) setFeedback(fb, true, "Correct.", null, task.why);
        else setFeedback(fb, false, "Not quite. Correct: " + task.a[task.correct], task.hint, task.why);

        if (typeof onAnswered === "function") onAnswered(ok);
      };
      return;
    }

    // Cloze
    if (task.type === "cloze") {
      stage.innerHTML =
        "<div class='tt-q-title'>" + escapeHtml(task.skill + " · Fill in the blank") + "</div>" +
        "<div class='tt-q-sub'>" + escapeHtml(String(task.text || "").replace("___", "_____")) + "</div>" +
        "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
          "<select id='cloze-sel' class='tt-select' style='min-width:240px;'></select>" +
          "<button class='ce-btn ce-btn-primary' type='button' id='cloze-check'>Check</button>" +
        "</div>";

      var sel = qs("#cloze-sel", stage);
      for (var i = 0; i < task.options.length; i++) {
        var o = document.createElement("option");
        o.value = String(i);
        o.textContent = task.options[i];
        sel.appendChild(o);
      }

      qs("#cloze-check", stage).onclick = function () {
        var idx = parseInt(sel.value, 10);
        var ok = (idx === task.correct);
        if (ok) setFeedback(fb, true, "Correct.", null, task.why);
        else setFeedback(fb, false, "Not quite. Correct: " + task.options[task.correct], task.hint, task.why);
        if (typeof onAnswered === "function") onAnswered(ok);
      };
      return;
    }

    // Word order
    if (task.type === "order") {
      var tokens = shuffle(task.tokens || []);
      var built = [];

      stage.innerHTML =
        "<div class='tt-q-title'>" + escapeHtml(task.skill + " · Word order") + "</div>" +
        "<div class='tt-q-sub'>" + escapeHtml(task.prompt || "Build the sentence.") + "</div>" +
        "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px; gap:12px; align-items:flex-start;'>" +
          "<div style='flex:1; min-width:240px;'>" +
            "<div class='ce-muted' style='margin-bottom:6px;'>Word bank (tap)</div>" +
            "<div class='tt-tokens' id='bank'></div>" +
          "</div>" +
          "<div style='flex:1; min-width:240px;'>" +
            "<div class='ce-muted' style='margin-bottom:6px;'>Your sentence (tap to remove)</div>" +
            "<div class='tt-tokens' id='out' style='min-height:48px;'></div>" +
            "<div class='tt-row' style='margin-top:10px; flex-wrap:wrap;'>" +
              "<button class='ce-btn ce-btn-primary' type='button' id='order-check'>Check</button>" +
              "<button class='ce-btn ce-btn-secondary' type='button' id='order-reset'>Reset</button>" +
              "<button class='ce-btn ce-btn-ghost' type='button' id='order-hint'>Hint</button>" +
            "</div>" +
          "</div>" +
        "</div>";

      var bank = qs("#bank", stage);
      var out = qs("#out", stage);

      function draw() {
        bank.innerHTML = "";
        for (var i = 0; i < tokens.length; i++) {
          var sp = document.createElement("span");
          sp.className = "tt-token";
          sp.textContent = tokens[i];
          sp.setAttribute("data-idx", String(i));
          bank.appendChild(sp);
        }

        out.innerHTML = "";
        for (var j = 0; j < built.length; j++) {
          var sp2 = document.createElement("span");
          sp2.className = "tt-token";
          sp2.textContent = built[j];
          sp2.setAttribute("data-idx", String(j));
          out.appendChild(sp2);
        }
      }

      function reset() {
        tokens = shuffle(task.tokens || []);
        built = [];
        fb.className = "tt-feedback";
        fb.textContent = "Tap words to build the sentence, then check.";
        draw();
      }

      bank.onclick = function (e) {
        var node = e.target;
        if (!node || !node.classList || !node.classList.contains("tt-token")) return;
        var idx = parseInt(node.getAttribute("data-idx"), 10);
        built.push(tokens[idx]);
        tokens.splice(idx, 1);
        draw();
      };

      out.onclick = function (e) {
        var node = e.target;
        if (!node || !node.classList || !node.classList.contains("tt-token")) return;
        var idx = parseInt(node.getAttribute("data-idx"), 10);
        tokens.push(built[idx]);
        built.splice(idx, 1);
        draw();
      };

      qs("#order-check", stage).onclick = function () {
        var guess = normalizeSentence(built.join(" "));
        var ok = (guess === task.target);
        if (ok) setFeedback(fb, true, "Correct.", null, task.why);
        else setFeedback(fb, false, "Not quite. Target: " + task.target, task.hint, task.why);
        if (typeof onAnswered === "function") onAnswered(ok);
      };

      qs("#order-reset", stage).onclick = reset;

      qs("#order-hint", stage).onclick = function () {
        fb.className = "tt-feedback warn";
        fb.innerHTML = "💡 <strong>Hint:</strong> " + escapeHtml(task.hint) +
          "<br><strong>Why:</strong> " + escapeHtml(task.why);
      };

      reset();
      return;
    }

    // Matching (tap left then right) — FIXED
    if (task.type === "match") {
      var pairs = shuffle(task.pairs || []);
      var left = [];
      var right = [];
      for (var i = 0; i < pairs.length; i++) {
        left.push({ text: pairs[i].left, key: pairs[i].left });
        right.push({ text: pairs[i].right, key: pairs[i].left });
      }
      right = shuffle(right);

      stage.innerHTML =
        "<div class='tt-q-title'>" + escapeHtml(task.skill + " · Matching") + "</div>" +
        "<div class='tt-q-sub'>" + escapeHtml(task.prompt || "Match pairs.") + "</div>" +
        "<div class='tt-match-grid'>" +
          "<div class='tt-match-col' id='tt-ml'><div class='tt-match-head'>LEFT (pick 1)</div></div>" +
          "<div class='tt-match-col' id='tt-mr'><div class='tt-match-head'>RIGHT (match it)</div></div>" +
        "</div>" +
        "<div class='ce-muted' style='margin-top:10px;'>Tap one LEFT item, then tap the matching RIGHT item.</div>";

      var ml = qs("#tt-ml", stage);
      var mr = qs("#tt-mr", stage);

      var leftByKey = {};
      for (var i = 0; i < left.length; i++) {
        var a = document.createElement("button");
        a.type = "button";
        a.className = "tt-match-item";
        a.textContent = left[i].text;
        a.setAttribute("data-side", "l");
        a.setAttribute("data-key", left[i].key);
        ml.appendChild(a);
        leftByKey[left[i].key] = a;
      }
      for (var j = 0; j < right.length; j++) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tt-match-item";
        b.textContent = right[j].text;
        b.setAttribute("data-side", "r");
        b.setAttribute("data-key", right[j].key);
        mr.appendChild(b);
      }

      var pickedKey = null;
      var done = 0;
      var total = left.length;

      function clearPickedUI() {
        var all = qsa(".tt-match-item", stage);
        for (var k = 0; k < all.length; k++) all[k].classList.remove("is-picked");
      }

      function updateDone() {
        if (done >= total) {
          setFeedback(fb, true, "Matching complete!", null, task.why);
          if (typeof onAnswered === "function") onAnswered(true);
        } else {
          fb.className = "tt-feedback";
          fb.textContent = "Pick LEFT, then pick the matching RIGHT.";
        }
      }

      stage.onclick = function (e) {
        var node = e.target;
        if (!node || !node.classList || !node.classList.contains("tt-match-item")) return;
        if (node.classList.contains("is-done")) return;

        var side = node.getAttribute("data-side");
        var key = node.getAttribute("data-key");

        if (!pickedKey) {
          if (side !== "l") {
            fb.className = "tt-feedback warn";
            fb.textContent = "Start on the LEFT side.";
            return;
          }
          pickedKey = key;
          clearPickedUI();
          node.classList.add("is-picked");
          fb.className = "tt-feedback";
          fb.textContent = "Now pick the matching definition on the RIGHT.";
          return;
        }

        if (side !== "r") return;

        var ok = (key === pickedKey);
        if (ok) {
          var leftBtn = leftByKey[pickedKey];
          if (leftBtn) { leftBtn.classList.remove("is-picked"); leftBtn.classList.add("is-done"); leftBtn.disabled = true; }
          node.classList.add("is-done"); node.disabled = true;

          done += 1;
          pickedKey = null;
          clearPickedUI();

          fb.className = "tt-feedback good";
          fb.textContent = "✅ Correct match.";
          setTimeout(updateDone, 200);
        } else {
          fb.className = "tt-feedback bad";
          fb.textContent = "❌ Not a match. Try again.";
          pickedKey = null;
          clearPickedUI();
        }
      };

      updateDone();
      return;
    }

    // Listening (play + MCQ)
    if (task.type === "listen") {
      stage.innerHTML =
        "<div class='tt-q-title'>🎧 " + escapeHtml(task.title || "Listening") + "</div>" +
        "<div class='tt-q-sub ce-muted'>Press play, then answer.</div>" +
        "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
          "<button class='ce-btn ce-btn-primary' type='button' id='l-play'>🔊 Play</button>" +
          "<button class='ce-btn ce-btn-secondary' type='button' id='l-stop'>Stop</button>" +
          "<button class='ce-btn ce-btn-ghost' type='button' id='l-show'>Show script</button>" +
        "</div>" +
        "<div class='tt-stage' style='margin-top:10px;' id='l-script' hidden>" + escapeHtml(task.text) + "</div>" +
        "<div id='l-q'></div>";

      var showBtn = qs("#l-show", stage);
      var scriptBox = qs("#l-script", stage);
      if (showBtn && scriptBox) {
        showBtn.onclick = function () {
          scriptBox.hidden = !scriptBox.hidden;
          showBtn.textContent = scriptBox.hidden ? "Show script" : "Hide script";
        };
      }

      var playBtn = qs("#l-play", stage);
      var stopBtn = qs("#l-stop", stage);
      if (playBtn) playBtn.onclick = function () {
        var ok = speak(task.text, { rate: 0.95 });
        if (!ok) updateVoiceNote("Speech not supported on this device.");
      };
      if (stopBtn) stopBtn.onclick = function () {
        try { window.speechSynthesis.cancel(); } catch (_) {}
      };

      var qwrap = qs("#l-q", stage);
      var answeredAll = 0;
      var totalQ = (task.questions || []).length;

      function renderListenQuestion(idx) {
        var qq = task.questions[idx];
        var html =
          "<div class='tt-acc' style='margin-top:10px;'>" +
            "<div class='tt-q-title'>Question " + (idx + 1) + " / " + totalQ + "</div>" +
            "<div class='tt-q-sub'>" + escapeHtml(qq.q) + "</div>" +
            "<div class='tt-choices' id='l-mcq'></div>" +
          "</div>";
        qwrap.innerHTML = html;

        var box = qs("#l-mcq", qwrap);
        for (var i = 0; i < qq.a.length; i++) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "tt-choice";
          b.textContent = qq.a[i];
          b.setAttribute("data-idx", String(i));
          box.appendChild(b);
        }

        box.onclick = function (e) {
          var node = e.target;
          if (!node || !node.classList || !node.classList.contains("tt-choice")) return;

          var idxPick = parseInt(node.getAttribute("data-idx"), 10);
          var ok = (idxPick === qq.correct);

          var buttons = qsa(".tt-choice", box);
          for (var j = 0; j < buttons.length; j++) buttons[j].disabled = true;

          node.classList.add(ok ? "is-correct" : "is-wrong");

          if (ok) setFeedback(fb, true, "Correct.", null, qq.why);
          else setFeedback(fb, false, "Not quite. Correct: " + qq.a[qq.correct], qq.hint, qq.why);

          answeredAll += 1;
          if (answeredAll >= totalQ) {
            if (typeof onAnswered === "function") onAnswered(true);
            return;
          }
          setTimeout(function () { renderListenQuestion(answeredAll); }, 450);
        };
      }

      if (totalQ) renderListenQuestion(0);
      else {
        fb.className = "tt-feedback warn";
        fb.textContent = "No listening questions in this item.";
      }
      return;
    }

    stage.innerHTML = "<div class='ce-muted'>Unknown task type.</div>";
  }

  // ---- Builder
  function renderBuilder(topic) {
    var box = qs("#tt-tab-builder");
    if (!box) return;

    var b = topic.builder;
    if (!b) {
      box.innerHTML = "<div class='ce-muted'>No builder for this topic.</div>";
      return;
    }

    var checklist = "";
    for (var i = 0; i < b.checklist.length; i++) checklist += "<li>" + escapeHtml(b.checklist[i]) + "</li>";

    box.innerHTML =
      "<div class='tt-acc'>" +
        "<div class='tt-q-title'>" + escapeHtml("✍️ " + (b.title || "Builder")) + "</div>" +
        "<div class='tt-q-sub ce-muted'>Write your version below. Then check structure + tone.</div>" +
        "<div class='ce-muted' style='font-weight:900; margin-top:10px;'>Checklist</div>" +
        "<ul class='ce-bullets'>" + checklist + "</ul>" +
        "<textarea class='tt-textarea' id='b-text' rows='10' placeholder='Write here…'></textarea>" +
        "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
          "<button class='ce-btn ce-btn-primary' type='button' id='b-check'>Check</button>" +
          "<button class='ce-btn ce-btn-secondary' type='button' id='b-model'>Show model answer</button>" +
          "<button class='ce-btn ce-btn-ghost' type='button' id='b-clear'>Clear</button>" +
        "</div>" +
        "<div class='tt-feedback' id='b-fb'>Tip: Keep it short, polite, and organized.</div>" +
        "<div class='tt-stage' id='b-model-box' hidden style='white-space:pre-wrap;'>" + escapeHtml(b.model) + "</div>" +
      "</div>";

    var text = qs("#b-text", box);
    var fb = qs("#b-fb", box);
    var modelBox = qs("#b-model-box", box);

    qs("#b-model", box).onclick = function () {
      modelBox.hidden = !modelBox.hidden;
    };

    qs("#b-clear", box).onclick = function () {
      if (text) text.value = "";
      if (fb) { fb.className = "tt-feedback"; fb.textContent = "Tip: Keep it short, polite, and organized."; }
    };

    qs("#b-check", box).onclick = function () {
      var val = String((text && text.value) || "").trim();
      if (!val) {
        fb.className = "tt-feedback warn";
        fb.textContent = "Please write something first.";
        return;
      }

      // Simple rubric: count checklist signals + polite markers
      var low = val.toLowerCase();
      var score = 0;
      var missing = [];

      function hasAny(words) {
        for (var i = 0; i < words.length; i++) if (low.indexOf(words[i]) >= 0) return true;
        return false;
      }

      // heuristic checks
      var checks = [
        { label: "Greeting/context", ok: hasAny(["hello", "hi", "dear", "good morning", "good afternoon"]) },
        { label: "Reason/context", ok: hasAny(["because", "unfortunately", "i have", "i'm writing", "regarding", "about"]) },
        { label: "Request", ok: hasAny(["could you", "would you", "please", "i'd like", "would it be possible"]) },
        { label: "Next step / confirmation", ok: hasAny(["confirm", "let me know", "please let me know", "i'll send", "follow up"]) },
        { label: "Polite closing", ok: hasAny(["thank you", "thanks", "kind regards", "best regards", "sincerely"]) }
      ];

      for (var i = 0; i < checks.length; i++) {
        if (checks[i].ok) score++;
        else missing.push(checks[i].label);
      }

      if (score >= 4) {
        fb.className = "tt-feedback good";
        fb.innerHTML =
          "✅ Strong structure and tone.<br>" +
          "<strong>Why:</strong> You included most key components (context → request → next step → polite closing).";
      } else {
        fb.className = "tt-feedback bad";
        fb.innerHTML =
          "❌ Needs improvement.<br>" +
          "<strong>Missing:</strong> " + escapeHtml(missing.join(", ")) + "<br>" +
          "<strong>Hint:</strong> Use a greeting, a short reason, one clear request, and a polite closing.";
      }
    };
  }

  // ---- Listening tab
  function renderListening(topic) {
    var box = qs("#tt-tab-listening");
    if (!box) return;

    if (!topic.listening) {
      box.innerHTML = "<div class='ce-muted'>No listening content for this topic.</div>";
      return;
    }

    // Reuse the listen task renderer
    box.innerHTML =
      "<div id='lt-stage' class='tt-stage'></div>" +
      "<div id='lt-fb' class='tt-feedback'>Press play, then answer.</div>";

    var t = makeListen("Listening", topic.listening.title, topic.listening.text, topic.listening.questions);
    renderTask(qs("#lt-stage", box), qs("#lt-fb", box), t, function () {
      // no progress marking here (practice marks progress)
    });
  }

  // ---- Speaking tab (timed speaking + recording)
  var recorder = null;
  var recChunks = [];
  var recStream = null;

  function stopRecorder() {
    try { if (recorder && recorder.state !== "inactive") recorder.stop(); } catch (_) {}
    recorder = null;

    try { if (recStream) { recStream.getTracks().forEach(function (t) { t.stop(); }); } } catch (_) {}
    recStream = null;
    recChunks = [];
  }

  function renderSpeaking(topic) {
    var box = qs("#tt-tab-speaking");
    if (!box) return;

    var prompts = (topic.speaking && topic.speaking.prompts) ? topic.speaking.prompts : [];
    if (!prompts.length) {
      box.innerHTML = "<div class='ce-muted'>No speaking prompts for this topic.</div>";
      return;
    }

    var promptOptions = "";
    for (var i = 0; i < prompts.length; i++) {
      promptOptions += "<option value='" + i + "'>Prompt " + (i + 1) + "</option>";
    }

    box.innerHTML =
      "<div class='tt-speak-grid'>" +
        "<div class='tt-stage'>" +
          "<div class='tt-q-title'>🗣️ Timed speaking</div>" +
          "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
            "<select class='tt-select' id='sp-prompt' style='min-width:220px;'>" + promptOptions + "</select>" +
            "<select class='tt-select' id='sp-time' style='min-width:160px;'>" +
              "<option value='30'>30s</option>" +
              "<option value='45' selected>45s</option>" +
              "<option value='60'>60s</option>" +
              "<option value='90'>90s</option>" +
            "</select>" +
            "<span class='tt-pill' id='sp-clock'>00:00</span>" +
          "</div>" +
          "<div class='tt-acc' style='margin-top:10px;'>" +
            "<div class='ce-muted' style='font-weight:900;'>Your prompt</div>" +
            "<div id='sp-text' style='margin-top:6px; line-height:1.55;'></div>" +
          "</div>" +
          "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
            "<button class='ce-btn ce-btn-primary' type='button' id='sp-start'>Start timer</button>" +
            "<button class='ce-btn ce-btn-secondary' type='button' id='sp-stop' disabled>Stop</button>" +
            "<button class='ce-btn ce-btn-ghost' type='button' id='sp-listen'>🔊 Listen to prompt</button>" +
          "</div>" +
          "<div class='tt-feedback' id='sp-fb'>Speak clearly. Include structure (context → request → next step).</div>" +
        "</div>" +

        "<div class='tt-stage'>" +
          "<div class='tt-q-title'>🎙️ Optional recording</div>" +
          "<div class='ce-muted' style='margin-top:6px;'>If supported by your browser, record yourself and replay.</div>" +
          "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
            "<button class='ce-btn ce-btn-primary' type='button' id='rec-start'>Start recording</button>" +
            "<button class='ce-btn ce-btn-secondary' type='button' id='rec-stop' disabled>Stop recording</button>" +
          "</div>" +
          "<audio class='tt-audio' id='rec-audio' controls></audio>" +
          "<div class='tt-feedback' id='rec-fb'>Tip: Aim for 4–6 sentences. Use connectors (however, therefore) lightly.</div>" +
        "</div>" +
      "</div>";

    var spSel = qs("#sp-prompt", box);
    var spTime = qs("#sp-time", box);
    var spText = qs("#sp-text", box);
    var spClock = qs("#sp-clock", box);
    var spStart = qs("#sp-start", box);
    var spStop = qs("#sp-stop", box);
    var spListen = qs("#sp-listen", box);
    var spFb = qs("#sp-fb", box);

    var timerId = null;
    var remain = 0;

    function updatePrompt() {
      var idx = parseInt(spSel.value, 10) || 0;
      spText.textContent = prompts[idx] || "";
    }

    function stopTimer() {
      if (timerId) { clearInterval(timerId); timerId = null; }
      if (spStop) spStop.disabled = true;
      if (spStart) spStart.disabled = false;
    }

    function startTimer() {
      stopTimer();
      remain = parseInt(spTime.value, 10) || 45;
      if (spClock) spClock.textContent = formatMMSS(remain);
      if (spStart) spStart.disabled = true;
      if (spStop) spStop.disabled = false;
      if (spFb) { spFb.className = "tt-feedback"; spFb.textContent = "Go! Speak until the timer ends."; }

      timerId = setInterval(function () {
        remain -= 1;
        if (spClock) spClock.textContent = formatMMSS(remain);
        if (remain <= 0) {
          stopTimer();
          if (spFb) {
            spFb.className = "tt-feedback good";
            spFb.textContent = "✅ Time! If you recorded, replay and note 1 improvement (pronunciation, structure, connectors).";
          }
        }
      }, 1000);
    }

    spSel.onchange = updatePrompt;
    updatePrompt();

    if (spStart) spStart.onclick = startTimer;
    if (spStop) spStop.onclick = function () {
      stopTimer();
      if (spFb) { spFb.className = "tt-feedback warn"; spFb.textContent = "Timer stopped. You can restart anytime."; }
    };

    if (spListen) spListen.onclick = function () {
      var idx = parseInt(spSel.value, 10) || 0;
      var ok = speak(prompts[idx] || "", { rate: 0.95 });
      if (!ok) updateVoiceNote("Speech not supported on this device.");
    };

    // Recording
    var recStart = qs("#rec-start", box);
    var recStop = qs("#rec-stop", box);
    var recAudio = qs("#rec-audio", box);
    var recFb = qs("#rec-fb", box);

    function canRecord() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    }

    if (!canRecord()) {
      if (recFb) {
        recFb.className = "tt-feedback warn";
        recFb.textContent = "Recording not supported in this browser. You can still do timed speaking without recording.";
      }
      if (recStart) recStart.disabled = true;
      if (recStop) recStop.disabled = true;
      return;
    }

    recStart.onclick = function () {
      stopRecorder();
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        recStream = stream;
        recChunks = [];
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = function (ev) {
          if (ev.data && ev.data.size > 0) recChunks.push(ev.data);
        };

        recorder.onstop = function () {
          var blob = new Blob(recChunks, { type: "audio/webm" });
          var url = URL.createObjectURL(blob);
          if (recAudio) recAudio.src = url;
          if (recFb) { recFb.className = "tt-feedback good"; recFb.textContent = "✅ Recorded. Press play to listen back."; }
          if (recStart) recStart.disabled = false;
          if (recStop) recStop.disabled = true;
          stopRecorder();
        };

        recorder.start();
        if (recFb) { recFb.className = "tt-feedback"; recFb.textContent = "Recording… speak naturally and clearly."; }
        if (recStart) recStart.disabled = true;
        if (recStop) recStop.disabled = false;
      }).catch(function () {
        if (recFb) { recFb.className = "tt-feedback bad"; recFb.textContent = "Microphone permission denied. Please allow mic access."; }
      });
    };

    recStop.onclick = function () {
      try { if (recorder && recorder.state !== "inactive") recorder.stop(); } catch (_) {}
    };
  }

  // -----------------------------
  // Timed Games (5)
  // -----------------------------
  function makeTimer(seconds, onTick, onDone) {
    var remain = seconds | 0;
    var id = null;

    function start() {
      stop();
      remain = seconds | 0;
      if (typeof onTick === "function") onTick(remain);

      id = setInterval(function () {
        remain -= 1;
        if (typeof onTick === "function") onTick(remain);
        if (remain <= 0) {
          stop();
          if (typeof onDone === "function") onDone();
        }
      }, 1000);
    }

    function stop() {
      if (id) { clearInterval(id); id = null; }
    }

    return { start: start, stop: stop };
  }

  function getTopicById(id) { return findTopic(id); }

  function renderGameOrder(stage, fb, item, onAnswered) {
    // Use order task renderer
    renderTask(stage, fb, item, onAnswered);
  }

  function renderGameMCQ(stage, fb, item, onAnswered) {
    renderTask(stage, fb, item, onAnswered);
  }

  function renderGameCloze(stage, fb, item, onAnswered) {
    renderTask(stage, fb, item, onAnswered);
  }

  function renderGameListen(stage, fb, item, onAnswered) {
    renderTask(stage, fb, item, onAnswered);
  }

  function startGame(gameId, seconds, topicSelId, stageId, fbId, clockId, scoreId, doneId, mode) {
    var topicId = qs("#" + topicSelId).value;
    var topic = getTopicById(topicId);
    var pool = TASKS[topicId] || [];
    pool = shuffle(pool);

    // Filter by mode
    var filtered = [];
    for (var i = 0; i < pool.length; i++) {
      if (mode === "mix") filtered.push(pool[i]);
      else if (pool[i].type === mode) filtered.push(pool[i]);
    }
    if (!filtered.length) filtered = pool.slice(0);

    var stage = qs("#" + stageId);
    var fb = qs("#" + fbId);
    var clock = qs("#" + clockId);
    var scoreEl = qs("#" + scoreId);
    var doneEl = qs("#" + doneId);

    var startBtn = qs("#" + gameId + "-start");
    var stopBtn = qs("#" + gameId + "-stop");

    var score = 0;
    var index = 0;
    var active = true;

    function setClock(t) {
      if (clock) clock.textContent = formatMMSS(t);
    }

    function endGame() {
      active = false;
      if (stopBtn) stopBtn.disabled = true;
      if (startBtn) startBtn.disabled = false;
      if (doneEl) doneEl.textContent = "Finished. Score: " + score + ".";
      if (fb) { fb.className = "tt-feedback good"; fb.textContent = "✅ Time! Great work. Try again or change topic."; }
    }

    function nextItem() {
      if (!active) return;
      if (index >= filtered.length) {
        filtered = shuffle(filtered);
        index = 0;
      }
      var item = filtered[index++];
      if (fb) { fb.className = "tt-feedback"; fb.textContent = "Answer quickly. Feedback appears immediately."; }

      function answered(ok) {
        if (!active) return;
        if (ok) score += 1;
        if (scoreEl) scoreEl.textContent = "Score: " + score;
        // Load next
        setTimeout(nextItem, 200);
      }

      if (mode === "order") renderGameOrder(stage, fb, item, answered);
      else if (mode === "mcq") renderGameMCQ(stage, fb, item, answered);
      else if (mode === "cloze") renderGameCloze(stage, fb, item, answered);
      else if (mode === "listen") renderGameListen(stage, fb, item, answered);
      else {
        // mix: render by type
        renderTask(stage, fb, item, answered);
      }
    }

    var timer = makeTimer(seconds, function (t) { setClock(t); }, endGame);

    // Start UI
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    if (doneEl) doneEl.textContent = "";
    if (scoreEl) scoreEl.textContent = "Score: 0";
    active = true; score = 0; index = 0;

    timer.start();
    nextItem();

    if (stopBtn) stopBtn.onclick = function () {
      timer.stop();
      endGame();
    };
  }

  function wireGames() {
    // Fill selects already done in fillTopicSelects()
    var g1s = qs("#g1-start"), g2s = qs("#g2-start"), g3s = qs("#g3-start"), g4s = qs("#g4-start"), g5s = qs("#g5-start");
    if (g1s) g1s.onclick = function () { startGame("g1", 60, "g1-topic", "g1-stage", "g1-fb", "g1-clock", "g1-score", "g1-done", "order"); };
    if (g2s) g2s.onclick = function () { startGame("g2", 45, "g2-topic", "g2-stage", "g2-fb", "g2-clock", "g2-score", "g2-done", "cloze"); };
    if (g3s) g3s.onclick = function () { startGame("g3", 45, "g3-topic", "g3-stage", "g3-fb", "g3-clock", "g3-score", "g3-done", "cloze"); };
    if (g4s) g4s.onclick = function () { startGame("g4", 45, "g4-topic", "g4-stage", "g4-fb", "g4-clock", "g4-score", "g4-done", "mcq"); };
    if (g5s) g5s.onclick = function () { startGame("g5", 75, "g5-topic", "g5-stage", "g5-fb", "g5-clock", "g5-score", "g5-done", "mix"); };

    // Make Game 2 specifically connectors cloze, Game 3 prepositions cloze
    // We'll filter inside startGame by type only; to bias connectors/prepositions, we re-start with filtered pools:
    // (We keep it simple: both use cloze; your connectors/prepositions are in cloze items.)
  }

  // -----------------------------
  // Mixed simulations
  // -----------------------------
  var simState = null;

  function buildSimulationDeck(topic) {
    var deck = [];
    var pool = TASKS[topic.id] || [];
    pool = shuffle(pool);

    // Choose: 1 listen, 1 order, 1 cloze, 1 mcq, 1 speaking prompt card
    var listen = null, order = null, cloze = null, mcq = null;
    for (var i = 0; i < pool.length; i++) if (!listen && pool[i].type === "listen") listen = pool[i];
    for (var j = 0; j < pool.length; j++) if (!order && pool[j].type === "order") order = pool[j];
    for (var k = 0; k < pool.length; k++) if (!cloze && pool[k].type === "cloze") cloze = pool[k];
    for (var m = 0; m < pool.length; m++) if (!mcq && pool[m].type === "mcq") mcq = pool[m];

    // Scenario intro
    deck.push({
      type: "intro",
      title: "Scenario",
      text:
        "You are working through a CLOE-style mini-test.\n\nTopic: " + topic.title +
        "\n\nGoal: read/listen, answer quickly, and keep a professional tone."
    });

    if (listen) deck.push(listen);
    if (mcq) deck.push(mcq);
    if (cloze) deck.push(cloze);
    if (order) deck.push(order);

    // Speaking card
    var prompts = (topic.speaking && topic.speaking.prompts) ? topic.speaking.prompts : [];
    var sp = prompts.length ? prompts[0] : "Speak for 30 seconds about this topic, using polite tone and one connector.";
    deck.push({
      type: "speakcard",
      title: "Speaking prompt (timed)",
      prompt: sp
    });

    return deck;
  }

  function renderSimulationCard(card) {
    var stage = qs("#sim-stage");
    var fb = qs("#sim-fb");
    if (!stage || !fb) return;

    fb.className = "tt-feedback";
    fb.textContent = "Answer to see immediate feedback (why + hint).";

    // Intro
    if (card.type === "intro") {
      stage.innerHTML =
        "<div class='tt-q-title'>🧪 " + escapeHtml(card.title) + "</div>" +
        "<div class='tt-stage' style='white-space:pre-wrap; margin-top:10px;'>" + escapeHtml(card.text) + "</div>";
      fb.className = "tt-feedback warn";
      fb.textContent = "Press Next to begin the simulation.";
      return;
    }

    // Speaking card
    if (card.type === "speakcard") {
      stage.innerHTML =
        "<div class='tt-q-title'>🗣️ " + escapeHtml(card.title) + "</div>" +
        "<div class='tt-q-sub'>" + escapeHtml(card.prompt) + "</div>" +
        "<div class='tt-row' style='flex-wrap:wrap; margin-top:10px;'>" +
          "<span class='tt-pill' id='sim-sclock'>00:30</span>" +
          "<button class='ce-btn ce-btn-primary' type='button' id='sim-sstart'>Start 30s</button>" +
          "<button class='ce-btn ce-btn-secondary' type='button' id='sim-sstop' disabled>Stop</button>" +
          "<button class='ce-btn ce-btn-ghost' type='button' id='sim-slisten'>🔊 Listen prompt</button>" +
        "</div>";

      var remain = 30;
      var tid = null;
      var sc = qs("#sim-sclock");
      var st = qs("#sim-sstart");
      var sp = qs("#sim-sstop");
      var sl = qs("#sim-slisten");

      function stop() {
        if (tid) { clearInterval(tid); tid = null; }
        if (sp) sp.disabled = true;
        if (st) st.disabled = false;
      }

      if (st) st.onclick = function () {
        stop();
        remain = 30;
        if (sc) sc.textContent = formatMMSS(remain);
        if (st) st.disabled = true;
        if (sp) sp.disabled = false;

        tid = setInterval(function () {
          remain -= 1;
          if (sc) sc.textContent = formatMMSS(remain);
          if (remain <= 0) {
            stop();
            fb.className = "tt-feedback good";
            fb.textContent = "✅ Done. Press Next to finish the simulation.";
          }
        }, 1000);
      };

      if (sp) sp.onclick = function () {
        stop();
        fb.className = "tt-feedback warn";
        fb.textContent = "Stopped. You can restart or press Next.";
      };

      if (sl) sl.onclick = function () {
        var ok = speak(card.prompt, { rate: 0.95 });
        if (!ok) updateVoiceNote("Speech not supported on this device.");
      };

      fb.className = "tt-feedback warn";
      fb.textContent = "Speak for 30 seconds. Then press Next.";
      return;
    }

    // Use task renderer
    renderTask(stage, fb, card, function (ok) {
      // scoring
      if (ok && simState) simState.score += 1;
      var scoreEl = qs("#sim-score");
      if (scoreEl && simState) scoreEl.textContent = "Score: " + simState.score;
      var nextBtn = qs("#sim-next");
      if (nextBtn) nextBtn.disabled = false;
    });

    var nextBtn2 = qs("#sim-next");
    if (nextBtn2) nextBtn2.disabled = true;
  }

  function startSimulation() {
    var sel = qs("#sim-topic");
    var topicId = sel ? sel.value : TOPICS[0].id;
    var topic = findTopic(topicId);

    simState = {
      topicId: topicId,
      deck: buildSimulationDeck(topic),
      idx: 0,
      score: 0
    };

    var scoreEl = qs("#sim-score");
    if (scoreEl) scoreEl.textContent = "Score: 0";

    renderSimulationCard(simState.deck[0]);
    var nextBtn = qs("#sim-next");
    if (nextBtn) nextBtn.disabled = false;
  }

  function nextSimulation() {
    if (!simState) return;
    simState.idx += 1;
    var nextBtn = qs("#sim-next");
    if (nextBtn) nextBtn.disabled = false;

    if (simState.idx >= simState.deck.length) {
      var stage = qs("#sim-stage");
      var fb = qs("#sim-fb");
      if (stage) stage.innerHTML = "<div class='tt-feedback good'>✅ Simulation complete! Score: " + simState.score + ".</div>";
      if (fb) { fb.className = "tt-feedback good"; fb.textContent = "Great work. Start another simulation or choose another topic."; }
      return;
    }
    renderSimulationCard(simState.deck[simState.idx]);
  }

  function wireSimulations() {
    var startBtn = qs("#sim-start");
    var nextBtn = qs("#sim-next");
    if (startBtn) startBtn.onclick = startSimulation;
    if (nextBtn) nextBtn.onclick = nextSimulation;
  }

  // -----------------------------
  // Set current topic + render panels
  // -----------------------------
  function setCurrentTopic(topicId) {
    currentTopic = findTopic(topicId);
    if (!currentTopic) return;

    setWorkshopHeader(currentTopic);
    renderGrammar(currentTopic);
    renderVocab(currentTopic);
    renderPractice(currentTopic);
    renderBuilder(currentTopic);
    renderListening(currentTopic);
    renderSpeaking(currentTopic);

    // Scroll workshop into view lightly
    var wk = qs("#workshop");
    if (wk && wk.scrollIntoView) wk.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // -----------------------------
  // Wiring map controls
  // -----------------------------
  function wireMapControls() {
    var catSel = qs("#tt-cat");
    var search = qs("#tt-search");
    var clear = qs("#tt-clear");
    var list = qs("#tt-list");

    if (catSel) catSel.onchange = renderScenarioMap;
    if (search) search.oninput = renderScenarioMap;

    if (clear) clear.onclick = function () {
      if (catSel) catSel.value = "All";
      if (search) search.value = "";
      renderScenarioMap();
    };

    if (list) {
      list.onclick = function (e) {
        var node = e.target;
        while (node && node !== list && !node.getAttribute("data-topic")) node = node.parentNode;
        if (!node || node === list) return;
        setCurrentTopic(node.getAttribute("data-topic"));
      };
    }
  }

  function wireResetProgress() {
    var btn = qs("#tt-w-reset");
    if (!btn) return;
    btn.onclick = function () {
      if (!currentTopic) return;
      resetTopicProgress(currentTopic.id);
      updateWorkshopProgress(currentTopic);
      renderScenarioMap();
      // Refresh practice to show unmastered deck again
      renderPractice(currentTopic);
    };
  }

  // -----------------------------
  // Init
  // -----------------------------
  function init() {
    // category select
    var catSel = qs("#tt-cat");
    if (catSel) fillSelect(catSel, getCategories(), function (x) { return x; }, function (x) { return x; });
    if (catSel) catSel.value = "All";

    fillTopicSelects();
    wireAccentButtons();
    wireWorkshopTabs();
    wireMapControls();
    wireResetProgress();
    wireGames();
    wireSimulations();

    renderScenarioMap();
    setCurrentTopic(TOPICS[0].id);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
