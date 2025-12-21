/* =========================================================
   travel101.js
   Interactive logic for Travel 101 page
   - Vocabulary MCQ quiz
   - Dialogue builders (check-in, car rental, immigration/customs)
   - Adjective mini-quiz + short builder
   - Optional TTS (en-US)
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clean = (v) => String(v ?? "").trim().replace(/\s+/g, " ");

  // -------------------------
  // TTS (American English)
  // -------------------------
  const TTS = (() => {
    let voices = [];
    let ready = false;

    function loadVoices() {
      voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      ready = voices.length > 0;
      return voices;
    }

    if ("speechSynthesis" in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    function pickVoice(preferredLang = "en-US") {
      if (!("speechSynthesis" in window)) return null;
      if (!ready) loadVoices();

      // exact match
      let v = voices.find((x) => (x.lang || "").toLowerCase() === preferredLang.toLowerCase());
      if (v) return v;

      // any English voice
      v = voices.find((x) => (x.lang || "").toLowerCase().startsWith("en-"));
      return v || null;
    }

    
    function speak(text, { lang = "en-US", rate = 1, pitch = 1 } = {}) {
      if (!("speechSynthesis" in window)) return;

      const raw = (text || "").toString().trim();
      if (!raw) return;

      const clean = raw.replace(/\s+/g, " ").trim();

      // Some browsers (notably iOS/Safari) sometimes need a short delay until voices are ready.
      const voicesNow = speechSynthesis.getVoices();
      if (!voicesNow || voicesNow.length === 0) {
        loadVoices();
        // Try once more shortly after voices load
        setTimeout(() => {
          const again = speechSynthesis.getVoices();
          if (again && again.length) {
            speak(clean, { lang, rate, pitch });
          }
        }, 250);
        return;
      }

      stop();

      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = lang;

      const v = pickVoice(lang);
      if (v) utter.voice = v;

      utter.rate = rate;
      utter.pitch = pitch;

      utter.onend = () => {
        // reset pause state in some browsers
      };

      speechSynthesis.speak(utter);
    }

    function pause() {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.pause();
    }

    function resume() {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.resume();
    }

    function stop() {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
    }

    return { speak, pause, resume, stop };
  })();

  // -------------------------
  // MCQ Quiz (buttons)
  // -------------------------
  
  function initMcqQuiz() {
    // Supports two markup variants:
    // A) container .sfo-mcq with .sfo-question[data-answer] + buttons[data-option]
    // B) #sfo-quiz-questions with .sfo-question[data-correct] + buttons[data-choice]
    const quizContainers = $$(".sfo-mcq");
    const legacyQuestions = $$("#sfo-quiz-questions .sfo-question");

    // If there's no container, we still run the "legacy" questions behavior.
    if (!quizContainers.length && !legacyQuestions.length) return;

    // Helper to wire a set of questions + a summary element
    function wireQuestions(questions, summaryEl) {
      const total = questions.length;
      let correctCount = 0;
      let answeredCount = 0;

      const updateSummary = () => {
        if (!summaryEl) return;
        summaryEl.textContent = `Score: ${correctCount} / ${total}`;
      };

      updateSummary();

      questions.forEach((q) => {
        const correctKey = ((q.dataset.answer || q.dataset.correct || "") + "").trim().toLowerCase();
        const explain = (q.dataset.explain || "").trim();
        const feedback = $(".sfo-feedback", q) || $(".feedback", q);

        const btns = $$("button", q);
        btns.forEach((btn) => {
          btn.addEventListener("click", () => {
            if (q.dataset.answered === "true") return;

            const choiceKey = ((btn.dataset.option || btn.dataset.choice || "") + "").trim().toLowerCase();
            const isCorrect = correctKey && choiceKey === correctKey;

            q.dataset.answered = "true";
            answeredCount += 1;
            if (isCorrect) correctCount += 1;

            // Disable buttons and add visual state
            btns.forEach((b) => {
              b.disabled = true;
              b.classList.remove("is-correct", "is-wrong");
            });

            // Mark chosen + correct answer
            btn.classList.add(isCorrect ? "is-correct" : "is-wrong");
            const correctBtn = btns.find((b) => {
              const key = ((b.dataset.option || b.dataset.choice || "") + "").trim().toLowerCase();
              return key === correctKey;
            });
            if (correctBtn) correctBtn.classList.add("is-correct");

            if (feedback) {
              const base = isCorrect ? "✅ Correct!" : "❌ Not quite.";
              feedback.textContent = explain ? `${base} ${explain}` : base;
              feedback.style.display = "block";
            }

            updateSummary();
          });
        });
      });
    }

    // Variant A: .sfo-mcq containers
    quizContainers.forEach((quiz) => {
      const questions = $$(".sfo-question", quiz);
      if (!questions.length) return;

      const summary = $(".sfo-score", quiz) || $(".sfo-quiz-summary", quiz);
      wireQuestions(questions, summary);
    });

    // Variant B: legacy (no container)
    if (legacyQuestions.length) {
      let summary = $(".sfo-quiz-summary");
      if (!summary) {
        const host = $("#sfo-quiz-questions");
        if (host) {
          summary = document.createElement("div");
          summary.className = "sfo-quiz-summary";
          summary.setAttribute("aria-live", "polite");
          host.insertAdjacentElement("afterend", summary);
        }
      }
      wireQuestions(legacyQuestions, summary);
    }
  }

  // -------------------------
  // Adjective mini-quiz (select + check)
  // -------------------------
  
  
  function initAdjQuiz() {
    // Travel101 adjective quiz (select + check button)
    const quiz = $(".t101-adj-quiz");
    if (!quiz) return;

    const questions = $$(".t101-adj-question", quiz);
    if (!questions.length) return;

    // Inject a running score box
    let summary = $(".t101-quiz-summary", quiz);
    if (!summary) {
      summary = document.createElement("div");
      summary.className = "t101-quiz-summary";
      summary.setAttribute("aria-live", "polite");
      quiz.appendChild(summary);
    }

    const total = questions.length;
    let correctCount = 0;

    const update = () => {
      summary.textContent = `Score: ${correctCount} / ${total}`;
    };
    update();

    questions.forEach((q) => {
      const correctKey = ((q.dataset.correct || "") + "").trim().toLowerCase();
      const explain = (q.dataset.explain || "").trim();
      const select = $("select", q);
      const checkBtn = $(".t101-adj-check", q);
      const feedback = $(".t101-adj-feedback", q);

      if (!select || !checkBtn || !feedback) return;

      checkBtn.addEventListener("click", () => {
        if (q.dataset.answered === "true") return;

        const choice = ((select.value || "") + "").trim().toLowerCase();
        if (!choice) return;

        const isCorrect = correctKey && choice === correctKey;

        q.dataset.answered = "true";
        if (isCorrect) correctCount += 1;
        update();

        // Lock this question (exam-like)
        select.disabled = true;
        checkBtn.disabled = true;

        feedback.classList.remove("is-correct", "is-wrong");
        feedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
        const base = isCorrect ? "✅ Correct!" : "❌ Not quite.";
        feedback.textContent = explain ? `${base} ${explain}` : base;
      });
    });
  }

  // -------------------------
  // Adjective mini builder
  // -------------------------
  
  function initAdjBuilder() {
    // Travel101 paragraph builder (t101-adj-builder)
    const root = $(".t101-adj-builder");
    if (root) {
      const overall = $("#t101-adj-overall");
      const flight = $("#t101-adj-flight");
      const airport = $("#t101-adj-airport");
      const hotel = $("#t101-adj-hotel");

      const output = $("#t101-adj-output");
      const btnGen = $("#t101-adj-generate");
      const btnReset = $("#t101-adj-reset");
      const btnListen = $("#t101-adj-listen");
      const btnPause = $("#t101-adj-pause");

      if (overall && flight && airport && hotel && output && btnGen && btnReset && btnListen && btnPause) {
        const buildText = () => {
          const o = overall.value;
          const f = flight.value;
          const a = airport.value;
          const h = hotel.value;

          const text =
            `Overall, the trip was ${o}. ` +
            `The flight itself was ${f}, and the airport experience felt ${a}. ` +
            `As for accommodation, the hotel was ${h}. ` +
            `If I had to sum it up in one sentence: a realistic journey with useful lessons for next time.`;

          output.value = text;
          return text;
        };

        btnGen.addEventListener("click", () => buildText());

        btnReset.addEventListener("click", () => {
          // reset selects to first real option (index 0 is placeholder)
          [overall, flight, airport, hotel].forEach((sel) => {
            sel.selectedIndex = 0;
          });
          output.value = "";
          TTS.stop();
        });

        btnListen.addEventListener("click", () => {
          const text = output.value.trim() ? output.value : buildText();
          TTS.speak(text, { lang: "en-US" });
        });

        btnPause.addEventListener("click", () => {
          if (TTS.isPaused()) {
            TTS.resume();
            btnPause.textContent = "Pause";
          } else if (TTS.isSpeaking()) {
            TTS.pause();
            btnPause.textContent = "Resume";
          }
        });
      }
    }

    // Back-compat: older "sfo-adj-builder" IDs (if you reuse this JS elsewhere)
    const legacyForm = $("#sfo-adj-builder");
    if (!legacyForm) return;

    // If it exists, keep the previous behavior (optional).
    // (No-op here because this page uses the t101 builder.)
  }

  // -------------------------
  // Dialogue builders (forms)
  // -------------------------
  function initDialogueBuilders() {
    const forms = $$(".sfo-builder-form");
    if (!forms.length) return;

    function readFormValues(form) {
      const v = {};
      $$("input, select, textarea", form).forEach((el) => {
        const name = el.getAttribute("name");
        if (!name) return;
        v[name] = clean(el.value);
      });
      return v;
    }

    
  function tmplCheckIn(v) {
    const name = v.name || "traveler";
    const airline = v.airline || "United";
    const destination = v.destination || "San Francisco";
    const seat = v.seat || "an aisle seat";
    const bags = v.bags || "one suitcase";

    return (
      `Check-in agent: Good morning. Where are you flying today?\n` +
      `${name}: Hi! I'm flying to ${destination} with ${airline}.\n` +
      `Check-in agent: Great. Do you have any bags to check?\n` +
      `${name}: Yes, I have ${bags}.\n` +
      `Check-in agent: Perfect. Would you like ${seat}?\n` +
      `${name}: Yes, please.\n` +
      `Check-in agent: All set—here’s your boarding pass. Have a great flight!\n` +
      `${name}: Thank you!`
    );
  }

    
  function tmplRental(v) {
    const name = v.name || "traveler";
    const company = v.company || "Hertz";
    const car = v.car || "a compact car";
    const length = v.length || "3 days";
    const insurance = v.insurance || "basic coverage";
    const extras = v.extras || "no extras";

    return (
      `Agent: Welcome! Do you have a reservation?\n` +
      `${name}: Yes—it's under ${name}.\n` +
      `Agent: Great. You booked ${car} with ${company} for ${length}. Is that correct?\n` +
      `${name}: Yes, that's right.\n` +
      `Agent: Would you like to add ${insurance}?\n` +
      `${name}: ${insurance === "no insurance" ? "No, thanks." : "Yes, please."}\n` +
      `Agent: Any extras today—GPS, child seat?\n` +
      `${name}: ${extras === "no extras" ? "No, thank you." : "Yes, I'd like " + extras + "."}\n` +
      `Agent: Perfect. Here are the keys—your car is in row B.`
    );
  }

    
  function tmplCustoms(v) {
    const name = v.name || "traveler";
    const origin = v.origin || "France";
    const purpose = v.purpose || "tourism";
    const length = v.length || "a week";
    const declare = v.declare || "nothing to declare";
    const security = v.security || "No, thank you.";

    return (
      `Officer: Next, please. Passport.\n` +
      `${name}: Here you go.\n` +
      `Officer: Where are you coming from?\n` +
      `${name}: I'm coming from ${origin}.\n` +
      `Officer: What's the purpose of your trip?\n` +
      `${name}: ${purpose}.\n` +
      `Officer: How long are you staying?\n` +
      `${name}: ${length}.\n` +
      `Officer: Do you have anything to declare?\n` +
      `${name}: ${declare}.\n` +
      `Officer: Any electronics or liquids in your carry-on?\n` +
      `${name}: ${security}\n` +
      `Officer: Alright. Enjoy your stay.`
    );
  }

    forms.forEach((form) => {
      const outputId = form.getAttribute("data-output");
      const output = outputId ? document.getElementById(outputId) : null;
      const type = form.getAttribute("data-type");

      if (!output) return;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = readFormValues(form);

        let text = "";
        if (type === "checkin") text = tmplCheckIn(v);
        else if (type === "rental") text = tmplRental(v);
        else if (type === "customs") text = tmplCustoms(v);
        else text = "Builder template not found.";

        output.value = text;
      });

      // Wire listen/pause/reset within the same builder block
      const builder = form.closest(".sfo-builder");
      if (!builder) return;

      const listenBtn = $(".sfo-listen", builder);
      const pauseBtn = $(".sfo-pause", builder);
      const resetBtn = $(".sfo-reset", builder);

      if (listenBtn) {
        listenBtn.addEventListener("click", () => {
          if (!output.value) form.dispatchEvent(new Event("submit", { cancelable: true }));
          TTS.speak(output.value, { lang: "en-US" });
          if (pauseBtn) pauseBtn.textContent = "⏸ Pause";
        });
      }

      if (pauseBtn) {
        pauseBtn.addEventListener("click", () => {
          if (!("speechSynthesis" in window)) return;

          if (window.speechSynthesis.paused) {
            TTS.resume();
            pauseBtn.textContent = "⏸ Pause";
          } else if (window.speechSynthesis.speaking) {
            TTS.pause();
            pauseBtn.textContent = "▶️ Resume";
          }
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          $$("input, textarea", form).forEach((el) => (el.value = ""));
          $$("select", form).forEach((el) => (el.selectedIndex = 0));
          output.value = "";
          if (pauseBtn) pauseBtn.textContent = "⏸ Pause";
          TTS.stop();
        });
      }
    });
  }

  // -------------------------
  // Boot
  // -------------------------
  document.addEventListener("DOMContentLoaded", () => {
    initMcqQuiz();
    initAdjQuiz();
    initAdjBuilder();
    initDialogueBuilders();
  });
})();
