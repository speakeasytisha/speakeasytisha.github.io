const vocabData = [
  { icon: '🐶', en: 'dog shelter', fr: 'refuge pour chiens' },
  { icon: '🐱', en: 'cat rescue', fr: 'sauvetage de chats' },
  { icon: '🥣', en: 'feeding', fr: 'nourrissage' },
  { icon: '🧽', en: 'cleaning', fr: 'nettoyage' },
  { icon: '🚗', en: 'transport', fr: 'transport' },
  { icon: '🩺', en: 'vet visit', fr: 'visite chez le vétérinaire' },
  { icon: '🏠', en: 'adoption', fr: 'adoption' },
  { icon: '📝', en: 'observation notes', fr: 'notes d’observation' },
  { icon: '💛', en: 'compassion', fr: 'compassion' },
  { icon: '👀', en: 'behaviour', fr: 'comportement' },
  { icon: '🧤', en: 'safety rules', fr: 'règles de sécurité' },
  { icon: '🤝', en: 'teamwork', fr: 'travail d’équipe' }
];

const dialogueSteps = [
  {
    line: 'Interviewer: Can you introduce yourself?',
    options: [
      'I am a former social worker, and now I volunteer in animal rescue.',
      'I likes animals and rescue yesterday.',
      'I am volunteering because cat.'
    ],
    answer: 0
  },
  {
    line: 'Interviewer: What do you do as a volunteer?',
    options: [
      'I help with feeding, cleaning, transport, and adoption support.',
      'I am do many thing with animal place.',
      'I was a volunteer tomorrow.'
    ],
    answer: 0
  },
  {
    line: 'Interviewer: Why is this work important to you?',
    options: [
      'Because animals deserve protection, care, and patience.',
      'Because it are nice.',
      'Because I should yesterday.'
    ],
    answer: 0
  }
];

const sortItems = [
  { text: 'feeding', group: 'care' },
  { text: 'cleaning cages', group: 'care' },
  { text: 'transport', group: 'admin' },
  { text: 'writing notes', group: 'admin' },
  { text: 'patient', group: 'qualities' },
  { text: 'gentle', group: 'qualities' }
];

let score = 0;
let total = 0;
let dialogueIndex = 0;
let selectedToken = null;

function updateScore() {
  document.getElementById('scoreNow').textContent = score;
  document.getElementById('scoreTotal').textContent = total;
  const pct = total ? Math.round((score / total) * 100) : 0;
  document.getElementById('progressPct').textContent = `${pct}%`;
}

function giveFeedback(node, ok, good = 'Correct!', bad = 'Try again.') {
  node.textContent = ok ? good : bad;
  node.className = `feedback ${ok ? 'ok' : 'bad'}`;
  if (ok) {
    score += 1;
    updateScore();
  }
}

function initMcq() {
  document.querySelectorAll('.mcq').forEach(mcq => {
    total += 1;
    let done = false;
    mcq.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (done) return;
        const ok = btn.dataset.choice === mcq.dataset.answer;
        giveFeedback(mcq.querySelector('.feedback'), ok, 'Correct!', 'Not this one.');
        if (ok) done = true;
      });
    });
  });
}

