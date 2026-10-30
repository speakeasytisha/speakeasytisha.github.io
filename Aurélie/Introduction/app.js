const goalFR = [
  'Développer la capacité à tenir une conversation en anglais, aussi bien dans la vie quotidienne que dans un contexte professionnel.',
  'Communiquer plus facilement avec ses collègues anglophones, échanger des informations et répondre à des questions simples.',
  'Améliorer la compréhension orale pour suivre des conversations professionnelles, notamment lors de réunions, visioconférences et débriefings.',
  'Acquérir le vocabulaire nécessaire pour communiquer sur les activités de gestion de flotte automobile, les véhicules, les logiciels et l’organisation du travail.',
  'Renforcer la confiance et l’autonomie dans les échanges oraux spontanés.'
];
const goals = [
  'Develop speaking confidence for everyday and professional conversations.',
  'Communicate more easily with English-speaking colleagues, share information and answer simple questions.',
  'Feel more comfortable following meetings, video calls and debriefings in English.',
  'Build useful vocabulary for vehicle fleet management, vehicles, software and work organisation.',
  'Gain confidence and autonomy in more spontaneous spoken exchanges.'
];

const learningPrefs = [
  'Listening to models / Écouter des modèles',
  'Repeating aloud / Répéter à voix haute',
  'Reading with examples / Lire avec des exemples',
  'Writing and corrections / Écrire et corriger',
  'Interactive exercises / Exercices interactifs',
  'Role-play and scenarios / Jeux de rôle',
  'Visual diagrams / Schémas visuels',
  'Authentic work documents / Documents professionnels authentiques',
  'Short guided conversations / Dialogues guidés'
];

const evalMethods = [
  'QCM',
  'Texte à trous',
  'Questions / réponses',
  'Jeu de rôle / mise en situation',
  'Présentation orale',
  'Compréhension orale',
  'Compréhension écrite',
  'Expression écrite',
  'Observation / échange oral'
];

const phraseSets = {
  audio: [
    ['Can you hear me?', 'Vous m’entendez ?'],
    ['I can hear you clearly.', 'Je vous entends clairement.'],
    ['I can’t hear you very well.', 'Je vous entends mal.'],
    ['Could you repeat that, please?', 'Pouvez-vous répéter, s’il vous plaît ?']
  ],
  video: [
    ['Your image is frozen.', 'Votre image est figée.'],
    ['My connection is unstable.', 'Ma connexion est instable.'],
    ['The video is a little slow.', 'La vidéo est un peu lente.'],
    ['I’ll leave and rejoin the meeting.', 'Je vais quitter et revenir dans la réunion.']
  ],
  chat: [
    ['Could you write it in the chat?', 'Pouvez-vous l’écrire dans le chat ?'],
    ['Could you type the link, please?', 'Pouvez-vous taper le lien, s’il vous plaît ?'],
    ['Could you speak more slowly?', 'Pouvez-vous parler plus lentement ?'],
    ['I need a little help with the instructions.', 'J’ai besoin d’un peu d’aide avec les consignes.']
  ],
  actions: [
    ['I’m checking my settings.', 'Je vérifie mes paramètres.'],
    ['I’m changing the microphone.', 'Je change de microphone.'],
    ['I’m refreshing the page.', 'Je rafraîchis la page.'],
    ['Can you share your screen?', 'Pouvez-vous partager votre écran ?']
  ]
};

const quiz = [
  {
    question: 'Before an online lesson starts, what is a good habit?',
    options: ['Check your audio and video settings.', 'Change the lesson title.', 'Close all communication tools.'],
    answer: 0,
    hint: 'Think about the tools you use to hear and speak.',
    explain: 'Checking audio and video settings helps the lesson start smoothly.'
  },
  {
    question: 'Which phrase politely asks for repetition?',
    options: ['Say again now.', 'Could you repeat that, please?', 'Repeat me.'],
    answer: 1,
    hint: 'Look for the polite structure with “Could you...?”',
    explain: '“Could you repeat that, please?” is a natural and polite way to ask again.'
  },
  {
    question: 'Your screen image stops moving. What can you say?',
    options: ['Your image is frozen.', 'Your image is sleeping.', 'Your image is broken.'],
    answer: 0,
    hint: 'Use the word people say for a video that stops moving.',
    explain: '“Frozen” is the usual word when video stops moving.'
  },
  {
    question: 'If speaking is difficult for a moment, what is a useful alternative?',
    options: ['End the meeting without explanation.', 'Use the chat to explain the issue.', 'Turn off the internet immediately.'],
    answer: 1,
    hint: 'Think of another communication channel inside Meet.',
    explain: 'The chat is very useful when audio or speaking is temporarily difficult.'
  }
];

