const $ = (id) => document.getElementById(id);
let scoreMap = {};
let selectedVoiceLang = 'en-GB';
let translationsVisible = false;
let selectedSortWord = null;
let roleplayStepIndex = 0;

const destinations = [
  {name:'London', area:'England · capital city', text:'London is a lively and multicultural city. You can visit museums, royal palaces, markets and famous landmarks like Big Ben and Tower Bridge. The weather is often cloudy or rainy, but the city is exciting and full of history.', activities:['visit museums','take a river cruise','go shopping','see a musical'], weather:['cloudy','rainy','mild'], adjectives:['lively','crowded','historic','exciting'], time:['for three days','next week','in spring'], transport:['plane','train','Underground','taxi','bus'], icon:'🏙️'},
  {name:'Bath', area:'England · elegant spa city', text:'Bath is a calm and elegant city famous for its Roman baths and beautiful architecture. It is perfect for relaxing walks, quiet cafés and a gentle cultural holiday.', activities:['visit the Roman baths','drink tea','walk through the city','take photos'], weather:['mild','cloudy','sunny'], adjectives:['peaceful','elegant','relaxing','charming'], time:['for a weekend','on Monday','in May'], transport:['train','taxi','walking'], icon:'🏛️'},
  {name:'Edinburgh', area:'Scotland · historic city', text:'Edinburgh is a historic Scottish city with castles, hills and traditional culture. The weather can be windy and cool, but the city is impressive and beautiful.', activities:['visit Edinburgh Castle','walk in the old town','discover Scottish culture','hike'], weather:['windy','cool','chilly'], adjectives:['historic','traditional','impressive','beautiful'], time:['for four days','during my holiday','in July'], transport:['plane','train','bus','taxi'], icon:'🏰'},
  {name:'Cornwall', area:'England · coast and villages', text:'Cornwall is famous for its beautiful coastline, beaches and fishing villages. It is an excellent destination for nature lovers and travellers who want a peaceful atmosphere.', activities:['walk along the coast','visit beaches','take photos','eat in a small restaurant'], weather:['windy','sunny','mild'], adjectives:['coastal','peaceful','beautiful','relaxing'], time:['for one week','in summer','next month'], transport:['train','bus','ferry','taxi'], icon:'🌊'},
  {name:'York', area:'England · medieval city', text:'York is a charming historic city with old streets, tea rooms and a famous cathedral. It is a good choice if you like culture, history and a calm atmosphere.', activities:['visit York Minster','walk on the city walls','drink tea','visit museums'], weather:['cloudy','chilly','mild'], adjectives:['historic','charming','quiet','interesting'], time:['for two days','on Tuesday','in autumn'], transport:['train','coach','walking','taxi'], icon:'⛪'},
  {name:'Oxford', area:'England · university city', text:'Oxford is a beautiful university city with colleges, gardens and bookshops. It is perfect for a cultural day trip or a calm weekend.', activities:['visit colleges','walk in gardens','go to a bookshop','take a guided tour'], weather:['mild','rainy','sunny'], adjectives:['elegant','academic','peaceful','beautiful'], time:['for one day','next weekend','in June'], transport:['train','coach','bus','taxi'], icon:'📚'}
];

