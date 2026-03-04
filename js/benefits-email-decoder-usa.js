/* Benefits Email Decoder — JS (tap-friendly, instant feedback) */
(() => {
  'use strict';

  // Prevent double-initialization if both ./ and /js/ scripts load
  if (window.__SE_BENEFITS_DECODER_LOADED) return;
  window.__SE_BENEFITS_DECODER_LOADED = true;

  const state = { level:'A2', lang:'EN', teacher:false, score:0 };

  const els = {
    jsStatus: document.getElementById('jsStatus'),
    progressPill: document.getElementById('progressPill'),
    btnTeacher: document.getElementById('btnTeacher'),
    btnReset: document.getElementById('btnReset'),
    btnPrint: document.getElementById('btnPrint'),
    vocabGrid: document.getElementById('vocabGrid'),
    vocabSearch: document.getElementById('vocabSearch'),
    btnShuffleVocab: document.getElementById('btnShuffleVocab'),
    termDrawer: document.getElementById('termDrawer'),
    termClose: document.getElementById('termClose'),
    termGotIt: document.getElementById('termGotIt'),
    termCopy: document.getElementById('termCopy'),
    termKicker: document.getElementById('termKicker'),
    termTitle: document.getElementById('termTitle'),
    termBody: document.getElementById('termBody'),
    startDate: document.getElementById('startDate'),
    btnCalcEligibility: document.getElementById('btnCalcEligibility'),
    btnTryExamples: document.getElementById('btnTryExamples'),
    eligibilityResult: document.getElementById('eligibilityResult'),
    eligibilityQuiz: document.getElementById('eligibilityQuiz'),
    planCards: document.getElementById('planCards'),
    calcPlan: document.getElementById('calcPlan'),
    calcTier: document.getElementById('calcTier'),
    calcPeople: document.getElementById('calcPeople'),
    btnCalcCost: document.getElementById('btnCalcCost'),
    costResult: document.getElementById('costResult'),
    simBill: document.getElementById('simBill'),
    simDed: document.getElementById('simDed'),
    simCo: document.getElementById('simCo'),
    simOOP: document.getElementById('simOOP'),
    btnSim: document.getElementById('btnSim'),
    simResult: document.getElementById('simResult'),
    qaGrid: document.getElementById('qaGrid'),
    checklistQuestions: document.getElementById('checklistQuestions'),
    btnCopyQuestions: document.getElementById('btnCopyQuestions'),
    btnClearQuestions: document.getElementById('btnClearQuestions'),
    questionsOut: document.getElementById('questionsOut'),
    qcm1: document.getElementById('qcm1'),
    gap1: document.getElementById('gap1'),
    tapOrder: document.getElementById('tapOrder'),
    grammarDrill: document.getElementById('grammarDrill'),
    dialogue: document.getElementById('dialogue'),
    finalPlan: document.getElementById('finalPlan'),
    btnScenario: document.getElementById('btnScenario'),
    scenarioOut: document.getElementById('scenarioOut'),
    finalReason: document.getElementById('finalReason'),
    btnCoach: document.getElementById('btnCoach'),
    btnCopyFinal: document.getElementById('btnCopyFinal'),
    coachOut: document.getElementById('coachOut'),
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
  const norm = (s)=>(s??'').toString().trim().toLowerCase().replace(/\s+/g,' ').replace(/[’']/g,"'");
  const money = (n)=> new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  const weeklyToMonthly = (w)=>(w*52)/12;

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function setResult(el, html, kind){
    el.classList.remove('good','bad');
    if(kind) el.classList.add(kind);
    el.innerHTML = html;
  }
  function copyToClipboard(text){ navigator.clipboard?.writeText(text).catch(()=>{}); }

  const TERMS = {
    portal:{ en:"<strong>Portal</strong>: secure website/app for enrolling, adding family members, and downloading documents.", fr:"<strong>Portail</strong>: site/app sécurisé pour s’inscrire, ajouter la famille, télécharger les documents." },
    benefits_specialist:{ en:"<strong>Benefits Specialist</strong>: HR contact for plan questions, deadlines, and enrollment.", fr:"<strong>Spécialiste RH</strong>: contact pour questions, délais et inscription." },
    eligibility:{ en:"<strong>Eligibility</strong>: when you are allowed to join benefits.", fr:"<strong>Éligibilité</strong>: moment où tu peux adhérer." },
    first_of_month:{ en:"<strong>1st of the month</strong>: coverage often starts on a month boundary.", fr:"<strong>1er du mois</strong>: début souvent au premier jour du mois." },
    waiting_period:{ en:"<strong>Waiting period</strong>: time you must work before coverage can start.", fr:"<strong>Période d’attente</strong>: délai avant le début de couverture." },
    full_time:{ en:"<strong>Full-time</strong>: hours defined by the employer (often 30–40/wk).", fr:"<strong>Temps plein</strong>: heures définies par l’employeur (souvent 30–40h/semaine)." },
    in_network:{ en:"<strong>In-network</strong>: contracted providers → usually lower cost.", fr:"<strong>Dans le réseau</strong>: prestataires partenaires → coût souvent plus bas." },
    premium:{ en:"<strong>Premium</strong>: amount paid each month/paycheck to keep insurance active.", fr:"<strong>Prime/cotisation</strong>: montant payé chaque mois/paie pour garder l’assurance." },
    premium_share:{ en:"<strong>Employer pays X%</strong>: company pays part of premium; rest is payroll deduction.", fr:"<strong>Employeur paie X%</strong>: une partie est payée par l’entreprise, le reste prélevé sur salaire." },
    dependents:{ en:"<strong>Dependents</strong>: spouse/children added to your plan.", fr:"<strong>Ayants droit</strong>: conjoint/enfants ajoutés au plan." },
    rx:{ en:"<strong>Prescription benefits</strong>: medication coverage (check formulary/tier).", fr:"<strong>Ordonnances</strong>: couverture médicaments (vérifier liste et niveau)." },
    annual_max:{ en:"<strong>Annual maximum (dental)</strong>: max the dental plan pays per year.", fr:"<strong>Plafond annuel (dentaire)</strong>: maximum payé par an." },
    pretax:{ en:"<strong>Pre-tax</strong>: taken from pay before taxes → lowers taxable income.", fr:"<strong>Avant impôts</strong>: retiré avant impôts → baisse revenu imposable." },
    auto_enroll:{ en:"<strong>Automatically enrolled</strong>: enrolled by default.", fr:"<strong>Inscription automatique</strong>: inscrit par défaut." },
    match:{ en:"<strong>Employer match</strong>: company adds to your 401(k) when you contribute.", fr:"<strong>Abondement</strong>: l’entreprise ajoute sur ton 401(k) quand tu cotises." },
    rollover:{ en:"<strong>Rollover</strong>: unused time may carry to next year (limits apply).", fr:"<strong>Report</strong>: jours non utilisés reportés (limites)." }
  };

  const VOCAB = [
    {key:'premium', term:'premium', cat:'cost', en:'Monthly/paycheck amount to keep coverage active.', fr:'Prime/cotisation payée chaque mois/paie.'},
    {key:'deductible', term:'deductible', cat:'cost', en:'Amount you pay before the plan pays for many services.', fr:'Franchise: somme avant remboursement.'},
    {key:'copay', term:'copay', cat:'cost', en:'Fixed price for a service.', fr:'Montant fixe pour un soin.'},
    {key:'coins', term:'coinsurance', cat:'cost', en:'Percentage you pay after deductible.', fr:'Pourcentage après franchise.'},
    {key:'oop', term:'out-of-pocket maximum', cat:'cost', en:'Max you pay per year for covered care (not premiums).', fr:'Plafond annuel (hors primes).'},
    {key:'network', term:'in-network', cat:'network', en:'Contracted providers → usually lower cost.', fr:'Prestataires partenaires → coût plus bas.'},
    {key:'sbc', term:'SBC / SPD', cat:'docs', en:'Official documents with exact plan rules.', fr:'Documents officiels avec règles/détails.'},
    {key:'formulary', term:'formulary', cat:'pharmacy', en:'List of covered drugs + tiers.', fr:'Liste médicaments couverts + niveaux.'},
    {key:'prior', term:'prior authorization', cat:'rules', en:'Approval required before some services/meds.', fr:'Autorisation préalable.'},
    {key:'ref', term:'referral', cat:'rules', en:'PCP sends you to a specialist (may be required).', fr:'Orientation vers spécialiste (parfois obligatoire).'},
    {key:'fsa', term:'Health FSA (Section 125)', cat:'money', en:'Pre-tax account for medical expenses.', fr:'Compte avant impôts pour dépenses santé.'},
    {key:'std', term:'Short-term disability (STD)', cat:'income', en:'Partial income replacement for temporary illness/injury.', fr:'Complément salaire arrêt temporaire.'},
    {key:'ltd', term:'Long-term disability (LTD)', cat:'income', en:'Income replacement after long disability.', fr:'Complément salaire longue durée.'},
    {key:'401k', term:'401(k)', cat:'retirement', en:'Retirement savings plan with possible match.', fr:'Plan retraite avec abondement possible.'},
    {key:'pto', term:'Paid time off (PTO)', cat:'time', en:'Paid holidays/vacation/sick time.', fr:'Congés payés: fériés/vacances/maladie.'},
  ];

  const PLANS = [
    {id:'surest', name:'Surest (UHC network)', employerPremium:'100% employee premium', descEN:'See costs in advance per service; no deductible/coinsurance in design.', descFR:'Voir le coût à l’avance; conception sans franchise/coassurance.', rates:{employee:0, children:88.77, spouse:88.77, family:141.47}},
    {id:'choice2500', name:'UHC Choice 2500', employerPremium:'100% employee premium', descEN:'Traditional medical + wellness + prescriptions. Check SBC/SPD for details.', descFR:'Plan classique + prescriptions. Vérifier SBC/SPD.', rates:{employee:0, children:90.79, spouse:90.79, family:144.73}},
    {id:'choice1000', name:'UHC Choice 1000', employerPremium:'80% employee premium', descEN:'Traditional plan; employee pays part of employee-only + higher dependent rates.', descFR:'Plan classique; salarié paie une partie + tarifs famille plus élevés.', rates:{employee:28.59, children:147.97, spouse:147.97, family:230.50}},
  ];

  const QA = [
    {id:'deadlines', titleEN:'Enrollment deadlines & changes', titleFR:'Délais d’inscription & changements', bodyEN:['What is the enrollment deadline?','Can we change plans later (life events)?','When do ID cards become available?'], bodyFR:["Quelle est la date limite d’inscription ?","Peut-on changer après (événements de vie) ?","Quand reçoit-on la carte d’assurance ?"]},
    {id:'network', titleEN:'Doctors & network', titleFR:'Médecins & réseau', bodyEN:['Is our pediatrician in-network?','Do we need a PCP? Are referrals required?','What happens out-of-network in an emergency?'], bodyFR:["Notre pédiatre est-il dans le réseau ?","Faut-il un PCP ? Referrals obligatoires ?","Que se passe-t-il hors réseau en urgence ?"]},
    {id:'costs', titleEN:'Costs (deductible, copays, OOP max)', titleFR:'Coûts (franchise, copays, plafond)', bodyEN:['What is the deductible (individual/family)?','What are copays for PCP/specialist/urgent care/ER?','What is the out-of-pocket maximum (individual/family)?'], bodyFR:["Quelle est la franchise (individuelle/famille) ?","Quels copays (PCP/spécialiste/urgent care/ER) ?","Quel plafond annuel (individuel/famille) ?"]},
    {id:'pharmacy', titleEN:'Prescriptions', titleFR:'Médicaments', bodyEN:['Which pharmacies are in-network?','Is a child’s inhaler covered? What tier?','Is prior authorization needed for certain meds?'], bodyFR:["Quelles pharmacies sont dans le réseau ?","L’inhalateur est-il couvert ? Quel tier ?","Autorisation préalable nécessaire ?"]},
    {id:'fsa', titleEN:'FSA reimbursement', titleFR:'Remboursement FSA', bodyEN:['What expenses are eligible?','Is there a carryover?','How do we submit receipts?'], bodyFR:["Quelles dépenses sont éligibles ?","Report possible ?","Comment envoyer les justificatifs ?"]},
  ];

  const SCENARIOS = {
    A2:[
      'Two kids need check-ups and vaccines. One adult wants to see a dermatologist. You want predictable costs.',
      'One child needs a monthly inhaler. You need to check pharmacy coverage and cost.',
      'Mostly preventive care + one urgent care visit. Budget is important.'
    ],
    B2:[
      'One parent needs specialist follow-up and imaging. You want transparency + strong network access.',
      'You travel across states often. Confirm out-of-area urgent care and emergency rules.',
      'You need clarity on prior authorization and prescription tiers for chronic care.'
    ]
  };


  // Enrollment manual (step-by-step) + persistence
  const LS_KEY = 'se-benefits-manual-v1';

  const MANUAL = {
    EN: {
      title: 'Your step-by-step checklist',
      packTitle: 'What to prepare (family of 5)',
      pack: [
        'Full legal names + dates of birth for spouse and children',
        'Social Security numbers (SSN) if available (follow portal instructions if not yet issued)',
        'Current doctors and pediatrician names + addresses (to check in-network)',
        'List of medications (name + dose) to check the pharmacy formulary/tier',
        'Expected care this year: check-ups, dental, vision, specialist visits',
        'A plan “must-have” list: low payroll deduction vs predictable visit costs vs broad network'
      ],
      steps: [
        { id:'login', title:'Log into the benefits portal', desc:'Use your company Amplify login. Find “Benefits Enrollment” / “New Hire Enrollment”. If you cannot access it, contact the Benefits Specialist.' , tags:['portal','access']},
        { id:'dates', title:'Confirm eligibility date + deadline', desc:'Coverage starts on the 1st of the month following 30 days of full-time employment. Note the effective date and the enrollment deadline.', tags:['eligibility','deadline']},
        { id:'medical', title:'Choose ONE medical plan', desc:'Pick Surest OR UHC Choice 2500 OR UHC Choice 1000. Compare using the official plan documents (SBC/SPD), not just premiums.', tags:['medical','compare']},
        { id:'tier', title:'Choose the coverage tier', desc:'Employee only / + children / + spouse / Family. For a family of five, “Family” is common unless the spouse has other insurance.', tags:['dependents','family']},
        { id:'dependents', title:'Add dependents + verify documents', desc:'Enter spouse/children in the portal. Upload documents if requested. Double-check spellings and dates of birth.', tags:['dependents','documents']},
        { id:'extras', title:'Decide: Dental, Vision, FSA, 401(k)', desc:'Dental and Vision are often optional. FSA is optional (choose an amount). 401(k) is optional (choose a contribution % or start later if allowed).', tags:['optional','money']},
        { id:'submit', title:'Review, submit, and save proof', desc:'Submit enrollment, download confirmation (PDF), and note the effective date. Ask when ID cards arrive and how to find in-network providers.', tags:['submit','proof']}
      ],
      emailTemplate: `Hello,\n\nWe are enrolling in benefits for our family of five. Before we choose a plan, could you please confirm:\n\n1) The enrollment deadline and our coverage effective date\n2) The SBC/SPD for each medical plan (Surest, UHC Choice 2500, UHC Choice 1000)\n3) The out-of-pocket maximum (individual and family) and copays for PCP/specialist/urgent care/ER\n4) Pharmacy details: formulary/tier for [MEDICATIONS], preferred pharmacies, and any prior authorization rules\n5) Network rules: PCP requirement, referral requirement, and how out-of-state urgent care works\n6) What documents are required to add dependents\n\nThank you.\n`
    },
    FR: {
      title: 'Checklist étape par étape',
      packTitle: 'À préparer (famille de 5)',
      pack: [
        'Noms officiels + dates de naissance du conjoint et des enfants',
        'Numéros de Sécurité Sociale US (SSN) si disponibles (sinon suivre les instructions du portail)',
        'Noms/adresses des médecins et du pédiatre (pour vérifier “in-network”)',
        'Liste des médicaments (nom + dosage) pour vérifier la “formulary” et le niveau',
        'Soins prévus cette année : bilans, dentaire, vision, spécialistes',
        'Vos priorités : faible prélèvement sur salaire vs coût prévisible par visite vs grand réseau'
      ],
      steps: [
        { id:'login', title:'Se connecter au portail', desc:'Utiliser l’identifiant Amplify. Chercher “Benefits Enrollment” / “New Hire Enrollment”. En cas de blocage, contacter le Benefits Specialist.', tags:['portail','accès']},
        { id:'dates', title:'Confirmer éligibilité + délais', desc:'La couverture démarre le 1er du mois suivant 30 jours de temps plein. Noter la date d’effet et la date limite d’inscription.', tags:['éligibilité','délais']},
        { id:'medical', title:'Choisir UN plan santé', desc:'Surest OU UHC Choice 2500 OU UHC Choice 1000. Comparer via les documents officiels (SBC/SPD), pas seulement la prime.', tags:['santé','comparaison']},
        { id:'tier', title:'Choisir le niveau de couverture', desc:'Employé seul / + enfants / + conjoint / Famille. Pour une famille de cinq, “Family” est fréquent sauf si le conjoint a une autre assurance.', tags:['ayants droit','famille']},
        { id:'dependents', title:'Ajouter les ayants droit + justificatifs', desc:'Renseigner conjoint/enfants dans le portail. Télécharger des documents si demandé. Vérifier orthographe et dates de naissance.', tags:['ayants droit','documents']},
        { id:'extras', title:'Décider : dentaire, vision, FSA, 401(k)', desc:'Dentaire/Vision sont souvent optionnels. FSA est optionnel (choisir un montant). 401(k) est optionnel (choisir un % ou démarrer plus tard si possible).', tags:['optionnel','argent']},
        { id:'submit', title:'Relire, valider, garder la preuve', desc:'Valider l’inscription, télécharger la confirmation (PDF), noter la date d’effet. Demander quand arrivent les cartes et comment trouver des prestataires in-network.', tags:['valider','preuve']}
      ],
      emailTemplate: `Bonjour,\n\nNous devons nous inscrire aux avantages pour notre famille de cinq. Avant de choisir un plan, pourriez-vous confirmer :\n\n1) La date limite d’inscription et la date de début de couverture\n2) Les documents SBC/SPD pour chaque plan santé (Surest, UHC Choice 2500, UHC Choice 1000)\n3) Le plafond annuel (individuel et famille) et les copays pour PCP/spécialiste/urgent care/urgences\n4) Médicaments : formulary/tier pour [MÉDICAMENTS], pharmacies partenaires, et règles d’autorisation préalable\n5) Règles réseau : PCP obligatoire, referrals, et urgent care hors État\n6) Justificatifs nécessaires pour ajouter les ayants droit\n\nMerci beaucoup.\n`
    }
  };

  function loadManualState(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return {};
      const obj = JSON.parse(raw);
      return (obj && typeof obj==='object') ? obj : {};
    }catch(_){ return {}; }
  }
  function saveManualState(obj){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(obj||{})); }catch(_){}
  }

  function buildManual(){
    const listEl = document.getElementById('manualList');
    if(!listEl) return; // manual section not present
    const langKey = state.lang === 'FR' ? 'FR' : 'EN';
    const m = MANUAL[langKey];

    const saved = loadManualState();
    const doneMap = (saved && saved.doneMap) ? saved.doneMap : {};

    const titleEl = document.getElementById('manualTitle');
    const packTitleEl = document.getElementById('manualPackTitle');
    const packEl = document.getElementById('manualPack');
    const emailEl = document.getElementById('manualEmail');

    if(titleEl) titleEl.textContent = m.title;
    if(packTitleEl) packTitleEl.textContent = m.packTitle;
    if(packEl) packEl.innerHTML = m.pack.map(x=>`<li>${escapeHtml(x)}</li>`).join('');

    if(emailEl && !emailEl.value.trim()) emailEl.value = m.emailTemplate;

    listEl.innerHTML = '';
    m.steps.forEach((s, idx) => {
      const div = document.createElement('div');
      div.className = 'mstep';
      const checked = !!doneMap[s.id];
      div.innerHTML = `
        <div class="mtop">
          <div class="mleft">
            <input class="mcheck" type="checkbox" ${checked?'checked':''} />
            <div>
              <div class="mtitle">${escapeHtml((idx+1)+') '+s.title)}</div>
              <div class="mdesc">${escapeHtml(s.desc)}</div>
              <div class="mmeta">${(s.tags||[]).map(t=>`<span class="mbadge">${escapeHtml(t)}</span>`).join('')}</div>
            </div>
          </div>
        </div>
      `;
      const cb = div.querySelector('input');
      cb.addEventListener('change', () => {
        const cur = loadManualState();
        const map = (cur && cur.doneMap) ? cur.doneMap : {};
        map[s.id] = cb.checked;
        saveManualState({doneMap: map});
        updateManualProgress();
      });
      listEl.appendChild(div);
    });

    updateManualProgress();
  }

  function updateManualProgress(){
    const out = document.getElementById('manualProgress');
    const listEl = document.getElementById('manualList');
    if(!out || !listEl) return;
    const langKey = state.lang === 'FR' ? 'FR' : 'EN';
    const m = MANUAL[langKey];
    const saved = loadManualState();
    const doneMap = (saved && saved.doneMap) ? saved.doneMap : {};
    const done = m.steps.filter(s=>!!doneMap[s.id]).length;
    out.textContent = (state.lang==='FR' ? `Manuel : ${done}/${m.steps.length} terminé` : `Manual: ${done}/${m.steps.length} done`);
  }

  function manualMarkAllDone(){
    const langKey = state.lang === 'FR' ? 'FR' : 'EN';
    const m = MANUAL[langKey];
    const map = {};
    m.steps.forEach(s=>{ map[s.id]=true; });
    saveManualState({doneMap: map});
    buildManual();
  }
  function manualReset(){
    saveManualState({doneMap:{}});
    buildManual();
  }
  function manualCopyChecklist(){
    const langKey = state.lang === 'FR' ? 'FR' : 'EN';
    const m = MANUAL[langKey];
    const saved = loadManualState();
    const doneMap = (saved && saved.doneMap) ? saved.doneMap : {};
    const lines = m.steps.map((s,i)=>`${doneMap[s.id]?'[x]':'[ ]'} ${i+1}. ${s.title} — ${s.desc}`);
    copyToClipboard(lines.join('\n'));
    const r = document.getElementById('manualEmailResult');
    if(r) setResult(r, state.lang==='FR' ? '✅ Checklist copiée.' : '✅ Checklist copied.', 'good');
  }
  function manualFillEmail(){
    const langKey = state.lang === 'FR' ? 'FR' : 'EN';
    const m = MANUAL[langKey];
    const box = document.getElementById('manualEmail');
    if(!box) return;
    box.value = m.emailTemplate;
    const r = document.getElementById('manualEmailResult');
    if(r) setResult(r, state.lang==='FR' ? '✅ Modèle ajouté.' : '✅ Template inserted.', 'good');
  }
  function manualCopyEmail(){
    const box = document.getElementById('manualEmail');
    if(!box) return;
    copyToClipboard(box.value);
    const r = document.getElementById('manualEmailResult');
    if(r) setResult(r, state.lang==='FR' ? '✅ Message copié.' : '✅ Message copied.', 'good');
  }

  // vocab flip
  let vocabFlip = new Set();

  function escapeHtml(s){
    const str = (s ?? '').toString();
    return str
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/\"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
  function escapeAttr(s){ return escapeHtml(s).replace(/\"/g,'&quot;'); }

  function escapeAttr(s){ return escapeHtml(s).replaceAll('"','&quot;'); }

  // term drawer
  let currentTermKey=null;
  function openTerm(key,label){
    currentTermKey=key;
    const payload = TERMS[key];
    els.termKicker.textContent='TERM';
    els.termTitle.textContent=label||key;
    els.termBody.innerHTML = payload ? (state.lang==='FR'?payload.fr:payload.en) : '<p class="muted">No definition found.</p>';
    els.termDrawer.classList.add('show');
    els.termDrawer.setAttribute('aria-hidden','false');
  }
  function closeTerm(){
    els.termDrawer.classList.remove('show');
    els.termDrawer.setAttribute('aria-hidden','true');
    currentTermKey=null;
  }

  // vocab grid
  function buildVocab(){
    const q = norm(els.vocabSearch.value);
    let cards = VOCAB.slice();
    if(q){
      cards = cards.filter(v => norm(v.term).includes(q) || norm(v.en).includes(q) || norm(v.fr).includes(q));
    }
    els.vocabGrid.innerHTML='';
    cards.forEach(v=>{
      const flipped = vocabFlip.has(v.key);
      const card=document.createElement('div');
      card.className='vcard';
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.innerHTML = `
        <div class="vterm">${escapeHtml(v.term)}</div>
        <div class="vdef">${escapeHtml(flipped ? (state.lang==='FR'?v.fr:v.en) : (state.lang==='FR'?v.en:v.fr))}</div>
        <div class="vmeta"><span class="badge">${escapeHtml(v.cat)}</span><span class="badge">flip</span></div>
      `;
      card.addEventListener('click',()=>{
        if(vocabFlip.has(v.key)) vocabFlip.delete(v.key); else vocabFlip.add(v.key);
        buildVocab();
      });
      card.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); card.click(); }});
      els.vocabGrid.appendChild(card);
    });
  }

  // eligibility calc
  function calcEligibility(startStr){
    const d = startStr ? new Date(startStr+'T00:00:00') : null;
    if(!d || isNaN(d.getTime())) return null;
    const after30 = new Date(d);
    after30.setDate(after30.getDate()+30);
    const eligible = new Date(after30.getFullYear(), after30.getMonth()+1, 1);
    return {start:d, after30, eligible};
  }
  function fmtDate(d){ return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}); }

  // quiz renderer
  function renderQuiz(container, questions, opts={}){
    container.innerHTML='';
    const showStem = !!opts.showStem;
    questions.forEach((q,idx)=>{
      const div=document.createElement('div');
      div.className='q';
      div.innerHTML=`
        <div class="qhead">
          <div>
            <div class="qtitle">${escapeHtml(q.prompt)}</div>
            ${showStem && q.stem ? `<div class="muted" style="margin-top:6px">${escapeHtml(q.stem)}</div>`:''}
          </div>
          <div class="badge">Q${idx+1}</div>
        </div>
        <div class="opts"></div>
        <div class="explain">${escapeHtml(state.lang==='FR'?q.explainFR:q.explainEN)}</div>
      `;
      const optsEl=$('.opts',div);
      q.options.forEach(o=>{
        const b=document.createElement('button');
        b.className='opt';
        b.type='button';
        b.textContent=o.text;
        b.addEventListener('click',()=>{
          if(div.dataset.done==='1') return;
          const ok=!!o.correct;
          b.classList.add(ok?'correct':'wrong');
          if(ok){
            div.dataset.done='1';
            $$('.opt',optsEl).forEach(x=>x.disabled=true);
            $('.explain',div).style.display='block';
            bumpScore(1);
          } else {
            if(state.teacher) $('.explain',div).style.display='block';
          }
          updateProgress();
        });
        optsEl.appendChild(b);
      });
      if(state.teacher) $('.explain',div).style.display='block';
      container.appendChild(div);
    });
  }

  // eligibility quiz
  function buildEligibilityQuiz(){
    const bank = state.level==='A2'
      ? [{start:'2026-01-10', exp:'2026-03-01'},{start:'2026-02-01', exp:'2026-03-01'},{start:'2026-02-20', exp:'2026-04-01'}]
      : [{start:'2026-03-31', exp:'2026-05-01'},{start:'2026-04-15', exp:'2026-06-01'},{start:'2026-11-05', exp:'2027-01-01'}];

    const items = bank.map((b,i)=>{
      const options = shuffle([b.exp,
        // near misses
        (()=>{ const d=new Date(b.start+'T00:00:00'); d.setDate(d.getDate()+30); return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10); })(),
        (()=>{ const d=new Date(b.start+'T00:00:00'); d.setDate(d.getDate()+15); return new Date(d.getFullYear(), d.getMonth()+1, 1).toISOString().slice(0,10); })()
      ]).slice(0,3);

      return {
        prompt: (state.lang==='FR'?`Date de début: ${b.start}. Début couverture ?`:`Start date: ${b.start}. Coverage starts?`),
        options: options.map(x=>({text:x, correct:x===b.exp})),
        explainEN:'Complete 30 days first, then coverage begins on the 1st of the following month.',
        explainFR:'Terminer 30 jours, puis début au 1er du mois suivant.'
      };
    });

    renderQuiz(els.eligibilityQuiz, items);
  }

  // plan cards + selects
  function buildPlanCards(){
    els.planCards.innerHTML='';
    els.calcPlan.innerHTML='';
    els.finalPlan.innerHTML='';

    PLANS.forEach(p=>{
      const div=document.createElement('div');
      div.className='plan';
      div.innerHTML=`
        <div class="top">
          <div>
            <div class="name">${escapeHtml(p.name)}</div>
            <div class="desc">${escapeHtml(state.lang==='FR'?p.descFR:p.descEN)}</div>
          </div>
          <div class="badge">${escapeHtml(p.employerPremium)}</div>
        </div>
        <ul class="bullets">
          <li>${escapeHtml(state.lang==='FR'?'Vérifier: réseau, prescriptions, urgences':'Check: network, prescriptions, urgent care/ER')}</li>
          <li>${escapeHtml(state.lang==='FR'?'Demander: SBC/SPD':'Ask for: SBC/SPD')}</li>
        </ul>
      `;
      els.planCards.appendChild(div);

      const o1=document.createElement('option'); o1.value=p.id; o1.textContent=p.name; els.calcPlan.appendChild(o1);
      const o2=document.createElement('option'); o2.value=p.id; o2.textContent=p.name; els.finalPlan.appendChild(o2);
    });
  }

  function calcWeekly(planId, tier){
    const p = PLANS.find(x=>x.id===planId);
    return p ? (p.rates[tier]??0) : 0;
  }
  function doCostCalc(){
    const w = calcWeekly(els.calcPlan.value, els.calcTier.value);
    const m = weeklyToMonthly(w);
    const y = w*52;
    setResult(els.costResult, `<div><strong>Weekly:</strong> ${money(w)}</div><div><strong>Monthly:</strong> ${money(m)}</div><div><strong>Yearly:</strong> ${money(y)}</div>`, 'good');
    bumpScore(1);
  }

  // simulator (simple)
  function simulate(){
    const bill=clamp(parseFloat(els.simBill.value||0),0,1e9);
    const ded=clamp(parseFloat(els.simDed.value||0),0,1e9);
    const co=clamp(parseFloat(els.simCo.value||0),0,100);
    const oop=clamp(parseFloat(els.simOOP.value||0),0,1e9);
    const payDed=Math.min(bill,ded);
    const rem=Math.max(0,bill-payDed);
    let total=payDed + rem*(co/100);
    total=Math.min(total, oop);
    setResult(els.simResult, `<div><strong>${state.lang==='FR'?'Reste à charge':'Out-of-pocket'}:</strong> ${money(total)}</div>`, 'good');
    bumpScore(1);
  }

  // Q&A build
  function buildQA(){
    els.qaGrid.innerHTML='';
    QA.forEach(item=>{
      const div=document.createElement('div');
      div.className='qa';
      div.innerHTML=`
        <div class="qatop">
          <div class="qtitle">${escapeHtml(state.lang==='FR'?item.titleFR:item.titleEN)}</div>
          <button class="smallbtn" aria-expanded="false">${state.lang==='FR'?'Voir':'Reveal'}</button>
        </div>
        <div class="qbody"><ul>${(state.lang==='FR'?item.bodyFR:item.bodyEN).map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
      `;
      const btn=$('button',div);
      btn.addEventListener('click',()=>{
        const open=div.classList.toggle('open');
        btn.setAttribute('aria-expanded',open?'true':'false');
        btn.textContent=open?(state.lang==='FR'?'Masquer':'Hide'):(state.lang==='FR'?'Voir':'Reveal');
      });
      els.qaGrid.appendChild(div);
    });
  }

  function buildChecklist(){
    els.checklistQuestions.innerHTML='';
    const all = QA.flatMap(item => (state.lang==='FR'?item.bodyFR:item.bodyEN).map(q=>({q, group:item.id})));
    all.forEach(x=>{
      const label=document.createElement('label');
      label.className='ck';
      label.innerHTML=`<input type="checkbox" data-q="${escapeAttr(x.q)}"/><div><strong>${escapeHtml(x.q)}</strong><div class="muted tiny">${escapeHtml(x.group)}</div></div>`;
      els.checklistQuestions.appendChild(label);
    });
  }

  function copySelectedQuestions(){
    const picks = $$('input[type="checkbox"]', els.checklistQuestions).filter(c=>c.checked).map(c=>c.getAttribute('data-q'));
    const intro = state.lang==='FR'
      ? 'Bonjour,\n\nJ\'ai quelques questions avant de choisir le plan santé pour notre famille :\n'
      : 'Hello,\n\nI have a few questions before choosing our family health plan:\n';
    const out = intro + picks.map(p=>`- ${p}`).join('\n') + '\n\nThank you.';
    els.questionsOut.value=out;
    copyToClipboard(out);
    bumpScore(1);
  }

  // practice: QCM + gap + tap order + grammar
  function buildQCM(){
    const items = state.level==='A2' ? [
      {promptEN:"What does 'company pays 100% of employee premium' mean?", promptFR:"Que veut dire 'entreprise paie 100% prime employé' ?",
       options:[{EN:'Employee pays nothing for their own premium.',FR:'L’employé ne paie rien pour sa prime.',ok:true},{EN:'Dependents are free.',FR:'La famille est gratuite.',ok:false},{EN:'No deductible.',FR:'Pas de franchise.',ok:false}],
       explainEN:'Dependents can still cost extra.', explainFR:'Les ayants droit peuvent coûter plus.'},
      {promptEN:'What is in-network?', promptFR:'C’est quoi in-network ?', options:[{EN:'Contracted provider',FR:'Prestataire partenaire',ok:true},{EN:'Any doctor',FR:'N’importe quel médecin',ok:false},{EN:'A French doctor',FR:'Un médecin français',ok:false}],
       explainEN:'In-network usually costs less.', explainFR:'Dans le réseau coûte souvent moins.'}
    ] : [
      {promptEN:'Why ask for SBC/SPD?', promptFR:'Pourquoi demander SBC/SPD ?', options:[{EN:'To see exact rules and cost-sharing.',FR:'Pour voir les règles exactes.',ok:true},{EN:'To replace a doctor.',FR:'Pour remplacer un médecin.',ok:false},{EN:'Only for accountants.',FR:'Seulement pour comptables.',ok:false}],
       explainEN:'The email is a summary; the docs have details.', explainFR:'L’email résume; les docs détaillent.'},
      {promptEN:"What should you verify even if a plan says 'no deductible and no coinsurance'?", promptFR:"Que vérifier même si 'pas de franchise/coassurance' ?",
       options:[{EN:'Out-of-pocket max and network rules.',FR:'Plafond annuel + règles réseau.',ok:true},{EN:'That everything is free.',FR:'Que tout est gratuit.',ok:false},{EN:'That taxes disappear.',FR:'Que les impôts disparaissent.',ok:false}],
       explainEN:'Confirm limits and pharmacy rules.', explainFR:'Confirmer limites et pharmacie.'}
    ];

    const mapped = items.map(q=>({
      prompt: state.lang==='FR'?q.promptFR:q.promptEN,
      options: q.options.map(o=>({text: state.lang==='FR'?o.FR:o.EN, correct:o.ok})),
      explainEN:q.explainEN, explainFR:q.explainFR
    }));
    renderQuiz(els.qcm1, mapped);
  }

  function buildGap(){
    const items = state.level==='A2' ? [
      {beforeEN:'Company pays 100% of the employee', blank:['premium'], afterEN:'.', beforeFR:'L’entreprise paie 100% de la', blankFR:['prime'], afterFR:' de l’employé.'},
      {beforeEN:'We can add our children as', blank:['dependents'], afterEN:'.', beforeFR:'On peut ajouter les enfants comme', blankFR:['ayants droit'], afterFR:'.'},
      {beforeEN:'I want to choose', blank:['a'], afterEN:' plan with lower costs.', beforeFR:'Je veux choisir', blankFR:['un'], afterFR:' plan.'}
    ] : [
      {beforeEN:'We should request Ø', blank:['SBC'], afterEN:' before enrolling.', beforeFR:'On devrait demander Ø', blankFR:['SBC'], afterFR:' avant l’inscription.'},
      {beforeEN:'The out-of-pocket maximum is the', blank:['maximum'], afterEN:' we pay in a year.', beforeFR:'Le plafond annuel est le', blankFR:['maximum'], afterFR:' payé dans l’année.'}
    ];

    els.gap1.innerHTML='';
    items.forEach(it=>{
      const div=document.createElement('div');
      div.className='item';
      const before=state.lang==='FR'?it.beforeFR:it.beforeEN;
      const after=state.lang==='FR'?it.afterFR:it.afterEN;
      const answers=(state.lang==='FR'?it.blankFR:it.blank).map(norm);
      div.innerHTML=`
        <div><span class="pillmini">Type the missing word</span></div>
        <div class="gapline"><span>${escapeHtml(before)}</span><input class="input" autocomplete="off" placeholder="…"/><span>${escapeHtml(after)}</span></div>
        <div class="feedback muted"></div>
        <div class="explain">${escapeHtml(state.lang==='FR'?'Indice: articles a/an/the/Ø.':'Tip: articles a/an/the/Ø.')}</div>
      `;
      const inp=$('input',div);
      const fb=$('.feedback',div);
      const check=()=>{
        const v=norm(inp.value);
        if(!v){ fb.textContent=''; fb.classList.remove('good','bad'); return; }
        const ok=answers.includes(v);
        fb.textContent = ok ? '✅ Correct' : (state.lang==='FR'?'❌ Essaie encore':'❌ Try again');
        fb.classList.toggle('good',ok);
        fb.classList.toggle('bad',!ok);
        if(ok) bumpScore(1);
      };
      inp.addEventListener('input',check);
      if(state.teacher) $('.explain',div).style.display='block';
      els.gap1.appendChild(div);
    });
  }

  function tokenize(sentence){
    return sentence.replace(/([.,!?;:])/g,' $1 ').replace(/\s+/g,' ').trim().split(' ').filter(Boolean).map(t=>({text:t, used:false, order:null}));
  }

  function buildTapOrder(){
    const sentences = state.level==='A2'
      ? ['Company pays 100% of the employee premium.','We add the children to the family plan.','Coverage starts on the first of the next month.']
      : ['We should confirm the out-of-pocket maximum in the SBC.','Rates may change annually, so we should budget for next year.','We might choose Surest because costs are visible before care.'];

    els.tapOrder.innerHTML='';
    sentences.forEach((s,idx)=>{
      const correct=tokenize(s);
      const bank=shuffle(correct.map(t=>({text:t.text, used:false, ref:t})));

      const div=document.createElement('div');
      div.className='item';
      div.innerHTML=`
        <div class="qhead">
          <div class="qtitle">${escapeHtml(state.lang==='FR'?'Remets la phrase dans le bon ordre':'Put the sentence in the correct order')}</div>
          <button class="smallbtn" data-act="reset">${state.lang==='FR'?'Réinitialiser':'Reset'}</button>
        </div>
        <div class="mini"><span class="tag">BANK</span></div>
        <div class="bank"></div>
        <div class="mini" style="margin-top:10px"><span class="tag">BUILD</span></div>
        <div class="built"></div>
        <div class="row" style="margin-top:10px">
          <button class="btn" data-act="check">${state.lang==='FR'?'Vérifier':'Check'}</button>
          <button class="btn ghost" data-act="hint">${state.lang==='FR'?'Indice':'Hint'}</button>
        </div>
        <div class="result">${escapeHtml(state.lang==='FR'?'Construis puis vérifie.':'Build then check.')}</div>
        <div class="explain">${escapeHtml(state.lang==='FR'?'Astuce: sujet + verbe + complément.':'Tip: subject + verb + object.')}</div>
      `;

      const bankEl=$('.bank',div);
      const builtEl=$('.built',div);
      const resEl=$('.result',div);

      function render(){
        bankEl.innerHTML='';
        builtEl.innerHTML='';
        const chosen = correct.filter(t=>t.order!=null).sort((a,b)=>a.order-b.order);
        chosen.forEach(t=>{
          const tok=document.createElement('span');
          tok.className='token';
          tok.textContent=t.text;
          tok.addEventListener('click',()=>{
            // remove from built
            t.used=false; t.order=null;
            // reindex
            const left=correct.filter(x=>x.order!=null).sort((a,b)=>a.order-b.order);
            left.forEach((x,i)=>x.order=i);
            render();
          });
          builtEl.appendChild(tok);
        });

        bank.forEach(b=>{
          if(b.used) return;
          const tok=document.createElement('span');
          tok.className='token';
          tok.textContent=b.text;
          tok.addEventListener('click',()=>{
            b.used=true;
            // append to built
            const max = Math.max(-1, ...correct.map(x=>x.order==null?-1:x.order));
            b.ref.order = max+1;
            b.ref.used = true;
            render();
          });
          bankEl.appendChild(tok);
        });
      }

      function builtSentence(){
        const chosen=correct.filter(t=>t.order!=null).sort((a,b)=>a.order-b.order).map(t=>t.text).join(' ');
        return chosen.replace(/\s+([.,!?;:])/g,'$1');
      }

      function reset(){
        correct.forEach(t=>{t.used=false; t.order=null;});
        bank.forEach(b=>{b.used=false;});
        setResult(resEl, escapeHtml(state.lang==='FR'?'Recommence.':'Start again.'), null);
        render();
      }
      function hint(){
        setResult(resEl, escapeHtml((state.lang==='FR'?'Premier mot: ':'First word: ')+correct[0].text), null);
      }
      function check(){
        const built=builtSentence();
        const ok = norm(built)===norm(s);
        if(ok){
          setResult(resEl, '✅ '+escapeHtml(state.lang==='FR'?'Correct !':'Correct!'), 'good');
          bumpScore(2);
        } else {
          setResult(resEl, '❌ '+escapeHtml(state.lang==='FR'?'Pas encore.':'Not yet.')+`<div class="mini" style="font-family:var(--mono);margin-top:6px">${escapeHtml(built||'—')}</div>`, 'bad');
        }
      }

      $$('[data-act]',div).forEach(btn=>{
        const act=btn.getAttribute('data-act');
        btn.addEventListener('click',()=>{ if(act==='reset') reset(); if(act==='hint') hint(); if(act==='check') check(); });
      });
      if(state.teacher) $('.explain',div).style.display='block';
      reset();
      els.tapOrder.appendChild(div);
    });
  }

  function buildGrammar(){
    const items = state.level==='A2' ? [
      {promptEN:'Correct comparative?', promptFR:'Comparatif correct ?', options:[{EN:'Surest is simpler than a traditional plan.',FR:'Surest is simpler than a traditional plan.',ok:true},{EN:'Surest is more simple that a plan.',FR:'Surest is more simple that a plan.',ok:false},{EN:'Surest is simplest than.',FR:'Surest is simplest than.',ok:false}],
       explainEN:"Use 'simpler than'.", explainFR:"Utilise 'simpler than'."},
      {promptEN:'Best modal:', promptFR:'Bon modal :', stemEN:'We ___ check the network.', stemFR:'On ___ vérifier le réseau.', options:[{EN:'should',FR:'should',ok:true},{EN:'were',FR:'were',ok:false},{EN:'did',FR:'did',ok:false}],
       explainEN:'Advice → should.', explainFR:'Conseil → should.'}
    ] : [
      {promptEN:'Choose the best sentence:', promptFR:'Choisis la meilleure phrase :', options:[{EN:'We might choose Surest because it is more transparent than a deductible-based plan, but we should confirm the out-of-pocket limit.',FR:'We might choose Surest because it is more transparent than a deductible-based plan, but we should confirm the out-of-pocket limit.',ok:true},{EN:'It is the most transparent than.',FR:'It is the most transparent than.',ok:false},{EN:'We chosen it yesterday.',FR:'We chosen it yesterday.',ok:false}],
       explainEN:'Comparative uses “more … than”.', explainFR:'Comparatif: “more … than”.'},
      {promptEN:'Pick the correct tense:', promptFR:'Temps correct :', stemEN:'We ___ the portal yesterday.', stemFR:'On ___ le portail hier.', options:[{EN:'logged into',FR:'logged into',ok:true},{EN:'log into',FR:'log into',ok:false},{EN:'will log into',FR:'will log into',ok:false}],
       explainEN:'Yesterday → past simple.', explainFR:'Hier → prétérit.'}
    ];

    const mapped = items.map(q=>({
      prompt: state.lang==='FR'?q.promptFR:q.promptEN,
      stem: q.stemEN ? (state.lang==='FR'?q.stemFR:q.stemEN) : null,
      options: q.options.map(o=>({text: state.lang==='FR'?o.FR:o.EN, correct:o.ok})),
      explainEN:q.explainEN, explainFR:q.explainFR
    }));
    renderQuiz(els.grammarDrill, mapped, {showStem:true});
  }

  function buildDialogue(){
    const turns = state.level==='A2' ? [
      {speaker:'Benefits', textEN:'Hello! How can I help you with enrollment?', textFR:'Bonjour ! Comment aider pour l’inscription ?',
       choices:[{EN:'When is the deadline to enroll?',FR:'Quelle est la date limite ?',ok:true,tipEN:'Good start.',tipFR:'Bon début.'},{EN:'I am doctor.',FR:'Je suis médecin.',ok:false,tipEN:'Off topic.',tipFR:'Hors sujet.'},{EN:'Give me free insurance.',FR:'Donnez-moi assurance gratuite.',ok:false,tipEN:'Too direct.',tipFR:'Trop direct.'}]},
      {speaker:'Benefits', textEN:'Which plan are you considering?', textFR:'Quel plan envisagez-vous ?',
       choices:[{EN:'We are a family of five. Can you confirm the weekly cost for family coverage?',FR:'Famille de cinq. Pouvez-vous confirmer le coût hebdo famille ?',ok:true,tipEN:'Perfect.',tipFR:'Parfait.'},{EN:'What is pizza?',FR:"C'est quoi pizza ?",ok:false,tipEN:'Off topic.',tipFR:'Hors sujet.'},{EN:'I don\'t need documents.',FR:'Pas besoin de documents.',ok:false,tipEN:'You do.',tipFR:'Si.'}]}
    ] : [
      {speaker:'Benefits', textEN:'We offer Surest and UHC Choice plans. What would you like to clarify?', textFR:'Nous proposons Surest et UHC Choice. Que clarifier ?',
       choices:[{EN:'Can you share the SBC/SPD so we can confirm out-of-pocket limits and prescriptions?',FR:'Pouvez-vous partager le SBC/SPD pour confirmer plafonds et médicaments ?',ok:true,tipEN:'Excellent.',tipFR:'Excellent.'},{EN:'Is it the most cheaper?',FR:'C\'est le plus moins cher ?',ok:false,tipEN:'Grammar + unclear.',tipFR:'Grammaire + flou.'},{EN:'I will not ask questions.',FR:'Je ne poserai pas de questions.',ok:false,tipEN:'Ask questions.',tipFR:'Il faut poser des questions.'}]},
      {speaker:'Benefits', textEN:'Anything else for your family?', textFR:'Autre chose pour votre famille ?',
       choices:[{EN:'We travel often. How does out-of-state urgent care work?',FR:'On voyage souvent. Comment marche l’urgent care hors État ?',ok:true,tipEN:'Great.',tipFR:'Très bien.'},{EN:'We was enroll yesterday.',FR:'On était inscrit hier.',ok:false,tipEN:'Tense issue.',tipFR:'Problème de temps.'},{EN:'Network is a doctor.',FR:'Le réseau est un docteur.',ok:false,tipEN:'Meaning issue.',tipFR:'Sens incorrect.'}]}
    ];

    els.dialogue.innerHTML='';
    let step=0;

    function render(){
      els.dialogue.innerHTML='';
      for(let i=0;i<=step;i++){
        const t=turns[i];
        const card=document.createElement('div');
        card.className='dcard';
        card.innerHTML=`
          <div class="dline"><div class="bubble"><div class="role">${escapeHtml(t.speaker)}</div><div>${escapeHtml(state.lang==='FR'?t.textFR:t.textEN)}</div></div></div>
        `;
        if(i===step){
          const opts=document.createElement('div');
          opts.className='dopts';
          t.choices.forEach(ch=>{
            const b=document.createElement('button');
            b.className='opt';
            b.textContent=state.lang==='FR'?ch.FR:ch.EN;
            b.addEventListener('click',()=>{
              const ok=ch.ok;
              b.classList.add(ok?'correct':'wrong');
              if(ok) bumpScore(2);
              $$('.opt',opts).forEach(x=>x.disabled=true);

              const reply=document.createElement('div');
              reply.className='dline';
              reply.innerHTML=`<div class="bubble you"><div class="role">You</div><div>${escapeHtml(state.lang==='FR'?ch.FR:ch.EN)}</div><div class="muted tiny" style="margin-top:6px">${escapeHtml(state.lang==='FR'?ch.tipFR:ch.tipEN)}</div></div>`;
              card.appendChild(reply);

              setTimeout(()=>{
                if(step<turns.length-1){ step++; render(); }
                else{
                  const done=document.createElement('div');
                  done.className='result good';
                  done.textContent = state.lang==='FR' ? '✅ Dialogue terminé.' : '✅ Dialogue complete.';
                  els.dialogue.appendChild(done);
                }
                updateProgress();
              }, 250);
            });
            opts.appendChild(b);
          });
          card.appendChild(opts);
        }
        els.dialogue.appendChild(card);
      }
    }
    render();
  }

  // final mission
  function generateScenario(){
    const pool=SCENARIOS[state.level]||SCENARIOS.A2;
    const s=pool[Math.floor(Math.random()*pool.length)];
    setResult(els.scenarioOut, escapeHtml(s), null);
    bumpScore(1);
  }
  function coachText(){
    const txt=els.finalReason.value.trim();
    if(!txt){
      setResult(els.coachOut, escapeHtml(state.lang==='FR'?'Écris un texte.':'Write some text.'), 'bad');
      return;
    }
    const hasComp=/\bthan\b|\bmore\b|\bless\b|\bbetter\b/i.test(txt);
    const hasModal=/\bshould\b|\bmight\b|\bmust\b|\bhave to\b|\bneed to\b/i.test(txt);
    const tips=[];
    if(!hasComp) tips.push(state.lang==='FR'?'Ajoute un comparatif (than / more / less).':'Add a comparative (than / more / less).');
    if(!hasModal) tips.push(state.lang==='FR'?'Ajoute un modal (should / might / have to).':'Add a modal (should / might / have to).');
    const improved = txt + (hasModal?'':' We should confirm the network and prescriptions.') + (hasComp?'':' It seems more predictable than the alternatives.');
    setResult(els.coachOut, `<div><strong>${escapeHtml(tips.length?(state.lang==='FR'?'À améliorer':'Improve'):(state.lang==='FR'?'Très bien':'Nice'))}</strong></div>`+
      (tips.length?`<ul>${tips.map(t=>`<li>${escapeHtml(t)}</li>`).join('')}</ul>`:'')+
      `<hr style="border:0;border-top:1px solid rgba(255,255,255,.12);margin:10px 0"/>`+
      `<div class="muted">${escapeHtml(state.lang==='FR'?'Version proposée :':'Suggested version:')}</div>`+
      `<div style="margin-top:6px;white-space:pre-wrap">${escapeHtml(improved)}</div>`,
      tips.length?'bad':'good'
    );
    bumpScore(tips.length?0:2);
  }

  // progress
  function bumpScore(n){ state.score += n; updateProgress(); }
  function updateProgress(){
    const max = state.level==='A2' ? 14 : 16;
    const pct = clamp(Math.round((state.score/max)*100),0,100);
    els.progressPill.textContent = `Progress: ${pct}%`;
  }

  function hardReset(){
    if(els.jsStatus) els.jsStatus.textContent = 'Interactive: ON';
    state.score=0;
    vocabFlip=new Set();
    els.vocabSearch.value='';
    els.questionsOut.value='';
    buildVocab();
    buildEligibilityQuiz();
    buildPlanCards();
    buildQA();
    buildChecklist();
    buildQCM();
    buildGap();
    buildTapOrder();
    buildGrammar();
    buildDialogue();
    buildManual();
    setResult(els.eligibilityResult, state.lang==='FR'?'Choisis une date.':'Choose a date.', null);
    setResult(els.costResult, state.lang==='FR'?'Choisis un plan.':'Choose a plan.', null);
    setResult(els.simResult, state.lang==='FR'?'Essaie.':'Try.', null);
    setResult(els.scenarioOut, state.lang==='FR'?'Génère un scénario.':'Generate a scenario.', null);
    setResult(els.coachOut, state.lang==='FR'?'Écris puis coach.':'Write then coach.', null);
    updateProgress();
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function wire(){
    // level
    $$('.seg-btn[data-level]').forEach(b=>{
      b.addEventListener('click',()=>{
        $$('.seg-btn[data-level]').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
        b.classList.add('active'); b.setAttribute('aria-selected','true');
        state.level=b.dataset.level;
        buildEligibilityQuiz(); buildQCM(); buildGap(); buildTapOrder(); buildGrammar(); buildDialogue(); buildManual();
        updateProgress();
      });
    });
    // lang
    $$('.seg-btn[data-lang]').forEach(b=>{
      b.addEventListener('click',()=>{
        $$('.seg-btn[data-lang]').forEach(x=>{x.classList.remove('active'); x.setAttribute('aria-selected','false');});
        b.classList.add('active'); b.setAttribute('aria-selected','true');
        state.lang=b.dataset.lang;
        buildVocab(); buildPlanCards(); buildQA(); buildChecklist(); buildQCM(); buildGap(); buildTapOrder(); buildGrammar(); buildDialogue(); buildManual();
        updateProgress();
      });
    });

    els.btnTeacher.addEventListener('click',()=>{
      state.teacher=!state.teacher;
      document.body.classList.toggle('teacher', state.teacher);
      els.btnTeacher.textContent = `Teacher Mode: ${state.teacher?'ON':'OFF'}`;
      // refresh explain visibility
      buildQCM(); buildGap(); buildTapOrder(); buildGrammar();
    });

    els.btnReset.addEventListener('click', hardReset);
    els.btnPrint.addEventListener('click', ()=>window.print());

    // term clicks
    $$('.term').forEach(span=>{
      span.addEventListener('click',()=>openTerm(span.dataset.term, span.textContent));
    });

    // drawer close
    els.termClose.addEventListener('click', closeTerm);
    els.termGotIt.addEventListener('click', closeTerm);
    els.termDrawer.addEventListener('click',(e)=>{ if(e.target===els.termDrawer) closeTerm(); });
    els.termCopy.addEventListener('click',()=>{
      if(!currentTermKey) return;
      const payload=TERMS[currentTermKey];
      const text=(state.lang==='FR'?payload.fr:payload.en).replace(/<[^>]+>/g,'');
      copyToClipboard(text);
    });

    // vocab search
    els.vocabSearch.addEventListener('input', buildVocab);
    els.btnShuffleVocab.addEventListener('click',()=>{ vocabFlip=new Set(); buildVocab(); });

    // eligibility buttons
    els.btnCalcEligibility.addEventListener('click',()=>{
      const res=calcEligibility(els.startDate.value);
      if(!res){ setResult(els.eligibilityResult, state.lang==='FR'?'Date invalide.':'Invalid date.', 'bad'); return; }
      setResult(els.eligibilityResult,
        (state.lang==='FR'
          ? `<div><strong>Début:</strong> ${fmtDate(res.start)}</div><div><strong>Après 30 jours:</strong> ${fmtDate(res.after30)}</div><div><strong>Début couverture:</strong> ${fmtDate(res.eligible)}</div>`
          : `<div><strong>Start:</strong> ${fmtDate(res.start)}</div><div><strong>After 30 days:</strong> ${fmtDate(res.after30)}</div><div><strong>Coverage starts:</strong> ${fmtDate(res.eligible)}</div>`),
        'good'
      );
      bumpScore(1);
    });
    els.btnTryExamples.addEventListener('click',()=>{
      const ex = state.level==='A2' ? ['2026-01-10','2026-02-20','2026-02-01'] : ['2026-03-31','2026-11-05','2026-04-15'];
      els.startDate.value = ex[Math.floor(Math.random()*ex.length)];
      els.btnCalcEligibility.click();
    });

    // calc + sim
    els.btnCalcCost.addEventListener('click', doCostCalc);
    els.btnSim.addEventListener('click', simulate);

    // questions
    els.btnCopyQuestions.addEventListener('click', copySelectedQuestions);
    els.btnClearQuestions.addEventListener('click',()=>{ $$('input[type="checkbox"]',els.checklistQuestions).forEach(c=>c.checked=false); els.questionsOut.value=''; });


    // manual buttons (if the manual section exists)
    const btnManualCopy = document.getElementById('btnManualCopy');
    const btnManualAllDone = document.getElementById('btnManualAllDone');
    const btnManualReset = document.getElementById('btnManualReset');
    const btnManualCopyEmail = document.getElementById('btnManualCopyEmail');
    const btnManualFillEmail = document.getElementById('btnManualFillEmail');
    if(btnManualCopy) btnManualCopy.addEventListener('click', manualCopyChecklist);
    if(btnManualAllDone) btnManualAllDone.addEventListener('click', manualMarkAllDone);
    if(btnManualReset) btnManualReset.addEventListener('click', manualReset);
    if(btnManualCopyEmail) btnManualCopyEmail.addEventListener('click', manualCopyEmail);
    if(btnManualFillEmail) btnManualFillEmail.addEventListener('click', manualFillEmail);

    // final
    els.btnScenario.addEventListener('click', generateScenario);
    els.btnCoach.addEventListener('click', coachText);
    els.btnCopyFinal.addEventListener('click', ()=>copyToClipboard(els.finalReason.value||''));
  }

  function init(){
    buildVocab();
    buildEligibilityQuiz();
    buildPlanCards();
    buildQA();
    buildChecklist();
    buildQCM();
    buildGap();
    buildTapOrder();
    buildGrammar();
    buildDialogue();
    try{ els.startDate.value = new Date().toISOString().slice(0,10); }catch(_){}
    setResult(els.simResult, state.lang==='FR'?'Essaie une simulation.':'Try a simulation.', null);
    wire();
    updateProgress();
  }

  init();
})();