const storageKey = 'aurelie_l1';
const $ = id => document.getElementById(id);

function getSavableElements() {
  return Array.from(document.querySelectorAll('[data-save]'));
}

function state() {
  const out = {};
  getSavableElements().forEach((el, i) => {
    const key = el.id || `anon${i}`;
    out[key] = el.type === 'checkbox' ? el.checked : el.value;
  });
  return out;
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state()));
  updatePlan();
  updateProgress();
  if ($('phraseCategory')) renderPhraseBank($('phraseCategory').value);
}

function load() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch {}
  getSavableElements().forEach((el, i) => {
    const key = el.id || `anon${i}`;
    if (saved[key] !== undefined) {
      if (el.type === 'checkbox') el.checked = saved[key];
      else el.value = saved[key];
    }
  });
}

function renderGoals() {
  $('objectives').innerHTML = goals.map((goal, i) => `
    <article class="objective-card">
      <div class="objective-top">
        <div class="objective-badge">${i + 1}</div>
        <div>
          <p><strong>${goal}</strong></p><p class="goal-fr">🇫🇷 ${goalFR[i]}</p>
        </div>
      </div>
      <div class="grid two-col">
        <label>Priority / validation
          <select data-save id="goal${i}">
            <option>À confirmer ensemble</option>
            <option>Confirmé · priorité</option>
            <option>Confirmé · secondaire</option>
            <option>À adapter</option>
            <option>Non retenu</option>
          </select>
        </label>
        <label>Trainer note (optional)
          <input data-save id="goalNote${i}" type="text" placeholder="Context, examples or comments...">
        </label>
      </div>
    </article>
  `).join('');
}

function renderLearningPrefs() {
  $('learning').innerHTML = learningPrefs.map((item, i) => `
    <label class="learn-card"><input type="checkbox" data-save id="learn${i}"> <span>${item}</span></label>
  `).join('');
}

function renderMethods() {
  $('methods').innerHTML = evalMethods.map((item, i) => `
    <label class="method-card"><input type="checkbox" data-save id="method${i}"> <span>${item}</span></label>
  `).join('');
}

function renderTrainerAcquisition() {
  $('trainerAcquisition').innerHTML = goals.map((goal, i) => `
    <label>${i + 1}. ${goal}
      <select data-save id="acq${i}">
        <option>Non évalué</option>
        <option>En cours d'acquisition</option>
        <option>Acquis</option>
        <option>Non Acquis</option>
      </select>
    </label>
  `).join('');
}

function renderPhraseBank(category) {
  const set = phraseSets[category] || phraseSets.audio;
  const host = $('phraseBank');
  host.replaceChildren();
  set.forEach(([en, fr]) => {
    const card = document.createElement('div');
    card.className = 'phrase-card';
    const english = document.createElement('strong');
    english.textContent = en;
    const translation = document.createElement('div');
    translation.className = 'fr';
    translation.textContent = fr;
    const actions = document.createElement('div');
    actions.className = 'phrase-actions no-print';
    const listen = document.createElement('button');
    listen.type = 'button';
    listen.textContent = '▶ Listen';
    listen.setAttribute('aria-label', 'Listen to: ' + en);
    const feedback = document.createElement('span');
    feedback.className = 'phrase-audio-status';
    feedback.setAttribute('role', 'status');
    listen.addEventListener('click', () => {
      // Direct user interaction is needed by browser speech synthesis.
      try {
        speak(en);
        feedback.textContent = 'Audio requested';
      } catch (error) {
        feedback.textContent = 'Unable to start playback: ' + error.message;
      }
    });
    actions.append(listen, feedback);
    card.append(english, translation, actions);
    host.appendChild(card);
  });
}

