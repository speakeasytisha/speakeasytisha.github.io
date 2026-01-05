/* CLOE Exam Prep – page-specific JS
   Robust, null-safe, GitHub Pages friendly. No external deps.
*/
(function(){
  'use strict';

  // ---------- helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const errorBox = $("#ce-error");
  function showError(msg){
    if(!errorBox) return;
    errorBox.hidden = false;
    errorBox.textContent = "JavaScript error: " + msg;
  }

  window.addEventListener("error", (e) => {
    if(!e) return;
    const msg = e.message || (e.error && e.error.message) || String(e);
    showError(msg);
  });

  // ---------- accent + speech ----------
  const ACCENT_KEY = "se_cloe_accent";
  let accent = (localStorage.getItem(ACCENT_KEY) || "us");
  let voices = [];
  let voiceReady = false;

  function normalizeAccent(a){
    return (a === "uk") ? "uk" : "us";
  }
  accent = normalizeAccent(accent);

  function loadVoices(){
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    voiceReady = voices.length > 0;
    updateVoiceNote();
  }
  function bestVoice(){
    if(!voiceReady) return null;
    const wantLang = accent === "uk" ? "en-GB" : "en-US";
    const prefer = voices.filter(v => (v.lang || "").toLowerCase().startsWith(wantLang.toLowerCase()));
    if(prefer.length) return prefer[0];
    const anyEn = voices.filter(v => (v.lang || "").toLowerCase().startsWith("en"));
    return anyEn[0] || voices[0] || null;
  }

  function speak(text, opts={}){
    if(!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)){
      updateVoiceNote("No speech engine available on this device.");
      return false;
    }
    const u = new SpeechSynthesisUtterance(text);
    const v = bestVoice();
    if(v) u.voice = v;
    u.rate = typeof opts.rate === "number" ? opts.rate : 0.95;
    u.pitch = typeof opts.pitch === "number" ? opts.pitch : 1.0;
    u.volume = typeof opts.volume === "number" ? opts.volume : 1.0;
    // some browsers need cancel first
    try{ speechSynthesis.cancel(); }catch(_){}
    speechSynthesis.speak(u);
    return true;
  }

  function updateVoiceNote(extra){
    const note = $("#ce-voice-note");
    if(!note) return;
    const base = "Tip: If you don’t hear audio, your browser/device may block speech. You can still do all tasks by reading.";
    const v = bestVoice();
    const vtxt = v ? ` Voice: ${v.name} (${v.lang}).` : " Voice: not detected yet.";
    note.textContent = (extra ? (extra + " ") : "") + base + vtxt;
  }

  // handle voices list changes (Chrome)
  if("speechSynthesis" in window){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }else{
    updateVoiceNote("Speech not supported.");
  }

  // accent UI
  function syncAccentUI(){
    $$(".ce-seg-btn").forEach(btn => {
      const a = normalizeAccent(btn.getAttribute("data-accent"));
      btn.classList.toggle("is-active", a === accent);
    });
    localStorage.setItem(ACCENT_KEY, accent);
    updateVoiceNote();
  }

  function wireAccent(){
    $$(".ce-seg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        accent = normalizeAccent(btn.getAttribute("data-accent"));
        syncAccentUI();
      });
    });
    syncAccentUI();
  }

  // ---------- name personalize ----------
  let studentName = "";
  function applyName(){
    const inp = $("#ce-student-name");
    studentName = (inp && inp.value ? inp.value.trim() : "");
    const hint = studentName ? `Nice — prompts will use "${studentName}".` : "Prompts stay generic.";
    const note = $("#ce-voice-note");
    if(note) note.dataset.nameHint = hint; // non-visual
    refreshOralPrompts();
  }

  // ---------- TASK TOUR ----------
  const stage = $("#ce-task-stage");
  const stageTitle = $("#ce-stage-title");
  const stageBody = $("#ce-stage-body");
  const stageReset = $("#ce-stage-reset");
  const stageClose = $("#ce-stage-close");

  let currentTask = null;

  function clearStage(){
    if(stageTitle) stageTitle.textContent = "Choose a task above";
    if(stageBody) stageBody.innerHTML = `<p class="ce-muted">Tip: Start with MCQ or listening to check your level.</p>`;
    if(stageReset) stageReset.disabled = true;
    if(stageClose) stageClose.disabled = true;
    currentTask = null;
  }

  function openStage(title, renderer){
    if(stageTitle) stageTitle.textContent = title;
    if(stageReset) stageReset.disabled = false;
    if(stageClose) stageClose.disabled = false;
    currentTask = renderer;
    renderer();
    stage?.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function taskMCQ(){
    const Q = {
      title: "MCQ · Grammar (polite requests)",
      prompt: "Choose the most natural option in a professional email:",
      question: "“____ you please confirm the meeting time?”",
      choices: [
        {t:"Can", ok:false, why:"“Can” is okay, but a bit more direct in formal email."},
        {t:"Could", ok:true, why:"“Could you please…” is polite and professional."},
        {t:"Do", ok:false, why:"Not correct structure here."},
        {t:"Must", ok:false, why:"Too strong; not a request."}
      ]
    };

    stageBody.innerHTML = `
      <div class="ce-q">
        <p class="ce-q-title">${Q.title}</p>
        <p class="ce-q-sub">${Q.prompt}</p>
        <div class="ce-q-title" style="font-weight:900;">${Q.question}</div>
        <div class="ce-choices" id="ce-mcq-choices"></div>
        <div class="ce-feedback" id="ce-mcq-fb">Click an answer to see feedback.</div>
      </div>
    `;

    const choicesBox = $("#ce-mcq-choices");
    const fb = $("#ce-mcq-fb");
    if(!choicesBox || !fb) return;

    Q.choices.forEach((c, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ce-choice";
      b.textContent = c.t;
      b.addEventListener("click", () => {
        $$(".ce-choice", choicesBox).forEach(x => x.disabled = true);
        b.classList.add(c.ok ? "is-correct" : "is-wrong");
        fb.innerHTML = (c.ok ? "✅ Correct. " : "❌ Not the best choice. ") + c.why;
      });
      choicesBox.appendChild(b);
    });
  }

  function taskCloze(){
    const answer = "availability";
    stageBody.innerHTML = `
      <div class="ce-q">
        <p class="ce-q-title">Gap-fill · Business vocabulary</p>
        <p class="ce-q-sub">Type the missing word. (Hint: schedule)</p>
        <div class="ce-q-title" style="font-weight:900;">
          “Could you please confirm your <span style="text-decoration:underline;">__________</span> for Thursday?”
        </div>
        <div class="ce-row" style="margin-top:10px;">
          <input class="ce-input" id="ce-cloze-inp" type="text" placeholder="Type one word" />
          <button class="ce-btn ce-btn-primary" type="button" id="ce-cloze-check">Check</button>
        </div>
        <div class="ce-feedback" id="ce-cloze-fb">Your answer will be checked instantly.</div>
      </div>
    `;
    const inp = $("#ce-cloze-inp");
    const check = $("#ce-cloze-check");
    const fb = $("#ce-cloze-fb");
    if(!inp || !check || !fb) return;
    check.addEventListener("click", () => {
      const v = (inp.value || "").trim().toLowerCase();
      if(v === answer){
        fb.innerHTML = "✅ Correct. <strong>availability</strong> = when you are free.";
      }else{
        fb.innerHTML = "❌ Try again. Tip: “confirm your …” → <strong>availability</strong>.";
      }
    });
  }

  function taskListening(){
    let listens = 0;
    const maxListens = 2;
    const prompt = "Listen and choose the correct answer.";
    const audioText = "Hello, this is Jordan. I’m running late. Can we move our call to Thursday at three p.m.? Thanks.";
    const question = "When is the new meeting time?";
    const choices = [
      {t:"Wednesday at 3 p.m.", ok:false},
      {t:"Thursday at 3 p.m.", ok:true},
      {t:"Friday at 3 p.m.", ok:false},
    ];

    stageBody.innerHTML = `
      <div class="ce-q">
        <p class="ce-q-title">Listening + MCQ</p>
        <p class="ce-q-sub">${prompt} <strong>${maxListens}</strong> listens max.</p>

        <div class="ce-row" style="gap:10px; flex-wrap:wrap;">
          <button class="ce-btn ce-btn-primary" type="button" id="ce-listen-btn">🔊 Listen</button>
          <span class="ce-tag" id="ce-listen-count">0/${maxListens} listens used</span>
          <button class="ce-btn ce-btn-ghost" type="button" id="ce-listen-show">Show transcript</button>
        </div>

        <div class="ce-feedback" id="ce-listen-trans" hidden>${audioText}</div>

        <div class="ce-q-title" style="margin-top:12px; font-weight:900;">${question}</div>
        <div class="ce-choices" id="ce-listen-choices"></div>
        <div class="ce-feedback" id="ce-listen-fb">Click an answer after listening.</div>
      </div>
    `;

    const listenBtn = $("#ce-listen-btn");
    const listenCount = $("#ce-listen-count");
    const showBtn = $("#ce-listen-show");
    const trans = $("#ce-listen-trans");
    const choicesBox = $("#ce-listen-choices");
    const fb = $("#ce-listen-fb");
    if(!listenBtn || !listenCount || !showBtn || !trans || !choicesBox || !fb) return;

    showBtn.addEventListener("click", () => {
      trans.hidden = !trans.hidden;
      showBtn.textContent = trans.hidden ? "Show transcript" : "Hide transcript";
    });

    listenBtn.addEventListener("click", () => {
      if(listens >= maxListens) return;
      const ok = speak(audioText, {rate: 0.93});
      if(!ok){
        fb.textContent = "Audio not available on this device. Use the transcript instead.";
        trans.hidden = false;
      }
      listens++;
      listenCount.textContent = `${listens}/${maxListens} listens used`;
      if(listens >= maxListens){
        listenBtn.disabled = true;
        listenBtn.textContent = "🔊 Listen (used)";
      }
    });

    choices.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ce-choice";
      b.textContent = c.t;
      b.addEventListener("click", () => {
        $$(".ce-choice", choicesBox).forEach(x => x.disabled = true);
        b.classList.add(c.ok ? "is-correct" : "is-wrong");
        fb.innerHTML = c.ok
          ? "✅ Correct. The speaker says: “Thursday at three p.m.”"
          : "❌ Not correct. Listen for the day + time.";
      });
      choicesBox.appendChild(b);
    });
  }

  function taskReading(){
    const text = `From: IT Support
Subject: Access request — action needed

Hi,
Your account request has been approved. Please set up multi-factor authentication (MFA) by 5 p.m. today.
If you need help, reply to this email.

Thanks,
IT Support`;

    stageBody.innerHTML = `
      <div class="ce-q">
        <p class="ce-q-title">Reading comprehension</p>
        <p class="ce-q-sub">Read quickly. Answer what the text actually says.</p>
        <pre class="ce-feedback" style="white-space:pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${text}</pre>
        <div class="ce-q-title" style="font-weight:900;">What must the reader do today?</div>
        <div class="ce-choices" id="ce-read-choices"></div>
        <div class="ce-feedback" id="ce-read-fb">Choose one answer.</div>
      </div>
    `;
    const choices = [
      {t:"Create a new account request", ok:false},
      {t:"Set up MFA by 5 p.m.", ok:true},
      {t:"Call IT tomorrow", ok:false},
      {t:"Delete the email", ok:false},
    ];
    const box = $("#ce-read-choices");
    const fb = $("#ce-read-fb");
    if(!box || !fb) return;
    choices.forEach(c => {
      const b = document.createElement("button");
      b.type="button";
      b.className="ce-choice";
      b.textContent=c.t;
      b.addEventListener("click", () => {
        $$(".ce-choice", box).forEach(x => x.disabled = true);
        b.classList.add(c.ok ? "is-correct" : "is-wrong");
        fb.innerHTML = c.ok ? "✅ Correct." : "❌ The email says: set up MFA by 5 p.m. today.";
      });
      box.appendChild(b);
    });
  }

  function buildDndEmail(){
    const parts = [
      "Subject: Quick follow-up — next steps",
      "Hi Taylor,",
      "Following our call, I’m sharing the updated timeline.",
      "Could you please confirm your availability for a 20-minute check-in tomorrow?",
      "Best regards,",
      "Jordan Lee"
    ];
    const slots = [
      {label:"1) Subject line", accept:"Subject: Quick follow-up — next steps"},
      {label:"2) Greeting", accept:"Hi Taylor,"},
      {label:"3) Context", accept:"Following our call, I’m sharing the updated timeline."},
      {label:"4) Request / action", accept:"Could you please confirm your availability for a 20-minute check-in tomorrow?"},
      {label:"5) Closing", accept:"Best regards,"},
      {label:"6) Signature", accept:"Jordan Lee"},
    ];

    stageBody.innerHTML = `
      <div class="ce-q">
        <p class="ce-q-title">Drag & drop · Build a professional email</p>
        <p class="ce-q-sub">Drag each line into the correct slot. (Mobile tip: click a line to send it to the next empty slot.)</p>
        <div class="ce-dnd">
          <div class="ce-dnd-bank">
            <strong>Parts (drag these)</strong>
            <div id="ce-bank"></div>
            <button class="ce-btn ce-btn-secondary" type="button" id="ce-dnd-reset">Reset</button>
          </div>
          <div class="ce-dnd-slots">
            <strong>Email slots (drop here)</strong>
            <div id="ce-slots"></div>
            <button class="ce-btn ce-btn-primary" type="button" id="ce-dnd-check">Check my email</button>
            <div class="ce-feedback" id="ce-dnd-fb">Build your email, then check.</div>
          </div>
        </div>
      </div>
    `;

    const bank = $("#ce-bank");
    const slotsBox = $("#ce-slots");
    const fb = $("#ce-dnd-fb");
    const reset = $("#ce-dnd-reset");
    const check = $("#ce-dnd-check");
    if(!bank || !slotsBox || !fb || !reset || !check) return;

    const state = { items: [...parts], slotValues: Array(slots.length).fill("") };
    let dragValue = "";

    function render(){
      // bank
      bank.innerHTML = "";
      state.items.forEach((t) => {
        const el = document.createElement("div");
        el.className = "ce-draggable";
        el.draggable = true;
        el.textContent = t;
        el.addEventListener("dragstart", () => { dragValue = t; });
        el.addEventListener("click", () => {
          // click-to-place fallback
          const idx = state.slotValues.findIndex(v => !v);
          if(idx === -1) return;
          placeIntoSlot(idx, t);
        });
        bank.appendChild(el);
      });

      // slots
      slotsBox.innerHTML = "";
      slots.forEach((s, i) => {
        const d = document.createElement("div");
        d.className = "ce-drop";
        d.dataset.idx = String(i);
        d.innerHTML = `
          <span class="ce-drop-label">${s.label}</span>
          <span class="ce-drop-slot">${state.slotValues[i] ? state.slotValues[i] : "Drop here"}</span>
        `;
        d.addEventListener("dragover", (e) => { e.preventDefault(); d.classList.add("is-over"); });
        d.addEventListener("dragleave", () => d.classList.remove("is-over"));
        d.addEventListener("drop", (e) => {
          e.preventDefault();
          d.classList.remove("is-over");
          if(!dragValue) return;
          placeIntoSlot(i, dragValue);
        });
        d.addEventListener("click", () => {
          // click to remove
          if(!state.slotValues[i]) return;
          const val = state.slotValues[i];
          state.slotValues[i] = "";
          state.items.push(val);
          render();
        });
        slotsBox.appendChild(d);
      });
    }

    function placeIntoSlot(i, value){
      if(state.slotValues[i]) return; // filled
      const idx = state.items.indexOf(value);
      if(idx === -1) return;
      state.items.splice(idx, 1);
      state.slotValues[i] = value;
      dragValue = "";
      render();
    }

    function grade(){
      let correct = 0;
      slots.forEach((s, i) => {
        if(state.slotValues[i] === s.accept) correct++;
      });
      if(correct === slots.length){
        fb.innerHTML = "✅ Perfect email order. Professional + clear.";
      }else{
        fb.innerHTML = `❌ Not yet. You have ${correct}/${slots.length} in the best slot. Tip: subject → greeting → context → request → closing → signature.`;
      }
    }

    reset.addEventListener("click", () => {
      state.items = [...parts];
      state.slotValues = Array(slots.length).fill("");
      fb.textContent = "Build your email, then check.";
      render();
    });
    check.addEventListener("click", grade);

    render();
  }

  function taskOrderSentence(){
    const target = "I’d like to reschedule the meeting to Thursday.";
    const tokens = ["Thursday","I’d","meeting","to","reschedule","the","like","to","."];
    stageBody.innerHTML = `
      <div class="ce-q">
        <p class="ce-q-title">Sentence order</p>
        <p class="ce-q-sub">Click words to build the sentence in order.</p>

        <div class="ce-panel" style="margin-top:10px;">
          <strong>Word bank</strong>
          <div id="ce-order-bank" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;"></div>
        </div>

        <div class="ce-panel" style="margin-top:10px;">
          <strong>Your sentence</strong>
          <div id="ce-order-out" style="margin-top:10px; font-weight:950;"></div>
          <div class="ce-row" style="margin-top:10px;">
            <button class="ce-btn ce-btn-primary" type="button" id="ce-order-check">Check</button>
            <button class="ce-btn ce-btn-secondary" type="button" id="ce-order-reset">Reset</button>
            <button class="ce-btn ce-btn-ghost" type="button" id="ce-order-listen">🔊 Listen</button>
          </div>
          <div class="ce-feedback" id="ce-order-fb">Build the sentence, then check.</div>
        </div>
      </div>
    `;
    const bank = $("#ce-order-bank");
    const out = $("#ce-order-out");
    const check = $("#ce-order-check");
    const reset = $("#ce-order-reset");
    const listen = $("#ce-order-listen");
    const fb = $("#ce-order-fb");
    if(!bank || !out || !check || !reset || !listen || !fb) return;

    let remaining = [...tokens];
    let built = [];

    function render(){
      bank.innerHTML = "";
      remaining.forEach((w, idx) => {
        const b = document.createElement("button");
        b.type="button";
        b.className="ce-btn ce-btn-secondary";
        b.textContent = w;
        b.addEventListener("click", () => {
          built.push(w);
          remaining.splice(idx, 1);
          render();
        });
        bank.appendChild(b);
      });
      out.textContent = built.join(" ").replace(" .", ".");
    }

    check.addEventListener("click", () => {
      const sentence = built.join(" ").replace(" .", ".").trim();
      if(sentence === target){
        fb.innerHTML = "✅ Correct sentence. Nice polite register.";
      }else{
        fb.innerHTML = "❌ Not quite. Target: <strong>" + target + "</strong>";
      }
    });
    reset.addEventListener("click", () => {
      remaining = [...tokens];
      built = [];
      fb.textContent = "Build the sentence, then check.";
      render();
    });
    listen.addEventListener("click", () => {
      const sentence = built.join(" ").replace(" .", ".").trim() || target;
      speak(sentence, {rate: 0.95});
    });

    render();
  }

  const TASKS = {
    "mcq": { title: "MCQ · Grammar", run: taskMCQ },
    "cloze": { title: "Gap-fill", run: taskCloze },
    "listening": { title: "Listening + MCQ", run: taskListening },
    "reading": { title: "Reading comprehension", run: taskReading },
    "drag-email": { title: "Drag & drop · Email order", run: buildDndEmail },
    "order-sentence": { title: "Sentence order", run: taskOrderSentence },
  };

  function wireTaskTour(){
    $$("[data-open-task]").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-open-task");
        const t = TASKS[key];
        if(!t) return;
        openStage(t.title, t.run);
      });
    });

    stageReset?.addEventListener("click", () => {
      if(currentTask) currentTask();
    });
    stageClose?.addEventListener("click", () => clearStage());
  }

  // ---------- FLASHCARDS ----------
  const FLASH = [
    {term:"availability", def:"When you are free for a meeting or call.", ex:"Could you confirm your availability for Thursday?", us:null, uk:null},
    {term:"to reschedule", def:"To change the time/date of an appointment.", ex:"Can we reschedule to next Monday?", us:null, uk:null},
    {term:"follow-up", def:"A message or action after a previous contact.", ex:"I’m sending a quick follow-up after our call.", us:null, uk:null},
    {term:"to escalate", def:"To pass a problem to a higher level/person/team.", ex:"I’ll escalate this to IT Support.", us:null, uk:null},
    {term:"deadline", def:"The latest time something must be done.", ex:"The deadline is Friday at 5 p.m.", us:null, uk:null},
    {term:"timetable / schedule", def:"Plan of times. UK often says timetable; US usually says schedule.", ex:"We’re on an amended schedule today.", us:"schedule", uk:"timetable"},
    {term:"holiday / vacation", def:"Time off work. UK often says holiday; US usually says vacation.", ex:"I’m on vacation next week.", us:"vacation", uk:"holiday"},
    {term:"CV / resume", def:"A document summarising your experience. UK: CV; US: resume.", ex:"Please send your resume/CV by email.", us:"resume", uk:"CV"},
    {term:"lift / elevator", def:"UK: lift; US: elevator.", ex:"Take the lift/elevator to the 3rd floor.", us:"elevator", uk:"lift"},
    {term:"queue / line", def:"UK: queue; US: line.", ex:"Please wait in line / in the queue.", us:"line", uk:"queue"},
    {term:"postcode / zip code", def:"UK: postcode; US: zip code.", ex:"What’s your zip code/postcode?", us:"zip code", uk:"postcode"},
    {term:"mobile / cell phone", def:"UK: mobile; US: cell phone.", ex:"I’ll call you on your mobile/cell.", us:"cell phone", uk:"mobile"},
  ];

  let cardIdx = 0;
  let cardSide = "front"; // front/back

  function renderCard(){
    const box = $("#ce-cardbox");
    const count = $("#ce-card-count");
    if(!box || !count) return;

    const c = FLASH[cardIdx];
    const title = (cardSide === "front") ? c.term : "Meaning + example";
    const body = (cardSide === "front")
      ? `
        <div class="ce-front">${c.term}</div>
        <div class="ce-muted">${(c.us && c.uk) ? `US: <strong>${c.us}</strong> · UK: <strong>${c.uk}</strong>` : "Tap to flip for meaning + example."}</div>
      `
      : `
        <div class="ce-front">${title}</div>
        <div class="ce-back">
          <div><strong>Definition:</strong> ${c.def}</div>
          <div style="margin-top:8px;"><strong>Example:</strong> ${c.ex}</div>
          ${(c.us && c.uk) ? `<div style="margin-top:8px;"><strong>US/UK:</strong> US says <strong>${c.us}</strong> · UK says <strong>${c.uk}</strong>.</div>` : ""}
        </div>
      `;

    box.innerHTML = body;
    count.textContent = `Card ${cardIdx+1} / ${FLASH.length}`;
  }

  function nextCard(){
    cardIdx = (cardIdx + 1) % FLASH.length;
    cardSide = "front";
    renderCard();
  }
  function prevCard(){
    cardIdx = (cardIdx - 1 + FLASH.length) % FLASH.length;
    cardSide = "front";
    renderCard();
  }
  function flipCard(){
    cardSide = (cardSide === "front") ? "back" : "front";
    renderCard();
  }
  function shuffleCards(){
    // Fisher-Yates shuffle in place
    for(let i=FLASH.length-1; i>0; i--){
      const j = Math.floor(Math.random() * (i+1));
      const tmp = FLASH[i]; FLASH[i] = FLASH[j]; FLASH[j] = tmp;
    }
    cardIdx = 0; cardSide = "front";
    renderCard();
  }

  function wireFlashcards(){
    $("#ce-card-prev")?.addEventListener("click", prevCard);
    $("#ce-card-next")?.addEventListener("click", nextCard);
    $("#ce-card-flip")?.addEventListener("click", flipCard);
    $("#ce-card-shuffle")?.addEventListener("click", shuffleCards);
    $("#ce-card-listen")?.addEventListener("click", () => {
      const c = FLASH[cardIdx];
      const text = (c.us && c.uk)
        ? `${c.term}. In American English: ${c.us}. In British English: ${c.uk}.`
        : `${c.term}. ${c.def}. Example: ${c.ex}`;
      speak(text, {rate: 0.92});
    });
    $("#ce-cardbox")?.addEventListener("click", flipCard);
    $("#ce-cardbox")?.addEventListener("keydown", (e) => {
      if(e.key === " "){ e.preventDefault(); flipCard(); }
      if(e.key === "ArrowRight"){ e.preventDefault(); nextCard(); }
      if(e.key === "ArrowLeft"){ e.preventDefault(); prevCard(); }
    });
    renderCard();
  }

  // ---------- MINI MOCK EXAM ----------
  // question types for the simulation
  const BANK = [
    {"id": "mcq1", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I ____ send it by 4 p.m.” (promise)", "a": ["will", "am going", "sent", "have"], "correct": 0, "why": "Promise → <b>will</b>."},
    {"id": "mcq2", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Would you mind ____ the file again?”", "a": ["send", "to send", "sending", "sent"], "correct": 2, "why": "<b>Would you mind</b> + <b>-ing</b>."},
    {"id": "mcq3", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I’m responsible ____ coordinating the team.”", "a": ["for", "to", "of", "with"], "correct": 0, "why": "Responsible <b>for</b>."},
    {"id": "mcq4", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“There ____ two meetings today.”", "a": ["is", "are", "am", "be"], "correct": 1, "why": "Plural → <b>there are</b>."},
    {"id": "mcq5", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Could you ____ a moment?”", "a": ["wait", "waiting", "to wait", "waits"], "correct": 0, "why": "Modal + base verb."},
    {"id": "mcq6", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Please find the report ____.”", "a": ["attached", "attaching", "attach", "attaches"], "correct": 0, "why": "Fixed phrase: Please find … <b>attached</b>."},
    {"id": "mcq7", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“We’ve ____ the issue since Monday.”", "a": ["had", "have", "having", "has"], "correct": 0, "why": "Present perfect: <b>have had</b>."},
    {"id": "mcq8", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I ____ to the client yesterday.”", "a": ["spoke", "have spoken", "speak", "am speaking"], "correct": 0, "why": "Finished past time → past simple."},
    {"id": "mcq9", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“We need it ____ Friday.”", "a": ["by", "until", "since", "for"], "correct": 0, "why": "Deadline → <b>by</b>."},
    {"id": "mcq10", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Let’s meet ____ 3 p.m.”", "a": ["at", "on", "in", "to"], "correct": 0, "why": "Times → <b>at</b>."},
    {"id": "mcq11", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I’ll call you when I ____ free.”", "a": ["am", "will be", "was", "be"], "correct": 0, "why": "Time clause → present: when I <b>am</b>."},
    {"id": "mcq12", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“If I ____ time, I’ll finish today.”", "a": ["have", "had", "will have", "having"], "correct": 0, "why": "First conditional: If + present."},
    {"id": "mcq13", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“We ____ consider other options.” (suggestion)", "a": ["should", "must", "can’t", "did"], "correct": 0, "why": "Suggestion → <b>should</b>."},
    {"id": "mcq14", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Could you ____ that, please?”", "a": ["repeat", "repeating", "repeated", "to repeating"], "correct": 0, "why": "Modal + base verb."},
    {"id": "mcq15", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I’d appreciate it if you could ____ receipt.”", "a": ["confirm", "confirmed", "confirming", "to confirm"], "correct": 0, "why": "Could + base verb."},
    {"id": "mcq16", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "Choose the best connector: “We missed the deadline ____ the supplier delay.”", "a": ["because of", "although", "however", "despite of"], "correct": 0, "why": "Noun phrase → <b>because of</b>."},
    {"id": "mcq17", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Despite ____ late, the project succeeded.”", "a": ["being", "be", "to be", "was"], "correct": 0, "why": "Despite + <b>-ing</b>."},
    {"id": "mcq18", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I’ve sent the invoice. ____ you check it?”", "a": ["Could", "Did", "Must", "Shouldn’t"], "correct": 0, "why": "Polite request → <b>Could</b>."},
    {"id": "mcq19", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“This solution is ____ than the previous one.”", "a": ["more efficient", "efficienter", "most efficient", "efficiency"], "correct": 0, "why": "Comparative: <b>more efficient</b>."},
    {"id": "mcq20", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I’m looking forward to ____ from you.”", "a": ["hear", "hearing", "to hear", "heard"], "correct": 1, "why": "Look forward to + <b>-ing</b>."},
    {"id": "mcq21", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Could you ____ me an update?”", "a": ["give", "giving", "gave", "to giving"], "correct": 0, "why": "Modal + base verb."},
    {"id": "mcq22", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“We’ve ____ finished the first draft.”", "a": ["just", "yet", "already", "still"], "correct": 0, "why": "<b>Just</b> = very recently."},
    {"id": "mcq23", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I haven’t received it ____.”", "a": ["yet", "just", "already", "still"], "correct": 0, "why": "Negative + present perfect → <b>yet</b>."},
    {"id": "mcq24", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“The report was completed ____ time.”", "a": ["on", "in", "at", "for"], "correct": 0, "why": "On time = not late."},
    {"id": "mcq25", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“We’ll discuss it ____ the meeting.”", "a": ["during", "between", "among", "at"], "correct": 0, "why": "During + noun."},
    {"id": "mcq26", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“Could you send it ____ email?”", "a": ["by", "with", "to", "on"], "correct": 0, "why": "By email."},
    {"id": "mcq27", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "Choose the correct: “I’m available ____ Monday and Wednesday.”", "a": ["between", "from", "among", "during"], "correct": 1, "why": "From Monday and Wednesday (i.e., on those days)."},
    {"id": "mcq28", "type": "mcq", "focus": "grammar", "skill": "Grammar", "prompt": "Choose the best option.", "q": "“I’ll be in a meeting, so I ____ answer right away.”", "a": ["may not", "must", "will", "can"], "correct": 0, "why": "Possibility/limitation → may not."},
    {"id": "clz1", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Could you confirm your ______ for Tuesday?”", "answer": "availability", "why": "Availability = when you are free."},
    {"id": "clz2", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“I’ll ______ this to IT support.”", "answer": "escalate", "why": "Escalate = pass to a higher level/team."},
    {"id": "clz3", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Please send me the ______ (bill) today.”", "answer": "invoice", "why": "Invoice = bill for services/products."},
    {"id": "clz4", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Let’s set a ______ for Friday 5 p.m.”", "answer": "deadline", "why": "Deadline = latest time to finish."},
    {"id": "clz5", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“I’ll ______ up by email tomorrow.”", "answer": "follow", "why": "Follow up = contact again for an update."},
    {"id": "clz6", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Could you share the meeting ______?”", "answer": "agenda", "why": "Agenda = list of meeting topics."},
    {"id": "clz7", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“We need your ______ to proceed.”", "answer": "approval", "why": "Approval = permission/agreement."},
    {"id": "clz8", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Please ______ receipt of this email.”", "answer": "acknowledge", "why": "Acknowledge receipt = confirm you received it."},
    {"id": "clz9", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Could you ______ the file to the message?”", "answer": "attach", "why": "Attach = add a file."},
    {"id": "clz10", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Let’s ______ the meeting to next week.”", "answer": "reschedule", "why": "Reschedule = change date/time."},
    {"id": "clz11", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“We need to ______ costs.”", "answer": "reduce", "why": "Reduce = lower."},
    {"id": "clz12", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Can you ______ the figures?”", "answer": "update", "why": "Update = make current."},
    {"id": "clz13", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Please ______ the form.”", "answer": "complete", "why": "Complete = fill in / finish."},
    {"id": "clz14", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“I’m writing to ______ an issue.”", "answer": "report", "why": "Report an issue = tell officially."},
    {"id": "clz15", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Could you ______ the link?”", "answer": "share", "why": "Share = send access."},
    {"id": "clz16", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“We need to meet our ______.”", "answer": "targets", "why": "Targets = goals."},
    {"id": "clz17", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Please ______ the meeting minutes.”", "answer": "review", "why": "Review = check carefully."},
    {"id": "clz18", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“I’ll ______ you in later today.”", "answer": "call", "why": "Call you later today."},
    {"id": "clz19", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“We need a quick ______ (decision).”", "answer": "decision", "why": "Decision = choice."},
    {"id": "clz20", "type": "cloze", "focus": "vocab", "skill": "Vocabulary", "prompt": "Type the missing word (one word).", "q": "“Could you ______ the address?”", "answer": "confirm", "why": "Confirm = verify it’s correct."},
    {"id": "rd1", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "From: HR\nSubject: Onboarding — first day\n\nPlease arrive at 9:00 and bring an ID. Your badge will be ready at reception.\n\nThanks.", "q": "What time should the person arrive?", "a": ["8:00", "9:00", "10:00", "After lunch"], "correct": 1, "why": "It says: arrive at 9:00."},
    {"id": "rd2", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Room change\n\nYour meeting has moved from Room B to Room D (4th floor).", "q": "Where is the new room?", "a": ["Room B", "Room D on the 4th floor", "Room D on the 2nd floor", "Reception"], "correct": 1, "why": "It says: Room D (4th floor)."},
    {"id": "rd3", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Delivery update\n\nDue to a delay at customs, the shipment will arrive on Friday morning.\nPlease inform the client and update tracking notes.", "q": "When will the shipment arrive?", "a": ["Thursday afternoon", "Friday morning", "Today", "Next week"], "correct": 1, "why": "It says: Friday morning."},
    {"id": "rd4", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Invoice question\n\nCould you confirm whether VAT is included on invoice #4821?", "q": "What does the sender want?", "a": ["A refund", "VAT confirmation", "A password reset", "A meeting invite"], "correct": 1, "why": "They ask if VAT is included."},
    {"id": "rd5", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Notice\n\nFire drill at 2:00 p.m.\nUse the stairs. Do not use the lift/elevator.", "q": "What should you use during the drill?", "a": ["The lift/elevator", "The stairs", "Your car", "The cafeteria"], "correct": 1, "why": "The notice says: use the stairs."},
    {"id": "rd6", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Timesheet reminder\n\nPlease submit your timesheet by Wednesday 12:00. Late submissions may delay payment.", "q": "What is the deadline?", "a": ["Wednesday at noon", "Wednesday evening", "Friday", "No deadline"], "correct": 0, "why": "Submit by Wednesday 12:00."},
    {"id": "rd7", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Access approved\n\nYour request has been approved. Please enable MFA by 5 p.m. today.", "q": "What must the person do today?", "a": ["Enable MFA by 5 p.m.", "Request approval again", "Disable MFA", "Call tomorrow"], "correct": 0, "why": "Enable MFA by 5 p.m."},
    {"id": "rd8", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Apology\n\nI’m sorry for the delay. The report will be ready tomorrow morning.", "q": "When will the report be ready?", "a": ["Today", "Tomorrow morning", "Next week", "Never"], "correct": 1, "why": "Ready tomorrow morning."},
    {"id": "rd9", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Meeting cancellation\n\nI need to cancel today’s call. I’ll send new times shortly.", "q": "What will happen next?", "a": ["No more contact", "New times will be sent", "The call continues", "The project ends"], "correct": 1, "why": "They will send new times."},
    {"id": "rd10", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Visitor\n\nPlease meet the visitor at reception at 3:30 and escort them to Meeting Room 2.", "q": "What should you do?", "a": ["Meet at 3:30 and escort to Room 2", "Stay at your desk", "Go home early", "Call IT"], "correct": 0, "why": "Meet and escort."},
    {"id": "rd11", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Password reset\n\nClick the link to reset your password. The link expires in 30 minutes.", "q": "How long is the link valid?", "a": ["30 minutes", "30 days", "3 hours", "No expiry"], "correct": 0, "why": "Expires in 30 minutes."},
    {"id": "rd12", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Parking\n\nVisitor parking is full today. Please use the public car park next to the station.", "q": "Where should you park?", "a": ["Visitor parking", "Public car park next to the station", "On the sidewalk", "In the garage"], "correct": 1, "why": "Use the public car park next to the station."},
    {"id": "rd13", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Budget\n\nPlease keep the total under €500 and send your estimate by Friday.", "q": "What is the budget limit?", "a": ["€50", "€500", "€5,000", "No limit"], "correct": 1, "why": "Total under €500."},
    {"id": "rd14", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Training\n\nYour training session starts at 2 p.m. Please join five minutes early.", "q": "When should you join?", "a": ["At 1:55", "At 2:00 exactly", "At 2:10", "Tomorrow"], "correct": 0, "why": "Join five minutes early."},
    {"id": "rd15", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: File name\n\nPlease rename the document to “Q1_Report_Final” and upload it to the shared folder.", "q": "What should you do?", "a": ["Print it", "Rename + upload to shared folder", "Delete it", "Email the password"], "correct": 1, "why": "Rename and upload."},
    {"id": "rd16", "type": "reading", "focus": "reading", "skill": "Reading", "prompt": "Read and choose the best answer.", "text": "Subject: Request\n\nCould you send the updated price list and confirm the delivery date?", "q": "What are they asking for?", "a": ["Updated price list + delivery date", "A holiday request", "A complaint form", "A new phone"], "correct": 0, "why": "Price list + delivery date."},
    {"id": "ls1", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Hi, this is Sam. I can’t join the 9 a.m. call. Could we move it to eleven o’clock today?", "q": "What time is the new call?", "a": ["9 a.m.", "10 a.m.", "11 a.m.", "Tomorrow"], "correct": 2, "why": "Eleven o’clock today."},
    {"id": "ls2", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Good morning. The meeting starts in ten minutes in Room D on the fourth floor.", "q": "Where is the meeting?", "a": ["Room B, 2nd floor", "Room D, 4th floor", "Reception", "Online only"], "correct": 1, "why": "Room D on the fourth floor."},
    {"id": "ls3", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Please submit your expense report by Friday at five p.m. to avoid delays.", "q": "When is the deadline?", "a": ["Friday 5 p.m.", "Thursday 5 p.m.", "Friday morning", "No deadline"], "correct": 0, "why": "Friday at five p.m."},
    {"id": "ls4", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Hello, this is IT. Restart your laptop and try the Wi‑Fi again. If it still fails, call us back.", "q": "What is the first instruction?", "a": ["Call back immediately", "Restart the laptop", "Buy a new laptop", "Ignore Wi‑Fi"], "correct": 1, "why": "Restart the laptop."},
    {"id": "ls5", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Hi, can you email me the updated invoice and confirm whether VAT is included?", "q": "What does the speaker ask for?", "a": ["A refund", "Updated invoice + VAT confirmation", "A hotel booking", "A passport"], "correct": 1, "why": "Updated invoice + VAT check."},
    {"id": "ls6", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Attention please: the fire drill will begin at two p.m. Use the stairs, not the lift.", "q": "What should you use?", "a": ["The lift", "The stairs", "The taxi", "The cafeteria"], "correct": 1, "why": "Use the stairs."},
    {"id": "ls7", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Hi, I’m running late. I’ll arrive at about three thirty instead of three.", "q": "When will the person arrive?", "a": ["3:00", "3:30", "4:00", "Tomorrow"], "correct": 1, "why": "Around 3:30."},
    {"id": "ls8", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Please spell your email address slowly, letter by letter.", "q": "What do they want you to do?", "a": ["Say your password", "Spell your email address", "Pay now", "Leave the building"], "correct": 1, "why": "Spell the email address."},
    {"id": "ls9", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Could you send me the agenda for tomorrow’s meeting before noon?", "q": "When do they want the agenda?", "a": ["Before noon", "After lunch", "Next week", "No rush"], "correct": 0, "why": "Before noon."},
    {"id": "ls10", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Hi, the delivery has been delayed. The package should arrive on Friday morning.", "q": "When will the package arrive?", "a": ["Thursday morning", "Friday morning", "Friday evening", "Saturday"], "correct": 1, "why": "Friday morning."},
    {"id": "ls11", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Hello, the training starts at two p.m. Please join five minutes early.", "q": "When should you join?", "a": ["At 1:55", "At 2:00", "At 2:10", "Tomorrow"], "correct": 0, "why": "Five minutes early."},
    {"id": "ls12", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Please keep the total under five hundred euros and send your estimate by Friday.", "q": "What is the budget limit?", "a": ["€50", "€500", "€5,000", "No limit"], "correct": 1, "why": "Under €500."},
    {"id": "ls13", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Hi, I’ve attached the report. Could you review it and share feedback today?", "q": "What does the speaker want?", "a": ["Feedback today", "A refund", "A phone call tomorrow", "Nothing"], "correct": 0, "why": "Review + feedback today."},
    {"id": "ls14", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Could we reschedule our meeting to next Wednesday at 10 a.m.?", "q": "When is the proposed meeting?", "a": ["Next Wednesday at 10 a.m.", "This Wednesday at 10 a.m.", "Next Friday at 10 a.m.", "Tomorrow"], "correct": 0, "why": "Next Wednesday at 10 a.m."},
    {"id": "ls15", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "Please meet the visitor at reception at three thirty and escort them to Meeting Room 2.", "q": "What should you do?", "a": ["Meet at reception at 3:30 and escort to Room 2", "Stay seated", "Call a taxi", "Cancel the meeting"], "correct": 0, "why": "Meet + escort."},
    {"id": "ls16", "type": "listening", "focus": "listening", "skill": "Listening", "prompt": "Listen and choose the best answer. (2 listens max)", "audio": "The password reset link expires in thirty minutes.", "q": "How long is the link valid?", "a": ["30 minutes", "30 days", "3 hours", "No expiry"], "correct": 0, "why": "30 minutes."},
    {"id": "ord1", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["Could", "you", "please", "confirm", "the", "deadline", "?"], "target": "Could you please confirm the deadline ?", "why": "Polite request."},
    {"id": "ord2", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["I’d", "like", "to", "reschedule", "the", "meeting", "to", "Thursday", "."], "target": "I’d like to reschedule the meeting to Thursday .", "why": "I’d like to + verb."},
    {"id": "ord3", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["Please", "find", "the", "report", "attached", "."], "target": "Please find the report attached .", "why": "Email phrase."},
    {"id": "ord4", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["Can", "we", "move", "the", "call", "to", "11", "a.m.", "?"], "target": "Can we move the call to 11 a.m. ?", "why": "Auxiliary + subject + verb."},
    {"id": "ord5", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["I’m", "sorry", "for", "the", "delay", "."], "target": "I’m sorry for the delay .", "why": "Apology."},
    {"id": "ord6", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["Could", "you", "spell", "your", "last", "name", "please", "?"], "target": "Could you spell your last name please ?", "why": "Polite request."},
    {"id": "ord7", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["The", "next", "step", "is", "to", "update", "the", "file", "."], "target": "The next step is to update the file .", "why": "is to + verb."},
    {"id": "ord8", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["I", "haven’t", "received", "it", "yet", "."], "target": "I haven’t received it yet .", "why": "Yet at end."},
    {"id": "ord9", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["We", "need", "it", "by", "Friday", "."], "target": "We need it by Friday .", "why": "Deadline by Friday."},
    {"id": "ord10", "type": "order", "focus": "grammar", "skill": "Word order", "prompt": "Put the words in order.", "tokens": ["Let’s", "meet", "at", "three", "p.m.", "."], "target": "Let’s meet at three p.m. .", "why": "Time at 3 p.m."}
  ];

  const sim = $("#ce-sim");
  const simBody = $("#ce-sim-body");
  const simBar = $("#ce-sim-bar-fill");
  const simCount = $("#ce-sim-count");
  const simScore = $("#ce-sim-score");
  const timerPill = $("#ce-timer-pill");
  const simNext = $("#ce-sim-next");
  const simSkip = $("#ce-sim-skip");
  const miniStart = $("#ce-mini-start");
  const miniReset = $("#ce-mini-reset");
  const results = $("#ce-results");
  const resultsLine = $("#ce-results-line");
  const strengths = $("#ce-results-strengths");
  const priorities = $("#ce-results-priorities");
  const again = $("#ce-results-again");

  let simState = null;
  let tick = null;

  function pickPool(focus){
    if(focus === "mix") return BANK.slice();
    return BANK.filter(x => x.focus === focus);
  }

  function startSim(){
    const lengthSel = $("#ce-mini-length");
    const focusSel = $("#ce-mini-focus");
    const speedSel = $("#ce-mini-speed");
    const n = parseInt(lengthSel?.value || "10", 10);
    const focus = focusSel?.value || "mix";
    const speed = speedSel?.value || "normal";

    const poolMain = pickPool(focus);

// Always have a full pool available (mix)
const poolAll = pickPool("mix");

// Safety: if focus pool is empty, fall back to mix
const main = (poolMain && poolMain.length) ? poolMain.slice() : poolAll.slice();

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

const chosen = [];
const used = new Set();

// Prefer the selected focus first (no repeats)
shuffle(main).forEach(item => {
  if(chosen.length >= n) return;
  if(!item || !item.id) return;
  if(used.has(item.id)) return;
  used.add(item.id);
  chosen.push(item);
});

// Top up with other task types to reach N (still no repeats)
if(chosen.length < n){
  shuffle(poolAll).forEach(item => {
    if(chosen.length >= n) return;
    if(!item || !item.id) return;
    if(used.has(item.id)) return;
    used.add(item.id);
    chosen.push(item);
  });
}

simState = {
      idx: 0,
      total: n,
      score: 0,
      bySkill: {},
      chosen,
      speed,
      answered: false
    };
    // If we had to top up with mixed questions, show a small note (once)
    simState._note = "";
    if((poolMain && poolMain.length) && n > poolMain.length){
      simState._note = `Note: “${focus}” focus has ${poolMain.length} unique questions here. We added other task types to reach ${n} without repeating the same question.`;
    }

    results && (results.hidden = true);
    sim && (sim.hidden = false);
    miniReset && (miniReset.disabled = false);
    renderSimQ();
  }

  function stopTimer(){
    if(tick){ clearInterval(tick); tick = null; }
  }

  function secondsFor(speed){
    return speed === "fast" ? 18 : 25;
  }

  function setTimerColor(ratio){
    if(!timerPill) return;
    timerPill.style.borderColor = "rgba(255,255,255,.16)";
    timerPill.style.background = "rgba(255,255,255,.06)";
    if(ratio <= 0.35){
      timerPill.style.borderColor = "rgba(239,68,68,.55)";
      timerPill.style.background = "rgba(239,68,68,.14)";
    }else if(ratio <= 0.65){
      timerPill.style.borderColor = "rgba(245,158,11,.55)";
      timerPill.style.background = "rgba(245,158,11,.14)";
    }else{
      timerPill.style.borderColor = "rgba(34,197,94,.45)";
      timerPill.style.background = "rgba(34,197,94,.12)";
    }
  }

  function startTimer(){
    stopTimer();
    let s = secondsFor(simState.speed);
    const total = s;
    if(timerPill) timerPill.textContent = `00:${String(s).padStart(2,"0")}`;
    setTimerColor(1);

    tick = setInterval(() => {
      s--;
      const ratio = clamp(s / total, 0, 1);
      if(timerPill) timerPill.textContent = `00:${String(Math.max(0,s)).padStart(2,"0")}`;
      setTimerColor(ratio);
      if(s <= 0){
        stopTimer();
        // auto-advance
        lockSim("⏱️ Time’s up. Skipping.");
        setTimeout(() => nextSim(), 700);
      }
    }, 1000);
  }

  function renderSimQ(){
    if(!simState || !simBody) return;
    simState.answered = false;
    if(simNext) simNext.disabled = true;

    const q = simState.chosen[simState.idx];
    const progress = (simState.idx / simState.total) * 100;
    if(simBar) simBar.style.width = `${progress}%`;
    if(simCount) simCount.textContent = `Question ${simState.idx+1} / ${simState.total}`;
    if(simScore) simScore.textContent = `Score: ${simState.score}`;

    // Optional note (only at question 1)
    const existing = document.getElementById("ce-sim-note");
    if(simState._note && simState.idx === 0){
      if(!existing){
        const note = document.createElement("div");
        note.id = "ce-sim-note";
        note.className = "ce-feedback";
        note.style.marginTop = "10px";
        note.innerHTML = "ℹ️ " + simState._note;
        simBody.prepend(note);
      }else{
        existing.innerHTML = "ℹ️ " + simState._note;
      }
    }else if(existing){
      existing.remove();
    }
// render per type
    if(q.type === "mcq"){
      simBody.innerHTML = `
        <div class="ce-q">
          <p class="ce-q-title">${q.skill} · MCQ</p>
          <p class="ce-q-sub">${q.prompt}</p>
          <div class="ce-q-title" style="font-weight:900;">${q.q}</div>
          <div class="ce-choices" id="ce-sim-choices"></div>
          <div class="ce-feedback" id="ce-sim-fb">Pick one answer.</div>
        </div>
      `;
      const box = $("#ce-sim-choices");
      const fb = $("#ce-sim-fb");
      q.a.forEach((t, i) => {
        const b = document.createElement("button");
        b.type="button";
        b.className="ce-choice";
        b.textContent=t;
        b.addEventListener("click", () => {
          if(simState.answered) return;
          simState.answered = true;
          $$(".ce-choice", box).forEach(x => x.disabled = true);
          b.classList.add(i===q.correct ? "is-correct" : "is-wrong");
          if(i===q.correct){
            simState.score++;
            simState.bySkill[q.skill] = (simState.bySkill[q.skill] || 0) + 1;
            fb.innerHTML = "✅ Correct. " + q.why;
          }else{
            fb.innerHTML = "❌ " + q.why;
          }
          if(simNext) simNext.disabled = false;
        });
        box.appendChild(b);
      });
    }

    if(q.type === "cloze"){
      simBody.innerHTML = `
        <div class="ce-q">
          <p class="ce-q-title">${q.skill} · Gap-fill</p>
          <p class="ce-q-sub">${q.prompt}</p>
          <div class="ce-q-title" style="font-weight:900;">${q.q}</div>
          <div class="ce-row" style="margin-top:10px;">
            <input class="ce-input" id="ce-sim-inp" type="text" placeholder="Type one word" />
            <button class="ce-btn ce-btn-primary" type="button" id="ce-sim-check">Check</button>
          </div>
          <div class="ce-feedback" id="ce-sim-fb">Check your answer.</div>
        </div>
      `;
      const inp = $("#ce-sim-inp");
      const check = $("#ce-sim-check");
      const fb = $("#ce-sim-fb");
      check.addEventListener("click", () => {
        if(simState.answered) return;
        const v = (inp.value||"").trim().toLowerCase();
        simState.answered = true;
        if(v === q.answer){
          simState.score++;
          simState.bySkill[q.skill] = (simState.bySkill[q.skill] || 0) + 1;
          fb.innerHTML = "✅ Correct. " + q.why;
        }else{
          fb.innerHTML = `❌ Correct answer: <strong>${q.answer}</strong>. ${q.why}`;
        }
        if(simNext) simNext.disabled = false;
      });
    }

    if(q.type === "reading"){
      simBody.innerHTML = `
        <div class="ce-q">
          <p class="ce-q-title">${q.skill} · Reading</p>
          <p class="ce-q-sub">${q.prompt}</p>
          <pre class="ce-feedback" style="white-space:pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${q.text}</pre>
          <div class="ce-q-title" style="font-weight:900;">${q.q}</div>
          <div class="ce-choices" id="ce-sim-choices"></div>
          <div class="ce-feedback" id="ce-sim-fb">Pick one answer.</div>
        </div>
      `;
      const box = $("#ce-sim-choices");
      const fb = $("#ce-sim-fb");
      q.a.forEach((t, i) => {
        const b = document.createElement("button");
        b.type="button";
        b.className="ce-choice";
        b.textContent=t;
        b.addEventListener("click", () => {
          if(simState.answered) return;
          simState.answered = true;
          $$(".ce-choice", box).forEach(x => x.disabled = true);
          b.classList.add(i===q.correct ? "is-correct" : "is-wrong");
          if(i===q.correct){
            simState.score++;
            simState.bySkill[q.skill] = (simState.bySkill[q.skill] || 0) + 1;
            fb.innerHTML = "✅ Correct. " + q.why;
          }else{
            fb.innerHTML = "❌ " + q.why;
          }
          if(simNext) simNext.disabled = false;
        });
        box.appendChild(b);
      });
    }

    if(q.type === "listening"){
      let listens = 0;
      const maxListens = 2;
      simBody.innerHTML = `
        <div class="ce-q">
          <p class="ce-q-title">${q.skill} · Listening</p>
          <p class="ce-q-sub">${q.prompt}</p>
          <div class="ce-row" style="gap:10px; flex-wrap:wrap;">
            <button class="ce-btn ce-btn-primary" type="button" id="ce-sim-listen">🔊 Listen</button>
            <span class="ce-tag" id="ce-sim-lcount">0/${maxListens} listens used</span>
            <button class="ce-btn ce-btn-ghost" type="button" id="ce-sim-trans">Show transcript</button>
          </div>
          <div class="ce-feedback" id="ce-sim-transbox" hidden>${q.audio}</div>

          <div class="ce-q-title" style="margin-top:12px; font-weight:900;">${q.q}</div>
          <div class="ce-choices" id="ce-sim-choices"></div>
          <div class="ce-feedback" id="ce-sim-fb">Pick one answer.</div>
        </div>
      `;
      const listenBtn = $("#ce-sim-listen");
      const lcount = $("#ce-sim-lcount");
      const transBtn = $("#ce-sim-trans");
      const transBox = $("#ce-sim-transbox");
      const box = $("#ce-sim-choices");
      const fb = $("#ce-sim-fb");

      transBtn.addEventListener("click", () => {
        transBox.hidden = !transBox.hidden;
        transBtn.textContent = transBox.hidden ? "Show transcript" : "Hide transcript";
      });

      listenBtn.addEventListener("click", () => {
        if(listens >= maxListens) return;
        const ok = speak(q.audio, {rate:0.92});
        listens++;
        lcount.textContent = `${listens}/${maxListens} listens used`;
        if(!ok){
          transBox.hidden = false;
          fb.textContent = "Audio not available — use the transcript.";
        }
        if(listens >= maxListens){
          listenBtn.disabled = true;
          listenBtn.textContent = "🔊 Listen (used)";
        }
      });

      q.a.forEach((t, i) => {
        const b = document.createElement("button");
        b.type="button";
        b.className="ce-choice";
        b.textContent=t;
        b.addEventListener("click", () => {
          if(simState.answered) return;
          simState.answered = true;
          $$(".ce-choice", box).forEach(x => x.disabled = true);
          b.classList.add(i===q.correct ? "is-correct" : "is-wrong");
          if(i===q.correct){
            simState.score++;
            simState.bySkill[q.skill] = (simState.bySkill[q.skill] || 0) + 1;
            fb.innerHTML = "✅ Correct. " + q.why;
          }else{
            fb.innerHTML = "❌ " + q.why;
          }
          if(simNext) simNext.disabled = false;
        });
        box.appendChild(b);
      });
    }

    if(q.type === "order"){
      let remaining = q.tokens.slice();
      let built = [];
      simBody.innerHTML = `
        <div class="ce-q">
          <p class="ce-q-title">${q.skill} · Order</p>
          <p class="ce-q-sub">${q.prompt}</p>
          <div class="ce-panel">
            <strong>Word bank</strong>
            <div id="ce-sim-bank" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;"></div>
          </div>
          <div class="ce-panel" style="margin-top:10px;">
            <strong>Your sentence</strong>
            <div id="ce-sim-out" style="margin-top:10px; font-weight:950;"></div>
            <div class="ce-row" style="margin-top:10px;">
              <button class="ce-btn ce-btn-primary" type="button" id="ce-sim-check">Check</button>
              <button class="ce-btn ce-btn-secondary" type="button" id="ce-sim-reset">Reset</button>
              <button class="ce-btn ce-btn-ghost" type="button" id="ce-sim-listen">🔊 Listen</button>
            </div>
            <div class="ce-feedback" id="ce-sim-fb">Build the sentence, then check.</div>
          </div>
        </div>
      `;
      const bank = $("#ce-sim-bank");
      const out = $("#ce-sim-out");
      const check = $("#ce-sim-check");
      const reset = $("#ce-sim-reset");
      const listen = $("#ce-sim-listen");
      const fb = $("#ce-sim-fb");

      function render(){
        bank.innerHTML = "";
        remaining.forEach((w, idx) => {
          const b = document.createElement("button");
          b.type="button";
          b.className="ce-btn ce-btn-secondary";
          b.textContent=w;
          b.addEventListener("click", () => {
            built.push(w);
            remaining.splice(idx,1);
            render();
          });
          bank.appendChild(b);
        });
        out.textContent = built.join(" ").replace(" ?", " ?").replace(" .",".");
      }

      check.addEventListener("click", () => {
        if(simState.answered) return;
        simState.answered = true;
        const s = built.join(" ").trim();
        if(s === q.target){
          simState.score++;
          simState.bySkill[q.skill] = (simState.bySkill[q.skill] || 0) + 1;
          fb.innerHTML = "✅ Correct. " + q.why;
        }else{
          fb.innerHTML = `❌ Target: <strong>${q.target}</strong>. ` + q.why;
        }
        if(simNext) simNext.disabled = false;
      });
      reset.addEventListener("click", () => {
        remaining = q.tokens.slice();
        built = [];
        simState.answered = false;
        if(simNext) simNext.disabled = true;
        fb.textContent = "Build the sentence, then check.";
        render();
      });
      listen.addEventListener("click", () => {
        const s = built.join(" ").trim() || q.target;
        speak(s, {rate:0.95});
      });

      render();
    }

    startTimer();
  }

  function lockSim(msg){
    // display a feedback message if possible
    const fb = $("#ce-sim-fb");
    if(fb) fb.textContent = msg;
    simState.answered = true;
    if(simNext) simNext.disabled = false;
  }

  function nextSim(){
    stopTimer();
    if(!simState) return;
    simState.idx++;
    if(simState.idx >= simState.total){
      endSim();
      return;
    }
    renderSimQ();
  }

  function endSim(){
    stopTimer();
    if(sim) sim.hidden = true;

    const total = simState.total;
    const score = simState.score;
    const pct = Math.round((score/total)*100);

    // rough CEFR-ish guess for motivation (NOT official)
    let band = "A2";
    if(pct >= 85) band = "C1";
    else if(pct >= 72) band = "B2";
    else if(pct >= 58) band = "B1";
    else if(pct >= 42) band = "A2";
    else band = "A1";

    if(resultsLine){
      resultsLine.innerHTML = `You answered <strong>${score}/${total}</strong> correctly (${pct}%). Training estimate (unofficial): <strong>${band}</strong>.`;
    }

    // strengths = top skills
    if(strengths) strengths.innerHTML = "";
    if(priorities) priorities.innerHTML = "";

    const entries = Object.entries(simState.bySkill).sort((a,b)=>b[1]-a[1]);
    const top = entries.slice(0,3);
    const low = ["Grammar","Vocabulary","Reading","Listening","Word order"].filter(k => !(k in simState.bySkill));

    (top.length ? top : [["Consistency", score]]).forEach(([k, v]) => {
      const li = document.createElement("li");
      li.textContent = `${k}: ${v} correct`;
      strengths?.appendChild(li);
    });

    const pri = low.slice(0,3);
    pri.forEach(k => {
      const li = document.createElement("li");
      li.textContent = `${k}: practise this task type 10 minutes/day.`;
      priorities?.appendChild(li);
    });
    if(!pri.length){
      const li = document.createElement("li");
      li.textContent = "Keep mixing tasks: accuracy + speed + professional tone.";
      priorities?.appendChild(li);
    }

    if(results) results.hidden = false;
    results?.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function resetSim(){
    stopTimer();
    simState = null;
    sim && (sim.hidden = true);
    results && (results.hidden = true);
    miniReset && (miniReset.disabled = true);
    if(simBar) simBar.style.width = "0%";
  }

  function wireMini(){
    miniStart?.addEventListener("click", startSim);
    miniReset?.addEventListener("click", resetSim);
    simNext?.addEventListener("click", nextSim);
    simSkip?.addEventListener("click", () => { lockSim("Skipped."); nextSim(); });
    again?.addEventListener("click", () => {
      resetSim();
      startSim();
    });
  }

  // ---------- ORAL PROMPTS ----------
  const ORAL = {
    1: {
      prompt: () => `Introduce yourself and explain why you are taking the CLOE English certification${studentName ? `, ${studentName}` : ""}. Mention your job or studies.`,
      model: () => `Structure (30–60s):
1) Who you are + role
2) Why you need English (work context)
3) Your strengths + what you’re improving
4) Objective: “I’d like to reach B1/B2 for…”`
    },
    2: {
      prompt: () => `Role-play: You need to ask a colleague in IT for help. Your laptop can’t connect to Wi‑Fi before an important video call. Explain the problem, ask for a solution, and agree next steps.`,
      model: () => `Useful moves:
• Clarify: “Just to clarify, is the Wi‑Fi down for everyone?”
• Provide facts: time, device, what you tried
• Request: “Could you walk me through the steps?”
• Close: “So the next step is… Could you confirm?”`
    },
    3: {
      prompt: () => `Discussion: What are the pros and cons of remote work for companies? Give your opinion and one example.`,
      model: () => `Mini-argument:
1) Opinion
2) Advantage + example
3) Drawback + mitigation
4) Conclusion (“Overall…”)`
    }
  };

  function refreshOralPrompts(){
    const a = $("#ce-oral-1"), b = $("#ce-oral-2"), c = $("#ce-oral-3");
    if(a) a.textContent = ORAL[1].prompt();
    if(b) b.textContent = ORAL[2].prompt();
    if(c) c.textContent = ORAL[3].prompt();

    const m1 = $("#ce-model-1"), m2 = $("#ce-model-2"), m3 = $("#ce-model-3");
    if(m1) m1.textContent = ORAL[1].model();
    if(m2) m2.textContent = ORAL[2].model();
    if(m3) m3.textContent = ORAL[3].model();
  }

  function wireOralModels(){
    $$("[data-oral-model]").forEach(btn => {
      btn.addEventListener("click", () => {
        const k = btn.getAttribute("data-oral-model");
        const box = $("#ce-model-" + k);
        if(!box) return;
        box.hidden = !box.hidden;
        btn.textContent = box.hidden ? "Show model outline" : "Hide model outline";
      });
    });
  }

  // simple oral timers (one at a time)
  let oralTick = null;
  function startOralTimer(seconds){
    stopOralTimer();
    const tag = $("#ce-mic-status");
    let s = seconds;
    if(tag) tag.textContent = `Timer: ${s}s`;
    oralTick = setInterval(() => {
      s--;
      if(tag) tag.textContent = `Timer: ${s}s`;
      if(s <= 0){
        stopOralTimer();
        if(tag) tag.textContent = "Timer: done ✅";
      }
    }, 1000);
  }
  function stopOralTimer(){
    if(oralTick){ clearInterval(oralTick); oralTick = null; }
  }

  function wireOralTimers(){
    $$("[data-oral-timer]").forEach(btn => {
      btn.addEventListener("click", () => {
        const s = parseInt(btn.getAttribute("data-oral-timer") || "60", 10);
        startOralTimer(s);
      });
    });
  }

  // ---------- recording (MediaRecorder) ----------
  let recStream = null;
  let recorder = null;
  let chunks = [];

  function setMicStatus(text, good=false){
    const tag = $("#ce-mic-status");
    if(tag){
      tag.textContent = "Status: " + text;
      tag.style.borderColor = good ? "rgba(34,197,94,.45)" : "rgba(255,255,255,.16)";
      tag.style.background = good ? "rgba(34,197,94,.12)" : "rgba(255,255,255,.06)";
    }
  }
  function setMicHint(text){
    const hint = $("#ce-mic-hint");
    if(hint) hint.textContent = text;
  }

  async function checkMic(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      // keep it
      recStream = stream;
      setMicStatus("microphone allowed ✅", true);
      setMicHint("You can record now.");
      $("#ce-rec-start")?.removeAttribute("disabled");
      return true;
    }catch(err){
      setMicStatus("microphone permission denied", false);
      setMicHint("Click the 🔒 icon in your browser → Microphone → Allow → refresh.");
      return false;
    }
  }

  function startRec(){
    if(!recStream){
      setMicHint("Click “Check mic” first.");
      return;
    }
    try{
      chunks = [];
      recorder = new MediaRecorder(recStream);
      recorder.ondataavailable = (e) => { if(e.data && e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, {type: "audio/webm"});
        const url = URL.createObjectURL(blob);
        const audio = $("#ce-rec-playback");
        if(audio){
          audio.hidden = false;
          audio.src = url;
        }
      };
      recorder.start();
      $("#ce-rec-start")?.setAttribute("disabled","true");
      $("#ce-rec-stop")?.removeAttribute("disabled");
      setMicStatus("recording…", true);
    }catch(err){
      showError(err.message || String(err));
    }
  }

  function stopRec(){
    try{
      recorder?.stop();
      $("#ce-rec-stop")?.setAttribute("disabled","true");
      $("#ce-rec-start")?.removeAttribute("disabled");
      setMicStatus("recording stopped", true);
    }catch(err){
      showError(err.message || String(err));
    }
  }

  function wireRecording(){
    $("#ce-mic-check")?.addEventListener("click", checkMic);
    $("#ce-rec-start")?.addEventListener("click", startRec);
    $("#ce-rec-stop")?.addEventListener("click", stopRec);
  }

  // ---------- TECH CHECK ----------
  async function testBeep(){
    const status = $("#ce-beep-status");
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 660;
      g.gain.value = 0.08;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 200);
      if(status) status.textContent = "Beep played. If you heard it, speakers are OK ✅";
    }catch(err){
      if(status) status.textContent = "Could not play beep on this device.";
    }
  }

  async function testMicMeter(){
    const out = $("#ce-mic-status-2");
    const fill = $("#ce-meter-fill");
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      if(out) out.textContent = "Microphone allowed ✅ (showing level)";
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);
      let raf = null;

      function loop(){
        analyser.getByteFrequencyData(data);
        // crude level estimate
        let sum = 0;
        for(let i=0;i<data.length;i++) sum += data[i];
        const avg = sum / data.length;
        const pct = clamp((avg/255)*100, 0, 100);
        if(fill) fill.style.width = pct.toFixed(0) + "%";
        raf = requestAnimationFrame(loop);
      }
      loop();

      // stop after 6 seconds
      setTimeout(() => {
        if(raf) cancelAnimationFrame(raf);
        stream.getTracks().forEach(t => t.stop());
        ctx.close();
        if(out) out.textContent = "Mic test finished ✅";
      }, 6000);

    }catch(err){
      if(out) out.textContent = "Microphone permission denied. Use the 🔒 icon to allow.";
    }
  }

  async function testCam(){
    const out = $("#ce-cam-status");
    const vid = $("#ce-cam");
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video:true});
      if(vid){
        vid.hidden = false;
        vid.srcObject = stream;
      }
      if(out) out.textContent = "Camera preview active ✅";
      // stop after 6 seconds
      setTimeout(() => {
        stream.getTracks().forEach(t => t.stop());
        if(vid){
          vid.srcObject = null;
          vid.hidden = true;
        }
        if(out) out.textContent = "Camera test finished ✅";
      }, 6000);
    }catch(err){
      if(out) out.textContent = "Camera permission denied (or no camera).";
    }
  }

  function wireTech(){
    $("#ce-test-beep")?.addEventListener("click", testBeep);
    $("#ce-test-mic")?.addEventListener("click", testMicMeter);
    $("#ce-test-cam")?.addEventListener("click", testCam);
  }

  // ---------- init ----------
  function init(){
    wireAccent();

    $("#ce-apply-name")?.addEventListener("click", applyName);
    $("#ce-student-name")?.addEventListener("keydown", (e) => {
      if(e.key === "Enter") applyName();
    });

    wireTaskTour();
    clearStage();

    wireFlashcards();
    wireMini();

    refreshOralPrompts();
    wireOralModels();
    wireOralTimers();
    wireRecording();

    wireTech();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();
