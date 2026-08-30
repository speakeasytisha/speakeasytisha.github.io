const STORE_KEY = 'lesson15_what_happened_progress_v1';
const state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
state.answers ||= {};
state.builders ||= {};
state.manual ||= {};
state.comments ||= {};

const quizzes = {
  tenseMeaning: [
    {s:'I usually check each order carefully.', a:'Present simple', o:['Present simple','Present continuous','Past continuous'], why:'Usually = routine, so present simple.'},
    {s:'I am checking the labels now.', a:'Present continuous', o:['Past simple','Present continuous','Present perfect'], why:'Now = happening now.'},
    {s:'The client changed the order yesterday.', a:'Past simple', o:['Past simple','Present perfect','Going to'], why:'Yesterday = finished past time.'},
    {s:'I have already checked the quantities.', a:'Present perfect', o:['Past continuous','Present perfect','Past simple'], why:'Already + result now = present perfect.'},
    {s:'I was preparing the meals when the client called.', a:'Past continuous + past simple', o:['Present simple','Past continuous + past simple','Will'], why:'The preparation was in progress; the call interrupted it.'},
    {s:'I will send the confirmation today.', a:'Future with will', o:['Past simple','Future with will','Present continuous'], why:'Will = promise or decision.'},
    {s:'We are going to update the driver.', a:'Future plan with going to', o:['Present perfect','Future plan with going to','Past continuous'], why:'Going to = plan or intention.'},
    {s:'I have worked with airline clients for several years.', a:'Present perfect', o:['Past simple','Present perfect','Present continuous'], why:'For + duration continuing to now = present perfect.'}
  ],
  scenarioReading: [
    {s:'What changed?', a:'The delivery point changed.', o:['The delivery point changed.','The client cancelled the order.','The driver cancelled the delivery.'], why:'The message says the delivery point is now Gate 4, not Gate 2.'},
    {s:'What dietary problem is mentioned?', a:'A passenger needs a nut-free meal.', o:['A passenger needs a nut-free meal.','All passengers are vegetarian.','The crew wants breakfast.'], why:'The message mentions one nut-free meal.'},
    {s:'What should be confirmed?', a:'Each item will be labelled in English.', o:['The price of each meal.','Each item will be labelled in English.','The restaurant address.'], why:'The client asks to confirm that each item will be labelled in English.'},
    {s:'What may happen to the flight?', a:'It may leave 30 minutes later.', o:['It may leave 30 minutes later.','It may leave 2 hours earlier.','It may be cancelled.'], why:'The message says the flight may leave 30 minutes later.'},
    {s:'What is the best first action?', a:'Check the new information and confirm the details.', o:['Ignore the message.','Check the new information and confirm the details.','Cancel the order.'], why:'A professional response checks and confirms the update.'}
  ],
  vocabularyContext: [
    {s:'The client sent an ___ because the flight time changed.', a:'urgent update', o:['urgent update','ingredient','cross-contamination'], why:'An urgent update is new important information.'},
    {s:'Each meal needs a clear ___ in English.', a:'label', o:['label','delay','deadline'], why:'A label identifies the meal.'},
    {s:'One passenger has a nut ___.', a:'allergy', o:['allergy','delivery','quantity'], why:'A nut allergy is a food safety requirement.'},
    {s:'We must avoid ___ when preparing special meals.', a:'cross-contamination', o:['cross-contamination','delivery point','confirmation'], why:'Cross-contamination is a food safety risk.'},
    {s:'I will ___ the driver about the new gate.', a:'contact', o:['contact','miss','forget'], why:'Contact means call, message, or inform someone.'},
    {s:'Could you please ___ the exact delivery time?', a:'confirm', o:['confirm','delay','label'], why:'Confirm means verify officially.'},
    {s:'There is some ___ about the delivery point.', a:'missing information', o:['missing information','nut-free','ingredient'], why:'Missing information means a detail is absent.'},
    {s:'We solved the ___ quickly.', a:'issue', o:['issue','ingredient','airport'], why:'Issue = problem.'},
    {s:'Please note that the delivery point has changed. This is a professional ___ phrase.', a:'writing', o:['writing','allergy','quantity'], why:'Please note that... is used in professional writing.'},
    {s:'To avoid any problem, we checked every ___.', a:'ingredient', o:['ingredient','delay','call'], why:'Ingredients are checked for allergies.'}
  ],
  wasWere: [
    {s:'I ___ preparing the order when the phone rang.', a:'was', o:['was','were','did'], why:'Use was with I.'},
    {s:'You ___ checking the labels at 10 a.m.', a:'were', o:['was','were','are'], why:'Use were with you.'},
    {s:'The driver ___ waiting at Gate 4.', a:'was', o:['was','were','did'], why:'Use was with he/she/it or singular noun.'},
    {s:'We ___ organising the delivery when the client called.', a:'were', o:['are','was','were'], why:'Use were with we.'},
    {s:'The labels ___ not ready at 8 a.m.', a:'were', o:['were','was','did'], why:'Labels = they, so were.'},
    {s:'The nut-free meal ___ cooling in the fridge.', a:'was', o:['were','was','did'], why:'Meal = it, so was.'},
    {s:'___ you working when your wife called?', a:'Were', o:['Did','Was','Were'], why:'Question form: Were you working?'},
    {s:'___ the client waiting for your confirmation?', a:'Was', o:['Was','Were','Did'], why:'Client = singular, so was.'}
  ],
  buildPastContinuous: [
    {s:'I / prepare / the order / at 10 a.m.', a:'I was preparing the order at 10 a.m.', o:['I was preparing the order at 10 a.m.','I were preparing the order at 10 a.m.','I prepared the order at 10 a.m.'], why:'Past continuous = I was + verb-ing.'},
    {s:'We / check / the labels / when the client called.', a:'We were checking the labels when the client called.', o:['We checked the labels when the client called.','We were checking the labels when the client called.','We was checking the labels when the client called.'], why:'We were checking = action in progress.'},
    {s:'The driver / wait / at the airport.', a:'The driver was waiting at the airport.', o:['The driver was waiting at the airport.','The driver were waiting at the airport.','The driver did waiting at the airport.'], why:'Driver = singular, so was waiting.'},
    {s:'They / not / prepare / the meals.', a:'They were not preparing the meals.', o:['They was not preparing the meals.','They did not preparing the meals.','They were not preparing the meals.'], why:'They were not + verb-ing.'},
    {s:'Question: you / work / when she called?', a:'Were you working when she called?', o:['Did you were working when she called?','Were you working when she called?','You were working when she called?'], why:'Question = Were you working?'},
    {s:'Question: the client / call / during preparation?', a:'Was the client calling during preparation?', o:['Did the client was calling during preparation?','Were the client calling during preparation?','Was the client calling during preparation?'], why:'Client = singular, so Was the client calling?'},
    {s:'We / not / wait / at Gate 2.', a:'We were not waiting at Gate 2.', o:['We were not waiting at Gate 2.','We did not waiting at Gate 2.','We was not waiting at Gate 2.'], why:'We were not + verb-ing.'},
    {s:'The meals / cool / in the fridge.', a:'The meals were cooling in the fridge.', o:['The meals was cooling in the fridge.','The meals were cooling in the fridge.','The meals did cooling in the fridge.'], why:'Meals = plural, so were cooling.'}
  ],
  pastMix: [
    {s:'I ___ the order when the client called.', a:'was preparing', o:['prepared','was preparing','have prepared'], why:'The order preparation was in progress.'},
    {s:'The client ___ while I was checking the labels.', a:'called', o:['called','was calling','has called'], why:'The call is the short event.'},
    {s:'We were checking the labels when the time ___.', a:'changed', o:['was changing','has changed','changed'], why:'The change is the short event.'},
    {s:'The driver ___ at the airport when I sent the update.', a:'was waiting', o:['waited','was waiting','has waited'], why:'Waiting was in progress.'},
    {s:'I ___ the confirmation after I checked the details.', a:'sent', o:['sent','was sending','have sent'], why:'Finished sequence in the past = past simple.'},
    {s:'At 8 a.m., we ___ the special meals.', a:'were preparing', o:['prepared','were preparing','have prepared'], why:'At a precise past moment, action in progress = past continuous.'},
    {s:'When the phone rang, I ___ to the driver.', a:'was speaking', o:['spoke','was speaking','have spoken'], why:'Speaking was in progress when the phone rang.'},
    {s:'The flight time ___ yesterday evening.', a:'changed', o:['has changed','changed','was changing'], why:'Yesterday evening = finished time.'},
    {s:'I ___ the client this morning.', a:'called', o:['was calling','have called','called'], why:'This morning can be finished depending on context; here it is a past finished action.'},
    {s:'We ___ the new delivery point while the driver was waiting.', a:'confirmed', o:['confirmed','were confirming','have confirmed'], why:'Confirmed is the main event in the sequence.'}
  ],
  whenWhile: [
    {s:'I was preparing the order ___ the client called.', a:'when', o:['when','while','during'], why:'When introduces the short action.'},
    {s:'The client called ___ I was preparing the order.', a:'while', o:['when','while','during'], why:'While introduces the long action in progress.'},
    {s:'We were checking the labels ___ the delivery point changed.', a:'when', o:['while','when','since'], why:'The change is a short event.'},
    {s:'The delivery point changed ___ we were checking the labels.', a:'while', o:['while','when','already'], why:'Checking the labels was the long action.'},
    {s:'The driver was waiting ___ I sent the update.', a:'when', o:['when','while','yet'], why:'Sending the update is a short action.'},
    {s:'I sent the update ___ the driver was waiting.', a:'while', o:['during','while','when'], why:'The driver was waiting = long action.'},
    {s:'The phone rang ___ I was speaking to the driver.', a:'while', o:['when','while','for'], why:'Speaking was in progress.'},
    {s:'I was speaking to the driver ___ the phone rang.', a:'when', o:['when','while','since'], why:'The phone rang = short interruption.'}
  ],
  modals: [
    {s:'Food safety rule: We ___ avoid cross-contamination.', a:'must', o:['could','should','must'], why:'Must = strong rule.'},
    {s:'Necessary action: You ___ check the labels before delivery.', a:'have to', o:['have to','could','might'], why:'Have to = necessary obligation.'},
    {s:'Advice: You ___ confirm the delivery point.', a:'should', o:['should','must not','already'], why:'Should = advice / good idea.'},
    {s:'Polite request: ___ you confirm the exact time?', a:'Could', o:['Must','Could','Have to'], why:'Could you...? is polite.'},
    {s:'Strong rule: The label ___ be in English.', a:'must', o:['must','could','should maybe'], why:'Must is used for a strict requirement.'},
    {s:'Suggestion: You ___ call the client before delivery.', a:'should', o:['should','has to','yet'], why:'Should = good idea.'},
    {s:'Polite request: ___ you send the updated order?', a:'Could', o:['Could','Must','Have'], why:'Could you send...? is polite.'},
    {s:'Necessary: I ___ update the driver now.', a:'have to', o:['have to','could to','should to'], why:'Have to + base verb.'},
    {s:'Negative rule: You ___ use the wrong label.', a:'must not', o:['must not','could not to','have not to'], why:'Must not = it is forbidden / very important not to.'},
    {s:'Advice: The client ___ send the information earlier next time.', a:'should', o:['must to','should','could to'], why:'Should + base verb.'}
  ],
  conditionalOne: [
    {s:'If the flight ___ delayed, I will call the client.', a:'is', o:['will be','is','was'], why:'After if, use present simple.'},
    {s:'If the delivery point changes, I ___ update the driver.', a:'will', o:['will','am','was'], why:'Result = will + base verb.'},
    {s:'If there ___ an allergy, I will check the ingredients.', a:'is', o:['will be','is','was'], why:'If + present simple.'},
    {s:'If the client sends an update, I ___ check the order again.', a:'will', o:['will','did','have'], why:'Will + base verb.'},
    {s:'If the labels are wrong, we ___ print them again.', a:'will', o:['will','are','were'], why:'Result clause uses will.'},
    {s:'If the driver arrives early, I ___ call the airport contact.', a:'will', o:['will','am','have'], why:'Real future possibility = first conditional.'},
    {s:'If the order changes again, we ___ the quantities.', a:'will check', o:['will check','checked','are checking'], why:'If + present simple, will + base verb.'},
    {s:'If one passenger has a nut allergy, the meal ___ be nut-free.', a:'must', o:['must','could to','should to'], why:'Must = strong food safety rule.'}
  ],
  listeningSim: [
    {s:'How long is the flight delayed?', a:'30 minutes', o:['30 minutes','13 minutes','3 hours'], why:'The message says delayed by thirty minutes.'},
    {s:'What is the new delivery point?', a:'Gate 4', o:['Gate 2','Gate 4','Gate 14'], why:'The delivery point is now Gate Four.'},
    {s:'What special meal is needed?', a:'A nut-free meal', o:['A gluten-free meal','A nut-free meal','A vegetarian meal'], why:'The audio says one passenger needs a nut-free meal.'},
    {s:'What must be labelled in English?', a:'Each item', o:['Each item','Only the box','The airport gate'], why:'The message says each item must be labelled.'},
    {s:'What type of message is this?', a:'An urgent update', o:['A complaint','An urgent update','A restaurant review'], why:'It begins with a last-minute update.'}
  ],
  integratedGrammar: [
    {s:'I usually ___ each order carefully.', a:'check', o:['check','am checking','checked'], why:'Usually = present simple.'},
    {s:'At the moment, I ___ the dietary requirements.', a:'am checking', o:['check','am checking','checked'], why:'At the moment = present continuous.'},
    {s:'Yesterday, the client ___ the delivery point.', a:'changed', o:['has changed','changed','was changing'], why:'Yesterday = past simple.'},
    {s:'I ___ already checked the labels.', a:'have', o:['have','did','was'], why:'Present perfect = have + past participle.'},
    {s:'I was checking the labels when the client ___.', a:'called', o:['has called','called','was calling'], why:'The call is the short event.'},
    {s:'If the time changes, I ___ call the driver.', a:'will', o:['will','was','have'], why:'First conditional result = will.'},
    {s:'We must ___ every ingredient.', a:'check', o:['checking','checked','check'], why:'After must, use base verb.'},
    {s:'Could you ___ the delivery point?', a:'confirm', o:['confirm','confirmed','confirming'], why:'After could, use base verb.'},
    {s:'The driver was waiting ___ the client sent the update.', a:'when', o:['when','already','yet'], why:'When introduces the short action.'},
    {s:'The client sent the update ___ we were preparing the order.', a:'while', o:['while','since','for'], why:'While introduces an action in progress.'}
  ]
};

