'use strict';

const STORAGE_KEY = 'cfl_thomas_lesson3_data_to_decision_v1';
const evidenceKeys = ['welcome','review','framework','vocabulary','causeEffect','modals','precision','scenario1','scenario2','uncertainty','qa','presentation','kickoff'];
const autoTotals = { review:4, cause:10, modals:10, precision:6, uncertainty:6, qa:6 };
const vocabData = [
  {c:'data',term:'baseline',fr:'référence / état de référence',def:'The reference condition used for comparison.',ex:'We compared the latest result with the baseline.'},
  {c:'data',term:'trend',fr:'tendance',def:'The general direction in which a value changes.',ex:'The overall trend is upward.'},
  {c:'data',term:'deviation',fr:'écart',def:'A difference from a reference or expected value.',ex:'The largest deviation occurs at the final test point.'},
  {c:'data',term:'variation',fr:'variation',def:'A change or difference in a measured value.',ex:'The variation remains within the expected range.'},
  {c:'data',term:'repeatable',fr:'reproductible',def:'Able to occur again under the same conditions.',ex:'We need to determine whether the result is repeatable.'},
  {c:'data',term:'consistent',fr:'cohérent / constant',def:'Showing the same pattern across several observations.',ex:'The trend is consistent across the completed runs.'},
  {c:'data',term:'measurable',fr:'mesurable',def:'Large or clear enough to be measured.',ex:'Configuration B shows a measurable efficiency gain.'},
  {c:'data',term:'relative to',fr:'par rapport à',def:'Compared with a reference value or condition.',ex:'The value increased relative to the baseline.'},
  {c:'cause',term:'due to',fr:'dû à',def:'Used before a noun phrase to give a cause.',ex:'The increase may be due to the revised condition.'},
  {c:'cause',term:'because of',fr:'à cause de / en raison de',def:'Used before a noun phrase to explain why something happened.',ex:'The test was repeated because of the unexpected result.'},
  {c:'cause',term:'result from',fr:'résulter de',def:'To be caused by something.',ex:'The variation may result from measurement uncertainty.'},
  {c:'cause',term:'result in',fr:'entraîner / aboutir à',def:'To cause a consequence.',ex:'Higher loading could result in faster degradation.'},
  {c:'cause',term:'lead to',fr:'conduire à / entraîner',def:'To cause or contribute to a result.',ex:'The change may lead to a reduction in margin.'},
  {c:'cause',term:'be linked to',fr:'être lié à',def:'To have a possible relationship with something.',ex:'The increase may be linked to the operating condition.'},
  {c:'cause',term:'correlate with',fr:'être corrélé avec',def:'To change in a related way without necessarily proving cause.',ex:'The temperature rise correlates with the higher load point.'},
  {c:'cause',term:'driver',fr:'facteur déterminant',def:'A factor that strongly influences an outcome.',ex:'We need to identify the main driver of the trend.'},
  {c:'caution',term:'may / might / could',fr:'peut / pourrait',def:'Modals used to express possibility rather than certainty.',ex:'This could affect the durability margin.'},
  {c:'caution',term:'appears to',fr:'semble',def:'Indicates an observation that is not fully confirmed.',ex:'The trend appears to be repeatable.'},
  {c:'caution',term:'suggests that',fr:'suggère que',def:'Indicates that evidence points toward an interpretation.',ex:'The data suggests that the change is beneficial.'},
  {c:'caution',term:'one possible explanation is',fr:'une explication possible est',def:'Introduces a hypothesis without claiming certainty.',ex:'One possible explanation is the revised geometry.'},
  {c:'caution',term:'at this stage',fr:'à ce stade',def:'Limits a conclusion to the evidence available now.',ex:'At this stage, we cannot confirm the cause.'},
  {c:'caution',term:'based on the current data',fr:'sur la base des données actuelles',def:'Anchors a statement in currently available evidence.',ex:'Based on the current data, the result is encouraging.'},
  {c:'caution',term:'draw a conclusion',fr:'tirer une conclusion',def:'Reach a judgment after considering evidence.',ex:'We need more data before drawing a conclusion.'},
  {c:'caution',term:'speculate',fr:'spéculer / émettre une hypothèse non fondée',def:'Guess without enough evidence.',ex:'I would not want to speculate without additional data.'},
  {c:'impact',term:'have an impact on',fr:'avoir un impact sur',def:'Affect a result, component or decision.',ex:'The temperature trend could have an impact on durability.'},
  {c:'impact',term:'durability margin',fr:'marge de durabilité',def:'Remaining tolerance before a durability constraint becomes limiting.',ex:'The increase could reduce the available durability margin.'},
  {c:'impact',term:'trade-off',fr:'compromis',def:'A balance in which improving one aspect may worsen another.',ex:'We need to understand the performance–durability trade-off.'},
  {c:'impact',term:'risk',fr:'risque',def:'The possibility of an undesirable consequence.',ex:'This could increase the risk of degradation.'},
  {c:'impact',term:'constraint',fr:'contrainte',def:'A limit or requirement that restricts a solution.',ex:'Temperature remains an important design constraint.'},
  {c:'impact',term:'margin',fr:'marge',def:'The remaining difference between the current value and a limit.',ex:'The current result leaves less margin than the baseline.'},
  {c:'impact',term:'performance benefit',fr:'gain de performance',def:'An improvement in the desired technical result.',ex:'Configuration B provides a clear performance benefit.'},
  {c:'impact',term:'degradation',fr:'dégradation',def:'A reduction in condition or performance over time.',ex:'Higher thermal loading may accelerate degradation.'},
  {c:'action',term:'investigate',fr:'examiner / investiguer',def:'Study a problem or cause in more detail.',ex:'We should investigate the cause further.'},
  {c:'action',term:'confirm',fr:'confirmer',def:'Verify that a result or hypothesis is correct.',ex:'The next test should confirm whether the trend is repeatable.'},
  {c:'action',term:'monitor',fr:'surveiller / suivre',def:'Observe a parameter over time.',ex:'We should monitor this parameter during the next campaign.'},
  {c:'action',term:'compare',fr:'comparer',def:'Examine similarities and differences.',ex:'We need to compare the two configurations under equivalent conditions.'},
  {c:'action',term:'validate',fr:'valider',def:'Check that a result or solution meets the required criteria.',ex:'The team still needs to validate the updated condition.'},
  {c:'action',term:'further testing',fr:'essais complémentaires',def:'Additional tests performed to reduce uncertainty.',ex:'Further testing is required before final selection.'},
  {c:'action',term:'next step',fr:'prochaine étape',def:'The next planned action in the process.',ex:'The next step is to repeat the condition.'},
  {c:'action',term:'final selection',fr:'choix final',def:'The final decision between candidate options.',ex:'We should complete the durability work before final selection.'},
  {c:'qa',term:'If I understand your question correctly…',fr:'Si je comprends bien votre question…',def:'Checks the meaning of a question before answering.',ex:'If I understand your question correctly, you are asking about repeatability.'},
  {c:'qa',term:'That’s a valid concern.',fr:'C’est une préoccupation légitime.',def:'Acknowledges a challenge professionally before responding.',ex:'That’s a valid concern. What we are seeing so far is…'},
  {c:'qa',term:'I don’t have that figure with me.',fr:'Je n’ai pas ce chiffre sous les yeux.',def:'Professional way to avoid inventing a number.',ex:'I don’t have that figure with me, but I can confirm it after the meeting.'},
  {c:'qa',term:'We haven’t investigated that point yet.',fr:'Nous n’avons pas encore étudié ce point.',def:'States a current scope limit without sounding defensive.',ex:'We haven’t investigated that point yet, so I would prefer not to speculate.'},
  {c:'qa',term:'What we can say with confidence is…',fr:'Ce que nous pouvons affirmer avec confiance, c’est…',def:'Redirects a question toward verified information.',ex:'What we can say with confidence is that the trend appears in all three runs.'},
  {c:'qa',term:'I can check and come back to you.',fr:'Je peux vérifier et revenir vers vous.',def:'Commits to a follow-up when information is missing.',ex:'I can check the exact figure and come back to you after the meeting.'},
  {c:'qa',term:'Let me put it another way.',fr:'Laissez-moi le formuler autrement.',def:'Reformulates an answer when the first version was unclear.',ex:'Let me put it another way: the result is promising, but not yet conclusive.'},
  {c:'qa',term:'The key point is…',fr:'Le point essentiel est…',def:'Focuses the audience on the most important message.',ex:'The key point is that we still need durability evidence.'}
];

