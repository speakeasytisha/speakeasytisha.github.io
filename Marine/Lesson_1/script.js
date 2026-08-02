(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // Translation toggle
  const translationToggle = $('#translationToggle');
  translationToggle?.addEventListener('change', () => {
    document.body.classList.toggle('hide-translations', !translationToggle.checked);
  });

  // Print
  $('#printBtn')?.addEventListener('click', () => window.print());

  // Text-to-speech
  const accentSelect = $('#accentSelect');
  let voices = [];
  function loadVoices() {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  loadVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Audio is not supported by this browser.');
      return;
    }
    const lang = accentSelect?.value || 'en-GB';
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const exact = voices.find(v => v.lang === lang);
    const close = voices.find(v => v.lang?.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
    if (exact || close) utterance.voice = exact || close;
    utterance.rate = 0.88;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.speak-btn');
    if (!button) return;
    const text = button.dataset.speak || '';
    if (text) speak(text);
  });

  // Tabs
  $$('[data-tabs]').forEach(tabBlock => {
    const tabs = $$('.tab', tabBlock);
    const panels = $$('.tab-panel', tabBlock);
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $(`[data-panel="${tab.dataset.tab}"]`, tabBlock)?.classList.add('active');
    }));
  });

  // Multiple-choice quiz
  $$('.quiz-item').forEach(item => {
    $$('.choice-row button', item).forEach(button => {
      button.addEventListener('click', () => {
        if (item.dataset.completed === 'true') return;
        item.dataset.completed = 'true';
        const correct = button.textContent.trim() === item.dataset.answer;
        item.dataset.correct = correct ? 'true' : 'false';
        $$('.choice-row button', item).forEach(btn => {
          if (btn.textContent.trim() === item.dataset.answer) btn.classList.add('correct');
        });
        if (!correct) button.classList.add('incorrect');
        const feedback = $('.feedback', item);
        feedback.textContent = correct ? '✓ Excellent — that is the natural choice.' : `Not quite. The best answer is “${item.dataset.answer}”.`;
        feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
        updateQuizScore(item.closest('.quiz-list'));
      });
    });
  });

  function updateQuizScore(container) {
    if (!container?.id) return;
    const score = $$('.quiz-item', container).filter(item => item.dataset.correct === 'true').length;
    const output = $(`[data-score-current="${container.id}"]`);
    if (output) output.textContent = score;
  }

  // Select matching with immediate feedback
  $$('.match-grid select').forEach(select => {
    select.addEventListener('change', () => {
      const feedback = select.parentElement.querySelector('.feedback');
      const correct = select.value === select.dataset.answer;
      feedback.textContent = correct ? '✓' : select.value ? `Try “${select.dataset.answer}”.` : '';
      feedback.className = `feedback ${correct ? 'good' : select.value ? 'bad' : ''}`;
      updateSelectScore(select.closest('.sort-activity'));
    });
  });

  function updateSelectScore(container) {
    if (!container?.id) return;
    const score = $$('select', container).filter(select => select.value === select.dataset.answer).length;
    const output = $(`[data-score-current="${container.id}"]`);
    if (output) output.textContent = score;
  }

  // Fill-in quizzes
  $$('.check-inputs').forEach(button => {
    button.addEventListener('click', () => {
      const container = document.getElementById(button.dataset.target);
      if (!container) return;
      let score = 0;
      $$('input[data-answer]', container).forEach(input => {
        const accepted = input.dataset.answer.split('|').map(x => normalise(x));
        const isCorrect = accepted.includes(normalise(input.value));
        const feedback = input.parentElement.querySelector('.feedback');
        if (isCorrect) {
          score += 1;
          input.style.borderColor = '#2c795f';
          feedback.textContent = '✓';
          feedback.className = 'feedback good';
        } else {
          input.style.borderColor = '#a94f48';
          feedback.textContent = `→ ${input.dataset.answer.split('|')[0]}`;
          feedback.className = 'feedback bad';
        }
      });
      const output = $(`[data-score-current="${container.id}"]`);
      if (output) output.textContent = score;
      showToast(score === $$('input[data-answer]', container).length ? 'Perfect score!' : 'Corrections are shown beside each answer.');
    });
  });

  function normalise(value) {
    return value.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ');
  }

  // Accordion
  $$('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');
      item.classList.toggle('open', !wasOpen);
      trigger.lastElementChild.textContent = wasOpen ? '+' : '−';
    });
  });

  // Country filters
  $$('.country-filters button').forEach(button => {
    button.addEventListener('click', () => {
      $$('.country-filters button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.countryFilter;
      $$('#countryGrid article').forEach(card => {
        const groups = card.dataset.groups.split(' ');
        card.classList.toggle('hidden', filter !== 'all' && !groups.includes(filter));
      });
    });
  });

  // Builders
  const builderDefaults = {
    geo: {
      place: 'Sydney', area: 'east', country: 'Australia', nearby: 'the ocean', feature: 'its beaches and outdoor lifestyle'
    },
    family: {
      children: 'four', abroad: 'two daughters', city1: 'Montreal', city2: 'Boston', franceFamily: 'my two sons', connection: 'travelling and spending time together'
    },
    story: {
      when: 'Last year', destination: 'a small island in Southeast Asia', companions: 'my boyfriend', sights: 'a lot of birds and monkeys', weather: 'scuba diving and motorbike rides', feeling: 'completely free'
    }
  };

  function articleFor(word) {
    return /^[aeiou]/i.test(word.trim()) ? 'an' : 'a';
  }

  function builderText(type, level, values) {
    if (type === 'geo') {
      if (level === 'a2') return `I live in ${values.place}. It is in the ${values.area} of ${values.country}. It is near ${values.nearby}.`;
      if (level === 'a2plus') return `I live in ${values.place}, in the ${values.area} of ${values.country}. It is near ${values.nearby}, and it is known for ${values.feature}. I enjoy living there.`;
      return `I live in ${values.place}, which is situated in the ${values.area} of ${values.country}, near ${values.nearby}. It is a pleasant place that is particularly well known for ${values.feature}. What I appreciate most is the combination of local life and the natural surroundings.`;
    }
    if (type === 'family') {
      if (level === 'a2') return `I have ${values.children} children. I have ${values.abroad}. They live in ${values.city1} and ${values.city2}. ${capitalise(values.franceFamily)} live in France. We enjoy ${values.connection}.`;
      if (level === 'a2plus') return `I have ${values.children} children, and my family is very important to me. ${capitalise(values.abroad)} live abroad: one in ${values.city1} and the other in ${values.city2}. ${capitalise(values.franceFamily)} live in France. Whenever possible, we enjoy ${values.connection}.`;
      return `I have ${values.children} children, and although we do not all live in the same place, we remain very close. ${capitalise(values.abroad)} live abroad, one in ${values.city1} and the other in ${values.city2}, while ${values.franceFamily} live in France. We make an effort to keep in touch and particularly enjoy ${values.connection} whenever we can get together.`;
    }
    if (type === 'story') {
      if (level === 'a2') return `${values.when}, I went to ${values.destination} with ${values.companions}. We went ${values.weather}. We saw ${values.sights}. We felt ${values.feeling}. It was a beautiful trip.`;
      if (level === 'a2plus') return `${values.when}, I travelled to ${values.destination} with ${values.companions}. First, we went ${values.weather}, and we saw ${values.sights} along the way. We felt ${values.feeling}, and I really enjoyed sharing this experience with ${values.companions}.`;
      return `One of my most memorable experiences was a trip to ${values.destination} with ${values.companions}. During our stay, we went ${values.weather} and discovered ${values.sights}, which made the whole experience feel truly exceptional. We felt ${values.feeling}. Above all, the trip was special because it gave us the opportunity to create wonderful memories together.`;
    }
    return '';
  }

  function capitalise(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  $$('.sentence-builder').forEach(builder => {
    const type = builder.dataset.builder;
    let level = 'a2';
    const output = $('.builder-output', builder);
    const fields = $$('[data-field]', builder);

    function values() {
      return Object.fromEntries(fields.map(field => [field.dataset.field, field.value.trim()]));
    }
    function render() {
      output.textContent = builderText(type, level, values());
    }

    fields.forEach(field => field.addEventListener('input', render));
    $$('.level-switch button', builder).forEach(button => {
      button.addEventListener('click', () => {
        $$('.level-switch button', builder).forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        level = button.dataset.level;
        render();
      });
    });
    $('.builder-listen', builder)?.addEventListener('click', () => speak(output.textContent));
    $('.builder-copy', builder)?.addEventListener('click', async () => {
      await copyText(output.textContent);
      showToast('Paragraph copied.');
    });
    $('.builder-reset', builder)?.addEventListener('click', () => {
      fields.forEach(field => { field.value = builderDefaults[type][field.dataset.field]; });
      level = 'a2';
      $$('.level-switch button', builder).forEach(btn => btn.classList.toggle('active', btn.dataset.level === 'a2'));
      render();
    });
    render();
  });

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
  }

  // Reveal model answers and hints
  $$('.reveal-btn').forEach(button => {
    button.addEventListener('click', () => {
      const content = $('.model-content', button.closest('article'));
      const open = content.classList.toggle('show');
      button.textContent = open ? 'Hide model' : 'Show model';
    });
  });
  $$('.hint-btn').forEach(button => {
    button.addEventListener('click', () => {
      const content = $('.hint-content', button.closest('.prompt-card'));
      const open = content.classList.toggle('show');
      button.textContent = open ? 'Hide support' : 'Show support';
    });
  });

  // Mission levels
  $$('.mission-level button').forEach(button => {
    button.addEventListener('click', () => {
      $$('.mission-level button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const level = button.dataset.missionLevel;
      $$('.mission-model').forEach(model => { model.hidden = model.dataset.missionModel !== level; });
    });
  });
  $('#missionListen')?.addEventListener('click', () => {
    const model = $$('.mission-model').find(item => !item.hidden);
    if (model) speak(model.textContent.trim());
  });

  // Audio recorder
  const recordBtn = $('#recordBtn');
  const stopBtn = $('#stopBtn');
  const recordStatus = $('#recordStatus');
  const recordTimer = $('#recordTimer');
  const recordDot = $('.record-dot');
  const audioPlayback = $('#audioPlayback');
  const downloadRecording = $('#downloadRecording');
  const recorderNote = $('#recorderNote');
  let mediaRecorder;
  let chunks = [];
  let stream;
  let timerInterval;
  let seconds = 0;

  function formatTime(total) {
    const minutes = Math.floor(total / 60).toString().padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  recordBtn?.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      recorderNote.textContent = 'Recording is not supported by this browser. Try a recent version of Chrome, Edge, Safari or Firefox.';
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => { if (event.data.size > 0) chunks.push(event.data); };
      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        audioPlayback.src = url;
        audioPlayback.hidden = false;
        downloadRecording.href = url;
        downloadRecording.hidden = false;
        recordStatus.textContent = 'Recording ready';
        recordDot.classList.remove('live');
        recorderNote.textContent = 'Listen again or download your recording. It remains on this device.';
        stream?.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      seconds = 0;
      recordTimer.textContent = '00:00';
      timerInterval = setInterval(() => { seconds += 1; recordTimer.textContent = formatTime(seconds); }, 1000);
      recordStatus.textContent = 'Recording…';
      recordDot.classList.add('live');
      recordBtn.disabled = true;
      stopBtn.disabled = false;
      downloadRecording.hidden = true;
      audioPlayback.hidden = true;
    } catch (error) {
      recorderNote.textContent = 'Microphone access was not granted. Please allow microphone access in your browser settings.';
    }
  });

  stopBtn?.addEventListener('click', () => {
    if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
    clearInterval(timerInterval);
    recordBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // Notes storage and download
  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch { return false; }
    }
  };
  const noteFields = ['vocabNotes', 'proudSentence', 'nextGoal'];
  noteFields.forEach(id => {
    const field = document.getElementById(id);
    const stored = safeStorage.get(`mh_lesson1_${id}`);
    if (stored !== null) field.value = stored;
  });
  $('#saveNotes')?.addEventListener('click', () => {
    const saved = noteFields.map(id => safeStorage.set(`mh_lesson1_${id}`, document.getElementById(id).value)).every(Boolean);
    $('#saveMessage').textContent = saved ? '✓ Saved' : 'Storage unavailable — download your notes instead';
    showToast(saved ? 'Your notes were saved on this device.' : 'Local storage is unavailable. Please download your notes.');
  });
  $('#downloadNotes')?.addEventListener('click', () => {
    const content = [
      'MARINE — LESSON 1 NOTES',
      'Your English Journey to Australia',
      '',
      'NEW WORDS I WANT TO REMEMBER',
      $('#vocabNotes').value || '—',
      '',
      'A SENTENCE I AM PROUD OF',
      $('#proudSentence').value || '—',
      '',
      'WHAT I WOULD LIKE TO PRACTISE NEXT',
      $('#nextGoal').value || '—'
    ].join('\n');
    downloadText(content, 'Marine-Lesson-1-Notes.txt');
  });

  // Evaluation
  const ratings = {};
  $$('.rating-group').forEach(group => {
    $$('.rating-buttons button', group).forEach(button => {
      button.addEventListener('click', () => {
        $$('.rating-buttons button', group).forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        ratings[group.dataset.rating] = button.dataset.value;
      });
    });
  });

  function evaluationText() {
    return [
      'MARINE — LESSON 1 FEEDBACK',
      'Your English Journey to Australia',
      '',
      `Usefulness: ${ratings.useful || 'Not rated'} / 5`,
      `Clarity: ${ratings.clear || 'Not rated'} / 5`,
      `Confidence: ${ratings.confidence || 'Not rated'} / 5`,
      '',
      'COMMENTS / REQUESTS',
      $('#evaluationComments').value.trim() || 'No comments provided.'
    ].join('\n');
  }
  $('#copyEvaluation')?.addEventListener('click', async () => {
    await copyText(evaluationText());
    $('#evaluationMessage').textContent = '✓ Feedback copied';
    showToast('Feedback copied. You can paste it into an email or message.');
  });
  $('#downloadEvaluation')?.addEventListener('click', () => {
    downloadText(evaluationText(), 'Marine-Lesson-1-Feedback.txt');
    $('#evaluationMessage').textContent = '✓ Downloaded';
  });

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
})();
