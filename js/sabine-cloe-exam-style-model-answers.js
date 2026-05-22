const oralTasks = [
  {
    id: 'o1',
    mode: 'oral',
    levels: ['A1', 'A2'],
    scenario: 'client',
    badge: 'Oral · Part 1',
    title: 'Introduce yourself to a client on the phone',
    prompt: 'You answer the phone. Introduce yourself politely and explain your role as a wedding planner.',
    fr: 'Vous répondez au téléphone. Présentez-vous poliment et expliquez votre rôle comme wedding planner.',
    keywords: ['Hello', 'this is Sabine', 'wedding planner', 'how can I help you?', 'today', 'event'],
    frame: ['Greet the client.', 'Say your name.', 'Say your job.', 'Offer help.'],
    model: '<p><strong>Hello, this is Sabine calling.</strong> I am the wedding planner for your event. I am calling to help you with the next steps for the wedding. How can I help you today?</p>'
  },
  {
    id: 'o2',
    mode: 'oral',
    levels: ['A2', 'B1'],
    scenario: 'timeline',
    badge: 'Oral · Part 2',
    title: 'Explain the wedding day timeline',
    prompt: 'Explain the order of the day from the ceremony to dinner in simple, clear English.',
    fr: 'Expliquez l’ordre de la journée, de la cérémonie au dîner, en anglais simple et clair.',
    keywords: ['first', 'then', 'after that', 'guests', 'ceremony', 'cocktail', 'dinner'],
    frame: ['Start with the ceremony.', 'Explain the next steps.', 'Use linking words.', 'Finish with a reassuring sentence.'],
    model: '<p>First, the guests arrive at the venue. Then the ceremony starts at 3 p.m. After that, we have the cocktail reception in the garden. Later, the guests move to the dining room for dinner. <strong>Everything will be ready on time.</strong></p>'
  },
  {
    id: 'o3',
    mode: 'oral',
    levels: ['A2', 'B1', 'B2'],
    scenario: 'supplier',
    badge: 'Oral · Part 2',
    title: 'Call a supplier about a delivery problem',
    prompt: 'A delivery is late. Call the supplier, explain the issue, and ask for a quick solution politely.',
    fr: 'Une livraison est en retard. Appelez le fournisseur, expliquez le problème et demandez une solution rapide poliment.',
    keywords: ['delivery', 'late', 'chairs', 'today', 'please', 'confirm', 'as soon as possible'],
    frame: ['Introduce yourself.', 'State the problem.', 'Ask for confirmation.', 'End politely.'],
    model: '<p>Hello, this is Sabine from Ceremonie Story. I am calling because the chair delivery is late, and we need the chairs at the venue today. <strong>Could you please confirm the new delivery time as soon as possible?</strong> Thank you very much for your help.</p>'
  },
  {
    id: 'o4',
    mode: 'oral',
    levels: ['B1', 'B2'],
    scenario: 'venue',
    badge: 'Oral · Part 3',
    title: 'Discuss a venue meeting',
    prompt: 'Speak to the venue manager about guest numbers, the room layout, and the final schedule.',
    fr: 'Parlez avec le responsable du lieu au sujet du nombre d’invités, de l’agencement de la salle et du planning final.',
    keywords: ['guest count', 'layout', 'schedule', 'confirm', 'before Thursday', 'final details'],
    frame: ['Open the meeting politely.', 'Explain the three key points.', 'Ask one clear question.', 'Close professionally.'],
    model: '<p>Hi, how are you? Fine, thank you. I would like to review three points today: the final guest count, the room layout, and the schedule for the reception. At the moment, we expect 82 guests, but I will confirm the final number before Thursday evening. <strong>Could we also check the layout for the head table?</strong> Thank you for your time today.</p>'
  }
];

