
(() => {
const DATA = {"vocab": [{"icon": "🅿️", "word": "parking", "def": "a place for the car", "fr": "parking", "ex": "Do you have parking?"}, {"icon": "🆓", "word": "free parking", "def": "parking with no extra cost", "fr": "parking gratuit", "ex": "Is there free parking?"}, {"icon": "💶", "word": "included", "def": "part of the price", "fr": "inclus", "ex": "Is parking included?"}, {"icon": "🚗", "word": "park", "def": "leave your car in a place", "fr": "se garer", "ex": "Where can I park?"}, {"icon": "📍", "word": "parking space", "def": "one place for one car", "fr": "place de parking", "ex": "Is there a free parking space?"}, {"icon": "🏨", "word": "room with parking", "def": "a room reservation that includes parking", "fr": "chambre avec parking", "ex": "I would like to book a room with parking."}], "mcqs": [{"prompt": "Which sentence is the most polite?", "options": ["I want parking.", "I would like to know if parking is included.", "Parking included?"], "answer": "I would like to know if parking is included.", "hint": "Use would like to sound polite."}, {"prompt": "Which question asks about availability?", "options": ["How much is the parking?", "Do you have parking?", "I would like parking."], "answer": "Do you have parking?", "hint": "This checks if the hotel offers parking."}, {"prompt": "Which question asks about cost?", "options": ["Where can I park?", "How much is the parking?", "Is there parking?"], "answer": "How much is the parking?", "hint": "Think price."}, {"prompt": "Which sentence is correct?", "options": ["I would like know if parking is included.", "I would like to know if parking is included.", "I like to know if parking included."], "answer": "I would like to know if parking is included.", "hint": "Use would like to know."}], "fills": [{"prompt": "Do you have _____?", "answers": ["parking"], "hint": "for the car"}, {"prompt": "Is there _____ parking?", "answers": ["free"], "hint": "without extra cost"}, {"prompt": "I would like to _____ if parking is included.", "answers": ["know"], "hint": "find information"}, {"prompt": "Where can I _____?", "answers": ["park"], "hint": "leave the car"}], "builders": [{"prompt": "Build the correct sentence.", "words": ["Do", "you", "have", "parking"], "answer": "Do you have parking"}, {"prompt": "Build the correct sentence.", "words": ["Is", "parking", "included"], "answer": "Is parking included"}, {"prompt": "Build the correct sentence.", "words": ["I", "would", "like", "to", "book", "a", "room", "with", "parking"], "answer": "I would like to book a room with parking"}], "dialogues": {"hotel": [{"speaker": "Receptionist", "role": "staff", "text": "Hello, how can I help you?", "model": ""}, {"speaker": "You", "role": "student", "text": "Hello, I would like to book a room with parking.", "model": "Hello, I would like to book a room with parking."}, {"speaker": "Receptionist", "role": "staff", "text": "Of course. Would you like to know if parking is included?", "model": ""}, {"speaker": "You", "role": "student", "text": "Yes, please. Is parking included?", "model": "Yes, please. Is parking included?"}], "phone": [{"speaker": "Hotel staff", "role": "staff", "text": "Good afternoon, hotel reception. How can I help you?", "model": ""}, {"speaker": "You", "role": "student", "text": "Hello, I would like some information. Do you have parking?", "model": "Hello, I would like some information. Do you have parking?"}, {"speaker": "Hotel staff", "role": "staff", "text": "Yes, we do. It is 10 euros per night.", "model": ""}, {"speaker": "You", "role": "student", "text": "Thank you. Is there free parking nearby?", "model": "Thank you. Is there free parking nearby?"}], "street": [{"speaker": "You", "role": "student", "text": "Excuse me, where can I park?", "model": "Excuse me, where can I park?"}, {"speaker": "Local person", "role": "staff", "text": "There is a parking near the hotel.", "model": ""}, {"speaker": "You", "role": "student", "text": "Thank you. Is it free?", "model": "Thank you. Is it free?"}]}};
const state = { voice:'US', audio:false, correct:0, total:0, currentMcq:null, currentFill:null, currentBuilder:null, built:[] };

const byId = (id) => document.getElementById(id);
function updateScore() { byId('scoreText').textContent = `${state.correct} / ${state.total}`; }
function addScore(ok) { state.total += 1; if (ok) state.correct += 1; updateScore(); }
function norm(s) { return (s || '').trim().toLowerCase().replace(/[.!?]/g, ''); }
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = state.voice === 'UK' ? 'en-GB' : 'en-US';
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}
function maybeSpeak(text) { if (state.audio) speak(text); }

function renderVocab() {
  const grid = byId('vocabGrid');
  grid.innerHTML = '';
  DATA.vocab.forEach(item => {
    const b = document.createElement('button');
    b.className = 'vocab-card';
    b.innerHTML = `<div style="font-size:1.8rem">${item.icon}</div><div class="vocab-word">${item.word}</div><div class="vocab-details"><p><strong>Definition:</strong> ${item.def}</p><p><strong>Français:</strong> ${item.fr}</p><p><strong>Example:</strong> ${item.ex}</p></div>`;
    b.addEventListener('click', () => {
      b.classList.toggle('revealed');
      maybeSpeak(item.word + '. ' + item.ex);
    });
    grid.appendChild(b);
  });
}

function setupSpeakButtons() {
  document.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.text));
  });
}

