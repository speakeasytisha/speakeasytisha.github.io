'use strict';

const $ = (s, scope=document) => scope.querySelector(s);
const $$ = (s, scope=document) => [...scope.querySelectorAll(s)];
const STORAGE_KEY = 'marineSwissLifeWorkLessonV1';

const state = {
  answers: {},
  sequenceCorrect: false,
  lessonSeconds: 3600,
  lessonRunning: false,
  lessonInterval: null,
  speakingSeconds: 90,
  speakingInterval: null
};

const vocab = {
  renewal: [
    {term:'annual recalculation', fr:'recalcul annuel', def:'the process of calculating an amount again for the new annual period', ex:'We are in the annual recalculation period at the moment.'},
    {term:'contribution', fr:'cotisation', def:'an amount paid into a collective insurance or benefit scheme', ex:'We recalculate the contribution using updated employee data.'},
    {term:'insurance premium', fr:'prime / cotisation d’assurance', def:'the amount paid for insurance cover', ex:'The premium depends on the cover and the information used for the calculation.'},
    {term:'renewal period', fr:'période de renouvellement', def:'the period when contracts, prices or conditions are reviewed for a new year', ex:'The renewal period is one of the busiest times of the year.'},
    {term:'previous year’s figures', fr:'chiffres de l’année précédente', def:'the data or amounts used in the prior annual period', ex:'If updated data is missing, the process may use the previous year’s figures.'}
  ],
  employee: [
    {term:'employee data', fr:'données salariés', def:'information about the employees covered by the company plan', ex:'We need accurate employee data before we can finalise the calculation.'},
    {term:'headcount', fr:'effectif', def:'the number of people employed by a company', ex:'The headcount has changed since last year.'},
    {term:'joiner', fr:'salarié entrant / nouvel arrivant', def:'an employee who has recently joined the company', ex:'The file must include any new joiners.'},
    {term:'leaver', fr:'salarié sortant', def:'an employee who has left the company', ex:'A former employee should be recorded as a leaver.'},
    {term:'payroll information', fr:'informations de paie', def:'salary and employment information used by payroll and related processes', ex:'The accountant sends updated payroll information.'}
  ],
  errors: [
    {term:'discrepancy', fr:'écart / anomalie', def:'a difference that suggests something may be incorrect', ex:'We identified a large discrepancy in the amount.'},
    {term:'incorrect entry', fr:'saisie erronée', def:'information entered incorrectly into a form or system', ex:'The problem came from an incorrect entry.'},
    {term:'correction window', fr:'délai de correction', def:'the period during which information can still be corrected', ex:'We need to make the change within the correction window.'},
    {term:'deadline', fr:'date limite', def:'the final time or date by which something must be completed', ex:'The client contacted us before the payment deadline.'},
    {term:'adjustment', fr:'ajustement / régularisation', def:'a change made to correct or update an amount', ex:'The account may need an adjustment after the correct data is received.'}
  ],
  people: [
    {term:'corporate client', fr:'client entreprise', def:'a company that buys a product or service from another company', ex:'You work with corporate clients rather than individual customers.'},
    {term:'accountant', fr:'comptable', def:'a professional responsible for financial records and accounts', ex:'We contact the accountant when the figures need to be checked.'},
    {term:'accounting firm', fr:'cabinet comptable', def:'a company that provides accounting services to clients', ex:'The accounting firm submits information for several companies.'},
    {term:'follow up with', fr:'relancer / faire le suivi avec', def:'to contact someone again to obtain an answer or move a process forward', ex:'I follow up with the accountant if information is missing.'},
    {term:'keep someone informed', fr:'tenir quelqu’un informé', def:'to give regular updates about a situation', ex:'I keep the client informed while the issue is being corrected.'}
  ],
  protection: [
    {term:'group health insurance', fr:'complémentaire santé collective', def:'health insurance provided to a group of employees through their employer', ex:'You work with companies on group health insurance.'},
    {term:'protection insurance', fr:'prévoyance', def:'cover that can protect income or provide benefits in situations such as incapacity, disability or death', ex:'The company offers group health and protection insurance.'},
    {term:'coverage', fr:'couverture / garanties', def:'the protection provided by an insurance plan', ex:'The level of coverage depends on the chosen package.'},
    {term:'benefit package', fr:'ensemble de garanties / formule', def:'a group of benefits offered together', ex:'The client chooses a benefit package for its employees.'},
    {term:'covered employee', fr:'salarié couvert', def:'an employee included in the insurance plan', ex:'The data must match the employees currently covered by the plan.'}
  ]
};

