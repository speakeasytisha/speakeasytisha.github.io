// Past Continuous – interactive lesson module
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const quizItems = Array.from(document.querySelectorAll(".quiz-item"));
    const scoreCurrentEl = document.getElementById("score-current");
    const scoreTotalEl = document.getElementById("score-total");
    const resetAllBtn = document.getElementById("reset-all");

    let score = 0;
    const total = quizItems.length;
    if (scoreTotalEl) {
      scoreTotalEl.textContent = String(total);
    }

    function updateScore() {
      if (scoreCurrentEl) {
        scoreCurrentEl.textContent = String(score);
      }
    }

    function normalizeSpaces(str) {
      return (str || "").replace(/\s+/g, " ").trim();
    }

    function setFeedback(item, message, state) {
      if (!item) return;
      const fb = item.querySelector(".feedback");
      if (!fb) return;
      fb.textContent = message || "";
      fb.classList.remove("correct", "incorrect");
      if (state === true) {
        fb.classList.add("correct");
      } else if (state === false) {
        fb.classList.add("incorrect");
      }
    }

    function handleCorrect(item) {
      if (!item) return;
      if (item.dataset.scored === "true") {
        setFeedback(item, "✅ Correct!", true);
        return;
      }
      item.dataset.scored = "true";
      score += 1;
      updateScore();
      setFeedback(item, "✅ Correct!", true);
    }

    function handleIncorrect(item, hint) {
      if (!item) return;
      const msg =
        hint ||
        item.dataset.hintWrong ||
        "❌ Not quite. Read the sentence again and think about the context.";
      setFeedback(item, msg, false);
    }

    updateScore();

    // ===========================
    // MULTIPLE CHOICE
    // ===========================
    const mcButtons = Array.from(
      document.querySelectorAll('.quiz-item[data-type="mc"] .mc-option')
    );

    mcButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const item = btn.closest(".quiz-item");
        if (!item) return;

        if (item.dataset.scored === "true") {
          return;
        }

        const isCorrect = btn.dataset.correct === "true";
        const hintFromBtn = btn.dataset.hint || "";
        const siblings = item.querySelectorAll(".mc-option");

        if (isCorrect) {
          handleCorrect(item);
          btn.classList.add("chosen");
          siblings.forEach((b) => {
            b.disabled = true;
            if (b !== btn) {
              b.classList.remove("wrong");
            }
          });
        } else {
          handleIncorrect(item, hintFromBtn);
          btn.classList.add("wrong");
        }
      });
    });

    // ===========================
    // SELECT QUESTIONS
    // ===========================
    const selectChecks = Array.from(
      document.querySelectorAll('.quiz-item[data-type="select"] .check-select')
    );

    selectChecks.forEach((btn) => {
      btn.addEventListener("click", function () {
        const item = btn.closest(".quiz-item");
        if (!item) return;

        const select = item.querySelector("select");
        if (!select) return;

        const value = normalizeSpaces(select.value);
        if (!value) {
          setFeedback(
            item,
            "Please choose an option from the list before checking.",
            false
          );
          return;
        }

        const answersAttr = item.dataset.answers || "";
        const accepted = answersAttr
          .split("|")
          .map((s) => normalizeSpaces(s))
          .filter(Boolean);

        if (accepted.length && accepted.includes(value)) {
          handleCorrect(item);
        } else {
          handleIncorrect(
            item,
            item.dataset.hintWrong ||
              "❌ That word doesn’t sound right here. Think about time order, cause/result or grammar."
          );
        }
      });
    });

    // ===========================
    // CHOICE BUILDERS (dialogue + workday)
    // ===========================
    const builders = [];

    function setupChoiceBuilder(builderName, previewId, resetId, stepOrder) {
      const steps = Array.from(
        document.querySelectorAll(
          '.builder-step[data-builder="' + builderName + '"]'
        )
      );
      const preview = document.getElementById(previewId);
      const resetBtn = document.getElementById(resetId);
      const state = {};
      const defaultText =
        (preview && preview.dataset.defaultText) ||
        "Your text will appear here after you complete each step.";

      function updatePreview() {
        if (!preview) return;
        const lines = [];
        stepOrder.forEach((id) => {
          if (state[id]) {
            lines.push(state[id]);
          }
        });
        if (!lines.length) {
          preview.textContent = defaultText;
        } else {
          preview.textContent = lines.join("\n\n");
        }
      }

      function handleStep(step) {
        const template = step.dataset.template || "";
        if (!template) return;

        const selects = Array.from(step.querySelectorAll("select"));
        if (!selects.length) return;

        let allFilled = true;
        let allValid = true;

        selects.forEach((sel) => {
          const value = normalizeSpaces(sel.value);
          if (!value) {
            allFilled = false;
            return;
          }
          const answersAttr = sel.dataset.answers || "";
          if (answersAttr) {
            const accepted = answersAttr
              .split("|")
              .map((s) => normalizeSpaces(s))
              .filter(Boolean);
            if (!accepted.includes(value)) {
              allValid = false;
            }
          }
        });

        if (!allFilled) {
          setFeedback(
            step,
            "Please choose an option in each dropdown before checking.",
            false
          );
          return;
        }

        if (!allValid) {
          handleIncorrect(
            step,
            step.dataset.hintWrong ||
              "❌ One of the options doesn’t sound natural here. Check the tense, collocation or connector."
          );
          return;
        }

        let sentence = template;
        selects.forEach((sel) => {
          const placeholder = sel.dataset.placeholder;
          const value = sel.value;
          if (!placeholder) return;
          const pattern = new RegExp(placeholder, "g");
          sentence = sentence.replace(pattern, value);
        });

        const stepId = step.dataset.stepId || "";
        state[stepId] = sentence;
        updatePreview();
        handleCorrect(step);
        setFeedback(
          step,
          "✅ Great! This line has been added to your text.",
          true
        );
      }

      steps.forEach((step) => {
        const btn = step.querySelector(".builder-check-add");
        if (!btn) return;
        btn.addEventListener("click", function () {
          handleStep(step);
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          steps.forEach((step) => {
            const selects = step.querySelectorAll("select");
            selects.forEach((sel) => {
              sel.selectedIndex = 0;
            });
            delete step.dataset.scored;
            setFeedback(step, "", null);
          });
          Object.keys(state).forEach((key) => delete state[key]);
          updatePreview();
        });
      }

      updatePreview();

      return {
        name: builderName,
        state,
        updatePreview,
      };
    }

    const alibiBuilder = setupChoiceBuilder(
      "alibi",
      "alibi-preview",
      "alibi-reset",
      ["al-1", "al-2", "al-3", "al-4"]
    );
    if (alibiBuilder) builders.push(alibiBuilder);

    const storyBuilder = setupChoiceBuilder(
      "story",
      "story-preview",
      "story-reset",
      ["st-1", "st-2", "st-3", "st-4"]
    );
    if (storyBuilder) builders.push(storyBuilder);

    // ===========================
    // TEXT-TO-SPEECH CONTROLS
    // ===========================
    const ttsGroups = Array.from(document.querySelectorAll(".tts-controls"));
    const synth = window.speechSynthesis;
    const hasTts =
      typeof synth !== "undefined" &&
      typeof window.SpeechSynthesisUtterance !== "undefined";

    function speakTarget(targetId) {
      const el = document.getElementById(targetId);
      if (!el) return;
      const text = (el.textContent || "").trim();
      if (!text) return;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      synth.speak(utter);
    }

    if (ttsGroups.length) {
      if (!hasTts) {
        ttsGroups.forEach((group) => {
          const note = document.createElement("p");
          note.className = "tts-note";
          note.textContent =
            "Speech playback is not available in this browser.";
          group.appendChild(note);
          const buttons = group.querySelectorAll("button");
          buttons.forEach((btn) => {
            btn.disabled = true;
          });
        });
      } else {
        ttsGroups.forEach((group) => {
          const targetId = group.dataset.target;
          if (!targetId) return;
          const buttons = group.querySelectorAll(".tts-btn");
          buttons.forEach((btn) => {
            const action = btn.dataset.action;
            btn.addEventListener("click", function () {
              if (!targetId) return;
              if (action === "play") {
                synth.cancel();
                speakTarget(targetId);
              } else if (action === "pause") {
                synth.pause();
              } else if (action === "restart") {
                synth.cancel();
                speakTarget(targetId);
              }
            });
          });
        });
      }
    }

    // ===========================
    // RESET ALL
    // ===========================
    if (resetAllBtn) {
      resetAllBtn.addEventListener("click", function () {
        score = 0;
        updateScore();

        quizItems.forEach((item) => {
          delete item.dataset.scored;
          setFeedback(item, "", null);

          const type = item.dataset.type;

          if (type === "mc") {
            const buttons = item.querySelectorAll(".mc-option");
            buttons.forEach((b) => {
              b.disabled = false;
              b.classList.remove("chosen", "wrong");
            });
          }

          if (type === "select") {
            const select = item.querySelector("select");
            if (select) {
              select.selectedIndex = 0;
            }
          }

          if (type === "builder") {
            const selects = item.querySelectorAll("select");
            selects.forEach((sel) => {
              sel.selectedIndex = 0;
            });
          }
        });

        // Reset builder states & previews
        builders.forEach((builder) => {
          Object.keys(builder.state).forEach((key) => delete builder.state[key]);
          builder.updatePreview();
        });

        // Stop any speaking
        if (hasTts) {
          synth.cancel();
        }
      });
    }
  });
})();
