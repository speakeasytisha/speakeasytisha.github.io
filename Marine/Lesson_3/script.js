'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const STORAGE_KEY = 'marineLesson2WorkingHolidayLilateV1';

const state = {
  answers: {},
  listeningAnswers: {},
  orderIndex: 0,
  orderChosen: [],
  orderCompleted: 0,
  travelBuilt: false,
  writingAnalysed: false,
  writingResult: null,
  speakingRecorded: false,
  manualAssessment: {},
  manualSections: {},
  savedAt: null
};

const automaticExerciseMeta = {
  pvt: { section:'01 · Working Holiday / PVT', type:'QCM', details:'7 multiple-choice questions on the visa, 88-day requirement and current-rule verification.' },
  sentences: { section:'02 · Sentence construction', type:'Drag-and-drop / word order', details:'6 sentences rebuilt in the correct order using the target sentence structure.' },
  grammar: { section:'03 · Grammar basics', type:'QCM', details:'12 multiple-choice questions on present, regular past, -ed pronunciation and future forms.' },
  vocab: { section:'05 · Vocabulary', type:'QCM', details:'10 multiple-choice questions on visa, agriculture, mining, safety and transferable skills.' },
  listening: { section:'06 · Australian listening', type:'Listening + QCM', details:'3 Australian workplace audio scenarios followed by 12 information-retrieval questions.' }
};

const manualExerciseMeta = {
  travel: { section:'04 · Past travel story', type:'Guided fill-in + oral production', details:'Build and present a structured past-travel story.' },
  lilate: { section:'07 · LILATE missions', type:'Role-play + note-taking + reformulation', details:'Complete four professional communication missions.' },
  writing: { section:'08 · Professional writing', type:'Written production · professional email', details:'Write an 80–110 word reply to an Australian employer.' },
  speaking: { section:'09 · Final speaking mission', type:'Recorded oral production · 90–120 seconds', details:'Explain the 2027 project in a structured spoken response.' }
};


const quizData = {
  pvt: [
    { q: 'What is the best English name for “PVT” in Australia?', options: ['Working Holiday visa', 'Work vacation permit', 'Tourist employment card'], answer: 'Working Holiday visa', hint: 'Use the official and natural expression: Working Holiday visa.' },
    { q: 'How long can the first Working Holiday stay normally last?', options: ['Up to 12 months', 'Exactly 88 days', 'Only six months'], answer: 'Up to 12 months', hint: 'The 88 days concern possible eligibility for a later visa, not the first stay.' },
    { q: 'What is normally required for a second subclass 417 visa?', options: ['Three months of eligible specified work', 'Any job for one month', 'A permanent employment contract'], answer: 'Three months of eligible specified work', hint: 'The work must satisfy official sector, location and evidence conditions.' },
    { q: 'Which sentence is accurate?', options: ['The 88 days are commonly used to describe the three-month specified-work requirement.', 'Every farm job automatically counts.', 'The first visa lasts 88 days.'], answer: 'The 88 days are commonly used to describe the three-month specified-work requirement.', hint: 'Eligibility depends on more than simply working on a farm.' },
    { q: 'Which sector can be eligible specified work in regional Australia?', options: ['Mining', 'Any office job in Sydney', 'Online banking from France'], answer: 'Mining', hint: 'Mining in eligible regional areas is one listed category.' },
    { q: 'What should you do before applying in 2027?', options: ['Check the current official rules again', 'Use only information remembered from 2026', 'Book travel before the visa is granted'], answer: 'Check the current official rules again', hint: 'Immigration rules, costs and eligible areas can change.' },
    { q: 'Which sentence describes your plan naturally?', options: ['I am planning to move to Australia on a Working Holiday visa.', 'I plan moving in Australia with work vacations.', 'I am go Australia for make 88 days.'], answer: 'I am planning to move to Australia on a Working Holiday visa.', hint: 'Use plan to + base verb, move to a country and on a visa.' }
  ],
  grammar: [
    { q: 'Choose the correct present sentence.', options: ['She works with contracts.', 'She work with contracts.', 'She working with contracts.'], answer: 'She works with contracts.', hint: 'He/she/it takes -s in the present simple.' },
    { q: 'Choose the correct question.', options: ['Does she handle insurance documents?', 'Does she handles insurance documents?', 'Do she handle insurance documents?'], answer: 'Does she handle insurance documents?', hint: 'After does, use the base verb.' },
    { q: 'Choose the correct negative.', options: ['I do not work in mining yet.', 'I not work in mining yet.', 'I do not works in mining yet.'], answer: 'I do not work in mining yet.', hint: 'Use do not + base verb.' },
    { q: 'Complete: Last year, I ___ Mexico.', options: ['visited', 'visit', 'visiting'], answer: 'visited', hint: 'A finished past action needs the past simple.' },
    { q: 'Choose the correct past question.', options: ['Did you enjoy Thailand?', 'Did you enjoyed Thailand?', 'Do you enjoyed Thailand?'], answer: 'Did you enjoy Thailand?', hint: 'After did, use the base verb.' },
    { q: 'Choose the correct past negative.', options: ['We did not rent a car.', 'We did not rented a car.', 'We not rented a car.'], answer: 'We did not rent a car.', hint: 'After did not, use the base verb.' },
    { q: 'Which -ed ending adds an extra syllable?', options: ['visited', 'worked', 'travelled'], answer: 'visited', hint: 'A verb ending in a /t/ or /d/ sound uses /ɪd/.' },
    { q: 'Choose the decided future plan.', options: ['I am going to move in 2027.', 'I moved in 2027.', 'I moving in 2027.'], answer: 'I am going to move in 2027.', hint: 'Be going to expresses a decided future plan.' },
    { q: 'Choose the possibility.', options: ['I may work in agriculture.', 'I must worked in agriculture.', 'I may to work in agriculture.'], answer: 'I may work in agriculture.', hint: 'After may, use the base verb without to.' },
    { q: 'Choose the wish.', options: ['I would like to improve my English.', 'I would like improve my English.', 'I like to improved my English.'], answer: 'I would like to improve my English.', hint: 'Would like is followed by to + base verb.' },
    { q: 'Complete the real future condition: If Australia works out, I ___ longer.', options: ['will stay', 'would stayed', 'stay will'], answer: 'will stay', hint: 'If + present, will + base verb.' },
    { q: 'Choose the most natural sentence.', options: ['If it does not work out, I may go to Belize.', 'If it will not work, I may going Belize.', 'If no Australia, I go Belize maybe.'], answer: 'If it does not work out, I may go to Belize.', hint: 'Use present simple after if and may + base verb.' }
  ],
  vocab: [
    { q: 'A document showing your salary and deductions is a…', options: ['payslip', 'roster', 'crop'], answer: 'payslip', hint: 'Keep payslips as employment evidence.' },
    { q: 'Work that meets the official requirements is…', options: ['eligible', 'remote', 'repetitive'], answer: 'eligible', hint: 'Eligible means that it qualifies under the rules.' },
    { q: 'A schedule showing work days and shifts is a…', options: ['roster', 'harvest', 'vest'], answer: 'roster', hint: 'Roster is common workplace vocabulary in Australia.' },
    { q: 'Collecting ripe fruit from plants is…', options: ['harvesting', 'processing a claim', 'reviewing a contract'], answer: 'harvesting', hint: 'Harvesting is agricultural work.' },
    { q: 'A bright safety garment is a…', options: ['high-visibility vest', 'payslip', 'crop'], answer: 'high-visibility vest', hint: 'Often shortened informally to hi-vis vest.' },
    { q: 'A place far from major towns is a…', options: ['remote area', 'customer request', 'bank branch'], answer: 'remote area', hint: 'Many mining roles use remote rosters.' },
    { q: 'To look carefully at a legal document is to…', options: ['review a contract', 'pick fruit', 'wear a helmet'], answer: 'review a contract', hint: 'This is one of your transferable banking skills.' },
    { q: 'Protecting private customer information means respecting…', options: ['confidentiality', 'harvesting', 'accommodation'], answer: 'confidentiality', hint: 'Confidentiality is valuable in many industries.' },
    { q: 'A place where a worker stays is…', options: ['accommodation', 'cultivation', 'identification'], answer: 'accommodation', hint: 'Some remote roles provide accommodation.' },
    { q: 'To notice and report a mistake is to…', options: ['identify an error', 'complete a harvest', 'apply a roster'], answer: 'identify an error', hint: 'Attention to detail helps you identify errors.' }
  ]
};