function loadMcq() {
  const q = DATA.mcqs[Math.floor(Math.random() * DATA.mcqs.length)];
  state.currentMcq = q;
  byId('mcqPrompt').textContent = q.prompt;
  byId('mcqOptions').innerHTML = '';
  byId('mcqFeedback').textContent = '';
  byId('mcqFeedback').className = 'feedback';
  q.options.forEach(opt => {
    const b = document.createElement('button');
    b.className = 'option';
    b.textContent = opt;
    b.addEventListener('click', () => {
      const ok = opt === q.answer;
      addScore(ok);
      [...byId('mcqOptions').children].forEach(ch => ch.disabled = true);
      if (ok) {
        b.classList.add('correct');
        byId('mcqFeedback').textContent = '✅ Correct!';
        byId('mcqFeedback').className = 'feedback ok';
      } else {
        b.classList.add('incorrect');
        [...byId('mcqOptions').children].forEach(ch => { if (ch.textContent === q.answer) ch.classList.add('correct'); });
        byId('mcqFeedback').textContent = '❌ ' + q.hint;
        byId('mcqFeedback').className = 'feedback no';
      }
    });
    byId('mcqOptions').appendChild(b);
  });
  maybeSpeak(q.prompt);
}

function loadFill() {
  const q = DATA.fills[Math.floor(Math.random() * DATA.fills.length)];
  state.currentFill = q;
  byId('fillPrompt').textContent = q.prompt;
  byId('fillInput').value = '';
  byId('fillHint').textContent = 'Hint: ' + q.hint;
  byId('fillFeedback').textContent = '';
  byId('fillFeedback').className = 'feedback';
  maybeSpeak(q.prompt);
}

function checkFillNow() {
  if (!state.currentFill) return;
  const ok = state.currentFill.answers.some(a => norm(a) === norm(byId('fillInput').value));
  addScore(ok);
  if (ok) {
    byId('fillFeedback').textContent = '✅ Correct!';
    byId('fillFeedback').className = 'feedback ok';
  } else {
    byId('fillFeedback').textContent = '❌ Try again. Possible answer: ' + state.currentFill.answers[0];
    byId('fillFeedback').className = 'feedback no';
  }
}

function loadBuilder() {
  const q = DATA.builders[Math.floor(Math.random() * DATA.builders.length)];
  state.currentBuilder = q;
  state.built = [];
  byId('builderPrompt').textContent = q.prompt;
  byId('builderWords').innerHTML = '';
  byId('builderAnswer').innerHTML = 'Build your sentence here.';
  byId('builderFeedback').textContent = '';
  byId('builderFeedback').className = 'feedback';
  q.words.slice().sort(() => Math.random() - 0.5).forEach(word => {
    const b = document.createElement('button');
    b.className = 'word-chip';
    b.textContent = word;
    b.addEventListener('click', () => {
      state.built.push(word);
      b.disabled = true;
      renderBuilderAnswer();
    });
    byId('builderWords').appendChild(b);
  });
}

