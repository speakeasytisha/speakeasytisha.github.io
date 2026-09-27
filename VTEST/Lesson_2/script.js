const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const state={mode:localStorage.getItem('vtestL2Mode')||'coach',sections:new Set(JSON.parse(localStorage.getItem('vtestL2Sections')||'[]')),guided:{},simAnswers:{},simIndex:0,simSubmitted:false,simPlayed:{}};
let appReady=false;
const save=()=>{localStorage.setItem('vtestL2Mode',state.mode);localStorage.setItem('vtestL2Sections',JSON.stringify([...state.sections]));localStorage.setItem('vtestL2Guided',JSON.stringify(state.guided));localStorage.setItem('vtestL2Sim',JSON.stringify(state.simAnswers));};
try{state.guided=JSON.parse(localStorage.getItem('vtestL2Guided')||'{}');state.simAnswers=JSON.parse(localStorage.getItem('vtestL2Sim')||'{}')}catch(e){}

// Basic interface
function setMode(mode){state.mode=mode;document.body.classList.toggle('exam-mode',mode==='exam');$$('.mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));save();if(appReady){renderAllGuided();renderSim();}}
$$('.mode-btn').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));setMode(state.mode);
$('#fontToggle').addEventListener('click',e=>{document.body.classList.toggle('large-text');e.currentTarget.setAttribute('aria-pressed',document.body.classList.contains('large-text'))});
$('#contrastToggle').addEventListener('click',e=>{document.body.classList.toggle('high-contrast');e.currentTarget.setAttribute('aria-pressed',document.body.classList.contains('high-contrast'))});
$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
$$('.fr-toggle').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.target)?.classList.toggle('hidden')));

// Progress tracking
const sectionIds=['briefing','preview','gist','detail','inference','dialogue','adaptive','simulation','language','report'];
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const id=e.target.dataset.sectionId;if(id){state.sections.add(id);save();updateProgress();$$('#lessonNav a').forEach(a=>a.classList.toggle('active',a.dataset.section===id));}}}),{threshold:.23});
$$('[data-section-id]').forEach(s=>observer.observe(s));
function updateProgress(){const n=sectionIds.filter(x=>state.sections.has(x)).length,p=Math.round(n/sectionIds.length*100);$('#progressFill').style.width=p+'%';$('#progressText').textContent=`${p}% explored`;}
updateProgress();

// 30-sec preview timer
let previewInterval=null;
$('#startPreview').addEventListener('click',()=>{clearInterval(previewInterval);let t=30;$('#previewTimer').textContent='00:30';$('#previewMini').textContent='30';previewInterval=setInterval(()=>{t--;$('#previewTimer').textContent='00:'+String(t).padStart(2,'0');$('#previewMini').textContent=t;if(t<=5)$('#previewMini').classList.add('timer-warning');if(t<=0){clearInterval(previewInterval);$('#previewMini').classList.remove('timer-warning');}},1000)});

// Speech
let speaking=false;
function speak(text,button,{once=false,onEnd=null}={}){
  if(!('speechSynthesis'in window)){alert('Audio playback is not supported in this browser.');return;}
  if(speaking){speechSynthesis.cancel();speaking=false;}
  const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';u.rate=.94;u.pitch=1;
  u.onstart=()=>{speaking=true;if(button){button.disabled=true;button.dataset.old=button.textContent;button.textContent='PLAYING…';}};
  u.onend=()=>{speaking=false;if(button){if(!(once&&state.mode==='exam'))button.disabled=false;button.textContent=button.dataset.old||'▶ PLAY AUDIO';}if(onEnd)onEnd();};
  u.onerror=()=>{speaking=false;if(button){button.disabled=false;button.textContent=button.dataset.old||'▶ PLAY AUDIO';}};
  speechSynthesis.speak(u);
}

