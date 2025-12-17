/* LEVELTEL – Train Manager (Le Grand Tour · Puy du Fou)
   Interactive lesson logic (no external deps)
*/
(function () {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ===== Hero image per page =====
  // Allows <body data-hero-image="./img/xyz.jpg">
  const hero = document.body?.getAttribute("data-hero-image");
  if (hero) {
    // Set CSS variable on body (used by CSS)
    document.body.style.setProperty("--_hero", `url("${hero}")`);
  }

  // ===== Helpers =====
  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
  function wordsCount(text){
    return (text || "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean).length;
  }
  function getName(){
    const v = ($("#lt-name")?.value || "").trim();
    return v ? v : "I";
  }
  function safeReplaceName(line){
    // If user provides a name, we can use it; otherwise keep neutral "I"
    const n = ($("#lt-name")?.value || "").trim();
    return n ? line.replace(/\bI\b/g, n) : line;
  }

  // ===== Quiz engine (MCQ) =====
  const quizState = new Map(); // quizId => Map(qid => boolean)
  function initQuiz(quizEl){
    const quizId = quizEl.getAttribute("data-quiz");
    if (!quizId) return;
    const qMap = new Map();
    quizState.set(quizId, qMap);

    const questions = $$(".lt-q", quizEl);
    const totalEl = quizEl.querySelector(`[data-total="${quizId}"]`);
    if (totalEl) totalEl.textContent = String(questions.length);

    questions.forEach(q => {
      const qid = q.getAttribute("data-qid");
      const answer = q.getAttribute("data-answer");
      const hint = q.getAttribute("data-hint") || "";
      const feedback = $(".lt-feedback", q);
      const buttons = $$("button[data-opt]", q);

      function lockButtons(){
        buttons.forEach(b => b.disabled = true);
      }
      function unlockButtons(){
        buttons.forEach(b => b.disabled = false);
      }
      function clearMarks(){
        buttons.forEach(b => b.classList.remove("lt-correct","lt-wrong"));
        if (feedback) feedback.innerHTML = "";
      }

      // store for reset
      q._ltReset = () => {
        unlockButtons();
        clearMarks();
        if (qid) qMap.delete(qid);
        updateScoreUI(quizId);
        const finalEl = quizEl.querySelector(`[data-final="${quizId}"]`);
        if (finalEl) finalEl.textContent = "";
      };

      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          if (!qid) return;
          const opt = btn.getAttribute("data-opt");
          const ok = (opt === answer);

          // mark all
          buttons.forEach(b => {
            const o = b.getAttribute("data-opt");
            if (o === answer) b.classList.add("lt-correct");
            if (o === opt && !ok) b.classList.add("lt-wrong");
          });

          lockButtons();
          qMap.set(qid, ok);
          updateScoreUI(quizId);

          if (feedback) {
            if (ok) {
              feedback.innerHTML = `<strong>✅ Correct.</strong>`;
            } else {
              feedback.innerHTML = `<strong>❌ Not quite.</strong> <span class="lt-hint">Hint:</span> ${hint}`;
            }
          }
        });
      });
    });

    // score buttons
    const showBtn = quizEl.querySelector(`[data-show-score="${quizId}"]`);
    if (showBtn) {
      showBtn.addEventListener("click", () => {
        const m = quizState.get(quizId);
        const total = questions.length;
        const correct = m ? Array.from(m.values()).filter(Boolean).length : 0;
        const finalEl = quizEl.querySelector(`[data-final="${quizId}"]`);
        if (finalEl) {
          const msg = (correct === total)
            ? "Perfect. This is exam-level accuracy."
            : (correct >= Math.ceil(total*0.75))
              ? "Strong. Polish the few weak points."
              : "Keep going: replay the hints and re-try.";
          finalEl.textContent = `Score: ${correct}/${total} — ${msg}`;
        }
      });
    }

    const resetBtn = quizEl.querySelector(`[data-reset-quiz="${quizId}"]`);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => resetQuiz(quizId));
    }
  }

  function updateScoreUI(quizId){
    const m = quizState.get(quizId);
    const scoreEl = document.querySelector(`[data-score="${quizId}"]`);
    if (scoreEl) {
      const correct = m ? Array.from(m.values()).filter(Boolean).length : 0;
      scoreEl.textContent = String(correct);
    }
  }

  function resetQuiz(quizId){
    const quizEl = document.querySelector(`.lt-quiz[data-quiz="${quizId}"]`);
    if (!quizEl) return;
    const questions = $$(".lt-q", quizEl);
    questions.forEach(q => q._ltReset && q._ltReset());
    quizState.set(quizId, new Map());
    updateScoreUI(quizId);
  }

  $$(".lt-quiz[data-quiz]").forEach(initQuiz);

  // ===== Reset all =====
  const resetAll = $("#lt-reset-all");
  if (resetAll) {
    resetAll.addEventListener("click", () => {
      // quizzes
      Array.from(quizState.keys()).forEach(resetQuiz);

      // notes + summary
      $("#lt-notes-what") && ($("#lt-notes-what").value = "");
      $("#lt-notes-impact") && ($("#lt-notes-impact").value = "");
      $("#lt-notes-actions") && ($("#lt-notes-actions").value = "");
      $("#lt-notes-data") && ($("#lt-notes-data").value = "");
      $("#lt-notes-summary") && ($("#lt-notes-summary").value = "");

      // writing
      $("#lt-email-draft") && ($("#lt-email-draft").value = "");
      $("#lt-wordcount") && ($("#lt-wordcount").textContent = "0");
      $("#lt-sample") && ($("#lt-sample").hidden = true);
      $("#lt-tone-tips") && ($("#lt-tone-tips").hidden = true);

      // roleplay
      $("#lt-roleplay-form") && $("#lt-roleplay-form").reset();
      $("#lt-roleplay-output") && ($("#lt-roleplay-output").value = "");

      // timers
      stopAllTimers();

      // audio / tts
      speechSynthesis.cancel();

      // recording
      stopRecordingIfAny(true);
    });
  }

  // ===== TTS (speech synthesis) =====
  const transcripts = {
    audio1: [
      "Operations Control speaking. Quick update.",
      "We have a mandatory safety inspection that is taking longer than expected, so please do not start boarding until the engineer gives a clear green light.",
      "The departure is currently forecast to be delayed by around twenty minutes.",
      "We have two VIP groups scheduled at two p.m., so we need calm, consistent communication and a clear update time.",
      "Please run a two-minute crew briefing, make a public announcement with options, and coordinate accessibility assistance.",
      "Then send a short written update to Operations within ten minutes.",
      "Thank you."
    ].join(" ")
  };

  // Inject transcript text into page
  const t1 = $("#lt-audio1-transcript");
  if (t1) t1.textContent = transcripts.audio1;

  const ttsSessions = new Map(); // id => utterance

  // ---- Voice loading / caching (fix: French default voice on French systems) ----
  // In some browsers, speechSynthesis.getVoices() is empty at first load. If we try to
  // pick a voice too early, the browser may fall back to the device default voice (often fr-FR).
  let VOICE_CACHE = [];
  function refreshVoiceCache(){
    try {
      VOICE_CACHE = (speechSynthesis.getVoices ? speechSynthesis.getVoices() : []) || [];
    } catch (e) {
      VOICE_CACHE = [];
    }
    return VOICE_CACHE;
  }
  refreshVoiceCache();
  if (typeof speechSynthesis !== "undefined" && speechSynthesis.addEventListener) {
    speechSynthesis.addEventListener("voiceschanged", refreshVoiceCache);
  }

  function pickVoice(preferLang="en-GB"){
    const voices = (VOICE_CACHE && VOICE_CACHE.length) ? VOICE_CACHE : refreshVoiceCache();
    if (!voices || !voices.length) return null;

    const prefer = (preferLang || "").toLowerCase();
    const preferShort = prefer.split("-")[0];

    // Prefer exact match (en-GB), then any English (en-*), then fall back to first available.
    let v =
      voices.find(v => (v.lang || "").toLowerCase() === prefer) ||
      voices.find(v => (v.lang || "").toLowerCase().startsWith(preferShort + "-")) ||
      voices.find(v => (v.lang || "").toLowerCase().startsWith("en-")) ||
      voices.find(v => (v.lang || "").toLowerCase() === "en") ||
      null;

    return v || voices[0] || null;
  }

  function ttsPlay(id){
    speechSynthesis.cancel();
    const text = transcripts[id];
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);

    // Force English language, even if we cannot pick a voice yet.
    u.lang = "en-GB";

    // Try to select a British English voice (falls back to any English voice).
    const v = pickVoice("en-GB") || pickVoice("en-US");
    if (v) u.voice = v;

    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;

    ttsSessions.set(id, u);
    speechSynthesis.speak(u);
  }

  function ttsPause(){
    if (speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.pause();
  }
  function ttsResume(){
    if (speechSynthesis.paused) speechSynthesis.resume();
  }
  function ttsStop(){
    speechSynthesis.cancel();
  }

  $$("[data-tts-play]").forEach(btn => {
    btn.addEventListener("click", () => ttsPlay(btn.getAttribute("data-tts-play")));
  });
  $$("[data-tts-pause]").forEach(btn => btn.addEventListener("click", ttsPause));
  $$("[data-tts-resume]").forEach(btn => btn.addEventListener("click", ttsResume));
  $$("[data-tts-stop]").forEach(btn => btn.addEventListener("click", ttsStop));

  // ===== Notes -> summary =====
  const notesToSummary = $("#lt-notes-to-summary");
  const notesReset = $("#lt-notes-reset");
  if (notesToSummary) {
    notesToSummary.addEventListener("click", () => {
      const what = ($("#lt-notes-what")?.value || "").trim();
      const impact = ($("#lt-notes-impact")?.value || "").trim();
      const actions = ($("#lt-notes-actions")?.value || "").trim();
      const data = ($("#lt-notes-data")?.value || "").trim();

      const lines = [];
      lines.push(`1) Situation: ${what || "A service disruption triggered a mandatory safety inspection."}`);
      lines.push(`2) Impact: ${impact || "Boarding is paused and departure is delayed; guests need clear expectations."}`);
      lines.push(`3) Key data: ${data || "Delay ~20 minutes; VIP groups at 14:00; update within 10–15 minutes."}`);
      lines.push(`4) Actions taken: ${actions || "Crew briefing, announcement with options, accessibility coordination."}`);
      lines.push(`5) Next step: I will send a written update and request confirmation of next steps from Operations.`);

      const out = $("#lt-notes-summary");
      if (out) out.value = lines.join("\n");
    });
  }
  if (notesReset) {
    notesReset.addEventListener("click", () => {
      ["#lt-notes-what","#lt-notes-impact","#lt-notes-actions","#lt-notes-data","#lt-notes-summary"].forEach(id=>{
        const el = $(id);
        if (el) el.value = "";
      });
    });
  }

  // ===== Timers =====
  const timers = new Map(); // id -> {remaining, interval, initial}
  function formatMMSS(sec){
    sec = Math.max(0, Math.floor(sec));
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }

  function initTimer(id, seconds){
    timers.set(id, {remaining: seconds, initial: seconds, interval: null});
    const display = document.querySelector(`[data-timer-display="${id}"]`);
    if (display) display.textContent = formatMMSS(seconds);
  }

  function startTimer(id){
    const t = timers.get(id);
    if (!t) return;
    if (t.interval) return;

    const display = document.querySelector(`[data-timer-display="${id}"]`);
    t.interval = setInterval(() => {
      t.remaining -= 1;
      if (display) display.textContent = formatMMSS(t.remaining);
      if (t.remaining <= 0){
        clearInterval(t.interval);
        t.interval = null;
        if (display) display.textContent = "00:00";
        // small alert without being obnoxious
        try{ navigator.vibrate && navigator.vibrate(120); } catch(e){}
      }
    }, 1000);
  }

  function stopTimer(id, reset=false){
    const t = timers.get(id);
    if (!t) return;
    if (t.interval){
      clearInterval(t.interval);
      t.interval = null;
    }
    if (reset){
      t.remaining = t.initial;
      const display = document.querySelector(`[data-timer-display="${id}"]`);
      if (display) display.textContent = formatMMSS(t.remaining);
    }
  }

  function stopAllTimers(){
    Array.from(timers.keys()).forEach(id => stopTimer(id, true));
  }

  initTimer("speak1", 60);
  initTimer("speak2", 90);
  initTimer("write1", 8*60);

  $$("[data-timer-start]").forEach(btn=>{
    btn.addEventListener("click", () => startTimer(btn.getAttribute("data-timer-start")));
  });
  $$("[data-timer-stop]").forEach(btn=>{
    btn.addEventListener("click", () => stopTimer(btn.getAttribute("data-timer-stop"), true));
  });

  // ===== Recording (MediaRecorder) =====
  let mediaRecorder = null;
  let mediaStream = null;
  let chunks = [];

  const recStart = $("#lt-rec-start");
  const recStop = $("#lt-rec-stop");
  const recStatus = $("#lt-rec-status");
  const recAudio = $("#lt-rec-audio");
  const recHelp = $("#lt-rec-help");

  function setRecStatus(msg){
    if (recStatus) recStatus.textContent = msg;
  }
  function stopRecordingIfAny(silent=false){
    try{
      if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    } catch(e){}
    try{
      if (mediaStream) mediaStream.getTracks().forEach(t=>t.stop());
    } catch(e){}
    mediaRecorder = null;
    mediaStream = null;
    chunks = [];
    if (!silent) setRecStatus("Not recording");
    if (recStop) recStop.disabled = true;
    if (recStart) recStart.disabled = false;
  }

  async function startRecording(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      if (recHelp) recHelp.textContent = "Recording is not supported in this browser.";
      return;
    }
    if (location.protocol !== "https:" && location.hostname !== "localhost"){
      if (recHelp) recHelp.textContent = "Recording requires HTTPS (GitHub Pages is fine).";
      return;
    }
    try{
      mediaStream = await navigator.mediaDevices.getUserMedia({audio:true});
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      mediaRecorder = new MediaRecorder(mediaStream, mimeType ? {mimeType} : undefined);
      chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {type: chunks[0]?.type || "audio/webm"});
        const url = URL.createObjectURL(blob);
        if (recAudio){
          recAudio.src = url;
          recAudio.style.display = "block";
        }
        setRecStatus("Recording saved (play below).");
        if (recStop) recStop.disabled = true;
        if (recStart) recStart.disabled = false;
      };

      mediaRecorder.start();
      setRecStatus("Recording… (one take)");
      if (recStop) recStop.disabled = false;
      if (recStart) recStart.disabled = true;
      if (recHelp) recHelp.textContent = "";
    } catch(e){
      if (recHelp) recHelp.textContent = "Microphone permission denied or unavailable.";
    }
  }

  if (recStart) recStart.addEventListener("click", startRecording);
  if (recStop) recStop.addEventListener("click", () => stopRecordingIfAny(false));

  // ===== Writing tools =====
  const draft = $("#lt-email-draft");
  const wordEl = $("#lt-wordcount");
  if (draft && wordEl){
    const update = () => wordEl.textContent = String(wordsCount(draft.value));
    draft.addEventListener("input", update);
    update();
  }

  const clearBtn = $("#lt-write-clear");
  if (clearBtn && draft){
    clearBtn.addEventListener("click", () => {
      draft.value = "";
      if (wordEl) wordEl.textContent = "0";
    });
  }

  const sampleToggle = $("#lt-write-sample-toggle");
  const sampleBox = $("#lt-sample");
  const sampleTextEl = $("#lt-sample-text");

  const sampleText = [
    "Subject: Update – amended boarding sequence and guest communication plan",
    "",
    "Dear Operations Control,",
    "",
    "I’m writing to provide a quick update following the safety inspection flagged this morning. Boarding has been paused while we await final clearance from the engineer on site, and departure is currently forecast to be delayed by approximately 20 minutes.",
    "",
    "To manage guest impact, I have briefed the crew, delivered a calm public announcement with a clear update timeline, and coordinated accessibility assistance. Guest Services has been informed, and we are prioritising group cohesion for the two VIP groups scheduled at 14:00.",
    "",
    "Could you please confirm the expected clearance time and whether you would like us to implement the contingency plan if the delay exceeds 30 minutes?",
    "",
    "Kind regards,",
    "Train Manager"
  ].join("\n");

  if (sampleToggle && sampleBox && sampleTextEl){
    sampleTextEl.textContent = sampleText;
    sampleToggle.addEventListener("click", () => {
      const isHidden = sampleBox.hidden;
      sampleBox.hidden = !isHidden;
      sampleToggle.textContent = isHidden ? "Hide sample answer" : "Show sample answer";
    });
  }

  const toneBtn = $("#lt-write-tone-check");
  const toneTips = $("#lt-tone-tips");
  if (toneBtn && toneTips && draft){
    toneBtn.addEventListener("click", () => {
      const txt = (draft.value || "").toLowerCase();
      const tips = [];

      if (!/subject:/i.test(draft.value)) tips.push("Add a subject line (Subject: …).");
      if (!/(dear|hello)/.test(txt)) tips.push("Use a professional greeting: Dear … / Hello …");
      if (!/(could you|would it be possible|please confirm)/.test(txt)) tips.push("Add a clear request: “Could you confirm…?”");
      if (/(!!!|urgent!!!)/.test(draft.value)) tips.push("Avoid excessive exclamation marks; keep tone calm.");
      if (/(blame|fault|incompetent)/.test(txt)) tips.push("Avoid blaming language; stay neutral and factual.");
      if (!/(kind regards|best regards|sincerely)/.test(txt)) tips.push("Add a professional closing: Kind regards / Best regards.");

      toneTips.hidden = false;
      toneTips.innerHTML = "<h4>Tone tips</h4><ul>" + (tips.length ? tips.map(t=>`<li>${t}</li>`).join("") : "<li>Looks professional. Keep it concise and specific.</li>") + "</ul>";
    });
  }

  // ===== Role-play builder =====
  const rpForm = $("#lt-roleplay-form");
  const rpOut = $("#lt-roleplay-output");
  const rpReset = $("#lt-roleplay-reset");
  const rpListen = $("#lt-roleplay-listen");
  const rpStop = $("#lt-roleplay-stop");

  function buildRoleplay(){
    const name = ($("#lt-name")?.value || "").trim() || "Candidate";
    const scenario = $("#lt-scenario")?.value || "a disruption";
    const objective = $("#lt-objective")?.value || "manage the situation professionally";
    const tone = $("#lt-tone")?.value || "empathetic and diplomatic";
    const constraint = $("#lt-constraint")?.value || "time pressure";
    const update = $("#lt-update")?.value || "in 10 minutes";
    const smart = $("#lt-smart")?.value || "Let me summarise the key points";

    // Strong, exam-like dialogue structure
    const lines = [
      `Evaluator: Thanks for joining. Let’s discuss ${scenario}.`,
      `${name}: Of course. First, I want to acknowledge the impact on guests. I’ll keep this ${tone}.`,
      `Evaluator: Guests are getting impatient. What do you do right now?`,
      `${name}: I prioritise safety and clarity. I brief the crew, then make a clear announcement: what’s happening, what we can do, and when we’ll update.`,
      `Evaluator: What options do you offer?`,
      `${name}: We can provide an alternative activity in the waiting area, prioritise accessibility assistance, and keep VIP groups together where possible. ${smart}.`,
      `Evaluator: What’s your biggest constraint?`,
      `${name}: The main constraint is ${constraint}. That’s why I’ll communicate a precise update time: ${update}.`,
      `Evaluator: If the delay becomes longer, how do you escalate?`,
      `${name}: If it exceeds 30 minutes, I escalate to Operations Control, propose the contingency plan, and document actions taken. I also coordinate with Guest Services to protect the brand image.`,
      `Evaluator: What is the outcome you want?`,
      `${name}: My objective is to ${objective}. I’ll confirm next steps in writing and keep communication consistent.`
    ];
    return lines.join("\n");
  }

  if (rpForm && rpOut){
    rpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      rpOut.value = buildRoleplay();
    });
  }

  if (rpReset && rpOut && rpForm){
    rpReset.addEventListener("click", () => {
      rpForm.reset();
      rpOut.value = "";
    });
  }

  if (rpListen && rpOut){
    rpListen.addEventListener("click", () => {
      const txt = (rpOut.value || "").trim();
      if (!txt) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt.replace(/\n/g, " "));
      u.lang = "en-GB";
      const v = pickVoice("en-GB") || pickVoice("en-US");
      if (v) u.voice = v;
      u.rate = 0.98;
      speechSynthesis.speak(u);
    });
  }
  if (rpStop){
    rpStop.addEventListener("click", () => speechSynthesis.cancel());
  }

})();