'use strict';
const STORAGE_KEY='se_mc_boston_everyday_v1';
const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const escapeHtml=(s='')=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
let state={answers:{},tasks:{},notes:'',speakingEval:'',interactionEval:'',trainerComments:'',confidenceRating:'',easyArea:'',favoritePhrase:'',fr:true,voice:'en-US',speed:'0.90',mode:'coach',font:1};
try{state={...state,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch(e){}
const save=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200)};
const normalize=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ').trim();

const vocab={
  'The T & transit':[
    ['🚇','the T','le métro de Boston','the common local name for Boston’s subway system','Is the T the easiest way to get there?'],
    ['🧭','Which line do I need?','Quelle ligne dois-je prendre ?','a simple way to ask which subway line to use','Excuse me, which line do I need for downtown?'],
    ['⬆️','get on','monter dans','enter a train or bus','We get on here and ride for three stops.'],
    ['⬇️','get off','descendre de','leave a train or bus','Where do we get off?'],
    ['🔁','change / transfer','changer / faire une correspondance','move from one line or service to another','Do we need to change lines?'],
    ['🎫','fare','tarif / prix du trajet','the price you pay for a ride','Do you know how much the fare is?'],
    ['📍','stop / station','arrêt / station','a place where transit picks up or drops off passengers','Is this the right stop?']
  ],
  'Walking & directions':[
    ['🚶','within walking distance','accessible à pied','close enough to walk comfortably','Is the museum within walking distance?'],
    ['🏙️','block','pâté de maisons','the distance between two cross streets','Go straight for two blocks.'],
    ['↪️','turn left / right','tourner à gauche / droite','change direction at a street or corner','Turn right at the next light.'],
    ['🚦','traffic light','feu de circulation','a signal controlling traffic','Turn left at the traffic light.'],
    ['🚸','crosswalk','passage piéton','the marked place where pedestrians cross','Use the crosswalk to cross the street.'],
    ['📐','corner','coin / angle de rue','the point where two streets meet','The café is on the corner.'],
    ['👀','across from','en face de','on the opposite side','The entrance is across from the park.']
  ],
  'Family plans':[
    ['🤝','meet up','se retrouver','meet someone socially at an arranged place','Where should we meet up later?'],
    ['➡️','head to','se diriger vers','go toward a place','We can head to Beacon Hill after lunch.'],
    ['⏳','I’m on my way','je suis en route','say that you have started travelling to the meeting point','Don’t worry, I’m on my way.'],
    ['🕒','I should be there in…','je devrais être là dans…','give an approximate arrival time','I should be there in about ten minutes.'],
    ['✅','That works for me','ça me convient','agree with a plan naturally','Six o’clock? That works for me.'],
    ['👌','Sounds good','ça me va / bonne idée','react positively to a suggestion','Lunch first? Sounds good.'],
    ['🔄','change the plan','changer le programme','make a different arrangement','We may need to change the plan.']
  ],
  'Food & everyday stops':[
    ['☕','get a coffee','prendre un café','have or buy a coffee in a natural everyday way','Do you want to get a coffee first?'],
    ['🥪','get something to eat','prendre quelque chose à manger','buy or have food without specifying a full meal','Let’s get something to eat nearby.'],
    ['🛍️','pick something up','aller chercher / acheter rapidement','collect or buy something','I need to pick up a few things.'],
    ['💊','pharmacy / drugstore','pharmacie','a place that sells medicine and everyday items','Is there a pharmacy around here?'],
    ['🚻','restroom','toilettes','the common polite US word for a public toilet','Excuse me, where is the restroom?'],
    ['💳','Can I pay by card?','Je peux payer par carte ?','ask about payment method','Can I pay by card?'],
    ['🧾','Could we have the check, please?','L’addition, s’il vous plaît.','ask for the restaurant bill in American English','Could we have the check, please?']
  ],
  'Natural reactions':[
    ['💬','That sounds good','ça a l’air bien','react positively to an idea','That sounds good. Let’s do that.'],
    ['🙂','No problem','pas de problème','respond politely when something changes','No problem. I can meet you there.'],
    ['🫶','Take your time','prends ton temps','tell someone there is no need to hurry','Take your time. I’ll wait here.'],
    ['👂','I didn’t catch that','je n’ai pas bien compris / entendu','ask for repetition naturally','Sorry, I didn’t catch that.'],
    ['🔁','Could you say that again?','Pouvez-vous répéter ?','polite repetition request','Could you say that again, please?'],
    ['🧠','Let me think','laissez-moi réfléchir','gain a little thinking time','Let me think. I think walking is easier.'],
    ['👍','That makes sense','c’est logique','show that you understand an explanation','Okay, that makes sense.']
  ]
};

