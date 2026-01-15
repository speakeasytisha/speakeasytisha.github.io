/* SpeakEasyTisha · School Support (ELL/ML/ESL · IEP · 504) — follow‑up lesson
   - US/UK accent TTS
   - Global score (saved)
   - Flashcards with icons + optional French help
   - Drag OR Tap mode: sort supports, sequence ELL steps, match portals, sentence order
   - Locator tool: search phrases + email/phone script
   - Dialogue builder: interpreter + screening + evaluation
   - Rubric tool: choosing schools
*/
(function(){
  "use strict";

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const store = {
    get(key, fallback){
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch(e){ return fallback; }
    },
    set(key, val){
      try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){}
    }
  };

  const state = {
    accent: store.get("ss2_accent","us"),
    frHelp: store.get("ss2_frHelp","off"),
    score: store.get("ss2_score",0),
    awarded: store.get("ss2_awarded",{}),
    touch: (navigator.maxTouchPoints || 0) > 0
  };

  function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      const t=a[i]; a[i]=a[j]; a[j]=t;
    }
    return a;
  }
  function esc(s){
    return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;", '"':"&quot;" }[c]));
  }

  /* -------------------------
     Score
  --------------------------*/
  function setScore(n){
    state.score = n;
    store.set("ss2_score", state.score);
    $("#scoreNow").textContent = String(state.score);
    $("#scoreNow2").textContent = String(state.score);
  }
  function addPoints(key, pts){
    if(state.awarded[key]) return;
    state.awarded[key] = true;
    store.set("ss2_awarded", state.awarded);
    setScore(state.score + pts);
  }

  /* -------------------------
     TTS
  --------------------------*/
  let cachedVoices = [];
  function loadVoices(){
    cachedVoices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return cachedVoices;
  }
  if(window.speechSynthesis){
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }
  function pickVoice(){
    const voices = cachedVoices && cachedVoices.length ? cachedVoices : loadVoices();
    const want = state.accent === "uk" ? ["en-GB","en_GB"] : ["en-US","en_US"];
    for(const tag of want){
      const v = voices.find(x => (x.lang || "").toLowerCase() === tag.toLowerCase());
      if(v) return v;
    }
    const anyEn = voices.find(x => (x.lang || "").toLowerCase().startsWith("en"));
    return anyEn || null;
  }
  function speak(text){
    if(!window.speechSynthesis) return false;
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if(v) u.voice = v;
      u.rate = 1;
      u.pitch = 1;
      speechSynthesis.speak(u);
      return true;
    }catch(e){ return false; }
  }

  /* -------------------------
     Controls
  --------------------------*/
  function syncControls(){
    $("#accentSelect").value = state.accent;
    $("#frHelpSelect").value = state.frHelp;
    $("#locFR").hidden = (state.frHelp !== "on");
    $("#dlgFR").hidden = (state.frHelp !== "on");
  }

  $("#accentSelect").addEventListener("change", (e)=>{
    state.accent = e.target.value;
    store.set("ss2_accent", state.accent);
  });
  $("#frHelpSelect").addEventListener("change", (e)=>{
    state.frHelp = e.target.value;
    store.set("ss2_frHelp", state.frHelp);
    syncControls();
    renderFlashcard();
  });

  $("#btnSpeakTest").addEventListener("click", ()=>{
    const ok = speak(state.accent === "uk" ? "Hello! This is a British voice test." : "Hello! This is an American voice test.");
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  });

  /* -------------------------
     Quick reveal definitions
  --------------------------*/
  const quick = [
    { term:"ELL / EL / ML", body:"A student learning English (often called English Learner or Multilingual Learner). Schools provide language support so the child can access lessons." , fr:"Élève allophone / apprenant d’anglais." , icon:"🗣️"},
    { term:"ESL", body:"English as a Second Language. Often the name of the class/teacher/program supporting English learners." , fr:"Cours/soutien d’anglais langue seconde." , icon:"📘"},
    { term:"IEP", body:"An Individualized Education Program for students eligible for special education services (IDEA law)." , fr:"Projet personnalisé (handicap) avec services." , icon:"🧩"},
    { term:"504 Plan", body:"A plan for accommodations so a student with a disability can access school (Section 504)." , fr:"Aménagements (sans forcément “éducation spécialisée”).", icon:"♿"},
    { term:"Interpreter", body:"A person who translates spoken communication between school and family for meetings and key information." , fr:"Interprète (souvent fourni pour communiquer).", icon:"🗨️"}
  ];

  function renderQuick(){
    const root = $("#revealQuick");
    root.innerHTML = "";
    quick.forEach((q, idx)=>{
      const div = document.createElement("div");
      div.className = "reveal";
      div.innerHTML = `
        <div class="reveal__head" role="button" tabindex="0" aria-expanded="false">
          <div class="reveal__title">${q.icon} ${esc(q.term)}</div>
          <div class="muted2">Tap ▾</div>
        </div>
        <div class="reveal__body">${esc(q.body)} ${state.frHelp==="on" ? `<div class="small" style="margin-top:8px; opacity:.95"><b>FR:</b> ${esc(q.fr)}</div>` : ""}</div>
      `;
      const head = $(".reveal__head", div);
      head.addEventListener("click", ()=> toggleReveal(div));
      head.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggleReveal(div);} });
      root.appendChild(div);
    });
  }
  function toggleReveal(div){
    const open = div.classList.toggle("open");
    const head = $(".reveal__head", div);
    if(head) head.setAttribute("aria-expanded", open ? "true" : "false");
    addPoints("quickReveal", 5);
  }
  $("#btnQuickSpeak").addEventListener("click", ()=>{
    const text = "ELL or ML means English learner or multilingual learner. ESL is English as a Second Language support. IEP is a special education plan under IDEA. A 504 plan is for accommodations. You can request an interpreter for meetings.";
    const ok = speak(text);
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  });

  /* -------------------------
     Flashcards
  --------------------------*/
  const fcCards = [
    // ELL/ML
    { theme:"ELL / ML & ESL", icon:"🗣️", term:"English Learner (EL/ELL)", def:"A student learning English who may receive language support services.", ex:"My child is an English learner. How will you support them?", fr:"Élève allophone / apprenant d’anglais." },
    { theme:"ELL / ML & ESL", icon:"🌍", term:"Multilingual Learner (ML)", def:"A student who uses multiple languages and is developing English proficiency.", ex:"The ML program supports language and content learning.", fr:"Élève plurilingue / multilingue." },
    { theme:"ELL / ML & ESL", icon:"📘", term:"ESL", def:"English as a Second Language—often the class, teacher, or program that supports English learners.", ex:"He has ESL support twice a week.", fr:"Soutien d’anglais langue seconde." },
    { theme:"ELL / ML & ESL", icon:"📝", term:"Home Language Survey (HLS)", def:"Questions during enrollment about languages used at home; it can trigger language screening.", ex:"We completed the home language survey.", fr:"Questionnaire langue à la maison." },
    { theme:"ELL / ML & ESL", icon:"🧪", term:"Language screening", def:"A short assessment used to decide if a student qualifies for EL services and what level.", ex:"They will screen her English skills.", fr:"Test de positionnement / évaluation de langue." },
    { theme:"ELL / ML & ESL", icon:"📊", term:"Annual English proficiency test", def:"Many states use an annual test to monitor progress and determine when students exit EL status.", ex:"The annual test tracks growth in English.", fr:"Test annuel de progression (selon l’État)." },
    { theme:"ELL / ML & ESL", icon:"🏫", term:"Sheltered instruction (SEI / sheltered)", def:"Teaching content in English with strategies that make it understandable for EL students.", ex:"Science is taught with sheltered strategies.", fr:"Enseignement en anglais avec supports adaptés." },
    { theme:"ELL / ML & ESL", icon:"👥", term:"Push-in / co-teaching", def:"An EL teacher supports students inside the regular classroom (co-teaching).", ex:"The ESL teacher co-teaches during literacy.", fr:"Co‑intervention en classe." },
    { theme:"ELL / ML & ESL", icon:"🚪", term:"Pull-out ESL", def:"An EL student leaves the classroom for a short ESL session in a small group.", ex:"He has pull-out ESL three times a week.", fr:"Soutien en petit groupe hors classe." },

    // Special education
    { theme:"IEP / 504 / MTSS", icon:"🧩", term:"IEP", def:"Individualized Education Program: a plan with special education services and goals for eligible students.", ex:"We would like to discuss an IEP evaluation.", fr:"Projet personnalisé avec services (IDEA)." },
    { theme:"IEP / 504 / MTSS", icon:"📄", term:"Evaluation", def:"Testing and observations to determine if a student is eligible for special education services.", ex:"The school needs parent consent to evaluate.", fr:"Évaluation / bilan." },
    { theme:"IEP / 504 / MTSS", icon:"✍️", term:"Consent", def:"Parent permission for evaluations and some services.", ex:"Please send the consent form.", fr:"Consentement des parents." },
    { theme:"IEP / 504 / MTSS", icon:"♿", term:"504 Plan", def:"A plan for accommodations so a student with a disability can access education.", ex:"A 504 plan may include extra time or seating.", fr:"Aménagements (Section 504)." },
    { theme:"IEP / 504 / MTSS", icon:"📈", term:"Progress monitoring", def:"Regular checks to see if a support is working.", ex:"They monitor reading progress every two weeks.", fr:"Suivi des progrès." },
    { theme:"IEP / 504 / MTSS", icon:"🛟", term:"MTSS / RTI", def:"A multi-tier support system: small-group help, interventions, and monitoring for students who need extra support.", ex:"We can start MTSS interventions in reading.", fr:"Système d’aides (interventions) en paliers." },

    // Family access
    { theme:"Family access", icon:"🗨️", term:"Interpreter", def:"A spoken-language interpreter for meetings and key information when needed.", ex:"Do you have an interpreter available for meetings?", fr:"Interprète (oral)." },
    { theme:"Family access", icon:"📝", term:"Translation", def:"Written information in a language families understand when needed for meaningful access.", ex:"Can you provide translated forms?", fr:"Traduction (écrit)." },
    { theme:"Family access", icon:"🧑‍💼", term:"Registrar", def:"The office/person who handles enrollment paperwork and residency checks.", ex:"The registrar can explain required documents.", fr:"Service d’inscription / secrétariat." },
    { theme:"Family access", icon:"🧑‍🏫", term:"Case manager", def:"A staff member who coordinates a student’s IEP services.", ex:"The case manager will schedule the IEP meeting.", fr:"Référent / coordinateur." },

    // Portals
    { theme:"Portals & tools", icon:"🖥️", term:"SIS (Student Information System)", def:"A system for attendance, grades, schedules, and family contacts (parent portal).", ex:"Check attendance and grades in the SIS portal.", fr:"Portail parents (données scolaires)." },
    { theme:"Portals & tools", icon:"📱", term:"Infinite Campus", def:"A common SIS platform with parent/student portal apps used by many districts.", ex:"We activated our Campus Parent account.", fr:"Plateforme/portail (Infinite Campus)." },
    { theme:"Portals & tools", icon:"🔐", term:"PowerSchool", def:"A common SIS platform; many districts use the PowerSchool Parent Portal.", ex:"Log in to PowerSchool to see grades.", fr:"Plateforme/portail (PowerSchool)." },
    { theme:"Portals & tools", icon:"🧑‍💻", term:"LMS (Learning Management System)", def:"A platform for class materials and assignments (Canvas, Schoology, etc.).", ex:"Assignments are posted in the LMS.", fr:"Plateforme de cours/devoirs (Canvas/Schoology…)." },
    { theme:"Portals & tools", icon:"📣", term:"Communication app", def:"Tools for messages and announcements (ParentSquare, Remind, email/text).", ex:"The school sends updates through ParentSquare.", fr:"Outil de communication (messages)." }
  ];

  let fcTheme = "ELL / ML & ESL";
  let fcDeck = [];
  let fcIndex = 0;

  function initFlashThemes(){
    const themes = Array.from(new Set(fcCards.map(c=>c.theme)));
    const sel = $("#fcTheme");
    sel.innerHTML = themes.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("");
    fcTheme = themes[0];
    sel.value = fcTheme;
    sel.addEventListener("change", ()=>{
      fcTheme = sel.value;
      buildDeck();
      fcIndex = 0;
      renderFlashcard();
    });
  }
  function buildDeck(){ fcDeck = shuffle(fcCards.filter(c=>c.theme===fcTheme)); }
  function renderFlashcard(){
    if(!fcDeck.length) buildDeck();
    fcIndex = clamp(fcIndex, 0, fcDeck.length-1);
    const c = fcDeck[fcIndex];
    $("#fcIcon").textContent = c.icon;
    $("#fcTerm").textContent = c.term;
    $("#fcDef").textContent = c.def;
    $("#fcExample").textContent = "Example: " + c.ex;
    const frBox = $("#fcFR");
    if(state.frHelp === "on" && c.fr){
      frBox.textContent = "FR: " + c.fr;
      frBox.style.display = "";
    }else{
      frBox.textContent = "";
      frBox.style.display = "none";
    }
    $("#flashcard").classList.remove("flipped");
  }
  $("#flashcard").addEventListener("click", ()=> $("#flashcard").classList.toggle("flipped"));
  $("#flashcard").addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); $("#flashcard").classList.toggle("flipped"); }});
  $("#fcPrev").addEventListener("click", ()=>{ fcIndex--; renderFlashcard(); });
  $("#fcNext").addEventListener("click", ()=>{ fcIndex++; renderFlashcard(); });
  $("#fcShuffle").addEventListener("click", ()=>{ buildDeck(); fcIndex=0; renderFlashcard(); addPoints("flashcards", 10); });
  $("#fcSpeak").addEventListener("click", ()=>{
    const c = fcDeck[fcIndex];
    const text = `${c.term}. ${c.def}. ${c.ex}`;
    const ok = speak(text);
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  });

  /* -------------------------
     Sort supports game
  --------------------------*/
  const sortSupportsData = [
    { id:"hls", icon:"📝", label:"Home Language Survey", sub:"enrollment questions", bin:"ell" },
    { id:"screen", icon:"🧪", label:"English screening test", sub:"EL identification", bin:"ell" },
    { id:"esl", icon:"📘", label:"ESL teacher / services", sub:"language support", bin:"ell" },
    { id:"iep", icon:"🧩", label:"IEP", sub:"special education plan", bin:"iep" },
    { id:"eval", icon:"📄", label:"Special education evaluation", sub:"with consent", bin:"iep" },
    { id:"accom", icon:"♿", label:"Classroom accommodations", sub:"access supports", bin:"p504" },
    { id:"p504", icon:"♿", label:"504 Plan", sub:"accommodations plan", bin:"p504" },
    { id:"mtss", icon:"🛟", label:"Small‑group reading intervention", sub:"progress checks", bin:"mtss" }
  ];
  const sortState = { selected:null };

  function renderSortSupports(){
    const root = $("#sortSupports");
    const pool = $(".sort__pool", root);
    const drops = $$(".bin__drop", root);
    pool.innerHTML = "";
    drops.forEach(d=> d.innerHTML="");
    sortState.selected = null;
    shuffle(sortSupportsData).forEach(c=>{
      const el = document.createElement("div");
      el.className = "cardTile";
      el.draggable = !state.touch;
      el.dataset.id = c.id;
      el.innerHTML = `
        <div class="tileIcon">${c.icon}</div>
        <div class="tileCol">
          <div class="tileText">${esc(c.label)}</div>
          <div class="tileSub">${esc(c.sub)}</div>
        </div>`;
      el.addEventListener("click", ()=> selectSortTile(el, root));
      el.addEventListener("dragstart", ev=> ev.dataTransfer.setData("text/plain", c.id));
      pool.appendChild(el);
    });

    drops.forEach(drop=>{
      drop.addEventListener("dragover", ev=>{ ev.preventDefault(); drop.classList.add("over"); });
      drop.addEventListener("dragleave", ()=> drop.classList.remove("over"));
      drop.addEventListener("drop", ev=>{
        ev.preventDefault(); drop.classList.remove("over");
        const id = ev.dataTransfer.getData("text/plain");
        const tile = $(`.cardTile[data-id="${CSS.escape(id)}"]`, root);
        if(tile) placeTile(tile, drop, pool);
      });
      drop.addEventListener("click", ()=>{
        if(sortState.selected) placeTile(sortState.selected, drop, pool);
      });
    });

    $("#fb_sortSupports").textContent = "";
    $("#fb_sortSupports").className = "feedback";
  }

  function selectSortTile(tile, root){
    $$(".cardTile", root).forEach(x=>x.classList.remove("selected"));
    if(sortState.selected === tile){
      sortState.selected = null;
      return;
    }
    tile.classList.add("selected");
    sortState.selected = tile;
  }

  function placeTile(tile, drop, pool){
    // allow one tile per drop; swap back
    const existing = $(".cardTile", drop);
    if(existing){
      existing.classList.remove("selected");
      pool.appendChild(existing);
    }
    tile.classList.remove("selected");
    drop.appendChild(tile);
    sortState.selected = null;
  }

  function hintSortSupports(){
    const fb = $("#fb_sortSupports");
    fb.className = "feedback warn";
    fb.textContent = state.frHelp==="on"
      ? "Astuce: ELL = langue. IEP/504 = handicap/accès. MTSS/RTI = soutien pour progrès (souvent en petits groupes)."
      : "Hint: ELL is language support. IEP/504 are disability-related supports. MTSS/RTI are tiered interventions for extra help.";
  }
  function checkSortSupports(){
    const root = $("#sortSupports");
    let correct = 0;
    sortSupportsData.forEach(c=>{
      const tile = $(`.cardTile[data-id="${CSS.escape(c.id)}"]`, root);
      if(!tile || !tile.parentElement) return;
      const drop = tile.parentElement.dataset && tile.parentElement.dataset.drop;
      if(drop === c.bin) correct++;
    });
    const fb = $("#fb_sortSupports");
    if(correct === sortSupportsData.length){
      fb.className = "feedback good";
      fb.textContent = "Great! ✅ You sorted everything correctly.";
      addPoints("sortSupports", 35);
    }else{
      fb.className = "feedback bad";
      fb.textContent = `Not yet: ${correct}/${sortSupportsData.length} correct. Try again.`;
    }
  }

  /* -------------------------
     Need ELL self-check
  --------------------------*/
  function needSuggestion(){
    const lang = $("#need_lang").value;
    const conf = $("#need_conf").value;
    const grade = $("#need_grade").value;
    const prev = $("#need_prev").value;

    let out = "";
    let next = "";

    if(lang !== "english"){
      out += "✅ Because your home language is not only English, ask the school about the Home Language Survey and English screening. ";
      next += "Ask: “Will you screen my child for EL services? When will support start?” ";
    }else{
      out += "If you mostly use English at home, EL screening may not be needed, but you can still ask if the school offers support for newcomers. ";
    }

    if(conf === "low" || prev === "no"){
      out += "Your child may benefit from structured ESL/ELL support at the beginning. ";
      next += "Ask: “Is support push-in, pull-out, or co-teaching? How many minutes per week?” ";
    }else{
      out += "If confidence is medium/high, the school may monitor progress and adjust supports. ";
      next += "Ask: “How do you monitor English progress and decide when to exit services?” ";
    }

    if(grade === "high"){
      out += "In high school, ask about course placement, credits, and graduation requirements. ";
      next += "Ask: “Can we meet the guidance counselor to plan the schedule?” ";
    }else if(grade === "mid"){
      out += "In middle school, ask about electives, counseling, and after-school tutoring. ";
    }else if(grade === "prek"){
      out += "For Pre-K/K, ask about early literacy routines, classroom language supports, and how families communicate. ";
    }

    if(state.frHelp === "on"){
      out += "\n\nFR: Vous pouvez demander: “Do you have an interpreter available?” et “How many minutes per week of ESL support?”";
    }

    $("#needOut").textContent = out + "\n\nNext steps: " + next;
    addPoints("needCheck", 15);
  }

  $("#needCheck").addEventListener("click", needSuggestion);
  $("#needReset").addEventListener("click", ()=>{
    $("#need_lang").value = "other";
    $("#need_conf").value = "medium";
    $("#need_grade").value = "elem";
    $("#need_prev").value = "no";
    $("#needOut").textContent = "";
  });

  /* -------------------------
     Where cards (where/when)
  --------------------------*/
  const whereCards = [
    { icon:"🏫", title:"In the classroom", body:"Often the EL teacher supports inside class (push-in/co-teaching) so the student learns content with language support." },
    { icon:"🚪", title:"Small group pull-out", body:"Some schools pull EL students out for short ESL lessons (vocabulary, grammar, speaking, writing)." },
    { icon:"🕒", title:"During the school day", body:"Most EL and IEP services happen during school hours. After‑school tutoring may be optional." },
    { icon:"📅", title:"Meetings (with interpreter)", body:"You can request an interpreter for enrollment, parent‑teacher conferences, and IEP/504 meetings when needed." }
  ];
  function renderWhere(){
    const root = $("#whereCards");
    root.innerHTML = "";
    whereCards.forEach(c=>{
      const div = document.createElement("div");
      div.className = "infoCard";
      div.innerHTML = `
        <div class="infoCard__title">${c.icon} ${esc(c.title)}</div>
        <div class="infoCard__body">${esc(c.body)}</div>
      `;
      root.appendChild(div);
    });
  }

  /* -------------------------
     Quiz: Cost/free
  --------------------------*/
  const quizCost = [
    {
      id:"c1",
      q:"In a public school, do families typically pay extra for ELL/ESL services?",
      options:[
        {t:"Yes, it is a private service", ok:false, h:"Public school language support is typically provided as part of the school program."},
        {t:"No, it is generally provided at no cost in public schools", ok:true, h:"Correct — public schools provide language services for eligible students."},
        {t:"Only if you are not a citizen", ok:false, h:"Citizenship is not the rule here; eligibility is based on language needs."}
      ],
      pts:10
    },
    {
      id:"c2",
      q:"Do you usually pay for an IEP evaluation in a public school?",
      options:[
        {t:"Yes, parents must pay for the evaluation", ok:false, h:"Public schools conduct evaluations as part of special education processes."},
        {t:"No, evaluations/services are provided as part of FAPE", ok:true, h:"Correct — IDEA provides a free appropriate public education for eligible students."},
        {t:"Only in Massachusetts", ok:false, h:"IDEA is federal across the US."}
      ],
      pts:10
    },
    {
      id:"c3",
      q:"Private schools always provide ELL and IEP services for free. True or false?",
      options:[
        {t:"True", ok:false, h:"Private school supports can vary; ask the school what they offer."},
        {t:"False", ok:true, h:"Correct — private schools vary in services and may have different obligations."}
      ],
      pts:10
    }
  ];

  function renderQuiz(rootId, items, prefix){
    const root = $(rootId);
    root.innerHTML = "";
    items.forEach(item=>{
      const box = document.createElement("div");
      box.className = "q";
      box.innerHTML = `
        <div class="q__title">${esc(item.q)}</div>
        <div class="options"></div>
        <div class="q__fb" id="fb_${esc(prefix+item.id)}"></div>`;
      const optWrap = $(".options", box);

      item.options.forEach(opt=>{
        const b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.textContent = opt.t;
        b.addEventListener("click", ()=>{
          $$(".opt", box).forEach(x=>x.classList.remove("correct","wrong"));
          const fb = $(`#fb_${CSS.escape(prefix+item.id)}`);
          if(opt.ok){
            b.classList.add("correct");
            fb.textContent = "✅ Correct. " + opt.h;
            fb.style.color = "var(--good)";
            addPoints(prefix+item.id, item.pts || 10);
          }else{
            b.classList.add("wrong");
            fb.textContent = "❌ Not quite. " + opt.h;
            fb.style.color = "var(--bad)";
          }
        });
        optWrap.appendChild(b);
      });

      root.appendChild(box);
    });
  }

  /* -------------------------
     Sequence: ELL steps
  --------------------------*/
  const seqELLSteps = [
    { id:"hls", icon:"📝", t:"Home Language Survey during enrollment" },
    { id:"screen", icon:"🧪", t:"English screening (if indicated)" },
    { id:"notify", icon:"📩", t:"Family notification + program info" },
    { id:"place", icon:"🏫", t:"Placement into services (push-in/pull-out/co-teach)" },
    { id:"monitor", icon:"📈", t:"Progress monitoring during the year" },
    { id:"annual", icon:"📊", t:"Annual proficiency assessment / review to exit" }
  ];
  const seqState = { selected:null };

  function renderSeqELL(){
    const root = $("#seqELL");
    const pool = $(".sequence__pool", root);
    const target = $(".sequence__target", root);
    pool.innerHTML = "";
    target.innerHTML = "";
    seqState.selected = null;

    shuffle(seqELLSteps).forEach(s=>{
      const el = document.createElement("div");
      el.className = "cardTile";
      el.draggable = !state.touch;
      el.dataset.id = s.id;
      el.innerHTML = `
        <div class="tileIcon">${s.icon}</div>
        <div class="tileCol">
          <div class="tileText">${esc(s.t)}</div>
          <div class="tileSub">${state.frHelp==="on" ? "Tap/drag to place" : "Tap/drag to place"}</div>
        </div>`;
      el.addEventListener("click", ()=> selectSeq(el, root));
      el.addEventListener("dragstart", ev=> ev.dataTransfer.setData("text/plain", s.id));
      pool.appendChild(el);
    });

    target.addEventListener("dragover", ev=>{ ev.preventDefault(); target.classList.add("over"); });
    target.addEventListener("dragleave", ()=> target.classList.remove("over"));
    target.addEventListener("drop", ev=>{
      ev.preventDefault(); target.classList.remove("over");
      const id = ev.dataTransfer.getData("text/plain");
      const tile = $(`.cardTile[data-id="${CSS.escape(id)}"]`, root);
      if(tile) placeSeqTile(tile, target, pool);
    });
    target.addEventListener("click", ()=>{
      if(seqState.selected) placeSeqTile(seqState.selected, target, pool);
    });

    // allow moving back to pool on click
    pool.addEventListener("click", ()=>{
      // no-op; tiles can be re-selected
    });

    $("#fb_seqELL").textContent = "";
    $("#fb_seqELL").className = "feedback";
  }

  function selectSeq(tile, root){
    $$(".cardTile", root).forEach(x=>x.classList.remove("selected"));
    if(seqState.selected === tile){
      seqState.selected = null;
      return;
    }
    tile.classList.add("selected");
    seqState.selected = tile;
  }

  function placeSeqTile(tile, target, pool){
    tile.classList.remove("selected");
    target.appendChild(tile);
    seqState.selected = null;
  }

  function resetSeqELL(){
    renderSeqELL();
  }

  function hintSeqELL(){
    const fb = $("#fb_seqELL");
    fb.className = "feedback warn";
    fb.textContent = state.frHelp==="on"
      ? "Astuce: d’abord le questionnaire langue, puis le test, puis information/placement, puis suivi, puis bilan annuel."
      : "Hint: Survey → screening → family notification → placement → monitoring → annual review.";
  }

  function checkSeqELL(){
    const root = $("#seqELL");
    const target = $(".sequence__target", root);
    const placed = $$(".cardTile", target).map(x=>x.dataset.id);
    const correct = seqELLSteps.map(s=>s.id);
    const fb = $("#fb_seqELL");

    if(placed.length !== correct.length){
      fb.className = "feedback bad";
      fb.textContent = `Place all steps first (${placed.length}/${correct.length}).`;
      return;
    }
    const ok = placed.every((id, i)=> id === correct[i]);
    if(ok){
      fb.className = "feedback good";
      fb.textContent = "Perfect! ✅ Timeline is correct.";
      addPoints("seqELL", 35);
    }else{
      fb.className = "feedback bad";
      fb.textContent = "Not yet. Try again (use the hint).";
    }
  }

  /* -------------------------
     Sentence order (requests)
  --------------------------*/
  const orderItems = [
    { id:"r1", target:"Could you screen my child for English learner services, please?",
      words:["please?","for","services,","Could","you","screen","my","child","English","learner"] },
    { id:"r2", target:"Do you have an interpreter available for our meeting?",
      words:["our","meeting?","Do","you","have","an","interpreter","available","for"] },
    { id:"r3", target:"I would like to request an evaluation for learning support.",
      words:["request","support.","I","would","like","to","an","evaluation","for","learning"] }
  ];
  const orderState = { selected:null };

  function renderOrderRequests(){
    const root = $("#orderRequests");
    root.innerHTML = "";
    orderItems.forEach(item=>{
      const section = document.createElement("div");
      section.className = "order";
      section.dataset.order = item.id;

      section.innerHTML = `
        <div class="miniTitle">Sentence ${esc(item.id.toUpperCase())}</div>
        <div class="muted small">Build a polite sentence, then check it.</div>
        <div class="orderRow">
          <div class="wordBank" data-bank="${esc(item.id)}"></div>
          <div class="slotRow" data-slots="${esc(item.id)}" aria-label="Your sentence"></div>
        </div>
        <div class="row row--right">
          <button class="btn btn--ghost" type="button" data-hint="${esc(item.id)}">💡 Hint</button>
          <button class="btn btn--primary" type="button" data-check="${esc(item.id)}">✅ Check</button>
          <button class="btn" type="button" data-reset="${esc(item.id)}">↺ Reset</button>
          <button class="btn btn--ghost" type="button" data-speak="${esc(item.id)}">🔊 Listen</button>
        </div>
        <div class="feedback" id="fb_${esc(item.id)}" aria-live="polite"></div>
      `;

      const bank = $(`.wordBank[data-bank="${CSS.escape(item.id)}"]`, section);
      const slots = $(`.slotRow[data-slots="${CSS.escape(item.id)}"]`, section);

      shuffle(item.words).forEach(w=>{
        const chip = document.createElement("div");
        chip.className = "word";
        chip.textContent = w;
        chip.draggable = !state.touch;
        chip.dataset.word = w;
        chip.addEventListener("click", ()=> selectWord(chip, section));
        chip.addEventListener("dragstart", ev=> ev.dataTransfer.setData("text/plain", w));
        bank.appendChild(chip);
      });

      [bank, slots].forEach(box=>{
        box.addEventListener("dragover", ev=> ev.preventDefault());
        box.addEventListener("drop", ev=>{
          ev.preventDefault();
          const w = ev.dataTransfer.getData("text/plain");
          moveWord(section, w, box);
        });
        box.addEventListener("click", ()=>{
          if(orderState.selected) placeSelected(section, box);
        });
      });

      root.appendChild(section);
    });
  }

  function selectWord(chip, section){
    $$(".word", section).forEach(x=>x.classList.remove("selected"));
    if(orderState.selected === chip){
      orderState.selected = null;
      return;
    }
    chip.classList.add("selected");
    orderState.selected = chip;
  }
  function placeSelected(section, box){
    const chip = orderState.selected;
    if(!chip) return;
    chip.classList.remove("selected");
    box.appendChild(chip);
    orderState.selected = null;
  }
  function moveWord(section, word, box){
    const chip = $(`.word[data-word="${CSS.escape(word)}"]`, section);
    if(!chip) return;
    chip.classList.remove("selected");
    box.appendChild(chip);
    orderState.selected = null;
  }
  function resetOrder(id){
    const section = $(`.order[data-order="${CSS.escape(id)}"]`, $("#orderRequests"));
    const item = orderItems.find(x=>x.id===id);
    if(!section || !item) return;
    const bank = $(`.wordBank[data-bank="${CSS.escape(id)}"]`, section);
    const slots = $(`.slotRow[data-slots="${CSS.escape(id)}"]`, section);
    const chips = $$(".word", section);
    bank.innerHTML = "";
    slots.innerHTML = "";
    shuffle(item.words).forEach(w=>{
      const c = chips.find(x=>x.dataset.word===w);
      if(c) bank.appendChild(c);
    });
    const fb = $("#fb_"+id);
    fb.textContent = "";
    fb.className = "feedback";
  }
  function hintOrder(id){
    const fb = $("#fb_"+id);
    fb.className = "feedback warn";
    fb.textContent = state.frHelp==="on"
      ? "Astuce: commencez par Could you / Do you… puis ajoutez le contexte."
      : "Hint: Start with Could you / Do you…, then add the context.";
  }
  function checkOrder(id){
    const section = $(`.order[data-order="${CSS.escape(id)}"]`, $("#orderRequests"));
    const item = orderItems.find(x=>x.id===id);
    if(!section || !item) return;
    const slots = $(`.slotRow[data-slots="${CSS.escape(id)}"]`, section);
    const built = $$(".word", slots).map(x=>x.textContent).join(" ").replace(/\s+([,?.!])/g, "$1").trim();
    const fb = $("#fb_"+id);
    if(built === item.target){
      fb.className = "feedback good";
      fb.textContent = "✅ Correct: " + item.target;
      addPoints("order_"+id, 15);
    }else{
      fb.className = "feedback bad";
      fb.textContent = "❌ Not quite. Try again.";
    }
  }
  function speakOrder(id){
    const item = orderItems.find(x=>x.id===id);
    if(!item) return;
    const ok = speak(item.target);
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  }

  /* -------------------------
     Rubric tool (school choosing)
  --------------------------*/
  const rubricItems = [
    { id:"growth", title:"Student growth / progress", tip:"Look for multiple years and growth indicators, not only one score." },
    { id:"supports", title:"Supports (ELL + IEP/504)", tip:"Ask about staffing, minutes/week, newcomer supports, and interpretation." },
    { id:"climate", title:"School climate & safety", tip:"Attendance, behavior, and how families describe communication." },
    { id:"programs", title:"Programs & opportunities", tip:"Arts, STEM, sports, clubs, advanced classes, vocational pathways." },
    { id:"practical", title:"Practical fit", tip:"Commute, start times, after-school, childcare, transportation." }
  ];

  function renderRubric(){
    const root = $("#rubric");
    root.innerHTML = "";
    const saved = store.get("ss2_rubric", {});
    rubricItems.forEach(it=>{
      const val = typeof saved[it.id] === "number" ? saved[it.id] : 3;
      const div = document.createElement("div");
      div.className = "rItem";
      div.innerHTML = `
        <div class="rTop">
          <div>
            <div class="rTitle">${esc(it.title)}</div>
            <div class="muted small">${esc(it.tip)}</div>
          </div>
          <div class="rVal" id="rv_${esc(it.id)}">${val}</div>
        </div>
        <input type="range" min="0" max="5" value="${val}" data-r="${esc(it.id)}" aria-label="${esc(it.title)} slider"/>
      `;
      root.appendChild(div);
    });

    $$("input[type=range]", root).forEach(r=>{
      r.addEventListener("input", ()=>{
        const id = r.dataset.r;
        $("#rv_"+id).textContent = r.value;
        const now = store.get("ss2_rubric", {});
        now[id] = Number(r.value);
        store.set("ss2_rubric", now);
        calcRubric();
      });
    });
    calcRubric();
  }

  function calcRubric(){
    const vals = store.get("ss2_rubric", {});
    let sum = 0;
    rubricItems.forEach(it=>{ sum += Number(vals[it.id] ?? 3); });
    const max = rubricItems.length * 5;
    const pct = Math.round((sum/max)*100);

    const top = rubricItems
      .map(it => ({id:it.id, title:it.title, v:Number(vals[it.id] ?? 3)}))
      .sort((a,b)=> b.v - a.v)
      .slice(0,2);

    const out = $("#rubricOut");
    out.innerHTML = `<b>Priority score:</b> ${pct}%<br/>
      <b>Your top priorities:</b> ${esc(top[0].title)} + ${esc(top[1].title)}<br/>
      <b>Next step:</b> Use official report cards to compare schools, then call the registrar to ask about your top priorities.`;
    addPoints("rubricUse", 10);
  }

  $("#rubricReset").addEventListener("click", ()=>{
    store.set("ss2_rubric", {});
    renderRubric();
  });

  /* -------------------------
     Quality quiz
  --------------------------*/
  const quizQuality = [
    {
      id:"q1",
      q:"When comparing schools, what is the best approach?",
      options:[
        {t:"Use official report cards plus a fit check (supports, commute, programs).", ok:true, h:"Correct — data + fit is strongest."},
        {t:"Pick only the highest test score from one year.", ok:false, h:"One year can be misleading."},
        {t:"Ignore supports and focus only on sports.", ok:false, h:"Sports can matter, but supports and learning are key."}
      ],
      pts:10
    },
    {
      id:"q2",
      q:"What should you ask about ELL supports?",
      options:[
        {t:"How support is delivered (push-in/pull-out), minutes/week, and how progress is monitored.", ok:true, h:"Exactly — these details matter."},
        {t:"Only the teacher’s favorite textbook.", ok:false, h:"Not very useful for placement."},
        {t:"Whether the school accepts cash only.", ok:false, h:"That’s unrelated."}
      ],
      pts:10
    },
    {
      id:"q3",
      q:"If your child needs accommodations but not special education, which plan might apply?",
      options:[
        {t:"504 Plan", ok:true, h:"Correct — 504 is about access accommodations."},
        {t:"ESL pull-out", ok:false, h:"That’s language support, not disability accommodations."},
        {t:"Graduation plan", ok:false, h:"Not the same."}
      ],
      pts:10
    }
  ];

  /* -------------------------
     Locator tool
  --------------------------*/
  function buildLocator(){
    const st = $("#locState").value;
    const town = ($("#locTown").value || "").trim() || "your town";
    const need = $("#locNeed").value;
    const grade = $("#locGrade").value;

    const districtSearch = `${town} ${st} school district`;
    const regSearch = `${town} ${st} school district registrar enrollment`;
    const finderSearch = `${town} ${st} school district school finder by address`;
    const portalSearch = `${town} ${st} parent portal login`;

    let focus = "";
    if(need === "register") focus = "enrollment / registration";
    else if(need === "ell") focus = "ELL / ESL services";
    else if(need === "iep") focus = "IEP / evaluation request";
    else if(need === "portal") focus = "parent portal";
    else if(need === "tour") focus = "appointment / school tour";
    else focus = "interpreter / translation";

    const emailSubject = `Enrollment question (${grade}) — ${town}, ${st}`;
    let emailBody = `Hello,\n\nMy name is ________. We are moving to ${town}, ${st}. I would like information about ${focus} for my child entering ${grade}.\n\nCould you please tell me:\n- Who is the registrar (or enrollment office) and what documents are required?\n- How do I find our assigned school (school finder by address)?\n- What is the timeline for registration and when can we schedule an appointment?\n`;
    if(need === "ell"){
      emailBody += `- Will the school provide an English learner screening? How is ESL support delivered (push-in/pull-out), and how many minutes per week?\n`;
    }
    if(need === "iep"){
      emailBody += `- We would like to discuss learning supports. What is the process to request an evaluation (IEP/504), and who should we contact?\n`;
    }
    if(need === "interpreter"){
      emailBody += `- We would like meetings in our preferred language. Do you have an interpreter available, and how do we request one?\n`;
    }
    emailBody += `\nThank you very much,\n________\n`;

    const phoneScript = `Hello, my name is ________. We are moving to ${town}, ${st}. Could I speak with the registrar or enrollment office? I have questions about ${focus} for a child entering ${grade}.`;

    const out = `
      <div class="miniTitle">Search phrases to find the right page</div>
      <ul class="clean">
        <li><b>District:</b> ${esc(districtSearch)}</li>
        <li><b>Registrar:</b> ${esc(regSearch)}</li>
        <li><b>School finder:</b> ${esc(finderSearch)}</li>
        <li><b>Portal:</b> ${esc(portalSearch)}</li>
      </ul>

      <div class="miniTitle">Email template</div>
      <div class="muted small"><b>Subject:</b> ${esc(emailSubject)}</div>
      <pre class="pre">${esc(emailBody)}</pre>

      <div class="miniTitle">Phone script</div>
      <div class="muted">${esc(phoneScript)}</div>
    `;
    $("#locOut").innerHTML = out;
    store.set("ss2_locator", {st,town,need,grade});
    addPoints("locator", 20);
  }

  $("#locGenerate").addEventListener("click", buildLocator);
  $("#locCopy").addEventListener("click", ()=>{
    const text = $("#locOut").innerText;
    navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(text).then(()=> alert("Copied!"))
      : alert("Copy is not available in this browser. Select and copy manually.");
  });
  $("#locSpeak").addEventListener("click", ()=>{
    const text = $("#locOut").innerText.replace(/\s+/g, " ").trim();
    const ok = speak(text.slice(0, 1800)); // keep it reasonable
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  });

  /* -------------------------
     Match portals game
  --------------------------*/
  const portalCards = [
    { id:"ic", icon:"📱", label:"Infinite Campus", sub:"parent portal", target:"sis" },
    { id:"ps", icon:"🔐", label:"PowerSchool", sub:"parent portal", target:"sis" },
    { id:"sky", icon:"🗂️", label:"Skyward", sub:"parent portal", target:"sis" },
    { id:"canvas", icon:"🧑‍💻", label:"Canvas / Schoology", sub:"assignments", target:"lms" },
    { id:"gc", icon:"📚", label:"Google Classroom", sub:"classwork", target:"lms" },
    { id:"psq", icon:"📣", label:"ParentSquare / Remind", sub:"messages", target:"comm" }
  ];
  const portalTargets = [
    { key:"sis", title:"SIS (grades/attendance/schedule)" },
    { key:"lms", title:"LMS (assignments/class materials)" },
    { key:"comm", title:"Communication (messages/alerts)" }
  ];
  const matchState = { selected:null };

  function renderMatchPortals(){
    const root = $("#matchPortals");
    const pool = $(".match__pool", root);
    const targets = $(".match__targets", root);
    pool.innerHTML = "";
    targets.innerHTML = "";
    matchState.selected = null;

    shuffle(portalCards).forEach(c=>{
      const el = document.createElement("div");
      el.className = "cardTile";
      el.draggable = !state.touch;
      el.dataset.id = c.id;
      el.innerHTML = `
        <div class="tileIcon">${c.icon}</div>
        <div class="tileCol">
          <div class="tileText">${esc(c.label)}</div>
          <div class="tileSub">${esc(c.sub)}</div>
        </div>`;
      el.addEventListener("click", ()=> selectMatchTile(el, root));
      el.addEventListener("dragstart", ev=> ev.dataTransfer.setData("text/plain", c.id));
      pool.appendChild(el);
    });

    portalTargets.forEach(t=>{
      const wrap = document.createElement("div");
      wrap.className = "target";
      wrap.innerHTML = `
        <div class="target__title">${esc(t.title)}</div>
        <div class="dropZone" data-drop="${esc(t.key)}" aria-label="Drop area"></div>
      `;
      const dz = $(".dropZone", wrap);
      dz.addEventListener("dragover", ev=>{ ev.preventDefault(); dz.classList.add("over"); });
      dz.addEventListener("dragleave", ()=> dz.classList.remove("over"));
      dz.addEventListener("drop", ev=>{
        ev.preventDefault(); dz.classList.remove("over");
        const id = ev.dataTransfer.getData("text/plain");
        const tile = $(`.cardTile[data-id="${CSS.escape(id)}"]`, root);
        if(tile) placeMatchTile(tile, dz, pool);
      });
      dz.addEventListener("click", ()=>{
        if(matchState.selected) placeMatchTile(matchState.selected, dz, pool);
      });
      targets.appendChild(wrap);
    });

    $("#fb_matchPortals").textContent = "";
    $("#fb_matchPortals").className = "feedback";
  }

  function selectMatchTile(tile, root){
    $$(".cardTile", root).forEach(x=>x.classList.remove("selected"));
    if(matchState.selected === tile){
      matchState.selected = null;
      return;
    }
    tile.classList.add("selected");
    matchState.selected = tile;
  }
  function placeMatchTile(tile, drop, pool){
    const existing = $(".cardTile", drop);
    if(existing) pool.appendChild(existing);
    tile.classList.remove("selected");
    drop.appendChild(tile);
    matchState.selected = null;
  }

  function hintMatchPortals(){
    const fb = $("#fb_matchPortals");
    fb.className = "feedback warn";
    fb.textContent = state.frHelp==="on"
      ? "Astuce: SIS = notes/absences. LMS = devoirs/cours. Communication = messages."
      : "Hint: SIS = grades/attendance. LMS = assignments. Communication = messages.";
  }
  function checkMatchPortals(){
    const root = $("#matchPortals");
    let correct = 0;
    portalCards.forEach(c=>{
      const tile = $(`.cardTile[data-id="${CSS.escape(c.id)}"]`, root);
      if(!tile || !tile.parentElement) return;
      const drop = tile.parentElement.dataset && tile.parentElement.dataset.drop;
      if(drop === c.target) correct++;
    });
    const fb = $("#fb_matchPortals");
    if(correct === portalCards.length){
      fb.className = "feedback good";
      fb.textContent = "Nice! ✅ You matched all portals correctly.";
      addPoints("matchPortals", 30);
    }else{
      fb.className = "feedback bad";
      fb.textContent = `Not yet: ${correct}/${portalCards.length} correct.`;
    }
  }

  /* -------------------------
     Dialogue builder
  --------------------------*/
  function buildScript(data){
    const parent = data.parent || "Parent";
    const child = data.child || "my child";
    const st = data.state || "MA";
    const lang = data.lang || "French";
    const concern = data.concern || "our situation";

    const lines = [];
    lines.push({s:"Parent", t:`Hello, my name is ${parent}. We are new to ${st} and I have a question about support for ${child}.`});

    if(data.scenario === "interpreter"){
      lines.push({s:"Parent", t:`For meetings and key documents, could we have an interpreter in ${lang}, please?`});
      lines.push({s:"School", t:"Yes, we can discuss language access. What meeting are you requesting?"});
      lines.push({s:"Parent", t:"An enrollment meeting and a parent-teacher conference when available. How do I request the interpreter each time?"});
    }else if(data.scenario === "ell"){
      lines.push({s:"Parent", t:`${child} is new to English. Could you explain the Home Language Survey and the English screening process?`});
      lines.push({s:"School", t:"Yes. We will review language information and may do a screening."});
      lines.push({s:"Parent", t:"If eligible, how is ESL support provided (push-in or pull-out), and how many minutes per week?"});
    }else if(data.scenario === "iep"){
      lines.push({s:"Parent", t:`We are concerned about ${concern}. I would like to request an evaluation to see if ${child} needs support (IEP or 504).`});
      lines.push({s:"School", t:"Thank you. We can explain the evaluation process and next steps."});
      lines.push({s:"Parent", t:"Could you tell me who coordinates evaluations and what forms I need to sign?"});
    }else{
      lines.push({s:"Parent", t:"We have school records from France. Do you need an official translation for placement?"});
      lines.push({s:"School", t:"We can review records and let you know what is needed."});
      lines.push({s:"Parent", t:"Thank you. Could you email the enrollment checklist and the registrar contact information?"});
    }

    lines.push({s:"School", t:"Of course. Please contact us anytime with questions."});
    return lines;
  }

  function renderScript(lines){
    const out = $("#dlgOut");
    out.innerHTML = lines.map(line=>`
      <div class="line">
        <div class="speaker">${esc(line.s)}</div>
        <div class="utterance">${esc(line.t)}</div>
      </div>
    `).join("");
    addPoints("dialogue", 25);
  }

  $("#dlgGenerate").addEventListener("click", ()=>{
    const data = {
      scenario: $("#dlgScenario").value,
      state: $("#dlgState").value,
      parent: $("#dlgParent").value.trim(),
      child: $("#dlgChild").value.trim(),
      lang: $("#dlgLang").value.trim(),
      concern: $("#dlgConcern").value.trim()
    };
    const lines = buildScript(data);
    renderScript(lines);
    store.set("ss2_lastScript", data);
  });

  $("#dlgCopy").addEventListener("click", ()=>{
    const text = $$(".line", $("#dlgOut")).map(l=>{
      const who = $(".speaker", l).textContent.trim();
      const utt = $(".utterance", l).textContent.trim();
      return `${who}: ${utt}`;
    }).join("\n");
    navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(text).then(()=> alert("Copied!"))
      : alert("Copy is not available in this browser. Select and copy manually.");
  });

  $("#dlgSpeak").addEventListener("click", ()=>{
    const text = $$(".line", $("#dlgOut")).map(l=>{
      const who = $(".speaker", l).textContent.trim();
      const utt = $(".utterance", l).textContent.trim();
      return `${who}. ${utt}`;
    }).join(" ");
    const ok = speak(text);
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  });

  /* -------------------------
     Generic buttons (hint/check/reset/speak)
  --------------------------*/
  document.addEventListener("click", (e)=>{
    const t = e.target;
    if(!(t instanceof HTMLElement)) return;

    const hintKey = t.getAttribute("data-hint");
    const checkKey = t.getAttribute("data-check");
    const resetKey = t.getAttribute("data-reset");
    const speakKey = t.getAttribute("data-speak");

    if(hintKey){
      if(hintKey === "sortSupports") hintSortSupports();
      else if(hintKey === "seqELL") hintSeqELL();
      else if(hintKey === "matchPortals") hintMatchPortals();
      else if(hintKey.startsWith("r")) hintOrder(hintKey);
    }
    if(checkKey){
      if(checkKey === "sortSupports") checkSortSupports();
      else if(checkKey === "seqELL") checkSeqELL();
      else if(checkKey === "matchPortals") checkMatchPortals();
      else if(checkKey.startsWith("r")) checkOrder(checkKey);
    }
    if(resetKey){
      if(resetKey === "sortSupports") renderSortSupports();
      else if(resetKey === "seqELL") resetSeqELL();
      else if(resetKey === "matchPortals") renderMatchPortals();
      else if(resetKey.startsWith("r")) resetOrder(resetKey);
    }
    if(speakKey){
      if(speakKey.startsWith("r")) speakOrder(speakKey);
    }
  });

  /* -------------------------
     Footer actions
  --------------------------*/
  $("#btnResetAll").addEventListener("click", ()=>{
    if(!confirm("Reset score + activities?")) return;
    state.awarded = {};
    store.set("ss2_awarded", state.awarded);
    setScore(0);
    renderQuick();
    renderSortSupports();
    renderSeqELL();
    renderOrderRequests();
    renderMatchPortals();
    renderRubric();
    renderQuiz("#quizCost", quizCost, "cost_");
    renderQuiz("#quizQuality", quizQuality, "qual_");
    $("#needOut").textContent = "";
    $("#locOut").innerHTML = '<div class="muted">Fill the form and click “Generate”.</div>';
    $("#dlgOut").innerHTML = '<div class="muted">Fill the form and click “Generate script”.</div>';
  });

  $("#btnPrint").addEventListener("click", ()=> window.print());

  /* -------------------------
     Back to top
  --------------------------*/
  const toTop = $("#toTop");
  window.addEventListener("scroll", ()=>{
    if(window.scrollY > 700) toTop.classList.add("show");
    else toTop.classList.remove("show");
  });
  toTop.addEventListener("click", ()=> window.scrollTo({ top:0, behavior:"smooth" }));

  /* -------------------------
     Init
  --------------------------*/
  function init(){
    syncControls();
    setScore(state.score);

    renderWhere();
    renderQuick();
    initFlashThemes();
    buildDeck();
    renderFlashcard();
    renderSortSupports();
    renderSeqELL();
    renderOrderRequests();
    renderMatchPortals();
    renderRubric();

    renderQuiz("#quizCost", quizCost, "cost_");
    renderQuiz("#quizQuality", quizQuality, "qual_");

    // Restore last script and locator (optional)
    const last = store.get("ss2_lastScript", null);
    if(last){
      $("#dlgScenario").value = last.scenario || "interpreter";
      $("#dlgState").value = last.state || "MA";
      $("#dlgParent").value = last.parent || "";
      $("#dlgChild").value = last.child || "";
      $("#dlgLang").value = last.lang || "";
      $("#dlgConcern").value = last.concern || "";
    }
    const loc = store.get("ss2_locator", null);
    if(loc){
      $("#locState").value = loc.st || "MA";
      $("#locTown").value = loc.town || "";
      $("#locNeed").value = loc.need || "register";
      $("#locGrade").value = loc.grade || "Kindergarten";
    }

    if(state.touch) addPoints("touchBonus", 5);
  }

  init();
})();
