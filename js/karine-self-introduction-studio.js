const state = {
  voice: 'US',
  autoAudio: false,
  scoreCorrect: 0,
  scoreTotal: 0,
  currentMcq: null,
  currentFill: null,
  selectedSortChip: null,
  roleplayScenarioKey: null,
  roleplayIndex: 0,
  selfBuilderSelected: []
};

const vocabData = {
  identity: [
    {icon:'👤', word:'name', def:'the word people use to identify you', fr:'nom / prénom', ex:'My name is Karine.'},
    {icon:'📍', word:'live', def:'to have your home in a place', fr:'habiter', ex:'I live in Saint-Gilles-Croix-de-Vie.'},
    {icon:'🕰️', word:'for sixty years', def:'the length of time', fr:'depuis soixante ans', ex:'I have lived here for sixty years.'},
    {icon:'💍', word:'married', def:'having a husband or wife', fr:'mariée', ex:'I am married.'}
  ],
  family: [
    {icon:'👨', word:'husband', def:'the man you are married to', fr:'mari', ex:'My husband is a hairdresser.'},
    {icon:'✂️', word:'hairdresser', def:'a person who cuts and styles hair', fr:'coiffeur', ex:'He is a hairdresser.'},
    {icon:'🏪', word:'salon', def:'a hair shop', fr:'salon de coiffure', ex:'He has a salon in Saint-Gilles.'},
    {icon:'👩', word:'daughter', def:'your girl child', fr:'fille', ex:'We have one daughter.'}
  ],
  home: [
    {icon:'🏠', word:'home', def:'the place where you live', fr:'maison / chez soi', ex:'We have a home in Saint-Gilles.'},
    {icon:'🌊', word:'Saint-Gilles-Croix-de-Vie', def:'the town where she lives', fr:'Saint-Gilles-Croix-de-Vie', ex:'I was born and raised in Saint-Gilles-Croix-de-Vie.'},
    {icon:'🏙️', word:'Paris', def:'the capital city of France', fr:'Paris', ex:'My daughter lives in Paris.'},
    {icon:'🌱', word:'born and raised', def:'from your birth to growing up in a place', fr:'née et élevée', ex:'I was born and raised here.'}
  ],
  hobbies: [
    {icon:'🧘', word:'yoga', def:'a calm physical activity with movement and breathing', fr:'yoga', ex:'I enjoy yoga.'},
    {icon:'💃', word:'dance', def:'moving your body to music', fr:'danse', ex:'I enjoy dance.'},
    {icon:'🏖️', word:'go to the beach', def:'spend time at the seaside', fr:'aller à la plage', ex:'I like going to the beach.'},
    {icon:'🏄', word:'surfer', def:'a person who practises surfing', fr:'surfeur', ex:'My husband is also a surfer.'}
  ],
  greetings: [
    {icon:'👋', word:'Hello', def:'a neutral greeting', fr:'Bonjour / salut', ex:'Hello, nice to meet you.'},
    {icon:'🌞', word:'Good morning', def:'a polite greeting before noon', fr:'Bonjour le matin', ex:'Good morning. How are you?'},
    {icon:'😊', word:'Hi', def:'a friendly casual greeting', fr:'Salut', ex:'Hi, how are you?'},
    {icon:'🙏', word:'Excuse me', def:'a polite way to begin', fr:'Excusez-moi', ex:'Excuse me, do you live here?'},
    {icon:'🌙', word:'Good evening', def:'a polite greeting in the evening', fr:'Bonsoir', ex:'Good evening. How are you?'}
  ]
};

