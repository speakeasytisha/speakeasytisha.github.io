(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let preferredLang = "en-US";
  const voiceSelect = $("#efs-voice");
  if (voiceSelect) {
    preferredLang = voiceSelect.value || "en-US";
    voiceSelect.addEventListener("change", () => {
      preferredLang = voiceSelect.value || "en-US";
    });
  }

  function pickVoice(lang) {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (!voices || !voices.length) return null;
    const exact = voices.find(v => (v.lang || "").toLowerCase() === (lang || "").toLowerCase());
    if (exact) return exact;
    const english = voices.find(v => (v.lang || "").toLowerCase().startsWith("en"));
    return english || null;
  }

  function speak(text) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text || ""));
      u.lang = preferredLang;
      const v = pickVoice(preferredLang);
      if (v) u.voice = v;
      u.rate = 0.95;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }

  const ttsDemoBtn = $("#efs-tts-demo");
  if (ttsDemoBtn) {
    ttsDemoBtn.addEventListener("click", () => {
      speak("Hi! Nice to meet you. Do you have any children?");
    });
  }

  $$("[data-speak]").forEach(btn => {
    btn.addEventListener("click", () => speak(btn.getAttribute("data-speak")));
  });

  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }

  function initQuiz(quizKey) {
    const set = document.querySelector(`.efs-qset[data-quiz="${quizKey}"]`);
    if (!set) return;

    const questions = $$(".efs-q", set);
    const totalEl = document.querySelector(`[data-score="${quizKey}-total"]`);
    const correctEl = document.querySelector(`[data-score="${quizKey}-correct"]`);
    const finalEl = document.querySelector(`[data-final="${quizKey}"]`);

    const btnShow = document.querySelector(`[data-show-score="${quizKey}"]`);
    const btnReset = document.querySelector(`[data-reset="${quizKey}"]`);

    const state = { total: questions.length, correct: 0, answered: new Set() };

    if (totalEl) totalEl.textContent = String(state.total);
    if (correctEl) correctEl.textContent = "0";

    function updateCorrect() {
      if (correctEl) correctEl.textContent = String(state.correct);
    }

    questions.forEach((q, qi) => {
      const correct = (q.getAttribute("data-correct") || "").trim().toLowerCase();
      const hint = q.getAttribute("data-hint") || "";
      const fb = $(".efs-feedback", q);
      const buttons = $$("button[data-option]", q);

      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          const opt = (btn.getAttribute("data-option") || "").trim().toLowerCase();
          const isRight = opt === correct;

          if (state.answered.has(qi)) return;
          state.answered.add(qi);

          buttons.forEach(b => b.disabled = true);

          if (isRight) {
            btn.classList.add("is-correct");
            fb.classList.add("ok");
            fb.textContent = "✅ Correct!";
            state.correct += 1;
            updateCorrect();
          } else {
            btn.classList.add("is-wrong");
            fb.classList.add("bad");
            const correctBtn = buttons.find(b => (b.getAttribute("data-option") || "").trim().toLowerCase() === correct);
            if (correctBtn) correctBtn.classList.add("is-correct");
            fb.textContent = "❌ Not quite. Hint: " + hint;
          }
        });
      });
    });

    if (btnShow) {
      btnShow.addEventListener("click", () => {
        const pct = Math.round((state.correct / state.total) * 100);
        const msg =
          pct === 100 ? "🌟 Perfect! Great job." :
          pct >= 75 ? "✅ Very good! Keep going." :
          pct >= 50 ? "👍 Good start. Review the hints and try again." :
          "💪 Keep practicing. Try the lesson again and repeat out loud.";
        if (finalEl) finalEl.textContent = `Score: ${state.correct}/${state.total} (${pct}%). ${msg}`;
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        state.correct = 0;
        state.answered.clear();
        updateCorrect();
        if (finalEl) finalEl.textContent = "";

        questions.forEach(q => {
          const fb = $(".efs-feedback", q);
          if (fb) {
            fb.textContent = "";
            fb.classList.remove("ok", "bad");
          }
          $$("button[data-option]", q).forEach(b => {
            b.disabled = false;
            b.classList.remove("is-correct", "is-wrong");
          });
        });
      });
    }
  }

  ["vocab", "numbers", "dates"].forEach(initQuiz);

  function initDnd(key) {
    const wrap = document.querySelector(`[data-dnd="${key}"]`);
    if (!wrap) return;

    const bank = $(".efs-dnd__bank", wrap);
    const chips = $$("[data-dnd-item]", bank);
    const drops = $$(".efs-drop", wrap);
    const checkBtn = document.querySelector(`[data-dnd-check="${key}"]`);
    const resetBtn = document.querySelector(`[data-dnd-reset="${key}"]`);
    const finalEl = document.querySelector(`[data-dnd-final="${key}"]`);

    const placed = new Map();

    function clearDropStyles() {
      drops.forEach(d => {
        const box = $(".efs-drop__box", d);
        box.classList.remove("is-over", "is-correct", "is-wrong");
      });
    }

    chips.forEach(chip => {
      chip.addEventListener("dragstart", (e) => {
        if (chip.classList.contains("is-placed")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", chip.getAttribute("data-dnd-item"));
        e.dataTransfer.effectAllowed = "move";
      });
    });

    drops.forEach(drop => {
      const box = $(".efs-drop__box", drop);
      const accept = drop.getAttribute("data-accept");

      box.addEventListener("dragover", (e) => { e.preventDefault(); box.classList.add("is-over"); });
      box.addEventListener("dragleave", () => box.classList.remove("is-over"));

      box.addEventListener("drop", (e) => {
        e.preventDefault();
        box.classList.remove("is-over");
        const itemKey = e.dataTransfer.getData("text/plain");
        if (!itemKey) return;
        if (placed.has(accept)) return;
        placed.set(accept, itemKey);
        box.textContent = itemKey;
        const chip = chips.find(c => c.getAttribute("data-dnd-item") === itemKey);
        if (chip) chip.classList.add("is-placed");
      });
    });

    function check() {
      clearDropStyles();
      let ok = 0;
      drops.forEach(drop => {
        const box = $(".efs-drop__box", drop);
        const accept = drop.getAttribute("data-accept");
        const got = placed.get(accept);
        if (!got) return;
        if (got === accept) { box.classList.add("is-correct"); ok += 1; }
        else { box.classList.add("is-wrong"); }
      });
      const total = drops.length;
      if (finalEl) finalEl.textContent = `Result: ${ok}/${total} correct (${Math.round((ok/total)*100)}%).`;
    }

    function reset() {
      clearDropStyles();
      placed.clear();
      drops.forEach(drop => $(".efs-drop__box", drop).textContent = "");
      chips.forEach(chip => chip.classList.remove("is-placed"));
      if (finalEl) finalEl.textContent = "";
    }

    if (checkBtn) checkBtn.addEventListener("click", check);
    if (resetBtn) resetBtn.addEventListener("click", reset);
  }

  initDnd("family");

  function initTypeGame(key) {
    const root = document.querySelector(`[data-typegame="${key}"]`);
    if (!root) return;

    const wordEl = $("[data-typegame-word]", root);
    const inputEl = $("[data-typegame-input]", root);
    const checkBtn = $("[data-typegame-check]", root);
    const nextBtn = $("[data-typegame-next]", root);
    const feedbackEl = $("[data-typegame-feedback]", root);
    const speakBtn = $("[data-typegame-speak]", root);
    const resetBtn = $("[data-typegame-reset]", root);

    const rounds = [
      { word: "twelve", n: 12 },
      { word: "seven", n: 7 },
      { word: "nineteen", n: 19 },
      { word: "twenty", n: 20 },
      { word: "fourteen", n: 14 },
      { word: "eleven", n: 11 },
      { word: "sixteen", n: 16 },
      { word: "three", n: 3 },
      { word: "eight", n: 8 }
    ];

    let idx = 0;
    let locked = false;

    function showRound() {
      const r = rounds[idx];
      wordEl.textContent = r.word;
      inputEl.value = "";
      feedbackEl.textContent = "";
      locked = false;
    }

    function check() {
      if (locked) return;
      const r = rounds[idx];
      const raw = (inputEl.value || "").trim();
      const got = Number(raw);
      if (!raw || Number.isNaN(got)) { feedbackEl.textContent = "Type digits (example: 12)."; return; }
      locked = true;
      feedbackEl.textContent = (got === r.n) ? "✅ Correct!" : `❌ Not quite. "${r.word}" = ${r.n}.`;
    }

    function next() { idx = (idx + 1) % rounds.length; showRound(); }
    function reset() { idx = 0; showRound(); }

    checkBtn.addEventListener("click", check);
    nextBtn.addEventListener("click", next);
    resetBtn.addEventListener("click", reset);
    speakBtn.addEventListener("click", () => speak(rounds[idx].word));

    showRound();
  }

  initTypeGame("nums");

  const daySelect = $("#efs-bday-day");
  if (daySelect) {
    daySelect.innerHTML = "";
    for (let d = 1; d <= 31; d++) {
      const opt = document.createElement("option");
      opt.value = String(d);
      opt.textContent = String(d);
      daySelect.appendChild(opt);
    }
  }

  function ordinal(n) {
    const s = ["th","st","nd","rd"];
    const v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }

  function formatDate(month, day, year, style) {
    const dd = Number(day);
    const ord = ordinal(dd);
    return (style === "us") ? `${month} ${ord}, ${year}` : `${dd} ${month} ${year}`;
  }

  const bdayForm = $("#efs-bday-form");
  const bdayOutput = $("#efs-bday-output");
  const bdayReset = $("#efs-bday-reset");
  const bdaySpeak = $("#efs-bday-speak");
  let lastBdayText = "";

  if (bdayForm && bdayOutput) {
    bdayForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (bdayForm.name.value || "").trim() || "I";
      const month = (bdayForm.month.value || "May").trim();
      const day = (bdayForm.day.value || "12").trim();
      const year = (bdayForm.year.value || "").trim() || "1990";
      const style = (bdayForm.style.value || "uk").trim();

      const dateStr = formatDate(month, day, year, style);
      const dd = Number(day);

      const line1 = (name === "I") ? `My birthday is in ${month}.` : `${name}'s birthday is in ${month}.`;
      const line2 = (name === "I") ? `My birthday is on ${month} ${ordinal(dd)}.` : `${name}'s birthday is on ${month} ${ordinal(dd)}.`;
      const line3 = (name === "I") ? `I was born in ${year}.` : `${name} was born in ${year}.`;

      lastBdayText = `${line1}\n${line2}\n(Format: ${dateStr})\n${line3}`;
      bdayOutput.value = lastBdayText;
    });
  }

  if (bdayReset && bdayForm && bdayOutput) {
    bdayReset.addEventListener("click", () => {
      bdayForm.reset();
      bdayOutput.value = "";
      lastBdayText = "";
    });
  }

  if (bdaySpeak) {
    bdaySpeak.addEventListener("click", () => {
      if (!lastBdayText) return;
      speak(lastBdayText.replace(/\n/g, " "));
    });
  }

  const diaForm = $("#efs-dialogue-form");
  const diaOut = $("#efs-dialogue-output");
  const diaReset = $("#efs-dialogue-reset");
  const diaSpeak = $("#efs-dialogue-speak");
  let lastDialogue = "";

  function kidsLine(kids) {
    const k = Number(kids);
    if (k === 0) return "I don’t have any children.";
    if (k === 1) return "I have one child.";
    return `I have ${k} children.`;
  }
  function siblingsLine(sibs) {
    const s = Number(sibs);
    if (s === 0) return "I don’t have any brothers or sisters.";
    if (s === 1) return "I have one brother or sister.";
    return `I have ${s} brothers and sisters.`;
  }
  function spouseLine(status) {
    if (status === "married") return "I’m married.";
    if (status === "in a relationship") return "I’m in a relationship.";
    return "I’m single.";
  }

  if (diaForm && diaOut) {
    diaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (diaForm.name.value || "").trim();
      if (!name) { diaOut.value = "Please type your name first 🙂"; return; }

      const age = (diaForm.age.value || "").trim();
      const live = (diaForm.live.value || "").trim();
      const status = diaForm.status.value || "single";
      const kids = diaForm.kids.value || "0";
      const sibs = diaForm.siblings.value || "0";
      const bday = diaForm.bday.value || "in May";
      const topic = diaForm.topic.value || "at work";

      const ageLine = age ? `I’m ${age} years old.` : "I’m … years old.";
      const liveLine = live ? `I live in ${live}.` : "I live in …";

      const text =
        `Small talk ${topic}:\n\n` +
        `Person A: Hi! Nice to meet you. What’s your name?\n` +
        `${name}: Hi! My name is ${name}. Nice to meet you too.\n` +
        `Person A: Where do you live?\n` +
        `${name}: ${liveLine}\n` +
        `Person A: How old are you?\n` +
        `${name}: ${ageLine}\n` +
        `Person A: Tell me about your family.\n` +
        `${name}: ${spouseLine(status)} ${kidsLine(kids)} ${siblingsLine(sibs)}\n` +
        `Person A: When is your birthday?\n` +
        `${name}: My birthday is ${bday}.\n` +
        `Person A: That’s nice! Thanks for sharing.\n` +
        `${name}: You’re welcome.\n`;

      lastDialogue = text;
      diaOut.value = text;
    });
  }

  if (diaReset && diaForm && diaOut) {
    diaReset.addEventListener("click", () => {
      diaForm.reset();
      diaOut.value = "";
      lastDialogue = "";
    });
  }

  if (diaSpeak) {
    diaSpeak.addEventListener("click", () => {
      if (!lastDialogue) return;
      speak(lastDialogue.replace(/\n/g, " "));
    });
  }

  const writing = document.querySelector('[data-writing="intro"]');
  if (writing) {
    const promptBtn = $('[data-writing-prompt]', writing);
    const checkBtn = $('[data-writing-check]', writing);
    const modelBtn = $('[data-writing-model]', writing);
    const resetBtn = $('[data-writing-reset]', writing);
    const promptBox = $('[data-writing-promptbox]', writing);
    const textArea = $('[data-writing-text]', writing);
    const feedback = $('[data-writing-feedback]', writing);
    const modelBox = $('[data-writing-modelbox]', writing);

    const prompts = [
      "You meet a new colleague. Introduce yourself and mention your family.",
      "You meet a neighbor in your building. Say where you live and talk about your family.",
      "You meet someone on a train. Make small talk and mention your birthday month."
    ];

    function setPrompt() {
      const p = prompts[Math.floor(Math.random() * prompts.length)];
      promptBox.textContent = "Prompt: " + p;
    }

    function checkMessage() {
      const t = (textArea.value || "").trim();
      if (!t) { feedback.textContent = "Write something first 🙂"; return; }
      const lower = t.toLowerCase();

      const checks = [
        { label: "Name (my name is…)", ok: /my name is|i am\s+[a-z]/i.test(t) },
        { label: "Where you live (I live in…)", ok: /i live in/i.test(lower) },
        { label: "Family word (mother/father/children/brother/sister…)", ok: /(mother|father|children|child|son|daughter|brother|sister|family|husband|wife|partner)/i.test(t) },
        { label: "Age (I’m … years old)", ok: /years old/i.test(lower) },
        { label: "A date/year (in 20.. / in May / on May 12th)", ok: /\bin\s+(19|20)\d{2}\b|\bin\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b|\bon\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\bon\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d/i.test(lower) }
      ];

      const okCount = checks.filter(c => c.ok).length;
      const lines = checks.map(c => `${c.ok ? "✅" : "⬜"} ${c.label}`).join("\n");
      const tip =
        okCount >= 4 ? "Great! Read it out loud twice." :
        okCount >= 2 ? "Good start. Add 1–2 missing parts above." :
        "Try again: keep it short and simple.";

      feedback.textContent = `Checklist:\n${lines}\n\nTip: ${tip}`;
    }

    function toggleModel() {
      const isHidden = modelBox.hasAttribute("hidden");
      if (isHidden) modelBox.removeAttribute("hidden");
      else modelBox.setAttribute("hidden", "");
    }

    function reset() {
      textArea.value = "";
      feedback.textContent = "";
      modelBox.setAttribute("hidden", "");
      setPrompt();
    }

    promptBtn.addEventListener("click", setPrompt);
    checkBtn.addEventListener("click", checkMessage);
    modelBtn.addEventListener("click", toggleModel);
    resetBtn.addEventListener("click", reset);

    setPrompt();
  }
})();