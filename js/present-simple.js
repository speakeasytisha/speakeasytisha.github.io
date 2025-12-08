(function () {
  const module = document.getElementById("present-simple-module");
  if (!module) return;

  /* ==========================
     EXERCISE 1 – MCQ VERB FORMS
  ========================== */
  const mcQuestions = module.querySelectorAll("#ps-ex1-questions .ps-mc-question");
  const mcCorrectSpan = module.querySelector("#ps-ex1-correct");
  const mcTotalSpan = module.querySelector("#ps-ex1-total");
  const mcShowBtn = module.querySelector("#ps-ex1-show");
  const mcResetBtn = module.querySelector("#ps-ex1-reset");
  const mcFinalDiv = module.querySelector("#ps-ex1-final");

  let mcCorrectCount = 0;

  if (mcTotalSpan) {
    mcTotalSpan.textContent = mcQuestions.length.toString();
  }

  mcQuestions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".ps-mc-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (q.dataset.answered === "true") return;

        q.dataset.answered = "true";
        const chosen = btn.getAttribute("data-option");

        // prevent changing score
        buttons.forEach((b) => (b.disabled = true));

        if (chosen === correct) {
          btn.classList.add("ps-correct");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.add("ps-ok");
            feedback.classList.remove("ps-error");
          }
          mcCorrectCount++;
          if (mcCorrectSpan) {
            mcCorrectSpan.textContent = mcCorrectCount.toString();
          }
        } else {
          btn.classList.add("ps-incorrect");
          // highlight correct option
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("ps-correct");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.add("ps-error");
            feedback.classList.remove("ps-ok");
          }
        }
      });
    });
  });

  if (mcShowBtn && mcFinalDiv) {
    mcShowBtn.addEventListener("click", () => {
      const total = mcQuestions.length;
      let msg = "Your score: " + mcCorrectCount + " / " + total + ". ";
      if (mcCorrectCount === total) {
        msg += "🎉 Excellent! Your present simple forms are very good.";
      } else if (mcCorrectCount >= Math.round(total * 0.7)) {
        msg += "👍 Good job. Review the questions you missed.";
      } else {
        msg += "💪 Keep practicing. Review the grammar boxes and try again.";
      }
      mcFinalDiv.textContent = msg;
    });
  }

  if (mcResetBtn) {
    mcResetBtn.addEventListener("click", () => {
      mcCorrectCount = 0;
      if (mcCorrectSpan) mcCorrectSpan.textContent = "0";
      if (mcFinalDiv) mcFinalDiv.textContent = "";

      mcQuestions.forEach((q) => {
        delete q.dataset.answered;
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".ps-mc-feedback");
        buttons.forEach((b) => {
          b.disabled = false;
          b.classList.remove("ps-correct", "ps-incorrect");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("ps-ok", "ps-error");
        }
      });
    });
  }

  /* ==========================
     EXERCISE 2 – SIGNAL WORDS
  ========================== */
  const ddItems = module.querySelectorAll("#ps-ex2-list .ps-dd-question");
  const ddCorrectSpan = module.querySelector("#ps-ex2-correct");
  const ddTotalSpan = module.querySelector("#ps-ex2-total");
  const ddResetBtn = module.querySelector("#ps-ex2-reset");

  let ddCorrectCount = 0;

  if (ddTotalSpan) {
    ddTotalSpan.textContent = ddItems.length.toString();
  }

  ddItems.forEach((item) => {
    const select = item.querySelector("select");
    const btn = item.querySelector(".ps-dd-check");
    const feedback = item.querySelector(".ps-dd-feedback");
    const correct = item.getAttribute("data-correct");
    const hint = item.getAttribute("data-hint") || "";

    if (!select || !btn) return;

    btn.addEventListener("click", () => {
      const value = select.value;
      if (!value) {
        if (feedback) {
          feedback.textContent = "👉 Choose an answer first.";
          feedback.classList.remove("ps-ok", "ps-error");
        }
        return;
      }

      // if already correct once, don’t change score again
      if (item.dataset.done === "true") {
        if (value === correct) {
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.add("ps-ok");
            feedback.classList.remove("ps-error");
          }
        } else {
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.add("ps-error");
            feedback.classList.remove("ps-ok");
          }
        }
        return;
      }

      if (value === correct) {
        if (feedback) {
          feedback.textContent = "✅ Correct!";
          feedback.classList.add("ps-ok");
          feedback.classList.remove("ps-error");
        }
        ddCorrectCount++;
        if (ddCorrectSpan) {
          ddCorrectSpan.textContent = ddCorrectCount.toString();
        }
        item.dataset.done = "true";
      } else {
        if (feedback) {
          feedback.textContent = "❌ Not quite. " + hint;
          feedback.classList.add("ps-error");
          feedback.classList.remove("ps-ok");
        }
      }
    });
  });

  if (ddResetBtn) {
    ddResetBtn.addEventListener("click", () => {
      ddCorrectCount = 0;
      if (ddCorrectSpan) ddCorrectSpan.textContent = "0";

      ddItems.forEach((item) => {
        const select = item.querySelector("select");
        const feedback = item.querySelector(".ps-dd-feedback");
        if (select) select.value = "";
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("ps-ok", "ps-error");
        }
        delete item.dataset.done;
      });
    });
  }
})();
