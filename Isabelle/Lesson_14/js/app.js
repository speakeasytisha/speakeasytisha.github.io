(() => {
  const state = { score: 0, completed: new Set(), timerInterval: null, seconds: 0, sprintInterval: null, sprintSeconds: 480, mediaRecorder: null, audioChunks: [], recordingUrl: null };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function updateScore(points = 0) {
    state.score += points;
    $('#score').textContent = state.score;
  }
  function completeStep(step) {
    state.completed.add(step);
    const count = state.completed.size;
    const total = 12;
    const percent = Math.min(100, Math.round((count / total) * 100));
    $('#progressFill').style.width = `${percent}%`;
    $('#progressText').textContent = `${percent}% complete`;
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) { alert('Text-to-speech is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = $('#voiceSelect').value;
    u.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === u.lang) || voices.find(v => v.lang.startsWith(u.lang.slice(0,2)));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  }
  $('#voiceSelect').addEventListener('change', (e) => { $('#voiceLabel').textContent = e.target.value === 'en-GB' ? 'UK' : 'US'; });
  $('#readOverview').addEventListener('click', () => speak('In this lesson, you will turn your real estate legal and commercial experience into a concise, targeted and credible cover letter for a role in the Netherlands.'));
  $$('[data-speech]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speech)));

  $$('.choice-stack').forEach(stack => {
    stack.addEventListener('click', e => {
      const button = e.target.closest('button[data-choice]');
      if (!button || stack.dataset.locked) return;
      stack.dataset.locked = 'true';
      const isCorrect = button.dataset.choice === stack.dataset.correct;
      const feedback = $(`#feedback-${stack.dataset.question}`);
      $$('.choice-stack button', stack).forEach(b => {
        if (b.dataset.choice === stack.dataset.correct) b.classList.add('correct');
        else if (b === button) b.classList.add('wrong');
      });
      if (isCorrect) {
        feedback.textContent = '✓ Exactly. This version is direct, specific and linked to the role.';
        feedback.className = 'feedback good';
        updateScore(10);
      } else {
        feedback.textContent = 'Not quite. Read the strongest connection again, then use the model as a phrase bank.';
        feedback.className = 'feedback bad';
      }
      completeStep(stack.closest('.lesson-section')?.dataset.step || 0);
    });
  });

  $$('.upgrade-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.closest('.upgrade-item');
      const open = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      $('.toggle-sign', toggle).textContent = open ? '−' : '+';
      completeStep(3);
    });
  });

  $$('.check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = $(`#${btn.dataset.input}`);
      const answer = btn.dataset.answer;
      const clean = input.value.trim().toLowerCase().replace(/[.!?]/g, '');
      const feedback = $(`#feedback-${btn.dataset.input}`);
      const accepted = clean === answer || clean.startsWith(answer + ' ');
      if (accepted) {
        feedback.textContent = '✓ Correct. Keep this pattern as a reliable phrase frame.';
        feedback.className = 'feedback good';
        updateScore(8);
      } else {
        feedback.textContent = `Try: “${answer}”. Then read the full model sentence aloud.`;
        feedback.className = 'feedback bad';
      }
      completeStep(5);
    });
  });

  $('#vocabSearch').addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    $$('.vocab-card').forEach(card => { card.style.display = card.dataset.search.toLowerCase().includes(q) || card.textContent.toLowerCase().includes(q) ? '' : 'none'; });
  });
  let vocabExpanded = false;
  $('#expandVocab').addEventListener('click', () => {
    vocabExpanded = !vocabExpanded;
    $$('.vocab-accordions details').forEach(d => d.open = vocabExpanded);
    $('#expandVocab').textContent = vocabExpanded ? 'Close all' : 'Open all';
  });

  const builderTarget = ['I would bring','a practical, business-oriented approach','to contract negotiation, risk assessment','and stakeholder coordination.'];
  const builderChosen = [];
  $$('#builderPieces button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('selected')) return;
      builderChosen.push(btn.dataset.piece);
      btn.classList.add('selected');
      $('#builderOutput').textContent = builderChosen.join(' ');
    });
  });
  $('#checkBuilder').addEventListener('click', () => {
    const right = JSON.stringify(builderChosen) === JSON.stringify(builderTarget);
    const feedback = $('#feedback-builder');
    if (right) { feedback.textContent = '✓ Excellent. This is a clear contribution sentence you can reuse.'; feedback.className = 'feedback good'; updateScore(12); }
    else { feedback.textContent = 'Try again. Start with “I would bring”, then name the approach, then say where you would bring it.'; feedback.className = 'feedback bad'; }
    completeStep(7);
  });
  $('#resetBuilder').addEventListener('click', () => { builderChosen.length = 0; $$('#builderPieces button').forEach(b => b.classList.remove('selected')); $('#builderOutput').textContent = 'Click the pieces in the correct order.'; $('#feedback-builder').textContent = ''; });
  $('#readBuilder').addEventListener('click', () => speak(builderTarget.join(' ')));

  $('#copyLetter').addEventListener('click', async () => {
    const text = $('#finalLetter').innerText;
    try { await navigator.clipboard.writeText(text); $('#copyLetter').textContent = 'Copied ✓'; setTimeout(() => $('#copyLetter').textContent = 'Copy letter', 1700); } catch { alert('Select the letter text and copy it manually.'); }
  });
  $('#printLetter').addEventListener('click', () => window.print());
  $$('.reveal-model').forEach(btn => btn.addEventListener('click', () => { const model = $('.model-answer', btn.closest('.speaking-card')); const hidden = model.hidden; model.hidden = !hidden; btn.textContent = hidden ? 'Hide B2 model' : 'Reveal B2 model'; completeStep(11); }));

  function formatTimer() { const m = String(Math.floor(state.seconds / 60)).padStart(2,'0'); const s = String(state.seconds % 60).padStart(2,'0'); $('#timer').textContent = `${m}:${s}`; }
  $('#startTimer').addEventListener('click', () => { if (state.timerInterval) return; state.timerInterval = setInterval(() => { state.seconds++; formatTimer(); }, 1000); });
  $('#stopTimer').addEventListener('click', () => { clearInterval(state.timerInterval); state.timerInterval = null; });

  $('#sprintStart').addEventListener('click', () => {
    clearInterval(state.sprintInterval); state.sprintSeconds = 480;
    const render = () => { const m = String(Math.floor(state.sprintSeconds / 60)).padStart(2,'0'); const s = String(state.sprintSeconds % 60).padStart(2,'0'); $('#sprintTimer').textContent = `${m}:${s}`; };
    render();
    state.sprintInterval = setInterval(() => { state.sprintSeconds--; render(); if (state.sprintSeconds <= 0) { clearInterval(state.sprintInterval); state.sprintInterval = null; speak('Time is up. Read your paragraph once, then improve one sentence.'); } }, 1000);
  });
  $('#showSprintModel').addEventListener('click', () => { $('#sprintModel').hidden = !$('#sprintModel').hidden; $('#showSprintModel').textContent = $('#sprintModel').hidden ? 'Reveal model' : 'Hide model'; completeStep(12); });

  function stopTracks(stream) { stream?.getTracks().forEach(t => t.stop()); }
  $('#recordBtn').addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { $('#recordStatus').textContent = 'Recording is not supported in this browser. You can still practise aloud or use your phone recorder.'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.audioChunks = [];
      state.mediaRecorder = new MediaRecorder(stream);
      state.mediaRecorder.ondataavailable = e => { if (e.data.size) state.audioChunks.push(e.data); };
      state.mediaRecorder.onstop = () => {
        const blob = new Blob(state.audioChunks, { type: state.mediaRecorder.mimeType || 'audio/webm' });
        if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl);
        state.recordingUrl = URL.createObjectURL(blob);
        const audio = $('#audioPlayback'); audio.src = state.recordingUrl; audio.hidden = false;
        const link = $('#downloadRecording'); link.href = state.recordingUrl; link.hidden = false;
        $('#recordStatus').textContent = 'Recording ready. Listen back and notice one thing you want to improve.';
        $('#clearRecordBtn').disabled = false;
        stopTracks(stream);
      };
      state.mediaRecorder.start();
      $('#recordBtn').disabled = true; $('#stopRecordBtn').disabled = false;
      $('#recordStatus').textContent = 'Recording… speak for 45–60 seconds.';
    } catch (err) { $('#recordStatus').textContent = 'Microphone access was not granted. Check browser permissions, then try again.'; }
  });
  $('#stopRecordBtn').addEventListener('click', () => { if (state.mediaRecorder?.state === 'recording') state.mediaRecorder.stop(); $('#recordBtn').disabled = false; $('#stopRecordBtn').disabled = true; completeStep(11); });
  $('#clearRecordBtn').addEventListener('click', () => { if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl); state.recordingUrl = null; $('#audioPlayback').hidden = true; $('#audioPlayback').src = ''; $('#downloadRecording').hidden = true; $('#clearRecordBtn').disabled = true; $('#recordStatus').textContent = 'Recording cleared. You can record another answer.'; });

  $('#saveNotes').addEventListener('click', () => { localStorage.setItem('isabelle-holland-immo-notes', $('#notes').value); $('#notesSaved').textContent = '✓ Notes saved on this device.'; setTimeout(() => $('#notesSaved').textContent = '', 2500); });
  const saved = localStorage.getItem('isabelle-holland-immo-notes'); if (saved) $('#notes').value = saved;
  $('#markComplete').addEventListener('click', () => { completeStep(12); $('#markComplete').textContent = 'Lesson complete ✓'; updateScore(15); });
})();
