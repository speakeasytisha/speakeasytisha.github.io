/* =========================================================
   SpeakEasyTisha · Shopping Spree (FIXED)
   FIXES:
   - Flashcards back shows definition + example (not mirrored front)
   - Sentence order uses Bank → Answer drag & drop (reliable)
   - Removed background theme switching (voice only)
   - Contrast fixes are in CSS
   ========================================================= */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalizeSpaces(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  /* ---------------------------
     State + Score
  --------------------------- */
  const state = {
    voice: "US", // US | UK
    selectedVoice: null,
    isPaused: false,
    scoreNow: 0,
    scoreMax: 0,
    awarded: new Set(), // ids awarded
    toggleExamples: true
  };

  const pointsMap = new Map(); // activityId -> points

  function setScoreText() {
    $("#scoreNow").textContent = String(state.scoreNow);
    $("#scoreMax").textContent = String(state.scoreMax);
  }

  function defineActivityPoints(activityId, points) {
    pointsMap.set(activityId, points);
  }

  function registerPoints(activityId, maxPoints) {
    if (!state.awarded.has(`__max__${activityId}`)) {
      state.scoreMax += maxPoints;
      state.awarded.add(`__max__${activityId}`);
      setScoreText();
    }
  }

  function award(activityId, points) {
    if (state.awarded.has(activityId)) return false;
    state.awarded.add(activityId);
    state.scoreNow += points;
    setScoreText();
    return true;
  }

  function recomputeScoreNow() {
    let sum = 0;
    for (const id of state.awarded) {
      if (id.startsWith("__max__")) continue;
      sum += pointsMap.get(id) || 0;
    }
    state.scoreNow = sum;
    setScoreText();
  }

  function showFeedback(elId, msg, ok, autoClearMs = 0) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("ok", !!ok);
    el.classList.toggle("bad", !ok);
    if (autoClearMs) {
      setTimeout(() => {
        el.textContent = "";
        el.classList.remove("ok", "bad");
      }, autoClearMs);
    }
  }

  /* ---------------------------
     Speech (US/UK)
  --------------------------- */
  function getPreferredVoice(langStartsWith) {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    if (!voices.length) return null;

    const candidates = voices.filter(v => (v.lang || "").toLowerCase().startsWith(langStartsWith));
    if (!candidates.length) return null;

    return candidates.find(v => /google|microsoft|natural|enhanced/i.test(v.name))
        || candidates[0]
        || null;
  }

  function refreshVoice() {
    if (!("speechSynthesis" in window)) {
      state.selectedVoice = null;
      return;
    }
    const want = state.voice === "UK" ? "en-gb" : "en-us";
    const voice = getPreferredVoice(want) || getPreferredVoice("en") || null;
    state.selectedVoice = voice;
  }

  if ("speechSynthesis" in window) {
    speechSynthesis.onvoiceschanged = () => refreshVoice();
    refreshVoice();
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const t = normalizeSpaces(text);
    if (!t) return;

    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    refreshVoice();
    if (state.selectedVoice) u.voice = state.selectedVoice;
    u.rate = 1.0;
    u.pitch = 1.0;

    state.isPaused = false;
    speechSynthesis.speak(u);
  }

  function pauseOrResume() {
    if (!("speechSynthesis" in window)) return;
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      state.isPaused = true;
      return;
    }
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      state.isPaused = false;
    }
  }

  function stopSpeak() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    state.isPaused = false;
  }

  function setVoice(mode) {
    state.voice = mode;
    $$(".pill__btn[data-voice]").forEach(btn => {
      const on = btn.dataset.voice === mode;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    refreshVoice();
  }

  function bindTopBar() {
    $$(".pill__btn[data-voice]").forEach(btn => {
      btn.addEventListener("click", () => setVoice(btn.dataset.voice));
    });

    $("#btnPauseSpeak").addEventListener("click", pauseOrResume);
    $("#btnStopSpeak").addEventListener("click", stopSpeak);

    $("#btnSpeakMission").addEventListener("click", () => {
      speak("Today’s mission: ask for sizes and prices, use how much and how many, use polite requests, and understand UK and US differences.");
    });

    $("#btnSpeakWrap").addEventListener("click", () => {
      speak("In a shop, try to sound friendly and polite. Use: Could I try this on? Do you have this in a different size? And: Would you like a receipt? Thanks, have a nice day!");
    });

    $("#btnShowCorrections").addEventListener("click", () => {
      const box = $("#pitfalls");
      const isHidden = box.hasAttribute("hidden");
      if (isHidden) box.removeAttribute("hidden");
      else box.setAttribute("hidden", "");
    });

    $("#btnResetAll").addEventListener("click", resetAll);
  }

  /* =========================================================
     Vocabulary Flashcards (FIXED BACK CONTENT)
  ========================================================= */
  const vocabData = [
    { theme:"Clothes", icon:"👗", word:"dress", def:"a one-piece item of clothing", ex:"I’m trying on a blue dress." },
    { theme:"Clothes", icon:"🧥", word:"jacket", def:"a short coat", ex:"Do you have this jacket in a smaller size?" },
    { theme:"Clothes", icon:"👕", word:"t-shirt", def:"a casual top with short sleeves", ex:"This T-shirt is on sale." },
    { theme:"Clothes", icon:"👖", word:"jeans", def:"denim trousers", ex:"These jeans fit perfectly." },
    { theme:"Clothes", icon:"🧦", word:"socks", def:"clothing for your feet", ex:"How many pairs of socks do you need?" },
    { theme:"Clothes", icon:"🏷️", word:"fitting room", def:"place to try clothes on", ex:"The fitting rooms are at the back." },

    { theme:"Shoes", icon:"👟", word:"sneakers", def:"casual sports shoes", ex:"I’m looking for comfortable sneakers." },
    { theme:"Shoes", icon:"👠", word:"heels", def:"shoes with high heels", ex:"These heels are elegant but not very comfortable." },
    { theme:"Shoes", icon:"🥾", word:"boots", def:"shoes that cover the ankle/leg", ex:"Do you have these boots in black?" },
    { theme:"Shoes", icon:"📏", word:"size", def:"a number that indicates fit", ex:"What size are you in US sizes?" },

    { theme:"Arts & Crafts", icon:"🧵", word:"thread", def:"thin strand used for sewing", ex:"I need thread for this project." },
    { theme:"Arts & Crafts", icon:"✂️", word:"scissors", def:"a tool used for cutting", ex:"Where are the scissors?" },
    { theme:"Arts & Crafts", icon:"🖌️", word:"paintbrush", def:"tool for painting", ex:"This paintbrush is perfect for details." },
    { theme:"Arts & Crafts", icon:"🧶", word:"yarn", def:"long strands of fiber for knitting", ex:"How much yarn do I need?" },

    { theme:"Souvenirs", icon:"🧸", word:"souvenir", def:"something you buy to remember a place", ex:"I’d like a small souvenir." },
    { theme:"Souvenirs", icon:"🧲", word:"fridge magnet", def:"a small magnet for a refrigerator", ex:"These fridge magnets are cute!" },
    { theme:"Souvenirs", icon:"📮", word:"postcard", def:"a card you send by mail", ex:"I’m buying postcards for my friends." },
    { theme:"Souvenirs", icon:"🎁", word:"gift wrap", def:"paper used to wrap a present", ex:"Could you gift-wrap this, please?" },

    { theme:"Electronics", icon:"📱", word:"smartphone", def:"a mobile phone with apps", ex:"I’m comparing smartphones." },
    { theme:"Electronics", icon:"🔌", word:"charger", def:"device for charging a battery", ex:"Do you sell phone chargers?" },
    { theme:"Electronics", icon:"🎧", word:"headphones", def:"audio device you wear on your head", ex:"These headphones have noise cancellation." },
    { theme:"Electronics", icon:"🔋", word:"battery", def:"power source for devices", ex:"How many batteries are in the pack?" },

    { theme:"Furniture", icon:"🛋️", word:"sofa", def:"a comfortable couch", ex:"That sofa is too big for my living room." },
    { theme:"Furniture", icon:"🪑", word:"chair", def:"a seat with a back", ex:"I’d like a chair for my desk." },
    { theme:"Furniture", icon:"🛏️", word:"bed frame", def:"structure that supports a mattress", ex:"Is the bed frame in stock?" },
    { theme:"Furniture", icon:"📦", word:"delivery", def:"bringing items to your home", ex:"How much is delivery?" },

    { theme:"Decoration", icon:"🕯️", word:"candle", def:"wax light source", ex:"These candles smell amazing." },
    { theme:"Decoration", icon:"🖼️", word:"frame", def:"border for a picture", ex:"I’m buying a frame for this photo." },
    { theme:"Decoration", icon:"🌿", word:"plant", def:"a living decorative plant", ex:"This plant needs a lot of light." },
    { theme:"Decoration", icon:"🪞", word:"mirror", def:"a reflective surface", ex:"Do you have a round mirror?" },

    { theme:"In the Shop", icon:"🏷️", word:"on sale", def:"discounted", ex:"Is this on sale today?" },
    { theme:"In the Shop", icon:"🧾", word:"receipt", def:"proof of purchase", ex:"Could I have a receipt, please?" },
    { theme:"In the Shop", icon:"💳", word:"pay by card", def:"use a bank card to pay", ex:"Can I pay by card?" },
    { theme:"In the Shop", icon:"💵", word:"cash", def:"money (banknotes/coins)", ex:"I only have cash." },
  ];

  function getThemes() {
    const set = new Set(vocabData.map(v => v.theme));
    return Array.from(set);
  }

  function renderVocabTabs() {
    const tabs = $("#vocabTabs");
    tabs.innerHTML = "";
    const themes = ["All", ...getThemes()];
    themes.forEach((t, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tab" + (idx === 0 ? " is-active" : "");
      b.textContent = t;
      b.dataset.theme = t;
      b.addEventListener("click", () => {
        $$(".tab", tabs).forEach(x => x.classList.remove("is-active"));
        b.classList.add("is-active");
        renderFlashcards(t === "All" ? null : t);
      });
      tabs.appendChild(b);
    });
  }

  function flashcardHTML(item) {
    // FRONT: icon + word (quick)
    // BACK: definition + example (what you requested)
    return `
      <div class="flashcard" data-word="${item.word}">
        <div class="flashcard__inner" role="button" tabindex="0" aria-label="Flashcard: ${item.word}">
          <div class="flashcard__face flashcard__front">
            <div class="fcTop">
              <span class="badge">${item.theme}</span>
              <span class="icon" aria-hidden="true">${item.icon}</span>
            </div>

            <div>
              <div class="word">${item.word}</div>
              <div class="muted" style="font-weight:800;">(Click to flip)</div>
            </div>

            <div class="fcBtns">
              <button class="iconBtn" data-speak-word="1" type="button" aria-label="Listen: ${item.word}">🔊 Word</button>
            </div>
          </div>

          <div class="flashcard__face flashcard__back">
            <div class="fcTop">
              <span class="badge">Meaning + Example</span>
              <span class="icon" aria-hidden="true">🗣️</span>
            </div>

            <div>
              <div class="def"><strong>Definition:</strong> ${item.def}</div>
              <div class="ex" data-example="1"><strong>Example:</strong> ${item.ex}</div>
            </div>

            <div class="fcBtns">
              <button class="iconBtn" data-speak-example="1" type="button" aria-label="Listen example">🔊 Example</button>
              <button class="iconBtn" data-flip-back="1" type="button" aria-label="Flip back">↩️ Back</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderFlashcards(themeOrNull) {
    const grid = $("#flashcardGrid");
    const data = themeOrNull ? vocabData.filter(v => v.theme === themeOrNull) : vocabData.slice();
    grid.innerHTML = data.map(flashcardHTML).join("");

    const showEx = state.toggleExamples;
    $$(".flashcard .ex", grid).forEach(ex => {
      ex.style.display = showEx ? "" : "none";
    });

    // Flip handling
    $$(".flashcard__inner", grid).forEach(inner => {
      const wrapper = inner.closest(".flashcard");
      const flip = () => {
        wrapper.classList.toggle("is-flipped");
        inner.classList.toggle("is-flipped");
      };

      inner.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        flip();
      });

      inner.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      });
    });

    // Speak buttons
    $$(".iconBtn[data-speak-word]", grid).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".flashcard");
        speak(card?.dataset.word || "");
      });
    });

    $$(".iconBtn[data-speak-example]", grid).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".flashcard");
        const word = card?.dataset.word || "";
        const item = vocabData.find(v => v.word === word);
        if (item) speak(item.ex);
      });
    });

    $$(".iconBtn[data-flip-back]", grid).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".flashcard");
        card?.classList.remove("is-flipped");
        card?.querySelector(".flashcard__inner")?.classList.remove("is-flipped");
      });
    });
  }

  /* =========================================================
     Reusable MCQ renderer
  ========================================================= */
  function renderMCQ(containerId, quizIdPrefix, questions, feedbackId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    registerPoints(`mcq-${containerId}`, questions.length);

    root.innerHTML = questions.map((q, idx) => {
      const qid = `${quizIdPrefix}-${idx}`;
      return `
        <div class="q" data-qid="${qid}" data-correct="${q.correct}">
          <div class="q__prompt">${q.prompt}</div>
          <div class="opts">
            ${q.options.map((opt, oi) => `
              <button class="opt" type="button" data-opt="${oi}">
                ${opt}
              </button>
            `).join("")}
          </div>
          <div class="muted" style="margin-top:.45rem; font-weight:700;">${q.explain || ""}</div>
        </div>
      `;
    }).join("");

    $$(".opt", root).forEach(btn => {
      btn.addEventListener("click", () => {
        const qEl = btn.closest(".q");
        if (!qEl || qEl.dataset.locked === "1") return;

        const correct = Number(qEl.dataset.correct);
        const chosen = Number(btn.dataset.opt);

        qEl.dataset.locked = "1";
        const opts = $$(".opt", qEl);
        opts.forEach(o => (o.disabled = true));

        if (chosen === correct) {
          btn.classList.add("is-correct");
          const activityId = `mcq-${containerId}-${qEl.dataset.qid}`;
          defineActivityPoints(activityId, 1);
          award(activityId, 1);
          showFeedback(feedbackId, "✅ Correct!", true);
        } else {
          btn.classList.add("is-wrong");
          opts[correct]?.classList.add("is-correct");
          showFeedback(feedbackId, "❌ Not quite — check the explanation.", false);
        }
      });
    });
  }

  function resetMCQ(containerId, feedbackId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    $$(".q", root).forEach(qEl => {
      qEl.dataset.locked = "";
      $$(".opt", qEl).forEach(o => {
        o.disabled = false;
        o.classList.remove("is-correct", "is-wrong");
      });

      const qid = qEl.dataset.qid;
      const activityId = `mcq-${containerId}-${qid}`;
      if (state.awarded.has(activityId)) state.awarded.delete(activityId);
    });

    recomputeScoreNow();
    if (feedbackId) showFeedback(feedbackId, "Reset ✅", true, 900);
  }

  /* =========================================================
     Drag & Drop helpers (bank/zone)
  ========================================================= */
  function makeDraggableChip(text, id) {
    const el = document.createElement("div");
    el.className = "dd-chip";
    el.textContent = text;
    el.draggable = true;
    el.dataset.id = id;
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
    });
    return el;
  }

  function enableDropZone(zone) {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("is-over");
      e.dataTransfer.dropEffect = "move";
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("is-over");
      const id = e.dataTransfer.getData("text/plain");
      const chip = document.querySelector(`.dd-chip[data-id="${CSS.escape(id)}"]`);
      if (chip) zone.appendChild(chip);
    });
  }

  /* =========================================================
     HM/HM Drag & Drop (fixed target stored on creation)
  ========================================================= */
  const hmhmItems = [
    { text:"___ money is it?", target:"howmuch" },
    { text:"___ shoes do you want?", target:"howmany" },
    { text:"___ water do you need?", target:"howmuch" },
    { text:"___ batteries are in the pack?", target:"howmany" },
    { text:"___ cheese is there?", target:"howmuch" },
    { text:"___ postcards are you buying?", target:"howmany" },
    { text:"___ time do we have?", target:"howmuch" },
    { text:"___ pairs of socks?", target:"howmany" },
  ];

  function initHMHMDrag() {
    const bank = $("#ddHMHM_bank");
    const zMuch = $("#ddHMHM_much");
    const zMany = $("#ddHMHM_many");
    if (!bank || !zMuch || !zMany) return;

    bank.innerHTML = "";
    zMuch.innerHTML = "";
    zMany.innerHTML = "";

    shuffle(hmhmItems).forEach((it, idx) => {
      const chip = makeDraggableChip(it.text, `hmhm-${idx}`);
      chip.dataset.target = it.target;
      bank.appendChild(chip);
    });

    enableDropZone(bank);
    enableDropZone(zMuch);
    enableDropZone(zMany);
  }

  function checkHMHMDrag() {
    const zMuch = $("#ddHMHM_much");
    const zMany = $("#ddHMHM_many");

    const total = hmhmItems.length;
    let correct = 0;

    $$(".dd-chip", zMuch).forEach(ch => { if (ch.dataset.target === "howmuch") correct++; });
    $$(".dd-chip", zMany).forEach(ch => { if (ch.dataset.target === "howmany") correct++; });

    registerPoints("dd-hmhm", 4);

    if (correct === total) {
      const id = "dd-hmhm-perfect";
      defineActivityPoints(id, 4);
      award(id, 4);
      showFeedback("fbHMHM", `✅ Perfect! ${correct}/${total}`, true);
    } else {
      showFeedback("fbHMHM", `❌ ${correct}/${total} — keep going!`, false);
    }
  }

  /* =========================================================
     Prepositions builder
  ========================================================= */
  const prepChips = ["on", "by", "at", "in", "for"];
  const prepSolution = ["on", "by", "at"]; // slots 0,1,2

  function initPrepBuilder() {
    const chips = $("#chipsPrep");
    const slots = $$(".slot");
    chips.innerHTML = "";
    slots.forEach(s => (s.textContent = "_____"));

    shuffle(prepChips).forEach((t) => {
      const ch = document.createElement("div");
      ch.className = "chip";
      ch.textContent = t;
      ch.draggable = true;
      ch.dataset.word = t;
      ch.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", t);
        e.dataTransfer.effectAllowed = "move";
      });
      chips.appendChild(ch);
    });

    slots.forEach(slot => {
      slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.style.boxShadow = "var(--focus)"; });
      slot.addEventListener("dragleave", () => { slot.style.boxShadow = ""; });
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        slot.style.boxShadow = "";
        const w = e.dataTransfer.getData("text/plain");
        if (w) slot.textContent = w;
      });
    });
  }

  function checkPrepBuilder() {
    const got = $$(".slot").map(s => s.textContent.trim());
    const ok = got[0] === prepSolution[0] && got[1] === prepSolution[1] && got[2] === prepSolution[2];

    registerPoints("prep-builder", 2);
    const id = "prep-builder-ok";
    defineActivityPoints(id, 2);

    if (ok) {
      award(id, 2);
      showFeedback("fbPrepBuilder", "✅ Correct! “on sale”, “by card”, “at the counter”.", true);
    } else {
      showFeedback("fbPrepBuilder", "❌ Not quite. Tip: “on sale”, “by card”, “at the counter”.", false);
    }
  }

  /* =========================================================
     Present simple vs continuous: Sentence Order (FIXED)
     Bank → Answer (reliable)
  ========================================================= */
  const tenseOrderSolution = "I am looking for a jacket right now.";

  function initTenseOrder() {
    const wrap = $("#orderTense");
    if (!wrap) return;

    wrap.innerHTML = `
      <div>
        <div class="orderZoneTitle">Bank</div>
        <div class="orderHint">Drag from here…</div>
        <div class="orderBank" id="orderTense_bank"></div>
      </div>
      <div>
        <div class="orderZoneTitle">Answer</div>
        <div class="orderHint">…drop here in the correct order. (Tip: click a chunk in Answer to send it back.)</div>
        <div class="orderAnswer" id="orderTense_answer"></div>
      </div>
    `;

    const bank = $("#orderTense_bank");
    const ans = $("#orderTense_answer");

    const chunks = shuffle(["I am", "looking for", "a jacket", "right now."]);
    chunks.forEach((t, i) => {
      const chip = makeDraggableChip(t, `tense-${i}`);
      bank.appendChild(chip);
    });

    enableDropZone(bank);
    enableDropZone(ans);

    // click to send back (easy reordering)
    wrap.addEventListener("click", (e) => {
      const chip = e.target.closest(".dd-chip");
      if (!chip) return;
      const inAnswer = chip.closest("#orderTense_answer");
      if (inAnswer) bank.appendChild(chip);
    });
  }

  function checkTenseOrder() {
    const ans = $("#orderTense_answer");
    const bank = $("#orderTense_bank");
    if (!ans || !bank) return;

    const answerChunks = $$(".dd-chip", ans).map(c => c.textContent);
    const sentence = normalizeSpaces(answerChunks.join(" "));

    if (answerChunks.length < 4) {
      showFeedback("fbOrderTense", "⚠️ Put all 4 chunks into the Answer area.", false);
      return;
    }

    const ok = sentence === normalizeSpaces(tenseOrderSolution);

    registerPoints("tense-order", 2);
    const id = "tense-order-ok";
    defineActivityPoints(id, 2);

    if (ok) {
      award(id, 2);
      showFeedback("fbOrderTense", "✅ Great! Present continuous for “right now”.", true);
      speak(sentence);
    } else {
      showFeedback("fbOrderTense", `❌ Try again. Target: “${tenseOrderSolution}”`, false);
    }
  }

  /* =========================================================
     Polite builder
  ========================================================= */
  const politeWords = ["Could", "I", "try", "this", "jacket", "on", "please?"];
  const politeTarget = "Could I try this jacket on please?";

  function initPoliteBuilder() {
    const chips = $("#chipsPolite");
    const line = $("#politeLine");
    chips.innerHTML = "";
    line.innerHTML = "";

    shuffle(politeWords).forEach(w => {
      const ch = document.createElement("div");
      ch.className = "chip";
      ch.textContent = w;
      ch.draggable = true;
      ch.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", w);
        e.dataTransfer.effectAllowed = "move";
      });
      chips.appendChild(ch);
    });

    line.addEventListener("dragover", (e) => { e.preventDefault(); line.style.boxShadow = "var(--focus)"; });
    line.addEventListener("dragleave", () => (line.style.boxShadow = ""));
    line.addEventListener("drop", (e) => {
      e.preventDefault();
      line.style.boxShadow = "";
      const w = e.dataTransfer.getData("text/plain");
      if (!w) return;
      const token = document.createElement("span");
      token.className = "badge";
      token.style.marginRight = ".3rem";
      token.textContent = w;
      line.appendChild(token);
    });
  }

  function politeLineText() {
    const words = $$(".badge", $("#politeLine")).map(b => b.textContent);
    return normalizeSpaces(words.join(" "));
  }

  function checkPoliteBuilder() {
    const built = politeLineText();
    const ok = built === normalizeSpaces(politeTarget);

    registerPoints("polite-builder", 2);
    const id = "polite-builder-ok";
    defineActivityPoints(id, 2);

    if (ok) {
      award(id, 2);
      showFeedback("fbPoliteBuilder", "✅ Perfect polite request!", true);
    } else {
      showFeedback("fbPoliteBuilder", "❌ Not quite. Tip: start with “Could I…?” and end with “please?”", false);
    }
  }

  /* =========================================================
     Dialogues (unchanged logic)
  ========================================================= */
  const dialogueScenes = [
    {
      key: "clothing",
      label: "👗 Clothing store",
      steps: [
        { who:"clerk", text:"Hi there! Can I help you find something?" },
        { who:"you", choices:{
            polite:["Yes, please. I’m looking for a jacket.","Could you help me find a jacket, please?"],
            casual:["Yeah, I’m looking for a jacket.","I need a jacket."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"Sure! What size are you?" },
        { who:"you", choices:{
            polite:["I’m usually a medium. May I try this on?","I’m a medium. Could I try it on, please?"],
            casual:["Medium. Can I try it?","I’m medium."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"Of course — the fitting rooms are at the back, next to the mirrors." },
        { who:"you", choices:{
            polite:["Thank you! If it doesn’t fit, may I exchange it?","Thanks! What’s your exchange policy?"],
            casual:["Thanks. Can I exchange it?","Okay."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"Yes. Keep the receipt and the tags on. Have a great day!" }
      ]
    },
    {
      key: "electronics",
      label: "📱 Electronics shop",
      steps: [
        { who:"clerk", text:"Hello! Are you looking for a phone or accessories today?" },
        { who:"you", choices:{
            polite:["I’d like to compare smartphones, please.","Could you show me your best-value smartphone, please?"],
            casual:["I’m looking at phones.","Show me phones."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"Absolutely. What features matter most to you?" },
        { who:"you", choices:{
            polite:["Battery life and a good camera. How much is this one?","I care about battery life. How much does it cost?"],
            casual:["Battery and camera. How much?","Price?"]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"This model is $499 today, and it comes with a charger." },
        { who:"you", choices:{
            polite:["Great. Can I pay by card? And could I get a receipt?","Perfect. May I pay by card, please?"],
            casual:["I’ll pay by card.","Receipt."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"Of course. Please tap your card right here." }
      ]
    },
    {
      key: "souvenir",
      label: "🧸 Souvenir stand",
      steps: [
        { who:"clerk", text:"Hi! Looking for gifts or something small?" },
        { who:"you", choices:{
            polite:["Yes, please. I’m looking for a small souvenir.","Could you recommend a popular souvenir, please?"],
            casual:["I want a souvenir.","I need a gift."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"These magnets and postcards are best-sellers." },
        { who:"you", choices:{
            polite:["How many postcards come in a pack?","Could I see the postcards, please?"],
            casual:["How many are in there?","Let me see those."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"There are ten postcards in a pack." },
        { who:"you", choices:{
            polite:["I’ll take one pack, please. Could you gift-wrap it?","Great. I’ll take it, please."],
            casual:["I’ll take it.","Wrap it."]
        }, good:{polite:1, casual:0}},
        { who:"clerk", text:"Sure! That’ll be €8. Would you like a receipt?" }
      ]
    }
  ];

  const dialogueState = {
    sceneKey: "clothing",
    register: "polite",
    stepIndex: 0,
    lastLine: ""
  };

  function renderDialogueTabs() {
    const tabs = $("#dialogueTabs");
    tabs.innerHTML = "";
    dialogueScenes.forEach((s, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tab" + (idx === 0 ? " is-active" : "");
      b.textContent = s.label;
      b.dataset.scene = s.key;
      b.addEventListener("click", () => {
        $$(".tab", tabs).forEach(x => x.classList.remove("is-active"));
        b.classList.add("is-active");
        dialogueState.sceneKey = s.key;
        restartDialogue();
      });
      tabs.appendChild(b);
    });

    $$(".pill__btn[data-register]").forEach(btn => {
      btn.addEventListener("click", () => {
        const r = btn.dataset.register;
        dialogueState.register = r;
        $$(".pill__btn[data-register]").forEach(x => {
          const on = x.dataset.register === r;
          x.classList.toggle("is-active", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });
        restartDialogue();
      });
    });

    $("#btnRestartDialogue").addEventListener("click", restartDialogue);
    $("#btnSpeakDialogue").addEventListener("click", () => {
      if (dialogueState.lastLine) speak(dialogueState.lastLine);
    });
  }

  function getScene() {
    return dialogueScenes.find(s => s.key === dialogueState.sceneKey) || dialogueScenes[0];
  }

  function restartDialogue() {
    dialogueState.stepIndex = 0;
    showFeedback("fbDialogue", "", true);
    renderDialogue();
  }

  function addLine(who, text, cls, box) {
    const line = document.createElement("div");
    line.className = "line";
    line.innerHTML = `
      <div class="who">${who}</div>
      <div class="bubble ${cls}">${text}</div>
    `;
    box.appendChild(line);
  }

  function renderDialogue() {
    const box = $("#dialogueBox");
    const choicesBox = $("#dialogueChoices");
    box.innerHTML = "";
    choicesBox.innerHTML = "";

    const scene = getScene();
    const steps = scene.steps;
    const register = dialogueState.register;

    for (let i = 0; i <= dialogueState.stepIndex; i++) {
      const step = steps[i];
      if (!step) break;

      if (step.who === "clerk") {
        addLine("Clerk", step.text, "clerk", box);
        dialogueState.lastLine = step.text;
      } else if (step.who === "you" && step.selectedText) {
        addLine("You", step.selectedText, "you", box);
        dialogueState.lastLine = step.selectedText;
      } else if (step.who === "you" && step.choices && i === dialogueState.stepIndex) {
        const options = step.choices[register] || [];
        options.forEach((t) => {
          const c = document.createElement("button");
          c.type = "button";
          c.className = "choice";
          c.textContent = t;
          c.addEventListener("click", () => {
            registerPoints("dialogue-choices", 3);

            step.selectedText = t;
            dialogueState.lastLine = t;

            const activityId = `dlg-${scene.key}-${i}-${register}`;
            defineActivityPoints(activityId, 1);

            if (register === "polite") {
              award(activityId, 1);
              showFeedback("fbDialogue", "✅ Nice — polite and natural.", true, 1200);
            } else {
              showFeedback("fbDialogue", "ℹ️ Casual works, but polite is best in shops.", true, 1400);
            }

            dialogueState.stepIndex++;
            renderDialogue();
          });
          choicesBox.appendChild(c);
        });
      }
    }

    const current = steps[dialogueState.stepIndex];
    if (current && current.who === "clerk") {
      dialogueState.stepIndex++;
      if (dialogueState.stepIndex >= steps.length) {
        showFeedback("fbDialogue", "🎉 Dialogue complete! Try again in the other register.", true);
      } else {
        renderDialogue();
      }
    } else if (!current) {
      showFeedback("fbDialogue", "🎉 Dialogue complete! Try another scene.", true);
    }
  }

  /* =========================================================
     Culture cards (same as before)
  ========================================================= */
  const cultureCards = [
    { title:"Sizes (UK vs US vs EU) 👟👗", tags:["UK/US","Practical"],
      uk:"UK shoe sizes are usually smaller numbers than US (women’s). Ask: “Do you have a conversion chart?”",
      us:"US sizes differ from EU. In big stores, staff may instantly convert EU↔US for you.",
      fr:"In France, EU sizing is standard. Abroad, don’t guess — ask politely and check the tag." },
    { title:"Money & price language 💷💵€", tags:["UK/US","Numbers"],
      uk:"You’ll see pounds (£). People say: “It’s twenty pounds.”",
      us:"You’ll see dollars ($). People say: “It’s twenty bucks.” (informal)",
      fr:"In France, € is common and receipts are often offered; in US/UK you’ll be asked if you want one." },
    { title:"Payment methods 💳📱", tags:["UK/US","Etiquette"],
      uk:"Contactless is very common. You may hear: “Tap your card.”",
      us:"Cards + phone pay are common. Some places still prefer card over cash (varies).",
      fr:"In France, contactless is common too. In the US, tipping culture exists in many services (not typical in retail shops)." },
    { title:"Opening hours ⏰", tags:["UK/US","Planning"],
      uk:"Many shops close earlier on Sundays depending on the area.",
      us:"Malls can stay open late, but hours vary a lot by city and day.",
      fr:"In France, smaller shops may close for lunch; Sundays can be limited depending on rules and location." }
  ];

  function renderCulture() {
    const grid = $("#cultureGrid");
    grid.innerHTML = cultureCards.map(c => `
      <div class="culture">
        <div class="culture__title">
          <h3>${c.title}</h3>
          <div class="culture__tags">
            ${c.tags.map(t => `<span class="tag">${t}</span>`).join("")}
          </div>
        </div>
        <div class="culture__cols">
          <div class="k"><h4>🇬🇧 UK</h4><p>${c.uk}</p></div>
          <div class="k"><h4>🇺🇸 US</h4><p>${c.us}</p></div>
        </div>
        <div class="k" style="margin-top:.75rem;">
          <h4>🇫🇷 France (quick comparison)</h4><p>${c.fr}</p>
        </div>
        <div class="row">
          <button class="btn btn--ghost btn--small" type="button" data-speak-culture="${c.title}">🔊 Listen</button>
        </div>
      </div>
    `).join("");

    $$("[data-speak-culture]").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.dataset.speakCulture || "";
        const card = cultureCards.find(x => x.title === title);
        if (card) speak(`${card.title}. UK: ${card.uk}. US: ${card.us}. France: ${card.fr}.`);
      });
    });
  }

  /* =========================================================
     Store match DD
  ========================================================= */
  const storeItems = [
    { text:"👗 a dress", store:"clothing" },
    { text:"🧥 a jacket", store:"clothing" },
    { text:"👟 sneakers", store:"clothing" },
    { text:"📱 a smartphone", store:"electronics" },
    { text:"🎧 headphones", store:"electronics" },
    { text:"🔌 a charger", store:"electronics" },
    { text:"🧲 a fridge magnet", store:"souvenir" },
    { text:"📮 a postcard", store:"souvenir" },
    { text:"🎁 gift wrap", store:"souvenir" },
  ];

  function initStoreDD() {
    const bank = $("#ddStore_bank");
    const zC = $("#ddStore_clothing");
    const zE = $("#ddStore_electronics");
    const zS = $("#ddStore_souvenir");
    if (!bank || !zC || !zE || !zS) return;

    [bank, zC, zE, zS].forEach(z => z.innerHTML = "");

    shuffle(storeItems).forEach((it, idx) => {
      const ch = makeDraggableChip(it.text, `store-${idx}`);
      ch.dataset.store = it.store;
      bank.appendChild(ch);
    });

    enableDropZone(bank);
    enableDropZone(zC);
    enableDropZone(zE);
    enableDropZone(zS);
  }

  function checkStoreDD() {
    const zC = $("#ddStore_clothing");
    const zE = $("#ddStore_electronics");
    const zS = $("#ddStore_souvenir");

    const total = storeItems.length;
    let correct = 0;

    $$(".dd-chip", zC).forEach(ch => { if (ch.dataset.store === "clothing") correct++; });
    $$(".dd-chip", zE).forEach(ch => { if (ch.dataset.store === "electronics") correct++; });
    $$(".dd-chip", zS).forEach(ch => { if (ch.dataset.store === "souvenir") correct++; });

    registerPoints("dd-stores", 3);
    const id = "dd-stores-ok";
    defineActivityPoints(id, 3);

    if (correct === total) {
      award(id, 3);
      showFeedback("fbStores", `✅ Perfect! ${correct}/${total}`, true);
    } else {
      showFeedback("fbStores", `❌ ${correct}/${total}. Tip: chargers/headphones → electronics; postcards/magnets → souvenirs.`, false);
    }
  }

  /* =========================================================
     Hours
  ========================================================= */
  const hoursData = [
    { day:"Monday",   hours:"10:00 – 19:00" },
    { day:"Tuesday",  hours:"10:00 – 19:00" },
    { day:"Wednesday",hours:"10:00 – 19:00" },
    { day:"Thursday", hours:"10:00 – 20:00" },
    { day:"Friday",   hours:"10:00 – 20:00" },
    { day:"Saturday", hours:"10:00 – 20:00" },
    { day:"Sunday",   hours:"11:00 – 18:00" },
  ];

  function renderHoursTable() {
    const body = $("#hoursTableBody");
    body.innerHTML = hoursData.map(r => `
      <tr>
        <td style="font-weight:900;">${r.day}</td>
        <td style="text-align:right; font-weight:850;">${r.hours}</td>
      </tr>
    `).join("");

    $("#btnSpeakHours").addEventListener("click", () => {
      const text = hoursData.map(r => `${r.day}: ${r.hours}`).join(". ");
      speak(`Opening hours. ${text}.`);
    });
  }

  /* =========================================================
     Quizzes data
  ========================================================= */
  const quizHMHM = [
    { prompt:"___ apples are in the bag?", options:["How much", "How many"], correct:1, explain:"Apples are countable." },
    { prompt:"___ is this jacket?", options:["How much", "How many"], correct:0, explain:"Price → uncountable money." },
    { prompt:"___ water do you need?", options:["How much", "How many"], correct:0, explain:"Water is uncountable." },
    { prompt:"___ pairs of socks do you want?", options:["How much", "How many"], correct:1, explain:"Pairs are countable." },
  ];

  const quizPrep = [
    { prompt:"The fitting rooms are ___ the back.", options:["at", "in", "by"], correct:1, explain:"“in the back” is common." },
    { prompt:"These shoes are ___ sale today.", options:["on", "at", "in"], correct:0, explain:"We say “on sale”." },
    { prompt:"You can pay ___ card.", options:["for", "by", "at"], correct:1, explain:"We say “by card”." },
    { prompt:"Please meet me ___ the counter.", options:["in", "at", "on"], correct:1, explain:"We say “at the counter”." },
  ];

  const quizTenses = [
    { prompt:"Right now, I ___ for a new phone.", options:["look", "am looking"], correct:1, explain:"“Right now” → present continuous." },
    { prompt:"I usually ___ by card.", options:["pay", "am paying"], correct:0, explain:"Habit → present simple." },
    { prompt:"She ___ the price tag at the moment.", options:["checks", "is checking"], correct:1, explain:"At the moment → continuous." },
    { prompt:"They often ___ gifts here.", options:["buy", "are buying"], correct:0, explain:"Often → simple." },
  ];

  const quizPolite = [
    { prompt:"You want to see a smaller size. Choose the most polite:", options:[
      "Show me a smaller size.",
      "Can you show me a smaller size?",
      "May I see a smaller size, please?"
    ], correct:2, explain:"“May I… please?” is very polite." },
    { prompt:"You want to try on a jacket. Choose the most polite:", options:[
      "I want to try this on.",
      "Could I try this on, please?",
      "Give me the fitting room."
    ], correct:1, explain:"“Could I… please?” is polite and natural." },
    { prompt:"You want help finding something. Choose the most polite:", options:[
      "I need help.",
      "Help me.",
      "Could you help me find this, please?"
    ], correct:2, explain:"Use “Could you… please?”" },
    { prompt:"You want a receipt. Choose the most polite:", options:[
      "Receipt.",
      "Can I have a receipt?",
      "Could I have a receipt, please?"
    ], correct:2, explain:"Add “Could I… please?”" },
  ];

  const hoursQuiz = [
    { prompt:"It’s Tuesday at 18:30. Is the shop open?", options:["Open", "Closed"], correct:0,
      explain:"Tuesday closes at 19:00 → open at 18:30." },
    { prompt:"It’s Sunday at 10:30. Is the shop open?", options:["Open", "Closed"], correct:1,
      explain:"Sunday opens at 11:00 → closed at 10:30." },
    { prompt:"It’s Thursday at 19:30. Is the shop open?", options:["Open", "Closed"], correct:0,
      explain:"Thursday closes at 20:00 → open at 19:30." },
    { prompt:"It’s Monday at 19:05. Is the shop open?", options:["Open", "Closed"], correct:1,
      explain:"Monday closes at 19:00 → closed at 19:05." },
  ];

  /* =========================================================
     Reset + binds
  ========================================================= */
  function bindSectionSpeakButtons() {
    $$("[data-speak]").forEach(btn => {
      btn.addEventListener("click", () => {
        const el = $(btn.dataset.speak);
        if (el) speak(el.textContent);
      });
    });
  }

  function bindResetButtons() {
    $$("[data-reset-quiz]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.resetQuiz;
        const fb = {
          "quizHMHM": "fbQuizHMHM",
          "quizPrep": "fbQuizPrep",
          "quizTenses": "fbQuizTenses",
          "quizPolite": "fbQuizPolite",
          "quizHours": "fbQuizHours"
        }[id] || "";
        resetMCQ(id, fb);
      });
    });

    $("#btnResetHMHM").addEventListener("click", () => {
      ["dd-hmhm-perfect"].forEach(id => state.awarded.delete(id));
      recomputeScoreNow();
      initHMHMDrag();
      showFeedback("fbHMHM", "Reset ✅", true, 900);
    });

    $("#btnCheckHMHM").addEventListener("click", checkHMHMDrag);

    $("#btnCheckPrep").addEventListener("click", checkPrepBuilder);
    $("#btnResetPrepBuilder").addEventListener("click", () => {
      state.awarded.delete("prep-builder-ok");
      recomputeScoreNow();
      initPrepBuilder();
      showFeedback("fbPrepBuilder", "Reset ✅", true, 900);
    });

    $("#btnCheckOrderTense").addEventListener("click", checkTenseOrder);
    $("#btnResetOrderTense").addEventListener("click", () => {
      state.awarded.delete("tense-order-ok");
      recomputeScoreNow();
      initTenseOrder();
      showFeedback("fbOrderTense", "Reset ✅", true, 900);
    });

    $("#btnCheckPoliteBuilder").addEventListener("click", checkPoliteBuilder);
    $("#btnResetPoliteBuilder").addEventListener("click", () => {
      state.awarded.delete("polite-builder-ok");
      recomputeScoreNow();
      initPoliteBuilder();
      showFeedback("fbPoliteBuilder", "Reset ✅", true, 900);
    });

    $("#btnSpeakPoliteBuilt").addEventListener("click", () => {
      const t = politeLineText();
      speak(t || "Could I try this jacket on, please?");
    });

    $("#btnCheckStores").addEventListener("click", checkStoreDD);
    $("#btnResetStores").addEventListener("click", () => {
      state.awarded.delete("dd-stores-ok");
      recomputeScoreNow();
      initStoreDD();
      showFeedback("fbStores", "Reset ✅", true, 900);
    });
  }

  function resetAll() {
    state.awarded = new Set(Array.from(state.awarded).filter(id => id.startsWith("__max__")));
    recomputeScoreNow();

    renderFlashcards(null);
    initHMHMDrag();
    initPrepBuilder();
    initTenseOrder();
    initPoliteBuilder();
    initStoreDD();

    resetMCQ("quizHMHM", "fbQuizHMHM");
    resetMCQ("quizPrep", "fbQuizPrep");
    resetMCQ("quizTenses", "fbQuizTenses");
    resetMCQ("quizPolite", "fbQuizPolite");
    resetMCQ("quizHours", "fbQuizHours");

    restartDialogue();
    stopSpeak();
  }

  /* =========================================================
     Init
  ========================================================= */
  function init() {
    // Set default (no theme switching UI)
    document.documentElement.setAttribute("data-accent", "teal");
    setVoice("US");

    setScoreText();
    bindTopBar();

    renderVocabTabs();
    renderFlashcards(null);

    $("#toggleExamples").addEventListener("change", (e) => {
      state.toggleExamples = !!e.target.checked;
      const active = $(".tab.is-active", $("#vocabTabs"));
      const theme = active?.dataset.theme || "All";
      renderFlashcards(theme === "All" ? null : theme);
    });

    initHMHMDrag();
    initPrepBuilder();
    initTenseOrder();
    initPoliteBuilder();

    renderMCQ("quizHMHM", "hmhm", quizHMHM, "fbQuizHMHM");
    renderMCQ("quizPrep", "prep", quizPrep, "fbQuizPrep");
    renderMCQ("quizTenses", "tenses", quizTenses, "fbQuizTenses");
    renderMCQ("quizPolite", "polite", quizPolite, "fbQuizPolite");

    renderHoursTable();
    renderMCQ("quizHours", "hours", hoursQuiz, "fbQuizHours");

    renderDialogueTabs();
    restartDialogue();

    renderCulture();
    initStoreDD();

    bindSectionSpeakButtons();
    bindResetButtons();

    // totals
    registerPoints("dd-hmhm", 4);
    registerPoints("prep-builder", 2);
    registerPoints("tense-order", 2);
    registerPoints("polite-builder", 2);
    registerPoints("dd-stores", 3);
    registerPoints("dialogue-choices", 3);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
