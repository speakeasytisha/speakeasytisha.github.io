'use strict';

const STORAGE_KEY = 'marineLesson1ProgressV1';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const state = {
  answers: {},
  ratings: {},
  audioUrl: null
};

const quizzes = {
  diagnostic: [
    { q: 'My father ___ cooking at weekends.', options: ['like', 'likes', 'is like'], answer: 'likes', hint: 'He / she / it takes -s in the present simple.' },
    { q: 'My brothers and ___ are very close.', options: ['me', 'I', 'my'], answer: 'I', hint: 'Use a subject pronoun before the verb: my brothers and I are.' },
    { q: 'We stayed there ___ three weeks.', options: ['during', 'since', 'for'], answer: 'for', hint: 'Use “for” with a duration.' },
    { q: 'Last summer, we ___ a motorbike.', options: ['rent', 'rented', 'have rent'], answer: 'rented', hint: 'A finished past time needs the past simple.' },
    { q: 'It was ___ small island.', options: ['a', 'an', 'the small'], answer: 'a', hint: 'Use “a” before a singular countable noun beginning with a consonant sound.' },
    { q: 'We saw a lot of ___.', options: ['bird', 'birds', 'a birds'], answer: 'birds', hint: 'After “a lot of”, use a plural countable noun here.' },
    { q: 'We went there ___ discover the island.', options: ['for', 'for to', 'to'], answer: 'to', hint: 'Use “to + verb” to express purpose.' },
    { q: 'It was my best ___.', options: ['travel', 'trip', 'voyage'], answer: 'trip', hint: 'A specific holiday experience is usually a “trip”.' }
  ],
  repair: [
    { q: 'Choose the natural sentence.', options: ['There are four people in my family.', 'In my family, there are four.', 'We are four in my family.'], answer: 'There are four people in my family.', hint: 'English normally names the people after “there are”.' },
    { q: 'Choose the correct sentence.', options: ['My mother likes working at sea.', 'My mother like work in the sea.', 'My mother likes work at the sea.'], answer: 'My mother likes working at sea.', hint: 'Like + -ing is natural for activities. “At sea” is the fixed expression.' },
    { q: 'Choose the correct past question.', options: ['Did you enjoyed the trip?', 'Did you enjoy the trip?', 'Do you enjoyed the trip?'], answer: 'Did you enjoy the trip?', hint: 'After “did”, use the base verb.' },
    { q: 'Choose the best sentence.', options: ['We did a scuba diving.', 'We went scuba diving.', 'We made scuba diving.'], answer: 'We went scuba diving.', hint: 'Use “go + activity-ing”: go swimming, go diving.' },
    { q: 'Choose the correct feeling.', options: ['We felt free.', 'We feel freedom.', 'We were feel free.'], answer: 'We felt free.', hint: 'Feel → felt in the past; “free” is the adjective.' },
    { q: 'Choose the natural relationship phrase.', options: ['We love us very much.', 'We very loved.', 'We love each other very much.'], answer: 'We love each other very much.', hint: 'Use “each other” for a reciprocal relationship.' },
    { q: 'Complete: My parents moved away, ___ we see them less often.', options: ['because', 'so', 'although'], answer: 'so', hint: '“So” introduces a result.' },
    { q: 'Complete: ___ I was nervous, I joined the group.', options: ['Although', 'Because', 'Then'], answer: 'Although', hint: '“Although” introduces contrast.' },
    { q: 'Choose the correct plural sentence.', options: ['They are very nice memories.', 'It is very nice memories.', 'They are a very nice memory.'], answer: 'They are very nice memories.', hint: 'Plural noun → plural pronoun and verb.' },
    { q: 'Choose the best purpose phrase.', options: ['I moved to Australia for improve my English.', 'I moved to Australia to improve my English.', 'I moved to Australia for to improve my English.'], answer: 'I moved to Australia to improve my English.', hint: 'Purpose: to + base verb.' }
  ],
  vocab: [
    { q: 'A person who shares your home is a…', options: ['commuter', 'flatmate', 'landlord'], answer: 'flatmate', hint: 'Flatmate = colocataire.' },
    { q: 'Money paid as a rental guarantee is a…', options: ['bond', 'salary', 'receipt'], answer: 'bond', hint: 'In Australia, “bond” is the usual rental term.' },
    { q: 'To become comfortable in a new place means to…', options: ['settle in', 'check out', 'give up'], answer: 'settle in', hint: 'Settle in = s’installer / prendre ses repères.' },
    { q: 'Your regular journey between home and work is your…', options: ['holiday', 'commute', 'outing'], answer: 'commute', hint: 'Commute can be a noun or a verb.' },
    { q: 'A person willing to understand new ideas is…', options: ['open-minded', 'crowded', 'available'], answer: 'open-minded', hint: 'Open-minded = ouvert(e) d’esprit.' },
    { q: 'The times when you can work are your…', options: ['experiences', 'availabilities', 'availability'], answer: 'availability', hint: '“Availability” is generally uncountable in this meaning.' },
    { q: 'To travel easily from place to place means to…', options: ['get around', 'get back', 'get over'], answer: 'get around', hint: 'Get around = se déplacer.' },
    { q: 'Activities in nature are part of an…', options: ['outdoor lifestyle', 'indoor shift', 'office bond'], answer: 'outdoor lifestyle', hint: 'Outdoor lifestyle = mode de vie en plein air.' }
  ],
  reading: [
    { q: 'When is the room available?', options: ['Immediately', 'From 3 September', 'For three weeks'], answer: 'From 3 September', hint: 'Look at the first paragraph.' },
    { q: 'How many people already live in the flat?', options: ['One', 'Two', 'Three'], answer: 'Two', hint: 'Emma and Josh already live there.' },
    { q: 'Why is the flat usually quiet in the evenings?', options: ['They dislike visitors.', 'They both work during the week.', 'The flat is far from the city.'], answer: 'They both work during the week.', hint: 'The reason follows “so”.' },
    { q: 'Which cost is included in the rent?', options: ['Internet', 'Electricity', 'Water'], answer: 'Water', hint: 'The final sentence of paragraph two gives the detail.' },
    { q: 'What kind of flatmate do they probably NOT want?', options: ['Someone independent', 'Someone untidy', 'Someone friendly'], answer: 'Someone untidy', hint: 'This is implied by the qualities they request.' },
    { q: 'Why does Emma ask about Marine’s plans?', options: ['She wants to understand whether Marine fits the household.', 'She wants Marine to organise a market trip.', 'She wants to offer Marine a job.'], answer: 'She wants to understand whether Marine fits the household.', hint: 'Think about Emma’s intention, not only the words.' }
  ],
  listening: [
    { q: 'How long has Chloe been in Brisbane?', options: ['One week', 'Six months', 'One year'], answer: 'Six months', hint: 'Listen to the beginning.' },
    { q: 'What does Chloe recommend organising first?', options: ['Tourist activities', 'Practical things', 'A car'], answer: 'Practical things', hint: 'She names a phone number, transport card and bank account.' },
    { q: 'Why didn’t Chloe rent a car?', options: ['It was too expensive.', 'She cannot drive.', 'Public transport was enough.'], answer: 'Public transport was enough.', hint: 'Listen for “because” or a reason.' },
    { q: 'How did Chloe meet people?', options: ['At work', 'In a walking group', 'Through her flatmate'], answer: 'In a walking group', hint: 'She joined a specific group.' },
    { q: 'How did she feel at first?', options: ['Nervous', 'Bored', 'Confident'], answer: 'Nervous', hint: 'This feeling changes later.' },
    { q: 'What is happening this Saturday?', options: ['A bank appointment', 'A walk near South Bank', 'A flat viewing'], answer: 'A walk near South Bank', hint: 'Listen to the invitation at the end.' }
  ]
};

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderQuiz(key, containerId, scoreId) {
  const container = document.getElementById(containerId);
  const data = quizzes[key];
  if (!container) return;
  container.innerHTML = '';
  data.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'quiz-card';
    card.dataset.quiz = key;
    card.dataset.index = String(index);
    const saved = state.answers[`${key}-${index}`];
    const optionHtml = shuffled(item.options).map(option => {
      const escaped = option.replace(/"/g, '&quot;');
      return `<button type="button" class="option-button" data-option="${escaped}">${option}</button>`;
    }).join('');
    card.innerHTML = `
      <span class="quiz-number">QUESTION ${String(index + 1).padStart(2, '0')}</span>
      <h4>${item.q}</h4>
      <div class="option-list">${optionHtml}</div>
      <div class="feedback"></div>`;
    container.appendChild(card);
    if (saved) applyAnswer(card, key, index, saved, false);
  });
  updateScore(key, scoreId);
}