function renderQuiz() {
  $('quiz').innerHTML = quiz.map((q, i) => `
    <div class="quiz-item">
      <p><strong>${i + 1}. ${q.question}</strong></p>
      <div class="options">
        ${q.options.map((opt, j) => `<label><input type="radio" name="q${i}" value="${j}" onchange="checkQuiz(${i})"> ${opt}</label>`).join('')}
      </div>
      <div class="button-row no-print">
        <button type="button" onclick="hintQuiz(${i})">Hint</button>
      </div>
      <p class="feedback" id="fb${i}" aria-live="polite"></p>
    </div>
  `).join('');
}

function checkQuiz(i) {
  const selected = document.querySelector(`input[name="q${i}"]:checked`);
  const fb = $('fb' + i);
  if (!selected) {
    fb.textContent = 'Choose an answer first.';
    fb.className = 'feedback bad';
    return;
  }
  const good = Number(selected.value) === quiz[i].answer;
  fb.textContent = good ? `✓ Correct! ${quiz[i].explain}` : `Good try. ${quiz[i].explain}`;
  fb.className = `feedback ${good ? 'ok' : 'bad'}`;
}

function hintQuiz(i) {
  const fb = $('fb' + i);
  fb.textContent = quiz[i].hint;
  fb.className = 'feedback';
}

function updatePlan() {
  const duration = Number($('duration')?.value) || 1;
  const actual = Number($('actualDuration')?.value) || 0;
  const sessionCount = Math.ceil(19 / duration);
  const remaining = Math.max(0, 19 - actual);
  $('scheduleHint').innerHTML = `
    <h3>Planning snapshot</h3>
    <p>With lessons of about <strong>${duration}</strong> hour(s), the programme may involve around <strong>${sessionCount}</strong> session(s) in total, with adjustments if needed.</p>
    <p>After this first lesson, there are approximately <strong>${remaining.toFixed(2)}</strong> hour(s) remaining.</p>
    <p><strong>Reminder:</strong> all sessions must be completed by <strong>31/05/2027</strong>.</p>
  `;
}

function countChecked(ids) {
  return ids.reduce((total, id) => total + ($(`${id}`)?.checked ? 1 : 0), 0);
}

function updateProgress() {
  const milestones = ['introDone', 'introBuilt', 'goalsDone', 'datesDone', 'signDone', 'preferencesDone', 'funDone'];
  const checked = countChecked(milestones);
  const percent = Math.round((checked / milestones.length) * 100);
  if ($('progressBar')) $('progressBar').style.width = `${percent}%`;
  if ($('progressText')) $('progressText').textContent = `${percent}%`;
}

function speak(text) {
 const status=$('voiceStatus');
 if (!('speechSynthesis' in window)) {if(status)status.textContent='No built-in speech playback is available in this browser. Try Chrome or Edge.';return}
 window.speechSynthesis.cancel();
 const lang=$('accent')?.value||'en-GB', voices=window.speechSynthesis.getVoices();
 const voice=voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith('en'));
 const u=new SpeechSynthesisUtterance(String(text));u.lang=voice?.lang||lang;u.rate=.86;u.volume=1;
 if(voice)u.voice=voice;
 u.onerror=ev=>{if(status)status.textContent=`Audio could not play (${ev.error||'browser error'}). Check the system volume, install an English voice, and test in Chrome/Edge.`};
 u.onstart=()=>{if(status)status.textContent=voice?`Playing: ${voice.name} (${voice.lang})`:'Playing the browser default voice. If you hear nothing, install an English voice below.'};
 window.speechSynthesis.speak(u);
}
function renderVoiceGuide(){
 const mac=$('voicePlatform')?.value==='mac';
 $('voiceGuideDetail').innerHTML=mac?`<ol class="setup-steps"><li>Open <b>System Settings</b> on your Mac.</li><li>Choose <b>Accessibility</b>, then <b>Spoken Content</b> or <b>Read & Speak</b> (depends on macOS version).</li><li>Under <b>System Voice</b>, select <b>Manage Voices</b> and download an English UK or US voice.</li><li>Restart your browser and click <b>▶ Listen to a sample phrase</b>.</li></ol>`:`<ol class="setup-steps"><li>Open <b>Settings</b> on your Windows computer.</li><li>Choose <b>Time & language → Language & region</b>.</li><li>Select <b>Add a language</b> and choose English (United Kingdom) or English (United States); install available speech features.</li><li>If needed, check <b>Accessibility → Narrator</b> for additional voices.</li><li>Restart Chrome or Edge, then click <b>▶ Listen to a sample phrase</b>.</li></ol>`;
}
function samplePhrase() {
  const category = $('phraseCategory')?.value || 'audio';
  const set = phraseSets[category] || phraseSets.audio;
  return set[0][0];
}

