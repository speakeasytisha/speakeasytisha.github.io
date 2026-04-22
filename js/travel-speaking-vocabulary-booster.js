
(() => {
const DATA = {"vocab": {"hotel": [{"icon": "🏨", "word": "hotel", "def": "a place where you stay when you travel", "fr": "hôtel", "ex": "You want a hotel near the beach."}, {"icon": "🛏️", "word": "room", "def": "the place where you sleep in a hotel", "fr": "chambre", "ex": "You would like to book a room."}, {"icon": "📅", "word": "book", "def": "reserve in advance", "fr": "réserver", "ex": "You are booking a room."}, {"icon": "👫", "word": "for two adults", "def": "for two people", "fr": "pour deux adultes", "ex": "You need a room for two adults."}], "parking": [{"icon": "🚗", "word": "parking", "def": "a place for the car", "fr": "parking", "ex": "Do you have parking?"}, {"icon": "🅿️", "word": "free parking", "def": "parking with no extra cost", "fr": "parking gratuit", "ex": "Is there free parking?"}, {"icon": "💶", "word": "included", "def": "part of the price", "fr": "inclus", "ex": "Is parking included?"}, {"icon": "📍", "word": "park", "def": "leave your car in a place", "fr": "se garer", "ex": "Where can I park?"}], "restaurant": [{"icon": "🍽️", "word": "table", "def": "a place to sit and eat", "fr": "table", "ex": "I would like to book a table."}, {"icon": "📖", "word": "menu", "def": "the list of food and drinks", "fr": "menu / carte", "ex": "I would like the menu, please."}, {"icon": "🥗", "word": "recommend", "def": "suggest something", "fr": "recommander", "ex": "What do you recommend?"}, {"icon": "🪟", "word": "near the window", "def": "close to the window", "fr": "près de la fenêtre", "ex": "Do you have a table near the window?"}], "travel": [{"icon": "✈️", "word": "travel", "def": "go from one place to another", "fr": "voyager", "ex": "You are travelling to Hossegor."}, {"icon": "🧳", "word": "luggage", "def": "your bags and suitcases", "fr": "bagages", "ex": "Where can I put my luggage?"}, {"icon": "📍", "word": "stay", "def": "live temporarily in a place", "fr": "séjourner", "ex": "You stay in a hotel."}, {"icon": "🗓️", "word": "night", "def": "one evening to morning stay", "fr": "nuit", "ex": "How much is it per night?"}]}, "transforms": [{"prompt": "Change to present continuous: You book a room.", "answers": ["You are booking a room"], "hint": "Use are + verb-ing"}, {"prompt": "Make it polite: I want a room near the beach.", "answers": ["I would like a room near the beach", "I would like a room near the beach."], "hint": "Use would like"}, {"prompt": "Ask about parking: You need parking.", "answers": ["Do you have parking?", "Do you have parking"], "hint": "Turn it into a question"}, {"prompt": "Ask about existence: parking / free", "answers": ["Is there free parking?", "Is there free parking"], "hint": "Use Is there...?"}], "questionCards": [{"q": "Where do you want to stay?", "repeat": "Where do I want to stay?", "a": "I want to stay near the beach."}, {"q": "Who are you travelling with?", "repeat": "Who am I travelling with?", "a": "I am travelling with my husband."}, {"q": "What would you like?", "repeat": "What would you like?", "a": "I would like a room for two adults."}, {"q": "What do you prefer?", "repeat": "What do I prefer?", "a": "I prefer quiet hotels near the beach."}], "dialogues": {"hotel": [{"speaker": "Receptionist", "role": "staff", "text": "Hello, how can I help you?", "model": ""}, {"speaker": "You", "role": "student", "text": "Hello, I would like to book a room, please.", "model": "Hello, I would like to book a room, please."}, {"speaker": "Receptionist", "role": "staff", "text": "For how many people?", "model": ""}, {"speaker": "You", "role": "student", "text": "For two adults.", "model": "For two adults."}, {"speaker": "Receptionist", "role": "staff", "text": "Do you have any preferences?", "model": ""}, {"speaker": "You", "role": "student", "text": "Yes, I would like a room near the beach.", "model": "Yes, I would like a room near the beach."}], "parking": [{"speaker": "Receptionist", "role": "staff", "text": "Do you need parking?", "model": ""}, {"speaker": "You", "role": "student", "text": "Yes, do you have free parking?", "model": "Yes, do you have free parking?"}, {"speaker": "Receptionist", "role": "staff", "text": "Parking is 12 euros per night.", "model": ""}, {"speaker": "You", "role": "student", "text": "Is it included in the room price?", "model": "Is it included in the room price?"}, {"speaker": "Receptionist", "role": "staff", "text": "I'm sorry. Parking is an additional fee.", "model": ""}], "restaurant": [{"speaker": "Restaurant staff", "role": "staff", "text": "Good evening. How can I help you?", "model": ""}, {"speaker": "You", "role": "student", "text": "Good evening. I would like to book a table for two, please.", "model": "Good evening. I would like to book a table for two, please."}, {"speaker": "Restaurant staff", "role": "staff", "text": "Of course. Do you have a preference?", "model": ""}, {"speaker": "You", "role": "student", "text": "Yes, do you have a table near the window?", "model": "Yes, do you have a table near the window?"}]}};
const state = {voice:'US', audio:false, correct:0, total:0, currentTransform:null};

const byId = (id) => document.getElementById(id);
const on = (id, evt, fn) => {
  const el = byId(id);
  if (el) el.addEventListener(evt, fn);
};
function updateScore() {
  const el = byId('scoreText');
  if (el) el.textContent = `${state.correct} / ${state.total}`;
}
function addScore(ok) {
  state.total += 1;
  if (ok) state.correct += 1;
  updateScore();
}
function norm(s) {
  return (s || '').trim().toLowerCase().replace(/[.!?]/g, '');
}
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = state.voice === 'UK' ? 'en-GB' : 'en-US';
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}
function maybeSpeak(text) {
  if (state.audio) speak(text);
}

function renderVocab() {
  const map = {hotel:'hotelVocabGrid', parking:'parkingVocabGrid', restaurant:'restaurantVocabGrid', travel:'travelVocabGrid'};
  Object.keys(map).forEach(key => {
    const grid = byId(map[key]);
    if (!grid) return;
    grid.innerHTML = '';
    DATA.vocab[key].forEach(item => {
      const b = document.createElement('button');
      b.className = 'vocab-card';
      b.innerHTML = `<div style="font-size:1.8rem">${item.icon}</div><div class="vocab-word">${item.word}</div><div class="vocab-details"><p><strong>Definition:</strong> ${item.def}</p><p><strong>Français:</strong> ${item.fr}</p><p><strong>Example:</strong> ${item.ex}</p></div>`;
      b.addEventListener('click', () => {
        b.classList.toggle('revealed');
        maybeSpeak(item.word + '. ' + item.ex);
      });
      grid.appendChild(b);
    });
  });
}

function renderQuestions() {
  const grid = byId('questionGrid');
  if (!grid) return;
  grid.innerHTML = '';
  DATA.questionCards.forEach(item => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `<h3>${item.q}</h3><p><strong>Repeat:</strong> ${item.repeat}</p><p><strong>Answer:</strong> ${item.a}</p><div class="actions"><button class="voice">🔊 Question</button><button class="voice">🔊 Repeat</button><button class="voice">🔊 Answer</button></div>`;
    const btns = card.querySelectorAll('button');
    btns[0].addEventListener('click', () => speak(item.q));
    btns[1].addEventListener('click', () => speak(item.repeat));
    btns[2].addEventListener('click', () => speak(item.a));
    grid.appendChild(card);
  });
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = byId('tab-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}

function setupSpeakButtons() {
  document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.text));
  });
}

