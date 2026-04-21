const state={voice:'US',audio:false,correct:0,total:0,currentMcq:null,currentFill:null};
const vocab={
hotel:[
{icon:'🏨',word:'hotel',def:'a place where you stay when you travel',fr:'hôtel',ex:'We want a hotel near the beach.'},
{icon:'🛏️',word:'room',def:'the place where you sleep in a hotel',fr:'chambre',ex:'I would like to book a room.'},
{icon:'📅',word:'book',def:'reserve in advance',fr:'réserver',ex:'I want to book a hotel.'},
{icon:'👫',word:'for two adults',def:'for two people',fr:'pour deux adultes',ex:'We need a room for two adults.'}
],
amenities:[
{icon:'🥐',word:'breakfast',def:'the morning meal',fr:'petit-déjeuner',ex:'Does the hotel have breakfast?'},
{icon:'🚗',word:'parking',def:'a place for the car',fr:'parking',ex:'Is parking included?'},
{icon:'🌅',word:'sea view',def:'a view of the ocean',fr:'vue mer',ex:'I would like a room with a sea view.'},
{icon:'📍',word:'location',def:'where a place is',fr:'emplacement',ex:'The location is perfect.'}
],
surf:[
{icon:'🏄',word:'surfer',def:'a person who rides waves',fr:'surfeur',ex:'My husband is a surfer.'},
{icon:'🪁',word:'kite school',def:'a place for kite lessons',fr:'école de kite',ex:'There is a kite school nearby.'},
{icon:'⚠️',word:'expert',def:'not for beginners',fr:'expert',ex:'La Nord is for experts only.'},
{icon:'🌱',word:'beginner',def:'a person who is starting',fr:'débutant',ex:'La Sud is better for beginners.'}
]};
const mcqs=[
{prompt:'Karine prefers...',options:['a hotel near the beach','a hotel in the mountains','a campsite far from the sea'],answer:'a hotel near the beach',hint:'She likes the beach.'},
{prompt:'Which hotel is right on the beach?',options:['Hôtel de La Plage','Hotel Mercedes','none of them'],answer:'Hôtel de La Plage',hint:'Look at the featured card.'},
{prompt:'Which place is for experts only?',options:['La Nord','La Sud','the lake'],answer:'La Nord',hint:'Experts only.'},
{prompt:'What can Karine ask at the hotel?',options:['Do you have breakfast and parking?','Are the waves six meters?','Can I buy a surfboard in the room?'],answer:'Do you have breakfast and parking?',hint:'Think of amenities.'}
];
const fills=[
{prompt:'I would like to book a ____ for two adults.',answers:['room','a room'],hint:'sleeping place in a hotel'},
{prompt:'We prefer a hotel near the ____.',answers:['beach','the beach'],hint:'sea and sand'},
{prompt:'Do you have breakfast and ____?',answers:['parking'],hint:'for the car'},
{prompt:'My husband is a ____.',answers:['surfer','a surfer'],hint:'rides waves'}
];
const dialogue=[
{speaker:'Receptionist',role:'staff',text:'Hello, how can I help you?',model:''},
{speaker:'Karine',role:'student',text:'Hello, I would like to book a room, please.',model:'Hello, I would like to book a room, please.'},
{speaker:'Receptionist',role:'staff',text:'For how many people?',model:''},
{speaker:'Karine',role:'student',text:'For two adults.',model:'For two adults.'},
{speaker:'Receptionist',role:'staff',text:'For what dates?',model:''},
{speaker:'Karine',role:'student',text:'From May 7 for six days.',model:'From May 7 for six days.'},
{speaker:'Receptionist',role:'staff',text:'Do you have any preferences?',model:''},
{speaker:'Karine',role:'student',text:'Yes, we prefer a hotel near the beach. Do you have breakfast and parking?',model:'Yes, we prefer a hotel near the beach. Do you have breakfast and parking?'}
];

function score(){document.getElementById('score').textContent=`${state.correct} / ${state.total}`;}
function addScore(ok){state.total++; if(ok) state.correct++; score();}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=state.voice==='UK'?'en-GB':'en-US';
  u.rate=.95;
  speechSynthesis.speak(u);
}
function normalize(s){return (s||'').trim().toLowerCase().replace(/[.!?]/g,'');}

