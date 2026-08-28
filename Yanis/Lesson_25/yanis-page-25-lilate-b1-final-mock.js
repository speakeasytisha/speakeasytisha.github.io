'use strict';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE_KEY = 'yanis-page25-lilate-b1-final-mock-v1';

const state = {
  mode:'practice', voice:'en-GB', answers:{}, p2Fields:{}, docAnswers:{},
  manuals:{}, readiness:{}, savedAt:null, finalSet:0
};

function toast(msg){
  const el=$('#toast'); el.textContent=msg; el.classList.add('show');
  clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),2200);
}
function shuffle(arr){ return [...arr].sort(()=>Math.random()-.5); }
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}

function setMode(mode){
  state.mode=mode;
  document.body.classList.toggle('exam-mode',mode==='exam');
  $('#practiceMode').classList.toggle('active',mode==='practice');
  $('#examMode').classList.toggle('active',mode==='exam');
  save(false);
}
function setVoice(v){
  state.voice=v;
  $('#voiceUK').classList.toggle('active',v==='en-GB');
  $('#voiceUS').classList.toggle('active',v==='en-US');
  save(false);
}
$('#practiceMode').onclick=()=>setMode('practice');
$('#examMode').onclick=()=>setMode('exam');
$('#voiceUK').onclick=()=>setVoice('en-GB');
$('#voiceUS').onclick=()=>setVoice('en-US');
$('#toggleFrench').onclick=()=>{
  document.body.classList.toggle('hide-fr');
  $('#toggleFrench').textContent=document.body.classList.contains('hide-fr')?'FR: hidden':'FR: visible';
};
$('#stopAudio').onclick=()=>speechSynthesis.cancel();