const quizzes = {
  intro: [
    {q:'Which opening is clearest?', options:['At Swiss Life, I work with corporate clients.','Corporate, Swiss Life, I am working clients.','I do insurance things for companies sometimes.'], answer:'At Swiss Life, I work with corporate clients.', hint:'Use subject + verb + clear client type.'},
    {q:'Which phrase explains the insurance area naturally?', options:['I work on group health and protection insurance.','I make health and prévoyance.','I work for the illness of companies.'], answer:'I work on group health and protection insurance.', hint:'Use “work on” + the area or product.'},
    {q:'Which sentence describes the current busy period?', options:['At the moment, we are in a very busy annual recalculation period.','Every moment we calculate all again.','We do again the cotisations now.'], answer:'At the moment, we are in a very busy annual recalculation period.', hint:'Use present continuous / “we are in” for what is happening now.'},
    {q:'Which reason is most precise?', options:['because we have to recalculate annual contributions using updated employee information.','because all is complicated and the accountants do not play the game.','because we redo everything from the people.'], answer:'because we have to recalculate annual contributions using updated employee information.', hint:'Name the action + the data used.'}
  ],
  verbs: [
    {q:'We ___ the annual contributions using the latest employee information.', options:['recalculate','repeat','remake'], answer:'recalculate', hint:'For a calculation done again, use “recalculate”.'},
    {q:'The accountant needs to ___ the updated figures before the deadline.', options:['submit','resolve','base'], answer:'submit', hint:'You submit information or a form.'},
    {q:'First, we ___ the employee data to make sure it is complete.', options:['check','notify','apply'], answer:'check', hint:'You verify information by checking it.'},
    {q:'If information is missing, the amount may be ___ the previous year’s figures.', options:['based on','followed by','filled out'], answer:'based on', hint:'Use “be based on” = use something as the basis.'},
    {q:'When we find an error, we ask for the information to be ___.', options:['corrected','played','paid out'], answer:'corrected', hint:'An error is corrected.'},
    {q:'I ___ with the accountant if I do not receive an answer.', options:['follow up','recalculate','cover'], answer:'follow up', hint:'Contact someone again = follow up.'},
    {q:'I ___ the client as soon as I have confirmation.', options:['notify','calculate','submit'], answer:'notify', hint:'Notify = formally inform.'},
    {q:'Our goal is to ___ the issue before the deadline.', options:['resolve','provide','enter'], answer:'resolve', hint:'Resolve a problem = solve it.'}
  ],
  error: [
    {q:'Professional alternative to “the accountant put the wrong numbers”:', options:['The accountant entered incorrect figures.','The accountant made bad numbers.','The accountant did numbers wrong.'], answer:'The accountant entered incorrect figures.', hint:'Use “enter figures/data” for information typed into a system or form.'},
    {q:'Professional alternative to “the company is stuck paying it”:', options:['The company may remain liable for the amount if the correction is not made within the required timeframe.','The company is blocked with the money.','The company has to eat the bill.'], answer:'The company may remain liable for the amount if the correction is not made within the required timeframe.', hint:'“remain liable for” is formal and precise; in simpler English, “may still have to pay”.'},
    {q:'How do you describe a €300,000 amount that clearly does not match expectations?', options:['a major discrepancy','a funny calculation','a little difference'], answer:'a major discrepancy', hint:'Discrepancy = an unexpected difference.'},
    {q:'Best neutral wording when responsibility is not yet confirmed:', options:['The incorrect amount appears to come from the data provided.','It is definitely the accountant’s fault.','Someone completely messed it up.'], answer:'The incorrect amount appears to come from the data provided.', hint:'Use “appears to” until the cause is confirmed.'},
    {q:'Best next-step sentence:', options:['We need to identify the source of the error and follow the correction procedure.','We must fight with the accountant.','We need to redo all things.'], answer:'We need to identify the source of the error and follow the correction procedure.', hint:'Professional English focuses on the process and next action.'}
  ],
  listening: [
    {q:'Why is the client calling?', options:['The annual contribution amount looks wrong.','They want to change insurance provider.','They want to add a new employee.'], answer:'The annual contribution amount looks wrong.', hint:'Listen to the first sentence after “because”.'},
    {q:'Approximately how much is shown?', options:['€300,000','€30,000','€3,000'], answer:'€300,000', hint:'Listen for “three hundred thousand”.'},
    {q:'What does the client ask to be checked?', options:['The employee information used for the calculation.','The salon opening hours.','The insurance company’s address.'], answer:'The employee information used for the calculation.', hint:'The client asks “Could you please check…”'},
    {q:'Why is time important?', options:['There is a payment deadline.','The salon closes tomorrow.','The accountant is on holiday.'], answer:'There is a payment deadline.', hint:'Listen to the final phrase.'}
  ],
  client: [
    {q:'The client says: “This is impossible! I am not paying €300,000.” Best first response?', options:['I understand why this amount is concerning. Let me check the calculation and the data used.','Calm down. It is probably your accountant.','You need to pay first and complain later.'], answer:'I understand why this amount is concerning. Let me check the calculation and the data used.', hint:'Acknowledge emotion, then move to action.'},
    {q:'You need information from the accountant. Best wording?', options:['I’m going to contact the accountant to verify the figures that were submitted.','I will tell the accountant they made a stupid mistake.','I ask accountant the good numbers.'], answer:'I’m going to contact the accountant to verify the figures that were submitted.', hint:'Use verify + figures submitted.'},
    {q:'You do not yet know how long the correction will take. Best promise?', options:['I’ll keep you updated as soon as I have confirmation of the next step.','It will definitely be fixed today.','I cannot tell you anything.'], answer:'I’ll keep you updated as soon as I have confirmation of the next step.', hint:'Promise communication, not an uncertain outcome.'},
    {q:'Best closing?', options:['We’ll follow the correction procedure and clarify what needs to happen next.','So, that is not our fault.','You need to see with your accountant.'], answer:'We’ll follow the correction procedure and clarify what needs to happen next.', hint:'End with process + next step.'}
  ],
  grammar: [
    {q:'Choose the sentence for a normal process.', options:['We receive the information and check the figures.','We are receiving the information every year usually.','We received normally the information.'], answer:'We receive the information and check the figures.', hint:'Present simple = routine / standard process.'},
    {q:'Choose the sentence for the current busy period.', options:['We are dealing with a very busy period at the moment.','We deal at the moment with busy every day.','We dealt with the period now.'], answer:'We are dealing with a very busy period at the moment.', hint:'At the moment → present continuous.'},
    {q:'Choose the correct conditional.', options:['If we don’t receive the data, we use the previous year’s figures.','If we will not receive the data, we use the previous figures.','If we don’t received the data, we use previous year.'], answer:'If we don’t receive the data, we use the previous year’s figures.', hint:'If + present simple, present simple for a regular consequence.'},
    {q:'Choose the best passive sentence.', options:['The amount is calculated using the information provided.','The amount calculates with the information.','The information is calculate the amount.'], answer:'The amount is calculated using the information provided.', hint:'Passive = be + past participle.'},
    {q:'Choose the most natural sequence connector.', options:['Once we receive the correct figures, we can make the adjustment.','One time we receive the figures, we can adjust.','After received the figures, we adjust it.'], answer:'Once we receive the correct figures, we can make the adjustment.', hint:'Once + subject + present verb.'},
    {q:'Which sentence avoids unnecessary blame?', options:['The file contains incorrect employee data.','The accountant is careless and causes every problem.','They never take anything seriously.'], answer:'The file contains incorrect employee data.', hint:'Describe the verified fact first; identify responsibility only when confirmed.'}
  ]
};

