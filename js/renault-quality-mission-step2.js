/* SpeakEasyTisha • Renault Quality Mission */
/* Tap-friendly, instant feedback. No learner name shown unless typed in. */

(function(){
  'use strict';

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const LS_KEY = 'SET_renault_quality_mission_v1';

  const state = {
    score: 0,
    streak: 0,
    keys: 0,
    uiLang: 'EN',
    voice: 'en-US',
    mode: 'tap',
    tapSelectedId: null,
    tapSelectedEl: null,
    progress: { warmupKey:false, introPasses:0, commsKey:false }
  };

  function escapeHTML(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function escapeRegex(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function save(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){} }
  function load(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return;
      const data = JSON.parse(raw);
      if(!data) return;
      ['score','streak','keys','uiLang','voice','mode'].forEach(k=>{ if(data[k]!==undefined) state[k]=data[k]; });
      if(data.progress) state.progress = Object.assign(state.progress, data.progress);
    }catch(e){}
  }

  function setText(el, txt){ if(el) el.textContent = txt; }
  function setResult(el, kind, html){
    if(!el) return;
    el.classList.remove('result--good','result--bad','result--hint');
    if(kind==='good') el.classList.add('result--good');
    if(kind==='bad') el.classList.add('result--bad');
    if(kind==='hint') el.classList.add('result--hint');
    el.innerHTML = html;
  }

  function updateHUD(){
    setText($('#score'), String(state.score));
    setText($('#streak'), String(state.streak));
    setText($('#keys'), String(state.keys));
    const bar = $('#bar');
    if(bar) bar.style.width = (state.keys/3*100).toFixed(0) + '%';
  }

  function bumpScore(delta, streakable=true){
    state.score = Math.max(0, state.score + delta);
    if(streakable){
      if(delta>0) state.streak += 1;
      else state.streak = 0;
    }
    updateHUD(); save();
  }

  function addKey(){
    if(state.keys>=3) return;
    state.keys += 1;
    updateHUD(); save();
    toast((state.uiLang==='FR') ? `🔓 Clé gagnée ! (${state.keys}/3)` : `🔓 Key earned! (${state.keys}/3)`);
  }

  // speech
  function speak(text){
    try{
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = state.voice || 'en-US';
      u.rate = 0.98;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  // modal
  const modal = { root:null, title:null, body:null, ok:null, close:null };
  function initModal(){
    modal.root = $('#modal'); modal.title = $('#mTitle'); modal.body = $('#mBody');
    modal.ok = $('#mOk'); modal.close = $('#mClose');
    if(modal.ok) modal.ok.addEventListener('click', hideModal);
    if(modal.close) modal.close.addEventListener('click', hideModal);
    if(modal.root) modal.root.addEventListener('click', (e)=>{ if(e.target===modal.root) hideModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hideModal(); });
  }
  function showModal(title, html){
    if(!modal.root) return;
    modal.title.textContent = title;
    modal.body.innerHTML = html;
    modal.root.hidden = false;
  }
  function hideModal(){ if(modal.root) modal.root.hidden = true; }
  function toast(msg){ showModal((state.uiLang==='FR')?'Info':'Info', `<p>${escapeHTML(msg)}</p>`); }

  // tap selection
  function resetTap(){
    state.tapSelectedId = null;
    if(state.tapSelectedEl){
      state.tapSelectedEl.setAttribute('aria-pressed','false');
      state.tapSelectedEl = null;
    }
  }

  function makeTile({id,label,emoji}){
    const b = document.createElement('button');
    b.type='button'; b.className='tile';
    b.dataset.id=id; b.dataset.label=label;
    b.setAttribute('aria-pressed','false');
    b.innerHTML = `${emoji?`<span aria-hidden="true">${emoji}</span> `:''}${escapeHTML(label)}`;
    b.addEventListener('click', ()=>{
      if(state.mode!=='tap' || b.disabled) return;
      if(state.tapSelectedId===id){
        b.setAttribute('aria-pressed','false');
        b.setAttribute('aria-pressed','false');
        state.tapSelectedId=null; state.tapSelectedEl=null;
        return;
      }
      resetTap();
      state.tapSelectedId=id; state.tapSelectedEl=b;
      b.setAttribute('aria-pressed','true');
    });
    b.addEventListener('dragstart', (e)=>{
      if(state.mode!=='drag' || b.disabled){ e.preventDefault(); return; }
      e.dataTransfer.setData('text/plain', id);
    });
    return b;
  }

  function makeSlot({index,label,onDrop}){
    const wrap = document.createElement('div');
    wrap.className='slot'; wrap.dataset.index=String(index);
    wrap.innerHTML = `
      <div class="slot__label">${escapeHTML(label)}</div>
      <div class="slot__drop" role="button" tabindex="0">
        <div class="slot__text" data-slottext>(empty)</div>
        <div class="slot__hint">tap/drag</div>
      </div>`;
    const drop = $('.slot__drop', wrap);

    function place(id){
      if(!id) return;
      onDrop(id, wrap);
      resetTap();
    }
    drop.addEventListener('click', ()=>{
      if(state.mode!=='tap' || !state.tapSelectedId) return;
      place(state.tapSelectedId);
    });
    drop.addEventListener('keydown', (e)=>{
      if(e.key!=='Enter' && e.key!==' ') return;
      e.preventDefault();
      if(state.mode!=='tap' || !state.tapSelectedId) return;
      place(state.tapSelectedId);
    });
    drop.addEventListener('dragover', (e)=>{
      if(state.mode!=='drag') return;
      e.preventDefault();
      drop.style.outline='3px solid rgba(124,219,255,.55)';
      drop.style.outlineOffset='2px';
    });
    drop.addEventListener('dragleave', ()=>{ drop.style.outline=''; drop.style.outlineOffset=''; });
    drop.addEventListener('drop', (e)=>{
      if(state.mode!=='drag') return;
      e.preventDefault();
      drop.style.outline=''; drop.style.outlineOffset='';
      const id = e.dataTransfer.getData('text/plain');
      place(id);
    });
    return wrap;
  }

  // 1A sequence
  const seqSteps = [
    {id:'badge', emoji:'🪪', en:'Arrive at 8:30 and badge in', fr:'Arriver à 8h30 et badger'},
    {id:'email', emoji:'📩', en:'Check emails and review supplier documents', fr:'Vérifier les emails et relire les documents fournisseur'},
    {id:'meeting', emoji:'🧑‍💼', en:'Short meeting with my manager', fr:'Courte réunion avec mon manager'},
    {id:'inspect', emoji:'🏭', en:'Go to the workshop to inspect parts', fr:'Aller à l’atelier pour inspecter des pièces'},
    {id:'talk', emoji:'🤝', en:'Speak with a technician / team', fr:'Parler avec un technicien / l’équipe'},
    {id:'report', emoji:'📝', en:'Write a short report and send a follow‑up email', fr:'Rédiger un rapport et envoyer un email de relance'},
  ];
  const seqCorrect = ['badge','email','meeting','inspect','talk','report'];
  let seqSlotEls = [];

  function renderSeq(){
    const bank = $('#seqBank'), slots = $('#seqSlots');
    if(!bank||!slots) return;
    bank.innerHTML=''; slots.innerHTML=''; seqSlotEls=[]; resetTap();

    shuffle(seqSteps.slice()).forEach(s=>{
      const label = (state.uiLang==='FR')?s.fr:s.en;
      const tile = makeTile({id:s.id,label,emoji:s.emoji});
      tile.draggable = (state.mode==='drag');
      bank.appendChild(tile);
    });

    for(let i=0;i<seqCorrect.length;i++){
      const slot = makeSlot({
        index:i,
        label:(state.uiLang==='FR')?`Étape ${i+1}`:`Step ${i+1}`,
        onDrop:(id, wrap)=>{
          const step = seqSteps.find(x=>x.id===id);
          const label = (state.uiLang==='FR')?step.fr:step.en;
          $('[data-slottext]', wrap).textContent = `${step.emoji} ${label}`;
          wrap.dataset.placed = id;
          const t = $(`.tile[data-id="${CSS.escape(id)}"]`, bank);
          if(t) t.disabled = true;
        }
      });
      slots.appendChild(slot); seqSlotEls.push(slot);
    }

    setResult($('#seqResult'), '', (state.uiLang==='FR')?'Mets les étapes dans l’ordre.':'Put the steps in order.');
    setText($('#seqTip'), (state.uiLang==='FR')?'Mode Tap : touche une étape → touche une case (ou glisse).':'Tap mode: tap a step → tap a slot (or drag).');
  }

  function checkSeq(){
    const placed = seqSlotEls.map(s=>s.dataset.placed||'');
    const ok = placed.every((id,i)=>id===seqCorrect[i]);
    if(ok){
      seqSlotEls.forEach(s=>{ s.classList.remove('bad'); s.classList.add('good'); });
      setResult($('#seqResult'),'good',(state.uiLang==='FR')?'✅ Parfait ! Ordre correct.':'✅ Perfect! Correct order.');
      bumpScore(2,true);
      if(!state.progress.warmupKey){ state.progress.warmupKey=true; addKey(); save(); }
    }else{
      seqSlotEls.forEach((s,i)=>{
        s.classList.remove('good','bad');
        if((s.dataset.placed||'') && (s.dataset.placed!==seqCorrect[i])) s.classList.add('bad');
      });
      setResult($('#seqResult'),'bad',(state.uiLang==='FR')
        ?'❌ Pas encore. Astuce : badge → emails → réunion → atelier → équipe → rapport.'
        :'❌ Not yet. Hint: badge → emails → meeting → workshop → team → report.');
      bumpScore(-1,true);
    }
  }

  function seqListen(){ speak(seqCorrect.map(id=>seqSteps.find(x=>x.id===id).en).join('. ')); }

  // 1B connectors
  const connectors = ['First','Then','Next','After that','Finally'];
  const connItems = [
    {tpl:'____, I arrive at Renault at 8:30 and badge in.', correct:'First', fr:'____, j’arrive à 8h30 et je badge.'},
    {tpl:'____, I check emails and review supplier documents.', correct:'Then', fr:'____, je vérifie mes emails et je relis les documents.'},
    {tpl:'____, I attend a short meeting with my manager.', correct:'Next', fr:'____, j’assiste à une courte réunion.'},
    {tpl:'____, I go to the workshop to inspect parts.', correct:'After that', fr:'____, je vais à l’atelier pour inspecter des pièces.'},
    {tpl:'____, I write a short report and send a follow‑up email.', correct:'Finally', fr:'____, j’écris un rapport et j’envoie une relance.'},
  ];
  let connCur = null;

  function newConnector(){
    connCur = pick(connItems);
    setText($('#connSentence'), connCur.tpl);
    setText($('#connSentenceFR'), connCur.fr);
    $('#connSentenceFR').hidden = (state.uiLang!=='FR');

    const box = $('#connChoices');
    box.innerHTML='';
    shuffle(connectors.slice()).forEach(c=>{
      const b=document.createElement('button');
      b.type='button'; b.className='choice'; b.textContent=c;
      b.addEventListener('click', ()=>{
        if(c===connCur.correct){
          setResult($('#connResult'),'good',(state.uiLang==='FR')?`✅ Oui ! <strong>${c}</strong> est parfait.`:`✅ Yes! <strong>${c}</strong> fits best.`);
          bumpScore(1,true);
        }else{
          setResult($('#connResult'),'bad',(state.uiLang==='FR')?'❌ Pas exactement. Astuce : le dernier = <strong>Finally</strong>.':'❌ Not quite. Hint: the last step uses <strong>Finally</strong>.');
          bumpScore(-1,true);
        }
      });
      box.appendChild(b);
    });
    setResult($('#connResult'),'',(state.uiLang==='FR')?'Choisis un connecteur.':'Choose a connector.');
  }

  function connListen(){ if(connCur) speak(connCur.tpl.replace('____', connCur.correct)); }

  // 2A intro builder
  function needsAn(phrase){
    const w=(phrase||'').trim().toLowerCase();
    return /^[aeiou]/.test(w) || /^honest|^hour|^heir/.test(w);
  }
  function buildIntro(){
    const name = ($('#iName').value||'').trim();
    let title = ($('#iTitle').value||'').trim().replace(/\s+/g,' ');
    const dept = $('#iDept').value;
    const status = $('#iStatus').value;
    const company = $('#iCompany').value;
    const level = $('#iLevel').value;

    const prep = (status==='contractor')?'for':'at';
    const art = needsAn(title)?'an':'a';
    const deptPhrase = `the ${dept} Department`;

    let s1='', s2='';
    if(level==='A1'){
      if(name) s1=`My name is ${name}.`;
      s2=`I work ${prep} ${company} in ${dept}. I'm ${art} ${title.toLowerCase()}.`;
    }else if(level==='B1'){
      if(name) s1=`My name is ${name}.`;
      s2=`I'm ${art} ${title} in ${deptPhrase} ${prep} ${company}. I review documents and coordinate with suppliers.`;
    }else{
      if(name) s1=`My name is ${name}.`;
      s2=`I'm ${art} ${title} in ${deptPhrase} ${prep} ${company}.`;
    }
    const out=(s1? (s1+' ') : '') + s2;
    $('#introOut').textContent = out;
    return {out,name,title,dept,prep,company,art,level,status};
  }
  function checkIntro(){
    const d=buildIntro(); const out=d.out;
    const checks=[];
    checks.push({ ok:/\bI'm\s+(a|an)\b/i.test(out),
      en:'Use <b>a</b>/<b>an</b> before the job title.',
      fr:'Utilise <b>a</b>/<b>an</b> avant le métier.' });
    const expected = (d.status==='contractor')?'for':'at';
    checks.push({ ok:new RegExp(`\\b${expected}\\s+${escapeRegex(d.company)}\\b`,'i').test(out),
      en:(expected==='at')?'Employee: <b>at Renault</b> is most common.':'Contractor: <b>for Renault</b> is OK.',
      fr:(expected==='at')?'Employé : <b>at Renault</b> est le plus courant.':'Prestataire : <b>for Renault</b> est OK.' });
    checks.push({ ok:/Supplier Development Specialist/i.test(d.title),
      en:'Keep the word order: <b>Supplier Development Specialist</b>.',
      fr:'Garde l’ordre des mots : <b>Supplier Development Specialist</b>.' });

    const okAll = checks.every(c=>c.ok);
    if(okAll){
      setResult($('#introRes'),'good',(state.uiLang==='FR')
        ?'✅ Intro propre et professionnelle ! (article + préposition + ordre)'
        :'✅ Clean, professional intro! (article + preposition + word order)');
      bumpScore(2,true);
      state.progress.introPasses = clamp(state.progress.introPasses+1,0,99);
      if(state.progress.introPasses===3) addKey();
      save();
    }else{
      const missing = checks.filter(c=>!c.ok).map(c=> (state.uiLang==='FR')?c.fr:c.en);
      setResult($('#introRes'),'bad',`❌ ${(state.uiLang==='FR')?'À corriger':'Fix these'}: <ul>${missing.map(x=>`<li>${x}</li>`).join('')}</ul>`);
      bumpScore(-1,true);
    }
  }

  // 2B fix mistakes
  const fixItems = [
    {
      wrongEN:'My name is _____. I’m a Development Specialist Supplier in the Quality Department for Renault.',
      wrongFR:'Je m’appelle _____. Je suis Development Specialist Supplier au service Qualité pour Renault.',
      correct:'My name is _____. I’m a Supplier Development Specialist in the Quality Department at Renault.',
      options:[
        'My name is _____. I’m a Supplier Development Specialist in the Quality Department at Renault.',
        'My name is _____. I’m Supplier Development Specialist in Quality Department at Renault.',
        'My name is _____. I’m a Development Specialist Supplier in the Quality Department at Renault.',
        'My name is _____. I’m a Supplier Specialist Development in the Quality Department for Renault.'
      ],
      whyEN:'Word order + article + at/for.',
      whyFR:'Ordre des mots + article + at/for.'
    },
    {
      wrongEN:'I’m Supplier Development Specialist in Quality Department at Renault.',
      wrongFR:'Je suis Supplier Development Specialist dans service Qualité à Renault.',
      correct:'I’m a Supplier Development Specialist in the Quality Department at Renault.',
      options:[
        'I’m a Supplier Development Specialist in the Quality Department at Renault.',
        'I’m the Supplier Development Specialist in the Quality Department at Renault.',
        'I’m Supplier Development Specialist in the Quality Department for Renault.',
        'I’m a Supplier Development Specialist at the Quality Department in Renault.'
      ],
      whyEN:'Needs “a” + “the” for department.',
      whyFR:'Il faut “a” + “the” pour le service.'
    },
    {
      wrongEN:'I work for Renault. I am an Supplier Development Specialist.',
      wrongFR:'Je travaille pour Renault. Je suis un Supplier Development Specialist.',
      correct:'I work at Renault. I am a Supplier Development Specialist.',
      options:[
        'I work at Renault. I am a Supplier Development Specialist.',
        'I work in Renault. I am a Supplier Development Specialist.',
        'I work at Renault. I am an Supplier Development Specialist.',
        'I work for Renault. I am a Supplier Development Specialist.'
      ],
      whyEN:'Employee → “at”; “a” (not “an”).',
      whyFR:'Employé → “at”; “a” (pas “an”).'
    }
  ];
  let fixCur=null;
  function newFix(){
    fixCur = pick(fixItems);
    setText($('#fixPrompt'), `Wrong: ${fixCur.wrongEN}`);
    setText($('#fixPromptFR'), `Faux : ${fixCur.wrongFR}`);
    $('#fixPromptFR').hidden = (state.uiLang!=='FR');

    const box=$('#fixChoices'); box.innerHTML='';
    shuffle(fixCur.options.slice()).forEach(opt=>{
      const b=document.createElement('button');
      b.type='button'; b.className='choice'; b.textContent=opt;
      b.addEventListener('click', ()=>{
        if(opt===fixCur.correct){
          setResult($('#fixResult'),'good',(state.uiLang==='FR')?`✅ Correct ! ${fixCur.whyFR}`:`✅ Correct! ${fixCur.whyEN}`);
          bumpScore(1,true);
        }else{
          setResult($('#fixResult'),'bad',(state.uiLang==='FR')?'❌ Pas exactement. Astuce : article + ordre + at/for.':'❌ Not quite. Hint: article + word order + at/for.');
          bumpScore(-1,true);
        }
      });
      box.appendChild(b);
    });
    setResult($('#fixResult'),'',(state.uiLang==='FR')?'Choisis la meilleure correction.':'Choose the best correction.');
  }
  function fixListen(){ if(fixCur) speak(fixCur.correct.replace('_____', '').trim()); }

  // 2C AND combine
  const andItems = [
    {aEN:'I review supplier documents.', bEN:'I check emails.', aFR:'Je relis les documents fournisseur.', bFR:'Je vérifie mes emails.', correct:'I review supplier documents and check emails.'},
    {aEN:'I inspect parts.', bEN:'I speak with a technician.', aFR:'J’inspecte des pièces.', bFR:'Je parle avec un technicien.', correct:'I inspect parts and speak with a technician.'},
    {aEN:'I write a report.', bEN:'I send a follow‑up email.', aFR:'J’écris un rapport.', bFR:'J’envoie un email de relance.', correct:'I write a report and send a follow‑up email.'},
  ];
  let andCur=null;
  function newAnd(){
    andCur = pick(andItems);
    setText($('#andPrompt'), `${andCur.aEN} / ${andCur.bEN}`);
    setText($('#andPromptFR'), `🇫🇷 ${andCur.aFR} / ${andCur.bFR}`);
    $('#andPromptFR').hidden = (state.uiLang!=='FR');

    const opts = shuffle([
      andCur.correct,
      andCur.aEN + ' And ' + andCur.bEN,
      andCur.aEN.replace('.','') + ' and I ' + andCur.bEN.toLowerCase(),
      andCur.aEN.replace('.','') + ' because ' + andCur.bEN.toLowerCase(),
    ]);
    const box=$('#andChoices'); box.innerHTML='';
    opts.forEach(opt=>{
      const b=document.createElement('button');
      b.type='button'; b.className='choice'; b.textContent=opt;
      b.addEventListener('click', ()=>{
        if(opt===andCur.correct){
          setResult($('#andResult'),'good',(state.uiLang==='FR')?'✅ Super ! Une seule phrase, clair.':'✅ Nice! One clear sentence.');
          bumpScore(1,true);
        }else{
          setResult($('#andResult'),'bad',(state.uiLang==='FR')?'❌ Presque. Astuce : pas de majuscule à “and” et pas de répétition inutile.':'❌ Close. Hint: don’t capitalize “and” and don’t repeat “I” unless needed.');
          bumpScore(-1,true);
        }
      });
      box.appendChild(b);
    });
    setResult($('#andResult'),'',(state.uiLang==='FR')?'Choisis la meilleure phrase.':'Choose the best sentence.');
  }
  function andListen(){ if(andCur) speak(andCur.correct); }

  // 3 vocab
  const vocab = [
    {emoji:'🔎', termEN:'review and validate technical documents', termFR:'relire et valider des documents techniques', metaEN:'Core task', metaFR:'Tâche essentielle', exEN:'I review and validate technical documents for Renault projects.', exFR:'Je relis et je valide des documents techniques pour les projets.'},
    {emoji:'🤝', termEN:'meet the quality / supplier / production team', termFR:'rencontrer l’équipe qualité / fournisseur / production', metaEN:'Collaboration', metaFR:'Collaboration', exEN:'I meet the quality and supplier team to discuss issues.', exFR:'Je rencontre l’équipe qualité et fournisseur pour discuter des problèmes.'},
    {emoji:'🏭', termEN:'go on site to check a prototype / a part', termFR:'aller sur site pour vérifier un prototype / une pièce', metaEN:'On site', metaFR:'Sur site', exEN:'I go on site to check a prototype or a part.', exFR:'Je vais sur site pour vérifier un prototype ou une pièce.'},
    {emoji:'🧪', termEN:'run a test on the bench', termFR:'faire un essai sur le banc', metaEN:'Testing', metaFR:'Essais', exEN:'I run a test on the bench to validate the result.', exFR:'Je fais un essai sur le banc pour valider le résultat.'},
    {emoji:'✅', termEN:'ensure process compliance with standards', termFR:'assurer la conformité aux normes', metaEN:'Quality standard', metaFR:'Normes qualité', exEN:'I ensure process compliance with standards and plans.', exFR:'Je m’assure de la conformité aux normes et plans.'},
    {emoji:'🔗', termEN:'coordinate communication between teams and suppliers', termFR:'coordonner la communication entre équipes et fournisseurs', metaEN:'Coordination', metaFR:'Coordination', exEN:'I coordinate communication between teams and suppliers.', exFR:'Je coordonne la communication entre les équipes et les fournisseurs.'},
  ];
  let vIndex=0;
  function renderVocab(){
    const v=vocab[vIndex];
    setText($('#vEmoji'), v.emoji);
    setText($('#vTerm'), (state.uiLang==='FR')?v.termFR:v.termEN);
    setText($('#vMeta'), (state.uiLang==='FR')?v.metaFR:v.metaEN);
    setText($('#vExample'), v.exEN);
    setText($('#vFR'), `🇫🇷 ${v.exFR}`);
    $('#vFR').hidden = (state.uiLang!=='FR');
    setResult($('#vocabResult'), '', (state.uiLang==='FR')?'Astuce : touche la carte pour retourner.':'Tip: tap the card to flip.');
  }
  function vocabListen(){ speak(vocab[vIndex].exEN); }

  // goals match
  const goals = [
    {id:'improve', left:'📈 to improve quality/performance', right:'améliorer la qualité / performance'},
    {id:'deadline', left:'⏳ to meet the deadline', right:'respecter l’échéance'},
    {id:'reduce', left:'📉 to reduce cost/risk', right:'réduire le coût / le risque'},
    {id:'validate', left:'✅ to validate a part', right:'valider une pièce'},
  ];
  let goalSlotEls=[];
  function renderGoals(){
    const bank=$('#goalBank'), targets=$('#goalTargets');
    if(!bank||!targets) return;
    bank.innerHTML=''; targets.innerHTML=''; goalSlotEls=[]; resetTap();

    shuffle(goals.map(g=>({id:g.id,label:g.left}))).forEach(item=>{
      const tile=makeTile({id:item.id,label:item.label,emoji:''});
      tile.draggable=(state.mode==='drag');
      bank.appendChild(tile);
    });

    goals.forEach((g,idx)=>{
      const slot = makeSlot({
        index:idx,
        label:g.right,
        onDrop:(id, wrap)=>{
          const found = goals.find(x=>x.id===id);
          $('[data-slottext]', wrap).textContent = found ? found.left : '(?)';
          wrap.dataset.placed = id;
          const t = $(`.tile[data-id="${CSS.escape(id)}"]`, bank);
          if(t) t.disabled = true;
        }
      });
      targets.appendChild(slot); goalSlotEls.push(slot);
    });
    setResult($('#goalResult'),'',(state.uiLang==='FR')?'Associe les expressions.':'Match the phrases.');
  }
  function checkGoals(){
    const ok = goalSlotEls.every(slot=>{
      const right = $('.slot__label', slot).textContent.trim();
      const placed = slot.dataset.placed || '';
      const g = goals.find(x=>x.id===placed);
      return g && g.right === right;
    });
    if(ok){
      goalSlotEls.forEach(s=>{ s.classList.remove('bad'); s.classList.add('good'); });
      setResult($('#goalResult'),'good',(state.uiLang==='FR')?'✅ Parfait !':'✅ Perfect!');
      bumpScore(2,true);
    }else{
      goalSlotEls.forEach(s=>{
        s.classList.remove('good','bad');
        if(s.dataset.placed){
          const right = $('.slot__label', s).textContent.trim();
          const g = goals.find(x=>x.id===s.dataset.placed);
          if(!g || g.right!==right) s.classList.add('bad');
        }
      });
      setResult($('#goalResult'),'bad',(state.uiLang==='FR')?'❌ Pas encore. Astuce : 📈=améliorer, ⏳=échéance.':'❌ Not yet. Hint: 📈=improve, ⏳=deadline.');
      bumpScore(-1,true);
    }
  }

  // email builder (professional, no weird “regarding: …” lines)
const emailData = {
  subject: [
    'Follow‑up: prototype validation',
    'Request: updated delivery date',
    'Quality check: missing document',
    'Action needed: test results'
  ],
  goals: [
    { id:'update',   label:'Ask for an update' },
    { id:'document', label:'Request a document' },
    { id:'deadline', label:'Confirm a deadline' },
    { id:'report',   label:'Share a quick report' }
  ],
  greet: ['Hello,','Hi,','Good morning,','Dear Sir or Madam,'],
  signoff: ['Best regards,','Kind regards,','Sincerely,']
};

const subjectTopicMap = {
  'Follow‑up: prototype validation': 'the prototype validation',
  'Request: updated delivery date': 'the updated delivery date',
  'Quality check: missing document': 'the missing document',
  'Action needed: test results': 'the test results'
};
function inferTopic(subject){
  return subjectTopicMap[subject] || 'the project';
}

function getSignatureBlock(){
  // Uses the intro fields if they exist. Never shows a name unless typed.
  const nameEl = $('#iName');
  const titleEl = $('#iTitle');
  const deptEl = $('#iDept');
  const compEl = $('#iCompany');

  const name = nameEl ? (nameEl.value||'').trim() : '';
  const title = titleEl ? (titleEl.value||'').trim().replace(/\s+/g,' ') : '';
  const dept = deptEl ? (deptEl.value||'').trim() : 'Quality';
  const company = compEl ? (compEl.value||'').trim() : 'Renault';

  const deptLine = dept ? `${dept} Department` : 'Quality Department';
  const roleLine = title ? `${title} — ${deptLine}, ${company}` : `${deptLine}, ${company}`;

  // If user did not type a name, we keep it generic (still professional).
  return name ? `${name}\n${roleLine}` : `${roleLine}`;
}

const goalLine = {
  update:   (topic) => `I’m following up to ask for an update on ${topic}.`,
  document: (topic) => `I’m writing to request ${topic}.`,
  deadline: (topic) => `I’d like to confirm the deadline for ${topic}.`,
  report:   (topic) => `I’m following up with a quick report regarding ${topic}.`
};

const requestPool = {
  update: [
    (topic) => `Could you please share an update on ${topic}?`,
    (topic) => `Could you please confirm the current status of ${topic}?`,
    (topic) => `Would it be possible to send a quick update on ${topic} today?`
  ],
  document: [
    (topic) => `Could you please send the latest version of ${topic}?`,
    (topic) => `Could you please share ${topic} (PDF) by end of day?`,
    (topic) => `Would it be possible to send ${topic} today?`
  ],
  deadline: [
    (topic) => `Could you please confirm the deadline for ${topic}?`,
    (topic) => `Could you please confirm the delivery date and quantity?`,
    (topic) => `Would it be possible to confirm the planned date today?`
  ],
  report: [
    (topic) => `Could you please review the report and share your feedback?`,
    (topic) => `Could you please confirm the next steps for ${topic}?`,
    (topic) => `Would it be possible to schedule a short call to discuss ${topic}?`
  ]
};

function fillEmailSelects(){
  // Subject
  const sEl=$('#eSubj'); if(sEl){
    sEl.innerHTML='';
    emailData.subject.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; sEl.appendChild(o); });
  }
  // Goal
  const gEl=$('#eGoal'); if(gEl){
    gEl.innerHTML='';
    emailData.goals.forEach(g=>{ const o=document.createElement('option'); o.value=g.id; o.textContent=g.label; gEl.appendChild(o); });
  }
  // Greeting
  const grEl=$('#eGreet'); if(grEl){
    grEl.innerHTML='';
    emailData.greet.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; grEl.appendChild(o); });
  }
  // Sign‑off
  const cEl=$('#eClose'); if(cEl){
    cEl.innerHTML='';
    emailData.signoff.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; cEl.appendChild(o); });
  }
  fillEmailRequests();
}

