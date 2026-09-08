(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const sections = [
    { id: 'welcome', short: 'Welcoming someone', label: 'Welcome & interaction' },
    { id: 'documents', short: 'Consulting documents', label: 'Collect & transcribe' },
    { id: 'convey', short: 'Conveying instructions', label: 'Collect & transmit' },
    { id: 'gather', short: 'Gathering information', label: 'Collect & exploit' }
  ];

  // Original training items. These imitate public LILATE IA task families; they are not official exam questions.
  const baseQuestions = [
    {
      id: 'q1', section: 'welcome', type: 'single', seconds: 90,
      title: 'Identify the visitor’s main need',
      prompt: 'You are working at the reception desk of a professional services company. Read the message from a visitor who will arrive this afternoon.',
      document: `<div class="doc-meta"><span>Incoming message</span><span>14:05</span></div>
        <p><strong>From:</strong> Daniel Morris</p>
        <p>Hello, I have a 3:00 p.m. appointment with Ms Patel to discuss the service contract for our Lyon office. I may arrive about fifteen minutes early. Could someone also tell me where I can leave a small delivery for the finance team?</p>`,
      instruction: 'What is the best summary of the visitor’s request?',
      options: [
        'He wants to cancel his appointment and speak to the finance team instead.',
        'He has an appointment, may arrive early, and needs information about leaving a delivery.',
        'He is asking for a new service contract and wants the meeting moved to Lyon.',
        'He only wants directions to the finance department.'
      ],
      correct: [1],
      criteria: ['Identify the purpose of the contact.', 'Distinguish essential details from secondary information.', 'Choose the response that matches the full situation.'],
      explain: 'The message combines three useful facts: the scheduled meeting, possible early arrival, and a delivery question.'
    },
    {
      id: 'q2', section: 'welcome', type: 'multi', seconds: 120,
      title: 'Choose the two most appropriate actions',
      prompt: 'You are preparing for Daniel’s arrival. Select exactly two actions that best respond to the situation.',
      document: `<div class="doc-meta"><span>Reception note</span><span>Visitor: Daniel Morris</span></div>
        <p>Meeting with Ms Patel at 3:00 p.m. about the Lyon service contract. Visitor may arrive at 2:45 p.m. and has a small parcel for Finance.</p>`,
      instruction: 'Select exactly two answers.',
      options: [
        'Confirm that you can welcome him a little early and notify Ms Patel when he arrives.',
        'Tell him to leave the parcel outside the building because reception cannot accept deliveries.',
        'Explain where the parcel can be left for Finance or offer to check the correct drop-off point.',
        'Ask him to rewrite his message because the reason for his visit is unclear.'
      ],
      correct: [0, 2], maxSelect: 2,
      criteria: ['Respond to both parts of the visitor’s need.', 'Choose practical, professional actions.', 'Avoid actions that ignore information already provided.'],
      explain: 'The best actions acknowledge the early arrival and solve the delivery question.'
    },
    {
      id: 'q3', section: 'welcome', type: 'oral', seconds: 180, recordMax: 60,
      title: 'Welcome the visitor and clarify the next step',
      prompt: 'Daniel has now arrived at reception. Record a short professional response.',
      document: `<div class="doc-meta"><span>Situation</span><span>Reception</span></div>
        <p>Daniel says: “Hi, I’m Daniel Morris. I’m a bit early for my meeting with Ms Patel, and I also have this parcel for Finance.”</p>`,
      instruction: 'In about 30–60 seconds, welcome him, confirm what you understand, and explain what you will do next. Ask one useful clarification question if necessary.',
      criteria: ['Sound welcoming and professional.', 'Show that you understood both needs.', 'Explain a clear next step.', 'Use natural interaction language rather than a memorised speech.'],
      modelB1: 'Good afternoon. Welcome. I understand you are here for your three o’clock meeting with Ms Patel and you also have a parcel for Finance. I’ll let Ms Patel know that you have arrived. I can also check where the parcel should be left. Could you tell me who the parcel is addressed to?',
      modelB2: 'Good afternoon, Mr Morris. Welcome. I understand you are a little early for your 3 p.m. appointment with Ms Patel and you would also like to leave a parcel for the Finance team. I’ll notify Ms Patel that you’re here and confirm the correct drop-off point for the parcel. Is there a specific person’s name on the delivery?'
    },

    {
      id: 'q4', section: 'documents', type: 'audioText', seconds: 150,
      title: 'Listen to a voicemail and write a short email',
      prompt: 'You listen to a voicemail from a potential client contacting your company for the first time.',
      audio: `Hello, this is Sarah Bennett from Northbridge Events. We are organising a three-day conference in October and we are comparing support providers. Could you send me a short overview of your on-site coordination service, including whether weekend support is available? If possible, I would also like to know who I should speak to about a quotation. Thank you.`,
      instruction: 'After listening, write a short email to Sarah in 2–4 sentences. Thank her for her call and mention the information she is asking for.',
      criteria: ['Use a polite, professional tone.', 'Identify the requested service information.', 'Mention weekend availability and the quotation contact.', 'Keep the message concise and useful.'],
      minWords: 25,
      modelB1: 'Dear Sarah, Thank you for your call and your interest in our services. I understand that you would like information about our on-site coordination service, weekend support and the person to contact for a quotation. I will send you these details shortly. Kind regards,',
      modelB2: 'Dear Sarah, Thank you for getting in touch about your October conference. I understand that you would like a brief overview of our on-site coordination service, confirmation of weekend coverage, and the appropriate contact for a quotation. I’ll gather the information and come back to you shortly. Kind regards,'
    },
    {
      id: 'q5', section: 'documents', type: 'oral', seconds: 180, recordMax: 60,
      title: 'Reformulate a written project update aloud',
      prompt: 'You need to pass this update to a colleague who has not seen the written message.',
      document: `<div class="doc-meta"><span>Project update</span><span>Today</span></div>
        <p>The client review has moved from Thursday morning to Friday at 11:30. The draft presentation must therefore be sent by Thursday at 4:00 p.m. instead of Friday morning. The budget figures are already approved, but the final slide on delivery risks still needs input from Operations.</p>`,
      instruction: 'Record a 40–60 second reformulation. Do not read the text word-for-word. Make the changes, deadline and outstanding action easy to understand.',
      criteria: ['Reformulate rather than simply read.', 'State the new meeting time and earlier deadline accurately.', 'Identify what is already complete and what is still needed.', 'Link the information in a logical order.'],
      modelB1: 'The client review is now on Friday at 11:30, so the presentation must be sent earlier, by Thursday at 4 p.m. The budget figures are finished and approved. However, Operations still needs to give information for the last slide about delivery risks.',
      modelB2: 'There are two timing changes to note. The client review has been pushed back to Friday at 11:30, but the presentation deadline has actually moved forward to Thursday at 4 p.m. The budget section is already approved; the only outstanding item is Operations’ input for the final slide on delivery risks.'
    },
    {
      id: 'q6', section: 'documents', type: 'single', seconds: 100,
      title: 'Extract the operational priority from a table',
      prompt: 'You are checking the service desk summary before the morning meeting.',
      table: {
        headers: ['Issue', 'Open cases', 'Urgent', 'Average age'],
        rows: [
          ['Account access', '18', '3', '1.2 days'],
          ['Delivery delays', '9', '6', '2.8 days'],
          ['Invoice questions', '14', '1', '0.7 days'],
          ['Product returns', '7', '2', '1.9 days']
        ]
      },
      instruction: 'Which issue should most clearly receive immediate attention based on urgency?',
      options: ['Account access', 'Delivery delays', 'Invoice questions', 'Product returns'],
      correct: [1],
      criteria: ['Locate the relevant field in the table.', 'Prioritise the information requested in the question.', 'Avoid choosing only by total volume.'],
      explain: 'Delivery delays has the highest number of urgent cases (6), even though another category has more open cases overall.'
    },

    {
      id: 'q7', section: 'convey', type: 'audioSingle', seconds: 100,
      title: 'Identify the correct instruction',
      prompt: 'Listen to a manager’s message about tomorrow morning.',
      audio: `Tomorrow, the building inspection starts at nine. Please make sure the visitor badges are printed before eight forty-five. The safety file should be placed in Meeting Room B, not at reception. If the inspector arrives early, call Elena directly rather than asking them to wait in the lobby.`,
      instruction: 'Which instruction is correct?',
      options: [
        'The safety file must be left at reception before 8:45.',
        'Visitor badges should be ready before 8:45, and an early inspector should trigger a call to Elena.',
        'The inspection has been moved to Meeting Room B at 8:45.',
        'Elena should wait in the lobby for the inspector.'
      ],
      correct: [1],
      criteria: ['Understand sequence, time and location details.', 'Distinguish preparation tasks from the inspection itself.', 'Select the option that preserves both key instructions.'],
      explain: 'The badges are needed before 8:45; the safety file goes to Room B; if the inspector is early, call Elena.'
    },
    {
      id: 'q8', section: 'convey', type: 'audioText', seconds: 180,
      title: 'Turn spoken instructions into a written procedure',
      prompt: 'A colleague explains what to do when a customer requests an urgent change after a booking has been confirmed.',
      audio: `First, check whether the requested change affects the price or the delivery date. If it does, do not confirm anything immediately. Open the customer record and note the new request. Then contact the operations team for feasibility and ask finance to validate any price difference. Once both teams reply, send the customer one clear written confirmation with the updated details.`,
      instruction: 'Write the procedure as 4–5 clear steps. Keep the original order and do not add actions that were not mentioned.',
      criteria: ['Capture the key conditions and sequence.', 'Use clear action verbs.', 'Keep Operations and Finance roles distinct.', 'End with written confirmation to the customer.'],
      minWords: 35,
      modelB1: '1. Check if the change affects the price or delivery date. 2. If it does, note the request in the customer record and do not confirm it yet. 3. Ask Operations if the change is possible. 4. Ask Finance to validate any price difference. 5. When both teams reply, send the customer the updated confirmation.',
      modelB2: '1. Check whether the requested change impacts pricing or the delivery schedule. 2. If so, record the new request without confirming it to the customer. 3. Ask Operations to confirm feasibility. 4. Have Finance validate any price adjustment. 5. Once both approvals are received, send one clear written confirmation summarising the revised details.'
    },
    {
      id: 'q9', section: 'convey', type: 'oralAudio', seconds: 180, recordMax: 60,
      title: 'Transmit third-party information to a colleague',
      prompt: 'You have just received this voice message. Your colleague Alex is taking over the case.',
      audio: `Hi, this is Maya from the supplier team. The replacement units can leave our warehouse tomorrow afternoon, but only if we receive the revised purchase order by ten thirty in the morning. Please remove item C-14 from the order because it is discontinued. The other items are available. If the document arrives after ten thirty, shipment will move to Monday.`,
      instruction: 'Record a concise handover to Alex. Include the deadline, the change to the order and the consequence of missing the deadline.',
      criteria: ['Transmit all three critical facts accurately.', 'Use concise professional handover language.', 'Make the consequence clear.', 'Avoid irrelevant detail.'],
      modelB1: 'Alex, the supplier can ship the replacement units tomorrow afternoon if they receive the revised purchase order by 10:30 a.m. We need to remove item C-14 because it is discontinued. If the order arrives after 10:30, the shipment will be delayed until Monday.',
      modelB2: 'Alex, quick handover from the supplier: tomorrow’s shipment is still possible, but the revised purchase order must reach them by 10:30 a.m. Please remove discontinued item C-14; everything else is available. If we miss the 10:30 cut-off, dispatch moves to Monday.'
    },

    {
      id: 'q10', section: 'gather', type: 'multi', seconds: 110,
      title: 'Analyse a short performance summary',
      prompt: 'You are reviewing a monthly client-service note before suggesting priorities for next month.',
      document: `<div class="doc-meta"><span>Monthly summary</span><span>Client support</span></div>
        <p>Response time improved from 5.2 hours to 3.8 hours. Satisfaction rose from 82% to 86%. However, repeat contacts increased by 18%, mainly because customers did not always receive complete instructions in the first reply. Weekend requests also grew by 12%, while weekend staffing remained unchanged.</p>`,
      instruction: 'Which two points are the strongest priorities for action? Select exactly two.',
      options: [
        'Reduce response speed because it improved too quickly.',
        'Improve the completeness of first replies to reduce repeat contacts.',
        'Review weekend capacity because demand increased while staffing did not.',
        'Stop measuring customer satisfaction because it is already above 80%.'
      ],
      correct: [1, 2], maxSelect: 2,
      criteria: ['Identify positive results versus unresolved problems.', 'Select priorities supported by evidence.', 'Connect operational action to the data.'],
      explain: 'Repeat contacts and weekend demand are the two emerging operational pressures.'
    },
    {
      id: 'q11', section: 'gather', type: 'audioSingle', seconds: 100,
      title: 'Understand a video-style team update',
      prompt: 'Imagine this is the spoken content of a short internal video. Listen and choose the best interpretation.',
      audio: `We completed the pilot with twelve customers. Most liked the faster setup, but three customers were confused by the new confirmation screen. For the next version, we are keeping the faster setup and changing the wording on that screen. We will not change the payment process because no problems were reported there.`,
      visual: `<div class="video-card"><div class="video-title">Pilot update</div><div class="video-metrics"><span>12 customers</span><span>3 confused by confirmation screen</span><span>0 payment issues</span></div><div class="video-caption">Internal product update • listen for the decision</div></div>`,
      instruction: 'What is the team planning to change?',
      options: [
        'They will slow down the setup and redesign the payment process.',
        'They will keep the faster setup and improve the wording on the confirmation screen.',
        'They will cancel the pilot because three customers had payment problems.',
        'They will keep everything unchanged because most customers were satisfied.'
      ],
      correct: [1],
      criteria: ['Separate test feedback from the final decision.', 'Identify what will change and what will stay the same.', 'Use both spoken and visual clues.'],
      explain: 'The team keeps the faster setup, changes the confirmation wording, and leaves payment unchanged.'
    },
    {
      id: 'q12', section: 'gather', type: 'oral', seconds: 240, recordMax: 90,
      title: 'Make a recommendation and justify it',
      prompt: 'You are asked to recommend one action for next month based on the information below.',
      document: `<div class="doc-meta"><span>Decision brief</span><span>Next month</span></div>
        <p><strong>Option A — Extend weekend support:</strong> estimated cost +8%; addresses a 12% rise in weekend requests.</p>
        <p><strong>Option B — Rewrite first-response templates:</strong> low implementation cost; repeat contacts increased 18% because instructions were incomplete.</p>
        <p><strong>Option C — Add a new satisfaction survey:</strong> moderate cost; current satisfaction already rose from 82% to 86%.</p>`,
      instruction: 'Record a 60–90 second recommendation. Choose one priority, explain why, refer to evidence, and mention one possible limitation or next step.',
      criteria: ['State a clear recommendation.', 'Use evidence from the brief.', 'Explain cause and impact.', 'Acknowledge a limitation or practical next step.', 'Structure the answer logically.'],
      modelB1: 'I would choose Option B and rewrite the first-response templates. Repeat contacts increased by 18% because customers did not always receive complete instructions. This option also has a low cost, so it could improve service without a large budget. One limitation is that we need to check whether the new templates really reduce repeat contacts. I would test them for one month and compare the results.',
      modelB2: 'My first priority would be Option B: rewriting the first-response templates. The strongest evidence is the 18% increase in repeat contacts, which is directly linked to incomplete instructions, so this action targets a clear cause rather than only a symptom. It is also relatively low-cost. The limitation is that templates alone may not solve every case, so I would pilot the revised wording for a month, track repeat-contact rates and then decide whether weekend capacity also needs to be increased.'
    }
  ];

  const state = {
    mode: 'exam',
    voicePref: 'mixed',
    questions: [],
    index: 0,
    answers: {},
    startedAt: null,
    itemStartedAt: null,
    timerId: null,
    elapsedId: null,
    remaining: 0,
    itemTotal: 0,
    mediaRecorder: null,
    mediaStream: null,
    chunks: [],
    recordings: {},
    recordingTimerId: null,
    recordingStartedAt: null,
    cameraStream: null,
    tabChanges: 0,
    completed: false
  };

  const els = {
    briefing: $('#briefingView'), exam: $('#examView'), results: $('#resultsView'),
    startBtn: $('#startMockBtn'), understand: $('#understandMock'), modeSelect: $('#modeSelect'),
    voicePref: $('#voicePref'), voicePrefExam: $('#voicePrefExam'),
    host: $('#questionHost'), validate: $('#validateBtn'), skip: $('#skipBtn'), prev: $('#prevBtn'),
    feedback: $('#feedbackPanel'), counter: $('#questionCounter'), elapsed: $('#elapsedTime'),
    sectionProgress: $('#sectionProgress'), criteria: $('#criteriaList'), timer: $('#itemTimer'),
    timerRing: $('#timerRing'), modeBadge: $('#modeBadge'), cameraBtn: $('#cameraBtn'),
    cameraPreview: $('#cameraPreview'), cameraPlaceholder: $('#cameraPlaceholder'), camStatus: $('#camStatus'),
    tabChanges: $('#tabChanges'), settingsDialog: $('#settingsDialog')
  };

  function cloneAndShuffleQuestions() {
    state.questions = baseQuestions.map(q => ({...q, options: q.options ? q.options.map((t, i) => ({ text: t, originalIndex: i })) : undefined }));
    // Realistic variation: shuffle choice position per run so the correct answer isn't predictably first.
    state.questions.forEach(q => {
      if (!q.options) return;
      q.options = shuffle(q.options);
      if (q.correct) {
        q.correctDisplay = q.options.map((o, idx) => q.correct.includes(o.originalIndex) ? idx : -1).filter(i => i >= 0);
      }
    });
  }

  function shuffle(arr) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function mmss(n) {
    const m = Math.floor(n / 60).toString().padStart(2, '0');
    const s = Math.max(0, n % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function renderTable(table) {
    if (!table) return '';
    return `<table class="data-table"><thead><tr>${table.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function renderAudio(q) {
    if (!q.audio) return '';
    const accentLabel = q.accent || (state.voicePref === 'mixed' ? 'Mixed English' : state.voicePref);
    const practiceTranscript = state.mode === 'practice' ? `<button class="transcript-toggle" data-transcript="${q.id}">Show transcript</button>` : `<span>Transcript unavailable in exam simulation</span>`;
    return `<div class="audio-box">
      <div class="audio-controls"><button class="play-btn" data-play="${q.id}" aria-label="Play audio">▶</button><div class="audio-line"><i id="audioProgress-${q.id}"></i></div></div>
      <div class="audio-caption"><span>Audio prompt • ${escapeHtml(accentLabel)}</span>${practiceTranscript}</div>
      <div id="transcript-${q.id}" class="transcript hidden">${escapeHtml(q.audio)}</div>
    </div>`;
  }

  function renderVisual(q) { return q.visual || ''; }

  function renderChoices(q) {
    const isMulti = q.type === 'multi';
    const saved = state.answers[q.id]?.selected || [];
    return `<div class="choice-label">${isMulti ? `Multiple answers possible${q.maxSelect ? ` — select ${q.maxSelect}` : ''}` : 'Select one answer'}</div>
      <div class="options">${q.options.map((o, i) => `<label class="option ${saved.includes(i) ? 'selected' : ''}">
        <input type="${isMulti ? 'checkbox' : 'radio'}" name="choice-${q.id}" value="${i}" ${saved.includes(i) ? 'checked' : ''}>
        <span>${escapeHtml(o.text)}</span>
      </label>`).join('')}</div>`;
  }

  function renderTextResponse(q) {
    const value = state.answers[q.id]?.text || '';
    return `<textarea id="textResponse" class="text-response" placeholder="Type your professional response here…" spellcheck="true">${escapeHtml(value)}</textarea>
      <div class="word-count"><span id="wordCount">${wordCount(value)}</span> words${q.minWords ? ` • training target: ${q.minWords}+` : ''}</div>`;
  }

  function renderRecorder(q) {
    const rec = state.recordings[q.id];
    return `<div class="recorder">
      <div class="recorder-top">
        <div class="record-main"><button id="recordBtn" class="record-btn" aria-label="Start recording">●</button><div><div id="recordStatus" class="record-status">Ready to record</div><div class="record-limit">Maximum recording time: ${q.recordMax} seconds</div></div></div>
      </div>
      <audio id="recordPlayback" class="record-playback ${rec ? '' : 'hidden'}" controls ${rec ? `src="${rec.url}"` : ''}></audio>
      <div class="record-actions ${rec ? '' : 'hidden'}" id="recordActions"><button id="redoRecord" class="mini-btn" type="button">Record again</button><button id="downloadRecord" class="mini-btn" type="button">Save this recording</button></div>
    </div>`;
  }

  function wordCount(text) { return text.trim() ? text.trim().split(/\s+/).length : 0; }

  function renderQuestion() {
    stopSpeech();
    stopRecordingIfNeeded(false);
    clearInterval(state.timerId);
    els.feedback.classList.add('hidden');
    els.feedback.classList.remove('bad');
    els.feedback.innerHTML = '';

    const q = state.questions[state.index];
    els.counter.textContent = `${state.index + 1} / ${state.questions.length}`;
    els.modeBadge.textContent = state.mode === 'exam' ? 'EXAM MODE' : 'PRACTICE MODE';
    els.prev.style.visibility = state.mode === 'practice' && state.index > 0 ? 'visible' : 'hidden';
    els.validate.textContent = state.index === state.questions.length - 1 ? 'Validate & finish' : 'Validate my answer';

    let interaction = '';
    if (['single','multi','audioSingle'].includes(q.type)) interaction = renderChoices(q);
    if (q.type === 'audioText') interaction = renderTextResponse(q);
    if (['oral','oralAudio'].includes(q.type)) interaction = renderRecorder(q);

    els.host.innerHTML = `
      <div class="question-kicker">${sectionName(q.section)} • ${taskLabel(q.type)}</div>
      <h2 class="question-title">${escapeHtml(q.title)}</h2>
      <p class="question-prompt">${escapeHtml(q.prompt)}</p>
      ${q.audio ? renderAudio(q) : ''}
      ${q.document ? `<div class="document-box">${q.document}</div>` : ''}
      ${renderTable(q.table)}
      ${renderVisual(q)}
      <p class="instruction"><strong>Task:</strong> ${escapeHtml(q.instruction)}</p>
      ${interaction}
    `;

    bindQuestionInteractions(q);
    renderCriteria(q);
    renderProgress();
    startItemTimer(q.seconds);
    state.itemStartedAt = Date.now();
  }

  function taskLabel(type) {
    const map = { single:'Single choice', multi:'Multiple choice', audioSingle:'Listening + single choice', audioText:'Listening + writing', oral:'Recorded speaking', oralAudio:'Listening + recorded speaking' };
    return map[type] || 'Professional task';
  }

  function sectionName(id) { return sections.find(s => s.id === id)?.label || id; }

  function bindQuestionInteractions(q) {
    $$('.option', els.host).forEach(label => {
      const input = $('input', label);
      input.addEventListener('change', () => {
        if (q.type === 'multi' && q.maxSelect) {
          const checked = $$(`input[name="choice-${q.id}"]:checked`, els.host);
          if (checked.length > q.maxSelect) {
            input.checked = false;
            showTransient(`Select exactly ${q.maxSelect} answers.`);
          }
        }
        $$('.option', els.host).forEach(o => o.classList.toggle('selected', $('input', o).checked));
        saveCurrentInput();
      });
    });

    const ta = $('#textResponse', els.host);
    if (ta) {
      ta.addEventListener('input', () => { $('#wordCount', els.host).textContent = wordCount(ta.value); saveCurrentInput(); });
      if (state.mode === 'exam') {
        ['copy','cut','paste','drop'].forEach(evt => ta.addEventListener(evt, e => {
          e.preventDefault();
          showTransient('Copy/paste is disabled in exam mode, as in the real LILATE IA writing environment.');
        }));
      }
    }

    $$('[data-play]', els.host).forEach(btn => btn.addEventListener('click', () => playAudioPrompt(q)));
    $$('[data-transcript]', els.host).forEach(btn => btn.addEventListener('click', () => {
      const t = $(`#transcript-${q.id}`);
      t.classList.toggle('hidden');
      btn.textContent = t.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    }));

    const recBtn = $('#recordBtn', els.host);
    if (recBtn) recBtn.addEventListener('click', () => toggleRecording(q));
    const redo = $('#redoRecord', els.host);
    if (redo) redo.addEventListener('click', () => {
      if (state.recordings[q.id]?.url) URL.revokeObjectURL(state.recordings[q.id].url);
      delete state.recordings[q.id];
      state.answers[q.id] = { ...(state.answers[q.id] || {}), recorded: false, recordingSeconds: 0 };
      const playback = $('#recordPlayback', els.host);
      const actions = $('#recordActions', els.host);
      const status = $('#recordStatus', els.host);
      if (playback) { playback.pause(); playback.removeAttribute('src'); playback.classList.add('hidden'); }
      actions?.classList.add('hidden');
      if (status) status.textContent = 'Ready to record again';
    });
    const down = $('#downloadRecord', els.host);
    if (down) down.addEventListener('click', () => downloadRecording(q.id));
  }

  function renderCriteria(q) {
    els.criteria.innerHTML = q.criteria.map(c => `<li>${escapeHtml(c)}</li>`).join('');
  }

  function renderProgress() {
    const currentSection = state.questions[state.index].section;
    const currentSectionIdx = sections.findIndex(s => s.id === currentSection);
    els.sectionProgress.innerHTML = sections.map((s, i) => {
      const status = i < currentSectionIdx ? 'done' : i === currentSectionIdx ? 'current' : '';
      const mark = i < currentSectionIdx ? '✓' : i + 1;
      return `<div class="section-step ${status}"><div class="step-num">${mark}</div><div class="step-copy"><strong>${escapeHtml(s.short)}</strong><small>${i < currentSectionIdx ? 'Validated' : i === currentSectionIdx ? 'In progress' : 'Upcoming'}</small></div></div>`;
    }).join('');
  }

  function startItemTimer(seconds) {
    state.itemTotal = seconds;
    state.remaining = seconds;
    updateTimerUI();
    state.timerId = setInterval(() => {
      state.remaining -= 1;
      updateTimerUI();
      if (state.remaining <= 0) {
        clearInterval(state.timerId);
        saveCurrentInput();
        stopRecordingIfNeeded(true);
        state.answers[state.questions[state.index].id] = { ...(state.answers[state.questions[state.index].id] || {}), timedOut: true };
        showTransient('Time is up — moving to the next question.');
        setTimeout(() => advance(), 650);
      }
    }, 1000);
  }

  function updateTimerUI() {
    els.timer.textContent = mmss(state.remaining);
    const ratio = Math.max(0, state.remaining / state.itemTotal);
    els.timerRing.style.setProperty('--timer-deg', `${Math.round(360 * ratio)}deg`);
    els.timerRing.classList.toggle('warning', ratio <= .33 && ratio > .12);
    els.timerRing.classList.toggle('critical', ratio <= .12);
  }

  function startElapsed() {
    clearInterval(state.elapsedId);
    const update = () => {
      const secs = Math.floor((Date.now() - state.startedAt) / 1000);
      const mins = Math.floor(secs / 60);
      const s = secs % 60;
      els.elapsed.textContent = mins ? `${mins} min ${s.toString().padStart(2,'0')} s` : `${s} s`;
    };
    update();
    state.elapsedId = setInterval(update, 1000);
  }

  function saveCurrentInput() {
    const q = state.questions[state.index];
    const existing = state.answers[q.id] || {};
    if (['single','multi','audioSingle'].includes(q.type)) {
      const selected = $$(`input[name="choice-${q.id}"]:checked`, els.host).map(i => Number(i.value));
      state.answers[q.id] = { ...existing, selected };
    } else if (q.type === 'audioText') {
      state.answers[q.id] = { ...existing, text: $('#textResponse', els.host)?.value || '' };
    } else {
      state.answers[q.id] = { ...existing, recorded: Boolean(state.recordings[q.id]), recordingSeconds: state.recordings[q.id]?.seconds || 0 };
    }
  }

  function answerIsPresent(q) {
    saveCurrentInput();
    const a = state.answers[q.id] || {};
    if (['single','audioSingle'].includes(q.type)) return a.selected?.length === 1;
    if (q.type === 'multi') return a.selected?.length === (q.maxSelect || a.selected?.length);
    if (q.type === 'audioText') return Boolean(a.text?.trim());
    if (['oral','oralAudio'].includes(q.type)) return Boolean(state.recordings[q.id]);
    return false;
  }

  function isClosedCorrect(q) {
    const selected = [...(state.answers[q.id]?.selected || [])].sort((a,b)=>a-b);
    const correct = [...(q.correctDisplay || [])].sort((a,b)=>a-b);
    return selected.length === correct.length && selected.every((v,i)=>v===correct[i]);
  }

  function validateCurrent() {
    const q = state.questions[state.index];
    saveCurrentInput();
    if (!answerIsPresent(q)) {
      showTransient('Please answer the question or choose “I don’t know”.');
      return;
    }
    if (state.mode === 'practice') {
      showPracticeFeedback(q);
      clearInterval(state.timerId);
      els.validate.textContent = state.index === state.questions.length - 1 ? 'Finish review' : 'Continue';
      els.validate.dataset.readyNext = '1';
      return;
    }
    advance();
  }

  function showPracticeFeedback(q) {
    let html = '';
    let bad = false;
    if (q.correctDisplay) {
      const ok = isClosedCorrect(q);
      bad = !ok;
      html = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${escapeHtml(q.explain || '')}`;
    } else {
      html = `<strong>Response saved.</strong> Compare your answer with the models below. Focus first on task achievement, then language quality.`;
    }
    if (q.modelB1 || q.modelB2) {
      html += `<div class="model-box"><strong>B1-style model</strong>${escapeHtml(q.modelB1 || '')}</div><div class="model-box"><strong>B2-style model</strong>${escapeHtml(q.modelB2 || '')}</div>`;
    }
    els.feedback.innerHTML = html;
    els.feedback.classList.toggle('bad', bad);
    els.feedback.classList.remove('hidden');
    els.feedback.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  function advance() {
    clearInterval(state.timerId);
    els.validate.dataset.readyNext = '';
    stopSpeech();
    stopRecordingIfNeeded(true);
    if (state.index >= state.questions.length - 1) return finishMock();
    state.index += 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function skipCurrent() {
    const q = state.questions[state.index];
    saveCurrentInput();
    state.answers[q.id] = { ...(state.answers[q.id] || {}), skipped: true };
    advance();
  }

  function previous() {
    if (state.mode !== 'practice' || state.index <= 0) return;
    saveCurrentInput();
    state.index -= 1;
    renderQuestion();
  }

  function playAudioPrompt(q) {
    if (!q.audio || !('speechSynthesis' in window)) {
      showTransient('Speech synthesis is not available in this browser.');
      return;
    }
    stopSpeech();
    const utter = new SpeechSynthesisUtterance(q.audio);
    const lang = chooseLangForQuestion(q);
    utter.lang = lang;
    const voices = speechSynthesis.getVoices();
    const exact = voices.find(v => v.lang === lang) || voices.find(v => v.lang?.startsWith(lang.slice(0,2)));
    if (exact) utter.voice = exact;
    utter.rate = 0.98;
    const progress = $(`#audioProgress-${q.id}`);
    const approxMs = Math.max(3500, q.audio.split(/\s+/).length / 2.6 * 1000);
    const started = performance.now();
    const anim = setInterval(() => {
      const pct = Math.min(100, ((performance.now() - started) / approxMs) * 100);
      if (progress) progress.style.width = `${pct}%`;
      if (pct >= 100 || !speechSynthesis.speaking) clearInterval(anim);
    }, 100);
    utter.onend = () => { if (progress) progress.style.width = '100%'; clearInterval(anim); };
    speechSynthesis.speak(utter);
  }

  function chooseLangForQuestion(q) {
    if (state.voicePref !== 'mixed') return state.voicePref;
    const order = ['en-GB','en-US','en-AU'];
    return order[state.index % order.length];
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  async function toggleRecording(q) {
    if (state.mediaRecorder?.state === 'recording') {
      state.mediaRecorder.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaStream = stream;
      state.chunks = [];
      const preferred = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? { mimeType:'audio/webm;codecs=opus' } : undefined;
      state.mediaRecorder = new MediaRecorder(stream, preferred);
      state.mediaRecorder.ondataavailable = e => { if (e.data?.size) state.chunks.push(e.data); };
      state.mediaRecorder.onstop = () => {
        clearInterval(state.recordingTimerId);
        const seconds = Math.max(1, Math.round((Date.now() - state.recordingStartedAt) / 1000));
        const blob = new Blob(state.chunks, { type: state.mediaRecorder.mimeType || 'audio/webm' });
        if (state.recordings[q.id]?.url) URL.revokeObjectURL(state.recordings[q.id].url);
        const url = URL.createObjectURL(blob);
        state.recordings[q.id] = { blob, url, seconds };
        state.mediaStream?.getTracks().forEach(t => t.stop());
        state.mediaStream = null;
        state.mediaRecorder = null;
        const playback = $('#recordPlayback', els.host);
        const actions = $('#recordActions', els.host);
        const recBtn = $('#recordBtn', els.host);
        const status = $('#recordStatus', els.host);
        if (playback) { playback.src = url; playback.classList.remove('hidden'); }
        actions?.classList.remove('hidden');
        recBtn?.classList.remove('recording');
        if (recBtn) recBtn.textContent = '●';
        if (status) status.textContent = `Recorded • ${seconds} sec • listen back before validating`;
        saveCurrentInput();
      };
      state.mediaRecorder.start();
      state.recordingStartedAt = Date.now();
      const btn = $('#recordBtn', els.host);
      const status = $('#recordStatus', els.host);
      btn?.classList.add('recording');
      if (btn) btn.textContent = '■';
      const update = () => {
        const elapsed = Math.floor((Date.now() - state.recordingStartedAt) / 1000);
        const left = Math.max(0, q.recordMax - elapsed);
        if (status) status.textContent = `Recording… ${left} sec remaining`;
        if (left <= 0 && state.mediaRecorder?.state === 'recording') state.mediaRecorder.stop();
      };
      update();
      state.recordingTimerId = setInterval(update, 250);
    } catch (err) {
      showTransient('Microphone access was not available. Allow microphone permission in your browser and try again.');
    }
  }

  function stopRecordingIfNeeded(save) {
    clearInterval(state.recordingTimerId);
    if (state.mediaRecorder?.state === 'recording') {
      if (save) state.mediaRecorder.stop();
      else {
        state.mediaRecorder.onstop = null;
        state.mediaRecorder.stop();
        state.mediaStream?.getTracks().forEach(t => t.stop());
        state.mediaRecorder = null;
        state.mediaStream = null;
      }
    }
  }

  function downloadRecording(qid) {
    const rec = state.recordings[qid];
    if (!rec) return;
    const a = document.createElement('a');
    a.href = rec.url;
    a.download = `LILATE_IA_mock_${qid}.webm`;
    a.click();
  }

  async function toggleCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(t => t.stop());
      state.cameraStream = null;
      els.cameraPreview.srcObject = null;
      els.cameraPreview.style.display = 'none';
      els.cameraPlaceholder.style.display = 'grid';
      els.camStatus.textContent = 'Inactive';
      els.camStatus.classList.remove('active');
      els.cameraBtn.textContent = 'Enable camera preview';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      state.cameraStream = stream;
      els.cameraPreview.srcObject = stream;
      await els.cameraPreview.play();
      els.cameraPreview.style.display = 'block';
      els.cameraPlaceholder.style.display = 'none';
      els.camStatus.textContent = 'Active';
      els.camStatus.classList.add('active');
      els.cameraBtn.textContent = 'Disable camera preview';
    } catch (e) {
      showTransient('Camera preview could not start. On GitHub Pages/HTTPS, allow camera permission and try again.');
    }
  }

  function showTransient(message) {
    els.feedback.textContent = message;
    els.feedback.classList.remove('hidden');
    setTimeout(() => {
      if (els.feedback.textContent === message) els.feedback.classList.add('hidden');
    }, 2200);
  }

  function startMock() {
    state.mode = els.modeSelect.value;
    state.voicePref = els.voicePref.value;
    els.voicePrefExam.value = state.voicePref;
    cloneAndShuffleQuestions();
    state.index = 0;
    state.answers = {};
    state.recordings = {};
    state.tabChanges = 0;
    els.tabChanges.textContent = '0';
    state.startedAt = Date.now();
    state.completed = false;
    els.briefing.classList.add('hidden');
    els.results.classList.add('hidden');
    els.exam.classList.remove('hidden');
    startElapsed();
    renderQuestion();
  }

  function finishMock() {
    saveCurrentInput();
    clearInterval(state.timerId);
    clearInterval(state.elapsedId);
    stopSpeech();
    stopRecordingIfNeeded(true);
    state.cameraStream?.getTracks().forEach(t => t.stop());
    state.cameraStream = null;
    state.completed = true;
    els.exam.classList.add('hidden');
    els.results.classList.remove('hidden');
    buildResults();
    window.scrollTo(0,0);
  }

  function buildResults() {
    const closed = state.questions.filter(q => q.correctDisplay);
    const correct = closed.filter(isClosedCorrect).length;
    const production = state.questions.filter(q => !q.correctDisplay);
    const attemptedProd = production.filter(q => answerIsSaved(q)).length;
    const totalSecs = Math.round((Date.now() - state.startedAt) / 1000);

    $('#scoreSummary').innerHTML = `
      <div class="score-card"><strong>${correct}/${closed.length}</strong><span>Automatically scored comprehension items correct</span></div>
      <div class="score-card"><strong>${attemptedProd}/${production.length}</strong><span>Speaking / writing productions completed</span></div>
      <div class="score-card"><strong>${Math.floor(totalSecs/60)}:${String(totalSecs%60).padStart(2,'0')}</strong><span>Total simulation time</span></div>
      <div class="score-card"><strong>${state.tabChanges}</strong><span>Window changes detected during the mock</span></div>`;

    $('#answerReview').innerHTML = `<h2>Detailed review</h2>` + state.questions.map((q, idx) => reviewCard(q, idx)).join('');
    bindRubrics();
  }

  function answerIsSaved(q) {
    const a = state.answers[q.id] || {};
    if (q.type === 'audioText') return Boolean(a.text?.trim());
    if (['oral','oralAudio'].includes(q.type)) return Boolean(state.recordings[q.id]);
    return Boolean(a.selected?.length);
  }

  function reviewCard(q, idx) {
    const a = state.answers[q.id] || {};
    if (q.correctDisplay) {
      const ok = isClosedCorrect(q);
      const userTexts = (a.selected || []).map(i => q.options[i]?.text).filter(Boolean);
      const correctTexts = q.correctDisplay.map(i => q.options[i]?.text).filter(Boolean);
      return `<article class="review-card"><div class="review-head"><h3>${idx+1}. ${escapeHtml(q.title)}</h3><span class="review-badge ${ok?'':'wrong'}">${ok?'Correct':'Review'}</span></div><div class="review-body">
        <div><strong>Your answer:</strong><div class="answer-box">${escapeHtml(userTexts.join('\n') || (a.skipped ? 'I don’t know / skipped' : 'No answer'))}</div></div>
        ${ok ? '' : `<div><strong>Best answer:</strong><div class="answer-box">${escapeHtml(correctTexts.join('\n'))}</div></div>`}
        <p>${escapeHtml(q.explain || '')}</p></div></article>`;
    }

    const response = q.type === 'audioText' ? (a.text || 'No written response') : (state.recordings[q.id] ? `Recording completed (${state.recordings[q.id].seconds} sec). Use the audio player below for teacher review.` : 'No oral recording');
    const audioPlayer = ['oral','oralAudio'].includes(q.type) && state.recordings[q.id] ? `<audio controls src="${state.recordings[q.id].url}" class="record-playback"></audio>` : '';
    const models = `<details><summary>Show training models</summary><div class="model-box"><strong>B1-style model</strong>${escapeHtml(q.modelB1 || '')}</div><div class="model-box"><strong>B2-style model</strong>${escapeHtml(q.modelB2 || '')}</div></details>`;
    return `<article class="review-card"><div class="review-head"><h3>${idx+1}. ${escapeHtml(q.title)}</h3><span class="review-badge manual">Manual review</span></div><div class="review-body">
      <strong>Your response</strong><div class="answer-box">${escapeHtml(response)}</div>${audioPlayer}
      ${models}
      <div class="rubric-grid" data-rubric="${q.id}">
        ${['Task achievement','Clarity & coherence','Language control','Professional appropriacy','Range & precision','Fluency / delivery'].map((name, i) => `<div class="rubric-item"><label><span>${name}</span><select data-rubric-item="${i}"><option value="">—</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label></div>`).join('')}
      </div>
      <p class="tiny">Trainer scale: 0 = not demonstrated, 1 = very limited, 2 = partly effective, 3 = effective, 4 = strong. This is a training rubric, not the proprietary official scoring algorithm.</p>
    </div></article>`;
  }

  function bindRubrics() {
    $$('[data-rubric]').forEach(grid => {
      $$('select', grid).forEach(sel => sel.addEventListener('change', () => {
        const qid = grid.dataset.rubric;
        state.answers[qid] = state.answers[qid] || {};
        state.answers[qid].rubric = $$('select', grid).map(s => s.value);
      }));
    });
  }

  function makeReportHtml() {
    const closed = state.questions.filter(q => q.correctDisplay);
    const correct = closed.filter(isClosedCorrect).length;
    const rows = state.questions.map((q, i) => {
      const a = state.answers[q.id] || {};
      let response = '';
      if (q.correctDisplay) response = (a.selected || []).map(idx => q.options[idx]?.text).filter(Boolean).join(' | ');
      else if (q.type === 'audioText') response = a.text || '';
      else response = state.recordings[q.id] ? `Oral recording completed (${state.recordings[q.id].seconds} sec) — audio file retained in browser session only.` : 'No recording';
      return `<tr><td>${i+1}</td><td>${escapeHtml(q.title)}</td><td>${escapeHtml(sectionName(q.section))}</td><td>${escapeHtml(response)}</td><td>${q.correctDisplay ? (isClosedCorrect(q) ? 'Correct' : 'Review') : 'Manual review'}</td></tr>`;
    }).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><title>LILATE IA Mock Report</title><style>body{font-family:Arial,sans-serif;margin:32px;color:#263038}h1{font-family:Georgia,serif}table{width:100%;border-collapse:collapse;font-size:13px}th,td{border:1px solid #ddd;padding:8px;vertical-align:top;text-align:left}th{background:#f3f7f5}.note{padding:12px;background:#eefaf6;border-radius:8px}</style></head><body><h1>LILATE IA Mock — Training Report</h1><p>Automatically scored comprehension: ${correct}/${closed.length}. Window changes: ${state.tabChanges}.</p><p class="note">This is a training simulation using original questions, not an official LILATE score or CEFR result. Oral recordings are not embedded in this HTML report; save them separately from the results page if needed.</p><table><thead><tr><th>#</th><th>Task</th><th>Section</th><th>Response</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  }

  function downloadHtmlReport() {
    const blob = new Blob([makeReportHtml()], { type:'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Marie-Christine_LILATE_IA_Mock_Report.html';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1200);
  }

  function resetToBriefing() {
    clearInterval(state.timerId); clearInterval(state.elapsedId);
    stopSpeech(); stopRecordingIfNeeded(false);
    state.cameraStream?.getTracks().forEach(t => t.stop());
    state.cameraStream = null;
    els.exam.classList.add('hidden');
    els.results.classList.add('hidden');
    els.briefing.classList.remove('hidden');
    window.scrollTo({top: $('#mockSetup').offsetTop - 20, behavior:'smooth'});
  }

  // ---------- event bindings ----------
  $('#jumpToStart').addEventListener('click', () => $('#mockSetup').scrollIntoView({behavior:'smooth'}));
  els.understand.addEventListener('change', () => els.startBtn.disabled = !els.understand.checked);
  els.startBtn.addEventListener('click', startMock);
  els.validate.addEventListener('click', () => {
    if (els.validate.dataset.readyNext === '1') advance(); else validateCurrent();
  });
  els.skip.addEventListener('click', skipCurrent);
  els.prev.addEventListener('click', previous);
  $('#exitMockBtn').addEventListener('click', () => { if (confirm('Exit this mock? Your current in-memory attempt will end.')) resetToBriefing(); });
  $('#endNowBtn').addEventListener('click', () => { if (confirm('End the simulation now and review what you completed?')) finishMock(); });
  els.cameraBtn.addEventListener('click', toggleCamera);
  $('#settingsBtn').addEventListener('click', () => els.settingsDialog.showModal());
  els.voicePrefExam.addEventListener('change', () => { state.voicePref = els.voicePrefExam.value; });
  $('#printResultsBtn').addEventListener('click', () => window.print());
  $('#downloadHtmlBtn').addEventListener('click', downloadHtmlReport);
  $('#restartBtn').addEventListener('click', () => { els.results.classList.add('hidden'); els.briefing.classList.remove('hidden'); $('#mockSetup').scrollIntoView({behavior:'smooth'}); });

  document.addEventListener('visibilitychange', () => {
    if (!els.exam.classList.contains('hidden') && document.hidden) {
      state.tabChanges += 1;
      els.tabChanges.textContent = String(state.tabChanges);
    }
  });

  window.addEventListener('beforeunload', e => {
    if (!els.exam.classList.contains('hidden') && !state.completed) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }
})();
