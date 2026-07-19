(() => {
  const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
  const STORAGE_KEY='yanis_page_21_qualiopi_v1';
  const Speech={mode:'en-US',getVoices(){try{return window.speechSynthesis?.getVoices?.()||[]}catch(e){return[]}},pickVoice(){const v=this.getVoices();return v.find(x=>x.lang===this.mode)||v.find(x=>x.lang?.startsWith(this.mode.slice(0,2)))||v.find(x=>x.lang?.startsWith('en'))||null},say(text){if(!window.speechSynthesis||!text)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang=this.mode;u.rate=.96;u.pitch=1;const voice=this.pickVoice();if(voice)u.voice=voice;window.speechSynthesis.speak(u)},pause(){try{speechSynthesis.pause()}catch(e){}},resume(){try{speechSynthesis.resume()}catch(e){}},stop(){try{speechSynthesis.cancel()}catch(e){}}};
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=()=>Speech.getVoices();

  const Score={now:0,max:0,seen:new Set(),setMax(n){this.max=n;renderScore()},award(k,p=1){if(this.seen.has(k))return;this.seen.add(k);this.now+=p;renderScore()},reset(){this.now=0;this.seen.clear();renderScore()}};
  let attempted = new Set();
  let sectionStats = {};
  let manualStatus = {'scenario-writing':'not-started','guided-roleplay':'not-started','live-oral':'not-started','writing-ladder':'not-started'};

  const renderScore=()=>{ $('#scoreNow').textContent=Score.now; $('#scoreMax').textContent=Score.max; $('#progressBar').style.width=(Score.max?Math.round(Score.now/Score.max*100):0)+'%'; };
  const shuffle=a=>{const x=a.slice(); for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]} return x};
  const escapeHtml=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const normalize=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();

  const vocab = {
    announcements: [
      {w:'announcement', fr:'annonce', def:'a public message to passengers', ex:'The crew is making an announcement now.', emo:'📢'},
      {w:'boarding', fr:'embarquement', def:'the moment when passengers get on the aircraft', ex:'Boarding starts at 6:20 p.m.', emo:'🛫'},
      {w:'take-off', fr:'décollage', def:'the moment when the aircraft leaves the ground', ex:'We are preparing for take-off.', emo:'⬆️'},
      {w:'landing', fr:'atterrissage', def:'the moment when the aircraft comes down to the ground', ex:'We are preparing for landing.', emo:'🛬'},
      {w:'delay', fr:'retard', def:'extra waiting time before a flight or service', ex:'The flight is delayed.', emo:'⏰'},
      {w:'gate', fr:'porte d’embarquement', def:'the place where passengers board', ex:'Your new gate is A7.', emo:'🚪'}
    ],
    safety: [
      {w:'seatbelt', fr:'ceinture de sécurité', def:'the belt you fasten in your seat', ex:'Please fasten your seatbelt.', emo:'🪢'},
      {w:'tray table', fr:'tablette', def:'the small table attached to the seat', ex:'Please put your tray table up.', emo:'🪑'},
      {w:'seat back', fr:'dossier du siège', def:'the back part of the seat', ex:'Please put your seat back upright.', emo:'💺'},
      {w:'electronic devices', fr:'appareils électroniques', def:'phones, tablets, computers and similar devices', ex:'Please switch off your electronic devices.', emo:'📱'},
      {w:'emergency exit', fr:'sortie de secours', def:'a special exit used in an emergency', ex:'The emergency exits are located at the front and rear of the aircraft.', emo:'🚨'},
      {w:'safety card', fr:'carte de sécurité', def:'the card with safety instructions', ex:'Please read the safety card.', emo:'🪪'}
    ],
    procedures: [
      {w:'remain seated', fr:'rester assis', def:'stay in your seat', ex:'Please remain seated.', emo:'🪑'},
      {w:'fasten', fr:'attacher', def:'close and secure a belt', ex:'Please fasten your seatbelt.', emo:'🔒'},
      {w:'switch off', fr:'éteindre', def:'turn something off', ex:'Please switch off your phone.', emo:'⏻'},
      {w:'stow', fr:'ranger', def:'put something away safely', ex:'Please stow your bag under the seat.', emo:'🧳'},
      {w:'prepare', fr:'préparer', def:'get ready for something', ex:'We are preparing for take-off.', emo:'✅'},
      {w:'follow', fr:'suivre', def:'go after or obey', ex:'Please follow the crew’s instructions.', emo:'➡️'}
    ],
    emergencies: [
      {w:'turbulence', fr:'turbulences', def:'rough movement of the aircraft', ex:'We are experiencing turbulence.', emo:'🌪️'},
      {w:'life jacket', fr:'gilet de sauvetage', def:'a jacket used on water in an emergency', ex:'Your life jacket is under your seat.', emo:'🦺'},
      {w:'oxygen mask', fr:'masque à oxygène', def:'a mask used if the cabin pressure changes', ex:'The oxygen masks are dropping.', emo:'😷'},
      {w:'brace position', fr:'position de sécurité', def:'the body position used in an emergency landing', ex:'Please adopt the brace position.', emo:'🙇'},
      {w:'evacuate', fr:'évacuer', def:'leave the aircraft quickly in an emergency', ex:'The crew is telling passengers to evacuate.', emo:'🏃'},
      {w:'calm', fr:'calme', def:'not nervous or aggressive', ex:'Please stay calm and follow our instructions.', emo:'🫶'}
    ]
  };

  const mcq1 = [
    {q:'Best safety instruction?', a:'Please fasten your seatbelt.', choices:['Please fasten your seatbelt.','You fasten your seatbelt.','Seatbelt now.']},
    {q:'Best announcement phrase?', a:'We are preparing for take-off.', choices:['We are preparing for take-off.','We preparing take-off.','Prepare for the take-off now passengers.']},
    {q:'Best polite negative imperative?', a:'Please do not stand up now.', choices:['Please do not stand up now.','You no stand up now.','Not stand up now.']},
    {q:'Best instruction for phones?', a:'Please switch off your electronic devices.', choices:['Please switch off your electronic devices.','You switch off electronics.','Electronic devices off please now all.']}
  ];
  const fill1 = [
    {s:'Please ______ your seatbelt. (fasten)', answer:'fasten', hint:'Use an imperative verb.'},
    {s:'We are preparing for ______. (take-off)', answer:'take-off', hint:'Airport procedure vocabulary.'},
    {s:'Please ______ off your phone. (switch)', answer:'switch', hint:'The full phrase is switch off.'},
    {s:'The flight is ______. (delay)', answer:'delayed', hint:'Use be + past participle for the status now.'},
    {s:'Please remain ______. (seat)', answer:'seated', hint:'Use the status adjective.'},
    {s:'The oxygen ______ are dropping. (mask)', answer:'masks', hint:'Plural noun.'}
  ];
  const mcq2 = [
    {q:'Which sentence describes the current status now?', a:'Boarding is suspended.', choices:['Boarding is suspended.','Boarding has suspend.','Boarding suspend now.']},
    {q:'Best sentence about a gate?', a:'Your new gate is A7.', choices:['Your new gate is A7.','The gate is changed A7.','Gate changed is A7.']},
    {q:'Best delay sentence?', a:'The flight is delayed, so boarding will begin later.', choices:['The flight is delayed, so boarding will begin later.','The flight delayed because boarding later.','The flight is delaying so boarding later.']},
    {q:'Best emergency instruction?', a:'Please stay calm and follow our instructions.', choices:['Please stay calm and follow our instructions.','Stay calm and follow our instruction is.','You calm and follow.']}
  ];
  const seqTasks = [
    {items:['Finally, boarding will begin.','First, please show your boarding pass.','Then, wait near gate A7.','After that, listen for the boarding announcement.'], correct:['First, please show your boarding pass.','Then, wait near gate A7.','After that, listen for the boarding announcement.','Finally, boarding will begin.']},
    {items:['Then, please remain seated.','First, fasten your seatbelt.','Finally, the aircraft will depart.'], correct:['First, fasten your seatbelt.','Then, please remain seated.','Finally, the aircraft will depart.']}
  ];
  const modals = [
    {q:'Passengers ___ remain seated during turbulence.', a:'must', choices:['must','can','would like']},
    {q:'You ___ use your phone now.', a:'can’t', choices:['can’t','can','must to']},
    {q:'You ___ put your bag under the seat.', a:'need to', choices:['need to','must can','would like']},
    {q:'Families with children ___ board first.', a:'can', choices:['can','must to','are']}
  ];
  const builderTasks = [
    {target:'Please fasten your seatbelt now.', tokens:['Please','fasten','your','seatbelt','now.'], hint:'Start with Please + base verb.'},
    {target:'Ladies and gentlemen, we are preparing for landing.', tokens:['Ladies','and','gentlemen,','we','are','preparing','for','landing.'], hint:'Start with the greeting.'}
  ];
  const scenarios = {
    turbulence: {title:'Turbulence',text:'The aircraft is experiencing turbulence. You need to make a short announcement to the passengers.',facts:['Current situation: turbulence.','Passengers must remain seated.','Passengers must fasten seatbelts.'],model:'Ladies and gentlemen, we are experiencing turbulence. Please return to your seats and fasten your seatbelts. Thank you.',stronger:'Ladies and gentlemen, we are currently experiencing turbulence. Please return to your seats and fasten your seatbelts immediately. Please remain seated until the captain turns off the seatbelt sign. Thank you for your cooperation.'},
    takeoff: {title:'Preparing for take-off',text:'The doors are closed and the aircraft is ready to depart. Give a short take-off announcement.',facts:['The aircraft is preparing for take-off.','Passengers need to fasten seatbelts.','Passengers need to switch off devices or use airplane mode.'],model:'Good afternoon, ladies and gentlemen. We are preparing for take-off. Please fasten your seatbelts and switch off your electronic devices. Thank you.',stronger:'Good afternoon, ladies and gentlemen. Welcome on board. We are preparing for take-off. Please fasten your seatbelts, put your tray tables up, and switch off your electronic devices or place them in airplane mode. Thank you for your cooperation.'},
    delay: {title:'Delay announcement',text:'There is a delay because the gate is not ready. Inform the passengers clearly.',facts:['The flight is delayed.','Boarding will start later.','Passengers should wait near the gate.'],model:'Ladies and gentlemen, the flight is delayed. Boarding will start later. Please wait near the gate. Thank you for your patience.',stronger:'Ladies and gentlemen, we are sorry for the delay. The gate is not ready yet, so boarding will begin later than planned. Please remain near the gate and listen for further announcements. Thank you for your patience and understanding.'},
    emergency_row: {title:'Emergency-exit row reminder',text:'You need to remind passengers near the emergency exit about the rules.',facts:['Passenger is sitting in the emergency-exit row.','Passenger must follow crew instructions.','Passenger must be able to help in an emergency.'],model:'Good afternoon. You are sitting in the emergency-exit row. Please follow the crew’s instructions. In an emergency, you may need to help.',stronger:'Good afternoon. You are sitting in the emergency-exit row. Please listen carefully to the safety instructions and follow the crew’s directions at all times. In an emergency, you may need to assist, so please let me know if you have any questions.'}
  };
  const oralPrompts = {
    landing: {prompt:'Make a short landing announcement. Include seatbelts, tray tables, and seat backs.',checks:['Use a greeting.','Use an imperative.','Mention at least 3 cabin instructions.'],model:'Ladies and gentlemen, we are preparing for landing. Please fasten your seatbelts, put your tray tables up, and put your seat backs in the upright position. Thank you.'},
    devices: {prompt:'Tell the passengers what to do with their electronic devices before take-off.',checks:['Use polite instruction language.','Mention electronic devices clearly.','Sound calm and professional.'],model:'Ladies and gentlemen, please switch off your electronic devices or place them in airplane mode before take-off. Thank you.'},
    suspension: {prompt:'Boarding is suspended for a few minutes. Inform the passengers.',checks:['Describe the current status.','Use clear, short information.','Thank the passengers.'],model:'Ladies and gentlemen, boarding is currently suspended for a few minutes. Please wait near the gate for further information. Thank you for your patience.'}
  };

  const sectionDefinitions = [
    {id:'instructions',objective:'Give clear and polite cabin instructions',subject:'Imperatives and safety language',method:'QCM',max:mcq1.length},
    {id:'accuracy',objective:'Use key cabin words and forms accurately',subject:'Fill in the blank: instruction and status language',method:'Texte à trous',max:fill1.length},
    {id:'status',objective:'Describe the current status clearly',subject:'Be + past participle / current situation',method:'QCM',max:mcq2.length},
    {id:'sequence',objective:'Explain a short procedure in a logical order',subject:'Sequence markers and announcement builder',method:'Ordre des mots / procédure',max:seqTasks.length + builderTasks.length},
    {id:'modals',objective:'Use must / have to / need to / can / can’t correctly',subject:'Safety and procedure modals',method:'QCM',max:modals.length},
    {id:'writing-ladder',objective:'Write a short announcement with increasing complexity',subject:'Writing ladder',method:'Production écrite guidée',manual:true},
    {id:'scenario-writing',objective:'Respond to a realistic cabin situation in writing',subject:'Scenario lab',method:'Mise en situation écrite',manual:true},
    {id:'guided-roleplay',objective:'Give a realistic announcement with support',subject:'Guided roleplay',method:'Jeu de rôle guidé',manual:true},
    {id:'live-oral',objective:'Give instructions live and respond professionally',subject:'Live oral practice',method:'Mise en situation orale',manual:true}
  ];

  function ensureStats() {
    sectionDefinitions.forEach(s=>{ if(!s.manual && !sectionStats[s.id]) sectionStats[s.id]={correct:0,attempted:0,max:s.max}; });
  }
  function registerAttempt(id, section, isCorrect) {
    ensureStats();
    const st = sectionStats[section];
    if(st && !attempted.has(id)) { attempted.add(id); st.attempted++; }
    if(isCorrect && st && !Score.seen.has(id)) { st.correct++; Score.award(id); }
    saveState(false); renderEvaluation();
  }

  function setMax() { Score.setMax(mcq1.length + fill1.length + mcq2.length + seqTasks.length + modals.length + builderTasks.length); }

  function renderVocab(){
    const cats = Object.keys(vocab), sel = $('#vocabCategory');
    if(!sel.dataset.ready){ sel.innerHTML = cats.map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join(''); sel.dataset.ready='1';}
    const cat = sel.value || cats[0], grid = $('#vocabGrid');
    grid.innerHTML = '';
    vocab[cat].forEach((item, idx)=>{
      const card = document.createElement('div');
      card.className='vocabCard';
      card.innerHTML = `<div class="vocabTop"><div class="vocabWord">${escapeHtml(item.w)}</div><div class="vocabEmoji">${item.emo}</div></div>
      <div><strong>Translation:</strong> ${escapeHtml(item.fr)}</div>
      <div><strong>Definition:</strong> ${escapeHtml(item.def)}</div>
      <div><strong>Example:</strong> <em>${escapeHtml(item.ex)}</em></div>
      <button class="btn btn--ghost listenWord" data-idx="${idx}" type="button">🔊 Listen</button>`;
      grid.appendChild(card);
    });
    $$('.listenWord', grid).forEach(btn=>btn.addEventListener('click', e=>{ const item = vocab[cat][Number(e.currentTarget.dataset.idx)]; Speech.say(`${item.w}. ${item.ex}`); }));
  }

  function renderChoiceSet(hostId, items, awardPrefix, sectionId){
    const host = $(hostId); host.innerHTML='';
    items.forEach((m,i)=>{
      const box = document.createElement('div');
      box.className='card';
      box.innerHTML = `<div class="question">${i+1}. ${m.q}</div><div class="options"></div><div class="feedback hidden"></div>`;
      const options = box.querySelector('.options'), fb = box.querySelector('.feedback');
      shuffle(m.choices).forEach(choice=>{
        const btn = document.createElement('button');
        btn.className='optionBtn'; btn.type='button'; btn.textContent=choice;
        btn.addEventListener('click', ()=>{ const ok = choice===m.a; fb.className='feedback ' + (ok ? 'good' : 'bad'); fb.textContent = ok ? 'Correct!' : `Correct answer: ${m.a}`; registerAttempt(`${awardPrefix}-${i}`, sectionId, ok); });
        options.appendChild(btn);
      });
      host.appendChild(box);
    });
  }

  function renderFill(){
    const host = $('#fill1'); host.innerHTML='';
    fill1.forEach((f,i)=>{
      const box = document.createElement('div');
      box.className='card';
      box.innerHTML = `<div class="question">${i+1}. ${f.s}</div><div class="fillRow"><input class="inlineInput"/><button class="btn btn--ghost" type="button">Check</button><button class="btn btn--ghost" type="button">Hint</button></div><div class="feedback hidden"></div>`;
      const input = box.querySelector('input'), [checkBtn, hintBtn] = box.querySelectorAll('button'), fb = box.querySelector('.feedback');
      hintBtn.addEventListener('click', ()=>{ fb.className='feedback bad'; fb.textContent='Hint: ' + f.hint; });
      checkBtn.addEventListener('click', ()=>{ const ok = normalize(input.value)===normalize(f.answer); fb.className='feedback ' + (ok ? 'good' : 'bad'); fb.textContent = ok ? 'Correct!' : `Correct answer: ${f.answer}`; registerAttempt(`fill-${i}`, 'accuracy', ok); });
      host.appendChild(box);
    });
  }

  function renderSeq(){
    const host = $('#seqHost'); host.innerHTML='';
    seqTasks.forEach((task,i)=>{
      const box = document.createElement('div');
      box.className='card';
      box.innerHTML = `<div class="question">${i+1}. Put the procedure in the correct order.</div><div class="builderPrompt">Hint: start with the first logical step.</div><div class="builderBank"></div><div class="builderDrop"></div><div class="fillRow"><button class="btn btn--ghost" type="button">Check</button><button class="btn btn--ghost" type="button">Reset</button></div><div class="feedback hidden"></div>`;
      const bank = box.querySelector('.builderBank'), drop = box.querySelector('.builderDrop'), fb = box.querySelector('.feedback');
      const draw = ()=>{ bank.innerHTML=''; drop.innerHTML=''; fb.className='feedback hidden'; shuffle(task.items).forEach(tok=>{ const b=document.createElement('button'); b.type='button'; b.className='tokenBtn'; b.textContent=tok; b.addEventListener('click', ()=>{ const chip=document.createElement('button'); chip.type='button'; chip.className='tokenBtn tokenBtn--drop'; chip.textContent=tok; chip.addEventListener('click', ()=> chip.remove()); drop.appendChild(chip); b.disabled=true; }); bank.appendChild(b); }); };
      const [checkBtn, resetBtn] = box.querySelectorAll('.fillRow button');
      checkBtn.addEventListener('click', ()=>{ const built = Array.from(drop.querySelectorAll('.tokenBtn')).map(x=>x.textContent); const ok = JSON.stringify(built)===JSON.stringify(task.correct); fb.className='feedback ' + (ok ? 'good' : 'bad'); fb.textContent = ok ? 'Correct!' : 'Try again. Think about the order of actions.'; registerAttempt(`seq-${i}`, 'sequence', ok); });
      resetBtn.addEventListener('click', draw);
      draw();
      host.appendChild(box);
    });
  }

  function renderModals(){
    const host = $('#modalsHost'); host.innerHTML='';
    modals.forEach((m,i)=>{
      const box = document.createElement('div');
      box.className='card';
      box.innerHTML = `<div class="question">${i+1}. ${m.q}</div><div class="options"></div><div class="feedback hidden"></div>`;
      const options = box.querySelector('.options'), fb = box.querySelector('.feedback');
      shuffle(m.choices).forEach(choice=>{ const btn=document.createElement('button'); btn.className='optionBtn'; btn.type='button'; btn.textContent=choice; btn.addEventListener('click', ()=>{ const ok = choice===m.a; fb.className='feedback ' + (ok ? 'good' : 'bad'); fb.textContent = ok ? 'Correct!' : `Correct answer: ${m.a}`; registerAttempt(`modals-${i}`, 'modals', ok); }); options.appendChild(btn); });
      host.appendChild(box);
    });
  }

  function renderBuilder(){
    const host = $('#builderHost'); host.innerHTML='';
    builderTasks.forEach((task,i)=>{
      const box=document.createElement('div');
      box.className='card';
      box.innerHTML = `<div class="builderPrompt">Build the sentence. Hint: ${task.hint}</div><div class="builderBank"></div><div class="builderDrop"></div><div class="fillRow"><button class="btn btn--ghost" type="button">Check</button><button class="btn btn--ghost" type="button">Reset</button><button class="btn btn--ghost" type="button">Show model</button></div><div class="feedback hidden"></div>`;
      const bank=box.querySelector('.builderBank'), drop=box.querySelector('.builderDrop'), fb=box.querySelector('.feedback');
      const draw=()=>{ bank.innerHTML=''; drop.innerHTML=''; fb.className='feedback hidden'; shuffle(task.tokens).forEach(tok=>{ const b=document.createElement('button'); b.type='button'; b.className='tokenBtn'; b.textContent=tok; b.addEventListener('click', ()=>{ const chip=document.createElement('button'); chip.type='button'; chip.className='tokenBtn tokenBtn--drop'; chip.textContent=tok; chip.addEventListener('click', ()=> chip.remove()); drop.appendChild(chip); b.disabled=true; }); bank.appendChild(b); }); };
      const [checkBtn, resetBtn, modelBtn] = box.querySelectorAll('.fillRow button');
      checkBtn.addEventListener('click', ()=>{ const built = Array.from(drop.querySelectorAll('.tokenBtn')).map(x=>x.textContent).join(' ').replace(/\s+([?.!,])/g,'$1').trim(); const ok = normalize(built)===normalize(task.target); fb.className='feedback ' + (ok ? 'good' : 'bad'); fb.textContent = ok ? 'Correct!' : `Model: ${task.target}`; registerAttempt(`builder-${i}`, 'sequence', ok); });
      resetBtn.addEventListener('click', draw);
      modelBtn.addEventListener('click', ()=>{ fb.className='feedback good'; fb.textContent='Model: ' + task.target; });
      draw(); host.appendChild(box);
    });
  }

  function initWriting(){ $('#btnCheckWriting').addEventListener('click', ()=>{ const box = $('#writingChecklist'); box.classList.remove('hidden'); box.innerHTML = `<div class="step">✅ Did you use a greeting?</div><div class="step">✅ Did you describe the situation clearly?</div><div class="step">✅ Did you include at least one instruction?</div><div class="step">✅ Did you sound calm and professional?</div>`; }); }

  function initScenarios(){ const sel = $('#scenarioSelect'); sel.innerHTML = Object.entries(scenarios).map(([k,v])=>`<option value="${k}">${v.title}</option>`).join(''); function draw(){ const sc = scenarios[sel.value]; $('#scenarioText').textContent = sc.text; $('#scenarioFacts').innerHTML = sc.facts.map(f=>`<div class="step">${escapeHtml(f)}</div>`).join(''); $('#scenarioModel').textContent = 'Model answer: ' + sc.model; $('#scenarioStronger').textContent = 'Stronger version: ' + sc.stronger; $('#scenarioModel').classList.add('hidden'); $('#scenarioStronger').classList.add('hidden'); $('#scenarioResponse').value = ''; } sel.addEventListener('change', draw); draw(); $('#btnSpeakScenario').addEventListener('click', ()=> Speech.say($('#scenarioText').textContent)); $('#btnToggleModel').addEventListener('click', ()=>{ $('#scenarioModel').classList.toggle('hidden'); $('#scenarioStronger').classList.toggle('hidden'); }); }

  function initRoleplay(){ $('#rpModel').textContent = 'Model answer: Good afternoon, ladies and gentlemen. We are preparing for take-off. Please fasten your seatbelts and switch off your electronic devices. Thank you.'; $('#rpStronger').textContent = 'Stronger version: Good afternoon, ladies and gentlemen. Welcome on board. We are preparing for take-off. Please fasten your seatbelts, put your tray tables up, and switch off your electronic devices or place them in airplane mode. Thank you for your cooperation.'; $('#btnSpeakRP').addEventListener('click', ()=> Speech.say($('#rpPrompt').textContent)); $('#btnToggleRPModel').addEventListener('click', ()=>{ $('#rpModel').classList.toggle('hidden'); $('#rpStronger').classList.toggle('hidden'); }); }

  function initOral(){ const sel = $('#oralSelect'); sel.innerHTML = Object.entries(oralPrompts).map(([k,v])=>`<option value="${k}">${k.charAt(0).toUpperCase()+k.slice(1)}</option>`).join(''); function draw(){ const o = oralPrompts[sel.value]; $('#oralPrompt').textContent = o.prompt; $('#oralChecklist').innerHTML = o.checks.map(c=>`<div class="step">${escapeHtml(c)}</div>`).join(''); $('#oralModel').textContent = o.model; $('#oralModel').classList.add('hidden'); } sel.addEventListener('change', draw); draw(); $('#btnToggleOralModel').addEventListener('click', ()=> $('#oralModel').classList.toggle('hidden')); }

  function statusFromScore(correct,max,attemptedCount) { if(!attemptedCount) return 'not-started'; const pct=max?Math.round(correct/max*100):0; if(pct>=80) return 'achieved'; if(pct>=50) return 'progress'; return 'not-achieved'; }
  function statusLabel(s) { return {'achieved':'Objectif atteint','progress':'Objectif en cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[s] || s; }

  function renderEvaluation() {
    ensureStats();
    const rows = $('#evaluationRows'); if(!rows) return;
    rows.innerHTML = sectionDefinitions.map(d=> {
      if(d.manual) {
        const st = manualStatus[d.id] || 'not-started';
        return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class='score-mini'>Évaluation manuelle</td><td><span class='status ${st}'>${statusLabel(st)}</span></td></tr>`;
      }
      const s = sectionStats[d.id] || {correct:0,attempted:0,max:d.max};
      const st = statusFromScore(s.correct, s.max, s.attempted);
      const pct = s.max?Math.round(s.correct/s.max*100):0;
      return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class='score-mini'>${s.correct}/${s.max} — ${pct}%</td><td><span class='status ${st}'>${statusLabel(st)}</span></td></tr>`;
    }).join('');
    const completed = sectionDefinitions.filter(d=> d.manual ? (manualStatus[d.id]||'not-started')!=='not-started' : (sectionStats[d.id]?.attempted||0)>0).length;
    const rate = Math.round(completed/sectionDefinitions.length*100);
    $('#completionRate').textContent = rate + '%';
    const statuses = sectionDefinitions.map(d=> d.manual ? (manualStatus[d.id]||'not-started') : statusFromScore(sectionStats[d.id]?.correct||0, d.max, sectionStats[d.id]?.attempted||0));
    let overall='not-started';
    if(statuses.some(s=>s!=='not-started')) overall = statuses.every(s=>s==='achieved') ? 'achieved' : statuses.some(s=>s==='not-achieved') ? 'not-achieved' : 'progress';
    const os = $('#overallStatus'); os.textContent = statusLabel(overall); os.className = 'status ' + overall;
  }

  function collectState() { return {version:1,learner: $('#learnerName')?.value || 'Yanis Deschasset',trainer: $('#trainerName')?.value || '',date: $('#evaluationDate')?.value || '',sectionStats,manualStatus,scoreSeen:[...Score.seen],attempts:[...attempted],comments: $('#trainerComments')?.value || '',lastSaved: new Date().toISOString()}; }
  function saveState(showMessage=true) { const state = collectState(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); if($('#lastSaved')) $('#lastSaved').textContent = new Date(state.lastSaved).toLocaleString(); if(showMessage) alert('Progress saved in this browser. / Progression enregistrée dans ce navigateur.'); }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return;
      const s = JSON.parse(raw); sectionStats = s.sectionStats || {}; manualStatus = s.manualStatus || manualStatus; Score.seen = new Set(s.scoreSeen || []); attempted = new Set(s.attempts || []); Score.now = Score.seen.size; renderScore();
      if($('#learnerName') && s.learner) $('#learnerName').value = s.learner;
      if($('#trainerName') && s.trainer) $('#trainerName').value = s.trainer;
      if($('#evaluationDate') && s.date) $('#evaluationDate').value = s.date;
      if($('#trainerComments')) $('#trainerComments').value = s.comments || '';
      if($('#lastSaved') && s.lastSaved) $('#lastSaved').textContent = new Date(s.lastSaved).toLocaleString();
      $$('[data-manual]').forEach(sel => sel.value = manualStatus[sel.dataset.manual] || 'not-started');
    } catch(e) { console.warn('Could not load saved state', e); }
  }

  function reportRows() {
    ensureStats();
    return sectionDefinitions.map(d=> {
      if(d.manual) { const st = manualStatus[d.id] || 'not-started'; return [d.objective,d.subject,d.method,'Evaluation manuelle',statusLabel(st)]; }
      const s = sectionStats[d.id] || {correct:0,attempted:0,max:d.max};
      const st = statusFromScore(s.correct,s.max,s.attempted);
      const pct = s.max?Math.round(s.correct/s.max*100):0;
      return [d.objective,d.subject,d.method,`${s.correct}/${s.max} - ${pct}%`,statusLabel(st)];
    });
  }

  function getOverallReportData() { renderEvaluation(); return { learner: $('#learnerName')?.value || 'Yanis Deschasset', trainer: $('#trainerName')?.value || '', date: $('#evaluationDate')?.value || '', completion: $('#completionRate')?.textContent || '0%', overall: $('#overallStatus')?.textContent || 'Non commencé', comments: $('#trainerComments')?.value || '', rows: reportRows() }; }
  function safeFileName(s) { return String(s||'report').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,''); }
  function downloadBlob(blob,name) { const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1500); }
  function downloadReadableHTML() {
    saveState(false);
    const d=getOverallReportData();
    const rows=d.rows.map(r=>`<tr>${r.map(c=>`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
    const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - ${escapeHtml(d.learner)}</title><style>body{font-family:Arial,sans-serif;color:#222;max-width:1100px;margin:35px auto;padding:0 24px}h1{color:#24508f}h2{color:#112848}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}.comments{white-space:pre-wrap;min-height:80px}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Bilan d'evaluation des acquis - Qualiopi</h1><h2>Cabin announcements, safety instructions & procedure language</h2><div class="meta"><div class="box"><b>Apprenant:</b> ${escapeHtml(d.learner)}</div><div class="box"><b>Formatrice:</b> ${escapeHtml(d.trainer)}</div><div class="box"><b>Date:</b> ${escapeHtml(d.date)}</div><div class="box"><b>Completion:</b> ${escapeHtml(d.completion)}</div><div class="box"><b>Resultat global:</b> ${escapeHtml(d.overall)}</div></div><table><thead><tr><th>Objectif pedagogique</th><th>Support / sujet</th><th>Mode d'evaluation</th><th>Score</th><th>Resultat</th></tr></thead><tbody>${rows}</tbody></table><h2>Observations de la formatrice</h2><div class="box comments">${escapeHtml(d.comments)||'Aucune observation saisie.'}</div><p><small>Rapport genere depuis la page interactive. Les resultats restent egalement sauvegardes dans le navigateur utilise.</small></p></body></html>`;
    downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}), `${safeFileName(d.learner)}-Lesson-21-Bilan-Qualiopi.html`);
  }
  function latinText(s) { return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'\"').replace(/[–—]/g,'-').replace(/[^\x20-\x7E]/g,''); }
  function pdfEscape(s) { return latinText(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)'); }
  function wrapText(text,max=92) { const words=latinText(text).split(/\s+/); const lines=[]; let line=''; for(const w of words){ if(!w) continue; const next=line?line+' '+w:w; if(next.length>max && line){ lines.push(line); line=w; } else line=next; } if(line) lines.push(line); return lines.length?lines:['']; }
  function buildSimplePDF(d) {
    const pageW=595,pageH=842,left=42,top=800,bottom=45,lineH=14; let pages=[[]],y=top;
    function addLine(text,size=10,bold=false) { const wrapped=wrapText(text,size>=14?72:94); for(const ln of wrapped) { if(y<bottom){ pages.push([]); y=top; } pages[pages.length-1].push({text:ln,x:left,y,size,bold}); y -= size>=14?20:lineH; } }
    function gap(n=8){ y -= n; }
    addLine('BILAN D EVALUATION DES ACQUIS - QUALIOPI',17,true); addLine('Lesson 21 - Cabin Announcements & Safety English',12,true); gap(); addLine(`Apprenant: ${d.learner}`); addLine(`Formatrice: ${d.trainer}`); addLine(`Date: ${d.date}`); addLine(`Completion: ${d.completion} | Resultat global: ${d.overall}`); gap(12); d.rows.forEach((r,i)=>{ addLine(`${i+1}. Objectif: ${r[0]}`,11,true); addLine(`Support / sujet: ${r[1]}`); addLine(`Mode d evaluation: ${r[2]}`); addLine(`Score: ${r[3]} | Resultat: ${r[4]}`); gap(7); }); addLine('Observations de la formatrice',12,true); addLine(d.comments||'Aucune observation saisie.');
    const objs=[]; function obj(body){ objs.push(body); return objs.length; }
    const font1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'); const font2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'); const pageRefs=[], contentRefs=[];
    for(const lines of pages) { let stream=''; for(const l of lines) stream += `BT /${l.bold?'F2':'F1'} ${l.size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${pdfEscape(l.text)}) Tj ET\n`; contentRefs.push(obj(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`)); pageRefs.push(obj('PLACEHOLDER')); }
    const pagesRef=obj('PLACEHOLDER_PAGES'); pageRefs.forEach((ref,i)=>{ objs[ref-1]=`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`; }); objs[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(r=>r+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`; const catalog=obj(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);
    let out='%PDF-1.4\n%PDFREPORT\n', offsets=[0]; for(let i=0;i<objs.length;i++){ offsets.push(out.length); out += `${i+1} 0 obj\n${objs[i]}\nendobj\n`; } const xref=out.length; out += `xref\n0 ${objs.length+1}\n0000000000 65535 f \n`; for(let i=1;i<offsets.length;i++) out += String(offsets[i]).padStart(10,'0')+' 00000 n \n'; out += `trailer\n<< /Size ${objs.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`; return new Blob([new TextEncoder().encode(out)],{type:'application/pdf'});
  }
  function downloadPDFReport() { saveState(false); const d=getOverallReportData(); downloadBlob(buildSimplePDF(d), `${safeFileName(d.learner)}-Lesson-21-Bilan-Qualiopi.pdf`); }
  function plainSummaryText() { const d = getOverallReportData(); let text = `Qualiopi lesson summary\nLearner: ${d.learner}\nTrainer: ${d.trainer}\nDate: ${d.date}\nCompletion: ${d.completion}\nOverall result: ${d.overall}\n\n`; d.rows.forEach((r,i)=>{ text += `${i+1}. ${r[0]}\nSubject: ${r[1]}\nMethod: ${r[2]}\nScore: ${r[3]}\nResult: ${r[4]}\n\n`; }); text += `Trainer comments:\n${d.comments || 'No comments yet.'}`; return text; }
  async function copyResults() { const text = plainSummaryText(); try { await navigator.clipboard.writeText(text); alert('Results copied. You can paste them into an email. / Résultats copiés. Vous pouvez les coller dans un e-mail.'); } catch(e) { prompt('Copy the results below:', text); } }
  function prepareEmail() { const d = getOverallReportData(); const subject = encodeURIComponent(`Lesson 21 Qualiopi summary — ${d.learner}`); const body = encodeURIComponent(plainSummaryText()); window.location.href = `mailto:?subject=${subject}&body=${body}`; }
  function resetProgress() { if(!confirm('Reset all saved results for this lesson?')) return; localStorage.removeItem(STORAGE_KEY); location.reload(); }

  function initEvaluation() {
    ensureStats();
    if($('#evaluationDate') && !$('#evaluationDate').value) $('#evaluationDate').value = new Date().toISOString().slice(0,10);
    loadState();
    $$('[data-manual]').forEach(sel=> sel.onchange = ()=>{ manualStatus[sel.dataset.manual]=sel.value; saveState(false); renderEvaluation(); });
    if($('#trainerComments')) $('#trainerComments').oninput = ()=> saveState(false);
    if($('#learnerName')) $('#learnerName').onchange = ()=> saveState(false);
    if($('#trainerName')) $('#trainerName').onchange = ()=> saveState(false);
    if($('#evaluationDate')) $('#evaluationDate').onchange = ()=> saveState(false);
    $('#saveProgress').onclick = ()=> saveState(true);
    $('#downloadPdf').onclick = downloadPDFReport;
    $('#downloadHtml').onclick = downloadReadableHTML;
    $('#copySummary').onclick = copyResults;
    $('#emailSummary').onclick = prepareEmail;
    $('#printReport').onclick = ()=>{ saveState(false); window.print(); };
    $('#resetProgress').onclick = resetProgress;
    renderEvaluation();
  }

  function bind(){
    $('#btnStart').addEventListener('click', ()=> $('#main').scrollIntoView({behavior:'smooth'}));
    $('#btnListenIntro').addEventListener('click', ()=> Speech.say('In this lesson, you will practise cabin announcements, safety instructions, and procedure language.'));
    $$('.speakRule').forEach(btn => btn.addEventListener('click', ()=> Speech.say(btn.dataset.say)));
    $('#btnSpeakCategory').addEventListener('click', ()=>{ const cat = $('#vocabCategory').value; Speech.say(vocab[cat].map(x=>`${x.w}. ${x.ex}`).join(' ')); });
    $('#voiceUS').addEventListener('click', ()=>{Speech.mode='en-US';$('#voiceUS').classList.add('is-on');$('#voiceUK').classList.remove('is-on');});
    $('#voiceUK').addEventListener('click', ()=>{Speech.mode='en-GB';$('#voiceUK').classList.add('is-on');$('#voiceUS').classList.remove('is-on');});
    $('#btnPause').addEventListener('click', ()=> Speech.pause());
    $('#btnResume').addEventListener('click', ()=> Speech.resume());
    $('#btnStop').addEventListener('click', ()=> Speech.stop());
    $('#btnResetAll').addEventListener('click', ()=>{ Score.reset(); attempted = new Set(); ensureStats(); Object.keys(sectionStats).forEach(k=> sectionStats[k] = {correct:0,attempted:0,max:sectionStats[k].max}); renderVocab(); renderChoiceSet('#mcq1', mcq1, 'mcq1', 'instructions'); renderFill(); renderChoiceSet('#mcq2', mcq2, 'mcq2', 'status'); renderSeq(); renderChoiceSet('#modalsHost', modals, 'modals', 'modals'); renderBuilder(); $('#notesRules').value=''; $('#writingTry').value=''; $('#writingChecklist').classList.add('hidden'); initScenarios(); initRoleplay(); initOral(); renderEvaluation(); saveState(false); window.scrollTo({top:0, behavior:'smooth'}); });
    $('#vocabCategory').addEventListener('change', renderVocab);
  }

  function init() {
    $('#jsStatus').textContent='JS: ready';
    setMax();
    renderVocab(); renderChoiceSet('#mcq1', mcq1, 'mcq1', 'instructions'); renderFill(); renderChoiceSet('#mcq2', mcq2, 'mcq2', 'status'); renderSeq(); renderChoiceSet('#modalsHost', modals, 'modals', 'modals'); renderBuilder();
    initWriting(); initScenarios(); initRoleplay(); initOral(); bind(); initEvaluation();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
