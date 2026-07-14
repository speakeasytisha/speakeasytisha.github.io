(() => {
  'use strict';
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const storageKey = 'sylvain_lesson_7b_past_simple_foundations_v1';

  const data = {
    time: [
      {q:'Which sentence clearly uses a finished past time?', a:['We prepare meals every day.','Last year, we visited Portugal.','We are preparing an order now.'], c:1, why:'Last year is a finished past time, so we use the past simple.'},
      {q:'Choose the past clue.', a:['at the moment','usually','two years ago'], c:2, why:'Two years ago points to a finished past moment.'},
      {q:'Which sentence tells a past story?', a:['A company contacted me in France.','A company contacts me every week.','A company is contacting me now.'], c:0, why:'Contacted is the past simple form.'},
      {q:'Choose the best past-time sentence.', a:['In 2018, I work in a restaurant.','In 2018, I worked in a restaurant.','In 2018, I am working in a restaurant.'], c:1, why:'In 2018 is a finished time, so use worked.'}
    ],
    regular: [
      {q:'work → past simple', a:['worked','workked','working'], c:0, why:'Most regular verbs add -ed: work → worked.'},
      {q:'create → past simple', a:['createed','created','creat'], c:1, why:'Verbs ending in -e add -d: create → created.'},
      {q:'try → past simple', a:['tryed','tried','tryied'], c:1, why:'Consonant + y changes to -ied: try → tried.'},
      {q:'plan → past simple', a:['planed','planning','planned'], c:2, why:'Short vowel + consonant: double the consonant: plan → planned.'},
      {q:'contact → past simple', a:['contacted','contactd','contacter'], c:0, why:'Contact → contacted. The -ed is pronounced /id/.'}
    ],
    irregular: [
      {q:'have → past simple', a:['haved','had','has'], c:1, why:'Have is irregular: have → had.'},
      {q:'go → past simple', a:['went','goed','gone'], c:0, why:'Go is irregular: go → went.'},
      {q:'make → past simple', a:['maked','made','make'], c:1, why:'Make is irregular: make → made.'},
      {q:'begin → past simple', a:['began','beginned','begun'], c:0, why:'Begin → began in the past simple.'},
      {q:'send → past simple', a:['sended','sent','send'], c:1, why:'Send is irregular: send → sent.'},
      {q:'speak → past simple', a:['spoke','speaked','spoken'], c:0, why:'Speak is irregular: speak → spoke.'}
    ],
    affSame: [
      {q:'Choose the correct sentence.', a:['I started my business in Savoie.','I start my business yesterday.','I starting my business in Savoie.'], c:0, why:'For a finished past action, use started.'},
      {q:'Choose the correct sentence.', a:['I work in a restaurant last year.','I worked in a restaurant last year.','I am worked in a restaurant last year.'], c:1, why:'Last year needs the past simple: worked.'},
      {q:'Choose the correct sentence.', a:['I prepared the order yesterday.','I prepare the order yesterday.','I was prepare the order yesterday.'], c:0, why:'Yesterday is past, so use prepared.'},
      {q:'Choose the correct sentence.', a:['I meet a client two years ago.','I met a client two years ago.','I meeting a client two years ago.'], c:1, why:'Meet is irregular: meet → met.'}
    ],
    affMixed: [
      {q:'Choose the correct sentence.', a:['The company contacted me.','The company contact me.','The company contacting me.'], c:0, why:'The action is finished: contacted.'},
      {q:'Choose the correct sentence.', a:['My wife helped me with the business.','My wife help me with the business.','My wife helps me yesterday.'], c:0, why:'Help is regular: helped.'},
      {q:'Choose the correct sentence.', a:['They sent us the order.','They sended us the order.','They send us yesterday the order.'], c:0, why:'Send is irregular: sent.'},
      {q:'Choose the correct sentence.', a:['We made meals for an airline.','We maked meals for an airline.','We making meals for an airline.'], c:0, why:'Make is irregular: made.'},
      {q:'Choose the correct sentence.', a:['The project begin unexpectedly.','The project began unexpectedly.','The project beginning unexpectedly.'], c:1, why:'Begin is irregular: began.'}
    ],
    negSame: [
      {q:'Choose the correct negative sentence.', a:['I didn’t started immediately.','I didn’t start immediately.','I don’t started immediately.'], c:1, why:'After didn’t, use the base verb: start.'},
      {q:'Choose the correct negative sentence.', a:['I didn’t work alone.','I didn’t worked alone.','I wasn’t work alone.'], c:0, why:'Didn’t + base verb: didn’t work.'},
      {q:'Choose the correct negative sentence.', a:['I didn’t prepared the order yesterday.','I didn’t prepare the order yesterday.','I don’t prepared the order yesterday.'], c:1, why:'After didn’t, use prepare, not prepared.'},
      {q:'Choose the correct negative sentence.', a:['I didn’t went to Lisbon last month.','I didn’t go to Lisbon last month.','I wasn’t go to Lisbon last month.'], c:1, why:'After didn’t, use go, not went.'}
    ],
    negMixed: [
      {q:'Choose the correct negative sentence.', a:['The company didn’t contacted my friend.','The company didn’t contact my friend.','The company doesn’t contacted my friend.'], c:1, why:'After didn’t, use contact.'},
      {q:'Choose the correct negative sentence.', a:['We didn’t delivered late.','We didn’t deliver late.','We weren’t deliver late.'], c:1, why:'Didn’t + base verb: deliver.'},
      {q:'Choose the correct negative sentence.', a:['They didn’t send the order on time.','They didn’t sent the order on time.','They don’t sent the order on time.'], c:0, why:'After didn’t, use send, not sent.'},
      {q:'Choose the correct negative sentence.', a:['My wife didn’t helped me yesterday.','My wife didn’t help me yesterday.','My wife wasn’t help me yesterday.'], c:1, why:'Didn’t + base verb: help.'}
    ],
    wasWere: [
      {q:'Choose the correct question.', a:['Was the order ready?','Did the order was ready?','Were the order ready?'], c:0, why:'With was/were, move was before the subject.'},
      {q:'Choose the correct question.', a:['Was the clients satisfied?','Were the clients satisfied?','Did the clients were satisfied?'], c:1, why:'Clients = they, so use were.'},
      {q:'Choose the correct sentence.', a:['I were a chef before.','I was a chef before.','I did be a chef before.'], c:1, why:'I was is the past form of I am.'},
      {q:'Choose the correct negative sentence.', a:['The order wasn’t complete.','The order didn’t was complete.','The order weren’t complete.'], c:0, why:'Order = it, so use wasn’t.'}
    ],
    did: [
      {q:'Choose the correct question.', a:['Did the company contacted you?','Did the company contact you?','Does the company contacted you?'], c:1, why:'Did + subject + base verb: contact.'},
      {q:'Choose the correct question.', a:['Did you work with airlines before?','Did you worked with airlines before?','Were you work with airlines before?'], c:0, why:'After did, use work, not worked.'},
      {q:'Choose the correct question.', a:['Did they sent the order?','Did they send the order?','Were they send the order?'], c:1, why:'After did, use send.'},
      {q:'Choose the correct question.', a:['Did your wife help you?','Did your wife helped you?','Was your wife help you?'], c:0, why:'Did + subject + base verb: help.'}
    ],
    wh: [
      {q:'Choose the correct WH question.', a:['When did you start your business?','When you started your business?','When did you started your business?'], c:0, why:'WH + did + subject + base verb.'},
      {q:'Choose the correct WH question.', a:['Why did the company contacted you?','Why did the company contact you?','Why the company contacted you?'], c:1, why:'After did, use contact.'},
      {q:'Choose the correct WH question.', a:['How did the opportunity begin?','How the opportunity began?','How did the opportunity began?'], c:0, why:'Did + subject + base verb: begin.'},
      {q:'Choose the correct WH question.', a:['Who did you speak to?','Who you spoke to?','Who did you spoke to?'], c:0, why:'Did + you + base verb: speak.'},
      {q:'Choose the correct WH question.', a:['What did you prepared?','What did you prepare?','What you prepared?'], c:1, why:'After did, use prepare.'}
    ],
    pronoun: [
      {q:'The company contacted ___.', a:['I','me','my'], c:1, why:'After the verb contacted, use the object pronoun me.'},
      {q:'They sent ___ the order.', a:['we','our','us'], c:2, why:'After sent, use the object pronoun us.'},
      {q:'We prepared meals for ___.', a:['they','them','their'], c:1, why:'After for, use the object pronoun them.'},
      {q:'I spoke to ___ yesterday.', a:['she','her','hers'], c:1, why:'After to, use her.'},
      {q:'My wife helped ___ with the delivery.', a:['me','I','my'], c:0, why:'After helped, use me.'}
    ],
    detail: [
      {q:'We worked ___ France.', a:['at','in','on'], c:1, why:'Use in with countries and regions: in France, in Savoie.'},
      {q:'The delivery was ___ 7:45.', a:['on','in','at'], c:2, why:'Use at with a precise time.'},
      {q:'The company came ___ Switzerland.', a:['from','to','with'], c:0, why:'Use from for origin.'},
      {q:'We delivered the order ___ the aircraft.', a:['to','at','from'], c:0, why:'Deliver something to a place/person.'},
      {q:'They needed ___ catering service in France.', a:['a','an','the'], c:0, why:'Catering starts with a consonant sound, so use a catering service.'},
      {q:'We worked with several ___.', a:['airline','airlines','airlineses'], c:1, why:'Several + plural noun: airlines.'}
    ],
    mixed: [
      {q:'Choose the best sentence.', a:['Last year, we are moving to Lisbon.','Last year, we moved to Lisbon.','Last year, we move to Lisbon.'], c:1, why:'Last year points to a finished past action: moved.'},
      {q:'Choose the correct question.', a:['Did the client send the order?','Did the client sent the order?','Was the client send the order?'], c:0, why:'Did + subject + base verb: send.'},
      {q:'Choose the correct negative.', a:['We didn’t prepared the meals.','We didn’t prepare the meals.','We weren’t prepare the meals.'], c:1, why:'Didn’t + base verb: prepare.'},
      {q:'Choose the correct object pronoun.', a:['The airline contacted we.','The airline contacted us.','The airline contacted our.'], c:1, why:'After contacted, use object pronoun us.'},
      {q:'Choose the correct BE past question.', a:['Were the containers oven-safe?','Did the containers were oven-safe?','Was the containers oven-safe?'], c:0, why:'Containers = they, so use were.'},
      {q:'Choose the most professional story sentence.', a:['At the beginning, we discussed the request and then we developed the service.','At the beginning, we discuss the request and then developed the service.','At the beginning, we were discuss the request and then develop the service.'], c:0, why:'Both actions are finished: discussed and developed.'}
    ]
  };

  const statusMap = {
    time: ['timeActivity','timeStatus'], regular: ['regularActivity','regularStatus'], irregular: ['irregularActivity','irregularStatus'], affSame: ['affSameActivity','affSameStatus'], affMixed: ['affMixedActivity','affMixedStatus'], negSame: ['negSameActivity','negSameStatus'], negMixed: ['negMixedActivity','negMixedStatus'], wasWere: ['wasWereActivity','wasWereStatus'], did: ['didActivity','didStatus'], wh: ['whActivity','whStatus'], pronoun: ['pronounActivity','pronounStatus'], detail: ['detailActivity','detailStatus'], mixed: ['mixedActivity','mixedStatus']
  };

  const state = { answers: {}, notes: '' };

  function shuffleOptions(item, idx) {
    const opts = item.a.map((text, i) => ({ text, correct: i === item.c }));
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    // Avoid predictable correct-first for first question in any group
    if (idx === 0 && opts[0].correct && opts.length > 1) [opts[0], opts[1]] = [opts[1], opts[0]];
    return opts;
  }

  function buildQuiz(type) {
    const [containerId, statusId] = statusMap[type];
    const container = $('#' + containerId);
    if (!container) return;
    container.innerHTML = '';
    data[type].forEach((item, idx) => {
      const card = document.createElement('article');
      card.className = 'question-card';
      card.innerHTML = `<p class="q">${idx + 1}. ${item.q}</p><div class="answers"></div><p class="feedback" aria-live="polite"></p>`;
      const answers = $('.answers', card);
      shuffleOptions(item, idx).forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.innerHTML = opt.text;
        btn.addEventListener('click', () => {
          $$('.option-btn', card).forEach(b => b.disabled = true);
          btn.classList.add(opt.correct ? 'correct' : 'wrong');
          if (!opt.correct) {
            const correctBtn = $$('.option-btn', card).find(b => b.textContent.trim() === item.a[item.c]);
            if (correctBtn) correctBtn.classList.add('correct');
          }
          $('.feedback', card).innerHTML = (opt.correct ? '✅ Correct. ' : '🔎 Not quite. ') + item.why;
          state.answers[`${type}-${idx}`] = opt.correct;
          updateStatus(type);
          save(false);
        });
        answers.appendChild(btn);
      });
      container.appendChild(card);
    });
    updateStatus(type);
  }

  function updateStatus(type) {
    const [, statusId] = statusMap[type];
    const status = $('#' + statusId);
    if (!status) return;
    const total = data[type].length;
    const answered = data[type].filter((_, idx) => `${type}-${idx}` in state.answers).length;
    const correct = data[type].filter((_, idx) => state.answers[`${type}-${idx}`] === true).length;
    status.textContent = answered ? `${correct}/${answered} correct · ${total - answered} left` : `${total} questions to complete`;
  }

  function speak(text, rate = 0.92) {
    if (!('speechSynthesis' in window)) { alert('Speech is not available in this browser.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB'; u.rate = rate; u.pitch = 1;
    const voices = speechSynthesis.getVoices();
    u.voice = voices.find(v => /^en-GB/i.test(v.lang)) || voices.find(v => /^en-US/i.test(v.lang)) || null;
    speechSynthesis.speak(u);
  }

  function buildStory() {
    const parts = [$('#pastStart').value, $('#pastDevelop').value, $('#presentNow').value, $('#futureStep').value];
    $('#storyOutput').value = parts.join(' ');
  }

  function save(show = true) {
    const payload = { answers: state.answers, notes: $('#lessonNotes')?.value || '', story: $('#storyOutput')?.value || '', french: document.body.classList.contains('show-french') };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    if (show) alert('Progress saved.');
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (saved.french) document.body.classList.add('show-french');
      if (saved.notes && $('#lessonNotes')) $('#lessonNotes').value = saved.notes;
      if (saved.story && $('#storyOutput')) $('#storyOutput').value = saved.story;
    } catch {}
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => alert('Copied.')).catch(() => fallbackCopy(text));
    else fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const t = document.createElement('textarea');
    t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); alert('Copied.');
  }

  function notesText() {
    const story = $('#storyOutput')?.value.trim();
    const notes = $('#lessonNotes')?.value.trim();
    return `Sylvain Bailly — Lesson 7B Past Simple Foundations\n\nUseful story paragraph:\n${story || '(not built yet)'}\n\nMy notes:\n${notes || '(no notes yet)'}\n\nKey rules:\n- Past simple affirmative: subject + past verb + information.\n- Negative: subject + didn’t + base verb.\n- Question: Did + subject + base verb?\n- BE in the past: was / were.\n- Object pronouns after verbs/prepositions: me, you, him, her, it, us, them.`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    load();
    Object.keys(statusMap).forEach(buildQuiz);
    $('#toggleFrench')?.addEventListener('click', (e) => { document.body.classList.toggle('show-french'); e.currentTarget.setAttribute('aria-pressed', document.body.classList.contains('show-french')); });
    $('#saveProgress')?.addEventListener('click', () => save(true));
    $('#resetProgress')?.addEventListener('click', () => { if(confirm('Reset saved progress for this lesson?')) { localStorage.removeItem(storageKey); location.reload(); } });
    $$('.speak-button').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.say || btn.textContent)));
    $('#buildStory')?.addEventListener('click', buildStory);
    $('#listenStory')?.addEventListener('click', () => speak($('#storyOutput').value || 'Please build your paragraph first.'));
    $('#copyStory')?.addEventListener('click', () => copyText($('#storyOutput').value || ''));
    $('#downloadNotes')?.addEventListener('click', () => download('Sylvain_Lesson_7B_Past_Simple_Notes.txt', notesText()));
    $('#copyNotes')?.addEventListener('click', () => copyText(notesText()));
    $('#storyOutput')?.addEventListener('input', () => save(false));
    $('#lessonNotes')?.addEventListener('input', () => save(false));
    if (!$('#storyOutput').value) buildStory();
  });
})();