const sequenceSteps = [
  'Receive the updated employee information.',
  'Check that the data is complete and accurate.',
  'Recalculate the annual contribution.',
  'Use the previous year’s figures if required information is missing.',
  'Correct any discrepancy through the required procedure.'
];
let chosenSequence = [];

function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function renderQuiz(containerId, key){
  const container = document.getElementById(containerId);
  container.innerHTML='';
  quizzes[key].forEach((item, i)=>{
    const qid=`${key}-${i}`;
    const wrap=document.createElement('div');
    wrap.className='quiz-item';
    const p=document.createElement('p'); p.textContent=`${i+1}. ${item.q}`; wrap.appendChild(p);
    const options=document.createElement('div'); options.className='options';
    item.options.forEach(opt=>{
      const btn=document.createElement('button'); btn.type='button'; btn.className='option-btn'; btn.textContent=opt;
      btn.addEventListener('click',()=>answerQuestion(qid,item,opt,wrap));
      options.appendChild(btn);
    });
    wrap.appendChild(options);
    const actions=document.createElement('div'); actions.className='question-actions';
    const hintBtn=document.createElement('button'); hintBtn.type='button'; hintBtn.className='hint-btn'; hintBtn.textContent='Hint';
    const hint=document.createElement('div'); hint.className='question-hint hidden'; hint.textContent=item.hint;
    hintBtn.addEventListener('click',()=>hint.classList.toggle('hidden'));
    actions.appendChild(hintBtn); wrap.appendChild(actions); wrap.appendChild(hint);
    const fb=document.createElement('p'); fb.className='feedback'; fb.setAttribute('aria-live','polite'); wrap.appendChild(fb);
    container.appendChild(wrap);
    restoreQuestionState(qid,item,wrap);
  });
}