function speak(text, rate=1){
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=state.voice; u.rate=rate; u.pitch=1;
  const voices=speechSynthesis.getVoices();
  const exact=voices.find(v=>v.lang===state.voice) || voices.find(v=>v.lang.startsWith(state.voice.slice(0,2)));
  if(exact) u.voice=exact;
  speechSynthesis.speak(u);
}
document.addEventListener('click',e=>{
  const b=e.target.closest('.speak'); if(b) speak(b.dataset.say||'');
  const sc=e.target.closest('[data-scroll]'); if(sc) $(sc.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
});

const grammarData = [
  {q:'The flight ___ at 14:20 every day.',opts:['leaves','is leaving','left'],a:'leaves',why:'A schedule uses the present simple.'},
  {q:'Passengers ___ now, so please keep the aisle clear.',opts:['board','are boarding','boarded'],a:'are boarding',why:'An action happening now uses the present continuous.'},
  {q:'The gate ___ from A7 to B12. Please go to B12 now.',opts:['has changed','changed yesterday','changes'],a:'has changed',why:'A recent change with a result now naturally uses the present perfect.'},
  {q:'If seat 18C is free, I ___ you there.',opts:['will move','would move','moved'],a:'will move',why:'Real future possibility: if + present, will + base verb.'},
  {q:'If a passenger felt unwell, I ___ the senior crew member.',opts:['would call','will call','called'],a:'would call',why:'Hypothetical procedure: if + past, would + base verb.'},
  {q:'For safety, you ___ keep your seat belt fastened.',opts:['must','could','might'],a:'must',why:'Must expresses a strong obligation.'},
  {q:'___ you place your bag under the seat, please?',opts:['Could','Must','Did'],a:'Could',why:'Could is a polite professional request.'},
  {q:'According to the captain, we ___ in about twenty minutes.',opts:['will land','landed','would landed'],a:'will land',why:'You are transmitting a future operational message.'},
  {q:'The passenger ___ her passport at security this morning.',opts:['lost','has lose','is losing'],a:'lost',why:'Finished event + finished time: past simple.'},
  {q:'If I understand correctly, you ___ a vegetarian meal.',opts:['ordered','have ordering','would ordered'],a:'ordered',why:'You are reformulating a completed order/request.'},
  {q:'The passenger is anxious because this is the first time she ___ alone.',opts:['has travelled','travelled yesterday','is travel'],a:'has travelled',why:'First time + life experience often uses the present perfect.'},
  {q:'You ___ remain seated until the seat-belt sign is switched off.',opts:['should','have to','could'],a:'have to',why:'The situation expresses an operational requirement.'}
];

function renderGrammar(){
  const wrap=$('#grammarQuiz'); wrap.innerHTML='';
  grammarData.forEach((it,i)=>{
    const div=document.createElement('div'); div.className='quiz-item';
    const opts=shuffle(it.opts);
    div.innerHTML=`<p><b>${i+1}.</b> ${esc(it.q)}</p><div class="options">${opts.map(o=>`<button class="option" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="feedback"></div>`;
    const prior=state.answers['g'+i];
    if(prior){
      div.querySelectorAll('.option').forEach(x=>{if(x.dataset.v===it.a)x.classList.add('correct'); if(x.dataset.v===prior && prior!==it.a)x.classList.add('wrong');});
      const fb=$('.feedback',div); fb.textContent=(prior===it.a?'✓ Correct. ':'✗ Try again. ')+it.why; fb.className='feedback '+(prior===it.a?'good':'bad');
    }
    div.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{
      const chosen=btn.dataset.v; state.answers['g'+i]=chosen;
      div.querySelectorAll('.option').forEach(x=>{x.classList.remove('correct','wrong'); if(x.dataset.v===it.a)x.classList.add('correct');});
      if(chosen!==it.a) btn.classList.add('wrong');
      const fb=$('.feedback',div); fb.textContent=(chosen===it.a?'✓ Correct. ':'✗ Try again. ')+it.why; fb.className='feedback '+(chosen===it.a?'good':'bad');
      updateScores(); save(false);
    });
    wrap.appendChild(div);
  });
}

const reformData=[
  {prompt:'Passenger: “I booked a window seat because I get anxious when I cannot see outside, but my boarding pass says 18B.”',
   target:'If I understand correctly, you booked a window seat but you have been assigned seat 18B, and you would like me to check whether a window seat is available.',
   frame:'Problem + original request + action to check'},
  {prompt:'Crew message: “The passenger in 24A says her gluten-free meal was confirmed online, but the tray delivered contains pasta and she also says she has a severe wheat allergy.”',
   target:'So, the passenger in 24A expected a gluten-free meal, but the meal delivered may contain wheat. Because she has a severe allergy, I will stop service to her and check the meal information before offering anything else.',
   frame:'Expectation + problem + safety fact + next action'},
  {prompt:'Operations: “Flight CL482 is delayed by 35 minutes because of late incoming aircraft. Boarding will now start at 16:10 from gate C4.”',
   target:'The flight is delayed by 35 minutes. Boarding will start at 16:10 at gate C4.',
   frame:'Status + exact time + gate'},
  {prompt:'Passenger: “My connecting flight leaves at 18:05 and we are landing at 17:35. I don’t know the airport and I’m worried I won’t make it.”',
   target:'If I understand correctly, your connection is at 18:05 and you are worried because we land at 17:35. I’ll check the connection information and tell you what assistance is available.',
   frame:'Connection + concern + action'},
  {prompt:'Senior crew: “After landing, keep passengers seated in rows 1 to 8 for two minutes so the medical team can board quickly through the front door.”',
   target:'After landing, passengers in rows 1 to 8 need to remain seated for about two minutes so the medical team can board through the front door.',
   frame:'When + who + instruction + reason'},
  {prompt:'Passenger: “I put my black laptop bag in the overhead locker above row 12, but after boarding finished it was gone. It has my work computer and passport inside.”',
   target:'So, your black laptop bag was in the overhead locker above row 12, but it is now missing, and your work computer and passport are inside. I’ll report it immediately and check with the crew.',
   frame:'Item + location + problem + important contents + action'}
];
function renderReforms(){
  const wrap=$('#reformCards'); wrap.innerHTML='';
  reformData.forEach((it,i)=>{
    const div=document.createElement('article');div.className='reform-card';
    div.innerHTML=`<div class="reform-top"><div><span class="tag">MISSION ${i+1}</span><h3>Reformulate without copying</h3></div><button class="secondary play">🔊 Listen</button></div>
      <div class="prompt-box">${esc(it.prompt)}</div>
      <textarea rows="4" data-reform="${i}" placeholder="Start with: If I understand correctly... / So... / According to..."></textarea>
      <div class="button-row support"><button class="secondary frame">💡 Frame</button><button class="secondary model">👁 B1 model</button></div>
      <div class="reveal framebox support"><b>Keep:</b> ${esc(it.frame)}</div>
      <div class="reveal modelbox support">${esc(it.target)}</div>`;
    $('.play',div).onclick=()=>speak(it.prompt);
    $('.frame',div).onclick=()=>$('.framebox',div).classList.toggle('show');
    $('.model',div).onclick=()=>$('.modelbox',div).classList.toggle('show');
    wrap.appendChild(div);
  });
}

const p1Scenarios=[
  {title:'Seat problem during boarding',role:'You are cabin crew during boarding.',prompt:'Excuse me, I think someone is sitting in my seat. My boarding pass says 14A, but the passenger says this is his seat.',
   follow:['What would you do if both boarding passes showed the same seat?','What information would you check first?','How would you keep both passengers calm?'],
   frame:'Acknowledge → ask to see both boarding passes → verify seat numbers → explain the next step.',
   a2:'I’m sorry. Can I see your boarding pass, please? I will check the seat numbers.',
   b1:'I’m sorry about the confusion. Could I see both boarding passes, please? I’ll check the seat numbers and the passenger names. If there is a duplicate seat, I’ll contact the gate agent or senior crew member and find the correct solution.',
   plus:'I understand the confusion. Let me verify both boarding passes first. If the same seat has been assigned twice, I’ll keep both passengers informed, contact the relevant colleague and avoid promising a specific replacement seat until availability is confirmed.'},
  {title:'Tight connection',role:'You are cabin crew shortly before landing.',prompt:'My next flight leaves in thirty-five minutes. I’m in row 29 and I’m really worried I’ll miss it. Can I get off first?',
   follow:['What would you say if you cannot guarantee priority exit?','Which details do you need before helping?','How could you reformulate the concern?'],
   frame:'Show understanding → ask flight/destination → avoid false promise → offer to check connection information.',
   a2:'I understand. What is your next flight number? I will check the information.',
   b1:'I understand you’re worried about your connection. Could you give me your next flight number and destination? I can check the latest connection information, but I can’t promise that you will leave the aircraft first.',
   plus:'I understand the time is tight. Let me check the flight number, departure gate and current status of your connection. I cannot guarantee priority disembarkation, but I can give you the most accurate information available and alert the senior crew member if assistance may be needed.'},
  {title:'Special meal + allergy',role:'You are serving meals in the cabin.',prompt:'I ordered a vegetarian meal, but this looks like chicken. I’m also allergic to nuts. Can you bring me something else?',
   follow:['What safety question should you ask?','What should you avoid promising?','How would you confirm the request?'],
   frame:'Acknowledge → clarify allergy → reformulate → check safe option → confirm follow-up.',
   a2:'I’m sorry. You ordered a vegetarian meal and you have a nut allergy. I will check another meal.',
   b1:'I’m sorry about that. Let me confirm: you ordered a vegetarian meal, and you also have a nut allergy. Could you tell me how serious the allergy is? I’ll check the meal information before I offer you another option.',
   plus:'I’m sorry for the mistake. I understand that you need a vegetarian meal and that you have a nut allergy. Before offering an alternative, I need to confirm the allergy details and check the ingredients with the crew information so that I don’t give you something unsafe.'},
  {title:'Anxious passenger in turbulence',role:'You are cabin crew during light-to-moderate turbulence.',prompt:'I’m very scared. Is the plane safe? I want to stand up and go to the toilet right now.',
   follow:['How can you reassure without making unrealistic guarantees?','Which instruction is essential?','What would you do if the passenger became more distressed?'],
   frame:'Acknowledge emotion → give safety instruction → simple reassurance → offer follow-up.',
   a2:'I understand. Please stay seated and keep your seat belt fastened. I will come back to check on you.',
   b1:'I understand that you’re anxious. For your safety, please remain seated and keep your seat belt fastened while the sign is on. Turbulence can be uncomfortable, but the crew is monitoring the situation. I’ll come back to check on you as soon as it is safe.',
   plus:'I can see that you’re worried. The most important thing now is to stay seated with your seat belt securely fastened. We’re following the flight crew’s instructions, and I’ll stay attentive to you. If you continue to feel very distressed, I’ll inform the senior crew member.'},
  {title:'Cabin baggage conflict',role:'You are cabin crew at the end of boarding.',prompt:'Why do I have to put my suitcase in the hold? It’s cabin baggage and I paid for it. I don’t want to give it to you.',
   follow:['How would you explain a full overhead locker professionally?','What could you say if the passenger becomes angry?','Which information should you confirm before taking action?'],
   frame:'Stay calm → explain operational reason → clarify what happens next → avoid arguing.',
   a2:'I understand. The overhead lockers are full. We need to place the bag in the hold. I will explain what happens next.',
   b1:'I understand that this is frustrating. The overhead lockers are full, so some cabin bags need to be placed in the hold for safety and space. Let me explain the procedure and check whether you need to remove any important items first.',
   plus:'I understand why you’re unhappy. Because the overhead lockers are now full, we need to manage the remaining cabin bags safely before departure. I’ll explain the process clearly and make sure you have the opportunity to remove essential documents, medication or valuables if the procedure allows.'},
  {title:'Passenger feels unwell',role:'You are cabin crew during cruise.',prompt:'I feel dizzy and I have pain in my chest. I started feeling bad about ten minutes ago.',
   follow:['Which questions would you ask first?','Who should you alert?','How would you reformulate the symptoms?'],
   frame:'Take it seriously → ask concise symptom questions → alert senior crew → follow procedure.',
   a2:'I’m sorry you feel unwell. You feel dizzy and you have chest pain. I will call the senior crew member.',
   b1:'I’m sorry you’re feeling unwell. Let me confirm: you’ve felt dizzy with chest pain for about ten minutes. Are you having difficulty breathing, and do you have any medical condition I should know about? I’m going to alert the senior crew member immediately.',
   plus:'I’m going to take this seriously. You’ve reported dizziness and chest pain for around ten minutes. I’ll ask only the essential questions now, notify the senior crew member and follow the onboard medical procedure without delaying.'}
];

function renderP1(){
  const sel=$('#p1Select'); sel.innerHTML=p1Scenarios.map((x,i)=>`<option value="${i}">${i+1}. ${esc(x.title)}</option>`).join('');
  sel.onchange=showP1; showP1();
}
function showP1(){
  const x=p1Scenarios[+$('#p1Select').value||0];
  $('#p1Card').innerHTML=`<div class="small">${esc(x.role)}</div><h3>${esc(x.title)}</h3><p><strong>Passenger:</strong> “${esc(x.prompt)}”</p>`;
  $('#p1HintBox').innerHTML=`<b>Response frame:</b> ${esc(x.frame)}`; $('#p1HintBox').classList.remove('show');
  $('#p1Models').innerHTML=`<b>A2 support</b><p>${esc(x.a2)}</p><div class="model-level"><b>B1 target</b><p>${esc(x.b1)}</p></div><div class="model-level"><b>B1+ upgrade</b><p>${esc(x.plus)}</p></div>`; $('#p1Models').classList.remove('show');
}
$('#p1Play').onclick=()=>speak(p1Scenarios[+$('#p1Select').value||0].prompt);
$('#p1Follow').onclick=()=>{const x=p1Scenarios[+$('#p1Select').value||0]; const q=x.follow[Math.floor(Math.random()*x.follow.length)]; speak(q); toast('Unexpected follow-up played');};
$('#p1Hint').onclick=()=>$('#p1HintBox').classList.toggle('show');
$('#p1ModelsBtn').onclick=()=>$('#p1Models').classList.toggle('show');

const p2Messages=[
 {title:'Gate change + delay',context:'You receive an operations update before boarding.',
  audio:'Attention crew. Flight CL four eight two to Lisbon is delayed by thirty five minutes because the incoming aircraft arrived late. Boarding will now begin at sixteen ten from gate Charlie four. Please update passengers and pay particular attention to anyone with a short connection.',
  fields:{flight:'CL482',destination:'Lisbon',delay:'35 minutes',boarding:'16:10',gate:'C4',action:'update passengers'},
  model:'Flight CL482 to Lisbon is delayed by 35 minutes because the incoming aircraft arrived late. Boarding will now start at 16:10 from gate C4. Passengers need to be updated, especially anyone with a short connection.'},
 {title:'Mobility assistance',context:'You receive a handover about a passenger requiring assistance.',
  audio:'Passenger Maria Sanchez in seat twenty two Delta has reduced mobility. A wheelchair is confirmed for arrival in Barcelona. She can walk a few steps but cannot use stairs. Please ask her to remain seated after landing until the assistance team arrives at the aircraft door.',
  fields:{passenger:'Maria Sanchez',seat:'22D',arrival:'Barcelona',mobility:'cannot use stairs',assistance:'wheelchair',action:'remain seated'},
  model:'Maria Sanchez in seat 22D has reduced mobility and cannot use stairs. A wheelchair is confirmed on arrival in Barcelona. She should remain seated after landing until the assistance team reaches the aircraft door.'},
 {title:'Missing cabin item',context:'A colleague leaves you a message about a lost item.',
  audio:'A passenger from row twelve has reported a black laptop bag missing from the overhead locker. The bag contains a work computer and a passport. The passenger last saw it after boarding. Please inform the senior crew member and check whether another passenger moved it by mistake.',
  fields:{item:'black laptop bag',location:'overhead locker',row:'12',contents:'computer and passport',time:'after boarding',action:'inform senior crew'},
  model:'A black laptop bag is missing from the overhead locker near row 12. It contains a work computer and a passport, and the passenger last saw it after boarding. The senior crew member should be informed and the crew should check whether the bag was moved.'},
 {title:'Medical follow-up',context:'You receive a status update from the senior crew member.',
  audio:'The passenger in seat seven Alpha felt faint twenty minutes ago but is now conscious and speaking normally. A doctor on board has checked him. Please offer water if the doctor agrees, keep the aisle clear, and report immediately if his condition changes.',
  fields:{seat:'7A',problem:'felt faint',status:'conscious and speaking',help:'doctor on board',action:'monitor changes',aisle:'keep clear'},
  model:'The passenger in seat 7A felt faint about 20 minutes ago but is now conscious and speaking normally. A doctor on board has checked him. We should keep the aisle clear, offer water only if the doctor agrees, and report any change immediately.'}
];
function renderP2(){
  const s=$('#p2Select');s.innerHTML=p2Messages.map((x,i)=>`<option value="${i}">${i+1}. ${esc(x.title)}</option>`).join('');s.onchange=showP2;showP2();
}
function showP2(){
  const x=p2Messages[+$('#p2Select').value||0];
  $('#p2Context').innerHTML=`<div class="small">${esc(x.context)}</div><h3>${esc(x.title)}</h3><p>Listen first. Do not open the transcript unless you are in Practice mode.</p>`;
  $('#p2Transcript').textContent=x.audio; $('#p2Transcript').classList.remove('show');
  $('#p2Fields').innerHTML=Object.entries(x.fields).map(([k,v])=>{const saved=state.p2Fields[(+$('#p2Select').value||0)+'-'+k]||'';return `<label>${esc(k)}<input data-key="${esc(k)}" data-answer="${esc(v)}" value="${esc(saved)}" placeholder="..." autocomplete="off"></label>`}).join('');
  $$('#p2Fields input').forEach(inp=>inp.oninput=()=>{
    const norm=s=>s.trim().toLowerCase().replace(/[.,]/g,'');
    const ok=norm(inp.value)===norm(inp.dataset.answer);
    inp.classList.toggle('good',ok); inp.classList.toggle('bad',inp.value.length>1&&!ok);
    state.p2Fields[(+s.value)+'-'+inp.dataset.key]=inp.value; updateScores(); save(false);
  });
  $('#p2Model').textContent=x.model;$('#p2Model').classList.remove('show');
}
$('#p2Play').onclick=()=>speak(p2Messages[+$('#p2Select').value||0].audio);
$('#p2Slow').onclick=()=>speak(p2Messages[+$('#p2Select').value||0].audio,.78);
$('#p2TranscriptBtn').onclick=()=>$('#p2Transcript').classList.toggle('show');
$('#p2ModelBtn').onclick=()=>$('#p2Model').classList.toggle('show');

const p3Scenarios=[
 {title:'Turbulence cabin secure',context:'The captain asks the cabin to be secured earlier than expected.',
 audio:'Cabin crew, we expect moderate turbulence in about five minutes. Please stop service, secure the carts, check that passengers are seated with seat belts fastened, and take your seats as soon as the cabin is secure.',
 constraints:['A passenger asks to use the toilet immediately.','A service cart is still in the aisle.','One passenger does not understand English well.'],
 b1:'According to the captain, we expect moderate turbulence in about five minutes. We need to stop service, secure the carts and make sure passengers are seated with their seat belts fastened. Once the cabin is secure, we need to take our seats.'},
 {title:'Arrival medical assistance',context:'The senior crew member gives an arrival instruction.',
 audio:'After landing, keep the front aisle clear. The medical team will board through door one left to assist the passenger in seven Alpha. Ask passengers in rows one to eight to remain seated for about two minutes.',
 constraints:['A passenger in row 3 says she has a tight connection.','The medical team is delayed by one minute.','A passenger starts opening the overhead locker.'],
 b1:'After landing, the front aisle must stay clear because a medical team will board through door 1L for the passenger in 7A. Passengers in rows 1 to 8 should remain seated for about two minutes.'},
 {title:'Unaccompanied minor handover',context:'You receive a handover before arrival.',
 audio:'The unaccompanied minor in seat fifteen Charlie must be handed directly to the ground staff member waiting at the aircraft door. Do not let the child leave with other passengers. The ground staff member will confirm the child’s name and reference number.',
 constraints:['The child says an aunt is waiting in the terminal.','The ground staff member has not arrived yet.','Another passenger offers to escort the child.'],
 b1:'The unaccompanied minor in 15C must stay with the crew until the authorised ground staff member arrives at the aircraft door. The child must not leave with other passengers. The staff member will confirm the name and reference number.'},
 {title:'Seat change due to broken recline',context:'A passenger’s seat does not recline and the flight is nearly full.',
 audio:'The passenger in twenty six Foxtrot says the seat does not recline and he needs to rest before a business meeting. Check whether an equivalent seat is available. Do not promise an upgrade. If there is no suitable seat, apologise and report the defect.',
 constraints:['Only a middle seat is available.','The passenger asks for business class.','The passenger becomes impatient.'],
 b1:'The passenger in 26F has a seat that does not recline. I need to check whether an equivalent seat is available, but I should not promise an upgrade. If there is no suitable alternative, I need to apologise and report the seat defect.'},
 {title:'Allergy meal safety',context:'A meal request becomes a possible allergy risk.',
 audio:'The passenger in twenty four Alpha ordered a vegetarian meal, but the tray contains chicken. She has also mentioned a severe nut allergy. Do not offer another tray until the ingredient information has been checked. Inform the senior crew member.',
 constraints:['The passenger says she is very hungry.','The ingredient list is not immediately available.','The passenger asks whether a dessert is safe.'],
 b1:'The passenger in 24A received the wrong meal and has also reported a severe nut allergy. We should not offer another tray until the ingredients have been checked, and the senior crew member needs to be informed.'},
 {title:'Disruptive passenger early intervention',context:'A colleague asks you to take over a tense interaction.',
 audio:'The passenger in eighteen Delta is speaking loudly and is angry because he cannot move to an exit-row seat. He has not threatened anyone, but other passengers are uncomfortable. Please remain calm, explain that the seat cannot be changed without checking eligibility and availability, and call me if his behaviour escalates.',
 constraints:['The passenger says the airline is discriminating against him.','He starts filming the conversation.','He calms down but still wants an explanation.'],
 b1:'The passenger in 18D is angry about an exit-row seat change. I need to stay calm and explain that the change depends on eligibility and availability. If his behaviour becomes more serious, I should contact the senior crew member.'}
];
function renderP3(){
  const s=$('#p3Select');s.innerHTML=p3Scenarios.map((x,i)=>`<option value="${i}">${i+1}. ${esc(x.title)}</option>`).join('');s.onchange=showP3;showP3();
}
function showP3(){
  const x=p3Scenarios[+$('#p3Select').value||0];
  $('#p3Context').innerHTML=`<div class="small">${esc(x.context)}</div><h3>${esc(x.title)}</h3><p>Listen, take notes, then transmit the message in your own words.</p>`;
  $('#p3Frame').innerHTML='<b>5-step frame:</b> 1) Situation  2) Essential detail  3) Instruction  4) Reason if useful  5) Confirm next step';
  $('#p3Model').innerHTML=`<b>B1 target</b><p>${esc(x.b1)}</p>`;
  $('#p3Frame').classList.remove('show');$('#p3Model').classList.remove('show');
}
$('#p3Play').onclick=()=>speak(p3Scenarios[+$('#p3Select').value||0].audio);
$('#p3Follow').onclick=()=>{const x=p3Scenarios[+$('#p3Select').value||0];const q=x.constraints[Math.floor(Math.random()*x.constraints.length)];speak(q);toast('New constraint played');};
$('#p3FrameBtn').onclick=()=>$('#p3Frame').classList.toggle('show');
$('#p3ModelBtn').onclick=()=>$('#p3Model').classList.toggle('show');

const doc = {
 rows:[
  ['Flight','CL218 · Paris → Dublin'],
  ['Departure','14:05 · Gate B18'],
  ['Boarding','13:25'],
  ['Current status','On time'],
  ['Cabin note','Overhead space limited — tag larger cabin bags at gate'],
  ['Special passenger','22D · reduced mobility · wheelchair confirmed on arrival'],
  ['Connection risk','Passengers to Edinburgh have 42 minutes after scheduled arrival'],
  ['Crew instruction','Do not promise priority disembarkation; provide current connection information and notify senior crew if assistance is needed']
 ],
 questions:[
  {q:'Which passenger has confirmed mobility assistance?',opts:['22D','18B','7A'],a:'22D'},
  {q:'What should happen with larger cabin bags?',opts:['They may need to be tagged at the gate','They must stay in the cabin','They should be left at security'],a:'They may need to be tagged at the gate'},
  {q:'What must you avoid promising to passengers with a short connection?',opts:['Priority disembarkation','Connection information','Senior crew assistance'],a:'Priority disembarkation'},
  {q:'When does boarding begin?',opts:['13:25','14:05','13:42'],a:'13:25'}
 ],
 prompt:'A passenger travelling to Edinburgh is worried about the 42-minute connection and asks you to guarantee that they can leave the aircraft first. What do you recommend and what would you say?',
 model:'I would not guarantee priority disembarkation because the crew instruction says not to promise it. I would acknowledge the passenger’s concern, check the latest connection information and explain what we currently know. If assistance may be needed, I would notify the senior crew member.'
};
function renderDoc(){
  $('#opsDoc').innerHTML=doc.rows.map(([a,b])=>`<div class="ops-row"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
  const wrap=$('#docQuestions');wrap.innerHTML='';
  doc.questions.forEach((it,i)=>{
    const div=document.createElement('div');div.className='quiz-item';
    div.innerHTML=`<p><b>${i+1}.</b> ${esc(it.q)}</p><div class="options">${shuffle(it.opts).map(o=>`<button class="option" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="feedback"></div>`;
    const prior=state.docAnswers[i];
    if(prior){
      $$('.option',div).forEach(x=>{if(x.dataset.v===it.a)x.classList.add('correct'); if(x.dataset.v===prior && prior!==it.a)x.classList.add('wrong');});
      const fb=$('.feedback',div);fb.textContent=prior===it.a?'✓ Correct':'✗ Check the document again';fb.className='feedback '+(prior===it.a?'good':'bad');
    }
    $$('.option',div).forEach(btn=>btn.onclick=()=>{
      state.docAnswers[i]=btn.dataset.v;
      $$('.option',div).forEach(x=>{x.classList.remove('correct','wrong');if(x.dataset.v===it.a)x.classList.add('correct');});
      if(btn.dataset.v!==it.a)btn.classList.add('wrong');
      const fb=$('.feedback',div);fb.textContent=btn.dataset.v===it.a?'✓ Correct':'✗ Check the document again';fb.className='feedback '+(btn.dataset.v===it.a?'good':'bad');
      updateScores();save(false);
    });
    wrap.appendChild(div);
  });
  $('#p4Model').textContent=doc.model;
}
$('#p4PromptPlay').onclick=()=>speak(doc.prompt);
$('#p4ModelBtn').onclick=()=>$('#p4Model').classList.toggle('show');

function makeSmallTimer(prefix, seconds=90){
  let remaining=seconds, interval=null;
  const el=$('#'+prefix+'Timer');
  const paint=()=>{const m=Math.floor(remaining/60),s=remaining%60;el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`};
  paint();
  document.querySelector(`[data-timer="${prefix}"]`).onclick=()=>{
    clearInterval(interval); remaining=seconds; paint();
    interval=setInterval(()=>{remaining--;paint();if(remaining<=0){clearInterval(interval);toast('Time');}},1000);
  };
}
makeSmallTimer('p1');makeSmallTimer('p3');

let masterRemaining=3600, masterInterval=null, masterRunning=false;
function paintMaster(){const m=Math.floor(masterRemaining/60),s=masterRemaining%60;$('#masterTimer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
$('#startMaster').onclick=()=>{if(masterRunning)return;masterRunning=true;masterInterval=setInterval(()=>{masterRemaining--;paintMaster();if(masterRemaining<=0){clearInterval(masterInterval);masterRunning=false;toast('Mock exam time finished');}},1000)};
$('#pauseMaster').onclick=()=>{clearInterval(masterInterval);masterRunning=false};
$('#resetMaster').onclick=()=>{clearInterval(masterInterval);masterRunning=false;masterRemaining=3600;paintMaster()};

const finalSets=[
 [
  ['PART 1 · INTERACT','A passenger boards and says the seat beside their child is occupied by another family member. Identify the request, clarify the booking and explain your next step.'],
  ['PART 2 · REFORMULATE','Listen to a gate-change message from your trainer. Note flight, gate, time, reason and required action. Reformulate it in 3–4 sentences.'],
  ['PART 3 · TRANSMIT','You receive a crew instruction about turbulence in five minutes. Relay the procedure to a colleague and then give a passenger instruction.'],
  ['PART 4 · EXPLOIT','Use the operations document above. Respond to a passenger with a short connection without making a promise you cannot keep.']
 ],
 [
  ['PART 1 · INTERACT','A passenger says the vegetarian meal is incorrect and mentions a serious allergy. Clarify the risk, reformulate and explain the next action.'],
  ['PART 2 · REFORMULATE','Listen to a handover about mobility assistance. Extract seat, limitation, arrival assistance and the instruction after landing.'],
  ['PART 3 · TRANSMIT','A seat does not recline and the flight is nearly full. Explain to a colleague what you can check and what you must not promise.'],
  ['PART 4 · EXPLOIT','Use the operations document above to explain why larger cabin bags may need to be tagged and what the passenger should do.']
 ],
 [
  ['PART 1 · INTERACT','During turbulence, an anxious passenger wants to stand up. Acknowledge the concern, give the safety instruction and explain what you can do next.'],
  ['PART 2 · REFORMULATE','Listen to a missing-item report. Extract location, description, important contents, last known time and next action.'],
  ['PART 3 · TRANSMIT','An unaccompanied minor must be handed directly to authorised ground staff. Relay the procedure and respond to an unexpected family request.'],
  ['PART 4 · EXPLOIT','Use the operations document above to brief another crew member on the two passengers/situations requiring special attention.']
 ]
];
function renderFinal(){
 const set=finalSets[state.finalSet%finalSets.length];
 $('#finalMockCards').innerHTML=set.map(([t,p],i)=>`<article class="final-card"><span>${esc(t)}</span><h3>Mission ${i+1}</h3><p>${esc(p)}</p><textarea rows="4" placeholder="Cue words / trainer notes..."></textarea></article>`).join('');
}
$('#randomMock').onclick=()=>{state.finalSet=(state.finalSet+1)%finalSets.length;renderFinal();save(false)};

const recorders={};
async function startRec(key){
 try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true});
   const rec=new MediaRecorder(stream), chunks=[];
   rec.ondataavailable=e=>chunks.push(e.data);
   rec.onstop=()=>{
     const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});
     const audio=$('#audio-'+key); audio.src=URL.createObjectURL(blob);audio.classList.remove('hidden');
     stream.getTracks().forEach(t=>t.stop());
   };
   recorders[key]=rec;rec.start();
   $(`.rec-start[data-rec="${key}"]`).disabled=true;$(`.rec-stop[data-rec="${key}"]`).disabled=false;
   toast('Recording started');
 }catch(e){toast('Microphone permission is required for recording');}
}
function stopRec(key){
 const rec=recorders[key]; if(rec&&rec.state!=='inactive')rec.stop();
 $(`.rec-start[data-rec="${key}"]`).disabled=false;$(`.rec-stop[data-rec="${key}"]`).disabled=true;
}
$$('.rec-start').forEach(b=>b.onclick=()=>startRec(b.dataset.rec));
$$('.rec-stop').forEach(b=>b.onclick=()=>stopRec(b.dataset.rec));

function scoredTotals(){
  let correct=0,total=grammarData.length+doc.questions.length;
  grammarData.forEach((x,i)=>{if(state.answers['g'+i]===x.a)correct++});
  doc.questions.forEach((x,i)=>{if(state.docAnswers[i]===x.a)correct++});
  const active=p2Messages[+$('#p2Select').value||0];
  total+=Object.keys(active.fields).length;
  Object.entries(active.fields).forEach(([k,v])=>{
    const val=state.p2Fields[(+$('#p2Select').value||0)+'-'+k]||'';
    const norm=s=>String(s).trim().toLowerCase().replace(/[.,]/g,'');
    if(norm(val)===norm(v))correct++;
  });
  return {correct,total};
}
function updateScores(){
  const {correct,total}=scoredTotals();$('#scoreNow').textContent=correct;$('#scoreTotal').textContent=total;
  $('#autoPercent').textContent=total?Math.round(correct/total*100)+'%':'0%';
  const closedAnswered=Object.keys(state.answers).length+Object.keys(state.docAnswers).length+Object.values(state.p2Fields).filter(Boolean).length;
  const openFilled=['p1Notes','p2Writing','p3Notes','p4Writing','strengths','priority','trainerComments'].filter(id=>$('#'+id).value.trim()).length;
  const manuals=[...$$('[data-manual]')].filter(x=>x.value!=='Not started').length;
  const readiness=[...$$('[data-readiness]')].filter(x=>x.value!=='Not started').length;
  const denom=grammarData.length+doc.questions.length+Object.keys(activeP2().fields).length+7+$$('[data-manual]').length+$$('[data-readiness]').length;
  const done=closedAnswered+openFilled+manuals+readiness;
  $('#completionPercent').textContent=Math.min(100,Math.round(done/denom*100))+'%';
  $('#progressBar').style.width=Math.min(100,Math.round(done/denom*100))+'%';
  const rvals=$$('[data-readiness]').map(x=>x.value);
  let signal='Not assessed';
  if(rvals.some(v=>v!=='Not started')){
    const acq=rvals.filter(v=>v==='Achieved').length, bad=rvals.filter(v=>v==='Not achieved').length;
    signal=acq>=5?'Strong B1 readiness':acq>=3&&bad<=1?'Approaching B1 readiness':'Needs targeted reinforcement';
  }
  $('#readinessSignal').textContent=signal;
}
function activeP2(){return p2Messages[+$('#p2Select').value||0]}

$$('[data-manual]').forEach(x=>x.onchange=()=>{state.manuals[x.dataset.manual]=x.value;updateScores();save(false)});
$$('[data-readiness]').forEach(x=>x.onchange=()=>{state.readiness[x.dataset.readiness]=x.value;updateScores();save(false)});
['p1Notes','p2Writing','p3Notes','p4Writing','strengths','priority','trainerComments','learnerName','trainerName','evalDate'].forEach(id=>$('#'+id)?.addEventListener('input',()=>{updateScores();save(false)}));

function collect(){
  const values={};
  $$('input,textarea,select').forEach((el,i)=>{if(el.id)values[el.id]=el.value});
  return {state,values,hideFr:document.body.classList.contains('hide-fr')};
}
function save(announce=true){
  state.savedAt=new Date().toISOString();
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(collect()));if(announce){$('#saveStatus').textContent='Saved on this browser · '+new Date().toLocaleString();toast('Progress saved')}}catch(e){if(announce)toast('Browser storage is unavailable')}
}
function load(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;
    const d=JSON.parse(raw);Object.assign(state,d.state||{});
    Object.entries(d.values||{}).forEach(([id,v])=>{const el=$('#'+id);if(el)el.value=v});
    if(d.hideFr)document.body.classList.add('hide-fr');
    setMode(state.mode||'practice');setVoice(state.voice||'en-GB');
  }catch(e){}
}
$('#saveProgress').onclick=()=>save(true);

