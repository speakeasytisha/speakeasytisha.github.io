(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  const vocab = [
    {id:'boarding-pass',cat:'airport',icon:'🎫',word:'boarding pass',fr:'carte d’embarquement',def:'the document you show before you get on the plane',ex:'I show my boarding pass at the gate.'},
    {id:'check-in-desk',cat:'airport',icon:'🧳',word:'check-in desk',fr:'comptoir d’enregistrement',def:'the place where you check in your luggage and get your boarding pass',ex:'I go to the check-in desk first.'},
    {id:'gate',cat:'airport',icon:'🚪',word:'gate',fr:'porte d’embarquement',def:'the place where you wait before boarding the plane',ex:'Our gate is number 12.'},
    {id:'luggage',cat:'airport',icon:'🧳',word:'luggage',fr:'bagages',def:'bags and suitcases for your trip',ex:'My luggage is very heavy.'},
    {id:'security',cat:'airport',icon:'🔍',word:'security',fr:'contrôle de sécurité',def:'the airport control area where your bag and body are checked',ex:'We go through security before the gate.'},
    {id:'passport',cat:'airport',icon:'🛂',word:'passport',fr:'passeport',def:'an official document for international travel',ex:'I put my passport in my bag.'},
    {id:'aisle',cat:'plane',icon:'↕️',word:'aisle',fr:'allée',def:'the space between the seats on the plane',ex:'The flight attendant walks down the aisle.'},
    {id:'window-seat',cat:'plane',icon:'🪟',word:'window seat',fr:'siège côté hublot',def:'a seat next to the window',ex:'I prefer a window seat.'},
    {id:'seat-belt',cat:'plane',icon:'🪢',word:'seat belt',fr:'ceinture de sécurité',def:'the belt you fasten when you are seated on the plane',ex:'Please fasten your seat belt.'},
    {id:'overhead-bin',cat:'plane',icon:'📦',word:'overhead bin',fr:'compartiment au-dessus des sièges',def:'the storage space above the seats for hand luggage',ex:'You can put your bag in the overhead bin.'},
    {id:'cabin-crew',cat:'plane',icon:'🧑‍✈️',word:'cabin crew',fr:'personnel de cabine',def:'the flight attendants and other staff working on the plane',ex:'The cabin crew welcome the passengers.'},
    {id:'tray-table',cat:'plane',icon:'🍽️',word:'tray table',fr:'tablette',def:'the small table attached to your seat',ex:'Please put your tray table up.'}
  ];

  const mcqs = [
    {q:'Which word means: “the place where you wait before boarding the plane”?',fr:'Quel mot veut dire : « l’endroit où vous attendez avant d’embarquer » ?',opts:['security','gate','aisle'],a:1,h:'You wait at the gate before you board.'},
    {q:'Which word means: “the belt you fasten when you are seated”?',fr:'Quel mot veut dire : « la ceinture que vous attachez quand vous êtes assis » ?',opts:['seat belt','passport','window seat'],a:0,h:'You fasten your seat belt.'},
    {q:'Which word means: “the staff working on the plane”?',fr:'Quel mot veut dire : « le personnel qui travaille dans l’avion » ?',opts:['cabin crew','luggage','check-in desk'],a:0,h:'Cabin crew = flight attendants and cabin staff.'},
    {q:'Which word means: “bags and suitcases for your trip”?',fr:'Quel mot veut dire : « les valises et sacs pour le voyage » ?',opts:['tray table','luggage','gate'],a:1,h:'Luggage = bags and suitcases.'}
  ];

  const fills = [
    {s:'I show my ______ at the gate.',fr:'Je montre ma ______ à la porte d’embarquement.',opts:['boarding pass','aisle','tray table'],a:0},
    {s:'Please put your bag in the ______.',fr:'Veuillez mettre votre sac dans le ______.',opts:['passport','overhead bin','window seat'],a:1},
    {s:'The flight attendant walks down the ______.',fr:'L’hôtesse / le steward marche dans l’______.',opts:['aisle','security','check-in desk'],a:0},
    {s:'First, we go to the ______ to leave our luggage.',fr:'D’abord, nous allons au ______ pour déposer les bagages.',opts:['cabin crew','check-in desk','window seat'],a:1}
  ];

  const builders = [
    {target:'I show my boarding pass at the gate.', tokens:['I','show','my','boarding','pass','at','the','gate.']},
    {target:'The cabin crew ask you to fasten your seat belt.', tokens:['The','cabin','crew','ask','you','to','fasten','your','seat','belt.']},
    {target:'You can put your luggage in the overhead bin.', tokens:['You','can','put','your','luggage','in','the','overhead','bin.']}
  ];

  const scenarios = [
    {
      title:'Scenario 1 — At the airport',
      prompt:'You are at the airport. A staff member asks: “Can I see your passport and boarding pass, please?” What do you say?',
      fr:'Vous êtes à l’aéroport. Un agent demande : « Puis-je voir votre passeport et votre carte d’embarquement, s’il vous plaît ? » Que dites-vous ?',
      model:'Yes, of course. Here is my passport and my boarding pass.',
      modelFr:'Oui, bien sûr. Voici mon passeport et ma carte d’embarquement.'
    },
    {
      title:'Scenario 2 — On the plane',
      prompt:'You are on the plane. The cabin crew say: “Please fasten your seat belt.” What do you do and what can you say?',
      fr:'Vous êtes dans l’avion. Le personnel de cabine dit : « Veuillez attacher votre ceinture. » Que faites-vous et que pouvez-vous dire ?',
      model:'I fasten my seat belt and say, “Yes, of course.”',
      modelFr:'J’attache ma ceinture de sécurité et je dis : « Oui, bien sûr. »'
    },
    {
      title:'Scenario 3 — Future steward',
      prompt:'Imagine you are cabin crew. A passenger asks: “Where can I put my bag?” What do you say?',
      fr:'Imaginez que vous êtes steward. Un passager demande : « Où puis-je mettre mon sac ? » Que dites-vous ?',
      model:'You can put your bag in the overhead bin above your seat.',
      modelFr:'Vous pouvez mettre votre sac dans le compartiment au-dessus de votre siège.'
    }
  ];

  const score = {now:0,max: mcqs.length + fills.length + vocab.length + builders.length + scenarios.length};
  const used = new Set();

  const Speech = {
    mode:'en-US',
    say(text){
      if(!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find(x => x.lang === this.mode) || voices.find(x => x.lang && x.lang.startsWith('en'));
      if(v) u.voice = v;
      u.lang = this.mode;
      u.rate = 0.96;
      window.speechSynthesis.speak(u);
    },
    stop(){ try{ window.speechSynthesis.cancel(); }catch(e){} }
  };

  function updateScore(){
    $('#scoreNow').textContent = score.now;
    $('#scoreMax').textContent = score.max;
    $('#progressBar').style.width = `${Math.round((score.now/score.max)*100)}%`;
  }
  function award(key){ if(used.has(key)) return; used.add(key); score.now += 1; updateScore(); }

  function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  function renderCards(filter='all'){
    const host = $('#cardGrid');
    host.innerHTML = '';
    vocab.filter(v => filter==='all' || v.cat===filter).forEach(v => {
      const card = document.createElement('article');
      card.className = 'vcard';
      card.innerHTML = `
        <div class="vcard__inner">
          <div class="vface front">
            <div>
              <div class="vicon">${v.icon}</div>
              <div class="vword">${v.word}</div>
              <span class="vtag">${v.cat === 'airport' ? 'Airport' : 'Plane'}</span>
            </div>
            <div class="vbtns">
              <button class="iconbtn btnFlip" type="button">🔄 Flip</button>
              <button class="iconbtn btnAudio" type="button">🔊 Listen</button>
            </div>
          </div>
          <div class="vface back">
            <div>
              <div class="vword">${v.word}</div>
              <div class="vtranslation">${v.fr}</div>
              <div class="vdef">${v.def}</div>
              <div class="vexample">Example: ${v.ex}</div>
            </div>
            <div class="vbtns">
              <button class="iconbtn btnFlip" type="button">🔄 Flip back</button>
              <button class="iconbtn btnAudio" type="button">🔊 Listen</button>
            </div>
          </div>
        </div>`;
      $$('.btnFlip', card).forEach(btn => btn.addEventListener('click', () => { card.classList.toggle('flipped'); award('card:'+v.id);}));
      $$('.btnAudio', card).forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); Speech.say(`${v.word}. ${v.ex}`); }));
      host.appendChild(card);
    });
  }

  let mcqIndex = 0;
  function renderMcq(){
    const item = mcqs[mcqIndex % mcqs.length];
    const host = $('#mcqHost');
    const options = shuffle(item.opts.map((t,i)=>({text:t,correct:i===item.a})));
    host.innerHTML = `
      <div class="exercise-title">Definition challenge</div>
      <div class="exercise-sub">Read the definition and choose the correct word.</div>
      <div class="prompt-box"><strong>${item.q}</strong><br><span class="muted fr">${item.fr}</span></div>
      <div class="choices"></div>
      <div class="feedback hidden"></div>
      <div class="smallrow" style="margin-top:.8rem"><button class="btn btn--ghost btnNext" type="button">➡️ Next</button></div>`;
    const choicesHost = $('.choices', host);
    const fb = $('.feedback', host);
    options.forEach(opt => {
      const b = document.createElement('button');
      b.type='button'; b.className='choice'; b.textContent=opt.text;
      b.addEventListener('click', () => {
        fb.className = 'feedback ' + (opt.correct ? 'ok' : 'no');
        fb.classList.remove('hidden');
        fb.innerHTML = opt.correct ? '✅ Correct!' : `❌ Not quite. Hint: ${item.h}`;
        if(opt.correct) award('mcq:'+mcqIndex);
      });
      choicesHost.appendChild(b);
    });
    $('.btnNext', host).addEventListener('click', ()=>{ mcqIndex++; renderMcq(); });
  }

  let fillIndex = 0;
  function renderFill(){
    const item = fills[fillIndex % fills.length];
    const host = $('#fillHost');
    const options = shuffle(item.opts.map((t,i)=>({text:t,correct:i===item.a})));
    host.innerHTML = `
      <div class="exercise-title">Fill in the blank</div>
      <div class="exercise-sub">Choose the missing word.</div>
      <div class="prompt-box"><strong>${item.s}</strong><br><span class="muted fr">${item.fr}</span></div>
      <div class="choices"></div>
      <div class="feedback hidden"></div>
      <div class="smallrow" style="margin-top:.8rem"><button class="btn btn--ghost btnNext" type="button">➡️ Next</button></div>`;
    const choicesHost = $('.choices', host);
    const fb = $('.feedback', host);
    options.forEach(opt => {
      const b = document.createElement('button');
      b.type='button'; b.className='choice'; b.textContent=opt.text;
      b.addEventListener('click', () => {
        fb.className = 'feedback ' + (opt.correct ? 'ok' : 'no');
        fb.classList.remove('hidden');
        fb.textContent = opt.correct ? '✅ Excellent!' : '❌ Try again. Think about the travel situation.';
        if(opt.correct) award('fill:'+fillIndex);
      });
      choicesHost.appendChild(b);
    });
    $('.btnNext', host).addEventListener('click', ()=>{ fillIndex++; renderFill(); });
  }

  function renderSort(){
    const host = $('#sortHost');
    host.innerHTML = `
      <div class="exercise-title">Airport or plane?</div>
      <div class="exercise-sub">Tap a chip, then choose the correct category.</div>
      <div class="chips source"></div>
      <div class="sort-grid">
        <div class="sort-col"><h4>Airport ✈️</h4><div class="chips airport"></div></div>
        <div class="sort-col"><h4>Plane 🛫</h4><div class="chips plane"></div></div>
      </div>
      <div class="feedback hidden"></div>`;
    const source = $('.source', host);
    const airportBox = $('.airport', host);
    const planeBox = $('.plane', host);
    const fb = $('.feedback', host);
    let selected = null;
    shuffle(vocab.slice(0,8)).forEach(v => {
      const chip = document.createElement('button');
      chip.type='button'; chip.className='chip'; chip.textContent=v.word; chip.dataset.cat=v.cat; chip.dataset.id=v.id;
      chip.addEventListener('click', () => { $$('.chip', host).forEach(c=>c.classList.remove('selected')); chip.classList.add('selected'); selected = chip; });
      source.appendChild(chip);
    });
    function place(targetCat, targetBox){
      if(!selected) return;
      const ok = selected.dataset.cat === targetCat;
      fb.className = 'feedback ' + (ok ? 'ok' : 'no');
      fb.classList.remove('hidden');
      fb.textContent = ok ? '✅ Correct category!' : '❌ Not this category.';
      if(ok){ targetBox.appendChild(selected); award('sort:'+selected.dataset.id); selected.classList.remove('selected'); selected = null; }
    }
    const airportBtn = document.createElement('button');
    airportBtn.type='button'; airportBtn.className='btn'; airportBtn.textContent='Put in Airport';
    airportBtn.addEventListener('click', ()=>place('airport', airportBox));
    const planeBtn = document.createElement('button');
    planeBtn.type='button'; planeBtn.className='btn btn--ghost'; planeBtn.textContent='Put in Plane';
    planeBtn.addEventListener('click', ()=>place('plane', planeBox));
    host.insertBefore(Object.assign(document.createElement('div'), {className:'smallrow'}), $('.sort-grid', host));
    $('.smallrow', host).append(airportBtn, planeBtn);
  }

  let builderIndex = 0;
  function renderBuilder(){
    const item = builders[builderIndex % builders.length];
    const host = $('#builderHost');
    const tokens = shuffle(item.tokens);
    host.innerHTML = `
      <div class="exercise-title">Tap the words in order</div>
      <div class="exercise-sub">Build a correct sentence with airport or plane vocabulary.</div>
      <div class="builder-bank"></div>
      <div class="builder-output" id="builderOutput"></div>
      <div class="smallrow" style="margin-top:.8rem">
        <button class="btn" id="btnCheckBuilder" type="button">✅ Check</button>
        <button class="btn btn--ghost" id="btnClearBuilder" type="button">🧹 Clear</button>
        <button class="btn btn--ghost" id="btnNextBuilder" type="button">➡️ Next</button>
      </div>
      <div class="feedback hidden"></div>`;
    const bank = $('.builder-bank', host);
    const output = $('#builderOutput', host);
    const fb = $('.feedback', host);
    tokens.forEach(t => {
      const b = document.createElement('button');
      b.type='button'; b.className='token'; b.textContent=t;
      b.addEventListener('click', ()=>{
        if(b.classList.contains('used')) return;
        output.textContent = (output.textContent + ' ' + t).trim().replace(/\s+([.,!?])/g,'$1');
        b.classList.add('used');
      });
      bank.appendChild(b);
    });
    $('#btnCheckBuilder', host).addEventListener('click', ()=>{
      const ok = output.textContent.trim() === item.target;
      fb.className = 'feedback ' + (ok ? 'ok' : 'no');
      fb.classList.remove('hidden');
      fb.textContent = ok ? '✅ Perfect sentence!' : `❌ Not yet. Model: ${item.target}`;
      if(ok) award('builder:'+builderIndex);
    });
    $('#btnClearBuilder', host).addEventListener('click', ()=>{ output.textContent=''; $$('.token', host).forEach(t=>t.classList.remove('used')); fb.classList.add('hidden'); });
    $('#btnNextBuilder', host).addEventListener('click', ()=>{ builderIndex++; renderBuilder(); });
  }

  function renderScenarios(){
    const select = $('#scenarioSelect');
    select.innerHTML = '';
    scenarios.forEach((s,i)=>{
      const o = document.createElement('option');
      o.value = i; o.textContent = s.title; select.appendChild(o);
    });
    function show(index){
      const s = scenarios[index];
      $('#scenarioTitle').textContent = s.title;
      $('#scenarioPrompt').textContent = s.prompt;
      $('#scenarioPromptFr').textContent = s.fr;
      $('#modelText').textContent = s.model;
      $('#modelTextFr').textContent = s.modelFr;
      $('#modelBox').classList.add('hidden');
    }
    show(0);
    select.addEventListener('change', e => show(Number(e.target.value)));
    $('#btnScenarioPlay').addEventListener('click', ()=> Speech.say($('#scenarioPrompt').textContent));
    $('#btnShowModel').addEventListener('click', ()=> { $('#modelBox').classList.toggle('hidden'); award('scenario:'+select.value); });
    $('#btnPlayModel').addEventListener('click', ()=> Speech.say($('#modelText').textContent));
  }

  function bindGlobal(){
    $('#voiceUS').addEventListener('click', ()=>{ Speech.mode='en-US'; $('#voiceUS').classList.add('is-on'); $('#voiceUK').classList.remove('is-on'); });
    $('#voiceUK').addEventListener('click', ()=>{ Speech.mode='en-GB'; $('#voiceUK').classList.add('is-on'); $('#voiceUS').classList.remove('is-on'); });
    $('#btnStopAudio').addEventListener('click', ()=> Speech.stop());
    $('#btnReset').addEventListener('click', ()=> location.reload());
    $('#btnSpeakGoals').addEventListener('click', ()=> Speech.say('Today you will learn airport vocabulary and plane vocabulary. Then you will practise with fun exercises and mini scenarios.'));
    $$('[data-filter]').forEach(btn => btn.addEventListener('click', ()=> renderCards(btn.dataset.filter)));
  }

  bindGlobal();
  renderCards();
  renderMcq();
  renderFill();
  renderSort();
  renderBuilder();
  renderScenarios();
  updateScore();
})();