const writingTasks = [
  {
    id: 'w1',
    mode: 'writing',
    levels: ['A1', 'A2'],
    scenario: 'client',
    badge: 'Writing · Task 1',
    title: 'Write a short confirmation email',
    prompt: 'Write to a client to confirm the date and time of a venue meeting.',
    fr: 'Écrivez à un client pour confirmer la date et l’heure d’une réunion au lieu de réception.',
    keywords: ['subject', 'dear', 'confirm', 'meeting', 'date', 'time', 'kind regards'],
    frame: ['Write a simple subject line.', 'Greet the client politely.', 'Confirm the date and time.', 'Finish politely.'],
    model: '<p><strong>Subject:</strong> Venue meeting confirmation</p><p>Dear Mr. and Mrs. Martin,</p><p>I am writing to confirm our venue meeting on Friday at 4:00 p.m. We will review the final details for your wedding.</p><p>Please let me know if this time is still convenient for you.</p><p>Kind regards,<br>Sabine</p>'
  },
  {
    id: 'w2',
    mode: 'writing',
    levels: ['A2', 'B1'],
    scenario: 'timeline',
    badge: 'Writing · Task 2',
    title: 'Write about the wedding day schedule',
    prompt: 'Write a clear email to explain the order of the wedding day to the couple.',
    fr: 'Rédigez un e-mail clair pour expliquer l’ordre de la journée de mariage au couple.',
    keywords: ['first', 'then', 'after that', 'ceremony', 'cocktail', 'dinner', 'schedule'],
    frame: ['Open politely.', 'Explain the order clearly.', 'Use sequence words.', 'End with reassurance.'],
    model: '<p><strong>Subject:</strong> Wedding day schedule</p><p>Dear Claire and Thomas,</p><p>I am writing to confirm the schedule for your wedding day. First, guests will arrive at 2:30 p.m. Then the ceremony will begin at 3:00 p.m. After that, the cocktail reception will take place in the garden. Dinner will start at 7:00 p.m.</p><p>Everything is organised, and I will be there to guide each step of the day.</p><p>Best regards,<br>Sabine</p>'
  },
  {
    id: 'w3',
    mode: 'writing',
    levels: ['A2', 'B1', 'B2'],
    scenario: 'supplier',
    badge: 'Writing · Task 3',
    title: 'Reply to a client about guest count',
    prompt: 'The client wants to confirm the guest count before the venue meeting. Reply naturally and politely.',
    fr: 'Le client souhaite confirmer le nombre d’invités avant la réunion avec le lieu. Répondez naturellement et poliment.',
    keywords: ['guest count', 'venue meeting', 'confirm', 'final changes', 'Thursday evening'],
    frame: ['Thank the client.', 'Acknowledge the request.', 'Explain what you need.', 'Close politely.'],
    model: '<p><strong>Subject:</strong> Final guest count before the venue meeting</p><p>Dear Julie and Marc,</p><p>Thank you for your message. I understand that you would like to confirm the guest count before the venue meeting. That is absolutely fine.</p><p><strong>Could you please send me any final changes to the guest list by Thursday evening?</strong> I will then confirm the final number with the venue before our meeting.</p><p>Kind regards,<br>Sabine</p>'
  },
  {
    id: 'w4',
    mode: 'writing',
    levels: ['B1', 'B2'],
    scenario: 'venue',
    badge: 'Writing · Task 4',
    title: 'Write about a problem and a solution',
    prompt: 'There is a risk of rain for the outdoor ceremony. Write to the couple and explain the backup plan.',
    fr: 'Il y a un risque de pluie pour la cérémonie extérieure. Écrivez au couple et expliquez le plan B.',
    keywords: ['weather', 'rain', 'ceremony', 'backup plan', 'move inside', 'ready'],
    frame: ['Mention the situation calmly.', 'Explain the solution clearly.', 'Reassure the client.', 'Close warmly.'],
    model: '<p><strong>Subject:</strong> Ceremony backup plan</p><p>Dear Emma and Lucas,</p><p>I am writing because the weather forecast now shows a possibility of rain on Saturday afternoon. However, please do not worry. We have a backup plan ready.</p><p>If necessary, we will move the ceremony inside the main reception room. The team will prepare the room in advance, and I will coordinate everything on site.</p><p>Everything is under control, and I will keep you informed.</p><p>Warm regards,<br>Sabine</p>'
  }
];

const allTasks = [...oralTasks, ...writingTasks];

const state = {
  mode: 'oral',
  level: 'AUTO',
  scenario: 'all',
  showFrench: true,
  showKeywords: true,
  autoModel: false,
  secondsLeft: 0,
  timerId: null,
  paused: false
};

const mount = document.getElementById('tasksMount');
const template = document.getElementById('taskTemplate');
const progressLabel = document.getElementById('progressLabel');
const focusLabel = document.getElementById('focusLabel');
const levelLabel = document.getElementById('levelLabel');
const timerLabel = document.getElementById('timerLabel');
const scenarioSelect = document.getElementById('scenarioSelect');
const frToggle = document.getElementById('frToggle');
const modelToggle = document.getElementById('modelToggle');
const keywordsToggle = document.getElementById('keywordsToggle');

