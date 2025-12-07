// js/quiz-core.js
// Generic logic for multiple-choice quizzes + paragraph builders

document.addEventListener("DOMContentLoaded", function () {
  initMCQQuizzes();
  initParagraphBuilders();
});

/* ===========================
   MULTIPLE-CHOICE QUIZZES
   =========================== */

function initMCQQuizzes() {
  const quizzes = document.querySelectorAll(".mcq-quiz");

  quizzes.forEach((quiz) => {
    const questions = quiz.querySelectorAll(".mcq-question");
    const scoreValue = quiz.querySelector(".quiz-score-value");
    const scoreTotal = quiz.querySelector(".quiz-score-total");
    const resetBtn = quiz.querySelector(".quiz-reset");

    // Set total number of questions
    if (scoreTotal) scoreTotal.textContent = questions.length.toString();

    // Attach listeners to each question
    questions.forEach((question) => {
      const buttons = question.querySelectorAll("button[data-explain]");
      const feedback = question.querySelector(".feedback");

      buttons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const isCorrect = btn.getAttribute("data-correct") === "true";
          const explanation = btn.getAttribute("data-explain") || "";
          const alreadyAnswered = question.dataset.answered === "true";

          // Remove previous visual state
          buttons.forEach((b) => {
            b.classList.remove("is-chosen", "is-correct", "is-wrong");
          });

          // Mark chosen button
          btn.classList.add("is-chosen");
          btn.classList.add(isCorrect ? "is-correct" : "is-wrong");

          if (feedback) {
            feedback.textContent = explanation;
            feedback.classList.remove("is-correct", "is-wrong");
            feedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
          }

          // Store the result on the question
          question.dataset.answered = "true";
          question.dataset.correct = isCorrect ? "true" : "false";

          // Recalculate score (only count each question once)
          updateQuizScore(quiz, questions, scoreValue);
        });
      });
    });

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        questions.forEach((question) => {
          const buttons = question.querySelectorAll("button[data-explain]");
          const feedback = question.querySelector(".feedback");

          buttons.forEach((b) => {
            b.classList.remove("is-chosen", "is-correct", "is-wrong");
          });

          if (feedback) {
            feedback.textContent = "";
            feedback.classList.remove("is-correct", "is-wrong");
          }

          delete question.dataset.answered;
          delete question.dataset.correct;
        });

        if (scoreValue) scoreValue.textContent = "0";
      });
    }
  });
}

function updateQuizScore(quiz, questions, scoreValue) {
  if (!scoreValue) return;
  let score = 0;

  questions.forEach((question) => {
    if (question.dataset.correct === "true") {
      score += 1;
    }
  });

  scoreValue.textContent = score.toString();
}

/* ===========================
   PARAGRAPH BUILDERS
   =========================== */

function initParagraphBuilders() {
  const builders = document.querySelectorAll(".paragraph-builder");

  builders.forEach((builder) => {
    const generateBtn = builder.querySelector(".builder-generate");
    const resetBtn = builder.querySelector(".builder-reset");
    const output = builder.querySelector(".builder-output");

    if (generateBtn) {
      generateBtn.addEventListener("click", function () {
        const name = getBuilderValue(builder, "name");
        const age = getBuilderValue(builder, "age");
        const city = getBuilderValue(builder, "city");
        const job = getBuilderValue(builder, "job");
        const hobby = getBuilderValue(builder, "hobby");

        // Simple beginner-level paragraph
        let sentenceParts = [];

        if (name) {
          sentenceParts.push(`Hello, my name is ${name}.`);
        }
        if (age) {
          sentenceParts.push(`I am ${age} years old.`);
        }
        if (city) {
          sentenceParts.push(`I live in ${city}.`);
        }
        if (job) {
          sentenceParts.push(`I work as a ${job}.`);
        }
        if (hobby) {
          sentenceParts.push(`In my free time, I like ${hobby}.`);
        }

        const paragraph = sentenceParts.join(" ");
        if (output) {
          output.value = paragraph || "Please fill in at least one field.";
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        const inputs = builder.querySelectorAll("[data-builder-field]");
        inputs.forEach((input) => {
          if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
            input.value = "";
          }
        });
        if (output) output.value = "";
      });
    }
  });
}

function getBuilderValue(builder, fieldName) {
  const el = builder.querySelector(`[data-builder-field="${fieldName}"]`);
  if (!el) return "";
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
    return el.value.trim();
  }
  return "";
}
