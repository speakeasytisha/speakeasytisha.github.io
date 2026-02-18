/* SpeakEasyTisha • English 360° Next Step Pack 2 */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const STORE_KEY = "english360_pack2_nextstep_v1";
  const state = {
    accent: "US",
    tapMode: true,
    score: { c:0, t:0 },
    sectionsDone: new Set(),
    timers: { listen:null, read:null, gram:null, write:null, prep:null, speak:null },
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
  function lvl(){ return $("#level").value; }

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

  // TTS
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
    if(!speechSupported()){ alert("Audio non supporté. Lis à voix haute."); return; }
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

  // timers
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

  // progress
  const progressItems = [
    { id:"listen", label:"Listening" },
    { id:"read", label:"Reading" },
    { id:"grammar", label:"Grammar" },
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

  // context
  const ctx = {
    general: { company:"NorthBridge Solutions", contact:"Taylor Morgan", dept:"Operations", project:"Process Update", phone:"+1 617 555 0148" },
    hospitality: { company:"Riverview Hotel", contact:"Ms. Taylor Morgan", dept:"Front Desk", project:"Group Booking", phone:"+44 20 7946 0812" },
    engineering: { company:"Helix Manufacturing", contact:"Taylor Morgan", dept:"Supplier Quality", project:"Shipment Delay", phone:"+1 312 555 0199" },
    admin: { company:"BrightLine Office", contact:"Taylor Morgan", dept:"Administration", project:"Access Request", phone:"+33 1 84 88 12 30" },
    sales: { company:"Arcadia Sales", contact:"Taylor Morgan", dept:"Customer Success", project:"Order Issue", phone:"+1 415 555 0137" },
    transport: { company:"MetroLink Tours", contact:"Taylor Morgan", dept:"Operations", project:"Itinerary Change", phone:"+44 161 555 0101" }
  };

  function buildContent(){
    const c = ctx[$("#context").value] || ctx.general;
    const L = lvl();
    const digits = (L==="a2") ? "120926" : (L==="b1" ? "250314" : "407915");
    const time1 = (L==="a2") ? "today before 5 p.m." : (L==="b1" ? "today before 5 p.m." : "by the end of the day");
    const slot = (L==="b2") ? "Thursday at 10:30 a.m." : "Thursday at 10:30";

    const audioA =
      `Hello, this is ${c.contact}. I'm calling about the ${c.project}. ` +
      `We noticed an issue this morning: the same charge appears twice on our invoice. ` +
      `Could you please check it and send a corrected invoice ${time1}? ` +
      `Also, please confirm the reference number: ${digits}. Thank you.`;

    const audioB =
      `Quick update for the team. The project meeting has moved to ${slot}. ` +
      `Please upload your slides by 9 a.m. on Thursday. ` +
      `If you cannot attend, email your updates to the team lead in advance.`;

    const listenQ = [
      { stem:"What is the main issue in Audio A?",
        options:["A cancelled booking", "A double charge on an invoice", "A lost passport"],
        answer: 1,
        explain:"They say the same charge appears twice on the invoice."
      },
      { stem:"What does the caller request?",
        options:["A discount", "A corrected invoice + a reference confirmation", "A meeting invitation"],
        answer: 1,
        explain:"They ask for a corrected invoice and the reference number."
      },
      { stem:"When do they need the answer?",
        options:[time1, "next month", "after the weekend"],
        answer: 0,
        explain:`They ask for it ${time1}.`
      }
    ];

    const listenQ2 = [
      { stem:"When is the meeting now?",
        options:[slot, "Wednesday at 10:30", "Friday at 9 a.m."],
        answer: 0,
        explain:`The meeting moved to ${slot}.`
      },
      { stem:"What must participants do before the meeting?",
        options:["Upload slides by 9 a.m. Thursday", "Print the agenda", "Call the client"],
        answer: 0,
        explain:"They must upload slides by 9 a.m. Thursday."
      }
    ];

    const listenPolite = [
      { stem:"Choose the most professional follow‑up line:",
        options:["Send it now.", "Could you please confirm your availability?", "You must answer today."],
        answer: 1,
        explain:"Polite request: Could you please…"
      }
    ];

    const domain = c.company.replace(/\s+/g,"").toLowerCase();
    const deadline = (L==="b2") ? "tomorrow at 2 p.m." : "tomorrow";
    const day = (L==="b2") ? "Thursday" : "Wednesday";

    const mailbox = [
      {
        subj:`Subject: Request to reschedule a call (${c.project})`,
        from:`From: ${c.contact} <taylor.morgan@client.com>`,
        date:`${day}, 09:05`,
        body:
`Hello,

Unfortunately, our internal review has been moved to Thursday morning, so I won’t be available at 10:00.
Would it be possible to reschedule to Friday afternoon? If not, I can join next week.

Many thanks,
${c.contact}`
      },
      {
        subj:`Re: Reschedule confirmed`,
        from:`From: ${you()} <${(you().replace(/\s+/g,".").toLowerCase()||"you")}@${domain}.com>`,
        date:`${day}, 10:00`,
        body:
`Hello ${c.contact},

Thank you for your message. I can confirm we can reschedule your call.
Would Friday at 3 p.m. work for you? If that doesn’t suit you, we can offer next Tuesday at 10 a.m.

Could you please confirm your preferred option by ${deadline}?

Best regards,
${you()}`
      },
      {
        subj:`Internal: action items`,
        from:`From: Team Lead <lead@${domain}.com>`,
        date:`${day}, 10:12`,
        body:
`Hi team,

Reminder:
1) Upload slides by 9 a.m. Thursday.
2) Send updates by email if you can’t attend.
3) Keep the client informed after the meeting.

Thanks,
Team Lead`
      }
    ];

    const readQuiz = [
      { stem:"Why is the client writing?",
        options:["To cancel permanently", "To reschedule a call", "To complain about price"],
        answer: 1,
        explain:"They ask to reschedule because they are not available."
      },
      { stem:"What is the preferred alternative time?",
        options:["Friday afternoon", "Thursday morning", "Saturday"],
        answer: 0,
        explain:"They request Friday afternoon."
      },
      { stem:"What is the deadline to confirm (in the reply)?",
        options:[deadline, "next month", "after the weekend"],
        answer: 0,
        explain:`The reply asks for confirmation by ${deadline}.`
      }
    ];

    const orderCorrect = [
      "Confirm a new time with the client.",
      "Send two concrete time options.",
      "Ask for confirmation with a deadline.",
      "Upload the slides by 9 a.m. Thursday.",
      "Follow up with the client after the meeting."
    ];

    const gramQuiz = [
      { stem:"Polite request (best option): _______ send the updated file by 4 p.m.?",
        options:["Can you", "Could you please", "You must"],
        answer: 1,
        explain:"“Could you please…” is polite and professional."
      },
      { stem:"Would you mind + V‑ing: Would you mind _______ (check) the invoice?",
        options:["to check", "checking", "check"],
        answer: 1,
        explain:"After “Would you mind”, use V‑ing: “checking”."
      },
      { stem:"Despite / Although: _______ the delay, we delivered on time.",
        options:["Although", "Despite", "Because"],
        answer: 1,
        explain:"“Despite” + noun: despite the delay."
      },
      { stem:"Since / for: We have worked together _______ 2021.",
        options:["since", "for", "during"],
        answer: 0,
        explain:"Since + a starting point (2021)."
      },
      { stem:"Narration: I _______ (work) when the system crashed.",
        options:["worked", "was working", "am working"],
        answer: 1,
        explain:"Background action: past continuous “was working”."
      },
      { stem:"Error spotting: “It depends of the supplier.”",
        options:["No error", "depends of → depends on", "supplier → supplier’s"],
        answer: 1,
        explain:"Correct collocation: depend on."
      }
    ];

    const fixPrompts = [
      { bad:"I am here since two years.", hint:"since/for + present perfect" },
      { bad:"I propose you to move the meeting.", hint:"suggest + correct pattern" },
      { bad:"I will call you later, I decided yesterday.", hint:"plan vs spontaneous: going to" },
      { bad:"Despite it is late, we continue.", hint:"despite + noun / although + clause" },
      { bad:"I am agree with you.", hint:"adjective: agree" },
    ];

    const starters = (L==="a2") ? [
      "In my view, …","First, …","Then, …","For example, …","Overall, …","Could you please…"
    ] : (L==="b1") ? [
      "In my view, …","The key point is …","For example, …","However, …","As a result, …","Overall, …","Could you please…","Would you mind + V‑ing…"
    ] : [
      "In my view, …","From the client’s perspective, …","The key point is …","Having said that, …","Therefore, …","As a result, …","Overall, …","Would you mind + V‑ing…"
    ];

    const outlineChips = [
      "1) Context: The situation is…",
      "2) Action: I will / I would…",
      "3) Options: We can… / Alternatively…",
      "4) Close: Could you please confirm…",
      "Connector: however",
      "Connector: therefore",
      "Polite: could you please…",
      "Polite: would you mind + V‑ing…"
    ];

    const speakPrompts = [
      "A client is unhappy about a delay. Apologise, ask 2 questions, propose 2 solutions, and confirm the next step.",
      "You need to reschedule a meeting. Explain why, propose two options, and ask for confirmation politely.",
      "The system is down at work. Describe what happened, what you did, and the result (1 minute).",
      "Summarise a short meeting: decisions, responsibilities, and deadlines."
    ];

    const speakChecklist = [
      "I used a clear structure (context → action → options → close).",
      "I used at least 2 connectors (however / therefore / as a result).",
      "I used polite language (could / would / would you mind).",
      "I included 2 concrete details (date/time/impact/solution).",
      "I finished with a clear next step."
    ];

    const writeTasks = [
      { prompt:`Write an email to ${c.contact}: confirm rescheduling, propose 2 time options, ask for confirmation by ${deadline}. (8–12 lignes)`,
        model:
`Subject: Rescheduling our call

Hello ${c.contact},

Thank you for your message. I can confirm we can reschedule our call.
Would Friday at 3 p.m. work for you? If that doesn’t suit you, we can offer next Tuesday at 10 a.m.
Could you please confirm your preferred option by ${deadline}?

Best regards,
${you()}`
      },
      { prompt:`Reply to a client complaint: double charge on an invoice. Apologise, explain what you will do, and promise a timeline (${time1}).`,
        model:
`Subject: Invoice update

Hello ${c.contact},

Thank you for your message, and I’m sorry for the inconvenience.
I will check the invoice immediately and remove the duplicate charge.
I will send you a corrected invoice and the refund reference ${time1}.
Could you please confirm the booking details so I can process it quickly?

Kind regards,
${you()}`
      },
      { prompt:`Write an internal update to your team: meeting moved to ${slot}; slides due 9 a.m.; updates by email if absent.`,
        model:
`Subject: Project meeting — updated schedule

Hi team,

Quick reminder: the project meeting has moved to ${slot}.
Please upload your slides by 9 a.m. on Thursday.
If you can’t attend, email your updates to the team lead in advance.

Thanks,
${you()}`
      }
    ];

    const phraseBank = [
      "Thank you for your message.",
      "I’m sorry for the inconvenience.",
      "I can confirm the new schedule.",
      "Would Friday at 3 p.m. work for you?",
      "If that doesn’t suit you, we can offer an alternative option.",
      "Could you please confirm your preferred option?",
      "Would you mind checking this and getting back to me?",
      "I’ll follow up by the end of the day.",
      "Best regards,"
    ];

    const upgrades = (L==="b2") ? {
      purpose: "I’m writing regarding the latest update and next steps.",
      apology: "Please accept my apologies for the inconvenience caused.",
      reason: "Due to an internal scheduling change, we need to adjust the timing.",
      options: "We can proceed on Friday at 3 p.m.; alternatively, we can schedule next Tuesday at 10 a.m.",
      request: "Could you please confirm your preferred option so we can proceed?",
      deadline: "If I don’t hear back by tomorrow at 2 p.m., I will follow up by the end of the day."
    } : {
      purpose: "I’m writing to confirm the update.",
      apology: "I’m sorry for the inconvenience.",
      reason: "Because of a schedule change, we need to move the meeting.",
      options: "We can do Friday at 3, or next Tuesday at 10.",
      request: "Could you please confirm your option?",
      deadline: "Please reply by tomorrow. I’ll follow up by the end of the day."
    };

    return { ctx:c, digits, audioA, audioB, listenQ, listenQ2, listenPolite, mailbox, readQuiz, orderCorrect, gramQuiz, fixPrompts, starters, outlineChips, speakPrompts, speakChecklist, writeTasks, phraseBank, upgrades, meta:{deadline,slot,time1} };
  }

  // quiz engine
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
        b.type="button"; b.className="choice"; b.textContent=lab; b.setAttribute("aria-pressed","false");
        b.addEventListener("click", ()=>{
          if(answered.has(qi)) return;
          answered.add(qi);
          b.setAttribute("aria-pressed","true");
          const ok = (oi===q.answer);
          if(ok){
            b.classList.add("is-correct"); exp.hidden=false; exp.textContent = `✅ ${q.explain}`;
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

  // reading order task
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
    }, { passive:true });
  }
  function currentOrder(){
    return $$("#orderBox .orderItem").map(x=>$(".orderTxt",x).textContent.trim());
  }
  function checkOrder(correct){
    const now = currentOrder();
    const fb=$("#orderFb");
    if(!fb.dataset.scored){
      addScore(0,1); fb.dataset.scored="1";
    }
    const ok = now.join("||") === correct.join("||");
    if(ok){
      fb.className="feedback good"; fb.textContent="✅ Correct order. Très pro."; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent="❌ Pas encore. Astuce: confirmer → proposer options → deadline → slides → follow‑up.";
    }
    renderReport();
  }

  // chips insertion
  function insertAtCursor(textarea, text){
    textarea.focus();
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const v = textarea.value;
    textarea.value = v.slice(0,start) + text + v.slice(end);
    const pos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
  }
  function renderChips(boxSel, items, targetSel, addNewline=false){
    const box=$(boxSel); box.innerHTML="";
    items.forEach(t=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=t;
      b.addEventListener("click", ()=>insertAtCursor($(targetSel), t + (addNewline ? "\n" : " ")));
      box.appendChild(b);
    });
  }

  // speaking outline check
  function outlineAutoCheck(){
    const text = ($("#outline").value||"").trim();
    const fb=$("#outlineFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    const hasContext = /(situation|context|there is|there was|the issue)/i.test(text);
    const hasAction = /(i will|i would|i decided|i contacted|i called|i sent)/i.test(text);
    const hasOptions = /(we can|we could|alternatively|option|suggest)/i.test(text);
    const hasClose = /(could you|please|confirm|next step|overall|in summary)/i.test(text);
    const count = [hasContext,hasAction,hasOptions,hasClose].filter(Boolean).length;
    if(count>=3){
      fb.className="feedback good"; fb.textContent=`✅ Bon plan (${count}/4). Maintenant parle à partir de tes lignes.`; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent=`⚠️ Ajoute des éléments. Objectif: 4/4 (context + action + options + close).`;
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
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    if(checks >= Math.max(3, total-1)){
      fb.className="feedback good"; fb.textContent = `✅ Bon niveau (${checks}/${total}). Continue: détails + close clair.`; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent = `⚠️ À renforcer (${checks}/${total}). Ajoute connecteurs + 2 détails concrets.`;
    }
    renderReport();
  }

  // writing self-check
  function renderWriteChecklist(){
    const items = [
      { id:"subject", label:"Subject clair" },
      { id:"opening", label:"Opening (Hello / Hi) + merci" },
      { id:"purpose", label:"Purpose (why you write)" },
      { id:"details", label:"2 détails concrets (date/heure / référence)" },
      { id:"request", label:"Request / next step (question)" },
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
  function countLines(text){
    return text ? text.split(/\n+/).map(x=>x.trim()).filter(Boolean).length : 0;
  }
  function selfCheckWriting(){
    const text = ($("#draft").value||"").trim();
    const fb=$("#writeFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    const checks = {
      subject: /subject:/i.test(text),
      opening: /(hello|hi|dear)/i.test(text),
      purpose: /(i'?m writing|regarding|to confirm|to reschedule|to apologise|to update)/i.test(text),
      details: /(\d{1,2}:\d{2}|\d{1,2}\s?(a\.m\.|p\.m\.)|\bthursday\b|\bfriday\b|\breference\b|\b\d{4,}\b)/i.test(text),
      request: /(could you|please|confirm|let me know|would you|can you)/i.test(text),
      polite: /(could|would|please|thank you|kind regards|best regards|apologies)/i.test(text),
      closing: /(best regards|kind regards|sincerely)/i.test(text)
    };
    $$("#writeChecklist input").forEach(cb=>cb.checked = !!checks[cb.dataset.wck]);
    const okCount = Object.values(checks).filter(Boolean).length;
    const lines = countLines(text);
    const lineOk = (lines>=8 && lines<=12);
    if(okCount>=6 && lineOk){
      fb.className="feedback good"; fb.textContent = `✅ Exam-ready. Checks: ${okCount}/7. Lines: ${lines} (OK).`; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent = `⚠️ Improve. Checks: ${okCount}/7. Lines: ${lines} (target 8–12).`;
    }
    renderReport();
  }

  // recording
  async function startRecording(){
    const btnStart=$("#recStart"), btnStop=$("#recStop");
    const audio=$("#recAudio"), dl=$("#recDownload");
    try{
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || (typeof MediaRecorder==="undefined")){
        alert("Recording non supporté ici. Tu peux quand même t'entraîner.");
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
      alert("Micro bloqué ou indisponible.");
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

  // render
  function escapeHtml(s){
    return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  }
  function renderListening(){
    $("#tA").textContent = state.content.audioA;
    $("#tB").textContent = state.content.audioB;
    renderMCQ($("#listenQ"), state.content.listenQ);
    renderMCQ($("#listenQ2"), state.content.listenQ2);
    renderMCQ($("#listenPolite"), state.content.listenPolite);
    $("#digitsIn").value="";
    $("#digitsFb").textContent="";
    $("#digitsFb").className="feedback";
    $("#digitsFb").dataset.scored="";
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
    const scrambled = state.content.orderCorrect.slice().sort(()=>rand()-0.5);
    renderOrderTask(scrambled);
    $("#orderFb").textContent="";
    $("#orderFb").className="feedback";
    $("#orderFb").dataset.scored="";
  }
  function renderGrammar(){
    renderMCQ($("#gramQuiz"), state.content.gramQuiz);
    $("#fixInput").value="";
    $("#fixFb").textContent="";
    $("#fixFb").className="feedback";
    $("#fixFb").dataset.scored="";
    newFixPrompt();
  }
  function renderSpeaking(){
    $("#speakPrompt").textContent = pick(state.content.speakPrompts);
    $("#outline").value="";
    $("#outlineFb").textContent="";
    $("#outlineFb").className="feedback";
    $("#outlineFb").dataset.scored="";
    renderChips("#startersChips", state.content.starters, "#outline", false);
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
    $("#model").textContent = task.model;
    $("#model").hidden = true;
    const pb = $("#phraseBank");
    pb.innerHTML="";
    state.content.phraseBank.forEach(p=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=p;
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
    renderGrammar();
    renderSpeaking();
    renderWriting();
    renderProgress();
    renderReport();
  }

  // digits
  function checkDigits(){
    const fb=$("#digitsFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    const typed = ($("#digitsIn").value||"").replace(/\s+/g,"").trim();
    const ans = String(state.content.digits);
    if(typed === ans){
      fb.className="feedback good"; fb.textContent="✅ Correct."; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent="❌ Not correct. Rejoue en slow + tape digits only.";
    }
    renderReport();
  }

  // fix the sentence
  let currentFix = null;
  function newFixPrompt(){
    currentFix = pick(state.content.fixPrompts);
    $("#fixPrompt").textContent = `❌ ${currentFix.bad}\nTip: ${currentFix.hint}`;
    $("#fixInput").value="";
    $("#fixFb").textContent="";
    $("#fixFb").className="feedback";
    $("#fixFb").dataset.scored="";
  }
  function checkFix(){
    const txt = ($("#fixInput").value||"").trim();
    const fb=$("#fixFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    if(!txt){
      fb.className="feedback bad"; fb.textContent="⚠️ Write a corrected sentence first."; return;
    }
    const goodSignals = [/depend on/i,/have been/i,/since|for/i,/suggest/i,/going to/i,/although|despite/i,/\bagree\b/i];
    const hits = goodSignals.filter(rx=>rx.test(txt)).length;
    if(hits>=1){
      fb.className="feedback good"; fb.textContent="✅ Good correction (looks natural). If possible, add 1 detail (time/deadline)."; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent="⚠️ Not sure. Try using the hint (since/for, suggest, going to, although/despite…).";
    }
    renderReport();
  }

  // save/load
  function save(){
    const data = {
      accent: state.accent, tapMode: state.tapMode, score: state.score,
      sectionsDone: Array.from(state.sectionsDone), seed: state.seed,
      context: $("#context").value, level: $("#level").value, studentName: $("#studentName").value
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    alert("Enregistré.");
  }
  function load(){
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw){ alert("Aucune sauvegarde."); return; }
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
      updateAccentButtons(); updateTapButton();
      $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
      renderAll();
      state.sectionsDone.forEach(id=>{
        const cb = $(`#progressChecks input[data-prog="${id}"]`);
        if(cb) cb.checked=true;
      });
      updateProgress();
      alert("Chargé.");
    }catch(e){ alert("Impossible de charger."); }
  }

  // report
  function renderReport(){
    const total=state.score.t;
    const correct=state.score.c;
    const pct= total ? Math.round((correct/total)*100) : 0;
    const done = Array.from(state.sectionsDone).join(", ") || "(none)";
    const c = state.content?.ctx || ctx.general;
    const tts = state.accent==="UK" ? "UK" : "US";
    const text = [
      "English 360° — Next Step (Pack 2) — Report",
      `Student: ${you()}`,
      `Level: ${($("#level").value||"").toUpperCase()} | Context: ${$("#context").value}`,
      `Scenario: ${c.company} / ${c.dept} / ${c.project}`,
      `TTS Accent: ${tts}`,
      "",
      `Auto-check Score: ${correct}/${total} (${pct}%)`,
      `Sections completed: ${done}`,
      "",
      "Targets (next session):",
      "- Speaking: structure 4 lignes + 2 connecteurs + close clair.",
      "- Writing: Subject + purpose + 2 détails + question + polite closing.",
      "- Listening: chiffres + deadline + action.",
      "- Grammar: would you mind + V-ing / despite vs although / since vs for.",
      "",
      "Mini homework (10–15 min):",
      "1) 1 speaking prompt (record if possible).",
      "2) 1 email (8–12 lines) + self-check.",
      "3) 1 listening audio (2 plays max) + digits."
    ].join("\n");
    $("#reportPreview").textContent = text;
  }

  // start buttons
  function updateAccentButtons(){
    $("#accentUS").setAttribute("aria-pressed", state.accent==="US" ? "true" : "false");
    $("#accentUK").setAttribute("aria-pressed", state.accent==="UK" ? "true" : "false");
  }
  function updateTapButton(){
    $("#tapMode").setAttribute("aria-pressed", state.tapMode ? "true" : "false");
    $("#tapMode").textContent = state.tapMode ? "On" : "Off";
  }

  function checklistText(){
    return [
      "English 360° mock checklist",
      "- Listening: 2 plays max, focus on numbers/deadlines/requests.",
      "- Reading: scan Subject, deadlines, responsibilities, next steps.",
      "- Grammar: polite requests, connectors, since/for, narration.",
      "- Speaking: 4 lines (context→action→options→close).",
      "- Writing: Subject + purpose + 2 details + question + closing."
    ].join("\n");
  }

  // flow
  function startMockFlow(){
    document.location.hash="#listen";
    startMMSS("listen", 6*60, $("#listenTimer"));
    setTimeout(()=>{ document.location.hash="#read"; startMMSS("read", 6*60, $("#readTimer")); }, 6200);
    setTimeout(()=>{ document.location.hash="#grammar"; startMMSS("gram", 6*60, $("#gramTimer")); }, 12*60*1000 + 7000);
    setTimeout(()=>{
      document.location.hash="#speak";
      startCount("prep", 15, $("#prepNum"));
      setTimeout(()=>startCount("speak", 75, $("#speakNum")), 1600);
    }, (18*60)*1000 + 7500);
    setTimeout(()=>{ document.location.hash="#write"; startMMSS("write", 10*60, $("#writeTimer")); }, (18*60 + 95)*1000 + 8200);
  }

  // wire
  function wire(){
    $("#accentUS").addEventListener("click", ()=>{ state.accent="US"; updateAccentButtons(); });
    $("#accentUK").addEventListener("click", ()=>{ state.accent="UK"; updateAccentButtons(); });
    $("#tapMode").addEventListener("click", ()=>{ state.tapMode=!state.tapMode; updateTapButton(); });
    $("#resetAll").addEventListener("click", ()=>{ stopSpeech(); location.reload(); });

    $("#markListen").addEventListener("click", ()=>markDone("listen"));
    $("#markRead").addEventListener("click", ()=>markDone("read"));
    $("#markGrammar").addEventListener("click", ()=>markDone("grammar"));
    $("#markSpeak").addEventListener("click", ()=>markDone("speak"));
    $("#markWrite").addEventListener("click", ()=>markDone("write"));

    $("#startListenTimer").addEventListener("click", ()=>startMMSS("listen", 6*60, $("#listenTimer")));
    $("#resetListenTimer").addEventListener("click", ()=>{ clearTimer("listen"); $("#listenTimer").textContent="06:00"; });
    $("#startReadTimer").addEventListener("click", ()=>startMMSS("read", 6*60, $("#readTimer")));
    $("#resetReadTimer").addEventListener("click", ()=>{ clearTimer("read"); $("#readTimer").textContent="06:00"; });
    $("#startGramTimer").addEventListener("click", ()=>startMMSS("gram", 6*60, $("#gramTimer")));
    $("#resetGramTimer").addEventListener("click", ()=>{ clearTimer("gram"); $("#gramTimer").textContent="06:00"; });
    $("#startWriteTimer").addEventListener("click", ()=>startMMSS("write", 10*60, $("#writeTimer")));
    $("#resetWriteTimer").addEventListener("click", ()=>{ clearTimer("write"); $("#writeTimer").textContent="10:00"; });

    // Listening
    $("#playA").addEventListener("click", ()=>speak(state.content.audioA, 1.0));
    $("#playASlow").addEventListener("click", ()=>speak(state.content.audioA, 0.88));
    $("#playB").addEventListener("click", ()=>speak(state.content.audioB, 1.0));
    $("#playBSlow").addEventListener("click", ()=>speak(state.content.audioB, 0.88));
    $("#toggleTA").addEventListener("click", ()=>{ $("#tA").hidden = !$("#tA").hidden; });
    $("#toggleTB").addEventListener("click", ()=>{ $("#tB").hidden = !$("#tB").hidden; });
    $("#playDigits").addEventListener("click", ()=>speakDigits(state.content.digits, 1.0));
    $("#playDigitsSlow").addEventListener("click", ()=>speakDigits(state.content.digits, 0.85));
    $("#checkDigits").addEventListener("click", checkDigits);

    // Reading
    $("#checkOrder").addEventListener("click", ()=>checkOrder(state.content.orderCorrect));
    $("#resetOrder").addEventListener("click", ()=>{
      $("#orderFb").textContent=""; $("#orderFb").className="feedback"; $("#orderFb").dataset.scored="";
      const scrambled = state.content.orderCorrect.slice().sort(()=>rand()-0.5);
      renderOrderTask(scrambled);
    });
    $("#copyEmails").addEventListener("click", async ()=>{
      const text = state.content.mailbox.map(m=>`${m.subj}\n${m.from}\n${m.date}\n${m.body}\n`).join("\n---\n");
      const ok = await copyToClipboard(text);
      alert(ok ? "Copié." : "Impossible de copier.");
    });

    // Grammar
    $("#newFix").addEventListener("click", newFixPrompt);
    $("#checkFix").addEventListener("click", checkFix);
    $("#resetGramScore").addEventListener("click", renderGrammar);

    // Speaking
    $("#newSpeak").addEventListener("click", ()=>{ $("#speakPrompt").textContent = pick(state.content.speakPrompts); });
    $("#listenPrompt").addEventListener("click", ()=>speak($("#speakPrompt").textContent, 1.0));
    $("#copySpeak").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#speakPrompt").textContent);
      alert(ok ? "Copié." : "Impossible de copier.");
    });
    $("#toggleStarters").addEventListener("click", ()=>{
      const box=$("#startersBox");
      const now = box.hidden;
      box.hidden = !now;
      $("#toggleStarters").setAttribute("aria-expanded", now ? "true" : "false");
      $("#toggleStarters").textContent = now ? "Hide starters" : "Starters";
    });
    $("#startPrep").addEventListener("click", ()=>startCount("prep", 15, $("#prepNum")));
    $("#startSpeak").addEventListener("click", ()=>startCount("speak", 75, $("#speakNum")));
    $("#resetSpeak").addEventListener("click", ()=>{
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

    // Writing
    $("#newWrite").addEventListener("click", renderWriting);
    $("#toggleModel").addEventListener("click", ()=>{ $("#model").hidden = !$("#model").hidden; });
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
      const ok = await copyToClipboard(state.content.phraseBank.join("\n"));
      alert(ok ? "Phrases copiées." : "Impossible de copier.");
    });

    // Report
    $("#copyReport").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#reportPreview").textContent);
      alert(ok ? "Rapport copié." : "Impossible de copier.");
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
        state.score = {c:0,t:0};
        $("#scoreTxt").textContent="0 / 0";
        state.sectionsDone = new Set();
        renderAll();
      });
    });

    $("#startMock").addEventListener("click", startMockFlow);
    $("#copyChecklist").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(checklistText());
      alert(ok ? "Checklist copiée." : "Impossible de copier.");
    });
  }

  function init(){
    updateAccentButtons();
    updateTapButton();
    wire();
    renderAll();
    setInterval(renderReport, 1400);
  }
  init();
})();