const quizGroups={
 vocab:{label:'Vocabulary',container:'vocabQuiz',score:'vocabScore',total:'vocabTotal',items:[
  ['v1','You are already travelling to meet your family. What do you say?',['I’m on my way.','I make my road.','I am in the route.'],'I’m on my way.','Use this to reassure someone that you have started travelling.'],
  ['v2','You want to know whether you can walk there comfortably.',['Is it within walking distance?','Is it by feet?','Can I foot there?'],'Is it within walking distance?','This is a very natural everyday question.'],
  ['v3','You want to leave the subway at the correct station.',['Where do we get off?','Where do we go down?','Where do we descend?'],'Where do we get off?','Use get off for buses, trains and the subway.'],
  ['v4','A family member suggests meeting at 6:00 and you agree.',['That works for me.','That functions for me.','I am accord.'],'That works for me.','A natural, neutral way to agree with a plan.'],
  ['v5','You want to ask for the bill in a Boston restaurant.',['Could we have the check, please?','Give us the note, please.','Can we have the addition?'],'Could we have the check, please?','In American English, check is the usual restaurant word.'],
  ['v6','You did not hear the last part clearly.',['Sorry, I didn’t catch that.','Sorry, I didn’t take that.','Sorry, I didn’t listen that.'],'Sorry, I didn’t catch that.','Catch is common and neutral for understanding spoken information.']
 ]},
 natural:{label:'Natural English',container:'naturalQuiz',score:'naturalScore',total:'naturalTotal',items:[
  ['n1','You want to ask how to reach a place.',['What’s the easiest way to get there?','How I arrive there?','What is the road for there?'],'What’s the easiest way to get there?','Use get to/get there for reaching a destination.'],
  ['n2','You want to propose a short coffee stop.',['Do you want to get a coffee?','Do you want to take one coffee?','You want a café?'],'Do you want to get a coffee?','Get a coffee is everyday and natural without being slang.'],
  ['n3','You will arrive approximately ten minutes from now.',['I should be there in about ten minutes.','I arrive after ten minutes.','I come in ten minutes later.'],'I should be there in about ten minutes.','Should be signals an approximate expected arrival.'],
  ['n4','You want to confirm a meeting point.',['So we’re meeting outside the station, right?','So we meet us out station, yes?','We rendezvous at exterior?'],'So we’re meeting outside the station, right?','Use present continuous for a fixed arrangement and right? to confirm.'],
  ['n5','Someone changes the plan and it is fine with you.',['No problem. That works for me.','No worry, I accept this proposition.','It is not grave.'],'No problem. That works for me.','Short neutral reactions sound more natural than literal translations.'],
  ['n6','You want to know if a route is simple.',['Is it pretty straightforward from here?','Is the road straightly easy?','It is easy directly?'],'Is it pretty straightforward from here?','Straightforward means simple/easy to follow.'],
  ['n7','You want someone to wait without rushing.',['Take your time.','Take the time of you.','Use your time.'],'Take your time.','A standard, warm everyday expression.'],
  ['n8','You want to suggest walking instead of transit.',['How about walking?','How about to walk?','How if we walking?'],'How about walking?','How about is followed by -ing.']
 ]},
 listening:{label:'Listening',container:'listeningQuiz',score:null,total:null,items:[
  ['l1','Where is the visitor at the start?',['Near Back Bay Station.','Inside Boston Common.','In the North End.'],'Near Back Bay Station.','Listen for the first location mentioned.'],
  ['l2','What are the two travel options?',['Take the T or walk.','Take a taxi or a ferry.','Take a bus or drive.'],'Take the T or walk.','The speaker gives one transit option and one walking option.'],
  ['l3','Which landmark should the visitor head toward?',['The Public Garden.','The airport.','Harvard Square.'],'The Public Garden.','The directions use the Public Garden as the key landmark.'],
  ['l4','What should the visitor do when close?',['Text the family member.','Buy a ticket.','Call a taxi.'],'Text the family member.','The final instruction is to send a text when close.'],
  ['l5','How long should the visitor take?',['About fifteen minutes.','Exactly five minutes.','About forty-five minutes.'],'About fifteen minutes.','The visitor gives an approximate arrival time.']
 ]},
 grammar:{label:'Everyday structures',container:'grammarQuiz',score:'grammarScore',total:'grammarTotal',items:[
  ['g1','You want to suggest walking through the park.',['How about walking through the park?','How about to walk through the park?','How about we to walk through the park?'],'How about walking through the park?','How about + -ing.'],
  ['g2','You want to make a direct friendly suggestion.',['Let’s meet outside the station.','Let’s to meet outside the station.','Let’s meeting outside the station.'],'Let’s meet outside the station.','Let’s + base verb.'],
  ['g3','You want to check which option is better.',['Should we take the T or walk?','Do we should take the T or walk?','Should we taking the T or walk?'],'Should we take the T or walk?','Should + subject + base verb.'],
  ['g4','The arrangement for tonight is fixed.',['We’re meeting everyone at six.','We meet everyone at six yesterday.','We are meet everyone at six.'],'We’re meeting everyone at six.','Present continuous often describes a fixed future arrangement.'],
  ['g5','You have a plan for the afternoon.',['We’re going to spend the afternoon downtown.','We go to spending the afternoon downtown.','We will to spend the afternoon downtown.'],'We’re going to spend the afternoon downtown.','Going to + base verb expresses a plan.'],
  ['g6','You want to ask someone what food they would like.',['What do you feel like eating?','What do you feel to eat?','What are you feel eating?'],'What do you feel like eating?','Feel like + -ing is a natural neutral structure for preferences.']
 ]},
 final:{label:'Final check',container:'finalQuiz',score:'finalScore',total:'finalTotal',items:[
  ['f1','Which sentence sounds most natural when you are nearly at the meeting point?',['I’m almost there.','I almost arrive.','I am near to arrive.'],'I’m almost there.','Almost there is short, clear and natural.'],
  ['f2','Which question checks your route?',['So I turn left at the light, right?','So I turn left in the fire?','I turn at left, no?'],'So I turn left at the light, right?','Repeat the key direction and add right? to confirm.'],
  ['f3','Which expression means “ça me convient”?',['That works for me.','That walks for me.','That does me.'],'That works for me.','Works for me means the arrangement is convenient/acceptable.'],
  ['f4','Which expression is best for “je suis en route”?',['I’m on my way.','I’m in my way.','I’m on the road of me.'],'I’m on my way.','On my way means you have started travelling toward the destination.'],
  ['f5','Choose the correct transport phrase.',['Where do we get off?','Where do we get down?','Where do we quit?'],'Where do we get off?','Get off is the usual phrasal verb for leaving public transport.'],
  ['f6','Choose the natural suggestion.',['How about getting lunch first?','How about to get lunch first?','How about get lunch first?'],'How about getting lunch first?','How about + -ing.'],
  ['f7','You did not hear a direction. What do you say?',['Could you say that again, please?','Can you repeat me?','Tell again the direction.'],'Could you say that again, please?','This is polite and natural.'],
  ['f8','Your family suggests a plan you like.',['Sounds good.','It sounds goodly.','I am okay by this.'],'Sounds good.','A short everyday agreement.'],
  ['f9','Which phrase means the place is close enough to walk?',['It’s within walking distance.','It’s in feet distance.','It’s walk distance.'],'It’s within walking distance.','A standard phrase for a walkable distance.'],
  ['f10','You want to know which subway route to use.',['Which line do I need?','Which road of metro I need?','What line I must?'],'Which line do I need?','Simple and direct is best.']
 ]}
};

