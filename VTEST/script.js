const state = {
  mode: localStorage.getItem('vtestMode') || 'coach',
  completedSections: new Set(JSON.parse(localStorage.getItem('vtestSections') || '[]')),
  answers: JSON.parse(localStorage.getItem('vtestAnswers') || '{}'),
  listenPlayed: false,
  recordings: {},
  timers: {}
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function saveState(){
  localStorage.setItem('vtestMode', state.mode);
  localStorage.setItem('vtestSections', JSON.stringify([...state.completedSections]));
  localStorage.setItem('vtestAnswers', JSON.stringify(state.answers));
}

function setMode(mode){
  state.mode = mode;
  document.body.classList.toggle('exam-mode', mode === 'exam');
  $$('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  if(mode === 'coach') state.listenPlayed = false;
  saveState();
}

$$('.mode-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
setMode(state.mode);

$('#fontToggle').addEventListener('click', e => {
  const on = document.body.classList.toggle('large-text');
  e.currentTarget.setAttribute('aria-pressed', on);
});
$('#contrastToggle').addEventListener('click', e => {
  const on = document.body.classList.toggle('high-contrast');
  e.currentTarget.setAttribute('aria-pressed', on);
});

$$('[data-scroll]').forEach(b => b.addEventListener('click', () => $(b.dataset.scroll)?.scrollIntoView({behavior:'smooth',block:'start'})));
$$('.fr-toggle,[data-target]').forEach(b => b.addEventListener('click', () => {
  const el = document.getElementById(b.dataset.target);
  if(el) el.classList.toggle('hidden');
}));
$$('[data-hint]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.hint)?.classList.toggle('hidden')));
$$('[data-target-model]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.targetModel)?.classList.toggle('hidden')));

function updateProgress(){
  const sections = ['welcome','setup','adaptive','listening','reading','writing','speaking','mission'];
  const pct = Math.round((state.completedSections.size / sections.length) * 100);
  $('#progressFill').style.width = `${pct}%`;
  $('#progressText').textContent = `${pct}% explored`;
  $('#finishProgress').textContent = `${pct}%`;
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = entry.target.dataset.sectionId;
      if(id){
        state.completedSections.add(id); saveState(); updateProgress();
        $$('#lessonNav a').forEach(a => a.classList.toggle('active', a.dataset.section === id));
      }
    }
  });
},{threshold:.35});
$$('.lesson-section[data-section-id]').forEach(s => observer.observe(s));
updateProgress();

// Setup check
function updateSetup(){
  const checks = $$('.setup-check'); const n = checks.filter(c=>c.checked).length;
  $('#setupStatus').textContent = `${n} / ${checks.length} ready`;
}
$$('.setup-check').forEach(c => c.addEventListener('change', updateSetup));
$('#saveSetup').addEventListener('click', () => {
  state.completedSections.add('setup'); saveState(); updateProgress();
  $('#saveSetup').textContent = 'CHECKLIST SAVED ✓';
});
$('#browserCheck').textContent = navigator.userAgent ? 'Detected ✓' : 'Check manually';
$('#onlineCheck').textContent = navigator.onLine ? 'Online ✓' : 'Offline';
$('#micApiCheck').textContent = navigator.mediaDevices?.getUserMedia ? 'Available ✓' : 'Not available';
$('#deviceTestBtn').addEventListener('click', async () => {
  const btn = $('#deviceTestBtn');
  if(!navigator.mediaDevices?.getUserMedia){btn.textContent='MICROPHONE API NOT AVAILABLE';return;}
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    stream.getTracks().forEach(t=>t.stop()); btn.textContent='MICROPHONE PERMISSION OK ✓';
  }catch(e){btn.textContent='PERMISSION NOT GRANTED';}
});