const builders = [
  {id:'b1', words:['I','was','checking','the','labels','when','the','client','called'], answer:'I was checking the labels when the client called'},
  {id:'b2', words:['We','were','preparing','the','order','while','the','driver','was','waiting'], answer:'We were preparing the order while the driver was waiting'},
  {id:'b3', words:['The','delivery','point','changed','while','we','were','checking','the','labels'], answer:'The delivery point changed while we were checking the labels'},
  {id:'b4', words:['If','the','flight','is','delayed','I','will','call','the','client'], answer:'If the flight is delayed I will call the client'},
  {id:'b5', words:['I','have','already','confirmed','the','quantities','and','I','will','send','the','email'], answer:'I have already confirmed the quantities and I will send the email'}
];

function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function shuffle(arr){ return arr.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
function idFor(qname, idx){ return `${qname}_${idx}`; }

function renderQuiz(name){
  const el = document.querySelector(`[data-quiz="${name}"]`);
  if(!el) return;
  const list = quizzes[name];
  el.innerHTML = '';
  list.forEach((q, idx)=>{
    const qid = idFor(name, idx);
    const card = document.createElement('div');
    card.className = 'q-card';
    card.dataset.qid = qid;
    const opts = shuffle(q.o);
    card.innerHTML = `<div class="q-title">${idx+1}. ${q.s}</div><div class="options"></div><div class="feedback"></div>`;
    const optBox = card.querySelector('.options');
    opts.forEach(opt=>{
      const b = document.createElement('button');
      b.className = 'option';
      b.type = 'button';
      b.textContent = opt;
      b.addEventListener('click',()=>answerQuestion(qid,opt,q.a,q.why,card));
      optBox.appendChild(b);
    });
    el.appendChild(card);
    if(state.answers[qid]) restoreQuestion(card, state.answers[qid], q.a, q.why);
  });
}

function answerQuestion(qid,opt,ans,why,card){
  const correct = opt === ans;
  state.answers[qid] = {opt, correct};
  save();
  restoreQuestion(card,state.answers[qid],ans,why);
  updateReport();
}
function restoreQuestion(card, saved, ans, why){
  card.querySelectorAll('.option').forEach(btn=>{
    btn.classList.remove('correct','wrong');
    if(btn.textContent === ans) btn.classList.add('correct');
    if(btn.textContent === saved.opt && !saved.correct) btn.classList.add('wrong');
  });
  const fb = card.querySelector('.feedback');
  fb.className = `feedback ${saved.correct?'good':'bad'}`;
  fb.textContent = saved.correct ? `Correct. ${why}` : `Not yet. Correct answer: ${ans}. ${why}`;
}

function renderBuilders(){
  const root = document.getElementById('builders');
  if(!root) return;
  root.innerHTML = '';
  builders.forEach((b, i)=>{
    const item = document.createElement('div');
    item.className='builder';
    item.dataset.builder=b.id;
    const mixed = shuffle([...b.words]);
    item.innerHTML = `<div class="q-title">${i+1}. Build the sentence</div><div class="bank"></div><div class="dropzone"></div><div class="builder-actions"><button class="btn ghost small check-builder">Check</button><button class="btn ghost small reset-builder">Reset</button></div><div class="feedback"></div>`;
    const bank = item.querySelector('.bank');
    const drop = item.querySelector('.dropzone');
    const saved = state.builders[b.id] || [];
    function makeChip(word, inDrop=false){
      const chip = document.createElement('button');
      chip.type='button'; chip.className='chip'; chip.textContent=word;
      chip.addEventListener('click',()=>{
        if(chip.parentElement === bank) drop.appendChild(chip); else bank.appendChild(chip);
        state.builders[b.id] = [...drop.querySelectorAll('.chip')].map(c=>c.textContent);
        save(); updateReport();
      });
      (inDrop?drop:bank).appendChild(chip);
    }
    mixed.forEach(w=>{
      const savedIndex = saved.indexOf(w);
      if(savedIndex >= 0){ saved.splice(savedIndex,1); makeChip(w,true); } else makeChip(w,false);
    });
    item.querySelector('.check-builder').addEventListener('click',()=>{
      const built = [...drop.querySelectorAll('.chip')].map(c=>c.textContent).join(' ');
      const ok = built === b.answer;
      const fb = item.querySelector('.feedback');
      fb.className = `feedback ${ok?'good':'bad'}`;
      fb.textContent = ok ? 'Correct sentence.' : `Not yet. Model: ${b.answer}.`;
      state.answers[`builder_${b.id}`] = {opt: built, correct: ok};
      save(); updateReport();
    });
    item.querySelector('.reset-builder').addEventListener('click',()=>{
      [...drop.querySelectorAll('.chip')].forEach(c=>bank.appendChild(c));
      state.builders[b.id]=[]; delete state.answers[`builder_${b.id}`]; save(); updateReport();
      item.querySelector('.feedback').textContent='';
    });
    root.appendChild(item);
  });
}

function initHints(){
  document.querySelectorAll('.hint').forEach(btn=>{
    btn.addEventListener('click',()=>{
      let box = btn.parentElement.parentElement.querySelector('.hint-box');
      if(!box){ box = document.createElement('div'); box.className='hint-box'; btn.parentElement.parentElement.insertBefore(box, btn.parentElement.nextSibling); }
      box.textContent = btn.dataset.hint;
      box.hidden = !box.hidden;
    });
  });
}

function initAudio(){
  document.querySelectorAll('.listen').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const text = btn.dataset.speak || '';
      if(!('speechSynthesis' in window)){ alert('Speech synthesis is not available in this browser.'); return; }
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-GB'; utter.rate = .92;
      speechSynthesis.speak(utter);
    });
  });
}

