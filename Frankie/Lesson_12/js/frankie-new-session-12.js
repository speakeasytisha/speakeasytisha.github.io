(function(){
  'use strict';

  const jsWarning = document.getElementById('jsWarning');
  if (jsWarning) jsWarning.classList.add('hidden');

  let chosenVoice = 'en-US';
  const synth = window.speechSynthesis;

  function normalize(text){
    return (text || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[’]/g,"'")
      .replace(/[?.!]+$/,'')
      .replace(/\s+/g,' ');
  }

  function escapeHtml(str){
    return (str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }

  function speak(text){
    if (!text || !synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = chosenVoice;
    utterance.rate = 0.82;
    utterance.pitch = 1;
    const voices = synth.getVoices ? synth.getVoices() : [];
    const preferred = voices.find(v => v.lang === chosenVoice) || voices.find(v => v.lang && v.lang.startsWith(chosenVoice.slice(0,2)));
    if (preferred) utterance.voice = preferred;
    synth.speak(utterance);
  }

  if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => synth.getVoices();
  }

  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  document.querySelectorAll('[data-say]').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.say));
  });

  document.querySelectorAll('.voice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chosenVoice = btn.dataset.voice || 'en-US';
      document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('stopVoice')?.addEventListener('click', () => synth?.cancel());
  document.getElementById('printBtn')?.addEventListener('click', () => window.print());

  const vocab = [
    ['Campervan basics','🚐','campervan','camping-car','A vehicle you can travel and sleep in.','I travelled around France in a campervan.'],
    ['Campervan basics','🛏️','bed inside','lit à l’intérieur','A place to sleep inside the campervan.','There was a small bed inside the campervan.'],
    ['Campervan basics','🍳','small kitchen','petite cuisine','A small place to prepare food.','The campervan had a small kitchen.'],
    ['Campervan basics','🔌','electricity hook-up','branchement électrique','A connection to electricity at a campsite.','We used the electricity hook-up at the campsite.'],
    ['Campervan basics','💧','water tank','réservoir d’eau','A tank that stores water in a campervan.','We filled the water tank before leaving.'],
    ['Campervan basics','🚿','shower block','bloc sanitaire / douches','A campsite building with showers.','The shower block was clean.'],
    ['Campervan basics','🧺','laundry area','espace laverie','A place to wash clothes.','There was a laundry area at the campsite.'],
    ['Campervan basics','🧭','route','itinéraire','The way you travel from place to place.','Our route was very beautiful.'],

    ['Parking and places to stay','🅿️','parking area','aire de stationnement','A place where vehicles can park.','We found a quiet parking area.'],
    ['Parking and places to stay','🚐','campervan area','aire de camping-car','A special parking area for campervans.','We stayed in a campervan area for one night.'],
    ['Parking and places to stay','🏕️','campsite','camping','A place where people stay in tents or campervans.','The campsite was near the river.'],
    ['Parking and places to stay','🌳','pitch','emplacement','A small place for one campervan or tent.','Our pitch was under the trees.'],
    ['Parking and places to stay','🏞️','near the river','près de la rivière','Close to the river.','We parked near the river.'],
    ['Parking and places to stay','🌊','near the sea','près de la mer','Close to the sea.','The campsite was near the sea.'],
    ['Parking and places to stay','⛔','no parking','stationnement interdit','You cannot park here.','There was a no parking sign.'],
    ['Parking and places to stay','📋','rules','règlement / règles','Instructions you must follow.','The campsite rules were simple.'],

    ['Campsite facilities','🚻','toilets','toilettes','A place to use the bathroom.','There were clean toilets.'],
    ['Campsite facilities','🚿','showers','douches','A place to wash yourself.','There were hot showers.'],
    ['Campsite facilities','🧽','washing-up area','espace vaisselle','A place to wash dishes.','We used the washing-up area after dinner.'],
    ['Campsite facilities','🛒','small shop','petite épicerie','A shop with basic food or objects.','There was a small shop at the campsite.'],
    ['Campsite facilities','🏊','swimming pool','piscine','A place to swim.','There was a swimming pool for families.'],
    ['Campsite facilities','🛝','playground','aire de jeux','A place for children to play.','There was a playground near the reception.'],
    ['Campsite facilities','👩‍💼','reception','accueil','The place where you check in or ask questions.','I asked at reception.'],
    ['Campsite facilities','📶','Wi-Fi','Wi-Fi','Internet connection.','The Wi-Fi was not very good.'],

    ['Renting a house','🏡','rented house','maison louée','A house you pay to use for a short time.','I rented a house with my family.'],
    ['Renting a house','🔑','keys','clés','Objects to open a door.','We collected the keys in the afternoon.'],
    ['Renting a house','🛋️','living room','salon','A room where people relax.','There was a large living room.'],
    ['Renting a house','🍽️','dining table','table à manger','A table for meals.','We ate together around the dining table.'],
    ['Renting a house','🛌','bedroom','chambre','A room for sleeping.','There were three bedrooms.'],
    ['Renting a house','🌿','garden','jardin','An outside space with plants.','The children played in the garden.'],
    ['Renting a house','🧹','clean','propre','Not dirty.','The house was clean and comfortable.'],
    ['Renting a house','😌','comfortable','confortable','Nice and easy to use or live in.','The rented house was very comfortable.'],

    ['Family holiday','👨‍👩‍👧‍👦','family time','moment en famille','Time spent with your family.','It was a special family time.'],
    ['Family holiday','👧','children','enfants','Your sons or daughters.','My children came on holiday.'],
    ['Family holiday','🍳','cook together','cuisiner ensemble','Prepare food with other people.','We cooked together in the evening.'],
    ['Family holiday','🃏','play games','jouer à des jeux','Do fun activities together.','We played games after dinner.'],
    ['Family holiday','🚶','go for a walk','aller se promener','Walk for pleasure.','We went for a walk near the house.'],
    ['Family holiday','📸','take photos','prendre des photos','Use a camera or phone for pictures.','I took photos of the landscape.'],
    ['Family holiday','💛','spend time together','passer du temps ensemble','Be together and enjoy the moment.','We spent time together as a family.'],

    ['Travel verbs','➡️','go / went','aller / je suis allé(e)','Move to a place.','I went to a small village.'],
    ['Travel verbs','🧳','travel / travelled','voyager / j’ai voyagé','Go from place to place.','I travelled for one month.'],
    ['Travel verbs','👀','visit / visited','visiter / j’ai visité','Go to see a place.','I visited a market.'],
    ['Travel verbs','🅿️','park / parked','se garer / je me suis garé(e)','Put a vehicle in a parking place.','I parked near the campsite.'],
    ['Travel verbs','🏕️','stay / stayed','séjourner / je suis resté(e)','Sleep or spend time in a place.','I stayed at a campsite.'],
    ['Travel verbs','🏡','rent / rented','louer / j’ai loué','Pay to use something for a short time.','I rented a house.'],
    ['Travel verbs','🍽️','eat / ate','manger / j’ai mangé','Have food.','I ate local food.'],
    ['Travel verbs','💸','spend / spent','passer / dépenser','Use time or money.','I spent time with my family.'],
    ['Travel verbs','📸','take / took','prendre / j’ai pris','Get or capture something.','I took many photos.'],
    ['Travel verbs','🔎','discover / discovered','découvrir / j’ai découvert','Find or see something new.','I discovered beautiful villages.'],

    ['Places and scenery','🌄','landscape','paysage','A view of nature or a place.','The landscape was beautiful.'],
    ['Places and scenery','🏘️','village','village','A small town.','We visited a quiet village.'],
    ['Places and scenery','🏛️','old town','vieille ville','The historic part of a town.','The old town was very pretty.'],
    ['Places and scenery','🌲','forest','forêt','A place with many trees.','We walked in the forest.'],
    ['Places and scenery','⛰️','mountains','montagnes','High natural places.','We stayed near the mountains.'],
    ['Places and scenery','🌊','coast','côte / littoral','The area near the sea.','We drove along the coast.'],
    ['Places and scenery','🛍️','market','marché','A place where people buy food and objects.','We bought food at a local market.'],

    ['Problems and solutions','⚠️','problem','problème','Something difficult or wrong.','There was a problem with the electricity.'],
    ['Problems and solutions','❓','ask for help','demander de l’aide','Ask someone to help you.','I asked for help at reception.'],
    ['Problems and solutions','🛠️','fix','réparer','Make something work again.','They fixed the problem quickly.'],
    ['Problems and solutions','🔁','change plans','changer les plans','Do something different from the original plan.','We changed plans because it rained.'],
    ['Problems and solutions','🗺️','get lost','se perdre','Not know where you are.','We got lost near a village.'],
    ['Problems and solutions','⛈️','rain','pleuvoir / pluie','Water falling from the sky.','It started to rain while we were driving.'],
    ['Problems and solutions','📞','call reception','appeler l’accueil','Phone the reception desk.','I called reception about the keys.'],

    ['Feelings and opinions','😊','pleasant','agréable','Nice and enjoyable.','It was a pleasant trip.'],
    ['Feelings and opinions','😌','relaxing','relaxant','Something that makes you calm.','The campsite was very relaxing.'],
    ['Feelings and opinions','🤩','amazing','incroyable','Very good or impressive.','The view was amazing.'],
    ['Feelings and opinions','🧘','quiet','calme','With little noise.','The place was quiet.'],
    ['Feelings and opinions','🏃','busy','animé / chargé','With many people or things to do.','The campsite was busy in the evening.'],
    ['Feelings and opinions','💛','special','spécial','Important or memorable.','It was a special family moment.'],
    ['Feelings and opinions','👍','worth it','ça vaut le coup','Good enough for the effort or price.','The long drive was worth it.'],

    ['Time markers','📅','last month','le mois dernier','A finished time in the past.','Last month, I travelled around France.'],
    ['Time markers','🌙','one night','une nuit','A period from evening to morning.','We stayed there for one night.'],
    ['Time markers','🕰️','during the trip','pendant le voyage','In the time of the trip.','During the trip, I visited many places.'],
    ['Time markers','➡️','at one point','à un moment donné','At one moment during a story.','At one point, I rented a house.'],
    ['Time markers','🔄','sometimes','parfois','Not always.','Sometimes, I stayed at campsites.'],
    ['Time markers','🎬','while','pendant que','During a longer action.','While we were driving, we saw beautiful landscapes.'],
    ['Time markers','⚡','when','quand / lorsque','At the moment something happened.','I was cooking when my family arrived.'],
    ['Time markers','🔮','next time','la prochaine fois','A future occasion.','Next time, I’m going to stay longer.'],

    ['Useful CLOE questions','❓','What did you do?','Qu’avez-vous fait ?','Ask about an activity in the past.','What did you do during your trip?'],
    ['Useful CLOE questions','📍','Where did you go?','Où êtes-vous allé(e) ?','Ask about a place in the past.','Where did you go in France?'],
    ['Useful CLOE questions','👥','Who did you go with?','Avec qui êtes-vous allé(e) ?','Ask about people.','Who did you go with?'],
    ['Useful CLOE questions','🏕️','Where did you stay?','Où avez-vous séjourné ?','Ask about accommodation.','Where did you stay during the trip?'],
    ['Useful CLOE questions','💬','How was it?','Comment c’était ?','Ask for an opinion.','How was the campsite?'],
    ['Useful CLOE questions','🧠','Why did you like it?','Pourquoi avez-vous aimé ?','Ask for a reason.','Why did you like the rented house?'],
    ['Useful CLOE questions','🔮','What are you going to do next time?','Qu’allez-vous faire la prochaine fois ?','Ask about future plans.','What are you going to do next time?']
  ];

  const vocabCategory = document.getElementById('vocabCategory');
  const vocabSearch = document.getElementById('vocabSearch');
  const vocabGrid = document.getElementById('vocabGrid');

  function renderVocab(){
    if (!vocabGrid || !vocabCategory) return;
    const categories = ['All categories', ...Array.from(new Set(vocab.map(v => v[0])))] ;
    if (!vocabCategory.options.length){
      vocabCategory.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    }
    const cat = vocabCategory.value || 'All categories';
    const search = normalize(vocabSearch?.value || '');
    const filtered = vocab.filter(item => {
      const matchesCat = cat === 'All categories' || item[0] === cat;
      const text = normalize(item.join(' '));
      return matchesCat && (!search || text.includes(search));
    });
    vocabGrid.innerHTML = filtered.map(item => `
      <article class="vocab-card">
        <div class="vocab-head"><span class="vocab-icon">${item[1]}</span><div><h3>${escapeHtml(item[2])}</h3><span class="tag-fr">${escapeHtml(item[3])}</span></div></div>
        <p><strong>Definition:</strong> ${escapeHtml(item[4])}</p>
        <p><strong>Example:</strong> ${escapeHtml(item[5])}</p>
        <button class="listen-btn compact" type="button" data-speak-text="${escapeHtml(item[2] + '. ' + item[5])}">▶ Listen</button>
      </article>
    `).join('') || '<p class="muted">No vocabulary found.</p>';
    vocabGrid.querySelectorAll('[data-speak-text]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speakText)));
  }
  vocabCategory?.addEventListener('change', renderVocab);
  vocabSearch?.addEventListener('input', renderVocab);
  renderVocab();

  document.addEventListener('click', e => {
    const btn = e.target.closest('.quiz-card .choice-row button');
    if (!btn) return;
    const card = btn.closest('.quiz-card');
    const feedback = card.querySelector('.feedback');
    card.querySelectorAll('.choice-row button').forEach(b => b.classList.remove('correct-choice','wrong-choice'));
    if (btn.dataset.correct === 'true'){
      btn.classList.add('correct-choice');
      if (feedback){ feedback.textContent = '✅ Correct. Good tense detective work!'; feedback.className = 'feedback good'; }
    } else {
      btn.classList.add('wrong-choice');
      const correct = card.querySelector('[data-correct="true"]');
      if (correct) correct.classList.add('correct-choice');
      if (feedback){ feedback.textContent = '❌ Not this one. Look at the question signal and the time marker.'; feedback.className = 'feedback bad'; }
    }
  });

  document.addEventListener('click', e => {
    const hintButton = e.target.closest('.hint-btn');
    if (!hintButton) return;
    if (hintButton.dataset.target){
      document.querySelector(hintButton.dataset.target)?.classList.toggle('show');
      return;
    }
    hintButton.parentElement?.querySelector('.hint')?.classList.toggle('show');
  });

  function checkInputs(containerSelector){
    const root = document.querySelector(containerSelector);
    if (!root) return;
    const inputs = Array.from(root.querySelectorAll('input[data-answer]'));
    let good = 0;
    inputs.forEach(input => {
      const accepted = input.dataset.answer.split('|').map(normalize);
      const value = normalize(input.value);
      const ok = accepted.includes(value);
      input.classList.toggle('field-correct', ok);
      input.classList.toggle('field-wrong', !ok);
      if (ok) good++;
    });
    const feedback = root.querySelector('.group-feedback');
    if (feedback){
      feedback.textContent = good === inputs.length ? `✅ Excellent: ${good}/${inputs.length}` : `You have ${good}/${inputs.length}. Check the highlighted answers and use the hint.`;
      feedback.className = good === inputs.length ? 'group-feedback good' : 'group-feedback bad';
    }
  }

  function checkSelects(containerSelector){
    const root = document.querySelector(containerSelector);
    if (!root) return;
    const selects = Array.from(root.querySelectorAll('select[data-answer]'));
    let good = 0;
    selects.forEach(select => {
      const ok = normalize(select.value) === normalize(select.dataset.answer);
      select.classList.toggle('field-correct', ok);
      select.classList.toggle('field-wrong', !ok);
      if (ok) good++;
    });
    const feedback = root.querySelector('.group-feedback');
    if (feedback){
      feedback.textContent = good === selects.length ? `✅ Excellent: ${good}/${selects.length}` : `You have ${good}/${selects.length}. Look again at the rule.`;
      feedback.className = good === selects.length ? 'group-feedback good' : 'group-feedback bad';
    }
  }

  document.querySelectorAll('[data-check-inputs]').forEach(btn => btn.addEventListener('click', () => checkInputs(btn.dataset.checkInputs)));
  document.querySelectorAll('[data-check-selects]').forEach(btn => btn.addEventListener('click', () => checkSelects(btn.dataset.checkSelects)));

  const whereSelect = document.getElementById('whereSelect');
  const sleepSelect = document.getElementById('sleepSelect');
  const whoSelect = document.getElementById('whoSelect');
  const activitySelect = document.getElementById('activitySelect');
  const feelingSelect = document.getElementById('feelingSelect');
  const roadBookOutput = document.getElementById('roadBookOutput');

  function updateRoadBook(){
    if (!roadBookOutput) return;
    const where = whereSelect?.value || 'around France';
    const sleep = sleepSelect?.value || 'in the campervan';
    const who = whoSelect?.value || 'with my family';
    const activity = activitySelect?.value || 'visited small villages and walked near the campsite';
    const feeling = feelingSelect?.value || 'quiet and relaxing';
    roadBookOutput.textContent = `Last month, I travelled ${where} ${who}. I stayed ${sleep}. During the trip, I ${activity}. It was ${feeling}, and I really enjoyed the experience.`;
  }
  [whereSelect, sleepSelect, whoSelect, activitySelect, feelingSelect].forEach(el => el?.addEventListener('change', updateRoadBook));
  updateRoadBook();

  document.getElementById('copyRoadBook')?.addEventListener('click', async () => {
    const text = roadBookOutput?.textContent || '';
    try { await navigator.clipboard.writeText(text); alert('Paragraph copied!'); }
    catch { alert(text); }
  });
  document.getElementById('listenRoadBook')?.addEventListener('click', () => speak(roadBookOutput?.textContent || ''));

  const storyText = 'Last month, I travelled around France in a campervan. I visited small towns, quiet campsites and beautiful places near the sea. Sometimes, I parked in a special campervan area, and sometimes I stayed at a campsite with showers and electricity. At one point, I rented a house because my children came on holiday with me. We cooked together, went to a market and spent time outside. While we were driving, we saw beautiful landscapes. It was a simple but very special trip.';
  document.getElementById('listenStory')?.addEventListener('click', () => speak(storyText));
  document.getElementById('toggleTranscript')?.addEventListener('click', (e) => {
    const box = document.getElementById('transcriptBox');
    if (!box) return;
    box.hidden = !box.hidden;
    e.currentTarget.textContent = box.hidden ? 'Show transcript' : 'Hide transcript';
  });

  const speakingPrompts = [
    {
      tag:'Past Simple',
      q:'What did you do during your trip?',
      model:'During my trip, I travelled around France in a campervan. I visited small towns and stayed at campsites.',
      build:'Use: During my trip, I + past verb + place/detail.'
    },
    {
      tag:'Accommodation',
      q:'Where did you stay?',
      model:'Sometimes, I stayed in the campervan. I also stayed at campsites, and at one point I rented a house with my family.',
      build:'Use: Sometimes, I stayed… / At one point, I rented…'
    },
    {
      tag:'There was / were',
      q:'How was the campsite?',
      model:'The campsite was quiet. There was a swimming pool, and there were clean showers.',
      build:'Use: The place was… There was… There were…'
    },
    {
      tag:'Past Continuous',
      q:'What happened while you were travelling?',
      model:'While we were driving, we saw beautiful landscapes. One day, it started to rain, so we changed our plans.',
      build:'Use: While I/we was/were + -ing, I/we + past simple.'
    },
    {
      tag:'Opinion',
      q:'Why did you enjoy the trip?',
      model:'I enjoyed the trip because it was relaxing and different. I liked the freedom of the campervan.',
      build:'Use: I enjoyed it because… I liked…'
    },
    {
      tag:'Future',
      q:'Are you going to travel in a campervan again?',
      model:'Yes, I am. I’m going to travel again because I enjoyed the freedom and the family time.',
      build:'Use: Yes, I am. I’m going to + base verb + because…'
    }
  ];

  const speakingCards = document.getElementById('speakingCards');
  if (speakingCards){
    speakingCards.innerHTML = speakingPrompts.map((card, index) => `
      <article class="speaking-card">
        <span class="question-pill">${escapeHtml(card.tag)}</span>
        <h3>${index + 1}. ${escapeHtml(card.q)}</h3>
        <div class="answer-model"><strong>Model answer:</strong><br>${escapeHtml(card.model)}</div>
        <p class="answer-builder"><strong>Your structure:</strong> ${escapeHtml(card.build)}</p>
        <button class="listen-btn compact" type="button" data-speak-text="${escapeHtml(card.q + ' ' + card.model)}">▶ Listen</button>
      </article>
    `).join('');
    speakingCards.querySelectorAll('[data-speak-text]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speakText)));
  }

  const writingBox = document.getElementById('writingBox');
  document.getElementById('copyWriting')?.addEventListener('click', async () => {
    const text = writingBox?.value || '';
    if (!text.trim()) { alert('Write your paragraph first.'); return; }
    try { await navigator.clipboard.writeText(text); alert('Writing copied!'); }
    catch { alert(text); }
  });
  document.getElementById('listenWriting')?.addEventListener('click', () => {
    const text = writingBox?.value || '';
    if (!text.trim()) { alert('Write your paragraph first.'); return; }
    speak(text);
  });

  const missions = {
    campervan: {
      label:'🚐 Campervan freedom',
      goal:'Talk about travelling in a campervan and why it was practical or enjoyable.',
      prompts:['Where did I travel?', 'Where did I park?', 'What did I like about the campervan?', 'Was it easy or difficult?', 'Would I like to do it again?'],
      model:'I travelled around France in a campervan. Sometimes, I parked in a special campervan area. I liked the freedom because I could change plans easily. It was simple and relaxing.',
      questions:['Have you ever travelled in a campervan?', 'Do you prefer a campervan or a hotel?', 'Where did you go on your last holiday?']
    },
    campsite: {
      label:'🏕️ Campsite life',
      goal:'Describe a campsite with there was / there were and give your opinion.',
      prompts:['Where was the campsite?', 'What was there at the campsite?', 'Were there showers?', 'Was it quiet or busy?', 'Did I enjoy it?'],
      model:'I stayed at a campsite near the sea. There was a small shop, and there were clean showers. The campsite was quiet, so it was very relaxing.',
      questions:['Do you like campsites?', 'Was there a swimming pool?', 'Would you like to stay there again?']
    },
    house: {
      label:'🏡 Rented house with family',
      goal:'Talk about renting a house and spending time with your children.',
      prompts:['When did I rent the house?', 'Who came on holiday with me?', 'What did we do together?', 'How was the house?', 'Why was it special?'],
      model:'At one point, I rented a house with my family. My children came on holiday with me. We cooked together, went for walks and spent time outside. It was a special family moment.',
      questions:['Do you often rent houses for holidays?', 'What did you do with your family?', 'Why was it special?']
    },
    problem: {
      label:'⚠️ Travel problem and solution',
      goal:'Explain a small travel problem and how you solved it.',
      prompts:['What was the problem?', 'Where were you?', 'Who helped you?', 'What did you do?', 'Was it okay in the end?'],
      model:'There was a problem with the electricity at the campsite. I asked for help at reception. They helped me quickly, and in the end everything was okay.',
      questions:['Did you have a problem during your trip?', 'What did you do?', 'Who helped you?']
    },
    scenery: {
      label:'🌄 Beautiful place in France',
      goal:'Describe one beautiful place and say why you liked it.',
      prompts:['Where did I go?', 'What did I see?', 'What was the weather like?', 'What did I do there?', 'Why did I like it?'],
      model:'I visited a beautiful village in France. There were old houses and flowers in the streets. The weather was nice, and I took many photos. I liked it because it was peaceful.',
      questions:['Do you prefer the sea or the mountains?', 'What beautiful place did you visit?', 'Why did you like it?']
    },
    nextTrip: {
      label:'🔮 Next trip',
      goal:'Use going to and will to talk about a future trip or promise.',
      prompts:['Where am I going to go next time?', 'Who am I going to travel with?', 'Where am I going to stay?', 'What am I going to visit?', 'What will I remember to do?'],
      model:'Next time, I’m going to plan another trip in France. I’m going to stay near the sea, and I’m going to visit local markets. I’ll remember to check the campsite before arriving.',
      questions:['Are you going to travel again soon?', 'Where are you going to go?', 'What will you prepare before leaving?']
    }
  };

  const missionTopic = document.getElementById('missionTopic');
  const missionCard = document.getElementById('missionCard');
  function renderMission(){
    if (!missionTopic || !missionCard) return;
    if (!missionTopic.options.length){
      missionTopic.innerHTML = Object.entries(missions).map(([key, val]) => `<option value="${key}">${escapeHtml(val.label)}</option>`).join('');
    }
    const mission = missions[missionTopic.value] || missions.campervan;
    missionCard.innerHTML = `
      <h3>${escapeHtml(mission.label)}</h3>
      <p class="muted"><strong>Goal:</strong> ${escapeHtml(mission.goal)}</p>
      <div class="mission-grid">
        <div class="mission-box"><h4>Guided prompts</h4><ol>${mission.prompts.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ol></div>
        <div class="mission-box"><h4>Model story</h4><p>${escapeHtml(mission.model)}</p><button class="listen-btn compact" type="button" data-speak-mission="${escapeHtml(mission.model)}">▶ Listen to the model</button></div>
        <div class="mission-box"><h4>Ask your teacher</h4><ul>${mission.questions.map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ul></div>
        <div class="mission-box"><h4>Conversation helpers</h4><ul><li>That sounds interesting.</li><li>Really?</li><li>Why?</li><li>Can you repeat, please?</li><li>What about you?</li></ul></div>
      </div>
    `;
    missionCard.querySelectorAll('[data-speak-mission]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speakMission)));
  }
  missionTopic?.addEventListener('change', renderMission);
  renderMission();
})();