const guidedSets={
 gist:[{
  id:'g1',level:'A2–B1',title:'Main idea · One speaker',audio:'Good morning everyone. Before we start today’s sales meeting, I need to let you know that the product demonstration has been moved to Thursday afternoon because the supplier cannot deliver the new samples until Wednesday. The rest of today’s meeting will continue as planned.',
  questions:[
   {q:'Why is the speaker addressing the team?',opts:['To cancel today’s meeting','To announce a change to a demonstration','To introduce a new supplier'],a:1,hint:'Focus on the purpose of the whole message, not one detail.',why:'The speaker’s main purpose is to announce that the product demonstration has been moved.',models:{a2:'The answer is B because the speaker says the demonstration has been moved.',b2:'The speaker is primarily announcing a scheduling change caused by a delayed sample delivery; the rest of the meeting is unchanged.'}},
   {q:'What caused the change?',opts:['A supplier delivery issue','A problem with the sales team','A room reservation problem'],a:0,hint:'Listen for the word “because”.',why:'The supplier cannot deliver the new samples until Wednesday.',models:{a2:'The supplier is late, so the demonstration must change.',b2:'The change is prompted by the supplier’s inability to provide the samples before Wednesday.'}}
  ]
 }],
 detail:[{
  id:'d1',level:'A2–B1',title:'Correction · Time and action',audio:'Hi Marta, just a quick update about tomorrow’s client call. We originally planned to start at nine, but the client has asked us to begin at nine thirty instead. Please send the revised figures before nine fifteen so I can check them before we connect.',
  questions:[
   {q:'What time will the client call start?',opts:['9:00','9:15','9:30'],a:2,hint:'The first time is the old plan. Listen for “but” and “instead”.',why:'9:00 was the original plan; the final start time is 9:30.',models:{a2:'The call starts at 9:30. Nine o’clock was the old time.',b2:'The speaker corrects the initial schedule: the meeting was planned for 9:00 but has been rescheduled to 9:30.'}},
   {q:'What must Marta do before 9:15?',opts:['Call the client','Send the revised figures','Check the figures herself'],a:1,hint:'Separate the action from the reason for the action.',why:'Marta must send the revised figures; the speaker will check them.',models:{a2:'Marta needs to send the figures before 9:15.',b2:'Marta’s task is to forward the revised figures by 9:15 so the speaker has time to review them.'}}
  ]
 }],
 inference:[{
  id:'i1',level:'B1–B2',title:'Purpose · Indirect meaning',audio:'I appreciate the work you have put into the proposal. The overall direction is strong, but I think the cost section needs another look before we send it to the board. If we can explain the additional staffing expense more clearly, I will be comfortable putting it forward on Friday.',
  questions:[
   {q:'What does the speaker want the listener to do?',opts:['Rewrite the whole proposal','Clarify one part of the proposal','Send the proposal immediately'],a:1,hint:'What is strong already? What still “needs another look”?',why:'The overall proposal is strong; only the cost section and staffing expense need clearer explanation.',models:{a2:'The speaker wants more information about the cost section.',b2:'The speaker is broadly satisfied but wants the staffing-cost justification strengthened before the proposal goes to the board.'}},
   {q:'How does the speaker feel about the proposal overall?',opts:['Mostly positive but not ready to approve it yet','Completely dissatisfied','Uninterested in the proposal'],a:0,hint:'Notice the contrast between “strong” and “but”.',why:'The language is positive overall, with one condition before approval.',models:{a2:'The speaker likes the proposal but wants one change first.',b2:'The response is cautiously positive: approval is likely once the cost rationale is improved.'}}
  ]
 }],
 dialogue:[{
  id:'c1',level:'B1–B2',title:'Two speakers · Final decision',audio:'Woman: We could move the training workshop to the conference room on the third floor. It is bigger and the projector is already installed. Man: I checked it this morning, but Finance has booked it all day. What about the smaller room next to reception? Woman: That could work if we divide the participants into two groups. Man: Good idea. I’ll reserve it now and send everyone the updated schedule.',
  questions:[
   {q:'Why can’t they use the conference room?',opts:['The projector is broken','It has already been booked','It is too small'],a:1,hint:'The woman suggests it; the man gives the obstacle.',why:'Finance has booked the conference room all day.',models:{a2:'They cannot use it because Finance booked it.',b2:'Although the conference room would be suitable, it is unavailable because Finance has reserved it for the entire day.'}},
   {q:'What will the man probably do next?',opts:['Cancel the workshop','Reserve the smaller room and update participants','Ask Finance to move its meeting'],a:1,hint:'The final sentence usually tells you the next action.',why:'He says he will reserve the smaller room and send the updated schedule.',models:{a2:'He will book the smaller room and tell everyone.',b2:'The agreed solution is to use the smaller room in two groups; the man will secure it and communicate the revised schedule.'}}
  ]
 }],
 adaptive:[{
  id:'a1',level:'B2–C1',title:'Inference · Recommendation',audio:'We have reviewed the first quarter figures, and the decline in renewals is smaller than we feared. That said, the improvement is concentrated in two regions, while the corporate segment continues to underperform. I would hesitate to expand the discount programme nationally until we know whether those regional gains are sustainable. My preference would be to run it for another quarter in the current markets, then reassess.',
  questions:[
   {q:'What does the speaker recommend?',opts:['Ending the discount programme now','Expanding it nationally immediately','Continuing it in current markets before deciding'],a:2,hint:'Listen for the speaker’s “preference”.',why:'The speaker wants one more quarter in current markets before reassessing national expansion.',models:{a2:'The speaker wants to continue in the same markets for one more quarter.',b2:'The recommendation is deliberately cautious: maintain the existing regional pilot, gather another quarter of evidence, and only then reconsider national expansion.'}},
   {q:'Why is the speaker cautious?',opts:['All regions are performing badly','The positive results may not yet be reliable enough','The programme is too expensive to continue'],a:1,hint:'What does “sustainable” mean here?',why:'Improvement is limited to two regions, so the speaker wants evidence that the gains will last.',models:{a2:'Only two regions improved, so the speaker wants more proof.',b2:'Because the gains are geographically concentrated, the speaker questions whether the improvement is durable and representative enough to justify scaling.'}}
  ]
 }]
};

