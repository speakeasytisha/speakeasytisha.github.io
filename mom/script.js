const state = {
  accent: 'fr-FR',
  voices: [],
  selectedVoiceName: '',
  scoreCorrect: 0,
  scoreTotal: 0,
  attempted: new Set(),
  currentCategory: 'all',
  currentSearch: ''
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const CATEGORIES = [
  ['identity', 'Identity'],
  ['places', 'Places'],
  ['family', 'Family'],
  ['qualities', 'Qualities'],
  ['work', 'Work & studies'],
  ['verbs', 'Useful verbs'],
  ['connectors', 'Connectors'],
  ['travel', 'Travel & politeness']
];

const VOCAB = [
  {cat:'identity', term:'Bonjour', translation:'Hello / good morning', definition:'A polite way to start almost any conversation.', example:'Bonjour, je m’appelle Jane.'},
  {cat:'identity', term:'Je m’appelle Jane.', translation:'My name is Jane.', definition:'Use this to introduce your name.', example:'Bonjour, je m’appelle Jane.'},
  {cat:'identity', term:'Je suis américaine.', translation:'I am American.', definition:'Use être + nationality. Feminine: américaine.', example:'Je suis américaine et j’habite en Californie.'},
  {cat:'identity', term:'Je suis née en 1955.', translation:'I was born in 1955.', definition:'Use née with an extra e for Jane because she is a woman.', example:'Je suis née en 1955 dans le New Hampshire.'},
  {cat:'identity', term:'J’apprends le français.', translation:'I am learning French.', definition:'Use this for something you are learning now.', example:'J’apprends le français parce que j’aime apprendre.'},

  {cat:'places', term:'le New Hampshire', translation:'New Hampshire', definition:'A U.S. state. Use “dans le” before New Hampshire in this sentence.', example:'Je suis née dans le New Hampshire.'},
  {cat:'places', term:'la Californie', translation:'California', definition:'A feminine place name in French.', example:'J’habite en Californie.'},
  {cat:'places', term:'Walnut Creek', translation:'Walnut Creek', definition:'City names usually use à.', example:'J’habite à Walnut Creek.'},
  {cat:'places', term:'à', translation:'in / at / to', definition:'Use à before a city.', example:'J’habite à Walnut Creek.'},
  {cat:'places', term:'en', translation:'in / to', definition:'Use en before many feminine countries, states, and regions.', example:'J’habite en Californie.'},

  {cat:'family', term:'ma famille', translation:'my family', definition:'Use ma because famille is feminine.', example:'J’aime ma famille.'},
  {cat:'family', term:'mes amis', translation:'my friends', definition:'Use mes for plural my.', example:'J’aime aider ma famille et mes amis.'},
  {cat:'family', term:'mes enfants', translation:'my children', definition:'A plural family word.', example:'J’ai étudié avec deux enfants.'},
  {cat:'family', term:'réunir la famille', translation:'to bring the family together', definition:'A beautiful phrase for Jane’s desire to reunite the family.', example:'J’aime réunir ma famille.'},
  {cat:'family', term:'aider les autres', translation:'to help others', definition:'A useful verb phrase for generosity.', example:'J’aime aider les autres.'},
  {cat:'family', term:'soutenir', translation:'to support', definition:'Use this for being there for someone.', example:'J’aime soutenir ma famille.'},

  {cat:'qualities', term:'forte', translation:'strong', definition:'Feminine form of fort.', example:'Je suis une femme forte.'},
  {cat:'qualities', term:'généreuse', translation:'generous', definition:'Feminine form of généreux.', example:'Je suis généreuse avec ma famille et mes amis.'},
  {cat:'qualities', term:'courageuse', translation:'courageous', definition:'Feminine form of courageux.', example:'Je suis une femme courageuse.'},
  {cat:'qualities', term:'bienveillante', translation:'kind / caring', definition:'A warm adjective for someone who cares about others.', example:'Je suis une personne bienveillante.'},
  {cat:'qualities', term:'patiente', translation:'patient', definition:'Feminine form of patient.', example:'Je suis patiente avec les autres.'},
  {cat:'qualities', term:'curieuse', translation:'curious / eager to learn', definition:'A positive adjective for someone who likes learning.', example:'Je suis curieuse et j’aime apprendre.'},

  {cat:'work', term:'l’université', translation:'university', definition:'Use à l’université for at university.', example:'J’ai étudié à l’université du New Hampshire.'},
  {cat:'work', term:'un master', translation:'a master’s degree', definition:'A degree after university studies.', example:'J’ai un master en psychologie.'},
  {cat:'work', term:'la psychologie', translation:'psychology', definition:'The field of psychology.', example:'J’ai étudié la psychologie.'},
  {cat:'work', term:'une bijouterie', translation:'a jewelry store', definition:'A shop that sells jewelry.', example:'J’ai travaillé dans une bijouterie.'},
  {cat:'work', term:'des ordinateurs', translation:'computers', definition:'Plural noun. Use des for some / plural.', example:'J’ai vendu des ordinateurs chez Digital.'},
  {cat:'work', term:'une association caritative', translation:'a charity', definition:'An organization that helps people.', example:'J’ai travaillé pour des associations caritatives.'},
  {cat:'work', term:'une médiatrice', translation:'a mediator', definition:'Feminine form of mediator.', example:'J’ai travaillé comme médiatrice pour les tribunaux.'},
  {cat:'work', term:'les tribunaux', translation:'the courts', definition:'Plural noun for courts.', example:'J’ai travaillé avec les tribunaux.'},
  {cat:'work', term:'une présentation', translation:'a presentation', definition:'A talk given to explain something.', example:'J’ai fait des présentations pour des étudiants.'},
  {cat:'work', term:'des techniques d’apprentissage', translation:'learning techniques', definition:'Methods to help people learn.', example:'J’ai présenté des techniques d’apprentissage.'},

  {cat:'verbs', term:'être', translation:'to be', definition:'Use for identity, nationality, profession, and qualities.', example:'Je suis américaine.'},
  {cat:'verbs', term:'avoir', translation:'to have', definition:'Use for possession and many past biography phrases.', example:'J’ai un master en psychologie.'},
  {cat:'verbs', term:'s’appeler', translation:'to be called / to be named', definition:'Use for your name.', example:'Je m’appelle Jane.'},
  {cat:'verbs', term:'habiter', translation:'to live', definition:'Regular -ER verb.', example:'J’habite à Walnut Creek.'},
  {cat:'verbs', term:'aimer', translation:'to like / to love', definition:'Regular -ER verb.', example:'J’aime apprendre.'},
  {cat:'verbs', term:'travailler', translation:'to work', definition:'Regular -ER verb.', example:'Je travaille avec des familles.'},
  {cat:'verbs', term:'choisir', translation:'to choose', definition:'Regular -IR verb.', example:'Je choisis d’apprendre le français.'},
  {cat:'verbs', term:'réunir', translation:'to reunite / bring together', definition:'Regular -IR verb.', example:'Je réunis ma famille.'},
  {cat:'verbs', term:'vendre', translation:'to sell', definition:'Regular -RE verb.', example:'Je vends des ordinateurs.'},
  {cat:'verbs', term:'répondre', translation:'to answer', definition:'Regular -RE verb.', example:'Je réponds avec patience.'},
  {cat:'verbs', term:'apprendre', translation:'to learn', definition:'Important irregular -RE verb.', example:'J’apprends le français.'},
  {cat:'verbs', term:'vouloir', translation:'to want', definition:'Useful irregular verb.', example:'Je veux parler français.'},
  {cat:'verbs', term:'pouvoir', translation:'to be able to / can', definition:'Useful irregular verb.', example:'Je peux parler un peu français.'},

  {cat:'connectors', term:'et', translation:'and', definition:'Connects two similar ideas.', example:'Je suis forte et généreuse.'},
  {cat:'connectors', term:'mais', translation:'but', definition:'Shows a contrast.', example:'Je suis née dans le New Hampshire, mais j’habite en Californie.'},
  {cat:'connectors', term:'puis', translation:'then', definition:'Shows the next step in a story.', example:'J’ai étudié, puis j’ai travaillé.'},
  {cat:'connectors', term:'ensuite', translation:'next / after that', definition:'Another way to sequence events.', example:'Ensuite, j’ai travaillé dans la psychologie.'},
  {cat:'connectors', term:'plus tard', translation:'later', definition:'Useful in a biography timeline.', example:'Plus tard, j’ai travaillé comme médiatrice.'},
  {cat:'connectors', term:'maintenant', translation:'now', definition:'Use for the present moment.', example:'Maintenant, j’habite à Walnut Creek.'},
  {cat:'connectors', term:'aujourd’hui', translation:'today / nowadays', definition:'Use for what is true today.', example:'Aujourd’hui, j’apprends le français.'},
  {cat:'connectors', term:'parce que', translation:'because', definition:'Gives a reason.', example:'J’apprends le français parce que j’aime apprendre.'},
  {cat:'connectors', term:'aussi', translation:'also / too', definition:'Adds another idea.', example:'J’aime aussi aider les autres.'},
  {cat:'connectors', term:'quand', translation:'when', definition:'Introduces a time situation.', example:'Je réunis ma famille quand je peux.'},
  {cat:'connectors', term:'avec', translation:'with', definition:'Shows who or what is together.', example:'Je voyage avec ma famille.'},
  {cat:'connectors', term:'pendant', translation:'during / for', definition:'Use for duration or during an event.', example:'J’ai travaillé pendant plusieurs années.'},

  {cat:'travel', term:'s’il vous plaît', translation:'please', definition:'Formal polite expression.', example:'Une chambre pour deux nuits, s’il vous plaît.'},
  {cat:'travel', term:'merci', translation:'thank you', definition:'Essential polite word.', example:'Merci beaucoup.'},
  {cat:'travel', term:'Je voudrais…', translation:'I would like…', definition:'Polite travel request.', example:'Je voudrais une chambre pour deux nuits.'},
  {cat:'travel', term:'Je peux vous aider ?', translation:'Can I help you?', definition:'A common service question.', example:'Bonjour, je peux vous aider ?'},
  {cat:'travel', term:'une chambre', translation:'a room', definition:'Useful at a hotel.', example:'Je voudrais une chambre.'},
  {cat:'travel', term:'pour deux nuits', translation:'for two nights', definition:'Useful for booking accommodation.', example:'Je voudrais une chambre pour deux nuits.'},
  {cat:'travel', term:'Je voyage avec ma famille.', translation:'I am traveling with my family.', definition:'A simple travel sentence.', example:'Je voyage avec ma famille.'}
];

function showToast(message){
  const toast = $('#toast');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function normalize(str){
  return String(str || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ');
}

function updateScore(isCorrect, key){
  if(!state.attempted.has(key)){
    state.attempted.add(key);
    state.scoreTotal += 1;
    if(isCorrect) state.scoreCorrect += 1;
  } else if(isCorrect && !state.attempted.has(`${key}:correct`)){
    state.scoreCorrect += 1;
  }
  if(isCorrect) state.attempted.add(`${key}:correct`);
  $('#scoreText').textContent = `${state.scoreCorrect} / ${state.scoreTotal}`;
}

function voiceMatchesAccent(voice, accent){
  const lang = (voice.lang || '').toLowerCase();
  const name = (voice.name || '').toLowerCase();
  const isFrench = lang.startsWith('fr') || name.includes('french') || name.includes('français') || name.includes('francais');
  if(accent === 'fr-CA'){
    return lang === 'fr-ca' || lang.startsWith('fr-ca') || name.includes('fr-ca') ||
      (isFrench && (name.includes('canad') || name.includes('québec') || name.includes('quebec') || name.includes('sylvie') || name.includes('caroline') || name.includes('claude')));
  }
  return lang === 'fr-fr' || lang.startsWith('fr-fr') || (isFrench && (name.includes('france') || name.includes('hortense') || name.includes('denise')));
}

function accentLabel(){
  return state.accent === 'fr-CA' ? 'Canadian French' : 'French from France';
}

function updateVoiceStatus(message, mode = ''){
  const status = $('#voiceStatus');
  if(!status) return;
  status.textContent = message;
  status.className = `voice-status ${mode}`.trim();
}

function sortedVoicesForAccent(accent){
  const voices = [...(state.voices || [])];
  const french = voices.filter(v => (v.lang || '').toLowerCase().startsWith('fr') || (v.name || '').toLowerCase().includes('french'));
  const exact = french.filter(v => voiceMatchesAccent(v, accent));
  const otherFrench = french.filter(v => !exact.includes(v));
  return { exact, otherFrench, french };
}

function option(label, value){
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function loadVoices(){
  const select = $('#voiceSelect');
  if(!select) return;
  if(!window.speechSynthesis){
    select.innerHTML = '<option value="">Speech not supported</option>';
    updateVoiceStatus('Speech is not supported on this browser.', 'warn');
    return;
  }

  state.voices = speechSynthesis.getVoices() || [];
  const { exact, otherFrench, french } = sortedVoicesForAccent(state.accent);
  select.innerHTML = '';

  if(!state.voices.length){
    select.appendChild(option('Loading voices… click Test accent once', ''));
    updateVoiceStatus('Voices are still loading. Click “Test accent” after a few seconds.', 'warn');
    return;
  }

  const autoLabel = state.accent === 'fr-CA'
    ? 'Auto — force fr-CA request'
    : 'Auto — force fr-FR request';
  select.appendChild(option(autoLabel, '__auto__'));

  exact.forEach((voice, index) => {
    select.appendChild(option(`${voice.name} (${voice.lang})${index === 0 ? ' — recommended' : ''}`, voice.name));
  });

  if(otherFrench.length){
    const separator = option('— other French fallback voices —', '__separator__');
    separator.disabled = true;
    select.appendChild(separator);
    otherFrench.forEach(voice => select.appendChild(option(`${voice.name} (${voice.lang})`, voice.name)));
  }

  if(!french.length){
    select.appendChild(option('No French voice detected', ''));
    updateVoiceStatus('No French voice was detected on this device. Install a French text-to-speech voice in Windows, then restart Chrome.', 'warn');
    return;
  }

  if(state.selectedVoiceName && [...exact, ...otherFrench].some(v => v.name === state.selectedVoiceName)){
    select.value = state.selectedVoiceName;
  } else if(exact.length){
    state.selectedVoiceName = exact[0].name;
    select.value = state.selectedVoiceName;
  } else {
    state.selectedVoiceName = '__auto__';
    select.value = '__auto__';
  }

  if(exact.length){
    updateVoiceStatus(`${accentLabel()} available: ${exact[0].name} (${exact[0].lang}).`, 'ok');
  } else if(state.accent === 'fr-CA'){
    updateVoiceStatus('Chrome does not currently expose a Canadian French voice to this page. “Auto” requests fr-CA, but the browser may still fall back unless Windows/Chrome lists a fr-CA voice.', 'warn');
  } else {
    updateVoiceStatus('No France voice was detected. “Auto” requests fr-FR; another French voice may be used as fallback.', 'warn');
  }
}

function pickVoice(){
  const chosenName = $('#voiceSelect')?.value || state.selectedVoiceName || '__auto__';
  const exact = state.voices.find(v => voiceMatchesAccent(v, state.accent));
  const chosen = state.voices.find(v => v.name === chosenName);
  const frenchFallback = state.voices.find(v => (v.lang || '').toLowerCase().startsWith('fr') || (v.name || '').toLowerCase().includes('french') || (v.name || '').toLowerCase().includes('français') || (v.name || '').toLowerCase().includes('francais'));

  // If a specific voice is chosen, use it.
  if(chosenName !== '__auto__' && chosen) return chosen;

  // Auto mode: first try the requested regional accent; if it is missing,
  // use any French voice so the lesson still speaks instead of going silent.
  if(exact) return exact;
  return frenchFallback || null;
}

function speak(text){
  if(!text) return;
  if(!window.speechSynthesis){
    showToast('Speech is not supported on this browser.');
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.accent;
  utterance.rate = 0.88;
  utterance.pitch = 1;
  const voice = pickVoice();
  if(voice){
    utterance.voice = voice;
    utterance.lang = voice.lang || state.accent;
  }
  utterance.onerror = () => {
    const fallback = state.voices.find(v => (v.lang || '').toLowerCase().startsWith('fr'));
    if(fallback && fallback !== voice){
      const retry = new SpeechSynthesisUtterance(text);
      retry.voice = fallback;
      retry.lang = fallback.lang;
      retry.rate = 0.88;
      speechSynthesis.speak(retry);
      updateVoiceStatus(`Your browser could not play ${accentLabel()}; it used ${fallback.name} (${fallback.lang}) as a fallback.`, 'warn');
    } else {
      updateVoiceStatus(`Your browser could not play ${accentLabel()}. Use “Check voices” to see what Chrome exposes.`, 'warn');
    }
  };
  speechSynthesis.speak(utterance);
}

function getTextForButton(button){
  if(button.dataset.target){
    return document.getElementById(button.dataset.target)?.textContent || '';
  }
  return button.dataset.say || '';
}

function initSpeechButtons(){
  document.addEventListener('click', e => {
    const button = e.target.closest('.listen-btn');
    if(!button) return;
    e.preventDefault();
    const text = getTextForButton(button).trim();
    if(!text){
      showToast('No text found for this audio button.');
      return;
    }
    loadVoices();
    speak(text);
  });
}


function renderVoiceDebug(){
  const box = $('#voiceDebug');
  if(!box) return;
  loadVoices();
  const voices = state.voices || [];
  const ca = voices.filter(v => voiceMatchesAccent(v, 'fr-CA'));
  const fr = voices.filter(v => (v.lang || '').toLowerCase().startsWith('fr'));
  const rows = voices.map(v => `<li>${escapeAttr(v.name)} — <code>${escapeAttr(v.lang || 'no lang')}</code>${voiceMatchesAccent(v, 'fr-CA') ? ' <span class="good">Canadian match</span>' : ''}</li>`).join('');
  box.innerHTML = `
    <strong>Voice check:</strong> ${voices.length} voice(s) detected by Chrome. ${ca.length ? `<span class="good">Canadian French found.</span>` : `<span class="bad">No Canadian French voice found.</span>`}<br>
    <span>French voices detected: ${fr.length}. For Canada, Chrome needs a voice with <code>fr-CA</code> or a clear Canada/Québec label. Installing French as a browser display language is not always enough.</span>
    <ul>${rows || '<li>No voices detected yet. Click Test accent, wait 5 seconds, then click Check voices again.</li>'}</ul>`;
  box.classList.toggle('hidden');
}

function initVoice(){
  $$('.pill[data-accent]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.accent = btn.dataset.accent;
      state.selectedVoiceName = '';
      $$('.pill[data-accent]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadVoices();
      showToast(state.accent === 'fr-CA' ? 'Canadian French selected.' : 'French from France selected.');
    });
  });
  $('#voiceSelect')?.addEventListener('change', e => {
    state.selectedVoiceName = e.target.value;
    if(state.selectedVoiceName === '__auto__'){
      updateVoiceStatus(`Auto mode: the page will request ${state.accent}.`, 'warn');
    } else {
      const chosen = state.voices.find(v => v.name === state.selectedVoiceName);
      if(chosen){
        updateVoiceStatus(`Voice selected: ${chosen.name} (${chosen.lang}).`, voiceMatchesAccent(chosen, state.accent) ? 'ok' : 'warn');
      }
    }
    showToast('Voice selected.');
  });
  $('#testVoice')?.addEventListener('click', () => {
    loadVoices();
    const line = state.accent === 'fr-CA'
      ? 'Bonjour Jane. Ceci est un test avec l’accent canadien demandé.'
      : 'Bonjour Jane. Ceci est un test avec l’accent de France demandé.';
    speak(line);
  });
  $('#voiceDebugBtn')?.addEventListener('click', renderVoiceDebug);
  $('#pauseAudio')?.addEventListener('click', () => window.speechSynthesis?.pause());
  $('#resumeAudio')?.addEventListener('click', () => window.speechSynthesis?.resume());
  $('#stopAudio')?.addEventListener('click', () => window.speechSynthesis?.cancel());
  if('speechSynthesis' in window){
    speechSynthesis.onvoiceschanged = loadVoices;
    setTimeout(loadVoices, 120);
    setTimeout(loadVoices, 800);
    setTimeout(loadVoices, 1800);
  } else {
    loadVoices();
  }
}

function initScrollPrintReset(){
  $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth', block:'start'});
  }));
  $('#printBtn')?.addEventListener('click', () => window.print());
  $('#resetLesson')?.addEventListener('click', () => {
    window.speechSynthesis?.cancel();
    state.scoreCorrect = 0;
    state.scoreTotal = 0;
    state.attempted.clear();
    $('#scoreText').textContent = '0 / 0';
    $$('input').forEach(input => {
      if(input.type !== 'search' && !['nameInput','bornInput','liveInput','reasonInput'].includes(input.id)){
        input.value = '';
        input.removeAttribute('style');
      }
    });
    $$('textarea').forEach(t => t.value = '');
    $$('.feedback').forEach(f => { f.textContent = ''; f.className = 'feedback'; });
    $$('.model').forEach(m => m.classList.add('hidden'));
    $$('.model-toggle').forEach(b => b.textContent = b.textContent.includes('answer') ? 'Show model answer' : 'Show model');
    showToast('Lesson reset.');
  });
}

