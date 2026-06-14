(() => {
  const $=(s,e=document)=>e.querySelector(s), $$=(s,e=document)=>Array.from(e.querySelectorAll(s));
  const Speech={mode:'en-US',getVoices(){try{return window.speechSynthesis?.getVoices?.()||[]}catch(e){return[]}},pickVoice(){const v=this.getVoices();return v.find(x=>x.lang===this.mode)||v.find(x=>x.lang?.startsWith(this.mode.slice(0,2)))||v.find(x=>x.lang?.startsWith('en'))||null},say(text){if(!window.speechSynthesis||!text)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang=this.mode;u.rate=.96;u.pitch=1;const voice=this.pickVoice();if(voice)u.voice=voice;window.speechSynthesis.speak(u)},pause(){try{speechSynthesis.pause()}catch(e){}},resume(){try{speechSynthesis.resume()}catch(e){}},stop(){try{speechSynthesis.cancel()}catch(e){}}};
  if(window.speechSynthesis) window.speechSynthesis.onvoiceschanged=()=>Speech.getVoices();

  const Score={now:0,max:0,seen:new Set(),setMax(n){this.max=n;renderScore()},award(k,p=1){if(this.seen.has(k))return;this.seen.add(k);this.now+=p;renderScore()},reset(){this.now=0;this.seen.clear();renderScore()}};
  const renderScore=()=>{ $('#scoreNow').textContent=Score.now; $('#scoreMax').textContent=Score.max; $('#progressBar').style.width=(Score.max?Math.round(Score.now/Score.max*100):0)+'%'; };
  const shuffle=a=>{const x=a.slice(); for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]} return x};
  const escapeHtml=s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const normalize=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();

  const VOCAB=[
    {cat:'documents',word:'boarding pass',fr:'carte d’embarquement',def:'the document you need to board the plane',ex:'Is this your boarding pass?',emoji:'🎫'},
    {cat:'documents',word:'passport',fr:'passeport',def:'an official travel document',ex:'May I see your passport, please?',emoji:'🛂'},
    {cat:'documents',word:'document',fr:'document',def:'an official paper or travel paper',ex:'Are those the correct documents?',emoji:'📄'},
    {cat:'travel',word:'gate',fr:'porte d’embarquement',def:'the place where passengers board the plane',ex:'Has your gate changed?',emoji:'🚪'},
    {cat:'travel',word:'boarding time',fr:'heure d’embarquement',def:'the time when boarding starts',ex:'She would like to know the boarding time.',emoji:'⏰'},
    {cat:'travel',word:'seat',fr:'siège',def:'the place where a passenger sits',ex:'Is this your seat?',emoji:'💺'},
    {cat:'travel',word:'cabin bag',fr:'bagage cabine',def:'a small bag you take into the plane',ex:'Is that your cabin bag?',emoji:'🧳'},
    {cat:'travel',word:'special meal',fr:'repas spécial',def:'a meal requested for special needs',ex:'I would like to check whether your special meal is confirmed.',emoji:'🍽️'},
    {cat:'travel',word:'special assistance',fr:'assistance spéciale',def:'extra help for a passenger',ex:'Do you need special assistance?',emoji:'♿'},
    {cat:'family',word:'wife',fr:'épouse',def:'a married woman in relation to her husband',ex:'She is travelling with her wife is incorrect; use husband/wife carefully for the passenger profile.',emoji:'💍'},
    {cat:'family',word:'husband',fr:'mari',def:'a married man in relation to his wife',ex:'He would like to sit next to his husband / wife.',emoji:'🤵'},
    {cat:'family',word:'child',fr:'enfant',def:'one young person',ex:'The passenger is travelling with one child.',emoji:'🧒'},
    {cat:'family',word:'children',fr:'enfants',def:'more than one child',ex:'The family is travelling with two children.',emoji:'👧👦'},
    {cat:'family',word:'mother',fr:'mère',def:'a female parent',ex:'She is travelling with her mother.',emoji:'👩'},
    {cat:'family',word:'father',fr:'père',def:'a male parent',ex:'He is travelling with his father.',emoji:'👨'},
    {cat:'family',word:'daughter',fr:'fille',def:'a female child',ex:'His daughter is travelling with him.',emoji:'👧'},
    {cat:'family',word:'son',fr:'fils',def:'a male child',ex:'Her son is travelling with her.',emoji:'👦'},
    {cat:'family',word:'aunt',fr:'tante',def:'the sister of your father or mother, or the wife of your uncle',ex:'She is travelling with her aunt.',emoji:'👒'},
    {cat:'family',word:'uncle',fr:'oncle',def:'the brother of your father or mother, or the husband of your aunt',ex:'He is travelling with his uncle.',emoji:'🧔'},
    {cat:'family',word:'cousin',fr:'cousin / cousine',def:'the child of your aunt or uncle',ex:'The passenger is travelling with a cousin.',emoji:'👥'},
    {cat:'people',word:'passenger',fr:'passager',def:'a person travelling by plane',ex:'The passenger needs information.',emoji:'🧑‍✈️'},
    {cat:'people',word:'family',fr:'famille',def:'a group of related people',ex:'Are you travelling with your family?',emoji:'👨‍👩‍👧‍👦'},
    {cat:'people',word:'travelling alone',fr:'voyager seul',def:'not travelling with another person',ex:'Could you confirm whether you are travelling alone?',emoji:'🚶'}
  ];

  const MC_DEMO=[
    {q:'___ is your boarding pass in my hand.', options:['This','These','Those'], a:'This'},
    {q:'Are ___ your seats near the window?', options:['this','that','these'], a:'these'},
    {q:'Is ___ your gate over there?', options:['that','these','those'], a:'that'},
    {q:'Are ___ your children at the front desk?', options:['those','that','this'], a:'those'}
  ];
  const FILL_DEMO=[
    {lead:'Is ', tail:' your cabin bag?', choices:['this','these'], a:'this'},
    {lead:'Are ', tail:' the correct documents?', choices:['this','those'], a:'those'},
    {lead:'Are ', tail:' your seats?', choices:['these','that'], a:'these'},
    {lead:'Is ', tail:' your husband over there?', choices:['that','those'], a:'that'}
  ];
  const MC_WHETHER=[
    {q:'Choose the best professional sentence.', options:['I would like to check whether your special meal is confirmed.','I would like to check whether is your special meal confirmed.','I would like check whether your special meal confirmed.'], a:0},
    {q:'Choose the best professional sentence.', options:['Could you confirm whether you are travelling with your family?','Could you confirm whether are you travelling with your family?','Could you confirm if are you travelling with your family?'], a:0},
    {q:'Choose the best professional sentence.', options:['Let me see whether your gate has changed.','Let me see whether has your gate changed.','Let me see whether changed your gate.'], a:0}
  ];
  const FILL_WHETHER=[
    {text:'I would like to check ___ your gate has changed.', a:'whether'},
    {text:'Could you confirm ___ you are travelling alone?', a:'whether'},
    {text:'Let me see ___ your special assistance is confirmed.', a:'whether'}
  ];
  const PRONOUNS=[
    {q:'Anna is travelling to Rome. ___ would like to sit next to her husband.', options:['She','He','You'], a:'She'},
    {q:'David is travelling to Madrid. ___ cabin bag is too large.', options:['Her','His','Your'], a:'His'},
    {q:'Hello, madam. May I see ___ passport?', options:['her','your','his'], a:'your'},
    {q:'The passengers are travelling with children. ___ seats are together.', options:['Their','His','Her'], a:'Their'}
  ];
  const QUESTIONS=[
    {q:'Seat problem', prompt:'Choose the best question.', options:['Would you like to sit next to your wife?','You seat with wife?','Seat wife?'], a:0},
    {q:'Documents', prompt:'Choose the best question.', options:['Is this your boarding pass?','This boarding pass yours?','Are this your boarding pass?'], a:0},
    {q:'Special assistance', prompt:'Choose the best question.', options:['Do you need special assistance?','You need special assistance?','Need special assistance you?'], a:0},
    {q:'Family', prompt:'Choose the best question.', options:['Are these your children?','Is these your children?','These your children?'], a:0}
  ];
  const MIXED_FILL=[
    {text:'The passenger is travelling with ___ wife.', choices:['his','her','your'], a:'his'},
    {text:'Could you confirm ___ you are travelling alone?', choices:['whether','this','those'], a:'whether'},
    {text:'Are ___ your bags?', choices:['these','that','this'], a:'these'},
    {text:'I would like to check ___ your gate has changed.', choices:['whether','your','those'], a:'whether'},
    {text:'Is ___ your passport in my hand?', choices:['this','these','those'], a:'this'},
    {text:'She is travelling with ___ children.', choices:['her','his','your'], a:'her'}
  ];

  const SCENARIOS=[
    {
      key:'family_gate',
      title:'Family + gate change',
      essentials:['Passenger: Sofia Martinez','Destination: Lisbon','Travelling with: two children','Question: gate change','Needs to know: boarding time'],
      transcript:'Good afternoon. I am travelling to Lisbon with my two children. I have a question about a gate change, and I would also like to know the boarding time.',
      questionOptions:[
        'If I understand correctly, you are travelling to Lisbon with your two children, and you would like to know whether your gate has changed and what the boarding time is. Is that right?',
        'You have gate problem children boarding time?',
        'Is this your gate and these your children?'
      ],
      correct:0,
      model:'If I understand correctly, you are travelling to Lisbon with your two children, and you would like to know whether your gate has changed and what the boarding time is. Is that right?'
    },
    {
      key:'meal_wife',
      title:'Special meal + wife',
      essentials:['Passenger: David Lee','Destination: Rome','Travelling with: wife','Question: sit together','Needs to check: special meal'],
      transcript:'Hello. I am travelling to Rome this evening. I would like to sit next to my wife, and I would also like to check whether my special meal is confirmed.',
      questionOptions:[
        'If I understand correctly, you would like to sit next to your wife and check whether your special meal is confirmed. Is that correct?',
        'Your wife special meal Rome?',
        'Are those your seats and this your wife?'
      ],
      correct:0,
      model:'If I understand correctly, you would like to sit next to your wife and check whether your special meal is confirmed. Is that correct?'
    },
    {
      key:'bag_passport',
      title:'Cabin bag + passport',
      essentials:['Passenger: Anna Brown','Destination: Madrid','Question: cabin bag allowance','Document to check: passport and boarding pass','Concern: connection'],
      transcript:'Good morning. I am travelling to Madrid. I have a question about my cabin bag, and I am worried about my connection. I would like to know whether my documents are correct.',
      questionOptions:[
        'If I understand correctly, you have a question about your cabin bag, you are worried about your connection, and you would like to know whether your documents are correct. Is that right?',
        'This your bag and your connection?',
        'Are those your connection and your documents?'
      ],
      correct:0,
      model:'If I understand correctly, you have a question about your cabin bag, you are worried about your connection, and you would like to know whether your documents are correct. Is that right?'
    }
  ];

  const ROLEPLAYS=[
    {
      key:'rp1',
      title:'Boarding pass + seat check',
      prompt:'A passenger is at the gate. You need to check the boarding pass and confirm the seat number in a realistic, professional way.',
      model:'Good afternoon. May I see your boarding pass, please? Thank you. Let me check your seat number. You are travelling to Madrid, and your seat is 14A. Is that correct?',
      keywords:['boarding pass','seat','Madrid','correct']
    },
    {
      key:'rp2',
      title:'Family + children',
      prompt:'A passenger is travelling with children and wants to know whether the seats are together. You need to check the boarding passes and give a clear answer.',
      model:'Hello. May I see your boarding passes, please? Thank you. Let me check your seat numbers. You are travelling with your two children, and your seats are together in row 12.',
      keywords:['boarding passes','children','seats','together']
    },
    {
      key:'rp3',
      title:'Special assistance',
      prompt:'A passenger arrives at the desk and wants to confirm special assistance. You need to ask a calm, professional question and check the information.',
      model:'Good morning. Do you need special assistance today? Thank you. Let me check your file. I can confirm that your assistance request is on your booking.',
      keywords:['special assistance','check','booking','correct']
    }
  ];

  function setVoice(mode){Speech.mode=mode; $('#voiceUS').classList.toggle('is-on',mode==='en-US'); $('#voiceUK').classList.toggle('is-on',mode==='en-GB');}
  function attachChoiceGroup(host, items, keyPrefix, extractor){
    host.innerHTML='';
    items.forEach((item, idx)=>{
      const card=document.createElement('div'); card.className='practiceCard';
      const title=extractor.title(item, idx);
      card.innerHTML=`<h3>${escapeHtml(title)}</h3>`;
      const opts=shuffle(extractor.options(item).map((v,i)=>({text:v, correct: extractor.correct(item,i,v)})));
      const fb=document.createElement('div'); fb.className='feedback hidden';
      opts.forEach((opt, j)=>{
        const div=document.createElement('div'); div.className='choice'; div.innerHTML=`<div>${escapeHtml(opt.text)}</div>`;
        div.addEventListener('click',()=>{
          $$('.choice', card).forEach(x=>x.classList.remove('correct','wrong'));
          div.classList.add(opt.correct?'correct':'wrong');
          fb.className='feedback '+(opt.correct?'ok':'no');
          fb.textContent = opt.correct ? '✅ Correct!' : '❌ Not quite. Read the model carefully and try again.';
          if(opt.correct) Score.award(`${keyPrefix}:${idx}`,1);
        });
        card.appendChild(div);
      });
      card.appendChild(fb); host.appendChild(card);
    });
  }
  function attachSelectFill(host, items, keyPrefix){
    host.innerHTML='';
    items.forEach((item, idx)=>{
      const wrap=document.createElement('div'); wrap.className='practiceCard';
      const select=`<select class="select sel"><option value="">Choose…</option>${shuffle(item.choices||[item.a]).map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}</select>`;
      if(item.lead!==undefined) wrap.innerHTML=`<h3>Sentence ${idx+1}</h3><p class="list--dark">${escapeHtml(item.lead)}${select}${escapeHtml(item.tail)}</p><div class="feedback hidden"></div>`;
      else wrap.innerHTML=`<h3>Sentence ${idx+1}</h3><p class="list--dark">${escapeHtml(item.text).replace('___', select)}</p><div class="feedback hidden"></div>`;
      const sel=$('.sel',wrap), fb=$('.feedback',wrap);
      sel.addEventListener('change',()=>{
        const ok=normalize(sel.value)===normalize(item.a);
        fb.className='feedback '+(ok?'ok':'no'); fb.textContent= ok ? '✅ Correct!' : `❌ Try again. Correct answer: ${item.a}`;
        if(ok) Score.award(`${keyPrefix}:${idx}`,1);
      });
      host.appendChild(wrap);
    });
  }

  function renderVocab(){
    const filter=$('#vocabFilter').value; const grid=$('#vocabGrid'); grid.innerHTML='';
    VOCAB.filter(v=>filter==='all'||v.cat===filter).forEach((v,idx)=>{
      const card=document.createElement('div'); card.className='flashcard';
      card.innerHTML=`<div class="fcTop"><div><div class="fcWord">${escapeHtml(v.word)}</div><div class="fcFr">${escapeHtml(v.fr)}</div></div><div class="fcIcon">${v.emoji}</div></div><div class="fcDef">${escapeHtml(v.def)}</div><div class="fcEx">${escapeHtml(v.ex)}</div><div class="fcBtns"><button class="iconbtn" type="button">🔊 Word</button><button class="iconbtn" type="button">🔊 Example</button></div>`;
      const btns=$$('.iconbtn',card); btns[0].addEventListener('click',()=>Speech.say(v.word)); btns[1].addEventListener('click',()=>Speech.say(v.ex));
      grid.appendChild(card);
    });
  }

  function renderScenario(){
    const sc=SCENARIOS.find(s=>s.key===$('#scenarioSelect').value) || SCENARIOS[0];
    $('#scenarioEssentials').innerHTML=sc.essentials.map(x=>`<div class="line"><div class="ico">•</div><div>${escapeHtml(x)}</div></div>`).join('');
    $('#scenarioTranscript').textContent=sc.transcript;
    const host=$('#scenarioQuestion'); host.innerHTML='';
    const opts=shuffle(sc.questionOptions.map((q,i)=>({text:q, ok:i===sc.correct})));
    opts.forEach((opt,i)=>{
      const div=document.createElement('div'); div.className='choice'; div.textContent=opt.text;
      div.addEventListener('click',()=>{
        $$('.choice',host).forEach(x=>x.classList.remove('correct','wrong')); div.classList.add(opt.ok?'correct':'wrong');
        const fb=$('#scenarioFb')||document.createElement('div');
        fb.id='scenarioFb'; fb.className='feedback '+(opt.ok?'ok':'no'); fb.textContent=opt.ok?'✅ Very good clarification question.':'❌ This is not the best professional clarification question.';
        if(opt.ok) Score.award(`scenario:${sc.key}`,2);
        host.appendChild(fb);
      });
      host.appendChild(div);
    });
    $('#btnSpeakScenario').onclick=()=>Speech.say(sc.transcript);
  }

  function renderRoleplay(){
    const rp=ROLEPLAYS.find(r=>r.key===$('#roleplaySelect').value) || ROLEPLAYS[0];
    $('#roleplayPrompt').textContent=rp.prompt;
    $('#roleplayModel').textContent=rp.model;
    $('#btnSpeakPrompt').onclick=()=>Speech.say(rp.prompt);
    $('#btnShowRoleModel').onclick=()=>$('#roleplayModel').classList.toggle('hidden');
    $('#btnCheckRoleplay').onclick=()=>{
      const txt=normalize($('#roleplayAnswer').value); const good=rp.keywords.filter(k=>txt.includes(normalize(k))).length;
      const fb=$('#roleplayFb'); fb.className='feedback '+(good>=2?'ok':'no');
      fb.textContent = good>=2 ? '✅ Good. Your answer includes important ideas.' : '❌ Add more key ideas: documents, family, details, or whether.';
      fb.classList.remove('hidden'); if(good>=2) Score.award(`role:${rp.key}`,3);
    };
  }

  function init(){
    $('#jsStatus').textContent='JS: ✅ loaded';
    setVoice('en-US');
    $('#voiceUS').addEventListener('click',()=>setVoice('en-US')); $('#voiceUK').addEventListener('click',()=>setVoice('en-GB'));
    $('#btnPause').addEventListener('click',()=>Speech.pause()); $('#btnResume').addEventListener('click',()=>Speech.resume()); $('#btnStop').addEventListener('click',()=>Speech.stop());
    $('#btnStart').addEventListener('click',()=>$('#main').scrollIntoView({behavior:'smooth'}));
    $('#btnListenIntro').addEventListener('click',()=>Speech.say('This lesson helps you clarify, confirm, and check passenger details professionally.'));
    $('#btnSpeakChecklist').addEventListener('click',()=>Speech.say('Who is the passenger? What is the request? What do you need to check?'));
    $('#btnSpeakDemoRule').addEventListener('click',()=>Speech.say('This and that for singular. These and those for plural.'));
    $('#btnSpeakWhetherRule').addEventListener('click',()=>Speech.say('Use whether to sound more professional when you check or confirm information.'));
    $('#btnListenVocabSet').addEventListener('click',()=>{
      const filter=$('#vocabFilter').value;
      const list=VOCAB.filter(v=>filter==='all'||v.cat===filter).slice(0,8).map(v=>`${v.word}. ${v.ex}`).join(' ');
      Speech.say(list);
    });
    $('#btnResetAll').addEventListener('click',()=>{Score.reset(); $$('textarea').forEach(t=>t.value=''); $$('select').forEach(s=>{if(!s.id.includes('voice')) s.selectedIndex=0}); $('.hidden') && $$('.feedback,.modelBox').forEach(x=>{if(x.id!=='roleplayModel' && x.id!=='scenarioTranscript' && x.id!=='writingModel') x.classList.add('hidden')}); renderVocab(); renderScenario(); renderRoleplay(); renderExercises();});
    $('#btnToggleTranscript').addEventListener('click',()=>$('#scenarioTranscript').classList.toggle('hidden'));
    $('#btnCheckWriting').addEventListener('click',()=>{
      const txt=normalize($('#writeClarification').value); const fb=$('#writingFb');
      const ok=txt.includes('if i understand correctly') && (txt.includes('whether') || txt.includes('would like'));
      fb.className='feedback '+(ok?'ok':'no'); fb.textContent=ok?'✅ Good start. Your sentence sounds like a professional clarification.':'❌ Add “If I understand correctly…” and try to use “whether” or “would like to”.'; fb.classList.remove('hidden'); if(ok) Score.award('writing',2);
    });
    $('#btnShowWritingModel').addEventListener('click',()=>$('#writingModel').classList.toggle('hidden'));

    SCENARIOS.forEach(sc=>$('#scenarioSelect').insertAdjacentHTML('beforeend',`<option value="${sc.key}">${sc.title}</option>`));
    $('#scenarioSelect').value=SCENARIOS[0].key; $('#scenarioSelect').addEventListener('change',renderScenario);
    ROLEPLAYS.forEach(rp=>$('#roleplaySelect').insertAdjacentHTML('beforeend',`<option value="${rp.key}">${rp.title}</option>`));
    $('#roleplaySelect').value=ROLEPLAYS[0].key; $('#roleplaySelect').addEventListener('change',renderRoleplay);
    $('#vocabFilter').addEventListener('change',renderVocab);

    renderVocab(); renderScenario(); renderRoleplay(); renderExercises();
    Score.setMax(24);
  }

  function renderExercises(){
    attachChoiceGroup($('#demoPractice'), MC_DEMO, 'demoMC', {
      title:(item,idx)=>item.q,
      options:item=>item.options,
      correct:(item,i,v)=>normalize(v)===normalize(item.a)
    });
    attachSelectFill($('#demoFill'), FILL_DEMO, 'demoFill');
    attachChoiceGroup($('#whetherPractice'), MC_WHETHER, 'whetherMC', {
      title:(item)=>item.q,
      options:item=>item.options,
      correct:(item,i,v)=>item.options.indexOf(v)===item.a
    });
    attachSelectFill($('#whetherFill'), FILL_WHETHER.map(x=>({...x,choices:['whether','that','these']})), 'whetherFill');
    attachChoiceGroup($('#pronounPractice'), PRONOUNS, 'pronouns', {
      title:(item)=>item.q,
      options:item=>item.options,
      correct:(item,i,v)=>normalize(v)===normalize(item.a)
    });
    attachChoiceGroup($('#questionPractice'), QUESTIONS, 'questions', {
      title:(item)=>`${item.q} — ${item.prompt}`,
      options:item=>item.options,
      correct:(item,i,v)=>item.options.indexOf(v)===item.a
    });
    attachSelectFill($('#mixedFill'), MIXED_FILL, 'mixed');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
