/* SpeakEasyTisha — Professions lesson
   Fully interactive: flashcards, sorting, org chart, word order, fill blanks, QCM, dialogues, paragraph builder.
   Mac + iPad Safari friendly: every drag activity also supports TAP mode (tap tile → tap target).
*/
(function(){
  "use strict";

  /* -------------------------
     Helpers
  ------------------------- */
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls) => { const n=document.createElement(tag); if(cls) n.className=cls; return n; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const shuffle = (arr) => {
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const clamp = (n, min, max)=>Math.max(min, Math.min(max,n));

  function isProbablyTouch(){
    return (("ontouchstart" in window) || navigator.maxTouchPoints>0);
  }

  /* -------------------------
     i18n (UI labels only)
  ------------------------- */
  const I18N = {
    en:{
      tagline:"Interactive English • Mac/iPad friendly",
      nav_home:"Home", nav_lessons:"Lessons", nav_contact:"Contact",
      title:"Professions • Verbs • Company Org Chart",
      ui_language:"UI", accent:"Accent", interaction_mode:"Mode",
      mode_auto:"Auto", mode_drag:"Drag", mode_tap:"Tap",
      reset_all:"Reset all",
      score:"Score", streak:"Streak",
      intro:"Build realistic sentences about jobs, daily tasks, and company roles — then practice with sorting, word order, dialogues, and a paragraph builder.",
      callout_1_title:"Goal", callout_1_text:"Talk about people’s jobs with clear details: title, workplace, tasks, tools, and purpose.",
      callout_2_title:"Tip", callout_2_text:"On iPad/Safari, use Tap mode: tap a tile → tap a target.",
      callout_3_title:"Pronunciation", callout_3_text:"Every example can be read aloud with US or UK voices (browser Text‑to‑Speech).",
      flashcards:"Vocabulary Flashcards",
      filter_industry:"Industry",
      show_french:"Show French help",
      shuffle:"Shuffle",
      listen_word:"Listen: word",
      listen_example:"Listen: example",
      flashcards_tip:"Tap/click a card to flip. Use the filter to study by industry.",
      verbs_focus:"Verbs you often use with this job",
      sentence_structures:"Useful sentence structures",
      copy:"Copy",
      sorting:"Sort Jobs by Industry",
      check:"Check", reset:"Reset",
      sorting_tip:"Drag or tap job tiles into the correct industry box. (Tap mode: tap a tile → tap a box.)",
      job_tiles:"Job tiles",
      industries:"Industries",
      org_chart:"Company Org Chart (Organigram)",
      titles_mini_lesson:"Mini‑lesson: titles & reporting",
      org_tip:"Put the correct title into each box. Some titles belong at the same level.",
      titles_bank:"Title bank",
      word_order:"Word Order: Build the Sentence",
      new_sentence:"New sentence",
      hint:"Hint",
      word_order_tip:"Put the words in the correct order. Tap a word to select it, then tap a slot.",
      listen:"Listen",
      fill_blank:"Fill in the Blank (Word Bank)",
      new_item:"New",
      verbs_mini_lesson:"Mini‑lesson: job verbs",
      verbs_mini_text:"Use present simple for routines: “A nurse checks vital signs.” Use “can/could” for polite requests.",
      mcq:"Multiple Choice (QCM)",
      dialogues:"Realistic Dialogues",
      scenario:"Scenario",
      dialogue_tip:"Complete the dialogue line by line. Choose the most realistic option.",
      paragraph_builder:"Paragraph Builder",
      build:"Build",
      name:"Name",
      job_title:"Job title",
      industry:"Industry",
      workplace:"Workplace",
      main_tasks:"Main tasks (choose 2–3)",
      tools:"Tools / software",
      purpose:"Purpose",
      extra_detail:"Extra detail (optional)",
      clarity_check:"Clarity checklist (self‑check)",
      ck_title:"Title is clear",
      ck_place:"Workplace is clear",
      ck_tasks:"Tasks are specific",
      ck_purpose:"Purpose is included",
      ck_example:"Extra detail / example is included",
      your_paragraph:"Your paragraph",
      upgrade_title:"Upgrade your paragraph (step by step)",
      opinion:"Opinion & Troubleshooting",
      connectors:"Useful connectors",
      connectors_tip:"Use 1 connector + 1 example to sound more professional.",
      choose_position:"Choose a position",
      choose:"Choose…",
      agree:"I agree",
      disagree:"I disagree",
      mixed:"I partly agree",
      write_answer:"Write 2–4 sentences",
      save_tip:"Tip: You can screenshot your score for your portfolio.",
      footer_note:"Text‑to‑Speech depends on your browser’s installed voices."
    },
    fr:{
      tagline:"Anglais interactif • Compatible Mac/iPad",
      nav_home:"Accueil", nav_lessons:"Leçons", nav_contact:"Contact",
      title:"Métiers • Verbes • Organigramme d’entreprise",
      ui_language:"Interface", accent:"Accent", interaction_mode:"Mode",
      mode_auto:"Auto", mode_drag:"Glisser", mode_tap:"Tap",
      reset_all:"Tout réinitialiser",
      score:"Score", streak:"Série",
      intro:"Construisez des phrases réalistes sur les métiers, les tâches et les rôles en entreprise — puis entraînez‑vous avec tri, ordre des mots, dialogues et générateur de paragraphe.",
      callout_1_title:"Objectif", callout_1_text:"Parler du métier de quelqu’un avec des détails clairs : titre, lieu, tâches, outils, objectif.",
      callout_2_title:"Astuce", callout_2_text:"Sur iPad/Safari, utilisez le mode Tap : tap sur une tuile → tap sur une zone.",
      callout_3_title:"Prononciation", callout_3_text:"Chaque exemple peut être lu à voix haute (US ou UK) via la synthèse vocale du navigateur.",
      flashcards:"Flashcards de vocabulaire",
      filter_industry:"Secteur",
      show_french:"Afficher l’aide en français",
      shuffle:"Mélanger",
      listen_word:"Écouter : mot",
      listen_example:"Écouter : exemple",
      flashcards_tip:"Tap/cliquez sur une carte pour la retourner. Utilisez le filtre pour étudier par secteur.",
      verbs_focus:"Verbes fréquents avec ce métier",
      sentence_structures:"Structures utiles",
      copy:"Copier",
      sorting:"Trier les métiers par secteur",
      check:"Vérifier", reset:"Réinitialiser",
      sorting_tip:"Glissez ou tapez les tuiles dans la bonne catégorie. (Mode Tap : tuile → catégorie.)",
      job_tiles:"Tuiles métiers",
      industries:"Secteurs",
      org_chart:"Organigramme d’entreprise",
      titles_mini_lesson:"Mini‑leçon : titres & hiérarchie",
      org_tip:"Placez le bon titre dans chaque case. Certains titres sont au même niveau.",
      titles_bank:"Banque de titres",
      word_order:"Ordre des mots : construire la phrase",
      new_sentence:"Nouvelle phrase",
      hint:"Indice",
      word_order_tip:"Mettez les mots dans le bon ordre. Tap un mot puis tap une case.",
      listen:"Écouter",
      fill_blank:"Texte à trous (banque de mots)",
      new_item:"Nouveau",
      verbs_mini_lesson:"Mini‑leçon : verbes",
      verbs_mini_text:"On utilise le présent simple pour les habitudes : « A nurse checks vital signs ». Utilisez « can/could » pour des demandes polies.",
      mcq:"QCM",
      dialogues:"Dialogues réalistes",
      scenario:"Scénario",
      dialogue_tip:"Complétez le dialogue ligne par ligne. Choisissez l’option la plus réaliste.",
      paragraph_builder:"Générateur de paragraphe",
      build:"Générer",
      name:"Prénom",
      job_title:"Métier",
      industry:"Secteur",
      workplace:"Lieu",
      main_tasks:"Tâches principales (2–3)",
      tools:"Outils / logiciels",
      purpose:"Objectif",
      extra_detail:"Détail en plus (optionnel)",
      clarity_check:"Checklist de clarté (auto‑évaluation)",
      ck_title:"Titre clair",
      ck_place:"Lieu clair",
      ck_tasks:"Tâches précises",
      ck_purpose:"Objectif présent",
      ck_example:"Détail / exemple présent",
      your_paragraph:"Votre paragraphe",
      upgrade_title:"Améliorer étape par étape",
      opinion:"Opinion & argumentation",
      connectors:"Connecteurs utiles",
      connectors_tip:"Ajoutez 1 connecteur + 1 exemple pour un style plus pro.",
      choose_position:"Choisir une position",
      choose:"Choisir…",
      agree:"Je suis d’accord",
      disagree:"Je ne suis pas d’accord",
      mixed:"Je suis mitigé(e)",
      write_answer:"Écrire 2–4 phrases",
      save_tip:"Astuce : vous pouvez faire une capture d’écran du score.",
      footer_note:"La synthèse vocale dépend des voix installées sur votre navigateur."
    }
  };

  function applyI18n(lang){
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;
    document.body.querySelectorAll("[data-i18n]").forEach(node=>{
      const k=node.getAttribute("data-i18n");
      if(dict[k]) node.textContent = dict[k];
    });
  }

  /* -------------------------
     Global score / streak
  ------------------------- */
  let score=0, streak=0;
  function addScore(delta, isCorrect){
    score = Math.max(0, score + delta);
    if(isCorrect) streak += 1; else streak = 0;
    $("scoreTop").textContent = String(score);
    $("scoreBottom").textContent = String(score);
    $("streakTop").textContent = String(streak);
    $("streakBottom").textContent = String(streak);
  }

  function setFeedback(node, kind, msg){
    node.classList.remove("good","bad","warn");
    if(kind) node.classList.add(kind);
    node.textContent = msg || "";
  }

  /* -------------------------
     Mode (auto/drag/tap)
  ------------------------- */
  let interactionMode = "auto"; // resolved later
  let tapSelected = null; // {el, type, payload}
  let tapToastTimer = null;

  function resolveMode(){
    const sel = $("mode").value;
    if(sel==="auto"){
      interactionMode = isProbablyTouch() ? "tap" : "drag";
    }else{
      interactionMode = sel;
    }
    $("modeHint").textContent = interactionMode==="tap"
      ? "Tap mode: tap a tile → tap a target."
      : "Drag mode: drag tiles/words into targets.";
    return interactionMode;
  }

  function showToast(msg){
    const t = $("tapToast");
    t.textContent = msg;
    t.style.display="block";
    clearTimeout(tapToastTimer);
    tapToastTimer = setTimeout(()=>{ t.style.display="none"; }, 1800);
  }

  function clearTapSelection(){
    if(tapSelected && tapSelected.el){
      tapSelected.el.classList.remove("selected");
    }
    tapSelected = null;
  }

  /* -------------------------
     Text-to-Speech (US/UK)
  ------------------------- */
  let voices = [];
  function loadVoices(){
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if("speechSynthesis" in window){
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice(accent){
    // Try to select an English voice matching requested locale.
    const want = accent==="uk" ? ["en-GB","en-IE"] : ["en-US","en-CA"];
    const candidates = voices.filter(v => want.some(w => v.lang && v.lang.startsWith(w)));
    if(candidates.length) return candidates[0];

    // Fallback: any English voice
    const en = voices.filter(v => (v.lang||"").startsWith("en"));
    return en[0] || null;
  }

  function speak(text){
    const synth = window.speechSynthesis;
    if(!synth){ showToast("Text-to-Speech not supported."); return; }
    try{
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const accent = $("accent").value;
      const v = pickVoice(accent);
      if(v) u.voice = v;
      u.rate = 0.95;
      u.pitch = 1.0;
      synth.speak(u);
    }catch(e){
      showToast("TTS error.");
    }
  }

  /* -------------------------
     Data: Jobs, industries, verbs, examples
  ------------------------- */
  const industries = [
    {id:"all", en:"All", fr:"Tous"},
    {id:"health", en:"Healthcare", fr:"Santé"},
    {id:"edu", en:"Education", fr:"Éducation"},
    {id:"construction", en:"Construction", fr:"BTP"},
    {id:"tech", en:"Technology", fr:"Tech"},
    {id:"law", en:"Law", fr:"Droit"},
    {id:"finance", en:"Finance", fr:"Finance"},
    {id:"science", en:"Research & Science", fr:"Recherche & science"},
    {id:"hospitality", en:"Hospitality & Retail", fr:"Hôtellerie & commerce"},
    {id:"public", en:"Public services", fr:"Service public"}
  ];

  const jobs = [
    // Healthcare
    {id:"doctor", icon:"🩺", industry:"health", en:"doctor", fr:"médecin",
      def:"A medical professional who examines patients and treats illnesses.",
      verbs:["examine","diagnose","prescribe","treat","advise"],
      ex:"A doctor works at a doctor’s office or a hospital. We go to see a doctor when we are sick with a cold."},
    {id:"nurse", icon:"🩹", industry:"health", en:"nurse", fr:"infirmier/ère",
      def:"A healthcare professional who cares for patients and monitors their condition.",
      verbs:["check","monitor","assist","care for","comfort"],
      ex:"A nurse checks vital signs and helps patients feel safe."},
    {id:"pharmacist", icon:"💊", industry:"health", en:"pharmacist", fr:"pharmacien/ne",
      def:"A professional who prepares and gives medicines and explains how to take them.",
      verbs:["dispense","explain","recommend","check interactions"],
      ex:"A pharmacist dispenses medication and explains the dosage."},
    {id:"dentist", icon:"🦷", industry:"health", en:"dentist", fr:"dentiste",
      def:"A professional who treats teeth and gums.",
      verbs:["examine","clean","fill","repair"],
      ex:"A dentist examines your teeth and fixes cavities."},

    // Education
    {id:"teacher", icon:"🍎", industry:"edu", en:"teacher", fr:"professeur(e) / enseignant(e)",
      def:"A professional who teaches students in a school.",
      verbs:["teach","explain","prepare","grade","encourage"],
      ex:"A teacher prepares lessons and helps students learn step by step."},
    {id:"professor", icon:"🎓", industry:"edu", en:"professor", fr:"professeur d'université",
      def:"A university-level teacher who lectures and often does research.",
      verbs:["lecture","supervise","research","publish"],
      ex:"A professor lectures at a university and supervises students."},
    {id:"tutor", icon:"📝", industry:"edu", en:"tutor", fr:"tuteur/trice",
      def:"A person who gives one-to-one help with learning.",
      verbs:["coach","review","practice","correct"],
      ex:"A tutor helps you practice and correct mistakes."},

    // Construction
    {id:"construction_worker", icon:"👷", industry:"construction", en:"construction worker", fr:"ouvrier du bâtiment",
      def:"A worker who builds and repairs structures on a construction site.",
      verbs:["build","carry","install","repair","measure"],
      ex:"A construction worker builds walls and follows safety rules on site."},
    {id:"electrician", icon:"💡", industry:"construction", en:"electrician", fr:"électricien/ne",
      def:"A professional who installs and repairs electrical systems.",
      verbs:["install","wire","test","repair"],
      ex:"An electrician installs lighting and checks circuits."},
    {id:"plumber", icon:"🔧", industry:"construction", en:"plumber", fr:"plombier",
      def:"A professional who installs and fixes water pipes and bathrooms.",
      verbs:["install","fix","unclog","replace"],
      ex:"A plumber fixes leaks and replaces broken pipes."},
    {id:"civil_engineer", icon:"🏗️", industry:"construction", en:"civil engineer", fr:"ingénieur civil",
      def:"An engineer who designs and supervises infrastructure projects.",
      verbs:["design","calculate","inspect","supervise","plan"],
      ex:"A civil engineer designs bridges and inspects structures for safety."},
    {id:"architect", icon:"📐", industry:"construction", en:"architect", fr:"architecte",
      def:"A professional who designs buildings and creates plans.",
      verbs:["design","draw","present","revise"],
      ex:"An architect designs buildings and presents plans to clients."},

    // Tech
    {id:"software_developer", icon:"💻", industry:"tech", en:"software developer", fr:"développeur/euse",
      def:"A professional who builds software applications.",
      verbs:["code","debug","test","deploy","maintain"],
      ex:"A software developer writes code, fixes bugs, and deploys updates."},
    {id:"programmer", icon:"👨‍💻", industry:"tech", en:"programmer", fr:"programmeur/euse",
      def:"A person who writes computer programs.",
      verbs:["code","write","run","refactor"],
      ex:"A programmer writes programs to automate tasks."},
    {id:"data_scientist", icon:"📊", industry:"tech", en:"data scientist", fr:"data scientist / analyste de données",
      def:"A professional who analyzes data and builds models to make predictions.",
      verbs:["analyze","model","visualize","predict"],
      ex:"A data scientist analyzes data to find patterns and make predictions."},
    {id:"it_support", icon:"🛠️", industry:"tech", en:"IT support technician", fr:"technicien support IT",
      def:"A professional who helps users solve computer problems.",
      verbs:["troubleshoot","install","configure","support"],
      ex:"An IT support technician troubleshoots issues and configures laptops."},
    {id:"cybersecurity", icon:"🛡️", industry:"tech", en:"cybersecurity analyst", fr:"analyste cybersécurité",
      def:"A professional who protects systems and data from attacks.",
      verbs:["monitor","secure","detect","respond"],
      ex:"A cybersecurity analyst monitors threats and responds to incidents."},

    // Law
    {id:"lawyer", icon:"⚖️", industry:"law", en:"lawyer", fr:"avocat(e)",
      def:"A professional who gives legal advice and represents clients.",
      verbs:["advise","represent","negotiate","draft","argue"],
      ex:"A lawyer advises clients and drafts contracts."},
    {id:"judge", icon:"🧑‍⚖️", industry:"law", en:"judge", fr:"juge",
      def:"A person who makes decisions in court.",
      verbs:["listen","decide","rule","sentence"],
      ex:"A judge listens to evidence and makes a decision."},
    {id:"paralegal", icon:"📄", industry:"law", en:"paralegal", fr:"assistant(e) juridique",
      def:"A legal assistant who prepares documents and supports lawyers.",
      verbs:["prepare","file","research","organize"],
      ex:"A paralegal prepares documents and organizes case files."},

    // Finance
    {id:"banker", icon:"🏦", industry:"finance", en:"banker", fr:"banquier/ère",
      def:"A professional who helps clients manage accounts and financial products.",
      verbs:["advise","open accounts","process","approve","verify"],
      ex:"A banker advises clients and helps them open an account."},
    {id:"accountant", icon:"🧾", industry:"finance", en:"accountant", fr:"comptable",
      def:"A professional who manages financial records and reports.",
      verbs:["record","calculate","report","prepare","reconcile"],
      ex:"An accountant prepares financial reports and checks invoices."},
    {id:"financial_analyst", icon:"📈", industry:"finance", en:"financial analyst", fr:"analyste financier",
      def:"A professional who studies financial data to support decisions.",
      verbs:["analyze","forecast","compare","recommend"],
      ex:"A financial analyst forecasts revenue and recommends strategies."},
    {id:"auditor", icon:"🔍", industry:"finance", en:"auditor", fr:"auditeur/trice",
      def:"A professional who checks accounts to ensure accuracy and compliance.",
      verbs:["audit","verify","review","report"],
      ex:"An auditor reviews accounts and reports risks."},

    // Science
    {id:"researcher", icon:"🔬", industry:"science", en:"researcher", fr:"chercheur/euse",
      def:"A professional who studies a topic to discover new information.",
      verbs:["research","test","measure","publish","present"],
      ex:"A researcher conducts experiments and publishes results."},
    {id:"scientist", icon:"🧪", industry:"science", en:"scientist", fr:"scientifique",
      def:"A person who uses scientific methods to understand how things work.",
      verbs:["experiment","observe","analyze","hypothesize"],
      ex:"A scientist runs experiments and analyzes results."},
    {id:"lab_technician", icon:"🧫", industry:"science", en:"laboratory technician", fr:"technicien(ne) de laboratoire",
      def:"A professional who prepares samples and maintains lab equipment.",
      verbs:["prepare","label","calibrate","maintain"],
      ex:"A lab technician prepares samples and calibrates machines."},
    {id:"mathematician", icon:"➗", industry:"science", en:"mathematician", fr:"mathématicien(ne)",
      def:"A specialist who studies mathematics and builds models to solve problems.",
      verbs:["model","prove","calculate","optimize"],
      ex:"A mathematician builds models to solve complex problems."},
    {id:"engineer", icon:"🧠", industry:"science", en:"engineer", fr:"ingénieur",
      def:"A professional who designs solutions using science and technology.",
      verbs:["design","test","improve","optimize"],
      ex:"An engineer designs solutions and tests prototypes."},

    // Hospitality & retail
    {id:"receptionist", icon:"🛎️", industry:"hospitality", en:"receptionist", fr:"réceptionniste",
      def:"A person who welcomes customers and manages information at a front desk.",
      verbs:["greet","check in","answer","manage reservations"],
      ex:"A receptionist greets guests and manages reservations."},
    {id:"chef", icon:"👨‍🍳", industry:"hospitality", en:"chef", fr:"chef(fe) cuisinier",
      def:"A professional cook who prepares meals and manages a kitchen.",
      verbs:["prepare","cook","taste","manage"],
      ex:"A chef prepares meals and manages the kitchen team."},
    {id:"sales_assistant", icon:"🛍️", industry:"hospitality", en:"sales assistant", fr:"vendeur/euse",
      def:"A person who helps customers in a store.",
      verbs:["recommend","help","sell","process payments"],
      ex:"A sales assistant recommends products and answers questions."},

    // Public services
    {id:"police_officer", icon:"👮", industry:"public", en:"police officer", fr:"policier/ère",
      def:"A public servant who helps keep people safe and enforces laws.",
      verbs:["patrol","protect","respond","investigate"],
      ex:"A police officer patrols and responds to emergencies."},
    {id:"firefighter", icon:"🚒", industry:"public", en:"firefighter", fr:"pompier",
      def:"A person trained to put out fires and help in emergencies.",
      verbs:["rescue","respond","extinguish","protect"],
      ex:"A firefighter responds quickly and rescues people."},
    {id:"civil_servant", icon:"🏛️", industry:"public", en:"civil servant", fr:"fonctionnaire",
      def:"A worker employed by the government or public administration.",
      verbs:["process","manage","coordinate","support"],
      ex:"A civil servant processes requests and supports public services."}
  ];

  /* -------------------------
     Flashcards
  ------------------------- */
  let cards = jobs.slice();
  let cardIndex = 0;
  let cardFiltered = jobs.slice();

  function getLang(){ return $("uiLang").value || "en"; }
  function indLabel(id){
    const item = industries.find(x=>x.id===id);
    const lang = getLang();
    if(!item) return id;
    return lang==="fr" ? item.fr : item.en;
  }

  function updateCard(){
    if(!cardFiltered.length) return;
    cardIndex = clamp(cardIndex, 0, cardFiltered.length-1);
    const c = cardFiltered[cardIndex];

    $("flashIcon").textContent = c.icon;
    $("flashWord").textContent = c.en;
    $("flashMeta").textContent = indLabel(c.industry);

    $("flashDef").innerHTML = `<strong>${esc(c.def)}</strong>`;
    $("flashEx").innerHTML = `<div><span class="kbd">Example</span> ${esc(c.ex)}</div>`;
    $("flashFr").innerHTML = `<div><span class="kbd">FR</span> <strong>${esc(c.fr)}</strong> — ${esc(c.def)}</div>`;

    $("cardIndex").textContent = String(cardIndex+1);
    $("cardTotal").textContent = String(cardFiltered.length);

    // verbs chips
    const wrap = $("verbChips");
    wrap.innerHTML="";
    c.verbs.forEach(v=>{
      const chip = el("span","chip");
      chip.textContent = v;
      wrap.appendChild(chip);
    });

    // structure example updates
    $("structureExample").textContent = c.ex;
    // unflip
    $("flashcard").classList.remove("flipped");
  }

  function setFilterOptions(){
    const sel = $("industryFilter");
    const lang = getLang();
    sel.innerHTML="";
    industries.forEach(it=>{
      const opt = el("option");
      opt.value = it.id;
      opt.textContent = (lang==="fr" ? it.fr : it.en);
      if(it.id==="all") opt.textContent = (lang==="fr" ? "Tous" : "All");
      sel.appendChild(opt);
    });
    sel.value="all";
  }

  function applyIndustryFilter(){
    const id = $("industryFilter").value;
    if(id==="all"){
      cardFiltered = jobs.slice();
    }else{
      cardFiltered = jobs.filter(j=>j.industry===id);
    }
    cardIndex=0;
    updateCard();
  }

  function nextCard(){ cardIndex = (cardIndex+1) % cardFiltered.length; updateCard(); }
  function prevCard(){ cardIndex = (cardIndex-1+cardFiltered.length) % cardFiltered.length; updateCard(); }

  function bindFlashcard(){
    const fc = $("flashcard");
    fc.addEventListener("click", ()=>fc.classList.toggle("flipped"));
    fc.addEventListener("keydown", (e)=>{
      if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        fc.classList.toggle("flipped");
      }
    });
    $("nextCard").addEventListener("click", nextCard);
    $("prevCard").addEventListener("click", prevCard);
    $("shuffleCards").addEventListener("click", ()=>{
      // shuffle within current filter
      cardFiltered = shuffle(cardFiltered);
      cardIndex=0;
      updateCard();
      showToast("Shuffled!");
    });

    $("showFrench").addEventListener("change", (e)=>{
      document.body.classList.toggle("showFrench", !!e.target.checked);
    });

    $("industryFilter").addEventListener("change", applyIndustryFilter);

    $("speakWord").addEventListener("click", ()=>{
      const c = cardFiltered[cardIndex];
      speak(c.en);
    });
    $("speakExample").addEventListener("click", ()=>{
      const c = cardFiltered[cardIndex];
      speak(c.ex);
    });
    $("speakStructure").addEventListener("click", ()=>{
      speak($("structureExample").textContent);
    });
    $("copyStructure").addEventListener("click", async ()=>{
      try{
        await navigator.clipboard.writeText($("structureExample").textContent);
        showToast("Copied!");
      }catch(e){
        showToast("Copy not available.");
      }
    });
  }

  /* -------------------------
     Drag + Tap helpers
  ------------------------- */
  function enableDnD(draggableEl, payload){
    // payload: string id
    draggableEl.setAttribute("draggable", "true");
    draggableEl.addEventListener("dragstart", (e)=>{
      if(resolveMode()==="tap"){
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", payload);
      e.dataTransfer.effectAllowed = "move";
    });
  }

  function makeDropZone(zoneEl, onDrop){
    zoneEl.addEventListener("dragover", (e)=>{
      if(resolveMode()==="tap") return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    zoneEl.addEventListener("drop", (e)=>{
      if(resolveMode()==="tap") return;
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      onDrop(id, zoneEl);
    });

    // tap mode: tap target after selecting tile
    zoneEl.addEventListener("click", ()=>{
      if(resolveMode()!=="tap") return;
      if(!tapSelected) return;
      onDrop(tapSelected.payload, zoneEl);
      clearTapSelection();
    });
  }

  function makeTapSelectable(tileEl, payload, helpText){
    tileEl.addEventListener("click", ()=>{
      if(resolveMode()!=="tap") return;
      if(tapSelected && tapSelected.el===tileEl){
        clearTapSelection();
        showToast("Selection cleared.");
        return;
      }
      clearTapSelection();
      tapSelected = {el: tileEl, payload};
      tileEl.classList.add("selected");
      showToast(helpText || "Selected. Now tap a target.");
    });
  }

  function detachIfAlreadyPlaced(tileId){
    // remove existing instance placed in targets
    document.querySelectorAll(`[data-placed="${tileId}"]`).forEach(n=>n.remove());
  }

  /* -------------------------
     2) Sorting by industry
  ------------------------- */
  const sortingTargets = ["health","edu","construction","tech","law","finance","science","hospitality","public"];
  function renderSorting(){
    const bank = $("jobTiles");
    bank.innerHTML="";

    const list = shuffle(jobs.map(j=>j.id));
    list.forEach(id=>{
      const j = jobs.find(x=>x.id===id);
      const tile = el("div","tile");
      tile.id = `tile_${id}`;
      tile.dataset.id = id;
      tile.innerHTML = `<span aria-hidden="true">${j.icon}</span><strong>${esc(j.en)}</strong> <small>(${esc(j.fr)})</small>`;
      enableDnD(tile, `job:${id}`);
      makeTapSelectable(tile, `job:${id}`, "Selected job. Tap an industry box.");
      bank.appendChild(tile);
    });

    const grid = $("industryTargets");
    grid.innerHTML="";
    sortingTargets.forEach(ind=>{
      const t = el("div","target");
      t.dataset.ind = ind;
      const title = el("div","targetTitle");
      title.textContent = indLabel(ind);
      const zone = el("div","dropZone");
      zone.dataset.kind = "industry";
      zone.dataset.ind = ind;
      t.appendChild(title);
      t.appendChild(zone);
      makeDropZone(zone, (payload, z)=>{
        if(!payload.startsWith("job:")) return;
        const id = payload.split(":")[1];
        // if already placed elsewhere, remove that copy
        detachIfAlreadyPlaced(`job:${id}`);
        const j = jobs.find(x=>x.id===id);
        const placed = el("div","tile placed");
        placed.dataset.placed = `job:${id}`;
        placed.dataset.id = id;
        placed.innerHTML = `<span aria-hidden="true">${j.icon}</span><strong>${esc(j.en)}</strong>`;
        // allow moving placed tile
        enableDnD(placed, `job:${id}`);
        makeTapSelectable(placed, `job:${id}`, "Selected. Tap a different industry to move it.");
        // tap remove back to bank (optional)
        placed.addEventListener("dblclick", ()=>{
          // remove and restore original tile visibility
          placed.remove();
        });
        z.appendChild(placed);
      });
      grid.appendChild(t);
    });

    setFeedback($("sortingFeedback"), "", "");
  }

  function checkSorting(){
    let correct=0, total=0;
    sortingTargets.forEach(ind=>{
      const zone = document.querySelector(`.dropZone[data-ind="${ind}"]`);
      const placed = Array.from(zone.querySelectorAll(".tile.placed"));
      placed.forEach(p=>{
        total += 1;
        const jobId = p.dataset.id;
        const job = jobs.find(x=>x.id===jobId);
        if(job && job.industry===ind){
          correct += 1;
          p.classList.add("ok");
          p.style.borderColor = "rgba(105,240,174,.55)";
        }else{
          p.style.borderColor = "rgba(255,107,107,.55)";
        }
      });
    });

    const feedback = $("sortingFeedback");
    if(total===0){
      setFeedback(feedback, "warn", "Place at least 5 job tiles first.");
      addScore(0,false);
      return;
    }
    if(correct===total && total>=10){
      setFeedback(feedback, "good", `Perfect! ${correct}/${total} correct.`);
      addScore(3,true);
    }else{
      setFeedback(feedback, correct/Math.max(1,total) >= 0.7 ? "warn" : "bad", `${correct}/${total} correct. Fix the red tiles.`);
      addScore(correct, correct/Math.max(1,total) >= 0.7);
    }
  }

  function resetSorting(){
    renderSorting();
  }

  /* -------------------------
     3) Org chart
  ------------------------- */
  const orgNodes = [
    {id:"n_ceo", labelEN:"Top", labelFR:"Sommet", hintEN:"Company leader", hintFR:"Direction", correct:["CEO"]},
    {id:"n_csuite", labelEN:"C‑suite", labelFR:"Direction", hintEN:"Key executives", hintFR:"Cadres dirigeants", correct:["CTO","CFO","COO"]},
    {id:"n_hr", labelEN:"People", labelFR:"RH", hintEN:"Human Resources", hintFR:"Ressources humaines", correct:["HR Manager"]},
    {id:"n_pm", labelEN:"Delivery", labelFR:"Projets", hintEN:"Projects & planning", hintFR:"Gestion de projet", correct:["Project Manager"]},
    {id:"n_eng", labelEN:"Engineering", labelFR:"Ingénierie", hintEN:"Build the product", hintFR:"Construire", correct:["Engineering Manager"]},
    {id:"n_ops", labelEN:"Operations", labelFR:"Opérations", hintEN:"Run daily operations", hintFR:"Organisation", correct:["Operations Manager"]},
    {id:"n_team", labelEN:"Team", labelFR:"Équipe", hintEN:"Leads & specialists", hintFR:"Encadrement", correct:["Team Lead","Analyst"]},
    {id:"n_staff", labelEN:"Staff", labelFR:"Collaborateurs", hintEN:"Individual contributors", hintFR:"Exécutants", correct:["Developer","Accountant"]},
    {id:"n_intern", labelEN:"Entry level", labelFR:"Débutant", hintEN:"Learn & support", hintFR:"Apprendre", correct:["Intern"]}
  ];

  const titleBank = [
    "CEO","COO","CFO","CTO",
    "HR Manager","Project Manager","Engineering Manager","Operations Manager",
    "Team Lead","Analyst","Developer","Accountant","Intern"
  ];

  function renderOrgChart(){
    // bank
    const bank = $("titleTiles");
    bank.innerHTML="";
    shuffle(titleBank).forEach(t=>{
      const tile = el("div","tile");
      tile.dataset.title = t;
      tile.innerHTML = `<span aria-hidden="true">🏷️</span><strong>${esc(t)}</strong>`;
      enableDnD(tile, `title:${t}`);
      makeTapSelectable(tile, `title:${t}`, "Selected title. Tap a box in the organigram.");
      bank.appendChild(tile);
    });

    // chart
    const chart = $("orgChart");
    chart.innerHTML="";
    const lang = getLang();
    orgNodes.forEach(n=>{
      const node = el("div","orgNode");
      node.dataset.node = n.id;
      const head = el("div","nodeLabel");
      head.textContent = (lang==="fr" ? n.labelFR : n.labelEN);
      const hint = el("div","nodeHint");
      hint.textContent = (lang==="fr" ? n.hintFR : n.hintEN);
      const zone = el("div","dropZone");
      zone.dataset.node = n.id;
      makeDropZone(zone, (payload, z)=>{
        if(!payload.startsWith("title:")) return;
        const title = payload.split(":")[1];
        // remove if already placed
        detachIfAlreadyPlaced(`title:${title}`);
        const placed = el("div","tile placed");
        placed.dataset.placed = `title:${title}`;
        placed.dataset.title = title;
        placed.innerHTML = `<span aria-hidden="true">🏷️</span><strong>${esc(title)}</strong>`;
        enableDnD(placed, `title:${title}`);
        makeTapSelectable(placed, `title:${title}`, "Selected. Tap a different org box to move it.");
        z.appendChild(placed);
      });

      node.appendChild(head);
      node.appendChild(hint);
      node.appendChild(zone);
      chart.appendChild(node);
    });

    setFeedback($("orgFeedback"), "", "");
  }

  function checkOrg(){
    let correct=0, total=0;
    orgNodes.forEach(n=>{
      const zone = document.querySelector(`.dropZone[data-node="${n.id}"]`);
      const placed = Array.from(zone.querySelectorAll(".tile.placed"));
      placed.forEach(p=>{
        total += 1;
        const title = p.dataset.title;
        const ok = n.correct.includes(title);
        if(ok){
          correct += 1;
          p.style.borderColor="rgba(105,240,174,.55)";
        }else{
          p.style.borderColor="rgba(255,107,107,.55)";
        }
      });
    });

    if(total===0){
      setFeedback($("orgFeedback"), "warn", "Place at least 6 titles first.");
      addScore(0,false);
      return;
    }
    if(correct===total && total>=10){
      setFeedback($("orgFeedback"), "good", `Excellent! ${correct}/${total} correct.`);
      addScore(3,true);
    }else{
      setFeedback($("orgFeedback"), correct/Math.max(1,total) >= 0.7 ? "warn" : "bad", `${correct}/${total} correct. Move the red titles.`);
      addScore(correct, correct/Math.max(1,total) >= 0.7);
    }
  }

  function resetOrg(){
    renderOrgChart();
  }

  /* -------------------------
     4) Word Order sentences
  ------------------------- */
  const sentenceItems = [
    {
      prompt:"Build a clear job sentence:",
      answer:"A doctor works at a doctor’s office . We go to see him when we are sick with a cold .",
    },
    {
      prompt:"Build a clear job sentence:",
      answer:"A software developer writes code , tests features , and fixes bugs .",
    },
    {
      prompt:"Build a clear job sentence:",
      answer:"A teacher explains new concepts and grades homework .",
    },
    {
      prompt:"Build a clear job sentence:",
      answer:"A banker helps clients open an account and answers questions about fees .",
    },
    {
      prompt:"Build a clear job sentence:",
      answer:"A civil engineer designs bridges and inspects structures for safety .",
    },
    {
      prompt:"Build a clear job sentence:",
      answer:"A lawyer advises clients and negotiates contracts .",
    },
  ];
  let currentSentence = null;

  function tokenizeSentence(s){
    // keep punctuation as separate tokens
    // Also keep curly apostrophes.
    const tokens = s.match(/[A-Za-zÀ-ÿ0-9’']+|[.,!?]/g) || [];
    return tokens;
  }

  function renderSentence(item){
    currentSentence = item;
    $("sentencePrompt").textContent = item.prompt;
    const tokens = tokenizeSentence(item.answer);
    const bank = $("sentenceBank");
    const slots = $("sentenceSlots");
    bank.innerHTML="";
    slots.innerHTML="";
    clearTapSelection();

    // slots
    tokens.forEach((t, idx)=>{
      const s = el("div","slot");
      s.dataset.slot = String(idx);
      s.dataset.word = "";
      s.textContent = "…";
      makeDropZone(s, (payload, zone)=>{
        if(!payload.startsWith("word:")) return;
        const wordId = payload.slice(5);
        const tile = document.querySelector(`[data-wordid="${CSS.escape(wordId)}"]`);
        if(!tile) return;

        // If zone already filled, swap: move existing back to bank.
        if(zone.classList.contains("filled")){
          const existingId = zone.dataset.wordid;
          if(existingId){
            const existingTile = document.querySelector(`[data-wordid="${CSS.escape(existingId)}"]`);
            if(existingTile){
              existingTile.style.display="";
            }else{
              // recreate missing tile
              const nt = makeWordTile(zone.dataset.word, existingId);
              bank.appendChild(nt);
            }
          }
        }

        zone.classList.add("filled");
        zone.dataset.word = tile.dataset.word;
        zone.dataset.wordid = wordId;
        zone.textContent = tile.dataset.word;
        tile.style.display="none";
      });
      // tap remove: tap slot to return word to bank
      s.addEventListener("click", ()=>{
        if(resolveMode()!=="tap") return;
        if(tapSelected && tapSelected.payload && tapSelected.payload.startsWith("word:")){
          // selection handled by dropZone click
          return;
        }
        // no selection => remove
        if(s.classList.contains("filled")){
          const wid = s.dataset.wordid;
          const t = document.querySelector(`[data-wordid="${CSS.escape(wid)}"]`);
          if(t) t.style.display="";
          s.classList.remove("filled");
          s.dataset.word="";
          s.dataset.wordid="";
          s.textContent="…";
          showToast("Returned to bank.");
        }
      });
      slots.appendChild(s);
    });

    // bank
    const shuffled = shuffle(tokens.map((w,i)=>({w, i})));
    shuffled.forEach(obj=>{
      const wordId = `w_${Date.now()}_${Math.random().toString(16).slice(2)}_${obj.i}`;
      const tile = makeWordTile(obj.w, wordId);
      bank.appendChild(tile);
    });

    setFeedback($("sentenceFeedback"), "", "");
  }

  function makeWordTile(word, wordId){
    const tile = el("div","tile");
    tile.dataset.word = word;
    tile.dataset.wordid = wordId;
    tile.innerHTML = `<strong>${esc(word)}</strong>`;
    enableDnD(tile, `word:${wordId}`);
    makeTapSelectable(tile, `word:${wordId}`, "Selected word. Tap a slot.");
    return tile;
  }

  function resetSentence(){
    if(!currentSentence) return;
    renderSentence(currentSentence);
  }

  function getBuiltSentence(){
    const slots = Array.from(document.querySelectorAll("#sentenceSlots .slot"));
    const words = slots.map(s=>s.dataset.word || "");
    return words.filter(Boolean).join(" ").replace(/\s+([.,!?])/g, "$1");
  }

  function checkSentence(){
    if(!currentSentence) return;
    const built = getBuiltSentence();
    const target = currentSentence.answer.replace(/\s+([.,!?])/g, "$1");
    const done = built.length>0 && !built.includes("…");
    if(!done){
      setFeedback($("sentenceFeedback"), "warn", "Fill all slots first.");
      addScore(0,false);
      return;
    }
    if(built===target){
      setFeedback($("sentenceFeedback"), "good", "Correct ✅");
      addScore(2,true);
    }else{
      setFeedback($("sentenceFeedback"), "bad", "Not quite. Try again (use Hint).");
      addScore(0,false);
    }
  }

  function hintSentence(){
    if(!currentSentence) return;
    // reveal first missing slot
    const targetTokens = tokenizeSentence(currentSentence.answer);
    const slots = Array.from(document.querySelectorAll("#sentenceSlots .slot"));
    const idx = slots.findIndex(s=>!s.classList.contains("filled"));
    if(idx<0){
      showToast("All filled.");
      return;
    }
    const needed = targetTokens[idx];

    // find a tile in bank matching needed
    const tiles = Array.from(document.querySelectorAll("#sentenceBank .tile"));
    const match = tiles.find(t=>t.style.display!== "none" && t.dataset.word===needed);
    if(match){
      // simulate drop (tap-friendly)
      match.style.display="none";
      const s = slots[idx];
      s.classList.add("filled");
      s.dataset.word = needed;
      s.dataset.wordid = match.dataset.wordid;
      s.textContent = needed;
      setFeedback($("sentenceFeedback"), "warn", `Hint: slot ${idx+1} is “${needed}”.`);
      addScore(0,true);
    }else{
      setFeedback($("sentenceFeedback"), "warn", `Hint: slot ${idx+1} is “${needed}”.`);
    }
  }

  /* -------------------------
     5) Fill in blanks with word bank (drag/tap words into blanks)
  ------------------------- */
  const blankItems = [
    {
      sentence:"A nurse ____ vital signs and ____ patients in a hospital.",
      options:["checks","comforts","writes","negotiates"],
      answers:["checks","comforts"],
      hint:"Think: routine actions in a hospital."
    },
    {
      sentence:"A programmer ____ code and ____ bugs.",
      options:["writes","fixes","prescribes","patrols"],
      answers:["writes","fixes"],
      hint:"What do we do with code?"
    },
    {
      sentence:"A lawyer ____ clients and ____ contracts.",
      options:["advises","drafts","cooks","builds"],
      answers:["advises","drafts"],
      hint:"Legal work: advice + documents."
    },
    {
      sentence:"An accountant ____ invoices and ____ reports.",
      options:["checks","prepares","rescues","teaches"],
      answers:["checks","prepares"],
      hint:"Finance tasks: invoices + reports."
    }
  ];
  let currentBlank = null;

  function renderBlank(item){
    currentBlank = item;
    clearTapSelection();
    setFeedback($("blankFeedback"), "", "");

    const sentenceEl = $("blankSentence");
    const bank = $("blankBank");
    bank.innerHTML="";

    // Create blanks
    let blankIndex = 0;
    const parts = item.sentence.split("____");
    const wrap = el("div");
    wrap.className="fillSentence";
    parts.forEach((p, idx)=>{
      const span = el("span");
      span.innerHTML = esc(p);
      wrap.appendChild(span);
      if(idx < parts.length-1){
        const b = el("span","blank");
        b.dataset.blank = String(blankIndex);
        b.dataset.word = "";
        b.textContent = "_____";
        makeDropZone(b, (payload, zone)=>{
          if(!payload.startsWith("bw:")) return;
          const wid = payload.slice(3);
          const tile = document.querySelector(`[data-bwid="${CSS.escape(wid)}"]`);
          if(!tile) return;

          // swap out existing
          if(zone.classList.contains("filled")){
            const existing = zone.dataset.word;
            // restore a tile in bank
            const restored = el("div","tile");
            const newId = `bw_${Date.now()}_${Math.random().toString(16).slice(2)}`;
            restored.dataset.bwid = newId;
            restored.dataset.word = existing;
            restored.innerHTML = `<strong>${esc(existing)}</strong>`;
            enableDnD(restored, `bw:${newId}`);
            makeTapSelectable(restored, `bw:${newId}`, "Selected. Tap a blank.");
            bank.appendChild(restored);
          }

          zone.classList.add("filled");
          zone.dataset.word = tile.dataset.word;
          zone.textContent = tile.dataset.word;
          tile.remove();
        });
        // tap remove
        b.addEventListener("click", ()=>{
          if(resolveMode()!=="tap") return;
          if(tapSelected && tapSelected.payload && tapSelected.payload.startsWith("bw:")){
            // handled by dropzone click
            return;
          }
          if(b.classList.contains("filled")){
            const word = b.dataset.word;
            const newId = `bw_${Date.now()}_${Math.random().toString(16).slice(2)}`;
            const restored = el("div","tile");
            restored.dataset.bwid = newId;
            restored.dataset.word = word;
            restored.innerHTML = `<strong>${esc(word)}</strong>`;
            enableDnD(restored, `bw:${newId}`);
            makeTapSelectable(restored, `bw:${newId}`, "Selected. Tap a blank.");
            bank.appendChild(restored);

            b.classList.remove("filled");
            b.dataset.word="";
            b.textContent="_____";
            showToast("Returned to bank.");
          }
        });

        wrap.appendChild(b);
        blankIndex += 1;
      }
    });

    sentenceEl.innerHTML="";
    sentenceEl.appendChild(wrap);

    // bank options
    shuffle(item.options).forEach(w=>{
      const id = `bw_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const tile = el("div","tile");
      tile.dataset.bwid = id;
      tile.dataset.word = w;
      tile.innerHTML = `<strong>${esc(w)}</strong>`;
      enableDnD(tile, `bw:${id}`);
      makeTapSelectable(tile, `bw:${id}`, "Selected. Tap a blank.");
      bank.appendChild(tile);
    });
  }

  function getBlankAnswer(){
    const blanks = Array.from(document.querySelectorAll("#blankSentence .blank"));
    return blanks.map(b=>b.dataset.word || "");
  }

  function checkBlank(){
    if(!currentBlank) return;
    const ans = getBlankAnswer();
    if(ans.some(x=>!x)){
      setFeedback($("blankFeedback"), "warn", "Fill all blanks first.");
      addScore(0,false);
      return;
    }
    let correct=0;
    ans.forEach((w,i)=>{
      if(w===currentBlank.answers[i]) correct += 1;
    });
    const all = correct===currentBlank.answers.length;
    if(all){
      setFeedback($("blankFeedback"), "good", "Correct ✅");
      addScore(2,true);
    }else{
      setFeedback($("blankFeedback"), "bad", `Not quite: ${correct}/${currentBlank.answers.length} correct.`);
      addScore(correct, false);
    }
  }

  function hintBlank(){
    if(!currentBlank) return;
    setFeedback($("blankFeedback"), "warn", `Hint: ${currentBlank.hint}`);
    addScore(0,true);
  }

  function resetBlank(){
    if(!currentBlank) return;
    renderBlank(currentBlank);
  }

  /* -------------------------
     6) QCM
  ------------------------- */
  const qcmItems = [
    {
      q:"Where does a dentist usually work?",
      choices:[
        {a:"In a dental clinic", ok:true, info:"Teeth and gums."},
        {a:"On a construction site", ok:false, info:"That’s construction."},
        {a:"In a courtroom", ok:false, info:"That’s law."},
        {a:"In a restaurant kitchen", ok:false, info:"That’s hospitality."}
      ],
      hint:"Think: teeth."
    },
    {
      q:"Which verb best matches a data scientist?",
      choices:[
        {a:"analyze data", ok:true, info:"Patterns, models, predictions."},
        {a:"prescribe medicine", ok:false, info:"Healthcare."},
        {a:"put out fires", ok:false, info:"Firefighter."},
        {a:"fill cavities", ok:false, info:"Dentist."}
      ],
      hint:"Data → analysis."
    },
    {
      q:"Choose the most professional sentence:",
      choices:[
        {a:"I do stuff in my job.", ok:false, info:"Too vague."},
        {a:"I’m an engineer. I design solutions and test prototypes.", ok:true, info:"Clear + specific tasks."},
        {a:"Engineer, yes.", ok:false, info:"Incomplete."},
        {a:"I work in… maybe.", ok:false, info:"Unclear."}
      ],
      hint:"Look for: title + tasks."
    },
    {
      q:"A banker helps clients…",
      choices:[
        {a:"open accounts and understand fees", ok:true, info:"Common tasks in a bank."},
        {a:"repair pipes", ok:false, info:"Plumber."},
        {a:"teach students", ok:false, info:"Teacher."},
        {a:"design bridges", ok:false, info:"Civil engineer."}
      ],
      hint:"Bank → accounts."
    }
  ];
  let currentQcm = null;

  function renderQcm(item){
    currentQcm = item;
    setFeedback($("qcmFeedback"), "", "");
    $("qcmQuestion").textContent = item.q;
    const choices = $("qcmChoices");
    choices.innerHTML="";
    shuffle(item.choices).forEach((c, idx)=>{
      const row = el("label","choice");
      const radio = el("input");
      radio.type="radio";
      radio.name="qcm";
      radio.value = String(idx);
      row.appendChild(radio);

      const txt = el("div");
      txt.innerHTML = `<strong>${esc(c.a)}</strong><small>${esc(c.info)}</small>`;
      row.appendChild(txt);

      row.dataset.ok = c.ok ? "1" : "0";
      choices.appendChild(row);
    });
  }

  function checkQcm(){
    const selected = document.querySelector('input[name="qcm"]:checked');
    if(!selected){
      setFeedback($("qcmFeedback"), "warn", "Choose an option first.");
      addScore(0,false);
      return;
    }
    // find its parent label
    const label = selected.closest(".choice");
    const ok = label && label.dataset.ok==="1";
    if(ok){
      setFeedback($("qcmFeedback"), "good", "Correct ✅");
      addScore(2,true);
    }else{
      setFeedback($("qcmFeedback"), "bad", "Not quite. Try again.");
      addScore(0,false);
    }
  }

  function hintQcm(){
    if(!currentQcm) return;
    setFeedback($("qcmFeedback"), "warn", `Hint: ${currentQcm.hint}`);
    addScore(0,true);
  }

  /* -------------------------
     7) Dialogues (line by line selects)
  ------------------------- */
  const dialogues = [
    {
      id:"doctor_cold",
      titleEN:"Doctor’s office: cold symptoms",
      titleFR:"Cabinet médical : rhume",
      lines:[
        {speaker:"Patient", good:"Hi Doctor. I think I have a bad cold.", choices:[
          "Hi Doctor. I think I have a bad cold.",
          "Yo, what’s up with my nose?",
          "I’m fine. Bye."
        ], hint:"Start politely + say the problem."},
        {speaker:"Doctor", good:"How long have you had these symptoms?", choices:[
          "How long have you had these symptoms?",
          "What is your favorite movie?",
          "Can you build a bridge?"
        ], hint:"A doctor asks about time and symptoms."},
        {speaker:"Patient", good:"For three days. I also have a sore throat.", choices:[
          "For three days. I also have a sore throat.",
          "Maybe a thousand years.",
          "I need a new laptop."
        ], hint:"Give a number + another symptom."},
        {speaker:"Doctor", good:"I’m going to examine you and then prescribe something.", choices:[
          "I’m going to examine you and then prescribe something.",
          "I’m going to teach you math.",
          "I’m going to arrest you."
        ], hint:"Doctor verbs: examine, prescribe."}
      ]
    },
    {
      id:"bank_account",
      titleEN:"Bank: opening an account",
      titleFR:"Banque : ouvrir un compte",
      lines:[
        {speaker:"Client", good:"Good morning. I’d like to open a bank account.", choices:[
          "Good morning. I’d like to open a bank account.",
          "Hello. I want money now!",
          "I need a dentist."
        ], hint:"Polite request + purpose."},
        {speaker:"Banker", good:"Of course. Could you show me your ID and proof of address?", choices:[
          "Of course. Could you show me your ID and proof of address?",
          "Can you cook me pasta?",
          "Do you know the CEO personally?"
        ], hint:"Bankers ask for documents."},
        {speaker:"Client", good:"Yes. Here they are. What are the monthly fees?", choices:[
          "Yes. Here they are. What are the monthly fees?",
          "No. I forgot my name.",
          "I have a sore throat."
        ], hint:"Ask about fees."},
        {speaker:"Banker", good:"This account has low fees, and you can use a card or mobile payment.", choices:[
          "This account has low fees, and you can use a card or mobile payment.",
          "You must build a wall.",
          "Please put out a fire."
        ], hint:"Bank products: fees, card, payment."}
      ]
    },
    {
      id:"it_support",
      titleEN:"IT support: laptop problem",
      titleFR:"Support IT : problème d’ordinateur",
      lines:[
        {speaker:"User", good:"Hi, my laptop won’t start. Could you help me?", choices:[
          "Hi, my laptop won’t start. Could you help me?",
          "My laptop is delicious.",
          "I need a lawyer for my keyboard."
        ], hint:"Describe the problem + polite request."},
        {speaker:"IT", good:"Sure. Have you tried charging it and restarting it?", choices:[
          "Sure. Have you tried charging it and restarting it?",
          "Sure. Let’s bake a cake.",
          "Sure. Let’s go to court."
        ], hint:"Troubleshoot steps."},
        {speaker:"User", good:"Yes, but it still shows a black screen.", choices:[
          "Yes, but it still shows a black screen.",
          "No, but I love basketball.",
          "Yes, the bridge is strong."
        ], hint:"Give the result."},
        {speaker:"IT", good:"Okay. I’ll run a quick diagnostic and update the system.", choices:[
          "Okay. I’ll run a quick diagnostic and update the system.",
          "Okay. I’ll prescribe medicine.",
          "Okay. I’ll grade your homework."
        ], hint:"IT verbs: diagnostic, update."}
      ]
    },
    {
      id:"construction_safety",
      titleEN:"Construction site: safety briefing",
      titleFR:"Chantier : briefing sécurité",
      lines:[
        {speaker:"Site manager", good:"Before we start, please wear your helmet and safety shoes.", choices:[
          "Before we start, please wear your helmet and safety shoes.",
          "Before we start, please eat ice cream.",
          "Before we start, please sign this divorce."
        ], hint:"Safety rules first."},
        {speaker:"Worker", good:"Yes. Where should we install the cables?", choices:[
          "Yes. Where should we install the cables?",
          "Yes. Where is the courtroom?",
          "Yes. Can you prescribe me vitamins?"
        ], hint:"Ask about location + task."},
        {speaker:"Site manager", good:"Install them along the ceiling and test the circuit afterwards.", choices:[
          "Install them along the ceiling and test the circuit afterwards.",
          "Install them in my pocket.",
          "Install them in the laboratory."
        ], hint:"Imperatives + sequence."},
        {speaker:"Worker", good:"Understood. I’ll measure the area and start now.", choices:[
          "Understood. I’ll measure the area and start now.",
          "Understood. I’ll lecture a class.",
          "Understood. I’ll open a bank account."
        ], hint:"Confirm + action."}
      ]
    }
  ];
  let currentDialogue = null;

  function renderDialogue(scenarioId){
    currentDialogue = dialogues.find(d=>d.id===scenarioId) || dialogues[0];
    $("dialogueFeedback").textContent="";
    $("dialogueFeedback").classList.remove("good","bad","warn");

    const wrap = $("dialogueWrap");
    wrap.innerHTML="";
    const lang = getLang();
    currentDialogue.lines.forEach((ln, i)=>{
      const row = el("div","dLine");
      row.dataset.index = String(i);

      const sp = el("div","speaker");
      sp.textContent = ln.speaker;

      const selWrap = el("div","dSelect");
      const sel = el("select");
      sel.dataset.good = ln.good;
      const choices = shuffle(ln.choices);
      const opt0 = el("option"); opt0.value=""; opt0.textContent = (lang==="fr" ? "Choisir…" : "Choose…");
      sel.appendChild(opt0);
      choices.forEach(c=>{
        const opt = el("option"); opt.value=c; opt.textContent=c;
        sel.appendChild(opt);
      });
      const hint = el("div","hint"); hint.textContent = (lang==="fr" ? "Indice : " : "Hint: ") + ln.hint;
      hint.style.display="none";

      selWrap.appendChild(sel);
      selWrap.appendChild(hint);

      row.appendChild(sp);
      row.appendChild(selWrap);

      wrap.appendChild(row);
    });
  }

  function checkDialogue(){
    if(!currentDialogue) return;
    const lines = Array.from(document.querySelectorAll("#dialogueWrap .dLine"));
    let correct=0;
    let answered=0;
    lines.forEach(row=>{
      const sel = row.querySelector("select");
      const hint = row.querySelector(".hint");
      const good = sel.dataset.good;
      row.classList.remove("good","bad");
      hint.style.display="none";
      if(sel.value){
        answered += 1;
        if(sel.value===good){
          row.classList.add("good");
          correct += 1;
        }else{
          row.classList.add("bad");
        }
      }
    });

    if(answered===0){
      setFeedback($("dialogueFeedback"), "warn", "Choose at least 2 lines first.");
      addScore(0,false);
      return;
    }
    if(correct===currentDialogue.lines.length){
      setFeedback($("dialogueFeedback"), "good", "Perfect dialogue ✅");
      addScore(3,true);
    }else{
      setFeedback($("dialogueFeedback"), correct/Math.max(1,answered) >= .7 ? "warn" : "bad",
        `Correct lines: ${correct}/${currentDialogue.lines.length}. Fix the red lines.`);
      addScore(correct, correct/Math.max(1,answered) >= .7);
    }
  }

  function hintDialogue(){
    const lines = Array.from(document.querySelectorAll("#dialogueWrap .dLine"));
    const firstEmpty = lines.find(r=>!(r.querySelector("select").value));
    if(!firstEmpty){
      setFeedback($("dialogueFeedback"), "warn", "All lines are filled. Check the dialogue.");
      addScore(0,true);
      return;
    }
    firstEmpty.querySelector(".hint").style.display="block";
    setFeedback($("dialogueFeedback"), "warn", "Hint shown for the next line.");
    addScore(0,true);
  }

  function resetDialogue(){
    renderDialogue(currentDialogue ? currentDialogue.id : dialogues[0].id);
    setFeedback($("dialogueFeedback"), "", "");
  }

  function listenDialogue(){
    if(!currentDialogue) return;
    const lines = Array.from(document.querySelectorAll("#dialogueWrap .dLine"));
    const spoken = lines.map(r=>{
      const sel = r.querySelector("select");
      const text = sel.value || sel.dataset.good;
      const sp = r.querySelector(".speaker").textContent;
      return `${sp}: ${text}`;
    }).join("  ");
    speak(spoken);
  }

  /* -------------------------
     8) Paragraph builder
  ------------------------- */
  function fillParagraphSelects(){
    const pJob = $("pJob");
    pJob.innerHTML="";
    jobs.forEach(j=>{
      const opt = el("option");
      opt.value = j.id;
      opt.textContent = `${j.en} (${j.fr})`;
      pJob.appendChild(opt);
    });

    const pInd = $("pIndustry");
    pInd.innerHTML="";
    sortingTargets.forEach(ind=>{
      const opt = el("option");
      opt.value = ind;
      opt.textContent = indLabel(ind);
      pInd.appendChild(opt);
    });

    // default job
    pJob.value="doctor";
    pInd.value="health";
  }

  function renderTaskChipsFor(jobId){
    const box = $("taskChips");
    box.innerHTML="";
    const j = jobs.find(x=>x.id===jobId) || jobs[0];
    // choose verbs and add objects
    const taskOptions = [
      ...j.verbs.map(v=>`${v} ${jobObjectHint(j.id, v)}`),
      ...genericTasksByIndustry(j.industry)
    ].slice(0, 10);

    const picks = shuffle(taskOptions).slice(0, 8);
    picks.forEach(t=>{
      const chip = el("span","chip");
      chip.textContent = t.replace(/\s+/g," ").trim();
      chip.tabIndex=0;
      chip.dataset.active="0";
      chip.addEventListener("click", ()=>toggleChip(chip));
      chip.addEventListener("keydown",(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); toggleChip(chip);} });
      box.appendChild(chip);
    });
  }

  function toggleChip(chip){
    const active = chip.classList.toggle("active");
    chip.dataset.active = active ? "1" : "0";
    // limit to 3 picks
    const actives = Array.from(document.querySelectorAll("#taskChips .chip.active"));
    if(actives.length>3){
      // undo newest
      chip.classList.remove("active");
      chip.dataset.active="0";
      showToast("Pick up to 3 tasks.");
    }
  }

  function jobObjectHint(jobId, verb){
    const map = {
      doctor:{examine:"patients", diagnose:"symptoms", prescribe:"medicine", treat:"illnesses", advise:"patients"},
      nurse:{check:"vital signs", monitor:"patients", assist:"doctors", "care for":"patients", comfort:"patients"},
      teacher:{teach:"students", explain:"concepts", prepare:"lessons", grade:"homework", encourage:"students"},
      banker:{advise:"clients", "open accounts":"accounts", process:"payments", approve:"loans", verify:"documents"},
      programmer:{code:"features", write:"programs", run:"tests", refactor:"code"},
      software_developer:{code:"features", debug:"bugs", test:"new functions", deploy:"updates", maintain:"systems"},
      lawyer:{advise:"clients", represent:"clients", negotiate:"contracts", draft:"documents", argue:"cases"},
      accountant:{record:"expenses", calculate:"taxes", report:"results", prepare:"statements", reconcile:"accounts"},
      researcher:{research:"a topic", test:"a hypothesis", measure:"results", publish:"papers", present:"findings"}
    };
    const j = map[jobId] || {};
    return j[verb] || "tasks";
  }

  function genericTasksByIndustry(ind){
    const map = {
      health:["take appointments","explain treatment","follow safety protocols"],
      edu:["answer questions","give feedback","support learning"],
      construction:["follow safety rules","read plans","work as a team"],
      tech:["solve problems","document work","improve performance"],
      law:["prepare documents","protect clients","review agreements"],
      finance:["check numbers","reduce risk","explain options"],
      science:["collect data","use equipment safely","report results"],
      hospitality:["welcome customers","handle payments","solve complaints"],
      public:["respond to emergencies","support citizens","follow procedures"]
    };
    return map[ind] || ["work with a team","communicate clearly"];
  }

  function buildParagraph(){
    const name = ($("pName").value || "This person").trim();
    const jobId = $("pJob").value;
    const ind = $("pIndustry").value;
    const place = $("pPlace").value;
    const tools = ($("pTools").value || "").trim();
    const purpose = $("pPurpose").value;
    const detail = ($("pDetail").value || "").trim();

    const j = jobs.find(x=>x.id===jobId) || jobs[0];
    const tasks = Array.from(document.querySelectorAll("#taskChips .chip.active")).map(c=>c.textContent);

    // Construct paragraph with clarity
    let p = `${name} is a ${j.en}. ${cap(name)} works in ${indLabel(ind)} and works at ${place}. `;
    if(tasks.length){
      p += `${cap(name)} ${taskSentence(tasks)}. `;
    }else{
      p += `${cap(name)} does important work every day. `;
    }
    if(tools){
      p += `${cap(name)} uses ${tools}. `;
    }
    p += `The main purpose is to ${purpose}. `;
    if(detail){
      p += `For example, ${detail.replace(/\.$/,"")}.`;
    }

    $("paraOutput").textContent = p.replace(/\s+/g," ").trim();
    renderUpgradeSteps(p);
    setFeedback($("paraFeedback"), "", "");
    return p;
  }

  function cap(name){
    if(!name) return "This person";
    if(name.toLowerCase()==="this person") return "This person";
    return name;
  }

  function taskSentence(tasks){
    // Join tasks nicely; tasks already contain verb + object
    if(tasks.length===1) return tasks[0];
    if(tasks.length===2) return `${tasks[0]} and ${tasks[1]}`;
    return `${tasks[0]}, ${tasks[1]}, and ${tasks[2]}`;
  }

  function renderUpgradeSteps(paragraph){
    const steps = $("upgradeSteps");
    steps.innerHTML="";
    const checks = [
      {id:"cTitle", textEN:"Add a clear job title.", textFR:"Ajoutez un titre clair."},
      {id:"cPlace", textEN:"Add a workplace (where?).", textFR:"Ajoutez un lieu (où ?)."},
      {id:"cTasks", textEN:"Add 2–3 specific tasks (verbs + objects).", textFR:"Ajoutez 2–3 tâches précises (verbe + complément)."},
      {id:"cPurpose", textEN:"Add a purpose (why?).", textFR:"Ajoutez un objectif (pourquoi ?)."},
      {id:"cExample", textEN:"Add one concrete example or number.", textFR:"Ajoutez un exemple concret ou un chiffre."}
    ];
    const lang = getLang();
    checks.forEach(c=>{
      const li = el("li");
      li.textContent = (lang==="fr" ? c.textFR : c.textEN);
      steps.appendChild(li);
    });
  }

  function checkParagraph(){
    const text = $("paraOutput").textContent.trim();
    if(!text){
      setFeedback($("paraFeedback"), "warn", "Build your paragraph first.");
      addScore(0,false);
      return;
    }
    // check checklist
    const okTitle = $("cTitle").checked;
    const okPlace = $("cPlace").checked;
    const okTasks = $("cTasks").checked;
    const okPurpose = $("cPurpose").checked;
    const okExample = $("cExample").checked;
    const done = [okTitle,okPlace,okTasks,okPurpose,okExample].filter(Boolean).length;

    if(done>=4){
      setFeedback($("paraFeedback"), "good", `Great clarity ✅ (${done}/5 on your checklist)`);
      addScore(3,true);
    }else{
      setFeedback($("paraFeedback"), "warn", `Good start. Improve clarity: ${done}/5 checked.`);
      addScore(1,true);
    }
  }

  function hintParagraph(){
    const text = $("paraOutput").textContent.trim();
    if(!text){
      setFeedback($("paraFeedback"), "warn", "Hint: start with “Name is a/an Job. They work at… They…”");
      addScore(0,true);
      return;
    }
    setFeedback($("paraFeedback"), "warn", "Hint: Add 1 number (hours, clients per day) OR 1 tool, and use “because / therefore / however”.");
    addScore(0,true);
  }

  function resetParagraph(){
    $("paraOutput").textContent="";
    $("paraFeedback").textContent="";
    $("paraFeedback").classList.remove("good","bad","warn");
    $("pName").value="";
    $("pJob").value="doctor";
    $("pIndustry").value="health";
    $("pPlace").value="a hospital";
    $("pTools").value="";
    $("pDetail").value="";
    // unselect chips
    Array.from(document.querySelectorAll("#taskChips .chip")).forEach(c=>{ c.classList.remove("active"); c.dataset.active="0"; });
    // uncheck checklist
    ["cTitle","cPlace","cTasks","cPurpose","cExample"].forEach(id=>{ $(id).checked=false; });
    renderTaskChipsFor("doctor");
    renderUpgradeSteps("");
  }

  /* -------------------------
     9) Opinion / Troubleshooting
  ------------------------- */
  const opinionPrompts = [
    "Should companies allow remote work for most office jobs?",
    "Is it better to specialize in one career or keep learning many skills?",
    "Should hospitals use more technology to reduce waiting times?"
  ];
  let currentOpinionPrompt = opinionPrompts[0];

  function newOpinionPrompt(){
    currentOpinionPrompt = shuffle(opinionPrompts)[0];
    $("opinionPrompt").textContent = currentOpinionPrompt;
    $("opinionPosition").value="";
    $("opinionText").value="";
    setFeedback($("opinionFeedback"), "", "");
  }

  function checkOpinion(){
    const pos = $("opinionPosition").value;
    const text = $("opinionText").value.trim();
    if(!pos || text.length<20){
      setFeedback($("opinionFeedback"), "warn", "Choose a position and write at least 2 sentences.");
      addScore(0,false);
      return;
    }
    // basic checks: connector + example marker
    const hasConnector = /(because|however|therefore|on the other hand|for example|in my opinion)/i.test(text);
    const hasExample = /(for example|for instance|e\.g\.)/i.test(text) || /\d/.test(text);
    const sentences = text.split(/[.!?]+/).filter(s=>s.trim()).length;

    if(sentences>=2 && hasConnector && hasExample){
      setFeedback($("opinionFeedback"), "good", "Strong answer ✅ (connector + example)");
      addScore(3,true);
    }else{
      setFeedback($("opinionFeedback"), "warn", "Good. Add a connector (because/however/therefore) and one concrete example or number.");
      addScore(1,true);
    }
  }

  function hintOpinion(){
    setFeedback($("opinionFeedback"), "warn",
      "Hint template: “In my opinion, … because … For example, … However, … Therefore, …”");
    addScore(0,true);
  }

  function listenOpinion(){
    const t = `Question: ${currentOpinionPrompt}. Answer: ${$("opinionText").value || "No answer yet."}`;
    speak(t);
  }

  function resetOpinion(){
    newOpinionPrompt();
  }

  /* -------------------------
     Reset all
  ------------------------- */
  function resetAll(){
    score=0; streak=0; addScore(0,false);
    // keep score at 0
    renderSorting();
    renderOrgChart();
    renderSentence(shuffle(sentenceItems)[0]);
    renderBlank(shuffle(blankItems)[0]);
    renderQcm(shuffle(qcmItems)[0]);
    renderDialogue(dialogues[0].id);
    resetParagraph();
    newOpinionPrompt();
    updateCard();
    setFeedback($("sortingFeedback"), "", "");
    setFeedback($("orgFeedback"), "", "");
    setFeedback($("sentenceFeedback"), "", "");
    setFeedback($("blankFeedback"), "", "");
    setFeedback($("qcmFeedback"), "", "");
    setFeedback($("dialogueFeedback"), "", "");
    setFeedback($("paraFeedback"), "", "");
    setFeedback($("opinionFeedback"), "", "");
    clearTapSelection();
    showToast("Reset!");
  }

  /* -------------------------
     Bind events and init
  ------------------------- */
  function init(){
    $("year").textContent = String(new Date().getFullYear());

    // i18n init
    applyI18n("en");
    setFilterOptions();

    // mode
    resolveMode();
    $("mode").addEventListener("change", ()=>{
      resolveMode();
      clearTapSelection();
    });

    $("uiLang").addEventListener("change", ()=>{
      const lang = getLang();
      applyI18n(lang);
      // update labels that depend on lang
      setFilterOptions();
      applyIndustryFilter(); // refresh card list & labels
      renderOrgChart();      // org node labels
      // refresh dialogue list titles
      initDialogueScenarioSelect();
      // refresh opinion prompt label stays EN; we keep it EN for speaking practice
      showToast(lang==="fr" ? "Interface en français." : "UI set to English.");
    });

    $("accent").addEventListener("change", ()=>showToast("Accent changed."));

    // Flashcards
    bindFlashcard();
    updateCard();

    // Sorting
    renderSorting();
    $("checkSorting").addEventListener("click", checkSorting);
    $("resetSorting").addEventListener("click", resetSorting);

    // Org
    renderOrgChart();
    $("checkOrg").addEventListener("click", checkOrg);
    $("resetOrg").addEventListener("click", resetOrg);
    $("speakOrgLesson").addEventListener("click", ()=>{
      speak("Mini lesson. I report to my manager. She manages the team. The CTO oversees engineering.");
    });

    // Word order
    renderSentence(shuffle(sentenceItems)[0]);
    $("newSentence").addEventListener("click", ()=>renderSentence(shuffle(sentenceItems)[0]));
    $("resetSentence").addEventListener("click", resetSentence);
    $("checkSentence").addEventListener("click", checkSentence);
    $("hintSentence").addEventListener("click", hintSentence);
    $("listenSentence").addEventListener("click", ()=>{
      const built = getBuiltSentence();
      speak(built || currentSentence.answer);
    });

    // Blanks
    renderBlank(shuffle(blankItems)[0]);
    $("newBlank").addEventListener("click", ()=>renderBlank(shuffle(blankItems)[0]));
    $("checkBlank").addEventListener("click", checkBlank);
    $("hintBlank").addEventListener("click", hintBlank);
    $("resetBlank").addEventListener("click", resetBlank);
    $("listenBlank").addEventListener("click", ()=>{
      speak(($("blankSentence").textContent || "").replace(/\s+/g," ").trim());
    });
    $("speakVerbLesson").addEventListener("click", ()=>{
      speak("Mini lesson. Use present simple for routines: A nurse checks vital signs. Use can or could for polite requests.");
    });

    // QCM
    renderQcm(shuffle(qcmItems)[0]);
    $("newQcm").addEventListener("click", ()=>renderQcm(shuffle(qcmItems)[0]));
    $("checkQcm").addEventListener("click", checkQcm);
    $("hintQcm").addEventListener("click", hintQcm);

    // Dialogues
    initDialogueScenarioSelect();
    $("dialogueScenario").addEventListener("change", (e)=>renderDialogue(e.target.value));
    $("checkDialogue").addEventListener("click", checkDialogue);
    $("hintDialogue").addEventListener("click", hintDialogue);
    $("resetDialogue").addEventListener("click", resetDialogue);
    $("listenDialogue").addEventListener("click", listenDialogue);

    // Paragraph builder
    fillParagraphSelects();
    renderTaskChipsFor("doctor");
    $("pJob").addEventListener("change", ()=>{
      const id = $("pJob").value;
      const j = jobs.find(x=>x.id===id);
      if(j){
        $("pIndustry").value = j.industry;
      }
      renderTaskChipsFor(id);
    });
    $("buildParagraph").addEventListener("click", (e)=>{ e.preventDefault(); buildParagraph(); });
    $("checkParagraph").addEventListener("click", (e)=>{ e.preventDefault(); checkParagraph(); });
    $("hintParagraph").addEventListener("click", (e)=>{ e.preventDefault(); hintParagraph(); });
    $("listenParagraph").addEventListener("click", (e)=>{ e.preventDefault(); speak($("paraOutput").textContent || ""); });
    $("resetParagraph").addEventListener("click", (e)=>{ e.preventDefault(); resetParagraph(); });

    // Opinion
    newOpinionPrompt();
    $("checkOpinion").addEventListener("click", checkOpinion);
    $("hintOpinion").addEventListener("click", hintOpinion);
    $("listenOpinion").addEventListener("click", listenOpinion);
    $("resetOpinion").addEventListener("click", resetOpinion);

    // Reset all
    $("resetAll").addEventListener("click", resetAll);
  }

  function initDialogueScenarioSelect(){
    const sel = $("dialogueScenario");
    const lang = getLang();
    const current = currentDialogue ? currentDialogue.id : (sel.value || dialogues[0].id);
    sel.innerHTML="";
    dialogues.forEach(d=>{
      const opt = el("option");
      opt.value = d.id;
      opt.textContent = (lang==="fr" ? d.titleFR : d.titleEN);
      sel.appendChild(opt);
    });
    sel.value = current || dialogues[0].id;
    renderDialogue(sel.value);
  }

  // initial filter options
  function initIndustryFilter(){
    setFilterOptions();
    $("industryFilter").value="all";
    applyIndustryFilter();
  }

  // init: industry filter after i18n
  document.addEventListener("DOMContentLoaded", ()=>{
    initIndustryFilter();
    init();
  });

})();