const wordOrders=[
 {prompt:'Ask for the easiest route.',words:['What’s','the','easiest','way','to','get','there?'],answer:"What's the easiest way to get there?"},
 {prompt:'Confirm the meeting point.',words:['So','we’re','meeting','outside','the','station,','right?'],answer:"So we're meeting outside the station, right?"},
 {prompt:'Ask about walking.',words:['Is','it','far','to','walk?'],answer:'Is it far to walk?'},
 {prompt:'Ask where to leave the T.',words:['Where','do','we','get','off?'],answer:'Where do we get off?'}
];

function speak(text){
 if(!('speechSynthesis' in window)){toast('Speech is not supported in this browser.');return}
 const synth=window.speechSynthesis; synth.cancel();
 const u=new SpeechSynthesisUtterance(text); const lang=$('#voiceSelect').value||'en-US'; u.lang=lang; u.rate=parseFloat($('#speedSelect').value||'0.9');
 const voices=synth.getVoices(); const exact=voices.find(v=>v.lang===lang); const family=voices.find(v=>v.lang&&v.lang.startsWith(lang.split('-')[0])); if(exact||family)u.voice=exact||family;
 u.onerror=()=>{const s=$('#audioStatus');if(s)s.textContent='Audio could not play. Try another browser voice or speed.'};
 u.onstart=()=>{const s=$('#audioStatus');if(s)s.textContent='Playing…'}; u.onend=()=>{const s=$('#audioStatus');if(s)s.textContent='Ready. Press Play whenever you want to listen again.'};
 setTimeout(()=>synth.speak(u),40);
}

