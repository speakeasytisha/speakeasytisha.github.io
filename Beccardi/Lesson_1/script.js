'use strict';

const state = {
  sectionIndex: 0,
  timerSeconds: 60 * 60,
  timerInterval: null,
  questionIndex: 0,
  answers: {},
  priorities: [],
  objectives: ['fluency','keywords','everyday','professional','graphs','listening','accuracy','october'],
  learning: ['speaking'],
  continuity: 'yes',
  confidence: 5
};

const objectiveLabels = {
  fluency: { en: 'speaking more fluently', fr: 'parler avec plus de fluidité' },
  keywords: { en: 'building useful key phrases', fr: 'développer des phrases-clés utiles' },
  everyday: { en: 'everyday conversation', fr: 'la conversation quotidienne' },
  professional: { en: 'professional exchanges', fr: 'les échanges professionnels' },
  graphs: { en: 'presenting graphs and data', fr: 'la présentation de graphiques et de données' },
  listening: { en: 'catching precise details when listening', fr: "le repérage d'informations précises à l'oral" },
  accuracy: { en: 'more accurate grammar and sentence structure', fr: 'une expression plus précise et mieux structurée' },
  october: { en: 'preparing for the October meeting with American contacts', fr: "la préparation de la réunion d'octobre avec des interlocuteurs américains" }
};

const questions = [
  {
    level: 'Your new role · Votre nouveau poste',
    q: 'What will change in your new position?',
    fr: "Qu'est-ce qui va changer dans votre nouveau poste ?",
    support: 'new responsibilities · more international contacts · meetings · presentations · English more often',
    model: 'In my new position, I will have more contact with international colleagues and I expect to use English more often. I may also need to explain technical information and present data during meetings.'
  },
  {
    level: 'Your English · Votre anglais',
    q: 'When do you notice that you start searching for words?',
    fr: 'À quel moment remarquez-vous que vous commencez à chercher vos mots ?',
    support: 'unexpected question · small talk · explaining an idea · speaking for a long time · unfamiliar vocabulary',
    model: 'I usually start searching for words when I have to answer spontaneously or explain an idea in detail. I know what I want to say, but I need more automatic phrases to keep speaking.'
  },
  {
    level: 'Mexico · Expérience récente',
    q: 'What did your trip to Mexico teach you about the English you need?',
    fr: "Qu'est-ce que votre voyage au Mexique vous a appris sur l'anglais dont vous avez besoin ?",
    support: 'business trip · international people · technical work · everyday conversation · confidence',
    model: 'My trip to Mexico showed me that I can communicate about technical subjects, but everyday conversation can be more difficult. I would like to react more naturally and find the right words more quickly.'
  },
  {
    level: 'October · Réunion américaine',
    q: 'What would make you feel successful in the October meeting?',
    fr: "Qu'est-ce qui vous ferait dire que la réunion d'octobre s'est bien passée ?",
    support: 'present clearly · answer questions · understand accents · explain a graph · feel comfortable',
    model: 'I would feel successful if I could present my information clearly, explain a graph without searching for every word, understand the main questions and answer with confidence.'
  },
  {
    level: 'Everyday English · Conversation',
    q: 'What kinds of everyday conversations would you like to handle more naturally?',
    fr: 'Quels types de conversations du quotidien aimeriez-vous gérer plus naturellement ?',
    support: 'travel · meals · colleagues · small talk · asking questions · telling a story',
    model: 'I would like to feel more comfortable with small talk, travel situations and informal conversations with colleagues. I want to be able to keep the conversation going even when I do not know every word.'
  }
];

const sections = [...document.querySelectorAll('.lesson-section')];
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const stepDots = document.getElementById('stepDots');
const toast = document.getElementById('toast');

function init() {
  createStepDots();
  bindNavigation();
  bindHeader();
  bindTimer();
  bindContinuity();
  bindObjectives();
  bindLearning();
  buildQuestionRail();
  renderQuestion(0);
  bindQuestions();
  bindSpeechButtons();
  bindQuizzes();
  bindGraphBuilder();
  bindListening();
  bindEvaluation();
  bindDownloads();
  bindSaveReset();
  setDateStamp();
  updateMicroStrategy();
  updateGraphPreview();
  renderPriorityChips();
  updateObjectiveSummary();
  updateRoadmap();
  restoreSession();
  updateProgress();
}