const mcqData = [
  {prompt:'Choose the best sentence.', options:['I am married.','I am marry.','I married am.'], answer:'I am married.', hint:'Use “I am + adjective”.'},
  {prompt:'Choose the best question to ask back.', options:['What about you?','You where live?','You are married? why'], answer:'What about you?', hint:'Use a simple natural phrase.'},
  {prompt:'Which is correct?', options:['My husband is a hairdresser.','My husband a hairdresser.','My husband is hairdresser a.'], answer:'My husband is a hairdresser.', hint:'Subject + be + article + noun.'},
  {prompt:'Choose the most polite greeting for a new person.', options:['Hey!','Good morning.','Yo!'], answer:'Good morning.', hint:'Start politely with new people.'},
  {prompt:'Choose the best response.', options:['I’m fine, thank you. And you?','Weather blue yes.','I am husband.'], answer:'I’m fine, thank you. And you?', hint:'Keep the answer short and polite.'},
  {prompt:'Which sentence is correct?', options:['We have one daughter.','We has one daughter.','We are one daughter.'], answer:'We have one daughter.', hint:'Use “have” for family.'}
];

const fillData = [
  {prompt:'My husband is a ________.', answers:['hairdresser','a hairdresser'], hint:'He cuts and styles hair.'},
  {prompt:'We have one ________.', answers:['daughter','a daughter'], hint:'Girl child.'},
  {prompt:'I live in Saint-Gilles-Croix-de-________.', answers:['Vie'], hint:'Saint-Gilles-Croix-de-Vie.'},
  {prompt:'I enjoy ________ and dance.', answers:['yoga'], hint:'A calm physical activity.'},
  {prompt:'How ________ you?', answers:['are'], hint:'Greeting question.'},
  {prompt:'And ________?', answers:['you'], hint:'Short natural question back.'},
  {prompt:'What about ________?', answers:['you'], hint:'Ask the other person a question back.'}
];

const sortData = [
  {text:'Good morning', target:'polite'},
  {text:'Hello', target:'polite'},
  {text:'Excuse me', target:'polite'},
  {text:'Nice to meet you', target:'polite'},
  {text:'Hi', target:'casual'},
  {text:'Hey', target:'casual'},
  {text:'Hi there', target:'casual'},
  {text:'See you', target:'casual'}
];

const dialogueData = [
  {speaker:'Teacher', role:'teacher', text:'Hello! Nice to meet you.', model:''},
  {speaker:'Learner', role:'learner', text:'Hello! Nice to meet you too. My name is Karine.', model:'Hello! Nice to meet you too. My name is Karine.'},
  {speaker:'Teacher', role:'teacher', text:'Do you live here in Saint-Gilles-Croix-de-Vie?', model:''},
  {speaker:'Learner', role:'learner', text:'Yes, I do. I have lived here for sixty years.', model:'Yes, I do. I have lived here for sixty years.'},
  {speaker:'Teacher', role:'teacher', text:'What do you do in your free time?', model:''},
  {speaker:'Learner', role:'learner', text:'I enjoy yoga, dance, and going to the beach.', model:'I enjoy yoga, dance, and going to the beach.'},
  {speaker:'Teacher', role:'teacher', text:'What about your family?', model:''},
  {speaker:'Learner', role:'learner', text:'I am married, and we have one daughter in Paris. What about you?', model:'I am married, and we have one daughter in Paris. What about you?'}
];

const roleplays = {
  new_person: [
    {text:'A new person says: “Good morning. Nice to meet you.”', model:'Good morning. Nice to meet you too. My name is Karine.'},
    {text:'The person asks: “Do you live here?”', model:'Yes, I do. I live in Saint-Gilles-Croix-de-Vie.'},
    {text:'The person asks: “What do you like doing?”', model:'I enjoy yoga, dance, and going to the beach.'},
    {text:'Now ask a question back.', model:'What about you? Do you live here too?'}
  ],
  friendly_chat: [
    {text:'A friendly person says: “Hi! How are you?”', model:'Hi! I am fine, thank you. And you?'},
    {text:'The person asks: “Are you from here?”', model:'Yes, I was born and raised in Saint-Gilles-Croix-de-Vie.'},
    {text:'The person asks: “What does your husband do?”', model:'He is a hairdresser, and he has a salon in Saint-Gilles.'},
    {text:'Now ask a question back.', model:'And you? What do you do?'}
  ]
};