// Adaptive simulator
const adaptiveItems = {
  A2:{q:'Please ___ the invoice to this email before you send it.', opts:[['attach',true],['attend',false],['arrive',false]]},
  B1:{q:'The client asked us to ___ the deadline because their internal approval is delayed.', opts:[['extend',true],['expand',false],['raise',false]]},
  B2:{q:'The proposal was well received, ___ the finance team requested a more detailed cost breakdown.', opts:[['although',true],['because of',false],['despite of',false]]},
  C1:{q:'Had the risk been identified earlier, the team ___ a contingency plan before the launch.', opts:[["would have implemented",true],["will implement",false],["had implemented",false]]}
};
let adaptiveIndex = 1; const adaptiveLevels=['A2','B1','B2','C1'];
function renderAdaptive(){
  const level=adaptiveLevels[adaptiveIndex], item=adaptiveItems[level];
  $('#adaptiveLevel').textContent=level; $('#adaptivePrompt').textContent=item.q; $('#adaptiveOptions').innerHTML='';
  $('#adaptiveFeedback').classList.add('hidden');
  item.opts.forEach(([txt,correct])=>{
    const b=document.createElement('button');b.textContent=txt;b.addEventListener('click',()=>{
      $('#adaptiveFeedback').classList.remove('hidden','correct','incorrect');
      $('#adaptiveFeedback').classList.add(correct?'correct':'incorrect');
      $('#adaptiveFeedback').textContent=correct?'Correct. In an adaptive test, success can lead to a more demanding next stage.':'Not this time. The test may adjust downward or hold the level. Keep answering — one item never defines your result.';
      adaptiveIndex=Math.max(0,Math.min(3,adaptiveIndex+(correct?1:-1)));
      $('#levelMarker').style.left=`${adaptiveIndex*32.8}%`;
      setTimeout(renderAdaptive,1300);
    });$('#adaptiveOptions').appendChild(b);
  });
}
renderAdaptive();

// Generic MCQ checks
$$('[data-check]').forEach(btn => btn.addEventListener('click', () => {
  const name=btn.dataset.check; const checked=$(`input[name="${name}"]:checked`);
  const fb=$(`#${name}-feedback`); fb.classList.remove('hidden','correct','incorrect');
  if(!checked){fb.classList.add('incorrect');fb.textContent='Choose an answer first. On the real test, it is better to guess than leave an item unanswered.';return;}
  const correct=checked.dataset.correct==='true'; state.answers[name]=correct; saveState();
  fb.classList.add(correct?'correct':'incorrect'); fb.textContent=correct?'Correct ✓ You found the evidence.':'Not quite. Eliminate what clearly conflicts with the message, then choose the best remaining answer.';
}));

// Simple countdowns
function countdown(el, seconds, doneText='00:00'){
  clearInterval(state.timers[el.id]); let remaining=seconds;
  const draw=()=>{const m=String(Math.floor(remaining/60)).padStart(2,'0'),s=String(remaining%60).padStart(2,'0');el.textContent=`${m}:${s}`;}; draw();
  state.timers[el.id]=setInterval(()=>{remaining--; draw(); if(remaining<=0){clearInterval(state.timers[el.id]);el.textContent=doneText;}},1000);
}
$('#startPrepBtn').addEventListener('click',()=>countdown($('#listenPrepTimer'),30));
$('#readTimerBtn').addEventListener('click',()=>countdown($('#readTimer'),180));

// Manual speech synthesis; no autoplay
function speakText(text, button){
  if(!('speechSynthesis' in window)){alert('Speech playback is not supported in this browser.');return;}
  if(state.mode==='exam' && button.id==='listenPlayBtn' && state.listenPlayed){return;}
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-GB'; u.rate=.96; u.pitch=1;
  u.onstart=()=>{button.disabled=true; if(button.id==='listenPlayBtn'){$('#listenPlayState').textContent='Playing once…';state.listenPlayed=true;}};
  u.onend=()=>{if(state.mode==='coach' || button.id!=='listenPlayBtn')button.disabled=false; if(button.id==='listenPlayBtn')$('#listenPlayState').textContent=state.mode==='exam'?'Audio used':'Finished · replay available';};
  speechSynthesis.speak(u);
}
$$('[data-speech]').forEach(b=>b.addEventListener('click',()=>speakText(b.dataset.speech,b)));
$$('.transcript-toggle').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.target)?.classList.toggle('hidden')));