function fillEmailRequests(){
  const subj = $('#eSubj')?.value || emailData.subject[0];
  const topic = inferTopic(subj);
  const goalId = $('#eGoal')?.value || 'update';

  const reqEl = $('#eReq');
  if(!reqEl) return;

  const pool = requestPool[goalId] || requestPool.update;
  reqEl.innerHTML='';
  pool.forEach(fn=>{
    const line = fn(topic);
    const o=document.createElement('option'); o.value=line; o.textContent=line; reqEl.appendChild(o);
  });
}

function toneLine(tone){
  if(tone==='urgent') return 'This is urgent for our planning. Thank you in advance for your support.';
  if(tone==='polite') return 'Thank you in advance for your support.';
  return '';
}

function buildEmail(){
  const subj = $('#eSubj').value;
  const goalId = $('#eGoal').value;
  const tone = $('#eTone').value;
  const greet = $('#eGreet').value;
  const req = $('#eReq').value;
  const signoff = $('#eClose').value;

  const topic = inferTopic(subj);
  const opening = (goalLine[goalId] || goalLine.update)(topic);
  const thanks = toneLine(tone);
  const sig = getSignatureBlock();

  const body = [
    `Subject: ${subj}`,
    '',
    `${greet}`,
    '',
    opening,
    req,
    thanks ? thanks : '',
    '',
    `${signoff}`,
    sig
  ].filter(Boolean).join('\n');

  $('#emailOut').textContent = body;
  return body;
}

