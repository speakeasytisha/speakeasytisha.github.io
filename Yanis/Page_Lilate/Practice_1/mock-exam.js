(() => {
  'use strict';

  const STORAGE_KEY = 'yanisLilateProgressV1';
  const TOTAL_SECONDS = 60 * 60;
  const AUTO_MAX = 18;
  const TOTAL_MAX = 34;

  const livePrompts = [
    { title: 'Introduction', prompt: 'Please introduce yourself. Tell me where you work now and why you would like to become cabin crew.', tip: 'Aim for 45–60 seconds. Use: I currently work…, I enjoy…, I would like to…' },
    { title: 'Professional service', prompt: 'What does excellent passenger service mean to you? Give one example from your hotel work.', tip: 'Aim for 45–60 seconds. Use: For me, excellent service means…, For example…' },
    { title: 'A difficult moment', prompt: 'A passenger is anxious before take-off. What would you say and do?', tip: 'Aim for 60–90 seconds. Use empathy, an offer, and a clear next step.' }
  ];

  const listeningTasks = [
    {
      label: 'Audio 1 · Cabin announcement',
      audio: 'Good afternoon, passengers. We will begin the meal service in twenty minutes. If you requested a special meal, please use your call button now so that we can confirm your order.',
      transcript: 'Good afternoon, passengers. We will begin the meal service in twenty minutes. If you requested a special meal, please use your call button now so that we can confirm your order.',
      questions: [
        { text: 'When will the meal service begin?', choices: ['In 10 minutes', 'In 20 minutes', 'After landing'], correct: 1, explanation: 'The announcement says the meal service will begin in 20 minutes.' },
        { text: 'Who should use the call button?', choices: ['Passengers with a special meal', 'All passengers', 'Passengers near the exit'], correct: 0, explanation: 'Passengers who requested a special meal should use the call button.' },
        { text: 'Why should they use the button?', choices: ['To change their seat', 'To confirm their meal order', 'To request a blanket'], correct: 1, explanation: 'The crew want to confirm the special-meal order.' }
      ]
    },
    {
      label: 'Audio 2 · Passenger request',
      audio: 'Excuse me, I ordered a vegetarian meal, but I have received the chicken option. I am sorry about that. Let me check your meal order and bring you the correct tray as soon as possible.',
      transcript: 'Passenger: Excuse me, I ordered a vegetarian meal, but I have received the chicken option. Crew: I am sorry about that. Let me check your meal order and bring you the correct tray as soon as possible.',
      questions: [
        { text: 'What problem does the passenger have?', choices: ['The passenger has no tray', 'The passenger received the wrong meal', 'The passenger wants to change seats'], correct: 1, explanation: 'The passenger ordered vegetarian food but received chicken.' },
        { text: 'What will the crew member do first?', choices: ['Bring water', 'Check the meal order', 'Call the captain'], correct: 1, explanation: 'The crew member says: “Let me check your meal order.”' },
        { text: 'Which phrase is the most professional response?', choices: ['Wait a minute.', 'I am sorry about that. Let me check.', 'That is not my job.'], correct: 1, explanation: 'Acknowledge the problem, apologise, then explain the action.' }
      ]
    }
  ];

  const readingTasks = [
    { text: 'Which passenger has a vegetarian meal confirmed?', choices: ['Ms Martin in 14A', 'Mr Doyle in 16C', 'Mrs Chen in 21D'], correct: 0, explanation: 'The crew note states: Seat 14A — Ms Martin: vegetarian meal confirmed.' },
    { text: 'What does Mr Doyle need help with?', choices: ['His London connection', 'A small cabin bag', 'His meal choice'], correct: 1, explanation: 'Mr Doyle needs help storing a small cabin bag.' },
    { text: 'How many blankets did Mr Doyle request?', choices: ['One', 'Two', 'Three'], correct: 1, explanation: 'The note says he requested two blankets.' },
    { text: 'When should the crew check on Mrs Chen?', choices: ['Before boarding', 'After take-off', 'After landing'], correct: 1, explanation: 'Mrs Chen should be checked on after take-off.' },
    { text: 'What is unavailable for Mrs Chen right now?', choices: ['Water', 'An aisle seat', 'A blanket'], correct: 1, explanation: 'No seat change is currently available.' },
    { text: 'What follow-up does Ms Martin need?', choices: ['An update after landing', 'A different blanket', 'A taxi booking'], correct: 0, explanation: 'Ms Martin needs an update after landing because of her London connection.' }
  ];

  const languageTasks = [
    { text: 'Choose the best professional offer.', choices: ['Would you like some water?', 'Would you like water?', 'Do you like some water?'], correct: 0, explanation: 'Would you like + noun is a polite professional offer.' },
    { text: 'Complete the sentence: “Here ___ your two blankets.”', choices: ['is', 'are', 'be'], correct: 1, explanation: 'Two blankets = plural, so use “Here are”.' },
    { text: 'Choose the best response to an anxious passenger.', choices: ['Don’t worry.', 'I understand. Would you like some water while we wait?', 'You have to sit down.'], correct: 1, explanation: 'It shows empathy and offers a practical solution.' },
    { text: 'Complete: “How ___ cabin bags do you have?”', choices: ['much', 'many', 'any'], correct: 1, explanation: 'Cabin bags are countable plural: How many…?' },
    { text: 'Choose the correct sentence.', choices: ['I can help you with your bag.', 'I can to help you with your bag.', 'I can helping you with your bag.'], correct: 0, explanation: 'After can, use the base verb: can help.' },
    { text: 'Which closing is most professional?', choices: ['Anything else?', 'Is there anything else I can help you with?', 'You finished now?'], correct: 1, explanation: 'A professional closing is polite and complete.' }
  ];

  const roleplayTasks = [
    { title: 'Situation 1 · Anxious passenger', prompt: 'A passenger says: “I am very nervous. I do not like turbulence.” Respond as a cabin-crew member.', reminder: 'Acknowledge the feeling, reassure carefully, offer practical support, and close politely.' },
    { title: 'Situation 2 · Seat request', prompt: 'A passenger says: “I would prefer an aisle seat. Can I change seats?” There is no aisle seat available now.', reminder: 'Be honest, explain the situation, and offer a helpful next step.' },
    { title: 'Situation 3 · Missing service', prompt: 'A passenger says: “Excuse me, I asked for water ten minutes ago.” Respond professionally.', reminder: 'Apologise, take responsibility, give a clear action, and check if they need anything else.' }
  ];

  const state = {
    started: false,
    remaining: TOTAL_SECONDS,
    timerId: null,
    voice: 'en-GB',
    answers: new Map(),
    marked: false,
    saved: false,
    recordings: new Map(),
    recorders: new Map(),
    recordingTimers: new Map()
  };

  const $ = (selector) => document.querySelector(selector);
  const liveRegion = $('#liveRegion');
  const startButton = $('#startExam');
  const timerEl = $('#examTimer');
  const timerStatus = $('#timerStatus');
  const timerMessage = $('#timerMessage');
  const timeProgress = $('#timeProgress');
  const miniAutoScore = $('#miniAutoScore');
  const resultCard = $('#resultCard');
  const finishButton = $('#finishExam');
  const summaryButton = $('#downloadSummary');

  function pad(value) { return String(value).padStart(2, '0'); }
  function formatClock(seconds) { return `${pad(Math.floor(Math.max(seconds, 0) / 60))}:${pad(Math.max(seconds, 0) % 60)}`; }
  function dateStamp() { return new Date().toISOString().slice(0, 10); }
  function downloadFile(filename, type, content) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) { liveRegion.textContent = 'Audio is not available in this browser.'; return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.voice;
    utterance.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const exact = voices.find(v => v.lang.toLowerCase() === state.voice.toLowerCase());
    const family = voices.find(v => v.lang.toLowerCase().startsWith(state.voice.slice(0, 2).toLowerCase()));
    if (exact || family) utterance.voice = exact || family;
    window.speechSynthesis.speak(utterance);
  }

  function updateTimer() {
    timerEl.textContent = formatClock(state.remaining);
    const used = ((TOTAL_SECONDS - state.remaining) / TOTAL_SECONDS) * 100;
    timeProgress.style.width = `${Math.max(0, 100 - used)}%`;
    if (state.remaining <= 0) {
      timerEl.classList.add('is-over');
      timerStatus.textContent = 'TIME UP';
      timerMessage.textContent = 'Time is up. Finish the final section and save your practice result.';
    }
  }
  function startExam() {
    if (state.started) return;
    state.started = true;
    startButton.disabled = true;
    startButton.textContent = 'Simulation in progress';
    timerStatus.textContent = 'IN PROGRESS';
    timerMessage.textContent = 'Work steadily. Your timer is running.';
    state.timerId = window.setInterval(() => {
      state.remaining -= 1;
      updateTimer();
      if (state.remaining <= 0) {
        window.clearInterval(state.timerId);
        state.timerId = null;
        liveRegion.textContent = 'Time is up. Finish and save your result.';
      }
    }, 1000);
    updateTimer();
    liveRegion.textContent = 'The 60-minute mock exam has started.';
    $('#part-1').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function createRecordingControls(card, recordId) {
    const controls = document.createElement('div');
    controls.className = 'recording-controls';
    controls.innerHTML = `<button class="record-btn" type="button">● Record (max 90 sec)</button><button class="stop-btn" type="button" disabled>■ Stop</button><button class="download-audio" type="button" disabled>⇩ Download audio</button>`;
    const status = document.createElement('p'); status.className = 'record-status'; status.textContent = 'Recording is optional. Your browser will ask for microphone permission.';
    controls.querySelector('.record-btn').addEventListener('click', () => startRecording(recordId, controls, status));
    controls.querySelector('.stop-btn').addEventListener('click', () => stopRecording(recordId, controls, status));
    controls.querySelector('.download-audio').addEventListener('click', () => downloadAudio(recordId, status));
    card.append(controls, status);
  }
  async function startRecording(id, controls, status) {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      status.textContent = 'Recording is not supported here. Use the answer-notes box below and download your written notes.';
      return;
    }
    if (state.recorders.has(id)) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = window.MediaRecorder.isTypeSupported?.('audio/webm') ? { mimeType: 'audio/webm' } : undefined;
      const recorder = new MediaRecorder(stream, options);
      const chunks = [];
      recorder.addEventListener('dataavailable', event => { if (event.data.size) chunks.push(event.data); });
      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        state.recordings.set(id, blob);
        stream.getTracks().forEach(track => track.stop());
        state.recorders.delete(id);
        const timer = state.recordingTimers.get(id); if (timer) clearInterval(timer);
        state.recordingTimers.delete(id);
        controls.querySelector('.record-btn').disabled = false;
        controls.querySelector('.record-btn').classList.remove('is-recording');
        controls.querySelector('.stop-btn').disabled = true;
        controls.querySelector('.download-audio').disabled = false;
        status.textContent = 'Recording ready. Download it and listen once before self-reviewing.';
      });
      recorder.start();
      state.recorders.set(id, recorder);
      controls.querySelector('.record-btn').disabled = true;
      controls.querySelector('.record-btn').classList.add('is-recording');
      controls.querySelector('.stop-btn').disabled = false;
      let seconds = 90;
      status.textContent = `Recording… ${seconds} seconds remaining.`;
      const timer = setInterval(() => {
        seconds -= 1;
        status.textContent = `Recording… ${seconds} seconds remaining.`;
        if (seconds <= 0) stopRecording(id, controls, status);
      }, 1000);
      state.recordingTimers.set(id, timer);
    } catch (error) {
      status.textContent = 'Microphone permission was not granted. Use the answer-notes box below instead.';
    }
  }
  function stopRecording(id, controls, status) {
    const recorder = state.recorders.get(id);
    if (recorder && recorder.state !== 'inactive') { recorder.stop(); status.textContent = 'Saving your recording…'; }
  }
  function downloadAudio(id, status) {
    const blob = state.recordings.get(id);
    if (!blob) { status.textContent = 'No recording is ready yet.'; return; }
    const extension = blob.type.includes('mp4') ? 'm4a' : 'webm';
    downloadFile(`yanis-lilate-${id}-${dateStamp()}.${extension}`, blob.type || 'audio/webm', blob);
    status.textContent = 'Audio downloaded to your device.';
  }

  function renderLivePrompts() {
    const target = $('#livePrompts');
    livePrompts.forEach((item, index) => {
      const card = document.createElement('article'); card.className = 'live-prompt';
      card.innerHTML = `<span class="prompt-label">EXAMINER QUESTION ${index + 1}</span><h3>${item.title}</h3><p>${item.prompt}</p><p class="scenario-quote">${item.tip}</p><textarea class="answer-notes" aria-label="Answer notes for examiner question ${index + 1}" placeholder="Optional answer notes / useful phrases…"></textarea>`;
      createRecordingControls(card, `live-question-${index + 1}`);
      target.appendChild(card);
    });
  }

  function buildQuestionBlock(question, id) {
    const wrap = document.createElement('div'); wrap.className = 'question-block'; wrap.dataset.questionId = id;
    const prompt = document.createElement('p'); prompt.textContent = question.text; wrap.appendChild(prompt);
    const row = document.createElement('div'); row.className = 'choice-row';
    question.choices.forEach((choice, choiceIndex) => {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'choice-btn'; btn.textContent = choice;
      btn.addEventListener('click', () => selectAnswer(id, choiceIndex, wrap)); row.appendChild(btn);
    });
    const feedback = document.createElement('p'); feedback.className = 'question-feedback'; feedback.textContent = 'Choose one answer.';
    wrap.append(row, feedback);
    return wrap;
  }
  function selectAnswer(id, choiceIndex, container) {
    if (state.marked) return;
    state.answers.set(id, choiceIndex);
    [...container.querySelectorAll('.choice-btn')].forEach((btn, index) => btn.classList.toggle('selected', index === choiceIndex));
    container.querySelector('.question-feedback').textContent = 'Answer selected.';
    updateMiniScore();
  }
  function updateMiniScore() {
    const total = state.answers.size;
    miniAutoScore.textContent = `${total} / ${AUTO_MAX} answered`;
  }
  function renderListeningTasks() {
    const target = $('#listeningTasks');
    listeningTasks.forEach((task, taskIndex) => {
      const card = document.createElement('article'); card.className = 'listening-card';
      const left = document.createElement('div'); left.className = 'listening-audio';
      left.innerHTML = `<span class="task-label">${task.label}</span><button type="button" class="audio-play-btn">▶ Play audio (2 plays)</button><p class="play-status">You have 2 plays available.</p><button type="button" class="transcript-btn">Show transcript after attempt</button><p class="transcript" hidden>${task.transcript}</p>`;
      let plays = 0;
      const play = left.querySelector('.audio-play-btn'); const status = left.querySelector('.play-status');
      play.addEventListener('click', () => { if (plays >= 2) return; plays += 1; speak(task.audio); status.textContent = `Play ${plays} of 2 used.`; if (plays === 2) { play.disabled = true; play.textContent = 'Audio plays used'; } });
      left.querySelector('.transcript-btn').addEventListener('click', () => { left.querySelector('.transcript').hidden = false; });
      const right = document.createElement('div'); right.className = 'question-list';
      task.questions.forEach((question, questionIndex) => right.appendChild(buildQuestionBlock(question, `listening-${taskIndex}-${questionIndex}`)));
      card.append(left, right); target.appendChild(card);
    });
  }
  function renderSimpleQuestions(items, targetId, prefix) {
    const target = $(targetId);
    items.forEach((question, index) => {
      const card = document.createElement('article'); card.className = 'question-card';
      const task = document.createElement('span'); task.className = 'task-label'; task.textContent = `${prefix} ${index + 1}`;
      card.append(task, buildQuestionBlock(question, `${prefix.toLowerCase().replace(/\s+/g, '-')}-${index}`));
      target.appendChild(card);
    });
  }
  function renderRoleplays() {
    const target = $('#roleplayTasks');
    roleplayTasks.forEach((item, index) => {
      const card = document.createElement('article'); card.className = 'roleplay-card';
      card.innerHTML = `<span class="task-label">${item.title}</span><h3>Speak for 60–90 seconds</h3><p class="scenario-quote">“${item.prompt}”</p><p><strong>Remember:</strong> ${item.reminder}</p><textarea class="answer-notes" aria-label="Answer notes for role-play ${index + 1}" placeholder="Optional answer notes / phrases you used…"></textarea>`;
      createRecordingControls(card, `roleplay-${index + 1}`);
      target.appendChild(card);
    });
  }

  function countWords(text) { return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0; }
  function updateWritingCount() {
    const count = countWords($('#writingResponse').value);
    $('#wordCount').textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
    $('#wordCount').style.color = (count >= 90 && count <= 120) ? '#147a61' : '#5c768b';
  }
  function checklistScore(skill) { return [...document.querySelectorAll(`[data-skill="${skill}"] input:checked`)].length; }
  function updateChecklistScores() {
    $('#liveScore').textContent = `${checklistScore('live')} / 5`;
    $('#writingScore').textContent = `${checklistScore('writing')} / 5`;
    $('#roleplayScore').textContent = `${checklistScore('roleplay')} / 6`;
  }

  function allAutoQuestions() {
    const pairs = [];
    listeningTasks.forEach((task, taskIndex) => task.questions.forEach((question, questionIndex) => pairs.push({ id: `listening-${taskIndex}-${questionIndex}`, question, skill: 'Listening', max: 6 })));
    readingTasks.forEach((question, index) => pairs.push({ id: `reading-${index}`, question, skill: 'Reading', max: 6 }));
    languageTasks.forEach((question, index) => pairs.push({ id: `functional-language-${index}`, question, skill: 'Service language', max: 6 }));
    return pairs;
  }
  function markAnswers() {
    let correct = 0;
    const skillScores = { Listening: 0, Reading: 0, 'Service language': 0 };
    allAutoQuestions().forEach(({ id, question, skill }) => {
      const selected = state.answers.get(id);
      const block = document.querySelector(`[data-question-id="${id}"]`);
      if (!block) return;
      const buttons = [...block.querySelectorAll('.choice-btn')];
      buttons.forEach((button, index) => {
        button.disabled = true;
        button.classList.remove('selected');
        if (index === question.correct) button.classList.add('correct');
        if (selected === index && selected !== question.correct) button.classList.add('wrong');
      });
      const feedback = block.querySelector('.question-feedback');
      if (selected === question.correct) {
        correct += 1; skillScores[skill] += 1; feedback.className = 'question-feedback is-correct'; feedback.textContent = `Correct. ${question.explanation}`;
      } else {
        feedback.className = 'question-feedback is-wrong'; feedback.textContent = `Review: ${question.explanation}`;
      }
    });
    state.marked = true;
    miniAutoScore.textContent = `${correct} / ${AUTO_MAX}`;
    return { correct, skillScores };
  }
  function loadProgress() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
  function saveProgress(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
  function finishExam() {
    if (state.saved) { $('#resultCard').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const { correct, skillScores } = state.marked ? calculateMarkedScores() : markAnswers();
    const live = checklistScore('live'); const writing = checklistScore('writing'); const roleplay = checklistScore('roleplay');
    const score = correct + live + writing + roleplay;
    const percentage = Math.round((score / TOTAL_MAX) * 100);
    const entry = {
      id: `mock-${Date.now()}`,
      type: 'mock',
      title: 'LILATE-style On-board Service Mock',
      date: new Date().toISOString(),
      score, max: TOTAL_MAX, percentage,
      note: `Writing: ${countWords($('#writingResponse').value)} words`,
      skills: {
        Listening: { score: skillScores.Listening, max: 6, type: 'Auto-marked' },
        Reading: { score: skillScores.Reading, max: 6, type: 'Auto-marked' },
        'Service language': { score: skillScores['Service language'], max: 6, type: 'Auto-marked' },
        Conversation: { score: live, max: 5, type: 'Self-review' },
        Writing: { score: writing, max: 5, type: 'Self-review' },
        'Role-play': { score: roleplay, max: 6, type: 'Self-review' }
      }
    };
    const entries = loadProgress(); entries.unshift(entry); saveProgress(entries);
    state.saved = true;
    finishButton.textContent = 'Score saved to passport ✓'; finishButton.disabled = true; summaryButton.disabled = false;
    const readiness = percentage >= 80 ? 'Strong practice result — keep building natural speed and confidence.' : percentage >= 60 ? 'A useful baseline — review the lowest skill before your next mock.' : 'Good diagnostic — use the dashboard to focus your next lessons.';
    resultCard.hidden = false;
    resultCard.innerHTML = `<h3>Your training score: ${score} / ${TOTAL_MAX} (${percentage}%)</h3><p>${readiness}</p><div class="result-grid"><div class="result-metric"><span>Auto-marked</span><strong>${correct} / 18</strong></div><div class="result-metric"><span>Self-review</span><strong>${live + writing + roleplay} / 16</strong></div><div class="result-metric"><span>Writing length</span><strong>${countWords($('#writingResponse').value)} words</strong></div></div><p><a href="score-passport.html"><strong>Open your Score Passport →</strong></a> Your mock has been saved there automatically.</p>`;
    liveRegion.textContent = `Mock result saved: ${score} out of ${TOTAL_MAX}.`;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function calculateMarkedScores() {
    let correct = 0; const skillScores = { Listening: 0, Reading: 0, 'Service language': 0 };
    allAutoQuestions().forEach(({ id, question, skill }) => { if (state.answers.get(id) === question.correct) { correct += 1; skillScores[skill] += 1; } });
    return { correct, skillScores };
  }
  function summaryText() {
    const { correct, skillScores } = calculateMarkedScores();
    const live = checklistScore('live'); const writing = checklistScore('writing'); const roleplay = checklistScore('roleplay');
    const score = correct + live + writing + roleplay;
    return [
      'YANIS · LILATE-STYLE ON-BOARD SERVICE MOCK',
      `Date: ${new Date().toLocaleString()}`,
      `Training score: ${score} / ${TOTAL_MAX} (${Math.round((score / TOTAL_MAX) * 100)}%)`,
      '',
      'AUTO-MARKED SKILLS',
      `Listening: ${skillScores.Listening} / 6`,
      `Reading: ${skillScores.Reading} / 6`,
      `Service language: ${skillScores['Service language']} / 6`,
      '',
      'SELF-REVIEWED SKILLS',
      `Conversation: ${live} / 5`,
      `Writing: ${writing} / 5`,
      `Role-play: ${roleplay} / 6`,
      `Writing word count: ${countWords($('#writingResponse').value)}`,
      '',
      'WRITING RESPONSE',
      $('#writingResponse').value || '[No writing saved]',
      '',
      'Note: This is a private SpeakEasy Tisha training simulation. It is not an official LILATE result.'
    ].join('\n');
  }
  function resetAttempt() {
    const okay = window.confirm('Start a new attempt? This clears answers and the current writing on this page. Saved scores stay in the passport.');
    if (!okay) return;
    location.reload();
  }

  function initializeVoice() {
    document.querySelectorAll('.voice-button').forEach(button => button.addEventListener('click', () => {
      state.voice = button.dataset.voice;
      document.querySelectorAll('.voice-button').forEach(control => control.classList.toggle('active', control === button));
      liveRegion.textContent = `Audio voice changed to ${state.voice === 'en-GB' ? 'UK English' : 'US English'}.`;
    }));
  }
  function initializeEvents() {
    startButton.addEventListener('click', startExam);
    $('#writingResponse').addEventListener('input', updateWritingCount);
    $('#clearWriting').addEventListener('click', () => { $('#writingResponse').value = ''; updateWritingCount(); $('#writingResponse').focus(); });
    $('#downloadWriting').addEventListener('click', () => {
      const text = $('#writingResponse').value.trim();
      if (!text) { liveRegion.textContent = 'Write your response before downloading it.'; return; }
      downloadFile(`yanis-lilate-writing-${dateStamp()}.txt`, 'text/plain;charset=utf-8', text);
    });
    document.querySelectorAll('.checklist input').forEach(input => input.addEventListener('change', updateChecklistScores));
    finishButton.addEventListener('click', finishExam);
    summaryButton.addEventListener('click', () => downloadFile(`yanis-lilate-mock-summary-${dateStamp()}.txt`, 'text/plain;charset=utf-8', summaryText()));
    $('#newAttempt').addEventListener('click', resetAttempt);
    window.addEventListener('beforeunload', () => { state.recorders.forEach(recorder => { if (recorder.state !== 'inactive') recorder.stop(); }); });
  }

  renderLivePrompts(); renderListeningTasks(); renderSimpleQuestions(readingTasks, '#readingTasks', 'Reading'); renderSimpleQuestions(languageTasks, '#languageTasks', 'Functional language'); renderRoleplays(); initializeVoice(); initializeEvents(); updateTimer(); updateWritingCount(); updateChecklistScores();
})();
