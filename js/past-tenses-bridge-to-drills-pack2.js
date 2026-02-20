(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const LINKS = {
    ps: "tense-drill-past-simple-pack1-fixed.html",
    pp: "tense-drill-present-perfect-pack2-fixed.html",
    pc: "tense-drill-past-continuous-pack3-fixed.html"
  };
  const STORAGE = {
    ps: "SET_TENSE_PACK_PAST_SIMPLE_v1",
    pp: "SET_TENSE_PACK_PRESENT_PERFECT_v1",
    pc: "SET_TENSE_PACK_PAST_CONTINUOUS_v1",
    reco: "SET_PAST_TENSES_RECOMMENDATION_v1"
  };

  const state = { accent:"US", timer:{id:null,t:0}, diag:null };

  // TTS
  function speechSupported(){ return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window); }
  function stopSpeech(){ if(speechSupported()) try{ speechSynthesis.cancel(); }catch(e){} }
  function loadVoices(){ if(!speechSupported()) return []; return speechSynthesis.getVoices()||[]; }
  function pickVoice(accent){
    const vs=loadVoices(); if(!vs.length) return null;
    const want = accent==="UK" ? ["en-GB","en_GB"] : ["en-US","en_US"];
    const fb = accent==="UK" ? ["en","en-IE","en-AU","en-CA","en-US"] : ["en","en-CA","en-AU","en-GB"];
    const by = (arr)=>vs.find(v=>arr.some(x=>(v.lang||"").toLowerCase().includes(x.toLowerCase())));
    return by(want)||by(fb)||vs[0];
  }
  function speak(text, rate=1.0){
    if(!speechSupported()){ return; }
    stopSpeech();
    const u=new SpeechSynthesisUtterance(text);
    const v=pickVoice(state.accent); if(v) u.voice=v;
    u.rate=rate; u.pitch=1; u.volume=1;
    speechSynthesis.speak(u);
  }
  if(speechSupported()){ loadVoices(); window.speechSynthesis.onvoiceschanged=()=>loadVoices(); }

  // Timer
  function fmt(sec){ const m=String(Math.floor(sec/60)).padStart(2,"0"); const s=String(sec%60).padStart(2,"0"); return `${m}:${s}`; }
  function stopTimer(){ if(state.timer.id) clearInterval(state.timer.id); state.timer.id=null; state.timer.t=0; $("#timerTxt").textContent="00:00"; }
  function startTimer(seconds){
    stopTimer(); state.timer.t=seconds; $("#timerTxt").textContent=fmt(state.timer.t);
    state.timer.id=setInterval(()=>{ state.timer.t-=1; $("#timerTxt").textContent=fmt(Math.max(0,state.timer.t)); if(state.timer.t<=0){ clearInterval(state.timer.id); state.timer.id=null; } }, 1000);
  }

  const SUMMARY = [
    "✅ Past Simple = finished past + WHEN? (yesterday, last week, at 9:00).",
    "📌 Present Perfect = update/status now (already/just/yet/since/for).",
    "⏳ Past Continuous = background action (was/were V-ing) + interruption (… when … Past Simple).",
    "",
    "Bridge rule:",
    "• If you say a finished time → Past Simple.",
    "• If you give a status update now → Present Perfect.",
    "• If you describe what was happening at the moment → Past Continuous."
  ].join("\n");

  const VOCAB = {
    shipping: ["shipment","delivery date","tracking number","delayed","on hold","in transit","warehouse","supplier","ETA","to follow up","to confirm","as soon as possible"],
    it: ["system","issue","bug","error message","ticket","to reboot","to restart","access","network","outage","to escalate","workaround"],
    meeting: ["agenda","action items","deadline","next steps","to confirm","to agree","to suggest","minutes","stakeholders","to follow up","clarify","priority"],
    hotel: ["complaint","apology","refund","room change","housekeeping","maintenance","noise","reservation","to compensate","to resolve","guest","satisfied"]
  };

  const MINI = {
    shipping: {
      speak: "Speak (60s): Yesterday, what happened? What did you do? What has changed now?",
      write: "Write (6–8 lines): Subject + apology + update + next step."
    },
    it: {
      speak: "Speak (60s): What were you doing when the error appeared? What have you done since?",
      write: "Write: Subject + status update + request confirmation."
    },
    meeting: {
      speak: "Speak (60s): What did you discuss? What have you decided? What was happening at the start?",
      write: "Write: Subject + decisions + action items."
    },
    hotel: {
      speak: "Speak (60s): What happened yesterday? What have you done now? What was happening when the guest complained?",
      write: "Write: Subject + apology + solution + next step."
    }
  };

  function readCompletion(key){
    try{ return JSON.parse(localStorage.getItem(key)||"null"); }catch(e){ return null; }
  }

  function renderPackCards(){
    const box=$("#packCards"); box.innerHTML="";
    const items=[
      {id:"ps", name:"Past Simple (Pack 1)", why:"finished past + time", key:STORAGE.ps, href:LINKS.ps, icon:"✅"},
      {id:"pp", name:"Present Perfect (Pack 2)", why:"status update now", key:STORAGE.pp, href:LINKS.pp, icon:"📌"},
      {id:"pc", name:"Past Continuous (Pack 3)", why:"background + when", key:STORAGE.pc, href:LINKS.pc, icon:"⏳"},
    ];
    const parts=[];
    let done=0;
    items.forEach(it=>{
      const d=readCompletion(it.key);
      const badge = d?.complete ? `✅ Completed (${d.pct}%)` : "—";
      if(d?.complete) done+=1;
      parts.push(`
        <div class="item">
          <div class="row" style="justify-content:space-between;">
            <div class="itemTitle">${it.icon} ${it.name}</div>
            <span class="badge">${badge}</span>
          </div>
          <div class="muted small">${it.why}</div>
          <div class="row noPrint" style="margin-top:10px;">
            <a class="btn btn--tiny btn--primary" href="${it.href}">Open pack</a>
          </div>
        </div>
      `);
    });
    box.innerHTML = parts.join("");
    $("#progTxt").textContent = `${done}/3`;
  }

  // Diagnostic
  function buildQuestions(sc){
    // Each question targets one tense: ps, pp, pc
    const Q=[];
    const push=(tense, stem, options, answer, explain)=>Q.push({tense, stem, options, answer, explain});
    // Common
    push("ps", `(${sc}) “We ____ the client yesterday.”`, ["called","have called","were calling"], 0, "Yesterday = finished time → Past Simple.");
    push("pp", `(${sc}) “We ____ the update already.”`, ["sent","have sent","were sending"], 1, "Already + update now → Present Perfect.");
    push("pc", `(${sc}) “We ____ the stock when the client called.”`, ["checked","were checking","have checked"], 1, "Background action → Past Continuous.");
    push("ps", `(${sc}) Question: “When ____ you ____ the file?”`, ["did / send","have / sent","were / sending"], 0, "Past question uses DID + base verb.");
    push("pp", `(${sc}) “Have you ____ the email yet?”`, ["send","sent","sending"], 1, "Have + V3.");
    push("pc", `(${sc}) “At 3 p.m., we ____ for confirmation.”`, ["waited","were waiting","have waited"], 1, "Specific time + in progress → Past Continuous.");
    // Scenario flavours
    if(sc==="shipping"){
      push("ps","“We ____ the supplier at 9:00.”",["called","have called","were calling"],0,"Specific time → Past Simple.");
      push("pp","“The shipment ____ delayed since Monday.”",["was","has been","is"],1,"Since + continues now → Present Perfect.");
      push("pc","“We were preparing the shipment when we ____ a missing part.”",["noticed","were noticing","have noticed"],0,"Interrupting short action → Past Simple.");
    }else if(sc==="it"){
      push("ps","“I ____ the system this morning.”",["restarted","have restarted","was restarting"],0,"Finished time → Past Simple.");
      push("pp","“We ____ the issue. It works now.”",["fixed","have fixed","were fixing"],1,"Result now → Present Perfect.");
      push("pc","“I was updating the system when it ____.”",["crashed","was crashing","has crashed"],0,"Short event → Past Simple.");
    }else if(sc==="meeting"){
      push("ps","“We ____ on the next steps last Friday.”",["agreed","have agreed","were agreeing"],0,"Last Friday = finished time → Past Simple.");
      push("pp","“We ____ to move the meeting.”",["decided","have decided","were deciding"],1,"Decision update now → Present Perfect.");
      push("pc","“We were discussing the deadline when new data ____.”",["arrived","was arriving","has arrived"],0,"Short event → Past Simple.");
    }else{
      push("ps","“We ____ the room yesterday evening.”",["checked","have checked","were checking"],0,"Yesterday evening → Past Simple.");
      push("pp","“We ____ a solution already.”",["offered","have offered","were offering"],1,"Already → Present Perfect.");
      push("pc","“We were cleaning the room when the guest ____.”",["arrived","was arriving","has arrived"],0,"Arrived = short event → Past Simple.");
    }
    return Q.slice(0,12);
  }

  function diagNew(){
    const sc=$("#scenario").value;
    const questions = buildQuestions(sc);
    state.diag = {
      sc,
      i:0,
      Q: questions,
      score: {ps:{c:0,t:0}, pp:{c:0,t:0}, pc:{c:0,t:0}}
    };
    renderQ();
    $("#recoFb").textContent="";
    $("#qFb").textContent="";
    updateResults();
  }

  function renderQ(){
    const d=state.diag;
    const q=d.Q[d.i];
    $("#qNum").textContent = `${d.i+1}/${d.Q.length}`;
    $("#qText").textContent = q.stem;
    const opt=$("#qOptions"); opt.innerHTML="";
    q.options.forEach((lab,idx)=>{
      const b=document.createElement("button");
      b.type="button"; b.className="choice"; b.textContent=lab;
      b.onclick=()=>answer(idx);
      opt.appendChild(b);
    });
  }

  function setBars(){
    const s=state.diag.score;
    const pct=(x)=> x.t ? Math.round((x.c/x.t)*100) : 0;
    $("#rPS").textContent=`${s.ps.c}/${s.ps.t}`; $("#barPS").style.width=`${pct(s.ps)}%`;
    $("#rPP").textContent=`${s.pp.c}/${s.pp.t}`; $("#barPP").style.width=`${pct(s.pp)}%`;
    $("#rPC").textContent=`${s.pc.c}/${s.pc.t}`; $("#barPC").style.width=`${pct(s.pc)}%`;
  }

  function recommend(){
    const s=state.diag.score;
    const pct=(x)=> x.t ? (x.c/x.t) : 0;
    const list=[
      {id:"ps", name:"Past Simple", href:LINKS.ps, why:"finished time cues (yesterday, last week)"},
      {id:"pp", name:"Present Perfect", href:LINKS.pp, why:"updates/status now (already/just/yet/since/for)"},
      {id:"pc", name:"Past Continuous", href:LINKS.pc, why:"background (was/were V-ing) + interruption"}
    ];
    // pick lowest accuracy (with tie → most common: ps first)
    list.forEach(it=> it.p = pct(s[it.id]));
    list.sort((a,b)=> a.p-b.p || (a.id==="ps" ? -1 : 1));
    const top=list[0];
    return top;
  }

  function updateResults(){
    setBars();
    const reco = recommend();
    const sc=$("#scenario").value;
    const msg = [
      `Scenario: ${sc}`,
      ``,
      `Recommended next drill: ${reco.name}`,
      `Why: your lowest score is here → drill it until 80%+.`,
      ``,
      `Then do the other packs in order: Past Simple → Present Perfect → Past Continuous.`
    ].join("\n");
    $("#recoBox").textContent = msg;
    $("#recoBtn").href = reco.href;
    $("#recoBtn").textContent = `Open: ${reco.name}`;
  }

  function answer(choiceIdx){
    const d=state.diag;
    const q=d.Q[d.i];
    d.score[q.tense].t += 1;
    const ok = (choiceIdx===q.answer);
    if(ok) d.score[q.tense].c += 1;

    const fb=$("#qFb");
    fb.className = ok ? "fb good" : "fb bad";
    fb.textContent = (ok ? "✅ " : "❌ ") + q.explain;

    // Lock buttons
    $$("#qOptions .choice").forEach((b,idx)=>{
      if(idx===q.answer) b.classList.add("is-correct");
      if(idx===choiceIdx && !ok) b.classList.add("is-wrong");
      b.disabled=true;
    });
    updateResults();
  }

  function next(){
    const d=state.diag;
    if(d.i < d.Q.length-1){
      d.i += 1;
      $("#qFb").className="fb"; $("#qFb").textContent="";
      renderQ();
    } else {
      $("#qFb").className="fb good";
      $("#qFb").textContent="✅ Diagnostic complete. Open the recommended pack and drill to 80%+.";
    }
  }

  function skip(){
    const d=state.diag;
    if(d.i < d.Q.length-1){ d.i += 1; $("#qFb").textContent=""; renderQ(); }
  }

  // Scenario vocab
  function renderVocab(){
    const sc=$("#scenario").value;
    const words = VOCAB[sc] || [];
    const chips=$("#vocabChips"); chips.innerHTML="";
    words.forEach(w=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=w;
      b.onclick=()=>{ $("#vocabSel").textContent = w; speak(w,1.0); };
      chips.appendChild(b);
    });
    $("#miniSpeak").textContent = MINI[sc].speak;
    $("#miniWrite").textContent = MINI[sc].write;
    $("#miniOut").value="";
    $("#miniFb").className="fb"; $("#miniFb").textContent="";
    $("#packHint").className="fb";
    $("#packHint").textContent = "Tip: Do the diagnostic first, then open the recommended pack. Use the scenario vocabulary while speaking and writing.";
  }

  function miniCheck(){
    const txt=$("#miniOut").value||"";
    const hasSubject=/subject:/i.test(txt);
    const hasTime=/(yesterday|last|ago|at \d|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday))/i.test(txt);
    const hasPP=/(have|has|haven't|hasn't)\s+\w+(ed|en)\b/i.test(txt) || /(have|has|haven't|hasn't)\s+(been|sent|done|made|gone|seen)\b/i.test(txt);
    const hasPC=/\b(was|were)\b\s+\w+ing\b/i.test(txt);
    const hits = [hasSubject, hasTime, hasPP, hasPC].filter(Boolean).length;
    const fb=$("#miniFb");
    fb.className = hits>=2 ? "fb good" : "fb bad";
    fb.textContent = hits>=2
      ? "✅ Good start. Now open your recommended drill pack and rewrite with cleaner tense choices."
      : "⚠️ Add at least: Subject + ONE clear tense marker (time / already/just/yet / was-were+ing).";
  }

  // Linking snippet
  const SNIP = `<!-- ✅ Next step: Drill packs (paste into past-tenses-clear-pack1.html) -->
<section class="card" id="next-drills">
  <h2 class="h2">Next steps: Drill Packs (Past Tenses)</h2>
  <p class="muted">Start with the recommended pack, then complete all 3.</p>
  <div class="row" style="margin-top:10px; flex-wrap:wrap;">
    <a class="btn btn--primary" href="past-tenses-bridge-to-drills-pack2.html">🧭 Bridge + Diagnostic</a>
    <a class="btn" href="tense-drill-past-simple-pack1-fixed.html">✅ Pack 1: Past Simple</a>
    <a class="btn" href="tense-drill-present-perfect-pack2-fixed.html">📌 Pack 2: Present Perfect</a>
    <a class="btn" href="tense-drill-past-continuous-pack3-fixed.html">⏳ Pack 3: Past Continuous</a>
  </div>
</section>`;

  async function copySnippet(){
    try{
      await navigator.clipboard.writeText(SNIP);
      $("#snipFb").className="fb good";
      $("#snipFb").textContent="✅ Snippet copied. Paste it into past-tenses-clear-pack1.html.";
    }catch(e){
      $("#snipFb").className="fb";
      $("#snipFb").textContent="Copy not allowed here. You can manually select the snippet and copy.";
    }
  }

  function saveReco(){
    const r = recommend();
    const payload = { reco:r.id, name:r.name, href:r.href, scenario:$("#scenario").value, when:new Date().toISOString() };
    localStorage.setItem(STORAGE.reco, JSON.stringify(payload));
    $("#recoFb").className="fb good";
    $("#recoFb").textContent = `✅ Saved: ${payload.name} (scenario: ${payload.scenario}).`;
  }

  function loadRecoHint(){
    try{
      const p = JSON.parse(localStorage.getItem(STORAGE.reco) || "null");
      if(!p) return;
      $("#packHint").className="fb";
      $("#packHint").textContent = `Saved recommendation: ${p.name} (scenario: ${p.scenario}).`;
    }catch(e){}
  }

  function resetProgress(){
    [STORAGE.ps, STORAGE.pp, STORAGE.pc, STORAGE.reco].forEach(k=>localStorage.removeItem(k));
    renderPackCards();
    $("#packHint").className="fb";
    $("#packHint").textContent="Progress cleared in this browser.";
    $("#recoFb").textContent="";
  }

  function wire(){
    $("#accentUS").onclick=()=>{ state.accent="US"; $("#accentUS").setAttribute("aria-pressed","true"); $("#accentUK").setAttribute("aria-pressed","false"); };
    $("#accentUK").onclick=()=>{ state.accent="UK"; $("#accentUK").setAttribute("aria-pressed","true"); $("#accentUS").setAttribute("aria-pressed","false"); };

    $("#scenario").onchange=()=>{ renderVocab(); diagNew(); renderPackCards(); };
    $("#newDiag").onclick=diagNew;
    $("#listenQ").onclick=()=> speak($("#qText").textContent||"", 1.0);
    $("#skipQ").onclick=skip;
    $("#nextQ").onclick=next;
    $("#saveReco").onclick=saveReco;

    $("#listenVocab").onclick=()=> speak((VOCAB[$("#scenario").value]||[]).join(". "), 0.95);
    $("#listenMiniSpeak").onclick=()=> speak($("#miniSpeak").textContent||"",1.0);
    $("#listenMiniOut").onclick=()=> speak($("#miniOut").value || $("#miniWrite").textContent || "", 1.0);

    $("#start60").onclick=()=> startTimer(60);
    $("#stopTimer").onclick=stopTimer;

    $("#miniCheck").onclick=miniCheck;
    $("#miniClear").onclick=()=>{ $("#miniOut").value=""; $("#miniFb").textContent=""; $("#miniFb").className="fb"; };

    $("#snippetBox").textContent = SNIP;
    $("#copySnip").onclick=copySnippet;

    $("#resetProg").onclick=resetProgress;
  }

  function init(){
    $("#summaryBox").textContent = SUMMARY;
    renderPackCards();
    renderVocab();
    diagNew();
    loadRecoHint();
    wire();
  }

  init();
})();