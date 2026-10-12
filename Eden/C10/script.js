'use strict';
/* ===== Lesson 10 data — Start With Why ===== */
const LESSON={
 key:'eden_lesson_10_start_with_why_v1',
 file:'eden-lesson-10',
 title:'Lesson 10 · Start With Why — clarity, voice and presence',
 quizzes:{
  golden:[
   {q:'“We run 1,200 test cases per campaign.” Which circle is this?',options:['Why','How','What'],a:2,hint:'Is it a belief, an approach, or a tangible result?',why:'It is a tangible output — a what. Useful as proof, but it will not inspire on its own.'},
   {q:'“We refuse to assume — we prove it with evidence.” Which circle is this?',options:['Why','How','What'],a:1,hint:'It describes the way you work.',why:'It is an approach or value — a how. It shows what makes your team different.'},
   {q:'“Every passenger deserves to trust an aircraft without ever thinking about it.” Which circle is this?',options:['Why','How','What'],a:0,hint:'Does it express a belief about people?',why:'It is a belief about why the work matters — a why. This is the sentence people remember.'},
   {q:'In Sinek’s story, why did the Wright brothers succeed where Langley did not?',options:['They had more funding and better engineers.','They were driven by a cause, which kept the team going through failures.','They had better press coverage.'],a:1,hint:'Langley had the money and the attention.',why:'Sinek’s point: Langley chased the result; the Wrights chased a cause. The why sustains effort.'}
  ],
  answer:[
   {q:'A senior manager asks: “What exactly do you need from me?” Which opening is strongest?',options:['I need to explain the background first, because the situation has changed several times.','I need one decision: who arbitrates cross-team priorities until the organisation is confirmed?','There are several issues and I’m not sure where to start.'],a:1,hint:'Answer the actual question in your first sentence.',why:'The listener knows immediately what decision is needed. Context can follow.'},
   {q:'You have your answer out. What comes next?',options:['Every event in chronological order.','A map: “There are two reasons.”','An apology because it is complicated.'],a:1,hint:'Tell the listener what to listen for.',why:'A map makes the detail feel organised instead of random.'},
   {q:'You notice you are two minutes into the history. What is the best rescue sentence?',options:['“Sorry, I’m going on and on.”','“So, coming back to my question — who decides?”','“Anyway, it’s complicated.”'],a:1,hint:'Use a return, not an apology.',why:'A return reconnects everything to the point and makes you sound in control.'}
  ],
  voice:[
   {q:'Where is the most powerful place for a two-second pause?',options:['In the middle of a technical term.','Just after your key sentence.','Before every sentence.'],a:1,hint:'Give the important idea time to land.',why:'A pause after the key line signals importance and gives the listener time to absorb it.'},
   {q:'You are making a firm statement. How should your voice end the sentence?',options:['Rising, like a question.','Falling — the voice goes down.','Flat and fast.'],a:1,hint:'Think of landing an aircraft.',why:'A falling tone sounds certain. A rise at the end can sound like you are asking for permission.'},
   {q:'You feel an “euh” coming. What should you do?',options:['Say “euh” quickly so nobody notices.','Close your mouth and pause.','Repeat the last word.'],a:1,hint:'Silence is your friend.',why:'A silent pause sounds deliberate and confident. The listener hears thinking, not hesitation.'}
  ]
 },
 phrases:{
  'Opening':['Here’s something most people never think about…','Let me start with a question.','I want to begin with what I believe.'],
  'Mapping':['There are two things I want to say about that.','Let me give you the context in two parts.','First… and then…'],
  'Adding depth':['Let me give you an example.','To put that in context…','What that looks like in practice is…'],
  'Contrasting':['But here’s the thing.','On the other hand…','It’s not about X — it’s about Y.'],
  'Returning':['Coming back to my main point…','So, to bring that back to your question…','Which is exactly why…'],
  'Closing':['If there’s one thing to remember, it’s this.','So my answer is…','And that, for me, is what matters.']
 },
 random:{
  transitions:['Here’s something most people never think about…','Let me give you an example.','But here’s the thing.','To put that in context…','It’s not about speed — it’s about trust.','Coming back to my main point…','What that looks like in practice is…','If there’s one thing to remember, it’s this.','On the other hand…','Which is exactly why…'],
  jamTopics:['Why I chose engineering','The first aircraft I fell in love with','What makes a good test','A mistake that taught me something','Why people should trust aircraft','The best manager I ever had','What I would change about meetings','A place I love to travel to','Why curiosity matters at work','What Simon Sinek gets right','Morning routines','What makes a team feel safe','The most underrated skill in engineering','A book, podcast or film that changed my mind']
 },
 vocab:[
  ['sinek','🎯','purpose','but, raison d’être','the reason why something exists or matters','My purpose is to make sure people can trust what we build.'],
  ['sinek','💡','a cause','une cause, un idéal','a belief that people commit to beyond the result','The Wright brothers were driven by a cause, not by a contract.'],
  ['sinek','🔁','signature line','phrase-signature','a short sentence a speaker repeats so people remember it','Every good talk needs one signature line.'],
  ['sinek','🧲','to inspire','inspirer','to make people want to act, not only understand','Facts inform; purpose inspires.'],
  ['sinek','🌍','from the inside out','de l’intérieur vers l’extérieur','starting with why, then how, then what','Try explaining your project from the inside out.'],
  ['structure','🧭','signpost','balise, annonce de plan','a phrase that tells the listener where you are going','“There are two reasons” is a signpost.'],
  ['structure','📌','the bottom line','l’essentiel','the most important conclusion','The bottom line is that we need one arbitration route.'],
  ['structure','🔄','to come back to','revenir à','to return to your main point','Coming back to my question — who decides?'],
  ['structure','🧩','in two parts','en deux temps','a way to announce a short structure','Let me give you the context in two parts.'],
  ['voice','⏸️','to pause','marquer une pause','to stop speaking briefly on purpose','Pause after your key sentence.'],
  ['voice','🔊','to stress a word','accentuer un mot','to say one word louder or longer to show meaning','Stress the word “prove”.'],
  ['voice','↘️','falling intonation','intonation descendante','the voice going down at the end of a statement','Falling intonation makes you sound certain.'],
  ['voice','🐢','to slow down','ralentir','to reduce your speed for important ideas','Slow down for the point, speed up for the context.'],
  ['voice','🫧','a filler','un mot de remplissage (euh, bon…)','a sound people use while thinking','Replace fillers with a silent pause.'],
  ['body','👀','eye contact','contact visuel','looking at the people you speak to','Hold eye contact until the end of your sentence.'],
  ['body','🦶','grounded','ancrée, stable','stable and calm in your body','Stand grounded before your first word.'],
  ['body','✨','presence','présence','the impression of calm confidence you give','Presence starts before you speak.'],
  ['fluency','🎙️','to hold the floor','garder la parole','to keep speaking confidently without being interrupted','A good host can hold the floor for an hour.'],
  ['fluency','🧵','to lose the thread','perdre le fil','to forget or drift away from your main idea','If you lose the thread, go back to your why.'],
  ['fluency','🚫','hesitation, repetition, deviation','hésitation, répétition, digression','the three faults in the Just a Minute game','Try one minute without hesitation, repetition or deviation.']
 ],
 objectives:[
  ['o1','Explain the Golden Circle and apply it to own role (why → how → what)'],
  ['o2','Answer first using Answer → Map → Depth → Return'],
  ['o3','Use pauses, word stress and falling intonation to land a message'],
  ['o4','Open with presence (breath, eye contact, hands) in the first 20 seconds'],
  ['o5','Use transition phrases to guide the listener'],
  ['o6','Speak for 60 seconds without hesitation, repetition or deviation']
 ],
 report:[['Baseline note','baselineNote'],['Habit to steal from Sinek','stealHabit'],['My Golden Circle','gcOutput'],['N+3 speaking path','amOutput'],['My marked text','markedText'],['Just a Minute best','jamBest'],['Final — 20 seconds','final20'],['Final — 90 seconds','final90'],['Homework','homework']]
};

