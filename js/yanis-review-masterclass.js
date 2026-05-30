(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  const score = {now:0, max:0, seen:new Set()};
  const updateScore=()=>{ $('#scoreNow').textContent=score.now; $('#scoreMax').textContent=score.max; };
  const award=(id)=>{ if(score.seen.has(id)) return; score.seen.add(id); score.now+=1; updateScore(); };
  const setScoreMax=(n)=>{ score.max=n; updateScore(); };

  const Speech = {
    lang:'en-US',
    getVoice(){
      const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
      return voices.find(v=>v.lang===this.lang) || voices.find(v=>v.lang.startsWith(this.lang.slice(0,2))) || null;
    },
    speak(text){
      if(!window.speechSynthesis) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = this.lang;
      const v = this.getVoice(); if(v) u.voice=v;
      u.rate = 0.96;
      speechSynthesis.speak(u);
    },
    pause(){ try{speechSynthesis.pause();}catch(e){} },
    resume(){ try{speechSynthesis.resume();}catch(e){} },
    stop(){ try{speechSynthesis.cancel();}catch(e){} }
  };
  if(window.speechSynthesis){ speechSynthesis.onvoiceschanged = ()=>Speech.getVoice(); }

  const randomizeOptions = (row) => {
    const correctText = row.options[row.answer];
    const opts = row.options.map((text,i)=>({text, correct:text===correctText && i===row.answer}));
    for(let i=opts.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [opts[i],opts[j]]=[opts[j],opts[i]]; }
    return opts;
  };

  const showFeedback = (fb, ok, text) => {
    fb.className = `feedback ${ok ? 'ok':'no'}`;
    fb.textContent = text;
    fb.classList.remove('hidden');
  };

  function renderFill(hostId, rows){
    const host = document.getElementById(hostId); if(!host) return;
    host.innerHTML='';
    rows.forEach(row=>{
      const wrap=document.createElement('div');
      wrap.className='fill-row';
      const options=[...row.options];
      // randomize but keep answer text
      for(let i=options.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [options[i],options[j]]=[options[j],options[i]]; }
      wrap.innerHTML=`<strong>${row.prompt}</strong>
        <select class="fill-select"><option value="">Choose…</option>${options.map(opt=>`<option>${opt}</option>`).join('')}</select>
        <div class="feedback hidden"></div>`;
      const select=$('select', wrap), fb=$('.feedback', wrap);
      select.addEventListener('change', ()=>{
        const ok = select.value===row.answer;
        showFeedback(fb, ok, ok ? `✅ Correct. ${row.explain}` : `❌ Try again. ${row.explain}`);
        if(ok) award(row.id);
      });
      host.appendChild(wrap);
    });
  }

  function renderQuiz(hostId, rows){
    const host=document.getElementById(hostId); if(!host) return;
    host.innerHTML='';
    rows.forEach(row=>{
      const wrap=document.createElement('div');
      wrap.className='quiz-row';
      const shuffled = randomizeOptions(row);
      wrap.innerHTML=`<strong>${row.question}</strong><div class="option-list"></div><div class="feedback hidden"></div>`;
      const list=$('.option-list', wrap), fb=$('.feedback', wrap);
      shuffled.forEach(opt=>{
        const btn=document.createElement('button');
        btn.type='button'; btn.className='option-btn'; btn.textContent=opt.text;
        btn.addEventListener('click', ()=>{
          const ok=opt.correct;
          showFeedback(fb, ok, ok ? `✅ Correct. ${row.explain}` : `❌ Not quite. ${row.explain}`);
          if(ok) award(row.id);
        });
        list.appendChild(btn);
      });
      host.appendChild(wrap);
    });
  }

  const introFill = [
    {id:'intro-1', prompt:'I work ___ a receptionist.', options:['as','in','on'], answer:'as', explain:'We say work as + job.'},
    {id:'intro-2', prompt:'I use English ___ the phone.', options:['on','in','at'], answer:'on', explain:'The fixed expression is on the phone.'},
    {id:'intro-3', prompt:'I reply ___ emails.', options:['to','at','for'], answer:'to', explain:'We say reply to emails.'},
    {id:'intro-4', prompt:'I would like to become ___ steward.', options:['a','an','the'], answer:'a', explain:'Use a before steward.'}
  ];

  const grammarA = [
    {id:'ga-1', prompt:'Choose the best sentence.', options:['I work as a receptionist.','I am working a receptionist.','I work like receptionist.'], answer:'I work as a receptionist.', explain:'Use the present simple to describe your job.'}
  ];
  const grammarB = [
    {id:'gb-1', question:'Choose the correct question.', options:['Do you use English at work?','You do use English at work?','Does you use English at work?'], answer:0, explain:'Use do + subject + base verb.'},
    {id:'gb-2', question:'Choose the correct negative.', options:['I do not answer the phone every day.','I not answer the phone every day.','I does not answer the phone every day.'], answer:0, explain:'Use do not + base verb.'}
  ];
  const grammarC = [
    {id:'gc-1', prompt:'I work in ___ hotel.', options:['a','an','the'], answer:'a', explain:'Hotel begins with a consonant sound.'},
    {id:'gc-2', prompt:'I answer ___ phone.', options:['the','a','an'], answer:'the', explain:'We say answer the phone.'}
  ];
  const grammarD = [
    {id:'gd-1', prompt:'I speak ___ passengers.', options:['to','on','for'], answer:'to', explain:'We say speak to passengers.'},
    {id:'gd-2', prompt:'I use English ___ email.', options:['by','on','in'], answer:'by', explain:'We say by email.'}
  ];
  const grammarE = [
    {id:'ge-1', question:'Choose the correct sentence.', options:['The passenger is calm.','The passenger is calmly.','The passenger calmly is.'], answer:0, explain:'Calm is an adjective.'},
    {id:'ge-2', question:'Choose the correct sentence.', options:['The steward speaks calmly.','The steward speaks calm.','The steward calm speaks.'], answer:0, explain:'Calmly is an adverb.'}
  ];
  const grammarMixed = [
    {id:'gm-1', question:'Choose the best sentence.', options:['I use English on the phone.','I use English in the phone.','I use English by the phone.'], answer:0, explain:'The correct chunk is on the phone.'},
    {id:'gm-2', question:'Choose the correct question.', options:['Do you work at reception?','You work at reception?','Does you work at reception?'], answer:0, explain:'Use do + subject + base verb.'},
    {id:'gm-3', question:'Choose the correct article.', options:['I work in a three-star hotel.','I work in three-star hotel.','I work in an three-star hotel.'], answer:0, explain:'Use a before three-star hotel.'},
    {id:'gm-4', question:'Choose the correct pair.', options:['a calm passenger / speak calmly','a calmly passenger / speak calm','a calm passenger / speak calm'], answer:0, explain:'Adjective for noun, adverb for verb.'},
    {id:'gm-5', question:'Choose the correct preposition.', options:['reply to emails','reply at emails','reply on emails'], answer:0, explain:'The fixed chunk is reply to emails.'}
  ];

  const vocab = [
    {cat:'job', icon:'🧑‍💼', term:'receptionist', fr:'réceptionniste', def:'A person who welcomes guests and helps them at reception.', ex:'I work as a receptionist in a three-star hotel.'},
    {cat:'job', icon:'👋', term:'welcome guests', fr:'accueillir les clients', def:'To greet guests and help them when they arrive.', ex:'My main duties include welcoming guests.'},
    {cat:'job', icon:'📧', term:'reply to emails', fr:'répondre aux e-mails', def:'To answer messages by email.', ex:'I reply to emails every day.'},
    {cat:'job', icon:'☎️', term:'answer the phone', fr:'répondre au téléphone', def:'To take phone calls and speak to customers.', ex:'I answer the phone at reception.'},
    {cat:'job', icon:'🗣️', term:'use English on the phone', fr:'utiliser l’anglais au téléphone', def:'To speak English during phone calls.', ex:'I sometimes use English on the phone.'},
    {cat:'job', icon:'💻', term:'use English by email', fr:'utiliser l’anglais par e-mail', def:'To write in English in emails.', ex:'I more often use English by email.'},
    {cat:'job', icon:'📝', term:'make reservations', fr:'faire des réservations', def:'To book rooms or services for customers.', ex:'I make reservations for customers.'},
    {cat:'job', icon:'🛎️', term:'guest', fr:'client / hôte', def:'A person staying in a hotel.', ex:'I welcome guests at the front desk.'},
    {cat:'job', icon:'👤', term:'customer', fr:'client', def:'A person who buys or uses a service.', ex:'I help customers every day.'},
    {cat:'job', icon:'🏨', term:'front desk', fr:'réception', def:'The main reception area in a hotel.', ex:'I work at the front desk.'},

    {cat:'airport', icon:'🛫', term:'airport', fr:'aéroport', def:'A place where planes arrive and leave.', ex:'He works at the airport.'},
    {cat:'airport', icon:'🎫', term:'boarding pass', fr:'carte d’embarquement', def:'The ticket document used to board the plane.', ex:'Please show me your boarding pass.'},
    {cat:'airport', icon:'🛂', term:'passport', fr:'passeport', def:'An official document used for international travel.', ex:'The passenger needs a passport.'},
    {cat:'airport', icon:'🧳', term:'luggage', fr:'bagages', def:'Bags and suitcases for travel.', ex:'Please keep your luggage with you.'},
    {cat:'airport', icon:'⚖️', term:'baggage allowance', fr:'franchise bagage', def:'The amount of baggage a passenger can take.', ex:'The passenger has a question about the baggage allowance.'},
    {cat:'airport', icon:'🪪', term:'check-in desk', fr:'comptoir d’enregistrement', def:'The place where passengers check in.', ex:'Please go to the check-in desk.'},
    {cat:'airport', icon:'🔎', term:'security check', fr:'contrôle de sécurité', def:'The place where passengers and bags are checked.', ex:'The security check is on the left.'},
    {cat:'airport', icon:'🧭', term:'terminal', fr:'terminal', def:'A building area in the airport.', ex:'Your flight leaves from Terminal 2.'},
    {cat:'airport', icon:'📋', term:'departure board', fr:'tableau des départs', def:'The screen with flight information.', ex:'Please check the departure board.'},
    {cat:'airport', icon:'🛬', term:'departures', fr:'départs', def:'Flights that are leaving the airport.', ex:'Follow the signs to departures.'},

    {cat:'plane', icon:'✈️', term:'plane', fr:'avion', def:'A vehicle that flies in the air.', ex:'The plane is ready for boarding.'},
    {cat:'plane', icon:'🧑‍✈️', term:'cabin crew', fr:'personnel de cabine', def:'The staff who work on board the plane.', ex:'The cabin crew will help you.'},
    {cat:'plane', icon:'💺', term:'seat', fr:'siège', def:'The place where a passenger sits on the plane.', ex:'Your seat is 14A.'},
    {cat:'plane', icon:'↔️', term:'aisle', fr:'allée', def:'The space between the rows of seats.', ex:'Please keep the aisle clear.'},
    {cat:'plane', icon:'🧷', term:'seatbelt', fr:'ceinture de sécurité', def:'The belt you fasten in your seat.', ex:'Please fasten your seatbelt.'},
    {cat:'plane', icon:'🗄️', term:'overhead bin', fr:'compartiment à bagages', def:'The storage space above the seats.', ex:'Put your bag in the overhead bin.'},
    {cat:'plane', icon:'📢', term:'announcement', fr:'annonce', def:'A public message for passengers.', ex:'Please listen to the safety announcement.'},
    {cat:'plane', icon:'🍽️', term:'special meal', fr:'repas spécial', def:'A meal requested for a passenger.', ex:'Your special meal is confirmed.'},

    {cat:'gate', icon:'🚪', term:'gate', fr:'porte d’embarquement', def:'The place where passengers wait and board.', ex:'Your gate is B12.'},
    {cat:'gate', icon:'⏰', term:'boarding time', fr:'heure d’embarquement', def:'The time when passengers start boarding.', ex:'Boarding time is 6:15 p.m.'},
    {cat:'gate', icon:'🔁', term:'gate change', fr:'changement de porte', def:'A change to the gate number.', ex:'There is a gate change for your flight.'},
    {cat:'gate', icon:'🚶', term:'boarding', fr:'embarquement', def:'The process of getting on the plane.', ex:'Boarding starts soon.'},
    {cat:'gate', icon:'📣', term:'final call', fr:'dernier appel', def:'The last message before the gate closes.', ex:'This is the final call for boarding.'},
    {cat:'gate', icon:'👥', term:'queue', fr:'file d’attente', def:'A line of people waiting.', ex:'Please wait in the queue.'},

    {cat:'problem', icon:'🧳', term:'cabin bag', fr:'bagage cabine', def:'A small bag you take on the plane.', ex:'She has a question about her cabin bag.'},
    {cat:'problem', icon:'🔗', term:'connecting flight', fr:'vol de correspondance', def:'A second flight after the first one.', ex:'He is worried about his connecting flight.'},
    {cat:'problem', icon:'⚠️', term:'delay', fr:'retard', def:'A flight that starts later than planned.', ex:'There is a delay today.'},
    {cat:'problem', icon:'💺', term:'seat problem', fr:'problème de siège', def:'A passenger issue with the seat.', ex:'He has a seat problem.'},
    {cat:'problem', icon:'😟', term:'worried passenger', fr:'passager inquiet', def:'A passenger who feels stressed or concerned.', ex:'The passenger is worried about boarding.'}
  ];

  const expressionScenarios = [
    {
      id:'ex1',
      title:'Gate change and boarding time',
      situation:'A passenger says: “I think my gate has changed, and I am worried about boarding.”',
      expressions:[
        ['How can I help you?','Comment puis-je vous aider ?'],
        ['If I understand correctly…','Si j’ai bien compris…'],
        ['Your gate has changed.','Votre porte a changé.'],
        ['Boarding starts at 6:15 p.m.','L’embarquement commence à 18h15.'],
        ['I will check that for you.','Je vais vérifier cela pour vous.']
      ],
      model:'Of course. If I understand correctly, you would like to check your new gate and your boarding time. I will check that for you. Your new gate is B12, and boarding starts at 6:15 p.m.'
    },
    {
      id:'ex2',
      title:'Cabin bag and connection',
      situation:'A passenger says: “I do not know if my cabin bag is allowed, and I am also worried about my connection.”',
      expressions:[
        ['Could you repeat that, please?','Pourriez-vous répéter, s’il vous plaît ?'],
        ['If I understand correctly…','Si j’ai bien compris…'],
        ['You have a question about…','Vous avez une question sur…'],
        ['You are also worried about…','Vous êtes aussi inquiet à propos de…'],
        ['Is that right?','C’est bien cela ?']
      ],
      model:'Of course. If I understand correctly, you have a question about the cabin baggage allowance, and you are also worried about your connecting flight. Is that right?'
    },
    {
      id:'ex3',
      title:'Welcome on board and seat help',
      situation:'You welcome a passenger on board and the passenger says: “I think I have a seat problem.”',
      expressions:[
        ['Welcome aboard.','Bienvenue à bord.'],
        ['How can I help you?','Comment puis-je vous aider ?'],
        ['Please remain calm.','Veuillez rester calme.'],
        ['I will check that for you.','Je vais vérifier cela pour vous.'],
        ['Could you show me your boarding pass, please?','Pourriez-vous me montrer votre carte d’embarquement, s’il vous plaît ?']
      ],
      model:'Welcome aboard. How can I help you? Please remain calm. I will check that for you. Could you show me your boarding pass, please?'
    }
  ];

  const airportQuiz = [
    {id:'aq-1', question:'Choose the best word: “Please show me your ____ before boarding.”', options:['boarding pass','seatbelt','overhead bin'], answer:0, explain:'Passengers show their boarding pass before boarding.'},
    {id:'aq-2', question:'Choose the best word: “Your new ____ is B12.”', options:['gate','aisle','terminal'], answer:0, explain:'B12 is a gate.'},
    {id:'aq-3', question:'Choose the best word: “Please put your bag in the ____.”', options:['overhead bin','departure board','queue'], answer:0, explain:'A bag goes in the overhead bin.'}
  ];
  const airportFill = [
    {id:'af-1', prompt:'Boarding starts at 6:15 p.m. Please go to gate ____.', options:['B12','seatbelt','aisle'], answer:'B12', explain:'A gate has a code like B12.'},
    {id:'af-2', prompt:'Please fasten your ______ before take-off.', options:['seatbelt','boarding pass','passport'], answer:'seatbelt', explain:'Fasten your seatbelt.'},
    {id:'af-3', prompt:'The passenger is worried about the ______ flight.', options:['connecting','overhead','final'], answer:'connecting', explain:'A second flight is a connecting flight.'}
  ];
  const airportResponses = [
    {id:'ar-1', question:'Passenger: “Where is my gate?”', options:['Your gate is B12.','Your seat is calm.','Please answer the email.'], answer:0, explain:'This is the correct gate information.'},
    {id:'ar-2', question:'Passenger: “What time does boarding start?”', options:['Boarding starts at 6:15 p.m.','Your passport is blue.','The plane is a hotel.'], answer:0, explain:'This is the correct boarding information.'},
    {id:'ar-3', question:'Passenger: “I have a seat problem.”', options:['I will check that for you.','Please put it in the overhead bin.','Welcome to departures.'], answer:0, explain:'This is the best professional response.'}
  ];
  const airportBuild = [
    {id:'ab-1', prompt:'Choose the best sentence.', options:['Your gate is B12 and boarding starts at 6:15 p.m.','Your gate B12 is and boarding at 6:15 starts.','Boarding B12 gate is your at 6:15.'], answer:'Your gate is B12 and boarding starts at 6:15 p.m.', explain:'Clear airline information should be simple and direct.'},
    {id:'ab-2', prompt:'Choose the best sentence.', options:['Please put your cabin bag in the overhead bin.','Please put your overhead bin in the cabin bag.','Please overhead your bag in the cabin.'], answer:'Please put your cabin bag in the overhead bin.', explain:'This is the natural instruction.'}
  ];
  const sortWords = [
    {word:'boarding pass', cat:'Airport general'},
    {word:'passport', cat:'Airport general'},
    {word:'terminal', cat:'Airport general'},
    {word:'gate', cat:'Gate & boarding'},
    {word:'boarding time', cat:'Gate & boarding'},
    {word:'final call', cat:'Gate & boarding'},
    {word:'seatbelt', cat:'On the plane'},
    {word:'aisle', cat:'On the plane'},
    {word:'overhead bin', cat:'On the plane'}
  ];

  const reformulationScenarios = [
    {
      id:'ref-anna',
      title:'Cabin bag + connection to Madrid',
      essentials:[
        'Passenger: Anna Brown',
        'Destination: Madrid tomorrow',
        'Question: cabin bag / cabin baggage allowance',
        'Second worry: connecting flight',
        'Need: clear information'
      ],
      transcript:'The passenger is Anna Brown. She is travelling to Madrid tomorrow. She has a question about her cabin bag, and she is also worried about her connecting flight. She would like clear information.',
      model:'If I understand correctly, you have a question about the cabin baggage allowance and your connecting flight to Madrid. Is that right?',
      checks:[
        {id:'ri-a1', question:'What is the passenger’s name?', options:['Anna Brown','Sofia Martinez','David Lee'], answer:0, explain:'The passenger is Anna Brown.'},
        {id:'ri-a2', question:'What are the two main points?', options:['Cabin baggage and connecting flight','Special meal and passport','Hotel and taxi'], answer:0, explain:'She asks about her cabin bag and her connection.'}
      ]
    },
    {
      id:'ref-david',
      title:'Seat problem + special meal to Rome',
      essentials:[
        'Passenger: David Lee',
        'Destination: Rome this evening',
        'Problem: wants to sit next to his wife',
        'Second question: special meal confirmation'
      ],
      transcript:'The passenger is David Lee. He is flying to Rome this evening. He has a seat problem because he would like to sit next to his wife. He also wants to check whether his special meal is confirmed.',
      model:'If I understand correctly, you would like to sit next to your wife, and you would also like to check whether your special meal is confirmed. Is that correct?',
      checks:[
        {id:'ri-d1', question:'Where is he flying?', options:['Rome','Madrid','Lisbon'], answer:0, explain:'He is flying to Rome.'},
        {id:'ri-d2', question:'What does he want?', options:['A seat next to his wife and confirmation of his special meal','A new hotel room','A gate change'], answer:0, explain:'He wants a seat change and a meal confirmation.'}
      ]
    },
    {
      id:'ref-sofia',
      title:'Gate change + boarding time to Lisbon',
      essentials:[
        'Passenger: Sofia Martinez',
        'Destination: Lisbon this afternoon',
        'Question: gate change',
        'Second worry: boarding time',
        'Need: correct information'
      ],
      transcript:'The passenger is Sofia Martinez. She is travelling to Lisbon this afternoon. She has a question about a gate change, and she is also worried about the boarding time. She would like the correct information.',
      model:'If I understand correctly, your gate has changed, and you would also like to know the boarding time. Is that right?',
      checks:[
        {id:'ri-s1', question:'Where is she travelling?', options:['Lisbon','Rome','Paris'], answer:0, explain:'She is travelling to Lisbon.'},
        {id:'ri-s2', question:'What information does she need?', options:['The gate and the boarding time','Her hotel reservation','Her passport number'], answer:0, explain:'She needs the correct gate and boarding time information.'}
      ]
    }
  ];

  const roleplays = [
    {id:'rp-1', prompt:'You are a future steward. A passenger says: “Hello, I think my gate has changed, and I am worried about boarding.” Respond clearly and calmly.', model:'Of course. If I understand correctly, you would like to check your new gate and your boarding time. I will check that for you. Your new gate is B12, and boarding starts at 6:15 p.m.'},
    {id:'rp-2', prompt:'You are introducing yourself in Part 1 of the LILATE. Say who you are, what you do now, and what your goal is.', model:'My name is Yanis. I am twenty-five years old and I live in Schiltigheim. I work as a receptionist in a three-star hotel. My main duties are welcoming guests, answering the phone, replying to emails, and making reservations. I am improving my English because I would like to become a steward.'},
    {id:'rp-3', prompt:'A passenger says: “I do not know if my cabin bag is allowed, and I am also worried about my connection.” Ask for clarification and reformulate the problem.', model:'Of course. If I understand correctly, you have a question about the cabin baggage allowance, and you are also worried about your connecting flight. Is that right?'}
  ];

  const writingLadder = {
    simple:'The passenger has a problem. The gate changed. Boarding is at 6:15.',
    better:'The passenger has a problem because the gate has changed. Boarding starts at 6:15 p.m.',
    stronger:'The passenger would like clear information because the gate has changed, and boarding starts at 6:15 p.m.'
  };
  const writingCompare = [
    {id:'write-c1', question:'Why is the stronger version better?', options:['It links the ideas more clearly and sounds more professional.','It is shorter and less clear.','It removes the important information.'], answer:0, explain:'The stronger version connects the ideas and sounds more professional.'}
  ];

  function renderVocab(category='all'){
    const host = $('#vocabGrid');
    host.innerHTML='';
    vocab.filter(v => category==='all' || v.cat===category).forEach(item=>{
      const card=document.createElement('article'); card.className='vocab-card';
      card.innerHTML=`<div class="vocab-top"><div><div class="vocab-icon">${item.icon}</div><div class="vocab-term">${item.term}</div><div class="vocab-tag">${item.cat}</div></div><button class="speak-btn" type="button">🔊</button></div>
      <div class="vocab-meta"><div><span>French:</span> ${item.fr}</div><div><span>Definition:</span> ${item.def}</div><div><span>Example:</span> ${item.ex}</div></div>`;
      $('.speak-btn', card).addEventListener('click', ()=>Speech.speak(`${item.term}. ${item.def}. Example: ${item.ex}`));
      host.appendChild(card);
    });
  }

  function renderExpressionSelect(){
    const sel = $('#expressionScenarioSelect');
    expressionScenarios.forEach(s=>{ const o=document.createElement('option'); o.value=s.id; o.textContent=s.title; sel.appendChild(o); });
  }
  function currentExpression(){ return expressionScenarios.find(s=>s.id===$('#expressionScenarioSelect').value) || expressionScenarios[0]; }
  function drawExpression(){
    const s=currentExpression();
    $('#expressionScenarioBox').textContent=s.situation;
    $('#expressionList').innerHTML = s.expressions.map(([en,fr])=>`<div class="expression-item"><strong>${en}</strong><span>${fr}</span></div>`).join('');
    $('#expressionModel').textContent='Click the button when you are ready to compare your answer.';
    $('#expressionWrite').value='';
  }

  function renderSort(){
    const host=$('#sortHost');
    const cats=['Airport general','Gate & boarding','On the plane'];
    host.innerHTML=`
      <div class="sort-row"><strong>1) Choose a word.</strong><div class="sort-bank" id="sortWordBank"></div></div>
      <div class="target-grid">${cats.map(cat=>`<div class="sort-column"><h4>${cat}</h4><button type="button" class="target-btn" data-cat="${cat}">Place here</button><div class="placed-bank" data-cat="${cat}"></div></div>`).join('')}</div>
      <div class="feedback hidden" id="sortFeedback"></div>`;
    const bank=$('#sortWordBank'); const fb=$('#sortFeedback');
    let current=null;
    sortWords.forEach(item=>{
      const btn=document.createElement('button'); btn.type='button'; btn.className='sort-pill'; btn.textContent=item.word;
      btn.addEventListener('click', ()=>{
        current=item; $$('.sort-pill', bank).forEach(b=>b.style.outline='none'); btn.style.outline='3px solid rgba(21,94,239,.16)';
        showFeedback(fb,true,`Selected: ${item.word}. Now click the correct category.`);
      });
      bank.appendChild(btn);
    });
    $$('.target-btn').forEach(btn=>btn.addEventListener('click', ()=>{
      if(!current) return;
      const ok = btn.dataset.cat===current.cat;
      const pill=document.createElement('span'); pill.className=`sort-pill ${ok?'right':'wrong'}`; pill.textContent=current.word;
      $(`.placed-bank[data-cat="${btn.dataset.cat}"]`).appendChild(pill);
      showFeedback(fb, ok, ok ? `✅ Correct. ${current.word} belongs to ${current.cat}.` : `❌ Not quite. ${current.word} belongs to ${current.cat}.`);
      if(ok) award(`sort-${current.word}`);
      const old=[...$$('.sort-pill', bank)].find(x=>x.textContent===current.word); if(old) old.remove();
      current=null;
    }));
  }

  function renderReformulationSelect(){
    const sel=$('#reformulationSelect');
    reformulationScenarios.forEach(s=>{ const o=document.createElement('option'); o.value=s.id; o.textContent=s.title; sel.appendChild(o); });
  }
  function currentReformulation(){ return reformulationScenarios.find(s=>s.id===$('#reformulationSelect').value) || reformulationScenarios[0]; }
  function drawReformulation(){
    const s=currentReformulation();
    $('#reformulationScenario').innerHTML = s.essentials.map(x=>`<li>${x}</li>`).join('');
    $('#reformulationTranscript').textContent = s.transcript;
    $('#reformulationTranscript').classList.add('hidden');
    $('#reformulationTranscriptBtn').textContent='Show transcript';
    $('#reformulationModel').textContent = s.model;
    $('#reformulationModel').classList.add('hidden');
    $('#reformulationWrite').value='';
    renderQuiz('infoCheckHost', s.checks);
  }

  function renderRoleplaySelect(){
    const sel=$('#roleplaySelect');
    roleplays.forEach(r=>{ const o=document.createElement('option'); o.value=r.id; o.textContent=r.prompt.slice(0,70)+'…'; sel.appendChild(o); });
  }
  function currentRoleplay(){ return roleplays.find(r=>r.id===$('#roleplaySelect').value) || roleplays[0]; }
  function drawRoleplay(){
    const r=currentRoleplay();
    $('#roleplayPrompt').textContent=r.prompt;
    $('#roleplayModel').textContent='Click “Show model answer” when you are ready.';
    $('#roleplayAnswer').value='';
  }

  function drawWriting(){
    $('#writingSimple').textContent = writingLadder.simple;
    $('#writingBetter').textContent = writingLadder.better;
    $('#writingStronger').textContent = writingLadder.stronger;
    renderQuiz('writingCompareHost', writingCompare);
  }

  // init
  $('#listenIntro').addEventListener('click', ()=>Speech.speak('Today you review everything you have studied so far. You will revise grammar, vocabulary, airport English, reformulation, and guided exam practice.'));
  $('#listenSelfModel').addEventListener('click', ()=>Speech.speak($('#selfModelText').textContent));
  $('#voiceUS').addEventListener('click', ()=>{ Speech.lang='en-US'; $('#voiceUS').classList.add('is-on'); $('#voiceUK').classList.remove('is-on'); });
  $('#voiceUK').addEventListener('click', ()=>{ Speech.lang='en-GB'; $('#voiceUK').classList.add('is-on'); $('#voiceUS').classList.remove('is-on'); });
  $('#pauseAudio').addEventListener('click', ()=>Speech.pause());
  $('#resumeAudio').addEventListener('click', ()=>Speech.resume());
  $('#stopAudio').addEventListener('click', ()=>Speech.stop());

  renderFill('introFillHost', introFill);
  renderFill('grammarAHost', grammarA);
  renderQuiz('grammarBHost', grammarB);
  renderFill('grammarCHost', grammarC);
  renderFill('grammarDHost', grammarD);
  renderQuiz('grammarEHost', grammarE);
  renderQuiz('grammarQuizHost', grammarMixed);

  renderVocab('all');
  $('#vocabFilter').addEventListener('change', e=>renderVocab(e.target.value));

  renderExpressionSelect(); drawExpression();
  $('#expressionScenarioSelect').addEventListener('change', drawExpression);
  $('#showExpressionModel').addEventListener('click', ()=>{ $('#expressionModel').textContent=currentExpression().model; award(`expr-${currentExpression().id}`); });
  $('#listenExpressionModel').addEventListener('click', ()=>Speech.speak($('#expressionModel').textContent.includes('Click') ? currentExpression().model : $('#expressionModel').textContent));

  renderQuiz('airportQuizHost', airportQuiz);
  renderFill('airportFillHost', airportFill);
  renderQuiz('airportResponseHost', airportResponses);
  renderFill('airportBuildHost', airportBuild);
  renderSort();

  renderReformulationSelect(); drawReformulation();
  $('#reformulationSelect').addEventListener('change', drawReformulation);
  $('#reformulationListen').addEventListener('click', ()=>Speech.speak(currentReformulation().transcript));
  $('#reformulationTranscriptBtn').addEventListener('click', ()=>{
    $('#reformulationTranscript').classList.toggle('hidden');
    $('#reformulationTranscriptBtn').textContent = $('#reformulationTranscript').classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
  });
  $('#showReformulationModel').addEventListener('click', ()=>{ $('#reformulationModel').classList.remove('hidden'); award(`reform-model-${currentReformulation().id}`); });
  $('#listenReformulationModel').addEventListener('click', ()=>Speech.speak(currentReformulation().model));

  renderRoleplaySelect(); drawRoleplay();
  $('#roleplaySelect').addEventListener('change', drawRoleplay);
  $('#showRoleplayModel').addEventListener('click', ()=>{ $('#roleplayModel').textContent=currentRoleplay().model; award(`roleplay-model-${currentRoleplay().id}`); });
  $('#roleplayListenPrompt').addEventListener('click', ()=>Speech.speak(currentRoleplay().prompt));
  $('#roleplayListenModel').addEventListener('click', ()=>Speech.speak($('#roleplayModel').textContent.includes('Click') ? currentRoleplay().model : $('#roleplayModel').textContent));

  drawWriting();
  setScoreMax(34);
})();
