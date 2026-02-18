/* SpeakEasyTisha • English 360° Speaking & Writing Clinic (Pack 3 • A2→B2) */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const STORE_KEY = "english360_pack3_speakwrit_v1";

  const state = {
    accent: "US",
    tapMode: true,
    score: { c:0, t:0 },
    seed: Math.floor(Math.random()*1e9),
    sectionsDone: new Set(),
    timers: { write:null, prep:null, speak:null },
    recorder: { rec:null, stream:null, chunks:[], url:"" },
    current: { speak:null, write:null, drills:null, mistakes:null, rewrite:null }
  };

  const cfg = {
    speak: {
      a2: { prep: 15, speak: 60 },
      b1: { prep: 15, speak: 75 },
      b2: { prep: 20, speak: 90 }
    }
  };

  function rand(){
    const x = Math.sin(state.seed++) * 10000;
    return x - Math.floor(x);
  }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }
  function shuffle(arr){
    const a=arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(rand()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function lvl(){ return $("#level").value; }
  function ctxKey(){ return $("#context").value; }
  function you(){
    const n = ($("#studentName").value || "").trim();
    return n ? n : "you";
  }
  function addScore(correctDelta, totalDelta){
    state.score.c += correctDelta;
    state.score.t += totalDelta;
    state.score.c = clamp(state.score.c, 0, 99999);
    state.score.t = clamp(state.score.t, 0, 99999);
    $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
  }
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
  if(speechSupported()){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => loadVoices();
  }

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

  const progressItems = [
    { id:"speak", label:"Speaking" },
    { id:"write", label:"Writing" },
    { id:"drills", label:"Drills" },
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
    state.sectionsDone.forEach(id=>{
      const cb=$(`#progressChecks input[data-prog="${id}"]`); if(cb) cb.checked=true;
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

  const contexts = {
    general: { company:"NorthBridge Solutions", contact:"Taylor Morgan", dept:"Operations", phone:"+1 617 555 0148" },
    hospitality: { company:"Riverview Hotel", contact:"Ms. Taylor Morgan", dept:"Front Desk", phone:"+44 20 7946 0812" },
    engineering: { company:"Helix Manufacturing", contact:"Taylor Morgan", dept:"Supplier Quality", phone:"+1 312 555 0199" },
    admin: { company:"BrightLine Office", contact:"Taylor Morgan", dept:"Administration", phone:"+33 1 84 88 12 30" },
    sales: { company:"Arcadia Sales", contact:"Taylor Morgan", dept:"Customer Success", phone:"+1 415 555 0137" },
    transport: { company:"MetroLink Tours", contact:"Taylor Morgan", dept:"Operations", phone:"+44 161 555 0101" }
  };

  function metaByLevel(){
    const L = lvl();
    return {
      deadline: (L==="b2") ? "by the end of the day" : "today before 5 p.m.",
      when: (L==="a2") ? "tomorrow" : ((L==="b1") ? "tomorrow morning" : "tomorrow at 10:30 a.m."),
      ref: (L==="a2") ? "120926" : (L==="b1" ? "250314" : "407915")
    };
  }

  const speakScenarios = [
    { key:"delay", title:"Delay / Late delivery",
      a2:"A client is unhappy about a delay. Apologise. Explain the reason (1). Give 2 solutions. Ask one polite question.",
      b1:"A client is unhappy about a delay. Apologise, explain briefly, propose 2 solutions, and confirm the next step.",
      b2:"A client complains about a delay and wants a clear timeline. Apologise, clarify impact, propose 2 options, and close with a deadline + confirmation request." },
    { key:"reschedule", title:"Reschedule",
      a2:"You need to change a meeting. Say why. Propose 2 times. Ask for confirmation politely.",
      b1:"Reschedule a meeting: explain why, propose 2 options, and ask for confirmation by a deadline.",
      b2:"Reschedule a client call: explain constraint, propose 2 precise options, keep a polite tone, and secure confirmation by a deadline." },
    { key:"invoice", title:"Invoice / double charge",
      a2:"A client says there is a double charge. Say sorry. Say what you will do. Give a time.",
      b1:"Invoice issue: apologise, explain the action you will take, and give a timeline + reference.",
      b2:"Invoice issue: acknowledge, apologise, confirm investigation steps, give timeline, and request 1 missing detail to proceed." },
    { key:"internal_update", title:"Internal update",
      a2:"Tell your team: meeting time changed. Slides needed. If someone can't come, email updates.",
      b1:"Give your team an update: new meeting time, slides deadline, and what to do if absent.",
      b2:"Internal update: explain change, assign responsibilities, and confirm deadlines clearly." },
    { key:"customer_problem", title:"Customer problem (service)",
      a2:"A customer has a problem. Ask 2 questions. Give 1 solution. Be polite.",
      b1:"Handle a customer problem: ask clarifying questions, propose options, and close politely.",
      b2:"Handle a customer escalation: clarify, de-escalate, propose options, and confirm next steps with timeline." }
  ];

  function buildSpeakPrompt(){
    const c = contexts[ctxKey()] || contexts.general;
    const m = metaByLevel();
    const scen = pick(speakScenarios);
    const L = lvl();
    const instructions = (L==="a2") ? scen.a2 : (L==="b1" ? scen.b1 : scen.b2);

    const header = `Scenario: ${c.company} • ${c.dept}\nContact: ${c.contact} • Ref: ${m.ref}\nDeadline: ${m.deadline}`;
    const body = `Task (${L.toUpperCase()}): ${instructions}`;
    const requirements = (L==="a2")
      ? "Must include: 1 apology • 1 reason • 1 time • 1 question"
      : (L==="b1")
        ? "Must include: apology • 2 solutions • 2 connectors (however/therefore) • close"
        : "Must include: apology • impact • 2 options • 1 deadline • polite close + confirmation request";

    return { scen, text: `${header}\n\n${body}\n\n${requirements}` };
  }

  function speakChipsByLevel(){
    const L = lvl();
    const base = [
      "Context: The situation is…","Action: I will / I would…","Options: We can… / Alternatively…","Close: Could you please confirm…",
      "Polite: could you please…","Polite: would you mind + V‑ing…","Connector: however,","Connector: therefore,",
      "Time: by the end of the day","Detail: reference number is …"
    ];
    if(L==="a2"){
      return ["I’m sorry.","The problem is…","I will check it.","We can…","Tomorrow / today","Could you please confirm?","Thank you.","Best regards,"].concat(base.slice(0,4));
    }
    if(L==="b1") return base;
    return base.concat(["From the client’s perspective, …","To avoid any further delay, …","As a result, …","Please accept my apologies for…"]);
  }

  const rubricItems = [
    { id:"structure", label:"Structure (context → action → options → close)" },
    { id:"clarity", label:"Clarity (easy to follow)" },
    { id:"grammar", label:"Grammar (few mistakes)" },
    { id:"vocab", label:"Vocabulary (professional words)" },
    { id:"polite", label:"Polite tone (could / would / please)" }
  ];
  function renderRubric(){
    const box=$("#speakRubric");
    box.innerHTML="";
    rubricItems.forEach(it=>{
      const row=document.createElement("div");
      row.className="rubRow";
      row.innerHTML = `
        <div><strong>${it.label}</strong><div class="muted small">0–2 points</div></div>
        <div class="rubBtns" data-rub="${it.id}">
          <button type="button" class="rubBtn" data-v="0" aria-pressed="true">0</button>
          <button type="button" class="rubBtn" data-v="1" aria-pressed="false">1</button>
          <button type="button" class="rubBtn" data-v="2" aria-pressed="false">2</button>
        </div>`;
      box.appendChild(row);
    });
    box.addEventListener("click", (e)=>{
      const btn=e.target.closest(".rubBtn"); if(!btn) return;
      const group=e.target.closest(".rubBtns"); if(!group) return;
      $$(".rubBtn", group).forEach(b=>b.setAttribute("aria-pressed","false"));
      btn.setAttribute("aria-pressed","true");
      renderReport();
    }, { passive:true });
  }
  function rubricScore(){
    let total=0;
    rubricItems.forEach(it=>{
      const grp = $(`.rubBtns[data-rub="${it.id}"]`);
      const sel = $(`.rubBtn[aria-pressed="true"]`, grp);
      total += Number(sel?.dataset?.v || 0);
    });
    return { total, max: rubricItems.length*2 };
  }

  function buildWriteTask(){
    const c = contexts[ctxKey()] || contexts.general;
    const m = metaByLevel();
    const L = lvl();

    const tasks = [
      { key:"reschedule",
        prompt:`Write an email to ${c.contact}: reschedule a call. Propose 2 options. Ask for confirmation by ${m.deadline}. (8–12 lines)`,
        models:{
          a2:`Subject: Reschedule our call\n\nHello ${c.contact},\n\nSorry, I can’t join the call at the planned time.\nCan we move it to ${m.when}?\nIf not, we can do Friday at 3 p.m.\nCould you please confirm?\n\nBest regards,\n${you()}`,
          b1:`Subject: Rescheduling our call\n\nHello ${c.contact},\n\nThank you for your message. Unfortunately, I won’t be available at the planned time.\nCould we reschedule to ${m.when}? If that doesn’t suit you, we can offer Friday at 3 p.m.\nCould you please confirm your preferred option by ${m.deadline}?\n\nBest regards,\n${you()}`,
          b2:`Subject: Rescheduling our call — proposed options\n\nHello ${c.contact},\n\nThank you for your message. Due to a scheduling change, I won’t be available at the planned time.\nWould ${m.when} work for you? Alternatively, I can offer Friday at 3 p.m.\nCould you please confirm your preferred option by ${m.deadline}, so we can secure the slot?\n\nKind regards,\n${you()}` } },
      { key:"invoice",
        prompt:`Reply to a client: there is a double charge on an invoice. Apologise, explain what you will do, and promise a timeline (${m.deadline}).`,
        models:{
          a2:`Subject: Invoice issue\n\nHello ${c.contact},\n\nI’m sorry for the problem.\nI will check the invoice and remove the double charge.\nI will send a new invoice ${m.deadline}. The reference is ${m.ref}.\nCould you please confirm the invoice number?\n\nBest regards,\n${you()}`,
          b1:`Subject: Invoice update (double charge)\n\nHello ${c.contact},\n\nThank you for your message, and I’m sorry for the inconvenience.\nI will check the invoice today and correct the double charge.\nI will send you an updated invoice ${m.deadline}. Reference: ${m.ref}.\nCould you please confirm the invoice number so I can proceed quickly?\n\nBest regards,\n${you()}`,
          b2:`Subject: Invoice correction — double charge\n\nHello ${c.contact},\n\nThank you for your message, and please accept my apologies for the inconvenience caused.\nI am reviewing the invoice now and will remove the duplicate charge. I will send you a corrected invoice ${m.deadline}.\nTo proceed, could you please confirm the invoice number and the billed amount? Reference: ${m.ref}.\n\nKind regards,\n${you()}` } },
      { key:"internal",
        prompt:`Write an internal email to your team: meeting time changed, slides deadline, and what to do if someone can't attend.`,
        models:{
          a2:`Subject: Meeting update\n\nHi team,\n\nThe meeting time changed to ${m.when}.\nPlease send your slides before the meeting.\nIf you can’t attend, email your updates.\n\nThanks,\n${you()}`,
          b1:`Subject: Project meeting — updated schedule\n\nHi team,\n\nQuick update: the meeting has moved to ${m.when}.\nPlease upload your slides by 9 a.m. on the meeting day.\nIf you can’t attend, email your updates in advance.\n\nThanks,\n${you()}`,
          b2:`Subject: Project meeting — schedule change & action items\n\nHi team,\n\nPlease note the meeting has moved to ${m.when}.\nAction items: upload slides by 9 a.m. on the meeting day, and email your updates in advance if you can’t attend.\nThanks for keeping deadlines clear so we can follow up with the client promptly.\n\nBest,\n${you()}` } }
    ];

    const task = pick(tasks);
    return { c, m, task, prompt: task.prompt };
  }

  function phraseBankByLevel(){
    const L = lvl();
    const base = [
      "Thank you for your message.","I’m sorry for the inconvenience.","I can confirm the new schedule.",
      "Could you please confirm your preferred option?","If that doesn’t suit you, we can offer an alternative.",
      "I’ll follow up by the end of the day.","Best regards,","Kind regards,"
    ];
    if(L==="a2"){
      return ["Hello,","I’m sorry.","I will check it.","We can…","Could you please confirm?","Thank you.","Best regards,"].concat(base.slice(0,3));
    }
    if(L==="b1") return base.concat(["Would Friday at 3 p.m. work for you?","Could we reschedule to tomorrow morning?"]);
    return base.concat([
      "Please accept my apologies for the inconvenience caused.",
      "I’m writing regarding the latest update and next steps.",
      "To proceed, could you please confirm the reference number?",
      "If I don’t hear back by tomorrow at 2 p.m., I will follow up by the end of the day."
    ]);
  }

  function upgradesByLevel(){
    const L = lvl();
    if(L==="a2"){
      return {
        purpose: "I’m writing to confirm the update.",
        apology: "I’m sorry for the inconvenience.",
        reason: "Because of a schedule change, we need to move the meeting.",
        request: "Could you please confirm your option?",
        deadline: "Please reply today before 5 p.m.",
        close: "Best regards,"
      };
    }
    if(L==="b1"){
      return {
        purpose: "I’m writing regarding the latest update and next steps.",
        apology: "I’m sorry for the inconvenience, and thank you for your patience.",
        reason: "Due to an internal scheduling change, we need to adjust the timing.",
        request: "Could you please confirm your preferred option so we can proceed?",
        deadline: "Could you please reply today before 5 p.m.? I’ll follow up by the end of the day.",
        close: "Best regards,"
      };
    }
    return {
      purpose: "I’m writing regarding the latest update and the actions required on our side.",
      apology: "Please accept my apologies for the inconvenience caused.",
      reason: "Due to an internal scheduling change, we need to adjust the timing to ensure the right stakeholders can attend.",
      request: "To proceed, could you please confirm your preferred option so we can secure the slot?",
      deadline: "If I don’t hear back by tomorrow at 2 p.m., I will follow up by the end of the day.",
      close: "Kind regards,"
    };
  }

  const drillPool = [
    { stem:"Polite request: _______ send the updated file by 4 p.m.?", options:["Can you","Could you please","You must"], answer:1, explain:"“Could you please…” is polite and professional." },
    { stem:"Would you mind + V‑ing: Would you mind _______ (check) the invoice?", options:["to check","checking","check"], answer:1, explain:"After “Would you mind”, use V‑ing." },
    { stem:"Despite / Although: _______ the delay, we delivered on time.", options:["Although","Despite","Because"], answer:1, explain:"Despite + noun. Although + clause." },
    { stem:"Since / for: We have worked together _______ 2021.", options:["since","for","during"], answer:0, explain:"Since + starting point (2021)." },
    { stem:"Collocation: It depends _______ the supplier.", options:["of","on","from"], answer:1, explain:"Correct: depend on." },
    { stem:"Past narration: I _______ (work) when the system crashed.", options:["worked","was working","am working"], answer:1, explain:"Background action: past continuous." }
  ];
  const mistakePool = [
    { stem:"I am agree with you.", options:["I agree with you.","I am agree with you (OK).","I’m agree with you."], answer:0, explain:"In English: “I agree with you.”" },
    { stem:"I propose you to move the meeting.", options:["I propose you to move the meeting (OK).","I suggest moving the meeting.","I suggest you move meeting to."], answer:1, explain:"Use “suggest” or “propose a plan”." },
    { stem:"I am here since two years.", options:["I’m here since two years.","I have been here for two years.","I was here for two years (now)."], answer:1, explain:"Present perfect: have been + for/since." },
    { stem:"It depends of the situation.", options:["It depends on the situation.","It depends of the situation.","It depends from the situation."], answer:0, explain:"Depend on." },
    { stem:"Despite it is late, we continue.", options:["Despite it is late, we continue.","Although it is late, we continue.","Despite it is late, we will."], answer:1, explain:"Although + clause / Despite + noun." }
  ];
  const rewritePool = [
    { bad:"I will make a point with you tomorrow to speak about the problem.", hint:"arrange/set up a call + discuss" },
    { bad:"I send you the document since yesterday but you don't answer.", hint:"present perfect + follow up politely" },
    { bad:"I am available the Tuesday at 14h.", hint:"on Tuesday at 2 p.m." },
    { bad:"Please to confirm me if it's possible.", hint:"Could you please confirm…?" },
    { bad:"We will see together and we will find a solution.", hint:"collocation: work together / find a solution" }
  ];

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

  function outlineAutoCheck(){
    const text = ($("#speakOutline").value||"").trim();
    const fb=$("#outlineFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }

    const hasContext = /(situation|context|there is|there was|the issue|the problem)/i.test(text);
    const hasAction = /(i will|i would|i can|i am going to|i contacted|i called|i sent|i checked)/i.test(text);
    const hasOptions = /(we can|we could|alternatively|option|suggest)/i.test(text);
    const hasClose = /(could you|please|confirm|let me know|next step|overall|in summary)/i.test(text);

    const count = [hasContext,hasAction,hasOptions,hasClose].filter(Boolean).length;
    const L = lvl();
    const needed = (L==="a2") ? 2 : (L==="b1" ? 3 : 4);

    if(count>=needed){
      fb.className="feedback good"; fb.textContent=`✅ Good plan (${count}/4). Now speak from your outline.`; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent=`⚠️ Add more lines. Target: ${needed}/4 (context + action + options + close).`;
    }
    renderReport();
  }

  function setSpeakTimers(){
    const L = lvl();
    const t = cfg.speak[L];
    $("#prepNum").textContent = String(t.prep);
    $("#speakNum").textContent = String(t.speak);
  }

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

  function renderWriteChecklist(){
    const items = [
      { id:"subject", label:"Subject clair" },
      { id:"opening", label:"Opening (Hello / Hi) + polite tone" },
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
      details: /(\d{1,2}:\d{2}|\d{1,2}\s?(a\.m\.|p\.m\.)|\bthursday\b|\bfriday\b|\breference\b|\b\d{4,}\b|by the end of the day|before 5 p\.m\.)/i.test(text),
      request: /(could you|please|confirm|let me know|would you|can you)/i.test(text),
      polite: /(could|would|please|thank you|kind regards|best regards|apologies)/i.test(text),
      closing: /(best regards|kind regards|sincerely)/i.test(text)
    };
    $$("#writeChecklist input").forEach(cb=>cb.checked = !!checks[cb.dataset.wck]);
    const okCount = Object.values(checks).filter(Boolean).length;
    const lines = countLines(text);
    const lineOk = (lines>=8 && lines<=12);
    const L = lvl();
    const target = (L==="a2") ? 7 : 8;

    if(okCount>=target && lineOk){
      fb.className="feedback good"; fb.textContent = `✅ Exam-ready. Checks: ${okCount}/7. Lines: ${lines} (OK).`; addScore(1,0);
    }else{
      fb.className="feedback bad"; fb.textContent = `⚠️ Improve. Checks: ${okCount}/7 (target ${target}). Lines: ${lines} (target 8–12).`;
    }
    renderReport();
  }

  function renderSpeaking(){
    const sp = buildSpeakPrompt();
    state.current.speak = sp;
    $("#speakPrompt").textContent = sp.text;
    $("#speakOutline").value = "";
    $("#outlineFb").textContent = "";
    $("#outlineFb").className = "feedback";
    $("#outlineFb").dataset.scored = "";
    renderChips("#speakChips", speakChipsByLevel(), "#speakOutline", false);

    const t = cfg.speak[lvl()];
    $("#prepNum").textContent = String(t.prep);
    $("#speakNum").textContent = String(t.speak);
    clearTimer("prep"); clearTimer("speak");
    clearRecording();
  }

  function renderWriting(){
    const w = buildWriteTask();
    state.current.write = w;
    $("#writeTask").textContent = w.prompt;

    const L = lvl();
    const tone = $("#tone").value;
    let model = w.task.models[L];

    if(tone==="warm"){
      model = model.replace(/Best regards,/g, "Warm regards,").replace(/Kind regards,/g, "Warm regards,");
    }else if(tone==="firm"){
      model = model.replace(/Could you please confirm/i, "Could you please confirm as soon as possible");
    }

    $("#writeModel").textContent = model;
    $("#writeModel").hidden = true;

    renderChips("#writeChips", phraseBankByLevel(), "#draft", true);

    $("#draft").value = "";
    $("#writeFb").textContent = "";
    $("#writeFb").className = "feedback";
    $("#writeFb").dataset.scored = "";
    renderWriteChecklist();
    $("#writeUpgradeOut").textContent = "";

    clearTimer("write");
    $("#writeTimer").textContent = "10:00";
  }

  function renderDrills(){
    state.current.drills = shuffle(drillPool).slice(0,6);
    state.current.mistakes = shuffle(mistakePool).slice(0,5);
    renderMCQ($("#drillQuiz"), state.current.drills);
    renderMCQ($("#mistakeQuiz"), state.current.mistakes);
    newRewrite();
  }

  function newRewrite(){
    state.current.rewrite = pick(rewritePool);
    $("#rewritePrompt").textContent = `❌ ${state.current.rewrite.bad}\nTip: ${state.current.rewrite.hint}`;
    $("#rewriteInput").value = "";
    $("#rewriteFb").textContent = "";
    $("#rewriteFb").className = "feedback";
    $("#rewriteFb").dataset.scored = "";
  }

  function checkRewrite(){
    const fb=$("#rewriteFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    const txt = ($("#rewriteInput").value||"").trim();
    if(!txt){
      fb.className="feedback bad";
      fb.textContent="⚠️ Write your rewrite first.";
      return;
    }
    const signals = [/could you please/i,/would you mind/i,/set up|arrange|schedule/i,/discuss/i,/have been/i,/since|for/i,/\bon tuesday\b|\bat 2 p\.m\.\b/i,/follow up/i];
    const hits = signals.filter(rx=>rx.test(txt)).length;
    if(hits>=1){
      fb.className="feedback good";
      fb.textContent="✅ Looks correct & professional. Add 1 detail (time/deadline) if possible.";
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent="⚠️ Not sure. Use the tip (collocations + polite request).";
    }
    renderReport();
  }

  function makeSpeakUpgrade(){
    const u = upgradesByLevel();
    const key = $("#speakUpgradePick").value;
    const map = {
      apology: u.apology,
      clarify: "Just to clarify, could you confirm the reference number and the deadline?",
      options: "We can either fix this today, or arrange an alternative solution tomorrow.",
      deadline: u.deadline,
      close: u.close + "\nCould you please confirm?"
    };
    $("#speakUpgradeOut").textContent = map[key] || "";
  }
  function makeWriteUpgrade(){
    const u = upgradesByLevel();
    const key = $("#writeUpgradePick").value;
    $("#writeUpgradeOut").textContent = u[key] || "";
  }

  function scoreSpeaking(){
    const r = rubricScore();
    const fb=$("#speakFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    const pct = r.max ? Math.round((r.total/r.max)*100) : 0;

    if(pct>=75){
      fb.className="feedback good";
      fb.textContent = `✅ Strong (${r.total}/${r.max}). Next: add 1 extra detail + stronger close.`;
      addScore(1,0);
    }else if(pct>=50){
      fb.className="feedback";
      fb.textContent = `🙂 OK (${r.total}/${r.max}). Improve structure + connectors + polite close.`;
    }else{
      fb.className="feedback bad";
      fb.textContent = `⚠️ Needs work (${r.total}/${r.max}). Use the 4-line plan + 2 connectors.`;
    }
    renderReport();
  }

  function reportText(){
    const c = contexts[ctxKey()] || contexts.general;
    const L = lvl().toUpperCase();
    const r = rubricScore();
    const auto = state.score.t ? Math.round((state.score.c/state.score.t)*100) : 0;
    const done = Array.from(state.sectionsDone).join(", ") || "(none)";
    const tts = state.accent==="UK" ? "UK" : "US";
    const spTitle = state.current.speak?.scen?.title || "(n/a)";
    const wKey = state.current.write?.task?.key || "(n/a)";

    return [
      "English 360° — Speaking & Writing Clinic (Pack 3) — Report",
      `Student: ${you()}`,
      `Level: ${L} | Context: ${ctxKey()}`,
      `Scenario: ${c.company} / ${c.dept} / ${c.contact}`,
      `TTS Accent: ${tts}`,
      "",
      `Auto-check Score: ${state.score.c}/${state.score.t} (${auto}%)`,
      `Speaking rubric: ${r.total}/${r.max}`,
      `Current speaking scenario: ${spTitle}`,
      `Current writing task: ${wKey}`,
      `Sections completed: ${done}`,
      "",
      "Targets (next session):",
      "- Speaking: 4-line plan + 2 connectors + polite close + 2 details (time/ref).",
      "- Writing: Subject + purpose + 2 details + question + closing; 8–12 lines.",
      "- Grammar: would you mind + V-ing / despite vs although / since vs for / depend on.",
      "",
      "Homework (10–12 min):",
      "1) 1 speaking prompt: outline + speak (record if possible).",
      "2) 1 email: self-check + add 1 upgrade sentence.",
      "3) 6 micro-drills: aim 6/6."
    ].join("\n");
  }
  function renderReport(){ $("#reportPreview").textContent = reportText(); }

  function save(){
    const data = {
      accent: state.accent, tapMode: state.tapMode, score: state.score, seed: state.seed,
      sectionsDone: Array.from(state.sectionsDone),
      studentName: $("#studentName").value, level: $("#level").value, context: $("#context").value, tone: $("#tone").value
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    alert("Enregistré.");
  }
  function load(){
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw){ alert("Aucune sauvegarde."); return; }
    try{
      const data = JSON.parse(raw);
      $("#studentName").value = data.studentName || "";
      $("#level").value = data.level || "b1";
      $("#context").value = data.context || "general";
      $("#tone").value = data.tone || "neutral";
      state.accent = data.accent || "US";
      state.tapMode = (data.tapMode !== undefined) ? data.tapMode : true;
      state.score = data.score || {c:0,t:0};
      state.seed = data.seed || Math.floor(Math.random()*1e9);
      state.sectionsDone = new Set(data.sectionsDone || []);
      updateAccentButtons();
      updateTapButton();
      $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
      renderAll();
      alert("Chargé.");
    }catch(e){ alert("Impossible de charger."); }
  }

  function updateAccentButtons(){
    $("#accentUS").setAttribute("aria-pressed", state.accent==="US" ? "true" : "false");
    $("#accentUK").setAttribute("aria-pressed", state.accent==="UK" ? "true" : "false");
  }
  function updateTapButton(){
    $("#tapMode").setAttribute("aria-pressed", state.tapMode ? "true" : "false");
    $("#tapMode").textContent = state.tapMode ? "On" : "Off";
  }

  function routineText(){
    return [
      "English 360° — Routine (10–12 min)",
      "1) Speaking: 1 prompt + 4-line plan + speak (record if possible).",
      "2) Writing: 1 email (8–12 lines) + self-check + add 1 upgrade sentence.",
      "3) Drills: 6 questions (aim 6/6)."
    ].join("\n");
  }
  function checklistText(){
    return [
      "English 360° — Speaking/Writing Checklist",
      "- Speaking: structure (context→action→options→close).",
      "- Speaking: 2 connectors (however/therefore/as a result).",
      "- Speaking: polite requests (could/would/would you mind).",
      "- Writing: Subject + purpose + 2 details + question + closing.",
      "- Writing: 8–12 lines, professional tone."
    ].join("\n");
  }

  function renderAll(){
    renderProgress();
    renderRubric();
    renderSpeaking();
    renderWriting();
    renderDrills();
    renderReport();
    setSpeakTimers();
  }

  function wire(){
    $("#accentUS").addEventListener("click", ()=>{ state.accent="US"; updateAccentButtons(); renderReport(); });
    $("#accentUK").addEventListener("click", ()=>{ state.accent="UK"; updateAccentButtons(); renderReport(); });
    $("#tapMode").addEventListener("click", ()=>{ state.tapMode=!state.tapMode; updateTapButton(); });
    $("#resetAll").addEventListener("click", ()=>{ stopSpeech(); location.reload(); });

    $("#saveProgress").addEventListener("click", save);
    $("#loadProgress").addEventListener("click", load);

    $("#markSpeak").addEventListener("click", ()=>markDone("speak"));
    $("#markWrite").addEventListener("click", ()=>markDone("write"));
    $("#markDrills").addEventListener("click", ()=>markDone("drills"));

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

    $("#newSpeak").addEventListener("click", renderSpeaking);
    $("#listenSpeakPrompt").addEventListener("click", ()=>speak($("#speakPrompt").textContent, 1.0));
    $("#startPrep").addEventListener("click", ()=>{ const t=cfg.speak[lvl()]; startCount("prep", t.prep, $("#prepNum")); });
    $("#startSpeak").addEventListener("click", ()=>{ const t=cfg.speak[lvl()]; startCount("speak", t.speak, $("#speakNum")); });
    $("#resetSpeak").addEventListener("click", ()=>{ clearTimer("prep"); clearTimer("speak"); setSpeakTimers(); });
    $("#clearOutline").addEventListener("click", ()=>{
      $("#speakOutline").value="";
      $("#outlineFb").textContent="";
      $("#outlineFb").className="feedback";
      $("#outlineFb").dataset.scored="";
    });
    $("#checkOutline").addEventListener("click", outlineAutoCheck);

    $("#recStart").addEventListener("click", startRecording);
    $("#recStop").addEventListener("click", stopRecording);
    $("#recClear").addEventListener("click", ()=>{ stopRecording(); clearRecording(); });

    $("#makeSpeakUpgrade").addEventListener("click", makeSpeakUpgrade);
    $("#insertSpeakUpgrade").addEventListener("click", ()=>{
      const t = ($("#speakUpgradeOut").textContent||"").trim();
      if(!t) return;
      insertAtCursor($("#speakOutline"), t + "\n");
    });
    $("#ttsSpeakUpgrade").addEventListener("click", ()=>{
      const t = ($("#speakUpgradeOut").textContent||"").trim();
      if(t) speak(t, 1.0);
    });
    $("#scoreSpeaking").addEventListener("click", scoreSpeaking);

    $("#tone").addEventListener("change", renderWriting);
    $("#newWrite").addEventListener("click", renderWriting);
    $("#toggleModel").addEventListener("click", ()=>{ $("#writeModel").hidden = !$("#writeModel").hidden; });
    $("#listenModel").addEventListener("click", ()=>speak($("#writeModel").textContent, 1.0));
    $("#clearDraft").addEventListener("click", ()=>{
      $("#draft").value="";
      $("#writeFb").textContent="";
      $("#writeFb").className="feedback";
      $("#writeFb").dataset.scored="";
      $$("#writeChecklist input").forEach(x=>x.checked=false);
    });
    $("#checkWriting").addEventListener("click", selfCheckWriting);
    $("#makeWriteUpgrade").addEventListener("click", makeWriteUpgrade);
    $("#insertWriteUpgrade").addEventListener("click", ()=>{
      const t = ($("#writeUpgradeOut").textContent||"").trim();
      if(!t) return;
      insertAtCursor($("#draft"), t + "\n");
    });

    $("#startWriteTimer").addEventListener("click", ()=>startMMSS("write", 10*60, $("#writeTimer")));
    $("#resetWriteTimer").addEventListener("click", ()=>{ clearTimer("write"); $("#writeTimer").textContent="10:00"; });

    $("#copyPhrases").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(phraseBankByLevel().join("\n"));
      alert(ok ? "Phrases copiées." : "Impossible de copier.");
    });

    $("#newDrills").addEventListener("click", ()=>{ renderDrills(); renderReport(); });
    $("#newRewrite").addEventListener("click", newRewrite);
    $("#checkRewrite").addEventListener("click", checkRewrite);

    $("#copyReport").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#reportPreview").textContent);
      alert(ok ? "Rapport copié." : "Impossible de copier.");
    });
    $("#printReport").addEventListener("click", ()=>window.print());
    $("#copyRoutine").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(routineText());
      alert(ok ? "Routine copiée." : "Impossible de copier.");
    });
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