function renderCategoryControls(){
  const select = $('#categorySelect');
  const ribbon = $('#categoryRibbon');
  CATEGORIES.forEach(([id, label]) => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = label;
    select.appendChild(option);
  });
  [['all','All'], ...CATEGORIES].forEach(([id, label]) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `category-chip${id === 'all' ? ' active' : ''}`;
    chip.dataset.category = id;
    chip.textContent = label;
    chip.addEventListener('click', () => {
      state.currentCategory = id;
      select.value = id;
      $$('.category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderVocab();
    });
    ribbon.appendChild(chip);
  });
}

function categoryLabel(id){
  if(id === 'all') return 'All';
  return CATEGORIES.find(c => c[0] === id)?.[1] || id;
}

function renderVocab(){
  const grid = $('#vocabGrid');
  const search = normalize(state.currentSearch);
  const filtered = VOCAB.filter(item => {
    const catMatch = state.currentCategory === 'all' || item.cat === state.currentCategory;
    const searchBlob = normalize(`${item.term} ${item.translation} ${item.definition} ${item.example} ${categoryLabel(item.cat)}`);
    return catMatch && (!search || searchBlob.includes(search));
  });
  grid.innerHTML = '';
  if(!filtered.length){
    grid.innerHTML = '<p class="soft">No vocabulary found. Try another category or clear the search.</p>';
    return;
  }
  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'vocab-card';
    card.dataset.cat = item.cat;
    card.innerHTML = `
      <span class="cat">${categoryLabel(item.cat)}</span>
      <h3>${item.term}</h3>
      <p class="translation"><strong>English:</strong> ${item.translation}</p>
      <p class="definition"><strong>Definition:</strong> ${item.definition}</p>
      <div class="example"><strong>Example:</strong><br><span class="fr">${item.example}</span></div>
      <button class="listen-btn small" type="button" data-say="${escapeAttr(item.example)}">🔊 Listen</button>`;
    grid.appendChild(card);
  });
}