const state = {
  sectionIndex:0,
  sessionSeconds:3600,
  sessionTimer:null,
  quiz:{review:{},cause:{},modals:{},uncertainty:{},qa:{}},
  precision:{},
  manual:{},
  evidence:{},
  fields:{},
  vocabViewed:[],
  vocabReviewed:false,
  reserveDone:false,
  qaIndex:-1
};

const sections = [...document.querySelectorAll('.lesson-section')];
const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];

function init(){
  restoreState();
  buildStepDots();
  renderVocabulary();
  bindNavigation(); bindHeader(); bindSessionTimer(); bindSpeech(); bindQuizzes(); bindPrecision(); bindBuilders(); bindFields(); bindManual(); bindTimers(); bindQA(); bindEvidenceControls(); bindExports();
  restoreUI();
  setDate();
  updateAll();
  showSection(Math.min(state.sectionIndex, sections.length-1), false);
  randomizeQuizOptions();
}
document.addEventListener('DOMContentLoaded', init);

function buildStepDots(){
  const root=$('stepDots'); if(!root)return; root.innerHTML='';
  sections.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=i+1;b.title=s.dataset.title||`Section ${i+1}`;b.setAttribute('aria-label',`${i+1}. ${s.dataset.title||''}`);b.addEventListener('click',()=>showSection(i));root.appendChild(b);});
}
function bindNavigation(){
  $$('[data-next]').forEach(b=>b.addEventListener('click',()=>showSection(Math.min(state.sectionIndex+1,sections.length-1))));
  $$('[data-prev]').forEach(b=>b.addEventListener('click',()=>showSection(Math.max(state.sectionIndex-1,0))));
  $('backTop')?.addEventListener('click',()=>showSection(0)); $('footerTop')?.addEventListener('click',()=>showSection(0));
}
function showSection(i,scroll=true){
  state.sectionIndex=i; sections.forEach((s,n)=>s.classList.toggle('active',n===i)); updateProgress(); saveState(); if(scroll)window.scrollTo({top:0,behavior:'smooth'});
}
function updateProgress(){
  const pct=((state.sectionIndex+1)/sections.length)*100; if($('progressBar'))$('progressBar').style.width=`${pct}%`; if($('progressLabel'))$('progressLabel').textContent=sections[state.sectionIndex]?.dataset.title||''; $$('#stepDots button').forEach((b,i)=>b.classList.toggle('active',i===state.sectionIndex));
}