function selectedLearningPrefs() {
  return learningPrefs.filter((_, i) => $(`learn${i}`)?.checked);
}

function selectedMethods() {
  return evalMethods.filter((_, i) => $(`method${i}`)?.checked);
}

function reportText() {
  const actual = Number($('actualDuration')?.value) || 0;
  const remaining = Math.max(0, 19 - actual).toFixed(2);
  return `CFL WELCOME — AURÉLIE — LESSON 1\n`
    + `Session: ${$('session').value} | Date: ${$('lessonDate').value} | Hours delivered: ${actual} | Hours remaining: ${remaining}\n`
    + `Contract: 13/10/2026 → 31/05/2027 | First lesson: 30/10/2026 16:00 | Certification: VTEST (to be introduced later)\n`
    + `Lesson URL: ${$('lessonURL').value}\n\n`
    + `BACKGROUND: ${[field('personRole'),field('personCompany'),field('personCity'),field('personTask')].filter(Boolean).join('; ')}\n`
    + `ENGLISH SITUATIONS: ${field('personUse')}\n`
    + `SUCCESS CRITERIA: ${field('personAim')}\n\n`
    + `OBJECTIVES CONFIRMED:\n`
    + goals.map((goal, i) => `${i + 1}. ${goal} — ${$('goal' + i).value} — ${$('acq' + i).value} — Note: ${$('goalNote' + i).value}`).join('\n')
    + `\nOther goals: ${$('extraGoals').value}\n\n`
    + `PLANNING: ${$('rhythm').value} | ${$('times').value} | ${$('duration').value}h / lesson\n`
    + `Planned dates:\n${$('dates').value}\n`
    + `Schedule explained: ${$('datesDone').checked ? 'yes' : 'not confirmed'} | Digiforma explained: ${$('signDone').checked ? 'yes' : 'not confirmed'}\n\n`
    + `LEARNING PREFERENCES: ${selectedLearningPrefs().join('; ')}\n`
    + `Homework: ${$('homework').value} | Progress checks: ${$('assessment').value} | Review cadence: ${$('reviewFrequency').value} | Review format: ${$('reviewFormat').value}\n`
    + `Speaking comfort: ${$('comfort').value}\n\n`
    + `OBJECTIFS DE LA SÉANCE: ${$('sessionObjectives').value}\n`
    + `CONTENU ET ACTIVITÉS RÉALISÉES: ${$('content').value}\n`
    + `COMPÉTENCES ÉVALUÉES: ${$('skills').value}\n`
    + `MODALITÉS D’ÉVALUATION: ${selectedMethods().join('; ')}\n`
    + `NIVEAU D’ACQUISITION: ${$('level').value}\n`
    + `OBSERVATIONS: ${$('notes').value}\n`
    + `PROCHAINES ÉTAPES: ${$('next').value}\n\n`
    + `PERSONAL INTRODUCTION: ${introText()}\n\n` + `Completion checkpoints: introduction ${$('introDone').checked ? '✓' : '—'} | goals ${$('goalsDone').checked ? '✓' : '—'} | planning ${$('datesDone').checked ? '✓' : '—'} | preferences ${$('preferencesDone').checked ? '✓' : '—'}`;
}

function makeReport() {
  $('report').textContent = reportText();
}

async function copyReport() {
  makeReport();
  try {
    await navigator.clipboard.writeText($('report').textContent);
    alert('Report copied.');
  } catch {
    alert('Please copy the report manually.');
  }
}

