(() => {
  'use strict';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const storageKey = 'sylvain_lesson5_today_every_day_v1';

  const activities = {
    simple: [
      {
        q: 'Today, the aircraft ___ at 10:20.',
        options: ['is leaving', 'leaves', 'leave'],
        correct: 1,
        why: 'This is a fixed timetable, so use the present simple: <b>leaves</b>.'
      },
      {
        q: 'Today, I ___ to confirm the final quantity before 7:30.',
        options: ['need', 'am needing', 'needs'],
        correct: 0,
        why: '<b>Need</b> is usually a state verb, so use the present simple: <b>I need</b>.'
      },
      {
        q: 'We ___ in Savoie at the moment.',
        options: ['are living', 'live', 'lives'],
        correct: 1,
        why: 'This is a current fact about home, so the present simple is natural: <b>we live</b>.'
      },
      {
        q: 'Today, I ___ a call with the bank at 2 p.m.',
        options: ['have', 'am having', 'both are possible'],
        correct: 2,
        why: 'Both can be possible. <b>I have a call</b> focuses on the schedule; <b>I am having a call</b> can focus on the arranged event.'
      }
    ],
    continuous: [
      {
        q: 'Today, we ___ a special breakfast order for three crew members.',
        options: ['prepare', 'are preparing', 'prepares'],
        correct: 1,
        why: 'This is a special temporary action today, so use <b>are preparing</b>.'
      },
      {
        q: 'At the moment, I ___ my restaurant.',
        options: ['sell', 'am selling', 'sells'],
        correct: 1,
        why: 'This is a current project in progress, so use <b>am selling</b>.'
      },
      {
        q: 'Today, I ___ a new airline client at 3 p.m.',
        options: ['meet', 'am meeting', 'meets'],
        correct: 1,
        why: 'A personal arranged appointment can use the present continuous: <b>I am meeting</b>.'
      },
      {
        q: 'We ___ for a family home in Lisbon this month.',
        options: ['look', 'are looking', 'looks'],
        correct: 1,
        why: 'This is a temporary search project, so use <b>are looking</b>.'
      }
    ],
    compare: [
      {
        q: 'Choose the sentence for Sylvain’s normal business activity.',
        options: ['We prepare meals for several airlines.', 'We are preparing meals for several airlines today.'],
        correct: 0,
        why: 'Normal / regular work = present simple: <b>We prepare</b>.'
      },
      {
        q: 'Choose the sentence for a special order happening today.',
        options: ['We prepare three different crew breakfasts today.', 'We are preparing three different crew breakfasts today.'],
        correct: 1,
        why: 'A special order happening now / around today = present continuous: <b>We are preparing</b>.'
      },
      {
        q: 'Choose the sentence for a flight timetable.',
        options: ['The flight leaves at 10:20 today.', 'The flight is leaving at 10:20 today.'],
        correct: 0,
        why: 'For timetables and fixed schedules, use present simple: <b>The flight leaves</b>.'
      },
      {
        q: 'Choose the sentence for a personal arrangement.',
        options: ['I meet the driver at 8:45 today.', 'I am meeting the driver at 8:45 today.'],
        correct: 1,
        why: 'For a personal arranged appointment, present continuous is very natural: <b>I am meeting</b>.'
      },
      {
        q: 'Choose the correct sentence.',
        options: ['Today, I am knowing the answer.', 'Today, I know the answer.'],
        correct: 1,
        why: '<b>Know</b> is usually a state verb, so use the present simple: <b>I know</b>.'
      }
    ],
    listening: [
      {
        q: 'Why does the message use “we are preparing” in Message 1?',
        options: ['It is a special order today.', 'It is the normal routine every day.', 'It is a fixed flight timetable.'],
        correct: 0,
        why: 'The order is special for today, so it is a temporary situation.'
      },
      {
        q: 'Why does the message say “the flight leaves at 10:20”?',
        options: ['It is a fixed schedule.', 'It is an action happening now.', 'It is a temporary project.'],
        correct: 0,
        why: 'Flight departure time is a fixed timetable / schedule.'
      },
      {
        q: 'What does Sylvain have at 2 p.m. in Message 2?',
        options: ['A call with a bank in Lisbon.', 'A flight to Lisbon.', 'A house in Lisbon.'],
        correct: 0,
        why: 'The message says: “Sylvain has a call with a bank in Lisbon at 2 p.m.”'
      },
      {
        q: 'Which sentence describes the family’s normal life?',
        options: ['They are looking for a family home.', 'They live in Savoie at the moment.', 'They are having dinner with his parents.'],
        correct: 1,
        why: 'Living in Savoie is their current home situation; it is a fact, so use the present simple.'
      }
    ],
    vtest: [
      {
        q: 'Today, the driver ___ the meals at 8:45.',
        options: ['collects', 'is collecting', 'collect'],
        correct: 0,
        why: 'A fixed operational schedule can use present simple: <b>collects</b>.'
      },
      {
        q: 'We usually ___ standard crew breakfasts, but today we ___ three different meals.',
        options: ['prepare / make', 'are preparing / make', 'prepare / are making'],
        correct: 2,
        why: '<b>Usually</b> = routine → prepare. <b>Today</b> here = special temporary activity → are making.'
      },
      {
        q: 'I ___ a meeting with a new client this afternoon.',
        options: ['am having', 'have', 'both are possible'],
        correct: 2,
        why: 'Both can be possible. <b>Have</b> is a schedule; <b>am having</b> focuses on the arranged event.'
      },
      {
        q: 'We ___ a home in Lisbon at the moment.',
        options: ['look for', 'are looking for', 'looks for'],
        correct: 1,
        why: '“At the moment” signals a current temporary project: <b>are looking for</b>.'
      },
      {
        q: 'Today, I ___ the final quantity before I send the confirmation.',
        options: ['need', 'am needing', 'needs'],
        correct: 0,
        why: '<b>Need</b> is a state verb, so use the present simple: <b>I need</b>.'
      }
    ]
  };

  const state = { simple: {}, continuous: {}, compare: {}, listening: {}, vtest: {}, french: false };

  function escapeHTML(text) {
    return String(text).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function speak(text, rate = 0.9) {
    if (!('speechSynthesis' in window)) {
      alert('Speech is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB'; u.rate = rate; u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang));
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  }

  function renderQuestions(type, target) {
    const holder = document.getElementById(target);
    holder.innerHTML = '';
    activities[type].forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'question-item';
      card.dataset.index = index;
      card.innerHTML = `<p>${index + 1}. ${item.q}</p><div class="answer-options"></div><p class="feedback" aria-live="polite"></p>`;
      const options = $('.answer-options', card);
      item.options.forEach((option, optionIndex) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'answer-option'; b.textContent = option;
        b.addEventListener('click', () => {
          if (card.dataset.checked === 'true') return;
          $$('.answer-option', card).forEach(x => x.classList.remove('selected'));
          b.classList.add('selected');
          state[type][index] = optionIndex;
        });
        options.appendChild(b);
      });
      holder.appendChild(card);
    });
  }

  function checkActivity(type, target, scoreId) {
    const cards = $$('#' + target + ' .question-item');
    let answered = 0, correct = 0;
    cards.forEach((card, index) => {
      const chosen = state[type][index];
      const feedback = $('.feedback', card);
      if (typeof chosen === 'undefined') {
        feedback.className = 'feedback bad';
        feedback.textContent = 'Choose an answer first.';
        return;
      }
      answered++;
      card.dataset.checked = 'true';
      const item = activities[type][index];
      const buttons = $$('.answer-option', card);
      buttons.forEach((button, optionIndex) => {
        button.disabled = true;
        if (optionIndex === item.correct) button.classList.add('correct');
        if (optionIndex === chosen && chosen !== item.correct) button.classList.add('incorrect');
      });
      if (chosen === item.correct) {
        correct++;
        feedback.className = 'feedback good';
        feedback.innerHTML = `✓ Correct. ${item.why}`;
      } else {
        feedback.className = 'feedback bad';
        feedback.innerHTML = `↳ Not quite. ${item.why}`;
      }
    });
    const score = document.getElementById(scoreId);
    score.textContent = answered ? `${correct}/${activities[type].length} correct` : 'Choose an answer first.';
    saveProgress(false);
  }

  const builderData = {
    specialOrder: {
      details: [
        ['we are preparing three different crew breakfasts', 'This is a special temporary order today, so use the present continuous.'],
        ['we are checking the labels for special dietary requirements', 'This is an action in progress today, so use the present continuous.'],
        ['we are confirming the final quantity with the airline', 'This is a current action today, so use the present continuous.']
      ],
      times: ['Today', 'This morning', 'At the moment']
    },
    routine: {
      details: [
        ['we prepare meals for several airlines', 'This is a normal business routine, so use the present simple.'],
        ['we work with different airline clients', 'This is a regular professional fact, so use the present simple.'],
        ['we check orders and special requirements carefully', 'This is part of the usual work process, so use the present simple.']
      ],
      times: ['Every day', 'Usually', 'In our business']
    },
    meeting: {
      details: [
        ['I am meeting a new airline client at 3 p.m.', 'This is a personal arranged appointment, so use the present continuous.'],
        ['I have a call with the bank in Lisbon at 2 p.m.', 'This is a scheduled appointment, so the present simple is natural.'],
        ['I am speaking with the logistics company this afternoon.', 'This is an arranged activity today, so use the present continuous.']
      ],
      times: ['Today', 'This afternoon', 'This morning']
    },
    homeSearch: {
      details: [
        ['we are looking for a family home in Lisbon', 'This is a temporary current project, so use the present continuous.'],
        ['we are comparing different neighbourhoods in Lisbon', 'This is an activity in progress, so use the present continuous.'],
        ['we need to wait for the funds from our current house', 'Need is a state verb, so use the present simple.']
      ],
      times: ['At the moment', 'This month', 'Today']
    },
    family: {
      details: [
        ['my daughters usually finish school in the afternoon', 'Usually shows a routine, so use the present simple.'],
        ['we are having dinner with my parents this evening', 'This is a family arrangement, so use the present continuous.'],
        ['I have two daughters and family time is important to me', 'Have (possession) and family facts use the present simple.']
      ],
      times: ['Usually', 'Today', 'At the moment']
    }
  };

  function populateBuilder() {
    const context = $('#builderContext').value;
    const detail = $('#builderDetail'); const time = $('#builderTime');
    detail.innerHTML = ''; time.innerHTML = '';
    builderData[context].details.forEach(([sentence], index) => {
      const o = document.createElement('option'); o.value = String(index); o.textContent = sentence; detail.appendChild(o);
    });
    builderData[context].times.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; time.appendChild(o); });
  }

  function buildStory() {
    const context = $('#builderContext').value;
    const detailIndex = Number($('#builderDetail').value);
    const time = $('#builderTime').value;
    const [sentence, why] = builderData[context].details[detailIndex];
    const paragraph = `${time}, ${sentence}.`;
    const extra = context === 'specialOrder' ? 'The final delivery is scheduled for later this morning.'
      : context === 'routine' ? 'Clear communication helps us avoid mistakes and delays.'
      : context === 'meeting' ? 'I want to communicate clearly and confirm the next steps.'
      : context === 'homeSearch' ? 'We are planning our move to Lisbon in August.'
      : 'We are preparing a new family life in Portugal.';
    $('#storyOutput').innerHTML = `<span class="model-label">YOUR REAL UPDATE</span><p>${escapeHTML(paragraph)}</p><p>${escapeHTML(extra)}</p>`;
    $('#storyWhy').textContent = why;
    saveProgress(false);
  }

  function downloadNotes() {
    const currentStory = $('#storyOutput').innerText.replace(/\n+/g, '\n').trim();
    const text = `SYLVAIN BAILLY — LESSON 5\nTODAY, EVERY DAY & THIS WEEK\n\nKEY IDEA\nToday is a time expression. It does not choose the tense. The situation chooses the tense.\n\nPRESENT SIMPLE\n• routines: We prepare meals for several airlines.\n• schedules: The flight leaves at 10:20.\n• states: I need the final quantity.\n• facts: We live in Savoie.\n\nPRESENT CONTINUOUS\n• temporary action today: We are preparing a special order.\n• current project: We are looking for a home in Lisbon.\n• personal arrangement: I am meeting a new client at 3 p.m.\n\nYOUR UPDATE\n${currentStory || 'No personal update built yet.'}\n\nVTEST STRATEGY\n1. Find the subject. 2. Identify meaning. 3. Read time clue. 4. Choose the correct form.\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Sylvain_Lesson_5_Today_Every_Day_Notes.txt'; a.click(); URL.revokeObjectURL(a.href);
  }

  function saveProgress(showMessage = true) {
    const progress = { state, builder: { context: $('#builderContext')?.value, detail: $('#builderDetail')?.value, time: $('#builderTime')?.value, story: $('#storyOutput')?.innerHTML, why: $('#storyWhy')?.textContent } };
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (_) {}
    if (showMessage) {
      const btn = $('#saveButton'); const original = btn.textContent; btn.textContent = 'Saved ✓'; setTimeout(() => btn.textContent = original, 1300);
    }
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved) return;
      Object.assign(state, saved.state || {});
      if (saved.state?.french) { state.french = true; document.body.classList.add('show-french'); $('#frenchToggle').setAttribute('aria-pressed', 'true'); $('#frenchToggle').textContent = 'FR help: on'; }
      if (saved.builder?.context) { $('#builderContext').value = saved.builder.context; populateBuilder(); $('#builderDetail').value = saved.builder.detail || '0'; $('#builderTime').value = saved.builder.time || $('#builderTime').value; }
      if (saved.builder?.story) $('#storyOutput').innerHTML = saved.builder.story;
      if (saved.builder?.why) $('#storyWhy').textContent = saved.builder.why;
    } catch (_) {}
  }

  function resetLesson() {
    if (!confirm('Reset all answers and saved progress for this lesson?')) return;
    localStorage.removeItem(storageKey); location.reload();
  }

  function init() {
    renderQuestions('simple', 'simpleQuestions');
    renderQuestions('continuous', 'continuousQuestions');
    renderQuestions('compare', 'compareQuestions');
    renderQuestions('listening', 'listeningQuestions');
    renderQuestions('vtest', 'vtestQuestions');

    $('#frenchToggle').addEventListener('click', () => {
      state.french = !state.french;
      document.body.classList.toggle('show-french', state.french);
      $('#frenchToggle').setAttribute('aria-pressed', String(state.french));
      $('#frenchToggle').textContent = state.french ? 'FR help: on' : 'FR help';
      saveProgress(false);
    });
    $('#saveButton').addEventListener('click', () => saveProgress(true));
    $('#resetButton').addEventListener('click', resetLesson);
    $('#downloadNotes').addEventListener('click', downloadNotes);

    $$('.hint-button').forEach(btn => btn.addEventListener('click', () => {
      const target = $('#' + btn.dataset.hintTarget); const isHidden = target.hidden; target.hidden = !isHidden; btn.textContent = isHidden ? 'Hide hint' : 'Hint';
    }));
    $$('.check-button').forEach(btn => btn.addEventListener('click', () => {
      const type = btn.dataset.check; checkActivity(type, `${type}Questions`, `${type}Score`);
    }));
    $$('.audio-button, [data-say]').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.say)));
    $$('.transcript-button').forEach(btn => btn.addEventListener('click', () => {
      const transcript = $('#' + btn.dataset.transcript); transcript.hidden = !transcript.hidden; btn.textContent = transcript.hidden ? 'Show transcript' : 'Hide transcript';
    }));

    $('#builderContext').addEventListener('change', () => { populateBuilder(); buildStory(); });
    $('#builderDetail').addEventListener('change', buildStory);
    $('#builderTime').addEventListener('change', buildStory);
    $('#buildStory').addEventListener('click', buildStory);
    $('#speakStory').addEventListener('click', () => speak($('#storyOutput').innerText));

    populateBuilder();
    loadProgress();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