function guidedCard(item){
 const wrap=document.createElement('article');wrap.className='listen-card';wrap.innerHTML=`<div class="listen-card-head"><strong>${item.title}</strong><span class="level-pill">${item.level}</span></div><div class="listen-card-body"><div class="audio-console"><div class="audio-meta"><span>WORKPLACE RECORDING</span><strong>Listen for the answer — not every word.</strong><div class="audio-state" id="${item.id}State">Ready</div></div><div class="audio-controls"><button class="play-btn" data-play="${item.id}" type="button">▶ PLAY AUDIO</button><button class="secondary audio-replay coach-support" data-replay="${item.id}" type="button">↻ REPLAY</button></div></div><div id="${item.id}Qs"></div><div class="support-row coach-support"><button class="hint-btn coach-transcript" data-transcript="${item.id}" type="button">TRANSCRIPT</button></div><div class="support-panel coach-transcript hidden" id="${item.id}Transcript">${item.audio}</div></div>`;
 const qbox=$(`#${item.id}Qs`,wrap);
 item.questions.forEach((q,qi)=>{
  const id=`${item.id}_${qi}`;const qc=document.createElement('div');qc.className='q-card';qc.innerHTML=`<h4>${qi+1}. ${q.q}</h4><div class="qOpts"></div><div class="support-row coach-support"><button class="hint-btn" data-hint="${id}" type="button">HINT</button><button class="hint-btn" data-model="${id}" type="button">2-LEVEL MODEL</button></div><div class="hint coach-support hidden" id="hint_${id}">${q.hint}</div><div class="model-panel coach-model hidden" id="model_${id}"><div class="model-tabs"><button class="model-tab active" data-model-level="a2" data-qid="${id}">A2–B1</button><button class="model-tab" data-model-level="b2" data-qid="${id}">B2–C1</button></div><p id="modeltext_${id}">${q.models.a2}</p></div><div class="why-box coach-feedback hidden" id="why_${id}"></div>`;
  const optbox=$('.qOpts',qc);q.opts.forEach((o,oi)=>{const b=document.createElement('button');b.className='option-btn';b.type='button';b.textContent=`${String.fromCharCode(65+oi)} · ${o}`;b.dataset.guided=id;b.dataset.choice=oi;b.addEventListener('click',()=>answerGuided(item,q,qi,oi,qc));optbox.appendChild(b)});qbox.appendChild(qc);
 });
 return wrap;
}
function answerGuided(item,q,qi,choice,qc){const id=`${item.id}_${qi}`;state.guided[id]=choice;save();$$('.option-btn',qc).forEach((b,i)=>{b.classList.toggle('selected',i===choice);b.classList.remove('correct-choice','wrong-choice')});if(state.mode==='coach'){const ok=choice===q.a;const chosen=$$('.option-btn',qc)[choice];chosen.classList.add(ok?'correct-choice':'wrong-choice');if(!ok)$$('.option-btn',qc)[q.a].classList.add('correct-choice');const why=$(`#why_${id}`,qc);why.classList.remove('hidden');why.innerHTML=`<strong>${ok?'Correct ✓':'Not quite.'}</strong> ${q.why}`;}}
function renderAllGuided(){Object.entries(guidedSets).forEach(([set,items])=>{const target=$('#guided'+set[0].toUpperCase()+set.slice(1));if(!target)return;target.innerHTML='';items.forEach(i=>target.appendChild(guidedCard(i)));});bindGuided();}
function bindGuided(){
 $$('[data-play]').forEach(b=>b.addEventListener('click',()=>{const item=findGuided(b.dataset.play);$(`#${item.id}State`).textContent='Playing…';speak(item.audio,b,{once:true,onEnd:()=>{$(`#${item.id}State`).textContent=state.mode==='exam'?'Audio used':'Finished'}})}));
 $$('[data-replay]').forEach(b=>b.addEventListener('click',()=>{const item=findGuided(b.dataset.replay);speak(item.audio,b)}));
 $$('[data-transcript]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.transcript+'Transcript').classList.toggle('hidden')));
 $$('[data-hint]').forEach(b=>b.addEventListener('click',()=>document.getElementById('hint_'+b.dataset.hint).classList.toggle('hidden')));
 $$('[data-model]').forEach(b=>b.addEventListener('click',()=>document.getElementById('model_'+b.dataset.model).classList.toggle('hidden')));
 $$('[data-model-level]').forEach(b=>b.addEventListener('click',()=>{const [itemId,qi]=b.dataset.qid.split('_');const item=findGuided(itemId),q=item.questions[Number(qi)];$$(`[data-qid="${b.dataset.qid}"]`).forEach(x=>x.classList.toggle('active',x===b));$(`#modeltext_${b.dataset.qid}`).textContent=q.models[b.dataset.modelLevel];}));
 // restore selections after rebuild
 Object.entries(state.guided).forEach(([id,ch])=>{const btn=$(`[data-guided="${id}"][data-choice="${ch}"]`);if(btn)btn.click();});
}
function findGuided(id){for(const set of Object.values(guidedSets))for(const item of set)if(item.id===id)return item;}
renderAllGuided();

// Adaptive meter reacts to guided adaptive selection
const oldAnswerGuided=answerGuided; // leave dot visual simple via click delegation
document.addEventListener('click',e=>{if(e.target.matches('[data-guided^="a1_"]')){const ch=Number(e.target.dataset.choice);$('#levelDot').style.left=ch===2?'75%':ch===1?'51%':'27%';}});

// Simulation: 8 recordings / 14 questions
const sim=[
 {title:'Team update',level:'A2',audio:'Good morning. The monthly team meeting will take place in Room 204 today, not in the main conference room. It will still begin at ten o’clock.',qs:[{q:'Where will the meeting take place?',o:['Main conference room','Room 204','Online'],a:1,type:'detail'},{q:'What time will it start?',o:['9:30','10:00','10:30'],a:1,type:'detail'}]},
 {title:'Telephone message',level:'A2–B1',audio:'Hello, this is Daniel from Greenway Logistics. I am calling about invoice 4582. We received the invoice yesterday, but the purchase order number is missing. Could you send a corrected copy this afternoon?',qs:[{q:'Why is Daniel calling?',o:['To question the price','To request a corrected invoice','To confirm a delivery'],a:1,type:'purpose'},{q:'What information is missing?',o:['The purchase order number','The delivery date','The company address'],a:0,type:'detail'}]},
 {title:'Manager announcement',level:'B1',audio:'From next month, employees may work from home on Wednesdays. However, each team must make sure at least two people remain in the office to handle deliveries and visitors. Team leaders will coordinate the schedule.',qs:[{q:'What new policy is being introduced?',o:['A four-day week','Wednesday remote work','Flexible starting times'],a:1,type:'gist'},{q:'What must each team ensure?',o:['Everyone works from home','Two people remain in the office','Visitors book appointments'],a:1,type:'detail'}]},
 {title:'Client conversation',level:'B1',audio:'Woman: We are happy with the design, but we need the final files by Tuesday rather than Thursday. Man: Tuesday is possible if we receive your written approval by noon tomorrow. Woman: I can do that. I’ll send it before lunch.',qs:[{q:'What does the client want?',o:['A different design','Earlier delivery of the final files','A lower price'],a:1,type:'purpose'},{q:'What must happen first?',o:['The client must send written approval','The designer must call the client','The client must pay the invoice'],a:0,type:'sequence'}]},
 {title:'Project update',level:'B1–B2',audio:'The pilot launch produced fewer registrations than forecast, but customer feedback was stronger than expected. Rather than increase advertising immediately, we are going to interview recent users to understand which features they value most. We will decide on the next campaign after that research.',qs:[{q:'What will the company do next?',o:['Increase advertising immediately','Interview recent users','Cancel the product'],a:1,type:'next action'},{q:'Why are they doing this?',o:['To understand customer priorities','To reduce the product price','To replace the marketing team'],a:0,type:'inference'}]},
 {title:'Performance discussion',level:'B2',audio:'Your client retention figures have improved considerably, and the new reporting process is working well. The area I would like you to focus on next quarter is delegation. You are still taking on too many operational tasks yourself, which leaves less time for strategic planning.',qs:[{q:'What is the main development point?',o:['Client retention','Reporting accuracy','Delegation'],a:2,type:'purpose'},{q:'What consequence does the current behaviour have?',o:['Less time for strategic planning','Lower client satisfaction','More reporting errors'],a:0,type:'cause/effect'}]},
 {title:'Budget meeting',level:'B2',audio:'Man: If we approve the software upgrade now, we will exceed the technology budget by about eight percent. Woman: True, but delaying until January would create additional maintenance costs. Man: In that case, let’s ask Finance whether we can move part of next quarter’s budget forward. Woman: Agreed. I’ll contact them today.',qs:[{q:'What solution do they decide to explore?',o:['Cancel the upgrade','Use part of a future budget earlier','Wait until January'],a:1,type:'decision'}]},
 {title:'Strategic recommendation',level:'B2–C1',audio:'The survey suggests that hybrid working remains popular, but the figures need careful interpretation. Employees with long commutes report significantly higher satisfaction, whereas colleagues living close to the office show almost no change. Before we reduce office capacity, I recommend analysing attendance patterns by role as well as by location. A single company-wide figure may be hiding important differences.',qs:[{q:'Why does the speaker recommend further analysis?',o:['The survey included too few employees','The overall result may hide differences between groups','Employees no longer support hybrid work'],a:1,type:'inference'}]}
];
let phaseInt=null;
function countdownPhase(sec,label,onDone){clearInterval(phaseInt);let t=sec;$('#phaseTimer').textContent='00:'+String(t).padStart(2,'0');$('#simClock').textContent=label;phaseInt=setInterval(()=>{t--;$('#phaseTimer').textContent='00:'+String(t).padStart(2,'0');if(t<=0){clearInterval(phaseInt);if(onDone)onDone();}},1000)}
function renderSim(){
 const item=sim[state.simIndex];$('#simCounter').textContent=`Recording ${state.simIndex+1} / ${sim.length} · ${item.level}`;$('#simProgress').style.width=((state.simIndex)/sim.length*100)+'%';$('#simPrev').disabled=state.simIndex===0||state.simSubmitted;
 if(state.simSubmitted){renderSimReport();return;}
 const played=!!state.simPlayed[state.simIndex];
 $('#simStage').innerHTML=`<div class="official-instruction">Now click ▶ and answer the question${item.qs.length>1?'s':''}. Click NEXT when you have finished.</div><div class="official-listening-grid"><div class="sim-question" id="simQs"></div><aside class="sim-audio"><h3>Play Audio</h3><button class="official-play" id="simPlay" type="button" aria-label="Play audio" ${state.mode==='exam'&&played?'disabled':''}>▶</button><div class="plays-left" id="playsLeft">Number of plays left: ${state.mode==='exam'?(played?0:1):'practice'}</div><div class="audio-state" id="simAudioState">${played&&state.mode==='exam'?'Audio already used':'Preview the questions before playing.'}</div></aside></div>`;
 const qbox=$('#simQs');item.qs.forEach((q,qi)=>{const key=`${state.simIndex}_${qi}`;const div=document.createElement('div');div.className='q-card';div.innerHTML=`<h3>${qi+1}. ${q.q}</h3>`;q.o.forEach((opt,oi)=>{const b=document.createElement('button');b.className='option-btn';b.type='button';b.textContent=`${String.fromCharCode(65+oi)} · ${opt}`;if(Number(state.simAnswers[key])===oi)b.classList.add('selected');b.addEventListener('click',()=>{state.simAnswers[key]=oi;save();$$('.option-btn',div).forEach((x,j)=>x.classList.toggle('selected',j===oi));});div.appendChild(b)});qbox.appendChild(div)});
 $('#simPlay').addEventListener('click',()=>{state.simPlayed[state.simIndex]=true;if($('#playsLeft'))$('#playsLeft').textContent=`Number of plays left: ${state.mode==='exam'?0:'practice'}`;$('#simAudioState').textContent='Playing…';speak(item.audio,$('#simPlay'),{once:true,onEnd:()=>{$('#simAudioState').textContent='Audio finished · answer now';countdownPhase(30,'ANSWER')}})});countdownPhase(30,'PREVIEW');
 $('#simNext').textContent=state.simIndex===sim.length-1?'SUBMIT LISTENING':'NEXT';
}
$('#simPrev').addEventListener('click',()=>{if(state.simIndex>0){state.simIndex--;renderSim()}});
$('#simNext').addEventListener('click',()=>{if(state.simSubmitted)return;const item=sim[state.simIndex];const missing=item.qs.some((q,qi)=>state.simAnswers[`${state.simIndex}_${qi}`]===undefined);if(missing&&state.mode==='exam'&&!confirm('You have not answered every question. Do you want to continue?'))return;if(state.simIndex<sim.length-1){state.simIndex++;renderSim()}else{state.simSubmitted=true;clearInterval(phaseInt);renderSimReport();}});
function simStats(){let total=0,correct=0,by={};sim.forEach((item,ri)=>item.qs.forEach((q,qi)=>{total++;const k=`${ri}_${qi}`,ok=Number(state.simAnswers[k])===q.a;if(ok)correct++;by[q.type]??={c:0,t:0};by[q.type].t++;if(ok)by[q.type].c++;}));return{total,correct,by,percent:Math.round(correct/total*100)}}
function renderSimReport(){const st=simStats();$('#simProgress').style.width='100%';$('#simCounter').textContent='Listening simulation complete';$('#phaseTimer').textContent='DONE';$('#simClock').textContent='REVIEW';$('#simNext').disabled=true;$('#simPrev').disabled=true;$('#simStage').innerHTML=`<div class="sim-report"><span class="step-label">SIMULATION RESULT</span><h2>${st.correct} / ${st.total} correct</h2><p>This is a training score, not a VTest CEFR result. Review the question families below, then repeat in Exam-feel Mode on another day.</p><div class="report-grid"><div class="report-card"><span>CORRECT</span><strong>${st.correct}</strong></div><div class="report-card"><span>TOTAL</span><strong>${st.total}</strong></div><div class="report-card"><span>ACCURACY</span><strong>${st.percent}%</strong></div><div class="report-card"><span>RECORDINGS</span><strong>8</strong></div></div><div class="review-list" id="simReview"></div></div>`;
 const rev=$('#simReview');sim.forEach((item,ri)=>item.qs.forEach((q,qi)=>{const k=`${ri}_${qi}`,chosen=Number(state.simAnswers[k]),ok=chosen===q.a;const d=document.createElement('div');d.className='review-item '+(ok?'ok':'no');d.innerHTML=`<strong>Recording ${ri+1} · Q${qi+1} · ${q.type}</strong><br>${ok?'✓ Correct':'✗ Review'} — answer: ${String.fromCharCode(65+q.a)} · ${q.o[q.a]}`;rev.appendChild(d)}));
 updateFinish(st);
}
function updateFinish(st){$('#finalScore').textContent=`${st.correct}/${st.total}`;$('#finalPercent').textContent=`${st.percent}% TRAINING ACCURACY`;let title,text;if(st.percent>=85){title='Strong control of this listening set.';text='Move forward, but repeat the hardest B2/C1 items without support to protect your consistency.'}else if(st.percent>=65){title='Good foundation. Now target the traps.';text='Review corrections, inference and two-speaker decisions before repeating the simulator.'}else{title='Repeat the guided route before another exam run.';text='Return to previewing, main idea, detail changes and final decisions. Accuracy should come before speed.'}$('#finishTitle').textContent=title;$('#finishText').textContent=text;const list=$('#reviewList');list.innerHTML='';Object.entries(st.by).sort((a,b)=>(a[1].c/a[1].t)-(b[1].c/b[1].t)).forEach(([type,v])=>{const d=document.createElement('div');d.className='review-item '+(v.c===v.t?'ok':'no');d.innerHTML=`<strong>${type.toUpperCase()}</strong> · ${v.c}/${v.t} correct`;list.appendChild(d)});}
renderSim();

// Oral transfer recorder
let recorder=null,chunks=[],recInt=null;
$('#recordBtn').addEventListener('click',async()=>{if(!navigator.mediaDevices?.getUserMedia){alert('Microphone recording is not supported in this browser.');return;}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType});$('#recordPlayback').src=URL.createObjectURL(blob);$('#recordPlayback').classList.remove('hidden');stream.getTracks().forEach(t=>t.stop())};recorder.start();$('#recordBtn').disabled=true;$('#stopBtn').disabled=false;let t=45;$('#recordTimer').textContent='00:45';recInt=setInterval(()=>{t--;$('#recordTimer').textContent='00:'+String(t).padStart(2,'0');if(t<=0)stopRecording();},1000)}catch(e){alert('Microphone permission was not granted. You can still practise aloud.')}});
$('#stopBtn').addEventListener('click',stopRecording);function stopRecording(){if(recorder?.state==='recording')recorder.stop();clearInterval(recInt);$('#recordBtn').disabled=false;$('#stopBtn').disabled=true;}
const transferModels={a2:'The speakers are discussing a delivery problem. The order will arrive late because of a transport delay. They decide to inform the client and send a new delivery time.',b2:'The conversation concerns a delayed delivery caused by a transport disruption. After identifying the impact on the client, the speakers agree to communicate proactively and provide a revised delivery estimate.'};
$$('[data-transfer-level]').forEach(b=>b.addEventListener('click',()=>{$$('[data-transfer-level]').forEach(x=>x.classList.toggle('active',x===b));$('#transferModel').textContent=transferModels[b.dataset.transferLevel]}));

