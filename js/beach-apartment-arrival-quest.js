
(() => {
const DATA = {"vocab": {"accommodation": [{"icon": "🏠", "word": "holiday rental", "fr": "location de vacances", "def": "a place you rent for your holiday", "ex": "We are staying in a holiday rental."}, {"icon": "🏢", "word": "apartment", "fr": "appartement", "def": "a flat you can rent", "ex": "We are renting an apartment near the beach."}, {"icon": "🏡", "word": "house", "fr": "maison", "def": "a private home", "ex": "A house is good if you want more space."}, {"icon": "🌊", "word": "sea view", "fr": "vue mer", "def": "a view of the ocean", "ex": "Does the apartment have a sea view?"}, {"icon": "🛋️", "word": "furnished", "fr": "meublé", "def": "with furniture inside", "ex": "Is the apartment furnished?"}, {"icon": "🧺", "word": "linen", "fr": "linge de maison", "def": "sheets and towels", "ex": "Is linen included?"}], "arrival": [{"icon": "🔑", "word": "key box", "fr": "boîte à clés", "def": "a small locked box for the key", "ex": "Where is the key box?"}, {"icon": "📲", "word": "code", "fr": "code", "def": "numbers used to open something", "ex": "What is the code for the key box?"}, {"icon": "🕒", "word": "check-in time", "fr": "heure d’arrivée", "def": "the time you can arrive", "ex": "What time is check-in?"}, {"icon": "🚪", "word": "entrance", "fr": "entrée", "def": "the door or way in", "ex": "Where is the entrance?"}, {"icon": "📍", "word": "address", "fr": "adresse", "def": "where the place is located", "ex": "Can you confirm the address?"}, {"icon": "🙋", "word": "host", "fr": "hôte / propriétaire", "def": "the person who welcomes you", "ex": "Can I contact the host?"}], "requests": [{"icon": "🙋", "word": "Can you help me?", "fr": "Pouvez-vous m’aider ?", "def": "ask for help", "ex": "Can you help me, please?"}, {"icon": "🔁", "word": "Could you repeat?", "fr": "Pourriez-vous répéter ?", "def": "ask someone to say it again", "ex": "Could you repeat, please?"}, {"icon": "🐢", "word": "Could you speak slowly?", "fr": "Pourriez-vous parler lentement ?", "def": "ask someone to speak more slowly", "ex": "Could you speak slowly, please?"}, {"icon": "💬", "word": "I would like to know...", "fr": "Je voudrais savoir...", "def": "polite way to ask for information", "ex": "I would like to know if parking is included."}, {"icon": "📩", "word": "Can you send me...?", "fr": "Pouvez-vous m’envoyer... ?", "def": "ask for information by message", "ex": "Can you send me the address?"}, {"icon": "✅", "word": "Is it included?", "fr": "Est-ce inclus ?", "def": "ask if it is part of the price", "ex": "Is linen included?"}], "parking": [{"icon": "🅿️", "word": "parking space", "fr": "place de parking", "def": "one place for one car", "ex": "Is there a parking space?"}, {"icon": "🚗", "word": "park", "fr": "se garer", "def": "leave your car somewhere", "ex": "Can I park here?"}, {"icon": "📍", "word": "nearby", "fr": "à proximité", "def": "not far away", "ex": "Is there parking nearby?"}, {"icon": "🆓", "word": "free parking", "fr": "parking gratuit", "def": "parking with no extra cost", "ex": "Is there free parking nearby?"}, {"icon": "💶", "word": "paid parking", "fr": "parking payant", "def": "parking you must pay for", "ex": "Is it paid parking?"}, {"icon": "🔒", "word": "secure parking", "fr": "parking sécurisé", "def": "safer private parking", "ex": "Is there secure parking?"}]}, "accommodationOptions": [{"title": "Beach apartment", "tag": "Best for beach access", "icon": "🏖️", "text": "An apartment near the beach is practical if you want to walk to the ocean and restaurants.", "model": "We prefer a beach apartment because we want to be close to the ocean."}, {"title": "Residence / self-catering flat", "tag": "Practical and independent", "icon": "🏢", "text": "A residence can offer apartments with a kitchenette, sometimes near the beach or lake.", "model": "A residence is practical because we can cook and stay independently."}, {"title": "Holiday house", "tag": "More space", "icon": "🏡", "text": "A house can be better if you want more space, a terrace, or a garden.", "model": "A holiday house is comfortable because there is more space."}, {"title": "Hotel", "tag": "Services included", "icon": "🏨", "text": "A hotel is useful if you want reception, breakfast, and daily service.", "model": "A hotel is easy because there is reception and breakfast."}, {"title": "Guest house / B&B", "tag": "Personal welcome", "icon": "🛏️", "text": "A guest house can feel warmer and more personal.", "model": "A guest house is nice because the welcome is personal."}, {"title": "Campsite / mobile home", "tag": "Budget + outdoor feeling", "icon": "⛺", "text": "A campsite or mobile home can be more relaxed and often cheaper.", "model": "A campsite is relaxed and good for a simple holiday."}], "mcqs": [{"prompt": "You arrive at your holiday rental. What do you say first?", "options": ["Hello, I have a reservation.", "Give me apartment.", "I want keys now."], "answer": "Hello, I have a reservation.", "hint": "Use a polite complete sentence."}, {"prompt": "Which question is best for a key box?", "options": ["Where is the key box?", "Where key?", "Key box where it is?"], "answer": "Where is the key box?", "hint": "Use Where is...?"}, {"prompt": "Which sentence asks about linen?", "options": ["Is linen included?", "Linen included is?", "I linen."], "answer": "Is linen included?", "hint": "Use Is + noun + included?"}, {"prompt": "Which sentence asks for permission to park?", "options": ["Can I park here?", "I park here?", "Parking I can?"], "answer": "Can I park here?", "hint": "Use Can I...?"}, {"prompt": "Which sentence is more polite?", "options": ["I want the code.", "Could you send me the code, please?", "Code now."], "answer": "Could you send me the code, please?", "hint": "Could you... please is polite."}], "fills": [{"prompt": "I have a _____.", "answers": ["reservation"], "hint": "booking"}, {"prompt": "Where is the key _____?", "answers": ["box"], "hint": "small place for the key"}, {"prompt": "What is the _____ for the key box?", "answers": ["code"], "hint": "numbers"}, {"prompt": "Is linen _____?", "answers": ["included"], "hint": "part of the price"}, {"prompt": "Can I _____ here?", "answers": ["park"], "hint": "leave the car"}], "builders": [{"prompt": "Build the sentence.", "words": ["I", "have", "a", "reservation"], "answer": "I have a reservation"}, {"prompt": "Build the sentence.", "words": ["Where", "is", "the", "key", "box"], "answer": "Where is the key box"}, {"prompt": "Build the sentence.", "words": ["Could", "you", "send", "me", "the", "code", "please"], "answer": "Could you send me the code please"}, {"prompt": "Build the sentence.", "words": ["Is", "linen", "included"], "answer": "Is linen included"}, {"prompt": "Build the sentence.", "words": ["Can", "I", "park", "here"], "answer": "Can I park here"}], "dialogues": {"agency": [{"speaker": "Agency / Host", "role": "staff", "text": "Hello, welcome. How can I help you?", "model": ""}, {"speaker": "You", "role": "student", "text": "Hello, I have a reservation for an apartment.", "model": "Hello, I have a reservation for an apartment."}, {"speaker": "Agency / Host", "role": "staff", "text": "Of course. Can I have your name, please?", "model": ""}, {"speaker": "You", "role": "student", "text": "My name is Karine Cormier.", "model": "My name is Karine Cormier."}], "keybox": [{"speaker": "You", "role": "student", "text": "Hello, I am arriving at the apartment.", "model": "Hello, I am arriving at the apartment."}, {"speaker": "Host", "role": "staff", "text": "The key is in the key box near the entrance.", "model": ""}, {"speaker": "You", "role": "student", "text": "Thank you. What is the code for the key box?", "model": "Thank you. What is the code for the key box?"}, {"speaker": "Host", "role": "staff", "text": "The code is in the message I sent you.", "model": ""}, {"speaker": "You", "role": "student", "text": "Could you send it again, please?", "model": "Could you send it again, please?"}], "parking": [{"speaker": "You", "role": "student", "text": "Can you tell me where the parking is?", "model": "Can you tell me where the parking is?"}, {"speaker": "Host", "role": "staff", "text": "Yes, the parking space is behind the building.", "model": ""}, {"speaker": "You", "role": "student", "text": "Thank you. Is parking included?", "model": "Thank you. Is parking included?"}, {"speaker": "Host", "role": "staff", "text": "Yes, it is included.", "model": ""}], "problem": [{"speaker": "You", "role": "student", "text": "Hello, I have a problem. I cannot open the key box.", "model": "Hello, I have a problem. I cannot open the key box."}, {"speaker": "Host", "role": "staff", "text": "No problem. I can help you.", "model": ""}, {"speaker": "You", "role": "student", "text": "Could you repeat the code slowly, please?", "model": "Could you repeat the code slowly, please?"}, {"speaker": "Host", "role": "staff", "text": "Of course. The code is four, seven, two, nine.", "model": ""}]}};
const state = { voice:'US', audio:false, correct:0, total:0, currentMcq:null, currentFill:null, currentBuilder:null, built:[] };
const byId = (id) => document.getElementById(id);
function updateScore() { byId('scoreText').textContent = `${state.correct} / ${state.total}`; }
function addScore(ok) { state.total++; if (ok) state.correct++; updateScore(); }
function norm(s) { return (s || '').trim().toLowerCase().replace(/[.!?]/g, ''); }
let availableVoices = [];

function loadVoices() {
  availableVoices = window.speechSynthesis.getVoices();
}

if ("speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function getPreferredVoice() {
  const targetLang = state.voice === "UK" ? "en-GB" : "en-US";

  // 1. exact match: en-US or en-GB
  let voice = availableVoices.find(v => v.lang === targetLang);

  // 2. any voice starting with en-US / en-GB
  if (!voice) {
    voice = availableVoices.find(v =>
      v.lang && v.lang.toLowerCase().startsWith(targetLang.toLowerCase())
    );
  }

  // 3. iPhone fallback: any English voice
  if (!voice) {
    voice = availableVoices.find(v =>
      v.lang && v.lang.toLowerCase().startsWith("en")
    );
  }

  return voice || null;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  loadVoices();

  const u = new SpeechSynthesisUtterance(text);
  const preferredVoice = getPreferredVoice();

  if (preferredVoice) {
    u.voice = preferredVoice;
    u.lang = preferredVoice.lang;
  } else {
    u.lang = state.voice === "UK" ? "en-GB" : "en-US";
  }

  u.rate = 0.85;
  u.pitch = 1;

  window.speechSynthesis.speak(u);
}
  function maybeSpeak(text) { if (state.audio) speak(text); }

function renderOptions() {
  const grid = byId('optionsGrid'); grid.innerHTML = '';
  DATA.accommodationOptions.forEach(item => {
    const card = document.createElement('article');
    card.className = 'accom-card';
    card.innerHTML = `<div class="accom-icon">${item.icon}</div><h3>${item.title}</h3><div class="accom-tag">${item.tag}</div><p>${item.text}</p><button class="voice-btn">🔊 Say it</button>`;
    card.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); speak(item.model); });
    card.addEventListener('click', () => maybeSpeak(item.model));
    grid.appendChild(card);
  });
}