const selfBuilderBlocks = [
  'Hello, my name is Karine.',
  'I live in Saint-Gilles-Croix-de-Vie.',
  'I have lived here for sixty years.',
  'I am married.',
  'My husband is a hairdresser.',
  'He has a salon in Saint-Gilles.',
  'We have one daughter.',
  'She lives in Paris.',
  'I enjoy yoga.',
  'I enjoy dance.',
  'I like going to the beach.',
  'My husband is also a surfer.'
];

function updateScore(){
  document.getElementById('globalScore').textContent = `${state.scoreCorrect} / ${state.scoreTotal}`;
}
function addScore(ok){
  state.scoreTotal += 1;
  if(ok) state.scoreCorrect += 1;
  updateScore();
}
function speakText(text){
  if(!text) return;
  if(window.SpeakEasyTTS){
    window.SpeakEasyTTS.setAccent(state.voice);
    window.SpeakEasyTTS.speak(text);
    return;
  }
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = state.voice === 'UK' ? 'en-GB' : 'en-US';
  utter.rate = 0.85;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}
function maybeSpeak(text){
  if(state.autoAudio) speakText(text);
}
function normalize(s){
  return (s || '').trim().toLowerCase().replace(/[.!?]/g,'');
}

function renderVocab(){
  const map = {
    identity:'identityGrid',
    family:'familyGrid',
    home:'homeGrid',
    hobbies:'hobbiesGrid',
    greetings:'greetingsGrid'
  };
  Object.keys(map).forEach(key=>{
    const grid = document.getElementById(map[key]);
    grid.innerHTML = '';
    vocabData[key].forEach(item=>{
      const btn = document.createElement('button');
      btn.className = 'vocab-card';
      btn.innerHTML = `
        <div class="vocab-icon">${item.icon}</div>
        <div class="vocab-word">${item.word}</div>
        <div class="vocab-details">
          <p><strong>Definition:</strong> ${item.def}</p>
          <p><strong>Français:</strong> ${item.fr}</p>
          <p><strong>Example:</strong> ${item.ex}</p>
        </div>
      `;
      btn.addEventListener('click', ()=>{
        btn.classList.toggle('revealed');
        maybeSpeak(item.word + '. ' + item.ex);
      });
      grid.appendChild(btn);
    });
  });
}

function setupTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

function newMcq(){
  const item = mcqData[Math.floor(Math.random()*mcqData.length)];
  state.currentMcq = item;
  document.getElementById('mcqPrompt').textContent = item.prompt;
  document.getElementById('mcqFeedback').textContent = '';
  document.getElementById('mcqFeedback').className = 'feedback';
  const wrap = document.getElementById('mcqOptions');
  wrap.innerHTML = '';
  item.options.forEach(opt=>{
    const b = document.createElement('button');
    b.className = 'option-btn';
    b.textContent = opt;
    b.addEventListener('click', ()=>{
      const ok = opt === item.answer;
      addScore(ok);
      [...wrap.children].forEach(ch=>ch.disabled = true);
      if(ok){
        b.classList.add('correct');
        const f = document.getElementById('mcqFeedback');
        f.textContent = '✅ Correct!';
        f.classList.add('ok');
      }else{
        b.classList.add('incorrect');
        [...wrap.children].forEach(ch=>{
          if(ch.textContent === item.answer) ch.classList.add('correct');
        });
        const f = document.getElementById('mcqFeedback');
        f.textContent = '❌ ' + item.hint;
        f.classList.add('no');
      }
    });
    wrap.appendChild(b);
  });
  maybeSpeak(item.prompt);
}