function applyAnswer(card, key, index, chosen, announce = true) {
  const item = quizzes[key][index];
  const isCorrect = chosen === item.answer;
  state.answers[`${key}-${index}`] = chosen;
  card.classList.remove('correct', 'incorrect');
  card.classList.add(isCorrect ? 'correct' : 'incorrect');
  $$('.option-button', card).forEach(button => {
    button.disabled = true;
    const value = button.dataset.option;
    button.classList.toggle('selected-correct', value === chosen && isCorrect);
    button.classList.toggle('selected-wrong', value === chosen && !isCorrect);
    button.classList.toggle('reveal-correct', value === item.answer && !isCorrect);
  });
  $('.feedback', card).innerHTML = isCorrect
    ? `✓ Correct. ${item.hint}`
    : `✗ The best answer is <strong>${item.answer}</strong>. ${item.hint}`;
  const scoreMap = { diagnostic: 'diagnosticScore', repair: 'repairScore', vocab: 'vocabScore', reading: 'readingScore', listening: 'listeningScore' };
  updateScore(key, scoreMap[key]);
  updateGlobalResults();
  saveProgress(false);
  if (announce) showToast(isCorrect ? 'Correct — well done!' : 'Review the hint and say the correct answer aloud.');
}

function updateScore(key, scoreId) {
  const total = quizzes[key].length;
  let correct = 0;
  quizzes[key].forEach((item, index) => {
    if (state.answers[`${key}-${index}`] === item.answer) correct += 1;
  });
  const el = document.getElementById(scoreId);
  if (el) el.textContent = `${correct} / ${total}`;
}

