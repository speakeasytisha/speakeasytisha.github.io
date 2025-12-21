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
      if (!("speechSynthesis" in window)) return false;
      const t = clean(text);
      if (!t) return false;

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(t);
      utter.lang = lang;

      const v = pickVoice(lang);
      if (v) utter.voice = v;

      utter.rate = rate;
      utter.pitch = pitch;

      window.speechSynthesis.speak(utter);
      return true;
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
    const root = $("#sfo-quiz-questions");
    if (!root) return;

    const questions = $$(".sfo-question", root);
    const totalEl = $("#sfo-total-count");
    const correctEl = $("#sfo-correct-count");
    const scoreBtn = $("#sfo-show-score");
    const resetBtn = $("#sfo-reset-quiz");
    const scoreOut = $("#sfo-final-score");

    const total = questions.length;
    if (totalEl) totalEl.textContent = String(total);

    let correct = 0;

    const setCorrect = () => {
      if (correctEl) correctEl.textContent = String(correct);
    };
    setCorrect();

    questions.forEach((q) => {
      const correctOpt = q.getAttribute("data-correct");
      const btns = $$("button", q);
      const feedback = $(".sfo-feedback", q);

      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (q.dataset.answered === "1") return;

          const picked = btn.getAttribute("data-option");
          const isCorrect = picked === correctOpt;

          q.dataset.answered = "1";
          btns.forEach((b) => (b.disabled = true));

          if (isCorrect) {
            correct += 1;
            btn.classList.add("is-correct");
            if (feedback) {
              feedback.textContent = "✅ Correct!";
              feedback.classList.remove("is-wrong");
              feedback.classList.add("is-correct");
            }
          } else {
            btn.classList.add("is-wrong");
            const correctBtn = btns.find((b) => b.getAttribute("data-option") === correctOpt);
            if (correctBtn) correctBtn.classList.add("is-correct");
            if (feedback) {
              feedback.textContent = "❌ Not quite. See the correct answer.";
              feedback.classList.remove("is-correct");
              feedback.classList.add("is-wrong");
            }
          }

          setCorrect();
        });
      });
    });

    if (scoreBtn) {
      scoreBtn.addEventListener("click", () => {
        const answered = questions.filter((q) => q.dataset.answered === "1").length;
        const pct = total ? Math.round((correct / total) * 100) : 0;
        if (scoreOut) {
          scoreOut.textContent =
            answered < total
              ? `You answered ${answered}/${total}. Current score: ${correct}/${total} (${pct}%).`
              : `Final score: ${correct}/${total} (${pct}%).`;
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        correct = 0;
        setCorrect();
        if (scoreOut) scoreOut.textContent = "";

        questions.forEach((q) => {
          q.dataset.answered = "";
          const feedback = $(".sfo-feedback", q);
          if (feedback) {
            feedback.textContent = "";
            feedback.classList.remove("is-correct", "is-wrong");
          }
          $$("button", q).forEach((b) => {
            b.disabled = false;
            b.classList.remove("is-correct", "is-wrong");
          });
        });

        TTS.stop();
      });
    }
  }

  // -------------------------
  // Adjective mini-quiz (select + check)
  // -------------------------
  function initAdjQuiz() {
    const root = $(".t101-adj-quiz");
    if (!root) return;

    const questions = $$(".t101-adj-question", root);
    const totalEl = $("#t101-adj-total");
    const scoreEl = $("#t101-adj-score");
    const resetBtn = $("#t101-adj-reset");

    const total = questions.length;
    if (totalEl) totalEl.textContent = String(total);

    let score = 0;
    const scored = new Set();

    const render = () => {
      if (scoreEl) scoreEl.textContent = String(score);
    };
    render();

    questions.forEach((q, idx) => {
      const correct = q.getAttribute("data-correct");
      const select = $("select", q);
      const btn = $(".t101-adj-check", q);
      const feedback = $(".t101-adj-feedback", q);

      if (!select || !btn) return;

      btn.addEventListener("click", () => {
        const val = clean(select.value);
        const ok = val === correct;

        const key = String(idx);
        if (!scored.has(key)) {
          if (ok) score += 1;
          scored.add(key);
          render();
        }

        select.classList.remove("is-correct", "is-wrong");
        if (feedback) feedback.classList.remove("is-correct", "is-wrong");

        if (ok) {
          select.classList.add("is-correct");
          if (feedback) {
            feedback.textContent = "✅ Correct.";
            feedback.classList.add("is-correct");
          }
        } else {
          select.classList.add("is-wrong");
          if (feedback) {
            feedback.textContent = `❌ Try again. Hint: the best choice is “${correct.toUpperCase()}”.`;
            feedback.classList.add("is-wrong");
          }
        }
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        score = 0;
        scored.clear();
        render();

        questions.forEach((q) => {
          const select = $("select", q);
          const feedback = $(".t101-adj-feedback", q);
          if (select) {
            select.selectedIndex = 0;
            select.classList.remove("is-correct", "is-wrong");
          }
          if (feedback) {
            feedback.textContent = "";
            feedback.classList.remove("is-correct", "is-wrong");
          }
        });

        TTS.stop();
      });
    }
  }

  // -------------------------
  // Adjective mini builder
  // -------------------------
  function initAdjBuilder() {
    const btn = $("#t101-adj-build");
    const reset = $("#t101-adj-builder-reset");
    const out = $("#t101-adj-output");

    if (!btn || !out) return;

    const get = (id) => clean($(id)?.value);

    function build() {
      const hotel = get("#t101-adj-hotel");
      const neighborhood = get("#t101-adj-neighborhood");
      const transport = get("#t101-adj-transport");
      const day = get("#t101-adj-day");
      const activity = get("#t101-adj-activity");

      const lines = [
        `Last weekend, I stayed in a ${hotel} hotel in a ${neighborhood} neighborhood.`,
        `Getting around was ${transport}, so everything felt ${day}.`,
        `The best part was ${activity}.`,
        `Overall, it was a really enjoyable trip — and I’d love to do it again.`
      ];

      out.value = lines.join(" ");
    }

    btn.addEventListener("click", build);

    if (reset) {
      reset.addEventListener("click", () => {
        ["#t101-adj-hotel", "#t101-adj-neighborhood", "#t101-adj-transport", "#t101-adj-day", "#t101-adj-activity"].forEach((id) => {
          const el = $(id);
          if (el && "selectedIndex" in el) el.selectedIndex = 0;
        });
        out.value = "";
      });
    }
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
      const name = v.name || "Alex";
      const airline = v.airline || "the airline";
      const destination = v.destination || "my destination";
      const luggage = v.luggage || "one suitcase";
      const seat = v.seat || "an aisle seat";

      return [
        "AIRLINE AGENT: Good morning. May I see your passport and ticket, please?",
        `YOU: Sure. My name is ${name}. I'm flying to ${destination} with ${airline}.`,
        "AIRLINE AGENT: Are you checking any bags today?",
        `YOU: Yes — ${luggage}.`,
        "AIRLINE AGENT: Any seat preference?",
        `YOU: If possible, ${seat}.`,
        "AIRLINE AGENT: Great. Here is your boarding pass. Your gate number is on the screen.",
        "YOU: Thank you! What time does boarding begin?"
      ].join("\n");
    }

    function tmplRental(v) {
      const name = v.name || "Alex";
      const company = v.company || "your company";
      const carType = v.carType || "compact car";
      const days = v.days || "3";
      const insurance = v.insurance || "No, thanks";
      const extras = v.extras || "No extras";

      return [
        "RENTAL AGENT: Hi! Welcome. Do you have a reservation?",
        `YOU: Yes. It's under ${name}. I booked with ${company}.`,
        "RENTAL AGENT: Great. What kind of car would you like?",
        `YOU: A ${carType}, please — for ${days} day(s).`,
        "RENTAL AGENT: Would you like to add insurance coverage?",
        `YOU: ${insurance}.`,
        "RENTAL AGENT: Any extras? GPS, child seat, or an additional driver?",
        `YOU: ${extras}.`,
        "RENTAL AGENT: Perfect. Please sign here. The car is in the lot outside.",
        "YOU: Thanks. Could you quickly confirm the fuel policy and where I return the car?"
      ].join("\n");
    }

    function tmplCustoms(v) {
      const origin = v.origin || "France";
      const purpose = v.purpose || "tourism";
      const duration = v.duration || "a week";
      const declare = v.declare || "No, I don't";
      const question = v.question || "No, thank you.";

      return [
        "OFFICER: Hello. Where are you arriving from?",
        `YOU: Hi. I'm arriving from ${origin}.`,
        "OFFICER: What's the purpose of your trip?",
        `YOU: I'm here for ${purpose}.`,
        "OFFICER: How long are you staying?",
        `YOU: ${duration}.`,
        "OFFICER: Do you have anything to declare?",
        `YOU: ${declare}.`,
        "OFFICER: Any questions before you go?",
        `YOU: ${question}`,
        "OFFICER: Alright. Enjoy your stay."
      ].join("\n");
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
