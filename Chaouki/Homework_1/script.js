(() => {
  const vocab = {
    personal: [
      {emoji:'👋', word:'my name is', fr:'je m’appelle', meaning:'Use this to say your name.', example:'My name is Chaouki.'},
      {emoji:'🇫🇷', word:'from', fr:'originaire de / venant de', meaning:'Use this to say your country or city of origin.', example:'I am from France.'},
      {emoji:'🏙️', word:'live', fr:'habiter / vivre', meaning:'Use this to say where you live.', example:'I live in Paris.'},
      {emoji:'🎂', word:'years old', fr:'ans', meaning:'Use this to say a person’s age.', example:'My daughter is four years old.'},
      {emoji:'🇫🇷', word:'French', fr:'français / française', meaning:'A nationality.', example:'I am French.'},
      {emoji:'😊', word:'nice to meet you', fr:'enchanté(e)', meaning:'A polite sentence when you meet someone.', example:'Nice to meet you!'}
    ],
    work: [
      {emoji:'🏋️', word:'gym', fr:'salle de sports', meaning:'A place where people do sports and exercise.', example:'I work in a gym.'},
      {emoji:'👔', word:'gym manager', fr:'responsable / directeur de salle de sport', meaning:'A person who manages a gym.', example:'I am a gym manager.'},
      {emoji:'👥', word:'staff', fr:'équipe / personnel', meaning:'The people who work in a place.', example:'I manage the staff.'},
      {emoji:'🙂', word:'client', fr:'client', meaning:'A person who uses a service.', example:'I help clients.'},
      {emoji:'🏃', word:'personal trainer', fr:'coach sportif personnel', meaning:'A coach who works with one client.', example:'A personal trainer helps clients exercise.'},
      {emoji:'🧾', word:'receptionist', fr:'réceptionniste', meaning:'A person who welcomes clients at reception.', example:'The receptionist welcomes clients.'}
    ],
    family: [
      {emoji:'👩', word:'wife', fr:'femme / épouse', meaning:'The woman you are married to.', example:'I travel with my wife.'},
      {emoji:'👧', word:'daughter', fr:'fille', meaning:'A female child.', example:'I have a daughter.'},
      {emoji:'👦', word:'son', fr:'fils', meaning:'A male child.', example:'He has a son.'},
      {emoji:'🧒', word:'children', fr:'enfants', meaning:'More than one child.', example:'We travel with our children.'},
      {emoji:'👨', word:'brother', fr:'frère', meaning:'A male sibling.', example:'I spend time with my brother.'},
      {emoji:'👩', word:'sister', fr:'sœur', meaning:'A female sibling.', example:'She has a sister.'}
    ],
    'free-time': [
      {emoji:'🏀', word:'sports', fr:'sport', meaning:'Physical activities or games.', example:'I like sports.'},
      {emoji:'🎵', word:'music', fr:'musique', meaning:'Songs and sounds.', example:'I enjoy music.'},
      {emoji:'✈️', word:'travelling', fr:'voyager', meaning:'Going to different places.', example:'I like travelling.'},
      {emoji:'😌', word:'relax', fr:'se détendre', meaning:'To rest and feel calm.', example:'In the evening, I like to relax.'},
      {emoji:'👨‍👩‍👧', word:'spend time with', fr:'passer du temps avec', meaning:'To be with another person.', example:'I spend time with my family.'},
      {emoji:'🏋️', word:'go to the gym', fr:'aller à la salle de sport', meaning:'To exercise at a gym.', example:'I go to the gym every day.'}
    ],
    verbs: [
      {emoji:'🔵', word:'be', fr:'être', meaning:'Use be for identity, country, feelings and jobs.', example:'I am a gym manager.'},
      {emoji:'👜', word:'have', fr:'avoir', meaning:'Use have for family and things you possess.', example:'I have a daughter.'},
      {emoji:'🏠', word:'live', fr:'habiter / vivre', meaning:'Use live for your home or city.', example:'I live in Paris.'},
      {emoji:'💼', word:'work', fr:'travailler', meaning:'Use work for your job.', example:'I work in a gym.'},
      {emoji:'❤️', word:'like', fr:'aimer', meaning:'Use like for preferences.', example:'I like music.'},
      {emoji:'✈️', word:'travel', fr:'voyager', meaning:'To go to another place.', example:'I travel by plane.'}
    ],
    questions: [
      {emoji:'❓', word:'What is your name?', fr:'Comment vous appelez-vous ?', meaning:'Ask about a person’s name.', example:'My name is Chaouki.'},
      {emoji:'📍', word:'Where are you from?', fr:'D’où venez-vous ?', meaning:'Ask about country or origin.', example:'I am from France.'},
      {emoji:'🏠', word:'Where do you live?', fr:'Où habitez-vous ?', meaning:'Ask about home or city.', example:'I live in Paris.'},
      {emoji:'💼', word:'What do you do?', fr:'Quel est votre métier ?', meaning:'Ask about a person’s job.', example:'I am a gym manager.'},
      {emoji:'👨‍👩‍👧', word:'Do you have children?', fr:'Avez-vous des enfants ?', meaning:'Ask about family.', example:'Yes, I have a daughter.'},
      {emoji:'❤️', word:'What do you like?', fr:'Qu’est-ce que vous aimez ?', meaning:'Ask about preferences.', example:'I like sports and music.'}
    ]
  };

  const qaData = [
    {q:'What is your name?', fr:'Comment vous appelez-vous ?', a:'My name is Chaouki.', hint:'My name is …'},
    {q:'Where are you from?', fr:'D’où venez-vous ?', a:'I am from France.', hint:'I am from …'},
    {q:'Where do you live?', fr:'Où habitez-vous ?', a:'I live in Paris.', hint:'I live in …'},
    {q:'What do you do?', fr:'Quel est votre métier ?', a:'I am a gym manager.', hint:'I am a …'},
    {q:'Do you have children?', fr:'Avez-vous des enfants ?', a:'Yes, I have a daughter.', hint:'Yes, I have …'},
    {q:'What do you like?', fr:'Qu’est-ce que vous aimez ?', a:'I like sports, music and travelling.', hint:'I like …'},
    {q:'Who do you travel with?', fr:'Avec qui voyagez-vous ?', a:'I travel with my wife and daughter.', hint:'I travel with …'},
    {q:'How do you travel?', fr:'Comment voyagez-vous ?', a:'I usually travel by plane.', hint:'I usually travel by …'}
  ];

  const listeningData = [
    {name:'Maya', emoji:'👩', audio:'Hello, my name is Maya. I live in London. I work in a hotel. I have two children. I like cooking.', question:'Where does Maya work?', answers:['In a hotel','In a gym','At an airport'], correct:0},
    {name:'Leo', emoji:'👨', audio:'Hi, I am Leo. I am from Italy. I work as a personal trainer. I have a son. I like sports and music.', question:'What is Leo’s job?', answers:['A receptionist','A personal trainer','A gym manager'], correct:1},
    {name:'Sarah', emoji:'👩', audio:'Hello, I am Sarah. I live in Paris with my brother. I work in a shop. I travel by train. I like travelling.', question:'How does Sarah travel?', answers:['By bus','By train','By plane'], correct:1}
  ];

  const toast = document.getElementById('toast');
  let toastTimer;
  const sayToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  function speak(text, rate=0.9) {
    if (!('speechSynthesis' in window)) { sayToast('Audio is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = rate;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => /en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  }

  document.querySelectorAll('[data-speak]').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.speak, Number(btn.dataset.speakRate || 0.9)));
  });

  const frenchToggle = document.getElementById('toggleFrench');
  frenchToggle.addEventListener('click', () => {
    const hidden = document.body.classList.toggle('hide-french');
    frenchToggle.setAttribute('aria-pressed', String(hidden));
    frenchToggle.textContent = hidden ? '🇫🇷 Show French' : '🇫🇷 Hide French';
  });
  const frenchStyle = document.createElement('style');
  frenchStyle.textContent = '.hide-french .fr{display:none!important}';
  document.head.appendChild(frenchStyle);

  const grid = document.getElementById('vocabGrid');
  const select = document.getElementById('vocabCategory');
  function renderVocab(category){
    grid.innerHTML = vocab[category].map(item => `
      <article class="vocab-card">
        <div class="vocab-card__head"><div><h3>${item.word}</h3><p class="translation">${item.fr}</p></div><span class="vocab-card__emoji" aria-hidden="true">${item.emoji}</span></div>
        <p class="meaning">${item.meaning}</p>
        <p class="example"><strong>Example:</strong> ${item.example}</p>
        <button class="tiny-audio" data-word-audio="${item.word.replaceAll('&','&amp;').replaceAll('"','&quot;')}" type="button">🔊 Listen</button>
      </article>`).join('');
    grid.querySelectorAll('[data-word-audio]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.wordAudio)));
  }
  select.addEventListener('change', e => renderVocab(e.target.value));
  renderVocab('personal');

  document.querySelectorAll('.check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.builderKey;
      const select = document.querySelector(`[data-builder="${key}"]`);
      const feedback = document.getElementById(`feedback-${key}`);
      const correct = select.value === btn.dataset.builderAnswer;
      feedback.textContent = correct ? '✓ Excellent! Read the full sentence aloud.' : 'Try again. Look at the words carefully.';
      feedback.className = `feedback ${correct ? 'correct' : 'incorrect'}`;
    });
  });
  document.getElementById('showBuilderModels').addEventListener('click', () => {
    document.querySelectorAll('.builder-model').forEach(model => model.hidden = !model.hidden);
    sayToast('Models are now visible.');
  });

  document.querySelectorAll('.check-exercise').forEach(btn => {
    btn.addEventListener('click', () => {
      const exercise = btn.dataset.checkExercise;
      const section = document.querySelector(`[data-exercise="${exercise}"]`);
      let score = 0;
      const fields = section.querySelectorAll('select');
      fields.forEach(field => {
        const result = field.closest('.question-row').querySelector('.result');
        const correct = field.value === field.dataset.answer;
        result.textContent = correct ? '✓' : '↺';
        result.className = `result ${correct ? 'good' : 'bad'}`;
        if (correct) score++;
      });
      const feedback = document.getElementById(`${exercise}-feedback`);
      feedback.textContent = score === fields.length ? '✓ Perfect! Well done.' : `${score}/${fields.length} correct. Read the model sentences and try again.`;
      feedback.className = `feedback exercise-feedback ${score === fields.length ? 'correct' : 'incorrect'}`;
    });
  });

  const orderState = {order1:[],order2:[]};
  document.querySelectorAll('.word-bank').forEach(bank => {
    const id = bank.dataset.bank;
    bank.querySelectorAll('button').forEach(wordBtn => {
      wordBtn.addEventListener('click', () => {
        if (wordBtn.disabled) return;
        orderState[id].push(wordBtn.textContent);
        wordBtn.disabled = true;
        document.querySelector(`[data-target="${id}"]`).textContent = orderState[id].join(' ');
      });
    });
  });
  document.querySelectorAll('.check-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.order;
      const exercise = document.querySelector(`[data-order-answer] [data-bank="${id}"]`)?.closest('.order-exercise');
      const answer = exercise.dataset.orderAnswer;
      const actual = orderState[id].join(' ');
      const result = document.querySelector(`[data-order-result="${id}"]`);
      const correct = actual === answer;
      result.textContent = correct ? '✓ Great!' : '↺ Try again';
      result.className = `result ${correct ? 'good' : 'bad'}`;
    });
  });
  document.querySelectorAll('.reset-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.order;
      orderState[id] = [];
      document.querySelector(`[data-target="${id}"]`).textContent = 'Click the words →';
      document.querySelectorAll(`[data-bank="${id}"] button`).forEach(b => b.disabled=false);
      const result = document.querySelector(`[data-order-result="${id}"]`);
      result.textContent=''; result.className='result';
    });
  });

  const qaGrid = document.getElementById('qaCards');
  qaGrid.innerHTML = qaData.map((item, i) => `
    <article class="qa-card">
      <div class="qa-card__top"><div><span class="qa-number">QUESTION ${i+1}</span><h3>${item.q}</h3><p class="fr">${item.fr}</p></div><button class="tiny-audio" data-qa-audio="${item.q}" type="button">🔊 Listen</button></div>
      <div class="qa-model"><p><strong>Model answer:</strong> ${item.a}</p><p class="fr">Réponse modèle : lisez la phrase, puis utilisez-la pour parler de vous.</p></div>
      <label for="answer-${i}">My answer <span class="fr">/ Ma réponse</span></label><textarea id="answer-${i}" placeholder="${item.hint}"></textarea>
      <p class="hint">💬 Say it aloud after you write it.</p>
    </article>`).join('');
  qaGrid.querySelectorAll('[data-qa-audio]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.qaAudio, 0.78)));

  const listeningGrid = document.getElementById('listeningCards');
  listeningGrid.innerHTML = listeningData.map((item,i) => `
    <article class="listening-card">
      <div class="listening-card__head"><div class="listening-avatar">${item.emoji}</div><span>LISTENING ${i+1}</span></div>
      <h3>Meet ${item.name}</h3>
      <button class="audio-btn" data-listening-audio="${item.audio.replaceAll('&','&amp;').replaceAll('"','&quot;')}" type="button">🔊 Listen slowly</button>
      <div class="listening-question"><p>${item.question}</p><div class="choice-list">${item.answers.map((answer,choice) => `<label><input type="radio" name="listen-${i}" value="${choice}"/> ${answer}</label>`).join('')}</div><button class="check-exercise" data-listen-check="${i}" type="button">Check</button><p class="listening-feedback" id="listen-feedback-${i}"></p></div>
    </article>`).join('');
  listeningGrid.querySelectorAll('[data-listening-audio]').forEach(btn=>btn.addEventListener('click',()=>speak(btn.dataset.listeningAudio,0.72)));
  listeningGrid.querySelectorAll('[data-listen-check]').forEach(btn=>btn.addEventListener('click',()=>{
    const index=Number(btn.dataset.listenCheck);const selected=document.querySelector(`input[name="listen-${index}"]:checked`);const feedback=document.getElementById(`listen-feedback-${index}`);
    if(!selected){feedback.textContent='Choose one answer first.';feedback.className='listening-feedback';return;}
    const correct=Number(selected.value)===listeningData[index].correct;feedback.textContent=correct?'✓ Correct! Well done.':'↺ Not yet. Listen again slowly.';feedback.className=`listening-feedback ${correct?'correct':'incorrect'}`;
  }));

  const introForm = document.getElementById('introForm');
  const introOutput = document.getElementById('myIntroduction');
  let currentIntro = '';
  const createIntro = () => {
    const city = document.getElementById('introCity').value.trim() || 'Paris';
    const job = document.getElementById('introJob').value.trim() || 'gym manager';
    const family = document.getElementById('introFamily').value.trim() || 'a family';
    const likes = document.getElementById('introLikes').value.trim() || 'sports and music';
    const travel = document.getElementById('introTravel').value.trim() || 'by plane';
    const lines = [
      'Hello, my name is Chaouki.',
      `I am from France and I live in ${city}.`,
      `I am a ${job}.`,
      `I have ${family}.`,
      `I like ${likes}.`,
      `I usually travel ${travel}.`,
      'My goal is to feel comfortable speaking English.',
      'Nice to meet you!'
    ];
    currentIntro = lines.join(' ');
    introOutput.innerHTML = lines.map(line=>`<p>${line}</p>`).join('');
  };
  introForm.addEventListener('submit', (event) => {event.preventDefault();createIntro();sayToast('Your introduction is ready!');});
  createIntro();
  document.getElementById('listenMyIntro').addEventListener('click',()=>speak(currentIntro,0.9));
  document.getElementById('slowMyIntro').addEventListener('click',()=>speak(currentIntro,0.7));

  document.getElementById('checkConfidence').addEventListener('click', () => {
    const total = document.querySelectorAll('#confidenceList input').length;
    const done = document.querySelectorAll('#confidenceList input:checked').length;
    const msg = document.getElementById('confidenceMessage');
    if(done === 0) msg.textContent = 'Choose the things you can do today.';
    else if(done < total) msg.textContent = `You can do ${done} out of ${total}. Keep practising — you are improving!`;
    else msg.textContent = 'Wonderful! You can now introduce yourself with confidence.';
  });

  document.getElementById('resetAll').addEventListener('click', () => {
    if(!confirm('Reset all answers on this page?')) return;
    document.querySelectorAll('select').forEach(s=>{ if(s.id !== 'vocabCategory') s.selectedIndex=0; });
    document.querySelectorAll('textarea').forEach(t=>t.value='');
    document.querySelectorAll('input[type="radio"],input[type="checkbox"]').forEach(i=>i.checked=false);
    document.querySelectorAll('.feedback,.listening-feedback,.result').forEach(el=>{el.textContent='';el.className=el.className.replace(/\b(correct|incorrect|good|bad)\b/g,'').trim();});
    ['order1','order2'].forEach(id=>{orderState[id]=[];document.querySelector(`[data-target="${id}"]`).textContent='Click the words →';document.querySelectorAll(`[data-bank="${id}"] button`).forEach(b=>b.disabled=false);});
    document.querySelectorAll('.builder-model').forEach(m=>m.hidden=true);
    document.body.classList.remove('hide-french');frenchToggle.textContent='🇫🇷 Hide French';frenchToggle.setAttribute('aria-pressed','false');
    createIntro();
    sayToast('The page has been reset.');
  });
})();
