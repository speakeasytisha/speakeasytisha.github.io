(() => {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const jsWarning = $('#js-warning');
  if (jsWarning) jsWarning.textContent = '✅ JS loaded. Audio and interactive exercises are ready.';

  const speech = {
    lang: 'en-US',
    getVoice() {
      const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      return voices.find(v => v.lang === this.lang)
        || voices.find(v => (v.lang || '').startsWith(this.lang.slice(0, 2)))
        || voices.find(v => (v.lang || '').startsWith('en'))
        || null;
    },
    say(text) {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = this.lang;
      const v = this.getVoice();
      if (v) utt.voice = v;
      utt.rate = 0.96;
      window.speechSynthesis.speak(utt);
    },
    stop() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };
  if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => speech.getVoice();

  $('#voice-us')?.addEventListener('click', () => {
    speech.lang = 'en-US';
    $('#voice-us')?.classList.add('active');
    $('#voice-uk')?.classList.remove('active');
    $('#voice-us')?.setAttribute('aria-pressed', 'true');
    $('#voice-uk')?.setAttribute('aria-pressed', 'false');
  });
  $('#voice-uk')?.addEventListener('click', () => {
    speech.lang = 'en-GB';
    $('#voice-uk')?.classList.add('active');
    $('#voice-us')?.classList.remove('active');
    $('#voice-uk')?.setAttribute('aria-pressed', 'true');
    $('#voice-us')?.setAttribute('aria-pressed', 'false');
  });
  $('#stop-audio')?.addEventListener('click', () => speech.stop());
  $$('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.speak || btn.closest('.model-area')?.querySelector('#model-answer')?.textContent || '';
      if (text) speech.say(text);
    });
  });

  const vocabData = [
    { emoji: '📋', word: 'go through', fr: 'passer en revue', def: 'to review or explain something carefully step by step', ex: 'Before boarding, we go through the passenger list.' },
    { emoji: '📞', word: 'follow up', fr: 'faire un suivi', def: 'to contact again or continue after a first message', ex: 'I follow up with the passenger by email.' },
    { emoji: '💬', word: 'reply to', fr: 'répondre à', def: 'to answer a message or question', ex: 'I reply to customer emails every morning.' },
    { emoji: '🧍', word: 'speak to', fr: 'parler à', def: 'to talk directly to a person', ex: 'I speak to passengers politely.' },
    { emoji: '🆘', word: 'ask for', fr: 'demander', def: 'to request something', ex: 'The passenger asks for help with her seat.' },
    { emoji: '🧳', word: 'help with', fr: 'aider avec', def: 'to assist someone with a task or problem', ex: 'I help with cabin baggage and special requests.' },
    { emoji: '🛫', word: 'prepare for', fr: 'se préparer à', def: 'to get ready for something', ex: 'We prepare for boarding at Gate 14.' },
    { emoji: '🎯', word: 'want to', fr: 'vouloir', def: 'to express a goal or desire', ex: 'I want to become a steward.' },
    { emoji: '✅', word: 'need to', fr: 'avoir besoin de', def: 'to say something is necessary', ex: 'I need to check the gate number.' },
    { emoji: '😊', word: 'enjoy + -ing', fr: 'aimer + -ing', def: 'to say that you like an activity', ex: 'I enjoy working with people.' },
    { emoji: '🧩', word: 'consist of + -ing', fr: 'consister à', def: 'to describe the parts of a job or task', ex: 'My job consists of helping passengers and answering questions.' },
    { emoji: '✉️', word: 'follow up on', fr: 'faire un suivi sur', def: 'to continue working on a request or issue', ex: 'I follow up on special meal requests.' }
  ];

  const vocabGrid = $('#vocab-grid');
  if (vocabGrid) {
    vocabGrid.innerHTML = vocabData.map(item => `
      <article class="vocab-card">
        <div class="vocab-head">
          <div>
            <div class="vocab-word">${item.word}</div>
            <div class="fr">${item.fr}</div>
          </div>
          <div class="vocab-emoji">${item.emoji}</div>
        </div>
        <div><strong>Definition:</strong> ${item.def}</div>
        <div class="vocab-example"><strong>Example:</strong> ${item.ex}</div>
        <button class="speak-btn" type="button" data-speak="${item.word}. ${item.ex}">🔊 Listen</button>
      </article>
    `).join('');
    $$('.vocab-card .speak-btn').forEach(btn => btn.addEventListener('click', () => speech.say(btn.dataset.speak)));
  }

  const ex1 = [
    {
      q: 'We always go ______ the safety instructions before take-off.',
      choices: ['through', 'with', 'to'],
      answer: 0,
      ok: 'Correct! We say go through the safety instructions.',
      no: 'Use go through when you review something step by step.'
    },
    {
      q: 'I follow up ______ the passenger by email.',
      choices: ['with', 'to', 'for'],
      answer: 0,
      ok: 'Correct! We follow up with a person.',
      no: 'Use follow up with + person.'
    },
    {
      q: 'I need ______ check the gate number.',
      choices: ['checking', 'to', 'for'],
      answer: 1,
      ok: 'Correct! need to + base verb',
      no: 'After need, use to + base verb.'
    },
    {
      q: 'I enjoy ______ with people.',
      choices: ['to work', 'working', 'work'],
      answer: 1,
      ok: 'Correct! enjoy + -ing',
      no: 'After enjoy, use verb + -ing.'
    }
  ];

  function buildMCQ(hostId, items, keyPrefix) {
    const host = document.getElementById(hostId);
    if (!host) return;
    host.innerHTML = '';
    items.forEach((item, idx) => {
      const block = document.createElement('div');
      block.className = 'exercise-item';
      const shuffled = item.choices.map((c, i) => ({ c, i })).sort(() => Math.random() - 0.5);
      block.innerHTML = `
        <p><strong>${idx + 1}.</strong> ${item.q}</p>
        <div class="options"></div>
        <div class="feedback hidden"></div>
      `;
      const options = $('.options', block);
      const fb = $('.feedback', block);
      shuffled.forEach(choice => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = choice.c;
        btn.addEventListener('click', () => {
          $$('.option-btn', block).forEach(b => b.disabled = true);
          if (choice.i === item.answer) {
            btn.classList.add('correct');
            fb.textContent = item.ok;
            fb.className = 'feedback ok';
          } else {
            btn.classList.add('wrong');
            const right = shuffled.find(x => x.i === item.answer);
            const rightBtn = $$('.option-btn', block).find(b => b.textContent === right.c);
            if (rightBtn) rightBtn.classList.add('correct');
            fb.textContent = item.no;
            fb.className = 'feedback no';
          }
          fb.classList.remove('hidden');
        });
        options.appendChild(btn);
      });
      host.appendChild(block);
    });
  }
  buildMCQ('ex1-host', ex1, 'ex1');

  const ex2 = [
    {
      q: 'Choose the correct sentence.',
      choices: [
        'I follow up on the request after the flight.',
        'I follow up the request after the flight.'
      ],
      answer: 0,
      ok: 'Yes! follow up on + request / issue.',
      no: 'We say follow up on the request.'
    },
    {
      q: 'Choose the correct sentence.',
      choices: [
        'I want becoming a steward.',
        'I want to become a steward.'
      ],
      answer: 1,
      ok: 'Yes! want to + base verb.',
      no: 'Use want to become.'
    },
    {
      q: 'Choose the correct sentence.',
      choices: [
        'My job consists of helping passengers.',
        'My job consists to help passengers.'
      ],
      answer: 0,
      ok: 'Correct! consists of + -ing.',
      no: 'Use consists of helping.'
    }
  ];
  buildMCQ('ex2-host', ex2, 'ex2');

  const ex3Data = [
    { q: 'I reply ______ emails from passengers.', a: 'to', hint: 'reply to' },
    { q: 'We go ______ the boarding procedure together.', a: 'through', hint: 'go through' },
    { q: 'I would like ______ help the passenger.', a: 'to', hint: 'would like to' },
    { q: 'I enjoy ______ with people.', a: 'working', hint: 'enjoy + -ing' }
  ];
  const ex3Host = $('#ex3-host');
  if (ex3Host) {
    ex3Host.innerHTML = '<div class="fill-grid"></div>';
    const grid = $('.fill-grid', ex3Host);
    ex3Data.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'fill-row';
      row.innerHTML = `
        <label>${idx + 1}. ${item.q}</label>
        <input type="text" autocomplete="off" />
        <button class="check-btn" type="button">Check</button>
        <div class="feedback hidden"></div>
      `;
      const input = $('input', row);
      const btn = $('.check-btn', row);
      const fb = $('.feedback', row);
      btn.addEventListener('click', () => {
        const val = input.value.trim().toLowerCase();
        if (val === item.a.toLowerCase()) {
          fb.textContent = '✅ Correct!';
          fb.className = 'feedback ok';
        } else {
          fb.textContent = `❌ Try again. Hint: ${item.hint}`;
          fb.className = 'feedback no';
        }
        fb.classList.remove('hidden');
      });
      grid.appendChild(row);
    });
  }

  const ex4Data = [
    {
      prompt: 'Build a natural sentence to talk about the passenger list.',
      target: 'We go through the passenger list before boarding.',
      chunks: ['We', 'go through', 'the passenger list', 'before boarding.']
    },
    {
      prompt: 'Build a natural sentence with follow up.',
      target: 'I follow up with the gate agent by phone.',
      chunks: ['I', 'follow up with', 'the gate agent', 'by phone.']
    },
    {
      prompt: 'Build a natural sentence with want to.',
      target: 'I want to become a professional steward.',
      chunks: ['I', 'want to become', 'a professional steward.']
    }
  ];
  const ex4Host = $('#ex4-host');
  if (ex4Host) {
    ex4Host.innerHTML = '';
    ex4Data.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'build-row';
      row.innerHTML = `
        <p><strong>${idx + 1}.</strong> ${item.prompt}</p>
        <div class="chips"></div>
        <button class="check-btn" type="button">Show model sentence</button>
        <div class="feedback hidden"></div>
      `;
      const chips = $('.chips', row);
      item.chunks.sort(() => Math.random() - 0.5).forEach(chunk => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = chunk;
        chips.appendChild(chip);
      });
      $('.check-btn', row).addEventListener('click', () => {
        const fb = $('.feedback', row);
        fb.textContent = `Model: ${item.target}`;
        fb.className = 'feedback ok';
        fb.classList.remove('hidden');
      });
      ex4Host.appendChild(row);
    });
  }

  const scenarios = [
    {
      name: 'Gate follow-up',
      desc: 'A passenger wants to know if the gate has changed. You need to review the information and follow up.',
      descFr: 'Un passager veut savoir si la porte a changé. Tu dois vérifier les informations et faire un suivi.',
      prompt: 'The passenger says: “Excuse me, I’m not sure about my gate. Can you help me?”',
      model: 'Of course. Let’s go through your flight information together. Then I can follow up with the gate agent if necessary.',
      modelFr: 'Bien sûr. Regardons ensemble les informations de votre vol. Ensuite, je peux faire un suivi avec l’agent de porte si nécessaire.'
    },
    {
      name: 'Special request',
      desc: 'A passenger asks for a special meal. You need to ask for details and follow up on the request.',
      descFr: 'Un passager demande un repas spécial. Tu dois demander des détails et faire un suivi sur la demande.',
      prompt: 'The passenger says: “I asked for a vegetarian meal. Can you check it, please?”',
      model: 'Certainly. I can check the request now and follow up on it with the cabin team.',
      modelFr: 'Bien sûr. Je peux vérifier la demande maintenant et faire un suivi avec l’équipe cabine.'
    },
    {
      name: 'Boarding procedure',
      desc: 'A nervous passenger does not understand the next steps before boarding.',
      descFr: 'Un passager stressé ne comprend pas les étapes avant l’embarquement.',
      prompt: 'The passenger says: “I don’t understand what I need to do now.”',
      model: 'No problem. Let me go through the boarding procedure with you step by step.',
      modelFr: 'Pas de problème. Laissez-moi revoir avec vous la procédure d’embarquement étape par étape.'
    }
  ];

  const scenarioSelect = $('#scenario-select');
  const scenarioDesc = $('#scenario-desc');
  const scenarioDescFr = $('#scenario-desc-fr');
  const scenarioPrompt = $('#scenario-prompt');
  const modelArea = $('#model-area');
  const modelAnswer = $('#model-answer');
  const modelAnswerFr = $('#model-answer-fr');
  if (scenarioSelect) {
    scenarioSelect.innerHTML = scenarios.map((s, i) => `<option value="${i}">${s.name}</option>`).join('');
    const renderScenario = () => {
      const s = scenarios[Number(scenarioSelect.value)] || scenarios[0];
      scenarioDesc.textContent = s.desc;
      scenarioDescFr.textContent = s.descFr;
      scenarioPrompt.textContent = s.prompt;
      modelAnswer.textContent = s.model;
      modelAnswerFr.textContent = s.modelFr;
      modelArea.classList.add('hidden');
      $('#your-answer').value = '';
    };
    renderScenario();
    scenarioSelect.addEventListener('change', renderScenario);
    $('#show-model')?.addEventListener('click', () => modelArea.classList.toggle('hidden'));
    $('#listen-prompt')?.addEventListener('click', () => speech.say(scenarioPrompt.textContent));
    $('#listen-model')?.addEventListener('click', () => speech.say(modelAnswer.textContent));
  }
})();