// Scrambled sentence
const build=[]; const bankButtons=$$('#wordBank button');
function drawSentence(){
  const box=$('#sentenceBuild'); box.innerHTML='';
  if(!build.length){box.innerHTML='<span>Build your sentence here…</span>';return;}
  build.forEach(w=>{const s=document.createElement('span');s.className='token';s.textContent=w;box.appendChild(s)});
}
bankButtons.forEach(btn=>btn.addEventListener('click',()=>{build.push(btn.textContent);btn.classList.add('used');drawSentence();}));
$('#undoSentence').addEventListener('click',()=>{if(!build.length)return;const w=build.pop();const btn=bankButtons.find(b=>b.textContent===w && b.classList.contains('used'));btn?.classList.remove('used');drawSentence();});
$('#resetSentence').addEventListener('click',()=>{build.splice(0);bankButtons.forEach(b=>b.classList.remove('used'));drawSentence();$('#sentenceFeedback').classList.add('hidden');});
$('#checkSentence').addEventListener('click',()=>{const ans=build.join(' ');const correct='the meeting has been moved to Thursday';const fb=$('#sentenceFeedback');fb.classList.remove('hidden','correct','incorrect');const ok=ans.toLowerCase()===correct.toLowerCase();fb.classList.add(ok?'correct':'incorrect');fb.textContent=ok?'Correct ✓ The meeting has been moved to Thursday.':'Check the passive structure: subject + has been + past participle + time.';state.answers.scrambled=ok;saveState();});

// Essay word counter
$('#essayText').addEventListener('input',e=>{const txt=e.target.value.trim();const n=txt?txt.split(/\s+/).length:0;$('#wordCount').textContent=`${n} word${n===1?'':'s'}`;localStorage.setItem('vtestEssay',e.target.value);});
$('#essayText').value=localStorage.getItem('vtestEssay')||'';$('#essayText').dispatchEvent(new Event('input'));

// Speaking prompts
const prompts=[
  'Describe a typical busy day in your work or in a workplace you know. What makes it busy, and how do people organize priorities?',
  'Explain how you would welcome a new colleague to your team. What information would you give them first, and why?',
  'Think about a workplace change you have experienced or can imagine. How should a manager communicate the change to employees?',
  'Some people prefer working independently; others prefer teamwork. What are the advantages of each, and which situations require teamwork?'
];
$$('.prompt-tab').forEach(b=>b.addEventListener('click',()=>{$$('.prompt-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#openPrompt').textContent=prompts[Number(b.dataset.prompt)];}));

// Local audio recording
let activeRecorder=null, activeChunks=[], activeKey=null, speakingInterval=null;
async function startRecording(key, btn){
  if(!navigator.mediaDevices?.getUserMedia){alert('Microphone recording is not supported in this browser.');return;}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    activeChunks=[];activeKey=key;activeRecorder=new MediaRecorder(stream);
    activeRecorder.ondataavailable=e=>activeChunks.push(e.data);
    activeRecorder.onstop=()=>{const blob=new Blob(activeChunks,{type:activeRecorder.mimeType});const url=URL.createObjectURL(blob);const audio=$(`#${activeKey}Playback`);audio.src=url;audio.classList.remove('hidden');stream.getTracks().forEach(t=>t.stop());};
    activeRecorder.start();btn.classList.add('recording');btn.textContent='● RECORDING…';
    const stop=$(`[data-stop="${key}"]`);stop.disabled=false;countdown($('#speakTimer'),60);
    setTimeout(()=>{if(activeRecorder?.state==='recording'&&activeKey===key)stopRecording(key);},60000);
  }catch(e){alert('Microphone permission was not granted. You can still practise the response aloud without recording.');}
}
function stopRecording(key){if(activeRecorder?.state==='recording'&&activeKey===key){activeRecorder.stop();const b=$(`[data-record="${key}"]`);b.classList.remove('recording');b.textContent='● RECORD 60s';const stop=$(`[data-stop="${key}"]`);stop.disabled=true;}}
$$('[data-record]').forEach(b=>b.addEventListener('click',()=>startRecording(b.dataset.record,b)));
$$('[data-stop]').forEach(b=>b.addEventListener('click',()=>stopRecording(b.dataset.stop)));

