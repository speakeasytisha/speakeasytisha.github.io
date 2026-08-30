const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = 'nathalie_lesson19_brittany_v1';

const state = { tense:{}, connector:{}, fill:{}, order:{}, completed:new Set() };

const vocab = {
  journey:[
    ['camper van','camping-car / van aménagé','a vehicle you can travel and sleep in','We travelled around Brittany in a camper van.','🚐'],
    ['campsite','camping','a place where people stay in tents or camper vans','We found a quiet campsite near the coast.','⛺'],
    ['stop / stopover','étape','a place where you pause during a journey','Our next stop was a small seaside town.','📍'],
    ['route','itinéraire','the way from one place to another','We changed our route because of the weather.','🗺️'],
    ['set off','partir / se mettre en route','to begin a journey','We set off early in the morning.','🛣️'],
    ['get there','y arriver','to arrive at a destination','It took us four hours to get there.','⏱️']
  ],
  landscape:[
    ['coastline','littoral / côte','the land along the sea','The coastline was wild and beautiful.','🌊'],
    ['cliff','falaise','a high steep rock beside the sea','We stopped to look at the cliffs.','⛰️'],
    ['lighthouse','phare','a tower with a light that guides boats','We saw a lighthouse in the distance.','🔦'],
    ['harbour','port','a protected place where boats stay','We walked around a small harbour.','⚓'],
    ['seaside village','village côtier','a village close to the sea','The seaside village was very peaceful.','🏘️'],
    ['view','vue / panorama','what you can see from a place','The view from the coast was spectacular.','👀']
  ],
  weather:[
    ['windy','venteux','with a lot of wind','It was sunny but very windy.','💨'],
    ['cloudy','nuageux','with many clouds','The morning was cloudy and cool.','☁️'],
    ['showery','avec des averses','with short periods of rain','The weather was showery in the afternoon.','🌦️'],
    ['bright','lumineux / ensoleillé','full of light','The sky became bright after lunch.','☀️'],
    ['changeable','changeant','changing often','The weather was very changeable.','🔄'],
    ['mild','doux','not very hot and not very cold','The temperature was mild near the sea.','🌤️']
  ],
  activities:[
    ['explore','explorer','to travel around and discover a place','We explored several small towns.','🧭'],
    ['go for a walk','faire une promenade','to walk for pleasure','We went for a walk along the coast.','🥾'],
    ['take photos','prendre des photos','to photograph people or places','We took lots of photos of the landscape.','📷'],
    ['have a picnic','pique-niquer','to eat a meal outside','We had a picnic near the beach.','🧺'],
    ['visit','visiter','to go to see a place','We visited a beautiful old town.','🏰'],
    ['watch the sunset','regarder le coucher de soleil','to look at the sun going down','We watched the sunset from the camper van.','🌅']
  ],
  opinions:[
    ['peaceful','paisible','calm and quiet','The campsite was peaceful at night.','😌'],
    ['impressive','impressionnant','making a strong impression','The cliffs were really impressive.','✨'],
    ['breathtaking','à couper le souffle','extremely beautiful','The coastal view was breathtaking.','🤩'],
    ['crowded','bondé','full of people','The town centre was a little crowded.','👥'],
    ['worth visiting','vaut le détour','good or interesting enough to visit','The harbour is definitely worth visiting.','⭐'],
    ['what I liked most','ce que j’ai préféré','a phrase to introduce your favourite thing','What I liked most was the freedom of the trip.','❤️']
  ]
};

const tenseQuestions = [
  {q:'We ___ along the coast when we saw a lighthouse.', choices:['were driving','drove','are driving'], a:'were driving', why:'The driving was already in progress when another event happened.'},
  {q:'We ___ at a campsite near the sea for two nights.', choices:['stayed','were staying','stay'], a:'stayed', why:'This is a completed part of the trip.'},
  {q:'While my granddaughter ___ at the map, I prepared lunch.', choices:['was looking','looked','is looking'], a:'was looking', why:'Use past continuous for the action in progress after “while”.'},
  {q:'It suddenly ___ to rain during our walk.', choices:['started','was starting','starts'], a:'started', why:'A sudden completed event uses the past simple.'},
  {q:'The sun ___ while we were having a picnic.', choices:['came out','was coming out','comes out'], a:'came out', why:'The sun coming out is the event that happened during the picnic.'},
  {q:'At 8 p.m., we ___ the sunset from the camper van.', choices:['were watching','watched yesterday','watch'], a:'were watching', why:'The time reference presents an action in progress at that moment.'}
];

