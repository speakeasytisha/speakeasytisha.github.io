// THEME – RESTAURANT OF THE YEAR
// Interactive quizzes + builder + score + audio

document.addEventListener("DOMContentLoaded", function () {
  const scoreValueEl = document.getElementById("score-value");
  const scoreTotalEl = document.getElementById("score-total");
  const resetAllBtn = document.getElementById("reset-all");

  const questions = Array.from(document.querySelectorAll(".question"));
  let score = 0;
  const totalQuestions = questions.length;

  if (scoreTotalEl) {
    scoreTotalEl.textContent = totalQuestions;
  }

  function updateScoreDisplay() {
    if (scoreValueEl) {
      scoreValueEl.textContent = score;
    }
  }

  // =========================
  // QUIZZES
  // =========================
  questions.forEach((question) => {
    question.dataset.answered = "false";

    const buttons = question.querySelectorAll("button.answer");
    const feedback = question.querySelector(".feedback");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        // Avoid double scoring
        if (question.dataset.answered === "true") return;

        const isCorrect = button.dataset.correct === "true";
        const explanation = button.dataset.explanation || "";
        question.dataset.answered = "true";

        // Disable all buttons in this question
        buttons.forEach((b) => {
          b.disabled = true;
        });

        if (isCorrect) {
          score += 1;
          button.classList.add("correct");
          if (feedback) {
            feedback.textContent = "✅ Correct! " + explanation;
          }
        } else {
          button.classList.add("incorrect");
          const correctBtn = question.querySelector(
            'button.answer[data-correct="true"]'
          );
          if (correctBtn) {
            correctBtn.classList.add("correct-highlight");
          }
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + explanation;
          }
        }

        updateScoreDisplay();
      });
    });
  });

  // =========================
  // RESET ALL
  // =========================
  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", function () {
      score = 0;
      updateScoreDisplay();

      questions.forEach((question) => {
        question.dataset.answered = "false";
        const buttons = question.querySelectorAll("button.answer");
        const feedback = question.querySelector(".feedback");

        buttons.forEach((button) => {
          button.disabled = false;
          button.classList.remove("correct", "incorrect", "correct-highlight");
        });

        if (feedback) {
          feedback.textContent = "";
        }
      });

      // Reset builder
      const builderForm = document.getElementById(
        "restaurant-review-builder"
      );
      const builderOutput = document.getElementById(
        "restaurant-review-output"
      );

      if (builderForm) builderForm.reset();
      if (builderOutput) builderOutput.textContent = "";

      stopSpeech();
    });
  }

  // =========================
  // PARAGRAPH BUILDER
  // =========================
  const restForm = document.getElementById("restaurant-review-builder");
  const restOutput = document.getElementById("restaurant-review-output");

  if (restForm && restOutput) {
    restForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const whenWhere = restForm.querySelector(
        '[name="rest-when-where"]'
      ).value;
      const atmosphere = restForm.querySelector(
        '[name="rest-atmosphere"]'
      ).value;
      const food = restForm.querySelector('[name="rest-food"]').value;
      const service = restForm.querySelector('[name="rest-service"]').value;
      const reco = restForm.querySelector(
        '[name="rest-recommendation"]'
      ).value;

      const text =
        `${whenWhere} ${atmosphere} ${food} ` +
        `${service} ${reco}`;

      restOutput.textContent = text;
    });

    const clearBtn = document.getElementById("clear-restaurant-review");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        restForm.reset();
        restOutput.textContent = "";
        stopSpeech();
      });
    }
  }

  // =========================
  // TEXT-TO-SPEECH for builders
  // =========================
  let currentUtterance = null;

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  }

  function speakText(text) {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    if (!text) {
      alert("There is no text to read yet. Build your paragraph first.");
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function togglePause() {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (synth.speaking && !synth.paused) {
      synth.pause();
    } else if (synth.paused) {
      synth.resume();
    }
  }

  const audioBlocks = document.querySelectorAll(".builder-audio");
  audioBlocks.forEach((block) => {
    const targetId = block.getAttribute("data-audio-target");
    const outputEl = document.getElementById(targetId);
    const playBtn = block.querySelector(".audio-play");
    const pauseBtn = block.querySelector(".audio-pause");

    if (playBtn && outputEl) {
      playBtn.addEventListener("click", function () {
        speakText(outputEl.textContent.trim());
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        togglePause();
      });
    }
  });
});