function loadTransform() {
  const q = DATA.transforms[Math.floor(Math.random() * DATA.transforms.length)];
  state.currentTransform = q;
  if (byId('transformPrompt')) byId('transformPrompt').textContent = q.prompt;
  if (byId('transformAnswer1')) byId('transformAnswer1').value = '';
  if (byId('transformAnswer2')) byId('transformAnswer2').value = '';
  if (byId('transformHint')) byId('transformHint').textContent = 'Hint: ' + q.hint;
  if (byId('transformFeedback')) {
    byId('transformFeedback').textContent = '';
    byId('transformFeedback').className = 'feedback';
  }
  maybeSpeak(q.prompt);
}

function checkTransformNow() {
  if (!state.currentTransform) return;
  const vals = [byId('transformAnswer1')?.value || '', byId('transformAnswer2')?.value || ''].map(norm).filter(Boolean);
  const ok = vals.some(v => state.currentTransform.answers.some(a => norm(a) === v));
  addScore(ok);
  const fb = byId('transformFeedback');
  if (!fb) return;
  if (ok) {
    fb.textContent = '✅ Correct!';
    fb.className = 'feedback ok';
  } else {
    fb.textContent = '❌ Possible answer: ' + state.currentTransform.answers[0];
    fb.className = 'feedback no';
  }
}
function listenTransformNow() {
  if (state.currentTransform) speak(state.currentTransform.prompt);
}

