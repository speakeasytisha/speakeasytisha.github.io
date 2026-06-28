(() => {
  'use strict';

  const STORAGE_KEY = 'yanisLilateProgressV1';
  const TOTAL_SECONDS = 60 * 60;
  const AUTO_MAX = 24;
  const TOTAL_MAX = 40;

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
    { text: 'Which closing is most professional?', choices: ['Anything else?', 'Is there anything else I can help you with?', 'You finished now?'], correct: 1, explanation: 'A professional closing is polite and complete.' },
    { text: 'Complete the crew update: “There ___ one spare blanket in the galley.”', choices: ['is', 'are', 'have'], correct: 0, explanation: 'Use “there is” with one singular item.' },
    { text: 'Choose the correct update: “We do not have ___ aisle seats available at the moment.”', choices: ['some', 'any', 'much'], correct: 1, explanation: 'Use “any” in this negative sentence with a plural countable noun.' },
    { text: 'Complete: “The passenger ___ near the front galley at the moment.”', choices: ['waits', 'is waiting', 'waited'], correct: 1, explanation: '“At the moment” signals the present continuous: is waiting.' },
    { text: 'Complete the report: “I ___ the passenger the correct vegetarian meal.”', choices: ['bring', 'brought', 'have bring'], correct: 1, explanation: 'The action is completed, so use the past form “brought”.' },
    { text: 'Choose the correct instruction.', choices: ['Please place your bag under the seat.', 'Please place your bag in the seat.', 'Please place your bag at the seat.'], correct: 0, explanation: 'For luggage below a seat, use the preposition “under”.' },
    { text: 'Complete: “There ___ three passengers waiting for assistance.”', choices: ['is', 'are', 'was'], correct: 1, explanation: 'Three passengers is plural, so use “there are”.' }
  ];

  const serviceLanguageTasks = languageTasks.slice(0, 6);
  const grammarAccuracyTasks = languageTasks.slice(6);

  const roleplayTasks = [
    { title: 'Situation 1 · Anxious passenger', prompt: 'A passenger says: “I am very nervous. I do not like turbulence.” Respond as a cabin-crew member.', reminder: 'Acknowledge the feeling, reassure carefully, offer practical support, and close politely.' },
    { title: 'Situation 2 · Seat request', prompt: 'A passenger says: “I would prefer an aisle seat. Can I change seats?” There is no aisle seat available now.', reminder: 'Be honest, explain the situation, and offer a helpful next step.' },
    { title: 'Situation 3 · Missing service', prompt: 'A passenger says: “Excuse me, I asked for water ten minutes ago.” Respond professionally.', reminder: 'Apologise, take responsibility, give a clear action, and check if they need anything else.' }
  ];

  const liveModels = [
    [
      { level: 'A2 foundation', note: 'Short, clear and personal.', text: `Hello, my name is Yanis. I live in Schiltigheim and I work as a receptionist in a three-star hotel. I like helping guests and solving small problems. I would like to become cabin crew because I enjoy meeting people and working in a team. I want to help passengers have a good flight.` },
      { level: 'B1 target', note: 'Adds work experience and a clear reason.', text: `Hello, my name is Yanis. I currently work as a receptionist in a three-star hotel in Schiltigheim. My job has taught me how to welcome guests, answer requests and stay calm when there is a problem. I would like to become cabin crew because I enjoy customer service and I would like to work in an international environment. I know that passengers need to feel safe, respected and well looked after.` },
      { level: 'B2 stretch', note: 'More natural, specific and connected.', text: `Good morning. My name is Yanis and I currently work as a receptionist in a three-star hotel in Schiltigheim. In my role, I welcome guests, deal with requests and find solutions when something does not go as planned. I am interested in cabin crew work because it combines service, teamwork and responsibility. I would enjoy helping people from different backgrounds while making sure that passengers feel informed, comfortable and cared for throughout their journey.` }
    ],
    [
      { level: 'A2 foundation', note: 'Use a simple definition and one example.', text: `For me, excellent passenger service means being polite, helpful and smiling. We need to listen to people and answer their questions. In my hotel job, a guest could not find a restaurant. I gave him directions and wrote the address for him. He was happy because I helped him.` },
      { level: 'B1 target', note: 'Explains the skill behind the example.', text: `For me, excellent passenger service means listening carefully, being polite and giving a clear solution. It is important to make people feel comfortable, especially when they are tired or worried. For example, at my hotel, a guest arrived late and was stressed because he needed a restaurant. I checked which restaurants were still open, gave him clear directions and helped him reserve a table. He thanked me because the situation became easier for him.` },
      { level: 'B2 stretch', note: 'Shows customer focus and professional judgement.', text: `Excellent passenger service means noticing what a person needs, communicating calmly and following through on what you promise. It is not only about being friendly; it is also about giving reliable information and making the customer feel respected. In my hotel role, I once helped a guest who had arrived late and was frustrated because most restaurants were closing. I checked the options, called a nearby restaurant and explained the route clearly. The guest felt reassured because I took ownership of the situation.` }
    ],
    [
      { level: 'A2 foundation', note: 'Empathy + one helpful offer.', text: `I understand that you are nervous. Please do not worry. We are here to help you. Would you like some water? I can come back and check on you after take-off. Please use the call button if you need anything.` },
      { level: 'B1 target', note: 'Reassures without making promises.', text: `I understand that flying can feel stressful, especially when you are worried about turbulence. You are not alone, and we are here to help you during the flight. Would you like some water before take-off? Please try to make yourself comfortable, and you can use the call button if you need us. I will come back to check on you after take-off.` },
      { level: 'B2 stretch', note: 'Calm, precise and passenger-centred.', text: `I understand that turbulence can be uncomfortable, and it is completely understandable that you feel nervous. Our crew will be here throughout the flight, so please let us know whenever you need support. I can bring you some water now and help you settle in before take-off. Once we are in the air, I will check on you again. In the meantime, please use your call button at any time if there is anything I can do for you.` }
    ]
  ];

  const writingModels = [
    { level: 'A2 foundation', note: 'Simple past tense and the essential facts.', text: `Dear Cabin Service Manager,\n\nI am writing about a problem during the meal service in seat 14A. Ms Martin ordered a vegetarian meal, but she first received a chicken meal. She told me about the problem politely.\n\nI apologised and checked her meal order. Then I brought the correct vegetarian tray to her seat. I also asked if she needed anything else.\n\nMs Martin has a connection in London. After landing, the crew should give her an update about the connection.\n\nKind regards,\nYanis` },
    { level: 'B1 target', note: 'Clear structure, professional tone and a complete follow-up.', text: `Dear Cabin Service Manager,\n\nI am writing to report a meal-service issue concerning Ms Martin in seat 14A. Although a vegetarian meal was confirmed on the crew note, she initially received a chicken tray.\n\nI apologised for the error, checked the meal order and replaced the tray with the correct vegetarian meal as soon as possible. I then checked that she was satisfied and asked whether she needed anything else.\n\nAs Ms Martin has a connection in London, please ensure that she receives an update after landing.\n\nKind regards,\nYanis` },
    { level: 'B2 stretch', note: 'More concise, proactive and natural.', text: `Dear Cabin Service Manager,\n\nI would like to report a meal-service error involving Ms Martin in seat 14A. Her vegetarian meal was confirmed before service; however, she was initially given a chicken tray.\n\nAfter the passenger raised the issue, I apologised, verified the meal list and replaced the incorrect tray with the vegetarian option. I also checked whether she required any further assistance, and she confirmed that the matter had been resolved.\n\nMs Martin is connecting in London, so I recommend that the arriving crew provide her with a connection update after landing.\n\nKind regards,\nYanis` }
  ];

  const roleplayModels = [
    [
      { level: 'A2 foundation', note: 'Empathy + one action.', text: `I understand that you are nervous. We are here to help you. Would you like some water? Please use the call button if you need anything. I will come back and check on you after take-off.` },
      { level: 'B1 target', note: 'Reassure carefully and offer a next step.', text: `I understand that turbulence can make you feel nervous. Please try not to worry; the crew is here to help you during the flight. Would you like some water before we take off? You can use your call button at any time, and I will come back to check on you after take-off.` },
      { level: 'B2 stretch', note: 'Natural reassurance without overpromising.', text: `I understand that turbulence can feel unsettling, and it is completely normal to feel nervous. We will be here throughout the flight, so please let us know if you need support. I can bring you some water now and help you get comfortable. I will also check on you again after take-off. Is there anything else that would help you feel more at ease?` }
    ],
    [
      { level: 'A2 foundation', note: 'Honest answer + polite offer.', text: `I am sorry, but there is no aisle seat available now. I can check again later if another passenger changes seats. Would you like me to help you with anything else?` },
      { level: 'B1 target', note: 'Explain the situation and keep the door open.', text: `I understand that you would prefer an aisle seat. At the moment, I am sorry to say that there are no aisle seats available. I can check again after boarding in case a seat becomes free. For now, would you like help storing your bag or getting settled?` },
      { level: 'B2 stretch', note: 'Warm, professional and proactive.', text: `I understand why you would prefer an aisle seat. Unfortunately, there are no aisle seats available at the moment, so I am not able to move you straight away. However, I will check again once boarding is complete, as a seat may become available. In the meantime, I would be happy to help you get comfortable in your current seat. Is there anything I can bring you?` }
    ],
    [
      { level: 'A2 foundation', note: 'Apologise and act immediately.', text: `I am sorry that you have been waiting. I will bring you some water now. Thank you for telling me. Is there anything else you need?` },
      { level: 'B1 target', note: 'Take responsibility and give a clear time frame.', text: `I am very sorry that you have been waiting for your water. I should have come back sooner. I will bring it to you now, and I will make sure that you do not have to wait any longer. Would you like still or sparkling water?` },
      { level: 'B2 stretch', note: 'Own the delay and close the service loop.', text: `I apologise for the delay, and thank you for reminding me. Your request should have been followed up sooner. I will bring your water immediately; would you prefer still or sparkling? Once I return, I will check whether there is anything else you need. Thank you for your patience.` }
    ]
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

  function createModelAnswers(models, id) {
    const wrap = document.createElement('div');
    wrap.className = 'model-answer-wrap';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'model-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Show model answers · A2 / B1 / B2';
    const panel = document.createElement('div');
    panel.className = 'model-panel';
    panel.hidden = true;
    panel.id = id;
    const intro = document.createElement('p');
    intro.className = 'model-intro';
    intro.textContent = 'Use these after your first attempt. They are models to adapt, not scripts to memorise word for word.';
    const grid = document.createElement('div');
    grid.className = 'model-grid';
    models.forEach((model, index) => {
      const card = document.createElement('article');
      card.className = 'model-level';
      const title = document.createElement('h4');
      title.textContent = model.level;
      const note = document.createElement('p');
      note.className = 'model-note';
      note.textContent = model.note;
      const answer = document.createElement('p');
      answer.className = 'model-text';
      answer.textContent = model.text;
      card.append(title, note, answer);
      grid.appendChild(card);
    });
    panel.append(intro, grid);
    toggle.setAttribute('aria-controls', id);
    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      toggle.textContent = panel.hidden ? 'Show model answers · A2 / B1 / B2' : 'Hide model answers';
    });
    wrap.append(toggle, panel);
    return wrap;
  }

  function renderWritingModels() {
    const target = $('#writingModels');
    if (target) target.appendChild(createModelAnswers(writingModels, 'writing-model-answers'));
  }

  function renderLivePrompts() {
    const target = $('#livePrompts');
    livePrompts.forEach((item, index) => {
      const card = document.createElement('article'); card.className = 'live-prompt';
      card.innerHTML = `<span class="prompt-label">EXAMINER QUESTION ${index + 1}</span><h3>${item.title}</h3><p>${item.prompt}</p><p class="scenario-quote">${item.tip}</p><textarea class="answer-notes" aria-label="Answer notes for examiner question ${index + 1}" placeholder="Optional answer notes / useful phrases…"></textarea>`;
      card.appendChild(createModelAnswers(liveModels[index], `live-model-answer-${index + 1}`));
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
      card.appendChild(createModelAnswers(roleplayModels[index], `roleplay-model-answer-${index + 1}`));
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
    listeningTasks.forEach((task, taskIndex) => task.questions.forEach((question, questionIndex) => pairs.push({ id: `listening-${taskIndex}-${questionIndex}`, question, skill: 'Listening' })));
    readingTasks.forEach((question, index) => pairs.push({ id: `reading-${index}`, question, skill: 'Reading' }));
    serviceLanguageTasks.forEach((question, index) => pairs.push({ id: `functional-language-${index}`, question, skill: 'Service language' }));
    grammarAccuracyTasks.forEach((question, index) => pairs.push({ id: `grammar-accuracy-${index}`, question, skill: 'Language accuracy' }));
    return pairs;
  }
  function markAnswers() {
    let correct = 0;
    const skillScores = { Listening: 0, Reading: 0, 'Service language': 0, 'Language accuracy': 0 };
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
        'Service language': { score: skillScores['Service language'], max: serviceLanguageTasks.length, type: 'Auto-marked' },
        'Language accuracy': { score: skillScores['Language accuracy'], max: grammarAccuracyTasks.length, type: 'Auto-marked' },
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
    resultCard.innerHTML = `<h3>Your training score: ${score} / ${TOTAL_MAX} (${percentage}%)</h3><p>${readiness}</p><div class="result-grid"><div class="result-metric"><span>Auto-marked</span><strong>${correct} / ${AUTO_MAX}</strong></div><div class="result-metric"><span>Self-review</span><strong>${live + writing + roleplay} / 16</strong></div><div class="result-metric"><span>Writing length</span><strong>${countWords($('#writingResponse').value)} words</strong></div></div><p><a href="score-passport.html"><strong>Open your Score Passport →</strong></a> Your mock has been saved there automatically.</p>`;
    liveRegion.textContent = `Mock result saved: ${score} out of ${TOTAL_MAX}.`;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function calculateMarkedScores() {
    let correct = 0; const skillScores = { Listening: 0, Reading: 0, 'Service language': 0, 'Language accuracy': 0 };
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
      `Service language: ${skillScores['Service language']} / ${serviceLanguageTasks.length}`,
      `Language accuracy: ${skillScores['Language accuracy']} / ${grammarAccuracyTasks.length}`,
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

  renderLivePrompts(); renderListeningTasks(); renderSimpleQuestions(readingTasks, '#readingTasks', 'Reading'); renderSimpleQuestions(serviceLanguageTasks, '#languageTasks', 'Functional language'); renderSimpleQuestions(grammarAccuracyTasks, '#grammarTasks', 'Grammar accuracy'); renderWritingModels(); renderRoleplays(); initializeVoice(); initializeEvents(); updateTimer(); updateWritingCount(); updateChecklistScores();
})();
