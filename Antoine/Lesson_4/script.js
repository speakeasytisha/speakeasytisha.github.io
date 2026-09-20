(() => {
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

const state={
  accent:'en-AU', completed:new Set(), grammarScore:0, grammarAnswered:new Set(),
  scenarioOrder:[], scenarioIndex:0, confidence:null, timer:120, timerId:null
};

const phrases=[
  ['Buy time',"That's a good question. Let me think for a second."],
  ['Buy time',"The first thing that comes to mind is..."],
  ['Clarify',"Just to make sure I understand, are you asking about my previous job or what I'm looking for now?"],
  ['Give an example',"A concrete example would be..."],
  ['Reformulate',"Let me rephrase that."],
  ['Reformulate',"What I mean is that..."],
  ['React',"That sounds like the kind of environment I'd enjoy working in."],
  ['Continue',"And from there, the next step was..."],
  ['Correct yourself',"Sorry, let me say that more clearly."],
  ['Ask back',"What does a normal day or shift look like in this role?"]
];

const grammar=[
 {q:'You are talking about a finished period at Decathlon. Which is best?',a:[['I have worked at Decathlon for six years, and I left last year.',false],['I worked at Decathlon for six years, and I left last year.',true],['I am working at Decathlon for six years.',false]],why:'A finished period with a finished past time needs the past simple.',hint:'The period is finished and “last year” is a finished past time.'},
 {q:'Choose the correct sentence about preparation happening up to now.',a:[["I've been preparing for Australia for the past few months.",true],["I prepare for Australia since the past few months.",false],["I prepared for Australia since a few months.",false]],why:'Present perfect continuous is natural for an activity continuing up to now; use “for” + duration.',hint:'Think have/has been + -ing, and “for” + duration.'},
 {q:'Which sentence correctly describes a past habit?',a:[["We use to plan every trip carefully.",false],["We used to plan every trip carefully.",true],["We were use to plan every trip carefully.",false]],why:'Past habit: used to + base verb.',hint:'The form contains -ed: used to.'},
 {q:'Which future sentence is correct?',a:[["When I will arrive in Australia, I'll start applying.",false],["When I arrive in Australia, I'll start applying.",true],["When I arrived in Australia, I'll start applying.",false]],why:'After future “when”, use a present tense, not “will”.',hint:'No “will” in the time clause after “when”.'},
 {q:'Which question is correct?',a:[["What kind of job you are looking for?",false],["What kind of job are you looking for?",true],["What kind of job do you looking for?",false]],why:'With the present continuous, move “are” before the subject.',hint:'The verb “be” moves before the subject in a question.'},
 {q:'Choose the correct direct question.',a:[["Why did you decide to go to Australia?",true],["Why did you decided to go to Australia?",false],["Why you decided to go to Australia?",false]],why:'After “did”, use the base verb: decide.',hint:'Did + base verb.'},
 {q:'Choose the correct third-person form.',a:[["A good employee arrive on time and follow instructions.",false],["A good employee arrives on time and follows instructions.",true],["A good employee does arrives on time.",false]],why:'Third-person singular present simple takes -s on the main verb.',hint:'The subject is singular: “a good employee”.'},
 {q:'Which sentence uses the article correctly?',a:[["I'm looking for job in Australia.",false],["I'm looking for a job in Australia.",true],["I'm looking for an work in Australia.",false]],why:'“Job” is singular countable, so it needs a determiner such as “a”. “Work” is normally uncountable.',hint:'One singular countable noun needs “a/an/the”.'},
 {q:'Which prepositions are correct?',a:[["I want to move in Australia and travel in the country.",false],["I want to move to Australia and travel around the country.",true],["I want to move at Australia and travel to the country.",false]],why:'Move/go to a destination; travel around a country.',hint:'Destination = to; movement within = around.'},
 {q:'Choose the correct reflexive pronoun.',a:[["Marine and I organised the trip by ourself.",false],["Marine and I organised the trip ourselves.",true],["Marine and I organised the trip ourselfs.",false]],why:'We → ourselves. “By ourselves” is possible if you mean without help.',hint:'Plural subject “we” needs a plural reflexive form.'},
 {q:'Choose the most natural English.',a:[["I search a practical job where I can learn fast.",false],["I'm looking for a practical job where I can learn quickly.",true],["I research a manual work for evolve.",false]],why:'“Look for a job” and “learn quickly” are natural. Avoid direct French calques such as “search a job” or “for evolve”.',hint:'Think “look for”, not the French structure with chercher.'},
 {q:'Choose the best connector.',a:[["Although my background is analytical, I'm open to hands-on work.",true],["Although my background is analytical, but I'm open to hands-on work.",false],["Despite my background is analytical, I'm open to hands-on work.",false]],why:'“Although” introduces a clause and does not combine with “but”. “Despite” needs a noun or -ing form.',hint:'Use one contrast connector, not two.'}
];

const corrections=[
  ["I choose this option last time.","I chose this option last time.","Finished past action → past simple."],
  ["We went in Thailand together.","We went to Thailand together.","Go to + destination."],
  ["We plan everything by ourself.","We planned everything ourselves.","Past simple + we → ourselves."],
  ["Marine and I use to travel a lot.","Marine and I used to travel a lot.","Past habit → used to + base verb."],
  ["I am not working since three months.","I've been out of work for three months.","Present perfect / current situation + for + duration."],
  ["I search a job in Australia.","I'm looking for a job in Australia.","Natural collocation: look for a job."],
  ["What I can say about my experience?","What can I say about my experience?","Direct question: modal before subject."],
  ["He don't understand the instructions.","He doesn't understand the instructions.","Third-person singular: doesn't + base verb."],
  ["It's physical work but I am very sportive.","It's physical work, but I'm very active / physically fit.","“Sportive” is a French calque in this context."],
  ["I have an experience of six years in process analysis.","I have six years of experience in process analysis.","Professional experience is normally uncountable."]
];

const vocab={
 "Job search":[
  ["vacancy","offre / poste vacant","an available job","I saw a vacancy that could suit me."],
  ["application","candidature","the act/documents used to apply","I'm preparing applications for different types of jobs."],
  ["recruiter","recruteur","someone who finds or screens candidates","A recruiter contacted me about a role."],
  ["shortlist","présélection","the small group chosen for the next stage","I was shortlisted for an interview."],
  ["referee","personne de référence","someone who can confirm your work experience","I can provide a professional referee if needed."],
  ["availability","disponibilité","when you are able to start or work","My availability is flexible."]
 ],
 "Hands-on work":[
  ["hands-on","pratique / concret","directly involved in practical tasks","I'm open to hands-on work."],
  ["physically demanding","physiquement exigeant","requiring physical effort","I'm comfortable with physically demanding work."],
  ["shift work","travail en horaires décalés","work organised into different time periods","I'd consider shift work if the conditions suited me."],
  ["manual task","tâche manuelle","a task done mainly with physical/practical skills","I don't mind learning new manual tasks."],
  ["outdoor work","travail en extérieur","work done mainly outside","I'd be open to outdoor work."],
  ["safety procedure","procédure de sécurité","a rule/process designed to prevent harm","I understand the importance of following safety procedures."]
 ],
 "Transferable strengths":[
  ["reliable","fiable","can be trusted to do what is expected","I'm reliable and I take responsibility seriously."],
  ["adaptable","adaptable","able to adjust to new situations","I'm adaptable and comfortable learning new routines."],
  ["quick learner","qui apprend vite","someone who learns new tasks rapidly","I'm a quick learner when I understand the objective."],
  ["problem-solving","résolution de problèmes","finding practical solutions to difficulties","My previous work developed my problem-solving skills."],
  ["team player","esprit d'équipe","someone who works well with others","I work well as part of a team."],
  ["disciplined","discipliné","able to follow a routine and stay consistent","Sport has made me very disciplined."]
 ],
 "Australian workplace":[
  ["keen","motivé / partant","interested and enthusiastic","I'd be keen to give that role a try."],
  ["straightforward","direct / simple","clear and uncomplicated","I like straightforward communication."],
  ["roster","planning / roulement","a schedule showing who works when","Could you explain how the roster works?"],
  ["shift","service / plage horaire","a scheduled period of work","What time does the early shift start?"],
  ["onboarding","intégration","the process of starting and learning a new job","What does the onboarding process involve?"],
  ["fit","adéquation","how well someone matches a role or team","I'd like to understand whether the role is a good fit."]
 ]
};

const scenarios=[
 {q:"So, tell me a little about yourself.",h:"Background → strengths → Australia objective. Keep it concise.",b1:"I worked as a process analyst for six years, so I'm used to solving problems, organising information and working with different teams. I'm now preparing to move to Australia, and I'm open to different types of work, including practical jobs.",b2:"I spent six years in process analysis, which gave me a strong base in organisation, problem-solving and cross-team communication. I'm now preparing for Australia and deliberately keeping my options broad, because I'm open to moving into something more practical or hands-on."},
 {q:"Why do you want to work in Australia?",h:"Give a positive reason: international experience + lifestyle + new working environment.",b1:"I want to experience living and working in another country, improve my English and discover a different lifestyle. Australia also appeals to me because I like being active and spending time outdoors.",b2:"I'm looking for a genuine international experience and a change of environment. Australia appeals to me because it combines work opportunities, an outdoor lifestyle and the chance to develop my English in everyday professional situations."},
 {q:"What kind of work are you looking for?",h:"Do not invent one perfect job. Show openness + preferences.",b1:"I'm quite open. I don't need to continue in process analysis. I'd be happy to do practical or hands-on work, and I'm ready to learn something new.",b2:"I'm intentionally keeping the search broad. My previous career was quite analytical, but in Australia I'd be very open to something more practical or hands-on, provided I can learn quickly, work seriously and contribute to the team."},
 {q:"Why aren't you looking only for process-analysis roles?",h:"Respect the old experience; explain the change positively.",b1:"I learned a lot in that job, but I don't feel I need to do exactly the same thing again. Australia is also a chance to try a different type of work.",b2:"I value the experience I gained in process analysis, but I don't want my previous job title to limit the opportunities I consider. Part of the point of Australia is to experience a different working environment and challenge myself in a new way."},
 {q:"What can you bring to a job that is completely different from your previous one?",h:"Transferable skills + behaviour + evidence.",b1:"I'm reliable, organised and used to solving problems. I learn quickly, I work well with other people, and I'm comfortable following clear procedures.",b2:"Even if the job itself is very different, the way I work transfers well. I'm disciplined, reliable and used to understanding a problem quickly, following procedures and working with different people. I'm also very comfortable learning by doing."},
 {q:"Would you be comfortable with physical work?",h:"Answer clearly, then support it with your lifestyle.",b1:"Yes. I'm very active and I train a lot, so physical work doesn't worry me. Of course, I would still need to learn the correct technique and safety rules.",b2:"Yes, I'd be comfortable with that. I train regularly and I'm used to a high level of physical activity, so the demanding side would actually appeal to me. I would still take the safety procedures and proper technique seriously."},
 {q:"What have you been doing since leaving your previous role?",h:"Transition → productive use of time → Australia preparation.",b1:"My previous role ended because of a reorganisation. Since then, I've been preparing for Australia, working on my English and keeping an active routine. I'm now ready to work again.",b2:"My role ended as part of a wider reorganisation, and I've used the transition productively. I've been preparing for Australia, improving my English and thinking carefully about the kind of experience I want next. I'm now ready to return to work and I'm open to a broad range of roles."},
 {q:"What would your previous colleagues say about you?",h:"Choose 2–3 qualities and add evidence.",b1:"I think they would say I'm organised, reliable and calm when there's a problem. I also try to understand different points of view before making a decision.",b2:"They'd probably describe me as reliable, structured and solution-focused. I tend to stay calm when something isn't working, gather the useful information and help people move towards a practical solution."},
 {q:"How do you react when you don't understand an instruction?",h:"Show safe communication: clarify, repeat, confirm.",b1:"I ask the person to explain it again or show me. Then I repeat the instruction in my own words to make sure I understood correctly.",b2:"I wouldn't pretend to understand. I'd ask for clarification, confirm the important steps in my own words and, if it was a practical task, make sure I understood any safety point before starting."},
 {q:"Are you flexible about hours and shifts?",h:"Be open without promising impossible availability.",b1:"Yes, I'm quite flexible. I'd be open to different hours or shifts depending on the job.",b2:"Yes, I have a fair amount of flexibility. I'd be open to early starts, shifts or changing schedules, although I'd obviously want to understand the roster and expectations clearly."},
 {q:"What do you enjoy doing outside work?",h:"Use sport to create rapport, not as a long speech.",b1:"Sport is a big part of my life. I run and train a lot, so I enjoy challenges and staying active. I also like travelling with Marine.",b2:"I'm very active outside work. I run and train regularly, and I enjoy endurance-style challenges. Travel is also important to me, especially sharing those experiences with Marine."},
 {q:"Do you have any questions for me?",h:"Ask about the real job: day/shift, training, team, expectations.",b1:"Yes. What would a normal day look like in this role, and what training would I receive at the beginning?",b2:"Yes. I'd be interested to know what a normal shift looks like, how new employees are trained and what you would expect someone to be able to do independently after the first few weeks."}
];

function speak(text){
 if(!text || !('speechSynthesis' in window)) return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang=state.accent;
 const voices=speechSynthesis.getVoices();
 u.voice=voices.find(v=>v.lang===state.accent)||voices.find(v=>v.lang?.startsWith(state.accent.slice(0,2)))||null;
 u.rate=state.accent==='en-AU'?.94:.96;speechSynthesis.speak(u);
}

function updateProgress(){
 const total=$$('[data-track="section"]').length;
 const pct=Math.round(state.completed.size/total*100);
 $('#progressBar').style.width=pct+'%';$('#progressText').textContent=pct+'%';
}

function renderGrammar(){
 state.grammarScore=0;state.grammarAnswered.clear();
 $('#grammarQuiz').innerHTML=shuffle(grammar).map((g,i)=>{
   const idx=grammar.indexOf(g); const answers=shuffle(g.a);
   return `<article class="quiz-item" data-q="${idx}">
    <h3>${i+1}. ${g.q}</h3>
    <div class="answers">${answers.map(a=>`<button class="answer" type="button" data-ok="${a[1]}">${a[0]}</button>`).join('')}</div>
    <div class="quiz-tools"><button class="btn secondary hint-btn" type="button">💡 Hint</button></div>
    <div class="hint-box hidden">${g.hint}</div><div class="feedback"></div></article>`;
 }).join('');
 $('#grammarScore').textContent=`0 / ${grammar.length}`;
}

function renderCorrections(){
 $('#correctionLab').innerHTML=corrections.map((c,i)=>`
  <article class="correction-item">
    <p><strong>${i+1}. Fix this:</strong></p>
    <div class="correction-target">${c[0]}</div>
    <div class="quiz-tools"><button class="btn secondary reveal-correction" type="button">Show correction</button></div>
    <div class="correction-solution hidden"><strong>${c[1]}</strong><br><span>${c[2]}</span></div>
  </article>`).join('');
}

function renderPhrases(){
 $('#phraseList').innerHTML=phrases.map(p=>`
  <article class="phrase-card">
   <span class="tag">${p[0]}</span>
   <div class="phrase-row"><p>${p[1]}</p><button class="listen-chip" data-speak="${esc(p[1])}" type="button">🔊</button></div>
  </article>`).join('');
}

function esc(t){return String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function setupVocab(){
 const s=$('#vocabCategory');s.innerHTML=Object.keys(vocab).map(k=>`<option>${k}</option>`).join('');
 renderVocab(s.value);s.addEventListener('change',e=>renderVocab(e.target.value));
}
function renderVocab(k){
 $('#vocabGrid').innerHTML=vocab[k].map(v=>`
  <article class="vocab-card">
   <h3>${v[0]} <button class="listen-chip" data-speak="${esc(v[3])}" type="button">🔊</button></h3>
   <p class="fr">${v[1]}</p><p>${v[2]}</p><p class="ex">“${v[3]}”</p>
  </article>`).join('');
}

function buildPitch(){
 const parts=['pitchA','pitchB','pitchC','pitchD'].map(id=>$('#'+id).value.trim()).filter(Boolean);
 $('#pitchOutput').textContent=parts.length?parts.join(' '):'Add at least one idea above.';
}
function resetScenario(){
 state.scenarioOrder=shuffle([...Array(scenarios.length).keys()]);state.scenarioIndex=0;showScenario();
}
function showScenario(){
 const s=scenarios[state.scenarioOrder[state.scenarioIndex]];
 $('#scenarioCounter').textContent=`Question ${state.scenarioIndex+1} of ${scenarios.length}`;
 $('#scenarioQuestion').textContent=s.q;$('#scenarioHint').textContent=s.h;$('#scenarioB1').textContent=s.b1;$('#scenarioB2').textContent=s.b2;
 $('#scenarioHint').classList.add('hidden');$('#scenarioModels').classList.add('hidden');$('#showScenarioModels').textContent='Show models';
}
function nextScenario(){
 state.scenarioIndex++;
 if(state.scenarioIndex>=state.scenarioOrder.length){state.scenarioOrder=shuffle([...Array(scenarios.length).keys()]);state.scenarioIndex=0;}
 showScenario();
}

function updateTimer(){
 const m=String(Math.floor(state.timer/60)).padStart(2,'0'),s=String(state.timer%60).padStart(2,'0');
 $('#timerDisplay').textContent=`${m}:${s}`;
}
function startTimer(){
 if(state.timerId)return;
 state.timerId=setInterval(()=>{state.timer--;updateTimer();if(state.timer<=0){clearInterval(state.timerId);state.timerId=null;speak('Time. Finish your final sentence.');}},1000);
}
function pauseTimer(){if(state.timerId)clearInterval(state.timerId);state.timerId=null}
function resetTimer(){pauseTimer();state.timer=120;updateTimer()}

function save(){
 const data={confidence:state.confidence};
 $$('input[id],textarea[id],select[id]').forEach(el=>{if(!['accent','vocabCategory'].includes(el.id))data[el.id]=el.value});
 localStorage.setItem('antoine-complete-review-australia',JSON.stringify(data));
}
function load(){
 try{
  const d=JSON.parse(localStorage.getItem('antoine-complete-review-australia')||'{}');
  Object.entries(d).forEach(([k,v])=>{
   if(k==='confidence'){state.confidence=v;$$('#confidenceRating button').forEach(b=>b.classList.toggle('selected',b.dataset.score==v));return}
   const el=$('#'+k);if(el&&typeof v==='string')el.value=v;
  });
  if(state.confidence)$('#evaluationSummary').textContent=`Confidence recorded: ${state.confidence}/5.`;
 }catch(e){}
}
function downloadResults(){
 const scores=['scoreGrammar','scoreFluency','scoreVocabulary','scoreNaturalness'].map(id=>`${id.replace('score','')}: ${$('#'+id).value||'not scored'}/5`);
 const fields=[['Fast transfer','transferAnswer'],['Pitch','pitchOutput'],['Career transition','careerAnswer'],['Scenario notes','scenarioNotes'],['Final reflection','finalReflection'],['Trainer note','trainerNote'],['Evaluation','evaluationComment']];
 const text=[
  'ANTOINE · COMPLETE REVIEW · AUSTRALIA JOB SEARCH',
  '================================================',
  `Completed sections: ${state.completed.size}/${$$('[data-track="section"]').length}`,
  `Grammar score: ${state.grammarScore}/${grammar.length}`,
  `Confidence: ${state.confidence||'not selected'}/5`,'','TRAINER SNAPSHOT',...scores,'',
  ...fields.flatMap(([l,id])=>[l.toUpperCase(),($('#'+id)?.value||$('#'+id)?.textContent||'').trim()||'(blank)',''])
 ].join('\n');
 const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download='Antoine_Complete_Review_Australia_results.txt';a.click();URL.revokeObjectURL(a.href);
}
function resetAll(){
 if(!confirm('Reset all answers, scores and progress?'))return;
 pauseTimer();localStorage.removeItem('antoine-complete-review-australia');
 $$('input[id],textarea[id]').forEach(el=>el.value='');
 $$('select[id]').forEach(el=>{if(el.id==='accent')el.value='en-AU';else if(el.id!=='vocabCategory')el.selectedIndex=0});
 state.accent='en-AU';state.completed.clear();state.confidence=null;
 $$('.done-btn').forEach(b=>{b.classList.remove('completed');b.textContent='✓ Mark complete'});
 $$('.models,.hint-box,.correction-solution').forEach(el=>el.classList.add('hidden'));
 $$('#confidenceRating button').forEach(b=>b.classList.remove('selected'));
 $('#pitchOutput').textContent='Your pitch will appear here.';$('#evaluationSummary').textContent='Evaluation not completed yet.';
 renderGrammar();renderCorrections();resetScenario();resetTimer();updateProgress();
}

document.addEventListener('click',e=>{
 const ds=e.target.closest('[data-speak]');if(ds)speak(ds.dataset.speak);
 const st=e.target.closest('.speak-text');if(st)speak(st.dataset.text);

 const done=e.target.closest('.done-btn');
 if(done){const sec=done.closest('[data-track="section"]'),idx=$$('[data-track="section"]').indexOf(sec);
   if(state.completed.has(idx)){state.completed.delete(idx);done.classList.remove('completed');done.textContent='✓ Mark complete'}
   else{state.completed.add(idx);done.classList.add('completed');done.textContent='✓ Completed'}
   updateProgress();
 }

 const tab=e.target.closest('.rule-tab');
 if(tab){$$('.rule-tab').forEach(b=>b.classList.toggle('active',b===tab));$$('[data-rule-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.rulePanel!==tab.dataset.rule));}

 const ans=e.target.closest('.answer');
 if(ans){const item=ans.closest('.quiz-item'),idx=Number(item.dataset.q);if(state.grammarAnswered.has(idx))return;
   state.grammarAnswered.add(idx);const ok=ans.dataset.ok==='true';
   if(ok){state.grammarScore++;ans.classList.add('correct')}else{ans.classList.add('wrong');$$('.answer',item).find(b=>b.dataset.ok==='true')?.classList.add('correct')}
   $$('.answer',item).forEach(b=>b.disabled=true);
   const fb=$('.feedback',item);fb.className='feedback '+(ok?'ok':'bad');fb.textContent=(ok?'Correct. ':'Not quite. ')+grammar[idx].why;
   $('#grammarScore').textContent=`${state.grammarScore} / ${grammar.length}`;
 }
 const hb=e.target.closest('.hint-btn');if(hb)$('.hint-box',hb.closest('.quiz-item')).classList.toggle('hidden');

 const rc=e.target.closest('.reveal-correction');if(rc){const box=$('.correction-solution',rc.closest('.correction-item'));box.classList.toggle('hidden');rc.textContent=box.classList.contains('hidden')?'Show correction':'Hide correction';}

 const mb=e.target.closest('.model-toggle');
 if(mb){const box=$('#'+mb.dataset.model);box.classList.toggle('hidden');mb.textContent=box.classList.contains('hidden')?(mb.dataset.model==='finalModel'?'Show B2 reference AFTER speaking':'Show models'):'Hide models';}
});

$('#accent').addEventListener('change',e=>state.accent=e.target.value);
$('#toggleFrench').addEventListener('click',()=>{document.body.classList.toggle('show-french');$('#toggleFrench').textContent=document.body.classList.contains('show-french')?'🇫🇷 French help: ON':'🇫🇷 French help: OFF'});
$('#resetLesson').addEventListener('click',resetAll);
$('#downloadResults').addEventListener('click',downloadResults);
$('#buildPitch').addEventListener('click',buildPitch);
$('#listenPitch').addEventListener('click',()=>speak($('#pitchOutput').textContent));
$('#nextScenario').addEventListener('click',nextScenario);
$('#listenScenario').addEventListener('click',()=>speak($('#scenarioQuestion').textContent));
$('#showHint').addEventListener('click',()=>$('#scenarioHint').classList.toggle('hidden'));
$('#showScenarioModels').addEventListener('click',()=>{const b=$('#scenarioModels');b.classList.toggle('hidden');$('#showScenarioModels').textContent=b.classList.contains('hidden')?'Show models':'Hide models'});
$('#startTimer').addEventListener('click',startTimer);$('#pauseTimer').addEventListener('click',pauseTimer);$('#resetTimer').addEventListener('click',resetTimer);
$$('#confidenceRating button').forEach(btn=>btn.addEventListener('click',()=>{state.confidence=Number(btn.dataset.score);$$('#confidenceRating button').forEach(b=>b.classList.toggle('selected',b===btn));$('#evaluationSummary').textContent=`Confidence recorded: ${state.confidence}/5.`;save()}));
document.addEventListener('input',e=>{if(e.target.matches('input[id],textarea[id],select[id]'))save()});

renderGrammar();renderCorrections();renderPhrases();setupVocab();resetScenario();resetTimer();load();updateProgress();
if('speechSynthesis' in window)speechSynthesis.getVoices();
})();