/* =========================================================
   future-plans.js
   - Interactive quizzes with hints + explanations + score/reset
   - TTS listening buttons (listen/stop/pause/resume)
   - Trip plan builder + listening
========================================================= */
(function () {
  const root = document.querySelector(".fp-shell");
  if (!root) return;

  // --------------------------
  // Utilities
  // --------------------------
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  function safeText(x, fallback) {
    const v = (x || "").trim();
    return v ? v : fallback;
  }

  // --------------------------
  // TTS (Speech Synthesis)
  // --------------------------
  function speak(text) {
    if (!window.speechSynthesis) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    window.speechSynthesis.speak(u);
    return true;
  }

  function stopSpeak() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

  function pauseSpeak() {
    if (!window.speechSynthesis) return;
    // Some browsers only pause when currently speaking
    try { window.speechSynthesis.pause(); } catch (e) {}
  }

  function resumeSpeak() {
    if (!window.speechSynthesis) return;
    try { window.speechSynthesis.resume(); } catch (e) {}
  }

  // Generic TTS buttons using data attributes
  $$("[data-tts]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tts");
      const ta = document.getElementById(targetId);
      const text = (ta ? ta.value : "").trim();
      if (text) speak(text);
    });
  });
  $$("[data-tts-stop]").forEach((btn) => btn.addEventListener("click", stopSpeak));
  $$("[data-tts-pause]").forEach((btn) => btn.addEventListener("click", pauseSpeak));
  $$("[data-tts-resume]").forEach((btn) => btn.addEventListener("click", resumeSpeak));

  // --------------------------
  // Quiz engine
  // --------------------------
  function initQuiz(quizEl) {
    const questions = $$(".fp-q", quizEl);
    const scoreEl = $("[data-score]", quizEl);
    const totalEl = $("[data-total]", quizEl);
    const finalEl = $("[data-final]", quizEl);
    const showBtn = $("[data-show-score]", quizEl);
    const resetBtn = $("[data-reset-quiz]", quizEl);

    let score = 0;
    totalEl.textContent = String(questions.length);
    scoreEl.textContent = "0";
    if (finalEl) finalEl.textContent = "";

    function lock(q) {
      // MCQ buttons
      $$("button[data-option]", q).forEach((b) => (b.disabled = true));
      // Select questions keep select enabled, but disable check
      const checkBtn = $("[data-check]", q);
      if (checkBtn) checkBtn.disabled = true;
      q.setAttribute("data-answered", "1");
    }

    function unlock(q) {
      $$("button[data-option]", q).forEach((b) => {
        b.disabled = false;
        b.classList.remove("fp-btn-good", "fp-btn-bad");
      });
      const checkBtn = $("[data-check]", q);
      if (checkBtn) checkBtn.disabled = false;

      const sel = $("[data-select]", q);
      if (sel) sel.value = "";

      const fb = $(".fp-feedback", q);
      if (fb) fb.innerHTML = "";
      q.removeAttribute("data-answered");
    }

    function writeFeedback(q, ok) {
      const fb = $(".fp-feedback", q);
      if (!fb) return;

      const hint = q.getAttribute("data-hint") || "";
      const explain = q.getAttribute("data-explain") || "";

      if (ok) {
        fb.innerHTML =
          '<span class="fp-correct">✅ Correct!</span>' +
          (explain ? `<span class="fp-explain">${escapeHtml(explain)}</span>` : "");
      } else {
        fb.innerHTML =
          '<span class="fp-wrong">❌ Not quite.</span>' +
          (hint ? ` <span class="fp-hint">Clue: ${escapeHtml(hint)}</span>` : "") +
          (explain ? `<span class="fp-explain">${escapeHtml(explain)}</span>` : "");
      }
    }

    // MCQ behavior
    questions.forEach((q) => {
      const correct = q.getAttribute("data-correct");
      const btns = $$("button[data-option]", q);
      if (btns.length) {
        btns.forEach((btn) => {
          btn.addEventListener("click", () => {
            if (q.getAttribute("data-answered") === "1") return;
            const chosen = btn.getAttribute("data-option");
            const ok = chosen === correct;
            if (ok) score += 1;
            scoreEl.textContent = String(score);
            writeFeedback(q, ok);
            lock(q);
          });
        });
      }

      // Select + check behavior
      const checkBtn = $("[data-check]", q);
      const sel = $("[data-select]", q);
      if (checkBtn && sel) {
        checkBtn.addEventListener("click", () => {
          if (q.getAttribute("data-answered") === "1") return;
          const chosen = sel.value;
          const ok = chosen === correct;
          if (ok) score += 1;
          scoreEl.textContent = String(score);
          writeFeedback(q, ok);
          lock(q);
        });
      }
    });

    if (showBtn && finalEl) {
      showBtn.addEventListener("click", () => {
        finalEl.textContent = `You got ${score} out of ${questions.length}.`;
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        score = 0;
        scoreEl.textContent = "0";
        if (finalEl) finalEl.textContent = "";
        questions.forEach(unlock);
      });
    }

    return {
      reset: () => {
        score = 0;
        scoreEl.textContent = "0";
        if (finalEl) finalEl.textContent = "";
        questions.forEach(unlock);
      },
      stopTTS: stopSpeak,
    };
  }

  function escapeHtml(str) {
    return (str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  const quizControllers = [];
  $$("[data-quiz]").forEach((quizEl) => quizControllers.push(initQuiz(quizEl)));

  // --------------------------
  // Builder: plan your weekend trip
  // --------------------------
  const planForm = document.getElementById("fp-plan-form");
  const planOut = document.getElementById("fp-plan-output");
  const planReset = document.getElementById("fp-plan-reset");
  const planListen = document.getElementById("fp-plan-listen");
  const planStop = document.getElementById("fp-plan-stop");
  const planPause = document.getElementById("fp-plan-pause");
  const planResume = document.getElementById("fp-plan-resume");

  function buildPlanText(fd) {
    const name = safeText(fd.get("name"), "Fabrice");
    const destination = String(fd.get("destination") || "London");
    const transport = String(fd.get("transport") || "by train");
    const stay = String(fd.get("stay") || "a hotel");
    const arrangement = String(fd.get("arrangement") || "We’re meeting at the station at 10 a.m.");
    const intention = String(fd.get("intention") || "I’m going to pack tonight.");
    const promise = String(fd.get("promise") || "I’ll text you the details.");
    const compare = String(fd.get("compare") || "The train is faster than the coach.");

    // Keep it culturally natural + coherent for any option.
    return (
      `Plan for next weekend 🗓️\n\n` +
      `Hi! I’m ${name}. Next weekend, I’m going to ${destination} ${transport}.\n` +
      `${arrangement}\n` +
      `${intention}\n` +
      `I’m staying in ${stay}.\n` +
      `${compare}\n` +
      `${promise}\n\n` +
      `If anything changes, I’ll let you know.`
    );
  }

  if (planForm && planOut) {
    planForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(planForm);
      planOut.value = buildPlanText(fd);
    });
  }

  if (planReset && planForm && planOut) {
    planReset.addEventListener("click", () => {
      planForm.reset();
      planOut.value = "";
      stopSpeak();
    });
  }

  if (planListen && planOut) {
    planListen.addEventListener("click", () => {
      const text = (planOut.value || "").trim();
      if (text) speak(text);
    });
  }

  if (planStop) planStop.addEventListener("click", stopSpeak);
  if (planPause) planPause.addEventListener("click", pauseSpeak);
  if (planResume) planResume.addEventListener("click", resumeSpeak);

  // --------------------------
  // Global reset
  // --------------------------
  const globalReset = document.getElementById("fp-global-reset");
  if (globalReset) {
    globalReset.addEventListener("click", () => {
      stopSpeak();
      quizControllers.forEach((c) => c.reset && c.reset());
      if (planForm && planOut) {
        planForm.reset();
        planOut.value = "";
      }
      // Jump to top for a clean restart
      try { window.location.hash = "#top"; } catch (e) {}
    });
  }
})();
