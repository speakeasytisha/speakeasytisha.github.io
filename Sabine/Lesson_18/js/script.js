(() => {
  'use strict';

  const vocab = {
    arrival: [
      ['🧳 reservation', 'réservation', 'a booking made before you arrive', 'I have a reservation for two nights.'],
      ['🪪 passport', 'passeport', 'an official document for travel and identification', 'Could I show you my passport, please?'],
      ['🔑 key card', 'carte-clé', 'the card used to open the hotel room', 'Here is your key card for room 214.'],
      ['🚗 parking', 'parking', 'a place to leave your car', 'Is parking included?'],
      ['🛎️ check in', 'faire le check-in', 'to arrive and receive your room', 'We would like to check in, please.'],
      ['📍 directions', 'directions / indications', 'instructions that show the way', 'Could you give us directions to the harbour?']
    ],
    hotel: [
      ['🛏️ quiet room', 'chambre calme', 'a room without much noise', 'Could I have a quiet room, please?'],
      ['🥐 breakfast included', 'petit-déjeuner inclus', 'breakfast is part of the price', 'Is breakfast included?'],
      ['🪟 sea view', 'vue sur la mer', 'a room looking towards the sea', 'Do you have a room with a sea view?'],
      ['🧼 towel', 'serviette', 'a cloth you use after washing', 'There are no towels in the bathroom.'],
      ['🚿 shower', 'douche', 'the place where you wash standing up', 'The shower does not work.'],
      ['🕰️ late check-out', 'départ tardif', 'leaving the room later than usual', 'Could we have a late check-out, please?']
    ],
    help: [
      ['🏧 ATM', 'distributeur', 'a machine where you take out money', 'Is there an ATM near the hotel?'],
      ['🚕 taxi', 'taxi', 'a car service you pay for', 'Could you call a taxi for us?'],
      ['🗺️ map', 'plan', 'a drawing that helps you find places', 'Could I have a map of the town?'],
      ['🍽️ recommendation', 'recommandation', 'a suggestion about what is good', 'Could you recommend a restaurant?'],
      ['💊 pharmacy', 'pharmacie', 'a shop where you buy medicine', 'The ATM is next to the pharmacy.'],
      ['⛵ harbour', 'port', 'the place where boats stay', 'The restaurant is near the harbour.']
    ],
    restaurant: [
      ['🍷 still water', 'eau plate', 'water without gas', 'Could we have still water, please?'],
      ['🥗 side dish', 'accompagnement', 'small extra food with the main dish', 'Could I have fries as a side dish?'],
      ['🍟 fries', 'frites', 'thin pieces of fried potato', 'Could I have fries instead of salad?'],
      ['🍰 dessert', 'dessert', 'sweet food at the end of the meal', 'Could we see the dessert menu, please?'],
      ['🧾 bill', 'addition', 'the total amount to pay', 'Could we have the bill, please?'],
      ['💳 pay by card', 'payer par carte', 'to use a bank card to pay', 'Can we pay by card?']
    ],
    problems: [
      ['⚠️ there is a problem', 'il y a un problème', 'use it to introduce a complaint', 'Excuse me, there is a problem with my room.'],
      ['❌ wrong meal', 'mauvais plat', 'the meal is not what you ordered', 'I think this is the wrong meal.'],
      ['🥶 cold', 'froid', 'not hot enough', 'This dish is a little cold.'],
      ['🔁 change it', 'le changer', 'replace something with another one', 'Could you change it, please?'],
      ['😔 mistake', 'erreur', 'something is not correct', 'I think there is a mistake.'],
      ['🙏 apologise', 's’excuser', 'say sorry', 'I’m very sorry about that.']
    ]
  };

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const times = ['8:00 a.m.','10:30 a.m.','1:00 p.m.','3:00 p.m.','7:30 p.m.','9:00 p.m.'];

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.9;
    const voices = speechSynthesis.getVoices() || [];
    const v = voices.find(v=>/^en-GB/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang));
    if(v) u.voice = v;
    speechSynthesis.speak(u);
  }

  function initGlobal(){
    $('#frToggle')?.addEventListener('click', ()=>{
      document.body.classList.toggle('help-off');
      $('#frToggle').textContent = document.body.classList.contains('help-off') ? '🇫🇷 French help: OFF' : '🇫🇷 French help: ON';
    });
    $('#printBtn')?.addEventListener('click', ()=>window.print());
    $$('.speak-page, .speak-dialogue').forEach(btn=>btn.addEventListener('click', ()=>speak(btn.dataset.speech || btn.textContent)));
    $$('.reveal-btn').forEach(btn=>btn.addEventListener('click', ()=>{
      const target = document.getElementById(btn.dataset.target);
      if(!target) return;
      const open = target.classList.toggle('open');
      btn.textContent = open ? 'Hide model help' : 'Show model help';
    }));
  }

  function initVocab(){
    const labels = {
      arrival:'🚖 Arrival',
      hotel:'🏨 Hotel room',
      help:'🗺️ Practical help',
      restaurant:'🍽️ Restaurant',
      problems:'⚠️ Problems & complaints'
    };
    const tabs = $('#vocabTabs');
    const list = $('#vocabList');
    let active = 'arrival';
    function draw(){
      tabs.innerHTML = '';
      Object.keys(vocab).forEach(key=>{
        const b = document.createElement('button');
        b.type='button';
        b.className = `tab ${key===active?'active':''}`;
        b.textContent = labels[key];
        b.addEventListener('click', ()=>{active=key; draw();});
        tabs.appendChild(b);
      });
      list.innerHTML = '';
      vocab[active].forEach(([term,fr,definition,example])=>{
        const card = document.createElement('article');
        card.className='vocab-item';
        card.innerHTML = `<div class="vocab-top"><div><h4>${term}</h4><span class="fr">${fr}</span></div><button class="audio-btn" type="button">🔊</button></div><p>${definition}</p><p><i>“${example}”</i></p>`;
        $('.audio-btn', card).addEventListener('click', ()=>speak(`${term}. ${example}`));
        list.appendChild(card);
      });
    }
    draw();
  }

  function fillSelect(id, arr){
    const select = $(id);
    arr.forEach((item,i)=>{
      const opt = document.createElement('option');
      opt.value=item; opt.textContent=item; if(i===0) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function initCalendar(){
    fillSelect('#daySelect', days);
    fillSelect('#monthSelect', months);
    fillSelect('#dateSelect', Array.from({length:31}, (_,i)=>String(i+1)));
    fillSelect('#timeSelect', times);
    function sentence(){
      return `We are going to arrive on ${$('#daySelect').value}, ${$('#dateSelect').value} ${$('#monthSelect').value}, at ${$('#timeSelect').value}.`;
    }
    $('#buildCalendarSentence')?.addEventListener('click', ()=>$('#calendarSentence').textContent = sentence());
    $('#speakCalendarSentence')?.addEventListener('click', ()=>speak(sentence()));
  }

  function setupChoice(containerId, feedbackId, options, correctIndex){
    const root = $(containerId); const fb = $(feedbackId);
    if(!root || !fb) return;
    root.innerHTML='';
    options.forEach((text,index)=>{
      const b = document.createElement('button');
      b.type='button'; b.className='choice-btn'; b.textContent=text;
      b.addEventListener('click', ()=>{
        $$('.choice-btn', root).forEach(x=>x.disabled=true);
        if(index===correctIndex){
          b.classList.add('correct'); fb.className='feedback good'; fb.textContent='✓ Excellent — that is the best sentence.';
        } else {
          b.classList.add('wrong'); $$('.choice-btn', root)[correctIndex].classList.add('correct');
          fb.className='feedback bad'; fb.textContent = `Not this time. Better model: “${options[correctIndex]}”`;
        }
      });
      root.appendChild(b);
    });
  }

  function initChoices(){
    setupChoice('#hotelChoice','#hotelChoiceFeedback',[
      'Could I have a quiet room, please?',
      'I want room. Give key now.',
      'Quiet room possible you?'
    ],0);
    setupChoice('#restaurantChoice','#restaurantChoiceFeedback',[
      'Could we have the bill, please?',
      'Bill now. Fast.',
      'You give dessert bill.'
    ],0);
  }

  function setupBuilders(){
    $$('.builder').forEach(builder=>{
      const answer = builder.dataset.answer.split(' ');
      const words = builder.dataset.words.split('|');
      builder.innerHTML = `<div class="builder-instruction">Tap each word in the order you want to say it. Tap a word in the yellow box to send it back.</div><div class="word-bank"></div><div class="answer-zone"><span class="builder-placeholder">Your sentence appears here.</span></div><div class="builder-actions"><button class="secondary check-builder" type="button">Check</button><button class="mini-btn reset-builder" type="button">Clear</button><button class="audio-btn model-builder" type="button">🔊 Listen</button></div><div class="builder-status"></div>`;
      const bank = $('.word-bank', builder), zone = $('.answer-zone', builder), status = $('.builder-status', builder);
      function chip(word){
        const c = document.createElement('button');
        c.type='button'; c.className='word-chip'; c.textContent=word;
        c.addEventListener('click', ()=>{
          if(c.parentElement===bank){ $('.builder-placeholder', zone)?.remove(); zone.appendChild(c); }
          else { bank.appendChild(c); if(!$('.word-chip', zone)) zone.innerHTML='<span class="builder-placeholder">Your sentence appears here.</span>'; }
          status.textContent=''; status.className='builder-status';
        });
        return c;
      }
      words.forEach(word=>bank.appendChild(chip(word)));
      $('.check-builder', builder).addEventListener('click', ()=>{
        const built = $$('.word-chip', zone).map(x=>x.textContent).join(' ').trim().toLowerCase();
        const correct = answer.join(' ').trim().toLowerCase();
        if(built === correct){
          status.className='builder-status good'; status.textContent='✓ Correct. Read it aloud one more time.';
        } else {
          status.className='builder-status bad'; status.textContent=`Not yet. Model: “${answer.join(' ')}.”`;
        }
      });
      $('.reset-builder', builder).addEventListener('click', ()=>{
        $$('.word-chip', zone).forEach(c=>bank.appendChild(c));
        zone.innerHTML='<span class="builder-placeholder">Your sentence appears here.</span>';
        status.textContent=''; status.className='builder-status';
      });
      $('.model-builder', builder).addEventListener('click', ()=>speak(answer.join(' ')));
    });
  }

  function initFinalBuilder(){
    function build(){
      return `First, we are going to ${$('#arrivalMode').value}. Then, at the hotel, I am going to ${$('#helpNeed').value}. For dinner, we are going to ${$('#dinnerPlan').value}. If there is a small problem, I am going to ${$('#problemPlan').value}.`;
    }
    $('#buildFinalPlan')?.addEventListener('click', ()=>$('#finalPlanOutput').textContent = build());
    $('#speakFinalPlan')?.addEventListener('click', ()=>speak(build()));
  }

  initGlobal();
  initVocab();
  initCalendar();
  initChoices();
  setupBuilders();
  initFinalBuilder();
})();