const vocabulary = [
  { category:'visa', term:'visa application', fr:'demande de visa', definition:'the formal request for a visa', example:'I plan to prepare my visa application carefully.' },
  { category:'visa', term:'eligible', fr:'éligible / admissible', definition:'meeting the official conditions', example:'I need to check whether the job is eligible specified work.' },
  { category:'visa', term:'specified work', fr:'travail spécifique éligible', definition:'work that can count toward a later Working Holiday visa', example:'Some regional mining work can qualify as specified work.' },
  { category:'visa', term:'regional area', fr:'zone régionale', definition:'an officially defined area outside certain major metropolitan zones', example:'The position is located in a regional area.' },
  { category:'visa', term:'payslip', fr:'fiche de paie', definition:'a document showing pay and deductions', example:'I will keep every payslip as evidence of my employment.' },
  { category:'visa', term:'employment contract', fr:'contrat de travail', definition:'a written agreement between employer and employee', example:'I always read an employment contract carefully.' },
  { category:'visa', term:'accommodation', fr:'logement / hébergement', definition:'a place to live or stay', example:'The employer provides shared accommodation.' },
  { category:'farm', term:'harvesting', fr:'récolte', definition:'collecting crops when they are ready', example:'The job involves harvesting fruit early in the morning.' },
  { category:'farm', term:'packing shed', fr:'hangar de conditionnement', definition:'a building where produce is sorted and packed', example:'We meet outside the packing shed at 5:45.' },
  { category:'farm', term:'crop', fr:'culture / récolte', definition:'plants grown for food or sale', example:'This farm grows several vegetable crops.' },
  { category:'farm', term:'livestock', fr:'bétail', definition:'farm animals kept for production', example:'The workers feed and check the livestock.' },
  { category:'farm', term:'shift', fr:'poste / service', definition:'a scheduled period of work', example:'My first shift starts at six in the morning.' },
  { category:'farm', term:'physically demanding', fr:'physiquement exigeant', definition:'requiring considerable physical effort', example:'Harvesting can be physically demanding.' },
  { category:'mine', term:'mining site', fr:'site minier', definition:'the area where mining operations take place', example:'Everyone must follow the rules on the mining site.' },
  { category:'mine', term:'roster', fr:'planning de rotation', definition:'a schedule of work days, shifts and rest days', example:'The role has a two-weeks-on, one-week-off roster.' },
  { category:'mine', term:'remote area', fr:'zone isolée', definition:'a place far from major population centres', example:'Some mine sites are in remote areas.' },
  { category:'mine', term:'high-visibility vest', fr:'gilet haute visibilité', definition:'bright protective clothing that makes a worker easy to see', example:'You must wear a high-visibility vest.' },
  { category:'mine', term:'safety procedure', fr:'procédure de sécurité', definition:'the required steps for working safely', example:'I am used to following detailed safety procedures.' },
  { category:'mine', term:'report damage', fr:'signaler un dommage', definition:'inform the responsible person about broken equipment', example:'Report any damage to the supervisor immediately.' },
  { category:'skills', term:'review a contract', fr:'examiner un contrat', definition:'read and check a contract carefully', example:'In my current job, I review banking and insurance contracts.' },
  { category:'skills', term:'process documents', fr:'traiter des documents', definition:'complete the required administrative actions for documents', example:'I process documents and check that the information is complete.' },
  { category:'skills', term:'respect confidentiality', fr:'respecter la confidentialité', definition:'protect private or sensitive information', example:'Banking has taught me to respect confidentiality.' },
  { category:'skills', term:'attention to detail', fr:'souci du détail', definition:'the ability to notice small but important information', example:'My attention to detail is one of my strengths.' },
  { category:'skills', term:'meet a deadline', fr:'respecter une échéance', definition:'finish work by the required time', example:'I can organise my tasks and meet deadlines.' },
  { category:'skills', term:'transferable skill', fr:'compétence transférable', definition:'a skill useful in different jobs or industries', example:'Reliability is a transferable skill.' }
];

const orderSentences = [
  { words:['I','currently','work','in','banking','and','insurance.'], answer:'I currently work in banking and insurance.', hint:'Start with the subject, then the time word, then the verb.' },
  { words:['My','responsibilities','include','checking','contracts','and','documents.'], answer:'My responsibilities include checking contracts and documents.', hint:'Include is followed here by the -ing form.' },
  { words:['I','am','planning','to','move','to','Australia','in','2027.'], answer:'I am planning to move to Australia in 2027.', hint:'Plan: be + planning + to + base verb.' },
  { words:['I','may','work','in','agriculture','or','mining.'], answer:'I may work in agriculture or mining.', hint:'After may, use the base verb.' },
  { words:['Although','the','industry','is','different,','my','skills','are','transferable.'], answer:'Although the industry is different, my skills are transferable.', hint:'Start with Although + complete clause.' },
  { words:['If','Australia','does','not','work','out,','I','may','go','to','Belize.'], answer:'If Australia does not work out, I may go to Belize.', hint:'If + present, then may + base verb.' }
];

const listeningScripts = {
  farm: 'We start at six tomorrow morning. Please meet outside the packing shed at five forty-five. Wear closed shoes, bring water and speak to Emma if you need gloves.',
  mine: 'Before entering the work area, you must put on your helmet, safety glasses and high-visibility vest. Check your equipment before every shift and report any damage immediately to the site supervisor.',
  recruiter: 'Hi Marine, this is Olivia from Red Earth Staffing. We would like to invite you to an interview next Tuesday at ten thirty. Our office is on King Street, opposite the train station. Please bring photo identification and a copy of your résumé. Call me back before Friday to confirm.'
};