function bindHeader(){
  $('translationToggle')?.addEventListener('click',()=>{const show=document.body.classList.toggle('show-fr'); const b=$('translationToggle');b.classList.toggle('active',show);b.setAttribute('aria-pressed',String(show));b.querySelector('span:last-child').textContent=show?'Support visible':'Show French support';state.fields.__fr=show;saveState();});
  $('resetAll')?.addEventListener('click',()=>{if(confirm('Reset the entire lesson? All saved answers, scores and trainer evaluations for Lesson 3 will be erased.')){localStorage.removeItem(STORAGE_KEY);location.reload();}});
}
function bindSessionTimer(){
  $('timerStart')?.addEventListener('click',()=>{if(state.sessionTimer)return;state.sessionTimer=setInterval(()=>{if(state.sessionSeconds<=0){pauseSession();return}state.sessionSeconds--;updateSessionDisplay();},1000)});
  $('timerPause')?.addEventListener('click',pauseSession);
  $('timerReset')?.addEventListener('click',()=>{pauseSession();state.sessionSeconds=3600;updateSessionDisplay();saveState();}); updateSessionDisplay();
}
function pauseSession(){if(state.sessionTimer)clearInterval(state.sessionTimer);state.sessionTimer=null;saveState();}
function updateSessionDisplay(){const m=String(Math.floor(state.sessionSeconds/60)).padStart(2,'0');const s=String(state.sessionSeconds%60).padStart(2,'0');if($('sessionTimer'))$('sessionTimer').textContent=`${m}:${s}`;}

