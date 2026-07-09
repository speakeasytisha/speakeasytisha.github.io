(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const state = { score: 0, done: new Set(), seconds: 0, interval: null, recorder: null, chunks: [], url: null };
  const totalSteps = Number(document.body.dataset.steps || 10);

  function normalize(v) {
    return (v || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, "'")
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function setScore(amount) {
    state.score += amount;
    const node = $('#score');
    if (node) node.textContent = state.score;
  }
  function complete(key) {
    if (!key || state.done.has(String(key))) return;
    state.done.add(String(key));
    const pct = Math.min(100, Math.round((state.done.size / totalSteps) * 100));
    const bar = $('#progressBar');
    const text = $('#progressText');
    if (bar) bar.style.width = `${pct}%`;
    if (text) text.textContent = `${pct}% complete`;
  }
  function feedback(id, message, good) {
    const el = $(`#feedback-${id}`);
    if (!el) return;
    el.textContent = message;
    el.className = `feedback ${good ? 'good' : 'bad'}`;
  }
  function getVoice() {
    const select = $('#voiceSelect');
    return select?.value || 'en-GB';
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) { alert('Text-to-speech is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getVoice();
    utterance.rate = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const requested = utterance.lang.toLowerCase();
    const voice = voices.find(v => v.lang.toLowerCase() === requested) || voices.find(v => v.lang.toLowerCase().startsWith(requested.slice(0,2)));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }
  $$('#speakOverview').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speech || 'In this lesson, you will turn a strong draft into a clear, targeted speculative application.')));
  $$('[data-speech]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.speech)));

  $$('.acc > button').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.acc');
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    const sign = $('.sign', btn); if (sign) sign.textContent = open ? '−' : '+';
    complete(btn.closest('[data-complete]')?.dataset.complete || 'accordion');
  }));

  $$('.choices').forEach(stack => stack.addEventListener('click', e => {
    const btn = e.target.closest('button[data-choice]');
    if (!btn || stack.dataset.locked === 'true') return;
    stack.dataset.locked = 'true';
    const correct = btn.dataset.choice === stack.dataset.correct;
    const question = stack.dataset.question;
    $$('button[data-choice]', stack).forEach(option => {
      if (option.dataset.choice === stack.dataset.correct) option.classList.add('correct');
      else if (option === btn) option.classList.add('wrong');
    });
    feedback(question, correct ? (stack.dataset.success || '✓ Exactly. This is the clearest and most natural choice.') : (stack.dataset.hint || 'Not quite. Review the upgraded version and try to notice the precise professional wording.'), correct);
    if (correct) setScore(Number(stack.dataset.points || 10));
    complete(stack.closest('[data-complete]')?.dataset.complete || question);
  }));

  $$('[data-check-input]').forEach(btn => btn.addEventListener('click', () => {
    const input = $(`#${btn.dataset.checkInput}`);
    const id = btn.dataset.checkInput;
    const answers = (btn.dataset.answers || '').split('|').map(normalize);
    const value = normalize(input?.value);
    const ok = answers.some(answer => value === answer || value.includes(answer));
    feedback(id, ok ? (btn.dataset.success || '✓ Correct. This is a reliable phrase you can reuse.') : (btn.dataset.hint || `Try again. Look for the key phrase in the model.`), ok);
    if (ok) setScore(Number(btn.dataset.points || 8));
    complete(btn.closest('[data-complete]')?.dataset.complete || id);
  }));

  const search = $('#vocabSearch');
  if (search) search.addEventListener('input', e => {
    const term = normalize(e.target.value);
    $$('.vocab details').forEach(card => {
      const content = normalize(card.textContent);
      card.style.display = !term || content.includes(term) ? '' : 'none';
    });
  });
  const toggleVocab = $('#toggleVocab');
  if (toggleVocab) {
    let expanded = false;
    toggleVocab.addEventListener('click', () => {
      expanded = !expanded;
      $$('.vocab details').forEach(item => item.open = expanded);
      toggleVocab.textContent = expanded ? 'Close all' : 'Open all';
    });
  }

  const builder = $('#builder');
  if (builder) {
    const chosen = [];
    const target = (builder.dataset.target || '').split('|');
    const output = $('#builderOutput');
    $$('.pieces button', builder).forEach(btn => btn.addEventListener('click', () => {
      if (btn.classList.contains('selected')) return;
      chosen.push(btn.dataset.piece);
      btn.classList.add('selected');
      if (output) output.textContent = chosen.join(' ');
    }));
    $('#checkBuilder')?.addEventListener('click', () => {
      const ok = JSON.stringify(chosen) === JSON.stringify(target);
      feedback('builder', ok ? '✓ Excellent. You built a strong contribution sentence.' : 'Try again. Begin with the action or background, then make the contribution clear and specific.', ok);
      if (ok) setScore(12);
      complete(builder.closest('[data-complete]')?.dataset.complete || 'builder');
    });
    $('#resetBuilder')?.addEventListener('click', () => {
      chosen.length = 0;
      $$('.pieces button', builder).forEach(btn => btn.classList.remove('selected'));
      if (output) output.textContent = 'Click the blocks in a logical order.';
      feedback('builder', '', false);
    });
    $('#listenBuilder')?.addEventListener('click', () => speak(target.join(' ')));
  }

  $$('[data-reveal]').forEach(btn => btn.addEventListener('click', () => {
    const target = $(`#${btn.dataset.reveal}`);
    if (!target) return;
    const hidden = target.hidden;
    target.hidden = !hidden;
    btn.textContent = hidden ? 'Hide model answer' : 'Reveal model answer';
    complete(btn.closest('[data-complete]')?.dataset.complete || btn.dataset.reveal);
  }));

  $$('[data-copy-target]').forEach(btn => btn.addEventListener('click', async () => {
    const target = $(`#${btn.dataset.copyTarget}`);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.innerText);
      const original = btn.textContent;
      btn.textContent = 'Copied ✓';
      setTimeout(() => btn.textContent = original, 1600);
    } catch (_) { alert('Select the text and copy it manually.'); }
  }));
  $$('.print').forEach(btn => btn.addEventListener('click', () => window.print()));

  const start = $('#startTimer'), stop = $('#stopTimer');
  function renderTimer() {
    const min = String(Math.floor(state.seconds / 60)).padStart(2, '0');
    const sec = String(state.seconds % 60).padStart(2, '0');
    const node = $('#timer'); if (node) node.textContent = `${min}:${sec}`;
  }
  if (start) start.addEventListener('click', () => {
    if (state.interval) return;
    state.interval = setInterval(() => { state.seconds += 1; renderTimer(); }, 1000);
  });
  if (stop) stop.addEventListener('click', () => { clearInterval(state.interval); state.interval = null; complete('timer'); });

  async function beginRecording() {
    const status = $('#recordStatus');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { if (status) status.textContent = 'Recording is not available here. Practise aloud or use your phone’s voice recorder.'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.chunks = [];
      state.recorder = new MediaRecorder(stream);
      state.recorder.ondataavailable = event => { if (event.data.size) state.chunks.push(event.data); };
      state.recorder.onstop = () => {
        const blob = new Blob(state.chunks, { type: state.recorder.mimeType || 'audio/webm' });
        if (state.url) URL.revokeObjectURL(state.url);
        state.url = URL.createObjectURL(blob);
        const player = $('#audioPlayback'), link = $('#downloadRecording');
        if (player) { player.src = state.url; player.hidden = false; }
        if (link) { link.href = state.url; link.hidden = false; }
        if (status) status.textContent = 'Recording ready. Listen once and improve one thing only.';
        stream.getTracks().forEach(track => track.stop());
      };
      state.recorder.start();
      $('#recordBtn').disabled = true; $('#stopRecordBtn').disabled = false;
      if (status) status.textContent = 'Recording… speak for 45–90 seconds.';
    } catch (_) { if (status) status.textContent = 'Microphone permission was not granted. Check your browser settings and try again.'; }
  }
  $('#recordBtn')?.addEventListener('click', beginRecording);
  $('#stopRecordBtn')?.addEventListener('click', () => {
    if (state.recorder?.state === 'recording') state.recorder.stop();
    $('#recordBtn').disabled = false; $('#stopRecordBtn').disabled = true;
    complete('recording');
  });
  $('#clearRecording')?.addEventListener('click', () => {
    if (state.url) URL.revokeObjectURL(state.url); state.url = null;
    const player = $('#audioPlayback'), link = $('#downloadRecording');
    if (player) { player.src = ''; player.hidden = true; }
    if (link) link.hidden = true;
    const status = $('#recordStatus'); if (status) status.textContent = 'Recording cleared. You can record a new version.';
  });

  const notes = $('#notes'), save = $('#saveNotes');
  const notesKey = document.body.dataset.notesKey;
  if (notes && notesKey) notes.value = localStorage.getItem(notesKey) || '';
  if (save && notes && notesKey) save.addEventListener('click', () => {
    localStorage.setItem(notesKey, notes.value);
    const status = $('#notesStatus'); if (status) { status.textContent = '✓ Notes saved on this device.'; setTimeout(() => status.textContent = '', 2200); }
    complete('notes');
  });
  $('#markComplete')?.addEventListener('click', e => { e.currentTarget.textContent = 'Lesson complete ✓'; setScore(15); complete('finish'); });
})();
