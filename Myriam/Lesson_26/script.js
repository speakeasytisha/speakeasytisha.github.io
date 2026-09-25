const state = { score: 0, awarded: new Set(), mode: 'practice', timerSeconds: 60, timerOriginal: 60, timerId: null, currentPrompt: 0 };
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function shuffle(array){
  const a=[...array];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function updateScore(){ $('#score').textContent=state.score; }
function award(key, pts){ if(!state.awarded.has(key)){ state.awarded.add(key); state.score+=pts; updateScore(); } }
function setFeedback(el, good, text){ el.className='feedback '+(good?'good':'bad'); el.innerHTML=text; }
function celebrate(count=90){
  const colors=['#8f1d2c','#d7a84c','#24473a','#e9909a','#f5c55a'];
  for(let i=0;i<count;i++){
    const p=document.createElement('i'); p.className='confetti-piece';
    p.style.left=Math.random()*100+'vw'; p.style.background=colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDuration=(2.4+Math.random()*2.7)+'s'; p.style.animationDelay=(Math.random()*.45)+'s'; p.style.transform=`rotate(${Math.random()*360}deg)`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),6000);
  }
  document.body.classList.add('celebrate'); setTimeout(()=>document.body.classList.remove('celebrate'),600);
}

$$('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>$(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
$('#celebrateBtn').addEventListener('click',()=>celebrate());

// Randomise option order so answers are never predictably first.
$$('.options.randomize').forEach(group=>shuffle($$('button',group)).forEach(btn=>group.appendChild(btn)));

$$('.quiz-card').forEach(card=>{
  const feedback=$('.feedback',card); const answer=card.dataset.answer; const key=card.dataset.question;
  $$('.options button',card).forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.classList.contains('disabled')) return;
    const good=btn.dataset.value===answer;
    if(good){ btn.classList.add('correct'); $$('.options button',card).forEach(b=>b.classList.add('disabled')); setFeedback(feedback,true,'✓ Exactly. Strong choice!'); award(key,1); }
    else { btn.classList.add('incorrect'); setFeedback(feedback,false,'Not quite — try another option.'); }
  }));
});

$$('.hint-btn').forEach(btn=>btn.addEventListener('click',()=>$('#'+btn.dataset.hint)?.classList.toggle('hidden')));
$$('.model-btn').forEach(btn=>btn.addEventListener('click',()=>$('#'+btn.dataset.model)?.classList.toggle('hidden')));

$('.check-checkboxes').addEventListener('click',()=>{
  const boxes=$$('[data-checkgroup="memories"] input'); const checked=boxes.filter(b=>b.checked);
  const correct=checked.filter(b=>b.dataset.correct==='true'); const wrong=checked.filter(b=>b.dataset.correct==='false');
  const fb=$('#memoriesFeedback');
  if(checked.length!==5){ setFeedback(fb,false,'Choose exactly five memories.'); return; }
  if(correct.length===5 && wrong.length===0){ setFeedback(fb,true,'✓ Perfect memory lane! Those five were all part of your English journey.'); award('memories',5); celebrate(45); }
  else setFeedback(fb,false,`You found ${correct.length}/5 real memories. Have another look.`);
});

// Builders
$$('.builder-card').forEach(card=>{
  const answer=card.dataset.answer.split('|'); const bank=$('.word-bank',card); const zone=$('.build-zone',card); const fb=$('.feedback',card);
  const draw=()=>{bank.innerHTML=''; zone.innerHTML=''; shuffle(answer).forEach((w,i)=>{const b=document.createElement('button');b.className='word-chip';b.textContent=w;b.dataset.word=w;b.addEventListener('click',()=>{b.classList.add('used');const t=document.createElement('button');t.className='build-token';t.textContent=w;t.dataset.word=w;t.addEventListener('click',()=>{b.classList.remove('used');t.remove();});zone.appendChild(t);});bank.appendChild(b);});}; draw();
  $('.builder-check',card).addEventListener('click',()=>{const built=$$('.build-token',zone).map(x=>x.dataset.word);const good=built.join('|')===answer.join('|');if(good){setFeedback(fb,true,'✓ Beautiful structure: conclusion + preference + reason.');award(card.dataset.builder,2)}else setFeedback(fb,false,'Almost. Check the logical order and try again.');});
  $('.builder-clear',card).addEventListener('click',draw);
});