function download(name, body, type) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(new Blob([body], { type }));
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportTSV() {
  const actual = Number($('actualDuration')?.value) || 0;
  const remaining = Math.max(0, 19 - actual);
  const cols = [
    'N° de session',
    'Durée du cours (heures décimales)',
    'Heures restantes',
    'Date',
    'Objectifs de la séance',
    'Contenu et activités réalisées',
    'Compétence(s) évaluée(s)',
    'Modalité(s) d’évaluation',
    'Niveau d’acquisition',
    'Observations / points à signaler',
    'Lien de la leçon',
    'Prochaines étapes'
  ];
  const row = [
    $('session').value,
    $('actualDuration').value,
    remaining,
    $('lessonDate').value,
    $('sessionObjectives').value,
    $('content').value,
    $('skills').value,
    selectedMethods().join('; '),
    $('level').value,
    $('notes').value,
    $('lessonURL').value,
    $('next').value
  ];
  const tsv = [cols, row].map(r => r.map(x => String(x).replaceAll('\t', ' ').replaceAll('\n', ' / ')).join('\t')).join('\n');
  download('Aurelie_CFL_Lesson_1.tsv', tsv, 'text/tab-separated-values;charset=utf-8');
}

function exportJSON() {
  download('Aurelie_Lesson_1_answers.json', JSON.stringify({
    savedAt: new Date().toISOString(),
    responses: state(),
    report: reportText()
  }, null, 2), 'application/json');
}

function resetAll() {
  if (confirm('Delete saved answers for this page?')) {
    localStorage.removeItem(storageKey);
    location.reload();
  }
}

function bind() {
  getSavableElements().forEach(el => {
    el.addEventListener('input', persist);
    el.addEventListener('change', persist);
  });
  $('phraseCategory')?.addEventListener('change', () => {
    renderPhraseBank($('phraseCategory').value);
    persist();
  });
}

function initSpeechVoices() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      if ($('voiceStatus')) $('voiceStatus').textContent = 'English voices loaded. You can test a sample phrase.';
    };
  }
}

function init() {
  renderGoals();
  renderLearningPrefs();
  renderMethods();
  renderTrainerAcquisition();
  renderQuiz();
  renderVoiceGuide();
  load();
  renderPhraseBank($('phraseCategory')?.value || 'audio');
  bind();
  updatePlan();
  updateProgress();
  initSpeechVoices();
  renderSituation(); renderFlashcards(); resetMatching(); resetOrder(); renderCulture();
  if (introText()) displayIntro();
}


// --- Personal three-level introduction, built only from confirmed choices ---
const introLevels = {};
const cleaned = x => String(x || '').trim().replace(/[.!?]+$/,'');
const field = id => cleaned($(id)?.value);
const chooseOther = (id, other) => field(id)==='other' ? field(other) : field(id);
const cap = x => x ? x[0].toUpperCase()+x.slice(1) : x;
function partsIntro(){
 const name=field('personName')||'Aurélie', city=field('personCity'), from=field('personOrigin'), company=field('personCompany');
 const role=chooseOther('personRole','personRoleOther'),task=chooseOther('personTask','personTaskOther'),need=chooseOther('personUse','personUseOther'), hobby=chooseOther('personHobby','personHobbyOther'),aim=field('personAim');
 return {name,city,from,company,role,task,need,hobby,aim};
}
function makeLevels(){
 const p=partsIntro(), team=chooseOther('personTeam','personTeamOther'),likes=chooseOther('personWorkLike','personWorkLikeOther'),motivation=chooseOther('personMotivation','personMotivationOther');
 const mainJob=p.role?`I work as a ${p.role}`:'I work in fleet management';
 const place=p.city?`I live in ${p.city}.`:'';
 const where=p.company?`I work at ${p.company}.`:'';
 const tasks=p.task?`In my job, I ${p.task}.`:'I help organise information and work with different people.';
 const english=p.need?`I use English for ${p.need}.`:'I would like to use English more naturally in everyday conversations.';
 const personal=p.hobby?`In my free time, I enjoy ${p.hobby}.`:'Outside work, I enjoy spending time on activities I like.';
 const goal=p.aim?`My goal is to ${p.aim}.`:'My goal is to make steady progress in English.';
 introLevels[1]=[`Hello, my name is ${p.name}.`,place,`${mainJob}.`,where,tasks,english,personal,goal,'I am happy to begin this English course.','Nice to meet you!'].filter(Boolean).join(' ');
 introLevels[2]=[`Hello, my name is ${p.name}, and it is a pleasure to meet you.`,p.from?`I am originally from ${p.from}.`:'',place,`${mainJob}${p.company?' at '+p.company:''}.`,tasks,team?`My team works with ${team}.`:'',likes?`One thing I appreciate about my work is ${likes}.`:'',english,personal,goal,'During this programme, I hope to practise regularly, learn useful expressions, and communicate more easily with other people.','I am looking forward to our lessons.'].filter(Boolean).join(' ');
 introLevels[3]=[`Good morning, my name is ${p.name}. I am pleased to introduce myself.`,p.from?`I am originally from ${p.from}.`:'',place,`Professionally, ${mainJob}${p.company?' at '+p.company:''}.`,tasks,team?`My team is involved in ${team}, which means communication and organisation are important parts of our daily work.`:'My work involves organisation, practical tasks and communicating with others.',likes?`What I especially appreciate is ${likes}.`:'',english,`I see English as a useful way to build connections, share information and participate more actively in international conversations.`,personal,motivation?`On a personal level, I also want to ${motivation}.`:'',goal,'I hope this training programme will help me communicate with greater ease and make English a natural part of my everyday life.','Thank you for listening. I am delighted to begin this learning journey.'].filter(Boolean).join(' ');
}
function buildIntro(){makeLevels();displayIntro();$('introBuilt').checked=true;persist()}
function displayIntro(){if(!introLevels[1])makeLevels();const txt=introLevels[Number(field('introLevel'))||1]||introLevels[1]; $('introResult').textContent=txt; $('introEditable').value=txt;persistIntroSilently()}
function persistIntroSilently(){localStorage.setItem(storageKey,JSON.stringify(state()))}
function introText(){return $('introEditable')?.value.trim()||''}
function speakIntro(){const s=introText(); if(s)speak(s)}
async function copyIntro(){const s=introText();if(!s)return;try{await navigator.clipboard.writeText(s);alert('Introduction copied.')}catch{const el=$('introEditable');el.select();document.execCommand('copy')}}