function initVocab() {
  const grid = document.getElementById('vocabGrid');
  grid.innerHTML = vocabData.map(item => `
    <div class="vocab-card" tabindex="0">
      <div class="vocab-inner">
        <div class="vocab-front">
          <div class="icon">${item.icon}</div>
          <div class="term">${item.en}</div>
          <div>Tap to see French</div>
        </div>
        <div class="vocab-back">
          <div class="icon">${item.icon}</div>
          <div class="term">${item.fr}</div>
          <div>EN: ${item.en}</div>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.vocab-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keypress', e => {
      if (e.key === 'Enter' || e.key === ' ') card.classList.toggle('flipped');
    });
  });
}

function renderDialogue() {
  const box = document.getElementById('dialogueBox');
  const step = dialogueSteps[dialogueIndex];
  if (!step) {
    box.innerHTML = `<div class="dialogue-line">✅ Great job. You finished the dialogue.</div>`;
    return;
  }
  box.innerHTML = `
    <div class="dialogue-line">${step.line}</div>
    <div class="options">
      ${step.options.map((opt, i) => `<button data-idx="${i}">${opt}</button>`).join('')}
    </div>
    <p class="feedback"></p>
  `;
  total += 1;
  updateScore();
  box.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const ok = Number(btn.dataset.idx) === step.answer;
      const feedback = box.querySelector('.feedback');
      if (ok) {
        giveFeedback(feedback, true, 'Correct. Next line unlocked.', '');
        dialogueIndex += 1;
        setTimeout(renderDialogue, 500);
      } else {
        feedback.textContent = 'Try again.';
        feedback.className = 'feedback bad';
      }
    });
  });
}

function initGaps() {
  document.querySelectorAll('.gap').forEach(gap => {
    total += 1;
    const input = gap.querySelector('input');
    const feedback = gap.querySelector('.feedback');
    let done = false;
    gap.querySelector('.check-gap').addEventListener('click', () => {
      if (done) return;
      const ok = input.value.trim().toLowerCase() === gap.dataset.answer.toLowerCase();
      if (ok) done = true;
      giveFeedback(feedback, ok, 'Correct!', `Expected: ${gap.dataset.answer}`);
    });
  });
}

function initSort() {
  const bank = document.getElementById('tokenBank');
  bank.innerHTML = sortItems.map((item, i) => `<button class="token" data-index="${i}" data-group="${item.group}">${item.text}</button>`).join('');
  total += sortItems.length;
  bank.querySelectorAll('.token').forEach(token => {
    token.addEventListener('click', () => {
      document.querySelectorAll('.token').forEach(t => t.classList.remove('selected'));
      selectedToken = token;
      token.classList.add('selected');
    });
  });

  document.querySelectorAll('.dropzone').forEach(zone => {
    zone.addEventListener('click', () => {
      if (!selectedToken) return;
      const ok = selectedToken.dataset.group === zone.dataset.group;
      const feedback = document.getElementById('sortFeedback');
      if (ok) {
        zone.appendChild(selectedToken);
        selectedToken.classList.remove('selected');
        selectedToken.disabled = true;
        selectedToken = null;
        score += 1;
        feedback.textContent = 'Correct match.';
        feedback.className = 'feedback ok';
        updateScore();
      } else {
        feedback.textContent = 'Wrong category.';
        feedback.className = 'feedback bad';
      }
    });
  });
}

function initBuilder() {
  document.getElementById('buildText').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim() || 'I';
    const pastJob = document.getElementById('pastJob').value;
    const currentRole = document.getElementById('currentRole').value;
    const tasks = [...document.querySelectorAll('.checks input:checked')].map(cb => cb.value);
    const quality = document.getElementById('quality').value;
    const reason = document.getElementById('reason').value;
    const taskText = tasks.length ? tasks.slice(0, -1).join(', ') + (tasks.length > 1 ? ', and ' + tasks.slice(-1) : tasks[0]) : 'help animals in different ways';
    const output = `${name} ${pastJob} and ${currentRole}. ${name} ${name.toLowerCase() === 'i' ? 'am' : 'is'} ${quality}. In this role, ${name.toLowerCase() === 'i' ? 'I' : 'she'} ${taskText}. This work is important ${reason}.`;
    document.getElementById('builderOutput').textContent = output;
  });

  document.getElementById('copyOutput').addEventListener('click', async () => {
    const text = document.getElementById('builderOutput').textContent;
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied!');
    } catch {
      alert('Copy failed. Please copy manually.');
    }
  });
}

function initReset() {
  document.getElementById('resetAll').addEventListener('click', () => window.location.reload());
  document.getElementById('restartDialogue').addEventListener('click', () => {
    dialogueIndex = 0;
    renderDialogue();
  });
}

initMcq();
initVocab();
renderDialogue();
initGaps();
initSort();
initBuilder();
initReset();
updateScore();
