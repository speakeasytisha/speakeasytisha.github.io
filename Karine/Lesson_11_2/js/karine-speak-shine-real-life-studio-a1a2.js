(() => {
  'use strict';

  const sprintQuestions = [
    {cat:'Routine', q:'What do you usually do on Mondays?', clue:'usually / on Mondays', tense:'Present simple', modelA1:'On Mondays, I usually go for a walk and have a coffee.', modelA2:'On Mondays, my husband has the day off, so we usually go for a walk on the beach, have a coffee at a café, and do things for the house.', fr:'On parle d’une habitude régulière, donc on utilise le présent simple.'},
    {cat:'Routine', q:'What do you do every morning?', clue:'every morning', tense:'Present simple', modelA1:'Every morning, I study my English lesson.', modelA2:'Every morning, I study my English lesson, prepare lunch, and do a few things around the house.', fr:'Every morning indique une routine. Le verbe est au présent simple.'},
    {cat:'Now', q:'What are you doing this week?', clue:'this week', tense:'Present continuous', modelA1:'This week, I am practising English.', modelA2:'This week, I am practising English and preparing for the CLOE exam with more oral exercises.', fr:'This week peut parler d’une période autour de maintenant. On utilise souvent le présent continu.'},
    {cat:'Past', q:'What did you do last weekend?', clue:'last weekend', tense:'Past simple', modelA1:'Last weekend, I went for a bike ride.', modelA2:'Last weekend, I went to Brétignolles-sur-Mer by bike, ate at a restaurant on the beach, and came home in the evening.', fr:'Last weekend est terminé. On utilise le prétérit / past simple.'},
    {cat:'Past', q:'Where did you go last week?', clue:'last week', tense:'Past simple', modelA1:'Last week, I went to Les Sables-d’Olonne.', modelA2:'Last week, I went to Les Sables-d’Olonne to go shopping because there were sales.', fr:'Last week est un moment passé terminé. On utilise did + base verb dans la question.'},
    {cat:'Appointment', q:'What are you doing on Friday at 10 a.m.?', clue:'on Friday at 10 a.m.', tense:'Present continuous for a fixed arrangement', modelA1:'I am having my nails done on Friday at 10 a.m.', modelA2:'I am having my nails done on Friday at 10 a.m. because I already have an appointment.', fr:'Avec une date et une heure fixées, on peut utiliser le présent continu pour un rendez-vous organisé.'},
    {cat:'Future plan', q:'What are you going to do this summer?', clue:'going to / this summer', tense:'Going to', modelA1:'I am going to relax and enjoy the summer.', modelA2:'This summer, I am going to relax, spend time near the beach, and continue practising English.', fr:'Going to exprime un projet ou une intention.'},
    {cat:'Prediction', q:'Do you think it will be hot tomorrow?', clue:'Do you think / will', tense:'Will for prediction', modelA1:'Yes, I think it will be hot.', modelA2:'Yes, I think it will be hot tomorrow, so I will probably stay inside in the afternoon.', fr:'I think + will sert à faire une prédiction.'},
    {cat:'Experience', q:'Have you ever stayed at a campsite?', clue:'Have you ever', tense:'Present perfect', modelA1:'Yes, I have. I have stayed at a campsite.', modelA2:'Yes, I have. I have stayed at a campsite in France, and I enjoyed the atmosphere.', fr:'Have you ever demande une expérience de vie. On utilise le present perfect.'},
    {cat:'Duration', q:'How long have you lived in Saint-Gilles-Croix-de-Vie?', clue:'How long / have you lived', tense:'Present perfect with for / since', modelA1:'I have lived in Saint-Gilles-Croix-de-Vie for 30 years.', modelA2:'I have lived in Saint-Gilles-Croix-de-Vie for 30 years, and I like the beach, the harbour, and the relaxed atmosphere.', fr:'Pour une situation commencée dans le passé et encore vraie maintenant, on utilise le present perfect avec for ou since.'}
  ];

  const detectiveQuestions = [
    {prompt:'Every morning, I _____ my English lesson.', options:['study','am studying','studied'], answer:'study', hint:'Clue: every morning = routine.', explain:'Every morning is a routine, so use the present simple: I study.'},
    {prompt:'Right now, the customer _____ at a photo.', options:['looks','is looking','looked'], answer:'is looking', hint:'Clue: right now = action happening now.', explain:'Right now needs the present continuous: is looking.'},
    {prompt:'Last weekend, we _____ to a restaurant on the beach.', options:['go','are going','went'], answer:'went', hint:'Clue: last weekend = finished past.', explain:'Last weekend is finished, so use the past simple: went.'},
    {prompt:'On Friday at 10 a.m., I _____ my nails done.', options:['am having','have','had'], answer:'am having', hint:'Clue: Friday at 10 a.m. = fixed appointment.', explain:'For a planned appointment, use the present continuous: I am having.'},
    {prompt:'I think it _____ very hot tomorrow.', options:['is','was','will be'], answer:'will be', hint:'Clue: I think + future prediction.', explain:'Use will for a prediction: I think it will be hot.'},
    {prompt:'She _____ work on Mondays.', options:['doesn’t','don’t','isn’t'], answer:'doesn’t', hint:'Clue: she + present simple negative.', explain:'For she in the present simple negative, use doesn’t + base verb.'},
    {prompt:'_____ she work on Mondays?', options:['Does','Do','Is'], answer:'Does', hint:'Question with she + present simple.', explain:'Use Does for present simple questions with she.'},
    {prompt:'I have lived here _____ 30 years.', options:['since','for','ago'], answer:'for', hint:'For + duration.', explain:'Use for with a duration: for 30 years.'},
    {prompt:'I have lived here _____ 1995.', options:['for','since','last'], answer:'since', hint:'Since + starting point.', explain:'Use since with the starting point: since 1995.'},
    {prompt:'Yesterday, I _____ the swimming pool.', options:['cleaned','clean','am cleaning'], answer:'cleaned', hint:'Yesterday = past simple.', explain:'Yesterday is finished, so use the past simple: cleaned.'},
    {prompt:'Tomorrow, I am going to _____ lunch at home.', options:['prepare','prepared','preparing'], answer:'prepare', hint:'After going to, use the base verb.', explain:'Use going to + base verb: going to prepare.'},
    {prompt:'The phone is ringing. I _____ answer it.', options:['will','am going to','did'], answer:'will', hint:'Quick decision at the moment.', explain:'Use will for a quick decision or offer: I’ll answer it.'},
    {prompt:'Have you ever _____ to London?', options:['go','went','been'], answer:'been', hint:'Have you ever + past participle.', explain:'Use the past participle with present perfect: have been.'},
    {prompt:'At the pharmacy, you _____ ask for advice.', options:['can','does','went'], answer:'can', hint:'Modal + base verb.', explain:'After a modal, use the base verb: can ask.'},
    {prompt:'Last week, I _____ apricot jam.', options:['made','make','am making'], answer:'made', hint:'Last week = finished past. Make is irregular.', explain:'The past simple of make is made.'},
    {prompt:'This evening, we _____ at a restaurant. I booked the table yesterday.', options:['are eating','eat','ate'], answer:'are eating', hint:'Fixed future arrangement.', explain:'For a fixed arrangement, the present continuous is natural: we are eating.'}
  ];

  const interviewSets = {
    routine: {
      title:'Routine and habits',
      instruction:'Ask Tisha about regular habits. Listen for words like usually, every day, on Mondays.',
      questions:['What do you usually do in the morning?','Do you work on Saturdays?','Where do you usually have coffee?','What do you do when you have a day off?'],
      model:'What do you usually do on Mondays?'
    },
    past: {
      title:'Past weekend and last week',
      instruction:'Ask about finished past actions. Use did + base verb.',
      questions:['What did you do last weekend?','Where did you go last week?','Did you eat at a restaurant recently?','What did you do yesterday evening?'],
      model:'What did you do last weekend?'
    },
    future: {
      title:'Future plans and appointments',
      instruction:'Ask about fixed arrangements, intentions and predictions.',
      questions:['What are you doing tomorrow?','What are you going to do this summer?','Do you think it will be hot tomorrow?','Are you meeting someone this weekend?'],
      model:'What are you going to do this weekend?'
    },
    experience: {
      title:'Experience with present perfect',
      instruction:'Ask about life experience with Have you ever...?',
      questions:['Have you ever worked in a salon?','Have you ever stayed at a campsite?','Have you ever visited Saint-Gilles-Croix-de-Vie?','How long have you taught English?'],
      model:'Have you ever stayed in a hotel in England?'
    },
    work: {
      title:'Work and customer service',
      instruction:'Ask polite professional questions. Use can, could, would like, and do/does.',
      questions:['Could you spell your name, please?','What time would you like your appointment?','Do you prefer morning or afternoon?','Can I help you with anything else?'],
      model:'Could you spell your name, please?'
    }
  };

  const scenarios = {
    work: {
      label:'Work / salon',
      items:[
        {title:'Confirm an appointment by SMS', type:'SMS', tense:'Future arrangement', clue:'on Friday at 10 a.m.', task:'A customer has an appointment at the salon on Friday at 10 a.m. Send a short confirmation.', phrases:['I confirm your appointment','on Friday at 10 a.m.','please let me know','see you soon'], modelA1:'Hello,\nI confirm your appointment on Friday at 10 a.m.\nSee you soon.\nKarine', modelA2:'Hello,\nI confirm your appointment at the salon on Friday at 10 a.m.\nPlease let me know if you need to change the time.\nKind regards,\nKarine', fr:'Confirmer un rendez-vous : utilisez “I confirm your appointment...” et indiquez clairement le jour et l’heure.', roleplay:['Good morning. I have an appointment, but I can’t remember the time.','Don’t worry. I’ll check the appointment for you. Could you give me your name, please?','My name is Martin.','Thank you. Your appointment is on Friday at 10 a.m.','Thank you very much.','You’re welcome. See you on Friday.']},
        {title:'The salon is fully booked', type:'Email', tense:'Present simple + can', clue:'we are fully booked / I can offer', task:'A customer wants an appointment tomorrow, but the salon is fully booked. Offer another day.', phrases:['unfortunately','we are fully booked','I can offer you','what is best for you'], modelA1:'Hello,\nI’m sorry, but we are fully booked tomorrow.\nI can offer you an appointment on Thursday at 3 p.m.\nKind regards,\nKarine', modelA2:'Hello,\nThank you for your message. Unfortunately, we are fully booked tomorrow.\nHowever, I can offer you an appointment on Thursday at 3 p.m. or Friday morning.\nPlease let me know what is best for you.\nKind regards,\nKarine', fr:'Quand vous refusez poliment, utilisez “unfortunately” puis proposez une solution.', roleplay:['Hello. Do you have an appointment tomorrow?','I’m sorry, but we are fully booked tomorrow.','Oh, that’s a pity. Do you have another time?','Yes, I can offer you Thursday at 3 p.m. or Friday morning.','Thursday at 3 p.m. is perfect.','Great. I confirm your appointment for Thursday at 3 p.m.']},
        {title:'Recommend a product for dry hair', type:'Email / advice', tense:'Modals + recommendation', clue:'should / can / I recommend', task:'A customer has dry hair. Recommend a product and explain how often to use it.', phrases:['I recommend','because','you can use it','twice a week','it will help'], modelA1:'Hello,\nFor dry hair, I recommend this shampoo.\nIt is gentle and good for your hair.\nYou can use it twice a week.\nKarine', modelA2:'Hello,\nFor dry hair, I recommend this shampoo because it is gentle and moisturising.\nYou can use it twice a week. I think it will help your hair feel softer.\nKind regards,\nKarine', fr:'Pour donner un conseil : I recommend..., You can..., You should... + verbe de base.', roleplay:['My hair is very dry. What do you recommend?','I recommend this shampoo because it is gentle and moisturising.','How often should I use it?','You can use it twice a week.','Do you think it will help?','Yes, I think it will help your hair feel softer.']}
      ]
    },
    routine: {
      label:'Daily routine',
      items:[
        {title:'Say you are busy today', type:'SMS', tense:'Present continuous + past simple', clue:'today / now / this morning', task:'You are busy today. Send a message to explain what you did this morning and what you are doing now.', phrases:['I’m busy today','this morning','now','after that','I’m going to'], modelA1:'Hello,\nI’m busy today.\nThis morning, I cleaned the house.\nNow, I’m studying English.\nSee you later,\nKarine', modelA2:'Hello,\nI’m quite busy today. This morning, I cleaned the house and prepared lunch.\nNow, I’m studying my English lesson. After that, I’m going to relax because it is very hot.\nSee you later,\nKarine', fr:'Mélange de temps : this morning avec action finie = past simple ; now = present continuous ; after that + plan = going to.', roleplay:['Are you free today?','I’m sorry, I’m busy today.','What are you doing?','Now, I’m studying English. This morning, I cleaned the house.','Maybe later?','Yes, after that, I’m going to relax.']},
        {title:'Explain Monday plans', type:'Short paragraph', tense:'Present simple', clue:'on Mondays / usually', task:'Write a short message explaining what you usually do on Mondays.', phrases:['on Mondays','usually','then','sometimes','we enjoy our day together'], modelA1:'On Mondays, my husband has the day off.\nWe usually go for a walk on the beach.\nThen, we have a coffee at a café.', modelA2:'On Mondays, my husband has the day off, so we usually enjoy our day together.\nWe go for a walk on the beach, have a coffee at a café, and sometimes go to the hardware store.\nIt is a nice day because we take the opportunity to do things we don’t usually have time to do.', fr:'On Mondays et usually indiquent une habitude : présent simple.', roleplay:['What do you usually do on Mondays?','On Mondays, my husband has the day off, so we enjoy our day together.','What do you do?','We go for a walk, have a coffee, and sometimes go to the hardware store.','Why do you like Mondays?','Because we take the opportunity to do things we don’t usually have time to do.']}
      ]
    },
    hotel: {
      label:'Vacation / hotel',
      items:[
        {title:'Confirm a hotel booking', type:'Email', tense:'Would like + can/could', clue:'I would like / could you', task:'You booked a hotel for Friday night. Ask the hotel to confirm the check-in time and breakfast information.', phrases:['I would like to confirm','my booking','check-in time','breakfast information','thank you for your help'], modelA1:'Hello,\nI would like to confirm my booking for Friday night.\nCan you confirm the check-in time, please?\nThank you,\nKarine', modelA2:'Hello,\nI would like to confirm my booking for Friday night.\nCould you please confirm the check-in time and breakfast information?\nThank you for your help.\nKind regards,\nKarine', fr:'Pour demander poliment : Could you please confirm...? / I would like to confirm...', roleplay:['Good afternoon. How can I help you?','Hello. I would like to confirm my booking for Friday night.','Of course. What is your name, please?','My name is Karine. Could you confirm the check-in time?','Check-in is from 3 p.m.','Thank you. Is breakfast included?']},
        {title:'Problem: noisy hotel room', type:'Email / reception message', tense:'Present simple + could', clue:'I have a problem / could I', task:'Your hotel room is too noisy. Write a polite message asking to change rooms.', phrases:['I have a problem','my room is noisy','I cannot sleep','would it be possible','change rooms'], modelA1:'Hello,\nI have a problem with my room.\nIt is very noisy.\nCould I change rooms, please?\nThank you,\nKarine', modelA2:'Hello,\nI’m sorry, but I have a problem with my room. It is very noisy, and I cannot sleep well.\nWould it be possible to change rooms, please?\nThank you for your help.\nKind regards,\nKarine', fr:'Expliquez le problème simplement, puis demandez une solution poliment avec could ou would it be possible.', roleplay:['Good evening. How can I help you?','Hello. I have a problem with my room. It is very noisy.','I’m sorry to hear that.','Would it be possible to change rooms, please?','Let me check. Yes, we have another room available.','Thank you very much for your help.']}
      ]
    },
    restaurant: {
      label:'Vacation / restaurant',
      items:[
        {title:'Book a table', type:'SMS / Email', tense:'Would like', clue:'tonight / at 8 p.m.', task:'You want to book a table for two people tonight at 8 p.m.', phrases:['I would like to book','a table for two','tonight at 8 p.m.','if possible','could you confirm'], modelA1:'Hello,\nI would like to book a table for two people tonight at 8 p.m.\nThank you,\nKarine', modelA2:'Hello,\nI would like to book a table for two people tonight at 8 p.m., if possible.\nCould you please confirm if you have availability?\nKind regards,\nKarine', fr:'Pour réserver : I would like to book a table for... at...', roleplay:['Good evening. How can I help you?','Hello. I would like to book a table for two people tonight at 8 p.m.','Of course. What is your name, please?','My name is Karine.','Could you spell that, please?','K-A-R-I-N-E.']},
        {title:'Ask about vegetarian options', type:'Email / message', tense:'Do you have + would like', clue:'Do you have / I would like to know', task:'You want to know if the restaurant has vegetarian options and if you need to book for lunch.', phrases:['Do you have','vegetarian options','on the menu','do I need to book','for lunch'], modelA1:'Hello,\nDo you have vegetarian dishes, please?\nThank you,\nKarine', modelA2:'Hello,\nI would like to know if you have vegetarian options on the menu.\nCould you also tell me if I need to book a table for lunch?\nThank you,\nKarine', fr:'Pour demander une information : Do you have...? / I would like to know if...', roleplay:['Hello. Do you have vegetarian dishes?','Yes, we have two vegetarian options today.','Great. Do I need to book a table for lunch?','Yes, it is better to book.','Can I book a table for two at 12:30?','Of course. What is your name?']}
      ]
    },
    campsite: {
      label:'Campsite',
      items:[
        {title:'Ask about a campsite booking', type:'Email', tense:'Would like + availability', clue:'I would like to stay / do you have availability', task:'You want information about a campsite for two nights in July.', phrases:['I would like to stay','for two nights','in July','availability','price'], modelA1:'Hello,\nI would like information for two nights at your campsite.\nDo you have availability in July?\nThank you,\nKarine', modelA2:'Hello,\nI would like to stay at your campsite for two nights in July.\nCould you please tell me if you have availability and what the price is?\nThank you for your help.\nKind regards,\nKarine', fr:'Pour un camping : I would like to stay... / Do you have availability...? / What is the price?', roleplay:['Hello. I would like to stay at your campsite for two nights in July.','Of course. Which dates would you like?','From July 12th to July 14th.','We have availability.','Could you tell me the price, please?','It is 45 euros per night.']},
        {title:'Ask about campsite facilities', type:'Email / message', tense:'Is there / Are there', clue:'is there / are there', task:'Ask if there is a swimming pool, a restaurant and shops nearby.', phrases:['Is there','Are there','at the campsite','nearby','I would also like to know'], modelA1:'Hello,\nIs there a swimming pool at the campsite?\nIs there a restaurant?\nThank you,\nKarine', modelA2:'Hello,\nCould you please tell me if there is a swimming pool and a restaurant at the campsite?\nI would also like to know if there are shops nearby.\nKind regards,\nKarine', fr:'Is there = y a-t-il au singulier. Are there = y a-t-il au pluriel.', roleplay:['Is there a swimming pool at the campsite?','Yes, there is a swimming pool.','Is there a restaurant?','Yes, there is a small restaurant near reception.','Are there shops nearby?','Yes, there are shops ten minutes away.']}
      ]
    },
    pharmacy: {
      label:'Pharmacy',
      items:[
        {title:'Ask for help with a headache', type:'Speaking + short message', tense:'Can / should', clue:'I have / what can I take', task:'You have a headache and need advice at the pharmacy.', phrases:['I have a headache','I don’t feel very well','what can I take','how often should I take it'], modelA1:'Hello,\nI have a headache.\nWhat can I take, please?\nThank you,\nKarine', modelA2:'Hello,\nI have a headache and I don’t feel very well.\nCould you please recommend something?\nI would also like to know how often I should take it.\nThank you,\nKarine', fr:'À la pharmacie : I have a headache. What can I take? How often should I take it?', roleplay:['Hello. How can I help you?','Hello. I have a headache and I don’t feel very well.','Do you have any allergies?','No, I don’t. What can I take, please?','You can take this.','How often should I take it?']},
        {title:'Sore throat since yesterday', type:'Speaking + short message', tense:'Present perfect + since', clue:'since yesterday', task:'You have had a sore throat since yesterday and you want something without sugar.', phrases:['I have had','since yesterday','could you recommend','I would prefer','without sugar'], modelA1:'Hello,\nI have a sore throat.\nDo you have something for it, please?\nThank you,\nKarine', modelA2:'Hello,\nI have had a sore throat since yesterday.\nCould you please recommend something for it?\nI would prefer something without sugar, if possible.\nThank you,\nKarine', fr:'Since yesterday indique que le problème a commencé hier et continue maintenant : present perfect.', roleplay:['Hello. What is the problem?','I have had a sore throat since yesterday.','Do you have a fever?','No, I don’t. Could you recommend something?','Yes, you can try these lozenges.','Do you have something without sugar?']}
      ]
    }
  };

  const listeningItems = [
    {title:'Appointment confirmation', text:'Hello. I confirm your appointment at the salon on Friday at ten a.m. Please let me know if you need to change the time.', question:'When is the appointment?', answer:'It is on Friday at 10 a.m.'},
    {title:'Hotel problem', text:'Good evening. I have a problem with my room. It is very noisy, and I cannot sleep well. Would it be possible to change rooms, please?', question:'What is the problem?', answer:'The room is too noisy.'}
  ];

  const recordingPrompts = [
    'Tell me about your typical Monday. Use usually, then, after that, and finally.',
    'Tell me what you did last weekend. Use last weekend, then, after that, and finally.',
    'Call a restaurant and book a table for two people tonight at 8 p.m.',
    'At the pharmacy, explain that you have had a sore throat since yesterday.',
    'At the hotel, explain that your room is noisy and ask to change rooms.',
    'Ask Tisha three questions: one about routine, one about the past, and one about the future.'
  ];

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  function speak(text){
    if(!('speechSynthesis' in window)){ alert('Audio is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = $('#voiceChoice')?.value || 'en-GB';
    utterance.rate = 0.88;
    utterance.pitch = 1.02;
    const voices = window.speechSynthesis.getVoices();
    const chosen = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase()));
    if(chosen) utterance.voice = chosen;
    window.speechSynthesis.speak(utterance);
  }

  function renderSprint(){
    const item = sprintQuestions[Math.floor(Math.random() * sprintQuestions.length)];
    $('#sprintCard').innerHTML = `
      <p class="eyebrow">${item.cat}</p>
      <h3 class="big-question">${item.q}</h3>
      <div class="toolbar">
        <button class="btn btn-secondary" data-say="${escapeAttr(item.q)}">🔊 Listen to the question</button>
        <button class="mini" data-toggle-next>Show clue + model</button>
        <button class="mini" data-fr="${escapeAttr(item.fr)}">🇫🇷 French help</button>
      </div>
      <p class="fr-box" hidden></p>
      <div class="model-answer" hidden>
        <div class="meta-row"><span>Clue: ${item.clue}</span><span>Tense: ${item.tense}</span></div>
        <p><strong>A1 model:</strong> ${item.modelA1}</p>
        <p><strong>A2 model:</strong> ${item.modelA2}</p>
        <button class="btn btn-light" data-say="${escapeAttr(item.modelA2)}">🔊 Listen to the A2 model</button>
      </div>`;
  }

  function renderQuiz(containerId, scoreId, data){
    const container = $(containerId);
    let answered = 0, correct = 0;
    container.innerHTML = '';
    data.forEach((q, index) => {
      const card = document.createElement('article');
      card.className = 'quiz-card';
      const opts = shuffle(q.options);
      card.innerHTML = `<h4>${index + 1}. ${q.prompt}</h4>
        <button class="mini" data-hint="${escapeAttr(q.hint)}">💡 Hint</button><p class="hint-box" hidden></p>
        <div class="options">${opts.map(o => `<button class="option-btn" data-option="${escapeAttr(o)}">${o}</button>`).join('')}</div>
        <p class="feedback" hidden></p>`;
      const buttons = $$('.option-btn', card);
      const feedback = $('.feedback', card);
      buttons.forEach(btn => btn.addEventListener('click', () => {
        if(card.dataset.done === 'true') return;
        card.dataset.done = 'true'; answered++;
        const selected = btn.dataset.option;
        const isCorrect = selected === q.answer;
        if(isCorrect){ correct++; btn.classList.add('correct'); feedback.className = 'feedback correct'; feedback.textContent = `Correct. ${q.explain}`; }
        else { btn.classList.add('wrong'); const good = buttons.find(b => b.dataset.option === q.answer); if(good) good.classList.add('correct'); feedback.className = 'feedback wrong'; feedback.textContent = `Not this time. Correct answer: ${q.answer}. ${q.explain}`; }
        feedback.hidden = false;
        $(scoreId).textContent = `Score: ${correct} / ${answered}`;
      }));
      container.appendChild(card);
    });
    $(scoreId).textContent = 'Score: 0 / 0';
  }

  function renderInterview(){
    const key = $('#interviewCategory').value;
    const set = interviewSets[key];
    $('#interviewBox').innerHTML = `<h3>${set.title}</h3><p>${set.instruction}</p>
      <p><strong>Model question:</strong> ${set.model}</p>
      <ol>${set.questions.map(q => `<li>${q} <button class="mini" data-say="${escapeAttr(q)}">🔊</button></li>`).join('')}</ol>
      <div class="exam-note"><strong>Oral task:</strong> Ask Tisha two questions from this list, then ask one extra question from memory.</div>`;
  }

  function populateScenarioSelectors(){
    const catSelect = $('#scenarioCategory');
    catSelect.innerHTML = Object.entries(scenarios).map(([key, val]) => `<option value="${key}">${val.label}</option>`).join('');
    catSelect.addEventListener('change', () => { populateScenarioList(); renderScenario(); });
    $('#scenarioSelect').addEventListener('change', renderScenario);
    populateScenarioList(); renderScenario();
  }
  function populateScenarioList(){
    const key = $('#scenarioCategory').value;
    $('#scenarioSelect').innerHTML = scenarios[key].items.map((s, idx) => `<option value="${idx}">${s.title}</option>`).join('');
  }
  function currentScenario(){ return scenarios[$('#scenarioCategory').value].items[Number($('#scenarioSelect').value || 0)]; }
  function renderScenario(){
    const s = currentScenario();
    $('#scenarioBox').innerHTML = `<p class="eyebrow">${s.type}</p><h3>${s.title}</h3>
      <p class="task">${s.task}</p>
      <div class="meta-row"><span>Tense focus: ${s.tense}</span><span>Clue: ${s.clue}</span></div>
      <div class="phrase-bank">${s.phrases.map(p => `<span>${p}</span>`).join('')}</div>
      <button class="mini" data-fr="${escapeAttr(s.fr)}">🇫🇷 French help</button><p class="fr-box" hidden></p>`;
    $('#modelsBox').innerHTML = `<article class="model-card"><h3>Model A1</h3><pre>${s.modelA1}</pre><button class="btn btn-light" data-say="${escapeAttr(s.modelA1)}">🔊 Listen</button></article>
      <article class="model-card"><h3>Model A2</h3><pre>${s.modelA2}</pre><button class="btn btn-light" data-say="${escapeAttr(s.modelA2)}">🔊 Listen</button></article>`;
    renderRoleplay();
  }
  function renderRoleplay(){
    const s = currentScenario();
    const lines = s.roleplay || [];
    $('#roleplayBox').innerHTML = `<h3>${s.title}</h3><p><strong>Roleplay goal:</strong> speak naturally, then repeat without looking.</p>
      ${lines.map((line, idx) => `<div class="dialogue-line"><span class="speaker">${idx % 2 === 0 ? 'Tisha / other person' : 'You'}:</span> ${line}</div>`).join('')}
      <button class="btn btn-light" data-say="${escapeAttr(lines.join('. '))}">🔊 Listen to the dialogue</button>`;
  }

  function renderListening(){
    $('#listeningBox').innerHTML = listeningItems.map(item => `<article class="listening-card"><h3>${item.title}</h3>
      <p><strong>Task:</strong> Listen, then answer the question.</p>
      <button class="btn" data-say="${escapeAttr(item.text)}">🔊 Play</button>
      <button class="mini" data-toggle-next>Show transcript + answer</button>
      <div class="model-answer" hidden><p><strong>Transcript:</strong> ${item.text}</p><p><strong>Question:</strong> ${item.question}</p><p><strong>Answer:</strong> ${item.answer}</p></div>
    </article>`).join('');
  }

  const timers = {};
  function formatTime(sec){ const m = String(Math.floor(sec/60)).padStart(2,'0'); const s = String(sec%60).padStart(2,'0'); return `${m}:${s}`; }
  function startTimer(name, minutes){
    const display = $(`#${name}Timer`); if(!display) return;
    clearInterval(timers[name]);
    let remaining = Math.round(minutes * 60);
    display.textContent = formatTime(remaining);
    timers[name] = setInterval(() => {
      remaining -= 1; display.textContent = formatTime(Math.max(remaining,0));
      if(remaining <= 0){ clearInterval(timers[name]); display.textContent = '00:00'; }
    }, 1000);
  }
  function resetTimer(name){
    clearInterval(timers[name]);
    const defaults = {lesson:7200, sprint:60, roleplay:120};
    const display = $(`#${name}Timer`); if(display) display.textContent = formatTime(defaults[name] || 60);
  }

  let mediaRecorder, audioChunks = [];
  async function startRecording(){
    const status = $('#recorderStatus');
    if(!navigator.mediaDevices || !window.MediaRecorder){ status.textContent = 'Recorder not available. Use Voice Memos on your iPhone/iPad.'; return; }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = e => { if(e.data.size > 0) audioChunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, {type:'audio/webm'});
        const url = URL.createObjectURL(blob);
        $('#audioPlayback').src = url; $('#audioPlayback').hidden = false;
        $('#downloadRecording').href = url; $('#downloadRecording').hidden = false;
        stream.getTracks().forEach(track => track.stop());
        status.textContent = 'Recording finished. You can listen or download it.';
      };
      mediaRecorder.start();
      $('#startRecording').disabled = true; $('#stopRecording').disabled = false;
      status.textContent = 'Recording... speak clearly and slowly.';
    } catch(err){ status.textContent = 'Microphone permission was not available. Use Voice Memos on your phone.'; }
  }
  function stopRecording(){
    if(mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    $('#startRecording').disabled = false; $('#stopRecording').disabled = true;
  }

  function escapeAttr(str){ return String(str).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  document.addEventListener('click', (e) => {
    const sayBtn = e.target.closest('[data-say]'); if(sayBtn){ speak(sayBtn.dataset.say); return; }
    const frBtn = e.target.closest('[data-fr]'); if(frBtn){ const box = frBtn.parentElement.querySelector('.fr-box') || frBtn.nextElementSibling; if(box){ box.textContent = frBtn.dataset.fr; box.hidden = !box.hidden; } return; }
    const hintBtn = e.target.closest('[data-hint]'); if(hintBtn){ const box = hintBtn.parentElement.querySelector('.hint-box') || hintBtn.nextElementSibling; if(box){ box.textContent = hintBtn.dataset.hint; box.hidden = !box.hidden; } return; }
    const toggle = e.target.closest('[data-toggle-next]'); if(toggle){ const next = toggle.parentElement.querySelector('.model-answer') || toggle.closest('article')?.querySelector('.model-answer'); if(next) next.hidden = !next.hidden; return; }
    const t = e.target.closest('[data-timer]'); if(t){ startTimer(t.dataset.timer, Number(t.dataset.minutes)); return; }
    const rt = e.target.closest('[data-reset-timer]'); if(rt){ resetTimer(rt.dataset.resetTimer); return; }
  });

  document.addEventListener('DOMContentLoaded', () => {
    renderSprint();
    renderQuiz('#detectiveQuiz', '#detectiveScore', detectiveQuestions);
    renderInterview();
    populateScenarioSelectors();
    renderListening();
    $('#newSprint')?.addEventListener('click', renderSprint);
    $('#newInterview')?.addEventListener('click', renderInterview);
    $('#loadRoleplay')?.addEventListener('click', renderRoleplay);
    $('#countWords')?.addEventListener('click', () => {
      const text = $('#studentWriting').value.trim();
      const count = text ? text.split(/\s+/).length : 0;
      $('#wordCount').textContent = `${count} word${count === 1 ? '' : 's'}`;
    });
    $('#clearWriting')?.addEventListener('click', () => { $('#studentWriting').value = ''; $('#wordCount').textContent = '0 words'; });
    $('#newRecordingPrompt')?.addEventListener('click', () => { $('#recordingPrompt').textContent = recordingPrompts[Math.floor(Math.random() * recordingPrompts.length)]; });
    $('#startRecording')?.addEventListener('click', startRecording);
    $('#stopRecording')?.addEventListener('click', stopRecording);
    if('speechSynthesis' in window){ window.speechSynthesis.onvoiceschanged = () => {}; }
  });
})();