function checkEmail(){
  const body = buildEmail();
  const ok =
    /^Subject:\s.+/m.test(body) &&
    /\b(I[’']m following up|I am following up|I[’']m writing|I am writing)\b/i.test(body) &&
    /\b(Could you please|Would it be possible)\b/i.test(body) &&
    /\b(Best regards|Kind regards|Sincerely)\b/i.test(body);

  if(ok){
    setResult($('#emailRes'),'good',(state.uiLang==='FR')
      ? '✅ Email très pro : objet + follow‑up + demande polie + formule de fin.'
      : '✅ Very professional email: subject + follow‑up + polite request + sign‑off.');
    bumpScore(2,true);
  }else{
    setResult($('#emailRes'),'bad',(state.uiLang==='FR')
      ? '❌ Ajoute : un objet, une phrase d’introduction (“I’m following up…”), une demande polie, et une formule de fin.'
      : '❌ Add: a subject, an opening line (“I’m following up…”), a polite request, and a sign‑off.');
    bumpScore(-1,true);
  }
}

function emailListen(){
  const body = buildEmail();
  const spoken = body.replace(/^Subject:.*\n+/,'').replace(/\n/g,' ');
  speak(spoken);
}

  async function copyText(txt){
    try{ await navigator.clipboard.writeText(txt); toast((state.uiLang==='FR')?'Copié !':'Copied!'); }
    catch(e){ toast(txt); }
  }

  // phone call order
  const callScripts = [
    { id:'delivery', lines:[
      'Hello, this is ____ from Renault Quality.',
      'I’m calling about the delivery date for the parts.',
      'Could you please confirm when you can deliver?',
      'Thank you. I’ll send a short follow‑up email.',
      'Goodbye.'
    ]},
    { id:'doc', lines:[
      'Hello, this is ____ from Renault.',
      'I’m following up on a missing technical document.',
      'Could you please send it today if possible?',
      'Thanks for your help.',
      'Goodbye.'
    ]}
  ];
  let callCur=null, callSlotEls=[];
  function newCall(){ callCur = pick(callScripts); renderCall(); }
  function renderCall(){
    const bank=$('#callBank'), slots=$('#callSlots');
    if(!bank||!slots) return;
    bank.innerHTML=''; slots.innerHTML=''; callSlotEls=[]; resetTap();

    shuffle(callCur.lines.slice()).forEach((line, idx)=>{
      const tile = makeTile({id:String(idx), label:line, emoji:'☎️'});
      tile.dataset.line=line;
      tile.draggable=(state.mode==='drag');
      bank.appendChild(tile);
    });

    for(let i=0;i<callCur.lines.length;i++){
      const slot = makeSlot({
        index:i,
        label:(state.uiLang==='FR')?`Ligne ${i+1}`:`Line ${i+1}`,
        onDrop:(id, wrap)=>{
          const tile = $(`.tile[data-id="${CSS.escape(id)}"]`, bank);
          if(!tile) return;
          $('[data-slottext]', wrap).textContent = tile.dataset.line;
          wrap.dataset.placed = tile.dataset.line;
          tile.disabled = true;
        }
      });
      slots.appendChild(slot); callSlotEls.push(slot);
    }
    setResult($('#callRes'),'',(state.uiLang==='FR')?'Construis l’appel dans l’ordre.':'Build the call in order.');
  }
  function checkCall(){
    const placed = callSlotEls.map(s=>s.dataset.placed||'');
    const ok = placed.every((line,i)=>line===callCur.lines[i]);
    if(ok){
      callSlotEls.forEach(s=>{ s.classList.remove('bad'); s.classList.add('good'); });
      setResult($('#callRes'),'good',(state.uiLang==='FR')?'✅ Parfait ! Appel clair et poli.':'✅ Perfect! Clear, polite call.');
      bumpScore(2,true);
      if(!state.progress.commsKey){ state.progress.commsKey=true; addKey(); save(); }
    }else{
      callSlotEls.forEach((s,i)=>{
        s.classList.remove('good','bad');
        if(s.dataset.placed && s.dataset.placed!==callCur.lines[i]) s.classList.add('bad');
      });
      setResult($('#callRes'),'bad',(state.uiLang==='FR')?'❌ Pas encore. Astuce : bonjour → sujet → demande → merci → au revoir.':'❌ Not yet. Hint: hello → purpose → request → thanks → goodbye.');
      bumpScore(-1,true);
    }
  }
  function callListen(){ if(callCur) speak(callCur.lines.join(' ')); }

  // quiz
  const quizItems = [
    {q:'Choose the best sentence:', options:[
      'I’m a Supplier Development Specialist in the Quality Department at Renault.',
      'I’m Supplier Development Specialist in Quality Department in Renault.',
      'I’m a Development Specialist Supplier in the Quality Department for Renault.',
      'I’m the Supplier Development Specialist in a Quality Department at Renault.'
    ], correct:0, hintEN:'Use “a” + correct word order + “at Renault”.', hintFR:'Utilise “a” + l’ordre + “at Renault”.'},
    {q:'Best email phrase for a polite request:', options:[
      'Send me the document now.',
      'Could you please send the latest document?',
      'I want the document.',
      'Give me the document.'
    ], correct:1, hintEN:'Use “Could you please…”.', hintFR:'Utilise “Could you please…”.'},
    {q:'Best connector to finish a routine:', options:['Then','After that','Finally','Next'], correct:2, hintEN:'The last step uses “Finally”.', hintFR:'La dernière étape = “Finally”.'},
    {q:'Employee preposition:', options:['I work in Renault.','I work at Renault.','I work on Renault.','I work to Renault.'], correct:1, hintEN:'Employees usually say “at Renault”.', hintFR:'Employé : “at Renault”.'},
  ];
  function renderQuiz(){
    const wrap=$('#quiz'); if(!wrap) return;
    wrap.innerHTML='';
    shuffle(quizItems.slice()).slice(0,3).forEach(item=>{
      const q=document.createElement('div'); q.className='q';
      q.innerHTML = `<div class="q__p">${escapeHTML(item.q)}</div>`;
      const choices=document.createElement('div'); choices.className='choices';
      item.options.forEach((opt,idx)=>{
        const b=document.createElement('button');
        b.type='button'; b.className='choice'; b.textContent=opt;
        b.addEventListener('click', ()=>{
          $$('.choice', choices).forEach(x=>x.disabled=true);
          if(idx===item.correct){
            setResult($('#quizRes'),'good',(state.uiLang==='FR')?'✅ Correct !':'✅ Correct!');
            bumpScore(1,true);
            q.style.borderColor='rgba(70,230,160,.6)';
          }else{
            setResult($('#quizRes'),'bad',(state.uiLang==='FR')?`❌ ${item.hintFR}`:`❌ ${item.hintEN}`);
            bumpScore(-1,true);
            q.style.borderColor='rgba(255,107,138,.65)';
          }
        });
        choices.appendChild(b);
      });
      q.appendChild(choices);
      wrap.appendChild(q);
    });
    setResult($('#quizRes'),'',(state.uiLang==='FR')?'Réponds pour avoir le feedback.':'Answer to get instant feedback.');
  }

  function applySettingsToUI(){
    $('#uiLang').value=state.uiLang;
    $('#voice').value=state.voice;
    $('#mode').value=state.mode;

    renderSeq();
    newConnector();
    renderVocab();
    renderGoals();
    newFix();
    newAnd();
    fillEmailSelects();
    buildEmail();
    newCall();
    renderQuiz();
    updateHUD();
  }

  function resetAll(){
    state.score=0; state.streak=0; state.keys=0;
    state.tapSelectedId=null; state.tapSelectedEl=null;
    state.progress={ warmupKey:false, introPasses:0, commsKey:false };
    save(); applySettingsToUI();
    toast((state.uiLang==='FR')?'Réinitialisé.':'Reset done.');
  }

  function init(){
    load();
    initModal();
    updateHUD();

    // hero
    $('#btnHow').addEventListener('click', ()=>{ const h=$('#how'); h.hidden=!h.hidden; });
    $('#btnStart').addEventListener('click', ()=>$('#warmup').scrollIntoView({behavior:'smooth'}));

    // global
    $('#uiLang').addEventListener('change', (e)=>{ state.uiLang=e.target.value; save(); applySettingsToUI(); });
    $('#voice').addEventListener('change', (e)=>{ state.voice=e.target.value; save(); });
    $('#mode').addEventListener('change', (e)=>{ state.mode=e.target.value; save(); applySettingsToUI(); });
    $('#btnReset').addEventListener('click', resetAll);
    $('#btnPrint').addEventListener('click', ()=>window.print());

    // quick speak
    $$('[data-say]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const sel=btn.getAttribute('data-say');
        const el=$(sel);
        if(el) speak(el.textContent.trim());
      });
    });

    // 1A
    $('#btnSeqShuffle').addEventListener('click', renderSeq);
    $('#btnSeqReset').addEventListener('click', renderSeq);
    $('#btnSeqHint').addEventListener('click', ()=> setResult($('#seqResult'),'hint',(state.uiLang==='FR')
      ?'💡 Astuce : badge → emails → réunion → atelier → équipe → rapport.'
      :'💡 Hint: badge → emails → meeting → workshop → team → report.'));
    $('#btnSeqListen').addEventListener('click', seqListen);
    $('#btnSeqCheck').addEventListener('click', checkSeq);

    // 1B
    $('#btnConnNew').addEventListener('click', newConnector);
    $('#btnConnHint').addEventListener('click', ()=> setResult($('#connResult'),'hint',(state.uiLang==='FR')?'💡 Début = First. Fin = Finally.':'💡 Start = First. End = Finally.'));
    $('#btnConnListen').addEventListener('click', connListen);

    // 2A
    $('#btnIntroBuild').addEventListener('click', ()=>buildIntro());
    $('#btnIntroCheck').addEventListener('click', checkIntro);
    $('#btnIntroListen').addEventListener('click', ()=> speak(buildIntro().out.replace('_____', '').trim()));
    $('#btnIntroHint').addEventListener('click', ()=> setResult($('#introRes'),'hint',(state.uiLang==='FR')
      ?'💡 Modèle : “I’m <b>a</b> Supplier Development Specialist in the Quality Department <b>at</b> Renault.”'
      :'💡 Model: “I’m <b>a</b> Supplier Development Specialist in the Quality Department <b>at</b> Renault.”'));
    $('#btnIntroCopy').addEventListener('click', ()=> copyText($('#introOut').textContent.trim()));

    // 2B
    $('#btnFixNew').addEventListener('click', newFix);
    $('#btnFixHint').addEventListener('click', ()=> setResult($('#fixResult'),'hint',(state.uiLang==='FR')?'💡 Vérifie : a/an + ordre des mots + at/for.':'💡 Check: a/an + word order + at/for.'));
    $('#btnFixListen').addEventListener('click', fixListen);

    // 2C
    $('#btnAndNew').addEventListener('click', newAnd);
    $('#btnAndHint').addEventListener('click', ()=> setResult($('#andResult'),'hint',(state.uiLang==='FR')?'💡 Règle : phrase 1 (sans point) + and + verbe.':'💡 Rule: sentence 1 (no period) + and + verb.'));
    $('#btnAndListen').addEventListener('click', andListen);

    // 3A
    $('#vocabCard').addEventListener('click', ()=>$('#vocabCard').classList.toggle('is-open'));
    $('#vocabCard').addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); $('#vocabCard').classList.toggle('is-open'); }});
    $('#btnVocabPrev').addEventListener('click', ()=>{ vIndex=(vIndex-1+vocab.length)%vocab.length; $('#vocabCard').classList.remove('is-open'); renderVocab(); });
    $('#btnVocabNext').addEventListener('click', ()=>{ vIndex=(vIndex+1)%vocab.length; $('#vocabCard').classList.remove('is-open'); renderVocab(); });
    $('#btnVocabListen').addEventListener('click', vocabListen);

    // 3B
    $('#btnGoalShuffle').addEventListener('click', renderGoals);
    $('#btnGoalReset').addEventListener('click', renderGoals);
    $('#btnGoalHint').addEventListener('click', ()=> setResult($('#goalResult'),'hint',(state.uiLang==='FR')?'💡 📈 improve, ⏳ deadline, 📉 reduce.':'💡 📈 improve, ⏳ deadline, 📉 reduce.'));
    $('#btnGoalCheck').addEventListener('click', checkGoals);

    // 4A
    fillEmailSelects();
    buildEmail();
    $('#btnEmailBuild').addEventListener('click', buildEmail);
    $('#btnEmailListen').addEventListener('click', emailListen);
    $('#btnEmailHint').addEventListener('click', ()=> setResult($('#emailRes'),'hint',(state.uiLang==='FR')
      ?'💡 Utilise : “I’m following up…”, “Could you please…”, et une formule de fin.'
      :'💡 Use: “I’m following up…”, “Could you please…”, and a closing.'));
    $('#btnEmailCheck').addEventListener('click', checkEmail);
    $('#btnEmailCopy').addEventListener('click', ()=> copyText($('#emailOut').textContent.trim()));
        if($('#eSubj')) $('#eSubj').addEventListener('change', ()=>{ fillEmailRequests(); buildEmail(); });
    if($('#eGoal')) $('#eGoal').addEventListener('change', ()=>{ fillEmailRequests(); buildEmail(); });
    $$('#eTone, #eGreet, #eReq, #eClose').forEach(el=> el.addEventListener('change', buildEmail));

    // 4B
    newCall();
    $('#btnCallNew').addEventListener('click', newCall);
    $('#btnCallReset').addEventListener('click', renderCall);
    $('#btnCallHint').addEventListener('click', ()=> setResult($('#callRes'),'hint',(state.uiLang==='FR')?'💡 Structure : bonjour → sujet → demande → merci → au revoir.':'💡 Structure: hello → purpose → request → thanks → goodbye.'));
    $('#btnCallListen').addEventListener('click', callListen);
    $('#btnCallCheck').addEventListener('click', checkCall);

    // quiz
    $('#btnQuizNew').addEventListener('click', renderQuiz);
    $('#btnQuizHint').addEventListener('click', ()=> setResult($('#quizRes'),'hint',(state.uiLang==='FR')?'💡 Regarde article, préposition, connecteurs, politesse.':'💡 Watch article, preposition, connectors, politeness.'));

    applySettingsToUI();
  }

  window.addEventListener('DOMContentLoaded', init);
})();