function renderVocab(){const cat=$('#vocabCategory').value;const items=vocab[cat]||[];$('#vocabCount').textContent=items.length;$('#vocabGrid').innerHTML=items.map(([icon,word,fr,def,ex])=>`<article class="vocab-card"><div class="vocab-card-top"><div class="vocab-icon">${icon}</div><div><div class="vocab-word">${escapeHtml(word)}</div></div></div><span class="vocab-fr fr">${escapeHtml(fr)}</span><p class="vocab-def">${escapeHtml(def)}</p><p class="vocab-example">${escapeHtml(ex)}</p><button class="vocab-audio" data-vocab-speak="${escapeHtml(word+'. '+ex)}">🔊 Listen</button></article>`).join('');$$('[data-vocab-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.vocabSpeak));}

function setupVocab(){const sel=$('#vocabCategory');sel.innerHTML=Object.keys(vocab).map(k=>`<option>${escapeHtml(k)}</option>`).join('');sel.onchange=renderVocab;renderVocab()}

function renderQuiz(key){const g=quizGroups[key],root=$('#'+g.container);if(!root)return;root.innerHTML='';g.items.forEach((it,i)=>{const [id,prompt,options,answer,hint]=it;const card=document.createElement('article');card.className='exercise-card';const shuffled=shuffle(options);card.innerHTML=`<span class="exercise-number">${i+1}</span><p>${escapeHtml(prompt)}</p><div class="answer-options">${shuffled.map((o,j)=>`<button type="button" data-option="${escapeHtml(o)}"><span class="quiz-option-letter">${String.fromCharCode(65+j)}</span>${escapeHtml(o)}</button>`).join('')}</div><div class="exercise-tools"><button class="hint-button" type="button">Hint</button><div class="hint-inline">${escapeHtml(hint)}</div></div><p class="feedback-line"></p>`;const buttons=$$('.answer-options button',card),fb=$('.feedback-line',card),hb=$('.hint-button',card),hi=$('.hint-inline',card);hb.onclick=()=>{hi.classList.toggle('open');hb.textContent=hi.classList.contains('open')?'Hide hint':'Hint'};buttons.forEach(b=>b.onclick=()=>{const correct=b.dataset.option===answer;buttons.forEach(x=>{x.disabled=true;if(x.dataset.option===answer)x.classList.add('correct')});if(!correct)b.classList.add('incorrect');fb.textContent=correct?'✓ Correct — that sounds natural.':`✗ Best answer: ${answer} — ${hint}`;fb.className='feedback-line '+(correct?'good':'bad');state.answers[id]={correct,chosen:b.dataset.option,group:key};save();updateGroupScore(key);updateDashboard()});const saved=state.answers[id];if(saved){buttons.forEach(x=>{x.disabled=true;if(x.dataset.option===answer)x.classList.add('correct');if(x.dataset.option===saved.chosen&&!saved.correct)x.classList.add('incorrect')});fb.textContent=saved.correct?'✓ Correct — that sounds natural.':`✗ Best answer: ${answer} — ${hint}`;fb.className='feedback-line '+(saved.correct?'good':'bad')}root.appendChild(card)});updateGroupScore(key)}

function updateGroupScore(key){const g=quizGroups[key];let c=0,t=g.items.length;g.items.forEach(([id])=>{if(state.answers[id]?.correct)c++});if(g.score)$('#'+g.score).textContent=c;if(g.total)$('#'+g.total).textContent=t;return{c,t}}
function resetQuizByContainer(container){const key=Object.keys(quizGroups).find(k=>quizGroups[k].container===container);if(!key)return;quizGroups[key].items.forEach(([id])=>delete state.answers[id]);save();renderQuiz(key);updateDashboard();toast('Exercise reset.')}

function setupFill(){ $$('.fill-card').forEach((card,i)=>{const input=$('input',card),check=$('.check-fill',card),hint=$('.hint-button',card),fb=$('.feedback-line',card);check.onclick=()=>{const accepted=(input.dataset.answer||'').split('|').map(normalize);const correct=accepted.includes(normalize(input.value));input.classList.toggle('good',correct);input.classList.toggle('bad',!correct);fb.textContent=correct?'✓ Correct.':'✗ Try again. '+hint.dataset.hint;fb.className='feedback-line '+(correct?'good':'bad');state.answers['fill'+i]={correct,chosen:input.value,group:'directions'};save();updateDashboard()};hint.onclick=()=>toast(hint.dataset.hint);const saved=state.answers['fill'+i];if(saved){input.value=saved.chosen||'';input.classList.toggle('good',!!saved.correct);input.classList.toggle('bad',!saved.correct);fb.textContent=saved.correct?'✓ Correct.':'Try again. '+hint.dataset.hint;fb.className='feedback-line '+(saved.correct?'good':'bad')}})}

function setupWordOrder(){const root=$('#wordOrderGrid');root.innerHTML='';wordOrders.forEach((item,i)=>{const card=document.createElement('article');card.className='word-order-card';card.innerHTML=`<p class="mini-label">${escapeHtml(item.prompt)}</p><div class="word-bank"></div><div class="answer-bank" aria-label="Your sentence"></div><div class="word-order-tools"><button class="button small secondary check-order">Check</button><button class="button small ghost clear-order">Clear</button><button class="hint-button order-hint">Hint</button></div><p class="feedback-line"></p>`;const wb=$('.word-bank',card),ab=$('.answer-bank',card),fb=$('.feedback-line',card);let chosen=[];const tokens=shuffle(item.words);tokens.forEach(w=>{const b=document.createElement('button');b.className='word-token';b.textContent=w;b.onclick=()=>{if(b.classList.contains('used'))return;b.classList.add('used');chosen.push(w);const t=document.createElement('button');t.className='word-token';t.textContent=w;t.onclick=()=>{chosen.splice(chosen.indexOf(w),1);t.remove();b.classList.remove('used')};ab.appendChild(t)};wb.appendChild(b)});$('.clear-order',card).onclick=()=>{chosen=[];ab.innerHTML='';$$('.word-token',wb).forEach(b=>b.classList.remove('used'));fb.textContent='';};$('.order-hint',card).onclick=()=>toast('Start with: '+item.answer.split(' ').slice(0,2).join(' ')+' …');$('.check-order',card).onclick=()=>{const correct=normalize(chosen.join(' '))===normalize(item.answer);fb.textContent=correct?'✓ Perfect word order.':'✗ Try again. Model: '+item.answer;fb.className='feedback-line '+(correct?'good':'bad');state.answers['order'+i]={correct,chosen:chosen.join(' '),group:'directions'};save();updateDashboard()};root.appendChild(card)})}

const listenText=`A: Hey, where are you now? B: I'm near Back Bay Station. I'm trying to figure out the easiest way to get to Boston Common. A: You can take the T, but honestly, if the weather's nice, it's not too far to walk. B: That sounds good. Is it pretty straightforward from here? A: Yes. Head toward the Public Garden. Once you get there, Boston Common is right next to it. B: Perfect. I'm on my way. Where should we meet? A: Let's meet near the entrance by the Common. Text me when you're close. B: Will do. I should be there in about fifteen minutes.`;

function setupToggles(){
 $('#frToggle').checked=state.fr;document.body.classList.toggle('hide-fr',!state.fr);$('#frToggle').onchange=e=>{state.fr=e.target.checked;document.body.classList.toggle('hide-fr',!state.fr);save()};
 $('#voiceSelect').value=state.voice||'en-US';$('#voiceSelect').onchange=e=>{state.voice=e.target.value;save()};$('#speedSelect').value=state.speed||'0.90';$('#speedSelect').onchange=e=>{state.speed=e.target.value;save()};
 $('#modeSelect').value=state.mode||'coach';document.body.classList.toggle('independent',state.mode==='independent');$('#modeSelect').onchange=e=>{state.mode=e.target.value;document.body.classList.toggle('independent',state.mode==='independent');toast(state.mode==='coach'?'Coach mode: hints and models available.':'Try-it-yourself mode: use help only when you choose.');save()};
 const applyFont=()=>{document.body.classList.remove('font-small','font-large','font-xlarge');if(state.font<=.9)document.body.classList.add('font-small');else if(state.font>=1.2)document.body.classList.add('font-xlarge');else if(state.font>=1.08)document.body.classList.add('font-large')};applyFont();$('#fontDown').onclick=()=>{state.font=Math.max(.9,state.font-.1);applyFont();save()};$('#fontReset').onclick=()=>{state.font=1;applyFont();save()};$('#fontUp').onclick=()=>{state.font=Math.min(1.2,state.font+.1);applyFont();save()};
}

function setupButtons(){
 $$('.model-toggle').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.target);e.hidden=!e.hidden;b.textContent=e.hidden?'Show models':'Hide models'});
 $$('.hint-toggle').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.target);e.hidden=!e.hidden;b.textContent=e.hidden?'Hint':'Hide hint'});
 $$('.model-audio').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.model);const p=$$('p',e).at(-1);speak((p?.textContent||e.textContent).replace(/^B1:\s*/,'').trim())});
 $$('.speak-inline').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
 $$('.transcript-btn').forEach(b=>b.onclick=()=>{const e=$('#'+b.dataset.target);const open=!e.classList.contains('open');e.classList.toggle('open',open);e.hidden=!open;b.textContent=open?'Hide transcript':'Show transcript'});
 $('#listenBoston').onclick=()=>speak(listenText);
 $$('.reset-section').forEach(b=>b.onclick=()=>resetQuizByContainer(b.dataset.reset));
 $$('.mark-task').forEach(b=>b.onclick=()=>{const id=b.dataset.task;state.tasks[id]=!state.tasks[id];const s=$('#'+id+'Status');s.textContent=state.tasks[id]?'✓ practised':'○ not practised';s.classList.toggle('done',!!state.tasks[id]);b.textContent=state.tasks[id]?'↻ Mark not practised':'✓ Mark as practised';save();updateDashboard()});
 ['role1','role2','role3'].forEach(id=>{if(state.tasks[id]){const s=$('#'+id+'Status'),b=$(`[data-task="${id}"]`);s.textContent='✓ practised';s.classList.add('done');b.textContent='↻ Mark not practised'}});
 $('#printBtn').onclick=()=>window.print();
 $('#resetAll').onclick=()=>{if(confirm('Reset the complete lesson, notes and saved progress?')){localStorage.removeItem(STORAGE_KEY);location.reload()}};
}

