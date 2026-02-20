/* SpeakEasyTisha • Past Tenses Clear Pack 1 (A2→B2) */
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const state = {
    seed: Math.floor(Math.random()*1e9),
    accent: "US",
    tapMode: true,
    score: { c:0, t:0 },
    current: { choiceQs: [], timeline: null, story: null, sw: null },
    timer: { id: null, t: 0 }
  };

  function rand(){ const x = Math.sin(state.seed++) * 10000; return x - Math.floor(x); }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(rand()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }
  function lvl(){ return $("#level").value; }
  function scenario(){ return $("#scenario").value; }
  function focus(){ return $("#focus").value; }
  function addScore(c,t){
    state.score.c += c; state.score.t += t;
    $("#scoreTxt").textContent = `${state.score.c} / ${state.score.t}`;
  }

  // ---------- speech ----------
  function speechSupported(){ return ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window); }
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

  // ---------- Map (situations -> tense) ----------
  const mapData = {
    finished: {
      name: "Past Simple",
      form: "V2 (worked / went / sent)",
      when: "Finished action in the past. You often say WHEN: yesterday / last week / in 2024.",
      example: () => scenarioExample("finished"),
      signals: ["yesterday", "last week", "two days ago", "in 2024", "this morning"]
    },
    background: {
      name: "Past Continuous",
      form: "was/were + V-ing",
      when: "Background action in progress. Often with while/when. (One action interrupts another.)",
      example: () => scenarioExample("background"),
      signals: ["while", "when", "at 3 p.m.", "all afternoon", "at that moment"]
    },
    result: {
      name: "Present Perfect",
      form: "have/has + V3 (have sent / has gone)",
      when: "Past action with a result NOW (update/status). Often: already / just / yet / since / for.",
      example: () => scenarioExample("result"),
      signals: ["already", "just", "yet", "since", "for", "so far", "this week"]
    },
    experience: {
      name: "Present Perfect (experience)",
      form: "have/has + V3",
      when: "Life experience (no specific time): ever/never/before.",
      example: () => scenarioExample("experience"),
      signals: ["ever", "never", "before", "many times", "recently"]
    },
    earlier: {
      name: "Past Perfect (B2)",
      form: "had + V3",
      when: "One past event happened BEFORE another past event (earlier past). Often with: before/after/when.",
      example: () => scenarioExample("earlier"),
      signals: ["before", "after", "by the time", "when"]
    }
  };

  function scenarioExample(type){
    const s = scenario();
    if(s==="shipping"){
      if(type==="finished") return "We sent the update yesterday.";
      if(type==="background") return "We were checking the stock when the client called.";
      if(type==="result") return "We have sent the tracking number already.";
      if(type==="experience") return "We have handled similar delays before.";
      return "We had confirmed the delivery date before we noticed the issue.";
    }
    if(s==="it"){
      if(type==="finished") return "I restarted the system this morning.";
      if(type==="background") return "I was running a test when the error appeared.";
      if(type==="result") return "We have fixed the issue, and it works now.";
      if(type==="experience") return "I have seen this error many times.";
      return "We had escalated the ticket before the manager replied.";
    }
    if(s==="meeting"){
      if(type==="finished") return "We agreed on the next steps last Friday.";
      if(type==="background") return "We were discussing the deadline when new data arrived.";
      if(type==="result") return "We have decided to move the meeting to tomorrow.";
      if(type==="experience") return "We have worked with this client before.";
      return "We had prepared the agenda before the call started.";
    }
    // hotel
    if(type==="finished") return "We checked the room yesterday evening.";
    if(type==="background") return "We were cleaning the room when the guest arrived.";
    if(type==="result") return "We have offered a solution, and the guest is satisfied.";
    if(type==="experience") return "We have received similar feedback before.";
    return "We had already sent housekeeping before the complaint was received.";
  }

  function renderTree(){
    $("#treeOut").textContent = [
      "Ask ONE question:",
      "1) Is it finished + you say WHEN? → Past Simple.",
      "2) Is it background/in progress (while/when)? → Past Continuous.",
      "3) Is it an update/result NOW (already/just/yet/since/for)? → Present Perfect.",
      "4) Did it happen BEFORE another past event? → Past Perfect (B2)."
    ].join("\\n");
  }

  function renderDecisionHeader(key){
    const d = mapData[key];
    $("#decisionTxt").textContent = d ? d.name : "—";
    $("#decisionOut").textContent = d ? `${d.when}\\nExample: ${d.example()}` : "";
  }

  function renderSignals(signals, key){
    const box = $("#signalChips");
    box.innerHTML = "";
    (signals||[]).slice(0,7).forEach(t=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=t;
      b.addEventListener("click", ()=> speak(`${t}. ${mapData[key]?.name||""}.`, 1.0));
      box.appendChild(b);
    });
  }

  function renderMap(){
    const key = $("#mapSituation").value;
    const d = mapData[key];
    const out = $("#mapOut");
    const L = lvl();
    const isEarlier = (key==="earlier");
    if(isEarlier && L!=="b2"){
      out.textContent = [
        "Past Perfect (B2)",
        "This is optional at A2/B1.",
        "Switch to B2 level to practice it."
      ].join("\\n");
    }else{
      out.textContent = [
        `${d.name}`,
        `Form: ${d.form}`,
        `When: ${d.when}`,
        `Example: ${d.example()}`
      ].join("\\n");
    }
    renderSignals(d.signals, key);
    renderDecisionHeader(key);
  }

  // ---------- MCQ engine ----------
  function renderMCQ(container, questions){
    container.innerHTML = "";
    const answered = new Set();
    questions.forEach((q, qi)=>{
      const el=document.createElement("div");
      el.className="q";
      el.innerHTML = `<div class="q__stem">${q.stem}</div><div class="opt"></div><div class="explain" hidden></div>`;
      const opt = $(".opt", el);
      const exp = $(".explain", el);

      q.options.forEach((lab, oi)=>{
        const b=document.createElement("button");
        b.type="button";
        b.className="choice";
        b.textContent=lab;
        b.setAttribute("aria-pressed","false");
        b.addEventListener("click", ()=>{
          if(answered.has(qi)) return;
          answered.add(qi);
          addScore(0,1);
          const ok = (oi===q.answer);
          if(ok){ addScore(1,0); b.classList.add("is-correct"); }
          else{
            b.classList.add("is-wrong");
            const btns = $$(".choice", el);
            btns[q.answer].classList.add("is-correct");
          }
          exp.hidden=false;
          exp.textContent = (ok ? "✅ " : "❌ ") + q.explain;
        });
        opt.appendChild(b);
      });

      container.appendChild(el);
    });
  }

  function buildChoiceQuestions(){
    const L = lvl();
    const s = scenario();
    const f = focus();
    const pool = [];
    const push = (stem, options, answer, explain) => pool.push({ stem, options, answer, explain });

    push(`Choose the best tense: “We ____ the update already.”`,
      ["sent (Past Simple)", "have sent (Present Perfect)", "were sending (Past Continuous)"],
      1, "Already + result now → Present Perfect."
    );
    push(`Choose the best tense: “We ____ the update yesterday.”`,
      ["sent (Past Simple)", "have sent (Present Perfect)", "were sending (Past Continuous)"],
      0, "Yesterday = finished + time given → Past Simple."
    );
    push(`Choose the best tense: “We ____ the stock when the client called.”`,
      ["checked (Past Simple)", "were checking (Past Continuous)", "have checked (Present Perfect)"],
      1, "While/when background → Past Continuous."
    );

    if(s==="it"){
      push(`Choose the best tense: “The error appeared while I ____ a test.”`,
        ["ran (Past Simple)", "was running (Past Continuous)", "have run (Present Perfect)"],
        1, "Background action → Past Continuous."
      );
      push(`Choose the best tense: “We ____ the issue, and it works now.”`,
        ["fixed (Past Simple)", "have fixed (Present Perfect)", "were fixing (Past Continuous)"],
        1, "Result now → Present Perfect."
      );
    } else if(s==="meeting"){
      push(`Choose the best tense: “We ____ on the next steps last Friday.”`,
        ["agreed (Past Simple)", "have agreed (Present Perfect)", "were agreeing (Past Continuous)"],
        0, "Last Friday = time given → Past Simple."
      );
      push(`Choose the best tense: “We ____ the deadline when new data arrived.”`,
        ["discussed (Past Simple)", "were discussing (Past Continuous)", "have discussed (Present Perfect)"],
        1, "Background action → Past Continuous."
      );
    } else if(s==="hotel"){
      push(`Choose the best tense: “We ____ the room when the guest arrived.”`,
        ["cleaned (Past Simple)", "were cleaning (Past Continuous)", "have cleaned (Present Perfect)"],
        1, "Background action → Past Continuous."
      );
      push(`Choose the best tense: “We ____ a solution, and the guest is satisfied.”`,
        ["offered (Past Simple)", "have offered (Present Perfect)", "were offering (Past Continuous)"],
        1, "Result now → Present Perfect."
      );
    } else {
      push(`Choose the best tense: “We ____ the tracking number already.”`,
        ["sent (Past Simple)", "have sent (Present Perfect)", "were sending (Past Continuous)"],
        1, "Already + update/status → Present Perfect."
      );
      push(`Choose the best tense: “We ____ the client this morning.”`,
        ["called (Past Simple)", "have called (Present Perfect)", "were calling (Past Continuous)"],
        0, "This morning (finished) → Past Simple."
      );
    }

    if(L==="b2"){
      push(`B2: Choose the best tense: “We ____ the agenda before the call started.”`,
        ["prepared (Past Simple)", "had prepared (Past Perfect)", "have prepared (Present Perfect)"],
        1, "Earlier past (before another past event) → Past Perfect."
      );
    } else {
      push(`Choose the best tense: “We have worked with this client before.” (meaning?)`,
        ["Finished action with a time", "Life experience (no time)", "Background action"],
        1, "Before/ever/never → Present Perfect (experience)."
      );
    }

    let qs = shuffle(pool);
    if(f==="simple") qs = shuffle(pool.filter(q=>q.explain.includes("Past Simple") || q.stem.includes("yesterday") || q.stem.includes("this morning")));
    if(f==="continuous") qs = shuffle(pool.filter(q=>q.explain.includes("Past Continuous") || q.stem.includes("when")));
    if(f==="perfect") qs = shuffle(pool.filter(q=>q.explain.includes("Present Perfect") || q.stem.includes("already")));
    if(f==="pastperfect") qs = shuffle(pool.filter(q=>q.explain.includes("Past Perfect") || q.stem.includes("B2")));

    if(qs.length < 6) qs = shuffle(pool);
    qs = qs.slice(0, 6);
    state.current.choiceQs = qs;
    renderMCQ($("#choiceQuiz"), qs);
  }

  // ---------- Timeline ----------
  const timelines = {
    shipping: {
      events: [
        "We confirmed the delivery date.",
        "We noticed a missing part.",
        "We called the supplier.",
        "We sent an update to the client.",
        "We offered two options."
      ],
      model: [
        "Past Simple: We noticed a missing part yesterday.",
        "Past Continuous: We were checking the stock when we noticed the issue.",
        "Present Perfect: We have sent an update already (result now).",
        "B2 Past Perfect: We had confirmed the delivery date before we noticed the issue."
      ],
      hint: "Start with confirmation → problem → action → update → options."
    },
    it: {
      events: [
        "The user reported an error.",
        "We reproduced the bug.",
        "We escalated the ticket.",
        "We deployed a fix.",
        "We followed up with the user."
      ],
      model: [
        "Past Simple: The user reported an error this morning.",
        "Past Continuous: We were running a test when the error appeared.",
        "Present Perfect: We have deployed a fix (it works now).",
        "B2 Past Perfect: We had escalated the ticket before the manager replied."
      ],
      hint: "Report → test → escalate → fix → follow-up."
    },
    meeting: {
      events: [
        "We prepared the agenda.",
        "The call started.",
        "We discussed the deadline.",
        "New data arrived.",
        "We agreed on next steps."
      ],
      model: [
        "Past Simple: We agreed on next steps last Friday.",
        "Past Continuous: We were discussing the deadline when new data arrived.",
        "Present Perfect: We have decided to move the meeting (update now).",
        "B2 Past Perfect: We had prepared the agenda before the call started."
      ],
      hint: "Preparation → call → discussion → interruption → decision."
    },
    hotel: {
      events: [
        "The guest complained.",
        "We checked the room.",
        "We offered a solution.",
        "Housekeeping cleaned the room.",
        "We followed up."
      ],
      model: [
        "Past Simple: We checked the room yesterday evening.",
        "Past Continuous: We were cleaning the room when the guest arrived.",
        "Present Perfect: We have offered a solution (guest satisfied now).",
        "B2 Past Perfect: We had already sent housekeeping before the complaint was received."
      ],
      hint: "Complaint → check → solution → action → follow-up."
    }
  };

  function stepEl(text){
    const el=document.createElement("div");
    el.className="step";
    el.innerHTML = `
      <div class="step__left"><span class="step__num"></span><div class="step__txt">${text}</div></div>
      <div class="step__tools">
        <button class="iconBtn" type="button" data-up title="Move up">↑</button>
        <button class="iconBtn" type="button" data-down title="Move down">↓</button>
      </div>
    `;
    return el;
  }
  function updateStepNumbers(){
    $$("#timelineList .step").forEach((step, i)=>{
      const n = $(".step__num", step);
      if(n) n.textContent = String(i+1);
    });
  }
  function renderTimeline(){
    const t = timelines[scenario()] || timelines.shipping;
    state.current.timeline = { correct: t.events.slice(), hint: t.hint, model: t.model };
    const shuffled = shuffle(t.events);

    $("#timelineList").innerHTML = "";
    shuffled.forEach(ev => $("#timelineList").appendChild(stepEl(ev)));
    updateStepNumbers();

    $("#timelineFb").textContent = "";
    $("#timelineFb").className = "feedback";
    $("#timelineModel").textContent = t.model.join("\\n");
  }
  function swapTimeline(i,j){
    const list = $("#timelineList");
    const items = $$("#timelineList .step");
    if(i<0 || j<0 || i>=items.length || j>=items.length) return;
    const a=items[i], b=items[j];
    const aNext=a.nextSibling, bNext=b.nextSibling;
    if(aNext===b) list.insertBefore(b,a);
    else if(bNext===a) list.insertBefore(a,b);
    else { list.insertBefore(a,bNext); list.insertBefore(b,aNext); }
    updateStepNumbers();
  }
  function wireTimeline(){
    $("#timelineList").addEventListener("click", (e)=>{
      const step = e.target.closest(".step");
      if(!step) return;
      const steps = $$("#timelineList .step");
      const idx = steps.indexOf(step);
      if(e.target.matches("[data-up]")) swapTimeline(idx, idx-1);
      if(e.target.matches("[data-down]")) swapTimeline(idx, idx+1);
    }, { passive:true });
  }
  function timelineTexts(){ return $$("#timelineList .step .step__txt").map(x=>x.textContent.trim()); }
  function checkTimeline(){
    addScore(0,1);
    const got = timelineTexts();
    const correct = state.current.timeline.correct;
    let ok=0; const wrong=[];
    got.forEach((t,i)=>{ if(t===correct[i]) ok++; else wrong.push(i+1); });
    const allOk = ok===correct.length;
    const fb = $("#timelineFb");
    fb.className = allOk ? "feedback good" : "feedback bad";
    fb.textContent = allOk ? `✅ Correct! (${ok}/${correct.length})`
      : `❌ Not yet. ${ok}/${correct.length} positions correct. Wrong positions: ${wrong.join(", ")}.`;
    if(allOk) addScore(1,0);
  }

  // ---------- Story ----------
  const stories = {
    shipping: {
      title:"Shipping delay — short update",
      prompt:`You are writing a quick update about a shipment delay.\\nChoose the best tense for each line.`,
      blanks:[
        { label:"1) Finished event (time given)", line:"Yesterday, we ____ the delivery date with the supplier.", options:["confirmed (Past Simple)","have confirmed (Present Perfect)","were confirming (Past Continuous)"], answer:0, explain:"Yesterday → Past Simple." },
        { label:"2) Background action", line:"We ____ the stock when we noticed a missing part.", options:["checked (Past Simple)","were checking (Past Continuous)","have checked (Present Perfect)"], answer:1, explain:"background → Past Continuous." },
        { label:"3) Result now (update)", line:"We ____ the client already, so they have the update.", options:["called (Past Simple)","have called (Present Perfect)","were calling (Past Continuous)"], answer:1, explain:"already + update now → Present Perfect." },
        { label:"4) Earlier past (B2)", line:"We ____ the delivery date before we noticed the issue.", options:["confirmed (Past Simple)","had confirmed (Past Perfect)","have confirmed (Present Perfect)"], answer:1, explain:"before another past event → Past Perfect." }
      ],
      upgrade:"Use 2 sentences: one Past Simple + one Present Perfect."
    },
    it: {
      title:"IT issue — ticket update",
      prompt:`You are updating a user about an IT issue.\\nChoose the best tense for each line.`,
      blanks:[
        { label:"1) Finished event", line:"This morning, we ____ the system.", options:["restarted (Past Simple)","have restarted (Present Perfect)","were restarting (Past Continuous)"], answer:0, explain:"time given → Past Simple." },
        { label:"2) Background action", line:"I ____ a test when the error appeared.", options:["ran (Past Simple)","was running (Past Continuous)","have run (Present Perfect)"], answer:1, explain:"background → Past Continuous." },
        { label:"3) Result now", line:"We ____ the issue, and it works now.", options:["fixed (Past Simple)","have fixed (Present Perfect)","were fixing (Past Continuous)"], answer:1, explain:"result now → Present Perfect." },
        { label:"4) Earlier past (B2)", line:"We ____ the ticket before the manager replied.", options:["escalated (Past Simple)","had escalated (Past Perfect)","have escalated (Present Perfect)"], answer:1, explain:"earlier past → Past Perfect." }
      ],
      upgrade:"Add a timeframe and next step."
    },
    meeting: {
      title:"Meeting recap — timing & decisions",
      prompt:`You are summarising a meeting.\\nChoose the best tense for each line.`,
      blanks:[
        { label:"1) Finished event (time given)", line:"Last Friday, we ____ on the next steps.", options:["agreed (Past Simple)","have agreed (Present Perfect)","were agreeing (Past Continuous)"], answer:0, explain:"last Friday → Past Simple." },
        { label:"2) Background action", line:"We ____ the deadline when new data arrived.", options:["discussed (Past Simple)","were discussing (Past Continuous)","have discussed (Present Perfect)"], answer:1, explain:"background → Past Continuous." },
        { label:"3) Update now", line:"We ____ to move the meeting to tomorrow.", options:["decided (Past Simple)","have decided (Present Perfect)","were deciding (Past Continuous)"], answer:1, explain:"decision update now → Present Perfect." },
        { label:"4) Earlier past (B2)", line:"We ____ the agenda before the call started.", options:["prepared (Past Simple)","had prepared (Past Perfect)","have prepared (Present Perfect)"], answer:1, explain:"before another past event → Past Perfect." }
      ],
      upgrade:"Use one “while/when” sentence."
    },
    hotel: {
      title:"Hotel complaint — service recovery",
      prompt:`You are responding to a complaint.\\nChoose the best tense for each line.`,
      blanks:[
        { label:"1) Finished event", line:"Yesterday evening, we ____ the room.", options:["checked (Past Simple)","have checked (Present Perfect)","were checking (Past Continuous)"], answer:0, explain:"time given → Past Simple." },
        { label:"2) Background action", line:"We ____ the room when the guest arrived.", options:["cleaned (Past Simple)","were cleaning (Past Continuous)","have cleaned (Present Perfect)"], answer:1, explain:"background → Past Continuous." },
        { label:"3) Result now", line:"We ____ a solution, and the guest is satisfied.", options:["offered (Past Simple)","have offered (Present Perfect)","were offering (Past Continuous)"], answer:1, explain:"result now → Present Perfect." },
        { label:"4) Earlier past (B2)", line:"We ____ housekeeping before the complaint was received.", options:["sent (Past Simple)","had sent (Past Perfect)","have sent (Present Perfect)"], answer:1, explain:"earlier past → Past Perfect." }
      ],
      upgrade:"Add an apology + next step."
    }
  };

  function renderStory(){
    const s = stories[scenario()] || stories.shipping;
    const L = lvl();
    $("#storyPrompt").textContent = `${s.title}\\n\\n${s.prompt}`;
    $("#upgradeOut").value = "";
    $("#storyFb").textContent = "";
    $("#storyFb").className = "feedback";

    const blanks = s.blanks.slice();
    const show = (L==="b2") ? blanks : blanks.filter(b=>!b.label.includes("B2"));
    state.current.story = { data: s, blanks: show };

    const wrap = $("#storyBlanks");
    wrap.innerHTML = "";
    show.forEach((b, i)=>{
      const row = document.createElement("div");
      row.className = "blankRow";
      row.innerHTML = `
        <div class="blankRow__label">${b.label}</div>
        <div class="blankRow__line">${b.line}</div>
        <select class="select" data-blank="${i}">
          ${b.options.map((o,oi)=>`<option value="${oi}">${o}</option>`).join("")}
        </select>
      `;
      wrap.appendChild(row);
    });

    $("#storyAnswer").textContent = show.map(b=>`- ${b.label}\\n  ✅ ${b.options[b.answer]}\\n  Why: ${b.explain}`).join("\\n\\n");
  }

  function checkStory(){
    addScore(0,1);
    const fb = $("#storyFb");
    const blanks = state.current.story.blanks;
    const selects = $$("#storyBlanks select");
    let ok=0; const wrong=[];
    blanks.forEach((b,i)=>{
      const val = Number(selects[i].value);
      if(val===b.answer) ok++; else wrong.push(i+1);
    });
    const allOk = ok===blanks.length;
    fb.className = allOk ? "feedback good" : "feedback bad";
    fb.textContent = allOk ? `✅ Great! ${ok}/${blanks.length} correct.`
      : `❌ Not yet. ${ok}/${blanks.length} correct. Wrong blanks: ${wrong.join(", ")}.`;
    if(allOk) addScore(1,0);
  }

  function storyHint(){
    $("#storyFb").className = "feedback";
    $("#storyFb").textContent = `Hint: ${state.current.story.data.upgrade}`;
  }

  // ---------- Speak + Write ----------
  function formatTime(sec){
    const m = String(Math.floor(sec/60)).padStart(2,"0");
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  }
  function stopTimer(){
    if(state.timer.id) clearInterval(state.timer.id);
    state.timer.id = null; state.timer.t = 0;
    $("#timerTxt").textContent = "00:00";
  }
  function startTimer(){
    stopTimer();
    state.timer.t = 60;
    $("#timerTxt").textContent = formatTime(state.timer.t);
    state.timer.id = setInterval(()=>{
      state.timer.t -= 1;
      $("#timerTxt").textContent = formatTime(Math.max(0,state.timer.t));
      if(state.timer.t<=0){ clearInterval(state.timer.id); state.timer.id=null; }
    }, 1000);
  }

  const swPrompts = {
    shipping: {
      speak:`Speak (60–90s): Explain what happened and give an update.\\nUse:\\n• Past Simple (what happened)\\n• Present Perfect (status now)\\n• Optional: Past Continuous (background)`,
      write:`Write an email update about a delay.\\nInclude:\\n• Subject line\\n• What happened (Past Simple)\\n• Status now (Present Perfect)\\n• Next step + time`
    },
    it: {
      speak:`Speak: Describe the IT issue, what you did, and the status now.\\nUse Past Simple + Present Perfect.`,
      write:`Write an email to a user about an IT issue.\\nInclude what you did (Past Simple) and status now (Present Perfect).`
    },
    meeting: {
      speak:`Speak: Summarise the meeting.\\nUse Past Simple (decisions) + Past Continuous (background) + Present Perfect (update now).`,
      write:`Write a short recap email.\\nInclude decisions (Past Simple) + an update (Present Perfect).`
    },
    hotel: {
      speak:`Speak: Explain the complaint and actions.\\nUse Past Simple + Present Perfect (result now).`,
      write:`Write a reply to a complaint.\\nInclude apology + action done (Past Simple) + current result (Present Perfect).`
    }
  };

  function insertAtCursor(textarea, text){
    textarea.focus();
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const v = textarea.value;
    textarea.value = v.slice(0,start) + text + v.slice(end);
    const pos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
  }

  function writeChips(){
    const L = lvl();
    const s = scenario();
    const common = [
      "Subject: Quick update",
      "Thank you for your message.",
      "I’m sorry for the inconvenience.",
      "Yesterday, we checked the situation.",
      "We have already sent an update.",
      "We will follow up tomorrow."
    ];
    const sSpecific = (s==="shipping") ? [
      "Yesterday, we noticed a missing part.",
      "We were checking the stock when the issue appeared.",
      "We have contacted the supplier.",
      "We can offer two options."
    ] : (s==="it") ? [
      "This morning, I restarted the system.",
      "I was running a test when the error appeared.",
      "We have fixed the issue and it works now.",
      "Please let me know if the problem continues."
    ] : (s==="meeting") ? [
      "Last Friday, we agreed on the next steps.",
      "We were discussing the deadline when new data arrived.",
      "We have decided to move the meeting.",
      "Here are the action items."
    ] : [
      "Yesterday evening, we checked the room.",
      "We were cleaning the room when the guest arrived.",
      "We have offered a solution.",
      "Thank you for your feedback."
    ];
    const base = (L==="a2") ? common.slice(0,5).concat(sSpecific.slice(0,2)) : common.concat(sSpecific);
    return shuffle(base).slice(0,10);
  }

  function renderWriteChecklist(){
    const items = [
      { id:"subject", label:"Subject line" },
      { id:"ps", label:"Past Simple (finished event)" },
      { id:"pp", label:"Present Perfect (status now)" },
      { id:"pc", label:"Past Continuous (background) — optional" },
      { id:"time", label:"Time / deadline" },
      { id:"close", label:"Polite close + signature" }
    ];
    $("#writeChecklist").innerHTML = items.map(it=>`
      <label class="ck"><input type="checkbox" data-wck="${it.id}"/><div>${it.label}</div></label>
    `).join("");
  }

  function renderSW(){
    const s = swPrompts[scenario()] || swPrompts.shipping;
    $("#speakPrompt").textContent = s.speak;
    $("#writePrompt").textContent = s.write;
    $("#speakFrame").textContent = [
      "Easy speaking frame:",
      "1) Yesterday / last week, … (Past Simple).",
      "2) While I was …, … happened (Past Continuous).",
      "3) We have … already / so far (Present Perfect).",
      "4) Next step: we will …"
    ].join("\\n");

    const chips = writeChips();
    const box = $("#writeChips");
    box.innerHTML = "";
    chips.forEach(t=>{
      const b=document.createElement("button");
      b.type="button"; b.className="chip"; b.textContent=t;
      b.addEventListener("click", ()=>insertAtCursor($("#writeOut"), t + "\\n"));
      box.appendChild(b);
    });

    renderWriteChecklist();
    $("#writeFb").textContent = "";
    $("#writeFb").className = "feedback";
  }

  function countLines(text){
    return text ? text.split(/\\n+/).map(x=>x.trim()).filter(Boolean).length : 0;
  }

  function checkWriting(){
    addScore(0,1);
    const text = ($("#writeOut").value||"").trim();
    const checks = {
      subject: /subject:/i.test(text),
      ps: /(yesterday|last|ago|in \\d{4}|this morning).*(\\b\\w+ed\\b)/i.test(text) || /\\b(went|sent|made|did|saw|took|gave|came)\\b/i.test(text),
      pp: /\\b(have|has)\\b\\s+\\w+(ed|en)\\b/i.test(text) || /\\b(have|has)\\b\\s+(gone|done|sent|made|seen|taken|given|come)\\b/i.test(text),
      pc: /\\b(was|were)\\b\\s+\\w+ing\\b/i.test(text),
      time: /(today|tomorrow|by|before|end of the day|eod|friday|\\d{1,2}:\\d{2})/i.test(text),
      close: /(best regards|kind regards|sincerely|thank you)/i.test(text)
    };
    $$("#writeChecklist input").forEach(cb=>cb.checked = !!checks[cb.dataset.wck]);

    const L=lvl();
    const need = (L==="a2") ? 3 : (L==="b1" ? 4 : 5);
    const got = Object.values(checks).filter(Boolean).length;

    const lines = countLines(text);
    const lineOk = (lines>=8 && lines<=10) || (L==="a2" && lines>=6);

    const fb = $("#writeFb");
    if(got>=need && lineOk){
      fb.className = "feedback good";
      fb.textContent = `✅ Good. Checks: ${got}/6. Lines: ${lines}.`;
      addScore(1,0);
    }else{
      fb.className = "feedback bad";
      fb.textContent = `⚠️ Improve. Checks: ${got}/6 (target ${need}). Lines: ${lines} (target ~8–10).`;
    }
  }

  // ---------- wiring ----------
  function updateAccentButtons(){
    $("#accentUS").setAttribute("aria-pressed", state.accent==="US" ? "true" : "false");
    $("#accentUK").setAttribute("aria-pressed", state.accent==="UK" ? "true" : "false");
  }
  function updateTapButton(){
    $("#tapMode").setAttribute("aria-pressed", state.tapMode ? "true" : "false");
    $("#tapMode").textContent = state.tapMode ? "On" : "Off";
  }

  function newSet(quiet=false){
    stopSpeech(); stopTimer();
    state.seed = Math.floor(Math.random()*1e9);
    state.score = { c:0, t:0 };
    $("#scoreTxt").textContent = "0 / 0";

    renderTree();
    renderMap();
    buildChoiceQuestions();
    renderTimeline();
    renderStory();
    renderSW();

    if(!quiet) alert("New set ready.");
  }

  function wire(){
    $("#accentUS").addEventListener("click", ()=>{ state.accent="US"; updateAccentButtons(); });
    $("#accentUK").addEventListener("click", ()=>{ state.accent="UK"; updateAccentButtons(); });
    $("#tapMode").addEventListener("click", ()=>{ state.tapMode=!state.tapMode; updateTapButton(); });

    $("#resetAll").addEventListener("click", ()=>location.reload());
    $("#printPage").addEventListener("click", ()=>window.print());

    $("#newSet").addEventListener("click", ()=>newSet(false));
    $("#mapShow").addEventListener("click", renderMap);
    $("#mapSituation").addEventListener("change", renderMap);
    $("#mapListen").addEventListener("click", ()=>speak($("#mapOut").textContent || "", 1.0));

    $("#newChoice").addEventListener("click", buildChoiceQuestions);

    wireTimeline();
    $("#newTimeline").addEventListener("click", renderTimeline);
    $("#checkTimeline").addEventListener("click", checkTimeline);
    $("#timelineHint").addEventListener("click", ()=>{
      $("#timelineFb").className="feedback";
      $("#timelineFb").textContent = `Hint: ${state.current.timeline.hint}`;
    });

    $("#newStory").addEventListener("click", renderStory);
    $("#checkStory").addEventListener("click", checkStory);
    $("#storyHint").addEventListener("click", storyHint);
    $("#upgradeListen").addEventListener("click", ()=>speak($("#upgradeOut").value || "Please write your upgrade first.", 1.0));

    $("#newSW").addEventListener("click", renderSW);
    $("#startTimer").addEventListener("click", startTimer);
    $("#stopTimer").addEventListener("click", stopTimer);
    $("#speakListen").addEventListener("click", ()=>speak($("#speakPrompt").textContent || "", 1.0));

    $("#writeCheck").addEventListener("click", checkWriting);
    $("#writeClear").addEventListener("click", ()=>{
      $("#writeOut").value="";
      $("#writeFb").textContent="";
      $("#writeFb").className="feedback";
      $$("#writeChecklist input").forEach(x=>x.checked=false);
    });
    $("#writeListen").addEventListener("click", ()=>speak($("#writeOut").value || $("#writePrompt").textContent || "", 1.0));

    ["level","scenario","focus"].forEach(id=>{
      $("#"+id).addEventListener("change", ()=>newSet(true));
    });
  }

  function init(){
    updateAccentButtons();
    updateTapButton();
    renderTree();
    renderMap();
    wire();
    newSet(true);
  }
  init();
})();