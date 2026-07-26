const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

let score = Number(localStorage.getItem('isabelleNumScore') || 0);
let done = Number(localStorage.getItem('isabelleNumDone') || 0);
const totalTarget = 22;
function updateScore(points=0){
  if(points){ score += points; done += 1; }
  $('#score').textContent = score;
  $('#done').textContent = done;
  $('#progressBar').style.width = Math.min(100, Math.round(done/totalTarget*100)) + '%';
  localStorage.setItem('isabelleNumScore', score);
  localStorage.setItem('isabelleNumDone', done);
}
updateScore();

function normalize(str){
  return (str||'')
    .toLowerCase()
    .replace(/[’']/g,'')
    .replace(/€/g,'eur')
    .replace(/square meters/g,'square metres')
    .replace(/program/g,'programme')
    .replace(/\s+/g,' ')
    .trim();
}
function compact(str){
  return normalize(str).replace(/[^a-z0-9@.]/g,'');
}
function mark(feedback, ok, msg){
  feedback.textContent = msg;
  feedback.className = 'feedback ' + (ok ? 'ok' : 'no');
  if(ok && feedback.dataset.mastered !== 'true'){
    feedback.dataset.mastered = 'true';
    updateScore(1);
  }
}

// Print and reset
$('#printBtn').addEventListener('click', () => window.print());
$('#resetBtn').addEventListener('click', () => {
  localStorage.removeItem('isabelleNumScore');
  localStorage.removeItem('isabelleNumDone');
  localStorage.removeItem('isabelleNumNotes');
  localStorage.removeItem('isabelleNumbersQualiopiV1');
  localStorage.removeItem('isabelleNumbersQualiopiV2');
  location.reload();
});

// Timer
let timerInterval = null;
let secondsLeft = 600;
$('#timerBtn').addEventListener('click', () => {
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; $('#timerBtn').textContent = 'Start 10-minute sprint'; return; }
  $('#timerBtn').textContent = 'Pause sprint';
  timerInterval = setInterval(() => {
    secondsLeft--;
    const m = String(Math.floor(secondsLeft/60)).padStart(2,'0');
    const s = String(secondsLeft%60).padStart(2,'0');
    $('#timer').textContent = `${m}:${s}`;
    if(secondsLeft<=0){ clearInterval(timerInterval); timerInterval=null; $('#timerBtn').textContent='Sprint finished'; speak('Excellent work. Your ten minute sprint is finished.'); }
  },1000);
});

// TTS
function speak(text){
  if(!('speechSynthesis' in window)) return alert('Speech is not supported in this browser.');
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-GB';
  u.rate = 0.82;
  u.pitch = 1;
  speechSynthesis.speak(u);
}
$$('.speakLetter').forEach(btn => btn.addEventListener('click', () => { recordActivity('spelling-practice'); speak(btn.dataset.say); }));

// Quiz radios — immediate feedback, no Check button required
$$('.quiz').forEach((quiz, idx) => {
  const btn = $('.checkBtn', quiz);
  if(btn){
    btn.textContent = 'Feedback appears automatically';
    btn.disabled = true;
    btn.classList.add('ghost');
  }
  $$('input[type="radio"]', quiz).forEach(input => input.addEventListener('change', () => {
    const fb = $('.feedback', quiz);
    const ok = input.value === quiz.dataset.answer;
    recordEvaluationAttempt('phone-grouping', ok);
    mark(fb, ok, ok ? '✅ Correct. The pauses make the number easier to understand.' : '❌ Not quite yet. Choose the option with clear pauses and natural grouping.');
  }));
});

// Alphabet
const alpha = [
  ['A','Amsterdam'], ['B','Bravo'], ['C','Charlie'], ['D','Delta'], ['E','Edward'], ['F','Foxtrot'],
  ['G','Golf'], ['H','Hotel'], ['I','India'], ['J','Juliet'], ['K','Kilo'], ['L','Lima'], ['M','Martin'],
  ['N','November'], ['O','Oscar'], ['P','Papa'], ['Q','Quebec'], ['R','Romeo'], ['S','Sierra'], ['T','Tilburg'],
  ['U','Uniform'], ['V','Victor'], ['W','Whisky'], ['X','X-ray'], ['Y','Yankee'], ['Z','Zulu / zed']
];
$('#alphaGrid').innerHTML = alpha.map(([l,w]) => `<button class="alpha-item" data-say="${l} for ${w}"><strong>${l}</strong> for ${w}</button>`).join('');
$$('.alpha-item').forEach(btn => btn.addEventListener('click', () => { recordActivity('spelling-practice'); speak(btn.dataset.say); }));

// Dictation
const dictations = [
  {type:'Dutch mobile number', display:'+31 6 42 18 90 77', speak:'plus thirty one, six, forty two, eighteen, ninety, seventy seven', accept:['+31642189077','+31 6 42 18 90 77','31 6 42 18 90 77']},
  {type:'Amsterdam landline', display:'020 612 55 22', speak:'zero two zero, six one two, fifty five, twenty two', accept:['0206125522','020 612 55 22','020-6125522']},
  {type:'Email address', display:'recruiter@legal-example.nl', speak:'recruiter at legal dash example dot n l', accept:['recruiter@legal-example.nl']},
  {type:'Email address', display:'isabelle.davion@example.com', speak:'isabelle dot davion at example dot com', accept:['isabelle.davion@example.com']},
  {type:'Dutch postcode', display:'1075 AT Amsterdam', speak:'one zero seven five, A for Amsterdam, T for Tilburg, Amsterdam', accept:['1075atamsterdam','1075 AT Amsterdam']},
  {type:'Dutch address', display:'Emmalaan 23, 1075 AT Amsterdam', speak:'Emmalaan twenty three, one zero seven five, A for Amsterdam, T for Tilburg, Amsterdam', accept:['emmalaan23,1075atamsterdam','emmalaan 23 1075 AT Amsterdam']},
  {type:'Sale price', display:'€895,000 k.k.', speak:'eight hundred and ninety five thousand euros, buyer’s costs', accept:['€895,000 k.k.','895000kk','895000buyerscosts']},
  {type:'New-build price', display:'€1,250,000 v.o.n.', speak:'one million two hundred and fifty thousand euros, free of transfer costs', accept:['€1,250,000 v.o.n.','1250000von','1250000freeoftransfercosts']},
  {type:'Rental price', display:'€3,250 per month excluding utilities', speak:'three thousand two hundred and fifty euros per month, excluding utilities', accept:['€3,250 per month excluding utilities','3250permonthexcludingutilities']},
  {type:'Surface area', display:'124 m²', speak:'one hundred and twenty four square metres', accept:['124m2','124m²','124 square metres']},
  {type:'Salary range', display:'€72,000–€86,000 gross per year', speak:'seventy two thousand to eighty six thousand euros gross per year', accept:['€72000-€86000grossperyear','72000to86000grossperyear','7200086000grossperyear']}
];
let currentDictation = null;
function newDictation(){
  currentDictation = dictations[Math.floor(Math.random()*dictations.length)];
  $('#dictationType').textContent = currentDictation.type;
  $('#dictationPrompt').textContent = 'Listen carefully, then type the detail.';
  $('#dictationInput').value = '';
  $('#dictationFeedback').textContent = '';
  setTimeout(() => speak(currentDictation.speak), 200);
}
$('#newDictation').addEventListener('click', newDictation);
$('#playDictation').addEventListener('click', () => currentDictation ? speak(currentDictation.speak) : newDictation());
$('#showDictationAnswer').addEventListener('click', () => {
  if(!currentDictation) return newDictation();
  $('#dictationFeedback').className = 'feedback';
  $('#dictationFeedback').textContent = `Answer: ${currentDictation.display}`;
});
function evaluateDictation({showModel=false}={}){
  if(!currentDictation) return newDictation();
  const typed = $('#dictationInput').value;
  const fb = $('#dictationFeedback');
  if(!typed.trim()){
    fb.textContent = 'Type what you hear. Feedback appears automatically.';
    fb.className = 'feedback';
    recordEvaluationItem('dictation', 'main', false, false);
    return;
  }
  const ok = currentDictation.accept.some(a => compact(a) === compact(typed));
  recordEvaluationAttempt('dictation', ok);
  mark(fb, ok, ok ? '✅ Correct. Excellent read-back accuracy.' : (showModel ? `❌ Almost. Model answer: ${currentDictation.display}` : '❌ Not quite yet. Check spaces, dots, @, digits or Dutch postcode letters.'));
}
$('#dictationInput').addEventListener('input', () => evaluateDictation({showModel:false}));
$('#checkDictation').addEventListener('click', () => evaluateDictation({showModel:true}));

// Word exercises
const wordExercises = [
  {fig:'€895,000', context:'sale price', answer:'eight hundred and ninety-five thousand euros', alt:['eight hundred and ninety five thousand euros']},
  {fig:'€1.25 million', context:'property fund asset value', answer:'one point twenty-five million euros', alt:['one point two five million euros','one point twenty five million euros']},
  {fig:'85 m²', context:'surface area', answer:'eighty-five square metres', alt:['eighty five square metres','eighty-five square meters']},
  {fig:'2.5%', context:'rate or yield', answer:'two point five percent', alt:['two point five per cent']},
  {fig:'€3,250 / month', context:'monthly rent', answer:'three thousand two hundred and fifty euros per month', alt:['three thousand two hundred fifty euros per month']},
  {fig:'1075 AT', context:'postcode', answer:'one zero seven five, A for Amsterdam, T for Tilburg', alt:['one zero seven five a t','one zero seven five A T']}
];
$('#wordExercises').innerHTML = wordExercises.map((ex,i)=>`
  <article class="card word-card">
    <p class="figure">${ex.fig}</p>
    <p><strong>Context:</strong> ${ex.context}</p>
    <textarea id="word${i}" placeholder="Write how to say this in English. Feedback appears automatically."></textarea>
    <button class="checkWord ghost" data-i="${i}" disabled>Feedback appears automatically</button>
    <button class="ghost speakModel" data-say="${ex.answer}">Listen to model</button>
    <p class="feedback"></p>
  </article>
`).join('');
function evaluateWordExercise(i, showModel=false){
  const ex = wordExercises[i], card = $('#word'+i).closest('.word-card');
  const val = $('#word'+i).value;
  const fb = $('.feedback', card);
  if(!val.trim()){
    fb.textContent = 'Write the number in words.';
    fb.className = 'feedback';
    recordEvaluationItem('figures-words', 'word'+i, false, false);
    return;
  }
  const options = [ex.answer, ...(ex.alt||[])].map(compact);
  const ok = options.includes(compact(val));
  recordEvaluationItem('figures-words', 'word'+i, ok, true);
  mark(fb, ok, ok ? '✅ Correct. Keep this pronunciation rhythm.' : (showModel ? `❌ Model: ${ex.answer}` : '❌ Not quite yet. Check spelling, hyphens, “euros”, “square metres” or “percent”.'));
}
wordExercises.forEach((_,i) => $('#word'+i).addEventListener('input', () => evaluateWordExercise(i, false)));
$$('.checkWord').forEach(btn => btn.addEventListener('click', () => evaluateWordExercise(Number(btn.dataset.i), true)));
$$('.speakModel').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.say)));

