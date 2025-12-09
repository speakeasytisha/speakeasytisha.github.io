(function () {
  const module = document.getElementById("smalltalk-module");
  if (!module) return;

  /* ==========================
     MULTIPLE-CHOICE QUIZ LOGIC
  =========================== */
  const questions = module.querySelectorAll(".st-question");
  const totalSpan = module.querySelector("#st-total-count");
  const correctSpan = module.querySelector("#st-correct-count");
  const showScoreBtn = module.querySelector("#st-show-score");
  const resetQuizBtn = module.querySelector("#st-reset-quiz");
  const finalScoreDiv = module.querySelector("#st-final-score");

  let correctCount = 0;

  if (totalSpan) {
    totalSpan.textContent = questions.length.toString();
  }

  questions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".st-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // prevent double counting
        if (q.dataset.done === "true") return;

        const chosen = btn.getAttribute("data-option");
        if (!chosen) return;

        q.classList.add("st-question-answered");

        if (chosen === correct) {
          btn.classList.add("st-correct-btn");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.remove("st-feedback-error");
            feedback.classList.add("st-feedback-ok");
          }
          correctCount++;
          if (correctSpan) {
            correctSpan.textContent = correctCount.toString();
          }
          q.dataset.done = "true";
        } else {
          btn.classList.add("st-incorrect-btn");
          // highlight correct option
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("st-correct-btn");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.remove("st-feedback-ok");
            feedback.classList.add("st-feedback-error");
          }
          q.dataset.done = "true";
        }

        setTimeout(() => {
          q.classList.remove("st-question-answered");
        }, 350);
      });
    });
  });

  if (showScoreBtn && finalScoreDiv) {
    showScoreBtn.addEventListener("click", () => {
      const total = questions.length;
      let message = "Your score: " + correctCount + " / " + total + ".";
      if (correctCount === total) {
        message += " 🎉 Excellent! Your small talk is ready.";
      } else if (correctCount >= Math.round(total * 0.7)) {
        message += " 👍 Good job. Review a few details and try again.";
      } else {
        message += " 💪 Keep practising the questions and answers.";
      }
      finalScoreDiv.textContent = message;
      finalScoreDiv.classList.add("st-fade-in");
    });
  }

  if (resetQuizBtn) {
    resetQuizBtn.addEventListener("click", () => {
      correctCount = 0;
      if (correctSpan) correctSpan.textContent = "0";
      if (finalScoreDiv) {
        finalScoreDiv.textContent = "";
        finalScoreDiv.classList.remove("st-fade-in");
      }

      questions.forEach((q) => {
        delete q.dataset.done;
        q.classList.remove("st-question-answered");
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".st-feedback");
        buttons.forEach((b) => {
          b.classList.remove("st-correct-btn", "st-incorrect-btn");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("st-feedback-ok", "st-feedback-error");
        }
      });
    });
  }

  /* ==========================
     REASONS BUILDER
  =========================== */
  const reasonForm = module.querySelector("#st-reason-form");
  const reasonBox = module.querySelector("#st-reason-results");
  const reasonBasic = module.querySelector("#st-reason-basic");
  const reasonStandard = module.querySelector("#st-reason-standard");
  const reasonAdvanced = module.querySelector("#st-reason-advanced");

  if (reasonForm && reasonBox && reasonBasic && reasonStandard && reasonAdvanced) {
    reasonForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const city = (reasonForm.city.value || "this city").trim();
      const reason = reasonForm.reason.value || "business";

      let shortReason;
      let fullReason;
      let advancedReason;

      if (reason === "business") {
        shortReason = "I’m here for business.";
        fullReason = `I’m here for business in ${city}.`;
        advancedReason =
          `I’m here for business in ${city}. I have some meetings, ` +
          `but I also hope to visit the city a little.`;
      } else if (reason === "pleasure") {
        shortReason = "I’m here for pleasure.";
        fullReason = `I’m here on vacation in ${city}.`;
        advancedReason =
          `I’m here on vacation in ${city}. I really want to relax and ` +
          `visit some interesting places.`;
      } else if (reason === "to visit my family") {
        shortReason = "I’m here to visit my family.";
        fullReason = `I’m here to visit my family in ${city}.`;
        advancedReason =
          `I’m here to visit my family in ${city}. I haven’t seen them ` +
          `for a long time, so I’m really happy to be here.`;
      } else if (reason === "to study English") {
        shortReason = "I’m here to study English.";
        fullReason = `I’m here to study English in ${city}.`;
        advancedReason =
          `I’m here to study English in ${city}. I’d like to improve my speaking ` +
          `so I can travel and work more easily.`;
      } else if (reason === "a conference") {
        shortReason = "I’m here for a conference.";
        fullReason = `I’m here for a conference in ${city}.`;
        advancedReason =
          `I’m here for a conference in ${city}. It’s a good opportunity ` +
          `to learn new things and meet people from different countries.`;
      } else {
        shortReason = "I’m here for a trip.";
        fullReason = `I’m here for a trip in ${city}.`;
        advancedReason =
          `I’m here for a trip in ${city}. I’m curious to discover the city and the culture.`;
      }

      reasonBasic.textContent = shortReason;
      reasonStandard.textContent = fullReason;
      reasonAdvanced.textContent = advancedReason;

      reasonBox.classList.remove("st-hidden");
      reasonBox.classList.add("st-fade-in");
    });
  }

  /* ==========================
     FINAL SMALL TALK BUILDER
  =========================== */
  const smalltalkForm = module.querySelector("#st-smalltalk-form");
  const smalltalkOutput = module.querySelector("#st-smalltalk-output");
  const smalltalkResetBtn = module.querySelector("#st-smalltalk-reset");

  if (smalltalkForm && smalltalkOutput) {
    smalltalkForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const greeting = smalltalkForm.greeting.value || "Hi";
      const yourName = (smalltalkForm.yourName.value || "Mathieu").trim();
      const otherName = (smalltalkForm.otherName.value || "Anna").trim();
      const country = smalltalkForm.country.value || "Congo";
      const city = (smalltalkForm.city.value || "France").trim();
      const reason = smalltalkForm.reason.value || "I’m here on vacation.";
      const tripFeeling = smalltalkForm.tripFeeling.value || "My trip is really relaxing.";
      const weather = smalltalkForm.weather.value || "It’s a nice day, isn’t it?";

      const text =
        `${greeting}, is this seat free?\n` +
        `${otherName}: Yes, of course.\n` +
        `${yourName}: Thanks. My name is ${yourName}. What’s your name?\n` +
        `${otherName}: I’m ${otherName}. Nice to meet you.\n` +
        `${yourName}: Nice to meet you too. Where are you from?\n` +
        `${otherName}: I’m from ${country}. And you?\n` +
        `${yourName}: I’m from ${country}, but I live in ${city} now.\n` +
        `${otherName}: Oh, great. ${reason}\n` +
        `${yourName}: ${tripFeeling}\n` +
        `${yourName}: ${weather}\n` +
        `Narrator: They are having a simple, friendly conversation in English.`;

      smalltalkOutput.value = text;
      smalltalkOutput.classList.add("st-fade-in");
    });
  }

  if (smalltalkResetBtn && smalltalkForm && smalltalkOutput) {
    smalltalkResetBtn.addEventListener("click", () => {
      smalltalkForm.reset();
      smalltalkOutput.value = "";
      smalltalkOutput.classList.remove("st-fade-in");
    });
  }
})();
