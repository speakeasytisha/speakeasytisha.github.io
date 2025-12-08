(function () {
  const root = document.getElementById("recommendations-lesson");
  if (!root) return;

  /* ========= QUIZ LOGIC ========= */
  root.querySelectorAll(".question").forEach(function (q) {
    const buttons = q.querySelectorAll("button");
    const feedback = q.querySelector(".feedback");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (q.dataset.answered === "true") return;
        q.dataset.answered = "true";

        // Lock buttons
        buttons.forEach(function (b) {
          b.disabled = true;
        });

        const isCorrect = btn.dataset.correct === "true";
        const correctBtn = q.querySelector('button[data-correct="true"]');

        if (isCorrect) {
          btn.classList.add("correct");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.add("correct");
          }
        } else {
          btn.classList.add("incorrect");
          if (correctBtn) correctBtn.classList.add("correct");
          if (feedback) {
            feedback.textContent =
              "❌ Not quite. The best answer is highlighted in green.";
            feedback.classList.add("incorrect");
          }
        }

        if (feedback) feedback.classList.add("fade-in");
      });
    });
  });

  /* ========= BUILDER LOGIC ========= */
  const form = document.getElementById("rec-builder-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const town = form.town.value.trim() || "my town";
      const place = form.place.value;
      const activity = form.activity.value;
      const food = form.food.value;
      const adjective = form.adjective.value;
      const extra = form.extra.value;

      const basic = document.getElementById("rec-output-basic");
      const standard = document.getElementById("rec-output-standard");
      const advanced = document.getElementById("rec-output-advanced");
      const box = document.getElementById("rec-builder-results");

      if (basic) {
        basic.textContent =
          "If you visit " +
          town +
          ", you should " +
          activity +
          ". You should try " +
          food +
          ".";
      }

      if (standard) {
        standard.textContent =
          "If you visit " +
          town +
          ", you should " +
          activity +
          " and visit " +
          place +
          ". I recommend trying " +
          food +
          " — it’s " +
          adjective +
          ".";
      }

      if (advanced) {
        advanced.textContent =
          "If you visit " +
          town +
          ", you should definitely " +
          activity +
          " and spend some time at " +
          place +
          ". It’s worth trying " +
          food +
          " because it’s " +
          adjective +
          ". " +
          extra;
      }

      if (box) {
        box.classList.remove("hidden");
        box.classList.add("fade-in");
      }
    });
  }

  /* ========= PHRASE BLOCKS ========= */
  root.querySelectorAll(".rec-phrase").forEach(function (chip) {
    chip.addEventListener("click", function () {
      const target = document.getElementById("rec-free-text");
      if (!target) return;
      const text = chip.dataset.text || chip.textContent.trim();

      if (target.value && !target.value.endsWith(" ")) {
        target.value += " ";
      }
      target.value += text + " ";
      target.focus();
    });
  });
})();