function getTotals() {
  let correct = 0;
  let answered = 0;
  let total = 0;
  Object.entries(quizzes).forEach(([key, items]) => {
    total += items.length;
    items.forEach((item, index) => {
      const value = state.answers[`${key}-${index}`];
      if (value) answered += 1;
      if (value === item.answer) correct += 1;
    });
  });
  return { correct, answered, total, percent: total ? Math.round(correct / total * 100) : 0 };
}

function assessmentWeight(value) {
  const map = { 'Acquis': 100, 'Partiellement acquis': 72, "En cours d'acquisition": 45, 'Not assessed': 0 };
  return map[value] || 0;
}

function updateGlobalResults() {
  const { correct, answered, total, percent } = getTotals();
  $('#globalScore').textContent = `${percent}%`;
  $('#globalScoreDetail').textContent = `${correct} correct · ${answered}/${total} answered`;
  const speaking = $('#speakingStatus').value;
  const writing = $('#writingStatus').value;
  $('#speakingResult').textContent = speaking;
  $('#writingResult').textContent = writing;
  const assessed = [speaking, writing].filter(v => v !== 'Not assessed');
  const productiveAverage = assessed.length ? assessed.reduce((sum, v) => sum + assessmentWeight(v), 0) / assessed.length : percent;
  const combined = Math.round((percent * .65) + (productiveAverage * .35));
  let label = 'In progress';
  let evaluation = 'The lesson is still in progress. Complete more activities to generate a fuller evaluation.';
  if (answered >= Math.round(total * .55)) {
    if (combined >= 82) {
      label = 'Strong progress';
      evaluation = 'Marine demonstrates strong acquisition of the lesson objectives. Her accuracy is approaching the expected B1 entry level. Continue developing spontaneous speaking and natural vocabulary.';
    } else if (combined >= 65) {
      label = 'Good progress';
      evaluation = 'Marine demonstrates good progress. The main objectives are partially or largely acquired. Continued practice is recommended for past forms, precision words and longer spontaneous answers.';
    } else if (combined >= 45) {
      label = 'Developing';
      evaluation = 'Marine is developing the targeted skills. She can communicate the main message, but needs guided practice to stabilise grammar and use more precise structures.';
    } else {
      label = 'Needs support';
      evaluation = 'The targeted skills require further guided practice. Revisit the key rules, repeat the model sentences and reduce the number of new structures used at one time.';
    }
  }
  $('#progressLabel').textContent = label;
  $('#autoEvaluation').textContent = evaluation;
}

function resetQuiz(key) {
  Object.keys(state.answers).filter(k => k.startsWith(`${key}-`)).forEach(k => delete state.answers[k]);
  const map = {
    diagnostic: ['diagnosticQuiz', 'diagnosticScore'],
    repair: ['repairQuiz', 'repairScore'],
    vocab: ['vocabQuiz', 'vocabScore'],
    reading: ['readingQuiz', 'readingScore'],
    listening: ['listeningQuiz', 'listeningScore']
  };
  renderQuiz(key, ...map[key]);
  updateGlobalResults();
}

