/* =========================================================
   Prepositions – Interactive lesson JS
   File: js/prepositions-lesson.js
   ========================================================= */

(function () {
  const $ = (id) => document.getElementById(id);
  const yearEl = $("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Hero image per page (read from body[data-hero-image])
  const heroPath = document.body?.getAttribute("data-hero-image");
  if (heroPath) {
    document.documentElement.style.setProperty("--page-hero-url", `url('${heroPath}')`);
  }

  // -------------------------
  // Speech (Listen / Stop)
  // -------------------------
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }
  function stopSpeak() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  }

  // -------------------------
  // Quiz engine (MCQ buttons)
  // -------------------------
  function renderMCQ(containerId, items, ui) {
    const wrap = $(containerId);
    if (!wrap) return;

    wrap.innerHTML = "";
    items.forEach((q, idx) => {
      const card = document.createElement("div");
      card.className = "prp-q";
      card.dataset.correct = q.correct;

      const p = document.createElement("p");
      p.innerHTML = `<strong>${idx + 1}.</strong> ${q.prompt}`;
      card.appendChild(p);

      const opts = document.createElement("div");
      opts.className = "prp-options";

      q.options.forEach((opt) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = opt.key;
        b.dataset.option = opt.key;
        b.addEventListener("click", () => {
          if (card.dataset.answered === "1") return;
          card.dataset.answered = "1";

          const correct = card.dataset.correct;
          const chosen = b.dataset.option;

          // disable all
          opts.querySelectorAll("button").forEach((btn) => (btn.disabled = true));

          const fb = card.querySelector(".prp-feedback");
          if (chosen === correct) {
            b.classList.add("is-correct");
            fb.classList.add("good");
            fb.classList.remove("bad");
            fb.innerHTML = `✅ Correct. <span class="hint">${q.explain || ""}</span>`;
            ui.correct++;
          } else {
            b.classList.add("is-wrong");
            // mark correct button
            const okBtn = opts.querySelector(`button[data-option="${CSS.escape(correct)}"]`);
            if (okBtn) okBtn.classList.add("is-correct");
            fb.classList.add("bad");
            fb.classList.remove("good");
            const hint = q.hint ? `Hint: ${q.hint}` : "";
            fb.innerHTML = `❌ Not quite. <span class="hint">${hint} ${q.explain || ""}</span>`;
          }
          ui.answered++;
          ui.updatePill();
        });
        opts.appendChild(b);
      });

      card.appendChild(opts);

      const fb = document.createElement("div");
      fb.className = "prp-feedback";
      fb.innerHTML = q.hint ? `<span class="hint">Hint: ${q.hint}</span>` : "";
      card.appendChild(fb);

      wrap.appendChild(card);
    });

    ui.total = items.length;
    ui.updatePill();
  }

  function makeQuizUI(prefix) {
    const ui = {
      correct: 0,
      answered: 0,
      total: 0,
      updatePill() {
        const c = $(`prp-${prefix}-correct`);
        const t = $(`prp-${prefix}-total`);
        if (c) c.textContent = String(this.correct);
        if (t) t.textContent = String(this.total);
      },
      reset(containerId, items) {
        this.correct = 0;
        this.answered = 0;
        this.total = items.length;
        const final = $(`prp-${prefix}-final`);
        if (final) final.textContent = "";
        renderMCQ(containerId, items, this);
      },
      showFinal() {
        const final = $(`prp-${prefix}-final`);
        if (!final) return;
        const pct = this.total ? Math.round((this.correct / this.total) * 100) : 0;
        let msg = `Score: ${this.correct}/${this.total} (${pct}%). `;
        if (pct >= 90) msg += "Excellent — very natural choices.";
        else if (pct >= 75) msg += "Strong — review 1–2 patterns and repeat.";
        else if (pct >= 60) msg += "Good start — focus on the cheat sheet and do the quiz again.";
        else msg += "Repeat the lesson: time/place rules + collocations.";
        final.textContent = msg;
      }
    };
    return ui;
  }

  // -------------------------
  // Data: Place / Time / Movement
  // -------------------------
  const PLACE = [
    {
      prompt: "The meeting is ___ the second floor.",
      options: [{ key: "on" }, { key: "in" }, { key: "at" }],
      correct: "on",
      hint: "Floors are like lines/surfaces.",
      explain: "We say <strong>on</strong> the second floor."
    },
    {
      prompt: "I left my keys ___ the table.",
      options: [{ key: "on" }, { key: "in" }, { key: "at" }],
      correct: "on",
      hint: "Surface.",
      explain: "A table is a surface → <strong>on</strong>."
    },
    {
      prompt: "She’s waiting ___ the bus stop.",
      options: [{ key: "at" }, { key: "in" }, { key: "on" }],
      correct: "at",
      hint: "A point/place.",
      explain: "We say <strong>at</strong> the bus stop."
    },
    {
      prompt: "They live ___ London but work ___ home today.",
      options: [{ key: "in / at" }, { key: "at / in" }, { key: "in / in" }],
      correct: "in / at",
      hint: "City vs fixed expression.",
      explain: "<strong>in</strong> London; <strong>at</strong> home."
    },
    {
      prompt: "He sat ___ the window and looked ___ the street.",
      options: [{ key: "by / at" }, { key: "in / on" }, { key: "at / by" }],
      correct: "by / at",
      hint: "Near + look.",
      explain: "We sit <strong>by</strong> the window; look <strong>at</strong> something."
    },
    {
      prompt: "The café is ___ the station, right ___ the entrance.",
      options: [{ key: "next to / at" }, { key: "in / on" }, { key: "between / in" }],
      correct: "next to / at",
      hint: "Near + point.",
      explain: "<strong>next to</strong> the station; <strong>at</strong> the entrance."
    },
    {
      prompt: "There’s a pharmacy ___ the corner (corner = point).",
      options: [{ key: "at" }, { key: "in" }, { key: "on" }],
      correct: "at",
      hint: "Point.",
      explain: "<strong>at</strong> the corner."
    },
    {
      prompt: "The picture is ___ the wall.",
      options: [{ key: "on" }, { key: "in" }, { key: "at" }],
      correct: "on",
      hint: "Surface.",
      explain: "<strong>on</strong> the wall."
    },
    {
      prompt: "I’m ___ a taxi. Are you already ___ the office?",
      options: [{ key: "in / at" }, { key: "on / in" }, { key: "in / on" }],
      correct: "in / at",
      hint: "Taxi vs office.",
      explain: "We’re <strong>in</strong> a taxi; <strong>at</strong> the office."
    },
    {
      prompt: "My seat is ___ row 12, but I’m sitting ___ the aisle.",
      options: [{ key: "in / on" }, { key: "on / in" }, { key: "at / in" }],
      correct: "in / on",
      hint: "Row = inside a set; aisle = position/line.",
      explain: "<strong>in</strong> row 12; <strong>on</strong> the aisle (on the aisle seat)."
    }
  ];

  const TIME = [
    {
      prompt: "The train leaves ___ 6:45.",
      options: [{ key: "at" }, { key: "on" }, { key: "in" }],
      correct: "at",
      hint: "Clock time.",
      explain: "Clock times use <strong>at</strong>."
    },
    {
      prompt: "Our meeting is ___ Monday morning.",
      options: [{ key: "on" }, { key: "in" }, { key: "at" }],
      correct: "on",
      hint: "Day + part of day.",
      explain: "We say <strong>on</strong> Monday morning."
    },
    {
      prompt: "She was born ___ 1998.",
      options: [{ key: "in" }, { key: "on" }, { key: "at" }],
      correct: "in",
      hint: "Year.",
      explain: "Years use <strong>in</strong>."
    },
    {
      prompt: "I’ll finish the report ___ Friday (deadline).",
      options: [{ key: "by" }, { key: "until" }, { key: "during" }],
      correct: "by",
      hint: "Deadline vs duration.",
      explain: "<strong>by</strong> = latest time."
    },
    {
      prompt: "I’ll be in the office ___ 6 p.m. (I stop at 6).",
      options: [{ key: "until" }, { key: "by" }, { key: "since" }],
      correct: "until",
      hint: "Continue → end.",
      explain: "<strong>until</strong> = continuation up to an end time."
    },
    {
      prompt: "I’ve worked here ___ three years.",
      options: [{ key: "for" }, { key: "since" }, { key: "during" }],
      correct: "for",
      hint: "Duration.",
      explain: "<strong>for</strong> + duration."
    },
    {
      prompt: "I’ve worked here ___ 2022.",
      options: [{ key: "since" }, { key: "for" }, { key: "until" }],
      correct: "since",
      hint: "Start point.",
      explain: "<strong>since</strong> + start point."
    },
    {
      prompt: "We stayed quiet ___ the presentation.",
      options: [{ key: "during" }, { key: "for" }, { key: "by" }],
      correct: "during",
      hint: "Inside an event.",
      explain: "<strong>during</strong> + event."
    },
    {
      prompt: "They moved to the UK ___ April.",
      options: [{ key: "in" }, { key: "on" }, { key: "at" }],
      correct: "in",
      hint: "Month.",
      explain: "Months use <strong>in</strong>."
    },
    {
      prompt: "I’ll call you ___ a moment.",
      options: [{ key: "in" }, { key: "on" }, { key: "at" }],
      correct: "in",
      hint: "In + a short time.",
      explain: "We say <strong>in</strong> a moment / in 5 minutes."
    }
  ];

  const MOVE = [
    {
      prompt: "She walked ___ the room and sat down.",
      options: [{ key: "into" }, { key: "to" }, { key: "on" }],
      correct: "into",
      hint: "Entering.",
      explain: "<strong>into</strong> = entering."
    },
    {
      prompt: "We drove ___ the airport.",
      options: [{ key: "to" }, { key: "into" }, { key: "at" }],
      correct: "to",
      hint: "Destination.",
      explain: "<strong>to</strong> = destination."
    },
    {
      prompt: "He stepped ___ the bus.",
      options: [{ key: "onto" }, { key: "into" }, { key: "at" }],
      correct: "onto",
      hint: "Move to a surface/vehicle step.",
      explain: "<strong>onto</strong> emphasises movement to a surface."
    },
    {
      prompt: "They ran ___ the tunnel and out the other side.",
      options: [{ key: "through" }, { key: "across" }, { key: "along" }],
      correct: "through",
      hint: "Inside then out.",
      explain: "<strong>through</strong> = in one side, out the other."
    },
    {
      prompt: "We walked ___ the bridge to the other side.",
      options: [{ key: "across" }, { key: "through" }, { key: "along" }],
      correct: "across",
      hint: "One side to the other.",
      explain: "<strong>across</strong> the bridge."
    },
    {
      prompt: "They walked ___ the river for 20 minutes.",
      options: [{ key: "along" }, { key: "across" }, { key: "into" }],
      correct: "along",
      hint: "Follow a line.",
      explain: "<strong>along</strong> the river."
    },
    {
      prompt: "I’m going ___ London tomorrow, but today I’m ___ London.",
      options: [{ key: "to / in" }, { key: "in / to" }, { key: "at / on" }],
      correct: "to / in",
      hint: "Movement vs location.",
      explain: "Go <strong>to</strong> (movement) / be <strong>in</strong> (location)."
    },
    {
      prompt: "We walked ___ the bank and towards the square.",
      options: [{ key: "past" }, { key: "between" }, { key: "behind" }],
      correct: "past",
      hint: "Go beyond/next to while moving.",
      explain: "<strong>past</strong> = go by it."
    }
  ];

  // -------------------------
  // Collocation select quiz
  // -------------------------
  const COLLOC = [
    { label: "I’m interested ___ learning more.", correct: "in", options: ["in", "at", "on"], explain: "interested <strong>in</strong>" },
    { label: "She’s good ___ problem-solving.", correct: "at", options: ["at", "in", "on"], explain: "good <strong>at</strong>" },
    { label: "It depends ___ the schedule.", correct: "on", options: ["on", "of", "to"], explain: "depend <strong>on</strong>" },
    { label: "Please wait ___ me.", correct: "for", options: ["for", "to", "on"], explain: "wait <strong>for</strong>" },
    { label: "Listen ___ this message.", correct: "to", options: ["to", "for", "on"], explain: "listen <strong>to</strong>" },
    { label: "He’s responsible ___ the team.", correct: "for", options: ["for", "of", "to"], explain: "responsible <strong>for</strong>" },
    { label: "This is similar ___ the previous version.", correct: "to", options: ["to", "with", "on"], explain: "similar <strong>to</strong>" },
    { label: "We’re in charge ___ the project.", correct: "of", options: ["of", "for", "to"], explain: "in charge <strong>of</strong>" }
  ];

  function renderSelectQuiz(containerSelector, items) {
    const wrap = document.querySelector(containerSelector);
    if (!wrap) return;
    wrap.innerHTML = "";
    items.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "prp-select-row";
      row.dataset.correct = it.correct;

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = `${idx + 1}.`;
      row.appendChild(label);

      const text = document.createElement("div");
      text.className = "text";
      text.innerHTML = it.label.replace("___", `<strong>___</strong>`);
      row.appendChild(text);

      const sel = document.createElement("select");
      sel.innerHTML = `<option value="">—</option>` + it.options.map(o => `<option value="${o}">${o}</option>`).join("");
      row.appendChild(sel);

      const fb = document.createElement("div");
      fb.className = "fb";
      fb.textContent = "";
      row.appendChild(fb);

      wrap.appendChild(row);
    });
  }

  function checkSelectQuiz(containerSelector, ui) {
    const wrap = document.querySelector(containerSelector);
    if (!wrap) return;
    const rows = Array.from(wrap.querySelectorAll(".prp-select-row"));
    let correct = 0;

    rows.forEach((row) => {
      const sel = row.querySelector("select");
      const fb = row.querySelector(".fb");
      const expected = row.dataset.correct;
      const chosen = (sel && sel.value) ? sel.value : "";

      if (!chosen) {
        fb.classList.remove("good", "bad");
        fb.textContent = "Choose an option.";
        return;
      }

      if (chosen === expected) {
        correct++;
        fb.classList.add("good");
        fb.classList.remove("bad");
        fb.textContent = "✅ Correct";
      } else {
        fb.classList.add("bad");
        fb.classList.remove("good");
        fb.textContent = `❌ Try again (correct: ${expected})`;
      }
    });

    ui.correct = correct;
    ui.total = rows.length;
    ui.updatePill();

    const final = $("prp-colloc-final");
    if (final) {
      const pct = ui.total ? Math.round((ui.correct / ui.total) * 100) : 0;
      final.textContent = `Score: ${ui.correct}/${ui.total} (${pct}%).`;
    }
  }

  function resetSelectQuiz(containerSelector, items, ui) {
    renderSelectQuiz(containerSelector, items);
    ui.correct = 0;
    ui.total = items.length;
    ui.updatePill();
    const final = $("prp-colloc-final");
    if (final) final.textContent = "";
  }

  // -------------------------
  // Spot-the-error quiz
  // -------------------------
  const ERRORS = [
    {
      sentence: "I’m arriving to Paris at 8 p.m.",
      tokens: ["to", "at"],
      wrong: "to",
      fix: "✅ Say: I’m arriving <strong>in</strong> Paris at 8 p.m. (arrive <strong>in</strong> a city)."
    },
    {
      sentence: "We discussed about the problem in the meeting.",
      tokens: ["about", "in"],
      wrong: "about",
      fix: "✅ Say: We discussed the problem in the meeting. (discuss = no 'about')."
    },
    {
      sentence: "I’m responsible of the schedule.",
      tokens: ["of", "for"],
      wrong: "of",
      fix: "✅ Say: I’m responsible <strong>for</strong> the schedule."
    },
    {
      sentence: "Can you explain me how it works?",
      tokens: ["me", "how"],
      wrong: "me",
      fix: "✅ Say: Can you explain <strong>to me</strong> how it works?"
    },
    {
      sentence: "I waited during him for 20 minutes.",
      tokens: ["during", "for"],
      wrong: "during",
      fix: "✅ Say: I waited <strong>for</strong> him for 20 minutes."
    },
    {
      sentence: "I’ll see you in Monday.",
      tokens: ["in", "on"],
      wrong: "in",
      fix: "✅ Say: I’ll see you <strong>on</strong> Monday."
    }
  ];

  function renderErrorQuiz(containerId, items, ui) {
    const wrap = $(containerId);
    if (!wrap) return;
    wrap.innerHTML = "";

    items.forEach((it, idx) => {
      const card = document.createElement("div");
      card.className = "prp-error-card";
      card.dataset.answered = "0";
      card.dataset.wrong = it.wrong;

      const s = document.createElement("div");
      s.className = "sentence";
      s.innerHTML = `<strong>${idx + 1}.</strong> ${it.sentence}`;
      card.appendChild(s);

      const tokens = document.createElement("div");
      tokens.className = "prp-tokens";
      it.tokens.forEach((tok) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "prp-token";
        b.textContent = tok;
        b.dataset.tok = tok;

        b.addEventListener("click", () => {
          if (card.dataset.answered === "1") return;
          card.dataset.answered = "1";

          const wrong = card.dataset.wrong;
          const chosen = b.dataset.tok;

          tokens.querySelectorAll("button").forEach((btn) => (btn.disabled = true));

          const fb = card.querySelector(".prp-error-fb");
          if (chosen === wrong) {
            b.classList.add("is-correct");
            fb.classList.add("good");
            fb.classList.remove("bad");
            fb.innerHTML = `✅ Correct. ${it.fix}`;
            ui.correct++;
          } else {
            b.classList.add("is-wrong");
            // mark correct
            const ok = tokens.querySelector(`button[data-tok="${CSS.escape(wrong)}"]`);
            if (ok) ok.classList.add("is-correct");
            fb.classList.add("bad");
            fb.classList.remove("good");
            fb.innerHTML = `❌ Not that one. ${it.fix}`;
          }
          ui.answered++;
          ui.updatePill();
        });

        tokens.appendChild(b);
      });
      card.appendChild(tokens);

      const fb = document.createElement("div");
      fb.className = "prp-error-fb";
      fb.textContent = "Click the wrong preposition/word.";
      card.appendChild(fb);

      wrap.appendChild(card);
    });

    ui.total = items.length;
    ui.updatePill();
  }

  // -------------------------
  // Builders
  // -------------------------
  function getVal(form, name, fallback) {
    const el = form.elements[name];
    const v = el && el.value ? String(el.value).trim() : "";
    return v || fallback;
  }

  function wireBuilder(formId, outId, buildFn, resetBtnId, listenBtnId, stopBtnId) {
    const form = $(formId);
    const out = $(outId);
    const resetBtn = $(resetBtnId);
    const listenBtn = $(listenBtnId);
    const stopBtn = $(stopBtnId);

    if (form && out) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        out.value = buildFn(form);
      });
    }

    if (resetBtn && form && out) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        out.value = "";
        stopSpeak();
      });
    }

    if (listenBtn && out) {
      listenBtn.addEventListener("click", () => {
        const text = (out.value || "").trim();
        if (!text) return;
        speak(text);
      });
    }

    if (stopBtn) stopBtn.addEventListener("click", stopSpeak);
  }

  // Directions builder
  wireBuilder(
    "prp-dir-form",
    "prp-dir-output",
    (form) => {
      const name = getVal(form, "name", "Traveler");
      const start = getVal(form, "start", "the station");
      const dest = getVal(form, "dest", "the meeting room");
      const route = getVal(form, "route", "across the bridge and along the main street");

      return (
        `Local: Hi! You look a bit lost. Can I help?\n` +
        `${name}: Yes, please. I’m at ${start}. How do I get to ${dest}?\n` +
        `Local: No problem. Walk ${route}. Then go into the building and go up to the second floor.\n` +
        `${name}: Great — is it far from here?\n` +
        `Local: Not really. It’s about a 10-minute walk from ${start}.\n` +
        `${name}: Perfect. Thank you!\n` +
        `Local: You’re welcome. Good luck!`
      );
    },
    "prp-dir-reset",
    "prp-dir-listen",
    "prp-dir-stop"
  );

  // Meeting builder
  wireBuilder(
    "prp-meet-form",
    "prp-meet-output",
    (form) => {
      const name = getVal(form, "name", "Colleague");
      const day = getVal(form, "day", "on Monday");
      const time = getVal(form, "time", "at 9:00");
      const place = getVal(form, "place", "at reception");
      const duration = getVal(form, "duration", "for one hour");

      return (
        `Reception: Good morning. How can I help?\n` +
        `${name}: Hi. I’d like to schedule a meeting ${day} ${time}.\n` +
        `Reception: Sure. Where will it be?\n` +
        `${name}: Let’s meet ${place}.\n` +
        `Reception: And how long will it last?\n` +
        `${name}: It should be ${duration}.\n` +
        `Reception: Great. Please arrive 5 minutes early.\n` +
        `${name}: No problem — thank you!`
      );
    },
    "prp-meet-reset",
    "prp-meet-listen",
    "prp-meet-stop"
  );

  // Email builder
  wireBuilder(
    "prp-email-form",
    "prp-email-output",
    (form) => {
      const greeting = getVal(form, "to", "Hello");
      const topic = getVal(form, "topic", "confirming our meeting");
      const deadline = getVal(form, "deadline", "by end of day");
      const attach = getVal(form, "attach", "in the attachment");

      const sal = greeting === "Dear" ? "Dear Team," : `${greeting},`;
      return (
        `${sal}\n\n` +
        `I’m writing to follow up on ${topic}.\n` +
        `Could you please send your feedback ${deadline}?\n` +
        `You can find the relevant details ${attach}.\n\n` +
        `Thank you in advance.\n` +
        `Best regards,`
      );
    },
    "prp-email-reset",
    "prp-email-listen",
    "prp-email-stop"
  );

  // -------------------------
  // Init quizzes
  // -------------------------
  const placeUI = makeQuizUI("place");
  const timeUI = makeQuizUI("time");
  const moveUI = makeQuizUI("move");

  renderMCQ("prp-place-quiz", PLACE, placeUI);
  renderMCQ("prp-time-quiz", TIME, timeUI);
  renderMCQ("prp-move-quiz", MOVE, moveUI);

  // Buttons: show/reset
  const bindShowReset = (prefix, ui, containerId, items) => {
    const showBtn = $(`prp-${prefix}-show`);
    const resetBtn = $(`prp-${prefix}-reset`);
    if (showBtn) showBtn.addEventListener("click", () => ui.showFinal());
    if (resetBtn) resetBtn.addEventListener("click", () => ui.reset(containerId, items));
  };
  bindShowReset("place", placeUI, "prp-place-quiz", PLACE);
  bindShowReset("time", timeUI, "prp-time-quiz", TIME);
  bindShowReset("move", moveUI, "prp-move-quiz", MOVE);

  // -------------------------
  // Collocation select quiz init
  // -------------------------
  const collocUI = makeQuizUI("colloc");
  resetSelectQuiz('[data-select-quiz="colloc"]', COLLOC, collocUI);

  const collocCheckAll = $("prp-colloc-checkall");
  const collocReset = $("prp-colloc-reset");
  if (collocCheckAll) {
    collocCheckAll.addEventListener("click", () => checkSelectQuiz('[data-select-quiz="colloc"]', collocUI));
  }
  if (collocReset) {
    collocReset.addEventListener("click", () => resetSelectQuiz('[data-select-quiz="colloc"]', COLLOC, collocUI));
  }

  // -------------------------
  // Error quiz init
  // -------------------------
  const errorUI = makeQuizUI("error");
  renderErrorQuiz("prp-error-quiz", ERRORS, errorUI);

  const errorShow = $("prp-error-show");
  const errorReset = $("prp-error-reset");
  if (errorShow) errorShow.addEventListener("click", () => errorUI.showFinal());
  if (errorReset) {
    errorReset.addEventListener("click", () => {
      errorUI.correct = 0;
      errorUI.answered = 0;
      renderErrorQuiz("prp-error-quiz", ERRORS, errorUI);
      const final = $("prp-error-final");
      if (final) final.textContent = "";
    });
  }

})();