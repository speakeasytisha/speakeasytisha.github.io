(() => {
  'use strict';
  const STORAGE_KEY = 'yanisLilateProgressV1';
  const TOTAL_SECONDS = 50 * 60;
  const $ = (selector) => document.querySelector(selector);
  const liveRegion = $('#liveRegion');

  const groups = {
    foundation: [
      { id:'f1', skill:'Language accuracy', prompt:'I ___ a receptionist in a three-star hotel.', choices:['am','is','are'], answer:0, why:'Use <strong>I am</strong> to introduce yourself.' },
      { id:'f2', skill:'Language accuracy', prompt:'He ___ in a hotel near the airport.', choices:['work','works','working'], answer:1, why:'With <strong>he / she / it</strong>, add <strong>-s</strong> in the present simple.' },
      { id:'f3', skill:'Language accuracy', prompt:'Do you ___ English on the phone?', choices:['use','uses','using'], answer:0, why:'After <strong>do</strong>, use the base verb: <strong>use</strong>.' },
      { id:'f4', skill:'Language accuracy', prompt:'My main duties ___ welcoming guests and answering the phone.', choices:['is','are','be'], answer:1, why:'<strong>Duties</strong> is plural, so use <strong>are</strong>.' },
      { id:'f5', skill:'Language accuracy', prompt:'She doesn’t ___ at the airport yet.', choices:['works','work','working'], answer:1, why:'After <strong>doesn’t</strong>, use the base verb: <strong>work</strong>.' },
      { id:'f6', skill:'Language accuracy', prompt:'I work ___ reception and I reply ___ emails.', choices:['in / on','at / to','at / by'], answer:1, why:'We say <strong>work at reception</strong> and <strong>reply to emails</strong>.' },
      { id:'f7', skill:'Language accuracy', prompt:'I use English ___ the phone and ___ email.', choices:['in / in','on / by','at / by'], answer:1, why:'The fixed expressions are <strong>on the phone</strong> and <strong>by email</strong>.' },
      { id:'f8', skill:'Language accuracy', prompt:'A good steward speaks ___ to passengers.', choices:['polite','politely','politeness'], answer:1, why:'Use an adverb after <strong>speaks</strong>: <strong>politely</strong>.' }
    ],
    airport: [
      { id:'a1', skill:'Vocabulary', prompt:'Please place your bag in the ___ bin.', choices:['overhead','boarding','arrival'], answer:0, why:'An <strong>overhead bin</strong> is the storage space above the seats.' },
      { id:'a2', skill:'Vocabulary', prompt:'A passenger shows a ___ pass at the gate.', choices:['seatbelt','boarding','flight'], answer:1, why:'The document is a <strong>boarding pass</strong>.' },
      { id:'a3', skill:'Vocabulary', prompt:'A flight delay is a change in the planned ___ time.', choices:['departure','blanket','passenger'], answer:0, why:'A flight’s <strong>departure time</strong> is when it leaves.' },
      { id:'a4', skill:'Service language', prompt:'Please ___ your seat belt before take-off.', choices:['fasten','fastens','to fasten'], answer:0, why:'For a polite instruction, use <strong>Please + base verb</strong>.' },
      { id:'a5', skill:'Service language', prompt:'Passengers ___ remain seated during take-off.', choices:['must','must to','are must'], answer:0, why:'Use <strong>must + base verb</strong> for a strong obligation.' },
      { id:'a6', skill:'Service language', prompt:'___ show your boarding pass. Then go to gate B12.', choices:['First','Because','But'], answer:0, why:'Use <strong>First</strong> to begin a clear procedure.' }
    ],
    passenger: [
      { id:'p1', skill:'Language accuracy', prompt:'She is from Italy. She is ___.', choices:['Italy','Italian','Italish'], answer:1, why:'Use the nationality after <strong>be</strong>: <strong>She is Italian.</strong>' },
      { id:'p2', skill:'Language accuracy', prompt:'Mr Doyle is travelling with ___ daughter.', choices:['his','her','their'], answer:0, why:'For one man, use <strong>his</strong>.' },
      { id:'p3', skill:'Language accuracy', prompt:'Are ___ your documents here?', choices:['this','these','that'], answer:1, why:'Use <strong>these</strong> for several things near you.' },
      { id:'p4', skill:'Language accuracy', prompt:'Could you tell me ___ this is your boarding pass?', choices:['whether','where','what'], answer:0, why:'Use <strong>whether</strong> to check if something is correct.' },
      { id:'p5', skill:'Language accuracy', prompt:'They are travelling with children. ___ seats are together.', choices:['Their','They','Them'], answer:0, why:'Use <strong>their</strong> before the noun <strong>seats</strong>.' },
      { id:'p6', skill:'Language accuracy', prompt:'The passenger is from the USA. He is ___.', choices:['American','USA','Americain'], answer:0, why:'The nationality is <strong>American</strong>.' }
    ],
    service: [
      { id:'s1', skill:'Service language', prompt:'Can I offer you ___ water?', choices:['some','many','a'], answer:0, why:'Use <strong>some</strong> with uncountable nouns such as water.' },
      { id:'s2', skill:'Service language', prompt:'Do you need ___ blanket?', choices:['a','some','much'], answer:0, why:'A blanket is one countable item: <strong>a blanket</strong>.' },
      { id:'s3', skill:'Service language', prompt:'Here ___ your headphones.', choices:['is','are','be'], answer:1, why:'Headphones are plural: <strong>Here are your headphones.</strong>' },
      { id:'s4', skill:'Service language', prompt:'Here ___ your vegetarian meal.', choices:['is','are','am'], answer:0, why:'A meal is singular: <strong>Here is your vegetarian meal.</strong>' },
      { id:'s5', skill:'Service language', prompt:'There aren’t ___ aisle seats available.', choices:['any','much','a little'], answer:0, why:'Use <strong>any</strong> in this negative sentence with plural countable nouns.' },
      { id:'s6', skill:'Service language', prompt:'How ___ bags do you have?', choices:['much','many','little'], answer:1, why:'Bags are countable, so use <strong>many</strong>.' }
    ],
    listening: [
      { id:'l1', skill:'Listening', prompt:'Where will Flight TS 712 board?', choices:['Gate D6','Gate A9','Gate C3'], answer:0, why:'The announcement says the flight will board at <strong>gate D6</strong>.' },
      { id:'l2', skill:'Listening', prompt:'Who may board first?', choices:['Families with young children','Passengers in aisle seats','Passengers with cabin bags'], answer:0, why:'Families with young children may board first.' },
      { id:'l3', skill:'Listening', prompt:'What does the passenger in seat 18B need?', choices:['A blanket and water','A vegetarian meal','A new seat'], answer:0, why:'He asked for <strong>a blanket and some water</strong>.' },
      { id:'l4', skill:'Listening', prompt:'How many extra pillows should the crew bring?', choices:['One','Two','Three'], answer:1, why:'The family needs <strong>two extra pillows</strong>.' }
    ],
    reading: [
      { id:'r1', skill:'Reading', prompt:'What is the new boarding gate?', choices:['A4','A7','B7'], answer:1, why:'Boarding moved from A4 to <strong>A7</strong>.' },
      { id:'r2', skill:'Reading', prompt:'Why did the gate change?', choices:['A technical check','Bad weather','A late passenger'], answer:0, why:'The note says the change is because of a <strong>technical check</strong>.' },
      { id:'r3', skill:'Reading', prompt:'What is missing for Ms Green?', choices:['Her vegetarian meal','Her passport','Her suitcase'], answer:0, why:'Her <strong>vegetarian meal request</strong> is missing.' },
      { id:'r4', skill:'Reading', prompt:'Who needs help with cabin bags?', choices:['Mr and Mrs Rossi','Ms Green','The gate agent'], answer:0, why:'<strong>Mr and Mrs Rossi</strong> need help storing two cabin bags.' }
    ]
  };

  const listeningTasks = [
    { title:'Airport boarding announcement', label:'AUDIO 1', text:'Good afternoon, passengers. Flight TS 712 to Rome will now board at gate D6. Families with young children may board first. Please keep your passport and boarding pass ready.', questionIds:['l1','l2'] },
    { title:'Cabin crew service message', label:'AUDIO 2', text:'Attention cabin crew. The passenger in seat 18B has asked for a blanket and some water. He is travelling with his wife and their two children. Please bring two extra pillows to the family.', questionIds:['l3','l4'] }
  ];

  const speakingTasks = [
    {
      id:'speak-intro', title:'Prompt 1 · Your professional introduction', quote:'“Please introduce yourself, describe your current job and explain why you want to become cabin crew.”',
      models:[
        ['A2 foundation','My name is Yanis. I work as a receptionist in a three-star hotel. I welcome guests and answer the phone. I use English on the phone and by email. I want to become a steward because I like helping people.'],
        ['B1 target','My name is Yanis and I currently work as a receptionist in a three-star hotel. My main duties are welcoming guests, answering the phone and replying to emails. I use English with international guests. I would like to become cabin crew because I enjoy customer service and I want to work in air travel.'],
        ['B2 stretch','My name is Yanis. I currently work as a receptionist in a three-star hotel, where I welcome guests, manage requests and solve small problems calmly. I use English on the phone and by email with international guests. This experience has taught me to stay polite and organised, which is why I would now like to develop a career as cabin crew.']
      ]
    },
    {
      id:'speak-clarify', title:'Prompt 2 · Clarify passenger details', quote:'“A passenger gives you two passports and says: ‘I think these are for my children, but I am not sure about this boarding pass.’ Ask clear questions and confirm the details.”',
      models:[
        ['A2 foundation','Of course. Are these your children’s passports? Is this your boarding pass? Can I check the names, please?'],
        ['B1 target','Of course, I can help. Are these your children’s passports? Could you please show me this boarding pass? I would like to check whether the names and seats are correct.'],
        ['B2 stretch','Certainly, let me check the details with you. Are these both your children’s passports? Could I see this boarding pass, please? I would like to confirm whether the names, flight number and seat numbers match your documents.']
      ]
    },
    {
      id:'speak-service', title:'Prompt 3 · On-board service', quote:'“A passenger says: ‘Can I have some water and a blanket, please?’ Respond professionally and explain your next step.”',
      models:[
        ['A2 foundation','Of course. Here is some water. I will bring you a blanket now.'],
        ['B1 target','Of course, I can help you. Here is some water. Please make yourself comfortable, and I will bring you a blanket in a moment.'],
        ['B2 stretch','Of course, I would be happy to help. Here is some water for you. I will bring you a blanket straight away, and I will come back in a few minutes to check whether you need anything else.']
      ]
    }
  ];

  const writingModels = [
    ['A2 foundation','Hello,\n\nMs Green is in seat 10C. Her vegetarian meal is missing. She is travelling alone and she wants information about her connection after landing. Please check her meal and give her an update later.\n\nMr and Mrs Rossi are in seats 12A and 12B. They have two cabin bags. Please help them store the bags before take-off.\n\nThank you.'],
    ['B1 target','Hello,\n\nMs Green is seated in 10C. Her vegetarian meal request is missing, so please check the meal list and offer her the correct meal as soon as possible. She is travelling alone and would also like an update about her connection after landing.\n\nMr and Mrs Rossi are in 12A and 12B. They need assistance with two cabin bags before take-off. Please help them store the bags safely.\n\nThank you.'],
    ['B2 stretch','Hello,\n\nPlease follow up with Ms Green in seat 10C. Her vegetarian meal request was not available at service, so could you check the catering list and offer a suitable alternative if necessary? She is travelling alone and has asked for an update about her onward connection after landing.\n\nAlso, Mr and Mrs Rossi in 12A and 12B need help storing two cabin bags before take-off. Please make sure the bags are safely placed and that the aisle remains clear.\n\nThank you.']
  ];

  const state = { started:false, finished:false, remaining:TOTAL_SECONDS, timerId:null, voice:'en-GB', answers:new Map(), recordings:new Map(), recorders:new Map(), recordTimers:new Map(), saved:false };

  function pad(n){ return String(n).padStart(2,'0'); }
  function clock(seconds){ return `${pad(Math.floor(Math.max(0,seconds)/60))}:${pad(Math.max(0,seconds)%60)}`; }
  function dateStamp(){ return new Date().toISOString().slice(0,10); }
  function wordCount(text){ return (text.trim().match(/\S+/g)||[]).length; }
  function allQuestions(){ return Object.values(groups).flat(); }
  function questionById(id){ return allQuestions().find(q=>q.id===id); }
  function autoScore(){ return allQuestions().reduce((sum,q)=>sum+(state.answers.get(q.id)===q.answer?1:0),0); }
  function selectedCount(){ return state.answers.size; }
  function updateMiniScore(){ $('#miniAutoScore').textContent = `${autoScore()} / 34`; }
  function download(filename,type,content){ const blob = new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1200); }
  function speak(text){ if(!('speechSynthesis' in window)){ liveRegion.textContent='Audio is not available in this browser.'; return; } window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=state.voice; u.rate=.88; const voices=speechSynthesis.getVoices(); u.voice=voices.find(v=>v.lang.toLowerCase()===state.voice.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(state.voice.slice(0,2).toLowerCase()))||null; speechSynthesis.speak(u); }

  function renderQuestion(question){
    const card=document.createElement('article'); card.className='question-card'; card.dataset.questionId=question.id;
    card.innerHTML=`<h3>${question.prompt}</h3><div class="choice-row"></div><p class="question-feedback" aria-live="polite"></p>`;
    const choices=card.querySelector('.choice-row');
    question.choices.forEach((choice,index)=>{ const btn=document.createElement('button'); btn.type='button'; btn.className='choice-btn'; btn.textContent=choice; btn.addEventListener('click',()=>choose(question.id,index,card)); choices.appendChild(btn); });
    return card;
  }
  function choose(id,index,card){
    if(state.finished || state.answers.has(id)) return;
    state.answers.set(id,index);
    const question=questionById(id);
    markQuestion(question);
    updateMiniScore();
    const correct=index===question.answer;
    liveRegion.textContent=correct ? 'Correct. Your score has been updated.' : `Not quite. The correct answer is ${question.choices[question.answer]}. Read the short correction below.`;
  }
  function renderGroup(targetId, questions){ const target=$(targetId); questions.forEach(q=>target.appendChild(renderQuestion(q))); }

  function renderListening(){
    const target=$('#listeningTasks');
    listeningTasks.forEach((task,taskIndex)=>{
      const article=document.createElement('article'); article.className='listening-card';
      article.innerHTML=`<div class="listening-audio"><span class="task-label">${task.label}</span><h3>${task.title}</h3><button type="button" class="audio-play-btn">▶ Listen <span>(0/2)</span></button><p>Use the audio only. The transcript unlocks after correction.</p></div><div><div class="question-list"></div><div class="transcript" hidden><strong>Transcript</strong><br>${task.text}</div></div>`;
      let plays=0; const btn=article.querySelector('.audio-play-btn');
      btn.addEventListener('click',()=>{ if(plays>=2||state.finished&&plays>=2) return; plays+=1; btn.innerHTML=`▶ Listen <span>(${plays}/2)</span>`; if(plays===2){ btn.disabled=true; btn.innerHTML='✓ 2 plays used'; } speak(task.text); });
      task.questionIds.forEach(id=>{
        const q=questionById(id); const block=document.createElement('div'); block.className='question-block'; block.dataset.questionId=q.id; block.innerHTML=`<p>${q.prompt}</p><div class="choice-row"></div><p class="question-feedback" aria-live="polite"></p>`;
        q.choices.forEach((choice,index)=>{ const b=document.createElement('button'); b.type='button'; b.className='choice-btn'; b.textContent=choice; b.addEventListener('click',()=>choose(q.id,index,block)); block.querySelector('.choice-row').appendChild(b); });
        article.querySelector('.question-list').appendChild(block);
      });
      target.appendChild(article);
    });
  }

  function modelBlock(models, lockedLabel='Finish the checkpoint to see model answers'){
    const wrap=document.createElement('div'); wrap.className='model-answer-wrap model-locked';
    const btn=document.createElement('button'); btn.type='button'; btn.className='transcript-btn'; btn.textContent=`🔒 ${lockedLabel}`; btn.disabled=true;
    const body=document.createElement('div'); body.className='model-answer-body'; body.hidden=true;
    models.forEach(([level,text])=>{ const item=document.createElement('article'); item.className='model-level'; item.innerHTML=`<strong>${level}</strong><p>${text.replace(/\n/g,'<br>')}</p>`; body.appendChild(item); });
    btn.addEventListener('click',()=>{ if(!state.finished) return; const open=body.hidden; body.hidden=!open; btn.textContent=open?'Hide model answers':'Show model answers'; });
    wrap.append(btn,body); return wrap;
  }

  function renderSpeaking(){
    const target=$('#speakingTasks');
    speakingTasks.forEach(task=>{
      const card=document.createElement('article'); card.className='roleplay-card';
      card.innerHTML=`<span class="task-label">SPEAK & RECORD</span><h3>${task.title}</h3><p class="scenario-quote">${task.quote}</p><textarea class="answer-notes" rows="4" placeholder="Optional notes / useful words..."></textarea>`;
      addRecording(card,task.id);
      card.appendChild(modelBlock(task.models));
      target.appendChild(card);
    });
    const writingWrap=$('#writingModels'); const model=modelBlock(writingModels); writingWrap.replaceWith(model); model.id='writingModels';
  }

  function addRecording(card,id){
    const controls=document.createElement('div'); controls.className='recording-controls'; controls.innerHTML='<button class="record-btn" type="button">● Record (max 90 sec)</button><button class="stop-btn" type="button" disabled>■ Stop</button><button class="download-audio" type="button" disabled>⇩ Download audio</button>';
    const status=document.createElement('p'); status.className='record-status'; status.textContent='Recording is optional. Your browser may ask for microphone permission.';
    controls.querySelector('.record-btn').addEventListener('click',()=>startRecording(id,controls,status));
    controls.querySelector('.stop-btn').addEventListener('click',()=>stopRecording(id,controls,status));
    controls.querySelector('.download-audio').addEventListener('click',()=>downloadAudio(id,status));
    card.append(controls,status);
  }
  async function startRecording(id,controls,status){
    if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){ status.textContent='Recording is not supported here. Use the notes box instead.'; return; }
    if(state.recorders.has(id)) return;
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true}); const options=MediaRecorder.isTypeSupported?.('audio/webm')?{mimeType:'audio/webm'}:undefined; const recorder=new MediaRecorder(stream,options); const chunks=[];
      recorder.addEventListener('dataavailable',e=>{ if(e.data.size) chunks.push(e.data); });
      recorder.addEventListener('stop',()=>{ const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'}); state.recordings.set(id,blob); stream.getTracks().forEach(t=>t.stop()); state.recorders.delete(id); const t=state.recordTimers.get(id); if(t) clearInterval(t); state.recordTimers.delete(id); controls.querySelector('.record-btn').disabled=false; controls.querySelector('.record-btn').classList.remove('is-recording'); controls.querySelector('.stop-btn').disabled=true; controls.querySelector('.download-audio').disabled=false; status.textContent='Recording ready. Download it and listen once before self-reviewing.'; });
      recorder.start(); state.recorders.set(id,recorder); controls.querySelector('.record-btn').disabled=true; controls.querySelector('.record-btn').classList.add('is-recording'); controls.querySelector('.stop-btn').disabled=false;
      let seconds=90; status.textContent=`Recording… ${seconds} seconds remaining.`; const timer=setInterval(()=>{ seconds-=1; status.textContent=`Recording… ${seconds} seconds remaining.`; if(seconds<=0) stopRecording(id,controls,status); },1000); state.recordTimers.set(id,timer);
    } catch { status.textContent='Microphone permission was not granted. Use the notes box instead.'; }
  }
  function stopRecording(id,controls,status){ const r=state.recorders.get(id); if(r&&r.state!=='inactive'){ r.stop(); status.textContent='Saving your recording…'; } }
  function downloadAudio(id,status){ const blob=state.recordings.get(id); if(!blob){ status.textContent='No recording is ready yet.'; return; } download(`yanis-midterm-${id}-${dateStamp()}.webm`,blob.type||'audio/webm',blob); status.textContent='Audio downloaded to your device.'; }

  function reviewScore(name){ return [...document.querySelectorAll(`[data-review="${name}"]`)].filter(input=>input.checked).length; }
  function updateReview(){ $('#writingScore').textContent=`${reviewScore('writing')} / 4`; $('#speakingScore').textContent=`${reviewScore('speaking')} / 4`; }
  function updateTimer(){ $('#midtermTimer').textContent=clock(state.remaining); const spent=((TOTAL_SECONDS-state.remaining)/TOTAL_SECONDS)*100; $('#timeProgress').style.width=`${Math.max(0,100-spent)}%`; if(state.remaining<=0){ $('#midtermTimer').classList.add('is-over'); $('#timerStatus').textContent='TIME UP'; $('#timerMessage').textContent='Time is up. Finish the tasks and unlock the correction.'; } }
  function startMidterm(){ if(state.started) return; state.started=true; $('#startMidterm').disabled=true; $('#startMidterm').textContent='Checkpoint in progress'; $('#timerStatus').textContent='IN PROGRESS'; $('#timerMessage').textContent='Work steadily and answer from memory.'; state.timerId=setInterval(()=>{ state.remaining-=1; updateTimer(); if(state.remaining<=0){ clearInterval(state.timerId); state.timerId=null; liveRegion.textContent='Time is up. Finish the checkpoint when ready.'; } },1000); updateTimer(); $('#section-foundation').scrollIntoView({behavior:'smooth',block:'start'}); }

  function markQuestion(q){
    const selected=state.answers.get(q.id);
    document.querySelectorAll(`[data-question-id="${q.id}"]`).forEach(card=>{
      const feedback=card.querySelector('.question-feedback');
      card.classList.add('is-answered');
      card.querySelectorAll('.choice-btn').forEach((btn,index)=>{
        btn.disabled=true;
        btn.classList.remove('selected','correct','wrong');
        if(index===q.answer) btn.classList.add('correct');
        if(selected===index&&index!==q.answer) btn.classList.add('wrong');
      });
      if(selected===q.answer){
        feedback.innerHTML=`<strong>✓ Correct.</strong> ${q.why}`;
        feedback.className='question-feedback is-correct';
      } else {
        feedback.innerHTML=`<strong>✗ Not quite.</strong> Correct answer: <strong>${q.choices[q.answer]}</strong>. ${q.why}`;
        feedback.className='question-feedback is-wrong';
      }
    });
  }
  function unlockSupport(){ document.querySelectorAll('.transcript').forEach(t=>t.hidden=false); document.querySelectorAll('.model-answer-wrap').forEach(wrap=>{ wrap.classList.remove('model-locked'); const btn=wrap.querySelector('button'); if(btn){ btn.disabled=false; btn.textContent='Show model answers'; } }); }
  function skillTotal(skill){ const qs=allQuestions().filter(q=>q.skill===skill); return {score:qs.filter(q=>state.answers.get(q.id)===q.answer).length,max:qs.length}; }
  function saveResult(){ if(state.saved) return; const w=reviewScore('writing'); const s=reviewScore('speaking'); const total=autoScore()+w+s; const entry={ id:`midterm-${Date.now()}`, type:'midterm', title:'Midterm Flight Checkpoint', date:new Date().toISOString(), score:total, max:42, percentage:Math.round(total/42*100), note:`Auto-marked ${autoScore()}/34 · Writing self-review ${w}/4 · Speaking self-review ${s}/4`, skills:{ 'Language accuracy':{...skillTotal('Language accuracy'),type:'Auto-marked'}, 'Vocabulary':{...skillTotal('Vocabulary'),type:'Auto-marked'}, 'Service language':{...skillTotal('Service language'),type:'Auto-marked'}, 'Listening':{...skillTotal('Listening'),type:'Auto-marked'}, 'Reading':{...skillTotal('Reading'),type:'Auto-marked'}, 'Writing':{score:w,max:4,type:'Self-review'}, 'Role-play':{score:s,max:4,type:'Self-review'} } };
    try { const entries=JSON.parse(localStorage.getItem(STORAGE_KEY))||[]; entries.unshift(entry); localStorage.setItem(STORAGE_KEY,JSON.stringify(entries)); state.saved=true; return entry; } catch { return entry; }
  }
  function focusText(entry){ const assessed=Object.entries(entry.skills).filter(([,v])=>v.max>0).map(([k,v])=>({k,p:Math.round(v.score/v.max*100)})).sort((a,b)=>a.p-b.p); return assessed[0]?`${assessed[0].k} (${assessed[0].p}%)`:''; }
  function finish(){ if(state.finished) return; state.finished=true; if(state.timerId) clearInterval(state.timerId); allQuestions().forEach(markQuestion); unlockSupport(); updateMiniScore(); const entry=saveResult(); const auto=autoScore(), w=reviewScore('writing'), s=reviewScore('speaking'); const card=$('#resultCard'); card.hidden=false; card.innerHTML=`<h3>Your midterm checkpoint is complete.</h3><p><strong>Auto-marked result:</strong> ${auto} / 34. <strong>Training total:</strong> ${entry.score} / 42 (${entry.percentage}%).</p><div class="result-grid"><div class="result-metric"><span>Language accuracy</span><strong>${entry.skills['Language accuracy'].score} / ${entry.skills['Language accuracy'].max}</strong></div><div class="result-metric"><span>Service language</span><strong>${entry.skills['Service language'].score} / ${entry.skills['Service language'].max}</strong></div><div class="result-metric"><span>Next review</span><strong>${focusText(entry)}</strong></div></div><p>Your result has been saved to the Score Passport on this device. Now read the feedback and compare your writing and speaking with the A2, B1 and B2 models.</p>`; $('#finishMidterm').disabled=true; $('#finishMidterm').textContent='Correction unlocked'; liveRegion.textContent='Correction unlocked and result saved to the Score Passport.'; card.scrollIntoView({behavior:'smooth',block:'center'}); }
  function summary(){ const score=state.finished?autoScore():'not yet marked'; const w=reviewScore('writing'), s=reviewScore('speaking'); const text=`YANIS · MIDTERM FLIGHT CHECKPOINT\nDate: ${dateStamp()}\n\nAuto-marked score: ${score} / 34\nWriting self-review: ${w} / 4\nSpeaking self-review: ${s} / 4\n\nWriting response:\n${$('#writingResponse').value.trim()||'(No writing saved)'}\n\nNext step: review every correction, then add notes from the model answers.`; download(`yanis-midterm-summary-${dateStamp()}.txt`,'text/plain;charset=utf-8',text); }

  function init(){
    renderGroup('#foundationQuestions',groups.foundation); renderGroup('#airportQuestions',groups.airport); renderGroup('#passengerQuestions',groups.passenger); renderGroup('#serviceQuestions',groups.service); renderListening(); renderGroup('#readingQuestions',groups.reading); renderSpeaking();
    $('#startMidterm').addEventListener('click',startMidterm); $('#finishMidterm').addEventListener('click',finish); $('#downloadSummary').addEventListener('click',summary);
    $('#writingResponse').addEventListener('input',()=>{ const count=wordCount($('#writingResponse').value); $('#wordCount').textContent=`${count} ${count===1?'word':'words'}`; });
    $('#downloadWriting').addEventListener('click',()=>download(`yanis-midterm-writing-${dateStamp()}.txt`,'text/plain;charset=utf-8',$('#writingResponse').value||''));
    $('#clearWriting').addEventListener('click',()=>{ $('#writingResponse').value=''; $('#wordCount').textContent='0 words'; });
    $('#productionChecklist').addEventListener('change',updateReview);
    document.querySelectorAll('.voice-button').forEach(btn=>btn.addEventListener('click',()=>{ state.voice=btn.dataset.voice; document.querySelectorAll('.voice-button').forEach(b=>b.classList.toggle('active',b===btn)); }));
    updateMiniScore(); updateReview(); updateTimer();
  }
  init();
})();