// Mode toggle
$('#modeToggle').addEventListener('click',e=>{
  state.mode=state.mode==='practice'?'challenge':'practice';
  e.currentTarget.textContent=state.mode==='practice'?'Practice':'Challenge';
  e.currentTarget.setAttribute('aria-pressed',state.mode==='challenge');
  document.body.classList.toggle('challenge-mode',state.mode==='challenge');
  if(state.mode==='challenge') $$('.hint,.model').forEach(x=>x.classList.add('hidden'));
});

const prompts=[
  {q:'Tell me about one lesson or topic you especially enjoyed. Why do you remember it?',a:'I especially enjoyed the lessons about Strasbourg and real-life situations because I could connect English with places and experiences that are meaningful to me. Overall, it made the vocabulary easier to remember.'},
  {q:'What is easier for you in English today than it was at the beginning?',a:'Today, it is easier for me to give a longer answer. I can explain my idea, give a reason and add an example instead of stopping after one sentence.'},
  {q:'Describe your perfect day in Alsace using at least three connectors.',a:'First, I would have a relaxed breakfast. Then I would walk through Strasbourg or spend time in nature. For example, I might go for a walk near the forest. Overall, I would choose a calm day with family, good food and time outside.'},
  {q:'Would you rather live in the countryside or in a big city? Give your opinion, a reason, an example and a conclusion.',a:'I prefer living in the countryside because it is quieter. For example, I enjoy having a garden and being close to nature. Compared with a big city, life feels less stressful to me. Overall, the countryside suits me better.'},
  {q:'Tell me about a happy memory from the last few years.',a:'One of my happiest memories is retirement because it gave me more time for the people and activities I enjoy. It was an important change in my life, and overall it brought me more freedom.'},
  {q:'Imagine you are helping a visitor in Strasbourg. What would you recommend?',a:'I would recommend visiting the historic centre and Petite France because the architecture is beautiful and the atmosphere is special. I would also suggest walking around the city and trying local food.'},
  {q:'What advice would you give to the “you” from your first English lesson?',a:'I would say: do not worry about making mistakes. Keep speaking, take your time and trust yourself. Progress comes little by little, and one day you realise you can do much more than before.'}
];
function showPrompt(){ const p=prompts[state.currentPrompt]; $('#promptDisplay').textContent=p.q; $('#speakingModel').innerHTML='<strong>Possible model:</strong><br>'+p.a; $('#speakingModel').classList.add('hidden'); }
$('#newPrompt').addEventListener('click',()=>{let next; do{next=Math.floor(Math.random()*prompts.length)}while(next===state.currentPrompt&&prompts.length>1);state.currentPrompt=next;showPrompt();});
$('#showSpeakingModel').addEventListener('click',()=>$('#speakingModel').classList.toggle('hidden'));

function formatTime(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function renderTimer(){ $('#timer').textContent=formatTime(state.timerSeconds); }
$$('[data-time]').forEach(b=>b.addEventListener('click',()=>{clearInterval(state.timerId);state.timerId=null;state.timerOriginal=Number(b.dataset.time);state.timerSeconds=state.timerOriginal;renderTimer();}));
$('#timerStart').addEventListener('click',()=>{ if(state.timerId)return; state.timerId=setInterval(()=>{state.timerSeconds--;renderTimer();if(state.timerSeconds<=0){clearInterval(state.timerId);state.timerId=null;celebrate(25);}},1000)});
$('#timerReset').addEventListener('click',()=>{clearInterval(state.timerId);state.timerId=null;state.timerSeconds=state.timerOriginal;renderTimer();});

function speak(text){ if(!('speechSynthesis' in window)) return alert('Audio is not supported in this browser.'); speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-GB'; u.rate=.86; speechSynthesis.speak(u); }
$$('.speak-chip').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));

