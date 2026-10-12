'use strict';
/* ===== Lesson 12 data — Speak Like a Host ===== */
const LESSON={
 key:'eden_lesson_12_speak_like_a_host_v1',
 file:'eden-lesson-12',
 title:'Lesson 12 · Speak Like a Host — long-form presence, story and conversation',
 quizzes:{
  host:[
   {q:'Why does Sinek’s 18-minute talk feel like one idea?',options:['Because it contains very little information.','Because every example returns to the same thread and signature line.','Because he speaks very fast.'],a:1,hint:'Stories change; something else doesn’t.',why:'The returns make every story serve one idea. That is the backbone of long form.'},
   {q:'You are ten minutes into a podcast and realise you have drifted. What do hosts do?',options:['Apologise for going off topic.','Use a bridge: “And that brings me back to…”','Stop and ask to start again.'],a:1,hint:'Drifting is fine if you come back.',why:'A bridge turns the tangent into a detour that supports your thread.'},
   {q:'What makes a long answer interesting rather than exhausting?',options:['More facts and more detail.','Alternating concrete moments and bigger principles.','Speaking without any pauses.'],a:1,hint:'Zoom in, zoom out.',why:'Movement between the concrete and the abstract keeps the listener’s attention alive.'}
  ],
  devices:[
   {q:'“It’s not about control. It’s about clarity.” Which device?',options:['Rule of three','Contrast','Callback'],a:1,hint:'Not X, but Y.',why:'Contrast makes a point sharper by showing what it is not.'},
   {q:'“We need clear roles, fast decisions and honest feedback.” Which device?',options:['Rule of three','Rhetorical question','Repetition'],a:0,hint:'Count the items.',why:'Three items feel complete and are easy to remember.'},
   {q:'“So why does this matter? Because every passenger trusts us.” Which device?',options:['Contrast','Rhetorical question','Signature line'],a:1,hint:'Who answers the question?',why:'You ask the question the listener is thinking — then answer it yourself.'},
   {q:'“Remember that meeting nobody expected? That’s exactly what I mean.” Which device?',options:['Callback','Rule of three','Contrast'],a:0,hint:'It refers to something earlier.',why:'A callback reconnects to an earlier story and makes the talk feel designed.'},
   {q:'Which is the best signature line?',options:['“Validation and verification activities are important for many reasons.”','“Trust isn’t assumed. It’s proven.”','“There are a lot of things to consider in testing.”'],a:1,hint:'Short, memorable, a contrast.',why:'Short, rhythmic and built on a contrast — easy to repeat and remember.'}
  ]
 },
 phrases:{
  'Building on a question':['That’s a great question, because…','I love that you asked that, because…','What’s interesting about that is…'],
  'Buying time naturally':['Let me think about that for a second.','That’s a big question — let me take one part of it.','Honestly? …'],
  'Bridging back to your thread':['And that brings me back to…','Which is really the heart of it for me…','That’s exactly what I mean when I say…'],
  'Telling a story':['Let me tell you about a moment that…','I remember one day…','And then something happened that I didn’t expect.'],
  'Adding nuance':['Now, to be fair…','The counter-argument would be…','I’m not saying X — I’m saying Y.'],
  'Handing over':['But I’m curious — how do you see it?','Has that been your experience too?','What would you add to that?']
 },
 random:{
  jamTopics:['What makes a great test engineer','The most beautiful aircraft ever built','Why people fear flying — and why they shouldn’t','What I learned from my first manager','Why curiosity is a professional skill','What a perfect weekend looks like','Why optimism matters at work','Something I changed my mind about','The future of aviation'],
  lenses:['🕰️ The past: how was it ten years ago?','🔮 The future: what will it look like in ten years?','👤 You personally: what does it mean for you?','👥 The team: what does it mean for your colleagues?','🌍 The industry: what does it mean for aviation?','🔎 Zoom in: give one specific moment.','🔭 Zoom out: what is the bigger principle?','⚖️ Counterpoint: what would a sceptic say?','❓ A question: what would a curious listener ask now?','🧒 Explain it to a 12-year-old.'],
  hostQuestions:['What does a day in your job actually look like?','Why do you think clear communication is so hard for engineers?','What is the biggest myth about testing?','What changed in the way you think about authority since your new role?','How do you lead people who know more than you technically?','What does a good team feel like from the inside?','Why should anyone care about validation and verification?','What would you tell someone about to become a manager for the first time?','What is the difference between being right and being convincing?','What makes someone worth listening to for an hour?'],
  followUps:['Can you give me a concrete example?','Why do you think that is?','What would you do differently now?','Isn’t that a bit idealistic?','How did that feel at the time?','What would a sceptic say to that?','And what did the team think?','So what’s the lesson for our listeners?'],
  podcastTopics:['What aviation teaches us about trust','Why the best engineers ask the most questions','Leading when the organisation is still changing','What Simon Sinek gets right — and what I would add','How to fail safely','Why I love my job (and what’s hard about it)','The skill nobody taught me at engineering school','What makes a team feel safe']
 },
 vocab:[
  ['long form','🧵','the thread','le fil conducteur','the central idea that holds a long talk together','If you lose the thread, go back to your signature line.'],
  ['long form','🔭','to zoom out','prendre de la hauteur','to move from a detail to the bigger principle','Let me zoom out for a second.'],
  ['long form','🔎','to zoom in','entrer dans le détail concret','to focus on one specific moment or example','Let me zoom in on one day.'],
  ['long form','🌉','a bridge','une transition, un pont','a phrase that brings you back to your thread','And that brings me back to trust.'],
  ['long form','↩️','a tangent','une digression','a topic that moves away from the main idea','Sorry, a quick tangent — but it matters.'],
  ['story','🎬','to set the scene','planter le décor','to give the time, place and people of a story','Let me set the scene: it was eleven at night.'],
  ['story','⚡','a turning point','un tournant','the moment when things change','The turning point was when the N+3 walked in.'],
  ['story','🧂','a vivid detail','un détail frappant','a specific detail that makes a story real','One vivid detail beats ten general facts.'],
  ['story','🎯','the takeaway','le message à retenir','what the listener should remember','The takeaway is simple.'],
  ['devices','3️⃣','the rule of three','la règle de trois','grouping ideas in threes to make them memorable','Clear roles, fast decisions, honest feedback.'],
  ['devices','⚖️','a contrast','une opposition','showing what something is by what it is not','It’s not about control — it’s about clarity.'],
  ['devices','❓','a rhetorical question','une question rhétorique','a question you ask and answer yourself','So why does this matter?'],
  ['devices','🔁','a callback','un rappel','a return to an earlier story or phrase','That’s a callback to the story I told earlier.'],
  ['devices','✍️','a signature line','une phrase-signature','a short line you repeat so people remember it','My signature line is: trust isn’t assumed, it’s proven.'],
  ['conversation','👂','to build on','rebondir sur','to develop what someone else said','I’d like to build on what you just said.'],
  ['conversation','🙋','a follow-up question','une question de relance','a question that goes deeper into the answer','Good hosts ask great follow-up questions.'],
  ['conversation','🎤','to hand over','passer la parole','to invite the other person to speak','Let me hand over to you — how do you see it?'],
  ['conversation','😌','to be at ease','être à l’aise','relaxed and natural','You sound more at ease when you tell stories.'],
  ['conversation','💬','off the cuff','au pied levé, spontanément','without preparation','Hosts often speak off the cuff — but they have practised.'],
  ['conversation','🧭','to steer the conversation','orienter la conversation','to guide a conversation in a direction','Use a bridge to steer the conversation back.']
 ],
 objectives:[
  ['o1','Analyse a host’s techniques (hook, story, return, callback, pause)'],
  ['o2','Develop one idea with zoom in/out, What/So what/Now what and lenses'],
  ['o3','Tell a real workplace story in scene–tension–turning point–lesson form'],
  ['o4','Use rhetorical devices and a personal signature line'],
  ['o5','Sustain a conversation: build on questions, bridge back, hand over'],
  ['o6','Deliver a 5-minute structured, engaging podcast-style talk']
 ],
 report:[['Clip analysed','clipHost'],['Timestamp','clipTime'],['Line to imitate','clipLine'],['Zoom in','zoomIn'],['Zoom out','zoomOut'],['What / So what / Now what','wsnOutput'],['My story','stOutput'],['Signature line','signature'],['Podcast cue card','podOutput'],['Then and now','compareNote']]
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