function initFrench(){
  const btn = document.getElementById('toggleFrench');
  btn?.addEventListener('click',()=>{
    document.body.classList.toggle('show-fr');
    btn.textContent = document.body.classList.contains('show-fr') ? 'French help: on' : 'French help: off';
  });
}

function initTabs(){
  document.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.model-panel').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`model-${tab.dataset.tab}`)?.classList.add('active');
    });
  });
}

function initWriting(){
  const text = document.getElementById('writingText');
  const wc = document.getElementById('wordCount');
  if(text){
    text.value = state.writingText || '';
    const update = ()=>{ state.writingText = text.value; wc.textContent = countWords(text.value); save(); };
    text.addEventListener('input', update); update();
  }
  document.getElementById('copyWriting')?.addEventListener('click', async()=>{
    await navigator.clipboard.writeText(text.value || '');
    alert('Writing copied.');
  });
}
function countWords(t){ return (t.trim().match(/\b[\w’'-]+\b/g)||[]).length; }

function initManual(){
  document.querySelectorAll('.manual-status').forEach(sel=>{
    const key = sel.dataset.manual;
    sel.value = state.manual[key] || 'Non évalué';
    sel.addEventListener('change',()=>{ state.manual[key]=sel.value; save(); updateReport(); });
  });
  document.querySelectorAll('.manual-comment').forEach(inp=>{
    const key = inp.dataset.comment;
    inp.value = state.comments[key] || '';
    inp.addEventListener('input',()=>{ state.comments[key]=inp.value; save(); });
  });
}

function initTranscripts(){
  document.querySelectorAll('.toggle-transcript').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const p = btn.parentElement.querySelector('.transcript');
      p.classList.toggle('hidden');
      btn.textContent = p.classList.contains('hidden') ? 'Show transcript' : 'Hide transcript';
    });
  });
}

