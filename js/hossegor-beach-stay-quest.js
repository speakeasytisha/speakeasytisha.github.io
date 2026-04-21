const state={
  voice:'US',
  audio:false,
  correct:0,
  total:0,
  currentMcq:null,
  currentFill:null,
  currentSort:null,
  built:[]
};

const vocab={
  hotel:[
    {icon:'🏨',word:'hotel',def:'a place where you stay when you travel',fr:'hôtel',ex:'You want a hotel near the beach.'},
    {icon:'🛏️',word:'room',def:'the place where you sleep in a hotel',fr:'chambre',ex:'You would like to book a room.'},
    {icon:'📅',word:'book',def:'reserve in advance',fr:'réserver',ex:'You are booking a hotel.'},
    {icon:'👫',word:'for two adults',def:'for two people',fr:'pour deux adultes',ex:'You need a room for two adults.'}
  ],
  preferences:[
    {icon:'❤️',word:'prefer',def:'like one thing more than another',fr:'préférer',ex:'You prefer the beach.'},
    {icon:'🌊',word:'near the beach',def:'close to the sea',fr:'près de la plage',ex:'You want a hotel near the beach.'},
    {icon:'😌',word:'quiet',def:'not noisy',fr:'calme',ex:'You want a quiet place.'},
    {icon:'📍',word:'location',def:'where a place is',fr:'emplacement',ex:'The location is perfect for you.'}
  ],
  amenities:[
    {icon:'🥐',word:'breakfast',def:'the morning meal',fr:'petit-déjeuner',ex:'Do you have breakfast?'},
    {icon:'🚗',word:'parking',def:'a place for the car',fr:'parking',ex:'Do you have parking?'},
    {icon:'🌅',word:'ocean view',def:'a view of the ocean',fr:'vue sur l’océan',ex:'You would like an ocean view.'},
    {icon:'🧖',word:'spa',def:'a place to relax',fr:'spa',ex:'This hotel has a spa.'}
  ],
  kite:[
    {icon:'🪁',word:'kitesurfing',def:'a water sport with a kite and board',fr:'kitesurf',ex:'Your husband likes kitesurfing.'},
    {icon:'🏫',word:'kitesurfing school',def:'a place for kitesurfing lessons',fr:'école de kitesurf',ex:'There is a kitesurfing school nearby.'},
    {icon:'🌱',word:'beginner',def:'a person who is starting',fr:'débutant',ex:'La Sud is easier for beginners.'},
    {icon:'🔥',word:'experienced',def:'not for beginners',fr:'expérimenté',ex:'La Gravière is for experienced surfers.'}
  ]
};

const mcqs=[
  {prompt:'Which sentence is correct?',options:['You are prefer the beach.','You prefer the beach.','You preferring the beach.'],answer:'You prefer the beach.',hint:'Use present simple for a general preference.'},
  {prompt:'Which sentence is a current plan?',options:['You prefer the beach.','You are travelling to Hossegor.','You would like breakfast.'],answer:'You are travelling to Hossegor.',hint:'Use present continuous for your current plan.'},
  {prompt:'Which sentence is the most polite?',options:['I want a room.','I would like to book a room, please.','Give me a room.'],answer:'I would like to book a room, please.',hint:'Use “would like” for polite booking English.'},
  {prompt:'Which hotel is right in front of the ocean?',options:['Hôtel de La Plage','Hôtel du Parc & Spa','Hotel Mercedes'],answer:'Hôtel de La Plage',hint:'It is the best match if you prefer the beach.'},
  {prompt:'What is the nearby kitesurfing option?',options:['Sud Landes Kite','La Nord Hotel','Plage Centrale Resort'],answer:'Sud Landes Kite',hint:'It is the school in Seignosse.'}
];

const fills=[
  {prompt:'You _____ the beach.',answers:['prefer'],hint:'present simple'},
  {prompt:'You are _____ to Hossegor.',answers:['travelling','traveling'],hint:'present continuous'},
  {prompt:'I would like to _____ a room.',answers:['book'],hint:'polite booking verb'},
  {prompt:'Do you have breakfast and _____?',answers:['parking'],hint:'for the car'},
  {prompt:'Your husband likes _____.',answers:['kitesurfing'],hint:'sport with a kite and board'}
];

const sorts=[
  {
    prompt:'Build the correct sentence.',
    words:['You','prefer','the','beach'],
    answer:'You prefer the beach'
  },
  {
    prompt:'Build the correct sentence.',
    words:['You','are','travelling','to','Hossegor'],
    answer:'You are travelling to Hossegor'
  },
  {
    prompt:'Build the correct sentence.',
    words:['I','would','like','to','book','a','room'],
    answer:'I would like to book a room'
  }
];

