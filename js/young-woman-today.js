(function () {
  const module = document.getElementById("young-women-module");
  if (!module) return;

  /* ======================
     1. TEXT-TO-SPEECH SETUP
  ====================== */
  let ywVoices = [];

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    ywVoices = window.speechSynthesis.getVoices() || [];
  }

  loadVoices();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function getEnglishVoice() {
    if (!("speechSynthesis" in window)) return null;
    if (!ywVoices || !ywVoices.length) {
      ywVoices = window.speechSynthesis.getVoices() || [];
    }
    if (!ywVoices.length) return null;

    // Prefer en-GB or en-US
    let voice =
      ywVoices.find((v) => v.lang === "en-GB") ||
      ywVoices.find((v) => v.lang === "en-US") ||
      ywVoices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith("en-")
      );

    return voice || null;
  }

  let currentUtterance = null;

  function speakFromElement(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const text = el.innerText.trim();
    if (!text) {
      alert("There is no text to read yet.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voice = getEnglishVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang || "en-GB";
    } else {
      utter.lang = "en-GB";
    }

    currentUtterance = utter;
    window.speechSynthesis.speak(utter);
  }

  function pauseOrResumeSpeech() {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    if (!synth.speaking) return;
    if (synth.paused) {
      synth.resume();
    } else {
      synth.pause();
    }
  }

  function restartSpeech() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  }

  // Attach audio controls (for any .yw-listen etc.)
  const listenButtons = module.querySelectorAll(".yw-listen");
  listenButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (!target) return;
      speakFromElement(target);
    });
  });

  const pauseButtons = module.querySelectorAll(".yw-pause");
  pauseButtons.forEach((btn) => {
    btn.addEventListener("click", pauseOrResumeSpeech);
  });

  const stopButtons = module.querySelectorAll(".yw-stop");
  stopButtons.forEach((btn) => {
    btn.addEventListener("click", restartSpeech);
  });

  /* ======================
     2. COMPREHENSION QUIZ
  ====================== */
  const compQuestions = module.querySelectorAll("#yw-comp-questions .yw-q");
  const compCorrectSpan = module.querySelector("#yw-comp-correct");
  const compTotalSpan = module.querySelector("#yw-comp-total");
  const compShowBtn = module.querySelector("#yw-comp-show");
  const compResetBtn = module.querySelector("#yw-comp-reset");
  const compFinalDiv = module.querySelector("#yw-comp-final");

  let compCorrectCount = 0;

  if (compTotalSpan) {
    compTotalSpan.textContent = compQuestions.length.toString();
  }

  compQuestions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".yw-q-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (q.dataset.answered === "true") return;
        const chosen = btn.getAttribute("data-option");
        q.dataset.answered = "true";

        buttons.forEach((b) => (b.disabled = true));

        if (chosen === correct) {
          btn.classList.add("yw-correct");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.add("yw-ok");
            feedback.classList.remove("yw-error");
          }
          compCorrectCount++;
          if (compCorrectSpan) {
            compCorrectSpan.textContent = compCorrectCount.toString();
          }
        } else {
          btn.classList.add("yw-incorrect");
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("yw-correct");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.add("yw-error");
            feedback.classList.remove("yw-ok");
          }
        }
      });
    });
  });

  if (compShowBtn && compFinalDiv) {
    compShowBtn.addEventListener("click", () => {
      const total = compQuestions.length;
      let msg = "Your score: " + compCorrectCount + " / " + total + ". ";
      if (compCorrectCount === total) {
        msg += "🎉 Excellent understanding of the text!";
      } else if (compCorrectCount >= Math.round(total * 0.7)) {
        msg += "👍 Good job. A few details to review.";
      } else {
        msg += "💪 Keep practicing – read the text again and try once more.";
      }
      compFinalDiv.textContent = msg;
    });
  }

  if (compResetBtn) {
    compResetBtn.addEventListener("click", () => {
      compCorrectCount = 0;
      if (compCorrectSpan) compCorrectSpan.textContent = "0";
      if (compFinalDiv) compFinalDiv.textContent = "";

      compQuestions.forEach((q) => {
        delete q.dataset.answered;
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".yw-q-feedback");
        buttons.forEach((b) => {
          b.disabled = false;
          b.classList.remove("yw-correct", "yw-incorrect");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("yw-ok", "yw-error");
        }
      });
    });
  }

  /* ======================
     3. GRAMMAR MINI-QUIZ
  ====================== */
  const gqItems = module.querySelectorAll("#yw-gq-list .yw-gq");
  const gqCorrectSpan = module.querySelector("#yw-gq-correct");
  const gqTotalSpan = module.querySelector("#yw-gq-total");
  const gqResetBtn = module.querySelector("#yw-gq-reset");

  let gqCorrectCount = 0;

  if (gqTotalSpan) {
    gqTotalSpan.textContent = gqItems.length.toString();
  }

  gqItems.forEach((item) => {
    const select = item.querySelector("select");
    const btn = item.querySelector(".yw-gq-check");
    const feedback = item.querySelector(".yw-gq-feedback");
    const correct = item.getAttribute("data-correct");
    const hint = item.getAttribute("data-hint") || "";

    if (!select || !btn) return;

    btn.addEventListener("click", () => {
      const value = select.value;
      if (!value) {
        if (feedback) {
          feedback.textContent = "👉 Choose an answer first.";
          feedback.classList.remove("yw-ok", "yw-error");
        }
        return;
      }

      if (item.dataset.done === "true") {
        if (value === correct) {
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.add("yw-ok");
            feedback.classList.remove("yw-error");
          }
        } else {
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.add("yw-error");
            feedback.classList.remove("yw-ok");
          }
        }
        return;
      }

      if (value === correct) {
        if (feedback) {
          feedback.textContent = "✅ Correct!";
          feedback.classList.add("yw-ok");
          feedback.classList.remove("yw-error");
        }
        gqCorrectCount++;
        if (gqCorrectSpan) {
          gqCorrectSpan.textContent = gqCorrectCount.toString();
        }
        item.dataset.done = "true";
      } else {
        if (feedback) {
          feedback.textContent = "❌ Not quite. " + hint;
          feedback.classList.add("yw-error");
          feedback.classList.remove("yw-ok");
        }
      }
    });
  });

  if (gqResetBtn) {
    gqResetBtn.addEventListener("click", () => {
      gqCorrectCount = 0;
      if (gqCorrectSpan) gqCorrectSpan.textContent = "0";

      gqItems.forEach((item) => {
        const select = item.querySelector("select");
        const feedback = item.querySelector(".yw-gq-feedback");
        if (select) select.value = "";
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("yw-ok", "yw-error");
        }
        delete item.dataset.done;
      });
    });
  }

  /* ======================
     4. OPINION / PARAGRAPH BUILDER
  ====================== */
  const opForm = module.querySelector("#yw-opinion-form");
  const opResults = module.querySelector("#yw-op-results");
  const opBasic = module.querySelector("#yw-op-basic");
  const opStandard = module.querySelector("#yw-op-standard");
  const opAdvanced = module.querySelector("#yw-op-advanced");
  const opResetBtn = module.querySelector("#yw-op-reset");

  if (opForm && opResults && opBasic && opStandard && opAdvanced) {
    opForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const role = opForm.role.value;
      const mainView = opForm.mainView.value;
      const positive = opForm.positive.value;
      const difficulty = opForm.difficulty.value;
      const adverb = opForm.adverb.value;
      const help = opForm.help.value;

      // Basic
      const basicText =
        "In my opinion, " +
        mainView +
        ". I " +
        adverb +
        " think that " +
        difficulty +
        ".";

      // Standard
      const standardText =
        "On the one hand, " +
        positive +
        ". On the other hand, " +
        difficulty +
        ". Personally, I " +
        adverb +
        " feel that " +
        mainView +
        ".";

      // Advanced
      const advancedText =
        "I am " +
        role +
        ", and I " +
        adverb +
        " believe that " +
        mainView +
        ". " +
        "There are positive changes: " +
        positive +
        ", and many families try to share responsibilities more fairly. " +
        "However, " +
        difficulty +
        ", so the mental load for young women today is often more stressful than in the past. " +
        help +
        " In the end, I think it is important to talk honestly about this pressure and to create space for rest and real support.";

      opBasic.textContent = basicText;
      opStandard.textContent = standardText;
      opAdvanced.textContent = advancedText;

      opResults.classList.remove("yw-hidden");
    });

    if (opResetBtn) {
      opResetBtn.addEventListener("click", () => {
        opForm.reset();
        opResults.classList.add("yw-hidden");
        opBasic.textContent = "";
        opStandard.textContent = "";
        opAdvanced.textContent = "";
      });
    }
  }
})();
