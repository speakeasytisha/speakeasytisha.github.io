(() => {
  "use strict";

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const norm = s => (s||"").toLowerCase().replace(/\s+/g," ").trim();
  const shuffle = a => {
    a = a.slice();
    for (let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const pick = a => a[Math.floor(Math.random()*a.length)];

  const LS = "set_sabine_tense_bootcamp_v1";
  const state = load();

  function load(){
    try{
      const o = JSON.parse(localStorage.getItem(LS) || "{}");
      return {
        stage: o.stage || "1",
        fr: o.fr !== false,
        visualDetails: !!o.visualDetails
      };
    }catch(e){
      return {stage:"1", fr:true, visualDetails:false};
    }
  }
  function save(){ try{ localStorage.setItem(LS, JSON.stringify(state)); }catch(e){} }

  function speak(text){
    if(!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g," ").trim());
    u.rate = 0.92;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  const keywords = {
    ps: ["usually","every day","on Mondays","often","sometimes"],
    pc: ["now","right now","today","this week","at the moment"],
    gt: ["tomorrow","next week","soon","later today"],
    will:["I promise","OK","don’t worry","I’ll"]
  };

  const vocab = {
    ps: [
      {icon:"📩", en:"answer emails", fr:"répondre aux emails"},
      {icon:"📞", en:"call clients", fr:"appeler les clients"},
      {icon:"📅", en:"plan the timeline", fr:"planifier le déroulé"},
      {icon:"✅", en:"confirm appointments", fr:"confirmer les rendez-vous"},
      {icon:"🤝", en:"meet vendors", fr:"rencontrer les prestataires"},
      {icon:"🗂️", en:"prepare the schedule", fr:"préparer le planning"}
    ],
    pc: [
      {icon:"✉️", en:"sending an email", fr:"en train d’envoyer un email"},
      {icon:"📞", en:"calling the florist", fr:"en train d’appeler le fleuriste"},
      {icon:"🧾", en:"checking details", fr:"en train de vérifier les détails"},
      {icon:"📋", en:"updating the plan", fr:"en train de mettre à jour le plan"},
      {icon:"🏰", en:"visiting the venue", fr:"en train de visiter le lieu"},
      {icon:"🌸", en:"designing flowers", fr:"en train de concevoir les fleurs"}
    ],
    fut: [
      {icon:"🗓️", en:"book a meeting", fr:"réserver un rendez-vous"},
      {icon:"📩", en:"send the schedule", fr:"envoyer le planning"},
      {icon:"📞", en:"call you later", fr:"vous rappeler plus tard"},
      {icon:"✅", en:"confirm the booking", fr:"confirmer la réservation"},
      {icon:"🍽️", en:"schedule a tasting", fr:"programmer une dégustation"},
      {icon:"🚗", en:"visit the venue", fr:"visiter le lieu"}
    ]
  };

  const pronouns = ["I","You","We","They","He","She","It"];
  const be = {I:"am", You:"are", We:"are", They:"are", He:"is", She:"is", It:"is"};

  const verbs = [
    {base:"plan", s:"plans", ing:"planning"},
    {base:"call", s:"calls", ing:"calling"},
    {base:"send", s:"sends", ing:"sending"},
    {base:"confirm", s:"confirms", ing:"confirming"},
    {base:"meet", s:"meets", ing:"meeting"}
  ];
  const objects = ["the couple","the schedule","the florist","the venue manager","the timeline","an email"];

  const thirdForm = (pr)=> (pr==="He"||pr==="She"||pr==="It");

  function setFR(on){
    state.fr = !!on;
    $("#frState").textContent = state.fr ? "ON" : "OFF";
    $("#frBtn").setAttribute("aria-pressed", state.fr ? "true" : "false");
    $$(".fr").forEach(el => el.style.display = state.fr ? "" : "none");
    save();
  }

  function applyStage(){
    const s = state.stage;
    $$(".stage").forEach(sec=>{
      const st = sec.dataset.stage;
      sec.style.display = (s==="all" || s===st || (parseInt(st,10) <= parseInt(s,10))) ? "" : "none";
    });
    save();
  }

  function applyVisualDetails(){
    $$(".detail").forEach(d=> d.classList.toggle("show", state.visualDetails));
    save();
  }

  function renderChips(id, list){
    const root = $(id);
    if(!root) return;
    root.innerHTML = "";
    list.forEach(w=>{
      const span = document.createElement("span");
      span.className="chip";
      span.textContent=w;
      root.appendChild(span);
    });
  }

  function renderConjPS(){
    const tbody = $("#psConj");
    if(!tbody) return;
    const rows = [
      ["I","do","am","have","plan"],
      ["You","do","are","have","plan"],
      ["We","do","are","have","plan"],
      ["They","do","are","have","plan"],
      ["He","does","is","has","plans"],
      ["She","does","is","has","plans"],
      ["It","does","is","has","plans"]
    ];
    tbody.innerHTML = rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("");
  }

  function renderConjPC(){
    const tbody = $("#pcConj");
    if(!tbody) return;
    const rows = pronouns.map(p=>[p, be[p], `${be[p]} calling`]);
    tbody.innerHTML = rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  }

  function renderConjF(){
    const tbody = $("#fConj");
    if(!tbody) return;
    const rows = pronouns.map(p=>[p, `${be[p]} going to send`, `will send`]);
    tbody.innerHTML = rows.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  }

  function renderVocab(id, list){
    const root = $(id);
    if(!root) return;
    root.innerHTML = "";
    list.forEach(it=>{
      const div = document.createElement("div");
      div.className="vItem";
      div.innerHTML = `<div class="vIcon">${it.icon}</div><div><div>${it.en}</div><small class="fr">${it.fr}</small></div>`;
      root.appendChild(div);
    });
  }

  function bindOpenButtons(){
    $$("button[data-open]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const target = btn.getAttribute("data-open");
        const el = $(target);
        if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
      });
    });
  }

  function makePSQcm(){
    const v = pick(verbs);
    const obj = pick(objects);
    const pr = pick(pronouns);
    const correct = thirdForm(pr) ? v.s : v.base;
    const wrong1 = thirdForm(pr) ? v.base : v.s;
    const wrong2 = v.base + "ing";
    const prompt = `${pr} ________ ${obj} every day. (routine)`;
    const answer = `${pr} ${correct} ${obj} every day.`;
    const opts = shuffle([answer, `${pr} ${wrong1} ${obj} every day.`, `${pr} ${wrong2} ${obj} every day.`]);
    return {prompt, opts, answer, hint:"Look at the pronoun: he/she/it needs -s."};
  }

  function makePCQcm(){
    const v = pick(verbs);
    const obj = pick(objects);
    const pr = pick(pronouns);
    const prompt = `${pr} ________ ${obj} now. (now)`;
    const ps = `${pr} ${thirdForm(pr)?v.s:v.base} ${obj} now.`;
    const pc = `${pr} ${be[pr]} ${v.ing} ${obj} now.`;
    const gt = `${pr} ${be[pr]} going to ${v.base} ${obj} tomorrow.`;
    return {prompt, opts: shuffle([pc, ps, gt]), answer: pc, hint:"Key word: now / right now → Present Continuous."};
  }

  function makeFQcm(){
    const v = pick(verbs);
    const obj = pick(objects);
    const pr = pick(pronouns);
    const isPlan = Math.random() < 0.5;
    const prompt = isPlan
      ? `Sabine has a plan. ${pr} ________ ${obj} tomorrow.`
      : `Client is worried. Sabine: “OK, ${pr} ________ ${obj} today.”`;
    const gt = `${pr} ${be[pr]} going to ${v.base} ${obj} tomorrow.`;
    const will = `${pr} will ${v.base} ${obj} today.`;
    const ps = `${pr} ${thirdForm(pr)?v.s:v.base} ${obj} every week.`;
    return {prompt, opts: shuffle([gt, will, ps]), answer: isPlan ? gt : will, hint: isPlan ? "Plan → going to" : "Promise/decision now → will"};
  }

  function renderQcm(prefix, maker){
    const q = maker();
    $(`#${prefix}QcmPrompt`).textContent = q.prompt;
    const root = $(`#${prefix}QcmOpts`);
    root.innerHTML = "";
    q.opts.forEach(o=>{
      const b = document.createElement("button");
      b.type="button";
      b.className="optBtn";
      b.textContent=o;
      b.addEventListener("click", ()=>{
        $$(".optBtn", root).forEach(x=>x.classList.remove("good","bad"));
        const ok = norm(o) === norm(q.answer);
        b.classList.add(ok ? "good" : "bad");
        const fb = $(`#${prefix}QcmFb`);
        fb.className = "fb " + (ok ? "good" : "bad");
        fb.textContent = ok ? "✅ Correct." : `❌ Not yet.\nHint: ${q.hint}`;
      });
      root.appendChild(b);
    });
    const fb = $(`#${prefix}QcmFb`);
    fb.className="fb";
    fb.textContent = "Choose an option.";
    fb.dataset.hint = q.hint;
  }

  function renderFillPS(){
    const v = pick(verbs);
    const obj = pick(objects);
    const pr = pick(pronouns);
    const correct = thirdForm(pr) ? v.s : v.base;
    $("#psFillPrompt").textContent = `${pr} ________ ${obj} every week.`;
    const choices = shuffle([correct, thirdForm(pr)?v.base:v.s, v.ing]);
    const sel = $("#psFillSel");
    sel.innerHTML = `<option value="">— choose —</option>` + choices.map(x=>`<option value="${x}">${x}</option>`).join("");
    sel.dataset.answer = correct;
    $("#psFillFb").className="fb";
    $("#psFillFb").textContent = "Choose the correct form (he/she/it + -s).";
  }

  function renderFillPC(){
    const v = pick(verbs);
    const obj = pick(objects);
    const pr = pick(pronouns);
    const answer = `${be[pr]} ${v.ing}`;
    $("#pcFillPrompt").textContent = `${pr} ________ ${obj} right now.`;
    const choices = shuffle([answer, `${be[pr]} ${v.base}`, `${be[pr]} going to ${v.base}`]);
    const sel = $("#pcFillSel");
    sel.innerHTML = `<option value="">— choose —</option>` + choices.map(x=>`<option value="${x}">${x}</option>`).join("");
    sel.dataset.answer = answer;
    $("#pcFillFb").className="fb";
    $("#pcFillFb").textContent = "Choose am/is/are + -ing.";
  }

  function renderFillF(){
    const v = pick(verbs);
    const obj = pick(objects);
    const pr = pick(pronouns);
    const isPlan = Math.random() < 0.5;
    const answer = isPlan ? `${be[pr]} going to ${v.base}` : `will ${v.base}`;
    const tail = isPlan ? "tomorrow" : "today";
    $("#fFillPrompt").textContent = `${pr} ________ ${obj} ${tail}.`;
    const choices = shuffle([answer, `${be[pr]} ${v.ing}`, `${thirdForm(pr)?v.s:v.base}`]);
    const sel = $("#fFillSel");
    sel.innerHTML = `<option value="">— choose —</option>` + choices.map(x=>`<option value="${x}">${x}</option>`).join("");
    sel.dataset.answer = answer;
    $("#fFillFb").className="fb";
    $("#fFillFb").textContent = isPlan ? "Plan → going to" : "Promise/decision → will";
  }

  function checkFill(selId, fbId){
    const sel = $(selId);
    const fb = $(fbId);
    const ok = norm(sel.value) === norm(sel.dataset.answer);
    fb.className = "fb " + (ok ? "good" : "bad");
    fb.textContent = ok ? "✅ Correct." : "❌ Not yet. Check the form again.";
  }

  function sortGame({pileId, bins, fbId, makeCards}){
    const pile = $(pileId);
    const fb = $(fbId);
    let selected = null;
    let cards = [];

    function clearSelection(){
      selected = null;
      $$(".cardItem").forEach(c=>c.classList.remove("selected"));
    }

    function place(id, key){
      const c = cards.find(x=>x.id===id);
      if(!c) return;

      const el = $(`.cardItem[data-id="${id}"]`);
      if(!el) return;

      const bin = bins.find(x=>x.key===key);
      $(bin.dropId).appendChild(el);

      const ok = (c.answer === key);
      el.classList.remove("good","bad","selected");
      el.classList.add(ok ? "good" : "bad");
      fb.className = "fb " + (ok ? "good" : "bad");
      fb.textContent = ok ? "✅ Correct." : `❌ Not yet.\nHint: ${c.hint}`;

      clearSelection();
    }

    function render(){
      pile.innerHTML="";
      bins.forEach(b=> $(b.dropId).innerHTML="");
      cards.forEach(c=>{
        const el = document.createElement("div");
        el.className="cardItem";
        el.draggable = true;
        el.dataset.id = c.id;
        el.textContent = c.text;
        el.addEventListener("click", ()=>{
          selected = c.id;
          $$(".cardItem").forEach(x=>x.classList.toggle("selected", x.dataset.id===c.id));
        });
        el.addEventListener("dragstart", (e)=>{
          e.dataTransfer.setData("text/plain", c.id);
          selected = c.id;
        });
        pile.appendChild(el);
      });

      bins.forEach(b=>{
        const binEl = $(b.binId);
        const drop = $(b.dropId);
        binEl.onclick = ()=> { if(selected) place(selected, b.key); };

        drop.addEventListener("dragover", (e)=>{ e.preventDefault(); binEl.classList.add("active"); });
        drop.addEventListener("dragleave", ()=> binEl.classList.remove("active"));
        drop.addEventListener("drop", (e)=>{
          e.preventDefault();
          binEl.classList.remove("active");
          const id = e.dataTransfer.getData("text/plain");
          if(id) place(id, b.key);
        });
      });

      fb.className="fb";
      fb.textContent = "Tap a card, then tap a box.";
    }

    function newRound(){
      cards = makeCards().map((c,i)=>({id:`c${i}_${Math.random().toString(16).slice(2)}`, ...c}));
      render();
    }

    return {newRound};
  }

  let psSort, pcSort, fSort, mixSort;

  function initSorters(){
    psSort = sortGame({
      pileId:"#psSortPile",
      fbId:"#psSortFb",
      bins:[
        {key:"ps", binId:"#psBinPS", dropId:"#psDropPS"},
        {key:"other", binId:"#psBinOther", dropId:"#psDropOther"}
      ],
      makeCards: ()=>{
        const ps = shuffle(keywords.ps).slice(0,4).map(w=>({text:w, answer:"ps", hint:"Present Simple marker"}));
        const other = shuffle([...keywords.pc, ...keywords.gt]).slice(0,4).map(w=>({text:w, answer:"other", hint:"Not routine"}));
        return shuffle([...ps, ...other]);
      }
    });

    pcSort = sortGame({
      pileId:"#pcSortPile",
      fbId:"#pcSortFb",
      bins:[
        {key:"pc", binId:"#pcBinPC", dropId:"#pcDropPC"},
        {key:"other", binId:"#pcBinOther", dropId:"#pcDropOther"}
      ],
      makeCards: ()=>{
        const pc = shuffle(keywords.pc).slice(0,4).map(w=>({text:w, answer:"pc", hint:"Now marker"}));
        const other = shuffle([...keywords.ps, ...keywords.gt]).slice(0,4).map(w=>({text:w, answer:"other", hint:"Not now"}));
        return shuffle([...pc, ...other]);
      }
    });

    fSort = sortGame({
      pileId:"#fSortPile",
      fbId:"#fSortFb",
      bins:[
        {key:"plan", binId:"#fBinPlan", dropId:"#fDropPlan"},
        {key:"promise", binId:"#fBinPromise", dropId:"#fDropPromise"}
      ],
      makeCards: ()=>{
        const plan = [
          {text:"tomorrow", answer:"plan", hint:"Plan word"},
          {text:"next week", answer:"plan", hint:"Plan word"},
          {text:"soon", answer:"plan", hint:"Plan word"},
          {text:"later today", answer:"plan", hint:"Plan word"},
        ];
        const prom = [
          {text:"I promise", answer:"promise", hint:"Promise word"},
          {text:"OK, I will", answer:"promise", hint:"Decision now"},
          {text:"Don’t worry", answer:"promise", hint:"Reassurance"},
          {text:"I’ll do it", answer:"promise", hint:"Promise"},
        ];
        return shuffle([...plan, ...prom]);
      }
    });

    mixSort = sortGame({
      pileId:"#mixPile",
      fbId:"#mixSortFb",
      bins:[
        {key:"ps", binId:"#mixBinPS", dropId:"#mixDropPS"},
        {key:"pc", binId:"#mixBinPC", dropId:"#mixDropPC"},
        {key:"fut", binId:"#mixBinF", dropId:"#mixDropF"}
      ],
      makeCards: ()=>{
        const v = pick(verbs);
        const obj = pick(objects);
        const sents = [
          {text:`I ${v.base} ${obj} every week.`, answer:"ps", hint:"Routine"},
          {text:`I am ${v.ing} ${obj} now.`, answer:"pc", hint:"Now"},
          {text:`I am going to ${v.base} ${obj} tomorrow.`, answer:"fut", hint:"Plan"},
          {text:`I will ${v.base} ${obj} today.`, answer:"fut", hint:"Promise"},
          {text:"The ceremony starts at 3:00 PM.", answer:"fut", hint:"Schedule (future meaning)"}
        ];
        return shuffle(sents);
      }
    });

    psSort.newRound();
    pcSort.newRound();
    fSort.newRound();
    mixSort.newRound();
  }

  function renderSpeak(gridId, cards){
    const root = $(gridId);
    if(!root) return;
    root.innerHTML="";
    cards.forEach(c=>{
      const div = document.createElement("div");
      div.className="sCard";
      div.innerHTML = `
        <div class="sTitle">${c.title}</div>
        <div class="sLines">${c.lines}</div>
        <div class="row" style="margin-top:10px">
          <button class="btn small speakListen">🔊 Listen</button>
          <button class="btn small speakModel">👀 Model</button>
        </div>
        <div class="sModel">${c.model}</div>
      `;
      div.querySelector(".speakListen").addEventListener("click", ()=> speak(c.lines.replace(/\n/g," ")));
      div.querySelector(".speakModel").addEventListener("click", ()=> div.classList.toggle("open"));
      root.appendChild(div);
    });
  }

  function makeMixQcm(){
    const v = pick(verbs);
    const obj = pick(objects);
    const type = pick(["ps","pc","gt","will","sched"]);
    let prompt, answer, hint;
    if(type==="ps"){
      prompt = `Sabine ________ ${obj} every week. (routine)`;
      answer = "Present Simple";
      hint = "every week / usually";
    }else if(type==="pc"){
      prompt = `Right now, Sabine ________ ${obj}. (now)`;
      answer = "Present Continuous";
      hint = "now / right now";
    }else if(type==="gt"){
      prompt = `Sabine has a plan. She ________ ${obj} tomorrow.`;
      answer = "Future (going to)";
      hint = "plan / intention";
    }else if(type==="will"){
      prompt = `Client is worried. Sabine: “OK, I ________ ${obj} today.”`;
      answer = "Future (will)";
      hint = "promise / decision now";
    }else{
      prompt = `The ceremony ________ at 3:00 PM. (schedule)`;
      answer = "Present Simple (schedule)";
      hint = "starts at / official schedule";
    }
    const opts = ["Present Simple","Present Continuous","Future (going to)","Future (will)","Present Simple (schedule)"];
    return {prompt, answer, hint, opts: shuffle(opts)};
  }

  function renderMixQcm(){
    const q = makeMixQcm();
    $("#mixPrompt").textContent = q.prompt;
    const root = $("#mixOpts");
    root.innerHTML="";
    q.opts.forEach(o=>{
      const b = document.createElement("button");
      b.className="optBtn";
      b.type="button";
      b.textContent=o;
      b.addEventListener("click", ()=>{
        $$(".optBtn", root).forEach(x=>x.classList.remove("good","bad"));
        const ok = norm(o)===norm(q.answer);
        b.classList.add(ok?"good":"bad");
        const fb = $("#mixFb");
        fb.className = "fb " + (ok?"good":"bad");
        fb.textContent = ok ? "✅ Correct." : `❌ Not yet.\nHint: ${q.hint}`;
      });
      root.appendChild(b);
    });
    const fb = $("#mixFb");
    fb.className="fb";
    fb.textContent="Choose the tense.";
    fb.dataset.hint = q.hint;
  }

  function init(){
    $("#stageSel").value = state.stage;
    $("#stageSel").addEventListener("change", (e)=>{
      state.stage = e.target.value;
      applyStage();
    });

    setFR(state.fr);
    $("#frBtn").addEventListener("click", ()=> setFR(!state.fr));

    $("#printBtn").addEventListener("click", ()=> window.print());

    $("#resetBtn").addEventListener("click", ()=>{
      localStorage.removeItem(LS);
      location.reload();
    });

    applyVisualDetails();
    $("#visualToggle").addEventListener("click", ()=>{
      state.visualDetails = !state.visualDetails;
      applyVisualDetails();
    });

    bindOpenButtons();

    renderChips("#psKeywords", keywords.ps);
    renderChips("#pcKeywords", keywords.pc);
    renderChips("#fKeywords", [...keywords.gt, ...keywords.will]);

    renderConjPS();
    renderConjPC();
    renderConjF();

    renderVocab("#psVocab", vocab.ps);
    renderVocab("#pcVocab", vocab.pc);
    renderVocab("#fVocab", vocab.fut);

    renderQcm("ps", makePSQcm);
    $("#psQcmNew").addEventListener("click", ()=> renderQcm("ps", makePSQcm));
    $("#psQcmHint").addEventListener("click", ()=> {
      const fb = $("#psQcmFb");
      fb.className="fb";
      fb.textContent = "Hint: " + (fb.dataset.hint || "he/she/it + -s");
    });

    renderQcm("pc", makePCQcm);
    $("#pcQcmNew").addEventListener("click", ()=> renderQcm("pc", makePCQcm));
    $("#pcQcmHint").addEventListener("click", ()=> {
      const fb = $("#pcQcmFb");
      fb.className="fb";
      fb.textContent = "Hint: " + (fb.dataset.hint || "now → -ing");
    });

    renderQcm("f", makeFQcm);
    $("#fQcmNew").addEventListener("click", ()=> renderQcm("f", makeFQcm));
    $("#fQcmHint").addEventListener("click", ()=> {
      const fb = $("#fQcmFb");
      fb.className="fb";
      fb.textContent = "Hint: " + (fb.dataset.hint || "plan vs promise");
    });

    renderFillPS();
    $("#psFillNew").addEventListener("click", renderFillPS);
    $("#psFillCheck").addEventListener("click", ()=> checkFill("#psFillSel", "#psFillFb"));

    renderFillPC();
    $("#pcFillNew").addEventListener("click", renderFillPC);
    $("#pcFillCheck").addEventListener("click", ()=> checkFill("#pcFillSel", "#pcFillFb"));

    renderFillF();
    $("#fFillNew").addEventListener("click", renderFillF);
    $("#fFillCheck").addEventListener("click", ()=> checkFill("#fFillSel", "#fFillFb"));

    initSorters();
    $("#psSortNew").addEventListener("click", ()=> psSort.newRound());
    $("#psSortReset").addEventListener("click", ()=> psSort.newRound());

    $("#pcSortNew").addEventListener("click", ()=> pcSort.newRound());
    $("#pcSortReset").addEventListener("click", ()=> pcSort.newRound());

    $("#fSortNew").addEventListener("click", ()=> fSort.newRound());
    $("#fSortReset").addEventListener("click", ()=> fSort.newRound());

    $("#mixReset").addEventListener("click", ()=> mixSort.newRound());

    renderSpeak("#psSpeakGrid", [
      {title:"Client introduction (routine)", lines:"Hello, this is Sabine Martin.\nI plan wedding timelines and I coordinate vendors.\nI answer emails every day.", model:"Model:\nHello, this is Sabine Martin.\nI plan wedding timelines and I coordinate vendors.\nI answer emails every day."},
      {title:"Daily tasks", lines:"I call clients.\nI confirm appointments.\nI prepare the schedule.", model:"Model:\nI call clients.\nI confirm appointments.\nI prepare the schedule."},
      {title:"Vendor routine", lines:"I meet vendors every week.\nI check details.\nI update the timeline.", model:"Model:\nI meet vendors every week.\nI check details.\nI update the timeline."}
    ]);

    renderSpeak("#pcSpeakGrid", [
      {title:"Right now update", lines:"Hello.\nI’m calling the florist right now.\nI’m checking the details today.", model:"Model:\nHello.\nI’m calling the florist right now.\nI’m checking the details today."},
      {title:"This week", lines:"This week, I’m updating the plan.\nI’m visiting the venue.\nI’m sending an email today.", model:"Model:\nThis week, I’m updating the plan.\nI’m visiting the venue.\nI’m sending an email today."},
      {title:"In progress", lines:"I’m preparing the schedule.\nI’m meeting a vendor.\nI’m confirming the booking.", model:"Model:\nI’m preparing the schedule.\nI’m meeting a vendor.\nI’m confirming the booking."}
    ]);

    renderSpeak("#fSpeakGrid", [
      {title:"Plan (going to)", lines:"Tomorrow, I’m going to call you.\nI’m going to send the schedule next week.", model:"Model:\nTomorrow, I’m going to call you.\nI’m going to send the schedule next week."},
      {title:"Promise (will)", lines:"Don’t worry.\nI will confirm the details today.\nI will call you this afternoon.", model:"Model:\nDon’t worry.\nI will confirm the details today.\nI will call you this afternoon."},
      {title:"Plan + promise", lines:"I’m going to book a meeting.\nI will follow up today.", model:"Model:\nI’m going to book a meeting.\nI will follow up today."}
    ]);

    renderSpeak("#mixSpeakGrid", [
      {title:"Routine + now + next step", lines:"I plan the timeline every week.\nRight now, I’m calling the florist.\nTomorrow, I’m going to send the schedule.", model:"Model:\nI plan the timeline every week.\nRight now, I’m calling the florist.\nTomorrow, I’m going to send the schedule."},
      {title:"Client reassurance", lines:"I answer emails every day.\nI’m checking the details now.\nDon’t worry — I will call you today.", model:"Model:\nI answer emails every day.\nI’m checking the details now.\nDon’t worry — I will call you today."},
      {title:"Schedule line", lines:"The ceremony starts at 3:00 PM.\nI’m meeting the couple today.\nI’m going to confirm the booking tomorrow.", model:"Model:\nThe ceremony starts at 3:00 PM.\nI’m meeting the couple today.\nI’m going to confirm the booking tomorrow."}
    ]);

    renderMixQcm();
    $("#mixNew").addEventListener("click", ()=>{
      renderMixQcm();
      mixSort.newRound();
    });
    $("#mixHint").addEventListener("click", ()=>{
      const fb = $("#mixFb");
      fb.className="fb";
      fb.textContent = "Hint: usually/every day → PS | now → PC | plan → going to | promise → will | schedule → Present Simple (future meaning).";
    });

    applyStage();
  }

  init();
})();