function answerQuestion(qid,item,opt,wrap){
  state.answers[qid]=opt;
  const buttons=$$('.option-btn',wrap);
  buttons.forEach(btn=>{btn.classList.remove('correct','incorrect'); if(btn.textContent===opt)btn.classList.add(opt===item.answer?'correct':'incorrect');});
  const fb=$('.feedback',wrap);
  if(opt===item.answer){fb.textContent='✓ Correct — keep that wording.';fb.className='feedback good';}
  else{fb.textContent='Not yet — use the hint, then try another option.';fb.className='feedback bad';}
  updateScore(); saveProgress(false);
}

function restoreQuestionState(qid,item,wrap){
  const saved=state.answers[qid]; if(!saved)return;
  const btn=$$('.option-btn',wrap).find(b=>b.textContent===saved); if(btn){btn.classList.add(saved===item.answer?'correct':'incorrect');}
  const fb=$('.feedback',wrap); fb.textContent=saved===item.answer?'✓ Correct — keep that wording.':'Not yet — use the hint, then try another option.'; fb.className=`feedback ${saved===item.answer?'good':'bad'}`;
}

function scoreData(){
  let total=0, correct=0;
  Object.entries(quizzes).forEach(([key,items])=>items.forEach((item,i)=>{total++; if(state.answers[`${key}-${i}`]===item.answer)correct++;}));
  total += sequenceSteps.length;
  if(state.sequenceCorrect) correct += sequenceSteps.length;
  return {total,correct,percent:total?Math.round(correct/total*100):0};
}

function updateScore(){
  const s=scoreData();
  $('#scoreCorrect').textContent=s.correct; $('#scoreTotal').textContent=s.total; $('#scoreBar').style.width=`${s.percent}%`; $('#scorePercent').textContent=`${s.percent}% · ${s.correct} correct`;
  $('#finalScore').textContent=`${s.correct} / ${s.total}`; $('#finalPercent').textContent=`${s.percent}% automatic score`;
}

function renderVocab(){
  const cat=$('#vocabCategory').value; const list=$('#vocabList'); list.innerHTML='';
  vocab[cat].forEach(item=>{
    const row=document.createElement('article'); row.className='vocab-item';
    row.innerHTML=`<div class="vocab-term"><strong>${item.term}</strong><span>${item.fr}</span></div><div class="vocab-def">${item.def}</div><div class="vocab-example">“${item.ex}”</div><div class="audio-stack"><button type="button" aria-label="Listen to term" title="Listen to term">▶</button><button type="button" aria-label="Listen to example" title="Listen to example">◉</button></div>`;
    const [termBtn,exBtn]=$$('button',row); termBtn.addEventListener('click',()=>speak(item.term)); exBtn.addEventListener('click',()=>speak(item.ex)); list.appendChild(row);
  });
}

function speak(text){
  if(!('speechSynthesis' in window)){showToast('Audio is not supported in this browser.');return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text); u.lang=$('#voiceAccent').value; u.rate=.92;
  const voices=window.speechSynthesis.getVoices(); const prefix=u.lang.toLowerCase();
  const match=voices.find(v=>v.lang.toLowerCase()===prefix)||voices.find(v=>v.lang.toLowerCase().startsWith(prefix.split('-')[0])); if(match)u.voice=match;
  window.speechSynthesis.speak(u);
}

