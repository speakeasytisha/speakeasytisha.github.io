
/* Pack definition: Past Continuous (fixed) */
window.TENSE_PACK = {
  storageKey: "SET_TENSE_PACK_PAST_CONTINUOUS_v1",
  title: "Past Continuous — Drill Pack (Background / When)",
  sub: "Background actions + interruptions (was/were V-ing … when …). A2→B2.",
  rules: [
    "Past Continuous = action in progress in the past (background).",
    "Form: was/were + V-ing.",
    "Often with while/when: “I was checking the stock when the client called.”",
    "Use Past Simple for the short interrupting action."
  ],
  mapOptions: [
    {key:"background", label:"Background action (while / when)"},
    {key:"interrupted", label:"Interrupted action (was/were V-ing + Past Simple)"},
    {key:"setting", label:"Setting the scene (at 3 p.m. / all morning)"},
    {key:"polite", label:"Polite softening (I was wondering…)"}
  ],
  map: {
    background:{
      name:"Past Continuous",
      form:"was/were + V-ing",
      when:"Background action in progress in the past.",
      signals:["while","when","at that moment","in the middle of"],
      example:(sc)=>({
        shipping:"We were checking the stock when the client called.",
        it:"I was running a test when the error appeared.",
        meeting:"We were discussing the deadline when new data arrived.",
        hotel:"We were cleaning the room when the guest arrived."
      }[sc]||"We were checking the stock when the client called.")
    },
    interrupted:{
      name:"Past Continuous + Past Simple",
      form:"was/were + V-ing … when + Past Simple",
      when:"Action in progress interrupted by a short event.",
      signals:["when + Past Simple","suddenly","then"],
      example:(sc)=>({
        shipping:"We were preparing the shipment when we noticed a missing part.",
        it:"I was updating the system when it crashed.",
        meeting:"We were reviewing the agenda when the call started.",
        hotel:"We were speaking to the guest when housekeeping arrived."
      }[sc]||"I was updating the system when it crashed.")
    },
    setting:{
      name:"Past Continuous",
      form:"was/were + V-ing",
      when:"Set the scene (what was happening at a specific time).",
      signals:["at 3 p.m.","all afternoon","all morning","at that time"],
      example:(sc)=>({
        shipping:"At 3 p.m., we were waiting for confirmation.",
        it:"At 9 a.m., I was checking the logs.",
        meeting:"At the start, we were talking about priorities.",
        hotel:"All morning, we were preparing the rooms."
      }[sc]||"At 3 p.m., we were waiting for confirmation.")
    },
    polite:{
      name:"Past Continuous (polite softening)",
      form:"I was wondering / I was hoping",
      when:"Softer/politer in emails and calls.",
      signals:["I was wondering if…","I was hoping you could…"],
      example:(sc)=>({
        shipping:"I was wondering if you could confirm the delivery date.",
        it:"I was hoping you could try restarting the system.",
        meeting:"I was wondering if we could move the meeting to Friday.",
        hotel:"I was hoping we could offer you a room change."
      }[sc]||"I was wondering if you could confirm.")
    }
  },
  buildChoice: (level, sc) => {
    const pool=[];
    const push=(stem, options, answer, explain)=>pool.push({stem, options, answer, explain});
    push("“We ____ the stock when the client called.”", ["checked","were checking","have checked"], 1, "Background action → Past Continuous.");
    push("“I ____ a test when the error appeared.”", ["ran","was running","have run"], 1, "was/were + V-ing for background.");
    push("“At 3 p.m., we ____ for confirmation.”", ["waited","were waiting","have waited"], 1, "Specific time + in progress → Past Continuous.");
    push("“We were preparing the shipment when we ____ a missing part.”", ["noticed","were noticing","have noticed"], 0, "Interrupting short action → Past Simple.");
    push("Choose: “They ____ (work) at that time.”", ["were working","worked","have worked"], 0, "was/were + V-ing.");
    push("Polite: “I was ____ if you could confirm.”", ["wondering","wonder","wondered"], 0, "I was wondering…");
    if(sc==="meeting"){
      push("“We ____ the deadline when new data arrived.”", ["discussed","were discussing","have discussed"], 1, "Background action → Past Continuous.");
      push("“The call ____ while we were reviewing the agenda.”", ["started","was starting","has started"], 0, "Short event → Past Simple.");
    }else if(sc==="shipping"){
      push("“We ____ the shipment when we noticed the issue.”", ["were preparing","prepared","have prepared"], 0, "In progress → Past Continuous.");
      push("“Suddenly, the client ____.”", ["called","was calling","has called"], 0, "Suddenly = short event → Past Simple.");
    }else if(sc==="it"){
      push("“I ____ the system when it crashed.”", ["was updating","updated","have updated"], 0, "In progress → Past Continuous.");
      push("“Then it ____.”", ["crashed","was crashing","has crashed"], 0, "Then = short event → Past Simple.");
    }else{
      push("“We ____ the room when the guest arrived.”", ["were cleaning","cleaned","have cleaned"], 0, "Background → Past Continuous.");
      push("“The guest ____ at reception at that time.”", ["waited","was waiting","has waited"], 1, "Background at that time → Past Continuous.");
    }
    return pool;
  },
  buildFixIt: (level, sc) => {
    const pool=[];
    const add=(bad, good, why, hint)=>pool.push({bad, good, why, hint});
    add("We was checking the stock when the client called.","We were checking the stock when the client called.","With 'we', use were.","I was / you were / we were / they were.");
    add("I were running a test when the error appeared.","I was running a test when the error appeared.","With 'I', use was.","I was …");
    add("We were prepare the shipment when we noticed a missing part.","We were preparing the shipment when we noticed a missing part.","Past Continuous needs V-ing.","were + preparing.");
    add("We were cleaning the room when the guest was arrived.","We were cleaning the room when the guest arrived.","Interrupting action uses Past Simple.","Use arrived (Past Simple).");
    add("I was wonder if you could confirm.","I was wondering if you could confirm.","Polite form is 'was wondering'.","Add -ing: wondering.");
    return pool;
  },
  buildSpeakWrite: (level, sc) => {
    const speak = ({
      shipping:"Speak (60–90s): Describe what you were doing when the problem happened.\nUse 2 sentences with “was/were … when …”.",
      it:"Speak: Explain what you were doing when the error appeared.\nUse Past Continuous + Past Simple.",
      meeting:"Speak: Set the scene.\nUse Past Continuous for background + Past Simple for events.",
      hotel:"Speak: Describe what was happening when the guest arrived/complained."
    }[sc]||"Speak: Use was/were + V-ing for background.");
    const write = ({
      shipping:"Write an email describing the moment the issue happened.\nInclude: “We were … when …” + polite request (I was wondering…).",
      it:"Write an IT update.\nInclude: background + what happened + next step.",
      meeting:"Write a short recap.\nInclude: background + event + decision.",
      hotel:"Write a response.\nInclude: background + apology + action."
    }[sc]||"Write an email using Past Continuous.");
    const chips = [
      "Subject: Quick update",
      "We were checking the stock when the client called.",
      "I was running a test when the error appeared.",
      "At 3 p.m., we were waiting for confirmation.",
      "I was wondering if you could confirm the deadline.",
      "Then we sent an update to the client."
    ];
    return { speak, write, chips };
  },
  writeChecklist: [
    {id:"subject",label:"Subject line",tip:"Subject: Quick update"},
    {id:"pc",label:"Past Continuous",tip:"was/were + V-ing"},
    {id:"when",label:"While/when structure",tip:"… when … / while …"},
    {id:"ps",label:"Interrupting Past Simple",tip:"called / arrived / noticed"},
    {id:"polite",label:"Polite softening",tip:"I was wondering… (B1/B2)"}
  ],
  checkWriting: (text, level) => {
    const t=(text||"");
    const pc = /\b(was|were)\b\s+\w+ing\b/i.test(t);
    const when = /(when|while|at \d{1,2}(:\d{2})?|at that time|all morning|all afternoon)/i.test(t);
    const ps = /\b(called|arrived|noticed|started|crashed|sent|received)\b/i.test(t) || /\b\w+ed\b/i.test(t);
    const polite = /(i was wondering|i was hoping)/i.test(t);
    return {
      subject: /subject:/i.test(t),
      pc,
      when,
      ps,
      polite: (level==="a2") ? true : polite
    };
  },
  needChecklist: (level)=> (level==="a2" ? 3 : 4)
};