function escapeAttr(str){
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function initVocab(){
  renderCategoryControls();
  renderVocab();
  $('#categorySelect')?.addEventListener('change', e => {
    state.currentCategory = e.target.value;
    $$('.category-chip').forEach(c => c.classList.toggle('active', c.dataset.category === state.currentCategory));
    renderVocab();
  });
  $('#vocabSearch')?.addEventListener('input', e => {
    state.currentSearch = e.target.value;
    renderVocab();
  });
  $('#clearVocab')?.addEventListener('click', () => {
    state.currentCategory = 'all';
    state.currentSearch = '';
    $('#categorySelect').value = 'all';
    $('#vocabSearch').value = '';
    $$('.category-chip').forEach(c => c.classList.toggle('active', c.dataset.category === 'all'));
    renderVocab();
  });
  $('#listenVisibleVocab')?.addEventListener('click', () => {
    const cards = $$('.vocab-card').slice(0, 12);
    const text = cards.map(card => card.querySelector('.fr')?.textContent || card.querySelector('h3')?.textContent || '').filter(Boolean).join('. ');
    speak(text);
  });
}

function initTabs(){
  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab)?.classList.add('active');
  }));
}

function initQuiz(){
  $$('.quiz-item').forEach((item, index) => {
    $$('button[data-choice]', item).forEach(btn => btn.addEventListener('click', () => {
      $$('button[data-choice]', item).forEach(b => b.classList.remove('correct-choice','wrong-choice'));
      const ok = normalize(btn.dataset.choice) === normalize(item.dataset.answer);
      btn.classList.add(ok ? 'correct-choice' : 'wrong-choice');
      const feedback = $('.feedback', item);
      feedback.textContent = ok ? 'Correct! Très bien ❤' : `Almost. The best answer is: ${item.dataset.answer}`;
      feedback.className = `feedback ${ok ? 'correct' : 'wrong'}`;
      updateScore(ok, `quiz-${index}`);
      if(ok) speak(item.dataset.answer);
    }));
  });
}

