(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORAGE = 'mahria_interview_atelier_01_v2';
  let state = {persist:{}, checks:{}, scores:{}, manual:{}};
  let interviewMode = false;
  let mediaStream = null;
  let mediaRecorder = null;
  let mediaChunks = [];
  let recordInterval = null;
  let recordSeconds = 0;
  let currentRecruiter = 0;

  const roleData = [
    {need:'Complex diary management', detail:'Semester-level visibility + daily agility', evidence:'Cartier: complex executive diaries and strategic prioritisation.', models:[
      'I have experience managing complex executive diaries.',
      'At Cartier, I managed complex diaries and coordinated strategic meetings while adapting to changing priorities.',
      'My recent experience required both forward planning and daily agility, which is directly relevant to managing two senior leaders.'
    ]},
    {need:'Travel & events', detail:'Meetings, trips, travel and team events A–Z', evidence:'International flights, hotels, visas, seminars and métier events.', models:[
      'I organise meetings, travel and events.',
      'I have organised international travel, including flights, hotels and visas, as well as seminars and internal events.',
      'I am used to coordinating executive logistics end to end, from travel and accommodation to stakeholder communication and event delivery.'
    ]},
    {need:'Executive documents', detail:'Presentations, notes, minutes, communications', evidence:'Cartier: executive presentations, notes and meeting minutes.', models:[
      'I prepare presentations and meeting notes.',
      'I regularly prepared executive presentations, notes and meeting minutes for senior management.',
      'I am comfortable turning operational information into clear executive documents and ensuring that actions and decisions are properly followed up.'
    ]},
    {need:'Collective life', detail:'Seminars, celebrations, moments of connection', evidence:'Multiple seminars and events; annual supplier meetings.', models:[
      'I have organised seminars and events.',
      'Event coordination is one of my strengths, and I have organised seminars for internal teams and external partners.',
      'I enjoy creating well-structured events that support both operational objectives and team cohesion.'
    ]},
    {need:'Transversal coordination', detail:'Work across functions and with other support roles', evidence:'Cartier/Chloé: CODIR, studio, operational teams, suppliers.', models:[
      'I work with different teams.',
      'I am used to coordinating with senior leaders, operational teams, suppliers and support functions.',
      'Transversal coordination is a central part of my experience: I create visibility, follow up actions and keep stakeholders aligned around shared priorities.'
    ]},
    {need:'Anticipation & discretion', detail:'React quickly and anticipate before needs are expressed', evidence:'New-director onboarding; service mindset; proactive profile.', models:[
      'I am organised and I like to anticipate.',
      'I am particularly recognised for my organisation, discretion and ability to anticipate needs.',
      'My working style is proactive: I try to identify what will be needed next, prepare it early and protect the manager’s time and confidential information.'
    ]}
  ];

  const vocabData = [
    ['Organisation','anticipate','anticiper','to identify a need before it is expressed','I try to anticipate conflicts before they affect the diary.'],
    ['Organisation','prioritise','prioriser','to decide what is most urgent or important','I prioritise according to urgency, impact and deadlines.'],
    ['Organisation','complex diary','agenda complexe','an executive calendar with many competing constraints','I have managed complex executive diaries at Cartier.'],
    ['Organisation','reschedule','reprogrammer','to move a meeting or event to another time','I reschedule quickly and communicate the change clearly.'],
    ['Coordination','stakeholder','partie prenante / interlocuteur','a person or group involved in a project or decision','I coordinate with internal and external stakeholders.'],
    ['Coordination','liaise with','faire le lien avec','to communicate and coordinate between people or teams','I liaise with suppliers, teams and senior management.'],
    ['Coordination','follow up','faire le suivi','to check progress after an action or request','I follow up actions after executive meetings.'],
    ['Coordination','transversal coordination','coordination transverse','coordination across different teams or functions','Transversal coordination was central to my roles at Cartier and Chloé.'],
    ['Travel','travel arrangements','organisation des déplacements','flights, hotels, transfers, visas and related logistics','I manage international travel arrangements from A to Z.'],
    ['Travel','itinerary','itinéraire / programme de voyage','the detailed plan for a trip','I prepare a clear itinerary for each business trip.'],
    ['Travel','accommodation','hébergement','a hotel or other place to stay','I book accommodation according to the manager’s preferences.'],
    ['Executive support','meeting minutes','compte rendu','a written record of discussions and decisions','I prepare meeting minutes and follow-up actions.'],
    ['Executive support','executive presentation','présentation de direction','a presentation prepared for senior leaders','I prepare and format executive presentations.'],
    ['Executive support','confidential','confidentiel','requiring discretion and restricted access','I handle confidential information with discretion.'],
    ['Executive support','service mindset','sens du service','a habit of making work easier for others','A strong service mindset is essential in executive support.'],
    ['Strengths','proactive','proactive','acting before being asked','I am proactive and I try to identify the next need early.'],
    ['Strengths','reliable','fiable','someone others can trust to deliver','My managers know they can rely on me.'],
    ['Strengths','agile','agile / adaptable','able to adapt quickly when priorities change','I remain agile when several priorities change at the same time.'],
    ['Luxury / footwear','footwear','chaussure','shoes and the business of designing or producing them','The position is within the Footwear métier.'],
    ['Luxury / footwear','collection','collection','a set of products developed for a season','The métier works on several collections each year.'],
    ['Luxury / footwear','supplier','fournisseur','a company that provides goods or services','I have experience coordinating with international suppliers.'],
    ['Luxury / footwear','development','développement','the process of turning ideas into products or projects','The role supports both industrial and development activities.']
  ];

  const collocations = [
    ['manage','a complex diary'],['coordinate','stakeholders'],['anticipate','needs'],['organise','international travel'],['prepare','executive documents'],['follow up','actions']
  ];

  const tenseQuestions = [
    {q:'I ___ as an Executive Assistant for more than ten years.', opts:['worked','have worked','work'], a:'have worked', why:'The experience started in the past and is connected to your career today.'},
    {q:'In 2025, I ___ at Cartier International.', opts:['worked','have worked','work'], a:'worked', why:'A finished, dated past experience uses the past simple.'},
    {q:'In my roles, I usually ___ several priorities at the same time.', opts:['manage','managed','have managed'], a:'manage', why:'A current professional habit uses the present simple.'},
    {q:'I ___ international travel, seminars and executive meetings throughout my career.', opts:['have organised','organised','organise yesterday'], a:'have organised', why:'Career experience accumulated until now uses the present perfect.'},
    {q:'When the new director arrived, I ___ her onboarding and initial agenda.', opts:['organised','have organised','organise'], a:'organised', why:'This is a specific finished event in the past.'},
    {q:'I ___ discretion and service essential in executive support.', opts:['consider','considered last year','have consider'], a:'consider', why:'This is a current professional belief.'},
    {q:'At Chloé, I ___ collection meetings and planning.', opts:['coordinated','have coordinated since','coordinate now'], a:'coordinated', why:'The Chloé assignment is presented as a finished past experience.'},
    {q:'I ___ in several demanding environments, so I adapt quickly to different working styles.', opts:['have worked','worked yesterday','am work'], a:'have worked', why:'The first clause summarises accumulated experience that supports a present conclusion.'}
  ];

  const fillItems = [
    {before:'I have worked as an assistant ', after:' more than ten years.', answers:['for'], rule:'for + duration'},
    {before:'I have worked in executive support ', after:' 2013.', answers:['since'], rule:'since + starting point'},
    {before:'My interview is ', after:' 24 August.', answers:['on'], rule:'on + date'},
    {before:'The meeting starts ', after:' 10 a.m.', answers:['at'], rule:'at + clock time'},
    {before:'I worked at Cartier ', after:' 2025.', answers:['in'], rule:'in + year'},
    {before:'I am ', after:' Executive Assistant with more than ten years of experience.', answers:['an'], rule:'an before a vowel sound'},
    {before:'I worked ', after:' Chloé on several assignments.', answers:['at'], rule:'work at + company'},
    {before:'I am interested ', after:' this position because the responsibilities match my experience.', answers:['in'], rule:'interested in'}
  ];

  const orderItems = [
    ['I','have worked','as an Executive Assistant','for more than ten years'],
    ['At Cartier','I managed','complex diaries','and strategic meetings'],
    ['I am particularly recognised for','my organisation','and my ability to anticipate'],
    ['When priorities change','I reassess','urgency and impact','before reorganising the schedule'],
    ['One example that comes to mind is','the onboarding','of a new director','at Cartier'],
    ['I am now looking for','a new opportunity','where I can support','two senior leaders']
  ];

  const rescueQuestions = [
    {q:'You do not know the word “dubbing”. What is the best response?',opts:['Sorry, my English is bad.','It was an activity where teams created new dialogue for cartoon characters.','I cannot explain it.'],a:1,why:'Paraphrase the concept with simple words and continue.'},
    {q:'You need three seconds to think.',opts:['That’s an interesting question. Let me think about the best example.','Wait.','I don’t know.'],a:0,why:'A professional time-buying phrase keeps the interaction natural.'},
    {q:'The recruiter’s question is unclear.',opts:['If I understand correctly, you’re asking how I manage priorities?','Can you say French?','Never mind.'],a:0,why:'Check your understanding by reformulating the question.'},
    {q:'Your sentence becomes too complicated halfway through.',opts:['Continue even if nobody can follow.','Stop speaking completely.','Let me put that another way.'],a:2,why:'Restart with a simpler sentence.'},
    {q:'You make a small grammar mistake but your meaning is clear.',opts:['Correct it five times.','Continue your answer.','Apologise for your level.'],a:1,why:'Communication and evidence matter more than interrupting yourself for every small error.'}
  ];

  const recruiterQs = [
    {q:'What were your main responsibilities at Cartier?',fr:'Quelles étaient vos principales responsabilités chez Cartier ?',hint:'Choose 3–4 relevant responsibilities. Do not list everything. End with the skill this developed.',models:[
      'I managed diaries, meetings, travel and executive documents.',
      'At Cartier, I managed complex diaries, strategic meetings, international travel and executive documents. I also supported seminars and onboarding.',
      'My Cartier role combined day-to-day executive support with transversal coordination: complex scheduling, CODIR meetings, international travel, executive documentation, seminars and onboarding.'
    ]},
    {q:'Why are you interested in this position?',fr:'Pourquoi ce poste vous intéresse-t-il ?',hint:'Role challenge + direct match + environment. Avoid saying only “challenging”.',models:[
      'I am interested because the role matches my experience and I would support two senior managers.',
      'I am interested because the responsibilities are very close to what I already do well: organisation, prioritisation, travel, events and executive support. Supporting two directors would also be a motivating next step.',
      'The position appeals to me because it combines the areas where I add the most value—anticipation, executive coordination and service—with the added complexity of supporting two leaders in an international luxury métier.'
    ]},
    {q:'Why should we hire you?',fr:'Pourquoi devrions-nous vous recruter ?',hint:'Experience + evidence + working style + benefit to them.',models:[
      'You should hire me because I have more than ten years of experience and I am organised, reliable and proactive.',
      'I believe I am a strong match because I have more than ten years of Executive Assistant experience, including luxury-sector roles. I already manage complex diaries, travel, meetings and events, and I am recognised for organisation, service and anticipation.',
      'I can bring immediately relevant executive-support experience together with a working style built around anticipation, discretion and reliability. My background at Cartier and Chloé means I understand demanding luxury environments, and I am comfortable creating structure around senior leaders when priorities move quickly.'
    ]},
    {q:'How do you manage changing priorities?',fr:'Comment gérez-vous des priorités qui changent ?',hint:'Assess urgency → impact → deadline → clarify → communicate.',models:[
      'I check what is most urgent and reorganise the agenda.',
      'I first assess urgency, business impact and deadlines. If necessary, I clarify priorities with the managers, then I reorganise the schedule and inform the people affected.',
      'I keep a clear view of both urgency and impact. When priorities conflict, I clarify the decision point quickly, protect the most critical commitments and communicate changes early so that stakeholders can adapt.'
    ]},
    {q:'Can you give me an example of your ability to anticipate?',fr:'Pouvez-vous donner un exemple de votre capacité d’anticipation ?',hint:'Use the new-director onboarding story: prepare before arrival → agenda → meetings → training → result.',models:[
      'When a new director joined Cartier, I prepared her agenda and meetings before she arrived.',
      'When a new director joined Cartier, I prepared her arrival in advance. I organised her initial agenda, key meetings, training and travel so that she could become operational quickly.',
      'A strong example is the onboarding of a new director at Cartier. I anticipated the information, relationships and logistics she would need from day one, then built a structured agenda around key stakeholders, training and operational priorities. This helped create a smooth transition and I received very positive feedback.'
    ]},
    {q:'What would you like to improve professionally?',fr:'Qu’aimeriez-vous améliorer professionnellement ?',hint:'Real point + self-awareness + action. Asking for help earlier is a strong example.',models:[
      'I would like to ask for help earlier when a situation needs escalation.',
      'I am very autonomous, and sometimes I try to resolve a problem alone for too long. I have learned that escalating earlier can be more efficient when another person has the authority needed.',
      'One development area is knowing when autonomy should become escalation. I naturally try to solve problems independently, but I have learned that involving the right decision-maker earlier can protect time and accelerate resolution. I now assess that threshold more consciously.'
    ]},
    {q:'Where do you see yourself in five years?',fr:'Où vous voyez-vous dans cinq ans ?',hint:'Direction + skills + contribution. You do not need a precise title.',models:[
      'In five years, I would like to be a stronger Executive Assistant in an international company.',
      'In five years, I would like to have developed even stronger expertise as an Executive Assistant, with more responsibility in an international environment and greater confidence working in English.',
      'In five years, I would like to have deepened my expertise in senior executive support while taking on broader coordination responsibilities. I want to keep growing in an international luxury environment and become fully confident operating in English with internal and external stakeholders.'
    ]},
    {q:'How would you support two senior managers at the same time?',fr:'Comment assisteriez-vous deux dirigeants en même temps ?',hint:'Understand styles → shared visibility → anticipate conflicts → clarify priorities → communicate.',models:[
      'I would understand each manager’s priorities and organise both diaries carefully.',
      'I would first understand each manager’s priorities and working style. I would keep clear visibility over both diaries, anticipate conflicts and clarify urgent priorities when necessary.',
      'Supporting two senior leaders requires both structure and judgement. I would create clear visibility across both calendars, learn each leader’s decision-making and communication preferences, anticipate conflicts early and use transparent prioritisation so that neither person feels that support is reactive.'
    ]}
  ];

  const manualObjectives = [
    ['Professional introduction','Speaking','Deliver a clear 60–90 second introduction'],
    ['Career evidence','Speaking','Connect Cartier/Chloé experience to target role'],
    ['Fluency & recovery','Speaking','Continue after hesitation using rescue strategies'],
    ['Pronunciation & presence','Speaking','Clear, understandable delivery with controlled pace'],
    ['Handwritten cue strategy','Learning method','Use keywords rather than memorised script']
  ];

  const autoMeta = {
    vocabCollocations:{label:'Professional collocations',mode:'Click to place',max:6},
    tenseQcm:{label:'Tense selection',mode:'QCM',max:8},
    fillGrammar:{label:'Grammar completion',mode:'Fill in',max:8},
    wordOrder:{label:'Professional word order',mode:'Click to place',max:6},
    rescueQcm:{label:'Communication recovery',mode:'QCM',max:5}
  };

  function loadState(){
    try{ const s=JSON.parse(localStorage.getItem(STORAGE)); if(s) state={persist:{},checks:{},scores:{},manual:{},...s}; }catch(e){}
  }
  function saveState(){
    $$('[data-persist]').forEach(el=>state.persist[el.dataset.persist]=el.value);
    $$('[data-persist-check]').forEach(el=>state.persist[el.dataset.persistCheck]=el.checked);
    state.trainerComments=$('#trainerComments')?.value||'';
    state.evalDate=$('#evaluationDate')?.value||'';
    try{ localStorage.setItem(STORAGE,JSON.stringify(state)); }catch(e){ /* UI still works if storage is blocked */ }
  }
  function restorePersist(){
    $$('[data-persist]').forEach(el=>{ if(state.persist && state.persist[el.dataset.persist]!==undefined) el.value=state.persist[el.dataset.persist]; });
    $$('[data-persist-check]').forEach(el=>{ if(state.persist && state.persist[el.dataset.persistCheck]!==undefined) el.checked=!!state.persist[el.dataset.persistCheck]; });
    if($('#trainerComments')) $('#trainerComments').value=state.trainerComments||'';
  }
  function toast(msg){ const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._to);t._to=setTimeout(()=>t.classList.remove('show'),2200); }
  function shuffle(arr){ const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
  function speak(text){
    if(!('speechSynthesis' in window)){toast('Text-to-speech is not supported in this browser.');return;}
    speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=$('#voiceAccent').value; const voices=speechSynthesis.getVoices(); const match=voices.find(v=>v.lang===u.lang)||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2))); if(match)u.voice=match; u.rate=.92;speechSynthesis.speak(u);
  }
  function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function renderRole(){
    $('#roleGrid').innerHTML=roleData.map((r,i)=>`<article class="role-card"><span class="target">TARGET NEED ${String(i+1).padStart(2,'0')}</span><h3>${r.need}</h3><p>${r.detail}</p><p class="evidence">Your evidence: ${r.evidence}</p><button type="button" class="role-model-btn" data-role-model="${i}">Model phrase · 3 levels</button><div class="role-models" id="roleModel${i}" hidden>${r.models.map((m,j)=>`<p><b>${['Safe','Interview-ready','Stronger'][j]}:</b> ${m}</p>`).join('')}</div></article>`).join('');
  }

  function renderVocab(){
    const cats=['All',...new Set(vocabData.map(v=>v[0]))];
    $('#vocabFilters').innerHTML=cats.map((c,i)=>`<button class="filter-btn ${i===0?'active':''}" type="button" data-vcat="${esc(c)}">${c}</button>`).join('');
    drawVocab('All');
  }
  function drawVocab(cat){
    const items=cat==='All'?vocabData:vocabData.filter(v=>v[0]===cat);
    const root=$('#vocabGrid');
    root.innerHTML=items.map((v,i)=>`<article class="vocab-card" tabindex="0" role="button" aria-label="Flip vocabulary card for ${esc(v[1])}" aria-pressed="false">
      <div class="vocab-inner">
        <div class="vocab-face vocab-front">
          <div class="vocab-card-top"><span class="vocab-cat">${esc(v[0])}</span><span class="flip-cue">Flip ↻</span></div>
          <div class="vocab-word">${esc(v[1])}</div>
          <p class="fr-vocab translation fr">${esc(v[2])}</p>
          <small>Tap or press Enter to reveal the definition and interview example.</small>
          <button class="vocab-audio" type="button" data-speak="${esc(v[1]+'. '+v[4])}" aria-label="Listen to ${esc(v[1])}">▶</button>
        </div>
        <div class="vocab-face vocab-back">
          <div class="vocab-card-top"><span class="vocab-cat">${esc(v[2])}</span><span class="flip-cue">Back ↺</span></div>
          <p class="definition">${esc(v[3])}</p>
          <p class="vocab-example"><b>Interview:</b> “${esc(v[4])}”</p>
          <button class="vocab-audio" type="button" data-speak="${esc(v[4])}" aria-label="Listen to the example for ${esc(v[1])}">▶</button>
        </div>
      </div>
    </article>`).join('');
    $$('.vocab-card',root).forEach(card=>{
      const flip=()=>{card.classList.toggle('flipped');card.setAttribute('aria-pressed',String(card.classList.contains('flipped')));};
      card.addEventListener('click',e=>{if(e.target.closest('.vocab-audio'))return;flip();});
      card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('.vocab-audio')){e.preventDefault();flip();}});
    });
  }

  function setScore(key,score,max,answered=max){
    state.scores[key]={score,max,answered}; saveState(); updateExerciseSummary(); renderEvaluation(); updateOverallProgress();
  }

  function renderCollocations(){
    let selectedVerb=null; let usedV=new Set(), usedN=new Set(); let correct=0, attempts=0;
    const verbs=shuffle(collocations.map((p,i)=>({text:p[0],i})));
    const nouns=shuffle(collocations.map((p,i)=>({text:p[1],i})));
    const root=$('#collocationExercise');
    root.innerHTML=`<div class="collocation-board"><div class="collocation-column verbs"></div><div class="collocation-column nouns"></div></div><div class="collocation-results"></div><button type="button" class="secondary-btn reset-colloc">Reset exercise</button>`;
    const vcol=$('.verbs',root), ncol=$('.nouns',root), results=$('.collocation-results',root);
    verbs.forEach(v=>{const b=document.createElement('button');b.className='collocation-token';b.type='button';b.textContent=v.text;b.onclick=()=>{if(usedV.has(v.i))return;$$('.collocation-token',vcol).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selectedVerb=v;};vcol.appendChild(b)});
    nouns.forEach(n=>{const b=document.createElement('button');b.className='collocation-token';b.type='button';b.textContent=n.text;b.onclick=()=>{if(!selectedVerb){toast('Choose a verb first.');return;} if(usedN.has(n.i))return; attempts++; const ok=selectedVerb.i===n.i; const chip=document.createElement('span');chip.className='pair-chip '+(ok?'good':'bad');chip.textContent=selectedVerb.text+' '+n.text+(ok?' ✓':' ✗');results.appendChild(chip); if(ok){correct++;usedV.add(selectedVerb.i);usedN.add(n.i);[...vcol.children].find(x=>x.textContent===selectedVerb.text).disabled=true;b.disabled=true; toast('Correct collocation.');} else {toast('Not quite — try another noun phrase.');}
      $('#vocabCollocationScore').textContent=`${correct} / 6`;setScore('vocabCollocations',correct,6,usedV.size);$$('.collocation-token',vcol).forEach(x=>x.classList.remove('selected'));selectedVerb=null;};ncol.appendChild(b)});
    $('.reset-colloc',root).onclick=()=>{state.scores.vocabCollocations={score:0,max:6};saveState();renderCollocations();updateExerciseSummary();renderEvaluation();};
    const prior=state.scores.vocabCollocations?.score||0;$('#vocabCollocationScore').textContent=`${prior} / 6`;
  }

  function renderQcm(rootId,scoreId,key,data){
    const root=$(rootId); root.innerHTML=''; let answered=0,score=0;
    data.forEach((q,qi)=>{
      const wrap=document.createElement('div');wrap.className='quiz-item';wrap.innerHTML=`<p>${qi+1}. ${q.q}</p><div class="quiz-options"></div><div class="feedback"></div>`;
      shuffle(q.opts.map((text,i)=>({text,i}))).forEach(o=>{const b=document.createElement('button');b.type='button';b.className='quiz-option';b.textContent=o.text;b.onclick=()=>{if(wrap.dataset.done)return;wrap.dataset.done='1';answered++;const correctIndex=typeof q.a==='number'?q.a:q.opts.indexOf(q.a);if(o.i===correctIndex){score++;b.classList.add('correct');$('.feedback',wrap).className='feedback good';$('.feedback',wrap).textContent='✓ Correct — '+q.why;}else{b.classList.add('wrong');const correctText=q.opts[correctIndex];$$('.quiz-option',wrap).find(x=>x.textContent===correctText)?.classList.add('correct');$('.feedback',wrap).className='feedback bad';$('.feedback',wrap).textContent='✗ Not quite. Correct: '+correctText+' — '+q.why;}$(scoreId).textContent=`${score} / ${data.length}`;setScore(key,score,data.length,answered);};$('.quiz-options',wrap).appendChild(b)});root.appendChild(wrap);
    });
    const prior=state.scores[key]?.score||0;$(scoreId).textContent=`${prior} / ${data.length}`;
  }

  function renderFill(){
    const root=$('#fillGrammar');root.innerHTML='';
    const results=fillItems.map(()=>({attempted:false,correct:false}));
    const sync=()=>{const score=results.filter(x=>x.correct).length;const answered=results.filter(x=>x.attempted).length;$('#fillScore').textContent=`${score} / ${fillItems.length}`;setScore('fillGrammar',score,fillItems.length,answered);};
    fillItems.forEach((item,i)=>{
      const row=document.createElement('div');row.className='fill-item live-fill';
      row.innerHTML=`<div class="fill-sentence">${i+1}. ${item.before}<b>_____</b>${item.after}</div><div class="live-input-wrap"><input aria-label="Answer ${i+1}" autocomplete="off" placeholder="Type here"><span class="live-status" aria-hidden="true"></span></div><button type="button" class="check-btn">Check now</button><div class="fill-feedback" aria-live="polite"></div>`;
      const input=$('input',row),btn=$('button',row),fb=$('.fill-feedback',row),status=$('.live-status',row);let timer=null;
      const validate=(force=false)=>{clearTimeout(timer);const raw=input.value.trim(),val=raw.toLowerCase();input.classList.remove('is-correct','is-wrong');status.className='live-status';if(!raw){results[i]={attempted:false,correct:false};fb.className='fill-feedback';fb.textContent='';status.textContent='';sync();return;}const ok=item.answers.map(x=>x.toLowerCase()).includes(val);results[i]={attempted:true,correct:ok};if(ok){input.classList.add('is-correct');status.classList.add('good');status.textContent='✓';fb.className='fill-feedback good';fb.textContent='✓ Correct — '+item.rule;}else{input.classList.add('is-wrong');status.classList.add('bad');status.textContent='×';fb.className='fill-feedback bad';fb.textContent=force?`✗ Not quite — ${item.rule}. Try again.`:`Not quite yet — ${item.rule}. Keep editing.`;}sync();};
      input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>validate(false),550);});input.addEventListener('blur',()=>validate(false));input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();validate(true);}});btn.onclick=()=>validate(true);root.appendChild(row);
    });
    $('#fillScore').textContent=`0 / ${fillItems.length}`;
  }

  function renderWordOrder(){
    const root=$('#wordOrderExercise');root.innerHTML='';const states=orderItems.map(()=>({attempted:false,correct:false}));
    const sync=()=>{const score=states.filter(x=>x.correct).length;const answered=states.filter(x=>x.attempted).length;$('#wordOrderScore').textContent=`${score} / ${orderItems.length}`;setScore('wordOrder',score,orderItems.length,answered);};
    orderItems.forEach((tokens,i)=>{
      const item=document.createElement('div');item.className='order-item';const shuffled=shuffle(tokens.map((t,idx)=>({t,idx})));
      item.innerHTML=`<p><b>${i+1}.</b> Build the sentence.</p><div class="token-bank" aria-label="Word bank"></div><div class="answer-bank" aria-label="Your sentence"><span class="answer-placeholder">Your sentence appears here…</span></div><div class="order-controls"><button type="button" class="check-btn">Check sentence</button><button type="button" class="secondary-btn order-reset">Reset & retry</button><span class="order-feedback" aria-live="polite"></span></div>`;
      const bank=$('.token-bank',item),ans=$('.answer-bank',item),fb=$('.order-feedback',item),check=$('.check-btn',item),reset=$('.order-reset',item);
      const invalidate=()=>{if(states[i].attempted||states[i].correct){states[i]={attempted:false,correct:false};sync();}check.classList.remove('correct','wrong');fb.className='order-feedback';fb.textContent='';};
      const updatePlaceholder=()=>{const ph=$('.answer-placeholder',ans);if(ph)ph.hidden=ans.querySelectorAll('.word-token').length>0;};
      shuffled.forEach(obj=>{const b=document.createElement('button');b.type='button';b.className='word-token';b.textContent=obj.t;b.dataset.idx=obj.idx;b.title='Click to move this chunk';b.onclick=()=>{invalidate();if(b.parentElement===bank){ans.appendChild(b);b.classList.add('placed');}else{bank.appendChild(b);b.classList.remove('placed');}updatePlaceholder();};bank.appendChild(b);});
      check.onclick=()=>{const placed=$$('.word-token',ans);if(placed.length!==tokens.length){toast('Place all chunks first.');return;}const built=placed.map(b=>b.textContent);const ok=built.every((t,idx)=>t===tokens[idx]);states[i]={attempted:true,correct:ok};check.classList.remove('correct','wrong');if(ok){check.classList.add('correct');fb.className='order-feedback good';fb.textContent='✓ Correct — recruiter-ready word order.';}else{check.classList.add('wrong');fb.className='order-feedback bad';fb.textContent='✗ Not quite. Click any chunk to move it back, rearrange, and check again.';}sync();};
      reset.onclick=()=>{states[i]={attempted:false,correct:false};const all=[...ans.querySelectorAll('.word-token'),...bank.querySelectorAll('.word-token')];shuffle(all).forEach(b=>{bank.appendChild(b);b.classList.remove('placed');});check.classList.remove('correct','wrong');fb.className='order-feedback';fb.textContent='';updatePlaceholder();sync();};root.appendChild(item);
    });
    $('#wordOrderScore').textContent=`0 / ${orderItems.length}`;
  }

  function buildAnswer(){
    const h=$('#bHeadline').value.trim(), e=$('#bExperience').value.trim(), r=$('#bResponsibilities').value.trim(), s=$('#bStrengths').value.trim(), n=$('#bNext').value.trim();
    const parts=[];if(h)parts.push(h.endsWith('.')?h:h+'.');if(e)parts.push(e.endsWith('.')?e:e+'.');if(r)parts.push(r.endsWith('.')?r:r+'.');if(s)parts.push(s.endsWith('.')?s:s+'.');if(n)parts.push(n.endsWith('.')?n:n+'.');
    const text=parts.join(' ');const out=$('#answerOutput');out.textContent=text||'Add your key ideas first.';out.classList.toggle('empty',!text);$('#wordCount').textContent=(text?text.split(/\s+/).length:0)+' words';state.persist.builtAnswer=text;saveState();
  }

  function showRecruiter(index){
    currentRecruiter=index;const q=recruiterQs[index];$('#questionCounter').textContent=`${index+1} / ${recruiterQs.length}`;$('#recruiterQuestion').textContent=q.q;$('#recruiterFr').textContent=q.fr;$('#questionHint').textContent=q.hint;$('#questionHint').hidden=true;$('#questionModels').hidden=true;$('#questionModels').innerHTML=q.models.map((m,i)=>`<div class="level"><b>${['Safe & clear','Interview-ready','Stronger professional'][i]}</b><p>${m}</p><button class="listen-btn compact" type="button" data-speak="${esc(m)}">▶ Listen</button></div>`).join('');
  }

  function presenceText(){
    const get=k=>$(`[data-persist="${k}"]`)?.value||'';
    return `MAHRIA LAKAF — EXECUTIVE PRESENCE CARD\n\nMY HEADLINE\n${get('successHeadline')}\n\nMY PROOF POINTS\n1. ${get('successProof1')}\n2. ${get('successProof2')}\n3. ${get('successProof3')}\n\nMY STRENGTHS\n${get('successStrengths')}\n\nMY RECOVERY PHRASE\n${get('successRecovery')}\n\nMY REMINDER\n${get('successReminder')}\n\nClear · Relevant · Structured · Specific · Natural`;
  }

  async function enableCamera(){
    try{mediaStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});$('#cameraPreview').srcObject=mediaStream;$('#cameraPlaceholder').style.display='none';$('#startRecording').disabled=false;$('#recordStatus').textContent='Camera + microphone ready';toast('Camera ready.');}catch(e){toast('Camera/microphone permission was not granted.');$('#recordStatus').textContent='Camera unavailable';}
  }
  function startRecording(){
    if(!mediaStream)return;mediaChunks=[];let options={};if(MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus'))options.mimeType='video/webm;codecs=vp9,opus';mediaRecorder=new MediaRecorder(mediaStream,options);mediaRecorder.ondataavailable=e=>{if(e.data.size)mediaChunks.push(e.data)};mediaRecorder.onstop=()=>{const blob=new Blob(mediaChunks,{type:mediaRecorder.mimeType||'video/webm'});const url=URL.createObjectURL(blob);$('#recordedVideo').src=url;$('#recordedVideo').hidden=false;$('#cameraPreview').hidden=true;$('#downloadRecording').href=url;$('#downloadRecording').classList.remove('disabled-link');$('#recordStatus').textContent='Recording saved locally';};mediaRecorder.start();recordSeconds=0;$('#recordDot').classList.add('live');$('#recordStatus').textContent='Recording';$('#startRecording').disabled=true;$('#stopRecording').disabled=false;recordInterval=setInterval(()=>{recordSeconds++;$('#recordTimer').textContent=`${String(Math.floor(recordSeconds/60)).padStart(2,'0')}:${String(recordSeconds%60).padStart(2,'0')}`;},1000);
  }
  function stopRecording(){if(mediaRecorder&&mediaRecorder.state!=='inactive')mediaRecorder.stop();clearInterval(recordInterval);$('#recordDot').classList.remove('live');$('#startRecording').disabled=false;$('#stopRecording').disabled=true;}

  function statusFromScore(score,max,answered=0){if(!answered)return ['Non commencé',''];if(answered<max)return [`En cours · ${answered}/${max}`,'status-auto-progress'];const pct=max?Math.round(score/max*100):0;if(pct>=80)return ['Acquis','status-auto-acquired'];if(pct>=50)return ['En cours d’acquisition','status-auto-progress'];return ['Non acquis','status-auto-not'];}
  function renderEvaluation(){
    if(!$('#evaluationRows'))return;
    $('#autoScoreGrid').innerHTML=Object.entries(autoMeta).map(([k,m])=>{const rec=state.scores[k]||{};const sc=rec.score||0,ans=rec.answered||0;const acc=ans?Math.round(sc/ans*100):0;return `<div class="auto-score-card"><small>${m.mode}</small><strong>${sc} correct</strong><span>${m.label} · ${ans}/${m.max} completed${ans?` · ${acc}% accuracy`:''}</span></div>`}).join('');
    const body=$('#evaluationRows');body.innerHTML='';
    Object.entries(autoMeta).forEach(([k,m])=>{const rec=state.scores[k]||{};const sc=rec.score||0,ans=rec.answered||0;const [status,cls]=statusFromScore(sc,m.max,ans);const acc=ans?Math.round(sc/ans*100):0;const tr=document.createElement('tr');tr.innerHTML=`<td><b>${m.label}</b></td><td>${m.mode} · automatic</td><td class="auto-result">${sc} correct / ${ans} answered · ${ans}/${m.max} completed${ans?` · ${acc}% current accuracy`:''}</td><td class="${cls}">${status}</td><td>Immediate feedback + hint/rule available</td>`;body.appendChild(tr);});
    manualObjectives.forEach((o,i)=>{const saved=state.manual[i]||{status:'not-started',comment:''};const tr=document.createElement('tr');tr.dataset.manual=i;tr.innerHTML=`<td><b>${o[0]}</b><br><small>${o[2]}</small></td><td>${o[1]} · trainer observation</td><td>Manual</td><td><select><option value="not-started">Non commencé</option><option value="progress">En cours d’acquisition</option><option value="achieved">Acquis</option><option value="not-achieved">Non acquis</option></select></td><td><textarea rows="2" placeholder="Evidence / observation"></textarea></td>`;const sel=$('select',tr),ta=$('textarea',tr);sel.value=saved.status;ta.value=saved.comment;sel.onchange=()=>{state.manual[i]={status:sel.value,comment:ta.value};saveState();updateEvalStatus();};ta.oninput=()=>{state.manual[i]={status:sel.value,comment:ta.value};saveState();};body.appendChild(tr);});
    updateEvalStatus();
  }
  function updateEvalStatus(){
    let total=0,earned=0,answered=0;Object.entries(autoMeta).forEach(([k,m])=>{total+=m.max;const rec=state.scores[k]||{};earned+=rec.score||0;answered+=rec.answered||0;});const pct=answered?Math.round(earned/answered*100):0;$('#autoAccuracy').value=(answered?`${pct}% · ${answered}/${total} completed`:'0%');
    const manual=Object.values(state.manual||{});const evaluated=manual.filter(x=>x.status&&x.status!=='not-started');const achieved=evaluated.filter(x=>x.status==='achieved').length;let status='Non commencé';if(answered){status=answered<total?`Exercices en cours · ${answered}/${total}`:(pct>=80?'Acquis sur exercices auto-corrigés':pct>=50?'En cours d’acquisition':'À retravailler');}if(evaluated.length)status+=` · Oral ${achieved}/${evaluated.length} acquis`;$('#evalStatus').textContent=status;
  }
  function updateExerciseSummary(){
    let score=0,max=0;Object.entries(autoMeta).forEach(([k,m])=>{score+=state.scores[k]?.score||0;max+=m.max;});$('#exerciseScore').textContent=`Exercises ${score} / ${max}`;
  }
  function updateOverallProgress(){
    const cps=$$('.checkpoint');const done=cps.filter(c=>c.classList.contains('done')).length;const exerciseDone=Object.keys(autoMeta).filter(k=>(state.scores[k]?.answered||0)>=autoMeta[k].max).length;const totalUnits=cps.length+Object.keys(autoMeta).length;const complete=done+exerciseDone;const pct=totalUnits?Math.round(complete/totalUnits*100):0;$('#lessonProgress').style.width=pct+'%';$('#progressPct').textContent=pct+'%';
  }
  function reportText(){
    let total=0,earned=0,answered=0;const autoLines=Object.entries(autoMeta).map(([k,m])=>{const rec=state.scores[k]||{};const sc=rec.score||0,ans=rec.answered||0;total+=m.max;earned+=sc;answered+=ans;const [status]=statusFromScore(sc,m.max,ans);const acc=ans?Math.round(sc/ans*100):0;return `${m.label} — ${m.mode}: ${sc} correct / ${ans} answered · ${ans}/${m.max} completed${ans?` · ${acc}% accuracy`:''} — ${status}`;}).join('\n');
    const manualLines=manualObjectives.map((o,i)=>{const x=state.manual[i]||{status:'not-started',comment:''};const label={achieved:'Acquis',progress:'En cours d’acquisition','not-achieved':'Non acquis','not-started':'Non commencé'}[x.status]||x.status;return `${o[0]} — ${label}${x.comment?' — '+x.comment:''}`}).join('\n');
    return `BILAN D'ÉVALUATION DES ACQUIS — MAHRIA LAKAF\nLesson 1 · Executive Assistant Interview Atelier\nDate: ${$('#evaluationDate').value}\nTrainer: ${$('#trainerName').value}\n\nAUTO-GRADED EXERCISES\n${autoLines}\n\nAutomatic accuracy: ${answered?Math.round(earned/answered*100):0}% (${answered}/${total} items completed)\n\nSPEAKING / MANUAL OBSERVATION\n${manualLines}\n\nConfidence start: ${$('#confidenceStart').value}/10\nConfidence end: ${$('#confidenceEnd').value}/10\n\nGeneral trainer observations:\n${$('#trainerComments').value}`;
  }

  function initDate(){ if(!$('#evaluationDate').value){const d=new Date();$('#evaluationDate').value=d.toISOString().slice(0,10);} }
  function updateRanges(){['Start','End'].forEach(s=>{const input=$(`#confidence${s}`),out=$(`#confidence${s}Out`);if(input&&out){out.textContent=input.value+'/10';input.oninput=()=>{out.textContent=input.value+'/10';saveState();};}});}

  function bindGeneral(){
    document.addEventListener('click',e=>{
      const speakBtn=e.target.closest('[data-speak]');if(speakBtn){speak(speakBtn.dataset.speak);return;}
      const copyModel=e.target.closest('[data-copy-model]');if(copyModel){navigator.clipboard.writeText(copyModel.dataset.copyModel||'').then(()=>toast('Model answer copied.')).catch(()=>toast('Copy unavailable in this browser.'));return;}
      const model=e.target.closest('[data-model]');if(model){const el=document.getElementById(model.dataset.model);if(el)el.hidden=!el.hidden;return;}
      const hint=e.target.closest('[data-hint]');if(hint){const el=document.getElementById(hint.dataset.hint);if(el)el.hidden=!el.hidden;return;}
      const role=e.target.closest('[data-role-model]');if(role){const el=$(`#roleModel${role.dataset.roleModel}`);el.hidden=!el.hidden;return;}
      const checkpoint=e.target.closest('.checkpoint-btn');if(checkpoint){const wrap=checkpoint.closest('.checkpoint'),key=wrap.dataset.checkpoint;state.checks[key]=!state.checks[key];wrap.classList.toggle('done',state.checks[key]);checkpoint.textContent=state.checks[key]?'Completed ✓':'Mark section complete';wrap.querySelector('span').textContent=state.checks[key]?'Saved':'';saveState();updateOverallProgress();return;}
      const f=e.target.closest('[data-vcat]');if(f){$$('[data-vcat]').forEach(x=>x.classList.remove('active'));f.classList.add('active');drawVocab(f.dataset.vcat);return;}
      const chip=e.target.closest('.expression-chip');if(chip){const el=$(`[data-persist="${chip.dataset.insertTarget}"]`);if(el){el.value=chip.dataset.text;saveState();toast('Expression added.');}return;}
    });
    document.addEventListener('input',e=>{if(e.target.matches('[data-persist]'))saveState();});
    document.addEventListener('change',e=>{if(e.target.matches('[data-persist-check]'))saveState();});

    $('#modeToggle').onclick=()=>{interviewMode=!interviewMode;document.body.classList.toggle('interview-mode',interviewMode);$('#modeToggle').textContent=interviewMode?'Interview mode':'Coach mode';$('#modeToggle').setAttribute('aria-pressed',String(interviewMode));toast(interviewMode?'Interview mode: support hidden':'Coach mode: support restored');};
    $('#translationToggle').onclick=()=>{document.body.classList.toggle('translation-hidden');const hidden=document.body.classList.contains('translation-hidden');$('#translationToggle').textContent=hidden?'FR support OFF':'FR support ON';$('#translationToggle').setAttribute('aria-pressed',String(!hidden));};

    $$('.model-tab').forEach(btn=>btn.onclick=()=>{$$('.model-tab').forEach(b=>b.classList.remove('active'));$$('.model-tab-content').forEach(c=>c.classList.remove('active'));btn.classList.add('active');$('#'+btn.dataset.levelTarget).classList.add('active');});

    $('#buildAnswer').onclick=buildAnswer;$('#clearBuilder').onclick=()=>{['bHeadline','bExperience','bResponsibilities','bStrengths','bNext'].forEach(id=>{$('#'+id).value='';});buildAnswer();saveState();};
    $('#listenBuilt').onclick=()=>speak($('#answerOutput').textContent);$('#copyBuilt').onclick=async()=>{await navigator.clipboard.writeText($('#answerOutput').textContent);toast('Draft copied.');};

    $('#newQuestion').onclick=()=>{let n=currentRecruiter;while(n===currentRecruiter)n=Math.floor(Math.random()*recruiterQs.length);showRecruiter(n);};$('#showQHint').onclick=()=>$('#questionHint').hidden=!$('#questionHint').hidden;$('#showQModels').onclick=()=>$('#questionModels').hidden=!$('#questionModels').hidden;$('#listenQuestion').onclick=()=>speak(recruiterQs[currentRecruiter].q);

    $('#copyPresence').onclick=async()=>{await navigator.clipboard.writeText(presenceText());toast('Presence card copied.');};
    $('#downloadPresence').onclick=()=>downloadText('mahria-executive-presence-card.txt',presenceText(),'text/plain');
    $('#printPresence').onclick=()=>window.print();

    $('#startCamera').onclick=enableCamera;$('#startRecording').onclick=startRecording;$('#stopRecording').onclick=stopRecording;

    $('#saveProgress').onclick=()=>{saveState();$('#reportPreview').textContent=reportText();toast('Progress saved locally.');};
    $('#copyReport').onclick=async()=>{const t=reportText();await navigator.clipboard.writeText(t);$('#reportPreview').textContent=t;toast('Progress report copied.');};
    $('#downloadReport').onclick=()=>{const text=reportText();const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mahria Lakaf — Lesson 1 Progress</title><style>*{box-sizing:border-box}body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;max-width:940px;margin:0 auto;padding:56px clamp(24px,7vw,80px);line-height:1.65;background:#f5f1ea;color:#171512;overflow-wrap:anywhere}body:before{content:"";display:block;height:8px;background:#f37021;margin:-56px calc(-1 * clamp(24px,7vw,80px)) 44px}h1{font-family:Georgia,serif;font-size:42px;font-weight:400;letter-spacing:-.03em;margin:0 0 28px}.report{background:#fffdf9;border:1px solid #ded6cc;border-radius:22px;padding:28px;box-shadow:0 18px 60px rgba(45,34,26,.08);white-space:normal}.line{margin:.18rem 0}.section-gap{height:18px}</style><h1>Mahria Lakaf — Lesson 1 Progress</h1><div class="report">${esc(text).split('\n').map(line=>line?`<div class="line">${line}</div>`:'<div class="section-gap"></div>').join('')}</div>`;downloadText('mahria-lesson-1-progress.html',html,'text/html');};
    $('#printReport').onclick=()=>{$('#reportPreview').textContent=reportText();window.print();};
    $('#resetAll').onclick=()=>{if(confirm('Reset all saved Lesson 1 progress on this browser?')){try{localStorage.removeItem(STORAGE);}catch(e){} location.reload();}};
    $('#trainerComments').oninput=saveState;
  }

  function downloadText(filename,text,type){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  function restoreChecks(){Object.entries(state.checks||{}).forEach(([k,v])=>{if(!v)return;const wrap=$(`[data-checkpoint="${k}"]`);if(wrap){wrap.classList.add('done');$('.checkpoint-btn',wrap).textContent='Completed ✓';$('span',wrap).textContent='Saved';}});}

  function init(){
    loadState();renderRole();renderVocab();renderCollocations();renderQcm('#tenseQuiz','#tenseScore','tenseQcm',tenseQuestions);renderFill();renderWordOrder();renderQcm('#rescueQuiz','#rescueScore','rescueQcm',rescueQuestions);restorePersist();restoreChecks();showRecruiter(0);renderEvaluation();initDate();updateRanges();bindGeneral();updateExerciseSummary();updateOverallProgress();
    if(state.persist.builtAnswer){$('#answerOutput').textContent=state.persist.builtAnswer;$('#answerOutput').classList.remove('empty');$('#wordCount').textContent=state.persist.builtAnswer.split(/\s+/).length+' words';}
    $('#reportPreview').textContent=reportText();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
