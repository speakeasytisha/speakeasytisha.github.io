(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const state = {
    seed: Math.floor(Math.random()*1e9),
    accent: "US",
    score: {c:0,t:0},
    timer: {id:null,t:0},
    selectedLeft: null,
    selectedRight: null,
    matchKey: null,
    tapPicked: [],
  };

  function rand(){ const x = Math.sin(state.seed++)*10000; return x - Math.floor(x); }
  function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function lvl(){ return $("#level").value; }
  function allowPPerf(){ return $("#pperfToggle").checked; }
  function addScore(c,t){
    state.score.c += c; state.score.t += t;
    $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
    const pct = state.score.t ? Math.round((state.score.c/state.score.t)*100) : 0;
    $("#progressPct").textContent = `${pct}%`;
    $("#progressBar").style.width = `${pct}%`;
  }

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

  // Grammar
  const GRAMMAR = [
    { id:"ps", icon:"✅", name:"Past Simple", form:"V2 / did + base", 
      useEN:"Finished past. You can answer: WHEN? (yesterday, last week, at 9:00).",
      useFR:"Passé terminé. On peut répondre : QUAND ? (hier, la semaine dernière, à 9h).",
      keywords:["yesterday","last…","ago","in 2024","at 9:00","on Monday"],
      ex:"Yesterday, I fixed a vending machine on site."
    },
    { id:"pc", icon:"⏳", name:"Past Continuous", form:"was/were + V‑ing",
      useEN:"Background action (in progress) + interruption (when + Past Simple).",
      useFR:"Action en cours dans le passé + interruption (when + Past Simple).",
      keywords:["while","when","at that moment","as"],
      ex:"I was checking the coin mechanism when the machine stopped dispensing."
    },
    { id:"pp", icon:"📌", name:"Present Perfect", form:"have/has + V3",
      useEN:"Update now / result now. (No finished time like yesterday.)",
      useFR:"Bilan / résultat maintenant. (Pas de repère terminé type 'yesterday').",
      keywords:["already","just","yet","since","for","recently"],
      ex:"We have reconfigured the machine, so it works again now."
    },
    { id:"pperf", icon:"🧩", name:"Past Perfect (B2 add‑on)", form:"had + V3",
      useEN:"Earlier past BEFORE another past event (timeline clarity).",
      useFR:"Antériorité : action passée AVANT une autre action passée.",
      keywords:["before","by the time","after","already (past context)"],
      ex:"We had run out of spare parts before I arrived on site."
    }
  ];

  const KEYFRAME = {
    a2: "A2: Tell the story in Past Simple. Add 1 Past Continuous sentence if possible.",
    b1: "B1: Past Simple + Past Continuous (background) + Present Perfect (final update).",
    b2: "B2: Add Past Perfect only to show the earlier cause before a later past action."
  };

  function renderGrammar(){
    $("#grammarHint").textContent = KEYFRAME[lvl()];
    const fr = $("#frToggle").checked;
    const cards = GRAMMAR.filter(g => g.id !== "pperf" || allowPPerf());
    const box=$("#grammarCards"); box.innerHTML="";
    cards.forEach(g=>{
      const el=document.createElement("div");
      el.className="panel";
      el.innerHTML = `
        <div class="panelTitle">${g.icon} ${g.name}</div>
        <div class="muted small"><strong>Form:</strong> ${g.form}</div>
        <div class="muted small" style="margin-top:8px;"><strong>When to use:</strong> ${fr?g.useFR:g.useEN}</div>
        <div class="muted small" style="margin-top:8px;"><strong>Key words:</strong></div>
        <div class="chips" style="margin-top:6px;">${g.keywords.map(k=>`<button type="button" class="chip" data-say="${k}">${k}</button>`).join("")}</div>
        <div class="muted small" style="margin-top:10px;"><strong>Vending example:</strong></div>
        <div class="model">${g.ex}</div>
        <div class="row noPrint" style="margin-top:10px;">
          <button class="btn btn--tiny btn--ghost" data-listen="${g.id}" type="button">▶ Listen</button>
          <button class="btn btn--tiny btn--primary" data-mini="${g.id}" type="button">Mini drill</button>
        </div>
        <div class="fb" id="miniFb_${g.id}" aria-live="polite"></div>
      `;
      box.appendChild(el);
    });

    box.onclick=(e)=>{
      const chip=e.target.closest(".chip");
      if(chip && chip.dataset.say){ speak(chip.dataset.say,1.0); return; }
      const listen=e.target.closest("button[data-listen]");
      if(listen){
        const g=GRAMMAR.find(x=>x.id===listen.dataset.listen);
        if(g) speak(g.ex,1.0);
        return;
      }
      const mini=e.target.closest("button[data-mini]");
      if(mini){ runMiniDrill(mini.dataset.mini); return; }
    };
  }

  function runMiniDrill(id){
    const fb=$("#miniFb_"+id);
    const pool = {
      ps: [
        {stem:"Yesterday, I ____ the machine.", opts:["fix","fixed","have fixed"], ans:1, why:"Yesterday → Past Simple."},
        {stem:"Past question:", opts:["did + base","have + V3","was + V-ing"], ans:0, why:"Did + base verb."},
        {stem:"Past Simple keyword:", opts:["already","yesterday","since"], ans:1, why:"Finished time."}
      ],
      pc: [
        {stem:"I ____ the card reader when it failed.", opts:["checked","was checking","have checked"], ans:1, why:"Background action."},
        {stem:"Form:", opts:["was/were + V-ing","have/has + V3","had + V3"], ans:0, why:"Past Continuous form."},
        {stem:"Signal word:", opts:["while","yet","ago"], ans:0, why:"While → in progress."}
      ],
      pp: [
        {stem:"We ____ a workaround, so it works now.", opts:["fixed","have implemented","were implementing"], ans:1, why:"Result now → Present Perfect."},
        {stem:"Form:", opts:["did + base","have/has + V3","was/were + ing"], ans:1, why:"Present Perfect."},
        {stem:"Signal word:", opts:["last week","already","at 9:00"], ans:1, why:"Already → update."}
      ],
      pperf: [
        {stem:"We ____ out of spare parts before I arrived.", opts:["ran","had run","have run"], ans:1, why:"Earlier past before another past."},
        {stem:"Form:", opts:["had + V3","have + V3","was + V-ing"], ans:0, why:"Past Perfect form."},
        {stem:"Signal phrase:", opts:["by the time","yesterday","since"], ans:0, why:"Timeline cue."}
      ]
    }[id] || [];

    fb.className="fb";
    fb.innerHTML = "";
    const quiz=document.createElement("div"); quiz.className="quiz";
    const answered=new Set();

    pool.forEach((q,qi)=>{
      const el=document.createElement("div"); el.className="q";
      el.innerHTML=`<div class="qStem">${q.stem}</div><div class="opt"></div><div class="explain" hidden></div>`;
      const opt=$(".opt",el), exp=$(".explain",el);
      q.opts.forEach((lab,oi)=>{
        const b=document.createElement("button"); b.type="button"; b.className="choice"; b.textContent=lab;
        b.onclick=()=>{
          if(answered.has(qi)) return;
          answered.add(qi);
          addScore(0,1);
          const ok = (oi===q.ans);
          if(ok){ addScore(1,0); b.classList.add("is-correct"); }
          else{ b.classList.add("is-wrong"); $$(".choice",el)[q.ans].classList.add("is-correct"); }
          exp.hidden=false; exp.textContent=(ok?"✅ ":"❌ ")+q.why;
        };
        opt.appendChild(b);
      });
      quiz.appendChild(el);
    });

    fb.appendChild(quiz);
  }

  // Vocab
  const VOCAB = {
    parts: [
      ["spiral","the coil that pushes the product forward"],
      ["column","a vertical selection section"],
      ["dispensing motor","the motor that turns the spiral"],
      ["coin mechanism","coin acceptor (takes coins)"],
      ["bill validator","takes banknotes"],
      ["card reader","contactless / card payments"],
      ["control board","main electronic board"],
      ["display","screen / user interface"]
    ],
    problems: [
      ["jammed","blocked / stuck (product doesn’t fall)"],
      ["out of stock","no products available"],
      ["faulty","not working correctly"],
      ["out of order","not usable by customers"],
      ["refund","money returned to customer"],
      ["error message","message shown on the screen"],
      ["payment failure","card/coin/bill not accepted"],
      ["power outage","no electricity"]
    ],
    actions: [
      ["reset","restart the machine"],
      ["disable a selection","block a faulty column"],
      ["reconfigure","change settings / mode"],
      ["replace a part","install a new component"],
      ["order a spare part","request a replacement component"],
      ["test dispensing","run a test vend"],
      ["log the intervention","write what you did (traceability)"],
      ["follow up","contact the client later"]
    ],
    results: [
      ["avoid downtime","prevent the machine from stopping"],
      ["reduced capacity","works but limited output"],
      ["service continuity","the site can keep operating"],
      ["fewer refunds","less money returned to customers"],
      ["faster troubleshooting","the next tech understands the history"]
    ]
  };

  function renderVocab(){
    const cat=$("#vocabCat").value;
    const list=VOCAB[cat] || [];
    const chips=$("#vocabChips"); chips.innerHTML="";
    list.forEach(([w,def])=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=w; b.title=def;
      b.onclick=()=>speak(w,1.0);
      chips.appendChild(b);
    });
    $("#vocabDefs").innerHTML = list.map(([w,def])=>`<div class="panel panel--soft"><div class="panelTitle">${w}</div><div class="muted small">${def}</div></div>`).join("");
  }

  // Vocab matching game (tap to pair)
  function renderMatch(){
    const cat=$("#matchCat").value;
    const list=VOCAB[cat] || [];
    const picks = shuffle(list).slice(0,6);
    const left = shuffle(picks.map(([w,_])=>w));
    const right = shuffle(picks.map(([_,d])=>d));

    state.matchKey = {};
    picks.forEach(([w,d])=> state.matchKey[w]=d );

    const L=$("#matchLeft"), R=$("#matchRight");
    L.innerHTML = left.map(w=>`<button type="button" class="cardBtn" data-left="${w}">${w}</button>`).join("");
    R.innerHTML = right.map(d=>`<button type="button" class="cardBtn" data-right="${d}">${d}</button>`).join("");
    state.selectedLeft=null; state.selectedRight=null;
    $("#matchFb").className="fb"; $("#matchFb").textContent="Tap one word + one definition.";
  }

  function clearMatchSelection(){
    $$("#matchLeft .cardBtn").forEach(b=>b.classList.remove("is-selected","is-wrong"));
    $$("#matchRight .cardBtn").forEach(b=>b.classList.remove("is-selected","is-wrong"));
  }

  function handleMatchClick(target){
    const l = target.dataset.left;
    const r = target.dataset.right;
    if(l){
      if(target.classList.contains("is-done")) return;
      state.selectedLeft=l;
      clearMatchSelection();
      target.classList.add("is-selected");
      if(state.selectedRight) attemptMatch();
    }
    if(r){
      if(target.classList.contains("is-done")) return;
      state.selectedRight=r;
      clearMatchSelection();
      target.classList.add("is-selected");
      if(state.selectedLeft) attemptMatch();
    }
  }

  function attemptMatch(){
    addScore(0,1);
    const ok = state.matchKey[state.selectedLeft] === state.selectedRight;
    if(ok){
      addScore(1,0);
      const lb=$(`#matchLeft .cardBtn[data-left="${cssEscape(state.selectedLeft)}"]`);
      const rb=$(`#matchRight .cardBtn[data-right="${cssEscape(state.selectedRight)}"]`);
      if(lb) lb.classList.add("is-done");
      if(rb) rb.classList.add("is-done");
      $("#matchFb").className="fb good";
      $("#matchFb").textContent="✅ Match!";
      state.selectedLeft=null; state.selectedRight=null;
      clearMatchSelection();
      // Check completion
      const allDone = $$("#matchLeft .cardBtn").every(b=>b.classList.contains("is-done"));
      if(allDone){
        $("#matchFb").className="fb good";
        $("#matchFb").textContent="✅ Completed. Click 'New set' for more.";
      }
    } else {
      $("#matchFb").className="fb bad";
      $("#matchFb").textContent="❌ Not quite. Try again.";
      // keep selected so user can try different
      state.selectedRight=null;
    }
  }

  // CSS escape helper (for querySelector with quotes)
  function cssEscape(str){
    return (str||"").replace(/\\/g,"\\\\").replace(/"/g,'\\"');
  }

  // Tense quiz
  function renderTenseQuiz(){
    const pool = [
      {stem:"Yesterday, I ____ a jam in column 3.", opts:["fixed","was fixing","have fixed","had fixed"], ans:0, why:"Finished time → Past Simple."},
      {stem:"I ____ the coin mechanism when it stopped accepting coins.", opts:["checked","was checking","have checked","had checked"], ans:1, why:"Background action → Past Continuous."},
      {stem:"We ____ a workaround, so it works again now.", opts:["fixed","were fixing","have implemented","had implemented"], ans:2, why:"Result now → Present Perfect."},
      {stem:"By the time I arrived, the machine ____ several refunds.", opts:["gave","was giving","has given","had given"], ans:3, why:"Earlier past before another past → Past Perfect."},
      {stem:"At 3 p.m., I ____ the vending machine on site.", opts:["repaired","was repairing","have repaired","had repaired"], ans:1, why:"Specific time + in progress → Past Continuous."},
      {stem:"We ____ this issue several times this month.", opts:["had","have had","were having","did have"], ans:1, why:"Unfinished time period → Present Perfect."}
    ];
    const qs = shuffle(pool).filter(q=> allowPPerf() || q.ans !== 3).slice(0,8);
    renderMCQ($("#tenseQuiz"), qs);
  }

  // Word quiz
  function renderWordQuiz(){
    const pool = [
      {stem:"The product didn’t fall. The spiral is ____.", opts:["jammed","refunded","traceability"], ans:0, why:"Jammed = blocked."},
      {stem:"The machine is not usable. It is ____.", opts:["out of order","in transit","in charge"], ans:0, why:"Out of order = not working."},
      {stem:"We returned the money. We gave a ____.", opts:["refund","deadline","workaround"], ans:0, why:"Refund = money back."},
      {stem:"We changed the settings. We ____ the machine.", opts:["reconfigured","restocked","jammed"], ans:0, why:"Reconfigure = change settings."},
      {stem:"We requested a component. We ordered a ____.", opts:["spare part","spiral","display"], ans:0, why:"Spare part = replacement part."},
      {stem:"We blocked a faulty column. We ____ a selection.", opts:["disabled","installed","delivered"], ans:0, why:"Disable = block a choice."}
    ];
    renderMCQ($("#wordQuiz"), shuffle(pool).slice(0,6));
  }

  function renderMCQ(container, questions){
    container.innerHTML="";
    const answered=new Set();
    questions.forEach((q,qi)=>{
      const el=document.createElement("div"); el.className="q";
      el.innerHTML=`<div class="qStem">${q.stem}</div><div class="opt"></div><div class="explain" hidden></div>`;
      const opt=$(".opt",el), exp=$(".explain",el);
      q.opts.forEach((lab,oi)=>{
        if(!allowPPerf() && /had /.test(lab)) return;
        const b=document.createElement("button"); b.type="button"; b.className="choice"; b.textContent=lab;
        b.onclick=()=>{
          if(answered.has(qi)) return;
          answered.add(qi);
          addScore(0,1);
          const ok = (oi===q.ans);
          if(ok){ addScore(1,0); b.classList.add("is-correct"); }
          else{ b.classList.add("is-wrong"); $$(".choice",el)[q.ans].classList.add("is-correct"); }
          exp.hidden=false; exp.textContent=(ok?"✅ ":"❌ ")+q.why;
        };
        opt.appendChild(b);
      });
      container.appendChild(el);
    });
  }

  // Fill blanks
  const FILL = {
    a2: [
      {txt:"Yesterday, I ____ (fix) a vending machine. The product was ____ (jam).", ans:["fixed","jammed"]},
      {txt:"I ____ (reset) the machine and it worked again.", ans:["reset"]},
    ],
    b1: [
      {txt:"Yesterday, I ____ (arrive) on site. I ____ (check) the payment unit when the machine ____ (stop) dispensing.", ans:["arrived","was checking","stopped"]},
      {txt:"We ____ (reconfigure) the machine, so it ____ (work) again now.", ans:["have reconfigured","works"]},
    ],
    b2: [
      {txt:"We ____ (run out) of spare parts before I ____ (arrive). So I ____ (disable) the faulty selection.", ans:["had run out","arrived","disabled"]},
      {txt:"I ____ (test) dispensing, and customers ____ (be able) to use the machine again.", ans:["tested","were able"]},
    ]
  };

  function renderFill(){
    const allow = allowPPerf();
    let blocks = FILL[lvl()] || FILL.b1;

    if(lvl()==="b2" && !allow){
      // Safer B2 variant without Past Perfect
      blocks = [
        {txt:"We ____ (not have) the spare part, so I ____ (reconfigure) the machine to limited mode.", ans:["didn't have","reconfigured"]},
        {txt:"I ____ (test) dispensing, and the client ____ (be able) to keep using the machine.", ans:["tested","was able"]}
      ];
    }

    // store current blocks for instant feedback
    state._fillBlocks = blocks;

    const box=$("#fillList"); box.innerHTML="";
    blocks.forEach((b,bi)=>{
      const parts=b.txt.split("____");
      let html = parts[0];
      for(let i=1;i<parts.length;i++){
        html += `<input class="input fillInp" style="max-width:240px; display:inline-block; vertical-align:middle; margin: 4px 6px;" data-fill="${bi}:${i-1}" placeholder="type…" />` + parts[i];
      }

      const el=document.createElement("div");
      el.className="panel";
      el.innerHTML = `<div class="muted small"><strong>Sentence ${bi+1}:</strong></div>
        <div class="model">${html}</div>
        <div class="muted small" style="margin-top:8px;">Instant feedback: ✅ correct · 🟡 almost · ❌ wrong (as you type)</div>
        <div class="row row--end noPrint" style="margin-top:10px;">
          <button class="btn btn--tiny btn--primary" data-fillcheck="${bi}" type="button">Check</button>
          <button class="btn btn--tiny btn--ghost" data-fillshow="${bi}" type="button">Show</button>
        </div>
        <div class="fb" id="fillFb${bi}" aria-live="polite"></div>`;
      box.appendChild(el);
    });

    // Instant feedback per blank (input event)
    $$(".fillInp", box).forEach(inp=>{
      inp.addEventListener("input", ()=>{
        const key = inp.dataset.fill || "";
        const [bi, ai] = key.split(":").map(n=>Number(n));
        const b = (state._fillBlocks||[])[bi];
        if(!b) return;

        const expectedRaw = (b.ans[ai] || "");
        const norm = (s)=>String(s||"").trim().toLowerCase().replace(/\s+/g," ");
        const got = norm(inp.value);
        const exp = norm(expectedRaw);

        inp.classList.remove("is-ok","is-bad","is-progress");

        if(!got){
          return; // empty → neutral
        }
        if(got === exp){
          inp.classList.add("is-ok");
          return;
        }
        // show "progress" if the expected answer starts with what the student typed
        if(exp.startsWith(got)){
          inp.classList.add("is-progress");
          return;
        }
        inp.classList.add("is-bad");
      });
    });

    // Buttons: Check / Show
    box.onclick=(e)=>{
      const chk=e.target.closest("button[data-fillcheck]");
      const show=e.target.closest("button[data-fillshow]");
      if(!chk && !show) return;
      const bi = Number((chk||show).dataset.fillcheck ?? (chk||show).dataset.fillshow);
      const fb = $("#fillFb"+bi);
      const b = blocks[bi];

      if(show){
        fb.className="fb"; fb.textContent=`✅ Answers: ${b.ans.join(" | ")}`;
        return;
      }

      addScore(0,1);
      const ins = $$(`input[data-fill^="${bi}:"]`, box);
      let ok=true;
      ins.forEach((inp,idx)=>{
        const got=(inp.value||"").trim().toLowerCase().replace(/\s+/g," ");
        const exp=(b.ans[idx]||"").trim().toLowerCase();
        if(got!==exp) ok=false;
      });

      if(ok){
        addScore(1,0);
        fb.className="fb good";
        fb.textContent="✅ Correct — great tense + spelling.";
      }else{
        fb.className="fb bad";
        fb.textContent="❌ Not quite. Tip: check tense signal (yesterday / while / already / by the time).";
      }
    };
  }

  // Tap-order (process steps)
  const STEPS = [
    "Identify the issue (jam / payment failure / motor fault).",
    "Explain the impact (risk of downtime / refunds).",
    "Propose a workaround (limited mode / disable selection).",
    "Test dispensing + payments.",
    "Log the intervention (what you did + next steps).",
    "Follow up when the spare part arrives."
  ];

  function renderTapOrder(){
    state.tapPicked=[];
    const shuffled = shuffle(STEPS);
    const box=$("#tapOrder"); box.innerHTML="";
    shuffled.forEach((t,idx)=>{
      const b=document.createElement("button");
      b.type="button"; b.className="tapItem"; b.textContent=t;
      b.dataset.step=t;
      b.onclick=()=>tapPick(b);
      box.appendChild(b);
    });
    $("#tapFb").className="fb"; $("#tapFb").textContent="Tap the steps in the correct order.";
    $("#tapProgress").textContent="0/6";
  }

  function tapPick(btn){
    if(btn.classList.contains("is-done")) return;
    const chosen = btn.dataset.step;
    const expected = STEPS[state.tapPicked.length];
    addScore(0,1);
    if(chosen===expected){
      addScore(1,0);
      btn.classList.add("is-done");
      state.tapPicked.push(chosen);
      $("#tapProgress").textContent = `${state.tapPicked.length}/6`;
      $("#tapFb").className="fb good";
      $("#tapFb").textContent = "✅ Good.";
      if(state.tapPicked.length===STEPS.length){
        $("#tapFb").className="fb good";
        $("#tapFb").textContent = "✅ Completed! Click 'New order' for another shuffle.";
      }
    }else{
      $("#tapFb").className="fb bad";
      $("#tapFb").textContent = `❌ Not that step yet. Hint: start with “Identify the issue”.`;
    }
  }

  // Speaking drill (Issue → Action → Result)
  const PROMPTS = {
    motor: {
      prompt: "Describe a time you solved a problem at work (vending machines). What was the issue, what did you do, and what was the result?",
      modelB1:
`Recently, I had a problem with a vending machine because one dispensing motor was faulty and the spare part was not available.
I proposed a temporary solution: I disabled the faulty selection and reconfigured the machine to run in limited mode.
I tested dispensing and payments, and the machine stayed usable at reduced capacity. As a result, the site avoided downtime until the part arrived.`,
      modelB2:
`We faced a supply issue: the replacement motor was unavailable, which risked downtime and repeated refunds.
To maintain service continuity, I switched the machine to a limited configuration: I disabled the faulty column, enabled only working selections, and verified dispensing and payment systems.
The outcome was positive: the client continued operating, complaints decreased, and we documented the intervention for the next technician.`
    },
    jam: {
      prompt: "Describe a time you solved a problem at work: a product was stuck (vending machine jam).",
      modelB1:
`Yesterday, a vending machine was jammed and customers could not get their product.
I opened the machine, cleared the jam, tested a vend, and checked that the spiral was turning correctly.
As a result, the machine worked again and we avoided more refunds.`,
      modelB2:
`A machine was repeatedly jamming in the same column, which caused refunds and complaints.
I inspected the spiral and product size, cleared the obstruction, then adjusted the column setup and tested multiple vends.
The result was immediate: fewer incidents, smoother dispensing, and a clear report for follow‑up.`
    },
    payment: {
      prompt: "Describe a time you solved a problem at work: payment failure (coin/card not accepted).",
      modelB1:
`A machine stopped accepting coins, so customers could not buy anything.
I reset the machine, checked the coin mechanism, and tested a payment.
It worked again, and customers could use the machine normally.`,
      modelB2:
`We had a payment failure: the coin mechanism intermittently rejected valid coins.
I ran diagnostics, cleaned the acceptor, reset the system, and verified transactions.
The machine returned to normal operation and we reduced customer complaints.`
    }
  };

  function renderSpeaking(){
    const key=$("#sScenario").value;
    const p = PROMPTS[key];
    $("#sPrompt").textContent = p.prompt;
    $("#modelB1").textContent = p.modelB1;
    $("#modelB2").textContent = p.modelB2;

    const chips = [
      "Recently, I had an issue because…",
      "At that moment, I was… when…",
      "To avoid downtime, I…",
      "I disabled the faulty selection / column.",
      "I reconfigured the machine to limited mode.",
      "I tested dispensing and payments.",
      "As a result, …",
      "I logged the intervention and followed up."
    ];
    const box=$("#sChips"); box.innerHTML="";
    chips.forEach(t=>{
      const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t;
      b.onclick=()=>insertAtCursor($("#sOut"), t+" ");
      box.appendChild(b);
    });

    $("#sOut").value="";
    $("#sFb").className="fb"; $("#sFb").textContent="";
    $$("#sChecklist input").forEach(x=>x.checked=false);
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

  function checkSpeakingText(){
    addScore(0,1);
    const t = ($("#sOut").value||"").toLowerCase();
    const checks = {
      issue: /(problem|issue|fault|jam|stuck|payment|motor|out of stock|spare part)/.test(t),
      action: /(reconfig|disable|reset|test|check|inspect|clean|clear|open)/.test(t),
      result: /(as a result|so|therefore|worked again|usable|avoid(ed)? downtime|fewer refunds)/.test(t),
      ps: /(yesterday|last|ago|at \d|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday))/i.test($("#sOut").value),
      pc: /\b(was|were)\b\s+\w+ing\b/i.test($("#sOut").value),
      pp: /\b(have|has)\b\s+\w+(ed|en)\b/i.test($("#sOut").value) || /\b(have|has)\b\s+(been|done|gone|sent|made|seen|taken|fixed|implemented)\b/i.test($("#sOut").value),
      pperf: /\b(had|hadn't)\b\s+\w+(ed|en)\b/i.test($("#sOut").value) || /\b(had|hadn't)\b\s+(been|done|gone|sent|made|seen|taken|left|paid|found|run)\b/i.test($("#sOut").value)
    };

    $("#ck_issue").checked = checks.issue;
    $("#ck_action").checked = checks.action;
    $("#ck_result").checked = checks.result;
    $("#ck_ps").checked = checks.ps;
    $("#ck_pc").checked = checks.pc;
    $("#ck_pp").checked = checks.pp;
    $("#ck_pperf").checked = allowPPerf() ? checks.pperf : false;

    const needed = (lvl()==="a2") ? 3 : (lvl()==="b1") ? 4 : 5;
    const got = (checks.issue?1:0)+(checks.action?1:0)+(checks.result?1:0)+(checks.ps?1:0)+(checks.pc?1:0)+(checks.pp?1:0)+(allowPPerf()&&checks.pperf?1:0);

    if(got>=needed){
      addScore(1,0);
      $("#sFb").className="fb good";
      $("#sFb").textContent = `✅ Strong. Checklist hits: ${got}.`;
    }else{
      $("#sFb").className="fb warn";
      $("#sFb").textContent = `⚠️ Add more structure/tense signals. Hits: ${got}. Target: ${needed}.`;
    }
  }

  // Writing mini task (email)
  function renderWriting(){
    const key=$("#sScenario").value;
    const s = PROMPTS[key];
    const prompt = "Write a short email to the site manager: explain the issue, what you did, and next steps. (6–10 lines)";
    $("#wPrompt").textContent = prompt;

    const chips = [
      "Subject: Vending machine update",
      "We apologise for the inconvenience.",
      "The machine was out of order due to…",
      "We implemented a temporary workaround.",
      "The faulty selection has been disabled.",
      "The machine is running in limited mode.",
      "We will replace the spare part as soon as it arrives.",
      "Could you please confirm you are happy with this solution?"
    ];
    const box=$("#wChips"); box.innerHTML="";
    chips.forEach(t=>{
      const b=document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t;
      b.onclick=()=>insertAtCursor($("#wOut"), t+"\n");
      box.appendChild(b);
    });

    $("#wOut").value="";
    $("#wFb").className="fb"; $("#wFb").textContent="";
    $$("#wChecklist input").forEach(x=>x.checked=false);
  }

  function checkWriting(){
    addScore(0,1);
    const t = ($("#wOut").value||"");
    const low = t.toLowerCase();
    const checks = {
      subject: /subject:/i.test(t),
      apology: /(apolog|sorry|inconvenience)/i.test(t),
      issue: /(issue|fault|jam|stuck|out of order|payment|motor|spare part|out of stock)/i.test(t),
      action: /(reconfig|disable|reset|test|check|clean|workaround|limited)/i.test(t),
      next: /(next step|follow up|as soon as|will replace|arrive|schedule)/i.test(t),
      confirmation: /(confirm|could you please|please let us know)/i.test(t)
    };
    $("#w_subject").checked=checks.subject;
    $("#w_apology").checked=checks.apology;
    $("#w_issue").checked=checks.issue;
    $("#w_action").checked=checks.action;
    $("#w_next").checked=checks.next;
    $("#w_confirm").checked=checks.confirmation;

    const got = Object.values(checks).filter(Boolean).length;
    const need = (lvl()==="a2") ? 3 : (lvl()==="b1") ? 4 : 5;

    if(got>=need){
      addScore(1,0);
      $("#wFb").className="fb good";
      $("#wFb").textContent = `✅ Good email structure (${got}/6 checks).`;
    }else{
      $("#wFb").className="fb warn";
      $("#wFb").textContent = `⚠️ Improve structure (${got}/6 checks). Add Subject + apology + next steps.`;
    }
  }

  function newAll(){
    stopSpeech(); stopTimer();
    state.seed = Math.floor(Math.random()*1e9);
    state.score = {c:0,t:0};
    $("#scoreTxt").textContent = "0 / 0";
    $("#progressPct").textContent = "0%";
    $("#progressBar").style.width = "0%";
    renderGrammar();
    renderVocab();
    renderMatch();
    renderTenseQuiz();
    renderWordQuiz();
    renderFill();
    renderTapOrder();
    renderSpeaking();
    renderWriting();
  }

  function wire(){
    $("#accentUS").onclick=()=>{ state.accent="US"; $("#accentUS").setAttribute("aria-pressed","true"); $("#accentUK").setAttribute("aria-pressed","false"); };
    $("#accentUK").onclick=()=>{ state.accent="UK"; $("#accentUK").setAttribute("aria-pressed","true"); $("#accentUS").setAttribute("aria-pressed","false"); };
    $("#resetAll").onclick=()=>location.reload();
    $("#printPage").onclick=()=>window.print();

    $("#level").onchange=()=>{ renderGrammar(); renderTenseQuiz(); renderFill(); renderSpeaking(); renderWriting(); };
    $("#pperfToggle").onchange=()=>{ renderGrammar(); renderTenseQuiz(); renderFill(); renderSpeaking(); renderWriting(); };
    $("#frToggle").onchange=renderGrammar;

    $("#vocabCat").onchange=renderVocab;
    $("#matchCat").onchange=renderMatch;
    $("#newMatch").onclick=renderMatch;

    $("#newTenseQuiz").onclick=renderTenseQuiz;
    $("#newWordQuiz").onclick=renderWordQuiz;
    $("#newFill").onclick=renderFill;
    $("#newOrder").onclick=renderTapOrder;

    $("#matchLeft").onclick=(e)=>{ const b=e.target.closest("button[data-left]"); if(b) handleMatchClick(b); };
    $("#matchRight").onclick=(e)=>{ const b=e.target.closest("button[data-right]"); if(b) handleMatchClick(b); };

    $("#sScenario").onchange=()=>{ renderSpeaking(); renderWriting(); };
    $("#start60").onclick=()=>startTimer(60);
    $("#start90").onclick=()=>startTimer(90);
    $("#stopTimer").onclick=stopTimer;
    $("#listenPrompt").onclick=()=>speak($("#sPrompt").textContent||"", 1.0);
    $("#listenOut").onclick=()=>speak($("#sOut").value || $("#sPrompt").textContent || "", 1.0);
    $("#toggleModelB1").onclick=()=>toggleHidden("#modelB1Box");
    $("#toggleModelB2").onclick=()=>toggleHidden("#modelB2Box");
    $("#checkSpeak").onclick=checkSpeakingText;
    $("#clearSpeak").onclick=()=>{ $("#sOut").value=""; $("#sFb").textContent=""; $("#sFb").className="fb"; $$("#sChecklist input").forEach(x=>x.checked=false); };

    $("#checkWrite").onclick=checkWriting;
    $("#clearWrite").onclick=()=>{ $("#wOut").value=""; $("#wFb").textContent=""; $("#wFb").className="fb"; $$("#wChecklist input").forEach(x=>x.checked=false); };
    $("#listenWrite").onclick=()=>speak($("#wOut").value || $("#wPrompt").textContent || "", 1.0);

    $("#newAll").onclick=newAll;
  }

  function toggleHidden(sel){
    const el=$(sel);
    if(!el) return;
    const hidden = el.hasAttribute("hidden");
    if(hidden) el.removeAttribute("hidden");
    else el.setAttribute("hidden","");
  }

  function init(){
    $("#grammarHint").textContent = KEYFRAME[lvl()];
    newAll();
    wire();
  }

  document.addEventListener("DOMContentLoaded", init);
})();