/* SpeakEasyTisha • Tense Drill Packs — engine (fixed load order) */
(() => {
  "use strict";
  const PACK = window.TENSE_PACK;
  if(!PACK){ console.error("TENSE_PACK missing"); return; }

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const state = { seed: Math.floor(Math.random()*1e9), accent:"US", score:{c:0,t:0}, timer:{id:null,t:0} };

  function rand(){ const x = Math.sin(state.seed++)*10000; return x - Math.floor(x); }
  function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function lvl(){ return $("#level").value; }
  function scenario(){ return $("#scenario").value; }
  function addScore(c,t){ state.score.c+=c; state.score.t+=t; $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`; updateProgress(); }

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
    if(!speechSupported()){ alert("TTS not supported here. Please read aloud."); return; }
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

  // MCQ
  function renderMCQ(container, questions){
    container.innerHTML=""; const answered=new Set();
    questions.forEach((q,qi)=>{
      const el=document.createElement("div"); el.className="q";
      el.innerHTML=`<div class="qStem">${q.stem}</div><div class="opt"></div><div class="explain" hidden></div>`;
      const opt=$(".opt",el), exp=$(".explain",el);
      q.options.forEach((lab,oi)=>{
        const b=document.createElement("button"); b.type="button"; b.className="choice"; b.textContent=lab;
        b.addEventListener("click", ()=>{
          if(answered.has(qi)) return; answered.add(qi); addScore(0,1);
          const ok = (oi===q.answer);
          if(ok){ addScore(1,0); b.classList.add("is-correct"); }
          else{ b.classList.add("is-wrong"); const btns=$$(".choice",el); btns[q.answer].classList.add("is-correct"); }
          exp.hidden=false; exp.textContent=(ok?"✅ ":"❌ ")+q.explain;
        });
        opt.appendChild(b);
      });
      container.appendChild(el);
    });
  }

  function norm(s){ return (s||"").replace(/\s+/g," ").replace(/\u2019/g,"'").trim().toLowerCase(); }

  function renderMap(){
    const key=$("#mapSituation").value;
    const d=PACK.map[key];
    $("#mapOut").textContent=[`${d.name}`,`Form: ${d.form}`,`When: ${d.when}`,`Example: ${d.example(scenario())}`].join("\n");
    const box=$("#signalChips"); box.innerHTML="";
    (d.signals||[]).slice(0,12).forEach(t=>{
      const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t;
      b.addEventListener("click", ()=>speak(t, 1.0));
      box.appendChild(b);
    });
    $("#mapListenTxt").textContent=d.name;
  }

  function buildChoice(){
    const pool = PACK.buildChoice(lvl(), scenario()) || [];
    const qs = shuffle(pool).slice(0,10);
    renderMCQ($("#choiceQuiz"), qs);
  }

  function buildFixIt(){
    const pool = PACK.buildFixIt(lvl(), scenario()) || [];
    const items = shuffle(pool).slice(0,5);
    const wrap=$("#fixList"); wrap.innerHTML="";
    items.forEach((it,idx)=>{
      const row=document.createElement("div"); row.className="item";
      row.innerHTML=`
        <div class="itemTitle">Fix ${idx+1}</div>
        <div class="muted small">Problem sentence:</div>
        <div class="model">${it.bad}</div>
        <div class="muted small" style="margin-top:10px;">Write the corrected version:</div>
        <input class="input" data-fix="${idx}" placeholder="Type your corrected sentence…" />
        <div class="row row--end noPrint" style="margin-top:10px;">
          <button class="btn btn--tiny btn--primary" data-check="${idx}" type="button">Check</button>
          <button class="btn btn--tiny btn--ghost" data-show="${idx}" type="button">Show answer</button>
          <button class="btn btn--tiny btn--ghost" data-listen="${idx}" type="button">▶ Listen</button>
        </div>
        <div class="fb" id="fixFb${idx}" aria-live="polite"></div>`;
      wrap.appendChild(row);
    });

    wrap.onclick = (e)=>{
      const btn=e.target.closest("button"); if(!btn) return;
      const idx = btn.dataset.check ?? btn.dataset.show ?? btn.dataset.listen; if(idx==null) return;
      const it = items[Number(idx)];
      const inp = wrap.querySelector(`input[data-fix="${idx}"]`);
      const fb = wrap.querySelector(`#fixFb${idx}`);

      if(btn.dataset.listen!=null){ speak(it.good,1.0); return; }
      if(btn.dataset.show!=null){ fb.className="fb"; fb.textContent=`✅ Model: ${it.good}\nWhy: ${it.why}`; return; }

      addScore(0,1);
      const ok = norm(inp.value)===norm(it.good);
      if(ok){ fb.className="fb good"; fb.textContent=`✅ Correct.\nWhy: ${it.why}`; addScore(1,0); }
      else{ fb.className="fb bad"; fb.textContent=`❌ Not quite.\nHint: ${it.hint}`; }
    };
  }

  function insertAtCursor(textarea, text){
    textarea.focus();
    const start=textarea.selectionStart ?? textarea.value.length;
    const end=textarea.selectionEnd ?? textarea.value.length;
    const v=textarea.value;
    textarea.value = v.slice(0,start) + text + v.slice(end);
    const pos=start+text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
  }

  function renderChecklist(){
    $("#writeChecklist").innerHTML = PACK.writeChecklist.map(it=>`
      <label class="item" style="padding:10px;">
        <div class="row" style="align-items:flex-start;">
          <input type="checkbox" data-wck="${it.id}" style="width:18px;height:18px;margin-top:2px;" />
          <div><strong>${it.label}</strong><div class="muted small">${it.tip||""}</div></div>
        </div>
      </label>`).join("");
  }

  function renderSpeakWrite(){
    const sw = PACK.buildSpeakWrite(lvl(), scenario());
    $("#speakPrompt").textContent = sw.speak;
    $("#writePrompt").textContent = sw.write;
    const box=$("#writeChips"); box.innerHTML="";
    (sw.chips||[]).forEach(t=>{
      const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t;
      b.onclick=()=>insertAtCursor($("#writeOut"), t+"\n");
      box.appendChild(b);
    });
    $("#writeFb").className="fb"; $("#writeFb").textContent="";
    $$("#writeChecklist input").forEach(x=>x.checked=false);
  }

  function checkWriting(){
    addScore(0,1);
    const text=($("#writeOut").value||"").trim();
    const checks=PACK.checkWriting(text, lvl());
    $$("#writeChecklist input").forEach(cb=>cb.checked = !!checks[cb.dataset.wck]);
    const need = PACK.needChecklist(lvl());
    const got = Object.values(checks).filter(Boolean).length;
    const fb=$("#writeFb");
    if(got>=need){ fb.className="fb good"; fb.textContent=`✅ Good. Checks: ${got}/${PACK.writeChecklist.length} (target ${need}).`; addScore(1,0); }
    else{ fb.className="fb bad"; fb.textContent=`⚠️ Improve. Checks: ${got}/${PACK.writeChecklist.length} (target ${need}).`; }
  }

  // Progress / completion
  function updateProgress(){
    const t = state.score.t || 0;
    const c = state.score.c || 0;
    const pct = t ? Math.round((c/t)*100) : 0;
    $("#progressPct").textContent = `${pct}%`;
    $("#progressBar").style.width = `${pct}%`;
    $("#bestScore").textContent = `${c} / ${t}`;
  }
  function loadCompletion(){
    const key = PACK.storageKey;
    const data = JSON.parse(localStorage.getItem(key) || "null");
    if(!data) return;
    $("#completeBadge").textContent = data.complete ? "✅ Completed" : "—";
    $("#completeBadge").className = data.complete ? "badge" : "badge";
  }
  function markComplete(){
    const t = state.score.t || 0;
    const c = state.score.c || 0;
    const pct = t ? (c/t) : 0;
    const ok = pct >= 0.8 && t >= 10; // simple rule
    const payload = { complete: ok, score: {c,t}, pct: Math.round(pct*100), when: new Date().toISOString() };
    localStorage.setItem(PACK.storageKey, JSON.stringify(payload));
    const fb=$("#completeFb");
    if(ok){
      fb.className="fb good";
      fb.textContent = `✅ Saved as completed (${payload.pct}%). This will show on your Past Tenses Clear page.`;
      $("#completeBadge").textContent="✅ Completed";
    }else{
      fb.className="fb bad";
      fb.textContent = `⚠️ Not saved as completed yet. Aim for 80%+ with at least 10 answers checked.`;
      $("#completeBadge").textContent="—";
    }
  }

  function newSet(quiet=false){
    stopSpeech(); stopTimer();
    state.seed=Math.floor(Math.random()*1e9);
    state.score={c:0,t:0}; $("#scoreTxt").textContent="0 / 0";
    renderChecklist(); renderMap(); buildChoice(); buildFixIt(); renderSpeakWrite();
    updateProgress();
    if(!quiet) alert("New set ready.");
  }

  function renderSuccessChips(){
    const box=$("#successChips"); if(!box) return;
    const all=new Set(); Object.values(PACK.map).forEach(m=>(m.signals||[]).forEach(s=>all.add(s)));
    const list=Array.from(all).slice(0,12);
    box.innerHTML="";
    list.forEach(t=>{
      const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t;
      b.onclick=()=>speak(t,1.0);
      box.appendChild(b);
    });
  }

  function wire(){
    $("#accentUS").onclick=()=>{ state.accent="US"; $("#accentUS").setAttribute("aria-pressed","true"); $("#accentUK").setAttribute("aria-pressed","false"); };
    $("#accentUK").onclick=()=>{ state.accent="UK"; $("#accentUK").setAttribute("aria-pressed","true"); $("#accentUS").setAttribute("aria-pressed","false"); };
    $("#resetAll").onclick=()=>location.reload();
    $("#printPage").onclick=()=>window.print();
    $("#newSet").onclick=()=>newSet(false);
    $("#mapShow").onclick=renderMap;
    $("#mapSituation").onchange=renderMap;
    $("#mapListen").onclick=()=>speak($("#mapOut").textContent||"",1.0);
    $("#newChoice").onclick=buildChoice;
    $("#newFix").onclick=buildFixIt;
    $("#newSW").onclick=renderSpeakWrite;
    $("#start60").onclick=()=>startTimer(60);
    $("#start90").onclick=()=>startTimer(90);
    $("#stopTimer").onclick=stopTimer;
    $("#speakListen").onclick=()=>speak($("#speakPrompt").textContent||"",1.0);
    $("#writeCheck").onclick=checkWriting;
    $("#writeClear").onclick=()=>{ $("#writeOut").value=""; $("#writeFb").textContent=""; $("#writeFb").className="fb"; $$("#writeChecklist input").forEach(x=>x.checked=false); };
    $("#writeListen").onclick=()=>speak($("#writeOut").value || $("#writePrompt").textContent || "",1.0);
    $("#markComplete").onclick=markComplete;
    ["level","scenario"].forEach(id => $("#"+id).onchange = ()=>newSet(true));
  }

  function init(){
    $("#packTitle").textContent = PACK.title;
    $("#packSub").textContent = PACK.sub;
    $("#rulesOut").textContent = PACK.rules.join("\n");
    $("#mapSituation").innerHTML = PACK.mapOptions.map(o=>`<option value="${o.key}">${o.label}</option>`).join("");
    $("#mapSituation").value = PACK.mapOptions[0].key;
    renderSuccessChips();
    wire();
    newSet(true);
    loadCompletion();
  }

  init();
})();