function renderVocab() {
  const map = { accommodation:'accommodationGrid', arrival:'arrivalGrid', requests:'requestsGrid', parking:'parkingGrid' };
  Object.keys(map).forEach(key => {
    const grid = byId(map[key]); grid.innerHTML = '';
    DATA.vocab[key].forEach(item => {
      const b = document.createElement('button');
      b.className = 'vocab-card';
      b.innerHTML = `<div style="font-size:1.8rem">${item.icon}</div><div class="vocab-word">${item.word}</div><div class="vocab-details"><p><strong>Definition:</strong> ${item.def}</p><p><strong>Français:</strong> ${item.fr}</p><p><strong>Example:</strong> ${item.ex}</p></div>`;
      b.addEventListener('click', () => { b.classList.toggle('revealed'); maybeSpeak(item.word + '. ' + item.ex); });
      grid.appendChild(b);
    });
  });
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    byId('tab-' + btn.dataset.tab).classList.add('active');
  }));
}

function setupSpeakButtons() { document.querySelectorAll('.speak-btn').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.text))); }

function loadMcq() {
  const q = DATA.mcqs[Math.floor(Math.random() * DATA.mcqs.length)];
  state.currentMcq = q; byId('mcqPrompt').textContent = q.prompt; byId('mcqOptions').innerHTML = ''; byId('mcqFeedback').textContent = ''; byId('mcqFeedback').className = 'feedback';
  q.options.forEach(opt => {
    const b = document.createElement('button'); b.className = 'option'; b.textContent = opt;
    b.addEventListener('click', () => {
      const ok = opt === q.answer; addScore(ok); [...byId('mcqOptions').children].forEach(ch => ch.disabled = true);
      if (ok) { b.classList.add('correct'); byId('mcqFeedback').textContent = '✅ Correct!'; byId('mcqFeedback').className = 'feedback ok'; }
      else { b.classList.add('incorrect'); [...byId('mcqOptions').children].forEach(ch => { if (ch.textContent === q.answer) ch.classList.add('correct'); }); byId('mcqFeedback').textContent = '❌ ' + q.hint; byId('mcqFeedback').className = 'feedback no'; }
    });
    byId('mcqOptions').appendChild(b);
  });
  maybeSpeak(q.prompt);
}

