(() => {
  'use strict';

  const state = { completed: new Set(), total: 0, builderWords: [] };
  const normalise = value => value.trim().toLowerCase().replace(/[.?!]/g, '').replace(/\s+/g, ' ');
  const feedback = (card, message, ok) => {
    const box = card.querySelector('.feedback');
    if (!box) return;
    box.textContent = message;
    box.classList.toggle('ok', ok);
    box.classList.toggle('no', !ok);
  };
  const markComplete = id => {
    if (state.completed.has(id)) return;
    state.completed.add(id);
    updateScore();
  };
  const updateScore = () => {
    const out = document.getElementById('scoreDisplay');
    if (out) out.textContent = `${state.completed.size} / ${state.total}`;
  };

  document.querySelectorAll('[data-exercise]').forEach(el => state.total += 1);
  updateScore();

  // British-English manual text-to-speech
  let britishVoice = null;
  const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    britishVoice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /United Kingdom|British/i.test(v.name)) || voices.find(v => /^en/i.test(v.lang)) || null;
  };
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  document.querySelectorAll('.speak').forEach(button => {
    button.addEventListener('click', () => {
      const text = button.dataset.speech || button.textContent;
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = .78;
      utterance.pitch = 1;
      if (britishVoice) utterance.voice = britishVoice;
      speechSynthesis.speak(utterance);
    });
  });

  // Translation toggle
  const toggle = document.getElementById('translationToggle');
  toggle?.addEventListener('click', () => {
    document.body.classList.toggle('translations-hidden');
    const hidden = document.body.classList.contains('translations-hidden');
    toggle.textContent = hidden ? '🇫🇷 Show French' : '🇫🇷 Hide French';
    toggle.setAttribute('aria-pressed', String(hidden));
  });
  document.getElementById('printBtn')?.addEventListener('click', () => window.print());

  // Multiple choice exercises
  document.querySelectorAll('.choice-exercise').forEach(card => {
    card.querySelectorAll('.choice-list button').forEach(button => {
      button.addEventListener('click', () => {
        const isCorrect = button.dataset.correct === 'true';
        card.querySelectorAll('.choice-list button').forEach(btn => {
          btn.disabled = true;
          if (btn.dataset.correct === 'true') btn.classList.add('correct');
        });
        if (!isCorrect) button.classList.add('wrong');
        feedback(card, isCorrect ? 'Excellent — that is correct.' : 'Not quite. Read the green answer, then try to say it aloud.', isCorrect);
        if (isCorrect) markComplete(card.dataset.exercise);
      });
    });
  });

  // Inputs and selects
  document.querySelectorAll('.input-exercise, .select-exercise, .correction-exercise').forEach(card => {
    card.querySelector('.check-btn')?.addEventListener('click', () => {
      const fields = [...card.querySelectorAll('[data-answer]')];
      if (!fields.length) return;
      let correct = 0;
      fields.forEach(field => {
        const expected = normalise(field.dataset.answer);
        const actual = normalise(field.value || '');
        const ok = actual === expected;
        field.classList.toggle('field-correct', ok);
        field.classList.toggle('field-wrong', !ok);
        if (ok) correct += 1;
      });
      const all = correct === fields.length;
      feedback(card, all ? 'Perfect — every answer is correct.' : `${correct} / ${fields.length} correct. Check the grammar rule and try again.`, all);
      if (all) markComplete(card.dataset.exercise);
    });
  });

  // Sentence builder
  const builder = document.querySelector('.sentence-builder');
  if (builder) {
    const bank = builder.querySelector('.word-bank');
    const display = builder.querySelector('.built-sentence');
    const renderBuilder = () => display.textContent = state.builderWords.join(' ');
    bank.querySelectorAll('button').forEach(word => {
      word.addEventListener('click', () => {
        state.builderWords.push(word.textContent.trim());
        word.classList.add('used');
        renderBuilder();
      });
    });
    builder.querySelector('.check-builder')?.addEventListener('click', () => {
      const target = normalise(bank.dataset.target || '');
      const answer = normalise(state.builderWords.join(' '));
      const ok = answer === target;
      feedback(builder, ok ? 'Great sentence. Now read it slowly.' : 'Almost. Think: subject + are + verb-ing + for + noun.', ok);
      if (ok) markComplete(builder.dataset.exercise);
    });
    builder.querySelector('.reset-builder')?.addEventListener('click', () => {
      state.builderWords = [];
      bank.querySelectorAll('button').forEach(btn => btn.classList.remove('used'));
      renderBuilder();
      feedback(builder, '', true);
    });
  }

  // Confidence finish
  document.getElementById('finishBtn')?.addEventListener('click', () => {
    const boxes = [...document.querySelectorAll('.confidence-grid input')];
    const count = boxes.filter(box => box.checked).length;
    const message = document.getElementById('finalMessage');
    if (!count) message.textContent = 'Choose one sentence you can say today — every step counts.';
    else if (count < boxes.length) message.textContent = `Great work. You selected ${count} skill${count > 1 ? 's' : ''}. Keep practising the model sentences aloud.`;
    else message.textContent = 'Excellent. You are ready to use these sentences in a short LILATE-style conversation.';
  });
})();