const connectorQuestions = [
  {q:'It was windy, ___ we decided to keep walking.', choices:['but','because','where'], a:'but'},
  {q:'We stopped for a picnic ___ we were hungry.', choices:['because','although','finally'], a:'because'},
  {q:'The weather changed, ___ we went back to the camper van.', choices:['so','which','while'], a:'so'},
  {q:'___ it was cloudy, the view was still beautiful.', choices:['Although','Because','Then'], a:'Although'},
  {q:'We visited a small village ___ had a lovely harbour.', choices:['which','when','so'], a:'which'}
];

const orderQuestions = [
  {tokens:['It','took','us','four hours','to get there.'], answer:'It took us four hours to get there.'},
  {tokens:['We','stayed','there','for','three nights.'], answer:'We stayed there for three nights.'},
  {tokens:['We','arrived','at','the campsite','in the afternoon.'], answer:'We arrived at the campsite in the afternoon.'},
  {tokens:['We','drove','from','one coastal town','to','another.'], answer:'We drove from one coastal town to another.'}
];

const missions = {
  route:{title:'Tell the route',prompt:'Explain where you went, how you travelled, how long it took and how long you stayed.',tools:['We set off…','It took us…','Our first stop was…','After that…'],a2:'We went to Brittany in a camper van. It took us a few hours to get there. We visited several places and stayed for a few days. First, we stopped near the coast. After that, we travelled to another town.',b1:'We set off for Brittany in a camper van and spent several days travelling along the coast. It took us a few hours to reach our first stop. After that, we moved from one place to another, which gave us a lot of freedom.'},
  place:{title:'Describe your favourite place',prompt:'Say what was there, what you did, what it looked like and why you liked it.',tools:['There was / were…','We could see…','What I liked most…','because…'],a2:'My favourite place was near the sea. There was a beautiful beach and we could see the coast. We went for a walk and took photos. I liked it because it was quiet and beautiful.',b1:'My favourite stop was a peaceful place on the coast where we could see the sea and the cliffs. We went for a walk and took several photos. What I liked most was the atmosphere because it felt both wild and relaxing.'},
  weather:{title:'Tell a weather moment',prompt:'Describe what the weather was doing, what happened next and how you reacted.',tools:['It was…','While we were…','it started to…','so we…'],a2:'It was cloudy and windy. While we were walking, it started to rain, so we went back to the camper van. Later, the sun came out.',b1:'The weather was quite changeable. While we were walking near the coast, it suddenly started to rain, so we returned to the camper van. Fortunately, it cleared up later and we were able to go out again.'},
  memory:{title:'Share one special memory',prompt:'Tell one moment you especially remember with your granddaughter and explain why it was special.',tools:['One day…','We were… when…','I remember…','It was special because…'],a2:'One day, we watched the sea together. We were sitting near the camper van when the sun came out. I remember the beautiful light. It was special because we were together.',b1:'One of my favourite memories was a quiet moment with my granddaughter. We were looking at the coast when the light suddenly changed and the view became beautiful. I remember it because it was simple, peaceful and something we shared together.'},
  compare:{title:'Compare two stops',prompt:'Choose two places. Say what was different and which one you preferred.',tools:['Both places…','The first place was…','whereas…','I preferred… because…'],a2:'Both places were beautiful. The first place was quiet, but the second was more lively. I preferred the first place because it was peaceful.',b1:'Both stops were interesting, but they had very different atmospheres. The first was quieter and more natural, whereas the second was livelier and had more things to do. I preferred the first one because I really enjoyed the peaceful coastal scenery.'}
};