let timerSeconds=90,timerHandle=null;function drawTimer(){const m=Math.floor(timerSeconds/60),s=timerSeconds%60;$('#timerDisplay').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function setupTimer(){drawTimer();$('#timerStart').onclick=()=>{if(timerHandle)return;timerHandle=setInterval(()=>{if(timerSeconds<=0){clearInterval(timerHandle);timerHandle=null;toast('Time! Finish your sentence naturally.');return}timerSeconds--;drawTimer()},1000)};$('#timerPause').onclick=()=>{clearInterval(timerHandle);timerHandle=null};$('#timerReset').onclick=()=>{clearInterval(timerHandle);timerHandle=null;timerSeconds=90;drawTimer()}}

function setupRecorder(){let rec=null,chunks=[],stream=null;const start=$('#recordStart'),stop=$('#recordStop'),audio=$('#recordPlayback'),link=$('#recordDownload'),status=$('#recordStatus');if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){start.disabled=true;status.textContent='Voice recording is not supported in this browser. You can still practise aloud.';return}start.onclick=async()=>{try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];rec=new MediaRecorder(stream);rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.onstop=()=>{const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});const url=URL.createObjectURL(blob);audio.src=url;audio.hidden=false;link.href=url;link.download='Boston-speaking-practice.webm';link.hidden=false;stream.getTracks().forEach(t=>t.stop());status.textContent='Recording ready. Listen back and try once more.'};rec.start();start.disabled=true;stop.disabled=false;status.textContent='Recording…'}catch(e){status.textContent='Microphone access was not available. You can still practise aloud.'}};stop.onclick=()=>{if(rec?.state==='recording')rec.stop();start.disabled=false;stop.disabled=true}}

