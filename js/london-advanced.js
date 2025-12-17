/* =========================================================
   London (Advanced) – interactive logic
   File: js/london-advanced.js
   ========================================================= */

(function () {
  "use strict";

  // ----------------------------
  // Helpers
  // ----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function safeText(x) {
    return String(x ?? "");
  }

  function titleCase(s) {
    return safeText(s).trim().replace(/\s+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // ----------------------------
  // Hero image from body data (optional)
  // ----------------------------
  function applyHeroImageFromBody() {
    const body = document.body;
    const img = body?.dataset?.heroImage;
    if (!img) return;

    // Accept either "url(...)" or a plain path
    const val = img.trim().startsWith("url(") ? img.trim() : `url("${img.trim()}")`;
    document.documentElement.style.setProperty("--la-hero-image", val);
  }

  // ----------------------------
  // Score system
  // ----------------------------
  const state = {
    sections: {}, // sectionKey -> { total, correct }
    overall: { total: 0, correct: 0 },
  };

  function recalcOverall() {
    let total = 0;
    let correct = 0;

    for (const key of Object.keys(state.sections)) {
      total += state.sections[key].total || 0;
      correct += state.sections[key].correct || 0;
    }

    state.overall.total = total;
    state.overall.correct = correct;

    const overallCorrectEl = $("#la-overall-correct");
    const overallTotalEl = $("#la-overall-total");
    if (overallCorrectEl) overallCorrectEl.textContent = String(correct);
    if (overallTotalEl) overallTotalEl.textContent = String(total);
  }

  function renderSectionScore(sectionKey) {
    const scoreEl = document.querySelector(`[data-score="${sectionKey}"]`);
    const totalEl = document.querySelector(`[data-total="${sectionKey}"]`);
    const sec = state.sections[sectionKey];
    if (!sec) return;

    if (scoreEl) scoreEl.textContent = String(sec.correct);
    if (totalEl) totalEl.textContent = String(sec.total);
    recalcOverall();
  }

  function resetSection(sectionKey) {
    const quiz = document.querySelector(`[data-la-quiz="${sectionKey}"]`);
    if (!quiz) return;

    // reset question UI
    $$(".la-q", quiz).forEach((q) => {
      q.dataset.answered = "0";
      const fb = $(".la-feedback", q);
      if (fb) {
        fb.textContent = "";
        fb.classList.remove("la-ok", "la-bad");
      }

      // remove clue injected text
      const clueLine = $(".la-clue-line", q);
      if (clueLine) clueLine.remove();

      // reset buttons
      $$(".la-options button", q).forEach((b) => {
        b.disabled = false;
        b.classList.remove("la-correct", "la-wrong");
      });

      // reset clue button label (optional)
      const clueBtn = $(".la-clue", q);
      if (clueBtn) clueBtn.textContent = "💡 Clue";
    });

    // reset score data
    if (state.sections[sectionKey]) {
      state.sections[sectionKey].correct = 0;
    }
    renderSectionScore(sectionKey);

    if (sectionKey === "final") {
      const msg = $("#la-final-msg");
      if (msg) msg.textContent = "";
    }
  }

  function resetAll() {
    Object.keys(state.sections).forEach(resetSection);

    // also reset builders/persona
    const personaResult = $("#la-persona-result");
    if (personaResult) personaResult.innerHTML = "";
    const personaForm = $("#la-persona-form");
    if (personaForm) personaForm.reset();

    const itOut = $("#la-itinerary-output");
    if (itOut) itOut.value = "";
    const itForm = $("#la-itinerary-form");
    if (itForm) itForm.reset();

    const dOut = $("#la-dialogue-output");
    if (dOut) dOut.value = "";
    const dForm = $("#la-dialogue-form");
    if (dForm) dForm.reset();

    stopTTS();
  }

  // ----------------------------
  // Quizzes: MCQ + clues + explanations
  // ----------------------------
  function initQuizzes() {
    const quizzes = $$("[data-la-quiz]");
    quizzes.forEach((quiz) => {
      const key = quiz.getAttribute("data-la-quiz");
      const questions = $$(".la-q", quiz);

      // initialize section state
      state.sections[key] = state.sections[key] || { total: 0, correct: 0 };
      state.sections[key].total = questions.length;
      state.sections[key].correct = 0;

      // set totals in UI
      renderSectionScore(key);

      questions.forEach((q) => {
        q.dataset.answered = "0";

        // MCQ buttons
        const buttons = $$(".la-options button[data-opt]", q);
        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            if (q.dataset.answered === "1") return;

            const chosen = btn.getAttribute("data-opt");
            const correct = q.getAttribute("data-correct");

            q.dataset.answered = "1";

            // disable all
            buttons.forEach((b) => (b.disabled = true));

            // mark correct/wrong
            if (chosen === correct) {
              btn.classList.add("la-correct");
              state.sections[key].correct += 1;

              const fb = $(".la-feedback", q);
              if (fb) {
                fb.classList.add("la-ok");
                fb.classList.remove("la-bad");
                fb.innerHTML = `<strong>Correct.</strong> ${safeText(q.dataset.explain || "")}`;
              }
            } else {
              btn.classList.add("la-wrong");

              const correctBtn = buttons.find((b) => b.getAttribute("data-opt") === correct);
              if (correctBtn) correctBtn.classList.add("la-correct");

              const fb = $(".la-feedback", q);
              if (fb) {
                fb.classList.add("la-bad");
                fb.classList.remove("la-ok");
                fb.innerHTML = `<strong>Not quite.</strong> ${safeText(q.dataset.explain || "")}`;
              }
            }

            renderSectionScore(key);
            maybeFinalMessage();
          });
        });

        // Clue toggle
        const clueBtn = $(".la-clue", q);
        if (clueBtn) {
          clueBtn.addEventListener("click", () => {
            const hint = safeText(q.dataset.hint || "").trim();
            if (!hint) return;

            const existing = $(".la-clue-line", q);
            if (existing) {
              existing.remove();
              clueBtn.textContent = "💡 Clue";
              return;
            }

            const line = document.createElement("div");
            line.className = "la-clue-line";
            line.style.marginTop = "0.55rem";
            line.style.fontSize = "0.92rem";
            line.style.color = "#0b1120";
            line.style.padding = "0.55rem 0.7rem";
            line.style.borderRadius = "14px";
            line.style.border = "1px solid rgba(182,168,90,0.35)";
            line.style.background = "rgba(182,168,90,0.14)";
            line.textContent = `💡 ${hint}`;

            q.appendChild(line);
            clueBtn.textContent = "💡 Hide clue";
          });
        }
      });
    });

    recalcOverall();

    // Reset buttons
    $$("[data-reset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-reset");
        if (!key) return;
        resetSection(key);
      });
    });

    const resetAllBtn = $("#la-reset-all");
    if (resetAllBtn) resetAllBtn.addEventListener("click", resetAll);
  }

  function maybeFinalMessage() {
    const quiz = document.querySelector('[data-la-quiz="final"]');
    if (!quiz) return;

    const key = "final";
    const sec = state.sections[key];
    if (!sec) return;

    // only show message if all answered in final
    const answered = $$(".la-q", quiz).filter((q) => q.dataset.answered === "1").length;
    if (answered < sec.total) return;

    const msg = $("#la-final-msg");
    if (!msg) return;

    const pct = sec.total ? Math.round((sec.correct / sec.total) * 100) : 0;

    let label = "Strong.";
    if (pct >= 90) label = "Excellent — very natural.";
    else if (pct >= 75) label = "Very strong — minor tweaks.";
    else if (pct >= 60) label = "Good — focus on collocations and tone.";
    else label = "Review needed — go back to clues + explanations.";

    msg.textContent = `🏁 Final score: ${sec.correct}/${sec.total} (${pct}%). ${label}`;
  }

  // ----------------------------
  // Persona builder
  // ----------------------------
  function initPersona() {
    const form = $("#la-persona-form");
    const out = $("#la-persona-result");
    const resetBtn = $("#la-persona-reset");
    if (!form || !out) return;

    function personaFrom(values) {
      // Simple weighted logic
      const score = {
        Curator: 0,  // museums, quiet, curated
        Explorer: 0, // walking, scenic
        Foodie: 0,   // markets, global
        Planner: 0,  // efficient, planned
      };

      const vibe = values.vibe;
      const transport = values.transport;
      const food = values.food;
      const time = values.time;
      const must = values.must;
      const stress = values.stress;

      if (vibe === "curated") score.Curator += 2;
      if (vibe === "buzzing") score.Foodie += 2;
      if (vibe === "scenic") score.Explorer += 2;
      if (vibe === "efficient") score.Planner += 2;

      if (transport === "walk") score.Explorer += 2;
      if (transport === "tube") score.Planner += 1;
      if (transport === "bus") score.Explorer += 1;
      if (transport === "cab") score.Planner += 1;

      if (food === "hidden-gems") score.Explorer += 1;
      if (food === "trendy") score.Foodie += 2;
      if (food === "classic") score.Curator += 1;
      if (food === "global") score.Foodie += 2;

      if (time === "planned") score.Planner += 2;
      if (time === "semi") score.Curator += 1;
      if (time === "spontaneous") score.Explorer += 1;
      if (time === "last-minute") score.Foodie += 1;

      if (must === "west-end") score.Foodie += 1;
      if (must === "gallery") score.Curator += 2;
      if (must === "markets") score.Foodie += 2;
      if (must === "river") score.Explorer += 2;

      if (stress === "negotiate") score.Curator += 1;
      if (stress === "improvise") score.Explorer += 1;
      if (stress === "research") score.Planner += 1;
      if (stress === "laugh") score.Foodie += 1;

      // choose best
      let best = "Explorer";
      let bestVal = -Infinity;
      for (const k of Object.keys(score)) {
        if (score[k] > bestVal) {
          bestVal = score[k];
          best = k;
        }
      }
      return best;
    }

    const personaData = {
      Curator: {
        title: "The Curator 🖼️",
        desc: "You like depth, context, and quality over quantity. Your London English should sound precise, calm, and refined.",
        phrases: [
          "I’m keen to see something a bit more understated.",
          "I’d rather go for depth than try to squeeze everything in.",
          "Could we start with the permanent collection and see how we feel?",
          "It’s worth it if we take our time and do it properly.",
        ],
        vocab: ["understated", "timed entry", "curated", "hidden gem", "atmospheric", "exhibition"],
      },
      Explorer: {
        title: "The Explorer 🚶‍♀️",
        desc: "You notice details, you like walking and “finding” the city. Your strength is spontaneity and natural storytelling.",
        phrases: [
          "Let’s head over there and see what we stumble across.",
          "It’s a bit of a trek, but the walk is gorgeous.",
          "We can cut through the park — it’s far nicer.",
          "If it’s busy, we’ll just pivot and do Plan B.",
        ],
        vocab: ["riverside", "winding streets", "viewpoint", "off the beaten track", "to wander", "to stumble across"],
      },
      Foodie: {
        title: "The Foodie 🍜",
        desc: "You want atmosphere and flavour. Your goal: sound lively without sounding childish — use strong but controlled opinions.",
        phrases: [
          "That place is buzzing — let’s give it a go.",
          "It’s a bit pricey, but the quality is genuinely worth it.",
          "I’m after something authentic, not just a tourist trap.",
          "We should book — it gets packed at peak times.",
        ],
        vocab: ["buzzing", "packed", "tourist trap", "overrated", "a proper", "to book ahead"],
      },
      Planner: {
        title: "The Planner 🗂️",
        desc: "You want clarity, efficiency, and low friction. Your London English should sound organised, flexible, and polite.",
        phrases: [
          "I’ve mapped a route that’s quicker and less stressful.",
          "We’re meeting at 6, so we’ll need to be on time.",
          "Shall we lock in two anchors and keep the rest flexible?",
          "If there’s disruption, we’ll switch lines and keep moving.",
        ],
        vocab: ["interchange", "backup plan", "time slot", "within walking distance", "efficient", "disruption"],
      },
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const values = Object.fromEntries(fd.entries());
      const personaKey = personaFrom(values);
      const pd = personaData[personaKey];

      out.innerHTML = `
        <h4>${pd.title}</h4>
        <p>${pd.desc}</p>
        <p><strong>Useful phrases</strong></p>
        <ul class="la-mini">
          ${pd.phrases.map((p) => `<li>💬 ${p}</li>`).join("")}
        </ul>
        <p><strong>High‑level vocabulary</strong></p>
        <div class="la-tags">
          ${pd.vocab.map((v) => `<span class="la-tag">${v}</span>`).join("")}
        </div>
      `;
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        out.innerHTML = "";
      });
    }
  }

  // small extra styles injected for persona tags (keeps CSS file clean)
  function injectTinyStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .la-mini{margin:0.35rem 0 0;padding-left:1.1rem;color:var(--la-muted)}
      .la-mini li+li{margin-top:0.25rem}
      .la-tags{display:flex;flex-wrap:wrap;gap:0.45rem;margin-top:0.35rem}
      .la-tag{display:inline-flex;align-items:center;padding:0.28rem 0.55rem;border-radius:999px;
        background:rgba(2,6,23,0.06);border:1px solid rgba(15,23,42,0.12);font-weight:700;font-size:0.86rem}
    `;
    document.head.appendChild(style);
  }

  // ----------------------------
  // Itinerary builder
  // ----------------------------
  function initItinerary() {
    const form = $("#la-itinerary-form");
    const out = $("#la-itinerary-output");
    const resetBtn = $("#la-itinerary-reset");
    if (!form || !out) return;

    function nameOrTraveller(raw) {
      const n = safeText(raw).trim();
      return n ? titleCase(n) : "Traveller";
    }

    function pick(map, key, fallbackKey) {
      return map[key] || map[fallbackKey];
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const v = Object.fromEntries(fd.entries());

      const who = nameOrTraveller(v.name);

      const anchors = {
        culture: [
          "a major museum (quiet depth, not just photos)",
          "an architectural walk (old + new London)",
          "a theatre evening (West End or something smaller)"
        ],
        food: [
          "a market + street‑food crawl (with a few sit‑down breaks)",
          "a neighbourhood hop (one area at a time, properly)",
          "a pub lunch that feels genuinely local"
        ],
        views: [
          "a long riverside walk (Thames + bridges)",
          "a park + viewpoint (space to breathe)",
          "sunset somewhere with a skyline angle"
        ],
        mix: [
          "one anchor museum",
          "one neighbourhood for food",
          "one riverside / park walk"
        ]
      };

      const paceLines = {
        relaxed: "We’ll keep it intentionally spacious — fewer stops, but we’ll actually enjoy them.",
        medium: "We’ll structure the day with a few anchors, then keep breathing room for surprises.",
        packed: "We’ll maximise what we see — tight timing, but still realistic."
      };

      const budgetLines = {
        budget: "We’ll prioritise value: free museums, scenic walks, and one paid highlight.",
        mid: "We’ll balance cost and comfort: a couple of paid highlights and a solid meal.",
        treat: "We’ll lean into comfort: great seats, good coffee, and fewer compromises."
      };

      const weatherTweaks = {
        dry: "Because it’s dry, we’ll do more walking and a longer riverside stretch.",
        rain: "If the weather turns, we’ll pivot indoors (museums, covered markets, cosy pubs).",
        cold: "Since it’s cold, we’ll keep outdoor blocks shorter and build in warm stops."
      };

      const transportTone = {
        tube: "We’ll mainly use the Tube with short walks — efficient and flexible.",
        bus: "We’ll use buses strategically so you can actually see the city as you move.",
        mix: "We’ll mix Tube and buses depending on what’s quickest and least stressful.",
        cab: "We’ll use cabs for the awkward jumps — more comfortable, especially if you’re tired."
      };

      const priorityText = pick(anchors, v.priority, "mix");
      const selectedAnchors = priorityText.join(", ");

      const compLine = (v.pace === "packed")
        ? "We’ll choose routes that are quicker and areas that are closer together."
        : "We’ll choose areas that are less rushed and, where possible, less touristy.";

      const schedule = [
        `SATURDAY`,
        `09:30 – Coffee + orientation (get your bearings; don’t rush).`,
        `10:30 – Anchor 1: ${pick(anchors, v.priority, "mix")[0]}.`,
        `13:00 – Lunch break (aim for somewhere buzzing but not a tourist trap).`,
        `14:30 – Anchor 2: ${pick(anchors, v.priority, "mix")[1]}.`,
        `17:30 – Reset: a short walk / a quiet spot (it makes the evening feel easier).`,
        `19:30 – Evening: ${pick(anchors, v.priority, "mix")[2] || "something low‑stress (pub, show, or a slow dinner)"}.`,
        ``,
        `SUNDAY`,
        `10:00 – Late start (because you’ll enjoy the day more).`,
        `11:00 – Neighbourhood focus: pick one area and do it properly (don’t zig‑zag).`,
        `13:30 – Light lunch + a “one last thing” stop.`,
        `15:00 – Flexible: if you’re knackered, slow down; if you’re energised, add one bonus stop.`,
        `17:00 – Wind down: something scenic and calm before heading back.`
      ];

      const connectors = [
        "To be honest, the key is not over‑planning.",
        "Given the constraints, this is the most coherent route.",
        "If we have to cut something, we’ll drop the least essential stop.",
        "If things go sideways, we’ll pivot rather than force it."
      ];

      const output =
`${who}’s Advanced London Weekend Plan

