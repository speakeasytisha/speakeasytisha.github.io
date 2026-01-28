/* SpeakEasyTisha — USA Phone Setup (JS only)
   Touch-friendly (tap-to-build instead of drag/drop), instant feedback, hints, scoring, US/UK TTS.
   Works if your HTML contains these (any missing section is auto-skipped):
   - #accentSelect (select with values "us" | "uk")  OR buttons #accentUS #accentUK
   - #vocabCards
   - #quizWrap
   - #builderWrap
   - #roleplayWrap
   - #checklistWrap
   - #scorePill (optional)
*/
(function () {
  "use strict";

  /* -------------------- Helpers -------------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (s) =>
    String(s ?? "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9\s\-]/g, "");
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const uid = () => Math.random().toString(16).slice(2);

  /* -------------------- Config -------------------- */
  const CONFIG = Object.assign(
    {
      storageKey: "speakeasy_phone_setup_accent",
      defaultAccent: "us", // "us" | "uk"
    },
    window.SPEAKEASY_PHONE_CONFIG || {}
  );

  /* -------------------- Data -------------------- */
  const VOCAB = [
    {
      term: "carrier",
      fr: "opérateur",
      def: "The company that provides your mobile service (calls, texts, data).",
      ex: "I’m switching carriers because the coverage is better where I live.",
    },
    {
      term: "plan",
      fr: "forfait",
      def: "The package you pay for (minutes, texts, data, price).",
      ex: "This plan includes unlimited calls and 20 GB of data.",
    },
    {
      term: "prepaid",
      fr: "prépayé",
      def: "You pay in advance; usually no long contract.",
      ex: "A prepaid plan is easy to start if you’re new in the US.",
    },
    {
      term: "postpaid",
      fr: "avec engagement / facturation mensuelle",
      def: "You get billed after using the service; often requires credit check.",
      ex: "Postpaid plans can be cheaper per GB, but they may require a SSN.",
    },
    {
      term: "SIM card",
      fr: "carte SIM",
      def: "A small card that identifies your phone on a mobile network.",
      ex: "Can you install the SIM card for me?",
    },
    {
      term: "eSIM",
      fr: "eSIM",
      def: "A digital SIM built into your phone; activated by QR code or app.",
      ex: "I activated my eSIM in five minutes using a QR code.",
    },
    {
      term: "unlocked phone",
      fr: "téléphone débloqué",
      def: "A phone that can work with different carriers.",
      ex: "An unlocked phone lets you choose any carrier.",
    },
    {
      term: "coverage",
      fr: "couverture réseau",
      def: "How well a network works in a specific area.",
      ex: "Coverage is weak in the countryside, so I need a better network.",
    },
    {
      term: "signal",
      fr: "signal / réception",
      def: "The strength of the network connection.",
      ex: "I have no signal in the basement.",
    },
    {
      term: "data",
      fr: "données mobiles / data",
      def: "Internet access using the mobile network.",
      ex: "I turned off data to avoid extra charges.",
    },
    {
      term: "data cap",
      fr: "plafond de data",
      def: "The maximum data you can use before slowing down or paying extra.",
      ex: "My plan has a 10 GB data cap.",
    },
    {
      term: "hotspot",
      fr: "partage de connexion",
      def: "Using your phone to provide internet to another device.",
      ex: "Can I use my phone as a hotspot for my laptop?",
    },
    {
      term: "port your number",
      fr: "porter son numéro",
      def: "Move your number from one carrier to another.",
      ex: "I want to port my number, not change it.",
    },
    {
      term: "activation",
      fr: "activation",
      def: "The process of enabling service on your phone/SIM/eSIM.",
      ex: "Activation can take a few minutes.",
    },
    {
      term: "APN settings",
      fr: "paramètres APN",
      def: "Network settings that make mobile data work properly.",
      ex: "If data doesn’t work, check the APN settings.",
    },
    {
      term: "Wi-Fi calling",
      fr: "appels Wi-Fi",
      def: "Making calls through Wi-Fi when the network signal is weak.",
      ex: "Wi-Fi calling helps when I’m indoors with poor signal.",
    },
    {
      term: "voicemail",
      fr: "messagerie vocale",
      def: "A service that records messages when you don’t answer.",
      ex: "I need to set up my voicemail greeting.",
    },
    {
      term: "two-factor authentication (2FA)",
      fr: "double authentification (2FA)",
      def: "A security step that sends a code to your phone.",
      ex: "My bank uses 2FA to send me a code by SMS.",
    },
    {
      term: "roaming",
      fr: "itinérance",
      def: "Using a network outside your carrier’s main area/country.",
      ex: "Turn off roaming to avoid extra fees.",
    },
  ];

  const QUIZ = [
    {
      q: "You want to keep your phone number when changing carriers. What do you ask for?",
      choices: ["A refund", "To port my number", "A hotspot", "An APN reset"],
      a: 1,
      hint: "It means you *transfer* your number to another carrier.",
    },
    {
      q: "You just arrived in the US and want an easy plan without credit checks. What is usually best?",
      choices: ["Postpaid", "Prepaid", "Roaming only", "Wi-Fi calling"],
      a: 1,
      hint: "You pay in advance and it’s often simpler to start.",
    },
    {
      q: "Mobile data doesn’t work, but calls do. Which setting often fixes it?",
      choices: ["APN settings", "Voicemail", "2FA", "Coverage map"],
      a: 0,
      hint: "It’s the configuration for mobile internet on the network.",
    },
    {
      q: "You can’t get signal inside your apartment, but Wi-Fi is strong. What feature helps you call?",
      choices: ["Hotspot", "Wi-Fi calling", "Data cap", "Unlocked phone"],
      a: 1,
      hint: "Calls go through Wi-Fi instead of the mobile network.",
    },
  ];

  const BUILDERS = [
    {
      prompt: "Build the sentence:",
      target: "I would like a prepaid plan with 20 gigabytes of data.",
      bank: ["data.", "plan", "I", "with", "a", "prepaid", "would", "like", "20", "gigabytes", "of"],
      hint: "Start with “I would like…”",
    },
    {
      prompt: "Build the sentence:",
      target: "Can you help me activate my eSIM today?",
      bank: ["today?", "activate", "help", "me", "Can", "you", "my", "eSIM"],
      hint: "A polite question starts with “Can you…”",
    },
    {
      prompt: "Build the sentence:",
      target: "I want to port my number and keep my contacts.",
      bank: ["contacts.", "keep", "my", "number", "and", "port", "to", "I", "want", "my"],
      hint: "Use: want to + verb.",
    },
  ];

  const ROLEPLAY = [
    {
      title: "At a carrier store",
      lines: [
        {
          speaker: "You",
          text: "Hi! I just arrived in the US. I’d like to set up a ______ plan.",
          answers: ["prepaid"],
          hint: "No long contract, pay in advance.",
        },
        {
          speaker: "Agent",
          text: "Sure. Do you have an unlocked phone or do you need a new one?",
          answers: null,
        },
        {
          speaker: "You",
          text: "My phone is unlocked. Can we activate an ______ ?",
          answers: ["esim"],
          hint: "Digital SIM inside the phone.",
        },
        {
          speaker: "You",
          text: "Also, I want to ______ my number from my old carrier.",
          answers: ["port"],
          hint: "Transfer your number.",
        },
      ],
    },
  ];

  const CHECKLIST = [
    {
      step: "Check if your phone is unlocked (or ask your current carrier).",
      note: "Unlocked phones can work with multiple US carriers.",
    },
    {
      step: "Choose a plan: prepaid (easy start) or postpaid (may require credit/SSN).",
      note: "Compare price, data, coverage, hotspot rules.",
    },
    {
      step: "Decide SIM vs eSIM (your phone model must support eSIM).",
      note: "eSIM is often activated via QR code.",
    },
    {
      step: "If keeping your number: request number porting and bring your account info/PIN.",
      note: "Don’t cancel old service before porting.",
    },
    {
      step: "Activate service and test calls, SMS, and mobile data.",
      note: "If data fails, check APN settings.",
    },
    {
      step: "Set up voicemail and Wi-Fi calling (especially if indoor signal is weak).",
      note: "Wi-Fi calling can improve reliability indoors.",
    },
    {
      step: "Update important accounts that use 2FA (banking, email, social apps).",
      note: "Make sure you can receive verification codes.",
    },
  ];

  /* -------------------- Accent + TTS -------------------- */
  const TTS = {
    accent: loadAccent(),
    voices: [],
    ready: false,
  };

  function loadAccent() {
    const saved = localStorage.getItem(CONFIG.storageKey);
    return saved === "uk" || saved === "us" ? saved : CONFIG.defaultAccent;
  }
  function saveAccent(a) {
    TTS.accent = a;
    localStorage.setItem(CONFIG.storageKey, a);
    reflectAccentUI();
  }

  function reflectAccentUI() {
    const sel = $("#accentSelect");
    if (sel) sel.value = TTS.accent;

    const bUS = $("#accentUS");
    const bUK = $("#accentUK");
    if (bUS) bUS.setAttribute("aria-pressed", TTS.accent === "us" ? "true" : "false");
    if (bUK) bUK.setAttribute("aria-pressed", TTS.accent === "uk" ? "true" : "false");
  }

  function initVoices() {
    const list = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    TTS.voices = list || [];
    TTS.ready = true;
  }

  function pickVoice() {
    if (!TTS.voices || !TTS.voices.length) return null;
    const want = TTS.accent === "uk" ? ["en-GB", "en_GB"] : ["en-US", "en_US"];
    const exact = TTS.voices.find((v) => want.some((p) => String(v.lang || "").includes(p)));
    if (exact) return exact;
    // fallback: any English voice
    const anyEn = TTS.voices.find((v) => String(v.lang || "").toLowerCase().startsWith("en"));
    return anyEn || TTS.voices[0] || null;
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text || ""));
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {
      // ignore
    }
  }

  function wireAccentUI() {
    const sel = $("#accentSelect");
    if (sel) {
      sel.addEventListener("change", () => saveAccent(sel.value === "uk" ? "uk" : "us"));
    }
    const bUS = $("#accentUS");
    const bUK = $("#accentUK");
    if (bUS) bUS.addEventListener("click", () => saveAccent("us"));
    if (bUK) bUK.addEventListener("click", () => saveAccent("uk"));
    reflectAccentUI();
  }

  /* -------------------- Global score -------------------- */
  const SCORE = {
    points: 0,
    attempts: 0,
    correct: 0,
  };

  function addPoints(n) {
    SCORE.points += n;
    renderScore();
  }
  function renderScore() {
    const pill = $("#scorePill");
    if (!pill) return;
    pill.textContent = `⭐ ${SCORE.points} pts`;
  }

  /* -------------------- Vocab cards -------------------- */
  function renderVocab() {
    const host = $("#vocabCards");
    if (!host) return;

    const cards = VOCAB.map((item) => {
      const id = "card_" + uid();
      return `
        <article class="card" data-flip="0">
          <div class="card__inner" role="button" tabindex="0" aria-label="Flip card: ${esc(item.term)}" aria-pressed="false" id="${id}">
            <div class="card__face card__front">
              <div class="card__term">${esc(item.term)}</div>
              <div class="card__mini">Tap to flip • 🔊</div>
            </div>
            <div class="card__face card__back">
              <div class="card__row"><strong>FR:</strong> ${esc(item.fr)}</div>
              <div class="card__row"><strong>EN:</strong> ${esc(item.def)}</div>
              <div class="card__row"><em>Example:</em> ${esc(item.ex)}</div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    host.innerHTML = `
      <div class="section__head">
        <h2>📱 Vocabulary — Phone Setup</h2>
        <div class="section__tools">
          <button type="button" class="btn" id="vocabShuffle">🔀 Shuffle</button>
          <button type="button" class="btn" id="vocabSpeakAll">🔊 Speak 5 random</button>
        </div>
      </div>
      <div class="cardsGrid" id="cardsGrid">${cards}</div>
    `;

    function bindFlip(el) {
      const flip = () => {
        const now = el.getAttribute("data-flip") === "1" ? "0" : "1";
        el.setAttribute("data-flip", now);
        const inner = el.querySelector(".card__inner");
        if (inner) inner.setAttribute("aria-pressed", now === "1" ? "true" : "false");

        // Speak the term on flip
        const term = inner?.querySelector(".card__term")?.textContent || "";
        if (term) speak(term);
      };

      el.addEventListener("click", (e) => {
        const t = e.target;
        // allow clicking anywhere
        if (t) flip();
      });

      const inner = el.querySelector(".card__inner");
      if (inner) {
        inner.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            flip();
          }
        });
      }
    }

    $$("#cardsGrid .card").forEach(bindFlip);

    const bShuffle = $("#vocabShuffle");
    if (bShuffle) {
      bShuffle.addEventListener("click", () => {
        const grid = $("#cardsGrid");
        if (!grid) return;
        const nodes = $$("#cardsGrid .card");
        const shuffled = shuffle(nodes);
        grid.innerHTML = "";
        shuffled.forEach((n) => grid.appendChild(n));
        addPoints(2);
      });
    }

    const bSpeakAll = $("#vocabSpeakAll");
    if (bSpeakAll) {
      bSpeakAll.addEventListener("click", () => {
        const pick = shuffle(VOCAB).slice(0, 5);
        let i = 0;
        const sayNext = () => {
          if (i >= pick.length) return;
          speak(pick[i].term);
          i++;
          setTimeout(sayNext, 900);
        };
        sayNext();
        addPoints(1);
      });
    }
  }

  /* -------------------- Quiz -------------------- */
  function renderQuiz() {
    const host = $("#quizWrap");
    if (!host) return;

    const state = {
      idx: 0,
      localPoints: 0,
      answered: false,
    };

    host.innerHTML = `
      <div class="section__head">
        <h2>✅ Quick Quiz</h2>
        <div class="section__tools">
          <span class="pill" id="quizProgress"></span>
          <button type="button" class="btn" id="quizRestart">↻ Restart</button>
        </div>
      </div>
      <div class="quizCard" id="quizCard"></div>
    `;

    const progress = $("#quizProgress");
    const card = $("#quizCard");
    const restart = $("#quizRestart");

    function draw() {
      const q = QUIZ[state.idx];
      if (!q) return;
      if (progress) progress.textContent = `Question ${state.idx + 1} / ${QUIZ.length}`;

      const choices = q.choices
        .map(
          (c, i) => `
          <button type="button" class="choice" data-i="${i}">
            <span class="choice__dot"></span>
            <span class="choice__text">${esc(c)}</span>
            <span class="choice__speak" aria-hidden="true">🔊</span>
          </button>`
        )
        .join("");

      card.innerHTML = `
        <div class="quizQ">
          <div class="quizQ__title">${esc(q.q)}</div>
          <div class="quizQ__tools">
            <button type="button" class="btn btn--ghost" id="quizSpeakQ">🔊 Speak</button>
            <button type="button" class="btn btn--ghost" id="quizHint">💡 Hint</button>
          </div>
        </div>
        <div class="choices" id="choices">${choices}</div>
        <div class="feedback" id="quizFeedback" aria-live="polite"></div>
        <div class="quizNav">
          <button type="button" class="btn" id="quizNext" disabled>Next ➜</button>
        </div>
      `;

      const speakQ = $("#quizSpeakQ");
      if (speakQ) speakQ.onclick = () => speak(q.q);

      const hintB = $("#quizHint");
      if (hintB) {
        hintB.onclick = () => {
          const fb = $("#quizFeedback");
          if (fb) {
            fb.innerHTML = `<div class="hint">${esc(q.hint || "Think about the meaning.")}</div>`;
          }
          addPoints(1);
        };
      }

      const nextB = $("#quizNext");
      const fb = $("#quizFeedback");
      const choicesHost = $("#choices");

      const handleChoice = (i) => {
        if (state.answered) return;
        state.answered = true;
        SCORE.attempts++;

        const correct = i === q.a;
        if (correct) {
          SCORE.correct++;
          state.localPoints += 5;
          addPoints(5);
          if (fb) fb.innerHTML = `<div class="ok">✅ Correct!</div>`;
        } else {
          if (fb) fb.innerHTML = `<div class="nope">❌ Not quite. Correct answer: <strong>${esc(q.choices[q.a])}</strong></div>`;
        }

        // mark choices
        if (choicesHost) {
          $$("#choices .choice").forEach((b) => {
            const bi = Number(b.getAttribute("data-i"));
            b.disabled = true;
            b.classList.toggle("is-correct", bi === q.a);
            b.classList.toggle("is-wrong", bi === i && i !== q.a);
          });
        }

        if (nextB) nextB.disabled = false;
      };

      if (choicesHost) {
        choicesHost.addEventListener("click", (e) => {
          const btn = e.target.closest(".choice");
          if (!btn) return;
          const i = Number(btn.getAttribute("data-i"));
          handleChoice(i);
        });

        // speak choice when clicking speaker icon
        choicesHost.addEventListener("click", (e) => {
          const sp = e.target.closest(".choice__speak");
          if (!sp) return;
          const btn = e.target.closest(".choice");
          if (!btn) return;
          const i = Number(btn.getAttribute("data-i"));
          speak(q.choices[i]);
        });
      }

      if (nextB) {
        nextB.onclick = () => {
          state.idx++;
          state.answered = false;
          if (state.idx >= QUIZ.length) {
            card.innerHTML = `
              <div class="quizDone">
                <div class="quizDone__title">🎉 Quiz complete!</div>
                <div class="quizDone__body">You earned <strong>${state.localPoints}</strong> points in this quiz.</div>
                <button type="button" class="btn" id="quizAgain">Try again</button>
              </div>
            `;
            const again = $("#quizAgain");
            if (again) again.onclick = () => {
              state.idx = 0;
              state.answered = false;
              state.localPoints = 0;
              draw();
            };
            return;
          }
          draw();
        };
      }
    }

    if (restart) {
      restart.onclick = () => {
        state.idx = 0;
        state.answered = false;
        state.localPoints = 0;
        draw();
      };
    }

    draw();
  }

  /* -------------------- Sentence Builder (tap-to-build) -------------------- */
  function renderBuilder() {
    const host = $("#builderWrap");
    if (!host) return;

    const state = {
      idx: 0,
      built: [],
    };

    host.innerHTML = `
      <div class="section__head">
        <h2>🧩 Sentence Builder</h2>
        <div class="section__tools">
          <span class="pill" id="buildProgress"></span>
          <button type="button" class="btn" id="buildReset">↻ Reset</button>
        </div>
      </div>
      <div class="builderCard" id="builderCard"></div>
    `;

    const progress = $("#buildProgress");
    const card = $("#builderCard");
    const reset = $("#buildReset");

    function draw() {
      const item = BUILDERS[state.idx];
      if (!item) return;

      state.built = [];
      if (progress) progress.textContent = `Sentence ${state.idx + 1} / ${BUILDERS.length}`;

      const bank = shuffle(item.bank)
        .map((w) => `<button type="button" class="chip" data-w="${esc(w)}">${esc(w)}</button>`)
        .join("");

      card.innerHTML = `
        <div class="builderPrompt">
          <div class="builderPrompt__title">${esc(item.prompt)}</div>
          <div class="builderPrompt__target" aria-hidden="true">(${esc(item.target)})</div>
          <div class="builderPrompt__tools">
            <button type="button" class="btn btn--ghost" id="buildSpeak">🔊 Speak target</button>
            <button type="button" class="btn btn--ghost" id="buildHint">💡 Hint</button>
          </div>
        </div>

        <div class="builderArea">
          <div class="builderBank" id="builderBank">${bank}</div>
          <div class="builderLine" id="builderLine" aria-live="polite"></div>
        </div>

        <div class="builderActions">
          <button type="button" class="btn" id="buildUndo">↩ Undo</button>
          <button type="button" class="btn" id="buildCheck">Check ✅</button>
          <button type="button" class="btn" id="buildNext" disabled>Next ➜</button>
        </div>
        <div class="feedback" id="buildFeedback" aria-live="polite"></div>
      `;

      const bankEl = $("#builderBank");
      const lineEl = $("#builderLine");
      const fb = $("#buildFeedback");
      const next = $("#buildNext");

      function renderLine() {
        const text = state.built.join(" ");
        if (lineEl) {
          lineEl.innerHTML = text
            ? `<div class="built">${esc(text)}</div><div class="mini">Tap a word below to add it. Use Undo to remove.</div>`
            : `<div class="built built--empty">Tap words to build your sentence…</div>`;
        }
      }

      renderLine();

      if (bankEl) {
        bankEl.addEventListener("click", (e) => {
          const chip = e.target.closest(".chip");
          if (!chip) return;
          const w = chip.getAttribute("data-w");
          if (!w) return;
          state.built.push(w);
          chip.disabled = true;
          chip.classList.add("is-used");
          renderLine();
        });
      }

      const undo = $("#buildUndo");
      if (undo) {
        undo.onclick = () => {
          if (!state.built.length) return;
          const w = state.built.pop();
          // re-enable one matching chip
          const chip = $(`#builderBank .chip[data-w="${CSS.escape(w)}"]`);
          if (chip) {
            chip.disabled = false;
            chip.classList.remove("is-used");
          }
          renderLine();
        };
      }

      const speakB = $("#buildSpeak");
      if (speakB) speakB.onclick = () => speak(item.target);

      const hintB = $("#buildHint");
      if (hintB) {
        hintB.onclick = () => {
          if (fb) fb.innerHTML = `<div class="hint">${esc(item.hint || "Try again.")}</div>`;
          addPoints(1);
        };
      }

      const check = $("#buildCheck");
      if (check) {
        check.onclick = () => {
          SCORE.attempts++;
          const built = state.built.join(" ").replace(/\s+/g, " ").trim();
          const ok = norm(built) === norm(item.target);
          if (ok) {
            SCORE.correct++;
            addPoints(8);
            if (fb) fb.innerHTML = `<div class="ok">✅ Perfect!</div>`;
            if (next) next.disabled = false;
          } else {
            if (fb)
              fb.innerHTML = `<div class="nope">❌ Not quite.<br/><strong>Your sentence:</strong> ${esc(
                built || "(empty)"
              )}<br/><strong>Target:</strong> ${esc(item.target)}</div>`;
          }
        };
      }

      if (next) {
        next.onclick = () => {
          state.idx++;
          if (state.idx >= BUILDERS.length) {
            card.innerHTML = `
              <div class="done">
                <div class="done__title">🏁 Builder complete!</div>
                <div class="done__body">You finished all sentences.</div>
                <button type="button" class="btn" id="buildAgain">Try again</button>
              </div>
            `;
            const again = $("#buildAgain");
            if (again)
              again.onclick = () => {
                state.idx = 0;
                draw();
              };
            return;
          }
          draw();
        };
      }
    }

    if (reset) {
      reset.onclick = () => draw();
    }

    draw();
  }

  /* -------------------- Roleplay (fill blanks) -------------------- */
  function renderRoleplay() {
    const host = $("#roleplayWrap");
    if (!host) return;

    const scene = ROLEPLAY[0];
    if (!scene) return;

    host.innerHTML = `
      <div class="section__head">
        <h2>🗣️ Roleplay — ${esc(scene.title)}</h2>
        <div class="section__tools">
          <button type="button" class="btn" id="rpCheck">Check ✅</button>
          <button type="button" class="btn" id="rpReset">↻ Reset</button>
        </div>
      </div>
      <div class="roleplayCard" id="rpCard"></div>
      <div class="feedback" id="rpFeedback" aria-live="polite"></div>
    `;

    const card = $("#rpCard");
    const fb = $("#rpFeedback");

    function draw() {
      const rows = scene.lines
        .map((l, i) => {
          if (!l.answers) {
            return `
              <div class="rpLine">
                <div class="rpSpeaker">${esc(l.speaker)}:</div>
                <div class="rpText">${esc(l.text)}</div>
                <button type="button" class="btn btn--ghost rpSpeak" data-say="${esc(l.text)}">🔊</button>
              </div>
            `;
          }

          // create an input for each blank (we assume one blank per line here)
          const inputId = `rp_in_${i}`;
          return `
            <div class="rpLine">
              <div class="rpSpeaker">${esc(l.speaker)}:</div>
              <div class="rpText">
                ${esc(l.text).replace("______", `<input id="${inputId}" class="rpInput" type="text" inputmode="text" autocomplete="off" placeholder="type here" />`)}
              </div>
              <button type="button" class="btn btn--ghost rpHint" data-hint="${esc(l.hint || "")}">💡</button>
              <button type="button" class="btn btn--ghost rpSpeak" data-say="${esc(l.text.replace("______", l.answers[0] || ""))}">🔊</button>
            </div>
          `;
        })
        .join("");

      card.innerHTML = rows;

      // bind speak/hint
      card.addEventListener("click", (e) => {
        const speakBtn = e.target.closest(".rpSpeak");
        if (speakBtn) {
          speak(speakBtn.getAttribute("data-say") || "");
          return;
        }
        const hintBtn = e.target.closest(".rpHint");
        if (hintBtn) {
          const h = hintBtn.getAttribute("data-hint") || "Try a key word from vocabulary.";
          if (fb) fb.innerHTML = `<div class="hint">${esc(h)}</div>`;
          addPoints(1);
        }
      });
    }

    function check() {
      let okAll = true;
      let missing = false;

      scene.lines.forEach((l, i) => {
        if (!l.answers) return;
        const input = $(`#rp_in_${i}`);
        const val = input ? norm(input.value) : "";
        if (!val) missing = true;

        const ok = l.answers.some((a) => norm(a) === val);
        if (!ok) okAll = false;

        if (input) {
          input.classList.toggle("is-ok", ok);
          input.classList.toggle("is-nope", !ok && val.length > 0);
        }
      });

      SCORE.attempts++;

      if (missing) {
        if (fb) fb.innerHTML = `<div class="nope">✍️ Fill in all blanks first.</div>`;
        return;
      }

      if (okAll) {
        SCORE.correct++;
        addPoints(10);
        if (fb) fb.innerHTML = `<div class="ok">✅ Great! Your roleplay answers are correct.</div>`;
      } else {
        if (fb) fb.innerHTML = `<div class="nope">❌ Some answers are incorrect. Use hints and try again.</div>`;
      }
    }

    const bCheck = $("#rpCheck");
    const bReset = $("#rpReset");
    if (bCheck) bCheck.onclick = check;
    if (bReset) bReset.onclick = () => {
      draw();
      if (fb) fb.innerHTML = "";
    };

    draw();
  }

  /* -------------------- Checklist -------------------- */
  function renderChecklist() {
    const host = $("#checklistWrap");
    if (!host) return;

    const key = "speakeasy_phone_setup_checklist";
    let state = {};
    try {
      state = JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch {
      state = {};
    }

    host.innerHTML = `
      <div class="section__head">
        <h2>🧾 Step-by-step Checklist</h2>
        <div class="section__tools">
          <button type="button" class="btn" id="clReset">↻ Reset</button>
        </div>
      </div>
      <div class="checklist" id="checklist"></div>
    `;

    const list = $("#checklist");
    if (!list) return;

    function save() {
      localStorage.setItem(key, JSON.stringify(state));
    }

    function draw() {
      const html = CHECKLIST.map((it, idx) => {
        const done = !!state[idx];
        return `
          <label class="clItem">
            <input type="checkbox" data-idx="${idx}" ${done ? "checked" : ""} />
            <div class="clBody">
              <div class="clStep">${esc(it.step)}</div>
              <div class="clNote">${esc(it.note)}</div>
            </div>
          </label>
        `;
      }).join("");

      list.innerHTML = html;
    }

    list.addEventListener("change", (e) => {
      const cb = e.target.closest('input[type="checkbox"]');
      if (!cb) return;
      const idx = Number(cb.getAttribute("data-idx"));
      state[idx] = cb.checked;
      save();
      addPoints(cb.checked ? 1 : 0);
    });

    const reset = $("#clReset");
    if (reset) {
      reset.onclick = () => {
        state = {};
        save();
        draw();
      };
    }

    draw();
  }

  
  /* -------------------- Troubleshooting (decision helper) -------------------- */
  function renderTroubleshooting() {
    const sec = $("#troubleshooting");
    const out = $("#issueOut");
    if (!sec || !out) return;

    const buttons = $$('button[data-issue]');
    if (!buttons.length) return;

    const ISSUES = {
      no_signal: {
        title: "📡 No signal / No service",
        steps: [
          "Toggle Airplane mode ON for 10 seconds, then OFF.",
          "Move near a window / go outside to test indoor coverage.",
          "Restart your phone.",
          "Check that your SIM/eSIM line is enabled and selected for Cellular/Mobile Data.",
          "Make sure the phone is not in 'Do Not Disturb' or 'Focus' (calls may still fail).",
          "Check your carrier’s coverage map and try another location if possible.",
          "Reset network settings (last resort).",
          "Contact the carrier to check outages or whether your line/account is blocked."
        ],
        say: [
          "I have no signal / no service on my phone.",
          "Is there an outage in my area?",
          "Can you check that my line is active?",
          "Can you resend the carrier settings to my device?"
        ],
        fr: "Aucune barre réseau : active/désactive le mode avion, redémarre, vérifie la ligne SIM/eSIM, puis contacte l’opérateur (panne ou ligne bloquée)."
      },
      no_data: {
        title: "🌐 No mobile data",
        steps: [
          "Turn Mobile Data ON (and turn Wi‑Fi OFF to test).",
          "Check that your plan includes data and you haven’t reached the data cap.",
          "Make sure the correct SIM/eSIM line is selected for Mobile Data.",
          "Restart your phone.",
          "Toggle Airplane mode ON/OFF.",
          "Check APN settings (Android more often).",
          "Reset network settings (last resort).",
          "Ask the carrier to verify provisioning (data enabled on your line)."
        ],
        say: [
          "Calls work, but my mobile data doesn’t work.",
          "Can you help me check the APN settings?",
          "Is data enabled on my line?",
          "Have I reached my data limit?"
        ],
        fr: "Pas d’internet mobile : vérifie 'Données cellulaires', la ligne active, le forfait/data cap, APN, puis opérateur."
      },
      sms: {
        title: "💬 SMS not working",
        steps: [
          "Check you have signal and your plan includes SMS.",
          "Restart Messages app, then restart your phone.",
          "Confirm the phone number format includes +1 for US numbers.",
          "On iPhone: check 'Send as SMS' and iMessage activation (if using iMessage).",
          "Check you’re not blocking the contact/short codes.",
          "Toggle Airplane mode ON/OFF.",
          "Ask the carrier to confirm SMS is enabled and short codes aren’t blocked."
        ],
        say: [
          "I can’t send or receive text messages.",
          "Can you check if SMS is enabled on my line?",
          "Are short code messages allowed on my plan?",
          "Can you help me update my message settings?"
        ],
        fr: "SMS HS : vérifie la couverture, le format +1, redémarre, vérifie iMessage / 'Envoyer en SMS', puis opérateur."
      },
      esim: {
        title: "🧾 eSIM trouble",
        steps: [
          "Confirm your phone supports eSIM and is carrier-unlocked.",
          "Use a strong Wi‑Fi connection during activation.",
          "Check the QR code is still valid (some expire after a while).",
          "If activation is stuck: restart the phone and try again.",
          "Only delete the eSIM if you’re sure you can re-add it (QR code/app access).",
          "Update your phone OS (iOS/Android).",
          "Ask the carrier to issue a new eSIM/QR code."
        ],
        say: [
          "My eSIM activation is failing / stuck.",
          "Can you generate a new eSIM QR code for me?",
          "Is my phone compatible and unlocked?",
          "Can you confirm the eSIM profile is assigned to my line?"
        ],
        fr: "Problème eSIM : Wi‑Fi stable, QR code valide, redémarrage; ne supprime l’eSIM que si tu peux la réinstaller."
      },
      billing: {
        title: "💳 Billing / payment problem",
        steps: [
          "Check your payment method (card/PayPal) and billing ZIP/address.",
          "Confirm AutoPay is on (if you want it) and the next payment date.",
          "Look for past-due balance or failed payment notifications.",
          "Try paying manually once and then re-enable AutoPay.",
          "Ask the carrier if there’s a temporary hold or fraud block."
        ],
        say: [
          "My payment didn’t go through.",
          "Can you check if my account is past due?",
          "Can you help me update my billing address / ZIP code?",
          "Is there a block on my account?"
        ],
        fr: "Paiement : vérifie la carte + adresse/ZIP, solde en retard, autopay, puis demande s’il y a un blocage."
      }
    };

    function setActive(key) {
      buttons.forEach((b) => {
        const k = b.getAttribute("data-issue");
        const on = k === key;
        b.classList.toggle("btn--primary", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    function render(key) {
      const d = ISSUES[key];
      if (!d) {
        out.textContent = "Choose a problem above.";
        return;
      }
      setActive(key);

      const steps = (d.steps || []).map((s) => `<li>${esc(s)}</li>`).join("");
      const say = (d.say || [])
        .map(
          (p) =>
            `<li class="sayLine"><span>${esc(p)}</span> <button type="button" class="iconbtn" data-speak="${esc(
              p
            )}" aria-label="Speak">🔊</button></li>`
        )
        .join("");

      out.innerHTML = `
        <div class="issueTitle">${esc(d.title)}</div>
        <div class="issueCols">
          <div class="issueCol">
            <h4>Common next steps</h4>
            <ol class="bullets">${steps}</ol>
          </div>
          <div class="issueCol">
            <h4>Useful phrases</h4>
            <ul class="bullets">${say}</ul>
          </div>
        </div>
        <div class="frhelp"><strong>Aide FR:</strong> ${esc(d.fr)}</div>
      `;
    }

    // Event delegation: ensures ALL buttons work (not just the first one)
    sec.addEventListener("click", (e) => {
      const b = e.target.closest('button[data-issue]');
      if (!b) return;
      const key = b.getAttribute("data-issue");
      render(key);
    });

    // Accessibility baseline
    buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
  }

/* -------------------- Init -------------------- */
  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(() => {
    // TTS voices may load async
    if (window.speechSynthesis) {
      initVoices();
      window.speechSynthesis.onvoiceschanged = () => initVoices();
    }

    wireAccentUI();
    renderScore();
    renderVocab();
    renderQuiz();
    renderBuilder();
    renderRoleplay();
    renderChecklist();
    renderTroubleshooting();

    // Optional: any element with [data-speak] will speak its text on click
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-speak]");
      if (!btn) return;
      const t = btn.getAttribute("data-speak") || btn.textContent || "";
      speak(t);
    });
  });
})();