const dialogueData=[
  {speaker:'Receptionist',role:'staff',text:'Hello, how can I help you?',model:''},
  {speaker:'You',role:'student',text:'Hello, I would like to book a room, please.',model:'Hello, I would like to book a room, please.'},
  {speaker:'Receptionist',role:'staff',text:'For how many people?',model:''},
  {speaker:'You',role:'student',text:'For two adults.',model:'For two adults.'},
  {speaker:'Receptionist',role:'staff',text:'For what dates?',model:''},
  {speaker:'You',role:'student',text:'From May 7 for six days.',model:'From May 7 for six days.'},
  {speaker:'Receptionist',role:'staff',text:'Do you have any preferences?',model:''},
  {speaker:'You',role:'student',text:'Yes, I would like a hotel near the beach. Do you have breakfast and parking?',model:'Yes, I would like a hotel near the beach. Do you have breakfast and parking?'}
];

function updateScore(){document.getElementById('scoreText').textContent=`${state.correct} / ${state.total}`;}
function addScore(ok){state.total++; if(ok) state.correct++; updateScore();}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=state.voice==='UK'?'en-GB':'en-US';
  u.rate=.95;
  window.speechSynthesis.speak(u);
}
function maybeSpeak(text){if(state.audio) speak(text);}
function norm(s){return (s||'').trim().toLowerCase().replace(/[.!?]/g,'');}

function renderVocab(){
  const map={hotel:'hotelVocab',preferences:'preferencesVocab',amenities:'amenitiesVocab',kite:'kiteVocab'};
  Object.keys(map).forEach(k=>{
    const grid=document.getElementById(map[k]);
    grid.innerHTML='';
    vocab[k].forEach(item=>{
      const b=document.createElement('button');
      b.className='vocab-card';
      b.innerHTML=`<div style="font-size:1.8rem">${item.icon}</div><div class="vocab-word">${item.word}</div><div class="vocab-details"><p><strong>Definition:</strong> ${item.def}</p><p><strong>Français:</strong> ${item.fr}</p><p><strong>Example:</strong> ${item.ex}</p></div>`;
      b.addEventListener('click',()=>{b.classList.toggle('revealed'); maybeSpeak(item.word+'. '+item.ex);});
      grid.appendChild(b);
    });
  });
}
function setupTabs(){
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
    });
  });
}
function setupSpeakButtons(){
  document.querySelectorAll('.speak-btn').forEach(btn=>{
    btn.addEventListener('click',()=>speak(btn.dataset.text));
  });
}

function loadMcq(){
  const q=mcqs[Math.floor(Math.random()*mcqs.length)];
  state.currentMcq=q;
  mcqPrompt.textContent=q.prompt;
  mcqOptions.innerHTML='';
  mcqFeedback.textContent='';
  mcqFeedback.className='feedback';
  q.options.forEach(opt=>{
    const b=document.createElement('button');
    b.className='option';
    b.textContent=opt;
    b.addEventListener('click',()=>{
      const ok=opt===q.answer;
      addScore(ok);
      [...mcqOptions.children].forEach(ch=>ch.disabled=true);
      if(ok){
        b.classList.add('correct');
        mcqFeedback.textContent='✅ Correct!';
        mcqFeedback.classList.add('ok');
      }else{
        b.classList.add('incorrect');
        [...mcqOptions.children].forEach(ch=>{if(ch.textContent===q.answer) ch.classList.add('correct');});
        mcqFeedback.textContent='❌ '+q.hint;
        mcqFeedback.classList.add('no');
      }
    });
    mcqOptions.appendChild(b);
  });
  maybeSpeak(q.prompt);
}

function loadFill(){
  const q=fills[Math.floor(Math.random()*fills.length)];
  state.currentFill=q;
  fillPrompt.textContent=q.prompt;
  fillInput.value='';
  fillHint.textContent='Hint: '+q.hint;
  fillFeedback.textContent='';
  fillFeedback.className='feedback';
  maybeSpeak(q.prompt);
}
function checkFillNow(){
  if(!state.currentFill) return;
  const ok=state.currentFill.answers.some(a=>norm(a)===norm(fillInput.value));
  addScore(ok);
  if(ok){
    fillFeedback.textContent='✅ Correct!';
    fillFeedback.className='feedback ok';
  }else{
    fillFeedback.textContent='❌ Try again. Possible answer: '+state.currentFill.answers[0];
    fillFeedback.className='feedback no';
  }
}

