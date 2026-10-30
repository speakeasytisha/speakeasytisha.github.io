(() => {
  'use strict';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const safeStorage = {
    get(k){ try{return localStorage.getItem(k)}catch{return null} },
    set(k,v){ try{localStorage.setItem(k,v);return true}catch{return false} },
    remove(k){ try{localStorage.removeItem(k)}catch{} }
  };
  const toast = (msg) => { const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove('show'),2400); };

  // Required training acknowledgement
  const disclaimerCheck=$('#disclaimerCheck'), enterBtn=$('#enterBtn'), gate=$('#disclaimerGate');
  disclaimerCheck.addEventListener('change',()=>{ enterBtn.disabled=!disclaimerCheck.checked; });
  enterBtn.addEventListener('click',()=>{ if(!disclaimerCheck.checked)return; gate.classList.add('accepted'); $('#missionMap').scrollIntoView({behavior:'smooth'}); });

  // French help
  const frToggle=$('#frToggle');
  frToggle.addEventListener('change',()=>document.body.classList.toggle('fr-off',!frToggle.checked));

  // Guided / exam preview
  const trainingMode=$('#trainingMode');
  function applyMode(){
    const preview=trainingMode.value==='preview';
    document.body.classList.toggle('exam-preview',preview);
    $$('.quiz-item').forEach(refreshQuizFeedback);
    toast(preview?'Exam preview: hints and immediate feedback hidden.':'Guided mode: hints and immediate feedback available.');
  }
  trainingMode.addEventListener('change',applyMode);

  // Font controls
  let fontSize=16;
  $$('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{
    const a=btn.dataset.font;
    if(a==='minus')fontSize=Math.max(14,fontSize-1);
    if(a==='plus')fontSize=Math.min(20,fontSize+1);
    if(a==='reset')fontSize=16;
    document.documentElement.style.setProperty('--font-size',fontSize+'px');
  }));
  $('#printBtn').addEventListener('click',()=>window.print());

  // Speech synthesis - manual only
  function speak(text){
    if(!('speechSynthesis' in window)){toast('Speech playback is not supported in this browser.');return;}
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang='en-GB'; u.rate=.9; u.pitch=1;
    const voices=window.speechSynthesis.getVoices();
    const preferred=voices.find(v=>/^en-GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
    if(preferred)u.voice=preferred;
    u.onerror=()=>toast('Audio could not start. Check browser sound permissions.');
    window.speechSynthesis.speak(u);
  }
  $$('.speak-btn').forEach(btn=>btn.addEventListener('click',()=>speak(btn.dataset.say||'')));

  // Modality switch
  const modalityData={
    ai:{
      label:'LILATE IA', title:'Automated, AI-assisted modality',
      intro:'You complete the assessment independently online. No examiner appointment is required. The system controls the sequence and response time.',
      facts:[['Overall duration','Generally about 30–45 minutes'],['Structure','4 adaptive parts · about 7 minutes each as a guide'],['Question types','Single choice · multiple choice · open written/oral responses'],['Pacing','Each question has a time limit shown on screen'],['Pause','No pause once the test has started'],['Supervision','Webcam + microphone active; browser interactions are monitored'],['Before starting','Identity verification + technical audio/camera/microphone check']]
    },
    examiner:{
      label:'LILATE Examiner', title:'Live examiner modality',
      intro:'You take the assessment by videoconference with a native-speaking examiner who guides and adapts the professional situations throughout the session.',
      facts:[['Overall duration','Up to 60 minutes'],['Structure','4 parts · about 15 minutes each'],['Question types','Professional role plays · documents · audio/video · written and oral responses'],['Pacing','The examiner manages the pace'],['Pause','A pause may be possible'],['Interaction','Live exchange with a native-speaking examiner'],['Before starting','Join the candidate area early · test equipment · identity check']]
    }
  };
  let currentModality='ai';
  function renderModality(){
    const d=modalityData[currentModality];
    $('#modalityMain').innerHTML=`<p class="mini-label">${d.label}</p><h3>${d.title}</h3><p>${d.intro}</p><div class="fact-list">${d.facts.map(f=>`<div class="fact-row"><span>${f[0]}</span><strong>${f[1]}</strong></div>`).join('')}</div>`;
    $('#reportModality').textContent=currentModality==='ai'?'IA':'Examiner';
  }
  $$('.modality-btn').forEach(btn=>btn.addEventListener('click',()=>{
    currentModality=btn.dataset.modality;
    $$('.modality-btn').forEach(b=>b.classList.toggle('active',b===btn));
    renderModality();
  }));
  renderModality();

  // Hint panels
  $$('.hint-toggle').forEach(btn=>btn.addEventListener('click',()=>{
    const panel=document.getElementById(btn.dataset.target); if(panel) panel.classList.toggle('show');
  }));
  $('#recordHintBtn').addEventListener('click',()=>$('#recordHint').classList.toggle('show'));
  $('#recordModelBtn').addEventListener('click',()=>$('#recordModel').classList.toggle('show'));

  // Training timer
  let timerRemaining=60,timerTotal=60,timerId=null,timerRunning=false;
  const timerDisplay=$('#timerDisplay'),timerBar=$('#timerBar'),timerCard=$('.timer-card');
  function fmt(sec){return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
  function renderTimer(){
    timerDisplay.textContent=fmt(timerRemaining);
    timerBar.style.width=((timerRemaining/timerTotal)*100)+'%';
    timerCard.classList.toggle('warning-time',timerRemaining/timerTotal<=.35 && timerRemaining/timerTotal>.15);
    timerCard.classList.toggle('urgent-time',timerRemaining/timerTotal<=.15);
    const ratio=1-timerRemaining/timerTotal;
    $('#timerCoach').textContent=ratio<.25?'First phase: understand exactly what the task asks.':ratio<.8?'Main phase: answer clearly and use the useful information.':'Final phase: finish the sentence, add the next step and check key facts.';
  }
  function stopTimer(){clearInterval(timerId);timerId=null;timerRunning=false;$('#timerStart').textContent='Start';}
  function resetTimer(){stopTimer();timerTotal=Number($('#timerDuration').value);timerRemaining=timerTotal;renderTimer();}
  $('#timerStart').addEventListener('click',()=>{
    if(timerRunning)return;
    if(timerRemaining<=0)resetTimer(); timerRunning=true; $('#timerStart').textContent='Running…';
    timerId=setInterval(()=>{timerRemaining--;renderTimer();if(timerRemaining<=0){stopTimer();toast('Time. In the real IA test, the interface moves you forward when the response time ends.');}},1000);
  });
  $('#timerPause').addEventListener('click',()=>{stopTimer();toast('Training timer paused.');});
  $('#timerReset').addEventListener('click',resetTimer); $('#timerDuration').addEventListener('change',resetTimer); renderTimer();

  // Fake video demo
  const scenes=[
    {t:0,text:'A colleague is giving you an update before a meeting.'},
    {t:3,text:'The client meeting has moved to Thursday at 10:30.'},
    {t:9,text:'Please send the updated presentation before 5 p.m. today.'},
    {t:15,text:'Sarah will join remotely.'},
    {t:19,text:'What information do you need to pass on?'}
  ];
  let videoSec=0,videoId=null,videoPlaying=false;
  function renderVideo(){
    $('#videoTime').textContent=`00:${String(videoSec).padStart(2,'0')} / 00:20`;
    let current=scenes[0]; scenes.forEach(s=>{if(videoSec>=s.t)current=s}); $('#videoScene').textContent=current.text;
  }
  function stopVideo(){clearInterval(videoId);videoId=null;videoPlaying=false;$('#videoPlay').textContent=videoSec>=20?'▶ Play again':'▶ Continue';}
  $('#videoPlay').addEventListener('click',()=>{
    if(videoPlaying){stopVideo();return}
    if(videoSec>=20)videoSec=0;videoPlaying=true;$('#videoPlay').textContent='❚❚ Pause';renderVideo();
    videoId=setInterval(()=>{videoSec++;renderVideo();if(videoSec>=20)stopVideo();},1000);
  });
  $('#videoRestart').addEventListener('click',()=>{stopVideo();videoSec=0;renderVideo();$('#videoPlay').textContent='▶ Play demo';});
  $('#transcriptToggle').addEventListener('click',()=>$('#videoTranscript').classList.toggle('hidden')); renderVideo();

  // Model sentence bank
  const modelSets=[
    ['“From what I understand, …”','“The main point is that …”','“The next step is to …”'],
    ['“Just to confirm, …”','“According to the message, …”','“I’ll make sure that …”'],
    ['“Could you clarify what you mean by …?”','“First…, then…, and finally…”','“The best solution would be to …”'],
    ['“I was asked to let you know that …”','“The change concerns …”','“Please confirm that you can …”']
  ];
  let modelIdx=0;
  function renderModels(){ $('#modelSet').innerHTML=modelSets[modelIdx].map(x=>`<span>${x}</span>`).join(''); }
  $('#shuffleModels').addEventListener('click',()=>{modelIdx=(modelIdx+1)%modelSets.length;renderModels();});renderModels();

  // Vocabulary toolbox
  const vocab={
    'Exam instructions':[
      {icon:'⏱',en:'time limit',fr:'limite de temps',ex:'You have a limited time to answer this question.'},
      {icon:'✓',en:'select one answer',fr:'sélectionner une seule réponse',ex:'Select one answer, then validate your choice.'},
      {icon:'☑',en:'select all that apply',fr:'sélectionner toutes les réponses correctes',ex:'Select all the options that are supported by the document.'},
      {icon:'●',en:'record your answer',fr:'enregistrer votre réponse',ex:'Record your answer after the signal.'},
      {icon:'→',en:'continue / next',fr:'continuer / suivant',ex:'When the time ends, the test moves to the next item.'}
    ],
    'Professional interaction':[
      {icon:'👤',en:'identify the request',fr:'identifier la demande',ex:'First, identify the person and their request.'},
      {icon:'?',en:'clarify',fr:'clarifier',ex:'Could you clarify which document you mean?'},
      {icon:'↺',en:'reformulate',fr:'reformuler',ex:'So, if I understand correctly, you need the revised version today.'},
      {icon:'→',en:'next step',fr:'prochaine étape',ex:'The next step is to contact the customer and confirm the change.'}
    ],
    'Documents & media':[
      {icon:'▤',en:'key information',fr:'information essentielle',ex:'Identify the key information before you answer.'},
      {icon:'▶',en:'audio / video extract',fr:'extrait audio / vidéo',ex:'Listen to the extract and note the date, time and action.'},
      {icon:'#',en:'figures / data',fr:'chiffres / données',ex:'Check all figures, dates and deadlines carefully.'},
      {icon:'✎',en:'summarise',fr:'résumer',ex:'Summarise the message in two clear sentences.'}
    ],
    'Strategy phrases':[
      {icon:'💬',en:'From what I understand…',fr:'D’après ce que je comprends…',ex:'From what I understand, the delivery has been delayed.'},
      {icon:'💬',en:'Just to confirm…',fr:'Juste pour confirmer…',ex:'Just to confirm, you need the final version by Friday.'},
      {icon:'💬',en:'The main point is…',fr:'Le point principal est…',ex:'The main point is that the customer needs an answer today.'},
      {icon:'💬',en:'The next step is…',fr:'La prochaine étape est…',ex:'The next step is to update the file and inform the team.'}
    ]
  };
  const vocabCategory=$('#vocabCategory'),vocabItem=$('#vocabItem');
  Object.keys(vocab).forEach(c=>vocabCategory.add(new Option(c,c)));
  function loadVocabItems(){vocabItem.innerHTML='';vocab[vocabCategory.value].forEach((x,i)=>vocabItem.add(new Option(x.en,i)));renderVocab();}
  function renderVocab(){const x=vocab[vocabCategory.value][Number(vocabItem.value)||0];$('#vocabCard').innerHTML=`<div class="vocab-icon">${x.icon}</div><div><h3>${x.en}</h3><p class="vocab-fr fr">${x.fr}</p><p><strong>Example:</strong> ${x.ex}</p></div><button class="secondary" id="vocabSpeak" type="button">▶ Listen</button>`;$('#vocabSpeak').addEventListener('click',()=>speak(`${x.en}. ${x.ex}`));}
  vocabCategory.addEventListener('change',loadVocabItems);vocabItem.addEventListener('change',renderVocab);loadVocabItems();

  // Recorder
  let mediaRecorder=null,chunks=[],recordSeconds=0,recordTimer=null,lastObjectUrl=null;
  function resetRecordClock(){recordSeconds=0;$('#recordClock').textContent='00:00'}
  function updateRecordClock(){recordSeconds++;$('#recordClock').textContent=fmt(recordSeconds)}
  $('#recordBtn').addEventListener('click',async()=>{
    if(!navigator.mediaDevices?.getUserMedia){$('#recordMessage').textContent='Microphone recording is not supported in this browser.';return}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      chunks=[];mediaRecorder=new MediaRecorder(stream);
      mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      mediaRecorder.onstop=()=>{
        const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'});if(lastObjectUrl)URL.revokeObjectURL(lastObjectUrl);lastObjectUrl=URL.createObjectURL(blob);
        const audio=$('#recordingPlayback');audio.src=lastObjectUrl;audio.classList.remove('hidden');stream.getTracks().forEach(t=>t.stop());
        $('#recordDot').classList.remove('live');$('#recordStatus').textContent='Recorded';clearInterval(recordTimer);$('#recordBtn').disabled=false;$('#stopBtn').disabled=true;
      };
      resetRecordClock();mediaRecorder.start();$('#recordDot').classList.add('live');$('#recordStatus').textContent='Recording';$('#recordBtn').disabled=true;$('#stopBtn').disabled=false;recordTimer=setInterval(updateRecordClock,1000);
    }catch(err){$('#recordMessage').textContent='Microphone permission was not granted. Check your browser permissions and try again.';toast('Microphone access is needed for this training tool.');}
  });
  $('#stopBtn').addEventListener('click',()=>{if(mediaRecorder?.state==='recording')mediaRecorder.stop();});

  // Readiness
  const readyBoxes=$$('[data-ready]');
  function updateReadiness(){const done=readyBoxes.filter(x=>x.checked).length,p=Math.round(done/readyBoxes.length*100);$('#readinessPercent').textContent=p+'%';$('#readinessBar').style.width=p+'%';$('#reportReady').textContent=p+'%';safeStorage.set('lilate_l1_readiness',JSON.stringify(readyBoxes.map(x=>x.checked)));}
  readyBoxes.forEach(x=>x.addEventListener('change',updateReadiness));
  try{const saved=JSON.parse(safeStorage.get('lilate_l1_readiness')||'null');if(Array.isArray(saved))readyBoxes.forEach((x,i)=>x.checked=!!saved[i]);}catch{}updateReadiness();

  // Knowledge quiz
  const quizData=[
    {q:'What does the LILATE primarily evaluate?',options:['How many grammar rules you can name','Your ability to use the language in professional situations','Only your written English'],a:1,h:'Think about the purpose of the certification.',e:'LILATE evaluates language skills through concrete professional-use situations.'},
    {q:'How many main professional parts are used in the current LILATE structure?',options:['2','4','6'],a:1,h:'Remember the sequence: Welcome → Collect → Relay → Use.',e:'There are four parts: interaction, transcription, transmission and exploitation.'},
    {q:'For spoken languages, from which CEFR level is the LILATE certificate attesting ability to work in the language issued?',options:['A1','A2','B1'],a:2,h:'The threshold is the intermediate CEFR level.',e:'The professional certificate is issued from B1. A1/A2 receive a level attestation.'},
    {q:'In the IA modality, who controls the pacing?',options:['The system','A live examiner','The learner can pause whenever they want'],a:0,h:'Think “automated modality”.',e:'The system controls the sequence and each question has a response time shown on screen.'},
    {q:'Does LILATE publish one universal official number of seconds for every IA question?',options:['Yes, always 60 seconds','Yes, always 90 seconds','No; the time limit is shown in the interface and can vary'],a:2,h:'Do not confuse our practice timer with official timing.',e:'Official guidance says each question has a limited time shown on screen, but does not publish one fixed duration for every item.'},
    {q:'In the examiner modality, who manages the pace?',options:['The examiner','The learner with a stopwatch','The browser automatically'],a:0,h:'This modality is a live interaction.',e:'The examiner guides and paces the assessment, which can last up to 60 minutes.'},
    {q:'Which strategy is best for an audio or video support?',options:['Translate every single word','Identify who, what, when, where, problem and next step','Wait until the end and guess from one familiar word'],a:1,h:'Focus on useful professional information.',e:'A structured information capture is safer than word-for-word translation.'},
    {q:'What should you do after a small speaking mistake?',options:['Stop the answer','Apologise for a long time','Correct yourself briefly if needed and continue'],a:2,h:'The task is professional communication, not perfection.',e:'Natural self-correction is acceptable; continuing the professional task is essential.'},
    {q:'Which is the strongest response pattern?',options:['One word only','Answer → key detail → clarify/reformulate → next step','A very long introduction before answering'],a:1,h:'Useful professional communication has a clear sequence.',e:'The four-step formula makes your answer complete, clear and operational.'},
    {q:'Is this page the official LILATE exam?',options:['Yes','No, it is independent training material','Only in Exam preview mode'],a:1,h:'Remember the acknowledgement you checked before entering.',e:'This is independent training material with original exercises, not the official exam or interface.'}
  ];
  const quizList=$('#quizList');
  const quizState=quizData.map(()=>({choice:null,revealed:false}));
  function renderQuiz(){
    quizList.innerHTML=quizData.map((item,i)=>`<article class="quiz-item" data-index="${i}"><div class="quiz-top"><span class="quiz-num">${i+1}</span><div><h3>${item.q}</h3><div class="options">${item.options.map((o,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join('')}</div><button class="ghost compact quiz-hint" type="button">Hint</button><div class="hint-panel quiz-hint-panel">${item.h}</div><div class="quiz-feedback hidden"></div></div></div></article>`).join('');
    $$('.quiz-item').forEach(el=>{
      const i=Number(el.dataset.index);
      $$('input',el).forEach(inp=>inp.addEventListener('change',()=>{quizState[i].choice=Number(inp.value);if(trainingMode.value==='guided')quizState[i].revealed=true;refreshQuizFeedback(el);updateQuizScore();}));
      $('.quiz-hint',el).addEventListener('click',()=>$('.quiz-hint-panel',el).classList.toggle('show'));
    });
  }
  function refreshQuizFeedback(el){
    if(!el)return;const i=Number(el.dataset.index),state=quizState[i],item=quizData[i],feedback=$('.quiz-feedback',el);
    $$('.option',el).forEach((op,j)=>{op.classList.remove('correct','wrong');if(state.revealed){if(j===item.a)op.classList.add('correct');if(state.choice===j&&j!==item.a)op.classList.add('wrong')}});
    if(!state.revealed||state.choice===null){feedback.className='quiz-feedback hidden';feedback.textContent='';return}
    const good=state.choice===item.a;feedback.className='quiz-feedback '+(good?'good':'bad');feedback.innerHTML=`<strong>${good?'Correct.':'Not quite.'}</strong> ${item.e}`;
    if(trainingMode.value==='preview')feedback.classList.add('hidden');
  }
  function quizScore(){return quizState.filter((s,i)=>s.choice===quizData[i].a).length}
  function updateQuizScore(){const s=quizScore();$('#quizScoreBadge').textContent=`${s} / ${quizData.length}`;$('#reportQuiz').textContent=`${s} / ${quizData.length}`;}
  $('#finishQuizBtn').addEventListener('click',()=>{
    quizState.forEach(s=>s.revealed=true);$$('.quiz-item').forEach(refreshQuizFeedback);const answered=quizState.filter(s=>s.choice!==null).length,s=quizScore();
    const summary=$('#quizSummary');summary.classList.remove('hidden');summary.innerHTML=`<strong>${s} / ${quizData.length}</strong> correct · ${answered}/${quizData.length} answered.<br><span>This is an orientation knowledge check, not an official LILATE result.</span>`;summary.scrollIntoView({behavior:'smooth',block:'center'});updateQuizScore();
  });
  $('#revealModelsBtn').addEventListener('click',()=>{quizState.forEach(s=>s.revealed=true);$$('.quiz-item').forEach(refreshQuizFeedback);});
  renderQuiz();updateQuizScore();

  // Reports
  function reportText(){
    const ready=readyBoxes.filter(x=>x.checked).length;
    const reviewed=quizState.filter(s=>s.choice!==null).length;
    return [
      'LILATE — LESSON 1 · COMPLETE EXAM ORIENTATION','',
      'TRAINING NOTICE','Independent training resource — not the official LILATE exam or an official CEFR result.','',
      `Modality reviewed last: ${currentModality==='ai'?'LILATE IA':'LILATE Examiner'}`,
      `Orientation knowledge check: ${quizScore()} / ${quizData.length} (${reviewed}/${quizData.length} answered)`,
      `Test-day readiness checklist: ${ready} / ${readyBoxes.length} (${Math.round(ready/readyBoxes.length*100)}%)`,'',
      'CORE STRUCTURE','1. Accueil & interaction','2. Recueil & transcription','3. Recueil & transmission','4. Recueil & exploitation','',
      'KEY REMINDERS','Certificate threshold for spoken languages: B1','IA: system-paced, per-question response time shown on screen','Examiner: up to 60 minutes, examiner controls pacing','Results are normally available within 24 hours','',
      'NEXT TRAINING LESSON','Part 1 — Accueil & interaction','',
      `Generated: ${new Date().toLocaleString()}`
    ].join('\n');
  }
  function downloadText(text,name){const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
  $('#downloadReportBtn').addEventListener('click',()=>{downloadText(reportText(),'LILATE-Lesson-1-Orientation-Report.txt');$('#reportMessage').textContent='Report downloaded.';});
  $('#copyReportBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(reportText());$('#reportMessage').textContent='Report copied.';toast('Report copied.');}catch{$('#reportMessage').textContent='Copy is unavailable in this browser. Use Download lesson report.';}});

  // Reset
  $('#resetBtn').addEventListener('click',()=>{
    if(!confirm('Reset all Lesson 1 training progress on this page?'))return;
    safeStorage.remove('lilate_l1_readiness');readyBoxes.forEach(x=>x.checked=false);updateReadiness();
    quizState.forEach(s=>{s.choice=null;s.revealed=false});renderQuiz();updateQuizScore();$('#quizSummary').classList.add('hidden');
    resetTimer();stopVideo();videoSec=0;renderVideo();$('#videoTranscript').classList.add('hidden');
    trainingMode.value='guided';document.body.classList.remove('exam-preview');
    $('.gate').classList.remove('accepted');disclaimerCheck.checked=false;enterBtn.disabled=true;window.scrollTo({top:0,behavior:'smooth'});
    toast('Lesson reset.');
  });
})();
