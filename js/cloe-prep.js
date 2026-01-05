(() => {
  "use strict";

  // ==========================================================
  // CLOE-STYLE TRAINING PAGE (Unofficial) — SpeakEasyTisha
  // - Adaptive written simulation (mixed task types)
  // - Skill builder (choose task types)
  // - Oral interview practice (3 parts, optional recording)
  // - Tech check (tts / mic / webcam)
  // ==========================================================

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const el = (tag, attrs = {}, children = []) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const c of children) n.append(c);
    return n;
  };
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  
  // ---------- Safety: show errors instead of “nothing happens” ----------
  function safeSetText(sel, text) {
    const n = $(sel);
    if (n) n.textContent = text;
  }
  function safeSetHTML(sel, html) {
    const n = $(sel);
    if (n) n.innerHTML = html;
  }
  function safeShow(sel, show) {
    const n = $(sel);
    if (n) n.hidden = !show;
  }
  function safeStyle(sel, prop, value) {
    const n = $(sel);
    if (n) n.style[prop] = value;
  }

  // Global error hooks (helps you see what broke on GitHub Pages)
  window.addEventListener("error", (e) => {
    try {
      const msg = (e && e.message) ? e.message : "Unknown JavaScript error";
      const where = (e && e.filename) ? ` (${e.filename.split("/").slice(-1)[0]}:${e.lineno || "?"})` : "";
      const b = $("#banner");
      if (b) {
        b.classList.add("is-on");
        b.style.borderColor = "rgba(200,0,0,0.25)";
        b.innerHTML = `JavaScript error: <b>${msg}</b>${where}`;
      }
      console.error("CLOE PREP error:", e);
    } catch {}
  });

  window.addEventListener("unhandledrejection", (e) => {
    try {
      const reason = e && e.reason ? (e.reason.message || String(e.reason)) : "Unknown promise rejection";
      const b = $("#banner");
      if (b) {
        b.classList.add("is-on");
        b.style.borderColor = "rgba(200,0,0,0.25)";
        b.innerHTML = `JavaScript error: <b>${reason}</b>`;
      }
      console.error("CLOE PREP unhandled rejection:", e);
    } catch {}
  });