function createStepDots() {
  stepDots.innerHTML = '';
  sections.forEach((section, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Aller à ${section.dataset.title}`);
    button.title = section.dataset.title;
    button.addEventListener('click', () => showSection(index));
    stepDots.appendChild(button);
  });
}

function bindNavigation() {
  document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => showSection(state.sectionIndex + 1)));
  document.querySelectorAll('[data-prev]').forEach(btn => btn.addEventListener('click', () => showSection(state.sectionIndex - 1)));
}

function showSection(index) {
  state.sectionIndex = Math.max(0, Math.min(sections.length - 1, index));
  sections.forEach((section, i) => section.classList.toggle('active', i === state.sectionIndex));
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
  const section = sections[state.sectionIndex];
  progressLabel.textContent = section.dataset.title || '';
  const pct = sections.length <= 1 ? 100 : (state.sectionIndex / (sections.length - 1)) * 100;
  progressBar.style.width = `${pct}%`;
  [...stepDots.children].forEach((dot, i) => dot.classList.toggle('active', i === state.sectionIndex));
}

function bindHeader() {
  const toggle = document.getElementById('translationToggle');
  toggle.addEventListener('click', () => {
    const visible = document.body.classList.toggle('show-fr');
    toggle.classList.toggle('active', visible);
    toggle.setAttribute('aria-pressed', String(visible));
    toggle.lastElementChild.textContent = visible ? 'Traductions visibles' : 'Afficher les traductions';
  });
}

function bindTimer() {
  document.getElementById('timerStart').addEventListener('click', () => {
    if (state.timerInterval) return;
    state.timerInterval = window.setInterval(() => {
      state.timerSeconds = Math.max(0, state.timerSeconds - 1);
      updateTimer();
      if (state.timerSeconds === 0) pauseTimer();
    }, 1000);
  });
  document.getElementById('timerPause').addEventListener('click', pauseTimer);
  document.getElementById('timerReset').addEventListener('click', () => { pauseTimer(); state.timerSeconds = 60 * 60; updateTimer(); });
  updateTimer();
}

function pauseTimer() {
  if (state.timerInterval) window.clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimer() {
  const m = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
  const s = (state.timerSeconds % 60).toString().padStart(2, '0');
  document.getElementById('sessionTimer').textContent = `${m}:${s}`;
}

function bindSpeechButtons() {
  document.addEventListener('click', event => {
    const button = event.target.closest('.speak-button');
    if (!button) return;
    if (button.dataset.speakTarget) {
      const target = document.getElementById(button.dataset.speakTarget);
      if (target) speak(target.textContent.trim());
      return;
    }
    if (button.dataset.speak) speak(button.dataset.speak);
  });
}

function speak(text) {
  if (!('speechSynthesis' in window)) { showToast("La synthèse vocale n'est pas disponible dans ce navigateur."); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const lang = document.getElementById('accentSelect').value || 'en-US';
  utterance.lang = lang;
  const voices = window.speechSynthesis.getVoices();
  const exact = voices.find(v => v.lang && v.lang.toLowerCase() === lang.toLowerCase());
  const fallback = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
  if (exact || fallback) utterance.voice = exact || fallback;
  utterance.rate = .95;
  window.speechSynthesis.speak(utterance);
}

function bindContinuity() {
  const wrap = document.getElementById('continuityChoice');
  wrap.addEventListener('click', event => {
    const btn = event.target.closest('[data-single]');
    if (!btn) return;
    [...wrap.querySelectorAll('[data-single]')].forEach(b => b.classList.remove('selected','preselected'));
    btn.classList.add('selected');
    state.continuity = btn.dataset.single;
  });
}

function bindObjectives() {
  document.getElementById('objectiveChoices').addEventListener('click', event => {
    const card = event.target.closest('[data-objective]');
    if (!card) return;
    const value = card.dataset.objective;
    if (state.objectives.includes(value)) {
      state.objectives = state.objectives.filter(x => x !== value);
      state.priorities = state.priorities.filter(x => x !== value);
      card.classList.remove('selected');
    } else {
      state.objectives.push(value);
      card.classList.add('selected');
    }
    renderPriorityChips();
    updateObjectiveSummary();
    updateRoadmap();
  });

  document.getElementById('copyObjectives').addEventListener('click', () => copyText(buildObjectiveText(), 'Objectifs copiés.'));
  document.getElementById('downloadObjectives').addEventListener('click', () => downloadText('Thomas-Beccardi-objectifs-formation.txt', buildObjectiveText()));
}

function renderPriorityChips() {
  const host = document.getElementById('priorityChips');
  host.innerHTML = '';
  state.objectives.forEach(value => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.priority = value;
    btn.className = state.priorities.includes(value) ? 'priority-chip active' : 'priority-chip';
    btn.innerHTML = `<span>${state.priorities.includes(value) ? state.priorities.indexOf(value) + 1 : '+'}</span>${objectiveLabels[value].fr}`;
    btn.addEventListener('click', () => togglePriority(value));
    host.appendChild(btn);
  });
}

function togglePriority(value) {
  if (state.priorities.includes(value)) state.priorities = state.priorities.filter(x => x !== value);
  else if (state.priorities.length < 3) state.priorities.push(value);
  else { showToast('Choisissez trois priorités maximum.'); return; }
  renderPriorityChips();
  updateObjectiveSummary();
  updateRoadmap();
}

function updateObjectiveSummary() {
  const box = document.getElementById('objectiveSummary');
  const p = box.querySelector('p');
  if (!state.priorities.length) p.textContent = 'Sélectionnez trois priorités pour créer votre cap de travail.';
  else p.textContent = `Priorités ${state.priorities.length}/3 : ${state.priorities.map(x => objectiveLabels[x].fr).join(' · ')}`;
}

function buildObjectiveText() {
  const selected = state.objectives.map(x => `- ${objectiveLabels[x].fr}`).join('\n');
  const priorities = state.priorities.length ? state.priorities.map((x,i) => `${i+1}. ${objectiveLabels[x].fr}`).join('\n') : 'À confirmer pendant la séance.';
  return `THOMAS BECCARDI — OBJECTIFS DE FORMATION\n\nObjectifs validés :\n${selected}\n\nTop 3 priorités :\n${priorities}\n\nÉchéance : réunion avec des interlocuteurs américains en octobre.\nRythme envisagé : ${document.getElementById('rhythmSelect').value}.`;
}

function bindLearning() {
  document.getElementById('learningChoices').addEventListener('click', event => {
    const card = event.target.closest('[data-learning]');
    if (!card) return;
    const value = card.dataset.learning;
    if (state.learning.includes(value)) { state.learning = state.learning.filter(x => x !== value); card.classList.remove('selected'); }
    else { state.learning.push(value); card.classList.add('selected'); }
    updateRoadmap();
  });
  document.getElementById('microPractice').addEventListener('change', updateMicroStrategy);
  document.getElementById('rhythmSelect').addEventListener('change', () => { document.getElementById('cardRhythm').textContent = document.getElementById('rhythmSelect').value; updateRoadmap(); });
}

function updateMicroStrategy() {
  const value = document.getElementById('microPractice').value;
  const map = {
    '5': '1 min listen · 2 min speak · 2 min repeat',
    '10': '3 min listen · 4 min speak · 3 min repeat',
    '15': '4 min listen · 6 min speak · 5 min repeat',
    '20': '5 min listen · 10 min speak · 5 min repeat'
  };
  document.getElementById('microStrategy').innerHTML = `<strong>${value}-minute strategy</strong><span>${map[value]}</span>`;
  updateRoadmap();
}

function buildQuestionRail() {
  const rail = document.getElementById('questionRail');
  rail.innerHTML = '';
  questions.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<span>${String(index+1).padStart(2,'0')}</span><strong>${item.level.split(' · ')[0]}</strong>`;
    btn.addEventListener('click', () => renderQuestion(index));
    rail.appendChild(btn);
  });
}

