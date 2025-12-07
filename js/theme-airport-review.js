// THEME – AIRPORT REVIEW
// Interactive quizzes + builders + global score + audio

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
  // MULTIPLE-CHOICE QUIZZES
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
  // TEXT-TO-SPEECH HELPERS
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

  // =========================
  // RESET ALL
  // =========================
  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", function () {
      score = 0;
      updateScoreDisplay();
      stopSpeech();

      // Reset questions
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

      // Reset all builder forms
      const forms = [
        document.getElementById("airport-review-builder"),
        document.getElementById("hotel-review-builder"),
        document.getElementById("email-builder-form"),
      ];

      forms.forEach((form) => {
        if (form) form.reset();
      });

      // Clear outputs
      const outputs = [
        document.getElementById("airport-review-output"),
        document.getElementById("hotel-review-output"),
        document.getElementById("email-output"),
      ];
      outputs.forEach((el) => {
        if (el) el.textContent = "";
      });
    });
  }

  // =========================
  // AIRPORT STORY BUILDER
  // =========================
  const airportForm = document.getElementById("airport-review-builder");
  const airportOutput = document.getElementById("airport-review-output");

  if (airportForm && airportOutput) {
    airportForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const when = airportForm.querySelector('[name="airport-when"]').value;
      const terminal = airportForm.querySelector(
        '[name="airport-terminal"]'
      ).value;
      const customs = airportForm.querySelector(
        '[name="airport-customs"]'
      ).value;
      const luggage = airportForm.querySelector(
        '[name="airport-luggage"]'
      ).value;
      const feeling = airportForm.querySelector(
        '[name="airport-feeling"]'
      ).value;

      const text =
        `${when} ${terminal} ${customs} ` +
        `${luggage} ${feeling}`;

      airportOutput.textContent = text;
      stopSpeech();
    });

    const clearAirportBtn = document.getElementById("clear-airport-review");
    if (clearAirportBtn) {
      clearAirportBtn.addEventListener("click", function () {
        airportForm.reset();
        if (airportOutput) airportOutput.textContent = "";
        stopSpeech();
      });
    }
  }

  // =========================
  // HOTEL REVIEW BUILDER
  // =========================
  const hotelForm = document.getElementById("hotel-review-builder");
  const hotelOutput = document.getElementById("hotel-review-output");

  if (hotelForm && hotelOutput) {
    hotelForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const whenWhy = hotelForm.querySelector(
        '[name="hotel-when-why"]'
      ).value;
      const staff = hotelForm.querySelector('[name="hotel-staff"]').value;
      const room = hotelForm.querySelector('[name="hotel-room"]').value;
      const breakfast = hotelForm.querySelector(
        '[name="hotel-breakfast"]'
      ).value;
      const rating = hotelForm.querySelector(
        '[name="hotel-rating"]'
      ).value;

      const text =
        `${whenWhy} ${staff} ${room} ` +
        `${breakfast} ${rating}`;

      hotelOutput.textContent = text;
      stopSpeech();
    });

    const clearHotelBtn = document.getElementById("clear-hotel-review");
    if (clearHotelBtn) {
      clearHotelBtn.addEventListener("click", function () {
        hotelForm.reset();
        if (hotelOutput) hotelOutput.textContent = "";
        stopSpeech();
      });
    }
  }

  // =========================
  // EMAIL BUILDER
  // =========================
  const emailForm = document.getElementById("email-builder-form");
  const emailOutput = document.getElementById("email-output");

  if (emailForm && emailOutput) {
    emailForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const greeting = emailForm.querySelector(
        '[name="email-greeting"]'
      ).value;
      const reason = emailForm.querySelector(
        '[name="email-reason"]'
      ).value;
      const positive = emailForm.querySelector(
        '[name="email-positive"]'
      ).value;
      const problem = emailForm.querySelector(
        '[name="email-problem"]'
      ).value;
      const closing = emailForm.querySelector(
        '[name="email-closing"]'
      ).value;

      const text =
        `${greeting}\n\n` +
        `${reason}\n` +
        `${positive}\n` +
        `${problem}\n\n` +
        `${closing}\n[Your name]`;

      emailOutput.textContent = text;
      stopSpeech();
    });

    const clearEmailBtn = document.getElementById("clear-email");
    if (clearEmailBtn) {
      clearEmailBtn.addEventListener("click", function () {
        emailForm.reset();
        if (emailOutput) emailOutput.textContent = "";
        stopSpeech();
      });
    }
  }

  // =========================
  // WIRE AUDIO BUTTONS
  // =========================
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
