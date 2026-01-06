/* ===========================
   VTest Prep Lesson JS
   =========================== */

(function () {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Personalization (name)
  let studentName = "";
  const nameInput = $("#vt-student-name");
  const applyBtn = $("#vt-apply-name");
  if (applyBtn && nameInput) {
    applyBtn.addEventListener("click", () => {
      studentName = (nameInput.value || "").trim();
      alert(studentName ? `✅ Personalization on: “${studentName}”` : "✅ Using generic language (no name).");
    });
  }
  function getNameOrFallback() { return studentName || "the candidate"; }

  // Checklist progress
  const checklist = $("#vt-checklist");
  const progressFill = $("#vt-progress-fill");
  const progressText = $("#vt-progress-text");
  const checklistReset = $("#vt-checklist-reset");

  function updateChecklistProgress() {
    if (!checklist || !progressFill || !progressText) return;
    const boxes = $$("input[type='checkbox']", checklist);
    const checked = boxes.filter(b => b.checked).length;
    const total = boxes.length || 1;
    const pct = Math.round((checked / total) * 100);
    progressFill.style.width = pct + "%";
    progressText.textContent = String(pct);
  }
  if (checklist) {
    checklist.addEventListener("change", updateChecklistProgress);
    updateChecklistProgress();
  }
  if (checklistReset && checklist) {
    checklistReset.addEventListener("click", () => {
      $$("input[type='checkbox']", checklist).forEach(b => b.checked = false);
      updateChecklistProgress();
    });
  }

  // Reveal buttons
  const revealOutput = $("#vt-reveal-output");
  $$(".vt-reveal").forEach(btn => {
    btn.addEventListener("click", () => {
      const ans = btn.getAttribute("data-answer") || "";
      if (revealOutput) revealOutput.textContent = ans;
    });
  });

  // MCQ scoring helper
  function wireSimpleScore(questions, correctEl, totalEl, resetBtn) {
    if (totalEl) totalEl.textContent = String(questions.length);
    if (correctEl) correctEl.textContent = "0";
    let correct = 0;

    questions.forEach(q => {
      const right = (q.getAttribute("data-correct") || "").trim();
      const explain = (q.getAttribute("data-explain") || "").trim();
      const fb = $(".vt-fb", q);

      $$(".vt-opts button", q).forEach(btn => {
        btn.addEventListener("click", () => {
          if (btn.disabled) return;
          const chosen = (btn.getAttribute("data-opt") || "").trim();
          const buttons = $$(".vt-opts button", q);
          buttons.forEach(b => b.disabled = true);

          if (chosen === right) {
            btn.classList.add("vt-right");
            correct += 1;
            if (fb) fb.innerHTML = `<strong>Correct.</strong> ${explain}`;
          } else {
            btn.classList.add("vt-wrong");
            const rightBtn = buttons.find(b => (b.getAttribute("data-opt") || "").trim() === right);
            if (rightBtn) rightBtn.classList.add("vt-right");
            if (fb) fb.innerHTML = `<strong>Not quite.</strong> ${explain}`;
          }
          if (correctEl) correctEl.textContent = String(correct);
        });
      });
    });

    function reset() {
      correct = 0;
      if (correctEl) correctEl.textContent = "0";
      questions.forEach(q => {
        const fb = $(".vt-fb", q);
        if (fb) fb.textContent = "";
        $$(".vt-opts button", q).forEach(b => {
          b.disabled = false;
          b.classList.remove("vt-right", "vt-wrong");
        });
      });
    }

    if (resetBtn) resetBtn.addEventListener("click", reset);
    return { reset, getCorrect: () => correct };
  }

  // Grammar MCQ
  const grammarContainer = $("#vt-grammar-mcq");
  if (grammarContainer) {
    const grammarQs = $$(".vt-q", grammarContainer);
    wireSimpleScore(grammarQs, $("#vt-grammar-correct"), $("#vt-grammar-total"), $("#vt-grammar-reset"));
  }

  // Listening MCQ
  const listeningContainer = $("#vt-listening");
  if (listeningContainer) {
    const listeningQs = $$(".vt-q", listeningContainer);
    wireSimpleScore(listeningQs, $("#vt-listening-correct"), $("#vt-listening-total"), $("#vt-listening-reset"));
  }

  // Reading MCQ
  const readingContainer = $("#vt-reading");
  if (readingContainer) {
    const readingQs = $$(".vt-q", readingContainer);
    wireSimpleScore(readingQs, $("#vt-reading-correct"), $("#vt-reading-total"), $("#vt-reading-reset"));
  }

  // Timers
  let activeTimer = null;
  function startTimer(seconds, outputEl) {
    const el = outputEl || $("#vt-timer-panel");
    if (!el) return;
    if (activeTimer) clearInterval(activeTimer);

    let remain = seconds;
    el.textContent = `⏱️ ${remain}s`;
    activeTimer = setInterval(() => {
      remain -= 1;
      if (remain <= 0) {
        clearInterval(activeTimer);
        activeTimer = null;
        el.textContent = "✅ Time!";
        return;
      }
      el.textContent = `⏱️ ${remain}s`;
    }, 1000);
  }
  $$(".vt-timer").forEach(btn => {
    btn.addEventListener("click", () => {
      const s = parseInt(btn.getAttribute("data-seconds") || "0", 10);
      if (!Number.isFinite(s) || s <= 0) return;
      const target = btn.closest(".vt-card")?.querySelector(".vt-timer-panel") || $("#vt-timer-panel");
      startTimer(s, target);
    });
  });

    // TTS (US/UK) using Web Speech API
  const synth = window.speechSynthesis;
  let voices = [];

  // Accent preference: "us" (American) or "uk" (British)
  let voicePref = (localStorage.getItem("vt_voice_pref") || "us").toLowerCase();
  const voiceBtnUS = $("#vt-voice-us");
  const voiceBtnUK = $("#vt-voice-uk");
  const voiceStatus = $("#vt-voice-status");

  function normalizePref(p){
    const x = (p || "").toLowerCase();
    return (x === "uk" || x === "gb" || x === "british") ? "uk" : "us";
  }

  function loadVoices() { voices = synth ? synth.getVoices() : []; }

  function pickVoice(pref){
    const p = normalizePref(pref);
    const v = voices || [];

    const wantLang = p === "uk" ? /^en-GB/i : /^en-US/i;
    const preferredName = /Google|Microsoft|Samantha|Alex|Jenny|Aria|Guy|Daniel|Serena|Olivia|Ryan|Natasha|George/i;

    const match = v.filter(x => wantLang.test(x.lang));
    return (
      match.find(x => preferredName.test(x.name)) ||
      match[0] ||
      v.find(x => /^en/i.test(x.lang) && preferredName.test(x.name)) ||
      v.find(x => /^en/i.test(x.lang)) ||
      null
    );
  }

  function updateVoiceUI(){
    const p = normalizePref(voicePref);

    if (voiceBtnUS){
      voiceBtnUS.classList.toggle("is-active", p === "us");
      voiceBtnUS.setAttribute("aria-pressed", p === "us" ? "true" : "false");
    }
    if (voiceBtnUK){
      voiceBtnUK.classList.toggle("is-active", p === "uk");
      voiceBtnUK.setAttribute("aria-pressed", p === "uk" ? "true" : "false");
    }

    // Small status message + fallback hint
    if (voiceStatus){
      const chosen = p === "uk" ? "British" : "American";
      loadVoices();
      const voice = pickVoice(p);
      const nativeOk = voice ? ((p === "uk" && /^en-GB/i.test(voice.lang)) || (p === "us" && /^en-US/i.test(voice.lang))) : false;
      voiceStatus.textContent = voice
        ? `Current: ${chosen}${nativeOk ? "" : " (closest English voice available)"}`
        : `Current: ${chosen} (no speech voices found)`;
    }
  }

  function setVoicePref(p){
    voicePref = normalizePref(p);
    try { localStorage.setItem("vt_voice_pref", voicePref); } catch {}
    updateVoiceUI();
  }

  function speak(text, prefOverride){
    if (!synth || !text) return;

    // Stop anything currently speaking so buttons feel responsive
    synth.cancel();

    loadVoices();
    const pref = normalizePref(prefOverride || voicePref);
    const u = new SpeechSynthesisUtterance(text);

    const voice = pickVoice(pref);
    if (voice) u.voice = voice;
    u.lang = pref === "uk" ? "en-GB" : "en-US";
    u.rate = 0.98;
    u.pitch = 1.0;

    synth.speak(u);
  }

  if (synth) {
    loadVoices();
    synth.onvoiceschanged = () => { loadVoices(); updateVoiceUI(); };
  }

  // Accent picker buttons
  if (voiceBtnUS) voiceBtnUS.addEventListener("click", () => setVoicePref("us"));
  if (voiceBtnUK) voiceBtnUK.addEventListener("click", () => setVoicePref("uk"));
  updateVoiceUI();

  // Any button with .vt-say can optionally set data-voice="us" or "uk"
  // If data-voice="auto" (or missing), it follows the global accent choice.
  $$(".vt-say").forEach(btn => {
    btn.addEventListener("click", () => {
      const raw = btn.getAttribute("data-text") || "";
      const override = (btn.getAttribute("data-voice") || "auto").toLowerCase();
      const name = getNameOrFallback();
      const txt = raw.replaceAll("[CANDIDATE]", name);

      speak(txt, override === "auto" ? null : override);
    });
  });

  const stopTtsBtn = $("#vt-stop-tts");
  if (stopTtsBtn && synth) stopTtsBtn.addEventListener("click", () => synth.cancel());


  // Drag & drop (email structure)
  const dragSource = $("#vt-drag-source");
  const dropzonesWrap = $("#vt-dropzones");
  const ddFeedback = $("#vt-dd-feedback");
  const ddCheck = $("#vt-dd-check");
  const ddReset = $("#vt-dd-reset");

  function makeChip(text) {
    const chip = document.createElement("span");
    chip.className = "vt-chip";
    chip.textContent = text;
    return chip;
  }

  const labelMap = {
    subject: "1) Subject line",
    greeting: "2) Greeting",
    context: "3) Context",
    ask: "4) Request / action",
    closing: "5) Closing",
    signature: "6) Signature"
  };

  function clearDropzones() {
    if (!dropzonesWrap) return;
    $$(".vt-dropzone", dropzonesWrap).forEach(z => {
      const accept = z.getAttribute("data-accept") || "";
      z.dataset.filled = "";
      z.innerHTML = `<span>${labelMap[accept] || "Drop here"}</span>`;
    });
  }
  function resetDraggables() {
    if (!dragSource) return;
    $$(".vt-drag", dragSource).forEach(d => { d.style.display = ""; });
  }
  function ddResetAll() {
    resetDraggables();
    clearDropzones();
    if (ddFeedback) ddFeedback.textContent = "";
  }

  if (dragSource) {
    $$(".vt-drag", dragSource).forEach(el => {
      el.addEventListener("dragstart", (e) => {
        const key = el.getAttribute("data-key") || "";
        const text = el.textContent || "";
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", text);
        e.dataTransfer.setData("application/x-vt-key", key);
      });
    });
  }

  if (dropzonesWrap) {
    $$(".vt-dropzone", dropzonesWrap).forEach(zone => {
      zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("vt-over"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("vt-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("vt-over");
        if (zone.dataset.filled) return;

        const accept = (zone.getAttribute("data-accept") || "").trim();
        const key = e.dataTransfer.getData("application/x-vt-key") || "";
        const text = e.dataTransfer.getData("text/plain") || "";

        zone.dataset.filled = key;
        zone.innerHTML = "";
        zone.appendChild(makeChip(text));

        // Hide item from source list
        const src = dragSource ? $(`.vt-drag[data-key="${CSS.escape(key)}"]`, dragSource) : null;
        if (src) src.style.display = "none";
      });
    });
  }

  if (ddCheck && dropzonesWrap) {
    ddCheck.addEventListener("click", () => {
      const zones = $$(".vt-dropzone", dropzonesWrap);
      const missing = zones.filter(z => !z.dataset.filled);
      if (missing.length) {
        if (ddFeedback) ddFeedback.textContent = "⚠️ Please fill all slots before checking.";
        return;
      }
      const wrong = zones.filter(z => (z.dataset.filled || "") !== (z.getAttribute("data-accept") || ""));
      if (wrong.length === 0) {
        if (ddFeedback) ddFeedback.textContent = "✅ Perfect! Your email structure is natural and professional.";
      } else {
        if (ddFeedback) ddFeedback.textContent =
          "❌ Some parts are in the wrong place. Tip: subject → greeting → context → request → closing → signature.";
      }
    });
  }
  if (ddReset) ddReset.addEventListener("click", ddResetAll);
  ddResetAll();

  // Dialogue builder
  const dlgForm = $("#vt-dialogue-form");
  const dlgOut = $("#vt-dialogue-output");
  const dlgReset = $("#vt-dialogue-reset");
  const dlgCopy = $("#vt-dialogue-copy");
  const dlgPlay = $("#vt-dialogue-play");

  function buildDialogue(scenario, tone, goal, time) {
    const you = getNameOrFallback();
    const other = "Colleague";

    const toneMap = {
      neutral: { greet: "Hi", thanks: "Thank you." },
      warm: { greet: "Hi", thanks: "Thanks so much." },
      firm: { greet: "Hello", thanks: "Thank you." }
    };
    const t = toneMap[tone] || toneMap.neutral;

    if (scenario === "meeting") {
      if (goal === "apologize") {
        return `${other}: ${t.greet} ${you}. I’m sorry, but I need to reschedule our meeting.\n${you}: No problem. What time works for you?\n${other}: Could we move it to tomorrow afternoon?\n${you}: Yes — I’ll update the calendar invite ${time}.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
      }
      if (goal === "clarify") {
        return `${other}: ${t.greet} ${you}. Could you clarify the timeline?\n${you}: Absolutely. The key milestone is next week, and I’ll share the details ${time}.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
      }
      return `${other}: ${t.greet} ${you}. I’d like to confirm our next steps and timing.\n${you}: Of course. I’ll send a short recap email ${time}.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
    }

    if (scenario === "issue") {
      if (goal === "apologize") {
        return `${you}: I’m sorry for the disruption. We’re investigating the root cause.\n${other}: When can we expect an update?\n${you}: I’ll share a status update ${time}, and we’ll propose next steps.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
      }
      if (goal === "clarify") {
        return `${other}: ${t.greet} ${you}. Can you clarify who is impacted?\n${you}: Yes. It affects the finance team only. I’ll confirm the scope ${time}.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
      }
      return `${other}: ${t.greet} ${you}. We need to confirm the workaround.\n${you}: Understood. Let’s document the workaround and I’ll escalate to IT ${time}.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
    }

    // client
    if (goal === "apologize") {
      return `${other}: ${t.greet} ${you}. The client is unhappy about the delay.\n${you}: I’ll apologize and propose a new delivery window.\n${other}: Great. Ask them to confirm what works.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
    }
    if (goal === "clarify") {
      return `${other}: ${t.greet} ${you}. Could you clarify the delivery window?\n${you}: Yes — the earliest option is tomorrow morning. I’ll send the exact window ${time}.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
    }
    return `${you}: I’ll confirm the timeline and the next steps with them ${time}.\n${other}: Great — please copy me on the email.\n${other}: ${t.thanks}\n${you}: ${t.thanks}`;
  }

  if (dlgForm && dlgOut) {
    dlgForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const scenario = $("#vt-scn")?.value || "meeting";
      const tone = $("#vt-tone")?.value || "neutral";
      const goal = $("#vt-goal")?.value || "confirm";
      const time = $("#vt-time")?.value || "by end of day";

      const text = buildDialogue(scenario, tone, goal, time);
      dlgOut.value = text;
      if (dlgPlay) dlgPlay.setAttribute("data-text", text.replaceAll("\n", " "));
    });
  }
  if (dlgReset && dlgOut) {
    dlgReset.addEventListener("click", () => {
      dlgOut.value = "";
      if (dlgPlay) dlgPlay.setAttribute("data-text", "");
      dlgForm?.reset();
    });
  }
  if (dlgCopy && dlgOut) {
    dlgCopy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(dlgOut.value || ""); alert("Copied!"); }
      catch { alert("Copy failed. You can manually select and copy the text."); }
    });
  }

  // Speaking prompts
  const promptEl = $("#vt-speaking-prompt");
  const newPromptBtn = $("#vt-speaking-new");
  const prompts = [
    "What’s your opinion about flexible work (hybrid / remote)? Give one advantage, one challenge, and one practical solution.",
    "Describe a recent challenge at work and how you solved it. Mention who was involved and the result.",
    "Explain a process you know well (e.g., onboarding, safety checks, reporting). Give 3 clear steps.",
    "Compare two options for a business decision (e.g., train vs. plane for a client visit). Explain your recommendation.",
    "Give feedback to a colleague in a polite way: mention one positive point and one improvement suggestion."
  ];
  if (newPromptBtn && promptEl) {
    newPromptBtn.addEventListener("click", () => {
      const p = prompts[Math.floor(Math.random() * prompts.length)];
      promptEl.innerHTML = `<strong>Question:</strong> ${p}`;
      $("#vt-speaking-timer")?.textContent && ($("#vt-speaking-timer").textContent = "");
    });
  }

  // Optional recording (MediaRecorder)
  const recStart = $("#vt-rec-start");
  const recStop = $("#vt-rec-stop");
  const recClear = $("#vt-rec-clear");
  const recStatus = $("#vt-rec-status");
  const recPlayback = $("#vt-rec-playback");

  let mediaRecorder = null;
  let chunks = [];

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      if (recStatus) recStatus.textContent = "Recording is not supported in this browser.";
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        if (recPlayback) {
          recPlayback.src = URL.createObjectURL(blob);
          recPlayback.style.display = "block";
        }
        if (recStatus) recStatus.textContent = "✅ Recording ready. Play it back above.";
      };
      mediaRecorder.start();
      if (recStatus) recStatus.textContent = "⏺ Recording…";
      if (recStart) recStart.disabled = true;
      if (recStop) recStop.disabled = false;
    } catch {
      if (recStatus) recStatus.textContent = "Microphone permission denied or unavailable.";
    }
  }
  function stopRecording() {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    mediaRecorder = null;
    if (recStart) recStart.disabled = false;
    if (recStop) recStop.disabled = true;
  }
  function clearRecording() {
    chunks = [];
    if (recPlayback) {
      recPlayback.pause();
      recPlayback.removeAttribute("src");
      recPlayback.style.display = "none";
    }
    if (recStatus) recStatus.textContent = "";
  }
  if (recStart) recStart.addEventListener("click", startRecording);
  if (recStop) recStop.addEventListener("click", stopRecording);
  if (recClear) recClear.addEventListener("click", clearRecording);

  // Writing self-check
  const writingInput = $("#vt-writing-input");
  const writingCheck = $("#vt-writing-check");
  const writingReset = $("#vt-writing-reset");
  const writingRubric = $("#vt-writing-rubric");
  const sampleBtn = $("#vt-writing-sample");
  const sampleBox = $("#vt-writing-sample-box");

  if (sampleBtn && sampleBox) {
    sampleBtn.addEventListener("click", () => {
      const open = !sampleBox.hasAttribute("hidden");
      if (open) { sampleBox.setAttribute("hidden", ""); sampleBtn.textContent = "Show sample answer"; }
      else { sampleBox.removeAttribute("hidden"); sampleBtn.textContent = "Hide sample answer"; }
    });
  }

  function countMatches(text, patterns) {
    const t = (text || "").toLowerCase();
    return patterns.reduce((acc, p) => acc + (t.includes(p) ? 1 : 0), 0);
  }

  function selfCheckEmail(text) {
    const t = (text || "").trim();
    const lines = t.split(/\r?\n/).filter(l => l.trim().length > 0);
    const hasSubject = /^subject\s*:/i.test(lines[0] || "");
    const hasGreeting = /(hello|hi|dear)\b/i.test(t);
    const hasApology = countMatches(t, ["sorry", "apolog"]) > 0;
    const hasReason = countMatches(t, ["due to", "because", "as a result", "weather", "delay"]) > 0;
    const hasSolution = countMatches(t, ["we can", "we could", "we propose", "offer", "alternative"]) > 0;
    const hasAsk = /\b(could you|please confirm|would you|can you)\b/i.test(t);
    const hasClosing = /(best regards|kind regards|warm regards|sincerely)/i.test(t);

    const parts = [
      ["Subject line", hasSubject],
      ["Greeting", hasGreeting],
      ["Apology", hasApology],
      ["Short explanation", hasReason],
      ["Solution / option", hasSolution],
      ["Request for confirmation", hasAsk],
      ["Professional closing", hasClosing]
    ];
    const points = parts.filter(p => p[1]).length;

    const tips = [];
    if (!hasSubject) tips.push("Add a clear subject line (e.g., “Subject: Update on your delivery”).");
    if (!hasGreeting) tips.push("Add a greeting (Hello / Hi / Dear…).");
    if (!hasApology) tips.push("Include an apology (“I’m sorry for the inconvenience…”).");
    if (!hasReason) tips.push("Add a short reason (“Due to…, the delivery is delayed…”).");
    if (!hasSolution) tips.push("Offer a solution or options (“We can offer… / We propose…”).");
    if (!hasAsk) tips.push("Ask for confirmation (“Could you please confirm…?”).");
    if (!hasClosing) tips.push("Close professionally (“Best regards,”).");

    return { points, max: parts.length, parts, tips, linesCount: lines.length };
  }

  if (writingCheck && writingInput && writingRubric) {
    writingCheck.addEventListener("click", () => {
      const report = selfCheckEmail(writingInput.value || "");
      const badge = report.points >= 6 ? "✅ Strong" : report.points >= 4 ? "⚠️ Good start" : "❌ Needs work";
      const partsHtml = report.parts.map(([label, ok]) => `<li>${ok ? "✅" : "⬜"} ${label}</li>`).join("");
      const tipsHtml = report.tips.length
        ? `<p><strong>Next improvements:</strong></p><ul>${report.tips.map(t => `<li>${t}</li>`).join("")}</ul>`
        : `<p><strong>Great!</strong> Your email has the key elements.</p>`;

      writingRubric.innerHTML = `
        <p><strong>${badge}</strong> — ${report.points}/${report.max} key elements · ${report.linesCount} non-empty lines</p>
        <ul>${partsHtml}</ul>
        ${tipsHtml}
      `;
    });
  }
  if (writingReset && writingInput && writingRubric) {
    writingReset.addEventListener("click", () => { writingInput.value = ""; writingRubric.textContent = ""; });
  }

})();