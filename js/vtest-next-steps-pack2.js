/* SpeakEasyTisha • VTest Next Steps Pack 2
   - No dependencies
   - Touch-friendly (iPad mode gives tap alternative to drag)
   - Web Speech API for listening
   - Optional MediaRecorder for speaking practice
*/

(() => {
  "use strict";

  // ---------- Helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const tidyNum = (s) => (s || "").toString().replace(/[^\d]/g, "");

  const state = {
    accent: "US",
    tapMode: false,
    score: { correct: 0, total: 0 },
    sectionsDone: new Set(),
    selectedChip: null,
    selectedDD: null, // for iPad mode: selected line for drag&drop
    speech: { utter: null, voices: [], lastVoiceName: "" },
    timers: { prep: null, speak: null, t20: null, write: null },
    nums: { current: null, answer: "", transcript: "" },
    recorder: { rec: null, stream: null, chunks: [], url: "" }
  };

  function setScoreDelta(deltaCorrect, deltaTotal){
    state.score.correct += deltaCorrect;
    state.score.total += deltaTotal;
    state.score.correct = clamp(state.score.correct, 0, 9999);
    state.score.total = clamp(state.score.total, 0, 9999);
    $("#scoreTxt").textContent = `${state.score.correct} / ${state.score.total}`;
  }

  function resetGlobalScore(){
    state.score.correct = 0;
    state.score.total = 0;
    $("#scoreTxt").textContent = "0 / 0";
  }

  function toast(el, msg, ok=true){
    el.textContent = msg;
    el.classList.remove("good","bad");
    el.classList.add(ok ? "good" : "bad");
  }

  async function copyToClipboard(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(e){
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try{
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      }catch(err){
        document.body.removeChild(ta);
        return false;
      }
    }
  }

  // ---------- Speech (Web Speech API) ----------
  function speechSupported(){
    return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  }

  function loadVoices(){
    if(!speechSupported()) return [];
    const vs = speechSynthesis.getVoices() || [];
    state.speech.voices = vs;
    return vs;
  }

  function pickVoice(accent){
    const vs = state.speech.voices.length ? state.speech.voices : loadVoices();
    if(!vs.length) return null;

    // Prefer: en-US / en-GB (or similar)
    const want = accent === "UK" ? ["en-GB","en_GB","en-UK","en_UK"] : ["en-US","en_US"];
    const fallback = accent === "UK" ? ["en","en-IE","en-AU","en-CA","en-US"] : ["en","en-CA","en-AU","en-GB"];
    const byLang = (langs) => vs.find(v => langs.some(l => (v.lang||"").toLowerCase().includes(l.toLowerCase())));
    return byLang(want) || byLang(fallback) || vs[0];
  }

  function stopSpeech(){
    if(!speechSupported()) return;
    try{ speechSynthesis.cancel(); }catch(e){}
    state.speech.utter = null;
  }

  function speak(text){
    if(!speechSupported()){
      alert("Audio not supported on this browser. Please read the transcript.");
      return;
    }
    stopSpeech();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(state.accent);
    if(v){ u.voice = v; state.speech.lastVoiceName = v.name; }
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;
    state.speech.utter = u;
    speechSynthesis.speak(u);
  }

  // Many browsers load voices asynchronously
  if(speechSupported()){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => loadVoices();
  }

  // ---------- Progress ----------
  const progressItems = [
    { id: "plan", label: "Sprint plan" },
    { id: "traps", label: "French→English traps" },
    { id: "language", label: "New language + builder" },
    { id: "grammar", label: "Grammar tools (Passive + Reported)" },
    { id: "listening", label: "Listening + numbers" },
    { id: "reading", label: "Reading email chain" },
    { id: "mock", label: "Mini mock (DD + speaking + writing)" }
  ];

  function renderProgress(){
    const box = $("#progressChecks");
    box.innerHTML = "";
    progressItems.forEach(item => {
      const row = document.createElement("label");
      row.className = "checkItem";
      row.innerHTML = `
        <input type="checkbox" data-prog="${item.id}" />
        <span>${item.label}</span>
      `;
      box.appendChild(row);
    });

    $$("#progressChecks input").forEach(cb => {
      cb.addEventListener("change", () => {
        if(cb.checked) state.sectionsDone.add(cb.dataset.prog);
        else state.sectionsDone.delete(cb.dataset.prog);
        updateProgress();
      });
    });

    updateProgress();
  }

  function updateProgress(){
    const total = progressItems.length;
    const done = state.sectionsDone.size;
    const pct = total ? Math.round((done/total)*100) : 0;
    $("#progressTxt").textContent = `${pct}%`;
    $("#progressFill").style.width = `${pct}%`;
  }

  function markComplete(sectionId){
    state.sectionsDone.add(sectionId);
    const cb = $(`#progressChecks input[data-prog="${sectionId}"]`);
    if(cb) cb.checked = true;
    updateProgress();
  }

  // ---------- Dynamic content based on context ----------
  const ctxContent = {
    general: {
      company: "NorthBridge Solutions",
      product: "the onboarding portal",
      client: "Taylor Morgan",
      dept: "Operations",
      issue: "a system outage",
      delivery: "the update rollout"
    },
    hospitality: {
      company: "Riverview Hotel",
      product: "the reservation system",
      client: "Ms. Taylor Morgan",
      dept: "Front Desk",
      issue: "a booking system outage",
      delivery: "the updated room allocation"
    },
    engineering: {
      company: "Helix Manufacturing",
      product: "the quality dashboard",
      client: "Taylor Morgan",
      dept: "Supplier Quality",
      issue: "a production incident",
      delivery: "the revised shipment schedule"
    },
    admin: {
      company: "BrightLine Office",
      product: "the shared drive",
      client: "Taylor Morgan",
      dept: "Administration",
      issue: "an IT access issue",
      delivery: "the updated documentation"
    },
    sales: {
      company: "Arcadia Sales",
      product: "the CRM",
      client: "Taylor Morgan",
      dept: "Customer Success",
      issue: "a client complaint",
      delivery: "the replacement order"
    },
    transport: {
      company: "MetroLink Tours",
      product: "the booking platform",
      client: "Taylor Morgan",
      dept: "Operations",
      issue: "a timetable disruption",
      delivery: "the revised itinerary"
    }
  };

  function currentCtx(){
    const v = $("#workCtx").value;
    return ctxContent[v] || ctxContent.general;
  }

  function nameOrGeneric(){
    const n = ($("#studentName").value || "").trim();
    return n ? n : "you";
  }

  // ---------- Sprint plan ----------
  const sprintBase = [
    ["Day 1", "Listening → 2 short audios + answer fast (no pausing)"],
    ["Day 2", "Reading → 2 emails + 6 MCQs (focus on dates/actions)"],
    ["Day 3", "Writing → 1 email (8–12 lines) using the same structure"],
    ["Day 4", "Speaking → 3 prompts (60–90s) with structure (opinion→example→solution)"],
    ["Day 5", "Traps → 12 quick corrections (false friends, word order)"],
    ["Day 6", "Grammar tools → 10 passive + 10 reported-speech transforms"],
    ["Day 7", "Mini mock → 1 integrated session (timed) + review your errors"]
  ];

  function renderSprint(){
    const ol = $("#sprintList");
    ol.innerHTML = "";
    sprintBase.forEach(([day, tip]) => {
      const li = document.createElement("li");
      li.textContent = `${day}: ${tip}`;
      ol.appendChild(li);
    });
  }

  // ---------- Quiz engine (single choice) ----------
  function renderMCQ(container, questions, scoreEl){
    container.innerHTML = "";
    let local = { correct:0, total: questions.length };
    const picked = new Map(); // qIdx -> optIdx

    function updateLocal(){
      scoreEl.textContent = `${local.correct} / ${local.total}`;
    }

    questions.forEach((q, qi) => {
      const qEl = document.createElement("div");
      qEl.className = "q";
      qEl.innerHTML = `
        <div class="q__stem">${q.stem}</div>
        <div class="opt"></div>
        <div class="explain" hidden></div>
      `;
      const opt = $(".opt", qEl);
      const exp = $(".explain", qEl);

      q.options.forEach((label, oi) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choice";
        b.textContent = label;
        b.setAttribute("aria-pressed","false");
        b.addEventListener("click", () => {
          // prevent double-scoring: if already answered, ignore
          if(picked.has(qi)) return;

          picked.set(qi, oi);
          b.setAttribute("aria-pressed","true");

          const isCorrect = (oi === q.answer);
          if(isCorrect){
            b.classList.add("is-correct");
            exp.hidden = false;
            exp.textContent = `✅ ${q.explain}`;
            local.correct += 1;
            setScoreDelta(1,1);
          }else{
            b.classList.add("is-wrong");
            // mark correct option
            const btns = $$(".choice", qEl);
            btns[q.answer].classList.add("is-correct");
            exp.hidden = false;
            exp.textContent = `❌ ${q.explain}`;
            setScoreDelta(0,1);
          }
          updateLocal();
        });
        opt.appendChild(b);
      });

      container.appendChild(qEl);
    });

    updateLocal();

    return {
      reset(){
        // remove previous contribution from global score:
        // We can't precisely subtract after multiple quizzes; simplest: reload page or use "Reset all".
        // Here we reset local UI only.
        container.querySelectorAll(".choice").forEach(b => {
          b.classList.remove("is-correct","is-wrong");
          b.setAttribute("aria-pressed","false");
        });
        container.querySelectorAll(".explain").forEach(e => { e.hidden=true; e.textContent=""; });
        picked.clear();
        local.correct = 0;
        updateLocal();
      },
      getLocal(){ return { ...local, answered: picked.size }; }
    };
  }

  // ---------- Traps quiz ----------
  function buildTrapQuestions(){
    const lvl = $("#level").value;
    const c = currentCtx();

    const qs = [
      {
        stem: "Choose the best: “I’ll follow up ___ the end of the day.”",
        options: ["by", "until", "for"],
        answer: 0,
        explain: "Use “by” for a deadline: “by the end of the day”."
      },
      {
        stem: "Choose the natural option (email): “I’m writing ___ our meeting.”",
        options: ["regarding", "for to", "about of"],
        answer: 0,
        explain: "“regarding” / “about” (no “of”) are natural here."
      },
      {
        stem: "False friend: “informations” →",
        options: ["information", "informations", "an information"],
        answer: 0,
        explain: "“information” is uncountable in English."
      },
      {
        stem: "Choose the best polite request:",
        options: ["I want you to confirm.", "Could you please confirm?", "You confirm, please."],
        answer: 1,
        explain: "“Could you please…?” is the safest polite request."
      },
      {
        stem: `Choose the best: “Due to ${c.issue}, the launch ___ delayed.”`,
        options: ["was", "did", "is doing"],
        answer: 0,
        explain: "Passive voice is common for problems: “was delayed”."
      }
    ];

    if(lvl === "b2"){
      qs.push(
        {
          stem: "Choose the best upgrade (hedging): “This will fix the issue.”",
          options: ["This will maybe fix the issue.", "This should fix the issue.", "This fixes might the issue."],
          answer: 1,
          explain: "“should” sounds professional: confident but realistic."
        },
        {
          stem: "Choose the correct reported speech: “The client said, ‘We need it by Friday.’”",
          options: ["The client said they need it by Friday.", "The client said they needed it by Friday.", "The client said they needed it by Friday?"],
          answer: 1,
          explain: "Backshift in reported speech: need → needed."
        }
      );
    }

    return qs;
  }

  // ---------- Chunks + Builder ----------
  const chunks = [
    "I’m sorry for the inconvenience.",
    "Due to an unexpected issue, the delivery has been delayed.",
    "We’re working on a solution as quickly as possible.",
    "The earliest new window is tomorrow morning.",
    "Could you please confirm which option you prefer?",
    "I’ll keep you updated by the end of the day."
  ];

  function renderChunks(){
    const box = $("#chunkChips");
    box.innerHTML = "";
    chunks.forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = t;
      b.addEventListener("click", () => speak(t));
      box.appendChild(b);
    });
  }

  const builder = {
    blanks: ["____", "____", "____", "____", "____"],
    // target sentence (normalized)
    target: ["I’m sorry for the inconvenience,", "but", "we can offer", "a new delivery window", "tomorrow morning."],
    bank: ["I’m sorry for the inconvenience,", "tomorrow morning.", "we can offer", "a new delivery window", "but"]
  };

  function renderBuilder(){
    const blankRow = $("#blankRow");
    const bank = $("#wordBank");
    blankRow.innerHTML = "";
    bank.innerHTML = "";

    builder.filled = Array(builder.blanks.length).fill(null);

    builder.filled.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "blank";
      b.textContent = builder.blanks[i];
      b.dataset.blank = String(i);
      b.addEventListener("click", () => {
        // If a chip selected, place it
        if(state.selectedChip){
          placeWord(i, state.selectedChip);
          state.selectedChip = null;
          $$(".chip", bank).forEach(x => x.classList.remove("is-active"));
        }else{
          // clear if filled
          if(builder.filled[i]){
            builder.filled[i] = null;
            b.classList.remove("filled");
            b.textContent = builder.blanks[i];
          }
        }
      });
      blankRow.appendChild(b);
    });

    builder.bank.forEach((w) => {
      const c = document.createElement("button");
      c.type = "button";
      c.className = "chip";
      c.textContent = w;
      c.addEventListener("click", () => {
        // toggle selection
        const already = c.classList.contains("is-active");
        $$(".chip", bank).forEach(x => x.classList.remove("is-active"));
        if(already){
          state.selectedChip = null;
          c.classList.remove("is-active");
        }else{
          state.selectedChip = w;
          c.classList.add("is-active");
        }
      });
      bank.appendChild(c);
    });

    $("#builderScore").textContent = "0 / 1";
    $("#builderFb").textContent = "Tip: build the sentence, then press Check.";
    $("#builderFb").className = "feedback";
  }

  function placeWord(blankIndex, word){
    builder.filled[blankIndex] = word;
    const blankEl = $(`.blank[data-blank="${blankIndex}"]`);
    if(blankEl){
      blankEl.textContent = word;
      blankEl.classList.add("filled");
    }
  }

  function checkBuilder(){
    const s = builder.filled.slice();
    const ok = s.every((w, i) => w === builder.target[i]);
    const fb = $("#builderFb");
    $("#builderScore").textContent = ok ? "1 / 1" : "0 / 1";
    if(ok){
      toast(fb, "✅ Great. This is polite and clear. Read it aloud once.", true);
      // only score once per attempt: treat as 1 question
      if(!fb.dataset.scored){
        setScoreDelta(1,1);
        fb.dataset.scored = "1";
      }
    }else{
      toast(fb, "❌ Not quite. Hint: “but” goes after the apology, and the time goes at the end.", false);
      if(!fb.dataset.scored){
        setScoreDelta(0,1);
        fb.dataset.scored = "1";
      }
    }
  }

  function resetBuilderUI(){
    $("#builderFb").dataset.scored = "";
    renderBuilder();
  }

  // ---------- Passive + Reported quizzes ----------
  function buildPassiveQuestions(){
    const c = currentCtx();
    return [
      {
        stem: `Active → Passive: “We postponed ${c.delivery}.”`,
        options: [`${c.delivery} was postponed.`, `${c.delivery} postponed.`, `${c.delivery} was postpone.`],
        answer: 0,
        explain: "Passive = be + past participle: “was postponed”."
      },
      {
        stem: "Choose the best: “The files ___ sent this morning.”",
        options: ["were", "was", "did"],
        answer: 0,
        explain: "Plural “files” → “were sent”."
      },
      {
        stem: "Choose the best: “The issue ___ resolved yet.”",
        options: ["hasn’t been", "isn’t been", "doesn’t been"],
        answer: 0,
        explain: "Present perfect passive: “hasn’t been resolved yet”."
      }
    ];
  }

  function buildReportQuestions(){
    return [
      {
        stem: "Reported speech: “She said, ‘I can join at 3.’”",
        options: ["She said she can join at 3.", "She said she could join at 3.", "She said she could joined at 3."],
        answer: 1,
        explain: "Backshift can → could (reported speech)."
      },
      {
        stem: "Reported speech: “They asked, ‘Can you send the file today?’”",
        options: ["They asked if I can send the file today.", "They asked if I could send the file that day.", "They asked me send the file today."],
        answer: 1,
        explain: "asked if + could; “today” often becomes “that day” in reported speech."
      },
      {
        stem: "Choose the best verb for a summary:",
        options: ["They screamed that…", "They confirmed that…", "They yelled that…"],
        answer: 1,
        explain: "In professional contexts: confirmed / explained / suggested."
      }
    ];
  }

  // ---------- Listening scripts ----------
  function scripts(){
    const c = currentCtx();
    const lvl = $("#level").value;

    const a1 = (lvl === "b2")
      ? `Hi team. Quick update: we’ve had ${c.issue} affecting ${c.product}. Access is limited right now. IT is working on a fix and we expect service to be restored by 2 p.m. In the meantime, please avoid duplicate requests and log urgent cases in the shared tracker. I’ll follow up by the end of the day.`
      : `Hi team. We have ${c.issue}. ${c.product} is not working well. IT is fixing it. We expect it to work again at 2 p.m. Please write urgent cases in the tracker. I’ll follow up by the end of the day.`;

    const a2 = (lvl === "b2")
      ? `Client: Hi, this is Taylor. I’m calling because the delivery is late again, and it’s impacting our schedule. 
Agent: I’m sorry for the inconvenience. The shipment was delayed due to a carrier issue. The earliest new delivery window is tomorrow between 9 and 11 a.m. We can also offer a priority option for Friday morning. Could you please confirm which option you prefer? 
Client: Tomorrow morning works. Please send a confirmation email.
Agent: Absolutely. I’ll send it right away and keep you updated.`
      : `Client: Hi, this is Taylor. The delivery is late again. It’s a problem for us.
Agent: I’m sorry for the inconvenience. The shipment was delayed. The earliest new window is tomorrow between 9 and 11 a.m. We can also deliver Friday morning. Which option do you prefer?
Client: Tomorrow morning is fine. Please email me.
Agent: Sure. I’ll send an email now.`;

    return { a1, a2 };
  }

  function renderTranscripts(){
    const { a1, a2 } = scripts();
    $("#t1").textContent = a1;
    $("#t2").textContent = a2;
  }

  function buildListenQuestions1(){
    const qs = [
      {
        stem: "What is the main issue?",
        options: ["An IT/system problem", "A budget cut", "A meeting cancellation"],
        answer: 0,
        explain: "The message is about a system outage / access issues."
      },
      {
        stem: "When is service expected to be restored?",
        options: ["By 2 p.m.", "By 5 p.m.", "Next week"],
        answer: 0,
        explain: "The speaker mentions 2 p.m."
      }
    ];
    return qs;
  }

  function buildListenQuestions2(){
    const qs = [
      {
        stem: "What is the earliest new delivery window?",
        options: ["Tomorrow 9–11 a.m.", "Tomorrow afternoon", "Friday evening"],
        answer: 0,
        explain: "Earliest window = tomorrow between 9 and 11."
      },
      {
        stem: "What does the client ask for at the end?",
        options: ["A confirmation email", "A refund", "A meeting invitation"],
        answer: 0,
        explain: "They ask: “Please send a confirmation email.”"
      }
    ];
    return qs;
  }

  // ---------- Numbers dictation ----------
  const numsItems = [
    { t: "The invoice total is two thousand four hundred and seventy euros.", a: "2470" },
    { t: "Please call me back at zero six forty two, eighty one, ninety nine, twelve.", a: "0642819912" },
    { t: "The meeting is at nineteen thirty.", a: "1930" }, // time only (24-hour)
    { t: "We need fifteen units by Friday, and twenty five units next week.", a: "1525" },
    { t: "The new deadline is the twenty ninth.", a: "29" }
  ];

  function newNumbers(){
    const pick = numsItems[Math.floor(Math.random()*numsItems.length)];
    state.nums.current = pick;
    $("#numsInput").value = "";
    $("#numsFb").textContent = "";
    $("#numsFb").className = "feedback";
    $("#numsTranscript").hidden = true;
    $("#numsTranscript").textContent = pick.t;
  }

  function checkNumbers(){
    const raw = $("#numsInput").value;
    const ans = tidyNum(raw);
    const target = tidyNum(state.nums.current.a);
    const fb = $("#numsFb");
    $("#numsScore").textContent = "0 / 1";
    if(!fb.dataset.scored){
      setScoreDelta(0,1);
      fb.dataset.scored = "1";
    }
    if(ans === target && ans.length){
      toast(fb, "✅ Correct.", true);
      $("#numsScore").textContent = "1 / 1";
      // adjust global: convert previous 0/1 to 1/1 by +1 correct
      setScoreDelta(1,0);
    }else{
      toast(fb, `❌ Not quite. Expected: ${state.nums.current.a}`, false);
    }
  }

  function resetNumbersUI(){
    $("#numsFb").dataset.scored = "";
    $("#numsScore").textContent = "0 / 0";
    newNumbers();
  }

  // ---------- Reading email chain ----------
  function renderEmailChain(){
    const c = currentCtx();
    const lvl = $("#level").value;

    const subj = `Subject: Urgent update – ${c.delivery}`;
    const email1 = `From: ${c.client} <client@example.com>
To: ${c.dept} <team@${c.company.toLowerCase().replace(/\s+/g,"")}.com>

Hello,

I’m disappointed because the delivery is late again. This is impacting our schedule and we need a clear update today.
Can you confirm the new delivery date and what you are doing to prevent this from happening again?

Thanks,
Taylor`;

    const email2 = (lvl === "b2")
      ? `From: ${nameOrGeneric()} <you@${c.company.toLowerCase().replace(/\s+/g,"")}.com>
To: ${c.client} <client@example.com>

Hello Taylor,

Thank you for your message, and I’m sorry for the inconvenience caused by the delay. The shipment was delayed due to a carrier issue outside of our control.
The earliest new delivery window is tomorrow between 9 and 11 a.m. If this doesn’t work, we can offer a priority option for Friday morning.

To prevent recurrence, we are already escalating this with the carrier and implementing a double-check step before dispatch.
Could you please confirm which option you prefer?

Best regards,
${nameOrGeneric()}`
      : `From: ${nameOrGeneric()} <you@${c.company.toLowerCase().replace(/\s+/g,"")}.com>
To: ${c.client} <client@example.com>

Hello Taylor,

I’m sorry for the inconvenience. The shipment was delayed due to a carrier issue.
The earliest new window is tomorrow between 9 and 11 a.m. If needed, we can deliver Friday morning.

We are talking to the carrier and adding a check before dispatch.
Could you please confirm which option you prefer?

Best regards,
${nameOrGeneric()}`;

    const box = $("#emailChain");
    box.innerHTML = `
      <div class="subj">${subj}</div>
      <div class="from muted small">Read both emails, then answer.</div>
      <pre>${email1}

-------------------------

${email2}</pre>
    `;
  }

  function buildReadQuestions(){
    return [
      {
        stem: "What does the client want today?",
        options: ["A clear update and a new delivery date", "A meeting next month", "A price reduction only"],
        answer: 0,
        explain: "They ask for a clear update today + the new delivery date."
      },
      {
        stem: "What solution is offered first?",
        options: ["Delivery tomorrow 9–11 a.m.", "Delivery next week", "A refund"],
        answer: 0,
        explain: "Earliest option = tomorrow between 9 and 11."
      },
      {
        stem: "What prevention action is mentioned?",
        options: ["Escalating with the carrier + adding a double-check", "Hiring new staff", "Changing the product"],
        answer: 0,
        explain: "They mention escalation + a check step."
      }
    ];
  }

  // ---------- Drag & drop / tap mode (Email order) ----------
  const ddConfigs = {
    emailOrder: {
      items: [
        "Subject: Update on your delivery",
        "Hello Taylor,",
        "I’m sorry for the inconvenience caused by the delay.",
        "The shipment was delayed due to a carrier issue.",
        "The earliest new delivery window is tomorrow between 9 and 11 a.m.",
        "Could you please confirm which option you prefer?",
        "Best regards,",
        "Jordan Lee"
      ],
      targets: [
        "Subject line",
        "Greeting",
        "Apology",
        "Reason",
        "Solution",
        "Request / next step",
        "Closing",
        "Signature"
      ],
      // correct mapping by index: items placed in targets in this order
      correct: [
        "Subject: Update on your delivery",
        "Hello Taylor,",
        "I’m sorry for the inconvenience caused by the delay.",
        "The shipment was delayed due to a carrier issue.",
        "The earliest new delivery window is tomorrow between 9 and 11 a.m.",
        "Could you please confirm which option you prefer?",
        "Best regards,",
        "Jordan Lee"
      ]
    }
  };

  function renderDD(root){
    const keyRaw = (root.dataset.dd || root.getAttribute("data-dd") || "").trim();
    // tolerate case variations if an older HTML used a different casing
    const key = ddConfigs[keyRaw] ? keyRaw : (ddConfigs[keyRaw.toLowerCase?.()] ? keyRaw.toLowerCase() : keyRaw);
    const cfg = ddConfigs[key];
    if(!cfg) return;

    // robust selectors (so the exercise still works if you tweaked the HTML slightly)
    const pickEl = (selectors) => {
      for(const sel of selectors){
        const el = root.querySelector(sel);
        if(el) return el;
      }
      return null;
    };

    let itemsBox = pickEl([".dd__items",".dd-items","#ddItems","[data-dd-items]"]);
    let targetsBox = pickEl([".dd__targets",".dd-targets","#ddTargets","[data-dd-targets]"]);
    let scoreEl = pickEl([".ddScore",".dd__score","#ddScore"]);
    let fb = pickEl([".ddFb",".dd__fb","#ddFb"]);

    // if any containers are missing, create them so the activity never appears empty
    if(!itemsBox){
      const bank = pickEl([".dd__bank",".ddBank"]) || root;
      itemsBox = document.createElement("div");
      itemsBox.className = "dd__items";
      itemsBox.setAttribute("role","list");
      bank.appendChild(itemsBox);
    }
    if(!targetsBox){
      const slots = pickEl([".dd__slots",".ddSlots"]) || root;
      targetsBox = document.createElement("div");
      targetsBox.className = "dd__targets";
      targetsBox.setAttribute("role","list");
      slots.appendChild(targetsBox);
    }
    if(!scoreEl){
      // create a tiny score placeholder if needed
      scoreEl = document.createElement("span");
      scoreEl.className = "ddScore";
      const head = pickEl([".dd__slots .dd__head",".dd__head"]) || root;
      head.appendChild(scoreEl);
    }
    if(!fb){
      fb = document.createElement("div");
      fb.className = "feedback ddFb";
      fb.setAttribute("aria-live","polite");
      root.appendChild(fb);
    }

    itemsBox.innerHTML = "";
    targetsBox.innerHTML = "";
    scoreEl.textContent = "0 / 1";
    fb.textContent = "Place each line into the correct slot, then press Check.";
    fb.className = "feedback";
    fb.dataset.scored = "";

    // local state: targetIdx -> value
    const placed = Array(cfg.targets.length).fill("");

    function makeItem(text){
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ddItem";
      b.textContent = text;
      b.draggable = true;

      b.addEventListener("dragstart", (e) => {
        if(state.tapMode) { e.preventDefault(); return; }
        e.dataTransfer.setData("text/plain", text);
        e.dataTransfer.effectAllowed = "move";
      });

      b.addEventListener("click", () => {
        if(!state.tapMode) return;
        // toggle select
        const already = b.classList.contains("is-selected");
        $$(".ddItem", itemsBox).forEach(x => x.classList.remove("is-selected"));
        if(already){
          state.selectedDD = null;
          b.classList.remove("is-selected");
        }else{
          state.selectedDD = text;
          b.classList.add("is-selected");
        }
      });

      return b;
    }

    cfg.items.forEach(it => itemsBox.appendChild(makeItem(it)));

    cfg.targets.forEach((label, idx) => {
      const slot = document.createElement("div");
      slot.className = "ddSlot";
      slot.dataset.slot = String(idx);
      slot.innerHTML = `<span class="slotNum">${idx+1})</span> <span class="slotVal">${label}</span>`;
      slot.addEventListener("dragover", (e) => {
        if(state.tapMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      slot.addEventListener("drop", (e) => {
        if(state.tapMode) return;
        e.preventDefault();
        const text = e.dataTransfer.getData("text/plain");
        placeInto(idx, text);
      });
      slot.addEventListener("click", () => {
        if(!state.tapMode) return;
        if(state.selectedDD){
          placeInto(idx, state.selectedDD);
          // clear selection
          state.selectedDD = null;
          $$(".ddItem", itemsBox).forEach(x => x.classList.remove("is-selected"));
        }else{
          // clear slot if filled
          if(placed[idx]){
            placed[idx] = "";
            slot.classList.remove("filled");
            slot.innerHTML = `<span class="slotNum">${idx+1})</span> <span class="slotVal">${cfg.targets[idx]}</span>`;
          }
        }
      });
      targetsBox.appendChild(slot);
    });

    function placeInto(idx, text){
      // if text already used elsewhere, remove it
      const prev = placed.indexOf(text);
      if(prev >= 0){
        placed[prev] = "";
        const sPrev = $(`.ddSlot[data-slot="${prev}"]`, targetsBox);
        if(sPrev){
          sPrev.classList.remove("filled");
          sPrev.innerHTML = `<span class="slotNum">${prev+1})</span> <span class="slotVal">${cfg.targets[prev]}</span>`;
        }
      }

      placed[idx] = text;
      const slot = $(`.ddSlot[data-slot="${idx}"]`, targetsBox);
      slot.classList.add("filled");
      slot.innerHTML = `<span class="slotNum">${idx+1})</span> <span class="slotVal">${text}</span>`;
    }

    $(".ddCheck", root).addEventListener("click", () => {
      const complete = placed.every(Boolean);
      if(!complete){
        toast(fb, "⚠️ Fill every slot first.", false);
        return;
      }
      const ok = placed.every((v, i) => v === cfg.correct[i]);
      scoreEl.textContent = ok ? "1 / 1" : "0 / 1";

      if(ok) toast(fb, "✅ Perfect order. Read it aloud once.", true);
      else toast(fb, "❌ Some lines are in the wrong place. Hint: Subject → Greeting → Apology → Reason → Solution → Request → Closing → Signature.", false);

      if(!fb.dataset.scored){
        setScoreDelta(ok ? 1 : 0, 1);
        fb.dataset.scored = "1";
      }
    });

    $(".ddReset", root).addEventListener("click", () => renderDD(root));
  }

  // ---------- Speaking prompts + timers ----------
  const speakingPrompts = [
    "Your team faced a delay. Explain what happened, the impact, and your solution.",
    "A client is unhappy about a late delivery. Apologize, propose two options, and ask for confirmation.",
    "Your company is changing a process. Explain the benefit, one challenge, and how you will support the team.",
    "Do you prefer working remotely or in the office? Give one advantage, one challenge, and a practical solution.",
    "Describe a time you solved a problem at work. What was the issue, what did you do, and what was the result?"
  ];

  function newSpeakingPrompt(){
    const p = speakingPrompts[Math.floor(Math.random()*speakingPrompts.length)];
    $("#speakPrompt").textContent = p;
    return p;
  }

  function clearTimer(which){
    if(state.timers[which]){
      clearInterval(state.timers[which]);
      state.timers[which] = null;
    }
  }

  function runCountdown(el, seconds, which){
    clearTimer(which);
    let s = seconds;
    el.textContent = String(s);
    state.timers[which] = setInterval(() => {
      s -= 1;
      el.textContent = String(Math.max(0,s));
      if(s <= 0){
        clearTimer(which);
      }
    }, 1000);
  }

  // ---------- Writing task + timer + model ----------
  function writingTask(){
    const c = currentCtx();
    return `You need to email ${c.client} because ${c.delivery} is delayed. Apologize, give a short reason (neutral), propose a solution with a clear time window, and ask for confirmation.`;
  }

  function modelAnswer(){
    const lvl = $("#level").value;
    const c = currentCtx();
    const you = nameOrGeneric();
    if(lvl === "b2"){
      return `Subject: Update on your delivery

Hello Taylor,

I’m sorry for the inconvenience caused by the delay. Due to a carrier issue, the shipment was delayed and could not leave the warehouse as planned.

The earliest new delivery window is tomorrow between 9 and 11 a.m. If this does not work, we can offer a priority option for Friday morning.

Could you please confirm which option you prefer?

Best regards,
${you}`;
    }
    return `Subject: Update on your delivery

Hello Taylor,

I’m sorry for the inconvenience. The shipment was delayed due to a carrier issue.

The earliest new window is tomorrow between 9 and 11 a.m. If needed, we can deliver Friday morning.

Could you please confirm which option you prefer?

Best regards,
${you}`;
  }

  const toneHints = {
    neutral: [
      "Polite + clear: “I’m sorry for the inconvenience.”",
      "Neutral reason: “Due to an unexpected issue…”",
      "Action: “We can offer…”",
      "Deadline: “by the end of the day”"
    ],
    warm: [
      "Warm opening: “Thanks for your patience.”",
      "Reassure: “I understand this is frustrating.”",
      "Positive close: “Thank you for your understanding.”"
    ],
    firm: [
      "Stay calm: “To move forward, please confirm…”",
      "Clear limits: “We’re unable to…” / “We can offer…”",
      "Next step: “If we don’t hear back by…, we will…”"
    ]
  };

  function renderToneHints(){
    const t = $("#tone").value;
    const hints = toneHints[t] || toneHints.neutral;
    $("#toneHints").innerHTML = `<ul style="margin:0; padding-left:18px;">${hints.map(h=>`<li>${h}</li>`).join("")}</ul>`;
  }

  function renderChecklist(){
    const items = [
      { id:"apology", label:"Includes an apology" },
      { id:"reason", label:"Gives a neutral reason" },
      { id:"solution", label:"Proposes a solution with time/date" },
      { id:"ask", label:"Asks for confirmation / next step" },
      { id:"close", label:"Has a polite closing + signature" }
    ];
    const box = $("#writeChecklist");
    box.innerHTML = items.map(it => `
      <label class="ck">
        <input type="checkbox" data-ck="${it.id}" />
        <div>${it.label}</div>
      </label>
    `).join("");
  }

  function startWriteTimer(){
    clearTimer("write");
    let remaining = 12 * 60; // 12 minutes
    const el = $("#writeNum");
    const fmt = (s) => {
      const m = Math.floor(s/60);
      const r = s % 60;
      return `${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`;
    };
    el.textContent = fmt(remaining);
    state.timers.write = setInterval(() => {
      remaining -= 1;
      el.textContent = fmt(Math.max(0,remaining));
      if(remaining <= 0){
        clearTimer("write");
      }
    }, 1000);
  }

  function resetWriteTimer(){
    clearTimer("write");
    $("#writeNum").textContent = "12:00";
  }

  function doSelfCheck(){
    const text = ($("#emailDraft").value || "").trim();
    const fb = $("#writeFb");
    const checks = {
      apology: /(sorry|apolog)/i.test(text),
      reason: /(due to|because|as a result of|since|carrier|issue|delay)/i.test(text),
      solution: /(tomorrow|friday|between|\d{1,2}\s?(a\.m\.|p\.m\.)|window|option|offer)/i.test(text),
      ask: /(could you|please confirm|let me know|would you|can you)/i.test(text),
      close: /(best regards|kind regards|sincerely)/i.test(text)
    };

    $$("#writeChecklist input").forEach(cb => {
      const k = cb.dataset.ck;
      cb.checked = !!checks[k];
    });

    const okCount = Object.values(checks).filter(Boolean).length;
    if(!fb.dataset.scored){
      setScoreDelta(0,1);
      fb.dataset.scored = "1";
    }
    if(okCount >= 4){
      toast(fb, `✅ Strong. ${okCount}/5 checks found. Improve one detail to make it even more natural.`, true);
      // convert to correct
      setScoreDelta(1,0);
    }else{
      toast(fb, `⚠️ ${okCount}/5 checks found. Add: apology + reason + solution + request + closing.`, false);
    }
  }

  function renderWriting(){
    $("#writeTask").textContent = writingTask();
    $("#modelAnswer").textContent = modelAnswer();
    renderToneHints();
    renderChecklist();
    $("#writeFb").textContent = "";
    $("#writeFb").className = "feedback";
    $("#writeFb").dataset.scored = "";
  }

  // ---------- Report export ----------
  function buildReport(){
    const you = nameOrGeneric();
    const ctx = $("#workCtx").value;
    const lvl = $("#level").value.toUpperCase();
    const total = state.score.total;
    const correct = state.score.correct;
    const pct = total ? Math.round((correct/total)*100) : 0;
    const done = Array.from(state.sectionsDone).join(", ") || "(none)";

    const lines = [
      `VTest Pack 2 Report`,
      `Student: ${you}`,
      `Context: ${ctx}`,
      `Level target: ${lvl}`,
      `Score: ${correct}/${total} (${pct}%)`,
      `Completed sections: ${done}`,
      ``,
      `Homework (15 minutes):`,
      `- Write 1 short email using: apology → reason → solution → request.`,
      `- Speak 1 prompt using: opinion → example → solution → close.`,
    ];
    return lines.join("\n");
  }

  function renderReportPreview(){
    $("#reportPreview").textContent = buildReport();
  }

  // ---------- Optional recording ----------
  async function startRecording(){
    const btnStart = $("#recStart");
    const btnStop = $("#recStop");
    const audio = $("#recAudio");
    const dl = $("#recDownload");

    try{
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        alert("Recording is not supported on this browser. You can still practise speaking.");
        return;
      }
      state.recorder.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(state.recorder.stream);
      state.recorder.chunks = [];
      mr.ondataavailable = (e) => { if(e.data && e.data.size) state.recorder.chunks.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(state.recorder.chunks, { type: mr.mimeType || "audio/webm" });
        if(state.recorder.url) URL.revokeObjectURL(state.recorder.url);
        state.recorder.url = URL.createObjectURL(blob);
        audio.src = state.recorder.url;
        dl.href = state.recorder.url;
        dl.hidden = false;
      };
      mr.start();
      state.recorder.rec = mr;

      btnStart.disabled = true;
      btnStop.disabled = false;
      dl.hidden = true;
    }catch(e){
      alert("Microphone permission blocked or not available. You can still practise speaking.");
    }
  }

  function stopRecording(){
    const btnStart = $("#recStart");
    const btnStop = $("#recStop");
    try{
      if(state.recorder.rec && state.recorder.rec.state !== "inactive"){
        state.recorder.rec.stop();
      }
      if(state.recorder.stream){
        state.recorder.stream.getTracks().forEach(t => t.stop());
      }
    }catch(e){}
    state.recorder.rec = null;
    state.recorder.stream = null;
    btnStart.disabled = false;
    btnStop.disabled = true;
  }

  function clearRecording(){
    const audio = $("#recAudio");
    const dl = $("#recDownload");
    audio.removeAttribute("src");
    audio.load();
    if(state.recorder.url){
      URL.revokeObjectURL(state.recorder.url);
      state.recorder.url = "";
    }
    dl.hidden = true;
  }

  // ---------- Wire up ----------
  function wireAccent(){
    $("#accentUS").addEventListener("click", () => {
      state.accent = "US";
      $("#accentUS").setAttribute("aria-pressed","true");
      $("#accentUK").setAttribute("aria-pressed","false");
    });
    $("#accentUK").addEventListener("click", () => {
      state.accent = "UK";
      $("#accentUS").setAttribute("aria-pressed","false");
      $("#accentUK").setAttribute("aria-pressed","true");
    });
  }

  function wireTapMode(){
    $("#toggleTap").addEventListener("click", () => {
      state.tapMode = !state.tapMode;
      $("#toggleTap").setAttribute("aria-pressed", state.tapMode ? "true" : "false");
      $("#toggleTap").textContent = state.tapMode ? "On" : "Off";
      // clear current selection
      state.selectedDD = null;
      // remove selection class
      $$(".ddItem").forEach(x => x.classList.remove("is-selected"));
    });
  }

  function wireSectionButtons(){
    $("#markPlan").addEventListener("click", () => markComplete("plan"));
    $("#markTraps").addEventListener("click", () => markComplete("traps"));
    $("#markLang").addEventListener("click", () => markComplete("language"));
    $("#markGrammar").addEventListener("click", () => markComplete("grammar"));
    $("#markListen").addEventListener("click", () => markComplete("listening"));
    $("#markRead").addEventListener("click", () => markComplete("reading"));
    $("#markMock").addEventListener("click", () => markComplete("mock"));
  }

  function wireTopButtons(){
    $("#resetAll").addEventListener("click", () => {
      stopSpeech();
      location.reload();
    });
    $("#copyPlan").addEventListener("click", async () => {
      const txt = sprintBase.map(([d,t]) => `${d}: ${t}`).join("\n");
      const ok = await copyToClipboard(txt);
      alert(ok ? "Sprint plan copied." : "Could not copy.");
    });
  }

  function wireBuilderButtons(){
    $("#checkBuilder").addEventListener("click", checkBuilder);
    $("#resetBuilder").addEventListener("click", resetBuilderUI);
    $("#readChunks").addEventListener("click", () => speak(chunks.slice(0,6).join(" ")));
    $("#copyChunks").addEventListener("click", async () => {
      const ok = await copyToClipboard(chunks.join("\n"));
      alert(ok ? "Chunks copied." : "Could not copy.");
    });
  }

  function wireListening(){
    $("#stopAllAudio").addEventListener("click", stopSpeech);
    $("#playA1").addEventListener("click", () => speak(scripts().a1));
    $("#playA2").addEventListener("click", () => speak(scripts().a2));
    $("#showT1").addEventListener("click", () => { const t=$("#t1"); t.hidden=!t.hidden; });
    $("#showT2").addEventListener("click", () => { const t=$("#t2"); t.hidden=!t.hidden; });

    $("#timer20").addEventListener("click", () => {
      const box = $("#timerBox");
      clearTimer("t20");
      let s = 20;
      box.textContent = `⏱️ ${s}s`;
      state.timers.t20 = setInterval(() => {
        s -= 1;
        box.textContent = `⏱️ ${Math.max(0,s)}s`;
        if(s <= 0){
          clearTimer("t20");
          box.textContent = "⏱️ Time.";
        }
      }, 1000);
    });

    $("#playNums").addEventListener("click", () => {
      if(!state.nums.current) newNumbers();
      speak(state.nums.current.t);
    });
    $("#newNums").addEventListener("click", newNumbers);
    $("#showNums").addEventListener("click", () => { $("#numsTranscript").hidden = !$("#numsTranscript").hidden; });
    $("#checkNums").addEventListener("click", checkNumbers);
    $("#resetNums").addEventListener("click", resetNumbersUI);

    // allow enter to check
    $("#numsInput").addEventListener("keydown", (e) => {
      if(e.key === "Enter"){ e.preventDefault(); checkNumbers(); }
    });
  }

  function wireSpeaking(){
    $("#newSpeak").addEventListener("click", () => { newSpeakingPrompt(); });
    $("#listenPrompt").addEventListener("click", () => speak($("#speakPrompt").textContent));
    $("#copyPrompt").addEventListener("click", async () => {
      const ok = await copyToClipboard($("#speakPrompt").textContent);
      alert(ok ? "Prompt copied." : "Could not copy.");
    });

    $("#startPrep").addEventListener("click", () => runCountdown($("#prepNum"), 15, "prep"));
    $("#startSpeak").addEventListener("click", () => runCountdown($("#speakNum"), 75, "speak"));
    $("#resetSpeakTimers").addEventListener("click", () => {
      clearTimer("prep"); clearTimer("speak");
      $("#prepNum").textContent = "15";
      $("#speakNum").textContent = "75";
    });

    $("#recStart").addEventListener("click", startRecording);
    $("#recStop").addEventListener("click", stopRecording);
    $("#recClear").addEventListener("click", () => { stopRecording(); clearRecording(); });
  }

  function wireWriting(){
    $("#tone").addEventListener("change", renderToneHints);
    $("#showModel").addEventListener("click", () => { $("#modelAnswer").hidden = !$("#modelAnswer").hidden; });
    $("#listenModel").addEventListener("click", () => speak($("#modelAnswer").textContent || modelAnswer()));
    $("#startWrite").addEventListener("click", startWriteTimer);
    $("#resetWrite").addEventListener("click", resetWriteTimer);
    $("#clearDraft").addEventListener("click", () => { $("#emailDraft").value = ""; });
    $("#selfCheck").addEventListener("click", doSelfCheck);
  }

  function wireReport(){
    $("#copyReport").addEventListener("click", async () => {
      const txt = buildReport();
      const ok = await copyToClipboard(txt);
      alert(ok ? "Report copied." : "Could not copy.");
    });
  }

  // ---------- Reset buttons for quizzes ----------
  let trapCtrl, passiveCtrl, reportCtrl, listen1Ctrl, listen2Ctrl, readCtrl;

  function renderAllQuizzes(){
    // Traps
    const trapQs = buildTrapQuestions();
    trapCtrl = renderMCQ($("#trapQuiz"), trapQs, $("#trapScore"));
    $("#resetTraps").onclick = () => trapCtrl.reset();

    // Passive
    passiveCtrl = renderMCQ($("#passiveQuiz"), buildPassiveQuestions(), $("#passiveScore"));
    $("#resetPassive").onclick = () => passiveCtrl.reset();

    // Reported
    reportCtrl = renderMCQ($("#reportQuiz"), buildReportQuestions(), $("#reportScore"));
    $("#resetReport").onclick = () => reportCtrl.reset();

    // Listening Qs
    listen1Ctrl = renderMCQ($("#listenQuiz1"), buildListenQuestions1(), $("#listenScore1"));
    $("#resetListen1").onclick = () => listen1Ctrl.reset();

    listen2Ctrl = renderMCQ($("#listenQuiz2"), buildListenQuestions2(), $("#listenScore2"));
    $("#resetListen2").onclick = () => listen2Ctrl.reset();

    // Reading
    readCtrl = renderMCQ($("#readQuiz"), buildReadQuestions(), $("#readScore"));
    $("#resetRead").onclick = () => readCtrl.reset();
  }

  // ---------- Re-render on context/level/name changes ----------
  function refreshAll(){
    stopSpeech();

    renderSprint();
    renderChunks();
    renderBuilder();

    renderTranscripts();
    renderEmailChain();

    renderAllQuizzes();
    renderWriting();
    newSpeakingPrompt();
    newNumbers();

    // Drag & drop
    $$(".dd").forEach(renderDD);

    renderReportPreview();
  }

  function wirePersonalization(){
    ["workCtx","level","studentName"].forEach(id => {
      $("#"+id).addEventListener("change", () => {
        refreshAll();
      });
      $("#"+id).addEventListener("input", () => {
        // avoid heavy refresh on every keystroke for name: debounce lightly
        if(id !== "studentName") return;
        if(state._nameDeb) clearTimeout(state._nameDeb);
        state._nameDeb = setTimeout(() => refreshAll(), 300);
      });
    });
  }

  // ---------- Init ----------
  function init(){
    wireAccent();
    wireTapMode();
    renderProgress();
    wireSectionButtons();
    wireTopButtons();
    wireBuilderButtons();
    wireListening();
    wireSpeaking();
    wireWriting();
    wireReport();
    wirePersonalization();

    refreshAll();

    // Update report preview whenever score/progress changes (simple interval)
    setInterval(renderReportPreview, 1200);
  }

  init();

})();