// --- Situation-specific support: notice -> say -> do -> confirm ---
const situations={
 audio:{title:'The sound is unclear',phrase:'I cannot hear you very well. Could you repeat that, please?',steps:['Check the volume and speaker/headphones.','Open Google Meet Settings → Audio and select the right speaker.','Ask the other person to repeat or write in chat.','Confirm: “That’s much better, thank you!”']},
 video:{title:'The image is frozen',phrase:'Your image is frozen. I will refresh the page.',steps:['Check whether the internet connection is working.','Pause video temporarily if the connection is slow.','Refresh the page or leave and rejoin the meeting.','Confirm: “I can see you again!”']},
 chat:{title:'I need clarification',phrase:'Could you write that in the chat, please?',steps:['Open the Meet chat icon.','Write your question or ask for a link.','Read the message and clarify any unfamiliar word.','Confirm: “Thank you, I understand now.”']},
 screen:{title:'We need to share a screen',phrase:'Could you share your screen, please?',steps:['Find “Present now” or “Share screen” in Meet.','Choose the tab, window or screen to share.','Check that the other person can see it.','Stop sharing when finished.']},
 connection:{title:'The connection is unstable',phrase:'My connection is a little unstable. I will rejoin.',steps:['Check your Wi-Fi or network connection.','Close unnecessary tabs and applications.','If helpful, turn video off temporarily.','Rejoin the call and say: “I am back!”']}
};
function renderSituation(){let s=situations[field('troubleSituation')]||situations.audio;$('situationSteps').innerHTML=`<strong>${s.title}</strong><p class="scenario-phrase">“${s.phrase}”</p><ol>${s.steps.map(x=>`<li>${x}</li>`).join('')}</ol><button type="button" onclick="speak(situations[field('troubleSituation')].phrase)">▶ Listen to the phrase</button>`}