function renderQuestion(index) {
  state.questionIndex = Math.max(0, Math.min(questions.length - 1, index));
  const item = questions[state.questionIndex];
  document.getElementById('questionLevel').textContent = item.level;
  document.getElementById('questionCounter').textContent = `${state.questionIndex + 1} / ${questions.length}`;
  document.getElementById('currentQuestion').textContent = item.q;
  document.getElementById('questionTranslation').textContent = item.fr;
  document.getElementById('supportBox').innerHTML = `<strong>Key words · Mots-clés</strong><p>${item.support}</p>`;
  document.getElementById('modelBox').innerHTML = `<strong>Possible answer · Réponse possible</strong><p>${item.model}</p>`;
  document.getElementById('supportBox').classList.add('hidden');
  document.getElementById('modelBox').classList.add('hidden');
  document.getElementById('conversationAnswer').value = state.answers[state.questionIndex] || '';
  document.getElementById('answerSaved').textContent = '';
  [...document.getElementById('questionRail').children].forEach((btn,i) => btn.classList.toggle('active', i === state.questionIndex));
}

function bindQuestions() {
  document.getElementById('previousQuestion').addEventListener('click', () => renderQuestion(state.questionIndex - 1));
  document.getElementById('nextQuestion').addEventListener('click', () => renderQuestion(state.questionIndex + 1));
  document.getElementById('showSupport').addEventListener('click', () => document.getElementById('supportBox').classList.toggle('hidden'));
  document.getElementById('showModel').addEventListener('click', () => document.getElementById('modelBox').classList.toggle('hidden'));
  document.getElementById('hearQuestion').addEventListener('click', () => speak(questions[state.questionIndex].q));
  document.getElementById('hearAnswer').addEventListener('click', () => speak(questions[state.questionIndex].model));
  document.getElementById('hearBoth').addEventListener('click', () => speak(`${questions[state.questionIndex].q} ... ${questions[state.questionIndex].model}`));
  document.getElementById('saveAnswer').addEventListener('click', () => {
    state.answers[state.questionIndex] = document.getElementById('conversationAnswer').value.trim();
    document.getElementById('answerSaved').textContent = 'Réponse enregistrée pour cette séance.';
    showToast('Réponse enregistrée.');
  });
}