function bindSpeech(){
  document.addEventListener('click',e=>{const b=e.target.closest('.speak-button');if(!b)return;let text=b.dataset.speak||'';if(b.id==='speakLogic')text=$('logicOutput')?.textContent||'';if(b.id==='speakKickoff')text=$('kickoffPreview')?.textContent||'';if(text)speak(text);});
}
function speak(text){
  if(!('speechSynthesis'in window)){toast('Speech synthesis is not available in this browser.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const lang=$('accentSelect')?.value||'en-US';u.lang=lang;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang===lang)||voices.find(v=>v.lang?.startsWith(lang.slice(0,2)))||null;u.rate=.93;u.pitch=1;speechSynthesis.speak(u);
}

function randomizeQuizOptions(){
  $$('.quiz-item .options').forEach(root=>{const buttons=[...root.children];for(let i=buttons.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[buttons[i],buttons[j]]=[buttons[j],buttons[i]];}buttons.forEach(b=>root.appendChild(b));});
}
function bindQuizzes(){
  $$('[data-quiz]').forEach(root=>{const key=root.dataset.quiz;if(!state.quiz[key])state.quiz[key]={};[...root.querySelectorAll('.quiz-item')].forEach((item,idx)=>{item.querySelectorAll('button[data-answer]').forEach(btn=>btn.addEventListener('click',()=>handleQuizAnswer(key,item,idx,btn)));});});
}
function handleQuizAnswer(key,item,idx,btn){
  const correct=btn.dataset.answer===item.dataset.correct;state.quiz[key][idx]={answer:btn.dataset.answer,correct,attempted:true};item.querySelectorAll('button[data-answer]').forEach(b=>b.classList.remove('is-correct','is-wrong'));btn.classList.add(correct?'is-correct':'is-wrong');const fb=item.querySelector('.quiz-feedback');if(fb){fb.className='quiz-feedback '+(correct?'correct':'wrong');fb.textContent=correct?'✓ Correct':'✗ Try again — change your answer.';}if(allQuizAttempted(key))markEvidence(quizEvidenceKey(key),true);saveState();updateAll();
}
function allQuizAttempted(key){const root=document.querySelector(`[data-quiz="${key}"]`);if(!root)return false;return root.querySelectorAll('.quiz-item').length===Object.values(state.quiz[key]||{}).filter(v=>v.attempted).length;}
function quizScore(key){return Object.values(state.quiz[key]||{}).filter(v=>v.correct).length;}
function quizEvidenceKey(key){return key==='cause'?'causeEffect':key;}

function bindPrecision(){
  $$('#precisionLab .sort-row').forEach((row,idx)=>{row.querySelector('select').addEventListener('change',e=>{const correct=e.target.value===row.dataset.answer;state.precision[idx]={value:e.target.value,correct,attempted:Boolean(e.target.value)};row.classList.toggle('correct',correct);row.classList.toggle('wrong',Boolean(e.target.value)&&!correct);row.querySelector('em').textContent=!e.target.value?'':correct?'✓ Correct':'Try again';if(Object.values(state.precision).filter(x=>x.attempted).length===6)markEvidence('precision',true);saveState();updateAll();});});
}
function precisionScore(){return Object.values(state.precision).filter(v=>v.correct).length;}

function bindBuilders(){
  $$('#logicBuilder select').forEach(s=>s.addEventListener('change',()=>{updateLogic();saveState();}));
  $('copyLogic')?.addEventListener('click',()=>copyText($('logicOutput')?.textContent||''));
  $('saveLogicToKickoff')?.addEventListener('click',()=>{const f=document.querySelector('[data-save="kickoffData"]');if(f){f.value=(f.value?f.value+'\n':'')+($('logicOutput')?.textContent||'');state.fields.kickoffData=f.value;updateKickoff();saveState();toast('Added to kickoff notes.');}});
  $$('#recommendationBuilder select').forEach(s=>s.addEventListener('change',()=>{updateRecommendation();saveState();}));
  $$('.kickoff-field').forEach(f=>f.addEventListener('input',()=>{state.fields[f.dataset.save]=f.value;updateKickoff();saveState();}));
  $$('.phrase-palette button').forEach(b=>b.addEventListener('click',()=>{const target=$$('.kickoff-field').find(x=>document.activeElement===x)||document.querySelector('[data-save="kickoffImpact"]');if(target){const start=target.selectionStart??target.value.length;const end=target.selectionEnd??target.value.length;target.value=target.value.slice(0,start)+b.dataset.insert+target.value.slice(end);state.fields[target.dataset.save]=target.value;target.focus();target.selectionStart=target.selectionEnd=start+b.dataset.insert.length;updateKickoff();saveState();}}));
  $('copyKickoff')?.addEventListener('click',()=>copyText($('kickoffPreview')?.textContent||''));
  updateLogic();updateRecommendation();updateKickoff();
}
function updateLogic(){const vals=$$('#logicBuilder select').map(s=>s.value);if($('logicOutput'))$('logicOutput').textContent=vals.join(' ');}
function updateRecommendation(){const vals=$$('#recommendationBuilder select').map(s=>s.value);if($('recommendationOutput'))$('recommendationOutput').textContent=vals.join(' ');}
function updateKickoff(){const parts=['kickoffOpen','kickoffData','kickoffImpact','kickoffAction','kickoffClose'].map(k=>(state.fields[k]||'').trim()).filter(Boolean);if($('kickoffPreview'))$('kickoffPreview').textContent=parts.length?parts.join('\n\n'):'Start filling the blocks to build your script.';}

function bindFields(){
  $$('.save-field').forEach(f=>{if(f.id==='confidenceSlider')return;f.addEventListener('input',()=>{state.fields[f.dataset.save]=f.value;saveState();});f.addEventListener('change',()=>{state.fields[f.dataset.save]=f.value;saveState();});});
  $('confidenceSlider')?.addEventListener('input',()=>{state.fields.confidence=$('confidenceSlider').value;$('confidenceValue').textContent=`${$('confidenceSlider').value} / 10`;saveState();updateReport();});
  $('vocabReviewed')?.addEventListener('change',()=>{state.vocabReviewed=$('vocabReviewed').checked;if(state.vocabReviewed)markEvidence('vocabulary',true);else markEvidence('vocabulary',false);saveState();updateAll();});
  $('reserveDone')?.addEventListener('change',()=>{state.reserveDone=$('reserveDone').checked;state.evidence.reserve=state.reserveDone;saveState();updateEvidenceUI();});
}

function renderVocabulary(){
  const root=$('vocabList'); if(!root)return;root.innerHTML='';vocabData.forEach((v,i)=>{const d=document.createElement('details');d.className='vocab-card';d.dataset.category=v.c;d.dataset.index=i;d.innerHTML=`<summary><strong>${escapeHtml(v.term)}</strong><span>${categoryName(v.c)}</span></summary><div class="vocab-body"><dl><dt>FR</dt><dd>${escapeHtml(v.fr)}</dd><dt>Definition</dt><dd>${escapeHtml(v.def)}</dd><dt>Example</dt><dd>${escapeHtml(v.ex)}</dd></dl><button class="mini-button vocab-audio" type="button">🔊 Listen</button></div>`;d.addEventListener('toggle',()=>{if(d.open&&!state.vocabViewed.includes(i)){state.vocabViewed.push(i);saveState();updateVocabCount();}});d.querySelector('.vocab-audio').addEventListener('click',()=>speak(`${v.term}. ${v.ex}`));root.appendChild(d);});
  $$('#vocabFilters button').forEach(b=>b.addEventListener('click',()=>{$$('#vocabFilters button').forEach(x=>x.classList.toggle('active',x===b));const f=b.dataset.filter;$$('.vocab-card').forEach(c=>c.style.display=(f==='all'||c.dataset.category===f)?'block':'none');}));updateVocabCount();
}
function categoryName(c){return {data:'Data & trends',cause:'Cause & effect',caution:'Caution',impact:'Impact',action:'Actions',qa:'Q&A'}[c]||c;}
function updateVocabCount(){if($('vocabViewed'))$('vocabViewed').textContent=`${state.vocabViewed.length} terms opened`;}

function bindManual(){
  $$('.manual-mini').forEach(root=>{const key=root.dataset.rubric;root.querySelectorAll('button[data-value]').forEach(btn=>btn.addEventListener('click',()=>{state.manual[key]={type:'simple',score:Number(btn.dataset.value),max:4};root.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));markEvidence(manualEvidenceKey(key),true);saveState();updateAll();}));});
  $$('.manual-rubric').forEach(root=>{const key=root.dataset.rubric;root.querySelectorAll('select').forEach(sel=>sel.addEventListener('change',()=>{const vals=[...root.querySelectorAll('select')].map(s=>Number(s.value)||0);const rated=vals.filter(Boolean).length;state.manual[key]={type:'criteria',scores:vals,maxEach:Math.max(...[...root.querySelectorAll('select option')].map(o=>Number(o.value)||0),1),rated,totalCriteria:vals.length};if(rated===vals.length)markEvidence(manualEvidenceKey(key),true);else markEvidence(manualEvidenceKey(key),false);saveState();updateAll();}));});
}
function manualEvidenceKey(k){if(k==='framework')return'framework';if(k==='scenario1')return'scenario1';if(k==='scenario2')return'scenario2';if(k==='uncertaintyWrite')return'uncertainty';if(k==='qaOral')return'qa';if(k==='presentation')return'presentation';if(k==='kickoff')return'kickoff';return k;}
function manualPct(item){if(!item)return null;if(item.type==='simple')return Math.round(item.score/item.max*100);if(item.type==='criteria'&&item.rated){const sum=item.scores.reduce((a,b)=>a+b,0);return Math.round(sum/(item.maxEach*item.totalCriteria)*100)}return null;}

