// Anaïs Leveltel simulation – quiz engine (Parts 1–2 + builders + advanced typing)
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // HELPER FUNCTIONS
    // ===========================
    function normalizeSpaces(str) {
      return (str || "").replace(/\s+/g, " ").trim();
    }

    function formatTodayLongDate() {
      const now = new Date();
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const dayName = dayNames[now.getDay()];
      const monthName = monthNames[now.getMonth()];
      const day = now.getDate();
      const year = now.getFullYear();
      return dayName + ", " + monthName + " " + day + ", " + year;
    }

    const TODAY_WRITTEN_DATE = formatTodayLongDate();

    // ===========================
    // GLOBAL SCORE
    // ===========================
    const quizItems = Array.from(document.querySelectorAll(".quiz-item"));
    const scoreCurrentEl = document.getElementById("score-current");
    const scoreTotalEl = document.getElementById("score-total");
    const resetAllBtn = document.getElementById("reset-all");

    let score = 0;
    const total = quizItems.length;

    if (scoreTotalEl) {
      scoreTotalEl.textContent = String(total);
    }

    function updateScoreDisplay() {
      if (scoreCurrentEl) {
        scoreCurrentEl.textContent = String(score);
      }
    }

    updateScoreDisplay();

    function setFeedback(item, message, state) {
      if (!item) return;
      const feedbackEl = item.querySelector(".feedback");
      if (!feedbackEl) return;
      feedbackEl.textContent = message || "";
      feedbackEl.classList.remove("correct", "incorrect");
      if (state === true) {
        feedbackEl.classList.add("correct");
      } else if (state === false) {
        feedbackEl.classList.add("incorrect");
      }
    }

    function handleCorrect(item) {
      if (!item) return;
      // Avoid adding points twice for the same question
      if (item.dataset.scored === "true") {
        setFeedback(item, "✅ Correct!", true);
        return;
      }
      item.dataset.scored = "true";
      score += 1;
      updateScoreDisplay();
      setFeedback(item, "✅ Correct!", true);
    }

    function handleIncorrect(item, hintOverride) {
      if (!item) return;
      const hint =
        hintOverride ||
        item.dataset.hint ||
        "❌ Not quite. Listen / read again and think about the context.";
      setFeedback(item, hint, false);
    }

    // ===========================
    // LISTENING GROUPS (transcripts)
    // ===========================
    const listeningGroups = [];

    function setupListeningGroup(options) {
      const {
        sectionId,
        questionSelector,
        buttonId,
        transcriptId,
        noteId,
        unlockedText,
      } = options;

      const sectionEl = document.getElementById(sectionId);
      const buttonEl = document.getElementById(buttonId);
      const transcriptEl = document.getElementById(transcriptId);
      const noteEl = noteId ? document.getElementById(noteId) : null;

      if (!sectionEl || !buttonEl || !transcriptEl) {
        return;
      }

      const defaultNoteText = noteEl ? noteEl.textContent : "";

      function checkProgress() {
        const questions = Array.from(
          sectionEl.querySelectorAll(questionSelector)
        );
        if (!questions.length) return;
        const allAttempted = questions.every(
          (q) => q.dataset.attempted === "true"
        );
        if (allAttempted) {
          buttonEl.disabled = false;
          if (noteEl && unlockedText) {
            noteEl.textContent = unlockedText;
          }
        }
      }

      // Initial state
      buttonEl.disabled = true;
      transcriptEl.classList.add("hidden");

      buttonEl.addEventListener("click", function () {
        const isHidden = transcriptEl.classList.contains("hidden");
        if (isHidden) {
          transcriptEl.classList.remove("hidden");
          buttonEl.textContent = "Hide transcript";
        } else {
          transcriptEl.classList.add("hidden");
          buttonEl.textContent = "Show transcript";
        }
      });

      listeningGroups.push({
        sectionEl,
        buttonEl,
        transcriptEl,
        noteEl,
        defaultNoteText,
        unlockedText,
        checkProgress,
      });
    }

    // Part 1 listening
    setupListeningGroup({
      sectionId: "part1",
      questionSelector: ".quiz-item.listening-question",
      buttonId: "show-listening-transcript",
      transcriptId: "listening-transcript",
      noteId: "listening-note",
      unlockedText:
        "You have answered all listening questions. You may now open the transcript to check the details.",
    });

    // Part 2 visio listening
    setupListeningGroup({
      sectionId: "visio-listening",
      questionSelector: ".quiz-item.visio-listening-question",
      buttonId: "show-visio-transcript",
      transcriptId: "visio-transcript",
      noteId: "visio-note",
      unlockedText:
        "You have answered all visio listening questions. You may now open the transcript.",
    });

    function markAttempted(item) {
      if (!item) return;
      item.dataset.attempted = "true";
      listeningGroups.forEach((g) => g.checkProgress());
    }

    // ===========================
    // MULTIPLE CHOICE
    // ===========================
    const mcButtons = Array.from(
      document.querySelectorAll('.quiz-item[data-type="mc"] .mc-option')
    );

    mcButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const item = btn.closest(".quiz-item");
        if (!item) return;

        // If already correctly scored, ignore
        if (item.dataset.scored === "true") {
          return;
        }

        markAttempted(item);

        const isCorrect = btn.dataset.correct === "true";
        const hintFromButton = btn.dataset.hint || "";
        const siblings = item.querySelectorAll(".mc-option");

        if (isCorrect) {
          handleCorrect(item);
          btn.classList.add("chosen");
          siblings.forEach((b) => {
            b.disabled = true;
            if (b !== btn) {
              b.classList.remove("wrong");
            }
          });
        } else {
          handleIncorrect(item, hintFromButton);
          btn.classList.add("wrong");
        }
      });
    });

    // ===========================
    // SELECT QUESTIONS
    // ===========================
    const selectChecks = Array.from(
      document.querySelectorAll(".quiz-item[data-type='select'] .check-select")
    );

    selectChecks.forEach((checkBtn) => {
      checkBtn.addEventListener("click", function () {
        const item = checkBtn.closest(".quiz-item");
        if (!item) return;

        const selectEl = item.querySelector("select");
        if (!selectEl) return;

        const value = (selectEl.value || "").trim();
        if (!value) {
          setFeedback(item, "Please choose an option before checking.", false);
          return;
        }

        markAttempted(item);

        const correctValue = (item.dataset.correct || "").trim();
        if (value === correctValue) {
          handleCorrect(item);
        } else {
          handleIncorrect(item);
        }
      });
    });

    // ===========================
    // INPUT QUESTIONS
    // ===========================
    const inputChecks = Array.from(
      document.querySelectorAll(".quiz-item[data-type='input'] .check-input")
    );

    inputChecks.forEach((checkBtn) => {
      checkBtn.addEventListener("click", function () {
        const item = checkBtn.closest(".quiz-item");
        if (!item) return;

        const inputEl = item.querySelector("input[type='text']");
        if (!inputEl) return;

        const raw = inputEl.value.trim().toLowerCase();
        if (!raw) {
          setFeedback(item, "Please type your answer before checking.", false);
          return;
        }

        markAttempted(item);

        const answersAttr = item.dataset.answers || "";
        const accepted = answersAttr
          .split("|")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);

        if (accepted.length && accepted.includes(raw)) {
          handleCorrect(item);
        } else {
          handleIncorrect(item);
        }
      });
    });

    // ===========================
    // CUSTOM AUDIO CONTROLS
    // ===========================
    const audioGroups = Array.from(
      document.querySelectorAll(".custom-audio-controls")
    );

    audioGroups.forEach((group) => {
      const audioId = group.dataset.audioId;
      if (!audioId) return;
      const audioEl = document.getElementById(audioId);
      if (!audioEl) return;

      const buttons = group.querySelectorAll(".audio-control-btn");
      buttons.forEach((btn) => {
        const action = btn.dataset.action;
        btn.addEventListener("click", function () {
          if (action === "play") {
            audioEl.play();
          } else if (action === "pause") {
            audioEl.pause();
          } else if (action === "restart") {
            audioEl.currentTime = 0;
            audioEl.play();
          }
        });
      });
    });

    // ===========================
    // DRAG & DROP LETTER
    // ===========================
    const dragDropItems = Array.from(
      document.querySelectorAll('.quiz-item[data-type="dragdrop"]')
    );

    dragDropItems.forEach((item) => {
      const dragItems = Array.from(item.querySelectorAll(".drag-item"));
      const dropZones = Array.from(item.querySelectorAll(".drop-zone"));
      const pool = item.querySelector(".drag-items-pool");

      dragItems.forEach((drag) => {
        drag.addEventListener("dragstart", function (e) {
          e.dataTransfer.setData("text/plain", drag.id);
        });
      });

      dropZones.forEach((zone) => {
        zone.addEventListener("dragover", function (e) {
          e.preventDefault();
        });

        zone.addEventListener("drop", function (e) {
          e.preventDefault();
          const dragId = e.dataTransfer.getData("text/plain");
          const dragged = document.getElementById(dragId);
          if (!dragged) return;

          // Only one item per zone
          if (zone.querySelector(".drag-item")) {
            setFeedback(
              item,
              "This part of the letter is already filled. Use Reset all to start again.",
              false
            );
            return;
          }

          markAttempted(item);

          const expected = zone.dataset.accept || "";
          const actual = dragged.dataset.part || "";

          if (expected && expected === actual) {
            zone.appendChild(dragged);
            dragged.setAttribute("draggable", "false");
            zone.classList.add("filled");

            const allCorrect = dropZones.every((z) => {
              const child = z.querySelector(".drag-item");
              return child && child.dataset.part === z.dataset.accept;
            });

            if (allCorrect) {
              handleCorrect(item);
            } else {
              setFeedback(
                item,
                "✅ Good. Continue with the other parts of the email.",
                true
              );
            }
          } else {
            handleIncorrect(
              item,
              "❌ That block does not belong here. Think about the usual order of an email."
            );
          }
        });
      });
    });

    // ===========================
    // ROLE-PLAY BUILDER
    // ===========================
    const buildRoleplayBtn = document.getElementById("build-roleplay");
    const roleplayOutput = document.getElementById("roleplay-output");

    if (buildRoleplayBtn && roleplayOutput) {
      buildRoleplayBtn.addEventListener("click", function () {
        const steps = Array.from(
          document.querySelectorAll(".quiz-item.roleplay-step")
        );
        const lines = [];

        steps.forEach((step) => {
          const chosen = step.querySelector(".mc-option.chosen");
          if (chosen) {
            lines.push(chosen.textContent.trim());
          }
        });

        if (!lines.length) {
          roleplayOutput.textContent =
            "Answer the role-play questions first. Your correct choices will appear here.";
        } else {
          roleplayOutput.textContent = lines.join(" ");
        }
      });
    }

    // ===========================
    // WRITING & MONOLOGUE BUILDERS (dropdown version)
    // ===========================
    const builderState = {
      gender: "female",
      emailSentences: {},
      monologueSentences: {},
      email2Parts: {},
      monologue2Parts: {},
    };

    const genderRadios = Array.from(
      document.querySelectorAll('input[name="builder-gender"]')
    );

    const emailSteps = Array.from(
      document.querySelectorAll('.builder-step[data-builder="email"]')
    );
    const monologueSteps = Array.from(
      document.querySelectorAll('.builder-step[data-builder="monologue"]')
    );

    const emailPreview = document.getElementById("email-builder-preview");
    const emailResetBtn = document.getElementById("email-builder-reset");

    const monoPreview = document.getElementById("monologue-builder-preview");
    const monoResetBtn = document.getElementById("monologue-builder-reset");

    if (genderRadios.length) {
      // Initialise from checked radio
      const checked = genderRadios.find((r) => r.checked);
      if (checked) {
        builderState.gender = checked.value === "male" ? "male" : "female";
      }

      genderRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
          builderState.gender = this.value === "male" ? "male" : "female";
          updateMonologuePreview();
          updateMonologue2Preview();
        });
      });
    }

    function buildSentenceFromTemplate(template, subject, verb, poss) {
      let s = template.replace(/SUBJECT/g, subject).replace(/VERB/g, verb);
      if (typeof poss === "string") {
        s = s.replace(/POSS/g, poss);
      }
      return s;
    }

    function parseCorrectValues(attr) {
      if (!attr) return [];
      return attr
        .split("|")
        .map((v) => v.trim())
        .filter(Boolean);
    }

    function handleBuilderCheckAdd(stepEl, kind) {
      const subjectSelect = stepEl.querySelector(".builder-subject");
      const verbSelect = stepEl.querySelector(".builder-verb");
      const possSelect = stepEl.querySelector(".builder-poss");
      const template = stepEl.dataset.template || "";

      if (!subjectSelect || !verbSelect || !possSelect || !template) {
        return;
      }

      const subj = subjectSelect.value.trim();
      const verb = verbSelect.value.trim();
      const poss = possSelect.value.trim();

      if (!subj || !verb || !poss) {
        setFeedback(
          stepEl,
          "Please choose an option in each dropdown before checking.",
          false
        );
        return;
      }

      const correctSubjects = parseCorrectValues(
        stepEl.dataset.correctSubject || ""
      );
      const correctVerbs = parseCorrectValues(
        stepEl.dataset.correctVerb || ""
      );
      const correctPoss = parseCorrectValues(
        stepEl.dataset.correctPoss || ""
      );

      const subjOk =
        !correctSubjects.length || correctSubjects.includes(subj);
      const verbOk = !correctVerbs.length || correctVerbs.includes(verb);
      const possOk = !correctPoss.length || correctPoss.includes(poss);

      if (subjOk && verbOk && possOk) {
        const sentence = buildSentenceFromTemplate(
          template,
          subj,
          verb,
          poss
        );
        const key = stepEl.dataset.stepId || "";

        if (kind === "email") {
          builderState.emailSentences[key] = sentence;
          updateEmailPreview();
        } else if (kind === "monologue") {
          builderState.monologueSentences[key] = sentence;
          updateMonologuePreview();
        }

        setFeedback(
          stepEl,
          "✅ Correct! The sentence has been added.",
          true
        );
      } else {
        const hint =
          stepEl.dataset.hint ||
          "❌ Not quite. Check subject–verb agreement and the possessive pronoun.";
        setFeedback(stepEl, hint, false);
      }
    }

    function updateEmailPreview() {
      if (!emailPreview) return;
      const sentences = builderState.emailSentences;
      const order = ["email-1", "email-2", "email-3"];
      const parts = [];

      if (Object.keys(sentences).length === 0) {
        emailPreview.textContent =
          "Your email will appear here after you build and validate the sentences.";
        return;
      }

      parts.push("Subject: Grand Tour visio confirmation");
      parts.push("");
      parts.push("Dear partner,");
      parts.push("");

      order.forEach((key) => {
        if (sentences[key]) {
          parts.push(sentences[key]);
        }
      });

      parts.push("");
      parts.push("Best regards,");
      parts.push("Anaïs");

      emailPreview.textContent = parts.join("\n");
    }

    function updateMonologuePreview() {
      if (!monoPreview) return;
      const sentences = builderState.monologueSentences;
      const order = ["mono-1", "mono-2", "mono-3"];
      const parts = [];
      const genderWord = builderState.gender === "male" ? "male" : "female";

      if (Object.keys(sentences).length === 0) {
        monoPreview.textContent =
          "Your monologue will appear here after you build and validate the sentences.";
        return;
      }

      parts.push("Hello, my name is Anaïs.");
      parts.push(
        `I am a ${genderWord} train manager on “Le Grand Tour”, a luxury night train around France.`
      );
      parts.push("");

      order.forEach((key) => {
        if (sentences[key]) {
          parts.push(sentences[key]);
        }
      });

      monoPreview.textContent = parts.join(" ");
    }

    // Hook buttons for first-level builders
    emailSteps.forEach((step) => {
      const btn = step.querySelector(".builder-check-add");
      if (!btn) return;
      btn.addEventListener("click", function () {
        handleBuilderCheckAdd(step, "email");
      });
    });

    monologueSteps.forEach((step) => {
      const btn = step.querySelector(".builder-check-add");
      if (!btn) return;
      btn.addEventListener("click", function () {
        handleBuilderCheckAdd(step, "monologue");
      });
    });

    function resetBuilderGroup(steps, type) {
      steps.forEach((step) => {
        const subjectSelect = step.querySelector(".builder-subject");
        const verbSelect = step.querySelector(".builder-verb");
        const possSelect = step.querySelector(".builder-poss");
        if (subjectSelect) subjectSelect.selectedIndex = 0;
        if (verbSelect) verbSelect.selectedIndex = 0;
        if (possSelect) possSelect.selectedIndex = 0;
        setFeedback(step, "", null);
      });

      if (type === "email") {
        builderState.emailSentences = {};
        updateEmailPreview();
      } else if (type === "monologue") {
        builderState.monologueSentences = {};
        updateMonologuePreview();
      }
    }

    if (emailResetBtn) {
      emailResetBtn.addEventListener("click", function () {
        resetBuilderGroup(emailSteps, "email");
      });
    }

    if (monoResetBtn) {
      monoResetBtn.addEventListener("click", function () {
        resetBuilderGroup(monologueSteps, "monologue");
      });
    }

    if (emailPreview) {
      emailPreview.textContent =
        "Your email will appear here after you build and validate the sentences.";
    }
    if (monoPreview) {
      monoPreview.textContent =
        "Your monologue will appear here after you build and validate the sentences.";
    }

    // ===========================
    // ADVANCED TYPED BUILDERS (email2 + monologue2)
    // ===========================
    const email2Steps = Array.from(
      document.querySelectorAll(
        '.builder-step.typed-step[data-builder="email2"]'
      )
    );
    const monologue2Steps = Array.from(
      document.querySelectorAll(
        '.builder-step.typed-step[data-builder="monologue2"]'
      )
    );

    const email2Preview = document.getElementById("email2-builder-preview");
    const email2ResetBtn = document.getElementById("email2-builder-reset");
    const mono2Preview = document.getElementById("monologue2-builder-preview");
    const mono2ResetBtn = document.getElementById("monologue2-builder-reset");

    function updateEmail2Preview() {
      if (!email2Preview) return;
      const parts = builderState.email2Parts || {};
      if (Object.keys(parts).length === 0) {
        email2Preview.textContent =
          "Your guided rescheduling email will appear here after you type and validate each step.";
        return;
      }

      const lines = [];
      if (parts.date) {
        lines.push(parts.date);
        lines.push("");
      }
      if (parts.subject) {
        lines.push("Subject: " + parts.subject);
        lines.push("");
      }
      if (parts.greeting) {
        lines.push(parts.greeting);
        lines.push("");
      }
      if (parts.opening) {
        lines.push(parts.opening);
      }
      if (parts.body) {
        lines.push(parts.body);
      }
      if (parts.closing) {
        lines.push("");
        lines.push(parts.closing);
      }
      if (parts.signature) {
        lines.push(parts.signature);
        lines.push("Anaïs");
      }

      email2Preview.textContent = lines.join("\n");
    }

    function updateMonologue2Preview() {
      if (!mono2Preview) return;
      const parts = builderState.monologue2Parts || {};

      if (Object.keys(parts).length === 0) {
        mono2Preview.textContent =
          "Your guided monologue will appear here after you type and validate each step.";
        return;
      }

      const lines = [];
      if (parts.intro) {
        lines.push(parts.intro);
      }
      if (parts.responsibilities) {
        lines.push(parts.responsibilities);
      }
      if (parts.closing) {
        lines.push(parts.closing);
      }

      mono2Preview.textContent = lines.join(" ");
    }

    function handleTypedEmailStep(stepEl) {
      const checkType = stepEl.dataset.check || "";
      if (!checkType) return;

      // Step 1 – today's date
      if (checkType === "email2-date") {
        const input = stepEl.querySelector(".typed-input");
        if (!input) return;
        const raw = normalizeSpaces(input.value);
        if (!raw) {
          setFeedback(
            stepEl,
            "Type today's date in written English, for example: Monday, December 15, 2025.",
            false
          );
          return;
        }
        if (raw === TODAY_WRITTEN_DATE) {
          builderState.email2Parts.date = raw;
          updateEmail2Preview();
          setFeedback(
            stepEl,
            "✅ Correct! Today's date has been added to the email.",
            true
          );
        } else {
          setFeedback(
            stepEl,
            "❌ Check the day of the week, capital letters and the comma before the year.",
            false
          );
        }
        return;
      }

      // Step 2 – subject
      if (checkType === "email2-subject") {
        const input = stepEl.querySelector(".typed-input");
        if (!input) return;
        const raw = normalizeSpaces(input.value);
        const expected = normalizeSpaces(stepEl.dataset.expected || "");
        if (!raw) {
          setFeedback(
            stepEl,
            "Type the complete subject line before checking.",
            false
          );
          return;
        }
        if (expected && raw === expected) {
          builderState.email2Parts.subject = raw;
          updateEmail2Preview();
          setFeedback(stepEl, "✅ Correct subject line.", true);
        } else {
          setFeedback(
            stepEl,
            "❌ Check spelling, spaces, capital letters and the time format.",
            false
          );
        }
        return;
      }

      // Step 3 – greeting (pattern-based)
      if (checkType === "email2-greeting") {
        const input = stepEl.querySelector(".typed-input");
        if (!input) return;
        const raw = input.value.trim();
        if (!raw) {
          setFeedback(stepEl, "Write a greeting before checking.", false);
          return;
        }
        const startsWithDear = raw.indexOf("Dear ") === 0;
        const hasSNCF = raw.indexOf("SNCF") !== -1;
        const endsWithComma = raw.endsWith(",");
        if (startsWithDear && hasSNCF && endsWithComma) {
          builderState.email2Parts.greeting = raw;
          updateEmail2Preview();
          setFeedback(
            stepEl,
            "✅ Good greeting with 'Dear', 'SNCF' and a comma.",
            true
          );
        } else {
          setFeedback(
            stepEl,
            "❌ Your greeting should start with 'Dear', include 'SNCF' and end with a comma.",
            false
          );
        }
        return;
      }

      // Steps 4–6 – opening / body / closing (exact model)
      if (
        checkType === "email2-opening" ||
        checkType === "email2-body" ||
        checkType === "email2-closing"
      ) {
        const input =
          stepEl.querySelector("textarea.typed-input") ||
          stepEl.querySelector("input.typed-input");
        if (!input) return;
        const raw = normalizeSpaces(input.value);
        const expected = normalizeSpaces(stepEl.dataset.expected || "");
        if (!raw) {
          setFeedback(stepEl, "Please type the sentence before checking.", false);
          return;
        }
        if (expected && raw === expected) {
          if (checkType === "email2-opening") {
            builderState.email2Parts.opening = raw;
          } else if (checkType === "email2-body") {
            builderState.email2Parts.body = raw;
          } else if (checkType === "email2-closing") {
            builderState.email2Parts.closing = raw;
          }
          updateEmail2Preview();
          setFeedback(stepEl, "✅ Correct sentence.", true);
        } else {
          let extraHint = "";
          if (checkType === "email2-opening") {
            extraHint =
              "Focus on 'not available for the meeting on Thursday at 10:00 a.m.'.";
          } else if (checkType === "email2-body") {
            extraHint =
              "Make sure you include 'rescheduling the meeting' and the new date and time.";
          } else if (checkType === "email2-closing") {
            extraHint = "Check the polite formula and punctuation.";
          }
          setFeedback(
            stepEl,
            "❌ Something is different from the model sentence. " + extraHint,
            false
          );
        }
        return;
      }

      // Step 7 – signature (sign-off)
      if (checkType === "email2-signature") {
        const input = stepEl.querySelector(".typed-input");
        if (!input) return;
        const raw = normalizeSpaces(input.value);
        const expected = normalizeSpaces(stepEl.dataset.expected || "");
        if (!raw) {
          setFeedback(stepEl, "Type the sign-off line before checking.", false);
          return;
        }
        if (expected && raw === expected) {
          builderState.email2Parts.signature = raw;
          updateEmail2Preview();
          setFeedback(stepEl, "✅ Correct sign-off line.", true);
        } else {
          setFeedback(
            stepEl,
            "❌ Check spelling, capital letters and the comma. Example: 'Best regards,'",
            false
          );
        }
      }
    }

    function handleTypedMonologueStep(stepEl) {
      const checkType = stepEl.dataset.check || "";
      if (!checkType) return;

      // Step 1 – intro verb
      if (checkType === "mono2-intro") {
        const verbInput = stepEl.querySelector("input[data-role='intro-verb']");
        if (!verbInput) return;
        const value = normalizeSpaces(verbInput.value).toLowerCase();
        if (!value) {
          setFeedback(
            stepEl,
            "Type one verb from the list, for example 'work'.",
            false
          );
          return;
        }
        if (value === "work") {
          const sentence =
            'I work as train manager on “Le Grand Tour”, a luxury night train around France.';
          builderState.monologue2Parts.intro = sentence;
          updateMonologue2Preview();
          setFeedback(stepEl, "✅ Correct verb form.", true);
        } else {
          setFeedback(
            stepEl,
            "❌ Use the base form 'work' for a present simple routine.",
            false
          );
        }
        return;
      }

      // Step 2 – responsibilities + sequence words
      if (checkType === "mono2-responsibilities") {
        const seq1 = normalizeSpaces(
          (stepEl.querySelector("input[data-role='seq1']") || {}).value || ""
        );
        const verb1 = normalizeSpaces(
          (stepEl.querySelector("input[data-role='verb1']") || {}).value || ""
        ).toLowerCase();
        const seq2 = normalizeSpaces(
          (stepEl.querySelector("input[data-role='seq2']") || {}).value || ""
        );
        const verb2 = normalizeSpaces(
          (stepEl.querySelector("input[data-role='verb2']") || {}).value || ""
        ).toLowerCase();
        const seq3 = normalizeSpaces(
          (stepEl.querySelector("input[data-role='seq3']") || {}).value || ""
        );
        const verb3 = normalizeSpaces(
          (stepEl.querySelector("input[data-role='verb3']") || {}).value || ""
        ).toLowerCase();

        if (!seq1 || !seq2 || !seq3 || !verb1 || !verb2 || !verb3) {
          setFeedback(
            stepEl,
            "Fill in all the sequence words and verbs before checking.",
            false
          );
          return;
        }

        const okSeq1 = seq1 === "First";
        const okSeq2 = seq2 === "Then";
        const okSeq3 = seq3 === "Finally";
        const okVerb1 = verb1 === "welcome";
        const okVerb2 = verb2 === "coordinate";
        const okVerb3 = verb3 === "explain";

        if (okSeq1 && okSeq2 && okSeq3 && okVerb1 && okVerb2 && okVerb3) {
          const text =
            seq1 +
            ", I welcome our guests on the platform and help them board the train. " +
            seq2 +
            ", I coordinate with the onboard team and check the cabins. " +
            seq3 +
            ", I explain the evening programme and answer guests' questions.";
          builderState.monologue2Parts.responsibilities = text;
          updateMonologue2Preview();
          setFeedback(stepEl, "✅ Nice sequence and responsibilities.", true);
        } else {
          setFeedback(
            stepEl,
            "❌ Use 'First', 'Then', 'Finally' and the verbs 'welcome', 'coordinate', 'explain' in the correct places.",
            false
          );
        }
        return;
      }

      // Step 3 – closing sentence
      if (checkType === "mono2-closing") {
        const input = stepEl.querySelector(".typed-input");
        if (!input) return;
        const raw = normalizeSpaces(input.value);
        const expected = normalizeSpaces(stepEl.dataset.expected || "");
        if (!raw) {
          setFeedback(stepEl, "Type the closing sentence before checking.", false);
          return;
        }
        if (expected && raw === expected) {
          builderState.monologue2Parts.closing = raw;
          updateMonologue2Preview();
          setFeedback(stepEl, "✅ Correct closing sentence.", true);
        } else {
          setFeedback(
            stepEl,
            "❌ Check the verb forms and the expression 'travel experience'.",
            false
          );
        }
      }
    }

    // Attach event listeners to typed builders
    const typedSteps = Array.from(
      document.querySelectorAll(".builder-step.typed-step")
    );

    typedSteps.forEach((step) => {
      const btn = step.querySelector(".typed-check-add");
      if (!btn) return;
      btn.addEventListener("click", function () {
        const builder = step.dataset.builder || "";
        if (builder === "email2") {
          handleTypedEmailStep(step);
        } else if (builder === "monologue2") {
          handleTypedMonologueStep(step);
        }
      });
    });

    function resetTypedBuilderGroup(steps, type) {
      steps.forEach((step) => {
        const inputs = step.querySelectorAll("input[type='text'], textarea");
        inputs.forEach((inp) => {
          inp.value = "";
        });
        setFeedback(step, "", null);
      });

      if (type === "email2") {
        builderState.email2Parts = {};
        updateEmail2Preview();
      } else if (type === "monologue2") {
        builderState.monologue2Parts = {};
        updateMonologue2Preview();
      }
    }

    if (email2Preview) {
      email2Preview.textContent =
        "Your guided rescheduling email will appear here after you type and validate each step.";
    }
    if (mono2Preview) {
      mono2Preview.textContent =
        "Your guided monologue will appear here after you type and validate each step.";
    }

    if (email2ResetBtn) {
      email2ResetBtn.addEventListener("click", function () {
        resetTypedBuilderGroup(email2Steps, "email2");
      });
    }

    if (mono2ResetBtn) {
      mono2ResetBtn.addEventListener("click", function () {
        resetTypedBuilderGroup(monologue2Steps, "monologue2");
      });
    }

    // ===========================
    // RESET ALL
    // ===========================
    if (resetAllBtn) {
      resetAllBtn.addEventListener("click", function () {
        score = 0;
        updateScoreDisplay();

        quizItems.forEach((item) => {
          delete item.dataset.scored;
          delete item.dataset.attempted;

          // Clear feedback
          setFeedback(item, "", null);

          // MC reset
          if (item.dataset.type === "mc") {
            const buttons = item.querySelectorAll(".mc-option");
            buttons.forEach((b) => {
              b.disabled = false;
              b.classList.remove("chosen", "wrong");
            });
          }

          // Select reset
          if (item.dataset.type === "select") {
            const selectEl = item.querySelector("select");
            if (selectEl) {
              selectEl.selectedIndex = 0;
            }
          }

          // Input reset
          if (item.dataset.type === "input") {
            const inputEl = item.querySelector("input[type='text']");
            if (inputEl) {
              inputEl.value = "";
            }
          }

          // Drag & drop reset
          if (item.dataset.type === "dragdrop") {
            const pool = item.querySelector(".drag-items-pool");
            const dItems = item.querySelectorAll(".drag-item");
            const dropZones = item.querySelectorAll(".drop-zone");
            if (pool) {
              dItems.forEach((d) => {
                d.setAttribute("draggable", "true");
                pool.appendChild(d);
              });
            }
            dropZones.forEach((z) => z.classList.remove("filled"));
          }
        });

        // Reset listening groups (transcripts & notes)
        listeningGroups.forEach((g) => {
          if (g.buttonEl) {
            g.buttonEl.disabled = true;
            g.buttonEl.textContent = "Show transcript";
          }
          if (g.transcriptEl) {
            g.transcriptEl.classList.add("hidden");
          }
          if (g.noteEl && typeof g.defaultNoteText === "string") {
            g.noteEl.textContent = g.defaultNoteText;
          }
        });

        // Reset role-play output
        if (roleplayOutput) {
          roleplayOutput.textContent = "";
        }

        // Reset first-level builders
        resetBuilderGroup(emailSteps, "email");
        resetBuilderGroup(monologueSteps, "monologue");

        // Reset advanced typed builders
        if (email2Steps.length) {
          resetTypedBuilderGroup(email2Steps, "email2");
        }
        if (monologue2Steps.length) {
          resetTypedBuilderGroup(monologue2Steps, "monologue2");
        }

        // Reset gender selection to female by default
        if (genderRadios.length) {
          genderRadios.forEach((radio) => {
            if (radio.value === "female") {
              radio.checked = true;
              builderState.gender = "female";
            } else {
              radio.checked = false;
            }
          });
          updateMonologuePreview();
          updateMonologue2Preview();
        }
      });
    }
  });
})();
