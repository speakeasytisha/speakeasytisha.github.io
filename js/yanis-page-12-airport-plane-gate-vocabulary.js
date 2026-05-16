(()=>{
  const $=(s,e=document)=>e.querySelector(s);
  const $$=(s,e=document)=>Array.from(e.querySelectorAll(s));

  const vocab=[
    {word:'terminal', tr:'le terminal', def:'the main building at the airport', ex:'I wait in the terminal before my flight.', icon:'🏢', cat:'airport'},
    {word:'check-in desk', tr:'le comptoir d’enregistrement', def:'the place where you register for your flight', ex:'Please go to the check-in desk first.', icon:'🧾', cat:'airport'},
    {word:'security', tr:'le contrôle de sécurité', def:'the place where bags and passengers are checked', ex:'We go through security before we go to the gate.', icon:'🛂', cat:'airport'},
    {word:'passport', tr:'le passeport', def:'an official document used for international travel', ex:'Please show your passport at the airport.', icon:'📘', cat:'airport'},
    {word:'gate', tr:'la porte d’embarquement', def:'the place where passengers wait before boarding', ex:'Our gate is gate 14 today.', icon:'🚪', cat:'gate'},
    {word:'boarding pass', tr:'la carte d’embarquement', def:'the document that shows your seat and gate', ex:'May I see your boarding pass, please?', icon:'🎫', cat:'gate'},
    {word:'boarding announcement', tr:'l’annonce d’embarquement', def:'the message that tells passengers to board', ex:'Listen carefully to the boarding announcement.', icon:'📣', cat:'gate'},
    {word:'queue', tr:'la file d’attente', def:'a line of people waiting', ex:'There is a long queue at the gate.', icon:'👥', cat:'gate'},
    {word:'aisle', tr:'l’allée', def:'the space between the seats on the plane', ex:'My seat is next to the aisle.', icon:'🛫', cat:'plane'},
    {word:'window seat', tr:'la place côté hublot', def:'a seat next to the window', ex:'I would like a window seat, please.', icon:'🪟', cat:'plane'},
    {word:'overhead bin', tr:'le compartiment à bagages', def:'the space above the seats for bags', ex:'Please put your bag in the overhead bin.', icon:'🧳', cat:'plane'},
    {word:'seat belt', tr:'la ceinture de sécurité', def:'the belt you fasten in your seat', ex:'Please fasten your seat belt now.', icon:'🔒', cat:'plane'},
    {word:'tray table', tr:'la tablette', def:'the small table attached to your seat', ex:'Please put your tray table up for take-off.', icon:'🪑', cat:'plane'},
    {word:'cabin crew', tr:'l’équipage de cabine', def:'the people who help passengers on the plane', ex:'The cabin crew are here to help you.', icon:'👨‍✈️', cat:'plane'}
  ];

  const mcqs=[
    {q:'Which word means the place where you wait before boarding?', choices:['gate','aisle','passport'], a:'gate'},
    {q:'Which word means the place where you register for your flight?', choices:['overhead bin','check-in desk','window seat'], a:'check-in desk'},
    {q:'Which word means the document for international travel?', choices:['passport','tray table','queue'], a:'passport'},
    {q:'Which word means the space above the seats for bags?', choices:['seat belt','terminal','overhead bin'], a:'overhead bin'}
  ];

  const fills=[
    {s:'Please show your ______ before you go through security.', a:'passport'},
    {s:'Your ______ tells you the seat number and the gate.', a:'boarding pass'},
    {s:'Please fasten your ______ before take-off.', a:'seat belt'},
    {s:'There is a long ______ at the gate.', a:'queue'},
    {s:'Please put your bag in the ______.', a:'overhead bin'}
  ];

  const sortWords=[
    {w:'terminal',cat:'airport'},{w:'security',cat:'airport'},{w:'check-in desk',cat:'airport'},
    {w:'gate',cat:'gate'},{w:'boarding pass',cat:'gate'},{w:'boarding announcement',cat:'gate'},
    {w:'aisle',cat:'plane'},{w:'seat belt',cat:'plane'},{w:'tray table',cat:'plane'}
  ];

  const builders=[
    {target:'Please show your boarding pass.', tokens:['Please','show','your','boarding','pass.']},
    {target:'The gate is next to the café.', tokens:['The','gate','is','next','to','the','café.']},
    {target:'Please fasten your seat belt now.', tokens:['Please','fasten','your','seat','belt','now.']}
  ];

  const scenarios=[
    {
      title:'Scenario 1 — At the check-in desk',
      fr:'Scénario 1 — Au comptoir d’enregistrement',
      teacher:'Good morning. May I see your passport, please?',
      model:'Good morning. Yes, of course. Here is my passport.',
      extra:'You can also say: Here is my passport and my reservation.'
    },
    {
      title:'Scenario 2 — At the gate',
      fr:'Scénario 2 — À la porte d’embarquement',
      teacher:'Excuse me, where is gate 14?',
      model:'Gate 14 is on the left, next to the café.',
      extra:'You can also say: Please follow the signs to gate 14.'
    },
    {
      title:'Scenario 3 — On the plane',
      fr:'Scénario 3 — Dans l’avion',
      teacher:'Can I put my bag here?',
      model:'Yes, please put your bag in the overhead bin.',
      extra:'You can also say: Please fasten your seat belt and take your seat.'
    }
  ];

  const goalsText='Today you will learn airport, gate, and plane vocabulary. You will hear the words, practise them, and use them in mini scenarios.';
  const frameText='First, I go to the terminal. Then, I go to the check-in desk. After that, I go through security. Next, I wait at the gate. Finally, I board the plane and fasten my seat belt.';

  const speech={mode:'en-US',getVoices(){return window.speechSynthesis?.getVoices?.()||[];},pick(){const m=this.mode.toLowerCase();const v=this.getVoices();return v.find(x=>(x.lang||'').toLowerCase()===m)||v.find(x=>(x.lang||'').toLowerCase().startsWith(m))||v.find(x=>(x.lang||'').toLowerCase().startsWith('en'))||null;},say(t){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t||''));u.lang=this.mode;u.rate=.96;u.pitch=1;const voice=this.pick();if(voice)u.voice=voice;window.speechSynthesis.speak(u);},stop(){window.speechSynthesis?.cancel();}};
  if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=()=>speech.getVoices();}

  const score={now:0,max:mcqs.length+fills.length+sortWords.length+builders.length, awarded:new Set(), add(k,p=1){if(this.awarded.has(k))return; this.awarded.add(k); this.now+=p; updateScore();}, reset(){this.now=0;this.awarded.clear(); updateScore();}};
  function updateScore(){ $('#scoreNow').textContent=score.now; $('#scoreMax').textContent=score.max; const pct=Math.min(100,Math.round((score.now/score.max)*100)); $('#progressBar').style.width=pct+'%'; }

  function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

  function renderCards(filter='all'){
    const host=$('#cardGrid'); host.innerHTML='';
    vocab.filter(v=>filter==='all'||v.cat===filter).forEach(v=>{
      const card=document.createElement('article');
      card.className='vocab-card';
      card.innerHTML=`
        <div class="vocab-card__inner">
          <div class="vocab-face front">
            <div class="vocab-top">
              <div class="vocab-icon">${v.icon}</div>
              <div class="vocab-cat">${v.cat}</div>
            </div>
            <div class="vocab-word">${v.word}</div>
            <div class="vocab-tr">${v.tr}</div>
            <div class="card-tools">
              <button class="iconbtn speak" type="button">🔊 Listen</button>
              <button class="iconbtn flip" type="button">🔁 Flip</button>
            </div>
          </div>
          <div class="vocab-face back">
            <div class="vocab-word">${v.word}</div>
            <div class="vocab-def">${v.def}</div>
            <div class="vocab-ex"><strong>Example:</strong> ${v.ex}</div>
            <div class="card-tools">
              <button class="iconbtn speak" type="button">🔊 Listen</button>
              <button class="iconbtn flip" type="button">🔁 Flip back</button>
            </div>
          </div>
        </div>`;
      card.addEventListener('click',e=>{if(e.target.closest('button'))return; card.classList.toggle('is-flipped');});
      $$('.flip',card).forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); card.classList.toggle('is-flipped');}));
      $$('.speak',card).forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); speech.say(`${v.word}. ${v.ex}`);}));
      host.appendChild(card);
    });
  }

  function renderMCQ(){
    const host=$('#mcqHost'); host.innerHTML='';
    mcqs.forEach((item,i)=>{
      const box=document.createElement('div');
      const choices=shuffle(item.choices);
      box.innerHTML=`<h3>Question ${i+1}</h3><p>${item.q}</p>`;
      choices.forEach(c=>{
        const row=document.createElement('button');
        row.type='button'; row.className='option'; row.innerHTML=`<span>👉</span><span>${c}</span>`;
        row.addEventListener('click',()=>{
          const fb=box.querySelector('.feedback')||document.createElement('div');
          fb.className='feedback ' + (c===item.a?'ok':'no');
          fb.innerHTML = c===item.a ? '✅ Correct!' : `❌ Not quite. Correct answer: <strong>${item.a}</strong>`;
          if(!fb.parentNode) box.appendChild(fb);
          score.add('mcq'+i);
        });
        box.appendChild(row);
      });
      host.appendChild(box);
    });
  }

  function renderFill(){
    const host=$('#fillHost'); host.innerHTML='';
    fills.forEach((item,i)=>{
      const box=document.createElement('div');
      box.className='topgap';
      box.innerHTML=`<p><strong>${i+1}.</strong> ${item.s.replace('______','<input class="fillInput" type="text" placeholder="Write the word">')}</p><button class="btn btn--ghost checkFill" type="button">Check</button><div class="feedback hidden"></div>`;
      const input=box.querySelector('.fillInput'); const fb=box.querySelector('.feedback');
      box.querySelector('.checkFill').addEventListener('click',()=>{
        const ok=input.value.trim().toLowerCase()===item.a.toLowerCase();
        fb.className='feedback '+(ok?'ok':'no');
        fb.classList.remove('hidden');
        fb.innerHTML = ok ? '✅ Correct!' : `❌ Correct answer: <strong>${item.a}</strong>`;
        if(ok) score.add('fill'+i);
      });
      host.appendChild(box);
    });
  }

  function renderSort(){
    const host=$('#sortHost'); host.innerHTML='';
    const bank=document.createElement('div'); bank.className='bank';
    const grid=document.createElement('div'); grid.className='sort-grid';
    const cols=['airport','gate','plane'].map(cat=>{const col=document.createElement('div'); col.className='sort-col'; col.dataset.cat=cat; col.innerHTML=`<h3>${cat[0].toUpperCase()+cat.slice(1)}</h3>`; grid.appendChild(col); return col;});
    shuffle(sortWords).forEach((item,i)=>{
      const token=document.createElement('button'); token.type='button'; token.className='token'; token.textContent=item.w;
      token.addEventListener('click',()=>{
        const next=prompt(`Where does "${item.w}" go? Type: airport, gate, or plane`,'');
        if(!next) return;
        const answer=next.trim().toLowerCase();
        if(answer===item.cat){
          const col=cols.find(c=>c.dataset.cat===item.cat); col.appendChild(token); token.classList.add('used'); score.add('sort'+i);
        } else {
          alert('Not quite. Try again.');
        }
      });
      bank.appendChild(token);
    });
    const p=document.createElement('p'); p.className='muted'; p.textContent='Tap a word, type the category, then place it.';
    host.appendChild(p); host.appendChild(bank); host.appendChild(grid);
  }

  function renderBuilder(){
    let idx=0;
    const host=$('#builderHost');
    function draw(){
      const task=builders[idx];
      const shuffled=shuffle(task.tokens);
      host.innerHTML=`<p><strong>Task ${idx+1}:</strong> Build the sentence.</p><div class="builder-wrap"><div class="builder-bank"></div><div class="builder-zone"></div></div><div class="smallrow topgap"><button class="btn" id="checkBuild" type="button">✅ Check</button><button class="btn btn--ghost" id="resetBuild" type="button">↺ Reset task</button></div><div class="feedback hidden" id="buildFb"></div>`;
      const bank=$('.builder-bank',host), zone=$('.builder-zone',host), fb=$('#buildFb',host);
      shuffled.forEach(tok=>{
        const btn=document.createElement('button'); btn.type='button'; btn.className='token'; btn.textContent=tok;
        btn.addEventListener('click',()=>{ if(btn.classList.contains('used')) return; const clone=btn.cloneNode(true); clone.classList.remove('used'); clone.addEventListener('click',()=>{clone.remove(); btn.classList.remove('used');}); zone.appendChild(clone); btn.classList.add('used'); });
        bank.appendChild(btn);
      });
      $('#checkBuild',host).addEventListener('click',()=>{
        const built=$$('.token',zone).map(t=>t.textContent).join(' ').replace(/\s+([.,!?])/g,'$1').trim();
        const ok=built===task.target;
        fb.className='feedback '+(ok?'ok':'no'); fb.classList.remove('hidden');
        fb.innerHTML= ok ? `✅ Correct! <strong>${task.target}</strong>` : `❌ Correct sentence: <strong>${task.target}</strong>`;
        if(ok) score.add('build'+idx);
      });
      $('#resetBuild',host).addEventListener('click',draw);
    }
    draw();
  }

  function renderScenarios(){
    const host=$('#scenarioHost'); host.innerHTML='';
    scenarios.forEach((s,i)=>{
      const card=document.createElement('div'); card.className='card scenario-card';
      card.innerHTML=`<h3>${s.title}</h3><p class="muted fr">${s.fr}</p><div class="scenario-line teacher"><strong>Prompt:</strong> ${s.teacher}</div><div class="smallrow"><button class="iconbtn listenPrompt" type="button">🔊 Prompt</button><button class="iconbtn showModel" type="button">👀 Show model</button></div><div class="scenario-line model hidden"><strong>Model answer:</strong> ${s.model}<br><span class="small">${s.extra}</span></div><div class="smallrow"><button class="iconbtn listenModel hidden" type="button">🔊 Model</button></div>`;
      $('.listenPrompt',card).addEventListener('click',()=>speech.say(s.teacher));
      $('.showModel',card).addEventListener('click',()=>{ $('.model',card).classList.remove('hidden'); $('.listenModel',card).classList.remove('hidden'); score.add('scenario'+i);});
      $('.listenModel',card).addEventListener('click',()=>speech.say(s.model));
      host.appendChild(card);
    });
  }

  function checkFinal(){
    const text=$('#finalText').value.trim().toLowerCase();
    const list=$('#finalChecklist'); list.innerHTML='';
    const checks=[
      {label:'You used a place word (terminal / gate / plane).', ok:/terminal|gate|plane/.test(text)},
      {label:'You used a procedure word (check-in desk / security / boarding pass).', ok:/check-in desk|security|boarding pass/.test(text)},
      {label:'You used a plane word (seat belt / overhead bin / aisle).', ok:/seat belt|overhead bin|aisle/.test(text)},
      {label:'You used a sequence word (first / then / finally).', ok:/first|then|finally|after that|next/.test(text)}
    ];
    checks.forEach(c=>{
      const div=document.createElement('div'); div.className='checkitem '+(c.ok?'ok':''); div.textContent=(c.ok?'✅ ':'⬜ ')+c.label; list.appendChild(div);
    });
  }

  function bindFilters(){
    $$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
      $$('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.filter);
    }));
  }

  function resetAll(){
    speech.stop();
    score.reset();
    renderCards(); renderMCQ(); renderFill(); renderSort(); renderBuilder(); renderScenarios();
    $$('.filter-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
    $('#finalText').value=''; $('#finalChecklist').innerHTML='';
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function init(){
    updateScore(); renderCards(); bindFilters(); renderMCQ(); renderFill(); renderSort(); renderBuilder(); renderScenarios();
    $('#btnSpeakGoals').addEventListener('click',()=>speech.say(goalsText));
    $('#btnSpeakFrame').addEventListener('click',()=>speech.say(frameText));
    $('#btnStopAudio').addEventListener('click',()=>speech.stop());
    $('#btnReset').addEventListener('click',resetAll);
    $('#btnCheckFinal').addEventListener('click',checkFinal);
    $('#voiceUS').addEventListener('click',()=>{speech.mode='en-US'; $('#voiceUS').classList.add('is-on'); $('#voiceUK').classList.remove('is-on');});
    $('#voiceUK').addEventListener('click',()=>{speech.mode='en-GB'; $('#voiceUK').classList.add('is-on'); $('#voiceUS').classList.remove('is-on');});
  }
  init();
})();