function renderVocab(){
  const map={hotel:'hotelGrid',amenities:'amenitiesGrid',surf:'surfGrid'};
  Object.keys(map).forEach(k=>{
    const grid=document.getElementById(map[k]); grid.innerHTML='';
    vocab[k].forEach(item=>{
      const b=document.createElement('button');
      b.className='vocab-card';
      b.innerHTML=`<div style="font-size:1.8rem">${item.icon}</div><div class="vocab-word">${item.word}</div><div class="vocab-details"><p><strong>Definition:</strong> ${item.def}</p><p><strong>Français:</strong> ${item.fr}</p><p><strong>Example:</strong> ${item.ex}</p></div>`;
      b.addEventListener('click',()=>{b.classList.toggle('revealed'); if(state.audio) speak(item.word+'. '+item.ex);});
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
function newMcq(){
  const q=mcqs[Math.floor(Math.random()*mcqs.length)];
  state.currentMcq=q;
  document.getElementById('mcqPrompt').textContent=q.prompt;
  const wrap=document.getElementById('mcqOptions'); wrap.innerHTML='';
  const fb=document.getElementById('mcqFeedback'); fb.textContent=''; fb.className='feedback';
  q.options.forEach(opt=>{
    const b=document.createElement('button');
    b.className='option'; b.textContent=opt;
    b.addEventListener('click',()=>{
      const ok=opt===q.answer; addScore(ok);
      [...wrap.children].forEach(ch=>ch.disabled=true);
      if(ok){b.classList.add('correct'); fb.textContent='✅ Correct!'; fb.classList.add('ok');}
      else{b.classList.add('incorrect'); [...wrap.children].forEach(ch=>{if(ch.textContent===q.answer) ch.classList.add('correct')}); fb.textContent='❌ '+q.hint; fb.classList.add('no');}
    });
    wrap.appendChild(b);
  });
}
function newFill(){
  const q=fills[Math.floor(Math.random()*fills.length)];
  state.currentFill=q;
  document.getElementById('fillPrompt').textContent=q.prompt;
  document.getElementById('fillInput').value='';
  document.getElementById('fillHint').textContent='Hint: '+q.hint;
  document.getElementById('fillFeedback').textContent='';
  document.getElementById('fillFeedback').className='feedback';
}
function checkFill(){
  if(!state.currentFill) return;
  const val=normalize(document.getElementById('fillInput').value);
  const ok=state.currentFill.answers.some(a=>normalize(a)===val);
  addScore(ok);
  const fb=document.getElementById('fillFeedback');
  if(ok){fb.textContent='✅ Correct!'; fb.classList.add('ok');}
  else{fb.textContent='❌ Try again. Possible answer: '+state.currentFill.answers[0]; fb.classList.add('no');}
}
function loadDialogue(){
  const box=document.getElementById('dialogue'); box.innerHTML='';
  dialogue.forEach(line=>{
    const div=document.createElement('div');
    div.className='line '+line.role;
    div.innerHTML=`<span class="speaker">${line.speaker}</span>${line.text}`;
    div.addEventListener('click',()=>{if(line.model) document.getElementById('helperText').textContent=line.model; speak(line.text);});
    box.appendChild(div);
  });
  document.getElementById('helperText').textContent='Tap a Karine line to hear it and use it as a model.';
}
function roleText(){
  return [r1.value,r2.value,r3.value,r4.value,r5.value,r6.value].join(' ');
}
document.addEventListener('DOMContentLoaded',()=>{
  renderVocab(); setupTabs(); score();
  document.querySelectorAll('[data-voice]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-voice]').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); state.voice=btn.dataset.voice;}));
  document.querySelectorAll('[data-audio]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-audio]').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); state.audio=btn.dataset.audio==='on';}));
  document.getElementById('listenHero').addEventListener('click',()=>speak('We are going to Hossegor for six days. We want a hotel for two near the beach.'));
  document.querySelectorAll('.speak').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.text)));
  document.getElementById('listenBest').addEventListener('click',()=>speak(document.getElementById('bestText').textContent));
  document.getElementById('newMcq').addEventListener('click',newMcq);
  document.getElementById('newFill').addEventListener('click',newFill);
  document.getElementById('checkFill').addEventListener('click',checkFill);
  document.getElementById('fillInput').addEventListener('keydown',e=>{if(e.key==='Enter') checkFill();});
  document.getElementById('loadDialogue').addEventListener('click',loadDialogue);
  document.getElementById('listenRoleUs').addEventListener('click',()=>{const old=state.voice; state.voice='US'; speak(roleText()); state.voice=old;});
  document.getElementById('listenRoleUk').addEventListener('click',()=>{const old=state.voice; state.voice='UK'; speak(roleText()); state.voice=old;});
  document.getElementById('showRole').addEventListener('click',()=>{document.getElementById('roleOut').textContent=[r1.value,r2.value,r3.value,r4.value,r5.value,r6.value].join('\n\n');});
  document.getElementById('resetAll').addEventListener('click',()=>{
    state.correct=0; state.total=0; score();
    mcqPrompt.textContent='Click “New question” to begin.'; mcqOptions.innerHTML=''; mcqFeedback.textContent='';
    fillPrompt.textContent='Click “New fill-in” to begin.'; fillInput.value=''; fillHint.textContent=''; fillFeedback.textContent='';
    dialogue.innerHTML=''; helperText.textContent='Load the dialogue to begin.'; roleOut.textContent='';
  });
});