function shuffle(arr){return [...arr].sort(()=>Math.random()-.5)}
function normalise(v){return v.trim().toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ')}
function showToast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

function speak(text){
  if(!('speechSynthesis' in window)) return showToast('Speech is not supported in this browser.');
  window.speechSynthesis.cancel();
  const utter=new SpeechSynthesisUtterance(text);
  const lang=$('#voiceAccent').value || 'en-GB';utter.lang=lang;utter.rate=.92;
  const voices=speechSynthesis.getVoices();const match=voices.find(v=>v.lang===lang)||voices.find(v=>v.lang.startsWith(lang.slice(0,2)));
  if(match)utter.voice=match;window.speechSynthesis.speak(utter);
}

document.addEventListener('click',e=>{
  const listen=e.target.closest('.listen');if(listen){e.preventDefault();speak(listen.dataset.say||listen.textContent)}
});

function renderVocab(cat='journey'){
  const grid=$('#vocabGrid');grid.innerHTML='';
  vocab[cat].forEach(([word,fr,def,ex,icon])=>{
    const b=document.createElement('button');b.type='button';b.className='vocab-card';
    b.innerHTML=`<div class="word-row"><div><div class="fr">${fr}</div><h3>${icon} ${word}</h3></div><span class="speak-icon">▶</span></div><p class="definition">${def}</p><p class="example">“${ex}”</p>`;
    b.addEventListener('click',()=>speak(`${word}. ${ex}`));grid.appendChild(b);
  });
}
$$('.vocab-tab').forEach(b=>b.addEventListener('click',()=>{$$('.vocab-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderVocab(b.dataset.cat)}));

function renderChoiceQuiz(targetId, questions, stateKey, scoreId){
  const target=$(targetId);target.innerHTML='';
  questions.forEach((item,i)=>{
    const box=document.createElement('div');box.className='quiz-item';box.innerHTML=`<p>${i+1}. ${item.q}</p><div class="choice-row"></div><p class="explain" aria-live="polite"></p>`;
    const row=$('.choice-row',box), exp=$('.explain',box);
    shuffle(item.choices).forEach(c=>{const btn=document.createElement('button');btn.type='button';btn.className='choice';btn.textContent=c;btn.addEventListener('click',()=>{
      $$('.choice',row).forEach(x=>x.classList.remove('correct','incorrect'));
      const ok=c===item.a;btn.classList.add(ok?'correct':'incorrect');
      if(!ok){const correctBtn=$$('.choice',row).find(x=>x.textContent===item.a);if(correctBtn)correctBtn.classList.add('correct')}
      state[stateKey][i]=ok;state.completed.add(`${stateKey}-${i}`);exp.textContent=ok?`✓ Correct. ${item.why||''}`:`✗ Best answer: ${item.a}. ${item.why||''}`;updateScores();saveState(false);
    });row.appendChild(btn)});target.appendChild(box);
  });
}

function renderOrder(){
  const list=$('#orderQuiz');list.innerHTML='';
  orderQuestions.forEach((item,i)=>{
    const box=document.createElement('div');box.className='order-item';box.innerHTML=`<p><strong>${i+1}.</strong> Click the words in order.</p><div class="token-bank"></div><div class="answer-bank" aria-label="Your sentence"></div><p class="order-feedback"></p>`;
    const bank=$('.token-bank',box), answer=$('.answer-bank',box), feedback=$('.order-feedback',box);
    shuffle(item.tokens).forEach(tok=>{const b=document.createElement('button');b.type='button';b.className='token';b.textContent=tok;b.addEventListener('click',()=>{answer.appendChild(b);checkOrder()});bank.appendChild(b)});
    answer.addEventListener('click',e=>{if(e.target.classList.contains('token')){bank.appendChild(e.target);checkOrder()}});
    function checkOrder(){if(answer.children.length!==item.tokens.length){feedback.textContent='';return}const sentence=[...answer.children].map(x=>x.textContent).join(' ').replace(/ \./g,'.');const ok=normalise(sentence)===normalise(item.answer);state.order[i]=ok;state.completed.add(`order-${i}`);feedback.textContent=ok?'✓ Perfect sentence.':`✗ Not quite. Correct: ${item.answer}`;feedback.style.color=ok?'var(--good)':'var(--bad)';updateScores();saveState(false)}
    list.appendChild(box);
  });
}

function checkFill(input, index){
  const accepted=[input.dataset.answer,...(input.dataset.alt||'').split('|').filter(Boolean)].map(normalise);const value=normalise(input.value);
  if(!value){input.classList.remove('ok','no');delete state.fill[index];return}
  const ok=accepted.includes(value);input.classList.toggle('ok',ok);input.classList.toggle('no',!ok);state.fill[index]=ok;state.completed.add(`fill-${index}`);updateScores();saveState(false);
}
$$('.instant-input').forEach((inp,i)=>inp.addEventListener('input',()=>checkFill(inp,i)));

function renderMission(key){
  const m=missions[key];const panel=$('#missionPanel');
  panel.innerHTML=`<div class="mission-grid"><div><p class="mini-label">YOUR PROMPT</p><h3>${m.title}</h3><p>${m.prompt}</p><button class="ghost listen" data-say="${m.prompt.replace(/"/g,'&quot;')}" type="button">▶ Listen to prompt</button></div><div><p class="mini-label">3 CUE WORDS ONLY</p><div class="cue-three"><input class="save-field" placeholder="cue 1"><input class="save-field" placeholder="cue 2"><input class="save-field" placeholder="cue 3"></div><div class="mission-tools">${m.tools.map(x=>`<span>${x}</span>`).join('')}</div><div class="mission-models"><button class="ghost reveal-mission" data-level="a2" type="button">Reveal A2+ model</button><button class="ghost reveal-mission" data-level="b1" type="button">Reveal B1 model</button></div><div class="mission-model hidden"></div></div></div>`;
  $$('.reveal-mission',panel).forEach(b=>b.addEventListener('click',()=>{const box=$('.mission-model',panel);const text=b.dataset.level==='a2'?m.a2:m.b1;box.innerHTML=`<strong>${b.dataset.level==='a2'?'A2+':'B1'} model:</strong><p>${text}</p><button class="ghost listen" data-say="${text.replace(/"/g,'&quot;')}" type="button">▶ Listen</button>`;box.classList.remove('hidden')}));
}
$$('.mission-tab').forEach(b=>b.addEventListener('click',()=>{$$('.mission-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderMission(b.dataset.mission)}));

function updateScores(){
  const tenseCorrect=Object.values(state.tense).filter(Boolean).length;$('#scoreTense').textContent=`${tenseCorrect} / 6`;
  const fillCorrect=Object.values(state.fill).filter(Boolean).length;$('#scoreFill').textContent=`${fillCorrect} / 4`;
  const connCorrect=Object.values(state.connector).filter(Boolean).length;$('#scoreConnector').textContent=`${connCorrect} / 5`;
  const orderCorrect=Object.values(state.order).filter(Boolean).length;$('#scoreOrder').textContent=`${orderCorrect} / 4`;
  const totalCorrect=tenseCorrect+fillCorrect+connCorrect+orderCorrect;const max=19;const pct=Math.round(totalCorrect/max*100);
  $('#autoScore').textContent=`${pct}%`;$('#completedCount').textContent=state.completed.size;$('#lessonStatusText').textContent=state.completed.size>=19?'Completed':'In progress';
  $('#fillFeedback').textContent=Object.keys(state.fill).length?`${fillCorrect} correct so far. Keep going.`:'';
}

function saveState(show=true){
  const data={fields:{},checks:[],evals:[],comments:$('#evalComments')?.value||'',writing:$('#travelWriting')?.value||'',quiz:{tense:state.tense,connector:state.connector,fill:state.fill,order:state.order},completed:[...state.completed]};
  $$('.save-field').forEach((el,i)=>{data.fields[el.id||`field-${i}`]=el.value});
  data.checks=$$('.save-check').map(x=>x.checked);
  data.evals=$$('.eval-select').map(x=>x.value);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(data));if(show)showToast('Progress saved on this device.');
}
function loadState(){
  try{const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(!data)return;
    $$('.save-field').forEach((el,i)=>{const key=el.id||`field-${i}`;if(data.fields&&key in data.fields)el.value=data.fields[key]});
    $$('.save-check').forEach((x,i)=>x.checked=!!data.checks?.[i]);$$('.eval-select').forEach((x,i)=>{if(data.evals?.[i])x.value=data.evals[i]});
    Object.assign(state.tense,data.quiz?.tense||{});Object.assign(state.connector,data.quiz?.connector||{});Object.assign(state.fill,data.quiz?.fill||{});Object.assign(state.order,data.quiz?.order||{});state.completed=new Set(data.completed||[]);
  }catch(err){console.warn('Could not load saved lesson',err)}
}
$('#saveBtn').addEventListener('click',()=>saveState(true));
$$('.save-field,.save-check,.eval-select').forEach(el=>el.addEventListener('change',()=>saveState(false)));

function updateWordCount(){const words=$('#travelWriting').value.trim()?$('#travelWriting').value.trim().split(/\s+/).length:0;$('#wordCount').textContent=words;const label=$('#writingRange');if(words===0){label.textContent='Aim for 90–120 words';label.style.color=''}else if(words<90){label.textContent=`${90-words} words to reach 90`;label.style.color='var(--coral)'}else if(words<=120){label.textContent='✓ Excellent length';label.style.color='var(--good)'}else{label.textContent=`${words-120} words over 120`;label.style.color='var(--bad)'}saveState(false)}
$('#travelWriting').addEventListener('input',updateWordCount);
$$('[data-insert]').forEach(b=>b.addEventListener('click',()=>{const ta=$('#travelWriting'),text=b.dataset.insert,start=ta.selectionStart,end=ta.selectionEnd;ta.value=ta.value.slice(0,start)+text+ta.value.slice(end);ta.focus();ta.selectionStart=ta.selectionEnd=start+text.length;updateWordCount()}));
$$('.model-toggle').forEach(b=>b.addEventListener('click',()=>{$(`#model${b.dataset.model.toUpperCase()}`).classList.toggle('hidden')}));

const surprise=[
  'Would you like to do the same trip again? Why or why not?',
  'What was the most surprising moment of the trip?',
  'Was travelling by camper van easier or more difficult than you expected?',
  'Which place would you recommend to a friend, and why?',
  'What would you change if you did the trip again?',
  'What did your granddaughter enjoy most?'
];
$('#surpriseBtn').addEventListener('click',()=>{const q=surprise[Math.floor(Math.random()*surprise.length)];$('#surpriseQuestion').textContent=q;speak(q)});

let recorder, chunks=[];
$('#recordStart').addEventListener('click',async()=>{
  if(!navigator.mediaDevices?.getUserMedia)return showToast('Recording is not supported in this browser.');
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});recorder=new MediaRecorder(stream);chunks=[];recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{const blob=new Blob(chunks,{type:'audio/webm'});const url=URL.createObjectURL(blob);const audio=$('#recordPlayback');audio.src=url;audio.hidden=false;stream.getTracks().forEach(t=>t.stop());$('#recordStatus').textContent='Recording ready — listen back and notice one thing you did well and one thing to improve.'};recorder.start();$('#recordStart').disabled=true;$('#recordStop').disabled=false;$('#recordStatus').textContent='Recording… speak naturally.'}catch(e){showToast('Microphone permission was not granted.')}
});
$('#recordStop').addEventListener('click',()=>{if(recorder&&recorder.state==='recording')recorder.stop();$('#recordStart').disabled=false;$('#recordStop').disabled=true});

function reportText(){
  const evalLines=$$('.eval-select').map(x=>`${x.dataset.eval}: ${x.value}`).join('\n');
  return `Nathalie · Lesson 19 · Brittany Road Trip Story Studio\nDate: ${new Date().toLocaleDateString()}\n\nInteractive exercise score: ${$('#autoScore').textContent}\nActivities answered: ${$('#completedCount').textContent} / 19\n\n${evalLines}\n\nComments:\n${$('#evalComments').value||'(none)'}\n\nWriting word count: ${$('#wordCount').textContent}\n`;
}
$('#copyReport').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(reportText());$('#reportFeedback').textContent='✓ Progress report copied.'}catch(e){$('#reportFeedback').textContent='Copy was blocked by the browser. Use Download instead.'}});
$('#downloadReport').addEventListener('click',()=>{const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Nathalie-Lesson-19-Progress-Report.txt';a.click();URL.revokeObjectURL(a.href);$('#reportFeedback').textContent='✓ Report downloaded.'});
$('#resetLesson').addEventListener('click',()=>{if(confirm('Reset all saved answers and progress for this lesson?')){localStorage.removeItem(STORAGE_KEY);location.reload()}});

function pageProgress(){const doc=document.documentElement;const max=doc.scrollHeight-doc.clientHeight;const pct=max?doc.scrollTop/max*100:0;$('#topProgress').style.width=`${pct}%`}
document.addEventListener('scroll',pageProgress,{passive:true});

renderVocab();
renderChoiceQuiz('#tenseQuiz',tenseQuestions,'tense','#scoreTense');
renderChoiceQuiz('#connectorQuiz',connectorQuestions,'connector','#scoreConnector');
renderOrder();
renderMission('route');
loadState();
updateWordCount();
updateScores();
pageProgress();