function reportText(){
 const {correct,total}=scoredTotals();
 const rd=$$('[data-readiness]').map(x=>`${x.parentElement.childNodes[0].textContent.trim()}: ${x.value}`).join('\n');
 const man=$$('[data-manual]').map(x=>`${x.dataset.manual}: ${x.value}`).join('\n');
 return `YANIS — LILATE B1 FINAL FLIGHT CHECK
Learner: ${$('#learnerName').value}
Trainer: ${$('#trainerName').value}
Date: ${$('#evalDate').value}
Automatic score: ${correct}/${total} (${total?Math.round(correct/total*100):0}%)
B1 readiness signal: ${$('#readinessSignal').textContent}

READINESS
${rd}

MOCK PARTS
${man}

STRONG POINTS
${$('#strengths').value}

PRIORITY BEFORE EXAM
${$('#priority').value}

TRAINER COMMENTS
${$('#trainerComments').value}
`;
}
$('#copyReport').onclick=async()=>{try{await navigator.clipboard.writeText(reportText());toast('Report copied')}catch(e){toast('Copy blocked by browser')}};
$('#downloadReport').onclick=()=>{
 const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download='Yanis-LILATE-B1-Final-Flight-Check-Report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};
$('#printReport').onclick=()=>window.print();
$('#resetProgress').onclick=()=>{
 if(!confirm('Reset all saved results and notes for this lesson?'))return;
 localStorage.removeItem(STORAGE_KEY);location.reload();
};

document.addEventListener('DOMContentLoaded',()=>{
  const d=new Date();$('#evalDate').value=d.toISOString().slice(0,10);
  renderGrammar();renderReforms();renderP1();renderP2();renderP3();renderDoc();renderFinal();
  load();
  // Re-render scored and select-dependent elements after restoring state
  renderGrammar();renderDoc();showP1();showP2();showP3();renderFinal();
  // Restore manual/readiness state
  $$('[data-manual]').forEach(x=>{if(state.manuals[x.dataset.manual])x.value=state.manuals[x.dataset.manual]});
  $$('[data-readiness]').forEach(x=>{if(state.readiness[x.dataset.readiness])x.value=state.readiness[x.dataset.readiness]});
  updateScores();
});
