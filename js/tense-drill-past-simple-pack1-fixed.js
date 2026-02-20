
/* Pack definition: Past Simple (fixed) */
window.TENSE_PACK = {
  storageKey: "SET_TENSE_PACK_PAST_SIMPLE_v1",
  title: "Past Simple — Drill Pack (Most Common)",
  sub: "Finished actions in the past (with time). Realistic VTest-style scenarios. A2→B2.",
  rules: [
    "Past Simple = finished action in the past.",
    "Use it when you can answer: WHEN? (yesterday / last week / in 2024 / at 9:00).",
    "Form: V2 (worked / called) or irregular (went / sent / did).",
    "Questions/negatives use DID: Did you call? / I didn’t call."
  ],
  mapOptions: [
    {key:"finished", label:"Finished action (yesterday / last week)"},
    {key:"sequence", label:"Sequence of actions (first… then…)"},
    {key:"questions", label:"Questions + negatives (did/didn't)"},
    {key:"specifictime", label:"Specific time (at 9:00 / on Monday)"}
  ],
  map: {
    finished:{
      name:"Past Simple",
      form:"V2 (worked / sent / went)",
      when:"Finished action in the past + time is clear or implied.",
      signals:["yesterday","last week","two days ago","in 2024","this morning","on Monday"],
      example:(sc)=>({
        shipping:"We sent the update yesterday.",
        it:"I restarted the system this morning.",
        meeting:"We agreed on the next steps last Friday.",
        hotel:"We checked the room yesterday evening."
      }[sc]||"We sent the update yesterday.")
    },
    sequence:{
      name:"Past Simple",
      form:"First + V2, then + V2",
      when:"Tell a story in order (events one after another).",
      signals:["first","then","after that","finally","later"],
      example:(sc)=>({
        shipping:"First we called the supplier, then we emailed the client.",
        it:"First I ran the test, then I reported the result.",
        meeting:"First we reviewed the agenda, then we decided on actions.",
        hotel:"First we checked the room, then we offered a solution."
      }[sc]||"First we called, then we emailed.")
    },
    questions:{
      name:"Past Simple (questions/negatives)",
      form:"Did + base verb / didn’t + base verb",
      when:"Ask about past events or say something did NOT happen.",
      signals:["Did you…?","When did…?","I didn’t…","We didn’t…"],
      example:(sc)=>({
        shipping:"Did you receive the update? We didn’t receive confirmation.",
        it:"Did it work after the restart? It didn’t work at first.",
        meeting:"Did we confirm the deadline? We didn’t confirm it yet.",
        hotel:"Did you speak to the guest? I didn’t speak to them earlier."
      }[sc]||"Did you receive the update?")
    },
    specifictime:{
      name:"Past Simple",
      form:"V2 + time phrase",
      when:"You mention a specific time/day/date.",
      signals:["at 9:00","on Tuesday","on 12 January","in May","at lunchtime"],
      example:(sc)=>({
        shipping:"We called the supplier at 9:00.",
        it:"I escalated the ticket on Tuesday.",
        meeting:"We started the call at 3 p.m.",
        hotel:"We sent housekeeping at lunchtime."
      }[sc]||"We called the supplier at 9:00.")
    }
  },
  buildChoice: (level, sc) => {
    const pool=[];
    const push=(stem, options, answer, explain)=>pool.push({stem, options, answer, explain});
    push("“We ____ the client yesterday.”", ["called","have called","were calling"], 0, "Yesterday = finished past → Past Simple.");
    push("“They ____ the invoice last week.”", ["paid","have paid","were paying"], 0, "Last week = finished past → Past Simple.");
    push("“First we ____ the supplier, then we ____ the client.”", ["called / emailed","have called / have emailed","were calling / were emailing"], 0, "Sequence of actions → Past Simple.");
    push("Question: “When ____ you ____ the update?”", ["did / send","have / sent","were / sending"], 0, "Past question uses DID + base verb.");
    push("Negative: “We ____ receive confirmation.”", ["didn’t","haven’t","weren’t"], 0, "Past negative uses didn’t + base verb.");
    push("“We ____ at 3 p.m. on Monday.”", ["met","have met","were meeting"], 0, "Specific time/day → Past Simple.");
    if(sc==="shipping"){
      push("“We ____ the tracking number this morning.”", ["sent","have sent","were sending"], 0, "This morning (finished) → Past Simple.");
      push("“Did you ____ the update?”", ["receive","received","have received"], 0, "Did + base verb.");
    }else if(sc==="it"){
      push("“I ____ the system at 9:00.”", ["restarted","have restarted","was restarting"], 0, "Specific time → Past Simple.");
      push("“It ____ after the restart.”", ["worked","has worked","was working"], 0, "Finished past result → Past Simple.");
    }else if(sc==="meeting"){
      push("“We ____ the agenda first.”", ["reviewed","have reviewed","were reviewing"], 0, "Sequence → Past Simple.");
      push("“Did we ____ the deadline?”", ["confirm","confirmed","have confirmed"], 0, "Did + base verb.");
    }else{
      push("“We ____ the room yesterday evening.”", ["checked","have checked","were checking"], 0, "Time given → Past Simple.");
      push("“We didn’t ____ the guest earlier.”", ["call","called","have called"], 0, "didn’t + base verb.");
    }
    return pool;
  },
  buildFixIt: (level, sc) => {
    const pool=[];
    const add=(bad, good, why, hint)=>pool.push({bad, good, why, hint});
    add("We have called the client yesterday.","We called the client yesterday.","Yesterday = finished past → Past Simple.","If you say WHEN, use Past Simple.");
    add("Did you received the update?","Did you receive the update?","After DID, use the base verb.","DID + receive (base).");
    add("We didn't sent the file.","We didn't send the file.","After didn't, use the base verb.","didn't + send.");
    add("First we have checked the stock, then we called the supplier.","First we checked the stock, then we called the supplier.","Sequence in the past → Past Simple.","Tell the story: checked → called.");
    add("We met on Monday and we have agreed the plan.","We met on Monday and we agreed the plan.","On Monday = finished time → Past Simple.","Time phrase → Past Simple.");
    return pool;
  },
  buildSpeakWrite: (level, sc) => {
    const speak = ({
      shipping:"Speak (60–90s): Tell what happened yesterday and what you did.\nUse Past Simple + time phrases.",
      it:"Speak: Explain the IT problem and the steps you took.\nUse Past Simple for each step (first… then…).",
      meeting:"Speak: Summarise meeting decisions.\nUse Past Simple + time (last Friday / at 3 p.m.).",
      hotel:"Speak: Explain the complaint and what you did.\nUse Past Simple + sequence."
    }[sc]||"Speak: Use Past Simple to tell finished events with time.");
    const write = ({
      shipping:"Write an email update about a delay.\nRequired: Subject + Past Simple with time + next step.",
      it:"Write an IT ticket update.\nRequired: Subject + what you did (Past Simple) + next step.",
      meeting:"Write a meeting recap.\nRequired: Subject + decisions (Past Simple) + action list.",
      hotel:"Write a reply to a complaint.\nRequired: apology + what you did (Past Simple) + next step."
    }[sc]||"Write an exam-style email using Past Simple.");
    const chips = [
      "Subject: Quick update",
      "Yesterday, we contacted the client.",
      "At 9:00, we called the supplier.",
      "First we checked the issue, then we sent an update.",
      "We didn’t receive confirmation.",
      "We will follow up tomorrow."
    ];
    return { speak, write, chips };
  },
  writeChecklist: [
    {id:"subject",label:"Subject line",tip:"Start with “Subject:”"},
    {id:"time",label:"Time phrase",tip:"yesterday / last week / at 9:00 / on Monday"},
    {id:"ps",label:"Past Simple verbs (V2)",tip:"called / sent / went / did"},
    {id:"sequence",label:"Sequence connectors",tip:"first, then, after that"},
    {id:"close",label:"Polite close",tip:"Best regards / Kind regards"}
  ],
  checkWriting: (text, level) => {
    const t=(text||"");
    return {
      subject: /subject:/i.test(t),
      time: /(yesterday|last|ago|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|at \d{1,2}(:\d{2})?|in \d{4}|this morning|yesterday evening)/i.test(t),
      ps: /\b(did|went|sent|made|saw|took|gave|came|met|paid)\b/i.test(t) || /\b\w+ed\b/i.test(t),
      sequence: /(first|then|after that|finally)/i.test(t),
      close: /(best regards|kind regards|sincerely|thank you)/i.test(t)
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