function loadFill() {
  const q = DATA.fills[Math.floor(Math.random() * DATA.fills.length)];
  state.currentFill = q; byId('fillPrompt').textContent = q.prompt; byId('fillInput').value = ''; byId('fillHint').textContent = 'Hint: ' + q.hint; byId('fillFeedback').textContent = ''; byId('fillFeedback').className = 'feedback'; maybeSpeak(q.prompt);
}
function checkFillNow() {
  if (!state.currentFill) return;
  const ok = state.currentFill.answers.some(a => norm(a) === norm(byId('fillInput').value)); addScore(ok);
  if (ok) { byId('fillFeedback').textContent = '✅ Correct!'; byId('fillFeedback').className = 'feedback ok'; }
  else { byId('fillFeedback').textContent = '❌ Try again. Possible answer: ' + state.currentFill.answers[0]; byId('fillFeedback').className = 'feedback no'; }
}

function loadBuilder() {
  const q = DATA.builders[Math.floor(Math.random() * DATA.builders.length)];
  state.currentBuilder = q; state.built = []; byId('builderPrompt').textContent = q.prompt; byId('builderWords').innerHTML = ''; byId('builderAnswer').innerHTML = 'Build your sentence here.'; byId('builderFeedback').textContent = ''; byId('builderFeedback').className = 'feedback';
  q.words.slice().sort(() => Math.random() - 0.5).forEach(word => {
    const b = document.createElement('button'); b.className = 'word-chip'; b.textContent = word;
    b.addEventListener('click', () => { state.built.push(word); b.disabled = true; renderBuilderAnswer(); });
    byId('builderWords').appendChild(b);
  });
}
function renderBuilderAnswer() { byId('builderAnswer').innerHTML = state.built.length ? state.built.map(w => `<span class="answer-chip">${w}</span>`).join(' ') : 'Build your sentence here.'; }
function checkBuilderNow() {
  if (!state.currentBuilder) return;
  const ok = state.built.join(' ') === state.currentBuilder.answer; addScore(ok);
  if (ok) { byId('builderFeedback').textContent = '✅ Correct!'; byId('builderFeedback').className = 'feedback ok'; }
  else { byId('builderFeedback').textContent = '❌ Model: ' + state.currentBuilder.answer; byId('builderFeedback').className = 'feedback no'; }
}
function clearBuilderNow() { if (state.currentBuilder) loadBuilder(); }
function listenBuilderNow() { if (state.currentBuilder) speak(state.currentBuilder.answer); }