function bindTimers(){
  $$('.timer-widget').forEach(widget=>{const initial=Number(widget.dataset.seconds)||60;let seconds=initial;let interval=null;const display=widget.querySelector('strong');const paint=()=>{const m=String(Math.floor(seconds/60)).padStart(2,'0');const s=String(seconds%60).padStart(2,'0');display.textContent=`${m}:${s}`};widget.querySelector('.timer-start')?.addEventListener('click',()=>{if(interval)return;interval=setInterval(()=>{if(seconds<=0){clearInterval(interval);interval=null;toast('Time — finish your sentence.');return}seconds--;paint();},1000)});widget.querySelector('.timer-reset')?.addEventListener('click',()=>{if(interval)clearInterval(interval);interval=null;seconds=initial;paint();});paint();});
}

function bindQA(){
  const qs=[
    'How confident are you that this result is repeatable?',
    'What evidence supports your interpretation?',
    'Could the increase simply be measurement uncertainty?',
    'What would make you change your recommendation?',
    'Why is the durability evidence still incomplete?',
    'What is the risk if we make the decision now?',
    'Can you quantify the impact on the margin?',
    'What exactly will the next test confirm?'
  ];
  $('newQaQuestion')?.addEventListener('click',()=>{let n=Math.floor(Math.random()*qs.length);if(qs.length>1&&n===state.qaIndex)n=(n+1)%qs.length;state.qaIndex=n;$('qaQuestion').textContent=qs[n];speak(qs[n]);saveState();});
}

function bindEvidenceControls(){
  $$('[data-mark]').forEach(b=>b.addEventListener('click',()=>{markEvidence(b.dataset.mark,true);saveState();updateAll();toast('Evidence marked complete.');}));
  $$('.reset-section').forEach(b=>b.addEventListener('click',()=>resetSection(b.dataset.reset)));
  $('markAllReviewed')?.addEventListener('click',()=>{updateAll();toast('Evidence refreshed.');});
}
function markEvidence(key,val){state.evidence[key]=Boolean(val);}
function resetSection(key){
  if(!confirm('Reset this section? Saved answers and scores in this section will be erased.'))return;
  const map={
    review:()=>{state.quiz.review={};},
    framework:()=>{delete state.manual.framework;delete state.fields.frameworkTransfer;},
    vocabulary:()=>{state.vocabViewed=[];state.vocabReviewed=false;},
    causeEffect:()=>{state.quiz.cause={};},
    modals:()=>{state.quiz.modals={};},
    precision:()=>{state.precision={};},
    scenario1:()=>{delete state.manual.scenario1;delete state.fields.scenario1Oral;delete state.fields.scenario1Write;},
    scenario2:()=>{delete state.manual.scenario2;delete state.fields.tradeoffResponse;},
    uncertainty:()=>{state.quiz.uncertainty={};delete state.manual.uncertaintyWrite;delete state.fields.uncertaintyWrite;},
    qa:()=>{state.quiz.qa={};delete state.manual.qaOral;delete state.fields.qaNotes;},
    presentation:()=>{delete state.manual.presentation;['presContext','presResult','presMeaning','presImpact','presAction'].forEach(k=>delete state.fields[k]);},
    kickoff:()=>{delete state.manual.kickoff;['kickoffOpen','kickoffData','kickoffImpact','kickoffAction','kickoffClose'].forEach(k=>delete state.fields[k]);},
    reserve:()=>{state.reserveDone=false;delete state.fields.reserveCertainty;delete state.fields.reserveQuestions;delete state.fields.reserveEmail;}
  };
  map[key]?.();delete state.evidence[key];saveState();location.reload();
}

