/* =========================================================
   VTest Business English 4 Skills — Interactive Prep
   File: js/vtest-prep.js
   ========================================================= */

(function () {
  "use strict";

  // -------------------------
  // Helpers
  // -------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function safeText(el, txt) {
    if (!el) return;
    el.textContent = txt;
  }

  // -------------------------
  // Hero image (page-specific)
  // -------------------------
  function applyHeroFromDataAttr() {
    const body = document.body;
    const hero = body.getAttribute("data-hero");
    if (!hero) return;
    // Resolve relative to document (works well on GitHub Pages)
    body.style.setProperty("--vtest-hero-image", `url("${hero}")`);
  }

  // -------------------------
  // Personalization
  // -------------------------
  const LS_KEY = "vtestPrepProfile_v1";
  const defaultProfile = { name: "", pronouns: "they", context: "general", accent: "en-GB" };

  function loadProfile() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...defaultProfile };
      const parsed = JSON.parse(raw);
      return { ...defaultProfile, ...parsed };
    } catch {
      return { ...defaultProfile };
    }
  }

  function saveProfile(profile) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch {}
  }

  function updateNameSpans(name) {
    const display = (name && name.trim()) ? name.trim() : "there";
    $$("[data-student-name]").forEach(el => safeText(el, display));
  }

  function initProfileUI() {
    const profile = loadProfile();

    const nameInput = $("#studentName");
    const pronounsSelect = $("#studentPronouns");
    const contextSelect = $("#studentContext");
    const accentSelect = $("#studentAccent");

    if (nameInput) nameInput.value = profile.name || "";
    if (pronounsSelect) pronounsSelect.value = profile.pronouns || "they";
    if (contextSelect) contextSelect.value = profile.context || "general";
    if (accentSelect) accentSelect.value = profile.accent || "en-GB";

    updateNameSpans(profile.name);

    const onChange = () => {
      const next = {
        name: nameInput ? nameInput.value : "",
        pronouns: pronounsSelect ? pronounsSelect.value : "they",
        context: contextSelect ? contextSelect.value : "general",
        accent: accentSelect ? accentSelect.value : "en-GB",
      };
      saveProfile(next);
      updateNameSpans(next.name);
      updateContextCopy(next.context);
      rebuildVocabUI(next.context);
      rebuildVocabQuiz(next.context);
    };

    [nameInput, pronounsSelect, contextSelect, accentSelect].forEach(el => {
      if (!el) return;
      el.addEventListener("input", onChange);
      el.addEventListener("change", onChange);
    });

    updateContextCopy(profile.context);
  }

  // -------------------------
  // Context-sensitive text
  // -------------------------
  function updateContextCopy(context) {
    // You can expand this later; for now, we adjust a few examples lightly.
    const readText = $("#readAloudText");
    if (!readText) return;

    const variants = {
      general: "This week, our team is prioritising customer response time. If you receive a request, acknowledge it quickly, give a realistic timeline, and follow up with the next steps.",
      hospitality: "This week, our team is prioritising guest satisfaction. If you receive a request, acknowledge it quickly, give a realistic timeline, and follow up with the next steps.",
      industry: "This week, our team is prioritising production targets. If you receive a request, acknowledge it quickly, give a realistic timeline, and follow up with the next steps.",
      office: "This week, our team is prioritising internal response time. If you receive a request, acknowledge it quickly, give a realistic timeline, and follow up with the next steps.",
      sales: "This week, our team is prioritising customer follow-ups. If you receive a request, acknowledge it quickly, give a realistic timeline, and follow up with the next steps.",
      transport: "This week, our team is prioritising passenger information. If you receive a request, acknowledge it quickly, give a realistic timeline, and follow up with the next steps.",
    };

    readText.textContent = variants[context] || variants.general;
  }

  // -------------------------
  // Progress tracking
  // -------------------------
  const PROGRESS_KEY = "vtestPrepProgress_v1";
  const progressSections = ["overview", "tech", "listening", "reading", "speaking", "writing", "vocab", "mock"];

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }

  function saveProgress(obj) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(obj)); } catch {}
  }

  function renderProgress() {
    const prog = loadProgress();
    const done = progressSections.filter(k => prog[k]).length;
    const pct = Math.round((done / progressSections.length) * 100);

    const text = $("#progressText");
    const fill = $("#progressFill");
    safeText(text, `${pct}%`);
    if (fill) fill.style.width = `${pct}%`;

    const hint = $("#progressHint");
    if (hint) {
      hint.textContent = done === progressSections.length
        ? "All sections complete — nice work. Repeat the timed tasks to improve."
        : "Mark activities complete to increase your progress.";
    }
  }

  function markComplete(key) {
    const prog = loadProgress();
    prog[key] = true;
    saveProgress(prog);
    renderProgress();
  }

  function resetProgress() {
    try { localStorage.removeItem(PROGRESS_KEY); } catch {}
    renderProgress();
  }

  // -------------------------
  // Checklist readiness
  // -------------------------
  const CHECK_KEY = "vtestPrepChecklist_v1";

  function loadChecklist() {
    try { return JSON.parse(localStorage.getItem(CHECK_KEY) || "{}"); } catch { return {}; }
  }
  function saveChecklist(obj) {
    try { localStorage.setItem(CHECK_KEY, JSON.stringify(obj)); } catch {}
  }

  function renderChecklistReady() {
    const checks = $$('input[type="checkbox"][data-check]');
    const state = loadChecklist();
    checks.forEach(cb => {
      cb.checked = !!state[cb.getAttribute("data-check")];
    });

    const allDone = checks.length > 0 && checks.every(cb => cb.checked);
    const dot = $("#readyDot");
    const txt = $("#readyText");
    if (dot) dot.classList.toggle("is-ready", allDone);
    if (txt) txt.textContent = allDone
      ? "Ready — you’ve reduced the biggest avoidable stress."
      : "Not ready yet — tick the checklist.";
  }

  function initChecklist() {
    const checks = $$('input[type="checkbox"][data-check]');
    if (!checks.length) return;

    renderChecklistReady();

    checks.forEach(cb => {
      cb.addEventListener("change", () => {
        const state = loadChecklist();
        state[cb.getAttribute("data-check")] = cb.checked;
        saveChecklist(state);
        renderChecklistReady();
      });
    });
  }

  function resetChecklist() {
    try { localStorage.removeItem(CHECK_KEY); } catch {}
    renderChecklistReady();
  }

  // -------------------------
  // Timers
  // -------------------------
  const timers = new Map();

  function initTimerBox(box) {
    const id = box.getAttribute("data-timer");
    if (!id) return;

    const display = $('[data-role="timerDisplay"]', box);
    const secondsAttr = box.getAttribute("data-seconds");
    const initialSeconds = secondsAttr ? parseInt(secondsAttr, 10) : parseFromDisplay(display);
    const state = {
      id,
      initialSeconds: isFinite(initialSeconds) ? initialSeconds : 60,
      remaining: isFinite(initialSeconds) ? initialSeconds : 60,
      running: false,
      interval: null,
      box,
      display,
      feedback: $('[data-role="timerFeedback"]', box),
    };

    timers.set(id, state);
    renderTimer(state);
  }

  function parseFromDisplay(display) {
    if (!display) return 60;
    const raw = display.textContent.trim();
    const parts = raw.split(":").map(n => parseInt(n, 10));
    if (parts.length === 2 && isFinite(parts[0]) && isFinite(parts[1])) return parts[0] * 60 + parts[1];
    return 60;
  }

  function renderTimer(state) {
    if (state.display) state.display.textContent = formatTime(state.remaining);
  }

  function stopTimer(id) {
    const st = timers.get(id);
    if (!st) return;
    st.running = false;
    if (st.interval) clearInterval(st.interval);
    st.interval = null;
  }

  function startTimer(id) {
    const st = timers.get(id);
    if (!st || st.running) return;

    st.running = true;
    const startAt = Date.now();

    st.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startAt) / 1000);
      const next = st.initialSeconds - elapsed;
      st.remaining = next;
      renderTimer(st);

      if (next <= 0) {
        stopTimer(id);
        st.remaining = 0;
        renderTimer(st);
        if (st.feedback) st.feedback.textContent = "Time. Finish your last sentence and move on.";
      }
    }, 250);

    if (st.feedback) st.feedback.textContent = "";
  }

  function resetTimer(id) {
    const st = timers.get(id);
    if (!st) return;
    stopTimer(id);
    st.remaining = st.initialSeconds;
    renderTimer(st);
    if (st.feedback) st.feedback.textContent = "";
  }

  function initTimers() {
    $$("[data-timer]").forEach(initTimerBox);
  }

  // -------------------------
  // TTS (Listening prompts)
  // -------------------------
  let currentUtterance = null;

  function pickEnglishVoice(prefer) {
    // prefer: "en-GB" or "en-US"
    const voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
    const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(prefer.toLowerCase()));
    if (preferred) return preferred;

    // fallback: any English voice
    const anyEn = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
    return anyEn || null;
  }

  function ttsStop() {
    try { speechSynthesis.cancel(); } catch {}
    currentUtterance = null;
  }

  function ttsPause() {
    try { speechSynthesis.pause(); } catch {}
  }

  function ttsSpeak(text, langPref = "en-GB") {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not available in this browser.");
      return;
    }

    ttsStop();

    const u = new SpeechSynthesisUtterance(text);
    // Wait for voices to load (some browsers load them async)
    const voice = pickEnglishVoice(langPref) || pickEnglishVoice("en-US");
    if (voice) u.voice = voice;
    u.rate = 0.98;
    u.pitch = 1.0;

    currentUtterance = u;
    speechSynthesis.speak(u);
  }

  function getListeningScripts(context) {
    // Context is subtle; keep prompts professional and realistic.
    const commonA = "Hello, this is Jordan from Operations. I’m calling because we need to move tomorrow’s meeting. The supplier confirmed a delay, so we’ll start at 2 p.m. instead of 10 a.m. Could you reply to confirm you can join at 2? If not, suggest another time this afternoon. Thanks.";
    const commonB = "Manager: Hi, could you update me on the project? Colleague: Sure. I’ll send you the revised schedule today. Manager: Great. Could you please send me the updated schedule by Friday? Colleague: Absolutely.";

    const byContext = {
      hospitality: {
        A: "Hello, this is Jordan from Reception. I’m calling because we need to move tomorrow’s briefing. A coach group is arriving later than planned, so we’ll start at 2 p.m. instead of 10 a.m. Could you reply to confirm you can join at 2? If not, suggest another time this afternoon. Thanks.",
        B: commonB,
      },
      transport: {
        A: "Hello, this is Jordan from Operations. I’m calling because we need to move tomorrow’s coordination meeting. The timetable has changed due to maintenance, so we’ll start at 2 p.m. instead of 10 a.m. Could you reply to confirm you can join at 2? If not, suggest another time this afternoon. Thanks.",
        B: commonB,
      },
      industry: {
        A: "Hello, this is Jordan from Production. I’m calling because we need to move tomorrow’s meeting. A component delivery was delayed, so we’ll start at 2 p.m. instead of 10 a.m. Could you reply to confirm you can join at 2? If not, suggest another time this afternoon. Thanks.",
        B: commonB,
      },
      sales: {
        A: "Hello, this is Jordan from Sales Ops. I’m calling because we need to move tomorrow’s meeting. The client asked for a later slot, so we’ll start at 2 p.m. instead of 10 a.m. Could you reply to confirm you can join at 2? If not, suggest another time this afternoon. Thanks.",
        B: commonB,
      },
      office: { A: commonA, B: commonB },
      general: { A: commonA, B: commonB },
    };

    return byContext[context] || byContext.general;
  }

  function initTTSButtons() {
    // Ensure voices are loaded (Chrome)
    if ("speechSynthesis" in window && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => { /* no-op */ };
    }
  }

  // -------------------------
  // MCQ + Fill interactions
  // -------------------------
  function lockAnswers(container) {
    $$(".vtest-answer", container).forEach(btn => (btn.disabled = true));
  }
  function unlockAnswers(container) {
    $$(".vtest-answer", container).forEach(btn => (btn.disabled = false));
  }

  function resetQuestion(qid) {
    const q = document.querySelector(`[data-qid="${qid}"]`);
    if (!q) return;

    unlockAnswers(q);
    $$(".vtest-answer", q).forEach(btn => {
      btn.classList.remove("is-correct", "is-wrong");
    });
    const fb = $(".vtest-feedback", q);
    if (fb) {
      fb.textContent = "";
      fb.classList.remove("good", "bad");
    }
  }

  function resetFill(fid) {
    const box = document.querySelector(`[data-fill-id="${fid}"]`);
    if (!box) return;

    box.classList.remove("is-filled");
    unlockAnswers(box);
    $$(".vtest-answer", box).forEach(btn => btn.classList.remove("is-correct", "is-wrong"));
    const fb = $(".vtest-feedback", box);
    if (fb) {
      fb.textContent = "";
      fb.classList.remove("good", "bad");
    }
  }

  function handleAnswerClick(btn) {
    const container = btn.closest(".vtest-question, .vtest-fill");
    if (!container) return;

    const fb = $(".vtest-feedback", container);
    const correct = btn.getAttribute("data-correct") === "true";

    // Mark clicked button
    btn.classList.add(correct ? "is-correct" : "is-wrong");

    // Show feedback
    if (fb) {
      fb.textContent = correct ? "✅ Correct." : "❌ Not quite. Try again next time.";
      fb.classList.toggle("good", correct);
      fb.classList.toggle("bad", !correct);
    }

    // If correct, lock; if wrong, lock only this button
    if (correct) {
      lockAnswers(container);
      // Fill-in blank display
      if (container.classList.contains("vtest-fill")) {
        container.classList.add("is-filled");
        const sentence = $(".vtest-sentence", container);
        if (sentence) {
          const blank = $(".blank", sentence);
          if (blank) blank.textContent = btn.textContent.trim();
        }
      }
    } else {
      btn.disabled = true;
    }
  }

  // -------------------------
  // Recorder (MediaRecorder)
  // -------------------------
  const recorders = new Map();

  async function recStart(recId) {
    const root = document.querySelector(`[data-recorder="${recId}"]`);
    if (!root) return;

    const startBtn = $(`[data-action="recStart"][data-rec-id="${recId}"]`);
    const stopBtn = $(`[data-action="recStop"][data-rec-id="${recId}"]`);
    const status = $('[data-role="recStatus"]', root);
    const download = $('[data-role="recDownload"]', root);

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      if (status) status.textContent = "Recording is not supported in this browser.";
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mr.onstop = () => {
        // Stop tracks
        stream.getTracks().forEach(t => t.stop());

        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (download) {
          download.href = url;
          download.hidden = false;
        }
        if (status) status.textContent = "Recording saved. You can download it above.";
      };

      recorders.set(recId, mr);
      mr.start();

      if (status) status.textContent = "Recording… Speak clearly and at a natural speed.";
      if (startBtn) startBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = false;
      if (download) download.hidden = true;
    } catch (err) {
      if (status) status.textContent = "Microphone permission denied or unavailable.";
      console.warn(err);
    }
  }

  function recStop(recId) {
    const mr = recorders.get(recId);
    const root = document.querySelector(`[data-recorder="${recId}"]`);
    if (!root) return;

    const startBtn = $(`[data-action="recStart"][data-rec-id="${recId}"]`);
    const stopBtn = $(`[data-action="recStop"][data-rec-id="${recId}"]`);
    const status = $('[data-role="recStatus"]', root);

    if (mr && mr.state !== "inactive") {
      mr.stop();
    }
    recorders.delete(recId);

    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (status && !status.textContent) status.textContent = "Stopped.";
  }

  // -------------------------
  // Writing self-check
  // -------------------------
  function countWords(text) {
    return (text || "").trim().split(/\s+/).filter(Boolean).length;
  }

  function writingCheck(selector) {
    const ta = document.querySelector(selector);
    if (!ta) return;

    const text = ta.value || "";
    const words = countWords(text);
    const lower = text.toLowerCase();

    const checks = [];
    const warnings = [];

    // very lightweight checks (not grammar-correcting; just structure)
    if (words < 60) warnings.push("Your text is quite short. Add one more detail or example.");
    if (words > 230) warnings.push("Your text is long. In timed tasks, shorter + clearer is often better.");

    if (/(hi|hello|dear)\b/.test(lower)) checks.push("✅ Greeting detected");
    else warnings.push("Add a greeting (Hello / Dear…).");

    if (/(thanks|thank you)/.test(lower)) checks.push("✅ Polite tone (thanks)");
    else warnings.push("Add a polite line (Thanks / Thank you…).");

    if (/(kind regards|best regards|sincerely|best wishes)/.test(lower)) checks.push("✅ Closing detected");
    else warnings.push("Add a closing (Kind regards / Best regards…).");

    // For the email task: propose two times (quick heuristic: detect two time expressions)
    const timeMatches = text.match(/\b(\d{1,2}(:\d{2})?\s?(am|pm)?)\b/gi) || [];
    if (timeMatches.length >= 2) checks.push("✅ You proposed multiple times/options");
    else warnings.push("Try proposing two alternative times (e.g., 2 pm / 4 pm).");

    const out = $("#writingFeedback") || $("#opinionStats");
    const targetOut = $("#writingFeedback") && selector === "#emailDraft" ? $("#writingFeedback") : $("#opinionStats");

    const box = targetOut || out;
    if (!box) return;

    const lines = [];
    lines.push(`<p><strong>Word count:</strong> ${words}</p>`);
    if (checks.length) lines.push(`<ul>${checks.map(x => `<li>${x}</li>`).join("")}</ul>`);
    if (warnings.length) lines.push(`<ul>${warnings.map(x => `<li>⚠️ ${x}</li>`).join("")}</ul>`);
    if (!warnings.length) lines.push(`<p>✅ Looks well-structured for a timed task.</p>`);

    box.innerHTML = lines.join("");
  }

  function wordCountUI(selector) {
    const ta = document.querySelector(selector);
    const stats = $("#opinionStats");
    if (!ta || !stats) return;

    const words = countWords(ta.value);
    stats.textContent = `Word count: ${words}`;
  }

  // -------------------------
  // Connector chips
  // -------------------------
  function insertAtCursor(textarea, snippet) {
    if (!textarea) return;
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);

    const needsSpace = before && !/\s$/.test(before);
    const insert = (needsSpace ? " " : "") + snippet + " ";
    textarea.value = before + insert + after;
    textarea.focus();
    const pos = (before + insert).length;
    textarea.setSelectionRange(pos, pos);
  }

  function initConnectorChips() {
    $$(".vtest-chiprow").forEach(row => {
      const targetSel = row.getAttribute("data-chip-target");
      const target = targetSel ? document.querySelector(targetSel) : null;
      if (!target) return;

      row.addEventListener("click", (e) => {
        const btn = e.target.closest(".vtest-chip");
        if (!btn) return;
        insertAtCursor(target, btn.textContent.trim());
      });
    });
  }

  // -------------------------
  // Vocabulary (icons)
  // -------------------------
  function vocabData(context) {
    // Always include a solid core; add a small context twist.
    const core = [
      { ico: "📅", word: "deadline", def: "the latest time something must be finished", ex: "The deadline is Friday at 5 pm." },
      { ico: "📍", word: "agenda", def: "the plan / list of topics for a meeting", ex: "Can you share the agenda in advance?" },
      { ico: "🧾", word: "invoice", def: "a document asking for payment", ex: "Please find the invoice attached." },
      { ico: "🧑‍💼", word: "stakeholder", def: "a person affected by a project or decision", ex: "We need stakeholder approval." },
      { ico: "🔁", word: "follow up", def: "to contact again to continue a discussion", ex: "I’ll follow up tomorrow morning." },
      { ico: "⚠️", word: "issue", def: "a problem to be solved", ex: "We need to resolve this issue quickly." },
      { ico: "✅", word: "confirm", def: "to say something is correct or agreed", ex: "Please confirm your availability." },
      { ico: "🤝", word: "negotiate", def: "to discuss to reach an agreement", ex: "We negotiated a better price." },
      { ico: "📈", word: "improve", def: "to make something better", ex: "We improved response times." },
      { ico: "🧭", word: "priority", def: "the most important thing to do first", ex: "Safety is our priority." },
    ];

    const extrasByContext = {
      hospitality: [
        { ico: "🛎️", word: "check-in", def: "the process of arriving and registering", ex: "Late check-in is possible on request." },
        { ico: "🧳", word: "booking", def: "a reservation", ex: "Your booking is confirmed." },
      ],
      industry: [
        { ico: "🏭", word: "production", def: "making goods in a factory", ex: "Production was delayed by a missing part." },
        { ico: "🧪", word: "quality control", def: "checking that something meets standards", ex: "Quality control flagged an issue." },
      ],
      sales: [
        { ico: "🧲", word: "lead", def: "a potential customer", ex: "We qualified the lead this morning." },
        { ico: "🛒", word: "quotation", def: "a price offer", ex: "I’ll send a quotation today." },
      ],
      transport: [
        { ico: "🚆", word: "timetable", def: "a schedule of departures/arrivals", ex: "The timetable has changed." },
        { ico: "🧭", word: "route", def: "the path from A to B", ex: "There’s a diversion on the route." },
      ],
      office: [
        { ico: "🗂️", word: "minutes", def: "a written record of a meeting", ex: "I’ll share the minutes after the call." },
        { ico: "📎", word: "attachment", def: "a file included with an email", ex: "See the attachment for details." },
      ],
      general: [],
    };

    return core.concat(extrasByContext[context] || []);
  }

  let vocabShowDefs = true;
  let vocabState = [];

  function rebuildVocabUI(context) {
    const grid = $("#vocabGrid");
    if (!grid) return;

    vocabState = vocabData(context);
    grid.innerHTML = vocabState.map(item => {
      const def = vocabShowDefs ? `<p class="vtest-vocab-def">${escapeHTML(item.def)}<br><span class="vtest-muted">${escapeHTML(item.ex)}</span></p>` : "";
      return `
        <div class="vtest-vocab-card">
          <div class="vtest-vocab-ico" aria-hidden="true">${item.ico}</div>
          <div>
            <p class="vtest-vocab-word">${escapeHTML(item.word)}</p>
            ${def}
          </div>
        </div>
      `;
    }).join("");
  }

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // -------------------------
  // Vocab quiz
  // -------------------------
  let vocabQuizItems = [];
  let vocabQuizScore = 0;
  let vocabQuizAnswered = 0;

  function makeVocabQuiz(context) {
    const items = vocabData(context);
    // pick 6 items
    const pick = shuffleArray(items).slice(0, 6);
    return pick.map((item, idx) => {
      const wrong = shuffleArray(items.filter(x => x.word !== item.word)).slice(0, 3);
      const options = shuffleArray([item, ...wrong]).map(x => x.def);
      return { id: `VQ${idx + 1}`, word: item.word, ico: item.ico, correctDef: item.def, options };
    });
  }

  function rebuildVocabQuiz(context) {
    const root = $("#vocabQuiz");
    if (!root) return;

    vocabQuizItems = makeVocabQuiz(context);
    vocabQuizScore = 0;
    vocabQuizAnswered = 0;
    safeText($("#vocabScore"), "");

    root.innerHTML = vocabQuizItems.map(q => `
      <div class="vtest-question vtest-vq" data-vqid="${q.id}">
        <p class="vtest-q">${q.ico} <strong>${escapeHTML(q.word)}</strong> means…</p>
        <div class="vtest-answers">
          ${q.options.map(def => `
            <button type="button" class="vtest-answer" data-vqopt="true" data-correct="${def === q.correctDef}">
              ${escapeHTML(def)}
            </button>
          `).join("")}
        </div>
        <p class="vtest-feedback" aria-live="polite"></p>
      </div>
    `).join("");
  }

  function vocabQuizReset() {
    const profile = loadProfile();
    rebuildVocabQuiz(profile.context);
  }

  function updateVocabScoreUI() {
    const out = $("#vocabScore");
    if (!out) return;
    out.textContent = `Score: ${vocabQuizScore} / ${vocabQuizItems.length}`;
  }

  // -------------------------
  // Mock test (adaptive mini)
  // -------------------------
  const mock = {
    running: false,
    idx: 0,
    score: 0,
    level: 1, // 1..3
    questions: [],
  };

  function buildMockQuestions(context) {
    // 3 difficulty tiers. We’ll pick 8 total as we go, based on performance.
    return {
      1: [
        { type: "mcq", skill: "Reading", prompt: "Choose the most professional reply:", stem: "“Can you send me the report?”", options: ["Yes, I send you it now.", "Sure — I’ll send it over this afternoon.", "I send to you later."], correct: 1, why: "Natural: 'send it over' + time phrase." },
        { type: "mcq", skill: "Listening", prompt: "Which word best completes the phrase?", stem: "Please ___ your availability.", options: ["confirm", "confirmate", "confirmation"], correct: 0, why: "'Confirm' is the verb." },
        { type: "input", skill: "Writing", prompt: "Rewrite in natural English:", stem: "“I come back to you tomorrow.”", answer: "I’ll get back to you tomorrow.", why: "Standard business phrase." },
      ],
      2: [
        { type: "mcq", skill: "Grammar", prompt: "Pick the best option:", stem: "We ___ the meeting to next Tuesday if needed.", options: ["will move", "move", "moving"], correct: 0, why: "Future decision / plan." },
        { type: "mcq", skill: "Reading", prompt: "What does this mean?", stem: "“Please acknowledge receipt.”", options: ["Please confirm you received it.", "Please pay immediately.", "Please read the attachment aloud."], correct: 0, why: "Acknowledge receipt = confirm arrival." },
        { type: "input", skill: "Vocabulary", prompt: "Type one synonym for 'important':", stem: "(e.g., key / essential / critical)", answers: ["key", "essential", "critical", "crucial", "vital"], why: "Multiple correct options." },
      ],
      3: [
        { type: "mcq", skill: "Tone", prompt: "Choose the most diplomatic sentence:", stem: "You need to say 'no' to a request.", options: ["No, impossible.", "I’m afraid that won’t be possible this week, but I can offer an alternative.", "I can’t."], correct: 1, why: "Polite refusal + solution." },
        { type: "mcq", skill: "Grammar", prompt: "Choose the correct form:", stem: "If we ___ earlier, we could avoid delays.", options: ["leave", "left", "will leave"], correct: 1, why: "Second conditional: If + past, would/could + base." },
        { type: "input", skill: "Writing", prompt: "Write a short closing line (5–10 words):", stem: "End an email politely.", answers: ["kind regards", "best regards", "sincerely", "best wishes", "many thanks"], why: "Many options work; include a polite closing." },
      ],
    };
  }

  function mockStart() {
    const profile = loadProfile();
    const bank = buildMockQuestions(profile.context);
    mock.questions = bank;
    mock.running = true;
    mock.idx = 0;
    mock.score = 0;
    mock.level = 1;
    renderMockNext();
  }

  function mockReset() {
    mock.running = false;
    mock.idx = 0;
    mock.score = 0;
    mock.level = 1;
    const stage = $("#mockStage");
    if (stage) stage.innerHTML = `<p class="vtest-muted">Press <strong>Start</strong> to begin.</p>`;
  }

  function chooseMockQuestion() {
    const pool = mock.questions[mock.level] || [];
    const q = pool[Math.floor(Math.random() * pool.length)];
    return q || null;
  }

  function renderMockNext() {
    const stage = $("#mockStage");
    if (!stage) return;

    if (mock.idx >= 8) {
      const pct = Math.round((mock.score / 8) * 100);
      stage.innerHTML = `
        <p><strong>Finished.</strong> Score: ${mock.score} / 8 (${pct}%).</p>
        <p class="vtest-muted">Tip: repeat and try to improve clarity + speed.</p>
      `;
      mock.running = false;
      return;
    }

    const q = chooseMockQuestion();
    if (!q) {
      stage.innerHTML = `<p class="vtest-muted">No questions available.</p>`;
      mock.running = false;
      return;
    }

    stage.innerHTML = renderMockQuestionHTML(q, mock.idx + 1);
    stage.dataset.currentType = q.type;
    stage.dataset.currentLevel = String(mock.level);
    stage.dataset.currentSkill = q.skill || "";
    stage.dataset.currentWhy = q.why || "";
    stage.dataset.currentCorrect = q.type === "mcq" ? String(q.correct) : "";
    stage.dataset.currentAnswer = q.type === "input" ? (q.answer || "") : "";
    stage.dataset.currentAnswers = q.type === "input" && q.answers ? JSON.stringify(q.answers) : "";
  }

  function renderMockQuestionHTML(q, n) {
    const head = `<p class="vtest-muted"><strong>Question ${n}/8</strong> • Difficulty ${mock.level} • ${escapeHTML(q.skill || "")}</p>`;
    const prompt = `<p class="vtest-q"><strong>${escapeHTML(q.prompt)}</strong></p><p>${escapeHTML(q.stem)}</p>`;

    if (q.type === "mcq") {
      const opts = q.options.map((opt, i) => `
        <button type="button" class="vtest-answer" data-mock="opt" data-idx="${i}">${escapeHTML(opt)}</button>
      `).join("");
      return `${head}${prompt}<div class="vtest-answers">${opts}</div><p class="vtest-feedback" data-mock="fb" aria-live="polite"></p>`;
    }

    if (q.type === "input") {
      return `${head}${prompt}
        <label class="vtest-field" style="margin-top:.65rem; display:block;">
          <span>Your answer</span>
          <input type="text" id="mockInput" placeholder="Type here..." style="width:100%; margin-top:.35rem; border-radius:.75rem; border:1px solid rgba(15,23,42,.18); padding:.55rem .6rem; font-size:.95rem;">
        </label>
        <div class="vtest-actions-row">
          <button type="button" class="vtest-secondary" data-mock="submit">Submit</button>
        </div>
        <p class="vtest-feedback" data-mock="fb" aria-live="polite"></p>`;
    }

    return `${head}<p class="vtest-muted">Unsupported question type.</p>`;
  }

  function mockJudge(correct) {
    mock.idx += 1;
    if (correct) {
      mock.score += 1;
      mock.level = clamp(mock.level + 1, 1, 3);
    } else {
      mock.level = clamp(mock.level - 1, 1, 3);
    }
    renderMockNext();
  }

  // -------------------------
  // Global actions
  // -------------------------
  function resetAll() {
    resetProgress();
    resetChecklist();

    // reset questions
    ["L1", "R1", "R2", "R3"].forEach(resetQuestion);
    ["L2"].forEach(resetFill);

    // reset timers
    timers.forEach((_, id) => resetTimer(id));

    // reset vocab quiz
    vocabQuizReset();

    // stop TTS
    ttsStop();

    // reset mock
    mockReset();

    // clear writing feedback
    const wf = $("#writingFeedback");
    if (wf) wf.innerHTML = "";
    const os = $("#opinionStats");
    if (os) os.textContent = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // -------------------------
  // Event delegation
  // -------------------------
  function bindEvents() {
    document.addEventListener("click", (e) => {
      const answer = e.target.closest(".vtest-answer");
      if (answer && (answer.closest(".vtest-question") || answer.closest(".vtest-fill") || answer.closest(".vtest-vq"))) {
        // Vocab quiz click is also a vtest-answer; handle separately by dataset
        if (answer.closest(".vtest-vq")) {
          handleAnswerClick(answer);
          // update vocab score once per question (when correct)
          const q = answer.closest(".vtest-vq");
          if (q && !q.dataset.scored) {
            const correct = answer.getAttribute("data-correct") === "true";
            if (correct) {
              vocabQuizScore += 1;
              vocabQuizAnswered += 1;
              q.dataset.scored = "true";
            } else {
              // only count when a correct answer happens, to encourage retry; but mark wrong attempts disabled in handler
            }
            updateVocabScoreUI();
          }
          return;
        }

        handleAnswerClick(answer);
        return;
      }

      const completeBtn = e.target.closest("[data-complete]");
      if (completeBtn) {
        markComplete(completeBtn.getAttribute("data-complete"));
        return;
      }

      const actionBtn = e.target.closest("[data-action]");
      if (actionBtn) {
        const action = actionBtn.getAttribute("data-action");

        if (action === "resetAll") return resetAll();
        if (action === "checklistReset") return resetChecklist();
        if (action === "print") return window.print();

        // timers
        if (action === "timerStart") return startTimer(actionBtn.getAttribute("data-timer-id"));
        if (action === "timerStop") return stopTimer(actionBtn.getAttribute("data-timer-id"));
        if (action === "timerReset") return resetTimer(actionBtn.getAttribute("data-timer-id"));

        // tts
        if (action === "ttsPlay") {
          const id = actionBtn.getAttribute("data-tts-id");
          const profile = loadProfile();
          const scripts = getListeningScripts(profile.context);
          const text = id === "listeningB" ? scripts.B : scripts.A;
          return ttsSpeak(text, profile.accent || "en-GB");
        }
        if (action === "ttsReplay") {
          const id = actionBtn.getAttribute("data-tts-id");
          const profile = loadProfile();
          const scripts = getListeningScripts(profile.context);
          const text = id === "listeningB" ? scripts.B : scripts.A;
          return ttsSpeak(text, profile.accent || "en-GB");
        }
        if (action === "ttsPlayText") {
          const sel = actionBtn.getAttribute("data-source");
          const el = sel ? document.querySelector(sel) : null;
          const profile = loadProfile();
          if (el) return ttsSpeak(el.textContent.trim(), profile.accent || "en-GB");
        }
        if (action === "ttsPause") return ttsPause();
        if (action === "ttsStop") return ttsStop();

        // reset tasks
        if (action === "resetQuestion") return resetQuestion(actionBtn.getAttribute("data-qid"));
        if (action === "resetFill") return resetFill(actionBtn.getAttribute("data-fill-id"));

        // recorder
        if (action === "recStart") return recStart(actionBtn.getAttribute("data-rec-id"));
        if (action === "recStop") return recStop(actionBtn.getAttribute("data-rec-id"));

        // writing tools
        if (action === "writingCheck") return writingCheck(actionBtn.getAttribute("data-target"));
        if (action === "wordCount") return wordCountUI(actionBtn.getAttribute("data-target"));

        // vocab controls
        if (action === "vocabShuffle") {
          const profile = loadProfile();
          vocabState = shuffleArray(vocabData(profile.context));
          return rebuildVocabUI(profile.context);
        }
        if (action === "vocabToggle") {
          vocabShowDefs = !vocabShowDefs;
          const profile = loadProfile();
          return rebuildVocabUI(profile.context);
        }
        if (action === "vocabQuizReset") return vocabQuizReset();

        // mock test
        if (action === "mockStart") return mockStart();
        if (action === "mockReset") return mockReset();
      }

      // mock submit button
      const mockSubmit = e.target.closest('[data-mock="submit"]');
      if (mockSubmit) {
        const stage = $("#mockStage");
        if (!stage) return;
        const answersJson = stage.dataset.currentAnswers || "";
        const accepted = answersJson ? JSON.parse(answersJson) : null;
        const canonical = (stage.dataset.currentAnswer || "").trim().toLowerCase();

        const input = $("#mockInput");
        const val = (input ? input.value : "").trim().toLowerCase();
        const correct = accepted ? accepted.some(a => val.includes(String(a).toLowerCase())) : (val === canonical);

        const fb = $('[data-mock="fb"]', stage);
        if (fb) {
          fb.textContent = correct ? "✅ Correct." : `❌ Not quite. Hint: ${stage.dataset.currentWhy || "Try a more natural phrase."}`;
          fb.classList.toggle("good", correct);
          fb.classList.toggle("bad", !correct);
        }
        setTimeout(() => mockJudge(correct), 600);
        return;
      }

      // mock MCQ option click
      const mockOpt = e.target.closest('[data-mock="opt"]');
      if (mockOpt) {
        const stage = $("#mockStage");
        if (!stage) return;
        const idx = parseInt(mockOpt.getAttribute("data-idx"), 10);
        const correctIdx = parseInt(stage.dataset.currentCorrect, 10);
        const correct = idx === correctIdx;

        $$('.vtest-answer[data-mock="opt"]', stage).forEach(btn => (btn.disabled = true));
        mockOpt.classList.add(correct ? "is-correct" : "is-wrong");

        const fb = $('[data-mock="fb"]', stage);
        if (fb) {
          fb.textContent = correct ? "✅ Correct." : `❌ Not quite. ${stage.dataset.currentWhy || ""}`;
          fb.classList.toggle("good", correct);
          fb.classList.toggle("bad", !correct);
        }

        setTimeout(() => mockJudge(correct), 650);
      }
    });
  }

  // -------------------------
  // Init
  // -------------------------
  function init() {
    applyHeroFromDataAttr();
    initProfileUI();
    initChecklist();
    initTimers();
    initConnectorChips();
    initTTSButtons();

    const profile = loadProfile();
    rebuildVocabUI(profile.context);
    rebuildVocabQuiz(profile.context);

    renderProgress();
    renderChecklistReady();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
