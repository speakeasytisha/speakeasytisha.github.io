(function () {
  const root = document.getElementById("london-lesson");
  if (!root) return;

  /* ==============================
     QUIZ 1 – VOCAB & READING (MCQ)
  =============================== */
  const vocabQuestions = root.querySelectorAll(".ldn-vocab-question");
  const vocabTotalSpan = root.querySelector("#ldn-vocab-total");
  const vocabCorrectSpan = root.querySelector("#ldn-vocab-correct");
  const vocabShowBtn = root.querySelector("#ldn-vocab-show-score");
  const vocabResetBtn = root.querySelector("#ldn-vocab-reset");
  const vocabFinalDiv = root.querySelector("#ldn-vocab-final");

  let vocabCorrectCount = 0;

  if (vocabTotalSpan) {
    vocabTotalSpan.textContent = vocabQuestions.length.toString();
  }

  vocabQuestions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".ldn-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = btn.getAttribute("data-option");
        if (!chosen) return;

        // Prevent multiple scoring
        if (q.dataset.done === "true") {
          return;
        }

        q.classList.add("ldn-question-answered");

        if (chosen === correct) {
          btn.classList.add("ldn-correct-btn");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.remove("ldn-feedback-error");
            feedback.classList.add("ldn-feedback-ok");
          }

          vocabCorrectCount++;
          if (vocabCorrectSpan) {
            vocabCorrectSpan.textContent = vocabCorrectCount.toString();
          }
          q.dataset.done = "true";
        } else {
          btn.classList.add("ldn-incorrect-btn");
          // highlight correct
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("ldn-correct-btn");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.remove("ldn-feedback-ok");
            feedback.classList.add("ldn-feedback-error");
          }
          q.dataset.done = "true";
        }

        // Small visual effect
        setTimeout(() => {
          q.classList.remove("ldn-question-answered");
        }, 400);
      });
    });
  });

  if (vocabShowBtn && vocabFinalDiv) {
    vocabShowBtn.addEventListener("click", () => {
      const total = vocabQuestions.length;
      let message = "Your score: " + vocabCorrectCount + " / " + total + ".";
      if (vocabCorrectCount === total) {
        message += " 🎉 Excellent! London expert.";
      } else if (vocabCorrectCount >= Math.round(total * 0.7)) {
        message += " 👍 Good job! A few words to review.";
      } else {
        message += " 💪 Keep practicing and try again.";
      }
      vocabFinalDiv.textContent = message;
      vocabFinalDiv.classList.add("ldn-fade-in");
    });
  }

  if (vocabResetBtn) {
    vocabResetBtn.addEventListener("click", () => {
      vocabCorrectCount = 0;
      if (vocabCorrectSpan) vocabCorrectSpan.textContent = "0";
      if (vocabFinalDiv) {
        vocabFinalDiv.textContent = "";
        vocabFinalDiv.classList.remove("ldn-fade-in");
      }

      vocabQuestions.forEach((q) => {
        delete q.dataset.done;
        q.classList.remove("ldn-question-answered");
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".ldn-feedback");
        buttons.forEach((b) => {
          b.classList.remove("ldn-correct-btn", "ldn-incorrect-btn");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("ldn-feedback-ok", "ldn-feedback-error");
        }
      });
    });
  }

  /* ==============================
     QUIZ 2 – GRAMMAR (SELECT)
  =============================== */
  const grammarQuestions = root.querySelectorAll(".ldn-grammar-question");
  const grammarTotalSpan = root.querySelector("#ldn-grammar-total");
  const grammarCorrectSpan = root.querySelector("#ldn-grammar-correct");
  const grammarShowBtn = root.querySelector("#ldn-grammar-show-score");
  const grammarResetBtn = root.querySelector("#ldn-grammar-reset");
  const grammarFinalDiv = root.querySelector("#ldn-grammar-final");

  let grammarCorrectCount = 0;

  if (grammarTotalSpan) {
    grammarTotalSpan.textContent = grammarQuestions.length.toString();
  }

  grammarQuestions.forEach((q) => {
    const select = q.querySelector("select");
    const checkBtn = q.querySelector(".ldn-grammar-check");
    const feedback = q.querySelector(".ldn-grammar-feedback");
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";

    if (!select || !checkBtn) return;

    checkBtn.addEventListener("click", () => {
      const value = select.value;

      if (!value) {
        if (feedback) {
          feedback.textContent = "👉 Choose an option first.";
          feedback.classList.remove("ldn-grammar-ok", "ldn-grammar-error");
        }
        return;
      }

      if (q.dataset.done === "true") {
        // already counted, only feedback
        if (value === correct) {
          if (feedback) {
            feedback.textContent = "✅ Correct.";
            feedback.classList.add("ldn-grammar-ok");
            feedback.classList.remove("ldn-grammar-error");
          }
        } else {
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.add("ldn-grammar-error");
            feedback.classList.remove("ldn-grammar-ok");
          }
        }
        return;
      }

      if (value === correct) {
        if (feedback) {
          feedback.textContent = "✅ Correct.";
          feedback.classList.add("ldn-grammar-ok");
          feedback.classList.remove("ldn-grammar-error");
        }
        grammarCorrectCount++;
        if (grammarCorrectSpan) {
          grammarCorrectSpan.textContent = grammarCorrectCount.toString();
        }
        q.dataset.done = "true";
      } else {
        if (feedback) {
          feedback.textContent = "❌ Not quite. " + hint;
          feedback.classList.add("ldn-grammar-error");
          feedback.classList.remove("ldn-grammar-ok");
        }
      }
    });
  });

  if (grammarShowBtn && grammarFinalDiv) {
    grammarShowBtn.addEventListener("click", () => {
      const total = grammarQuestions.length;
      let message = "Your score: " + grammarCorrectCount + " / " + total + ".";
      if (grammarCorrectCount === total) {
        message += " 🎉 Great control of the present tenses.";
      } else if (grammarCorrectCount >= Math.round(total * 0.7)) {
        message += " 👍 Nice work. Review a few forms.";
      } else {
        message += " 💪 Keep practicing present simple vs continuous.";
      }
      grammarFinalDiv.textContent = message;
      grammarFinalDiv.classList.add("ldn-fade-in");
    });
  }

  if (grammarResetBtn) {
    grammarResetBtn.addEventListener("click", () => {
      grammarCorrectCount = 0;
      if (grammarCorrectSpan) grammarCorrectSpan.textContent = "0";
      if (grammarFinalDiv) {
        grammarFinalDiv.textContent = "";
        grammarFinalDiv.classList.remove("ldn-fade-in");
      }

      grammarQuestions.forEach((q) => {
        const select = q.querySelector("select");
        const feedback = q.querySelector(".ldn-grammar-feedback");
        if (select) select.value = "";
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("ldn-grammar-ok", "ldn-grammar-error");
        }
        delete q.dataset.done;
      });
    });
  }

  /* ==============================
     DIALOGUE BUILDER 1 – TOURIST INFO
  =============================== */
  const infoForm = document.getElementById("ldn-info-form");
  const infoOutput = document.getElementById("ldn-info-output");
  const infoResetBtn = document.getElementById("ldn-info-reset");

  if (infoForm && infoOutput) {
    infoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = infoForm.name.value.trim() || "Mathieu";
      const stay = infoForm.stay.value || "in the city centre";
      const day = infoForm.day.value || "today";
      const interest = infoForm.interest.value || "museums and history";
      const extra = infoForm.extra.value || "I am visiting London for the first time.";

      const text =
        "Tourist officer: Good morning. How can I help you?\n" +
        "Visitor: Hello. My name is " + name + ". I am from Congo, and I live in France. " +
        "I am staying " + stay + ". " + extra + "\n" +
        "Visitor: " + "I would like to do something with " + interest + " " + day + ". What do you recommend?\n" +
        "Tourist officer: You should visit some famous places in London. For example, you can go to the British Museum, " +
        "walk near the River Thames and take photos of Tower Bridge.\n" +
        "Visitor: That sounds great, thank you!";

      infoOutput.value = text;
      infoOutput.classList.add("ldn-fade-in");
    });
  }

  if (infoResetBtn && infoOutput && infoForm) {
    infoResetBtn.addEventListener("click", () => {
      infoForm.reset();
      infoOutput.value = "";
      infoOutput.classList.remove("ldn-fade-in");
    });
  }

  /* ==============================
     DIALOGUE BUILDER 2 – NOW IN LONDON
  =============================== */
  const nowForm = document.getElementById("ldn-now-form");
  const nowOutput = document.getElementById("ldn-now-output");
  const nowResetBtn = document.getElementById("ldn-now-reset");

  if (nowForm && nowOutput) {
    nowForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nowPlace = nowForm.nowPlace.value || "walking in the city centre";
      const weather = nowForm.weather.value || "cloudy";
      const usually = nowForm.usually.value || "visit museums when I travel";
      const evening = nowForm.evening.value || "go back to my hotel early";

      const text =
        "Right now I am " + nowPlace + " in London. The weather is " + weather + ", " +
        "but I am enjoying the city. I usually " + usually + ", " +
        "so London is perfect for me. Tonight I am going to " + evening +
        ". I think London is busy, beautiful and very international.";

      nowOutput.value = text;
      nowOutput.classList.add("ldn-fade-in");
    });
  }

  if (nowResetBtn && nowOutput && nowForm) {
    nowResetBtn.addEventListener("click", () => {
      nowForm.reset();
      nowOutput.value = "";
      nowOutput.classList.remove("ldn-fade-in");
    });
  }
    /* ==============================
     TRANSPORT QUIZ – HOW TO GET TO LONDON
  =============================== */
  const transportQuestions = root.querySelectorAll(".ldn-transport-question");
  const transportTotalSpan = root.querySelector("#ldn-transport-total");
  const transportCorrectSpan = root.querySelector("#ldn-transport-correct");
  const transportShowBtn = root.querySelector("#ldn-transport-show-score");
  const transportResetBtn = root.querySelector("#ldn-transport-reset");
  const transportFinalDiv = root.querySelector("#ldn-transport-final");

  let transportCorrectCount = 0;

  if (transportTotalSpan) {
    transportTotalSpan.textContent = transportQuestions.length.toString();
  }

  transportQuestions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".ldn-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (q.dataset.done === "true") return;
        const chosen = btn.getAttribute("data-option");
        if (!chosen) return;

        q.classList.add("ldn-question-answered");

        if (chosen === correct) {
          btn.classList.add("ldn-correct-btn");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.remove("ldn-feedback-error");
            feedback.classList.add("ldn-feedback-ok");
          }
          transportCorrectCount++;
          if (transportCorrectSpan) {
            transportCorrectSpan.textContent = transportCorrectCount.toString();
          }
          q.dataset.done = "true";
        } else {
          btn.classList.add("ldn-incorrect-btn");
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("ldn-correct-btn");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.remove("ldn-feedback-ok");
            feedback.classList.add("ldn-feedback-error");
          }
          q.dataset.done = "true";
        }

        setTimeout(() => {
          q.classList.remove("ldn-question-answered");
        }, 400);
      });
    });
  });

  if (transportShowBtn && transportFinalDiv) {
    transportShowBtn.addEventListener("click", () => {
      const total = transportQuestions.length;
      let message = "Your score: " + transportCorrectCount + " / " + total + ".";
      if (transportCorrectCount === total) {
        message += " 🎉 Great! You know how to get to London.";
      } else if (transportCorrectCount >= Math.round(total * 0.7)) {
        message += " 👍 Good job. Just review a few words.";
      } else {
        message += " 💪 Keep practicing the travel vocabulary.";
      }
      transportFinalDiv.textContent = message;
      transportFinalDiv.classList.add("ldn-fade-in");
    });
  }

  if (transportResetBtn) {
    transportResetBtn.addEventListener("click", () => {
      transportCorrectCount = 0;
      if (transportCorrectSpan) transportCorrectSpan.textContent = "0";
      if (transportFinalDiv) {
        transportFinalDiv.textContent = "";
        transportFinalDiv.classList.remove("ldn-fade-in");
      }

      transportQuestions.forEach((q) => {
        delete q.dataset.done;
        q.classList.remove("ldn-question-answered");
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".ldn-feedback");
        buttons.forEach((b) => {
          b.classList.remove("ldn-correct-btn", "ldn-incorrect-btn");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("ldn-feedback-ok", "ldn-feedback-error");
        }
      });
    });
  }

  /* ==============================
     TRAVEL BUILDER – PERSONAL JOURNEY
  =============================== */
  const travelForm = document.getElementById("ldn-travel-form");
  const travelOutput = document.getElementById("ldn-travel-output");
  const travelResetBtn = document.getElementById("ldn-travel-reset");

  if (travelForm && travelOutput) {
    travelForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (travelForm.name.value || "Mathieu").trim();
      const fromCity = travelForm.fromCity.value || "France";
      const mode = travelForm.mode.value || "by train (Eurostar)";
      const time = travelForm.time.value || "about four hours";
      const reason = travelForm.reason.value || "because it is faster than the coach";
      const withWho = travelForm.withWho.value || "alone";

      const text =
        "Ticket agent: Good morning. Where are you travelling from?\n" +
        name + ": Good morning. I’m travelling from " + fromCity + " to London " + mode + ".\n" +
        "Ticket agent: How long does it take?\n" +
        name + ": It takes " + time + ", " + reason + ". I am travelling " + withWho + ".\n" +
        "Ticket agent: Great. Here is your ticket. Have a good journey!\n" +
        name + ": Thank you!\n\n" +
        "Narrator: " + name + " is now on the way to London. He is looking out of the window and " +
        "practising his English. He feels a little nervous, but he is excited to visit London.";

      travelOutput.value = text;
      travelOutput.classList.add("ldn-fade-in");
    });
  }

  if (travelResetBtn && travelOutput && travelForm) {
    travelResetBtn.addEventListener("click", () => {
      travelForm.reset();
      travelOutput.value = "";
      travelOutput.classList.remove("ldn-fade-in");
    });
  }
  /* ==============================
     FERRY QUIZ – VOCAB & DIALOGUE
  =============================== */
  const ferryQuestions = root.querySelectorAll(".ldn-ferry-question");
  const ferryTotalSpan = root.querySelector("#ldn-ferry-total");
  const ferryCorrectSpan = root.querySelector("#ldn-ferry-correct");
  const ferryShowBtn = root.querySelector("#ldn-ferry-show-score");
  const ferryResetBtn = root.querySelector("#ldn-ferry-reset");
  const ferryFinalDiv = root.querySelector("#ldn-ferry-final");

  let ferryCorrectCount = 0;

  if (ferryTotalSpan) {
    ferryTotalSpan.textContent = ferryQuestions.length.toString();
  }

  ferryQuestions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".ldn-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (q.dataset.done === "true") return;
        const chosen = btn.getAttribute("data-option");
        if (!chosen) return;

        q.classList.add("ldn-question-answered");

        if (chosen === correct) {
          btn.classList.add("ldn-correct-btn");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.remove("ldn-feedback-error");
            feedback.classList.add("ldn-feedback-ok");
          }
          ferryCorrectCount++;
          if (ferryCorrectSpan) {
            ferryCorrectSpan.textContent = ferryCorrectCount.toString();
          }
          q.dataset.done = "true";
        } else {
          btn.classList.add("ldn-incorrect-btn");
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("ldn-correct-btn");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.remove("ldn-feedback-ok");
            feedback.classList.add("ldn-feedback-error");
          }
          q.dataset.done = "true";
        }

        setTimeout(() => {
          q.classList.remove("ldn-question-answered");
        }, 400);
      });
    });
  });

  if (ferryShowBtn && ferryFinalDiv) {
    ferryShowBtn.addEventListener("click", () => {
      const total = ferryQuestions.length;
      let message = "Your score: " + ferryCorrectCount + " / " + total + ".";
      if (ferryCorrectCount === total) {
        message += " 🎉 Excellent! You understand the ferry vocabulary.";
      } else if (ferryCorrectCount >= Math.round(total * 0.7)) {
        message += " 👍 Good job. Review a few words and try again.";
      } else {
        message += " 💪 Keep practising the ferry dialogues.";
      }
      ferryFinalDiv.textContent = message;
      ferryFinalDiv.classList.add("ldn-fade-in");
    });
  }

  if (ferryResetBtn) {
    ferryResetBtn.addEventListener("click", () => {
      ferryCorrectCount = 0;
      if (ferryCorrectSpan) ferryCorrectSpan.textContent = "0";
      if (ferryFinalDiv) {
        ferryFinalDiv.textContent = "";
        ferryFinalDiv.classList.remove("ldn-fade-in");
      }

      ferryQuestions.forEach((q) => {
        delete q.dataset.done;
        q.classList.remove("ldn-question-answered");
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".ldn-feedback");
        buttons.forEach((b) => {
          b.classList.remove("ldn-correct-btn", "ldn-incorrect-btn");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("ldn-feedback-ok", "ldn-feedback-error");
        }
      });
    });
  }

  /* ==============================
     FERRY BUILDER – BOOKING DIALOGUE
  =============================== */
  const ferryForm = document.getElementById("ldn-ferry-form");
  const ferryOutput = document.getElementById("ldn-ferry-output");
  const ferryBuilderResetBtn = document.getElementById("ldn-ferry-builder-reset");

  if (ferryForm && ferryOutput) {
    ferryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = (ferryForm.name.value || "Mathieu").trim();
      const route = ferryForm.route.value || "Calais to Dover";
      const passengerType = ferryForm.passengerType.value || "a foot passenger";
      const ticketType = ferryForm.ticketType.value || "a return ticket";
      const cabin = ferryForm.cabin.value || "no cabin, just a seat on the ferry";
      const time = ferryForm.time.value || "in the morning";

      const text =
        "Ticket clerk: Good morning. Where are you travelling to?\n" +
        name + ": Good morning. I’d like " + ticketType + " from " + route + ", please.\n" +
        "Ticket clerk: Are you travelling as a foot passenger, or with a vehicle?\n" +
        name + ": I’m " + passengerType + ".\n" +
        "Ticket clerk: Do you want a cabin?\n" +
        name + ": I’d like " + cabin + ". I’m travelling " + time + ".\n" +
        "Ticket clerk: No problem. May I see your passport or ID card, please?\n" +
        name + ": Of course. Here you are.\n" +
        "Ticket clerk: Thank you. Boarding starts 45 minutes before departure. Have a good journey!\n" +
        name + ": Thank you very much.\n\n" +
        "Narrator: " + name +
        " is now ready to board the ferry. He is thinking about his trip to London and practising his English.";

      ferryOutput.value = text;
      ferryOutput.classList.add("ldn-fade-in");
    });
  }

  if (ferryBuilderResetBtn && ferryOutput && ferryForm) {
    ferryBuilderResetBtn.addEventListener("click", () => {
      ferryForm.reset();
      ferryOutput.value = "";
      ferryOutput.classList.remove("ldn-fade-in");
    });
  }
  /* ==============================
     MEETING ON THE FERRY – QUIZ
  =============================== */
  const meetQuestions = root.querySelectorAll(".ldn-meet-question");
  const meetTotalSpan = root.querySelector("#ldn-meet-total");
  const meetCorrectSpan = root.querySelector("#ldn-meet-correct");
  const meetShowBtn = root.querySelector("#ldn-meet-show-score");
  const meetResetBtn = root.querySelector("#ldn-meet-reset");
  const meetFinalDiv = root.querySelector("#ldn-meet-final");

  let meetCorrectCount = 0;

  if (meetTotalSpan) {
    meetTotalSpan.textContent = meetQuestions.length.toString();
  }

  meetQuestions.forEach((q) => {
    const correct = q.getAttribute("data-correct");
    const hint = q.getAttribute("data-hint") || "";
    const buttons = q.querySelectorAll("button[data-option]");
    const feedback = q.querySelector(".ldn-feedback");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (q.dataset.done === "true") return;
        const chosen = btn.getAttribute("data-option");
        if (!chosen) return;

        q.classList.add("ldn-question-answered");

        if (chosen === correct) {
          btn.classList.add("ldn-correct-btn");
          if (feedback) {
            feedback.textContent = "✅ Correct!";
            feedback.classList.remove("ldn-feedback-error");
            feedback.classList.add("ldn-feedback-ok");
          }
          meetCorrectCount++;
          if (meetCorrectSpan) {
            meetCorrectSpan.textContent = meetCorrectCount.toString();
          }
          q.dataset.done = "true";
        } else {
          btn.classList.add("ldn-incorrect-btn");
          buttons.forEach((b) => {
            if (b.getAttribute("data-option") === correct) {
              b.classList.add("ldn-correct-btn");
            }
          });
          if (feedback) {
            feedback.textContent = "❌ Not quite. " + hint;
            feedback.classList.remove("ldn-feedback-ok");
            feedback.classList.add("ldn-feedback-error");
          }
          q.dataset.done = "true";
        }

        setTimeout(() => {
          q.classList.remove("ldn-question-answered");
        }, 400);
      });
    });
  });

  if (meetShowBtn && meetFinalDiv) {
    meetShowBtn.addEventListener("click", () => {
      const total = meetQuestions.length;
      let message = "Your score: " + meetCorrectCount + " / " + total + ".";
      if (meetCorrectCount === total) {
        message += " 🎉 Excellent! You can start a conversation on the ferry.";
      } else if (meetCorrectCount >= Math.round(total * 0.7)) {
        message += " 👍 Good job. Review a few questions and try again.";
      } else {
        message += " 💪 Keep practising questions and answers.";
      }
      meetFinalDiv.textContent = message;
      meetFinalDiv.classList.add("ldn-fade-in");
    });
  }

  if (meetResetBtn) {
    meetResetBtn.addEventListener("click", () => {
      meetCorrectCount = 0;
      if (meetCorrectSpan) meetCorrectSpan.textContent = "0";
      if (meetFinalDiv) {
        meetFinalDiv.textContent = "";
        meetFinalDiv.classList.remove("ldn-fade-in");
      }

      meetQuestions.forEach((q) => {
        delete q.dataset.done;
        q.classList.remove("ldn-question-answered");
        const buttons = q.querySelectorAll("button[data-option]");
        const feedback = q.querySelector(".ldn-feedback");
        buttons.forEach((b) => {
          b.classList.remove("ldn-correct-btn", "ldn-incorrect-btn");
        });
        if (feedback) {
          feedback.textContent = "";
          feedback.classList.remove("ldn-feedback-ok", "ldn-feedback-error");
        }
      });
    });
  }

  /* ==============================
     MEETING ON THE FERRY – BUILDER
  =============================== */
  const meetForm = document.getElementById("ldn-meet-form");
  const meetOutput = document.getElementById("ldn-meet-output");
  const meetBuilderResetBtn = document.getElementById("ldn-meet-builder-reset");

  if (meetForm && meetOutput) {
    meetForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const yourName = (meetForm.yourName.value || "Mathieu").trim();
      const friendName = (meetForm.friendName.value || "Daniel").trim();
      const yourCountry = meetForm.yourCountry.value || "Congo";
      const yourCity = (meetForm.yourCity.value || "France").trim();
      const job = meetForm.job.value || "I work in France.";
      const reason = meetForm.reason.value || "I’m visiting London for the weekend.";

      const text =
        friendName + ": Hi, is this seat free?\n" +
        yourName + ": Yes, of course. Please sit down.\n" +
        friendName + ": Thanks. My name is " + friendName + ". What’s your name?\n" +
        yourName + ": I’m " + yourName + ". Nice to meet you.\n" +
        friendName + ": Nice to meet you too. Where are you from?\n" +
        yourName + ": I’m from " + yourCountry + ", but I live in " + yourCity + " now.\n" +
        friendName + ": Oh, interesting. What do you do?\n" +
        yourName + ": " + job + "\n" +
        friendName + ": Are you travelling alone?\n" +
        yourName + ": " + reason + "\n" +
        "\nNarrator: " + yourName +
        " is practising small talk in English on the ferry. " +
        "He is getting ready for his weekend in London.";

      meetOutput.value = text;
      meetOutput.classList.add("ldn-fade-in");
    });
  }

  if (meetBuilderResetBtn && meetOutput && meetForm) {
    meetBuilderResetBtn.addEventListener("click", () => {
      meetForm.reset();
      meetOutput.value = "";
      meetOutput.classList.remove("ldn-fade-in");
    });
  }

})();