const listeningQuestions = {
  farm: [
    { q:'What time does the shift start?', options:['5:45','6:00','6:45'], answer:'6:00' },
    { q:'Where must you meet the team?', options:['Outside the packing shed','At the train station','Inside the office'], answer:'Outside the packing shed' },
    { q:'What must you bring?', options:['Water','A résumé','Safety glasses'], answer:'Water' },
    { q:'Who can provide gloves?', options:['Emma','Olivia','Daniel'], answer:'Emma' }
  ],
  mine: [
    { q:'What must be worn?', options:['Helmet, safety glasses and hi-vis vest','Closed shoes only','A raincoat'], answer:'Helmet, safety glasses and hi-vis vest' },
    { q:'When must equipment be checked?', options:['Before every shift','Once a month','After lunch'], answer:'Before every shift' },
    { q:'What must be reported?', options:['Any damage','Every conversation','The weather'], answer:'Any damage' },
    { q:'Who receives the report?', options:['The site supervisor','The bank manager','The flatmate'], answer:'The site supervisor' }
  ],
  recruiter: [
    { q:'Who is calling?', options:['Olivia','Emma','Daniel'], answer:'Olivia' },
    { q:'When is the interview?', options:['Next Tuesday at 10:30','Friday at 9:00','Tomorrow at 6:00'], answer:'Next Tuesday at 10:30' },
    { q:'Where is the office?', options:['On King Street','At the mine entrance','Beside the packing shed'], answer:'On King Street' },
    { q:'What must you do before Friday?', options:['Call back to confirm','Start work','Send a payslip'], answer:'Call back to confirm' }
  ]
};

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function escapeHtml(value = '') {
  return value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]));
}

function renderQuiz(key) {
  const container = $(`#${key}Quiz`);
  if (!container) return;
  container.innerHTML = '';
  quizData[key].forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'quiz-card';
    card.dataset.quiz = key;
    card.dataset.index = String(index);
    card.innerHTML = `
      <span class="quiz-number">QUESTION ${String(index + 1).padStart(2,'0')}</span>
      <h4>${item.q}</h4>
      <div class="option-list">
        ${shuffle(item.options).map(option => `<button type="button" class="option-button" data-option="${escapeHtml(option)}">${option}</button>`).join('')}
      </div>
      <div class="feedback"></div>`;
    container.appendChild(card);
    const saved = state.answers[`${key}-${index}`];
    if (saved) applyQuizAnswer(card, key, index, saved, false);
  });
  updateQuizScore(key);
}

function applyQuizAnswer(card, key, index, chosen, announce = true) {
  const item = quizData[key][index];
  const correct = chosen === item.answer;
  state.answers[`${key}-${index}`] = chosen;
  card.classList.remove('correct','incorrect');
  card.classList.add(correct ? 'correct' : 'incorrect');
  $$('.option-button', card).forEach(button => {
    button.disabled = true;
    const value = button.dataset.option;
    button.classList.toggle('selected-correct', value === chosen && correct);
    button.classList.toggle('selected-wrong', value === chosen && !correct);
    button.classList.toggle('reveal-correct', value === item.answer && !correct);
  });
  $('.feedback', card).innerHTML = correct ? `✓ Correct. ${item.hint}` : `✗ Best answer: <strong>${item.answer}</strong>. ${item.hint}`;
  updateQuizScore(key);
  updateResults();
  saveProgress(false);
  if (announce) showToast(correct ? 'Correct — say the sentence aloud.' : 'Review the correction, then repeat it aloud.');
}

function updateQuizScore(key) {
  const items = quizData[key] || [];
  const correct = items.reduce((sum, item, index) => sum + (state.answers[`${key}-${index}`] === item.answer ? 1 : 0), 0);
  const el = $(`#${key}Score`);
  if (el) el.textContent = `${correct} / ${items.length}`;
}

function resetQuiz(key) {
  Object.keys(state.answers).filter(k => k.startsWith(`${key}-`)).forEach(k => delete state.answers[k]);
  renderQuiz(key);
  updateResults();
  saveProgress(false);
}

function renderVocabulary() {
  const grid = $('#vocabGrid');
  grid.innerHTML = vocabulary.map((item, index) => `
    <article class="vocab-card" data-category="${item.category}">
      <div class="vocab-card-head">
        <div><h3>${item.term}</h3><p class="translation fr">${item.fr}</p></div>
        <button class="speak-mini" data-speak="${escapeHtml(item.term)}. ${escapeHtml(item.example)}" type="button">🔊</button>
      </div>
      <p class="definition">${item.definition}</p>
      <p class="example"><strong>Example:</strong> ${item.example}</p>
      <label>My sentence<input type="text" data-save="vocab-${index}" placeholder="Write your own example…"></label>
    </article>`).join('');
}

function renderListeningQuestions() {
  Object.entries(listeningQuestions).forEach(([group, questions]) => {
    const container = $(`#${group}Questions`);
    container.innerHTML = questions.map((item, index) => `
      <div class="mini-question">
        <p>${index + 1}. ${item.q}</p>
        <select data-listening-group="${group}" data-listening-index="${index}">
          <option value="">Choose…</option>
          ${item.options.map(option => `<option value="${escapeHtml(option)}">${option}</option>`).join('')}
        </select>
        <div class="mini-feedback"></div>
      </div>`).join('');
    questions.forEach((item, index) => {
      const select = $(`select[data-listening-group="${group}"][data-listening-index="${index}"]`);
      const saved = state.listeningAnswers[`${group}-${index}`];
      if (saved) {
        select.value = saved;
        evaluateListeningSelect(select, false);
      }
    });
  });
  updateListeningScore();
}

function evaluateListeningSelect(select, announce = true) {
  const group = select.dataset.listeningGroup;
  const index = Number(select.dataset.listeningIndex);
  const chosen = select.value;
  if (!chosen) return;
  const item = listeningQuestions[group][index];
  const correct = chosen === item.answer;
  state.listeningAnswers[`${group}-${index}`] = chosen;
  const feedback = select.closest('.mini-question').querySelector('.mini-feedback');
  feedback.textContent = correct ? '✓ Correct' : `✗ Answer: ${item.answer}`;
  feedback.style.color = correct ? '#18704b' : '#9a3540';
  updateListeningScore();
  updateResults();
  saveProgress(false);
  if (announce) showToast(correct ? 'Listening detail correct.' : 'Listen again and focus on the key word.');
}

function updateListeningScore() {
  let correct = 0;
  let total = 0;
  Object.entries(listeningQuestions).forEach(([group, questions]) => {
    questions.forEach((item, index) => {
      total += 1;
      if (state.listeningAnswers[`${group}-${index}`] === item.answer) correct += 1;
    });
  });
  $('#listeningScore').textContent = `${correct} / ${total}`;
}

function resetListening() {
  state.listeningAnswers = {};
  renderListeningQuestions();
  updateResults();
  saveProgress(false);
}

function renderOrderSentence() {
  const item = orderSentences[state.orderIndex];
  state.orderChosen = [];
  $('#orderProgress').textContent = `Sentence ${state.orderIndex + 1} / ${orderSentences.length}`;
  $('#wordBank').innerHTML = shuffle(item.words).map((word, index) => `<button type="button" class="word-chip" data-word="${escapeHtml(word)}" data-origin="${index}">${word}</button>`).join('');
  $('#orderAnswer').innerHTML = '';
  $('#orderFeedback').textContent = '';
  $('#orderFeedback').className = 'feedback-box';
}

function normaliseSentence(text) {
  return text.replace(/\s+([,.!?])/g, '$1').replace(/\s+/g, ' ').trim();
}