function restoreUI(){
  if(state.fields.__fr===false){document.body.classList.remove('show-fr');$('translationToggle')?.classList.remove('active');if($('translationToggle'))$('translationToggle').querySelector('span:last-child').textContent='Show French support';}
  $$('.save-field').forEach(f=>{const key=f.dataset.save;if(key&&state.fields[key]!==undefined)f.value=state.fields[key];});
  if($('confidenceSlider')){$('confidenceSlider').value=state.fields.confidence||5;$('confidenceValue').textContent=`${$('confidenceSlider').value} / 10`;}
  if($('vocabReviewed'))$('vocabReviewed').checked=state.vocabReviewed;if($('reserveDone'))$('reserveDone').checked=state.reserveDone;
  Object.entries(state.quiz).forEach(([key,answers])=>{const root=document.querySelector(`[data-quiz="${key}"]`);if(!root)return;[...root.querySelectorAll('.quiz-item')].forEach((item,idx)=>{const a=answers[idx];if(!a)return;const btn=item.querySelector(`button[data-answer="${a.answer}"]`);if(btn){btn.classList.add(a.correct?'is-correct':'is-wrong');const fb=item.querySelector('.quiz-feedback');if(fb){fb.className='quiz-feedback '+(a.correct?'correct':'wrong');fb.textContent=a.correct?'✓ Correct':'✗ Try again — change your answer.';}}});});
  $$('#precisionLab .sort-row').forEach((row,idx)=>{const a=state.precision[idx];if(!a)return;row.querySelector('select').value=a.value||'';row.classList.toggle('correct',a.correct);row.classList.toggle('wrong',a.attempted&&!a.correct);row.querySelector('em').textContent=!a.attempted?'':a.correct?'✓ Correct':'Try again';});
  $$('.manual-mini').forEach(root=>{const m=state.manual[root.dataset.rubric];if(m?.score)root.querySelector(`button[data-value="${m.score}"]`)?.classList.add('active');});
  $$('.manual-rubric').forEach(root=>{const m=state.manual[root.dataset.rubric];if(m?.scores){[...root.querySelectorAll('select')].forEach((s,i)=>s.value=m.scores[i]||'');}});
  updateLogic();updateRecommendation();updateKickoff();updateVocabCount();
}

function updateAll(){
  updateScores();updateDerivedEvidence();updateEvidenceUI();updateReport();
}
function updateScores(){
  setScore('scoreReview',quizScore('review'),4);setScore('scoreCause',quizScore('cause'),10);setScore('scoreModals',quizScore('modals'),10);setScore('scorePrecision',precisionScore(),6);setScore('scoreUncertainty',quizScore('uncertainty'),6);setScore('scoreQa',quizScore('qa'),6);const total=quizScore('review')+quizScore('cause')+quizScore('modals')+precisionScore()+quizScore('uncertainty')+quizScore('qa');setScore('scoreAutoTotal',total,42);
}
function setScore(id,score,total){const el=$(id);if(!el)return;el.textContent=`${score} / ${total}`;el.classList.toggle('good',score===total);el.classList.toggle('mid',score>0&&score<total);}
function updateDerivedEvidence(){
  state.evidence.review=allQuizAttempted('review');
  state.evidence.causeEffect=allQuizAttempted('cause');
  state.evidence.modals=allQuizAttempted('modals');
  state.evidence.precision=Object.values(state.precision).filter(x=>x.attempted).length===6;
  state.evidence.vocabulary=Boolean(state.vocabReviewed);
  state.evidence.uncertainty=allQuizAttempted('uncertainty')&&Boolean(state.manual.uncertaintyWrite);
  state.evidence.qa=allQuizAttempted('qa')&&Boolean(state.manual.qaOral);
}
function updateEvidenceUI(){
  let count=0;evidenceKeys.forEach(k=>{const done=Boolean(state.evidence[k]);if(done)count++;$$(`[data-evidence="${k}"]`).forEach(el=>{el.classList.toggle('complete',done);const s=el.querySelector('span');if(s)s.textContent=done?'✓':'○';});});if($('evidenceCount'))$('evidenceCount').textContent=`${count} / ${evidenceKeys.length}`;
}