// Inline correction — immediate feedback, no click required
function evaluateInlineCorrection(btn, showModel=false){
  const area = $('#'+btn.dataset.target);
  const accepted = btn.dataset.accept.split('|').map(compact);
  const val = area.value;
  const fb = btn.parentElement.querySelector('.feedback');
  if(!val.trim()){
    fb.textContent = 'Write a clearer professional sentence.';
    fb.className = 'feedback';
    recordEvaluationItem('money-correction', 'main', false, false);
    return;
  }
  const ok = accepted.includes(compact(val));
  recordEvaluationAttempt('money-correction', ok);
  mark(fb, ok, ok ? '✅ Excellent. This is clear and professional.' : (showModel ? '❌ Model: The apartment is priced at €895,000 k.k. and has 85 square metres.' : '❌ Not quite yet. Use: is priced at / k.k. / has 85 square metres.'));
}
$$('.checkInline[data-target]').forEach(btn => {
  const area = $('#'+btn.dataset.target);
  if(area) area.addEventListener('input', () => evaluateInlineCorrection(btn, false));
  btn.addEventListener('click', () => evaluateInlineCorrection(btn, true));
});

// Property cards
const properties = [
  {
    title:'Canal-side apartment · Amsterdam', img:'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?auto=format&fit=crop&w=900&q=80',
    details:[['Address','Keizersgracht 217A, 1016 DT Amsterdam'],['Price','€875,000 k.k.'],['Surface','92 m²'],['Bedrooms','2'],['Phone','+31 20 555 12 34'],['Email','sales@canalhomes.nl']],
    read:'The property is a ninety-two-square-metre canal-side apartment at Keizersgracht two hundred and seventeen A, postcode one zero one six, D for Delta, T for Tilburg, Amsterdam. It is priced at eight hundred and seventy-five thousand euros, buyer’s costs.'
  },
  {
    title:'Rental apartment · Rotterdam', img:'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80',
    details:[['Address','Blaak 34B, 3011 TA Rotterdam'],['Rent','€2,350 / month'],['Service costs','€165 / month'],['Deposit','€4,700'],['Surface','68 m²'],['Email','lettings@urbanrent.nl']],
    read:'The apartment is located at Blaak thirty-four B, postcode three zero one one, T for Tilburg, A for Amsterdam, Rotterdam. The rent is two thousand three hundred and fifty euros per month, with one hundred and sixty-five euros in service charges and a deposit of four thousand seven hundred euros.'
  },
  {
    title:'New-build family home · Houthaven', img:'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    details:[['Address','Houthavenkade 18, 1014 ZB Amsterdam'],['Price','€1,250,000 v.o.n.'],['Surface','124 m²'],['Energy label','A++'],['Delivery','Q4 2026'],['Email','newbuild@amsterdamliving.nl']],
    read:'The new-build family home is at Houthavenkade eighteen, postcode one zero one four, Zed for Zulu, B for Bravo, Amsterdam. It is one hundred and twenty-four square metres and priced at one million two hundred and fifty thousand euros, free of transfer costs.'
  }
];
$('#propertyCards').innerHTML = properties.map((p,i)=>`
  <article class="card property-card">
    <img src="${p.img}" alt="Fictional Netherlands property image">
    <h3>${p.title}</h3>
    <div class="data-card">${p.details.map(([k,v])=>`<p><strong>${k}:</strong> ${v}</p>`).join('')}</div>
    <label class="practice-label">Your read-back / Votre reformulation
      <textarea class="propertyInput" data-i="${i}" placeholder="Type your read-back here after practising orally. Include address, postcode, price/rent and surface."></textarea>
    </label>
    <p class="feedback propertyFeedback" id="propertyFb${i}"></p>
    <button class="secondary readAloud" data-i="${i}">Listen to model read-back</button>
    <button class="ghost toggleRead" data-i="${i}">Show model</button>
    <p class="readback" id="read${i}">${p.read}</p>
  </article>
`).join('');
$$('.readAloud').forEach(btn => btn.addEventListener('click', () => speak(properties[Number(btn.dataset.i)].read)));
$$('.toggleRead').forEach(btn => btn.addEventListener('click', () => $('#read'+btn.dataset.i).classList.toggle('show')));
$$('.propertyInput').forEach(area => area.addEventListener('input', () => {
  const i = Number(area.dataset.i);
  const text = normalize(area.value);
  const must = i===0 ? ['keizersgracht','1016','875','92'] : i===1 ? ['blaak','3011','2350','68'] : ['houthavenkade','1014','1250','124'];
  const hits = must.filter(k => text.includes(k)).length;
  const ok = hits >= 3 && text.length > 70;
  recordEvaluationItem('property-readback','property'+i, ok, area.value.trim().length > 0);
  const fb = $('#propertyFb'+i);
  mark(fb, ok, ok ? '✅ Good read-back: the essential property details are included.' : '❌ Add the key details: address, postcode, price/rent and surface area.');
}));

