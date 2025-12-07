// review.js – interactive logic for the Review page

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

  // Initialize quiz behaviour
  questions.forEach((question) => {
    question.dataset.answered = "false";

    const buttons = question.querySelectorAll("button.answer");
    const feedback = question.querySelector(".feedback");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        // Prevent double scoring
        if (question.dataset.answered === "true") return;

        const isCorrect = button.dataset.correct === "true";
        const explanation = button.dataset.explanation || "";
        question.dataset.answered = "true";

        // Disable all answers for this question
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

          // Highlight correct answer
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

  // Reset all exercises
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

      // Reset builders
      const forms = document.querySelectorAll(".builder-form");
      forms.forEach((form) => form.reset());

      const hotelOutput = document.getElementById("hotel-review-output");
      if (hotelOutput) hotelOutput.textContent = "";

      const restaurantOutput = document.getElementById(
        "restaurant-review-output"
      );
      if (restaurantOutput) restaurantOutput.textContent = "";
    });
  }

  // HOTEL REVIEW BUILDER
  const hotelForm = document.getElementById("hotel-review-builder");
  const hotelOutput = document.getElementById("hotel-review-output");

  if (hotelForm && hotelOutput) {
    hotelForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const when = hotelForm.querySelector('[name="hotel-when"]').value;
      const why = hotelForm.querySelector('[name="hotel-why"]').value;
      const staff = hotelForm.querySelector('[name="hotel-staff"]').value;
      const room = hotelForm.querySelector('[name="hotel-room"]').value;
      const food = hotelForm.querySelector('[name="hotel-food"]').value;
      const stars = hotelForm.querySelector('[name="hotel-stars"]').value;

      const text =
        `${when}, I stayed at a hotel near Union Square ${why}. ` +
        `${staff} ${room} ${food} ` +
        `Overall, I would give this hotel ${stars}, and I would stay there again.`;

      hotelOutput.textContent = text;
    });

    const clearHotelBtn = document.getElementById("clear-hotel-review");
    if (clearHotelBtn) {
      clearHotelBtn.addEventListener("click", function () {
        hotelForm.reset();
        hotelOutput.textContent = "";
      });
    }
  }

  // RESTAURANT REVIEW BUILDER
  const restForm = document.getElementById("restaurant-review-builder");
  const restOutput = document.getElementById("restaurant-review-output");

  if (restForm && restOutput) {
    restForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nameLine = restForm.querySelector('[name="rest-name"]').value;
      const atmosphere = restForm.querySelector(
        '[name="rest-atmosphere"]'
      ).value;
      const food = restForm.querySelector('[name="rest-food"]').value;
      const service = restForm.querySelector('[name="rest-service"]').value;
      const reco = restForm.querySelector('[name="rest-reco"]').value;

      const text =
        `${nameLine} ${atmosphere} ` +
        `${food} ${service} ${reco}`;

      restOutput.textContent = text;
    });

    const clearRestBtn = document.getElementById("clear-restaurant-review");
    if (clearRestBtn) {
      clearRestBtn.addEventListener("click", function () {
        restForm.reset();
        restOutput.textContent = "";
      });
    }
  }
});
