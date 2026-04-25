(() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const JS_STATUS = $('#jsStatus');
  const DEBUG = $('#debugBox');
  function logDebug(msg){
    try {
      if(!DEBUG) return;
      DEBUG.classList.remove('hidden');
      DEBUG.textContent += `\n${msg}`;
    } catch(err) {}
  }

  window.addEventListener('error', (e) => {
    if (JS_STATUS) JS_STATUS.textContent = 'JS: ❌ error';
    logDebug(`[Error] ${e.message} @ ${e.filename}:${e.lineno}`);
  });
  window.addEventListener('unhandledrejection', (e) => {
    if (JS_STATUS) JS_STATUS.textContent = 'JS: ❌ promise';
    logDebug(`[Promise] ${String(e.reason)}`);
  });

  function escapeHtml(s){
    return String(s ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }
  function normalize(s){
    return String(s ?? '')
      .replace(/[’']/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
  function shuffle(arr){
    const a = (arr || []).slice();
    for(let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function attachTap(el, handler){
    if(!el) return;
    const h = (e) => {
      try { handler(e); } catch(err) { console.error(err); logDebug(String(err)); }
    };
    el.addEventListener('click', h);
  }
  function safeOn(sel, evt, handler){
    const el = $(sel);
    if(el) el.addEventListener(evt, handler);
  }

  const Speech = {
    mode: 'en-GB',
    rate: 0.96,
    getVoices(){ try { return window.speechSynthesis?.getVoices?.() || []; } catch(err){ return []; } },
    pickVoice(){
      const voices = this.getVoices();
      const lang = this.mode.toLowerCase();
      let best = voices.find(v => (v.lang || '').toLowerCase() === lang);
      if(!best) best = voices.find(v => (v.lang || '').toLowerCase().startsWith(lang));
      if(!best) best = voices.find(v => (v.lang || '').toLowerCase().startsWith('en'));
      return best || null;
    },
    say(text){
      if(!window.speechSynthesis) return;
      try { window.speechSynthesis.cancel(); } catch(err) {}
      const u = new SpeechSynthesisUtterance(String(text || ''));
      const voice = this.pickVoice();
      if(voice) u.voice = voice;
      u.lang = this.mode;
      u.rate = this.rate;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    },
    pause(){ try { window.speechSynthesis?.pause(); } catch(err) {} },
    resume(){ try { window.speechSynthesis?.resume(); } catch(err) {} },
    stop(){ try { window.speechSynthesis?.cancel(); } catch(err) {} }
  };
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => Speech.getVoices();

  const Score = {
    now: 0,
    max: 0,
    awarded: new Set(),
    award(key, pts = 1){
      if(this.awarded.has(key)) return;
      this.awarded.add(key);
      this.now += pts;
      updateScore();
      updateProgress();
    },
    reset(){
      this.now = 0;
      this.awarded.clear();
      updateScore();
      updateProgress();
    }
  };
  function updateScore(){
    if($('#scoreNow')) $('#scoreNow').textContent = String(Score.now);
    if($('#scoreMax')) $('#scoreMax').textContent = String(Score.max);
  }
  function updateProgress(){
    const bar = $('#progressBar');
    if(!bar) return;
    const pct = Score.max ? Math.round((Score.now / Score.max) * 100) : 0;
    bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  }

  const SCENARIOS = [
    {
      key: 'about_you',
      title: '👋 About you at work',
      level: 'A1+ / A2',
      goal: 'Present yourself clearly: your name, your age, your city, and your job.',
      context: [
        { ico: '🪪', t: 'You introduce yourself in simple English.', fr: 'Tu te présentes en anglais simple.' },
        { ico: '🏨', t: 'You say where you work now.', fr: 'Tu dis où tu travailles maintenant.' },
        { ico: '🎯', t: 'You say your future goal.', fr: 'Tu dis ton objectif futur.' }
      ],
      guide: [
        { q: 'What is your name?', a: 'My name is Yanis.', fr: 'Je m’appelle Yanis.' },
        { q: 'How old are you?', a: 'I am twenty-five years old.', fr: 'J’ai vingt-cinq ans.' },
        { q: 'Where do you live?', a: 'I live in Schiltigheim.', fr: 'J’habite à Schiltigheim.' },
        { q: 'What do you do?', a: 'I work as a receptionist in a hotel.', fr: 'Je travaille comme réceptionniste dans un hôtel.' },
        { q: 'What is your goal?', a: 'My goal is to become a steward.', fr: 'Mon objectif est de devenir steward.' }
      ],
      phrases: [
        'My name is Yanis.',
        'I am twenty-five years old.',
        'I live in Schiltigheim.',
        'I work as a receptionist in a hotel.',
        'My goal is to become a steward.'
      ],
      roleplay: [
        { who: 'Teacher', side: 'a', say: 'Hello. Please introduce yourself.' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'My name is Yanis. I am twenty-five years old and I live in Schiltigheim.' },
        { who: 'Teacher', side: 'a', say: 'What do you do?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I work as a receptionist in a hotel.' },
        { who: 'Teacher', side: 'a', say: 'What is your future goal?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'My goal is to become a steward.' }
      ],
      drills: [
        { set: 'about_you', say: 'What is your name?', prompt: 'Choose the best answer.', choices: ['My name is Yanis.', 'I am in a hotel.', 'I answer the phone.'], answer: 0, hint: 'Use: My name is…' },
        { set: 'about_you', say: 'Where do you live?', prompt: 'Choose the best answer.', choices: ['I live in Schiltigheim.', 'I work with guests.', 'I reply by email.'], answer: 0, hint: 'Use: I live in + place.' },
        { set: 'about_you', say: 'What is your goal?', prompt: 'Choose the best answer.', choices: ['My goal is to become a steward.', 'I am at the front desk.', 'I answer the phone.'], answer: 0, hint: 'Use: My goal is to…' }
      ],
      buildTasks: [
        { key: 'b1', title: 'Present yourself', target: 'My name is Yanis and I live in Schiltigheim.', tokens: ['My','name','is','Yanis','and','I','live','in','Schiltigheim.'] },
        { key: 'b2', title: 'Say your goal', target: 'My goal is to become a steward.', tokens: ['My','goal','is','to','become','a','steward.'] }
      ]
    },
    {
      key: 'job_tasks',
      title: '🏨 Your current job and tasks',
      level: 'A1+ / A2',
      goal: 'Answer simple questions about your work tasks at the hotel.',
      context: [
        { ico: '☎️', t: 'You talk about the phone and emails.', fr: 'Tu parles du téléphone et des e-mails.' },
        { ico: '🛎️', t: 'You explain check-in, check-out, and reservations.', fr: 'Tu expliques le check-in, le check-out et les réservations.' },
        { ico: '👥', t: 'You say what you do well with guests.', fr: 'Tu dis ce que tu fais bien avec les clients.' }
      ],
      guide: [
        { q: 'Where do you work?', a: 'I work in a three-star hotel.', fr: 'Je travaille dans un hôtel trois étoiles.' },
        { q: 'What do you do at work?', a: 'I welcome guests and answer the phone.', fr: 'J’accueille les clients et je réponds au téléphone.' },
        { q: 'Do you reply to emails?', a: 'Yes, I do. I reply to emails by email.', fr: 'Oui. Je réponds aux e-mails.' },
        { q: 'Do you make reservations?', a: 'Yes, I do. I make reservations for guests.', fr: 'Oui. Je fais des réservations pour les clients.' },
        { q: 'Do you work on weekends?', a: 'Yes, I do. I serve breakfast on weekends.', fr: 'Oui. Je sers le petit déjeuner le week-end.' }
      ],
      phrases: [
        'I work in a three-star hotel.',
        'I welcome guests.',
        'I answer the phone.',
        'I reply to emails.',
        'I make reservations for guests.',
        'I serve breakfast on weekends.'
      ],
      roleplay: [
        { who: 'Teacher', side: 'a', say: 'Where do you work?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I work in a three-star hotel.' },
        { who: 'Teacher', side: 'a', say: 'What do you do at work?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I welcome guests, I answer the phone, and I reply to emails.' },
        { who: 'Teacher', side: 'a', say: 'Do you make reservations?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'Yes, I do. I make reservations for guests.' }
      ],
      drills: [
        { set: 'job_tasks', say: 'Do you answer the phone?', prompt: 'Choose the best answer.', choices: ['Yes, I do.', 'Yes, I am.', 'Yes, I work.'], answer: 0, hint: 'Present simple question → Yes, I do.' },
        { set: 'job_tasks', say: 'What do you do at work?', prompt: 'Choose the best answer.', choices: ['I welcome guests and reply to emails.', 'I am twenty-five years old.', 'I live in Schiltigheim.'], answer: 0, hint: 'Answer with tasks.' },
        { set: 'job_tasks', say: 'Do you work on weekends?', prompt: 'Choose the best answer.', choices: ['Yes, I do.', 'Yes, I am in a hotel.', 'Yes, I am a steward.'], answer: 0, hint: 'Use do / do not.' }
      ],
      buildTasks: [
        { key: 'b1', title: 'Say your tasks', target: 'I welcome guests and answer the phone.', tokens: ['I','welcome','guests','and','answer','the','phone.'] },
        { key: 'b2', title: 'Say a hotel task', target: 'I make reservations for guests.', tokens: ['I','make','reservations','for','guests.'] }
      ]
    },
    {
      key: 'english_at_work',
      title: '💬 English at work',
      level: 'A1+ / A2',
      goal: 'Explain when you use English and ask simple questions to a guest.',
      context: [
        { ico: '📞', t: 'You use English on the phone.', fr: 'Tu utilises l’anglais au téléphone.' },
        { ico: '📧', t: 'You use English by email.', fr: 'Tu utilises l’anglais par e-mail.' },
        { ico: '❓', t: 'You ask a simple question to a guest.', fr: 'Tu poses une question simple à un client.' }
      ],
      guide: [
        { q: 'When do you use English?', a: 'I use English on the phone and by email.', fr: 'J’utilise l’anglais au téléphone et par e-mail.' },
        { q: 'Do you use English every day?', a: 'No, I do not. I use English sometimes.', fr: 'Non. J’utilise parfois l’anglais.' },
        { q: 'What simple question can you ask?', a: 'What is your reservation number?', fr: 'Quel est votre numéro de réservation ?' },
        { q: 'What else can you ask?', a: 'Do you need help?', fr: 'Avez-vous besoin d’aide ?' }
      ],
      phrases: [
        'I use English on the phone.',
        'I use English by email.',
        'I use English sometimes.',
        'What is your reservation number?',
        'Do you need help?'
      ],
      roleplay: [
        { who: 'Teacher', side: 'a', say: 'When do you use English?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I use English on the phone and by email.' },
        { who: 'Teacher', side: 'a', say: 'Do you use English every day?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'No, I do not. I use English sometimes.' },
        { who: 'Teacher', side: 'a', say: 'Please ask a guest a simple question.' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'What is your reservation number?' }
      ],
      drills: [
        { set: 'english_at_work', say: 'When do you use English?', prompt: 'Choose the best answer.', choices: ['I use English on the phone and by email.', 'I am a receptionist.', 'My name is Yanis.'], answer: 0, hint: 'Answer with when / how.' },
        { set: 'english_at_work', say: 'Do you use English every day?', prompt: 'Choose the best answer.', choices: ['No, I do not. I use English sometimes.', 'No, I am not.', 'No, I live in France.'], answer: 0, hint: 'Use do / do not.' },
        { set: 'english_at_work', say: 'Choose the best simple guest question.', prompt: 'Which is the best question?', choices: ['What is your reservation number?', 'I reservation number you?', 'Reservation your what is?'], answer: 0, hint: 'Question word + is + your…' }
      ],
      buildTasks: [
        { key: 'b1', title: 'Say when you use English', target: 'I use English on the phone and by email.', tokens: ['I','use','English','on','the','phone','and','by','email.'] },
        { key: 'b2', title: 'Ask a guest a question', target: 'What is your reservation number?', tokens: ['What','is','your','reservation','number?'] }
      ]
    },
    {
      key: 'future_goal',
      title: '✈️ Your future goal: become a steward',
      level: 'A1+ / A2',
      goal: 'Explain why you want to become a steward in simple English.',
      context: [
        { ico: '🎯', t: 'You say your goal clearly.', fr: 'Tu exprimes clairement ton objectif.' },
        { ico: '🤝', t: 'You explain that you like working with people.', fr: 'Tu expliques que tu aimes travailler avec les gens.' },
        { ico: '🛫', t: 'You connect your hotel job to the airline world.', fr: 'Tu relies ton travail à l’hôtel au monde aérien.' }
      ],
      guide: [
        { q: 'What is your goal?', a: 'My goal is to become a steward.', fr: 'Mon objectif est de devenir steward.' },
        { q: 'Why do you want to become a steward?', a: 'I want to become a steward because I like working with people.', fr: 'Je veux devenir steward parce que j’aime travailler avec les gens.' },
        { q: 'What do you like in this job?', a: 'I like customer contact and service.', fr: 'J’aime le contact client et le service.' },
        { q: 'What can you bring?', a: 'I can welcome people and help passengers.', fr: 'Je peux accueillir les gens et aider les passagers.' }
      ],
      phrases: [
        'My goal is to become a steward.',
        'I want to become a steward because I like working with people.',
        'I like customer contact and service.',
        'I can welcome people and help passengers.'
      ],
      roleplay: [
        { who: 'Teacher', side: 'a', say: 'What is your future goal?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'My goal is to become a steward.' },
        { who: 'Teacher', side: 'a', say: 'Why do you want to become a steward?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I want to become a steward because I like working with people and I like service.' },
        { who: 'Teacher', side: 'a', say: 'What can you do well?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I can welcome people and help passengers.' }
      ],
      drills: [
        { set: 'future_goal', say: 'Why do you want to become a steward?', prompt: 'Choose the best answer.', choices: ['Because I like working with people.', 'I live in Schiltigheim.', 'I am twenty-five years old.'], answer: 0, hint: 'Use because + reason.' },
        { set: 'future_goal', say: 'What is your goal?', prompt: 'Choose the best answer.', choices: ['My goal is to become a steward.', 'I work on weekends.', 'I answer the phone.'], answer: 0, hint: 'Use: My goal is to…' },
        { set: 'future_goal', say: 'What can you do well?', prompt: 'Choose the best answer.', choices: ['I can welcome people and help passengers.', 'I by email English.', 'I do not in a hotel.'], answer: 0, hint: 'Use can + base verb.' }
      ],
      buildTasks: [
        { key: 'b1', title: 'Explain your goal', target: 'I want to become a steward because I like service.', tokens: ['I','want','to','become','a','steward','because','I','like','service.'] },
        { key: 'b2', title: 'Say what you can do', target: 'I can welcome people and help passengers.', tokens: ['I','can','welcome','people','and','help','passengers.'] }
      ]
    },
    {
      key: 'mini_interview',
      title: '🎤 Mini interview: current job + future goal',
      level: 'A1+ / A2',
      goal: 'Answer a short interview using your current job and your future goal.',
      context: [
        { ico: '🧠', t: 'You use simple answers with be and present simple.', fr: 'Tu utilises des réponses simples avec be et le présent simple.' },
        { ico: '🔄', t: 'You answer and ask simple questions.', fr: 'Tu réponds et tu poses des questions simples.' },
        { ico: '🌟', t: 'You connect your work now to your future.', fr: 'Tu relies ton travail actuel à ton futur.' }
      ],
      guide: [
        { q: 'Where do you work now?', a: 'I work in a hotel.', fr: 'Je travaille dans un hôtel.' },
        { q: 'What do you do there?', a: 'I welcome guests, answer the phone, and reply to emails.', fr: 'J’accueille les clients, je réponds au téléphone et aux e-mails.' },
        { q: 'Do you use English at work?', a: 'Yes, I do. I use English on the phone and by email.', fr: 'Oui. J’utilise l’anglais au téléphone et par e-mail.' },
        { q: 'Why do you want to become a steward?', a: 'Because I like working with people and I like service.', fr: 'Parce que j’aime travailler avec les gens et j’aime le service.' },
        { q: 'What question can you ask?', a: 'Do you need help?', fr: 'Avez-vous besoin d’aide ?' }
      ],
      phrases: [
        'I work in a hotel.',
        'I welcome guests, answer the phone, and reply to emails.',
        'I use English on the phone and by email.',
        'I want to become a steward because I like service.',
        'Do you need help?'
      ],
      roleplay: [
        { who: 'Teacher', side: 'a', say: 'Where do you work now?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I work in a hotel.' },
        { who: 'Teacher', side: 'a', say: 'What do you do there?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'I welcome guests, answer the phone, and reply to emails.' },
        { who: 'Teacher', side: 'a', say: 'Do you use English at work?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'Yes, I do. I use English on the phone and by email.' },
        { who: 'Teacher', side: 'a', say: 'Why do you want to become a steward?' },
        { who: 'You', side: 'b', say: '(Your turn)', model: 'Because I like working with people and I like service.' }
      ],
      drills: [
        { set: 'mini_interview', say: 'Do you use English at work?', prompt: 'Choose the best answer.', choices: ['Yes, I do. I use English on the phone and by email.', 'Yes, I am in Schiltigheim.', 'Yes, I am twenty-five.'], answer: 0, hint: 'Use yes + do + detail.' },
        { set: 'mini_interview', say: 'Choose the best question for a guest.', prompt: 'Which is the best question?', choices: ['Do you need help?', 'You need help?', 'Need you help?'], answer: 0, hint: 'Do + you + verb?' },
        { set: 'mini_interview', say: 'Why do you want this job?', prompt: 'Choose the best answer.', choices: ['Because I like working with people and service.', 'I live in a hotel.', 'I am on the phone.'], answer: 0, hint: 'Use because + reason.' }
      ],
      buildTasks: [
        { key: 'b1', title: 'Short interview answer', target: 'I work in a hotel and I use English by email.', tokens: ['I','work','in','a','hotel','and','I','use','English','by','email.'] },
        { key: 'b2', title: 'Simple guest question', target: 'Do you need help?', tokens: ['Do','you','need','help?'] }
      ]
    }
  ];

  const DRILL_SETS = [
    { key: 'about_you', label: '👋 About you' },
    { key: 'job_tasks', label: '🏨 Job tasks' },
    { key: 'english_at_work', label: '💬 English at work' },
    { key: 'future_goal', label: '✈️ Future goal' },
    { key: 'mini_interview', label: '🎤 Mini interview' }
  ];

  const ALL_DRILLS = SCENARIOS.flatMap(s => (s.drills || []).map(d => ({ ...d, sid: s.key })));
  const ALL_TASKS = SCENARIOS.flatMap(s => (s.buildTasks || []).map(t => ({ ...t, sid: s.key, scenarioTitle: s.title })));

  Score.max = ALL_DRILLS.length + (ALL_TASKS.length * 2);
  updateScore();
  updateProgress();

  const state = {
    scenario: SCENARIOS[0],
    role: 'teacher',
    rpIndex: 0,
    prepTimer: null,
    speakTimer: null,
    currentDrill: null,
    builderApi: null
  };

  function currentScenario(){ return state.scenario; }

  function setVoice(mode){
    Speech.mode = mode;
    const uk = $('#voiceUK');
    const us = $('#voiceUS');
    if(mode === 'en-GB') {
      uk && uk.classList.add('is-on');
      us && us.classList.remove('is-on');
      uk && uk.setAttribute('aria-pressed','true');
      us && us.setAttribute('aria-pressed','false');
    } else {
      us && us.classList.add('is-on');
      uk && uk.classList.remove('is-on');
      us && us.setAttribute('aria-pressed','true');
      uk && uk.setAttribute('aria-pressed','false');
    }
  }

  function renderScenarioSelect(){
    const sel = $('#scenarioSelect');
    if(!sel) return;
    sel.innerHTML = '';
    SCENARIOS.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.key;
      opt.textContent = s.title;
      sel.appendChild(opt);
    });
    sel.value = currentScenario().key;
  }

  function renderScenario(){
    const s = currentScenario();
    $('#scTitle').textContent = s.title;
    $('#scLevel').textContent = s.level;

    const info = $('#scInfo');
    info.innerHTML = '';
    const goal = document.createElement('div');
    goal.className = 'line';
    goal.innerHTML = `<div class="ico">🎯</div><div><strong>Goal:</strong> ${escapeHtml(s.goal)}<span class="fr-sub">Objectif : parler plus clairement dans cette situation.</span></div>`;
    info.appendChild(goal);

    (s.context || []).forEach(item => {
      const row = document.createElement('div');
      row.className = 'line';
      row.innerHTML = `<div class="ico">${item.ico}</div><div>${escapeHtml(item.t)}<span class="fr-sub">${escapeHtml(item.fr || '')}</span></div>`;
      info.appendChild(row);
    });

    const guide = $('#scGuide');
    guide.innerHTML = '';
    (s.guide || []).forEach(item => {
      const row = document.createElement('div');
      row.className = 'line';
      row.innerHTML = `<div class="ico">💬</div><div><strong>${escapeHtml(item.q)}</strong><br>${escapeHtml(item.a)}<span class="fr-sub">${escapeHtml(item.fr || '')}</span></div>`;
      guide.appendChild(row);
    });

    $('#rpTitle').textContent = 'Role-play: ' + s.title;
    clearRoleplay();
    renderBuildTaskSelect();
  }

  function clearRoleplay(){
    const stream = $('#rpStream');
    if(stream) stream.innerHTML = '';
    state.rpIndex = 0;
    $('#modelBox').textContent = 'Click “Show model” when you need support.';
    $('#rpHintBox').classList.add('hidden');
  }

  function stopTimers(){
    if(state.prepTimer){ clearInterval(state.prepTimer); state.prepTimer = null; }
    if(state.speakTimer){ clearInterval(state.speakTimer); state.speakTimer = null; }
  }

  function startPrepTimer(seconds){
    stopTimers();
    let t = seconds;
    $('#prepTime').textContent = String(t);
    state.prepTimer = setInterval(() => {
      t -= 1;
      $('#prepTime').textContent = String(Math.max(0, t));
      if(t <= 0){ clearInterval(state.prepTimer); state.prepTimer = null; }
    }, 1000);
  }
  function startSpeakTimer(seconds){
    if(state.speakTimer){ clearInterval(state.speakTimer); state.speakTimer = null; }
    let t = seconds;
    $('#speakTime').textContent = String(t);
    state.speakTimer = setInterval(() => {
      t -= 1;
      $('#speakTime').textContent = String(Math.max(0, t));
      if(t <= 0){ clearInterval(state.speakTimer); state.speakTimer = null; }
    }, 1000);
  }

  function addBubble(line){
    const stream = $('#rpStream');
    if(!stream) return;
    const b = document.createElement('div');
    b.className = 'bubble ' + (line.side === 'a' ? 'a' : 'b');
    b.innerHTML = `
      <div class="who">${line.side === 'a' ? '🟦' : '🟥'} ${escapeHtml(line.who)}</div>
      <div class="txt">${escapeHtml(line.say)}</div>
      <div class="tools">
        <button class="toolmini" type="button">🔊 Listen</button>
      </div>`;
    attachTap($('.toolmini', b), () => {
      const txt = line.say === '(Your turn)' ? (line.model || '') : line.say;
      if(txt) Speech.say(txt);
    });
    stream.appendChild(b);
    stream.scrollTop = stream.scrollHeight;
  }

  function stepRoleplay(){
    const lines = currentScenario().roleplay || [];
    if(state.rpIndex >= lines.length) return false;
    const line = lines[state.rpIndex];
    addBubble(line);
    if(line.side === 'b') {
      $('#modelBox').textContent = line.model || '—';
      startPrepTimer(15);
    } else {
      $('#modelBox').textContent = 'Click “Show model” when you need support.';
    }
    state.rpIndex += 1;
    return true;
  }

  function playRoleplay(){
    clearRoleplay();
    stepRoleplay();
  }

  function showModelReply(){
    const lines = currentScenario().roleplay || [];
    const idx = Math.max(0, state.rpIndex - 1);
    for(let i = idx; i >= 0; i--) {
      if(lines[i] && lines[i].side === 'b') {
        $('#modelBox').textContent = lines[i].model || '—';
        if(lines[i].model) Speech.say(lines[i].model);
        return;
      }
    }
  }

  function showRoleplayHints(){
    const box = $('#rpHintBox');
    const phrases = currentScenario().phrases || [];
    box.classList.remove('hidden','ok','no');
    box.classList.add('ok');
    box.innerHTML = '💡 Useful phrases:<br>' + phrases.map(p => '• ' + escapeHtml(p)).join('<br>');
  }

  function listenAllRoleplay(){
    const text = (currentScenario().roleplay || []).map(line => line.say === '(Your turn)' ? (line.model || '') : line.say).join(' ');
    Speech.say(text);
  }

  function renderDrillSetSelect(){
    const sel = $('#drillSet');
    if(!sel) return;
    sel.innerHTML = '';
    DRILL_SETS.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.key;
      opt.textContent = s.label;
      sel.appendChild(opt);
    });
    sel.value = currentScenario().key;
  }

  function pickDrill(){
    const set = $('#drillSet')?.value || currentScenario().key;
    const pool = ALL_DRILLS.filter(d => d.set === set);
    if(pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function buildDrill(){
    const host = $('#drillHost');
    if(!host) return;
    const item = pickDrill();
    state.currentDrill = item;
    if(!item) {
      host.innerHTML = '<p class="tiny-note">No drills yet.</p>';
      return;
    }

    host.innerHTML = `
      <div class="line">
        <div class="ico">🎯</div>
        <div>
          <div style="font-weight:1100;">${escapeHtml(item.prompt)}</div>
          <div class="fr-sub">Lis la consigne, puis choisis la meilleure réponse.</div>
          <div style="margin-top:.28rem;"><strong>Prompt:</strong> “${escapeHtml(item.say)}”</div>
        </div>
      </div>
      <div class="reading" id="drillChoices"></div>
      <div class="feedback hidden" id="drillFb"></div>`;

    const choicesWrap = $('#drillChoices');
    const correctText = item.choices[item.answer];
    const shuffled = shuffle(item.choices.map((c, idx) => ({ text: c, correct: idx === item.answer })));

    shuffled.forEach((choiceObj, idx) => {
      const row = document.createElement('label');
      row.className = 'choice';
      row.innerHTML = `<input type="radio" name="drillChoice" aria-label="choice ${idx + 1}"><div>${escapeHtml(choiceObj.text)}</div>`;
      attachTap(row, () => {
        const fb = $('#drillFb');
        const ok = choiceObj.correct;
        fb.classList.remove('hidden','ok','no');
        fb.classList.add(ok ? 'ok' : 'no');
        fb.innerHTML = ok ? '✅ Correct!' : `❌ Not quite. Best answer: <strong>${escapeHtml(correctText)}</strong><br>💡 ${escapeHtml(item.hint || '')}`;
        if(ok) Score.award(`drill:${item.set}:${item.say}`, 1);
      });
      choicesWrap.appendChild(row);
    });
  }

  function makeToken(text){
    const token = document.createElement('div');
    token.className = 'token';
    token.textContent = text;
    token.draggable = true;
    token.addEventListener('dragstart', () => { window.__dragToken = token; });
    return token;
  }

  function buildWordOrder(host, task){
    if(!host) return { getBuilt(){ return ''; }, clear(){} };
    host.innerHTML = `
      <div class="line"><div class="ico">🧩</div><div><strong>${escapeHtml(task.title)}</strong><span class="fr-sub">Construis la phrase modèle avec les mots.</span></div></div>
      <div class="builder">
        <div class="bank" id="wordBank"></div>
        <div class="dropzone" id="dropZone"></div>
      </div>`;

    const bank = $('#wordBank', host);
    const zone = $('#dropZone', host);
    const idMap = new Map();

    const pieces = shuffle(task.tokens).map((txt, idx) => {
      const tok = makeToken(txt);
      tok.dataset.role = 'bank';
      tok.dataset.tid = `${task.key}-${idx}`;
      idMap.set(tok.dataset.tid, tok);

      attachTap(tok, () => {
        if(tok.classList.contains('is-used')) return;
        const clone = tok.cloneNode(true);
        clone.dataset.role = 'zone';
        clone.dataset.sourceTid = tok.dataset.tid;
        clone.classList.remove('is-used');
        clone.addEventListener('dragstart', () => { window.__dragToken = clone; });
        attachTap(clone, (e) => {
          e.stopPropagation();
          const source = idMap.get(clone.dataset.sourceTid);
          clone.remove();
          if(source){ source.classList.remove('is-used'); source.draggable = true; }
        });
        zone.appendChild(clone);
        tok.classList.add('is-used');
        tok.draggable = false;
      });
      return tok;
    });
    pieces.forEach(tok => bank.appendChild(tok));

    [bank, zone].forEach(cont => {
      cont.addEventListener('dragover', (e) => { e.preventDefault(); cont.classList.add('is-over'); });
      cont.addEventListener('dragleave', () => cont.classList.remove('is-over'));
      cont.addEventListener('drop', (e) => {
        e.preventDefault();
        cont.classList.remove('is-over');
        const dragged = window.__dragToken;
        if(!dragged) return;
        const targetTok = e.target.closest('.token');

        if(cont === bank && dragged.dataset.role === 'zone') {
          const source = idMap.get(dragged.dataset.sourceTid);
          dragged.remove();
          if(source){ source.classList.remove('is-used'); source.draggable = true; }
          return;
        }
        if(cont === zone && dragged.dataset.role === 'bank') {
          if(dragged.classList.contains('is-used')) return;
          const clone = dragged.cloneNode(true);
          clone.dataset.role = 'zone';
          clone.dataset.sourceTid = dragged.dataset.tid;
          clone.addEventListener('dragstart', () => { window.__dragToken = clone; });
          attachTap(clone, (e2) => {
            e2.stopPropagation();
            const source = idMap.get(clone.dataset.sourceTid);
            clone.remove();
            if(source){ source.classList.remove('is-used'); source.draggable = true; }
          });
          if(targetTok && targetTok.parentElement === zone) zone.insertBefore(clone, targetTok);
          else zone.appendChild(clone);
          dragged.classList.add('is-used');
          dragged.draggable = false;
          return;
        }
        if(cont === zone && dragged.dataset.role === 'zone') {
          if(targetTok && targetTok.parentElement === zone && targetTok !== dragged) zone.insertBefore(dragged, targetTok);
          else zone.appendChild(dragged);
        }
      });
    });

    return {
      getBuilt(){
        return $$('.token', zone).map(t => t.textContent.trim()).join(' ')
          .replace(/\s+/g, ' ')
          .trim()
          .replace(/\s+([,?.!])/g, '$1');
      },
      clear(){
        $$('.token', zone).forEach(tok => {
          const source = idMap.get(tok.dataset.sourceTid);
          tok.remove();
          if(source){ source.classList.remove('is-used'); source.draggable = true; }
        });
      }
    };
  }

  function renderBuildTaskSelect(){
    const sel = $('#buildTask');
    if(!sel) return;
    const tasks = ALL_TASKS.filter(t => t.sid === currentScenario().key);
    sel.innerHTML = '';
    tasks.forEach((task, index) => {
      const opt = document.createElement('option');
      opt.value = task.key;
      opt.textContent = `${index + 1}) ${task.title}`;
      sel.appendChild(opt);
    });
    sel.value = tasks[0]?.key || '';
    initBuilder();
  }

  function selectedTask(){
    const key = $('#buildTask')?.value || '';
    return ALL_TASKS.find(t => t.sid === currentScenario().key && t.key === key) || null;
  }

  function initBuilder(){
    const host = $('#builderHost');
    const fb = $('#buildFb');
    if(fb) fb.classList.add('hidden');
    const task = selectedTask();
    if(!task){
      if(host) host.innerHTML = '<p class="tiny-note">No task for this scenario.</p>';
      state.builderApi = null;
      return;
    }
    state.builderApi = buildWordOrder(host, task);
  }

  function checkBuilder(){
    const task = selectedTask();
    const fb = $('#buildFb');
    if(!task || !state.builderApi || !fb) return;
    const built = state.builderApi.getBuilt();
    const ok = normalize(built) === normalize(task.target);
    fb.classList.remove('hidden','ok','no');
    fb.classList.add(ok ? 'ok' : 'no');
    fb.innerHTML = ok
      ? `✅ Correct! Say it now: <strong>${escapeHtml(task.target)}</strong>`
      : `❌ Not yet. You wrote: “${escapeHtml(built || '—')}”<br>💡 Try again and check the word order.`;
    if(ok) Score.award(`build:${task.sid}:${task.key}`, 2);
  }

  function resetAll(){
    Speech.stop();
    stopTimers();
    Score.reset();
    setVoice('en-GB');
    state.scenario = SCENARIOS[0];
    renderScenarioSelect();
    renderScenario();
    renderDrillSetSelect();
    buildDrill();
    $('#scenarioSelect').value = SCENARIOS[0].key;
    $('#drillSet').value = SCENARIOS[0].key;
    $('#top')?.scrollIntoView({ behavior: 'smooth' });
  }

  function init(){
    if(JS_STATUS) JS_STATUS.textContent = 'JS: ✅ loaded';
    setVoice('en-GB');

    renderScenarioSelect();
    renderScenario();
    renderDrillSetSelect();
    buildDrill();

    safeOn('#voiceUK', 'click', () => setVoice('en-GB'));
    safeOn('#voiceUS', 'click', () => setVoice('en-US'));
    safeOn('#btnPause', 'click', () => Speech.pause());
    safeOn('#btnResume', 'click', () => Speech.resume());
    safeOn('#btnStop', 'click', () => Speech.stop());
    safeOn('#btnResetAll', 'click', resetAll);
    safeOn('#btnStart', 'click', () => $('#sec1')?.scrollIntoView({ behavior: 'smooth' }));
    safeOn('#btnHow', 'click', () => {
      alert('How to use:\n\n1) Choose a scenario.\n2) Read the guide.\n3) Do the role-play.\n4) Choose the best answers in the quick drills.\n5) Build the sentence and say it aloud.\n\nKeep your English simple and clear.');
    });

    safeOn('#scenarioSelect', 'change', (e) => {
      const key = e.target.value;
      state.scenario = SCENARIOS.find(s => s.key === key) || SCENARIOS[0];
      renderScenario();
      $('#drillSet').value = state.scenario.key;
      buildDrill();
    });
    safeOn('#btnScenarioSpeak', 'click', () => Speech.say(currentScenario().goal));
    safeOn('#btnScenarioReset', 'click', () => renderScenario());
    safeOn('#btnGuideSpeak', 'click', () => {
      const text = (currentScenario().guide || []).map(g => `${g.q} ${g.a}`).join(' ');
      Speech.say(text);
    });

    safeOn('#roleTeacher', 'click', () => {
      state.role = 'teacher';
      $('#roleTeacher').classList.add('is-on');
      $('#roleLearner').classList.remove('is-on');
      $('#roleTeacher').setAttribute('aria-pressed','true');
      $('#roleLearner').setAttribute('aria-pressed','false');
    });
    safeOn('#roleLearner', 'click', () => {
      state.role = 'learner';
      $('#roleLearner').classList.add('is-on');
      $('#roleTeacher').classList.remove('is-on');
      $('#roleLearner').setAttribute('aria-pressed','true');
      $('#roleTeacher').setAttribute('aria-pressed','false');
    });

    safeOn('#btnRPStart', 'click', playRoleplay);
    safeOn('#btnRPStep', 'click', stepRoleplay);
    safeOn('#btnRPClear', 'click', clearRoleplay);
    safeOn('#btnRPModel', 'click', showModelReply);
    safeOn('#btnRPHint', 'click', showRoleplayHints);
    safeOn('#btnRPListenAll', 'click', listenAllRoleplay);
    safeOn('#btnPrep', 'click', () => startPrepTimer(15));
    safeOn('#btnSpeakTimer', 'click', () => startSpeakTimer(30));

    safeOn('#drillSet', 'change', buildDrill);
    safeOn('#btnNewDrill', 'click', buildDrill);
    safeOn('#btnDrillReset', 'click', buildDrill);
    safeOn('#btnDrillSpeak', 'click', () => {
      if(state.currentDrill) Speech.say(state.currentDrill.say);
    });

    safeOn('#buildTask', 'change', initBuilder);
    safeOn('#btnBuildReset', 'click', () => {
      if(state.builderApi) state.builderApi.clear();
      $('#buildFb').classList.add('hidden');
    });
    safeOn('#btnBuildCheck', 'click', checkBuilder);
    safeOn('#btnBuildSpeakModel', 'click', () => {
      const task = selectedTask();
      if(task) Speech.say(task.target);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