function objectiveSummary(){let c=0,t=0;Object.values(quizGroups).forEach(g=>g.items.forEach(([id])=>{t++;if(state.answers[id]?.correct)c++}));for(let i=0;i<4;i++){t++;if(state.answers['fill'+i]?.correct)c++;t++;if(state.answers['order'+i]?.correct)c++}return{c,t,p:t?Math.round(c/t*100):0}}
function updateDashboard(){const o=objectiveSummary(),sp=['role1','role2','role3'].filter(x=>state.tasks[x]).length;$('#objectivePercent').textContent=o.p+'%';$('#objectiveBar').style.width=o.p+'%';$('#speakingCount').textContent=sp+' / 3';$('#speakingBar').style.width=(sp/3*100)+'%';const conf=Math.round((o.p+(sp/3*100))/2);$('#confidenceBar').style.width=conf+'%';$('#confidenceText').textContent=conf>=80?'ready to reuse':conf>=55?'growing naturally':'building';const rows=[];Object.entries(quizGroups).forEach(([k,g])=>{const r=updateGroupScore(k);rows.push([g.label,`${r.c} / ${r.t}`])});let df=0,doT=8;for(let i=0;i<4;i++){if(state.answers['fill'+i]?.correct)df++;if(state.answers['order'+i]?.correct)df++}rows.splice(2,0,['Directions & word order',`${df} / ${doT}`]);$('#exerciseDetailGrid').innerHTML=rows.map(([a,b])=>`<div class="exercise-detail"><strong>${escapeHtml(a)}</strong><span>${escapeHtml(b)}</span></div>`).join('')}

