(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
  const status = $('#jsStatus');
  const scoreNow = $('#scoreNow');
  const scoreMax = $('#scoreMax');
  const progressBar = $('#progressBar');
  let score = 0;
  let maxScore = 29;
  scoreMax.textContent = String(maxScore);

  const Speech = {
    mode: 'en-US',
    getVoices(){ try { return speechSynthesis.getVoices() || []; } catch(e){ return []; } },
    pick(){
      const v = this.getVoices();
      return v.find(x => (x.lang||'').toLowerCase() === this.mode.toLowerCase()) ||
             v.find(x => (x.lang||'').toLowerCase().startsWith(this.mode.toLowerCase().slice(0,2))) ||
             null;
    },
    say(txt){
      try { speechSynthesis.cancel(); } catch(e){}
      const u = new SpeechSynthesisUtterance(String(txt||''));
      const voice = this.pick(); if(voice) u.voice = voice;
      u.lang = this.mode; u.rate = 0.96;
      speechSynthesis.speak(u);
    },
    pause(){ try{ speechSynthesis.pause(); }catch(e){} },
    resume(){ try{ speechSynthesis.resume(); }catch(e){} },
    stop(){ try{ speechSynthesis.cancel(); }catch(e){} }
  };
  if(window.speechSynthesis) speechSynthesis.onvoiceschanged = () => Speech.getVoices();

  function setVoice(mode){
    Speech.mode = mode;
    $('#voiceUS').classList.toggle('is-on', mode==='en-US');
    $('#voiceUK').classList.toggle('is-on', mode==='en-GB');
  }
  function award(key){
    if(document.body.dataset[key]) return;
    document.body.dataset[key] = '1';
    score += 1;
    scoreNow.textContent = String(score);
    progressBar.style.width = `${Math.round(score/maxScore*100)}%`;
  }
  function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  const vocab = {
    drinks:[
      {w:'water', fr:'de l’eau', def:'a drink with no sugar or milk', ex:'Would you like some water?', emo:'💧'},
      {w:'tea', fr:'du thé', def:'a hot drink made with tea leaves', ex:'Can I offer you some tea?', emo:'🍵'},
      {w:'coffee', fr:'du café', def:'a hot drink made from coffee beans', ex:'Would you like coffee or tea?', emo:'☕'},
      {w:'juice', fr:'du jus', def:'a drink made from fruit', ex:'The child would like some juice.', emo:'🧃'}
    ],
    meals:[
      {w:'meal', fr:'un repas', def:'food served to a passenger', ex:'Your meal will be served soon.', emo:'🍽️'},
      {w:'snack', fr:'un en-cas', def:'a small thing to eat', ex:'Would you like a snack?', emo:'🥨'},
      {w:'special meal', fr:'un repas spécial', def:'a meal requested for special dietary needs', ex:'Let me check whether your special meal is confirmed.', emo:'🥗'},
      {w:'vegetarian', fr:'végétarien', def:'without meat or fish', ex:'She would like a vegetarian meal.', emo:'🥦'}
    ],
    comfort:[
      {w:'blanket', fr:'une couverture', def:'something warm to cover yourself', ex:'Do you need a blanket?', emo:'🧣'},
      {w:'pillow', fr:'un oreiller', def:'something soft for your head', ex:'Here is your pillow.', emo:'🛏️'},
      {w:'headphones', fr:'un casque / des écouteurs', def:'something you wear to listen to sound', ex:'Here are your headphones.', emo:'🎧'},
      {w:'seatbelt', fr:'la ceinture de sécurité', def:'the belt you must fasten in your seat', ex:'Please fasten your seatbelt.', emo:'🔒'}
    ],
    service:[
      {w:'tray', fr:'un plateau', def:'a flat object for serving food and drinks', ex:'Please put your tray on the table.', emo:'🍱'},
      {w:'assistance', fr:'de l’aide / de l’assistance', def:'help for a passenger', ex:'Do you need special assistance?', emo:'🆘'},
      {w:'service cart', fr:'le chariot de service', def:'the cart used to serve food and drinks', ex:'The service cart is coming down the aisle.', emo:'🛒'},
      {w:'aisle', fr:'l’allée', def:'the space between the seats', ex:'Please keep the aisle clear.', emo:'↕️'}
    ]
  };

  const scenarios = {
    water_blanket: {
      title:'Water + blanket',
      text:'Hello. Excuse me. I would like some water, and I also need a blanket because I feel cold.',
      facts:['The passenger would like water.','The passenger needs a blanket.','The passenger feels cold.'],
      model:'Of course. Here is some water, and I will bring you a blanket right away.',
      stronger:'Of course. Here is some water. I will also bring you a blanket right away because you feel cold. Please let me know if you need anything else.'
    },
    child_juice: {
      title:'Child + juice',
      text:'Good afternoon. My daughter is thirsty. Could she have some juice, please?',
      facts:['The passenger is travelling with a child.','The child is thirsty.','The child would like some juice.'],
      model:'Of course. I can bring some juice for your daughter right away.',
      stronger:'Of course. I can bring some juice for your daughter right away. Please tell me if she needs anything else.'
    },
    special_meal: {
      title:'Special meal check',
      text:'Hello. I would like to check whether my special meal is confirmed.',
      facts:['The passenger has a question about a special meal.','You need to check the information.','A calm professional response is needed.'],
      model:'Of course. Let me check whether your special meal is confirmed.',
      stronger:'Of course. Let me check whether your special meal is confirmed. I will come back with the information in a moment.'
    },
    seatbelt: {
      title:'Seatbelt reminder',
      text:'Excuse me. Do I need to fasten my seatbelt now?',
      facts:['The passenger is asking about safety.','The topic is the seatbelt.','You need to answer clearly and politely.'],
      model:'Yes, please. You need to fasten your seatbelt now.',
      stronger:'Yes, please. You need to fasten your seatbelt now because we are preparing for take-off.'
    }
  };

  const mcq1 = [
    {q:'A passenger looks thirsty. What is the best professional question?', a:'Would you like some water?', choices:['Would you like some water?','You want water?','Water now?']},
    {q:'A passenger feels cold. What is the best question?', a:'Do you need a blanket?', choices:['Do you need a blanket?','You need blanket?','Need blanket now?']},
    {q:'A child is with her mother. What is the best offer?', a:'Can I offer your child some juice?', choices:['Can I offer your child some juice?','I offer your child juice?','Would like your child juice?']}
  ];
  const mcq2 = [
    {q:'Passenger: “I would like some tea.” Best response?', a:'Of course. Here is some tea.', choices:['Of course. Here is some tea.','Tea, yes.','You like tea.']},
    {q:'Passenger: “I need help with this bag.” Best response?', a:'Yes, I can help you with your bag.', choices:['Yes, I can help you with your bag.','Bag help yes.','I help bag.']},
    {q:'Passenger: “Could I have a pillow?” Best response?', a:'Of course. I will bring you a pillow.', choices:['Of course. I will bring you a pillow.','Bring pillow.','You need pillow?']}
  ];
  const fill1 = [
    {s:'Would you like ___ water?', options:['some','a','to'] , answer:'some'},
    {s:'Do you need ___ blanket?', options:['a','some','to'] , answer:'a'},
    {s:'Here ___ your headphones.', options:['are','is','am'] , answer:'are'},
    {s:'Can I offer you something ___ drink?', options:['to','for','at'] , answer:'to'}
  ];
  const builderTask = { target:'Would you like some water or tea?', tokens:['Would','you','like','some','water','or','tea?'], hint:'Start with Would you like …' };

  const quantifierMcq = [
    {q:'Would you like ___ water?', a:'some', choices:['some','many','few']},
    {q:'Do you have ___ bags to check in?', a:'any', choices:['any','much','little']},
    {q:'How ___ blankets do you need?', a:'many', choices:['many','much','little']},
    {q:'How ___ juice would you like?', a:'much', choices:['much','many','few']},
    {q:'There are ___ empty seats today.', a:'a few', choices:['a few','a little','much']},
    {q:'There is ___ coffee left in the pot.', a:'a little', choices:['a little','a few','many']}
  ];
  const countableItems = [
    {q:'bags', a:'countable'},
    {q:'blankets', a:'countable'},
    {q:'water', a:'uncountable'},
    {q:'juice', a:'uncountable'},
    {q:'headphones', a:'countable'},
    {q:'assistance', a:'uncountable'},
    {q:'meals', a:'countable'},
    {q:'coffee', a:'uncountable'}
  ];

  function renderVocab(){
    const tabs = $('#catTabs'), grid = $('#vocabGrid');
    const cats = [
      ['drinks','🥤 Drinks'], ['meals','🍽️ Meals'], ['comfort','🛏️ Comfort'], ['service','🛫 Service']
    ];
    let current='drinks';
    function drawTabs(){
      tabs.innerHTML='';
      cats.forEach(([k, label]) => {
        const b=document.createElement('button'); b.type='button'; b.className='catBtn'+(current===k?' is-on':''); b.textContent=label;
        b.addEventListener('click',()=>{ current=k; drawTabs(); drawGrid(); }); tabs.appendChild(b);
      });
    }
    function drawGrid(){
      grid.innerHTML='';
      vocab[current].forEach((item, idx) => {
        const card=document.createElement('div'); card.className='vCard';
        card.innerHTML=`<div class="vTop"><div><div class="vWord">${item.emo} ${item.w}</div><div class="vFr">${item.fr}</div></div><button class="btn btn--ghost speakV" type="button" data-text="${item.w}. ${item.ex}">🔊</button></div><div class="vDef">${item.def}</div><div class="vEx">Example: ${item.ex}</div>`;
        grid.appendChild(card);
      });
      $$('.speakV', grid).forEach((b,i)=> b.addEventListener('click',()=> Speech.say(b.dataset.text)));
    }
    drawTabs(); drawGrid();
  }

  function renderMcq(hostId, items, prefix){
    const host = $('#'+hostId); host.innerHTML='';
    items.forEach((it, idx) => {
      const q=document.createElement('div'); q.className='q';
      q.innerHTML=`<div class="qTitle">${idx+1}. ${it.q}</div><div class="rowChoices"></div><div class="fb hidden"></div>`;
      const choices = $('.rowChoices', q); const fb = $('.fb', q);
      shuffle(it.choices).forEach(ch => {
        const b=document.createElement('button'); b.type='button'; b.className='choiceBtn'; b.textContent=ch;
        b.addEventListener('click',()=>{
          const ok= ch===it.a; fb.className='fb '+(ok?'ok':'no'); fb.classList.remove('hidden');
          fb.textContent = ok ? '✅ Correct!' : `❌ Better: ${it.a}`;
          if(ok) award(prefix+idx);
        });
        choices.appendChild(b);
      });
      host.appendChild(q);
    });
  }

  function renderFill(){
    const host = $('#fill1'); host.innerHTML='';
    fill1.forEach((it, idx) => {
      const row=document.createElement('div'); row.className='fillLine';
      row.innerHTML=`<div>${idx+1}. ${it.s}</div><select><option value="">Choose…</option>${shuffle(it.options).map(o=>`<option>${o}</option>`).join('')}</select><button class="btn btn--ghost" type="button">Check</button><div class="fb hidden"></div>`;
      const sel=$('select', row), btn=$('button', row), fb=$('.fb', row);
      btn.addEventListener('click',()=>{
        const ok=sel.value===it.answer; fb.className='fb '+(ok?'ok':'no'); fb.classList.remove('hidden');
        fb.textContent = ok ? '✅ Correct!' : `❌ Correct answer: ${it.answer}`;
        if(ok) award('fill'+idx);
      });
      host.appendChild(row);
    });
  }

  
function renderBuilder(){
    const host = $('#builder');
    const fb = $('#builderFb');
    host.innerHTML = '';
    fb.className = 'fb hidden';
    const wrap = document.createElement('div');
    wrap.className = 'builderWrap';
    wrap.innerHTML = `<div class="builderPrompt">Target structure: <strong>${builderTask.hint || ''}</strong></div>
      <div class="builderBank" id="builderBank"></div>
      <div class="builderDrop" id="builderDrop"></div>
      <div class="row gap" style="margin-top:.7rem">
        <button id="builderCheck" class="btn btn--ghost" type="button">Check</button>
        <button id="builderReset" class="btn btn--ghost" type="button">Reset</button>
        <button id="builderHint" class="btn btn--ghost" type="button">Hint</button>
      </div>`;
    host.appendChild(wrap);
    const bank = $('#builderBank');
    const drop = $('#builderDrop');
    shuffle(builderTask.tokens).forEach(tok=>{
      const b=document.createElement('button');
      b.type='button'; b.className='tokenBtn'; b.textContent=tok;
      b.addEventListener('click', ()=>{
        const chip=document.createElement('button');
        chip.type='button'; chip.className='tokenBtn tokenBtn--drop'; chip.textContent=tok;
        chip.addEventListener('click', ()=> chip.remove());
        drop.appendChild(chip);
        b.disabled=true;
      });
      bank.appendChild(b);
    });
    $('#builderHint').addEventListener('click', ()=>{
      fb.className='fb';
      fb.textContent='Hint: start with “Would you like …”';
    });
    $('#builderReset').addEventListener('click', ()=>{
      renderBuilder();
    });
    $('#builderCheck').addEventListener('click', ()=>{
      const built = Array.from(drop.querySelectorAll('.tokenBtn')).map(x=>x.textContent).join(' ').replace(/\s+([?.!,])/g,'$1').trim();
      const ok = normalize(built)===normalize(builderTask.target);
      fb.className='fb ' + (ok ? 'good' : 'bad');
      fb.textContent = ok ? 'Correct!' : `Try again. Model: ${builderTask.target}`;
      if(ok) award('builder');
    });
  }

function renderQuantifierMcq(){
    renderMcq('quantifierMcq', quantifierMcq, 'qm');
  }

  function renderCountable(){
    const host = $('#countableHost'); host.innerHTML='';
    countableItems.forEach((it, idx) => {
      const q=document.createElement('div'); q.className='q';
      q.innerHTML=`<div class="qTitle">${idx+1}. ${it.q}</div><div class="rowChoices"></div><div class="fb hidden"></div>`;
      const choices = $('.rowChoices', q), fb = $('.fb', q);
      shuffle(['countable','uncountable']).forEach(ch => {
        const b=document.createElement('button'); b.type='button'; b.className='choiceBtn'; b.textContent=ch;
        b.addEventListener('click',()=>{
          const ok = ch===it.a; fb.className='fb '+(ok?'ok':'no'); fb.classList.remove('hidden');
          fb.textContent = ok ? '✅ Correct!' : `❌ Better: ${it.a}`;
          if(ok) award('count'+idx);
        });
        choices.appendChild(b);
      });
      host.appendChild(q);
    });
  }

  function renderScenarios(){
    const sel=$('#scenarioSelect'); sel.innerHTML='';
    Object.entries(scenarios).forEach(([k,v])=>{
      const o=document.createElement('option'); o.value=k; o.textContent=v.title; sel.appendChild(o);
    });
    function draw(){
      const sc=scenarios[sel.value];
      $('#scenarioText').textContent=sc.text;
      $('#scenarioFacts').innerHTML = sc.facts.map(f=>`<div class="step">${f}</div>`).join('');
      $('#scenarioModel').textContent='Model answer: ' + sc.model;
      $('#scenarioStronger').textContent='Stronger version: ' + (sc.stronger || sc.model);
      $('#scenarioModel').classList.add('hidden');
      $('#scenarioStronger').classList.add('hidden');
      $('#scenarioResponse').value='';
    }
    sel.addEventListener('change', draw); draw();
    $('#btnSpeakScenario').addEventListener('click',()=> Speech.say($('#scenarioText').textContent));
    $('#btnToggleModel').addEventListener('click',()=> { $('#scenarioModel').classList.toggle('hidden'); $('#scenarioStronger').classList.toggle('hidden'); });
  }

  function bind(){
    $('#btnStart').addEventListener('click',()=> $('#main').scrollIntoView({behavior:'smooth'}));
    $('#btnListenIntro').addEventListener('click',()=> Speech.say('Welcome on board. In this lesson, you will practise on board service and passenger needs.'));
    $('#btnSpeakRoutine').addEventListener('click',()=> Speech.say('Greet the passenger. Offer help. Check the need. Respond professionally.'));
    $('#btnSpeakWould').addEventListener('click',()=> Speech.say('Would you like some water? Would you like a blanket? Would you like to change seats?'));
$('#btnSpeakNeed').addEventListener('click',()=> Speech.say('Can I offer you something to drink? Do you need a blanket? Do you need help with your bag?'));
    $('#btnSpeakQuant').addEventListener('click',()=> Speech.say('some water, any help, many bags, much juice, a few seats, a little coffee'));
    $('#voiceUS').addEventListener('click',()=> setVoice('en-US'));
    $('#voiceUK').addEventListener('click',()=> setVoice('en-GB'));
    $('#btnPause').addEventListener('click',()=> Speech.pause());
    $('#btnResume').addEventListener('click',()=> Speech.resume());
    $('#btnStop').addEventListener('click',()=> Speech.stop());
    $('#btnCheckWriting').addEventListener('click', checkWriting);
    $('#btnSpeakRP').addEventListener('click',()=> Speech.say($('#rpPrompt').textContent));
    $('#btnToggleRPModel').addEventListener('click',()=> $('#rpModel').classList.toggle('hidden'));
    $('#btnResetAll').addEventListener('click',()=> location.reload());
  }

  try {
    setVoice('en-US');
    renderVocab();
    renderMcq('mcq1', mcq1, 'm1');
    renderFill();
    renderMcq('mcq2', mcq2, 'm2');
    renderBuilder();
    renderQuantifierMcq();
    renderCountable();
    renderScenarios();
    bind();
    status.textContent='JS: ✅ loaded';
  } catch(e){
    console.error(e);
    status.textContent='JS: ❌ error';
  }
})();
