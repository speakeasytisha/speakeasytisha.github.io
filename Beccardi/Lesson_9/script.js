(() => {
  'use strict';
  const KEY='thomas_4block_daily_update_v1';
  const sections=[...document.querySelectorAll('.lesson-section')];
  const state={sectionIndex:0,sessionSeconds:90*60,sessionTimer:null,quizCorrect:{},questionIndex:0,phraseMix:''};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const questionBank=[
    {q:'Why did productivity improve so quickly?',hint:'Do not invent a cause. Separate the visible result from the analysis behind it.',model:'The chart shows the improvement clearly, but the chart alone does not prove the cause. What we can say is that the team completed several changes today. We still need to confirm which change had the biggest effect.'},
    {q:'Are you sure the KPI will stay at target tomorrow?',hint:'Distinguish today’s result from repeatability.',model:'We’ve reached the target today, which is encouraging. The next step is to prove that the performance is repeatable. That is why tomorrow’s validation is important.'},
    {q:'Which accomplishment had the biggest impact today?',hint:'Headline first → evidence → uncertainty if necessary.',model:'The most useful accomplishment was the action that clarified the main constraint. It gives us a much sharper focus for tomorrow. We are still validating the exact contribution to the KPI.'},
    {q:'Why are you prioritising that action tomorrow?',hint:'Connect today’s learning to tomorrow’s priority.',model:'Because today’s work showed that this is the next point we need to validate. If the test confirms it, we can move forward with much more confidence.'},
    {q:'What exactly do you need from us?',hint:'Make the ask specific: what, by when, and why.',model:'What would help us most is confirmation on the quality point before 10 a.m. That will let us start the planned test on time and keep the day on schedule.'},
    {q:'What happens if you do not get that support?',hint:'Explain impact without sounding dramatic.',model:'If we do not get it in time, the main risk is a delay to the validation sequence. We can continue other work, but that specific test would move later in the day.'},
    {q:'What is the one thing you want us to remember from today?',hint:'Give a one-sentence headline, not a summary of all four blocks.',model:'The one thing to remember is that the KPI moved in the right direction today, and we now have a clear next step to test whether that improvement can be sustained.'}
  ];

  const phraseBanks={
    open:['Here’s the short version of today.','The main story today is simple.','I’ll keep this focused on what changed today.','The key point from today is this.'],
    kpi:['Let me start with where we stand on the KPI.','First, a quick look at the numbers that matter.','To set the scene, here’s where the indicator stands today.','The headline on the KPI side is this.'],
    today:['Behind that result, here’s what the team accomplished today.','So what moved us forward today?','The most useful accomplishment today was this.','That brings me to what changed during today’s work.'],
    tomorrow:['Based on what we learned today, tomorrow’s priority is clear.','Looking ahead to tomorrow, the focus is simple.','That result gives us a clear next step.','Tomorrow, the first thing we need to do is this.'],
    support:['To make that happen, we need one thing from the room.','There is one area where support would help us move faster.','The final point is the support needed to stay on track.','What would help us most is the following.'],
    close:['That’s where we are today. What questions do you have?','That’s the key message for today. I’m happy to take questions.','So that’s the update. Is there anything you’d like me to clarify?','That’s the short version. What would you like to go into in more detail?']
  };

  document.addEventListener('DOMContentLoaded',init);

  function init(){
    makeStepDots();bindNav();bindHeader();bindTimer();bindSpeech();randomizeQuizChoices();bindQuizzes();
    bindBuilders();bindMiniTimers();bindChecks();bindSaveFields();bindResets();bindDailyBuilder();bindQuestions();
    bindPhraseMix();bindReport();restore();setDate();updateBuilders();updateScores();showSection(state.sectionIndex,false);
  }
  function makeStepDots(){const nav=$('#stepDots');sections.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1);b.title=s.dataset.title||`Section ${i+1}`;b.addEventListener('click',()=>showSection(i));nav.appendChild(b)})}
  function bindNav(){$$('[data-next]').forEach(b=>b.addEventListener('click',()=>showSection(Math.min(state.sectionIndex+1,sections.length-1))));$('#backTop')?.addEventListener('click',()=>showSection(0))}
  function showSection(i,scroll=true){state.sectionIndex=i;sections.forEach((s,idx)=>s.classList.toggle('active',idx===i));$('#progressBar').style.width=`${((i+1)/sections.length)*100}%`;$('#progressLabel').textContent=sections[i]?.dataset.title||'';$$('#stepDots button').forEach((b,idx)=>b.classList.toggle('active',idx===i));save();if(scroll)window.scrollTo({top:0,behavior:'smooth'})}
  function bindHeader(){$('#translationToggle')?.addEventListener('click',()=>{const on=document.body.classList.toggle('show-fr');const b=$('#translationToggle');b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'FR help · ON':'FR help · OFF';save()});$('#printButton')?.addEventListener('click',()=>window.print())}
  function bindTimer(){$('#timerStart')?.addEventListener('click',()=>{if(state.sessionTimer)return;state.sessionTimer=setInterval(()=>{state.sessionSeconds=Math.max(0,state.sessionSeconds-1);updateTimer();if(state.sessionSeconds===0)pauseTimer()},1000)});$('#timerPause')?.addEventListener('click',pauseTimer);$('#timerReset')?.addEventListener('click',()=>{pauseTimer();state.sessionSeconds=90*60;updateTimer();save()});updateTimer()}
  function pauseTimer(){if(state.sessionTimer){clearInterval(state.sessionTimer);state.sessionTimer=null}}
  function updateTimer(){const m=String(Math.floor(state.sessionSeconds/60)).padStart(2,'0'),s=String(state.sessionSeconds%60).padStart(2,'0');$('#sessionTimer').textContent=`${m}:${s}`}
  function bindSpeech(){document.addEventListener('click',e=>{const b=e.target.closest('.speak-button[data-speak]');if(b)speak(b.dataset.speak);const gen=e.target.closest('.speak-generated');if(gen)speak($('#'+gen.dataset.output)?.textContent||'');const cp=e.target.closest('.copy-generated');if(cp)copyText($('#'+cp.dataset.output)?.textContent||'')})}
  function speak(text){if(!('speechSynthesis'in window)){toast('Speech synthesis is not available.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const lang=$('#accentSelect')?.value||'en-US';u.lang=lang;u.rate=.92;u.pitch=1;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang===lang)||voices.find(v=>v.lang?.startsWith(lang.slice(0,2)))||null;speechSynthesis.speak(u)}
  function randomizeQuizChoices(){$$('.quiz-item').forEach(item=>{const holder=$(':scope > div',item);if(!holder)return;shuffle($$('button[data-choice-text]',holder)).forEach(b=>holder.appendChild(b))})}
  function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function bindQuizzes(){$$('.quiz-item').forEach((item,idx)=>{item.dataset.qid=`q${idx}`;$$('button[data-choice-text]',item).forEach(btn=>btn.addEventListener('click',()=>{const good=btn.dataset.choiceText===item.dataset.answerText;$$('button[data-choice-text]',item).forEach(x=>x.classList.remove('correct','wrong'));btn.classList.add(good?'correct':'wrong');const corr=$$('button[data-choice-text]',item).find(x=>x.dataset.choiceText===item.dataset.answerText);corr?.classList.add('correct');const fb=$('.feedback',item);fb.textContent=good?`✓ Correct — ${item.dataset.explain||''}`:`✗ Not quite — ${item.dataset.explain||''}`;fb.className=`feedback ${good?'good':'bad'}`;if(good)state.quizCorrect[item.dataset.qid]=true;else delete state.quizCorrect[item.dataset.qid];save();updateScores()}))})}
  function bindBuilders(){$$('[data-builder]').forEach(s=>s.addEventListener('change',()=>{updateBuilders();save()}))}
  function updateBuilders(){const out=$('#headlineOutput');if(out)out.textContent=$$('[data-builder="headline"]').map(x=>x.value).join(' ')}
  function bindMiniTimers(){$$('.timer-inline').forEach(box=>{const base=Number(box.dataset.seconds||60),display=$('strong',box),start=$('.timer-start',box),reset=$('.timer-reset',box);let remaining=base,interval=null;const render=()=>display.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;start?.addEventListener('click',()=>{if(interval)clearInterval(interval);remaining=base;render();interval=setInterval(()=>{remaining=Math.max(0,remaining-1);render();if(remaining===0){clearInterval(interval);interval=null;toast('Time — finish the sentence calmly, then stop.')}},1000)});reset?.addEventListener('click',()=>{if(interval)clearInterval(interval);interval=null;remaining=base;render()});render()})}
  function bindChecks(){$$('input[data-check-score]').forEach(cb=>cb.addEventListener('change',()=>{save();updateScores()}))}
  function bindSaveFields(){$$('[data-save]').forEach(el=>{el.addEventListener('input',save);el.addEventListener('change',()=>{save();if(el.id==='confidenceSlider')updateConfidence()})});updateConfidence()}
  function bindResets(){$$('.reset-section').forEach(btn=>btn.addEventListener('click',()=>{const section=btn.closest('.lesson-section');if(!section)return;$$('input,textarea,select',section).forEach(el=>{if(el.matches('[type="checkbox"]'))el.checked=false;else if(el.matches('[type="range"]'))el.value=el.defaultValue||7;else if(el.tagName==='SELECT')el.selectedIndex=0;else el.value=''});$$('.quiz-item',section).forEach(item=>{$$('button[data-choice-text]',item).forEach(x=>x.classList.remove('correct','wrong'));const fb=$('.feedback',item);if(fb){fb.textContent='';fb.className='feedback'}delete state.quizCorrect[item.dataset.qid]});updateBuilders();updateConfidence();save();updateScores();toast('Section reset.') }));$('#resetAll')?.addEventListener('click',()=>{if(!confirm('Reset the whole lesson and delete saved progress?'))return;localStorage.removeItem(KEY);location.reload()})}

  function bindDailyBuilder(){
    ['dailyHeadline','dailyKpi','dailyToday','dailyTomorrow','dailySupport','tr1','tr2','tr3','tr4'].forEach(id=>$('#'+id)?.addEventListener('input',save));
    ['tr1','tr2','tr3','tr4'].forEach(id=>$('#'+id)?.addEventListener('change',save));
    $('#buildDaily')?.addEventListener('click',()=>{buildDaily();save();toast('Daily update built.')});
  }
  function clean(v,fallback){return (v||'').trim()||fallback}
  function buildDaily(){
    const h=clean($('#dailyHeadline')?.value,'The main story today is that we made useful progress.');
    const k=clean($('#dailyKpi')?.value,'The KPI is moving in the right direction and the gap to target is smaller.');
    const t=clean($('#dailyToday')?.value,'Today we completed the key actions and clarified the next constraint.');
    const tm=clean($('#dailyTomorrow')?.value,'Tomorrow, the priority is to validate the change and confirm that the result is repeatable.');
    const s=clean($('#dailySupport')?.value,'What would help us most is one timely decision so we can keep the plan on schedule.');
    const tr1=$('#tr1')?.value||'',tr2=$('#tr2')?.value||'',tr3=$('#tr3')?.value||'',tr4=$('#tr4')?.value||'';
    $('#dailyOutput').textContent=`${h} ${k} ${tr1} ${t} ${tr2} ${tm} ${tr3} ${s} ${tr4}`;
  }

  function bindQuestions(){
    $('#newQuestion')?.addEventListener('click',()=>{let n=Math.floor(Math.random()*questionBank.length);if(n===state.questionIndex&&questionBank.length>1)n=(n+1)%questionBank.length;state.questionIndex=n;renderQuestion();save()});
    $('#hearQuestion')?.addEventListener('click',()=>speak(questionBank[state.questionIndex].q));
    $('#showQuestionHint')?.addEventListener('click',()=>$('#questionHint')?.classList.toggle('hidden'));
    $('#showQuestionModel')?.addEventListener('click',()=>$('#questionModel')?.classList.toggle('hidden'));
    renderQuestion();
  }
  function renderQuestion(){const q=questionBank[state.questionIndex];if($('#surpriseQuestion'))$('#surpriseQuestion').textContent=q.q;if($('#questionHint')){$('#questionHint').textContent=q.hint;$('#questionHint').classList.add('hidden')}if($('#questionModel')){$('#questionModel').textContent=q.model;$('#questionModel').classList.add('hidden')}}

  function bindPhraseMix(){
    $('#newPhraseMix')?.addEventListener('click',()=>{const pick=k=>phraseBanks[k][Math.floor(Math.random()*phraseBanks[k].length)];state.phraseMix=[pick('open'),pick('kpi'),pick('today'),pick('tomorrow'),pick('support'),pick('close')].join(' → ');$('#phraseMix').textContent=state.phraseMix;save()});
    $('#hearPhraseMix')?.addEventListener('click',()=>speak(state.phraseMix||$('#phraseMix')?.textContent||''));
  }

  function scoresBySkill(){const out={kpi:[0,0],today:[0,0],tomorrow:[0,0],support:[0,0],transition:[0,0]};$$('.quiz-item').forEach(item=>{const skill=item.dataset.skill;if(out[skill]){out[skill][1]++;if(state.quizCorrect[item.dataset.qid])out[skill][0]++}});return out}
  function updateScores(){const by=scoresBySkill(),manual=$$('input[data-check-score]:checked').length,manualTotal=$$('input[data-check-score]').length;setText('scoreKpi',`${by.kpi[0]} / ${by.kpi[1]}`);setText('scoreToday',`${by.today[0]} / ${by.today[1]}`);setText('scoreTomorrow',`${by.tomorrow[0]} / ${by.tomorrow[1]}`);setText('scoreSupport',`${by.support[0]} / ${by.support[1]}`);setText('scoreTransition',`${by.transition[0]} / ${by.transition[1]}`);setText('scoreManual',`${manual} / ${manualTotal}`);const ac=Object.values(by).reduce((a,x)=>a+x[0],0),at=Object.values(by).reduce((a,x)=>a+x[1],0);setText('scoreTop',`${ac+manual} / ${at+manualTotal}`);updateReportPreview()}
  function setText(id,text){if($('#'+id))$('#'+id).textContent=text}

  function bindReport(){$('#confidenceSlider')?.addEventListener('input',()=>{updateConfidence();save();updateReportPreview()});$('#copyReport')?.addEventListener('click',()=>copyText(buildReportText()));$('#downloadReport')?.addEventListener('click',downloadReport);$('#printReport')?.addEventListener('click',()=>window.print())}
  function updateConfidence(){if($('#confidenceValue')&&$('#confidenceSlider'))$('#confidenceValue').textContent=`${$('#confidenceSlider').value} / 10`}
  function buildReportData(){const by=scoresBySkill(),manual=$$('input[data-check-score]:checked').length,manualTotal=$$('input[data-check-score]').length;return{date:$('#dateStamp')?.textContent||'',kpi:`${by.kpi[0]} / ${by.kpi[1]}`,today:`${by.today[0]} / ${by.today[1]}`,tomorrow:`${by.tomorrow[0]} / ${by.tomorrow[1]}`,support:`${by.support[0]} / ${by.support[1]}`,transition:`${by.transition[0]} / ${by.transition[1]}`,manual:`${manual} / ${manualTotal}`,statuses:$$('.manual-evaluation select').map(s=>`${s.parentElement.childNodes[0].textContent.trim()}: ${s.value}`),strengths:$('[data-save="report-strengths"]')?.value.trim()||'—',focus:$('[data-save="report-focus"]')?.value.trim()||'—',next:$('[data-save="report-next"]')?.value.trim()||'—',confidence:$('#confidenceSlider')?.value||'7'}}
  function buildReportText(){const d=buildReportData();return `4-BLOCK DAILY UPDATE — PROFESSIONAL ENGLISH
${d.date}

OBJECTIVES
• Lead a daily 4-block meeting update with a memorable headline.
• Present KPIs as trend + evidence + target comparison + meaning.
• Describe daily accomplishments as results rather than task lists.
• Prioritise tomorrow’s actions using accurate future forms.
• Make support requests specific, actionable and connected to impact.
• Use varied transitions so the update sounds natural rather than memorised.
• Invite and handle follow-up questions professionally.

AUTOMATIC / OBSERVABLE EVIDENCE
KPI language: ${d.kpi}
Today / accomplishments: ${d.today}
Tomorrow / future forms: ${d.tomorrow}
Support requests: ${d.support}
Transitions: ${d.transition}
Speaking checkpoints: ${d.manual}

TRAINER STATUS
${d.statuses.join('\n')}

STRENGTHS
${d.strengths}

POINTS TO REINFORCE
${d.focus}

NEXT LESSON PRIORITY
${d.next}

CONFIDENCE PRESENTING THE 4-BLOCK UPDATE
${d.confidence} / 10

PROFESSIONAL TRANSFER
Daily route: headline → KPI → today’s accomplishment → tomorrow’s priority → support needed → questions.

CFL Welcome · SpeakEasyTisha · Progression visible`}
  function updateReportPreview(){if($('#reportPreview'))$('#reportPreview').textContent=buildReportText()}
  function downloadReport(){const text=buildReportText();const page=`<!doctype html><html><head><meta charset="utf-8"><title>4-Block Daily Update Report</title><style>body{font-family:Arial,sans-serif;background:#fffaf0;color:#222;line-height:1.55;margin:0}.page{max-width:900px;margin:28px auto;background:#fff;border:1px solid #e9e2d5;border-radius:20px;overflow:hidden}.head{background:#111;color:#fff;padding:26px;border-bottom:6px solid #f2b822}.head small{color:#f2b822;font-weight:bold;letter-spacing:.1em}.body{padding:26px}pre{white-space:pre-wrap;font:14px/1.6 Arial,sans-serif}.foot{padding:18px 26px;background:#111;color:#ddd;font-size:12px}@media print{.page{margin:0;max-width:none;border:0;border-radius:0}}</style></head><body><div class="page"><div class="head"><small>CFL WELCOME · DAILY UPDATE</small><h1>4-Block Professional English</h1></div><div class="body"><pre>${escapeHtml(text)}</pre></div><div class="foot">SpeakEasyTisha · Qualiopi progress evidence</div></div></body></html>`;const blob=new Blob([page],{type:'text/html;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='4-Block-Daily-Update-Progress.html';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),800);toast('HTML report downloaded.')}

  function save(){const data={sectionIndex:state.sectionIndex,sessionSeconds:state.sessionSeconds,showFr:document.body.classList.contains('show-fr'),quizCorrect:state.quizCorrect,questionIndex:state.questionIndex,phraseMix:state.phraseMix,fields:{},checks:{},builder:{}};$$('[data-save]').forEach(el=>data.fields[el.dataset.save]=el.value);$$('input[data-check-score]').forEach((el,i)=>data.checks[i]=el.checked);['dailyHeadline','dailyKpi','dailyToday','dailyTomorrow','dailySupport','tr1','tr2','tr3','tr4'].forEach(id=>{if($('#'+id))data.builder[id]=$('#'+id).value});try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}}
  function restore(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(!d)return;state.sectionIndex=Math.min(Number(d.sectionIndex)||0,sections.length-1);state.sessionSeconds=Number.isFinite(d.sessionSeconds)?d.sessionSeconds:90*60;state.quizCorrect=d.quizCorrect||{};state.questionIndex=Number.isInteger(d.questionIndex)?d.questionIndex:0;state.phraseMix=d.phraseMix||'';document.body.classList.toggle('show-fr',d.showFr!==false);const tb=$('#translationToggle');if(tb){tb.classList.toggle('active',d.showFr!==false);tb.textContent=d.showFr===false?'FR help · OFF':'FR help · ON'};$$('[data-save]').forEach(el=>{if(d.fields&&d.fields[el.dataset.save]!==undefined)el.value=d.fields[el.dataset.save]});$$('input[data-check-score]').forEach((el,i)=>el.checked=!!(d.checks&&d.checks[i]));Object.entries(d.builder||{}).forEach(([id,v])=>{if($('#'+id))$('#'+id).value=v});$$('.quiz-item').forEach(item=>{if(state.quizCorrect[item.dataset.qid]){const btn=$$('button[data-choice-text]',item).find(x=>x.dataset.choiceText===item.dataset.answerText);btn?.classList.add('correct');const fb=$('.feedback',item);if(fb){fb.textContent=`✓ Correct — ${item.dataset.explain||''}`;fb.className='feedback good'}}});if(state.phraseMix&&$('#phraseMix'))$('#phraseMix').textContent=state.phraseMix;updateTimer();updateConfidence();renderQuestion();if(Object.values(d.builder||{}).some(Boolean))buildDaily()}catch(e){}}
  function copyText(text){if(!text.trim()){toast('Nothing to copy.');return}navigator.clipboard?.writeText(text).then(()=>toast('Copied.')).catch(()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('Copied.')})}
  function setDate(){if($('#dateStamp'))$('#dateStamp').textContent=new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'long',year:'numeric'}).format(new Date())}
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove('show'),1800)}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
})();