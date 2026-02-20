
/* Pack definition: Present Perfect (fixed) */
window.TENSE_PACK = {
  storageKey: "SET_TENSE_PACK_PRESENT_PERFECT_v1",
  title: "Present Perfect — Drill Pack (Status / Result Now)",
  sub: "Updates and results now (already/just/yet/since/for). Realistic scenarios. A2→B2.",
  rules: [
    "Present Perfect = past action + result NOW (status/update).",
    "Form: have/has + V3 (have sent / has arrived).",
    "Signals: already, just, yet, since, for, so far, this week.",
    "If you say a finished time (yesterday / last week), use Past Simple."
  ],
  mapOptions: [
    {key:"resultnow", label:"Update / result now (already / just / yet)"},
    {key:"sincefor", label:"Since / for (unfinished time)"},
    {key:"thisweek", label:"Unfinished time (this week / today)"},
    {key:"experience", label:"Experience (ever / never / before)"}
  ],
  map: {
    resultnow:{
      name:"Present Perfect",
      form:"have/has + V3",
      when:"Updates: action happened and the result matters now.",
      signals:["already","just","yet","so far"],
      example:(sc)=>({
        shipping:"We have sent the tracking number already.",
        it:"We have fixed the issue, and it works now.",
        meeting:"We have decided to move the meeting.",
        hotel:"We have offered a solution, and the guest is satisfied."
      }[sc]||"We have sent the tracking number already.")
    },
    sincefor:{
      name:"Present Perfect",
      form:"have/has + V3 + since/for",
      when:"Started in the past and continues now.",
      signals:["since Monday","for two days","since 9 a.m.","for a week"],
      example:(sc)=>({
        shipping:"The shipment has been delayed since Monday.",
        it:"The system has been unstable for two days.",
        meeting:"We have worked on this topic since January.",
        hotel:"We have had complaints for a week."
      }[sc]||"The shipment has been delayed since Monday.")
    },
    thisweek:{
      name:"Present Perfect",
      form:"have/has + V3",
      when:"Unfinished time: today / this week / this month.",
      signals:["today","this week","this month","this year"],
      example:(sc)=>({
        shipping:"We have contacted the supplier twice this week.",
        it:"I have checked the logs today.",
        meeting:"We have had three meetings this month.",
        hotel:"We have improved the process this year."
      }[sc]||"I have checked the logs today.")
    },
    experience:{
      name:"Present Perfect (experience)",
      form:"have/has + V3",
      when:"Experience without specific time (ever/never/before).",
      signals:["ever","never","before","many times","recently"],
      example:(sc)=>({
        shipping:"We have handled similar delays before.",
        it:"I have seen this error many times.",
        meeting:"We have worked with this client before.",
        hotel:"We have received similar feedback before."
      }[sc]||"We have handled similar delays before.")
    }
  },
  buildChoice: (level, sc) => {
    const pool=[];
    const push=(stem, options, answer, explain)=>pool.push({stem, options, answer, explain});
    push("“We ____ the update already.”", ["sent","have sent","were sending"], 1, "Already + update now → Present Perfect.");
    push("“Have you ____ the email yet?”", ["send","sent","sending"], 1, "Have + V3.");
    push("“We ____ the issue. It works now.”", ["fixed","have fixed","were fixing"], 1, "Result now → Present Perfect.");
    push("“We ____ here since Monday.”", ["worked","have worked","were working"], 1, "Since + unfinished time → Present Perfect.");
    push("“I ____ the logs today.”", ["checked","have checked","was checking"], 1, "Today unfinished → Present Perfect.");
    push("“We ____ this problem before.”", ["saw","have seen","were seeing"], 1, "Before (experience) → Present Perfect.");
    push("Trap: “We ____ the client yesterday.”", ["called","have called","were calling"], 0, "Yesterday = finished time → Past Simple.");
    if(sc==="shipping"){
      push("“The shipment ____ delayed for two days.”", ["is","has been","was"], 1, "For + duration → Present Perfect.");
      push("“We ____ the supplier twice this week.”", ["contacted","have contacted","were contacting"], 1, "This week unfinished → Present Perfect.");
    }else if(sc==="it"){
      push("“The system ____ unstable since 9 a.m.”", ["was","has been","is"], 1, "Since + continues now → Present Perfect.");
      push("“I ____ this error many times.”", ["saw","have seen","was seeing"], 1, "Experience → Present Perfect.");
    }else if(sc==="meeting"){
      push("“We ____ to move the meeting.”", ["decided","have decided","were deciding"], 1, "Update decision now → Present Perfect.");
      push("“We ____ three meetings this month.”", ["had","have had","were having"], 1, "This month unfinished → Present Perfect.");
    }else{
      push("“We ____ a solution already.”", ["offered","have offered","were offering"], 1, "Already → Present Perfect.");
      push("“We ____ similar feedback before.”", ["received","have received","were receiving"], 1, "Experience → Present Perfect.");
    }
    return pool;
  },
  buildFixIt: (level, sc) => {
    const pool=[];
    const add=(bad, good, why, hint)=>pool.push({bad, good, why, hint});
    add("We called the client already.","We have called the client already.","Already + update now → Present Perfect.","Use have/has + V3 for updates.");
    add("I have checked the logs yesterday.","I checked the logs yesterday.","Yesterday = finished time → Past Simple.","If you say WHEN, use Past Simple.");
    add("Have you send the email yet?","Have you sent the email yet?","Have + V3.","Have + sent (V3).");
    add("We have worked here for two years yesterday.","We have worked here for two years.","For + duration until now → no finished time.","Remove 'yesterday'.");
    add("We didn't fixed the issue yet.","We haven't fixed the issue yet.","Yet → Present Perfect negative: haven't + V3.","Use haven't/hasn't.");
    return pool;
  },
  buildSpeakWrite: (level, sc) => {
    const speak = ({
      shipping:"Speak (60–90s): Give a status update.\nUse Present Perfect with already/just/yet.",
      it:"Speak: Explain the current status.\nUse Present Perfect: We have… / It has…",
      meeting:"Speak: Give the update now.\nUse Present Perfect for decisions/results.",
      hotel:"Speak: Explain what has been done and the result now.\nUse Present Perfect."
    }[sc]||"Speak: Use Present Perfect for updates (result now).");
    const write = ({
      shipping:"Write an email update.\nRequired: Subject + Present Perfect + next step.",
      it:"Write an IT status update.\nRequired: Present Perfect + request confirmation.",
      meeting:"Write a quick update.\nRequired: Present Perfect decision + next step.",
      hotel:"Write a service recovery email.\nRequired: Present Perfect actions + result now."
    }[sc]||"Write an update using Present Perfect.");
    const chips = [
      "Subject: Status update",
      "We have already sent the tracking number.",
      "We have just received confirmation.",
      "We haven’t received a reply yet.",
      "The system has been unstable since 9 a.m.",
      "We have handled similar issues before."
    ];
    return { speak, write, chips };
  },
  writeChecklist: [
    {id:"subject",label:"Subject line",tip:"Subject: Status update"},
    {id:"pp",label:"Present Perfect forms",tip:"have/has + V3"},
    {id:"signal",label:"Signal word",tip:"already / just / yet / since / for"},
    {id:"now",label:"Result now (status)",tip:"works now / update / currently"},
    {id:"close",label:"Polite close",tip:"Best regards / Thank you"}
  ],
  checkWriting: (text, level) => {
    const t=(text||"");
    const hasPP = /\b(have|has|haven't|hasn't)\b\s+\w+(ed|en)\b/i.test(t) ||
                  /\b(have|has|haven't|hasn't)\b\s+(gone|done|sent|made|seen|taken|given|come|been)\b/i.test(t);
    const finishedTime = /(yesterday|last week|two days ago|in \d{4})/i.test(t);
    const ppWithFinished = finishedTime && /\b(have|has)\b/i.test(t);
    return {
      subject: /subject:/i.test(t),
      pp: hasPP && !ppWithFinished,
      signal: /(already|just|yet|since|for|so far|this week|today)/i.test(t),
      now: /(now|currently|status|update|at the moment)/i.test(t) || true,
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