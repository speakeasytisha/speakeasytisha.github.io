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
    _fillBlocks: []
  };

  // helpers
  function rand(){ const x=Math.sin(state.seed++)*10000; return x - Math.floor(x); }
  function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function lvl(){ return $("#level").value; }
  function norm(s){ return String(s||"").trim().toLowerCase().replace(/\s+/g," "); }
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
    const want = accent==="UK" ? ["en-gb","en_gb"] : ["en-us","en_us"];
    const fb = accent==="UK" ? ["en","en-ie","en-au","en-ca","en-us"] : ["en","en-ca","en-au","en-gb"];
    const by = (arr)=>vs.find(v=>arr.some(x=>(v.lang||"").toLowerCase().includes(x)));
    return by(want) || by(fb) || vs[0];
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
    stopTimer();
    state.timer.t=seconds; $("#timerTxt").textContent=fmt(state.timer.t);
    state.timer.id=setInterval(()=>{
      state.timer.t -= 1;
      $("#timerTxt").textContent=fmt(Math.max(0,state.timer.t));
      if(state.timer.t<=0){ clearInterval(state.timer.id); state.timer.id=null; }
    }, 1000);
  }

  // Profile
  function renderProfile(){
    const yrs = ($("#years").value||"a few").trim();
    const city = ($("#city").value||"Boston area").trim();
    $("#profileOut").textContent =
`Profile (for speaking + writing)
• You are moving to the United States for about ${yrs} years.
• You have three children.
• You need to organise: housing, school, healthcare, banking, and daily life.
• You want to communicate clearly and politely (email + phone).
Location: ${city}`;
  }

  // Grammar
  const GRAMMAR = [
    { id:"future", name:"Future plans (going to / will)", form:"going to + base / will + base",
      use:"GOING TO = plan. WILL = decision now / promise.", key:["next month","this summer","we plan to…","we will…","we’re going to…"],
      ex:"We’re going to move in August. We will confirm the date tomorrow." },
    { id:"pp", name:"Present Perfect (experience / updates)", form:"have/has + V3",
      use:"Experience + updates with a result now (already/just/yet).", key:["already","just","yet","since","for","recently","so far"],
      ex:"We have already found a school district, but we haven’t signed the lease yet." },
    { id:"ps", name:"Past Simple (finished past)", form:"V2 / did + base",
      use:"Finished time in the past (yesterday / last week).", key:["yesterday","last…","ago","in 2024","on Monday"],
      ex:"Last week, I called the school office to ask about registration." },
    { id:"polite", name:"Polite requests (could / would / would you mind)", form:"Could you…? / Would it be possible to…? / Would you mind + V‑ing…?",
      use:"Polite + professional (emails + calls).", key:["Could you please…","Would it be possible to…","I would appreciate…","Thank you for your help."],
      ex:"Could you please confirm the documents we need for enrollment?" }
  ];

  function renderGrammar(){
    const box=$("#grammarCards"); box.innerHTML="";
    GRAMMAR.forEach(g=>{
      const el=document.createElement("div");
      el.className="panel";
      el.innerHTML = `
        <div class="panelTitle">🧠 ${g.name}</div>
        <div class="muted small"><strong>Form:</strong> ${g.form}</div>
        <div class="muted small" style="margin-top:8px;"><strong>When to use:</strong> ${g.use}</div>
        <div class="muted small" style="margin-top:8px;"><strong>Key words:</strong></div>
        <div class="chips" style="margin-top:6px;">${g.key.map(k=>`<button type="button" class="chip" data-say="${k}">${k}</button>`).join("")}</div>
        <div class="muted small" style="margin-top:10px;"><strong>Example:</strong></div>
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
      if(chip && chip.dataset.say){ speak(chip.dataset.say, 1.0); return; }
      const listen=e.target.closest("button[data-listen]");
      if(listen){
        const g=GRAMMAR.find(x=>x.id===listen.dataset.listen);
        if(g) speak(g.ex, 1.0);
        return;
      }
      const mini=e.target.closest("button[data-mini]");
      if(mini) runMiniDrill(mini.dataset.mini);
    };
  }

  function renderMCQ(container, questions){
    container.innerHTML="";
    const answered=new Set();
    questions.forEach((q,qi)=>{
      const el=document.createElement("div"); el.className="q";
      el.innerHTML=`<div class="qStem">${q.stem}</div><div class="opt"></div><div class="explain" hidden></div>`;
      const opt=$(".opt",el), exp=$(".explain",el);
      q.opts.forEach((lab,oi)=>{
        const b=document.createElement("button"); b.type="button"; b.className="choice"; b.textContent=lab;
        b.onclick=()=>{
          if(answered.has(qi)) return;
          answered.add(qi);
          addScore(0,1);
          const ok=(oi===q.ans);
          if(ok){ addScore(1,0); b.classList.add("is-correct"); }
          else{ b.classList.add("is-wrong"); $$(".choice",el)[q.ans].classList.add("is-correct"); }
          exp.hidden=false; exp.textContent=(ok?"✅ ":"❌ ")+q.why;
        };
        opt.appendChild(b);
      });
      container.appendChild(el);
    });
  }

  function runMiniDrill(id){
    const fb=$("#miniFb_"+id);
    const pools={
      future:[
        {stem:"We ____ move next month. (plan)", opts:["are going to","have","did"], ans:0, why:"Plan → going to."},
        {stem:"We ____ send you the forms today. (promise)", opts:["will","were","did"], ans:0, why:"Promise → will."}
      ],
      pp:[
        {stem:"We ____ signed the lease yet.", opts:["didn't","haven't","weren't"], ans:1, why:"Yet → Present Perfect."},
        {stem:"Signal word:", opts:["already","ago","yesterday"], ans:0, why:"Already → update."}
      ],
      ps:[
        {stem:"Last week, I ____ the school office.", opts:["called","have called","am calling"], ans:0, why:"Finished time → Past Simple."},
        {stem:"Past question form:", opts:["did + base","have + V3","was + V‑ing"], ans:0, why:"Did + base."}
      ],
      polite:[
        {stem:"Most polite:", opts:["Could you please confirm…?","Confirm now.","You must confirm."], ans:0, why:"Could you please…"},
        {stem:"More formal:", opts:["Would it be possible to…?","I want…","Give me…"], ans:0, why:"Would it be possible…"}
      ]
    };
    fb.className="fb"; fb.innerHTML="";
    renderMCQ(fb, pools[id]||[]);
  }

  // Vocab
  const VOCAB={
    school:[
      ["school district","area that manages public schools"],
      ["enrollment","registration at school"],
      ["proof of address","document showing where you live"],
      ["immunization record","vaccine record"],
      ["after‑school program","activities/care after class"],
      ["parent‑teacher meeting","meeting with the teacher"],
      ["lunch account","school cafeteria payment account"]
    ],
    housing:[
      ["lease","rental contract"],
      ["security deposit","money paid before moving in"],
      ["utilities","electricity, water, internet"],
      ["landlord","owner of the rental"],
      ["application form","form to apply for a rental"],
      ["move‑in date","date you start living there"],
      ["maintenance request","request to fix something"]
    ],
    healthcare:[
      ["primary care doctor","main doctor for regular care"],
      ["urgent care","walk‑in clinic (not ER)"],
      ["appointment","scheduled visit"],
      ["insurance coverage","what the insurance pays for"],
      ["deductible","amount you pay before insurance covers more"],
      ["in‑network","doctor/hospital approved by insurance"],
      ["copay","fixed amount you pay at the visit"]
    ],
    daily:[
      ["bank account","account to receive/pay money"],
      ["routing number","US bank transfer number"],
      ["social security number (SSN)","US identification number for work/benefits"],
      ["phone plan","mobile subscription"],
      ["DMV","office for driver’s license and car registration"],
      ["proof of insurance","document showing you are insured"],
      ["daycare","childcare for young kids"]
    ]
  };

  function renderVocab(){
    const cat=$("#vocabCat").value;
    const list=VOCAB[cat]||[];
    const chips=$("#vocabChips"); chips.innerHTML="";
    list.forEach(([w,def])=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=w; b.title=def;
      b.onclick=()=>speak(w,1.0);
      chips.appendChild(b);
    });
    $("#vocabDefs").innerHTML=list.map(([w,def])=>`
      <div class="panel panel--soft"><div class="panelTitle">${w}</div><div class="muted">${def}</div></div>
    `).join("");
  }

  // Matching
  function escAttr(s){ return String(s||"").replace(/\\/g,"\\\\").replace(/"/g,'\\"'); }

  function renderMatch(){
    const cat=$("#matchCat").value;
    const list=VOCAB[cat]||[];
    const picks=shuffle(list).slice(0,6);
    const left=shuffle(picks.map(([w])=>w));
    const right=shuffle(picks.map(([_,d])=>d));
    state.matchKey={}; picks.forEach(([w,d])=>state.matchKey[w]=d);
    state.selectedLeft=null; state.selectedRight=null;

    $("#matchLeft").innerHTML=left.map(w=>`<button type="button" class="cardBtn" data-left="${escAttr(w)}">${w}</button>`).join("");
    $("#matchRight").innerHTML=right.map(d=>`<button type="button" class="cardBtn" data-right="${escAttr(d)}">${d}</button>`).join("");
    $("#matchFb").className="fb"; $("#matchFb").textContent="Tap one word + one definition.";
  }

  function clearMatchSelection(){
    $$("#matchLeft .cardBtn").forEach(b=>b.classList.remove("is-selected"));
    $$("#matchRight .cardBtn").forEach(b=>b.classList.remove("is-selected"));
  }

  function attemptMatch(){
    addScore(0,1);
    const ok = state.matchKey[state.selectedLeft] === state.selectedRight;
    if(ok){
      addScore(1,0);
      const lb=$(`#matchLeft .cardBtn[data-left="${state.selectedLeft}"]`);
      const rb=$(`#matchRight .cardBtn[data-right="${state.selectedRight}"]`);
      if(lb) lb.classList.add("is-done");
      if(rb) rb.classList.add("is-done");
      $("#matchFb").className="fb good";
      $("#matchFb").textContent="✅ Match!";
      state.selectedLeft=null; state.selectedRight=null;
      clearMatchSelection();
      const allDone = $$("#matchLeft .cardBtn").every(b=>b.classList.contains("is-done"));
      if(allDone){ $("#matchFb").textContent="✅ Completed. Click 'New set' for more."; }
    }else{
      $("#matchFb").className="fb bad";
      $("#matchFb").textContent="❌ Not quite. Try again.";
      state.selectedRight=null;
      clearMatchSelection();
      const lb=$(`#matchLeft .cardBtn[data-left="${state.selectedLeft}"]`);
      if(lb) lb.classList.add("is-selected");
    }
  }

  function onMatchClick(e){
    const bl=e.target.closest("button[data-left]");
    const br=e.target.closest("button[data-right]");
    if(bl){
      if(bl.classList.contains("is-done")) return;
      state.selectedLeft = bl.dataset.left;
      clearMatchSelection();
      bl.classList.add("is-selected");
      if(state.selectedRight) attemptMatch();
      return;
    }
    if(br){
      if(br.classList.contains("is-done")) return;
      state.selectedRight = br.dataset.right;
      clearMatchSelection();
      br.classList.add("is-selected");
      if(state.selectedLeft) attemptMatch();
    }
  }

  // Practice: quizzes
  function renderTenseQuiz(){
    const qs=shuffle([
      {stem:"We ____ move in August. (plan)", opts:["are going to","did","have"], ans:0, why:"Plan → going to."},
      {stem:"We ____ signed the lease yet.", opts:["didn't","haven't","weren't"], ans:1, why:"Yet → Present Perfect."},
      {stem:"Last week, I ____ the landlord.", opts:["called","have called","am calling"], ans:0, why:"Finished past time."},
      {stem:"Could you please ____ the documents we need?", opts:["confirm","confirmed","confirming"], ans:0, why:"Could + base."},
      {stem:"We ____ send you the forms today. (promise)", opts:["will","were","did"], ans:0, why:"Promise → will."},
      {stem:"We have lived in France ____ 20 years.", opts:["for","ago","yesterday"], ans:0, why:"For + duration."}
    ]).slice(0,6);
    renderMCQ($("#tenseQuiz"), qs);
  }

  function renderWordQuiz(){
    const qs=shuffle([
      {stem:"The contract for renting is a ____.", opts:["lease","copay","district"], ans:0, why:"Lease = rental contract."},
      {stem:"A document showing where you live is ____.", opts:["proof of address","urgent care","routing number"], ans:0, why:"Proof of address."},
      {stem:"A walk‑in clinic (not ER) is ____.", opts:["urgent care","enrollment","deposit"], ans:0, why:"Urgent care."},
      {stem:"Money paid before moving in is ____.", opts:["security deposit","daycare","utilities"], ans:0, why:"Security deposit."},
      {stem:"Registration at school is ____.", opts:["enrollment","coverage","DMV"], ans:0, why:"Enrollment."},
      {stem:"The office for driver’s licenses is the ____.", opts:["DMV","district","copay"], ans:0, why:"DMV."}
    ]).slice(0,6);
    renderMCQ($("#wordQuiz"), qs);
  }

  // Fill blanks
  const FILL = {
    a2: [
      {txt:"We are going to ____ (move) to the US next month.", ans:["move"]},
      {txt:"Could you please ____ (confirm) the enrollment documents?", ans:["confirm"]},
    ],
    b1: [
      {txt:"We ____ (not sign) the lease yet, but we have already visited the apartment.", ans:["haven't signed"]},
      {txt:"Last week, I ____ (call) the school office to ask about registration.", ans:["called"]},
    ],
    b2: [
      {txt:"Would it be possible to ____ (schedule) an appointment next week?", ans:["schedule"]},
      {txt:"We have ____ (already find) a doctor in‑network.", ans:["already found"]},
    ]
  };

  function renderFill(){
    const blocks=FILL[lvl()]||FILL.b1;
    state._fillBlocks=blocks;
    const box=$("#fillList"); box.innerHTML="";

    blocks.forEach((b,bi)=>{
      const parts=b.txt.split("____");
      let inner=parts[0];
      for(let i=1;i<parts.length;i++){
        inner += `<input class="input fillInp" style="max-width:260px; display:inline-block; vertical-align:middle; margin:4px 6px;" data-fill="${bi}:${i-1}" placeholder="type…" />` + parts[i];
      }

      const el=document.createElement("div");
      el.className="panel";
      el.innerHTML = `
        <div class="muted"><strong>Sentence ${bi+1}:</strong></div>
        <div class="model">${inner}</div>
        <div class="muted" style="margin-top:8px;">Instant feedback: ✅ correct · 🟡 almost · ❌ wrong</div>
        <div class="row row--end noPrint" style="margin-top:10px;">
          <button class="btn btn--tiny btn--primary" data-fillcheck="${bi}" type="button">Check</button>
          <button class="btn btn--tiny btn--ghost" data-fillshow="${bi}" type="button">Show</button>
        </div>
        <div class="fb" id="fillFb${bi}" aria-live="polite"></div>
      `;
      box.appendChild(el);
    });

    $$(".fillInp", box).forEach(inp=>{
      inp.addEventListener("input", ()=>{
        const [bi,ai]=(inp.dataset.fill||"0:0").split(":").map(n=>Number(n));
        const b=(state._fillBlocks||[])[bi]; if(!b) return;
        const got=norm(inp.value);
        const exp=norm((b.ans||[])[ai]||"");
        inp.classList.remove("is-ok","is-bad","is-progress");
        if(!got) return;
        if(got===exp){ inp.classList.add("is-ok"); return; }
        if(exp.startsWith(got)){ inp.classList.add("is-progress"); return; }
        inp.classList.add("is-bad");
      });
    });

    box.onclick=(e)=>{
      const chk=e.target.closest("button[data-fillcheck]");
      const show=e.target.closest("button[data-fillshow]");
      if(!chk && !show) return;
      const bi = Number((chk||show).dataset.fillcheck ?? (chk||show).dataset.fillshow);
      const b=blocks[bi];
      const fb=$("#fillFb"+bi);

      if(show){
        fb.className="fb"; fb.textContent=`✅ Answer: ${(b.ans||[]).join(" | ")}`;
        return;
      }

      addScore(0,1);
      const ins = $$(`input[data-fill^="${bi}:"]`, box);
      let ok=true;
      ins.forEach((inp,idx)=>{
        if(norm(inp.value)!==norm(b.ans[idx]||"")) ok=false;
      });

      if(ok){ addScore(1,0); fb.className="fb good"; fb.textContent="✅ Correct."; }
      else{ fb.className="fb bad"; fb.textContent="❌ Not quite. Check tense + spelling."; }
    };
  }

  // Tap order
  const STEPS=[
    "Explain your situation (moving date + family).",
    "Ask what documents are required.",
    "Propose a time / ask for an appointment.",
    "Confirm next steps (who does what).",
    "Thank the person and ask for confirmation.",
    "Follow up politely if needed."
  ];

  function renderTapOrder(){
    state.tapPicked=[];
    const box=$("#tapOrder"); box.innerHTML="";
    shuffle(STEPS).forEach(step=>{
      const b=document.createElement("button");
      b.type="button"; b.className="tapItem"; b.textContent=step; b.dataset.step=step;
      b.onclick=()=>tapPick(b);
      box.appendChild(b);
    });
    $("#tapFb").className="fb"; $("#tapFb").textContent="Tap the steps in the correct order.";
    $("#tapProgress").textContent="0/6";
  }

  function tapPick(btn){
    if(btn.classList.contains("is-done")) return;
    const chosen=btn.dataset.step;
    const expected=STEPS[state.tapPicked.length];
    addScore(0,1);
    if(chosen===expected){
      addScore(1,0);
      btn.classList.add("is-done");
      state.tapPicked.push(chosen);
      $("#tapProgress").textContent=`${state.tapPicked.length}/6`;
      $("#tapFb").className="fb good";
      $("#tapFb").textContent=state.tapPicked.length===STEPS.length
        ? "✅ Completed! Click 'New order' for another shuffle."
        : "✅ Good.";
    }else{
      $("#tapFb").className="fb bad";
      $("#tapFb").textContent="❌ Not that step yet. Hint: start with “Explain your situation”.";
    }
  }

  // Speaking + Writing
  const PROMPTS={
    school:{
      prompt:"Call a school office. You are moving to the US with three children. Ask about enrollment and required documents. Ask for a short appointment.",
      b1:`Hello, my name is Claire Martin. I’m moving to the United States for about a few years with my three children.
Could you please confirm what documents we need for enrollment? For example, proof of address and immunization records.
We are going to arrive next month, and we would like to schedule a short appointment.
Thank you for your help. Could you please confirm the next steps by email?`,
      b2:`Hello, this is Claire Martin. We’re relocating to the US for a few years with our three children.
I’m calling to ask about enrollment requirements and timelines. Could you please confirm the documents needed, including proof of address and immunization records?
Would it be possible to schedule a short appointment next week? We’re aiming to finalise the process before our move‑in date.
Thank you — could you please confirm the next steps and who to contact if we have questions?`
    },
    housing:{
      prompt:"Email a landlord/agent. Ask about the lease, deposit, utilities, and move‑in date. Ask for confirmation.",
      b1:`Subject: Rental application — questions
Hello,
We are going to move to the US for a few years with our three children. We are interested in the apartment.
Could you please confirm the lease length, the security deposit, and which utilities are included?
Would it be possible to confirm the move‑in date and the documents required for the application?
Thank you for your help. Please let me know by email.`,
      b2:`Subject: Lease details and move‑in date
Hello,
We are relocating to the US for a few years with our three children and we’re interested in the apartment.
Could you please confirm the lease terms, the security deposit, and which utilities are included? Additionally, would it be possible to clarify the move‑in date and the application requirements?
Thank you. I would appreciate your confirmation by email so we can proceed.`
    },
    healthcare:{
      prompt:"Call a clinic. Ask about insurance (in‑network), appointment availability, and what to bring for your children.",
      b1:`Hello, I would like to book an appointment for my child. We are moving to the US with three children.
Could you please confirm if you accept our insurance and if you are in‑network?
What documents should we bring? For example, an ID and immunization records.
Thank you. Could you please confirm the appointment time?`,
      b2:`Hello, I’d like to schedule an appointment for one of my children. We’re relocating with three children.
Could you please confirm whether you are in‑network for our insurance plan and what the copay might be?
Also, would you mind confirming which documents we should bring, such as ID and immunization records?
Thank you — please confirm the available appointment times.`
    }
  };

  function insertAtCursor(el, text){
    el.focus();
    const start=el.selectionStart ?? el.value.length;
    const end=el.selectionEnd ?? el.value.length;
    const v=el.value;
    el.value = v.slice(0,start) + text + v.slice(end);
    const pos=start+text.length;
    el.selectionStart = el.selectionEnd = pos;
  }

  function renderSpeaking(){
    const p=PROMPTS[$("#scenario").value];
    $("#sPrompt").textContent=p.prompt;
    $("#modelB1").textContent=p.b1;
    $("#modelB2").textContent=p.b2;

    const chips=[
      "Hello, my name is…",
      "We’re relocating to the US for about … years.",
      "We have three children.",
      "Could you please confirm…?",
      "Would it be possible to…?",
      "We’re going to arrive / move in on…",
      "Thank you for your help.",
      "Could you please confirm by email?"
    ];
    const box=$("#sChips"); box.innerHTML="";
    chips.forEach(t=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=t;
      b.onclick=()=>insertAtCursor($("#sOut"), t+" ");
      box.appendChild(b);
    });

    $("#sOut").value="";
    $("#sFb").className="fb"; $("#sFb").textContent="";
    $$("#sChecklist input").forEach(x=>x.checked=false);
  }

  function checkSpeaking(){
    addScore(0,1);
    const t=($("#sOut").value||"").toLowerCase();
    const checks={
      situation: /(relocat|moving|move|arriv|years|three children|kids)/.test(t),
      request: /(could you|would it be possible|would you mind|i would appreciate)/.test(t),
      details: /(documents|proof of address|lease|deposit|utilities|insurance|appointment)/.test(t),
      future: /(going to|will|next month|move in)/.test(t),
      polite: /(please|thank you)/.test(t),
      confirm: /(confirm|by email|let me know)/.test(t),
    };
    $("#ck_situation").checked=checks.situation;
    $("#ck_request").checked=checks.request;
    $("#ck_details").checked=checks.details;
    $("#ck_future").checked=checks.future;
    $("#ck_polite").checked=checks.polite;
    $("#ck_confirm").checked=checks.confirm;

    const got=Object.values(checks).filter(Boolean).length;
    const need=(lvl()==="a2")?3:(lvl()==="b1")?4:5;
    if(got>=need){
      addScore(1,0);
      $("#sFb").className="fb good";
      $("#sFb").textContent=`✅ Strong. Checklist hits: ${got}/6.`;
    }else{
      $("#sFb").className="fb warn";
      $("#sFb").textContent=`⚠️ Add more structure/keywords. Hits: ${got}/6. Target: ${need}.`;
    }
  }

  function renderWriting(){
    $("#wPrompt").textContent="Write a short email (6–10 lines). Include: situation + request + key details + confirmation.";

    const chips=[
      "Subject: Question about enrollment",
      "Subject: Lease details and move‑in date",
      "Subject: Appointment request",
      "We are relocating to the US for about … years with our three children.",
      "Could you please confirm the documents required?",
      "Would it be possible to schedule an appointment?",
      "Could you please confirm the lease length and deposit?",
      "Thank you for your help. Please confirm by email."
    ];
    const box=$("#wChips"); box.innerHTML="";
    chips.forEach(t=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=t;
      b.onclick=()=>insertAtCursor($("#wOut"), t+"\n");
      box.appendChild(b);
    });

    $("#wOut").value="";
    $("#wFb").className="fb"; $("#wFb").textContent="";
    $$("#wChecklist input").forEach(x=>x.checked=false);
  }

  function checkWriting(){
    addScore(0,1);
    const t=($("#wOut").value||"");
    const low=t.toLowerCase();
    const checks={
      subject:/subject:/i.test(t),
      situation: /(relocat|moving|move|three children|kids|years)/.test(low),
      request: /(could you|would it be possible|would you mind|i would appreciate)/.test(low),
      details: /(documents|proof of address|lease|deposit|utilities|insurance|appointment)/.test(low),
      thanks: /(thank you)/.test(low),
      confirm: /(confirm|please let me know|by email)/.test(low),
    };
    $("#w_subject").checked=checks.subject;
    $("#w_situation").checked=checks.situation;
    $("#w_request").checked=checks.request;
    $("#w_details").checked=checks.details;
    $("#w_thanks").checked=checks.thanks;
    $("#w_confirm").checked=checks.confirm;

    const got=Object.values(checks).filter(Boolean).length;
    const need=(lvl()==="a2")?3:(lvl()==="b1")?4:5;
    if(got>=need){
      addScore(1,0);
      $("#wFb").className="fb good";
      $("#wFb").textContent=`✅ Good structure (${got}/6 checks).`;
    }else{
      $("#wFb").className="fb warn";
      $("#wFb").textContent=`⚠️ Improve structure (${got}/6). Add subject + request + confirmation.`;
    }
  }

  // Sprint plan
  function renderSprint(){
    const plan=[
      ["Day 1 (15–20 min)", "Profile + key vocab (school/housing)."],
      ["Day 2 (15–20 min)", "Polite requests: could/would + mini drills."],
      ["Day 3 (15–20 min)", "Present Perfect updates + short emails."],
      ["Day 4 (15–20 min)", "Phone call speaking drill (60–90s) + timer."],
      ["Day 5 (15–20 min)", "Matching + fill blanks + tap-order steps."],
      ["Day 6 (15–20 min)", "Write 2 emails (landlord + school) + checklists."],
      ["Day 7 (20–25 min)", "Mini mock: one speaking + one writing in one session."]
    ];
    $("#sprintOut").innerHTML=plan.map(([d,t])=>`
      <div class="panel panel--soft"><div class="panelTitle">${d}</div><div class="muted">${t}</div></div>
    `).join("");
  }

  function newAll(){
    stopSpeech(); stopTimer();
    state.seed=Math.floor(Math.random()*1e9);
    state.score={c:0,t:0};
    $("#scoreTxt").textContent="0 / 0";
    $("#progressPct").textContent="0%";
    $("#progressBar").style.width="0%";

    renderProfile();
    renderGrammar();
    renderVocab();
    renderMatch();
    renderTenseQuiz();
    renderWordQuiz();
    renderFill();
    renderTapOrder();
    renderSpeaking();
    renderWriting();
    renderSprint();
  }

  function toggleHidden(sel){
    const el=$(sel); if(!el) return;
    if(el.hasAttribute("hidden")) el.removeAttribute("hidden");
    else el.setAttribute("hidden","");
  }

  function wire(){
    $("#accentUS").onclick=()=>{ state.accent="US"; $("#accentUS").setAttribute("aria-pressed","true"); $("#accentUK").setAttribute("aria-pressed","false"); };
    $("#accentUK").onclick=()=>{ state.accent="UK"; $("#accentUK").setAttribute("aria-pressed","true"); $("#accentUS").setAttribute("aria-pressed","false"); };

    $("#level").onchange=()=>{ renderTenseQuiz(); renderWordQuiz(); renderFill(); renderSpeaking(); renderWriting(); };
    $("#years").addEventListener("input", renderProfile);
    $("#city").addEventListener("input", renderProfile);

    $("#vocabCat").onchange=renderVocab;
    $("#matchCat").onchange=renderMatch;
    $("#newMatch").onclick=renderMatch;

    $("#matchLeft").onclick=onMatchClick;
    $("#matchRight").onclick=onMatchClick;

    $("#newTenseQuiz").onclick=renderTenseQuiz;
    $("#newWordQuiz").onclick=renderWordQuiz;
    $("#newFill").onclick=renderFill;
    $("#newOrder").onclick=renderTapOrder;

    $("#scenario").onchange=renderSpeaking;

    $("#start60").onclick=()=>startTimer(60);
    $("#start90").onclick=()=>startTimer(90);
    $("#stopTimer").onclick=stopTimer;

    $("#listenPrompt").onclick=()=>speak($("#sPrompt").textContent||"",1.0);
    $("#listenOut").onclick=()=>speak($("#sOut").value || $("#sPrompt").textContent || "", 1.0);
    $("#toggleB1").onclick=()=>toggleHidden("#modelB1Box");
    $("#toggleB2").onclick=()=>toggleHidden("#modelB2Box");
    $("#checkSpeak").onclick=checkSpeaking;

    $("#checkWrite").onclick=checkWriting;
    $("#listenWrite").onclick=()=>speak($("#wOut").value || $("#wPrompt").textContent || "", 1.0);

    $("#resetAll").onclick=()=>location.reload();
    $("#printPage").onclick=()=>window.print();
    $("#newAll").onclick=newAll;
  }

  document.addEventListener("DOMContentLoaded", ()=>{ newAll(); wire(); });
})();