function renderSequence(){
  const options=$('#sequenceOptions'); options.innerHTML='';
  shuffle(sequenceSteps).forEach(step=>{
    const btn=document.createElement('button'); btn.type='button'; btn.className='sequence-step'; btn.textContent=step;
    if(chosenSequence.includes(step))btn.classList.add('used');
    btn.addEventListener('click',()=>{if(!chosenSequence.includes(step)){chosenSequence.push(step);renderSequence();renderChosen();}}); options.appendChild(btn);
  });
  renderChosen();
}
function renderChosen(){
  const box=$('#sequenceChosen'); box.innerHTML=''; chosenSequence.forEach((step,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='sequence-step';btn.textContent=`${i+1}. ${step}`;btn.title='Click to remove';btn.addEventListener('click',()=>{chosenSequence=chosenSequence.filter(s=>s!==step);state.sequenceCorrect=false;renderSequence();updateScore();});box.appendChild(btn);});
}
function checkSequence(){
  const fb=$('#sequenceFeedback');
  if(chosenSequence.length!==sequenceSteps.length){fb.textContent='Add all five steps before checking.';fb.className='feedback bad';return;}
  state.sequenceCorrect=chosenSequence.every((s,i)=>s===sequenceSteps[i]);
  fb.textContent=state.sequenceCorrect?'✓ Excellent — the process is clear and chronological.':'Not yet. Focus on the normal process first, then the fallback and correction.'; fb.className=`feedback ${state.sequenceCorrect?'good':'bad'}`; updateScore(); saveProgress(false);
}

function toggleModel(target){document.getElementById(target).classList.toggle('hidden');}

function formatTime(seconds){const m=Math.floor(seconds/60).toString().padStart(2,'0');const s=(seconds%60).toString().padStart(2,'0');return `${m}:${s}`;}
function updateLessonTimer(){ $('#lessonTimer').textContent=formatTime(state.lessonSeconds); }
function startLessonTimer(){if(state.lessonRunning)return;state.lessonRunning=true;state.lessonInterval=setInterval(()=>{if(state.lessonSeconds>0){state.lessonSeconds--;updateLessonTimer();}else{pauseLessonTimer();showToast('60 minutes complete — finish with your speaking mission.');}},1000);}
function pauseLessonTimer(){state.lessonRunning=false;if(state.lessonInterval){clearInterval(state.lessonInterval);state.lessonInterval=null;}}
function resetLessonTimer(){pauseLessonTimer();state.lessonSeconds=3600;updateLessonTimer();}
function startSpeaking(){clearInterval(state.speakingInterval);state.speakingSeconds=90;$('#speakingTimer').textContent=formatTime(state.speakingSeconds);state.speakingInterval=setInterval(()=>{state.speakingSeconds--;$('#speakingTimer').textContent=formatTime(Math.max(0,state.speakingSeconds));if(state.speakingSeconds<=0){clearInterval(state.speakingInterval);showToast('90 seconds — stop and review your structure.');}},1000);}
function resetSpeaking(){clearInterval(state.speakingInterval);state.speakingSeconds=90;$('#speakingTimer').textContent='01:30';}