function newFill(){
  const item = fillData[Math.floor(Math.random()*fillData.length)];
  state.currentFill = item;
  document.getElementById('fillPrompt').textContent = item.prompt;
  document.getElementById('fillInput').value = '';
  document.getElementById('fillHint').textContent = 'Hint: ' + item.hint;
  document.getElementById('fillFeedback').textContent = '';
  document.getElementById('fillFeedback').className = 'feedback';
  maybeSpeak(item.prompt);
}
function checkFill(){
  if(!state.currentFill) return;
  const val = normalize(document.getElementById('fillInput').value);
  const ok = state.currentFill.answers.some(a=>normalize(a) === val);
  addScore(ok);
  const f = document.getElementById('fillFeedback');
  if(ok){
    f.textContent = '✅ Correct!';
    f.className = 'feedback ok';
  }else{
    f.textContent = '❌ Try again. Possible answer: ' + state.currentFill.answers[0];
    f.className = 'feedback no';
  }
}

function renderSorter(){
  state.selectedSortChip = null;
  const pool = document.getElementById('sortPool');
  const polite = document.getElementById('dropPolite');
  const casual = document.getElementById('dropCasual');
  pool.innerHTML = '';
  polite.innerHTML = '';
  casual.innerHTML = '';
  document.getElementById('sortFeedback').textContent = '';

  sortData.forEach(item=>{
    const chip = document.createElement('button');
    chip.className = 'sort-chip';
    chip.textContent = item.text;
    chip.dataset.target = item.target;
    chip.draggable = true;

    chip.addEventListener('click', ()=>{
      document.querySelectorAll('.sort-chip').forEach(c=>c.classList.remove('selected'));
      chip.classList.add('selected');
      state.selectedSortChip = chip;
    });

    chip.addEventListener('dragstart', e=>{
      e.dataTransfer.setData('text/plain', item.text);
    });

    pool.appendChild(chip);
  });

  document.querySelectorAll('.dropzone').forEach(zone=>{
    zone.addEventListener('dragover', e=> e.preventDefault());
    zone.addEventListener('drop', e=>{
      e.preventDefault();
      const text = e.dataTransfer.getData('text/plain');
      const chip = [...document.querySelectorAll('.sort-chip')].find(c=>c.textContent === text);
      if(chip) handleSortDrop(chip, zone.id === 'dropPolite' ? 'polite' : 'casual', zone);
    });

    zone.parentElement.addEventListener('click', ()=>{
      if(state.selectedSortChip){
        const target = zone.id === 'dropPolite' ? 'polite' : 'casual';
        handleSortDrop(state.selectedSortChip, target, zone);
        state.selectedSortChip = null;
      }
    });
  });
}
function handleSortDrop(chip, target, zone){
  const ok = chip.dataset.target === target;
  addScore(ok);
  chip.classList.remove('selected');
  chip.classList.add(ok ? 'correct' : 'incorrect');
  zone.appendChild(chip);
  const f = document.getElementById('sortFeedback');
  if(ok){
    f.textContent = '✅ Good choice!';
    f.className = 'feedback ok';
  }else{
    f.textContent = '❌ Not quite. Try to think about tone and formality.';
    f.className = 'feedback no';
  }
}

function loadDialogue(){
  const box = document.getElementById('dialogueLines');
  box.innerHTML = '';
  dialogueData.forEach(line=>{
    const div = document.createElement('div');
    div.className = 'dialogue-line ' + line.role;
    div.innerHTML = `<span class="speaker">${line.speaker}</span>${line.text}`;
    div.addEventListener('click', ()=>{
      if(line.model) document.getElementById('dialogueModel').textContent = line.model;
      speakText(line.text);
    });
    box.appendChild(div);
  });
  document.getElementById('dialogueModel').textContent = 'Tap a learner line to see a model reply.';
}

function setupRoleplay(){
  const sel = document.getElementById('scenarioSelect');
  Object.keys(roleplays).forEach(key=>{
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = key === 'new_person' ? 'New person in the street' : 'Friendly local chat';
    sel.appendChild(opt);
  });
  state.roleplayScenarioKey = sel.value;
}
function startRoleplay(){
  state.roleplayScenarioKey = document.getElementById('scenarioSelect').value;
  state.roleplayIndex = 0;
  renderRoleplay();
}
function nextRoleplay(){
  const arr = roleplays[state.roleplayScenarioKey];
  state.roleplayIndex = Math.min(state.roleplayIndex + 1, arr.length - 1);
  renderRoleplay();
}
function renderRoleplay(){
  const item = roleplays[state.roleplayScenarioKey][state.roleplayIndex];
  document.getElementById('roleplayLine').textContent = item.text;
  document.getElementById('roleplayModel').textContent = 'Model reply will appear here.';
  maybeSpeak(item.text);
}
function showRoleplayModel(){
  const item = roleplays[state.roleplayScenarioKey][state.roleplayIndex];
  document.getElementById('roleplayModel').textContent = item.model;
}

