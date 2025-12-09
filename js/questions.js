(function () {
  const module = document.getElementById("questions-module");
  if (!module) return;

  /* ==========================
     MULTIPLE-CHOICE QUIZ LOGIC
  =========================== */
  const questions = module.querySelectorAll(".qt-question");
  const totalSpan = module.querySelector("#qt-total-count");
  const correctSpan = module.querySelector("#qt-correct-count");
  const showScoreBtn = module.querySelector("#qt-show-score");
  const resetQuizBtn = module.querySelector("#qt-reset-quiz");
  const finalScoreDiv = module.querySelector("#qt-final-score");

  let correctCount = 0;

  if (totalSpan) {
    totalSpan.textContent = questions.length.toString();
  }

  questions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".qt-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // prevent double counting
        if (q.dataset.done === "true") return;

        const chosen = btn.getAttribute("data-option");
        if (!chosen) return;

        q.classList.add("qt-question-answered");

        if (chosen === correct) {
          btn.classList.add("qt-correct-btn");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.remove("qt-feedback-error");
            feedback.classList.add("qt-feedback-ok");
          }
          correctCount++;
          if (correctSpan) {
            correctSpan.textContent = correctCount.toString();
          }
          q.dataset.done = "true";
        } else {
          btn.classList.add("qt-incorrect-btn");
          // highlight correct option
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("qt-correct-btn");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.remove("qt-feedback-ok");
            feedback.classList.add("qt-feedback-error");
          }
          q.dataset.done = "true";
        }

        setTimeout(() => {
          q.classList.remove("qt-question-answered");
        }, 350);
      });
    });
  });

  if (showScoreBtn && finalScoreDiv) {
    showScoreBtn.addEventListener("click", () => {
      const total = questions.length;
      let message = "Your score: " + correctCount + " / " + total + ".";
      if (correctCount === total) {
        message += " 🎉 Excellent! Your question forms are very strong.";
      } else if (correctCount >= Math.round(total * 0.7)) {
        message += " 👍 Good job. Review a few details and try again.";
      } else {
        message += " 💪 Keep practising the structures and vocabulary.";
      }
      finalScoreDiv.textContent = message;
      finalScoreDiv.classList.add("qt-fade-in");
    });
  }

  if (resetQuizBtn) {
    resetQuizBtn.addEventListener("click", () => {
      correctCount = 0;
      if (correctSpan) correctSpan.textContent = "0";
      if (finalScoreDiv) {
        finalScoreDiv.textContent = "";
        finalScoreDiv.classList.remove("qt-fade-in");
      }

      questions.forEach((q) => {
        delete q.dataset.done;
        q.classList.remove("qt-question-answered");
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".qt-feedback");
        buttons.forEach((b) => {
          b.classList.remove("qt-correct-btn", "qt-incorrect-btn");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("qt-feedback-ok", "qt-feedback-error");
        }
      });
    });
  }

  /* ==========================
     QUESTION BUILDER
  =========================== */
  const builderForm = module.querySelector("#qt-builder-form");
  const builderOutput = module.querySelector("#qt-builder-output");
  const builderResetBtn = module.querySelector("#qt-builder-reset");

  function buildQuestion() {
    if (!builderForm || !builderOutput) return;

    const tense = builderForm.tense.value || "present-simple";
    const verbOption = builderForm.verb.options[builderForm.verb.selectedIndex];
    const verb = verbOption.value || "work";
    const verbIng = verbOption.dataset.ing || (verb + "ing");
    const verbPP = verbOption.dataset.pp || (verb + "ed");
    const place = builderForm.place.value || "";
    const detail = builderForm.detail.value || "basic";

    let question = "";

    if (tense === "present-simple") {
      if (detail === "basic") {
        question = "Where do you " + verb + "?";
      } else {
        question = "Where do you " + verb + (place ? " " + place : "") + "?";
      }
    } else if (tense === "present-continuous") {
      if (detail === "basic") {
        question = "What are you " + verbIng + " right now?";
      } else {
        question =
          "What are you " + verbIng + (place ? " " + place : "") + " right now?";
      }
    } else if (tense === "present-perfect") {
      if (detail === "basic") {
        question = "How long have you " + verbPP + "?";
      } else {
        question =
          "How long have you " + verbPP + (place ? " " + place : "") + "?";
      }
    } else {
      question = "What do you " + verb + "?";
    }

    builderOutput.value = question;
    builderOutput.classList.add("qt-fade-in");
  }

  if (builderForm && builderOutput) {
    builderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      buildQuestion();
    });
  }

  if (builderResetBtn && builderForm && builderOutput) {
    builderResetBtn.addEventListener("click", () => {
      builderForm.reset();
      builderOutput.value = "";
      builderOutput.classList.remove("qt-fade-in");
    });
  }
})();
