(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORAGE_KEY = 'marine_lesson5_confidence_lab_v1';
  const state = { reflexAnswered:{}, listeningAnswered:{}, gentleIndex:0, gentleSeconds:60, gentleTimer:null, recorder:null, chunks:[] };

  const evidence = {
    reading:'You already demonstrated that you can identify explicit information and the main idea. Exam reflex: search for the useful information instead of translating every sentence.',
    listening:'You already demonstrated that you can recognise key information in clear audio. Exam reflex: listen for who, what, when and the action required.',
    writing:'Your writing was already coherent and logically organised. Your next step is precision—not starting from zero.',
    speaking:'You already communicate on concrete topics and organise your ideas. Your next step is using reliable structures when pressure makes retrieval harder.'
  };

  const examParts = [
    {n:1,title:'Welcome & interact',job:'Understand the person’s need and respond appropriately.',starter:'The main thing you need is… / I can help you with…'},
    {n:2,title:'Collect & transcribe',job:'Take useful information from a text or audio and put it into another clear form.',starter:'The key information is… / To confirm…'},
    {n:3,title:'Collect & transmit',job:'Receive information, then pass the instructions or message to someone else.',starter:'First, you need to… / I was asked to tell you that…'},
    {n:4,title:'Collect & use information',job:'Use a document, message or video to explain, decide, compare or suggest a solution.',starter:'Based on the information… / One possible solution would be…'}
  ];

  const reflexItems = [
    {scenario:'A colleague tells you that tomorrow’s meeting has moved from 2:00 pm to 3:30 pm in Room 4. You must tell the rest of the team.',answer:'Transmit information',options:['Solve a complaint','Transmit information','Introduce yourself','Compare two offers'],why:'Your job is to pass accurate information from one person to other people.'},
    {scenario:'A customer says the amount on an invoice is incorrect and asks what they should do next.',answer:'Clarify and propose a solution',options:['Describe your hobbies','Clarify and propose a solution','Transmit safety rules','Summarise a CV'],why:'You need to understand the problem, confirm it and give a practical next step.'},
    {scenario:'You read a short notice explaining a new procedure. You must explain the main steps to a new colleague.',answer:'Reformulate a procedure',options:['Ask for directions','Make small talk','Reformulate a procedure','Describe a photo'],why:'Keep the meaning and reorganise it into clear steps.'},
    {scenario:'You receive two possible work schedules and must say which one is more suitable and why.',answer:'Compare and justify',options:['Confirm a spelling','Compare and justify','Give a phone number','Welcome a visitor'],why:'Use the information, choose an option and give a reason.'},
    {scenario:'Someone arrives and says they need help changing the date of an appointment.',answer:'Identify the need and respond',options:['Identify the need and respond','Explain a past holiday','Transmit a third-party message','Write meeting minutes'],why:'The first action is to understand the request and offer an appropriate response.'}
  ];

  const vocab = [
    ['Buy time','Let me think for a moment.','Laissez-moi réfléchir un instant.','A natural phrase that gives you a few seconds to organise your answer.','Let me think for a moment. I would choose the second option because it is more practical.'],
    ['Buy time','From what I understand…','D’après ce que je comprends…','Use this to begin an answer when you want to show your interpretation.','From what I understand, the delivery has been delayed until Friday.'],
    ['Focus','The main point is…','Le point principal est…','Use this to identify the essential information first.','The main point is that the meeting has changed to Thursday morning.'],
    ['Clarify','If I understand correctly…','Si je comprends bien…','Use this to check your interpretation before continuing.','If I understand correctly, you need the document before 4 pm.'],
    ['Clarify','Could you repeat the last part, please?','Pourriez-vous répéter la dernière partie, s’il vous plaît ?','A polite request when one detail is unclear.','Could you repeat the last part, please? I understood the date but not the room number.'],
    ['Clarify','Do you mean…?','Vous voulez dire… ?','Use this to check one specific detail.','Do you mean the customer wants a replacement, not a refund?'],
    ['Reformulate','In other words…','Autrement dit…','Use this to express the same meaning more simply.','In other words, we need to finish the report before we leave today.'],
    ['Reformulate','What this means is…','Cela signifie que…','A useful bridge into a clear explanation.','What this means is that the appointment will take place online instead.'],
    ['Sequence','First… Then… Finally…','D’abord… Ensuite… Enfin…','Use simple connectors to make instructions easy to follow.','First, check the order number. Then, contact the supplier. Finally, confirm the solution to the customer.'],
    ['Solve','One possible solution would be…','Une solution possible serait…','A safe phrase for proposing an option.','One possible solution would be to reschedule the delivery for Monday morning.'],
    ['Solve','I suggest that we…','Je suggère que nous…','Use this to make a practical recommendation.','I suggest that we contact the customer before changing the order.'],
    ['Self-correct','Sorry, let me rephrase that.','Désolée, laissez-moi reformuler.','Use this when you want to correct yourself without stopping completely.','Sorry, let me rephrase that. The meeting is on Thursday, not Tuesday.'],
    ['Self-correct','What I meant was…','Ce que je voulais dire, c’est…','Use this to repair a sentence and continue.','What I meant was that the documents are ready, but they still need to be signed.'],
    ['Confirm','To confirm…','Pour confirmer…','Use this to repeat the final agreed information.','To confirm, I will send the updated file before 3 pm.'],
    ['Confirm','Could you please confirm…?','Pourriez-vous confirmer… ?','Use this to request final verification.','Could you please confirm the new appointment time by email?']
  ];

  const listeningItems = [
    {title:'Training update',script:'Hi, this is Sarah from HR. Tomorrow’s training session has been moved from Wednesday at nine to Thursday at ten thirty. It will take place in room two fourteen. Please reply to my email before five today to confirm that you can attend.',questions:[['What changed?','The training moved to Thursday at 10:30',['The training was cancelled','The training moved to Thursday at 10:30','The training moved to Wednesday afternoon']],['Where?','Room 214',['Room 204','Room 214','Online']],['What action is required?','Reply by email before 5',['Call Sarah tomorrow','Bring an ID card','Reply by email before 5']]]},
    {title:'Supplier problem',script:'Good morning. We received the twelve boxes this morning, but two of them were damaged. Please send us photos of the damaged boxes and a copy of the invoice today. We can arrange replacements for Friday.',questions:[['What is the problem?','Two boxes are damaged',['Two boxes are missing','Two boxes are damaged','The invoice is incorrect']],['What must be sent?','Photos and the invoice',['Photos and the invoice','A new order form','A delivery schedule']],['When can replacements arrive?','Friday',['Today','Thursday','Friday']]]},
    {title:'Manager instruction',script:'Before you leave today, please update the sales spreadsheet with the figures from this morning. Send the final version to Daniel before four o’clock. If any figures are missing, highlight them in yellow so he can check them tomorrow.',questions:[['What must be updated?','The sales spreadsheet',['The customer database','The sales spreadsheet','The staff schedule']],['Who receives it?','Daniel',['Sarah','Daniel','The customer']],['What should happen to missing figures?','Highlight them',['Delete them','Estimate them','Highlight them']]]}
  ];

  const reformItems = [
    {title:'Change of appointment',message:'The supplier meeting scheduled for Tuesday at 11:00 has been moved to Wednesday at 14:30 because the manager is unavailable. Please inform the project team and ask them to confirm.',a2:'The supplier meeting is now on Wednesday at 2:30 pm because the manager is not available on Tuesday. Please confirm that you can attend.',b1:'I was asked to let you know that the supplier meeting has been rescheduled from Tuesday at 11:00 to Wednesday at 14:30 because the manager is unavailable. Please confirm that you can attend the new time.'},
    {title:'Customer request',message:'A customer received the wrong contract document. She needs the correct version today because she has an appointment tomorrow morning.',a2:'The customer received the wrong document. She needs the correct contract today because she has an appointment tomorrow.',b1:'The customer has received the wrong contract document and needs the correct version by the end of today because she has an appointment tomorrow morning. We should send the updated document as soon as possible.'},
    {title:'Simple procedure',message:'When a document is incomplete, check which information is missing, contact the person responsible, update the file and then confirm that the document is complete.',a2:'First, check what is missing. Then contact the person responsible. Update the file and confirm that the document is complete.',b1:'If a document is incomplete, first identify the missing information and contact the person responsible. Once you receive the details, update the file and confirm that the document is now complete.'}
  ];

  const microItems = [
    {title:'Explain your current role',prompt:'A recruiter asks: “Could you briefly explain what you do in your current job?”',points:['job / sector','2 responsibilities','one transferable skill'],a2:'I work in insurance. I manage company insurance contracts and check documents. I also communicate with customers. I am organised and careful.',b1:'I currently work in insurance, where I manage company contracts, check documentation and communicate with customers. This role has helped me become organised, reliable and attentive to detail.'},
    {title:'Handle a problem',prompt:'A customer says: “I received the wrong document and I need the correct one today. What can you do?”',points:['acknowledge','action','confirmation'],a2:'I understand the problem. I will check your file and send the correct document today. I will confirm by email when it is ready.',b1:'I understand that you need the correct document today. I’ll check your file immediately, arrange for the correct version to be sent, and confirm by email as soon as it has been processed.'},
    {title:'Transmit an instruction',prompt:'Your manager says: “Please tell the team to finish the spreadsheet before 4 pm and highlight any missing figures.”',points:['deadline','task','missing information'],a2:'The manager asked us to finish the spreadsheet before 4 pm. If figures are missing, we need to highlight them.',b1:'I was asked to let everyone know that the spreadsheet needs to be completed before 4 pm. If any figures are missing, please highlight them so they can be checked later.'},
    {title:'Compare two options',prompt:'Option A: morning shift, close to home, lower pay. Option B: evening shift, higher pay, 40-minute commute. Which would you choose and why?',points:['choice','2 reasons','contrast'],a2:'I would choose Option A because it is close to home and I prefer morning work. The pay is lower, but the schedule is better for me.',b1:'I would probably choose Option A because the morning schedule suits me better and the commute would be much easier. Although Option B pays more, the longer journey and evening hours would make it less practical for me.'}
  ];

  const gentleTasks = [
    {title:'Task 1 · Identify the action',html:'<p><strong>Situation:</strong> A colleague tells you that a client call has moved from 10:00 to 11:30 and asks you to update the calendar.</p><p>What is your main task?</p><select id="gentleSelect"><option value="">Choose…</option><option>Describe the client</option><option>Update and confirm information</option><option>Compare two clients</option></select>',check:()=>($('#gentleSelect')||{}).value==='Update and confirm information'},
    {title:'Task 2 · Write the essential message',html:'<p><strong>Message:</strong> The delivery will arrive on Friday instead of Thursday. The customer must be informed today.</p><p>Write a clear 2–3 sentence message.</p><textarea id="gentleWrite" placeholder="The delivery…"></textarea>',check:()=>{const t=($('#gentleWrite')||{}).value||'';return t.trim().split(/\s+/).length>=12}},
    {title:'Task 3 · Prepare an oral answer',html:'<p><strong>Prompt:</strong> Explain to a colleague what they need to do before sending an incomplete file.</p><div class="three-points"><span>check missing information</span> <span>contact the responsible person</span> <span>update + confirm</span></div><textarea id="gentleSpeak" placeholder="Write keywords only if you need them. Then answer orally."></textarea>',check:()=>true}
  ];

  function shuffle(arr){return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]);}
  function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800)}
  function selectedVoice(){
    const lang=$('#voiceAccent').value; const voices=speechSynthesis.getVoices();
    return voices.find(v=>v.lang===lang)||voices.find(v=>v.lang&&v.lang.startsWith(lang.split('-')[0]))||voices[0];
  }
  function speak(text){if(!('speechSynthesis' in window)){toast('Speech synthesis is not available in this browser.');return} speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=$('#voiceAccent').value;u.rate=parseFloat($('#voiceRate').value)||.92;const v=selectedVoice();if(v)u.voice=v;speechSynthesis.speak(u)}
  function updateVoiceStatus(){if(!('speechSynthesis' in window)){$('#voiceAvailability').textContent='Browser speech is not available.';return}const voices=speechSynthesis.getVoices();const lang=$('#voiceAccent').value;const v=voices.find(x=>x.lang===lang)||voices.find(x=>x.lang&&x.lang.startsWith(lang.split('-')[0]));$('#voiceAvailability').textContent=v?`Voice ready: ${v.name} (${v.lang})`:`No exact ${lang} voice found; your browser will use the closest English voice.`}

  function renderExamMap(){
    $('#examMap').innerHTML=examParts.map(p=>`<button type="button" class="exam-part" data-part="${p.n}"><span class="part-number">${p.n}</span><h3>${p.title}</h3><p>${p.job}</p><div class="part-help hidden"><strong>Your shortcut:</strong><br>${p.starter}</div></button>`).join('');
    $$('.exam-part').forEach(btn=>btn.addEventListener('click',()=>{btn.classList.toggle('active');$('.part-help',btn).classList.toggle('hidden')}));
  }

  function renderReflex(){
    state.reflexAnswered={}; const items=shuffle(reflexItems);
    $('#reflexQuiz').innerHTML=items.map((q,i)=>`<article class="quiz-card" data-reflex="${i}"><div class="scenario">${escapeHtml(q.scenario)}</div><div class="options">${shuffle(q.options).map(o=>`<label class="option"><input type="radio" name="reflex${i}" value="${escapeHtml(o)}"><span>${escapeHtml(o)}</span></label>`).join('')}</div><div class="feedback" aria-live="polite"></div></article>`).join('');
    items.forEach((q,i)=>{
      $$(`input[name="reflex${i}"]`).forEach(inp=>inp.addEventListener('change',()=>{
        const card=$(`[data-reflex="${i}"]`); $$('.option',card).forEach(x=>x.classList.remove('correct','incorrect'));
        const lab=inp.closest('.option'); const ok=inp.value===q.answer; lab.classList.add(ok?'correct':'incorrect');
        $('.feedback',card).className=`feedback ${ok?'good':'try'}`; $('.feedback',card).textContent=ok?`✓ Exactly. ${q.why}`:`Try again. Ask yourself: what action must you perform?`;
        state.reflexAnswered[i]=ok; updateReflexScore();
      }));
    });
    updateReflexScore(items.length);
  }
  function updateReflexScore(total=reflexItems.length){const correct=Object.values(state.reflexAnswered).filter(Boolean).length;$('#reflexScore').textContent=`${correct} / ${total}`}

  function renderVocab(){
    const categories=[...new Set(vocab.map(v=>v[0]))]; $('#vocabCategory').innerHTML='<option value="all">All categories</option>'+categories.map(c=>`<option>${escapeHtml(c)}</option>`).join('');
    drawVocab('all');
  }
  function drawVocab(cat){
    const rows=vocab.filter(v=>cat==='all'||v[0]===cat); $('#vocabGrid').innerHTML=rows.map((v,i)=>`<article class="vocab-card"><span class="category">${escapeHtml(v[0])}</span><h3>${escapeHtml(v[1])}</h3><dl><dt>French</dt><dd>${escapeHtml(v[2])}</dd><dt>Meaning</dt><dd>${escapeHtml(v[3])}</dd><dt>Example</dt><dd>${escapeHtml(v[4])}</dd></dl><div class="vocab-actions"><button class="listen-btn" type="button" data-vocab-speak="${i}">🔊 Listen</button></div></article>`).join('');
    $$('[data-vocab-speak]').forEach((b,i)=>b.addEventListener('click',()=>speak(rows[i][1]+' '+rows[i][4])));
  }

  function renderListening(){
    state.listeningAnswered={};
    $('#listeningGrid').innerHTML=listeningItems.map((item,idx)=>`<article class="listening-card" data-listen-card="${idx}"><span class="tag calm">MISSION ${idx+1}</span><h3>${escapeHtml(item.title)}</h3><p class="prompt">Listen for the situation, the key facts and the action.</p><div class="audio-actions"><button class="btn secondary small play-listening" data-listen="${idx}" type="button">▶ Play</button><button class="btn ghost-dark small transcript-btn" data-transcript="${idx}" type="button">Show transcript</button></div><div class="transcript hidden" id="transcript${idx}">${escapeHtml(item.script)}</div><div class="question-mini">${item.questions.map((q,qi)=>`<label>${escapeHtml(q[0])}<select data-lq="${idx}-${qi}"><option value="">Choose…</option>${shuffle(q[2]).map(o=>`<option>${escapeHtml(o)}</option>`).join('')}</select></label>`).join('')}</div><button class="btn primary small check-btn" type="button" data-check-listen="${idx}">Check key facts</button><div class="feedback" aria-live="polite"></div></article>`).join('');
    $$('.play-listening').forEach(b=>b.addEventListener('click',()=>speak(listeningItems[+b.dataset.listen].script)));
    $$('.transcript-btn').forEach(b=>b.addEventListener('click',()=>{const t=$(`#transcript${b.dataset.transcript}`);t.classList.toggle('hidden');b.textContent=t.classList.contains('hidden')?'Show transcript':'Hide transcript'}));
    $$('[data-check-listen]').forEach(b=>b.addEventListener('click',()=>{
      const idx=+b.dataset.checkListen,item=listeningItems[idx],card=$(`[data-listen-card="${idx}"]`); let ok=0;
      item.questions.forEach((q,qi)=>{const sel=$(`[data-lq="${idx}-${qi}"]`); if(sel.value===q[1]) ok++;});
      const pass=ok===item.questions.length; state.listeningAnswered[idx]=pass; const fb=$('.feedback',card);fb.className=`feedback ${pass?'good':'try'}`;fb.textContent=pass?`✓ You identified all the essential information.`:`You have ${ok}/${item.questions.length}. Listen again for only the missing detail.`;updateListeningScore();
    }));
    updateListeningScore();
  }
  function updateListeningScore(){const correct=Object.values(state.listeningAnswered).filter(Boolean).length;$('#listeningScore').textContent=`${correct} / ${listeningItems.length}`}

  function renderReformulation(){
    $('#reformulationGrid').innerHTML=reformItems.map((r,i)=>`<article class="reform-card"><span class="tag calm">REFORMULATION ${i+1}</span><h3>${escapeHtml(r.title)}</h3><div class="message-box">${escapeHtml(r.message)}</div><label>Your reformulation<textarea data-save-text id="reform${i}" placeholder="Start with the key message…"></textarea></label><div class="model-row"><button class="text-button reveal" data-target="modelA${i}" type="button">Show A2+/clear model</button><div class="model-answer hidden" id="modelA${i}">${escapeHtml(r.a2)}</div><button class="text-button reveal" data-target="modelB${i}" type="button">Show B1 target model</button><div class="model-answer hidden" id="modelB${i}">${escapeHtml(r.b1)}</div><button class="listen-btn" type="button" data-reform-speak="${i}">🔊 Listen to B1 model</button></div></article>`).join('');
    $$('[data-reform-speak]').forEach(b=>b.addEventListener('click',()=>speak(reformItems[+b.dataset.reformSpeak].b1)));
    bindReveals();
  }

  function renderMicro(){
    $('#microGrid').innerHTML=microItems.map((m,i)=>`<article class="micro-card"><span class="tag calm">MICRO-MISSION ${i+1}</span><h3>${escapeHtml(m.title)}</h3><div class="message-box">${escapeHtml(m.prompt)}</div><div class="three-points">${m.points.map(p=>`<span>${escapeHtml(p)}</span>`).join('')}</div><label>Optional notes<textarea data-save-text id="micro${i}" placeholder="Keywords are enough."></textarea></label><div class="model-row"><button class="text-button reveal" data-target="microA${i}" type="button">Show clear A2+ model</button><div class="model-answer hidden" id="microA${i}">${escapeHtml(m.a2)}</div><button class="text-button reveal" data-target="microB${i}" type="button">Show B1 target model</button><div class="model-answer hidden" id="microB${i}">${escapeHtml(m.b1)}</div><button class="listen-btn" type="button" data-micro-speak="${i}">🔊 Listen to B1 model</button></div></article>`).join('');
    $$('[data-micro-speak]').forEach(b=>b.addEventListener('click',()=>speak(microItems[+b.dataset.microSpeak].b1)));
    bindReveals();
  }

  function bindReveals(){$$('.reveal').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>{const t=$('#'+b.dataset.target);t.classList.toggle('hidden');b.textContent=t.classList.contains('hidden')?b.textContent.replace('Hide','Show'):b.textContent.replace('Show','Hide')})})}

  function renderGentle(){
    const task=gentleTasks[state.gentleIndex]; $('#timerTaskTitle').textContent=task.title; $('#timerTaskBody').innerHTML=task.html; state.gentleSeconds=60;$('#gentleClock').textContent='01:00';$('#timerMessage').className='feedback-box neutral';$('#timerMessage').textContent='The task matters more than the clock.'; stopGentle(false);
  }
  function startGentle(){stopGentle(false);state.gentleSeconds=60;updateGentleClock();$('#timerMessage').textContent='Focus on the task. Give the essential answer first.';state.gentleTimer=setInterval(()=>{state.gentleSeconds--;updateGentleClock();if(state.gentleSeconds<=0){stopGentle(false);$('#timerMessage').className='feedback-box done';$('#timerMessage').textContent='Time is up. Stop, accept what you produced, and move forward. That is the skill we are practising.'}},1000)}
  function stopGentle(show=true){if(state.gentleTimer){clearInterval(state.gentleTimer);state.gentleTimer=null}if(show){const ok=gentleTasks[state.gentleIndex].check();$('#timerMessage').className=`feedback-box ${ok?'done':'neutral'}`;$('#timerMessage').textContent=ok?'Good. You completed the essential task.':'You stopped the timer. That is fine—identify the task, then try one clear answer.'}}
  function updateGentleClock(){const s=Math.max(0,state.gentleSeconds);$('#gentleClock').textContent=`00:${String(s).padStart(2,'0')}`}

  async function startRecording(){
    if(!navigator.mediaDevices||!window.MediaRecorder){$('#recordingStatus').textContent='Recording is not available in this browser. You can still practise aloud.';return}
    try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});state.chunks=[];state.recorder=new MediaRecorder(stream);state.recorder.ondataavailable=e=>{if(e.data.size)state.chunks.push(e.data)};state.recorder.onstop=()=>{const blob=new Blob(state.chunks,{type:state.recorder.mimeType||'audio/webm'});const url=URL.createObjectURL(blob);$('#recordingPlayback').src=url;$('#recordingPlayback').classList.remove('hidden');$('#recordingDownload').href=url;$('#recordingDownload').classList.remove('hidden');state.recorder.stream.getTracks().forEach(t=>t.stop());$('#recordingStatus').textContent='Recording ready. Listen once for clarity and task completion.'};state.recorder.start();$('#startRecording').disabled=true;$('#stopRecording').disabled=false;$('#recordingStatus').textContent='Recording… Speak naturally.'}catch(e){$('#recordingStatus').textContent='Microphone access was not available. You can still practise aloud without recording.'}
  }
  function stopRecording(){if(state.recorder&&state.recorder.state!=='inactive')state.recorder.stop();$('#startRecording').disabled=false;$('#stopRecording').disabled=true}

  function collectProgress(){
    const texts={};$$('[data-save-text]').forEach(e=>texts[e.id]=e.value);const checks={};$$('[data-save-check]').forEach(e=>checks[e.dataset.saveCheck]=e.checked);
    return {texts,checks,confidenceStart:$('#confidenceStart').value,confidenceEnd:$('#confidenceEnd').value,usefulness:$('#usefulness').value,pace:$('#pace').value,strategyNote:$('#strategyNote').value,tomorrowNote:$('#tomorrowNote').value,examSentence:$('#examSentence').value};
  }
  function saveProgress(silent=false){localStorage.setItem(STORAGE_KEY,JSON.stringify(collectProgress()));if(!silent)toast('Lesson progress saved.')}
  function loadProgress(){try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(!d)return;Object.entries(d.texts||{}).forEach(([id,v])=>{const e=$('#'+id);if(e)e.value=v});Object.entries(d.checks||{}).forEach(([id,v])=>{const e=$(`[data-save-check="${id}"]`);if(e)e.checked=v});['confidenceStart','confidenceEnd','usefulness','pace','strategyNote','tomorrowNote','examSentence'].forEach(k=>{if(d[k]!=null&&$('#'+k))$('#'+k).value=d[k]});updateRanges();toast('Saved work restored.')}catch(e){}}
  function resetAll(){if(!confirm('Reset all saved work for this lesson?'))return;localStorage.removeItem(STORAGE_KEY);location.reload()}
  function downloadSummary(){
    const d=collectProgress();const lines=['LILATE IA CONFIDENCE LAB — LESSON SUMMARY','',`Confidence at start: ${d.confidenceStart}/5`,`Confidence at end: ${d.confidenceEnd}/5`,`Usefulness: ${d.usefulness}`,`Pace: ${d.pace}`,'',`Exam-day sentence: ${d.examSentence||'Not entered'}`,'',`Strategy to reuse: ${d.strategyNote||'Not entered'}`,'',`Tomorrow priority: ${d.tomorrowNote||'Not entered'}`,'','Core process: Situation → Task → Essential answer → Move on.'];const blob=new Blob([lines.join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lilate-ia-confidence-summary.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
  }
  function updateRanges(){$('#confidenceStartOut').textContent=`${$('#confidenceStart').value} / 5`;$('#confidenceEndOut').textContent=`${$('#confidenceEnd').value} / 5`}

  function bind(){
    $('#translationToggle').addEventListener('change',e=>document.body.classList.toggle('show-fr',e.target.checked));
    $('#voiceAccent').addEventListener('change',updateVoiceStatus);$('#voiceRate').addEventListener('change',updateVoiceStatus);
    $('#saveBtn').addEventListener('click',()=>saveProgress());$('#resetBtn').addEventListener('click',resetAll);$('#printBtn').addEventListener('click',()=>window.print());
    $$('.evidence-card').forEach(b=>b.addEventListener('click',()=>{$$('.evidence-card').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#evidenceMessage').textContent=evidence[b.dataset.evidence]}));
    $('#resetReflex').addEventListener('click',renderReflex);$('#vocabCategory').addEventListener('change',e=>drawVocab(e.target.value));$('#listenCategory').addEventListener('click',()=>{const cat=$('#vocabCategory').value;const rows=vocab.filter(v=>cat==='all'||v[0]===cat);speak(rows.map(r=>`${r[1]} ${r[4]}`).join(' '))});
    $('#resetListening').addEventListener('click',renderListening);$('#startRecording').addEventListener('click',startRecording);$('#stopRecording').addEventListener('click',stopRecording);
    $('#startGentleTimer').addEventListener('click',startGentle);$('#stopGentleTimer').addEventListener('click',()=>stopGentle(true));$('#nextGentleTask').addEventListener('click',()=>{stopGentle(false);state.gentleIndex=(state.gentleIndex+1)%gentleTasks.length;renderGentle()});
    $('#confidenceStart').addEventListener('input',updateRanges);$('#confidenceEnd').addEventListener('input',updateRanges);
    $('[data-speak-target="examSentence"]').addEventListener('click',()=>speak($('#examSentence').value||'I do not need perfect English. I need to understand the task and communicate clearly.'));
    $('#downloadSummary').addEventListener('click',downloadSummary);$('#saveEvaluation').addEventListener('click',()=>saveProgress());
    window.addEventListener('beforeunload',()=>saveProgress(true));
  }

  function init(){
    document.body.classList.toggle('show-fr',$('#translationToggle').checked);renderExamMap();renderReflex();renderVocab();renderListening();renderReformulation();renderMicro();renderGentle();bindReveals();bind();updateRanges();updateVoiceStatus();if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=updateVoiceStatus;setTimeout(updateVoiceStatus,400);loadProgress();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
