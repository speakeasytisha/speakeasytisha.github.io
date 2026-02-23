/* SpeakEasyTisha • Professions + Titles (Fun Edition)
   Tap-friendly • iPad Safari safe • No external libs
*/
(function(){
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }
  function norm(s){ return (s||'').toString().trim().replace(/\s+/g,' ').toLowerCase(); }
  function esc(s){
    return (s||'').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  const state = {
    help: 'EN',
    voice: 'en-US',
    mode: 'tap',
    score: 0,
    streak: 0,
    keys: 0,
    keysEarned: {k1:false, k2:false, k3:false},
    titleSeen: new Set(),
    builderWins: 0,
    selectedTile: null,
  };

  const elScore = $('#score');
  const elStreak = $('#streak');
  const elKeys = $('#keys');
  const bar = $('#bar');
  const progressText = $('#progressText');

  function updateHUD(){
    elScore.textContent = String(state.score);
    elStreak.textContent = String(state.streak);
    elKeys.textContent = String(state.keys);

    const pct = Math.round((state.keys/3)*100);
    bar.style.width = pct + '%';
    progressText.textContent = state.keys >= 3
      ? 'Mission complete! 🎉'
      : `Earn ${3-state.keys} more key(s) to finish the mission.`;
  }

  function addScore(points, streakBoost=true){
    state.score += points;
    if(streakBoost) state.streak = Math.min(12, state.streak + 1);
    updateHUD();
  }
  function breakStreak(){
    state.streak = 0;
    updateHUD();
  }

  function earnKey(which){
    if(state.keysEarned[which]) return;
    state.keysEarned[which] = true;
    state.keys = Math.min(3, state.keys + 1);
    addScore(5, false);
    openModal('Key unlocked! 🔓', `<p>You earned <strong>${which.toUpperCase()}</strong>! Great progress.</p>`);
  }

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    const t = (text||'').toString().trim();
    if(!t) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = state.voice || 'en-US';
    window.speechSynthesis.speak(u);
  }
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-say]');
    if(!btn) return;
    const sel = btn.getAttribute('data-say');
    const node = $(sel);
    if(node) speak(node.textContent || node.innerText || '');
  });

  // Modal
  const modal = $('#modal'), mTitle = $('#mTitle'), mBody = $('#mBody'), mClose = $('#mClose'), mOk = $('#mOk');
  function openModal(title, bodyHtml){
    mTitle.textContent = title || 'Message';
    mBody.innerHTML = bodyHtml || '';
    modal.hidden = false;
    mClose.focus();
  }
  function closeModal(){ modal.hidden = true; }
  mClose.addEventListener('click', closeModal);
  mOk.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(!modal.hidden && e.key === 'Escape') closeModal(); });

  // Controls
  const selHelp = $('#langHelp');
  const selVoice = $('#voice');
  const selMode = $('#mode');
  $('#btnReset').addEventListener('click', ()=> resetAll(true));
  $('#btnPrint').addEventListener('click', ()=> window.print());
  $('#btnStart').addEventListener('click', ()=> $('#warmup').scrollIntoView({behavior:'smooth', block:'start'}));
  $('#btnHow').addEventListener('click', ()=>{
    const how = $('#how');
    how.hidden = !how.hidden;
  });

  selHelp.addEventListener('change', ()=>{
    state.help = selHelp.value || 'EN';
    refreshHelpVisibility();
  });
  selVoice.addEventListener('change', ()=>{ state.voice = selVoice.value || 'en-US'; });
  selMode.addEventListener('change', ()=>{
    state.mode = selMode.value || 'tap';
    state.selectedTile = null;
    updateBankTip();
    // rebind drag state visuals
    renderOrgChart();
    renderBank();
  });

  function refreshHelpVisibility(){
    const show = state.help === 'FR';
    const frNodes = ['#jobFR','#titleFR','#whoFR','#verbPromptFR','#verbRuleFR'];
    frNodes.forEach(id=>{
      const el = $(id);
      if(el) el.hidden = !show;
    });
    const bankTip = $('#bankTip');
    bankTip.textContent = show
      ? 'Tape un titre → puis tape une case. (Ou glisse-dépose si Mode = Drag.)'
      : 'Tap a title → tap a box. (Or drag if Mode = Drag.)';
  }

  function updateBankTip(){
    const bankTip = $('#bankTip');
    if(state.mode === 'drag'){
      bankTip.textContent = (state.help==='FR')
        ? 'Glisse un titre sur une case (drag & drop).'
        : 'Drag a title onto a box.';
    }else{
      bankTip.textContent = (state.help==='FR')
        ? 'Tape un titre → puis tape une case.'
        : 'Tap a title → tap a box.';
    }
  }

  // Data
  const JOBS = [
    {emoji:'🩺', job:'doctor', industry:'Healthcare', ex:'A doctor works at a doctor’s office. We go to see a doctor when we are sick.', fr:'Un médecin travaille dans un cabinet médical. On va voir un médecin quand on est malade.'},
    {emoji:'👩‍⚕️', job:'nurse', industry:'Healthcare', ex:'A nurse checks vital signs and helps patients.', fr:'Une infirmière vérifie les constantes et aide les patients.'},
    {emoji:'👩‍🏫', job:'teacher', industry:'Education', ex:'A teacher teaches students and explains ideas clearly.', fr:'Un professeur enseigne aux élèves et explique clairement.'},
    {emoji:'👷', job:'construction worker', industry:'Construction', ex:'A construction worker builds structures and follows safety rules.', fr:'Un ouvrier du BTP construit et suit les règles de sécurité.'},
    {emoji:'⚖️', job:'lawyer', industry:'Legal', ex:'A lawyer advises clients and defends rights.', fr:'Un avocat conseille et défend les droits.'},
    {emoji:'🏦', job:'banker', industry:'Finance', ex:'A banker helps clients manage money and reduce risk.', fr:'Un banquier aide à gérer l’argent et réduire le risque.'},
    {emoji:'💻', job:'software developer', industry:'Tech', ex:'A developer writes code and solves technical problems.', fr:'Un développeur écrit du code et résout des problèmes.'},
    {emoji:'🔬', job:'scientist', industry:'Science', ex:'A scientist runs experiments and analyzes results.', fr:'Un scientifique fait des expériences et analyse les résultats.'},
    {emoji:'🧑‍🍳', job:'chef', industry:'Hospitality', ex:'A chef prepares dishes and manages the kitchen.', fr:'Un chef prépare des plats et gère la cuisine.'},
    {emoji:'🛎️', job:'receptionist', industry:'Hospitality', ex:'A receptionist welcomes guests and answers questions.', fr:'Un réceptionniste accueille et répond aux questions.'},
  ];

  const TITLES = [
    {emoji:'👑', title:'CEO', meta:'Top leader • strategy', def:'The CEO is the overall leader of the company.', fr:'Le/La PDG dirige l’entreprise.', tags:['leads','strategy','big decisions']},
    {emoji:'💰', title:'CFO', meta:'Finance leader • budgets', def:'The CFO oversees money, budgets, and financial strategy.', fr:'Le/La DAF gère la finance, les budgets, la stratégie financière.', tags:['finance','budget','risk']},
    {emoji:'🧠', title:'CTO', meta:'Tech leader • engineering', def:'The CTO leads technology and engineering decisions.', fr:'Le/La CTO dirige la technologie et l’ingénierie.', tags:['tech','engineering','systems']},
    {emoji:'⚙️', title:'COO', meta:'Operations leader • daily running', def:'The COO is in charge of operations and how things run day to day.', fr:'Le/La COO est responsable des opérations au quotidien.', tags:['operations','process','delivery']},
    {emoji:'🧑‍🤝‍🧑', title:'HR Manager', meta:'People • hiring', def:'HR manages recruitment, contracts, and employee support.', fr:'RH: recrutement, contrats, accompagnement.', tags:['people','recruitment','contracts']},
    {emoji:'🧾', title:'Accountant', meta:'Accounts • invoices', def:'An accountant records transactions and prepares accounts.', fr:'Le comptable enregistre les opérations et prépare les comptes.', tags:['accounts','invoices','tax']},
    {emoji:'📈', title:'Financial Analyst', meta:'Data • forecasts', def:'A financial analyst studies numbers and forecasts performance.', fr:'Analyse les chiffres et fait des prévisions.', tags:['data','forecast','KPIs']},
    {emoji:'🧑‍💻', title:'Engineering Manager', meta:'Team • delivery', def:'An engineering manager manages engineers and delivery.', fr:'Gère l’équipe d’ingénierie et la livraison.', tags:['team','delivery','quality']},
    {emoji:'🧭', title:'Product Manager', meta:'Roadmap • users', def:'A product manager defines the product roadmap and user needs.', fr:'Définit la roadmap produit et les besoins utilisateurs.', tags:['roadmap','users','priorities']},
    {emoji:'🛠️', title:'IT Support', meta:'Help • computers', def:'IT support fixes tech issues and helps colleagues.', fr:'Assistance informatique: dépanner et aider.', tags:['support','devices','tickets']},
    {emoji:'📦', title:'Operations Manager', meta:'Logistics • process', def:'Operations manages logistics, planning, and processes.', fr:'Gère la logistique, la planification et les processus.', tags:['logistics','planning','process']},
    {emoji:'🎧', title:'Customer Service Manager', meta:'Clients • satisfaction', def:'Customer service manages support quality and satisfaction.', fr:'Gère la qualité du support et la satisfaction clients.', tags:['clients','quality','service']},
  ];

  // --- 1) Emoji quiz (jobs) ---
  const emojiSet = [
    {"emoji": "🩺", "clueEN": "I help sick people.", "clueFR": "J’aide les personnes malades.", "answer": "doctor", "options": ["doctor", "teacher", "lawyer", "chef"]},
    {"emoji": "🏦", "clueEN": "I help people manage money.", "clueFR": "J’aide à gérer l’argent.", "answer": "banker", "options": ["construction worker", "banker", "scientist", "receptionist"]},
    {"emoji": "💻", "clueEN": "I write code and build apps.", "clueFR": "J’écris du code et je crée des applis.", "answer": "software developer", "options": ["software developer", "nurse", "chef", "teacher"]},
    {"emoji": "👷", "clueEN": "I build structures and follow safety rules.", "clueFR": "Je construis et je respecte la sécurité.", "answer": "construction worker", "options": ["lawyer", "construction worker", "banker", "scientist"]},
    {"emoji": "🛎️", "clueEN": "I welcome guests and answer questions.", "clueFR": "J’accueille les clients et je réponds.", "answer": "receptionist", "options": ["receptionist", "doctor", "teacher", "developer"]},
    {"emoji": "👩‍⚕️", "clueEN": "I check patients and give care in a hospital.", "clueFR": "Je m’occupe des patients à l’hôpital.", "answer": "nurse", "options": ["nurse", "lawyer", "chef", "scientist"]},
    {"emoji": "👩‍🏫", "clueEN": "I teach students and explain lessons.", "clueFR": "J’enseigne et j’explique les leçons.", "answer": "teacher", "options": ["teacher", "banker", "receptionist", "accountant"]},
    {"emoji": "⚖️", "clueEN": "I give legal advice and defend clients.", "clueFR": "Je conseille en droit et je défends des clients.", "answer": "lawyer", "options": ["lawyer", "doctor", "chef", "IT support"]},
    {"emoji": "🔬", "clueEN": "I run experiments and analyze results.", "clueFR": "Je fais des expériences et j’analyse les résultats.", "answer": "scientist", "options": ["scientist", "teacher", "banker", "waiter"]},
    {"emoji": "🧑‍🍳", "clueEN": "I cook meals and manage a kitchen.", "clueFR": "Je cuisine et je gère une cuisine.", "answer": "chef", "options": ["chef", "pilot", "lawyer", "cashier"]},
    {"emoji": "🧾", "clueEN": "I record invoices and check numbers.", "clueFR": "Je saisis des factures et je vérifie les chiffres.", "answer": "accountant", "options": ["accountant", "nurse", "teacher", "architect"]},
    {"emoji": "🛠️", "clueEN": "I fix computers and solve tech problems.", "clueFR": "Je dépanne les ordinateurs et je règle les bugs.", "answer": "IT support", "options": ["IT support", "lawyer", "chef", "doctor"]},
    {"emoji": "📞", "clueEN": "I answer calls and help customers.", "clueFR": "Je réponds au téléphone et j’aide les clients.", "answer": "customer service agent", "options": ["customer service agent", "scientist", "pilot", "plumber"]},
    {"emoji": "🚒", "clueEN": "I put out fires and rescue people.", "clueFR": "J’éteins les incendies et je secours les gens.", "answer": "firefighter", "options": ["firefighter", "chef", "banker", "developer"]},
    {"emoji": "👮", "clueEN": "I keep people safe and enforce the law.", "clueFR": "J’assure la sécurité et je fais respecter la loi.", "answer": "police officer", "options": ["police officer", "teacher", "waiter", "designer"]},
    {"emoji": "🦷", "clueEN": "I take care of teeth.", "clueFR": "Je soigne les dents.", "answer": "dentist", "options": ["dentist", "pilot", "engineer", "cashier"]},
    {"emoji": "💊", "clueEN": "I prepare medicine and explain how to take it.", "clueFR": "Je prépare des médicaments et j’explique la prise.", "answer": "pharmacist", "options": ["pharmacist", "firefighter", "chef", "lawyer"]},
    {"emoji": "🐾", "clueEN": "I treat animals and give vaccines.", "clueFR": "Je soigne les animaux et je vaccine.", "answer": "veterinarian", "options": ["veterinarian", "accountant", "teacher", "developer"]},
    {"emoji": "✈️", "clueEN": "I fly planes and follow a flight plan.", "clueFR": "Je pilote un avion et je suis un plan de vol.", "answer": "pilot", "options": ["pilot", "chef", "nurse", "plumber"]},
    {"emoji": "🚕", "clueEN": "I drive people around a city.", "clueFR": "Je transporte des personnes en ville.", "answer": "taxi driver", "options": ["taxi driver", "scientist", "lawyer", "architect"]},
    {"emoji": "🧰", "clueEN": "I fix leaking pipes and install sinks.", "clueFR": "Je répare des fuites et j’installe des éviers.", "answer": "plumber", "options": ["plumber", "pilot", "teacher", "banker"]},
    {"emoji": "🔌", "clueEN": "I install wiring and fix electrical problems.", "clueFR": "J’installe des câbles et je répare l’électricité.", "answer": "electrician", "options": ["electrician", "chef", "lawyer", "receptionist"]},
    {"emoji": "🏗️", "clueEN": "I design buildings and draw plans.", "clueFR": "Je conçois des bâtiments et je fais des plans.", "answer": "architect", "options": ["architect", "accountant", "firefighter", "developer"]},
    {"emoji": "🎨", "clueEN": "I create visuals and design posters.", "clueFR": "Je crée des visuels et je conçois des affiches.", "answer": "graphic designer", "options": ["graphic designer", "police officer", "dentist", "banker"]},
    {"emoji": "📣", "clueEN": "I promote a product and plan campaigns.", "clueFR": "Je fais la promotion et je planifie des campagnes.", "answer": "marketing specialist", "options": ["marketing specialist", "plumber", "scientist", "chef"]},
    {"emoji": "🛒", "clueEN": "I scan items and take payments at a store.", "clueFR": "Je scanne les articles et j’encaisse.", "answer": "cashier", "options": ["cashier", "pilot", "architect", "nurse"]},
    {"emoji": "🍽️", "clueEN": "I take orders and serve food in a restaurant.", "clueFR": "Je prends les commandes et je sers au restaurant.", "answer": "waiter", "options": ["waiter", "banker", "developer", "lawyer"]},
    {"emoji": "📦", "clueEN": "I organize deliveries and manage logistics.", "clueFR": "J’organise les livraisons et la logistique.", "answer": "logistics coordinator", "options": ["logistics coordinator", "dentist", "teacher", "firefighter"]},
    {"emoji": "🧑‍💼", "clueEN": "I plan tasks, deadlines, and coordinate a team.", "clueFR": "Je planifie les tâches, les délais et je coordonne une équipe.", "answer": "project manager", "options": ["project manager", "chef", "police officer", "cashier"]},
    {"emoji": "🗣️", "clueEN": "I translate and help people communicate.", "clueFR": "Je traduis et j’aide à communiquer.", "answer": "translator", "options": ["translator", "plumber", "pilot", "scientist"]},
    {"emoji": "📊", "clueEN": "I analyze data to make business decisions.", "clueFR": "J’analyse des données pour décider.", "answer": "data analyst", "options": ["data analyst", "waiter", "firefighter", "teacher"]}
  ];
  let emojiQ = null;
  let emojiCorrect = 0;

  const elEmoji = $('#emojiQ');
  const elEmojiClue = $('#emojiClue');
  const elEmojiChoices = $('#emojiChoices');
  const elEmojiResult = $('#emojiResult');

  $('#btnEmojiNew').addEventListener('click', newEmojiQ);
  $('#btnEmojiHint').addEventListener('click', ()=>{
    if(!emojiQ) return;
    const hint = state.help==='FR' ? `💡 Indice: ${emojiQ.clueFR}` : `💡 Hint: ${emojiQ.clueEN}`;
    setResult(elEmojiResult,'hint',hint);
  });
  $('#btnEmojiListen').addEventListener('click', ()=>{
    if(!emojiQ) return;
    speak(emojiQ.clueEN);
  });

  function newEmojiQ(){
    emojiQ = shuffle(emojiSet)[0];
    elEmoji.textContent = emojiQ.emoji;
    elEmojiClue.textContent = (state.help==='FR') ? `Indice: ${emojiQ.clueFR}` : `Clue: ${emojiQ.clueEN}`;
    elEmojiChoices.innerHTML = '';
    elEmojiResult.textContent = (state.help==='FR') ? 'Choisis une réponse (scénario). Feedback immédiat.' : 'Choose an answer (scenario). Instant feedback.';

    shuffle(emojiQ.options).forEach(opt=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='choice';
      b.textContent=opt;
      b.setAttribute('aria-pressed','false');
      b.addEventListener('click', ()=>{
        elEmojiChoices.querySelectorAll('.choice').forEach(x=>x.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
        const ok = norm(opt) === norm(emojiQ.answer);
        if(ok){
          emojiCorrect += 1;
          addScore(2);
          setResult(elEmojiResult,'good',`✅ Correct: <strong>${esc(opt)}</strong>`);
          if(emojiCorrect >= 3){
            addScore(3, false);
            openModal('Warm‑up bonus! 🎉', '<p>3 correct answers → bonus points!</p>');
            emojiCorrect = 0;
          }
        }else{
          breakStreak();
          setResult(elEmojiResult,'bad', state.help==='FR'
            ? `❌ Pas encore. Réponse attendue: <strong>${esc(emojiQ.answer)}</strong>`
            : `❌ Not yet. Expected: <strong>${esc(emojiQ.answer)}</strong>`
          );
        }
      });
      elEmojiChoices.appendChild(b);
    });
  }

  // --- 2) Job flashcards ---
  const jobFilter = $('#jobFilter');
  const jobCard = $('#jobCard');
  const jobPrev = $('#jobPrev');
  const jobNext = $('#jobNext');
  const btnJobShuffle = $('#btnJobShuffle');
  const btnJobListenWord = $('#btnJobListenWord');
  const btnJobListenEx = $('#btnJobListenEx');

  const jobEmoji = $('#jobEmoji');
  const jobTerm = $('#jobTerm');
  const jobIndustry = $('#jobIndustry');
  const jobExample = $('#jobExample');
  const jobFR = $('#jobFR');
  const jobResult = $('#jobResult');

  let jobDeck = [];
  let jobIdx = 0;

  function initJobFilter(){
    const inds = Array.from(new Set(JOBS.map(j=>j.industry))).sort();
    inds.forEach(i=>{
      const o = document.createElement('option');
      o.value = i;
      o.textContent = i;
      jobFilter.appendChild(o);
    });
    jobFilter.addEventListener('change', ()=> buildJobDeck(true));
  }

  function buildJobDeck(shuf){
    const val = jobFilter.value || 'all';
    jobDeck = JOBS.filter(j => val==='all' ? true : j.industry===val);
    if(shuf) jobDeck = shuffle(jobDeck);
    jobIdx = 0;
    renderJobCard();
  }

  function renderJobCard(){
    const it = jobDeck[jobIdx] || JOBS[0];
    jobEmoji.textContent = it.emoji;
    jobTerm.textContent = it.job;
    jobIndustry.textContent = it.industry;
    jobExample.textContent = it.ex;
    jobFR.textContent = `🇫🇷 ${it.fr}`;
    jobCard.classList.remove('is-open');
    jobResult.className = 'result result--hint';
    jobResult.textContent = (state.help==='FR') ? 'Astuce : tape la carte pour voir l’exemple.' : 'Tip: Tap the card to see the example.';
  }

  jobCard.addEventListener('click', ()=>{
    jobCard.classList.toggle('is-open');
    addScore(1, false);
  });
  jobCard.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      jobCard.click();
    }
  });
  jobPrev.addEventListener('click', ()=>{
    jobIdx = (jobIdx - 1 + jobDeck.length) % jobDeck.length;
    renderJobCard();
  });
  jobNext.addEventListener('click', ()=>{
    jobIdx = (jobIdx + 1) % jobDeck.length;
    renderJobCard();
  });
  btnJobShuffle.addEventListener('click', ()=> buildJobDeck(true));
  btnJobListenWord.addEventListener('click', ()=> speak(jobTerm.textContent));
  btnJobListenEx.addEventListener('click', ()=> speak(jobExample.textContent));

  // --- 3A) Title cards ---
  const titleCard = $('#titleCard');
  const titlePrev = $('#titlePrev');
  const titleNext = $('#titleNext');
  const btnTitleShuffle = $('#btnTitleShuffle');
  const btnTitleListen = $('#btnTitleListen');

  const titleEmoji = $('#titleEmoji');
  const titleTerm = $('#titleTerm');
  const titleMeta = $('#titleMeta');
  const titleDef = $('#titleDef');
  const titleFR = $('#titleFR');
  const titleTags = $('#titleTags');
  const titleResult = $('#titleResult');

  let titleDeck = shuffle(TITLES);
  let titleIdx = 0;

  function renderTitleCard(){
    const t = titleDeck[titleIdx];
    titleEmoji.textContent = t.emoji;
    titleTerm.textContent = t.title;
    titleMeta.textContent = t.meta;
    titleDef.textContent = t.def;
    titleFR.textContent = `🇫🇷 ${t.fr}`;
    titleTags.innerHTML = t.tags.map(x=>`<span class="chip">✨ ${esc(x)}</span>`).join('');
    titleCard.classList.remove('is-open');
    titleResult.className = 'result result--hint';
    titleResult.textContent = (state.help==='FR')
      ? 'Tape pour retourner la carte. Apprends 6 titres → clé #1.'
      : 'Tap to flip. Learn 6 titles → Key #1.';
  }

  function markTitleSeen(t){
    state.titleSeen.add(t.title);
    if(state.titleSeen.size >= 6){
      earnKey('k1');
    }
  }

  titleCard.addEventListener('click', ()=>{
    titleCard.classList.toggle('is-open');
    const t = titleDeck[titleIdx];
    markTitleSeen(t);
    addScore(1, false);
  });
  titleCard.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      titleCard.click();
    }
  });
  titlePrev.addEventListener('click', ()=>{
    titleIdx = (titleIdx - 1 + titleDeck.length) % titleDeck.length;
    renderTitleCard();
  });
  titleNext.addEventListener('click', ()=>{
    titleIdx = (titleIdx + 1) % titleDeck.length;
    renderTitleCard();
  });
  btnTitleShuffle.addEventListener('click', ()=>{
    titleDeck = shuffle(TITLES);
    titleIdx = 0;
    renderTitleCard();
  });
  btnTitleListen.addEventListener('click', ()=>{
    const t = titleDeck[titleIdx];
    speak(`${t.title}. ${t.def}`);
  });

  // --- 3B) Who am I? titles ---
  const whoClue = $('#whoClue');
  const whoChoices = $('#whoChoices');
  const whoResult = $('#whoResult');
  const whoFR = $('#whoFR');

  const WHO = [
    {clueEN:"I manage the company’s money and budget.", clueFR:"Je gère l’argent et le budget de l’entreprise.", ans:'CFO'},
    {clueEN:"I lead technology and engineering decisions.", clueFR:"Je dirige la technologie et l’ingénierie.", ans:'CTO'},
    {clueEN:"I’m in charge of operations and day‑to‑day running.", clueFR:"Je suis responsable des opérations au quotidien.", ans:'COO'},
    {clueEN:"I manage recruitment and employee support.", clueFR:"Je gère le recrutement et l’accompagnement des salariés.", ans:'HR Manager'},
    {clueEN:"I define the product roadmap and user needs.", clueFR:"Je définis la roadmap et les besoins utilisateurs.", ans:'Product Manager'},
  ];
  let whoQ = null;

  $('#btnWhoNew').addEventListener('click', newWhoQ);
  $('#btnWhoHint').addEventListener('click', ()=>{
    if(!whoQ) return;
    const hint = state.help==='FR'
      ? "💡 Indice: pense au département (finance, tech, opérations, RH…)."
      : "💡 Hint: think of the department (finance, tech, operations, HR…).";
    setResult(whoResult,'hint',hint);
  });
  $('#btnWhoListen').addEventListener('click', ()=>{ if(whoQ) speak(whoQ.clueEN); });

  function newWhoQ(){
    whoQ = shuffle(WHO)[0];
    whoClue.textContent = whoQ.clueEN;
    whoFR.textContent = `🇫🇷 ${whoQ.clueFR}`;
    whoChoices.innerHTML = '';
    setResult(whoResult,'hint','Choose an answer.');

    const options = shuffle(['CEO','CFO','CTO','COO','HR Manager','Product Manager','Engineering Manager']).slice(0,4);
    if(!options.includes(whoQ.ans)){
      options[Math.floor(Math.random()*options.length)] = whoQ.ans;
    }
    shuffle(options).forEach(opt=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='choice';
      b.textContent=opt;
      b.setAttribute('aria-pressed','false');
      b.addEventListener('click', ()=>{
        whoChoices.querySelectorAll('.choice').forEach(x=>x.setAttribute('aria-pressed','false'));
        b.setAttribute('aria-pressed','true');
        const ok = norm(opt) === norm(whoQ.ans);
        if(ok){
          addScore(2);
          setResult(whoResult,'good',`✅ Correct: <strong>${esc(opt)}</strong>`);
        }else{
          breakStreak();
          setResult(whoResult,'bad', state.help==='FR'
            ? `❌ Pas encore. Réponse: <strong>${esc(whoQ.ans)}</strong>`
            : `❌ Not yet. Answer: <strong>${esc(whoQ.ans)}</strong>`
          );
        }
      });
      whoChoices.appendChild(b);
    });
  }

  // --- 3C) verbs mini-game ---
  const verbPrompt = $('#verbPrompt');
  const verbChoices = $('#verbChoices');
  const verbResult = $('#verbResult');

  const VERB_ITEMS = [
    {tpl:'The CFO ____ finance.', fr:'Le CFO ____ la finance.', ans:'oversees', opts:['oversees','reports to','listens','arrives']},
    {tpl:'The HR Manager ____ recruitment.', fr:'Le/la RH ____ le recrutement.', ans:'manages', opts:['manages','eats','reports','walks']},
    {tpl:'The IT Support ____ technical issues.', fr:"L'assistance IT ____ les problèmes techniques.", ans:'fixes', opts:['fixes','fix','fixed','fixing']},
    {tpl:'The Engineering Manager ____ the engineering team.', fr:"Le/la manager ingénierie ____ l'équipe.", ans:'manages', opts:['manages','manage','managed','managing']},
    {tpl:'The Financial Analyst ____ performance.', fr:"L'analyste financier ____ la performance.", ans:'analyzes', opts:['analyzes','analyze','analysis','analysing']},
  ];
  let verbQ = null;

  $('#btnVerbNew').addEventListener('click', newVerbQ);
  $('#btnVerbHint').addEventListener('click', ()=>{
    const msg = state.help==='FR'
      ? '💡 Indice: 3e personne du singulier → souvent -s (he/she/it).'
      : '💡 Hint: 3rd person singular often needs -s (he/she/it).';
    setResult(verbResult,'hint', msg);
  });

  function newVerbQ(){
    verbQ = shuffle(VERB_ITEMS)[0];
    verbPrompt.textContent = verbQ.tpl;
    $('#verbPromptFR').textContent = `🇫🇷 ${verbQ.fr}`;
    verbChoices.innerHTML = '';
    setResult(verbResult,'hint', state.help==='FR' ? 'Choisis un verbe.' : 'Choose a verb.');

    shuffle(verbQ.opts).forEach(opt=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='choice';
      b.textContent=opt;
      b.addEventListener('click', ()=>{
        const ok = norm(opt) === norm(verbQ.ans);
        if(ok){
          addScore(2);
          setResult(verbResult,'good', `✅ Correct: <strong>${esc(opt)}</strong>`);
        }else{
          breakStreak();
          setResult(verbResult,'bad', state.help==='FR'
            ? `❌ Pas encore. Réponse: <strong>${esc(verbQ.ans)}</strong>`
            : `❌ Not yet. Answer: <strong>${esc(verbQ.ans)}</strong>`
          );
        }
      });
      verbChoices.appendChild(b);
    });
  }

  // --- 4) Org chart (NEW with clues + glossary) ---
  const orgChart = $('#orgChart');
  const titleBank = $('#titleBank');
  const orgResult = $('#orgResult');

  const ORG = [
    {id:'ceo', label:'Top', clue:'Leads company', answer:'CEO'},
    {id:'cfo', label:'Finance', clue:'Money & budget', answer:'CFO'},
    {id:'cto', label:'Technology', clue:'Engineering & systems', answer:'CTO'},
    {id:'coo', label:'Operations', clue:'Day‑to‑day', answer:'COO'},
    {id:'hr', label:'People', clue:'Hiring & contracts', answer:'HR Manager'},
    {id:'ops', label:'Logistics', clue:'Planning & process', answer:'Operations Manager'},
    {id:'cs', label:'Clients', clue:'Support quality', answer:'Customer Service Manager'},
    {id:'acct', label:'Accounts', clue:'Invoices & records', answer:'Accountant'},
    {id:'fa', label:'Analysis', clue:'Forecast & KPIs', answer:'Financial Analyst'},
    {id:'eng', label:'Engineering', clue:'Team delivery', answer:'Engineering Manager'},
    {id:'pm', label:'Product', clue:'Roadmap', answer:'Product Manager'},
    {id:'it', label:'IT', clue:'Fix issues', answer:'IT Support'},
  ];

  const ORG_ROWS = [
    ['ceo'],
    ['coo','cfo','cto'],
    ['hr','ops','cs'],
    ['acct','fa','eng'],
    ['pm','it'],
  ];

  const placed = {}; // boxId -> title
  let bankTitles = [];

  function renderOrgChart(){
    orgChart.innerHTML = '';
    ORG_ROWS.forEach((rowIds, idx)=>{
      const row = document.createElement('div');
      row.className = 'orgRow' + (idx===0 ? ' orgRow--top' : '');
      rowIds.forEach(id=>{
        const spec = ORG.find(x=>x.id===id);
        const box = document.createElement('div');
        box.className = 'orgBox';
        box.dataset.box = id;

        box.innerHTML = `
          <div class="orgBox__label">
            <div class="orgBox__name">${esc(spec.label)}</div>
            <div class="orgBox__clue">💡 ${esc(spec.clue)}</div>
          </div>
          <div class="drop" data-drop="${esc(id)}" tabindex="0" role="button" aria-label="Drop zone ${esc(spec.label)}">
            <div class="drop__text">${placed[id] ? esc(placed[id]) : '—'}</div>
            <div class="drop__hint">${state.help==='FR' ? 'Tape pour placer' : 'Tap to place'}</div>
          </div>
        `;

        const drop = box.querySelector('.drop');
        setupDrop(drop);
        row.appendChild(box);
      });
      orgChart.appendChild(row);
    });
  }

  function setupDrop(drop){
    const id = drop.dataset.drop;
    if(state.mode === 'drag'){
      drop.addEventListener('dragover', (e)=>{ e.preventDefault(); drop.style.outline = '3px solid rgba(124,219,255,.4)'; });
      drop.addEventListener('dragleave', ()=>{ drop.style.outline = ''; });
      drop.addEventListener('drop', (e)=>{
        e.preventDefault();
        drop.style.outline = '';
        const title = e.dataTransfer.getData('text/plain');
        if(title) placeTitle(id, title);
      });
    }else{
      drop.addEventListener('click', ()=>{
        if(!state.selectedTile){
          setResult(orgResult,'hint', state.help==='FR' ? 'Tape un titre dans la banque, puis une case.' : 'Tap a title in the bank, then a box.');
          return;
        }
        placeTitle(id, state.selectedTile);
      });
      drop.addEventListener('keydown', (e)=>{
        if(e.key==='Enter' || e.key===' '){
          e.preventDefault();
          drop.click();
        }
      });
    }
  }

  function renderBank(){
    bankTitles = shuffle(TITLES.map(t=>t.title));
    titleBank.innerHTML = '';
    bankTitles.forEach(t=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='tile';
      b.textContent=t;
      b.setAttribute('aria-pressed','false');
      if(state.mode === 'drag'){
        b.setAttribute('draggable','true');
        b.addEventListener('dragstart', (e)=>{
          e.dataTransfer.setData('text/plain', t);
          e.dataTransfer.effectAllowed = 'move';
        });
      }else{
        b.addEventListener('click', ()=>{
          titleBank.querySelectorAll('.tile').forEach(x=>x.setAttribute('aria-pressed','false'));
          b.setAttribute('aria-pressed','true');
          state.selectedTile = t;
        });
      }
      titleBank.appendChild(b);
    });
    updateBankTip();
  }

  function placeTitle(boxId, title){
    // remove title from other boxes (allow move)
    Object.keys(placed).forEach(k=>{
      if(placed[k] === title) placed[k] = null;
    });
    placed[boxId] = title;
    state.selectedTile = null;
    // reset selected
    titleBank.querySelectorAll('.tile').forEach(x=>x.setAttribute('aria-pressed','false'));
    renderOrgChart();
    addScore(1, false);
  }

  function checkOrg(){
    let correct = 0;
    ORG.forEach(spec=>{
      const got = placed[spec.id];
      const ok = norm(got) === norm(spec.answer);
      const drop = document.querySelector(`.drop[data-drop="${spec.id}"]`);
      if(drop){
        drop.classList.remove('good','bad');
        if(got){
          drop.classList.add(ok ? 'good' : 'bad');
        }
      }
      if(ok) correct += 1;
    });
    const total = ORG.length;
    const pct = Math.round((correct/total)*100);

    if(pct >= 85){
      setResult(orgResult,'good', `✅ Great! ${correct}/${total} correct (${pct}%). Key #2 unlocked!`);
      addScore(6, false);
      earnKey('k2');
    }else{
      breakStreak();
      setResult(orgResult,'bad', state.help==='FR'
        ? `❌ ${correct}/${total} correct (${pct}%). Indice: utilise “Title glossary”.`
        : `❌ ${correct}/${total} correct (${pct}%). Hint: use “Title glossary”.`
      );
    }
  }

  function resetOrg(){
    ORG.forEach(s=> placed[s.id] = null);
    renderOrgChart();
    renderBank();
    setResult(orgResult,'hint', state.help==='FR' ? 'Recommence : place les titres.' : 'Try again: place the titles.');
  }

  $('#btnOrgCheck').addEventListener('click', checkOrg);
  $('#btnOrgReset').addEventListener('click', resetOrg);
  $('#btnBankShuffle').addEventListener('click', renderBank);
  $('#btnOrgHint').addEventListener('click', ()=>{
    const msg = state.help==='FR'
      ? '💡 Astuce: CFO = finance, CTO = tech, COO = opérations. HR = people.'
      : '💡 Hint: CFO = finance, CTO = tech, COO = operations. HR = people.';
    setResult(orgResult,'hint', msg);
  });
  $('#btnOrgReveal').addEventListener('click', ()=>{
    const list = TITLES.map(t=>`<li><strong>${esc(t.title)}</strong> — ${esc(t.def)} ${state.help==='FR' ? `<br><span class="muted">🇫🇷 ${esc(t.fr)}</span>` : ''}</li>`).join('');
    openModal('Title glossary', `<ul>${list}</ul>`);
  });

  // --- 5) Sentence Builder ---
  const bSub = $('#bSub');
  const bVerb = $('#bVerb');
  const bObj = $('#bObj');
  const buildOut = $('#buildOut');
  const buildRes = $('#buildRes');

  const BUILD = {
    subs: ['The CEO','The CFO','The CTO','The COO','The HR Manager','The Engineering Manager','The Product Manager'],
    verbs: [
      {v:'reports to', type:'boss', okObj:['the CEO','the CTO','the COO','the CFO']},
      {v:'manages', type:'thing', okObj:['the team','recruitment','operations','the budget','projects']},
      {v:'oversees', type:'thing', okObj:['finance','technology','customer support','operations']},
      {v:'is in charge of', type:'thing', okObj:['IT support','logistics','the roadmap','hiring']},
    ],
    objsBoss: ['the CEO','the CFO','the CTO','the COO'],
    objsThing: ['finance','technology','operations','recruitment','IT support','the team','the roadmap','customer support','the budget','logistics','projects','hiring']
  };

  function fillSelect(sel, items){
    sel.innerHTML = '';
    items.forEach(it=>{
      const o = document.createElement('option');
      o.value = it;
      o.textContent = it;
      sel.appendChild(o);
    });
  }

  function renderBuilder(){
    fillSelect(bSub, BUILD.subs);
    fillSelect(bVerb, BUILD.verbs.map(x=>x.v));
    fillSelect(bObj, BUILD.objsThing);
    updateBuildOut();
  }

  function updateBuildOut(){
    const s = bSub.value;
    const v = bVerb.value;
    const o = bObj.value;
    buildOut.textContent = `${s} ${v} ${o}.`;
  }
  bSub.addEventListener('change', updateBuildOut);
  bVerb.addEventListener('change', ()=>{
    const verb = BUILD.verbs.find(x=>x.v===bVerb.value) || BUILD.verbs[0];
    fillSelect(bObj, verb.type==='boss' ? BUILD.objsBoss : BUILD.objsThing);
    updateBuildOut();
  });
  bObj.addEventListener('change', updateBuildOut);

  $('#btnBuildNew').addEventListener('click', ()=>{
    bSub.selectedIndex = Math.floor(Math.random()*bSub.options.length);
    bVerb.selectedIndex = Math.floor(Math.random()*bVerb.options.length);
    // trigger change to update objs
    bVerb.dispatchEvent(new Event('change'));
    bObj.selectedIndex = Math.floor(Math.random()*bObj.options.length);
    updateBuildOut();
    setResult(buildRes,'hint', state.help==='FR' ? 'Nouveau défi !' : 'New challenge!');
  });
  $('#btnBuildListen').addEventListener('click', ()=> speak(buildOut.textContent));
  $('#btnBuildHint').addEventListener('click', ()=>{
    const msg = state.help==='FR'
      ? '💡 “reports to” → une personne / un chef. “in charge of” → une responsabilité.'
      : '💡 “reports to” → a person/boss. “in charge of” → a responsibility.';
    setResult(buildRes,'hint', msg);
  });

  $('#btnBuildCheck').addEventListener('click', ()=>{
    const s = bSub.value;
    const v = bVerb.value;
    const o = bObj.value;

    const verb = BUILD.verbs.find(x=>x.v===v);
    let ok = false;

    if(verb.type==='boss'){
      ok = BUILD.objsBoss.includes(o);
    }else{
      ok = BUILD.objsThing.includes(o);
    }

    // extra realism rules
    if(v==='reports to' && (s==='The CEO')) ok = false;

    if(ok){
      addScore(3);
      state.builderWins += 1;
      setResult(buildRes,'good', `✅ Correct: <strong>${esc(buildOut.textContent)}</strong>`);
      if(state.builderWins >= 3){
        earnKey('k3');
      }
    }else{
      breakStreak();
      setResult(buildRes,'bad', state.help==='FR'
        ? '❌ Pas naturel. Astuce: CEO ne “reports to” personne.'
        : '❌ Not natural. Hint: the CEO does not “report to” anyone.'
      );
    }
  });

  // Mini test
  const miniTest = $('#miniTest');
  const TEST = [
    {q:'Choose the best: “I ____ the CTO.”', opts:['report to','reports to','reporting'], a:'report to',
     hint:'I/you/we/they → base form: report.'},
    {q:'Choose the best: “The CFO ____ the budget.”', opts:['manage','manages','managed'], a:'manages',
     hint:'He/she/it → -s.'},
    {q:'Choose the best title: “I lead technology.”', opts:['CFO','CTO','HR Manager'], a:'CTO',
     hint:'Technology → CTO.'},
    {q:'Correct phrase:', opts:['in charge of','in charge to','in charge for'], a:'in charge of',
     hint:'Always: in charge of + noun.'},
  ];

  function renderMiniTest(){
    miniTest.innerHTML = '';
    TEST.forEach((it, idx)=>{
      const q = document.createElement('div');
      q.className='q';
      q.innerHTML = `<div class="q__p">${idx+1}) ${esc(it.q)}</div>`;
      const choices = document.createElement('div');
      choices.className='choices';
      const res = document.createElement('div');
      res.className='result result--hint';
      res.textContent = 'Choose an answer.';

      shuffle(it.opts).forEach(opt=>{
        const b = document.createElement('button');
        b.type='button';
        b.className='choice';
        b.textContent=opt;
        b.addEventListener('click', ()=>{
          const ok = norm(opt) === norm(it.a);
          if(ok){
            addScore(2);
            setResult(res,'good', '✅ Correct');
          }else{
            breakStreak();
            setResult(res,'bad', `❌ Not yet. <span class="muted">Hint: ${esc(it.hint)}</span>`);
          }
        });
        choices.appendChild(b);
      });

      q.appendChild(choices);
      q.appendChild(res);
      miniTest.appendChild(q);
    });
  }

  function setResult(el, kind, html){
    el.className = 'result ' + (kind==='good' ? 'result--good' : kind==='bad' ? 'result--bad' : 'result--hint');
    el.innerHTML = html;
  }

  function resetAll(showModal){
    state.score = 0;
    state.streak = 0;
    state.keys = 0;
    state.keysEarned = {k1:false, k2:false, k3:false};
    state.titleSeen = new Set();
    state.builderWins = 0;
    state.selectedTile = null;

    emojiCorrect = 0;

    // reset org placements
    ORG.forEach(s=> placed[s.id] = null);

    // rebuild everything
    titleDeck = shuffle(TITLES);
    titleIdx = 0;

    buildJobDeck(true);
    renderTitleCard();
    newEmojiQ();
    newWhoQ();
    newVerbQ();
    renderOrgChart();
    renderBank();
    renderBuilder();
    renderMiniTest();

    updateHUD();
    refreshHelpVisibility();

    if(showModal) openModal('Reset', '<p>All activities were reset.</p>');
  }

  // Init
  initJobFilter();
  ORG.forEach(s=> placed[s.id] = null);
  renderBuilder();
  renderMiniTest();
  resetAll(false);
  updateHUD();
  updateBankTip();
})();