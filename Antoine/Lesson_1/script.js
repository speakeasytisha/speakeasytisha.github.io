(() => {
  const KEY = 'antoine_lesson_1_v1';
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e) { state = {}; }
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const toast = msg => { const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1800); };
  const save = () => { localStorage.setItem(KEY, JSON.stringify(state)); updateProgress(); };

  // Generic persistence
  $$('[data-save]').forEach(el => {
    const k=el.dataset.save;
    if(state[k] !== undefined){ if(el.type==='checkbox') el.checked=!!state[k]; else el.value=state[k]; }
    const sync=()=>{ state[k]=el.type==='checkbox'?el.checked:el.value; if(el.type==='range' && el.nextElementSibling?.tagName==='OUTPUT') el.nextElementSibling.value=el.value; save(); };
    el.addEventListener(el.type==='range'?'input':'change',sync); if(el.tagName==='TEXTAREA'||el.tagName==='INPUT'&&el.type==='text') el.addEventListener('input',sync);
    if(el.type==='range' && el.nextElementSibling?.tagName==='OUTPUT') el.nextElementSibling.value=el.value;
  });

  // Roadmap jump
  $('#openRoadmap')?.addEventListener('click',()=>$('#roadmap').scrollIntoView({behavior:'smooth'}));

  // Speech
  let voices=[];
  const loadVoices=()=>{ if('speechSynthesis' in window) voices=window.speechSynthesis.getVoices(); };
  if('speechSynthesis' in window){ loadVoices(); window.speechSynthesis.onvoiceschanged=loadVoices; }
  const speak=(text, rate=.93)=>{
    if(!('speechSynthesis' in window)) return toast('Speech is not supported on this device.');
    window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); const pref=$('#voiceAccent')?.value || 'en-AU';
    u.lang=pref; const exact=voices.find(v=>v.lang===pref); const close=voices.find(v=>v.lang?.startsWith(pref.slice(0,2))); if(exact||close)u.voice=exact||close; u.rate=rate; speechSynthesis.speak(u);
  };
  $$('.speak-btn').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak||b.textContent)));
  $('#stopSpeech')?.addEventListener('click',()=>{ if('speechSynthesis' in window) window.speechSynthesis.cancel(); });
  // Global language tools
  const accentSelect=$('#voiceAccent');
  $$('.accent-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const accent=btn.dataset.accent; if(accentSelect) accentSelect.value=accent;
    $$('.accent-btn').forEach(x=>x.classList.toggle('active',x===btn));
    state.voiceAccent=accent; localStorage.setItem(KEY,JSON.stringify(state));
    toast(`${btn.textContent.trim()} voice selected.`);
  }));
  if(state.voiceAccent && accentSelect){
    accentSelect.value=state.voiceAccent;
    $$('.accent-btn').forEach(x=>x.classList.toggle('active',x.dataset.accent===state.voiceAccent));
  }
  const frenchBtn=$('#frenchHelp');
  const applyFrenchHelp=()=>{
    const on=!!state.frenchHelp; document.body.classList.toggle('fr-help-on',on);
    frenchBtn?.classList.toggle('active',on); frenchBtn?.setAttribute('aria-pressed',String(on));
    if(frenchBtn) frenchBtn.textContent=on?'FR · Aide française ON':'FR · French help';
  };
  frenchBtn?.addEventListener('click',()=>{state.frenchHelp=!state.frenchHelp;localStorage.setItem(KEY,JSON.stringify(state));applyFrenchHelp();});
  applyFrenchHelp();

  // Intro builder
  const introEls=['introOpening','introTravel','introDetail','introAustralia','introEnglish'];
  const buildIntro=()=>{
    const detail=$('#introDetail').value.trim();
    const parts=[$('#introOpening').value,$('#introTravel').value];
    if(detail)parts.push(detail.endsWith('.')?detail:detail+'.'); parts.push($('#introAustralia').value,$('#introEnglish').value);
    $('#introPreview').textContent=parts.join(' '); state.introBuilder=Object.fromEntries(introEls.map(id=>[id,$('#'+id).value])); localStorage.setItem(KEY, JSON.stringify(state));
  };
  if(state.introBuilder) introEls.forEach(id=>{ if(state.introBuilder[id]!==undefined) $('#'+id).value=state.introBuilder[id]; });
  introEls.forEach(id=>$('#'+id).addEventListener('input',buildIntro)); buildIntro();
  $('#listenIntro').addEventListener('click',()=>speak($('#introPreview').textContent,.9));

  // Timers
  $$('[data-timer]').forEach(btn=>btn.addEventListener('click',()=>{
    const display=btn.parentElement.querySelector('.timer-display'); let left=Number(btn.dataset.timer); const total=left;
    if(btn._interval){clearInterval(btn._interval);btn._interval=null;btn.textContent=`Start ${total>=120?'2 min':'90 sec'}`;left=total;display.textContent=formatTime(left);return;}
    btn.textContent='Stop timer'; display.textContent=formatTime(left);
    btn._interval=setInterval(()=>{left--;display.textContent=formatTime(left);if(left<=0){clearInterval(btn._interval);btn._interval=null;btn.textContent='Start again';toast('Time. Finish your sentence naturally.');}},1000);
  }));
  function formatTime(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}

  // Mode
  let mode=state.mode||'guided';
  const applyMode=()=>{ document.body.classList.toggle('guided',mode==='guided'); $$('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode)); };
  $$('.mode').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;state.mode=mode;save();applyMode();})); applyMode();

  const shuffle=a=>a.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  const grammar=[
    {q:'Last year, we ___ around Thailand for three weeks.',a:'travelled',opts:['travelled','travel','have travelled','were travel'],hint:'The trip is finished and the time is finished: last year.',why:'Use the past simple for a completed event at a finished time.',fr:'Utilisez le prétérit pour une action terminée à un moment terminé.'},
    {q:'He ___ where the station is.',a:"doesn’t know",opts:["doesn’t know","don’t know","isn’t know","not knows"],hint:'Third-person singular needs does + base verb in the negative.',why:'He doesn’t + base verb.',fr:'À la 3e personne : he doesn’t + base verbale.'},
    {q:'Why ___ you choose Australia?',a:'did',opts:['did','do','have','were'],hint:'A finished decision in the past uses did + subject + base verb.',why:'Question structure: Why did you choose…?',fr:'Question au passé : Why + did + sujet + base verbale.'},
    {q:'I’ve been to Thailand twice, but I ___ there for the first time in 2024.',a:'went',opts:['went','have gone','go','was going'],hint:'2024 is a finished past time.',why:'Present perfect gives the life experience; past simple gives the dated event.',fr:'Present perfect pour l’expérience ; prétérit pour l’événement daté.'},
    {q:'It’s ___ science-fiction film.',a:'a',opts:['a','the','an','—'],hint:'Singular countable nouns normally need a determiner.',why:'Science begins with a consonant sound, so use a.',fr:'Movie est un nom dénombrable singulier : il faut un déterminant.'},
    {q:'We ___ our accommodation yet.',a:"haven’t booked",opts:["haven’t booked","didn’t book","don’t booked","aren’t booking"],hint:'Yet often connects an unfinished situation to the present.',why:'Use present perfect for something expected but not completed up to now.',fr:'Avec yet, le present perfect relie la situation au présent.'},
    {q:'If I found an interesting job in Perth, I ___ it.',a:'would consider',opts:['would consider','will considered','considered','am considering'],hint:'This is a hypothetical future possibility.',why:'Second conditional: if + past simple, would + base verb.',fr:'Hypothèse : if + prétérit, would + base verbale.'},
    {q:'We’re planning ___ Australia for an extended period.',a:'to travel around',opts:['to travel around','travelling around to','travel around in','to travelling around'],hint:'Plan is followed by to + infinitive.',why:'plan to do something; travel around a country.',fr:'Plan est suivi de to + infinitif ; travel around = voyager à travers.'}
  ];
  function renderQuiz(items, rootId, stateKey){
    const root=$(rootId); if(!root) return; root.innerHTML='';
    items.forEach((it,i)=>{
      const chosen=state[stateKey]?.[i]||''; const card=document.createElement('div');card.className='quiz-card';
      card.innerHTML=`<div class="qnum">QUESTION ${i+1}</div><h4>${it.q}</h4><div class="options"></div><div class="hint">Hint: ${it.hint}</div><div class="feedback"></div>`;
      const opts=shuffle(it.opts); const box=card.querySelector('.options');
      opts.forEach(op=>{ const b=document.createElement('button'); b.className='option'; b.textContent=op; if(chosen===op)b.classList.add('selected'); b.onclick=()=>{
        state[stateKey]=state[stateKey]||{}; state[stateKey][i]=op; [...box.children].forEach(x=>x.classList.remove('selected','correct','wrong')); b.classList.add('selected');
        const ok=op===it.a; b.classList.add(ok?'correct':'wrong'); const f=card.querySelector('.feedback'); f.textContent=(ok?'✓ ':'Try again. ')+it.why+(state.frenchHelp?' · Aide FR : '+(it.fr||'Repérez la structure grammaticale et reformulez la phrase à voix haute.'):''); f.className='feedback '+(ok?'good':'bad'); save(); updateScores();
      }; box.appendChild(b); });
      if(chosen){ setTimeout(()=>{ const b=[...box.children].find(x=>x.textContent===chosen); if(b)b.click(); },0); }
      root.appendChild(card);
    });
  }
  renderQuiz(grammar,'#grammarQuiz','grammar');

  const natural=[
    {q:'You are describing movement inside a country. Which is most natural?',a:'We travelled all around Thailand.',opts:['We travelled all around Thailand.','We moved in all the Thailand country.','We moved around in the Thailand.'],hint:'Travel around + country is a very common collocation.',why:'“Travel around Thailand” is concise and idiomatic.'},
    {q:'You want to describe a change in travel style. Which sounds most natural?',a:'We decided to travel as backpackers.',opts:['We decided to travel as backpackers.','We took adopt the backpacker style.','We made the backpacker travel.'],hint:'decide to + verb is a reliable structure.',why:'“Travel as backpackers” is the natural phrasing.'},
    {q:'You want to ask for someone’s opinion. Which is the direct question?',a:'What do you think about it?',opts:['What do you think about it?','What you think about it?','What are you think about it?'],hint:'Present simple questions need do/does.',why:'Wh-word + do + subject + base verb.'},
    {q:'Which ending develops an opinion best?',a:'I particularly liked the story because it kept changing my expectations.',opts:['I particularly liked the story because it kept changing my expectations.','The story.','Because story was good.'],hint:'A B2 answer develops the idea and gives a reason.',why:'It completes the thought with specific support.'}
  ];
  renderQuiz(natural,'#naturalQuiz','natural');

  // Word order
  const orders=[
    ['What','are','you','most','looking','forward','to','in','Australia','?'],
    ['How','long','are','you','planning','to','stay','?'],
    ['Have','you','ever','worked','abroad','before','?'],
    ['What','would','you','do','if','your','plans','changed','?']
  ];
  function renderOrders(){
    const root=$('#wordOrder'); if(!root) return; root.innerHTML='';
    orders.forEach((ans,i)=>{
      const card=document.createElement('div');card.className='order-card'; const saved=state.orders?.[i]||[];
      const remaining=shuffle(ans.map((t,j)=>({t,id:j})).filter(x=>!saved.includes(x.id)));
      card.innerHTML=`<div class="qnum">QUESTION ${i+1}</div><div class="token-zone"></div><div class="answer-zone"></div><div class="order-actions"><button class="check-order">Check</button><button class="reset-order">Reset</button></div><div class="feedback"></div>`;
      const source=card.querySelector('.token-zone'), target=card.querySelector('.answer-zone');
      const add=(obj,zone)=>{const b=document.createElement('button');b.className='token';b.textContent=obj.t;b.dataset.id=obj.id;b.onclick=()=>{const to=b.parentElement===source?target:source;to.appendChild(b);state.orders=state.orders||{};state.orders[i]=[...target.children].map(x=>Number(x.dataset.id));save();};zone.appendChild(b)};
      remaining.forEach(x=>add(x,source)); saved.forEach(id=>add({t:ans[id],id},target));
      card.querySelector('.check-order').onclick=()=>{const ids=[...target.children].map(x=>Number(x.dataset.id));const ok=ids.length===ans.length&&ids.every((id,idx)=>id===idx);const f=card.querySelector('.feedback');f.textContent=ok?'✓ Correct question structure.':'Not quite yet. Check the auxiliary, subject and main verb.';f.className='feedback '+(ok?'good':'bad');state.orderCorrect=state.orderCorrect||{};state.orderCorrect[i]=ok;save();updateScores();};
      card.querySelector('.reset-order').onclick=()=>{state.orders=state.orders||{};state.orders[i]=[];state.orderCorrect=state.orderCorrect||{};state.orderCorrect[i]=false;save();renderOrders();updateScores();};
      root.appendChild(card);
    });
  } renderOrders();

  // Listening
  const listening=[
    {title:'A house inspection has changed',script:"Hey, just a quick heads-up: the inspection's been moved from Tuesday morning to Wednesday at half past four. The agent asked us to make sure the kitchen and shared areas are tidy, and someone needs to be home to let her in. I can leave work early if you can't make it.",qs:[
      {q:'When is the inspection now?',a:'Wednesday at 4:30 pm',opts:['Tuesday morning','Wednesday at 4:30 pm','Wednesday morning']},
      {q:'What needs to be done?',a:'Tidy the kitchen and shared areas',opts:['Pay the agent','Tidy the kitchen and shared areas','Leave the house empty']},
      {q:'What is the speaker offering to do?',a:'Leave work early',opts:['Cancel the inspection','Leave work early','Clean the whole house alone']}
    ]},
    {title:'A transport update',script:"Just letting you know the ferry's running about twenty minutes late because of the strong winds. If you're heading into the city, you might be better off taking the train from the next stop. The ferry is still running, but they're warning passengers that there could be more delays later this afternoon.",qs:[
      {q:'Why is the ferry late?',a:'Strong winds',opts:['A mechanical problem','Strong winds','Too many passengers']},
      {q:'What alternative is suggested?',a:'Take the train',opts:['Take the train','Wait until tomorrow','Get a taxi']},
      {q:'What might happen later?',a:'More delays',opts:['The weather will improve','More delays','The trains will stop']}
    ]}
  ];
  function renderListening(){
    const root=$('#listeningActivities'); if(!root) return; root.innerHTML='';
    listening.forEach((a,ai)=>{const card=document.createElement('div');card.className='listening-card';card.innerHTML=`<div class="listen-top"><div><div class="qnum">AUDIO ${ai+1}</div><h3>${a.title}</h3></div><button class="audio-btn">▶ Listen</button></div><button class="micro-btn transcript-btn">Show transcript after listening</button><div class="transcript">${a.script}</div><div class="listen-questions"></div><div class="feedback overall"></div>`;
      card.querySelector('.audio-btn').onclick=()=>speak(a.script,.92);card.querySelector('.transcript-btn').onclick=e=>{const tr=card.querySelector('.transcript');tr.classList.toggle('show');e.target.textContent=tr.classList.contains('show')?'Hide transcript':'Show transcript';};
      const qroot=card.querySelector('.listen-questions');a.qs.forEach((q,qi)=>{const d=document.createElement('div');d.className='listen-q';d.innerHTML=`<strong>${qi+1}. ${q.q}</strong>`;shuffle(q.opts).forEach(op=>{const lab=document.createElement('label');lab.innerHTML=`<input type="radio" name="listen-${ai}-${qi}" value="${op}"> ${op}`;const inp=lab.querySelector('input'); if(state.listening?.[ai]?.[qi]===op)inp.checked=true;inp.onchange=()=>{state.listening=state.listening||{};state.listening[ai]=state.listening[ai]||{};state.listening[ai][qi]=op;save();scoreListening(card,ai);};d.appendChild(lab)});qroot.appendChild(d)});scoreListening(card,ai);root.appendChild(card);});
  }
  function scoreListening(card,ai){let answered=0,correct=0;listening[ai].qs.forEach((q,qi)=>{const v=state.listening?.[ai]?.[qi];if(v){answered++;if(v===q.a)correct++;}});const f=card.querySelector('.overall');if(answered){f.textContent=`${correct}/${listening[ai].qs.length} correct${answered<listening[ai].qs.length?' so far':''}.`;f.className='feedback overall '+(correct===listening[ai].qs.length?'good':'');}updateProgress();}
  renderListening();

  // Vocabulary
  const vocab=[
    ['Conversation','to elaborate','développer / préciser','to add useful detail to an idea','Could you elaborate on what you mean by “a flexible trip”?'],
    ['Conversation','to rephrase','reformuler','to express the same idea in a different way','Let me rephrase that more clearly.'],
    ['Conversation','to clarify','clarifier','to make something easier to understand','Could you clarify what the landlord means?'],
    ['Conversation','a follow-up question','une question de relance','a question that develops what someone has just said','A good follow-up question keeps the conversation moving.'],
    ['Conversation','to get your point across','faire passer son idée','to communicate an idea successfully','Even if the sentence was not perfect, you got your point across.'],
    ['Travel','to travel around','voyager à travers','to move through different parts of a place','We’d like to travel around Australia for several months.'],
    ['Travel','a backpacker','un routard / voyageur en sac à dos','someone travelling independently on a limited or flexible budget','We met several backpackers in the shared kitchen.'],
    ['Travel','to make the most of','profiter au maximum de','to use an opportunity as well as possible','We want to make the most of our time in Australia.'],
    ['Travel','to settle in','prendre ses marques / s’installer','to become comfortable in a new place','It took a few weeks to settle in.'],
    ['Travel','to figure out','trouver / comprendre / résoudre','to understand or solve something','We’ll figure out the route once we arrive.'],
    ['Australia','a share house','une colocation','a home shared by several unrelated people','A share house can be a practical option when you first arrive.'],
    ['Australia','a bond','une caution locative','money paid as security when renting','How much bond do we need to pay?'],
    ['Australia','an inspection','une visite / inspection du logement','an official visit to check a rental property','The agent has moved the inspection to Wednesday.'],
    ['Australia','a roster','un planning de travail','a schedule showing who works and when','My roster changes every week.'],
    ['Australia','a shift','un service / créneau de travail','a scheduled period of work','I’ve got an early shift tomorrow.'],
    ['Australia','a suburb','une banlieue / quartier périphérique','a residential area outside or around a city centre','We’re looking at suburbs with good public transport.'],
    ['Australia','utilities','charges / services essentiels','electricity, water, gas and similar household services','Are utilities included in the rent?'],
    ['Natural English','to be used to','avoir l’habitude de','to be accustomed to something','I’m used to adapting when I travel.'],
    ['Natural English','used to + verb','avait l’habitude de','describes a past habit or state that is no longer true','I used to plan every detail before a trip.'],
    ['Natural English','to look forward to','avoir hâte de','to feel pleased and excited about something in the future','I’m really looking forward to living abroad.'],
    ['Natural English','to end up','finir par / se retrouver','to finally be in a situation, often unexpectedly','We might end up staying longer in one city.'],
    ['Natural English','to be worth it','valoir le coup','to justify the time, money or effort required','The long journey was tiring, but it was worth it.'],
    ['Natural English','eventually','finalement / à terme','in the end, after some time; not “éventuellement”','We eventually found a place that suited us.'],
    ['Natural English','actually','en fait','used to correct, contrast or give the real situation; not “actuellement”','Actually, we haven’t decided where we’ll live first.']
  ];
  const cats=[...new Set(vocab.map(v=>v[0]))]; cats.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;$('#vocabFilter').appendChild(o)});
  function renderVocab(){const cat=$('#vocabFilter').value,q=$('#vocabSearch').value.trim().toLowerCase();const root=$('#vocabList');root.innerHTML='';vocab.filter(v=>(cat==='all'||v[0]===cat)&&(!q||v.join(' ').toLowerCase().includes(q))).forEach(v=>{const d=document.createElement('article');d.className='vocab-item';d.innerHTML=`<div class="vocab-head"><div><div class="vocab-cat">${v[0]}</div><strong>${v[1]}</strong></div><button class="micro-btn">Listen</button></div><div class="vocab-fr">${v[2]}</div><p>${v[3]}</p><p class="example">“${v[4]}”</p>`;d.querySelector('button').onclick=()=>speak(`${v[1]}. ${v[4]}`,.9);root.appendChild(d)});}
  if($('#vocabFilter')) $('#vocabFilter').onchange=renderVocab; if($('#vocabSearch')) $('#vocabSearch').oninput=renderVocab; renderVocab();

  // Writing word count
  const updateWords=()=>{if(!$('#writingTask')||!$('#wordCount')) return; const t=$('#writingTask').value.trim();$('#wordCount').textContent=`${t?t.split(/\s+/).length:0} words`;};$('#writingTask')?.addEventListener('input',updateWords);updateWords();

  function updateScores(){
    const g=grammar.reduce((n,it,i)=>n+(state.grammar?.[i]===it.a?1:0),0);$('#grammarScore').textContent=`${g} / ${grammar.length}`;
    const o=orders.reduce((n,x,i)=>n+(state.orderCorrect?.[i]?1:0),0);$('#orderScore').textContent=`${o} / ${orders.length}`;
  } updateScores();

  function completion(){
    const checks=['welcome-understood','roadmap-seen','profile-complete','intro-done','precision-discussed','story-done','listening-done','mission-done'];
    let done=checks.filter(k=>state[k]).length; let total=checks.length;
    const autoG=grammar.filter((x,i)=>state.grammar?.[i]).length===grammar.length; if(autoG)done++;total++;
    const autoO=orders.filter((x,i)=>state.orderCorrect?.[i]).length===orders.length;if(autoO)done++;total++;
    return Math.round(done/total*100);
  }
  function updateProgress(){const p=completion();$('#progressText').textContent=p+'%';$('#progressBar').style.width=p+'%';renderObjectives();}
  function renderObjectives(){
    const rows=[
      ['Understand the course method & roadmap',!!state['welcome-understood']&&!!state['roadmap-seen']],
      ['Describe personal priorities & Australia goals',!!state['profile-complete']],
      ['Deliver a structured self-introduction',!!state['intro-done']],
      ['Recognise priority grammar patterns',grammar.filter((x,i)=>state.grammar?.[i]===x.a).length>=6],
      ['Form spontaneous questions accurately',orders.filter((x,i)=>state.orderCorrect?.[i]).length>=3],
      ['Control a past → present → future narrative',!!state['story-done']],
      ['Understand everyday spoken information',listening.reduce((n,a,ai)=>n+a.qs.filter((q,qi)=>state.listening?.[ai]?.[qi]===q.a).length,0)>=4],
      ['Complete the oral & written transfer mission',!!state['mission-done']]
    ];
    const root=$('#objectiveSummary'); if(!root)return; root.innerHTML=rows.map(([t,ok])=>`<div class="objective"><strong>${t}</strong><br><span>${ok?'Achieved / observed':'In progress / not completed'}</span></div>`).join('');
  }
  updateProgress();

  $('#saveProgress').onclick=()=>{save();toast('Progress saved on this browser.');};
  $('#printLesson').onclick=()=>window.print();
  $('#resetLesson').onclick=()=>{if(confirm('Reset all saved answers and notes for this lesson?')){localStorage.removeItem(KEY);location.reload();}};
  $('#downloadReport').onclick=()=>{
    const grammarCorrect=grammar.filter((x,i)=>state.grammar?.[i]===x.a).length;
    const orderCorrect=orders.filter((x,i)=>state.orderCorrect?.[i]).length;
    const listenCorrect=listening.reduce((n,a,ai)=>n+a.qs.filter((q,qi)=>state.listening?.[ai]?.[qi]===q.a).length,0);
    const teacher=k=>state[k]||'';
    const html=`<!doctype html><html><head><meta charset="utf-8"><title>Antoine — Lesson 1 Qualiopi Summary</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;color:#17353a;line-height:1.5}h1{font-family:Georgia,serif}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{border:1px solid #ccd7d2;padding:10px;text-align:left}th{background:#eef4f1}.box{background:#f7f4ed;padding:15px;margin:14px 0;border-left:4px solid #2d7c7e}small{color:#667}</style></head><body><h1>Lesson 1 — Getting to Know Each Other</h1><p><strong>Learner:</strong> Antoine Caille<br><strong>Pathway:</strong> 19 hours · B1.2+ → B2.1- · VTest<br><strong>Generated:</strong> ${new Date().toLocaleString()}</p><table><tr><th>Evidence</th><th>Result</th></tr><tr><td>Grammar recognition</td><td>${grammarCorrect}/${grammar.length}</td></tr><tr><td>Question building</td><td>${orderCorrect}/${orders.length}</td></tr><tr><td>Listening comprehension</td><td>${listenCorrect}/${listening.reduce((n,a)=>n+a.qs.length,0)}</td></tr><tr><td>Lesson completion</td><td>${completion()}%</td></tr></table><h2>Manual evaluation</h2><table><tr><td>Oral fluency</td><td>${teacher('teacher-fluency')||'—'}/5</td></tr><tr><td>Grammatical control</td><td>${teacher('teacher-control')||'—'}/5</td></tr><tr><td>Range & naturalness</td><td>${teacher('teacher-range')||'—'}/5</td></tr><tr><td>Writing clarity & organisation</td><td>${teacher('teacher-writing')||'—'}/5</td></tr></table><div class="box"><strong>Strengths observed</strong><p>${teacher('teacher-strengths')||'—'}</p></div><div class="box"><strong>Patterns to revisit</strong><p>${teacher('teacher-patterns')||'—'}</p></div><div class="box"><strong>Recommended focus for Lesson 2</strong><p>${teacher('teacher-next')||'—'}</p></div><p><small>Methods used: guided conversation, structured speaking builder, QCM, word order, listening comprehension, oral transfer, writing production, self-assessment and trainer observation.</small></p></body></html>`;
    const blob=new Blob([html],{type:'text/html'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Antoine_Lesson_1_Qualiopi_Summary.html';a.click();URL.revokeObjectURL(url);toast('Qualiopi summary downloaded.');
  };
})();
