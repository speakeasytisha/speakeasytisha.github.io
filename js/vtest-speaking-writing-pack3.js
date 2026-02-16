/* SpeakEasyTisha • VTest Speaking + Writing Pack 3
   - Tap-first tools for iPad
   - Web Speech API + optional MediaRecorder
*/
(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

  const state = {
    accent: "US",
    tapMode: true,
    score: { c:0, t:0 },
    sectionsDone: new Set(),
    timers: { prep:null, speak:null, write:null },
    recorder: { rec:null, stream:null, chunks:[], url:"" }
  };

  // ---------- Global score ----------
  function addScore(correctDelta, totalDelta){
    state.score.c += correctDelta;
    state.score.t += totalDelta;
    state.score.c = clamp(state.score.c, 0, 9999);
    state.score.t = clamp(state.score.t, 0, 9999);
    $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
  }

  // ---------- Clipboard ----------
  async function copyToClipboard(text){
    try{ await navigator.clipboard.writeText(text); return true; }
    catch(e){
      const ta=document.createElement("textarea");
      ta.value=text; ta.style.position="fixed"; ta.style.left="-9999px";
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); document.body.removeChild(ta); return true; }
      catch(err){ document.body.removeChild(ta); return false; }
    }
  }

  // ---------- Speech ----------
  function speechSupported(){
    return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  }
  function stopSpeech(){ if(speechSupported()) try{ speechSynthesis.cancel(); }catch(e){} }
  function loadVoices(){ if(!speechSupported()) return []; return speechSynthesis.getVoices() || []; }
  function pickVoice(accent){
    const vs = loadVoices();
    if(!vs.length) return null;
    const want = accent==="UK" ? ["en-GB","en_GB","en-UK","en_UK"] : ["en-US","en_US"];
    const fb = accent==="UK" ? ["en","en-IE","en-AU","en-CA","en-US"] : ["en","en-CA","en-AU","en-GB"];
    const by = (arr)=>vs.find(v=>arr.some(x=>(v.lang||"").toLowerCase().includes(x.toLowerCase())));
    return by(want) || by(fb) || vs[0];
  }
  function speak(text){
    if(!speechSupported()){ alert("Audio not supported. Please read aloud."); return; }
    stopSpeech();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(state.accent);
    if(v) u.voice=v;
    u.rate=1.0; u.pitch=1.0; u.volume=1.0;
    speechSynthesis.speak(u);
  }

  if(speechSupported()){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => loadVoices();
  }

  // ---------- Progress ----------
  const progressItems = [
    { id:"cheat", label:"Cheat sheet + politeness" },
    { id:"speak", label:"Speaking gym" },
    { id:"write", label:"Writing gym" },
    { id:"mini-mock", label:"Mini mock" }
  ];

  function renderProgress(){
    const box=$("#progressChecks");
    box.innerHTML="";
    progressItems.forEach(it=>{
      const row=document.createElement("label");
      row.className="checkItem";
      row.innerHTML=`<input type="checkbox" data-prog="${it.id}"/><span>${it.label}</span>`;
      box.appendChild(row);
    });
    $$("#progressChecks input").forEach(cb=>{
      cb.addEventListener("change", ()=>{
        cb.checked ? state.sectionsDone.add(cb.dataset.prog) : state.sectionsDone.delete(cb.dataset.prog);
        updateProgress();
      });
    });
    updateProgress();
  }
  function updateProgress(){
    const total=progressItems.length;
    const done=state.sectionsDone.size;
    const pct= total ? Math.round((done/total)*100) : 0;
    $("#progressTxt").textContent=`${pct}%`;
    $("#progressFill").style.width=`${pct}%`;
  }
  function markDone(id){
    state.sectionsDone.add(id);
    const cb=$(`#progressChecks input[data-prog="${id}"]`);
    if(cb) cb.checked=true;
    updateProgress();
  }

  // ---------- Context ----------
  const ctx = {
    general: { company:"NorthBridge Solutions", client:"Taylor Morgan", dept:"Operations", issue:"a system outage", delivery:"the delivery" },
    hospitality: { company:"Riverview Hotel", client:"Ms. Taylor Morgan", dept:"Front Desk", issue:"a booking system outage", delivery:"the updated room allocation" },
    engineering: { company:"Helix Manufacturing", client:"Taylor Morgan", dept:"Supplier Quality", issue:"a production incident", delivery:"the revised shipment schedule" },
    admin: { company:"BrightLine Office", client:"Taylor Morgan", dept:"Administration", issue:"an IT access issue", delivery:"the updated documentation" },
    sales: { company:"Arcadia Sales", client:"Taylor Morgan", dept:"Customer Success", issue:"a client complaint", delivery:"the replacement order" },
    transport: { company:"MetroLink Tours", client:"Taylor Morgan", dept:"Operations", issue:"a timetable disruption", delivery:"the revised itinerary" }
  };
  function C(){ return ctx[$("#context").value] || ctx.general; }
  function you(){
    const n=($("#studentName").value||"").trim();
    return n ? n : "you";
  }
  function level(){ return $("#level").value; }

  // ---------- Quiz engine (single choice, score once per question) ----------
  function renderMCQ(container, questions, scoreEl){
    container.innerHTML="";
    let localCorrect=0;
    const total=questions.length;
    const answered = new Set();

    function update(){ scoreEl.textContent = `${localCorrect} / ${total}`; }

    questions.forEach((q, qi)=>{
      const el=document.createElement("div");
      el.className="q";
      el.innerHTML=`<div class="q__stem">${q.stem}</div><div class="opt"></div><div class="explain" hidden></div>`;
      const opt=$(".opt", el);
      const exp=$(".explain", el);

      q.options.forEach((lab, oi)=>{
        const b=document.createElement("button");
        b.type="button";
        b.className="choice";
        b.textContent=lab;
        b.setAttribute("aria-pressed","false");
        b.addEventListener("click", ()=>{
          if(answered.has(qi)) return;
          answered.add(qi);
          b.setAttribute("aria-pressed","true");
          const ok = (oi===q.answer);
          if(ok){
            b.classList.add("is-correct");
            exp.hidden=false;
            exp.textContent=`✅ ${q.explain}`;
            localCorrect += 1;
            addScore(1,1);
          }else{
            b.classList.add("is-wrong");
            const btns=$$(".choice", el);
            btns[q.answer].classList.add("is-correct");
            exp.hidden=false;
            exp.textContent=`❌ ${q.explain}`;
            addScore(0,1);
          }
          update();
        });
        opt.appendChild(b);
      });

      container.appendChild(el);
    });

    update();

    return {
      reset(){
        container.querySelectorAll(".choice").forEach(b=>{
          b.classList.remove("is-correct","is-wrong");
          b.setAttribute("aria-pressed","false");
        });
        container.querySelectorAll(".explain").forEach(e=>{ e.hidden=true; e.textContent=""; });
        answered.clear();
        localCorrect=0;
        update();
      }
    };
  }

  // ---------- Politeness quiz ----------
  function politeQuestions(){
    const c=C();
    const b2 = level()==="b2";
    const qs = [
      { stem:"Choose the best: “___ you please confirm the time?”",
        options:["Do","Could","Want"], answer:1,
        explain:"“Could you please…?” is the safest polite request."
      },
      { stem:"Choose the best: “I’d ___ to reschedule.”",
        options:["like","want","wish you"], answer:0,
        explain:"“I’d like to…” sounds natural and polite."
      },
      { stem:"Choose the best: “Would you mind ___ the file?”",
        options:["send","to send","sending"], answer:2,
        explain:"Would you mind + -ing: “Would you mind sending…?”"
      }
    ];
    if(b2){
      qs.push(
        { stem:`Choose the best: “This ___ resolve the issue by tomorrow.”`,
          options:["should","must to","want"], answer:0,
          explain:"“should” is confident but realistic (great for business)."
        },
        { stem:`Choose the best: “I’m writing regarding ${c.delivery}.”`,
          options:["regarding","about of","for to"], answer:0,
          explain:"“regarding” / “about” work; avoid “about of / for to”."
        }
      );
    }
    return qs;
  }

  // ---------- Speaking prompts ----------
  function speakingPrompts(){
    const c=C();
    const b2 = level()==="b2";
    const base = [
      `You have ${c.issue}. Explain what happened, the impact, and your solution.`,
      `A client is unhappy about a delay. Apologize, propose two options, and ask for confirmation.`,
      `Describe a time you solved a problem at work. What was the issue, what did you do, and what was the result?`,
      `Do you prefer working remotely or in the office? Give one advantage, one challenge, and a solution.`,
      `Your team is changing a process. Explain the benefit and how you will support colleagues.`
    ];
    if(b2){
      base.push(
        `You need to justify a decision to a client. State your position, acknowledge concerns, and propose a compromise.`,
        `Summarise a short meeting: what was decided, who will do what, and by when (use reported speech).`
      );
    }
    return base;
  }

  // Starters + outline chips
  function starters(){
    const b2 = level()==="b2";
    const s = [
      "In my view, …",
      "I’d say the main issue is …",
      "For example, …",
      "In my last role, …",
      "To fix this, I would …",
      "A practical solution would be …",
      "Therefore, we should …",
      "Overall, this approach should …"
    ];
    if(b2){
      s.push(
        "Having said that, …",
        "From the client’s perspective, …",
        "To avoid this in the future, …",
        "I’d suggest we …"
      );
    }
    return s;
  }

  function outlineChips(){
    const b2 = level()==="b2";
    const chips = [
      "Opinion: In my view, the priority is…",
      "Example: For example, yesterday…",
      "Solution: To fix this, we could…",
      "Close: Overall, this should…",
      "Connector: however",
      "Connector: therefore",
      "Polite: could you please…",
      "Polite: I’d like to…"
    ];
    if(b2){
      chips.push(
        "B2: Having said that,…",
        "B2: From the client’s perspective,…",
        "B2: To avoid this in the future,…"
      );
    }
    return chips;
  }

  function setSpeakingPrompt(){
    const list = speakingPrompts();
    const p = list[Math.floor(Math.random()*list.length)];
    $("#speakPrompt").textContent = p;
  }

  // Timers
  function clearTimer(which){
    if(state.timers[which]){ clearInterval(state.timers[which]); state.timers[which]=null; }
  }
  function runCountdown(el, seconds, which){
    clearTimer(which);
    let s = seconds;
    el.textContent = String(s);
    state.timers[which] = setInterval(()=>{
      s -= 1;
      el.textContent = String(Math.max(0,s));
      if(s<=0) clearTimer(which);
    }, 1000);
  }

  // Render starters chips
  function renderStarters(){
    const box=$("#speakStarters");
    box.innerHTML="";
    starters().forEach(t=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="chip";
      b.textContent=t;
      b.addEventListener("click", ()=>{
        insertAtCursor($("#outline"), t + " ");
      });
      box.appendChild(b);
    });
  }
  function renderOutlineChips(){
    const box=$("#outlineChips");
    box.innerHTML="";
    outlineChips().forEach(t=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="chip";
      b.textContent=t;
      b.addEventListener("click", ()=>{
        insertAtCursor($("#outline"), t + "\n");
      });
      box.appendChild(b);
    });
  }

  // Outline auto-check (heuristic)
  function checkOutline(){
    const text = ($("#outline").value||"").trim();
    const fb=$("#outlineFb");
    fb.dataset.scored = fb.dataset.scored || "";

    const hasOpinion = /(in my view|i’d say|i would say|the main issue)/i.test(text);
    const hasExample = /(for example|in my last role|yesterday|last week)/i.test(text);
    const hasSolution = /(to fix|solution|we could|i would|i’d suggest|therefore)/i.test(text);
    const hasClose = /(overall|in summary|this should|as a result)/i.test(text);

    const count = [hasOpinion,hasExample,hasSolution,hasClose].filter(Boolean).length;

    // score once: 1 point for good outline
    if(!fb.dataset.scored){
      addScore(0,1);
      fb.dataset.scored = "1";
    }
    if(count>=3){
      fb.className="feedback good";
      fb.textContent = `✅ Strong outline (${count}/4). Now speak using these lines.`;
      addScore(1,0); // convert to correct
    }else{
      fb.className="feedback bad";
      fb.textContent = `⚠️ Add missing parts. Aim for Opinion + Example + Solution + Close (${count}/4 found).`;
    }
  }

  // Mini speaking rephrase quiz
  function rephraseQuestions(){
    const b2=level()==="b2";
    const qs = [
      { stem:"Choose the professional option: “Give me the info.”",
        options:["Send me the info now.", "Could you please share the information?", "You give me info."],
        answer:1, explain:"Upgrade: “Could you please…?”"
      },
      { stem:"Choose the professional option: “It’s not my problem.”",
        options:["I understand. Let me look into it.", "Not my problem.", "You should fix it."],
        answer:0, explain:"Show ownership: “Let me look into it.”"
      }
    ];
    if(b2){
      qs.push(
        { stem:"Choose the best hedging: “This will fix it.”",
          options:["This should resolve the issue.", "This resolves maybe the issue.", "This fix will."],
          answer:0, explain:"“should resolve” is strong and realistic."
        }
      );
    }
    return qs;
  }

  // ---------- Writing tasks ----------
  function writingTasks(){
    const c=C();
    const b2=level()==="b2";
    const tasks = [
      {
        id:"delay",
        prompt:`Email ${c.client}: ${c.delivery} is delayed. Apologize, give a neutral reason, propose two options (time windows), and ask for confirmation.`,
        modelB1:`Subject: Update on your delivery

Hello Taylor,

I’m sorry for the inconvenience. The delivery was delayed due to a carrier issue.

The earliest new window is tomorrow between 9 and 11 a.m. If needed, we can also deliver Friday morning.

Could you please confirm which option you prefer?

Best regards,
${you()}`,
        modelB2:`Subject: Update on your delivery

Hello Taylor,

I’m sorry for the inconvenience caused by the delay. Due to a carrier issue, the shipment was delayed and could not leave the warehouse as planned.

The earliest new delivery window is tomorrow between 9 and 11 a.m. If this does not work, we can offer a priority option for Friday morning.

Could you please confirm which option you prefer?

Best regards,
${you()}`
      },
      {
        id:"meeting",
        prompt:`Write a follow‑up email after a meeting. Summarise decisions, who will do what, and deadlines. Keep it clear (8–12 lines).`,
        modelB1:`Subject: Meeting follow‑up

Hello everyone,

Thank you for the meeting. We agreed to update the process and share a new version of the document.
Jordan will send the draft tomorrow, and Sam will review it by Friday.

Please let me know if anything is missing.

Best regards,
${you()}`,
        modelB2:`Subject: Meeting follow‑up – action items

Hello everyone,

Thank you for your time today. To summarise, we agreed to update the process and share a revised document.
Jordan confirmed they will send the first draft by tomorrow afternoon, and Sam will review it by Friday.

If you have any questions or additions, please let me know.

Best regards,
${you()}`
      },
      {
        id:"request",
        prompt:`Write an email to request missing information (polite). Explain why you need it and set a clear deadline.`,
        modelB1:`Subject: Request for information

Hello Taylor,

I’m writing to ask for the missing details so we can complete the file.
Could you please send the document and the reference number by tomorrow?

Thank you in advance.

Best regards,
${you()}`,
        modelB2:`Subject: Request for missing information

Hello Taylor,

I’m writing to request the missing details so we can finalise the file and avoid any delay.
Could you please share the document and the reference number by tomorrow at 2 p.m.?

Thank you for your help.

Best regards,
${you()}`
      }
    ];
    if(b2){
      tasks.push({
        id:"complaint",
        prompt:`Reply to a complaint: acknowledge, apologise, propose a solution, and set expectations (firm but polite).`,
        modelB1:`Subject: Re: Complaint

Hello Taylor,

I’m sorry for the inconvenience. I understand this is frustrating.
We can offer a replacement tomorrow morning and a confirmation email today.

Best regards,
${you()}`,
        modelB2:`Subject: Re: Your complaint

Hello Taylor,

Thank you for your message, and I’m sorry for the inconvenience. I understand the impact on your schedule.
To resolve this quickly, we can deliver a replacement tomorrow morning and send a written confirmation today. If tomorrow doesn’t work, we can offer a priority option for Friday morning.

Could you please confirm which option you prefer?

Kind regards,
${you()}`
      });
    }
    return tasks;
  }

  function pickTask(){
    const list = writingTasks();
    return list[Math.floor(Math.random()*list.length)];
  }

  let currentTask = null;

  function renderTask(){
    currentTask = pickTask();
    $("#writeTask").textContent = currentTask.prompt;
    $("#modelAnswer").textContent = (level()==="b2") ? currentTask.modelB2 : currentTask.modelB1;
    $("#modelAnswer").hidden = true;
    $("#emailDraft").value = "";
    $("#writeFb").textContent = "";
    $("#writeFb").className = "feedback";
    $("#writeFb").dataset.scored = "";
    renderChecklist();
    renderToneHints();
    renderPhraseBank();
    renderUpgrade();
  }

  // Tone hints
  const toneHints = {
    neutral: [
      "Polite + clear: “I’m sorry for the inconvenience.”",
      "Neutral reason: “Due to an unexpected issue…”",
      "Action: “We can offer…”",
      "Deadline: “by the end of the day”"
    ],
    warm: [
      "Warm opener: “Thanks for your patience.”",
      "Empathy: “I understand this is frustrating.”",
      "Positive close: “Thank you for your understanding.”"
    ],
    firm: [
      "Calm + clear: “To move forward, please confirm…”",
      "Set expectations: “We can offer…” (not “we must”)",
      "Deadline: “If we don’t hear back by…, we will…”"
    ]
  };
  function renderToneHints(){
    const t=$("#tone").value;
    const hints=toneHints[t] || toneHints.neutral;
    $("#toneHints").innerHTML = `<ul style="margin:0; padding-left:18px;">${hints.map(h=>`<li>${h}</li>`).join("")}</ul>`;
  }

  // Phrase bank
  function phraseBank(){
    const b2=level()==="b2";
    const c=C();
    const base = [
      "Thank you for your message.",
      "I’m sorry for the inconvenience.",
      "Due to an unexpected issue, the delivery has been delayed.",
      "We can offer two options:",
      "The earliest new window is tomorrow between 9 and 11 a.m.",
      "Could you please confirm which option you prefer?",
      "I’ll keep you updated by the end of the day.",
      "Best regards,"
    ];
    if(b2){
      base.splice(2,1, "Due to a carrier issue, the shipment was delayed and could not leave the warehouse as planned.");
      base.push("To prevent this from happening again, we are implementing a double‑check step before dispatch.");
      base.push("If this does not work, we can offer a priority option for Friday morning.");
    }
    // light context injection
    base.push(`(Context) ${c.company} / ${c.dept}`);
    return base;
  }

  function renderPhraseBank(){
    const box=$("#phraseBank");
    box.innerHTML="";
    phraseBank().forEach(p=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="chip";
      b.textContent=p;
      b.addEventListener("click", ()=> insertAtCursor($("#emailDraft"), p + "\n"));
      box.appendChild(b);
    });
  }

  // Insert helper
  function insertAtCursor(textarea, text){
    textarea.focus();
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const v = textarea.value;
    textarea.value = v.slice(0,start) + text + v.slice(end);
    const pos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
  }

  // Listen/copy phrases
  function listenSomePhrases(){
    const list = phraseBank().slice(0,6).join(" ");
    speak(list);
  }

  // Checklist
  function renderChecklist(){
    const items = [
      { id:"purpose", label:"Purpose is clear (why you write)" },
      { id:"apology", label:"Apology / acknowledgement (if needed)" },
      { id:"context", label:"Context / reason (neutral)" },
      { id:"action", label:"Solution / options" },
      { id:"request", label:"Request / next step (confirm / send / reply)" },
      { id:"closing", label:"Closing + signature" }
    ];
    $("#writeChecklist").innerHTML = items.map(it=>`
      <label class="ck">
        <input type="checkbox" data-ck="${it.id}" />
        <div>${it.label}</div>
      </label>
    `).join("");
  }

  function selfCheckEmail(){
    const text = ($("#emailDraft").value || "").trim();
    const fb = $("#writeFb");

    const checks = {
      purpose: /(i'?m writing|i am writing|regarding|about|update|follow-?up|request)/i.test(text),
      apology: /(sorry|apolog|inconvenience|thank you for your patience|i understand)/i.test(text),
      context: /(due to|because|as a result|carrier|issue|delay|outage|missing)/i.test(text),
      action: /(we can|we could|offer|option|solution|deliver|send|provide|tomorrow|friday|between)/i.test(text),
      request: /(could you|please|confirm|let me know|would you|can you)/i.test(text),
      closing: /(best regards|kind regards|sincerely)/i.test(text)
    };

    $$("#writeChecklist input").forEach(cb=>{
      cb.checked = !!checks[cb.dataset.ck];
    });

    const okCount = Object.values(checks).filter(Boolean).length;

    // score once: 1 point for strong email
    if(!fb.dataset.scored){
      addScore(0,1);
      fb.dataset.scored = "1";
    }

    // Lines check (8–12 lines recommended)
    const lines = text ? text.split(/\n+/).map(x=>x.trim()).filter(Boolean).length : 0;
    const lineOk = (lines>=8 && lines<=12);

    if(okCount>=5 && lineOk){
      fb.className="feedback good";
      fb.textContent = `✅ Exam-ready. ${okCount}/6 checks found. Lines: ${lines} (good).`;
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent = `⚠️ Improve: ${okCount}/6 checks. Lines: ${lines} (target 8–12). Add missing parts + keep it structured.`;
    }
  }

  // Timed writing (10 minutes)
  function startWriteTimer(){
    clearTimer("write");
    let remaining = 10*60;
    const el=$("#writeNum");
    const fmt=(s)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
    el.textContent = fmt(remaining);
    state.timers.write = setInterval(()=>{
      remaining -= 1;
      el.textContent = fmt(Math.max(0,remaining));
      if(remaining<=0) clearTimer("write");
    }, 1000);
  }
  function resetWriteTimer(){
    clearTimer("write");
    $("#writeNum").textContent="10:00";
  }

  // Upgrade tool
  function upgrades(){
    const b2=level()==="b2";
    return {
      apology: b2 ? "I’m sorry for the inconvenience caused by this situation." : "I’m sorry for the inconvenience.",
      reason: b2 ? "Due to a carrier issue, the shipment was delayed and could not leave the warehouse as planned." : "The delivery was delayed due to an issue.",
      solution: b2 ? "The earliest new delivery window is tomorrow between 9 and 11 a.m.; alternatively, we can offer a priority option for Friday morning." : "We can deliver tomorrow 9–11 a.m., or Friday morning.",
      request: b2 ? "Could you please confirm which option you prefer so we can proceed?" : "Could you please confirm which option you prefer?",
      deadline: b2 ? "I’ll follow up by the end of the day if I don’t hear back." : "I’ll follow up by the end of the day."
    };
  }
  function renderUpgrade(){
    $("#upgradeOut").textContent = "";
  }
  function makeUpgrade(){
    const k=$("#upgradePick").value;
    const u=upgrades()[k] || "";
    $("#upgradeOut").textContent = u;
  }

  // ---------- Optional recording ----------
  async function startRecording(){
    const btnStart=$("#recStart"), btnStop=$("#recStop");
    const audio=$("#recAudio"), dl=$("#recDownload");
    try{
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        alert("Recording not supported. You can still practise.");
        return;
      }
      state.recorder.stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mr = new MediaRecorder(state.recorder.stream);
      state.recorder.chunks = [];
      mr.ondataavailable = (e)=>{ if(e.data && e.data.size) state.recorder.chunks.push(e.data); };
      mr.onstop = ()=>{
        const blob = new Blob(state.recorder.chunks, { type: mr.mimeType || "audio/webm" });
        if(state.recorder.url) URL.revokeObjectURL(state.recorder.url);
        state.recorder.url = URL.createObjectURL(blob);
        audio.src = state.recorder.url;
        dl.href = state.recorder.url;
        dl.hidden=false;
      };
      mr.start();
      state.recorder.rec = mr;
      btnStart.disabled=true;
      btnStop.disabled=false;
      dl.hidden=true;
    }catch(e){
      alert("Microphone permission blocked or not available.");
    }
  }
  function stopRecording(){
    const btnStart=$("#recStart"), btnStop=$("#recStop");
    try{
      if(state.recorder.rec && state.recorder.rec.state!=="inactive") state.recorder.rec.stop();
      if(state.recorder.stream) state.recorder.stream.getTracks().forEach(t=>t.stop());
    }catch(e){}
    state.recorder.rec=null; state.recorder.stream=null;
    btnStart.disabled=false; btnStop.disabled=true;
  }
  function clearRecording(){
    const audio=$("#recAudio"), dl=$("#recDownload");
    audio.removeAttribute("src"); audio.load();
    if(state.recorder.url){ URL.revokeObjectURL(state.recorder.url); state.recorder.url=""; }
    dl.hidden=true;
  }

  // ---------- Cheat sheet copy ----------
  function cheatSheetText(){
    return [
      "VTest Speaking template:",
      "1) Opinion: In my view… / I’d say…",
      "2) Example: For example… / In my last role…",
      "3) Solution: To fix this, I would…",
      "4) Close: Overall, this should…",
      "",
      "VTest Email template:",
      "Purpose → Context → Action → Request → Closing",
      "Polite tools: could / would / would you mind + -ing / I’d like to…",
      "Deadline: by the end of the day / by tomorrow at 2 p.m."
    ].join("\n");
  }

  // ---------- Report ----------
  function buildReport(){
    const total=state.score.t;
    const correct=state.score.c;
    const pct= total ? Math.round((correct/total)*100) : 0;
    const done = Array.from(state.sectionsDone).join(", ") || "(none)";
    return [
      "VTest Pack 3 Report",
      `Student: ${you()}`,
      `Context: ${$("#context").value}`,
      `Level: ${$("#level").value.toUpperCase()}`,
      `Score: ${correct}/${total} (${pct}%)`,
      `Completed: ${done}`,
      "",
      "Homework (15 min):",
      "- Speak 1 prompt using 4-line structure.",
      "- Write 1 email using Purpose→Context→Action→Request→Close.",
      "- Learn 6 phrase-bank chunks."
    ].join("\n");
  }
  function renderReportPreview(){
    $("#reportPreview").textContent = buildReport();
  }

  // ---------- Wire up ----------
  let politeCtrl, rephraseCtrl;

  function renderQuizzes(){
    politeCtrl = renderMCQ($("#politeQuiz"), politeQuestions(), $("#politeScore"));
    $("#resetPolite").onclick = ()=>politeCtrl.reset();

    rephraseCtrl = renderMCQ($("#rephraseQuiz"), rephraseQuestions(), $("#rephraseScore"));
    $("#resetRephrase").onclick = ()=>rephraseCtrl.reset();
  }

  function wire(){
    // accent
    $("#accentUS").addEventListener("click", ()=>{
      state.accent="US";
      $("#accentUS").setAttribute("aria-pressed","true");
      $("#accentUK").setAttribute("aria-pressed","false");
    });
    $("#accentUK").addEventListener("click", ()=>{
      state.accent="UK";
      $("#accentUS").setAttribute("aria-pressed","false");
      $("#accentUK").setAttribute("aria-pressed","true");
    });

    // tap mode (kept ON by default)
    $("#toggleTap").addEventListener("click", ()=>{
      state.tapMode=!state.tapMode;
      $("#toggleTap").setAttribute("aria-pressed", state.tapMode ? "true" : "false");
      $("#toggleTap").textContent = state.tapMode ? "On" : "Off";
    });

    // section marks
    $("#markCheat").addEventListener("click", ()=>markDone("cheat"));
    $("#markSpeak").addEventListener("click", ()=>markDone("speak"));
    $("#markWrite").addEventListener("click", ()=>markDone("write"));
    $("#markMock").addEventListener("click", ()=>markDone("mini-mock"));

    // reset all
    $("#resetAll").addEventListener("click", ()=>{
      stopSpeech();
      location.reload();
    });

    // cheat actions
    $("#listenCheat").addEventListener("click", ()=>speak(cheatSheetText()));
    $("#copyCheat").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(cheatSheetText());
      alert(ok ? "Cheat sheet copied." : "Could not copy.");
    });

    // speaking prompt
    $("#newSpeak").addEventListener("click", ()=>setSpeakingPrompt());
    $("#speakListenPrompt").addEventListener("click", ()=>speak($("#speakPrompt").textContent));
    $("#copyPrompt").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#speakPrompt").textContent);
      alert(ok ? "Prompt copied." : "Could not copy.");
    });

    // show starters
    $("#showHelp").addEventListener("click", ()=>{
      const box=$("#starterBox");
      const now = box.hidden;
      box.hidden = !now;
      $("#showHelp").setAttribute("aria-expanded", now ? "true" : "false");
      $("#showHelp").textContent = now ? "Hide starters" : "Show starters";
    });

    // outline
    $("#clearOutline").addEventListener("click", ()=>{
      $("#outline").value="";
      const fb=$("#outlineFb");
      fb.textContent=""; fb.className="feedback"; fb.dataset.scored="";
    });
    $("#checkOutline").addEventListener("click", checkOutline);

    // timers
    $("#startPrep").addEventListener("click", ()=>runCountdown($("#prepNum"), 15, "prep"));
    $("#startSpeak").addEventListener("click", ()=>runCountdown($("#speakNum"), 75, "speak"));
    $("#resetSpeakTimers").addEventListener("click", ()=>{
      clearTimer("prep"); clearTimer("speak");
      $("#prepNum").textContent="15";
      $("#speakNum").textContent="75";
    });

    // recording
    $("#recStart").addEventListener("click", startRecording);
    $("#recStop").addEventListener("click", stopRecording);
    $("#recClear").addEventListener("click", ()=>{ stopRecording(); clearRecording(); });

    // writing
    $("#tone").addEventListener("change", renderToneHints);
    $("#showModel").addEventListener("click", ()=>{ $("#modelAnswer").hidden = !$("#modelAnswer").hidden; });
    $("#listenModel").addEventListener("click", ()=>speak($("#modelAnswer").textContent));
    $("#copyModel").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#modelAnswer").textContent);
      alert(ok ? "Model copied." : "Could not copy.");
    });
    $("#newTask").addEventListener("click", renderTask);
    $("#startWrite").addEventListener("click", startWriteTimer);
    $("#resetWrite").addEventListener("click", resetWriteTimer);
    $("#clearDraft").addEventListener("click", ()=>{
      $("#emailDraft").value="";
      $("#writeFb").textContent=""; $("#writeFb").className="feedback"; $("#writeFb").dataset.scored="";
      $$("#writeChecklist input").forEach(x=>x.checked=false);
    });
    $("#selfCheck").addEventListener("click", selfCheckEmail);

    // phrase bank actions
    $("#listenPhrases").addEventListener("click", listenSomePhrases);
    $("#copyPhrases").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(phraseBank().join("\n"));
      alert(ok ? "Phrases copied." : "Could not copy.");
    });

    // upgrade
    $("#makeUpgrade").addEventListener("click", makeUpgrade);
    $("#listenUpgrade").addEventListener("click", ()=>speak($("#upgradeOut").textContent || ""));
    $("#insertUpgrade").addEventListener("click", ()=>{
      const t=$("#upgradeOut").textContent.trim();
      if(!t) return;
      insertAtCursor($("#emailDraft"), t + "\n");
    });

    // mock start (just sets timers + scrolls)
    $("#startMock").addEventListener("click", ()=>{
      document.location.hash = "#speak";
      runCountdown($("#prepNum"), 15, "prep");
      setTimeout(()=>runCountdown($("#speakNum"), 75, "speak"), 200);
      setTimeout(()=>{
        document.location.hash = "#write";
        startWriteTimer();
      }, 1200);
    });

    // report
    $("#copyReport").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(buildReport());
      alert(ok ? "Report copied." : "Could not copy.");
    });

    // refresh on personalization
    ["studentName","level","context"].forEach(id=>{
      $("#"+id).addEventListener("change", initContent);
      $("#"+id).addEventListener("input", ()=>{
        if(id!=="studentName") return;
        if(state._deb) clearTimeout(state._deb);
        state._deb = setTimeout(initContent, 250);
      });
    });
  }

  function initContent(){
    stopSpeech();
    renderQuizzes();
    renderStarters();
    renderOutlineChips();
    setSpeakingPrompt();
    renderTask();
    renderReportPreview();
  }

  function init(){
    renderProgress();
    wire();
    initContent();
    setInterval(renderReportPreview, 1200);
  }

  init();
})();
