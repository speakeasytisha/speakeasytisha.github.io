(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const storeKey = 'edith_lesson2_progress_v1';
  let state = {answered:{}, score:0, possible:0, exam:null, speaking:0, writing:0, gradeDetails:{}, goals:[], evaluation:{}, writingText:''};
  try { state = {...state, ...(JSON.parse(localStorage.getItem(storeKey)) || {})}; } catch(e) {}

  const toast = (msg) => { const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); };
  const save = () => { state.writingText = $('#writingBox')?.value || ''; state.goals = $$('.goal-check').map(x=>x.checked); localStorage.setItem(storeKey, JSON.stringify(state)); updateReport(); };

  let accent = 'en-GB';
  const say = (text) => {
    if (!('speechSynthesis' in window)) return toast('Audio is not supported in this browser.');
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = accent; u.rate = Number($('#speechRate').value || .9);
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === accent) || voices.find(v => v.lang.startsWith(accent.slice(0,2)));
    if (preferred) u.voice = preferred;
    speechSynthesis.speak(u);
  };
  $$('.accent-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.accent-btn').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});
    btn.classList.add('active'); btn.setAttribute('aria-pressed','true'); accent=btn.dataset.accent;
  }));
  $('#frenchToggle').addEventListener('click', e => {
    const on = document.body.classList.toggle('show-fr'); e.currentTarget.setAttribute('aria-pressed', String(on));
  });
  document.addEventListener('click', e => {
    const b=e.target.closest('.speak-btn'); if(!b) return;
    const text=b.dataset.say || (b.id==='promptSpeak' ? $('#promptText').textContent : b.id==='scenarioSpeak' ? $('#scenarioLine').textContent : '');
    if(text) say(text);
  });
  $$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

  // Conversation prompts
  $$('.prompt-btn').forEach(b=>b.addEventListener('click',()=>{ $('#promptText').textContent=b.dataset.prompt; $('#promptBox').hidden=false; $('#promptBox').scrollIntoView({behavior:'smooth',block:'nearest'}); }));

  // Auto-scored page MCQs
  const pageMcqs = $$('.mcq');
  state.possible = pageMcqs.length;
  const answerMcq = (mcq, choice, id) => {
    if(state.answered[id]) return;
    const correct = choice===mcq.dataset.answer;
    state.answered[id] = {choice, correct};
    if(correct) state.score++;
    $$('button',mcq).forEach(btn=>{btn.disabled=true; if(btn.dataset.choice===mcq.dataset.answer) btn.classList.add('correct'); if(btn.dataset.choice===choice && !correct) btn.classList.add('wrong');});
    const fb=$('.feedback',mcq); fb.textContent=(correct?'✓ Correct. ':'✗ Not quite. ')+mcq.dataset.explain; fb.classList.add(correct?'ok':'no'); save();
  };
  pageMcqs.forEach((mcq,i)=>{
    const id='q'+i;
    $$('button[data-choice]',mcq).forEach(b=>b.addEventListener('click',()=>answerMcq(mcq,b.dataset.choice,id)));
    const prev=state.answered[id]; if(prev){
      $$('button',mcq).forEach(btn=>{btn.disabled=true;if(btn.dataset.choice===mcq.dataset.answer) btn.classList.add('correct');if(btn.dataset.choice===prev.choice&&!prev.correct) btn.classList.add('wrong');});
      const fb=$('.feedback',mcq);fb.textContent=(prev.correct?'✓ Correct. ':'✗ Not quite. ')+mcq.dataset.explain;fb.classList.add(prev.correct?'ok':'no');
    }
  });

  // transcripts/models
  $$('.transcript-toggle,.model-toggle').forEach(b=>b.addEventListener('click',()=>{const box=$('#'+b.dataset.target);box.hidden=!box.hidden;b.textContent=box.hidden?(b.classList.contains('transcript-toggle')?'Show transcript':'Show model'):(b.classList.contains('transcript-toggle')?'Hide transcript':'Hide model');}));

  // Vocabulary
  const vocab = {
    'Conversation & connection':[
      ['strike up a conversation','engager la conversation','to start talking to someone you do not know','It is easier to strike up a conversation when you ask an open question.'],
      ['get to know someone','apprendre à connaître quelqu’un','to gradually learn more about a person','Travelling in a small group gives you time to get to know people.'],
      ['have something in common','avoir quelque chose en commun','to share an interest, experience or characteristic','We discovered that we had a lot in common.'],
      ['keep in touch','rester en contact','to continue communicating after you separate','We exchanged numbers so we could keep in touch.'],
      ['easy-going','décontracté / facile à vivre','relaxed and pleasant to be with','Our guide was friendly and easy-going.'],
      ['curious','curieux / curieuse','interested in learning or discovering more','I am curious about how people live in other countries.'],
      ['make small talk','faire la conversation','to have light, friendly conversation','Making small talk at breakfast can lead to interesting conversations.']
    ],
    'Travel & logistics':[
      ['itinerary','itinéraire / programme','a planned route or list of travel activities','Our itinerary included Cairo, a cruise and the Red Sea.'],
      ['stopover','escale','a short stay between parts of a journey','We had a short stopover before our connecting flight.'],
      ['guided tour','visite guidée','a visit led by a guide who explains a place','A guided tour can make historical sites easier to understand.'],
      ['set off','partir / se mettre en route','to begin a journey','We set off early to avoid the heat.'],
      ['get around','se déplacer','to travel from place to place in an area','What is the easiest way to get around the city?'],
      ['check in','s’enregistrer','to register at a hotel or for a flight','We checked in at the hotel before dinner.'],
      ['be delayed','être retardé','to happen later than planned','Our transfer was delayed by forty minutes.']
    ],
    'Culture & sightseeing':[
      ['heritage','patrimoine','traditions, buildings and history passed down over time','The city has a rich cultural heritage.'],
      ['landmark','monument / lieu emblématique','a famous or easily recognised place','The pyramids are among the most famous landmarks in the world.'],
      ['exhibition','exposition','a public display of objects or works','The museum had an impressive exhibition on ancient Egypt.'],
      ['well-preserved','bien conservé','kept in good condition over time','The temple is remarkably well-preserved.'],
      ['breathtaking','à couper le souffle','extremely beautiful or impressive','The view over the desert was breathtaking.'],
      ['crowded','bondé','full of people','The site was crowded in the middle of the day.'],
      ['local customs','coutumes locales','traditional ways of behaving in a place','I like learning about local customs before I travel.']
    ],
    'Storytelling & reactions':[
      ['what struck me most','ce qui m’a le plus marquée','a phrase used to introduce your strongest impression','What struck me most was the contrast between old and new.'],
      ['turn out to be','s’avérer être','to be discovered to be a certain way','The day turned out to be much more interesting than I expected.'],
      ['at first','au début','at the beginning of a situation','At first, I was not sure about travelling with a group.'],
      ['in the end','finalement','after everything has been considered or happened','In the end, I was happy with my choice.'],
      ['although','bien que / même si','used to introduce a contrast','Although the day was long, I really enjoyed it.'],
      ['however','cependant','used to introduce an opposing or contrasting idea','The hotel was comfortable. However, it was far from the centre.'],
      ['surprisingly','étonnamment','in a way that you did not expect','Surprisingly, the group trip suited me very well.']
    ],
    'Opinions & preferences':[
      ['worth visiting','qui vaut la peine d’être visité','good or interesting enough to justify the visit','The museum is definitely worth visiting.'],
      ['prefer to','préférer','to like one choice more than another','I prefer to talk to local people when I travel.'],
      ['be impressed by','être impressionné(e) par','to strongly admire or notice something','I was impressed by the size of the site.'],
      ['appeal to me','me plaire / m’attirer','to be attractive or interesting to me','Small group travel appeals to me more than large tours.'],
      ['memorable','mémorable','worth remembering because it was special','It was one of the most memorable parts of the trip.'],
      ['overrated','surcoté','considered better than it really is','Some famous attractions can feel overrated.'],
      ['a good balance','un bon équilibre','a useful mix of two different things','I like a good balance between organised visits and free time.']
    ],
    'Practical problem-solving':[
      ['clarify','clarifier','to make information clearer','Could you clarify what time the bus leaves?'],
      ['double-check','revérifier','to check something again to make sure it is correct','I would like to double-check the meeting point.'],
      ['sort something out','régler quelque chose','to solve a practical problem','The receptionist helped us sort out the booking problem.'],
      ['be fully booked','être complet','to have no rooms, seats or places available','The hotel was fully booked for the weekend.'],
      ['alternative','solution de remplacement','another possible choice','Is there an alternative if the tour is cancelled?'],
      ['refund','remboursement','money returned after a cancellation or problem','They offered a refund because the excursion was cancelled.'],
      ['make a complaint','faire une réclamation','to formally say that you are unhappy with a service','I would only make a complaint if the problem was serious.']
    ]
  };
  const cat=$('#vocabCategory'); Object.keys(vocab).forEach(k=>cat.add(new Option(k,k)));
  const renderVocab=(category)=>{ $('#vocabGrid').innerHTML=vocab[category].map(([w,fr,def,ex])=>`<article class="vocab-card"><div class="vocab-word"><div><h3>${w}</h3><div class="vocab-fr">${fr}</div></div><div class="audio-pair"><button type="button" data-audio="${encodeURIComponent(w)}" title="Listen to word">🔊 Word</button><button type="button" data-audio="${encodeURIComponent(ex)}" title="Listen to example">🎧 Example</button></div></div><p class="vocab-def">${def}</p><p class="vocab-example">${ex}</p></article>`).join(''); };
  renderVocab(cat.value); cat.addEventListener('change',()=>renderVocab(cat.value));
  $('#vocabGrid').addEventListener('click',e=>{const b=e.target.closest('[data-audio]');if(b)say(decodeURIComponent(b.dataset.audio));});
  $('#vocabRandom').addEventListener('click',()=>{const cats=Object.keys(vocab),c=cats[Math.floor(Math.random()*cats.length)];cat.value=c;renderVocab(c);const cards=$$('.vocab-card');const card=cards[Math.floor(Math.random()*cards.length)];card.scrollIntoView({behavior:'smooth',block:'center'});card.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:700});});

  // Conversation scenarios
  const scenarios=[
    '“I’m here for the first time. Yesterday I visited the old city, but I got completely lost.”',
    '“I usually travel independently, but this time I decided to join a group.”',
    '“The museum was fascinating, although I think I needed more time there.”',
    '“My flight was delayed for five hours, so I arrived in the middle of the night.”',
    '“I’ve been travelling for three weeks and I’m starting to miss home.”',
    '“I almost cancelled this trip, but now I’m very glad I came.”'
  ];
  $('#newScenario').addEventListener('click',()=>{$('#scenarioLine').textContent=scenarios[Math.floor(Math.random()*scenarios.length)];$('#builtResponse').textContent='Your response will appear here.';});
  $('#buildResponse').addEventListener('click',()=>{$('#builtResponse').textContent=$('#reactionPick').value+' '+$('#questionPick').value;});

  // Bright-style mini sprint
  const examItems=[
    {type:'written',sec:45,q:'Choose the most natural sentence.',choices:['I have visited Egypt last year.','I visited Egypt last year.','I have been visit Egypt last year.'],a:1},
    {type:'written',sec:45,q:'Complete: “We stayed ___ the hotel for three nights.”',choices:['at','to','on'],a:0},
    {type:'written',sec:45,q:'Choose the correct connector: “The tour was expensive. ___, it was extremely well organised.”',choices:['However','Because','Therefore'],a:0},
    {type:'written',sec:45,q:'Choose the correct form: “France and ___ countries attract many international visitors.”',choices:['others','other','another'],a:1},
    {type:'listening',sec:60,audio:'The guide asked us to meet beside the main entrance at a quarter to nine, ten minutes earlier than originally planned.',q:'When should the group meet?',choices:['8:45','8:50','9:15'],a:0},
    {type:'listening',sec:60,audio:'I wanted to book the morning excursion, but it was fully booked, so I chose the afternoon departure instead.',q:'Why did the speaker choose the afternoon?',choices:['It was cheaper.','The morning was full.','The guide recommended it.'],a:1},
    {type:'listening',sec:60,audio:'Breakfast is included in the room price, but drinks from the minibar are charged separately.',q:'What costs extra?',choices:['Breakfast','The room','Minibar drinks'],a:2},
    {type:'written',sec:45,q:'Choose the most natural phrase.',choices:['What struck me most was the architecture.','What touched me the more was the architecture.','What was striking me more is the architecture.'],a:0}
  ];
  let exam={idx:-1,score:0,remaining:45,timer:null,done:false};
  const resetTimer=()=>{clearInterval(exam.timer);$('#examTimer').textContent=exam.remaining;exam.timer=setInterval(()=>{exam.remaining--;$('#examTimer').textContent=exam.remaining;if(exam.remaining<=0){clearInterval(exam.timer);advanceExam(null);}},1000);};
  const renderExam=()=>{
    const item=examItems[exam.idx]; $('#examProgress').textContent=`${exam.idx+1} / ${examItems.length}`; exam.remaining=item.sec; resetTimer();
    $('#examQuestion').hidden=false; $('#examIntro').hidden=true; $('#examResult').hidden=true;
    $('#examQuestion').innerHTML=`<p class="tag">${item.type==='listening'?'LISTENING':'WRITTEN'} QUESTION</p>${item.type==='listening'?'<button type="button" class="exam-listen">▶ Play audio</button>':''}<h3>${item.q}</h3><div>${item.choices.map((c,i)=>`<button type="button" class="exam-choice" data-i="${i}">${c}</button>`).join('')}</div>`;
    const listen=$('.exam-listen'); if(listen) listen.addEventListener('click',()=>say(item.audio));
    $$('.exam-choice',$('#examQuestion')).forEach(b=>b.addEventListener('click',()=>advanceExam(Number(b.dataset.i))));
  };
  const advanceExam=(choice)=>{
    clearInterval(exam.timer); const item=examItems[exam.idx]; if(choice===item.a) exam.score++;
    exam.idx++; if(exam.idx>=examItems.length){exam.done=true; state.exam={score:exam.score,total:examItems.length,date:new Date().toISOString()}; save(); $('#examQuestion').hidden=true;$('#examResult').hidden=false;$('#examResult').innerHTML=`<p>Mini sprint complete</p><strong>${exam.score}/${examItems.length}</strong><p>${exam.score>=6?'Good precision. Keep working on speed and listening detail.':'Useful diagnostic: review the errors, then repeat the sprint another day.'}</p><button type="button" class="btn primary" id="retryExam">Try again</button>`;$('#examProgress').textContent=`${examItems.length} / ${examItems.length}`;$('#examTimer').textContent='—';$('#retryExam').addEventListener('click',startExam);return;} renderExam();
  };
  const startExam=()=>{exam={idx:0,score:0,remaining:45,timer:null,done:false};renderExam();};
  $('#startExam').addEventListener('click',startExam);

  // Writing
  const countWords=t=>t.trim()?t.trim().split(/\s+/).length:0;
  $('#writingBox').value=state.writingText||''; $('#wordCount').textContent=countWords($('#writingBox').value);
  $('#writingBox').addEventListener('input',()=>{$('#wordCount').textContent=countWords($('#writingBox').value);save();});
  $('#clearWriting').addEventListener('click',()=>{$('#writingBox').value='';$('#wordCount').textContent='0';save();});

  // Trainer grades
  $$('.trainer-grade').forEach(group=>{
    const key=group.dataset.grade;
    const inputs=$$('input',group);
    const saved=state.gradeDetails?.[key] || {};
    inputs.forEach(i=>{ if(saved[i.dataset.criterion] !== undefined) i.value=saved[i.dataset.criterion]; });
    const recalc=(persist=true)=>{
      const detail={};
      const total=inputs.reduce((sum,i)=>{const v=Math.max(0,Math.min(5,Number(i.value)||0));detail[i.dataset.criterion]=v;return sum+v;},0);
      $('.grade-total',group).textContent=total; state[key]=total; state.gradeDetails=state.gradeDetails||{}; state.gradeDetails[key]=detail;
      if(persist) save();
    };
    inputs.forEach(i=>i.addEventListener('input',()=>recalc(true)));
    recalc(false);
  });

  // Recording
  let recorder=null,chunks=[];
  $('#recordStart').addEventListener('click',async()=>{
    if(!navigator.mediaDevices?.getUserMedia) return toast('Recording is not supported in this browser.');
    try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});const url=URL.createObjectURL(blob);const a=$('#recordDownload');a.href=url;a.download='speaking-practice.webm';a.hidden=false;stream.getTracks().forEach(t=>t.stop());$('#recordStatus').textContent='Recording ready. You can download it or record again.';};recorder.start();$('#recordStart').disabled=true;$('#recordStop').disabled=false;$('#recordStatus').textContent='Recording…';}catch(e){toast('Microphone permission was not granted.');}
  });
  $('#recordStop').addEventListener('click',()=>{if(recorder&&recorder.state==='recording'){recorder.stop();$('#recordStart').disabled=false;$('#recordStop').disabled=true;}});

  // Evaluation
  $('#saveEvaluation').addEventListener('click',()=>{const obj={};$$('.eval-input').forEach(x=>obj[x.dataset.eval]=x.value);obj.comment=$('#evalComment').value;state.evaluation=obj;save();$('#evalSaved').textContent='✓ Saved on this device';});
  if(state.evaluation){$$('.eval-input').forEach(x=>{if(state.evaluation[x.dataset.eval])x.value=state.evaluation[x.dataset.eval]});$('#evalComment').value=state.evaluation.comment||'';}
  $$('.goal-check').forEach((x,i)=>{x.checked=!!state.goals?.[i];x.addEventListener('change',save)});

  const updateReport=()=>{
    $('#scoreNow').textContent=state.score; $('#scoreMax').textContent=state.possible; const pct=state.possible?Math.round(state.score/state.possible*100):0;$('#scorePct').textContent=pct+'%';$('#reportScore').textContent=pct+'%';$('#reportExam').textContent=state.exam?`${state.exam.score}/${state.exam.total}`:'—';$('#reportSpeaking').textContent=(state.speaking||0)+'/20';$('#reportWriting').textContent=(state.writing||0)+'/20';
  };
  updateReport();

  $('#downloadResults').addEventListener('click',()=>{
    const pct=state.possible?Math.round(state.score/state.possible*100):0;
    const lines=[
      'SpeakEasyTisha · Lesson 2 · Progress report',
      `Date: ${new Date().toLocaleDateString('fr-FR')}`,
      `Interactive score: ${state.score}/${state.possible} (${pct}%)`,
      `Bright-style sprint: ${state.exam?state.exam.score+'/'+state.exam.total:'not completed'}`,
      `Speaking trainer grade: ${state.speaking||0}/20`,
      `Writing trainer grade: ${state.writing||0}/20`,
      '', 'Learning goals:', ...$$('.goal-check').map((x,i)=>`${x.checked?'[x]':'[ ]'} ${x.parentElement.textContent.trim()}`),
      '', 'End-of-lesson evaluation:', JSON.stringify(state.evaluation||{},null,2),
      '', 'Writing:', $('#writingBox').value || '(not completed)'
    ];
    const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Lesson_2_progress.txt';a.click();URL.revokeObjectURL(a.href);
  });
  $('#printPage').addEventListener('click',()=>window.print());
  $('#resetAll').addEventListener('click',()=>{if(!confirm('Reset all lesson answers, scores and saved progress?'))return;localStorage.removeItem(storeKey);location.reload();});

  // Save on exit
  window.addEventListener('beforeunload',save);
})();
