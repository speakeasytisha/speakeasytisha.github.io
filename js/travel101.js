(function () {
  const module = document.getElementById("travel101-module");
  if (!module) return;

 /* ---------- VOICE SETUP (AMERICAN ENGLISH IF POSSIBLE) ---------- */
let t101Voices = [];

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  t101Voices = window.speechSynthesis.getVoices() || [];
}

if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

function getAmericanEnglishVoice() {
  if (!("speechSynthesis" in window)) return null;

  if (!t101Voices || !t101Voices.length) {
    t101Voices = window.speechSynthesis.getVoices() || [];
  }
  if (!t101Voices.length) return null;

  // 1) Prefer clear US voices by name (Chrome / Windows)
  const preferredNames = [
    "Google US English",
    "Microsoft Zira Desktop - English (United States)",
    "Microsoft David Desktop - English (United States)",
    "Microsoft Mark - English (United States)",
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Guy Online (Natural) - English (United States)"
  ];

  let voice =
    t101Voices.find(v => preferredNames.includes(v.name)) ||
    t101Voices.find(v => v.lang === "en-US") ||
    t101Voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en-us")) ||
    t101Voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));

  return voice || null;
}

  /* ---------- MAIN REVIEW QUIZ (MULTIPLE CHOICE) ---------- */
  const questions = module.querySelectorAll(".sfo-question");
  const totalCountSpan = module.querySelector("#sfo-total-count");
  const correctCountSpan = module.querySelector("#sfo-correct-count");
  let correctCount = 0;

  if (totalCountSpan) {
    totalCountSpan.textContent = questions.length.toString();
  }

  questions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".sfo-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (q.classList.contains("answered")) return; // prevent changing score

        q.classList.add("answered", "sfo-question-answered");
        const chosen = btn.getAttribute("data-option");

        if (chosen === correct) {
          btn.classList.add("sfo-correct");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.remove("sfo-error");
            feedback.classList.add("sfo-ok");
          }
          correctCount++;
          if (correctCountSpan) {
            correctCountSpan.textContent = correctCount.toString();
          }
        } else {
          btn.classList.add("sfo-incorrect");
          if (feedback) {
            feedback.textContent = "❌ Try again. The correct answer is highlighted.";
            feedback.classList.remove("sfo-ok");
            feedback.classList.add("sfo-error");
          }
          // highlight correct option
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("sfo-correct");
            }
          });
        }

        setTimeout(() => {
          q.classList.remove("sfo-question-answered");
        }, 400);
      });
    });
  });

  const showScoreBtn = module.querySelector("#sfo-show-score");
  const finalScoreDiv = module.querySelector("#sfo-final-score");

  if (showScoreBtn && finalScoreDiv) {
    showScoreBtn.addEventListener("click", () => {
      const total = questions.length;
      let message = "Your final score: " + correctCount + " / " + total;
      if (correctCount === total) {
        message += " 🎉 Excellent! You’re ready for SFO and Hotel Nikko.";
      } else if (correctCount >= Math.round(total * 0.7)) {
        message += " 👍 Good job! A few details to review.";
      } else {
        message += " 💪 Keep practicing and try again.";
      }
      finalScoreDiv.textContent = message;
    });
  }

  const resetQuizBtn = module.querySelector("#sfo-reset-quiz");
  if (resetQuizBtn) {
    resetQuizBtn.addEventListener("click", () => {
      correctCount = 0;
      if (correctCountSpan) {
        correctCountSpan.textContent = "0";
      }
      if (finalScoreDiv) {
        finalScoreDiv.textContent = "";
      }

      questions.forEach((q) => {
        q.classList.remove("answered", "sfo-question-answered");
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".sfo-feedback");

        buttons.forEach((b) => {
          b.classList.remove("sfo-correct", "sfo-incorrect");
        });

        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("sfo-ok", "sfo-error");
        }
      });
    });
  }

  /* ---------- ADJECTIVES / COMPARATIVES / SUPERLATIVES QUIZ ---------- */
  const adjQuestions = module.querySelectorAll(".t101-adj-question");
  const adjTotalSpan = module.querySelector("#t101-adj-total");
  const adjCorrectSpan = module.querySelector("#t101-adj-correct");
  const adjResetBtn = module.querySelector("#t101-adj-reset");
  let adjCorrectCount = 0;

  if (adjTotalSpan) {
    adjTotalSpan.textContent = adjQuestions.length.toString();
  }

  adjQuestions.forEach((q) => {
    const select = q.querySelector("select");
    const checkBtn = q.querySelector(".t101-adj-check");
    const feedback = q.querySelector(".t101-adj-feedback");
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";

    if (!select || !checkBtn) return;

    checkBtn.addEventListener("click", () => {
      const value = select.value;
      if (!value) {
        if (feedback) {
          feedback.textContent = "👉 Choose an option first.";
          feedback.classList.remove("t101-adj-ok", "t101-adj-error");
        }
        return;
      }

      if (q.dataset.done === "true") {
        // already counted in score; just show feedback again
        if (value === correct) {
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.add("t101-adj-ok");
            feedback.classList.remove("t101-adj-error");
          }
        } else {
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.add("t101-adj-error");
            feedback.classList.remove("t101-adj-ok");
          }
        }
        return;
      }

      if (value === correct) {
        if (feedback) {
          feedback.textContent = "✅ Correct!";
          feedback.classList.add("t101-adj-ok");
          feedback.classList.remove("t101-adj-error");
        }
        adjCorrectCount++;
        if (adjCorrectSpan) {
          adjCorrectSpan.textContent = adjCorrectCount.toString();
        }
        q.dataset.done = "true";
      } else {
        if (feedback) {
          feedback.textContent = "❌ Not quite. " + hint;
          feedback.classList.add("t101-adj-error");
          feedback.classList.remove("t101-adj-ok");
        }
      }
    });
  });

  if (adjResetBtn) {
    adjResetBtn.addEventListener("click", () => {
      adjCorrectCount = 0;
      if (adjCorrectSpan) {
        adjCorrectSpan.textContent = "0";
      }
      adjQuestions.forEach((q) => {
        const select = q.querySelector("select");
        const feedback = q.querySelector(".t101-adj-feedback");
        if (select) select.value = "";
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("t101-adj-ok", "t101-adj-error");
        }
        delete q.dataset.done;
      });
    });
  }

  /* ---------- MINI ADJECTIVE BUILDER ---------- */
  const adjBuildBtn = module.querySelector("#t101-adj-build");
  const adjOutput = module.querySelector("#t101-adj-output");
  const adjOverall = module.querySelector("#t101-adj-overall");
  const adjFlight = module.querySelector("#t101-adj-flight");
  const adjAirport = module.querySelector("#t101-adj-airport");
  const adjHotel = module.querySelector("#t101-adj-hotel");

  const adjBuilderResetBtn = module.querySelector("#t101-adj-builder-reset");

  function buildAdjParagraph() {
    if (!adjOutput) return;
    const overall = adjOverall && adjOverall.value ? adjOverall.value : "great overall";
    const flight = adjFlight && adjFlight.value ? adjFlight.value : "quite long but comfortable";
    const airport = adjAirport && adjAirport.value ? adjAirport.value : "busy but well-organised";
    const hotel = adjHotel && adjHotel.value ? adjHotel.value : "very comfortable and convenient";

    const text =
      "My trip to San Francisco was " + overall + ". " +
      "The flight was " + flight + ". " +
      "The airport was " + airport + ". " +
      "The hotel was " + hotel + ".";

    adjOutput.value = text;
  }

  if (adjBuildBtn) {
    adjBuildBtn.addEventListener("click", buildAdjParagraph);
  }

  if (adjBuilderResetBtn) {
    adjBuilderResetBtn.addEventListener("click", () => {
      if (adjOverall) adjOverall.selectedIndex = 0;
      if (adjFlight) adjFlight.selectedIndex = 0;
      if (adjAirport) adjAirport.selectedIndex = 0;
      if (adjHotel) adjHotel.selectedIndex = 0;
      if (adjOutput) adjOutput.value = "";
    });
  }

  /* ---------- DIALOGUE BUILDERS (CHECK-IN / CAR RENTAL / CUSTOMS) ---------- */

  function buildCheckinDialogue(data) {
    const name = data.name || "the passenger";
    const airline = data.airline || "Air France";
    const destination = data.destination || "San Francisco";
    const bags = data.bags || "one suitcase";
    const seat = data.seat || "an aisle seat";
    const extra = data.extra || "nothing else";

    const bagsSentence =
      bags.indexOf("no bags") === 0
        ? "No, I only have a carry-on bag."
        : "Yes, I have " + bags + ".";

    const extraSentence =
      extra === "nothing else"
        ? "Passenger: No, thank you. I don’t need anything else."
        : "Passenger: I’d also like " + extra + ", please.";

    return (
      "Agent: Good morning! Where are you flying today?\n" +
      "Passenger (" + name + "): To " + destination + ", with " + airline + ".\n" +
      "Agent: May I have your passport, please?\n" +
      "Passenger: Sure, here you go.\n" +
      "Agent: Do you have any bags to check in?\n" +
      "Passenger: " + bagsSentence + "\n" +
      "Agent: Would you like an aisle or a window seat?\n" +
      "Passenger: I’d like " + seat + ", please.\n" +
      extraSentence + "\n" +
      "Agent: Perfect. Here is your boarding pass. Boarding at Gate B12.\n" +
      "Passenger: Thank you."
    );
  }

  function buildRentalDialogue(data) {
    const name = data.name || "the driver";
    const company = data.company || "Hertz";
    const carType = data.carType || "compact car";
    const length = data.length || "three days";
    const insuranceChoice =
      data.insurance ||
      "take the basic coverage with CDW only, with a deductible of $2,000";
    const gpsSentence = data.gps || "Yes, I’d like to add GPS, please.";

    let insuranceSentence;
    if (insuranceChoice.includes("Premium Protection")) {
      insuranceSentence = "I’d like Premium Protection with zero deductible, please.";
    } else if (insuranceChoice.includes("credit card")) {
      insuranceSentence = "No, thank you. I’ll use my credit card insurance for CDW.";
    } else {
      insuranceSentence = "I’ll take the basic coverage with CDW only, please.";
    }

    return (
      "Agent: Good afternoon. Welcome to " + company + ". How can I help you?\n" +
      "Driver (" + name + "): Hello, I have a reservation for a " + carType +
      " for " + length + ".\n" +
      "Agent: Great. Would you like any extra insurance today?\n" +
      "Driver: " + insuranceSentence + "\n" +
      "Agent: Would you like to add GPS?\n" +
      "Driver: " + gpsSentence + "\n" +
      "Agent: Perfect. Please sign here. You can return the car at the airport.\n" +
      "Driver: Thank you."
    );
  }

  function buildCustomsDialogue(data) {
    const origin = data.origin || "Paris, France";
    const purpose = data.purpose || "Vacation – I’m visiting family in California.";
    const length = data.length || "two weeks";
    const declare = data.declare || "No, I have nothing to declare.";
    const securityLine =
      data.security ||
      "Please place your bags on the scanner and remove your laptop and liquids.";

    let officerReaction = "Officer: Enjoy your stay in San Francisco!";
    if (declare.includes("cheese and chocolate")) {
      officerReaction =
        "Officer: You must declare food. I’ll register your cheese and chocolate. Enjoy your stay!";
    } else if (declare.includes("medication")) {
      officerReaction =
        "Officer: That’s fine. You must keep your medication in its original packaging.";
    } else if (declare.includes("ten thousand dollars")) {
      officerReaction =
        "Officer: You must declare any amount over ten thousand dollars. Please fill in this form.";
    }

    return (
      "Officer: Welcome to the United States. Where are you coming from?\n" +
      "Passenger: From " + origin + ".\n" +
      "Officer: What is the purpose of your trip?\n" +
      "Passenger: " + purpose + "\n" +
      "Officer: How long will you stay?\n" +
      "Passenger: " + length + ".\n" +
      "Officer: Do you have anything to declare?\n" +
      "Passenger: " + declare + "\n" +
      officerReaction + "\n" +
      "Officer: " + securityLine + "\n" +
      "Passenger: Sure, here you go."
    );
  }

  const builderForms = module.querySelectorAll(".sfo-builder-form");
  builderForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const outputId = form.getAttribute("data-output");
      const type = form.getAttribute("data-type");
      if (!outputId || !type) return;
      const output = module.querySelector("#" + outputId);
      if (!output) return;

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = String(value);
      });

      let dialogue = "";
      if (type === "checkin") {
        dialogue = buildCheckinDialogue(data);
      } else if (type === "rental") {
        dialogue = buildRentalDialogue(data);
      } else if (type === "customs") {
        dialogue = buildCustomsDialogue(data);
      }

      output.value = dialogue;
    });
  });

  /* ---------- AUDIO: SPEAKER + PAUSE ---------- */
function speakFromOutput(outputId) {
  const textarea = document.querySelector("#" + outputId);
  if (!textarea) return;
  const text = textarea.value.trim();
  if (!text) {
    alert("Please build a text first.");
    return;
  }

  if (!("speechSynthesis" in window)) {
    alert("Sorry, your browser does not support text-to-speech.");
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);

  const usVoice = getAmericanEnglishVoice();
  if (usVoice) {
    utter.voice = usVoice;
    utter.lang = usVoice.lang || "en-US";
  } else {
    // fallback – at least ask for English (US)
    utter.lang = "en-US";
  }

  window.speechSynthesis.speak(utter);
}

function togglePause() {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  if (!synth.speaking) return;
  if (synth.paused) synth.resume();
  else synth.pause();
}

  const listenButtons = module.querySelectorAll(".sfo-listen");
  listenButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const outputId = btn.getAttribute("data-output");
      if (!outputId) return;
      speakFromOutput(outputId);
    });
  });

  const pauseButtons = module.querySelectorAll(".sfo-pause");
  pauseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      togglePause();
    });
  });

})();
