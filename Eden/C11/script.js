'use strict';
/* ===== Lesson 11 data — Real Conversations at Work ===== */
const LESSON={
 key:'eden_lesson_11_real_conversations_v1',
 file:'eden-lesson-11',
 title:'Lesson 11 · Real Conversations at Work — colours, updates, trust and disagreement',
 quizzes:{
  colours:[
   {q:'Your listener interrupts: “Just tell me — do we make the date or not?” What do they need now?',options:['Speed and a decision (red).','Reassurance about the team (green).','The full test data (blue).'],a:0,hint:'Listen to the words “just tell me”.',why:'This moment needs the headline and the decision. Give the answer first, details on request.'},
   {q:'A colleague asks: “Which assumptions is that estimate based on?” What should you give?',options:['A motivating story.','Criteria, assumptions and evidence (blue).','A shorter answer with no numbers.'],a:1,hint:'They are asking about reasoning.',why:'Keep your headline first, then organise the evidence clearly by assumption.'},
   {q:'A team member goes quiet after hearing about the reorganisation. What is most useful?',options:['Push for their opinion immediately.','Explain what stays the same, what changes, and when they will know more (green).','Send them the new organisation chart.'],a:1,hint:'Silence can mean uncertainty.',why:'Stability and a clear transition path reduce anxiety and keep trust.'},
   {q:'The programme manager lights up talking about the customer and the team. How do you present your plan?',options:['As a table of test cases.','Through the vision and the people involved, with energy (yellow).','As briefly as possible.'],a:1,hint:'Match the energy.',why:'Yellow listeners connect through purpose, people and enthusiasm — then you can bring in the facts.'}
  ],
  srird:[
   {q:'What should the first sentence of a programme update be?',options:['“So, as you know, three weeks ago we started…”','“One item needs a decision today: …”','“There have been a lot of technical discussions.”'],a:1,hint:'Answer first.',why:'Senior listeners should know in ten seconds whether they need to act.'},
   {q:'Which is the strongest “Decision” line?',options:['“Let me know what you think.”','“We might need to discuss the schedule at some point.”','“I need your agreement on the split approach today, so the team can re-plan tomorrow.”'],a:2,hint:'Who, what, when.',why:'A clear decision line names the decision, the decision-maker and the deadline.'}
  ],
  assert:[
   {q:'Which sentence is polite AND clear in English?',options:['“Maybe we could perhaps possibly look at it?”','“Could we look at this together tomorrow?”','“We must look at it.”'],a:1,hint:'Short, warm, one softener only.',why:'One softener (“could”) is enough. Stacking “maybe… perhaps… possibly” sounds unsure.'},
   {q:'You disagree with a senior manager. Which is best?',options:['“I see it differently, and here’s why.”','“Sorry, I’m not sure, but maybe I think it’s wrong?”','“You’re wrong.”'],a:0,hint:'Respectful, direct, followed by a reason.',why:'It is assertive and respectful, and it moves straight to your reasoning.'},
   {q:'Which phrase sounds most confident when making a recommendation?',options:['“I would maybe suggest that…”','“I recommend that we…”','“It could be interesting to perhaps…”'],a:1,hint:'Own the recommendation.',why:'“I recommend” is professional and confident — not aggressive.'},
   {q:'“Actually” in English usually means…',options:['“currently” (actuellement).','“in fact / to be honest”.','“now”.'],a:1,hint:'False friend!',why:'For “actuellement”, say “currently” or “at the moment”. “Actually” means “in fact”.'}
  ]
 },
 random:{
  warmTopics:['What a good week at work looks like','The hardest test I ever had to plan','Why meetings go wrong','What I have learned from a difficult colleague','How to explain V&V to a child','The best decision I made this year','What makes a good leader','Why I like working with blue people','What I would tell my younger self about engineering']
 },
 scenarios:[
  {where:'Corridor · 20 sec',title:'The N+3 asks “How’s it going?”',problem:'You have 20 seconds in the lift. Things are mostly fine, but one risk needs his attention.',tool:'Answer first + one ask',hint:'Headline, one risk, one ask. No history.',model:'Mostly on track — the test campaign is running to plan. One thing I’d like to flag: bench availability could delay qualification by two weeks. If you have five minutes this week, I’d like your support on a backup option.'},
  {where:'Programme review · 90 sec',title:'A test result is ambiguous',problem:'The data is not clearly a pass or a fail. The programme wants a yes or no.',tool:'SRIRD',hint:'Be honest about uncertainty, then recommend a clear next step and decision.',model:'The short answer is: we can’t call it a pass yet. The result is within limits, but one parameter behaved unexpectedly. If we accept it now and it is a real issue, we’d find it much later and at a higher cost. I recommend two extra days of analysis before we close it. I need your agreement to hold the closure until Thursday.'},
  {where:'Team meeting',title:'The technical leader answers before you frame',problem:'It happens again: detailed answers start before the decision is framed.',tool:'Real-time reframe',hint:'Thank, pause the detail, frame the decision, hand back.',model:'That’s really useful — let me just frame the decision first so we use it well. What we need to decide today is whether we change the test sequence. With that in mind, can you take us through the key technical point?'},
  {where:'One-to-one · green',title:'A team member is worried about the reorganisation',problem:'They ask directly whether their job will change. You don’t know everything yet.',tool:'Green dial: stable / unknown / support',hint:'Say what stays the same, be honest about what you don’t know, and give a date.',model:'Here’s what I know: your role in the campaign stays the same. What isn’t decided yet is the reporting line above us. I’ll tell you as soon as I know — at the latest at next week’s check-in.'},
  {where:'Cross-team',title:'A colleague bypasses coordination',problem:'Someone closes a cross-team decision alone because “it’s faster”.',tool:'DESC',hint:'Describe, express the risk, suggest the replacement behaviour, link to the shared goal.',model:'When a cross-team decision is closed outside the coordination loop, the other teams lose visibility. My concern is not control, it’s consistency. I suggest we keep technical decisions fast, but flag any change that affects another team’s priority before it’s final. That way we keep both speed and one clear direction.'},
  {where:'Supplier call',title:'A supplier delivers test data late — again',problem:'Third late delivery. You need a change without damaging the relationship.',tool:'SBI-I + clear ask',hint:'Facts and impact first, then ask for their view, then agree a date.',model:'On the last three deliveries, the test data arrived between four and six days after the agreed date. Each time, it shifted our analysis window and put pressure on the review. I’d like to understand what’s happening on your side. What would you need to hit the date next time — and can we agree on it today?'},
  {where:'Weekly check-in',title:'Week 2 of your first month',problem:'This week’s single topic: how the team shares information between workstreams.',tool:'Why → question → listen → check back',hint:'Open with why the topic matters, ask an open question, summarise what you heard.',model:'This week I want us to talk about one thing only: how we share information between workstreams. I’m asking because last week two of us worked on the same issue without knowing it. So my question is: what’s one change that would make information flow better? … So what I’m hearing is… Is that right?'},
  {where:'Management meeting',title:'You feel you lack authority',problem:'A senior colleague talks over you while you are presenting.',tool:'Calm hold + return',hint:'Don’t raise your voice. Acknowledge, hold, return to your point.',model:'I’d like to finish this point, because it answers your question. … So, coming back to where I was: the risk is on the interface, and my recommendation is to hold those test cases for ten days.'},
  {where:'Podcast-style Q&A',title:'Someone asks: “What’s the hardest part of your new role?”',problem:'A relaxed, open question — a chance to be human, not only technical.',tool:'Why + honest story + lesson',hint:'Be honest, give one real moment, end with what you learned.',model:'Honestly? Learning that authority and expertise aren’t the same thing. I work with people who know far more than I do on specific subjects — and at first that made me want to know more. What I’m learning is that my job is different: to make sure all that expertise points in the same direction.'}
 ],
 vocab:[
  ['adapting','🎛️','to adapt your message','adapter son message','to change pace, detail and tone for the listener','Adapt your message to what the listener needs today.'],
  ['adapting','🧭','comfort zone / effort zone','zone de confort / zone d’effort','where communicating feels easy / where it needs extra care','Green listeners are in my effort zone.'],
  ['adapting','🤲','to reassure','rassurer','to reduce someone’s worry with facts and support','Reassure the team about what stays the same.'],
  ['update','📣','a heads-up','une alerte, un avertissement anticipé','early information so nobody is surprised','I wanted to give you a heads-up about the test bench.'],
  ['update','⏱️','to slip','glisser (planning)','to be delayed','Qualification has slipped by two weeks.'],
  ['update','🧾','to flag a risk','signaler un risque','to bring a risk to someone’s attention','I’d like to flag one risk.'],
  ['update','🔀','a split approach','une approche en deux temps','doing part of the work now and part later','I recommend a split approach.'],
  ['leading','🛡️','psychological safety','sécurité psychologique','feeling safe to speak up without fear','Psychological safety means people raise problems early.'],
  ['leading','🎬','a fresh start','un nouveau départ','a new beginning with new agreements','I’d like this meeting to be a fresh start.'],
  ['leading','🤝','to set expectations','fixer les attentes','to say clearly what you expect and what others can expect','Let me set expectations in both directions.'],
  ['leading','📅','a check-in','un point régulier','a short regular meeting to review how things are going','We’ll have a weekly check-in for the first month.'],
  ['leading','🧱','to back someone','soutenir quelqu’un','to support someone publicly','I will back you when you raise a problem.'],
  ['roles','🗂️','to own something','être responsable de','to be the person responsible','You own the technical recommendation.'],
  ['roles','⚖️','to arbitrate','arbitrer','to make the final decision between options','Who arbitrates cross-team priorities?'],
  ['roles','🔗','an interface','une interface, un point de contact','where two roles or teams meet','Let’s agree how we handle the interface.'],
  ['roles','✅','to be aligned','être alignés','to agree and work in the same direction','So, to make sure we’re aligned…'],
  ['disagreeing','🗣️','to push back','contester, s’opposer (poliment)','to resist a proposal with reasons','I need to push back on the new schedule.'],
  ['disagreeing','👂','I see it differently','je le vois autrement','a respectful way to disagree','I see it differently, and here’s why.'],
  ['disagreeing','🔁','to disagree and commit','exprimer son désaccord puis s’engager','to say you disagree, then support the final decision','We can disagree and commit.'],
  ['disagreeing','⚠️','actually (false friend)','en fait (≠ actuellement)','in fact; for “actuellement” use “currently”','Actually, the test passed. Currently, we are on schedule.']
 ],
 objectives:[
  ['o1','Adapt the same message to red, yellow, green and blue listeners'],
  ['o2','Deliver a 90-second programme update with SRIRD, answer first'],
  ['o3','Deliver a structured fresh-start talk: why, expectations, disagreement, rhythm'],
  ['o4','Agree roles with the technical leader and close with a check-back'],
  ['o5','Give fact-based feedback (SBI-I) and push back constructively (DESC)'],
  ['o6','Use assertive, concise English instead of over-softened phrasing']
 ],
 report:[['Sinek phrase 1','hw1'],['Sinek phrase 2','hw2'],['Sinek phrase 3','hw3'],['Green reply','grOutput'],['Programme update','srOutput'],['Fresh-start talk','fsOutput'],['Check-back','checkbackInput'],['SBI-I feedback','sbiOutput'],['Homework','homework']]
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