function setupPersistence(){const fields=['lessonNotes','speakingEval','interactionEval','trainerComments','confidenceRating','easyArea','favoritePhrase'];fields.forEach(id=>{const el=$('#'+id);const key=id==='lessonNotes'?'notes':id;el.value=state[key]||'';el.addEventListener('input',()=>{state[key]=el.value;save()});el.addEventListener('change',()=>{state[key]=el.value;save()})});$('#saveNotes').onclick=()=>{state.notes=$('#lessonNotes').value;save();toast('Notes saved on this device.')};$('#copyNotes').onclick=async()=>{try{await navigator.clipboard.writeText($('#lessonNotes').value);toast('Notes copied.')}catch(e){toast('Copy is not available in this browser.')}};$('#downloadResults').onclick=downloadResults}
function downloadResults(){const o=objectiveSummary(),sp=['role1','role2','role3'].filter(x=>state.tasks[x]).length;const lines=['BOSTON — GET AROUND & SOUND NATURAL','','AUTOMATIC RESULTS',`Objective exercises: ${o.c} / ${o.t} (${o.p}%)`,`Speaking scenes practised: ${sp} / 3`,'','TRAINER ASSESSMENT',`Speaking: ${state.speakingEval||'—'}`,`Everyday interaction: ${state.interactionEval||'—'}`,`Comments: ${state.trainerComments||'—'}`,'','LEARNER REFLECTION',`Natural feeling: ${state.confidenceRating||'—'}`,`Easiest area: ${state.easyArea||'—'}`,`Phrase to reuse: ${state.favoritePhrase||'—'}`,'','NOTES',state.notes||'—'];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Boston_Get_Around_Results.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);toast('Results downloaded.')}

function init(){setupToggles();setupVocab();Object.keys(quizGroups).forEach(renderQuiz);setupFill();setupWordOrder();setupButtons();setupTimer();setupRecorder();setupPersistence();updateDashboard();if('speechSynthesis' in window)window.speechSynthesis.onvoiceschanged=()=>{};}
document.addEventListener('DOMContentLoaded',init);