// --- Flashcards and fresh matching rounds ---
const vocab=[['microphone','microphone'],['camera','caméra'],['chat','messagerie instantanée'],['screen share','partage d’écran'],['connection','connexion'],['speaker','haut-parleur'],['settings','paramètres'],['rejoin','revenir dans la réunion']];
function renderFlashcards(){
 $('flashcards').innerHTML=vocab.map(([en,fr],i)=>`<article class="flash-card" id="flash${i}">
   <div class="flash-term"><span class="flash-word">${en}</span><span class="flash-translation" id="flashTranslation${i}" hidden>${fr}</span></div>
   <div class="flash-actions"><button type="button" class="flash-reveal" onclick="flipVocabulary(${i})" aria-expanded="false">Reveal French</button>
   <button type="button" class="flash-listen" onclick="listenVocabulary(${i})" aria-label="Listen to ${en}">▶ Listen</button></div>
 </article>`).join('');
}
function flipVocabulary(i){
 const el=$('flashTranslation'+i),card=$('flash'+i),btn=card.querySelector('.flash-reveal');
 el.hidden=!el.hidden;btn.textContent=el.hidden?'Reveal French':'Hide French';btn.setAttribute('aria-expanded',String(!el.hidden));
 const status=$('flashStatus');if(status)status.textContent=el.hidden?'Translation hidden. Use Listen whenever you wish.':'French translation revealed. Audio remains optional.';
}
function listenVocabulary(i){
 const pair=vocab[i]; if(!pair)return;
 const status=$('flashStatus');
 if(!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)){
   if(status)status.textContent='Audio unavailable in this browser. Try Chrome or Edge.';
   return;
 }
 const lang=$('accent')?.value||'en-GB';
 const voices=window.speechSynthesis.getVoices();
 const preferred=voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith('en'));
 window.speechSynthesis.cancel();
 const utterance=new SpeechSynthesisUtterance(pair[0]);
 utterance.lang=preferred?.lang||lang;
 if(preferred)utterance.voice=preferred;
 utterance.rate=.88;
 utterance.volume=1;
 if(status)status.textContent='Starting playback: '+pair[0]+'…';
 utterance.onstart=()=>{if(status)status.textContent='▶ Playing “'+pair[0]+'”'+(preferred?' using '+preferred.name:'')+'.'};
 utterance.onend=()=>{if(status)status.textContent='Finished listening to “'+pair[0]+'”.'};
 utterance.onerror=e=>{if(status)status.textContent='Unable to play “'+pair[0]+'” ('+(e.error||'voice error')+'). Try Chrome or Edge, check your sound output, or install an English voice using the guide below.'};
 try{window.speechSynthesis.resume();window.speechSynthesis.speak(utterance)}
 catch(e){if(status)status.textContent='Playback could not start: '+e.message;}
}