function getVisibleTasks() {
  let tasks = allTasks.filter(task => {
    const modeMatch = state.mode === 'mixed' ? true : task.mode === state.mode;
    const levelMatch = state.level === 'AUTO' ? true : task.levels.includes(state.level);
    const scenarioMatch = state.scenario === 'all' ? true : task.scenario === state.scenario;
    return modeMatch && levelMatch && scenarioMatch;
  });

  if (state.mode === 'mixed') {
    const oral = tasks.filter(t => t.mode === 'oral');
    const writing = tasks.filter(t => t.mode === 'writing');
    tasks = [...oral, ...writing];
  }

  return tasks;
}

function renderTasks() {
  mount.innerHTML = '';
  const tasks = getVisibleTasks();
  const total = tasks.length;
  progressLabel.textContent = total ? `Task 1 / ${total}` : 'No task';
  focusLabel.textContent = state.mode === 'mixed' ? 'Mixed practice' : (state.mode === 'oral' ? 'Oral interview' : 'Writing');
  levelLabel.textContent = state.level;

  document.body.classList.toggle('scp-hide-fr', !state.showFrench);
  document.body.classList.toggle('scp-hide-keywords', !state.showKeywords);

  tasks.forEach(task => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.mode = task.mode;
    node.dataset.levels = task.levels.join(',');
    node.dataset.scenario = task.scenario;

    node.querySelector('.scp-task-badge').textContent = task.badge;
    node.querySelector('.scp-task-title').textContent = task.title;
    node.querySelector('.scp-task-level').textContent = task.levels.join(' · ');
    node.querySelector('.scp-task-prompt').textContent = task.prompt;
    node.querySelector('.scp-fr-line').textContent = `FR: ${task.fr}`;

    const keywordsList = node.querySelector('.scp-keywords');
    task.keywords.forEach(word => {
      const li = document.createElement('li');
      li.textContent = word;
      keywordsList.appendChild(li);
    });

    const frameList = node.querySelector('.scp-frame');
    task.frame.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      frameList.appendChild(li);
    });

    const toggle = node.querySelector('.scp-model-toggle');
    const panel = node.querySelector('.scp-model-panel');
    const answer = node.querySelector('.scp-model-answer');
    answer.innerHTML = task.model;

    if (state.autoModel) {
      panel.hidden = false;
      toggle.textContent = 'Hide model answer';
    }

    toggle.addEventListener('click', () => {
      const isHidden = panel.hidden;
      panel.hidden = !isHidden;
      toggle.textContent = isHidden ? 'Hide model answer' : 'Show model answer';
    });

    mount.appendChild(node);
  });
}

function setActiveButton(rowId, value, attr) {
  const row = document.getElementById(rowId);
  row.querySelectorAll('.scp-pill').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset[attr] === value);
  });
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimerLabel() {
  timerLabel.textContent = formatTime(state.secondsLeft);
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer(seconds) {
  stopTimer();
  state.secondsLeft = seconds;
  state.paused = false;
  updateTimerLabel();

  state.timerId = setInterval(() => {
    if (state.paused) return;
    state.secondsLeft -= 1;
    if (state.secondsLeft <= 0) {
      state.secondsLeft = 0;
      stopTimer();
    }
    updateTimerLabel();
  }, 1000);
}

document.getElementById('modeRow').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-mode]');
  if (!btn) return;
  state.mode = btn.dataset.mode;
  setActiveButton('modeRow', state.mode, 'mode');
  renderTasks();
});

document.getElementById('levelRow').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-level]');
  if (!btn) return;
  state.level = btn.dataset.level;
  setActiveButton('levelRow', state.level, 'level');
  renderTasks();
});

scenarioSelect.addEventListener('change', () => {
  state.scenario = scenarioSelect.value;
  renderTasks();
});

frToggle.addEventListener('change', () => {
  state.showFrench = frToggle.checked;
  renderTasks();
});

modelToggle.addEventListener('change', () => {
  state.autoModel = modelToggle.checked;
  renderTasks();
});

keywordsToggle.addEventListener('change', () => {
  state.showKeywords = keywordsToggle.checked;
  renderTasks();
});

document.querySelectorAll('[data-seconds]').forEach(btn => {
  btn.addEventListener('click', () => startTimer(Number(btn.dataset.seconds)));
});

document.getElementById('pauseTimer').addEventListener('click', () => {
  state.paused = !state.paused;
  document.getElementById('pauseTimer').textContent = state.paused ? 'Resume' : 'Pause';
});

document.getElementById('resetTimer').addEventListener('click', () => {
  stopTimer();
  state.secondsLeft = 0;
  state.paused = false;
  document.getElementById('pauseTimer').textContent = 'Pause';
  updateTimerLabel();
});

updateTimerLabel();
renderTasks();