let mediaRecorder, chunks=[];
function initRecorder(){
  const start = document.getElementById('startRec'), stop = document.getElementById('stopRec'), status = document.getElementById('recStatus'), audio = document.getElementById('audioPlayback'), dl = document.getElementById('downloadRec');
  if(!start) return;
  start.addEventListener('click', async()=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      chunks=[]; mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable=e=>chunks.push(e.data);
      mediaRecorder.onstop=()=>{
        const blob = new Blob(chunks,{type:'audio/webm'});
        const url = URL.createObjectURL(blob);
        audio.src = url; dl.href = url; dl.classList.remove('hidden');
        stream.getTracks().forEach(t=>t.stop());
      };
      mediaRecorder.start(); start.disabled=true; stop.disabled=false; status.textContent='Recording...';
    }catch(e){ alert('Microphone permission is needed to record.'); }
  });
  stop.addEventListener('click',()=>{
    if(mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    start.disabled=false; stop.disabled=true; status.textContent='Recording stopped.';
  });
}

const sectionQuizMap = {
  'Roadmap':['tenseMeaning'],
  'Scenario':['scenarioReading'],
  'Vocabulary':['vocabularyContext'],
  'Past continuous':['wasWere','buildPastContinuous'],
  'Past simple vs past continuous':['pastMix','builders'],
  'When / while':['whenWhile'],
  'Problem-solving language':['modals','conditionalOne'],
  'Integrated practice':['listeningSim','integratedGrammar']
};
function totalQuestionsForQuiz(name){ if(name==='builders') return builders.length; return quizzes[name]?.length || 0; }
function scoreForQuiz(name){
  if(name==='builders'){
    let answered=0, correct=0;
    builders.forEach(b=>{ const x = state.answers[`builder_${b.id}`]; if(x){answered++; if(x.correct) correct++;} });
    return {answered, correct, total: builders.length};
  }
  const total = quizzes[name]?.length || 0; let answered=0, correct=0;
  for(let i=0;i<total;i++){ const x=state.answers[idFor(name,i)]; if(x){answered++; if(x.correct) correct++;} }
  return {answered, correct, total};
}
function sectionScore(section){
  const names = sectionQuizMap[section] || [];
  let answered=0,correct=0,total=0;
  names.forEach(n=>{ const s=scoreForQuiz(n); answered+=s.answered; correct+=s.correct; total+=s.total; });
  const pct = total ? Math.round((correct/total)*100) : null;
  return {answered,correct,total,pct};
}
function statusFromPct(pct, answered, total){
  if(total===0) return 'Manual';
  if(answered===0) return 'Not started';
  if(pct>=85) return 'Maîtrisé';
  if(pct>=70) return 'Acquis';
  if(pct>=45) return 'En cours';
  return 'Non acquis';
}
function badgeClass(status){
  if(['Maîtrisé','Acquis'].includes(status)) return 'good';
  if(['En cours','Manual','Not started'].includes(status)) return 'mid';
  return 'low';
}
function updateReport(){
  const objectiveSections = Object.keys(sectionQuizMap);
  let total=0, answered=0, correct=0;
  objectiveSections.forEach(sec=>{ const s=sectionScore(sec); total+=s.total; answered+=s.answered; correct+=s.correct; });
  const global = total ? Math.round((correct/total)*100) : 0;
  const gs=document.getElementById('globalScore'); if(gs) gs.textContent=global;
  const ac=document.getElementById('answeredCount'); if(ac) ac.textContent=answered;
  const tc=document.getElementById('totalCount'); if(tc) tc.textContent=total;
  const gp=document.getElementById('globalProgress'); if(gp) gp.style.width=global+'%';
  document.getElementById('writingStatus') && (document.getElementById('writingStatus').textContent = state.manual['writing-main'] || 'Non évalué');
  document.getElementById('speakingStatus') && (document.getElementById('speakingStatus').textContent = state.manual['speaking-main'] || 'Non évalué');
  document.querySelectorAll('.section-eval').forEach(el=>{
    const sec = el.dataset.evalSection;
    const span = el.querySelector('.section-score');
    if(sectionQuizMap[sec]){ const s=sectionScore(sec); span.textContent = `${s.pct}% (${s.correct}/${s.total}) · ${statusFromPct(s.pct,s.answered,s.total)}`; }
  });
  const sr=document.getElementById('sectionResults');
  if(sr){
    const manualRows = [
      {name:'Writing Lab', status: state.manual['writing-main'] || 'Non évalué', detail: state.comments['writing-main'] || 'Manual written production'},
      {name:'Speaking Lab', status: state.manual['speaking-main'] || 'Non évalué', detail: state.comments['speaking-main'] || 'Manual oral production'}
    ];
    sr.innerHTML = objectiveSections.map(sec=>{
      const s=sectionScore(sec); const st=statusFromPct(s.pct,s.answered,s.total);
      return `<div class="result-line"><strong>${sec}</strong><span class="badge ${badgeClass(st)}">${st}</span><span>${s.correct}/${s.total} correct · ${s.pct}%</span></div>`;
    }).join('') + manualRows.map(r=>`<div class="result-line"><strong>${r.name}</strong><span class="badge ${badgeClass(r.status)}">${r.status}</span><span>${r.detail}</span></div>`).join('');
  }
}

