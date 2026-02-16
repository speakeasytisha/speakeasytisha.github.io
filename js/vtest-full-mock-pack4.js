/* SpeakEasyTisha • VTest Full Mock Pack 4
   - Single page mock: Listening → Reading → Speaking → Writing → Report
   - No external assets
   - Tap-friendly (iPad)
*/
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

  const STORE_KEY = "vtest_pack4_fullmock_v1";

  const state = {
    accent: "US",
    tapMode: true,
    score: { c:0, t:0 },
    sectionsDone: new Set(),
    timers: { listen:null, read:null, write:null, prep:null, speak:null },
    recorder: { rec:null, stream:null, chunks:[], url:"" },
    seed: Math.floor(Math.random()*1e9),
    content: null
  };

  function addScore(correctDelta, totalDelta){
    state.score.c += correctDelta;
    state.score.t += totalDelta;
    state.score.c = clamp(state.score.c, 0, 99999);
    state.score.t = clamp(state.score.t, 0, 99999);
    $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
  }

  function you(){
    const n = ($("#studentName").value || "").trim();
    return n ? n : "you";
  }
  function level(){ return $("#level").value; }
  function C(){ return state.content?.ctx || ctx.general; }

  function rand(){
    const x = Math.sin(state.seed++) * 10000;
    return x - Math.floor(x);
  }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }

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

  // ---- Speech (TTS)
  function speechSupported(){
    return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);
  }
  function stopSpeech(){ if(speechSupported()) try{ speechSynthesis.cancel(); }catch(e){} }
  function loadVoices(){ if(!speechSupported()) return []; return speechSynthesis.getVoices() || []; }
  function pickVoice(accent){
    const vs = loadVoices();
    if(!vs.length) return null;
    const want = accent==="UK" ? ["en-GB","en_GB"] : ["en-US","en_US"];
    const fb = accent==="UK" ? ["en","en-IE","en-AU","en-CA","en-US"] : ["en","en-CA","en-AU","en-GB"];
    const by = (arr)=>vs.find(v=>arr.some(x=>(v.lang||"").toLowerCase().includes(x.toLowerCase())));
    return by(want) || by(fb) || vs[0];
  }
  function speak(text, rate=1.0){
    if(!speechSupported()){ alert("Audio not supported. Please read aloud."); return; }
    stopSpeech();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(state.accent);
    if(v) u.voice = v;
    u.rate = rate; u.pitch = 1.0; u.volume = 1.0;
    speechSynthesis.speak(u);
  }
  function speakDigits(digits, rate=1.0){
    const spaced = String(digits).split("").join(" ");
    speak(spaced, rate);
  }
  if(speechSupported()){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => loadVoices();
  }

  // ---- Timers
  function clearTimer(which){
    if(state.timers[which]){ clearInterval(state.timers[which]); state.timers[which]=null; }
  }
  function startMMSS(which, totalSec, el){
    clearTimer(which);
    let s = totalSec;
    const fmt = (x)=>`${String(Math.floor(x/60)).padStart(2,"0")}:${String(x%60).padStart(2,"0")}`;
    el.textContent = fmt(s);
    state.timers[which] = setInterval(()=>{
      s -= 1;
      el.textContent = fmt(Math.max(0,s));
      if(s<=0) clearTimer(which);
    }, 1000);
  }
  function startCount(which, sec, el){
    clearTimer(which);
    let s = sec;
    el.textContent = String(s);
    state.timers[which] = setInterval(()=>{
      s -= 1;
      el.textContent = String(Math.max(0,s));
      if(s<=0) clearTimer(which);
    }, 1000);
  }

  // ---- Progress
  const progressItems = [
    { id:"listen", label:"Listening" },
    { id:"read", label:"Reading" },
    { id:"speak", label:"Speaking" },
    { id:"write", label:"Writing" },
    { id:"report", label:"Report" }
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
        renderReport();
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
  function markDone(id){
    state.sectionsDone.add(id);
    const cb = $(`#progressChecks input[data-prog="${id}"]`);
    if(cb) cb.checked=true;
    updateProgress();
    renderReport();
  }

  // ---- Context templates
  const ctx = {
    general: { company:"NorthBridge Solutions", client:"Taylor Morgan", dept:"Operations", project:"Service Upgrade", phone:"+1 617 555 0148" },
    hospitality: { company:"Riverview Hotel", client:"Ms. Taylor Morgan", dept:"Front Desk", project:"Group Booking", phone:"+44 20 7946 0812" },
    engineering: { company:"Helix Manufacturing", client:"Taylor Morgan", dept:"Supplier Quality", project:"Shipment Update", phone:"+1 312 555 0199" },
    admin: { company:"BrightLine Office", client:"Taylor Morgan", dept:"Administration", project:"Access Request", phone:"+33 1 84 88 12 30" },
    sales: { company:"Arcadia Sales", client:"Taylor Morgan", dept:"Customer Success", project:"Order Issue", phone:"+1 415 555 0137" },
    transport: { company:"MetroLink Tours", client:"Taylor Morgan", dept:"Operations", project:"Itinerary Change", phone:"+44 161 555 0101" }
  };

  function buildContent(){
    const c = ctx[$("#context").value] || ctx.general;
    const b2 = level()==="b2";

    const refDigits = b2 ? "50821" : "42190";
    const timeSlot = b2 ? "Thursday at 3 p.m." : "Thursday at 3";
    const audio1 =
      `Hello, this is Alex from ${c.company}. I'm calling about ${c.project}. ` +
      `There is a small delay because we are waiting for a confirmation from our partner. ` +
      `The new delivery window is ${timeSlot}. ` +
      `If that doesn't work, we can offer Friday morning. ` +
      `Please reply to confirm. Your reference number is ${refDigits}. Thank you.`;

    const audio2 =
      `Hi team, quick meeting recap. ` +
      `First, we agreed to update the document today. ` +
      `Jordan will send the first draft by tomorrow afternoon. ` +
      `Sam will review it by Friday. ` +
      `If there are any questions, please email me by the end of the day. Thanks.`;

    const listenQ1 = [
      { stem:"What is the main purpose of the voicemail?",
        options:["To cancel the project", "To update about a delay and confirm a new time", "To ask for payment"],
        answer: 1,
        explain:"It’s an update: delay + new time + confirmation request."
      },
      { stem:"What is the first proposed new time?",
        options:[timeSlot, "Friday evening", "Next Monday morning"],
        answer: 0,
        explain:`The first proposed time is ${timeSlot}.`
      },
      { stem:"What is the alternative option?",
        options:["Friday morning", "A refund", "A new supplier"],
        answer: 0,
        explain:"The alternative is Friday morning."
      }
    ];

    const listenQ2 = [
      { stem:"What is the main topic?",
        options:["A meeting recap with action items", "A job interview", "A marketing pitch"],
        answer: 0,
        explain:"It’s a recap: decisions + who does what + deadlines."
      },
      { stem:"Who will review the draft?",
        options:["Jordan", "Sam", "Alex"],
        answer: 1,
        explain:"Sam will review it."
      },
      { stem:"By when should questions be emailed?",
        options:["By the end of the day", "By next week", "By Friday morning"],
        answer: 0,
        explain:"The deadline is “by the end of the day”."
      }
    ];

    const listenPolite = [
      { stem:"Choose the best professional line:",
        options:["Send it now.", "Could you please confirm your availability?", "You must answer."],
        answer: 1,
        explain:"Polite request: Could you please…"
      }
    ];

    const day = b2 ? "Thursday" : "Wednesday";
    const deadline = b2 ? "tomorrow at 2 p.m." : "tomorrow";

    const domain = c.company.replace(/\s+/g,"").toLowerCase();
    const mailbox = [
      {
        subj:`Re: ${c.project} — schedule update`,
        from:`From: Taylor Morgan <taylor.morgan@client.com>`,
        date:`${day}, 09:12`,
        body:
`Hello,

Thanks for the update. Thursday at 3 p.m. could work, but I need confirmation today.

Also, could you please send the updated document and the reference number?

Best,
Taylor`
      },
      {
        subj:`Re: ${c.project} — confirmation`,
        from:`From: Alex Chen <alex.chen@${domain}.com>`,
        date:`${day}, 10:04`,
        body:
`Hello Taylor,

Thank you for your message. I can confirm the new window: Thursday at 3 p.m.
Reference: ${refDigits}

I’m attaching the updated document. If you have questions, please let me know by ${deadline}.

Best regards,
Alex`
      },
      {
        subj:`Internal: action items (${c.dept})`,
        from:`From: Sam Lee <sam.lee@${domain}.com>`,
        date:`${day}, 10:15`,
        body:
`Hi team,

Please remember:
1) Jordan sends the draft by tomorrow afternoon.
2) I review it by Friday.
3) We send the final version to the client.

Thanks,
Sam`
      }
    ];

    const readQuiz = [
      { stem:"What does Taylor want today?",
        options:["A refund", "Confirmation and an updated document", "A meeting invitation"],
        answer: 1,
        explain:"Taylor asks for confirmation today + updated document + reference."
      },
      { stem:"What is the reference number?",
        options:[refDigits, "99102", "13057"],
        answer: 0,
        explain:`Reference: ${refDigits}.`
      },
      { stem:"Who sends the draft by tomorrow afternoon?",
        options:["Sam", "Jordan", "Taylor"],
        answer: 1,
        explain:"Jordan sends the draft."
      }
    ];

    const orderStepsCorrect = [
      "Confirm the new schedule with the client.",
      "Send the updated document + reference number.",
      "Jordan sends the first draft.",
      "Sam reviews the draft.",
      "Send the final version to the client."
    ];

    const speakPrompts = [
      "A client is worried about a delay. Explain the situation, propose two options, and ask for confirmation.",
      "Describe a work problem you solved. What happened, what did you do, and what was the result?",
      "You need to justify a decision. State your position, acknowledge the client’s concern, and propose a compromise.",
      "Summarise a short meeting: decisions, responsibilities, and deadlines."
    ];

    const writeTasks = [
      {
        id:"delay",
        prompt:`Email ${c.client}: confirm Thursday at 3 p.m., include the reference number, and ask if Friday morning is needed as a backup.`,
        modelB1:
`Subject: Confirmation – ${c.project}

Hello Taylor,

Thank you for your message. I can confirm Thursday at 3 p.m.
Your reference number is ${refDigits}.

If Thursday does not work, we can also offer Friday morning.
Could you please confirm your preferred option?

Best regards,
${you()}`,
        modelB2:
`Subject: Confirmation – ${c.project}

Hello Taylor,

Thank you for your message. I can confirm the new delivery window: Thursday at 3 p.m.
Reference: ${refDigits}

If this does not work, we can offer a priority option for Friday morning as a backup.
Could you please confirm your preferred option so we can proceed?

Kind regards,
${you()}`
      },
      {
        id:"followup",
        prompt:"Write a follow‑up email after a meeting: summarise decisions, action owners, and deadlines (8–12 lines).",
        modelB1:
`Subject: Meeting follow‑up

Hello everyone,

Thank you for the meeting. We agreed to update the document today.
Jordan will send the draft by tomorrow afternoon, and Sam will review it by Friday.

Please let me know if anything is missing.

Best regards,
${you()}`,
        modelB2:
`Subject: Meeting follow‑up – action items

Hello everyone,

Thank you for your time today. To summarise, we agreed to update the document today.
Jordan confirmed they will send the first draft by tomorrow afternoon, and Sam will review it by Friday.
Once approved, we will send the final version to the client.

If you have questions, please let me know by the end of the day.

Best regards,
${you()}`
      },
      {
        id:"request",
        prompt:`Email a colleague: request missing information politely and set a clear deadline (${deadline}).`,
        modelB1:
`Subject: Request for information

Hi,

Could you please send me the missing details so we can finalise the file?
If possible, please send them by ${deadline}.

Thank you,
${you()}`,
        modelB2:
`Subject: Request for missing information

Hi,

I’m writing to request the missing details so we can finalise the file and avoid any delay.
Could you please share the information by ${deadline}?

Thanks in advance,
${you()}`
      }
    ];

    const phrasesBase = [
      "Thank you for your message.",
      "I can confirm the new schedule.",
      `Reference: ${refDigits}.`,
      "If this does not work, we can offer an alternative option.",
      "Could you please confirm your preferred option?",
      "I’ll follow up by the end of the day.",
      "Best regards,"
    ];

    const upgrades = (b2) ? {
      purpose: "I’m writing regarding the latest update and next steps.",
      apology: "I’m sorry for the inconvenience caused by this change.",
      reason: "Due to a partner confirmation issue, the schedule had to be adjusted.",
      solution: "We can proceed on Thursday at 3 p.m.; alternatively, we can offer Friday morning as a backup option.",
      request: "Could you please confirm your preferred option so we can proceed?",
      deadline: "If I don’t hear back by the end of the day, I will follow up."
    } : {
      purpose: "I’m writing to confirm the update.",
      apology: "I’m sorry for the inconvenience.",
      reason: "There is a delay because we are waiting for confirmation.",
      solution: "We can do Thursday at 3, or Friday morning.",
      request: "Could you please confirm your option?",
      deadline: "I’ll follow up by the end of the day."
    };

    const starters = (b2 ? [
      "In my view, …",
      "I’d say the main point is …",
      "For example, …",
      "To fix this, we could …",
      "Overall, this should …",
      "Having said that, …",
      "From the client’s perspective, …",
      "Therefore, …"
    ] : [
      "In my view, …",
      "For example, …",
      "To fix this, we could …",
      "Overall, this should …",
      "Therefore, …"
    ]);

    const outlineChips = (b2 ? [
      "Opinion: In my view, the priority is…",
      "Example: For example, yesterday…",
      "Solution: To fix this, we could…",
      "Close: Overall, this should…",
      "Connector: however",
      "Connector: therefore",
      "Polite: could you please…"
    ] : [
      "Opinion: In my view, …",
      "Example: For example, …",
      "Solution: To fix this, …",
      "Close: Overall, …",
      "Polite: could you please…"
    ]);

    const speakChecklist = [
      "I used a clear structure (opinion → example → solution → close).",
      "I used at least 2 connectors (however / therefore / for example).",
      "I used polite business language (could / would / I’d suggest).",
      "My pronunciation was clear (slow, stressed key words).",
      "I finished with a clear close / next step."
    ];

    return {
      ctx: c,
      refDigits,
      audio1, audio2,
      listenQ1, listenQ2, listenPolite,
      mailbox, readQuiz, orderStepsCorrect,
      speakPrompts, starters, outlineChips, speakChecklist,
      writeTasks, phrasesBase, upgrades,
      meta: { b2, deadline, day, timeSlot }
    };
  }

  // ---- Quiz engine
  function renderMCQ(container, questions){
    container.innerHTML="";
    const answered = new Set();
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
            exp.hidden=false; exp.textContent = `✅ ${q.explain}`;
            addScore(1,1);
          }else{
            b.classList.add("is-wrong");
            const btns = $$(".choice", el);
            btns[q.answer].classList.add("is-correct");
            exp.hidden=false; exp.textContent = `❌ ${q.explain}`;
            addScore(0,1);
          }
          renderReport();
        });
        opt.appendChild(b);
      });

      container.appendChild(el);
    });
  }

  // ---- Reading order task (tap up/down)
  function renderOrderTask(items){
    const box=$("#orderBox");
    box.innerHTML="";
    items.forEach((txt)=>{
      const row=document.createElement("div");
      row.className="orderItem";
      row.innerHTML = `
        <div class="orderTxt">${txt}</div>
        <div class="orderBtns">
          <button type="button" class="iconBtn" data-move="up" aria-label="Move up">↑</button>
          <button type="button" class="iconBtn" data-move="down" aria-label="Move down">↓</button>
        </div>
      `;
      box.appendChild(row);
    });

    function swap(i,j){
      const nodes = $$(".orderItem", box);
      if(i<0 || j<0 || i>=nodes.length || j>=nodes.length) return;
      const a=nodes[i], b=nodes[j];
      if(i<j) box.insertBefore(b,a); else box.insertBefore(a,b);
    }

    box.addEventListener("click", (e)=>{
      const btn = e.target.closest(".iconBtn");
      if(!btn) return;
      const row = e.target.closest(".orderItem");
      if(!row) return;
      const nodes = $$(".orderItem", box);
      const i = nodes.indexOf(row);
      const move = btn.dataset.move;
      if(move==="up") swap(i-1,i);
      if(move==="down") swap(i,i+1);
    });
  }

  function currentOrder(){
    return $$("#orderBox .orderItem").map(x=>$(".orderTxt",x).textContent.trim());
  }

  function checkOrder(correct){
    const now = currentOrder();
    const fb=$("#orderFb");
    if(!fb.dataset.scored){
      addScore(0,1);
      fb.dataset.scored="1";
    }
    const ok = now.join("||") === correct.join("||");
    if(ok){
      fb.className="feedback good";
      fb.textContent="✅ Correct order. Great scanning + logic.";
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent="❌ Not quite. Tip: confirm with client first; send final version last.";
    }
    renderReport();
  }

  // ---- Speaking chips + outline check
  function insertAtCursor(textarea, text){
    textarea.focus();
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const v = textarea.value;
    textarea.value = v.slice(0,start) + text + v.slice(end);
    const pos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
  }
  function renderChips(boxId, items, targetTextareaId, addNewline=false){
    const box=$(boxId);
    box.innerHTML="";
    items.forEach(t=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="chip";
      b.textContent=t;
      b.addEventListener("click", ()=>{
        insertAtCursor($(targetTextareaId), t + (addNewline ? "\n" : " "));
      });
      box.appendChild(b);
    });
  }

  function outlineAutoCheck(){
    const text = ($("#outline").value||"").trim();
    const fb=$("#outlineFb");
    if(!fb.dataset.scored){
      addScore(0,1);
      fb.dataset.scored="1";
    }
    const hasOpinion = /(in my view|i’d say|priority|main point)/i.test(text);
    const hasExample = /(for example|yesterday|last week|in my last role)/i.test(text);
    const hasSolution = /(to fix|solution|we could|i would|i’d suggest|therefore)/i.test(text);
    const hasClose = /(overall|in summary|this should|next step)/i.test(text);
    const count = [hasOpinion,hasExample,hasSolution,hasClose].filter(Boolean).length;
    if(count>=3){
      fb.className="feedback good";
      fb.textContent=`✅ Strong outline (${count}/4). Now speak from your lines.`;
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent=`⚠️ Add missing parts. Target: Opinion + Example + Solution + Close (${count}/4 found).`;
    }
    renderReport();
  }

  function renderSpeakChecklist(items){
    const box=$("#speakChecklist");
    box.innerHTML = items.map((t,i)=>`
      <label class="ck">
        <input type="checkbox" data-sck="${i}" />
        <div>${t}</div>
      </label>
    `).join("");
  }
  function scoreSpeaking(){
    const checks = $$("#speakChecklist input").filter(x=>x.checked).length;
    const total = $$("#speakChecklist input").length;
    const fb=$("#speakFb");
    if(!fb.dataset.scored){
      addScore(0,1);
      fb.dataset.scored="1";
    }
    if(checks >= Math.max(3, total-1)){
      fb.className="feedback good";
      fb.textContent = `✅ Good speaking performance (${checks}/${total}). Keep structure + clear close.`;
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent = `⚠️ Improve (${checks}/${total}). Next time: add connectors + a stronger close.`;
    }
    renderReport();
  }

  // ---- Writing self-check
  function renderWriteChecklist(){
    const items = [
      { id:"purpose", label:"Purpose is clear (why you write)" },
      { id:"context", label:"Context / reason (neutral)" },
      { id:"action", label:"Action / solution / options" },
      { id:"request", label:"Request / next step" },
      { id:"polite", label:"Polite tone (could / would / please)" },
      { id:"closing", label:"Closing + signature" }
    ];
    $("#writeChecklist").innerHTML = items.map(it=>`
      <label class="ck">
        <input type="checkbox" data-wck="${it.id}" />
        <div>${it.label}</div>
      </label>
    `).join("");
  }

  function selfCheckWriting(){
    const text = ($("#draft").value||"").trim();
    const fb=$("#writeFb");
    if(!fb.dataset.scored){
      addScore(0,1);
      fb.dataset.scored="1";
    }
    const checks = {
      purpose: /(i'?m writing|regarding|update|follow-?up|request|confirm)/i.test(text),
      context: /(due to|because|delay|issue|confirmation|schedule)/i.test(text),
      action: /(we can|we could|offer|option|confirm|attach|send|provide|proceed)/i.test(text),
      request: /(could you|please|confirm|let me know|would you|can you)/i.test(text),
      polite: /(could|would|please|thank you|kind regards|best regards|i appreciate)/i.test(text),
      closing: /(best regards|kind regards|sincerely)/i.test(text)
    };
    $$("#writeChecklist input").forEach(cb=>cb.checked = !!checks[cb.dataset.wck]);
    const okCount = Object.values(checks).filter(Boolean).length;
    const lines = text ? text.split(/\n+/).map(x=>x.trim()).filter(Boolean).length : 0;
    const lineOk = (lines>=8 && lines<=12);
    if(okCount>=5 && lineOk){
      fb.className="feedback good";
      fb.textContent = `✅ Exam-ready. Checks: ${okCount}/6. Lines: ${lines} (good).`;
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent = `⚠️ Improve. Checks: ${okCount}/6. Lines: ${lines} (target 8–12).`;
    }
    renderReport();
  }

  // ---- Recording
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

  // ---- Render
  function escapeHtml(s){
    return String(s)
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  }

  function renderListening(){
    $("#t1").textContent = state.content.audio1;
    $("#t2").textContent = state.content.audio2;
    renderMCQ($("#listenQ1"), state.content.listenQ1);
    renderMCQ($("#listenQ2"), state.content.listenQ2);
    renderMCQ($("#listenPolite"), state.content.listenPolite);

    $("#digits1").value="";
    $("#digits1Fb").textContent="";
    $("#digits1Fb").className="feedback";
    $("#digits1Fb").dataset.scored="";
  }

  function renderEmails(){
    const box=$("#mailbox");
    box.innerHTML = "";
    state.content.mailbox.forEach(m=>{
      const el=document.createElement("div");
      el.className="mail";
      el.innerHTML = `
        <div class="mail__hdr">
          <div class="mail__subj">${m.subj}</div>
          <div class="mail__meta">${m.date}</div>
        </div>
        <div class="mail__meta">${m.from}</div>
        <div class="mail__body">${escapeHtml(m.body)}</div>
      `;
      box.appendChild(el);
    });

    renderMCQ($("#readQuiz"), state.content.readQuiz);

    const scrambled = state.content.orderStepsCorrect.slice().sort(()=>rand()-0.5);
    renderOrderTask(scrambled);
    $("#orderFb").textContent="";
    $("#orderFb").className="feedback";
    $("#orderFb").dataset.scored="";
  }

  function renderSpeaking(){
    $("#speakPrompt").textContent = pick(state.content.speakPrompts);
    $("#outline").value="";
    $("#outlineFb").textContent="";
    $("#outlineFb").className="feedback";
    $("#outlineFb").dataset.scored="";
    renderChips("#speakStarters", state.content.starters, "#outline", false);
    renderChips("#outlineChips", state.content.outlineChips, "#outline", true);
    renderSpeakChecklist(state.content.speakChecklist);
    $("#speakFb").textContent="";
    $("#speakFb").className="feedback";
    $("#speakFb").dataset.scored="";
    clearTimer("prep"); clearTimer("speak");
    $("#prepNum").textContent="15";
    $("#speakNum").textContent="75";
    clearRecording();
  }

  function renderWriting(){
    const task = pick(state.content.writeTasks);
    $("#writeTask").textContent = task.prompt;
    $("#model").textContent = (level()==="b2") ? task.modelB2 : task.modelB1;
    $("#model").hidden = true;

    const pb = $("#phraseBank");
    pb.innerHTML="";
    state.content.phrasesBase.forEach(p=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="chip";
      b.textContent=p;
      b.addEventListener("click", ()=>insertAtCursor($("#draft"), p + "\n"));
      pb.appendChild(b);
    });

    $("#draft").value="";
    $("#writeFb").textContent="";
    $("#writeFb").className="feedback";
    $("#writeFb").dataset.scored="";
    renderWriteChecklist();
    $("#upgradeOut").textContent="";
    clearTimer("write");
    $("#writeTimer").textContent="10:00";
  }

  function renderAll(){
    state.content = buildContent();
    renderListening();
    renderEmails();
    renderSpeaking();
    renderWriting();
    renderProgress();
    renderReport();
  }

  // ---- Digits check
  function checkDigits1(){
    const fb=$("#digits1Fb");
    if(!fb.dataset.scored){
      addScore(0,1);
      fb.dataset.scored="1";
    }
    const typed = ($("#digits1").value||"").replace(/\s+/g,"").trim();
    const ans = String(state.content.refDigits);
    if(typed === ans){
      fb.className="feedback good";
      fb.textContent="✅ Correct digits.";
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent="❌ Not correct. Tip: play digits slowly and type digits only.";
    }
    renderReport();
  }

  // ---- Save/Load
  function save(){
    const data = {
      accent: state.accent,
      tapMode: state.tapMode,
      score: state.score,
      sectionsDone: Array.from(state.sectionsDone),
      seed: state.seed,
      context: $("#context").value,
      level: $("#level").value,
      studentName: $("#studentName").value
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    alert("Saved.");
  }
  function load(){
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw){ alert("No saved data."); return; }
    try{
      const data = JSON.parse(raw);
      $("#context").value = data.context || $("#context").value;
      $("#level").value = data.level || $("#level").value;
      $("#studentName").value = data.studentName || "";
      state.accent = data.accent || "US";
      state.tapMode = (data.tapMode !== undefined) ? data.tapMode : true;
      state.score = data.score || {c:0,t:0};
      state.sectionsDone = new Set(data.sectionsDone || []);
      state.seed = data.seed || Math.floor(Math.random()*1e9);
      updateAccentButtons();
      updateTapButton();
      $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
      renderAll();
      state.sectionsDone.forEach(id=>{
        const cb = $(`#progressChecks input[data-prog="${id}"]`);
        if(cb) cb.checked=true;
      });
      updateProgress();
      alert("Loaded.");
    }catch(e){
      alert("Could not load saved data.");
    }
  }

  // ---- Report
  function renderReport(){
    const total=state.score.t;
    const correct=state.score.c;
    const pct= total ? Math.round((correct/total)*100) : 0;
    const done = Array.from(state.sectionsDone).join(", ") || "(none)";
    const c=C();
    const tts = state.accent==="UK" ? "British" : "American";

    const text = [
      "VTest Full Mock — Pack 4 Report",
      `Student: ${you()}`,
      `Level: ${($("#level").value||"").toUpperCase()} | Context: ${$("#context").value}`,
      `Company scenario: ${c.company} / ${c.dept}`,
      `TTS Accent used: ${tts}`,
      "",
      `Auto-check Score: ${correct}/${total} (${pct}%)`,
      `Sections completed: ${done}`,
      "",
      "Quick feedback targets:",
      "- Speaking: 4-line structure + connectors + clear close.",
      "- Writing: Purpose/Context/Action/Request + polite tone, 8–12 lines.",
      "- Listening: numbers + new schedule + next step.",
      "- Reading: deadlines + responsibilities + action order.",
      "",
      "Homework (15 minutes):",
      "1) Repeat one speaking prompt (record if possible).",
      "2) Write one email using phrase bank + self-check.",
      "3) Listen once (fast) + once (slow) and answer without transcript."
    ].join("\n");

    $("#reportPreview").textContent = text;
  }

  function updateAccentButtons(){
    $("#accentUS").setAttribute("aria-pressed", state.accent==="US" ? "true" : "false");
    $("#accentUK").setAttribute("aria-pressed", state.accent==="UK" ? "true" : "false");
  }
  function updateTapButton(){
    $("#tapMode").setAttribute("aria-pressed", state.tapMode ? "true" : "false");
    $("#tapMode").textContent = state.tapMode ? "On" : "Off";
  }

  function overviewChecklist(){
    return [
      "VTest Full Mock checklist",
      "- Listening: 2 plays max, answer quickly, numbers dictation.",
      "- Reading: scan for dates, responsibilities, next steps.",
      "- Speaking: Opinion → Example → Solution → Close (75s).",
      "- Writing: 8–12 lines, purpose/context/action/request/close.",
      "Polite tools: could / would / would you mind + -ing / by the end of the day."
    ].join("\n");
  }

  // ---- Full mock flow
  function startFullMockFlow(){
    document.location.hash = "#listen";
    startMMSS("listen", 6*60, $("#listenTimer"));

    setTimeout(()=>{
      document.location.hash = "#read";
      startMMSS("read", 6*60, $("#readTimer"));
    }, 6100);

    setTimeout(()=>{
      document.location.hash = "#speak";
      startCount("prep", 15, $("#prepNum"));
      setTimeout(()=>startCount("speak", 75, $("#speakNum")), 1600);
    }, 12*60*1000 + 6500);

    setTimeout(()=>{
      document.location.hash = "#write";
      startMMSS("write", 10*60, $("#writeTimer"));
    }, (12*60 + 95)*1000 + 7000);
  }

  // ---- Wire up
  function wire(){
    $("#accentUS").addEventListener("click", ()=>{ state.accent="US"; updateAccentButtons(); });
    $("#accentUK").addEventListener("click", ()=>{ state.accent="UK"; updateAccentButtons(); });

    $("#tapMode").addEventListener("click", ()=>{ state.tapMode=!state.tapMode; updateTapButton(); });

    $("#resetAll").addEventListener("click", ()=>{ stopSpeech(); location.reload(); });

    $("#markListen").addEventListener("click", ()=>markDone("listen"));
    $("#markRead").addEventListener("click", ()=>markDone("read"));
    $("#markSpeak").addEventListener("click", ()=>markDone("speak"));
    $("#markWrite").addEventListener("click", ()=>markDone("write"));

    $("#startListenTimer").addEventListener("click", ()=>startMMSS("listen", 6*60, $("#listenTimer")));
    $("#resetListenTimer").addEventListener("click", ()=>{ clearTimer("listen"); $("#listenTimer").textContent="06:00"; });
    $("#startReadTimer").addEventListener("click", ()=>startMMSS("read", 6*60, $("#readTimer")));
    $("#resetReadTimer").addEventListener("click", ()=>{ clearTimer("read"); $("#readTimer").textContent="06:00"; });
    $("#startWrite").addEventListener("click", ()=>startMMSS("write", 10*60, $("#writeTimer")));
    $("#resetWrite").addEventListener("click", ()=>{ clearTimer("write"); $("#writeTimer").textContent="10:00"; });

    $("#playAudio1").addEventListener("click", ()=>speak(state.content.audio1, 1.0));
    $("#playAudio1Slow").addEventListener("click", ()=>speak(state.content.audio1, 0.88));
    $("#playAudio2").addEventListener("click", ()=>speak(state.content.audio2, 1.0));
    $("#playAudio2Slow").addEventListener("click", ()=>speak(state.content.audio2, 0.88));

    $("#showT1").addEventListener("click", ()=>{ $("#t1").hidden = !$("#t1").hidden; });
    $("#showT2").addEventListener("click", ()=>{ $("#t2").hidden = !$("#t2").hidden; });

    $("#playDigits1").addEventListener("click", ()=>speakDigits(state.content.refDigits, 1.0));
    $("#playDigits1Slow").addEventListener("click", ()=>speakDigits(state.content.refDigits, 0.85));
    $("#checkDigits1").addEventListener("click", checkDigits1);

    $("#checkOrder").addEventListener("click", ()=>checkOrder(state.content.orderStepsCorrect));
    $("#resetOrder").addEventListener("click", ()=>{
      $("#orderFb").textContent=""; $("#orderFb").className="feedback"; $("#orderFb").dataset.scored="";
      const scrambled = state.content.orderStepsCorrect.slice().sort(()=>rand()-0.5);
      renderOrderTask(scrambled);
    });

    $("#copyEmails").addEventListener("click", async ()=>{
      const text = state.content.mailbox.map(m=>`${m.subj}\n${m.from}\n${m.date}\n${m.body}\n`).join("\n---\n");
      const ok = await copyToClipboard(text);
      alert(ok ? "Emails copied." : "Could not copy.");
    });

    $("#newSpeak").addEventListener("click", ()=>{ $("#speakPrompt").textContent = pick(state.content.speakPrompts); });
    $("#listenSpeakPrompt").addEventListener("click", ()=>speak($("#speakPrompt").textContent, 1.0));
    $("#copySpeakPrompt").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#speakPrompt").textContent);
      alert(ok ? "Prompt copied." : "Could not copy.");
    });

    $("#showStarters").addEventListener("click", ()=>{
      const box=$("#startersBox");
      const now = box.hidden;
      box.hidden = !now;
      $("#showStarters").setAttribute("aria-expanded", now ? "true" : "false");
      $("#showStarters").textContent = now ? "Hide starters" : "Show starters";
    });

    $("#startPrep").addEventListener("click", ()=>startCount("prep", 15, $("#prepNum")));
    $("#startSpeak").addEventListener("click", ()=>startCount("speak", 75, $("#speakNum")));
    $("#resetSpeakTimers").addEventListener("click", ()=>{
      clearTimer("prep"); clearTimer("speak");
      $("#prepNum").textContent="15"; $("#speakNum").textContent="75";
    });

    $("#clearOutline").addEventListener("click", ()=>{
      $("#outline").value="";
      $("#outlineFb").textContent=""; $("#outlineFb").className="feedback"; $("#outlineFb").dataset.scored="";
    });
    $("#checkOutline").addEventListener("click", outlineAutoCheck);
    $("#scoreSpeaking").addEventListener("click", scoreSpeaking);

    $("#recStart").addEventListener("click", startRecording);
    $("#recStop").addEventListener("click", stopRecording);
    $("#recClear").addEventListener("click", ()=>{ stopRecording(); clearRecording(); });

    $("#newWriteTask").addEventListener("click", renderWriting);
    $("#showModel").addEventListener("click", ()=>{ $("#model").hidden = !$("#model").hidden; });
    $("#listenModel").addEventListener("click", ()=>speak($("#model").textContent, 1.0));
    $("#clearDraft").addEventListener("click", ()=>{
      $("#draft").value="";
      $("#writeFb").textContent=""; $("#writeFb").className="feedback"; $("#writeFb").dataset.scored="";
      $$("#writeChecklist input").forEach(x=>x.checked=false);
    });
    $("#checkWriting").addEventListener("click", selfCheckWriting);

    $("#makeUpgrade").addEventListener("click", ()=>{
      const k=$("#upgradePick").value;
      $("#upgradeOut").textContent = state.content.upgrades[k] || "";
    });
    $("#insertUpgrade").addEventListener("click", ()=>{
      const t = ($("#upgradeOut").textContent||"").trim();
      if(!t) return;
      insertAtCursor($("#draft"), t + "\n");
    });

    $("#copyPhrases").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(state.content.phrasesBase.join("\n"));
      alert(ok ? "Phrases copied." : "Could not copy.");
    });

    $("#copyReport").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#reportPreview").textContent);
      alert(ok ? "Report copied." : "Could not copy.");
    });
    $("#printReport").addEventListener("click", ()=>window.print());

    $("#saveProgress").addEventListener("click", save);
    $("#loadProgress").addEventListener("click", load);

    $("#regenAll").addEventListener("click", ()=>{
      state.seed = Math.floor(Math.random()*1e9);
      state.score = {c:0,t:0};
      state.sectionsDone = new Set();
      $("#scoreTxt").textContent = "0 / 0";
      renderAll();
      document.location.hash="#top";
    });

    ["level","context"].forEach(id=>{
      $("#"+id).addEventListener("change", ()=>{
        state.seed = Math.floor(Math.random()*1e9);
        renderAll();
      });
    });

    $("#startFullMock").addEventListener("click", startFullMockFlow);

    $("#copyOverview").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(overviewChecklist());
      alert(ok ? "Checklist copied." : "Could not copy.");
    });
  }

  function init(){
    updateAccentButtons();
    updateTapButton();
    wire();
    renderAll();
    setInterval(renderReport, 1200);
  }

  init();
})();
