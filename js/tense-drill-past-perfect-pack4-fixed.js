
/* Pack definition: Past Perfect (fixed) */
window.TENSE_PACK = {
  storageKey: "SET_TENSE_PACK_PAST_PERFECT_v1",
  title: "Past Perfect — Drill Pack (Earlier Past Before Another Past)",
  sub: "Use Past Perfect to show the earlier past before another past event. Realistic VTest-style scenarios. B1→B2 (with A2 support).",
  rules: [
    "Past Perfect = EARLIER past (before another past event).",
    "Form: had + V3 (had sent / had arrived / had done).",
    "Typical structure: Past Perfect (earlier) + Past Simple (later).",
    "Signals: before, after, by the time, when, already (in a past context).",
    "Do NOT use Past Perfect for a simple sequence when the order is already obvious."
  ],
  mapOptions: [
    {key:"earlier", label:"Earlier past → later past (timeline)"},
    {key:"bytime", label:"By the time + Past Simple"},
    {key:"cause", label:"Cause / reason in a report (root cause)"},
    {key:"reported", label:"Reported recap (B2): said/had + V3"}
  ],
  map: {
    earlier:{
      name:"Past Perfect + Past Simple",
      form:"had + V3 (earlier) + Past Simple (later)",
      when:"You want to show which past action happened first.",
      signals:["before","after","when","already (past context)"],
      example:(sc)=>({
        shipping:"We had prepared the documents before the courier arrived.",
        it:"I had backed up the file before the system crashed.",
        meeting:"We had reviewed the agenda before the call started.",
        hotel:"We had checked the room before the guest complained."
      }[sc]||"We had prepared the documents before the courier arrived.")
    },
    bytime:{
      name:"By the time…",
      form:"By the time + Past Simple, Past Perfect",
      when:"Deadline in the past: one action was completed before a past moment.",
      signals:["by the time","when","already"],
      example:(sc)=>({
        shipping:"By the time we called, the shipment had already left the warehouse.",
        it:"By the time I arrived, the system had already restarted.",
        meeting:"By the time the meeting began, they had already made a decision.",
        hotel:"By the time we arrived, housekeeping had already finished."
      }[sc]||"By the time we called, the shipment had already left the warehouse.")
    },
    cause:{
      name:"Past Perfect (cause in reports)",
      form:"had + V3 (cause) → Past Simple (result)",
      when:"Write a short incident report: earlier cause → later consequence.",
      signals:["because","as a result","due to","after"],
      example:(sc)=>({
        shipping:"The delay happened because the supplier had sent the wrong part.",
        it:"The outage occurred because the server had stopped responding.",
        meeting:"The confusion happened because we had not clarified roles.",
        hotel:"The complaint escalated because the AC had stopped working."
      }[sc]||"The delay happened because the supplier had sent the wrong part.")
    },
    reported:{
      name:"Reported recap (B2)",
      form:"said/explained/confirmed + (that) + had + V3",
      when:"Meeting/call recap: report what someone said about an earlier past action.",
      signals:["said that","explained that","confirmed that","mentioned that"],
      example:(sc)=>({
        shipping:"The supplier confirmed that they had shipped the item on Tuesday.",
        it:"IT explained that they had applied a patch before the restart.",
        meeting:"She said they had already approved the budget last week.",
        hotel:"The manager explained that maintenance had checked the unit earlier."
      }[sc]||"The supplier confirmed that they had shipped the item on Tuesday.")
    }
  },
  buildChoice: (level, sc) => {
    const pool=[];
    const push=(stem, options, answer, explain)=>pool.push({stem, options, answer, explain});

    push("“We ____ the documents before the courier arrived.”", ["prepared","had prepared","were preparing"], 1, "Earlier past before another past → Past Perfect.");
    push("“By the time we called, the shipment ____ the warehouse.”", ["left","had left","was leaving"], 1, "By the time… earlier completion → had + V3.");
    push("“The system crashed because we ____ a backup.”", ["didn't make","hadn't made","weren't making"], 1, "Earlier cause (negative) → hadn't + V3.");
    push("“After we ____ the issue, we emailed the client.”", ["had found","found","were finding"], 0, "After + earlier action → Past Perfect is common in reports.");
    push("“We ____ the agenda before the call started.”", ["reviewed","had reviewed","were reviewing"], 1, "Earlier action completed first → Past Perfect.");
    push("Reported: “He said they ____ the invoice.”", ["paid","had paid","were paying"], 1, "Reported recap → had + V3.");

    // Traps
    push("Trap: “We met yesterday and agreed the plan.”", ["had met / had agreed","met / agreed","have met / have agreed"], 1, "Simple sequence with a finished time → Past Simple is enough.");
    push("Trap: “Yesterday, we had called the client.”", ["called","had called","have called"], 0, "If you say WHEN and there’s no second past event → Past Simple.");

    if(sc==="shipping"){
      push("“The supplier said they ____ the wrong part.”", ["sent","had sent","have sent"], 1, "Reported recap → had sent.");
      push("“By the time we updated the client, the courier ____.”", ["arrived","had arrived","was arriving"], 1, "Earlier completion → had arrived.");
    }else if(sc==="it"){
      push("“I ____ the file before the system crashed.”", ["saved","had saved","was saving"], 1, "Earlier past → had saved.");
      push("“The outage occurred because the server ____ responding.”", ["stopped","had stopped","was stopping"], 1, "Earlier cause → had stopped.");
    }else if(sc==="meeting"){
      push("“By the time the meeting began, they ____ a decision.”", ["made","had made","were making"], 1, "By the time… → had made.");
      push("“She explained that they ____ the budget.”", ["approved","had approved","were approving"], 1, "Reported recap → had approved.");
    }else{
      push("“We ____ the room before the guest complained.”", ["checked","had checked","were checking"], 1, "Earlier action → had checked.");
      push("“The manager explained that maintenance ____ earlier.”", ["checked","had checked","was checking"], 1, "Reported recap → had checked.");
    }

    if(level==="a2"){
      push("Form: “had + ____”", ["V2","V3","V-ing"], 1, "Past Perfect uses V3 (past participle).");
    }
    return pool;
  },
  buildFixIt: (level, sc) => {
    const pool=[];
    const add=(bad, good, why, hint)=>pool.push({bad, good, why, hint});
    add("Yesterday, we had called the client.","Yesterday, we called the client.","No second past event → Past Simple is enough.","Past Perfect needs two past moments.");
    add("We had went to the meeting before it started.","We had gone to the meeting before it started.","Use V3: gone (not went).","Past participle after had.");
    add("By the time we arrived, housekeeping already finished.","By the time we arrived, housekeeping had already finished.","By the time + earlier completion → had + V3.","Add had finished.");
    add("The system crashed because we didn't made a backup.","The system crashed because we hadn't made a backup.","Earlier cause (negative) → hadn't + V3.","Use hadn't made.");
    add("He said they paid the invoice before the call.","He said they had paid the invoice before the call.","Reported recap → had + V3.","said + had paid.");
    return pool;
  },
  buildSpeakWrite: (level, sc) => {
    const speak = ({
      shipping:"Speak (60–90s): Explain the delay with a clear timeline.\nUse: had + V3 (earlier) + Past Simple (later).",
      it:"Speak: Explain what you had done before the crash, then what happened.\nUse 2–3 'had' sentences.",
      meeting:"Speak: Summarise what happened in the meeting and what had happened before.\nUse 1 reported sentence (said they had…).",
      hotel:"Speak: Explain what had happened before the complaint, then the action you took."
    }[sc]||"Speak: Use Past Perfect to show earlier past before another past event.");
    const write = ({
      shipping:"Write an incident-style email.\nRequired: Subject + timeline (had… before…) + cause + next step.",
      it:"Write an IT incident update.\nRequired: Subject + what had happened + what happened + next step.",
      meeting:"Write a meeting recap.\nRequired: Subject + decisions + what had been done before the call.",
      hotel:"Write a service recovery email.\nRequired: apology + what had happened + action taken."
    }[sc]||"Write an email using Past Perfect for the earlier past.");
    const chips = [
      "Subject: Incident update",
      "We had prepared the documents before the courier arrived.",
      "By the time we called, the shipment had already left the warehouse.",
      "The issue happened because we hadn't received confirmation.",
      "The supplier confirmed that they had shipped the item on Tuesday.",
      "We will follow up today and send a new ETA."
    ];
    return { speak, write, chips };
  },
  writeChecklist: [
    {id:"subject",label:"Subject line",tip:"Subject: Incident update"},
    {id:"had",label:"Past Perfect form",tip:"had / hadn’t + V3"},
    {id:"twoPast",label:"Two past moments",tip:"before / by the time / when + past simple"},
    {id:"cause",label:"Cause phrase",tip:"because / due to / as a result"},
    {id:"close",label:"Polite close",tip:"Best regards / Thank you"}
  ],
  checkWriting: (text, level) => {
    const t=(text||"");
    const had = /\b(had|hadn't)\b\s+\w+(ed|en)\b/i.test(t) ||
                /\b(had|hadn't)\b\s+(been|done|gone|sent|made|seen|taken|given|come|left|paid|found|put|read|written|known)\b/i.test(t);
    const twoPast = /(before|by the time|when|after)\b/i.test(t) && /\b(called|arrived|started|crashed|sent|met|checked|found|updated|began|happened)\b/i.test(t);
    return {
      subject: /subject:/i.test(t),
      had,
      twoPast: (level==="a2") ? true : twoPast,
      cause: /(because|due to|as a result|therefore)/i.test(t),
      close: /(best regards|kind regards|sincerely|thank you)/i.test(t)
    };
  },
  needChecklist: (level)=> (level==="a2" ? 2 : 4)
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
    $("#completeBadge").className = "badge";
  }
  function markComplete(){
    const t = state.score.t || 0;
    const c = state.score.c || 0;
    const pct = t ? (c/t) : 0;
    const ok = pct >= 0.8 && t >= 10;
    const payload = { complete: ok, score: {c,t}, pct: Math.round(pct*100), when: new Date().toISOString() };
    localStorage.setItem(PACK.storageKey, JSON.stringify(payload));
    const fb=$("#completeFb");
    if(ok){
      fb.className="fb good";
      fb.textContent = `✅ Saved as completed (${payload.pct}%).`;
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
    $("#writeListen").onclick=()=>speak($("#writeOut").value || $("#writePrompt").textContent || "", 1.0);
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