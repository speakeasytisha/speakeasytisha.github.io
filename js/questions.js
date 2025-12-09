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
   /* ==========================
     QUESTION BUILDER
  =========================== */
  const builderForm = module.querySelector("#qt-builder-form");
  const builderOutput = module.querySelector("#qt-builder-output");
  const builderResetBtn = module.querySelector("#qt-builder-reset");

  // --- Helpers to keep every combination natural and correct ---

  function makePresentSimpleQuestion(verb, place, detail) {
    let question = "";
    const hasPlace = !!place;

    switch (verb) {
      case "work":
        if (detail === "basic") {
          question = "Where do you work?";
        } else {
          question =
            hasPlace && place !== "to London"
              ? "Do you work " + place + "?"
              : "Do you work full-time or part-time?";
        }
        break;

      case "live":
        if (detail === "basic") {
          question = "Where do you live?";
        } else {
          if (place === "in this city") {
            question = "Do you live in this city or outside the city?";
          } else {
            question = "Do you live in a house or an apartment?";
          }
        }
        break;

      case "study":
        if (detail === "basic") {
          question = "Where do you study?";
        } else {
          question =
            hasPlace && place !== "to London"
              ? "Do you study " + place + "?"
              : "Do you study in the evening or at the weekend?";
        }
        break;

      case "travel":
        if (detail === "basic") {
          question =
            place === "to London"
              ? "How often do you travel to London?"
              : "How often do you travel for work or for pleasure?";
        } else {
          question =
            place === "to London"
              ? "Do you travel to London for work or for holidays?"
              : "Which countries do you usually travel to?";
        }
        break;

      default:
        question = "Where do you " + verb + "?";
    }

    return question;
  }

  function makePresentContinuousQuestion(verb, place, detail) {
    const nowPhrase = detail === "basic" ? "now" : "at the moment";
    let question = "";
    const hasPlace = !!place && place !== "to London";

    switch (verb) {
      case "work":
        if (hasPlace) {
          question = "Are you working " + place + " " + nowPhrase + "?";
        } else {
          question = "Are you working " + nowPhrase + "?";
        }
        break;

      case "study":
        if (hasPlace) {
          question = "Are you studying " + place + " " + nowPhrase + "?";
        } else {
          question = "Are you studying " + nowPhrase + "?";
        }
        break;

      case "live":
        if (place === "in this city") {
          question = "Are you living in this city " + nowPhrase + "?";
        } else {
          question = "Are you living here " + nowPhrase + "?";
        }
        break;

      case "travel":
        if (place === "to London") {
          question = "Are you travelling to London " + nowPhrase + "?";
        } else {
          question = "Are you travelling " + nowPhrase + "?";
        }
        break;

      default:
        question = "What are you doing " + nowPhrase + "?";
    }

    return question;
  }

  function makePresentPerfectQuestion(verb, place, detail, verbPP) {
    let question = "";
    const hasPlace = !!place;

    // detail === "basic" → experience questions
    // detail === "extra" → duration / frequency questions
    if (detail === "basic") {
      switch (verb) {
        case "work":
          if (hasPlace && place !== "to London") {
            question = "Have you ever worked " + place + " before?";
          } else {
            question = "Have you ever worked in another country?";
          }
          break;

        case "live":
          if (place === "in this city") {
            question = "Have you ever lived in another city?";
          } else {
            question = "Have you ever lived in a big city?";
          }
          break;

        case "study":
          question =
            "Have you ever studied English with a private teacher before?";
          break;

        case "travel":
          if (place === "to London") {
            question = "Have you ever travelled to London?";
          } else {
            question = "Have you ever travelled to another country?";
          }
          break;

        default:
          question = "Have you ever " + verbPP + " like this before?";
      }
    } else {
      // detail === "extra" → duration / frequency
      switch (verb) {
        case "work":
          if (hasPlace && place !== "to London") {
            question = "How long have you worked " + place + "?";
          } else {
            question = "How long have you worked here?";
          }
          break;

        case "live":
          if (place === "in this city") {
            question = "How long have you lived in this city?";
          } else {
            question = "How long have you lived here?";
          }
          break;

        case "study":
          question = "How long have you studied English?";
          break;

        case "travel":
          if (place === "to London") {
            question = "How many times have you travelled to London?";
          } else {
            question = "How long have you been travelling for work?";
          }
          break;

        default:
          question = "How long have you " + verbPP + "?";
      }
    }

    return question;
  }

  function buildQuestion() {
    if (!builderForm || !builderOutput) return;

    const tense = builderForm.tense.value || "present-simple";
    const verbSelect = builderForm.verb;
    const verbOption = verbSelect.options[verbSelect.selectedIndex];
    const verb = verbOption.value || "work";
    const verbPP = verbOption.dataset.pp || verb + "ed";
    const place = builderForm.place.value || "";
    const detail = builderForm.detail.value || "basic";

    let question = "";

    if (tense === "present-simple") {
      question = makePresentSimpleQuestion(verb, place, detail);
    } else if (tense === "present-continuous") {
      question = makePresentContinuousQuestion(verb, place, detail);
    } else if (tense === "present-perfect") {
      question = makePresentPerfectQuestion(verb, place, detail, verbPP);
    } else {
      // fallback
      question = "Where do you " + verb + "?";
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
    builderResetBtn.addEventListener("click", function () {
      builderForm.reset();
      builderOutput.value = "";
      builderOutput.classList.remove("qt-fade-in");
    });
  }
})();
