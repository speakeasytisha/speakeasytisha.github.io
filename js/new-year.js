(function () {
  "use strict";

  // --------------------
  // Helpers
  // --------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHTML(str) {
    return (str || "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // --------------------
  // State + scoring
  // --------------------
  const state = {
    studentName: "",
    pronoun: "she",
    voice: "us", // us | uk
    score: 0,
    attempts: 0,
    correct: 0,
    wrongLog: [],
    // prevent double scoring per item
    awarded: new Set(),
  };

  function updateScoreUI() {
    $("#totalScore").textContent = String(state.score);
    const pct = state.attempts === 0 ? 0 : Math.round((state.correct / state.attempts) * 100);
    $("#accuracyPct").textContent = `${pct}%`;
  }

  function addAttempt(ok) {
    state.attempts += 1;
    if (ok) state.correct += 1;
    updateScoreUI();
  }

  function award(key, points) {
    if (state.awarded.has(key)) return false;
    state.awarded.add(key);
    state.score += points;
    updateScoreUI();
    return true;
  }

  function logWrong(section, prompt, yourAnswer, correctAnswer, explanation) {
    state.wrongLog.push({ section, prompt, yourAnswer, correctAnswer, explanation });
  }

  function toastFeedback(el, ok, msg) {
    if (!el) return;
    el.classList.remove("good", "bad");
    el.classList.add(ok ? "good" : "bad");
    el.textContent = msg;
  }

  // --------------------
  // Voice (US/UK)
  // --------------------
  let voices = [];
  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoiceFor(accent) {
    if (!voices || voices.length === 0) return null;
    const want = accent === "uk" ? "en-GB" : "en-US";
    // strong match
    let v = voices.find(x => (x.lang || "").toLowerCase() === want.toLowerCase());
    if (v) return v;
    // partial match
    v = voices.find(x => (x.lang || "").toLowerCase().includes(want.toLowerCase()));
    if (v) return v;
    // fallback: any english
    v = voices.find(x => (x.lang || "").toLowerCase().startsWith("en"));
    return v || null;
  }

  function speak(text, accent) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoiceFor(accent || state.voice);
    if (v) u.voice = v;

    // small accent differences in pacing
    u.rate = (accent || state.voice) === "uk" ? 0.98 : 1.0;

    window.speechSynthesis.speak(u);
  }

  function stopSpeak() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  }

  function setVoice(accent) {
    state.voice = accent;
    $("#voiceUS").classList.toggle("is-active", accent === "us");
    $("#voiceUK").classList.toggle("is-active", accent === "uk");
  }

  // --------------------
  // Personalization
  // --------------------
  function getPronounPack(p) {
    if (p === "he") return { sub: "he", obj: "him", possAdj: "his" };
    if (p === "they") return { sub: "they", obj: "them", possAdj: "their" };
    return { sub: "she", obj: "her", possAdj: "her" };
  }

  function loadPersonalization() {
    try {
      $("#studentName").value = localStorage.getItem("ny_studentName") || "";
      $("#studentPronouns").value = localStorage.getItem("ny_pronoun") || "she";
      state.studentName = $("#studentName").value.trim();
      state.pronoun = $("#studentPronouns").value;
      const v = localStorage.getItem("ny_voice") || "us";
      setVoice(v === "uk" ? "uk" : "us");
    } catch (_) {}
  }

  function applyPersonalization() {
    state.studentName = ($("#studentName").value || "").trim();
    state.pronoun = $("#studentPronouns").value || "she";
    try {
      localStorage.setItem("ny_studentName", state.studentName);
      localStorage.setItem("ny_pronoun", state.pronoun);
    } catch (_) {}
    renderGrammarCards();
  }

  // --------------------
  // Vocabulary
  // --------------------
  const vocab = {
    celebration: [
      { emoji: "🎆", word: "fireworks", def: "bright explosions in the sky to celebrate", ex: "We watched fireworks at midnight." },
      { emoji: "⏳", word: "countdown", def: "counting down the last seconds before midnight", ex: "The countdown started at 10!" },
      { emoji: "🥂", word: "toast", def: "a short speech before drinking to celebrate", ex: "Let’s make a toast to 2026." },
      { emoji: "🎊", word: "confetti", def: "small pieces of paper thrown in celebration", ex: "Confetti filled the room." },
      { emoji: "🌙", word: "midnight", def: "12:00 a.m.", ex: "We called our family at midnight." },
      { emoji: "🕯️", word: "tradition", def: "a custom people repeat each year", ex: "It’s a tradition to eat grapes in Spain." },
      { emoji: "🍀", word: "good luck", def: "positive fortune", ex: "Good luck this year!" },
      { emoji: "🎶", word: "celebrate", def: "to do something special for a happy event", ex: "We celebrated with friends." }
    ],
    resolutions: [
      { emoji: "🗓️", word: "resolution", def: "a promise to yourself to improve", ex: "My resolution is to read more." },
      { emoji: "🎯", word: "goal", def: "something you want to achieve", ex: "My goal is to run 5 km." },
      { emoji: "📈", word: "improve", def: "to get better", ex: "I want to improve my English." },
      { emoji: "🏃", word: "exercise", def: "physical activity", ex: "I’m going to exercise twice a week." },
      { emoji: "📚", word: "habit", def: "something you do regularly", ex: "I’m building a reading habit." },
      { emoji: "⏰", word: "stick to", def: "continue doing something (not quit)", ex: "I’ll stick to my plan." },
      { emoji: "🚫", word: "give up", def: "stop doing something", ex: "I’m giving up sugary drinks." },
      { emoji: "🧘", word: "balance", def: "a healthy mix of work and rest", ex: "I want better work-life balance." }
    ],
    wishes: [
      { emoji: "💛", word: "wishing you…", def: "a kind phrase to express hopes", ex: "Wishing you health and happiness." },
      { emoji: "🌟", word: "may", def: "formal wish word (May + verb)", ex: "May your year be joyful." },
      { emoji: "🕊️", word: "peace", def: "calm and no conflict", ex: "Wishing you peace." },
      { emoji: "😊", word: "happiness", def: "feeling happy", ex: "Wishing you happiness." },
      { emoji: "🌿", word: "health", def: "being well", ex: "Wishing you good health." },
      { emoji: "💪", word: "strength", def: "ability to stay strong", ex: "Wishing you strength this year." },
      { emoji: "🤝", word: "support", def: "help and encouragement", ex: "Thank you for your support." },
      { emoji: "🙏", word: "grateful", def: "thankful", ex: "I’m grateful for you." }
    ],
    hopesdreams: [
      { emoji: "🌈", word: "hope", def: "a positive feeling about the future", ex: "I hope you feel happy this year." },
      { emoji: "✨", word: "dream", def: "a big personal goal or ambition", ex: "My dream is to travel more." },
      { emoji: "🧠", word: "confidence", def: "believing in yourself", ex: "Wishing you confidence and clarity." },
      { emoji: "🧭", word: "direction", def: "a clear plan / path", ex: "I hope you find direction this year." },
      { emoji: "🫶", word: "belonging", def: "feeling accepted and connected", ex: "Wishing you a sense of belonging." },
      { emoji: "🌱", word: "growth", def: "improvement over time", ex: "May this year bring growth." },
      { emoji: "🕯️", word: "peace of mind", def: "feeling calm and mentally okay", ex: "Wishing you peace of mind." },
      { emoji: "🚪", word: "opportunity", def: "a good chance to succeed", ex: "I hope new opportunities come your way." }
    ],
    stationery: [
      { emoji: "✉️", word: "envelope", def: "paper cover for a letter", ex: "Put the card in an envelope." },
      { emoji: "💌", word: "greeting card", def: "a card with a message", ex: "I sent a New Year card." },
      { emoji: "🖊️", word: "signature", def: "your name at the end", ex: "Add your signature at the end." },
      { emoji: "📬", word: "mail", def: "send letters or cards", ex: "I’ll mail it tomorrow." },
      { emoji: "📝", word: "note", def: "a short written message", ex: "I wrote a small note." },
      { emoji: "📮", word: "post office", def: "place to send mail", ex: "I went to the post office." },
      { emoji: "📍", word: "address", def: "location details for delivery", ex: "Write the address clearly." },
      { emoji: "🏷️", word: "stamp", def: "label you pay to send mail", ex: "Don’t forget the stamp." }
    ]
  };

  let activeVocabTab = "celebration";

  function renderVocab(tabKey) {
    const grid = $("#vocabGrid");
    const items = vocab[tabKey] || [];
    grid.innerHTML = items.map((it, idx) => `
      <div class="ny-flip" tabindex="0" role="button" aria-label="Flashcard ${escapeHTML(it.word)}" data-word="${escapeHTML(it.word)}" data-ex="${escapeHTML(it.ex)}">
        <div class="ny-flip-inner">
          <div class="ny-face ny-front">
            <div class="ny-emoji">${it.emoji}</div>
            <div>
              <div class="ny-word">${escapeHTML(it.word)}</div>
              <div class="ny-tag">Click to flip</div>
              <div class="ny-card-audio">
                <button class="ny-btn ny-btn-mini ny-listen" data-accent="us" type="button">Listen US</button>
                <button class="ny-btn ny-btn-mini ny-listen" data-accent="uk" type="button">Listen UK</button>
              </div>
            </div>
          </div>
          <div class="ny-face ny-back">
            <div><strong>Meaning:</strong> ${escapeHTML(it.def)}</div>
            <div class="ny-ex"><strong>Example:</strong> ${escapeHTML(it.ex)}</div>
            <div class="ny-card-audio">
              <button class="ny-btn ny-btn-mini ny-listen" data-accent="us" type="button">Listen US</button>
              <button class="ny-btn ny-btn-mini ny-listen" data-accent="uk" type="button">Listen UK</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    // flip + keyboard
    $$(".ny-flip", grid).forEach(card => {
      card.addEventListener("click", (e) => {
        // don’t flip when clicking listen buttons
        if (e.target && e.target.classList && e.target.classList.contains("ny-listen")) return;
        card.classList.toggle("is-flipped");
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });

    // listen buttons
    $$(".ny-listen", grid).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".ny-flip");
        const w = card?.getAttribute("data-word") || "";
        const ex = card?.getAttribute("data-ex") || "";
        const accent = btn.getAttribute("data-accent") || state.voice;
        speak(`${w}. Example: ${ex}`, accent);
      });
    });
  }

  function shuffleVocab() {
    vocab[activeVocabTab] = shuffleArray(vocab[activeVocabTab]);
    renderVocab(activeVocabTab);
  }

  function resetVocab() {
    // just re-render (keeps current order)
    renderVocab(activeVocabTab);
  }

  // --------------------
  // Grammar cards
  // --------------------
  function renderGrammarCards() {
    const mount = $("#grammarCards");
    const name = state.studentName || "I";
    const pron = getPronounPack(state.pronoun);

    const cards = [
      {
        title: "1) Past Simple — finished time (last year)",
        body: `
          <p><strong>Use it</strong> for completed actions with a finished time:
          <span class="ny-chip">last year</span> <span class="ny-chip">in 2025</span></p>
          <p class="ny-ex">“Last year, ${escapeHTML(name)} <strong>learned</strong> a lot.”</p>
        `
      },
      {
        title: "2) Present Perfect — experience / result",
        body: `
          <p><strong>Use it</strong> for experience (no specific time) or present result.</p>
          <p class="ny-ex">“I’ve <strong>never tried</strong> ice skating.”</p>
          <p class="ny-ex">“I’ve <strong>already sent</strong> my cards.”</p>
        `
      },
      {
        title: "3) Plans — going to / plan to / intend to",
        body: `
          <p><strong>Use it</strong> when you already have a plan.</p>
          <p class="ny-ex">“This year, ${escapeHTML(name)}’m <strong>going to</strong> practice English.”</p>
          <p class="ny-ex">“I <strong>plan to</strong> read more.”</p>
        `
      },
      {
        title: "4) Arrangements — Present Continuous",
        body: `
          <p><strong>Use it</strong> for scheduled arrangements.</p>
          <p class="ny-ex">“On Saturday, I’m <strong>meeting</strong> my family.”</p>
        `
      },
      {
        title: "5) Predictions — will",
        body: `
          <p><strong>Use it</strong> for predictions and instant decisions.</p>
          <p class="ny-ex">“I think 2026 <strong>will be</strong> a great year.”</p>
        `
      },
      {
        title: "6) Hopes & Dreams — hope / wish / dream / would love to",
        body: `
          <p><strong>I hope (that)…</strong> is very natural in wishes.</p>
          <p class="ny-ex">“I hope you <strong>feel</strong> proud of yourself this year.”</p>
          <p><strong>I wish…</strong> can sound more “imagined” (often with could/would).</p>
          <p class="ny-ex">“I wish I <strong>could</strong> travel more.”</p>
          <p><strong>My dream is to… / I’d love to…</strong></p>
          <p class="ny-ex">“My dream is to <strong>start</strong> a new project.”</p>
        `
      }
    ];

    mount.innerHTML = cards.map(c => `
      <div class="ny-mini">
        <h3 class="ny-h3">${c.title}</h3>
        ${c.body}
      </div>
    `).join("");
  }

  function grammarReadoutText() {
    return [
      "Grammar recap.",
      "Past Simple for finished time: last year, in 2025.",
      "Present Perfect for experience and result: I have never tried, I have already done.",
      "Going to / plan to for intentions.",
      "Present Continuous for arrangements.",
      "Will for predictions.",
      "For hopes and dreams: I hope you..., My dream is to..., I would love to..., I wish I could..."
    ].join(" ");
  }

  // --------------------
  // Exercise 1: QCM (instant)
  // --------------------
  const qcmData = [
    {
      id: "q1",
      prompt: "Last year, I ____ my best friend a New Year card.",
      options: ["send", "sent", "have sent", "am sending"],
      answer: "sent",
      explanation: "“Last year” = finished time → Past Simple."
    },
    {
      id: "q2",
      prompt: "I’ve ____ started learning a new skill this year.",
      options: ["already", "yesterday", "last year", "tomorrow"],
      answer: "already",
      explanation: "“already” commonly appears with Present Perfect."
    },
    {
      id: "q3",
      prompt: "This year, I’m going to ____ more water.",
      options: ["drink", "drank", "drunk", "drinking"],
      answer: "drink",
      explanation: "After “going to” use the base verb: going to drink."
    },
    {
      id: "q4",
      prompt: "On Saturday, I’m ____ my family for lunch.",
      options: ["meet", "met", "meeting", "have met"],
      answer: "meeting",
      explanation: "Arrangement with a time → Present Continuous."
    },
    {
      id: "q5",
      prompt: "I think 2026 ____ be a great year.",
      options: ["will", "did", "have", "was"],
      answer: "will",
      explanation: "Prediction → “will”."
    },
    {
      id: "q6",
      prompt: "Formal wish: May your year ____ filled with joy.",
      options: ["is", "be", "being", "was"],
      answer: "be",
      explanation: "May + base verb: May your year be…"
    }
  ];

  const qcmTries = {}; // id -> tries
  const qcmLocked = new Set();

  function renderQcm() {
    const mount = $("#qcmMount");
    mount.innerHTML = qcmData.map((q, i) => `
      <div class="ny-q" data-qcm="${q.id}">
        <p class="ny-q-title">${i + 1}. ${escapeHTML(q.prompt)}</p>
        <div class="ny-options">
          ${q.options.map(opt => `
            <label class="ny-opt">
              <input type="radio" name="${q.id}" value="${escapeHTML(opt)}" />
              <span>${escapeHTML(opt)}</span>
            </label>
          `).join("")}
        </div>
        <div class="ny-q-mini" id="mini_${q.id}"></div>
      </div>
    `).join("");

    qcmData.forEach(q => { qcmTries[q.id] = 0; });
    qcmLocked.clear();

    // remove awards for this section
    // (we keep other section awards)
    [...state.awarded].forEach(k => { if (k.startsWith("qcm:")) state.awarded.delete(k); });

    // bind instant checking
    qcmData.forEach(q => {
      const qEl = $(`[data-qcm="${q.id}"]`);
      qEl.addEventListener("change", () => checkQcmOne(q));
    });
  }

  function lockQcmQuestion(q) {
    qcmLocked.add(q.id);
    $$(`input[name="${q.id}"]`).forEach(inp => inp.disabled = true);
  }

  function checkQcmOne(q) {
    if (qcmLocked.has(q.id)) return;

    const chosen = $(`input[name="${q.id}"]:checked`)?.value || "";
    if (!chosen) return;

    qcmTries[q.id] += 1;

    const qEl = $(`[data-qcm="${q.id}"]`);
    const opts = $$(".ny-opt", qEl);
    opts.forEach(label => label.classList.remove("is-correct", "is-wrong"));

    // mark correct option always
    opts.forEach(label => {
      const val = $("input", label).value;
      if (val === q.answer) label.classList.add("is-correct");
    });

    const mini = $(`#mini_${q.id}`);
    const ok = chosen === q.answer;

    addAttempt(ok);

    if (ok) {
      const pts = qcmTries[q.id] === 1 ? 2 : 1;
      award(`qcm:${q.id}`, pts);
      mini.classList.remove("bad");
      mini.classList.add("good");
      mini.textContent = `✅ Correct! +${pts} pts`;
      lockQcmQuestion(q);
    } else {
      // mark chosen wrong
      opts.forEach(label => {
        const val = $("input", label).value;
        if (val === chosen) label.classList.add("is-wrong");
      });

      // log first wrong attempt only
      if (qcmTries[q.id] === 1) {
        logWrong("QCM", q.prompt, chosen, q.answer, q.explanation);
      }

      mini.classList.remove("good");
      mini.classList.add("bad");
      mini.textContent = `❌ Not quite. Hint: ${q.explanation}`;
    }
  }

  function resetQcm() {
    renderQcm();
  }

  // --------------------
  // Exercise 2: Fill blanks (instant)
  // --------------------
  const fibData = [
    { id: "f1", parts: ["Last year, I", "a lot of English."], options: ["learned", "have learned", "am learning", "will learn"], answer: "learned", explain: "“Last year” → Past Simple." },
    { id: "f2", parts: ["I", "never", "to New York."], options: ["have traveled", "traveled", "am traveling", "will travel"], answer: "have traveled", explain: "Experience with “never” → Present Perfect." },
    { id: "f3", parts: ["This year, I’m going to", "more."], options: ["exercise", "exercised", "exercising", "have exercised"], answer: "exercise", explain: "going to + base verb." },
    { id: "f4", parts: ["On Friday, I’m", "a New Year card."], options: ["sending", "send", "sent", "have sent"], answer: "sending", explain: "Arrangement (Friday) → Present Continuous." },
    { id: "f5", parts: ["I think this year", "better for you."], options: ["will be", "was", "has been", "is being"], answer: "will be", explain: "Prediction → will." }
  ];

  const fibTries = {};
  const fibLocked = new Set();

  function renderFib() {
    const mount = $("#fibMount");
    mount.innerHTML = fibData.map((row, idx) => `
      <div class="ny-fib-row" data-fib="${row.id}">
        <div><strong>${idx + 1}.</strong>
          ${escapeHTML(row.parts[0])}
          <select aria-label="blank ${idx + 1}">
            <option value="">— choose —</option>
            ${row.options.map(o => `<option value="${escapeHTML(o)}">${escapeHTML(o)}</option>`).join("")}
          </select>
          ${escapeHTML(row.parts[1])}
        </div>
        <div class="ny-q-mini" id="mini_${row.id}"></div>
      </div>
    `).join("");

    fibData.forEach(r => { fibTries[r.id] = 0; });
    fibLocked.clear();
    [...state.awarded].forEach(k => { if (k.startsWith("fib:")) state.awarded.delete(k); });

    fibData.forEach(row => {
      const el = $(`[data-fib="${row.id}"]`);
      const sel = $("select", el);
      sel.addEventListener("change", () => checkFibOne(row));
    });
  }

  function lockFib(row) {
    fibLocked.add(row.id);
    const el = $(`[data-fib="${row.id}"]`);
    $("select", el).disabled = true;
  }

  function checkFibOne(row) {
    if (fibLocked.has(row.id)) return;

    const el = $(`[data-fib="${row.id}"]`);
    const sel = $("select", el);
    const chosen = sel.value;
    if (!chosen) return;

    fibTries[row.id] += 1;
    const ok = chosen === row.answer;
    addAttempt(ok);

    const mini = $(`#mini_${row.id}`);

    if (ok) {
      const pts = fibTries[row.id] === 1 ? 2 : 1;
      award(`fib:${row.id}`, pts);
      el.style.borderColor = "rgba(27,127,75,.45)";
      el.style.background = "rgba(27,127,75,.04)";
      mini.classList.remove("bad");
      mini.classList.add("good");
      mini.textContent = `✅ Correct! +${pts} pts`;
      lockFib(row);
    } else {
      el.style.borderColor = "rgba(180,35,24,.45)";
      el.style.background = "rgba(180,35,24,.04)";
      mini.classList.remove("good");
      mini.classList.add("bad");
      mini.textContent = `❌ Try again. Hint: ${row.explain}`;
      if (fibTries[row.id] === 1) {
        logWrong("Fill in the blanks", `${row.parts[0]} ____ ${row.parts[1]}`, chosen, row.answer, row.explain);
      }
    }
  }

  function resetFib() {
    renderFib();
  }

  // --------------------
  // Exercise 3: DnD categories
  // --------------------
  const dndItems = [
    { text: "I’ve never tried ice skating.", zone: "experience" },
    { text: "I’m going to learn 30 new words.", zone: "plan" },
    { text: "I’m meeting my friends on Saturday.", zone: "arrangement" },
    { text: "I think this year will be amazing.", zone: "prediction" },
    { text: "I’ve already sent my cards.", zone: "experience" },
    { text: "I plan to read more books.", zone: "plan" },
    { text: "I’m having dinner with my family tonight.", zone: "arrangement" },
    { text: "It will probably rain tomorrow.", zone: "prediction" }
  ];

  const dndAwarded = new Set();

  function renderDnd() {
    const bank = $("#dndBank");
    $$(".ny-dropzone .ny-droparea").forEach(a => a.innerHTML = "");
    bank.innerHTML = shuffleArray(dndItems).map((it, i) => `
      <div class="ny-dnd-chip" draggable="true" data-zone="${it.zone}" data-text="${escapeHTML(it.text)}" data-id="dnd_${i}">
        ${escapeHTML(it.text)}
      </div>
    `).join("");

    dndAwarded.clear();
    $("#dndFeedback").textContent = "";
    $("#dndFeedback").classList.remove("good","bad");

    let dragged = null;

    $$(".ny-dnd-chip", bank).forEach(chip => {
      chip.addEventListener("dragstart", (e) => {
        dragged = chip;
        e.dataTransfer.effectAllowed = "move";
      });
    });

    $$(".ny-dropzone").forEach(zoneEl => {
      const area = $(".ny-droparea", zoneEl);

      zoneEl.addEventListener("dragover", (e) => {
        e.preventDefault();
        zoneEl.classList.add("is-over");
      });

      zoneEl.addEventListener("dragleave", () => zoneEl.classList.remove("is-over"));

      zoneEl.addEventListener("drop", (e) => {
        e.preventDefault();
        zoneEl.classList.remove("is-over");
        if (!dragged) return;
        area.appendChild(dragged);
        dragged = null;
      });
    });

    bank.addEventListener("dragover", (e) => e.preventDefault());
    bank.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!dragged) return;
      bank.appendChild(dragged);
      dragged = null;
    });
  }

  function zoneLabel(z) {
    return ({
      experience: "Experience (Present Perfect)",
      plan: "Plan / Intention (going to / plan to)",
      arrangement: "Arrangement (Present Continuous)",
      prediction: "Prediction (will)"
    }[z] || z);
  }

  function checkDnd() {
    let gained = 0;
    let correctNow = 0;
    let total = dndItems.length;

    // mark chips
    $$(".ny-dropzone").forEach(zoneEl => {
      const zone = zoneEl.getAttribute("data-zone");
      const chips = $$(".ny-dnd-chip", zoneEl);

      chips.forEach(chip => {
        const expected = chip.getAttribute("data-zone");
        const ok = expected === zone;

        addAttempt(ok);

        if (ok) {
          chip.style.borderColor = "rgba(27,127,75,.45)";
          chip.style.background = "rgba(27,127,75,.06)";
          correctNow++;

          const key = `dnd:${chip.getAttribute("data-id")}`;
          if (!dndAwarded.has(key)) {
            dndAwarded.add(key);
            gained += 1;
            award(key, 1);
          }
        } else {
          chip.style.borderColor = "rgba(180,35,24,.45)";
          chip.style.background = "rgba(180,35,24,.06)";
          logWrong(
            "Drag & Drop",
            "Sort the phrase into the correct category",
            chip.textContent.trim(),
            zoneLabel(expected),
            `This phrase belongs to: ${zoneLabel(expected)}`
          );
        }
      });
    });

    // chips still in bank count as not done (no attempts spam here)
    const remaining = $$(".ny-dnd-chip", $("#dndBank")).length;

    const ok = correctNow >= Math.ceil(total * 0.7) && remaining === 0;
    toastFeedback(
      $("#dndFeedback"),
      ok,
      `Drag & Drop: ${correctNow}/${total} correct. +${gained} pts (earned this check).`
    );
  }

  function resetDnd() {
    [...state.awarded].forEach(k => { if (k.startsWith("dnd:")) state.awarded.delete(k); });
    renderDnd();
  }

  // --------------------
  // Exercise 4: Sentence Builder
  // --------------------
  const builderTasks = [
    {
      id: "b1",
      target: "This year, I’m going to practice English every day.",
      tokens: ["This", "year,", "I’m", "going", "to", "practice", "English", "every", "day."],
      explanation: "Intention → “going to” + base verb."
    },
    {
      id: "b2",
      target: "On Saturday, I’m meeting my family for lunch.",
      tokens: ["On", "Saturday,", "I’m", "meeting", "my", "family", "for", "lunch."],
      explanation: "Arrangement → Present Continuous."
    },
    {
      id: "b3",
      target: "I hope your year brings you peace of mind and new opportunities.",
      tokens: ["I", "hope", "your", "year", "brings", "you", "peace", "of", "mind", "and", "new", "opportunities."],
      explanation: "Hopes: “I hope…” + present."
    }
  ];

  let builderIndex = 0;
  let builderLine = [];
  const builderTries = {}; // taskid -> tries

  function renderBuilder() {
    const mount = $("#builderMount");
    builderIndex = 0;
    builderLine = [];
    builderTasks.forEach(t => builderTries[t.id] = 0);

    [...state.awarded].forEach(k => { if (k.startsWith("builder:")) state.awarded.delete(k); });

    mount.innerHTML = `
      <div class="ny-builder">
        <div class="ny-builder-target">
          <strong>Build this sentence:</strong>
          <div id="builderTargetText"></div>
        </div>

        <div class="ny-small ny-muted"><strong>Your sentence:</strong></div>
        <div class="ny-builder-line" id="builderLine"></div>

        <div class="ny-small ny-muted" style="margin-top:.75rem;"><strong>Word bank:</strong></div>
        <div class="ny-builder-bank" id="builderBank"></div>

        <div class="ny-small ny-muted" id="builderHint" style="margin-top:.75rem;"></div>
      </div>
    `;

    $("#builderFeedback").textContent = "";
    $("#builderFeedback").classList.remove("good","bad");

    renderBuilderTask();
  }

  function renderBuilderTask() {
    const task = builderTasks[builderIndex];
    $("#builderTargetText").textContent = task.target;
    $("#builderHint").textContent = `Hint: ${task.explanation}`;

    const bank = $("#builderBank");
    const line = $("#builderLine");
    bank.innerHTML = "";
    line.innerHTML = "";
    builderLine = [];

    shuffleArray(task.tokens).forEach(tok => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ny-token";
      btn.textContent = tok;
      btn.addEventListener("click", () => {
        builderLine.push(tok);
        line.appendChild(makeToken(tok, true));
        btn.disabled = true;
        btn.style.opacity = ".55";
      });
      bank.appendChild(btn);
    });
  }

  function makeToken(text, removable) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ny-token";
    b.textContent = text;
    if (removable) {
      b.title = "Click to remove";
      b.addEventListener("click", () => {
        const idx = builderLine.indexOf(text);
        if (idx >= 0) builderLine.splice(idx, 1);
        b.remove();

        const bankBtns = $$("#builderBank .ny-token");
        const match = bankBtns.find(x => x.textContent === text && x.disabled);
        if (match) {
          match.disabled = false;
          match.style.opacity = "1";
        }
      });
    }
    return b;
  }

  function checkBuilder() {
    const task = builderTasks[builderIndex];
    const built = builderLine.join(" ").replace(/\s+/g, " ").trim();
    const target = task.target.replace(/\s+/g, " ").trim();

    builderTries[task.id] += 1;
    const ok = built === target;
    addAttempt(ok);

    if (ok) {
      const pts = builderTries[task.id] === 1 ? 3 : 2;
      award(`builder:${task.id}`, pts);
      toastFeedback($("#builderFeedback"), true, `✅ Correct! +${pts} pts`);

      builderIndex += 1;
      if (builderIndex >= builderTasks.length) {
        $("#builderHint").textContent = "✅ Builder complete!";
      } else {
        renderBuilderTask();
      }
    } else {
      toastFeedback($("#builderFeedback"), false, "❌ Not quite. Remove words and try again.");
      if (builderTries[task.id] === 1) {
        logWrong("Sentence Builder", "Build the sentence exactly", built || "(empty)", target, task.explanation);
      }
    }
  }

  function resetBuilder() {
    renderBuilder();
  }

  // --------------------
  // Exercise 5: Wish Builder
  // --------------------
  const wishData = {
    starter: [
      { text: "Wishing you", ok: true, note: "Friendly and natural." },
      { text: "I hope you have", ok: true, note: "Very natural, common." },
      { text: "May you have", ok: true, note: "Formal / elegant." },
      { text: "I wish you", ok: true, note: "Correct and common." },
      { text: "I want you", ok: false, note: "Too direct (not a wish)." }
    ],
    topic: [
      { text: "a joyful New Year", ok: true },
      { text: "health and happiness", ok: true },
      { text: "peace of mind", ok: true },
      { text: "success and new opportunities", ok: true },
      { text: "a year full of stress", ok: false }
    ],
    extra: [
      { text: "(no extra)", ok: true },
      { text: "and the courage to follow your dreams.", ok: true },
      { text: "and time for what matters most.", ok: true },
      { text: "and lots of fun moments with people you love.", ok: true },
      { text: "and nothing ever changes.", ok: false }
    ]
  };

  let wishTries = 0;

  function fillWishDropdowns() {
    const starter = $("#wishStarter");
    const topic = $("#wishTopic");
    const extra = $("#wishExtra");
    starter.innerHTML = wishData.starter.map((x,i)=>`<option value="${i}">${escapeHTML(x.text)}</option>`).join("");
    topic.innerHTML = wishData.topic.map((x,i)=>`<option value="${i}">${escapeHTML(x.text)}</option>`).join("");
    extra.innerHTML = wishData.extra.map((x,i)=>`<option value="${i}">${escapeHTML(x.text)}</option>`).join("");
    wishTries = 0;
    $("#wishOutput").textContent = "Choose options to generate a wish.";
    $("#wishFeedback").textContent = "";
    $("#wishFeedback").classList.remove("good","bad");
    [...state.awarded].forEach(k => { if (k.startsWith("wish:")) state.awarded.delete(k); });
  }

  function currentWishText() {
    const s = wishData.starter[Number($("#wishStarter").value || 0)].text;
    const t = wishData.topic[Number($("#wishTopic").value || 0)].text;
    const e = wishData.extra[Number($("#wishExtra").value || 0)].text;
    let line = `${s} ${t}`;
    if (e !== "(no extra)") line += ` ${e}`;
    if (!line.endsWith(".") && !line.endsWith("!") && !line.endsWith("?")) line += ".";
    return line;
  }

  function updateWishOutput() {
    $("#wishOutput").textContent = currentWishText();
  }

  function checkWishBuilder() {
    wishTries += 1;

    const sObj = wishData.starter[Number($("#wishStarter").value || 0)];
    const tObj = wishData.topic[Number($("#wishTopic").value || 0)];
    const eObj = wishData.extra[Number($("#wishExtra").value || 0)];

    updateWishOutput();

    const ok = sObj.ok && tObj.ok && eObj.ok;
    addAttempt(ok);

    if (ok) {
      const pts = wishTries === 1 ? 2 : 1;
      award("wish:builder", pts);
      toastFeedback($("#wishFeedback"), true, `✅ Great wish! +${pts} pts`);
    } else {
      toastFeedback($("#wishFeedback"), false, `❌ Fix it: ${(!sObj.ok ? sObj.note : "choose more positive words")} `);
      if (wishTries === 1) {
        logWrong("Wish Builder", "Build a correct wish", currentWishText(), "Use a correct wish starter + positive topic", "Avoid direct or negative phrases.");
      }
    }
  }
