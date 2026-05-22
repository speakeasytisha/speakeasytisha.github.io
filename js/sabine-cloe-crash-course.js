(() => {
  const body = document.body;
  const frToggle = document.getElementById('frToggle');
  const accentToggle = document.getElementById('accentToggle');
  let accent = 'US';

  const regularVerbs = [
    ['organise', 'organised', 'organiser', 'organized a wedding / organised a salon'],
    ['contact', 'contacted', 'contacter', 'contacted the suppliers'],
    ['confirm', 'confirmed', 'confirmer', 'confirmed the schedule'],
    ['prepare', 'prepared', 'préparer', 'prepared the venue'],
    ['coordinate', 'coordinated', 'coordonner', 'coordinated the team'],
    ['welcome', 'welcomed', 'accueillir', 'welcomed the visitors'],
    ['answer', 'answered', 'répondre', 'answered questions'],
    ['decorate', 'decorated', 'décorer', 'decorated the stand']
  ];

  const irregularVerbs = [
    ['go', 'went', 'aller', 'went to Paris'],
    ['meet', 'met', 'rencontrer', 'met new suppliers'],
    ['speak', 'spoke', 'parler', 'spoke with visitors'],
    ['take', 'took', 'prendre', 'took notes'],
    ['write', 'wrote', 'écrire', 'wrote follow-up emails'],
    ['give', 'gave', 'donner', 'gave information'],
    ['come', 'came', 'venir / revenir', 'came back with ideas'],
    ['have', 'had', 'avoir', 'had useful conversations']
  ];

  const speakingPrompts = [
    {
      icon:'👩‍💼',
      title:'Introduce your job',
      question:'What do you do?',
      frame:'I work as a wedding planner. I organise weddings and events. I usually coordinate suppliers, answer clients, and confirm details.',
      model:'I work as a wedding planner. I organise weddings and events, and I help clients prepare important moments. I usually coordinate suppliers, confirm schedules, and answer questions. I enjoy the creative part of my work, but I also like organising everything carefully.'
    },
    {
      icon:'🏛️',
      title:'Talk about the Paris salon',
      question:'Can you tell me about a recent professional event?',
      frame:'Last week, I organised / attended a salon in Paris. I met suppliers, spoke with visitors, and took notes.',
      model:'Last week, I organised a salon in Paris. It was a very interesting professional experience. During the event, I met suppliers, spoke with visitors, and answered questions about our services. I also took notes and found new ideas for future weddings.'
    },
    {
      icon:'📈',
      title:'Say what you learned',
      question:'What have you learned from this experience?',
      frame:'I have learned… / I have improved… / I have gained…',
      model:'I have learned how to communicate more efficiently with suppliers and clients. I have also improved my organisation skills, and I have gained more confidence when I speak about my work.'
    },
    {
      icon:'⚠️',
      title:'Describe a problem',
      question:'Did you have any difficulties?',
      frame:'Yes, I did. There was… / I had to… / In the end, I…',
      model:'Yes, I did. There was some stress because the schedule was very busy, and I had to manage several details at the same time. In the end, I stayed calm, solved the problems, and finished the event successfully.'
    },
    {
      icon:'📞',
      title:'Follow-up after the event',
      question:'What did you do after the salon?',
      frame:'After the event, I… Then I… Finally, I…',
      model:'After the event, I organised my notes and contacted some suppliers. Then I wrote follow-up emails and reviewed the most useful ideas. Finally, I prepared the next steps for future projects.'
    },
    {
      icon:'🎯',
      title:'Future impact',
      question:'How will this help you in the future?',
      frame:'This experience will help me because…',
      model:'This experience will help me because I now have more ideas, more contacts, and more confidence. I think it will help me organise future weddings more efficiently and communicate more easily in professional situations.'
    }
  ];

  function renderVerbList(id, list){
    const box = document.getElementById(id);
    box.innerHTML = list.map(v => `
      <div class="verb-item">
        <strong>🧩 ${v[0]} → ${v[1]}</strong>
        <div class="fr">${v[2]}</div>
        <div>Example: I ${v[3]}.</div>
      </div>
    `).join('');
  }

  renderVerbList('regularVerbList', regularVerbs);
  renderVerbList('irregularVerbList', irregularVerbs);

  frToggle?.addEventListener('click', () => body.classList.toggle('hide-fr'));
  accentToggle?.addEventListener('click', () => {
    accent = accent === 'US' ? 'UK' : 'US';
    accentToggle.textContent = `🎧 Accent: ${accent}`;
  });

  function speak(text){
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = accent === 'US' ? 'en-US' : 'en-GB';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }

  function buildMCQ(targetId, feedbackId, question, correctIndex){
    const root = document.getElementById(targetId);
    const feedback = document.getElementById(feedbackId);
    root.innerHTML = question.map((opt, idx) => `<button class="option-btn" data-idx="${idx}">${opt}</button>`).join('');
    root.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        root.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        btn.classList.add(idx === correctIndex ? 'correct' : 'wrong');
        const correctBtn = root.querySelector(`.option-btn[data-idx="${correctIndex}"]`);
        if (correctBtn && idx !== correctIndex) correctBtn.classList.add('correct');
        feedback.textContent = idx === correctIndex ? '✅ Correct!' : '❌ Not quite. Check the correct form.';
      });
    });
  }

  buildMCQ('mcqOne','mcqOneFeedback',[
    'I organised the salon in Paris.',
    'I organiseed the salon in Paris.',
    'I did organised the salon in Paris.'
  ],0);

  buildMCQ('mcqTwo','mcqTwoFeedback',[
    'She met new suppliers at the salon.',
    'She meet new suppliers at the salon.',
    'She did met new suppliers at the salon.'
  ],0);

  document.getElementById('checkFillOne')?.addEventListener('click', () => {
    const value = document.getElementById('fillOne').value.trim().toLowerCase();
    const fb = document.getElementById('fillOneFeedback');
    fb.textContent = value === 'contacted' ? '✅ Correct: contacted' : '❌ Use the past simple of contact: contacted.';
  });

  document.getElementById('showFillOne')?.addEventListener('click', () => {
    document.getElementById('fillOne').value = 'contacted';
    document.getElementById('fillOneFeedback').textContent = '✅ Answer: contacted';
  });

  const orderWords = ['They','welcomed','the','visitors','in','Paris','.'];
  const correctOrder = 'They welcomed the visitors in Paris .';
  const orderZone = document.getElementById('orderZone');

  function renderOrderZone(){
    orderZone.innerHTML = '';
    orderWords
      .slice()
      .sort(() => Math.random() - 0.5)
      .forEach(word => {
        const btn = document.createElement('button');
        btn.className = 'word-btn';
        btn.textContent = word;
        btn.addEventListener('click', () => {
          if (btn.classList.contains('used')) return;
          btn.classList.add('used');
          btn.dataset.usedAt = String(Date.now() + Math.random());
        });
        orderZone.appendChild(btn);
      });
  }
  renderOrderZone();

  document.getElementById('checkOrder')?.addEventListener('click', () => {
    const chosen = [...orderZone.querySelectorAll('.word-btn.used')].sort((a,b) => Number(a.dataset.usedAt) - Number(b.dataset.usedAt)).map(b => b.textContent).join(' ');
    document.getElementById('orderFeedback').textContent = chosen === correctOrder ? '✅ Correct order!' : `❌ Try again. Correct answer: ${correctOrder}`;
  });

  document.getElementById('resetOrder')?.addEventListener('click', () => {
    renderOrderZone();
    document.getElementById('orderFeedback').textContent = '';
  });

  const matchArea = document.getElementById('matchArea');
  const matchSet = [
    ['go','went'],['meet','met'],['speak','spoke'],['take','took']
  ];
  function renderMatch(){
    matchArea.innerHTML = matchSet.map((pair, i) => `
      <div class="match-row">
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
  renderMatch();

  document.getElementById('checkMatch')?.addEventListener('click', () => {
    const selects = [...matchArea.querySelectorAll('select')];
    const ok = selects.every(s => s.value === s.dataset.answer);
    document.getElementById('matchFeedback').textContent = ok ? '✅ Excellent!' : '❌ Check the irregular forms again.';
  });

  document.getElementById('showMatch')?.addEventListener('click', () => {
    [...matchArea.querySelectorAll('select')].forEach(s => s.value = s.dataset.answer);
    document.getElementById('matchFeedback').textContent = '✅ Answers shown.';
  });

  const speakingCards = document.getElementById('speakingCards');
  speakingCards.innerHTML = speakingPrompts.map((item, i) => `
    <article class="s-card">
      <h3>${item.icon} ${item.title}</h3>
      <p><strong>Question:</strong> ${item.question}</p>
      <div class="frame"><strong>Safe frame:</strong> ${item.frame}</div>
      <div class="controls">
        <button class="btn speak-btn" data-type="frame" data-i="${i}">🔊 Listen to frame</button>
        <button class="btn speak-btn" data-type="model" data-i="${i}">🗣️ Listen to model</button>
      </div>
      <details>
        <summary>Show model answer</summary>
        <p>${item.model}</p>
      </details>
    </article>
  `).join('');

  speakingCards.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      const type = btn.dataset.type;
      speak(type === 'frame' ? speakingPrompts[i].frame : speakingPrompts[i].model);
    });
  });
})();