function loadSort(){
  const q=sorts[Math.floor(Math.random()*sorts.length)];
  state.currentSort=q;
  state.built=[];
  sortPrompt.textContent=q.prompt;
  sortWords.innerHTML='';
  sortAnswer.innerHTML='Build your sentence here.';
  sortFeedback.textContent='';
  sortFeedback.className='feedback';
  q.words.sort(()=>Math.random()-0.5).forEach(word=>{
    const b=document.createElement('button');
    b.className='word-chip';
    b.textContent=word;
    b.addEventListener('click',()=>{
      state.built.push(word);
      b.disabled=true;
      renderSortAnswer();
    });
    sortWords.appendChild(b);
  });
}
function renderSortAnswer(){
  if(!state.built.length){ sortAnswer.innerHTML='Build your sentence here.'; return; }
  sortAnswer.innerHTML=state.built.map(w=>`<span class="answer-chip">${w}</span>`).join(' ');
}
function checkSortNow(){
  if(!state.currentSort) return;
  const built=state.built.join(' ');
  const ok=built===state.currentSort.answer;
  addScore(ok);
  if(ok){
    sortFeedback.textContent='✅ Correct!';
    sortFeedback.className='feedback ok';
  }else{
    sortFeedback.textContent='❌ Model: '+state.currentSort.answer;
    sortFeedback.className='feedback no';
  }
}
function clearSortNow(){
  if(state.currentSort) loadSort();
}
function listenSortNow(){
  if(state.currentSort) speak(state.currentSort.answer);
}

function loadDialogueNow(){
  dialogueBox.innerHTML='';
  dialogueData.forEach(line=>{
    const div=document.createElement('div');
    div.className='dialogue-line '+line.role;
    div.innerHTML=`<span class="speaker">${line.speaker}</span>${line.text}`;
    div.addEventListener('click',()=>{
      if(line.model) dialogueHelper.textContent=line.model;
      speak(line.text);
    });
    dialogueBox.appendChild(div);
  });
  dialogueHelper.textContent='Tap one of your lines to hear it and use it as a model.';
}

function fullRoleText(){
  return [line1.value,line2.value,line3.value,line4.value,line5.value,line6.value].join(' ');
}

document.addEventListener('DOMContentLoaded',()=>{
  renderVocab();
  setupTabs();
  setupSpeakButtons();
  updateScore();

  document.querySelectorAll('[data-voice]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-voice]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.voice=btn.dataset.voice;
    });
  });

  document.querySelectorAll('[data-audio]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-audio]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.audio=btn.dataset.audio==='on';
    });
  });

  listenBest.addEventListener('click',()=>speak(bestChoice.textContent));
  newMcq.addEventListener('click',loadMcq);
  newFill.addEventListener('click',loadFill);
  checkFill.addEventListener('click',checkFillNow);
  fillInput.addEventListener('keydown',e=>{if(e.key==='Enter') checkFillNow();});
  newSort.addEventListener('click',loadSort);
  checkSort.addEventListener('click',checkSortNow);
  clearSort.addEventListener('click',clearSortNow);
  listenSort.addEventListener('click',listenSortNow);
  loadDialogue.addEventListener('click',loadDialogueNow);

  listenRoleUS.addEventListener('click',()=>{const old=state.voice; state.voice='US'; speak(fullRoleText()); state.voice=old;});
  listenRoleUK.addEventListener('click',()=>{const old=state.voice; state.voice='UK'; speak(fullRoleText()); state.voice=old;});
  showRoleText.addEventListener('click',()=>{roleOutput.textContent=[line1.value,line2.value,line3.value,line4.value,line5.value,line6.value].join('\n\n');});

  resetAll.addEventListener('click',()=>{
    state.correct=0; state.total=0; updateScore();
    mcqPrompt.textContent='Click “New question” to begin.'; mcqOptions.innerHTML=''; mcqFeedback.textContent='';
    fillPrompt.textContent='Click “New fill-in” to begin.'; fillInput.value=''; fillHint.textContent=''; fillFeedback.textContent='';
    sortPrompt.textContent='Click “New puzzle” to begin.'; sortWords.innerHTML=''; sortAnswer.innerHTML='Build your sentence here.'; sortFeedback.textContent='';
    dialogueBox.innerHTML=''; dialogueHelper.textContent='Load the dialogue to begin.'; roleOutput.textContent='';
  });
});