// ---------- SVG emoji rendering (Twemoji) ----------
  function renderEmojiSVG(root = document.body) {
    // Twemoji will replace emoji characters with SVG images
    if (!window.twemoji) return;
    try {
      window.twemoji.parse(root, { folder: "svg", ext: ".svg" });
    } catch {}
  }

  // ---------- Accent / TTS ----------
  const ACCENT_KEY = "seAccent";
  let accent = "";
  try { accent = localStorage.getItem(ACCENT_KEY) || ""; } catch { accent = ""; }

  let voicesCache = [];
  function loadVoices() {
    try { voicesCache = window.speechSynthesis.getVoices() || []; } catch { voicesCache = []; }
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  const accentLang = (a) => (a === "UK" ? "en-GB" : "en-US");
  const accentLabel = (a) => (a === "UK" ? "British English (UK)" : "American English (US)");

  function pickVoice(lang) {
    if (!voicesCache || voicesCache.length === 0) return null;
    const exact = voicesCache.find(v => (v.lang || "").toLowerCase() === lang.toLowerCase());
    if (exact) return exact;
    const prefix = lang.split("-")[0].toLowerCase();
    return voicesCache.find(v => (v.lang || "").toLowerCase().startsWith(prefix)) || null;
  }
  function stopSpeaking() {
    if (!("speechSynthesis" in window)) return;
    try { window.speechSynthesis.cancel(); } catch {}
  }
  function speak(text, lang) {
    if (!("speechSynthesis" in window)) {
      banner("Text-to-speech is not available in this browser.", true);
      return;
    }
    stopSpeaking();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    const v = pickVoice(lang);
    if (v) utt.voice = v;
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  }

  // ---------- Exam model ----------
  const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const LEVEL_INDEX = Object.fromEntries(LEVELS.map((l, i) => [l, i]));

  // Difficulty steps include +- feeling
  function formatSublevel(score) {
    // score is 0..1
    if (score < 0.33) return "−";
    if (score < 0.66) return "";
    return "+";
  }

  function estimateLevel(tracker) {
    // Weighted average of item levels answered correctly
    if (!tracker.answered) return "—";
    const { totalWeight, weightedLevel, accuracy } = tracker;
    if (totalWeight <= 0) return "—";
    const avg = weightedLevel / totalWeight; // 0..5
    const base = LEVELS[clamp(Math.round(avg), 0, 5)];
    const sub = formatSublevel(accuracy);
    return `${base}${sub}`;
  }

  // Question bank (compact but realistic)
  // type:
  // - mcq: choose best option
  // - cloze: type the missing word/phrase (strict-ish match + aliases)
  // - bank: drag words into blanks (click-to-fill for speed + optional drag)
  // - order: reorder words to form a correct sentence
  // - para: reorder paragraphs / steps
  // - listen: TTS audio + mcq (2 listens)
  // - read: short text + mcq
  // - reform: choose best paraphrase / reformulation
  //
  // Each item has: level (0..5), points, timeSec, tags
  const BANK = [
    // A1
    q_mcq("A1-1", 0, 1, 30, "🧾", "Choose the correct sentence.", [
      "I work in an office.",
      "I working in an office.",
      "I am work in an office.",
      "I works in an office."
    ], 0, "Present simple with I: I work…"),
    q_cloze("A1-2", 0, 1, 35, "📅", "Complete: “My meeting is ____ Monday.”", ["on"], ["on"], "We use <b>on</b> with days: on Monday."),
    q_order("A1-3", 0, 1, 40, "👋", "Put the words in order.", ["Hello", "I’m", "Anna", ".",], "Hello I’m Anna .", "A simple introduction."),
    q_read("A1-4", 0, 1, 45, "✉️", "Read the email and choose the best answer.",
      "Subject: Appointment\n\nHello,\nMy name is Paul. I want an appointment on Tuesday at 10:00.\nThank you.\nPaul",
      "What does Paul want?",
      ["A reservation for a hotel room", "An appointment on Tuesday at 10:00", "A job interview on Friday", "A taxi to the airport"], 1,
      "He writes: “I want an appointment on Tuesday at 10:00.”"),
    q_listen("A1-5", 0, 1, 45, "🔊", "Listen (max 2 times) and choose the correct answer.",
      "Good morning. This is reception. Your room is ready.",
      ["The room is not ready.", "The room is ready.", "The hotel is closed.", "Breakfast is finished."], 1,
      "“Your room is ready.”"),

    // A2
    q_mcq("A2-1", 1, 1, 45, "📞", "Choose the best option: “Could you ____ me back this afternoon?”", ["call", "to call", "calling", "called"], 0,
      "Modal + base verb: could call."),
    q_bank("A2-2", 1, 1, 60, "🧩", "Complete the email with the correct words.", 
      "Hello ___,\n\nThank you for your message. I ___ available tomorrow morning.\nCould we ___ a call at 10:00?\n\nBest regards,\nSofia",
      ["am", "schedule", "Mr. Martin", "is", "schedules", "Ms. Martin"],
      ["Mr. Martin", "am", "schedule"],
      "Professional email basics: greeting + availability + propose a call."),
    q_order("A2-3", 1, 1, 55, "🚌", "Put the sentence in order.", ["I", "took", "the", "train", "yesterday", "."],
      "I took the train yesterday .",
      "Past simple: took (take → took)."),
    q_reform("A2-4", 1, 1, 55, "🔁", "Choose the best reformulation (same meaning).",
      "Please send me the document today.",
      ["I would like the document today, please.", "Send me document.", "You sending me the document today?", "I send the document today."], 0,
      "Polite reformulation with “I would like… please.”"),
    q_listen("A2-5", 1, 1, 55, "🎧", "Listen and choose the correct information.",
      "The meeting has been moved to Thursday at three p.m.",
      ["It is on Tuesday at 3 pm.", "It is on Thursday at 3 pm.", "It is cancelled.", "It is on Thursday at 8 am."], 1,
      "Key info: Thursday, 3 pm."),

    // B1
    q_read("B1-1", 2, 2, 80, "📄", "Read and choose the best answer.",
      "Subject: Delivery issue\n\nHi Sarah,\nThe parcels arrived this morning, but two boxes were damaged. Could you contact the carrier and ask for a replacement?\nThanks,\nNicolas",
      "What does Nicolas ask Sarah to do?",
      ["Send the parcels again tomorrow", "Contact the carrier and request replacements", "Cancel the order", "Call the customer to apologise"], 1,
      "He asks her to contact the carrier and ask for a replacement."),
    q_mcq("B1-2", 2, 2, 70, "🗓️", "Choose the correct option: “I’ve ____ working here since 2022.”", ["been", "being", "be", "was"], 0,
      "Present perfect continuous: have/has been + -ing."),
    q_cloze("B1-3", 2, 2, 75, "📌", "Complete: “I’m writing to ____ a meeting.”", ["schedule", "arrange", "set up"], ["schedule","arrange","set up"],
      "All 3 options are correct in business English."),
    q_bank("B1-4", 2, 2, 85, "🧩", "Choose the best words for the gaps.",
      "Could you please ___ me the updated file? I ___ trouble opening the old version.",
      ["send", "sending", "am having", "have", "having", "to send"],
      ["send","am having"],
      "Polite request + present continuous for a temporary problem."),
    q_listen("B1-5", 2, 2, 75, "🔊", "Listen and choose the best response.",
      "Hi, this is Tom from IT. Can you confirm your ticket number, please?",
      ["Yes, it’s ticket 4821.", "No, I don’t like tickets.", "I’m confirm the ticket.", "I confirm yesterday."], 0,
      "Confirming a number: “Yes, it’s ticket 4821.”"),

    // B2
    q_reform("B2-1", 3, 2, 90, "🔁", "Choose the most professional paraphrase.",
      "We can’t do it today because we don’t have enough staff.",
      ["Due to limited staffing, we’re unable to do it today.", "We no staff so no.", "We can’t, sorry.", "Not today, busy."], 0,
      "B2 register: concise + professional tone."),
    q_mcq("B2-2", 3, 2, 85, "⚙️", "Choose the correct option: “The report ____ by Friday.”", ["must be finished", "must finished", "must be finish", "must finishing"], 0,
      "Modal + passive: must be finished."),
    q_order("B2-3", 3, 2, 95, "🧠", "Put the sentence in order (natural word order).",
      ["If", "we", "reduce", "costs", ",", "we", "can", "invest", "more", "in", "training", "."],
      "If we reduce costs , we can invest more in training .",
      "B2 conditional with clear structure."),
    q_para("B2-4", 3, 2, 110, "🧱", "Put the steps in the best logical order (process email).",
      ["Ask for the invoice number.", "Apologise briefly.", "Explain the next step and deadline.", "Thank the client."],
      [1,0,2,3],
      "Professional structure: apologise → ask details → next step → close politely."),
    q_listen("B2-5", 3, 2, 95, "🎧", "Listen and choose the main idea.",
      "We’re slightly behind schedule, but we expect to deliver by the end of next week.",
      ["Delivery will be earlier than planned.", "Delivery will be cancelled.", "Delivery will likely happen by the end of next week.", "They refuse to deliver."], 2,
      "Main idea: behind schedule, still delivering end of next week."),

    // C1
    q_read("C1-1", 4, 3, 120, "📚", "Read and choose the best answer (tone & intent).",
      "Subject: Follow-up\n\nHi David,\nJust a quick note to circle back on the proposal I sent last week. If you’ve had a chance to review it, I’d appreciate your feedback. If not, no worries — let me know what timeline works best.\nBest,\nLea",
      "What is Lea doing?",
      ["Complaining about David", "Politely following up and offering flexibility", "Cancelling the proposal", "Demanding an answer today"], 1,
      "“circle back” + “no worries” + timeline flexibility = polite follow-up."),
    q_reform("C1-2", 4, 3, 120, "🧠", "Choose the closest meaning (nuance).",
      "I’m concerned this approach may be counterproductive.",
      ["I think this approach could create the opposite effect.", "This approach is perfect.", "This approach is productive.", "I don’t understand this approach."], 0,
      "Counterproductive = produces the opposite result."),
    q_mcq("C1-3", 4, 3, 115, "🧷", "Choose the best connector: “The data is limited; ____, we can draw a preliminary conclusion.”",
      ["nevertheless", "because", "since", "in case"], 0,
      "Contrast: despite limits, we can conclude → nevertheless."),
    q_bank("C1-4", 4, 3, 120, "🧩", "Complete with the best register (hedging).",
      "It ___ be worth ___ an alternative supplier, given the recurring delays.",
      ["might", "may", "considering", "to consider", "consider", "worth"],
      ["might","to consider"],
      "Hedging: might be worth + to consider."),
    q_listen("C1-5", 4, 3, 120, "🔊", "Listen and choose the implied message.",
      "I see where you’re coming from, but I’m not entirely convinced this will scale.",
      ["The speaker fully agrees.", "The speaker politely disagrees and doubts scalability.", "The speaker is angry.", "The speaker changes the topic."], 1,
      "Polite disagreement: “not entirely convinced.”"),

    // C2
    q_reform("C2-1", 5, 4, 140, "🧠", "Choose the most precise paraphrase.",
      "We need to streamline the workflow without compromising quality.",
      ["We should optimise the process while maintaining standards.", "We should work faster and ignore mistakes.", "We should stop working.", "We should compromise quality."], 0,
      "Streamline without compromising = optimise while maintaining standards."),
    q_mcq("C2-2", 5, 4, 150, "🧾", "Choose the best option (subtle grammar).",
      "It’s high time we ____ this policy.",
      ["revised", "revise", "have revised", "are revising"], 0,
      "“It’s high time” + past simple (subjunctive-like): revised."),
    q_para("C2-3", 5, 4, 160, "🧱", "Order the paragraph plan for a persuasive email.",
      ["State the purpose and context.", "Provide evidence and impact.", "Propose a clear solution.", "End with a call to action and thanks."],
      [0,1,2,3],
      "Classic persuasion structure: context → evidence → solution → call to action."),
    q_read("C2-4", 5, 4, 170, "📄", "Read and choose the best interpretation.",
      "The pilot was broadly successful, though the findings should be treated with caution given the small sample size and the self-selection bias.",
      "What does the author mean?",
      ["The pilot failed completely.", "The pilot succeeded, but the results may not generalise.", "The sample size was large.", "Bias is impossible here."],
      1,
      "Success, but limited reliability due to sample + bias."),
    q_listen("C2-5", 5, 4, 160, "🎧", "Listen and choose the best conclusion.",
      "Unless we address the root cause, we’ll keep firefighting symptoms and seeing the same issues resurface.",
      ["Fixing the root cause prevents repeated problems.", "Ignore the root cause.", "Firefighting is efficient.", "Issues will disappear on their own."],
      0,
      "Root cause vs symptoms: address cause to stop repeating issues."),


    // ---- MORE ITEMS (to reduce repeats in 35/50-question sims) ----

    // A1 extras
    q_mcq("A1-6", 0, 1, 35, "🏢", "Choose the correct option: “There ____ a reception desk.”", ["is", "are", "am", "be"], 0,
      "Singular: there is."),
    q_cloze("A1-7", 0, 1, 35, "🔤", "Complete: “Could you ____ your last name, please?”", ["spell"], ["spell"], "In service situations, we often ask people to <b>spell</b> names."),
    q_order("A1-8", 0, 1, 45, "❓", "Put the question in order.", ["What", "is", "your", "name", "?"], "What is your name ?", "Basic question word order."),
    q_read("A1-9", 0, 1, 45, "📌", "Read the notice and choose the correct answer.",
      "Notice\n\nThe office is closed today.\nPlease come back tomorrow.\nThank you.",
      "When is the office closed?",
      ["Tomorrow", "Today", "Every day", "Next week"], 1,
      "It says: “The office is closed today.”"),
    q_listen("A1-10", 0, 1, 45, "🔊", "Listen and choose the correct answer.",
      "Please spell your email address.",
      ["They want you to say your password.", "They want you to spell your email address.", "They want you to leave.", "They want you to pay now."], 1,
      "Spell = say each letter."),

    // A2 extras
    q_mcq("A2-6", 1, 1, 45, "⏰", "Choose the correct preposition: “The call is ____ 3 p.m.”", ["at", "on", "in", "to"], 0,
      "We use <b>at</b> with clock times."),
    q_cloze("A2-7", 1, 1, 55, "✉️", "Complete: “I look forward to ____ from you.”", ["hearing"], ["hearing"], "Common email phrase: look forward to hearing from you."),
    q_reform("A2-8", 1, 1, 55, "🤝", "Choose the more polite option.",
      "Can you help me?",
      ["Could you help me, please?", "Help me now.", "You help me?", "You can help me yesterday?"], 0,
      "Use <b>could</b> + please for polite requests."),
    q_read("A2-9", 1, 1, 65, "📩", "Read and choose the best answer.",
      "Subject: Change of time\n\nHello,\nSorry, I can’t meet at 9:00. Can we meet at 11:00 instead?\nThanks.",
      "What does the sender want?",
      ["To cancel the meeting", "To change the meeting time to 11:00", "To meet at 9:00", "To meet next week"], 1,
      "They propose 11:00 instead."),
    q_listen("A2-10", 1, 1, 60, "🎧", "Listen and choose the correct number.",
      "My reference number is two five eight nine.",
      ["2589", "2859", "2598", "2895"], 0,
      "Two-five-eight-nine = 2589."),

    // B1 extras
    q_mcq("B1-6", 2, 2, 70, "📤", "Choose the correct option: “I ____ the email yesterday.”", ["sent", "have sent", "send", "am sending"], 0,
      "A finished time in the past (yesterday) → past simple: sent."),
    q_bank("B1-7", 2, 2, 85, "🙏", "Complete the message politely.",
      "Hi ___,\n\nI’m sorry for the delay. I ___ send the file by 4 p.m.\nPlease let me know if you ___ anything else.\n\nBest,\nMaya",
      ["will", "can", "need", "are", "could", "Alex"],
      ["Alex","will","need"],
      "Apology + promise + offer help."),
    q_order("B1-8", 2, 2, 80, "❓", "Put the words in order (polite question).",
      ["Could", "you", "please", "repeat", "that", "?"], "Could you please repeat that ?", "Polite request."),
    q_read("B1-9", 2, 2, 90, "🔐", "Read and choose the best answer.",
      "Subject: Login issue\n\nHi,\nI can’t access my account. I reset my password, but it still doesn’t work. Can someone help?\nThanks,\nJamie",
      "What is the problem?",
      ["Jamie forgot the meeting time", "Jamie can’t access the account even after resetting the password", "Jamie needs a new computer", "Jamie wants to cancel the account"], 1,
      "They reset the password but still can’t access."),
    q_listen("B1-10", 2, 2, 85, "🔊", "Listen and choose the key action.",
      "Please update the spreadsheet and send it to me before noon.",
      ["Print the spreadsheet", "Update it and send it before noon", "Delete the file", "Wait until tomorrow"], 1,
      "Action + deadline: update and send before noon."),

    // B2 extras
    q_cloze("B2-6", 3, 2, 95, "🧾", "Complete (formal): “I’d appreciate it if you could ____ receipt of this email.”", ["confirm"], ["confirm"], "Common formal phrase: confirm receipt."),
    q_reform("B2-7", 3, 2, 100, "🧑‍💼", "Choose the most diplomatic message.",
      "Your document is wrong.",
      ["There seem to be a few inaccuracies in the document.", "This is totally wrong.", "You did it badly.", "Wrong document."], 0,
      "B2 diplomacy: soften with “seem” + “a few”."),
    q_mcq("B2-8", 3, 2, 95, "🧩", "Choose the correct structure: “Not only ____ the deadline, but we also reduced costs.”",
      ["did we meet", "we met", "we did meet", "met we"], 0,
      "Inversion after “Not only”: did we meet."),
    q_read("B2-9", 3, 2, 110, "📄", "Read and choose the best answer.",
      "Policy update:\n\nAll expense reports must be submitted within 10 days. Reports received after that may be rejected unless you provide a justification.",
      "What happens if you submit late?",
      ["It is always accepted", "It may be rejected unless you justify it", "It is automatically approved", "You receive a bonus"], 1,
      "Late reports may be rejected unless justified."),
    q_para("B2-10", 3, 2, 115, "🧱", "Order these parts of a complaint reply.",
      ["Offer a solution.", "Acknowledge the issue.", "Invite further contact.", "Close politely."],
      [1,0,2,3],
      "Acknowledge → solution → invitation → close."),

    // C1 extras
    q_mcq("C1-6", 4, 3, 120, "🧠", "Choose the best option: “Had we known earlier, we ____ acted differently.”",
      ["would have", "will have", "have", "would"], 0,
      "Third conditional: would have + past participle."),
    q_cloze("C1-7", 4, 3, 120, "🧷", "Complete the collocation: “to ____ a concern.”", ["raise"], ["raise"], "Common collocation: raise a concern / raise an issue."),
    q_reform("C1-8", 4, 3, 125, "🤝", "Choose the closest meaning (polite disagreement).",
      "I’m not sure I share that perspective.",
      ["I don’t fully agree with you.", "I agree completely.", "I have no opinion.", "I didn’t hear you."], 0,
      "Polite disagreement without being confrontational."),
    q_read("C1-9", 4, 3, 130, "🔒", "Read and choose the best answer.",
      "Internal note:\n\nPlease avoid sharing client data via personal email accounts. Use the secure drive instead, and double-check access permissions before sending links.",
      "What is the main instruction?",
      ["Share data freely", "Use secure tools and check permissions", "Stop working with clients", "Use personal email for speed"], 1,
      "Secure drive + permissions are emphasised."),
    q_listen("C1-10", 4, 3, 125, "🎧", "Listen and choose the action item.",
      "Let’s table this for now and revisit it once we have the updated figures.",
      ["Decide immediately", "Postpone and revisit after updated figures", "Cancel the project", "Ignore the figures"], 1,
      "Table for now = postpone."),

    // C2 extras
    q_mcq("C2-6", 5, 4, 160, "🧠", "Choose the correct option: “Rarely ____ such a thorough audit.”",
      ["have I seen", "I have seen", "I saw have", "seen I have"], 0,
      "Negative adverb fronting → inversion: have I seen."),
    q_cloze("C2-7", 5, 4, 155, "🧾", "Complete: “____ and large, the rollout met expectations.”", ["by"], ["by"], "Fixed expression: <b>By and large</b> = generally."),
    q_reform("C2-8", 5, 4, 165, "🎯", "Choose the most nuanced paraphrase.",
      "We’re open to revisiting the terms, provided the overall scope remains unchanged.",
      ["We can reconsider the terms as long as the scope stays the same.", "We will change everything.", "We refuse to negotiate.", "We will reduce the scope."], 0,
      "Nuance: conditional flexibility."),
    q_read("C2-9", 5, 4, 175, "📄", "Read and choose the best conclusion.",
      "While the short-term metrics look encouraging, they may be masking structural weaknesses that could surface under sustained demand.",
      "What does this imply?",
      ["Everything is permanently solved.", "Good results now may hide deeper problems later.", "Demand will stop.", "Metrics are meaningless."], 1,
      "Short-term success can hide structural issues."),
    q_para("C2-10", 5, 4, 170, "🧱", "Order the elements of an executive summary.",
      ["Highlight key risk and mitigation.", "State objective and scope.", "Summarise key findings.", "Recommend next steps."],
      [1,2,0,3],
      "Objective/scope → findings → risk/mitigation → next steps.")

  ];

  // ------- Question constructors -------
  function q_mcq(id, level, points, timeSec, ico, prompt, options, answerIdx, explain) {
    return { id, type: "mcq", level, points, timeSec, ico, prompt, options, answerIdx, explain };
  }
  function q_cloze(id, level, points, timeSec, ico, prompt, accepted, aliases, explain) {
    return { id, type: "cloze", level, points, timeSec, ico, prompt, accepted, aliases, explain };
  }
  function q_bank(id, level, points, timeSec, ico, prompt, text, bank, answers, explain) {
    return { id, type: "bank", level, points, timeSec, ico, prompt, text, bank, answers, explain };
  }
  function q_order(id, level, points, timeSec, ico, prompt, words, solution, explain) {
    return { id, type: "order", level, points, timeSec, ico, prompt, words, solution, explain };
  }
  function q_para(id, level, points, timeSec, ico, prompt, items, orderIdx, explain) {
    return { id, type: "para", level, points, timeSec, ico, prompt, items, orderIdx, explain };
  }
  function q_listen(id, level, points, timeSec, ico, prompt, audioText, options, answerIdx, explain) {
    return { id, type: "listen", level, points, timeSec, ico, prompt, audioText, options, answerIdx, explain, listensMax: 2 };
  }
  function q_read(id, level, points, timeSec, ico, prompt, passage, question, options, answerIdx, explain) {
    return { id, type: "read", level, points, timeSec, ico, prompt, passage, question, options, answerIdx, explain };
  }
  function q_reform(id, level, points, timeSec, ico, prompt, source, options, answerIdx, explain) {
    return { id, type: "reform", level, points, timeSec, ico, prompt, source, options, answerIdx, explain };
  }

  // ---------- Adaptive selection ----------
  function bankByLevel(levelIdx) {
    // pick items near current level (±1), plus a few mixed
    const near = BANK.filter(q => Math.abs(q.level - levelIdx) <= 1);
    const fallback = BANK.slice();
    return (near.length >= 8 ? near : fallback);
  }

  // ---------- State ----------
  const state = {
    tab: "exam",
    target: "B1",  // or "auto"
    scenario: "general",
    length: 50,

    running: false,
    paused: false,
    idx: 0,
    total: 50,
    score: 0,
    streak: 0,
    levelIdx: 2, // start at B1
    asked: new Set(),
    tracker: { answered: 0, correct: 0, totalWeight: 0, weightedLevel: 0, accuracy: 0 },

    timer: { t0: 0, left: 0, total: 0, id: null },
    current: null,
    listenCount: 0,

    // builder
    builderType: "mixed",
  };

  // ---------- UI helpers ----------
  function banner(msg, isWarn = false) {
    const b = $("#banner");
    if (!b) { console.warn("Banner:", msg); return; }
    b.classList.add("is-on");
    b.innerHTML = msg;
    if (isWarn) b.style.borderColor = "rgba(200,0,0,0.25)";
    else b.style.borderColor = "rgba(0,0,0,0.10)";
  }
  function clearBanner() {
    const b = $("#banner");
    if (!b) return;
    b.classList.remove("is-on");
    b.innerHTML = "";
    b.style.borderColor = "rgba(0,0,0,0.10)";
  }
  function renderAccentPill() {
    const pill = $("#accentPill");
    if (!pill) return;
    pill.textContent = accent ? `Accent: ${accentLabel(accent)}` : "Accent: American English (US)";
  }

  // ---------- Modal ----------
  function openAccentModal() {
    const m = $("#accentModal");
    if (!m) return;
    m.classList.add("is-open");
    m.hidden = false;
    stopSpeaking();
  }
  function closeAccentModal() {
    const m = $("#accentModal");
    if (!m) return;
    m.classList.remove("is-open");
    m.hidden = true;
  }
  function setAccent(a) {
    accent = a;
    try { localStorage.setItem(ACCENT_KEY, a); } catch {}
    closeAccentModal();
    renderAccentPill();
    banner(`Accent set to <b>${accentLabel(a)}</b>.`, false);
    setTimeout(clearBanner, 1200);
  }

  // ---------- Timer ----------
  function stopTimer() {
    if (state.timer.id) clearInterval(state.timer.id);
    state.timer.id = null;
  }
  function startTimer(seconds) {
    stopTimer();
    state.timer.total = seconds;
    state.timer.left = seconds;
    state.timer.t0 = Date.now();
    updateTimeUI();

    state.timer.id = setInterval(() => {
      if (!state.running || state.paused) return;
      state.timer.left -= 0.2;
      if (state.timer.left <= 0) {
        state.timer.left = 0;
        updateTimeUI();
        stopTimer();
        // auto-timeout = incorrect, move on
        timeoutCurrent();
        return;
      }
      updateTimeUI();
    }, 200);
  }

  function updateTimeUI() {
    const fill = $("#timebarFill");
    const timeEl = $("#timeText");
    if (!fill || !timeEl) return;

    const pct = state.timer.total ? (state.timer.left / state.timer.total) : 1;
    fill.style.width = `${Math.max(0, Math.min(1, pct)) * 100}%`;

    // Subtle urgency indicator (opacity shift)
    if (pct > 0.6) fill.style.background = "rgba(0,0,0,0.18)";
    else if (pct > 0.3) fill.style.background = "rgba(0,0,0,0.28)";
    else fill.style.background = "rgba(200,0,0,0.35)";

    timeEl.textContent = state.running ? `Time left: ${Math.ceil(state.timer.left)}s` : "Time: —";
  }

  function setHud(show) {
    const hud = $("#hud");
    if (!hud) return;
    hud.hidden = !show;
  }

  function updateHud() {
    safeSetText("#hudProgress", `Question ${state.idx + 1} / ${state.total}`);
    safeSetText("#hudLevel", `Difficulty: ${LEVELS[state.levelIdx]}`);
    safeSetText("#hudScore", `Score: ${state.score}`);
    safeSetText("#hudEst", `Estimate: ${estimateLevel(state.tracker)}`);
  }

  // ---------- Selection ----------
  function pickNextQuestion() {
    const pool = shuffle(bankByLevel(state.levelIdx));
    const pick = pool.find(q => !state.asked.has(q.id)) || pool[0];
    state.asked.add(pick.id);
    state.current = JSON.parse(JSON.stringify(pick)); // clone
    state.listenCount = 0;
    return state.current;
  }

  // ---------- Scoring / adaptivity ----------
  function registerAnswer(isCorrect) {
    const q = state.current;
    const weight = 1 + q.level * 0.25;
    state.tracker.answered += 1;
    if (isCorrect) state.tracker.correct += 1;
    state.tracker.totalWeight += weight;
    if (isCorrect) state.tracker.weightedLevel += q.level * weight;
    state.tracker.accuracy = state.tracker.correct / state.tracker.answered;

    if (isCorrect) {
      state.score += q.points;
      state.streak += 1;
      if (state.target === "auto") {
        if (state.streak >= 2) state.levelIdx = clamp(state.levelIdx + 1, 0, 5);
      }
    } else {
      state.streak = 0;
      if (state.target === "auto") state.levelIdx = clamp(state.levelIdx - 1, 0, 5);
    }
  }

  function fixedTargetIdx() {
    return state.target === "auto" ? null : (LEVEL_INDEX[state.target] ?? 2);
  }

  // ---------- Rendering ----------
  function render() {
    renderAccentPill();
    const view = $("#view");
    view.innerHTML = "";
    const tab = state.tab;

    // Show/hide length selector for oral/tech
    $("#lengthBlock").style.display = (tab === "exam") ? "grid" : "none";
    if (tab === "exam") view.append(renderExamHome());
    if (tab === "builder") view.append(renderBuilder());
    if (tab === "oral") view.append(renderOral());
    if (tab === "tech") view.append(renderTech());

    renderEmojiSVG(view);
  }

  // ---------- Exam mode ----------
  function renderExamHome() {
    const root = el("div", { class: "se-panel" });

    if (!state.running) {
      setHud(false);
      root.append(
        el("h2", {}, [document.createTextNode("Exam simulation (adaptive)")] ),
        el("p", { class:"se-note" }, [document.createTextNode("Mixed tasks, timed questions, and adaptive difficulty. Designed to feel similar to the written part.")]),
        el("div", { class:"se-controls" }, [
          el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => startExam() }, [document.createTextNode("▶ Start simulation")]),
          el("button", { class:"se-btn", type:"button", onclick: () => demoOne() }, [document.createTextNode("⚡ Try 3-question demo")]),
          el("button", { class:"se-btn", type:"button", onclick: () => renderPreviewTasks() }, [document.createTextNode("👀 See task types")]),
        ]),
        el("div", { class:"se-grid", style:"margin-top:1rem;" }, [
          infoCard("✅ What’s trained", ["Vocabulary & grammar", "Reformulation", "Reading comprehension", "Listening (2 plays)", "Logic/order tasks"]),
          infoCard("⏱️ Timing training", ["A time bar per question", "Practice staying calm under time", "Pause / quit options for training"]),
          infoCard("🎯 Adaptive logic", ["Auto mode: difficulty moves up/down", "Target mode: stays around chosen level", "A provisional level estimate at the end"]),
        ])
      );
    } else {
      setHud(true);
      updateHud();
      root.append(renderQuestionCard(state.current));
    }

    return root;
  }

  function infoCard(title, bullets) {
    return el("div", { class:"se-panel" }, [
      el("h2", {}, [document.createTextNode(title)]),
      el("ul", { style:"margin:.3rem 0 0; padding-left: 1.15rem; opacity:.9; line-height:1.45;" },
        bullets.map(b => el("li", {}, [document.createTextNode(b)])))
    ]);
  }

  function startExam() {
    clearBanner();
    state.running = true;
    state.paused = false;
    state.idx = 0;
    state.score = 0;
    state.streak = 0;
    state.asked = new Set();
    state.tracker = { answered: 0, correct: 0, totalWeight: 0, weightedLevel: 0, accuracy: 0 };
    state.total = state.length;

    const fixed = fixedTargetIdx();
    state.levelIdx = fixed !== null ? fixed : 2; // start B1 if auto

    state.current = pickNextQuestion();
    startTimer(timeFor(state.current));
    updateHud();
    render();
  }

  function demoOne() {
    state.length = 3;
    $("#lengthSelect").value = "10";
    startExam();
    state.total = 3;
    updateHud();
  }

  function renderPreviewTasks() {
    banner("Task types: MCQ, cloze, word bank, ordering, reading MCQ, listening MCQ. In the builder mode you can practise each type.", false);
    setTimeout(clearBanner, 3500);
  }

  function timeFor(q) {
    // Training timing: scale a bit with level
    const base = q.timeSec || 60;
    return clamp(base + (q.level * 8), 25, 180);
  }

  function pauseToggle() {
    state.paused = !state.paused;
    $("#pauseBtn").textContent = state.paused ? "▶ Resume" : "⏸ Pause";
    if (state.paused) banner("Paused.", false);
    else clearBanner();
  }

  function quitExam() {
    state.running = false;
    state.paused = false;
    stopTimer();
    setHud(false);
    const est = estimateLevel(state.tracker);
    banner(`Simulation ended. Provisional estimate: <b>${est}</b> (training estimate).`, false);
    render();
  }

  function timeoutCurrent() {
    // Treat timeout as incorrect
    showFeedback(false, "Time is up.");
    registerAnswer(false);
    nextQuestionAfter(900);
  }

  function nextQuestionAfter(ms = 700) {
    stopTimer();
    setTimeout(() => {
      state.idx += 1;
      if (state.idx >= state.total) {
        finishExam();
        return;
      }

      const fixed = fixedTargetIdx();
      if (fixed !== null) state.levelIdx = fixed; // hold near target
      state.current = pickNextQuestion();
      startTimer(timeFor(state.current));
      updateHud();
      render();
    }, ms);
  }

  function finishExam() {
    stopTimer();
    state.running = false;
    state.paused = false;
    setHud(false);

    const est = estimateLevel(state.tracker);
    const acc = Math.round(state.tracker.accuracy * 100);
    const panel = el("div", { class:"se-panel" }, [
      el("h2", {}, [document.createTextNode("✅ Simulation complete")]),
      el("p", { class:"se-note", html: `Accuracy: <b>${acc}%</b> · Training estimate: <b>${est}</b> · Points: <b>${state.score}</b>` }),
      el("div", { class:"se-controls" }, [
        el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => startExam() }, [document.createTextNode("▶ Restart")]),
        el("button", { class:"se-btn", type:"button", onclick: () => { state.tab = "oral"; $("#tabSelect").value = "oral"; render(); } }, [document.createTextNode("🎙️ Practise oral interview")]),
        el("button", { class:"se-btn", type:"button", onclick: () => { state.tab = "builder"; $("#tabSelect").value = "builder"; render(); } }, [document.createTextNode("🧩 Practise task types")]),
      ]),
      el("div", { class:"se-feedback good", style:"margin-top:1rem;" }, [
        el("div", { class:"se-qtitle" }, [document.createTextNode("Coaching tip")]),
        el("p", { class:"se-note" }, [document.createTextNode("In an adaptive test, it’s normal to meet questions that feel above your level. Focus on pace + clarity, not perfection.")])
      ])
    ]);

    $("#view").innerHTML = "";
    $("#view").append(panel);
    renderEmojiSVG($("#view"));
  }

  // ---------- Question rendering ----------
  function showFeedback(isCorrect, msgHtml, explainHtml = "") {
    const box = $("#feedbackBox");
    if (!box) return;
    box.className = "se-feedback " + (isCorrect ? "good" : "bad");
    box.innerHTML = `<div class="se-qtitle">${isCorrect ? "✅ Correct" : "❌ Not quite"}</div>
      <div class="se-note">${msgHtml}</div>
      ${explainHtml ? `<div class="se-note" style="margin-top:.35rem;">${explainHtml}</div>` : ""}`;
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderQuestionCard(q) {
    const header = el("div", { class:"se-qhead" }, [
      el("p", { class:"se-qtitle" }, [document.createTextNode(taskTitle(q))]),
      el("div", { class:"se-qmeta" }, [
        el("span", { class:"se-badge" }, [document.createTextNode(LEVELS[q.level])]),
        el("span", { class:"se-badge" }, [document.createTextNode(`${q.points} pts`)]),
      ])
    ]);

    const prompt = el("div", { class:"se-qprompt" }, [
      el("span", { class:"ico" }, [document.createTextNode(q.ico || "🧪")]),
      el("div", {}, [el("div", { html: q.prompt })])
    ]);

    const body = el("div", {});
    if (q.type === "mcq") body.append(renderMCQ(q));
    if (q.type === "cloze") body.append(renderCloze(q));
    if (q.type === "bank") body.append(renderBank(q));
    if (q.type === "order") body.append(renderOrder(q));
    if (q.type === "para") body.append(renderPara(q));
    if (q.type === "listen") body.append(renderListen(q));
    if (q.type === "read") body.append(renderRead(q));
    if (q.type === "reform") body.append(renderReform(q));

    const feedback = el("div", { id:"feedbackBox", class:"se-feedback", html:"<div class='se-note'>Answer to see feedback.</div>" });

    const card = el("article", { class:"se-qcard" }, [header, prompt, body, feedback]);
    return card;
  }

  function taskTitle(q) {
    const map = {
      mcq: "Multiple choice",
      cloze: "Fill the gap",
      bank: "Word bank",
      order: "Order the words",
      para: "Order the steps",
      listen: "Listening comprehension",
      read: "Reading comprehension",
      reform: "Reformulation",
    };
    return map[q.type] || "Task";
  }

  // ----- MCQ
  function lockButtons(root) { $$(".se-opt", root).forEach(b => b.disabled = true); }

  function renderMCQ(q) {
    const wrap = el("div", {});
    const opts = el("div", { class:"se-options" });
    q.options.forEach((txt, idx) => {
      opts.append(el("button", {
        class:"se-opt",
        type:"button",
        onclick: () => {
          if (!state.running || state.paused) return;
          lockButtons(wrap);
          const correct = idx === q.answerIdx;
          const buttons = $$(".se-opt", wrap);
          buttons.forEach((b, i) => {
            if (i === q.answerIdx) b.classList.add("is-correct");
            if (i === idx && !correct) b.classList.add("is-wrong");
          });
          registerAnswer(correct);
          showFeedback(correct, correct ? "Good choice." : "That option does not fit.", q.explain || "");
          nextQuestionAfter(850);
        }
      }, [document.createTextNode(txt)]));
    });
    wrap.append(opts);
    return wrap;
  }

  // ----- Cloze (typed)
  function norm(s) { return String(s || "").trim().toLowerCase().replace(/\s+/g, " "); }

  function renderCloze(q) {
    const wrap = el("div", {});
    const input = el("input", { class:"se-input", placeholder:"Type your answer", "aria-label":"Type your answer" });
    const check = el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => {
      if (!state.running || state.paused) return;
      const val = norm(input.value);
      const ok = q.aliases.map(norm).includes(val);
      input.disabled = true;
      check.disabled = true;
      registerAnswer(ok);
      showFeedback(ok, ok ? "Correct." : `Accepted answer(s): <b>${q.accepted.join(", ")}</b>`, q.explain || "");
      nextQuestionAfter(900);
    } }, [document.createTextNode("Check")]);

    const controls = el("div", { class:"se-controls" }, [
      check,
      el("button", { class:"se-btn", type:"button", onclick: () => { input.value=""; input.focus(); } }, [document.createTextNode("Reset")])
    ]);

    wrap.append(input, controls);
    return wrap;
  }

  // ----- Word bank (click-to-fill blanks; faster than drag, still trains same)
  function renderBank(q) {
    const wrap = el("div", {});
    const parts = q.text.split("___");
    const blanks = q.answers.length;

    const filled = new Array(blanks).fill("");
    let active = 0;

    const line = el("div", { class:"se-feedback", style:"background:rgba(255,255,255,0.98);" });
    function renderLine() {
      line.innerHTML = "";
      for (let i = 0; i < parts.length; i++) {
        line.append(document.createTextNode(parts[i]));
        if (i < blanks) {
          const b = el("span", { class:"se-blank", "data-i": String(i), title:"Click to select blank" }, [document.createTextNode(filled[i] || "___")]);
          if (i === active) b.style.outline = "3px solid rgba(0,0,0,0.10)";
          b.addEventListener("click", () => { active = i; renderLine(); });
          line.append(b);
        }
      }
    }
    renderLine();

    const bank = el("div", { class:"se-bank" });
    shuffle(q.bank).forEach(word => {
      const chip = el("span", { class:"se-chip" }, [document.createTextNode(word)]);
      chip.addEventListener("click", () => {
        if (!state.running || state.paused) return;
        filled[active] = word;
        active = (active + 1) % blanks;
        renderLine();
      });
      bank.append(chip);
    });

    const check = el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => {
      if (!state.running || state.paused) return;
      const ok = filled.map(norm).join("|") === q.answers.map(norm).join("|");
      registerAnswer(ok);
      showFeedback(ok,
        ok ? "Great." : `Expected: <b>${q.answers.join(", ")}</b>`,
        q.explain || ""
      );
      nextQuestionAfter(950);
    }}, [document.createTextNode("Check")]);

    const controls = el("div", { class:"se-controls" }, [
      check,
      el("button", { class:"se-btn", type:"button", onclick: () => { for (let i=0;i<filled.length;i++) filled[i]=""; active=0; renderLine(); } }, [document.createTextNode("Reset")]),
    ]);

    wrap.append(line, el("p", { class:"se-note", html:"Click a blank, then click a word. (Fast practice, exam-style.)" }), bank, controls);
    return wrap;
  }

  // ----- Order words
  function renderOrder(q) {
    const wrap = el("div", {});
    let order = shuffle(q.words);
    const box = el("div", { class:"se-order" });

    function draw() {
      box.innerHTML = "";
      order.forEach((w, idx) => {
        const chip = el("span", { class:"se-chip", draggable:"true" }, [document.createTextNode(w)]);
        chip.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", String(idx));
          e.dataTransfer.effectAllowed = "move";
        });
        chip.addEventListener("dragover", (e) => e.preventDefault());
        chip.addEventListener("drop", (e) => {
          e.preventDefault();
          const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
          const to = idx;
          if (Number.isFinite(from)) {
            const a = order.slice();
            const [m] = a.splice(from, 1);
            a.splice(to, 0, m);
            order = a;
            draw();
          }
        });
        box.append(chip);
      });
    }
    draw();

    const check = el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => {
      if (!state.running || state.paused) return;
      const attempt = order.join(" ");
      const ok = norm(attempt) === norm(q.solution);
      registerAnswer(ok);
      showFeedback(ok,
        ok ? "Nice word order." : `Correct: <b>${q.solution}</b>`,
        q.explain || ""
      );
      nextQuestionAfter(1000);
    }}, [document.createTextNode("Check")]);

    const controls = el("div", { class:"se-controls" }, [
      check,
      el("button", { class:"se-btn", type:"button", onclick: () => { order = shuffle(q.words); draw(); } }, [document.createTextNode("Shuffle")]),
    ]);

    wrap.append(box, controls);
    return wrap;
  }

  // ----- Order steps / paragraphs
  function renderPara(q) {
    const wrap = el("div", {});
    let order = shuffle(q.items.map((t, i) => ({ t, i })));
    const box = el("div", { class:"se-order" });

    function draw() {
      box.innerHTML = "";
      order.forEach((item, idx) => {
        const chip = el("div", { class:"se-drop", draggable:"true" }, [
          el("span", {}, [document.createTextNode(item.t)]),
          el("span", { class:"se-badge" }, [document.createTextNode(`#${idx + 1}`)])
        ]);
        chip.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", String(idx));
          e.dataTransfer.effectAllowed = "move";
        });
        chip.addEventListener("dragover", (e) => e.preventDefault());
        chip.addEventListener("drop", (e) => {
          e.preventDefault();
          const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
          const to = idx;
          if (Number.isFinite(from)) {
            const a = order.slice();
            const [m] = a.splice(from, 1);
            a.splice(to, 0, m);
            order = a;
            draw();
          }
        });
        box.append(chip);
      });
    }
    draw();

    const check = el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => {
      if (!state.running || state.paused) return;
      const attempt = order.map(o => o.i);
      const ok = attempt.join(",") === q.orderIdx.join(",");
      registerAnswer(ok);
      showFeedback(ok,
        ok ? "Logical order." : `One good order is: <b>${q.orderIdx.map(i => i+1).join(" → ")}</b>`,
        q.explain || ""
      );
      nextQuestionAfter(1100);
    }}, [document.createTextNode("Check")]);

    wrap.append(el("p", { class:"se-note", html:"Drag the boxes to reorder." }), box, el("div", { class:"se-controls" }, [
      check,
      el("button", { class:"se-btn", type:"button", onclick: () => { order = shuffle(q.items.map((t,i)=>({t,i}))); draw(); } }, [document.createTextNode("Shuffle")]),
    ]));
    return wrap;
  }

  // ----- Listening (TTS, max 2 listens)
  function renderListen(q) {
    const wrap = el("div", {});
    const listensLeft = () => q.listensMax - state.listenCount;

    const audioRow = el("div", { class:"se-audio" }, [
      el("span", { class:"se-pill" }, [document.createTextNode(`Plays left: ${listensLeft()}`)]),
      el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => {
        if (!accent) return openAccentModal();
        if (state.paused || !state.running) return;
        if (state.listenCount >= q.listensMax) return;
        state.listenCount += 1;
        audioRow.querySelector(".se-pill").textContent = `Plays left: ${listensLeft()}`;
        speak(q.audioText, accentLang(accent));
      }}, [document.createTextNode("🔊 Play")]),
      el("button", { class:"se-btn", type:"button", onclick: () => stopSpeaking() }, [document.createTextNode("⏹ Stop")]),
      el("button", { class:"se-btn", type:"button", onclick: () => speak(q.audioText, "en-US") }, [document.createTextNode("US")]),
      el("button", { class:"se-btn", type:"button", onclick: () => speak(q.audioText, "en-GB") }, [document.createTextNode("UK")]),
    ]);

    const opts = el("div", { class:"se-options" });
    q.options.forEach((txt, idx) => {
      opts.append(el("button", {
        class:"se-opt",
        type:"button",
        onclick: () => {
          if (!state.running || state.paused) return;
          lockButtons(wrap);
          const correct = idx === q.answerIdx;
          const buttons = $$(".se-opt", wrap);
          buttons.forEach((b, i) => {
            if (i === q.answerIdx) b.classList.add("is-correct");
            if (i === idx && !correct) b.classList.add("is-wrong");
          });
          registerAnswer(correct);
          showFeedback(correct, correct ? "Good listening." : "Not this one.", q.explain || "");
          nextQuestionAfter(1000);
        }
      }, [document.createTextNode(txt)]));
    });

    wrap.append(audioRow, opts);
    return wrap;
  }

  // ----- Reading
  function renderRead(q) {
    const wrap = el("div", {});
    const passage = el("pre", { class:"se-feedback", style:"white-space:pre-wrap;background:rgba(0,0,0,0.02);" }, [document.createTextNode(q.passage)]);
    const question = el("p", { class:"se-qtitle" }, [document.createTextNode(q.question)]);
    const opts = el("div", { class:"se-options" });

    q.options.forEach((txt, idx) => {
      opts.append(el("button", {
        class:"se-opt",
        type:"button",
        onclick: () => {
          if (!state.running || state.paused) return;
          lockButtons(wrap);
          const correct = idx === q.answerIdx;
          const buttons = $$(".se-opt", wrap);
          buttons.forEach((b, i) => {
            if (i === q.answerIdx) b.classList.add("is-correct");
            if (i === idx && !correct) b.classList.add("is-wrong");
          });
          registerAnswer(correct);
          showFeedback(correct, correct ? "Correct interpretation." : "Re-check the key detail.", q.explain || "");
          nextQuestionAfter(1100);
        }
      }, [document.createTextNode(txt)]));
    });

    wrap.append(passage, question, opts);
    return wrap;
  }

  // ----- Reformulation
  function renderReform(q) {
    const wrap = el("div", {});
    wrap.append(el("div", { class:"se-feedback", style:"background:rgba(0,0,0,0.02);" }, [
      el("div", { class:"se-qtitle" }, [document.createTextNode("Original")]),
      el("div", { class:"se-note" }, [document.createTextNode(q.source)]),
    ]));
    const opts = el("div", { class:"se-options" });
    q.options.forEach((txt, idx) => {
      opts.append(el("button", {
        class:"se-opt",
        type:"button",
        onclick: () => {
          if (!state.running || state.paused) return;
          lockButtons(wrap);
          const correct = idx === q.answerIdx;
          const buttons = $$(".se-opt", wrap);
          buttons.forEach((b, i) => {
            if (i === q.answerIdx) b.classList.add("is-correct");
            if (i === idx && !correct) b.classList.add("is-wrong");
          });
          registerAnswer(correct);
          showFeedback(correct, correct ? "Good reformulation." : "Not the closest meaning/register.", q.explain || "");
          nextQuestionAfter(1100);
        }
      }, [document.createTextNode(txt)]));
    });
    wrap.append(opts);
    return wrap;
  }

  // ---------- Builder mode ----------
  function renderBuilder() {
    setHud(false);
    stopTimer();

    const root = el("div", { class:"se-panel" }, [
      el("h2", {}, [document.createTextNode("Skill builder (practice by task type)")]),
      el("p", { class:"se-note" }, [document.createTextNode("Pick a task type and practise without the full exam pressure (still timed if you want).")]),
    ]);

    const typeSel = el("select", { class:"se-select", id:"builderType" }, [
      opt("mixed","Mixed practice"),
      opt("mcq","MCQ (grammar/vocab)"),
      opt("cloze","Fill the gap"),
      opt("bank","Word bank"),
      opt("order","Order words"),
      opt("para","Order steps"),
      opt("read","Reading MCQ"),
      opt("listen","Listening MCQ"),
      opt("reform","Reformulation"),
    ]);
    typeSel.value = state.builderType;
    typeSel.addEventListener("change", () => { state.builderType = typeSel.value; render(); });

    const pickBtn = el("button", { class:"se-btn se-btn--primary", type:"button", onclick: () => {
      clearBanner();
      state.running = true;
      state.paused = false;
      state.idx = 0;
      state.total = 1;
      state.score = 0;
      state.streak = 0;
      state.asked = new Set();
      state.tracker = { answered: 0, correct: 0, totalWeight: 0, weightedLevel: 0, accuracy: 0 };
      const fixed = fixedTargetIdx();
      state.levelIdx = fixed !== null ? fixed : 2;
      state.current = pickBuilderQuestion();
      startTimer(timeFor(state.current));
      setHud(true);
      updateHud();
      render();
    }}, [document.createTextNode("▶ Start 1 task")]);

    const row = el("div", { class:"se-controls" }, [
      el("span", { class:"se-badge" }, [document.createTextNode("Task type")]),
      typeSel,
      pickBtn,
      el("button", { class:"se-btn", type:"button", onclick: () => { state.running=false; state.paused=false; stopTimer(); setHud(false); render(); } }, [document.createTextNode("Stop")]),
    ]);

    root.append(row);

    root.append(el("div", { class:"se-grid", style:"margin-top:1rem;" }, [
      infoCard("Suggested routine (10–12h)", ["Warm-up (15 min): A2/B1 MCQ", "Reading + reformulation (20 min)", "Listening (10 min, 2 plays)", "Order tasks (10 min)", "Oral practice (10–15 min)"]),
      infoCard("Most common written traps", ["Prepositions (on/in/at)", "Tense choice (past vs present perfect)", "Polite forms (could/would)", "Word order in questions", "Register (too informal)"]),
    ]));

    return root;
  }

  function opt(val, label) {
    const o = document.createElement("option");
    o.value = val;
    o.textContent = label;
    return o;
  }

  function pickBuilderQuestion() {
    const type = state.builderType;
    let pool = BANK.slice();
    if (type !== "mixed") pool = pool.filter(q => q.type === type);
    const fixed = fixedTargetIdx();
    const levelIdx = fixed !== null ? fixed : state.levelIdx;
    pool = pool.filter(q => Math.abs(q.level - levelIdx) <= 1);
    if (pool.length === 0) pool = BANK.slice();
    return JSON.parse(JSON.stringify(shuffle(pool)[0]));
  }

  // ---------- Oral mode ----------
  function renderOral() {
    setHud(false);
    stopTimer();
    state.running = false;

    const root = el("div", { class:"se-panel" }, [
      el("h2", {}, [document.createTextNode("Oral interview practice (3 parts)")]),
      el("p", { class:"se-note", html: "Train the typical flow: <b>intro</b> → <b>role-play</b> → <b>discussion</b>. Use the timer and (optional) record button." }),
    ]);

    const blocks = el("div", { class:"se-grid", style:"margin-top:.75rem;" }, [
      oralIntroCard(),
      oralRoleplayCard(),
      oralDiscussionCard(),
    ]);

    root.append(blocks);
    return root;
  }

  function oralIntroCard() {
    const prompts = [
      "What is your job and what are your main tasks?",
      "Why are you taking this certification?",
      "Tell me about a typical working day.",
      "What tools or software do you use at work?",
    ];
    return oralCard("👤 Part 1 · Introduction (3–5 min)", prompts, 4*60);
  }

  function oralRoleplayCard() {
    const scen = {
      general: [
        "You need to ask a colleague for an update on a project.",
        "You must explain a delay and propose a new deadline.",
      ],
      hospitality: [
        "A guest complains their room is noisy. Apologise and propose solutions.",
        "A guest asks for late check-out. Check availability and confirm conditions.",
      ],
      it: [
        "A user cannot log in. Ask questions and give clear step-by-step instructions.",
        "A user reports slow Wi‑Fi. Suggest quick checks and escalate if needed.",
      ],
      sales: [
        "A client asks for a discount. Respond professionally and offer alternatives.",
        "A customer wants to return a product. Explain the policy politely.",
      ],
      hr: [
        "You are scheduling an interview. Propose times and confirm details.",
        "A candidate asks about remote work. Explain the company policy.",
      ],
      logistics: [
        "A shipment is delayed at customs. Explain the situation and next steps.",
        "You need missing delivery details. Ask for the correct reference numbers.",
      ],
    };
    return oralCard("🧑‍💼 Part 2 · Role-play (4–6 min)", scen[state.scenario] || scen.general, 6*60);
  }

  function oralDiscussionCard() {
    const topics = [
      "What are the advantages and disadvantages of remote work?",
      "How can companies improve customer satisfaction?",
      "Should AI tools be used at work? Why / why not?",
      "How do you manage stress and deadlines in your job?",
    ];
    return oralCard("💬 Part 3 · Discussion (4–6 min)", topics, 6*60);
  }

  function oralCard(title, prompts, seconds) {
    const box = el("div", { class:"se-panel" }, [
      el("h2", {}, [document.createTextNode(title)]),
      el("p", { class:"se-note" }, [document.createTextNode("Pick a prompt, speak for 60–90 seconds, then expand with examples.")]),
    ]);

    const sel = el("select", { class:"se-select" }, prompts.map(p => opt(p, p)));
    const timerPill = el("span", { class:"se-pill" }, [document.createTextNode("Timer: ready")]);

    let t = { id: null, left: seconds };
    function stop() { if (t.id) clearInterval(t.id); t.id = null; }
    function reset() { stop(); t.left = seconds; timerPill.textContent = "Timer: ready"; }
    function start() {
      stop();
      t.left = seconds;
      timerPill.textContent = `Time left: ${t.left}s`;
      t.id = setInterval(() => {
        t.left -= 1;
        timerPill.textContent = `Time left: ${t.left}s`;
        if (t.left <= 0) { stop(); timerPill.textContent = "Time: done"; }
      }, 1000);
    }

    // Optional recording (works on HTTPS like GitHub Pages)
    const rec = makeRecorderUI();

    box.append(
      el("div", { class:"se-controls" }, [
        el("span", { class:"se-badge" }, [document.createTextNode("Prompt")]),
        sel,
      ]),
      el("div", { class:"se-controls" }, [
        timerPill,
        el("button", { class:"se-btn se-btn--primary", type:"button", onclick: start }, [document.createTextNode("▶ Start")]),
        el("button", { class:"se-btn", type:"button", onclick: reset }, [document.createTextNode("Reset")]),
        el("button", { class:"se-btn", type:"button", onclick: () => { if (!accent) return openAccentModal(); speak(sel.value, accentLang(accent)); } }, [document.createTextNode("🔊 Hear the prompt")]),
      ]),
      rec
    );

    return box;
  }

  function makeRecorderUI() {
    // MediaRecorder is optional; if unsupported, show a note
    if (!("mediaDevices" in navigator) || !("MediaRecorder" in window)) {
      return el("div", { class:"se-feedback", html:"<b>Recording:</b> not supported in this browser. (You can still practise speaking with the timer.)" });
    }

    const wrap = el("div", { class:"se-feedback", style:"background:rgba(255,255,255,0.98);" }, [
      el("div", { class:"se-qtitle" }, [document.createTextNode("Optional: record yourself")]),
      el("p", { class:"se-note" }, [document.createTextNode("Click Record → speak → Stop → listen back. The file stays on your device (not uploaded).")]),
    ]);

    const status = el("p", { class:"se-note" }, [document.createTextNode("Status: idle")]);
    const audio = el("audio", { controls: "true", style:"width:100%; margin-top:.5rem;" });

    let mediaStream = null;
    let recorder = null;
    let chunks = [];

    const btnRec = el("button", { class:"se-btn se-btn--primary", type:"button" }, [document.createTextNode("⏺ Record")]);
    const btnStop = el("button", { class:"se-btn", type:"button", disabled:"true" }, [document.createTextNode("⏹ Stop")]);

    btnRec.addEventListener("click", async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder = new MediaRecorder(mediaStream);
        chunks = [];
        recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: chunks[0]?.type || "audio/webm" });
          audio.src = URL.createObjectURL(blob);
          status.textContent = "Status: recorded (play below)";
          try { mediaStream.getTracks().forEach(t => t.stop()); } catch {}
        };
        recorder.start();
        status.textContent = "Status: recording…";
        btnRec.disabled = true;
        btnStop.disabled = false;
      } catch (e) {
        status.textContent = "Status: microphone permission denied.";
      }
    });

    btnStop.addEventListener("click", () => {
      try { recorder.stop(); } catch {}
      btnRec.disabled = false;
      btnStop.disabled = true;
    });

    wrap.append(el("div", { class:"se-controls" }, [btnRec, btnStop]), status, audio);
    return wrap;
  }

  // ---------- Tech check ----------
  function renderTech() {
    setHud(false);
    stopTimer();
    state.running = false;

    const root = el("div", { class:"se-panel" }, [
      el("h2", {}, [document.createTextNode("Technical check (like the mini-test idea)")]),
      el("p", { class:"se-note" }, [document.createTextNode("This checks basics: text-to-speech, microphone, and webcam permission (optional).")]),
    ]);

    const ttsOk = ("speechSynthesis" in window);
    const recOk = ("mediaDevices" in navigator && "MediaRecorder" in window);
    const camOk = ("mediaDevices" in navigator);

    root.append(el("div", { class:"se-grid", style:"margin-top:.75rem;" }, [
      techCard("🔊 Listening", ttsOk, "Play a sample sentence in your chosen accent.", () => {
        if (!accent) return openAccentModal();
        speak("This is a technical check. If you can hear this sentence, audio is working.", accentLang(accent));
      }),
      techCard("🎙️ Microphone", recOk, "Request mic access (optional).", async () => {
        try { await navigator.mediaDevices.getUserMedia({ audio: true }); banner("Microphone access: OK ✅", false); setTimeout(clearBanner, 1400); }
        catch { banner("Microphone access denied.", true); }
      }),
      techCard("📷 Webcam", camOk, "Request webcam access (optional).", async () => {
        try { await navigator.mediaDevices.getUserMedia({ video: true }); banner("Webcam access: OK ✅", false); setTimeout(clearBanner, 1400); }
        catch { banner("Webcam access denied.", true); }
      }),
    ]));

    return root;
  }

  function techCard(title, ok, desc, onTest) {
    return el("div", { class:"se-panel" }, [
      el("h2", {}, [document.createTextNode(title)]),
      el("p", { class:"se-note", html: `${desc}<br><b>Status:</b> ${ok ? "Available ✅" : "Not available ⚠️"}` }),
      el("div", { class:"se-controls" }, [
        el("button", { class:"se-btn se-btn--primary", type:"button", onclick: onTest, disabled: ok ? null : "true" }, [document.createTextNode("Test")]),
      ])
    ]);
  }

  // ---------- Events wiring ----------
  function wireUI() {
    // Modal buttons
    const usBtn = $("#chooseUS");
    const ukBtn = $("#chooseUK");
    const changeBtn = $("#changeAccentBtn");
    const modal = $("#accentModal");

    if (usBtn) usBtn.addEventListener("click", () => setAccent("US"));
    if (ukBtn) ukBtn.addEventListener("click", () => setAccent("UK"));
    if (changeBtn) changeBtn.addEventListener("click", () => openAccentModal());

    if (modal) modal.addEventListener("click", (e) => {
      if (e.target && e.target.id === "accentModal") closeAccentModal();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAccentModal(); });

    // Controls
    const tabSel = $("#tabSelect");
    if (tabSel) tabSel.addEventListener("change", (e) => {
      state.tab = e.target.value;
      // stop any exam timer when switching
      stopTimer();
      state.running = false;
      state.paused = false;
      $("#pauseBtn").textContent = "⏸ Pause";
      render();
    });

    const targetSel = $("#targetSelect");
    if (targetSel) targetSel.addEventListener("change", (e) => {
      state.target = e.target.value;
      banner(`Target set to <b>${state.target}</b>.`, false);
      setTimeout(clearBanner, 1100);
    });

    const lenSel = $("#lengthSelect");
    if (lenSel) lenSel.addEventListener("change", (e) => {
      state.length = parseInt(e.target.value, 10);
    });

    const scenSel = $("#scenarioSelect");
    if (scenSel) scenSel.addEventListener("change", (e) => {
      state.scenario = e.target.value;
      if (state.tab === "oral") render();
    });

    const pauseBtn = $("#pauseBtn");
    if (pauseBtn) pauseBtn.addEventListener("click", () => pauseToggle());
    const quitBtn = $("#quitBtn");
    if (quitBtn) quitBtn.addEventListener("click", () => quitExam());
}

  function main() {
    // default values from selects
    state.tab = ($("#tabSelect") && $("#tabSelect").value) ? $("#tabSelect").value : "exam";
    state.target = ($("#targetSelect") && $("#targetSelect").value) ? $("#targetSelect").value : "B1";
    state.length = ($("#lengthSelect") && $("#lengthSelect").value) ? parseInt($("#lengthSelect").value, 10) : 50;
    state.scenario = ($("#scenarioSelect") && $("#scenarioSelect").value) ? $("#scenarioSelect").value : "general";

    wireUI();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
  else main();

})();