// Dialogues
const dialogues = [
  {
    title:'Dialogue 1 · Confirming a recruiter’s details',
    lines:[
      ['Recruiter','Good afternoon, this is N. Fokma from Legal People. Is this a good time to speak?'],
      ['You','Good afternoon. Yes, thank you for calling.'],
      ['Recruiter','I would like to confirm your email address and phone number before sending the interview details.'],
      ['You','Of course. My email address is isabelle dot davion at example dot com.'],
      ['Recruiter','Thank you. And your phone number?'],
      ['You','It is plus thirty-three, six, twelve, thirty-four, fifty-six, seventy-eight. Let me repeat it digit by digit if needed.'],
      ['Recruiter','That is fine. I will email you the details.'],
      ['You','Thank you. Could you also confirm the interview time and the name of the person I will meet?']
    ]
  },
  {
    title:'Dialogue 2 · Speaking to a real estate agency about a property role',
    lines:[
      ['Agency','Could you tell me briefly what kind of role you are looking for?'],
      ['You','I am looking for a real estate legal or commercial role in the Netherlands, ideally involving transactions, contract negotiation and stakeholder coordination.'],
      ['Agency','Do you have experience with property figures and client information?'],
      ['You','Yes. I am used to working with sale prices, surface areas, budgets, contracts and deadlines. I always confirm important figures carefully, especially by phone.'],
      ['Agency','Could you give me an example?'],
      ['You','For example, I would confirm a price as eight hundred and seventy-five thousand euros, buyer’s costs, and a surface area of ninety-two square metres.']
    ]
  },
  {
    title:'Dialogue 3 · Clarifying an address and postcode',
    lines:[
      ['Agent','The address is Keizersgracht 217A, 1016 DT Amsterdam.'],
      ['You','Thank you. Let me read that back: Keizersgracht two hundred and seventeen A, postcode one zero one six, D for Delta, T for Tilburg, Amsterdam. Is that correct?'],
      ['Agent','Yes, that is correct.'],
      ['You','Perfect. And is the A a house-number suffix?'],
      ['Agent','Yes, exactly.'],
      ['You','Thank you. That is clear.']
    ]
  },
  {
    title:'Dialogue 4 · Discussing property money',
    lines:[
      ['Client','Could you explain the price to me? I see €1,250,000 v.o.n.'],
      ['You','Of course. The asking price is one million two hundred and fifty thousand euros, free of transfer costs. In Dutch listings, v.o.n. is often used for new-build properties.'],
      ['Client','And what does k.k. mean?'],
      ['You','K.k. means buyer’s costs. It is often used for existing homes. It means extra purchase costs may be payable by the buyer.'],
      ['Client','Thank you. That is much clearer.'],
      ['You','You are welcome. I can also summarise the main costs by email if that would help.']
    ]
  }
];
$('#dialogues').innerHTML = dialogues.map((d,i)=>`
  <details class="dialogue" ${i===0?'open':''}>
    <summary>${d.title}</summary>
    <div class="dialogue-body">
      ${d.lines.map(([speaker,text])=>`<div class="line"><strong>${speaker}</strong><span>${text}</span></div>`).join('')}
      <label class="practice-label">Your dialogue notes / Votre réponse
        <textarea class="dialogueInput" data-i="${i}" placeholder="After practising orally, type your answer or the key information you confirmed. This completes the roleplay in the evaluation."></textarea>
      </label>
      <p class="feedback dialogueFeedback" id="dialogueFb${i}"></p>
      <button class="secondary speakDialogue" data-i="${i}">Listen to model dialogue</button>
    </div>
  </details>
`).join('');
$$('.speakDialogue').forEach(btn => btn.addEventListener('click', () => {
  const d = dialogues[Number(btn.dataset.i)];
  speak(d.lines.map(l => `${l[0]}: ${l[1]}`).join(' '));
}));
$$('.dialogueInput').forEach(area => area.addEventListener('input', () => {
  const i = Number(area.dataset.i);
  const text = normalize(area.value);
  const keyGroups = [
    ['email','phone','confirm'],
    ['role','transactions','stakeholder'],
    ['keizersgracht','postcode','correct'],
    ['price','buyer','costs']
  ];
  const hits = (keyGroups[i] || []).filter(k => text.includes(k)).length;
  const ok = area.value.trim().length > 60 && hits >= 1;
  recordEvaluationItem('phone-dialogues','dialogue'+i, ok, area.value.trim().length > 0);
  const fb = $('#dialogueFb'+i);
  mark(fb, ok, ok ? '✅ Roleplay completed. Good professional practice.' : '❌ Add a little more detail from the call, then practise saying it aloud.');
}));