/* ===== Shared lesson engine — Eden · Speak Like a Host series ===== */
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={mode:'practice',score:0,total:0,answered:new Set()};
const WORK_KEY=LESSON.key+'_work';

function shuffle(a){return [...a].map(v=>({v,r:Math.random()})).sort((x,y)=>x.r-y.r).map(x=>x.v)}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
/* Text for speech: strip delivery-cue labels so they are never read aloud */
function cleanText(el){if(!el)return'';const c=el.cloneNode(true);c.querySelectorAll('.cue,.no-speak,button').forEach(n=>n.remove());c.querySelectorAll('br').forEach(b=>b.replaceWith(' '));return c.textContent.replace(/\s+/g,' ').trim()}
function textOf(id){return cleanText(document.getElementById(id))}
function toggle(id){const el=document.getElementById(String(id).replace(/^#/,''));if(el)el.classList.toggle('hidden')}
function download(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function load(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}

/* ---------- Speech ---------- */
function populateVoices(){
  if(!('speechSynthesis' in window))return;
  const vs=speechSynthesis.getVoices(),lang=($('#accentSelect')?.value||'en-GB').toLowerCase();
  const sel=$('#voiceSelect');if(!sel)return;
  const exact=vs.filter(v=>v.lang?.toLowerCase().replace('_','-')===lang);
  const en=vs.filter(v=>v.lang?.toLowerCase().startsWith('en'));
  const list=exact.length?exact:(en.length?en:vs);
  sel.innerHTML='';
  if(!list.length){sel.innerHTML='<option>Default voice</option>';return}
  list.forEach(v=>{const o=document.createElement('option');o.value=vs.indexOf(v);o.textContent=`${v.name} (${v.lang})`;sel.appendChild(o)});
}
function speak(text){
  if(!text||!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(String(text).replace(/\s+/g,' ').trim());
  const vs=speechSynthesis.getVoices(),idx=Number($('#voiceSelect')?.value);
  if(vs[idx])u.voice=vs[idx];
  u.lang=$('#accentSelect')?.value||'en-GB';u.rate=Number($('#rateSelect')?.value||.95);
  speechSynthesis.speak(u);
}

/* ---------- Quizzes ---------- */
function renderQuizzes(){
  state.total=0;state.score=0;state.answered.clear();
  $$('.quiz[data-quiz-set]').forEach(box=>{
    const set=box.dataset.quizSet,qs=LESSON.quizzes[set]||[];box.innerHTML='';
    qs.forEach((item,qi)=>{
      const key=`${set}-${qi}`,card=document.createElement('article');card.className='question-card';
      card.innerHTML=`<h3>${qi+1}. ${item.q}</h3><div class="quiz-options"></div><p class="quiz-feedback" id="fb-${key}"></p>`+(item.hint?`<button class="secondary small hint-button" data-toggle="hint-${key}">Hint</button><p class="mini-model hidden" id="hint-${key}">${item.hint}</p>`:'');
      const opts=card.querySelector('.quiz-options');
      shuffle(item.options.map((t,i)=>({t,i}))).forEach(({t,i})=>{const b=document.createElement('button');b.textContent=t;b.dataset.quiz=key;b.dataset.choice=i;opts.appendChild(b)});
      box.appendChild(card);state.total++;
    });
  });
  updateScore();
}
function answerQuiz(key,choice){
  if(state.answered.has(key))return;
  const [set,qi]=[key.slice(0,key.lastIndexOf('-')),Number(key.slice(key.lastIndexOf('-')+1))];
  const item=LESSON.quizzes[set][qi];state.answered.add(key);
  const good=choice===item.a;if(good)state.score++;
  $$(`[data-quiz="${key}"]`).forEach(b=>{b.disabled=true;const c=Number(b.dataset.choice);if(c===item.a)b.classList.add('correct');else if(c===choice)b.classList.add('wrong')});
  const fb=document.getElementById('fb-'+key);fb.textContent=(good?'Correct. ':'Not quite. ')+item.why;fb.className='quiz-feedback '+(good?'good':'bad');
  updateScore();
}
function updateScore(){
  if(!$('#scoreValue'))return;
  $('#scoreValue').textContent=state.score;$('#scoreTotal').textContent='/ '+state.total;
  const a=state.answered.size,label=$('#scoreLabel'),adv=$('#scoreAdvice');
  if(!state.total)return;
  if(a<state.total){label.textContent=`${a} of ${state.total} checks completed`;adv.textContent='Keep going. The score tracks communication choices, not your English level.'}
  else{const p=Math.round(state.score/state.total*100);label.textContent=`${p}% of communication choices aligned`;adv.textContent=p>=80?'Strong choices. Now make them automatic by speaking, not just clicking.':'Read the explanations, then say the corrected version aloud twice.'}
}

/* ---------- Builders ---------- */
function build(builder){
  const parts=[...builder.querySelectorAll('[data-part]')].map(f=>[f.dataset.part,f.value.trim()]).filter(p=>p[1]);
  const out=builder.querySelector('.built-message');
  const mode=builder.dataset.join||'labels';
  if(!parts.length){out.textContent='Fill in at least one part first.';return}
  out.textContent=mode==='speech'?parts.map(p=>p[1]).join(' '):parts.map(([k,v])=>`${k.toUpperCase()} → ${v}`).join('\n');
  saveWork();
}

/* ---------- Timers ---------- */
function initTimers(){
  $$('.timer-widget').forEach(w=>{
    const d=w.querySelector('.timer-display'),dur=Number(w.dataset.duration)||60;let rem=dur,h=null;
    const paint=()=>{const m=Math.floor(rem/60),s=rem%60;d.textContent=dur>=60?`${m}:${String(s).padStart(2,'0')}`:rem;d.classList.toggle('danger',rem<=Math.max(5,Math.round(dur*.15))&&rem>0);d.classList.toggle('done',rem===0)};
    const stop=()=>{if(h){clearInterval(h);h=null}d.classList.remove('running')};
    w.querySelector('.timer-start')?.addEventListener('click',()=>{stop();if(rem<=0)rem=dur;d.classList.add('running');h=setInterval(()=>{rem--;paint();if(rem<=0)stop()},1000)});
    w.querySelector('.timer-stop')?.addEventListener('click',stop);
    w.querySelector('.timer-reset')?.addEventListener('click',()=>{stop();rem=dur;paint()});
    paint();
  });
}

/* ---------- Recorders ---------- */
function initRecorders(){
  $$('.recorder').forEach((box,i)=>{
    const st=box.querySelector('.rec-status'),start=box.querySelector('.recordBtn'),stop=box.querySelector('.stopRecBtn'),audio=box.querySelector('.recordedAudio'),link=box.querySelector('.downloadRec');
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){st.textContent='Recording is not supported in this browser — use your phone recorder instead.';start.disabled=true;return}
    let rec,chunks=[],stream;
    start.addEventListener('click',async()=>{try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];rec=new MediaRecorder(stream);
      rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      rec.onstop=()=>{const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'}),url=URL.createObjectURL(blob);audio.src=url;audio.classList.remove('hidden');link.href=url;link.download=`${LESSON.file}-${box.dataset.name||'recording-'+(i+1)}.webm`;link.classList.remove('hidden');stream.getTracks().forEach(t=>t.stop());st.textContent='Recording ready — listen back before you judge it.';box.classList.remove('recording')};
      rec.start();start.disabled=true;stop.disabled=false;st.textContent='Recording…';box.classList.add('recording')}catch(e){st.textContent='Microphone permission was not granted.'}});
    stop.addEventListener('click',()=>{if(rec&&rec.state!=='inactive')rec.stop();start.disabled=false;stop.disabled=true});
  });
}

/* ---------- Counters, random prompts, rubrics ---------- */
function initCounters(){
  $$('.counters').forEach(g=>{
    g.querySelectorAll('.counter').forEach(c=>{const s=c.querySelector('strong');c.querySelector('.plus').addEventListener('click',()=>{s.textContent=Number(s.textContent)+1})});
  });
}
function randomPrompt(btn){
  const set=LESSON.random[btn.dataset.random]||[],t=document.getElementById(btn.dataset.target);if(!set.length||!t)return;
  let pick;do{pick=set[Math.floor(Math.random()*set.length)]}while(set.length>1&&pick===t.textContent);
  t.textContent=pick;if(btn.dataset.say)speak(pick);
}
function updateRubrics(){$$('.rubric').forEach(r=>{const all=r.querySelectorAll('input[type=checkbox]'),on=r.querySelectorAll('input:checked'),out=document.getElementById(r.dataset.score);if(out)out.textContent=`${on.length} / ${all.length}`})}

/* ---------- Rendered content ---------- */
function renderScenarios(){
  const g=$('#scenarioGrid');if(!g||!LESSON.scenarios)return;g.innerHTML='';
  LESSON.scenarios.forEach((s,i)=>{const a=document.createElement('article');a.className='card scenario-card';
    a.innerHTML=`<span class="tag">${s.where}</span><h3>${s.title}</h3><p class="prompt">${s.problem}</p><p><strong>Tool:</strong> <span class="tool">${s.tool}</span></p><div class="buttons"><button class="secondary small hint-button" data-toggle="scHint${i}">Hint</button><button class="small model-trigger" data-toggle="scModel${i}">Model</button></div><p class="mini-model hidden" id="scHint${i}">${s.hint}</p><div class="model-block hidden" id="scModel${i}"><p id="scModelText${i}">${s.model}</p><button class="small" data-speak-id="scModelText${i}">Listen</button></div>`;
    g.appendChild(a)});
}
function renderVocab(){
  const g=$('#vocabGrid');if(!g||!LESSON.vocab)return;const f=$('#vocabFilter')?.value||'all';g.innerHTML='';
  LESSON.vocab.filter(v=>f==='all'||v[0]===f).forEach(([cat,icon,en,fr,def,ex],i)=>{const a=document.createElement('article');a.className='card vocab-card';
    a.innerHTML=`<div class="icon">${icon}</div><span class="tag">${cat}</span><h3>${en}</h3><p class="translation"><strong>FR :</strong> ${fr}</p><p>${def}</p><p class="sentence">“${ex}”</p><button class="small" data-speak-text="${esc(en+'. '+ex)}">Listen</button>`;g.appendChild(a)});
}
function renderVocabFilter(){const s=$('#vocabFilter');if(!s||!LESSON.vocab)return;[...new Set(LESSON.vocab.map(v=>v[0]))].forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c[0].toUpperCase()+c.slice(1);s.appendChild(o)})}
function renderPhrases(){
  const g=$('#phraseBank');if(!g||!LESSON.phrases)return;g.innerHTML='';
  Object.entries(LESSON.phrases).forEach(([cat,list])=>{const a=document.createElement('article');a.className='card';
    a.innerHTML=`<span class="tag">${cat}</span><ul>${list.map(p=>`<li><span>${p}</span><button class="speak-mini" data-speak-text="${esc(p.replace(/…/g,''))}">▶</button></li>`).join('')}</ul>`;g.appendChild(a)});
}

/* ---------- Autosave of Eden's work ---------- */
function workFields(){return $$('main input[id],main textarea[id],main input[type=checkbox][id]').filter(el=>!el.closest('#qualiopi'))}
function saveWork(){const d={};workFields().forEach(el=>{d[el.id]=el.type==='checkbox'?el.checked:el.value});$$('.built-message[id]').forEach(o=>d['out:'+o.id]=o.textContent);store(WORK_KEY,d)}
function loadWork(){const d=load(WORK_KEY);if(!d)return;workFields().forEach(el=>{if(el.id in d){if(el.type==='checkbox')el.checked=d[el.id];else el.value=d[el.id]}});$$('.built-message[id]').forEach(o=>{if(d['out:'+o.id])o.textContent=d['out:'+o.id]});updateRubrics()}
function resetActivities(){
  if(!confirm('Clear all your answers and activities on this page? (The Qualiopi record is not affected.)'))return;
  try{localStorage.removeItem(WORK_KEY)}catch(e){}
  workFields().forEach(el=>{if(el.type==='checkbox')el.checked=false;else el.value=''});
  $$('.built-message').forEach(o=>o.textContent=o.dataset.placeholder||'Your message will appear here.');
  $$('.counter strong').forEach(s=>s.textContent='0');
  renderQuizzes();updateRubrics();
}
function resultsText(){
  const L=[`Eden — ${LESSON.title}`,`Date: ${new Date().toLocaleDateString('en-GB')}`,`Interactive checks: ${state.score}/${state.total}`,''];
  $$('.rubric').forEach(r=>{const out=document.getElementById(r.dataset.score);L.push(`${r.dataset.label||'Checklist'}: ${out?out.textContent:''}`)});
  L.push('');
  (LESSON.report||[]).forEach(([label,id])=>{const el=document.getElementById(id);if(!el)return;const v=(el.value!==undefined&&el.tagName!=='DIV')?el.value.trim():el.textContent.trim();L.push(label+':',v||'—','')});
  return L.join('\n');
}

/* ---------- Qualiopi ---------- */
const QKEY=LESSON.key+'_qualiopi';
function statusLabel(v){return{achieved:'Acquis',progress:'En cours d’acquisition','not-achieved':'Non acquis','not-started':'Non commencé'}[v]||v}
function renderProgress(){const h=$('#manualGrid');h.innerHTML='';LESSON.objectives.forEach(([id,label])=>{const l=document.createElement('label');l.innerHTML=`${label}<select data-progress="${id}"><option value="not-started">Non commencé</option><option value="progress">En cours d’acquisition</option><option value="achieved">Acquis</option><option value="not-achieved">Non acquis</option></select><textarea rows="2" data-note="${id}" placeholder="Evidence / notes"></textarea>`;h.appendChild(l)})}
function collectProgress(){const s={};LESSON.objectives.forEach(([id])=>s[id]={status:$(`[data-progress="${id}"]`).value,note:$(`[data-note="${id}"]`).value});return{learner:$('#learnerName').value,trainer:$('#trainerName').value,date:$('#evaluationDate').value,comments:$('#trainerComments').value,statuses:s,lastSaved:new Date().toISOString()}}
function progressReport(){const p=collectProgress();const L=[`Bilan d’évaluation des acquis — ${LESSON.title}`,`Learner: ${p.learner||'—'}`,`Trainer: ${p.trainer||'—'}`,`Date: ${p.date||'—'}`,`Duration: 1 h 30`,'','Objectives:'];LESSON.objectives.forEach(([id,label])=>{const o=p.statuses[id];L.push(`- ${label}: ${statusLabel(o.status)}${o.note?' — '+o.note:''}`)});L.push('',`Interactive checks: ${state.score}/${state.total}`,'','General observations:',p.comments||'—');return L.join('\n')}
function updateProgressSummary(){const v=$$('[data-progress]').map(s=>s.value),started=v.filter(x=>x!=='not-started').length,c=Math.round(started/v.length*100)||0;$('#completionRate').value=c+'%';$('#completionRateText').textContent=c+'%';let o='not-started';if(started)o=v.every(x=>x==='achieved')?'achieved':v.some(x=>x==='not-achieved')?'not-achieved':'progress';const el=$('#overallStatus');el.textContent=statusLabel(o);el.className='status '+o;$('#reportPreview').textContent=progressReport()}
function saveProgress(){const p=collectProgress();store(QKEY,p);$('#lastSaved').textContent=new Date(p.lastSaved).toLocaleString('en-GB');updateProgressSummary()}
function loadProgress(){const p=load(QKEY);$('#evaluationDate').value=new Date().toISOString().slice(0,10);if(p){$('#learnerName').value=p.learner||'Eden Cohen';$('#trainerName').value=p.trainer||'Tisha DOUTY-DOSIERE';if(p.date)$('#evaluationDate').value=p.date;$('#trainerComments').value=p.comments||'';Object.entries(p.statuses||{}).forEach(([id,o])=>{const s=$(`[data-progress="${id}"]`),n=$(`[data-note="${id}"]`);if(s)s.value=o.status||'not-started';if(n)n.value=o.note||''});if(p.lastSaved)$('#lastSaved').textContent=new Date(p.lastSaved).toLocaleString('en-GB')}updateProgressSummary()}

/* ---------- Bindings ---------- */
function bind(){
  document.addEventListener('click',e=>{
    const t=e.target;let el;
    if((el=t.closest('[data-scroll]'))){$(el.dataset.scroll)?.scrollIntoView({behavior:'smooth'});return}
    if((el=t.closest('[data-quiz]'))){answerQuiz(el.dataset.quiz,Number(el.dataset.choice));return}
    if((el=t.closest('[data-toggle]'))){toggle(el.dataset.toggle);return}
    if((el=t.closest('[data-speak-text]'))){speak(el.dataset.speakText);return}
    if((el=t.closest('[data-speak-id]'))){speak(textOf(el.dataset.speakId));return}
    if((el=t.closest('[data-random]'))){randomPrompt(el);return}
    if((el=t.closest('.build-btn'))){build(el.closest('.builder'));return}
    if((el=t.closest('.listen-build'))){speak(cleanText(el.closest('.builder').querySelector('.built-message')));return}
    if((el=t.closest('.counters-reset'))){el.closest('.lab').querySelectorAll('.counter strong').forEach(s=>s.textContent='0');return}
    if((el=t.closest('.transcript-toggle'))){toggle(el.dataset.transcript);el.textContent=document.getElementById(el.dataset.transcript).classList.contains('hidden')?'Show transcript':'Hide transcript';return}
  });
  $('#toggleFrench').onclick=e=>{document.body.classList.toggle('all-french');e.target.textContent=document.body.classList.contains('all-french')?'Hide French support':'Show French support'};
  $('#toggleModels').onclick=e=>{document.body.classList.toggle('all-models');e.target.textContent=document.body.classList.contains('all-models')?'Hide all models':'Show all models'};
  $('#toggleCues')&&($('#toggleCues').onclick=e=>{document.body.classList.toggle('hide-cues');e.target.textContent=document.body.classList.contains('hide-cues')?'Show delivery cues':'Hide delivery cues'});
  $('#toggleMode').onclick=e=>{state.mode=state.mode==='practice'?'challenge':'practice';document.body.classList.toggle('challenge-mode',state.mode==='challenge');e.target.textContent='Mode: '+(state.mode==='practice'?'Practice':'Challenge')};
  $('#stopAudio').onclick=()=>window.speechSynthesis&&speechSynthesis.cancel();
  $('#audioTest').onclick=()=>speak('Audio test. The listen buttons are ready.');
  $('#accentSelect').onchange=populateVoices;
  $('#vocabFilter')&&($('#vocabFilter').onchange=renderVocab);
  $('#downloadResults').onclick=()=>download(`${LESSON.file}-results.txt`,resultsText());
  $('#resetActivities').onclick=resetActivities;
  $('#saveProgress').onclick=saveProgress;
  $('#downloadProgress').onclick=()=>download(`${LESSON.file}-qualiopi-report.txt`,progressReport());
  $('#printReport').onclick=()=>window.print();
  $('#resetProgress').onclick=()=>{if(!confirm('Reset the saved Qualiopi record for this lesson?'))return;try{localStorage.removeItem(QKEY)}catch(e){}$$('[data-progress]').forEach(s=>s.value='not-started');$$('[data-note]').forEach(n=>n.value='');$('#trainerComments').value='';$('#learnerName').value='Eden Cohen';$('#lastSaved').textContent='—';updateProgressSummary()};
  document.addEventListener('input',e=>{
    if(e.target.closest('#qualiopi'))updateProgressSummary();else{saveWork();if(e.target.closest('.rubric'))updateRubrics()}
  });
  document.addEventListener('change',e=>{if(e.target.closest('#qualiopi'))updateProgressSummary();else if(e.target.closest('.rubric')){updateRubrics();saveWork()}});
}
function init(){
  $$('.built-message').forEach(o=>o.dataset.placeholder=o.textContent);
  renderQuizzes();renderScenarios();renderVocabFilter();renderVocab();renderPhrases();renderProgress();
  populateVoices();if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=populateVoices;
  initTimers();initRecorders();initCounters();bind();loadWork();updateRubrics();loadProgress();updateScore();
}
document.addEventListener('DOMContentLoaded',init);