function updateReport(){
  const autoScore=quizScore('review')+quizScore('cause')+quizScore('modals')+precisionScore()+quizScore('uncertainty')+quizScore('qa');const autoPct=Math.round(autoScore/42*100);const manualKeys=['framework','scenario1','scenario2','uncertaintyWrite','qaOral','presentation','kickoff'];const manualRows=[];const pcts=[];manualKeys.forEach(k=>{const p=manualPct(state.manual[k]);if(p!==null)pcts.push(p);manualRows.push({label:manualLabel(k),pct:p,detail:manualDetail(state.manual[k])});});
  if($('manualSummary'))$('manualSummary').innerHTML=manualRows.map(r=>`<div class="manual-summary-row"><strong>${escapeHtml(r.label)}</strong><span>${escapeHtml(r.detail)}</span><span>${r.pct===null?'Not rated':r.pct+'%'}</span></div>`).join('');
  const matrix=evidenceMatrixData();if($('evidenceMatrix'))$('evidenceMatrix').innerHTML=matrix.map(r=>`<div class="matrix-row"><strong>${escapeHtml(r.skill)}</strong><span class="matrix-status ${r.done?'done':''}">${r.done?'Completed':'In progress'}</span><span>${escapeHtml(r.evidence)}</span></div>`).join('');
  const evidencePct=Math.round(evidenceKeys.filter(k=>state.evidence[k]).length/evidenceKeys.length*100);const manualAverage=pcts.length?Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length):null;if($('reportEvidencePct'))$('reportEvidencePct').textContent=`${evidencePct}%`;if($('reportAutoPct'))$('reportAutoPct').textContent=`${autoPct}%`;if($('reportManualPct'))$('reportManualPct').textContent=manualAverage===null?'—':`${manualAverage}%`;let overall='In progress';if(evidencePct>=85&&autoPct>=75&&(manualAverage??0)>=70)overall='Objective achieved';else if(evidencePct>=60&&autoPct>=55)overall='Developing well';if($('reportOverall'))$('reportOverall').textContent=overall;
}
function manualLabel(k){return {framework:'4-step technical message',scenario1:'Temperature scenario',scenario2:'Trade-off recommendation',uncertaintyWrite:'Technical follow-up writing',qaOral:'Rapid technical Q&A',presentation:'90-second presentation',kickoff:'October kickoff block'}[k]||k;}
function manualDetail(m){if(!m)return'—';if(m.type==='simple')return`${m.score} / ${m.max}`;if(m.type==='criteria')return`${m.rated} / ${m.totalCriteria} criteria rated`;return'—';}
function evidenceMatrixData(){
  return [
    {skill:'Graph description',done:!!state.evidence.review,evidence:`Auto ${quizScore('review')} / 4 + oral warm-up`},
    {skill:'Technical message structure',done:!!state.evidence.framework,evidence:`Manual ${manualDetail(state.manual.framework)}`},
    {skill:'Professional vocabulary',done:!!state.evidence.vocabulary,evidence:`${state.vocabViewed.length} terms opened · review ${state.vocabReviewed?'confirmed':'not confirmed'}`},
    {skill:'Cause / effect language',done:!!state.evidence.causeEffect,evidence:`Auto ${quizScore('cause')} / 10`},
    {skill:'Certainty / modal control',done:!!state.evidence.modals,evidence:`Auto ${quizScore('modals')} / 10`},
    {skill:'Evidence vs hypothesis',done:!!state.evidence.precision,evidence:`Auto ${precisionScore()} / 6`},
    {skill:'Technical scenario 1',done:!!state.evidence.scenario1,evidence:`Manual ${manualDetail(state.manual.scenario1)}`},
    {skill:'Trade-off recommendation',done:!!state.evidence.scenario2,evidence:`Manual ${manualDetail(state.manual.scenario2)}`},
    {skill:'Uncertainty communication',done:!!state.evidence.uncertainty,evidence:`Auto ${quizScore('uncertainty')} / 6 · writing ${manualDetail(state.manual.uncertaintyWrite)}`},
    {skill:'Technical Q&A',done:!!state.evidence.qa,evidence:`Auto ${quizScore('qa')} / 6 · oral ${manualDetail(state.manual.qaOral)}`},
    {skill:'90-second presentation',done:!!state.evidence.presentation,evidence:`Manual ${manualDetail(state.manual.presentation)}`},
    {skill:'October kickoff block',done:!!state.evidence.kickoff,evidence:`Manual ${manualDetail(state.manual.kickoff)}`},
    {skill:'Learning orientation',done:!!state.evidence.welcome,evidence:'Session objectives understood'}
  ];
}

