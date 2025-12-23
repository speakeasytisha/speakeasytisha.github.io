/* Small Talk Lesson (Part 2) — JS
   - Accent toggle (UK/US) with Web Speech API
   - Vocab cards with Listen buttons
   - MCQ quizzes with instant feedback + scoring + reset
   - Drag & drop matching (HTML5 DnD)
   - Role-play dialogue builder
   - Listening mini-dialogues (click line to speak)
   - Email builder + checklist + listen
*/

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ----------------------------
  // Personalization (name)
  // ----------------------------
  const nameInput = $("#learnerName");
  const NAME_KEY = "speakeasy.lesson.name";
  const getName = () => (nameInput?.value || "").trim();
  const displayName = () => (getName() || "I");

  if (nameInput) {
    nameInput.value = localStorage.getItem(NAME_KEY) || "";
    nameInput.addEventListener("input", () => localStorage.setItem(NAME_KEY, nameInput.value));
  }

  // ----------------------------
  // TTS: Accent toggle + voice picking
  // ----------------------------
  const voiceStatus = $("#voiceStatus");
  const rateEl = $("#rate");
  const pitchEl = $("#pitch");

  let preferredLang = "en-GB";
  let cachedVoices = [];
  let selectedVoice = null;

  function refreshVoices() {
    cachedVoices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    selectedVoice = pickBestVoice(preferredLang);
    updateVoiceStatus();
  }

  function pickBestVoice(lang) {
    if (!cachedVoices || cachedVoices.length === 0) return null;

    // Prefer exact lang match; then startsWith (en-GB -> en-GB-x…)
    const exact = cachedVoices.filter(v => (v.lang || "").toLowerCase() === lang.toLowerCase());
    const prefix = cachedVoices.filter(v => (v.lang || "").toLowerCase().startsWith(lang.toLowerCase()));
    const enAny = cachedVoices.filter(v => (v.lang || "").toLowerCase().startsWith("en"));

    const pool = exact.length ? exact : (prefix.length ? prefix : enAny);
    if (!pool.length) return null;

    // Prefer non-local / default voices if any
    const preferred = pool.find(v => v.default) || pool[0];
    return preferred || null;
  }

  function updateVoiceStatus() {
    if (!voiceStatus) return;

    if (!("speechSynthesis" in window)) {
      voiceStatus.textContent = "Voice: not supported in this browser.";
      return;
    }

    if (!cachedVoices || cachedVoices.length === 0) {
      voiceStatus.textContent = "Voice: loading… (tap a Listen button once if needed)";
      return;
    }

    const v = selectedVoice;
    if (!v) {
      voiceStatus.textContent = "Voice: no English voice found (try another device/browser).";
      return;
    }

    voiceStatus.textContent = `Voice: ${v.name} (${v.lang}) · Accent: ${preferredLang}`;
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel(); // stop any current speech
    const utter = new SpeechSynthesisUtterance(text);

    // Refresh and re-pick each time (some browsers load late)
    cachedVoices = speechSynthesis.getVoices();
    selectedVoice = pickBestVoice(preferredLang);

    if (selectedVoice) utter.voice = selectedVoice;
    utter.lang = preferredLang;

    const rate = parseFloat(rateEl?.value || "1");
    const pitch = parseFloat(pitchEl?.value || "1");
    utter.rate = isFinite(rate) ? rate : 1;
    utter.pitch = isFinite(pitch) ? pitch : 1;

    speechSynthesis.speak(utter);
  }

  function stopSpeak() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
  }

  // Accent toggle listeners
  $$('input[name="accent"]').forEach(r => {
    r.addEventListener("change", () => {
      preferredLang = r.value;
      refreshVoices();
    });
  });

  $("#testVoice")?.addEventListener("click", () => {
    const nm = getName();
    const sample = nm
      ? `Hi ${nm}. Let's practise small talk. What are you doing this weekend?`
      : "Hi! Let's practise small talk. What are you doing this weekend?";
    speak(sample);
  });

  $("#stopVoice")?.addEventListener("click", stopSpeak);

  // Some browsers fire voiceschanged; others need a user gesture first.
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  } else {
    updateVoiceStatus();
  }

  // Generic speak buttons
  $$("[data-say]").forEach(btn => {
    btn.addEventListener("click", () => speak(btn.getAttribute("data-say") || ""));
  });
  $$("[data-say-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-say-target");
      const el = sel ? $(sel) : null;
      if (!el) return;
      speak(el.innerText.replace(/\s+/g, " ").trim());
    });
  });

  // ----------------------------
  // Tabs (vocab)
  // ----------------------------
  const tabs = $$(".tab");
  tabs.forEach(t => {
    t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.remove("is-active"));
      t.classList.add("is-active");

      const key = t.getAttribute("data-tab");
      $$(".panel").forEach(p => p.classList.toggle("is-active", p.getAttribute("data-panel") === key));
      tabs.forEach(x => x.setAttribute("aria-selected", x === t ? "true" : "false"));
    });
  });

  // ----------------------------
  // Vocabulary data
  // ----------------------------
  const VOCAB = {
    jobs: [
      { icon: "🚆", word: "shift", hint: "a working period", ex: "I’m on an early shift this week." },
      { icon: "🗂️", word: "to handle", hint: "to manage / deal with", ex: "I handle customer requests and schedules." },
      { icon: "📎", word: "deadline", hint: "latest time to finish", ex: "We have a tight deadline for the report." },
      { icon: "🧑‍🤝‍🧑", word: "colleague", hint: "person you work with", ex: "I get on well with my colleagues." },
      { icon: "🧭", word: "to coordinate", hint: "organise people / timing", ex: "I coordinate the team on weekends." },
      { icon: "🛠️", word: "to troubleshoot", hint: "solve problems", ex: "I troubleshoot issues as they come up." },
      { icon: "📣", word: "to brief", hint: "give key info quickly", ex: "I brief the team before the shift starts." },
      { icon: "🧾", word: "invoice", hint: "bill", ex: "Could you send the invoice by Friday?" }
    ],
    hobbies: [
      { icon: "🏃", word: "to go for a run", hint: "jog", ex: "I go for a run when I need to clear my head." },
      { icon: "🎸", word: "to play an instrument", hint: "music", ex: "I’ve been playing the guitar for years." },
      { icon: "📚", word: "to be into", hint: "to really like", ex: "I’m really into history podcasts." },
      { icon: "🍳", word: "to cook from scratch", hint: "not ready-made", ex: "On Sundays, we cook from scratch." },
      { icon: "🧩", word: "board game night", hint: "games with friends", ex: "We’re doing a board game night on Saturday." },
      { icon: "🖼️", word: "exhibition", hint: "art show", ex: "We saw an exhibition at the museum." },
      { icon: "🏞️", word: "to go hiking", hint: "walk in nature", ex: "We went hiking and the views were stunning." },
      { icon: "☕", word: "to catch up", hint: "talk after time apart", ex: "Let’s catch up over coffee." }
    ],
    weekend: [
      { icon: "📅", word: "to be free", hint: "available", ex: "Are you free on Saturday afternoon?" },
      { icon: "🎟️", word: "tickets", hint: "for events", ex: "I managed to get tickets at the last minute." },
      { icon: "🍻", word: "pub", hint: "UK bar", ex: "Shall we meet at a pub near the station?" },
      { icon: "🥘", word: "takeaway", hint: "UK: takeaway / US: takeout", ex: "We ordered takeaway because we were tired." },
      { icon: "🧺", word: "picnic", hint: "outdoor meal", ex: "If it’s sunny, we could have a picnic." },
      { icon: "🚇", word: "the Tube", hint: "London underground", ex: "The Tube is often quicker than a taxi." },
      { icon: "🧭", word: "to meet up", hint: "see each other", ex: "Let’s meet up around 7." },
      { icon: "🌧️", word: "a backup plan", hint: "Plan B", ex: "Let’s have a backup plan in case it rains." }
    ],
    smalltalk: [
      { icon: "🙂", word: "How’s it going?", hint: "friendly greeting", ex: "How’s it going? Long time no see!" },
      { icon: "🤔", word: "How come?", hint: "why? (casual)", ex: "You’re working late? How come?" },
      { icon: "🧠", word: "What do you do exactly?", hint: "ask about job", ex: "What do you do exactly in your role?" },
      { icon: "✨", word: "That sounds…", hint: "reaction", ex: "That sounds intense. Are you enjoying it?" },
      { icon: "🗣️", word: "What was it like?", hint: "ask for details", ex: "You lived in London? What was it like?" },
      { icon: "🧩", word: "To be honest,", hint: "softens opinion", ex: "To be honest, I prefer quieter places." },
      { icon: "✅", word: "Fair enough.", hint: "I understand", ex: "Fair enough. That makes sense." },
      { icon: "📌", word: "By the way,", hint: "change topic", ex: "By the way, are you free this weekend?" }
    ]
  };

  function renderVocab(list, rootId) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = list.map(item => `
      <div class="vocab-card">
        <div class="vocab-top">
          <div class="vocab-word">
            <div style="display:flex; align-items:center; gap:.55rem;">
              <span class="icon-badge" aria-hidden="true">${item.icon}</span>
              <div>
                <strong>${item.word}</strong><br>
                <span>${item.hint}</span>
              </div>
            </div>
          </div>
          <div class="vocab-actions">
            <button class="btn btn-outline" type="button" data-say="${escapeAttr(item.word)}">Listen</button>
          </div>
        </div>
        <p class="vocab-example"><em>Example:</em> ${personalize(item.ex)}</p>
      </div>
    `).join("");
  }

  function personalize(text) {
    // Replace "I" at the start to include learner name sometimes (optional).
    const nm = getName().trim();
    if (!nm) return text;

    // A gentle personalization: replace "I’m" with "<Name>’s" ? no, keep first person.
    // Instead, include name in one place:
    return text.replace(/^I\b/, nm);
  }

  function escapeAttr(s) {
    return String(s).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  }

  renderVocab(VOCAB.jobs, "vocabJobs");
  renderVocab(VOCAB.hobbies, "vocabHobbies");
  renderVocab(VOCAB.weekend, "vocabWeekend");
  renderVocab(VOCAB.smalltalk, "vocabSmalltalk");

  // ----------------------------
  // MCQ engine
  // ----------------------------
  const quizState = {};

  function buildMCQ(container, quizKey, questions) {
    if (!container) return;
    quizState[quizKey] = { correct: 0, total: questions.length };

    container.innerHTML = questions.map((q, idx) => `
      <div class="mcq-question" data-q="${quizKey}-${idx}">
        <p>${q.prompt}</p>
        <div class="mcq-answers">
          ${q.choices.map((c, i) => `
            <button type="button" data-correct="${q.correctIndex === i ? "true" : "false"}">${c}</button>
          `).join("")}
        </div>
        <div class="feedback" aria-live="polite"></div>
      </div>
    `).join("");

    // attach listeners
    $$(".mcq-question", container).forEach(qEl => {
      const feedback = $(".feedback", qEl);
      const buttons = $$("button", $(".mcq-answers", qEl));
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          if (qEl.dataset.answered === "true") return;
          qEl.dataset.answered = "true";

          const isCorrect = btn.getAttribute("data-correct") === "true";
          if (isCorrect) {
            btn.classList.add("is-correct");
            feedback.textContent = "✅ Correct!";
            feedback.classList.add("good");
            quizState[quizKey].correct += 1;
          } else {
            btn.classList.add("is-wrong");
            const correctBtn = buttons.find(b => b.getAttribute("data-correct") === "true");
            if (correctBtn) correctBtn.classList.add("is-correct");
            feedback.textContent = "❌ Not quite. Check the rule and try to say it out loud.";
            feedback.classList.add("bad");
          }

          buttons.forEach(b => (b.disabled = true));
          updateScore(quizKey);
        });
      });
    });

    updateScore(quizKey);
  }

  function updateScore(quizKey) {
    const el = document.querySelector(`[data-score="${quizKey}"]`);
    if (!el) return;
    const s = quizState[quizKey] || { correct: 0, total: 0 };
    el.textContent = `Score: ${s.correct} / ${s.total}`;
  }

  function resetQuizIn(root) {
    // reset MCQs
    $$(".mcq-question", root).forEach(qEl => {
      qEl.dataset.answered = "false";
      const feedback = $(".feedback", qEl);
      if (feedback) {
        feedback.textContent = "";
        feedback.classList.remove("good", "bad");
      }
      $$("button", qEl).forEach(b => {
        b.disabled = false;
        b.classList.remove("is-correct", "is-wrong");
      });
    });

    // reset any scores inside root by re-counting answered states
    Object.keys(quizState).forEach(key => {
      const scoreEl = root.querySelector(`[data-score="${key}"]`);
      if (scoreEl) {
        quizState[key].correct = 0;
        updateScore(key);
      }
    });
  }

  // Build quizzes
  buildMCQ(
    document.querySelector('[data-quiz="grammar"]'),
    "grammar",
    [
      {
        prompt: "1) Choose the best option: “I ____ my cousin on Saturday.” (arranged plan)",
        choices: ["see", "am seeing", "saw", "have seen"],
        correctIndex: 1
      },
      {
        prompt: "2) Choose the best option: “I usually ____ dinner at 7.”",
        choices: ["am having", "have", "having", "to have"],
        correctIndex: 1
      },
      {
        prompt: "3) Choose the most natural invitation (polite):",
        choices: ["You want go for a drink?", "Would you like to go for a drink?", "Do you like to go drink?", "You go for drink?"],
        correctIndex: 1
      },
      {
        prompt: "4) Correct comparative: “This café is ____ than the one near my office.”",
        choices: ["more cheap", "cheaper", "cheapest", "the cheaper"],
        correctIndex: 1
      },
      {
        prompt: "5) Choose the best intensifier: “It’s ____ nicer inside than outside.”",
        choices: ["much", "more", "very", "the"],
        correctIndex: 0
      }
    ]
  );

  buildMCQ(
    document.querySelector('[data-quiz="reading"]'),
    "reading",
    [
      {
        prompt: "1) Why did they choose the walk by the river?",
        choices: ["They love crowds.", "The market was closed.", "The weather looked uncertain and they wanted something calmer.", "They had to meet someone there."],
        correctIndex: 2
      },
      {
        prompt: "2) What does “chaotic” suggest about Friday evening?",
        choices: ["Everything was perfectly organised.", "It was stressful or messy.", "It was boring.", "It was very quiet."],
        correctIndex: 1
      },
      {
        prompt: "3) What does “worth it” mean here?",
        choices: ["Not a good idea.", "Too expensive to consider.", "The value was good despite the price.", "They regretted it."],
        correctIndex: 2
      },
      {
        prompt: "4) What was the best part of Sunday?",
        choices: ["The food.", "The conversation.", "The weather.", "Shopping."],
        correctIndex: 1
      }
    ]
  );

  // Reset buttons (generic)
  $$("[data-reset]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-reset");
      const root = target ? document.querySelector(target) : null;
      if (!root) return;

      resetQuizIn(root);

      // Reset dragdrop + roleplay + email if inside
      if (root.id === "dd1") resetDragDrop();
      if (root.id === "roleplayCard") resetRoleplay();
      if (root.id === "emailCard") resetEmail();

      // If reset is called on a larger block that contains these components:
      if (root.querySelector("#dd1")) resetDragDrop();
      if (root.querySelector("#roleplayCard")) resetRoleplay();
      if (root.querySelector("#emailCard")) resetEmail();
    });
  });

  // ----------------------------
  // Drag & drop matching
  // ----------------------------
  const ddItemsRoot = $("#ddItems");
  const ddTargetsRoot = $("#ddTargets");
  const ddFeedback = $("#ddFeedback");

  const DD_PAIRS = [
    { job: "nurse", place: "hospital" },
    { job: "chef", place: "restaurant" },
    { job: "teacher", place: "school" },
    { job: "engineer", place: "office / site" },
    { job: "cashier", place: "shop" },
    { job: "pilot", place: "airport" }
  ];

  function renderDragDrop() {
    if (!ddItemsRoot || !ddTargetsRoot) return;

    ddItemsRoot.innerHTML = "";
    ddTargetsRoot.innerHTML = "";

    // items
    shuffle([...DD_PAIRS]).forEach((p, idx) => {
      const el = document.createElement("div");
      el.className = "dd-item";
      el.draggable = true;
      el.textContent = p.job;
      el.dataset.value = p.job;
      el.id = `dd-item-${idx}`;
      el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", el.dataset.value);
        e.dataTransfer.effectAllowed = "move";
      });
      ddItemsRoot.appendChild(el);
    });

    // targets
    shuffle([...DD_PAIRS]).forEach(p => {
      const t = document.createElement("div");
      t.className = "dd-target";
      t.dataset.accept = p.job;

      const left = document.createElement("div");
      left.innerHTML = `<strong>${p.place}</strong><span>Drop the job here</span>`;

      const zone = document.createElement("div");
      zone.className = "dd-dropzone";
      zone.textContent = "—";

      t.appendChild(left);
      t.appendChild(zone);

      // allow drop
      t.addEventListener("dragover", (e) => {
        e.preventDefault();
        t.classList.add("is-over");
        e.dataTransfer.dropEffect = "move";
      });

      t.addEventListener("dragleave", () => t.classList.remove("is-over"));

      t.addEventListener("drop", (e) => {
        e.preventDefault();
        t.classList.remove("is-over");
        const value = e.dataTransfer.getData("text/plain");

        if (!value) return;

        // find item element
        const itemEl = $$(".dd-item", ddItemsRoot).find(x => x.dataset.value === value && !x.classList.contains("is-done"));
        if (!itemEl) return;

        const correct = value === t.dataset.accept;

        zone.textContent = value;
        zone.classList.remove("good", "bad");
        zone.classList.add(correct ? "good" : "bad");

        itemEl.classList.add("is-done");
        itemEl.draggable = false;

        if (ddFeedback) {
          ddFeedback.textContent = correct
            ? `✅ Nice. Say: “A ${value} works in a ${puncPlace(t.querySelector("strong")?.innerText)}.”`
            : `❌ Not quite. Try again: Where does a “${value}” work?`;
        }

        // allow retries if wrong: re-enable item
        if (!correct) {
          setTimeout(() => {
            itemEl.classList.remove("is-done");
            itemEl.draggable = true;
            zone.textContent = "—";
            zone.classList.remove("good", "bad");
          }, 800);
        }
      });

      ddTargetsRoot.appendChild(t);
    });
  }

  function puncPlace(place) {
    if (!place) return "place";
    return place.toLowerCase().includes("office") ? "office" : place.toLowerCase();
  }

  function resetDragDrop() {
    if (ddFeedback) ddFeedback.textContent = "Tip: say the full sentence out loud after each match.";
    renderDragDrop();
  }

  $("#ddListenSentence")?.addEventListener("click", () => {
    speak("Example: A nurse works in a hospital. A chef works in a restaurant. A teacher works in a school.");
  });

  renderDragDrop();

  // ----------------------------
  // Role-play dialogue builder
  // ----------------------------
  const roleThread = $("#roleThread");
  const roleChoices = $("#roleChoices");
  const roleOutput = $("#roleOutput");

  const ROLE = {
    steps: [
      {
        who: "Other",
        text: "Hey! How’s it going?",
        options: [
          "Pretty good, thanks. And you?",
          "Not bad at all. Busy week though—how about you?",
          "Honestly, a bit tired. How’s your week been?"
        ]
      },
      {
        who: "Other",
        text: "Same here. What do you do exactly?",
        options: [
          "I work in operations. I coordinate schedules and handle issues.",
          "I’m in customer service, so I deal with requests and solve problems.",
          "I manage a small team, mostly planning and troubleshooting."
        ]
      },
      {
        who: "Other",
        text: "Sounds intense. Are you enjoying it?",
        options: [
          "Yeah, most of the time. It’s challenging, but I like the responsibility.",
          "It depends. Some days are great, some are chaotic.",
          "Actually yes—especially when the team works well together."
        ]
      },
      {
        who: "Other",
        text: "So… any plans for the weekend?",
        options: [
          "I’m meeting friends on Saturday, and I’m seeing family on Sunday. What about you?",
          "I’m keeping it low-key. Maybe a walk and a bit of cooking. And you?",
          "I’m doing a few errands, then I’m going out in the evening. Fancy joining?"
        ]
      },
      {
        who: "Other",
        text: "That could be fun. Where are you thinking?",
        options: [
          "Maybe a pub near the station—somewhere quieter.",
          "We could try that new place. It’s a bit pricey, but the vibe is great.",
          "I’m open. Do you feel like something relaxed or more lively?"
        ]
      },
      {
        who: "Other",
        text: "Quieter sounds better. What time?",
        options: [
          "How about around 7? I can book a table if you want.",
          "Let’s say 7:30. If you’re running late, just text me.",
          "Would 8 work for you? We can keep it flexible."
        ]
      },
      {
        who: "Other",
        text: "Perfect. See you then!",
        options: [
          "Great! See you then. Looking forward to it.",
          "Nice one—see you later!",
          "Brilliant. Catch you then!"
        ]
      }
    ]
  };

  let roleIndex = 0;
  let builtLines = []; // {who,text}

  function renderRole() {
    if (!roleThread || !roleChoices || !roleOutput) return;

    roleThread.innerHTML = "";
    roleOutput.innerHTML = "";

    builtLines.forEach(line => {
      roleThread.appendChild(makeBubble(line.who, line.text));
    });

    const step = ROLE.steps[roleIndex];
    if (!step) {
      roleChoices.innerHTML = "<p class='muted'>✅ Finished. Try again and pick different options.</p>";
      roleOutput.innerHTML = builtLines.map(l => `<div><strong>${l.who}:</strong> ${escapeHTML(l.text)}</div>`).join("");
      return;
    }

    // show other line
    roleThread.appendChild(makeBubble(step.who, step.text));
    builtLines.push({ who: step.who, text: step.text });

    // choices for "You"
    roleChoices.innerHTML = step.options.map(opt => `
      <button class="choice" type="button">${escapeHTML(opt)}</button>
    `).join("");

    // listeners
    $$(".choice", roleChoices).forEach((btn) => {
      btn.addEventListener("click", () => {
        const txt = btn.innerText;
        builtLines.push({ who: "You", text: txt });
        roleIndex += 1;
        renderRole();
        // auto-scroll
        roleThread.scrollTop = roleThread.scrollHeight;
      });
    });

    roleThread.scrollTop = roleThread.scrollHeight;
  }

  function makeBubble(who, text) {
    const div = document.createElement("div");
    div.className = `bubble ${who === "You" ? "you" : "other"}`;
    div.innerHTML = `<span class="who">${who}</span><span>${escapeHTML(text)}</span>`;
    return div;
  }

  function resetRoleplay() {
    roleIndex = 0;
    builtLines = [];
    renderRole();
  }

  $("#roleReset")?.addEventListener("click", resetRoleplay);

  $("#roleListen")?.addEventListener("click", () => {
    if (!builtLines.length) return;
    const spoken = builtLines.map(l => `${l.who === "You" ? "You" : "Friend"}: ${l.text}`).join(" ... ");
    speak(spoken);
  });

  $("#roleStop")?.addEventListener("click", stopSpeak);

  resetRoleplay();

  // ----------------------------
  // Listening mini-dialogues
  // ----------------------------
  const dialogueGrid = $("#dialogueGrid");

  const MINI_DIALOGUES = [
    {
      title: "Coffee catch-up ☕",
      lines: [
        ["A", "Do you fancy a quick coffee after work?"],
        ["B", "Yeah, why not? I’m free around six."],
        ["A", "Perfect. Shall we meet near the station?"],
        ["B", "Sounds good. Text me when you’re on your way."]
      ]
    },
    {
      title: "Weekend plans 🗓️",
      lines: [
        ["A", "What are you up to this weekend?"],
        ["B", "I’m meeting friends on Saturday, then I’m seeing family on Sunday."],
        ["A", "Nice. Are you doing anything fun in the evening?"],
        ["B", "Maybe a pub—something quiet."]
      ]
    },
    {
      title: "Small talk at work 💼",
      lines: [
        ["A", "Busy day? You look focused."],
        ["B", "Yeah—tight deadline. I’m trying to finish before five."],
        ["A", "Fair enough. Want a hand with anything?"],
        ["B", "Thanks! Could you double-check one detail for me?"]
      ]
    }
  ];

  function renderMiniDialogues() {
    if (!dialogueGrid) return;

    dialogueGrid.innerHTML = MINI_DIALOGUES.map((d, i) => `
      <div class="dialogue-card">
        <h3>${escapeHTML(d.title)}</h3>
        ${d.lines.map((l, j) => `
          <div class="line" role="button" tabindex="0" data-say="${escapeAttr(l[1])}">
            <span class="who">${escapeHTML(l[0])}</span>
            <span class="txt">${escapeHTML(l[1])}</span>
            <span class="play">▶</span>
          </div>
        `).join("")}
      </div>
    `).join("");

    $$(".line", dialogueGrid).forEach(line => {
      const txt = line.getAttribute("data-say") || "";
      const play = () => speak(txt);
      line.addEventListener("click", play);
      line.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          play();
        }
      });
    });
  }
  renderMiniDialogues();

  // ----------------------------
  // Email builder
  // ----------------------------
  const emailTo = $("#emailTo");
  const emailSubject = $("#emailSubject");
  const emailReason = $("#emailReason");
  const emailNewTime = $("#emailNewTime");
  const emailTone = $("#emailTone");
  const emailDraft = $("#emailDraft");
  const emailChecklist = $("#emailChecklist");

  function buildEmailDraft() {
    const toName = (emailTo?.value || "Alex").trim() || "Alex";
    const subj = (emailSubject?.value || "Meeting reschedule").trim() || "Meeting reschedule";
    const reason = (emailReason?.value || "").trim();
    const time = (emailNewTime?.value || "").trim();
    const tone = (emailTone?.value || "neutral").trim();

    const greeting = tone === "formal" ? `Dear ${toName},` : `Hi ${toName},`;
    const closing = tone === "formal"
      ? "Kind regards,"
      : tone === "friendly"
        ? "Best,"
        : "Regards,";

    const signature = getName().trim() || "Tisha";

    const bodyA = tone === "formal"
      ? `I hope you are doing well. Unfortunately, ${reason.toLowerCase()}`
      : tone === "friendly"
        ? `Hope you're doing well. Quick note: ${reason}`
        : `I hope you're well. ${reason}`;

    const bodyB = tone === "formal"
      ? `Would it be possible to reschedule our meeting to ${time}?`
      : `Could we move our meeting to ${time}?`;

    const bodyC = tone === "formal"
      ? "Please let me know if that works for you, or suggest an alternative time."
      : "Let me know if that works, or feel free to suggest another time.";

    const draft = `${greeting}

${bodyA}

${bodyB}
${bodyC}

${closing}
${signature}`;

    if (emailDraft) emailDraft.value = draft;
    if (emailSubject && !emailSubject.value.trim()) emailSubject.value = subj;
    runEmailChecklist();
  }

  function runEmailChecklist() {
    if (!emailDraft || !emailChecklist) return;
    const txt = emailDraft.value || "";
    const lower = txt.toLowerCase();

    const checks = {
      greeting: /^(hi|dear)\s+/i.test(txt.trim()),
      reason: /(unfortunately|because|due to|issue|delayed|urgent|not feeling|arrive late)/i.test(txt),
      proposal: /(reschedule|move).*\b(tomorrow|thursday|monday|at\s\d)/i.test(lower),
      question: /(would it be possible|could we|please let me know|does that work)/i.test(lower),
      closing: /(regards|best|kind regards)/i.test(lower)
    };

    $$("li[data-check]", emailChecklist).forEach(li => {
      const key = li.getAttribute("data-check");
      const ok = !!checks[key];
      li.classList.toggle("is-ok", ok);
      li.classList.toggle("is-miss", !ok);
    });
  }

  function resetEmail() {
    if (emailTo) emailTo.value = "";
    if (emailSubject) emailSubject.value = "";
    if (emailDraft) emailDraft.value = "";
    if (emailReason) emailReason.selectedIndex = 0;
    if (emailNewTime) emailNewTime.selectedIndex = 0;
    if (emailTone) emailTone.selectedIndex = 0;
    if (emailChecklist) {
      $$("li[data-check]", emailChecklist).forEach(li => li.classList.remove("is-ok", "is-miss"));
    }
  }

  $("#buildEmail")?.addEventListener("click", buildEmailDraft);
  $("#checkEmail")?.addEventListener("click", runEmailChecklist);
  $("#listenEmail")?.addEventListener("click", () => {
    if (!emailDraft) return;
    speak(emailDraft.value.replace(/\n+/g, " ... "));
  });

  // ----------------------------
  // Utilities
  // ----------------------------
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  // ----------------------------
  // Make sure speak buttons in vocab work after render
  // ----------------------------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-say]");
    if (!btn) return;
    const text = btn.getAttribute("data-say") || "";
    // If voices not loaded, this click often triggers them on iOS.
    refreshVoices();
    speak(text);
  });

})();
