(function () {
  const page = document.querySelector(".mr-shell");
  if (!page) return;

  /* ============================
     1. FOOTER YEAR
  ============================ */
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  /* ============================
     2. SPEECH SYNTHESIS SETUP
  ============================ */
  let mrVoices = [];

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    mrVoices = window.speechSynthesis.getVoices() || [];
  }

  loadVoices();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  }

  function getAmericanEnglishVoice() {
    if (!("speechSynthesis" in window)) return null;
    if (!mrVoices || !mrVoices.length) {
      mrVoices = window.speechSynthesis.getVoices() || [];
    }
    if (!mrVoices.length) return null;

    // 1) Try en-US first
    let voice =
      mrVoices.find((v) => v.lang === "en-US") ||
      mrVoices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith("en-us")
      );

    // 2) Fallback: any English voice
    if (!voice) {
      voice = mrVoices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith("en")
      );
    }

    return voice || null;
  }

  let currentUtterance = null;

  function speakElementText(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const text = el.textContent.trim();
    if (!text) {
      alert("There is no text to read yet.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech.");
      return;
    }

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voice = getAmericanEnglishVoice();

    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang || "en-US";
    } else {
      utter.lang = "en-US";
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

  function restartSpeech(elementId) {
    window.speechSynthesis.cancel();
    speakElementText(elementId);
  }

  // Attach TTS buttons
  const ttsButtons = page.querySelectorAll(".mr-tts-btn");
  ttsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-tts-action");
      const targetId = btn.getAttribute("data-tts-target");

      if (action === "play") {
        if (targetId) {
          speakElementText(targetId);
        }
      } else if (action === "pause") {
        pauseOrResumeSpeech();
      } else if (action === "restart") {
        if (targetId) {
          restartSpeech(targetId);
        }
      }
    });
  });

  /* ============================
     3. GENERIC QUIZ ENGINE
  ============================ */
  const quizzes = page.querySelectorAll(".mr-quiz");
  quizzes.forEach((quiz, quizIndex) => {
    const questions = quiz.querySelectorAll(".mr-question");
    const totalSpan = quiz.querySelector(".mr-total-count");
    const correctSpan = quiz.querySelector(".mr-correct-count");
    const resetBtn = quiz.querySelector(".mr-quiz-reset");

    let correctCount = 0;

    if (totalSpan) {
      totalSpan.textContent = questions.length.toString();
    }
    if (correctSpan) {
      correctSpan.textContent = "0";
    }

    questions.forEach((q, index) => {
      const buttons = q.querySelectorAll(".mr-question-choices button");
      const feedback = q.querySelector(".mr-question-feedback");
      const hint = q.getAttribute("data-hint") || "";

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const isCorrect = btn.hasAttribute("data-correct");
          const alreadyAnswered = q.dataset.answered === "true";

          if (!alreadyAnswered) {
            q.dataset.answered = "true";

            if (isCorrect) {
              correctCount++;
              if (correctSpan) {
                correctSpan.textContent = correctCount.toString();
              }
            }
          }

          // Lock buttons visually
          buttons.forEach((b) => {
            b.disabled = true;
          });

          // Apply styles
          if (isCorrect) {
            btn.classList.add("mr-correct");
            if (feedback) {
              feedback.textContent = "✅ Correct!";
              feedback.classList.remove("mr-error");
              feedback.classList.add("mr-ok");
            }
          } else {
            btn.classList.add("mr-incorrect");
            const correctBtn = q.querySelector(
              ".mr-question-choices button[data-correct]"
            );
            if (correctBtn) {
              correctBtn.classList.add("mr-correct");
            }
            if (feedback) {
              feedback.textContent =
                "❌ Not quite. " + (hint ? hint : "Look again at the text.");
              feedback.classList.remove("mr-ok");
              feedback.classList.add("mr-error");
            }
          }

          q.classList.add("mr-question-answered");
          setTimeout(() => {
            q.classList.remove("mr-question-answered");
          }, 400);
        });
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        correctCount = 0;
        if (correctSpan) {
          correctSpan.textContent = "0";
        }
        questions.forEach((q) => {
          delete q.dataset.answered;
          q.classList.remove("mr-question-answered");
          const buttons = q.querySelectorAll(".mr-question-choices button");
          const feedback = q.querySelector(".mr-question-feedback");
          buttons.forEach((b) => {
            b.disabled = false;
            b.classList.remove("mr-correct", "mr-incorrect");
          });
          if (feedback) {
            feedback.textContent = "";
            feedback.classList.remove("mr-ok", "mr-error");
          }
        });
      });
    }
  });

  /* ============================
     4. PARAGRAPH BUILDER
  ============================ */
  const builderForm = document.getElementById("mr-builder-form");
  const builderResults = document.getElementById("mr-builder-results");
  const basicOut = document.getElementById("mr-output-basic");
  const standardOut = document.getElementById("mr-output-standard");
  const advancedOut = document.getElementById("mr-output-advanced");
  const builderReset = document.getElementById("mr-builder-reset");

  if (builderForm && builderResults && basicOut && standardOut && advancedOut) {
    builderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const viewpoint = builderForm.viewpoint.value;
      const positive = builderForm.positive.value;
      const negative = builderForm.negative.value;
      const adjective = builderForm.adjective.value;
      const connector = builderForm.connector.value;
      const personalLink = builderForm.personalLink.value;

      // Level 1: Basic
      const basicSentence =
        "In my opinion, " +
        viewpoint +
        " have a very " +
        adjective +
        " life. " +
        positive;

      // Level 2: Standard
      const standardSentence =
        "Personally, I think that " +
        viewpoint +
        " have a very " +
        adjective +
        " life. " +
        positive +
        " " +
        connector +
        " " +
        negative;

      // Level 3: Advanced
      const advancedSentence =
        "In my opinion, " +
        viewpoint +
        " today have one of the most " +
        adjective +
        " lives in our society. " +
        positive +
        " " +
        connector +
        " " +
        negative +
        " In addition, work–life balance is often more difficult for them than it was for previous generations. " +
        personalLink;

      basicOut.textContent = basicSentence;
      standardOut.textContent = standardSentence;
      advancedOut.textContent = advancedSentence;

      builderResults.classList.remove("mr-hidden");
    });

    if (builderReset) {
      builderReset.addEventListener("click", () => {
        builderForm.reset();
        builderResults.classList.add("mr-hidden");
        basicOut.textContent = "";
        standardOut.textContent = "";
        advancedOut.textContent = "";
      });
    }
  }
      /* ============================
     5. PRINT SECTION(S)
  ============================ */

  function openPrintWindowForElement(targetId) {
    if (!targetId || targetId === "page") {
      // Default browser print = whole page
      window.print();
      return;
    }

    const el = document.getElementById(targetId);
    if (!el) {
      alert("Sorry, I can’t find this section to print.");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=650");
    if (!printWindow) return;

    const title = document.title || "Print";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.6;
            color: #111827;
            padding: 24px;
          }
          h1, h2, h3, h4 {
            margin-top: 0;
          }
          p {
            margin: 0 0 0.6rem 0;
          }
        </style>
      </head>
      <body>
        ${el.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    // Optionally close automatically:
    // printWindow.close();
  }

  function handlePrintButtonClick(btn) {
    const target = btn.getAttribute("data-print-target") || "page";

    if (target === "choose") {
      const select = document.getElementById("mr-print-select");
      const chosen = select ? select.value : "page";
      openPrintWindowForElement(chosen);
    } else {
      openPrintWindowForElement(target);
    }
  }

  // Attach event listeners to all print buttons on this page
  const printButtons = page.querySelectorAll(".mr-print-btn");
  printButtons.forEach((btn) => {
    btn.addEventListener("click", () => handlePrintButtonClick(btn));
  });

})();