Strategy (tone + logic)
• ${paceLines[v.pace] || paceLines.medium}
• ${budgetLines[v.budget] || budgetLines.mid}
• ${transportTone[v.transport] || transportTone.mix}
• ${weatherTweaks[v.weather] || weatherTweaks.dry}
• ${compLine}

Why this works (advanced language)
• It’s more coherent than jumping across the city.
• It’s less stressful, and arguably more memorable.
• It gives you flexibility without feeling vague.
• ${connectors[Math.floor(Math.random() * connectors.length)]}

Schedule
${schedule.map((x) => (x ? `• ${x}` : "")).join("\n")}
`;

      out.value = output.trim();
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        out.value = "";
      });
    }
  }

  // ----------------------------
  // Dialogue builder
  // ----------------------------
  function initDialogue() {
    const form = $("#la-dialogue-form");
    const out = $("#la-dialogue-output");
    const resetBtn = $("#la-dialogue-reset");
    if (!form || !out) return;

    function nameOrTraveller(raw) {
      const n = safeText(raw).trim();
      return n ? titleCase(n) : "Traveller";
    }

    function soften(register) {
      if (register === "verypolite") {
        return {
          opener: "Hi there — sorry to bother you. I was wondering if you could help me with something.",
          ask: "Would it be possible to…",
          hedge: "if at all possible",
          thanks: "Thanks so much — I really appreciate it."
        };
      }
      if (register === "direct") {
        return {
          opener: "Hi — could you help me with something?",
          ask: "Could you…",
          hedge: "",
          thanks: "Thanks."
        };
      }
      // neutral
      return {
        opener: "Hi — could I ask a quick question?",
        ask: "Could you…",
        hedge: "if possible",
        thanks: "Thanks, I appreciate it."
      };
    }

    function goalLine(goal) {
      if (goal === "upgrade") return "If there’s any chance of an upgrade or a goodwill gesture, I’d be grateful.";
      if (goal === "options") return "Could you walk me through the options, with the pros and cons?";
      return "Could you sort it out for me now, if possible?";
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const v = Object.fromEntries(fd.entries());

      const who = nameOrTraveller(v.name);
      const s = soften(v.register || "neutral");

      let dialogue = "";

      if (v.scenario === "hotel") {
        dialogue =
`${who}: ${s.opener}
Reception: Of course — what seems to be the issue?
${who}: My room faces the street, and it’s much noisier than I expected. ${s.ask} move me to a quieter room ${s.hedge}?
Reception: I’m afraid we’re quite full tonight, but let me check what we can do.
${who}: Thank you. ${goalLine(v.goal)}
Reception: We can move you to a room at the back. It’s smaller, but it’s definitely quieter.
${who}: That sounds like a good trade‑off. ${s.thanks}
Reception: No problem — we’ll arrange the key change.`;
      } else if (v.scenario === "restaurant") {
        dialogue =
`${who}: ${s.opener}
Server: Sure — is everything alright?
${who}: Mostly, yes. I think there’s been a small mix‑up: I ordered the vegetarian dish, but this looks like it has meat. ${s.ask} swap it, ${s.hedge}?
Server: Oh, I’m so sorry about that. Let me take it back right away.
${who}: Thanks. ${goalLine(v.goal)}
Server: We’ll remake it immediately, and we can offer you a drink on the house for the inconvenience.
${who}: That’s kind of you. ${s.thanks}
Server: It’ll be with you shortly.`;
      } else if (v.scenario === "transport") {
        dialogue =
`${who}: ${s.opener}
Staff: Yes — what do you need?
${who}: There’s disruption on the line. ${s.ask} tell me the quickest alternative route to Camden Town, ${s.hedge}?
Staff: Right — you’ll want to change at Euston and take the replacement bus.
${who}: Thanks. Roughly how long will it take?
Staff: Probably 25–35 minutes, depending on traffic.
${who}: Understood. ${goalLine(v.goal)}
Staff: If you’re in a hurry, you could also take a different line and walk the last part.
${who}: That’s helpful — cheers.`;
      } else {
        // theatre
        dialogue =
`${who}: ${s.opener}
Box Office: Of course — are you looking for tickets for tonight?
${who}: Yes. ${s.ask} check if there are two seats together, ideally not too far back, ${s.hedge}?
Box Office: We have two in the stalls, but they’re slightly restricted view.
${who}: How restricted are we talking?
Box Office: You might miss a small part of the far-left stage.
${who}: If the price reflects that, I’m happy. ${goalLine(v.goal)}
Box Office: We can do a small discount, and there’s a better pair for tomorrow’s matinée.
${who}: Tomorrow could work. Let’s go for the matinée — thank you.`;
      }

      out.value = dialogue.trim();
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        out.value = "";
      });
    }
  }

  // ----------------------------
  // Text-to-Speech (Web Speech API)
  // ----------------------------
  let laUtterance = null;

  function stopTTS() {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (_) {}
    laUtterance = null;
  }

  function chooseVoice(voices) {
    // Prefer en-GB if available; otherwise any English voice.
    const enGB = voices.find(v => (v.lang || "").toLowerCase().startsWith("en-gb"));
    if (enGB) return enGB;

    const enAny = voices.find(v => (v.lang || "").toLowerCase().startsWith("en"));
    return enAny || null;
  }

  function speakText(text) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      alert("Sorry — your browser does not support text‑to‑speech.");
      return;
    }

    stopTTS();

    const utter = new SpeechSynthesisUtterance(text);
    laUtterance = utter;

    // Force UK English (accent depends on the available voices on the device)
    utter.lang = "en-GB";
    utter.rate = 1.0;
    utter.pitch = 1.0;

    let started = false;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      const voice = chooseVoice(voices);

      // If an en-GB / English voice exists, use it explicitly (prevents default French voice).
      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang || utter.lang;
      }
    };

    const startSpeaking = () => {
      if (started) return;
      started = true;
      setVoice();
      window.speechSynthesis.speak(utter);
    };

    // Some browsers load voices asynchronously. If voices aren't ready yet,
    // wait briefly for voiceschanged before speaking (otherwise the default voice may be French).
    const voicesNow = window.speechSynthesis.getVoices() || [];
    if (voicesNow.length) {
      startSpeaking();
      return;
    }

    const prev = window.speechSynthesis.onvoiceschanged;
    window.speechSynthesis.onvoiceschanged = function () {
      try { if (typeof prev === "function") prev(); } catch (_) {}
      startSpeaking();
      // restore previous handler (avoid hijacking globally)
      window.speechSynthesis.onvoiceschanged = prev || null;
    };

    // Fallback: start anyway after a short delay if voiceschanged never fires.
    setTimeout(() => startSpeaking(), 900);
  }

  function initTTSButtons() {
    // Speak buttons: data-tts="elementId"
    $$("[data-tts]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-tts");
        if (!id) return;

        const el = document.getElementById(id);
        if (!el) return;

        const text = "value" in el ? safeText(el.value) : safeText(el.textContent);
        const trimmed = text.trim();
        if (!trimmed) return;

        speakText(trimmed);
      });
    });

    // Pause/resume/stop
    $$("[data-tts-pause]").forEach((btn) => {
      btn.addEventListener("click", () => {
        try { window.speechSynthesis.pause(); } catch (_) {}
      });
    });

    $$("[data-tts-resume]").forEach((btn) => {
      btn.addEventListener("click", () => {
        try { window.speechSynthesis.resume(); } catch (_) {}
      });
    });

    $$("[data-tts-stop]").forEach((btn) => {
      btn.addEventListener("click", stopTTS);
    });
  }

  // ----------------------------
  // Init
  // ----------------------------
  function init() {
    applyHeroImageFromBody();
    injectTinyStyles();
    initQuizzes();
    initPersona();
    initItinerary();
    initDialogue();
    initTTSButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
