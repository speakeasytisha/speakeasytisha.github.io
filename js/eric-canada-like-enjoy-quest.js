(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  let voiceLang = 'en-US';
  let scoreRight = 0;
  let scoreTotal = 0;
  let timers = {};

  const updateScore = () => { $('#score').textContent = `${scoreRight} / ${scoreTotal}`; };
  const addScore = (right) => { scoreTotal += 1; if (right) scoreRight += 1; updateScore(); };

  function cleanSpeakText(text){
    return String(text || '')
      .replace(/FR:\s*[^.?!]+[.?!]?/gi,'')
      .replace(/✅|❌|🍁|▶️|⏹|🖨|↺|🎲|←|→/g,'')
      .replace(/\s+/g,' ')
      .trim();
  }

  function chooseVoice(){
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return voices.find(v => v.lang === voiceLang) || voices.find(v => v.lang && v.lang.startsWith(voiceLang.slice(0,2))) || null;
  }

  function speak(text){
    const msg = cleanSpeakText(text);
    if(!msg || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(msg);
    utter.lang = voiceLang;
    utter.rate = 0.88;
    utter.pitch = 1;
    const v = chooseVoice();
    if(v) utter.voice = v;
    speechSynthesis.speak(utter);
  }

  if('speechSynthesis' in window){
    speechSynthesis.onvoiceschanged = () => chooseVoice();
  }

  $$('[data-voice]').forEach(btn => {
    btn.addEventListener('click', () => {
      voiceLang = btn.dataset.voice;
      $$('[data-voice]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.addEventListener('click', e => {
    const sayBtn = e.target.closest('[data-say], [data-say-target], [data-scroll]');
    if(!sayBtn) return;
    if(sayBtn.dataset.scroll){
      const target = $(sayBtn.dataset.scroll);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      return;
    }
    if(sayBtn.dataset.sayTarget){
      const target = $('#' + sayBtn.dataset.sayTarget);
      speak(target ? target.textContent : '');
    } else {
      speak(sayBtn.dataset.say);
    }
  });

  $('#stopAudio').addEventListener('click', () => speechSynthesis && speechSynthesis.cancel());
  $('#printGrammar').addEventListener('click', () => window.print());
  $('#resetAll').addEventListener('click', () => {
    if(confirm('Reset the whole page score and activities?')){
      scoreRight = 0; scoreTotal = 0; updateScore();
      renderQuiz(); renderDropdowns(); renderTransforms(); resetBuilder(); resetDialogue(); renderScenario();
      $('#studentNotes').value = '';
    }
  });

  const warmups = [
    ['Do you like visiting big cities?', 'I like visiting big cities because there are many things to see.'],
    ['Do you enjoy hiking?', 'I enjoy hiking because I like being outside.'],
    ['Do you like trying local food?', 'Yes, I like trying local food because it is interesting.'],
    ['Do you enjoy taking photos?', 'Yes, I enjoy taking photos when the view is beautiful.'],
    ['Do you like travelling by train?', 'I like travelling by train because it is comfortable.'],
    ['Do you enjoy planning a trip?', 'I enjoy planning a trip, but I don’t like booking too many things.']
  ];
  function renderWarmups(){
    $('#warmupQuestions').innerHTML = warmups.map(([q,a], i) => `
      <article class="questionCard">
        <strong>Question ${i+1}</strong>
        <p>${q}</p>
        <button class="listenSmall" data-say="${q.replace(/"/g,'&quot;')}" type="button">Listen question</button>
        <button class="listenSmall" data-model-warmup="${i}" type="button">Model answer</button>
      </article>`).join('');
    $$('[data-model-warmup]').forEach(btn => btn.addEventListener('click', () => {
      const model = warmups[Number(btn.dataset.modelWarmup)][1];
      $('#warmupModel').textContent = model;
      speak(model);
    }));
  }

  const vocab = [
    {cat:'nature', icon:'🏔️', word:'hiking', fr:'faire de la randonnée', def:'walking in nature, often in the mountains or a park', ex:'I enjoy hiking in national parks.'},
    {cat:'nature', icon:'🐻', word:'watching wildlife', fr:'observer les animaux sauvages', def:'looking at animals in their natural environment', ex:'I like watching wildlife, but from a safe distance.'},
    {cat:'nature', icon:'🚣', word:'going on a boat tour', fr:'faire une excursion en bateau', def:'taking a guided trip on water', ex:'I enjoy going on a boat tour when the weather is good.'},
    {cat:'nature', icon:'🌲', word:'exploring national parks', fr:'explorer les parcs nationaux', def:'visiting protected natural areas', ex:'I like exploring national parks in Canada.'},
    {cat:'city', icon:'🏙️', word:'visiting cities', fr:'visiter des villes', def:'discovering streets, monuments, shops, and museums', ex:'I like visiting cities like Vancouver or Montreal.'},
    {cat:'city', icon:'🏛️', word:'visiting museums', fr:'visiter des musées', def:'going to places with history, art, or culture', ex:'I enjoy visiting museums when it rains.'},
    {cat:'city', icon:'📸', word:'taking photos', fr:'prendre des photos', def:'using a phone or camera to keep memories', ex:'I like taking photos of beautiful views.'},
    {cat:'city', icon:'🗺️', word:'asking for directions', fr:'demander son chemin', def:'asking someone how to get to a place', ex:'I don’t like asking for directions, but it is useful.'},
    {cat:'travel', icon:'🚆', word:'travelling by train', fr:'voyager en train', def:'using the train to go from one place to another', ex:'I enjoy travelling by train because it is relaxing.'},
    {cat:'travel', icon:'🚗', word:'renting a car', fr:'louer une voiture', def:'paying to use a car for a short time', ex:'I like renting a car when I visit natural places.'},
    {cat:'travel', icon:'🧳', word:'packing my suitcase', fr:'faire ma valise', def:'putting clothes and objects into a suitcase', ex:'I don’t enjoy packing my suitcase.'},
    {cat:'travel', icon:'🌦️', word:'checking the weather', fr:'vérifier la météo', def:'looking at rain, sun, wind, or temperature before going out', ex:'I like checking the weather before hiking.'},
    {cat:'food', icon:'🍁', word:'trying local food', fr:'goûter la nourriture locale', def:'eating food from the place you are visiting', ex:'I enjoy trying local food when I travel.'},
    {cat:'food', icon:'☕', word:'stopping for coffee', fr:'s’arrêter pour prendre un café', def:'taking a short break to drink coffee', ex:'I like stopping for coffee after walking.'},
    {cat:'food', icon:'🍽️', word:'booking a table', fr:'réserver une table', def:'reserving a place at a restaurant', ex:'I don’t enjoy booking a table by phone.'},
    {cat:'food', icon:'💬', word:'asking for recommendations', fr:'demander des recommandations', def:'asking someone what is good to do, see, or eat', ex:'I enjoy asking for recommendations at the tourist office.'}
  ];
  function renderVocab(filter='all'){
    const cards = vocab.filter(v => filter === 'all' || v.cat === filter);
    $('#vocabCards').innerHTML = cards.map(v => `
      <article class="vocabCard">
        <span class="tag">${v.cat}</span>
        <div class="vocabIcon">${v.icon}</div>
        <h3>${v.word}</h3>
        <p><strong>FR:</strong> ${v.fr}</p>
        <p>${v.def}</p>
        <p><em>${v.ex}</em></p>
        <button class="listenSmall" data-say="${v.word}. ${v.ex.replace(/"/g,'&quot;')}" type="button">Listen</button>
      </article>`).join('');
  }
  $$('[data-vocab-filter]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-vocab-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderVocab(btn.dataset.vocabFilter);
  }));

  const quizData = [
    {q:'Choose the correct sentence.', options:['I enjoy visit Canada.','I enjoy visiting Canada.'], answer:1, hint:'After enjoy, use verb-ing.'},
    {q:'Choose the correct sentence.', options:['I like hiking in national parks.','I like hike in national parks.'], answer:0, hint:'After like, use verb-ing.'},
    {q:'Choose the correct sentence.', options:['Do you enjoy trying local food?','Do you enjoy try local food?'], answer:0, hint:'Question: Do you enjoy + verb-ing?'},
    {q:'Choose the correct sentence.', options:["I don't like waiting in queues.", "I don't like wait in queues."], answer:0, hint:'Negative: don’t like + verb-ing.'},
    {q:'Choose the correct sentence.', options:['He enjoy taking photos.','He enjoys taking photos.'], answer:1, hint:'He/she/it: enjoys.'},
    {q:'Choose the correct sentence.', options:['She doesn’t enjoy driving in snow.','She doesn’t enjoys driving in snow.'], answer:0, hint:'After doesn’t, the verb is enjoy, not enjoys.'}
  ];
  function shuffle(arr){ return [...arr].sort(() => Math.random() - .5); }
  function renderQuiz(){
    const picked = shuffle(quizData).slice(0,4);
    $('#quizArea').innerHTML = picked.map((item, idx) => `
      <article class="quizCard" data-quiz-card="${idx}">
        <h3>${idx+1}. ${item.q}</h3>
        <div class="optionGrid">
          ${item.options.map((op, i) => `<button class="optionBtn" data-quiz="${idx}" data-option="${i}" type="button">${op}</button>`).join('')}
        </div>
        <p class="hint">Hint: ${item.hint}</p>
        <div class="srFeedback" aria-live="polite"></div>
      </article>`).join('');
    $$('.optionBtn').forEach(btn => btn.addEventListener('click', () => {
      const card = btn.closest('.quizCard');
      if(card.dataset.done === 'true') return;
      const item = picked[Number(btn.dataset.quiz)];
      const right = Number(btn.dataset.option) === item.answer;
      card.dataset.done = 'true';
      addScore(right);
      $$('button', card).forEach(b => {
        const ok = Number(b.dataset.option) === item.answer;
        b.classList.add(ok ? 'correct' : 'wrong');
      });
      $('.srFeedback', card).textContent = right ? 'Correct. Say it aloud now.' : `Not yet. Correct answer: ${item.options[item.answer]}`;
      $('.srFeedback', card).className = 'srFeedback ' + (right ? 'correctText' : 'wrongText');
      if(right) speak(item.options[item.answer]);
    }));
  }
  $('#newQuiz').addEventListener('click', renderQuiz);
  $('#resetQuiz').addEventListener('click', renderQuiz);

  const dropdownData = [
    ['I like', '____', 'cities in Canada.', 'visiting', ['visit','visiting','visited']],
    ['Eric enjoys', '____', 'photos of beautiful landscapes.', 'taking', ['take','taking','takes']],
    ['I don’t like', '____', 'too long at the airport.', 'waiting', ['wait','waiting','to waiting']],
    ['Do you enjoy', '____', 'by train?', 'travelling', ['travel','travelling','travels']],
    ['He doesn’t enjoy', '____', 'in snow.', 'driving', ['driving','drive','drives']],
    ['I like', '____', 'the weather before hiking.', 'checking', ['check','checking','checks']]
  ];
  function renderDropdowns(){
    $('#dropdownArea').innerHTML = dropdownData.map((d, i) => `
      <article class="dropdownCard">
        <p class="dropdownSentence"><strong>${i+1}.</strong> ${d[0]} 
          <select data-dd="${i}">
            <option value="">Choose…</option>
            ${d[4].map(o => `<option value="${o}">${o}</option>`).join('')}
          </select>
          ${d[2]}
        </p>
      </article>`).join('');
    $('#dropdownFeedback').textContent = '';
    $('#dropdownFeedback').className = 'feedback';
  }
  $('#checkDropdowns').addEventListener('click', () => {
    let right = 0;
    $$('[data-dd]').forEach(sel => {
      const correct = dropdownData[Number(sel.dataset.dd)][3];
      const ok = sel.value === correct;
      sel.style.borderColor = ok ? '#1f9c72' : '#cf665f';
      if(ok) right += 1;
    });
    addScore(right === dropdownData.length);
    $('#dropdownFeedback').textContent = right === dropdownData.length ? 'Excellent. Now Eric reads all sentences aloud.' : `${right} / ${dropdownData.length}. Check the red dropdowns. Remember: like/enjoy + verb-ing.`;
    $('#dropdownFeedback').className = 'feedback ' + (right === dropdownData.length ? 'good' : 'bad');
  });
  $('#resetDropdowns').addEventListener('click', renderDropdowns);

  const transforms = [
    {base:'I like visiting Vancouver.', instruction:'Make it negative.', answer:"I don't like visiting Vancouver."},
    {base:'You enjoy trying local food.', instruction:'Make it a question.', answer:'Do you enjoy trying local food?'},
    {base:'He enjoys taking photos.', instruction:'Make it negative.', answer:"He doesn't enjoy taking photos."},
    {base:'She likes hiking in national parks.', instruction:'Make it a question.', answer:'Does she like hiking in national parks?'},
    {base:'I enjoy travelling by train.', instruction:'Make it negative.', answer:"I don't enjoy travelling by train."}
  ];
  function normalize(s){ return String(s).toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').replace(/\s+([?.!])/g,'$1').trim(); }
  function renderTransforms(){
    $('#transformArea').innerHTML = transforms.map((t,i) => `
      <article class="transformCard">
        <h3>${i+1}. ${t.instruction}</h3>
        <p><strong>Start:</strong> ${t.base}</p>
        <input class="transformInput" data-transform="${i}" placeholder="Type the new sentence…" />
        <div class="rowActions">
          <button class="primary" data-check-transform="${i}" type="button">Check</button>
          <button class="secondary" data-show-transform="${i}" type="button">Show answer</button>
          <button class="secondary" data-say="${t.answer.replace(/"/g,'&quot;')}" type="button">Listen answer</button>
        </div>
        <div class="srFeedback" aria-live="polite"></div>
      </article>`).join('');
    $$('[data-check-transform]').forEach(btn => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.checkTransform);
      const card = btn.closest('.transformCard');
      const input = $(`[data-transform="${i}"]`).value;
      const ok = normalize(input) === normalize(transforms[i].answer);
      addScore(ok);
      const fb = $('.srFeedback', card);
      fb.textContent = ok ? 'Correct. Say it aloud.' : `Almost. Correct answer: ${transforms[i].answer}`;
      fb.className = 'srFeedback ' + (ok ? 'correctText' : 'wrongText');
    }));
    $$('[data-show-transform]').forEach(btn => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.showTransform);
      $(`[data-transform="${i}"]`).value = transforms[i].answer;
    }));
  }

  const builders = [
    'I enjoy visiting national parks in Canada.',
    'I like trying local food when I travel.',
    "I don't like waiting in long queues.",
    'Do you enjoy taking photos in Vancouver?',
    'He likes travelling by train because it is comfortable.',
    "She doesn't enjoy driving when the weather is bad."
  ];
  let currentBuild = 0;
  let buildWords = [];
  function wordTokenize(s){ return s.replace(/([?.!])/g,' $1').split(/\s+/).filter(Boolean); }
  function renderBuilderSelect(){
    $('#builderSelect').innerHTML = builders.map((b,i) => `<option value="${i}">Task ${i+1}</option>`).join('');
  }
  function renderBuilder(){
    currentBuild = Number($('#builderSelect').value || 0);
    buildWords = [];
    const words = shuffle(wordTokenize(builders[currentBuild]));
    $('#wordBank').innerHTML = words.map((w,i) => `<button class="wordChip" data-word="${w}" data-word-id="${i}" type="button">${w}</button>`).join('');
    $('#buildZone').innerHTML = '';
    $('#buildFeedback').textContent = '';
    $$('.wordChip').forEach(btn => btn.addEventListener('click', () => {
      if(btn.classList.contains('used')) return;
      btn.classList.add('used');
      buildWords.push(btn.dataset.word);
      $('#buildZone').insertAdjacentHTML('beforeend', `<span class="buildWord">${btn.dataset.word}</span>`);
    }));
  }
  function builtSentence(){
    return buildWords.join(' ').replace(/\s+([?.!])/g,'$1');
  }
  function resetBuilder(){ renderBuilder(); }
  $('#builderSelect').addEventListener('change', renderBuilder);
  $('#checkBuild').addEventListener('click', () => {
    const ok = normalize(builtSentence()) === normalize(builders[currentBuild]);
    addScore(ok);
    $('#buildFeedback').textContent = ok ? 'Correct. Now say it without reading.' : `Not yet. Model: ${builders[currentBuild]}`;
    $('#buildFeedback').className = 'feedback ' + (ok ? 'good' : 'bad');
  });
  $('#listenBuild').addEventListener('click', () => speak(builtSentence() || builders[currentBuild]));
  $('#resetBuild').addEventListener('click', resetBuilder);

  const dialogue = [
    {role:'teacher', text:'Good morning. What do you like doing when you visit a new country?', model:''},
    {role:'learner', text:'Your answer: say two activities.', model:'I like visiting cities and I enjoy trying local food.'},
    {role:'teacher', text:'Do you enjoy walking in nature?', model:''},
    {role:'learner', text:'Your answer: yes or no + because.', model:'Yes, I enjoy walking in nature because it is relaxing.'},
    {role:'teacher', text:'What don’t you like doing when you travel?', model:''},
    {role:'learner', text:'Your answer: I don’t like + verb-ing.', model:"I don’t like waiting in long queues, especially at the airport."},
    {role:'teacher', text:'Would you prefer visiting a city or exploring a national park?', model:''},
    {role:'learner', text:'Your answer: choose + give a reason.', model:'I would prefer exploring a national park because I enjoy taking photos of nature.'}
  ];
  let lineIndex = 0;
  function renderDialogue(){
    const line = dialogue[lineIndex];
    $('#dialogueStep').textContent = `Line ${lineIndex + 1} / ${dialogue.length}`;
    $('#dialogueLine').textContent = line.text;
    $('#dialogueLine').className = `dialogueLine ${line.role}`;
    $('#dialogueModel').classList.add('hidden');
    $('#dialogueModel').textContent = line.model || 'Teacher line: no model reply needed.';
  }
  function resetDialogue(){ lineIndex = 0; renderDialogue(); }
  $('#nextLine').addEventListener('click', () => { lineIndex = (lineIndex + 1) % dialogue.length; renderDialogue(); });
  $('#prevLine').addEventListener('click', () => { lineIndex = (lineIndex - 1 + dialogue.length) % dialogue.length; renderDialogue(); });
  $('#resetDialogue').addEventListener('click', resetDialogue);
  $('#listenDialogue').addEventListener('click', () => speak(dialogue[lineIndex].text.replace('Your answer:', '')));
  $('#showModel').addEventListener('click', () => { $('#dialogueModel').classList.toggle('hidden'); if(dialogue[lineIndex].model) speak(dialogue[lineIndex].model); });

  const scenarios = [
    {label:'Tourist office', prompt:'You are at a tourist office in Canada. Ask for activities. Say what you like doing and what you don’t like doing.', teacher:['What kind of activities do you like doing?','Do you enjoy walking a lot?','Would you like a city activity or a nature activity?'], model:'I like visiting interesting places and I enjoy taking photos. I don’t like walking too far, so I would prefer a short city tour.'},
    {label:'Hotel reception', prompt:'You arrive at your hotel. The receptionist asks about your plans. Explain what you enjoy doing on holiday.', teacher:['What are your plans for tomorrow?','Do you like getting up early?','Do you need any recommendations?'], model:'Tomorrow, I would like to visit the city. I enjoy discovering new places, but I don’t like getting up too early.'},
    {label:'Café conversation', prompt:'You meet someone in a café. Talk about what you like doing when you travel.', teacher:['Is this your first time in Canada?','What do you enjoy doing here?','Do you like trying local food?'], model:'Yes, it is my first time. I enjoy visiting new places and I like trying local food. I also enjoy talking to people.'},
    {label:'National park', prompt:'You speak to a park ranger. Explain your preferences and ask for an easy activity.', teacher:['Do you enjoy hiking?','Do you like watching wildlife?','Do you want an easy or difficult trail?'], model:'I enjoy hiking, but I prefer easy trails. I like watching wildlife, but I want to stay safe.'},
    {label:'Transport desk', prompt:'You are choosing transport. Explain what you like and don’t like about travelling.', teacher:['Do you like travelling by train?','Do you enjoy driving in a new country?','What is more comfortable for you?'], model:'I like travelling by train because it is comfortable. I don’t enjoy driving in a new country because it can be stressful.'},
    {label:'Travel companion', prompt:'You and your travel partner plan the day. Agree, disagree, and suggest activities using like/enjoy + verb-ing.', teacher:['I want to go shopping. What do you think?','Do you enjoy visiting museums?','What would you prefer doing this afternoon?'], model:'I don’t really like shopping for a long time. I enjoy visiting museums, and after that I would like to stop for coffee.'}
  ];
  function renderScenario(){
    const s = scenarios[Math.floor(Math.random()*scenarios.length)];
    $('#scenarioCard').innerHTML = `
      <span class="scenarioLabel">🍁 ${s.label}</span>
      <p class="scenarioPrompt">${s.prompt}</p>
      <h3>Teacher prompts</h3>
      <ol>${s.teacher.map(x => `<li>${x}</li>`).join('')}</ol>
      <h3>Language target</h3>
      <p>Use: <strong>I like ___ing</strong>, <strong>I enjoy ___ing</strong>, <strong>I don’t like ___ing</strong>, <strong>because</strong>, <strong>but</strong>.</p>
      <div class="rowActions">
        <button class="listenSmall" data-say="${s.prompt.replace(/"/g,'&quot;')} ${s.teacher.join(' ').replace(/"/g,'&quot;')}" type="button">Listen prompts</button>
        <button class="listenSmall" data-say="${s.model.replace(/"/g,'&quot;')}" type="button">Listen model</button>
      </div>
      <div class="modelBox"><strong>Model answer:</strong><p>${s.model}</p></div>`;
  }
  $('#newScenario').addEventListener('click', renderScenario);

  function startTimer(type){
    const span = type === 'prep' ? $('#prepTime') : $('#speakTime');
    clearInterval(timers[type]);
    let time = type === 'prep' ? 20 : 45;
    span.textContent = time;
    timers[type] = setInterval(() => {
      time -= 1;
      span.textContent = time;
      if(time <= 0){
        clearInterval(timers[type]);
        speak(type === 'prep' ? 'Preparation finished. Speak now.' : 'Speaking time finished.');
      }
    }, 1000);
  }
  $$('[data-timer]').forEach(btn => btn.addEventListener('click', () => startTimer(btn.dataset.timer)));

  $('#listenNotes').addEventListener('click', () => speak($('#studentNotes').value || 'Write your notes first.'));
  $('#clearNotes').addEventListener('click', () => $('#studentNotes').value = '');

  renderWarmups();
  renderVocab();
  renderQuiz();
  renderDropdowns();
  renderTransforms();
  renderBuilderSelect();
  renderBuilder();
  renderDialogue();
  renderScenario();
  updateScore();
})();
