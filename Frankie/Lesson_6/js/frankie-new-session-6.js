(function(){
  'use strict';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const jsWarning = $('#jsWarning');
  if(jsWarning) jsWarning.style.display = 'none';

  let selectedVoice = 'en-US';
  let voices = [];

  const vocabCategories = {
    all:'All categories',
    time:'Past time markers',
    activities:'Weekend activities',
    places:'Places and travel',
    food:'Food and restaurants',
    weather:'Weather',
    feelings:'Feelings and opinions',
    connectors:'Story connectors',
    questions:'Question words',
    verbs:'Essential past verbs'
  };

  const vocab = [
    ['time','🗓️','yesterday','hier','The day before today.','Yesterday, I worked in the morning.'],
    ['time','📅','last weekend','le week-end dernier','The weekend before this one.','Last weekend, I went for a walk.'],
    ['time','📆','last week','la semaine dernière','The week before this week.','Last week, I visited my family.'],
    ['time','🌙','last night','hier soir','The evening before today.','Last night, I watched TV.'],
    ['time','⏳','two days ago','il y a deux jours','Two days before today.','Two days ago, I went shopping.'],
    ['time','🏖️','last summer','l’été dernier','The summer before this one.','Last summer, I travelled.'],
    ['time','🎄','during the holidays','pendant les vacances','In a holiday period.','During the holidays, I relaxed.'],
    ['time','🕰️','in the past','dans le passé','Before now.','In the past, I worked a lot.'],

    ['activities','🚶','walked','ai marché / me suis promenée','Went on foot for pleasure or transport.','We walked in the countryside.'],
    ['activities','🛋️','relaxed','me suis détendue','Rested and felt calm.','I relaxed at home.'],
    ['activities','📺','watched TV','ai regardé la télé','Looked at television.','I watched TV in the evening.'],
    ['activities','🍳','cooked','ai cuisiné','Prepared food.','I cooked dinner.'],
    ['activities','👨‍👩‍👧','visited my family','ai rendu visite à ma famille','Went to see family members.','I visited my family on Sunday.'],
    ['activities','🛍️','went shopping','suis allée faire les magasins','Went to shops to buy things.','I went shopping on Saturday.'],
    ['activities','🧹','cleaned the house','ai nettoyé la maison','Made the house clean.','I cleaned the house in the morning.'],
    ['activities','📖','read a book','ai lu un livre','Looked at and understood written words.','I read a book before bed.'],
    ['activities','🐶','walked my dog','ai promené mon chien','Took the dog outside for a walk.','I walked my dog after lunch.'],

    ['places','🏔️','the mountains','la montagne','A place with high hills and nature.','I went to the mountains.'],
    ['places','🌳','the countryside','la campagne','A rural area with nature.','We walked in the countryside.'],
    ['places','🏖️','the seaside','le bord de mer','The area near the sea.','We went to the seaside.'],
    ['places','🏠','home','la maison','The place where you live.','I stayed at home.'],
    ['places','🏨','a hotel','un hôtel','A place where travellers sleep.','We stayed in a small hotel.'],
    ['places','🚉','the train station','la gare','A place where trains arrive and leave.','We took the train at the station.'],
    ['places','🛫','the airport','l’aéroport','A place where planes arrive and leave.','We arrived at the airport.'],
    ['places','🏘️','a small village','un petit village','A small place where people live.','We visited a small village.'],

    ['food','☕','had breakfast','ai pris le petit-déjeuner','Ate in the morning.','I had breakfast at eight.'],
    ['food','🥗','had lunch','ai déjeuné','Ate in the middle of the day.','We had lunch in a restaurant.'],
    ['food','🍝','had dinner','ai dîné','Ate in the evening.','We had dinner at home.'],
    ['food','🍽️','ate at a restaurant','ai mangé au restaurant','Had a meal in a restaurant.','We ate at a restaurant.'],
    ['food','🧾','paid the bill','ai payé l’addition','Paid for a meal or service.','I paid the bill after lunch.'],
    ['food','🥐','ordered food','ai commandé à manger','Asked for food in a restaurant.','I ordered fish and vegetables.'],

    ['weather','☀️','sunny','ensoleillé','With a lot of sun.','The weather was sunny.'],
    ['weather','🌧️','rainy','pluvieux','With rain.','It was rainy in the afternoon.'],
    ['weather','❄️','cold','froid','With a low temperature.','It was a little cold.'],
    ['weather','🌤️','nice weather','beau temps','Pleasant weather.','The weather was nice.'],
    ['weather','💨','windy','venteux','With a lot of wind.','It was windy near the sea.'],
    ['weather','🌡️','warm','chaud / doux','Pleasantly hot.','It was warm and sunny.'],

    ['feelings','😊','pleasant','agréable','Nice and enjoyable.','It was a pleasant weekend.'],
    ['feelings','😌','quiet','calme','Not noisy or busy.','It was quiet.'],
    ['feelings','🤩','interesting','intéressant','Something that gets your attention.','The village was interesting.'],
    ['feelings','😴','tiring','fatigant','Made you feel tired.','The walk was tiring.'],
    ['feelings','😍','beautiful','beau / belle','Very nice to look at.','The countryside was beautiful.'],
    ['feelings','👍','I enjoyed it','j’ai aimé / apprécié','I liked the experience.','I enjoyed it because it was quiet.'],
    ['feelings','🧘','relaxing','reposant','Helping you feel calm.','The weekend was relaxing.'],

    ['connectors','1️⃣','first','d’abord','Introduces the first action.','First, we walked.'],
    ['connectors','➡️','then','ensuite','Introduces the next action.','Then, we had lunch.'],
    ['connectors','⏭️','after that','après ça','Introduces another action.','After that, we came home.'],
    ['connectors','🌇','in the afternoon','l’après-midi','During the afternoon.','In the afternoon, we relaxed.'],
    ['connectors','🌃','in the evening','le soir','During the evening.','In the evening, I watched TV.'],
    ['connectors','💡','because','parce que','Gives a reason.','I enjoyed it because I like nature.'],
    ['connectors','🔗','so','donc / alors','Shows a result.','It was sunny, so we walked.'],
    ['connectors','↔️','but','mais','Shows contrast.','It was sunny, but it was cold.'],

    ['questions','📍','Where did you go?','Où êtes-vous allée ?','Ask about the place.','Where did you go last weekend?'],
    ['questions','🛠️','What did you do?','Qu’avez-vous fait ?','Ask about activities.','What did you do yesterday?'],
    ['questions','👥','Who did you go with?','Avec qui êtes-vous allée ?','Ask about people.','Who did you go with?'],
    ['questions','🍽️','What did you eat?','Qu’avez-vous mangé ?','Ask about food.','What did you eat at the restaurant?'],
    ['questions','❓','Did you enjoy it?','Avez-vous aimé ?','Ask about opinion.','Did you enjoy it?'],
    ['questions','🌤️','How was it?','Comment c’était ?','Ask for a general opinion.','How was your weekend?'],

    ['verbs','🚶','go → went','aller → suis allée','Irregular past of go.','I went to the countryside.'],
    ['verbs','🍽️','have → had','avoir / prendre → ai eu / ai pris','Irregular past of have.','We had lunch at home.'],
    ['verbs','🛠️','do → did','faire → ai fait','Irregular past of do.','I did my homework.'],
    ['verbs','👀','see → saw','voir → ai vu','Irregular past of see.','I saw my family.'],
    ['verbs','🥗','eat → ate','manger → ai mangé','Irregular past of eat.','I ate at a restaurant.'],
    ['verbs','👜','take → took','prendre → ai pris','Irregular past of take.','I took the train.'],
    ['verbs','🛍️','buy → bought','acheter → ai acheté','Irregular past of buy.','I bought a ticket.'],
    ['verbs','🏠','come → came','venir → suis venue','Irregular past of come.','I came home at five.'],
    ['verbs','🧩','make → made','faire / fabriquer → ai fait','Irregular past of make.','I made dinner.'],
    ['verbs','📦','get → got','obtenir / arriver → ai eu / suis arrivée','Irregular past of get.','I got home late.']
  ];

  const timeMarkers = [
    {label:'yesterday', sentence:'Yesterday, I worked in the morning.', fr:'Hier, j’ai travaillé le matin.'},
    {label:'last weekend', sentence:'Last weekend, I went to the countryside.', fr:'Le week-end dernier, je suis allée à la campagne.'},
    {label:'last week', sentence:'Last week, I visited my family.', fr:'La semaine dernière, j’ai rendu visite à ma famille.'},
    {label:'two days ago', sentence:'Two days ago, I went shopping.', fr:'Il y a deux jours, je suis allée faire les magasins.'},
    {label:'last summer', sentence:'Last summer, I travelled with my family.', fr:'L’été dernier, j’ai voyagé avec ma famille.'},
    {label:'during the holidays', sentence:'During the holidays, I relaxed at home.', fr:'Pendant les vacances, je me suis détendue à la maison.'}
  ];

  const models = {
    story:[
      ['A2 safe story','Last weekend, I stayed at home. I cooked, watched TV and relaxed. It was quiet. I enjoyed my weekend.','Le week-end dernier, je suis restée à la maison. J’ai cuisiné, regardé la télé et je me suis détendue. C’était calme. J’ai aimé mon week-end.'],
      ['A2+ target story','Last weekend, I went for a walk with my husband and my dog. We walked in the countryside and had lunch at home. The weather was nice, so it was a good day.','Le week-end dernier, je suis allée me promener avec mon mari et mon chien. Nous avons marché à la campagne et déjeuné à la maison. Il faisait beau, donc c’était une bonne journée.'],
      ['B1- stretch story','Last weekend was simple but very pleasant. I spent time with my husband and my dog. We went for a walk, enjoyed the fresh air and relaxed at home afterwards.','Le week-end dernier était simple mais très agréable. J’ai passé du temps avec mon mari et mon chien. Nous sommes allés nous promener, nous avons profité de l’air frais et nous nous sommes détendus à la maison ensuite.']
    ],
    positive:[
      ['regular verb','I visited my family.','J’ai rendu visite à ma famille.'],
      ['regular verb','We walked in the mountains.','Nous avons marché à la montagne.'],
      ['irregular verb','I went to the seaside.','Je suis allée au bord de mer.'],
      ['irregular verb','We had lunch in a restaurant.','Nous avons déjeuné au restaurant.'],
      ['weather','The weather was sunny.','Il faisait beau.'],
      ['opinion','It was quiet and pleasant.','C’était calme et agréable.']
    ],
    negative:[
      ['did not','I didn’t work yesterday.','Je n’ai pas travaillé hier.'],
      ['did not','We didn’t go out in the evening.','Nous ne sommes pas sortis le soir.'],
      ['did not','I didn’t eat at the restaurant.','Je n’ai pas mangé au restaurant.'],
      ['did not','She didn’t take the train.','Elle n’a pas pris le train.']
    ],
    questions:[
      ['where','Where did you go last weekend?','Où êtes-vous allée le week-end dernier ?'],
      ['what','What did you do?','Qu’avez-vous fait ?'],
      ['who','Who did you go with?','Avec qui êtes-vous allée ?'],
      ['food','What did you eat?','Qu’avez-vous mangé ?'],
      ['yes/no','Did you enjoy it?','Est-ce que vous avez aimé ?'],
      ['opinion','How was it?','Comment c’était ?']
    ],
    connectors:[
      ['first','First, we walked in the countryside.','D’abord, nous avons marché à la campagne.'],
      ['then','Then, we had lunch in a restaurant.','Ensuite, nous avons déjeuné au restaurant.'],
      ['after that','After that, we came home.','Après ça, nous sommes rentrés à la maison.'],
      ['because','I enjoyed it because it was quiet.','J’ai aimé parce que c’était calme.'],
      ['but','It was sunny, but it was cold.','Il faisait beau, mais il faisait froid.'],
      ['so','It was sunny, so we went for a walk.','Il faisait beau, donc nous sommes allés nous promener.']
    ]
  };

  const modelLabels = {
    story:'Complete story models',
    positive:'Positive past sentences',
    negative:'Negative sentences',
    questions:'Questions with did',
    connectors:'Connectors for storytelling'
  };

  const regularItems = [
    {base:'walk', ok:'walked', options:['walk','walked','went','walking']},
    {base:'visit', ok:'visited', options:['visited','visit','visitted','went']},
    {base:'relax', ok:'relaxed', options:['relax','relaxed','relaxeded','relex']},
    {base:'cook', ok:'cooked', options:['cooked','cook','cooking','came']},
    {base:'watch', ok:'watched', options:['watch','watched','watchd','was']},
    {base:'clean', ok:'cleaned', options:['cleaned','clean','cleant','did']}
  ];

  const irregularItems = [
    {base:'go', ok:'went', options:['go','goed','went','was']},
    {base:'have', ok:'had', options:['haved','has','had','have']},
    {base:'do', ok:'did', options:['did','do','done','does']},
    {base:'eat', ok:'ate', options:['eated','ate','eat','eats']},
    {base:'take', ok:'took', options:['taked','take','took','takes']},
    {base:'buy', ok:'bought', options:['buyed','buy','bought','brought']},
    {base:'come', ok:'came', options:['came','come','comed','comes']},
    {base:'see', ok:'saw', options:['saw','seed','see','seen']}
  ];

  const didItems = [
    {q:'___ you go to the countryside?', ok:'Did', options:['Did','Do','Were','Was']},
    {q:'Did you ___ lunch at home?', ok:'have', options:['had','have','has','having']},
    {q:'What did you ___ last weekend?', ok:'do', options:['did','do','does','doing']},
    {q:'Where did she ___?', ok:'go', options:['went','go','goes','going']},
    {q:'I didn’t ___ at the restaurant.', ok:'eat', options:['ate','eat','eating','eats']},
    {q:'We didn’t ___ the train.', ok:'take', options:['took','taking','take','takes']}
  ];

  const sentenceItems = [
    {q:'Choose the best sentence:', ok:'Last weekend, I went to the mountains.', options:['Last weekend, I went to the mountains.','Last weekend, I go to the mountains.','Last weekend, I went at the mountains.']},
    {q:'Choose the best sentence:', ok:'Did you enjoy your weekend?', options:['Did you enjoyed your weekend?','Did you enjoy your weekend?','Do you enjoyed your weekend?']},
    {q:'Choose the best sentence:', ok:'We had lunch in a small restaurant.', options:['We had lunch in a small restaurant.','We have lunch yesterday in a small restaurant.','We haved lunch in a small restaurant.']},
    {q:'Choose the best sentence:', ok:'It was sunny, but it was cold.', options:['It was sunny, but it was cold.','It were sunny, but it was cold.','It is sunny yesterday, but cold.']},
    {q:'Choose the best sentence:', ok:'I enjoyed it because it was quiet.', options:['I enjoyed because it was quiet.','I enjoyed it because it was quiet.','I enjoy it because it was quiet yesterday.']},
    {q:'Choose the best sentence:', ok:'I didn’t go out in the evening.', options:['I didn’t went out in the evening.','I didn’t go out in the evening.','I don’t went out in the evening.']}
  ];

  const listeningQuestions = [
    {q:'Where did she go last weekend?', ok:'To the countryside.', options:['To the countryside.','To the airport.','To the city centre.']},
    {q:'Who was she with?', ok:'Her husband and her dog.', options:['Her sister and her dog.','Her husband and her dog.','Her children and her husband.']},
    {q:'Where did they have lunch?', ok:'In a small restaurant.', options:['At home.','In a hotel.','In a small restaurant.']},
    {q:'How was the weather?', ok:'Sunny but a little cold.', options:['Rainy and warm.','Sunny but a little cold.','Windy and rainy.']},
    {q:'Why did she enjoy the weekend?', ok:'Because it was simple and quiet.', options:['Because it was expensive.','Because it was busy.','Because it was simple and quiet.']}
  ];

  const questionCards = [
    ['📍','Where did you go?','I went to the countryside.'],
    ['👥','Who did you go with?','I went with my husband and my dog.'],
    ['🛠️','What did you do?','We walked and relaxed.'],
    ['🍽️','What did you eat?','We had lunch in a restaurant.'],
    ['🌤️','How was the weather?','It was sunny, but a little cold.'],
    ['😊','Did you enjoy it?','Yes, I enjoyed it because it was quiet.'],
    ['🏠','What did you do in the evening?','In the evening, I stayed at home.'],
    ['💬','How was it?','It was simple and pleasant.'],
    ['❓','Would you like to do it again?','Yes, I would like to do it again.']
  ];

  function esc(str){
    return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function populateVoices(){
    voices = window.speechSynthesis && speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  }
  if('speechSynthesis' in window){
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }

  function speak(text){
    if(!('speechSynthesis' in window)){
      alert('Speech is not available in this browser.');
      return;
    }
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = selectedVoice;
    const preferred = voices.find(v => v.lang === selectedVoice && /Google|Microsoft|Samantha|Daniel|Serena|Karen|Moira/i.test(v.name)) || voices.find(v => v.lang === selectedVoice) || voices.find(v => v.lang && v.lang.startsWith(selectedVoice.slice(0,2)));
    if(preferred) utter.voice = preferred;
    utter.rate = 0.82;
    utter.pitch = 1;
    speechSynthesis.speak(utter);
  }

  document.addEventListener('click', (e)=>{
    const scrollBtn = e.target.closest('[data-scroll]');
    if(scrollBtn){
      const target = $(scrollBtn.dataset.scroll);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    }
    const sayBtn = e.target.closest('[data-say]');
    if(sayBtn){ speak(sayBtn.dataset.say); }
  });

  $$('.voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedVoice = btn.dataset.voice;
      $$('.voice-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });
  $('#stopVoice')?.addEventListener('click', () => speechSynthesis.cancel());
  $('#printBtn')?.addEventListener('click', () => window.print());

  function renderTimeChips(){
    const zone = $('#timeChips');
    const result = $('#timeResult');
    if(!zone || !result) return;
    zone.innerHTML = timeMarkers.map((item, i) => `<button class="chip" type="button" data-time="${i}">${esc(item.label)}</button>`).join('');
    zone.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-time]');
      if(!btn) return;
      $$('.chip', zone).forEach(ch => ch.classList.toggle('active', ch === btn));
      const item = timeMarkers[Number(btn.dataset.time)];
      result.innerHTML = `<strong>${esc(item.sentence)}</strong><br><span class="muted">${esc(item.fr)}</span><br><button class="listen-btn compact" type="button" data-say="${esc(item.sentence)}">▶ Listen</button>`;
    });
  }

  function renderVocab(){
    const select = $('#vocabCategory');
    const search = $('#vocabSearch');
    const grid = $('#vocabGrid');
    if(!select || !search || !grid) return;
    select.innerHTML = Object.entries(vocabCategories).map(([key,label]) => `<option value="${key}">${label}</option>`).join('');

    function update(){
      const cat = select.value;
      const term = search.value.trim().toLowerCase();
      const items = vocab.filter(([category,,word,fr,def,ex]) => {
        const catOk = cat === 'all' || category === cat;
        const text = `${word} ${fr} ${def} ${ex}`.toLowerCase();
        return catOk && (!term || text.includes(term));
      });
      grid.innerHTML = items.map(([,icon,word,fr,definition,example]) => `
        <article class="vocab-card">
          <div class="vocab-icon">${icon}</div>
          <div>
            <h3>${esc(word)}</h3>
            <p class="fr">${esc(fr)}</p>
            <p class="definition">${esc(definition)}</p>
            <p class="example">${esc(example)}</p>
            <button class="listen-btn compact" type="button" data-say="${esc(word.replace('→','to'))}. ${esc(example)}">▶ Listen</button>
          </div>
        </article>
      `).join('') || `<div class="result-box">No vocabulary found. Try another search.</div>`;
    }
    select.addEventListener('change', update);
    search.addEventListener('input', update);
    update();
  }

  let activeModel = 'story';
  function renderModels(){
    const tabs = $('#modelTabs');
    const grid = $('#modelGrid');
    if(!tabs || !grid) return;
    tabs.innerHTML = Object.entries(modelLabels).map(([key,label]) => `<button class="tab-btn ${key === activeModel ? 'active':''}" type="button" data-model="${key}">${esc(label)}</button>`).join('');
    grid.innerHTML = models[activeModel].map(([tag, sentence, translation]) => `
      <article class="model-card">
        <small>${esc(tag)}</small>
        <p><strong>${esc(sentence)}</strong></p>
        <p class="translation">${esc(translation)}</p>
        <button class="listen-btn compact" type="button" data-say="${esc(sentence)}">▶ Listen</button>
      </article>
    `).join('');
    tabs.onclick = (e) => {
      const btn = e.target.closest('[data-model]');
      if(!btn) return;
      activeModel = btn.dataset.model;
      renderModels();
    };
  }

  function makeSelectItem(item, i, name){
    return `<div class="practice-item">
      <label for="${name}${i}">${esc(item.base ? item.base + ' →' : item.q)}</label>
      <select class="choice-select" id="${name}${i}" data-ok="${esc(item.ok)}">
        <option value="">Choose...</option>
        ${item.options.map(opt => `<option value="${esc(opt)}">${esc(opt)}</option>`).join('')}
      </select>
    </div>`;
  }

  function renderPractice(){
    $('#regularItems').innerHTML = regularItems.map((item,i)=>makeSelectItem(item,i,'reg')).join('');
    $('#irregularItems').innerHTML = irregularItems.map((item,i)=>makeSelectItem(item,i,'irr')).join('');
    $('#didItems').innerHTML = didItems.map((item,i)=>makeSelectItem(item,i,'did')).join('');
    $('#sentenceItems').innerHTML = sentenceItems.map((item,i)=>`
      <div class="sentence-item">
        <strong>${esc(item.q)}</strong>
        <div class="sentence-options">
          ${item.options.map((opt,j)=>`<label class="radio-row"><input type="radio" name="sent${i}" value="${esc(opt)}" data-ok="${esc(item.ok)}"> <span>${esc(opt)}</span></label>`).join('')}
        </div>
      </div>`).join('');
  }

  function checkSelects(containerSel, feedbackSel, successHint, workHint){
    const selects = $$(containerSel + ' select');
    let score = 0;
    selects.forEach(sel => {
      const ok = sel.dataset.ok;
      const good = sel.value === ok;
      sel.style.borderColor = good ? '#1f8a5b' : '#d83b54';
      sel.style.background = good ? '#f0fff6' : '#fff5f5';
      if(good) score++;
    });
    const fb = $(feedbackSel);
    const total = selects.length;
    fb.className = 'feedback ' + (score === total ? 'good' : 'needs-work');
    fb.innerHTML = `<strong>${score}/${total} correct.</strong> ${score === total ? successHint : workHint}`;
  }

  function checkSentences(){
    let score = 0;
    sentenceItems.forEach((item,i)=>{
      const checked = $(`input[name="sent${i}"]:checked`);
      const rows = $$(`input[name="sent${i}"]`).map(input => input.closest('.radio-row'));
      rows.forEach(row => row.style.borderColor = 'rgba(110,75,143,.10)');
      if(checked && checked.value === item.ok){
        score++;
        checked.closest('.radio-row').style.borderColor = '#1f8a5b';
        checked.closest('.radio-row').style.background = '#f0fff6';
      } else if(checked){
        checked.closest('.radio-row').style.borderColor = '#d83b54';
        checked.closest('.radio-row').style.background = '#fff5f5';
      }
    });
    const fb = $('#sentencesFeedback');
    fb.className = 'feedback ' + (score === sentenceItems.length ? 'good' : 'needs-work');
    fb.innerHTML = `<strong>${score}/${sentenceItems.length} correct.</strong> ${score === sentenceItems.length ? 'Excellent. The past story sentences are clear.' : 'Check the time marker, the past verb and the word after did/didn’t.'}`;
  }

  function renderListening(){
    const quiz = $('#listeningQuiz');
    quiz.innerHTML = listeningQuestions.map((item,i)=>`
      <div class="quiz-question">
        <strong>${i+1}. ${esc(item.q)}</strong>
        <select class="choice-select" data-ok="${esc(item.ok)}">
          <option value="">Choose...</option>
          ${item.options.map(opt => `<option value="${esc(opt)}">${esc(opt)}</option>`).join('')}
        </select>
      </div>
    `).join('');
  }

  function checkListening(){
    const selects = $$('#listeningQuiz select');
    let score = 0;
    selects.forEach(sel => {
      const good = sel.value === sel.dataset.ok;
      sel.style.borderColor = good ? '#1f8a5b' : '#d83b54';
      sel.style.background = good ? '#f0fff6' : '#fff5f5';
      if(good) score++;
    });
    const fb = $('#listeningFeedback');
    fb.className = 'feedback ' + (score === selects.length ? 'good' : 'needs-work');
    fb.innerHTML = `<strong>${score}/${selects.length} correct.</strong> ${score === selects.length ? 'Great listening. Now repeat the story aloud.' : 'Listen again. Focus on where, who, food, weather and opinion.'}`;
  }

  function renderQuestions(){
    const grid = $('#questionGrid');
    grid.innerHTML = questionCards.map(([icon,q,a])=>`
      <article class="question-card">
        <div class="vocab-icon">${icon}</div>
        <h3>${esc(q)}</h3>
        <button class="listen-btn compact" type="button" data-say="${esc(q)}">▶ Listen question</button>
        <div class="answer-frame"><strong>Answer model:</strong><br>${esc(a)}</div>
        <button class="listen-btn compact" type="button" data-say="${esc(a)}">▶ Listen answer</button>
      </article>
    `).join('');
  }

  document.addEventListener('click', (e)=>{
    const check = e.target.closest('[data-check]');
    if(!check) return;
    const type = check.dataset.check;
    if(type === 'regular') checkSelects('#regularItems', '#regularFeedback', 'Excellent. Regular past verbs are stronger now.', 'Remember: most regular verbs use -ed.');
    if(type === 'irregular') checkSelects('#irregularItems', '#irregularFeedback', 'Great. These irregular verbs are very useful for past stories.', 'These verbs do not use -ed. Practise the small list again.');
    if(type === 'did') checkSelects('#didItems', '#didFeedback', 'Perfect. You remembered did + base verb.', 'After did or didn’t, use the base verb: go, have, do, eat, take.');
    if(type === 'sentences') checkSentences();
    if(type === 'listening') checkListening();
  });

  $('#toggleTranscript')?.addEventListener('click', () => {
    const transcript = $('#transcript');
    const hidden = transcript.hasAttribute('hidden');
    if(hidden){ transcript.removeAttribute('hidden'); $('#toggleTranscript').textContent = 'Hide transcript'; }
    else { transcript.setAttribute('hidden',''); $('#toggleTranscript').textContent = 'Show transcript'; }
  });

  function buildWriting(){
    const when = $('#wWhen').value.trim() || 'Last weekend';
    const where = $('#wWhere').value.trim() || 'to the countryside';
    const who = $('#wWho').value.trim() || 'my family';
    const act1 = $('#wAct1').value.trim() || 'walked';
    const act2 = $('#wAct2').value.trim() || 'relaxed';
    const opinion = $('#wOpinion').value.trim() || 'pleasant';
    const reason = $('#wReason').value.trim() || 'I like quiet places';
    const paragraph = `${when}, I went ${where}. I was with ${who}. We ${act1} and ${act2}. It was ${opinion}. I enjoyed it because ${reason}.`;
    $('#writingOutput').value = paragraph;
  }
  $('#buildWriting')?.addEventListener('click', buildWriting);
  $('#listenWriting')?.addEventListener('click', () => speak($('#writingOutput').value));
  $('#copyWriting')?.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText($('#writingOutput').value);
      $('#copyFeedback').className = 'feedback good';
      $('#copyFeedback').textContent = 'Copied. You can paste this into a document or message.';
    }catch(err){
      $('#copyFeedback').className = 'feedback needs-work';
      $('#copyFeedback').textContent = 'Copy was blocked by the browser. Select the text and copy manually.';
    }
  });

  renderTimeChips();
  renderVocab();
  renderModels();
  renderPractice();
  renderListening();
  renderQuestions();
})();