function renderBuilderAnswer() {
  if (!state.built.length) {
    byId('builderAnswer').innerHTML = 'Build your sentence here.';
    return;
  }
  byId('builderAnswer').innerHTML = state.built.map(w => `<span class="answer-chip">${w}</span>`).join(' ');
}

function checkBuilderNow() {
  if (!state.currentBuilder) return;
  const ok = state.built.join(' ') === state.currentBuilder.answer;
  addScore(ok);
  if (ok) {
    byId('builderFeedback').textContent = '✅ Correct!';
    byId('builderFeedback').className = 'feedback ok';
  } else {
    byId('builderFeedback').textContent = '❌ Model: ' + state.currentBuilder.answer;
    byId('builderFeedback').className = 'feedback no';
  }
}
function clearBuilderNow() { if (state.currentBuilder) loadBuilder(); }
function listenBuilderNow() { if (state.currentBuilder) speak(state.currentBuilder.answer); }

function loadDialogue(type) {
  const box = byId('dialogueBox');
  const helper = byId('dialogueHelper');
  box.innerHTML = '';
  DATA.dialogues[type].forEach(line => {
    const div = document.createElement('div');
    div.className = 'dialogue-line ' + line.role;
    div.innerHTML = `<span class="speaker">${line.speaker}</span>${line.text}`;
    div.addEventListener('click', () => {
      if (line.model) helper.textContent = line.model;
      speak(line.text);
    });
    box.appendChild(div);
  });
  helper.textContent = 'Tap one of the lines to hear it and practise.';
}

function missionText() {
  return [byId('line1').value, byId('line2').value, byId('line3').value, byId('line4').value].join(' ');
}

function resetAllNow() {
  state.correct = 0; state.total = 0; updateScore();
  byId('mcqPrompt').textContent = 'Click “New question” to begin.'; byId('mcqOptions').innerHTML = ''; byId('mcqFeedback').textContent = '';
  byId('fillPrompt').textContent = 'Click “New fill-in” to begin.'; byId('fillInput').value = ''; byId('fillHint').textContent = ''; byId('fillFeedback').textContent = '';
  byId('builderPrompt').textContent = 'Click “New sentence” to begin.'; byId('builderWords').innerHTML = ''; byId('builderAnswer').innerHTML = 'Build your sentence here.'; byId('builderFeedback').textContent = '';
  byId('dialogueBox').innerHTML = ''; byId('dialogueHelper').textContent = 'Choose a dialogue to begin.'; byId('missionOutput').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderVocab();
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

  byId('newMcq').addEventListener('click', loadMcq);
  byId('newFill').addEventListener('click', loadFill);
  byId('checkFill').addEventListener('click', checkFillNow);
  byId('fillInput').addEventListener('keydown', e => { if (e.key === 'Enter') checkFillNow(); });
  byId('newBuilder').addEventListener('click', loadBuilder);
  byId('checkBuilder').addEventListener('click', checkBuilderNow);
  byId('clearBuilder').addEventListener('click', clearBuilderNow);
  byId('listenBuilder').addEventListener('click', listenBuilderNow);
  byId('loadHotelDialogue').addEventListener('click', () => loadDialogue('hotel'));
  byId('loadPhoneDialogue').addEventListener('click', () => loadDialogue('phone'));
  byId('loadStreetDialogue').addEventListener('click', () => loadDialogue('street'));
  byId('listenMissionUS').addEventListener('click', () => { const old = state.voice; state.voice = 'US'; speak(missionText()); state.voice = old; });
  byId('listenMissionUK').addEventListener('click', () => { const old = state.voice; state.voice = 'UK'; speak(missionText()); state.voice = old; });
  byId('showMissionText').addEventListener('click', () => {
    byId('missionOutput').textContent = [byId('line1').value, byId('line2').value, byId('line3').value, byId('line4').value].join('\n\n');
  });
  byId('resetAll').addEventListener('click', resetAllNow);
});
})();
