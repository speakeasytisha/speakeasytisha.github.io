(() => {
  'use strict';

  const data = window.STRATEGY_LAB_DATA || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (sel, event, fn) => { const el = $(sel); if (el) el.addEventListener(event, fn); };
  const setText = (sel, text) => { const el = $(sel); if (el) el.textContent = text ?? ''; };
  const setHTML = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html ?? ''; };

  const state = {
    teacher: false,
    readingTextIndex: 0,
    readingQuestionIndex: 0,
    readingScore: 0,
    readingAnswered: new Set(),
    readingTimerId: null,
    readingScrollId: null,
    readingRemaining: 90,
    writingIndex: 0,
    writingTimerId: null,
    writingRemaining: 300,
    writingLevel: 'B1',
    speakingIndex: 0,
    speakingTime: 30,
    speakingTimerId: null,
    speakingRemaining: 30,
    speakingLevel: 'B1',
    recorder: null,
    chunks: []
  };

  const levels = data.levels || ['A2+', 'B1', 'B2'];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));

  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = 'en-GB';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  function randomMantra() {
    const phrases = data.calmPhrases || ['Simple, complete and clear is enough.'];
    setText('#mantra', phrases[Math.floor(Math.random() * phrases.length)]);
  }

  function readingTotal() {
    return (data.readingTexts || []).reduce((sum, text) => sum + (text.questions || []).length, 0);
  }

  function currentReading() {
    const texts = data.readingTexts || [];
    if (!texts.length) return { text: { title: '', time: 90, text: [], questions: [] }, q: null };
    const text = texts[Math.min(state.readingTextIndex, texts.length - 1)];
    const questions = text.questions || [];
    const q = questions[Math.min(state.readingQuestionIndex, Math.max(0, questions.length - 1))] || null;
    return { text, q };
  }

  function renderTechniques() {
    const techniques = data.techniques || [];
    setHTML('#techniqueCards', techniques.map((tech, index) => `
      <article>
        <span class="number">${index + 1}</span>
        <h3>${esc(tech.area)}: ${esc(tech.name)}</h3>
        <ol>${(tech.steps || []).map(step => `<li>${esc(step)}</li>`).join('')}</ol>
        <p><strong>Avoid:</strong> ${esc(tech.avoid)}</p>
      </article>
    `).join(''));
  }

  function renderOfficialFacts() {
    const facts = data.officialFacts || [];
    setHTML('#officialFacts', facts.map(fact => `
      <article>
        <h3>${esc(fact.title)}</h3>
        <p>${esc(fact.text)}</p>
      </article>
    `).join(''));
  }

  function renderReadingSelectors() {
    const textSelect = $('#readingTextSelect');
    if (!textSelect) return;
    textSelect.innerHTML = (data.readingTexts || []).map((text, index) =>
      `<option value="${index}">${esc(text.title || `Text ${index + 1}`)}</option>`
    ).join('');
    textSelect.value = String(state.readingTextIndex);
    textSelect.addEventListener('change', () => {
      state.readingTextIndex = Number(textSelect.value);
      state.readingQuestionIndex = 0;
      resetReadingTimer();
      renderReading();
    });

    const questionSelect = $('#readingQuestionSelect');
    if (questionSelect) {
      questionSelect.addEventListener('change', () => {
        state.readingQuestionIndex = Number(questionSelect.value);
        resetReadingTimer();
        renderReading();
      });
    }
  }

  function renderReading() {
    const { text, q } = currentReading();
    const questions = text.questions || [];
    const total = readingTotal();

    const questionSelect = $('#readingQuestionSelect');
    if (questionSelect) {
      questionSelect.innerHTML = questions.map((qq, index) => {
        const label = qq.q || `Question ${index + 1}`;
        return `<option value="${index}">Question ${index + 1}: ${esc(label.slice(0, 48))}${label.length > 48 ? '…' : ''}</option>`;
      }).join('');
      questionSelect.value = String(state.readingQuestionIndex);
    }

    setText('#readQ', questions.length ? state.readingQuestionIndex + 1 : 0);
    setText('#readQTotal', questions.length || 0);
    setText('#readingTotal', total);
    setText('#evalReadingTotal', total);
    setText('#readingScore', state.readingScore);
    setText('#evalReadingScore', state.readingScore);

    const progress = questions.length ? ((state.readingQuestionIndex + 1) / questions.length) * 100 : 0;
    const progressEl = $('#readProgress');
    if (progressEl) progressEl.style.width = `${progress}%`;

    setText('#readingQuestion', q ? q.q : 'No reading question available.');
    const keywordBox = $('#keywordBox');
    if (keywordBox) {
      keywordBox.classList.add('hidden');
      keywordBox.innerHTML = '';
    }

    setHTML('#readingText', (text.text || []).map(p => `<p>${esc(p)}</p>`).join(''));
    setHTML('#readingOptions', q ? (q.options || []).map((option, index) =>
      `<button type="button" class="option" data-read-option="${index}">${esc(option)}</button>`
    ).join('') : '');
    const feedback = $('#readingFeedback');
    if (feedback) {
      feedback.className = 'feedback';
      feedback.textContent = '';
    }
    setText('#readingMethodTip', 'Read the question first. Then show the keywords.');

    $$('[data-read-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!q) return;
        const selected = Number(btn.dataset.readOption);
        const ok = selected === q.answer;
        $$('[data-read-option]').forEach(b => b.classList.remove('selected', 'correct', 'incorrect'));
        btn.classList.add('selected', ok ? 'correct' : 'incorrect');
        const box = $('#readingFeedback');
        if (box) {
          box.className = 'feedback ' + (ok ? 'ok' : 'no');
          box.innerHTML = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${esc(q.tip || '')}<br><strong>Evidence:</strong> ${esc(q.evidence || '')}`;
        }
        const key = `${state.readingTextIndex}-${state.readingQuestionIndex}`;
        if (!state.readingAnswered.has(key)) {
          state.readingAnswered.add(key);
          if (ok) state.readingScore += 1;
        }
        updateReadingEval();
      });
    });

    updateReadingTimerDisplay();
    updateReadingEval();
  }

  function showReadingKeywords() {
    const { q } = currentReading();
    if (!q) return;
    const terms = q.keywords || [];
    const box = $('#keywordBox');
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML = `<strong>Keywords to scan:</strong> ${terms.map(k => `<span class="highlight">${esc(k)}</span>`).join(' ')}`;
    }
    setText('#readingMethodTip', 'Now scan for these words or similar ideas.');
    highlightTerms(terms, 'highlight');
  }

  function showEvidence() {
    const { q } = currentReading();
    if (!q) return;
    const evidence = q.evidence || '';
    const highlighted = highlightTerms([evidence], 'evidence');
    if (!highlighted) highlightTerms(q.keywords || [], 'evidence');
    const box = $('#keywordBox');
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML += `<br><strong>Answer location:</strong> <span class="evidence">${esc(evidence)}</span>`;
    }
    setText('#readingMethodTip', 'Read one sentence before and after the answer location.');
  }

  function highlightTerms(terms, cls) {
    const { text } = currentReading();
    const raw = (text.text || []).map(p => `<p>${esc(p)}</p>`).join('');
    let html = raw;
    let found = false;
    (terms || []).filter(Boolean).forEach(term => {
      const safe = esc(term);
      const regexSafe = safe.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!regexSafe) return;
      const re = new RegExp(regexSafe, 'gi');
      if (re.test(html)) found = true;
      html = html.replace(re, match => `<span class="${cls}">${match}</span>`);
    });
    setHTML('#readingText', html);
    const first = $(`#readingText .${cls}`);
    if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return found;
  }

  function nextReadingQuestion() {
    const texts = data.readingTexts || [];
    if (!texts.length) return;
    const currentText = texts[state.readingTextIndex];
    const questions = currentText.questions || [];
    if (state.readingQuestionIndex < questions.length - 1) {
      state.readingQuestionIndex += 1;
    } else if (state.readingTextIndex < texts.length - 1) {
      state.readingTextIndex += 1;
      state.readingQuestionIndex = 0;
      const textSelect = $('#readingTextSelect');
      if (textSelect) textSelect.value = String(state.readingTextIndex);
    } else {
      state.readingTextIndex = 0;
      state.readingQuestionIndex = 0;
      const textSelect = $('#readingTextSelect');
      if (textSelect) textSelect.value = '0';
    }
    resetReadingTimer();
    renderReading();
  }

  function updateReadingTimerDisplay() {
    const m = String(Math.floor(state.readingRemaining / 60)).padStart(2, '0');
    const s = String(state.readingRemaining % 60).padStart(2, '0');
    setText('#readTimer', `${m}:${s}`);
  }

  function startReadingTimer() {
    clearInterval(state.readingTimerId);
    clearInterval(state.readingScrollId);
    const { text } = currentReading();
    state.readingRemaining = Number(text.time) || 90;
    updateReadingTimerDisplay();
    const readingText = $('#readingText');
    if (readingText) readingText.scrollTop = 0;
    state.readingTimerId = setInterval(() => {
      state.readingRemaining -= 1;
      updateReadingTimerDisplay();
      if (state.readingRemaining <= 0) {
        clearInterval(state.readingTimerId);
        clearInterval(state.readingScrollId);
      }
    }, 1000);
    state.readingScrollId = setInterval(() => {
      const el = $('#readingText');
      if (el && el.scrollTop + el.clientHeight < el.scrollHeight) el.scrollTop += 1;
    }, 90);
  }

  function pauseReadingTimer() {
    clearInterval(state.readingTimerId);
    clearInterval(state.readingScrollId);
  }

  function resetReadingTimer() {
    pauseReadingTimer();
    const { text } = currentReading();
    state.readingRemaining = Number(text.time) || 90;
    updateReadingTimerDisplay();
    const el = $('#readingText');
    if (el) el.scrollTop = 0;
  }

  function updateReadingEval() {
    const total = readingTotal();
    setText('#readingScore', state.readingScore);
    setText('#evalReadingScore', state.readingScore);
    setText('#readingTotal', total);
    setText('#evalReadingTotal', total);
    const pct = total ? Math.round((state.readingScore / total) * 100) : 0;
    let comment = 'Complete the reading exercises to calculate the result.';
    if (state.readingAnswered.size) {
      if (pct >= 80) comment = 'Très bien : you are using the reading strategy effectively.';
      else if (pct >= 50) comment = 'En cours : continue scanning keywords and checking the evidence.';
      else comment = 'À renforcer : slow down and apply Q → K → Scan → Check before choosing.';
    }
    setText('#evalAutoComment', comment);
  }

  function renderWritingSelector() {
    const select = $('#writingTaskSelect');
    if (!select) return;
    select.innerHTML = (data.writingTasks || []).map((task, index) =>
      `<option value="${index}">${esc(task.title || `Task ${index + 1}`)}</option>`
    ).join('');
    select.addEventListener('change', () => {
      state.writingIndex = Number(select.value);
      resetWritingTimer();
      renderWriting();
    });
  }

  function currentWritingTask() {
    const tasks = data.writingTasks || [];
    return tasks[Math.min(state.writingIndex, Math.max(0, tasks.length - 1))] || null;
  }

  function renderWriting() {
    const task = currentWritingTask();
    if (!task) return;
    setText('#writingType', task.type || 'Writing practice');
    setText('#writingTitle', task.title || 'Writing task');
    setText('#writingPrompt', task.prompt || '');
    setHTML('#writingPlan', (task.plan || []).map((item, index) =>
      `<div class="plan-item"><strong>${index + 1}.</strong> ${esc(item)}</div>`
    ).join(''));
    const box = $('#writingBox');
    if (box) box.value = localStorage.getItem(`writing-${task.title || state.writingIndex}`) || '';
    updateWordCount();
    renderWritingLevels();
    setText('#writingModel', (task.models || {})[state.writingLevel] || '');
    const model = $('#writingModel');
    if (model) model.classList.add('hidden');
    renderWritingChecklist();
  }

  function renderWritingLevels() {
    setHTML('#writingLevels', levels.map(level =>
      `<button type="button" data-write-level="${esc(level)}" class="${level === state.writingLevel ? 'active' : ''}">${esc(level)}</button>`
    ).join(''));
    $$('[data-write-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.writingLevel = btn.dataset.writeLevel;
        renderWritingLevels();
        const task = currentWritingTask();
        setText('#writingModel', ((task || {}).models || {})[state.writingLevel] || '');
      });
    });
  }

  function renderWritingChecklist() {
    setHTML('#writingChecklist', `
      <label><input type="checkbox"> You answered every question in the prompt.</label>
      <label><input type="checkbox"> You used a greeting and a closing.</label>
      <label><input type="checkbox"> Your sentences are short and clear.</label>
      <label><input type="checkbox"> You checked verbs: will / past / present.</label>
      <label><input type="checkbox"> You checked plurals and prepositions.</label>
      <label><input type="checkbox"> You are close to 125 words, but you did not overdo it.</label>
    `);
  }

  function updateWordCount() {
    const box = $('#writingBox');
    if (!box) return;
    const words = box.value.trim() ? box.value.trim().split(/\s+/).length : 0;
    setText('#wordCount', words);
    const feedback = $('#wordFeedback');
    if (feedback) {
      feedback.className = '';
      if (words === 0) feedback.textContent = 'Start with the frame.';
      else if (words < 80) feedback.textContent = 'Too short: answer all questions and add details.';
      else if (words <= 140) {
        feedback.textContent = 'Good length: keep it simple and check essentials.';
        feedback.className = 'good';
      } else {
        feedback.textContent = 'Too long: simplify. Do not overdo it.';
        feedback.className = 'bad';
      }
    }
    const task = currentWritingTask();
    if (task) localStorage.setItem(`writing-${task.title || state.writingIndex}`, box.value);
  }

  function updateWritingTimer() {
    const m = String(Math.floor(state.writingRemaining / 60)).padStart(2, '0');
    const s = String(state.writingRemaining % 60).padStart(2, '0');
    setText('#writeTimer', `${m}:${s}`);
    const progress = $('#writeProgress');
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, ((300 - state.writingRemaining) / 300) * 100))}%`;
  }

  function startWritingTimer() {
    clearInterval(state.writingTimerId);
    state.writingRemaining = 300;
    updateWritingTimer();
    state.writingTimerId = setInterval(() => {
      state.writingRemaining -= 1;
      updateWritingTimer();
      if (state.writingRemaining <= 0) clearInterval(state.writingTimerId);
    }, 1000);
  }

  function resetWritingTimer() {
    clearInterval(state.writingTimerId);
    state.writingRemaining = 300;
    updateWritingTimer();
  }

  function clearWritingDraft() {
    const task = currentWritingTask();
    const box = $('#writingBox');
    if (box) box.value = '';
    if (task) localStorage.removeItem(`writing-${task.title || state.writingIndex}`);
    updateWordCount();
  }

  function renderWritingDrills() {
    const drills = (data.microDrills || {}).writing || [];
    setHTML('#writingDrills', drills.map((drill, index) => `
      <article class="drill-card">
        <h3>Writing rescue ${index + 1}</h3>
        <p>${esc(drill.prompt)}</p>
        <button type="button" data-drill="writing-${index}">Show answer</button>
        <div class="feedback hidden" id="writing-drill-${index}">${esc(drill.answer)}</div>
      </article>
    `).join(''));
    drills.forEach((_, index) => {
      on(`[data-drill="writing-${index}"]`, 'click', () => $('#writing-drill-' + index)?.classList.toggle('hidden'));
    });
  }

  function currentSpeakingTask() {
    const tasks = data.speakingTasks || [];
    return tasks[Math.min(state.speakingIndex, Math.max(0, tasks.length - 1))] || null;
  }

  function renderSpeakingSelector() {
    const select = $('#speakingTaskSelect');
    if (!select) return;
    select.innerHTML = (data.speakingTasks || []).map((task, index) =>
      `<option value="${index}">${esc(task.title || `Prompt ${index + 1}`)}</option>`
    ).join('');
    select.addEventListener('change', () => {
      state.speakingIndex = Number(select.value);
      renderSpeaking();
    });
    const timeSelect = $('#speakingTimeSelect');
    if (timeSelect) {
      timeSelect.addEventListener('change', () => {
        state.speakingTime = Number(timeSelect.value);
        renderSpeaking();
      });
    }
  }

  function renderSpeaking() {
    const task = currentSpeakingTask();
    if (!task) return;
    setText('#speakingPrompt', task.prompt || '');
    setText('#speakQuestionCount', `Prompt ${state.speakingIndex + 1}`);
    const select = $('#speakingTaskSelect');
    if (select) select.value = String(state.speakingIndex);
    const timeSelect = $('#speakingTimeSelect');
    if (timeSelect) timeSelect.value = String(state.speakingTime);
    const plan = task.keywords || (state.speakingTime === 30 ? ['Answer', 'Detail', 'Reason'] : ['Answer', 'Detail', 'Reason', 'Example', 'Conclusion']);
    setHTML('#speakingPlan', plan.map(item => `<li>${esc(item)}</li>`).join(''));
    setText('#speakingTicker', state.speakingTime === 30
      ? 'Answer → detail → reason → stop'
      : 'Answer → detail → reason → example → conclusion');
    setText('#speakingModel', (task.models || {})[state.speakingLevel] || '');
    const model = $('#speakingModel');
    if (model) model.classList.add('hidden');
    renderSpeakingLevels();
    resetSpeakingTimer();
  }

  function renderSpeakingLevels() {
    setHTML('#speakingLevels', levels.map(level =>
      `<button type="button" data-speak-level="${esc(level)}" class="${level === state.speakingLevel ? 'active' : ''}">${esc(level)}</button>`
    ).join(''));
    $$('[data-speak-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.speakingLevel = btn.dataset.speakLevel;
        renderSpeakingLevels();
        const task = currentSpeakingTask();
        setText('#speakingModel', ((task || {}).models || {})[state.speakingLevel] || '');
      });
    });
  }

  function nextSpeakingPrompt() {
    const tasks = data.speakingTasks || [];
    if (!tasks.length) return;
    state.speakingIndex = (state.speakingIndex + 1) % tasks.length;
    const select = $('#speakingTaskSelect');
    if (select) select.value = String(state.speakingIndex);
    renderSpeaking();
  }

  function updateSpeakingTimer() {
    const m = String(Math.floor(state.speakingRemaining / 60)).padStart(2, '0');
    const s = String(state.speakingRemaining % 60).padStart(2, '0');
    setText('#speakTimer', `${m}:${s}`);
    const total = state.speakingTime || 30;
    const progress = $('#speakProgress');
    if (progress) progress.style.width = `${Math.max(0, Math.min(100, ((total - state.speakingRemaining) / total) * 100))}%`;
    const rail = $$('.rail-step');
    const p = (total - state.speakingRemaining) / total;
    rail.forEach((el, i) => el.classList.toggle('active', p >= i / 4 && p < (i + 1) / 4));
  }

  function startSpeakingTimer() {
    clearInterval(state.speakingTimerId);
    state.speakingRemaining = state.speakingTime;
    updateSpeakingTimer();
    $('#speakingTicker')?.classList.add('running');
    state.speakingTimerId = setInterval(() => {
      state.speakingRemaining -= 1;
      updateSpeakingTimer();
      if (state.speakingRemaining <= 0) {
        clearInterval(state.speakingTimerId);
        $('#speakingTicker')?.classList.remove('running');
      }
    }, 1000);
  }

  function resetSpeakingTimer() {
    clearInterval(state.speakingTimerId);
    state.speakingRemaining = state.speakingTime;
    updateSpeakingTimer();
    $('#speakingTicker')?.classList.remove('running');
  }

  async function startRecording() {
    const list = $('#audioList');
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      if (list) list.innerHTML = '<div class="feedback no">Recording is not available in this browser. Use the timer and practise speaking aloud.</div>';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.chunks = [];
      state.recorder = new MediaRecorder(stream);
      state.recorder.ondataavailable = event => state.chunks.push(event.data);
      state.recorder.onstop = () => {
        const blob = new Blob(state.chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;
        const link = document.createElement('a');
        link.href = url;
        link.download = 'myriam-english360-speaking-practice.webm';
        link.textContent = 'Download recording';
        if (list) {
          list.innerHTML = '';
          list.appendChild(audio);
          list.appendChild(link);
        }
      };
      state.recorder.start();
      if (list) list.innerHTML = '<div class="feedback ok">Recording in progress. Speak calmly until the timer ends.</div>';
    } catch (error) {
      if (list) list.innerHTML = '<div class="feedback no">Microphone permission was blocked. Allow the microphone or practise with the timer only.</div>';
    }
  }

  function stopRecording() {
    if (state.recorder && state.recorder.state !== 'inactive') {
      state.recorder.stop();
      state.recorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  function renderSpeakingDrills() {
    const drills = (data.microDrills || {}).speaking || [];
    setHTML('#speakingDrills', drills.map((drill, index) => `
      <article class="drill-card">
        <h3>Speaking rescue ${index + 1}</h3>
        <p>${esc(drill.prompt)}</p>
        <button type="button" data-drill="speaking-${index}">Show answer</button>
        <div class="feedback hidden" id="speaking-drill-${index}">${esc(drill.answer)}</div>
      </article>
    `).join(''));
    drills.forEach((_, index) => {
      on(`[data-drill="speaking-${index}"]`, 'click', () => $('#speaking-drill-' + index)?.classList.toggle('hidden'));
    });
  }

  function renderQuickChecks() {
    setHTML('#quickChecklist', (data.quickChecks || []).map(item => `
      <label><input type="checkbox"> <span><strong>${esc(item.area)}:</strong> ${esc(item.text)}</span></label>
    `).join(''));
  }

  function copyStrategySummary() {
    const text = [
      'English 360° Strategy Lab — Myriam',
      '',
      'Reading technique: Q → K → Scan → Check.',
      '1. Read the question first.',
      '2. Identify keywords: names, dates, numbers, actions and important nouns.',
      '3. Scan the text for the keyword or a synonym.',
      '4. Read one sentence before and after the answer.',
      '',
      'Writing technique: R → P → W → C.',
      'Read the task, plan 4 short parts, write simple sentences, check essentials.',
      'Greeting + answer question 1 + answer question 2 + polite closing.',
      'Simple, complete and clear is enough.',
      '',
      'Speaking technique: A → D → R → E.',
      'Answer directly, add a detail, give a reason, add an example or conclusion.',
      'Do not stop after one sentence. Small mistakes are acceptable.',
      '',
      'Calm phrase: one question at a time. You can finish calmly.'
    ].join('\n');
    const output = $('#strategySummary');
    if (output) output.value = text;
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function copyEval() {
    const total = readingTotal();
    const text = [
      'English 360° Strategy Lab — Qualiopi evaluation',
      `Reading score: ${state.readingScore}/${total}`,
      `Reading comprehension: ${$('#readingStatus')?.value || 'Non évalué'}`,
      `Writing: ${$('#writingStatus')?.value || 'Non évalué'}`,
      `Speaking: ${$('#speakingStatus')?.value || 'Non évalué'}`,
      `Confidence: ${$('#confidenceStatus')?.value || 'Non évalué'}`,
      `Comments: ${$('#learnerComments')?.value || '—'}`,
      '',
      'Lesson objective: practise exam techniques for reading, writing and speaking with timers, real examples, model answers and calm strategies.'
    ].join('\n');
    const output = $('#evalOutput');
    if (output) output.value = text;
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function hookEvents() {
    on('#teacherMode', 'click', () => {
      state.teacher = !state.teacher;
      setText('#teacherMode', `Teacher mode: ${state.teacher ? 'on' : 'off'}`);
      if (state.teacher) $$('.hidden').forEach(el => el.classList.remove('hidden'));
    });
    on('#calmBtn', 'click', randomMantra);
    on('#newMantra', 'click', randomMantra);
    on('#resetBtn', 'click', () => window.location.reload());

    on('#startReadTimer', 'click', startReadingTimer);
    on('#pauseReadTimer', 'click', pauseReadingTimer);
    on('#resetReadTimer', 'click', resetReadingTimer);
    on('#showKeywords', 'click', showReadingKeywords);
    on('#showEvidence', 'click', showEvidence);
    on('#nextReadQ', 'click', nextReadingQuestion);

    on('#writingBox', 'input', updateWordCount);
    on('#startWritingTimer', 'click', startWritingTimer);
    on('#resetWritingTimer', 'click', resetWritingTimer);
    on('#insertFrame', 'click', () => {
      const task = currentWritingTask();
      const box = $('#writingBox');
      if (task && box) {
        box.value = task.frame || '';
        updateWordCount();
      }
    });
    on('#showWritingChecklist', 'click', () => $('#writingChecklist')?.classList.toggle('hidden'));
    on('#showWritingModel', 'click', () => $('#writingModel')?.classList.toggle('hidden'));
    on('#clearWriting', 'click', clearWritingDraft);

    on('#startSpeakingTimer', 'click', startSpeakingTimer);
    on('#recordSpeaking', 'click', startRecording);
    on('#stopRecording', 'click', stopRecording);
    on('#showSpeakingModel', 'click', () => $('#speakingModel')?.classList.toggle('hidden'));
    on('#playSpeakingModel', 'click', () => speak($('#speakingModel')?.textContent || ''));
    on('#nextSpeaking', 'click', nextSpeakingPrompt);

    on('#copyStrategySummary', 'click', copyStrategySummary);
    on('#copyEval', 'click', copyEval);
  }

  function init() {
    renderTechniques();
    renderOfficialFacts();
    renderReadingSelectors();
    renderReading();
    renderWritingSelector();
    renderWriting();
    renderWritingDrills();
    renderSpeakingSelector();
    renderSpeaking();
    renderSpeakingDrills();
    renderQuickChecks();
    hookEvents();
    randomMantra();
    updateReadingEval();
    updateWritingTimer();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
