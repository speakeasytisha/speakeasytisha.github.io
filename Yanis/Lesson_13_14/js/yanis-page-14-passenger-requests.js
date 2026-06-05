(() => {
  const $=(s,e=document)=>e.querySelector(s); const $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
  const Speech={mode:'en-US',getVoices(){try{return window.speechSynthesis?.getVoices?.()||[]}catch(e){return[]}},pickVoice(){const v=this.getVoices();return v.find(x=>x.lang===this.mode)||v.find(x=>x.lang?.startsWith(this.mode.slice(0,2)))||v.find(x=>x.lang?.startsWith('en'))||null},say(text){if(!window.speechSynthesis||!text)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang=this.mode;u.rate=.96;u.pitch=1;const voice=this.pickVoice();if(voice)u.voice=voice;window.speechSynthesis.speak(u)},pause(){try{speechSynthesis.pause()}catch(e){}},resume(){try{speechSynthesis.resume()}catch(e){}},stop(){try{speechSynthesis.cancel()}catch(e){}}};
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=()=>Speech.getVoices();
  const Score={now:0,max:0,seen:new Set(),setMax(n){this.max=n;renderScore()},award(k,p=1){if(this.seen.has(k))return;this.seen.add(k);this.now+=p;renderScore()},reset(){this.now=0;this.seen.clear();renderScore()}};
  function renderScore(){ $('#scoreNow').textContent=Score.now; $('#scoreMax').textContent=Score.max; $('#progressBar').style.width=(Score.max?Math.round(Score.now/Score.max*100):0)+'%'; }
  function shuffle(a){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x}
  function normalize(s){return String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim()}
  function escapeHtml(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}

  const VOCAB=[
    {cat:'seat',word:'seat',fr:'siège',def:'a place where a passenger sits',ex:'The passenger has a question about her seat.',emoji:'💺'},
    {cat:'seat',word:'window seat',fr:'siège côté fenêtre',def:'a seat next to the window',ex:'She would like a window seat.',emoji:'🪟'},
    {cat:'seat',word:'aisle seat',fr:'siège côté couloir',def:'a seat next to the aisle',ex:'He prefers an aisle seat.',emoji:'🛣️'},
    {cat:'baggage',word:'cabin bag',fr:'bagage cabine',def:'a small bag you take with you into the plane',ex:'You have a question about your cabin bag.',emoji:'🧳'},
    {cat:'baggage',word:'checked bag',fr:'bagage en soute',def:'a bag that goes in the hold of the plane',ex:'Your checked bag is too heavy.',emoji:'🛄'},
    {cat:'travel',word:'boarding pass',fr:'carte d’embarquement',def:'the document that lets you board the plane',ex:'Could I see your boarding pass, please?',emoji:'🎫'},
    {cat:'travel',word:'gate',fr:'porte d’embarquement',def:'the place where passengers board the plane',ex:'Your gate has changed to B12.',emoji:'🚪'},
    {cat:'travel',word:'boarding time',fr:'heure d’embarquement',def:'the time when passengers can start boarding',ex:'The boarding time is 6:15 p.m.',emoji:'⏰'},
    {cat:'travel',word:'connection',fr:'correspondance',def:'the next flight after the first flight',ex:'She is worried about her connection.',emoji:'🔁'},
    {cat:'travel',word:'delay',fr:'retard',def:'extra waiting time because something is late',ex:'There is a delay this evening.',emoji:'⌛'},
    {cat:'service',word:'special meal',fr:'repas spécial',def:'a meal requested for a passenger’s needs',ex:'He wants to check whether his special meal is confirmed.',emoji:'🍽️'},
    {cat:'service',word:'special assistance',fr:'assistance spéciale',def:'extra help for a passenger who needs support',ex:'Do you need special assistance?',emoji:'♿'},
    {cat:'service',word:'travelling alone',fr:'voyager seul',def:'going on the trip without another person',ex:'Are you travelling alone?',emoji:'🧍'},
    {cat:'service',word:'travelling with family',fr:'voyager en famille',def:'going on the trip with family members',ex:'She is travelling with her family.',emoji:'👨‍👩‍👧‍👦'}
  ];

  const GRAMMAR=[
    {
      id:'g1',
      title:'would like to + base verb',
      rule:'Use <strong>would like to + base verb</strong> to make a request or say what a passenger wants in a polite, professional way.',
      why:'This structure is very useful in the LILATE because passengers often explain what they would like to do, know, or change.',
      forms:[
        ['Affirmative','The passenger would like to change his seat.'],
        ['Negative','The passenger would not like to travel alone.'],
        ['Question','Would you like to sit next to your wife?']
      ],
      examples:[
        'I would like to know the boarding time.',
        'She would like to sit next to her husband.',
        'They would like to check the gate number.'
      ],
      good:'The passenger would like to change his seat.',
      bad:'The passenger would like change his seat.',
      mcqPrompt:'Choose the correct sentence.',
      mcqAnswers:['The passenger would like to know the gate number.','The passenger would like know the gate number.','The passenger would like knowing the gate number.'],
      mcqCorrect:'The passenger would like to know the gate number.',
      fillPrompt:'Complete: She would like to ___ more information.',
      fillAnswer:'know',
      model:'She would like to know more information.'
    },
    {
      id:'g2',
      title:'need + noun / need to + base verb',
      rule:'Use <strong>need + noun</strong> for a thing and <strong>need to + base verb</strong> for an action.',
      why:'This helps you describe what the passenger needs and what action is necessary.',
      forms:[
        ['Need + noun','The passenger needs information.'],
        ['Need to + verb','The passenger needs to change his seat.'],
        ['Question','Do you need special assistance?']
      ],
      examples:[
        'She needs help with her bag.',
        'He needs to sit next to his child.',
        'They need information about their connection.'
      ],
      good:'He needs to find his wife.',
      bad:'He needs finding his wife.',
      mcqPrompt:'Choose the best sentence.',
      mcqAnswers:['The passenger needs to change her seat.','The passenger needs change her seat.','The passenger needs changing her seat.'],
      mcqCorrect:'The passenger needs to change her seat.',
      fillPrompt:'Complete: He needs ___ help with his boarding pass.',
      fillAnswer:'some',
      model:'He needs some help with his boarding pass.'
    },
    {
      id:'g3',
      title:'have a question about / be worried about',
      rule:'Use <strong>have a question about + noun</strong> and <strong>be worried about + noun</strong> to describe the passenger’s request or concern clearly.',
      why:'These two patterns appear all the time in airport and LILATE-style situations.',
      forms:[
        ['Question about','She has a question about the gate change.'],
        ['Worried about','He is worried about his connection.'],
        ['Question','What are you worried about?']
      ],
      examples:[
        'The passenger has a question about her cabin bag.',
        'She is worried about the boarding time.',
        'They have a question about their connection.'
      ],
      good:'She is worried about her connection.',
      bad:'She is worried for her connection.',
      mcqPrompt:'Choose the best sentence.',
      mcqAnswers:['He has a question about his cabin bag.','He has a question for his cabin bag.','He has question about his cabin bag.'],
      mcqCorrect:'He has a question about his cabin bag.',
      fillPrompt:'Complete: The passenger is worried ___ the delay.',
      fillAnswer:'about',
      model:'The passenger is worried about the delay.'
    },
    {
      id:'g4',
      title:'travelling with + person',
      rule:'Use <strong>travelling with + person</strong> to say who is with the passenger.',
      why:'This is useful for families, couples, children, and special situations in the airline context.',
      forms:[
        ['Affirmative','She is travelling with her husband.'],
        ['Negative','He is not travelling with his family.'],
        ['Question','Are you travelling with your child?']
      ],
      examples:[
        'She is travelling with her daughter.',
        'He is travelling with his wife.',
        'They are travelling with their family.'
      ],
      good:'She is travelling with her daughter.',
      bad:'She is travelling by her daughter.',
      mcqPrompt:'Choose the correct sentence.',
      mcqAnswers:['They are travelling with their family.','They are travelling by their family.','They are travelling to their family.'],
      mcqCorrect:'They are travelling with their family.',
      fillPrompt:'Complete: Are you travelling ___ your husband?',
      fillAnswer:'with',
      model:'Are you travelling with your husband?'
    },
    {
      id:'g5',
      title:'Clarification language',
      rule:'Use a clear pattern such as <strong>If I understand correctly…</strong>, then repeat the important information, and finish with <strong>Is that right?</strong> or <strong>Is that correct?</strong>',
      why:'This is one of the most important skills for LILATE Part 2 because you must gather information and reformulate it professionally.',
      forms:[
        ['Start','If I understand correctly, ...'],
        ['Reformulate','you have a question about your cabin bag and your connection...'],
        ['Finish','Is that right? / Is that correct?']
      ],
      examples:[
        'If I understand correctly, you would like to sit next to your wife. Is that right?',
        'If I understand correctly, you have a question about the boarding time. Is that correct?',
        'So, you would like information about the gate change. Is that right?'
      ],
      good:'If I understand correctly, you would like to know the boarding time. Is that right?',
      bad:'You say boarding time? right?',
      mcqPrompt:'Choose the best clarification question.',
      mcqAnswers:[
        'If I understand correctly, you have a question about the cabin baggage allowance and your flight connection to Madrid. Is that right?',
        'You connection to Madrid?',
        'Could you please tell me if your cabin bag is the main problem?'
      ],
      mcqCorrect:'If I understand correctly, you have a question about the cabin baggage allowance and your flight connection to Madrid. Is that right?',
      fillPrompt:'Complete: If I understand correctly, you ___ like to know the boarding time. Is that right?',
      fillAnswer:'would',
      model:'If I understand correctly, you would like to know the boarding time. Is that right?'
    }
  ];

  const PRACTICE=[
    {type:'mcq',key:'p1',title:'Choose the best response',prompt:'A passenger says: “I would like to sit next to my wife.”',choices:['Of course. Let me check your seats.','Your seat? Gate B12.','I am from France.'],correct:'Of course. Let me check your seats.'},
    {type:'mcq',key:'p2',title:'Choose the best follow-up question',prompt:'A passenger says: “I have a problem with my bag.”',choices:['Could you tell me more about the problem?','What nationality are you?','How old are you?'],correct:'Could you tell me more about the problem?'},
    {type:'fill',key:'p3',title:'Fill in the sentence',prompt:'The passenger is worried ___ the boarding time.',answer:'about'},
    {type:'fill',key:'p4',title:'Fill in the sentence',prompt:'She would like ___ know her gate number.',answer:'to'},
    {type:'mcq',key:'p5',title:'Identify the request',prompt:'“My child is travelling alone.” What is the main request type?',choices:['Special assistance / family situation','Cabin meal only','Seat type only'],correct:'Special assistance / family situation'},
    {type:'mcq',key:'p6',title:'Choose the most professional reformulation',prompt:'The passenger wants information about a delay and a connection.',choices:['If I understand correctly, you would like information about the delay and your connection. Is that right?','Delay and connection?','You are delayed.'],correct:'If I understand correctly, you would like information about the delay and your connection. Is that right?'}
  ];

  const SCENARIOS=[
    {id:'sc1',title:'Seat change + wife',brief:'A passenger wants to sit next to his wife.',transcript:'Hello. I am travelling to Rome this evening. I would like to sit next to my wife because our seats are different.',info:['Passenger: David Lee','Destination: Rome','Problem: seats are different','Request: sit next to his wife'],clarify:'If I understand correctly, you would like to sit next to your wife because your seats are different. Is that right?',response:'Of course. Let me check your seats and see what is possible.'},
    {id:'sc2',title:'Cabin bag + connection',brief:'A passenger has a question about her cabin bag and her connection.',transcript:'Hello. I am travelling to Madrid tomorrow. I have a question about my cabin bag, and I am also worried about my connecting flight.',info:['Passenger: Anna Brown','Destination: Madrid','Problem 1: question about cabin bag','Problem 2: worried about connection'],clarify:'If I understand correctly, you have a question about your cabin baggage allowance and your connecting flight to Madrid. Is that right?',response:'Yes. Let me check the cabin baggage allowance and your connection for you.'},
    {id:'sc3',title:'Gate change + boarding time',brief:'A passenger wants the correct gate and boarding information.',transcript:'Good afternoon. I am travelling to Lisbon this afternoon. I have a question about a gate change, and I would also like to know the boarding time.',info:['Passenger: Sofia Martinez','Destination: Lisbon','Problem 1: gate change','Problem 2: boarding time'],clarify:'If I understand correctly, your gate has changed, and you would also like to know the boarding time. Is that right?',response:'Your new gate is B12, and boarding starts at 6:15 p.m.'},
    {id:'sc4',title:'Special meal + husband',brief:'A passenger wants to sit near family and check a meal.',transcript:'Hello. I am travelling to Paris this afternoon with my husband. I would like to sit next to him, and I also want to check whether my special meal is confirmed.',info:['Passenger: Maria Silva','Destination: Paris','Travelling with: husband','Problem 1: seat next to husband','Problem 2: special meal'],clarify:'If I understand correctly, you would like to sit next to your husband, and you also want to check whether your special meal is confirmed. Is that correct?',response:'Of course. I will check your seats and your special meal for you.'}
  ];

  const ROLEPLAYS=[
    {id:'rp1',title:'Cabin bag question',prompt:'Passenger: “I have a question about my cabin bag.”',phrases:'Could you tell me more? / If I understand correctly… / Let me check…',model:'Of course. Could you tell me more about your cabin bag? If I understand correctly, you would like information about the cabin baggage allowance. Is that right?'},
    {id:'rp2',title:'Connection worry',prompt:'Passenger: “I am worried about my connection.”',phrases:'If I understand correctly… / Let me check… / Your next flight is…',model:'If I understand correctly, you are worried about your connection. Let me check your next flight for you.'},
    {id:'rp3',title:'Travelling with family',prompt:'Passenger: “I am travelling with my child and we need help.”',phrases:'Are you travelling with…? / Do you need special assistance? / Let me see…',model:'Of course. Are you travelling with your child today? Do you need special assistance? Let me see how I can help you.'}
  ];

  const WRITING=[
    {title:'Scenario 1 — Gate change',simple:'Your gate is B12.',better:'Your gate has changed to B12.',stronger:'Your gate has changed to B12, and boarding starts at 6:15 p.m.'},
    {title:'Scenario 2 — Cabin bag',simple:'You have a question about your bag.',better:'You have a question about your cabin bag.',stronger:'If I understand correctly, you have a question about your cabin baggage allowance.'},
    {title:'Scenario 3 — Family / meal',simple:'She wants to sit with her husband.',better:'She would like to sit next to her husband.',stronger:'If I understand correctly, you would like to sit next to your husband, and you also want to check whether your special meal is confirmed.'}
  ];

  function bindSpeakButtons(){ $$('.speak').forEach(b=>b.addEventListener('click',()=>Speech.say(b.dataset.say||b.textContent))); }
  function initTop(){
    $('#voiceUS').addEventListener('click',()=>{Speech.mode='en-US'; $('#voiceUS').classList.add('is-on'); $('#voiceUK').classList.remove('is-on')});
    $('#voiceUK').addEventListener('click',()=>{Speech.mode='en-GB'; $('#voiceUK').classList.add('is-on'); $('#voiceUS').classList.remove('is-on')});
    $('#btnPause').addEventListener('click',()=>Speech.pause()); $('#btnResume').addEventListener('click',()=>Speech.resume()); $('#btnStop').addEventListener('click',()=>Speech.stop());
    $('#btnStart').addEventListener('click',()=>$('#main').scrollIntoView({behavior:'smooth'}));
    $('#btnListenIntro').addEventListener('click',()=>Speech.say('In this lesson, you will identify the passenger request, ask a clear question, reformulate professionally, and give a short professional response.'));
    $('#btnResetAll').addEventListener('click',()=>location.reload());
  }

  function initVocab(){
    const cats=['all',...new Set(VOCAB.map(v=>v.cat))]; const labels={all:'All categories',seat:'Seat questions',baggage:'Bag questions',travel:'Travel information',service:'Service and assistance'};
    $('#vocabFilter').innerHTML=cats.map(c=>`<option value="${c}">${labels[c]||c}</option>`).join('');
    function render(){ const c=$('#vocabFilter').value; const list=c==='all'?VOCAB:VOCAB.filter(v=>v.cat===c); $('#vocabGrid').innerHTML=list.map(v=>`
      <div class="flashcard">
        <div class="fcTop"><div><div class="fcWord">${v.emoji} ${v.word}</div><div class="fcFr">${v.fr}</div></div><button class="iconbtn speak" data-say="${escapeHtml(v.word)}. ${escapeHtml(v.ex)}" type="button">🔊</button></div>
        <div class="fcDef">${v.def}</div>
        <div class="fcEx">Example: ${v.ex}</div>
      </div>`).join(''); bindSpeakButtons(); }
    $('#vocabFilter').addEventListener('change',render); $('#btnSpeakCategory').addEventListener('click',()=>{const c=$('#vocabFilter').value; const list=(c==='all'?VOCAB:VOCAB.filter(v=>v.cat===c)).map(v=>`${v.word}. ${v.ex}`).join(' '); Speech.say(list);}); render();
  }

  function initGrammar(){
    const host=$('#grammarHost');
    host.innerHTML=GRAMMAR.map(g=>`
      <div class="practiceCard gBlock" id="${g.id}">
        <div class="card__head">
          <h3>${g.title}</h3>
          <button class="iconbtn speak" data-say="${g.examples.join(' ')}" type="button">🔊</button>
        </div>

        <div class="gRule">${g.rule}</div>
        <div class="example" style="margin-top:.6rem;"><strong>Why this matters:</strong> ${g.why}</div>

        <div class="example" style="margin-top:.6rem;">
          <strong>Forms to remember</strong>
          <div style="display:grid;gap:.35rem;margin-top:.45rem;">
            ${g.forms.map(f=>`<div><strong>${f[0]}:</strong> ${f[1]}</div>`).join('')}
          </div>
        </div>

        <div class="gExamples">
          ${g.examples.map(ex=>`<div class="example">${ex}</div>`).join('')}
        </div>

        <div class="rightwrong">
          <div class="good">✅ ${g.good}</div>
          <div class="bad">❌ ${g.bad}</div>
        </div>

        <label class="lab" style="margin-top:.7rem;">Take notes
          <textarea class="textarea" rows="2" placeholder="Write the rule in your own words."></textarea>
        </label>

        <div class="example" style="margin-top:.7rem;"><strong>Practice A:</strong> ${g.mcqPrompt}</div>
        <div class="smallrow">
          ${shuffle(g.mcqAnswers).map(a=>`<button class="iconbtn g-answer" data-mode="mcq" data-gid="${g.id}" data-answer="${escapeHtml(a)}" type="button">${a}</button>`).join('')}
        </div>
        <div class="feedback hidden" id="fb-${g.id}-mcq"></div>

        <div class="example" style="margin-top:.8rem;"><strong>Practice B:</strong> ${g.fillPrompt}</div>
        <div class="smallrow">
          <input class="select g-fill" data-gid="${g.id}" placeholder="Type the missing word"/>
          <button class="btn g-fill-check" data-gid="${g.id}" type="button">Check</button>
        </div>
        <div class="feedback hidden" id="fb-${g.id}-fill"></div>
      </div>`).join('');

    $$('.g-answer').forEach(btn=>btn.addEventListener('click',()=>{
      const gid=btn.dataset.gid;
      const g=GRAMMAR.find(x=>x.id===gid);
      const fb=$('#fb-'+gid+'-mcq');
      const ok=btn.dataset.answer===g.mcqCorrect;
      fb.className='feedback '+(ok?'ok':'no');
      fb.classList.remove('hidden');
      fb.innerHTML=ok
        ? `✅ Correct! <br>${g.model}`
        : `❌ Not quite. Best answer: <strong>${g.mcqCorrect}</strong><br>${g.model}`;
      if(ok) Score.award('g-'+gid+'-mcq',1);
    }));

    $$('.g-fill-check').forEach(btn=>btn.addEventListener('click',()=>{
      const gid=btn.dataset.gid;
      const g=GRAMMAR.find(x=>x.id===gid);
      const input=$('.g-fill[data-gid="'+gid+'"]');
      const fb=$('#fb-'+gid+'-fill');
      const ok=normalize(input.value)===normalize(g.fillAnswer);
      fb.className='feedback '+(ok?'ok':'no');
      fb.classList.remove('hidden');
      fb.innerHTML=ok
        ? `✅ Correct! <br>${g.model}`
        : `❌ Correct answer: <strong>${g.fillAnswer}</strong><br>${g.model}`;
      if(ok) Score.award('g-'+gid+'-fill',1);
    }));
  }

  function initPractice(){
    const host=$('#practiceHost');
    host.innerHTML=PRACTICE.map(item=>{
      if(item.type==='fill') return `<div class="practiceCard"><h3>${item.title}</h3><div class="example">${item.prompt}</div><div class="smallrow"><input class="select fill-input" data-key="${item.key}" placeholder="Type one word"/><button class="btn fill-check" data-key="${item.key}" type="button">Check</button></div><div class="feedback hidden" id="fb-${item.key}"></div></div>`;
      return `<div class="practiceCard"><h3>${item.title}</h3><div class="example">${item.prompt}</div>${shuffle(item.choices).map(c=>`<div class="choice" data-key="${item.key}" data-answer="${escapeHtml(c)}">${c}</div>`).join('')}<div class="feedback hidden" id="fb-${item.key}"></div></div>`;
    }).join('');
    $$('.choice',host).forEach(ch=>ch.addEventListener('click',()=>{const item=PRACTICE.find(x=>x.key===ch.dataset.key); const fb=$('#fb-'+item.key); const ok=ch.dataset.answer===item.correct; $$('.choice[data-key="'+item.key+'"]',host).forEach(c=>c.classList.remove('correct','wrong')); ch.classList.add(ok?'correct':'wrong'); fb.className='feedback '+(ok?'ok':'no'); fb.classList.remove('hidden'); fb.innerHTML=ok?`✅ Correct!`:`❌ Best answer: <strong>${item.correct}</strong>`; if(ok) Score.award(item.key,1);}));
    $$('.fill-check',host).forEach(btn=>btn.addEventListener('click',()=>{const item=PRACTICE.find(x=>x.key===btn.dataset.key); const input=$('.fill-input[data-key="'+item.key+'"]',host); const fb=$('#fb-'+item.key); const ok=normalize(input.value)===normalize(item.answer); fb.className='feedback '+(ok?'ok':'no'); fb.classList.remove('hidden'); fb.innerHTML=ok?`✅ Correct!`:`❌ Correct answer: <strong>${item.answer}</strong>`; if(ok) Score.award(item.key,1);}));
  }

  let currentScenario=SCENARIOS[0];
  function renderScenario(){
    $('#scTitle').textContent=currentScenario.title; $('#scBrief').innerHTML=`<div class="line"><div class="ico">🎧</div><div>${currentScenario.brief}</div></div>`;
    $('#transcriptBox').textContent=currentScenario.transcript; $('#infoBox').innerHTML=currentScenario.info.map(x=>'• '+x).join('<br>');
    $('#writeInfo').value=''; $('#writeClarify').value=''; $('#writeResponse').value=''; $('#scenarioFb').classList.add('hidden'); $('#scenarioModel').classList.add('hidden');
  }
  function initScenarios(){
    $('#scenarioSelect').innerHTML=SCENARIOS.map(s=>`<option value="${s.id}">${s.title}</option>`).join('');
    $('#scenarioSelect').addEventListener('change',()=>{currentScenario=SCENARIOS.find(s=>s.id===$('#scenarioSelect').value)||SCENARIOS[0]; renderScenario();});
    $('#btnScenarioAudio').addEventListener('click',()=>Speech.say(currentScenario.transcript));
    $('#btnScenarioReset').addEventListener('click',renderScenario);
    $('#btnShowTranscript').addEventListener('click',()=>$('#transcriptBox').classList.toggle('hidden'));
    $('#btnShowModelInfo').addEventListener('click',()=>$('#infoBox').classList.toggle('hidden'));
    $('#btnCheckScenario').addEventListener('click',()=>{
      const info=normalize($('#writeInfo').value), clarify=normalize($('#writeClarify').value), response=normalize($('#writeResponse').value); let good=0;
      if(currentScenario.info.some(i=>info.includes(normalize(i.split(':').slice(1).join(':').trim()).split(' ')[0]))) good++;
      if(clarify.includes('if i understand correctly') || clarify.includes('is that right') || clarify.includes('is that correct')) good++;
      if(response.includes('let me check') || response.includes('boarding') || response.includes('gate') || response.includes('of course')) good++;
      const fb=$('#scenarioFb'); fb.className='feedback '+(good>=2?'ok':'no'); fb.classList.remove('hidden'); fb.innerHTML=good>=2?'✅ Good work. Your answer is clear and professional.':'❌ Add more key information, a clearer clarification question, or a more professional response.'; if(good>=2) Score.award('scenario-'+currentScenario.id,2);
    });
    $('#btnShowScenarioModel').addEventListener('click',()=>{ const box=$('#scenarioModel'); box.classList.remove('hidden'); box.innerHTML=`<strong>Essential information</strong><br>${currentScenario.info.map(i=>'• '+i).join('<br>')}<br><br><strong>Clarification</strong><br>${currentScenario.clarify}<br><br><strong>Response</strong><br>${currentScenario.response}`; });
    renderScenario();
  }

  function initRoleplays(){
    $('#roleplaySelect').innerHTML=ROLEPLAYS.map(r=>`<option value="${r.id}">${r.title}</option>`).join('');
    function render(){ const r=ROLEPLAYS.find(x=>x.id===$('#roleplaySelect').value)||ROLEPLAYS[0]; $('#rpTitle').textContent=r.title; $('#rpPrompt').textContent=r.prompt; $('#rpPhrases').textContent=r.phrases; $('#rpModel').textContent=r.model; $('#rpWrite').value=''; $('#rpFb').classList.add('hidden'); }
    $('#roleplaySelect').addEventListener('change',render); render();
    $('#btnPlayPrompt').addEventListener('click',()=>{const r=ROLEPLAYS.find(x=>x.id===$('#roleplaySelect').value)||ROLEPLAYS[0]; Speech.say(r.prompt)});
    $('#btnPlayModel').addEventListener('click',()=>{const r=ROLEPLAYS.find(x=>x.id===$('#roleplaySelect').value)||ROLEPLAYS[0]; Speech.say(r.model)});
    $('#btnCheckRoleplay').addEventListener('click',()=>{const r=ROLEPLAYS.find(x=>x.id===$('#roleplaySelect').value)||ROLEPLAYS[0]; const ans=normalize($('#rpWrite').value); const ok=ans.includes('if i understand correctly') || ans.includes('let me check') || ans.includes('of course') || ans.includes('could you tell me more'); const fb=$('#rpFb'); fb.className='feedback '+(ok?'ok':'no'); fb.classList.remove('hidden'); fb.innerHTML=ok?'✅ Good professional language.':'❌ Try to use one of the useful phrases or the model structure.'; if(ok) Score.award('roleplay-'+r.id,2); });
  }

  function initWriting(){
    $('#writingLadder').innerHTML=WRITING.map(w=>`<div class="card"><div class="card__head"><h3>${w.title}</h3></div><div class="good"><strong>Simple</strong><br>${w.simple}</div><div class="example" style="margin-top:.55rem"><strong>Better</strong><br>${w.better}</div><div class="modelBox"><strong>Stronger</strong><br>${w.stronger}</div></div>`).join('');
  }

  function initFinal(){
    $('#btnFinalCheck').addEventListener('click',()=>{const info=normalize($('#finalInfo').value), c=normalize($('#finalClarify').value), r=normalize($('#finalResponse').value); let good=0; if(info.includes('rome')||info.includes('special meal')||info.includes('husband'))good++; if(c.includes('if i understand correctly'))good++; if(r.includes('let me')||r.includes('check')||r.includes('special meal')||r.includes('seat'))good++; const fb=$('#finalFb'); fb.className='feedback '+(good>=2?'ok':'no'); fb.classList.remove('hidden'); fb.innerHTML=good>=2?'✅ Nice checkpoint. You are using the right exam skills.':'❌ Try to include the key information, a clarification pattern, and a short professional response.'; if(good>=2) Score.award('final',3); });
    $('#btnFinalModel').addEventListener('click',()=>{ $('#finalModel').classList.remove('hidden'); $('#finalModel').innerHTML='<strong>Essential information</strong><br>• Passenger: female passenger<br>• Destination: Rome<br>• Travelling with: husband<br>• Request 1: sit next to her husband<br>• Request 2: check whether her special meal is confirmed<br><br><strong>Clarification</strong><br>If I understand correctly, you would like to sit next to your husband, and you also want to check whether your special meal is confirmed. Is that correct?<br><br><strong>Response</strong><br>Of course. Let me check your seats and your special meal for you.'; });
  }

  function init(){
    $('#jsStatus').textContent='JS: ✅ loaded';
    Score.setMax(23);
    initTop(); initVocab(); initGrammar(); initPractice(); initScenarios(); initRoleplays(); initWriting(); initFinal(); bindSpeakButtons();
  }
  window.addEventListener('DOMContentLoaded',init);
})();
