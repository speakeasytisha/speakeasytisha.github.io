(() => {
  const $ = (s, e=document) => e.querySelector(s);
  const $$ = (s, e=document) => Array.from(e.querySelectorAll(s));
  const STORAGE_KEY = 'yanis_page_22_qualiopi_v1';

  const Speech = {
    mode:'en-US',
    getVoices(){ try { return window.speechSynthesis?.getVoices?.() || []; } catch(e){ return []; } },
    pickVoice(){
      const voices=this.getVoices();
      return voices.find(v=>v.lang===this.mode) ||
        voices.find(v=>v.lang?.startsWith(this.mode.slice(0,2))) ||
        voices.find(v=>v.lang?.startsWith('en')) || null;
    },
    say(text){
      if(!window.speechSynthesis || !text) return;
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(String(text));
      u.lang=this.mode; u.rate=.95; u.pitch=1;
      const v=this.pickVoice(); if(v) u.voice=v;
      window.speechSynthesis.speak(u);
    },
    pause(){ try{speechSynthesis.pause()}catch(e){} },
    resume(){ try{speechSynthesis.resume()}catch(e){} },
    stop(){ try{speechSynthesis.cancel()}catch(e){} }
  };
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=()=>Speech.getVoices();

  const Score = {
    now:0, max:0, seen:new Set(),
    setMax(n){ this.max=n; renderScore(); },
    award(key){ if(this.seen.has(key)) return; this.seen.add(key); this.now++; renderScore(); },
    reset(){ this.now=0; this.seen.clear(); renderScore(); }
  };
  const sectionStats = {};
  let manualStatus = {
    'listening-reformulation':'not-started',
    'incident-writing':'not-started',
    'scenario-lab':'not-started',
    'live-oral':'not-started'
  };

  const sectionDefinitions = [
    {id:'past-be', objective:'Use was / were accurately', subject:'Past simple of be', method:'QCM', max:6},
    {id:'regular-past', objective:'Form regular past verbs correctly', subject:'Regular verbs + -ed', method:'Texte à trous', max:6},
    {id:'irregular-past', objective:'Use key irregular airline verbs', subject:'Irregular past forms', method:'QCM', max:8},
    {id:'did-forms', objective:'Form past negatives and questions', subject:'Did / didn’t + base verb', method:'QCM / texte à trous', max:6},
    {id:'time-markers', objective:'Identify finished past time references', subject:'Past time markers', method:'QCM', max:5},
    {id:'timeline', objective:'Distinguish past event, current status and next step', subject:'Three-time method', method:'QCM', max:6},
    {id:'correction', objective:'Correct common past-simple mistakes', subject:'Error correction', method:'Correction guidée', max:6},
    {id:'builders', objective:'Build accurate incident sentences', subject:'Word order', method:'Ordre des mots', max:3},
    {id:'listening-reformulation', objective:'Collect and reformulate incident information', subject:'Listening and note-taking', method:'Mise en situation', manual:true},
    {id:'incident-writing', objective:'Write a structured incident report', subject:'Past event, status now and next step', method:'Production écrite', manual:true},
    {id:'scenario-lab', objective:'Explain an airline incident professionally', subject:'Guided incident scenarios', method:'Mise en situation écrite / orale', manual:true},
    {id:'live-oral', objective:'Report and respond live in a LILATE-style exchange', subject:'Live roleplay', method:'Mise en situation orale', manual:true}
  ];

  const vocab = {
    delays:[
      {w:'delay',fr:'retard',def:'extra waiting time before departure or arrival',ex:'The flight was delayed yesterday.',emo:'⏰'},
      {w:'cancelled',fr:'annulé',def:'not operating or not happening',ex:'The flight was cancelled because of bad weather.',emo:'❌'},
      {w:'miss a connection',fr:'rater une correspondance',def:'arrive too late for the next flight',ex:'The passenger missed the connection.',emo:'🔁'},
      {w:'arrive late',fr:'arriver en retard',def:'arrive after the planned time',ex:'The first flight arrived late.',emo:'🕒'},
      {w:'depart',fr:'partir / décoller',def:'leave an airport',ex:'The aircraft departed at 8:10 p.m.',emo:'🛫'},
      {w:'reschedule',fr:'reprogrammer',def:'arrange a new time or flight',ex:'The airline rescheduled the passenger.',emo:'📅'}
    ],
    baggage:[
      {w:'lost baggage',fr:'bagage perdu',def:'a bag that cannot be located',ex:'The passenger reported lost baggage.',emo:'🧳'},
      {w:'damaged',fr:'endommagé',def:'broken or harmed',ex:'The suitcase was damaged during the flight.',emo:'💥'},
      {w:'baggage claim',fr:'service / zone bagages',def:'the area where bags are collected or reported',ex:'The passenger went to baggage claim.',emo:'🛄'},
      {w:'leave behind',fr:'oublier / laisser derrière soi',def:'forget an object in a place',ex:'The passenger left the phone on the aircraft.',emo:'📱'},
      {w:'find',fr:'trouver',def:'locate something that was missing',ex:'The crew found the passport under the seat.',emo:'🔎'},
      {w:'report',fr:'signaler',def:'officially tell staff about a problem',ex:'She reported the missing bag at the desk.',emo:'📝'}
    ],
    passenger:[
      {w:'feel ill',fr:'se sentir malade',def:'not feel well',ex:'The passenger felt ill during the flight.',emo:'🤒'},
      {w:'fall',fr:'tomber',def:'move suddenly to the ground',ex:'A passenger fell in the aisle.',emo:'⚠️'},
      {w:'faint',fr:'s’évanouir',def:'lose consciousness for a short time',ex:'The passenger fainted near the galley.',emo:'😵'},
      {w:'call for assistance',fr:'demander de l’aide',def:'ask another person or team to help',ex:'The crew called for medical assistance.',emo:'🆘'},
      {w:'help',fr:'aider',def:'give support',ex:'A crew member helped the passenger.',emo:'🤝'},
      {w:'recover',fr:'se remettre',def:'feel better after a problem or illness',ex:'The passenger recovered after a few minutes.',emo:'💚'}
    ],
    communication:[
      {w:'ask',fr:'demander',def:'request information',ex:'The passenger asked about the next flight.',emo:'❓'},
      {w:'tell',fr:'dire / informer quelqu’un',def:'give information to a person',ex:'The agent told the passenger to wait.',emo:'💬'},
      {w:'explain',fr:'expliquer',def:'make information clear',ex:'The crew explained the procedure.',emo:'🗣️'},
      {w:'inform',fr:'informer',def:'give official or useful information',ex:'We informed the passengers about the delay.',emo:'📢'},
      {w:'check',fr:'vérifier',def:'look at information carefully',ex:'I checked the next available flight.',emo:'✅'},
      {w:'confirm',fr:'confirmer',def:'say that information is correct',ex:'The agent confirmed the new departure time.',emo:'✔️'}
    ]
  };

  const beQs = [
    {q:'The flight ___ delayed yesterday.', a:'was', choices:['was','were','is']},
    {q:'The passengers ___ worried.', a:'were', choices:['was','were','did']},
    {q:'I ___ at the gate this morning.', a:'was', choices:['was','were','am']},
    {q:'The bags ___ not on the carousel.', a:'were', choices:['was','were','did']},
    {q:'___ the passenger on the aircraft?', a:'Was', choices:['Was','Were','Did']},
    {q:'___ the crew members ready?', a:'Were', choices:['Was','Were','Did']}
  ];

  const regularQs = [
    {q:'The crew ______ the boarding pass. (check)', a:'checked', hint:'Most regular verbs add -ed.'},
    {q:'The flight ______ late. (arrive)', a:'arrived', hint:'The verb already ends in -e: add -d.'},
    {q:'We ______ the passengers. (inform)', a:'informed', hint:'Add -ed.'},
    {q:'The passenger ______ for assistance. (ask)', a:'asked', hint:'Add -ed.'},
    {q:'The agent ______ the bag. (carry)', a:'carried', hint:'Consonant + y becomes -ied.'},
    {q:'Boarding ______ at 6:20 p.m. (start)', a:'started', hint:'Add -ed.'}
  ];

  const irregularQs = [
    {q:'The passenger ___ to the wrong gate.', a:'went', choices:['went','goed','go']},
    {q:'The aircraft ___ at 8 p.m.', a:'left', choices:['left','leaved','leave']},
    {q:'The passenger ___ the boarding pass.', a:'lost', choices:['lost','losed','lose']},
    {q:'The crew ___ the bag under the seat.', a:'found', choices:['found','finded','find']},
    {q:'The agent ___ the passenger to wait.', a:'told', choices:['told','telled','tell']},
    {q:'The crew ___ clear instructions.', a:'gave', choices:['gave','gived','give']},
    {q:'The passenger ___ the wrong bus.', a:'took', choices:['took','taked','take']},
    {q:'The passenger ___ a seat problem.', a:'had', choices:['had','haved','have']}
  ];

  const didQs = [
    {q:'The bag ___ arrive.', a:"didn't", choices:["didn't","wasn't","doesn't"]},
    {q:'Did the passenger ___ the flight?', a:'miss', choices:['miss','missed','missing']},
    {q:'The passenger did not ___ the announcement.', a:'hear', choices:['hear','heard','hearing']},
    {q:'___ the crew find the passport?', a:'Did', choices:['Did','Was','Were']},
    {q:'No, the passenger ___.', a:"didn't", choices:["didn't","wasn't","doesn't"]},
    {q:'Did she ___ for assistance?', a:'ask', choices:['ask','asked','asks']}
  ];

  const timeQs = [
    {q:'The incident happened ___.', a:'yesterday', choices:['yesterday','now','tomorrow']},
    {q:'The passenger called two hours ___.', a:'ago', choices:['ago','next','later']},
    {q:'The flight arrived late ___ night.', a:'last', choices:['last','next','now']},
    {q:'Boarding started ___ 6:15 p.m.', a:'at', choices:['at','ago','last']},
    {q:'The bag arrived ___.', a:'this morning', choices:['this morning','next week','currently']}
  ];

  const timelineQs = [
    {q:'“The passenger missed the connection.”', a:'Past event', choices:['Past event','Situation now','Next step']},
    {q:'“The passenger is waiting at the transfer desk.”', a:'Situation now', choices:['Past event','Situation now','Next step']},
    {q:'“I will check the next available flight.”', a:'Next step', choices:['Past event','Situation now','Next step']},
    {q:'“The bag did not arrive.”', a:'Past event', choices:['Past event','Situation now','Next step']},
    {q:'“The bag is missing.”', a:'Situation now', choices:['Past event','Situation now','Next step']},
    {q:'“The baggage team will contact the passenger.”', a:'Next step', choices:['Past event','Situation now','Next step']}
  ];

  const correctionQs = [
    {wrong:'The passengers was worried.', correct:'The passengers were worried.', hint:'Passengers is plural.'},
    {wrong:'Did the passenger missed the flight?', correct:'Did the passenger miss the flight?', hint:'After did, use the base verb.'},
    {wrong:'The bag didn’t arrived.', correct:"The bag didn't arrive.", hint:'After didn’t, use the base verb.'},
    {wrong:'The crew finded the passport.', correct:'The crew found the passport.', hint:'Find is irregular.'},
    {wrong:'The agent telled the passenger to wait.', correct:'The agent told the passenger to wait.', hint:'Tell is irregular.'},
    {wrong:'The flight arrive late yesterday.', correct:'The flight arrived late yesterday.', hint:'Finished past action: regular verb + -ed.'}
  ];

  const builderTasks = [
    {target:'The passenger missed the connecting flight.', tokens:['The','passenger','missed','the','connecting','flight.'], hint:'Subject + past verb + object.'},
    {target:"The bag didn't arrive this morning.", tokens:['The','bag',"didn't",'arrive','this','morning.'], hint:"After didn't, use the base verb."},
    {target:'I will check the next available flight.', tokens:['I','will','check','the','next','available','flight.'], hint:'Subject + will + base verb.'}
  ];

  const listenings = {
    missed_connection:{
      title:'Missed connection',
      transcript:'Mr Green travelled from Paris to Madrid this morning. His first flight arrived forty minutes late, so he missed his connecting flight to Lisbon. He is now waiting at the transfer desk. The agent will check the next available flight.',
      questions:['Passenger: Mr Green','Route: Paris → Madrid → Lisbon','Past event: first flight arrived late; passenger missed connection','Situation now: waiting at transfer desk','Next step: agent will check next available flight'],
      model:'Mr Green travelled from Paris to Madrid this morning. His first flight arrived late, so he missed his connection to Lisbon. He is currently waiting at the transfer desk, and the agent will check the next available flight.'
    },
    missing_bag:{
      title:'Missing bag',
      transcript:'Ms Lopez arrived from Rome last night, but her checked bag did not arrive. She reported the problem at baggage claim. The bag is still missing, and the baggage team will contact her when they find it.',
      questions:['Passenger: Ms Lopez','Origin: Rome','Past event: checked bag did not arrive; she reported it','Situation now: bag is missing','Next step: baggage team will contact her'],
      model:'Ms Lopez arrived from Rome last night, but her checked bag did not arrive. She reported the problem at baggage claim. The bag is still missing, and the baggage team will contact her when they find it.'
    },
    medical:{
      title:'Medical incident',
      transcript:'During the flight, a passenger felt ill and fell in the aisle. A crew member helped him and called for medical assistance. The passenger is now feeling better and is resting in his seat.',
      questions:['Person: one passenger','Past event: felt ill and fell in aisle','Crew action: helped and called for assistance','Situation now: passenger feels better and is resting','Next step: continue to monitor the passenger'],
      model:'During the flight, a passenger felt ill and fell in the aisle. A crew member helped him and called for medical assistance. He is now feeling better and resting in his seat. The crew will continue to monitor him.'
    }
  };

  const scenarios = {
    wrong_gate:{
      title:'Wrong gate',
      prompt:'A passenger went to the wrong gate and missed the first boarding call. The passenger is now at the correct gate. Explain what happened and what happens next.',
      facts:['Past: went to wrong gate','Past: missed first boarding call','Now: at correct gate','Next: wait for final boarding call'],
      a2:'The passenger went to the wrong gate and missed the first call. He is now at the correct gate.',
      b1:'The passenger went to the wrong gate, so he missed the first boarding call. He is now waiting at the correct gate.',
      lilate:'The passenger went to the wrong gate and missed the first boarding call. He is currently waiting at the correct gate, and he will board when the final call begins.'
    },
    damaged_bag:{
      title:'Damaged baggage',
      prompt:'A passenger collected a damaged suitcase after the flight. The passenger reported it at baggage claim. Explain the situation and the next step.',
      facts:['Past: collected damaged suitcase','Past: reported problem','Now: waiting at baggage desk','Next: staff will complete a report'],
      a2:'The passenger found a damaged bag and reported the problem.',
      b1:'The passenger collected a damaged suitcase and reported it at baggage claim. She is waiting at the desk.',
      lilate:'The passenger collected a damaged suitcase after the flight and reported the problem at baggage claim. She is currently waiting at the desk, and the staff will complete a damage report for her.'
    },
    lost_passport:{
      title:'Lost passport on board',
      prompt:'A passenger lost a passport on the aircraft. The crew found it under a seat. Explain the incident and what you will do next.',
      facts:['Past: passenger lost passport','Past: crew found passport','Now: passport is safe','Next: verify identity and return it'],
      a2:'The passenger lost the passport, but the crew found it.',
      b1:'The passenger lost the passport on the aircraft, but the crew found it under a seat.',
      lilate:'The passenger lost the passport on the aircraft, but the crew found it under a seat. The passport is now safe. I will verify the passenger’s identity and return it to the correct person.'
    }
  };

  const oralPrompts = {
    connection:{
      title:'Missed connection',
      prompt:'Examiner: Tell me what happened to the passenger and explain the next step.',
      checks:['Use at least one past-simple verb.','Describe the situation now.','Give a clear next step.','Use because or so if possible.'],
      model:'The passenger missed the connecting flight because the first flight arrived late. He is currently waiting at the transfer desk, and I will check the next available flight for him.'
    },
    bag:{
      title:'Missing baggage',
      prompt:'Passenger: My suitcase did not arrive. What happened, and what will happen next?',
      checks:['Acknowledge the problem.','Use didn’t + base verb correctly.','Explain the current status.','Give a next step.'],
      model:"I’m sorry. Your suitcase didn’t arrive with the flight. It is currently missing, so I will contact the baggage team and complete a report for you."
    },
    medical:{
      title:'Medical report to a colleague',
      prompt:'Colleague: What happened to the passenger in the aisle?',
      checks:['Use past-simple incident verbs.','Explain what the crew did.','Say how the passenger is now.'],
      model:'The passenger felt ill and fell in the aisle. We helped him and called for medical assistance. He is now feeling better and resting in his seat.'
    }
  };

  function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  function normalize(s){ return String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim(); }
  function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function ensureStats(){ sectionDefinitions.forEach(s=>{ if(!s.manual && !sectionStats[s.id]) sectionStats[s.id]={correct:0,attempted:0,max:s.max}; }); }
  function renderScore(){ $('#scoreNow').textContent=Score.now; $('#scoreMax').textContent=Score.max; $('#progressBar').style.width=(Score.max?Math.round(Score.now/Score.max*100):0)+'%'; }
  function registerAttempt(key, section, ok){
    ensureStats();
    const st=sectionStats[section];
    if(st && !Score.seen.has('attempt:'+key)){ st.attempted++; Score.seen.add('attempt:'+key); }
    if(ok && st && !Score.seen.has(key)){ st.correct++; Score.award(key); }
    saveState(false); renderEvaluation();
  }

  function renderVocab(){
    const cats=Object.keys(vocab), sel=$('#vocabCategory');
    if(!sel.dataset.ready){ sel.innerHTML=cats.map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join(''); sel.dataset.ready='1'; }
    const cat=sel.value||cats[0], grid=$('#vocabGrid'); grid.innerHTML='';
    vocab[cat].forEach((v,i)=>{
      const card=document.createElement('article');
      card.className='vocabCard';
      card.innerHTML=`<div class="vocabTop"><div class="vocabWord">${escapeHtml(v.w)}</div><div class="vocabEmoji">${v.emo}</div></div>
      <div><strong>Translation:</strong> ${escapeHtml(v.fr)}</div>
      <div><strong>Definition:</strong> ${escapeHtml(v.def)}</div>
      <div><strong>Example:</strong> <em>${escapeHtml(v.ex)}</em></div>
      <button class="btn btn--ghost listenWord" data-i="${i}" type="button">🔊 Listen</button>`;
      grid.appendChild(card);
    });
    $$('.listenWord',grid).forEach(b=>b.onclick=()=>{const v=vocab[cat][Number(b.dataset.i)];Speech.say(`${v.w}. ${v.ex}`)});
  }

  function renderMCQ(hostId, data, section){
    const host=$(hostId); host.innerHTML='';
    data.forEach((item,i)=>{
      const box=document.createElement('div'); box.className='card';
      box.innerHTML=`<div class="question">${i+1}. ${escapeHtml(item.q)}</div><div class="options"></div><div class="feedback hidden"></div>`;
      const options=box.querySelector('.options'), fb=box.querySelector('.feedback');
      shuffle(item.choices).forEach(choice=>{
        const btn=document.createElement('button'); btn.type='button'; btn.className='optionBtn'; btn.textContent=choice;
        btn.onclick=()=>{
          const ok=choice===item.a;
          fb.className='feedback '+(ok?'good':'bad');
          fb.textContent=ok?'Correct!':`Correct answer: ${item.a}`;
          registerAttempt(section+'-'+i,section,ok);
        };
        options.appendChild(btn);
      });
      host.appendChild(box);
    });
  }

  function renderRegular(){
    const host=$('#regularHost'); host.innerHTML='';
    regularQs.forEach((item,i)=>{
      const box=document.createElement('div'); box.className='card';
      box.innerHTML=`<div class="question">${i+1}. ${escapeHtml(item.q)}</div>
      <div class="fillRow"><input class="inlineInput"><button class="btn btn--ghost check" type="button">Check</button><button class="btn btn--ghost hint" type="button">Hint</button></div>
      <div class="feedback hidden"></div>`;
      const input=box.querySelector('input'), fb=box.querySelector('.feedback');
      box.querySelector('.hint').onclick=()=>{fb.className='feedback bad';fb.textContent='Hint: '+item.hint};
      box.querySelector('.check').onclick=()=>{
        const ok=normalize(input.value)===normalize(item.a);
        fb.className='feedback '+(ok?'good':'bad');
        fb.textContent=ok?'Correct!':`Correct answer: ${item.a}`;
        registerAttempt('regular-'+i,'regular-past',ok);
      };
      host.appendChild(box);
    });
  }

  function renderCorrections(){
    const host=$('#correctionHost'); host.innerHTML='';
    correctionQs.forEach((item,i)=>{
      const box=document.createElement('div'); box.className='card';
      box.innerHTML=`<div class="question">${i+1}. Correct: <span class="bad">${escapeHtml(item.wrong)}</span></div>
      <textarea class="textarea answer" rows="2" placeholder="Write the corrected sentence..."></textarea>
      <div class="fillRow"><button class="btn btn--ghost check" type="button">Check</button><button class="btn btn--ghost hint" type="button">Hint</button><button class="btn btn--ghost modelBtn" type="button">Show model</button></div>
      <div class="feedback hidden"></div>`;
      const input=box.querySelector('.answer'), fb=box.querySelector('.feedback');
      box.querySelector('.hint').onclick=()=>{fb.className='feedback bad';fb.textContent='Hint: '+item.hint};
      box.querySelector('.modelBtn').onclick=()=>{fb.className='feedback good';fb.textContent='Model: '+item.correct};
      box.querySelector('.check').onclick=()=>{
        const ok=normalize(input.value)===normalize(item.correct);
        fb.className='feedback '+(ok?'good':'bad');
        fb.textContent=ok?'Correct!':`Model: ${item.correct}`;
        registerAttempt('correction-'+i,'correction',ok);
      };
      host.appendChild(box);
    });
  }

  function renderBuilders(){
    const host=$('#builderHost'); host.innerHTML='';
    builderTasks.forEach((task,i)=>{
      const box=document.createElement('div'); box.className='card';
      box.innerHTML=`<div class="builderPrompt">Sentence ${i+1}. Hint: ${escapeHtml(task.hint)}</div>
      <div class="builderBank"></div><div class="builderDrop"></div>
      <div class="fillRow"><button class="btn btn--ghost check" type="button">Check</button><button class="btn btn--ghost reset" type="button">Reset</button><button class="btn btn--ghost modelBtn" type="button">Show model</button></div>
      <div class="feedback hidden"></div>`;
      const bank=box.querySelector('.builderBank'), drop=box.querySelector('.builderDrop'), fb=box.querySelector('.feedback');
      function draw(){
        bank.innerHTML='';drop.innerHTML='';fb.className='feedback hidden';
        shuffle(task.tokens).forEach(tok=>{
          const b=document.createElement('button');b.type='button';b.className='tokenBtn';b.textContent=tok;
          b.onclick=()=>{
            const chip=document.createElement('button');chip.type='button';chip.className='tokenBtn tokenBtn--drop';chip.textContent=tok;
            chip.onclick=()=>{chip.remove();b.disabled=false};
            drop.appendChild(chip);b.disabled=true;
          };
          bank.appendChild(b);
        });
      }
      box.querySelector('.reset').onclick=draw;
      box.querySelector('.modelBtn').onclick=()=>{fb.className='feedback good';fb.textContent='Model: '+task.target};
      box.querySelector('.check').onclick=()=>{
        const built=Array.from(drop.querySelectorAll('.tokenBtn')).map(x=>x.textContent).join(' ').replace(/\s+([?.!,])/g,'$1').trim();
        const ok=normalize(built)===normalize(task.target);
        fb.className='feedback '+(ok?'good':'bad');fb.textContent=ok?'Correct!':`Model: ${task.target}`;
        registerAttempt('builder-'+i,'builders',ok);
      };
      draw();host.appendChild(box);
    });
  }

  function initListening(){
    const sel=$('#listeningSelect');
    sel.innerHTML=Object.entries(listenings).map(([k,v])=>`<option value="${k}">${v.title}</option>`).join('');
    function draw(){
      const l=listenings[sel.value];
      $('#listeningQuestions').innerHTML=l.questions.map(q=>`<div class="step">${escapeHtml(q)}</div>`).join('');
      $('#listeningTranscript').textContent='Transcript: '+l.transcript;
      $('#listeningModel').textContent='Model reformulation: '+l.model;
      $('#listeningTranscript').classList.add('hidden');$('#listeningModel').classList.add('hidden');$('#listeningNotes').value='';
    }
    sel.onchange=draw;draw();
    $('#btnListenScenario').onclick=()=>Speech.say(listenings[sel.value].transcript);
    $('#btnToggleTranscript').onclick=()=>$('#listeningTranscript').classList.toggle('hidden');
    $('#btnToggleListenModel').onclick=()=>$('#listeningModel').classList.toggle('hidden');
  }

  function initWriting(){
    $('#btnWritingChecklist').onclick=()=>{
      const box=$('#writingChecklist');box.classList.toggle('hidden');
      box.innerHTML=[
        'Did I explain what happened in the past?',
        'Did I use a correct past-simple verb?',
        'Did I describe the situation now?',
        'Did I explain the next step?',
        'Did I use because or so when useful?'
      ].map(x=>`<div class="step">✅ ${x}</div>`).join('');
    };
  }

  function initScenarios(){
    const sel=$('#scenarioSelect');
    sel.innerHTML=Object.entries(scenarios).map(([k,v])=>`<option value="${k}">${v.title}</option>`).join('');
    function draw(){
      const s=scenarios[sel.value];
      $('#scenarioPrompt').textContent=s.prompt;
      $('#scenarioFacts').innerHTML=s.facts.map(f=>`<div class="step">${escapeHtml(f)}</div>`).join('');
      $('#scenarioA2').textContent='A2 safe model: '+s.a2;
      $('#scenarioB1').textContent='B1 developed model: '+s.b1;
      $('#scenarioLilate').textContent='LILATE professional model: '+s.lilate;
      ['#scenarioA2','#scenarioB1','#scenarioLilate'].forEach(id=>$(id).classList.add('hidden'));
      $('#scenarioAnswer').value='';
    }
    sel.onchange=draw;draw();
    $('#btnSpeakScenario').onclick=()=>Speech.say(scenarios[sel.value].prompt);
    $('#btnToggleScenarioModels').onclick=()=>['#scenarioA2','#scenarioB1','#scenarioLilate'].forEach(id=>$(id).classList.toggle('hidden'));
  }

  function initOral(){
    const sel=$('#oralSelect');
    sel.innerHTML=Object.entries(oralPrompts).map(([k,v])=>`<option value="${k}">${v.title}</option>`).join('');
    function draw(){
      const o=oralPrompts[sel.value];
      $('#oralPrompt').textContent=o.prompt;
      $('#oralChecklist').innerHTML=o.checks.map(c=>`<div class="step">${escapeHtml(c)}</div>`).join('');
      $('#oralModel').textContent=o.model;$('#oralModel').classList.add('hidden');
    }
    sel.onchange=draw;draw();
    $('#btnToggleOralModel').onclick=()=>$('#oralModel').classList.toggle('hidden');
  }

  function statusFromScore(correct,max,attempted){
    if(!attempted) return 'not-started';
    const pct=max?Math.round(correct/max*100):0;
    if(pct>=80) return 'achieved';
    if(pct>=50) return 'progress';
    return 'not-achieved';
  }
  function statusLabel(s){return {'achieved':'Objectif atteint','progress':'Objectif en cours d’acquisition','not-achieved':'Objectif non atteint','not-started':'Non commencé'}[s]||s}
  function renderEvaluation(){
    ensureStats();
    const rows=$('#evaluationRows'); if(!rows) return;
    rows.innerHTML=sectionDefinitions.map(d=>{
      if(d.manual){
        const st=manualStatus[d.id]||'not-started';
        return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class="score-mini">Évaluation manuelle</td><td><span class="status ${st==='progress'?'progress-status':st}">${statusLabel(st)}</span></td></tr>`;
      }
      const s=sectionStats[d.id]||{correct:0,attempted:0,max:d.max};
      const st=statusFromScore(s.correct,s.max,s.attempted), pct=s.max?Math.round(s.correct/s.max*100):0;
      return `<tr><td>${d.objective}</td><td>${d.subject}</td><td>${d.method}</td><td class="score-mini">${s.correct}/${s.max} — ${pct}%</td><td><span class="status ${st==='progress'?'progress-status':st}">${statusLabel(st)}</span></td></tr>`;
    }).join('');
    const completed=sectionDefinitions.filter(d=>d.manual?(manualStatus[d.id]||'not-started')!=='not-started':(sectionStats[d.id]?.attempted||0)>0).length;
    $('#completionRate').textContent=Math.round(completed/sectionDefinitions.length*100)+'%';
    const statuses=sectionDefinitions.map(d=>d.manual?(manualStatus[d.id]||'not-started'):statusFromScore(sectionStats[d.id]?.correct||0,d.max,sectionStats[d.id]?.attempted||0));
    let overall='not-started';
    if(statuses.some(s=>s!=='not-started')) overall=statuses.every(s=>s==='achieved')?'achieved':statuses.some(s=>s==='not-achieved')?'not-achieved':'progress';
    const os=$('#overallStatus'); os.textContent=statusLabel(overall); os.className='status '+(overall==='progress'?'progress-status':overall);
  }

  function collectState(){
    return {
      learner:$('#learnerName')?.value||'Yanis Deschasset',
      trainer:$('#trainerName')?.value||'Tisha DOUTY-DOSIERE',
      date:$('#evaluationDate')?.value||'',
      score:Score.now, seen:[...Score.seen], sectionStats, manualStatus,
      comments:$('#trainerComments')?.value||'', lastSaved:new Date().toISOString()
    };
  }
  function saveState(show=true){
    const s=collectState(); localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
    $('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();
    if(show) alert('Progress saved in this browser. / Progression enregistrée dans ce navigateur.');
  }
  function loadState(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return;
      const s=JSON.parse(raw);
      Object.assign(sectionStats,s.sectionStats||{});
      manualStatus=Object.assign(manualStatus,s.manualStatus||{});
      Score.now=s.score||0; Score.seen=new Set(s.seen||[]);
      if(s.learner)$('#learnerName').value=s.learner;if(s.trainer)$('#trainerName').value=s.trainer;if(s.date)$('#evaluationDate').value=s.date;
      $('#trainerComments').value=s.comments||'';
      if(s.lastSaved)$('#lastSaved').textContent=new Date(s.lastSaved).toLocaleString();
      $$('[data-manual]').forEach(sel=>sel.value=manualStatus[sel.dataset.manual]||'not-started');
      renderScore();
    }catch(e){console.warn(e)}
  }

  function reportRows(){
    ensureStats();
    return sectionDefinitions.map(d=>{
      if(d.manual){const st=manualStatus[d.id]||'not-started';return[d.objective,d.subject,d.method,'Évaluation manuelle',statusLabel(st)]}
      const s=sectionStats[d.id]||{correct:0,attempted:0,max:d.max},st=statusFromScore(s.correct,s.max,s.attempted),pct=s.max?Math.round(s.correct/s.max*100):0;
      return[d.objective,d.subject,d.method,`${s.correct}/${s.max} - ${pct}%`,statusLabel(st)];
    });
  }
  function reportText(){
    renderEvaluation();
    const lines=[
      'Qualiopi lesson summary',
      `Learner: ${$('#learnerName').value}`,
      `Trainer: ${$('#trainerName').value}`,
      `Date: ${$('#evaluationDate').value}`,
      `Completion: ${$('#completionRate').textContent}`,
      `Overall result: ${$('#overallStatus').textContent}`,
      ''
    ];
    reportRows().forEach((r,i)=>{lines.push(`${i+1}. ${r[0]}`,`Subject: ${r[1]}`,`Method: ${r[2]}`,`Score: ${r[3]}`,`Result: ${r[4]}`,'')});
    lines.push('Trainer comments:', $('#trainerComments').value||'No comments yet.');
    return lines.join('\n');
  }
  async function copyResults(){
    const text=reportText();
    try{await navigator.clipboard.writeText(text);alert('Results copied. You can paste them into an email.');}
    catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('Results copied. You can paste them into an email.');}
  }
  function prepareEmail(){
    const subject=encodeURIComponent('Yanis Deschasset — Lesson 22 Qualiopi results');
    const body=encodeURIComponent(reportText());
    window.location.href=`mailto:?subject=${subject}&body=${body}`;
  }
  function downloadReadable(){
    const rows=reportRows().map(r=>`<tr>${r.map(c=>`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
    const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi — Yanis Lesson 22</title><style>body{font-family:Arial,sans-serif;max-width:1100px;margin:30px auto;padding:0 20px;color:#222}table{border-collapse:collapse;width:100%}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.box{border:1px solid #bbb;border-radius:8px;padding:10px;margin:10px 0;white-space:pre-wrap}</style></head><body><h1>Bilan d’évaluation des acquis — Qualiopi</h1><h2>Lesson 22 — Past incidents, current status and next steps</h2><p><b>Learner:</b> ${escapeHtml($('#learnerName').value)}<br><b>Trainer:</b> ${escapeHtml($('#trainerName').value)}<br><b>Date:</b> ${escapeHtml($('#evaluationDate').value)}<br><b>Completion:</b> ${escapeHtml($('#completionRate').textContent)}<br><b>Overall:</b> ${escapeHtml($('#overallStatus').textContent)}</p><table><thead><tr><th>Objectif</th><th>Support</th><th>Mode</th><th>Score</th><th>Résultat</th></tr></thead><tbody>${rows}</tbody></table><h2>Trainer comments</h2><div class="box">${escapeHtml($('#trainerComments').value||'No comments yet.')}</div></body></html>`;
    const blob=new Blob([html],{type:'text/html;charset=utf-8'}),a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download='Yanis-Deschasset-Lesson-22-Bilan-Qualiopi.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }

  function initEvaluation(){
    ensureStats();
    if(!$('#evaluationDate').value)$('#evaluationDate').value=new Date().toISOString().slice(0,10);
    loadState();
    $$('[data-manual]').forEach(sel=>sel.onchange=()=>{manualStatus[sel.dataset.manual]=sel.value;saveState(false);renderEvaluation()});
    ['#learnerName','#trainerName','#evaluationDate','#trainerComments'].forEach(id=>$(id).addEventListener('change',()=>saveState(false)));
    $('#saveProgress').onclick=()=>saveState(true);
    $('#downloadHtml').onclick=downloadReadable;
    $('#copySummary').onclick=copyResults;
    $('#emailSummary').onclick=prepareEmail;
    $('#printReport').onclick=()=>{saveState(false);window.print()};
    $('#resetProgress').onclick=()=>{if(confirm('Reset all saved results for this lesson?')){localStorage.removeItem(STORAGE_KEY);location.reload()}};
    renderEvaluation();
  }

  function bind(){
    $('#btnStart').onclick=()=>$('#main').scrollIntoView({behavior:'smooth'});
    $('#btnListenIntro').onclick=()=>Speech.say('This lesson introduces the past simple to report airline incidents and explain the next step.');
    $$('.speakRule').forEach(b=>b.onclick=()=>Speech.say(b.dataset.say));
    $('#voiceUS').onclick=()=>{Speech.mode='en-US';$('#voiceUS').classList.add('is-on');$('#voiceUK').classList.remove('is-on')};
    $('#voiceUK').onclick=()=>{Speech.mode='en-GB';$('#voiceUK').classList.add('is-on');$('#voiceUS').classList.remove('is-on')};
    $('#btnPause').onclick=()=>Speech.pause();$('#btnResume').onclick=()=>Speech.resume();$('#btnStop').onclick=()=>Speech.stop();
    $('#vocabCategory').onchange=renderVocab;
    $('#btnSpeakCategory').onclick=()=>{const c=$('#vocabCategory').value;Speech.say(vocab[c].map(v=>`${v.w}. ${v.ex}`).join(' '))};
    $('#btnResetAll').onclick=()=>{Score.reset();renderMCQ('#beHost',beQs,'past-be');renderRegular();renderMCQ('#irregularHost',irregularQs,'irregular-past');renderMCQ('#didHost',didQs,'did-forms');renderMCQ('#timeHost',timeQs,'time-markers');renderMCQ('#timelineHost',timelineQs,'timeline');renderCorrections();renderBuilders();renderVocab();$('#grammarNotes').value='';$('#writingTry').value='';window.scrollTo({top:0,behavior:'smooth'});};
  }

  function init(){
    $('#jsStatus').textContent='JS: ready';
    Score.setMax(beQs.length+regularQs.length+irregularQs.length+didQs.length+timeQs.length+timelineQs.length+correctionQs.length+builderTasks.length);
    ensureStats();
    renderVocab();
    renderMCQ('#beHost',beQs,'past-be');
    renderRegular();
    renderMCQ('#irregularHost',irregularQs,'irregular-past');
    renderMCQ('#didHost',didQs,'did-forms');
    renderMCQ('#timeHost',timeQs,'time-markers');
    renderMCQ('#timelineHost',timelineQs,'timeline');
    renderCorrections();
    renderBuilders();
    initListening();initWriting();initScenarios();initOral();bind();initEvaluation();
  }
  document.addEventListener('DOMContentLoaded',init);
})();