function checkBlankGroup(panelId){
  const panel = document.getElementById(panelId);
  const inputs = $$('input[data-answer]', panel);
  let correct = 0;
  inputs.forEach((input, i) => {
    const ok = normalize(input.value) === normalize(input.dataset.answer);
    input.style.borderColor = ok ? '#17633d' : '#b31935';
    input.style.background = ok ? '#eefaf3' : '#fff2f4';
    if(ok) correct++;
    updateScore(ok, `${panelId}-blank-${i}`);
  });
  const feedback = $('.group-feedback', panel);
  feedback.textContent = correct === inputs.length ? 'Perfect! Excellent work.' : `${correct}/${inputs.length} correct. Try again or use the hint.`;
  feedback.className = `feedback ${correct === inputs.length ? 'correct' : 'wrong'}`;
}

function resetBlankGroup(panelId){
  const panel = document.getElementById(panelId);
  $$('input[data-answer]', panel).forEach(input => { input.value = ''; input.removeAttribute('style'); });
  const feedback = $('.group-feedback', panel);
  if(feedback){ feedback.textContent = ''; feedback.className = 'feedback group-feedback'; }
}

function initBlanks(){
  $$('.check-blanks').forEach(btn => btn.addEventListener('click', () => checkBlankGroup(btn.dataset.group)));
  $$('.reset-blanks').forEach(btn => btn.addEventListener('click', () => resetBlankGroup(btn.dataset.group)));
}

