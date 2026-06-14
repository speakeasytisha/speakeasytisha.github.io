(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  let selectedVoice = 'en-US';
  let voices = [];

  const categories = {
    core:'⭐ Core verbs',
    routine:'☀️ Daily routine',
    work:'💼 Work and service',
    travel:'✈️ Travel and problems',
    communication:'💬 Communication and opinions',
    irregular:'🔁 Irregular past verbs'
  };

  const verbs = [
    ['core','✅','be','être','Use for identity, feelings and descriptions.','I am happy. She is at home.'],
    ['core','🎒','have','avoir / prendre','Use for possession or meals.','I have three children. I have breakfast at seven.'],
    ['core','🛠️','do','faire','Use for activities and questions.','What do you do at the weekend?'],
    ['core','🚶','go','aller','Move from one place to another.','I go to work by car.'],
    ['core','🧩','make','faire / créer','Create or prepare something.','I make dinner in the evening.'],
    ['core','👜','take','prendre','Use for transport, objects or time.','I take the bus. It takes ten minutes.'],
    ['core','📦','get','obtenir / arriver','Receive, become or arrive.','I get home at five.'],
    ['core','🤝','help','aider','Do something useful for someone.','Could you help me, please?'],
    ['core','🙏','need','avoir besoin de','Say something is necessary.','I need to practise English.'],
    ['core','💛','like','aimer bien','Talk about preferences.','I like walking with my dog.'],

    ['routine','⏰','wake up','se réveiller','Stop sleeping.','I wake up at seven.'],
    ['routine','🛏️','get up','se lever','Leave your bed.','I get up at seven thirty.'],
    ['routine','🥐','have breakfast','prendre le petit-déjeuner','Eat in the morning.','I have breakfast at home.'],
    ['routine','🚗','leave home','partir de la maison','Go out of your home.','I leave home at eight.'],
    ['routine','▶️','start','commencer','Begin something.','I start work at nine.'],
    ['routine','🏁','finish','finir','Stop doing something.','I finish work at four.'],
    ['routine','🍳','cook','cuisiner','Prepare food.','I cook dinner in the evening.'],
    ['routine','📺','watch','regarder','Look at TV or a video.','I watch TV after work.'],
    ['routine','🌿','relax','se détendre','Rest and feel calm.','I relax at home.'],
    ['routine','🐕','walk','marcher / promener','Move on foot.','I walk with my dog.'],

    ['work','💻','work','travailler','Do your job.','I work in the morning.'],
    ['work','📞','call','appeler','Use the phone.','I call a colleague.'],
    ['work','✉️','send','envoyer','Make a message go to someone.','I send an email.'],
    ['work','📥','receive','recevoir','Get something from someone.','I receive a message.'],
    ['work','❓','ask','demander / poser une question','Say a question.','I ask a question.'],
    ['work','🧾','answer','répondre','Reply to someone.','I answer emails.'],
    ['work','🔎','check','vérifier','Look carefully.','Could you check it, please?'],
    ['work','🗂️','organise','organiser','Put things in order.','I organise my documents.'],
    ['work','🧑‍🏫','explain','expliquer','Make something clear.','Can you explain, please?'],
    ['work','🖱️','use','utiliser','Do something with a tool.','I use a computer at work.'],

    ['travel','🛎️','book','réserver','Reserve a room, table or ticket.','I book a hotel room.'],
    ['travel','🛬','arrive','arriver','Come to a place.','I arrive at the hotel.'],
    ['travel','🚪','leave','partir / quitter','Go away from a place.','I leave at ten.'],
    ['travel','📍','find','trouver','Discover where something is.','I can’t find the platform.'],
    ['travel','💳','pay','payer','Give money for something.','Can I pay by card?'],
    ['travel','⏳','wait','attendre','Stay until something happens.','I wait for the train.'],
    ['travel','🔄','change','changer','Make something different.','Can I change rooms?'],
    ['travel','🚫','miss','rater / manquer','Not catch transport.','I missed the train yesterday.'],
    ['travel','😟','lose','perdre','Not know where something is.','I lost my ticket.'],
    ['travel','🔧','repair','réparer','Fix something broken.','Can you repair it, please?'],

    ['communication','👂','understand','comprendre','Know the meaning.','I don’t understand.'],
    ['communication','🔁','repeat','répéter','Say something again.','Could you repeat, please?'],
    ['communication','🗣️','speak','parler','Use your voice in a language.','I speak a little English.'],
    ['communication','💬','say','dire','Use words.','Can you say that again?'],
    ['communication','📢','tell','dire / raconter à quelqu’un','Give information to someone.','Can you tell me the time?'],
    ['communication','🤔','think','penser','Have an idea or opinion.','I think it is a good idea.'],
    ['communication','✨','prefer','préférer','Like one thing more than another.','I prefer quiet places.'],
    ['communication','😊','enjoy','aimer / apprécier','Like doing something.','I enjoy walking.'],
    ['communication','🙋','want','vouloir','Desire something.','I want to speak more easily.'],
    ['communication','📝','write','écrire','Put words on paper or screen.','I write short sentences.'],

    ['irregular','🚶','go → went','aller → allé(e)','Past of go.','Yesterday, I went shopping.'],
    ['irregular','🎒','have → had','avoir/prendre → ai eu / ai pris','Past of have.','Yesterday, I had lunch at home.'],
    ['irregular','🛠️','do → did','faire → ai fait','Past of do.','Yesterday, I did my homework.'],
    ['irregular','👀','see → saw','voir → ai vu','Past of see.','I saw my family last weekend.'],
    ['irregular','👜','take → took','prendre → ai pris','Past of take.','I took the train.'],
    ['irregular','🛍️','buy → bought','acheter → ai acheté','Past of buy.','I bought a ticket.'],
    ['irregular','🍽️','eat → ate','manger → ai mangé','Past of eat.','I ate at the restaurant.'],
    ['irregular','🧩','make → made','faire/créer → ai fait','Past of make.','I made dinner.'],
    ['irregular','🏠','come → came','venir → suis venu(e)','Past of come.','I came home at five.'],
    ['irregular','📦','get → got','obtenir/arriver → ai eu / suis arrivé(e)','Past of get.','I got home at six.']
  ];

  const timeMarkers = [
    {label:'yesterday', type:'past', sentence:'Yesterday, I worked in the morning.', fr:'Hier, j’ai travaillé le matin.'},
    {label:'today', type:'present', sentence:'Today, I am learning English.', fr:'Aujourd’hui, j’apprends l’anglais.'},
    {label:'usually', type:'present', sentence:'Usually, I start work at eight.', fr:'D’habitude, je commence le travail à huit heures.'},
    {label:'last weekend', type:'past', sentence:'Last weekend, I went for a walk.', fr:'Le week-end dernier, je suis allée me promener.'},
    {label:'tomorrow', type:'future', sentence:'Tomorrow, I am going to relax.', fr:'Demain, je vais me détendre.'},
    {label:'next week', type:'future', sentence:'Next week, I am going to practise English.', fr:'La semaine prochaine, je vais pratiquer l’anglais.'}
  ];

  const models = {
    present:[
      ['routine','I usually start work at eight.','Je commence d’habitude le travail à huit heures.'],
      ['routine','I finish work at four.','Je finis le travail à seize heures.'],
      ['routine','After work, I often relax at home.','Après le travail, je me détends souvent à la maison.'],
      ['third person','She starts work at eight.','Elle commence le travail à huit heures.'],
      ['question','Do you work every day?','Est-ce que vous travaillez tous les jours ?'],
      ['negative','I don’t work on Sunday.','Je ne travaille pas le dimanche.']
    ],
    past:[
      ['regular','Yesterday, I worked in the morning.','Hier, j’ai travaillé le matin.'],
      ['regular','I finished at four p.m.','J’ai fini à seize heures.'],
      ['irregular','Last weekend, I went shopping.','Le week-end dernier, je suis allée faire les magasins.'],
      ['irregular','I had lunch with my family.','J’ai déjeuné avec ma famille.'],
      ['question','Did you work yesterday?','Avez-vous travaillé hier ?'],
      ['negative','I didn’t go to work yesterday.','Je ne suis pas allée travailler hier.']
    ],
    future:[
      ['plan','Tomorrow, I am going to relax.','Demain, je vais me détendre.'],
      ['plan','Next week, I am going to practise English.','La semaine prochaine, je vais pratiquer l’anglais.'],
      ['travel','This summer, we are going to travel.','Cet été, nous allons voyager.'],
      ['question','Are you going to work tomorrow?','Est-ce que vous allez travailler demain ?'],
      ['negative','I am not going to go out tonight.','Je ne vais pas sortir ce soir.'],
      ['reason','I am going to practise because I want to improve.','Je vais pratiquer parce que je veux progresser.']
    ],
    patterns:[
      ['need to + verb','I need to practise English.','J’ai besoin de pratiquer l’anglais.'],
      ['want to + verb','I want to speak more easily.','Je veux parler plus facilement.'],
      ['would like to + verb','I would like to travel with confidence.','J’aimerais voyager avec confiance.'],
      ['like + -ing','I like walking with my dog.','J’aime me promener avec mon chien.'],
      ['enjoy + -ing','I enjoy spending time with my family.','J’aime passer du temps avec ma famille.'],
      ['can + verb','I can ask for help.','Je peux demander de l’aide.']
    ],
    questions:[
      ['present','What do you usually do after work?','Que faites-vous d’habitude après le travail ?'],
      ['past','What did you do yesterday?','Qu’avez-vous fait hier ?'],
      ['future','What are you going to do tomorrow?','Qu’allez-vous faire demain ?'],
      ['helper','Do you like walking?','Aimez-vous vous promener ?'],
      ['helper','Did you go shopping last weekend?','Êtes-vous allée faire les magasins le week-end dernier ?'],
      ['helper','Are you going to travel this summer?','Allez-vous voyager cet été ?']
    ]
  };

  const modelLabels = {
    present:'Present simple: today / usually',
    past:'Past simple: yesterday / last weekend',
    future:'Future: going to',
    patterns:'Verb patterns: need to / like -ing',
    questions:'Question models'
  };

  const formItems = [
    {q:'Yesterday, I ___ shopping.', ok:'went', options:['go','went','am going to go','goes']},
    {q:'Usually, I ___ work at eight.', ok:'start', options:['start','started','am going to start','starts']},
    {q:'Tomorrow, I ___ relax.', ok:'am going to', options:['am going to','went','worked','goes']},
    {q:'She ___ work at four.', ok:'finishes', options:['finish','finished','finishes','am finishing']},
    {q:'Last weekend, I ___ lunch with my family.', ok:'had', options:['have','has','had','am going to have']},
    {q:'Today, I ___ English.', ok:'am practising', options:['practised','am practising','went','practises']}
  ];

  const timeZoneItems = [
    {marker:'every day', ok:'present'},
    {marker:'last weekend', ok:'past'},
    {marker:'tomorrow', ok:'future'},
    {marker:'usually', ok:'present'},
    {marker:'two days ago', ok:'past'},
    {marker:'next month', ok:'future'}
  ];

  const regularItems = [
    {base:'work', ok:'worked'},
    {base:'start', ok:'started'},
    {base:'finish', ok:'finished'},
    {base:'help', ok:'helped'},
    {base:'check', ok:'checked'},
    {base:'organise', ok:'organised'}
  ];

  const irregularItems = [
    {base:'go', ok:'went'},
    {base:'have', ok:'had'},
    {base:'do', ok:'did'},
    {base:'take', ok:'took'},
    {base:'buy', ok:'bought'},
    {base:'come', ok:'came'}
  ];

  const helperItems = [
    {q:'___ you work every day?', ok:'Do', options:['Do','Did','Are','Does']},
    {q:'___ you work yesterday?', ok:'Did', options:['Do','Did','Are','Does']},
    {q:'___ you going to work tomorrow?', ok:'Are', options:['Do','Did','Are','Does']},
    {q:'___ she start at eight?', ok:'Does', options:['Do','Did','Are','Does']},
    {q:'___ you like walking?', ok:'Do', options:['Do','Did','Are','Does']},
    {q:'___ you go shopping last weekend?', ok:'Did', options:['Do','Did','Are','Does']}
  ];

  const patternItems = [
    {q:'I need ___ practise English.', ok:'to', options:['to','-','ing','for']},
    {q:'I would like ___ travel.', ok:'to', options:['to','-','ing','for']},
    {q:'I like ___.', ok:'walking', options:['walk','to walking','walking','walked']},
    {q:'I enjoy ___ time with my family.', ok:'spending', options:['spend','to spend','spending','spent']},
    {q:'I want ___ speak more easily.', ok:'to', options:['to','-','ing','for']},
    {q:'I can ___ for help.', ok:'ask', options:['to ask','asking','asked','ask']}
  ];

  const transforms = [
    {label:'work', present:'Today, I work in the morning.', past:'Yesterday, I worked in the morning.', future:'Tomorrow, I am going to work in the morning.'},
    {label:'go shopping', present:'Today, I go shopping.', past:'Yesterday, I went shopping.', future:'Tomorrow, I am going to go shopping.'},
    {label:'have lunch', present:'Today, I have lunch at home.', past:'Yesterday, I had lunch at home.', future:'Tomorrow, I am going to have lunch at home.'},
    {label:'walk with my dog', present:'Today, I walk with my dog.', past:'Yesterday, I walked with my dog.', future:'Tomorrow, I am going to walk with my dog.'},
    {label:'practise English', present:'Today, I practise English.', past:'Yesterday, I practised English.', future:'Tomorrow, I am going to practise English.'},
    {label:'ask for help', present:'Today, I ask for help.', past:'Yesterday, I asked for help.', future:'Tomorrow, I am going to ask for help.'}
  ];

  const listeningQuestions = [
    {q:'Did Frankie work yesterday?', ok:'Yes, in the morning.', options:['Yes, in the morning.','No, she was on holiday.','Yes, at the restaurant.']},
    {q:'What is Frankie doing today?', ok:'She is learning English.', options:['She is learning English.','She is buying a ticket.','She is taking the train.']},
    {q:'What are they practising?', ok:'Verbs and questions.', options:['Verbs and questions.','Food and restaurants.','Numbers and prices.']},
    {q:'What is Frankie going to do tomorrow?', ok:'Relax and walk with her dog.', options:['Relax and walk with her dog.','Work at the airport.','Book a hotel.']}
  ];

  function esc(str){
    return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function populateVoices(){
    voices = window.speechSynthesis && speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  }

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.lang === selectedVoice) || voices.find(v => v.lang && v.lang.startsWith(selectedVoice.split('-')[0])) || voices[0];
    if(voice) utterance.voice = voice;
    utterance.lang = selectedVoice;
    utterance.rate = 0.86;
    speechSynthesis.speak(utterance);
  }

  function setFeedback(el, message, type){
    if(!el) return;
    el.className = 'feedback ' + (type || '');
    el.innerHTML = message;
  }

  function initNav(){
    $$('[data-scroll]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = $(btn.dataset.scroll);
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
    $('#printBtn')?.addEventListener('click', () => window.print());
    $('#jsWarning')?.classList.add('hidden');
  }

  function initAudio(){
    populateVoices();
    if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = populateVoices;
    $$('.voice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedVoice = btn.dataset.voice;
        $$('.voice-btn').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    $('#stopVoice')?.addEventListener('click', () => speechSynthesis.cancel());
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-say]');
      if(btn) speak(btn.dataset.say);
    });
  }

  function initWarmup(){
    const box = $('#timeChips');
    const out = $('#timeResult');
    if(!box || !out) return;
    timeMarkers.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        $$('#timeChips .chip').forEach(x => x.classList.remove('selected'));
        btn.classList.add('selected');
        out.innerHTML = `<strong>${esc(item.type.toUpperCase())}</strong><br>${esc(item.sentence)}<br><span class="fr">${esc(item.fr)}</span><br><button class="listen-btn compact" type="button" data-say="${esc(item.sentence)}">▶ Listen</button>`;
      });
      box.appendChild(btn);
    });
  }

  function initVerbBank(){
    const sel = $('#verbCategory');
    const search = $('#verbSearch');
    const grid = $('#verbGrid');
    if(!sel || !grid) return;
    Object.entries(categories).forEach(([key, label]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = label;
      sel.appendChild(option);
    });
    function render(){
      const cat = sel.value;
      const q = (search?.value || '').trim().toLowerCase();
      grid.innerHTML = '';
      const filtered = verbs.filter(v => v[0] === cat).filter(v => !q || v.join(' ').toLowerCase().includes(q));
      if(filtered.length === 0){
        grid.innerHTML = '<div class="empty">No verbs found. Try another search.</div>';
        return;
      }
      filtered.forEach(v => {
        const card = document.createElement('article');
        card.className = 'vocab-card';
        card.innerHTML = `
          <div class="vocab-head"><span class="vocab-icon">${esc(v[1])}</span><div><h3>${esc(v[2])}</h3><div class="fr">${esc(v[3])}</div></div></div>
          <div class="definition">${esc(v[4])}</div>
          <p class="example">${esc(v[5])}</p>
          <button class="listen-btn compact" type="button" data-say="${esc(v[2].replace('→','to'))}. ${esc(v[5])}">▶ Listen</button>`;
        grid.appendChild(card);
      });
    }
    sel.addEventListener('change', render);
    search?.addEventListener('input', render);
    render();
  }

  function initModels(){
    const sel = $('#modelCategory');
    const bank = $('#sentenceBank');
    if(!sel || !bank) return;
    Object.entries(modelLabels).forEach(([key, label]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = label;
      sel.appendChild(option);
    });
    function render(){
      bank.innerHTML = '';
      models[sel.value].forEach(m => {
        const card = document.createElement('article');
        card.className = 'sentence-card';
        card.innerHTML = `<span class="tag">${esc(m[0])}</span><div class="en">${esc(m[1])}</div><div class="fr">${esc(m[2])}</div><button class="listen-btn compact" type="button" data-say="${esc(m[1])}">▶ Listen</button>`;
        bank.appendChild(card);
      });
    }
    sel.addEventListener('change', render);
    render();
  }

  function makeSelect(options, valueAttr=''){
    return `<select class="inline-select" ${valueAttr}>${['Choose...', ...options].map((o,i) => `<option value="${i?esc(o):''}">${esc(o)}</option>`).join('')}</select>`;
  }

  function renderSimpleSelectBox(container, items, optionsResolver, labelResolver){
    container.innerHTML = '';
    items.forEach((item, i) => {
      const line = document.createElement('div');
      line.className = 'question-line';
      line.innerHTML = `<label>${labelResolver(item, i)}</label>${makeSelect(optionsResolver(item), `data-index="${i}"`)}`;
      container.appendChild(line);
    });
  }

  function scoreSelects(container, items, feedbackEl, successMsg, hintMsg){
    const selects = $$('select', container);
    let score = 0;
    selects.forEach(sel => {
      const item = items[Number(sel.dataset.index)];
      if(sel.value === item.ok) score++;
    });
    if(score === items.length) setFeedback(feedbackEl, `Excellent: ${score}/${items.length}. ${successMsg}`, 'good');
    else setFeedback(feedbackEl, `${score}/${items.length}. ${hintMsg}`, score ? 'try' : 'bad');
  }

  function initPractice(){
    const formBox = $('#formBox');
    renderSimpleSelectBox(formBox, formItems, item => item.options, item => item.q.replace('___','_____'));
    $('#checkForms')?.addEventListener('click', () => scoreSelects(formBox, formItems, $('#formFeedback'), 'You are choosing the verb form from the time marker.', 'Look at the time marker: yesterday = past, usually = present, tomorrow = going to.'));
    $('#resetForms')?.addEventListener('click', () => { $$('select', formBox).forEach(s => s.value=''); setFeedback($('#formFeedback'), '', ''); $('#formFeedback').style.display='none'; });

    const timeBox = $('#timeZoneBox');
    renderSimpleSelectBox(timeBox, timeZoneItems, () => ['present','past','future'], item => `<strong>${esc(item.marker)}</strong> = ?`);
    $('#checkTimeZones')?.addEventListener('click', () => scoreSelects(timeBox, timeZoneItems, $('#timeZoneFeedback'), 'You can read the time clues.', 'Remember: every day/usually = present, last/yesterday/ago = past, tomorrow/next = future.'));

    const regularBox = $('#regularBox');
    renderSimpleSelectBox(regularBox, regularItems, item => [item.base + 'ed', item.base + 'd', item.ok, item.base], item => `${esc(item.base)} → ?`);
    $('#checkRegular')?.addEventListener('click', () => scoreSelects(regularBox, regularItems, $('#regularFeedback'), 'Regular past verbs are getting clearer.', 'Most regular verbs take -ed. Verbs ending in e take -d: organise → organised.'));

    const irregularBox = $('#irregularBox');
    const irregularOptions = ['went','had','did','took','bought','came'];
    renderSimpleSelectBox(irregularBox, irregularItems, () => irregularOptions, item => `${esc(item.base)} → ?`);
    $('#checkIrregular')?.addEventListener('click', () => scoreSelects(irregularBox, irregularItems, $('#irregularFeedback'), 'Great. These irregular verbs are essential for A2 speaking.', 'Irregular verbs do not use -ed. They must be memorised little by little.'));

    const helperBox = $('#helperBox');
    renderSimpleSelectBox(helperBox, helperItems, item => item.options, item => item.q.replace('___','_____'));
    $('#checkHelpers')?.addEventListener('click', () => scoreSelects(helperBox, helperItems, $('#helperFeedback'), 'Questions are becoming more automatic.', 'Use Do for present, Did for past, Are for going to, Does for he/she/it.'));

    const patternBox = $('#patternBox');
    renderSimpleSelectBox(patternBox, patternItems, item => item.options, item => item.q.replace('___','_____'));
    $('#checkPatterns')?.addEventListener('click', () => scoreSelects(patternBox, patternItems, $('#patternFeedback'), 'Good verb patterns. These help your speaking sound more natural.', 'Need/want/would like + to + verb. Like/enjoy + verb-ing. Can + base verb.'));
  }

  function initTransformer(){
    const sel = $('#transformVerb');
    const out = $('#transformOutput');
    if(!sel || !out) return;
    transforms.forEach((t, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = t.label;
      sel.appendChild(option);
    });
    function render(){
      const t = transforms[Number(sel.value)] || transforms[0];
      out.innerHTML = `<div class="transform-card">
        <div class="transform-row"><span class="time-pill present">Today</span><strong>${esc(t.present)}</strong><button class="listen-btn compact" type="button" data-say="${esc(t.present)}">▶ Listen</button></div>
        <div class="transform-row"><span class="time-pill past">Yesterday</span><strong>${esc(t.past)}</strong><button class="listen-btn compact" type="button" data-say="${esc(t.past)}">▶ Listen</button></div>
        <div class="transform-row"><span class="time-pill future">Tomorrow</span><strong>${esc(t.future)}</strong><button class="listen-btn compact" type="button" data-say="${esc(t.future)}">▶ Listen</button></div>
      </div>`;
    }
    $('#buildTransform')?.addEventListener('click', render);
    render();
  }

  function initListening(){
    $('#toggleTranscript')?.addEventListener('click', e => {
      const transcript = $('#transcript');
      if(!transcript) return;
      transcript.classList.toggle('hidden');
      e.currentTarget.textContent = transcript.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    });
    const box = $('#listeningQuiz');
    if(box){
      renderSimpleSelectBox(box, listeningQuestions, item => item.options, item => item.q);
    }
    $('#checkListening')?.addEventListener('click', () => scoreSelects(box, listeningQuestions, $('#listeningFeedback'), 'You understood the key information.', 'Listen again and focus on the verbs: worked, learning, practising, going to relax.'));
  }

  function initWriting(){
    const out = $('#writingOutput');
    $('#generateWriting')?.addEventListener('click', () => {
      const y = ($('#yesterdayInput')?.value || 'worked in the morning').trim();
      const t = ($('#todayInput')?.value || 'learning English').trim();
      const m = ($('#tomorrowInput')?.value || 'relax and walk with my dog').trim();
      const b = ($('#becauseInput')?.value || 'I want to speak with more confidence').trim();
      out.value = `Yesterday, I ${y}. Today, I am ${t}. Tomorrow, I am going to ${m}. I am practising because ${b}.`;
    });
    $('#copyWriting')?.addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(out.value);
        const btn = $('#copyWriting');
        const original = btn.textContent;
        btn.textContent = 'Copied ✓';
        setTimeout(() => btn.textContent = original, 1200);
      }catch(err){
        out.select();
        document.execCommand('copy');
      }
    });
    $('#listenWriting')?.addEventListener('click', () => speak(out.value));
  }

  function init(){
    initNav();
    initAudio();
    initWarmup();
    initVerbBank();
    initModels();
    initPractice();
    initTransformer();
    initListening();
    initWriting();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