function bindQuizzes() {
  document.querySelectorAll('.instant-quiz').forEach(quiz => {
    quiz.addEventListener('click', event => {
      const btn = event.target.closest('button[data-answer]');
      if (!btn) return;
      const item = btn.closest('.quiz-item');
      const correct = item.dataset.correct;
      item.querySelectorAll('button').forEach(b => b.classList.remove('is-correct','is-wrong'));
      const feedback = item.querySelector('.quiz-feedback');
      if (btn.dataset.answer === correct) {
        btn.classList.add('is-correct');
        feedback.textContent = '✓ Correct — good choice.';
        feedback.className = 'quiz-feedback correct';
      } else {
        btn.classList.add('is-wrong');
        const right = item.querySelector(`button[data-answer="${correct}"]`);
        if (right) right.classList.add('is-correct');
        feedback.textContent = 'Not quite — look at the highlighted answer and say it aloud.';
        feedback.className = 'quiz-feedback wrong';
      }
    });
  });
}

function bindGraphBuilder() {
  document.getElementById('graphBuilder').addEventListener('change', updateGraphPreview);
  document.getElementById('speakGraphPreview').addEventListener('click', () => speak(document.getElementById('graphPreview').textContent));
  document.getElementById('copyGraphPreview').addEventListener('click', () => copyText(document.getElementById('graphPreview').textContent, 'Commentaire copié.'));
}

function updateGraphPreview() {
  const parts = [...document.querySelectorAll('#graphBuilder select')].map(select => select.value);
  document.getElementById('graphPreview').textContent = parts.join(' ');
}