function shuffle(array){
  const copy = [...array];
  for(let i = copy.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setupSentenceBuilder(){
  const target = $('#builderSelect').value;
  const words = target.split(' ');
  const bank = $('#wordBank');
  const drop = $('#sentenceDrop');
  bank.innerHTML = '';
  drop.innerHTML = '';
  shuffle(words).forEach(word => addWordButton(word, bank));
  $('#sentenceFeedback').textContent = '';
  $('#sentenceFeedback').className = 'feedback';
}

function addWordButton(word, container){
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = word;
  btn.addEventListener('click', () => {
    if(container.id === 'wordBank'){
      btn.remove();
      addWordButton(word, $('#sentenceDrop'));
      $('#sentenceDrop button:last-child').classList.add('sentence-token');
    } else {
      btn.remove();
      addWordButton(word, $('#wordBank'));
    }
  });
  if(container.id === 'sentenceDrop') btn.className = 'sentence-token';
  container.appendChild(btn);
}

function initSentenceBuilder(){
  $('#builderSelect')?.addEventListener('change', setupSentenceBuilder);
  $('#resetSentence')?.addEventListener('click', setupSentenceBuilder);
  $('#checkSentence')?.addEventListener('click', () => {
    const answer = $$('#sentenceDrop button').map(b => b.textContent).join(' ');
    const expected = $('#builderSelect').value;
    const ok = normalize(answer) === normalize(expected);
    const feedback = $('#sentenceFeedback');
    feedback.textContent = ok ? `Excellent! ${expected}.` : 'Not yet. Use the model or try again.';
    feedback.className = `feedback ${ok ? 'correct' : 'wrong'}`;
    updateScore(ok, `builder-${expected}`);
    if(ok) speak(expected);
  });
  $('#modelSentence')?.addEventListener('click', () => {
    const expected = $('#builderSelect').value;
    $('#sentenceFeedback').textContent = `Model: ${expected}.`;
    $('#sentenceFeedback').className = 'feedback correct';
    speak(expected);
  });
  setupSentenceBuilder();
}

function initHintsAndModels(){
  document.addEventListener('click', e => {
    const hint = e.target.closest('.hint-btn');
    if(hint){
      showToast(hint.dataset.hint || 'Try again. You can do this!');
      return;
    }
    const toggle = e.target.closest('.model-toggle');
    if(toggle){
      const card = toggle.closest('.timeline-card, .dialogue-card');
      const model = card ? $('.model', card) : null;
      if(model){
        const hidden = model.classList.toggle('hidden');
        const answerButton = toggle.textContent.includes('answer');
        toggle.textContent = hidden ? (answerButton ? 'Show model answer' : 'Show model') : 'Hide model';
      }
    }
  });
}

function initIntroBuilder(){
  $('#generateIntro')?.addEventListener('click', () => {
    const name = $('#nameInput').value.trim() || 'Jane';
    const born = $('#bornInput').value.trim() || '1955 dans le New Hampshire';
    const live = $('#liveInput').value.trim() || 'Walnut Creek, en Californie';
    const q1 = $('#quality1').value;
    const q2 = $('#quality2').value;
    const connector = $('#connectorInput').value;
    const career = $('#careerInput')?.value.trim() || 'j’ai travaillé dans plusieurs domaines';
    const reason = $('#reasonInput').value.trim() || 'j’aime apprendre';
    const connectorStart = connector.charAt(0).toUpperCase() + connector.slice(1);
    const text = `Bonjour, je m’appelle ${name}. Je suis née en ${born}. Maintenant, j’habite à ${live}. Je suis ${q1} et ${q2}. ${connectorStart}, ${career}. Aujourd’hui, j’apprends le français parce que ${reason}.`;
    $('#generatedIntro').textContent = text;
    showToast('Your French introduction is ready.');
  });
  $('#copyIntro')?.addEventListener('click', async () => {
    const text = $('#generatedIntro').textContent;
    try{
      await navigator.clipboard.writeText(text);
      $('#copyFeedback').textContent = 'Copied!';
      $('#copyFeedback').className = 'feedback correct';
    }catch(err){
      $('#copyFeedback').textContent = 'Copy not available on this browser. Select the text manually.';
      $('#copyFeedback').className = 'feedback wrong';
    }
  });
}

function init(){
  initVoice();
  initSpeechButtons();
  initScrollPrintReset();
  initVocab();
  initTabs();
  initQuiz();
  initBlanks();
  initSentenceBuilder();
  initHintsAndModels();
  initIntroBuilder();
}

document.addEventListener('DOMContentLoaded', init);
