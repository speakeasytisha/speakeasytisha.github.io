// Eric – Airport & Self-Introduction (Beginner) module
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
              "❌ That answer doesn’t sound right here. Think about meaning and grammar."
          );
        }
      });
    });

    // ===========================
    // CHOICE BUILDERS (paragraph + dialogue)
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
        const inputs = Array.from(
          step.querySelectorAll('input[data-free="true"]')
        );

        let allFilled = true;
        let allValid = true;

        // Selects: must be filled + match accepted answers list
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

        // Free text inputs: must be non-empty, but not grammar-checked
        inputs.forEach((inp) => {
          const value = normalizeSpaces(inp.value);
          if (!value) {
            allFilled = false;
          }
        });

        if (!allFilled) {
          setFeedback(
            step,
            "Please complete all fields before checking.",
            false
          );
          return;
        }

        if (!allValid) {
          handleIncorrect(
            step,
            step.dataset.hintWrong ||
              "❌ One of the options doesn’t sound natural here. Check tense, nationality or region."
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

        inputs.forEach((inp) => {
          const placeholder = inp.dataset.placeholder;
          const value = inp.value;
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
            const inputs = step.querySelectorAll('input[data-free="true"]');
            inputs.forEach((inp) => {
              inp.value = "";
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

    const selfBuilder = setupChoiceBuilder(
      "self",
      "self-preview",
      "self-reset",
      ["self-1", "self-2", "self-3", "self-4"]
    );
    if (selfBuilder) builders.push(selfBuilder);

    const dialogueBuilder = setupChoiceBuilder(
      "dialogue",
      "dialogue-preview",
      "dialogue-reset",
      ["dlg-1", "dlg-2", "dlg-3"]
    );
    if (dialogueBuilder) builders.push(dialogueBuilder);

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
            const inputs = item.querySelectorAll('input[data-free="true"]');
            inputs.forEach((inp) => {
              inp.value = "";
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