const vocab = [
  {cat:'transport', icon:'⛴️', en:'ferry', fr:'ferry / bateau', def:'a boat that carries people or cars across water', ex:'I would like to travel by ferry.'},
  {cat:'transport', icon:'🚆', en:'train', fr:'train', def:'transport that travels on rails', ex:'The train to Bath is comfortable.'},
  {cat:'transport', icon:'🚌', en:'coach', fr:'car longue distance', def:'a comfortable bus for long journeys', ex:'Could I take a coach to Oxford?'},
  {cat:'transport', icon:'🎫', en:'return ticket', fr:'billet aller-retour', def:'a ticket to go and come back', ex:'I would like a return ticket, please.'},
  {cat:'transport', icon:'🧳', en:'suitcase', fr:'valise', def:'a bag for clothes when you travel', ex:'I have one small suitcase.'},
  {cat:'transport', icon:'🚉', en:'platform', fr:'quai', def:'the place where you wait for a train', ex:'Which platform is the train on?'},
  {cat:'weather', icon:'☁️', en:'cloudy', fr:'nuageux', def:'with many clouds in the sky', ex:'It is cloudy in London today.'},
  {cat:'weather', icon:'🌬️', en:'windy', fr:'venteux', def:'with a lot of wind', ex:'Edinburgh can be windy.'},
  {cat:'weather', icon:'🌧️', en:'rainy', fr:'pluvieux', def:'with rain', ex:'I need an umbrella because it is rainy.'},
  {cat:'weather', icon:'🌤️', en:'mild', fr:'doux', def:'not very hot and not very cold', ex:'The weather is mild in spring.'},
  {cat:'adjective', icon:'🌿', en:'peaceful', fr:'paisible', def:'calm and quiet', ex:'I would like a peaceful destination.'},
  {cat:'adjective', icon:'✨', en:'elegant', fr:'élégant', def:'beautiful and refined', ex:'Bath is an elegant city.'},
  {cat:'adjective', icon:'🎭', en:'lively', fr:'animé', def:'full of life and activity', ex:'London is lively.'},
  {cat:'adjective', icon:'🧘', en:'relaxing', fr:'reposant', def:'making you feel calm', ex:'Cornwall is relaxing.'},
  {cat:'time', icon:'📅', en:'next week', fr:'la semaine prochaine', def:'the week after this week', ex:'I would like to travel next week.'},
  {cat:'time', icon:'🗓️', en:'for three days', fr:'pendant trois jours', def:'a duration of three days', ex:'I would like to stay for three days.'},
  {cat:'time', icon:'☀️', en:'in July', fr:'en juillet', def:'during the month of July', ex:'I would like to visit the UK in July.'},
  {cat:'expression', icon:'🤝', en:'Could you recommend...?', fr:'Pourriez-vous recommander... ?', def:'a polite way to ask for advice', ex:'Could you recommend a peaceful destination?'},
  {cat:'expression', icon:'💬', en:'I would like some information about...', fr:'Je voudrais des renseignements sur...', def:'a polite way to ask for information', ex:'I would like some information about ferry tickets.'},
  {cat:'expression', icon:'🙏', en:'Would it be possible to...?', fr:'Serait-il possible de... ?', def:'a very polite question form', ex:'Would it be possible to travel by train?'}
];

const dropdownQs = [
  ['I ___ like to visit Cornwall.', 'would', ['would','am','do']],
  ['___ you like a return ticket?', 'Would', ['Would','Do','Are']],
  ['There ___ many museums in London.', 'are', ['is','are','do']],
  ['Bath ___ elegant and peaceful.', 'is', ['is','are','do']],
  ['I would like ___ travel by train.', 'to', ['to','for','at']],
  ['Could you ___ a quiet destination?', 'recommend', ['recommend','recommends','recommended']]
];
const ciQs = [
  ['I would like to visit London.', 'correct'],
  ['I would like visit Bath.', 'incorrect'],
  ['There are many museums.', 'correct'],
  ['There is many castles.', 'incorrect'],
  ['Could you recommend a hotel?', 'correct']
];
const sortQs = [
  ['ferry','transport'], ['rainy','weather'], ['peaceful','adjective'], ['next week','time'], ['Could you recommend...?','expression'], ['train','transport'], ['mild','weather'], ['elegant','adjective']
];
const matchQs = [
  ['ferry','bateau / ferry'], ['return ticket','billet aller-retour'], ['peaceful','paisible'], ['cloudy','nuageux'], ['Could you recommend...?','Pourriez-vous recommander...?']
];

