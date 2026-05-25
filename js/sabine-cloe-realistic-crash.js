(() => {
  const body = document.body;
  const frToggle = document.getElementById('frToggle');
  const accentToggle = document.getElementById('accentToggle');
  let accent = 'US';

  const regularVerbs = [
    ['organise', 'organised', 'organiser', 'I organised the salon in Paris.'],
    ['contact', 'contacted', 'contacter', 'I contacted the suppliers yesterday.'],
    ['confirm', 'confirmed', 'confirmer', 'I confirmed the final details.'],
    ['prepare', 'prepared', 'préparer', 'I prepared the venue plan.'],
    ['coordinate', 'coordinated', 'coordonner', 'I coordinated the team carefully.'],
    ['welcome', 'welcomed', 'accueillir', 'I welcomed the visitors.'],
    ['answer', 'answered', 'répondre', 'I answered client questions.'],
    ['decorate', 'decorated', 'décorer', 'I decorated the stand.']
  ];

  const irregularVerbs = [
    ['go', 'went', 'aller', 'I went to Paris for the salon.'],
    ['meet', 'met', 'rencontrer', 'I met new suppliers.'],
    ['speak', 'spoke', 'parler', 'I spoke with visitors and clients.'],
    ['take', 'took', 'prendre', 'I took useful notes.'],
    ['write', 'wrote', 'écrire', 'I wrote follow-up emails.'],
    ['give', 'gave', 'donner', 'I gave information to visitors.'],
    ['come', 'came', 'venir', 'I came back with new ideas.'],
    ['have', 'had', 'avoir', 'I had several professional meetings.']
  ];

  const speakingPrompts = [
    {
      icon: '👩‍💼',
      title: 'Part 1 · Introduce your job',
      question: 'What do you do?',
      frame: 'I work as a wedding planner. I organise weddings and events. I usually coordinate suppliers and answer clients.',
      model: 'I work as a wedding planner. I organise weddings and events, and I help clients prepare important moments. I usually coordinate suppliers, confirm schedules, and answer questions. I enjoy both the creative and organisational parts of my work.'
    },
    {
      icon: '📍',
      title: 'Part 2 · What is happening now?',
      question: 'What are you working on at the moment?',
      frame: 'At the moment, I am preparing a client meeting. I am checking details and contacting suppliers.',
      model: 'At the moment, I am preparing a client meeting and checking the final details for an event. I am contacting suppliers, reviewing the schedule, and answering client messages. It is a busy period, but I like this part of my work.'
    },
    {
      icon: '🕰️',
      title: 'Part 3 · Talk about the Paris salon',
      question: 'Can you describe a recent professional event?',
      frame: 'Last week, I organised a salon in Paris. I met suppliers, welcomed visitors, and spoke with clients.',
      model: 'Last week, I organised a salon in Paris. It was an important professional event for me. During the salon, I met suppliers, welcomed visitors, and spoke with clients about our services. I also took notes and found useful ideas for future events.'
    },
    {
      icon: '➡️',
      title: 'Part 4 · Future plans',
      question: 'What are you going to do next?',
      frame: 'Next week, I am going to contact suppliers and prepare future projects.',
      model: 'Next week, I am going to follow up with suppliers and prepare future projects. I am also going to review my notes from the salon and organise the next steps. This is going to help me work more efficiently.'
    },
    {
      icon: '⚠️',
      title: 'Part 5 · Solve a problem',
      question: 'Can you describe a difficulty?',
      frame: 'Yes, there was a problem with ... I stayed calm and I solved it.',
      model: 'Yes, there was a problem with the timing because the schedule was very busy. I stayed calm, spoke with the team, and reorganised the order of the tasks. In the end, the event went well and the clients were satisfied.'
    }
  ];

  const writingPrompts = [
    {
      icon: '✉️',
      title: 'Writing 1 · Short professional email',
      task: 'Write to a supplier to confirm the time of a meeting.',
      frame: 'Subject + greeting + reason + question / confirmation + polite closing',
      model: 'Subject: Meeting confirmation\n\nHello Mr Martin,\n\nI am writing to confirm our meeting on Thursday at 10:00. I am preparing the final details for the event, so I would like to check that this time is still convenient for you.\n\nThank you very much.\nBest regards,\nSabine'
    },
    {
      icon: '📨',
      title: 'Writing 2 · Follow-up after the salon',
      task: 'Write a short follow-up email after the salon in Paris.',
      frame: 'Greeting + past simple + result + next step + closing',
      model: 'Subject: Thank you after the Paris salon\n\nHello,\n\nIt was a pleasure to meet you at the salon in Paris last week. I enjoyed our conversation and I appreciated the information you gave me about your services. I am going to review the details and contact you again next week.\n\nBest regards,\nSabine'
    },
    {
      icon: '📅',
      title: 'Writing 3 · Future plan',
      task: 'Write to a client about your next steps.',
      frame: 'Greeting + present continuous / going to + practical details + closing',
      model: 'Subject: Next steps for your event\n\nHello Mrs Laurent,\n\nI am currently reviewing the final details for your event. This week, I am contacting the suppliers and checking the schedule. Next week, I am going to confirm the venue timing and prepare the final plan.\n\nKind regards,\nSabine'
    }
  ];

  function renderVerbList(id, list) {
    const box = document.getElementById(id);
    box.innerHTML = list.map(v => `
      <div class="verb-item">
        <strong>🧩 ${v[0]} → ${v[1]}</strong>
        <div class="fr">${v[2]}</div>
        <div>${v[3]}</div>
      </div>
    `).join('');
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function buildMCQ(targetId, feedbackId, options, correctIndex, goodMsg, badMsg) {
    const root = document.getElementById(targetId);
    const feedback = document.getElementById(feedbackId);
    root.innerHTML = options.map((opt, idx) => `<button class="option-btn" data-idx="${idx}">${opt}</button>`).join('');
    root.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        root.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        btn.classList.add(idx === correctIndex ? 'correct' : 'wrong');
        const correctBtn = root.querySelector(`.option-btn[data-idx="${correctIndex}"]`);
        if (correctBtn && idx !== correctIndex) correctBtn.classList.add('correct');
        feedback.textContent = idx === correctIndex ? goodMsg : badMsg;
      });
    });
  }

  function renderSpeakingCards() {
    const box = document.getElementById('speakingCards');
    box.innerHTML = speakingPrompts.map((item, i) => `
      <article class="s-card">
        <h3>${item.icon} ${item.title}</h3>
        <p><strong>Question:</strong> ${item.question}</p>
        <div class="frame"><strong>Safe frame:</strong> ${item.frame}</div>
        <div class="controls" style="margin-top:.75rem;">
          <button class="btn speak-btn" data-type="frame" data-i="${i}">🔊 Listen to frame</button>
          <button class="btn speak-btn" data-type="model" data-i="${i}">🗣️ Listen to model</button>
        </div>
        <details class="details-space">
          <summary>Show model answer</summary>
          <div class="model-box">${item.model}</div>
        </details>
      </article>
    `).join('');

    box.querySelectorAll('.speak-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.i);
        const type = btn.dataset.type;
        speak(type === 'frame' ? speakingPrompts[i].frame : speakingPrompts[i].model);
      });
    });
  }

  function renderWritingCards() {
    const box = document.getElementById('writingCards');
    box.innerHTML = writingPrompts.map((item, i) => `
      <article class="w-card">
        <h3>${item.icon} ${item.title}</h3>
        <p><strong>Task:</strong> ${item.task}</p>
        <p class="summary-like">Useful structure</p>
        <div class="frame">${item.frame}</div>
        <textarea placeholder="Write here..."></textarea>
        <details class="details-space">
          <summary>Show model answer</summary>
          <div class="model-box">${item.model.replace(/\n/g,'<br>')}</div>
        </details>
        <div class="controls" style="margin-top:.75rem;">
          <button class="btn writing-speak" data-i="${i}">🔊 Listen to model</button>
        </div>
      </article>
    `).join('');

    box.querySelectorAll('.writing-speak').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.i);
        speak(writingPrompts[i].model.replace(/\n/g, ' '));
      });
    });
  }

  function renderMatch() {
    const matchArea = document.getElementById('matchArea');
    const matchSet = [['go','went'],['meet','met'],['speak','spoke'],['take','took']];
    matchArea.innerHTML = matchSet.map(pair => `
      <div style="display:grid;grid-template-columns:110px 1fr;gap:.65rem;align-items:center;margin:.5rem 0;">
        <label><strong>${pair[0]}</strong></label>
        <select data-answer="${pair[1]}">
          <option value="">Choose</option>
          <option>went</option>
          <option>met</option>
          <option>spoke</option>
          <option>took</option>
        </select>
      </div>
    `).join('');
  }

  function renderOrderZone() {
    const words = ['First', ',', 'I', 'welcomed', 'the', 'visitors', '.', 'Then', ',', 'I', 'met', 'new', 'suppliers', '.'];
    const zone = document.getElementById('orderZone');
    zone.innerHTML = '';
    words.sort(() => Math.random() - 0.5).forEach(word => {
      const btn = document.createElement('button');
      btn.className = 'word-btn';
      btn.textContent = word;
      btn.addEventListener('click', () => {
        if (btn.classList.contains('used')) return;
        btn.classList.add('used');
        btn.dataset.usedAt = String(Date.now() + Math.random());
      });
      zone.appendChild(btn);
    });
  }

  frToggle?.addEventListener('click', () => body.classList.toggle('hide-fr'));
  accentToggle?.addEventListener('click', () => {
    accent = accent === 'US' ? 'UK' : 'US';
    accentToggle.textContent = `🎧 Accent: ${accent}`;
  });

  renderVerbList('regularVerbList', regularVerbs);
  renderVerbList('irregularVerbList', irregularVerbs);
  renderSpeakingCards();
  renderWritingCards();
  renderMatch();
  renderOrderZone();

  buildMCQ(
    'mcqTense',
    'mcqTenseFeedback',
    ['I am going to', 'I organised', 'I am organising'],
    0,
    '✅ Correct. A plan for tomorrow = be going to.',
    '❌ For a plan for tomorrow, use be going to.'
  );

  buildMCQ(
    'mcqPronouns',
    'mcqPronounsFeedback',
    ['She met new suppliers at the salon.', 'She meet new suppliers at the salon.', 'She did met new suppliers at the salon.'],
    0,
    '✅ Correct.',
    '❌ In the affirmative past simple, use the past form: met.'
  );

  document.getElementById('checkFillOne')?.addEventListener('click', () => {
    const value = document.getElementById('fillOne').value.trim().toLowerCase();
    const fb = document.getElementById('fillOneFeedback');
    fb.textContent = value === 'contacted' ? '✅ Correct: contacted.' : '❌ Use the past simple of contact: contacted.';
  });

  document.getElementById('showFillOne')?.addEventListener('click', () => {
    document.getElementById('fillOne').value = 'contacted';
    document.getElementById('fillOneFeedback').textContent = '✅ Answer: contacted.';
  });

  document.getElementById('checkMatch')?.addEventListener('click', () => {
    const selects = [...document.querySelectorAll('#matchArea select')];
    const ok = selects.every(s => s.value === s.dataset.answer);
    document.getElementById('matchFeedback').textContent = ok ? '✅ Excellent.' : '❌ Check the irregular past forms again.';
  });

  document.getElementById('showMatch')?.addEventListener('click', () => {
    [...document.querySelectorAll('#matchArea select')].forEach(s => s.value = s.dataset.answer);
    document.getElementById('matchFeedback').textContent = '✅ Answers shown.';
  });

  document.getElementById('checkOrder')?.addEventListener('click', () => {
    const chosen = [...document.querySelectorAll('#orderZone .word-btn.used')]
      .sort((a,b) => Number(a.dataset.usedAt) - Number(b.dataset.usedAt))
      .map(b => b.textContent)
      .join(' ');
    const correct = 'First , I welcomed the visitors . Then , I met new suppliers .';
    document.getElementById('orderFeedback').textContent = chosen === correct ? '✅ Correct order.' : `❌ Try again. Correct answer: ${correct}`;
  });

  document.getElementById('resetOrder')?.addEventListener('click', () => {
    renderOrderZone();
    document.getElementById('orderFeedback').textContent = '';
  });
})();