function listenRoleplayModel(){
  const item = roleplays[state.roleplayScenarioKey]?.[state.roleplayIndex];
  const modelText = item && item.model ? item.model : document.getElementById('roleplayModel').textContent;
  if(modelText && modelText !== 'Model reply will appear here.'){
    speakText(modelText);
  }
}

function countdown(elId, start){
  const el = document.getElementById(elId);
  let n = start;
  el.textContent = n;
  const timer = setInterval(()=>{
    n--;
    el.textContent = n;
    if(n <= 0) clearInterval(timer);
  },1000);
}

function renderSelfBuilder(){
  const wrap = document.getElementById('selfBuilderBlocks');
  wrap.innerHTML = '';
  selfBuilderBlocks.forEach(txt=>{
    const b = document.createElement('button');
    b.className = 'choice-chip';
    b.textContent = txt;
    b.addEventListener('click', ()=>{
      state.selfBuilderSelected.push(txt);
      renderSelfOutput();
      b.disabled = true;
    });
    wrap.appendChild(b);
  });
  renderSelfOutput();
}
function renderSelfOutput(){
  const out = document.getElementById('selfBuilderOutput');
  if(!state.selfBuilderSelected.length){
    out.textContent = 'Your self-description will appear here.';
    return;
  }
  out.innerHTML = state.selfBuilderSelected.map(t=>`<span class="built-chip">${t}</span>`).join(' ');
}
function resetSelfBuilder(){
  state.selfBuilderSelected = [];
  renderSelfBuilder();
}

function getFinalDialogueText(){
  return [
    document.getElementById('line1').value,
    document.getElementById('line2').value,
    document.getElementById('line3').value,
    document.getElementById('line4').value,
    document.getElementById('line5').value,
    document.getElementById('line6').value
  ].join(' ');
}
function showFinalText(){
  const txt = [
    document.getElementById('line1').value,
    document.getElementById('line2').value,
    document.getElementById('line3').value,
    document.getElementById('line4').value,
    document.getElementById('line5').value,
    document.getElementById('line6').value
  ].join('\n\n');
  document.getElementById('finalTextOutput').textContent = txt;
}