// --------------------
// Exercise 6: Structure DnD (Greeting / Wish / Closing)
// --------------------
// Pedagogical note:
// Some lines can logically fit in more than one section (ex: “Happy New Year!”).
// To avoid “unfair” scoring, each chip can have one OR several acceptable zones.
const structItems = [
  { text: "Hi Emma,", zones: ["greeting"], why: "Greeting: informal name + comma." },
  { text: "Dear Mr. Smith,", zones: ["greeting"], why: "Greeting: formal title + name + comma." },

  // Ambiguous but correct in real life:
  { text: "Happy New Year!", zones: ["greeting", "wish"], why: "Can be an opener OR the main wish." },

  { text: "Wishing you health and happiness.", zones: ["wish"], why: "Wish: expresses hopes for the person." },
  { text: "I hope your year brings you new opportunities.", zones: ["wish"], why: "Wish: “I hope…” + present." },

  { text: "With love, Tisha", zones: ["closing"], why: "Closing: sign‑off + your name." },
  { text: "Best regards, Tisha", zones: ["closing"], why: "Closing: polite sign‑off + your name." },
  { text: "Sincerely, Tisha", zones: ["closing"], why: "Closing: formal sign‑off + your name." }
];

const structAwarded = new Set();

function structZoneLabel(z) {
  return ({
    greeting: "Greeting",
    wish: "Wish / Message",
    closing: "Closing / Signature"
  }[z] || z);
}