function checkOrder() {
  const item = orderSentences[state.orderIndex];
  const answer = normaliseSentence(state.orderChosen.join(' '));
  const feedback = $('#orderFeedback');
  if (!answer) {
    feedback.textContent = 'Build the sentence first.';
    feedback.className = 'feedback-box bad';
    return;
  }
  if (answer === item.answer) {
    const isLast = state.orderIndex >= orderSentences.length - 1;
    feedback.innerHTML = `<strong>✓ Correct:</strong> ${escapeHtml(item.answer)}<div class="inline-actions order-feedback-actions"><button class="text-button" data-speak="${escapeHtml(item.answer)}" type="button">🔊 Hear this sentence</button>${isLast ? '' : '<button class="btn small secondary" data-order-next type="button">Next sentence →</button>'}</div>`;
    feedback.className = 'feedback-box good';
    state.orderCompleted = Math.max(state.orderCompleted, state.orderIndex + 1);
    updateResults();
    saveProgress(false);
  } else {
    feedback.textContent = 'Not yet. Check the subject, verb and word order.';
    feedback.className = 'feedback-box bad';
  }
}

function getVoices() {
  return 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
}

function normaliseLang(value = '') { return value.toLowerCase().replace('_','-'); }

function getPreferredVoice(accent) {
  const voices = getVoices();
  const target = normaliseLang(accent);
  return voices.find(v => normaliseLang(v.lang) === target)
    || voices.find(v => normaliseLang(v.lang).startsWith(target))
    || voices.find(v => target === 'en-au' && /austral|karen|lee|matilda/i.test(v.name))
    || voices.find(v => normaliseLang(v.lang).startsWith('en-'))
    || voices[0]
    || null;
}

function updateVoiceAvailability() {
  const status = $('#voiceAvailability');
  if (!('speechSynthesis' in window)) {
    status.textContent = '⚠️ Text-to-speech is not supported by this browser.';
    status.classList.add('voice-fallback');
    return;
  }
  const accent = $('#voiceAccent').value || 'en-AU';
  const voice = getPreferredVoice(accent);
  const labels = {'en-AU':'Australian','en-GB':'British','en-US':'American'};
  const exact = voice && normaliseLang(voice.lang) === normaliseLang(accent);
  if (voice && exact) {
    status.textContent = `${accent === 'en-AU' ? '🇦🇺' : '🎧'} ${labels[accent]} English is ready. Every listening button will use: ${voice.name}.`;
    status.classList.remove('voice-fallback');
  } else if (voice) {
    status.textContent = `⚠️ A true ${labels[accent]} voice is not installed on this device. The page will use ${voice.name} (${voice.lang}) as the closest available English voice.`;
    status.classList.add('voice-fallback');
  } else {
    status.textContent = '⚠️ No speech voice is currently available. Try Chrome or install an English voice in the device settings.';
    status.classList.add('voice-fallback');
  }
}

