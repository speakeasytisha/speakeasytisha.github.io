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
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function normalise(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[.,!?;:]$/g, '')
      .replace(/\s+/g, ' ');
  }

  function capitalise(text) {
    const value = String(text || '').trim();
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
  }

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch { return false; }
    }
  };

  // Translation, print and comfortable text size
  const translationToggle = $('#translationToggle');
  translationToggle?.addEventListener('change', () => {
    document.body.classList.toggle('hide-translations', !translationToggle.checked);
  });
  $('#printBtn')?.addEventListener('click', () => window.print());

  const storedFontSize = Number(safeStorage.get('mc_lesson2_font_size'));
  let currentFontSize = Number.isFinite(storedFontSize) && storedFontSize >= 17 && storedFontSize <= 24 ? storedFontSize : 19;

  function applyFontSize() {
    document.documentElement.style.setProperty('--base-size', `${currentFontSize}px`);
    safeStorage.set('mc_lesson2_font_size', String(currentFontSize));
  }
  applyFontSize();

  $$('.font-controls button').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.font;
      if (action === 'plus') currentFontSize = Math.min(24, currentFontSize + 1);
      if (action === 'minus') currentFontSize = Math.max(17, currentFontSize - 1);
      if (action === 'reset') currentFontSize = 19;
      applyFontSize();
      showToast(`Text size: ${currentFontSize}px`);
    });
  });

  // Text-to-speech
  const accentSelect = $('#accentSelect');
  const speedSelect = $('#speedSelect');
  let voices = [];

  function loadVoices() {
    voices = 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
  }
  loadVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Audio is not supported by this browser.');
      return;
    }
    const lang = accentSelect?.value || 'en-GB';
    const rate = Number(speedSelect?.value || 0.86);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    const exactVoice = voices.find(voice => voice.lang === lang);
    const closeVoice = voices.find(voice => voice.lang?.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
    if (exactVoice || closeVoice) utterance.voice = exactVoice || closeVoice;
    window.speechSynthesis.speak(utterance);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.speak-btn');
    if (!button) return;
    const text = button.dataset.speak || button.textContent.replace(/^▶\s*/, '').trim();
    if (text) speak(text);
  });

  // Tabs
  $$('[data-tabs]').forEach(tabBlock => {
    const tabs = $$('.tab', tabBlock);
    const panels = $$('.tab-panel', tabBlock);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        tab.classList.add('active');
        $(`[data-panel="${tab.dataset.tab}"]`, tabBlock)?.classList.add('active');
      });
    });
  });

  // Hints, transcripts and writing models
  $$('.hint-btn').forEach(button => {
    button.addEventListener('click', () => {
      const content = $('.hint-content', button.closest('article'));
      if (!content) return;
      const open = content.classList.toggle('show');
      button.textContent = open ? 'Hide support' : 'Show support';
    });
  });

  $$('.transcript-btn').forEach(button => {
    button.addEventListener('click', () => {
      const transcript = document.getElementById(button.dataset.target);
      if (!transcript) return;
      const open = transcript.classList.toggle('show');
      button.textContent = open ? 'Hide transcript' : 'Show transcript';
    });
  });

  $$('.reveal-writing').forEach(button => {
    button.addEventListener('click', () => {
      const model = document.getElementById(button.dataset.target);
      if (!model) return;
      const open = model.classList.toggle('show');
      button.textContent = open ? 'Hide model' : 'Show A2+ model';
    });
  });

  $$('.copy-field').forEach(button => {
    button.addEventListener('click', async () => {
      const field = document.getElementById(button.dataset.target);
      if (!field) return;
      await copyText(field.value);
      showToast('Your text was copied.');
    });
  });

  // Quiz engine
  $$('.quiz-item').forEach(item => {
    $$('.choice-row button, .choice-column button', item).forEach(button => {
      button.addEventListener('click', () => {
        if (item.dataset.completed === 'true') return;
        item.dataset.completed = 'true';
        const correct = normalise(button.textContent) === normalise(item.dataset.answer);
        item.dataset.correct = correct ? 'true' : 'false';

        $$('.choice-row button, .choice-column button', item).forEach(choice => {
          if (normalise(choice.textContent) === normalise(item.dataset.answer)) choice.classList.add('correct');
          choice.disabled = true;
        });
        if (!correct) button.classList.add('incorrect');

        const feedback = $('.feedback', item);
        if (feedback) {
          feedback.textContent = correct ? '✓ Excellent — that is correct.' : `The best answer is “${item.dataset.answer}”.`;
          feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
        }
        updateQuizScore(item.closest('.quiz-list'));
        updateDashboard();
      });
    });
  });

  function updateQuizScore(container) {
    if (!container?.id) return;
    const score = $$('.quiz-item', container).filter(item => item.dataset.correct === 'true').length;
    const output = $(`[data-score-current="${container.id}"]`);
    if (output) output.textContent = String(score);
  }

  // Fill-in exercises
  $$('.check-inputs').forEach(button => {
    button.addEventListener('click', () => {
      const container = document.getElementById(button.dataset.target);
      if (!container) return;
      let score = 0;
      const inputs = $$('input[data-answer]', container);
      inputs.forEach(input => {
        const accepted = input.dataset.answer.split('|').map(normalise);
        const correct = accepted.includes(normalise(input.value));
        input.dataset.completed = 'true';
        input.dataset.correct = correct ? 'true' : 'false';
        const feedback = input.parentElement.querySelector('.feedback');
        if (correct) {
          score += 1;
          input.style.borderColor = '#2f7a62';
          if (feedback) {
            feedback.textContent = '✓';
            feedback.className = 'feedback good';
          }
        } else {
          input.style.borderColor = '#a84e48';
          if (feedback) {
            feedback.textContent = `→ ${input.dataset.answer.split('|')[0]}`;
            feedback.className = 'feedback bad';
          }
        }
      });
      const output = $(`[data-score-current="${container.id}"]`);
      if (output) output.textContent = String(score);
      showToast(score === inputs.length ? 'Perfect score!' : 'Corrections are shown beside each answer.');
      updateDashboard();
    });
  });

  // Paragraph builders
  const builderDefaults = {
    schedule: {
      person: 'my daughter in Montreal', day: 'Sunday', time: 'six p.m. my time', topic: 'our next family visit'
    },
    family: {
      eldest: 'my eldest daughter, who is 36 and lives in Boston', eldestJob: 'teaches at an international school',
      second: 'my second daughter, who lives in Montreal', secondJob: 'works in IT',
      sons: 'one son lives in Lyon and my youngest son lives in Dunkirk', connection: 'keep in touch and enjoy spending time together'
    },
    contact: {
      people: 'my children', method: 'phone calls and video calls', frequency: 'every week', topics: 'work, family news and future visits'
    },
    travel: {
      country: 'Scotland', when: 'a few years ago', highlights: 'beautiful scenery, historic towns and local traditions', feeling: 'impressed by the landscape'
    }
  };

  function builderText(type, level, values) {
    if (type === 'schedule') {
      if (level === 'a2') return `I would like to call ${values.person} on ${values.day} at ${values.time}. We can talk about ${values.topic}.`;
      if (level === 'a2plus') return `Are you free on ${values.day}? I would like to call ${values.person} at ${values.time} so that we can talk about ${values.topic}. Please tell me if that time works for you.`;
      return `Would ${values.day} work for you? I was hoping to call ${values.person} at ${values.time} to catch up and discuss ${values.topic}. We can check the time difference first and choose another time if necessary.`;
    }
    if (type === 'family') {
      if (level === 'a2') return `I have four children. ${capitalise(values.eldest)}, ${values.eldestJob}. ${capitalise(values.second)}, ${values.secondJob}. ${capitalise(values.sons)}. We ${values.connection}.`;
      if (level === 'a2plus') return `I have four children, and my family is very important to me. ${capitalise(values.eldest)}, ${values.eldestJob}. ${capitalise(values.second)}, ${values.secondJob}, while ${values.sons}. Although we live in different places, we ${values.connection}.`;
      return `Although my four children live in different cities, we remain very close. ${capitalise(values.eldest)}, ${values.eldestJob}. ${capitalise(values.second)}, ${values.secondJob}, while ${values.sons}. We make an effort to ${values.connection}, whenever possible.`;
    }
    if (type === 'contact') {
      if (level === 'a2') return `I keep in touch with ${values.people} using ${values.method}. We usually speak ${values.frequency}. We talk about ${values.topics}.`;
      if (level === 'a2plus') return `I use ${values.method} to keep in touch with ${values.people}. We usually speak ${values.frequency}, and we often talk about ${values.topics}. I really enjoy hearing their news.`;
      return `Although we do not all live in the same place, I make an effort to keep in touch with ${values.people} through ${values.method}. We normally speak ${values.frequency} and catch up on ${values.topics}. These conversations help us remain close despite the distance.`;
    }
    if (type === 'travel') {
      if (level === 'a2') return `I have visited ${values.country}. I went there ${values.when}. I saw ${values.highlights}. I felt ${values.feeling}.`;
      if (level === 'a2plus') return `I have visited ${values.country}, and I travelled there ${values.when}. During my stay, I discovered ${values.highlights}. I felt ${values.feeling}, and I would like to visit again.`;
      return `One of my memorable travel experiences was a trip to ${values.country} ${values.when}. During my stay, I discovered ${values.highlights}, which made the trip particularly interesting. I felt ${values.feeling}, and above all, I enjoyed learning more about the country and its culture.`;
    }
    return '';
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
      if (output) output.textContent = builderText(type, level, values());
    }

    fields.forEach(field => field.addEventListener('input', render));
    $$('.level-switch button', builder).forEach(button => {
      button.addEventListener('click', () => {
        $$('.level-switch button', builder).forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        level = button.dataset.level;
        render();
      });
    });
    $('.builder-listen', builder)?.addEventListener('click', () => speak(output?.textContent || ''));
    $('.builder-copy', builder)?.addEventListener('click', async () => {
      await copyText(output?.textContent || '');
      showToast('Paragraph copied.');
    });
    $('.builder-reset', builder)?.addEventListener('click', () => {
      fields.forEach(field => {
        const defaultValue = builderDefaults[type]?.[field.dataset.field];
        if (defaultValue !== undefined) field.value = defaultValue;
      });
      level = 'a2';
      $$('.level-switch button', builder).forEach(item => item.classList.toggle('active', item.dataset.level === 'a2'));
      render();
    });
    render();
  });

  // Mission models
  $$('.mission-level button').forEach(button => {
    button.addEventListener('click', () => {
      $$('.mission-level button').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const selected = button.dataset.missionLevel;
      $$('.mission-model').forEach(model => { model.hidden = model.dataset.missionModel !== selected; });
    });
  });

  $('#missionListen')?.addEventListener('click', () => {
    const model = $$('.mission-model').find(item => !item.hidden);
    if (model) speak(model.textContent.trim());
  });

  // Audio recording
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

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  recordBtn?.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      if (recorderNote) recorderNote.textContent = 'Recording is not supported by this browser. Try a recent version of Chrome, Edge, Safari or Firefox.';
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
        if (audioPlayback) {
          audioPlayback.src = url;
          audioPlayback.hidden = false;
        }
        if (downloadRecording) {
          downloadRecording.href = url;
          downloadRecording.hidden = false;
        }
        if (recordStatus) recordStatus.textContent = 'Recording ready';
        recordDot?.classList.remove('live');
        if (recorderNote) recorderNote.textContent = 'Listen again or download your recording. It remains on this device.';
        stream?.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      seconds = 0;
      if (recordTimer) recordTimer.textContent = '00:00';
      timerInterval = window.setInterval(() => {
        seconds += 1;
        if (recordTimer) recordTimer.textContent = formatTime(seconds);
      }, 1000);
      if (recordStatus) recordStatus.textContent = 'Recording…';
      recordDot?.classList.add('live');
      recordBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = false;
      if (downloadRecording) downloadRecording.hidden = true;
      if (audioPlayback) audioPlayback.hidden = true;
    } catch {
      if (recorderNote) recorderNote.textContent = 'Microphone access was not granted. Please allow microphone access in your browser settings.';
    }
  });

  stopBtn?.addEventListener('click', () => {
    if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
    window.clearInterval(timerInterval);
    if (recordBtn) recordBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // Notes
  const noteFields = ['vocabNotes', 'proudSentence', 'nextGoal', 'readingReply', 'speakingComment', 'writingComment'];
  noteFields.forEach(id => {
    const field = document.getElementById(id);
    const stored = safeStorage.get(`mc_lesson2_${id}`);
    if (field && stored !== null) field.value = stored;
  });
  ['speakingStatus', 'writingStatus'].forEach(id => {
    const field = document.getElementById(id);
    const stored = safeStorage.get(`mc_lesson2_${id}`);
    if (field && stored !== null) field.value = stored;
    field?.addEventListener('change', () => safeStorage.set(`mc_lesson2_${id}`, field.value));
  });

  $('#saveNotes')?.addEventListener('click', () => {
    const saved = noteFields.map(id => {
      const field = document.getElementById(id);
      return field ? safeStorage.set(`mc_lesson2_${id}`, field.value) : true;
    }).every(Boolean);
    if ($('#saveMessage')) $('#saveMessage').textContent = saved ? '✓ Saved' : 'Storage unavailable — download your notes instead';
    showToast(saved ? 'Your notes were saved on this device.' : 'Local storage is unavailable. Please download your notes.');
  });

  $('#downloadNotes')?.addEventListener('click', () => {
    const content = [
      'MARIE-CHRISTINE — LESSON 2 NOTES',
      'Family Across Borders',
      '',
      'NEW WORDS I WANT TO REMEMBER',
      $('#vocabNotes')?.value || '—',
      '',
      'A SENTENCE I AM PROUD OF',
      $('#proudSentence')?.value || '—',
      '',
      'MY NEXT SPEAKING GOAL',
      $('#nextGoal')?.value || '—',
      '',
      'MY REPLY TO THE MONTREAL MESSAGE',
      $('#readingReply')?.value || '—'
    ].join('\n');
    downloadText(content, 'Marie-Christine-Lesson-2-Notes.txt');
  });

  // Progress dashboard
  const categoryIds = {
    vocabulary: ['familyQuiz'],
    grammar: ['presentFill', 'questionQuiz', 'forSinceQuiz', 'perfectFill', 'travelTenseQuiz'],
    listening: ['listeningQuiz1', 'listeningQuiz2'],
    reading: ['readingQuiz']
  };
  const overallIds = [...new Set([...Object.values(categoryIds).flat(), 'finalQuiz'])];

  function containerResult(id) {
    const container = document.getElementById(id);
    if (!container) return { correct: 0, total: 0 };
    const quizItems = $$('.quiz-item', container);
    if (quizItems.length) {
      return {
        correct: quizItems.filter(item => item.dataset.correct === 'true').length,
        total: quizItems.length
      };
    }
    const inputs = $$('input[data-answer]', container);
    return {
      correct: inputs.filter(input => input.dataset.correct === 'true').length,
      total: inputs.length
    };
  }

  function combinedResult(ids) {
    return ids.reduce((result, id) => {
      const current = containerResult(id);
      return { correct: result.correct + current.correct, total: result.total + current.total };
    }, { correct: 0, total: 0 });
  }

  function percentage(result) {
    return result.total ? Math.round((result.correct / result.total) * 100) : 0;
  }

  function statusFor(percent) {
    if (percent >= 75) return { label: 'Acquis', className: 'acquired' };
    if (percent >= 50) return { label: 'En voie d’acquisition', className: 'progress' };
    return { label: 'En cours', className: '' };
  }

  function setSkill(prefix, ids) {
    const percent = percentage(combinedResult(ids));
    const status = statusFor(percent);
    const scoreElement = $(`#${prefix}Score`);
    const statusElement = $(`#${prefix}Status`);
    if (scoreElement) scoreElement.textContent = `${percent}%`;
    if (statusElement) {
      statusElement.textContent = status.label;
      statusElement.className = `status-chip ${status.className}`.trim();
    }
  }

  function updateDashboard() {
    const overall = percentage(combinedResult(overallIds));
    if ($('#overallPercent')) $('#overallPercent').textContent = `${overall}%`;
    setSkill('vocab', categoryIds.vocabulary);
    setSkill('grammar', categoryIds.grammar);
    setSkill('listening', categoryIds.listening);
    setSkill('reading', categoryIds.reading);
  }
  updateDashboard();

  // Satisfaction evaluation
  const ratings = {};
  $$('.rating-group').forEach(group => {
    $$('.rating-buttons button', group).forEach(button => {
      button.addEventListener('click', () => {
        $$('.rating-buttons button', group).forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        ratings[group.dataset.rating] = button.dataset.value;
      });
    });
  });

  function evaluationText() {
    const vocab = percentage(combinedResult(categoryIds.vocabulary));
    const grammar = percentage(combinedResult(categoryIds.grammar));
    const listening = percentage(combinedResult(categoryIds.listening));
    const reading = percentage(combinedResult(categoryIds.reading));
    const overall = percentage(combinedResult(overallIds));

    return [
      'MARIE-CHRISTINE — LESSON 2 EVALUATION',
      'Family Across Borders',
      '',
      'AUTOMATIC RESULTS',
      `Overall objective score: ${overall}%`,
      `Vocabulary & family details: ${vocab}% — ${statusFor(vocab).label}`,
      `Grammar: ${grammar}% — ${statusFor(grammar).label}`,
      `Listening: ${listening}% — ${statusFor(listening).label}`,
      `Reading: ${reading}% — ${statusFor(reading).label}`,
      '',
      'MANUAL SKILLS',
      `Speaking: ${$('#speakingStatus')?.value || 'En cours'}`,
      `Speaking comments: ${$('#speakingComment')?.value.trim() || '—'}`,
      `Writing: ${$('#writingStatus')?.value || 'En cours'}`,
      `Writing comments: ${$('#writingComment')?.value.trim() || '—'}`,
      '',
      'LEARNER FEEDBACK',
      `Usefulness: ${ratings.useful || 'Not rated'} / 5`,
      `Clarity: ${ratings.clear || 'Not rated'} / 5`,
      `Confidence: ${ratings.confidence || 'Not rated'} / 5`,
      '',
      'COMMENTS / REQUESTS',
      $('#evaluationComments')?.value.trim() || 'No comments provided.'
    ].join('\n');
  }

  $('#copyEvaluation')?.addEventListener('click', async () => {
    await copyText(evaluationText());
    if ($('#evaluationMessage')) $('#evaluationMessage').textContent = '✓ Complete evaluation copied';
    showToast('The complete evaluation was copied.');
  });

  $('#downloadEvaluation')?.addEventListener('click', () => {
    downloadText(evaluationText(), 'Marie-Christine-Lesson-2-Evaluation.txt');
    if ($('#evaluationMessage')) $('#evaluationMessage').textContent = '✓ Downloaded';
  });
})();