function loadRoleplay(type) {
  const box = byId('roleplayBox');
  const helper = byId('roleplayHelper');
  if (!box) return;
  box.innerHTML = '';
  DATA.dialogues[type].forEach(line => {
    const div = document.createElement('div');
    div.className = 'dialogue-line ' + line.role;
    div.innerHTML = `<span class="speaker">${line.speaker}</span>${line.text}`;
    div.addEventListener('click', () => {
      if (line.model && helper) helper.textContent = line.model;
      speak(line.text);
    });
    box.appendChild(div);
  });
  if (helper) helper.textContent = 'Tap one of your lines to hear it and use it as a model.';
}

function missionText() {
  return [byId('step1')?.value || '', byId('step2')?.value || '', byId('step3')?.value || ''].join(' ');
}

function resetAllNow() {
  state.correct = 0; state.total = 0; updateScore();
  if (byId('transformPrompt')) byId('transformPrompt').textContent = 'Click “New task” to begin.';
  if (byId('transformAnswer1')) byId('transformAnswer1').value = '';
  if (byId('transformAnswer2')) byId('transformAnswer2').value = '';
  if (byId('transformHint')) byId('transformHint').textContent = '';
  if (byId('transformFeedback')) byId('transformFeedback').textContent = '';
  if (byId('roleplayBox')) byId('roleplayBox').innerHTML = '';
  if (byId('roleplayHelper')) byId('roleplayHelper').textContent = 'Choose a roleplay to begin.';
  if (byId('missionOutput')) byId('missionOutput').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderVocab();
  renderQuestions();
  setupTabs();
  setupSpeakButtons();
  updateScore();

  document.querySelectorAll('[data-voice]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-voice]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.voice = btn.dataset.voice;
  }));

  document.querySelectorAll('[data-audio]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-audio]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.audio = btn.dataset.audio === 'on';
  }));

  on('newTransform', 'click', loadTransform);
  on('checkTransform', 'click', checkTransformNow);
  on('listenTransform', 'click', listenTransformNow);

  on('loadHotelRoleplay', 'click', () => loadRoleplay('hotel'));
  on('loadParkingRoleplay', 'click', () => loadRoleplay('parking'));
  on('loadRestaurantRoleplay', 'click', () => loadRoleplay('restaurant'));

  on('listenMissionUS', 'click', () => {
    const old = state.voice; state.voice = 'US'; speak(missionText()); state.voice = old;
  });
  on('listenMissionUK', 'click', () => {
    const old = state.voice; state.voice = 'UK'; speak(missionText()); state.voice = old;
  });
  on('showMissionText', 'click', () => {
    const out = byId('missionOutput');
    if (out) out.textContent = [byId('step1')?.value || '', byId('step2')?.value || '', byId('step3')?.value || ''].join('\n\n');
  });

  on('resetAll', 'click', resetAllNow);
});
})();
