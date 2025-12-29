/* London vs New York – Advanced Lesson JS (page JS)
   - Quiz engine (instant feedback + score + reset)
   - Matching check
   - Dialogue builders
   - Text-to-speech (speechSynthesis)
   - Writing tools + wordcount + self-check
   - 2-minute timer
*/
(function () {
  // HERO image per page (set via <body data-hero-image="...">)
  try {
    const heroPath = document.body?.dataset?.heroImage;
    if (heroPath) {
      const heroEl = document.querySelector(".cvn-hero");
      const cardImg = document.querySelector(".cvn-hero-image");
      if (heroEl) heroEl.style.setProperty("--cvn-hero-url", `url('${heroPath}')`);
      if (cardImg) cardImg.style.setProperty("--cvn-hero-url", `url('${heroPath}')`);
    }
  } catch (e) {}

  // Quiz engine
  const quizEls = Array.from(document.querySelectorAll(".cvn-quiz"));

  function initQuiz(quizEl) {
    const qEls = Array.from(quizEl.querySelectorAll(".cvn-q"));
    const quizId = quizEl.getAttribute("data-quiz") || "quiz";

    const correctNode = quizEl.querySelector(`[data-score="${quizId}-correct"]`);
    const totalNode = quizEl.querySelector(`[data-score="${quizId}-total"]`);
    const finalNode = quizEl.querySelector(`[data-score="${quizId}-final"]`);

    const total = qEls.length;
    if (totalNode) totalNode.textContent = String(total);

    const state = { answered: new Set(), correct: 0 };

    function updateScoreUI() {
      if (correctNode) correctNode.textContent = String(state.correct);
    }

    function markAnswered(qEl, isCorrect, pickedBtn, correctOpt) {
      const buttons = Array.from(qEl.querySelectorAll("button[data-opt]"));
      buttons.forEach((b) => (b.disabled = true));

      if (pickedBtn) pickedBtn.classList.add(isCorrect ? "is-correct" : "is-wrong");

      buttons.forEach((b) => {
        if (b.getAttribute("data-opt") === correctOpt) b.classList.add("is-correct");
      });

      const feedback = qEl.querySelector(".cvn-feedback");
      const hint = qEl.getAttribute("data-hint") || "";
      if (feedback) feedback.textContent = isCorrect ? "✅ Correct." : `❌ Not quite. Hint: ${hint}`;
    }

    qEls.forEach((qEl) => {
      const correctOpt = qEl.getAttribute("data-correct");
      const buttons = Array.from(qEl.querySelectorAll("button[data-opt]"));

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          if (state.answered.has(qEl)) return;
          const picked = btn.getAttribute("data-opt");
          const isCorrect = picked === correctOpt;

          state.answered.add(qEl);
          if (isCorrect) state.correct += 1;

          markAnswered(qEl, isCorrect, btn, correctOpt);
          updateScoreUI();
        });
      });
    });

    const showBtn = quizEl.querySelector('[data-action="showScore"]');
    const resetBtn = quizEl.querySelector('[data-action="resetQuiz"]');

    if (showBtn) {
      showBtn.addEventListener("click", () => {
        if (!finalNode) return;
        const percent = Math.round((state.correct / total) * 100);
        let msg = `Score: ${state.correct}/${total} (${percent}%). `;
        if (percent >= 90) msg += "Excellent—your nuance is strong.";
        else if (percent >= 75) msg += "Strong—push for even more precision.";
        else if (percent >= 55) msg += "Good base—review hints and retry.";
        else msg += "Reset and try again; focus on hedging and collocations.";
        finalNode.textContent = msg;
      });
    }

    function resetQuiz() {
      state.answered.clear();
      state.correct = 0;
      updateScoreUI();
      if (finalNode) finalNode.textContent = "";

      qEls.forEach((qEl) => {
        const feedback = qEl.querySelector(".cvn-feedback");
        if (feedback) feedback.textContent = "";
        const buttons = Array.from(qEl.querySelectorAll("button[data-opt]"));
        buttons.forEach((b) => {
          b.disabled = false;
          b.classList.remove("is-correct", "is-wrong");
        });
      });
    }

    if (resetBtn) resetBtn.addEventListener("click", resetQuiz);

    updateScoreUI();
  }

  quizEls.forEach(initQuiz);

  // Matching exercise
  const matchWrap = document.getElementById("cvn-match");
  const matchCheck = document.getElementById("cvn-match-check");
  const matchReset = document.getElementById("cvn-match-reset");
  const matchScore = document.getElementById("cvn-match-score");
  const matchTotal = document.getElementById("cvn-match-total");

  function resetMatch() {
    if (!matchWrap) return;
    const rows = Array.from(matchWrap.querySelectorAll(".cvn-match-row"));
    rows.forEach((row) => {
      const sel = row.querySelector("select");
      const fb = row.querySelector(".cvn-mini-feedback");
      if (sel) sel.value = "";
      if (fb) {
        fb.textContent = "";
        fb.classList.remove("ok", "no");
      }
    });
    if (matchScore) matchScore.textContent = "0";
    if (matchTotal) matchTotal.textContent = String(rows.length);
  }

  function checkMatch() {
    if (!matchWrap) return;
    const rows = Array.from(matchWrap.querySelectorAll(".cvn-match-row"));
    let score = 0;
    rows.forEach((row) => {
      const ans = row.getAttribute("data-answer");
      const sel = row.querySelector("select");
      const fb = row.querySelector(".cvn-mini-feedback");
      const val = sel ? sel.value : "";
      const ok = val && val === ans;
      if (ok) score += 1;
      if (fb) {
        fb.textContent = ok ? "✅" : "❌";
        fb.classList.toggle("ok", ok);
        fb.classList.toggle("no", !ok);
      }
    });
    if (matchScore) matchScore.textContent = String(score);
    if (matchTotal) matchTotal.textContent = String(rows.length);
  }

  if (matchCheck) matchCheck.addEventListener("click", checkMatch);
  if (matchReset) matchReset.addEventListener("click", resetMatch);
  resetMatch();

  // Builders
  function hedger(level) {
    if (level === "very cautious") return {lead: "It depends, but ", mid: "in many cases", end: "depending on the context."};
    if (level === "confident (but not absolute)") return {lead: "Overall, ", mid: "often", end: "in most situations."};
    return {lead: "Generally, ", mid: "tends to", end: "depending on the venue."};
  }

  function buildNightOut(form) {
    const city = form.city.value || "London";
    const vibe = form.vibe.value || "laid-back and conversational";
    const priority = form.priority.value || "good atmosphere and live music";
    const area = form.area.value || "a lively central area";
    const timePlan = form.timePlan.value || "start early and keep it relaxed";
    const hedgeLevel = form.hedge.value || "balanced";
    const h = hedger(hedgeLevel);

    const cityTerms = city === "London"
      ? { transport: "the Tube", venue: "pub", order: "order at the bar", etiquette: "buying rounds is common", payLine: "Service charge is sometimes included, so it’s worth checking the bill." }
      : { transport: "the subway", venue: "bar", order: "either order at the bar or get table service", etiquette: "tipping expectations are typically higher", payLine: "In many places, tipping is expected, especially with table service." };

    return `Friend A: So—London or New York for the weekend?
Friend B: ${h.lead}${city} ${h.mid} feels more ${vibe} for a group night out, ${h.end}
Friend A: What kind of area should we choose?
Friend B: Let’s pick ${area}. It’s usually more convenient than going too far out, especially late at night.
Friend A: And what’s the plan?
Friend B: We can ${timePlan}. Priority-wise, let’s focus on ${priority}.
Friend A: How do we get around?
Friend B: We can take ${cityTerms.transport}. It’s often faster than relying on traffic.
Friend A: Any cultural tips?
Friend B: If we go to a ${cityTerms.venue}, people usually ${cityTerms.order}. Also, ${cityTerms.etiquette}.
Friend A: Sounds good. Let’s keep it flexible but organised.
Friend B: Exactly—structured enough to be smooth, flexible enough to be fun.`;
  }

  function buildOrder(form) {
    const city = form.city.value || "London";
    const drink = form.drink.value || "a pint of lager";
    const food = form.food.value || "no food";
    const pay = form.pay.value || "ask to pay now";
    const tone = form.tone.value || "polite and friendly";
    const extra = form.extra.value || "with a quick recommendation request";

    const isLondon = city === "London";
    const server = isLondon ? "Bartender" : "Server";

    const opener = tone === "very concise" ? "Hi." : (tone === "warm and chatty" ? "Hi there! How’s it going?" : "Hello!");

    const extraLine =
      extra === "with a quick recommendation request" ? (isLondon ? "Could you recommend something local?" : "Any local recommendations?")
      : (extra === "mention an allergy politely" ? "Just a quick note: I have a mild allergy—could you tell me what’s in that?" : "Do you have good non-alcoholic options?");

    const foodLine =
      food === "no food" ? "No food for now, thanks."
      : (food === "something small to share" ? "Could we also get something small to share, if you have it?"
         : "We’d like a proper meal as well, if the kitchen is open.");

    const payLine =
      pay === "ask to pay now" ? "Could I pay now, please?"
      : (pay === "ask to open a tab" ? (isLondon ? "Could we start a tab, please?" : "Could we open a tab, please?")
         : (isLondon ? "Could we get the bill when we’re ready?" : "Could we get the check when we’re ready?"));

    const cultureLine = isLondon
      ? "If there’s a service charge included, there’s usually no need to add much extra."
      : "Thanks! Just to confirm—tipping is usually expected here, especially with table service.";

    return `${server}: Hey! What can I get you?
Guest: ${opener} Could I have ${drink}, please?
${server}: Sure. Anything else?
Guest: ${foodLine}
${server}: No problem. Anything you’d like to know?
Guest: ${extraLine}
${server}: Of course.
Guest: ${payLine}
${server}: Absolutely.
Guest: ${cultureLine}`;
  }

  function bindBuilder(formId, outputId, buildFn, resetKey) {
    const form = document.getElementById(formId);
    const output = document.getElementById(outputId);
    if (!form || !output) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      output.value = buildFn(form);
    });

    const resetBtn = form.querySelector(`[data-reset="${resetKey}"]`);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        output.value = "";
      });
    }
  }

  bindBuilder("cvn-night-form", "cvn-night-output", buildNightOut, "cvn-night");
  bindBuilder("cvn-order-form", "cvn-order-output", buildOrder, "cvn-order");

  // TTS
  // Accent switch (UK / US) + reliable English voice selection
  const CVN_ACCENT_KEY = "cvnAccent";
  const CVN_DEFAULT_ACCENT = "en-GB"; // default for London vs NYC page

  function getAccent() {
    try {
      return localStorage.getItem(CVN_ACCENT_KEY) || CVN_DEFAULT_ACCENT;
    } catch (e) {
      return CVN_DEFAULT_ACCENT;
    }
  }

  function setAccent(lang) {
    try {
      localStorage.setItem(CVN_ACCENT_KEY, lang);
    } catch (e) {}
    updateAccentUI();
  }

  let cvnVoices = [];

  function loadVoices() {
    if (!("speechSynthesis" in window)) return [];
    cvnVoices = window.speechSynthesis.getVoices() || [];
    return cvnVoices;
  }

  function pickVoice(targetLang) {
    if (!("speechSynthesis" in window)) return null;

    const voices = (cvnVoices && cvnVoices.length) ? cvnVoices : (window.speechSynthesis.getVoices() || []);
    if (!voices.length) return null;

    const target = String(targetLang || "").toLowerCase();

    // 1) Exact match (best)
    let v = voices.find(vo => String(vo.lang || "").toLowerCase() === target);
    if (v) return v;

    // 2) Same base language + same region if possible (e.g., prefer en-GB voices when target is en-GB)
    const region = target.split("-")[1]; // "gb" or "us"
    if (region) {
      v = voices.find(vo => {
        const lang = String(vo.lang || "").toLowerCase();
        return lang.startsWith("en") && lang.includes(region);
      });
      if (v) return v;
    }

    // 3) Any English voice (avoid French defaults)
    v = voices.find(vo => String(vo.lang || "").toLowerCase().startsWith("en-"));
    if (v) return v;

    v = voices.find(vo => String(vo.lang || "").toLowerCase().startsWith("en"));
    return v || null;
  }

  function updateAccentUI() {
    const current = getAccent();
    document.querySelectorAll("[data-accent]").forEach(btn => {
      btn.classList.toggle("is-active", btn.getAttribute("data-accent") === current);
    });
  }

  function mountAccentSwitch() {
    // Add a small switch in the hero (no HTML changes needed)
    const heroText = document.querySelector(".cvn-hero .cvn-hero-text");
    if (!heroText) return;
    if (heroText.querySelector(".cvn-accent-switch")) return;

    const wrap = document.createElement("div");
    wrap.className = "cvn-accent-switch";
    wrap.innerHTML = `
      <span class="cvn-accent-label">Accent:</span>
      <button type="button" class="cvn-accent-btn" data-accent="en-GB" aria-pressed="false">UK</button>
      <button type="button" class="cvn-accent-btn" data-accent="en-US" aria-pressed="false">US</button>
    `;

    // Insert after the lead text if present
    const lead = heroText.querySelector(".cvn-lead");
    if (lead && lead.nextSibling) {
      heroText.insertBefore(wrap, lead.nextSibling);
    } else {
      heroText.appendChild(wrap);
    }

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-accent]");
      if (!btn) return;
      setAccent(btn.getAttribute("data-accent"));
      // stop current speech so next play uses the new voice
      stopTTS();
    });

    updateAccentUI();
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    const onVoices = () => {
      loadVoices();
      updateAccentUI();
    };
    // Some browsers don't support addEventListener here
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = onVoices;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAccentSwitch);
  } else {
    mountAccentSwitch();
  }
  function stopTTS() {
    try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e) {}
  }
  function speakText(text) {
    stopTTS();
    if (!("speechSynthesis" in window)) return;

    const accent = getAccent();
    const u = new SpeechSynthesisUtterance(text);

    // Force English (prevents FR voices on FR browsers)
    u.lang = accent;

    const v = pickVoice(accent);
    if (v) u.voice = v;

    // Optional: natural pacing
    u.rate = 1;
    u.pitch = 1;

    window.speechSynthesis.speak(u);
    cvnCurrentUtterance = u;
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    if (t.hasAttribute("data-tts-stop")) { stopTTS(); return; }

    const id = t.getAttribute("data-tts");
    if (id) {
      const el = document.getElementById(id);
      let text = "";
      if (el) {
        if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") text = el.value || "";
        else text = el.textContent || "";
      }
      if (text.trim()) speakText(text.trim());
    }
  });

  document.addEventListener("visibilitychange", () => { if (document.hidden) stopTTS(); });

  // Writing tools
  const writingBox = document.getElementById("cvn-writing-box");
  const wordCountEl = document.getElementById("cvn-wordcount");
  const insertBtn = document.getElementById("cvn-insert-connectors");
  const clearBtn = document.getElementById("cvn-clear-writing");
  const selfCheckBtn = document.getElementById("cvn-self-check");
  const checkOut = document.getElementById("cvn-check-output");

  const connectorBank =