function bindListening() {
  const text = 'Good morning, Thomas. Just a quick update before our next project review. The latest figures show an eighteen percent improvement compared with last month. Our next review will take place on Thursday afternoon. Please send the updated figures before the meeting so that we can include them in the presentation.';
  document.getElementById('playListening').addEventListener('click', () => speak(text));
}

function bindEvaluation() {
  const slider = document.getElementById('confidenceSlider');
  slider.addEventListener('input', () => {
    state.confidence = Number(slider.value);
    document.getElementById('confidenceValue').textContent = `${slider.value} / 10`;
    updateRoadmap();
  });
  document.getElementById('copyEvaluation').addEventListener('click', () => copyText(buildEvaluationText(), 'Bilan copié.'));
  document.getElementById('downloadEvaluation').addEventListener('click', () => downloadText('Thomas-Beccardi-Lecon-1-bilan.txt', buildEvaluationText()));
}

function buildEvaluationText() {
  return `BILAN DE SÉANCE — THOMAS BECCARDI — LEÇON 1\n\nConfiance : ${document.getElementById('confidenceSlider').value}/10\n\nLe plus utile aujourd'hui :\n${document.getElementById('likedInput').value.trim() || 'Non renseigné'}\n\nÀ travailler davantage au prochain cours :\n${document.getElementById('nextInput').value.trim() || 'Non renseigné'}\n\nTop priorités :\n${state.priorities.length ? state.priorities.map((x,i)=>`${i+1}. ${objectiveLabels[x].fr}`).join('\n') : 'À confirmer'}\n\nRythme : ${document.getElementById('rhythmSelect').value}`;
}

function updateRoadmap() {
  const prioritiesEn = state.priorities.length ? joinNatural(state.priorities.map(x => objectiveLabels[x].en)) : 'speaking more fluently, building useful key phrases and preparing for my October meeting';
  const learning = state.learning.length ? joinNatural(state.learning.map(x => ({speaking:'speaking practice',listening:'listening practice',visual:'visual support',practice:'real-life simulations'}[x]))) : 'a balanced mix of speaking, listening and practical tasks';
  const minutes = document.getElementById('microPractice') ? document.getElementById('microPractice').value : '10';
  const rhythm = document.getElementById('rhythmSelect') ? document.getElementById('rhythmSelect').value : '2 × 1 hour per week';
  const text = `My English training is now focused on real situations that matter to me. My main priorities are ${prioritiesEn}. I will use ${learning} to make useful English more automatic. When I search for a word, I will use fluency strategies instead of stopping completely. I will learn to present graphs with a simple structure: introduce the graph, describe the overall trend, highlight a key detail and explain the main takeaway. I will also train my listening so that I can catch precise information such as dates, figures and next actions. My current working rhythm is ${rhythm}, with about ${minutes} minutes of short practice between sessions. My short-term goal is to feel more comfortable and effective in my meeting with American contacts in October.`;
  const field = document.getElementById('roadmapText');
  if (field && !field.dataset.edited) field.value = text;
  const cardRhythm = document.getElementById('cardRhythm');
  if (cardRhythm && document.getElementById('rhythmSelect')) cardRhythm.textContent = document.getElementById('rhythmSelect').value;
}

function bindDownloads() {
  document.getElementById('roadmapText').addEventListener('input', event => event.target.dataset.edited = 'true');
  document.getElementById('refreshRoadmap').addEventListener('click', () => { document.getElementById('roadmapText').dataset.edited = ''; updateRoadmap(); showToast('Plan mis à jour.'); });
  document.getElementById('hearRoadmap').addEventListener('click', () => speak(document.getElementById('roadmapText').value));
  document.getElementById('copyRoadmap').addEventListener('click', () => copyText(document.getElementById('roadmapText').value, 'Plan copié.'));
  document.getElementById('downloadRoadmap').addEventListener('click', () => downloadText('Thomas-Beccardi-Lecon-1-plan-de-travail.txt', document.getElementById('roadmapText').value));
}

