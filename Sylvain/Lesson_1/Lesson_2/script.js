(() => {
  'use strict';
  const storageKey = 'speakeasy-sylvain-lesson-2-airline-catering';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const state = { structure: {}, errors: {}, listening: {}, vtest: {}, feeling: '' };

  const activities = {
    structure: [
      { q: 'Choose the correct sentence.', options: ['We prepares meals for several airlines.', 'We prepare meals for several airlines.', 'We preparing meals for several airlines.'], correct: 'We prepare meals for several airlines.', why: 'With <b>we</b>, use the base verb: <b>prepare</b>.' },
      { q: 'Choose the correct sentence.', options: ['The logistics company deliver the final order.', 'The logistics company delivers the final order.', 'The logistics company delivering the final order.'], correct: 'The logistics company delivers the final order.', why: '“The company” = <b>it</b>, so use <b>delivers</b>.' },
      { q: 'Choose the correct question.', options: ['Does the driver collects the order?', 'Do the driver collect the order?', 'Does the driver collect the order?'], correct: 'Does the driver collect the order?', why: 'After <b>does</b>, use the base verb: <b>collect</b>.' }
    ],
    errors: [
      { q: 'Correct: “My company prepare food for airlines.”', options: ['My company prepares food for airlines.', 'My company is prepare food for airlines.', 'My company preparing food for airlines.'], correct: 'My company prepares food for airlines.', why: '“My company” = it, so <b>prepare</b> becomes <b>prepares</b>.' },
      { q: 'Correct: “We don’t delivers directly to the airlines.”', options: ['We don’t deliver directly to the airlines.', 'We don’t delivers direct to airlines.', 'We not deliver directly to the airlines.'], correct: 'We don’t deliver directly to the airlines.', why: 'After <b>don’t</b>, use the base verb: <b>deliver</b>.' },
      { q: 'Correct: “I am work with my wife.”', options: ['I work with my wife.', 'I am working with my wife every day.', 'I do work with my wife.'], correct: 'I work with my wife.', why: 'For a regular situation, use the present simple: <b>I work</b>.' },
      { q: 'Correct: “The airline need the order at 10:45.”', options: ['The airline needs the order at 10:45.', 'The airline need the order at 10:45.', 'The airline is need the order at 10:45.'], correct: 'The airline needs the order at 10:45.', why: '“The airline” = it, so use <b>needs</b>.' }
    ],
    listening: [
      { q: 'Which flight is the call about?', options: ['NA241', 'NA214', 'NA124'], correct: 'NA214', why: 'Emma says the call is about <b>flight NA214</b>.' },
      { q: 'How many vegetarian meals does Emma add?', options: ['Twelve', 'Seventy-two', 'Eighty'], correct: 'Twelve', why: 'The revised order includes <b>twelve vegetarian meals</b>.' },
      { q: 'What is the new collection time?', options: ['11:30', '4:00 pm', '10:45'], correct: '10:45', why: 'The collection time changes to <b>10:45</b>.' },
      { q: 'What will Sylvain do before 4 pm?', options: ['Deliver the order', 'Send a confirmation email', 'Call the driver'], correct: 'Send a confirmation email', why: 'He says he will update the order and <b>send a confirmation email</b>.' }
    ],
    vtest: [
      { q: 'When will the revised order be collected?', options: ['At 10:45 tomorrow', 'At 11:30 tomorrow', 'Before 4 pm today'], correct: 'At 10:45 tomorrow', why: 'The message says the revised order will be ready for collection at <b>10:45 tomorrow</b>.' },
      { q: 'How many standard meals are now required?', options: ['80', '12', '72'], correct: '72', why: 'The revised order includes <b>72 standard meals</b>.' },
      { q: 'What does “revised order” mean?', options: ['An order that has been changed', 'An order that has been cancelled', 'An order that has been delivered'], correct: 'An order that has been changed', why: '<b>Revised</b> means changed or updated.' }
    ]
  };

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function buildQuestions(type, containerId, statusId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    activities[type].forEach((item, index) => {
      const block = document.createElement('div');
      block.className = 'question-item';
      block.innerHTML = `<p>${index + 1}. ${item.q}</p><div class="answers"></div><p class="answer-feedback" aria-live="polite"></p>`;
      const answers = $('.answers', block);
      shuffle(item.options).forEach(option => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'answer-button'; btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(type, index, option, btn, block, statusId));
        answers.appendChild(btn);
      });
      container.appendChild(block);
    });
  }

  function selectAnswer(type, index, answer, button, block, statusId) {
    const item = activities[type][index];
    const isCorrect = answer === item.correct;
    state[type][index] = isCorrect;
    $$('.answer-button', block).forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === item.correct) btn.classList.add('correct');
    });
    if (!isCorrect) button.classList.add('wrong');
    $('.answer-feedback', block).innerHTML = `${isCorrect ? '✓ Correct.' : 'Not quite.'} ${item.why}`;
    updateScore(type, statusId);
    saveProgress(false);
  }

  function updateScore(type, statusId) {
    const total = activities[type].length;
    const answered = Object.keys(state[type]).length;
    const correct = Object.values(state[type]).filter(Boolean).length;
    const target = document.getElementById(statusId);
    if (answered) target.textContent = `${correct}/${total} correct${answered < total ? ` · ${total - answered} to go` : ' · Complete!'}`;
  }

  function toggleHint(button) {
    const target = document.getElementById(button.dataset.hintTarget);
    target.classList.toggle('visible');
    button.textContent = target.classList.contains('visible') ? 'Hide hint' : 'Hint';
  }

  function speak(text, rate = 0.93) {
    if (!('speechSynthesis' in window)) { alert('Audio is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = rate;
    utterance.pitch = 1;
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  function sentenceWithAgreement(subject, verb, detail) {
    const thirdPerson = ['The logistics company', 'Our team'].includes(subject);
    const verbs = { 'prepare': thirdPerson ? 'prepares' : 'prepare', 'pack and label': thirdPerson ? 'packs and labels' : 'pack and label', 'confirm': thirdPerson ? 'confirms' : 'confirm', 'deliver': thirdPerson ? 'delivers' : 'deliver', 'manage': thirdPerson ? 'manages' : 'manage' };
    return `${subject} ${verbs[verb]} ${detail}.`;
  }

  function updateBuilder() {
    const subject = $('#builderSubject').value;
    const verb = $('#builderVerb').value;
    const detail = $('#builderDetail').value;
    const sentence = sentenceWithAgreement(subject, verb, detail);
    $('#builderOutput').textContent = sentence;
    saveProgress(false);
  }

  function setupWorkflow() {
    const list = $('#workflowList');
    let dragged = null;
    $$('#workflowList li').forEach(item => {
      item.addEventListener('dragstart', () => { dragged = item; item.classList.add('dragging'); });
      item.addEventListener('dragend', () => { item.classList.remove('dragging'); dragged = null; });
      item.addEventListener('dragover', e => { e.preventDefault(); if (!dragged || dragged === item) return; const rect = item.getBoundingClientRect(); const before = e.clientY < rect.top + rect.height / 2; list.insertBefore(dragged, before ? item : item.nextSibling); });
      $('.move-up', item).addEventListener('click', () => { const prev = item.previousElementSibling; if (prev) list.insertBefore(item, prev); });
      $('.move-down', item).addEventListener('click', () => { const next = item.nextElementSibling; if (next) list.insertBefore(next, item); });
    });
    $('#checkWorkflow').addEventListener('click', () => {
      const values = $$('#workflowList li').map(li => Number(li.dataset.step));
      const correct = values.every((v, i) => v === i + 1);
      $$('#workflowList li').forEach(li => li.classList.toggle('correct-order', correct));
      $('#workflowStatus').textContent = correct ? '✓ Excellent — your workflow is in a clear professional order.' : 'Not yet. Think: receive → prepare → pack → collect/deliver → receive.';
      saveProgress(false);
    });
    $('#resetWorkflow').addEventListener('click', () => {
      const order = [3,1,5,2,4];
      order.forEach(step => list.appendChild($(`#workflowList li[data-step="${step}"]`)));
      $$('#workflowList li').forEach(li => li.classList.remove('correct-order'));
      $('#workflowStatus').textContent = '';
    });
  }

  function initFilters() {
    $$('.filter-button').forEach(btn => btn.addEventListener('click', () => {
      $$('.filter-button').forEach(b => b.classList.remove('active')); btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('#vocabGrid .vocab-card').forEach(card => { card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none'; });
    }));
  }

  function collectState() {
    return {
      state,
      builder: { subject: $('#builderSubject').value, verb: $('#builderVerb').value, detail: $('#builderDetail').value },
      french: document.body.classList.contains('show-french'),
      workflow: $$('#workflowList li').map(li => li.dataset.step),
      savedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    };
  }

  function saveProgress(showMessage = true) {
    localStorage.setItem(storageKey, JSON.stringify(collectState()));
    if (showMessage) { $('#saveStatus').textContent = 'Saved on this device.'; setTimeout(() => { $('#saveStatus').textContent = ''; }, 2600); }
  }

  function restoreProgress() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.builder) { $('#builderSubject').value = data.builder.subject || 'We'; $('#builderVerb').value = data.builder.verb || 'prepare'; $('#builderDetail').value = data.builder.detail || 'fresh meals for several airlines'; updateBuilder(); }
      if (data.french) { document.body.classList.add('show-french'); $('#frenchToggle').setAttribute('aria-pressed', 'true'); $('#frenchToggle').textContent = 'EN only'; }
      if (data.workflow) data.workflow.forEach(step => { const el = $(`#workflowList li[data-step="${step}"]`); if (el) $('#workflowList').appendChild(el); });
      Object.keys(activities).forEach(type => { Object.assign(state[type], data.state?.[type] || {}); });
    } catch (err) { localStorage.removeItem(storageKey); }
  }

  function downloadNotes() {
    const lines = [
      'SYLVAIN BAILLY — LESSON 2: FROM KITCHEN TO CABIN',
      '',
      'TODAY’S LANGUAGE',
      '- I run a specialised airline-catering business.',
      '- We prepare, pack and label every order carefully.',
      '- A third-party logistics company handles the final delivery.',
      '- Could you confirm the quantity and collection time?',
      '- First, then, after that, finally.',
      '',
      'YOUR BUILT SENTENCE',
      $('#builderOutput').textContent,
      '',
      'SELF-ASSESSMENT',
      state.feeling || 'Not selected yet.',
      '',
      'QUIZ PROGRESS',
      `Sentence structure: ${Object.values(state.structure).filter(Boolean).length}/${activities.structure.length}`,
      `Professional accuracy: ${Object.values(state.errors).filter(Boolean).length}/${activities.errors.length}`,
      `Listening: ${Object.values(state.listening).filter(Boolean).length}/${activities.listening.length}`,
      `Mini VTEST practice: ${Object.values(state.vtest).filter(Boolean).length}/${activities.vtest.length}`,
      '',
      'HOME PRACTICE',
      'Prepare a 45-second voice note or written paragraph explaining your usual service from the order to the airline delivery. Use: first, then, after that, finally.'
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Sylvain_Lesson_2_Notes.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
  }

  function resetLesson() {
    if (!confirm('Reset all answers and saved progress for this lesson?')) return;
    localStorage.removeItem(storageKey);
    location.reload();
  }

  function init() {
    buildQuestions('structure', 'structureQuestions', 'structureStatus');
    buildQuestions('errors', 'errorQuestions', 'errorStatus');
    buildQuestions('listening', 'listeningQuestions', 'listeningStatus');
    buildQuestions('vtest', 'vtestQuestions', 'vtestStatus');
    restoreProgress();
    ['structure','errors','listening','vtest'].forEach(type => { const map = { structure: 'structureStatus', errors: 'errorStatus', listening: 'listeningStatus', vtest: 'vtestStatus' }; updateScore(type, map[type]); });
    $$('.hint-button').forEach(btn => btn.addEventListener('click', () => toggleHint(btn)));
    $$('.speak-button[data-say]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.say)));
    $('#playNormal').addEventListener('click', () => speak('Good morning, this is Emma from Nordic Air. I am calling about tomorrow’s delivery for flight N A two one four. We need to change the order. Please add twelve vegetarian meals and reduce the standard meals from eighty to seventy-two. The collection time is now ten forty-five, not eleven thirty. Could you also confirm that every box is labelled in English? I will update the order and send you a confirmation email before four pm today.', .93));
    $('#playSlow').addEventListener('click', () => speak('Good morning, this is Emma from Nordic Air. I am calling about tomorrow’s delivery for flight N A two one four. We need to change the order. Please add twelve vegetarian meals and reduce the standard meals from eighty to seventy-two. The collection time is now ten forty-five, not eleven thirty. Could you also confirm that every box is labelled in English? I will update the order and send you a confirmation email before four pm today.', .67));
    $('#transcriptToggle').addEventListener('click', () => { const script = $('#audioScript'); const visible = !script.hidden; script.hidden = visible; $('#transcriptToggle').textContent = visible ? 'Show transcript' : 'Hide transcript'; $('#transcriptToggle').setAttribute('aria-expanded', String(!visible)); });
    ['builderSubject','builderVerb','builderDetail'].forEach(id => $(`#${id}`).addEventListener('change', updateBuilder));
    $('#speakBuilder').addEventListener('click', () => speak($('#builderOutput').textContent));
    setupWorkflow(); initFilters();
    $('#frenchToggle').addEventListener('click', () => { const on = document.body.classList.toggle('show-french'); $('#frenchToggle').setAttribute('aria-pressed', String(on)); $('#frenchToggle').textContent = on ? 'EN only' : 'FR help'; saveProgress(false); });
    $('#saveButton').addEventListener('click', () => saveProgress(true));
    $('#downloadButton').addEventListener('click', downloadNotes);
    $('#resetButton').addEventListener('click', resetLesson);
    $$('.self-check-buttons button').forEach(btn => btn.addEventListener('click', () => { $$('.self-check-buttons button').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); state.feeling = btn.dataset.feel; $('#feelStatus').textContent = `Saved: ${state.feeling}`; saveProgress(false); }));
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
  }
  document.addEventListener('DOMContentLoaded', init);
})();