// Vocabulary data
const vocab={
 instructions:[
  ['☑','choose','choisir','Select the best option.','Choose the answer that best completes the sentence.'],
  ['↔','arrange','mettre dans l’ordre','Put items into the correct order.','Arrange the words to make a correct sentence.'],
  ['▤','prompt','consigne / sujet','The instruction or topic you must respond to.','Read the prompt and answer every bullet point.'],
  ['▷','advance','passer à la suite','Move to the next item or section.','The test will auto-advance when time ends.'],
  ['⌁','submit','valider / envoyer','Send your final response.','Submit only when you are ready to move on.']
 ],
 timing:[
  ['◷','countdown','compte à rebours','A timer that moves toward zero.','Watch the countdown without checking it every second.'],
  ['⏱','time limit','temps imparti','The maximum time available.','Each passage has a time limit.'],
  ['▸','preparation time','temps de préparation','Time to read and plan before responding.','Use preparation time to identify key words.'],
  ['⇥','auto-advance','passage automatique','The platform moves forward when time finishes.','If time reaches zero, the test can auto-advance.']
 ],
 workplace:[
  ['▣','deadline','date limite','The latest time something must be finished.','We may need to extend the deadline.'],
  ['✦','priority','priorité','Something that must receive attention first.','Customer safety is our first priority.'],
  ['↗','update','mise à jour / informer','New information or the act of informing someone.','I’ll send you an update this afternoon.'],
  ['⌂','remote work','télétravail','Working away from the usual office.','Remote work can reduce commuting time.']
 ],
 connectors:[
  ['+','first / then / finally','d’abord / ensuite / enfin','Sequencers that organize an explanation.','First, check the file. Then contact the client.'],
  ['≠','however','cependant','Introduces a contrast.','The idea is useful. However, it may increase costs.'],
  ['→','therefore','donc / par conséquent','Introduces a result or conclusion.','The deadline is close; therefore, we need a clear plan.'],
  ['★','for example','par exemple','Introduces a specific example.','For example, a shared calendar can prevent confusion.']
 ]
};
function renderVocab(cat){const list=$('#vocabList');list.innerHTML='';vocab[cat].forEach((v,i)=>{const [icon,word,fr,def,ex]=v;const item=document.createElement('div');item.className='vocab-item';item.innerHTML=`<div class="vocab-head" role="button" tabindex="0"><span class="vocab-icon">${icon}</span><div><span class="vocab-word">${word}</span> <span class="vocab-fr">${fr}</span></div><span>＋</span></div><div class="vocab-body hidden"><p><strong>Definition:</strong> ${def}</p><p><strong>Example:</strong> ${ex}</p><button class="vocab-audio" type="button">▶ HEAR IT</button></div>`;const head=$('.vocab-head',item),body=$('.vocab-body',item);head.addEventListener('click',()=>body.classList.toggle('hidden'));head.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')body.classList.toggle('hidden')});$('.vocab-audio',item).addEventListener('click',()=>speakText(`${word}. ${ex}`,$('.vocab-audio',item)));list.appendChild(item);});}
$$('.vocab-tab').forEach(b=>b.addEventListener('click',()=>{$$('.vocab-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderVocab(b.dataset.category)}));
renderVocab('instructions');

// Exports
$('#downloadResults').addEventListener('click',()=>{
  const correct=Object.values(state.answers).filter(Boolean).length,total=Object.keys(state.answers).length;
  const essay=$('#essayText').value.trim(); const words=essay?essay.split(/\s+/).length:0;
  const text=`VTEST BUSINESS ENGLISH · LESSON 1 SUMMARY\n\nMode: ${state.mode}\nSections explored: ${state.completedSections.size}/8\nChecked objective items: ${total}\nCorrect checked items: ${correct}\nWriting practice: ${words} words\n\nRemember:\n- Preview questions before listening.\n- Answer every multiple-choice item.\n- Skim, scan, and find proof in reading.\n- Cover every bullet point in writing.\n- In speaking, keep talking clearly and use the full time.\n- Harder questions can be a normal part of an adaptive test.\n`;
  downloadFile('vtest_lesson_1_summary.txt',text,'text/plain');
});
$('#exportProgress').addEventListener('click',()=>{
  const data={exported:new Date().toISOString(),mode:state.mode,sections:[...state.completedSections],answers:state.answers,essayWords:($('#essayText').value.trim().match(/\S+/g)||[]).length};
  downloadFile('vtest_lesson_1_progress.json',JSON.stringify(data,null,2),'application/json');
});
function downloadFile(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

$('#resetBtn').addEventListener('click',()=>{
  if(confirm('Reset this lesson and clear saved progress on this browser?')){['vtestMode','vtestSections','vtestAnswers','vtestEssay'].forEach(k=>localStorage.removeItem(k));location.reload();}
});