function getPreferredVoice(accent) {
  const voices = window.speechSynthesis.getVoices();
  const normalise = value => (value || '').toLowerCase().replace('_', '-');
  const target = normalise(accent);

  // Prefer a true regional voice, especially an Australian en-AU voice.
  return voices.find(voice => normalise(voice.lang) === target)
    || voices.find(voice => normalise(voice.lang).startsWith(target))
    || voices.find(voice => target === 'en-au' && /austral/i.test(voice.name))
    || voices.find(voice => normalise(voice.lang).startsWith('en-'))
    || null;
}

function updateVoiceAvailability() {
  const status = $('#voiceAvailability');
  const accentSelect = $('#voiceAccent');
  if (!status || !accentSelect || !('speechSynthesis' in window)) return;

  const accent = accentSelect.value || 'en-AU';
  const voice = getPreferredVoice(accent);
  const labels = { 'en-AU': 'Australian', 'en-GB': 'British', 'en-US': 'American' };
  const label = labels[accent] || 'English';

  if (voice && (voice.lang || '').toLowerCase().replace('_', '-') === accent.toLowerCase()) {
    status.textContent = `${accent === 'en-AU' ? '🇦🇺' : '🎧'} ${label} English is ready for every listening button. Voice: ${voice.name}.`;
    status.classList.remove('voice-fallback');
  } else if (voice) {
    status.textContent = `⚠️ A regional ${label} voice is not installed on this device. The page will use ${voice.name} (${voice.lang}) as the closest English voice.`;
    status.classList.add('voice-fallback');
  } else {
    status.textContent = `⚠️ No English text-to-speech voice is currently available on this device.`;
    status.classList.add('voice-fallback');
  }

  const playButton = $('#playListening');
  if (playButton) playButton.textContent = accent === 'en-AU' ? '▶ Play Australian audio' : `▶ Play ${label} audio`;
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Speech synthesis is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.trim());
  const accent = $('#voiceAccent')?.value || 'en-AU';
  utterance.voice = getPreferredVoice(accent);
  utterance.lang = accent;
  utterance.rate = Number($('#speechRate')?.value || .92);
  utterance.onstart = () => $('.audio-studio')?.classList.add('audio-playing');
  utterance.onend = () => $('.audio-studio')?.classList.remove('audio-playing');
  utterance.onerror = () => {
    $('.audio-studio')?.classList.remove('audio-playing');
    showToast('The selected voice could not play. Try another accent or check your device voices.');
  };
  window.speechSynthesis.speak(utterance);
}

function buildIntroduction() {
  const place = $('#introPlace').value.trim() || '[your town]';
  const routine = $('#introRoutine').value.trim() || '[describe your daily life]';
  const reason = $('#introReason').value.trim() || '[give your reason]';
  const strength = $('#introStrength').value.trim() || '[name a strength]';
  $('#introOutput').textContent = `Hi, my name is Marine. I currently live in ${place}. In my daily life, I ${routine}. I am planning to move to Australia because ${reason}. One of my strengths is that ${strength}. I am excited about this new chapter, although I know I will need time to settle in.`;
  saveProgress(false);
}

function copyText(text, message = 'Copied!') {
  navigator.clipboard?.writeText(text).then(() => showToast(message)).catch(() => {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    showToast(message);
  });
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function collectFormData() {
  const fields = ['voiceAccent','speechRate','introPlace','introRoutine','introReason','introStrength','introOutput','writingArea','writingStatus','writingComment','speakingStatus','speakingComment','learnerComment','satisfaction','engagementStatus','nextPriority','trainerComment'];
  const values = {};
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) values[id] = 'value' in el ? el.value : el.textContent;
  });
  values.checks = $$('.progress-check').map(cb => cb.checked);
  return values;
}

function applyFormData(values = {}) {
  Object.entries(values).forEach(([id, value]) => {
    if (id === 'checks') return;
    const el = document.getElementById(id);
    if (!el) return;
    if ('value' in el) el.value = value;
    else el.textContent = value;
  });
  if (Array.isArray(values.checks)) {
    $$('.progress-check').forEach((cb, i) => cb.checked = Boolean(values.checks[i]));
  }
  $('#wordCount').textContent = `${wordCount($('#writingArea').value)} words`;
}

