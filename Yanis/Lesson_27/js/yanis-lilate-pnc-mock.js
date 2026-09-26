(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const STORE = 'yanis-lilate-pnc-mock-v1';
  const state = {
    mode:'practice', voice:'GB', french:true, current:'room', examStarted:false,
    globalSeconds:3600, sectionSeconds:900, timersPaused:false,
    visited:new Set(), recorded:new Set(), warmupScore:0, warmupAnswered:new Set(), ratings:{}, mediaStream:null,
    timerId:null
  };

  const scripts = {
    briefing1: `Good afternoon. This is the handover for flight A F eight four two to Dublin. We are currently running twenty-five minutes late because the inbound aircraft arrived behind schedule. The vegetarian meal requested by the passenger in seat twenty-two C was not loaded, so please discuss an alternative with the passenger before departure. The family seated in row eighteen has asked if they can sit together, but no seat changes have been confirmed yet. We are also expecting a wheelchair passenger to board at door four L. Please make sure the forward crew is ready to assist.`,
    captain1: `Cabin crew, this is the flight deck. We are expecting a period of moderate turbulence approximately twenty minutes after take-off. The seat belt signs may remain on longer than usual. Please postpone the hot drinks service until conditions improve and remind passengers to remain seated with their seat belts fastened whenever the sign is illuminated. We will provide another update once we are through the turbulence.`,
    gate4: `Additional update from the gate team. The technical inspection is now complete. Boarding is still expected to begin at eighteen fifty-five, but departure time remains estimated at nineteen twenty-five. We have not received any confirmed rebooking instructions. Please identify passengers with connections departing before twenty-one fifteen and report them to the senior crew member.`
  };

  const vocab = {
    welcome:[
      ['How may I help you?','Comment puis-je vous aider ?','A professional way to invite the passenger to explain a need.','Good evening. How may I help you?'],
      ['Could I see your boarding pass?','Puis-je voir votre carte d’embarquement ?','A polite request for travel information.','Could I see your boarding pass, please?'],
      ['What seems to be the problem?','Quel semble être le problème ?','A neutral way to identify an issue.','What seems to be the problem with your seat?'],
      ['Let me check that for you.','Je vais vérifier cela pour vous.','Shows you are taking action without promising a result.','Let me check that for you and I’ll come back to you.'],
      ['May I ask…?','Puis-je vous demander… ?','Polite way to request information.','May I ask which flight you are connecting to?']
    ],
    clarify:[
      ['Could you repeat that, please?','Pourriez-vous répéter, s’il vous plaît ?','Ask naturally when you did not hear or understand.','Could you repeat the flight number, please?'],
      ['Could you say that more slowly?','Pourriez-vous parler plus lentement ?','Ask for a slower repetition.','Could you say the surname more slowly, please?'],
      ['Did you say…?','Vous avez dit… ?','Check one uncertain detail.','Did you say gate B thirteen or B thirty?'],
      ['Let me make sure I understood.','Laissez-moi vérifier que j’ai bien compris.','Introduces a reformulation.','Let me make sure I understood: your next flight leaves at 20:10.'],
      ['In other words…','Autrement dit…','Reformulate a message more simply.','In other words, boarding will start later than planned.'],
      ['What I understand is…','Ce que je comprends, c’est…','Safe structure for summarising.','What I understand is that you need assistance on arrival.']
    ],
    seat:[
      ['seat assignment','attribution de siège','The seat allocated to a passenger.','There may be a problem with the seat assignment.'],
      ['window seat','siège côté hublot','A seat beside the aircraft window.','I understand that you requested a window seat.'],
      ['aisle seat','siège côté couloir','A seat beside the aisle.','Would an aisle seat be acceptable?'],
      ['overhead locker','coffre à bagages','Storage compartment above the seats.','The overhead locker is already full.'],
      ['cabin bag','bagage cabine','A small item carried into the cabin.','Could you place your cabin bag under the seat?'],
      ['duplicate seat','siège attribué en double','When two passengers appear to have the same seat.','I’ll check whether there is a duplicate seat assignment.']
    ],
    delay:[
      ['estimated departure','départ estimé','The latest expected departure time.','The estimated departure is now 19:25.'],
      ['tight connection','correspondance courte','A connection with little transfer time.','I understand that you have a tight connection.'],
      ['onward flight','vol de correspondance','The next flight in a journey.','What is your onward flight number?'],
      ['latest confirmed information','dernières informations confirmées','Information that has been officially verified.','I’ll give you the latest confirmed information.'],
      ['rebooking','réacheminement / nouvelle réservation','Changing a passenger to another flight.','We have not received rebooking instructions yet.'],
      ['report the connection','signaler la correspondance','Pass connection details to the crew or ground team.','I can report your connection to the senior crew member.']
    ],
    service:[
      ['meal request','demande de repas','A passenger’s requested meal type.','Your vegetarian meal request is on the passenger list.'],
      ['alternative','solution de remplacement','Another possible option.','I’ll check what alternative is available.'],
      ['forward galley','office avant','The service preparation area at the front of the cabin.','The meals are stored in the forward galley.'],
      ['service is postponed','le service est reporté','The service will happen later.','The hot drinks service is postponed until conditions improve.'],
      ['special assistance','assistance particulière','Extra support arranged for a passenger.','Special assistance has been confirmed on arrival.']
    ],
    reassure:[
      ['I understand your concern.','Je comprends votre inquiétude.','Acknowledges the passenger’s feelings without making a promise.','I understand your concern about the connection.'],
      ['I can’t guarantee that.','Je ne peux pas le garantir.','Sets a professional boundary.','I can’t guarantee that the next flight will wait.'],
      ['What I can do is…','Ce que je peux faire, c’est…','Moves from a limitation to a useful action.','What I can do is report your connection immediately.'],
      ['I’ll keep you updated.','Je vous tiendrai informé(e).','Promises communication, not an outcome.','I’ll keep you updated as soon as we receive confirmation.'],
      ['Thank you for your patience.','Merci pour votre patience.','Polite closing during a disruption.','Thank you for your patience while we check the situation.']
    ],
    relay:[
      ['According to the message…','Selon le message…','Introduces information from a third party.','According to the message, boarding will begin at 18:55.'],
      ['The captain has advised us that…','Le commandant nous a informés que…','Relays information from the flight deck.','The captain has advised us that we may experience turbulence.'],
      ['The current situation is…','La situation actuelle est…','Starts a concise handover.','The current situation is that departure is delayed by 35 minutes.'],
      ['The next step is…','La prochaine étape est…','Makes the required action explicit.','The next step is to report the tight connection.'],
      ['No change has been confirmed yet.','Aucun changement n’a encore été confirmé.','Separates facts from uncertainty.','No rebooking change has been confirmed yet.'],
      ['Could you confirm…?','Pouvez-vous confirmer… ?','Requests verification before action.','Could you confirm what arrival assistance is available?']
    ]
  };

  const warmup = [
    {q:'A passenger is upset about a delay. Which response is most useful?', choices:['I understand your concern. Let me check the latest confirmed information.','There is nothing I can do.','You must wait.'], a:'I understand your concern. Let me check the latest confirmed information.', why:'Acknowledge the concern, then move to verified action.'},
    {q:'Choose the clearest reformulation.', choices:['So, if I understand correctly, your connection leaves at 20:10.','Your connection 20:10 yes?','Connection is leave 20:10.'], a:'So, if I understand correctly, your connection leaves at 20:10.', why:'It checks understanding and keeps the sentence clear.'},
    {q:'Which sentence avoids an unauthorised promise?', choices:['I can’t guarantee rebooking yet, but I can report your connection.','I promise the next flight will wait.','You will definitely be rebooked.'], a:'I can’t guarantee rebooking yet, but I can report your connection.', why:'State the boundary, then offer the action you can take.'},
    {q:'Which sentence correctly reports a finished event?', choices:['The gate agent called the crew at 18:35.','The gate agent has call the crew at 18:35.','The gate agent is call the crew yesterday.'], a:'The gate agent called the crew at 18:35.', why:'Use the past simple for a finished event at a stated past time.'},
    {q:'What should you do when one number is unclear?', choices:['Ask for confirmation: “Did you say 13 or 30?”','Guess from the context.','Ignore the number.'], a:'Ask for confirmation: “Did you say 13 or 30?”', why:'Clarification is a professional communication skill.'},
    {q:'Choose the best next-step sentence.', choices:['If I receive confirmation, I will let you know immediately.','If I will receive confirmation, I let you know.','If I received confirmation, I will telling you.'], a:'If I receive confirmation, I will let you know immediately.', why:'First conditional: if + present, will + base verb.'},
    {q:'Which handover order is easiest to follow?', choices:['Situation → essential details → action / next step','Every detail in the order you remember it','Grammar explanation → apology → unrelated detail'], a:'Situation → essential details → action / next step', why:'A professional handover should prioritise useful operational information.'},
    {q:'You forget the word “overhead locker.” What is the best strategy?', choices:['Describe it: “the compartment above the seats.”','Stop speaking until you remember.','Switch completely to French.'], a:'Describe it: “the compartment above the seats.”', why:'Paraphrasing keeps the interaction moving — an important B1 strategy.'}
  ];

  const surprise1 = [
    'Passenger: “I paid extra for a window seat. I don’t want to move.”',
    'Passenger: “We are travelling together. Can you guarantee two seats next to each other?”',
    'Passenger: “I don’t understand your explanation. Can you say it more simply?”',
    'Passenger: “My boarding pass is on my phone, but the battery has died.”'
  ];
  const surprise3 = [
    'Passenger: “That’s not enough. I want you to promise the next flight will wait.”',
    'Passenger: “My connection is KL1423. What exactly will you do with that information?”',
    'Passenger: “Can I speak to your supervisor right now?”',
    'Passenger: “I didn’t understand. Please explain the situation more simply.”'
  ];

  const rubric = [
    ['interaction','Interaction & responsiveness','Enters the exchange, asks relevant questions, reacts to follow-ups.'],
    ['listening','Listening comprehension','Identifies the essential message, numbers, timing, people and requested action.'],
    ['reformulation','Clarification & reformulation','Checks uncertain details and can say the same idea in simpler/different words.'],
    ['transmission','Information transmission','Relays third-party information clearly without inventing or losing key facts.'],
    ['exploitation','Document exploitation','Selects useful information, prioritises it and uses it to make an appropriate response.'],
    ['professional','Professional appropriacy','Shows empathy, sets boundaries and gives realistic next steps.'],
    ['language','Grammar & vocabulary control','Errors may occur, but tense, sentence structure and vocabulary keep meaning clear.'],
    ['intelligibility','Fluency & intelligibility','Speech is understandable; pauses do not prevent the interaction from continuing.']
  ];

  function loadState(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORE) || '{}');
      if(saved.mode) state.mode=saved.mode;
      if(saved.voice) state.voice=saved.voice;
      if(typeof saved.french==='boolean') state.french=saved.french;
      if(Array.isArray(saved.visited)) state.visited=new Set(saved.visited);
      if(Array.isArray(saved.recorded)) state.recorded=new Set(saved.recorded);
      if(saved.ratings) state.ratings=saved.ratings;
      if(Number.isFinite(saved.warmupScore)) state.warmupScore=saved.warmupScore;
      if(Array.isArray(saved.warmupAnswered)) state.warmupAnswered=new Set(saved.warmupAnswered);
      $$('input,textarea,select').forEach(el=>{
        if(!el.id) return;
        const key='field_'+el.id;
        if(Object.prototype.hasOwnProperty.call(saved,key)){
          if(el.type==='checkbox') el.checked=!!saved[key]; else el.value=saved[key];
        }
      });
    }catch(e){console.warn('Could not load saved state',e)}
  }
  function saveState(){
    const data={mode:state.mode,voice:state.voice,french:state.french,visited:[...state.visited],recorded:[...state.recorded],ratings:state.ratings,warmupScore:state.warmupScore,warmupAnswered:[...state.warmupAnswered]};
    $$('input,textarea,select').forEach(el=>{if(el.id)data['field_'+el.id]=el.type==='checkbox'?el.checked:el.value});
    localStorage.setItem(STORE,JSON.stringify(data));
  }

  function setMode(mode){
    state.mode=mode;
    document.body.classList.toggle('exam-mode',mode==='exam');
    $('#practiceMode').classList.toggle('is-on',mode==='practice');
    $('#examMode').classList.toggle('is-on',mode==='exam');
    $('#toggleFrench').disabled=mode==='exam';
    if(mode==='exam'){
      $$('.fr').forEach(el=>el.classList.add('hidden'));
      $('#toggleFrench').textContent='FR help: locked';
    }else{
      $('#floatingExamControls').classList.add('hidden');
      applyFrench();
      stopTimers(); state.examStarted=false; state.globalSeconds=3600; state.sectionSeconds=900; updateTimers();
    }
    saveState();
  }
  function applyFrench(){
    $$('.fr').forEach(el=>el.classList.toggle('hidden',!state.french));
    $('#toggleFrench').textContent='FR help: '+(state.french?'on':'off');
  }

  function navigate(id, fromTimer=false){
    $$('.screen').forEach(s=>s.classList.remove('is-visible'));
    const target=$('#'+id); if(!target)return;
    target.classList.add('is-visible'); state.current=id;
    $$('.part-link').forEach(b=>b.classList.toggle('is-active',b.dataset.go===id));
    if(/^part[1-4]$/.test(id)){
      state.visited.add(id);
      if(state.mode==='exam' && state.examStarted && !fromTimer){state.sectionSeconds=900;updateTimers();}
    }
    updateEvidence(); updateProgress(); saveState();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function updateProgress(){
    const p=Math.round((state.visited.size/4)*100);
    $('#sideProgressText').textContent=p+'% of exam parts visited';
    $('#sideProgressBar').style.width=p+'%';
  }
  function fmt(sec){sec=Math.max(0,sec);return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
  function updateTimers(){
    $('#globalTimer').textContent=fmt(state.globalSeconds); $('#sectionTimer').textContent=fmt(state.sectionSeconds);
    $('#globalTimer').style.color=state.globalSeconds<=300?'#ffd177':''; $('#sectionTimer').style.color=state.sectionSeconds<=120?'#ffd177':'';
  }
  function startTimers(){
    stopTimers(); state.timersPaused=false;
    state.timerId=setInterval(()=>{
      if(state.timersPaused)return;
      if(state.globalSeconds>0)state.globalSeconds--;
      if(/^part[1-4]$/.test(state.current)&&state.sectionSeconds>0)state.sectionSeconds--;
      updateTimers();
      if(state.sectionSeconds===0 && /^part[1-4]$/.test(state.current)){
        $('#sectionTimer').textContent='00:00';
      }
      if(state.globalSeconds===0){stopTimers(); alert('The 60-minute mock timer has ended. Finish the sentence you are on and move to the trainer report.');}
    },1000)
  }
  function stopTimers(){if(state.timerId){clearInterval(state.timerId);state.timerId=null}}
  function nextPart(){
    const order=['part1','part2','part3','part4','report']; const i=order.indexOf(state.current); if(i>=0&&i<order.length-1)navigate(order[i+1]);
  }

  function pickVoiceCode(){
    if(state.voice!=='MIX') return state.voice;
    return ['GB','US','AU'][Math.floor(Math.random()*3)];
  }
  function voiceLang(code){return code==='US'?'en-US':code==='AU'?'en-AU':'en-GB'}
  function speakText(text, rate=1){
    if(!('speechSynthesis' in window)){alert('Speech synthesis is not available in this browser.');return;}
    speechSynthesis.cancel(); const utter=new SpeechSynthesisUtterance(text); const lang=voiceLang(pickVoiceCode()); utter.lang=lang; utter.rate=rate;
    const voices=speechSynthesis.getVoices(); const candidates=voices.filter(v=>v.lang&&v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    if(candidates.length) utter.voice=candidates[0];
    speechSynthesis.speak(utter);
  }
  function renderVocab(){
    const cat=$('#vocabCategory').value; const list=$('#vocabList'); list.innerHTML='';
    vocab[cat].forEach(([term,tr,def,ex])=>{
      const item=document.createElement('div');item.className='vocab-item';item.innerHTML=`<div class="vocab-item__top"><div><strong>${term}</strong><p class="translation">${tr}</p></div><button type="button" aria-label="Listen to ${term}">▶</button></div><p>${def}</p><p><em>${ex}</em></p>`;
      $('button',item).addEventListener('click',()=>speakText(term+'. '+ex)); list.appendChild(item);
    });
  }
  function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
  function renderWarmup(){
    const box=$('#warmupQuiz');box.innerHTML=''; state.warmupScore=0; state.warmupAnswered.clear();
    shuffle(warmup).forEach((q,idx)=>{
      const card=document.createElement('div');card.className='warmup-q';card.innerHTML=`<p>${idx+1}. ${q.q}</p><div class="choice-row"></div><div class="feedback"></div>`;
      const row=$('.choice-row',card); shuffle(q.choices).forEach(choice=>{
        const b=document.createElement('button');b.type='button';b.className='choice-btn';b.textContent=choice;b.addEventListener('click',()=>{
          if(state.warmupAnswered.has(idx))return; state.warmupAnswered.add(idx);
          [...row.children].forEach(btn=>{btn.disabled=true;if(btn.textContent===q.a)btn.classList.add('correct')});
          if(choice===q.a){b.classList.add('correct');state.warmupScore++;$('.feedback',card).textContent='Correct — '+q.why;}else{b.classList.add('wrong');$('.feedback',card).textContent='Try to remember: '+q.why;}
          $('#warmupScore').textContent=state.warmupScore+' / 8'; updateEvidence(); saveState();
        }); row.appendChild(b);
      });box.appendChild(card);
    });
  }

  function initRecorders(){
    $$('.record-box').forEach(box=>{
      const id=box.dataset.recorder; const start=$('.record-start',box), stop=$('.record-stop',box), audio=$('.recorded',box), status=$('.record-status',box);
      let recorder=null,chunks=[],stream=null;
      start.addEventListener('click',async()=>{
        if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){status.textContent='Recording is not supported here. Use HTTPS/Chrome.';return;}
        try{
          stream=await navigator.mediaDevices.getUserMedia({audio:true}); chunks=[]; recorder=new MediaRecorder(stream);
          recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
          recorder.onstop=()=>{
            const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'}); audio.src=URL.createObjectURL(blob);audio.classList.remove('hidden');
            status.textContent='Recorded — listen back before moving on.';state.recorded.add(id);updateEvidence();saveState(); if(stream)stream.getTracks().forEach(t=>t.stop());
          };
          recorder.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…';
        }catch(e){status.textContent='Microphone permission was not granted.';}
      });
      stop.addEventListener('click',()=>{if(recorder&&recorder.state!=='inactive'){recorder.stop();start.disabled=false;stop.disabled=true}});
    });
  }

  async function startMediaCheck(){
    if(!navigator.mediaDevices?.getUserMedia){$('#mediaStatus').textContent='Not supported';return;}
    try{
      state.mediaStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      $('#cameraPreview').srcObject=state.mediaStream;$('#videoPlaceholder').classList.add('hidden');$('#mediaStatus').textContent='Working';$('#mediaTest').classList.add('hidden');$('#stopMediaTest').classList.remove('hidden');
      const ctx=new (window.AudioContext||window.webkitAudioContext)();const source=ctx.createMediaStreamSource(state.mediaStream);const analyser=ctx.createAnalyser();analyser.fftSize=256;source.connect(analyser);const data=new Uint8Array(analyser.frequencyBinCount);
      const tick=()=>{if(!state.mediaStream)return;analyser.getByteFrequencyData(data);const avg=data.reduce((a,b)=>a+b,0)/data.length;$('#micLevel').style.width=Math.min(100,avg*1.8)+'%';requestAnimationFrame(tick)};tick();
      state._audioCtx=ctx;
    }catch(e){$('#mediaStatus').textContent='Permission blocked / unavailable';}
  }
  function stopMediaCheck(){
    if(state.mediaStream)state.mediaStream.getTracks().forEach(t=>t.stop());state.mediaStream=null;$('#cameraPreview').srcObject=null;$('#videoPlaceholder').classList.remove('hidden');$('#mediaStatus').textContent='Stopped';$('#micLevel').style.width='0';$('#mediaTest').classList.remove('hidden');$('#stopMediaTest').classList.add('hidden');if(state._audioCtx)state._audioCtx.close();
  }

  function renderRubric(){
    const grid=$('#rubricGrid');grid.innerHTML='';rubric.forEach(([id,title,desc])=>{
      const row=document.createElement('div');row.className='rubric-row';row.innerHTML=`<div class="rubric-row__top"><strong>${title}</strong><div class="rating" data-rating="${id}">${[1,2,3,4].map(n=>`<button type="button" data-value="${n}">${n}</button>`).join('')}</div></div><p>${desc}</p>`;
      $$('.rating button',row).forEach(b=>b.addEventListener('click',()=>{state.ratings[id]=Number(b.dataset.value);updateRubricUI();saveState()}));grid.appendChild(row);
    });updateRubricUI();
  }
  function updateRubricUI(){
    $$('.rating').forEach(group=>{const val=state.ratings[group.dataset.rating];$$('button',group).forEach(b=>b.classList.toggle('is-on',Number(b.dataset.value)===val))});
    const vals=Object.values(state.ratings).map(Number).filter(n=>n>=1&&n<=4);const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;const pct=vals.length?Math.round((avg/4)*100):0;
    $('#readinessPercent').textContent=pct+'%';$('#readinessPercent').parentElement.style.background=`conic-gradient(var(--accent) ${pct*3.6}deg,#dce6ea ${pct*3.6}deg)`;
    const box=$('#readinessMessage');box.className='readiness-message';
    if(!vals.length){box.classList.add('neutral');box.innerHTML='<strong>Not rated yet</strong><p>Complete the trainer ratings to generate a supportive evidence-based summary.</p>'}
    else if(avg>=3.25){box.classList.add('good');box.innerHTML='<strong>Strong operational evidence</strong><p>The performance consistently shows independent professional communication. Keep the debrief short and reinforce the strategies that worked.</p>'}
    else if(avg>=2.75){box.classList.add('good');box.innerHTML='<strong>Consistent B1-style signal</strong><p>The essential missions are being completed independently despite normal language errors. Focus next on fluency and one or two recurring accuracy points.</p>'}
    else if(avg>=2.25){box.classList.add('developing');box.innerHTML='<strong>B1 signal is present but not yet stable</strong><p>Several tasks work, but some still need prompting. Replay the weakest situation with one clear strategy rather than adding more grammar.</p>'}
    else{box.classList.add('needs-work');box.innerHTML='<strong>Build automaticity before another full mock</strong><p>The priority is not “more rules.” Practise short interaction → clarification → next-step cycles until the mission keeps moving with less support.</p>'}
  }

  function countWords(s){return s.trim()?s.trim().split(/\s+/).length:0}
  function updateWordCounts(){
    $$('.wordcount').forEach(span=>{const el=$('#'+span.dataset.for);span.textContent=countWords(el.value)+' words'});
  }
  function updateEvidence(){
    $('#partsVisited').textContent=state.visited.size+' / 4';
    const writtenIds=['p2handover','p2written','p3handover','p4written'];const done=writtenIds.filter(id=>countWords($('#'+id).value)>=12).length;$('#writtenDone').textContent=done+' / 4';
    $('#recordedDone').textContent=state.recorded.size+' / 10';$('#warmupFinal').textContent=state.warmupScore+' / 8';
  }
  function getReportText(){
    const lines=['PNC PROFESSIONAL ENGLISH — INTERNAL MOCK REPORT','Candidate: Yanis','Date: '+new Date().toLocaleDateString(),'','TRAINER RATINGS (1–4; internal training scale)'];
    rubric.forEach(([id,title])=>lines.push(`${title}: ${state.ratings[id]||'not rated'}/4`));
    lines.push('',`Parts visited: ${state.visited.size}/4`,`Written tasks completed: ${$('#writtenDone').textContent}`,`Recorded tasks: ${state.recorded.size}/10`,`Warm-up: ${state.warmupScore}/8`,'','Trainer comments:',($('#trainerComments').value||'—'),'','This is an independent pedagogical readiness estimate, not an official LILATE score or CEFR result.');return lines.join('\n');
  }
  function downloadReport(){
    const text=getReportText().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');
    const html=`<!doctype html><meta charset="utf-8"><title>Yanis PNC Mock Report</title><style>body{font:15px Arial,sans-serif;max-width:850px;margin:40px auto;line-height:1.55;color:#1c2b3a}h1{color:#0d2035}.note{margin-top:25px;padding:12px;background:#f4f7f9;border-left:4px solid #16a6a1}</style><h1>PNC Professional English — Mock Report</h1><p>${text}</p><div class="note">Independent training evidence only — not an official LILATE assessment.</div>`;
    const blob=new Blob([html],{type:'text/html'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Yanis_PNC_Mock_Report.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function bind(){
    $('#practiceMode').addEventListener('click',()=>setMode('practice'));$('#examMode').addEventListener('click',()=>setMode('exam'));
    $('#toggleFrench').addEventListener('click',()=>{if(state.mode==='exam')return;state.french=!state.french;applyFrench();saveState()});
    $$('.voice').forEach(b=>b.addEventListener('click',()=>{state.voice=b.dataset.voice;$$('.voice').forEach(x=>x.classList.toggle('is-on',x===b));saveState()}));
    $('#stopAudio').addEventListener('click',()=>{if('speechSynthesis' in window) window.speechSynthesis.cancel();});$$('.speak').forEach(b=>b.addEventListener('click',()=>speakText(b.dataset.say)));
    $$('.part-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));$$('.nav-next,.nav-prev').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.target)));
    $('#enterRoom').addEventListener('click',()=>{if(state.mode==='exam'){state.examStarted=true;state.globalSeconds=3600;state.sectionSeconds=900;$('#floatingExamControls').classList.remove('hidden');startTimers()}navigate('part1')});
    $('#backToStart').addEventListener('click',()=>navigate('room'));
    $('#openTrainerGuide').addEventListener('click',()=>window.open('trainer.html','_blank'));
    $('#pauseTimers').addEventListener('click',e=>{state.timersPaused=!state.timersPaused;e.target.textContent=state.timersPaused?'Resume':'Pause'});$('#restartPartTimer').addEventListener('click',()=>{state.sectionSeconds=900;updateTimers()});$('#nextPartFloating').addEventListener('click',nextPart);
    $('#mediaTest').addEventListener('click',startMediaCheck);$('#stopMediaTest').addEventListener('click',stopMediaCheck);
    $('#vocabCategory').addEventListener('change',renderVocab);
    $$('.hint-toggle,.model-toggle,.transcript-toggle').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.target)?.classList.toggle('hidden')));
    $$('.play-script').forEach(b=>b.addEventListener('click',()=>speakText(scripts[b.dataset.script],Number(b.dataset.rate)||1)));
    $('#p1Surprise').addEventListener('click',()=>{$('#p1SurpriseText').textContent=surprise1[Math.floor(Math.random()*surprise1.length)]});
    $('#p3Surprise').addEventListener('click',()=>{$('#p3SurpriseText').textContent=surprise3[Math.floor(Math.random()*surprise3.length)]});
    $$('textarea,input,select').forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{updateWordCounts();updateEvidence();saveState()}));
    $('#downloadReport').addEventListener('click',downloadReport);$('#copyReport').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(getReportText());$('#copyReport').textContent='Copied ✓';setTimeout(()=>$('#copyReport').textContent='Copy summary',1500)}catch(e){alert('Copy is unavailable in this browser.')}});$('#printReport').addEventListener('click',()=>window.print());
    $('#resetReport').addEventListener('click',()=>{if(!confirm('Reset trainer ratings and comments only?'))return;state.ratings={};$('#trainerComments').value='';updateRubricUI();saveState()});
    $('#resetAll').addEventListener('click',()=>{if(!confirm('Reset the complete mock, answers, ratings and saved progress?'))return;localStorage.removeItem(STORE);location.reload()});
  }

  function hydrate(){
    $('#transcript2a').textContent=scripts.briefing1;$('#transcript3a').textContent=scripts.captain1;$('#transcript4a').textContent=scripts.gate4;
    applyFrench();setMode(state.mode);$$('.voice').forEach(b=>b.classList.toggle('is-on',b.dataset.voice===state.voice));renderVocab();renderWarmup();renderRubric();initRecorders();updateWordCounts();updateEvidence();updateProgress();updateTimers();
  }
  loadState();bind();hydrate();
})();