// Vocabulary
const vocab={
 changes:[['↺','reschedule','reprogrammer','We need to reschedule the review for Friday.'],['→','postpone','reporter','The launch has been postponed until next month.'],['≠','instead','à la place','We will meet online instead.'],['✓','final','définitif','The final deadline is Tuesday.']],
 purpose:[['?','request','demande / demander','The client called to request a revised quotation.'],['!','announce','annoncer','The manager announced a change in policy.'],['↗','recommend','recommander','She recommends extending the pilot.'],['i','clarify','clarifier','Could you clarify the staffing cost?']],
 contrast:[['↔','however','cependant','Sales increased; however, margins fell.'],['△','although','bien que','Although demand is strong, supply is limited.'],['⚑','that said','cela dit','The plan is promising. That said, we need more evidence.'],['⇄','rather than','plutôt que','Rather than expand now, we will test again.']],
 signals:[['★','actually','en fait','Actually, the meeting starts at 9:30.'],['⌁','in that case','dans ce cas','In that case, I will contact Finance.'],['→','as a result','par conséquent','The supplier was late; as a result, the demo moved.'],['✓','agreed','d’accord / convenu','Agreed. I will send the schedule today.']]
};
function renderVocab(cat){$('#vocabGrid').innerHTML='';vocab[cat].forEach(v=>{const d=document.createElement('div');d.className='vocab-card';d.innerHTML=`<div class="vocab-card-head"><div><h4>${v[0]} ${v[1]}</h4><span class="fr">${v[2]}</span></div><button class="audio-mini" type="button">▶ AUDIO</button></div><p>${v[3]}</p>`;$('.audio-mini',d).addEventListener('click',e=>speak(`${v[1]}. ${v[3]}`,e.currentTarget));$('#vocabGrid').appendChild(d)});}
Object.keys(vocab).forEach((cat,i)=>{const b=document.createElement('button');b.type='button';b.textContent=cat.toUpperCase();b.classList.toggle('active',i===0);b.addEventListener('click',()=>{$$('#vocabTabs button').forEach(x=>x.classList.toggle('active',x===b));renderVocab(cat)});$('#vocabTabs').appendChild(b)});renderVocab(Object.keys(vocab)[0]);

appReady=true;
setMode(state.mode);

// Export / print / reset
$('#downloadResults').addEventListener('click',()=>{const st=simStats();const lines=['VTEST BUSINESS ENGLISH · LESSON 2 · LISTENING','',`Mode: ${state.mode}`,`Simulation: ${st.correct}/${st.total} (${st.percent}%)`,'', 'Question-family breakdown:'];Object.entries(st.by).forEach(([k,v])=>lines.push(`- ${k}: ${v.c}/${v.t}`));lines.push('','Strategy reminders:','- Preview the questions before audio starts.','- Listen for the final corrected detail.','- Use contrast and purpose words as signposts.','- In two-speaker conversations, track the final agreement.','- Do not translate every word. Find evidence and move on.');download('vtest_lesson_2_listening_results.txt',lines.join('\n'));});
$('#printBtn').addEventListener('click',()=>window.print());
function download(name,text){const blob=new Blob([text],{type:'text/plain'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$('#resetBtn').addEventListener('click',()=>{if(confirm('Reset Lesson 2 and clear saved progress?')){['vtestL2Mode','vtestL2Sections','vtestL2Guided','vtestL2Sim'].forEach(k=>localStorage.removeItem(k));location.reload();}});