function loadDialogue(type) {
  const box = byId('dialogueBox'); const helper = byId('dialogueHelper'); box.innerHTML = '';
  DATA.dialogues[type].forEach(line => {
    const div = document.createElement('div'); div.className = 'dialogue-line ' + line.role; div.innerHTML = `<span class="speaker">${line.speaker}</span>${line.text}`;
    div.addEventListener('click', () => { if (line.model) helper.textContent = line.model; speak(line.text); });
    box.appendChild(div);
  });
  helper.textContent = 'Tap one of the lines to hear it and practise.';
}

function missionText() { return [byId('line1').value, byId('line2').value, byId('line3').value, byId('line4').value, byId('line5').value, byId('line6').value].join(' '); }

function resetAllNow() {
  state.correct = 0; state.total = 0; updateScore();
  byId('mcqPrompt').textContent = 'Click “New question” to begin.'; byId('mcqOptions').innerHTML = ''; byId('mcqFeedback').textContent = '';
  byId('fillPrompt').textContent = 'Click “New fill-in” to begin.'; byId('fillInput').value = ''; byId('fillHint').textContent = ''; byId('fillFeedback').textContent = '';
  byId('builderPrompt').textContent = 'Click “New sentence” to begin.'; byId('builderWords').innerHTML = ''; byId('builderAnswer').innerHTML = 'Build your sentence here.'; byId('builderFeedback').textContent = '';
  byId('dialogueBox').innerHTML = ''; byId('dialogueHelper').textContent = 'Choose a dialogue to begin.'; byId('missionOutput').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderOptions(); renderVocab(); setupTabs(); setupSpeakButtons(); updateScore();
  document.querySelectorAll('[data-voice]').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('[data-voice]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.voice = btn.dataset.voice; }));
  document.querySelectorAll('[data-audio]').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('[data-audio]').forEach(b => b.classList.remove('active')); btn.classList.add('active'); state.audio = btn.dataset.audio === 'on'; }));
  byId('newMcq').addEventListener('click', loadMcq);
  byId('newFill').addEventListener('click', loadFill);
  byId('checkFill').addEventListener('click', checkFillNow);
  byId('fillInput').addEventListener('keydown', e => { if (e.key === 'Enter') checkFillNow(); });
  byId('newBuilder').addEventListener('click', loadBuilder);
  byId('checkBuilder').addEventListener('click', checkBuilderNow);
  byId('clearBuilder').addEventListener('click', clearBuilderNow);
  byId('listenBuilder').addEventListener('click', listenBuilderNow);
  byId('loadAgencyDialogue').addEventListener('click', () => loadDialogue('agency'));
  byId('loadKeyboxDialogue').addEventListener('click', () => loadDialogue('keybox'));
  byId('loadParkingDialogue').addEventListener('click', () => loadDialogue('parking'));
  byId('loadProblemDialogue').addEventListener('click', () => loadDialogue('problem'));
  byId('listenMissionUS').addEventListener('click', () => { const old = state.voice; state.voice = 'US'; speak(missionText()); state.voice = old; });
  byId('listenMissionUK').addEventListener('click', () => { const old = state.voice; state.voice = 'UK'; speak(missionText()); state.voice = old; });
  byId('showMissionText').addEventListener('click', () => { byId('missionOutput').textContent = [byId('line1').value, byId('line2').value, byId('line3').value, byId('line4').value, byId('line5').value, byId('line6').value].join('\n\n'); });
  byId('resetAll').addEventListener('click', resetAllNow);
});
})();