function bindExports(){
  $('downloadReportHtml')?.addEventListener('click',downloadReportHtml);$('printReport')?.addEventListener('click',()=>window.print());$('copyReport')?.addEventListener('click',()=>copyText(buildReportText()));
}
function buildReportText(){
  const autoScore=quizScore('review')+quizScore('cause')+quizScore('modals')+precisionScore()+quizScore('uncertainty')+quizScore('qa');const rows=evidenceMatrixData();return `CFL WELCOME — LESSON 3 PROGRESS REPORT\nThomas Beccardi\n${$('dateStamp')?.textContent||''}\n\nOBJECTIVE\nMove from graph description to technical interpretation, impact, recommendation and Q&A while calibrating certainty.\n\nAUTOMATIC RESULTS\nGraph language: ${quizScore('review')} / 4\nCause & effect: ${quizScore('cause')} / 10\nTechnical certainty: ${quizScore('modals')} / 10\nEvidence vs hypothesis: ${precisionScore()} / 6\nUncertainty responses: ${quizScore('uncertainty')} / 6\nTechnical Q&A: ${quizScore('qa')} / 6\nAutomatic total: ${autoScore} / 42\n\nEVIDENCE MATRIX\n${rows.map(r=>`• ${r.skill}: ${r.done?'Completed':'In progress'} — ${r.evidence}`).join('\n')}\n\nSTRENGTHS\n${state.fields.reportStrengths||'—'}\n\nPRIORITY TO REINFORCE\n${state.fields.reportFocus||'—'}\n\nNEXT LESSON\n${state.fields.reportNext||'—'}\n\nCONFIDENCE\n${state.fields.confidence||5} / 10\n\nCFL Welcome · Personalised English training · Progress evidence saved in browser`;
}
function downloadReportHtml(){
  const rows=evidenceMatrixData();const autoScore=quizScore('review')+quizScore('cause')+quizScore('modals')+precisionScore()+quizScore('uncertainty')+quizScore('qa');const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thomas Beccardi — Lesson 3 Progress Report</title><style>*{box-sizing:border-box}body{margin:0;background:#fffaf0;color:#222;font-family:Arial,sans-serif;line-height:1.5}.page{width:min(100% - 30px,960px);margin:30px auto;background:white;border:1px solid #e9e2d5;border-radius:22px;overflow:hidden}header{padding:28px 32px;background:#111;color:#fff;border-bottom:6px solid #f2b822}header small{color:#f2b822;text-transform:uppercase;font-weight:800;letter-spacing:.1em}h1{font-family:Georgia,serif;margin:7px 0 2px}.section{padding:22px 32px;border-bottom:1px solid #e9e2d5}.scores{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.score{padding:12px;border:1px solid #ead17c;border-radius:12px;background:#fff6d3}.score strong{display:block;font-size:1.15rem}table{width:100%;border-collapse:collapse}td,th{padding:9px;border-bottom:1px solid #e9e2d5;text-align:left}th{background:#faf5ea}.done{font-weight:bold;color:#1d6749}.note{white-space:pre-wrap;padding:13px;border-radius:10px;background:#faf7f1}.confidence{display:inline-block;padding:7px 12px;background:#f2b822;border-radius:999px;font-weight:bold}footer{padding:16px 32px;background:#111;color:#ccc}@media print{body{background:#fff}.page{width:100%;margin:0;border:0;border-radius:0}}@media(max-width:650px){.scores{grid-template-columns:1fr}}</style></head><body><article class="page"><header><small>CFL Welcome · Lesson 3 Progress Report</small><h1>Thomas Beccardi</h1><div>${escapeHtml($('dateStamp')?.textContent||'')}</div></header><section class="section"><h2>Objective</h2><p>Move from graph description to technical interpretation, impact, recommendation and Q&amp;A while calibrating certainty.</p></section><section class="section"><h2>Automatic results</h2><div class="scores"><div class="score"><span>Graph language</span><strong>${quizScore('review')} / 4</strong></div><div class="score"><span>Cause &amp; effect</span><strong>${quizScore('cause')} / 10</strong></div><div class="score"><span>Technical certainty</span><strong>${quizScore('modals')} / 10</strong></div><div class="score"><span>Evidence / hypothesis</span><strong>${precisionScore()} / 6</strong></div><div class="score"><span>Uncertainty</span><strong>${quizScore('uncertainty')} / 6</strong></div><div class="score"><span>Technical Q&amp;A</span><strong>${quizScore('qa')} / 6</strong></div><div class="score"><span>Total</span><strong>${autoScore} / 42</strong></div></div></section><section class="section"><h2>Evidence matrix</h2><table><thead><tr><th>Skill</th><th>Status</th><th>Evidence</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${escapeHtml(r.skill)}</td><td class="${r.done?'done':''}">${r.done?'Completed':'In progress'}</td><td>${escapeHtml(r.evidence)}</td></tr>`).join('')}</tbody></table></section><section class="section"><h2>Trainer comments</h2><h3>Strengths</h3><div class="note">${escapeHtml(state.fields.reportStrengths||'—')}</div><h3>Priority to reinforce</h3><div class="note">${escapeHtml(state.fields.reportFocus||'—')}</div><h3>Next lesson</h3><div class="note">${escapeHtml(state.fields.reportNext||'—')}</div><p><span class="confidence">Confidence: ${escapeHtml(String(state.fields.confidence||5))} / 10</span></p></section><footer>CFL Welcome · Personalised English training · Lesson 3</footer></article></body></html>`;downloadBlob('Thomas-Beccardi-Lesson-3-Qualiopi-Report.html',html,'text/html');
}

function copyText(text){if(!text)return;navigator.clipboard?.writeText(text).then(()=>toast('Copied.')).catch(()=>{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();toast('Copied.');});}
function downloadBlob(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function toast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),1800);}
function setDate(){if($('dateStamp'))$('dateStamp').textContent=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'long',year:'numeric'}).format(new Date());}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

function saveState(){
  const copy={...state,sessionTimer:null};try{localStorage.setItem(STORAGE_KEY,JSON.stringify(copy));}catch(e){console.warn('Could not save progress',e);}
}
function restoreState(){
  try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;const saved=JSON.parse(raw);Object.assign(state,saved);state.sessionTimer=null;state.quiz={review:{},cause:{},modals:{},uncertainty:{},qa:{},...(saved.quiz||{})};state.precision=saved.precision||{};state.manual=saved.manual||{};state.evidence=saved.evidence||{};state.fields=saved.fields||{};state.vocabViewed=saved.vocabViewed||[];}catch(e){console.warn('Could not restore progress',e);}
}