function renderStruct() {
  const bank = $("#structBank");
  $$(".ny-structzone .ny-droparea").forEach(a => a.innerHTML = "");
  bank.innerHTML = shuffleArray(structItems).map((it, i) => `
    <div class="ny-dnd-chip" draggable="true"
         data-zones="${it.zones.join("|")}"
         data-why="${escapeHTML(it.why || "")}"
         data-id="s_${i}">
      ${escapeHTML(it.text)}
    </div>
  `).join("");

  structAwarded.clear();
  $("#structFeedback").textContent = "";
  $("#structFeedback").classList.remove("good","bad");

  let dragged = null;

  // NOTE: Listeners stay on the element even after moving it into a drop zone.
  $$(".ny-dnd-chip", bank).forEach(chip => {
    chip.addEventListener("dragstart", (e) => {
      dragged = chip;
      e.dataTransfer.effectAllowed = "move";
    });
  });

  $$(".ny-structzone").forEach(zoneEl => {
    const area = $(".ny-droparea", zoneEl);

    zoneEl.addEventListener("dragover", (e) => { e.preventDefault(); zoneEl.classList.add("is-over"); });
    zoneEl.addEventListener("dragleave", () => zoneEl.classList.remove("is-over"));
    zoneEl.addEventListener("drop", (e) => {
      e.preventDefault();
      zoneEl.classList.remove("is-over");
      if (!dragged) return;
      area.appendChild(dragged);
      dragged = null;
    });
  });

  bank.addEventListener("dragover", (e) => e.preventDefault());
  bank.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!dragged) return;
    bank.appendChild(dragged);
    dragged = null;
  });

  // Reset this section's “already-awarded” locks (so the learner can re-try after Reset).
  [...state.awarded].forEach(k => { if (k.startsWith("struct:")) state.awarded.delete(k); });
}