let matchPairs=[],picked=null,solved=new Set();
function shuffle(a){let b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function resetMatching(){matchPairs=shuffle(phraseSets.audio.concat(phraseSets.video,phraseSets.chat,phraseSets.actions)).slice(0,5);picked=null;solved.clear();const left=shuffle(matchPairs.map((p,i)=>({i,t:p[0]}))),right=shuffle(matchPairs.map((p,i)=>({i,t:p[1]})));$('matchingGame').innerHTML=`<div><strong>English</strong>${left.map(o=>`<button type="button" class="match-tile" data-match="${o.i}" data-side="en">${o.t}</button>`).join('')}</div><div><strong>Français</strong>${right.map(o=>`<button type="button" class="match-tile" data-match="${o.i}" data-side="fr">${o.t}</button>`).join('')}</div>`;$('matchFeedback').textContent='Choose an English phrase, then its French meaning.';document.querySelectorAll('.match-tile').forEach(b=>b.addEventListener('click',()=>matchClick(b)))}
function matchClick(b){if(b.disabled)return;if(b.dataset.side==='en'){document.querySelectorAll('.match-tile.picked').forEach(x=>x.classList.remove('picked'));picked=b;b.classList.add('picked');return}if(!picked){$('matchFeedback').textContent='Choose an English phrase first.';return}if(picked.dataset.match===b.dataset.match){b.classList.add('matched');picked.classList.add('matched');b.disabled=true;picked.disabled=true;solved.add(b.dataset.match);$('matchFeedback').textContent=solved.size===matchPairs.length?'Wonderful! All five pairs are matched.':`✓ Correct! ${solved.size}/${matchPairs.length} pairs.`;picked=null}else{$('matchFeedback').textContent='Not quite — try another translation. 💡 Hint is available.';b.classList.add('wrong');setTimeout(()=>b.classList.remove('wrong'),650)}}
function matchingHint(){if(picked){$('matchFeedback').textContent=`💡 Find: ${matchPairs[Number(picked.dataset.match)][1]}`}else{$('matchFeedback').textContent='💡 Select an English expression on the left first.'}}

const orders=[['Could','you','repeat','that,','please?'],['I','will','rejoin','the','meeting.'],['Can','you','share','your','screen?'],['My','connection','is','unstable.']];
let orderCurrent=0,orderPool=[],orderChosen=[];
function resetOrder(){orderCurrent=(orderCurrent+1)%orders.length;orderPool=shuffle(orders[orderCurrent].map((txt,i)=>({txt,i})));orderChosen=[];renderOrder();$('orderFeedback').textContent='';$('orderListen').disabled=true}
function renderOrder(){
 $('wordOrder').innerHTML=`<div class="order-pool">${orderPool.map(o=>`<button type="button" data-i="${o.i}" data-from="pool">${o.txt}</button>`).join('')}</div><div class="order-built">${orderChosen.length?orderChosen.map(o=>`<button type="button" data-i="${o.i}" data-from="chosen">${o.txt}</button>`).join(''):'Your sentence appears here...'}</div>`;
 document.querySelectorAll('#wordOrder button').forEach(btn=>btn.addEventListener('click',()=>{
  const from=btn.dataset.from,at=from==='pool'?orderPool:orderChosen,to=from==='pool'?orderChosen:orderPool;
  const idx=at.findIndex(x=>x.i===Number(btn.dataset.i));if(idx>=0){to.push(at.splice(idx,1)[0]);renderOrder();if(!orderPool.length)checkOrder();else{$('orderFeedback').textContent='Keep going — choose the next word.';$('orderListen').disabled=true}}
 }));
}
function checkOrder(){
 const result=orderChosen.map(x=>x.txt).join(' '),answer=orders[orderCurrent].join(' '),good=result===answer;
 $('orderFeedback').textContent=good?'✓ Correct! '+answer:'Not quite yet. You can tap any word to move it back and try a new order.';
 $('orderFeedback').className='feedback '+(good?'ok':'bad');$('orderListen').disabled=!good;
}
function listenCorrectOrder(){if(!$('orderListen').disabled)speak(orders[orderCurrent].join(' '))}
function orderHint(){$('orderFeedback').textContent=`💡 Start with “${orders[orderCurrent].slice(0,2).join(' ')}”.`}

// --- Relaxed intercultural ending ---
const cultures={
 uk:['Hello. How are you?','Good morning, everyone. Thank you for joining the meeting.','It is a pleasure to meet you. I look forward to working with you.'],
 us:['Hi, how are you?','Good morning, everyone. I appreciate your time today.','I am delighted to make your acquaintance and discuss our plans.'],
 ie:['Hello! Nice to meet you.','Good afternoon, everyone. Shall we begin?','Thank you for the opportunity to speak with you today.'],
 au:['Hello! How are you?','Good morning, everyone. Thank you for joining us.','It is a pleasure to welcome you and introduce our work.'],
 nz:['Hello! Welcome.','Good morning, everyone. Thank you for being here.','It is wonderful to meet you. I appreciate the opportunity to connect.']
};
function renderCulture(){let c=cultures[field('cultureCountry')]||cultures.uk;$('cultureOutput').innerHTML=`<div><strong>Everyday English · courant</strong><p>${c[0]}</p></div><div><strong>Professional English · professionnel</strong><p>${c[1]}</p></div><div><strong>Polished English · soutenu</strong><p>${c[2]}</p></div>`}
function speakCulture(){let c=cultures[field('cultureCountry')]||cultures.uk;speak(c.join(' '))}
function buildMiniStory(){
 const topic=field('funTopic'),act=field('funActivity'),reason=chooseOther('funReason','funReasonOther');
 let intro=topic==='travel'?'When I travel, I enjoy':topic==='hobbies'?'In my free time, I enjoy':'At the weekend, I like';
 const because=reason?`I like this activity because it helps me ${reason}.`:'';
 const txt=`${intro} ${act}. ${because} It is something I look forward to.`;
 $('miniStory').textContent=txt;return txt;
}
function speakMiniStory(){speak($('miniStory').textContent||buildMiniStory())}

init();
