(() => {
  'use strict';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const jsWarning = $('#jsWarning');
  if (jsWarning) jsWarning.style.display = 'none';

  let selectedVoice = 'en-US';
  let voices = [];

  const timeCards = [
    { label: 'Yesterday', icon: '⬅️', sentence: 'Yesterday, you went for a walk with your dog.', fr: 'Hier, vous êtes allée vous promener avec votre chien.', audio: 'Yesterday, you went for a walk with your dog.' },
    { label: 'Today', icon: '🌤️', sentence: 'Today, you are practising English.', fr: 'Aujourd’hui, vous pratiquez l’anglais.', audio: 'Today, you are practising English.' },
    { label: 'Tomorrow', icon: '➡️', sentence: 'Tomorrow, you are going to draw or paint at home.', fr: 'Demain, vous allez dessiner ou peindre à la maison.', audio: 'Tomorrow, you are going to draw or paint at home.' }
  ];

  const vocabCategories = {
    all: 'All vocabulary',
    time: '🗓️ Future time expressions',
    plans: '🌿 Plans & activities',
    creative: '🎨 Drawing & painting',
    travel: '🧳 Travel plans',
    invite: '💬 Invitations',
    replies: '🤝 Accepting & declining',
    promises: '✨ Promises & offers',
    connectors: '🔗 Connectors & feelings'
  };

  const vocab = [
    ['time', '📅', 'tomorrow', 'demain', 'the day after today', 'You are going to call your friend tomorrow.'],
    ['time', '🗓️', 'this weekend', 'ce week-end', 'on Saturday and Sunday', 'This weekend, you are going to relax.'],
    ['time', '🌸', 'next week', 'la semaine prochaine', 'the week after this one', 'Next week, you are going to start a new project.'],
    ['time', '☀️', 'soon', 'bientôt', 'in a short time', 'You are going to travel soon.'],
    ['time', '🕒', 'later', 'plus tard', 'after now', 'You are going to paint later.'],
    ['plans', '🚶', 'go for a walk', 'aller se promener', 'walk outside for pleasure', 'You are going to go for a walk after lunch.'],
    ['plans', '🍽️', 'have lunch', 'déjeuner', 'eat the midday meal', 'You are going to have lunch with your family.'],
    ['plans', '🏡', 'stay at home', 'rester à la maison', 'remain at home', 'You are not going to stay at home all day.'],
    ['plans', '👨‍👩‍👧', 'spend time with', 'passer du temps avec', 'be with a person and enjoy the time', 'You are going to spend time with your daughter.'],
    ['plans', '🧘', 'relax', 'se détendre', 'rest and feel calm', 'You are going to relax in the evening.'],
    ['creative', '✏️', 'draw', 'dessiner', 'make a picture with a pencil or pen', 'You are going to draw at home.'],
    ['creative', '🎨', 'paint', 'peindre', 'make a picture with paint', 'You are going to paint a picture this weekend.'],
    ['creative', '🖼️', 'a drawing', 'un dessin', 'a picture made with a pencil or pen', 'Your drawing is beautiful.'],
    ['creative', '🖌️', 'a painting', 'une peinture / un tableau', 'a picture made with paint', 'You are going to finish your painting tomorrow.'],
    ['creative', '🌈', 'colours', 'les couleurs', 'red, blue, green and other shades', 'You are going to use bright colours.'],
    ['creative', '🖍️', 'a paintbrush', 'un pinceau', 'a tool for putting paint on paper or canvas', 'You need a paintbrush to paint.'],
    ['creative', '✨', 'create', 'créer', 'make something new', 'You enjoy creating pictures.'],
    ['travel', '🎫', 'book a ticket', 'réserver un billet', 'arrange and pay for a journey ticket', 'You are going to book a train ticket.'],
    ['travel', '🏨', 'book a hotel', 'réserver un hôtel', 'arrange a room for a future stay', 'You are going to book a hotel for your trip.'],
    ['travel', '🧳', 'pack a suitcase', 'faire une valise', 'put clothes and things in a suitcase', 'You are going to pack your suitcase on Friday.'],
    ['travel', '🚆', 'take a train', 'prendre le train', 'travel by train', 'You are going to take the train at 9 a.m.'],
    ['invite', '💌', 'Would you like to…?', 'Voulez-vous… ? / Est-ce que cela vous dirait de… ?', 'a polite way to invite someone', 'Would you like to go for a walk?'],
    ['invite', '🗣️', 'Do you want to…?', 'Est-ce que vous voulez… ?', 'an informal way to ask about a plan', 'Do you want to have lunch together?'],
    ['invite', '🌟', 'Let’s…', 'Allons… / On pourrait…', 'a friendly suggestion', 'Let’s meet at the park.'],
    ['replies', '✅', 'I’d love to.', 'Avec plaisir.', 'a warm way to accept an invitation', 'Yes, I’d love to go with you.'],
    ['replies', '😊', 'That sounds lovely.', 'Cela a l’air très agréable.', 'a positive reply to an invitation', 'Lunch together? That sounds lovely.'],
    ['replies', '🙏', 'Sorry, I can’t.', 'Désolée, je ne peux pas.', 'a polite way to decline', 'Sorry, I can’t. I am going to visit my family.'],
    ['replies', '🔁', 'Maybe another time.', 'Peut-être une autre fois.', 'a polite way to suggest a different day', 'Maybe another time. I am busy on Saturday.'],
    ['promises', '🤝', 'I’ll help you.', 'Je vous aiderai.', 'a promise or offer of help', 'Don’t worry, I’ll help you.'],
    ['promises', '📍', 'I’ll send you the address.', 'Je vous enverrai l’adresse.', 'a promise to send information', 'I’ll send you the address later.'],
    ['promises', '💧', 'I’ll bring some water.', 'J’apporterai de l’eau.', 'an offer to bring something', 'It is hot. I’ll bring some water.'],
    ['promises', '📞', 'I’ll call you later.', 'Je vous appellerai plus tard.', 'a promise to call', 'I’ll call you after work.'],
    ['connectors', '1️⃣', 'first', 'd’abord', 'the first action in a sequence', 'First, you are going to have lunch.'],
    ['connectors', '➡️', 'then', 'ensuite', 'the next action in a sequence', 'Then, you are going to go for a walk.'],
    ['connectors', '✨', 'after that', 'après cela', 'the action that follows', 'After that, you are going to paint at home.'],
    ['connectors', '💛', 'because', 'parce que', 'gives a reason', 'You are happy because you enjoy painting.'],
    ['connectors', '😊', 'look forward to', 'avoir hâte de', 'feel happy about a future plan', 'You are looking forward to the weekend.']
  ];

  const modelLabels = {
    plans: '🗓️ Your future plans',
    creative: '🎨 Your creative time',
    invitations: '💬 Invitations',
    promises: '🤝 Promises & offers'
  };

  const models = {
    plans: [
      ['A2 safe model', 'This weekend, you are going to relax at home. You are going to walk your dog and watch TV. On Sunday, you are going to have lunch with your family.', 'Ce week-end, vous allez vous détendre à la maison. Vous allez promener votre chien et regarder la télévision. Dimanche, vous allez déjeuner avec votre famille.'],
      ['A2+ target model', 'Next weekend, you are going to spend time with your family. You are going to have lunch together and go for a walk if the weather is nice. You are really looking forward to it.', 'Le week-end prochain, vous allez passer du temps avec votre famille. Vous allez déjeuner ensemble et vous promener si le temps est beau. Vous avez vraiment hâte.'],
      ['B1- stretch model', 'Next weekend, you are going to spend some quality time with your family. You are going to have lunch together and go for a walk afterwards. You are looking forward to a quiet and relaxing weekend.', 'Le week-end prochain, vous allez passer du temps de qualité avec votre famille. Vous allez déjeuner ensemble et vous promener ensuite. Vous avez hâte de passer un week-end calme et reposant.']
    ],
    creative: [
      ['A2 safe model', 'Tomorrow, you are going to draw at home. You are going to use your favourite colours.', 'Demain, vous allez dessiner à la maison. Vous allez utiliser vos couleurs préférées.'],
      ['A2+ target model', 'This weekend, you are going to paint a picture in the afternoon. You enjoy painting because it helps you relax.', 'Ce week-end, vous allez peindre un tableau l’après-midi. Vous aimez peindre parce que cela vous aide à vous détendre.'],
      ['Useful invitation', 'Would you like to draw with me on Sunday? We can have a coffee afterwards.', 'Voudriez-vous dessiner avec moi dimanche ? Nous pouvons prendre un café ensuite.']
    ],
    invitations: [
      ['Make an invitation', 'Would you like to go for a walk on Saturday?', 'Voudriez-vous aller vous promener samedi ?'],
      ['Accept warmly', 'Yes, I’d love to. What time are we going to meet?', 'Oui, avec plaisir. À quelle heure allons-nous nous retrouver ?'],
      ['Decline politely', 'Sorry, I can’t. I’m going to visit my family. Maybe another time?', 'Désolée, je ne peux pas. Je vais rendre visite à ma famille. Peut-être une autre fois ?']
    ],
    promises: [
      ['Promise', 'Don’t worry, I’ll help you.', 'Ne vous inquiétez pas, je vous aiderai.'],
      ['Offer', 'I’ll bring some water for the walk.', 'J’apporterai de l’eau pour la promenade.'],
      ['Decision now', 'The phone is ringing. I’ll answer it.', 'Le téléphone sonne. Je vais répondre.']
    ]
  };

  const practiceSets = {
    goingTo: [
      { q: 'You ___ going to draw at home tomorrow.', ok: 'are', options: ['are', 'is', 'am', 'will'] },
      { q: 'You are going to ___ a picture.', ok: 'paint', options: ['paint', 'painted', 'painting', 'will paint'] },
      { q: '___ you going to travel next month?', ok: 'Are', options: ['Are', 'Do', 'Will', 'Did'] },
      { q: 'You ___ going to stay at home all day.', ok: 'are not', options: ['are not', 'will not', 'did not', 'do not'] },
      { q: 'You are going to ___ lunch with your family.', ok: 'have', options: ['have', 'had', 'having', 'will have'] },
      { q: 'First, you are going to pack your ___.', ok: 'suitcase', options: ['suitcase', 'ticket', 'painting', 'promise'] }
    ],
    will: [
      { q: 'This weekend, you ___ paint at home. (a plan)', ok: 'are going to', options: ['are going to', 'will', 'did', 'were'] },
      { q: 'Don’t worry, I ___ help you. (a promise)', ok: 'will', options: ['will', 'am going to', 'did', 'was'] },
      { q: 'The phone is ringing. I ___ answer it. (a decision now)', ok: 'will', options: ['will', 'am going to', 'did', 'was'] },
      { q: 'You ___ visit your family on Sunday. (a plan already decided)', ok: 'are going to', options: ['are going to', 'will', 'did', 'were'] },
      { q: 'It is hot. I ___ bring some water. (an offer)', ok: 'will', options: ['will', 'am going to', 'did', 'was'] },
      { q: 'After lunch, you ___ go for a walk. (a plan)', ok: 'are going to', options: ['are going to', 'will', 'did', 'were'] }
    ],
    invite: [
      { q: 'Would you like to go for a walk?', ok: 'Yes, I’d love to.', options: ['Yes, I’d love to.', 'Yes, I went.', 'I will going.', 'I am like.'] },
      { q: 'Do you want to have lunch tomorrow?', ok: 'Sorry, I can’t. I’m going to visit my family.', options: ['Sorry, I can’t. I’m going to visit my family.', 'Sorry, I don’t went.', 'No, I am not lunch.', 'I will visited.'] },
      { q: 'Let’s meet at the park.', ok: 'That sounds lovely.', options: ['That sounds lovely.', 'That sounded tomorrow.', 'I am meet.', 'I did like.'] },
      { q: 'Would you like to paint together?', ok: 'Maybe another time. I’m busy on Saturday.', options: ['Maybe another time. I’m busy on Saturday.', 'Maybe I painted.', 'I can’t to busy.', 'I am not like.'] },
      { q: 'What time are we going to meet?', ok: 'We are going to meet at 2 p.m.', options: ['We are going to meet at 2 p.m.', 'We meeted at 2 p.m.', 'We will going 2 p.m.', 'We did meet 2 p.m.'] }
    ],
    listening: [
      { q: 'What day are they talking about?', ok: 'Saturday', options: ['Saturday', 'Monday', 'Friday'] },
      { q: 'What are they going to do first?', ok: 'Go for a walk', options: ['Go for a walk', 'Paint a picture', 'Take a train'] },
      { q: 'What time are they going to meet?', ok: 'At 2 o’clock', options: ['At 2 o’clock', 'At 9 o’clock', 'At 6 o’clock'] },
      { q: 'What is Claire going to bring?', ok: 'Her dog', options: ['Her dog', 'Some water', 'A suitcase'] },
      { q: 'What will Anna bring?', ok: 'Some water', options: ['Some water', 'A painting', 'A ticket'] }
    ]
  };

  const phraseRows = [
    ['💌', 'Make an invitation', 'Would you like to go for a walk?'],
    ['🌟', 'Suggest a plan', 'Let’s meet at the park at 2 p.m.'],
    ['✅', 'Accept', 'Yes, I’d love to. That sounds lovely.'],
    ['🙏', 'Decline politely', 'Sorry, I can’t. I’m going to visit my family.'],
    ['🤝', 'Make a promise', 'Don’t worry, I’ll send you the address.'],
    ['💧', 'Make an offer', 'I’ll bring some water for the walk.']
  ];

  const scenarios = [
    {
      label: '🌳 A walk in the park',
      content: '<strong>Your mission:</strong> Invite someone for a walk.<div class="model-strip"><strong>You:</strong> Would you like to go for a walk on Saturday?</div><div class="model-strip"><strong>Friend:</strong> Yes, I’d love to. What time are we going to meet?</div><div class="model-strip"><strong>You:</strong> We’re going to meet at 2 p.m. I’ll bring some water.</div>',
      audio: 'Would you like to go for a walk on Saturday? Yes, I would love to. What time are we going to meet? We are going to meet at two p.m. I will bring some water.'
    },
    {
      label: '🎨 A painting afternoon',
      content: '<strong>Your mission:</strong> Invite someone to paint with you.<div class="model-strip"><strong>You:</strong> Would you like to paint with me on Sunday?</div><div class="model-strip"><strong>Friend:</strong> That sounds lovely. Where are we going to paint?</div><div class="model-strip"><strong>You:</strong> We’re going to paint at my home. I’ll make some coffee.</div>',
      audio: 'Would you like to paint with me on Sunday? That sounds lovely. Where are we going to paint? We are going to paint at my home. I will make some coffee.'
    },
    {
      label: '🍽️ Family lunch',
      content: '<strong>Your mission:</strong> Accept or decline a lunch invitation.<div class="model-strip"><strong>Friend:</strong> Do you want to have lunch with us tomorrow?</div><div class="model-strip"><strong>You:</strong> Sorry, I can’t. I’m going to visit my daughter.</div><div class="model-strip"><strong>You:</strong> Maybe another time? I’ll call you later.</div>',
      audio: 'Do you want to have lunch with us tomorrow? Sorry, I cannot. I am going to visit my daughter. Maybe another time? I will call you later.'
    },
    {
      label: '🧳 A weekend trip',
      content: '<strong>Your mission:</strong> Talk about a travel plan.<div class="model-strip"><strong>You:</strong> Next weekend, I’m going to take the train to Paris.</div><div class="model-strip"><strong>Friend:</strong> Are you going to book a hotel?</div><div class="model-strip"><strong>You:</strong> Yes, I am. I’ll send you some photos.</div>',
      audio: 'Next weekend, I am going to take the train to Paris. Are you going to book a hotel? Yes, I am. I will send you some photos.'
    }
  ];

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
  }

  function populateVoices() {
    voices = window.speechSynthesis && speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Speech is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice;
    const languagePrefix = selectedVoice.slice(0, 2);
    const preferred = voices.find((voice) => voice.lang === selectedVoice && /Google|Microsoft|Samantha|Daniel|Serena|Karen|Moira/i.test(voice.name))
      || voices.find((voice) => voice.lang === selectedVoice)
      || voices.find((voice) => voice.lang && voice.lang.startsWith(languagePrefix));
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.82;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function renderTimeCards() {
    const container = $('#timeSwitch');
    const output = $('#timeResult');
    if (!container || !output) return;
    container.innerHTML = timeCards.map((item, index) => `<button class="time-card" type="button" data-time="${index}"><span>${item.icon}</span> ${escapeHTML(item.label)}</button>`).join('');
    container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-time]');
      if (!button) return;
      $$('.time-card', container).forEach((card) => card.classList.toggle('active', card === button));
      const item = timeCards[Number(button.dataset.time)];
      output.innerHTML = `<strong>${escapeHTML(item.sentence)}</strong><br><span class="muted">${escapeHTML(item.fr)}</span><br><button class="listen-btn compact" type="button" data-say="${escapeHTML(item.audio)}">▶ Listen</button>`;
    });
  }

  function renderVocabulary() {
    const select = $('#vocabCategory');
    const search = $('#vocabSearch');
    const grid = $('#vocabGrid');
    if (!select || !search || !grid) return;
    select.innerHTML = Object.entries(vocabCategories).map(([key, label]) => `<option value="${key}">${escapeHTML(label)}</option>`).join('');

    const update = () => {
      const category = select.value;
      const term = search.value.trim().toLowerCase();
      const items = vocab.filter(([itemCategory, , word, french, definition, example]) => {
        const categoryMatches = category === 'all' || itemCategory === category;
        const text = `${word} ${french} ${definition} ${example}`.toLowerCase();
        return categoryMatches && (!term || text.includes(term));
      });
      grid.innerHTML = items.map(([, icon, word, french, definition, example]) => `
        <article class="vocab-card">
          <div class="vocab-icon">${icon}</div>
          <div>
            <h3>${escapeHTML(word)}</h3>
            <p class="fr">${escapeHTML(french)}</p>
            <p class="definition">${escapeHTML(definition)}</p>
            <p class="example">${escapeHTML(example)}</p>
            <button class="listen-btn compact" type="button" data-say="${escapeHTML(`${word}. ${example}`)}">▶ Listen</button>
          </div>
        </article>`).join('') || '<div class="result-box">No vocabulary found. Try another category or search word.</div>';
    };
    select.addEventListener('change', update);
    search.addEventListener('input', update);
    update();
  }

  let activeModel = 'plans';
  function renderModels() {
    const tabs = $('#modelTabs');
    const grid = $('#modelGrid');
    if (!tabs || !grid) return;
    tabs.innerHTML = Object.entries(modelLabels).map(([key, label]) => `<button class="tab-btn ${key === activeModel ? 'active' : ''}" type="button" data-model="${key}">${escapeHTML(label)}</button>`).join('');
    grid.innerHTML = models[activeModel].map(([tag, sentence, translation]) => `
      <article class="model-card">
        <small>${escapeHTML(tag)}</small>
        <p><strong>${escapeHTML(sentence)}</strong></p>
        <p class="translation">${escapeHTML(translation)}</p>
        <button class="listen-btn compact" type="button" data-say="${escapeHTML(sentence)}">▶ Listen</button>
      </article>`).join('');
    tabs.onclick = (event) => {
      const button = event.target.closest('[data-model]');
      if (!button) return;
      activeModel = button.dataset.model;
      renderModels();
    };
  }

  function makeSelectItem(item, index, setName) {
    return `<div class="practice-item">
      <label for="${setName}${index}">${escapeHTML(item.q)}</label>
      <select class="choice-select" id="${setName}${index}" data-ok="${escapeHTML(item.ok)}">
        <option value="">Choose…</option>
        ${item.options.map((option) => `<option value="${escapeHTML(option)}">${escapeHTML(option)}</option>`).join('')}
      </select>
    </div>`;
  }

  function renderPractice() {
    $('#goingToItems').innerHTML = practiceSets.goingTo.map((item, index) => makeSelectItem(item, index, 'goingTo')).join('');
    $('#willItems').innerHTML = practiceSets.will.map((item, index) => makeSelectItem(item, index, 'will')).join('');
    $('#inviteItems').innerHTML = practiceSets.invite.map((item, index) => makeSelectItem(item, index, 'invite')).join('');
    $('#listeningItems').innerHTML = practiceSets.listening.map((item, index) => makeSelectItem(item, index, 'listen')).join('');
  }

  function scoreSelectSet(containerSelector, feedbackSelector, correctText, practiceText) {
    const selects = $$(`${containerSelector} select`);
    const feedback = $(feedbackSelector);
    if (!selects.length || !feedback) return;
    let score = 0;
    selects.forEach((select) => {
      const isCorrect = select.value === select.dataset.ok;
      select.style.borderColor = select.value ? (isCorrect ? '#1f8a5b' : '#d84a58') : '';
      if (isCorrect) score += 1;
    });
    const total = selects.length;
    feedback.className = `feedback ${score === total ? 'good' : 'needs-work'}`;
    feedback.innerHTML = score === total
      ? `🎉 ${correctText} ${score}/${total}. Excellent work!`
      : `You have ${score}/${total}. ${practiceText} Check the red answers, read the visible model, and try again.`;
  }

  function resetSelectSet(containerSelector, feedbackSelector) {
    $$(containerSelector + ' select').forEach((select) => {
      select.value = '';
      select.style.borderColor = '';
    });
    const feedback = $(feedbackSelector);
    if (feedback) {
      feedback.className = 'feedback';
      feedback.textContent = '';
    }
  }

  function renderPhrases() {
    const container = $('#phraseStack');
    if (!container) return;
    container.innerHTML = phraseRows.map(([icon, label, sentence]) => `
      <div class="phrase-row">
        <strong>${icon} ${escapeHTML(label)}</strong>
        <span>${escapeHTML(sentence)}</span>
        <button class="listen-btn compact" type="button" data-say="${escapeHTML(sentence)}">▶ Listen</button>
      </div>`).join('');
  }

  function renderScenarios() {
    const chips = $('#scenarioChips');
    const output = $('#scenarioOutput');
    if (!chips || !output) return;
    chips.innerHTML = scenarios.map((scenario, index) => `<button class="scenario-chip" type="button" data-scenario="${index}">${escapeHTML(scenario.label)}</button>`).join('');
    chips.addEventListener('click', (event) => {
      const button = event.target.closest('[data-scenario]');
      if (!button) return;
      $$('.scenario-chip', chips).forEach((chip) => chip.classList.toggle('active', chip === button));
      const scenario = scenarios[Number(button.dataset.scenario)];
      output.innerHTML = `${scenario.content}<button class="listen-btn compact" type="button" data-say="${escapeHTML(scenario.audio)}">▶ Listen to the dialogue</button>`;
    });
  }

  function buildPlan() {
    const when = $('#planWhen').value.trim() || 'This Saturday';
    const who = $('#planWho').value.trim() || 'my family';
    const first = $('#planOne').value.trim() || 'have lunch together';
    const second = $('#planTwo').value.trim() || 'go for a walk';
    const creative = $('#planCreative').value.trim() || 'draw or paint at home';
    const reason = $('#planReason').value.trim() || 'I enjoy quiet time';
    const text = `${when}, I’m going to spend time with ${who}. First, I’m going to ${first}. Then, I’m going to ${second}. After that, I’m going to ${creative}. Would you like to join me? I’ll bring some water or coffee. I’m looking forward to it because ${reason}.`;
    $('#planOutput').innerHTML = `<p>${escapeHTML(text)}</p><button class="listen-btn compact" type="button" data-say="${escapeHTML(text)}">▶ Listen to your plan</button>`;
  }

  function buildMessage() {
    const name = $('#msgName').value.trim() || 'Sarah';
    const when = $('#msgWhen').value.trim() || 'This Sunday';
    const activity = $('#msgActivity').value.trim() || 'go for a walk in the park';
    const time = $('#msgTime').value.trim() || '2 p.m.';
    const promise = $('#msgWill').value.trim() || 'bring some water';
    const message = `Hi ${name},\n\n${when}, I’m going to ${activity}. Would you like to come with me? We can meet at ${time}. I’ll ${promise}. Let me know!\n\nSee you soon,\nYour name`;
    $('#messageOutput').textContent = message;
  }

  async function copyMessage() {
    const text = $('#messageOutput').textContent.trim();
    if (!text || text === 'Your message will appear here.') {
      $('#messageOutput').textContent = 'Build your message first, then choose Copy.';
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      const original = $('#copyMessage').textContent;
      $('#copyMessage').textContent = 'Copied ✓';
      setTimeout(() => { $('#copyMessage').textContent = original; }, 1400);
    } catch (error) {
      $('#messageOutput').textContent += '\n\nCopy is not available in this browser. Select the text and copy it manually.';
    }
  }

  document.addEventListener('click', (event) => {
    const scrollButton = event.target.closest('[data-scroll]');
    if (scrollButton) {
      const target = $(scrollButton.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const audioButton = event.target.closest('[data-say]');
    if (audioButton) speak(audioButton.dataset.say);

    const checkButton = event.target.closest('[data-check]');
    if (checkButton) {
      const action = checkButton.dataset.check;
      if (action === 'goingTo') scoreSelectSet('#goingToItems', '#goingToFeedback', 'All answers are correct:', 'Remember: are going to + base verb.');
      if (action === 'will') scoreSelectSet('#willItems', '#willFeedback', 'All answers are correct:', 'Use going to for a plan; use will for a promise, offer, or decision now.');
      if (action === 'invite') scoreSelectSet('#inviteItems', '#inviteFeedback', 'All answers are correct:', 'Read the invitation models again and try the polite reply.');
      if (action === 'listening') scoreSelectSet('#listeningItems', '#listeningFeedback', 'Excellent listening:', 'Listen again and look for the plan, time, and what each person will bring.');
    }

    const resetButton = event.target.closest('[data-reset]');
    if (resetButton) {
      const action = resetButton.dataset.reset;
      if (action === 'goingTo') resetSelectSet('#goingToItems', '#goingToFeedback');
      if (action === 'will') resetSelectSet('#willItems', '#willFeedback');
      if (action === 'invite') resetSelectSet('#inviteItems', '#inviteFeedback');
    }
  });

  if ('speechSynthesis' in window) {
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }

  $$('.voice-btn').forEach((button) => {
    button.addEventListener('click', () => {
      selectedVoice = button.dataset.voice;
      $$('.voice-btn').forEach((voiceButton) => voiceButton.classList.toggle('active', voiceButton === button));
    });
  });
  $('#stopVoice')?.addEventListener('click', () => window.speechSynthesis?.cancel());
  $('#printBtn')?.addEventListener('click', () => window.print());
  $('#transcriptBtn')?.addEventListener('click', () => {
    const transcript = $('#transcript');
    const button = $('#transcriptBtn');
    transcript.classList.toggle('hidden');
    button.textContent = transcript.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
  });
  $('#buildPlan')?.addEventListener('click', buildPlan);
  $('#buildMessage')?.addEventListener('click', buildMessage);
  $('#copyMessage')?.addEventListener('click', copyMessage);

  renderTimeCards();
  renderVocabulary();
  renderModels();
  renderPractice();
  renderPhrases();
  renderScenarios();
})();
