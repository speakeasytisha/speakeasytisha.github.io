/* SpeakEasyTisha • Passive + Reported Speech Pack 1 (A2→B2) */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const STORE_KEY = "se_passive_reported_pack1_v1";

  const state = {
    accent: "US",
    tapMode: true,
    teacher: false,
    seed: Math.floor(Math.random()*1e9),
    score: {c:0, t:0},
    sectionsDone: new Set(),
    pickedTileId: null,
    current: {
      vocab: null,
      vocabQuiz: null,
      ap: null,
      steps: null,
      passiveQuiz: null,
      rs: null,
      meeting: null,
      reportedQuiz: null,
      mock: null
    }
  };

  // ---------- utils ----------
  function rand(){ const x = Math.sin(state.seed++)*10000; return x - Math.floor(x); }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(rand()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function lvl(){ return $("#level").value; }
  function ctxKey(){ return $("#context").value; }
  function goal(){ return $("#goal").value; }
  function you(){
    const n = ($("#studentName").value||"").trim();
    return n ? n : "you";
  }
  function norm(s){
    return (s||"")
      .toLowerCase()
      .replace(/[’']/g,"'")
      .replace(/[^a-z0-9\s']/g," ")
      .replace(/\s+/g," ")
      .trim();
  }
  function addScore(c,t){
    state.score.c += c;
    state.score.t += t;
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

  // ---------- speech ----------
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
    if(!speechSupported()){ alert("TTS not supported here. Please read aloud."); return; }
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

  // ---------- progress ----------
  const progressItems = [
    { id:"vocab", label:"Vocab" },
    { id:"passive", label:"Passive" },
    { id:"reported", label:"Reported" },
    { id:"mock", label:"Mini mock" },
    { id:"report", label:"Report" }
  ];
  function renderProgress(){
    const box=$("#progressChecks");
    box.innerHTML="";
    progressItems.forEach(it=>{
      const row=document.createElement("label");
      row.className="checkItem";
      row.innerHTML = `<input type="checkbox" data-prog="${it.id}"/><span>${it.label}</span>`;
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
      const cb = $(`#progressChecks input[data-prog="${id}"]`);
      if(cb) cb.checked=true;
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

  // ---------- scenarios ----------
  const contexts = {
    general: { company:"NorthBridge Solutions", contact:"Taylor Morgan", dept:"Operations", phone:"+1 617 555 0148" },
    hospitality: { company:"Riverview Hotel", contact:"Ms. Taylor Morgan", dept:"Front Desk", phone:"+44 20 7946 0812" },
    engineering: { company:"Helix Manufacturing", contact:"Taylor Morgan", dept:"Supplier Quality", phone:"+1 312 555 0199" },
    admin: { company:"BrightLine Office", contact:"Taylor Morgan", dept:"Administration", phone:"+33 1 84 88 12 30" },
    sales: { company:"Arcadia Sales", contact:"Taylor Morgan", dept:"Customer Success", phone:"+1 415 555 0137" },
    transport: { company:"MetroLink Tours", contact:"Taylor Morgan", dept:"Operations", phone:"+44 161 555 0101" }
  };
  function meta(){
    const L=lvl();
    return {
      ref: (L==="a2") ? "120926" : (L==="b1" ? "250314" : "407915"),
      deadline: (L==="b2") ? "by the end of the day" : "today before 5 p.m.",
      time: (L==="a2") ? "tomorrow" : (L==="b1" ? "tomorrow morning" : "tomorrow at 10:30 a.m.")
    };
  }

  // ---------- vocabulary ----------
  const vocabPassiveBase = [
    { icon:"⏱️", term:"to be delayed", def:"to happen later than planned (passive-friendly)" , exA2:"The shipment was delayed.", exB2:"The shipment has been delayed due to a missing part."},
    { icon:"📦", term:"shipment", def:"goods sent to a customer", exA2:"The shipment was sent.", exB2:"The shipment was dispatched yesterday."},
    { icon:"🧾", term:"invoice", def:"a bill for products/services", exA2:"The invoice was sent.", exB2:"A corrected invoice will be issued."},
    { icon:"⚠️", term:"issue / incident", def:"a problem event (IT or process)", exA2:"An issue was reported.", exB2:"An incident was logged and escalated."},
    { icon:"🛠️", term:"to be fixed", def:"to be repaired/solved", exA2:"It was fixed.", exB2:"The issue is being fixed right now."},
    { icon:"📍", term:"to be located", def:"to be found in a place", exA2:"It was located.", exB2:"The package was located at the warehouse."},
    { icon:"✅", term:"to be confirmed", def:"to be checked and accepted", exA2:"It was confirmed.", exB2:"The delivery date has been confirmed."},
    { icon:"🔎", term:"to be investigated", def:"to be examined to find the cause", exA2:"It was investigated.", exB2:"The root cause is being investigated."}
  ];
  const vocabReportedBase = [
    { icon:"🗣️", term:"said", def:"reported speech verb (neutral)", exA2:"He said it was urgent.", exB2:"The client said they needed it by Friday."},
    { icon:"🧠", term:"explained", def:"reported speech verb (give reasons)", exA2:"She explained it was late.", exB2:"He explained the shipment had been delayed due to…"},
    { icon:"❓", term:"asked", def:"reported speech verb (question)", exA2:"They asked if it was ready.", exB2:"She asked whether the invoice had been corrected."},
    { icon:"✅", term:"confirmed", def:"reported speech verb (officially say yes)", exA2:"He confirmed the time.", exB2:"They confirmed the meeting would be moved."},
    { icon:"💡", term:"suggested", def:"reported speech verb (idea/option)", exA2:"She suggested Friday.", exB2:"He suggested shipping a partial order today."},
    { icon:"📌", term:"deadline", def:"the last time to do something", exA2:"The deadline was Friday.", exB2:"They said the deadline was by end of day."},
    { icon:"🧩", term:"next steps", def:"what happens after this", exA2:"Next steps were clear.", exB2:"They confirmed the next steps and owners."},
    { icon:"📝", term:"meeting notes", def:"short summary of what was said", exA2:"Meeting notes were written.", exB2:"Meeting notes were shared after the call."}
  ];

  function byLevelExample(v){
    const L=lvl();
    return (L==="a2") ? v.exA2 : (L==="b1" ? v.exA2 : v.exB2);
  }

  function renderVocab(){
    const vp = $("#vocabPassive");
    const vr = $("#vocabReported");
    vp.innerHTML=""; vr.innerHTML="";

    const pickCount = (lvl()==="a2") ? 6 : 8;
    const pass = shuffle(vocabPassiveBase).slice(0,pickCount);
    const rep = shuffle(vocabReportedBase).slice(0,pickCount);

    state.current.vocab = { pass, rep };

    const card = (v)=>`
      <div class="v">
        <div class="v__icon" aria-hidden="true">${v.icon}</div>
        <div>
          <div class="v__term">${v.term}</div>
          <div class="v__def">${v.def}</div>
          <div class="badge">${byLevelExample(v)}</div>
        </div>
        <div class="v__btns">
          <button class="btn btn--tiny btn--ghost" data-say="${encodeURIComponent(byLevelExample(v))}" type="button">▶</button>
          <button class="btn btn--tiny" data-copy="${encodeURIComponent(v.term+' — '+v.def)}" type="button">Copy</button>
        </div>
      </div>
    `;

    vp.innerHTML = pass.map(card).join("");
    vr.innerHTML = rep.map(card).join("");

    // wire buttons
    $$("#vocab .v [data-say]").forEach(b=>{
      b.addEventListener("click", ()=> speak(decodeURIComponent(b.dataset.say), 1.0));
    });
    $$("#vocab .v [data-copy]").forEach(b=>{
      b.addEventListener("click", async ()=>{
        const ok = await copyToClipboard(decodeURIComponent(b.dataset.copy));
        alert(ok ? "Copied." : "Copy failed.");
      });
    });

    renderVocabQuiz();
  }

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
          state.score.t += 1;
          if(ok){
            state.score.c += 1;
            b.classList.add("is-correct"); exp.hidden=false; exp.textContent = `✅ ${q.explain}`;
          }else{
            b.classList.add("is-wrong");
            const btns = $$(".choice", el);
            btns[q.answer].classList.add("is-correct");
            exp.hidden=false; exp.textContent = `❌ ${q.explain}`;
          }
          $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
          renderReport();
        });
        opt.appendChild(b);
      });
      container.appendChild(el);
    });
  }

  function renderVocabQuiz(){
    const pass = state.current.vocab?.pass || [];
    const rep = state.current.vocab?.rep || [];
    const pool = shuffle(pass.concat(rep)).slice(0, 6);

    const qs = pool.map(v=>{
      const isPassive = vocabPassiveBase.some(x=>x.term===v.term);
      const stem = isPassive ? `Pick the best passive use for: “${v.term}”` : `Pick the best reported-speech use for: “${v.term}”`;
      const correct = byLevelExample(v);
      const wrong1 = isPassive ? "We delayed the shipment." : "The client said, “We need it by Friday.”";
      const wrong2 = isPassive ? "I delay the shipment now." : "He asked: “Do you can confirm?”";
      const opts = shuffle([correct, wrong1, wrong2]);
      return { stem, options: opts, answer: opts.indexOf(correct), explain: v.def };
    });

    state.current.vocabQuiz = qs;
    renderMCQ($("#vocabQuiz"), qs);
  }

  // ---------- PASSIVE section ----------
  
  // Passive tense map (explicit tense names + when to use)
  const passiveTenseMap = {
    process: {
      name: "Present Simple Passive",
      form: "is/are + V3",
      when: "Use for processes, routines, how things work (no specific time).",
      ex: () => {
        const k = ctxKey();
        if(k==="admin") return "The invoice is checked, and the error is confirmed.";
        if(k==="engineering") return "The part is quarantined and the issue is documented.";
        if(k==="hospitality") return "The complaint is received and a solution is proposed.";
        return "The request is received and the document is reviewed.";
      }
    },
    badnews: {
      name: "Past Simple Passive",
      form: "was/were + V3",
      when: "Use for a specific incident in the past (yesterday / this morning).",
      ex: () => "The shipment was delayed this morning."
    },
    ongoing: {
      name: "Present Continuous Passive",
      form: "is/are being + V3",
      when: "Use when the action is happening now (in progress).",
      ex: () => "The root cause is being investigated right now."
    },
    recent: {
      name: "Present Perfect Passive",
      form: "has/have been + V3",
      when: "Use for a past action with a result now (update/status). Often: due to…",
      ex: () => "It has been delayed due to a missing part."
    },
    future: {
      name: "Future Passive",
      form: "will be + V3",
      when: "Use for what will happen next (future plan).",
      ex: () => "A corrected invoice will be sent today."
    }
  };

  function renderPassiveTenseMap(){
    const out = $("#ptOut");
    const rules = $("#ptRules");
    if(!out || !rules) return;

    const key = $("#ptSituation") ? $("#ptSituation").value : "process";
    const item = passiveTenseMap[key] || passiveTenseMap.process;
    const ex = item.ex();

    out.textContent = [
      `${item.name}`,
      `Form: ${item.form}`,
      `When: ${item.when}`,
      `Example: ${ex}`
    ].join("\n");

    rules.textContent = [
      "Quick rules:",
      "• Process (how it works) → Present Simple Passive (is/are + V3).",
      "• Bad news about a specific event → Past Simple Passive (was/were + V3).",
      "• Action happening now → Present Continuous Passive (is/are being + V3).",
      "• Update/result now → Present Perfect Passive (has/have been + V3) + due to…",
      "• Future plan → Future Passive (will be + V3)."
    ].join("\n");
  }
function renderPassiveCards(){
    const L=lvl();
    const items = [
      { title:"Structure (tense name)", txt:"Passive = BE + V3. Tense is shown by BE (is/are = present, was/were = past, has been = present perfect, is being = continuous, will be = future)." },
      { title:"Focus", txt:"Use passive when the action/result matters more than the person." },
      { title:"Bonus (useful!)", txt:"present perfect passive: has/have been + V3 + due to…" },
    ];
    if(L!=="a2"){
      items.push({ title:"Agent (optional)", txt:"by + person/company (only if the agent matters): “was sent by…”" });
    }
    $("#passiveCards").innerHTML = items.map(x=>`<div class="c"><div class="c__title">${x.title}</div><div class="c__txt">${x.txt}</div></div>`).join("");
  }

  const apTasks = [
    { active:"We delayed the shipment.", answer:"The shipment was delayed.", hint:"Object + was/were + V3." },
    { active:"We fixed the issue this morning.", answer:"The issue was fixed this morning.", hint:"issue → was fixed" },
    { active:"They have cancelled the booking.", answer:"The booking has been cancelled.", hint:"has been + V3" },
    { active:"We will send a corrected invoice today.", answer:"A corrected invoice will be sent today.", hint:"will be + V3" },
    { active:"They are investigating the root cause.", answer:"The root cause is being investigated.", hint:"is being + V3" }
  ];

  function renderAP(){
    renderPassiveCards();
    const t = pick(apTasks);
    state.current.ap = t;
    $("#apPrompt").textContent = `Active: ${t.active}\nWrite the passive version.`;
    $("#apInput").value="";
    $("#apFb").textContent="";
    $("#apFb").className="feedback";
    $("#apAnswer").textContent = t.answer;
    $("#apFb").dataset.scored = "";
  }

  function checkAP(){
    const expected = norm(state.current.ap.answer);
    const got = norm($("#apInput").value);
    const fb = $("#apFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }

    const ok = (got.includes(expected)) || (expected.includes(got)) || (
      got.replace(/\bthe\b/g,"a") === expected.replace(/\bthe\b/g,"a")
    );

    if(ok){
      fb.className="feedback good";
      fb.textContent="✅ Correct!";
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent="❌ Not quite. Use the hint or check the answer.";
    }
    renderReport();
  }

  // ---------- Process steps (tap-friendly sorting) ----------
  const processPools = {
    general: {
      title:"Document approval process",
      steps:[
        "The request is received.",
        "The document is reviewed.",
        "Changes are requested (if needed).",
        "The document is approved.",
        "The final version is sent to the client."
      ]
    },
    hospitality: {
      title:"Hotel complaint handling",
      steps:[
        "The complaint is received.",
        "The room is inspected.",
        "A solution is proposed.",
        "The issue is fixed (or moved).",
        "The guest is informed and thanked."
      ]
    },
    engineering: {
      title:"Supplier nonconformity process",
      steps:[
        "The issue is reported.",
        "The part is quarantined.",
        "The root cause is investigated.",
        "Corrective actions are implemented.",
        "The result is verified and documented."
      ]
    },
    admin: {
      title:"Invoice correction process",
      steps:[
        "The invoice is checked.",
        "The error is confirmed.",
        "A corrected invoice is issued.",
        "The client is informed.",
        "The file is archived."
      ]
    },
    sales: {
      title:"Customer escalation process",
      steps:[
        "The ticket is opened.",
        "The case is escalated.",
        "Options are offered to the client.",
        "The solution is implemented.",
        "A follow-up is sent."
      ]
    },
    transport: {
      title:"Booking change process",
      steps:[
        "The request is received.",
        "Availability is checked.",
        "The booking is updated.",
        "The customer is notified.",
        "The confirmation is sent."
      ]
    }
  };

  function renderSteps(){
    const pool = processPools[ctxKey()] || processPools.general;
    const correct = pool.steps.slice();
    const shuffled = shuffle(correct);
    state.current.steps = { title: pool.title, correct, items: shuffled };

    $("#processSteps").innerHTML = "";
    shuffled.forEach((txt, idx)=>{
      $("#processSteps").appendChild(stepEl(txt, idx));
    });
    updateStepNumbers();
    $("#stepsFb").textContent = "";
    $("#stepsFb").className = "feedback";
    $("#stepsFb").dataset.scored = "";
    $("#processOut").value = "";

    const ans = $("#stepsAnswer");
    if(ans){
      ans.textContent = state.current.steps.correct.map((s,i)=>`${i+1}) ${s}`).join("\n");
    }
  }

  function stepEl(txt, idx){
    const el = document.createElement("div");
    el.className = "step";
    el.dataset.idx = String(idx);
    el.innerHTML = `
      <div class="step__txt">${txt}</div>
      <div class="step__tools">
        <button class="iconBtn" type="button" data-up title="Move up">↑</button>
        <button class="iconBtn" type="button" data-down title="Move down">↓</button>
        <button class="iconBtn" type="button" data-pick title="Tap pick/swap">↔</button>
      </div>
    `;
    return el;
  }

  function getStepTexts(){
    return $$("#processSteps .step .step__txt").map(x=>x.textContent.trim());
  }

  function updateStepNumbers(){
    $$("#processSteps .step").forEach((step, i)=>{
      const n = $(".step__num", step);
      if(n) n.textContent = String(i+1);
    });
  }

  function swapSteps(i, j){
    const list = $("#processSteps");
    const items = $$("#processSteps .step");
    if(i<0 || j<0 || i>=items.length || j>=items.length) return;
    const a = items[i], b = items[j];
    const aNext = a.nextSibling;
    const bNext = b.nextSibling;
    if(aNext === b){
      list.insertBefore(b, a);
    
    updateStepNumbers();
  }else if(bNext === a){
      list.insertBefore(a, b);
    }else{
      list.insertBefore(a, bNext);
      list.insertBefore(b, aNext);
    }
  }

  function wireStepControls(){
    $("#processSteps").addEventListener("click", (e)=>{
      const step = e.target.closest(".step");
      if(!step) return;
      const steps = $$("#processSteps .step");
      const idx = steps.indexOf(step);

      if(e.target.matches("[data-up]")) swapSteps(idx, idx-1);
      if(e.target.matches("[data-down]")) swapSteps(idx, idx+1);

      if(e.target.matches("[data-pick]")){
        const current = step;
        const already = $("#processSteps .step.is-selected");
        if(already && already !== current){
          const steps2 = $$("#processSteps .step");
          const i = steps2.indexOf(already);
          const j = steps2.indexOf(current);
          already.classList.remove("is-selected");
          swapSteps(i, j);
        }else{
          steps.forEach(s=>s.classList.remove("is-selected"));
          current.classList.add("is-selected");
        }
      }
    }, { passive:true });
  }

  function checkSteps(){
    const fb = $("#stepsFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }
    const got = getStepTexts();
    const correct = state.current.steps.correct;
    let okCount = 0;
    const wrongPos = [];
    got.forEach((t,i)=>{
      if(t===correct[i]) okCount++;
      else wrongPos.push(i+1);
    });
    const allOk = okCount===correct.length;

    const msg = allOk
      ? `✅ Correct order! (${okCount}/${correct.length})`
      : `❌ Not quite. ${okCount}/${correct.length} steps are in the correct position. Wrong positions: ${wrongPos.join(", ")}.`;

    fb.className = allOk ? "feedback good" : "feedback bad";
    fb.textContent = msg;

    if(allOk) addScore(1,0);
    renderReport();
  }

  function makeProcessParagraph(){
    const got = getStepTexts();
    const L=lvl();
    const title = state.current.steps.title;
    const connectorsA2 = ["First,", "Then,", "Next,", "After that,", "Finally,"];
    const connectorsB2 = ["First,", "Once this is done,", "Next,", "Afterwards,", "Finally,"];
    const conn = (L==="b2") ? connectorsB2 : connectorsA2;

    const s = got.map((line,i)=> `${conn[Math.min(i, conn.length-1)]} ${line}`).join(" ");
    const out = `${title}:\n${s}`;
    $("#processOut").value = out;
    renderReport();
  }

  
  function stepsHint(){
    const correct = state.current.steps.correct;
    const first = correct[0];
    const last = correct[correct.length-1];
    const L = lvl();
    const fb = $("#stepsFb");
    fb.className = "feedback";
    fb.textContent = (L==="a2")
      ? `Hint: First = “${first}” • Last = “${last}”.`
      : `Hint: First = “${first}” • Last = “${last}”. Try to group steps: receive → check → action → confirm.`;
  }
// passive quiz
  const passiveQuizPool = [
    { stem:"Choose the best passive sentence (bad news):", options:["We delayed the shipment.","The shipment was delayed.","We delay the shipment now."], answer:1, explain:"Passive focuses on the result." },
    { stem:"Choose the best (present perfect passive):", options:["It has been delayed due to a missing part.","It is delayed because missing part.","We have delayed it."], answer:0, explain:"has been + V3 + due to…" },
    { stem:"Choose the correct form:", options:["The invoice was send yesterday.","The invoice was sent yesterday.","The invoice was sending yesterday."], answer:1, explain:"sent = past participle." },
    { stem:"Choose the best process sentence:", options:["The file is checked and approved.","We check and approve the file (always).","The file checks and approves."], answer:0, explain:"Passive reads like a process." }
  ];

  function renderPassiveQuiz(){
    const qs = shuffle(passiveQuizPool).slice(0,4);
    state.current.passiveQuiz = qs;
    renderMCQ($("#passiveQuiz"), qs);
  }

  // ---------- REPORTED SPEECH section ----------
  function renderReportedCards(){
    const L=lvl();
    const items = [
      { title:"Structure", txt:"Reporting verb + (that) + clause: “They said (that)…”" },
      { title:"Backshift", txt:"present → past; will → would; can → could (often)." },
      { title:"Questions", txt:"asked if/whether + clause (no question word order)." }
    ];
    if(L==="b2"){
      items.push({ title:"Passive + reported (power combo)", txt:"He explained the shipment had been delayed due to…" });
    }
    $("#reportedCards").innerHTML = items.map(x=>`<div class="c"><div class="c__title">${x.title}</div><div class="c__txt">${x.txt}</div></div>`).join("");
  }

  const rsTasks = [
    { direct:`The client said, "We need it by Friday."`, answer:"The client said they needed it by Friday.", hint:"need → needed" },
    { direct:`She asked, "Can you confirm the new time?"`, answer:"She asked if we could confirm the new time.", hint:"asked if + could" },
    { direct:`He confirmed, "The invoice has been corrected."`, answer:"He confirmed the invoice had been corrected.", hint:"has been → had been" },
    { direct:`They suggested, "Let's ship a partial order today."`, answer:"They suggested shipping a partial order that day.", hint:"suggest + V-ing; today → that day" },
    { direct:`She explained, "The shipment was delayed due to a missing part."`, answer:"She explained the shipment had been delayed due to a missing part.", hint:"was delayed → had been delayed" }
  ];

  function renderRS(){
    renderReportedCards();
    const t = pick(rsTasks);
    state.current.rs = t;
    $("#rsPrompt").textContent = `Direct: ${t.direct}\nWrite the reported version.`;
    $("#rsInput").value="";
    $("#rsFb").textContent="";
    $("#rsFb").className="feedback";
    $("#rsAnswer").textContent = t.answer;
    $("#rsFb").dataset.scored = "";
  }

  function checkRS(){
    const expected = norm(state.current.rs.answer);
    const got = norm($("#rsInput").value);
    const fb = $("#rsFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }

    const ok =
      got.includes(expected) ||
      expected.includes(got) ||
      got.replace(/\bthat\b/g,"").includes(expected.replace(/\bthat\b/g,""));

    if(ok){
      fb.className="feedback good";
      fb.textContent="✅ Correct!";
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent="❌ Not quite. Use the hint or check the answer.";
    }
    renderReport();
  }

  // meeting categorisation
  const meetingPools = {
    general: [
      { id:"m1", txt:"The client said they needed the update by Friday.", box:"deadline" },
      { id:"m2", txt:"They explained the shipment had been delayed due to a missing part.", box:"problem" },
      { id:"m3", txt:"They suggested shipping a partial order today.", box:"solution" },
      { id:"m4", txt:"They asked if we could confirm the new delivery date.", box:"next" },
      { id:"m5", txt:"We confirmed the corrected invoice would be sent by end of day.", box:"next" },
      { id:"m6", txt:"The client asked whether the issue was being investigated.", box:"problem" }
    ],
    hospitality: [
      { id:"h1", txt:"The guest said the room was not clean.", box:"problem" },
      { id:"h2", txt:"They asked if we could change rooms.", box:"solution" },
      { id:"h3", txt:"We confirmed the new room would be ready in 15 minutes.", box:"deadline" },
      { id:"h4", txt:"We suggested offering a free breakfast.", box:"solution" },
      { id:"h5", txt:"The guest said they needed a quick update.", box:"next" },
      { id:"h6", txt:"We confirmed we would follow up by end of day.", box:"deadline" }
    ],
    engineering: [
      { id:"e1", txt:"The supplier said the part had been quarantined.", box:"next" },
      { id:"e2", txt:"They explained the root cause was being investigated.", box:"problem" },
      { id:"e3", txt:"They confirmed corrective actions would be implemented this week.", box:"next" },
      { id:"e4", txt:"They asked if the deadline could be moved.", box:"deadline" },
      { id:"e5", txt:"We suggested an interim inspection plan.", box:"solution" },
      { id:"e6", txt:"They said the shipment had been delayed due to rework.", box:"problem" }
    ],
    admin: [
      { id:"a1", txt:"The client said the invoice had been charged twice.", box:"problem" },
      { id:"a2", txt:"They asked whether a corrected invoice could be sent today.", box:"deadline" },
      { id:"a3", txt:"We confirmed the corrected invoice would be issued by 5 p.m.", box:"deadline" },
      { id:"a4", txt:"We explained the payment would be refunded.", box:"solution" },
      { id:"a5", txt:"We suggested a quick call to confirm details.", box:"next" },
      { id:"a6", txt:"The client said they needed the reference number.", box:"next" }
    ],
    sales: [
      { id:"s1", txt:"The client said the service was not stable.", box:"problem" },
      { id:"s2", txt:"They asked if we could escalate the ticket.", box:"next" },
      { id:"s3", txt:"We confirmed the case would be escalated immediately.", box:"next" },
      { id:"s4", txt:"We suggested a temporary workaround.", box:"solution" },
      { id:"s5", txt:"They said they needed an update by end of day.", box:"deadline" },
      { id:"s6", txt:"We explained the fix was being deployed.", box:"solution" }
    ],
    transport: [
      { id:"t1", txt:"The customer said the booking had been cancelled by mistake.", box:"problem" },
      { id:"t2", txt:"They asked whether it could be restored today.", box:"deadline" },
      { id:"t3", txt:"We confirmed the booking would be updated within one hour.", box:"deadline" },
      { id:"t4", txt:"We suggested an alternative departure time.", box:"solution" },
      { id:"t5", txt:"They asked if we could send a new confirmation.", box:"next" },
      { id:"t6", txt:"We explained the issue was being investigated.", box:"problem" }
    ]
  };

  function renderMeeting(){
    ["Deadline","Problem","Solution","Next"].forEach(x=>{
      $("#box"+x).innerHTML = "";
    });
    $("#summaryOut").value = "";

    const pool = meetingPools[ctxKey()] || meetingPools.general;
    const items = shuffle(pool).slice(0, (lvl()==="a2" ? 5 : 6));
    state.current.meeting = {
      items,
      placed: { deadline: [], problem: [], solution: [], next: [] }
    };

    const bank = $("#meetingBank");
    bank.innerHTML = "";
    items.forEach(it=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="tile";
      b.dataset.tid = it.id;
      b.textContent = it.txt;
      bank.appendChild(b);
    });

    state.pickedTileId = null;
    wireMeetingTap();
  }

  function tileById(id){
    return $(`#meetingBank .tile[data-tid="${id}"]`) ||
           $(`#boxDeadline .tile[data-tid="${id}"]`) ||
           $(`#boxProblem .tile[data-tid="${id}"]`) ||
           $(`#boxSolution .tile[data-tid="${id}"]`) ||
           $(`#boxNext .tile[data-tid="${id}"]`);
  }
  function itemData(id){
    return (state.current.meeting.items || []).find(x=>x.id===id);
  }

  function clearPicked(){
    $$(".tile").forEach(t=>t.classList.remove("is-picked"));
    state.pickedTileId = null;
  }

  function moveTileTo(boxKey){
    const id = state.pickedTileId;
    if(!id) return;

    const el = tileById(id);
    if(!el) return;

    Object.keys(state.current.meeting.placed).forEach(k=>{
      state.current.meeting.placed[k] = state.current.meeting.placed[k].filter(x=>x!==id);
    });

    const dest = boxKey==="deadline" ? $("#boxDeadline")
      : boxKey==="problem" ? $("#boxProblem")
      : boxKey==="solution" ? $("#boxSolution")
      : $("#boxNext");

    dest.appendChild(el);
    state.current.meeting.placed[boxKey].push(id);
    clearPicked();
    renderReport();
  }

  function wireMeetingTap(){
    const bank = $("#meetingBank");
    bank.onclick = (e)=>{
      const t = e.target.closest(".tile"); if(!t) return;
      clearPicked();
      t.classList.add("is-picked");
      state.pickedTileId = t.dataset.tid;
    };
    ["boxDeadline","boxProblem","boxSolution","boxNext"].forEach(boxId=>{
      const box = $("#"+boxId);
      box.onclick = (e)=>{
        const t = e.target.closest(".tile"); if(!t) return;
        clearPicked();
        t.classList.add("is-picked");
        state.pickedTileId = t.dataset.tid;
      };
    });

    $$(".box").forEach(b=>{
      b.onclick = (e)=>{
        if(e.target.closest(".tile")) return;
        moveTileTo(b.dataset.box);
      };
    });
  }

  function resetMeeting(){
    const bank = $("#meetingBank");
    ["Deadline","Problem","Solution","Next"].forEach(x=>{
      const box = $("#box"+x);
      $$(".tile", box).forEach(tile=>bank.appendChild(tile));
    });
    clearPicked();
    state.current.meeting.placed = { deadline: [], problem: [], solution: [], next: [] };
    $("#summaryOut").value = "";
    renderReport();
  }

  function makeSummary(){
    const c = contexts[ctxKey()] || contexts.general;
    const m = meta();
    const placed = state.current.meeting.placed;
    const lines = [];
    const fmt = (ids)=>ids.map(id=>itemData(id)?.txt).filter(Boolean);

    const L=lvl();
    const header = (L==="a2")
      ? `Meeting summary (${c.company}):`
      : (L==="b1")
        ? `Call summary — ${c.company} / Ref ${m.ref}:`
        : `Meeting recap — ${c.company} / ${c.dept} — Ref ${m.ref}:`;

    lines.push(header);

    const deadlineLines = fmt(placed.deadline);
    const problemLines = fmt(placed.problem);
    const solutionLines = fmt(placed.solution);
    const nextLines = fmt(placed.next);

    if(problemLines.length){
      lines.push((L==="a2") ? "Problems:" : "Key issues:");
      problemLines.forEach(x=>lines.push(`- ${x}`));
    }
    if(deadlineLines.length){
      lines.push((L==="a2") ? "Deadlines:" : "Deadlines / timing:");
      deadlineLines.forEach(x=>lines.push(`- ${x}`));
    }
    if(solutionLines.length){
      lines.push((L==="a2") ? "Solutions:" : "Proposed solutions:");
      solutionLines.forEach(x=>lines.push(`- ${x}`));
    }
    if(nextLines.length){
      lines.push((L==="a2") ? "Next steps:" : "Next steps / actions:");
      nextLines.forEach(x=>lines.push(`- ${x}`));
    }

    if(L!=="a2"){
      lines.push("");
      lines.push(`We will follow up ${m.deadline}.`);
    }

    $("#summaryOut").value = lines.join("\n");
    renderReport();
  }

  const reportedQuizPool = [
    { stem:`Direct: "We need it by Friday."`, options:[
      "The client said they needed it by Friday.",
      "The client said we need it by Friday.",
      "The client said needed it by Friday."
    ], answer:0, explain:"need → needed (backshift)." },
    { stem:`Direct: "Can you confirm?"`, options:[
      "She asked if we could confirm.",
      "She asked can we confirm.",
      "She asked if could confirm we."
    ], answer:0, explain:"asked if + clause (no question order)." },
    { stem:`Direct: "The invoice has been corrected."`, options:[
      "He confirmed the invoice had been corrected.",
      "He confirmed the invoice has been corrected.",
      "He confirmed the invoice was correct."
    ], answer:0, explain:"has been → had been (often)." },
    { stem:`Choose the best reporting verb (idea):`, options:[
      "suggested", "confirmed", "asked"
    ], answer:0, explain:"suggested = idea/option." }
  ];

  function renderReportedQuiz(){
    const qs = shuffle(reportedQuizPool).slice(0,4);
    state.current.reportedQuiz = qs;
    renderMCQ($("#reportedQuiz"), qs);
  }

  // ---------- MINI MOCK (writing) ----------
  const mockPrompts = [
    {
      key:"delay_update",
      build:(c,m)=>`You are writing to ${c.contact}.\nBad news: the shipment (Ref ${m.ref}) has been delayed.\nExplain briefly (passive). Give 2 options. Mention the deadline (${m.deadline}).\nAdd a short meeting/call summary (reported speech).`
    },
    {
      key:"invoice_double",
      build:(c,m)=>`Reply to ${c.contact}.\nProblem: the invoice was charged twice (Ref ${m.ref}).\nApologise (passive). Explain what will be done + timeline (${m.deadline}).\nAdd one reported sentence from the client.`
    },
    {
      key:"hotel_complaint",
      build:(c,m)=>`Write to ${c.contact}.\nProblem: a complaint was received.\nExplain what was done (passive) + what will be done.\nInclude 1 reported sentence (what the client/guest said).`
    }
  ];

  function helperLines(){
    const m = meta();
    const L = lvl();
    const passive = [
      "The shipment was delayed.",
      "It has been delayed due to a missing part.",
      "A corrected invoice will be issued.",
      "The issue is being investigated."
    ];
    const reported = [
      "The client said they needed it by Friday.",
      "They asked if we could confirm the new time.",
      "He confirmed the invoice had been corrected.",
      "They suggested shipping a partial order that day."
    ];
    const closings = [
      `Could you please confirm your preferred option by ${m.deadline}?`,
      "Please let me know if you have any questions.",
      "Thank you for your patience."
    ];
    if(L==="a2"){
      return shuffle([
        passive[0], passive[2],
        "I’m sorry for the inconvenience.",
        "We can send it tomorrow.",
        "Could you please confirm?",
        "Best regards,"
      ]);
    }
    if(L==="b1"){
      return shuffle(passive.slice(0,3).concat(reported.slice(0,2)).concat(closings.slice(0,2)));
    }
    return shuffle(passive.concat(reported).concat(closings).concat([
      "Please accept my apologies for the inconvenience caused.",
      "I’ll follow up by the end of the day."
    ]));
  }

  function modelAnswer(promptKey, c, m){
    const L = lvl();
    if(promptKey==="delay_update"){
      if(L==="a2") return `Subject: Shipment delay\n\nHello ${c.contact},\n\nI’m sorry. The shipment was delayed.\nIt has been delayed due to a missing part.\nWe can ship a partial order today, or deliver on Friday.\nThe client said they needed it by Friday.\nCould you please confirm your preferred option?\n\nBest regards,\n${you()}`;
      if(L==="b1") return `Subject: Update — shipment delay (Ref ${m.ref})\n\nHello ${c.contact},\n\nThank you for your message. Unfortunately, the shipment was delayed and has been delayed due to a missing part.\nWe can ship a partial order today, or deliver on Friday.\nDuring the call, the client said they needed it by Friday and asked if we could confirm the new delivery date.\nCould you please confirm your preferred option by ${m.deadline}?\n\nBest regards,\n${you()}`;
      return `Subject: Shipment update — delay & options (Ref ${m.ref})\n\nHello ${c.contact},\n\nPlease accept my apologies for the inconvenience caused. The shipment has been delayed due to a missing part.\nOption 1: a partial order can be shipped today. Option 2: full delivery can be confirmed for Friday.\nIn the call, the client said they needed it by Friday and asked whether we could confirm the timeline.\nCould you please confirm your preferred option by ${m.deadline}, so we can secure the next step?\n\nKind regards,\n${you()}`;
    }
    if(promptKey==="invoice_double"){
      if(L==="a2") return `Subject: Invoice issue\n\nHello ${c.contact},\n\nI’m sorry for the problem. The invoice was charged twice.\nA corrected invoice will be issued today.\nThe client said they needed it quickly.\nCould you please confirm the invoice number?\n\nBest regards,\n${you()}`;
      if(L==="b1") return `Subject: Invoice update (Ref ${m.ref})\n\nHello ${c.contact},\n\nThank you for your message, and I’m sorry for the inconvenience.\nThe invoice was charged twice. A corrected invoice will be issued and sent by ${m.deadline}.\nThe client said they needed the update quickly and asked if we could confirm the corrected amount.\nCould you please confirm the invoice number?\n\nBest regards,\n${you()}`;
      return `Subject: Invoice correction — double charge (Ref ${m.ref})\n\nHello ${c.contact},\n\nPlease accept my apologies for the inconvenience caused. The invoice appears to have been charged twice.\nA corrected invoice will be issued and sent by ${m.deadline}. Any overpayment will be refunded accordingly.\nThe client said they needed this resolved quickly and asked whether we could confirm the corrected amount.\nCould you please confirm the invoice number and billed amount so we can proceed?\n\nKind regards,\n${you()}`;
    }
    if(L==="a2") return `Subject: Complaint update\n\nHello ${c.contact},\n\nA complaint was received.\nThe room was checked and the issue was fixed.\nThe guest said the room was not clean.\nWe will follow up today.\n\nBest regards,\n${you()}`;
    if(L==="b1") return `Subject: Complaint update\n\nHello ${c.contact},\n\nThank you for your message. A complaint was received and the room was inspected.\nThe issue was fixed, and a solution was proposed.\nThe guest said the room was not clean and asked if we could change rooms.\nWe will follow up by ${m.deadline}.\n\nBest regards,\n${you()}`;
    return `Subject: Complaint handling — update & next steps\n\nHello ${c.contact},\n\nPlease accept my apologies for the inconvenience. A complaint was received and the room was inspected.\nThe issue was addressed, and a solution was proposed (room change / service recovery).\nThe guest said the room was not clean and asked whether a new room could be confirmed.\nWe will follow up by ${m.deadline} with the final confirmation.\n\nKind regards,\n${you()}`;
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

  function renderMockChecklist(){
    const items = [
      { id:"subject", label:"Subject line" },
      { id:"purpose", label:"Purpose / bad news clearly stated" },
      { id:"passive", label:"Uses passive (was delayed / has been…)" },
      { id:"reported", label:"Uses reported speech (said/asked/confirmed…)" },
      { id:"options", label:"Gives options / next steps" },
      { id:"deadline", label:"Mentions time/deadline" },
      { id:"polite", label:"Polite close (could you please…)" },
      { id:"closing", label:"Closing + signature" }
    ];
    $("#mockChecklist").innerHTML = items.map(it=>`
      <label class="ck">
        <input type="checkbox" data-mck="${it.id}" />
        <div>${it.label}</div>
      </label>
    `).join("");
  }

  function countLines(text){
    return text ? text.split(/\n+/).map(x=>x.trim()).filter(Boolean).length : 0;
  }

  function renderMock(){
    const c = contexts[ctxKey()] || contexts.general;
    const m = meta();
    let pool = mockPrompts.slice();
    const g = goal();
    if(g==="passive") pool = [mockPrompts[0], mockPrompts[1]];
    if(g==="reported") pool = [mockPrompts[0], mockPrompts[2]];
    const p = pick(pool);

    state.current.mock = { key: p.key, prompt: p.build(c,m), c, m };
    $("#mockPrompt").textContent = state.current.mock.prompt;
    $("#mockDraft").value = "";
    $("#mockFb").textContent = "";
    $("#mockFb").className = "feedback";
    $("#mockFb").dataset.scored = "";
    $("#mockModel").textContent = modelAnswer(p.key, c, m);

    const chips = helperLines();
    $("#mockChips").innerHTML = "";
    chips.forEach(t=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=t;
      b.addEventListener("click", ()=>insertAtCursor($("#mockDraft"), t + "\n"));
      $("#mockChips").appendChild(b);
    });

    renderMockChecklist();
  }

  function checkMock(){
    const fb = $("#mockFb");
    if(!fb.dataset.scored){ addScore(0,1); fb.dataset.scored="1"; }

    const text = ($("#mockDraft").value||"").trim();
    const checks = {
      subject: /subject:/i.test(text),
      purpose: /(unfortunately|update|writing|regarding|problem|delay|issue|complaint|invoice)/i.test(text),
      passive: /(was|were|has been|have been|is being|are being)\s+\w+ed\b/i.test(text) || /(was|were)\s+(sent|made|done|kept|put|set)\b/i.test(text),
      reported: /\b(said|asked|confirmed|explained|suggested)\b/i.test(text),
      options: /(option|we can|we could|alternatively|either|or)/i.test(text),
      deadline: /(today|tomorrow|by the end of the day|before 5|friday|within|asap|\d{1,2}:\d{2}|\b\d{1,2}\s?(a\.m\.|p\.m\.)\b)/i.test(text),
      polite: /(could you please|please|would you mind|thank you|kind regards|best regards)/i.test(text),
      closing: /(best regards|kind regards|sincerely)/i.test(text)
    };

    $$("#mockChecklist input").forEach(cb=>cb.checked = !!checks[cb.dataset.mck]);
    const okCount = Object.values(checks).filter(Boolean).length;
    const lines = countLines(text);
    const lineOk = (lines>=8 && lines<=12);
    const target = (lvl()==="a2") ? 5 : (lvl()==="b1" ? 6 : 7);

    if(okCount>=target && lineOk){
      fb.className="feedback good";
      fb.textContent = `✅ Exam-ready. Checks: ${okCount}/8. Lines: ${lines} (OK).`;
      addScore(1,0);
    }else{
      fb.className="feedback bad";
      fb.textContent = `⚠️ Improve. Checks: ${okCount}/8 (target ${target}). Lines: ${lines} (target 8–12).`;
    }
    renderReport();
  }

  // ---------- report ----------
  function reportText(){
    const c = contexts[ctxKey()] || contexts.general;
    const m = meta();
    const auto = state.score.t ? Math.round((state.score.c/state.score.t)*100) : 0;
    const done = Array.from(state.sectionsDone).join(", ") || "(none)";
    const tts = state.accent==="UK" ? "UK" : "US";
    return [
      "Passive + Reported Speech (Pack 1) — Report",
      `Student: ${you()}`,
      `Level: ${lvl().toUpperCase()} | Goal: ${goal()} | Context: ${ctxKey()}`,
      `Scenario: ${c.company} • ${c.dept} • ${c.contact} | Ref: ${m.ref}`,
      `Accent: ${tts}`,
      "",
      `Auto-check score: ${state.score.c}/${state.score.t} (${auto}%)`,
      `Sections completed: ${done}`,
      "",
      "Targets:",
      "- Passive: be + V3; use 'has been ... due to ...' for bad news.",
      "- Reported: said/explained/asked/confirmed/suggested + backshift.",
      "- Writing: Subject + options + deadline + polite close.",
      "",
      "Teacher notes:",
      "- Strengths:",
      "- Weak points:",
      "- Next focus:"
    ].join("\n");
  }
  function renderReport(){ $("#reportOut").textContent = reportText(); }

  function checklistText(){
    return [
      "Exam Checklist (Passive + Reported)",
      "- Passive: The shipment was delayed / has been delayed due to…",
      "- Reported: The client said they needed… / asked if we could…",
      "- Options: We can… Alternatively…",
      "- Deadline: by the end of the day / before 5 p.m.",
      "- Close: Could you please confirm…"
    ].join("\n");
  }

  // ---------- save/load ----------
  function save(){
    const data = {
      accent: state.accent,
      tapMode: state.tapMode,
      teacher: state.teacher,
      studentName: $("#studentName").value,
      level: $("#level").value,
      context: $("#context").value,
      goal: $("#goal").value
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    alert("Saved.");
  }
  function load(){
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw){ alert("No save found."); return; }
    try{
      const d = JSON.parse(raw);
      $("#studentName").value = d.studentName || "";
      $("#level").value = d.level || "b1";
      $("#context").value = d.context || "general";
      $("#goal").value = d.goal || "balanced";
      state.accent = d.accent || "US";
      state.tapMode = (d.tapMode !== undefined) ? d.tapMode : true;
      state.teacher = !!d.teacher;
      updateAccentButtons();
      updateTapButton();
      updateTeacherButton();
      newSet(true);
      alert("Loaded.");
    }catch(e){ alert("Could not load."); }
  }

  // ---------- UI toggles ----------
  function updateAccentButtons(){
    $("#accentUS").setAttribute("aria-pressed", state.accent==="US" ? "true" : "false");
    $("#accentUK").setAttribute("aria-pressed", state.accent==="UK" ? "true" : "false");
  }
  function updateTapButton(){
    $("#tapMode").setAttribute("aria-pressed", state.tapMode ? "true" : "false");
    $("#tapMode").textContent = state.tapMode ? "On" : "Off";
  }
  function updateTeacherButton(){
    $("#teacherMode").setAttribute("aria-pressed", state.teacher ? "true" : "false");
    $("#teacherMode").textContent = state.teacher ? "On" : "Off";
  }

  // ---------- new set ----------
  function newSet(quiet=false){
    stopSpeech();
    state.seed = Math.floor(Math.random()*1e9);
    state.score = {c:0,t:0};
    $("#scoreTxt").textContent = "0 / 0";
    state.sectionsDone = new Set();
    renderProgress();

    renderVocab();
    renderAP();
    renderPassiveTenseMap();
    renderSteps();
    renderPassiveQuiz();
    renderRS();
    renderMeeting();
    renderReportedQuiz();
    renderMock();
    renderReport();

    if(!quiet) alert("New set ready.");
  }

  // ---------- wire ----------
  function wire(){
    $("#accentUS").addEventListener("click", ()=>{ state.accent="US"; updateAccentButtons(); renderReport(); });
    $("#accentUK").addEventListener("click", ()=>{ state.accent="UK"; updateAccentButtons(); renderReport(); });

    $("#tapMode").addEventListener("click", ()=>{ state.tapMode=!state.tapMode; updateTapButton(); });

    $("#teacherMode").addEventListener("click", ()=>{ state.teacher=!state.teacher; updateTeacherButton(); });

    $("#resetAll").addEventListener("click", ()=>location.reload());
    $("#printPage").addEventListener("click", ()=>window.print());

    $("#newSet").addEventListener("click", ()=>newSet(false));
    $("#saveProgress").addEventListener("click", save);
    $("#loadProgress").addEventListener("click", load);

    $("#copyRoutine").addEventListener("click", async ()=>{
      const txt = [
        "12–15 minute loop (Passive + Reported)",
        "1) Vocab (8 items) + listen.",
        "2) Passive: transform + process steps.",
        "3) Reported: meeting summary builder.",
        "4) Mini mock email + checklist."
      ].join("\n");
      const ok = await copyToClipboard(txt);
      alert(ok ? "Copied." : "Copy failed.");
    });

    $("#markAllDone").addEventListener("click", ()=>{
      progressItems.forEach(p=>state.sectionsDone.add(p.id));
      renderProgress();
      renderReport();
    });

    $("#markVocab").addEventListener("click", ()=>markDone("vocab"));
    $("#markPassive").addEventListener("click", ()=>markDone("passive"));
    $("#markReported").addEventListener("click", ()=>markDone("reported"));
    $("#markMock").addEventListener("click", ()=>markDone("mock"));

    $("#listenVocab").addEventListener("click", ()=>{
      const all = (state.current.vocab?.pass||[]).concat(state.current.vocab?.rep||[]);
      speak(all.map(v=>byLevelExample(v)).join(" "), 1.0);
    });
    $("#newVocab").addEventListener("click", renderVocab);

    $("#apCheck").addEventListener("click", checkAP);

    // Passive tense map
    $("#ptShow").addEventListener("click", renderPassiveTenseMap);
    $("#ptSituation").addEventListener("change", renderPassiveTenseMap);
    $("#ptListen").addEventListener("click", ()=>{
      const t = $("#ptOut").textContent || "";
      speak(t.replace(/\n/g," "), 1.0);
    });
    $("#apHint").addEventListener("click", ()=>{ $("#apFb").className="feedback"; $("#apFb").textContent = `Hint: ${state.current.ap.hint}`; });
    $("#apListen").addEventListener("click", ()=>speak(state.current.ap.active + " " + state.current.ap.answer, 1.0));
    $("#newPassive").addEventListener("click", ()=>{ renderAP();
    renderPassiveTenseMap(); renderSteps(); renderPassiveQuiz(); });

    wireStepControls();
    $("#shuffleSteps").addEventListener("click", renderSteps);
    $("#checkSteps").addEventListener("click", checkSteps);
    $("#makeProcess").addEventListener("click", makeProcessParagraph);
    $("#stepsHint").addEventListener("click", stepsHint);
    $("#listenProcess").addEventListener("click", ()=>speak($("#processOut").value || "Please generate the paragraph first.", 1.0));

    $("#rsCheck").addEventListener("click", checkRS);
    $("#rsHint").addEventListener("click", ()=>{ $("#rsFb").className="feedback"; $("#rsFb").textContent = `Hint: ${state.current.rs.hint}`; });
    $("#rsListen").addEventListener("click", ()=>speak(state.current.rs.direct + " " + state.current.rs.answer, 1.0));
    $("#newReported").addEventListener("click", ()=>{ renderRS(); renderMeeting(); renderReportedQuiz(); });

    $("#resetMeeting").addEventListener("click", resetMeeting);
    $("#makeSummary").addEventListener("click", makeSummary);
    $("#listenSummary").addEventListener("click", ()=>speak($("#summaryOut").value || "Please generate the summary first.", 1.0));

    $("#newMock").addEventListener("click", renderMock);
    $("#mockCheck").addEventListener("click", checkMock);
    $("#mockClear").addEventListener("click", ()=>{
      $("#mockDraft").value="";
      $("#mockFb").textContent="";
      $("#mockFb").className="feedback";
      $("#mockFb").dataset.scored="";
      $$("#mockChecklist input").forEach(x=>x.checked=false);
    });
    $("#mockListen").addEventListener("click", ()=>{
      const t = ($("#mockDraft").value||"").trim();
      speak(t || $("#mockPrompt").textContent, 1.0);
    });

    $("#copyReport").addEventListener("click", async ()=>{
      const ok = await copyToClipboard($("#reportOut").textContent);
      alert(ok ? "Report copied." : "Copy failed.");
    });
    $("#refreshReport").addEventListener("click", renderReport);
    $("#copyChecklist").addEventListener("click", async ()=>{
      const ok = await copyToClipboard(checklistText());
      alert(ok ? "Checklist copied." : "Copy failed.");
    });

    ["level","context","goal"].forEach(id=>{
      $("#"+id).addEventListener("change", ()=>newSet(true));
    });
  }

  function init(){
    updateAccentButtons();
    updateTapButton();
    updateTeacherButton();
    renderProgress();
    wire();
    newSet(true);
  }
  init();
})();