(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const shuffle = arr => arr.map(v=>({v,r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v);
  const STORAGE='bernardiniLesson1.';
  const scored = new Map();

  const quizzes = {
    past:[
      {q:'About ten years ago, I ___ to Vanuatu.', choices:['went','go','have gone'], a:'went', why:'Finished past time → past simple: go → went.'},
      {q:'I ___ one year there.', choices:['spent','spend','spending'], a:'spent', why:'A finished duration in the past → spent.'},
      {q:'The people ___ very friendly.', choices:['were','was','is'], a:'were', why:'People is plural → were.'},
      {q:'It ___ a special experience.', choices:['was','were','is'], a:'was', why:'It → was in the past.'}
    ],
    natural:[
      {q:'Which sentence sounds most natural for the purpose of a trip?', choices:['I went there to work.','I went there for working.','I go there for work ten years ago.'], a:'I went there to work.', why:'To express purpose, use “to + base verb”: to work.'},
      {q:'Which sentence keeps the story clearly in the past?', choices:['They had very little money, but they were very happy.','They have very little money, but they was happy.','They has no money but they are happy.'], a:'They had very little money, but they were very happy.', why:'A past story needs consistent past forms: had / were.'}
    ],
    connectors:[
      {q:'I remember the trip very well ___ it changed my perspective.', choices:['because','but','after'], a:'because', why:'because gives the reason.'},
      {q:'The island was beautiful, ___ life was difficult for many people.', choices:['but','so','because'], a:'but', why:'but introduces a contrast.'},
      {q:'I finished work, and ___ that I went for a walk.', choices:['after','although','because'], a:'after', why:'after that shows sequence.'}
    ]
  };

  function setScore(id, ok){
    if(!scored.has(id)) scored.set(id, ok ? 1 : 0); else scored.set(id, ok ? 1 : 0);
    updateScore();
  }
  function updateScore(){
    const points=[...scored.values()].reduce((a,b)=>a+b,0); const total=scored.size;
    $('#scoreValue').textContent=`${points} / ${total}`;
  }

  function renderQuiz(el, items, quizName){
    el.innerHTML='';
    items.forEach((item, idx)=>{
      const card=document.createElement('div'); card.className='quiz-card';
      const p=document.createElement('p'); p.textContent=`${idx+1}. ${item.q}`; card.appendChild(p);
      const options=document.createElement('div'); options.className='quiz-options';
      shuffle(item.choices).forEach(choice=>{
        const b=document.createElement('button'); b.type='button'; b.textContent=choice;
        b.addEventListener('click',()=>{
          $$('.quiz-options button',card).forEach(x=>x.classList.remove('correct','wrong'));
          const ok=choice===item.a; b.classList.add(ok?'correct':'wrong');
          const fb=$('.feedback',card); fb.className=`feedback ${ok?'good':'bad'}`;
          fb.textContent=ok ? `✓ Correct. ${item.why}` : `Not quite. Try again — hint: ${item.why}`;
          setScore(`${quizName}-${idx}`,ok);
        }); options.appendChild(b);
      });
      card.appendChild(options); const fb=document.createElement('p');fb.className='feedback';card.appendChild(fb);el.appendChild(card);
    });
  }

  Object.entries(quizzes).forEach(([name,items])=>{ const el=$(`[data-quiz="${name}"]`); if(el) renderQuiz(el,items,name); });

  // French support
  $('#frToggle').addEventListener('click',()=>{
    document.body.classList.toggle('fr-off');
    const off=document.body.classList.contains('fr-off');
    $('#frToggle').textContent=`FR support · ${off?'OFF':'ON'}`; $('#frToggle').setAttribute('aria-pressed', String(!off));
  });

  // Speech synthesis
  let accent='GB';
  $('#accentToggle').addEventListener('click',()=>{
    accent=accent==='GB'?'US':'GB';
    $('#accentToggle').dataset.accent=accent; $('#accentToggle').textContent=`🔊 Voice · ${accent==='GB'?'UK':'US'}`;
  });
  function speak(text){
    if(!('speechSynthesis' in window)) return alert('Speech synthesis is not supported in this browser.');
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang=accent==='GB'?'en-GB':'en-US'; u.rate=.92;
    const voices=speechSynthesis.getVoices();
    const preferred=voices.find(v=>v.lang.toLowerCase()===u.lang.toLowerCase()) || voices.find(v=>v.lang.toLowerCase().startsWith(accent==='GB'?'en-gb':'en-us'));
    if(preferred)u.voice=preferred; speechSynthesis.speak(u);
  }
  $$('.speak').forEach(btn=>btn.addEventListener('click',()=>speak(btn.dataset.speak||'')));

  // Timers
  $$('.timer').forEach((box, n)=>{
    const initial=Number(box.dataset.seconds||30); let remaining=initial, handle=null;
    const label=$('strong',box); const start=$('.timer-start',box), reset=$('.timer-reset',box);
    const paint=()=>{label.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`}; paint();
    start.addEventListener('click',()=>{
      if(handle){clearInterval(handle);handle=null;start.textContent='Start';return;}
      start.textContent='Pause'; handle=setInterval(()=>{ remaining--; paint(); if(remaining<=0){clearInterval(handle);handle=null;start.textContent='Start';speak('Time. Finish your sentence.');}},1000);
    });
    reset.addEventListener('click',()=>{if(handle)clearInterval(handle);handle=null;remaining=initial;paint();start.textContent= box.classList.contains('large-timer')?'Start 2-minute mission':'Start';});
  });

  // Instant select
  $$('.instant-select').forEach((sel,idx)=>sel.addEventListener('change',()=>{
    const fb=sel.parentElement.querySelector('.inline-feedback'); const ok=sel.value===sel.dataset.answer;
    sel.classList.toggle('correct',ok); sel.classList.toggle('wrong',!!sel.value&&!ok);
    fb.textContent=!sel.value?'':ok?'✓ Correct':'Try again'; fb.style.color=ok?'#2f7b61':'#a94a49';
    if(sel.value)setScore(`prep-${idx}`,ok);
  }));

  // Word ordering
  $$('.order-exercise').forEach((ex,idx)=>{
    const bank=$('.word-bank',ex), target=$('.order-answer',ex), words=shuffle(bank.dataset.words.split('|'));
    const init=()=>{bank.innerHTML='';target.innerHTML='';shuffle(words).forEach(word=>makeChip(word,bank));$('.feedback',ex).textContent='';};
    const makeChip=(word,parent)=>{const b=document.createElement('button');b.type='button';b.className='word-chip';b.textContent=word;b.addEventListener('click',()=>{(b.parentElement===bank?target:bank).appendChild(b);check();});parent.appendChild(b)};
    const check=()=>{if(target.children.length===words.length){const answer=[...target.children].map(x=>x.textContent).join(' ');const ok=answer===ex.dataset.answer;const fb=$('.feedback',ex);fb.className=`feedback ${ok?'good':'bad'}`;fb.textContent=ok?'✓ Perfect sentence.':'Not yet — move a word and try again.';setScore(`order-${idx}`,ok);}};
    $('.order-reset',ex).addEventListener('click',init);init();
  });

  // Connector examples
  const connectorExamples={
    because:'It was a special experience <strong>because</strong> I discovered a very different way of life.',
    but:'Many people had very little money, <strong>but</strong> they were very welcoming.',
    so:'I wanted to understand the culture, <strong>so</strong> I tried to speak with local people.',
    when:'I learned a lot <strong>when</strong> I lived there.',
    although:'<strong>Although</strong> life could be difficult, the people were extremely friendly.',
    after:'<strong>After</strong> work, I often explored the island with my family.'
  };
  $$('.connector-cards button').forEach(b=>b.addEventListener('click',()=>{
    $$('.connector-cards button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    $('#connectorDemo').innerHTML=`<p>${connectorExamples[b.dataset.word]}</p>`;
  }));

  // Listening choices
  $$('.listening-q').forEach((q,idx)=>{
    $$('.option-row button',q).forEach(b=>b.addEventListener('click',()=>{
      $$('.option-row button',q).forEach(x=>x.classList.remove('correct','wrong'));
      const ok=b.textContent.trim()===q.dataset.answer; b.classList.add(ok?'correct':'wrong');
      const fb=$('.feedback',q); fb.className=`feedback ${ok?'good':'bad'}`;
      fb.textContent=ok?'✓ Yes — that is the exact detail.':'Not quite. Listen again for the exact wording.';setScore(`listen-${idx}`,ok);
    }));
  });

  // Tabs
  $$('.ladder-tab').forEach(tab=>tab.addEventListener('click',()=>{
    $$('.ladder-tab').forEach(t=>t.classList.remove('active'));$$('.ladder-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');$('#'+tab.dataset.target).classList.add('active');
  }));

  // Persistence
  $$('[data-save]').forEach(el=>{
    const key=STORAGE+el.dataset.save; const old=localStorage.getItem(key); if(old!==null)el.value=old;
    ['input','change'].forEach(evt=>el.addEventListener(evt,()=>localStorage.setItem(key,el.value)));
  });

  // Writing coach
  const story=$('#storyText');
  const pastWords=['went','spent','was','were','had','worked','stayed','visited','saw','felt','lived','learned','travelled','traveled','arrived','left','met','became','did'];
  const conns=['because','but','so','when','after','although','however'];
  const analyseWriting=()=>{
    const text=story.value.trim(); const words=text?text.split(/\s+/).filter(Boolean):[]; const low=` ${text.toLowerCase()} `;
    const past=pastWords.reduce((n,w)=>n+(low.match(new RegExp(`\\b${w}\\b`,'g'))||[]).length,0);
    const connectors=conns.reduce((n,w)=>n+(low.match(new RegExp(`\\b${w}\\b`,'g'))||[]).length,0);
    const sentences=(text.match(/[.!?]+(?=\s|$)/g)||[]).length;
    const prep=/\b(to|in|at)\b/i.test(text);
    $('#wordCount').textContent=`${words.length} words`;$('#pastCount').textContent=`${past} past-tense signals`;$('#connectorCount').textContent=`${connectors} connectors`;
    const states={length:sentences>=6,past:past>=3,connectors:connectors>=2,prep};
    Object.entries(states).forEach(([k,v])=>{const el=$(`[data-check="${k}"]`);el.classList.toggle('done',v);el.textContent=(v?'✓':'○')+el.textContent.slice(1)});
  };
  story.addEventListener('input',analyseWriting);analyseWriting();
  $('#copyStory').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(story.value);$('#copyStory').textContent='Copied ✓';setTimeout(()=>$('#copyStory').textContent='Copy my text',1400);}catch(e){}});

  // Ranges
  function bindRange(id,out){const r=$(id),o=$(out);const p=()=>o.value=o.textContent=`${r.value} / 5`;r.addEventListener('input',p);p();}
  bindRange('#confidenceRange','#confidenceOut');bindRange('#understandingRange','#understandingOut');

  // Reports
  function reportText(){
    const get=k=>{const e=$(`[data-save="${k}"]`);return e?e.value:''};
    return `FRANÇOISE BERNARDINI — LESSON 1 SNAPSHOT\n\nInitial profile: B1.1- (51/100)\nTarget after 19h: B1.1+ (56/100)\n\nLearner reflection\n- Speaking confidence: ${$('#confidenceRange').value}/5\n- Lesson understanding: ${$('#understandingRange').value}/5\n- Priority: ${get('priority')}\n- Personal goal: ${get('goal')}\n\nTrainer confirmation\n- Spontaneous speaking: ${get('teacher-speaking')}\n- Past simple stability: ${get('teacher-past')}\n- Prepositions: ${get('teacher-prep')}\n- Listening for details: ${get('teacher-listen')}\n- Comments: ${get('teacher-comments')}\n\nPractice score: ${$('#scoreValue').textContent}\n`;
  }
  $('#copyReport').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(reportText());$('#copyReport').textContent='Copied ✓';setTimeout(()=>$('#copyReport').textContent='Copy lesson snapshot',1400);}catch(e){}});
  $('#downloadReport').addEventListener('click',()=>{const blob=new Blob([reportText()],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Francoise-Bernardini-Lesson-1-Snapshot.txt';a.click();URL.revokeObjectURL(a.href)});

  $('#printBtn').addEventListener('click',()=>window.print());
  $('#resetLesson').addEventListener('click',()=>{
    if(!confirm('Reset practice score and saved lesson answers?'))return;
    Object.keys(localStorage).filter(k=>k.startsWith(STORAGE)).forEach(k=>localStorage.removeItem(k));location.reload();
  });
})();