// Scenario checks — immediate feedback plus optional model button
function evaluateScenario(card, showModel=false){
  const model = card.dataset.answer;
  const val = $('textarea', card).value;
  const ok = normalize(val).includes('repeat') || normalize(val).includes('spell') || normalize(val).includes('line') || normalize(val).includes('slow') || normalize(val).includes('confirm');
  const i = $$('.scenario').indexOf(card);
  recordEvaluationItem('clarification', 'scenario'+i, ok, val.trim().length > 0);
  mark($('.feedback', card), ok, ok ? `✅ Good strategy. Model: ${model}` : (showModel ? `❌ Try using a clear clarification phrase. Model: ${model}` : '❌ Add a clarification word: repeat, spell, line, slowly or confirm.'));
}
$$('.scenario').forEach(card => $('textarea', card).addEventListener('input', () => evaluateScenario(card, false)));
$$('.checkScenario').forEach(btn => btn.addEventListener('click', () => evaluateScenario(btn.closest('.scenario'), true)));

// Vocab
const vocab = [
  {cat:'phone', term:'digit by digit', fr:'chiffre par chiffre', def:'A clear way to confirm a phone number or reference number.', ex:'Could we confirm the number digit by digit?'},
  {cat:'phone', term:'read back', fr:'relire / répéter pour confirmer', def:'To repeat information to check that it is correct.', ex:'Let me read that back to make sure I have it correctly.'},
  {cat:'phone', term:'at / dot', fr:'arobase / point', def:'Words used in email addresses.', ex:'My email is isabelle dot davion at example dot com.'},
  {cat:'phone', term:'capital letter', fr:'majuscule', def:'A large letter, for example A instead of a.', ex:'Is that a capital B?'},
  {cat:'property', term:'asking price', fr:'prix demandé', def:'The price requested by the seller.', ex:'The asking price is €895,000.'},
  {cat:'property', term:'surface area', fr:'surface', def:'The size of a property, often in square metres.', ex:'The apartment has a surface area of 92 square metres.'},
  {cat:'property', term:'square metres', fr:'mètres carrés', def:'UK/international spelling for m².', ex:'The office space is 450 square metres.'},
  {cat:'money', term:'buyer’s costs', fr:'frais d’acquisition à la charge de l’acheteur', def:'A simple English explanation of k.k. in Dutch listings.', ex:'The price is €875,000 buyer’s costs.'},
  {cat:'money', term:'free of transfer costs', fr:'frais de transfert inclus / libre de frais de transfert', def:'A simple English explanation of v.o.n. in Dutch listings.', ex:'The new-build property is priced at €1.25 million free of transfer costs.'},
  {cat:'money', term:'service charges', fr:'charges de service', def:'Additional monthly charges for services, maintenance or shared facilities.', ex:'The service charges are €165 per month.'},
  {cat:'money', term:'deposit', fr:'caution / dépôt de garantie', def:'Money paid as security before renting a property.', ex:'The deposit is two months’ rent.'},
  {cat:'job', term:'headhunter', fr:'chasseur de tête', def:'A recruiter who actively searches for candidates.', ex:'A headhunter contacted me about a real estate role.'},
  {cat:'job', term:'recruitment agency', fr:'cabinet de recrutement', def:'A company that helps employers find candidates.', ex:'I spoke with a recruitment agency in Amsterdam.'},
  {cat:'job', term:'reference number', fr:'référence de l’offre', def:'A number used to identify a job application or vacancy.', ex:'Could you confirm the reference number, please?'},
  {cat:'dutch', term:'postcode', fr:'code postal néerlandais', def:'A Dutch postal code with four digits and two letters.', ex:'The postcode is 1075 AT.'},
  {cat:'dutch', term:'house-number suffix', fr:'complément du numéro', def:'A letter or addition after the house number, such as 217A.', ex:'Is the A a house-number suffix?'},
  {cat:'dutch', term:'k.k. / kosten koper', fr:'frais acquéreur', def:'Dutch listing abbreviation meaning buyer’s costs.', ex:'The property is listed at €895,000 k.k.'},
  {cat:'dutch', term:'v.o.n. / vrij op naam', fr:'frais de transfert inclus', def:'Dutch listing abbreviation often seen with new-build property.', ex:'The new-build home is €1,250,000 v.o.n.'}
];
function renderVocab(){
  const q = normalize($('#vocabSearch').value);
  const cat = $('#vocabCategory').value;
  const items = vocab.filter(v => (cat==='all'||v.cat===cat) && [v.term,v.fr,v.def,v.ex].some(x => normalize(x).includes(q)));
  $('#vocabList').innerHTML = items.map(v=>`
    <article class="vocab-item">
      <h3>${v.term}</h3>
      <p class="vocab-meta"><strong>FR:</strong> ${v.fr} · <strong>Category:</strong> ${v.cat}</p>
      <p>${v.def}</p>
      <p class="model">${v.ex}</p>
      <button class="ghost speakVocab" data-say="${v.term}. ${v.ex}">Listen</button>
    </article>
  `).join('') || '<p>No vocabulary found.</p>';
  $$('.speakVocab').forEach(btn => btn.addEventListener('click', () => speak(btn.dataset.say)));
}
$('#vocabSearch').addEventListener('input', renderVocab);
$('#vocabCategory').addEventListener('change', renderVocab);
renderVocab();