function speakText(text) {
  if (!text || !('speechSynthesis' in window)) {
    showToast('Speech is not available in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g,' ').trim());
  const accent = $('#voiceAccent').value || 'en-AU';
  const voice = getPreferredVoice(accent);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || accent;
  utterance.rate = Number($('#voiceRate').value || .92);
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function buildSentence() {
  const subject = $('#builderSubject').value.trim();
  const adverb = $('#builderAdverb').value.trim();
  const verb = $('#builderVerb').value.trim();
  const detail = $('#builderDetail').value.trim();
  const place = $('#builderPlace').value.trim();
  const time = $('#builderTime').value.trim();
  const reason = $('#builderReason').value.trim();
  if (!detail) {
    showToast('Add a useful detail first.');
    return;
  }
  const core = [subject, adverb, verb, detail].filter(Boolean).join(' ');
  const pieces = [core, place, time].filter(Boolean);
  let sentence = pieces.join(' ');
  if (reason) sentence += ` because ${reason.replace(/^because\s+/i,'')}`;
  sentence = sentence.replace(/\s+/g,' ').trim();
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).replace(/[.?!]*$/, '.');
  $('#sentenceOutput').textContent = sentence;
  saveProgress(false);
}

function buildTrip() {
  const destination = $('#tripDestination').value.trim() || 'Thailand';
  const partner = $('#tripPartner').value.trim() || 'my partner';
  const duration = $('#tripDuration').value.trim() || 'two weeks';
  const activitiesRaw = $('#tripActivities').value.trim() || 'visited interesting places, explored the area and tried local food';
  const memory = $('#tripMemory').value.trim() || 'the landscapes because they were beautiful';
  const story = `I travelled to ${destination} with ${partner}. We stayed there for ${duration}. We ${activitiesRaw}. I particularly enjoyed ${memory}. The trip was a valuable experience because it helped me become more independent and confident.`;
  $('#tripOutput').textContent = story;
  state.travelBuilt = true;
  updateResults();
  saveProgress(false);
}

function updateWordCount() {
  const text = $('#writingText').value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  $('#wordCount').textContent = `${words} word${words === 1 ? '' : 's'}`;
  return words;
}

function analyseWriting() {
  const text = $('#writingText').value.trim();
  const words = updateWordCount();
  const checks = {
    greeting: /hello|dear/i.test(text),
    currentJob: /currently|at the moment|work in|work at/i.test(text),
    skills: /reliable|organis|detail|contract|document|customer|procedure/i.test(text),
    availability: /available|2027|arrival/i.test(text),
    desiredWork: /agricultur|farm|mining|position|role/i.test(text),
    motivation: /because|would like|goal|improve|experience/i.test(text),
    closing: /kind regards|best regards|yours sincerely/i.test(text)
  };
  const achieved = Object.values(checks).filter(Boolean).length;
  const messages = [];
  if (words < 80) messages.push('Add more detail: aim for approximately 80–110 words.');
  else if (words > 115) messages.push('The message is quite long. Remove repeated ideas and keep it close to 80–110 words.');
  else messages.push('The length is suitable for this practice task.');
  if (!checks.greeting) messages.push('Add a professional greeting.');
  if (!checks.currentJob) messages.push('State your current position clearly.');
  if (!checks.skills) messages.push('Add one or two transferable skills with evidence.');
  if (!checks.availability) messages.push('Mention when you will be available.');
  if (!checks.desiredWork) messages.push('Say what type of work you are seeking.');
  if (!checks.motivation) messages.push('Explain why you want to work in Australia.');
  if (!checks.closing) messages.push('Finish with a professional closing.');
  const feedback = $('#writingFeedback');
  feedback.innerHTML = `<strong>${achieved}/7 structural elements detected.</strong><br>${messages.map(m => `• ${m}`).join('<br>')}`;
  const passed = achieved >= 6 && words >= 80 && words <= 115;
  feedback.className = `writing-feedback ${passed ? 'good' : 'bad'}`;
  state.writingAnalysed = true;
  state.writingResult = { achieved, words, passed };
  updateResults();
  saveProgress(false);
}

function generateRevision() {
  const sentences = $('[data-save="revisionSentences"]').value.trim() || 'Add five essential sentences.';
  const words = $('[data-save="revisionWords"]').value.trim() || 'Add ten priority words.';
  const grammar = $('[data-save="revisionGrammar"]').value.trim() || 'Add three grammar reminders.';
  const output = `MARINE — LESSON 2 REVISION CARD\nMY AUSTRALIAN WORKING HOLIDAY PLAN\n\nESSENTIAL SENTENCES\n${sentences}\n\nPRIORITY VOCABULARY\n${words}\n\nGRAMMAR REMINDERS\n${grammar}\n\nMY METHOD\nSee it → Write it → Listen → Rebuild → Speak`;
  $('#revisionPreview').textContent = output;
  return output;
}

function downloadText(filename, content) {
  const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function copyText(text) {
  if (!text) return showToast('Nothing to copy yet.');
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied.')).catch(() => fallbackCopy(text));
  } else fallbackCopy(text);
}

function fallbackCopy(text) {
  const area = document.createElement('textarea');
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
  showToast('Copied.');
}

function collectFormValues() {
  const values = {};
  $$('[data-save]').forEach(el => values[el.dataset.save] = el.type === 'checkbox' ? el.checked : el.value);
  ['builderSubject','builderAdverb','builderVerb','builderDetail','builderPlace','builderTime','builderReason','tripDestination','tripPartner','tripDuration','tripActivities','tripMemory'].forEach(id => {
    const el = document.getElementById(id);
    if (el) values[id] = el.value;
  });
  values.translation = $('#translationToggle').checked;
  values.accent = $('#voiceAccent').value;
  values.rate = $('#voiceRate').value;
  values.sentenceOutput = $('#sentenceOutput').textContent;
  values.tripOutput = $('#tripOutput').textContent;
  values.revisionPreview = $('#revisionPreview').textContent;
  values.checks = $$('[data-check]').map(el => el.checked);
  return values;
}

function applyFormValues(values = {}) {
  $$('[data-save]').forEach(el => {
    if (Object.prototype.hasOwnProperty.call(values, el.dataset.save)) {
      if (el.type === 'checkbox') el.checked = Boolean(values[el.dataset.save]);
      else el.value = values[el.dataset.save];
    }
  });
  ['builderSubject','builderAdverb','builderVerb','builderDetail','builderPlace','builderTime','builderReason','tripDestination','tripPartner','tripDuration','tripActivities','tripMemory'].forEach(id => {
    if (Object.prototype.hasOwnProperty.call(values, id) && document.getElementById(id)) document.getElementById(id).value = values[id];
  });
  if (typeof values.translation === 'boolean') $('#translationToggle').checked = values.translation;
  if (values.accent) $('#voiceAccent').value = values.accent;
  if (values.rate) $('#voiceRate').value = values.rate;
  if (values.sentenceOutput) $('#sentenceOutput').textContent = values.sentenceOutput;
  if (values.tripOutput) $('#tripOutput').textContent = values.tripOutput;
  if (values.revisionPreview) $('#revisionPreview').textContent = values.revisionPreview;
  if (Array.isArray(values.checks)) $$('[data-check]').forEach((el,index) => el.checked = Boolean(values.checks[index]));
  document.body.classList.toggle('hide-fr', !$('#translationToggle').checked);
  updateWordCount();
  updateRanges();
  updateVoiceAvailability();
}

function storageGet(key) {
  try { return window.localStorage.getItem(key); }
  catch (error) { return null; }
}

function storageSet(key, value) {
  try { window.localStorage.setItem(key, value); return true; }
  catch (error) { return false; }
}

function saveProgress(announce = true) {
  state.savedAt = new Date().toISOString();
  const payload = { state, values: collectFormValues() };
  const saved = storageSet(STORAGE_KEY, JSON.stringify(payload));
  if (announce) showToast(saved ? 'Lesson progress saved on this device.' : 'Saving is blocked in this browser mode. Your work remains visible on the page.');
}

function loadProgress(announce = true) {
  const raw = storageGet(STORAGE_KEY);
  if (!raw) {
    if (announce) showToast('No saved work was found yet.');
    return;
  }
  try {
    const payload = JSON.parse(raw);
    Object.assign(state, payload.state || {});
    state.manualAssessment ||= {};
    ensureManualSections();
    applyFormValues(payload.values || {});
    ['pvt','grammar','vocab'].forEach(renderQuiz);
    renderListeningQuestions();
    state.orderIndex = Math.min(Number(state.orderIndex || 0), orderSentences.length - 1);
    renderOrderSentence();
    updateResults();
    if (announce) showToast('Saved work restored.');
  } catch (error) {
    console.error(error);
    showToast('The saved data could not be restored.');
  }
}

function getScoredTotals() {
  let correct = 0;
  let answered = 0;
  let total = 0;
  const sections = {};
  Object.entries(quizData).forEach(([key, items]) => {
    let sectionCorrect = 0;
    let sectionAnswered = 0;
    items.forEach((item,index) => {
      total += 1;
      const value = state.answers[`${key}-${index}`];
      if (value) { answered += 1; sectionAnswered += 1; }
      if (value === item.answer) { correct += 1; sectionCorrect += 1; }
    });
    sections[key] = {correct:sectionCorrect, answered:sectionAnswered, total:items.length};
  });
  let listeningCorrect = 0;
  let listeningAnswered = 0;
  let listeningTotal = 0;
  Object.entries(listeningQuestions).forEach(([group, questions]) => questions.forEach((item,index) => {
    listeningTotal += 1; total += 1;
    const value = state.listeningAnswers[`${group}-${index}`];
    if (value) { answered += 1; listeningAnswered += 1; }
    if (value === item.answer) { correct += 1; listeningCorrect += 1; }
  }));
  sections.listening = {correct:listeningCorrect, answered:listeningAnswered, total:listeningTotal};
  const orderTotal = orderSentences.length;
  const orderCorrect = Math.min(state.orderCompleted || 0, orderTotal);
  total += orderTotal;
  answered += orderCorrect;
  correct += orderCorrect;
  sections.sentences = {correct:orderCorrect, answered:orderCorrect, total:orderTotal};
  return {correct, answered, total, percent: total ? Math.round(correct / total * 100) : 0, sections};
}

function assessmentWeight(value) {
  return ({'Pas commencé':0,'Non acquis':25,'En cours':55,'Acquis':90})[value] || 0;
}

function autoStatusFromScore(data) {
  if (!data || data.answered === 0) return 'Pas commencé';
  if (data.answered < data.total) return 'En cours';
  const percent = data.total ? Math.round(data.correct / data.total * 100) : 0;
  return percent >= 70 ? 'Acquis' : 'Non acquis';
}

function ensureManualSections() {
  state.manualSections ||= {};
  Object.keys(manualExerciseMeta).forEach(key => {
    state.manualSections[key] ||= { checked:false, status:'Pas commencé', note:'' };
    const item = state.manualSections[key];
    item.checked = Boolean(item.checked);
    item.status = ['Pas commencé','En cours','Acquis','Non acquis'].includes(item.status) ? item.status : 'Pas commencé';
    item.note = String(item.note || '');
  });
}

function syncManualControls(key) {
  ensureManualSections();
  const item = state.manualSections[key];
  $$(`[data-manual-check="${key}"]`).forEach(el => { el.checked = item.checked; });
  $$(`[data-manual-status="${key}"]`).forEach(el => { el.value = item.status; });
  $$(`[data-manual-note="${key}"]`).forEach(el => { if (el.value !== item.note) el.value = item.note; });
}

function syncAllManualControls() {
  ensureManualSections();
  Object.keys(manualExerciseMeta).forEach(syncManualControls);
}

function updateManualSection(key, field, value) {
  ensureManualSections();
  const item = state.manualSections[key];
  if (field === 'checked') {
    item.checked = Boolean(value);
    if (!item.checked) item.status = 'Pas commencé';
    else if (item.status === 'Pas commencé') item.status = 'En cours';
  } else if (field === 'status') {
    item.status = value;
    item.checked = value !== 'Pas commencé';
  } else if (field === 'note') {
    item.note = String(value || '');
  }
  syncManualControls(key);
  updateResults();
  saveProgress(false);
}

function renderAutomaticProgress(totals) {
  const order = ['pvt','sentences','grammar','vocab','listening'];
  const tbody = $('#automaticProgressRows');
  if (!tbody) return;
  tbody.innerHTML = order.map(key => {
    const data = totals.sections[key];
    const meta = automaticExerciseMeta[key];
    const percent = data.total ? Math.round(data.correct / data.total * 100) : 0;
    const status = autoStatusFromScore(data);
    const statusClass = status.toLowerCase().replaceAll(' ', '-').replace('é','e').replace('è','e');
    return `<tr>
      <td><strong>${meta.section}</strong></td>
      <td><span class="exercise-type-tag">${meta.type}</span></td>
      <td>${meta.details}</td>
      <td><strong>${data.answered}/${data.total}</strong><div class="table-progress"><span style="width:${data.total ? Math.round(data.answered / data.total * 100) : 0}%"></span></div></td>
      <td><strong>${data.correct}/${data.total}</strong><small>${percent}% correct</small></td>
      <td><span class="status-pill ${statusClass}">${status}</span></td>
    </tr>`;
  }).join('');
}

function updateResults() {
  const totals = getScoredTotals();
  ensureManualSections();
  renderAutomaticProgress(totals);
  syncAllManualControls();
  $('#globalScore').textContent = `${totals.percent}%`;
  $('#globalScoreDetail').textContent = `${totals.correct} correct · ${totals.answered}/${totals.total} answered`;
  $('#resultDonut').style.setProperty('--score', `${totals.percent}%`);

  const completedAutomatic = Object.values(totals.sections).filter(data => data.answered === data.total).length;
  const manualObserved = Object.values(state.manualSections).filter(item => item.checked).length;
  const manualValues = Object.values(state.manualSections).map(item => item.status).filter(v => v !== 'Pas commencé');
  const trainerAverage = manualValues.length ? manualValues.reduce((sum,v) => sum + assessmentWeight(v),0) / manualValues.length : totals.percent;
  const combined = Math.round(totals.percent * .7 + trainerAverage * .3);

  let label = 'Lesson in progress';
  let message = `${completedAutomatic}/5 automatic activity groups completed · ${manualObserved}/4 manual productions observed.`;
  if (totals.answered >= Math.ceil(totals.total * .45)) {
    if (combined >= 85) { label = 'Strong acquisition'; message += ' Target structures are becoming accurate and operational.'; }
    else if (combined >= 68) { label = 'Good progress'; message += ' Continue spontaneous reformulation and grammar-accuracy practice.'; }
    else if (combined >= 48) { label = 'Developing'; message += ' Guided repetition is still needed to stabilise word order and longer answers.'; }
    else { label = 'Further support required'; message += ' Return to the sentence formula and rebuild one structure at a time.'; }
  }
  $('#progressLabel').textContent = label;
  $('#autoEvaluation').textContent = message;
}

function updateRanges() {
  $$('input[type="range"]').forEach(range => {
    const output = $(`[data-range-for="${range.id}"]`);
    if (output) output.textContent = `${range.value} / ${range.max}`;
  });
}

function evaluationReportData() {
  const totals = getScoredTotals();
  ensureManualSections();
  const automatic = ['pvt','sentences','grammar','vocab','listening'].map(key => {
    const data = totals.sections[key];
    const meta = automaticExerciseMeta[key];
    return { ...meta, answered:data.answered, correct:data.correct, total:data.total, percent:data.total ? Math.round(data.correct / data.total * 100) : 0, status:autoStatusFromScore(data) };
  });
  const manual = Object.entries(manualExerciseMeta).map(([key, meta]) => ({ key, ...meta, ...state.manualSections[key] }));
  return {
    totals, automatic, manual,
    trainerComments: $('#trainerComments').value.trim() || 'Not entered',
    feedback: {
      usefulness: `${$('#usefulnessRange').value}/5`,
      confidence: `${$('#confidenceRange').value}/5`,
      pace: $('#paceSelect').value,
      method: $('#methodSelect').value,
      useful: $('#learnerUseful').value.trim() || 'Not entered',
      next: $('#learnerNext').value.trim() || 'Not entered'
    },
    generated: new Date().toLocaleString('en-GB')
  };
}

function evaluationReportText() {
  const data = evaluationReportData();
  const lines = [
    'MARINE HOLY — LESSON 2 QUALIOPI EVALUATION',
    'My Australian Working Holiday Plan · LILATE preparation',
    '',
    `AUTOMATIC PROGRESS — ${data.totals.correct}/${data.totals.total} (${data.totals.percent}%)`
  ];
  data.automatic.forEach(item => lines.push(`${item.section} | ${item.type} | ${item.correct}/${item.total} correct | ${item.answered}/${item.total} answered | ${item.status}`, `  ${item.details}`));
  lines.push('', 'MANUAL TRAINER ASSESSMENT');
  data.manual.forEach(item => lines.push(`${item.section} | ${item.type} | ${item.checked ? 'Observed' : 'Not observed'} | ${item.status}`, `  Note: ${item.note || 'Not entered'}`));
  lines.push('', `General trainer comments: ${data.trainerComments}`, '', 'LEARNER FEEDBACK', `Usefulness: ${data.feedback.usefulness}`, `Confidence building sentences: ${data.feedback.confidence}`, `Pace: ${data.feedback.pace}`, `Most helpful method: ${data.feedback.method}`, `Most useful: ${data.feedback.useful}`, `To practise again: ${data.feedback.next}`, '', `Generated: ${data.generated}`);
  return lines.join('\n');
}

function reportTableRows(items, manual = false) {
  return items.map(item => manual
    ? `<tr><td><strong>${escapeHtml(item.section)}</strong><br><small>${escapeHtml(item.details)}</small></td><td>${escapeHtml(item.type)}</td><td>${item.checked ? 'Observed / completed' : 'Not observed'}</td><td><strong>${escapeHtml(item.status)}</strong></td><td>${escapeHtml(item.note || 'Not entered')}</td></tr>`
    : `<tr><td><strong>${escapeHtml(item.section)}</strong><br><small>${escapeHtml(item.details)}</small></td><td>${escapeHtml(item.type)}</td><td>${item.answered}/${item.total}</td><td>${item.correct}/${item.total} (${item.percent}%)</td><td><strong>${escapeHtml(item.status)}</strong></td></tr>`
  ).join('');
}

function evaluationReportBody() {
  const data = evaluationReportData();
  return `<div class="report-preview">
    <header class="report-preview-header"><div><p>QUALIOPI · END-OF-LESSON EVALUATION</p><h3>Marine Holy — Lesson 2</h3><span>My Australian Working Holiday Plan · LILATE preparation</span></div><div class="report-score"><strong>${data.totals.percent}%</strong><span>automatic score</span></div></header>
    <section><h4>1. Automatic progress</h4><p>Only page-corrected exercises are included.</p><div class="report-table-wrap"><table><thead><tr><th>Section and details</th><th>Exercise type</th><th>Completion</th><th>Result</th><th>Status</th></tr></thead><tbody>${reportTableRows(data.automatic)}</tbody></table></div></section>
    <section><h4>2. Manual trainer assessment</h4><p>Only non-automatic written and oral productions are included.</p><div class="report-table-wrap"><table><thead><tr><th>Activity and details</th><th>Exercise type</th><th>Observation</th><th>Status</th><th>Trainer note</th></tr></thead><tbody>${reportTableRows(data.manual, true)}</tbody></table></div><div class="report-note"><strong>General trainer comments</strong><p>${escapeHtml(data.trainerComments)}</p></div></section>
    <section><h4>3. Learner feedback</h4><div class="feedback-report-grid"><div><strong>Usefulness</strong><span>${escapeHtml(data.feedback.usefulness)}</span></div><div><strong>Sentence confidence</strong><span>${escapeHtml(data.feedback.confidence)}</span></div><div><strong>Pace</strong><span>${escapeHtml(data.feedback.pace)}</span></div><div><strong>Most helpful method</strong><span>${escapeHtml(data.feedback.method)}</span></div></div><div class="report-note"><strong>Most useful</strong><p>${escapeHtml(data.feedback.useful)}</p></div><div class="report-note"><strong>To practise again</strong><p>${escapeHtml(data.feedback.next)}</p></div></section>
    <footer>Generated ${escapeHtml(data.generated)} · SpeakEasy Tisha</footer>
  </div>`;
}

function generateEvaluation() {
  const body = evaluationReportBody();
  $('#evaluationSummary').innerHTML = body;
  return evaluationReportText();
}

function standaloneEvaluationHtml() {
  const body = evaluationReportBody();
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Marine Holy - Lesson 2 Evaluation</title><style>
  :root{font-family:Arial,Helvetica,sans-serif;color:#142b3a;background:#eef4f7}*{box-sizing:border-box}body{margin:0;padding:28px}.report-preview{max-width:1100px;margin:auto;background:#fff;border:1px solid #d7e1e7;border-radius:20px;padding:34px;box-shadow:0 12px 35px rgba(20,43,58,.09)}.report-preview-header{display:flex;justify-content:space-between;gap:24px;align-items:center;border-bottom:3px solid #2e8fa3;padding-bottom:20px}.report-preview-header p{margin:0;color:#2e8fa3;font-size:12px;font-weight:800;letter-spacing:.1em}.report-preview-header h3{font-size:28px;margin:5px 0}.report-preview-header span{color:#5e7380}.report-score{min-width:130px;text-align:center;background:#e9f6f8;border-radius:16px;padding:18px}.report-score strong{display:block;font-size:30px}.report-score span{font-size:12px}section{margin-top:28px}h4{font-size:19px;margin:0 0 5px}section>p{color:#5e7380;margin-top:0}.report-table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:13px}th{background:#14384a;color:#fff;text-align:left;padding:11px}td{border:1px solid #d7e1e7;padding:10px;vertical-align:top}small{color:#647985}.report-note{background:#f5f8fa;border-left:4px solid #2e8fa3;padding:12px 15px;margin-top:13px;break-inside:avoid}.report-note p{white-space:pre-wrap;margin:5px 0 0}.feedback-report-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.feedback-report-grid div{background:#f5f8fa;border-radius:10px;padding:12px}.feedback-report-grid strong,.feedback-report-grid span{display:block}.feedback-report-grid span{margin-top:4px;color:#5e7380}footer{margin-top:28px;border-top:1px solid #d7e1e7;padding-top:15px;color:#647985;font-size:12px}@media(max-width:700px){body{padding:8px}.report-preview{padding:18px;border-radius:0}.report-preview-header{align-items:flex-start;flex-direction:column}.feedback-report-grid{grid-template-columns:1fr}table{font-size:11px}}@media print{body{background:#fff;padding:0}.report-preview{box-shadow:none;border:0;max-width:none;padding:0}.report-table-wrap{overflow:visible}thead{display:table-header-group}tr{break-inside:avoid}section{break-inside:auto}@page{size:A4;margin:12mm}}
  </style></head><body>${body}</body></html>`;
}

function downloadEvaluationHtml() {
  generateEvaluation();
  const blob = new Blob([standaloneEvaluationHtml()], {type:'text/html;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'marine-lesson-2-qualiopi-evaluation.html';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('Readable HTML evaluation downloaded.');
}

function printEvaluationPdf() {
  generateEvaluation();
  const printWindow = window.open('', '_blank');
  if (!printWindow) return showToast('Allow pop-ups to open the PDF-ready report.');
  printWindow.document.open();
  printWindow.document.write(standaloneEvaluationHtml());
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 350);
}

let mediaRecorder = null;
let mediaChunks = [];
let recordingStream = null;
let recordingStartedAt = 0;
let timerInterval = null;

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2,'0');
  const secs = String(seconds % 60).padStart(2,'0');
  return `${mins}:${secs}`;
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    showToast('Audio recording is not supported in this browser.');
    return;
  }
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({audio:true});
    mediaChunks = [];
    mediaRecorder = new MediaRecorder(recordingStream);
    mediaRecorder.addEventListener('dataavailable', event => { if (event.data.size) mediaChunks.push(event.data); });
    mediaRecorder.addEventListener('stop', () => {
      const blob = new Blob(mediaChunks, {type: mediaRecorder.mimeType || 'audio/webm'});
      const url = URL.createObjectURL(blob);
      $('#recordedAudio').src = url;
      $('#downloadAudioBtn').href = url;
      $('#downloadAudioBtn').classList.remove('disabled');
      state.speakingRecorded = true;
      updateResults();
      saveProgress(false);
      recordingStream?.getTracks().forEach(track => track.stop());
    });
    mediaRecorder.start();
    recordingStartedAt = Date.now();
    $('#startRecordingBtn').disabled = true;
    $('#stopRecordingBtn').disabled = false;
    $('#recordTimer').textContent = '00:00';
    timerInterval = setInterval(() => $('#recordTimer').textContent = formatTime(Math.floor((Date.now() - recordingStartedAt) / 1000)), 250);
    showToast('Recording started.');
  } catch (error) {
    console.error(error);
    showToast('Microphone access was not granted.');
  }
}

function stopRecording() {
  if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
  clearInterval(timerInterval);
  $('#startRecordingBtn').disabled = false;
  $('#stopRecordingBtn').disabled = true;
  showToast('Recording stopped. Download it before closing the page.');
}

function bindEvents() {
  document.addEventListener('click', event => {
    const option = event.target.closest('.option-button');
    if (option) {
      const card = option.closest('.quiz-card');
      applyQuizAnswer(card, card.dataset.quiz, Number(card.dataset.index), option.dataset.option);
      return;
    }
    const orderNext = event.target.closest('[data-order-next]');
    if (orderNext) {
      if (state.orderIndex < orderSentences.length - 1) {
        state.orderIndex += 1;
        renderOrderSentence();
      }
      return;
    }
    const speak = event.target.closest('[data-speak]');
    if (speak) { speakText(speak.dataset.speak); return; }
    const speakTarget = event.target.closest('[data-speak-target]');
    if (speakTarget) {
      const target = document.getElementById(speakTarget.dataset.speakTarget);
      speakText(target?.innerText || '');
      return;
    }
    const copyTarget = event.target.closest('[data-copy-target]');
    if (copyTarget) { copyText(document.getElementById(copyTarget.dataset.copyTarget)?.innerText || ''); return; }
    const reveal = event.target.closest('.reveal-model');
    if (reveal) {
      const box = document.getElementById(reveal.dataset.modelBox);
      box.classList.toggle('hidden');
      reveal.textContent = box.classList.contains('hidden') ? reveal.textContent.replace('Hide','Show') : reveal.textContent.replace('Show','Hide');
      return;
    }
    const transcriptButton = event.target.closest('.reveal-transcript');
    if (transcriptButton) {
      const transcript = document.getElementById(transcriptButton.dataset.transcript);
      transcript.classList.toggle('visible');
      transcriptButton.textContent = transcript.classList.contains('visible') ? 'Hide transcript' : 'Show transcript';
      return;
    }
    const listeningButton = event.target.closest('.play-listening');
    if (listeningButton) { speakText(listeningScripts[listeningButton.dataset.listening]); return; }
    const reset = event.target.closest('.reset-quiz');
    if (reset) {
      if (reset.dataset.quiz === 'listening') resetListening(); else resetQuiz(reset.dataset.quiz);
      return;
    }
  });

  document.addEventListener('change', event => {
    if (event.target.matches('[data-listening-group]')) evaluateListeningSelect(event.target);
    if (event.target.matches('#voiceAccent, #voiceRate')) { updateVoiceAvailability(); saveProgress(false); }
    if (event.target.matches('[data-manual-status]')) updateManualSection(event.target.dataset.manualStatus, 'status', event.target.value);
    if (event.target.matches('[data-manual-check]')) updateManualSection(event.target.dataset.manualCheck, 'checked', event.target.checked);
    if (event.target.matches('[data-save]')) {
      if (event.target.closest('#lilate, #travel, #speaking, #writing')) updateResults();
      saveProgress(false);
    }
  });

  document.addEventListener('input', event => {
    if (event.target.matches('[data-manual-note]')) updateManualSection(event.target.dataset.manualNote, 'note', event.target.value);
    if (event.target.matches('#writingText')) updateWordCount();
    if (event.target.matches('input[type="range"]')) updateRanges();
  });

  $('#translationToggle').addEventListener('change', () => {
    document.body.classList.toggle('hide-fr', !$('#translationToggle').checked);
    saveProgress(false);
  });
  $('#saveBtn').addEventListener('click', () => saveProgress(true));
  $('#resumeBtn').addEventListener('click', () => loadProgress(true));
  $('#printBtn').addEventListener('click', () => window.print());

  $$('.model-tab').forEach(button => button.addEventListener('click', () => {
    $$('.model-tab').forEach(btn => btn.classList.remove('active'));
    $$('.model-panel').forEach(panel => panel.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.model).classList.add('active');
  }));
  $$('.rule-tab').forEach(button => button.addEventListener('click', () => {
    $$('.rule-tab').forEach(btn => btn.classList.remove('active'));
    $$('.rule-panel').forEach(panel => panel.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  }));
  $$('.vocab-filter-btn').forEach(button => button.addEventListener('click', () => {
    $$('.vocab-filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.category;
    $$('.vocab-card').forEach(card => card.classList.toggle('hidden-category', category !== 'all' && card.dataset.category !== category));
  }));

  $('#buildSentenceBtn').addEventListener('click', buildSentence);
  $('#speakSentenceBtn').addEventListener('click', () => speakText($('#sentenceOutput').textContent));
  $('#copySentenceBtn').addEventListener('click', () => copyText($('#sentenceOutput').textContent));
  $('#buildTripBtn').addEventListener('click', buildTrip);
  $('#speakTripBtn').addEventListener('click', () => speakText($('#tripOutput').textContent));
  $('#copyTripBtn').addEventListener('click', () => copyText($('#tripOutput').textContent));

  $('#wordBank').addEventListener('click', event => {
    const chip = event.target.closest('.word-chip');
    if (!chip) return;
    state.orderChosen.push(chip.dataset.word);
    chip.remove();
    $('#orderAnswer').insertAdjacentHTML('beforeend', `<button type="button" class="word-chip" data-word="${escapeHtml(chip.dataset.word)}">${chip.dataset.word}</button>`);
  });
  $('#orderAnswer').addEventListener('click', event => {
    const chip = event.target.closest('.word-chip');
    if (!chip) return;
    const index = state.orderChosen.lastIndexOf(chip.dataset.word);
    if (index >= 0) state.orderChosen.splice(index,1);
    $('#wordBank').insertAdjacentHTML('beforeend', `<button type="button" class="word-chip" data-word="${escapeHtml(chip.dataset.word)}">${chip.dataset.word}</button>`);
    chip.remove();
  });
  $('#checkOrderBtn').addEventListener('click', checkOrder);
  $('#clearOrderBtn').addEventListener('click', renderOrderSentence);
  $('#orderHintBtn').addEventListener('click', () => {
    const item = orderSentences[state.orderIndex];
    $('#orderFeedback').textContent = `Hint: ${item.hint}`;
  });

  $('#analyseWritingBtn').addEventListener('click', analyseWriting);
  $('#copyWritingBtn').addEventListener('click', () => copyText($('#writingText').value));
  $('#downloadWritingBtn').addEventListener('click', () => downloadText('marine-lesson-2-employer-reply.txt', $('#writingText').value));
  $('#generateRevisionBtn').addEventListener('click', generateRevision);
  $('#copyRevisionBtn').addEventListener('click', () => copyText(generateRevision()));
  $('#downloadRevisionBtn').addEventListener('click', () => downloadText('marine-lesson-2-revision-card.txt', generateRevision()));

  $('#startRecordingBtn').addEventListener('click', startRecording);
  $('#stopRecordingBtn').addEventListener('click', stopRecording);

  $('#generateEvaluationBtn').addEventListener('click', generateEvaluation);
  $('#copyEvaluationBtn').addEventListener('click', () => copyText(evaluationReportText()));
  $('#downloadEvaluationHtmlBtn').addEventListener('click', downloadEvaluationHtml);
  $('#printEvaluationPdfBtn').addEventListener('click', printEvaluationPdf);

  window.addEventListener('beforeunload', () => saveProgress(false));
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = updateVoiceAvailability;
}

function initialise() {
  ensureManualSections();
  renderVocabulary();
  ['pvt','grammar','vocab'].forEach(renderQuiz);
  renderListeningQuestions();
  renderOrderSentence();
  bindEvents();
  updateWordCount();
  updateRanges();
  updateResults();
  updateVoiceAvailability();
  setTimeout(updateVoiceAvailability, 500);
  const raw = storageGet(STORAGE_KEY);
  if (raw) loadProgress(false);
}

document.addEventListener('DOMContentLoaded', initialise);
