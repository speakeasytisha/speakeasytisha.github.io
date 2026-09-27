(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const storageKey = 'mireille_lesson1_v1';
  let current = 0;
  let trainerView = false;
  let frOn = false;
  let practiceMode = 'guided';
  let score = { q1: false, q2: false };
  let saveTimer;

  const sections = $$('.lesson-section');
  const navItems = $$('.nav-item');
  const toast = $('#toast');

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function visibleSections() {
    return sections.filter(s => trainerView || !s.classList.contains('trainer-section'));
  }

  function showSection(index) {
    const allowed = visibleSections();
    index = Math.max(0, Math.min(index, allowed.length - 1));
    const target = allowed[index];
    current = sections.indexOf(target);
    sections.forEach(s => s.classList.toggle('active', s === target));
    navItems.forEach(n => n.classList.toggle('active', Number(n.dataset.section) === current));
    const position = allowed.indexOf(target) + 1;
    const pct = Math.round((position / allowed.length) * 100);
    $('#progressLabel').textContent = `${position} / ${allowed.length}`;
    $('#progressPercent').textContent = `${pct}%`;
    $('#progressBar').style.width = `${pct}%`;
    $('#footerSection').textContent = `Section ${position} of ${allowed.length}`;
    $('#sectionTitle').textContent = target.dataset.title;
    $('#prevSection').disabled = position === 1;
    $('#nextSection').disabled = position === allowed.length;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveState();
  }

  navItems.forEach(n => n.addEventListener('click', () => {
    const idx = Number(n.dataset.section);
    if (idx === 9 && !trainerView) return;
    const allowed = visibleSections();
    const target = sections[idx];
    const pos = allowed.indexOf(target);
    if (pos >= 0) showSection(pos);
  }));

  $('#prevSection').addEventListener('click', () => {
    const allowed = visibleSections();
    const pos = allowed.indexOf(sections[current]);
    showSection(pos - 1);
  });
  $('#nextSection').addEventListener('click', () => {
    const allowed = visibleSections();
    const pos = allowed.indexOf(sections[current]);
    showSection(pos + 1);
  });

  $('#frToggle').addEventListener('click', () => {
    frOn = !frOn;
    document.body.classList.toggle('show-fr', frOn);
    $('#frToggle').textContent = `FR help: ${frOn ? 'ON' : 'OFF'}`;
    $('#frToggle').setAttribute('aria-pressed', String(frOn));
    saveState();
  });

  $('#trainerToggle').addEventListener('click', () => {
    trainerView = !trainerView;
    document.body.classList.toggle('trainer-view', trainerView);
    $('#trainerToggle').textContent = `Trainer view: ${trainerView ? 'ON' : 'OFF'}`;
    $('#trainerToggle').setAttribute('aria-pressed', String(trainerView));
    if (!trainerView && sections[current].classList.contains('trainer-section')) showSection(0);
    else {
      const allowed = visibleSections();
      const pos = allowed.indexOf(sections[current]);
      showSection(Math.max(0, pos));
    }
    saveState();
  });

  function collectState() {
    const fields = {};
    $$('[data-save]').forEach(el => {
      const key = el.id || el.name || el.value;
      if (!key) return;
      if (el.type === 'checkbox') fields[key] = el.checked;
      else fields[key] = el.value;
    });
    const choiceGroups = {};
    $$('[data-choice-group]').forEach(group => {
      choiceGroups[group.dataset.choiceGroup] = $('.selected', group)?.dataset.value || '';
    });
    const multiGroups = {};
    $$('[data-multi-group]').forEach(group => {
      multiGroups[group.dataset.multiGroup] = $$('.selected', group).map(b => b.dataset.value);
    });
    const competency = {};
    $$('.competency-select').forEach(sel => competency[sel.dataset.id] = sel.value);
    return { fields, choiceGroups, multiGroups, competency, trainerView, frOn, practiceMode, current, score };
  }

  function saveState() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(collectState()));
      $('#saveStatus').textContent = '● Saved locally';
      $('#footerSave').textContent = 'Saved locally';
      updateSummary();
    }, 180);
  }

  $$('[data-save]').forEach(el => el.addEventListener('input', saveState));
  $$('[data-save]').forEach(el => el.addEventListener('change', saveState));

  $$('[data-choice-group]').forEach(group => {
    $$('button', group).forEach(btn => btn.addEventListener('click', () => {
      $$('button', group).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected'); saveState();
    }));
  });
  $$('[data-multi-group]').forEach(group => {
    $$('button', group).forEach(btn => btn.addEventListener('click', () => {
      btn.classList.toggle('selected'); saveState();
    }));
  });

  // Hints
  $$('.hint-btn').forEach(btn => btn.addEventListener('click', () => {
    const existing = btn.parentElement.querySelector('.inline-hint');
    if (existing) { existing.remove(); return; }
    const d = document.createElement('div');
    d.className = 'inline-hint';
    d.style.cssText = 'margin-top:9px;padding:10px 12px;border-radius:10px;background:#f3e8da;color:#604935;font-size:.9rem;';
    d.textContent = btn.dataset.hint;
    btn.parentElement.appendChild(d);
  }));

  // Speech synthesis - manual only
  function speak(text) {
    if (!('speechSynthesis' in window)) return showToast('Audio is not supported in this browser.');
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.93;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => /^en-GB/.test(v.lang)) || voices.find(v => /^en/.test(v.lang));
    if (preferred) u.voice = preferred;
    speechSynthesis.speak(u);
  }
  $$('.listen-btn').forEach(btn => btn.addEventListener('click', () => {
    let text = btn.dataset.speak;
    if (btn.dataset.speakTarget) text = $('#' + btn.dataset.speakTarget)?.textContent || '';
    if (text) speak(text);
  }));

  // Speaking model levels
  const models = {
    a22: 'At the moment, I am developing my professional project in the cultural sector. I am interested in art, heritage and working with visitors. I would like to use English more confidently in professional situations.',
    b1: 'I’m currently developing a professional project in the cultural sector, with a particular interest in art, heritage and public engagement. I’d like to become more confident using English with international visitors, artists and professional partners.'
  };
  $('#speakingModelLevel').addEventListener('change', e => { $('#speakingModelText').textContent = models[e.target.value]; });

  // Prompt carousel
  let promptIndex = 0;
  function showPrompt(i){ const cards = $$('.prompt-card'); promptIndex=(i+cards.length)%cards.length; cards.forEach((c,idx)=>c.classList.toggle('active',idx===promptIndex)); }
  $('#promptPrev').addEventListener('click',()=>showPrompt(promptIndex-1));
  $('#promptNext').addEventListener('click',()=>showPrompt(promptIndex+1));

  // Timers
  function timerController(display, seconds, startBtn, pauseBtn, resetBtn){
    let remaining=seconds, interval=null;
    const render=()=>{ const m=String(Math.floor(remaining/60)).padStart(2,'0'); const s=String(remaining%60).padStart(2,'0'); display.textContent=`${m}:${s}`; };
    const start=()=>{ if(interval) return; interval=setInterval(()=>{ if(remaining>0){remaining--;render();} else {clearInterval(interval);interval=null;showToast('Time. Finish your sentence calmly.');}},1000); };
    const pause=()=>{clearInterval(interval);interval=null;};
    const reset=()=>{pause();remaining=seconds;render();};
    startBtn.addEventListener('click',start); if(pauseBtn) pauseBtn.addEventListener('click',pause); resetBtn.addEventListener('click',reset); render();
  }
  timerController($('#speakingTimer'),60,$('#timerStart'),$('#timerPause'),$('#timerReset'));
  timerController($('#oralTimer'),45,$('#oralStart'),null,$('#oralReset'));

  // Randomize answer positions
  $$('.answers.randomized').forEach(group => {
    const nodes = $$('button', group);
    nodes.sort(() => Math.random() - .5).forEach(n => group.appendChild(n));
  });

  // MCQ
  $$('[data-question]').forEach(group => {
    $$('button', group).forEach(btn => btn.addEventListener('click', () => {
      const correct = group.dataset.correct;
      const feedback = group.parentElement.querySelector('.feedback');
      $$('button', group).forEach(b => b.classList.remove('correct','incorrect'));
      const ok = btn.textContent.trim() === correct;
      btn.classList.add(ok ? 'correct' : 'incorrect');
      if (practiceMode === 'guided') {
        feedback.className = `feedback ${ok ? 'good' : 'bad'}`;
        feedback.textContent = ok ? 'Correct — you answer the practical question clearly and offer useful help.' : 'Not quite. Focus on the visitor’s exact practical question first.';
      } else {
        feedback.className='feedback'; feedback.textContent='Answer recorded for this practice.';
      }
      if(group.dataset.question==='q1') score.q1=ok;
      updateMiniScore(); saveState();
    }));
  });

  $('.check-audio').addEventListener('click', () => {
    const ok = $('#audioTime').value==='10:15' && $('#audioNeed').value==='The entrance to use';
    score.q2=ok;
    const f=$('#audioFeedback'); f.className=`feedback ${ok?'good':'bad'}`;
    f.textContent = practiceMode==='guided' ? (ok ? 'Correct — the key details are 10:15 and the entrance to use.' : 'Check the corrected arrival time and the final request in the message.') : 'Answers recorded for this practice.';
    updateMiniScore(); saveState();
  });
  function updateMiniScore(){ $('#miniScore').textContent=`${Number(score.q1)+Number(score.q2)} / 2 checked tasks`; }

  $$('.transcript-btn').forEach(btn => btn.addEventListener('click', () => {
    const t=btn.closest('.task-card').querySelector('.transcript'); t.classList.toggle('open'); btn.textContent=t.classList.contains('open')?'Hide transcript':'Show transcript';
  }));
  $$('.model-toggle').forEach(btn => btn.addEventListener('click',()=>{ const m=$('#'+btn.dataset.modelTarget); m.classList.toggle('open'); }));

  $$('.mode-switch button').forEach(btn=>btn.addEventListener('click',()=>{
    practiceMode=btn.dataset.mode; $$('.mode-switch button').forEach(b=>b.classList.toggle('active',b===btn));
    document.body.classList.toggle('exam-mode',practiceMode==='exam'); showToast(practiceMode==='guided'?'Guided help is on.':'Try without help mode is on.'); saveState();
  }));

  $('#resetPractice').addEventListener('click',()=>{
    score={q1:false,q2:false}; updateMiniScore();
    $$('.task-card .answers button').forEach(b=>b.classList.remove('correct','incorrect'));
    $$('.task-card .feedback').forEach(f=>{f.textContent='';f.className='feedback';});
    $('#audioTime').value=''; $('#audioNeed').value=''; saveState();
  });

  // Optional recording
  let mediaRecorder=null, chunks=[], stream=null;
  $('#recordBtn').addEventListener('click', async()=>{
    if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){ $('#recordingStatus').textContent='Recording is not supported here. Use the timer and speak aloud instead.'; return; }
    try{
      stream=await navigator.mediaDevices.getUserMedia({audio:true}); chunks=[]; mediaRecorder=new MediaRecorder(stream);
      mediaRecorder.ondataavailable=e=>chunks.push(e.data);
      mediaRecorder.onstop=()=>{ const blob=new Blob(chunks,{type:'audio/webm'}); const url=URL.createObjectURL(blob); const audio=$('#recordingPlayback'); audio.src=url; audio.hidden=false; stream.getTracks().forEach(t=>t.stop()); $('#recordingStatus').textContent='Practice recording ready — listen back once if useful.'; };
      mediaRecorder.start(); $('#recordBtn').disabled=true; $('#stopRecordBtn').disabled=false; $('#recordingStatus').textContent='Recording…';
    }catch(e){ $('#recordingStatus').textContent='Microphone permission was not available. Use the timer and speak aloud instead.'; }
  });
  $('#stopRecordBtn').addEventListener('click',()=>{ if(mediaRecorder && mediaRecorder.state!=='inactive') mediaRecorder.stop(); $('#recordBtn').disabled=false; $('#stopRecordBtn').disabled=true; });

  // Vocabulary
  const vocab = {
    culture:[
      ['🏛','heritage site','site patrimonial','a place protected or valued for its history or culture','This heritage site dates from the 18th century.'],
      ['🖼','artwork','œuvre d’art','a work created by an artist','This artwork is part of the permanent collection.'],
      ['🎨','exhibition','exposition','a public display of art or objects','The exhibition opens on Saturday.'],
      ['🏗','architecture','architecture','the design and style of buildings','The architecture reflects the history of the town.'],
      ['📚','collection','collection','a group of objects kept or displayed together','The museum has a large photography collection.'],
      ['🗿','sculpture','sculpture','a three-dimensional work of art','This sculpture was created in 1998.']
    ],
    visitors:[
      ['👋','welcome','bienvenue / accueillir','to greet someone in a friendly professional way','Welcome. How can I help you today?'],
      ['🎟','ticket desk','billetterie','the place where visitors buy or collect tickets','The ticket desk is near the main entrance.'],
      ['🧭','guided tour','visite guidée','a visit led by a guide','The guided tour starts at three o’clock.'],
      ['↗','first floor','premier étage','the level above the ground floor','The exhibition is on the first floor.'],
      ['🚪','entrance','entrée','the place where you enter','Please use the side entrance after 5 p.m.'],
      ['🕕','opening hours','horaires d’ouverture','the times when a place is open','You can find the opening hours on this leaflet.']
    ],
    projects:[
      ['🤝','partner','partenaire','a person or organisation you work with','We are working with an international partner.'],
      ['📅','schedule','planning / calendrier','a plan showing when activities happen','I’ll send you the updated schedule.'],
      ['📍','venue','lieu de l’événement','the place where an event happens','The venue can welcome 200 visitors.'],
      ['🎯','coordinate','coordonner','to organise different people or actions together','I coordinate the artists and technical teams.'],
      ['📢','promote','promouvoir','to make people aware of an event or project','We promote the event on social media.'],
      ['⏳','deadline','date limite','the latest time something must be finished','The deadline is next Friday.']
    ],
    phone:[
      ['☎','hold the line','ne quittez pas','to wait during a phone call','Could you hold the line for a moment?'],
      ['🔁','repeat','répéter','to say something again','Could you repeat that, please?'],
      ['🐢','speak more slowly','parler plus lentement','to reduce speaking speed','Could you speak a little more slowly, please?'],
      ['✓','confirm','confirmer','to say that information is correct','Let me confirm the date with you.'],
      ['💬','do you mean…?','vous voulez dire… ?','to check your understanding','Do you mean the morning visit?'],
      ['📝','take a message','prendre un message','to write information for another person','Can I take a message?']
    ],
    email:[
      ['✉','request','demande','a polite ask for information or action','Thank you for your request.'],
      ['📎','attachment','pièce jointe','a file sent with an email','Please find the programme attached.'],
      ['✅','confirm','confirmer','to state that something is arranged or correct','I’m writing to confirm our meeting.'],
      ['📆','available','disponible','free at a particular time','Are you available on Thursday afternoon?'],
      ['🙋','attend','assister à','to be present at an event or meeting','I will attend the opening.'],
      ['ℹ','information','information / renseignement','facts or details about something','Could you send me more information?']
    ],
    exam:[
      ['🔁','Could you repeat that, please?','Pouvez-vous répéter, s’il vous plaît ?','a polite clarification phrase','Could you repeat the last detail, please?'],
      ['🧩','Let me rephrase that.','Laissez-moi reformuler.','a phrase used to say something differently','Let me rephrase that in a simpler way.'],
      ['✓','Let me confirm…','Permettez-moi de confirmer…','a phrase used before checking key information','Let me confirm the date and time.'],
      ['💡','What I mean is…','Ce que je veux dire, c’est…','a phrase used to explain an idea more clearly','What I mean is that the tour is already full.'],
      ['⏳','First… then… finally…','D’abord… puis… enfin…','simple connectors for structure','First, welcome the group. Then, explain the route. Finally, answer questions.'],
      ['🛟','I’m not sure, but…','Je ne suis pas sûre, mais…','a safe way to keep communicating','I’m not sure, but I can check that information for you.']
    ]
  };
  function renderVocab(category){
    const grid=$('#vocabGrid'); grid.innerHTML='';
    vocab[category].forEach(([icon,en,fr,def,ex])=>{
      const card=document.createElement('article'); card.className='vocab-card';
      card.innerHTML=`<span class="v-icon">${icon}</span><h3>${en}</h3><div class="fr">${fr}</div><p>${def}</p><p class="example">“${ex}”</p><button type="button" class="listen-btn">▶ Listen</button>`;
      card.querySelector('button').addEventListener('click',()=>speak(`${en}. ${ex}`)); grid.appendChild(card);
    });
  }
  renderVocab('culture');
  $('#vocabCategory').addEventListener('change',e=>renderVocab(e.target.value));
  $('#vocabShuffle').addEventListener('click',()=>{ const cat=$('#vocabCategory').value; vocab[cat].sort(()=>Math.random()-.5); renderVocab(cat); });

  // Competencies from the first-course validation grid
  const competencies=[
    ['phone_familiar','A2.2 TÉLÉPHONE — Gérer des appels sur des sujets familiers','A TRAVAILLER PENDANT LA FORMATION'],
    ['phone_clarify','A2.2 TÉLÉPHONE — Demander des clarifications en cas de problème','A TRAVAILLER PENDANT LA FORMATION'],
    ['mail_reply','A2.2 MAILS — Répondre à des mails courants','A TRAVAILLER PENDANT LA FORMATION'],
    ['mail_formula','A2.2 MAILS — Utiliser des formules standard adaptées au contexte professionnel','A TRAVAILLER PENDANT LA FORMATION'],
    ['presentation','A2.2 PRÉSENTATIONS — Donner une présentation courte sur un sujet familier en utilisant un support visuel','A TRAVAILLER PENDANT LA FORMATION'],
    ['visitors','A2.2 ACCUEIL DE VISITEURS — Présenter des services ou équipements à un visiteur','A TRAVAILLER PENDANT LA FORMATION'],
    ['site','A2.2 VISITES DE SITES — Répondre à des questions simples sur le site visité','A TRAVAILLER PENDANT LA FORMATION'],
    ['social','A2.2 INTERACTIONS SOCIALES AU TRAVAIL — Entreprendre des échanges professionnels simples et poser des questions ouvertes','A TRAVAILLER PENDANT LA FORMATION'],
    ['hiring1','A2.2 EMBAUCHE — Participer à une simulation d’entretien structuré','NON CONCERNÉ'],
    ['hiring2','A2.2 EMBAUCHE — Poser des questions simples en tant que recruteur','NON CONCERNÉ'],
    ['meeting1','A2.2 RÉUNIONS — Formuler des idées simples dans une réunion structurée','NON CONCERNÉ'],
    ['meeting2','A2.2 RÉUNIONS — Comprendre des discussions sur des sujets familiers','NON CONCERNÉ'],
    ['video1','A2.2 VISIOCONFÉRENCE — Participer activement à une discussion en ligne','NON CONCERNÉ'],
    ['video2','A2.2 VISIOCONFÉRENCE — Poser des questions simples ou répondre à des instructions','NON CONCERNÉ'],
    ['negotiation','A2.2 NÉGOCIATION — Initier une négociation simple ou demander une alternative','NON CONCERNÉ'],
    ['reports','A2.2 RAPPORTS / COMPTES RENDUS / SYNTHÈSES — Produire un compte-rendu simple à partir d’informations données','NON CONCERNÉ'],
    ['translation','A2.2 TRADUCTIONS — Traduire des phrases courtes pour un contexte professionnel ou personnel simple','NON CONCERNÉ'],
    ['travel1','A2.2 VOYAGER — Expliquer des préférences de voyage','NON CONCERNÉ'],
    ['travel2','A2.2 VOYAGER — Demander des services spécifiques','NON CONCERNÉ']
  ];
  const statusOptions=['A TRAVAILLER PENDANT LA FORMATION','NON CONCERNÉ','DÉJÀ ACQUIS / À CONSOLIDER','À CONFIRMER'];
  function renderCompetencies(){
    const box=$('#competencyTable'); box.innerHTML='';
    competencies.forEach(([id,label,initial])=>{
      const row=document.createElement('div');row.className='validation-row';
      const opts=statusOptions.map(s=>`<option ${s===initial?'selected':''}>${s}</option>`).join('');
      row.innerHTML=`<label>${label}</label><select class="competency-select" data-id="${id}">${opts}</select>`;
      row.querySelector('select').addEventListener('change',saveState); box.appendChild(row);
    });
  }
  renderCompetencies();

  function getSelectedText(groupName){ const g=$(`[data-choice-group="${groupName}"]`); return $('.selected',g)?.dataset.value||''; }
  function getMulti(groupName){ const g=$(`[data-multi-group="${groupName}"]`); return $$('.selected',g).map(b=>b.dataset.value).join(', '); }
  function checkedPriorities(){ return $$('#priorityBoard input:checked').map(i=>i.value); }
  function summaryText(){
    const comp=$$('.competency-select').map(s=>`${s.previousElementSibling.textContent}: ${s.value}`).join('\n');
    const needs=[1,2,3,4,5,6,7,8].map(n=>$('#need'+n)?.value?.trim()).filter(Boolean).map((v,i)=>`${i+1}. ${v}`).join('\n');
    return `MIREILLE — LESSON 1 SYNTHESIS\nDate: 25/09/2026\nTrainer: ${$('#trainerSignature').value||'Tisha Douty'}\nProgramme: 19 hours | Starting point A2.1+ | Target A2.2 | LILATE preparation\n\nSTARTING POINT CONFIRMATION\n${getSelectedText('startingAccuracy')||'Not yet selected'}\n${$('#startingComment').value||''}\n\nCONFIRMED PRIORITIES\n${checkedPriorities().map(v=>'• '+v).join('\n')||'Not yet selected'}\n\nSUCCESS DEFINITION\n${$('#successDefinition').value||''}\n\nFIRST SITUATION TO HANDLE MORE EASILY\n${$('#urgentSituation').value||''}\n\nLEARNING PROFILE\nEasiest: ${getMulti('easiest')}\nHardest: ${getMulti('hardest')}\nHelps learning: ${getMulti('learningHelp')}\n\nGENTLE SPEAKING OBSERVATION\nWhat already works: ${$('#obsStrength').value||''}\nOne priority to build: ${$('#obsPriority').value||''}\nUseful phrase to recycle: ${$('#obsPhrase').value||''}\n\nFIRST-COURSE COMPETENCY VALIDATION\n${comp}\n\nNEEDS CONFIRMED / ADDED\n${needs}\n\nPROGRAMME ORIENTATION\nTop 3 priorities: ${$('#top3').value||''}\nLanguage points to secure: ${$('#languageSecure').value||''}\nRecommended next lesson: ${$('#nextLesson').value||''}\nAdditional notes: ${$('#trainerNotes').value||''}\n\nResources transmitted by: ${$('#resourcesBy').value||''}\nTrainer signature / initials: ${$('#trainerSignature').value||''}`;
  }
  function updateSummary(){ if($('#summaryPreview')) $('#summaryPreview').textContent=summaryText(); }

  function download(name, content, type='text/plain;charset=utf-8'){
    const blob=new Blob([content],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),500);
  }
  $('#downloadTxt').addEventListener('click',()=>download('Mireille_Lesson1_Synthesis.txt',summaryText()));
  $('#downloadBtn').addEventListener('click',()=>download('Mireille_Lesson1_Synthesis.txt',summaryText()));
  $('#downloadCsv').addEventListener('click',()=>{
    const rows=[['Field','Value'],['Date','25/09/2026'],['Starting point confirmation',getSelectedText('startingAccuracy')],['Confirmed priorities',checkedPriorities().join(' | ')],['Success definition',$('#successDefinition').value],['First situation',$('#urgentSituation').value],['Easiest',getMulti('easiest')],['Hardest',getMulti('hardest')],['Learning supports',getMulti('learningHelp')],['Top 3 priorities',$('#top3').value],['Language points',$('#languageSecure').value],['Next lesson',$('#nextLesson').value],['Trainer notes',$('#trainerNotes').value]];
    const csv=rows.map(r=>r.map(v=>'"'+String(v||'').replaceAll('"','""')+'"').join(',')).join('\n'); download('Mireille_Lesson1_Synthesis.csv',csv,'text/csv;charset=utf-8');
  });
  $('#copySummary').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summaryText());showToast('Synthesis copied.');}catch(e){showToast('Copy was blocked by the browser.');}});
  $('#printValidation').addEventListener('click',()=>window.print());
  $('#printBtn').addEventListener('click',()=>window.print());

  $('#resetAll').addEventListener('click',()=>{
    if(!confirm('Reset all notes and progress for this lesson?')) return;
    localStorage.removeItem(storageKey); location.reload();
  });

  function restoreState(){
    let st=null; try{st=JSON.parse(localStorage.getItem(storageKey));}catch(e){}
    if(!st){ updateSummary(); showSection(0); return; }
    const {fields={},choiceGroups={},multiGroups={},competency={},trainerView:tv,frOn:fr,practiceMode:pm,current:c,score:sc}=st;
    $$('[data-save]').forEach(el=>{ const key=el.id||el.name||el.value; if(!(key in fields)) return; if(el.type==='checkbox')el.checked=!!fields[key]; else el.value=fields[key]; });
    Object.entries(choiceGroups).forEach(([k,v])=>{ const g=$(`[data-choice-group="${k}"]`); if(g) $$('button',g).forEach(b=>b.classList.toggle('selected',b.dataset.value===v)); });
    Object.entries(multiGroups).forEach(([k,arr])=>{ const g=$(`[data-multi-group="${k}"]`); if(g) $$('button',g).forEach(b=>b.classList.toggle('selected',(arr||[]).includes(b.dataset.value))); });
    $$('.competency-select').forEach(sel=>{ if(competency[sel.dataset.id]) sel.value=competency[sel.dataset.id]; });
    trainerView=!!tv;frOn=!!fr;practiceMode=pm||'guided';score=sc||score;
    document.body.classList.toggle('trainer-view',trainerView);document.body.classList.toggle('show-fr',frOn);document.body.classList.toggle('exam-mode',practiceMode==='exam');
    $('#trainerToggle').textContent=`Trainer view: ${trainerView?'ON':'OFF'}`;$('#frToggle').textContent=`FR help: ${frOn?'ON':'OFF'}`;
    $$('.mode-switch button').forEach(b=>b.classList.toggle('active',b.dataset.mode===practiceMode));
    updateMiniScore();updateSummary();
    const allowed=visibleSections(); const target=sections[Math.min(Number(c)||0,sections.length-1)]; const pos=Math.max(0,allowed.indexOf(target)); showSection(pos);
  }

  // Save on most controls
  document.addEventListener('change',e=>{ if(e.target.matches('input,textarea,select')) saveState(); });
  restoreState();
})();