// Notes
const notes = $('#notes');
notes.value = localStorage.getItem('isabelleNumNotes') || '';
notes.addEventListener('input', () => localStorage.setItem('isabelleNumNotes', notes.value));

// Recording
let mediaRecorder, chunks=[];
const startBtn = $('#startRec'), stopBtn = $('#stopRec'), clearBtn = $('#clearRec'), audio = $('#audioPlayback'), dl = $('#downloadRec');
startBtn.addEventListener('click', async () => {
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    chunks=[];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, {type:'audio/webm'});
      const url = URL.createObjectURL(blob);
      audio.src = url;
      dl.href = url;
      dl.classList.remove('hidden');
      clearBtn.disabled = false;
      stream.getTracks().forEach(t=>t.stop());
    };
    mediaRecorder.start();
    startBtn.disabled = true; stopBtn.disabled = false; clearBtn.disabled = true; dl.classList.add('hidden');
  }catch(e){ alert('Recording is not available in this browser. You can use Voice Memos instead.'); }
});
stopBtn.addEventListener('click', () => { if(mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop(); recordActivity('final-recording'); startBtn.disabled=false; stopBtn.disabled=true; });
clearBtn.addEventListener('click', () => { audio.removeAttribute('src'); dl.classList.add('hidden'); clearBtn.disabled=true; });


// Qualiopi evaluation footer
const QUALIOPI_KEY = 'isabelleNumbersQualiopiV2';
const evaluationSections = [
  {id:'phone-grouping', objective:'Confirm phone numbers using clear grouping and pauses', subject:'Dutch mobile and Amsterdam landline formats', method:'QCM / immediate feedback', target:1},
  {id:'spelling-practice', objective:'Spell names, emails and postcodes clearly in English', subject:'Letters, dot / at, A for Amsterdam, T for Tilburg', method:'Guided oral practice', target:1},
  {id:'dictation', objective:'Understand and write down spoken details accurately', subject:'Phone numbers, emails, prices, addresses, salary ranges', method:'Dictation / written production', target:1},
  {id:'figures-words', objective:'Write figures in professional English words', subject:'Prices, percentages, rent, square metres, Dutch postcodes', method:'Written production', target:6},
  {id:'money-correction', objective:'Describe property price and surface area clearly', subject:'k.k., v.o.n., buyer’s costs, service charges, m²', method:'Sentence correction', target:1},
  {id:'property-readback', objective:'Read back property details in a professional call', subject:'Address, postcode, price, surface, contact details', method:'Trainer-observed oral read-back', manual:true},
  {id:'phone-dialogues', objective:'Handle property and recruiter phone conversations', subject:'Recruiter call, agency call, address confirmation, money explanation', method:'Trainer-observed roleplay / learner notes', manual:true},
  {id:'clarification', objective:'Clarify unexpected situations politely and confidently', subject:'Bad line, fast speaker, unclear email address', method:'Written clarification phrases', target:3},
  {id:'final-recording', objective:'Record a professional read-back of job-search details', subject:'Recruiter, phone, email, address, role and salary indication', method:'Oral recording task', target:1},
  {id:'oral-readback', objective:'Oral: confirm phone numbers, spelling and details accurately', subject:'Manual trainer assessment', method:'Mise en situation orale', manual:true},
  {id:'oral-property', objective:'Oral: discuss property money and details professionally', subject:'Manual trainer assessment', method:'Jeu de rôle immobilier', manual:true},
  {id:'writing-details', objective:'Writing: record numbers, emails, addresses and postcodes correctly', subject:'Manual trainer assessment', method:'Production écrite', manual:true},
  {id:'writing-jobsearch', objective:'Writing: produce a clear professional follow-up message', subject:'Manual trainer assessment', method:'Production écrite professionnelle', manual:true}
];
let evalStats = {};
let manualStatus = {
  'property-readback':'not-started',
  'phone-dialogues':'not-started',
  'oral-readback':'not-started',
  'oral-property':'not-started',
  'writing-details':'not-started',
  'writing-jobsearch':'not-started'
};

function sectionTarget(id){
  const section = evaluationSections.find(s => s.id === id);
  return section?.target || 1;
}
function ensureEvalStats(){
  evaluationSections.forEach(s => {
    if(!s.manual && !evalStats[s.id]) evalStats[s.id] = {items:{}, touched:false, correct:0, attempted:s.target || 1};
    if(!s.manual && !evalStats[s.id].items) evalStats[s.id].items = {};
  });
}
function recomputeSection(id){
  const st = evalStats[id];
  if(!st) return;
  const target = sectionTarget(id);
  st.attempted = target;
  st.correct = Object.values(st.items || {}).filter(Boolean).length;
}
function recordEvaluationItem(id, itemId='main', ok=true, touched=true){
  ensureEvalStats();
  if(!evalStats[id]) evalStats[id] = {items:{}, touched:false, correct:0, attempted:sectionTarget(id)};
  if(touched) evalStats[id].touched = true;
  evalStats[id].items[itemId] = !!ok;
  recomputeSection(id);
  saveQualiopiState(false);
  renderQualiopiEvaluation();
}
function recordEvaluationAttempt(id, ok){
  recordEvaluationItem(id, 'main', ok, true);
}
function recordActivity(id){
  recordEvaluationItem(id, 'main', true, true);
}

function syncManualSelects(name, value){
  $$(`[data-manual="${name}"]`).forEach(sel => { sel.value = value; });
}
function getMergedComment(primaryId, footerId){
  const primary = $('#'+primaryId)?.value || '';
  const footer = $('#'+footerId)?.value || '';
  return primary || footer || '';
}
function mirrorComment(sourceId, targetId){
  const source = $('#'+sourceId), target = $('#'+targetId);
  if(source && target && !target.value) target.value = source.value;
  saveQualiopiState(false);
}
function statusFromStats(st){
  if(!st || !st.touched) return 'not-started';
  const max = st.attempted || 1;
  const pct = Math.round((st.correct / max) * 100);
  if(pct >= 75) return 'achieved';
  if(pct >= 45) return 'progress';
  return 'not-achieved';
}
function statusLabel(status){
  return {
    'achieved':'Objectif atteint',
    'progress':'Objectif en cours d’acquisition',
    'not-achieved':'Objectif non atteint',
    'not-started':'Non commencé'
  }[status] || status;
}
function scoreText(st){
  if(!st || !st.touched) return '—';
  const max = st.attempted || 1;
  const pct = Math.round((st.correct / max) * 100);
  return `${st.correct}/${max} — ${pct}%`;
}
function renderQualiopiEvaluation(){
  const rows = $('#evaluationRows');
  if(!rows) return;
  ensureEvalStats();
  rows.innerHTML = evaluationSections.map(section => {
    const status = section.manual ? (manualStatus[section.id] || 'not-started') : statusFromStats(evalStats[section.id]);
    const score = section.manual ? 'Évaluation manuelle' : scoreText(evalStats[section.id]);
    return `<tr><td>${section.objective}</td><td>${section.subject}</td><td>${section.method}</td><td class="score-mini">${score}</td><td><span class="status ${status}">${statusLabel(status)}</span></td></tr>`;
  }).join('');
  const statuses = evaluationSections.map(section => section.manual ? (manualStatus[section.id] || 'not-started') : statusFromStats(evalStats[section.id]));
  const completed = statuses.filter(s => s !== 'not-started').length;
  const completionRate = Math.round((completed / evaluationSections.length) * 100);
  const completionEl = $('#completionRate');
  if(completionEl) completionEl.textContent = completionRate + '%';
  let overall = 'not-started';
  if(statuses.some(s => s !== 'not-started')){
    overall = statuses.every(s => s === 'achieved') ? 'achieved' : statuses.some(s => s === 'not-achieved') ? 'not-achieved' : 'progress';
  }
  const os = $('#overallStatus');
  if(os){ os.textContent = statusLabel(overall); os.className = 'status ' + overall; }
}
function collectQualiopiState(){
  return {
    learner: $('#learnerName')?.value || 'Isabelle Davion',
    trainer: $('#trainerName')?.value || 'Tisha DOUTY-DOSIERE',
    date: $('#evaluationDate')?.value || '',
    evalStats,
    manualStatus,
    comments: {
      propertyReadback: getMergedComment('propertyReadbackComments','propertyReadbackFooterComments'),
      phoneDialogues: getMergedComment('phoneDialoguesComments','phoneDialoguesFooterComments'),
      oralReadback: $('#oralReadbackComments')?.value || '',
      oralProperty: $('#oralPropertyComments')?.value || '',
      writingDetails: $('#writingDetailsComments')?.value || '',
      writingJobsearch: $('#writingJobsearchComments')?.value || '',
      general: $('#trainerComments')?.value || ''
    },
    lastSaved: new Date().toISOString()
  };
}
function saveQualiopiState(showMessage=true){
  if(!$('#evaluationReport')) return;
  const state = collectQualiopiState();
  localStorage.setItem(QUALIOPI_KEY, JSON.stringify(state));
  const last = $('#lastSaved');
  if(last) last.textContent = new Date(state.lastSaved).toLocaleString();
  if(showMessage) alert('Progress saved in this browser. / Progression enregistrée dans ce navigateur.');
}
function loadQualiopiState(){
  try{
    const raw = localStorage.getItem(QUALIOPI_KEY);
    if(!raw) return;
    const state = JSON.parse(raw);
    evalStats = state.evalStats || {};
    manualStatus = state.manualStatus || manualStatus;
    if($('#learnerName')) $('#learnerName').value = state.learner || 'Isabelle Davion';
    if($('#trainerName')) $('#trainerName').value = state.trainer || 'Tisha DOUTY-DOSIERE';
    if($('#evaluationDate') && state.date) $('#evaluationDate').value = state.date;
    if($('#propertyReadbackComments')) $('#propertyReadbackComments').value = state.comments?.propertyReadback || '';
    if($('#propertyReadbackFooterComments')) $('#propertyReadbackFooterComments').value = state.comments?.propertyReadback || '';
    if($('#phoneDialoguesComments')) $('#phoneDialoguesComments').value = state.comments?.phoneDialogues || '';
    if($('#phoneDialoguesFooterComments')) $('#phoneDialoguesFooterComments').value = state.comments?.phoneDialogues || '';
    if($('#oralReadbackComments')) $('#oralReadbackComments').value = state.comments?.oralReadback || '';
    if($('#oralPropertyComments')) $('#oralPropertyComments').value = state.comments?.oralProperty || '';
    if($('#writingDetailsComments')) $('#writingDetailsComments').value = state.comments?.writingDetails || '';
    if($('#writingJobsearchComments')) $('#writingJobsearchComments').value = state.comments?.writingJobsearch || '';
    if($('#trainerComments')) $('#trainerComments').value = state.comments?.general || '';
    if($('#lastSaved') && state.lastSaved) $('#lastSaved').textContent = new Date(state.lastSaved).toLocaleString();
    $$('[data-manual]').forEach(sel => sel.value = manualStatus[sel.dataset.manual] || 'not-started');
  }catch(e){ console.warn('Could not load Qualiopi state', e); }
}
function reportRows(){
  ensureEvalStats();
  return evaluationSections.map(section => {
    const status = section.manual ? (manualStatus[section.id] || 'not-started') : statusFromStats(evalStats[section.id]);
    const score = section.manual ? 'Evaluation manuelle' : scoreText(evalStats[section.id]);
    return [section.objective, section.subject, section.method, score, statusLabel(status)];
  });
}
function reportData(){
  renderQualiopiEvaluation();
  return {
    learner: $('#learnerName')?.value || 'Isabelle Davion',
    trainer: $('#trainerName')?.value || 'Tisha DOUTY-DOSIERE',
    date: $('#evaluationDate')?.value || '',
    completion: $('#completionRate')?.textContent || '0%',
    overall: $('#overallStatus')?.textContent || 'Non commencé',
    rows: reportRows(),
    comments: collectQualiopiState().comments
  };
}
function escapeHtml(v){return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function safeFileName(s){return String(s || 'report').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');}
function downloadBlob(blob, name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function downloadReadableHTML(){
  saveQualiopiState(false);
  const d = reportData();
  const rows = d.rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bilan Qualiopi - ${escapeHtml(d.learner)}</title><style>body{font-family:Arial,sans-serif;color:#222;max-width:1100px;margin:35px auto;padding:0 24px}h1{color:#102331}h2{color:#1d7d7c}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #aaa;padding:8px;vertical-align:top}th{background:#eee}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:18px 0}.box{border:1px solid #bbb;padding:10px;border-radius:8px}.comments{white-space:pre-wrap;min-height:70px}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Bilan d'évaluation des acquis - Qualiopi</h1><h2>Lesson 20 - Numbers, Letters & Property Details Lab</h2><div class="meta"><div class="box"><b>Apprenante:</b> ${escapeHtml(d.learner)}</div><div class="box"><b>Formatrice:</b> ${escapeHtml(d.trainer)}</div><div class="box"><b>Date:</b> ${escapeHtml(d.date)}</div><div class="box"><b>Completion:</b> ${escapeHtml(d.completion)}</div><div class="box"><b>Résultat global:</b> ${escapeHtml(d.overall)}</div></div><table><thead><tr><th>Objectif pédagogique</th><th>Support / sujet</th><th>Mode d'évaluation</th><th>Score / observation</th><th>Résultat</th></tr></thead><tbody>${rows}</tbody></table><h2>Commentaires - Section 08 property detail read-back</h2><div class="box comments">${escapeHtml(d.comments.propertyReadback)||'Aucun commentaire.'}</div><h2>Commentaires - Section 09 phone dialogues / roleplays</h2><div class="box comments">${escapeHtml(d.comments.phoneDialogues)||'Aucun commentaire.'}</div><h2>Commentaires - oral read-back</h2><div class="box comments">${escapeHtml(d.comments.oralReadback)||'Aucun commentaire.'}</div><h2>Commentaires - oral property call</h2><div class="box comments">${escapeHtml(d.comments.oralProperty)||'Aucun commentaire.'}</div><h2>Commentaires - written details</h2><div class="box comments">${escapeHtml(d.comments.writingDetails)||'Aucun commentaire.'}</div><h2>Commentaires - professional writing</h2><div class="box comments">${escapeHtml(d.comments.writingJobsearch)||'Aucun commentaire.'}</div><h2>Commentaires généraux</h2><div class="box comments">${escapeHtml(d.comments.general)||'Aucun commentaire.'}</div><p><small>Rapport généré depuis la page interactive. Les résultats restent également sauvegardés dans le navigateur utilisé.</small></p></body></html>`;
  downloadBlob(new Blob([html], {type:'text/html;charset=utf-8'}), `${safeFileName(d.learner)}-Lesson-20-Bilan-Qualiopi.html`);
}
function latinText(s){return String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/[^\x20-\x7E]/g,'');}
function pdfEscape(s){return latinText(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function wrapText(text,max=92){const words=latinText(text).split(/\s+/);const lines=[];let line='';for(const w of words){if(!w)continue;const next=line?line+' '+w:w;if(next.length>max&&line){lines.push(line);line=w}else line=next}if(line)lines.push(line);return lines.length?lines:[''];}
function buildSimplePDF(d){
  const pageW=595,pageH=842,left=42,top=800,bottom=45,lineH=14;let pages=[[]],y=top;
  function addLine(text,size=10,bold=false){const wrapped=wrapText(text,size>=14?72:94);for(const ln of wrapped){if(y<bottom){pages.push([]);y=top}pages[pages.length-1].push({text:ln,x:left,y,size,bold});y-=size>=14?20:lineH}}
  function gap(n=8){y-=n}
  addLine('BILAN D EVALUATION DES ACQUIS - QUALIOPI',17,true);addLine('Lesson 20 - Numbers, Letters & Property Details Lab',12,true);gap();
  addLine(`Apprenante: ${d.learner}`);addLine(`Formatrice: ${d.trainer}`);addLine(`Date: ${d.date}`);addLine(`Completion: ${d.completion} | Resultat global: ${d.overall}`);gap(12);
  d.rows.forEach((r,i)=>{addLine(`${i+1}. Objectif: ${r[0]}`,11,true);addLine(`Support / sujet: ${r[1]}`);addLine(`Mode d evaluation: ${r[2]}`);addLine(`Score: ${r[3]} | Resultat: ${r[4]}`);gap(7)});
  const commentBlocks = [['Commentaires Section 08 property detail read-back',d.comments.propertyReadback],['Commentaires Section 09 phone dialogues / roleplays',d.comments.phoneDialogues],['Commentaires oral read-back',d.comments.oralReadback],['Commentaires oral property call',d.comments.oralProperty],['Commentaires written details',d.comments.writingDetails],['Commentaires professional writing',d.comments.writingJobsearch],['Commentaires generaux',d.comments.general]];
  commentBlocks.forEach(([title,body])=>{gap(4);addLine(title,12,true);addLine(body||'Aucun commentaire.');});
  const objs=[];function obj(body){objs.push(body);return objs.length}const font1=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');const font2=obj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');const pageRefs=[];const contentRefs=[];
  for(const lines of pages){let stream='';for(const l of lines){stream+=`BT /${l.bold?'F2':'F1'} ${l.size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${pdfEscape(l.text)}) Tj ET\n`}contentRefs.push(obj(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`));pageRefs.push(obj('PLACEHOLDER'))}
  const pagesRef=obj('PLACEHOLDER_PAGES');pageRefs.forEach((ref,i)=>{objs[ref-1]=`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${contentRefs[i]} 0 R >>`});objs[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(r=>r+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`;const catalog=obj(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);let out='%PDF-1.4\n%PDFREPORT\n',offsets=[0];for(let i=0;i<objs.length;i++){offsets.push(out.length);out+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`}const xref=out.length;out+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offsets.length;i++)out+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';out+=`trailer\n<< /Size ${objs.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;return new Blob([new TextEncoder().encode(out)],{type:'application/pdf'});
}
function downloadPDFReport(){saveQualiopiState(false);const d=reportData();downloadBlob(buildSimplePDF(d),`${safeFileName(d.learner)}-Lesson-20-Bilan-Qualiopi.pdf`);}
function resetQualiopi(){if(!confirm('Reset all evaluation results for this lesson?')) return;localStorage.removeItem('isabelleNumbersQualiopiV1');localStorage.removeItem('isabelleNumbersQualiopiV2');location.reload();}
function initQualiopiFooter(){
  if(!$('#evaluationReport')) return;
  ensureEvalStats();
  if($('#evaluationDate') && !$('#evaluationDate').value) $('#evaluationDate').value = new Date().toISOString().slice(0,10);
  loadQualiopiState();
  $$('[data-manual]').forEach(sel => sel.addEventListener('change', () => {
    manualStatus[sel.dataset.manual] = sel.value;
    syncManualSelects(sel.dataset.manual, sel.value);
    saveQualiopiState(false);
    renderQualiopiEvaluation();
  }));
  ['learnerName','trainerName','evaluationDate','propertyReadbackComments','propertyReadbackFooterComments','phoneDialoguesComments','phoneDialoguesFooterComments','oralReadbackComments','oralPropertyComments','writingDetailsComments','writingJobsearchComments','trainerComments'].forEach(id => {
    const el = $('#'+id); if(el) el.addEventListener('input', () => saveQualiopiState(false));
  });
  $('#propertyReadbackComments')?.addEventListener('input', () => mirrorComment('propertyReadbackComments','propertyReadbackFooterComments'));
  $('#propertyReadbackFooterComments')?.addEventListener('input', () => mirrorComment('propertyReadbackFooterComments','propertyReadbackComments'));
  $('#phoneDialoguesComments')?.addEventListener('input', () => mirrorComment('phoneDialoguesComments','phoneDialoguesFooterComments'));
  $('#phoneDialoguesFooterComments')?.addEventListener('input', () => mirrorComment('phoneDialoguesFooterComments','phoneDialoguesComments'));
  $('#saveProgress')?.addEventListener('click', () => saveQualiopiState(true));
  $('#downloadPdf')?.addEventListener('click', downloadPDFReport);
  $('#downloadHtml')?.addEventListener('click', downloadReadableHTML);
  $('#printReport')?.addEventListener('click', () => { saveQualiopiState(false); window.print(); });
  $('#resetProgress')?.addEventListener('click', resetQualiopi);
  renderQualiopiEvaluation();
}
initQualiopiFooter();