function saveProgress(showMessage = true) {
  const payload = { answers: state.answers, ratings: state.ratings, form: collectFormData(), translation: $('#translationToggle').checked };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  if (showMessage) showToast('Progress saved in this browser.');
}

function loadProgress(showMessage = true) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    if (showMessage) showToast('No saved progress found yet.');
    return;
  }
  try {
    const payload = JSON.parse(raw);
    state.answers = payload.answers || {};
    state.ratings = payload.ratings || {};
    applyFormData(payload.form || {});
    $('#translationToggle').checked = payload.translation !== false;
    document.body.classList.toggle('hide-fr', !$('#translationToggle').checked);
    renderAllQuizzes();
    renderRatings();
    updateGlobalResults();
    updateVoiceAvailability();
    if (showMessage) showToast('Saved progress restored.');
  } catch (error) {
    console.error(error);
    showToast('Saved data could not be restored.');
  }
}

function buildReport() {
  const totals = getTotals();
  const ratingLabel = value => value ? `${value}/4` : 'Not selected';
  return `MARINE HOLY — LESSON 1 EVALUATION\nFrom France to Australia\nDate: ${new Date().toLocaleDateString('fr-FR')}\n\nKNOWLEDGE ACTIVITIES\nScore: ${totals.correct}/${totals.total} (${totals.percent}%)\nAnswered: ${totals.answered}/${totals.total}\n\nPRODUCTIVE SKILLS\nSpeaking: ${$('#speakingStatus').value}\nSpeaking feedback: ${$('#speakingComment').value || '—'}\nWriting: ${$('#writingStatus').value}\nWriting feedback: ${$('#writingComment').value || '—'}\n\nLEARNER SELF-EVALUATION\nClear introduction: ${ratingLabel(state.ratings.introduction)}\nPast trip: ${ratingLabel(state.ratings.past)}\nAustralian project: ${ratingLabel(state.ratings.project)}\nConnectors: ${ratingLabel(state.ratings.connectors)}\nSatisfaction: ${$('#satisfaction').value}\nLearner comment: ${$('#learnerComment').value || '—'}\n\nQUALIOPI / TRAINER REVIEW\nAutomatic progress: ${$('#progressLabel').textContent}\nAutomatic evaluation: ${$('#autoEvaluation').textContent}\nEngagement: ${$('#engagementStatus').value}\nNext priority: ${$('#nextPriority').value}\nTrainer comments: ${$('#trainerComment').value || '—'}\n`;
}

function initRatings() {
  $$('.rating').forEach(group => {
    group.innerHTML = '';
    for (let i = 1; i <= 4; i += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '★';
      button.setAttribute('aria-label', `${i} out of 4`);
      button.addEventListener('click', () => {
        state.ratings[group.dataset.rating] = i;
        renderRatings();
        saveProgress(false);
      });
      group.appendChild(button);
    }
  });
  renderRatings();
}

function renderRatings() {
  $$('.rating').forEach(group => {
    const value = state.ratings[group.dataset.rating] || 0;
    $$('button', group).forEach((button, index) => button.classList.toggle('active', index < value));
  });
}

async function initRecorder() {
  const start = $('#startRecord');
  const stop = $('#stopRecord');
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    start.disabled = true;
    $('#recorderStatus').textContent = 'Recording is not supported in this browser.';
    return;
  }
  let recorder;
  let chunks = [];
  start.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.addEventListener('dataavailable', event => chunks.push(event.data));
      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
        state.audioUrl = URL.createObjectURL(blob);
        $('#audioPlayback').src = state.audioUrl;
        $('#audioPlayback').classList.remove('hidden');
        $('#downloadRecording').href = state.audioUrl;
        $('#downloadRecording').classList.remove('hidden');
        stream.getTracks().forEach(track => track.stop());
        $('#recorderStatus').classList.remove('recording');
        $('#recorderStatus').innerHTML = '<span></span>Recording complete — listen back';
      });
      recorder.start();
      start.disabled = true;
      stop.disabled = false;
      $('#recorderStatus').classList.add('recording');
      $('#recorderStatus').innerHTML = '<span></span>Recording in progress…';
    } catch (error) {
      console.error(error);
      showToast('Microphone access was not granted.');
    }
  });
  stop.addEventListener('click', () => {
    if (recorder?.state === 'recording') recorder.stop();
    start.disabled = false;
    stop.disabled = true;
  });
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderAllQuizzes() {
  renderQuiz('diagnostic', 'diagnosticQuiz', 'diagnosticScore');
  renderQuiz('repair', 'repairQuiz', 'repairScore');
  renderQuiz('vocab', 'vocabQuiz', 'vocabScore');
  renderQuiz('reading', 'readingQuiz', 'readingScore');
  renderQuiz('listening', 'listeningQuiz', 'listeningScore');
}