function resetAll(){
  state.scoreCorrect = 0;
  state.scoreTotal = 0;
  updateScore();
  document.getElementById('mcqPrompt').textContent = 'Click “New question” to begin.';
  document.getElementById('mcqOptions').innerHTML = '';
  document.getElementById('mcqFeedback').textContent = '';
  document.getElementById('fillPrompt').textContent = 'Click “New fill-in” to begin.';
  document.getElementById('fillInput').value = '';
  document.getElementById('fillHint').textContent = '';
  document.getElementById('fillFeedback').textContent = '';
  renderSorter();
  document.getElementById('dialogueLines').innerHTML = '';
  document.getElementById('dialogueModel').textContent = 'Click “Load dialogue” to begin.';
  document.getElementById('roleplayLine').textContent = 'Choose a scenario and click Start.';
  document.getElementById('roleplayModel').textContent = 'Model reply will appear here.';
  resetSelfBuilder();
  document.getElementById('finalTextOutput').textContent = '';
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderVocab();
  setupTabs();
  setupRoleplay();
  renderSorter();
  renderSelfBuilder();
  updateScore();

  document.querySelectorAll('[data-voice]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('[data-voice]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.voice = btn.dataset.voice;
      if(window.SpeakEasyTTS){
        window.SpeakEasyTTS.setAccent(state.voice);
      }
    });
  });

  document.querySelectorAll('[data-audio]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('[data-audio]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.autoAudio = btn.dataset.audio === 'on';
    });
  });

  document.querySelectorAll('.listen-model').forEach(btn=>{
    btn.addEventListener('click', ()=> speakText(btn.dataset.text));
  });

  document.getElementById('heroListenBtn').addEventListener('click', ()=>{
    speakText('Hello. My name is Karine. I live in Saint-Gilles-Croix-de-Vie. I am married, and I enjoy yoga, dance, and going to the beach.');
  });
  document.getElementById('listenVocabIntroBtn').addEventListener('click', ()=>{
    speakText('Tap a category, then tap a card to reveal the meaning, the French translation, and an example.');
  });

  document.getElementById('newMcqBtn').addEventListener('click', newMcq);
  document.getElementById('resetMcqBtn').addEventListener('click', ()=>{
    document.getElementById('mcqPrompt').textContent = 'Click “New question” to begin.';
    document.getElementById('mcqOptions').innerHTML = '';
    document.getElementById('mcqFeedback').textContent = '';
  });
  document.getElementById('listenMcqBtn').addEventListener('click', ()=>{
    const txt = document.getElementById('mcqPrompt').textContent;
    if(txt) speakText(txt);
  });

  document.getElementById('newFillBtn').addEventListener('click', newFill);
  document.getElementById('resetFillBtn').addEventListener('click', ()=>{
    document.getElementById('fillPrompt').textContent = 'Click “New fill-in” to begin.';
    document.getElementById('fillInput').value = '';
    document.getElementById('fillHint').textContent = '';
    document.getElementById('fillFeedback').textContent = '';
  });
  document.getElementById('checkFillBtn').addEventListener('click', checkFill);
  document.getElementById('fillInput').addEventListener('keydown', e=>{
    if(e.key === 'Enter') checkFill();
  });
  document.getElementById('listenFillBtn').addEventListener('click', ()=>{
    const txt = document.getElementById('fillPrompt').textContent;
    if(txt) speakText(txt);
  });

  document.getElementById('resetSortBtn').addEventListener('click', renderSorter);

  document.getElementById('loadDialogueBtn').addEventListener('click', loadDialogue);
  document.getElementById('listenDialogueBtn').addEventListener('click', ()=>{
    if(dialogueData.length) speakText(dialogueData[0].text);
  });

  document.getElementById('startRoleplayBtn').addEventListener('click', startRoleplay);
  document.getElementById('nextRoleplayBtn').addEventListener('click', nextRoleplay);
  document.getElementById('showRoleplayModelBtn').addEventListener('click', showRoleplayModel);
  document.getElementById('listenRoleplayBtn').addEventListener('click', ()=>{
    const txt = document.getElementById('roleplayLine').textContent;
    if(txt) speakText(txt);
  });
  document.getElementById('listenRoleplayModelBtn').addEventListener('click', listenRoleplayModel);
  document.getElementById('prepTimerBtn').addEventListener('click', ()=> countdown('prepSeconds',15));
  document.getElementById('speakTimerBtn').addEventListener('click', ()=> countdown('speakSeconds',30));

  document.getElementById('resetSelfBuilderBtn').addEventListener('click', resetSelfBuilder);
  document.getElementById('listenSelfBuilderBtn').addEventListener('click', ()=>{
    if(state.selfBuilderSelected.length) speakText(state.selfBuilderSelected.join(' '));
  });

  document.getElementById('listenFinalUsBtn').addEventListener('click', ()=>{
    const current = state.voice;
    state.voice = 'US';
    speakText(getFinalDialogueText());
    state.voice = current;
  });
  document.getElementById('listenFinalUkBtn').addEventListener('click', ()=>{
    const current = state.voice;
    state.voice = 'UK';
    speakText(getFinalDialogueText());
    state.voice = current;
  });
  document.getElementById('showFinalTextBtn').addEventListener('click', showFinalText);

  document.getElementById('resetAllBtn').addEventListener('click', resetAll);
});