function saveProgress(show=true){
  const values={}; $$('[data-save]').forEach(el=>values[el.dataset.save]=el.type==='checkbox'?el.checked:el.value);
  const payload={answers:state.answers,sequenceCorrect:state.sequenceCorrect,chosenSequence,values,french:$('#frenchToggle').checked,accent:$('#voiceAccent').value};
  localStorage.setItem(STORAGE_KEY,JSON.stringify(payload)); if(show)showToast('Progress saved on this device.');
}
function loadProgress(){
  try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;const p=JSON.parse(raw);state.answers=p.answers||{};state.sequenceCorrect=!!p.sequenceCorrect;chosenSequence=p.chosenSequence||[];if(p.values){$$('[data-save]').forEach(el=>{if(Object.prototype.hasOwnProperty.call(p.values,el.dataset.save)){if(el.type==='checkbox')el.checked=!!p.values[el.dataset.save];else el.value=p.values[el.dataset.save];}});} if(typeof p.french==='boolean')$('#frenchToggle').checked=p.french;if(p.accent)$('#voiceAccent').value=p.accent;}catch(e){console.warn(e);}
}
function resetAll(){
  if(!confirm('Reset all answers, saved notes and scores for this lesson?'))return;
  localStorage.removeItem(STORAGE_KEY); state.answers={};state.sequenceCorrect=false;chosenSequence=[];$$('[data-save]').forEach(el=>{if(el.type==='checkbox')el.checked=false;else el.value='';});
  ['intro','verbs','error','listening','client','grammar'].forEach(k=>renderQuiz(`${k==='verbs'?'verb':k}Quiz`,k));renderSequence();$('#sequenceFeedback').textContent='';updateScore();showToast('Lesson reset.');
}
function downloadResults(){
  const s=scoreData(); const intro=$('[data-save="myIntro"]').value.trim()||'Not entered'; const notes=$('[data-save="speakingNotes"]').value.trim()||'Not entered';
  const text=`MARINE — MY WORK AT SWISS LIFE\nProfessional English · A2+ → B1\n\nAUTOMATIC SCORE\n${s.correct}/${s.total} (${s.percent}%)\n\nMY PROFESSIONAL INTRODUCTION\n${intro}\n\nMY SPEAKING KEY WORDS\n${notes}\n\nFIVE SENTENCES TO KEEP\n1. This is one of the busiest periods of the year because we have to recalculate annual contributions.\n2. We use updated employee information provided by the company or its accountant.\n3. If we don’t receive the information in time, the calculation may be based on the previous year’s figures.\n4. If there is a discrepancy, we identify the source of the error and follow the correction procedure.\n5. I keep the client informed while I coordinate with the accountant to resolve the issue.\n\nVOCABULARY PRIORITIES\nannual recalculation · contribution · insurance premium · employee data · headcount · discrepancy · correction window · adjustment · follow up · resolve\n\nGenerated ${new Date().toLocaleString('en-GB')}`;
  const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Marine_SwissLife_Work_English_Results.txt';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast._t);showToast._t=setTimeout(()=>t.classList.remove('show'),2200);}

function setupNavigation(){
  const links=$$('#sectionNav a'); const sections=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${e.target.id}`));}});},{rootMargin:'-25% 0px -65% 0px',threshold:0});
  sections.forEach(s=>observer.observe(s));
}

function init(){
  loadProgress();
  renderQuiz('introQuiz','intro');renderQuiz('verbQuiz','verbs');renderQuiz('errorQuiz','error');renderQuiz('listeningQuiz','listening');renderQuiz('clientQuiz','client');renderQuiz('grammarQuiz','grammar');
  renderVocab();renderSequence();updateScore();updateLessonTimer();
  document.body.classList.toggle('hide-fr',!$('#frenchToggle').checked);
  $('#frenchToggle').addEventListener('change',e=>{document.body.classList.toggle('hide-fr',!e.target.checked);saveProgress(false);});
  $('#voiceAccent').addEventListener('change',()=>saveProgress(false));
  $$('.speak').forEach(btn=>btn.addEventListener('click',()=>speak(btn.dataset.speak)));
  $$('.model-toggle').forEach(btn=>btn.addEventListener('click',()=>toggleModel(btn.dataset.target)));
  $('#vocabCategory').addEventListener('change',renderVocab);
  $('#playCategory').addEventListener('click',()=>{const items=vocab[$('#vocabCategory').value];speak(items.map(x=>`${x.term}. ${x.ex}`).join(' '));});
  $('#checkSequence').addEventListener('click',checkSequence);$('#resetSequence').addEventListener('click',()=>{chosenSequence=[];state.sequenceCorrect=false;renderSequence();$('#sequenceFeedback').textContent='';updateScore();saveProgress(false);});
  $('#sequenceHintBtn').addEventListener('click',()=>$('#sequenceHint').classList.toggle('hidden'));
  $('#playClientAudio').addEventListener('click',()=>speak($('#clientTranscript').textContent.trim()));
  $('#toggleTranscript').addEventListener('click',e=>{const tr=$('#clientTranscript');tr.classList.toggle('hidden');e.currentTarget.textContent=tr.classList.contains('hidden')?'Show transcript':'Hide transcript';});
  $('#clientHintBtn').addEventListener('click',()=>$('#clientHint').classList.toggle('hidden'));
  $('#saveBtn').addEventListener('click',()=>saveProgress(true));$('#resetAllBtn').addEventListener('click',resetAll);
  $$('[data-save]').forEach(el=>el.addEventListener('input',()=>saveProgress(false)));
  $('#timerStart').addEventListener('click',startLessonTimer);$('#timerPause').addEventListener('click',pauseLessonTimer);$('#timerReset').addEventListener('click',resetLessonTimer);
  $('#speakingStart').addEventListener('click',startSpeaking);$('#speakingReset').addEventListener('click',resetSpeaking);
  $('#downloadResults').addEventListener('click',downloadResults);$('#printBtn').addEventListener('click',()=>window.print());
  setupNavigation();
}

document.addEventListener('DOMContentLoaded',init);