`Connector bank:
• whereas / while
• unlike
• however / nevertheless
• in addition / moreover
• overall / on balance
• in contrast
• to some extent
• depending on...`;

  function countWords(str) {
    const s = (str || "").trim();
    if (!s) return 0;
    return s.split(/\s+/).filter(Boolean).length;
  }

  function updateWordCount() {
    if (!writingBox || !wordCountEl) return;
    wordCountEl.textContent = String(countWords(writingBox.value));
  }

  if (writingBox) writingBox.addEventListener("input", updateWordCount);
  updateWordCount();

  if (insertBtn && writingBox) {
    insertBtn.addEventListener("click", () => {
      const current = writingBox.value || "";
      writingBox.value = current + (current.trim() ? "\n\n" : "") + connectorBank + "\n";
      updateWordCount();
      writingBox.focus();
    });
  }

  if (clearBtn && writingBox) {
    clearBtn.addEventListener("click", () => {
      writingBox.value = "";
      updateWordCount();
      if (checkOut) checkOut.innerHTML = "";
    });
  }

  function hasAny(text, arr) {
    const t = (text || "").toLowerCase();
    return arr.some((w) => t.includes(w));
  }

  if (selfCheckBtn && writingBox && checkOut) {
    selfCheckBtn.addEventListener("click", () => {
      const text = writingBox.value || "";
      const wc = countWords(text);

      const connectors = ["whereas","while","unlike","however","in addition","moreover","overall","in contrast","on balance","depending"];
      const hedges = ["tends to","often","generally","in many cases","to some extent","arguably","can feel","depending on"];

      const issues = [];
      if (wc < 150) issues.push("Too short: aim for 150–220 words.");
      if (wc > 240) issues.push("A bit long: tighten to ~220 words.");
      if (!hasAny(text, connectors)) issues.push("Add more connectors (whereas/while/unlike/however…).");
      if (!hasAny(text, hedges)) issues.push("Add hedging (tends to, generally, depending on…).");
      if (!/(more\s+\w+\s+than|\w+er\s+than)/i.test(text)) issues.push("Include at least one comparative (X is more… than / older than…).");
      if (!/the\s+most\s+\w+|\w+est\b/i.test(text)) issues.push("Include one superlative (the most…, the busiest…).");
      if (/always|never|everyone|no one/i.test(text)) issues.push("Avoid absolutes (always/never/everyone). Replace with “often / tends to”.");
      if (!/[\.!?]\s*$/.test(text.trim())) issues.push("Finish with a clear concluding sentence.");

      const ok = issues.length === 0;
      checkOut.innerHTML =
        (ok ? "<p><strong>✅ Strong draft.</strong> Good structure + nuance.</p>"
            : "<p><strong>🔎 Self-check results:</strong></p>") +
        (ok ? "" : "<ul>" + issues.map(i => `<li>${i}</li>`).join("") + "</ul>");
    });
  }

  // Timer (2:00)
  const timerDisplay = document.getElementById("cvn-timer-display");
  const timerStart = document.getElementById("cvn-timer-start");
  const timerReset = document.getElementById("cvn-timer-reset");
  let timerInterval = null;
  let remaining = 120;

  function renderTime() {
    if (!timerDisplay) return;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    timerDisplay.textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        remaining = 0;
        renderTime();
        stopTimer();
        try { navigator.vibrate && navigator.vibrate(120); } catch (e) {}
      } else renderTime();
    }, 1000);
  }

  if (timerStart) timerStart.addEventListener("click", startTimer);
  if (timerReset) timerReset.addEventListener("click", () => {
    stopTimer();
    remaining = 120;
    renderTime();
  });

  renderTime();
})();
