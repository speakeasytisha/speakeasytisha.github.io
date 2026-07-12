(() => {
  const $ = (s, e=document) => e.querySelector(s);
  const el = (t, c, h='') => { const x=document.createElement(t); if(c) x.className=c; if(h!==undefined) x.innerHTML=h; return x; };

  const Speech = {
    mode:'en-US',
    speak(text){
      if(!('speechSynthesis' in window) || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = this.mode;
      const voices = speechSynthesis.getVoices();
      const found = voices.find(v => v.lang === this.mode) || voices.find(v => v.lang.startsWith('en'));
      if(found) u.voice = found;
      u.rate = 0.95;
      speechSynthesis.speak(u);
    }
  };

  $('#voiceUS').addEventListener('click', () => setVoice('en-US'));
  $('#voiceUK').addEventListener('click', () => setVoice('en-GB'));
  $('#stopAudio').addEventListener('click', () => window.speechSynthesis?.cancel());
  function setVoice(mode){
    Speech.mode = mode;
    $('#voiceUS').classList.toggle('active', mode==='en-US');
    $('#voiceUK').classList.toggle('active', mode==='en-GB');
  }

  const vocab = {
    delays:[
      {emoji:'⏰', word:'delay', trans:'retard', def:'a situation when something happens later than planned', ex:'There is a delay because the weather is bad.'},
      {emoji:'❌', word:'cancelled flight', trans:'vol annulé', def:'a flight that will not operate', ex:'The flight is cancelled, so we need to find a new solution.'},
      {emoji:'🕒', word:'boarding time', trans:'heure d’embarquement', def:'the time when passengers can start getting on the plane', ex:'Boarding time is 6:20 p.m.'},
      {emoji:'↔️', word:'connection', trans:'correspondance', def:'the next flight after the first flight', ex:'He is worried about his connection to Madrid.'}
    ],
    baggage:[
      {emoji:'🧳', word:'cabin bag', trans:'bagage cabine', def:'a small bag you can take on the plane with you', ex:'Your cabin bag is too large for the overhead bin.'},
      {emoji:'🛄', word:'checked bag', trans:'bagage en soute', def:'a bag that goes in the aircraft hold', ex:'You have to check this bag.'},
      {emoji:'📦', word:'overhead bin', trans:'compartiment à bagages', def:'the storage space above the seats', ex:'Please place your bag in the overhead bin.'},
      {emoji:'⚖️', word:'allowance', trans:'franchise / autorisation', def:'the quantity or size that is officially accepted', ex:'Let me check your cabin baggage allowance.'}
    ],
    seats:[
      {emoji:'💺', word:'seat problem', trans:'problème de siège', def:'a situation where the seat is not correct or not suitable', ex:'The passenger has a seat problem and would like to sit next to his wife.'},
      {emoji:'🪟', word:'window seat', trans:'siège côté hublot', def:'a seat next to the window', ex:'Would you prefer a window seat?'},
      {emoji:'🛣️', word:'aisle seat', trans:'siège côté couloir', def:'a seat next to the aisle', ex:'I can offer you an aisle seat.'},
      {emoji:'🔁', word:'seat change', trans:'changement de siège', def:'a situation where the assigned seat is different', ex:'There is a seat change for this passenger.'}
    ],
    assistance:[
      {emoji:'♿', word:'assistance', trans:'assistance', def:'help given to a passenger who needs support', ex:'Do you need special assistance?'},
      {emoji:'🍽️', word:'special meal', trans:'repas spécial', def:'a meal requested for a specific need', ex:'I would like to check whether your special meal is confirmed.'},
      {emoji:'😟', word:'concern', trans:'inquiétude / préoccupation', def:'something that worries a passenger', ex:'I understand your concern.'},
      {emoji:'🙏', word:'inconvenience', trans:'désagrément', def:'a problem or difficulty caused to the passenger', ex:'I’m sorry for the inconvenience.'}
    ]
  };

  const vocabLabels = {
    delays:'Delays & connections',
    baggage:'Baggage',
    seats:'Seats',
    assistance:'Assistance & passenger needs'
  };

  function renderVocabCategories(){
    const sel = $('#vocabCategory');
    Object.entries(vocabLabels).forEach(([k,v]) => {
      const o = document.createElement('option'); o.value = k; o.textContent = v; sel.appendChild(o);
    });
    sel.addEventListener('change', () => renderVocab(sel.value));
    $('#speakCategoryWords').addEventListener('click', () => {
      const items = vocab[sel.value].map(x => `${x.word}. ${x.ex}`).join(' ');
      Speech.speak(items);
    });
    renderVocab(sel.value || 'delays');
  }

  function renderVocab(key){
    const host = $('#vocabCards'); host.innerHTML='';
    vocab[key].forEach(item => {
      const card = el('div','vocabCard');
      card.innerHTML = `
        <div class="vocabTop">
          <div><div class="word">${item.word}</div><div class="trans">${item.trans}</div></div>
          <div class="emoji">${item.emoji}</div>
        </div>
        <div class="def"><strong>Definition:</strong> ${item.def}</div>
        <div class="ex"><strong>Example:</strong> ${item.ex}</div>
      `;
      const actions = el('div','smallActions');
      const b = el('button','smallBtn','🔊 Listen');
      b.type='button'; b.addEventListener('click',()=>Speech.speak(`${item.word}. ${item.ex}`));
      actions.appendChild(b);
      card.appendChild(actions);
      host.appendChild(card);
    });
  }

  function buildMC(hostId, items){
    const host = $(hostId); host.innerHTML='';
    items.forEach((q, idx) => {
      const box = el('div','mcQuestion');
      box.innerHTML = `<p><strong>${idx+1}.</strong> ${q.q}</p>`;
      const options = shuffle(q.options.map((text, i) => ({text, correct: i===q.answer})));
      options.forEach(opt => {
        const btn = el('button','option',opt.text); btn.type='button';
        btn.addEventListener('click', () => {
          [...box.querySelectorAll('.option')].forEach(o => o.disabled = true);
          btn.classList.add(opt.correct ? 'correct' : 'wrong');
          const fb = el('div', 'feedback ' + (opt.correct ? 'ok' : 'no'), opt.correct ? 'Correct!' : `Better answer: ${q.options[q.answer]}`);
          box.appendChild(fb);
        });
        box.appendChild(btn);
      });
      host.appendChild(box);
    });
  }

  function buildFill(hostId, items){
    const host = $(hostId); host.innerHTML='';
    items.forEach((q, idx) => {
      const box = el('div','fillQuestion');
      box.innerHTML = `<p><strong>${idx+1}.</strong> ${q.q}</p>`;
      const input = el('input','inlineInput'); input.type='text';
      const btn = el('button','checkBtn','Check'); btn.type='button';
      const fb = el('div','feedback');
      btn.addEventListener('click', () => {
        const v = input.value.trim().toLowerCase().replace(/[.?!]/g,'');
        const ok = q.answers.some(a => a.toLowerCase() === v);
        fb.className = 'feedback ' + (ok ? 'ok' : 'no');
        fb.textContent = ok ? 'Correct!' : `Expected: ${q.answers[0]}`;
      });
      box.append(input, btn, fb);
      host.appendChild(box);
    });
  }

  const grammar = {
    g1mc:[
      {q:'Choose the correct sentence.', options:['There is a delay.','There are a delay.','There is two seats.'], answer:0},
      {q:'Choose the correct sentence.', options:['There are two empty seats.','There is two empty seats.','There are a seat problem.'], answer:0}
    ],
    g1fill:[
      {q:'_____ is a problem with your seat.', answers:['There']},
      {q:'There _____ two passengers waiting at gate B12.', answers:['are']}
    ],
    g2mc:[
      {q:'Choose the current action.', options:['We are boarding now.','Boarding starts at 6:20 p.m.','There is a gate change.'], answer:0},
      {q:'Choose the present continuous sentence.', options:['The passenger is asking about his bag.','The passenger asks about his bag every day.','There is a bag.'], answer:0}
    ],
    g2fill:[
      {q:'She _____ travelling to Rome this evening.', answers:['is']},
      {q:'They _____ waiting at the gate.', answers:['are']}
    ],
    g3mc:[
      {q:'Choose the best professional apology.', options:['I’m sorry for the inconvenience.','Sorry, problem.','There are inconvenience.'], answer:0},
      {q:'Choose the best instruction.', options:['Please follow me.','You follow me please maybe.','Following me please you.'], answer:0}
    ],
    g3fill:[
      {q:'I’m sorry _____ the delay.', answers:['for']},
      {q:'You need _____ go to gate B12.', answers:['to']}
    ],
    g4mc:[
      {q:'Choose the best link word: “There is a gate change, ___ boarding will start later.”', options:['so','because','but'], answer:0},
      {q:'Choose the best link word: “He is worried ___ he has a connection.”', options:['because','so','but'], answer:0}
    ],
    g4fill:[
      {q:'There is a delay, _____ boarding starts later.', answers:['so']},
      {q:'There is a problem, _____ I can help you.', answers:['but']}
    ]
  };

  function initGrammar(){
    buildMC('#g1mc', grammar.g1mc); buildFill('#g1fill', grammar.g1fill);
    buildMC('#g2mc', grammar.g2mc); buildFill('#g2fill', grammar.g2fill);
    buildMC('#g3mc', grammar.g3mc); buildFill('#g3fill', grammar.g3fill);
    buildMC('#g4mc', grammar.g4mc); buildFill('#g4fill', grammar.g4fill);
  }

  const easyItems = [
    {q:'Passenger: “I am worried about my connection.” Best response?', options:['I understand your concern. Let me check that for you.','Yes, connection.','No connection worry.'], answer:0},
    {q:'Passenger: “There is a gate change.” Best response?', options:['Let me check your new gate for you.','Your gate changing maybe.','I am gate.'], answer:0},
    {q:'Passenger: “My bag is too big.” Best response?', options:['You have to check this bag.','The bag are big.','No bag today.'], answer:0}
  ];

  function initEasy(){ buildMC('#easyPractice', easyItems); }

  const mediumTasks = [
    {prompt:'Build a professional apology about a delay.', target:'I’m sorry for the delay.' , words:['delay.','I’m','for','sorry','the']},
    {prompt:'Build a clear instruction.', target:'Please go to gate B12.' , words:['gate','to','Please','B12.','go']},
    {prompt:'Build a response about boarding.', target:'Boarding starts at 6:20 p.m.' , words:['Boarding','at','starts','6:20','p.m.']}
  ];

  function initMedium(){
    const host = $('#mediumPractice');
    mediumTasks.forEach((task, idx) => {
      const wrap = el('div','mediumTask');
      wrap.innerHTML = `<p><strong>${idx+1}.</strong> ${task.prompt}</p>`;
      const bank = el('div','wordBank');
      const line = el('div','answerLine');
      const selected = [];
      shuffle(task.words).forEach(w => {
        const t = el('button','token',w); t.type='button';
        t.addEventListener('click', ()=> {
          selected.push(w);
          line.textContent = selected.join(' ');
          t.disabled = true; t.style.opacity=.45;
        });
        bank.appendChild(t);
      });
      const btn = el('button','checkBtn','Check'); btn.type='button';
      const reset = el('button','checkBtn','Reset'); reset.type='button'; reset.style.marginLeft='.45rem'; reset.style.background='#fff'; reset.style.color='var(--blue)';
      const fb = el('div','feedback');
      btn.addEventListener('click', () => {
        const guess = line.textContent.trim().replace(/\s+/g,' ');
        const ok = norm(guess) === norm(task.target);
        fb.className = 'feedback ' + (ok ? 'ok' : 'no');
        fb.textContent = ok ? 'Correct!' : `Model: ${task.target}`;
      });
      reset.addEventListener('click', ()=> {
        selected.length=0; line.textContent=''; fb.textContent=''; fb.className='feedback';
        bank.querySelectorAll('.token').forEach(t=>{t.disabled=false; t.style.opacity='1';});
      });
      wrap.append(bank, line, btn, reset, fb);
      host.appendChild(wrap);
    });
  }

  const hardTasks = [
    {
      prompt:'Passenger: “My flight is delayed and I am worried about my connection.” Write a professional response.',
      model:'I’m sorry for the delay. I understand your concern, and I will check your connection for you.'
    },
    {
      prompt:'Passenger: “I think my gate changed. What time does boarding start?” Write a professional response.',
      model:'Let me check that for you. Your new gate is B12, and boarding starts at 6:20 p.m.'
    }
  ];

  function initHard(){
    const host = $('#hardPractice');
    hardTasks.forEach((task, idx) => {
      const wrap = el('div','hardTask');
      wrap.innerHTML = `<p><strong>${idx+1}.</strong> ${task.prompt}</p>`;
      const ta = el('textarea'); ta.rows=5; ta.placeholder='Write your answer here...';
      const show = el('button','btn','Show model answer'); show.type='button';
      const hide = el('button','btn ghost','Hide model answer'); hide.type='button';
      const box = el('div','modelBox hidden', task.model);
      show.addEventListener('click', ()=> box.classList.remove('hidden'));
      hide.addEventListener('click', ()=> box.classList.add('hidden'));
      wrap.append(ta, el('div','btnRow'), box);
      wrap.querySelector('.btnRow').append(show, hide);
      host.appendChild(wrap);
    });
  }

  const scenarios = [
    {
      name:'Delayed flight + connection',
      facts:['Passenger: Anna Brown','Destination: Madrid','Problem: delay','Concern: connection'],
      phrases:['I’m sorry for the delay.','I understand your concern.','Let me check your connection.','Please wait here for a moment.'],
      transcript:'Hello. My name is Anna Brown. I am travelling to Madrid today. My flight is delayed, and I am worried about my connection. Could you please help me?',
      model:'I’m sorry for the delay. I understand your concern, and I will check your connection for you. Please wait here for a moment.',
      tasks:[
        {q:'What is the passenger worried about?', a:'Her connection.'},
        {q:'What is the first professional sentence you can use?', a:'I’m sorry for the delay.'}
      ]
    },
    {
      name:'Seat problem + wife',
      facts:['Passenger: David Lee','Destination: Rome','Problem: seat problem','Extra detail: travelling with his wife'],
      phrases:['If I understand correctly...','You would like to sit next to your wife.','May I see your boarding pass, please?','Let me check that for you.'],
      transcript:'Good evening. I am travelling to Rome this evening. I would like to sit next to my wife because our seats are different.',
      model:'If I understand correctly, you would like to sit next to your wife. May I see your boarding pass, please? Let me check that for you.',
      tasks:[
        {q:'What does the passenger want?', a:'He wants to sit next to his wife.'},
        {q:'What document should you ask for?', a:'The boarding pass.'}
      ]
    },
    {
      name:'Gate change + boarding time',
      facts:['Passenger: Sofia Martinez','Destination: Lisbon','Problem: gate change','Question: boarding time'],
      phrases:['Let me check that for you.','Your gate is now B12.','Boarding starts at...','Is that right?'],
      transcript:'Good afternoon. I am travelling to Lisbon this afternoon. I have a question about a gate change, and I would also like to know the boarding time.',
      model:'If I understand correctly, you have a question about a gate change, and you would also like to know the boarding time. Let me check that for you. Your gate is now B12, and boarding starts at 6:15 p.m.',
      tasks:[
        {q:'What are the two key points?', a:'The gate change and the boarding time.'},
        {q:'What professional verb can you use?', a:'check'}
      ]
    },
    {
      name:'Cabin bag too large',
      facts:['Passenger: Maria Costa','Problem: cabin bag too large','Need: checked bag or help'],
      phrases:['There is a problem with your cabin bag.','You have to check this bag.','I can help you.','Please come with me.'],
      transcript:'Hello. I think my cabin bag is too large, and I do not know what to do.',
      model:'There is a problem with your cabin bag. You have to check this bag, but I can help you. Please come with me.',
      tasks:[
        {q:'What is the problem?', a:'The cabin bag is too large.'},
        {q:'What does the passenger need?', a:'Help / information about what to do next.'}
      ]
    }
  ];

  function renderScenarioUI(index=0){
    const s = scenarios[index];
    $('#scenarioFacts').innerHTML = s.facts.map(f=>`<li>${f}</li>`).join('');
    $('#scenarioPhrases').innerHTML = s.phrases.map(f=>`<li>${f}</li>`).join('');
    $('#scenarioTranscript').textContent = s.transcript;
    $('#scenarioResponse').value='';
    $('#scenarioModel').textContent = s.model;
    $('#scenarioModel').classList.add('hidden');
    const tasks = $('#scenarioTasks'); tasks.innerHTML='';
    s.tasks.forEach((t, i) => {
      const box = el('div','miniTask', `<p><strong>${i+1}.</strong> ${t.q}</p>`);
      const ta = el('textarea'); ta.rows=3; ta.placeholder='Write your answer...';
      const btn = el('button','smallBtn','Show answer'); btn.type='button';
      const ans = el('div','modelBox hidden', t.a);
      btn.addEventListener('click', ()=> ans.classList.toggle('hidden'));
      box.append(ta, btn, ans); tasks.appendChild(box);
    });
  }

  function initScenarios(){
    const sel = $('#scenarioSelect');
    scenarios.forEach((s, i)=>{
      const o=document.createElement('option'); o.value=i; o.textContent=s.name; sel.appendChild(o);
    });
    sel.addEventListener('change', ()=> renderScenarioUI(Number(sel.value)));
    $('#toggleTranscript').addEventListener('click', ()=> $('#scenarioTranscript').classList.toggle('hidden'));
    $('#playTranscript').addEventListener('click', ()=> Speech.speak($('#scenarioTranscript').textContent));
    $('#showScenarioModel').addEventListener('click', ()=> $('#scenarioModel').classList.remove('hidden'));
    $('#hideScenarioModel').addEventListener('click', ()=> $('#scenarioModel').classList.add('hidden'));
    renderScenarioUI(0);
  }

  const oralScenarios = [
    {
      name:'Upset passenger about a delay',
      prompt:'Hello. My flight is delayed, and I am worried because I have a connection. Can you help me?',
      model:'Good afternoon. I’m sorry for the delay. I understand your concern, and I will check your connection for you.'
    },
    {
      name:'Passenger asks about a gate change',
      prompt:'Excuse me. Excuse me. There is a gate change. Could you tell me the new gate and the boarding time?',
      model:'Of course. Let me check that for you. Your gate is now B12, and boarding starts at 6:15 p.m.'
    },
    {
      name:'Cabin bag too large',
      prompt:'Hello. I think my bag is too large for the cabin. What do I need to do?',
      model:'There is a problem with your cabin bag. You have to check this bag, but I can help you. Please follow me.'
    },
    {
      name:'Passenger wants to sit with family',
      prompt:'Hi. My wife and my child are sitting in another row. Could we sit together?',
      model:'If I understand correctly, you would like to sit with your wife and child. May I see your boarding pass, please? Let me check that for you.'
    }
  ];

  function initOral(){
    const sel = $('#oralScenarioSelect');
    oralScenarios.forEach((s, i)=>{
      const o=document.createElement('option'); o.value=i; o.textContent=s.name; sel.appendChild(o);
    });
    function render(i){
      $('#oralPrompt').textContent = oralScenarios[i].prompt;
      $('#oralModel').textContent = oralScenarios[i].model;
      $('#oralModel').classList.add('hidden');
    }
    sel.addEventListener('change', ()=> render(Number(sel.value)));
    $('#playOralPrompt').addEventListener('click', ()=> Speech.speak($('#oralPrompt').textContent));
    $('#showOralModel').addEventListener('click', ()=> $('#oralModel').classList.remove('hidden'));
    $('#hideOralModel').addEventListener('click', ()=> $('#oralModel').classList.add('hidden'));
    render(0);
  }

  function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }
  function norm(s){ return String(s).toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim(); }

  renderVocabCategories();
  initGrammar();
  initEasy();
  initMedium();
  initHard();
  initScenarios();
  initOral();
})();
