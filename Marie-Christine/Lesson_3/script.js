(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const toast = $('#toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch { return false; }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    }
  };

  const normalize = (value = '') => value
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ');

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      let result = false;
      try { result = document.execCommand('copy'); } catch { result = false; }
      area.remove();
      return result;
    }
  };

  const downloadText = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Translation, print and font controls
  const translationToggle = $('#translationToggle');
  const storedTranslation = safeStorage.get('mc_l3_translation');
  if (translationToggle && storedTranslation !== null) translationToggle.checked = storedTranslation === 'true';
  const applyTranslation = () => {
    document.body.classList.toggle('hide-fr', translationToggle && !translationToggle.checked);
    if (translationToggle) safeStorage.set('mc_l3_translation', String(translationToggle.checked));
  };
  translationToggle?.addEventListener('change', applyTranslation);
  applyTranslation();

  const fontStates = ['font-small', '', 'font-large', 'font-xlarge'];
  let fontIndex = Number(safeStorage.get('mc_l3_font_index') || 1);
  if (!Number.isFinite(fontIndex) || fontIndex < 0 || fontIndex > 3) fontIndex = 1;
  const applyFont = () => {
    document.body.classList.remove('font-small', 'font-large', 'font-xlarge');
    if (fontStates[fontIndex]) document.body.classList.add(fontStates[fontIndex]);
    safeStorage.set('mc_l3_font_index', String(fontIndex));
  };
  $$('[data-font]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.font;
    if (action === 'minus') fontIndex = Math.max(0, fontIndex - 1);
    if (action === 'plus') fontIndex = Math.min(3, fontIndex + 1);
    if (action === 'reset') fontIndex = 1;
    applyFont();
  }));
  applyFont();
  $('#printBtn')?.addEventListener('click', () => window.print());

  // Text-to-speech
  let voices = [];
  const loadVoices = () => { voices = window.speechSynthesis?.getVoices?.() || []; };
  loadVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const language = $('#accentSelect')?.value || 'en-GB';
    const rate = Number($('#speedSelect')?.value || 0.86);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = 1;
    const exact = voices.find(voice => voice.lang.toLowerCase() === language.toLowerCase());
    const partial = voices.find(voice => voice.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase()));
    if (exact || partial) utterance.voice = exact || partial;
    window.speechSynthesis.speak(utterance);
  };
  $$('.speak-btn').forEach(button => button.addEventListener('click', () => {
    const text = button.dataset.speak || button.closest('.builder-output')?.querySelector('p')?.textContent || '';
    if (text.trim()) speak(text.trim());
  }));

  // Hints and transcripts
  $$('.hint-btn').forEach(button => button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    if (!content) return;
    content.classList.toggle('open');
    const isOpen = content.classList.contains('open');
    button.textContent = isOpen
      ? (button.dataset.hideLabel || 'Hide support')
      : (button.dataset.showLabel || 'Show support');
  }));
  $$('.transcript-btn').forEach(button => button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target || '');
    if (!target) return;
    target.classList.toggle('open');
    const isOpen = target.classList.contains('open');
    button.textContent = isOpen
      ? (button.dataset.hideLabel || 'Hide transcript')
      : (button.dataset.showLabel || 'Show transcript');
  }));

  // Vocabulary tabs
  $$('.vocab-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.vocab-tab').forEach(item => item.classList.remove('active'));
    $$('.vocab-panel').forEach(panel => panel.classList.remove('active'));
    tab.classList.add('active');
    $(`.vocab-panel[data-panel="${tab.dataset.vocab}"]`)?.classList.add('active');
  }));

  // Generic model selectors
  $$('.model-level').forEach(button => button.addEventListener('click', () => {
    const group = button.dataset.modelGroup;
    const level = button.dataset.level;
    $$(`.model-level[data-model-group="${group}"]`).forEach(item => item.classList.remove('active'));
    $$(`[data-model-display^="${group}-"]`).forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    $(`[data-model-display="${group}-${level}"]`)?.classList.add('active');
  }));

  // Vocabulary sentence builder
  const vocabBuilderControls = [$('#builderStart'), $('#builderMiddle'), $('#builderEnd')];
  const updateVocabBuilder = () => {
    const sentence = vocabBuilderControls.map(control => control?.value || '').filter(Boolean).join(' ');
    if ($('#vocabBuilderOutput')) $('#vocabBuilderOutput').textContent = sentence || 'Choose one, two or three parts to build your sentence.';
  };
  vocabBuilderControls.forEach(control => control?.addEventListener('change', updateVocabBuilder));
  $('#resetVocabBuilder')?.addEventListener('click', () => {
    vocabBuilderControls.forEach(control => { if (control) control.selectedIndex = 0; });
    updateVocabBuilder();
  });
  $('#speakVocabBuilder')?.addEventListener('click', () => {
    const text = $('#vocabBuilderOutput')?.textContent || '';
    if (!text.startsWith('Choose')) speak(text);
  });

  // Host paragraph builder
  const hostControls = [$('#hostWelcome'), $('#hostOffer'), $('#hostPlan'), $('#hostClose')];
  const updateHostBuilder = () => {
    const text = hostControls.map(control => control?.value || '').filter(Boolean).join(' ');
    if ($('#hostBuilderOutput')) $('#hostBuilderOutput').textContent = text || 'Choose your ideas and create a personalised welcome.';
  };
  hostControls.forEach(control => control?.addEventListener('change', updateHostBuilder));
  $('#generateHostModel')?.addEventListener('click', () => {
    const defaults = [1, 1, 1, 1];
    hostControls.forEach((control, index) => {
      if (control && !control.value) control.selectedIndex = defaults[index];
    });
    updateHostBuilder();
    showToast('A complete host model was created.');
  });
  $('#speakHostBuilder')?.addEventListener('click', () => {
    const text = $('#hostBuilderOutput')?.textContent || '';
    if (!text.startsWith('Choose')) speak(text);
  });

  // Quiz engine
  const quizIds = ['tenseQuiz', 'hostListeningQuiz', 'guestListeningQuiz', 'clarifyQuiz', 'finalQuiz'];
  const updateQuizScore = (container) => {
    if (!container) return;
    const items = $$('.quiz-item', container);
    const correct = items.filter(item => item.dataset.correct === 'true').length;
    const score = $(`[data-score-current="${container.id}"]`);
    if (score) score.textContent = String(correct);
    updateDashboard();
  };

  quizIds.forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    $$('.quiz-item', container).forEach(item => {
      const answer = item.dataset.answer || '';
      $$('button', item).forEach(button => button.addEventListener('click', () => {
        if (item.dataset.completed === 'true') return;
        const correct = normalize(button.textContent) === normalize(answer);
        item.dataset.completed = 'true';
        item.dataset.correct = String(correct);
        $$('button', item).forEach(choice => {
          choice.disabled = true;
          if (normalize(choice.textContent) === normalize(answer)) choice.classList.add('correct');
        });
        if (!correct) button.classList.add('incorrect');
        const feedback = $('.feedback', item);
        if (feedback) {
          feedback.textContent = correct ? '✓ Correct — well done.' : `The best answer is: ${answer}`;
          feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
        }
        updateQuizScore(container);
      }));
    });
  });

  $$('.reset-quiz').forEach(button => button.addEventListener('click', () => {
    const container = document.getElementById(button.dataset.reset || '');
    if (!container) return;
    $$('.quiz-item', container).forEach(item => {
      delete item.dataset.completed;
      delete item.dataset.correct;
      $$('button', item).forEach(choice => {
        choice.disabled = false;
        choice.classList.remove('correct', 'incorrect');
      });
      const feedback = $('.feedback', item);
      if (feedback) { feedback.textContent = ''; feedback.className = 'feedback'; }
    });
    updateQuizScore(container);
    showToast('The exercise was reset.');
  }));

  // Fill-in engine
  const checkFill = (container) => {
    const inputs = $$('input[data-answer]', container);
    let correct = 0;
    inputs.forEach(input => {
      const isCorrect = normalize(input.value) === normalize(input.dataset.answer || '');
      input.dataset.correct = String(isCorrect);
      input.classList.toggle('correct', isCorrect);
      input.classList.toggle('incorrect', !isCorrect);
      if (isCorrect) correct += 1;
    });
    const score = $(`[data-score-current="${container.id}"]`);
    if (score) score.textContent = String(correct);
    const feedback = $(`#${container.id}Feedback`);
    if (feedback) {
      feedback.textContent = correct === inputs.length ? '✓ Excellent — every question is complete.' : `${correct} / ${inputs.length} correct. Review the highlighted answers.`;
      feedback.className = `block-feedback ${correct === inputs.length ? 'good' : 'bad'}`;
    }
    updateDashboard();
  };
  $$('.check-fill').forEach(button => button.addEventListener('click', () => {
    const container = document.getElementById(button.dataset.check || '');
    if (container) checkFill(container);
  }));
  $$('.reset-fill').forEach(button => button.addEventListener('click', () => {
    const container = document.getElementById(button.dataset.resetFill || '');
    if (!container) return;
    $$('input[data-answer]', container).forEach(input => {
      input.value = '';
      delete input.dataset.correct;
      input.classList.remove('correct', 'incorrect');
    });
    const score = $(`[data-score-current="${container.id}"]`);
    if (score) score.textContent = '0';
    const feedback = $(`#${container.id}Feedback`);
    if (feedback) feedback.textContent = '';
    updateDashboard();
  }));

  // Message-taking task
  const messageFields = [
    { id: 'msgName', checks: ['daniel cooper'] },
    { id: 'msgTime', checks: ['friday', '4:45', '4.45', 'four forty five', '16:45', '16.45'] },
    { id: 'msgPlace', checks: ['lille europe', 'station', 'main entrance'] },
    { id: 'msgProblem', checks: ['cancelled', 'canceled', 'late', 'one hour'] },
    { id: 'msgAction', checks: ['pick', 'collect', 'meet'] },
    { id: 'msgDetails', checks: ['blue', 'red', 'suitcase', '06', 'phone'] }
  ];
  $('#checkMessage')?.addEventListener('click', () => {
    let correct = 0;
    messageFields.forEach(field => {
      const input = document.getElementById(field.id);
      const text = normalize(input?.value || '');
      const valid = field.checks.some(check => text.includes(normalize(check)));
      if (input) {
        input.dataset.correct = String(valid);
        input.classList.toggle('correct', valid);
        input.classList.toggle('incorrect', !valid);
      }
      if (valid) correct += 1;
    });
    const feedback = $('#messageFeedback');
    if (feedback) {
      feedback.textContent = correct >= 5 ? `✓ ${correct} / 6 key details identified. Your notes are operational.` : `${correct} / 6 key details identified. Listen again and add the missing information.`;
      feedback.className = `block-feedback ${correct >= 5 ? 'good' : 'bad'}`;
    }
    updateDashboard();
  });
  $('#copyMessage')?.addEventListener('click', async () => {
    const text = [
      'VISITOR MESSAGE',
      `Name: ${$('#msgName')?.value || '—'}`,
      `Day and time: ${$('#msgTime')?.value || '—'}`,
      `Place: ${$('#msgPlace')?.value || '—'}`,
      `Problem: ${$('#msgProblem')?.value || '—'}`,
      `Action requested: ${$('#msgAction')?.value || '—'}`,
      `Identification details: ${$('#msgDetails')?.value || '—'}`
    ].join('\n');
    await copyText(text);
    showToast('Your visitor notes were copied.');
  });

  // Writing workspace
  const writingText = $('#writingText');
  const updateWordCount = () => {
    const words = (writingText?.value.trim().match(/\b[\w’'-]+\b/g) || []).length;
    if ($('#wordCount')) $('#wordCount').textContent = String(words);
  };
  if (writingText) {
    writingText.value = safeStorage.get('mc_l3_writing') || '';
    writingText.addEventListener('input', updateWordCount);
    updateWordCount();
  }
  $('#saveWriting')?.addEventListener('click', () => {
    const saved = safeStorage.set('mc_l3_writing', writingText?.value || '');
    if ($('#writingFeedback')) {
      $('#writingFeedback').textContent = saved ? '✓ Your message was saved on this device.' : 'Local saving is unavailable. Please download your work.';
      $('#writingFeedback').className = `block-feedback ${saved ? 'good' : 'bad'}`;
    }
  });
  $('#copyWriting')?.addEventListener('click', async () => {
    await copyText(writingText?.value || '');
    showToast('Your written message was copied.');
  });
  $('#downloadWriting')?.addEventListener('click', () => downloadText(writingText?.value || '', 'Marie-Christine-Lesson-3-Writing.txt'));

  // Random scenarios
  const scenarios = [
    {
      title: 'A visitor arrives earlier than expected',
      text: 'Your guest arrives two hours early. You are not at home yet. Explain what the person should do, confirm where to wait and reassure them.',
      model: 'I understand that you have arrived earlier than expected. Are you inside the station or near the main entrance? Please wait in the café opposite platform six. I will be there in approximately thirty minutes. So, you will wait in the café and keep your telephone on. Is that all right?'
    },
    {
      title: 'Your train is delayed during a family visit',
      text: 'You are travelling to Montreal. Your train to the airport is delayed, and you may miss your flight. Explain the problem, ask for help and confirm the new plan.',
      model: 'My train to the airport has been delayed, and I may miss my flight. Could you check whether I can change to a later flight? I would also like to know whether there is another way to reach the airport. So, I should take the next express train and speak to the airline desk when I arrive. Is that correct?'
    },
    {
      title: 'A guest does not understand the local transport',
      text: 'Your visitor wants to go to a nearby town but is confused by the bus timetable. Ask where they want to go, explain the best route and check the departure time.',
      model: 'Which town would you like to visit, and what time would you like to arrive? The simplest option is to take the number twelve bus from the main square. It leaves at ten twenty and the journey takes about forty minutes. So, you need to be at the bus stop before ten fifteen. Is that clear?'
    },
    {
      title: 'You cannot find your suitcase',
      text: 'You arrive in Boston, but your suitcase is missing. Explain the situation, give identifying details and ask what will happen next.',
      model: 'My suitcase has not arrived. It is a medium-sized red suitcase with a black label. My name and telephone number are written on the label. Could you tell me when it may be delivered and whether I need to complete a form? So, you will contact me as soon as the suitcase is found. Is that correct?'
    },
    {
      title: 'A guest has a food allergy',
      text: 'Your visitor tells you about a food allergy just before dinner. Clarify the allergy, offer alternatives and confirm what is safe.',
      model: 'Thank you for telling me. Could you explain exactly which foods you cannot eat? I can prepare a separate meal without nuts, and I will check all the ingredients carefully. So, the vegetable dish and the rice are safe for you, but you should avoid the dessert. Is that right?'
    }
  ];
  let scenarioIndex = 0;
  const renderScenario = () => {
    const scenario = scenarios[scenarioIndex];
    if ($('#scenarioTitle')) $('#scenarioTitle').textContent = scenario.title;
    if ($('#scenarioText')) $('#scenarioText').textContent = scenario.text;
    if ($('#scenarioModel')) {
      $('#scenarioModel').classList.remove('open');
      $('#scenarioModel').textContent = scenario.model;
    }
  };
  $('#newScenario')?.addEventListener('click', () => {
    let next = scenarioIndex;
    while (next === scenarioIndex && scenarios.length > 1) next = Math.floor(Math.random() * scenarios.length);
    scenarioIndex = next;
    renderScenario();
    showToast('A new LILATE-style scenario is ready.');
  });
  $('#showScenarioModel')?.addEventListener('click', () => {
    $('#scenarioModel')?.classList.toggle('open');
  });
  $('#copySimulation')?.addEventListener('click', async () => {
    const scenario = scenarios[scenarioIndex];
    const text = [
      scenario.title,
      scenario.text,
      '',
      `UNDERSTAND: ${$('#simUnderstand')?.value || '—'}`,
      `CLARIFY: ${$('#simClarify')?.value || '—'}`,
      `RESPOND: ${$('#simRespond')?.value || '—'}`,
      `CONFIRM: ${$('#simConfirm')?.value || '—'}`
    ].join('\n');
    await copyText(text);
    showToast('Your simulation response was copied.');
  });
  renderScenario();

  // Audio recorder
  let mediaRecorder;
  let audioChunks = [];
  let audioUrl = '';
  let timerInterval;
  let seconds = 0;
  const formatTime = total => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  const recordBtn = $('#recordBtn');
  const stopBtn = $('#stopBtn');
  const audioPlayback = $('#audioPlayback');
  const downloadRecording = $('#downloadRecording');
  const recordTimer = $('#recordTimer');
  const recordDot = $('#recordDot');

  recordBtn?.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      if ($('#recorderNote')) $('#recorderNote').textContent = 'Recording is not supported in this browser. You can use your telephone recorder instead.';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => { if (event.data.size) audioChunks.push(event.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = URL.createObjectURL(blob);
        if (audioPlayback) { audioPlayback.src = audioUrl; audioPlayback.hidden = false; }
        if (downloadRecording) {
          downloadRecording.href = audioUrl;
          downloadRecording.download = 'Marie-Christine-Lesson-3-Speaking.webm';
          downloadRecording.hidden = false;
        }
        stream.getTracks().forEach(track => track.stop());
        if ($('#recorderNote')) $('#recorderNote').textContent = 'Your recording is ready. Listen to it, then download it if you want to keep it.';
      };
      mediaRecorder.start();
      seconds = 0;
      if (recordTimer) recordTimer.textContent = '00:00';
      timerInterval = window.setInterval(() => {
        seconds += 1;
        if (recordTimer) recordTimer.textContent = formatTime(seconds);
      }, 1000);
      recordDot?.classList.add('live');
      recordBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = false;
      if (audioPlayback) audioPlayback.hidden = true;
      if (downloadRecording) downloadRecording.hidden = true;
    } catch {
      if ($('#recorderNote')) $('#recorderNote').textContent = 'Microphone access was not granted. Please allow microphone access in your browser settings.';
    }
  });
  stopBtn?.addEventListener('click', () => {
    if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
    window.clearInterval(timerInterval);
    recordDot?.classList.remove('live');
    if (recordBtn) recordBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // Personal notes and manual evaluation persistence
  const storedFieldIds = ['vocabNotes', 'proudSentence', 'nextGoal', 'speakingComment', 'writingComment', 'evaluationComments', 'speakingStatus', 'writingStatus'];
  storedFieldIds.forEach(id => {
    const field = document.getElementById(id);
    const stored = safeStorage.get(`mc_l3_${id}`);
    if (field && stored !== null) field.value = stored;
    field?.addEventListener('change', () => safeStorage.set(`mc_l3_${id}`, field.value));
  });
  $('#saveNotes')?.addEventListener('click', () => {
    const ids = ['vocabNotes', 'proudSentence', 'nextGoal'];
    const saved = ids.map(id => safeStorage.set(`mc_l3_${id}`, document.getElementById(id)?.value || '')).every(Boolean);
    if ($('#saveMessage')) $('#saveMessage').textContent = saved ? '✓ Saved' : 'Storage unavailable — download your notes instead';
    showToast(saved ? 'Your notes were saved on this device.' : 'Local saving is unavailable.');
  });
  const notesText = () => [
    'MARIE-CHRISTINE — LESSON 3 NOTES',
    'Welcome to My World — LILATE Visit Mission',
    '',
    'NEW WORDS I WANT TO REMEMBER',
    $('#vocabNotes')?.value || '—',
    '',
    'A SENTENCE I AM PROUD OF',
    $('#proudSentence')?.value || '—',
    '',
    'MY NEXT SPEAKING GOAL',
    $('#nextGoal')?.value || '—'
  ].join('\n');
  $('#copyNotes')?.addEventListener('click', async () => { await copyText(notesText()); showToast('Your notes were copied.'); });
  $('#downloadNotes')?.addEventListener('click', () => downloadText(notesText(), 'Marie-Christine-Lesson-3-Notes.txt'));

  // Dashboard calculations
  const resultFor = (id) => {
    const container = document.getElementById(id);
    if (!container) return { correct: 0, total: 0 };
    const quizItems = $$('.quiz-item', container);
    if (quizItems.length) return { correct: quizItems.filter(item => item.dataset.correct === 'true').length, total: quizItems.length };
    const inputs = $$('input[data-answer]', container);
    if (inputs.length) return { correct: inputs.filter(input => input.dataset.correct === 'true').length, total: inputs.length };
    return { correct: 0, total: 0 };
  };
  const messageResult = () => ({
    correct: messageFields.filter(field => document.getElementById(field.id)?.dataset.correct === 'true').length,
    total: messageFields.length
  });
  const combine = results => results.reduce((sum, item) => ({ correct: sum.correct + item.correct, total: sum.total + item.total }), { correct: 0, total: 0 });
  const percent = result => result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const statusFor = score => {
    if (score >= 75) return { label: 'Acquis', className: 'acquired' };
    if (score >= 50) return { label: 'En voie d’acquisition', className: 'progress' };
    return { label: 'En cours', className: '' };
  };
  const setDashboardItem = (prefix, result) => {
    const score = percent(result);
    const status = statusFor(score);
    const scoreEl = $(`#${prefix}Score`);
    const statusEl = $(`#${prefix}Status`);
    if (scoreEl) scoreEl.textContent = `${score}%`;
    if (statusEl) { statusEl.textContent = status.label; statusEl.className = `status-chip ${status.className}`.trim(); }
    return result;
  };
  function updateDashboard() {
    const vocab = setDashboardItem('vocab', combine([resultFor('finalQuiz')]));
    const grammar = setDashboardItem('grammar', combine([resultFor('tenseQuiz'), resultFor('guestFill')]));
    const listening = setDashboardItem('listening', combine([resultFor('hostListeningQuiz'), resultFor('guestListeningQuiz')]));
    const interaction = setDashboardItem('interaction', combine([resultFor('clarifyQuiz'), messageResult()]));
    setDashboardItem('overall', combine([vocab, grammar, listening, interaction]));
  }
  updateDashboard();

  // Satisfaction ratings
  const ratings = {};
  $$('.rating-group, .rating-buttons').forEach(group => {
    const name = group.dataset.rating;
    if (!name) return;
    const stored = safeStorage.get(`mc_l3_rating_${name}`);
    if (stored) {
      ratings[name] = stored;
      $$('button', group).forEach(button => button.classList.toggle('active', button.textContent === stored));
    }
    $$('button', group).forEach(button => button.addEventListener('click', () => {
      $$('button', group).forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      ratings[name] = button.textContent;
      safeStorage.set(`mc_l3_rating_${name}`, button.textContent);
    }));
  });

  const evaluationData = () => {
    const raw = {
      vocabulary: resultFor('finalQuiz'),
      grammar: combine([resultFor('tenseQuiz'), resultFor('guestFill')]),
      listening: combine([resultFor('hostListeningQuiz'), resultFor('guestListeningQuiz')]),
      interaction: combine([resultFor('clarifyQuiz'), messageResult()])
    };
    raw.overall = combine([raw.vocabulary, raw.grammar, raw.listening, raw.interaction]);
    return {
      generated: new Date(),
      skills: [
        { key: 'vocabulary', label: 'Vocabulary & useful expressions', ...raw.vocabulary, score: percent(raw.vocabulary), status: statusFor(percent(raw.vocabulary)).label },
        { key: 'grammar', label: 'Grammar & sentence structure', ...raw.grammar, score: percent(raw.grammar), status: statusFor(percent(raw.grammar)).label },
        { key: 'listening', label: 'Listening comprehension', ...raw.listening, score: percent(raw.listening), status: statusFor(percent(raw.listening)).label },
        { key: 'interaction', label: 'Interaction strategy', ...raw.interaction, score: percent(raw.interaction), status: statusFor(percent(raw.interaction)).label }
      ],
      overall: { ...raw.overall, score: percent(raw.overall), status: statusFor(percent(raw.overall)).label },
      speaking: { status: $('#speakingStatus')?.value || 'En cours', comments: $('#speakingComment')?.value.trim() || '—' },
      writing: { status: $('#writingStatus')?.value || 'En cours', comments: $('#writingComment')?.value.trim() || '—' },
      ratings: {
        usefulness: ratings.useful || 'Not rated',
        clarity: ratings.clear || 'Not rated',
        confidence: ratings.confidence || 'Not rated'
      },
      comments: $('#evaluationComments')?.value.trim() || 'No comments provided.'
    };
  };

  const evaluationText = () => {
    const data = evaluationData();
    return [
      'MARIE-CHRISTINE — LESSON 3 EVALUATION & PROGRESS',
      'Welcome to My World — LILATE Visit Mission',
      `Generated: ${data.generated.toLocaleString()}`,
      '',
      'AUTOMATIC RESULTS',
      `Overall objective score: ${data.overall.score}% — ${data.overall.status} (${data.overall.correct}/${data.overall.total})`,
      ...data.skills.map(skill => `${skill.label}: ${skill.score}% — ${skill.status} (${skill.correct}/${skill.total})`),
      '',
      'MANUAL SKILLS',
      `Speaking: ${data.speaking.status}`,
      `Speaking comments: ${data.speaking.comments}`,
      `Writing: ${data.writing.status}`,
      `Writing comments: ${data.writing.comments}`,
      '',
      'LEARNER FEEDBACK',
      `Usefulness: ${data.ratings.usefulness} / 5`,
      `Clarity: ${data.ratings.clarity} / 5`,
      `Confidence: ${data.ratings.confidence} / 5`,
      '',
      'COMMENTS / REQUESTS',
      data.comments
    ].join('\n');
  };

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const reportHtml = () => {
    const data = evaluationData();
    const generated = data.generated.toLocaleString();
    const skillCards = data.skills.map(skill => `
      <article class="skill-card">
        <p>${escapeHtml(skill.label)}</p>
        <strong>${skill.score}%</strong>
        <span>${escapeHtml(skill.status)}</span>
        <small>${skill.correct} / ${skill.total} validated</small>
      </article>`).join('');
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Marie-Christine - Lesson 3 Evaluation & Progress</title>
<style>
:root{--ink:#18304a;--muted:#5f7082;--paper:#fffdfa;--cream:#f7f1e8;--mist:#edf6f4;--navy:#173b57;--teal:#267f7b;--gold:#d7a94a;--coral:#d77b67;--border:rgba(23,59,87,.14)}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,sans-serif;line-height:1.55}.page{max-width:1050px;margin:0 auto;padding:34px}.hero{background:linear-gradient(135deg,var(--navy),var(--teal));color:white;border-radius:26px;padding:32px;position:relative;overflow:hidden}.hero:after{content:"";position:absolute;width:260px;height:260px;border:1px solid rgba(255,255,255,.2);border-radius:50%;right:-90px;top:-130px;box-shadow:0 0 0 45px rgba(255,255,255,.04),0 0 0 90px rgba(255,255,255,.025)}.eyebrow{color:#f0c971;font-size:12px;font-weight:800;letter-spacing:.14em}.hero h1{margin:5px 0;font-family:Georgia,serif;font-size:34px}.hero p{margin:6px 0;opacity:.86}.overall{margin-top:22px;display:flex;align-items:center;justify-content:space-between;gap:20px;background:var(--navy);color:white;border-radius:20px;padding:22px}.overall strong{font-size:44px;color:#f0c971}.overall span{display:block;font-weight:700}.skills{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.skill-card{background:white;border:1px solid var(--border);border-radius:18px;padding:18px;box-shadow:0 12px 28px rgba(24,48,74,.08)}.skill-card p{min-height:50px;margin:0;font-weight:700}.skill-card strong{display:block;font-size:30px;color:var(--teal)}.skill-card span{display:inline-block;margin:5px 0;padding:4px 8px;border-radius:999px;background:var(--mist);font-size:12px;font-weight:700}.skill-card small{display:block;color:var(--muted)}.section{margin-top:18px;background:white;border:1px solid var(--border);border-radius:20px;padding:22px}.section h2{margin:0 0 12px;font-family:Georgia,serif}.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.panel{background:var(--cream);border-radius:14px;padding:16px}.panel h3{margin:0 0 5px}.feedback{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.rating{background:var(--mist);border-radius:14px;padding:14px;text-align:center}.rating strong{display:block;font-size:26px;color:var(--teal)}.comments{white-space:pre-wrap}.footer{margin-top:20px;padding:15px;text-align:center;color:var(--muted);font-size:12px}@media(max-width:760px){.page{padding:16px}.skills,.feedback,.two{grid-template-columns:1fr}.overall{align-items:flex-start;flex-direction:column}}@media print{body{background:white}.page{max-width:none;padding:0}.hero,.overall,.section,.skill-card{-webkit-print-color-adjust:exact;print-color-adjust:exact}.skill-card{break-inside:avoid}}
</style></head><body><main class="page">
<section class="hero"><div class="eyebrow">MARIE-CHRISTINE - LESSON 3</div><h1>Evaluation & Progress Report</h1><p>Welcome to My World - LILATE Visit Mission</p><p>Generated: ${escapeHtml(generated)}</p></section>
<section class="overall"><div><h2>Overall objective result</h2><span>${escapeHtml(data.overall.status)} - ${data.overall.correct} / ${data.overall.total} validated</span></div><strong>${data.overall.score}%</strong></section>
<section class="skills">${skillCards}</section>
<section class="section"><h2>Speaking & writing evaluation</h2><div class="two"><article class="panel"><h3>Speaking - ${escapeHtml(data.speaking.status)}</h3><div class="comments">${escapeHtml(data.speaking.comments)}</div></article><article class="panel"><h3>Writing - ${escapeHtml(data.writing.status)}</h3><div class="comments">${escapeHtml(data.writing.comments)}</div></article></div></section>
<section class="section"><h2>Learner feedback</h2><div class="feedback"><div class="rating">Usefulness<strong>${escapeHtml(data.ratings.usefulness)} / 5</strong></div><div class="rating">Clarity<strong>${escapeHtml(data.ratings.clarity)} / 5</strong></div><div class="rating">Confidence<strong>${escapeHtml(data.ratings.confidence)} / 5</strong></div></div></section>
<section class="section"><h2>Comments / requests</h2><div class="comments">${escapeHtml(data.comments)}</div></section>
<div class="footer">Marie-Christine - Lesson 3 - Personalised LILATE preparation</div>
</main></body></html>`;
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  };

  const pdfSafeText = (value = '') => String(value)
    .replace(/[–—]/g, '-')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, '?');

  const pdfEscape = value => pdfSafeText(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const cp1252Byte = char => {
    const map = { '€':128, '‚':130, 'ƒ':131, '„':132, '…':133, '†':134, '‡':135, 'ˆ':136, '‰':137, 'Š':138, '‹':139, 'Œ':140, 'Ž':142, '‘':145, '’':146, '“':147, '”':148, '•':149, '–':150, '—':151, '˜':152, '™':153, 'š':154, '›':155, 'œ':156, 'ž':158, 'Ÿ':159 };
    return map[char] ?? (char.charCodeAt(0) <= 255 ? char.charCodeAt(0) : 63);
  };
  const binaryLength = value => value.length;
  const binaryBytes = value => Uint8Array.from([...value].map(cp1252Byte));

  const createEvaluationPdf = () => {
    const data = evaluationData();
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 42;
    const contentWidth = pageWidth - margin * 2;
    const pages = [];
    let commands = [];
    let y = pageHeight - margin;

    const rgb = hex => {
      const clean = hex.replace('#', '');
      return [0, 2, 4].map(i => parseInt(clean.slice(i, i + 2), 16) / 255);
    };
    const color = hex => rgb(hex).map(v => v.toFixed(3)).join(' ');
    const add = command => commands.push(command);
    const rect = (x, top, w, h, fill) => add(`${color(fill)} rg ${x.toFixed(2)} ${(top - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
    const line = (x1, y1, x2, y2, stroke, width = 1) => add(`${color(stroke)} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
    const text = (value, x, baseline, size = 11, font = 'F1', fill = '#18304a') => add(`BT /${font} ${size} Tf ${color(fill)} rg 1 0 0 1 ${x.toFixed(2)} ${baseline.toFixed(2)} Tm (${pdfEscape(value)}) Tj ET`);
    const approxWidth = (value, size) => pdfSafeText(value).length * size * 0.52;
    const wrap = (value, maxWidth, size) => {
      const paragraphs = String(value || '').split(/\n/);
      const lines = [];
      paragraphs.forEach((paragraph, pIndex) => {
        const words = pdfSafeText(paragraph).split(/\s+/).filter(Boolean);
        if (!words.length) lines.push('');
        let current = '';
        words.forEach(word => {
          const trial = current ? `${current} ${word}` : word;
          if (current && approxWidth(trial, size) > maxWidth) { lines.push(current); current = word; }
          else current = trial;
        });
        if (current) lines.push(current);
        if (pIndex < paragraphs.length - 1) lines.push('');
      });
      return lines;
    };
    const newPage = () => {
      if (commands.length) pages.push(commands.join('\n'));
      commands = [];
      y = pageHeight - margin;
      rect(0, pageHeight, pageWidth, 18, '#173b57');
      text('MARIE-CHRISTINE - LESSON 3 - LILATE VISIT MISSION', margin, pageHeight - 13, 7.5, 'F2', '#ffffff');
      y -= 22;
    };
    const ensure = height => { if (y - height < margin + 20) newPage(); };
    const wrappedText = (value, x, width, size = 10.5, leading = 14, fill = '#18304a', font = 'F1') => {
      const lines = wrap(value, width, size);
      ensure(lines.length * leading + 4);
      lines.forEach(lineValue => { text(lineValue || ' ', x, y, size, font, fill); y -= leading; });
      return lines.length;
    };
    const sectionTitle = value => {
      ensure(38);
      y -= 5;
      text(value.toUpperCase(), margin, y, 8.2, 'F2', '#267f7b');
      y -= 18;
      line(margin, y + 7, pageWidth - margin, y + 7, '#d7a94a', 1.2);
    };

    // Page 1 hero
    rect(0, pageHeight, pageWidth, 170, '#173b57');
    rect(pageWidth - 170, pageHeight - 20, 170, 150, '#267f7b');
    text('MARIE-CHRISTINE - LESSON 3', margin, pageHeight - 46, 9, 'F2', '#f0c971');
    text('Evaluation & Progress Report', margin, pageHeight - 78, 23, 'F2', '#ffffff');
    text('Welcome to My World - LILATE Visit Mission', margin, pageHeight - 103, 11, 'F1', '#ffffff');
    text(`Generated: ${data.generated.toLocaleString()}`, margin, pageHeight - 125, 8.5, 'F1', '#dbe9e7');
    y = pageHeight - 198;

    rect(margin, y + 14, contentWidth, 82, '#edf6f4');
    text('OVERALL OBJECTIVE RESULT', margin + 18, y - 7, 8, 'F2', '#267f7b');
    text(`${data.overall.score}%`, margin + 18, y - 42, 27, 'F2', '#173b57');
    text(data.overall.status, margin + 125, y - 27, 12, 'F2', '#18304a');
    text(`${data.overall.correct} / ${data.overall.total} validated activities`, margin + 125, y - 48, 9, 'F1', '#5f7082');
    y -= 100;

    sectionTitle('Automatic results');
    const cardGap = 8;
    const cardWidth = (contentWidth - cardGap) / 2;
    data.skills.forEach((skill, index) => {
      if (index % 2 === 0) ensure(86);
      const col = index % 2;
      const x = margin + col * (cardWidth + cardGap);
      rect(x, y + 12, cardWidth, 76, col ? '#f7f1e8' : '#edf6f4');
      text(skill.label, x + 12, y - 8, 8.7, 'F2', '#18304a');
      text(`${skill.score}%`, x + 12, y - 35, 21, 'F2', '#267f7b');
      text(skill.status, x + 80, y - 29, 8.2, 'F2', '#18304a');
      text(`${skill.correct}/${skill.total} validated`, x + 80, y - 46, 7.8, 'F1', '#5f7082');
      if (col === 1 || index === data.skills.length - 1) y -= 88;
    });

    sectionTitle('Speaking & writing evaluation');
    text(`Speaking - ${data.speaking.status}`, margin, y, 11, 'F2', '#173b57'); y -= 18;
    wrappedText(data.speaking.comments, margin + 8, contentWidth - 8, 9.5, 13, '#18304a'); y -= 8;
    text(`Writing - ${data.writing.status}`, margin, y, 11, 'F2', '#173b57'); y -= 18;
    wrappedText(data.writing.comments, margin + 8, contentWidth - 8, 9.5, 13, '#18304a'); y -= 5;

    sectionTitle('Learner feedback');
    const feedbackItems = [
      ['Usefulness', data.ratings.usefulness],
      ['Clarity', data.ratings.clarity],
      ['Confidence', data.ratings.confidence]
    ];
    const boxWidth = (contentWidth - 16) / 3;
    ensure(68);
    feedbackItems.forEach((item, index) => {
      const x = margin + index * (boxWidth + 8);
      rect(x, y + 12, boxWidth, 54, index === 1 ? '#f7f1e8' : '#edf6f4');
      text(item[0], x + 10, y - 6, 8.2, 'F2', '#18304a');
      text(`${item[1]} / 5`, x + 10, y - 31, 18, 'F2', '#267f7b');
    });
    y -= 72;

    sectionTitle('Comments / requests');
    wrappedText(data.comments, margin, contentWidth, 9.5, 13, '#18304a');

    if (commands.length) pages.push(commands.join('\n'));

    const objects = [];
    const addObject = content => { objects.push(content); return objects.length; };
    const fontRegular = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const fontBold = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const contentIds = pages.map(page => addObject(`<< /Length ${binaryLength(page)} >>\nstream\n${page}\nendstream`));
    const pagesId = objects.length + contentIds.length + 1; // placeholder reference is replaced below through known final ids
    const pageIds = [];
    contentIds.forEach(contentId => {
      const pageId = addObject(`<< /Type /Page /Parent PAGES_REF 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentId} 0 R >>`);
      pageIds.push(pageId);
    });
    const actualPagesId = addObject(`<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`);
    pageIds.forEach(id => { objects[id - 1] = objects[id - 1].replace('PAGES_REF', String(actualPagesId)); });
    const catalogId = addObject(`<< /Type /Catalog /Pages ${actualPagesId} 0 R >>`);

    let pdf = '%PDF-1.4\n%âãÏÓ\n';
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets[index + 1] = binaryLength(pdf);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xref = binaryLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i += 1) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([binaryBytes(pdf)], { type: 'application/pdf' });
  };

  $('#copyEvaluation')?.addEventListener('click', async () => {
    await copyText(evaluationText());
    if ($('#evaluationMessage')) $('#evaluationMessage').textContent = '✓ Complete evaluation copied';
    showToast('The complete evaluation was copied.');
  });
  $('#downloadEvaluation')?.addEventListener('click', () => {
    downloadText(evaluationText(), 'Marie-Christine-Lesson-3-Evaluation-Progress.txt');
    if ($('#evaluationMessage')) $('#evaluationMessage').textContent = '✓ TXT downloaded';
  });
  $('#downloadEvaluationHtml')?.addEventListener('click', () => {
    downloadBlob(new Blob([reportHtml()], { type: 'text/html;charset=utf-8' }), 'Marie-Christine-Lesson-3-Evaluation-Progress.html');
    if ($('#evaluationMessage')) $('#evaluationMessage').textContent = '✓ Branded HTML report downloaded';
    showToast('The branded HTML report was downloaded.');
  });
  $('#downloadEvaluationPdf')?.addEventListener('click', () => {
    try {
      downloadBlob(createEvaluationPdf(), 'Marie-Christine-Lesson-3-Evaluation-Progress.pdf');
      if ($('#evaluationMessage')) $('#evaluationMessage').textContent = '✓ Branded PDF report downloaded';
      showToast('The branded PDF report was downloaded.');
    } catch (error) {
      console.error(error);
      if ($('#evaluationMessage')) $('#evaluationMessage').textContent = 'PDF export failed. Please try the HTML report.';
      showToast('PDF export failed. The HTML report is still available.');
    }
  });
})();
