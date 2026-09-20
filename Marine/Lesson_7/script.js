(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORAGE = 'lilate_strategy_mock_2_state_v1';

  const partMeta = {
    1:{title:'Accueil et interaction', action:'Identify · respond · welcome'},
    2:{title:'Recueil et transcription', action:'Collect · reformulate · write'},
    3:{title:'Recueil et transmission', action:'Relay · explain · clarify'},
    4:{title:'Recueil et exploitation', action:'Analyse · decide · argue'}
  };

  const vocab = [
    {cat:'Buying time', level:'core', en:'Let me think for a moment.', fr:'Laissez-moi réfléchir un instant.', ex:'Let me think for a moment. The best option would be the later train.'},
    {cat:'Buying time', level:'core', en:'From the information I have…', fr:'D’après les informations que j’ai…', ex:'From the information I have, the meeting starts at 2 p.m.'},
    {cat:'Clarifying', level:'core', en:'If I understood correctly…', fr:'Si j’ai bien compris…', ex:'If I understood correctly, you need the revised document today.'},
    {cat:'Clarifying', level:'stretch', en:'Could you clarify what you mean by…?', fr:'Pourriez-vous préciser ce que vous entendez par… ?', ex:'Could you clarify what you mean by “urgent delivery”?'},
    {cat:'Reformulating', level:'core', en:'So, the main point is that…', fr:'Donc, l’essentiel est que…', ex:'So, the main point is that the client needs a quieter room.'},
    {cat:'Reformulating', level:'stretch', en:'In other words…', fr:'Autrement dit…', ex:'In other words, the original booking is no longer available.'},
    {cat:'Transmitting', level:'core', en:'I was asked to let you know that…', fr:'On m’a demandé de vous informer que…', ex:'I was asked to let you know that the delivery will arrive tomorrow.'},
    {cat:'Transmitting', level:'core', en:'The next step is to…', fr:'La prochaine étape consiste à…', ex:'The next step is to confirm the new time by email.'},
    {cat:'Transmitting', level:'stretch', en:'Please make sure that…', fr:'Veuillez vous assurer que…', ex:'Please make sure that the form is signed before you send it.'},
    {cat:'Problem solving', level:'core', en:'What I can do is…', fr:'Ce que je peux faire, c’est…', ex:'What I can do is check the next available appointment.'},
    {cat:'Problem solving', level:'stretch', en:'A practical alternative would be…', fr:'Une alternative pratique serait…', ex:'A practical alternative would be to move the meeting online.'},
    {cat:'Opinion & decision', level:'core', en:'I would recommend… because…', fr:'Je recommanderais… parce que…', ex:'I would recommend option B because it is faster and more flexible.'},
    {cat:'Opinion & decision', level:'stretch', en:'On balance, I would choose…', fr:'Tout bien considéré, je choisirais…', ex:'On balance, I would choose the morning slot because it reduces the risk of delay.'},
    {cat:'Professional tone', level:'core', en:'Thank you for letting me know.', fr:'Merci de m’avoir informé(e).', ex:'Thank you for letting me know. I will update the schedule.'},
    {cat:'Professional tone', level:'stretch', en:'I appreciate your patience.', fr:'Je vous remercie pour votre patience.', ex:'I appreciate your patience while I check this for you.'},
    {cat:'Listening targets', level:'core', en:'date · time · place · number · change', fr:'date · heure · lieu · nombre · changement', ex:'Listen for the facts that can change the action you take.'},
    {cat:'Listening targets', level:'stretch', en:'reason · condition · exception · next action', fr:'raison · condition · exception · prochaine action', ex:'These details often distinguish the best answer from a plausible answer.'}
  ];

  const tasks = [
    {
      id:'p1q1', part:1, type:'single', skill:'Reading', seconds:80,
      instruction:'Read the message and choose the best professional response.',
      prompt:'A customer writes: “I booked a video appointment for Thursday at 3 p.m., but I have just been asked to attend a work meeting at that time. I am available before noon on Thursday or any time Friday. Could you help me change it?”',
      question:'What should you do first?',
      options:['Confirm that the appointment has already been cancelled.','Acknowledge the request and check an alternative time.','Ask the customer to explain why the work meeting is important.','Tell the customer to make a completely new booking.'], answer:1,
      technique:'Spot the action word: the customer is asking for help changing an appointment. Target the available times. Your first response should acknowledge + solve.',
      fr:'La personne veut modifier un rendez-vous. Repérez ses disponibilités et choisissez la réponse qui reconnaît la demande et propose une solution.',
      model:'Thank you for letting me know. I can check an alternative appointment before noon on Thursday or on Friday.'
    },
    {
      id:'p1q2', part:1, type:'multi', skill:'Listening', seconds:95,
      instruction:'Listen and select ALL the details you need to handle the request correctly.',
      audio:'Hello. I am calling about my booking for tomorrow evening. My train now arrives at six forty-five instead of five fifty, so I will probably reach you around seven thirty. Could you confirm that a late arrival is possible? My booking reference is K F two eight four.',
      question:'Which details are operationally useful?',
      options:['The arrival time is now about 7:30 p.m.','The train originally arrived at 5:50 p.m.','The booking reference is KF284.','The customer wants confirmation that late arrival is possible.'], answer:[0,2,3],
      technique:'Do not write every number. Target only facts that change what you need to do: new arrival time, reference, requested action.',
      fr:'Ne retenez pas tous les chiffres. Gardez les informations qui déterminent l’action à prendre : nouvelle heure, référence et demande.',
      model:'The customer expects to arrive at about 7:30 p.m., the reference is KF284, and they need confirmation that a late arrival is possible.'
    },
    {
      id:'p1q3', part:1, type:'oral', skill:'Speaking', seconds:110,
      instruction:'Record a short professional response. Aim for 35–55 seconds.',
      prompt:'You are speaking to someone whose original appointment is no longer available. You can offer Tuesday at 10:00 or Wednesday at 14:30.',
      question:'Welcome the person, explain the situation, offer the two alternatives and ask which option is better.',
      technique:'Use 4 moves: welcome → simple explanation → two options → question. You do not need complicated grammar.',
      fr:'Faites 4 étapes : accueil → explication simple → deux options → question finale.',
      phrases:['Thank you for your patience.','Unfortunately, the original time is no longer available.','What I can offer is…','Which option would suit you better?'],
      model:'Thank you for your patience. Unfortunately, the original appointment is no longer available. What I can offer is Tuesday at 10 a.m. or Wednesday at 2:30 p.m. Which option would suit you better?'
    },
    {
      id:'p2q1', part:2, type:'single', skill:'Listening', seconds:85,
      instruction:'Listen for the change, not the whole story.',
      audio:'Hi, this is Daniel from Northshore Supplies. A quick update about tomorrow. The delivery will still arrive at your main site, but not in the morning. The driver has been delayed on another route and now expects to arrive between two and three in the afternoon. Please tell reception so they can keep the loading area free.',
      question:'What is the most important change?',
      options:['The delivery location has changed.','The delivery will arrive between 2 and 3 p.m.','Reception must call the driver.','The order has been cancelled.'], answer:1,
      technique:'Listening shortcut: ask “What changed?” The location did not change; the time did.',
      fr:'Posez-vous la question : « Qu’est-ce qui a changé ? » Ici, c’est l’heure, pas le lieu.',
      model:'The delivery is now expected between 2 and 3 p.m.'
    },
    {
      id:'p2q2', part:2, type:'written', skill:'Writing', seconds:150,
      instruction:'Write a short internal message using only the useful information.',
      prompt:'You heard this message: “The 9:00 training session has moved to Room B214 because Room A102 has a technical problem. The session will still start at 9:00. Everyone should bring a laptop, and the trainer would like participants to arrive ten minutes early.”',
      question:'Write a 45–70 word message to your team. Include the location change, what stays the same, what to bring and when to arrive.',
      technique:'Use: headline fact → unchanged fact → two actions. Do not copy every sentence from the audio.',
      fr:'Structure : changement principal → information inchangée → deux actions à faire.',
      phrases:['Please note that…','The start time remains…','Please bring…','Please arrive…'],
      model:'Hi everyone, please note that tomorrow’s 9:00 training session will take place in Room B214 instead of Room A102. The start time remains 9:00. Please bring your laptop and arrive by 8:50 so that the session can begin on time. Thank you.'
    },
    {
      id:'p2q3', part:2, type:'multi', skill:'Reading', seconds:95,
      instruction:'Read the note and select ALL statements that accurately reformulate it.',
      prompt:'NOTICE — The visitor entrance on King Street will be closed from 8:00 to 12:00 on Monday for maintenance. Visitors arriving during that period must use the South Gate on Palmer Road and show photo identification. Staff entrances are not affected.',
      question:'Which statements are correct?',
      options:['All entrances are closed on Monday morning.','Visitors must use the South Gate between 8:00 and 12:00.','Visitors need photo identification.','Staff can continue using their normal entrances.'], answer:[1,2,3],
      technique:'Reformulate meaning, not vocabulary. Watch absolute words like “all” when the document makes an exception.',
      fr:'Reformulez le sens. Méfiez-vous des mots absolus comme « all » lorsqu’il existe une exception.',
      model:'Visitor access changes on Monday morning, but staff access does not.'
    },
    {
      id:'p3q1', part:3, type:'single', skill:'Reading', seconds:90,
      instruction:'Choose the clearest way to transmit the instruction.',
      prompt:'Procedure: If a customer reports a damaged item, first record the order number and take a photo of the damage. Do not promise a refund. Send the information to the claims team, who will decide whether to replace, repair or refund the item.',
      question:'Which message transmits the procedure most accurately?',
      options:['Promise a refund, then ask for a photo if possible.','Record the order number and photo, then send them to the claims team for a decision.','Ask the customer to contact the claims team directly before you record anything.','Choose whether to replace or repair the item yourself.'], answer:1,
      technique:'Procedure tasks are about sequence and responsibility. Identify who does what, and what must NOT be done.',
      fr:'Pour une procédure, repérez l’ordre des étapes, la personne responsable et ce qu’il ne faut pas faire.',
      model:'First record the order number and photograph the damage. Then send the information to the claims team. Do not promise a refund before their decision.'
    },
    {
      id:'p3q2', part:3, type:'oral', skill:'Speaking', seconds:120,
      instruction:'Record a clear handover to a colleague. Aim for 45–65 seconds.',
      prompt:'A client called while your colleague was away. The client needs the revised contract today before 4 p.m. They noticed that the billing address is still the old one. The new address is 18 Harbour Lane, Bristol. They asked for confirmation by email once the document has been corrected.',
      question:'Transmit the message to your colleague clearly and in the right order.',
      technique:'Handover formula: WHO → NEED → CHANGE → DEADLINE → NEXT ACTION. This prevents you from forgetting a key fact.',
      fr:'Formule de transmission : QUI → BESOIN → CHANGEMENT → ÉCHÉANCE → PROCHAINE ACTION.',
      phrases:['I was asked to let you know that…','The key change is…','They need it by…','Please confirm once…'],
      model:'I was asked to let you know that the client needs the revised contract today before 4 p.m. The key change is the billing address, which should be 18 Harbour Lane, Bristol. Once you have corrected the document, please send it and confirm by email that the update has been made.'
    },
    {
      id:'p3q3', part:3, type:'multi', skill:'Listening', seconds:100,
      instruction:'Listen and select ALL instructions that should be passed on.',
      audio:'Before you send the presentation to the client, please replace the sales figures on slide twelve with the August numbers. Keep the market forecast on slide thirteen as it is. Then export the final version as a PDF and send it to me for one last check. Please do not send anything to the client until I approve it.',
      question:'What must your colleague do?',
      options:['Replace the figures on slide 12 with the August numbers.','Change the market forecast on slide 13.','Export the final presentation as a PDF.','Wait for approval before sending it to the client.'], answer:[0,2,3],
      technique:'For instructions, listen for verbs: replace, keep, export, send, do not send. These verbs reveal the required actions.',
      fr:'Pour les consignes, écoutez les verbes d’action : replace, keep, export, send, do not send.',
      model:'Update slide 12 with the August sales figures, leave slide 13 unchanged, export the presentation as a PDF and wait for approval before sending it to the client.'
    },
    {
      id:'p4q1', part:4, type:'single', skill:'Reading', seconds:110,
      instruction:'Analyse the two options and choose the strongest recommendation.',
      prompt:'OPTION A — Online workshop: €320, available this Friday, maximum 20 participants, recording included. OPTION B — On-site workshop: €540, available next Tuesday, maximum 12 participants, no recording, trainer travels to your office. Your team has 16 people and wants to start before the end of this week.',
      question:'Which recommendation best uses the evidence?',
      options:['Choose B because face-to-face training is always better.','Choose A because it can include all 16 people and starts this week.','Choose B because it is more expensive and therefore more complete.','Choose A only because it includes a recording.'], answer:1,
      technique:'Recommendation = criteria + evidence. Identify the two constraints first: 16 people + before the end of this week.',
      fr:'Pour recommander, trouvez d’abord les critères : 16 personnes + commencer avant la fin de la semaine.',
      model:'I would recommend Option A because it meets both key constraints: all 16 people can attend and it is available this Friday.'
    },
    {
      id:'p4q2', part:4, type:'written', skill:'Writing', seconds:180,
      instruction:'Write a structured recommendation of about 70–100 words.',
      prompt:'Your team needs a temporary workspace for three days. Site A costs €450, is 10 minutes from the station, includes Wi-Fi and meeting rooms, but closes at 18:00. Site B costs €390, is 25 minutes from the station, includes Wi-Fi, has no private meeting room, and stays open until 21:00. Your team has two confidential client calls at 16:00 and usually finishes by 17:30.',
      question:'Recommend one site and justify your choice using the team’s real needs.',
      technique:'Use: recommendation → 2 reasons → acknowledge one disadvantage → conclusion. Do not list every fact.',
      fr:'Structure : recommandation → 2 raisons → reconnaître un inconvénient → conclusion.',
      phrases:['I would recommend…','The main reason is…','Another advantage is…','Although…','Overall…'],
      model:'I would recommend Site A. The main reason is that the team has two confidential client calls, so the private meeting rooms are important. It is also much closer to the station, which will make the three-day visit easier. Although Site A closes earlier and costs €60 more, the team normally finishes by 17:30. Overall, Site A better matches the team’s practical and confidentiality needs.'
    },
    {
      id:'p4q3', part:4, type:'oral', skill:'Speaking', seconds:135,
      instruction:'Record your decision and explain it naturally. Aim for 50–70 seconds.',
      prompt:'Your manager asks whether to postpone a product demonstration. The demonstration is tomorrow at 11:00. The main presenter is ill, but a colleague knows the product well and can present. Eight clients have already confirmed attendance. Rescheduling would delay the demonstration by two weeks.',
      question:'Give your recommendation, justify it and mention one risk or condition.',
      technique:'Decision formula: POSITION → REASON 1 → REASON 2 → CONDITION/RISK → ACTION. This sounds structured even with simple English.',
      fr:'Formule de décision : POSITION → RAISON 1 → RAISON 2 → CONDITION/RISQUE → ACTION.',
      phrases:['I would suggest…','The main reason is…','In addition…','The main risk is…','To reduce that risk…'],
      model:'I would suggest keeping the demonstration tomorrow. Eight clients have already confirmed, and postponing would create a two-week delay. In addition, a colleague knows the product well enough to present. The main risk is that they may not know every detail the main presenter planned to cover, so I would ask them to review the presentation today and prepare answers to the most likely client questions.'
    }
  ];

  const state = {
    mode:'practice', current:0, answers:{}, objective:{}, recordings:{}, started:false,
    elapsed:0, tabChanges:0, questionLeft:0, questionExpired:false
  };
  let overallTimer=null, questionTimer=null, mediaRecorder=null, mediaStream=null, audioChunks=[], recordInterval=null, recordSeconds=0;

  function save(){
    try{
      localStorage.setItem(STORAGE, JSON.stringify({mode:state.mode, current:state.current, answers:state.answers, objective:state.objective, elapsed:state.elapsed, tabChanges:state.tabChanges, feedback:{usefulness:$('#usefulnessRange')?.value,confidence:$('#confidenceRange')?.value,method:$('#methodSelect')?.value,next:$('#learnerNext')?.value,trainer:$('#trainerComments')?.value}}));
    }catch(e){}
  }
  function load(){
    try{
      const x=JSON.parse(localStorage.getItem(STORAGE)||'null'); if(!x)return;
      state.mode=x.mode||'practice';state.current=Math.min(x.current||0,tasks.length-1);state.answers=x.answers||{};state.objective=x.objective||{};state.elapsed=x.elapsed||0;state.tabChanges=x.tabChanges||0;
    }catch(e){}
  }
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
  function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
  function formatTime(s){s=Math.max(0,s|0);return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
  function words(s=''){return (s.trim().match(/\b[\w’'-]+\b/g)||[]).length}
  function isOpen(t){return t.type==='oral'||t.type==='written'}
  function isObjective(t){return t.type==='single'||t.type==='multi'}

  function setMode(mode){
    state.mode=mode;document.body.classList.toggle('exam-mode',mode==='exam');
    $('#practiceModeBtn').classList.toggle('active',mode==='practice');$('#examModeBtn').classList.toggle('active',mode==='exam');
    $('#modeBadge').textContent=mode.toUpperCase();
    $('#modeDescription').textContent=mode==='practice'?'Practice mode shows techniques, hints, instant feedback and models.':'Exam mode hides coaching, corrections, transcripts and models until the final report.';
    if($('#startExamBtn')) $('#startExamBtn').textContent=mode==='practice'?'Start your guided mock':'Start exam simulation';
    const frenchOn=$('#frenchToggle')?.checked;
    if($('#helpBtn')) $('#helpBtn').classList.toggle('hidden', !frenchOn || mode==='exam');
    save();
  }

  function renderVocab(){
    const cats=['All',...new Set(vocab.map(v=>v.cat))];
    if(!$('#vocabCategory').options.length) $('#vocabCategory').innerHTML=cats.map(c=>`<option>${escapeHtml(c)}</option>`).join('');
    const cat=$('#vocabCategory').value||'All', level=$('#vocabLevel').value||'all';
    const rows=vocab.filter(v=>(cat==='All'||v.cat===cat)&&(level==='all'||v.level===level));
    $('#vocabGrid').innerHTML=rows.map(v=>`<article class="vocab-card"><div class="vocab-top"><div><span class="level-chip">${escapeHtml(v.cat)} · ${escapeHtml(v.level)}</span><strong>${escapeHtml(v.en)}</strong><div class="translation">${escapeHtml(v.fr)}</div></div><button class="speak-vocab" data-speak="${escapeHtml(v.en)}" type="button">▶ audio</button></div><p>${escapeHtml(v.ex)}</p></article>`).join('');
    bindSpeakButtons();
  }

  function voiceFor(lang){
    const vs=speechSynthesis.getVoices();const exact=vs.find(v=>v.lang===lang); if(exact)return exact;
    return vs.find(v=>v.lang&&v.lang.startsWith(lang.slice(0,2)))||vs.find(v=>v.lang&&v.lang.startsWith('en'));
  }
  function speak(text){
    if(!('speechSynthesis' in window)){toast('Speech synthesis is not available in this browser.');return}
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$('#accentSelect').value;u.rate=parseFloat($('#speedSelect').value)||.94;const v=voiceFor(u.lang);if(v)u.voice=v;speechSynthesis.speak(u);
  }
  function bindSpeakButtons(){ $$('.audio-chip,[data-speak],.speak-vocab').forEach(b=>{b.onclick=()=>speak(b.dataset.speak||'')}) }

  async function checkCamera(){
    try{mediaStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});$('#cameraPreview').srcObject=mediaStream;$('.camera-preview-wrap').classList.add('live');$('#cameraState').textContent='Working';toast('Camera is working.')}catch(e){$('#cameraState').textContent='Permission needed';toast('Camera permission was not granted.')}
  }
  async function checkMic(){
    try{const s=await navigator.mediaDevices.getUserMedia({audio:true});$('#micState').textContent='Working';s.getTracks().forEach(t=>t.stop());toast('Microphone is working.')}catch(e){$('#micState').textContent='Permission needed';toast('Microphone permission was not granted.')}
  }

  function stopTimers(){clearInterval(overallTimer);clearInterval(questionTimer);overallTimer=null;questionTimer=null}
  function startOverall(){clearInterval(overallTimer);overallTimer=setInterval(()=>{state.elapsed++;$('#overallTimer').textContent=formatTime(state.elapsed);save()},1000)}
  function startQuestionTimer(seconds){
    clearInterval(questionTimer);state.questionLeft=seconds;state.questionExpired=false;$('#questionTimer').textContent=formatTime(seconds);$('#questionTimer').classList.remove('warning');
    questionTimer=setInterval(()=>{state.questionLeft--;$('#questionTimer').textContent=formatTime(state.questionLeft);if(state.questionLeft<=15)$('#questionTimer').classList.add('warning');if(state.questionLeft<=0){clearInterval(questionTimer);state.questionExpired=true;toast('Time is up. Move to the next task.');if(state.mode==='exam')setTimeout(()=>advance(false),700)}},1000)
  }

  function currentTask(){return tasks[state.current]}
  function techniqueHtml(t){return `<ul class="coach-list"><li><strong>Spot:</strong> ${escapeHtml(t.technique.split('.')[0]||t.technique)}</li><li><strong>Target:</strong> Ignore information that does not change your action.</li><li><strong>Organise:</strong> Give the answer first, then the evidence or next step.</li><li><strong>Produce:</strong> Prefer short complete sentences to long risky ones.</li></ul>`}
  function showModal(kind){
    const t=currentTask();let title='',body='',kicker='COACHING';
    if(kind==='hint'){title='How to attack this task';body=techniqueHtml(t)+(document.body.classList.contains('show-fr')?`<p class="fr-help">${escapeHtml(t.fr||'')}</p>`:'')}
    else {kicker='MODEL';title='One strong way to answer';body=`<div class="model-box">${escapeHtml(t.model||'')}</div><p style="margin-top:12px;color:#6f7284;font-size:12px">Use the structure—not the exact words.</p>`}
    $('#modalKicker').textContent=kicker;$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#modal').classList.remove('hidden');
  }

  function renderQuestion(){
    const t=currentTask(); const pct=Math.round((state.current+1)/tasks.length*100);
    $('#partLabel').textContent=`PART ${t.part}`;$('#partTitle').textContent=partMeta[t.part].title;$('#questionCounter').textContent=`Question ${state.current+1} of ${tasks.length}`;$('#progressPercent').textContent=`${pct}%`;$('#progressBar').style.width=`${pct}%`;$('#answeredCount').textContent=`${Object.keys(state.answers).length} / ${tasks.length}`;
    $$('.part-nav').forEach(b=>b.classList.toggle('active',Number(b.dataset.part)===t.part));
    $('#sessionStatus').textContent=`Part ${t.part} · ${t.skill}`;
    let html=`<div class="task-meta"><span class="task-type">${t.type==='single'?'QCU':t.type==='multi'?'QCM':t.type==='oral'?'OPEN · ORAL':'OPEN · WRITTEN'}</span><span class="task-skill">${escapeHtml(t.skill)}</span></div>`;
    html+=`<div class="coach-strip"><strong>Technique:</strong> ${escapeHtml(t.technique)}</div><p class="instruction">${escapeHtml(t.instruction)}</p>`;
    if(t.audio){html+=`<div class="listening-panel"><button class="play-task-audio" type="button">▶ Play audio</button><span class="audio-plays" id="audioPlays">${state.mode==='exam'?'0 / 2 plays':'Replay while training'}</span></div><button class="ghost small transcript-toggle" type="button">Show transcript</button><div class="transcript" id="taskTranscript">${escapeHtml(t.audio)}</div>`}
    if(t.prompt) html+=`<div class="${t.skill==='Reading'||t.type==='written'?'reading-passage':'document-panel'}">${escapeHtml(t.prompt)}</div>`;
    html+=`<h3>${escapeHtml(t.question)}</h3>`;
    if(t.type==='single'||t.type==='multi'){
      const saved=state.answers[t.id]?.selected||[];
      html+=`<div class="options">${t.options.map((o,i)=>`<button class="option ${saved.includes(i)?'selected':''}" data-index="${i}" type="button"><span class="option-key">${String.fromCharCode(65+i)}</span><span>${escapeHtml(o)}</span></button>`).join('')}</div><div id="answerFeedback"></div>`;
    } else if(t.type==='written'){
      html+=`${t.phrases?`<div class="phrase-shelf">${t.phrases.map(p=>`<button class="phrase-token" data-phrase="${escapeHtml(p)}" type="button">${escapeHtml(p)}</button>`).join('')}</div>`:''}<div class="open-response"><textarea id="openText" placeholder="Write your response here…">${escapeHtml(state.answers[t.id]?.text||'')}</textarea><div class="response-tools"><span id="wordCount">${words(state.answers[t.id]?.text||'')} words</span><span>Autosaved locally</span></div></div>`;
    } else {
      html+=`${t.phrases?`<div class="phrase-shelf">${t.phrases.map(p=>`<button class="phrase-token" data-phrase="${escapeHtml(p)}" type="button">${escapeHtml(p)}</button>`).join('')}</div>`:''}<div class="record-panel"><h4>Record your answer</h4><p>Speak naturally. If you make a small mistake, continue and repair it instead of restarting.</p><div class="record-actions"><button id="recordBtn" type="button">● Start recording</button><button id="stopRecordBtn" type="button" disabled>■ Stop</button><span class="record-time" id="recordTime">00:00</span></div><audio id="recordedAudio" controls class="${state.recordings[t.id]?'':'hidden'}"></audio></div><div class="open-response" style="margin-top:14px"><textarea id="openText" placeholder="Optional trainer notes / key words…">${escapeHtml(state.answers[t.id]?.text||'')}</textarea><div class="response-tools"><span>Notes do not replace the oral answer</span><span>Autosaved locally</span></div></div>`;
    }
    $('#questionCard').innerHTML=html;
    $('#nextBtn').textContent='Validate & continue';
    bindQuestionEvents(t);startQuestionTimer(t.seconds);save();
  }

  function bindQuestionEvents(t){
    let plays=0;
    const play=$('.play-task-audio');if(play)play.onclick=()=>{if(state.mode==='exam'&&plays>=2)return;plays++;speak(t.audio);if(state.mode==='exam'){ $('#audioPlays').textContent=`${plays} / 2 plays`; if(plays>=2)play.disabled=true }};
    const tr=$('.transcript-toggle');if(tr)tr.onclick=()=>{$('#taskTranscript').classList.toggle('show');tr.textContent=$('#taskTranscript').classList.contains('show')?'Hide transcript':'Show transcript'};
    $$('.option').forEach(btn=>btn.onclick=()=>{
      const i=Number(btn.dataset.index); if(t.type==='single'){$$('.option').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected')}else btn.classList.toggle('selected');
    });
    const area=$('#openText');if(area)area.oninput=()=>{state.answers[t.id]={...(state.answers[t.id]||{}),text:area.value};const wc=$('#wordCount');if(wc)wc.textContent=`${words(area.value)} words`;save()};
    $$('.phrase-token').forEach(b=>b.onclick=()=>{if(area){const join=area.value.trim()?' ':' ';area.value+=join+b.dataset.phrase;area.dispatchEvent(new Event('input'));area.focus()}else speak(b.dataset.phrase)});
    if(t.type==='oral'){ $('#recordBtn').onclick=startRecording;$('#stopRecordBtn').onclick=stopRecording }
  }

  function selectionFor(t){return $$('.option.selected').map(b=>Number(b.dataset.index)).sort((a,b)=>a-b)}
  function sameArray(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i])}
  function validateCurrent(){
    const t=currentTask();
    if(isObjective(t)){
      const selected=selectionFor(t);if(!selected.length){toast('Choose an answer first—or use “I’m stuck → continue”.');return false}
      const correct=t.type==='single'?[t.answer]:[...t.answer].sort((a,b)=>a-b);const ok=sameArray(selected,correct);state.answers[t.id]={selected};state.objective[t.id]=ok;
      if(state.mode==='practice'){
        state.answers[t.id].validated=true;
        $$('.option').forEach(b=>{const i=Number(b.dataset.index);b.classList.toggle('correct',correct.includes(i));b.classList.toggle('incorrect',selected.includes(i)&&!correct.includes(i))});
        $('#answerFeedback').innerHTML=`<div class="answer-feedback ${ok?'good':'try'}"><strong>${ok?'Correct.':'Not quite.'}</strong> ${escapeHtml(t.technique)}</div>`;
        save();return true;
      }
    } else {
      const text=$('#openText')?.value||'';state.answers[t.id]={...(state.answers[t.id]||{}),text};
      if(t.type==='written'&&!text.trim()){toast('Write an answer first—or use “I’m stuck → continue”.');return false}
      if(t.type==='oral'&&!state.recordings[t.id]&&!text.trim()){toast('Record your answer or add trainer notes—or continue if you are stuck.');return false}
    }
    save();return true;
  }

  function advance(validate=true){
    const t=currentTask();
    if(validate && state.mode==='practice' && isObjective(t) && !state.answers[t.id]?.validated){
      if(!validateCurrent())return;
      $('#nextBtn').textContent='Continue';
      return;
    }
    if(validate && !(state.mode==='practice' && isObjective(t) && state.answers[t.id]?.validated) && !validateCurrent())return;
    stopRecording(true);clearInterval(questionTimer);
    if(state.current<tasks.length-1){state.current++;renderQuestion();save()}else finish();
  }

  async function startRecording(){
    try{
      if(mediaRecorder&&mediaRecorder.state==='recording')return;
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});audioChunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)audioChunks.push(e.data)};mediaRecorder.onstop=()=>{const blob=new Blob(audioChunks,{type:mediaRecorder.mimeType||'audio/webm'});const url=URL.createObjectURL(blob);const t=currentTask();state.recordings[t.id]={url};const a=$('#recordedAudio');if(a){a.src=url;a.classList.remove('hidden')}stream.getTracks().forEach(x=>x.stop());save()};mediaRecorder.start();recordSeconds=0;$('#recordBtn').classList.add('recording');$('#recordBtn').textContent='Recording…';$('#recordBtn').disabled=true;$('#stopRecordBtn').disabled=false;clearInterval(recordInterval);recordInterval=setInterval(()=>{$('#recordTime').textContent=formatTime(++recordSeconds)},1000);
    }catch(e){toast('Microphone permission is needed to record.')}
  }
  function stopRecording(silent=false){
    clearInterval(recordInterval);recordInterval=null;
    if(mediaRecorder&&mediaRecorder.state==='recording')mediaRecorder.stop();
    const rb=$('#recordBtn'),sb=$('#stopRecordBtn');if(rb){rb.classList.remove('recording');rb.textContent='● Start recording';rb.disabled=false}if(sb)sb.disabled=true;if(!silent&&mediaRecorder)toast('Recording saved locally for this session.');
  }

  function start(){
    state.started=true;state.current=0;state.answers={};state.objective={};state.elapsed=0;state.tabChanges=0;state.recordings={};
    $('#welcomeScreen').classList.add('hidden');$('#resultsScreen').classList.add('hidden');$('#examScreen').classList.remove('hidden');$('#overallTimer').textContent='00:00';$('#tabChanges').textContent='0';startOverall();renderQuestion();window.scrollTo({top:0,behavior:'smooth'});save();
  }

  function finish(){
    stopTimers();stopRecording(true);state.started=false;$('#examScreen').classList.add('hidden');$('#resultsScreen').classList.remove('hidden');$('#sessionStatus').textContent='Mock complete';buildResults();window.scrollTo({top:0,behavior:'smooth'});save();
  }

  function partScore(part){
    const ids=tasks.filter(t=>t.part===part&&isObjective(t)).map(t=>t.id);if(!ids.length)return 0;const done=ids.filter(id=>state.objective[id]===true).length;return Math.round(done/ids.length*100)
  }
  function buildResults(){
    const obj=tasks.filter(isObjective);const correct=obj.filter(t=>state.objective[t.id]===true).length;const pct=obj.length?Math.round(correct/obj.length*100):0;
    $('#objectiveScore').textContent=`${pct}%`;$('#objectiveDetail').textContent=`${correct} / ${obj.length}`;for(let p=1;p<=4;p++)$(`#p${p}Score`).textContent=`${partScore(p)}%`;$('#tabChangesResult').textContent=state.tabChanges;
    const badge=pct>=80?'Ready to repeat in Exam mode':pct>=60?'Building reliable habits':'Keep the support on';$('#readinessBadge').textContent=badge;
    $('#resultMessage').textContent=pct>=80?'Your objective-task accuracy is strong. The next proof is to repeat the mock in Exam mode and keep the same structure under pressure.':pct>=60?'You are finding the right information more often. Review the weakest part, then repeat without the hints.':'Use the report as a map—not a verdict. Repeat the techniques for the weakest part before doing another timed run.';
    $('#readinessAdvice').innerHTML=[
      ['If you freeze','Use one buying-time phrase, then answer the main question first.'],
      ['If listening feels fast','Listen for action words, dates, changes, conditions and next steps—not every word.'],
      ['If speaking feels messy','Use Answer → Detail → Action. Three clear sentences beat one long sentence.']
    ].map(x=>`<article class="advice-card"><strong>${x[0]}</strong><p>${x[1]}</p></article>`).join('');
    buildRubrics();buildReview();restoreFeedback();
  }

  function buildRubrics(){
    const opens=tasks.filter(isOpen);$('#trainerRubrics').innerHTML=opens.map((t,i)=>`<article class="rubric-card" data-rubric="${t.id}"><div class="rubric-head"><strong>${i+1}. Part ${t.part} · ${t.skill}</strong><span>${t.type.toUpperCase()}</span></div><div class="rubric-grid"><label>Task completion<select data-r="task"><option value="">—</option><option>1 · limited</option><option>2 · partial</option><option>3 · clear</option><option>4 · strong</option></select></label><label>Clarity / organisation<select data-r="clarity"><option value="">—</option><option>1 · limited</option><option>2 · developing</option><option>3 · clear</option><option>4 · strong</option></select></label><label>Language control<select data-r="language"><option value="">—</option><option>1 · limited</option><option>2 · developing</option><option>3 · effective</option><option>4 · flexible</option></select></label><label>${t.type==='oral'?'Fluency / pronunciation':'Professional writing'}<select data-r="delivery"><option value="">—</option><option>1 · limited</option><option>2 · developing</option><option>3 · effective</option><option>4 · strong</option></select></label></div><textarea data-r="note" placeholder="Trainer note for this response…"></textarea></article>`).join('');
    $$('[data-r]').forEach(x=>x.onchange=x.oninput=save);
  }
  function buildReview(){
    $('#reviewList').innerHTML=tasks.map((t,i)=>{
      const a=state.answers[t.id]||{};let response='No response saved.';
      if(isObjective(t)&&a.selected){response=a.selected.map(n=>`${String.fromCharCode(65+n)}. ${t.options[n]}`).join('\n')}
      else if(a.text)response=a.text;
      const status=isObjective(t)?(state.objective[t.id]===true?'✓ Correct':state.objective[t.id]===false?'Review':'Unanswered'):'Trainer review';
      return `<details class="review-item"><summary>${i+1}. Part ${t.part} · ${t.skill} · ${status}</summary><div class="review-body"><p class="review-technique"><strong>Technique:</strong> ${escapeHtml(t.technique)}</p><p><strong>Your response:</strong></p><div class="review-answer">${escapeHtml(response)}</div><p style="margin-top:12px"><strong>Model structure:</strong></p><div class="model-box">${escapeHtml(t.model)}</div></div></details>`
    }).join('')
  }

  function reportText(){
    const obj=tasks.filter(isObjective), correct=obj.filter(t=>state.objective[t.id]===true).length,pct=Math.round((correct/obj.length)*100)||0;
    const lines=['LILATE IA STRATEGY MOCK 2 — TRAINING REPORT','',`Mode: ${state.mode.toUpperCase()}`,`Elapsed: ${formatTime(state.elapsed)}`,`Objective score: ${correct}/${obj.length} (${pct}%)`,`Tab changes: ${state.tabChanges}`,''];
    tasks.forEach((t,i)=>{const a=state.answers[t.id]||{};lines.push(`${i+1}. Part ${t.part} — ${t.skill} — ${t.type.toUpperCase()}`);lines.push(`Technique: ${t.technique}`);if(isObjective(t)){lines.push(`Result: ${state.objective[t.id]===true?'Correct':state.objective[t.id]===false?'Incorrect':'Unanswered'}`);if(a.selected)lines.push('Response: '+a.selected.map(n=>t.options[n]).join(' | '))}else lines.push('Response/notes: '+(a.text||'Not entered'));lines.push('Model: '+t.model,'')});
    lines.push('LEARNER FEEDBACK',`Usefulness: ${$('#usefulnessRange')?.value||''}/5`,`Confidence: ${$('#confidenceRange')?.value||''}/5`,`Most useful method: ${$('#methodSelect')?.value||''}`,`Practise again: ${$('#learnerNext')?.value||'Not entered'}`,'',`Trainer comments: ${$('#trainerComments')?.value||'Not entered'}`);return lines.join('\n')
  }
  function download(name,content,type='text/plain'){const blob=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},100)}
  function htmlReport(){const txt=escapeHtml(reportText()).replace(/\n/g,'<br>');return `<!doctype html><html><head><meta charset="utf-8"><title>LILATE Strategy Mock Report</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;color:#242536;line-height:1.5}h1{color:#171743;border-bottom:4px solid #f07f22;padding-bottom:12px}.report{background:#f7f7fa;padding:22px;border-radius:10px}</style></head><body><h1>LILATE IA Strategy Mock 2</h1><div class="report">${txt}</div></body></html>`}

  function restoreFeedback(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||'null');const f=x?.feedback||{};if(f.usefulness)$('#usefulnessRange').value=f.usefulness;if(f.confidence)$('#confidenceRange').value=f.confidence;if(f.method)$('#methodSelect').value=f.method;if(f.next)$('#learnerNext').value=f.next;if(f.trainer)$('#trainerComments').value=f.trainer;updateRanges()}catch(e){}}
  function updateRanges(){if($('#usefulnessValue'))$('#usefulnessValue').textContent=`${$('#usefulnessRange').value} / 5`;if($('#confidenceValue'))$('#confidenceValue').textContent=`${$('#confidenceRange').value} / 5`}

  // Global events
  $('#practiceModeBtn').onclick=()=>setMode('practice');$('#examModeBtn').onclick=()=>setMode('exam');
  $('#frenchToggle').onchange=e=>{document.body.classList.toggle('show-fr',e.target.checked);if($('#helpBtn'))$('#helpBtn').classList.toggle('hidden',!e.target.checked||state.mode==='exam')};
  $('#checkCameraBtn').onclick=checkCamera;$('#checkMicBtn').onclick=checkMic;$('#stopAudioBtn').onclick=()=>speechSynthesis.cancel();
  $('#vocabCategory').onchange=renderVocab;$('#vocabLevel').onchange=renderVocab;
  $('#startExamBtn').onclick=start;$('#nextBtn').onclick=()=>advance(true);$('#dontKnowBtn').onclick=()=>advance(false);$('#hintBtn').onclick=()=>showModal('hint');$('#modelBtn').onclick=()=>showModal('model');
  $('#helpBtn').onclick=()=>showModal('hint');$('#closeModalBtn').onclick=()=>$('#modal').classList.add('hidden');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.add('hidden')};
  $('#restartBtn').onclick=()=>{state.current=0;state.elapsed=0;state.answers={};state.objective={};$('#resultsScreen').classList.add('hidden');$('#welcomeScreen').classList.remove('hidden');$('#sessionStatus').textContent='Ready to train';save();window.scrollTo({top:0,behavior:'smooth'})};
  $('#resetAllBtn').onclick=()=>{if(confirm('Reset the full mock, saved answers and feedback?')){localStorage.removeItem(STORAGE);location.reload()}};
  $('#downloadTxtBtn').onclick=()=>download('lilate-strategy-mock-2-results.txt',reportText());$('#downloadHtmlBtn').onclick=()=>download('lilate-strategy-mock-2-report.html',htmlReport(),'text/html');$('#printBtn').onclick=()=>window.print();
  $('#usefulnessRange').oninput=()=>{updateRanges();save()};$('#confidenceRange').oninput=()=>{updateRanges();save()};$('#methodSelect').onchange=save;$('#learnerNext').oninput=save;$('#trainerComments').oninput=save;
  $$('.part-nav').forEach(b=>b.onclick=()=>toast(state.started?'The mock follows the official sequence. Continue with the current task.':'Start the mock to activate the four-part sequence.'));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.started){state.tabChanges++;$('#tabChanges').textContent=state.tabChanges;save()}});
  window.addEventListener('beforeunload',()=>{if(mediaStream)mediaStream.getTracks().forEach(t=>t.stop());save()});
  if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=()=>{};

  load();setMode(state.mode);renderVocab();bindSpeakButtons();updateRanges();$('#tabChanges').textContent=state.tabChanges;$('#answeredCount').textContent=`${Object.keys(state.answers).length} / ${tasks.length}`;
})();