function bindSaveReset() {
  document.getElementById('saveSession').addEventListener('click', saveSession);
  document.getElementById('resetSession').addEventListener('click', () => {
    if (!window.confirm('Réinitialiser toutes les réponses de cette leçon ?')) return;
    localStorage.removeItem('cflThomasLesson1Official');
    window.location.reload();
  });
}

function saveSession() {
  const data = {
    objectives: state.objectives,
    priorities: state.priorities,
    learning: state.learning,
    continuity: state.continuity,
    continuityNote: document.getElementById('continuityNote').value,
    organisationChecks: [...document.querySelectorAll('#organisationChecks input:checked')].map(x => x.value),
    rhythm: document.getElementById('rhythmSelect').value,
    microPractice: document.getElementById('microPractice').value,
    answers: state.answers,
    mexicoCues: document.getElementById('mexicoCues').value,
    graphPreview: document.getElementById('graphPreview').textContent,
    confidence: document.getElementById('confidenceSlider').value,
    liked: document.getElementById('likedInput').value,
    next: document.getElementById('nextInput').value,
    roadmap: document.getElementById('roadmapText').value
  };
  try {
    localStorage.setItem('cflThomasLesson1Official', JSON.stringify(data));
    document.getElementById('saveStatus').textContent = 'Séance enregistrée dans ce navigateur.';
    showToast('Séance enregistrée.');
  } catch (e) {
    document.getElementById('saveStatus').textContent = "L'enregistrement local n'est pas disponible.";
  }
}

function restoreSession() {
  let data;
  try { data = JSON.parse(localStorage.getItem('cflThomasLesson1Official') || 'null'); } catch (e) { data = null; }
  if (!data) return;
  if (Array.isArray(data.objectives)) state.objectives = data.objectives;
  if (Array.isArray(data.priorities)) state.priorities = data.priorities.slice(0,3);
  if (Array.isArray(data.learning)) state.learning = data.learning;
  if (data.continuity) state.continuity = data.continuity;
  if (data.answers) state.answers = data.answers;

  document.querySelectorAll('[data-objective]').forEach(card => card.classList.toggle('selected', state.objectives.includes(card.dataset.objective)));
  document.querySelectorAll('[data-learning]').forEach(card => card.classList.toggle('selected', state.learning.includes(card.dataset.learning)));
  const continuityWrap = document.getElementById('continuityChoice');
  continuityWrap.querySelectorAll('[data-single]').forEach(btn => btn.classList.toggle('selected', btn.dataset.single === state.continuity));
  if (data.continuityNote) document.getElementById('continuityNote').value = data.continuityNote;
  if (Array.isArray(data.organisationChecks)) document.querySelectorAll('#organisationChecks input').forEach(x => x.checked = data.organisationChecks.includes(x.value));
  if (data.rhythm) document.getElementById('rhythmSelect').value = data.rhythm;
  if (data.microPractice) document.getElementById('microPractice').value = data.microPractice;
  if (data.mexicoCues) document.getElementById('mexicoCues').value = data.mexicoCues;
  if (data.confidence) { document.getElementById('confidenceSlider').value = data.confidence; document.getElementById('confidenceValue').textContent = `${data.confidence} / 10`; state.confidence = Number(data.confidence); }
  if (data.liked) document.getElementById('likedInput').value = data.liked;
  if (data.next) document.getElementById('nextInput').value = data.next;
  if (data.roadmap) { document.getElementById('roadmapText').value = data.roadmap; document.getElementById('roadmapText').dataset.edited = 'true'; }

  updateMicroStrategy();
  renderPriorityChips();
  updateObjectiveSummary();
  renderQuestion(state.questionIndex);
  updateRoadmap();
  document.getElementById('saveStatus').textContent = 'Données précédentes restaurées.';
}

function setDateStamp() {
  document.getElementById('dateStamp').textContent = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date());
}

function joinNatural(items) {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0,-1).join(', ')}, and ${items[items.length-1]}`;
}

async function copyText(text, success) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(success || 'Copié.');
  } catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); showToast(success || 'Copié.');
  }
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast('Fichier téléchargé.');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

document.addEventListener('DOMContentLoaded', init);
