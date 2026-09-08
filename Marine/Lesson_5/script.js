(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const toast = msg => { const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); };
  const esc = str => String(str ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const fmt = sec => `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(Math.max(0,sec%60)).padStart(2,'0')}`;

  const tasks = [
    {
      part:1,type:'single',time:80,kicker:'QCU · PROFESSIONAL INTERACTION',title:'Identify the visitor’s need',
      instruction:'Read the situation and choose the most appropriate response.',
      context:'A customer arrives at your branch and says: “Hello. I’m moving to Australia in three months and I need to understand what will happen to my bank account while I’m abroad.”',
      options:[
        'Of course. Let me first check what services you need while you are abroad, then I can explain the options available to you.',
        'You should close your account before you leave because foreign countries are complicated.',
        'Australia is very far away. Have you already bought your plane ticket?',
        'Please come back another day because international questions take too long.'
      ],answer:[0],
      fr:'Un client explique qu’il part vivre en Australie et veut savoir comment gérer son compte bancaire. Choisissez la réponse professionnelle qui identifie d’abord son besoin et propose de l’aider.',
      models:{b1:'Of course. I can help you. First, I need to understand which services you will need while you are in Australia.',b2:'Certainly. Let me clarify how you intend to use the account while you are abroad so I can recommend the most suitable options.'}
    },
    {
      part:1,type:'multi',time:95,kicker:'QCM · LISTENING',title:'Understand a customer request',
      instruction:'Listen to the customer. Select the TWO things she needs.',
      audio:'Hello. I am travelling to Sydney next month for work. I would like to make sure my bank card will work there, and I also need to know whether there are extra fees when I withdraw cash. I do not need travel insurance because my employer already provides it.',
      options:['Check that her bank card can be used in Australia.','Explain cash-withdrawal fees abroad.','Sell her travel insurance.','Cancel her current bank card.'],answer:[0,1],
      fr:'Écoutez la cliente. Sélectionnez les DEUX besoins qu’elle exprime.',
      models:{b1:'She wants to know if her card will work in Australia and if she will pay fees to withdraw money.',b2:'She needs confirmation that her card is enabled for use in Australia and information about any fees associated with overseas cash withdrawals.'}
    },
    {
      part:1,type:'oral',time:130,kicker:'OPEN RESPONSE · SPEAKING',title:'Welcome, clarify and propose help',
      instruction:'Record a 45–75 second response. Welcome the customer, ask one useful question and explain what you can do next.',
      context:'You work in customer services. A client says: “I’m going overseas for several months and I’m worried about accessing my accounts.”',
      fr:'Répondez comme dans une situation professionnelle : accueillez le client, posez une question utile et expliquez la prochaine étape.',
      models:{b1:'Good morning. Of course, I can help you. Which country are you going to and how long will you stay there? We can check your card, online banking access and any fees before you leave.',b2:'Good morning. I’d be happy to help. Could you tell me where you’ll be staying and how you expect to use your account while you’re abroad? Once I know that, I can check card access, online security and the charges that may apply.'}
    },
    {
      part:2,type:'single',time:80,kicker:'QCU · LISTENING',title:'Collect a precise detail',
      instruction:'Listen to the voicemail and choose the correct appointment time.',
      audio:'Hello, this is Daniel Price. I am calling about my insurance appointment tomorrow. I originally booked it for half past ten, but I cannot come then. Could we move it to quarter past two in the afternoon? Please call me back if that is not possible.',
      options:['10:30','12:15','14:15','14:30'],answer:[2],
      fr:'Écoutez le message et identifiez la nouvelle heure demandée.',
      models:{b1:'The customer wants to move the appointment to 2:15 p.m.',b2:'He is asking to reschedule the appointment from 10:30 a.m. to 2:15 p.m.'}
    },
    {
      part:2,type:'multi',time:95,kicker:'QCM · DOCUMENT',title:'Extract information from a client file',
      instruction:'Read the file and select ALL statements that are correct.',
      document:{headers:['Item','Information'],rows:[['Client','Rebecca Hall'],['Destination','Melbourne, Australia'],['Departure','18 October'],['Return','12 February'],['Requested service','International card + travel notification'],['Contact preference','Email']]},
      options:['Rebecca is travelling to Melbourne.','She leaves on 18 October.','She prefers to be contacted by phone.','She requested an international card service.'],answer:[0,1,3],
      fr:'Lisez la fiche client et sélectionnez toutes les informations exactes.',
      models:{b1:'Rebecca is going to Melbourne on 18 October. She wants an international card service and prefers email.',b2:'The client is travelling to Melbourne from 18 October until 12 February. She has requested international card support and would like to receive information by email.'}
    },
    {
      part:2,type:'written',time:160,kicker:'OPEN RESPONSE · LISTENING → WRITING',title:'Write a clear internal note',
      instruction:'Listen to the message, then write a 45–70 word note for a colleague. Include the problem, two important details and the requested action.',
      audio:'Hi, this is Mark Ellis. I am currently in Brisbane. My debit card was declined twice this morning, although it worked yesterday. I still have access to online banking. Could someone check whether there is a security block on the card and send me an email today? I am eight hours ahead, so email is easier than a phone call.',
      fr:'Écoutez puis rédigez une note interne de 45 à 70 mots : problème, deux détails importants et action demandée.',
      models:{b1:'Mark Ellis is in Brisbane. His debit card was declined twice this morning, but his online banking still works. He thinks there may be a security block. Please check the card and email him today because of the time difference.',b2:'Mark Ellis, currently in Brisbane, reports that his debit card was declined twice this morning despite working yesterday. Online banking remains accessible. Please investigate a possible security block and contact him by email today, as the eight-hour time difference makes a phone call inconvenient.'}
    },
    {
      part:3,type:'single',time:85,kicker:'QCU · LISTENING',title:'Transmit the correct instruction',
      instruction:'Listen to your manager and choose the instruction you should pass to the client.',
      audio:'Please tell Ms Turner that we have temporarily blocked the old card for security reasons. A replacement card has been ordered, but it will take five to seven working days. In the meantime, she can continue using mobile payments if they are already activated on her phone.',
      options:['The old card is permanently cancelled and mobile payments are impossible.','The old card is temporarily blocked; a replacement will take five to seven working days.','The replacement card will arrive tomorrow morning.','She must visit the branch in person before anything can be done.'],answer:[1],
      fr:'Écoutez votre responsable et choisissez l’instruction exacte à transmettre au client.',
      models:{b1:'Your old card is temporarily blocked. A new card will arrive in five to seven working days. You can still use mobile payments if they are already activated.',b2:'For security reasons, your old card has been temporarily blocked. A replacement has been ordered and should arrive within five to seven working days. In the meantime, existing mobile-payment access can still be used.'}
    },
    {
      part:3,type:'multi',time:100,kicker:'QCM · THIRD-PARTY INFORMATION',title:'Relay the essential points',
      instruction:'Read your colleague’s note and select the THREE details that must be transmitted.',
      context:'COLLEAGUE NOTE: “Client: Nina Cole. Home-insurance claim after water damage. Photos received. Missing plumber’s invoice. Claim reference AU-4827. Ask client to upload invoice before Friday. No need to resend photos.”',
      options:['The photos have already been received.','The plumber’s invoice is still missing.','The claim reference is AU-4827.','The client must resend all the photos.','The invoice should be uploaded before Friday.'],answer:[1,2,4],
      fr:'Lisez la note du collègue et sélectionnez les TROIS informations essentielles à transmettre.',
      models:{b1:'We still need the plumber’s invoice. Your claim number is AU-4827, and please upload the invoice before Friday.',b2:'Your claim is registered under reference AU-4827. We have already received the photos, but the plumber’s invoice is still missing. Please upload it before Friday so the claim can continue.'}
    },
    {
      part:3,type:'oral',time:145,kicker:'OPEN RESPONSE · SPEAKING',title:'Explain a procedure clearly',
      instruction:'Record a 60–90 second message to the client. Explain the situation, the next steps and one alternative if the client cannot complete the procedure online.',
      context:'A client must confirm a new overseas phone number before online banking can be fully reactivated. The normal method is through the secure app. If the app does not work, the client can call the international support line with ID details ready.',
      fr:'Enregistrez un message clair : expliquez la situation, les étapes à suivre et une solution alternative si l’application ne fonctionne pas.',
      models:{b1:'To reactivate online banking, you first need to confirm your new overseas phone number in the secure app. Please open the app and follow the verification steps. If the app does not work, you can call the international support line. Please have your identification details ready.',b2:'To complete the reactivation of your online banking, your new overseas phone number must first be verified through the secure app. Please follow the identity-check steps shown there. If you are unable to complete the process in the app, contact the international support line and have your identification information available so the team can assist you.'}
    },
    {
      part:4,type:'single',time:90,kicker:'QCU · DOCUMENT ANALYSIS',title:'Use information to make a decision',
      instruction:'Read the comparison and choose the most appropriate option for the client.',
      document:{headers:['Option','Monthly fee','Overseas ATM fee','Travel notice','Support'],rows:[['Everyday Account','€4','€5 per withdrawal','Required','Business hours'],['International Account','€9','No bank ATM fee','Automatic','24/7 chat'],['Basic Account','€0','€7 per withdrawal','Required','Email only']]},
      context:'The client will live in Australia for six months, expects to withdraw cash regularly, and wants support outside European business hours.',
      options:['Everyday Account','International Account','Basic Account','All three options are equally suitable'],answer:[1],
      fr:'Le client vivra six mois en Australie, retirera souvent de l’argent et veut une assistance en dehors des horaires européens. Choisissez l’option la plus adaptée.',
      models:{b1:'The International Account is the best option because there is no bank ATM fee and support is available 24/7.',b2:'The International Account appears to be the most suitable choice because frequent overseas withdrawals would otherwise generate significant fees, and 24/7 support is particularly useful given the time difference with Australia.'}
    },
    {
      part:4,type:'multi',time:105,kicker:'QCM · DATA ANALYSIS',title:'Identify the strongest reasons',
      instruction:'Using the same comparison, select the TWO strongest arguments for the International Account.',
      document:{headers:['Option','Monthly fee','Overseas ATM fee','Travel notice','Support'],rows:[['Everyday Account','€4','€5 per withdrawal','Required','Business hours'],['International Account','€9','No bank ATM fee','Automatic','24/7 chat'],['Basic Account','€0','€7 per withdrawal','Required','Email only']]},
      options:['It has the lowest monthly fee.','It avoids the bank’s overseas ATM withdrawal fee.','It includes 24/7 chat support.','It requires the client to submit a travel notice manually.'],answer:[1,2],
      fr:'Sélectionnez les DEUX arguments les plus solides en faveur de l’International Account.',
      models:{b1:'The main advantages are no bank ATM fee and 24/7 support.',b2:'Its strongest advantages are the absence of the bank’s overseas ATM fee and round-the-clock support, both of which are directly relevant to a six-month stay in Australia.'}
    },
    {
      part:4,type:'written',time:170,kicker:'OPEN RESPONSE · WRITING',title:'Recommend and justify a solution',
      instruction:'Write an email of 80–120 words to the client. Recommend one option, justify it with at least two facts, mention one disadvantage and finish with a clear next step.',
      context:'Use the account comparison from the previous tasks. The client is preparing a six-month professional stay in Australia.',
      fr:'Rédigez un e-mail de 80 à 120 mots. Recommandez une option, justifiez avec au moins deux faits, mentionnez un inconvénient et terminez par une prochaine étape claire.',
      models:{b1:'Hello, Based on your six-month stay in Australia, I recommend the International Account. It costs more each month, but you will not pay our bank’s ATM withdrawal fee and you can use 24/7 chat support. This may be useful because of the time difference. The main disadvantage is the €9 monthly fee. If you agree, I can explain how to change your account before you leave. Kind regards,',b2:'Hello, Given that you will be based in Australia for six months and expect to withdraw cash regularly, I would recommend the International Account. Although its €9 monthly fee is higher, it removes the bank’s overseas ATM fee and includes 24/7 chat support, which should be valuable across time zones. The higher monthly charge is the main drawback, but frequent withdrawals could make the account more cost-effective overall. If you would like to proceed, I can send you the switching steps today. Kind regards,'}
    }
  ];

  const partMeta = {
    1:['Accueil et interaction','Identify · respond · welcome'],
    2:['Recueil et transcription','Collect · reformulate · write'],
    3:['Recueil et transmission','Relay · explain · clarify'],
    4:['Recueil et exploitation','Analyse · decide · argue']
  };

  let current=0, mode='exam', qRemaining=0, qTimerId=null, overallSec=0, overallTimerId=null, started=false, finished=false, tabChanges=0;
  const responses = tasks.map(()=>({selected:[],text:'',skipped:false,recording:null,recordingUrl:null,playCount:0}));
  const mediaStates = {};

  function setMode(newMode){
    mode=newMode;
    $('#examModeBtn').classList.toggle('active',mode==='exam');
    $('#practiceModeBtn').classList.toggle('active',mode==='practice');
    $('#modeBadge').textContent=mode.toUpperCase();
    $('#modeDescription').textContent=mode==='exam'?'Exam mode hides help, corrections and models until the end.':'Practice mode enables French help, immediate feedback and model answers.';
    $('#frenchToggle').disabled=mode==='exam';
    if(mode==='exam'){$('#frenchToggle').checked=false;document.body.classList.remove('show-fr');}
    $('#helpBtn').classList.toggle('hidden',mode!=='practice');
    $('#modelBtn').classList.toggle('hidden',mode!=='practice');
    if(started && !finished) renderTask();
  }
  $('#examModeBtn').addEventListener('click',()=>!started&&setMode('exam'));
  $('#practiceModeBtn').addEventListener('click',()=>!started&&setMode('practice'));
  $('#frenchToggle').addEventListener('change',e=>document.body.classList.toggle('show-fr',e.target.checked));

  async function startCamera(){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
      $('#cameraPreview').srcObject=stream; $('#cameraPlaceholder').style.display='none'; $('#cameraState').textContent='Ready';
      toast('Camera check successful.');
    }catch(e){ $('#cameraState').textContent='Unavailable'; toast('Camera access was not granted.'); }
  }
  $('#checkCameraBtn').addEventListener('click',startCamera);

  function startExam(){
    started=true; finished=false; current=0; overallSec=0; tabChanges=0;
    $('#welcomeScreen').classList.add('hidden'); $('#examScreen').classList.remove('hidden'); $('#resultsScreen').classList.add('hidden');
    $('#sessionStatus').textContent='Test in progress';
    overallTimerId=setInterval(()=>{overallSec++;$('#overallTimer').textContent=fmt(overallSec);},1000);
    renderTask();
  }
  $('#startExamBtn').addEventListener('click',startExam);

  function renderDocument(doc){
    if(!doc) return '';
    return `<div class="document-box"><table><thead><tr>${doc.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${doc.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  function renderAudio(task,idx){
    return `<div class="audio-box"><div class="audio-meta"><strong>Audio message</strong><small id="playMeta">${mode==='exam'?'Maximum 2 plays':'Unlimited in practice mode'}</small></div><button class="secondary" id="playAudioBtn" type="button">▶ Play audio</button></div>`;
  }
  function renderChoices(task,idx){
    const resp=responses[idx];
    const indexed=task.options.map((text,i)=>({text,i}));
    const order=shuffle(indexed);
    return `<div class="choice-list">${order.map(o=>`<label class="choice-option ${resp.selected.includes(o.i)?'selected':''}"><input type="${task.type==='single'?'radio':'checkbox'}" name="q${idx}" value="${o.i}" ${resp.selected.includes(o.i)?'checked':''}><span>${esc(o.text)}</span></label>`).join('')}</div>`;
  }
  function renderRecorder(idx){
    const r=responses[idx];
    return `<div class="recorder"><div class="recorder-row"><button class="record-btn" id="recordBtn" type="button">● Record</button><button class="stop-btn" id="stopBtn" type="button" disabled>■ Stop</button><span class="record-time" id="recordTime">00:00</span></div><div id="recordNote" class="record-note">Record your response. You can re-record before moving on.</div><audio id="recordPlayback" controls ${r.recordingUrl?'':'hidden'} ${r.recordingUrl?`src="${r.recordingUrl}"`:''}></audio><a id="recordDownload" class="download-link" ${r.recordingUrl?'':'hidden'} ${r.recordingUrl?`href="${r.recordingUrl}" download="Marine-LILATE-IA-task-${idx+1}.webm"`:''}>Download this recording</a></div>`;
  }
  function renderTask(){
    const task=tasks[current], resp=responses[current];
    $('#partLabel').textContent=`PART ${task.part}`; $('#partTitle').textContent=partMeta[task.part][0];
    $('#questionCounter').textContent=`Question ${current+1} of ${tasks.length}`; const pct=Math.round(((current+1)/tasks.length)*100); $('#progressPercent').textContent=`${pct}%`;$('#progressBar').style.width=`${pct}%`;
    $$('.part-nav').forEach(btn=>{const p=+btn.dataset.part;btn.classList.toggle('active',p===task.part);btn.classList.toggle('completed',p<task.part);});
    let html=`<div class="task-kicker">${esc(task.kicker)}</div><h3>${esc(task.title)}</h3><p class="instruction">${esc(task.instruction)}</p>`;
    if(task.context) html+=`<div class="context-box">${esc(task.context)}</div>`;
    if(task.document) html+=renderDocument(task.document);
    if(task.audio) html+=renderAudio(task,current);
    if(task.type==='single'||task.type==='multi') html+=renderChoices(task,current);
    if(task.type==='written') html+=`<textarea id="writtenAnswer" class="answer-area" placeholder="Type your answer here...">${esc(resp.text)}</textarea><div class="word-counter"><span id="wordCount">0</span> words</div>`;
    if(task.type==='oral') html+=renderRecorder(current);
    html+=`<div id="dynamicHelp"></div><div id="dynamicModel"></div><div id="feedbackArea"></div>`;
    $('#questionCard').innerHTML=html;
    $('#helpBtn').classList.toggle('hidden',mode!=='practice'); $('#modelBtn').classList.toggle('hidden',mode!=='practice');
    bindTask(task,current); resetQuestionTimer(task.time);
    updateAnswered();
  }

  function bindTask(task,idx){
    $$('.choice-option input').forEach(input=>input.addEventListener('change',()=>{
      const val=+input.value;
      if(task.type==='single') responses[idx].selected=[val]; else {
        const set=new Set(responses[idx].selected); input.checked?set.add(val):set.delete(val); responses[idx].selected=[...set];
      }
      $$('.choice-option').forEach(l=>l.classList.toggle('selected',l.querySelector('input').checked)); updateAnswered();
    }));
    const ta=$('#writtenAnswer'); if(ta){ const count=()=>{$('#wordCount').textContent=ta.value.trim()?ta.value.trim().split(/\s+/).length:0;responses[idx].text=ta.value;updateAnswered();};ta.addEventListener('input',count);count(); }
    $('#playAudioBtn')?.addEventListener('click',()=>playTaskAudio(task,idx));
    $('#recordBtn')?.addEventListener('click',()=>startRecording(idx)); $('#stopBtn')?.addEventListener('click',()=>stopRecording(idx));
    $('#helpBtn').onclick=()=>showHelp(task); $('#modelBtn').onclick=()=>showModels(task);
  }

  function pickVoice(lang){
    const voices=speechSynthesis.getVoices();
    return voices.find(v=>v.lang===lang)||voices.find(v=>v.lang.startsWith(lang.split('-')[0]))||null;
  }
  function playTaskAudio(task,idx){
    const resp=responses[idx]; if(mode==='exam' && resp.playCount>=2){toast('Maximum two plays in Exam mode.');return;}
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(task.audio); const lang=$('#accentSelect').value;u.lang=lang;u.rate=parseFloat($('#speedSelect').value)||.94;const v=pickVoice(lang);if(v)u.voice=v;speechSynthesis.speak(u);resp.playCount++;$('#playMeta').textContent=mode==='exam'?`${resp.playCount} / 2 plays used`:`${resp.playCount} plays`; 
  }
  function showHelp(task){$('#dynamicHelp').innerHTML=`<div class="help-box"><strong>Aide en français</strong><p>${esc(task.fr)}</p></div>`;}
  function showModels(task){$('#dynamicModel').innerHTML=`<div class="model-box"><strong>Model answers</strong><div class="model-level"><strong>B1 model:</strong> ${esc(task.models.b1)}</div><div class="model-level"><strong>B2 model:</strong> ${esc(task.models.b2)}</div></div>`;}

  async function startRecording(idx){
    try{
      if(mediaStates[idx]?.recorder?.state==='recording') return;
      const stream=await navigator.mediaDevices.getUserMedia({audio:true}); $('#micState').textContent='Recording';
      const chunks=[]; const rec=new MediaRecorder(stream); const state={recorder:rec,stream,chunks,seconds:0,interval:null}; mediaStates[idx]=state;
      rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      rec.onstop=()=>{const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});if(responses[idx].recordingUrl)URL.revokeObjectURL(responses[idx].recordingUrl);const url=URL.createObjectURL(blob);responses[idx].recording=blob;responses[idx].recordingUrl=url;const audio=$('#recordPlayback');const dl=$('#recordDownload');if(audio){audio.src=url;audio.hidden=false;}if(dl){dl.href=url;dl.download=`Marine-LILATE-IA-task-${idx+1}.webm`;dl.hidden=false;}state.stream.getTracks().forEach(t=>t.stop());$('#micState').textContent='Ready';$('#recordNote').textContent='Recording ready. You can listen or record again.';updateAnswered();};
      rec.start();$('#recordBtn').disabled=true;$('#stopBtn').disabled=false;$('#recordNote').textContent='Recording…';state.interval=setInterval(()=>{state.seconds++;$('#recordTime').textContent=fmt(state.seconds);},1000);
    }catch(e){$('#micState').textContent='Unavailable';$('#recordNote').textContent='Microphone access was not granted. Please allow microphone access in your browser settings.';}
  }
  function stopRecording(idx){const s=mediaStates[idx];if(s?.recorder?.state==='recording')s.recorder.stop();if(s?.interval)clearInterval(s.interval);$('#recordBtn').disabled=false;$('#stopBtn').disabled=true;}

  function resetQuestionTimer(seconds){clearInterval(qTimerId);qRemaining=seconds;$('#questionTimer').textContent=fmt(qRemaining);qTimerId=setInterval(()=>{qRemaining--;$('#questionTimer').textContent=fmt(qRemaining);if(qRemaining<=0){clearInterval(qTimerId);toast('Time is up — continue to the next task.');$('#questionTimer').textContent='00:00';}},1000);}
  function validateCurrent(skip=false){
    const task=tasks[current],resp=responses[current]; if(skip) resp.skipped=true;
    if(mode==='practice'&&!skip&&(task.type==='single'||task.type==='multi')){
      const correct=sameSet(resp.selected,task.answer);$('#feedbackArea').innerHTML=`<div class="feedback-line ${correct?'good':'bad'}">${correct?'✓ Correct.':'Not quite. Review the correct answer below.'}</div>`;markReview(task,resp); if(!correct) showModels(task);
      setTimeout(()=>advance(),correct?450:950);
    }else advance();
  }
  function sameSet(a,b){return a.length===b.length&&[...a].sort((x,y)=>x-y).every((v,i)=>v===[...b].sort((x,y)=>x-y)[i]);}
  function markReview(task,resp){$$('.choice-option').forEach(label=>{const i=+label.querySelector('input').value;if(task.answer.includes(i))label.classList.add('correct-review');else if(resp.selected.includes(i))label.classList.add('incorrect-review');});}
  function advance(){clearInterval(qTimerId);if(current<tasks.length-1){current++;renderTask();}else finishExam();}
  $('#nextBtn').addEventListener('click',()=>validateCurrent(false)); $('#dontKnowBtn').addEventListener('click',()=>validateCurrent(true));

  function answered(resp,task){if(resp.skipped)return true;if(task.type==='single'||task.type==='multi')return resp.selected.length>0;if(task.type==='written')return resp.text.trim().length>0;if(task.type==='oral')return !!resp.recordingUrl;return false;}
  function updateAnswered(){const n=responses.filter((r,i)=>answered(r,tasks[i])).length;$('#answeredCount').textContent=`${n} / ${tasks.length}`;}

  document.addEventListener('visibilitychange',()=>{if(started&&!finished&&mode==='exam'&&document.hidden){tabChanges++;$('#tabChanges').textContent=tabChanges;toast('Tab change recorded.');}});
  document.addEventListener('copy',e=>{if(started&&!finished&&mode==='exam'){e.preventDefault();toast('Copy is disabled in Exam mode.');}});
  document.addEventListener('paste',e=>{if(started&&!finished&&mode==='exam'){e.preventDefault();toast('Paste is disabled in Exam mode.');}});

  function objectiveStats(part=null){let correct=0,total=0;tasks.forEach((t,i)=>{if(part&&t.part!==part)return;if(t.type==='single'||t.type==='multi'){total++;if(sameSet(responses[i].selected,t.answer))correct++;}});return{correct,total,pct:total?Math.round(correct/total*100):0};}
  function finishExam(){finished=true;clearInterval(qTimerId);clearInterval(overallTimerId);speechSynthesis.cancel();Object.values(mediaStates).forEach(s=>{if(s?.recorder?.state==='recording')s.recorder.stop();if(s?.interval)clearInterval(s.interval);});$('#examScreen').classList.add('hidden');$('#resultsScreen').classList.remove('hidden');$('#sessionStatus').textContent='Completed';const all=objectiveStats();$('#objectiveScore').textContent=`${all.pct}%`;$('#objectiveDetail').textContent=`${all.correct} / ${all.total} objective items`;for(let p=1;p<=4;p++)$(`#p${p}Score`).textContent=`${objectiveStats(p).pct}%`;$('#tabChangesResult').textContent=tabChanges;renderRubrics();renderReview();window.scrollTo({top:0,behavior:'smooth'});}

  function renderRubrics(){
    const open=tasks.map((t,i)=>({t,i})).filter(x=>x.t.type==='oral'||x.t.type==='written');
    $('#trainerRubrics').innerHTML=open.map(({t,i})=>`<article class="rubric-card"><h3>Task ${i+1} · ${esc(t.title)}</h3><div class="response-preview">${t.type==='written'?esc(responses[i].text||'No written response'):(responses[i].recordingUrl?'Recording available above in the original task / downloaded file':'No recording saved')}</div><div class="rubric-grid"><label>Task completion<select data-rubric="${i}-task"><option value="">—</option>${[0,1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></label><label>Clarity / fluency<select data-rubric="${i}-clarity"><option value="">—</option>${[0,1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></label><label>Grammar accuracy<select data-rubric="${i}-grammar"><option value="">—</option>${[0,1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></label><label>Vocabulary / register<select data-rubric="${i}-vocab"><option value="">—</option>${[0,1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></label></div></article>`).join('');
  }
  function renderReview(){
    $('#reviewList').innerHTML=tasks.map((t,i)=>{
      let ans=''; if(t.type==='single'||t.type==='multi')ans=responses[i].selected.length?responses[i].selected.map(n=>t.options[n]).join(' | '):'No answer'; else if(t.type==='written')ans=responses[i].text||'No answer'; else ans=responses[i].recordingUrl?'Oral recording completed':'No oral recording';
      const status=(t.type==='single'||t.type==='multi')?(sameSet(responses[i].selected,t.answer)?'✓ Correct':'✗ Review'):'Trainer review';
      return `<article class="review-card"><h3>Task ${i+1} · ${esc(t.title)} · ${status}</h3><div class="response-preview"><strong>Your response:</strong><br>${esc(ans)}</div><div class="model-review"><strong>B1 model:</strong> ${esc(t.models.b1)}<br><br><strong>B2 model:</strong> ${esc(t.models.b2)}</div></article>`;
    }).join('');
  }

  function rubricValues(){const vals={};$$('[data-rubric]').forEach(s=>vals[s.dataset.rubric]=s.value);return vals;}
  function reportText(){
    const all=objectiveStats();const lines=['MARINE — LILATE IA STYLE FULL MOCK','Training simulation · Original items','',`Mode: ${mode}`,`Elapsed time: ${fmt(overallSec)}`,`Objective score: ${all.pct}% (${all.correct}/${all.total})`,`Tab changes: ${tabChanges}`,''];for(let p=1;p<=4;p++){const s=objectiveStats(p);lines.push(`Part ${p} — ${partMeta[p][0]}: ${s.pct}% (${s.correct}/${s.total})`);}lines.push('','OPEN RESPONSES');tasks.forEach((t,i)=>{if(t.type==='written')lines.push(`Task ${i+1} — ${t.title}: ${responses[i].text||'—'}`);if(t.type==='oral')lines.push(`Task ${i+1} — ${t.title}: ${responses[i].recordingUrl?'Recording completed':'—'}`);});lines.push('','TRAINER RUBRICS',JSON.stringify(rubricValues(),null,2),'','TRAINER COMMENTS',$('#trainerComments').value||'—');return lines.join('\n');
  }
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}
  $('#downloadTxtBtn').addEventListener('click',()=>downloadBlob(new Blob([reportText()],{type:'text/plain;charset=utf-8'}),'Marine-LILATE-IA-Mock-Results.txt'));
  $('#downloadHtmlBtn').addEventListener('click',()=>{
    const all=objectiveStats();const review=tasks.map((t,i)=>`<section><h3>Task ${i+1}: ${esc(t.title)}</h3><p><b>Response:</b> ${esc(t.type==='written'?(responses[i].text||'—'):(t.type==='oral'?(responses[i].recordingUrl?'Recording completed':'—'):(responses[i].selected.map(n=>t.options[n]).join(' | ')||'—')))}</p><p><b>B1 model:</b> ${esc(t.models.b1)}</p><p><b>B2 model:</b> ${esc(t.models.b2)}</p></section>`).join('');
    const html=`<!doctype html><html><head><meta charset="utf-8"><title>Marine LILATE IA Mock Report</title><style>body{font:15px Arial,sans-serif;max-width:900px;margin:40px auto;color:#1e293b}h1,h2,h3{color:#17345f}header{border-bottom:3px solid #2f6fed;padding-bottom:15px}section{border:1px solid #d9e1ec;border-radius:10px;padding:14px;margin:12px 0}.score{font-size:28px;font-weight:bold}</style></head><body><header><h1>Marine · LILATE IA-style mock report</h1><p>Training simulation · Original items</p><div class="score">Objective score: ${all.pct}% (${all.correct}/${all.total})</div><p>Elapsed: ${fmt(overallSec)} · Tab changes: ${tabChanges}</p></header>${review}<h2>Trainer comments</h2><p>${esc($('#trainerComments').value||'—')}</p></body></html>`;
    downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),'Marine-LILATE-IA-Mock-Report.html');
  });
  $('#printBtn').addEventListener('click',()=>window.print());
  $('#restartBtn').addEventListener('click',()=>location.reload());
  window.addEventListener('beforeunload',()=>{const v=$('#cameraPreview');const s=v?.srcObject;if(s)s.getTracks().forEach(t=>t.stop());});

  setMode('exam');
})();
