(() => {
  const $ = (s,e=document)=>e.querySelector(s);
  const $$ = (s,e=document)=>Array.from(e.querySelectorAll(s));
  const normalize = s => String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
  const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

  const Speech = {
    mode:'en-US',
    getVoices(){ try { return window.speechSynthesis?.getVoices?.() || []; } catch(e){ return []; } },
    pickVoice(){ const v=this.getVoices(); return v.find(x=>x.lang===this.mode)||v.find(x=>x.lang?.startsWith(this.mode.slice(0,2)))||v.find(x=>x.lang?.startsWith('en'))||null; },
    say(text){ if(!window.speechSynthesis||!text) return; window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(String(text)); u.lang=this.mode; u.rate=.96; const voice=this.pickVoice(); if(voice) u.voice=voice; speechSynthesis.speak(u); },
    stop(){ try{speechSynthesis.cancel();}catch(e){} }
  };
  if(window.speechSynthesis) speechSynthesis.onvoiceschanged=()=>Speech.getVoices();

  const Score = { now:0, max:0, seen:new Set(), setMax(n){this.max=n; renderScore();}, award(k){ if(this.seen.has(k)) return; this.seen.add(k); this.now++; renderScore(); }, reset(){ this.now=0; this.seen.clear(); renderScore(); }};
  function renderScore(){ $('#scoreNow').textContent=Score.now; $('#scoreMax').textContent=Score.max; }

  const SITUATIONS = {
    delay: {
      title:'Delay',
      desc:'A passenger is worried because the flight is delayed and wants clear information about boarding.',
      facts:['The flight is delayed.','The passenger is worried.','Boarding starts later.','You need to apologise and give clear information.'],
      rules:[
        'Use <strong>There is / There are</strong>: There is a delay.',
        'Use <strong>be + past participle</strong> for the situation now: The flight is delayed.',
        'Use <strong>I’m sorry for...</strong> to apologise professionally.',
        'Use <strong>so</strong> to explain the consequence: The flight is delayed, so boarding will start later.'
      ],
      easy:[
        {q:'Best response to “Why are we not boarding now?”', a:'I’m sorry for the delay. Boarding will start a little later.', choices:['I’m sorry for the delay. Boarding will start a little later.','No boarding now.','Gate later.']},
        {q:'Choose the best sentence.', a:'There is a delay.', choices:['There is a delay.','There are a delay.','The delay are here.']},
        {q:'Choose the correct apology.', a:'I’m sorry for the inconvenience.', choices:['I’m sorry for the inconvenience.','I am sorry because problem.','Excuse the delay problem.']}
      ],
      fill:[
        {q:'There ___ a delay.', a:'is'},
        {q:'The flight is ______.', a:'delayed'},
        {q:'I’m sorry ___ the delay.', a:'for'},
        {q:'The flight is delayed, ___ boarding will start later.', a:'so'}
      ],
      rulesQ:[
        {q:'Which structure describes the situation now?', a:'The flight is delayed.', choices:['The flight is delayed.','The flight delayed.','The flight delay.']},
        {q:'Which linking word shows the result?', a:'so', choices:['because','so','but']},
        {q:'Which sentence is polite and professional?', a:'Let me check that for you.', choices:['Wait there.','Let me check that for you.','You wait.']}
      ],
      build:{ target:'I’m sorry for the delay, so boarding will start later.', tokens:['I’m','sorry','for','the','delay,','so','boarding','will','start','later.'] },
      reform:['The flight is delayed.','The passenger is worried about boarding.','Boarding starts at 7:10 p.m.'],
      model:'If I understand correctly, your flight is delayed and you would like to know the new boarding time. Boarding starts at 7:10 p.m.',
      ladder:['The flight is delayed.','The flight is delayed, so boarding will start later.','I’m sorry for the delay. Your flight is delayed, so boarding will now start at 7:10 p.m.'],
      oral:{ prompt:'A passenger asks why boarding has not started yet.', checklist:['Apologise.','Say there is a delay.','Give the new boarding time.'], model:'I’m sorry for the delay. There is a delay, so boarding will start a little later. Boarding now starts at 7:10 p.m.' }
    },
    gate_change: {
      title:'Gate change',
      desc:'A passenger is at the wrong gate and needs the new gate number and the next step.',
      facts:['There is a gate change.','The new gate is B12.','The passenger is at the wrong gate.','You need to give clear instructions.'],
      rules:[
        'Use <strong>There is a gate change.</strong>',
        'Avoid present perfect here for Yanis. Say: <strong>Your new gate is B12.</strong>',
        'Use <strong>You need to...</strong> or <strong>Please...</strong> for instructions.',
        'Use <strong>because / so</strong> to explain why.'
      ],
      easy:[
        {q:'Best response to “Is this the correct gate?”', a:'There is a gate change. Your new gate is B12.', choices:['There is a gate change. Your new gate is B12.','Gate changed.','This gate no.']},
        {q:'Choose the best instruction.', a:'Please go to gate B12 now.', choices:['Please go to gate B12 now.','Go B12 now.','You go gate.']},
        {q:'Choose the natural sentence.', a:'Your new gate is B12.', choices:['Your new gate is B12.','Your gate is changed B12.','Gate new B12 is.']}
      ],
      fill:[
        {q:'There ___ a gate change.', a:'is'},
        {q:'Your new gate ___ B12.', a:'is'},
        {q:'Please go ___ gate B12 now.', a:'to'},
        {q:'You need ___ go to the new gate.', a:'to'}
      ],
      rulesQ:[
        {q:'Which sentence is best for Yanis at this stage?', a:'Your new gate is B12.', choices:['Your new gate is B12.','Your gate has changed to B12.','Your gate changed has B12.']},
        {q:'Which is the best polite instruction?', a:'Please go to gate B12 now.', choices:['Please go to gate B12 now.','You go B12.','B12 now.']},
        {q:'Which structure gives a simple updated fact?', a:'Your new gate is B12.', choices:['There was B12.','Your new gate is B12.','The gate being B12.']}
      ],
      build:{ target:'There is a gate change, and your new gate is B12.', tokens:['There','is','a','gate','change,','and','your','new','gate','is','B12.'] },
      reform:['There is a gate change.','The passenger is at the wrong gate.','The new gate is B12.'],
      model:'If I understand correctly, you are at the wrong gate and you need the new gate number. There is a gate change, and your new gate is B12.',
      ladder:['The gate is B12.','There is a gate change. Your new gate is B12.','There is a gate change, and your new gate is B12. Please go there now because boarding starts soon.'],
      oral:{ prompt:'A passenger is waiting at A4, but the new gate is B12.', checklist:['Say there is a gate change.','Give the new gate.','Tell the passenger what to do next.'], model:'There is a gate change. Your new gate is B12. Please go there now because boarding starts soon.' }
    },
    seat_problem: {
      title:'Seat problem',
      desc:'A passenger has a seat problem and wants to sit next to a family member.',
      facts:['There is a problem with the seat.','The passenger wants to sit next to his wife.','You need to check the seat and respond clearly.'],
      rules:[
        'Use <strong>There is a problem with...</strong>',
        'Use <strong>would like to</strong> for the request.',
        'Use <strong>Let me check that for you.</strong>',
        'Use <strong>but</strong> to contrast problem and solution.'
      ],
      easy:[
        {q:'Best response to “I would like to sit next to my wife.”', a:'Of course. Let me check that for you.', choices:['Of course. Let me check that for you.','Sit wife yes.','You like wife seat.']},
        {q:'Choose the best problem sentence.', a:'There is a problem with your seat.', choices:['There is a problem with your seat.','There are a problem with your seat.','Your seat there is problem.']},
        {q:'Choose the best follow-up.', a:'May I see your boarding pass, please?', choices:['May I see your boarding pass, please?','Boarding pass now.','Give pass.']}
      ],
      fill:[
        {q:'There ___ a problem with your seat.', a:'is'},
        {q:'You would like ___ sit next to your wife.', a:'to'},
        {q:'Let me check that ___ you.', a:'for'},
        {q:'May I see your boarding ___, please?', a:'pass'}
      ],
      rulesQ:[
        {q:'Which sentence is a polite service response?', a:'Let me check that for you.', choices:['Let me check that for you.','I check now.','Check seat.']},
        {q:'Which sentence describes one problem?', a:'There is a problem with your seat.', choices:['There are a problem with your seat.','There is a problem with your seat.','There problem seat.']},
        {q:'Which word fits: You would like ___ sit next to your wife.', a:'to', choices:['to','for','at']}
      ],
      build:{ target:'There is a problem with your seat, but I can help you.', tokens:['There','is','a','problem','with','your','seat,','but','I','can','help','you.'] },
      reform:['The passenger would like to sit next to his wife.','There is a seat problem.','You need to check the boarding pass.'],
      model:'If I understand correctly, there is a problem with your seat and you would like to sit next to your wife. May I see your boarding pass, please?',
      ladder:['There is a seat problem.','There is a problem with your seat, and you would like to sit next to your wife.','If I understand correctly, there is a problem with your seat and you would like to sit next to your wife. Let me check that for you right away.'],
      oral:{ prompt:'A passenger wants to sit next to his wife, but the seats are different.', checklist:['Identify the problem.','Ask for the boarding pass.','Say you will check.'], model:'If I understand correctly, there is a problem with your seat and you would like to sit next to your wife. May I see your boarding pass, please? Let me check that for you.' }
    },
    connection: {
      title:'Connection worry',
      desc:'A passenger is worried about a connection because the first flight is delayed.',
      facts:['The passenger has a connection.','The first flight is delayed.','The passenger is worried.','You need to clarify and reassure.'],
      rules:[
        'Use <strong>be worried about</strong> to describe the concern.',
        'Use <strong>because</strong> to explain the reason.',
        'Use <strong>Let me check...</strong> to sound professional.',
        'Use <strong>If I understand correctly...</strong> to reformulate.'
      ],
      easy:[
        {q:'Best reformulation start?', a:'If I understand correctly, you are worried about your connection.', choices:['If I understand correctly, you are worried about your connection.','You worry connection.','Connection worry yes.']},
        {q:'Best explanation?', a:'The passenger is worried because the flight is delayed.', choices:['The passenger is worried because the flight is delayed.','The passenger worried so delayed.','Because delayed the passenger.']},
        {q:'Best professional response?', a:'Let me check your connection for you.', choices:['Let me check your connection for you.','I check connection.','Wait connection.']}
      ],
      fill:[
        {q:'The passenger is worried ___ the connection.', a:'about'},
        {q:'The flight is delayed, ___ the passenger is worried.', a:'so'},
        {q:'Let me check that ___ you.', a:'for'},
        {q:'If I understand correctly, you are worried ___ your connection.', a:'about'}
      ],
      rulesQ:[
        {q:'Which phrase shows the reason?', a:'because', choices:['because','but','or']},
        {q:'Which sentence sounds professional?', a:'Let me check your connection for you.', choices:['Let me check your connection for you.','I check connection.','Check now.']},
        {q:'Which verb pattern is correct?', a:'worried about', choices:['worried about','worried for to','worried with']}
      ],
      build:{ target:'The flight is delayed, so you are worried about your connection.', tokens:['The','flight','is','delayed,','so','you','are','worried','about','your','connection.'] },
      reform:['The passenger is worried about the connection.','The flight is delayed.','You need to check the next flight.'],
      model:'If I understand correctly, you are worried about your connection because the flight is delayed. Let me check the next flight for you.',
      ladder:['The flight is delayed.','The flight is delayed, so you are worried about your connection.','If I understand correctly, the flight is delayed, so you are worried about your connection. Let me check the next flight for you right away.'],
      oral:{ prompt:'A passenger says: “I am worried because I have a connection in Madrid.”', checklist:['Reformulate the problem.','Use because or so correctly.','Say you will check.'], model:'If I understand correctly, you are worried about your connection because your flight is delayed. Let me check that for you.' }
    },
    cabin_bag: {
      title:'Cabin bag problem',
      desc:'A passenger’s cabin bag is too large and must go in the hold.',
      facts:['The cabin bag is too large.','The passenger needs help.','The bag must go in the hold.'],
      rules:[
        'Use <strong>Your bag is too large.</strong> for the current situation.',
        'Use <strong>You need to...</strong> to explain the next step.',
        'Use <strong>Please...</strong> for polite instructions.',
        'Use <strong>I’m sorry for the inconvenience.</strong> if needed.'
      ],
      easy:[
        {q:'Best explanation?', a:'Your cabin bag is too large.', choices:['Your cabin bag is too large.','Your bag too large.','Bag is big too much.']},
        {q:'Best next step?', a:'You need to check it in.', choices:['You need to check it in.','Check in it.','You need check it.']},
        {q:'Best polite instruction?', a:'Please wait here for assistance.', choices:['Please wait here for assistance.','Wait here.','You wait here now.']}
      ],
      fill:[
        {q:'Your cabin bag ___ too large.', a:'is'},
        {q:'You need ___ check it in.', a:'to'},
        {q:'Please wait here ___ assistance.', a:'for'},
        {q:'I’m sorry for the __________.', a:'inconvenience'}
      ],
      rulesQ:[
        {q:'Which is the best professional sentence?', a:'Your cabin bag is too large, and you need to check it in.', choices:['Your cabin bag is too large, and you need to check it in.','Your bag too large.','Need check bag.']},
        {q:'Which word completes the rule?', a:'to', choices:['to','for','with']},
        {q:'Which phrase is a polite instruction?', a:'Please wait here for assistance.', choices:['Please wait here for assistance.','Wait here.','Stay here now.']}
      ],
      build:{ target:'Your cabin bag is too large, so you need to check it in.', tokens:['Your','cabin','bag','is','too','large,','so','you','need','to','check','it','in.'] },
      reform:['The cabin bag is too large.','The passenger needs help.','The bag must go in the hold.'],
      model:'If I understand correctly, your cabin bag is too large and you need help with it. You need to check it in, and the bag will go in the hold.',
      ladder:['The bag is too large.','Your cabin bag is too large, so you need to check it in.','I’m sorry for the inconvenience. Your cabin bag is too large, so you need to check it in. Please wait here for assistance.'],
      oral:{ prompt:'A passenger has a cabin bag that is too large for the overhead bin.', checklist:['Explain the problem.','Say what the passenger needs to do.','Stay polite and calm.'], model:'I’m sorry, but your cabin bag is too large. You need to check it in. Please wait here for assistance.' }
    },
    assistance: {
      title:'Special assistance',
      desc:'A passenger needs special assistance and would like help getting to the seat.',
      facts:['The passenger needs special assistance.','The passenger would like help.','You need to respond clearly and calmly.'],
      rules:[
        'Use <strong>Do you need special assistance?</strong>',
        'Use <strong>I can help you.</strong> or <strong>Please follow me.</strong>',
        'Use <strong>present continuous</strong> if something is happening now: We are boarding now.',
        'Use short, clear sentences.'
      ],
      easy:[
        {q:'Best question?', a:'Do you need special assistance?', choices:['Do you need special assistance?','You need special assistance?','Need assistance?']},
        {q:'Best response?', a:'Of course. I can help you to your seat.', choices:['Of course. I can help you to your seat.','I help you seat.','Seat help yes.']},
        {q:'Best instruction?', a:'Please follow me.', choices:['Please follow me.','Follow me.','You follow.']}
      ],
      fill:[
        {q:'Do you need special __________?', a:'assistance'},
        {q:'Of course. I can help you ___ your seat.', a:'to'},
        {q:'Please ______ me.', a:'follow'},
        {q:'We are ______ now.', a:'boarding'}
      ],
      rulesQ:[
        {q:'Which question is polite and correct?', a:'Do you need special assistance?', choices:['Do you need special assistance?','You need special assistance?','Need any special?']},
        {q:'Which sentence is best?', a:'Of course. I can help you to your seat.', choices:['Of course. I can help you to your seat.','I help seat.','Seat to you help.']},
        {q:'Which tense describes what is happening now?', a:'present continuous', choices:['present simple','present continuous','past simple']}
      ],
      build:{ target:'Of course, I can help you to your seat.', tokens:['Of','course,','I','can','help','you','to','your','seat.'] },
      reform:['The passenger needs special assistance.','The passenger would like help getting to the seat.','You can help directly.'],
      model:'If I understand correctly, you need special assistance and you would like help getting to your seat. Of course, I can help you right away.',
      ladder:['The passenger needs help.','The passenger needs special assistance and would like help getting to the seat.','If I understand correctly, you need special assistance and you would like help getting to your seat. Of course, I can help you right away.'],
      oral:{ prompt:'A passenger asks for special assistance on board.', checklist:['Ask or confirm the need.','Say you can help.','Use clear, short language.'], model:'If I understand correctly, you need special assistance. Of course, I can help you to your seat right away.' }
    }
  };

  const situationKeys = Object.keys(SITUATIONS);

  function setMax(){
    const totalPerSituation = 3 + 4 + 3 + 1; // easy + fill + rules + builder
    Score.setMax(situationKeys.length * totalPerSituation);
  }

  function renderSituation(){
    const key = $('#situationSelect').value;
    const s = SITUATIONS[key];
    $('#situationTitle').textContent = s.title;
    $('#situationDesc').textContent = s.desc;
    $('#situationFacts').innerHTML = s.facts.map(f=>`<div class="miniFact">${f}</div>`).join('');

    $('#ruleReminder').innerHTML = `<div class="ruleCard">${s.rules.map(r=>`<div class="ruleLine">${r}</div>`).join('')}</div>`;
    renderEasy(s); renderFill(s); renderRules(s); renderBuilder(s); renderReform(s); renderLadder(s);
    renderOral();
  }

  function renderEasy(s){
    const host = $('#easyHost'); host.innerHTML='';
    s.easy.forEach((item,i)=>{
      const box = document.createElement('div'); box.className='mcQuestion';
      const opts = shuffle(item.choices);
      box.innerHTML = `<div class="question">${i+1}. ${item.q}</div><div class="options"></div><div class="feedback hidden"></div>`;
      const options = $('.options', box), fb = $('.feedback', box);
      opts.forEach(opt=>{
        const btn = document.createElement('button'); btn.type='button'; btn.className='option'; btn.textContent=opt;
        btn.addEventListener('click', ()=>{
          $$('.option', box).forEach(b=>b.disabled=true);
          const ok = opt === item.a;
          btn.classList.add(ok ? 'correct' : 'wrong');
          fb.className = 'feedback ' + (ok ? 'ok' : 'no');
          fb.textContent = ok ? 'Correct!' : `Correct answer: ${item.a}`;
          if(ok) Score.award(`${$('#situationSelect').value}-easy-${i}`);
        });
        options.appendChild(btn);
      });
      host.appendChild(box);
    });
  }

  function renderFill(s){
    const host = $('#fillHost'); host.innerHTML='';
    s.fill.forEach((item,i)=>{
      const box = document.createElement('div'); box.className='fillQuestion';
      box.innerHTML = `<div class="question">${i+1}. ${item.q}</div><input class="inlineInput"/><button class="checkBtn" type="button">Check</button><div class="feedback hidden"></div>`;
      const input = $('input', box), btn = $('.checkBtn', box), fb = $('.feedback', box);
      btn.addEventListener('click', ()=>{
        const ok = normalize(input.value) === normalize(item.a);
        fb.className = 'feedback ' + (ok ? 'ok' : 'no');
        fb.textContent = ok ? 'Correct!' : `Correct answer: ${item.a}`;
        if(ok) Score.award(`${$('#situationSelect').value}-fill-${i}`);
      });
      host.appendChild(box);
    });
  }

  function renderRules(s){
    const host = $('#ruleHost'); host.innerHTML='';
    s.rulesQ.forEach((item,i)=>{
      const box = document.createElement('div'); box.className='ruleQuestion';
      const opts = shuffle(item.choices);
      box.innerHTML = `<div class="question">${i+1}. ${item.q}</div><div class="options"></div><div class="feedback hidden"></div>`;
      const options = $('.options', box), fb = $('.feedback', box);
      opts.forEach(opt=>{
        const btn = document.createElement('button'); btn.type='button'; btn.className='option'; btn.textContent=opt;
        btn.addEventListener('click', ()=>{
          $$('.option', box).forEach(b=>b.disabled=true);
          const ok = opt === item.a;
          btn.classList.add(ok ? 'correct' : 'wrong');
          fb.className = 'feedback ' + (ok ? 'ok' : 'no');
          fb.textContent = ok ? 'Correct!' : `Correct answer: ${item.a}`;
          if(ok) Score.award(`${$('#situationSelect').value}-rule-${i}`);
        });
        options.appendChild(btn);
      });
      host.appendChild(box);
    });
  }

  function renderBuilder(s){
    const host = $('#builderHost'); const fb = $('#builderFb'); host.innerHTML=''; fb.className='feedback hidden';
    const box = document.createElement('div'); box.className='builderCard';
    box.innerHTML = `<div class="builderPrompt">Build: <strong>${s.build.target}</strong></div><div class="builderBank"></div><div class="builderDrop"></div><div class="btnRow" style="margin-top:.7rem"><button class="btn ghost" id="builderCheck" type="button">Check</button><button class="btn ghost" id="builderReset" type="button">Reset</button></div>`;
    host.appendChild(box);
    const bank = $('.builderBank', box), drop = $('.builderDrop', box);
    shuffle(s.build.tokens).forEach(tok=>{
      const b = document.createElement('button'); b.type='button'; b.className='tokenBtn'; b.textContent=tok;
      b.addEventListener('click', ()=>{
        const chip = document.createElement('button'); chip.type='button'; chip.className='tokenBtn drop'; chip.textContent=tok;
        chip.addEventListener('click', ()=>{ chip.remove(); b.disabled=false; });
        drop.appendChild(chip); b.disabled=true;
      });
      bank.appendChild(b);
    });
    $('#builderCheck').addEventListener('click', ()=>{
      const built = $$('.tokenBtn.drop', drop).map(x=>x.textContent).join(' ').replace(/\s+([?.!,])/g,'$1').trim();
      const ok = normalize(built) === normalize(s.build.target);
      fb.className = 'feedback ' + (ok ? 'ok' : 'no');
      fb.textContent = ok ? 'Correct!' : `Correct answer: ${s.build.target}`;
      if(ok) Score.award(`${$('#situationSelect').value}-builder`);
    });
    $('#builderReset').addEventListener('click', ()=> renderBuilder(s));
  }

  function renderReform(s){
    $('#reformFacts').innerHTML = s.reform.map(f=>`<div class="miniFact">${f}</div>`).join('');
    $('#reformWrite').value = '';
    $('#reformModel').textContent = s.model;
    $('#reformModel').classList.add('hidden');
  }

  function renderLadder(s){
    $('#ladderHost').innerHTML = `
      <table class="ladderTable">
        <tr><th>Level</th><th>Model</th></tr>
        <tr><td>Simple</td><td>${s.ladder[0]}</td></tr>
        <tr><td>Better</td><td>${s.ladder[1]}</td></tr>
        <tr><td>Stronger</td><td>${s.ladder[2]}</td></tr>
      </table>`;
  }

  function renderOral(){
    const key = $('#oralSelect').value || $('#situationSelect').value;
    const s = SITUATIONS[key].oral;
    $('#oralPrompt').textContent = s.prompt;
    $('#oralChecklist').innerHTML = s.checklist.map(x=>`<li>${x}</li>`).join('');
    $('#oralModel').textContent = s.model;
    $('#oralModel').classList.add('hidden');
  }

  function initSelectors(){
    const sit = $('#situationSelect'), oral = $('#oralSelect');
    situationKeys.forEach(k=>{
      const o1=document.createElement('option'); o1.value=k; o1.textContent=SITUATIONS[k].title; sit.appendChild(o1);
      const o2=document.createElement('option'); o2.value=k; o2.textContent=SITUATIONS[k].title; oral.appendChild(o2);
    });
    sit.addEventListener('change', ()=>{ oral.value=sit.value; renderSituation(); });
    oral.addEventListener('change', renderOral);
    sit.value=situationKeys[0]; oral.value=situationKeys[0];
  }

  function bind(){
    $('#voiceUS').addEventListener('click', ()=>{ Speech.mode='en-US'; $('#voiceUS').classList.add('active'); $('#voiceUK').classList.remove('active'); });
    $('#voiceUK').addEventListener('click', ()=>{ Speech.mode='en-GB'; $('#voiceUK').classList.add('active'); $('#voiceUS').classList.remove('active'); });
    $('#stopAudio').addEventListener('click', ()=> Speech.stop());
    $('#resetAll').addEventListener('click', ()=>{ Score.reset(); renderSituation(); });
    $('#speakSituation').addEventListener('click', ()=>{ const s = SITUATIONS[$('#situationSelect').value]; Speech.say(`${s.title}. ${s.desc}`); });
    $('#toggleReformModel').addEventListener('click', ()=> $('#reformModel').classList.toggle('hidden'));
    $('#speakReformModel').addEventListener('click', ()=> Speech.say($('#reformModel').textContent));
    $('#showOralModel').addEventListener('click', ()=> $('#oralModel').classList.toggle('hidden'));
    $('#speakOralPrompt').addEventListener('click', ()=> Speech.say($('#oralPrompt').textContent));
  }

  function init(){
    setMax();
    initSelectors();
    bind();
    renderSituation();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
