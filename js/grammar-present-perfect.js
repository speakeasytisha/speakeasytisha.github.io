document.addEventListener("DOMContentLoaded", function () {
  const lesson = document.getElementById("presentPerfectLesson");
  if (!lesson) return;

  /* ========= GENERIC QUIZ HANDLER ========= */

  function setupQuiz(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;

    const questions = quiz.querySelectorAll(".pp-question");

    questions.forEach((q) => {
      const buttons = q.querySelectorAll(".pp-answers button");
      const feedback = q.querySelector(".pp-feedback");
      const explanation = q.getAttribute("data-explanation") || "";

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          // clear previous styles
          buttons.forEach((b) => {
            b.classList.remove("correct", "incorrect");
          });
          if (feedback) {
            feedback.classList.remove("correct", "incorrect");
          }

          const isCorrect = btn.dataset.correct === "true";
          q.dataset.isCorrect = isCorrect ? "true" : "false";

          if (isCorrect) {
            btn.classList.add("correct");
            if (feedback) {
              feedback.textContent = "✅ Correct! " + explanation;
              feedback.classList.add("correct");
            }
          } else {
            btn.classList.add("incorrect");
            if (feedback) {
              feedback.textContent = "❌ Not quite. " + explanation;
              feedback.classList.add("incorrect");
            }
          }
        });
      });
    });
  }

  function checkQuizScore(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;
    const questions = quiz.querySelectorAll(".pp-question");
    const scoreBox = quiz.querySelector(".pp-score");
    let total = questions.length;
    let correct = 0;

    questions.forEach((q) => {
      if (q.dataset.isCorrect === "true") correct++;
    });

    if (scoreBox) {
      scoreBox.textContent = "Your score: " + correct + " / " + total;
    }
  }

  function resetQuiz(quizId) {
    const quiz = document.getElementById(quizId);
    if (!quiz) return;
    const questions = quiz.querySelectorAll(".pp-question");
    const scoreBox = quiz.querySelector(".pp-score");

    questions.forEach((q) => {
      q.dataset.isCorrect = "";
      const buttons = q.querySelectorAll(".pp-answers button");
      const feedback = q.querySelector(".pp-feedback");
      buttons.forEach((b) => b.classList.remove("correct", "incorrect"));
      if (feedback) {
        feedback.textContent = "";
        feedback.classList.remove("correct", "incorrect");
      }
    });
    if (scoreBox) scoreBox.textContent = "";
  }

  // Init all quizzes used in the lesson
  const quizIds = [
    "pp-quiz-form",
    "pp-quiz-contrast",
    "pp-quiz-adverbs",
    "pp-quiz-sincefor"
  ];
  quizIds.forEach(setupQuiz);

  // Buttons “Check my score” / “Reset quiz”
  lesson.querySelectorAll("[data-quiz-check]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const quizId = btn.getAttribute("data-quiz-check");
      checkQuizScore(quizId);
    });
  });

  lesson.querySelectorAll("[data-quiz-reset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const quizId = btn.getAttribute("data-quiz-reset");
      resetQuiz(quizId);
    });
  });

  /* ========= DRAG & DROP (Present Perfect vs Past Simple) ========= */

  const pool = document.getElementById("pp-dnd-pool");
  const dropCols = lesson.querySelectorAll(".pp-dnd-col");
  const dndScore = document.getElementById("pp-dnd-score");
  let dragged = null;

  function handleDragStart(ev) {
    dragged = ev.target;
    ev.target.classList.add("dragging");
    ev.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd(ev) {
    ev.target.classList.remove("dragging");
  }

  function handleDragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }

  function handleDrop(ev) {
    ev.preventDefault();
    const dropzone = ev.currentTarget.querySelector(".pp-dnd-dropzone");
    if (!dropzone || !dragged) return;
    dropzone.appendChild(dragged);
    dragged.classList.remove("dragging");
    dragged = null;
  }

  function resetDnd() {
    if (!pool) return;
    const items = lesson.querySelectorAll(".pp-dnd-item");
    items.forEach((item) => pool.appendChild(item));
    if (dndScore) dndScore.textContent = "";
  }

  function checkDnd() {
    const items = lesson.querySelectorAll(".pp-dnd-item");
    let total = items.length;
    let correct = 0;

    items.forEach((item) => {
      const parentCol = item.closest(".pp-dnd-col");
      if (!parentCol) return;
      const category = parentCol.getAttribute("data-category");
      const answer = item.getAttribute("data-answer");
      if (category === answer) correct++;
    });

    if (dndScore) {
      dndScore.textContent = "Your score: " + correct + " / " + total;
    }
  }

  if (pool) {
    const items = lesson.querySelectorAll(".pp-dnd-item");
    items.forEach((item) => {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragend", handleDragEnd);
    });

    dropCols.forEach((col) => {
      col.addEventListener("dragover", handleDragOver);
      col.addEventListener("drop", handleDrop);
    });

    pool.addEventListener("dragover", function (ev) {
      ev.preventDefault();
    });
    pool.addEventListener("drop", function (ev) {
      ev.preventDefault();
      if (dragged) {
        pool.appendChild(dragged);
        dragged.classList.remove("dragging");
        dragged = null;
      }
    });

    const checkBtn = document.getElementById("pp-dnd-check");
    const resetBtn = document.getElementById("pp-dnd-reset");
    if (checkBtn) checkBtn.addEventListener("click", checkDnd);
    if (resetBtn) resetBtn.addEventListener("click", resetDnd);
  }

  /* ========= DIALOGUE BUILDER – Catching up with a friend ========= */

  const dlgYourName = document.getElementById("pp-your-name");
  const dlgFriendName = document.getElementById("pp-friend-name");
  const dlgHowLong = document.getElementById("pp-how-long");
  const dlgWorkChange = document.getElementById("pp-work-change");
  const dlgExperience = document.getElementById("pp-experience");
  const dlgFeeling = document.getElementById("pp-feeling");
  const dlgOutput = document.getElementById("pp-dialogue-output");
  const dlgGenerate = document.getElementById("pp-dialogue-generate");
  const dlgClear = document.getElementById("pp-dialogue-clear");

  let dlgUtterance = null;
  let warnedSpeech = false;

  function buildDialogue() {
    const you = (dlgYourName && dlgYourName.value.trim()) || "A";
    const friend = (dlgFriendName && dlgFriendName.value.trim()) || "B";
    const howLong = dlgHowLong ? dlgHowLong.value : "";
    const workChange = dlgWorkChange ? dlgWorkChange.value : "";
    const experience = dlgExperience ? dlgExperience.value : "";
    const feeling = dlgFeeling ? dlgFeeling.value : "";

    const lines = [];

    lines.push(friend + ": Hey " + you + "! It's great to see you again.");
    lines.push(
      you +
        ": Hi " +
        friend +
        "! Yeah, it's been a while. We've known each other " +
        (howLong || "for a long time") +
        "."
    );
    if (workChange) {
      lines.push(friend + ": So, what's new with you?");
      lines.push(you + ": Well, " + workChange + ".");
    }
    if (experience) {
      lines.push(friend + ": Wow, really?");
      lines.push(you + ": Yes, and " + experience + ".");
    }
    if (feeling) {
      lines.push(friend + ": How have you been feeling lately?");
      lines.push(you + ": " + feeling + ".");
    }
    lines.push(friend + ": That sounds great. We should catch up more often!");
    lines.push(you + ": Definitely, it's been really nice to see you.");

    const text = lines.join("\n");
    if (dlgOutput) {
      dlgOutput.textContent = text;
    }
  }

  if (dlgGenerate) dlgGenerate.addEventListener("click", buildDialogue);

  if (dlgClear) {
    dlgClear.addEventListener("click", function () {
      if (dlgYourName) dlgYourName.value = "";
      if (dlgFriendName) dlgFriendName.value = "";
      if (dlgHowLong) dlgHowLong.selectedIndex = 0;
      if (dlgWorkChange) dlgWorkChange.selectedIndex = 0;
      if (dlgExperience) dlgExperience.selectedIndex = 0;
      if (dlgFeeling) dlgFeeling.selectedIndex = 0;
      if (dlgOutput) dlgOutput.textContent = "Your dialogue will appear here…";
    });
  }

  function getDialogueText() {
    if (!dlgOutput) return "";
    const txt = dlgOutput.textContent || "";
    if (!txt || txt === "Your dialogue will appear here…") {
      return "Hi, this is my introduction using the present perfect. I have studied English, I have travelled, and I have learned a lot.";
    }
    return txt;
  }

  function handleDialogueAudio(action) {
    if (!("speechSynthesis" in window)) {
      if (!warnedSpeech) {
        warnedSpeech = true;
        alert(
          "Your browser does not support speech synthesis. The audio buttons may not work."
        );
      }
      return;
    }

    const synth = window.speechSynthesis;

    if (action === "play") {
      if (synth.paused) {
        synth.resume();
        return;
      }
      const text = getDialogueText();
      synth.cancel();
      dlgUtterance = new SpeechSynthesisUtterance(text);
      dlgUtterance.lang = "en-US";
      synth.speak(dlgUtterance);
    } else if (action === "pause") {
      synth.pause();
    } else if (action === "restart") {
      const text = getDialogueText();
      synth.cancel();
      dlgUtterance = new SpeechSynthesisUtterance(text);
      dlgUtterance.lang = "en-US";
      synth.speak(dlgUtterance);
    }
  }

  lesson.querySelectorAll("[data-pp-audio]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = btn.getAttribute("data-pp-audio");
      handleDialogueAudio(action);
    });
  });

  /* ========= NEW: CHILDHOOD MEMORY BUILDER ========= */

  const memName = document.getElementById("pp-mem-your-name");
  const memAge = document.getElementById("pp-mem-age");
  const memPlace = document.getElementById("pp-mem-place");
  const memPeople = document.getElementById("pp-mem-people");
  const memEvent = document.getElementById("pp-mem-event");
  const memFeeling = document.getElementById("pp-mem-feeling");
  const memResult = document.getElementById("pp-mem-result");

  const memOutput = document.getElementById("pp-mem-output");
  const memGenerate = document.getElementById("pp-mem-generate");
  const memClear = document.getElementById("pp-mem-clear");

  let memUtterance = null;
  let memWarnedSpeech = false;

  function buildMemory() {
    const you = (memName && memName.value.trim()) || "I";
    const nameSubject =
      you.toLowerCase() === "i" ? "I" : you; // allow “I” or their name

    const age = memAge ? memAge.value : "";
    const place = memPlace ? memPlace.value : "";
    const people = memPeople ? memPeople.value : "";
    const eventStr = memEvent ? memEvent.value : "";
    const feeling = memFeeling ? memFeeling.value : "";
    const result = memResult ? memResult.value : "";

    const sentences = [];

    // Past simple: setting the scene
    sentences.push(
      nameSubject +
        " " +
        (nameSubject === "I" ? "was " : "was ") +
        (age || "quite young") +
        " and lived " +
        (place || "in my hometown") +
        (people ? " with " + people + "." : ".")
    );

    // What happened
    if (eventStr) {
      sentences.push(
        "One day, " +
          nameSubject.toLowerCase() +
          " " +
          eventStr +
          "."
      );
    }

    // Feelings at the time
    if (feeling) {
      sentences.push(
        nameSubject +
          " " +
          feeling +
          " at that moment."
      );
    }

    // Present perfect – connection with now
    if (result) {
      sentences.push(result + ".");
    } else {
      sentences.push(
        "Since then, " +
          (nameSubject === "I"
            ? "I have kept this memory with me."
            : nameSubject + " has kept this memory for a long time.") +
          ""
      );
    }

    const paragraph = sentences.join(" ");
    if (memOutput) {
      memOutput.textContent = paragraph;
    }
  }

  if (memGenerate) memGenerate.addEventListener("click", buildMemory);

  if (memClear) {
    memClear.addEventListener("click", function () {
      if (memName) memName.value = "";
      if (memAge) memAge.selectedIndex = 0;
      if (memPlace) memPlace.selectedIndex = 0;
      if (memPeople) memPeople.selectedIndex = 0;
      if (memEvent) memEvent.selectedIndex = 0;
      if (memFeeling) memFeeling.selectedIndex = 0;
      if (memResult) memResult.selectedIndex = 0;
      if (memOutput) {
        memOutput.textContent = "Your childhood memory will appear here…";
      }
    });
  }

  function getMemoryText() {
    if (!memOutput) return "";
    const txt = memOutput.textContent || "";
    if (!txt || txt === "Your childhood memory will appear here…") {
      return "When I was a child, I lived with my family and something special happened. I have never forgotten that day.";
    }
    return txt;
  }

  function handleMemoryAudio(action) {
    if (!("speechSynthesis" in window)) {
      if (!memWarnedSpeech) {
        memWarnedSpeech = true;
        alert(
          "Your browser does not support speech synthesis. The audio buttons may not work."
        );
      }
      return;
    }

    const synth = window.speechSynthesis;

    if (action === "play") {
      if (synth.paused) {
        synth.resume();
        return;
      }
      const text = getMemoryText();
      synth.cancel();
      memUtterance = new SpeechSynthesisUtterance(text);
      memUtterance.lang = "en-US";
      synth.speak(memUtterance);
    } else if (action === "pause") {
      synth.pause();
    } else if (action === "restart") {
      const text = getMemoryText();
      synth.cancel();
      memUtterance = new SpeechSynthesisUtterance(text);
      memUtterance.lang = "en-US";
      synth.speak(memUtterance);
    }
  }

  lesson.querySelectorAll("[data-pp-mem-audio]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = btn.getAttribute("data-pp-mem-audio");
      handleMemoryAudio(action);
    });
  });
});
