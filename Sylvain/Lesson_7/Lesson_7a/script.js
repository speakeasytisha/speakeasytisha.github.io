(() => {
  'use strict';
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];
  const storageKey = 'sylvain_question_masterclass_rebuilt_v1';
  const state = { answered: 0, correct: 0 };

  const questions = {
    be: [
      {q:'Your wife is Portuguese. →', correct:'Is your wife Portuguese?', options:['Are your wife Portuguese?','Is your wife Portuguese?','Does your wife Portuguese?'], why:'With be, move is before the subject: Is your wife…?'},
      {q:'You are moving to Lisbon. →', correct:'Are you moving to Lisbon?', options:['Do you moving to Lisbon?','Are you move to Lisbon?','Are you moving to Lisbon?'], why:'Present continuous question: Are + subject + verb-ing?'},
      {q:'The order is ready. →', correct:'Is the order ready?', options:['Is the order ready?','Does the order ready?','Are the order ready?'], why:'Order = it, so use is.'},
      {q:'The meals are labelled. →', correct:'Are the meals labelled?', options:['Do the meals labelled?','Is the meals labelled?','Are the meals labelled?'], why:'Meals = they, so use are.'},
      {q:'You are going to call the client. →', correct:'Are you going to call the client?', options:['Are you going to call the client?','Do you going to call the client?','Will you going to call the client?'], why:'Going to question: Are + subject + going to + base verb?'},
      {q:'The aircraft is small. →', correct:'Is the aircraft small?', options:['Does the aircraft small?','Is the aircraft small?','Are the aircraft small?'], why:'Aircraft = it, so use is.'}
    ],
    doYou: [
      {q:'You work with several airlines. →', correct:'Do you work with several airlines?', options:['Are you work with several airlines?','Do you work with several airlines?','Does you work with several airlines?'], why:'Present simple with you: Do + you + base verb?'},
      {q:'You prepare food for flights. →', correct:'Do you prepare food for flights?', options:['Do you prepare food for flights?','Are you prepare food for flights?','Do you prepares food for flights?'], why:'After do, use prepare, not prepares.'},
      {q:'You have two daughters. →', correct:'Do you have two daughters?', options:['Have you two daughters?','Does you have two daughters?','Do you have two daughters?'], why:'Modern/business English: Do you have…?'},
      {q:'You need the order details. →', correct:'Do you need the order details?', options:['Do you needs the order details?','Do you need the order details?','Are you need the order details?'], why:'Do + you + base verb: need.'}
    ],
    does: [
      {q:'Your wife works with you. →', correct:'Does your wife work with you?', options:['Does your wife work with you?','Does your wife works with you?','Is your wife work with you?'], why:'After does, use the base verb work.'},
      {q:'The order includes fruit. →', correct:'Does the order include fruit?', options:['Do the order include fruit?','Does the order includes fruit?','Does the order include fruit?'], why:'Order = it, use does + include.'},
      {q:'The aircraft has an oven. →', correct:'Does the aircraft have an oven?', options:['Does the aircraft have an oven?','Does the aircraft has an oven?','Is the aircraft have an oven?'], why:'After does, use have, not has.'},
      {q:'The flight leaves at 07:45. →', correct:'Does the flight leave at 07:45?', options:['Does the flight leaves at 07:45?','Does the flight leave at 07:45?','Is the flight leave at 07:45?'], why:'After does, use leave.'}
    ],
    mixedPresent: [
      {q:'We prepare cold breakfasts. →', correct:'Do we prepare cold breakfasts?', options:['Do we prepare cold breakfasts?','Are we prepare cold breakfasts?','Does we prepare cold breakfasts?'], why:'We uses do.'},
      {q:'The logistics company handles delivery. →', correct:'Does the logistics company handle delivery?', options:['Do the logistics company handle delivery?','Does the logistics company handle delivery?','Does the logistics company handles delivery?'], why:'Company = it, use does + handle.'},
      {q:'Your daughters go to school. →', correct:'Do your daughters go to school?', options:['Does your daughters go to school?','Are your daughters go to school?','Do your daughters go to school?'], why:'Daughters = they, use do.'},
      {q:'The client pays by credit card. →', correct:'Does the client pay by credit card?', options:['Does the client pays by credit card?','Does the client pay by credit card?','Is the client pay by credit card?'], why:'Client = he/she/it, use does + pay.'}
    ],
    goingTo: [
      {q:'You are going to move to Lisbon. →', correct:'Are you going to move to Lisbon?', options:['Are you going to move to Lisbon?','Do you going to move to Lisbon?','Will you going to move to Lisbon?'], why:'Are + you + going to + move?'},
      {q:'Your family is going to buy a house. →', correct:'Is your family going to buy a house?', options:['Does your family going to buy a house?','Is your family going to buy a house?','Will your family going to buy a house?'], why:'Family = it, use is going to.'},
      {q:'They are going to check the labels. →', correct:'Are they going to check the labels?', options:['Are they going to check the labels?','Do they going to check the labels?','Will they going to check the labels?'], why:'Are + they + going to + base verb.'},
      {q:'You are going to work directly with airlines. →', correct:'When are you going to work directly with airlines?', options:['When do you going to work directly with airlines?','When are you going to work directly with airlines?','When will you going to work directly with airlines?'], why:'WH word + are + subject + going to + base verb.'}
    ],
    will: [
      {q:'You will send the confirmation. →', correct:'Will you send the confirmation?', options:['Do you will send the confirmation?','Will you send the confirmation?','Are you will send the confirmation?'], why:'Will + subject + base verb?'},
      {q:'The delivery will be on time. →', correct:'Will the delivery be on time?', options:['Will the delivery be on time?','Does the delivery will be on time?','Is the delivery will be on time?'], why:'Will question: Will + subject + base verb.'},
      {q:'You will call the client. →', correct:'Who will you call?', options:['Who you will call?','Who will you call?','Who do you will call?'], why:'WH + will + subject + base verb.'},
      {q:'They will update the order. →', correct:'Will they update the order?', options:['Do they will update the order?','Will they updates the order?','Will they update the order?'], why:'After will, use base verb: update.'}
    ],
    schedule: [
      {q:'The flight leaves tomorrow at 07:45. →', correct:'When does the flight leave?', options:['When does the flight leave?','When is the flight leave?','When does the flight leaves?'], why:'Official schedule: present simple question with does.'},
      {q:'The restaurant opens at 12. →', correct:'What time does the restaurant open?', options:['What time the restaurant opens?','What time does the restaurant open?','What time is the restaurant open?'], why:'For the action open: does + open.'},
      {q:'The course starts on Tuesday. →', correct:'When does the course start?', options:['When does the course starts?','When does the course start?','When is the course start?'], why:'Does + start, not starts.'},
      {q:'The order arrives before boarding. →', correct:'When does the order arrive?', options:['When do the order arrive?','When is the order arrive?','When does the order arrive?'], why:'Order = it, use does + arrive.'}
    ],
    wh: [
      {q:'___ do you live? → In Savoie.', correct:'Where', options:['When','Where','Why'], why:'Where asks about a place.'},
      {q:'___ are you moving to Lisbon? → In August.', correct:'When', options:['When','Why','What'], why:'When asks about time.'},
      {q:'___ are you moving? → For family and work.', correct:'Why', options:['Where','Why','Which'], why:'Why asks about a reason.'},
      {q:'___ meals do you need? → Three.', correct:'How many', options:['How much','How many','Which'], why:'Meals are countable, so use how many.'},
      {q:'___ flight is this order for? → 9H-LFX.', correct:'Which', options:['Which','Why','How'], why:'Which asks about a choice or identification.'},
      {q:'___ should we label the meal for? → Julien.', correct:'Who', options:['What','Who','When'], why:'Who asks about a person.'}
    ],
    final: [
      {q:'Choose the best question: You want to know if there are allergies.', correct:'Are there any allergies?', options:['Are there any allergies?','Do there any allergies?','Is there any allergies?'], why:'Use Are there any + plural noun.'},
      {q:'Choose the best question: You want the delivery time.', correct:'What time is the delivery?', options:['What time does the delivery?','What time is the delivery?','What time the delivery is?'], why:'Delivery time as information: What time is the delivery?'},
      {q:'Choose the best question: You want to know if the aircraft has an oven.', correct:'Does the aircraft have an oven?', options:['Does the aircraft have an oven?','Does the aircraft has an oven?','Is the aircraft have an oven?'], why:'After does, use have.'},
      {q:'Choose the best question: You ask about a Lisbon plan.', correct:'Are you going to buy a house?', options:['Do you going to buy a house?','Are you going to buy a house?','Will you going to buy a house?'], why:'Going to plan: Are you going to + base verb?'},
      {q:'Choose the best question: You want a reason.', correct:'Why are you moving to Portugal?', options:['Why do you moving to Portugal?','Why are you moving to Portugal?','Why you are moving to Portugal?'], why:'WH + are + subject + verb-ing.'},
      {q:'Choose the best question: You ask about a flight schedule.', correct:'When does the flight leave?', options:['When does the flight leave?','When is the flight leave?','When does the flight leaves?'], why:'Schedule question: does + leave.'}
    ]
  };

  const transformsPersonal = [
    {statement:'You live in Savoie.', model:'Where do you live?'},
    {statement:'You are moving to Lisbon in August.', model:'When are you moving to Lisbon?'},
    {statement:'Your wife is Portuguese.', model:'Is your wife Portuguese?'},
    {statement:'You have two daughters.', model:'Do you have two daughters?'},
    {statement:'You like rugby and golf.', model:'What sports do you like?'},
    {statement:'You are going to buy a house.', model:'Are you going to buy a house?'}
  ];

  const transformsPro = [
    {statement:'You prepare food for several airlines.', model:'Do you prepare food for several airlines?'},
    {statement:'The order includes three cold breakfasts.', model:'Does the order include three cold breakfasts?'},
    {statement:'The delivery time is 07:45.', model:'What time is the delivery?'},
    {statement:'The aircraft has an oven.', model:'Does the aircraft have an oven?'},
    {statement:'The client needs special labels.', model:'Does the client need special labels?'},
    {statement:'You will send the confirmation today.', model:'Will you send the confirmation today?'}
  ];

  const speakingRounds = [
    {title:'🏡 Family & Lisbon', q:'Ask about his move to Lisbon.', simple:'Are you moving to Lisbon in August?', strong:'Why are you moving to Lisbon, and what are you looking forward to?', follow:'What will change for your family?'},
    {title:'👨‍🍳 Work today', q:'Ask about his current work.', simple:'Do you work with several airlines?', strong:'How do you organise airline-catering orders at the moment?', follow:'What is the most important detail in an order?'},
    {title:'✈️ Aircraft details', q:'Ask about equipment.', simple:'Does the aircraft have an oven?', strong:'Does the aircraft have an oven or a microwave for this order?', follow:'Do the containers need to be oven-safe?'},
    {title:'📦 Order details', q:'Ask about the client order.', simple:'How many meals do you need?', strong:'Which flight is this order for, and what time is the delivery?', follow:'Are there any special dietary restrictions?'},
    {title:'🔮 Future plan', q:'Ask about his future business plans.', simple:'Are you going to work directly with airlines?', strong:'When are you going to start working directly with airline clients?', follow:'Will this change your delivery process?'},
    {title:'🏷️ Labels', q:'Ask about labels and restrictions.', simple:'Should we label each item?', strong:'Should we label each item in English and include dietary restrictions?', follow:'Who should we label the special meals for?'}
  ];

  const bankTopics = {
    personal: [
      {value:'home', label:'home / place', forms:{yesno:'Do you live in Savoie?', what:'What kind of home are you looking for?', where:'Where do you live now?', when:'When are you moving?', why:'Why are you moving to Portugal?', howmany:'How many people live in your family home?', which:'Which area are you considering in Lisbon?'}},
      {value:'family', label:'family', forms:{yesno:'Do you have children?', what:'What does your eldest daughter want to become?', where:'Where does your family live?', when:'When will your family move?', why:'Why is Portugal important for your family?', howmany:'How many daughters do you have?', which:'Which school is your younger daughter going to attend?'}},
      {value:'future', label:'future plans', forms:{yesno:'Are you going to buy a house?', what:'What are you going to do in Lisbon?', where:'Where are you going to live?', when:'When are you going to move?', why:'Why are you going to start a new life there?', howmany:'How many houses are you going to visit?', which:'Which plan is the most important for you?'}}
    ],
    professional: [
      {value:'order', label:'order details', forms:{yesno:'Does the order include special meals?', what:'What does the order include?', where:'Where should we deliver the order?', when:'When is the delivery?', why:'Why does the client need different meals?', howmany:'How many meals do you need?', which:'Which flight is this order for?'}},
      {value:'aircraft', label:'aircraft equipment', forms:{yesno:'Does the aircraft have an oven?', what:'What equipment is available on board?', where:'Where is the food stored on board?', when:'When does the aircraft leave?', why:'Why do the containers need to be oven-safe?', howmany:'How many ovens are on the aircraft?', which:'Which aircraft is this order for?'}},
      {value:'labels', label:'labels and diets', forms:{yesno:'Are there any allergies?', what:'What dietary restrictions should we note?', where:'Where should we place the labels?', when:'When should we confirm the restrictions?', why:'Why should we label each item in English?', howmany:'How many special meals are required?', which:'Which meals need labels?'}}
    ]
  };

  function speak(text){
    if(!('speechSynthesis' in window)){ alert('Audio is not available in this browser.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang='en-GB'; u.rate=.88;
    const voices = speechSynthesis.getVoices();
    u.voice = voices.find(v=>/^en-GB/i.test(v.lang)) || voices.find(v=>/^en-US/i.test(v.lang)) || null;
    speechSynthesis.speak(u);
  }

  function renderQuestions(key, targetId){
    const holder = $('#'+targetId); if(!holder) return;
    holder.innerHTML = '';
    questions[key].forEach((item, idx)=>{
      const card = document.createElement('article'); card.className='question-card';
      card.innerHTML = `<p>${idx+1}. ${item.q}</p><div class="answers"></div><div class="feedback" aria-live="polite"></div>`;
      const answers = $('.answers', card);
      const opts = item.options.map((text, i)=>({text, i}));
      opts.forEach(opt=>{
        const btn = document.createElement('button'); btn.type='button'; btn.className='option-btn'; btn.textContent=opt.text;
        btn.addEventListener('click', ()=>{
          const isCorrect = opt.text === item.correct;
          $$('.option-btn', card).forEach(b=>{ b.disabled = true; if(b.textContent===item.correct) b.classList.add('correct'); });
          if(!isCorrect) btn.classList.add('wrong');
          const f = $('.feedback', card); f.className = 'feedback ' + (isCorrect?'good':'bad'); f.innerHTML = `${isCorrect?'✅ Correct.':'❌ Not quite.'} ${item.why}`;
          state.answered++; if(isCorrect) state.correct++; updateScore();
        });
        answers.appendChild(btn);
      });
      holder.appendChild(card);
    });
  }

  function renderTransforms(data, targetId){
    const holder = $('#'+targetId); if(!holder) return;
    holder.innerHTML = '';
    data.forEach((item, idx)=>{
      const card = document.createElement('article'); card.className='transform-card';
      card.innerHTML = `<h3>${idx+1}. Make a question</h3><p><b>Statement:</b> ${item.statement}</p><textarea placeholder="Write the question here..."></textarea><div class="button-row"><button type="button" class="model-btn">Show model</button><button type="button" class="model-btn speak">Listen</button></div><div class="model-line"><b>Model:</b> ${item.model}</div>`;
      const line = $('.model-line', card);
      $('.model-btn:not(.speak)', card).addEventListener('click', ()=>{ line.classList.toggle('open'); });
      $('.speak', card).addEventListener('click', ()=>speak(item.model));
      holder.appendChild(card);
    });
  }

  function renderSpeaking(){
    const holder = $('#speakingRounds'); if(!holder) return;
    holder.innerHTML='';
    speakingRounds.forEach((r, idx)=>{
      const card = document.createElement('article'); card.className='round-card';
      card.innerHTML = `<h3>${r.title}</h3><p><b>Task:</b> ${r.q}</p><div class="button-row"><button type="button" class="model-btn show">Show model</button><button type="button" class="model-btn listen">Listen</button></div><div class="model-line"><p><b>Simple:</b> ${r.simple}</p><p><b>Stronger:</b> ${r.strong}</p><p><b>Follow-up:</b> ${r.follow}</p></div>`;
      const model = $('.model-line', card);
      $('.show', card).addEventListener('click', ()=>{ model.classList.toggle('open'); });
      $('.listen', card).addEventListener('click', ()=>speak(`${r.simple} ${r.strong} ${r.follow}`));
      holder.appendChild(card);
    });
  }

  function populateBankTopics(){
    const contextEl = $('#bankContext');
    const select = $('#bankTopic');
    if(!contextEl || !select) return;
    const context = contextEl.value || 'personal';
    const topics = bankTopics[context] || bankTopics.personal;
    const current = select.value;
    select.innerHTML='';
    topics.forEach(t=>{
      const opt = document.createElement('option'); opt.value=t.value; opt.textContent=t.label; select.appendChild(opt);
    });
    if([...select.options].some(o=>o.value===current)) select.value=current;
  }

  function getGeneratedQuestion(){
    const context = $('#bankContext')?.value || 'personal';
    const type = $('#bankType')?.value || 'yesno';
    const topic = $('#bankTopic')?.value || (bankTopics[context]?.[0]?.value);
    const item = (bankTopics[context] || []).find(t=>t.value===topic) || bankTopics[context]?.[0];
    return item?.forms?.[type] || 'Choose your options to create a question.';
  }

  function buildBankQuestion(){
    const box = $('#generatedQuestion');
    if(box) box.textContent = getGeneratedQuestion();
  }

  function addQuestionToNotes(question){
    const area = $('#myQuestions');
    if(!area || !question) return;
    area.value = (area.value.trim() ? area.value.trim()+"\n" : "") + '- ' + question.trim();
    save();
  }

  function updateScore(){
    const el = $('#scoreText'); if(el) el.textContent = `Score: ${state.correct} / ${state.answered}`;
  }

  function save(){
    localStorage.setItem(storageKey, JSON.stringify({questions: $('#myQuestions')?.value || '', french: document.body.classList.contains('show-french')}));
  }
  function load(){
    try{
      const saved = JSON.parse(localStorage.getItem(storageKey)||'{}');
      if(saved.questions && $('#myQuestions')) $('#myQuestions').value = saved.questions;
      if(saved.french) { document.body.classList.add('show-french'); $('#frenchToggle')?.setAttribute('aria-pressed','true'); }
    }catch(e){}
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderQuestions('be','beQuestions');
    renderQuestions('doYou','doYouQuestions');
    renderQuestions('does','doesQuestions');
    renderQuestions('mixedPresent','mixedPresentQuestions');
    renderQuestions('goingTo','goingToQuestions');
    renderQuestions('will','willQuestions');
    renderQuestions('schedule','scheduleQuestions');
    renderQuestions('wh','whQuestions');
    renderQuestions('final','finalCheckpoint');
    renderTransforms(transformsPersonal,'personalTransform');
    renderTransforms(transformsPro,'proTransform');
    renderSpeaking();
    populateBankTopics(); buildBankQuestion(); load(); updateScore();

    $('#frenchToggle')?.addEventListener('click', e=>{ document.body.classList.toggle('show-french'); e.currentTarget.setAttribute('aria-pressed', document.body.classList.contains('show-french') ? 'true':'false'); save(); });
    $('#saveButton')?.addEventListener('click', ()=>{ save(); alert('Progress saved on this device.'); });
    $('#printButton')?.addEventListener('click', ()=>window.print());
    $('#bankContext')?.addEventListener('change', ()=>{ populateBankTopics(); buildBankQuestion(); });
    $('#bankType')?.addEventListener('change', buildBankQuestion);
    $('#bankTopic')?.addEventListener('change', buildBankQuestion);
    $('#buildQuestion')?.addEventListener('click', buildBankQuestion);
    $('#copyQuestion')?.addEventListener('click', async()=>{ const q=$('#generatedQuestion')?.textContent || ''; try{ await navigator.clipboard.writeText(q); alert('Question copied.'); }catch(e){ const box=$('#generatedQuestion'); if(box){ const range=document.createRange(); range.selectNodeContents(box); const sel=window.getSelection(); sel.removeAllRanges(); sel.addRange(range); } alert('The question is selected. You can copy it manually if needed:\n\n' + q); } });
    $('#addToNotes')?.addEventListener('click', ()=> addQuestionToNotes($('#generatedQuestion')?.textContent || ''));
    $('#listenQuestion')?.addEventListener('click', ()=> speak($('#generatedQuestion')?.textContent || ''));
    $$('.preset-question').forEach(btn=>btn.addEventListener('click', ()=>{ addQuestionToNotes(btn.dataset.question || btn.textContent); btn.classList.add('added'); setTimeout(()=>btn.classList.remove('added'), 650); }));
    $('#downloadNotes')?.addEventListener('click', ()=>{ const content = $('#myQuestions').value || 'No questions saved yet.'; const blob = new Blob([content], {type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sylvain-question-bank.txt'; a.click(); URL.revokeObjectURL(a.href); });
    $('#clearNotes')?.addEventListener('click', ()=>{ if(confirm('Clear saved questions?')){ $('#myQuestions').value=''; save(); } });
    $('#resetLesson')?.addEventListener('click', ()=>{ if(confirm('Reset saved progress and reload?')){ localStorage.removeItem(storageKey); location.reload(); } });
  });
})();
