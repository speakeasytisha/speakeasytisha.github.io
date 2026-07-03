(() => {
  const state = { score: 0, completed: new Set(), frenchVisible: true, builtWords: [], generatedSpeech: '' };
  const scoreEl = document.getElementById('totalScore');
  const warmupEl = document.getElementById('warmupScore');

  function normalize(text) {
    return text.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ');
  }

  function setFeedback(container, message, ok) {
    const feedback = container.querySelector('.feedback');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove('success', 'error');
    feedback.classList.add(ok ? 'success' : 'error');
  }

  function award(id, amount = 1) {
    if (!state.completed.has(id)) {
      state.completed.add(id);
      state.score += amount;
      scoreEl.textContent = state.score;
      const warmupDone = [...state.completed].filter(x => x.startsWith('warmup')).length;
      warmupEl.textContent = `${warmupDone} / 2`;
    }
  }

  // Manual British-English speech only
  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Speech is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.82;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const british = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
    if (british) utterance.voice = british;
    window.speechSynthesis.speak(utterance);
  }
  document.querySelectorAll('.speak').forEach(button => button.addEventListener('click', () => speak(button.dataset.speech)));
  window.speechSynthesis?.addEventListener?.('voiceschanged', () => {});

  // Toggle translations
  const transToggle = document.getElementById('translationToggle');
  transToggle.addEventListener('click', () => {
    state.frenchVisible = !state.frenchVisible;
    document.body.classList.toggle('translations-hidden', !state.frenchVisible);
    transToggle.textContent = state.frenchVisible ? '🇫🇷 Hide French' : '🇫🇷 Show French';
    transToggle.setAttribute('aria-pressed', String(!state.frenchVisible));
  });
  const style = document.createElement('style');
  style.textContent = '.translations-hidden .fr,.translations-hidden .fr-inline{display:none!important;}';
  document.head.appendChild(style);

  document.getElementById('printBtn').addEventListener('click', () => window.print());

  // Multiple-choice feedback
  document.querySelectorAll('.choice-list').forEach(list => {
    list.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('[data-exercise]');
        if (!card) return;
        const correct = button.dataset.correct === 'true';
        list.querySelectorAll('button').forEach(b => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        if (!correct) button.classList.add('incorrect');
        setFeedback(card, correct ? '✓ Excellent — that is correct.' : 'Not quite. Look at the green answer, then say it aloud.', correct);
        if (correct) award(card.dataset.exercise);
      });
    });
  });

  // Input / select group checks
  document.querySelectorAll('.check-fill').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.target;
      const container = document.getElementById(id);
      if (!container) return;
      const fields = [...container.querySelectorAll('[data-answer]')];
      let good = 0;
      fields.forEach(field => {
        const answers = [field.dataset.answer, field.dataset.alt].filter(Boolean).map(normalize);
        const isCorrect = answers.includes(normalize(field.value));
        field.style.outline = isCorrect ? '3px solid rgba(44,118,99,.35)' : '3px solid rgba(231,119,97,.38)';
        if (isCorrect) good++;
      });
      const ok = good === fields.length;
      setFeedback(container, ok ? `✓ Perfect — ${good}/${fields.length}.` : `${good}/${fields.length} correct. Check the highlighted answer(s) and try again.`, ok);
      if (ok) award(id, 2);
    });
  });

  document.querySelectorAll('.show-fill').forEach(button => {
    button.addEventListener('click', () => {
      const container = document.getElementById(button.dataset.target);
      if (!container) return;
      container.querySelectorAll('[data-answer]').forEach(field => {
        field.value = field.dataset.answer;
        field.style.outline = '3px solid rgba(44,118,99,.25)';
      });
      setFeedback(container, 'Answers are shown. Read each full sentence aloud once.', true);
    });
  });

  // Word-order sentence builder
  const builder = document.querySelector('.sentence-builder');
  const builtSentence = builder.querySelector('.built-sentence');
  const wordButtons = [...document.querySelectorAll('.word-bank button')];
  function renderBuilder() {
    builtSentence.textContent = state.builtWords.length ? state.builtWords.join(' ') : 'Click the words to build the sentence.';
  }
  wordButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.builtWords.push(button.textContent);
      button.classList.add('used');
      renderBuilder();
    });
  });
  builder.querySelector('.check-builder').addEventListener('click', () => {
    const answer = builder.dataset.answer;
    const built = state.builtWords.join(' ') + (state.builtWords.length ? '.' : '');
    const ok = normalize(built) === normalize(answer);
    setFeedback(builder, ok ? '✓ Great sentence!' : 'Not yet. Start with “She” and remember: works + in + a fitness centre.', ok);
    if (ok) award('presentOrder');
  });
  builder.querySelector('.reset-builder').addEventListener('click', () => {
    state.builtWords = [];
    wordButtons.forEach(b => b.classList.remove('used'));
    renderBuilder();
    setFeedback(builder, '', true);
  });

  // Transcript
  document.querySelector('.transcript-toggle').addEventListener('click', e => {
    const target = document.getElementById(e.currentTarget.dataset.target);
    target.classList.toggle('hidden');
    e.currentTarget.textContent = target.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
  });

  // Reveal model toggle
  document.querySelectorAll('.reveal-model').forEach(button => {
    button.addEventListener('click', () => {
      const model = document.querySelector('.model-answer');
      model.classList.toggle('hidden');
      if (button.classList.contains('alt')) {
        model.classList.add('hidden');
        button.textContent = '2. Model hidden — now speak from the prompts';
      }
    });
  });
  document.querySelector('.reveal-lilate').addEventListener('click', e => {
    const model = document.querySelector('.lilate-model');
    model.classList.toggle('hidden');
    e.currentTarget.textContent = model.classList.contains('hidden') ? 'Show a possible answer' : 'Hide the model answer';
  });

  // Personal speaking card
  document.getElementById('buildScript').addEventListener('click', () => {
    const card = document.getElementById('personalCard');
    const fields = [...document.querySelectorAll('.script-lines input')].map(i => i.value.trim() || i.placeholder);
    const [name, country, city, role, people, uk, workplace] = fields;
    const text = `Hello, my name is ${name}. I am from ${country} and I live in ${city}. I am a ${role}. I work with ${people}. I would like to move to ${uk}. I want to find a job in ${workplace}.`;
    document.getElementById('personalText').textContent = text;
    state.generatedSpeech = text;
    card.classList.remove('hidden');
    award('personalCard', 2);
  });
  document.querySelector('.speak-generated').addEventListener('click', () => {
    if (state.generatedSpeech) speak(state.generatedSpeech);
  });

  // Reset all
  document.getElementById('resetAll').addEventListener('click', () => {
    if (!confirm('Reset all answers and your score?')) return;
    state.score = 0; state.completed.clear(); state.builtWords = [];
    scoreEl.textContent = '0'; warmupEl.textContent = '0 / 2';
    document.querySelectorAll('.choice-list button').forEach(b => { b.disabled = false; b.classList.remove('correct','incorrect'); });
    document.querySelectorAll('.feedback').forEach(el => { el.textContent = ''; el.classList.remove('success','error'); });
    document.querySelectorAll('input[data-answer],select[data-answer]').forEach(el => { el.value = ''; el.style.outline = ''; });
    document.querySelectorAll('.script-lines input').forEach(el => el.value='');
    document.getElementById('personalCard').classList.add('hidden');
    wordButtons.forEach(b => b.classList.remove('used')); renderBuilder();
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();
