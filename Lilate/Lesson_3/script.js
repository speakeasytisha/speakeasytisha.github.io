(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const normalize=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").replace(/[^a-z0-9'€ ]+/g,' ').replace(/\s+/g,' ').trim();
  const escapeHtml=s=>(s??'').toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const toast=msg=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200)};
  const safeStorage={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}},remove:k=>{try{localStorage.removeItem(k)}catch{}}};
  const STORE='lilate_lesson3_part2_v1';
  const defaultState=()=>({grammar:Array(8).fill(null),listening:Array(9).fill(null),document:Array(3).fill(null),docSummaryChecked:false,docSummaryScore:0,reform:Array(5).fill(null),writingChecked:false,writingScore:0,writingFormat:'message',oralChecks:Array(5).fill(false),oralIndex:0,previewAnswers:Array(7).fill(null),previewFinished:false,lessonUrl:'',overallStatus:'En cours',nextSteps:'',trainerNotes:'',fr:true,mode:'guided',voice:'en-GB',font:16});
  let state=defaultState();
  try{const raw=safeStorage.get(STORE);if(raw)state={...state,...JSON.parse(raw)}}catch{}
  const save=()=>safeStorage.set(STORE,JSON.stringify(state));

  // Gate
  const disclaimerCheck=$('#disclaimerCheck'), enterBtn=$('#enterBtn'), gate=$('#disclaimerGate');
  disclaimerCheck.addEventListener('change',()=>enterBtn.disabled=!disclaimerCheck.checked);
  enterBtn.addEventListener('click',()=>{if(!disclaimerCheck.checked)return;gate.classList.add('accepted');$('#roadmap').scrollIntoView({behavior:'smooth'});});

  // Global controls
  const frToggle=$('#frToggle'), trainingMode=$('#trainingMode'), voiceAccent=$('#voiceAccent');
  frToggle.checked=state.fr!==false;document.body.classList.toggle('fr-off',!frToggle.checked);
  trainingMode.value=state.mode||'guided';voiceAccent.value=state.voice||'en-GB';
  const applyMode=(announce=false)=>{document.body.classList.toggle('practice-mode',trainingMode.value==='practice');document.body.classList.toggle('exam-preview',trainingMode.value==='preview');state.mode=trainingMode.value;save();if(announce)toast(trainingMode.value==='guided'?'Guided mode: coaching, transcripts and models available.':trainingMode.value==='practice'?'Practice mode: use support only when needed.':'Exam preview mode: help and models hidden until review.');};
  applyMode(false);
  frToggle.addEventListener('change',e=>{document.body.classList.toggle('fr-off',!e.target.checked);state.fr=e.target.checked;save();});
  trainingMode.addEventListener('change',()=>applyMode(true));
  voiceAccent.addEventListener('change',()=>{state.voice=voiceAccent.value;save();});
  let fontSize=Number(state.font)||16;document.documentElement.style.setProperty('--font-size',fontSize+'px');
  $$('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.font==='minus')fontSize=Math.max(14,fontSize-1);if(btn.dataset.font==='plus')fontSize=Math.min(20,fontSize+1);if(btn.dataset.font==='reset')fontSize=16;document.documentElement.style.setProperty('--font-size',fontSize+'px');state.font=fontSize;save();}));
  $('#printBtn').addEventListener('click',()=>window.print());

  // Speech
  function speak(text){
    if(!('speechSynthesis' in window)){toast('Speech playback is not supported in this browser.');return}
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=voiceAccent.value;u.rate=.88;
    const voices=speechSynthesis.getVoices();const v=voices.find(x=>x.lang===u.lang)||voices.find(x=>x.lang?.startsWith(u.lang.slice(0,2)));if(v)u.voice=v;speechSynthesis.speak(u);
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b)speak(b.dataset.say);});

  // Vocabulary
  const vocab={
    collect:{label:'Collect information',icon:'🔎',items:[
      ['Could you give me the reference number?','Pourriez-vous me donner le numéro de référence ?','Could you give me the reference number, please?','Pourriez-vous me donner le numéro de référence, s’il vous plaît ?'],
      ['Who is the contact person?','Qui est la personne à contacter ?','Who is the contact person for this request?','Qui est la personne à contacter pour cette demande ?'],
      ['When do you need it?','Pour quand en avez-vous besoin ?','When do you need the final document?','Pour quand avez-vous besoin du document final ?'],
      ['Where should we send it?','Où devons-nous l’envoyer ?','Where should we send the confirmation?','Où devons-nous envoyer la confirmation ?']
    ]},
    clarify:{label:'Clarify & confirm',icon:'🧭',items:[
      ['Could you repeat that, please?','Pourriez-vous répéter, s’il vous plaît ?','Could you repeat the time, please?','Pourriez-vous répéter l’heure, s’il vous plaît ?'],
      ['Could you spell that for me?','Pourriez-vous me l’épeler ?','Could you spell the surname for me?','Pourriez-vous m’épeler le nom de famille ?'],
      ['Did you say fifteen or fifty?','Vous avez dit quinze ou cinquante ?','Sorry, did you say fifteen or fifty units?','Pardon, vous avez dit quinze ou cinquante unités ?'],
      ['Can I confirm the date?','Puis-je confirmer la date ?','Can I confirm the date: Friday the sixth?','Puis-je confirmer la date : vendredi 6 ?']
    ]},
    document:{label:'Document & table',icon:'📄',items:[
      ['row','ligne','The information is in the second row.','L’information se trouve sur la deuxième ligne.'],
      ['column','colonne','Check the price column before you answer.','Vérifiez la colonne des prix avant de répondre.'],
      ['reference','référence','The reference is RK472.','La référence est RK472.'],
      ['available','disponible','Option B is available after midday.','L’option B est disponible après midi.']
    ]},
    reformulate:{label:'Reformulate',icon:'🔄',items:[
      ['So, if I understand correctly…','Donc, si j’ai bien compris…','So, if I understand correctly, you need twelve units by Friday.','Donc, si j’ai bien compris, vous avez besoin de douze unités pour vendredi.'],
      ['The key point is…','Le point essentiel est…','The key point is that the deadline is tomorrow at 2 p.m.','Le point essentiel est que l’échéance est demain à 14 h.'],
      ['In short…','En résumé…','In short, the meeting is online at 10:30.','En résumé, la réunion est en ligne à 10 h 30.'],
      ['The next step is…','La prochaine étape est…','The next step is to confirm availability by email.','La prochaine étape est de confirmer la disponibilité par e-mail.']
    ]},
    transcribe:{label:'Transcribe & transfer',icon:'✍️',items:[
      ['message slip','fiche message','I will put the key details on a message slip.','Je vais noter les informations essentielles sur une fiche message.'],
      ['bullet summary','résumé à puces','Use a bullet summary for the main facts.','Utilisez un résumé à puces pour les faits principaux.'],
      ['short email','e-mail court','Write a short email with the request and next action.','Rédigez un e-mail court avec la demande et la prochaine action.'],
      ['essential information','informations essentielles','Keep only the essential information.','Gardez uniquement les informations essentielles.']
    ]}
  };
  const vc=$('#vocabCategory'),vi=$('#vocabItem');
  Object.entries(vocab).forEach(([k,v])=>vc.add(new Option(v.label,k)));
  function fillVocabItems(){const cat=vocab[vc.value];vi.innerHTML='';cat.items.forEach((x,i)=>vi.add(new Option(x[0],i)));renderVocab();renderQuickBank();}
  function renderVocab(){const cat=vocab[vc.value],x=cat.items[Number(vi.value)||0];$('#vocabIcon').textContent=cat.icon;$('#vocabCategoryLabel').textContent=cat.label.toUpperCase();$('#vocabEn').textContent=x[0];$('#vocabFr').textContent=x[1];$('#vocabExample').innerHTML='<strong>Example:</strong> '+x[2];$('#vocabExampleFr').textContent=x[3];$('#vocabSpeak').dataset.say=x[2];}
  function renderQuickBank(){const cat=vocab[vc.value];$('#quickBank').innerHTML=cat.items.map(x=>`<button class="quick-chip" type="button" data-say="${escapeHtml(x[2])}">▶ ${escapeHtml(x[0])}</button>`).join('');}
  vc.addEventListener('change',fillVocabItems);vi.addEventListener('change',renderVocab);$('#vocabSpeak').addEventListener('click',()=>speak($('#vocabSpeak').dataset.say));vc.value='collect';fillVocabItems();

  // Grammar lab
  const grammarData=[
    {q:'Choose the correct question about a meeting location.',opts:['Where the meeting is?','Where is the meeting?','Where does the meeting is?'],a:1,h:'With BE, invert be + subject.',e:'Correct: Where is the meeting?'},
    {q:'Choose the correct question about opening time.',opts:['When does the office open?','When the office opens?','When does the office opens?'],a:0,h:'Present simple question = WH + does + subject + base verb.',e:'After does, use the base verb: open.'},
    {q:'Choose the correct polite clarification.',opts:['Could you to repeat the number?','Could you repeat the number?','Could you repeating the number?'],a:1,h:'Modal + base verb.',e:'Could + repeat is the correct structure.'},
    {q:'The room is 214. Choose the correct negative.',opts:["The room doesn't 214.",'The room not is 214.',"The room isn't 214."],a:2,h:'BE makes its own negative.',e:"Use is not / isn't with BE."},
    {q:'The service costs €95. Choose the best information question.',opts:['How much does the service cost?','How many does the service cost?','How much the service costs?'],a:0,h:'Use how much for price and does + base verb.',e:'How much does the service cost?'},
    {q:'There are 12 participants. Choose the best question.',opts:['How much participants are there?','How many participants are there?','How many participants is there?'],a:1,h:'Countable plural → how many + plural noun.',e:'How many participants are there?'},
    {q:'Choose the correct confirmation question.',opts:['Can I confirm the date?','Can I to confirm the date?','Do I can confirm the date?'],a:0,h:'Can + subject + base verb.',e:'Can I confirm…? is correct.'},
    {q:'The office opens at 9. Choose the correct negative.',opts:["The office doesn't opens at 9.","The office doesn't open at 9.",'The office not open at 9.'],a:1,h:'Does not + base verb.',e:"Correct: doesn't open."}
  ];
  function renderGrammar(){
    $('#grammarLab').innerHTML=grammarData.map((x,i)=>`<article class="grammar-item" data-grammar="${i}"><p><strong>${i+1}.</strong> ${escapeHtml(x.q)}</p><div class="grammar-options">${x.opts.map((o,j)=>`<button class="grammar-option ${state.grammar[i]===j?(j===x.a?'correct':'wrong'):''}" type="button" data-gchoice="${j}">${escapeHtml(o)}</button>`).join('')}</div><button class="secondary help-control grammar-hint" type="button">Hint</button><div class="hint-panel">${escapeHtml(x.h)}</div><div class="grammar-feedback ${state.grammar[i]===null?'':state.grammar[i]===x.a?'good':'bad'}">${state.grammar[i]===null?'':state.grammar[i]===x.a?'✓ '+x.e:'✗ '+x.h}</div></article>`).join('');
    $$('.grammar-item').forEach(card=>{const i=+card.dataset.grammar;$$('[data-gchoice]',card).forEach(btn=>btn.addEventListener('click',()=>{state.grammar[i]=+btn.dataset.gchoice;save();renderGrammar();updateReport();}));$('.grammar-hint',card).addEventListener('click',()=>$('.hint-panel',card).classList.toggle('show'));});
  }
  const grammarScore=()=>state.grammar.reduce((n,v,i)=>n+(v===grammarData[i].a),0);

  // Listening capture
  const listeningData=[
    {title:'Message 1 · Meeting update',icon:'🗓️',say:'The project review is on Thursday the fifth of November at ten thirty in Room four B. Please bring the updated budget and the final timeline.',transcript:'The project review is on Thursday 5 November at 10:30 in Room 4B. Please bring the updated budget and the final timeline.',facts:[
      {q:'When?',opts:['Thursday 5 Nov · 10:30','Friday 6 Nov · 10:30','Thursday 5 Nov · 11:30'],a:0},
      {q:'Where?',opts:['Room 4A','Room 4B','Online'],a:1},
      {q:'Action?',opts:['Bring the budget + final timeline','Cancel the review','Send an invoice'],a:0}
    ]},
    {title:'Message 2 · Customer request',icon:'☎️',say:'This is Maya Chen from Northstar Design. I need confirmation for booking B M 2 8 6. There are six people, and we need the service on Monday morning before eleven. Please call me back today.',transcript:'Maya Chen · Northstar Design · booking BM286 · 6 people · Monday morning before 11 · call back today.',facts:[
      {q:'Reference?',opts:['BM268','BM286','BN286'],a:1},
      {q:'How many people?',opts:['6','10','16'],a:0},
      {q:'Next action?',opts:['Email next week','Call back today','Cancel the booking'],a:1}
    ]},
    {title:'Message 3 · Delivery details',icon:'📦',say:'Order K T 9 1 is for eighteen boxes. Delivery is to the West Office at twenty six River Street on Tuesday the tenth before three p.m. The contact person is Sam Patel.',transcript:'Order KT91 · 18 boxes · West Office · 26 River Street · Tuesday 10th before 3 p.m. · Sam Patel.',facts:[
      {q:'Quantity?',opts:['8 boxes','18 boxes','80 boxes'],a:1},
      {q:'Address?',opts:['26 River Street','16 River Street','26 Riverside Road'],a:0},
      {q:'Contact?',opts:['Sam Patel','Maya Chen','Daniel Morris'],a:0}
    ]}
  ];
  function renderListening(){
    let flat=0;
    $('#listeningGrid').innerHTML=listeningData.map((x,cardIndex)=>`<article class="listen-card"><div class="audio-screen"><div class="audio-avatar">${x.icon}</div><h3>${escapeHtml(x.title)}</h3><div class="listen-actions"><button class="secondary" type="button" data-listen-play="${cardIndex}">▶ Play</button><button class="ghost transcript-toggle help-control" type="button" data-transcript="${cardIndex}">Transcript</button></div><p class="transcript hidden" id="transcript${cardIndex}">${escapeHtml(x.transcript)}</p></div><div class="listen-facts">${x.facts.map((f,fi)=>{const idx=flat++;return `<div class="fact-question" data-listenfact="${idx}"><strong>${escapeHtml(f.q)}</strong><div class="fact-options">${f.opts.map((o,j)=>`<button class="fact-option ${state.listening[idx]===j?(j===f.a?'correct':'wrong'):''}" type="button" data-lchoice="${j}">${escapeHtml(o)}</button>`).join('')}</div><div class="listen-feedback">${state.listening[idx]===null?'':state.listening[idx]===f.a?'✓ Correct':'✗ Check the key detail and listen again.'}</div></div>`}).join('')}</div></article>`).join('');
    $$('[data-listen-play]').forEach(b=>b.addEventListener('click',()=>speak(listeningData[+b.dataset.listenPlay].say)));
    $$('[data-transcript]').forEach(b=>b.addEventListener('click',()=>$('#transcript'+b.dataset.transcript).classList.toggle('hidden')));
    let idx=0;listeningData.forEach(x=>x.facts.forEach(f=>{const card=$(`[data-listenfact="${idx}"]`),current=idx;$$('[data-lchoice]',card).forEach(btn=>btn.addEventListener('click',()=>{state.listening[current]=+btn.dataset.lchoice;save();renderListening();updateReport();}));idx++;}));
  }
  function listenScore(){let i=0,c=0;listeningData.forEach(x=>x.facts.forEach(f=>{if(state.listening[i]===f.a)c++;i++;}));return c;}

  // Document lab
  const docData=[
    {q:'Which option matches all three constraints?',opts:['Option A','Option B','Option C'],a:1,e:'Option B is after 12:00, fits 10 people and costs less than €160.'},
    {q:'What is the room for the best option?',opts:['Orchid 2','Maple 1','Orchid 1'],a:1,e:'Option B is in Maple 1.'},
    {q:'Why is Option C unsuitable?',opts:['It is too expensive.','It is full.','It only holds 8 people.'],a:1,e:'Option C is marked Full.'}
  ];
  function renderDocQuestions(){
    $('#docQuestions').innerHTML=docData.map((x,i)=>`<article class="doc-question" data-doc="${i}"><p>${i+1}. ${escapeHtml(x.q)}</p><div class="doc-options">${x.opts.map((o,j)=>`<button class="doc-option ${state.document[i]===j?(j===x.a?'correct':'wrong'):''}" type="button" data-docchoice="${j}">${escapeHtml(o)}</button>`).join('')}</div><div class="lab-feedback ${state.document[i]===null?'':state.document[i]===x.a?'good':'bad'}">${state.document[i]===null?'':state.document[i]===x.a?'✓ '+x.e:'✗ Re-read the constraints and the row.'}</div></article>`).join('');
    $$('.doc-question').forEach(card=>{const i=+card.dataset.doc;$$('[data-docchoice]',card).forEach(btn=>btn.addEventListener('click',()=>{state.document[i]=+btn.dataset.docchoice;save();renderDocQuestions();updateReport();}));});
  }
  $('#checkDocSummary').addEventListener('click',()=>{const val=normalize($('#docSummary').value),keys=['option b','12 30','14 30','maple 1','12','150'];const hits=keys.filter(k=>val.includes(k)).length;state.docSummaryChecked=true;state.docSummaryScore=hits;save();const f=$('#docSummaryFeedback');f.className='lab-feedback '+(hits>=5?'good':'bad');f.textContent=hits>=5?`✓ Strong transfer: ${hits}/6 key details present.`:`${hits}/6 key details found. Check option, time, room, capacity and price.`;updateReport();});
  $('#docSummaryHint').addEventListener('click',()=>$('#docHintPanel').classList.toggle('show'));
  $('#docSummaryModel').addEventListener('click',()=>$('#docModelPanel').classList.toggle('hidden'));
  function docPercent(){const mc=state.document.reduce((n,v,i)=>n+(v===docData[i].a),0);const total=3+6;const c=mc+Math.min(state.docSummaryScore,6);return Math.round(c/total*100);}

  // Reformulation
  const reformData=[
    {source:'“The appointment is Thursday at 2 p.m. in Office 5. Please arrive ten minutes early and bring photo ID.”',opts:['The appointment is Thursday at 2 in Office 5. Arrive 10 minutes early with photo ID.','The appointment is probably Thursday afternoon.','Bring photo ID to Office 5 whenever you can.'],a:0},
    {source:'“We have 24 units in stock. The price is €18 per unit. Orders placed today leave the warehouse tomorrow.”',opts:['There are 24 units at €18 each, and an order today ships tomorrow.','The order costs €24 and leaves today.','There are 18 units and delivery takes 24 days.'],a:0},
    {source:'“The webinar starts at 9:15. The access link arrives by email at 8:45. Technical support is available from 8:30.”',opts:['Support starts at 8:30, the link arrives at 8:45, and the webinar starts at 9:15.','The webinar starts at 8:30.','The link and the webinar both start at 8:45.'],a:0},
    {source:'“The customer needs a vegetarian meal and an aisle seat. Their booking reference is PF620.”',opts:['Booking PF620: vegetarian meal + aisle seat requested.','The customer has seat PF620 and needs meat.','The customer wants a window seat.'],a:0},
    {source:'“Send the signed form to finance@northline.example before Friday noon. Keep a copy in the project folder.”',opts:['Send the signed form before Friday noon and keep a project-folder copy.','Send the project folder to finance on Friday evening.','The form does not need a copy.'],a:0}
  ];
  function renderReform(){
    $('#reformLab').innerHTML=reformData.map((x,i)=>`<article class="reform-item" data-reform="${i}"><p class="mini-label">SOURCE ${i+1}</p><div class="reform-source">${escapeHtml(x.source)}</div><div class="reform-options">${x.opts.map((o,j)=>`<button class="reform-option ${state.reform[i]===j?(j===x.a?'correct':'wrong'):''}" type="button" data-rchoice="${j}">${escapeHtml(o)}</button>`).join('')}</div><div class="lab-feedback ${state.reform[i]===null?'':state.reform[i]===x.a?'good':'bad'}">${state.reform[i]===null?'':state.reform[i]===x.a?'✓ Same meaning, clearer format.':'✗ A fact changed or disappeared.'}</div></article>`).join('');
    $$('.reform-item').forEach(card=>{const i=+card.dataset.reform;$$('[data-rchoice]',card).forEach(btn=>btn.addEventListener('click',()=>{state.reform[i]=+btn.dataset.rchoice;save();renderReform();updateReport();}));});
  }
  const reformScore=()=>state.reform.reduce((n,v,i)=>n+(v===reformData[i].a),0);

  // Writing transfer
  const writeFormat=$('#writeFormat');writeFormat.value=state.writingFormat||'message';
  const writeModels={
    message:`<article><span>A2+</span><p><strong>From:</strong> Daniel Morris, Greenfield Services<br><strong>Order:</strong> RK472<br><strong>Need:</strong> 12 units for Lyon office<br><strong>Delivery:</strong> Friday 6 November before 2 p.m.<br><strong>Action:</strong> Confirm availability by email today.</p></article><article><span>B1+</span><p>Daniel Morris from Greenfield Services called about order RK472. He needs 12 units delivered to the Lyon office on Friday 6 November before 2 p.m. Please confirm availability by email today.</p></article>`,
    bullets:`<article><span>A2+</span><p>• Daniel Morris · Greenfield Services<br>• Order RK472 · 12 units<br>• Lyon office<br>• Friday 6 November · before 2 p.m.<br>• Confirm availability by email today</p></article><article><span>B1+</span><p>• Request from Daniel Morris, Greenfield Services<br>• Order reference: RK472; quantity: 12 units<br>• Destination: Lyon office<br>• Required delivery: Friday 6 November before 2 p.m.<br>• Action today: email confirmation of availability</p></article>`,
    email:`<article><span>A2+</span><p>Hello,<br>Daniel Morris from Greenfield Services needs 12 units for order RK472. Delivery is to the Lyon office on Friday 6 November before 2 p.m. Please confirm availability by email today.<br>Thank you.</p></article><article><span>B1+</span><p>Hello,<br>Daniel Morris from Greenfield Services has requested 12 units for order RK472, to be delivered to the Lyon office on Friday 6 November before 2 p.m. Please confirm availability by email today so we can finalise the request.<br>Kind regards,</p></article>`
  };
  function renderWriteModels(){$('#writingModelPanel').innerHTML=writeModels[writeFormat.value];}
  renderWriteModels();writeFormat.addEventListener('change',()=>{state.writingFormat=writeFormat.value;save();renderWriteModels();$('#writingModelPanel').classList.add('hidden');});
  $('#writingHint').addEventListener('click',()=>$('#writingHintPanel').classList.toggle('show'));
  $('#writingModels').addEventListener('click',()=>{$('#writingModelPanel').classList.toggle('hidden');renderWriteModels();});
  $('#checkWriting').addEventListener('click',()=>{const val=normalize($('#writingAnswer').value);const groups=[['daniel morris'],['greenfield'],['rk472','rk 472'],['12','twelve'],['lyon'],['friday','6 november','sixth of november'],['2 p m','2 pm','14 00','14'],['confirm','availability','email','today']];const hits=groups.filter(g=>g.some(k=>val.includes(k))).length;state.writingChecked=true;state.writingScore=hits;save();const f=$('#writingFeedback');f.className='lab-feedback '+(hits>=7?'good':'bad');f.textContent=hits>=7?`✓ ${hits}/8 key information groups are present. The essential message is complete.`:`${hits}/8 key information groups found. Check names, reference, quantity, destination, deadline and action.`;updateReport();});

  // Oral reformulation + recorder
  const oralData=[
    {level:'GUIDED · AUDIO',title:'Appointment information',brief:'Listen once or twice, take keyword notes, then give a 20–30 second oral summary.',sourceType:'Audio message',say:'The supplier meeting is on Wednesday the fourth at eleven a.m. on Teams. The contact is Helen Brooks. Please review quotation Q 3 1 8 before the call and send any questions by Tuesday afternoon.',hint:'Catch: Wednesday 4th · 11 a.m. · Teams · Helen Brooks · Q318 · review quotation · questions by Tuesday afternoon.',a2:'The supplier meeting is Wednesday at 11 on Teams. The contact is Helen Brooks. We need to review quotation Q318 and send questions by Tuesday afternoon.',b1:'The supplier meeting with Helen Brooks is scheduled for Wednesday the 4th at 11 a.m. on Teams. Before the call, we need to review quotation Q318 and send any questions by Tuesday afternoon.'},
    {level:'PRACTICE · AUDIO',title:'Service request',brief:'Listen, identify the request and constraints, then reformulate the essential facts.',sourceType:'Audio message',say:'Hi, this is Omar Lewis from Central Retail. We need a technician for site C 14 on Friday morning. The store opens at ten, so the visit must finish before nine thirty. Please confirm the technician name and arrival time today.',hint:'WHO / WHERE / WHEN / CONSTRAINT / ACTION.',a2:'Omar Lewis needs a technician for site C14 on Friday morning. The visit must finish before 9:30. We need to confirm the technician name and arrival time today.',b1:'Omar Lewis from Central Retail is requesting a technician for site C14 on Friday morning. Because the store opens at 10, the visit must be completed before 9:30. We should confirm the technician’s name and arrival time today.'},
    {level:'INDEPENDENT · AUDIO',title:'Order change',brief:'Listen and give the important facts in a clear order. Avoid repeating the source word for word.',sourceType:'Audio message',say:'Order D M 5 0 9 is now for thirty chairs, not twenty. Delivery remains at the South Conference Centre on Monday the ninth, between eight and ten a.m. The invoice address does not change. Please update the quantity and send the revised confirmation.',hint:'Reference · changed quantity · delivery unchanged · invoice unchanged · next action.',a2:'Order DM509 is for 30 chairs, not 20. Delivery is still Monday the 9th from 8 to 10 at the South Conference Centre. The invoice address is the same. We need to update the quantity and send a new confirmation.',b1:'For order DM509, the quantity changes from 20 to 30 chairs. Delivery stays at the South Conference Centre on Monday the 9th between 8 and 10 a.m., and the invoice address remains unchanged. The next step is to update the quantity and send a revised confirmation.'}
  ];
  function renderOral(){
    $('#oralTabs').innerHTML=oralData.map((x,i)=>`<button class="role-tab ${state.oralIndex===i?'active':''}" type="button" data-oral-tab="${i}">${i+1} · ${escapeHtml(x.title)}</button>`).join('');
    const x=oralData[state.oralIndex];$('#oralLevel').textContent=x.level;$('#oralTitle').textContent=x.title;$('#oralBrief').textContent=x.brief;$('#oralSourceType').textContent=x.sourceType;$('#oralHintPanel').textContent=x.hint;$('#oralModelPanel').innerHTML=`<article><span>A2+</span><p>${escapeHtml(x.a2)}</p></article><article><span>B1+</span><p>${escapeHtml(x.b1)}</p></article>`;$('#oralHintPanel').classList.remove('show');$('#oralModelPanel').classList.add('hidden');$$('[data-oral-tab]').forEach(b=>b.addEventListener('click',()=>{state.oralIndex=+b.dataset.oralTab;save();renderOral();}));
  }
  renderOral();
  $('#oralPlay').addEventListener('click',()=>speak(oralData[state.oralIndex].say));
  $('#oralHint').addEventListener('click',()=>$('#oralHintPanel').classList.toggle('show'));
  $('#oralModels').addEventListener('click',()=>$('#oralModelPanel').classList.toggle('hidden'));
  $$('[data-oralcheck]').forEach((cb,i)=>{cb.checked=!!state.oralChecks[i];cb.addEventListener('change',()=>{state.oralChecks[i]=cb.checked;save();updateReport();});});

  let mediaRecorder=null,chunks=[],recordTimer=null,recordSeconds=0,recordUrl=null;
  function paintRecordTime(){const m=Math.floor(recordSeconds/60),s=recordSeconds%60;$('#recordTime').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
  $('#recordBtn').addEventListener('click',async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};mediaRecorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(recordUrl)URL.revokeObjectURL(recordUrl);const blob=new Blob(chunks,{type:mediaRecorder.mimeType||'audio/webm'});recordUrl=URL.createObjectURL(blob);$('#recordingPlayback').src=recordUrl;$('#recordingPlayback').classList.remove('hidden');$('#recordStatus').textContent='Recording ready';};mediaRecorder.start();recordSeconds=0;paintRecordTime();recordTimer=setInterval(()=>{recordSeconds++;paintRecordTime();},1000);$('#recordDot').classList.add('live');$('#recordStatus').textContent='Recording';$('#recordBtn').disabled=true;$('#stopBtn').disabled=false;}catch{$('#recordStatus').textContent='Microphone unavailable';toast('Please allow microphone access in your browser settings.');}});
  $('#stopBtn').addEventListener('click',()=>{if(mediaRecorder?.state==='recording')mediaRecorder.stop();clearInterval(recordTimer);$('#recordDot').classList.remove('live');$('#recordBtn').disabled=false;$('#stopBtn').disabled=true;});

  // Training timer
  let timerRemaining=90,timerInterval=null;
  function paintTimer(){const m=Math.floor(timerRemaining/60),s=timerRemaining%60;$('#trainingTimer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');$('#trainingTimerBar').style.width=(timerRemaining/90*100)+'%';$('#timerCoach').textContent=timerRemaining>70?'Phase 1: identify the task and source.':timerRemaining>40?'Phase 2: capture WHO / WHAT / WHEN / WHERE / NUMBER / ACTION.':timerRemaining>0?'Phase 3: reformulate, transcribe and check precise details.':'Time. Finish the sentence calmly, then review.';}
  function resetTimer(){clearInterval(timerInterval);timerRemaining=90;paintTimer();$('#timerStart').disabled=false;}
  $('#timerStart').addEventListener('click',()=>{clearInterval(timerInterval);$('#timerStart').disabled=true;timerInterval=setInterval(()=>{timerRemaining--;paintTimer();if(timerRemaining<=0){clearInterval(timerInterval);$('#timerStart').disabled=false;toast('Training time finished. Review accuracy before speed.');}},1000);});$('#timerReset').addEventListener('click',resetTimer);paintTimer();

  // Preview
  const previewData=[
    {type:'single',title:'Read the message',prompt:'Message: “Nora Bell · appointment moved to Tuesday 3rd · 14:00 · Room 6.” What time is the appointment?',opts:['12:00','14:00','16:00'],a:[1],review:'Key fact: Tuesday 3rd at 14:00 in Room 6.'},
    {type:'multi',title:'Listen for two details',prompt:'Listen and select the TWO correct facts.',say:'Reference H P 7 4 is for nine participants. The session is online on Thursday at four p.m. Please send the access link before noon.',opts:['Reference HP74','19 participants','9 participants','In-person session'],a:[0,2],review:'Reference HP74; 9 participants; online Thursday at 4 p.m.; send link before noon.'},
    {type:'single',title:'Use the table',prompt:'Option X: 09:00 · €80 · 6 places · Available. Option Y: 13:00 · €95 · 10 places · Available. A team of 8 needs an afternoon option. Which is correct?',opts:['Option X','Option Y','Neither'],a:[1],review:'Option Y is in the afternoon and has capacity for 10.'},
    {type:'text',title:'Short reformulation',prompt:'Source: “The delivery is Friday morning at 8:30 to the East Office. Contact: Priya Shah. Reference: LS204.” Write one short sentence with the essential information.',keywords:['friday','8 30','east office','priya shah','ls204'],threshold:4,review:'Model: Delivery LS204 is Friday at 8:30 a.m. to the East Office; contact Priya Shah.'},
    {type:'text',title:'Transcribe into a message note',prompt:'Source: “Leo Grant from Harbour Tech needs 5 licences for project P18 by Monday. Confirm the price by email today.” Write a compact message note.',keywords:['leo grant','harbour tech','5','p18','monday','price','email','today'],threshold:6,review:'Include contact, company, quantity, project, deadline and action.'},
    {type:'manual',title:'Open written production',prompt:'Audio source: “The room changes from Cedar 3 to Cedar 5. The start time stays at 10:00. Please inform the eight attendees before 5 p.m. today.” Write a clear two-sentence internal update.',say:'The room changes from Cedar three to Cedar five. The start time stays at ten a.m. Please inform the eight attendees before five p.m. today.',review:'Trainer review: check accuracy, clarity, reformulation and whether all required facts are present.'},
    {type:'oral',title:'Oral reformulation',prompt:'Listen, take notes, then give a 20–30 second oral summary.',say:'The client call is with Marcus Reed on Wednesday at two thirty p.m. The topic is contract C 8 8. Please have the revised pricing ready and send the final agenda before noon.',review:'Model facts: Marcus Reed · Wednesday 2:30 p.m. · contract C88 · revised pricing · final agenda before noon.'}
  ];
  let previewIndex=0,previewRemaining=75,previewInterval=null;
  function previewTaskHtml(x){let body=`<p class="mini-label">${escapeHtml(x.title)}</p><h3>${x.type==='oral'?'Listen, note, then speak.':x.type==='manual'?'Produce a clear written transfer.':'Find and transfer the useful information.'}</h3><div class="preview-prompt">${escapeHtml(x.prompt)}</div>`;if(x.say)body+=`<button class="secondary" type="button" id="previewPlay">▶ Play source</button>`;if(x.type==='single'||x.type==='multi')body+=`<div class="preview-options">${x.opts.map((o,j)=>`<button class="preview-option" type="button" data-popt="${j}">${escapeHtml(o)}</button>`).join('')}</div>${x.type==='multi'?'<p class="tiny">Select two answers.</p>':''}`;if(x.type==='text'||x.type==='manual')body+=`<textarea id="previewText" placeholder="Write your response here..."></textarea>`;if(x.type==='oral')body+=`<div class="notice neutral"><strong>Speak aloud or use the recorder in Step 9.</strong> Oral quality is reviewed with your trainer.</div><label class="oral-done"><input id="oralDone" type="checkbox"> I completed this oral response.</label>`;return body;}
  function renderPreview(){clearInterval(previewInterval);const x=previewData[previewIndex];$('#previewCounter').textContent=`Task ${previewIndex+1} of ${previewData.length}`;$('#previewProgress').style.width=(previewIndex/previewData.length*100)+'%';$('#previewTask').innerHTML=previewTaskHtml(x);previewRemaining=x.type==='oral'?90:75;paintPreviewTimer();previewInterval=setInterval(()=>{previewRemaining--;paintPreviewTimer();if(previewRemaining<=0)clearInterval(previewInterval);},1000);if(x.say)$('#previewPlay').addEventListener('click',()=>speak(x.say));const saved=state.previewAnswers[previewIndex];if((x.type==='text'||x.type==='manual')&&typeof saved==='string')$('#previewText').value=saved;if(x.type==='oral'&&saved==='completed')$('#oralDone').checked=true;if(x.type==='single'||x.type==='multi'){$$('[data-popt]').forEach((b,j)=>{if(Array.isArray(saved)&&saved.includes(j))b.classList.add('selected');b.addEventListener('click',()=>{if(x.type==='single')state.previewAnswers[previewIndex]=[j];else{let a=Array.isArray(state.previewAnswers[previewIndex])?[...state.previewAnswers[previewIndex]]:[];a=a.includes(j)?a.filter(v=>v!==j):[...a,j];if(a.length>2)a=a.slice(-2);state.previewAnswers[previewIndex]=a;}save();$$('[data-popt]').forEach((p,k)=>p.classList.toggle('selected',(state.previewAnswers[previewIndex]||[]).includes(k)));});});}}
  function paintPreviewTimer(){const m=Math.floor(previewRemaining/60),s=previewRemaining%60;$('#previewTimer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
  function saveCurrentPreview(){const x=previewData[previewIndex];if(x.type==='text'||x.type==='manual')state.previewAnswers[previewIndex]=$('#previewText').value.trim();if(x.type==='oral')state.previewAnswers[previewIndex]=$('#oralDone').checked?'completed':'not completed';save();}
  function nextPreview(skip=false){if(!skip)saveCurrentPreview();else{state.previewAnswers[previewIndex]=null;save();}if(previewIndex<previewData.length-1){previewIndex++;renderPreview();}else finishPreview();}
  function objectivePreviewScore(){let c=0,total=0;previewData.forEach((x,i)=>{if(x.type==='single'||x.type==='multi'){total++;const ans=(state.previewAnswers[i]||[]).slice().sort().join(','),right=x.a.slice().sort().join(',');if(ans===right)c++;}else if(x.type==='text'){total++;const val=normalize(state.previewAnswers[i]);const hits=x.keywords.filter(k=>val.includes(k)).length;if(hits>=x.threshold)c++;}});return {c,total};}
  function finishPreview(){clearInterval(previewInterval);saveCurrentPreview();state.previewFinished=true;save();$('#previewShell').classList.add('hidden');const sc=objectivePreviewScore();$('#examScoreBadge').textContent=`${sc.c} / ${sc.total} objective`;$('#previewResults').classList.remove('hidden');$('#previewResults').innerHTML=`<p class="eyebrow">PART 2 PREVIEW COMPLETE</p><h2>${sc.c} / ${sc.total} objective tasks correct</h2><p>The final two productions require trainer/self review. This is a training result, not an official CEFR score.</p><div class="review-list">${previewData.map((x,i)=>`<div class="review-item"><strong>Task ${i+1} · ${escapeHtml(x.title)}</strong><span>${escapeHtml(x.review)}</span></div>`).join('')}</div><div class="button-row"><button class="primary" id="retryPreview" type="button">Try preview again</button></div>`;$('#retryPreview').addEventListener('click',startPreview);updateReport();}
  function startPreview(){previewIndex=0;state.previewAnswers=Array(previewData.length).fill(null);state.previewFinished=false;save();$('#examIntro').classList.add('hidden');$('#previewResults').classList.add('hidden');$('#previewShell').classList.remove('hidden');renderPreview();$('#examPreview').scrollIntoView({behavior:'smooth',block:'start'});}
  $('#startPreview').addEventListener('click',startPreview);$('#previewNext').addEventListener('click',()=>nextPreview(false));$('#previewSkip').addEventListener('click',()=>nextPreview(true));

  // Report + tracking
  const lessonUrl=$('#lessonUrl'),overallStatus=$('#overallStatus'),nextSteps=$('#nextSteps'),trainerNotes=$('#trainerNotes');
  lessonUrl.value=state.lessonUrl||'';overallStatus.value=state.overallStatus||'En cours';nextSteps.value=state.nextSteps||'';trainerNotes.value=state.trainerNotes||'';
  [['lessonUrl','lessonUrl'],['overallStatus','overallStatus'],['nextSteps','nextSteps'],['trainerNotes','trainerNotes']].forEach(([id,key])=>$('#'+id).addEventListener('input',e=>{state[key]=e.target.value;save();}));overallStatus.addEventListener('change',e=>{state.overallStatus=e.target.value;save();});
  function updateReport(){const gs=grammarScore(),ls=listenScore(),dp=docPercent(),rs=reformScore(),os=state.oralChecks.filter(Boolean).length,ps=objectivePreviewScore();$('#reportGrammar').textContent=`${gs} / ${grammarData.length}`;$('#reportListening').textContent=`${ls} / 9`;$('#listenScore').textContent=`${ls} / 9`;$('#reportDocument').textContent=`${dp}%`;$('#reportReform').textContent=`${rs} / ${reformData.length}`;$('#reformScore').textContent=`${rs} / ${reformData.length}`;$('#reportWriting').textContent=state.writingChecked?`${state.writingScore} / 8 facts`:'Not checked';$('#reportOral').textContent=`${os} / 5`;$('#reportPreview').textContent=`${ps.c} / ${ps.total}`;$('#examScoreBadge').textContent=`${ps.c} / ${ps.total} objective`;}
  function reportText(){const ps=objectivePreviewScore();return ['LILATE — LESSON 3 · RECUEIL & TRANSCRIPTION','','TRAINING NOTICE','Independent training resource — not the official LILATE exam or an official CEFR result.','',`Grammar & questions: ${grammarScore()} / ${grammarData.length}`,`Listening capture: ${listenScore()} / 9`,`Document extraction & transfer: ${docPercent()}%`,`Reformulation: ${reformScore()} / ${reformData.length}`,`Written transcription: ${state.writingChecked?state.writingScore+' / 8 key facts':'Not checked'}`,`Oral self-check: ${state.oralChecks.filter(Boolean).length} / 5`,`Part 2 preview objective tasks: ${ps.c} / ${ps.total}`,'','PART 2 ROUTE','COLLECT → CONFIRM → SELECT → REFORMULATE → TRANSCRIBE → CHECK','','LESSON URL',lessonUrl.value.trim()||'—','','OVERALL STATUS',overallStatus.value,'','NEXT STEPS',nextSteps.value.trim()||'—','','TRAINER NOTES',trainerNotes.value.trim()||'—','',`Generated: ${new Date().toLocaleString()}`].join('\n');}
  function trackingLine(){const ps=objectivePreviewScore();const fields=['Lesson 3 · Part 2 · Recueil & transcription','Part 2 format; information map; question formation; listening capture; document/table analysis; reformulation; transcription; oral summary; exam preview','Grammar MCQ; listening fact selection; document QCU; written transfer; reformulation MCQ; recording; timed preview',`Grammar ${grammarScore()}/${grammarData.length} | Listening ${listenScore()}/9 | Document ${docPercent()}% | Reformulation ${reformScore()}/${reformData.length} | Writing ${state.writingChecked?state.writingScore+'/8':'NC'} | Oral ${state.oralChecks.filter(Boolean).length}/5 | Preview ${ps.c}/${ps.total}`,'Listening; Reading; Speaking; Writing; information gathering; reformulation; transcription',nextSteps.value.trim()||'Review weak information-transfer points',overallStatus.value,lessonUrl.value.trim()||'—'];return fields.map(v=>String(v).replace(/\t/g,' ')).join('\t');}
  async function copyText(text){try{await navigator.clipboard.writeText(text);return true}catch{return false}}
  function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
  $('#copyTracking').addEventListener('click',async()=>{const ok=await copyText(trackingLine());$('#reportMessage').textContent=ok?'Centre tracking line copied — paste directly into a spreadsheet.':'Copy unavailable in this browser.';if(ok)toast('Tracking line copied.');});
  $('#copyReport').addEventListener('click',async()=>{const ok=await copyText(reportText());$('#reportMessage').textContent=ok?'Full results copied.':'Copy unavailable. Please use download.';if(ok)toast('Results copied.');});
  $('#downloadReport').addEventListener('click',()=>{downloadBlob(new Blob([reportText()],{type:'text/plain;charset=utf-8'}),'LILATE-Lesson-3-Recueil-Transcription-Report.txt');$('#reportMessage').textContent='TXT report downloaded.';});
  $('#downloadHtmlReport').addEventListener('click',()=>{const ps=objectivePreviewScore();const html=`<!doctype html><html><head><meta charset="utf-8"><title>LILATE Lesson 3 Report</title><style>body{font-family:Arial,sans-serif;background:#f5faf7;color:#14201c;margin:0;padding:35px}.wrap{max-width:900px;margin:auto}.hero{background:#173c31;color:white;padding:28px;border-radius:22px}.hero span{color:#74ebc7}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:18px 0}.card,section{background:white;border:1px solid #d8e6df;border-radius:16px;padding:18px}.card strong{display:block;font-size:28px;margin-top:8px}.route{background:#ddfaef;padding:14px;border-radius:12px;font-weight:bold}pre{white-space:pre-wrap;font:inherit}@media(max-width:600px){.grid{grid-template-columns:1fr}}</style></head><body><div class="wrap"><div class="hero"><small>LILATE · TRAINING</small><h1>Lesson 3 · <span>Recueil & transcription</span></h1><p>Independent training report — not an official LILATE or CEFR result.</p></div><div class="grid"><div class="card">Grammar<strong>${grammarScore()}/${grammarData.length}</strong></div><div class="card">Listening<strong>${listenScore()}/9</strong></div><div class="card">Document<strong>${docPercent()}%</strong></div><div class="card">Reformulation<strong>${reformScore()}/${reformData.length}</strong></div><div class="card">Writing facts<strong>${state.writingChecked?state.writingScore+'/8':'NC'}</strong></div><div class="card">Oral self-check<strong>${state.oralChecks.filter(Boolean).length}/5</strong></div><div class="card">Preview<strong>${ps.c}/${ps.total}</strong></div></div><section><h2>Part 2 route</h2><div class="route">COLLECT → CONFIRM → SELECT → REFORMULATE → TRANSCRIBE → CHECK</div></section><section><h2>Status & next steps</h2><p><strong>${escapeHtml(overallStatus.value)}</strong></p><pre>${escapeHtml(nextSteps.value.trim()||'—')}</pre></section><section><h2>Trainer notes</h2><pre>${escapeHtml(trainerNotes.value.trim()||'—')}</pre></section><section><h2>Lesson URL</h2><pre>${escapeHtml(lessonUrl.value.trim()||'—')}</pre></section><p>Generated ${new Date().toLocaleString()}</p></div></body></html>`;downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),'LILATE-Lesson-3-Readable-Report.html');$('#reportMessage').textContent='Readable HTML report downloaded.';});

  // Per-section reset
  function resetSection(name){
    if(name==='grammar'){state.grammar=Array(8).fill(null);renderGrammar();}
    if(name==='listening'){state.listening=Array(9).fill(null);renderListening();}
    if(name==='document'){state.document=Array(3).fill(null);state.docSummaryChecked=false;state.docSummaryScore=0;$('#docSummary').value='';$('#docSummaryFeedback').textContent='';$('#docHintPanel').classList.remove('show');$('#docModelPanel').classList.add('hidden');renderDocQuestions();}
    if(name==='reform'){state.reform=Array(5).fill(null);renderReform();}
    if(name==='writing'){state.writingChecked=false;state.writingScore=0;$('#writingAnswer').value='';$('#writingFeedback').textContent='';$('#writingHintPanel').classList.remove('show');$('#writingModelPanel').classList.add('hidden');}
    if(name==='oral'){state.oralChecks=Array(5).fill(false);$$('[data-oralcheck]').forEach(x=>x.checked=false);if(mediaRecorder?.state==='recording')mediaRecorder.stop();clearInterval(recordTimer);$('#recordingPlayback').classList.add('hidden');$('#recordingPlayback').removeAttribute('src');$('#recordStatus').textContent='Ready';recordSeconds=0;paintRecordTime();}
    save();updateReport();toast('Section reset.');
  }
  $$('.section-reset').forEach(b=>b.addEventListener('click',()=>resetSection(b.dataset.reset)));

  // Full reset
  $('#resetBtn').addEventListener('click',()=>{
    if(!confirm('Reset all Lesson 3 answers, notes and progress?'))return;
    safeStorage.remove(STORE);state=defaultState();
    $('#docSummary').value='';$('#writingAnswer').value='';lessonUrl.value='';nextSteps.value='';trainerNotes.value='';overallStatus.value='En cours';writeFormat.value='message';
    frToggle.checked=true;document.body.classList.remove('fr-off');trainingMode.value='guided';voiceAccent.value='en-GB';fontSize=16;document.documentElement.style.setProperty('--font-size','16px');applyMode(false);
    $$('[data-oralcheck]').forEach(x=>x.checked=false);$('#docSummaryFeedback').textContent='';$('#writingFeedback').textContent='';$('#previewResults').classList.add('hidden');$('#previewShell').classList.add('hidden');$('#examIntro').classList.remove('hidden');$('#docHintPanel').classList.remove('show');$('#docModelPanel').classList.add('hidden');$('#writingHintPanel').classList.remove('show');$('#writingModelPanel').classList.add('hidden');gate.classList.remove('accepted');disclaimerCheck.checked=false;enterBtn.disabled=true;resetTimer();renderGrammar();renderListening();renderDocQuestions();renderReform();renderOral();renderWriteModels();updateReport();window.scrollTo({top:0,behavior:'smooth'});
  });

  // Restore text field content where appropriate
  $('#docSummary').addEventListener('input',()=>{state.docSummaryText=$('#docSummary').value;save();});
  $('#writingAnswer').addEventListener('input',()=>{state.writingText=$('#writingAnswer').value;save();});
  if(state.docSummaryText)$('#docSummary').value=state.docSummaryText;if(state.writingText)$('#writingAnswer').value=state.writingText;

  renderGrammar();renderListening();renderDocQuestions();renderReform();updateReport();
})();