function checkStruct() {
  let gained = 0;
  let correctNow = 0;
  const total = structItems.length;

  const wrong = [];

  $$(".ny-structzone").forEach(zoneEl => {
    const zone = zoneEl.getAttribute("data-zone");
    const chips = $$(".ny-dnd-chip", zoneEl);

    chips.forEach(chip => {
      const acceptable = (chip.getAttribute("data-zones") || "").split("|").map(s => s.trim()).filter(Boolean);
      const ok = acceptable.includes(zone);
      addAttempt(ok);

      if (ok) {
        chip.style.borderColor = "rgba(27,127,75,45)";
        chip.style.background = "rgba(27,127,75,06)";
        correctNow++;

        const key = `struct:${chip.getAttribute("data-id")}`;
        if (!structAwarded.has(key)) {
          structAwarded.add(key);
          gained += 1;
          award(key, 1);
        }
      } else {
        chip.style.borderColor = "rgba(180,35,24,45)";
        chip.style.background = "rgba(180,35,24,06)";
        const expectedLabel = acceptable.length
          ? acceptable.map(structZoneLabel).join(" or ")
          : "—";
        const why = chip.getAttribute("data-why") || "Tip: Greeting = name/title. Wish = positive hope. Closing = sign-off + name.";
        wrong.push({ text: chip.textContent.trim(), expectedLabel, actualLabel: structZoneLabel(zone), why });

        // This is what learners see in “Review mistakes”
        logWrong(
          "Message Structure",
          "Place each part into Greeting / Wish / Closing",
          chip.textContent.trim(),
          expectedLabel,
          why
        );
      }
    });
  });

  const remainingChips = $$(".ny-dnd-chip", $("#structBank")).map(c => c.textContent.trim());
  const remaining = remainingChips.length;

  // “Full credit / complete” means: everything placed AND at least 70% correct.
  // (Points are still awarded per correctly placed chip.)
  const isComplete = remaining === 0;
  const ok = correctNow >= Math.ceil(total * 0.7) && isComplete;

  // Build an explanatory feedback message (this answers “why didn’t I get full credit?”)
  let msg = `Structure: ${correctNow}/${total} correct. +${gained} pt(s) (earned this check).`;

  if (!isComplete) {
    msg += `  Still in the Bank: ${remaining}. (To get full credit, move ALL chips out of the Bank.)`;
  }
  if (wrong.length) {
    const preview = wrong.slice(0, 3).map(w => `“${w.text}” → ${w.expectedLabel}`).join("  •  ");
    msg += `  Fix: ${preview}${wrong.length > 3 ? "  •  …" : ""}`;
  }

  toastFeedback($("#structFeedback"), ok, msg);
}