function initReportActions(){
  ['participation','confidence','autonomy','trainerComments','learnerFeedback'].forEach(id=>{
    const el=document.getElementById(id); if(!el) return;
    el.value = state[id] || '';
    el.addEventListener('input',()=>{ state[id]=el.value; save(); });
    el.addEventListener('change',()=>{ state[id]=el.value; save(); });
  });
  document.getElementById('copyReport')?.addEventListener('click', async()=>{
    await navigator.clipboard.writeText(buildReportText()); alert('Qualiopi report copied.');
  });
  document.getElementById('downloadReport')?.addEventListener('click',()=>{
    const html = `<!doctype html><meta charset="utf-8"><title>Qualiopi Report</title><style>body{font-family:Arial;padding:28px;line-height:1.5}h1{color:#0b2b57}pre{white-space:pre-wrap}</style><h1>Qualiopi Report</h1><pre>${escapeHtml(buildReportText())}</pre>`;
    const blob = new Blob([html],{type:'text/html'}); const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='lesson-15-qualiopi-report.html'; a.click(); URL.revokeObjectURL(url);
  });
  document.getElementById('resetAll')?.addEventListener('click',()=>{
    if(confirm('Reset all answers and report data?')){ localStorage.removeItem(STORE_KEY); location.reload(); }
  });
}
function buildReportText(){
  const objectiveSections = Object.keys(sectionQuizMap);
  let total=0, correct=0, answered=0;
  const lines = [];
  lines.push('Lesson 15 · What Happened? · Past Continuous & Professional Problem-Solving');
  lines.push('Date: ' + new Date().toLocaleDateString()); lines.push('');
  objectiveSections.forEach(sec=>{ const s=sectionScore(sec); total+=s.total; correct+=s.correct; answered+=s.answered; lines.push(`${sec}: ${s.correct}/${s.total} · ${s.pct}% · ${statusFromPct(s.pct,s.answered,s.total)}`); });
  const global = total ? Math.round((correct/total)*100) : 0;
  lines.push(''); lines.push(`Objective score: ${global}% (${correct}/${total})`);
  lines.push(`Writing: ${state.manual['writing-main'] || 'Non évalué'} · ${state.comments['writing-main'] || ''}`);
  lines.push(`Speaking: ${state.manual['speaking-main'] || 'Non évalué'} · ${state.comments['speaking-main'] || ''}`);
  lines.push(`Participation: ${state.participation || 'Non évalué'}`);
  lines.push(`Confidence: ${state.confidence || 'Non évalué'}`);
  lines.push(`Autonomy: ${state.autonomy || 'Non évalué'}`);
  lines.push(''); lines.push('Trainer comments:'); lines.push(state.trainerComments || '');
  lines.push(''); lines.push('Learner feedback / satisfaction:'); lines.push(state.learnerFeedback || '');
  lines.push(''); lines.push('Next steps: continue past continuous, problem-solving language, conditionals, speaking and writing practice for VTest.');
  return lines.join('\n');
}
function escapeHtml(str){ return str.replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function initBackToTop(){
  const b=document.getElementById('backToTop');
  window.addEventListener('scroll',()=>b.classList.toggle('show', window.scrollY>600));
  b.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

Object.keys(quizzes).forEach(renderQuiz);
renderBuilders(); initHints(); initAudio(); initFrench(); initTabs(); initWriting(); initManual(); initTranscripts(); initRecorder(); initReportActions(); initBackToTop(); updateReport();