const vocab={
  connectors:[
    ['🔗','because','parce que','I prefer the countryside because it is quieter.'],['💡','for example','par exemple','For example, I often go for walks in the forest.'],['⚖️','compared with','comparé à','Compared with a city, it feels calmer.'],['✨','overall','dans l’ensemble','Overall, it suits me better.']
  ],
  opinions:[
    ['💬','I agree','je suis d’accord','I agree because the idea is practical.'],['🧭','I would prefer','je préférerais','I would prefer a quieter hotel.'],['🌿','In my experience','d’après mon expérience','In my experience, planning ahead helps.'],['♥','For me','pour moi','For me, family time is very important.']
  ],
  travel:[
    ['🏨','reservation','réservation','I have a reservation for two nights.'],['🗺️','directions','itinéraire / indications','Could you give me directions to the station?'],['✈️','boarding pass','carte d’embarquement','Here is my boarding pass.'],['🙋','Could you…?','Pourriez-vous… ?','Could you help me, please?']
  ],
  confidence:[
    ['💭','Let me think for a moment.','Laissez-moi réfléchir un instant.','Let me think for a moment. I would say…'],['🧩','What I mean is…','Ce que je veux dire, c’est…','What I mean is, the area is peaceful.'],['↻','Let me rephrase that.','Je vais reformuler.','Let me rephrase that. I prefer the second option.'],['🚀','I can explain it another way.','Je peux l’expliquer autrement.','I can explain it another way if you like.']
  ]
};
function renderVocab(cat){const list=$('#vocabList');list.innerHTML='';vocab[cat].forEach(([icon,en,fr,ex])=>{const item=document.createElement('div');item.className='vocab-item';item.innerHTML=`<div class="vocab-icon">${icon}</div><div><div class="vocab-en">${en}</div><div class="vocab-fr">${fr}</div></div><button class="audio-btn" aria-label="Hear ${en}">🔊</button><div class="vocab-example">“${ex}”</div>`;$('.audio-btn',item).addEventListener('click',()=>speak(en+'. '+ex));list.appendChild(item);});}
renderVocab('connectors');
$('#vocabSelect').addEventListener('change',e=>renderVocab(e.target.value));

const voiceNote = 'Myriam, when we started working together, English sometimes needed a little more time and preparation. Today, you can organise your ideas, explain your choices, give examples and keep going even when a sentence is not perfect. Your progress comes from your seriousness, your dedication and your positive attitude. You should be very proud of everything you achieved.';
$('#playVoiceNote').addEventListener('click',()=>speak(voiceNote));
$('#stopVoiceNote').addEventListener('click',()=>{ if('speechSynthesis' in window) speechSynthesis.cancel(); });
$('#toggleTranscript').addEventListener('click',e=>{ const t=$('#voiceTranscript'); t.classList.toggle('hidden'); e.currentTarget.textContent=t.classList.contains('hidden')?'Show transcript':'Hide transcript'; });

$('#printCertificate').addEventListener('click',()=>window.print());
$('#downloadResults').addEventListener('click',()=>{
  const checked=$$('.cando:checked').map(x=>x.parentElement.textContent.trim());
  const text=`MYRIAM'S GRAND FINALE — LESSON MEMORIES\n\nCelebration points: ${state.score}/13\n\nI CAN NOW:\n${checked.length?checked.map(x=>'• '+x).join('\n'):'• Add your own reflections from the lesson.'}\n\nMY REFLECTIONS:\n1. The thing I am most proud of is: ${$('#reflect1').value||'...'}\n2. The English skill that feels easier now is: ${$('#reflect2').value||'...'}\n3. One thing I want to remember is: ${$('#reflect3').value||'...'}\n\nCongratulations, Myriam — what a journey!`;
  const blob=new Blob([text],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Myriam_Grand_Finale_Memories.txt';a.click();URL.revokeObjectURL(a.href);
});
$('#resetAll').addEventListener('click',()=>{ if(!confirm('Reset all lesson answers and reflections?'))return; location.reload(); });

// Practice mode opens hints only when requested; challenge mode simply keeps all support hidden.
showPrompt(); renderTimer(); updateScore();