function resetStruct() {
  [...state.awarded].forEach(k => { if (k.startsWith("struct:")) state.awarded.delete(k); });
  renderStruct();
}

// --------------------
// Card generator + sending

  // --------------------
  const templateList = [
    {
      label: "Warm (friend)",
      text:
`Hi [NAME],

Happy New Year! Wishing you health, happiness, and many beautiful moments in 2026.
I hope this year brings you new opportunities and lots of joy.

With love,
[ME]`
    },
    {
      label: "Formal (colleague/teacher)",
      text:
`Dear [NAME],

Please accept my warm wishes for the New Year.
May 2026 bring you peace, success, and good health.

Sincerely,
[ME]`
    },
    {
      label: "Short SMS",
      text:
`Happy New Year, [NAME]! 🎉 Wishing you health, happiness, and a fantastic 2026! – [ME]`
    },
    {
      label: "Hopes & dreams",
      text:
`Dear [NAME],

Happy New Year!
I hope you feel proud of yourself this year, and that you find time for what matters most.
May your dreams take shape, step by step.

Warm wishes,
[ME]`
    }
  ];

  function fillTemplates() {
    const sel = $("#templateQuick");
    sel.innerHTML = templateList.map((t, i) => `<option value="${i}">${escapeHTML(t.label)}</option>`).join("");
  }

  function replaceTokens(txt) {
    const me = state.studentName || "—";
    const rec = ($("#recipientName").value || "").trim() || "Friend";
    return txt.replaceAll("[ME]", me).replaceAll("[NAME]", rec);
  }

  function generateCardText() {
    const recipient = ($("#recipientName").value || "").trim() || "Friend";
    const rel = $("#relationship").value || "friend";
    const tone = $("#tone").value || "warm";
    const topic = $("#cardTopic").value || "health";
    const includeRes = $("#includeResolution").checked;

    const me = state.studentName || "—";

    const topicLine = ({
      health: "Wishing you strong health and lots of energy.",
      success: "Wishing you success and exciting opportunities.",
      peace: "Wishing you peace of mind and calm moments every day.",
      love: "Wishing you love, laughter, and warm memories.",
      gratitude: "Thank you for being in my life—I'm truly grateful.",
      newbeginnings: "Here’s to fresh starts and new beginnings!",
      dreams: "May your dreams take shape, step by step."
    }[topic]);

    const opener = (() => {
      if (tone === "formal") return `Dear ${recipient},`;
      if (tone === "simple") return `Hi ${recipient},`;
      if (tone === "funny") return `Hi ${recipient},`;
      return `Dear ${recipient},`;
    })();

    const line2 = (() => {
      if (tone === "funny") return "Happy New Year! May your coffee be strong and your worries be small.";
      return "Happy New Year!";
    })();

    let body = `${topicLine}\nI hope 2026 brings you joyful moments and good surprises.\n`;
    body += (topic === "dreams")
      ? "I hope you feel proud of yourself this year, and that you find time for what matters most.\n"
      : "May this year bring you peace, confidence, and clarity.\n";

    if (includeRes) {
      body += `\nThis year, I’m going to practice English more and build healthier habits.\n`;
      if (rel === "colleague") body += "I’m looking forward to working together this year.\n";
    }

    const closer = (() => {
      if (tone === "formal") return `Sincerely,\n${me}`;
      if (tone === "simple") return `Best,\n${me}`;
      if (tone === "funny") return `Cheers,\n${me}`;
      return `With love,\n${me}`;
    })();

    return `${opener}\n\n${line2}\n\n${body}\n${closer}`.replace(/\n{3,}/g, "\n\n");
  }

  function updateEmailLink() {
    const text = $("#cardOutput").value || "";
    const subject = encodeURIComponent("Happy New Year!");
    const body = encodeURIComponent(text);
    const href = `mailto:?subject=${subject}&body=${body}`;
    $("#emailCard").setAttribute("href", href);
  }

  function copyCard() {
    const text = $("#cardOutput").value || "";
    if (!text.trim()) return;
    navigator.clipboard?.writeText(text).then(() => {
      addAttempt(true);
      award("msg:copy", 1);
      updateEmailLink();
    }).catch(() => {});
  }

  function downloadCard() {
    const text = $("#cardOutput").value || "";
    if (!text.trim()) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "new-year-message.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    addAttempt(true);
    award("msg:download", 1);
  }

  function insertTemplate() {
    const idx = Number($("#templateQuick").value || 0);
    const tpl = templateList[idx]?.text || "";
    $("#cardOutput").value = replaceTokens(tpl);
    updateEmailLink();
    addAttempt(true);
    award("msg:template", 1);
  }

  function scoreMyMessage() {
    const text = ($("#cardOutput").value || "").trim();
    const lower = text.toLowerCase();

    const hasGreeting = /(hi|dear|hello)\s+\w|dear\s+/i.test(text);
    const hasWish = /(wishing you|happy new year|may your|i hope)/i.test(text);
    const hasClosing = /(with love|best regards|best,|sincerely|cheers)/i.test(text);
    const hasName = (state.studentName || "").trim().length > 0 && lower.includes((state.studentName || "").trim().toLowerCase());

    let score = 0;
    let max = 4;

    if (hasGreeting) score++;
    if (hasWish) score++;
    if (hasClosing) score++;
    if (hasName) score++;

    const ok = score >= 3;
    addAttempt(ok);

    // award only once per message scoring
    const pts = score; // 0-4
    award("msg:score", pts);

    toastFeedback($("#messageScoreFeedback"), ok, `Checklist score: ${score}/${max}. +${pts} pts`);
    updateEmailLink();
  }

  // --------------------
  // Wrong answers modal
  // --------------------
  function renderWrongList() {
    const list = $("#wrongList");
    if (state.wrongLog.length === 0) {
      list.innerHTML = `<div class="ny-mini-note">No mistakes logged yet ✅</div>`;
      return;
    }
    list.innerHTML = state.wrongLog.slice().reverse().map(w => `
      <div class="ny-wrong-item">
        <div style="color:rgba(18,32,40,.72)"><strong>Section:</strong> ${escapeHTML(w.section)}</div>
        <div><strong>Prompt:</strong> ${escapeHTML(w.prompt)}</div>
        <div style="color:rgba(18,32,40,.72)"><strong>Your answer:</strong> ${escapeHTML(w.yourAnswer)}</div>
        <div style="color:rgba(18,32,40,.72)"><strong>Correct:</strong> ${escapeHTML(w.correctAnswer)}</div>
        <div style="color:rgba(18,32,40,.72)"><strong>Why:</strong> ${escapeHTML(w.explanation)}</div>
      </div>
    `).join("");
  }

  function openWrongModal() {
    $("#wrongModal").setAttribute("aria-hidden", "false");
    renderWrongList();
  }
  function closeWrongModal() {
    $("#wrongModal").setAttribute("aria-hidden", "true");
  }
  function clearWrong() {
    state.wrongLog = [];
    renderWrongList();
  }

  // --------------------
  // Global resets
  // --------------------
  function resetAllExercises() {
    resetQcm();
    resetFib();
    resetDnd();
    resetBuilder();
    fillWishDropdowns();
    renderStruct();
  }

  // --------------------
  // Init + bindings
  // --------------------
  function setupVocabTabs() {
    $$(".ny-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".ny-tab").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        activeVocabTab = btn.getAttribute("data-vtab");
        renderVocab(activeVocabTab);
      });
    });
  }

  function setupCheatsheetToggle() {
    const btn = $("#toggleGrammarCheatsheet");
    const sheet = $("#grammarCheatsheet");
    btn.addEventListener("click", () => {
      const hidden = sheet.hasAttribute("hidden");
      if (hidden) {
        sheet.removeAttribute("hidden");
        btn.textContent = "Hide mini cheatsheet";
      } else {
        sheet.setAttribute("hidden", "");
        btn.textContent = "Show mini cheatsheet";
      }
    });
  }

  function bindEvents() {
    $("#applyPersonalization").addEventListener("click", () => {
      applyPersonalization();
      // update message preview too
      $("#cardOutput").value = generateCardText();
      updateEmailLink();
    });

    $("#voiceUS").addEventListener("click", () => { setVoice("us"); try{localStorage.setItem("ny_voice","us");}catch(_){} });
    $("#voiceUK").addEventListener("click", () => { setVoice("uk"); try{localStorage.setItem("ny_voice","uk");}catch(_){} });

    $("#shuffleCards").addEventListener("click", shuffleVocab);
    $("#resetVocab").addEventListener("click", resetVocab);

    $("#resetQcm").addEventListener("click", resetQcm);
    $("#resetFib").addEventListener("click", resetFib);

    $("#checkDnd").addEventListener("click", checkDnd);
    $("#resetDnd").addEventListener("click", resetDnd);

    $("#checkBuilder").addEventListener("click", checkBuilder);
    $("#resetBuilder").addEventListener("click", resetBuilder);

    $("#resetAllExercises").addEventListener("click", resetAllExercises);

    $("#reviewWrongBtn").addEventListener("click", openWrongModal);
    $("#closeWrongModal").addEventListener("click", closeWrongModal);
    $("#clearWrong").addEventListener("click", clearWrong);
    $("#wrongModal").addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute && e.target.getAttribute("data-close") === "true") closeWrongModal();
    });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeWrongModal(); });

    // Grammar listen
    $("#listenGrammarUS").addEventListener("click", () => speak(grammarReadoutText(), "us"));
    $("#listenGrammarUK").addEventListener("click", () => speak(grammarReadoutText(), "uk"));

    // Wish builder
    $("#wishStarter").addEventListener("change", updateWishOutput);
    $("#wishTopic").addEventListener("change", updateWishOutput);
    $("#wishExtra").addEventListener("change", updateWishOutput);
    $("#checkWishBuilder").addEventListener("click", checkWishBuilder);
    $("#resetWishBuilder").addEventListener("click", fillWishDropdowns);
    $("#listenWish").addEventListener("click", () => {
      updateWishOutput();
      speak($("#wishOutput").textContent || "", state.voice);
    });

    // Structure
    $("#checkStruct").addEventListener("click", checkStruct);
    $("#resetStruct").addEventListener("click", resetStruct);

    // Card tools
    $("#generateCard").addEventListener("click", () => {
      $("#cardOutput").value = generateCardText();
      updateEmailLink();
      addAttempt(true);
      award("msg:generate", 1);
    });

    $("#insertTemplate").addEventListener("click", insertTemplate);
    $("#copyCard").addEventListener("click", copyCard);
    $("#downloadCard").addEventListener("click", downloadCard);

    $("#listenCardUS").addEventListener("click", () => speak($("#cardOutput").value || "", "us"));
    $("#listenCardUK").addEventListener("click", () => speak($("#cardOutput").value || "", "uk"));
    $("#stopCardAudio").addEventListener("click", stopSpeak);

    $("#cardOutput").addEventListener("input", updateEmailLink);
    $("#scoreMyMessage").addEventListener("click", scoreMyMessage);

    $("#resetCard").addEventListener("click", () => {
      $("#recipientName").value = "";
      $("#relationship").value = "friend";
      $("#tone").value = "warm";
      $("#cardTopic").value = "health";
      $("#includeResolution").checked = false;
      $("#cardOutput").value = "Your message will appear here.";
      $("#messageScoreFeedback").textContent = "";
      $("#messageScoreFeedback").classList.remove("good","bad");
      stopSpeak();
      updateEmailLink();
    });
  }

  function init() {
    loadPersonalization();
    updateScoreUI();

    setupVocabTabs();
    setupCheatsheetToggle();

    renderGrammarCards();
    renderVocab(activeVocabTab);

    renderQcm();
    renderFib();
    renderDnd();
    renderBuilder();

    fillWishDropdowns();
    renderStruct();

    fillTemplates();
    $("#cardOutput").value = generateCardText();
    updateEmailLink();

    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