function attachEvents() {
  document.addEventListener('click', event => {
    const option = event.target.closest('.option-button');
    if (option) {
      const card = option.closest('.quiz-card');
      applyAnswer(card, card.dataset.quiz, Number(card.dataset.index), option.dataset.option);
    }
    const speakButton = event.target.closest('[data-speak]');
    if (speakButton) speak(speakButton.dataset.speak);
    const targetButton = event.target.closest('[data-speak-target]');
    if (targetButton) {
      const target = document.getElementById(targetButton.dataset.speakTarget);
      if (target) speak(target.textContent);
    }
    const chip = event.target.closest('.chip-copy');
    if (chip) copyText(chip.dataset.copy, 'Phrase copied.');
  });

  $('#translationToggle').addEventListener('change', event => {
    document.body.classList.toggle('hide-fr', !event.target.checked);
    saveProgress(false);
  });
  $('#saveBtn').addEventListener('click', () => saveProgress(true));
  $('#resumeBtn').addEventListener('click', () => loadProgress(true));
  $('#printBtn').addEventListener('click', () => window.print());
  $('#resetDiagnostic').addEventListener('click', () => resetQuiz('diagnostic'));
  $('#buildIntroBtn').addEventListener('click', buildIntroduction);
  $('#speakIntroBtn').addEventListener('click', () => speak($('#introOutput').textContent));
  $('#copyIntroBtn').addEventListener('click', () => copyText($('#introOutput').textContent));

  $$('.rule-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.rule-tab').forEach(t => t.classList.remove('active'));
    $$('.rule-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  }));

  $$('.vocab-filter').forEach(button => button.addEventListener('click', () => {
    $$('.vocab-filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    $$('.vocab-card').forEach(card => {
      card.hidden = !(button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter);
    });
  }));

  $('#readingTranscriptBtn').addEventListener('click', () => $('#readingSupport').classList.toggle('hidden'));
  $('#toggleListeningTranscript').addEventListener('click', () => $('#listeningTranscript').classList.toggle('hidden'));
  $('#playListening').addEventListener('click', () => speak($('#listeningTranscript').textContent));
  $('#voiceAccent').addEventListener('change', () => { updateVoiceAvailability(); saveProgress(false); });
  $('#stopAudio').addEventListener('click', () => {
    window.speechSynthesis?.cancel();
    $('.audio-studio')?.classList.remove('audio-playing');
  });
  $('#writingArea').addEventListener('input', event => {
    $('#wordCount').textContent = `${wordCount(event.target.value)} words`;
    saveProgress(false);
  });
  $('#copyWritingBtn').addEventListener('click', () => copyText($('#writingArea').value, 'Writing copied.'));
  $('#downloadWritingBtn').addEventListener('click', () => downloadText('marine-lesson-1-writing.txt', $('#writingArea').value));
  ['speakingStatus', 'writingStatus'].forEach(id => document.getElementById(id).addEventListener('change', () => { updateGlobalResults(); saveProgress(false); }));
  $$('input, textarea, select').forEach(el => {
    if (!['translationToggle', 'writingArea', 'speakingStatus', 'writingStatus'].includes(el.id)) {
      el.addEventListener('change', () => saveProgress(false));
    }
  });
  $('#copyReportBtn').addEventListener('click', () => copyText(buildReport(), 'Evaluation copied.'));
  $('#downloadReportBtn').addEventListener('click', () => downloadText('marine-lesson-1-evaluation.txt', buildReport()));
  $('#resetAllBtn').addEventListener('click', () => {
    if (!window.confirm('Reset all answers and saved progress for this lesson?')) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAllQuizzes();
  initRatings();
  attachEvents();
  initRecorder();
  if (localStorage.getItem(STORAGE_KEY)) $('#saveNote').textContent = 'Saved progress found. Use “Resume saved work” at the top to restore it.';
  updateGlobalResults();
  updateVoiceAvailability();
  if ('speechSynthesis' in window) window.speechSynthesis.addEventListener?.('voiceschanged', updateVoiceAvailability);
});