function speak(text){
  if(!('speechSynthesis' in window)) return alert('Speech synthesis is not available in this browser.');
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = selectedVoiceLang;
  utter.rate = 0.82;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang === selectedVoiceLang) || voices.find(v => v.lang.startsWith(selectedVoiceLang.split('-')[0]));
  if(voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

function escapeAttr(text){ return String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'); }

function renderDestinations(filter='all'){
  $('destinationGrid').innerHTML = destinations.map(d => {
    const selected = filter === 'all' ? [d.area, ...d.activities, ...d.weather, ...d.adjectives, ...d.time, ...d.transport] :
      filter === 'area' ? [d.area] : d[filter] || [];
    return `<article class="destination-card"><h3>${d.icon} ${d.name}</h3><p>${d.text}</p><div class="tag-row">${selected.map(x=>`<span class="tag">${x}</span>`).join('')}</div><button class="listen" data-speak="${escapeAttr(d.text)}">Listen to text</button></article>`;
  }).join('');
}
function renderVocab(filter='all'){
  $('vocabGrid').innerHTML = vocab.filter(v => filter==='all' || v.cat===filter).map(v => `<article class="vocab-card"><div class="icon">${v.icon}</div><div><h3>${v.en}</h3><p class="translation">${v.fr}</p><p><strong>Definition:</strong> ${v.def}</p><p><strong>Example:</strong> ${v.ex}</p><button class="listen" data-speak="${escapeAttr(v.en + '. ' + v.ex)}">Listen</button></div></article>`).join('');
}

function setFieldState(el, ok){
  el.classList.remove('right','wrong');
  if(ok === true) el.classList.add('right');
  if(ok === false) el.classList.add('wrong');
}
function instantMessage(container, msg, ok){
  let fb = container.querySelector('.instant-feedback');
  if(!fb){ fb = document.createElement('span'); fb.className = 'instant-feedback'; container.appendChild(fb); }
  fb.textContent = msg;
  fb.classList.toggle('good', !!ok);
  fb.classList.toggle('bad', !ok);
}
function renderExercises(){
  $('grammarDropdowns').innerHTML = dropdownQs.map((q,i)=>`<div class="question-row instant-row"><label>${i+1}. ${q[0]}</label><select data-dd="${i}"><option value="">Choose...</option>${q[2].map(o=>`<option>${o}</option>`).join('')}</select></div>`).join('');
  const words = ['return','please','I','ticket','would','a','like'];
  $('wordBank').innerHTML = words.map(w=>`<button type="button" class="word" data-word="${w}">${w}</button>`).join('');
  $('answerLine').innerHTML = '<span class="placeholder">Build your sentence here: I ...</span>';
  $('correctIncorrect').innerHTML = ciQs.map((q,i)=>`<div class="question-row instant-row"><label>${i+1}. ${q[0]}</label><select data-ci="${i}"><option value="">Choose...</option><option value="correct">Correct</option><option value="incorrect">Incorrect</option></select></div>`).join('');
  renderCategorySort();
  $('matching').innerHTML = matchQs.map((q,i)=>`<div class="question-row instant-row"><label>${i+1}. ${q[0]}</label><select data-match="${i}"><option value="">Choose...</option>${matchQs.map(m=>`<option>${m[1]}</option>`).join('')}</select></div>`).join('');
}

function renderCategorySort(){
  const words = sortQs.map(([word,cat])=>`<button type="button" class="drag-word" draggable="true" data-sort-word="${escapeAttr(word)}" data-answer="${cat}">${word}</button>`).join('');
  const cats = ['transport','weather','adjective','time','expression'].map(cat=>`<div class="drop-zone" data-drop="${cat}"><h4>${cat}</h4><div class="drop-inner"></div></div>`).join('');
  $('categorySort').innerHTML = `<div class="sort-bank"><h4>Words to sort</h4>${words}</div><div class="drop-grid">${cats}</div>`;
}

function updateScore(name, got, total){
  scoreMap[name] = {got,total};
  $('globalScore').textContent = Object.values(scoreMap).reduce((a,b)=>a+b.got,0);
  $('globalTotal').textContent = Object.values(scoreMap).reduce((a,b)=>a+b.total,0);
}
function feedback(id, got, total){
  const el = $(`feedback-${id}`);
  if(!el) return;
  el.textContent = `${got}/${total} correct.`;
  el.className = `feedback ${got===total?'good':'bad'}`;
  updateScore(id, got, total);
}

function renderDialogue(){
  const lines = [
    ['Travel agent','Good morning. How can I help you today?','Bonjour. Comment puis-je vous aider aujourd’hui ?'],
    ['You','Good morning. I would like to plan a trip to the United Kingdom.','Bonjour. Je voudrais organiser un voyage au Royaume-Uni.'],
    ['Travel agent','Of course. What type of destination would you prefer?','Bien sûr. Quel type de destination préféreriez-vous ?'],
    ['You','I would like a peaceful place, but I also enjoy history.','Je voudrais un endroit paisible, mais j’aime aussi l’histoire.'],
    ['Travel agent','Bath could be an excellent choice. It is elegant, historic and relaxing.','Bath pourrait être un excellent choix. C’est élégant, historique et reposant.'],
    ['You','That sounds lovely. Could you tell me the best way to travel there?','Cela semble très agréable. Pourriez-vous me dire la meilleure façon d’y aller ?'],
    ['Travel agent','You can travel by plane to London, then take a train to Bath.','Vous pouvez voyager en avion jusqu’à Londres, puis prendre un train pour Bath.'],
    ['You','Thank you. I would like some information about train tickets, please.','Merci. Je voudrais des informations sur les billets de train, s’il vous plaît.']
  ];
  $('dialogueBox').className = translationsVisible ? 'show-fr' : '';
  $('dialogueBox').innerHTML = lines.map(l=>`<div class="dialogue-line"><div class="speaker">${l[0]}</div><div><p>${l[1]}</p><p class="fr">${l[2]}</p><button class="listen" data-speak="${escapeAttr(l[1])}">Listen</button></div></div>`).join('');
}

function roleplayData(){
  const dest = $('rpDestination')?.value || 'Bath';
  const transport = $('rpTransport')?.value || 'by train';
  const activity = $('rpActivity')?.value || 'visit museums';
  return [
    {agent:'Good morning. How can I help you today?', prompt:'Say that you would like to plan a trip to the United Kingdom.', model:`Good morning. I would like to plan a trip to the United Kingdom, please.`},
    {agent:'What type of destination would you prefer?', prompt:'Say what kind of destination you would like.', model:`I would like to visit ${dest}. I would like a peaceful and interesting destination.`},
    {agent:'How would you like to travel?', prompt:'Say your transport choice.', model:`I would like to travel ${transport}, please.`},
    {agent:'What would you like to do during your holiday?', prompt:'Say the activity you would like to do.', model:`During my holiday, I would like to ${activity}.`},
    {agent:'Would you like more information about tickets and schedules?', prompt:'Ask politely for information.', model:`Yes, please. I would like some information about tickets and schedules.`}
  ];
}
function renderRoleplay(){
  const steps = roleplayData();
  $('roleplaySteps').innerHTML = steps.map((s,i)=>`
    <article class="role-step ${i===roleplayStepIndex?'active':'locked'}" data-step="${i}">
      <h3>Step ${i+1}</h3>
      <div class="agent-line"><strong>Travel agent:</strong> ${s.agent}<button class="listen mini" data-speak="${escapeAttr(s.agent)}">Listen</button></div>
      <button class="small-btn show-prompt" data-show-prompt="${i}">${i <= roleplayStepIndex ? '1) Show your task' : 'Locked'}</button>
      <div class="prompt-box ${i <= roleplayStepIndex ? '' : 'hidden'}" id="prompt-${i}"><strong>Your task:</strong> ${s.prompt}<button class="listen mini" data-speak="${escapeAttr(s.prompt)}">Listen</button></div>
      <button class="small-btn show-model" data-show-model="${i}" ${i > roleplayStepIndex ? 'disabled' : ''}>2) Show model answer</button>
      <div class="model-box hidden" id="model-${i}"><strong>Model answer:</strong> ${s.model}<button class="listen mini" data-speak="${escapeAttr(s.model)}">Listen</button></div>
      ${i===roleplayStepIndex ? '<button class="btn primary next-role-step" data-next-step="'+i+'">Next step</button>' : ''}
    </article>`).join('');
}

function startTimer(){
  let seconds = 45; $('timer').textContent = '00:45';
  clearInterval(window.lessonTimer);
  window.lessonTimer = setInterval(()=>{ seconds--; $('timer').textContent = `00:${String(seconds).padStart(2,'0')}`; if(seconds<=0){clearInterval(window.lessonTimer); speak('Well done. Time is finished.');}},1000);
}

function checkExercise(id){
  let got=0,total=0;
  if(id==='grammarDropdowns'){
    total=dropdownQs.length;
    dropdownQs.forEach((q,i)=>{ const el=document.querySelector(`[data-dd="${i}"]`); if(el.value===q[1]) got++; });
  }
  if(id==='sentenceBuilder'){
    total=1;
    const ans=[...$('answerLine').querySelectorAll('.word')].map(w=>w.dataset.word).join(' ');
    got = ans === 'I would like a return ticket please' ? 1 : 0;
    feedback(id, got, total);
    if(got) speak('Excellent. I would like a return ticket, please.');
    return;
  }
  if(id==='correctIncorrect'){
    total=ciQs.length; ciQs.forEach((q,i)=>{ if(document.querySelector(`[data-ci="${i}"]`).value===q[1]) got++; });
  }
  if(id==='categorySort'){
    total=sortQs.length;
    document.querySelectorAll('.drop-zone .drag-word').forEach(w=>{ if(w.dataset.answer===w.closest('.drop-zone').dataset.drop) got++; });
  }
  if(id==='matching'){
    total=matchQs.length; matchQs.forEach((q,i)=>{ if(document.querySelector(`[data-match="${i}"]`).value===q[1]) got++; });
  }
  feedback(id, got, total);
}

function checkInstantSelect(el){
  const row = el.closest('.instant-row');
  let ok = null;
  if(el.dataset.dd !== undefined) ok = el.value === dropdownQs[Number(el.dataset.dd)][1];
  if(el.dataset.ci !== undefined) ok = el.value === ciQs[Number(el.dataset.ci)][1];
  if(el.dataset.match !== undefined) ok = el.value === matchQs[Number(el.dataset.match)][1];
  if(!el.value){ setFieldState(el, null); return; }
  setFieldState(el, ok);
  instantMessage(row, ok ? '✓ Correct' : '✗ Try again', ok);
}

function moveSortWord(word, zone){
  zone.querySelector('.drop-inner').appendChild(word);
  word.classList.remove('selected','right','wrong');
  selectedSortWord = null;
  const ok = word.dataset.answer === zone.dataset.drop;
  word.classList.add(ok ? 'right' : 'wrong');
  word.setAttribute('aria-label', `${word.textContent}: ${ok ? 'correct' : 'try again'}`);
}

function init(){
  renderDestinations(); renderVocab(); renderExercises(); renderDialogue(); renderRoleplay();
  document.addEventListener('click', e => {
    if(e.target.matches('.listen')) speak(e.target.dataset.speak || e.target.textContent);
    if(e.target.matches('[data-filter]')) { document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active')); e.target.classList.add('active'); renderDestinations(e.target.dataset.filter); }
    if(e.target.matches('[data-vocab-filter]')) { document.querySelectorAll('[data-vocab-filter]').forEach(b=>b.classList.remove('active')); e.target.classList.add('active'); renderVocab(e.target.dataset.vocabFilter); }
    if(e.target.matches('[data-tab]')) { document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active')); e.target.classList.add('active'); $(`tab-${e.target.dataset.tab}`).classList.add('active'); }
    if(e.target.matches('#wordBank .word')) {
      const clone = e.target.cloneNode(true);
      const ph = $('answerLine').querySelector('.placeholder'); if(ph) ph.remove();
      $('answerLine').appendChild(clone);
      const current = [...$('answerLine').querySelectorAll('.word')].map(w=>w.dataset.word).join(' ');
      const target = 'I would like a return ticket please';
      if(current === target) { feedback('sentenceBuilder', 1, 1); $('feedback-sentenceBuilder').textContent = '✓ Correct immediately!'; }
      else { $('feedback-sentenceBuilder').textContent = current ? 'Keep going...' : ''; $('feedback-sentenceBuilder').className = 'feedback'; }
    }
    if(e.target.matches('#answerLine .word')) { e.target.remove(); if(!$('answerLine').querySelector('.word')) $('answerLine').innerHTML='<span class="placeholder">Build your sentence here: I ...</span>'; }
    if(e.target.matches('[data-check]')) checkExercise(e.target.dataset.check);
    if(e.target.matches('.drag-word')) { document.querySelectorAll('.drag-word').forEach(w=>w.classList.remove('selected')); selectedSortWord = e.target; e.target.classList.add('selected'); }
    if(e.target.closest('.drop-zone') && selectedSortWord) moveSortWord(selectedSortWord, e.target.closest('.drop-zone'));
    if(e.target.matches('[data-show-prompt]')) { const box=$(`prompt-${e.target.dataset.showPrompt}`); box?.classList.toggle('hidden'); }
    if(e.target.matches('[data-show-model]')) { const box=$(`model-${e.target.dataset.showModel}`); box?.classList.toggle('hidden'); }
    if(e.target.matches('.next-role-step')) { roleplayStepIndex = Math.min(roleplayStepIndex + 1, roleplayData().length-1); renderRoleplay(); }
  });
  document.addEventListener('change', e => { if(e.target.matches('select[data-dd], select[data-ci], select[data-match]')) checkInstantSelect(e.target); });
  document.addEventListener('dragstart', e => { if(e.target.matches('.drag-word')) e.dataTransfer.setData('text/plain', e.target.dataset.sortWord); });
  document.addEventListener('dragover', e => { if(e.target.closest('.drop-zone')) e.preventDefault(); });
  document.addEventListener('drop', e => {
    const zone = e.target.closest('.drop-zone'); if(!zone) return; e.preventDefault();
    const word = [...document.querySelectorAll('.drag-word')].find(w=>w.dataset.sortWord===e.dataTransfer.getData('text/plain'));
    if(word) moveSortWord(word, zone);
  });
  $('voiceSelect').addEventListener('change', e=> selectedVoiceLang=e.target.value);
  $('stopSpeech').addEventListener('click', ()=>speechSynthesis.cancel());
  $('clearSentence').addEventListener('click', ()=>{ $('wordBank').innerHTML = ['return','please','I','ticket','would','a','like'].map(w=>`<button type="button" class="word" data-word="${w}">${w}</button>`).join(''); $('answerLine').innerHTML='<span class="placeholder">Build your sentence here: I ...</span>'; $('feedback-sentenceBuilder').textContent=''; });
  $('toggleTranslations').addEventListener('click', ()=>{ translationsVisible=!translationsVisible; renderDialogue(); });
  $('rpDestination').addEventListener('change', renderRoleplay);
  $('rpTransport').addEventListener('change', renderRoleplay);
  $('rpActivity').addEventListener('change', renderRoleplay);
  $('resetRoleplay').addEventListener('click', ()=>{ roleplayStepIndex=0; renderRoleplay(); });
  $('listenFinal').addEventListener('click', () => speak($('finalWriting').value || 'Please write your travel plan first.'));
  $('startTimer').addEventListener('click', startTimer);
  $('resetTimer').addEventListener('click', ()=>{clearInterval(window.lessonTimer); $('timer').textContent='00:45';});
  $('resetAll').addEventListener('click', ()=>{ scoreMap={}; $('globalScore').textContent='0'; $('globalTotal').textContent='0'; renderExercises(); document.querySelectorAll('.feedback').forEach(f=>f.textContent=''); });
}

window.speechSynthesis?.addEventListener?.('voiceschanged', ()=>{});
document.addEventListener('DOMContentLoaded', init);
