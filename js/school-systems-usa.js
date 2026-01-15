/* SpeakEasyTisha · US School Systems (MA & NH) — interactive lesson
   Features:
   - US/UK accent TTS (speechSynthesis)
   - Global score (saved)
   - Flashcards with icons + optional French
   - Drag OR Tap mode: matching + sorting + sentence order
   - MCQ quiz with instant feedback + hints
   - Fill-in-the-blank with dropdown word bank
   - Dialogue builder for real school scenarios
   - Checklist saved in browser + print

   Note: District rules vary. See Sources section in HTML.
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
    accent: store.get("ssu_accent","us"),
    frHelp: store.get("ssu_frHelp","off"),
    score: store.get("ssu_score",0),
    awarded: store.get("ssu_awarded",{}), // activityKey -> true when first scored
    touch: (navigator.maxTouchPoints || 0) > 0
  };

  function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }
  function shuffle(arr){
    const a = arr.slice();
    for(let idx=a.length-1; idx>0; idx--){
      const j = Math.floor(Math.random()*(idx+1));
      const tmp=a[idx]; a[idx]=a[j]; a[j]=tmp;
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
    store.set("ssu_score", state.score);
    $("#scoreNow").textContent = String(state.score);
    $("#scoreNow2").textContent = String(state.score);
  }
  function addPoints(activityKey, pts){
    if(state.awarded[activityKey]) return; // score once per activity
    state.awarded[activityKey] = true;
    store.set("ssu_awarded", state.awarded);
    setScore(state.score + pts);
  }

  /* -------------------------
     Text to Speech (US/UK)
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
    // Prefer exact locale, then any English.
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
    $("#dlgFR").hidden = (state.frHelp !== "on");
  }

  $("#accentSelect").addEventListener("change", (e)=>{
    state.accent = e.target.value;
    store.set("ssu_accent", state.accent);
  });
  $("#frHelpSelect").addEventListener("change", (e)=>{
    state.frHelp = e.target.value;
    store.set("ssu_frHelp", state.frHelp);
    $("#dlgFR").hidden = (state.frHelp !== "on");
    renderFlashcard(); // refresh FR on back
  });

  $("#btnSpeakTest").addEventListener("click", ()=>{
    const ok = speak(state.accent === "uk" ? "Hello! This is a British voice test." : "Hello! This is an American voice test.");
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  });

  /* -------------------------
     Child profile tabs
  --------------------------*/
  const childProfiles = {
    "13": {
      title:"Likely level: Middle School (Collège)",
      html:`<ul class="clean">
        <li><b>Typical grades:</b> 7th–8th (sometimes 6th–8th)</li>
        <li><b>French equivalent:</b> 5e–4e (approx.)</li>
        <li><b>Focus:</b> schedule, electives, counselor, clubs, language support.</li>
      </ul>`,
      tts:"For a thirteen-year-old, the typical level is middle school, around seventh or eighth grade. In France, that is roughly fifth or fourth grade. Ask about the schedule, electives, after-school activities, and English learner support."
    },
    "10": {
      title:"Likely level: Upper Elementary (École élémentaire)",
      html:`<ul class="clean">
        <li><b>Typical grades:</b> 4th–5th</li>
        <li><b>French equivalent:</b> CM1–CM2 (approx.)</li>
        <li><b>Focus:</b> reading support, classroom routines, lunch/bus, parent-teacher communication.</li>
      </ul>`,
      tts:"For a ten-year-old, the typical level is upper elementary school, around fourth or fifth grade. In France, that is roughly CM1 or CM2. Ask about reading support, routines, bus and lunch, and how the school communicates with parents."
    },
    "2": {
      title:"Likely level: Early childhood (Crèche / Preschool options)",
      html:`<ul class="clean">
        <li><b>Typical:</b> daycare or preschool program (often private), sometimes public early childhood services depending on district.</li>
        <li><b>French equivalent:</b> crèche / toute petite section (rare) / petite section later</li>
        <li><b>Focus:</b> childcare availability, cost, hours, waitlists, language environment.</li>
      </ul>`,
      tts:"For a two-year-old, families typically look for daycare or a preschool program, often private. Public options vary by district. Ask about cost, hours, waitlists, and the language environment."
    }
  };

  function setChildProfile(age){
    const p = childProfiles[age];
    if(!p) return;
    $("#childProfileTitle").textContent = p.title;
    $("#childProfileBody").innerHTML = p.html + `<button id="childSpeak" class="btn btn--primary" type="button">🔊 Listen (summary)</button>`;
    $("#childSpeak").addEventListener("click", ()=> speak(p.tts));
  }

  $$(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      setChildProfile(btn.dataset.child);
    });
  });

  /* -------------------------
     Activity: Match levels
  --------------------------*/
  const matchLevelsData = [
    { id:"prek", icon:"🧸", label:"Pre-K / Preschool", sub:"ages 3–4", target:"maternelle" },
    { id:"k", icon:"🎒", label:"Kindergarten (K)", sub:"ages 5–6", target:"grande" },
    { id:"elem", icon:"🏫", label:"Elementary (1st–5th)", sub:"ages 6–11", target:"cp_cm2" },
    { id:"mid", icon:"🧪", label:"Middle School (6th–8th)", sub:"ages 11–14", target:"college" },
    { id:"high", icon:"🎓", label:"High School (9th–12th)", sub:"ages 14–18", target:"lycee" }
  ];
  const matchLevelTargets = [
    { key:"maternelle", title:"Maternelle (PS/MS/GS)", tip:"Preschool ages" },
    { key:"grande", title:"Grande section (approx.)", tip:"Entry cutoffs vary" },
    { key:"cp_cm2", title:"Élémentaire (CP → CM2)", tip:"Primary school" },
    { key:"college", title:"Collège (6e → 3e)", tip:"Lower secondary" },
    { key:"lycee", title:"Lycée (Seconde → Terminale)", tip:"Upper secondary" }
  ];

  const matchState = { selected:null };

  function renderMatchLevels(){
    const root = $("#matchLevels");
    const pool = $(".match__pool", root);
    const targets = $(".match__targets", root);

    pool.innerHTML = "";
    targets.innerHTML = "";
    matchState.selected = null;

    const cards = shuffle(matchLevelsData);
    cards.forEach(c=>{
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
      el.addEventListener("click", ()=> selectTile(el, root));
      el.addEventListener("dragstart", (ev)=>{ ev.dataTransfer.setData("text/plain", c.id); });
      pool.appendChild(el);
    });

    matchLevelTargets.forEach(t=>{
      const wrap = document.createElement("div");
      wrap.className = "target";
      wrap.innerHTML = `
        <div class="target__title">${esc(t.title)}</div>
        <div class="tileSub">${esc(t.tip)}</div>
        <div class="dropZone" data-drop="${t.key}"></div>`;
      const drop = $(".dropZone", wrap);
      drop.addEventListener("dragover", (ev)=>{ ev.preventDefault(); drop.classList.add("over"); });
      drop.addEventListener("dragleave", ()=> drop.classList.remove("over"));
      drop.addEventListener("drop", (ev)=>{
        ev.preventDefault();
        drop.classList.remove("over");
        const id = ev.dataTransfer.getData("text/plain");
        placeTileById(root, id, drop);
      });
      drop.addEventListener("click", ()=>{
        if(matchState.selected) placeSelectedInto(root, drop);
      });
      targets.appendChild(wrap);
    });

    $("#fb_matchLevels").textContent = "";
    $("#fb_matchLevels").className = "feedback";
  }

  function selectTile(tileEl, root){
    const pool = $(".match__pool", root);
    const all = $$(".cardTile", pool);
    all.forEach(x=>x.classList.remove("selected"));
    if(matchState.selected === tileEl){
      matchState.selected = null;
      return;
    }
    tileEl.classList.add("selected");
    matchState.selected = tileEl;
  }

  function placeSelectedInto(root, dropEl){
    const tileEl = matchState.selected;
    if(!tileEl) return;
    placeTileEl(root, tileEl, dropEl);
    matchState.selected = null;
  }

  function placeTileById(root, id, dropEl){
    const pool = $(".match__pool", root);
    const tileEl = $(`.cardTile[data-id="${CSS.escape(id)}"]`, pool) || $(`.cardTile[data-id="${CSS.escape(id)}"]`, root);
    if(tileEl) placeTileEl(root, tileEl, dropEl);
  }

  function placeTileEl(root, tileEl, dropEl){
    // If drop already has a tile, return it to pool
    const existing = $(".cardTile", dropEl);
    if(existing){
      existing.classList.remove("placed","selected");
      existing.style.margin = "";
      $(".match__pool", root).appendChild(existing);
    }
    tileEl.classList.remove("selected");
    tileEl.classList.add("placed");
    tileEl.style.margin = "0";
    dropEl.appendChild(tileEl);
  }

  function resetMatchLevels(){
    renderMatchLevels();
    store.set("ssu_awarded", state.awarded); // keep scoring memory
  }

  function hintMatchLevels(){
    const fb = $("#fb_matchLevels");
    fb.className = "feedback warn";
    fb.textContent = state.frHelp === "on"
      ? "Astuce: Pre-K correspond à la maternelle. Middle School ≈ collège. High School ≈ lycée."
      : "Hint: Pre-K matches maternelle. Middle School ≈ collège. High School ≈ lycée.";
  }

  function checkMatchLevels(){
    const root = $("#matchLevels");
    let correct = 0;
    matchLevelTargets.forEach(t=>{
      const drop = $(`.dropZone[data-drop="${CSS.escape(t.key)}"]`, root);
      const tile = $(".cardTile", drop);
      if(!tile) return;
      const id = tile.dataset.id;
      const card = matchLevelsData.find(x=>x.id===id);
      if(card && card.target === t.key) correct++;
    });
    const fb = $("#fb_matchLevels");
    if(correct === matchLevelsData.length){
      fb.className = "feedback good";
      fb.textContent = "Perfect! ✅ You matched all levels.";
      addPoints("matchLevels", 40);
    }else{
      fb.className = "feedback bad";
      fb.textContent = `Not yet: ${correct}/${matchLevelsData.length} correct. Try again (use the hint).`;
    }
  }

  /* -------------------------
     Flashcards
  --------------------------*/
  const cards = [
    // School types
    { theme:"School types", icon:"🏫", term:"Public school", def:"A tuition-free school funded by the government, usually assigned by district.", ex:"We are assigned to the local public elementary school.", fr:"École publique (gratuite), souvent selon la carte scolaire." },
    { theme:"School types", icon:"🧾", term:"School district", def:"The local public education area that runs schools in a town or region.", ex:"Contact the district office for enrollment.", fr:"District scolaire (administration locale)." },
    { theme:"School types", icon:"🧭", term:"Zoned / assigned school", def:"The public school your child attends based on your home address.", ex:"Your address determines the assigned school.", fr:"École de secteur (selon l’adresse)." },
    { theme:"School types", icon:"⭐", term:"Charter school", def:"A publicly funded school with more autonomy; admission may use a lottery if demand is high.", ex:"We applied to a charter and joined the lottery.", fr:"Charter school (publique, autonome; souvent tirage au sort)." },
    { theme:"School types", icon:"🛠️", term:"Vocational / Technical school", def:"A school that combines academics with career/technical programs (often at high school level).", ex:"He wants a technical program in engineering.", fr:"Lycée pro/technique (voie technologique/pro)." },
    { theme:"School types", icon:"🎯", term:"Magnet / specialized program", def:"A school/program with a special theme (STEM, arts, languages) — rules vary by district.", ex:"She applied to a STEM magnet program.", fr:"Programme spécialisé (STEM, arts…)." },
    { theme:"School types", icon:"⛪", term:"Parochial school", def:"A religious private school (often Catholic), tuition-based.", ex:"They chose a parochial school near home.", fr:"École privée confessionnelle." },
    { theme:"School types", icon:"🏛️", term:"Independent school", def:"A private school, tuition-based, independently run.", ex:"Independent schools have their own admissions.", fr:"École privée indépendante." },
    { theme:"School types", icon:"🏡", term:"Homeschooling", def:"Education at home under state rules.", ex:"They filed the paperwork to homeschool.", fr:"Instruction en famille (selon la loi locale)." },

    // People
    { theme:"People", icon:"🧑‍💼", term:"Registrar", def:"The person/office that handles enrollment paperwork.", ex:"The registrar asked for proof of residency.", fr:"Service d’inscription / secrétariat." },
    { theme:"People", icon:"🧑‍🏫", term:"Teacher", def:"The classroom teacher.", ex:"We will meet the teacher during open house.", fr:"Professeur(e)/enseignant(e)." },
    { theme:"People", icon:"🧑‍⚕️", term:"School nurse", def:"Health professional at school; manages health records and meds.", ex:"The school nurse reviewed the immunization record.", fr:"Infirmier(ère) scolaire." },
    { theme:"People", icon:"🧑‍🎓", term:"Guidance counselor", def:"Supports students with schedules, well-being, and future planning (often middle/high school).", ex:"Ask the counselor about electives.", fr:"Conseiller(ère) d’orientation." },
    { theme:"People", icon:"🗣️", term:"ESL / ELL teacher", def:"Teacher supporting English learners (English as a Second Language).", ex:"The ESL teacher meets him twice a week.", fr:"Professeur FLE/ESL (English learner support)." },

    // Enrollment + documents
    { theme:"Enrollment", icon:"📄", term:"Proof of residency", def:"Document showing your address (lease, utility bill, etc.).", ex:"I can bring a lease and a utility bill.", fr:"Justificatif de domicile." },
    { theme:"Enrollment", icon:"🆔", term:"Birth certificate / passport", def:"Document proving the child’s identity and age.", ex:"We have the passport and birth certificate.", fr:"Acte de naissance / passeport." },
    { theme:"Enrollment", icon:"💉", term:"Immunization record", def:"Vaccination record required by schools (with exemptions depending on state rules).", ex:"The school needs an immunization record before attendance.", fr:"Carnet de vaccination." },
    { theme:"Enrollment", icon:"🏥", term:"Physical exam", def:"A recent medical check-up form (often requested).", ex:"The physical exam form is due next month.", fr:"Certificat médical / visite médicale." },
    { theme:"Enrollment", icon:"📚", term:"Transcript / report card", def:"Previous school records.", ex:"We will translate the last report card if needed.", fr:"Bulletins / relevés de notes." },

    // Language support
    { theme:"Language support", icon:"🌍", term:"English learner (EL / ELL)", def:"A student who is learning English and may need support.", ex:"My child is an English learner and needs support.", fr:"Élève allophone / apprenant d’anglais." },
    { theme:"Language support", icon:"🧩", term:"Language screening", def:"A short assessment to decide the right supports.", ex:"They will screen his English level.", fr:"Évaluation du niveau de langue." },
    { theme:"Language support", icon:"🧑‍🤝‍🧑", term:"Interpreter", def:"A person who translates spoken communication.", ex:"Do you have an interpreter for meetings?", fr:"Interprète." },
    { theme:"Language support", icon:"📝", term:"Translated documents", def:"School letters/forms in your language when needed.", ex:"Can I receive translated enrollment information?", fr:"Documents traduits." },
  ];

  let fcTheme = "School types";
  let fcDeck = [];
  let fcIndex = 0;

  function initFlashThemes(){
    const themes = Array.from(new Set(cards.map(c=>c.theme)));
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

  function buildDeck(){
    fcDeck = shuffle(cards.filter(c=>c.theme===fcTheme));
  }

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
  $("#flashcard").addEventListener("keydown", (e)=>{
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      $("#flashcard").classList.toggle("flipped");
    }
  });
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
     Activity: Sort school types
  --------------------------*/
  const sortData = [
    { id:"district", icon:"🧾", label:"District public school", sub:"assigned by address", bin:"public" },
    { id:"charter", icon:"⭐", label:"Charter school", sub:"public, often lottery", bin:"choice" },
    { id:"magnet", icon:"🎯", label:"Magnet / specialized program", sub:"theme-based", bin:"choice" },
    { id:"voctech", icon:"🛠️", label:"Vocational/Technical school", sub:"career-focused", bin:"choice" },
    { id:"private", icon:"🏛️", label:"Independent private school", sub:"tuition-based", bin:"private" },
    { id:"parochial", icon:"⛪", label:"Parochial school", sub:"religious private", bin:"private" }
  ];
  const sortState = { selected:null };

  function renderSort(){
    const root = $("#sortTypes");
    const pool = $(".sort__pool", root);
    const drops = $$(".bin__drop", root);
    pool.innerHTML = "";
    drops.forEach(d=> d.innerHTML="");
    sortState.selected = null;

    shuffle(sortData).forEach(c=>{
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
      el.addEventListener("dragstart", (ev)=>{ ev.dataTransfer.setData("text/plain", c.id); });
      pool.appendChild(el);
    });

    drops.forEach(drop=>{
      drop.addEventListener("dragover", (ev)=>{ ev.preventDefault(); drop.classList.add("over"); });
      drop.addEventListener("dragleave", ()=> drop.classList.remove("over"));
      drop.addEventListener("drop", (ev)=>{
        ev.preventDefault();
        drop.classList.remove("over");
        const id = ev.dataTransfer.getData("text/plain");
        const tileEl = $(`.cardTile[data-id="${CSS.escape(id)}"]`, root);
        if(tileEl) placeSortTile(tileEl, drop);
      });
      drop.addEventListener("click", ()=>{
        if(sortState.selected) placeSortTile(sortState.selected, drop);
      });
    });

    $("#fb_sortTypes").textContent = "";
    $("#fb_sortTypes").className = "feedback";
  }

  function selectSortTile(tileEl, root){
    const all = $$(".cardTile", root);
    all.forEach(x=>x.classList.remove("selected"));
    if(sortState.selected === tileEl){
      sortState.selected = null;
      return;
    }
    tileEl.classList.add("selected");
    sortState.selected = tileEl;
  }

  function placeSortTile(tileEl, dropEl){
    const existing = $(".cardTile", dropEl);
    if(existing){
      existing.classList.remove("placed","selected");
      existing.style.margin = "";
      $(".sort__pool", $("#sortTypes")).appendChild(existing);
    }
    tileEl.classList.remove("selected");
    tileEl.classList.add("placed");
    tileEl.style.margin = "0";
    dropEl.appendChild(tileEl);
    sortState.selected = null;
  }

  function hintSort(){
    const fb = $("#fb_sortTypes");
    fb.className = "feedback warn";
    fb.textContent = state.frHelp === "on"
      ? "Astuce: Public = gratuit. Charter/magnet/voc-tech = public mais sur candidature/choix. Private/parochial = payant."
      : "Hint: Public is tuition-free. Charter/magnet/voc-tech are public choice. Private/parochial are tuition-based.";
  }

  function checkSort(){
    const root = $("#sortTypes");
    let correct = 0;
    sortData.forEach(c=>{
      const tile = $(`.cardTile[data-id="${CSS.escape(c.id)}"]`, root);
      if(!tile) return;
      const parent = tile.parentElement;
      const drop = parent && parent.dataset && parent.dataset.drop;
      if(drop && drop === c.bin) correct++;
    });
    const fb = $("#fb_sortTypes");
    if(correct === sortData.length){
      fb.className = "feedback good";
      fb.textContent = "Great! ✅ You sorted all school types correctly.";
      addPoints("sortTypes", 40);
    }else{
      fb.className = "feedback bad";
      fb.textContent = `Not yet: ${correct}/${sortData.length} correct. Try again.`;
    }
  }

  /* -------------------------
     MCQ quiz (instant)
  --------------------------*/
  const quiz = [
    {
      id:"q1",
      q:"Which US school usually serves grades 9–12?",
      options:[
        {t:"Elementary school", ok:false, h:"Elementary is usually K–5."},
        {t:"Middle school", ok:false, h:"Middle is typically 6–8."},
        {t:"High school", ok:true, h:"Yes — 9th to 12th grade is usually high school."}
      ]
    },
    {
      id:"q2",
      q:"What does “district school” usually mean?",
      options:[
        {t:"A private school run by a company", ok:false, h:"District schools are public."},
        {t:"A public school assigned by address", ok:true, h:"Yes — public school based on where you live."},
        {t:"Only a school for gifted students", ok:false, h:"Not necessarily."}
      ]
    },
    {
      id:"q3",
      q:"When families compare schools, which is best practice?",
      options:[
        {t:"Look at only one year of test scores", ok:false, h:"One year can be misleading."},
        {t:"Use official state report cards plus practical factors", ok:true, h:"Yes — combine official data and fit."},
        {t:"Choose the closest school without checking anything", ok:false, h:"Distance matters, but check programs too."}
      ]
    },
    {
      id:"q4",
      q:"What is typically true about charter schools in Massachusetts?",
      options:[
        {t:"They are publicly funded but may use lotteries if oversubscribed", ok:true, h:"Yes — they are tuition-free public schools with admissions rules like lotteries."},
        {t:"They always charge tuition", ok:false, h:"Public charter schools are tuition-free."},
        {t:"They are only for international students", ok:false, h:"No."}
      ]
    }
  ];

  function renderQuiz(){
    const root = $("#quizChoice");
    root.innerHTML = "";
    quiz.forEach(item=>{
      const box = document.createElement("div");
      box.className = "q";
      box.innerHTML = `
        <div class="q__title">${esc(item.q)}</div>
        <div class="options"></div>
        <div class="q__fb" id="fb_${esc(item.id)}"></div>`;
      const optWrap = $(".options", box);

      item.options.forEach((opt, idx)=>{
        const b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.textContent = opt.t;
        b.addEventListener("click", ()=>{
          // lock after first correct
          const fb = $(`#fb_${CSS.escape(item.id)}`);
          // clear styles
          $$(".opt", box).forEach(x=>x.classList.remove("correct","wrong"));
          if(opt.ok){
            b.classList.add("correct");
            fb.textContent = "✅ Correct. " + opt.h;
            fb.style.color = "var(--good)";
            addPoints("quiz_" + item.id, 10);
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
     Checklist
  --------------------------*/
  const checklistItems = [
    { id:"address", title:"Find your assigned public school (by address)", desc:"Use the district’s “school finder” or call the district office/registrar. Your address matters." },
    { id:"call", title:"Call or email the registrar to ask for the exact registration steps", desc:"Ask: required documents, deadlines, online portal, and appointment times." },
    { id:"docs", title:"Prepare documents (ID, residency, health, prior school records)", desc:"Typical: child passport/birth certificate, lease/utility bill, immunization record, report card/transcripts, custody papers if applicable." },
    { id:"medical", title:"Schedule or transfer medical records", desc:"Schools often require immunization proof before attendance; a physical exam form may be requested." },
    { id:"language", title:"Ask about English Learner (ELL) screening and supports", desc:"Request an interpreter if needed. Ask how support is delivered (ESL, co-teaching, newcomer supports)." },
    { id:"special", title:"If relevant: bring IEP/504 or evaluations", desc:"Share any support plans so services can start sooner." },
    { id:"tour", title:"Visit / tour and ask practical questions", desc:"Transportation, lunch account, after-school, start/end times, supplies, school calendar." },
    { id:"portal", title:"Create parent portal accounts (if used)", desc:"Some districts use systems like Infinite Campus or similar for registration and updates." },
    { id:"firstday", title:"Plan the first day", desc:"Bus route or drop-off, lunch plan, emergency contacts, and who to call if your child is nervous." }
  ];

  function renderChecklist(){
    const root = $("#arrivalChecklist");
    const checked = store.get("ssu_checklist", {});
    root.innerHTML = "";
    checklistItems.forEach(it=>{
      const row = document.createElement("label");
      row.className = "ck";
      row.innerHTML = `
        <input type="checkbox" data-ck="${esc(it.id)}" ${checked[it.id] ? "checked" : ""}/>
        <div>
          <div class="ck__title">${esc(it.title)}</div>
          <div class="ck__desc">${esc(it.desc)}</div>
        </div>`;
      root.appendChild(row);
    });
    $$("input[type=checkbox]", root).forEach(cb=>{
      cb.addEventListener("change", ()=>{
        const id = cb.dataset.ck;
        const now = store.get("ssu_checklist", {});
        now[id] = cb.checked;
        store.set("ssu_checklist", now);

        // Award points when checklist is fully checked (once)
        const all = checklistItems.every(x => now[x.id]);
        if(all) addPoints("checklist", 30);
      });
    });
  }

  function resetChecklist(){
    store.set("ssu_checklist", {});
    renderChecklist();
  }

  /* -------------------------
     Fill-in-the-blank (docs)
  --------------------------*/
  const fillDocs = {
    bank:["residency","immunization","birth certificate","passport","transcripts","proof","appointment","district"],
    lines:[
      {
        id:"l1",
        parts:["To enroll, you usually need ", {blank:"proof"}, " of ", {blank:"residency"}, " (for example a lease or utility bill)."],
        answers:{ proof:"proof", residency:"residency" },
        hint:"Schools must verify where you live to assign the right public school."
      },
      {
        id:"l2",
        parts:["Schools commonly ask for a child’s ", {blank:"passport"}, " or ", {blank:"birth certificate"}, " to confirm identity and age."],
        answers:{ passport:"passport", "birth certificate":"birth certificate" },
        hint:"Bring whatever official ID documents you have."
      },
      {
        id:"l3",
        parts:["Many schools require an ", {blank:"immunization"}, " record before a student can attend classes."],
        answers:{ immunization:"immunization" },
        hint:"Requirements and exemptions depend on the state."
      },
      {
        id:"l4",
        parts:["If your child has attended school before, bring report cards or ", {blank:"transcripts"}, "."],
        answers:{ transcripts:"transcripts" },
        hint:"It helps with placement and course scheduling."
      }
    ]
  };

  function renderFill(){
    const root = $("#fillDocs");
    root.innerHTML = "";
    const selectsByBlank = {};

    fillDocs.lines.forEach(line=>{
      const div = document.createElement("div");
      div.className = "fillLine";

      const htmlParts = line.parts.map(p=>{
        if(typeof p === "string") return esc(p);
        const b = p.blank;
        return `<select data-blank="${esc(b)}">
          <option value="" selected>—</option>
          ${fillDocs.bank.map(w=>`<option value="${esc(w)}">${esc(w)}</option>`).join("")}
        </select>`;
      }).join("");

      div.innerHTML = htmlParts;
      root.appendChild(div);
    });

    const fb = document.createElement("div");
    fb.className = "fillFb";
    fb.id = "fb_fillDocs";
    root.appendChild(fb);

    $$("select", root).forEach(sel=>{
      sel.addEventListener("change", ()=> checkFill(false));
    });

    // Buttons
    const row = document.createElement("div");
    row.className = "row row--right";
    row.innerHTML = `
      <button class="btn btn--ghost" type="button" data-hint="fillDocs">💡 Hint</button>
      <button class="btn btn--primary" type="button" data-check="fillDocs">✅ Check</button>
      <button class="btn" type="button" data-reset="fillDocs">↺ Reset</button>`;
    root.appendChild(row);
  }

  function resetFill(){
    $$("#fillDocs select").forEach(s=> s.value = "");
    $("#fb_fillDocs").textContent = "";
    $("#fb_fillDocs").style.color = "";
  }

  function hintFill(){
    const fb = $("#fb_fillDocs");
    fb.style.color = "var(--warn)";
    fb.textContent = state.frHelp === "on"
      ? "Astuce: residency = domicile, immunization = vaccination, transcripts = relevés/bulletins."
      : "Hint: residency = address proof, immunization = vaccination record, transcripts = school records.";
  }

  function checkFill(award){
    // evaluate each blank
    const allSelects = $$("#fillDocs select");
    let total = 0;
    let correct = 0;

    // Build map blank->value (note: some blanks appear once)
    const chosen = {};
    allSelects.forEach(s=>{
      total++;
      chosen[s.dataset.blank] = s.value;
    });

    // Validate against all line answers
    fillDocs.lines.forEach(line=>{
      Object.keys(line.answers).forEach(k=>{
        const expected = line.answers[k];
        const got = chosen[k] || "";
        if(got === expected) correct++;
      });
    });

    const fb = $("#fb_fillDocs");
    if(correct === total){
      fb.style.color = "var(--good)";
      fb.textContent = "✅ Perfect! All blanks correct.";
      addPoints("fillDocs", 30);
    }else{
      fb.style.color = "var(--bad)";
      fb.textContent = `❌ ${correct}/${total} correct. Try again (use the hint).`;
    }
  }

  /* -------------------------
     Sentence order (polite)
  --------------------------*/
  const orderItems = [
    {
      id:"s1",
      target:"Good morning, I would like to enroll my child, please.",
      words:["enroll","please.","my","I","would","to","child,","Good","morning,","like"]
    },
    {
      id:"s2",
      target:"Could I schedule an appointment with the registrar?",
      words:["an","appointment","with","the","registrar?","Could","I","schedule"]
    },
    {
      id:"s3",
      target:"Do you have an interpreter available for meetings?",
      words:["meetings?","Do","you","have","an","interpreter","available","for"]
    }
  ];
  const orderState = { selectedWord:null };

  function renderOrder(){
    const root = $("#orderPolite");
    root.innerHTML = "";

    orderItems.forEach(item=>{
      const section = document.createElement("div");
      section.className = "order";
      section.dataset.order = item.id;

      const header = document.createElement("div");
      header.innerHTML = `<div class="miniTitle">Sentence: ${esc(item.id.toUpperCase())}</div>
        <div class="muted small">Target meaning: polite school communication</div>`;
      section.appendChild(header);

      const row = document.createElement("div");
      row.className = "orderRow";

      const bank = document.createElement("div");
      bank.className = "wordBank";
      bank.dataset.bank = item.id;

      const slots = document.createElement("div");
      slots.className = "slotRow";
      slots.dataset.slots = item.id;

      shuffle(item.words).forEach(w=>{
        const chip = document.createElement("div");
        chip.className = "word";
        chip.textContent = w;
        chip.draggable = !state.touch;
        chip.dataset.word = w;
        chip.addEventListener("click", ()=> selectWord(chip, section));
        chip.addEventListener("dragstart", (ev)=> ev.dataTransfer.setData("text/plain", w));
        bank.appendChild(chip);
      });

      bank.addEventListener("dragover", ev=>{ ev.preventDefault(); bank.classList.add("over"); });
      bank.addEventListener("dragleave", ()=> bank.classList.remove("over"));
      bank.addEventListener("drop", ev=>{
        ev.preventDefault(); bank.classList.remove("over");
        const w = ev.dataTransfer.getData("text/plain");
        moveWord(section, w, bank);
      });
      bank.addEventListener("click", ()=>{
        if(orderState.selectedWord) placeSelectedWord(section, bank);
      });

      slots.addEventListener("dragover", ev=>{ ev.preventDefault(); slots.classList.add("over"); });
      slots.addEventListener("dragleave", ()=> slots.classList.remove("over"));
      slots.addEventListener("drop", ev=>{
        ev.preventDefault(); slots.classList.remove("over");
        const w = ev.dataTransfer.getData("text/plain");
        moveWord(section, w, slots);
      });
      slots.addEventListener("click", ()=>{
        if(orderState.selectedWord) placeSelectedWord(section, slots);
      });

      row.appendChild(bank);
      row.appendChild(slots);
      section.appendChild(row);

      const controls = document.createElement("div");
      controls.className = "row row--right";
      controls.innerHTML = `
        <button class="btn btn--ghost" type="button" data-hint="${esc(item.id)}">💡 Hint</button>
        <button class="btn btn--primary" type="button" data-check="${esc(item.id)}">✅ Check</button>
        <button class="btn" type="button" data-reset="${esc(item.id)}">↺ Reset</button>`;
      section.appendChild(controls);

      const fb = document.createElement("div");
      fb.className = "feedback";
      fb.id = `fb_${item.id}`;
      section.appendChild(fb);

      root.appendChild(section);
    });
  }

  function selectWord(chip, section){
    // toggle selection
    $$(".word", section).forEach(x=>x.classList.remove("selected"));
    if(orderState.selectedWord === chip){
      orderState.selectedWord = null;
      return;
    }
    chip.classList.add("selected");
    orderState.selectedWord = chip;
  }

  function placeSelectedWord(section, container){
    const chip = orderState.selectedWord;
    if(!chip) return;
    chip.classList.remove("selected");
    container.appendChild(chip);
    orderState.selectedWord = null;
  }

  function moveWord(section, wordText, container){
    const chip = $(`.word[data-word="${CSS.escape(wordText)}"]`, section);
    if(!chip) return;
    chip.classList.remove("selected");
    container.appendChild(chip);
    orderState.selectedWord = null;
  }

  function resetOneOrder(id){
    const section = $(`.order[data-order="${CSS.escape(id)}"]`, $("#orderPolite"));
    if(!section) return;
    const item = orderItems.find(x=>x.id===id);
    if(!item) return;

    const bank = $(`.wordBank[data-bank="${CSS.escape(id)}"]`, section);
    const slots = $(`.slotRow[data-slots="${CSS.escape(id)}"]`, section);
    // move all chips back to bank and reshuffle
    const chips = $$(".word", section);
    bank.innerHTML = "";
    slots.innerHTML = "";
    shuffle(item.words).forEach(w=>{
      const existing = chips.find(c=>c.dataset.word===w);
      if(existing) bank.appendChild(existing);
    });
    $("#fb_"+id).textContent = "";
    $("#fb_"+id).className = "feedback";
  }

  function hintOrder(id){
    const fb = $("#fb_"+id);
    fb.className = "feedback warn";
    fb.textContent = state.frHelp === "on"
      ? "Astuce: commencez par une formule polie (Good morning / Could I…)."
      : "Hint: Start with a polite opener (Good morning / Could I…).";
  }

  function checkOrder(id){
    const section = $(`.order[data-order="${CSS.escape(id)}"]`, $("#orderPolite"));
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

  /* -------------------------
     Dialogue builder
  --------------------------*/
  function buildDialogue(data){
    const parent = data.parent || "Parent";
    const child = data.child || "my child";
    const age = data.age || "—";
    const grade = data.grade || "the right grade";
    const town = data.town || "your town";
    const arrive = data.arrive || "soon";
    const stateCode = data.state || "MA";

    const lines = [];
    lines.push({s:"Parent", t:`Hello, my name is ${parent}. We are moving to ${town}, ${stateCode}, and we would like to enroll ${child}.`});
    lines.push({s:"School", t:"Welcome! I can help with enrollment. What grade are you requesting?"});
    lines.push({s:"Parent", t:`${child} is ${age} years old. We think ${grade} is the best fit. Could you confirm the correct placement?`});

    if(data.scenario === "appointment"){
      lines.push({s:"School", t:"Of course. Would you like to schedule an appointment or a school tour?"});
      lines.push({s:"Parent", t:"Yes, please. What times are available next week?"});
    }else if(data.scenario === "records"){
      lines.push({s:"School", t:"Do you have previous school records or report cards?"});
      lines.push({s:"Parent", t:"Yes. We have report cards from France. Do you need an official translation?"});
    }else if(data.scenario === "ell"){
      lines.push({s:"School", t:"Thank you. Does your child need English language support?"});
      lines.push({s:"Parent", t:"Yes. My child is an English learner. How does your school provide ESL or ELL support? Also, do you have an interpreter for meetings?"});
    }else if(data.scenario === "special"){
      lines.push({s:"School", t:"Does your child have any learning support plans, such as an IEP or a 504 plan?"});
      lines.push({s:"Parent", t:"Possibly. We can share records and discuss supports. What is the process to request services?"});
    }else{
      lines.push({s:"School", t:"Great. Do you have proof of residency and immunization records?"});
      lines.push({s:"Parent", t:"We can provide our lease or utility bill, and the vaccination record. Could you send us the list of required documents and the enrollment form?"});
      lines.push({s:"School", t:`Yes. We can email the checklist. When are you arriving?`});
      lines.push({s:"Parent", t:`We are arriving ${arrive}. Thank you for your help.`});
    }

    lines.push({s:"School", t:"You’re welcome! Please contact us if you have any questions."});
    return lines;
  }

  function renderDialogue(lines){
    const out = $("#dlgOutput");
    out.innerHTML = lines.map(line=>`
      <div class="line">
        <div class="speaker">${esc(line.s)}</div>
        <div class="utterance">${esc(line.t)}</div>
      </div>
    `).join("");

    // Award points for generating a dialogue
    addPoints("dialogue", 25);
  }

  $("#dlgGenerate").addEventListener("click", ()=>{
    const data = {
      scenario: $("#dlgScenario").value,
      state: $("#dlgState").value,
      parent: $("#dlgParent").value.trim(),
      child: $("#dlgChild").value.trim(),
      age: $("#dlgAge").value,
      grade: $("#dlgGrade").value,
      town: $("#dlgTown").value.trim(),
      arrive: $("#dlgArrive").value.trim()
    };
    const lines = buildDialogue(data);
    renderDialogue(lines);
    store.set("ssu_lastDialogue", data);
  });

  $("#dlgCopy").addEventListener("click", ()=>{
    const text = $$(".line", $("#dlgOutput")).map(l=>{
      const who = $(".speaker", l).textContent.trim();
      const utt = $(".utterance", l).textContent.trim();
      return `${who}: ${utt}`;
    }).join("\n");
    navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(text).then(()=> alert("Copied!"))
      : alert("Copy is not available in this browser. Select and copy manually.");
  });

  $("#dlgSpeak").addEventListener("click", ()=>{
    const text = $$(".line", $("#dlgOutput")).map(l=>{
      const who = $(".speaker", l).textContent.trim();
      const utt = $(".utterance", l).textContent.trim();
      return `${who}. ${utt}`;
    }).join(" ");
    const ok = speak(text);
    if(!ok) alert("Text-to-Speech is not available in this browser.");
  });

  /* -------------------------
     Footer actions
  --------------------------*/
  $("#btnResetAll").addEventListener("click", ()=>{
    if(!confirm("Reset score + activities + checklist?")) return;
    state.awarded = {};
    store.set("ssu_awarded", state.awarded);
    setScore(0);
    resetChecklist();
    resetFill();
    renderMatchLevels();
    renderSort();
    renderOrder();
    renderQuiz();
  });

  $("#btnPrint").addEventListener("click", ()=> window.print());

  // Per-activity generic buttons
  document.addEventListener("click", (e)=>{
    const t = e.target;
    if(!(t instanceof HTMLElement)) return;

    const hintKey = t.getAttribute("data-hint");
    const checkKey = t.getAttribute("data-check");
    const resetKey = t.getAttribute("data-reset");

    if(hintKey){
      if(hintKey === "matchLevels") hintMatchLevels();
      else if(hintKey === "sortTypes") hintSort();
      else if(hintKey === "fillDocs") hintFill();
      else if(hintKey.startsWith("s")) hintOrder(hintKey);
    }
    if(checkKey){
      if(checkKey === "matchLevels") checkMatchLevels();
      else if(checkKey === "sortTypes") checkSort();
      else if(checkKey === "fillDocs") checkFill(true);
      else if(checkKey.startsWith("s")) checkOrder(checkKey);
    }
    if(resetKey){
      if(resetKey === "matchLevels") resetMatchLevels();
      else if(resetKey === "sortTypes") renderSort();
      else if(resetKey === "fillDocs") resetFill();
      else if(resetKey === "arrivalChecklist") resetChecklist();
      else if(resetKey.startsWith("s")) resetOneOrder(resetKey);
    }
  });

  // Back to top
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

    // Child speak button
    setChildProfile("13");

    renderMatchLevels();
    initFlashThemes();
    buildDeck();
    renderFlashcard();
    renderSort();
    renderQuiz();
    renderChecklist();
    renderFill();
    renderOrder();

    // Restore last dialogue data (optional)
    const last = store.get("ssu_lastDialogue", null);
    if(last){
      $("#dlgScenario").value = last.scenario || "enroll";
      $("#dlgState").value = last.state || "MA";
      $("#dlgParent").value = last.parent || "";
      $("#dlgChild").value = last.child || "";
      $("#dlgAge").value = last.age || "13";
      $("#dlgGrade").value = last.grade || "7th grade";
      $("#dlgTown").value = last.town || "";
      $("#dlgArrive").value = last.arrive || "";
    }

    // Award a tiny point if user is on touch and uses tap mode (encouragement)
    if(state.touch) addPoints("touchBonus", 5);
  }

  init();
})();
